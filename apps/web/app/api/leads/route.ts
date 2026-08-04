import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { getBrochurePublicUrl } from '@/lib/brochures';
import { getMailFrom, getNotificationRecipients, leadNotificationMail } from '@/lib/mail';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// Email is optional: callback requests typically come with phone only
// (lower friction). Server still requires AT LEAST one contact channel.
const leadSchema = z
  .object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email().or(z.literal('')).optional(),
    phone: z.string().regex(/^\+?[0-9\s\-()]{8,20}$/).or(z.literal('')).optional(),
    programSlug: z.string().min(1),
    source: z.string().default('direct'),
    medium: z.string().default('website'),
    campaign: z.string().default('organic'),
    consentGiven: z.boolean(),
  })
  .refine((d) => (d.email && d.email.length > 0) || (d.phone && d.phone.length > 0), {
    message: 'At least one of email or phone is required',
    path: ['phone'],
  });

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await rateLimit(`leads:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let data;
  try {
    data = leadSchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  if (!data.consentGiven) {
    return NextResponse.json({ error: 'consent_required' }, { status: 400 });
  }

  const brochureUrl = getBrochurePublicUrl(data.programSlug);
  let leadId: string | number | null = null;

  // 1. Persist to CMS (non-blocking for brochure downloads)
  try {
    const cmsRes = await fetch(`${process.env.CMS_API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.CMS_API_TOKEN
          ? { Authorization: `Bearer ${process.env.CMS_API_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        ...data,
        status: 'new',
        consentTimestamp: new Date().toISOString(),
      }),
    });
    if (cmsRes.ok) {
      const created = await cmsRes.json();
      leadId = created?.doc?.id ?? created?.id ?? null;
    } else if (data.source !== 'brochure') {
      return NextResponse.json({ error: 'persist_failed' }, { status: 502 });
    } else {
      console.error('[leads] CMS persist failed for brochure lead:', cmsRes.status);
    }
  } catch (err) {
    if (data.source !== 'brochure') {
      return NextResponse.json({ error: 'persist_failed' }, { status: 502 });
    }
    console.error('[leads] CMS persist error:', err);
  }

  // 2. Notify admissions team
  const recipients = getNotificationRecipients();
  if (process.env.RESEND_API_KEY && recipients.length > 0) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const mail = leadNotificationMail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || undefined,
      phone: data.phone || undefined,
      programSlug: data.programSlug,
      source: data.source,
    });
    const { error } = await resend.emails.send({
      from: getMailFrom(),
      to: recipients,
      subject: `Nouveau lead — ${data.programSlug}`,
      html: mail.html,
      text: mail.text,
    });
    if (error) console.error('[leads] resend error:', error);
  }

  // 3. Fire-and-forget CRM webhook
  if (process.env.NOTION_WEBHOOK_URL) {
    fetch(process.env.NOTION_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => null);
  }

  return NextResponse.json({ id: leadId, brochureUrl }, { status: 201 });
}

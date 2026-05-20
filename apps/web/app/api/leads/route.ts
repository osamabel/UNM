import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
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

  // 1. Persist to CMS
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

  if (!cmsRes.ok) {
    return NextResponse.json({ error: 'persist_failed' }, { status: 502 });
  }
  const created = await cmsRes.json();

  // 2. Notify admissions team
  if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFICATION_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'UNM <noreply@unm.ma>',
      to: process.env.LEAD_NOTIFICATION_EMAIL,
      subject: `Nouveau lead — ${data.programSlug}`,
      text: `Lead reçu :\n\n${JSON.stringify(data, null, 2)}`,
    }).catch(() => null);
  }

  // 3. Fire-and-forget CRM webhook
  if (process.env.NOTION_WEBHOOK_URL) {
    fetch(process.env.NOTION_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => null);
  }

  return NextResponse.json(
    { id: created?.doc?.id ?? null, brochureUrl: created?.doc?.brochureUrl ?? null },
    { status: 201 },
  );
}

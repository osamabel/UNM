import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { getMailFrom, getNotificationRecipients, callbackNotificationMail } from '@/lib/mail';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\+?[0-9\s\-()]{8,15}$/),
  slot: z.enum(['morning', 'afternoon', 'evening']),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await rateLimit(`cb:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  let data;
  try {
    data = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }
  const recipients = getNotificationRecipients();
  if (process.env.RESEND_API_KEY && recipients.length > 0) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const mail = callbackNotificationMail(data);
    const { error } = await resend.emails.send({
      from: getMailFrom(),
      to: recipients,
      subject: `Demande de rappel — ${data.name}`,
      html: mail.html,
      text: mail.text,
    });
    if (error) {
      console.error('[callback] resend error:', error);
      return NextResponse.json({ error: 'email_failed', detail: error }, { status: 502 });
    }
  }
  return NextResponse.json({ ok: true });
}

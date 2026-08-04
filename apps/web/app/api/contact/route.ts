import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { getMailFrom, getNotificationRecipients, contactNotificationMail } from '@/lib/mail';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const schema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1).max(150),
  message: z.string().min(10).max(2000),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
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
    const mail = contactNotificationMail(data);
    const { error } = await resend.emails.send({
      from: getMailFrom(),
      to: recipients,
      reply_to: data.email,
      subject: `Contact — ${data.subject}`,
      html: mail.html,
      text: mail.text,
    });
    if (error) {
      console.error('[contact] resend error:', error);
      return NextResponse.json({ error: 'email_failed', detail: error }, { status: 502 });
    }
  }
  return NextResponse.json({ ok: true });
}

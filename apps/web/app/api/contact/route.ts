import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
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
  if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFICATION_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails
      .send({
        from: 'UNM <noreply@unm.ma>',
        to: process.env.LEAD_NOTIFICATION_EMAIL,
        reply_to: data.email,
        subject: `Contact — ${data.subject}`,
        text: `${data.firstName} ${data.lastName} (${data.email})\n\n${data.message}`,
      })
      .catch(() => null);
  }
  return NextResponse.json({ ok: true });
}

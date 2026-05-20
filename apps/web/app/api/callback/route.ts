import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
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
  if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFICATION_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails
      .send({
        from: 'UNM <noreply@unm.ma>',
        to: process.env.LEAD_NOTIFICATION_EMAIL,
        subject: `Demande de rappel — ${data.name}`,
        text: `${data.name} demande à être rappelé sur ${data.phone} (créneau ${data.slot}).`,
      })
      .catch(() => null);
  }
  return NextResponse.json({ ok: true });
}

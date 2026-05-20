import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await rateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let data;
  try {
    data = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  // Forward to CMS or Resend audience
  await fetch(`${process.env.CMS_API_URL}/newsletter-subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.CMS_API_TOKEN
        ? { Authorization: `Bearer ${process.env.CMS_API_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({ email: data.email, source: 'website' }),
  }).catch(() => null);

  return NextResponse.json({ ok: true });
}

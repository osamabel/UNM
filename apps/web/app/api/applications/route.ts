import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getMailFrom, getNotificationRecipients, applicationNotificationMail } from '@/lib/mail';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { PHONE_VALUE_RE } from '@/lib/phone-countries';

export const runtime = 'nodejs';

const REQUIRED = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'country',
  'highestDegree',
  'experienceLevel',
  'programSlug',
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await rateLimit(`apps:${ip}`, 3, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const formData = await req.formData();

  for (const k of REQUIRED) {
    if (!formData.get(k)) {
      return NextResponse.json({ error: `missing:${k}` }, { status: 400 });
    }
  }
  if (formData.get('consentGiven') !== 'true') {
    return NextResponse.json({ error: 'consent_required' }, { status: 400 });
  }

  const email = String(formData.get('email'));
  const phone = String(formData.get('phone'));
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  if (!PHONE_VALUE_RE.test(phone)) {
    return NextResponse.json({ error: 'invalid_phone' }, { status: 400 });
  }

  const programSlug = String(formData.get('programSlug'));
  const cmsBase = process.env.CMS_API_URL;
  if (!cmsBase) {
    return NextResponse.json({ error: 'cms_unconfigured' }, { status: 500 });
  }

  const authHeaders: HeadersInit = process.env.CMS_API_TOKEN
    ? { Authorization: `Bearer ${process.env.CMS_API_TOKEN}` }
    : {};

  const programRes = await fetch(
    `${cmsBase}/programs?where[slug][equals]=${encodeURIComponent(programSlug)}&limit=1`,
    { headers: authHeaders, next: { revalidate: 0 } },
  );
  if (!programRes.ok) {
    return NextResponse.json({ error: 'program_lookup_failed' }, { status: 502 });
  }
  const programData = (await programRes.json()) as { docs?: { id: string }[] };
  const programId = programData.docs?.[0]?.id;
  if (!programId) {
    return NextResponse.json({ error: 'program_not_found' }, { status: 400 });
  }

  const payload = {
    firstName: String(formData.get('firstName')),
    lastName: String(formData.get('lastName')),
    email,
    phone,
    country: String(formData.get('country')),
    highestDegree: String(formData.get('highestDegree')),
    experienceLevel: String(formData.get('experienceLevel')),
    program: programId,
    consentGiven: true,
  };

  const cmsRes = await fetch(`${cmsBase}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify(payload),
  });
  if (!cmsRes.ok) {
    return NextResponse.json({ error: 'persist_failed' }, { status: 502 });
  }
  const created = await cmsRes.json();

  const recipients = getNotificationRecipients();
  if (process.env.RESEND_API_KEY && recipients.length > 0) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const mail = applicationNotificationMail({
      firstName: String(payload.firstName),
      lastName: String(payload.lastName),
      email: String(payload.email),
      phone: String(payload.phone),
      country: String(payload.country),
      programSlug,
      highestDegree: String(payload.highestDegree),
      experienceLevel: String(payload.experienceLevel),
    });
    const { error } = await resend.emails.send({
      from: getMailFrom(),
      to: recipients,
      subject: `Nouvelle candidature — ${programSlug}`,
      html: mail.html,
      text: mail.text,
    });
    if (error) console.error('[applications] resend error:', error);
  }

  const id = created?.doc?.id ?? created?.id ?? null;
  const referenceId = id ? `APP-${String(id).slice(-8).toUpperCase()}` : null;
  return NextResponse.json({ id, referenceId }, { status: 201 });
}

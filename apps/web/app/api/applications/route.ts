import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set(['application/pdf', 'image/png', 'image/jpeg']);

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await rateLimit(`apps:${ip}`, 3, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const formData = await req.formData();

  const required = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'nationality',
    'highestDegree',
    'institution',
    'graduationYear',
    'field',
    'facultySlug',
    'programSlug',
    'formatPreference',
    'startDate',
  ];
  for (const k of required) {
    if (!formData.get(k)) {
      return NextResponse.json({ error: `missing:${k}` }, { status: 400 });
    }
  }
  if (formData.get('consentGiven') !== 'true') {
    return NextResponse.json({ error: 'consent_required' }, { status: 400 });
  }

  // Validate files
  const fileKeys = ['cv', 'diploma', 'motivation'] as const;
  for (const key of fileKeys) {
    const file = formData.get(key);
    if (file && file instanceof File) {
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: `file_too_large:${key}` }, { status: 400 });
      }
      if (!ALLOWED_MIME.has(file.type)) {
        return NextResponse.json({ error: `file_type:${key}` }, { status: 400 });
      }
    }
  }

  // Forward to CMS Applications collection
  const upload = new FormData();
  formData.forEach((v, k) => upload.append(k, v as any));
  const cmsRes = await fetch(`${process.env.CMS_API_URL}/applications`, {
    method: 'POST',
    headers: process.env.CMS_API_TOKEN
      ? { Authorization: `Bearer ${process.env.CMS_API_TOKEN}` }
      : undefined,
    body: upload,
  });
  if (!cmsRes.ok) {
    return NextResponse.json({ error: 'persist_failed' }, { status: 502 });
  }
  const created = await cmsRes.json();

  if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFICATION_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails
      .send({
        from: 'UNM <noreply@unm.ma>',
        to: process.env.LEAD_NOTIFICATION_EMAIL,
        subject: `Nouvelle candidature — ${formData.get('programSlug')}`,
        text: `Candidature reçue pour ${formData.get('programSlug')} de ${formData.get('firstName')} ${formData.get('lastName')} (${formData.get('email')}).`,
      })
      .catch(() => null);
    // Confirmation to applicant
    await resend.emails
      .send({
        from: 'UNM <noreply@unm.ma>',
        to: String(formData.get('email')),
        subject: 'Réception de votre candidature — UNM',
        text: `Bonjour ${formData.get('firstName')},\n\nNous avons bien reçu votre candidature. Notre équipe vous recontactera sous 48h.\n\nL'équipe UNM`,
      })
      .catch(() => null);
  }

  const id = created?.doc?.id ?? created?.id ?? null;
  const referenceId = id ? `APP-${String(id).slice(-8).toUpperCase()}` : null;
  return NextResponse.json({ id, referenceId }, { status: 201 });
}

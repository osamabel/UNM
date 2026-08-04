/** Shared Resend sender. Use a verified domain in production. */
export function getMailFrom() {
  const raw = (process.env.RESEND_FROM_EMAIL ?? 'UNM <onboarding@resend.dev>').trim();
  if (raw.includes('<') && raw.includes('>')) return raw;
  if (raw.includes('@')) return `UNM <${raw}>`;
  return 'UNM <onboarding@resend.dev>';
}

/** Comma-separated LEAD_NOTIFICATION_EMAIL → list of recipients. */
export function getNotificationRecipients() {
  return (process.env.LEAD_NOTIFICATION_EMAIL ?? '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type MailField = { label: string; value: string; href?: string };

type NotificationMailInput = {
  eyebrow: string;
  title: string;
  intro?: string;
  fields: MailField[];
  message?: string;
  cta?: { label: string; href: string };
  accent?: 'contact' | 'callback' | 'lead' | 'application';
};

const ACCENT = {
  contact: { badge: '#B5341A', soft: '#f8ebe7' },
  callback: { badge: '#8f2a15', soft: '#f6ebe6' },
  lead: { badge: '#9c3a22', soft: '#f7ece8' },
  application: { badge: '#B5341A', soft: '#f8ebe7' },
} as const;

/** Branded HTML + plain-text notification for admissions inbox. */
export function buildNotificationMail(input: NotificationMailInput) {
  const accent = ACCENT[input.accent ?? 'contact'];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';

  const fieldsHtml = input.fields
    .map((field, index) => {
      const safeLabel = escapeHtml(field.label);
      const safeValue = escapeHtml(field.value);
      const valueHtml = field.href
        ? `<a href="${escapeHtml(field.href)}" style="color:${accent.badge};text-decoration:none;font-weight:700;">${safeValue}</a>`
        : safeValue;
      const bg = index % 2 === 0 ? '#ffffff' : '#fbf7f4';
      return `
        <tr>
          <td style="padding:14px 16px;background:${bg};border-bottom:1px solid #efe4dd;width:32%;vertical-align:top;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8d6f65;font-weight:700;">${safeLabel}</p>
          </td>
          <td style="padding:14px 16px;background:${bg};border-bottom:1px solid #efe4dd;vertical-align:top;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#2b1a15;font-weight:500;">${valueHtml}</p>
          </td>
        </tr>`;
    })
    .join('');

  const messageHtml = input.message
    ? `
      <tr>
        <td colspan="2" style="padding:22px 0 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eadfd7;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:12px 16px;background:${accent.soft};border-bottom:1px solid #eadfd7;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8d6f65;font-weight:700;">Message</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 16px;background:#ffffff;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#2b1a15;white-space:pre-wrap;">${escapeHtml(input.message)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : '';

  const ctaHtml = input.cta
    ? `
      <tr>
        <td colspan="2" style="padding-top:28px;" align="left">
          <a href="${escapeHtml(input.cta.href)}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:${accent.badge};color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;box-shadow:0 10px 24px rgba(181,52,26,0.22);">
            ${escapeHtml(input.cta.label)} →
          </a>
        </td>
      </tr>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(input.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#efe8e2;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#efe8e2;padding:32px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;">
            <tr>
              <td style="padding:0 8px 16px;" align="left">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:0.04em;color:#B5341A;font-weight:700;">UNM</p>
                <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8d6f65;letter-spacing:0.04em;">Université Numérique du Maroc</p>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #e5d8cf;box-shadow:0 18px 40px rgba(70,35,22,0.08);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="height:6px;background:${accent.badge};font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="padding:28px 28px 8px;">
                      <span style="display:inline-block;padding:7px 12px;border-radius:999px;background:${accent.soft};color:${accent.badge};font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">
                        ${escapeHtml(input.eyebrow)}
                      </span>
                      <h1 style="margin:16px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:#24150f;font-weight:700;">
                        ${escapeHtml(input.title)}
                      </h1>
                      ${
                        input.intro
                          ? `<p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#6a5148;">${escapeHtml(input.intro)}</p>`
                          : ''
                      }
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:22px 28px 8px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eadfd7;border-radius:16px;overflow:hidden;">
                        ${fieldsHtml}
                      </table>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        ${messageHtml}
                        ${ctaHtml}
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf6f3;border-radius:14px;">
                        <tr>
                          <td style="padding:16px 18px;">
                            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#8d6f65;">
                              Notification automatique du site UNM.
                              <a href="${escapeHtml(siteUrl)}" style="color:${accent.badge};text-decoration:none;font-weight:700;">Voir le site</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 8px 0;" align="center">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:#9a7d73;">
                  © Université Numérique du Maroc · Ne pas répondre à cet expéditeur technique
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textLines = [
    `UNM — ${input.eyebrow}`,
    input.title,
    '',
    ...(input.intro ? [input.intro, ''] : []),
    ...input.fields.map((f) => `${f.label}: ${f.value}`),
    ...(input.message ? ['', 'Message:', input.message] : []),
    ...(input.cta ? ['', `${input.cta.label}: ${input.cta.href}`] : []),
  ];

  return { html, text: textLines.join('\n') };
}

export function contactNotificationMail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const name = `${data.firstName} ${data.lastName}`.trim();
  return buildNotificationMail({
    accent: 'contact',
    eyebrow: 'Nouveau message',
    title: data.subject,
    intro: 'Un visiteur a envoyé un message depuis le formulaire de contact UNM.',
    fields: [
      { label: 'Nom', value: name },
      { label: 'Email', value: data.email, href: `mailto:${data.email}` },
      ...(data.phone ? [{ label: 'Téléphone', value: data.phone, href: `tel:${data.phone}` }] : []),
      { label: 'Sujet', value: data.subject },
    ],
    message: data.message,
    cta: { label: 'Répondre par email', href: `mailto:${data.email}` },
  });
}

export function callbackNotificationMail(data: {
  name: string;
  phone: string;
  slot: string;
}) {
  const slotLabel =
    data.slot === 'morning' ? 'Matin' : data.slot === 'afternoon' ? 'Après-midi' : 'Soir';
  return buildNotificationMail({
    accent: 'callback',
    eyebrow: 'Demande de rappel',
    title: `${data.name} souhaite être rappelé`,
    intro: 'Une demande de rappel a été soumise depuis le site UNM.',
    fields: [
      { label: 'Nom', value: data.name },
      { label: 'Téléphone', value: data.phone, href: `tel:${data.phone}` },
      { label: 'Créneau', value: slotLabel },
    ],
    cta: { label: 'Appeler maintenant', href: `tel:${data.phone}` },
  });
}

export function leadNotificationMail(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  programSlug: string;
  source?: string;
}) {
  const name = `${data.firstName} ${data.lastName}`.trim();
  return buildNotificationMail({
    accent: 'lead',
    eyebrow: 'Nouveau lead',
    title: `Intérêt pour ${data.programSlug}`,
    intro: 'Un prospect a laissé ses coordonnées sur une page programme.',
    fields: [
      { label: 'Nom', value: name },
      ...(data.email ? [{ label: 'Email', value: data.email, href: `mailto:${data.email}` }] : []),
      ...(data.phone ? [{ label: 'Téléphone', value: data.phone, href: `tel:${data.phone}` }] : []),
      { label: 'Programme', value: data.programSlug },
      ...(data.source ? [{ label: 'Source', value: data.source }] : []),
    ],
    cta: data.email
      ? { label: 'Contacter le prospect', href: `mailto:${data.email}` }
      : data.phone
        ? { label: 'Appeler le prospect', href: `tel:${data.phone}` }
        : undefined,
  });
}

export function applicationNotificationMail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  programSlug: string;
  highestDegree?: string;
  experienceLevel?: string;
}) {
  const name = `${data.firstName} ${data.lastName}`.trim();
  return buildNotificationMail({
    accent: 'application',
    eyebrow: 'Nouvelle candidature',
    title: `Candidature — ${data.programSlug}`,
    intro: 'Une candidature vient d’être déposée sur le site UNM. Merci de la traiter rapidement.',
    fields: [
      { label: 'Nom', value: name },
      { label: 'Email', value: data.email, href: `mailto:${data.email}` },
      { label: 'Téléphone', value: data.phone, href: `tel:${data.phone}` },
      { label: 'Pays', value: data.country },
      { label: 'Programme', value: data.programSlug },
      ...(data.highestDegree ? [{ label: 'Diplôme', value: data.highestDegree }] : []),
      ...(data.experienceLevel ? [{ label: 'Expérience', value: data.experienceLevel }] : []),
    ],
    cta: { label: 'Répondre au candidat', href: `mailto:${data.email}` },
  });
}

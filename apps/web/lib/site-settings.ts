import type { Media, SiteSettings } from '@unm/types';
import { LOGO_SRC } from '@/lib/logo';
import { toPublicMediaUrl } from '@/lib/cms-media';

/** Safe defaults when CMS is unreachable (local build / downtime). */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandLogo: null,
  contact: {
    phone: '+212 6 62 62 62 19',
    whatsapp: '+212662626219',
    email: 'contact@unm-university.com',
    address: {
      fr: 'Borj Menara I, Av. Abdelkrim El Khattabi, Marrakech, Maroc',
      en: 'Borj Menara I, Av. Abdelkrim El Khattabi, Marrakech, Morocco',
    },
  },
  social: {
    linkedin: 'https://www.linkedin.com/school/unm-ma',
    facebook: 'https://www.facebook.com/unm.ma',
  },
  legal: {
    legalNotice: { fr: '', en: '' },
    privacyPolicy: { fr: '', en: '' },
  },
};

/** Digits only — for tel: and wa.me links. */
export function digitsOnly(value: string | undefined | null): string {
  return (value ?? '').replace(/[^0-9]/g, '');
}

/** Absolute or same-origin public URL for an upload, or null. */
export function mediaUrl(media?: Media | null): string | null {
  return toPublicMediaUrl(media?.url);
}

/** Brand logo from CMS Site Settings (via /cms-media), else local fallback. */
export function getBrandLogoSrc(settings?: SiteSettings | null): string {
  return mediaUrl(settings?.brandLogo) ?? LOGO_SRC;
}

export function mergeSiteSettings(partial: SiteSettings | null | undefined): SiteSettings {
  if (!partial) return DEFAULT_SITE_SETTINGS;
  return {
    brandLogo: partial.brandLogo ?? null,
    contact: {
      phone: partial.contact?.phone || DEFAULT_SITE_SETTINGS.contact.phone,
      whatsapp: partial.contact?.whatsapp || DEFAULT_SITE_SETTINGS.contact.whatsapp,
      email: partial.contact?.email || DEFAULT_SITE_SETTINGS.contact.email,
      address: {
        fr: partial.contact?.address?.fr || DEFAULT_SITE_SETTINGS.contact.address.fr,
        en: partial.contact?.address?.en || DEFAULT_SITE_SETTINGS.contact.address.en,
      },
    },
    social: {
      linkedin: partial.social?.linkedin || DEFAULT_SITE_SETTINGS.social.linkedin,
      facebook: partial.social?.facebook || DEFAULT_SITE_SETTINGS.social.facebook,
      instagram: partial.social?.instagram,
      youtube: partial.social?.youtube,
    },
    legal: {
      legalNotice: {
        fr: partial.legal?.legalNotice?.fr ?? '',
        en: partial.legal?.legalNotice?.en ?? '',
      },
      privacyPolicy: {
        fr: partial.legal?.privacyPolicy?.fr ?? '',
        en: partial.legal?.privacyPolicy?.en ?? '',
      },
    },
  };
}

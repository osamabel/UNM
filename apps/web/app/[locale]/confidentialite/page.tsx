import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { confidentialite } from '@/lib/legal';
import { localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';
  return {
    title: localized(confidentialite.metaTitle, params.locale),
    description: localized(confidentialite.metaDescription, params.locale),
    alternates: {
      canonical:
        params.locale === 'en'
          ? `${base}${confidentialite.href.en}`
          : `${base}${confidentialite.href.fr}`,
      languages: {
        fr: `${base}${confidentialite.href.fr}`,
        en: `${base}${confidentialite.href.en}`,
        'x-default': `${base}${confidentialite.href.fr}`,
      },
    },
  };
}

export default function PrivacyPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  return <LegalPage doc={confidentialite} />;
}

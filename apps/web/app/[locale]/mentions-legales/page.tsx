import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { mentionsLegales } from '@/lib/legal';
import { localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';
  return {
    title: localized(mentionsLegales.metaTitle, params.locale),
    description: localized(mentionsLegales.metaDescription, params.locale),
    alternates: {
      canonical:
        params.locale === 'en'
          ? `${base}${mentionsLegales.href.en}`
          : `${base}${mentionsLegales.href.fr}`,
      languages: {
        fr: `${base}${mentionsLegales.href.fr}`,
        en: `${base}${mentionsLegales.href.en}`,
        'x-default': `${base}${mentionsLegales.href.fr}`,
      },
    },
  };
}

export default function MentionsLegalesPage({
  params,
}: {
  params: { locale: Locale };
}) {
  unstable_setRequestLocale(params.locale);
  return <LegalPage doc={mentionsLegales} />;
}

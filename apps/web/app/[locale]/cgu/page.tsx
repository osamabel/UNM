import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { cgu } from '@/lib/legal';
import { localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';
  return {
    title: localized(cgu.metaTitle, params.locale),
    description: localized(cgu.metaDescription, params.locale),
    alternates: {
      canonical:
        params.locale === 'en' ? `${base}${cgu.href.en}` : `${base}${cgu.href.fr}`,
      languages: {
        fr: `${base}${cgu.href.fr}`,
        en: `${base}${cgu.href.en}`,
        'x-default': `${base}${cgu.href.fr}`,
      },
    },
  };
}

export default function CguPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  return <LegalPage doc={cgu} />;
}

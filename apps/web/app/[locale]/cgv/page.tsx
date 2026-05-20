import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { cgv } from '@/lib/legal';
import { localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';
  return {
    title: localized(cgv.metaTitle, params.locale),
    description: localized(cgv.metaDescription, params.locale),
    alternates: {
      canonical:
        params.locale === 'en' ? `${base}${cgv.href.en}` : `${base}${cgv.href.fr}`,
      languages: {
        fr: `${base}${cgv.href.fr}`,
        en: `${base}${cgv.href.en}`,
        'x-default': `${base}${cgv.href.fr}`,
      },
    },
  };
}

export default function CgvPage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
  return <LegalPage doc={cgv} />;
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PhotoHero } from '@/components/patterns/PhotoHero';
import { OrientationWizard } from '@/components/orientation/OrientationWizard';
import { getPrograms } from '@/lib/api';
import { PAGE_HERO_IMAGE } from '@/lib/page-heroes';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'orientation' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

function WizardSkeleton() {
  return (
    <div className="orientation-wizard animate-pulse space-y-6" aria-hidden>
      <div className="h-4 w-32 rounded bg-warm-200/80" />
      <div className="h-8 w-64 rounded bg-warm-200/80" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-12 rounded-xl bg-warm-200" />
        <div className="h-12 rounded-xl bg-warm-200" />
        <div className="h-12 rounded-xl bg-warm-200" />
        <div className="h-12 rounded-xl bg-warm-200" />
      </div>
      <div className="h-12 w-40 rounded-xl bg-warm-300" />
    </div>
  );
}

export default async function OrientationPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [programs, t, tb] = await Promise.all([
    getPrograms({ limit: 200 }),
    getTranslations({ locale: params.locale, namespace: 'orientation' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const pageUrl = isEn ? '/en/orientation' : '/orientation';

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: pageUrl },
        ]}
      />

      <PhotoHero
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        subtitle={t('heroSubtitle')}
        imageSrc={PAGE_HERO_IMAGE.orientation}
        imageAlt={
          isEn
            ? 'African executive exploring UNM Executive programmes'
            : 'Cadre africain découvrant les programmes Executive UNM'
        }
        imagePosition="center 30%"
      />

      <SectionWrapper tone="soft" className="orientation-page">
        <Suspense fallback={<WizardSkeleton />}>
          <OrientationWizard programs={programs} />
        </Suspense>
      </SectionWrapper>
    </>
  );
}

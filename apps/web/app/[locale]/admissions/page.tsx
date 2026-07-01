import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PageHeader } from '@/components/patterns/PageHeader';
import { Icon } from '@/components/ui/Icon';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { CTABanner } from '@/components/home/CTABanner';
import { getFaculties, getPrograms } from '@/lib/api';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'admissions' });
  return { title: t('title'), description: t('metaDescription') };
}

function FormSkeleton() {
  return (
    <div className="form-panel animate-pulse space-y-6 lg:col-span-1" aria-hidden>
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-warm-200/80" />
        <div className="h-8 w-48 rounded bg-warm-200/80" />
        <div className="h-1 rounded-full bg-warm-200/80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-11 rounded-xl bg-warm-200" />
        <div className="h-11 rounded-xl bg-warm-200" />
        <div className="h-11 rounded-xl bg-warm-200" />
        <div className="h-11 rounded-xl bg-warm-200" />
      </div>
      <div className="h-11 w-36 rounded-xl bg-warm-300" />
    </div>
  );
}

export default async function AdmissionsPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [faculties, programs, t, tb] = await Promise.all([
    getFaculties(),
    getPrograms({ limit: 200 }),
    getTranslations({ locale: params.locale, namespace: 'admissions' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const admissionsUrl = isEn ? '/en/admissions' : '/admissions';

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: admissionsUrl },
        ]}
      />

      <SectionWrapper tone="soft" className="!pb-10 sm:!pb-12">
        <div className="mx-auto max-w-3xl">
          <PageHeader
            icon="document"
            eyebrow={t('formEyebrow')}
            title={t('title')}
            description={t('intro')}
            className="border-0 pb-0"
          />
          <ul className="mt-6 flex flex-wrap gap-2 sm:mt-8">
            <li className="glass-pill flex items-center gap-1.5 text-xs font-medium text-secondary/75">
              <Icon name="check-circle" size={14} className="text-primary/90" />
              {t('stepsHint')}
            </li>
            <li className="glass-pill flex items-center gap-1.5 text-xs font-medium text-secondary/75">
              <Icon name="shield" size={14} className="text-primary/90" />
              {t('trustSecure')}
            </li>
            <li className="glass-pill flex items-center gap-1.5 text-xs font-medium text-secondary/75">
              <Icon name="mail" size={14} className="text-primary/90" />
              {t('trustResponse')}
            </li>
          </ul>
        </div>
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <div className="mx-auto grid min-w-0 max-w-4xl gap-8 lg:grid-cols-[1fr_minmax(0,15rem)] lg:gap-10">
          <Suspense fallback={<FormSkeleton />}>
            <ApplicationForm faculties={faculties} programs={programs} />
          </Suspense>
          <aside className="hidden lg:block">
            <div className="card-flat sticky top-32 space-y-4 p-5">
              <p className="eyebrow">{t('helpTitle')}</p>
              <p className="text-sm leading-relaxed text-secondary/65">{t('helpBody')}</p>
              <ul className="space-y-2 text-sm text-secondary/70">
                <li className="flex gap-2">
                  <Icon name="mail" size={16} className="shrink-0 text-primary/80" />
                  admissions@unm.ma
                </li>
                <li className="flex gap-2">
                  <Icon name="phone" size={16} className="shrink-0 text-primary/80" />
                  +212 6 62 62 62 19
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}

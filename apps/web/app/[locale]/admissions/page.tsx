import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { getFaculties, getPrograms } from '@/lib/api';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'admissions' });
  return { title: t('title'), description: t('metaDescription') };
}

export default async function AdmissionsPage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
  const [faculties, programs, t, tb] = await Promise.all([
    getFaculties(),
    getPrograms({ limit: 200 }),
    getTranslations({ locale: params.locale, namespace: 'admissions' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
  ]);
  const homeUrl = params.locale === 'en' ? '/en' : '/';
  const admissionsUrl = params.locale === 'en' ? '/en/admissions' : '/admissions';
  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: admissionsUrl },
        ]}
      />
      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-display-lg text-secondary">{t('title')}</h1>
          <p className="mt-3 text-secondary-400">{t('intro')}</p>
          <div className="mt-10">
            <Suspense fallback={<p className="text-secondary-400">{t('intro')}</p>}>
              <ApplicationForm faculties={faculties} programs={programs} />
            </Suspense>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}

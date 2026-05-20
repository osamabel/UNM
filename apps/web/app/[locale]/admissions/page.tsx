import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { getFaculties, getPrograms } from '@/lib/api';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return {
    title: 'Admissions',
    description:
      params.locale === 'en'
        ? 'Apply to UNM in five steps. Submit your application online.'
        : 'Candidatez à UNM en cinq étapes. Soumettez votre dossier en ligne.',
  };
}

export default async function AdmissionsPage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
  const [faculties, programs] = await Promise.all([getFaculties(), getPrograms({ limit: 200 })]);
  return (
    <>
      <Breadcrumb
        items={[
          { name: params.locale === 'en' ? 'Home' : 'Accueil', url: params.locale === 'en' ? '/en' : '/' },
          { name: 'Admissions', url: params.locale === 'en' ? '/en/admissions' : '/admissions' },
        ]}
      />
      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-display-lg text-secondary">Admissions</h1>
          <p className="mt-3 text-secondary-400">
            {params.locale === 'en'
              ? 'Complete the application in five steps. Required documents: CV, diploma, motivation letter.'
              : 'Complétez votre candidature en cinq étapes. Documents requis : CV, diplôme, lettre de motivation.'}
          </p>
          <div className="mt-10">
            <ApplicationForm faculties={faculties} programs={programs} />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}

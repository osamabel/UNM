import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { FacultyHero } from '@/components/faculty/FacultyHero';
import { ProgramsList } from '@/components/faculty/ProgramsList';
import { StrengthsSection } from '@/components/faculty/StrengthsSection';
import { FacultyCTA } from '@/components/faculty/FacultyCTA';
import { FacultyComingSoon } from '@/components/faculty/FacultyComingSoon';
import { DomainsSection } from '@/components/faculty/DomainsSection';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JsonLd } from '@/components/shared/JsonLd';
import { facultySchema } from '@/lib/schema';
import { getFaculties, getFaculty, getPrograms } from '@/lib/api';
import { facultyPath, localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export const revalidate = 300;

interface Params {
  params: { locale: Locale; slug: string };
}

export async function generateStaticParams() {
  const list = await getFaculties().catch(() => []);
  return list.flatMap((f) => [
    { locale: 'fr', slug: f.slug },
    { locale: 'en', slug: f.slug },
  ]);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const faculty = await getFaculty(params.slug);
  if (!faculty) return {};
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';
  const fr = `/facultes/${params.slug}`;
  const en = `/en/faculties/${params.slug}`;
  return {
    title: localized(faculty.metaTitle, params.locale),
    description: localized(faculty.metaDescription, params.locale),
    alternates: {
      canonical: params.locale === 'en' ? `${base}${en}` : `${base}${fr}`,
      languages: { fr: `${base}${fr}`, en: `${base}${en}`, 'x-default': `${base}${fr}` },
    },
  };
}

export default async function FacultyPage({ params }: Params) {
  unstable_setRequestLocale(params.locale);
  const faculty = await getFaculty(params.slug);
  if (!faculty) notFound();

  const breadcrumb = (
    <Breadcrumb
      items={[
        { name: params.locale === 'en' ? 'Home' : 'Accueil', url: params.locale === 'en' ? '/en' : '/' },
        { name: params.locale === 'en' ? 'Faculties' : 'Facultés', url: params.locale === 'en' ? '/en/faculties' : '/facultes' },
        { name: localized(faculty.name, params.locale), url: facultyPath(faculty.slug, params.locale) },
      ]}
    />
  );

  // Coming-soon faculties skip the full template (no programmes to list).
  if (faculty.comingSoon) {
    return (
      <>
        {breadcrumb}
        <FacultyComingSoon faculty={faculty} />
      </>
    );
  }

  const programs = await getPrograms({ faculty: params.slug });

  return (
    <>
      <JsonLd data={facultySchema(faculty, params.locale)} />
      {breadcrumb}
      <FacultyHero faculty={faculty} />
      <ProgramsList programs={programs} />
      <DomainsSection faculty={faculty} />
      <StrengthsSection faculty={faculty} />
      <FacultyCTA />
    </>
  );
}

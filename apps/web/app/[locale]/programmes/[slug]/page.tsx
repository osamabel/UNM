import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ProgramHero } from '@/components/programs/ProgramHero';
import { ProgramCurriculum } from '@/components/programs/ProgramCurriculum';
import { ProgramNarrative } from '@/components/programs/ProgramNarrative';
import { ProgramFAQ } from '@/components/programs/ProgramFAQ';
import { RelatedPrograms } from '@/components/programs/RelatedPrograms';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { BrochureDownload } from '@/components/shared/BrochureDownload';
import { CTABar } from '@/components/shared/CTABar';
import { CTABanner } from '@/components/home/CTABanner';
import { JsonLd } from '@/components/shared/JsonLd';
import { courseSchema } from '@/lib/schema';
import { getProgram, getPrograms, getRelatedPrograms } from '@/lib/api';
import { localized, programPath } from '@/lib/utils';
import type { Locale } from '@unm/types';

export const revalidate = 300;

interface Params {
  params: { locale: Locale; slug: string };
}

export async function generateStaticParams() {
  const list = await getPrograms({ limit: 200 }).catch(() => []);
  return list.flatMap((p) => [
    { locale: 'fr', slug: p.slug },
    { locale: 'en', slug: p.slug },
  ]);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const program = await getProgram(params.slug);
  if (!program) return {};
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unm.ma';
  const fr = `/programmes/${params.slug}`;
  const en = `/en/programs/${params.slug}`;
  return {
    title: `${localized(program.title, params.locale)} | UNM`,
    description: localized(program.metaDescription, params.locale),
    openGraph: {
      title: localized(program.title, params.locale),
      description: localized(program.metaDescription, params.locale),
      locale: params.locale === 'en' ? 'en_US' : 'fr_MA',
    },
    alternates: {
      canonical: params.locale === 'en' ? `${base}${en}` : `${base}${fr}`,
      languages: { fr: `${base}${fr}`, en: `${base}${en}`, 'x-default': `${base}${fr}` },
    },
  };
}

export default async function ProgramPage({ params }: Params) {
  setRequestLocale(params.locale);
  const program = await getProgram(params.slug);
  if (!program) notFound();
  const related = await getRelatedPrograms(program.faculty?.slug ?? '', program.slug);
  const isEn = params.locale === 'en';

  const L = isEn
    ? {
        obj: 'Objectives',
        objBody: 'At the end of the programme, participants will be able to:',
        audience: 'Target audience',
        audienceLabel: 'Who is this programme for',
        outlooks: 'Career outlooks',
        outlooksLabel: 'Where it leads',
        skills: 'Skills acquired',
        skillsLabel: 'What you will learn to master',
        admission: 'Admission',
        admissionLabel: 'How to apply',
      }
    : {
        obj: 'Objectifs',
        objBody: 'À l’issue du programme, les participants seront en mesure de :',
        audience: 'Public-cible',
        audienceLabel: 'À qui s’adresse ce programme',
        outlooks: 'Débouchés professionnels',
        outlooksLabel: 'Vers quels métiers',
        skills: 'Compétences acquises',
        skillsLabel: 'Ce que vous apprendrez à maîtriser',
        admission: 'Admission',
        admissionLabel: 'Comment candidater',
      };

  return (
    <>
      <JsonLd data={courseSchema(program, params.locale)} />
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          { name: isEn ? 'Programs' : 'Programmes', url: isEn ? '/en/programs' : '/programmes' },
          {
            name: localized(program.title, params.locale),
            url: programPath(program.slug, params.locale),
          },
        ]}
      />

      <ProgramHero program={program} />

      {/* Overview — same card-flat language as the rest of the site */}
      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
          {program.objectives && program.objectives.length > 0 ? (
            <ProgramNarrative eyebrow={L.obj} title={L.objBody} bullets={program.objectives} />
          ) : null}
          <ProgramNarrative
            eyebrow={L.audience}
            title={L.audienceLabel}
            body={program.targetAudience}
          />
          <ProgramNarrative
            eyebrow={L.outlooks}
            title={L.outlooksLabel}
            body={program.careerOutlooks}
          />
          <ProgramNarrative
            eyebrow={L.skills}
            title={L.skillsLabel}
            body={program.skillsNarrative}
          />
        </div>
      </SectionWrapper>

      {/* Curriculum */}
      <SectionWrapper tone="soft">
        <div className="mx-auto max-w-4xl">
          <ProgramCurriculum modules={program.curriculum} programType={program.type} />
        </div>
      </SectionWrapper>

      {/* Admission + FAQ */}
      <SectionWrapper tone="canvas">
        <div className="mx-auto max-w-3xl space-y-8 sm:space-y-10">
          <ProgramNarrative
            eyebrow={L.admission}
            title={L.admissionLabel}
            body={program.admissionRequirements}
          />
          <ProgramFAQ items={program.faq} />
        </div>
      </SectionWrapper>

      {/* Brochure */}
      <SectionWrapper tone="soft" className="!pt-10 sm:!pt-12">
        <div className="mx-auto max-w-5xl">
          <BrochureDownload
            programSlug={program.slug}
            programTitle={localized(program.title, params.locale)}
          />
        </div>
      </SectionWrapper>

      {related.length > 0 ? (
        <SectionWrapper tone="canvas">
          <RelatedPrograms programs={related} />
        </SectionWrapper>
      ) : null}

      <CTABanner />
      <CTABar programSlug={program.slug} />
    </>
  );
}

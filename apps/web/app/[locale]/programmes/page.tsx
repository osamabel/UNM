import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PhotoHero } from '@/components/patterns/PhotoHero';
import { ProgramCard } from '@/components/patterns/ProgramCard';
import { Icon } from '@/components/ui/Icon';
import { ProgramFilter } from '@/components/shared/ProgramFilter';
import { ProgramActiveFilters } from '@/components/shared/ProgramActiveFilters';
import { CTABanner } from '@/components/home/CTABanner';
import { getFaculties, getPrograms } from '@/lib/api';
import { PAGE_HERO_IMAGE } from '@/lib/page-heroes';
import { localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export const revalidate = 120;

interface Search {
  faculty?: string;
  type?: string;
  language?: string;
}

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'programsIndex' });
  return { title: t('metaTitle'), description: t('subtitle') };
}

function ActiveFiltersFallback() {
  return <div className="programs-active-fallback" aria-hidden />;
}

export default async function ProgramsIndex({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: Search;
}) {
  setRequestLocale(params.locale);
  const [faculties, programs, t, tb, tProgram] = await Promise.all([
    getFaculties(),
    getPrograms(searchParams),
    getTranslations({ locale: params.locale, namespace: 'programsIndex' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
    getTranslations({ locale: params.locale, namespace: 'program' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const programsUrl = isEn ? '/en/programs' : '/programmes';
  const facultyOptions = faculties.map((f) => ({
    slug: f.slug,
    name: localized(f.name, params.locale),
  }));
  const hasFilters = Boolean(
    searchParams.faculty || searchParams.type || searchParams.language,
  );
  const countLabel = hasFilters
    ? t('programCountFiltered', { count: programs.length })
    : t('programCount', { count: programs.length });

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: programsUrl },
        ]}
      />

      <PhotoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        imageSrc={PAGE_HERO_IMAGE.programs}
        imageAlt={
          isEn
            ? 'African executive in an UNM learning environment'
            : 'Cadre africain dans un environnement d’apprentissage UNM'
        }
        imagePosition="center 30%"
      />

      <SectionWrapper tone="soft" className="programs-index">
        <div className="programs-layout">
          <div className="programs-filter-rail" aria-label={t('filters')}>
            <ProgramFilter faculties={facultyOptions} countLabel={countLabel} />
            <Suspense fallback={<ActiveFiltersFallback />}>
              <ProgramActiveFilters faculties={facultyOptions} />
            </Suspense>
          </div>

          <div className="programs-results">
            {programs.length > 0 ? (
              <div className="programs-grid">
                {programs.map((p) => (
                  <ProgramCard
                    key={p.id}
                    program={p}
                    locale={params.locale}
                    durationLabel={tProgram('duration')}
                    formatLabel={tProgram('format')}
                    exploreLabel={t('exploreProgram')}
                  />
                ))}
              </div>
            ) : (
              <div className="programs-empty">
                <span className="programs-empty-icon" aria-hidden>
                  <Icon name="search" size={26} />
                </span>
                <p className="programs-empty-title">{t('empty')}</p>
                <p className="programs-empty-hint">{t('emptyHint')}</p>
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}

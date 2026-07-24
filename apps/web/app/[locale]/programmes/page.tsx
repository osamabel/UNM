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
  format?: string;
  language?: string;
}

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'programsIndex' });
  return { title: t('metaTitle'), description: t('subtitle') };
}

function ActiveFiltersFallback() {
  return <div className="mb-4 h-9" aria-hidden />;
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
    searchParams.faculty || searchParams.type || searchParams.format || searchParams.language,
  );

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

      <SectionWrapper tone="canvas" className="programs-index !pt-7 sm:!pt-9">
        <div className="programs-layout">
          <aside className="programs-filters">
            <div className="programs-filters-panel">
              <div className="programs-filters-head">
                <span className="icon-box h-10 w-10 shrink-0">
                  <Icon name="search" size={18} />
                </span>
                <div className="min-w-0">
                  <p className="programs-filters-title">{t('filters')}</p>
                  <p className="programs-filters-hint">{t('filtersHint')}</p>
                </div>
              </div>
              <ProgramFilter faculties={facultyOptions} />
            </div>
          </aside>

          <div className="programs-results">
            <div className="programs-toolbar">
              <p className="programs-count">
                <span className="programs-count-pill">
                  {t('programCount', { count: programs.length })}
                </span>
                {hasFilters ? (
                  <span className="programs-count-note">{t('filteredLabel')}</span>
                ) : null}
              </p>
            </div>

            <Suspense fallback={<ActiveFiltersFallback />}>
              <ProgramActiveFilters faculties={facultyOptions} />
            </Suspense>

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
              <div className="programs-empty card-flat">
                <span className="icon-box mx-auto h-14 w-14">
                  <Icon name="search" size={28} />
                </span>
                <p className="mt-5 font-display text-xl text-secondary">{t('empty')}</p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-secondary/60">
                  {t('emptyHint')}
                </p>
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}

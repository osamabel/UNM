import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PageHeader } from '@/components/patterns/PageHeader';
import { ProgramCard } from '@/components/patterns/ProgramCard';
import { Icon } from '@/components/ui/Icon';
import { ProgramFilter } from '@/components/shared/ProgramFilter';
import { ProgramActiveFilters } from '@/components/shared/ProgramActiveFilters';
import { CTABanner } from '@/components/home/CTABanner';
import { getFaculties, getPrograms } from '@/lib/api';
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
  return { title: t('metaTitle') };
}

function ActiveFiltersFallback() {
  return <div className="mb-5 h-9" aria-hidden />;
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

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: programsUrl },
        ]}
      />

      <SectionWrapper tone="soft" className="!pb-10 sm:!pb-12">
        <PageHeader
          icon="library"
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('subtitle')}
          className="border-0 pb-0"
        />
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <div className="min-w-0 lg:grid lg:grid-cols-[minmax(0,16.5rem)_1fr] lg:gap-12 xl:grid-cols-[minmax(0,18rem)_1fr] xl:gap-14">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="form-panel">
              <div className="mb-5 hidden items-center gap-3 lg:flex">
                <span className="icon-box h-10 w-10 shrink-0">
                  <Icon name="search" size={20} />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary/50">
                    {t('filters')}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-secondary/55">{t('filtersHint')}</p>
                </div>
              </div>
              <ProgramFilter faculties={facultyOptions} />
            </div>
          </aside>

          <div className="mt-8 min-w-0 lg:mt-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              {programs.length > 0 ? (
                <p className="flex items-center gap-2">
                  <span className="glass-pill text-xs font-semibold tabular-nums text-secondary/85">
                    {t('programCount', { count: programs.length })}
                  </span>
                </p>
              ) : (
                <span />
              )}
            </div>

            <Suspense fallback={<ActiveFiltersFallback />}>
              <ProgramActiveFilters faculties={facultyOptions} />
            </Suspense>

            {programs.length > 0 ? (
              <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6">
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
              <div className="card-flat px-6 py-16 text-center sm:px-10 sm:py-20">
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

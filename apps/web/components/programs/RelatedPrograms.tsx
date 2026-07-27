'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ProgramCard } from '@/components/patterns/ProgramCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import type { Locale, Program } from '@unm/types';

interface Props {
  programs: Program[];
}

export function RelatedPrograms({ programs }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  const ti = useTranslations('programsIndex');
  const tf = useTranslations('featuredPrograms');

  if (!programs?.length) return null;

  return (
    <section>
      <SectionHeader eyebrow={tf('eyebrow')} title={t('related')} />
      <ul className="mt-8 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {programs.map((p) => (
          <li key={p.id} className="min-w-0">
            <ProgramCard
              program={p}
              locale={locale}
              durationLabel={t('duration')}
              formatLabel={t('format')}
              exploreLabel={ti('exploreProgram')}
              variant="compact"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

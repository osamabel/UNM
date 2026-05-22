'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ProgramCard } from '@/components/patterns/ProgramCard';
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
      <p className="eyebrow">{tf('eyebrow')}</p>
      <h2 className="mt-3 font-display text-display-md text-secondary">{t('related')}</h2>
      <ul className="mt-6 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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

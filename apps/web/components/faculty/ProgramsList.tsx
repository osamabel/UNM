'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ProgramCard } from '@/components/patterns/ProgramCard';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import type { Locale, Program } from '@unm/types';

interface Props {
  programs: Program[];
}

export function ProgramsList({ programs }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  const tf = useTranslations('facultyPage');
  const ti = useTranslations('programsIndex');

  if (programs.length === 0) return null;

  const programsHref = locale === 'en' ? '/en/programs' : '/programmes';

  return (
    <div>
      <SectionHeader
        eyebrow={tf('eyebrow')}
        title={tf('programsTitle')}
        icon="library"
        action={{ label: tf('programsAction'), href: programsHref }}
      />
      <ul className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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
    </div>
  );
}

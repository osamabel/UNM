'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { FacultyHeroPanel } from '@/components/faculty/FacultyHeroPanel';
import type { Faculty, Locale } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  faculty: Faculty;
}

export function FacultyHero({ faculty }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('facultyPage');
  const ts = useTranslations('facultiesShowcase');
  const accent = faculty.color || '#B5341A';
  const count = faculty.programCount ?? 0;
  const programLabel = count > 1 ? ts('programPlural') : ts('programSingular');

  return (
    <section className="relative overflow-hidden border-b border-warm-150/50 bg-canvas">
      <div
        className="hero-blob -right-20 -top-16 h-64 w-64 motion-reduce:hidden"
        style={{ backgroundColor: `${accent}14` }}
        aria-hidden
      />
      <div
        className="hero-blob bottom-0 left-0 h-48 w-48 bg-secondary/[0.04] motion-reduce:hidden"
        aria-hidden
        style={{ animationDelay: '-6s' }}
      />
      <div className="hero-bg pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-page relative min-w-0 py-10 sm:py-14 lg:py-16 lg:pr-[13rem] xl:pr-[15rem]">
        <FacultyHeroPanel
          eyebrow={t('eyebrow')}
          title={localized(faculty.name, locale)}
          description={localized(faculty.description, locale)}
          accent={accent}
        >
          {count > 0 && (
            <span className="glass-pill inline-flex max-w-full text-xs font-semibold text-secondary/80">
              <Icon name="library" size={14} className="shrink-0 text-primary" />
              <span className="truncate">
                {count} {programLabel}
              </span>
            </span>
          )}
        </FacultyHeroPanel>
      </div>
    </section>
  );
}

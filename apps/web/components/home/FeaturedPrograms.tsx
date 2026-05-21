'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { displayProgramTitle, localized, programPath } from '@/lib/utils';
import type { Locale, Program } from '@unm/types';
import { cn } from '@/lib/utils';

interface Props {
  programs: Program[];
}

export function FeaturedPrograms({ programs }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const tf = useTranslations('featuredPrograms');
  const tc = useTranslations('common');

  if (programs.length === 0) return null;

  const [lead, ...rest] = programs;
  const useBento = programs.length >= 3;

  return (
    <SectionWrapper id="programmes" tone="soft">
      <ScrollReveal>
        <SectionHeader
          icon="program"
          title={t('featuredProgramsTitle')}
          description={tf('subtitle')}
          action={{
            label: tc('viewAll'),
            href: locale === 'en' ? '/en/programs' : '/programmes',
          }}
          className="!mb-8 sm:!mb-10"
        />
      </ScrollReveal>

      <ScrollReveal delay={60}>
        {useBento ? (
          <ul className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 lg:grid-rows-2 lg:gap-6">
            <li className="min-w-0 lg:col-span-7 lg:row-span-2">
              <FeaturedProgramCard program={lead} locale={locale} variant="lead" tf={tf} />
            </li>
            {rest.map((p) => (
              <li key={p.id} className="min-w-0 lg:col-span-5">
                <FeaturedProgramCard program={p} locale={locale} variant="compact" tf={tf} />
              </li>
            ))}
          </ul>
        ) : (
          <ul
            className={cn(
              'grid gap-5',
              programs.length === 2 ? 'sm:grid-cols-2' : 'max-w-2xl',
            )}
          >
            {programs.map((p) => (
              <li key={p.id}>
                <FeaturedProgramCard
                  program={p}
                  locale={locale}
                  variant={programs.length === 1 ? 'lead' : 'compact'}
                  tf={tf}
                />
              </li>
            ))}
          </ul>
        )}
      </ScrollReveal>
    </SectionWrapper>
  );
}

type FeaturedT = ReturnType<typeof useTranslations<'featuredPrograms'>>;

function FeaturedProgramCard({
  program,
  locale,
  variant,
  tf,
}: {
  program: Program;
  locale: Locale;
  variant: 'lead' | 'compact';
  tf: FeaturedT;
}) {
  const title = displayProgramTitle(localized(program.title, locale), program.type);
  const pitch = localized(program.metaDescription, locale);
  const facultyName = program.faculty
    ? localized(program.faculty.name, locale).replace(/^UNM\s+/i, '')
    : '';
  const accent = program.faculty?.color || '#B5341A';
  const isLead = variant === 'lead';

  return (
    <Link
      href={programPath(program.slug, locale)}
      className={cn(
        'card-interactive group relative flex h-full flex-col overflow-hidden',
        isLead ? 'min-h-[280px] p-8 sm:min-h-[340px] sm:p-10' : 'min-h-[200px] p-6',
      )}
    >
      {/* Faculty colour — soft glow, not a border line */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-[0.14] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.22]"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      {isLead && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--unm-canvas)]/80 to-transparent"
          aria-hidden
        />
      )}

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: `${accent}14`, color: accent }}
          >
            <Icon name="graduation" size={20} weight="medium" />
          </span>
          <Badge variant="program-type" type={program.type}>
            {program.type}
          </Badge>
        </div>
        {facultyName && (
          <span className="hidden max-w-[42%] line-clamp-2 text-right font-heading text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary/40 sm:block">
            {facultyName}
          </span>
        )}
      </div>

      <h3
        className={cn(
          'relative mt-6 font-display leading-snug text-secondary transition-colors duration-300 group-hover:text-primary',
          isLead ? 'text-2xl line-clamp-3 sm:text-[1.65rem]' : 'text-lg line-clamp-2',
        )}
      >
        {title}
      </h3>

      {pitch && (
        <p
          className={cn(
            'relative mt-3 text-secondary/60',
            isLead ? 'line-clamp-3 text-sm leading-relaxed sm:text-[15px]' : 'line-clamp-2 text-xs leading-relaxed',
          )}
        >
          {pitch}
        </p>
      )}

      <div className="relative mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
        <ul className="flex flex-wrap gap-2">
          <li
            className="inline-flex items-center gap-1.5 rounded-full border border-warm-200/60 bg-white/50 px-3 py-1 text-xs font-medium text-secondary/75 backdrop-blur-sm"
          >
            <Icon name="calendar" size={13} className="text-primary/70" />
            {program.duration}
          </li>
          <li
            className="inline-flex items-center gap-1.5 rounded-full border border-warm-200/60 bg-white/50 px-3 py-1 text-xs font-medium text-secondary/75 backdrop-blur-sm"
          >
            <Icon name="building" size={13} className="text-primary/70" />
            {program.format}
          </li>
        </ul>
        <span className="link-arrow text-xs sm:text-sm">
          {tf('explore')}
          <Icon name="arrow-right" size={15} className="btn-arrow" />
        </span>
      </div>
    </Link>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { iconForProgramFormat, iconForProgramType } from '@/lib/program-meta-icons';
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
          icon="library"
          title={t('featuredProgramsTitle')}
          description={tf('subtitle')}
          action={{
            label: tc('viewAllPrograms'),
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

const FEATURED_LEAD_IMAGE = '/programme.jpg';

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
  const typeIcon = iconForProgramType(program.type);
  const formatIcon = iconForProgramFormat(program.format);

  const metaRow = (
    <div className="relative mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
      <ul className="flex flex-wrap gap-2">
        <li className="inline-flex items-center gap-1.5 rounded-full border border-warm-200/60 bg-white/50 px-3 py-1 text-xs font-medium text-secondary/75 backdrop-blur-sm">
          <Icon name="calendar" size={13} className="text-primary/70" aria-hidden />
          {program.duration}
        </li>
        <li className="inline-flex items-center gap-1.5 rounded-full border border-warm-200/60 bg-white/50 px-3 py-1 text-xs font-medium text-secondary/75 backdrop-blur-sm">
          <Icon name={formatIcon} size={13} className="text-primary/70" aria-hidden />
          {program.format}
        </li>
      </ul>
      <span className="link-arrow pointer-events-none text-xs sm:text-sm">
        {tf('explore')}
        <Icon name="arrow-right" size={15} className="btn-arrow pointer-events-none" />
      </span>
    </div>
  );

  const cardHeader = (
    <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${accent}14`, color: accent }}
          >
            <Icon name={typeIcon} size={20} weight="medium" />
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
  );

  const cardBody = (
    <>
      {cardHeader}
      <h3
        className={cn(
          'relative mt-6 font-display leading-snug text-secondary transition-colors duration-300 [@media(hover:hover)]:group-hover:text-primary',
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
      {metaRow}
    </>
  );

  if (isLead) {
    return (
      <Link
        href={programPath(program.slug, locale)}
        className="card-interactive card-interactive-media group relative flex h-full min-h-[320px] flex-col overflow-hidden p-0 sm:min-h-0"
      >
        <div
          className="pointer-events-none absolute -right-10 top-8 h-36 w-36 rounded-full opacity-[0.14] blur-2xl transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-[0.22]"
          style={{ backgroundColor: accent }}
          aria-hidden
        />

        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-[5/3] lg:aspect-auto lg:min-h-[13.5rem] lg:flex-[1.05] lg:basis-0 xl:min-h-[15.5rem]">
          <Image
            src={FEATURED_LEAD_IMAGE}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover object-[center_40%] transform-gpu transition-transform duration-500 ease-out motion-reduce:transform-none [@media(hover:hover)]:group-hover:scale-[1.02]"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--unm-canvas)] via-[var(--unm-canvas)]/20 to-transparent"
            aria-hidden
          />
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2.5 sm:left-5 sm:top-5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-sm"
              style={{ color: accent }}
            >
              <Icon name={typeIcon} size={18} weight="medium" />
            </span>
            <Badge variant="program-type" type={program.type}>
              {program.type}
            </Badge>
          </div>
          {facultyName && (
            <span className="pointer-events-none absolute right-4 top-4 hidden max-w-[45%] line-clamp-2 rounded-lg bg-white/80 px-2.5 py-1 text-right font-heading text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary/50 shadow-sm backdrop-blur-sm sm:block sm:right-5 sm:top-5">
              {facultyName}
            </span>
          )}
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6 lg:flex-[0.95] lg:px-8 lg:pb-8">
          <h3 className="line-clamp-3 font-display text-2xl leading-snug text-secondary transition-colors duration-300 [@media(hover:hover)]:group-hover:text-primary sm:text-[1.65rem]">
            {title}
          </h3>
          {pitch && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-secondary/60 sm:text-[15px]">
              {pitch}
            </p>
          )}
          {metaRow}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={programPath(program.slug, locale)}
      className="card-interactive group relative flex h-full min-h-[200px] flex-col overflow-hidden p-6"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-[0.14] blur-2xl transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-[0.22]"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <div className="relative flex min-w-0 flex-1 flex-col">{cardBody}</div>
    </Link>
  );
}

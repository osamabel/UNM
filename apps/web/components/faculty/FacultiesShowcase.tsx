'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { Faculty, Locale } from '@unm/types';
import { facultyPath, localized } from '@/lib/utils';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

interface Props {
  faculties: Faculty[];
}

export function FacultiesShowcase({ faculties }: Props) {
  const locale = useLocale() as Locale;
  const ts = useTranslations('facultiesShowcase');
  const tn = useTranslations('nav');

  const ordered = [...faculties].sort(
    (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999),
  );
  const active = ordered.filter((f) => !f.comingSoon);
  const upcoming = ordered.filter((f) => f.comingSoon);

  return (
    <div className="min-w-0 space-y-16 sm:space-y-20">
      {active.length > 0 && (
        <section aria-labelledby="active-faculties-heading">
          <header className="mb-8 flex items-baseline justify-between gap-4">
            <p id="active-faculties-heading" className="eyebrow">
              {ts('activeHeading')}
            </p>
            <p className="shrink-0 font-heading text-[11px] tabular-nums text-secondary/45">
              {active.length} / {ordered.length}
            </p>
          </header>
          <div className="space-y-6">
            {active.map((f) => (
              <ActiveFacultyCard key={f.id} faculty={f} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section aria-labelledby="upcoming-faculties-heading" className="divider-fine pt-12 sm:pt-14">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p id="upcoming-faculties-heading" className="eyebrow text-secondary/50">
                {ts('upcomingHeading')}
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary/55">
                {ts('upcomingIntro')}
              </p>
            </div>
            <p className="shrink-0 font-heading text-[11px] tabular-nums text-secondary/45">
              {upcoming.length} / {ordered.length}
            </p>
          </header>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {upcoming.map((f) => (
              <UpcomingFacultyCard key={f.id} faculty={f} locale={locale} comingSoonLabel={tn('comingSoon')} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ActiveFacultyCard({ faculty: f, locale }: { faculty: Faculty; locale: Locale }) {
  const ts = useTranslations('facultiesShowcase');
  const accent = f.color || '#B5341A';
  const count = f.programCount ?? 0;
  const programLabel = count > 1 ? ts('programPlural') : ts('programSingular');
  const shortName = localized(f.name, locale).replace(/^UNM\s+/i, '');

  return (
    <article className="card-interactive group overflow-hidden p-0">
      <div className="grid min-w-0 md:grid-cols-[minmax(0,12rem)_1fr] lg:grid-cols-[minmax(0,14rem)_1fr] xl:grid-cols-[minmax(0,16rem)_1fr]">
        <div
          className="relative flex flex-col justify-between px-5 py-7 text-warm-50 sm:px-7 sm:py-9"
          style={{
            background: `linear-gradient(155deg, ${accent}e8 0%, ${accent}c9 45%, #3D1A0B 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15 blur-2xl"
            aria-hidden
          />
          <div className="relative">
            <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.18em] text-warm-100/90">
              UNM
            </p>
            <h2 className="mt-3 font-display text-2xl leading-snug text-warm-50 sm:text-[1.65rem]">
              {shortName}
            </h2>
          </div>
          <div className="relative mt-8">
            <p className="font-display text-4xl font-light tabular-nums text-warm-50">{count}</p>
            <p className="mt-1 font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-warm-100/85">
              {programLabel}
            </p>
          </div>
        </div>

        <div className="relative flex min-w-0 flex-col justify-between gap-6 px-6 py-8 sm:px-8 lg:px-10">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-[0.14]"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          <p className="relative text-sm leading-relaxed text-secondary/75 sm:text-[15px]">
            {localized(f.description, locale)}
          </p>
          <div className="relative flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
            <ButtonLink
              href={facultyPath(f.slug, locale)}
              fullWidth
              className="sm:!w-auto"
              trailingIcon={<Icon name="arrow-right" size={16} />}
            >
              {ts('exploreFaculty')}
            </ButtonLink>
            <ButtonLink
              href={locale === 'en' ? '/en/programs' : '/programmes'}
              variant="ghost"
              fullWidth
              className="sm:!w-auto"
            >
              {ts('seeAllPrograms')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}

function UpcomingFacultyCard({
  faculty: f,
  locale,
  comingSoonLabel,
}: {
  faculty: Faculty;
  locale: Locale;
  comingSoonLabel: string;
}) {
  const shortName = localized(f.name, locale).replace(/^UNM\s+/i, '');

  return (
    <li>
      <div className="card-flat flex h-full flex-col p-5 sm:p-6">
        <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary/40">
          UNM
        </p>
        <h3 className="mt-2 font-display text-lg text-secondary/70">{shortName}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-secondary/50 line-clamp-4">
          {localized(f.description, locale)}
        </p>
        <p
          className={cn(
            'mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-warm-200/80',
            'bg-white/50 px-3 py-1 font-heading text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary/45',
          )}
        >
          <Icon name="clock" size={12} className="opacity-60" />
          {comingSoonLabel}
        </p>
      </div>
    </li>
  );
}

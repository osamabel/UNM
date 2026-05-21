'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Icon, type IconName } from '@/components/ui/Icon';
import { facultyPath, localized } from '@/lib/utils';
import type { Faculty, Locale } from '@unm/types';
import { cn } from '@/lib/utils';

interface Props {
  faculties: Faculty[];
}

const FACULTY_ICONS: Record<string, IconName> = {
  'business-school': 'graduation',
  'school-of-governance': 'shield',
  'school-of-technology': 'globe',
  'school-of-sport-business': 'award',
};

function shortFacultyName(name: string): string {
  return name.replace(/^UNM\s+/i, '').trim();
}

type FacultyGridT = ReturnType<typeof useTranslations<'facultyGrid'>>;

function facultyPitch(tg: FacultyGridT, slug: string): string {
  const key = `pitch.${slug}` as
    | 'pitch.business-school'
    | 'pitch.school-of-governance'
    | 'pitch.school-of-technology'
    | 'pitch.school-of-sport-business';
  if (
    slug === 'business-school' ||
    slug === 'school-of-governance' ||
    slug === 'school-of-technology' ||
    slug === 'school-of-sport-business'
  ) {
    return tg(key);
  }
  return '';
}

export function FacultyGrid({ faculties }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const tg = useTranslations('facultyGrid');

  const ordered = [...faculties].sort(
    (a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999),
  );
  const active = ordered.filter((f) => !f.comingSoon);
  const upcoming = ordered.filter((f) => f.comingSoon);
  const flagship = active[0];

  return (
    <SectionWrapper id="facultes" tone="alt">
      <ScrollReveal>
        <SectionHeader
          icon="building"
          eyebrow={t('facultiesEyebrow')}
          title={t('facultiesTitle')}
          description={t('facultiesSubtitle')}
          className="!mb-8 sm:!mb-10"
        />
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-8">
          {flagship && (
            <ActiveFacultyCard faculty={flagship} locale={locale} tg={tg} />
          )}

          {upcoming.length > 0 && (
            <aside className="flex flex-col">
              <p className="mb-4 font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary/45">
                {tg('upcomingHeading')}
              </p>
              <ul className="flex flex-1 flex-col gap-3">
                {upcoming.map((f) => (
                  <UpcomingFacultyCard key={f.id} faculty={f} locale={locale} tg={tg} />
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-secondary/45">{tg('upcomingNote')}</p>
            </aside>
          )}
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}

function ActiveFacultyCard({
  faculty: f,
  locale,
  tg,
}: {
  faculty: Faculty;
  locale: Locale;
  tg: FacultyGridT;
}) {
  const count = f.programCount ?? 0;
  const pitch = facultyPitch(tg, f.slug);
  const domains = (f.domains ?? []).slice(0, 3);
  const icon = FACULTY_ICONS[f.slug] ?? 'building';
  const color = f.color || '#B5341A';
  const name = shortFacultyName(localized(f.name, locale));

  return (
    <Link
      href={facultyPath(f.slug, locale)}
      className="group card-interactive min-w-0 overflow-hidden p-0 lg:min-h-[300px]"
    >
      <div className="grid h-full grid-cols-1 min-[420px]:grid-cols-[9.5rem_1fr] sm:grid-cols-[10.5rem_1fr] lg:grid-cols-[12rem_1fr]">
        <div
          className="relative flex flex-col justify-between px-6 py-8 text-warm-50 sm:px-7 sm:py-9"
          style={{ backgroundColor: color }}
        >
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Icon name={icon} size={22} className="text-warm-50" />
            </span>
            <p className="mt-6 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-100/90">
              UNM
            </p>
            <h3 className="mt-2 font-display text-xl leading-tight text-warm-50 sm:text-2xl">
              {name}
            </h3>
          </div>
          <div className="mt-8">
            <p className="font-display text-4xl font-semibold leading-none text-warm-50">{count}</p>
            <p className="mt-1 font-heading text-[10px] font-semibold uppercase tracking-wider text-warm-100/80">
              {count === 1 ? tg('programOne') : tg('programMany')}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 px-6 py-8 sm:px-8 sm:py-9">
          <div>
            <p className="text-sm leading-relaxed text-secondary/75 sm:text-[15px]">{pitch}</p>
            {domains.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {domains.map((d, i) => (
                  <li
                    key={i}
                    className="rounded-full border border-warm-200/80 bg-warm-50/60 px-3 py-1 text-[11px] font-medium text-secondary/70"
                  >
                    {localized(d, locale)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span className="link-arrow w-fit text-sm">
            {tg('explore')}
            <Icon name="arrow-right" size={16} className="btn-arrow" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function UpcomingFacultyCard({
  faculty: f,
  locale,
  tg,
}: {
  faculty: Faculty;
  locale: Locale;
  tg: FacultyGridT;
}) {
  const pitch = facultyPitch(tg, f.slug);
  const icon = FACULTY_ICONS[f.slug] ?? 'building';
  const color = f.color || '#3D1A0B';
  const name = shortFacultyName(localized(f.name, locale));

  return (
    <li>
      <article
        className={cn(
          'flex gap-4 rounded-xl border border-warm-200/70 bg-warm-100/35 px-4 py-4',
          'transition-colors duration-300 hover:border-warm-300 hover:bg-warm-100/55',
        )}
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}18`, color }}
          aria-hidden
        >
          <Icon name={icon} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-base leading-snug text-secondary/70">{name}</h4>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-secondary/50">{pitch}</p>
        </div>
      </article>
    </li>
  );
}

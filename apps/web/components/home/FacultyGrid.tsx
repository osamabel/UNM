'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ScrollReveal, StaggerReveal } from '@/components/patterns/ScrollReveal';
import { Icon } from '@/components/ui/Icon';
import { iconForFacultySlug } from '@/lib/faculty-icons';
import { getFacultyCoverSrc } from '@/lib/faculty-images';
import { facultyPath, localized } from '@/lib/utils';
import type { Faculty, Locale } from '@unm/types';
import { cn } from '@/lib/utils';

interface Props {
  faculties: Faculty[];
}

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
    <SectionWrapper id="facultes" tone="canvas">
      <ScrollReveal from="up" duration={850}>
        <SectionHeader
          index="02"
          eyebrow={t('facultiesEyebrow')}
          title={t('facultiesTitle')}
          description={t('facultiesSubtitle')}
          className="!mb-8 sm:!mb-9"
        />
      </ScrollReveal>

      <div className="grid min-w-0 gap-5 lg:grid-cols-12 lg:gap-6">
        {flagship && (
          <ScrollReveal
            delay={80}
            from="up"
            duration={900}
            className="min-w-0 lg:col-span-7 xl:col-span-8"
          >
            <FlagshipFacultyCard faculty={flagship} locale={locale} tg={tg} />
          </ScrollReveal>
        )}

        {upcoming.length > 0 && (
          <ScrollReveal
            delay={140}
            from="up"
            duration={900}
            className="min-w-0 lg:col-span-5 xl:col-span-4"
          >
            <aside className="flex h-full flex-col">
              <div className="mb-3.5 flex items-baseline justify-between gap-3">
                <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary/45">
                  {tg('upcomingHeading')}
                </p>
                <span className="text-[11px] text-secondary/35">{upcoming.length}</span>
              </div>

              <StaggerReveal
                as="ul"
                itemAs="li"
                delay={180}
                stagger={90}
                from="up"
                duration={780}
                className="flex flex-1 flex-col gap-3"
                itemClassName="min-w-0 h-full"
              >
                {upcoming.map((f) => (
                  <UpcomingFacultyCard key={f.id} faculty={f} locale={locale} tg={tg} />
                ))}
              </StaggerReveal>

              <p className="mt-4 text-xs leading-relaxed text-secondary/45">
                {tg('upcomingNote')}
              </p>
            </aside>
          </ScrollReveal>
        )}
      </div>
    </SectionWrapper>
  );
}

function FlagshipFacultyCard({
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
  const icon = iconForFacultySlug(f.slug);
  const name = shortFacultyName(localized(f.name, locale));
  const cover = getFacultyCoverSrc(f);
  const href = facultyPath(f.slug, locale);

  return (
    <Link
      href={href}
      className="faculty-flagship group relative flex min-h-[22rem] flex-col overflow-hidden sm:min-h-[26rem] lg:h-full lg:min-h-[28rem]"
      aria-label={`${name} — ${tg('explore')}`}
    >
      <Image
        src={cover}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 66vw"
        className="faculty-flagship-img object-cover"
        priority
      />
      <div className="faculty-flagship-veil" aria-hidden />

      <div className="relative z-10 flex flex-1 flex-col justify-between p-5 sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="faculty-live-badge">
            <Icon name={icon} size={13} aria-hidden />
            {locale === 'en' ? 'Open now' : 'En activité'}
          </span>
          {count > 0 && (
            <span className="faculty-count-pill">
              <span className="font-display text-sm font-semibold tabular-nums">{count}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                {count === 1 ? tg('programOne') : tg('programMany')}
              </span>
            </span>
          )}
        </div>

        <div className="mt-auto max-w-xl">
          <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-primary-200">
            UNM
          </p>
          <h3 className="mt-2 font-display text-2xl leading-tight tracking-tight text-warm-50 sm:text-3xl lg:text-[2.15rem]">
            {name}
          </h3>
          {pitch ? (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-warm-100/90 sm:text-[15px]">
              {pitch}
            </p>
          ) : null}
          {domains.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {domains.map((d, i) => (
                <li key={i} className="faculty-domain-chip">
                  {localized(d, locale)}
                </li>
              ))}
            </ul>
          )}
          <span className="faculty-flagship-cta mt-5 inline-flex items-center gap-2">
            {tg('explore')}
            <Icon name="arrow-right" size={16} className="btn-arrow" aria-hidden />
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
  const icon = iconForFacultySlug(f.slug);
  const name = shortFacultyName(localized(f.name, locale));
  const cover = getFacultyCoverSrc(f);
  const comingSoonLabel = locale === 'en' ? 'Soon' : 'Bientôt';

  return (
    <article className={cn('faculty-upcoming group')}>
      <div className="faculty-upcoming-media" aria-hidden>
        <Image
          src={cover}
          alt=""
          fill
          sizes="120px"
          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
        />
        <span className="faculty-upcoming-media-veil" />
        <span className="faculty-upcoming-icon">
          <Icon name={icon} size={16} />
        </span>
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display text-[0.95rem] leading-snug text-secondary sm:text-base">
            {name}
          </h4>
          <span className="faculty-soon-badge shrink-0">{comingSoonLabel}</span>
        </div>
        {pitch ? (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-secondary/55">
            {pitch}
          </p>
        ) : null}
        <p className="sr-only">{tg('upcomingNote')}</p>
      </div>
    </article>
  );
}

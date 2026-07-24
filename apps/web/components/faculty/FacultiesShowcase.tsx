'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Faculty, Locale } from '@unm/types';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { getFacultyCoverSrc } from '@/lib/faculty-images';
import { facultyPath, localized } from '@/lib/utils';

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
    <div className="faculties-showcase">
      {active.length > 0 ? (
        <section aria-labelledby="active-faculties-heading" className="faculties-block">
          <ScrollReveal>
            <header className="faculties-block-head">
              <div className="min-w-0">
                <p id="active-faculties-heading" className="faculties-kicker">
                  {ts('activeHeading')}
                </p>
                <h2 className="faculties-block-title">{ts('activeTitle')}</h2>
                <p className="faculties-block-intro">{ts('activeIntro')}</p>
              </div>
              <p className="faculties-count">
                {active.length}
                <span> / {ordered.length}</span>
              </p>
            </header>
          </ScrollReveal>
          <div className="faculties-active-list">
            {active.map((f, i) => (
              <ScrollReveal key={f.id} delay={i * 70}>
                <ActiveFacultyCard faculty={f} locale={locale} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      ) : null}

      {upcoming.length > 0 ? (
        <section
          aria-labelledby="upcoming-faculties-heading"
          className="faculties-block faculties-block--upcoming"
        >
          <ScrollReveal>
            <header className="faculties-block-head">
              <div className="min-w-0">
                <p id="upcoming-faculties-heading" className="faculties-kicker faculties-kicker--muted">
                  {ts('upcomingHeading')}
                </p>
                <h2 className="faculties-block-title">{ts('upcomingTitle')}</h2>
                <p className="faculties-block-intro">{ts('upcomingIntro')}</p>
              </div>
              <p className="faculties-count">
                {upcoming.length}
                <span> / {ordered.length}</span>
              </p>
            </header>
          </ScrollReveal>
          <ul className="faculties-upcoming-grid">
            {upcoming.map((f, i) => (
              <ScrollReveal key={f.id} delay={i * 60} as="li">
                <UpcomingFacultyCard
                  faculty={f}
                  locale={locale}
                  comingSoonLabel={tn('comingSoon')}
                  exploreLabel={ts('learnMore')}
                />
              </ScrollReveal>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function ActiveFacultyCard({ faculty: f, locale }: { faculty: Faculty; locale: Locale }) {
  const ts = useTranslations('facultiesShowcase');
  const accent = f.color || '#B5341A';
  const count = f.programCount ?? 0;
  const programLabel = count > 1 ? ts('programPlural') : ts('programSingular');
  const shortName = localized(f.name, locale).replace(/^UNM\s+/i, '');
  const cover = getFacultyCoverSrc(f);
  const fromCms = cover.startsWith('/cms-media/');
  const href = facultyPath(f.slug, locale);
  const programsHref =
    locale === 'en' ? `/en/programs?faculty=${f.slug}` : `/programmes?faculty=${f.slug}`;

  return (
    <article className="faculty-index-card">
      <div className="faculty-index-card-media">
        <Image
          src={cover}
          alt={shortName}
          fill
          sizes="(max-width: 768px) 100vw, 42vw"
          className="object-cover object-[center_30%]"
          unoptimized={fromCms}
        />
        <div className="faculty-index-card-scrub" aria-hidden />
        <div
          className="faculty-index-card-accent"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 30% 80%, ${accent}66, transparent 70%)`,
          }}
          aria-hidden
        />
        <div className="faculty-index-card-meta">
          <p className="faculty-index-card-brand">UNM</p>
          <p className="faculty-index-card-stat">
            <span className="faculty-index-card-stat-num">{count}</span>
            <span className="faculty-index-card-stat-label">{programLabel}</span>
          </p>
        </div>
      </div>

      <div className="faculty-index-card-body">
        <p className="faculties-kicker">{ts('activeBadge')}</p>
        <h3 className="faculty-index-card-title">
          <Link href={href}>{shortName}</Link>
        </h3>
        <p className="faculty-index-card-desc">{localized(f.description, locale)}</p>
        <div className="faculty-index-card-actions">
          <ButtonLink href={href} trailingIcon={<Icon name="arrow-right" size={16} />}>
            {ts('exploreFaculty')}
          </ButtonLink>
          <ButtonLink href={programsHref} variant="ghost">
            {ts('seeFacultyPrograms')}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

function UpcomingFacultyCard({
  faculty: f,
  locale,
  comingSoonLabel,
  exploreLabel,
}: {
  faculty: Faculty;
  locale: Locale;
  comingSoonLabel: string;
  exploreLabel: string;
}) {
  const shortName = localized(f.name, locale).replace(/^UNM\s+/i, '');
  const cover = getFacultyCoverSrc(f);
  const fromCms = cover.startsWith('/cms-media/');
  const href = facultyPath(f.slug, locale);

  return (
    <Link href={href} className="faculty-upcoming-card group">
      <div className="faculty-upcoming-media">
        <Image
          src={cover}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-105"
          unoptimized={fromCms}
        />
        <div className="faculty-upcoming-scrub" aria-hidden />
        <span className="faculty-upcoming-badge">
          <Icon name="clock" size={12} />
          {comingSoonLabel}
        </span>
      </div>
      <div className="faculty-upcoming-body">
        <p className="faculty-upcoming-brand">UNM</p>
        <h3 className="faculty-upcoming-title">{shortName}</h3>
        <p className="faculty-upcoming-desc">{localized(f.description, locale)}</p>
        <span className="faculty-upcoming-cta">
          {exploreLabel}
          <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

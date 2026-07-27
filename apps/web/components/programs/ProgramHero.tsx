'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StaggerReveal } from '@/components/patterns/ScrollReveal';
import type { Locale, Program } from '@unm/types';
import { dbaContent } from '@/lib/dba-content';
import { displayProgramTitle, facultyPath, localized } from '@/lib/utils';
import { getProgramCoverSrc } from '@/lib/program-images';
import type { IconName } from '@/components/ui/Icon';

interface Props {
  program: Program;
}

type SpecItem = {
  icon: IconName;
  label: string;
  value: string;
};

function diplomaForType(type: Program['type'], isEn: boolean): string {
  switch (type) {
    case 'DBA':
      return isEn ? 'Doctorate (Bac+8)' : 'Doctorat (Bac+8)';
    case 'MBA':
      return isEn ? 'MBA (Bac+5)' : 'MBA (Bac+5)';
    case 'Bachelor':
      return isEn ? 'Bachelor (Bac+3)' : 'Bachelor (Bac+3)';
    case 'Certificate':
      return isEn ? 'Certificate' : 'Certificat';
    default:
      return type;
  }
}

/** Keep sphere text readable: prefer Bac level when the CMS blurb is a paragraph. */
function sphereValue(value: string): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= 42) return clean;
  const bac = clean.match(/Bac\s*\+?\s*\d+/i);
  if (bac) return bac[0].replace(/\s+/g, ' ').replace(/\s*\+\s*/, '+');
  return clean;
}

function buildSpecs(
  program: Program,
  locale: Locale,
  t: ReturnType<typeof useTranslations<'program'>>,
): SpecItem[] {
  const isEn = locale === 'en';

  if (program.type === 'DBA') {
    const icons: IconName[] = ['book', 'clock', 'shield', 'award', 'graduation', 'user-check'];
    return dbaContent.keyInfo.items.map((item, i) => ({
      icon: icons[i] ?? 'book',
      label: localized(item.label, locale),
      value: localized(item.value, locale),
    }));
  }

  const admission = localized(program.admissionRequirements, locale);
  const schedule = localized(program.schedule, locale);

  return [
    { icon: 'book', label: t('pace'), value: sphereValue(program.format) },
    { icon: 'clock', label: t('duration'), value: sphereValue(program.duration) },
    {
      icon: 'shield',
      label: t('access'),
      value: admission ? sphereValue(admission) : isEn ? 'On request' : 'Sur demande',
    },
    { icon: 'award', label: t('diploma'), value: diplomaForType(program.type, isEn) },
    {
      icon: 'graduation',
      label: t('defence'),
      value: schedule
        ? sphereValue(schedule)
        : program.language.map((l) => l.toUpperCase()).join(' · '),
    },
    {
      icon: 'user-check',
      label: t('mentoring'),
      value: isEn ? 'Personalised support' : 'Accompagnement dédié',
    },
  ];
}

export function ProgramHero({ program }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  const tc = useTranslations('common');
  const title = displayProgramTitle(localized(program.title, locale), program.type);
  const facLabel = program.faculty?.name ? localized(program.faculty.name, locale) : '';
  const cover = getProgramCoverSrc(program.slug, program.type);
  const specs = buildSpecs(program, locale, t);
  const bandLabel =
    program.type === 'DBA'
      ? localized(dbaContent.keyInfo.title, locale)
      : locale === 'en'
        ? 'Programme at a glance'
        : 'Fiche programme';
  const admissionsHref = `${locale === 'en' ? '/en/admissions' : '/admissions'}?program=${program.slug}`;
  const vocation = program.vocation ? localized(program.vocation, locale) : '';

  return (
    <section className="program-hero relative flex flex-col overflow-hidden">
      <Image
        src={cover}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />
      <div className="program-hero-scrub" aria-hidden />
      <div className="program-hero-vignette" aria-hidden />

      <div className="container-page relative z-10 min-w-0">
        <div className="program-hero-stage">
          <div className="program-hero-copy">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="program-type" type={program.type}>
                {program.type}
              </Badge>
              {program.faculty?.slug ? (
                <Link
                  href={facultyPath(program.faculty.slug, locale)}
                  className="program-hero-faculty-pill"
                >
                  {facLabel.replace(/^UNM\s+/i, '')}
                </Link>
              ) : null}
            </div>

            <h1 className="program-hero-title">{title}</h1>

            {vocation ? <p className="program-hero-desc">{vocation}</p> : null}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink
                href={admissionsHref}
                size="lg"
                className="w-full sm:w-auto"
                trailingIcon={<Icon name="arrow-right" size={18} />}
              >
                {tc('apply')}
              </ButtonLink>
              <ButtonLink
                href="#brochure"
                variant="ghost"
                size="lg"
                className="program-hero-cta-ghost w-full sm:w-auto"
              >
                {tc('downloadBrochure')}
              </ButtonLink>
            </div>
          </div>

          <aside className="program-hero-facts" aria-label={bandLabel}>
            <div className="program-hero-orbit" aria-hidden />
            <StaggerReveal
              className="program-hero-spheres"
              from="scale"
              delay={120}
              stagger={100}
              duration={880}
              blur
              itemClassName="program-hero-sphere-slot"
            >
              {specs.map((spec, index) => (
                <article
                  key={spec.label}
                  className={`program-fact-sphere glass-dark program-fact-sphere--${index}`}
                >
                  <span className="program-fact-sphere-ring" aria-hidden />
                  <span className="program-fact-sphere-shine" aria-hidden />
                  <span className="program-fact-sphere-glow" aria-hidden />
                  <div className="program-fact-sphere-icon" aria-hidden>
                    <Icon name={spec.icon} size={15} />
                  </div>
                  <p className="program-fact-sphere-value">{spec.value}</p>
                  <p className="program-fact-sphere-label">{spec.label}</p>
                </article>
              ))}
            </StaggerReveal>
          </aside>
        </div>
      </div>
    </section>
  );
}

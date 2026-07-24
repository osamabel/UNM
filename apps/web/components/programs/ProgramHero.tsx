'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
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

function shortText(value: string, max = 48): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
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
    { icon: 'book', label: t('pace'), value: program.format },
    { icon: 'clock', label: t('duration'), value: program.duration },
    {
      icon: 'shield',
      label: t('access'),
      value: admission ? shortText(admission) : isEn ? 'On request' : 'Sur demande',
    },
    { icon: 'award', label: t('diploma'), value: diplomaForType(program.type, isEn) },
    {
      icon: 'graduation',
      label: t('defence'),
      value: schedule
        ? shortText(schedule)
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

  return (
    <section className="program-hero relative overflow-hidden border-b border-warm-150/40 bg-canvas">
      <div className="container-page relative grid min-w-0 items-center gap-8 py-10 sm:py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
        <div className="min-w-0 lg:col-span-6 xl:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="program-type" type={program.type}>
              {program.type}
            </Badge>
            {program.faculty?.slug && (
              <Link
                href={facultyPath(program.faculty.slug, locale)}
                className="glass-pill text-xs font-semibold text-secondary/75 transition-colors hover:text-primary"
              >
                {facLabel.replace(/^UNM\s+/i, '')}
              </Link>
            )}
          </div>

          <h1 className="mt-5 max-w-2xl break-words font-display text-3xl leading-tight text-secondary sm:text-4xl lg:text-[2.55rem] lg:leading-[1.12]">
            {title}
          </h1>
          {program.vocation && localized(program.vocation, locale) && (
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-secondary/70 sm:text-base">
              {localized(program.vocation, locale)}
            </p>
          )}
        </div>

        <div className="relative lg:col-span-6 xl:col-span-7">
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(61,26,11,0.12)]">
            <Image
              src={cover}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-secondary/20 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div className="program-hero-band" aria-label={bandLabel}>
        <div className="container-page">
          <dl className="program-hero-band-grid">
            {specs.map((spec) => (
              <div key={spec.label} className="program-hero-band-item">
                <dt>
                  <span className="program-hero-band-icon" aria-hidden>
                    <Icon name={spec.icon} size={22} />
                  </span>
                  <span className="program-hero-band-label">{spec.label}</span>
                </dt>
                <dd className="program-hero-band-value">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

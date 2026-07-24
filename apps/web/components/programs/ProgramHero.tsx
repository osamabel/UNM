'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import type { Locale, Program } from '@unm/types';
import { iconForProgramFormat } from '@/lib/program-meta-icons';
import { getProgramCoverSrc } from '@/lib/program-images';
import { displayProgramTitle, facultyPath, localized } from '@/lib/utils';
import type { IconName } from '@/components/ui/Icon';

interface Props {
  program: Program;
}

export function ProgramHero({ program }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  const title = displayProgramTitle(localized(program.title, locale), program.type);
  const facLabel = program.faculty?.name ? localized(program.faculty.name, locale) : '';
  const cover = getProgramCoverSrc(program.slug, program.type);

  return (
    <section className="relative overflow-hidden border-b border-warm-150/40 bg-canvas">
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

          <dl className="mt-8 grid grid-cols-2 gap-2.5 border-t border-warm-200/70 pt-6 sm:grid-cols-3 sm:gap-3">
            <Spec icon="calendar" label={t('duration')} value={program.duration} />
            <Spec icon={iconForProgramFormat(program.format)} label={t('format')} value={program.format} />
            <Spec
              icon="globe"
              label={t('language')}
              value={program.language.map((l) => l.toUpperCase()).join(' · ')}
              className="col-span-2 sm:col-span-1"
            />
          </dl>
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
    </section>
  );
}

function Spec({
  icon,
  label,
  value,
  className,
}: {
  icon: IconName;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border border-warm-200/70 bg-white/55 px-3 py-3.5 sm:px-4 sm:py-4 ${className ?? ''}`}
    >
      <dt className="flex items-center gap-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/80">
        <Icon name={icon} size={14} className="shrink-0" />
        <span className="truncate">{label}</span>
      </dt>
      <dd className="mt-1.5 truncate font-heading text-sm font-semibold text-secondary sm:text-base">
        {value}
      </dd>
    </div>
  );
}

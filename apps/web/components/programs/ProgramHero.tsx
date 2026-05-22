import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import type { Locale, Program } from '@unm/types';
import { iconForProgramFormat } from '@/lib/program-meta-icons';
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

  return (
    <section className="relative overflow-hidden border-b border-warm-150/40">
      <div className="glass-dark relative">
        <div className="hero-panel-pattern absolute inset-0" aria-hidden />
        <div className="container-page relative min-w-0 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="program-type" type={program.type}>
              {program.type}
            </Badge>
            {program.faculty?.slug && (
              <Link
                href={facultyPath(program.faculty.slug, locale)}
                className="glass-pill text-xs font-semibold text-warm-100 transition-colors hover:text-white"
              >
                {facLabel.replace(/^UNM\s+/i, '')}
              </Link>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl break-words font-display text-display-xl text-warm-50">
            {title}
          </h1>
          {program.vocation && localized(program.vocation, locale) && (
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-warm-200/90 sm:text-lg">
              {localized(program.vocation, locale)}
            </p>
          )}

          <dl className="mt-8 grid grid-cols-2 gap-2.5 border-t border-white/15 pt-8 sm:grid-cols-3 sm:gap-3">
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
    <div className={`glass-stat min-w-0 px-3 py-3.5 sm:px-4 sm:py-4 ${className ?? ''}`}>
      <dt className="flex items-center gap-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-200">
        <Icon name={icon} size={14} className="shrink-0" />
        <span className="truncate">{label}</span>
      </dt>
      <dd className="mt-1.5 break-words font-display text-lg font-semibold text-warm-50 sm:text-xl">
        {value}
      </dd>
    </div>
  );
}

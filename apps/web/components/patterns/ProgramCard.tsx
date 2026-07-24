import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import type { Locale, Program } from '@unm/types';
import { iconForProgramFormat } from '@/lib/program-meta-icons';
import { getProgramCoverSrc } from '@/lib/program-images';
import { cn, displayProgramTitle, localized, programPath } from '@/lib/utils';
import type { IconName } from '@/components/ui/Icon';

interface ProgramCardProps {
  program: Program;
  locale: Locale;
  durationLabel: string;
  formatLabel: string;
  exploreLabel: string;
  variant?: 'default' | 'compact';
}

export function ProgramCard({
  program,
  locale,
  durationLabel,
  formatLabel,
  exploreLabel,
  variant = 'default',
}: ProgramCardProps) {
  const compact = variant === 'compact';
  const title = displayProgramTitle(localized(program.title, locale), program.type);
  const pitch = compact ? '' : localized(program.metaDescription, locale);
  const facultyName = program.faculty
    ? localized(program.faculty.name, locale).replace(/^UNM\s+/i, '')
    : '';
  const formatIcon = iconForProgramFormat(program.format);
  const cover = getProgramCoverSrc(program.slug, program.type);

  return (
    <Link
      href={programPath(program.slug, locale)}
      className={cn(
        'card-interactive group relative flex h-full flex-col overflow-hidden',
        compact ? 'min-h-[240px]' : 'min-h-[300px] sm:min-h-[320px]',
      )}
    >
      <div className={cn('relative overflow-hidden', compact ? 'h-32' : 'h-40 sm:h-44')}>
        <Image
          src={cover}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-secondary/50 via-secondary/10 to-transparent"
          aria-hidden
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge variant="program-type" type={program.type}>
            {program.type}
          </Badge>
        </div>
      </div>

      <div className={cn('relative flex flex-1 flex-col', compact ? 'p-5' : 'p-6 sm:p-7')}>
        {facultyName && (
          <span className="mb-2 font-heading text-[10px] font-semibold uppercase tracking-[0.1em] text-secondary/38">
            {facultyName}
          </span>
        )}

        <h2
          className={cn(
            'relative font-display leading-snug text-secondary line-clamp-2',
            compact ? 'text-lg' : 'text-xl sm:text-[1.3rem]',
          )}
        >
          {title}
        </h2>

        {pitch && (
          <p className="relative mt-2.5 line-clamp-2 text-sm leading-relaxed text-secondary/58">
            {pitch}
          </p>
        )}

        <div className="relative mt-auto flex flex-wrap items-end justify-between gap-3 pt-5 sm:pt-6">
          <ul className="flex flex-wrap gap-2">
            <MetaPill icon="calendar" label={durationLabel} value={program.duration} />
            <MetaPill icon={formatIcon} label={formatLabel} value={program.format} />
          </ul>
          <span
            className={cn(
              'link-arrow text-xs text-secondary/70 transition-all duration-300 sm:text-sm',
              '[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100',
            )}
          >
            {exploreLabel}
            <Icon name="arrow-right" size={15} className="btn-arrow" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function MetaPill({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  return (
    <li
      className="inline-flex max-w-full flex-col gap-0.5 rounded-full border border-warm-200/55 bg-white/55 px-3 py-1.5 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-2"
      title={`${label}: ${value}`}
    >
      <span className="flex items-center gap-1 font-heading text-[10px] font-semibold uppercase tracking-[0.08em] text-secondary/45">
        <Icon name={icon} size={12} className="text-primary/75" />
        {label}
      </span>
      <span className="text-xs font-medium text-secondary sm:text-[13px]">{value}</span>
    </li>
  );
}

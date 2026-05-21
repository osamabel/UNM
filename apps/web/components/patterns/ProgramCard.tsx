import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import type { Locale, Program } from '@unm/types';
import { cn, displayProgramTitle, localized, programPath } from '@/lib/utils';

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
  const accent = program.faculty?.color || '#B5341A';

  return (
    <Link
      href={programPath(program.slug, locale)}
      className={cn(
        'card-interactive group relative flex h-full flex-col overflow-hidden',
        compact ? 'min-h-[200px] p-5 sm:min-h-[210px]' : 'min-h-[220px] p-6 sm:min-h-[240px] sm:p-7',
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-[0.12] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.2]"
        style={{ backgroundColor: accent }}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              'flex shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105',
              compact ? 'h-8 w-8' : 'h-9 w-9 sm:h-10 sm:w-10 sm:rounded-xl',
            )}
            style={{ backgroundColor: `${accent}18`, color: accent }}
          >
            <Icon name="graduation" size={compact ? 16 : 18} weight="medium" />
          </span>
          <Badge variant="program-type" type={program.type}>
            {program.type}
          </Badge>
        </div>
        {facultyName && (
          <span className="max-w-[46%] line-clamp-2 text-right font-heading text-[10px] font-semibold uppercase tracking-[0.1em] text-secondary/38">
            {facultyName}
          </span>
        )}
      </div>

      <h2
        className={cn(
          'relative mt-4 font-display leading-snug text-secondary line-clamp-2',
          compact ? 'text-lg' : 'mt-5 text-xl sm:text-[1.3rem]',
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
          <MetaPill icon="building" label={formatLabel} value={program.format} />
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
    </Link>
  );
}

function MetaPill({
  icon,
  label,
  value,
}: {
  icon: 'calendar' | 'building';
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

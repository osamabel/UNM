import { Icon } from '@/components/ui/Icon';
import { EVENT_KIND_ICON, type UniversityEventKind } from '@/lib/university-events-stub';
import { cn } from '@/lib/utils';

interface Props {
  kindLabel: string;
  date: string;
  title: string;
  location: string;
  kind: UniversityEventKind;
  className?: string;
}

export function EventCard({ kind, kindLabel, date, title, location, className }: Props) {
  const icon = EVENT_KIND_ICON[kind];

  return (
    <article className={cn('card-interactive grid min-w-0 gap-4 p-5 sm:grid-cols-[minmax(0,9.5rem)_1fr] sm:gap-6 sm:p-6', className)}>
      <div className="flex gap-3 sm:flex-col sm:gap-2">
        <span className="icon-box h-10 w-10 shrink-0 sm:h-11 sm:w-11">
          <Icon name={icon} size={20} />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
            {kindLabel}
          </p>
          <p className="mt-1 font-display text-lg leading-snug text-secondary sm:text-xl">{date}</p>
        </div>
      </div>
      <div className="min-w-0 sm:border-l sm:border-warm-150/60 sm:pl-6">
        <h3 className="font-display text-lg leading-snug text-secondary sm:text-xl">{title}</h3>
        <p className="mt-2 flex items-start gap-2 text-sm text-secondary/60">
          <Icon name="map-pin" size={16} className="mt-0.5 shrink-0 text-primary/70" />
          <span>{location}</span>
        </p>
      </div>
    </article>
  );
}

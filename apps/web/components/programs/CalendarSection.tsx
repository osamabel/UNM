import { useLocale, useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import type { Locale, Program } from '@unm/types';
import { formatDate, localized } from '@/lib/utils';

interface Props {
  program: Program;
}

export function CalendarSection({ program }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  const start = new Date(program.startDate);
  const deadline = new Date(start);
  deadline.setMonth(deadline.getMonth() - 1);

  return (
    <section className="card-flat p-6 sm:p-8">
      <p className="eyebrow">{t('calendar')}</p>
      <h2 className="mt-3 font-display text-display-md text-secondary">
        {locale === 'en' ? 'Key dates' : 'Dates clés'}
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <DateTile
          icon="calendar"
          label={t('startDate')}
          value={formatDate(program.startDate, locale)}
        />
        <DateTile
          icon="clock"
          label={t('deadline')}
          value={formatDate(deadline.toISOString(), locale)}
        />
      </div>
      {localized(program.schedule, locale) && (
        <p className="mt-5 flex gap-2 text-sm leading-relaxed text-secondary/70">
          <Icon name="clock" size={16} className="mt-0.5 shrink-0 text-primary/70" />
          {localized(program.schedule, locale)}
        </p>
      )}
    </section>
  );
}

function DateTile({
  icon,
  label,
  value,
}: {
  icon: 'calendar' | 'clock';
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-warm-150/80 bg-white/50 px-5 py-4">
      <p className="flex items-center gap-1.5 font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary/50">
        <Icon name={icon} size={14} className="text-primary/80" />
        {label}
      </p>
      <p className="mt-2 font-display text-xl text-secondary sm:text-2xl">{value}</p>
    </div>
  );
}

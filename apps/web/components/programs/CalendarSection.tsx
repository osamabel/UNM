import { useLocale, useTranslations } from 'next-intl';
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
    <section>
      <h2 className="font-display text-2xl text-secondary">{t('calendar')}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-warm-200 bg-white p-6">
          <p className="font-heading text-xs font-semibold uppercase tracking-wider text-secondary-400">
            {t('startDate')}
          </p>
          <p className="mt-2 font-display text-2xl text-secondary">
            {formatDate(program.startDate, locale)}
          </p>
        </div>
        <div className="rounded-card border border-warm-200 bg-white p-6">
          <p className="font-heading text-xs font-semibold uppercase tracking-wider text-secondary-400">
            {t('deadline')}
          </p>
          <p className="mt-2 font-display text-2xl text-secondary">
            {formatDate(deadline.toISOString(), locale)}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-secondary-400">
        {localized(program.schedule, locale)}
      </p>
    </section>
  );
}

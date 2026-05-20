import { useLocale, useTranslations } from 'next-intl';
import type { Locale, LocalizedField } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  outcomes: LocalizedField[];
}

export function OutcomesSection({ outcomes }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  if (!outcomes?.length) return null;
  return (
    <section>
      <h2 className="font-display text-2xl text-secondary">{t('outcomes')}</h2>
      <ul className="mt-6 space-y-3">
        {outcomes.map((o, i) => (
          <li key={i} className="flex gap-3 text-secondary">
            <svg viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true">
              <path
                fill="currentColor"
                d="m9 16.2-3.5-3.5L4 14.2 9 19.2l11-11-1.5-1.5z"
              />
            </svg>
            <span>{localized(o, locale)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

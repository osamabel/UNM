import { useLocale, useTranslations } from 'next-intl';
import type { Locale, LocalizedField } from '@unm/types';
import { localized } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

interface Props {
  outcomes: LocalizedField[];
}

export function OutcomesSection({ outcomes }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  if (!outcomes?.length) return null;
  return (
    <section>
      <h2 className="font-display text-display-md text-secondary">{t('outcomes')}</h2>
      <ul className="mt-6 space-y-3">
        {outcomes.map((o, i) => (
          <li
            key={i}
            className="card-flat flex gap-3 px-4 py-3 text-secondary"
          >
            <Icon name="check-circle" size={20} className="mt-0.5 shrink-0 text-primary" />
            <span>{localized(o, locale)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

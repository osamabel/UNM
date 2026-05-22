import { useLocale, useTranslations } from 'next-intl';
import type { Locale, LocalizedField } from '@unm/types';
import { localized } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

interface Props {
  skills: LocalizedField[];
}

export function SkillsGrid({ skills }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  if (!skills?.length) return null;
  return (
    <section>
      <h2 className="font-display text-display-md text-secondary">{t('skills')}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {skills.map((s, i) => (
          <li
            key={i}
            className="card-flat flex items-start gap-3 p-4 text-sm text-secondary"
          >
            <span
              aria-hidden="true"
              className="icon-box h-7 w-7 shrink-0 text-xs font-bold"
            >
              <Icon name="check" size={14} />
            </span>
            {localized(s, locale)}
          </li>
        ))}
      </ul>
    </section>
  );
}

import { useLocale, useTranslations } from 'next-intl';
import type { Locale, LocalizedField } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  skills: LocalizedField[];
}

export function SkillsGrid({ skills }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  if (!skills?.length) return null;
  return (
    <section>
      <h2 className="font-display text-2xl text-secondary">{t('skills')}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {skills.map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-card bg-warm-100 p-4 text-sm text-secondary"
          >
            <span aria-hidden="true" className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {i + 1}
            </span>
            {localized(s, locale)}
          </li>
        ))}
      </ul>
    </section>
  );
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import type { Faculty, Locale, LocalizedField } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  faculty: Faculty;
}

function BulletList({
  items,
  iconClass,
}: {
  items: LocalizedField[];
  iconClass: string;
}) {
  const locale = useLocale() as Locale;
  if (items.length === 0) return null;

  return (
    <ul className="mt-6 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="card-flat flex gap-3 p-4">
          <Icon name="check-circle" size={18} className={iconClass} />
          <span className="text-sm leading-relaxed text-secondary/80">
            {localized(item, locale)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function StrengthsSection({ faculty }: Props) {
  const t = useTranslations('facultyPage');
  const hasStrengths = (faculty.strengths?.length ?? 0) > 0;
  const hasOutcomes = (faculty.outcomes?.length ?? 0) > 0;
  if (!hasStrengths && !hasOutcomes) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
      {hasStrengths && (
        <div>
          <h2 className="font-display text-display-md text-secondary">{t('strengthsTitle')}</h2>
          <BulletList items={faculty.strengths ?? []} iconClass="mt-0.5 shrink-0 text-primary" />
        </div>
      )}
      {hasOutcomes && (
        <div>
          <h2 className="font-display text-display-md text-secondary">{t('outcomesTitle')}</h2>
          <BulletList items={faculty.outcomes ?? []} iconClass="mt-0.5 shrink-0 text-secondary/70" />
        </div>
      )}
    </div>
  );
}

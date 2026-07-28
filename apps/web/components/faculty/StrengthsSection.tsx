'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import type { Faculty, Locale, LocalizedField } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  faculty: Faculty;
}

function BulletList({ items }: { items: LocalizedField[] }) {
  const locale = useLocale() as Locale;
  if (items.length === 0) return null;

  return (
    <ul className="faculty-insight-list">
      {items.map((item, i) => (
        <li key={`${localized(item, 'fr')}-${i}`} className="faculty-insight-item">
          <Icon name="check-circle" size={18} className="faculty-insight-icon" />
          <span>{localized(item, locale)}</span>
        </li>
      ))}
    </ul>
  );
}

export function StrengthsSection({ faculty }: Props) {
  const t = useTranslations('facultyPage');
  const strengths = faculty.strengths ?? [];
  const outcomes = faculty.outcomes ?? [];
  const hasStrengths = strengths.length > 0;
  const hasOutcomes = outcomes.length > 0;
  if (!hasStrengths && !hasOutcomes) return null;

  return (
    <div className="faculty-insights">
      {hasStrengths ? (
        <ScrollReveal from="up" className="faculty-insights-col">
          <p className="eyebrow">{t('strengthsEyebrow')}</p>
          <h2 className="faculty-insights-title">{t('strengthsTitle')}</h2>
          <BulletList items={strengths} />
        </ScrollReveal>
      ) : null}
      {hasOutcomes ? (
        <ScrollReveal from="up" delay={100} className="faculty-insights-col">
          <p className="eyebrow">{t('outcomesEyebrow')}</p>
          <h2 className="faculty-insights-title">{t('outcomesTitle')}</h2>
          <BulletList items={outcomes} />
        </ScrollReveal>
      ) : null}
    </div>
  );
}

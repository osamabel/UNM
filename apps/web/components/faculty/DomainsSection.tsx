'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Icon } from '@/components/ui/Icon';
import { iconForDomain } from '@/lib/domain-icons';
import type { Faculty, Locale, LocalizedField } from '@unm/types';
import { localized } from '@/lib/utils';

function DomainChip({
  domain,
  locale,
  index,
}: {
  domain: LocalizedField;
  locale: Locale;
  index: number;
}) {
  const label = localized(domain, locale);
  const icon = iconForDomain(label);

  return (
    <li className="list-none">
      <ScrollReveal delay={80 + index * 55}>
        <span className="domain-chip">
          <Icon name={icon} size={15} className="domain-chip-icon shrink-0" aria-hidden />
          <span>{label}</span>
        </span>
      </ScrollReveal>
    </li>
  );
}

export function DomainsSection({ faculty }: { faculty: Faculty }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('facultyPage');
  const domains = faculty.domains ?? [];
  if (domains.length === 0) return null;

  return (
    <div className="min-w-0">
      <ScrollReveal>
        <p className="eyebrow">{t('domainsEyebrow')}</p>
        <h2 className="mt-3 font-display text-display-md text-secondary">{t('domainsTitle')}</h2>
      </ScrollReveal>

      <ul className="mt-8 flex flex-wrap justify-center gap-2.5 sm:justify-start lg:mt-10 lg:gap-3">
        {domains.map((d, i) => (
          <DomainChip key={`${localized(d, 'fr')}-${i}`} domain={d} locale={locale} index={i} />
        ))}
      </ul>
    </div>
  );
}

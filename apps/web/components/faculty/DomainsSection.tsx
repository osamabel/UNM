import { useLocale } from 'next-intl';
import type { Faculty, Locale } from '@unm/types';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { localized } from '@/lib/utils';

// Renders the "Domaines couverts" grid for a faculty. Hidden when the
// faculty has no domains attached (so the page layout stays clean).
export function DomainsSection({ faculty }: { faculty: Faculty }) {
  const locale = useLocale() as Locale;
  const isEn = locale === 'en';
  const domains = faculty.domains ?? [];
  if (domains.length === 0) return null;

  return (
    <SectionWrapper tone="default">
      <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        {isEn ? 'Disciplinary scope' : 'Périmètre disciplinaire'}
      </p>
      <h2 className="mt-3 font-display text-display-md text-secondary">
        {isEn ? 'Domains covered' : 'Domaines couverts'}
      </h2>
      <ul className="mt-8 flex flex-wrap gap-3">
        {domains.map((d, i) => (
          <li
            key={i}
            className="rounded-full border border-warm-300 bg-warm-100 px-4 py-2 font-heading text-sm font-semibold text-secondary"
          >
            {localized(d, locale)}
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

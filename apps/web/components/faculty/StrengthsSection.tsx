import { useLocale } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import type { Faculty, Locale } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  faculty: Faculty;
}

export function StrengthsSection({ faculty }: Props) {
  const locale = useLocale() as Locale;
  return (
    <SectionWrapper tone="alt">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-display-md text-secondary">
            {locale === 'en' ? 'Why this faculty' : 'Pourquoi cette faculté'}
          </h2>
          <ul className="mt-6 space-y-4">
            {faculty.strengths?.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span className="text-secondary">{localized(s, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-display-md text-secondary">
            {locale === 'en' ? 'Outcomes' : 'Débouchés'}
          </h2>
          <ul className="mt-6 space-y-4">
            {faculty.outcomes?.map((o, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                <span className="text-secondary">{localized(o, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}

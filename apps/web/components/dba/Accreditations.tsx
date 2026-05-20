import { useLocale } from 'next-intl';
import type { Locale } from '@unm/types';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { dbaContent } from '@/lib/dba-content';
import { localized } from '@/lib/utils';

export function Accreditations() {
  const locale = useLocale() as Locale;
  const { accreditations } = dbaContent;
  return (
    <SectionWrapper id="accreditations" tone="alt">
      <div className="max-w-3xl">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {localized(accreditations.eyebrow, locale)}
        </p>
        <h2 className="mt-3 font-display text-display-lg text-secondary">
          {localized(accreditations.title, locale)}
        </h2>
        <p className="mt-4 text-secondary-400">
          {localized(accreditations.intro, locale)}
        </p>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {accreditations.items.map((it) => (
          <li
            key={it.slug}
            className="flex flex-col items-center rounded-card border border-warm-200 bg-white p-6 text-center"
          >
            <span className="font-display text-3xl font-bold text-primary">
              {it.label}
            </span>
            <span className="mt-3 text-xs text-secondary-400 leading-snug">
              {localized(it.full, locale)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-16 rounded-card bg-secondary p-10 text-warm-50 sm:p-14">
        <h3 className="font-display text-display-md text-warm-50">
          {localized(accreditations.finalCallout.title, locale)}
        </h3>
        <p className="mt-4 max-w-3xl text-lg text-warm-100">
          {localized(accreditations.finalCallout.body, locale)}
        </p>
      </div>
    </SectionWrapper>
  );
}

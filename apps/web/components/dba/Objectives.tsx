import { useLocale } from 'next-intl';
import type { Locale } from '@unm/types';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { dbaContent } from '@/lib/dba-content';
import { localized } from '@/lib/utils';

export function Objectives() {
  const locale = useLocale() as Locale;
  const { objectives } = dbaContent;
  return (
    <SectionWrapper id="objectifs" tone="default">
      <div className="text-center">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {localized(objectives.eyebrow, locale)}
        </p>
        <h2 className="mt-3 font-display text-display-lg text-secondary">
          {localized(objectives.title, locale)}
        </h2>
      </div>

      <ul className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
        {objectives.items.map((o) => (
          <li
            key={o.index}
            className="relative rounded-card border border-warm-200 bg-white p-8 shadow-card"
          >
            <span
              aria-hidden="true"
              className="absolute -top-5 left-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-white shadow-card"
            >
              {o.index}
            </span>
            <p className="mt-3 font-display text-xl leading-snug text-secondary">
              {localized(o.title, locale)}
            </p>
          </li>
        ))}
      </ul>

      <figure className="mx-auto mt-12 max-w-3xl text-center">
        <blockquote className="font-display text-2xl italic text-secondary sm:text-3xl">
          « {localized(objectives.centralQuote, locale)} »
        </blockquote>
      </figure>
    </SectionWrapper>
  );
}

import { useLocale } from 'next-intl';
import type { Locale } from '@unm/types';
import { ButtonLink } from '@/components/ui/Button';
import { dbaContent } from '@/lib/dba-content';
import { localized } from '@/lib/utils';

/**
 * DBA Hero — full-bleed section with the institutional intro.
 * Uses the UNM red/brown palette to stay consistent with the rest of
 * the site; the partnership tags appear as chips inside.
 */
export function HeroDBA() {
  const locale = useLocale() as Locale;
  const { hero } = dbaContent;
  return (
    <section id="hero" className="bg-secondary text-warm-50">
      <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-[1.4fr_1fr] lg:py-24">
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.22em] text-primary-200">
            {localized(hero.eyebrow, locale)}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-display-xl leading-[1.05] text-warm-50">
            {localized(hero.title, locale)}
          </h1>
          <p className="mt-4 font-display text-2xl italic text-primary-200">
            {localized(hero.tagline, locale)}
          </p>
          <p className="mt-8 max-w-2xl text-lg text-warm-100 sm:text-xl">
            {localized(hero.pitch, locale)}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={hero.ctas.primary.href} size="lg">
              {localized(hero.ctas.primary.label, locale)}
            </ButtonLink>
            <ButtonLink
              href={hero.ctas.secondary.href}
              size="lg"
              variant="ghost"
              className="border border-warm-50/30 text-warm-50 hover:bg-warm-50/10"
            >
              {localized(hero.ctas.secondary.label, locale)}
            </ButtonLink>
          </div>
        </div>
        <ul
          aria-label={localized(hero.logosAriaLabel, locale)}
          className="grid grid-cols-3 gap-3 text-center sm:grid-cols-4 lg:grid-cols-2"
        >
          {['UNM', 'EBS', 'CEFDG', 'CDEFM', 'CGE', 'AACSB', 'EFMD'].map((label) => (
            <li
              key={label}
              className="flex h-16 items-center justify-center rounded-card border border-warm-50/15 bg-warm-50/5 font-heading text-sm font-semibold tracking-wide text-warm-50 backdrop-blur"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

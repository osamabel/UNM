import { useLocale } from 'next-intl';
import type { Locale } from '@unm/types';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { dbaContent } from '@/lib/dba-content';
import { localized } from '@/lib/utils';

export function PedagogyTimeline() {
  const locale = useLocale() as Locale;
  const { pedagogy } = dbaContent;
  return (
    <SectionWrapper id="contenu" tone="alt">
      <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {localized(pedagogy.eyebrow, locale)}
          </p>
          <h2 className="mt-3 font-display text-display-lg text-secondary">
            {localized(pedagogy.title, locale)}
          </h2>
          <p className="mt-4 max-w-2xl text-secondary-400">
            {localized(pedagogy.intro, locale)}
          </p>

          <div className="mt-10 space-y-10">
            {[pedagogy.year1, pedagogy.year2].map((year, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-white"
                  >
                    {idx + 1}
                  </span>
                  <h3 className="font-display text-2xl text-secondary">
                    {localized(year.label, locale)}
                  </h3>
                </div>
                <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                  {year.seminars.map((s) => (
                    <li
                      key={s.index}
                      className="rounded-card border border-warm-200 bg-white p-5"
                    >
                      <span className="font-heading text-xs font-bold uppercase tracking-wider text-primary">
                        {locale === 'en' ? 'Seminar' : 'Séminaire'} {s.index}
                      </span>
                      <p className="mt-1 font-display text-lg text-secondary">
                        {localized(s.title, locale)}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}

            <div className="rounded-card border-l-4 border-primary bg-secondary p-6 text-warm-50">
              <p className="font-display text-xl">
                🎓 {localized(pedagogy.defence, locale)}
              </p>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="rounded-card bg-primary p-8 text-white shadow-card-hover">
            <p className="font-heading text-xs font-semibold uppercase tracking-wider text-primary-100">
              {locale === 'en' ? 'Programme essence' : 'L’essence du programme'}
            </p>
            <p className="mt-3 font-display text-xl leading-snug">
              {localized(pedagogy.sideCallout, locale)}
            </p>
          </div>
        </aside>
      </div>
    </SectionWrapper>
  );
}

import { useLocale } from 'next-intl';
import type { Locale } from '@unm/types';
import { dbaContent } from '@/lib/dba-content';
import { localized } from '@/lib/utils';

// Dark band rendering the 6 key facts about the DBA (rythme, durée, …).
export function KeyInfoBand() {
  const locale = useLocale() as Locale;
  const { keyInfo } = dbaContent;
  return (
    <section
      aria-label={localized(keyInfo.title, locale)}
      className="bg-secondary py-12 text-warm-50"
    >
      <div className="container-page">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
          {localized(keyInfo.title, locale)}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-y-6 gap-x-8 sm:grid-cols-3 lg:grid-cols-6">
          {keyInfo.items.map((it, i) => (
            <div key={i}>
              <dt className="text-xs uppercase tracking-wider text-warm-300">
                {localized(it.label, locale)}
              </dt>
              <dd className="mt-1 font-display text-xl text-warm-50">
                {localized(it.value, locale)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

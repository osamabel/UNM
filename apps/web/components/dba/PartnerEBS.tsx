import { useLocale } from 'next-intl';
import type { Locale } from '@unm/types';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { dbaContent } from '@/lib/dba-content';
import { localized } from '@/lib/utils';

export function PartnerEBS() {
  const locale = useLocale() as Locale;
  const { partner } = dbaContent;
  return (
    <SectionWrapper id="partenaire" tone="default">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {localized(partner.eyebrow, locale)}
          </p>
          <h2 className="mt-3 font-display text-display-lg text-secondary">
            {localized(partner.title, locale)}
          </h2>
          <figure className="mt-8 rounded-card border-l-4 border-primary bg-warm-100 p-6">
            <blockquote className="font-display text-xl text-secondary">
              « {localized(partner.pullquote, locale)} »
            </blockquote>
          </figure>
        </div>
        <div className="space-y-6 text-secondary">
          {partner.paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed">
              {localized(p, locale)}
            </p>
          ))}
          <div className="mt-8 rounded-card bg-secondary p-6 text-warm-50">
            <p className="font-heading text-xs font-semibold uppercase tracking-wider text-primary-200">
              {locale === 'en' ? 'History' : 'Histoire'}
            </p>
            <h3 className="mt-2 font-display text-2xl">
              {localized(partner.history.title, locale)}
            </h3>
            <p className="mt-3 text-warm-100">
              {localized(partner.history.body, locale)}
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

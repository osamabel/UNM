import { useLocale } from 'next-intl';
import type { Locale } from '@unm/types';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { dbaContent } from '@/lib/dba-content';
import { localized } from '@/lib/utils';

export function ProgramUNM() {
  const locale = useLocale() as Locale;
  const { programme } = dbaContent;
  return (
    <SectionWrapper id="programme" tone="alt">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {localized(programme.eyebrow, locale)}
          </p>
          <h2 className="mt-3 font-display text-display-lg text-secondary">
            {localized(programme.title, locale)}
          </h2>
          <div className="mt-6 space-y-5 text-secondary">
            {programme.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed">
                {localized(p, locale)}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-card bg-primary p-8 text-white shadow-card-hover">
            <p className="font-display text-2xl italic leading-snug">
              « {localized(programme.baseline, locale)} »
            </p>
          </div>
          <div className="rounded-card border border-warm-200 bg-white p-6">
            <h3 className="font-display text-xl text-secondary">
              {localized(programme.partnership.title, locale)}
            </h3>
            <div className="mt-3 space-y-3 text-secondary-400">
              {programme.partnership.paragraphs.map((p, i) => (
                <p key={i}>{localized(p, locale)}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

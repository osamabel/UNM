import { useLocale, useTranslations } from 'next-intl';
import type { Locale, Program } from '@unm/types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  program: Program;
}

export function TuitionSection({ program }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');

  return (
    <section className="card-flat overflow-hidden p-0">
      <div className="border-b border-warm-150/70 bg-warm-50/60 px-6 py-5 sm:px-8">
        <p className="eyebrow">{t('tuition')}</p>
        <p className="mt-2 font-display text-3xl text-secondary sm:text-4xl">
          {program.tuitionFee != null
            ? formatCurrency(program.tuitionFee, locale)
            : t('tuitionOnRequest')}
        </p>
      </div>
      <p className="px-6 py-5 text-sm leading-relaxed text-secondary/70 sm:px-8">
        {locale === 'en'
          ? 'Financing solutions and partnerships available. Contact us for a personalized study.'
          : 'Solutions de financement et partenariats disponibles. Contactez-nous pour une étude personnalisée.'}
      </p>
    </section>
  );
}

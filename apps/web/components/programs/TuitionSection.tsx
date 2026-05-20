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
    <section>
      <h2 className="font-display text-2xl text-secondary">{t('tuition')}</h2>
      <div className="mt-4 rounded-card bg-warm-100 p-6">
        <p className="font-display text-3xl text-secondary">
          {program.tuitionFee != null
            ? formatCurrency(program.tuitionFee, locale)
            : t('tuitionOnRequest')}
        </p>
        <p className="mt-2 text-sm text-secondary-400">
          {locale === 'en'
            ? 'Financing solutions and partnerships available. Contact us for a personalized study.'
            : 'Solutions de financement et partenariats disponibles. Contactez-nous pour une étude personnalisée.'}
        </p>
      </div>
    </section>
  );
}

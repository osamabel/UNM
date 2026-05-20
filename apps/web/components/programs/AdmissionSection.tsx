import { useLocale, useTranslations } from 'next-intl';
import type { Locale, Program } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  program: Program;
}

export function AdmissionSection({ program }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  return (
    <section>
      <h2 className="font-display text-2xl text-secondary">{t('admission')}</h2>
      <div className="prose mt-4 max-w-prose text-secondary">
        <p>{localized(program.admissionRequirements, locale)}</p>
      </div>
    </section>
  );
}

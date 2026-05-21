import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import type { Locale } from '@unm/types';

export function FacultyCTA() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  return (
    <SectionWrapper tone="dark">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <h2 className="font-display text-display-md">
          {locale === 'en'
            ? 'Take the next step'
            : 'Passez à l’étape suivante'}
        </h2>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={locale === 'en' ? '/en/admissions' : '/admissions'} size="lg">
            {t('apply')}
          </ButtonLink>
          <ButtonLink href="#brochure" size="lg" variant="ghost" className="text-warm-50 hover:bg-warm-50/10">
            {t('downloadBrochure')}
          </ButtonLink>
        </div>
      </div>
    </SectionWrapper>
  );
}

import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import type { Locale } from '@unm/types';

// Institutional hero — no radial gradient, no oversized headline.
// The serif H1 + a single fine rule under the eyebrow do the talking.
export function HeroSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');

  return (
    <section className="bg-warm-50">
      <div className="container-page py-20 lg:py-28">
        <p className="eyebrow">{t('heroEyebrow')}</p>
        <h1 className="mt-5 max-w-3xl font-display text-display-xl text-secondary">
          {t('heroTitle')}
        </h1>
        <p className="mt-6 max-w-2xl text-secondary-400">
          {t('heroSubtitle')}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={locale === 'en' ? '/en/programs' : '/programmes'}>
            {t('heroCta1')}
          </ButtonLink>
          <ButtonLink href={locale === 'en' ? '/en/admissions' : '/admissions'} variant="ghost">
            {t('heroCta2')}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

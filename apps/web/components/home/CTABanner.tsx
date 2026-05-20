import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@unm/types';

export function CTABanner() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const tc = useTranslations('common');
  return (
    <section className="bg-primary text-white">
      <div className="container-page flex flex-col items-start justify-between gap-6 py-16 lg:flex-row lg:items-center lg:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-display-md">{t('ctaBannerTitle')}</h2>
          <p className="mt-2 text-white/90">{t('ctaBannerSubtitle')}</p>
        </div>
        <Link href={locale === 'en' ? '/en/admissions' : '/admissions'}>
          <Button variant="secondary" size="lg">{tc('applyNow')}</Button>
        </Link>
      </div>
    </section>
  );
}

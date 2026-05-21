'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { HeroStatsGrid } from '@/components/home/HeroStats';
import { Icon } from '@/components/ui/Icon';
import type { Locale } from '@unm/types';

const PROOF = [
  { icon: 'shield' as const, fr: 'Partenariat EBS Paris', en: 'EBS Paris partnership' },
  { icon: 'building' as const, fr: 'Marrakech · Laâyoune', en: 'Marrakech · Laâyoune' },
  { icon: 'graduation' as const, fr: 'MBA · DBA · Executive', en: 'MBA · DBA · Executive' },
] as const;

export function HeroSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const isEn = locale === 'en';

  return (
    <section
      id="hero"
      className="relative scroll-mt-24 overflow-hidden border-b border-warm-150/70 bg-canvas"
    >
      <div
        className="hero-blob -right-20 -top-20 h-72 w-72 bg-primary/10"
        aria-hidden
        style={{ animationDelay: '0s' }}
      />
      <div
        className="hero-blob bottom-0 left-1/4 h-56 w-56 bg-secondary/5"
        aria-hidden
        style={{ animationDelay: '-4s', animationDuration: '18s' }}
      />
      <div className="hero-bg pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-page relative min-w-0">
        <div className="grid min-w-0 items-center gap-8 py-12 sm:gap-10 sm:py-16 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:py-20 lg:gap-16 lg:py-24 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="hero-enter min-w-0 overflow-hidden">
            <p className="eyebrow animate-fade-in">{t('heroEyebrow')}</p>
            <div
              className="mt-4 h-0.5 w-12 origin-left animate-scale-in bg-primary"
              style={{ animationDelay: '0.15s' }}
              aria-hidden
            />
            <h1 className="mt-5 max-w-2xl break-words font-display text-display-xl text-secondary sm:mt-6 xl:max-w-3xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-secondary/75 sm:text-lg">
              {t('heroSubtitle')}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ButtonLink
                href={isEn ? '/en/programs' : '/programmes'}
                size="lg"
                className="w-full sm:w-auto"
                trailingIcon={<Icon name="arrow-right" size={18} />}
              >
                {t('heroCta1')}
              </ButtonLink>
              <ButtonLink
                href={isEn ? '/en/admissions' : '/admissions'}
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
              >
                {t('heroCta2')}
              </ButtonLink>
            </div>
            <ul className="proof-pills -mx-1 mt-8 border-t border-warm-150/80 px-1 pt-6 sm:mt-10 sm:pt-8">
              {PROOF.map((p, i) => (
                <li
                  key={p.icon}
                  className="glass-pill"
                  style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                >
                  <Icon name={p.icon} size={16} className="text-primary" />
                  <span>{isEn ? p.en : p.fr}</span>
                </li>
              ))}
            </ul>

            {/* Mobile: stats condensed under hero copy */}
            <div className="glass-dark relative mt-8 overflow-hidden rounded-2xl p-4 md:hidden">
              <div className="hero-panel-pattern absolute inset-0" aria-hidden />
              <div className="relative">
                <p className="text-center font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-200">
                  {t('statsEyebrow')}
                </p>
                <HeroStatsGrid compact className="mt-3" />
                {t('statsSource') && (
                  <p className="mt-3 text-center text-[10px] text-warm-400/80">{t('statsSource')}</p>
                )}
              </div>
            </div>
          </div>

          <aside
            className="hero-enter hero-panel-float glass-dark relative hidden min-w-0 overflow-hidden rounded-2xl md:block"
          >
            <div className="hero-panel-pattern absolute inset-0" />
            <div className="relative flex min-h-[300px] flex-col justify-between p-6 lg:min-h-[380px] lg:p-8">
              <div>
                <span className="inline-flex items-center gap-2">
                  <Icon name="graduation" size={20} className="text-primary-200" />
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-200">
                    UNM
                  </p>
                </span>
                <p className="mt-3 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-200">
                  {t('statsEyebrow')}
                </p>
                <p className="mt-2 max-w-[14rem] font-display text-xl font-semibold leading-snug text-warm-50 lg:text-2xl">
                  {t('statsTitle')}
                </p>
              </div>
              <div>
                <HeroStatsGrid compact className="gap-2" />
                {t('statsSource') && (
                  <p className="divider-fine mt-4 text-center text-[10px] text-warm-400/80 lg:mt-5">
                    {t('statsSource')}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

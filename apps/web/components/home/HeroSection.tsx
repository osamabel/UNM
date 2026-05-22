'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { Locale } from '@unm/types';

const PROOF = [
  { icon: 'handshake' as const, fr: 'Partenariat EBS Paris', en: 'EBS Paris partnership' },
  { icon: 'briefcase' as const, fr: 'MBA · DBA · Executive', en: 'MBA · DBA · Executive' },
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
          </div>

          <aside className="hero-enter hero-panel-float relative min-w-0">
            <div className="card-flat relative aspect-[4/5] overflow-hidden sm:aspect-[5/6] md:aspect-auto md:min-h-[320px] lg:min-h-[400px]">
              <Image
                src="/section1.jpeg"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 520px"
                className="object-cover object-center"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/25 via-transparent to-transparent md:bg-gradient-to-l md:from-secondary/20 md:via-transparent md:to-transparent"
                aria-hidden
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

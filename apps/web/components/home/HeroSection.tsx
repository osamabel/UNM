'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Locale } from '@unm/types';

const TRUST_CARDS: { key: 'heroTrust1' | 'heroTrust2' | 'heroTrust3'; icon: IconName }[] = [
  { key: 'heroTrust1', icon: 'handshake' },
  { key: 'heroTrust2', icon: 'briefcase' },
  { key: 'heroTrust3', icon: 'clock' },
];

export function HeroSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const isEn = locale === 'en';
  const gradAlt = isEn
    ? 'UNM graduates celebrating their achievement'
    : 'Diplômés UNM célébrant leur réussite';

  return (
    <section
      id="hero"
      className="hero-bg-photo relative scroll-mt-24 overflow-hidden"
      aria-label={gradAlt}
    >
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/home1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_36%] scale-[1.02]"
        />
      </div>

      <div className="hero-bg-scrub pointer-events-none absolute inset-0" aria-hidden />

      <ul
        className="hero-float-rail"
        aria-label={isEn ? 'Trust signals' : 'Signaux de confiance'}
      >
        {TRUST_CARDS.map((card, i) => (
          <li
            key={card.key}
            className={`hero-float-card hero-float-card--${i + 1}`}
          >
            <span className="hero-float-card-sheen" aria-hidden />
            <span className="hero-float-card-icon" aria-hidden>
              <Icon name={card.icon} size={15} />
            </span>
            <span className="hero-float-card-title">{t(card.key)}</span>
          </li>
        ))}
      </ul>

      <div className="container-page relative z-10 min-w-0">
        <div className="flex min-w-0 items-center justify-start py-20 sm:py-24 md:py-28 lg:min-h-[min(78vh,46rem)] lg:py-32">
          <div className="hero-enter hero-copy flex w-full max-w-2xl min-w-0 flex-col text-left">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary sm:w-10" aria-hidden />
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-primary-200">
                {t('heroEyebrow')}
              </p>
            </div>

            <h1 className="mt-5 font-display text-[2.55rem] leading-[1.04] tracking-tight text-warm-50 sm:mt-6 sm:text-[3.1rem] lg:text-[3.55rem]">
              {t('heroTitle')}
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-[1.65] text-warm-100/95 sm:mt-6 sm:text-base lg:text-[1.05rem]">
              {t('heroSubtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-3.5">
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
                className="hero-cta-outline w-full sm:w-auto"
              >
                {t('heroCta2')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

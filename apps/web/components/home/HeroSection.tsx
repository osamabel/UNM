'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { Locale } from '@unm/types';

const FLOAT_CARDS = [
  {
    icon: 'handshake' as const,
    labelFr: 'Alliance',
    labelEn: 'Alliance',
    fr: 'Partenariat EBS Paris',
    en: 'EBS Paris partnership',
  },
  {
    icon: 'briefcase' as const,
    labelFr: 'Programmes',
    labelEn: 'Programs',
    fr: 'MBA · DBA · Executive',
    en: 'MBA · DBA · Executive',
  },
] as const;

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
          className="object-cover object-[center_36%]"
        />
      </div>

      <div className="hero-bg-scrub pointer-events-none absolute inset-0" aria-hidden />

      <ul
        className="hero-float-rail"
        aria-label={isEn ? 'Highlights' : 'Points clés'}
      >
        {FLOAT_CARDS.map((card, i) => (
          <li key={card.icon} className={`hero-float-card hero-float-card--${i + 1}`}>
            <span className="hero-float-card-glow" aria-hidden />
            <span className="hero-float-card-icon" aria-hidden>
              <Icon name={card.icon} size={16} />
            </span>
            <span className="hero-float-card-body">
              <span className="hero-float-card-label">
                {isEn ? card.labelEn : card.labelFr}
              </span>
              <span className="hero-float-card-title">
                {isEn ? card.en : card.fr}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="container-page relative z-10 min-w-0">
        <div className="flex min-w-0 items-center justify-start py-16 sm:py-20 md:py-24 lg:min-h-[min(82vh,48rem)] lg:py-28">
          <div className="hero-enter hero-copy flex w-full max-w-xl min-w-0 flex-col text-left md:max-w-lg lg:max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary sm:w-10" aria-hidden />
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-primary-200">
                {t('heroEyebrow')}
              </p>
            </div>

            <h1 className="mt-4 font-display text-[2.4rem] leading-[1.05] tracking-tight text-warm-50 sm:mt-5 sm:text-[2.85rem] lg:text-[3.35rem]">
              {t('heroTitle')}
            </h1>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white sm:mt-5 sm:text-base">
              {t('heroSubtitle')}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
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

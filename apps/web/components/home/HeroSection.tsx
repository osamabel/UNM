'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { HeroFloatCards } from '@/components/home/HeroFloatCards';
import type { Locale, Partner } from '@unm/types';

interface Props {
  partners?: Partner[];
}

export function HeroSection({ partners = [] }: Props) {
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
          src="/hero-home.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="hero-bg-image object-cover"
        />
      </div>

      <div className="hero-bg-scrub pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-bg-vignette pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-page relative z-10 min-w-0">
        <div className="hero-stage">
          <div className="hero-enter hero-copy">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-rule" aria-hidden />
              <p>{t('heroEyebrow')}</p>
            </div>

            <h1 className="hero-title">{t('heroTitle')}</h1>

            <p className="hero-subtitle">{t('heroSubtitle')}</p>

            <p className="hero-story">{t('heroStory')}</p>

            <div className="hero-actions">
              <ButtonLink
                href={isEn ? '/en/programs' : '/programmes'}
                size="lg"
                className="hero-cta-primary w-full sm:w-auto"
                trailingIcon={<Icon name="arrow-right" size={18} />}
              >
                {t('heroCta1')}
              </ButtonLink>
              <ButtonLink
                href={isEn ? '/en/admissions' : '/admissions'}
                variant="ghost"
                size="lg"
                className="hero-cta-secondary w-full sm:w-auto"
              >
                {t('heroCta2')}
              </ButtonLink>
            </div>
          </div>

          <HeroFloatCards partners={partners} />
        </div>
      </div>
    </section>
  );
}

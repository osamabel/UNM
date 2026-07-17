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
        className="hero-blob -right-16 -top-16 h-64 w-64 bg-primary/8"
        aria-hidden
        style={{ animationDelay: '0s' }}
      />
      <div
        className="hero-blob bottom-0 left-1/3 h-48 w-48 bg-secondary/5"
        aria-hidden
        style={{ animationDelay: '-4s', animationDuration: '18s' }}
      />
      <div className="hero-bg pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-page relative min-w-0">
        <div className="grid min-w-0 items-stretch gap-6 py-10 sm:gap-8 sm:py-14 md:grid-cols-2 md:gap-8 md:py-16 lg:gap-10 lg:py-20 xl:gap-12">
          {/* Copy */}
          <div className="hero-enter flex min-w-0 flex-col justify-center overflow-hidden md:py-2 lg:py-4">
            <p className="eyebrow animate-fade-in">{t('heroEyebrow')}</p>
            <div
              className="mt-3 h-0.5 w-12 origin-left animate-scale-in bg-primary"
              style={{ animationDelay: '0.15s' }}
              aria-hidden
            />
            <h1 className="mt-4 max-w-xl break-words font-display text-display-xl text-secondary sm:mt-5">
              {t('heroTitle')}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-secondary/75 sm:mt-5 sm:text-lg">
              {t('heroSubtitle')}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
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
            <ul className="proof-pills -mx-1 mt-7 border-t border-warm-150/80 px-1 pt-5 sm:mt-8 sm:pt-6">
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

          {/* Full graduation photo — 3:2 native ratio, no crop */}
          <aside className="hero-enter relative flex min-w-0 items-center md:pl-1 lg:pl-2">
            <div className="relative w-full overflow-hidden rounded-2xl border border-warm-150/60 bg-warm-50 shadow-[0_20px_50px_-24px_rgba(61,26,11,0.35)]">
              <Image
                src="/unmgrad.png"
                alt={
                  isEn
                    ? 'UNM graduates celebrating their achievement'
                    : 'Diplômés UNM célébrant leur réussite'
                }
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 560px"
                className="h-auto w-full"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

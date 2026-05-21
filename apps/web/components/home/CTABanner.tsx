'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Icon } from '@/components/ui/Icon';
import type { Locale } from '@unm/types';
import { cn } from '@/lib/utils';

export function CTABanner() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const isEn = locale === 'en';

  const admissionsHref = isEn ? '/en/admissions' : '/admissions';
  const contactHref = isEn ? '/en/contact' : '/contact';

  return (
    <SectionWrapper id="candidater" tone="canvas" className="!py-10 sm:!py-12 lg:!pb-14">
      <ScrollReveal>
        <div className="glass-dark relative overflow-hidden rounded-2xl">
          <div className="hero-panel-pattern absolute inset-0" aria-hidden />
          <div
            className="pointer-events-none absolute -right-16 -top-12 h-56 w-56 rounded-full bg-primary/20 blur-3xl motion-reduce:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-10 left-1/4 h-40 w-40 rounded-full bg-primary/10 blur-3xl motion-reduce:hidden"
            aria-hidden
          />

          <div
            className={cn(
              'relative flex flex-col gap-8 px-8 py-12 text-warm-50 sm:px-12 sm:py-14',
              'lg:flex-row lg:items-center lg:justify-between lg:gap-12 xl:px-14',
            )}
          >
            <div className="max-w-2xl">
              <p className="eyebrow text-primary-200">{t('ctaBannerEyebrow')}</p>
              <div
                className="mt-4 h-0.5 w-10 origin-left animate-scale-in bg-primary/70 motion-reduce:animate-none"
                aria-hidden
              />
              <h2 className="mt-5 font-display text-display-md text-warm-50 sm:max-w-xl">
                {t('ctaBannerTitle')}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-warm-200/90 sm:text-lg">
                {t('ctaBannerSubtitle')}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[15rem] lg:items-stretch">
              <ButtonLink
                href={admissionsHref}
                size="lg"
                className="w-full sm:w-auto"
                trailingIcon={<Icon name="arrow-right" size={18} />}
              >
                {tc('applyNow')}
              </ButtonLink>
              <ButtonLink
                href={contactHref}
                variant="ghost"
                size="lg"
                className="w-full border border-white/20 bg-white/5 text-warm-50 hover:bg-white/10 sm:w-auto"
              >
                {tc('contactUs')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}

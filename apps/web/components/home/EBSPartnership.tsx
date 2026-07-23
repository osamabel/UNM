'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Icon } from '@/components/ui/Icon';
import {
  getEbsAllianceLockup,
  type AllianceLogoEntry,
} from '@/lib/partner-logos';
import { EBS_PHOTOS } from '@/lib/program-images';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { getBrandLogoSrc } from '@/lib/site-settings';
import { cn } from '@/lib/utils';
import type { Locale, Partner } from '@unm/types';

const WHY = [
  { title: 'why1Title', body: 'why1Body' },
  { title: 'why2Title', body: 'why2Body' },
  { title: 'why3Title', body: 'why3Body' },
  { title: 'why4Title', body: 'why4Body' },
] as const;

const PRINCIPLES = ['principle1', 'principle2', 'principle3', 'principle4'] as const;

function AllianceLogoMark({
  entry,
  side,
}: {
  entry: AllianceLogoEntry;
  side: 'unm' | 'ebs';
}) {
  if (!entry.src) {
    return (
      <div className={cn('alliance-mark', `alliance-mark--${side}`)}>
        <span className="alliance-mark-fallback">{entry.name}</span>
      </div>
    );
  }

  const fromCms = entry.src.startsWith('/cms-media/');

  return (
    <div
      className={cn('alliance-mark', `alliance-mark--${side}`)}
      style={{ ['--logo-scale' as string]: entry.scale }}
    >
      <Image
        src={entry.src}
        alt={entry.name}
        width={480}
        height={180}
        sizes="(max-width: 640px) 44vw, 280px"
        quality={95}
        unoptimized={fromCms}
        className="alliance-mark-img"
        priority
      />
    </div>
  );
}

export function EBSPartnership({ partners = [] }: { partners?: Partner[] }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('ebs');
  const settings = useSiteSettings();
  const programsHref = locale === 'en' ? '/en/programs' : '/programmes';
  const partnersHref = locale === 'en' ? '/en/partners' : '/partenaires';
  const [unm, ebs] = getEbsAllianceLockup(partners, getBrandLogoSrc(settings));

  return (
    <SectionWrapper
      id="partenariat"
      tone="soft"
      className="alliance-section !bg-transparent !pb-16 !pt-14 sm:!pb-20 sm:!pt-16 lg:!pb-24 lg:!pt-20"
    >
      <div className="alliance-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative grid min-w-0 items-start gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
        <ScrollReveal className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" aria-hidden />
            <p className="eyebrow !mt-0">{t('eyebrow')}</p>
          </div>

          <h2 className="alliance-title mt-4 text-balance">{t('title')}</h2>
          <p className="alliance-lead mt-5 max-w-xl font-medium text-secondary/80">
            {t('tagline')}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-secondary/65 sm:text-[0.95rem]">
            {t('intro1')}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-secondary/65 sm:text-[0.95rem]">
            {t('intro2')}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={programsHref}
              className="btn-uni btn-uni-primary inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm"
            >
              {t('learnMore')}
              <Icon name="arrow-right" size={16} className="btn-arrow" />
            </Link>
            <Link
              href={partnersHref}
              className="btn-uni btn-uni-ghost inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm"
            >
              {t('partnersLink')}
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80} className="lg:col-span-7">
          <div className="alliance-visual">
            <div className="alliance-visual-frame">
              <Image
                src={EBS_PHOTOS.campusLife}
                alt={t('photoAlt')}
                width={1909}
                height={1273}
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="alliance-visual-img"
                priority
              />
              <div className="alliance-visual-veil" aria-hidden />
            </div>

            <div className="alliance-lockup alliance-lockup--overlay" aria-label={t('title')}>
              <AllianceLogoMark entry={unm} side="unm" />
              <span className="alliance-lockup-x" aria-hidden>
                ×
              </span>
              <AllianceLogoMark entry={ebs} side="ebs" />
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={100}>
        <div className="alliance-narrative relative mt-12 max-w-4xl sm:mt-14 lg:mt-16">
          <h3 className="font-display text-xl text-secondary sm:text-2xl">{t('allianceTitle')}</h3>
          <p className="mt-3 text-sm leading-relaxed text-secondary/68 sm:text-[0.95rem]">
            {t('allianceLead')}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-secondary/68 sm:text-[0.95rem]">
            {t('intro3')}
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            {t('principlesLabel')}
          </p>
          <ul className="alliance-principles mt-3">
            {PRINCIPLES.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </div>
      </ScrollReveal>

      <div className="relative mt-12 sm:mt-14">
        <ScrollReveal>
          <h3 className="font-display text-xl text-secondary sm:text-2xl">{t('whyTitle')}</h3>
        </ScrollReveal>
        <ul className="alliance-pillars mt-6 sm:mt-8">
          {WHY.map((item, i) => (
            <li key={item.title} className="alliance-pillar">
              <ScrollReveal delay={80 + i * 60}>
                <p className="alliance-pillar-num">{String(i + 1).padStart(2, '0')}</p>
                <h4 className="alliance-pillar-title">{t(item.title)}</h4>
                <p className="alliance-pillar-body">{t(item.body)}</p>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}

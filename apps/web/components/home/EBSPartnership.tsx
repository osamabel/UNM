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
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { getBrandLogoSrc } from '@/lib/site-settings';
import { cn } from '@/lib/utils';
import type { Locale, Partner } from '@unm/types';

const PILLARS = [
  { key: 'pillar1' as const, icon: 'medal' as const, num: '01' },
  { key: 'pillar2' as const, icon: 'landmark' as const, num: '02' },
  { key: 'pillar3' as const, icon: 'target' as const, num: '03' },
];

function AllianceLogoMark({
  entry,
  className,
}: {
  entry: AllianceLogoEntry;
  className?: string;
}) {
  return (
    <div className={cn('flex h-12 items-center justify-center sm:h-14', className)}>
      <Image
        src={entry.src}
        alt={entry.name}
        width={280}
        height={84}
        sizes="(max-width: 640px) 120px, 180px"
        quality={95}
        className="h-full w-auto max-w-[8.5rem] object-contain object-center sm:max-w-[10rem]"
      />
    </div>
  );
}

export function EBSPartnership({ partners = [] }: { partners?: Partner[] }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('ebs');
  const settings = useSiteSettings();
  const allianceHref = locale === 'en' ? '/en/university' : '/universite';
  const [unm, ebs] = getEbsAllianceLockup(partners, getBrandLogoSrc(settings));

  return (
    <SectionWrapper
      id="partenariat"
      tone="soft"
      className="alliance-section !pb-16 !pt-14 sm:!pb-20 sm:!pt-16 lg:!pb-24 lg:!pt-20"
    >
      <div className="alliance-glow pointer-events-none absolute inset-0" aria-hidden />

      {/* Intro + lockup */}
      <div className="relative grid min-w-0 items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <ScrollReveal className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" aria-hidden />
            <p className="eyebrow !mt-0">{t('eyebrow')}</p>
          </div>

          <h2 className="mt-4 font-display text-[2.15rem] leading-[1.05] tracking-tight text-secondary sm:text-[2.55rem] lg:text-[2.9rem]">
            <span className="text-primary">UNM</span>
            <span className="mx-2 text-primary/40">×</span>
            <span>EBS Paris</span>
          </h2>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-secondary/70 sm:text-base">
            {t('description')}
          </p>

          <Link
            href={allianceHref}
            className="btn-uni btn-uni-primary mt-7 inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm"
          >
            {t('learnMore')}
            <Icon name="arrow-right" size={16} className="btn-arrow" />
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={90} className="lg:col-span-7">
          <div className="alliance-duo relative mx-auto w-full max-w-xl lg:ml-auto lg:max-w-none" aria-label={t('title')}>
            <div className="alliance-duo-grid">
              <div className="alliance-duo-tile alliance-duo-tile--unm">
                <AllianceLogoMark entry={unm} />
              </div>
              <div className="alliance-duo-tile alliance-duo-tile--ebs">
                <AllianceLogoMark entry={ebs} />
              </div>
            </div>
            <span className="alliance-duo-badge" aria-hidden>
              ×
            </span>
          </div>
        </ScrollReveal>
      </div>

      {/* Pillars band */}
      <div className="alliance-band relative mt-14 sm:mt-16 lg:mt-20">
        <ul className="grid min-w-0 gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
          {PILLARS.map((pillar, i) => (
            <li key={pillar.key}>
              <ScrollReveal delay={110 + i * 80} className="h-full">
                <article className="alliance-pillar-card group h-full">
                  <div className="flex items-start justify-between gap-3">
                    <span className="alliance-pillar-icon" aria-hidden>
                      <Icon name={pillar.icon} size={18} />
                    </span>
                    <span className="alliance-pillar-num">{pillar.num}</span>
                  </div>
                  <h3 className="mt-5 font-display text-lg leading-snug text-secondary transition-colors duration-300 group-hover:text-primary sm:text-xl">
                    {t(`${pillar.key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary/60">
                    {t(`${pillar.key}Body`)}
                  </p>
                </article>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}

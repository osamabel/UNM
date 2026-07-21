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
  { key: 'pillar1' as const, num: '01' },
  { key: 'pillar2' as const, num: '02' },
  { key: 'pillar3' as const, num: '03' },
];

function AllianceLogoMark({
  entry,
  side,
  caption,
}: {
  entry: AllianceLogoEntry;
  side: 'unm' | 'ebs';
  caption: string;
}) {
  if (!entry.src) {
    return (
      <div className={cn('alliance-mark', `alliance-mark--${side}`)}>
        <span className="alliance-mark-fallback">{entry.name}</span>
        <span className="alliance-mark-caption">{caption}</span>
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
      <span className="alliance-mark-caption">{caption}</span>
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
      className="alliance-section !bg-transparent !pb-16 !pt-14 sm:!pb-20 sm:!pt-16 lg:!pb-24 lg:!pt-20"
    >
      <div className="alliance-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative grid min-w-0 items-center gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
        <ScrollReveal className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" aria-hidden />
            <p className="eyebrow !mt-0">{t('eyebrow')}</p>
          </div>

          <h2 className="alliance-title mt-4">
            <span className="text-primary">UNM</span>
            <span className="alliance-title-x" aria-hidden>
              ×
            </span>
            <span>EBS Paris</span>
          </h2>

          <p className="alliance-lead mt-5 max-w-md">{t('description')}</p>

          <Link
            href={allianceHref}
            className="btn-uni btn-uni-primary mt-7 inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm"
          >
            {t('learnMore')}
            <Icon name="arrow-right" size={16} className="btn-arrow" />
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={80} className="lg:col-span-7">
          <div className="alliance-lockup" aria-label={t('title')}>
            <AllianceLogoMark entry={unm} side="unm" caption="UNM" />
            <span className="alliance-lockup-x" aria-hidden>
              ×
            </span>
            <AllianceLogoMark entry={ebs} side="ebs" caption="EBS Paris" />
          </div>
        </ScrollReveal>
      </div>

      <ul className="alliance-pillars relative mt-12 sm:mt-14 lg:mt-16">
        {PILLARS.map((pillar, i) => (
          <li key={pillar.key} className="alliance-pillar">
            <ScrollReveal delay={100 + i * 70}>
              <p className="alliance-pillar-num">{pillar.num}</p>
              <h3 className="alliance-pillar-title">{t(`${pillar.key}Title`)}</h3>
              <p className="alliance-pillar-body">{t(`${pillar.key}Body`)}</p>
            </ScrollReveal>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

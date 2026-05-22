'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { IconBox } from '@/components/ui/Icon';
import {
  ACCREDITATION_LOGOS,
  EBS_ALLIANCE_LOCKUP,
  type AllianceLogoEntry,
} from '@/lib/partner-logos';
import { cn } from '@/lib/utils';
import type { Locale } from '@unm/types';

const PILLAR_KEYS = ['pillar1', 'pillar2', 'pillar3'] as const;
/** Excellence · ancrage local · action */
const PILLAR_ICONS = ['medal', 'landmark', 'target'] as const;

function AllianceLogoMark({
  entry,
  className,
}: {
  entry: AllianceLogoEntry;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-10 w-full max-w-[8rem] items-center justify-center sm:h-11 sm:max-w-[8.5rem]',
        className,
      )}
      style={{ '--logo-scale': entry.scale } as React.CSSProperties}
    >
      <div className="partner-logo-slot h-9 w-full sm:h-10">
        <Image
          src={entry.src}
          alt={entry.name}
          width={168}
          height={56}
          sizes="150px"
          quality={90}
          className="partner-logo-img"
        />
      </div>
    </div>
  );
}

function AllianceLogoPanel({ className }: { className?: string }) {
  const t = useTranslations('ebs');
  const [unm, ebs] = EBS_ALLIANCE_LOCKUP;

  return (
    <div
      className={cn('card-flat overflow-hidden', className)}
      aria-label={t('title')}
    >
      {/* Lockup: UNM × EBS */}
      <div className="flex items-center justify-center gap-3 bg-canvas/50 px-5 py-7 sm:gap-4 sm:px-8 sm:py-8 lg:flex-1 lg:min-w-0 lg:border-b-0 lg:border-r lg:border-warm-150/70 lg:py-10">
        <AllianceLogoMark entry={unm} className="max-w-[38%] sm:max-w-[9rem]" />
        <span
          aria-hidden
          className="shrink-0 font-display text-lg leading-none text-primary/25 sm:text-xl"
        >
          ×
        </span>
        <AllianceLogoMark entry={ebs} className="max-w-[38%] sm:max-w-[9rem]" />
      </div>

      {/* Accreditations */}
      <div className="border-t border-warm-150/70 lg:flex lg:flex-1 lg:flex-col lg:border-t-0 lg:min-w-0">
        <p className="border-b border-warm-150/50 bg-warm-50/40 px-4 py-2.5 text-center font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary/45 lg:py-3">
          {t('accreditationsLabel')}
        </p>
        <ul className="grid flex-1 grid-cols-3 divide-x divide-warm-150/70">
          {ACCREDITATION_LOGOS.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-center px-2 py-5 sm:px-4 sm:py-6 lg:py-7"
            >
              <AllianceLogoMark entry={entry} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function EBSPartnership() {
  const locale = useLocale() as Locale;
  const t = useTranslations('ebs');
  const allianceHref = locale === 'en' ? '/en/university' : '/universite';

  return (
    <SectionWrapper id="partenariat" tone="alt">
      <ScrollReveal>
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
          action={{ label: t('learnMore'), href: allianceHref }}
          className="!mb-8 sm:!mb-10"
        />
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <AllianceLogoPanel className="mx-auto max-w-4xl lg:flex lg:items-stretch" />
      </ScrollReveal>

      <ul className="mt-8 grid min-w-0 gap-4 sm:mt-10 md:grid-cols-3 lg:mt-12 lg:gap-5">
        {PILLAR_KEYS.map((key, i) => (
          <li key={key}>
            <ScrollReveal delay={80 + i * 70} className="h-full">
              <article className="card-interactive group h-full p-5 sm:p-6">
                <IconBox name={PILLAR_ICONS[i]} size="sm" className="mb-4" />
                <h3 className="font-display text-base font-semibold leading-snug text-secondary group-hover:text-primary sm:text-lg">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary/70">{t(`${key}Body`)}</p>
              </article>
            </ScrollReveal>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

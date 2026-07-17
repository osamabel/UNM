'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Icon, IconBox } from '@/components/ui/Icon';
import { getEbsAllianceLockup, type AllianceLogoEntry } from '@/lib/partner-logos';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { getBrandLogoSrc } from '@/lib/site-settings';
import { cn } from '@/lib/utils';
import type { Locale, Partner } from '@unm/types';

const PILLAR_KEYS = ['pillar1', 'pillar2', 'pillar3'] as const;
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
        'flex h-14 w-full items-center justify-center sm:h-16 md:h-[4.5rem]',
        className,
      )}
      style={{ '--logo-scale': entry.scale } as React.CSSProperties}
    >
      <Image
        src={entry.src}
        alt={entry.name}
        width={320}
        height={96}
        sizes="(max-width: 640px) 140px, 200px"
        quality={95}
        className="h-full w-auto max-w-full object-contain object-center"
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
    <SectionWrapper id="partenariat" tone="alt">
      <ScrollReveal>
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="mt-3 font-display text-display-md text-secondary">{t('title')}</h2>
          <p className="mt-4 text-base leading-relaxed text-secondary/70 sm:text-lg">
            {t('description')}
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <div
          className="mx-auto mt-8 max-w-3xl sm:mt-10"
          aria-label={t('title')}
        >
          <div className="relative overflow-hidden rounded-2xl border border-warm-150/80 bg-canvas px-6 py-8 shadow-[0_18px_48px_-28px_rgba(61,26,11,0.28)] sm:px-10 sm:py-10">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6 md:gap-8">
              <AllianceLogoMark entry={unm} className="justify-self-end" />
              <span
                aria-hidden
                className="shrink-0 font-display text-xl leading-none text-primary/35 sm:text-2xl"
              >
                ×
              </span>
              <AllianceLogoMark entry={ebs} className="justify-self-start" />
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ul className="mx-auto mt-8 grid max-w-5xl min-w-0 gap-px overflow-hidden rounded-2xl border border-warm-150/80 bg-warm-150/60 sm:mt-10 md:grid-cols-3">
        {PILLAR_KEYS.map((key, i) => (
          <li key={key} className="bg-canvas">
            <ScrollReveal delay={90 + i * 60} className="h-full">
              <article className="group flex h-full flex-col p-5 sm:p-6 md:p-7">
                <IconBox name={PILLAR_ICONS[i]} size="sm" className="mb-4" />
                <h3 className="font-display text-base font-semibold leading-snug text-secondary group-hover:text-primary sm:text-lg">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary/65">
                  {t(`${key}Body`)}
                </p>
              </article>
            </ScrollReveal>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center sm:mt-10">
        <Link href={allianceHref} className="link-arrow text-sm sm:text-base">
          {t('learnMore')}
          <Icon name="arrow-right" size={16} className="btn-arrow" />
        </Link>
      </div>
    </SectionWrapper>
  );
}

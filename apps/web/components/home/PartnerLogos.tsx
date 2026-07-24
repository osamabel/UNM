'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { getPartnerLogoSrc } from '@/lib/partner-logos';
import { cn } from '@/lib/utils';
import type { Partner } from '@unm/types';

type PartnerLogosProps = {
  partners: Partner[];
};

function usablePartners(partners: Partner[]) {
  const withLogo = partners.filter((p) => Boolean(getPartnerLogoSrc(p)));
  return withLogo.length > 0 ? withLogo : partners;
}

function rotate<T>(items: T[], by: number): T[] {
  if (items.length === 0) return items;
  const n = ((by % items.length) + items.length) % items.length;
  return [...items.slice(n), ...items.slice(0, n)];
}

export function PartnerLogoTile({
  partner,
  layout = 'marquee',
}: {
  partner: Partner;
  layout?: 'marquee' | 'grid';
}) {
  const logoSrc = getPartnerLogoSrc(partner);

  const inner = (
    <div
      className={cn(
        'partner-logo-card group',
        layout === 'grid' && 'partner-logo-card--grid',
      )}
    >
      <div className="partner-logo-slot">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={partner.name}
            width={160}
            height={48}
            sizes={layout === 'marquee' ? '160px' : '(max-width: 640px) 45vw, 180px'}
            unoptimized
            className="partner-logo-img"
          />
        ) : (
          <span className="partner-logo-fallback">{partner.name}</span>
        )}
      </div>
    </div>
  );

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2',
          layout === 'marquee' ? 'shrink-0' : 'w-full',
        )}
        aria-label={partner.name}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className={cn(layout === 'marquee' ? 'shrink-0' : 'w-full')}>{inner}</div>
  );
}

function MarqueeRow({
  partners,
  reverse = false,
  duration = 56,
  className,
}: {
  partners: Partner[];
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  // Pad just enough for a continuous ribbon, then mirror once for a seamless -50% loop
  let base = [...partners];
  while (base.length > 0 && base.length < 6) {
    base = [...base, ...partners];
  }
  const loop = [...base, ...base];

  return (
    <div className={cn('partner-marquee', className)}>
      <div
        className={cn('partner-marquee-track', reverse && 'partner-marquee-track-reverse')}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        {loop.map((partner, index) => (
          <PartnerLogoTile
            key={`${partner.id}-${reverse ? 'r' : 'f'}-${index}`}
            partner={partner}
          />
        ))}
      </div>
    </div>
  );
}

export function PartnerLogos({ partners }: PartnerLogosProps) {
  const t = useTranslations('home');
  const tCat = useTranslations('partnersIndex.categoryTitle');
  const locale = useLocale();
  const list = usablePartners(partners);
  if (list.length === 0) return null;

  const partnersHref = locale === 'en' ? '/en/partners' : '/partenaires';
  const categories = Array.from(new Set(list.map((p) => p.category)));

  return (
    <SectionWrapper id="partenaires" tone="soft" className="partners-section !py-10 sm:!py-12 lg:!py-14">
      <ScrollReveal from="up" duration={900}>
        <SectionHeader
          index="03"
          eyebrow={t('partnersEyebrow')}
          title={t('partnersTitle')}
          description={t('partnersSubtitle')}
          action={{
            label: t('partnersCta'),
            href: partnersHref,
          }}
          className="!mb-6 sm:!mb-7"
        />
      </ScrollReveal>

      {categories.length > 0 ? (
        <ScrollReveal from="up" delay={60} duration={700} blur={false}>
          <ul className="partner-cats" aria-label={t('partnersEyebrow')}>
            {categories.map((cat) => (
              <li key={cat} className="partner-cat">
                {tCat(cat)}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      ) : null}

      <ScrollReveal from="up" delay={120} duration={1000} blur={false}>
        <div className="partner-stage" aria-label={t('partnersTitle')}>
          <div className="partner-stage-glow" aria-hidden />
          <div className="partner-stage-grid" aria-hidden />
          <div className="partner-stage-sheen" aria-hidden />

          <div className="partner-stage-rows">
            <MarqueeRow partners={list} duration={64} />
            <MarqueeRow partners={rotate(list, 3)} reverse duration={72} />
          </div>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}

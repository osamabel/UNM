'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { getPartnerLogoScale, getPartnerLogoSrc } from '@/lib/partner-logos';
import { cn } from '@/lib/utils';
import type { Partner } from '@unm/types';

type PartnerLogosProps = {
  partners: Partner[];
};

export function PartnerLogoTile({
  partner,
  layout = 'marquee',
}: {
  partner: Partner;
  layout?: 'marquee' | 'grid';
}) {
  const logoSrc = getPartnerLogoSrc(partner);
  const scale = getPartnerLogoScale(partner.name);

  const inner = (
    <div
      className={cn(
        'partner-logo-card group',
        layout === 'grid' && 'partner-logo-card--grid',
      )}
      style={{ ['--logo-scale' as string]: scale }}
    >
      <div className="partner-logo-slot">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={partner.name}
            width={200}
            height={80}
            sizes={layout === 'marquee' ? '188px' : '(max-width: 640px) 45vw, 220px'}
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
}: {
  partners: Partner[];
  reverse?: boolean;
}) {
  const loop = [...partners, ...partners];

  return (
    <div className="partner-marquee">
      <div
        className={`partner-marquee-track${reverse ? ' partner-marquee-track-reverse' : ''}`}
      >
        {loop.map((partner, index) => (
          <PartnerLogoTile
            key={`${partner.id}-${reverse ? 'b' : 'a'}-${index}`}
            partner={partner}
          />
        ))}
      </div>
    </div>
  );
}

export function PartnerLogos({ partners }: PartnerLogosProps) {
  const t = useTranslations('home');
  const locale = useLocale();
  if (partners.length === 0) return null;

  const midpoint = Math.ceil(partners.length / 2);
  const rowA = partners.slice(0, midpoint);
  const rowB = partners.slice(midpoint);
  const secondRow = rowB.length > 0 ? rowB : partners;
  const partnersHref = locale === 'en' ? '/en/partners' : '/partenaires';

  return (
    <SectionWrapper id="partenaires" className="!bg-white !py-14 md:!py-16">
      <ScrollReveal>
        <SectionHeader
          icon="handshake"
          eyebrow={t('partnersEyebrow')}
          title={t('partnersTitle')}
          description={t('partnersSubtitle')}
          action={{
            label: t('partnersCta'),
            href: partnersHref,
          }}
          className="!mb-8 sm:!mb-10"
        />
      </ScrollReveal>

      <div className="space-y-4">
        <MarqueeRow partners={rowA} />
        <MarqueeRow partners={secondRow} reverse />
      </div>
    </SectionWrapper>
  );
}

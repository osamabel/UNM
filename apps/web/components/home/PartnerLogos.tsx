'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { getPartnerLogoScale, getPartnerLogoSrc } from '@/lib/partner-logos';
import type { Locale, Partner } from '@unm/types';
import { cn } from '@/lib/utils';

interface Props {
  partners: Partner[];
  /** Hide section title (e.g. on /partenaires page that has its own H1) */
  hideHeader?: boolean;
}

export function PartnerLogoTile({
  partner,
  layout = 'marquee',
}: {
  partner: Partner;
  layout?: 'marquee' | 'grid';
}) {
  const src = getPartnerLogoSrc(partner);
  const scale = getPartnerLogoScale(partner.name);

  const inner = (
    <div
      className={cn(
        'partner-logo-tile card-flat group flex items-center justify-center px-6 py-5',
        'transition-all duration-300 ease-smooth hover:-translate-y-0.5',
        layout === 'marquee'
          ? 'h-20 w-[11.5rem] shrink-0 sm:h-[5.5rem] sm:w-[15.5rem] md:h-24 md:w-[17.5rem]'
          : 'h-24 w-full sm:h-32',
      )}
      style={{ '--logo-scale': scale } as React.CSSProperties}
    >
      {src ? (
        <div className="partner-logo-slot">
          <Image
            src={src}
            alt={partner.name}
            width={240}
            height={80}
            sizes={layout === 'marquee' ? '280px' : '(max-width: 640px) 45vw, 220px'}
            quality={90}
            className="partner-logo-img"
          />
        </div>
      ) : (
        <span className="line-clamp-2 px-2 text-center text-[11px] font-medium leading-tight text-secondary/65">
          {partner.name}
        </span>
      )}
    </div>
  );

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2',
          layout === 'grid' && 'block w-full',
        )}
      >
        {inner}
      </a>
    );
  }

  return <div className={cn('shrink-0', layout === 'grid' && 'w-full')}>{inner}</div>;
}

function PartnerMarqueeRow({
  partners,
  reverse,
  className,
}: {
  partners: Partner[];
  reverse?: boolean;
  className?: string;
}) {
  const loop = useMemo(() => [...partners, ...partners], [partners]);

  return (
    <div className={cn('partner-marquee', className)}>
      <ul
        className={cn(
          'partner-marquee-track list-none',
          reverse && 'partner-marquee-track-reverse',
        )}
      >
        {loop.map((p, i) => (
          <li key={`${p.id}-${i}`} className="list-none" aria-hidden={i >= partners.length}>
            <PartnerLogoTile partner={p} layout="marquee" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PartnerGrid({ partners }: { partners: Partner[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {partners.map((p) => (
        <li key={p.id} className="min-w-0">
          <PartnerLogoTile partner={p} layout="grid" />
        </li>
      ))}
    </ul>
  );
}

export function PartnerLogos({ partners, hideHeader }: Props) {
  const t = useTranslations('home');
  const locale = useLocale() as Locale;
  const partnersHref = locale === 'en' ? '/en/partners' : '/partenaires';

  const { rowA, rowB } = useMemo(() => {
    const mid = Math.ceil(partners.length / 2);
    return {
      rowA: partners.slice(0, mid),
      rowB: partners.slice(mid),
    };
  }, [partners]);

  if (partners.length === 0) return null;

  const useMarquee = partners.length >= 4;

  return (
    <SectionWrapper
      id={hideHeader ? undefined : 'partenaires'}
      tone="canvas"
      className={cn(hideHeader ? 'pt-0' : undefined, 'overflow-x-clip')}
    >
      {!hideHeader && (
        <ScrollReveal>
          <SectionHeader
            eyebrow={t('partnersEyebrow')}
            icon="shield"
            title={t('partnersTitle')}
            description={t('partnersSubtitle')}
            action={{ label: t('partnersCta'), href: partnersHref }}
          />
        </ScrollReveal>
      )}

      <ScrollReveal delay={hideHeader ? 0 : 80}>
        {useMarquee ? (
          <>
            <div className="space-y-4 sm:space-y-5 motion-reduce:hidden">
              <PartnerMarqueeRow partners={rowA} />
              {rowB.length > 0 && <PartnerMarqueeRow partners={rowB} reverse />}
            </div>
            <div className="hidden motion-reduce:block">
              <PartnerGrid partners={partners} />
            </div>
          </>
        ) : (
          <PartnerGrid partners={partners} />
        )}
      </ScrollReveal>
    </SectionWrapper>
  );
}

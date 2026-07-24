'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ScrollReveal, StaggerReveal } from '@/components/patterns/ScrollReveal';
import { Icon } from '@/components/ui/Icon';
import { iconForProgramType } from '@/lib/program-meta-icons';
import { getProgramTypeCoverSrc } from '@/lib/program-images';
import type { Locale, ProgramType } from '@unm/types';
import { cn } from '@/lib/utils';

const CATEGORIES: {
  type: ProgramType;
  titleKey: 'dbaTitle' | 'mbaTitle' | 'certificateTitle';
  descriptionKey: 'dbaDescription' | 'mbaDescription' | 'certificateDescription';
  ctaKey: 'discoverDba' | 'discoverMba' | 'discoverCertificate';
}[] = [
  {
    type: 'DBA',
    titleKey: 'dbaTitle',
    descriptionKey: 'dbaDescription',
    ctaKey: 'discoverDba',
  },
  {
    type: 'MBA',
    titleKey: 'mbaTitle',
    descriptionKey: 'mbaDescription',
    ctaKey: 'discoverMba',
  },
  {
    type: 'Certificate',
    titleKey: 'certificateTitle',
    descriptionKey: 'certificateDescription',
    ctaKey: 'discoverCertificate',
  },
];

export function FeaturedPrograms() {
  const locale = useLocale() as Locale;
  const t = useTranslations('home');
  const tf = useTranslations('featuredPrograms');
  const tc = useTranslations('common');
  const programsBase = locale === 'en' ? '/en/programs' : '/programmes';

  return (
    <SectionWrapper id="programmes" tone="soft">
      <ScrollReveal from="up" duration={850}>
        <SectionHeader
          index="01"
          eyebrow={tf('eyebrow')}
          title={t('featuredProgramsTitle')}
          description={tf('subtitle')}
          action={{
            label: tc('viewAllPrograms'),
            href: programsBase,
          }}
          className="!mb-8 sm:!mb-9"
        />
      </ScrollReveal>

      <StaggerReveal
        as="ul"
        itemAs="li"
        delay={80}
        stagger={100}
        from="up"
        duration={850}
        className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
        itemClassName="min-w-0 h-full"
      >
        {CATEGORIES.map((category, i) => (
          <ProgramCategoryCard
            key={category.type}
            category={category}
            href={`${programsBase}?type=${category.type}`}
            tf={tf}
            index={i}
          />
        ))}
      </StaggerReveal>
    </SectionWrapper>
  );
}

type FeaturedT = ReturnType<typeof useTranslations<'featuredPrograms'>>;

function ProgramCategoryCard({
  category,
  href,
  tf,
  index,
}: {
  category: (typeof CATEGORIES)[number];
  href: string;
  tf: FeaturedT;
  index: number;
}) {
  const typeIcon = iconForProgramType(category.type);
  const cover = getProgramTypeCoverSrc(category.type);
  const title = tf(category.titleKey);

  return (
    <article className="h-full min-h-0">
      <Link
        href={href}
        className={cn(
          'featured-card group relative flex h-full min-h-[22rem] flex-col overflow-hidden sm:min-h-[24rem]',
          `featured-card--${index}`,
        )}
        aria-label={`${title} — ${tf(category.ctaKey)}`}
      >
        <Image
          src={cover}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="featured-card-img object-cover"
          priority={index === 0}
        />
        <div className="featured-card-veil" aria-hidden />

        <span className="featured-card-badge">
          <Icon name={typeIcon} size={14} weight="medium" aria-hidden />
          {title}
        </span>

        <div className="featured-card-panel">
          <h3 className="featured-card-kicker">{title}</h3>
          <p className="featured-card-body">{tf(category.descriptionKey)}</p>
          <span className="featured-card-cta">
            {tf('explore')}
            <Icon name="arrow-right" size={15} className="btn-arrow shrink-0" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}

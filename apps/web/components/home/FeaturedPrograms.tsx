'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
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
  accent: string;
}[] = [
  {
    type: 'DBA',
    titleKey: 'dbaTitle',
    descriptionKey: 'dbaDescription',
    ctaKey: 'discoverDba',
    accent: '#1E3A5F',
  },
  {
    type: 'MBA',
    titleKey: 'mbaTitle',
    descriptionKey: 'mbaDescription',
    ctaKey: 'discoverMba',
    accent: '#B5341A',
  },
  {
    type: 'Certificate',
    titleKey: 'certificateTitle',
    descriptionKey: 'certificateDescription',
    ctaKey: 'discoverCertificate',
    accent: '#2D6A4F',
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
      <ScrollReveal>
        <SectionHeader
          icon="library"
          title={t('featuredProgramsTitle')}
          description={tf('subtitle')}
          action={{
            label: tc('viewAllPrograms'),
            href: programsBase,
          }}
          className="!mb-8 sm:!mb-10"
        />
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <ul className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <li key={category.type} className="min-w-0">
              <ProgramCategoryCard
                category={category}
                href={`${programsBase}?type=${category.type}`}
                tf={tf}
              />
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </SectionWrapper>
  );
}

type FeaturedT = ReturnType<typeof useTranslations<'featuredPrograms'>>;

function ProgramCategoryCard({
  category,
  href,
  tf,
}: {
  category: (typeof CATEGORIES)[number];
  href: string;
  tf: FeaturedT;
}) {
  const typeIcon = iconForProgramType(category.type);
  const cover = getProgramTypeCoverSrc(category.type);

  return (
    <article className="card-interactive group relative flex h-full min-h-[300px] flex-col overflow-hidden">
      {cover && (
        <div className="relative h-36 overflow-hidden sm:h-40">
          <Image
            src={cover}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-warm-50 via-warm-50/20 to-transparent"
            aria-hidden
          />
        </div>
      )}

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${category.accent}14`,
              color: category.accent,
            }}
          >
            <Icon name={typeIcon} size={24} weight="medium" />
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="font-display text-2xl leading-tight text-secondary transition-colors duration-300 [@media(hover:hover)]:group-hover:text-primary">
              {tf(category.titleKey)}
            </h3>
          </div>
        </div>

        <p className="relative mt-5 flex-1 text-sm leading-relaxed text-secondary/65 sm:text-[15px]">
          {tf(category.descriptionKey)}
        </p>

        <div className="relative mt-8">
          <Link
            href={href}
            className={cn(
              'inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors',
              'bg-secondary text-warm-50',
              '[@media(hover:hover)]:hover:bg-primary',
            )}
          >
            {tf(category.ctaKey)}
            <Icon name="arrow-right" size={16} className="shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { cn } from '@/lib/utils';

type PhotoHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt?: string;
  /** object-position for the photo crop */
  imagePosition?: string;
  className?: string;
  children?: ReactNode;
};

/** Full-bleed photographic page hero — cream type over dark scrub. */
export function PhotoHero({
  eyebrow,
  title,
  subtitle,
  imageSrc,
  imageAlt = '',
  imagePosition = 'center 32%',
  className,
  children,
}: PhotoHeroProps) {
  return (
    <section className={cn('photo-hero relative flex flex-col overflow-hidden', className)}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="photo-hero-scrub" aria-hidden />
      <div className="photo-hero-vignette" aria-hidden />

      <div className="container-page relative z-10 mt-auto py-12 sm:py-14 lg:py-16">
        <ScrollReveal from="up" duration={900}>
          <div className="photo-hero-meta">
            <p className="photo-hero-eyebrow">{eyebrow}</p>
            <span className="photo-hero-rule" aria-hidden />
          </div>
          <h1 className="photo-hero-title">{title}</h1>
          {subtitle ? <p className="photo-hero-subtitle">{subtitle}</p> : null}
          {children ? <div className="photo-hero-extra">{children}</div> : null}
        </ScrollReveal>
      </div>
    </section>
  );
}

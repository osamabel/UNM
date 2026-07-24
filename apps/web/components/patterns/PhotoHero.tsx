'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
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
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // A cached image can finish before hydration, so its load event never fires.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <section className={cn('photo-hero relative flex flex-col overflow-hidden', className)}>
      <Image
        ref={imgRef}
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        onLoad={() => setLoaded(true)}
        className={cn(
          'object-cover transition-[opacity,transform] duration-[1200ms] ease-out motion-reduce:transition-none',
          loaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
        )}
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

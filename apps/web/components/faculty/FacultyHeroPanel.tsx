'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { LOGO_SRC } from '@/lib/logo';
import { cn } from '@/lib/utils';

interface FacultyHeroPanelProps {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  /** Cover photo (CMS) or local fallback */
  imageSrc?: string | null;
  imageAlt?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Light editorial faculty hero — text + photo composition.
 */
export function FacultyHeroPanel({
  eyebrow,
  title,
  description,
  accent,
  imageSrc,
  imageAlt = '',
  children,
  className,
}: FacultyHeroPanelProps) {
  const photo = imageSrc?.trim() || null;
  const fromCms = Boolean(photo?.startsWith('/cms-media/'));

  return (
    <div
      className={cn(
        'relative grid min-w-0 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14',
        className,
      )}
    >
      <div className="relative z-10 min-w-0 lg:col-span-6 xl:col-span-5">
        <ScrollReveal>
          <p className="eyebrow">{eyebrow}</p>
          <div className="mt-3 h-0.5 w-10 bg-primary/80" aria-hidden />
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <h1 className="mt-5 break-words font-display text-3xl leading-tight text-secondary sm:text-4xl lg:mt-6 lg:text-[2.5rem] lg:leading-[1.15]">
            {title}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-secondary/70 sm:text-base lg:mt-5 lg:text-lg">
            {description}
          </p>
        </ScrollReveal>

        {children && (
          <ScrollReveal delay={180}>
            <div className="mt-6 flex flex-col items-start gap-3 sm:mt-8">{children}</div>
          </ScrollReveal>
        )}
      </div>

      <ScrollReveal delay={100} className="relative z-10 lg:col-span-6 xl:col-span-7">
        <div className="faculty-hero-visual relative">
          <div
            className="pointer-events-none absolute -inset-6 rounded-full blur-3xl motion-reduce:hidden sm:-inset-10"
            style={{ backgroundColor: accent, opacity: 0.14 }}
            aria-hidden
          />

          <div className="faculty-hero-frame relative overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(61,26,11,0.12)]">
            {photo ? (
              <Image
                src={photo}
                alt={imageAlt || title}
                width={1200}
                height={800}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="faculty-hero-photo h-full w-full object-cover"
                unoptimized={fromCms}
                priority
              />
            ) : (
              <div className="flex aspect-[16/11] items-center justify-center bg-warm-100/80">
                <Image
                  src={LOGO_SRC}
                  alt=""
                  width={220}
                  height={100}
                  className="faculty-hero-logo-ghost h-auto w-44 object-contain opacity-50"
                  aria-hidden
                />
              </div>
            )}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-secondary/25 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

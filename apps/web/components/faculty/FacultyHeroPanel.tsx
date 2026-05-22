'use client';

import type { ReactNode } from 'react';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Logo } from '@/components/layout/Logo';
import { cn } from '@/lib/utils';

interface FacultyHeroPanelProps {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Light editorial faculty hero — open canvas, frosted accents, no heavy dark card.
 */
export function FacultyHeroPanel({
  eyebrow,
  title,
  description,
  accent,
  children,
  className,
}: FacultyHeroPanelProps) {
  return (
    <div className={cn('relative min-w-0', className)}>
      {/* Mobile: faint centred ghost */}
      <div
        className="pointer-events-none absolute inset-x-0 top-6 z-0 flex justify-center opacity-30 motion-reduce:hidden sm:hidden"
        aria-hidden
      >
        <img
          src="/unmtrans.png"
          alt=""
          width={200}
          height={92}
          className="faculty-hero-logo-ghost h-28 w-44 object-contain"
          decoding="async"
        />
      </div>

      {/* Desktop: soft tint + blurred wordmark on the right */}
      <div
        className="pointer-events-none absolute -right-8 top-1/2 z-0 hidden h-[min(70vw,22rem)] w-[min(70vw,22rem)] -translate-y-1/2 sm:block lg:-right-4 lg:h-80 lg:w-80"
        aria-hidden
      >
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ backgroundColor: accent, opacity: 0.12 }}
        />
        <img
          src="/unmtrans.png"
          alt=""
          width={320}
          height={148}
          className="faculty-hero-logo-ghost h-full w-full object-contain"
          decoding="async"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-left">
        <ScrollReveal>
          <p className="eyebrow">{eyebrow}</p>
          <div className="mx-auto mt-3 h-0.5 w-10 bg-primary/80 lg:mx-0" aria-hidden />
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <h1 className="mt-5 break-words font-display text-3xl leading-tight text-secondary sm:text-4xl lg:mt-6 lg:text-[2.5rem] lg:leading-[1.15]">
            {title}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-secondary/70 sm:text-base lg:mx-0 lg:mt-5 lg:text-lg">
            {description}
          </p>
        </ScrollReveal>

        {children && (
          <ScrollReveal delay={180}>
            <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 lg:items-start">{children}</div>
          </ScrollReveal>
        )}
      </div>

      {/* Crisp wordmark on large screens — no white tile */}
      <ScrollReveal
        delay={100}
        className="relative z-10 mx-auto mt-10 hidden max-w-[10rem] opacity-90 lg:absolute lg:right-8 lg:top-1/2 lg:mx-0 lg:mt-0 lg:block lg:-translate-y-1/2 xl:right-12"
      >
        <Logo surface="light" className="[&_img]:h-auto [&_img]:w-full [&_img]:max-w-[9.5rem]" />
      </ScrollReveal>
    </div>
  );
}

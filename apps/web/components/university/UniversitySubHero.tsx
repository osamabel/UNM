'use client';

import type { ReactNode } from 'react';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { cn } from '@/lib/utils';

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

/** Light university subpage hero — canvas + editorial type, no heavy dark block. */
export function UniversitySubHero({ eyebrow, title, subtitle, children, className }: Props) {
  return (
    <section className={cn('relative overflow-hidden border-b border-warm-150/50 bg-canvas', className)}>
      <div className="hero-blob -right-16 -top-12 h-56 w-56 bg-primary/8 motion-reduce:hidden" aria-hidden />
      <div className="hero-bg pointer-events-none absolute inset-0 opacity-90" aria-hidden />
      <div className="container-page relative min-w-0 py-10 sm:py-14 lg:py-16">
        <ScrollReveal>
          <p className="eyebrow">{eyebrow}</p>
          <div className="mt-3 h-0.5 w-10 bg-primary/80" aria-hidden />
          <h1 className="mt-5 max-w-4xl font-display text-3xl leading-tight text-secondary sm:text-4xl lg:text-display-xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl font-display text-lg text-secondary/75 sm:text-xl">{subtitle}</p>
          )}
        </ScrollReveal>
        {children && (
          <ScrollReveal delay={80} className="mt-8">
            {children}
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

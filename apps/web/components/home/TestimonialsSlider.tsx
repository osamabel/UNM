'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { Icon, IconBox } from '@/components/ui/Icon';
import type { Locale, Testimonial } from '@unm/types';
import { localized } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialsSlider({ testimonials }: Props) {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const locale = useLocale() as Locale;
  const t = useTranslations('home');

  const go = useCallback((nextIdx: number, dir: 1 | -1) => {
    setDirection(dir);
    setIdx(nextIdx);
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setIdx((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = setInterval(() => {
      setDirection(1);
      setIdx((i) => (i + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;
  const current = testimonials[idx];
  const programLabel = current.program
    ? localized(current.program.title, locale)
    : null;

  return (
    <SectionWrapper id="temoignages" tone="blush">
      <div className="grid min-w-0 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <ScrollReveal className="min-w-0 lg:col-span-4">
          <SectionHeader
            eyebrow={t('testimonialsEyebrow')}
            icon="star"
            title={t('testimonialsTitle')}
            description={t('testimonialsSubtitle')}
            className="!mb-0"
          />
          {testimonials.length > 1 && (
            <p className="mt-6 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-secondary/45">
              {idx + 1} / {testimonials.length}
            </p>
          )}
        </ScrollReveal>

        <div className="min-w-0 lg:col-span-8">
          <ScrollReveal delay={80}>
            <figure className="card-interactive relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-6 left-1/4 h-28 w-28 rounded-full bg-secondary/5 blur-2xl"
                aria-hidden
              />

              <div
                key={current.id}
                className={cn(
                  'testimonial-enter relative',
                  direction === 1 ? 'testimonial-enter-forward' : 'testimonial-enter-back',
                )}
              >
                <IconBox name="quote" size="md" className="mb-6" />
                <blockquote className="font-display text-lg leading-snug text-secondary sm:text-xl lg:text-2xl lg:leading-snug">
                  &ldquo;{localized(current.quote, locale)}&rdquo;
                </blockquote>

                <figcaption className="mt-8 flex flex-col gap-4 border-t border-warm-150/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {current.avatar?.url ? (
                      <Image
                        src={current.avatar.url}
                        alt=""
                        width={56}
                        height={56}
                        className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white/90 shadow-sm"
                      />
                    ) : (
                      <span
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-lg text-primary ring-2 ring-white/80"
                        aria-hidden
                      >
                        {current.authorName.charAt(0)}
                      </span>
                    )}
                    <div>
                      <p className="font-heading font-semibold text-secondary">{current.authorName}</p>
                      <p className="mt-0.5 text-sm text-secondary/60">
                        {localized(current.authorRole, locale)}
                      </p>
                    </div>
                  </div>
                  {(programLabel || current.graduationYear) && (
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      {programLabel && (
                        <span className="glass-pill text-xs font-semibold text-secondary/80">
                          <Icon name="user" size={12} className="text-primary" />
                          {programLabel}
                        </span>
                      )}
                      {current.graduationYear && (
                        <span className="glass-pill text-xs font-semibold text-secondary/70">
                          {current.graduationYear}
                        </span>
                      )}
                    </div>
                  )}
                </figcaption>
              </div>
            </figure>
          </ScrollReveal>

          {testimonials.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4 sm:justify-end">
              <button
                type="button"
                aria-label={locale === 'en' ? 'Previous testimonial' : 'Témoignage précédent'}
                onClick={prev}
                className="glass touch-target flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:text-primary"
              >
                <Icon name="chevron-left" size={20} />
              </button>
              <div className="flex items-center gap-2" role="tablist" aria-label={t('testimonialsTitle')}>
                {testimonials.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={i === idx}
                    aria-label={item.authorName}
                    onClick={() => go(i, i > idx ? 1 : -1)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300 ease-smooth',
                      i === idx ? 'w-8 bg-primary' : 'w-2 bg-warm-300 hover:bg-warm-400',
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label={locale === 'en' ? 'Next testimonial' : 'Témoignage suivant'}
                onClick={next}
                className="glass touch-target flex h-11 w-11 items-center justify-center rounded-full text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:text-primary"
              >
                <Icon name="chevron-right" size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

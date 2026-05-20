'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import type { Locale, Testimonial } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialsSlider({ testimonials }: Props) {
  const [idx, setIdx] = useState(0);
  const locale = useLocale() as Locale;
  const t = useTranslations('home');

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;
  const current = testimonials[idx];

  return (
    <SectionWrapper>
      <h2 className="mb-8 font-display text-display-md text-secondary">
        {t('testimonialsTitle')}
      </h2>
      <figure className="mx-auto max-w-3xl text-center">
        <blockquote className="font-display text-2xl text-secondary sm:text-3xl">
          “{localized(current.quote, locale)}”
        </blockquote>
        <figcaption className="mt-6">
          <p className="font-heading font-medium text-secondary">{current.authorName}</p>
          <p className="text-sm text-secondary-400">
            {localized(current.authorRole, locale)}
          </p>
        </figcaption>
      </figure>
      <div role="tablist" aria-label="Testimonials" className="mt-8 flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === idx}
            aria-label={`${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-2 rounded-full transition-all ${i === idx ? 'w-8 bg-primary' : 'w-2 bg-warm-300'}`}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}

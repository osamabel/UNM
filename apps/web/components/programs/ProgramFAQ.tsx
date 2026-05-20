'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { JsonLd } from '@/components/shared/JsonLd';
import { faqSchema } from '@/lib/schema';
import type { Locale, ProgramFAQItem } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  items: ProgramFAQItem[];
}

export function ProgramFAQ({ items }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('program');
  const [open, setOpen] = useState<number | null>(0);
  if (!items?.length) return null;

  return (
    <section>
      <JsonLd data={faqSchema(items, locale)} />
      <h2 className="font-display text-2xl text-secondary">{t('faq')}</h2>
      <ul className="mt-6 divide-y divide-warm-200 border-y border-warm-200">
        {items.map((it, i) => {
          const expanded = open === i;
          return (
            <li key={i}>
              <button
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between gap-4 py-4 text-left font-heading text-base font-medium text-secondary"
              >
                <span>{localized(it.question, locale)}</span>
                <svg viewBox="0 0 24 24" className={`h-5 w-5 text-secondary transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true">
                  <path fill="currentColor" d="m6 9 6 6 6-6z" />
                </svg>
              </button>
              {expanded && (
                <p className="pb-4 pr-8 text-secondary-400">
                  {localized(it.answer, locale)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/patterns/SectionHeader';
import { JsonLd } from '@/components/shared/JsonLd';
import { faqSchema } from '@/lib/schema';
import type { Locale, ProgramFAQItem } from '@unm/types';
import { localized } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

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
      <SectionHeader
        eyebrow={t('faq')}
        title={locale === 'en' ? 'Common questions' : 'Questions fréquentes'}
      />
      <ul className="card-flat mt-8 divide-y divide-warm-150/80 overflow-hidden">
        {items.map((it, i) => {
          const expanded = open === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading text-base font-medium text-secondary transition-colors hover:bg-warm-150/30 sm:px-6"
              >
                <span>{localized(it.question, locale)}</span>
                <Icon
                  name="chevron-down"
                  size={18}
                  className={`shrink-0 text-warm-400 transition-transform duration-300 ease-smooth ${expanded ? 'rotate-180' : ''}`}
                />
              </button>
              {expanded ? (
                <p className="border-t border-warm-150/60 px-5 pb-5 pt-3 text-sm leading-relaxed text-secondary/75 sm:px-6">
                  {localized(it.answer, locale)}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

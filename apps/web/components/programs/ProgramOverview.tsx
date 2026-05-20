'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale, Program } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  program: Program;
}

export function ProgramOverview({ program }: Props) {
  const [tab, setTab] = useState<'audience' | 'objectives'>('audience');
  const locale = useLocale() as Locale;
  const t = useTranslations('program');

  return (
    <section>
      <div role="tablist" className="flex border-b border-warm-200">
        {(['audience', 'objectives'] as const).map((key) => {
          const active = tab === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(key)}
              className={`px-4 py-3 font-heading text-sm font-medium transition-colors ${
                active ? 'border-b-2 border-primary text-primary' : 'text-secondary-400 hover:text-secondary'
              }`}
            >
              {t(key)}
            </button>
          );
        })}
      </div>
      <div className="prose prose-lg max-w-prose pt-6 text-secondary">
        {tab === 'audience' ? (
          <p>{localized(program.targetAudience, locale)}</p>
        ) : (
          <ul className="space-y-2 list-disc pl-5">
            {program.objectives?.map((o, i) => (
              <li key={i}>{localized(o, locale)}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

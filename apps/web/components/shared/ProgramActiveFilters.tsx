'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

interface FacultyOption {
  slug: string;
  name: string;
}

const FILTER_KEYS = ['faculty', 'type', 'language'] as const;

export function ProgramActiveFilters({ faculties }: { faculties: FacultyOption[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const ti = useTranslations('programsIndex');
  const tp = useTranslations('program');

  const chips = useMemo(() => {
    const list: { key: (typeof FILTER_KEYS)[number]; value: string; label: string }[] = [];
    const type = params.get('type');
    if (type) list.push({ key: 'type', value: type, label: type });
    const language = params.get('language');
    if (language) list.push({ key: 'language', value: language, label: language.toUpperCase() });
    const faculty = params.get('faculty');
    if (faculty) {
      const match = faculties.find((f) => f.slug === faculty);
      list.push({
        key: 'faculty',
        value: faculty,
        label: (match?.name ?? faculty).replace(/^UNM\s+/i, ''),
      });
    }
    return list;
  }, [params, faculties]);

  const clearOne = useCallback(
    (key: string) => {
      const next = new URLSearchParams(params.toString());
      next.delete(key);
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [params, router],
  );

  const reset = useCallback(() => {
    router.replace('?', { scroll: false });
  }, [router]);

  if (chips.length === 0) return null;

  return (
    <div className="pf-active">
      <span className="sr-only">{ti('activeFilters')}</span>
      <div className="pf-active-chips">
        {chips.map((chip) => (
          <button
            key={`${chip.key}-${chip.value}`}
            type="button"
            onClick={() => clearOne(chip.key)}
            className="pf-active-chip"
          >
            <span className="pf-active-key">
              {chip.key === 'faculty'
                ? tp('faculty')
                : chip.key === 'type'
                  ? ti('typeLabel')
                  : tp('language')}
            </span>
            <span className="pf-active-value">{chip.label}</span>
            <Icon name="close" size={13} aria-hidden />
          </button>
        ))}
      </div>
      <button type="button" onClick={reset} className="pf-reset">
        {ti('resetFilters')}
      </button>
    </div>
  );
}

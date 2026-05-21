'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

interface FacultyOption {
  slug: string;
  name: string;
}

const FILTER_KEYS = ['faculty', 'type', 'format', 'language'] as const;

export function ProgramActiveFilters({ faculties }: { faculties: FacultyOption[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const ti = useTranslations('programsIndex');
  const tp = useTranslations('program');

  const chips = useMemo(() => {
    const list: { key: (typeof FILTER_KEYS)[number]; value: string; label: string }[] = [];
    const faculty = params.get('faculty');
    if (faculty) {
      const match = faculties.find((f) => f.slug === faculty);
      list.push({ key: 'faculty', value: faculty, label: match?.name ?? faculty });
    }
    const type = params.get('type');
    if (type) list.push({ key: 'type', value: type, label: type });
    const format = params.get('format');
    if (format) list.push({ key: 'format', value: format, label: format });
    const language = params.get('language');
    if (language) list.push({ key: 'language', value: language, label: language.toUpperCase() });
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
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <span className="sr-only">{ti('activeFilters')}</span>
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.value}`}
          type="button"
          onClick={() => clearOne(chip.key)}
          className="glass-pill group/chip !h-9 gap-1.5 !py-0 pl-3 pr-2 text-xs font-medium text-secondary/80 hover:!bg-white/90"
        >
          <span className="text-secondary/45">
            {chip.key === 'faculty'
              ? tp('faculty')
              : chip.key === 'type'
                ? ti('typeLabel')
                : chip.key === 'format'
                  ? tp('format')
                  : tp('language')}
            :
          </span>
          {chip.label}
          <Icon
            name="close"
            size={14}
            className="text-secondary/40 transition-colors group-hover/chip:text-primary"
          />
        </button>
      ))}
      <button
        type="button"
        onClick={reset}
        className="text-xs font-semibold text-primary transition-colors hover:underline"
      >
        {ti('resetFilters')}
      </button>
    </div>
  );
}

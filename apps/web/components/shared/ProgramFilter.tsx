'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import type { ProgramFormat, ProgramType } from '@unm/types';

interface Props {
  faculties: { slug: string; name: string }[];
}

const TYPES: ProgramType[] = ['DBA', 'MBA', 'Certificate'];
const FORMATS: ProgramFormat[] = ['Présentiel', 'Distanciel', 'Hybride'];
const LANGS = [
  { value: 'fr', label: 'FR' },
  { value: 'en', label: 'EN' },
] as const;

function FilterChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn('program-filter-chip', selected && 'is-active')}
    >
      {children}
    </button>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="program-filter-group">
      <p className="program-filter-label">{label}</p>
      <div className="program-filter-chips">{children}</div>
    </div>
  );
}

export function ProgramFilter({ faculties }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('program');
  const ti = useTranslations('programsIndex');

  const current = useMemo(
    () => ({
      faculty: params.get('faculty') ?? '',
      type: params.get('type') ?? '',
      format: params.get('format') ?? '',
      language: params.get('language') ?? '',
    }),
    [params],
  );

  const activeCount = Object.values(current).filter(Boolean).length;

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value && value !== next.get(key)) next.set(key, value);
      else next.delete(key);
      const q = next.toString();
      router.replace(q ? `?${q}` : '?', { scroll: false });
    },
    [params, router],
  );

  const toggle = useCallback(
    (key: string, value: string) => {
      update(key, current[key as keyof typeof current] === value ? '' : value);
    },
    [current, update],
  );

  const reset = useCallback(() => {
    router.replace('?', { scroll: false });
  }, [router]);

  const fields = (
    <div className="program-filter-fields">
      <FilterGroup label={t('faculty')}>
        {faculties.map((f) => (
          <FilterChip
            key={f.slug}
            selected={current.faculty === f.slug}
            onClick={() => toggle('faculty', f.slug)}
          >
            {f.name.replace(/^UNM\s+/i, '')}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label={ti('typeLabel')}>
        {TYPES.map((v) => (
          <FilterChip key={v} selected={current.type === v} onClick={() => toggle('type', v)}>
            {v}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label={t('format')}>
        {FORMATS.map((v) => (
          <FilterChip
            key={v}
            selected={current.format === v}
            onClick={() => toggle('format', v)}
          >
            {v}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label={t('language')}>
        {LANGS.map((v) => (
          <FilterChip
            key={v.value}
            selected={current.language === v.value}
            onClick={() => toggle('language', v.value)}
          >
            {v.label}
          </FilterChip>
        ))}
      </FilterGroup>

      {activeCount > 0 ? (
        <button type="button" onClick={reset} className="program-filter-reset">
          <Icon name="close" size={14} />
          {ti('resetFilters')}
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">{fields}</div>

      <div className="flex items-center justify-between gap-3 lg:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="program-filter-mobile-trigger"
        >
          <Icon name="search" size={16} className="text-primary/80" />
          {ti('filters')}
          {activeCount > 0 ? (
            <span className="program-filter-badge">{activeCount}</span>
          ) : null}
        </Button>
        {activeCount > 0 ? (
          <button type="button" onClick={reset} className="program-filter-reset !mt-0">
            {ti('resetFilters')}
          </button>
        ) : null}
      </div>

      <Modal open={mobileOpen} onClose={() => setMobileOpen(false)} title={ti('filters')} size="sm">
        {fields}
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" onClick={reset} fullWidth>
            {ti('resetFilters')}
          </Button>
          <Button onClick={() => setMobileOpen(false)} fullWidth>
            {ti('applyFilters')}
          </Button>
        </div>
      </Modal>
    </>
  );
}

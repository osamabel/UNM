'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import type { ProgramType } from '@unm/types';

interface Props {
  faculties: { slug: string; name: string }[];
  countLabel?: string;
}

const TYPES: ProgramType[] = ['DBA', 'MBA', 'Certificate'];
const LANGS = [
  { value: 'fr', label: 'FR' },
  { value: 'en', label: 'EN' },
] as const;

function shortFacultyName(name: string): string {
  return name
    .replace(/^UNM\s+/i, '')
    .replace(/^School of\s+/i, '')
    .replace(/^École\s+(de\s+|d[’'])?/i, '')
    .replace(/\s*&\s*Public Affairs/i, '')
    .replace(/^Business School.*/i, 'Business School')
    .replace(/^Governance.*/i, 'Governance')
    .replace(/^Technology.*/i, 'Technology')
    .replace(/^Sport Business.*/i, 'Sport Business');
}

function FilterChip({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn('pf-chip', selected && 'is-active', className)}
    >
      {children}
    </button>
  );
}

export function ProgramFilter({ faculties, countLabel }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('program');
  const ti = useTranslations('programsIndex');

  const current = useMemo(
    () => ({
      faculty: params.get('faculty') ?? '',
      type: params.get('type') ?? '',
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
    <div className="pf-bar-groups">
      <div className="pf-group">
        <span className="pf-group-label">{ti('typeLabel')}</span>
        <div className="pf-group-chips">
          {TYPES.map((v) => (
            <FilterChip key={v} selected={current.type === v} onClick={() => toggle('type', v)}>
              {v}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="pf-group">
        <span className="pf-group-label">{t('language')}</span>
        <div className="pf-group-chips">
          {LANGS.map((v) => (
            <FilterChip
              key={v.value}
              selected={current.language === v.value}
              onClick={() => toggle('language', v.value)}
            >
              {v.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="pf-group pf-group--grow">
        <span className="pf-group-label">{t('faculty')}</span>
        <div className="pf-group-chips">
          {faculties.map((f) => (
            <FilterChip
              key={f.slug}
              selected={current.faculty === f.slug}
              onClick={() => toggle('faculty', f.slug)}
            >
              {shortFacultyName(f.name)}
            </FilterChip>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="pf-bar-desktop">
        <div className="pf-bar-scroll">{fields}</div>
        <div className="pf-bar-meta">
          {countLabel ? <span className="pf-count">{countLabel}</span> : null}
          {activeCount > 0 ? (
            <button type="button" onClick={reset} className="pf-reset">
              <Icon name="close" size={14} />
              {ti('resetFilters')}
            </button>
          ) : null}
        </div>
      </div>

      <div className="pf-bar-mobile">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="pf-mobile-trigger"
        >
          <Icon name="search" size={16} />
          {ti('filters')}
          {activeCount > 0 ? <span className="pf-badge">{activeCount}</span> : null}
        </Button>
        {countLabel ? <span className="pf-count">{countLabel}</span> : null}
        {activeCount > 0 ? (
          <button type="button" onClick={reset} className="pf-reset">
            {ti('resetFilters')}
          </button>
        ) : null}
      </div>

      <Modal open={mobileOpen} onClose={() => setMobileOpen(false)} title={ti('filters')} size="sm">
        <div className="pf-modal">{fields}</div>
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

'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Icon } from '@/components/ui/Icon';
import type { Faculty, ProgramFormat, ProgramType } from '@unm/types';
import { Modal } from '@/components/ui/Modal';

interface Props {
  faculties: { slug: string; name: string }[];
}

const TYPES: ProgramType[] = ['DBA', 'MBA', 'Bachelor', 'Certificate'];
const FORMATS: ProgramFormat[] = ['Présentiel', 'Distanciel', 'Hybride'];
const LANGS = ['fr', 'en'];

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
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [params, router],
  );

  const reset = useCallback(() => {
    router.replace('?', { scroll: false });
  }, [router]);

  const fields = (
    <div className="grid gap-4">
      <Select
        label={t('overview')}
        placeholder={t('faculty')}
        value={current.faculty}
        onChange={(e) => update('faculty', e.target.value)}
        options={faculties.map((f) => ({ value: f.slug, label: f.name }))}
      />
      <Select
        label={ti('typeLabel')}
        placeholder={ti('typeLabel')}
        value={current.type}
        onChange={(e) => update('type', e.target.value)}
        options={TYPES.map((v) => ({ value: v, label: v }))}
      />
      <Select
        label={t('format')}
        placeholder={t('format')}
        value={current.format}
        onChange={(e) => update('format', e.target.value)}
        options={FORMATS.map((v) => ({ value: v, label: v }))}
      />
      <Select
        label={t('language')}
        placeholder={t('language')}
        value={current.language}
        onChange={(e) => update('language', e.target.value)}
        options={LANGS.map((v) => ({ value: v, label: v.toUpperCase() }))}
      />
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">{fields}</div>
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <Button variant="secondary" size="sm" onClick={() => setMobileOpen(true)} className="glass-pill !h-10">
          <Icon name="search" size={16} className="text-primary/80" />
          {ti('filters')}
          {activeCount > 0 && (
            <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="shrink-0 text-sm font-semibold text-primary hover:underline"
          >
            {ti('resetFilters')}
          </button>
        )}
      </div>
      <Modal open={mobileOpen} onClose={() => setMobileOpen(false)} title={ti('filters')} size="sm">
        <div className="grid gap-4">{fields}</div>
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

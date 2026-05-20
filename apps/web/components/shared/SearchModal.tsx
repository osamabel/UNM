'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import type { Locale } from '@unm/types';
import { articlePath, facultyPath, programPath } from '@/lib/utils';

interface Hit {
  id: string;
  title: string;
  slug: string;
  kind: 'program' | 'faculty' | 'article';
}

interface SearchResponse {
  programs: Hit[];
  faculties: Hit[];
  articles: Hit[];
}

const RECENT_KEY = 'unm:recent-searches';

interface SearchModalProps {
  /** Trigger colour scheme — `light` (default) or `dark` for the top bar. */
  tone?: 'light' | 'dark';
}

export function SearchModal({ tone = 'light' }: SearchModalProps = {}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (raw) setRecent(JSON.parse(raw));
  }, []);

  const flatHits = useMemo(() => {
    if (!results) return [];
    return [...results.programs, ...results.faculties, ...results.articles];
  }, [results]);

  // Debounced search
  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&locale=${locale}`,
        );
        if (res.ok) setResults(await res.json());
      } catch {
        /* ignore */
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [q, locale]);

  const persistRecent = useCallback((term: string) => {
    if (!term.trim()) return;
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  }, [recent]);

  const hrefForHit = (h: Hit) => {
    if (h.kind === 'program') return programPath(h.slug, locale);
    if (h.kind === 'faculty') return facultyPath(h.slug, locale);
    return articlePath(h.slug, locale);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flatHits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatHits[activeIdx]) {
      persistRecent(q);
      window.location.href = hrefForHit(flatHits[activeIdx]);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label={t('search')}
        onClick={() => setOpen(true)}
        className={
          tone === 'dark'
            ? 'inline-flex h-8 w-8 items-center justify-center rounded text-warm-200 hover:bg-warm-50/10 hover:text-white'
            : 'inline-flex h-10 w-10 items-center justify-center rounded text-secondary hover:bg-warm-100'
        }
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="m21 21-5.2-5.2M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0z"
          />
        </svg>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={t('search')} size="md">
        <Input
          ref={inputRef}
          autoFocus
          label={t('search')}
          placeholder={t('searchPlaceholder')}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActiveIdx(0);
          }}
          onKeyDown={onKeyDown}
        />
        {!q && recent.length > 0 && (
          <div className="mt-4">
            <p className="font-heading text-xs font-semibold uppercase tracking-wider text-warm-500">
              {locale === 'en' ? 'Recent' : 'Récent'}
            </p>
            <ul className="mt-2 space-y-1">
              {recent.map((r) => (
                <li key={r}>
                  <button
                    onClick={() => setQ(r)}
                    className="text-sm text-secondary hover:text-primary"
                  >
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {results && (
          <div className="mt-4 space-y-4">
            {(['programs', 'faculties', 'articles'] as const).map((group) =>
              results[group].length > 0 ? (
                <section key={group}>
                  <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-warm-500">
                    {group}
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {results[group].map((hit, idx) => {
                      const flatIdx = flatHits.findIndex((h) => h.id === hit.id);
                      const active = flatIdx === activeIdx;
                      return (
                        <li key={hit.id}>
                          <Link
                            href={hrefForHit(hit)}
                            onClick={() => persistRecent(q)}
                            className={`block rounded p-2 text-sm ${active ? 'bg-primary-50 text-primary' : 'hover:bg-warm-100'}`}
                          >
                            {hit.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ) : null,
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

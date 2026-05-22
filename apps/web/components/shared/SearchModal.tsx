'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Logo } from '@/components/layout/Logo';
import { cn } from '@/lib/utils';
import type { Locale } from '@unm/types';
import { iconForFacultySlug } from '@/lib/faculty-icons';
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

type QuickLink = { label: string; href: string; icon: IconName };

type NavItem =
  | { type: 'hit'; hit: Hit }
  | { type: 'recent'; term: string }
  | { type: 'link'; link: QuickLink };

const RECENT_KEY = 'unm:recent-searches';

const HIT_ICON: Record<Hit['kind'], IconName> = {
  program: 'library',
  faculty: 'landmark',
  article: 'newspaper',
};

type ResultGroup = keyof SearchResponse;

const GROUP_ORDER: ResultGroup[] = ['programs', 'faculties', 'articles'];

function iconForHit(hit: Hit): IconName {
  if (hit.kind === 'faculty') return iconForFacultySlug(hit.slug);
  return HIT_ICON[hit.kind];
}

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isEn = locale === 'en';

  const quickLinks = useMemo<QuickLink[]>(
    () => [
      { label: t('searchQuickPrograms'), href: isEn ? '/en/programs' : '/programmes', icon: 'library' },
      { label: t('searchQuickFaculties'), href: isEn ? '/en/faculties' : '/facultes', icon: 'landmark' },
      { label: t('searchQuickAdmissions'), href: isEn ? '/en/admissions' : '/admissions', icon: 'document' },
      { label: t('searchQuickNews'), href: isEn ? '/en/news' : '/actualites', icon: 'newspaper' },
    ],
    [isEn, t],
  );

  const groupLabel: Record<ResultGroup, string> = {
    programs: t('searchGroupPrograms'),
    faculties: t('searchGroupFaculties'),
    articles: t('searchGroupArticles'),
  };

  const close = useCallback(() => {
    setOpen(false);
    setQ('');
    setResults(null);
    setActiveIdx(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const tId = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = '';
      window.clearTimeout(tId);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const flatHits = useMemo(() => {
    if (!results) return [];
    return [...results.programs, ...results.faculties, ...results.articles];
  }, [results]);

  const hasQuery = q.trim().length > 0;

  const navigable = useMemo<NavItem[]>(() => {
    if (hasQuery) return flatHits.map((hit) => ({ type: 'hit', hit }));
    return [
      ...recent.map((term) => ({ type: 'recent' as const, term })),
      ...quickLinks.map((link) => ({ type: 'link' as const, link })),
    ];
  }, [hasQuery, flatHits, recent, quickLinks]);

  useEffect(() => {
    setActiveIdx(0);
  }, [hasQuery, navigable.length]);

  const hasResults = flatHits.length > 0;
  const showEmpty = hasQuery && !loading && results !== null && !hasResults;

  useEffect(() => {
    if (!hasQuery) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${locale}`);
        if (res.ok) setResults(await res.json());
        else setResults({ programs: [], faculties: [], articles: [] });
      } catch {
        setResults({ programs: [], faculties: [], articles: [] });
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => window.clearTimeout(handle);
  }, [q, locale, hasQuery]);

  const persistRecent = useCallback((term: string) => {
    if (!term.trim()) return;
    setRecent((prev) => {
      const next = [term, ...prev.filter((r) => r !== term)].slice(0, 5);
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const hrefForHit = (h: Hit) => {
    if (h.kind === 'program') return programPath(h.slug, locale);
    if (h.kind === 'faculty') return facultyPath(h.slug, locale);
    return articlePath(h.slug, locale);
  };

  const activateNavItem = (item: NavItem) => {
    if (item.type === 'recent') {
      setQ(item.term);
      inputRef.current?.focus();
      return;
    }
    if (item.type === 'link') {
      persistRecent(q);
      close();
      window.location.href = item.link.href;
      return;
    }
    persistRecent(q);
    window.location.href = hrefForHit(item.hit);
    close();
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (navigable.length === 0) return;
      setActiveIdx((i) => (i + 1) % navigable.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (navigable.length === 0) return;
      setActiveIdx((i) => (i - 1 + navigable.length) % navigable.length);
    } else if (e.key === 'Enter' && navigable[activeIdx]) {
      e.preventDefault();
      activateNavItem(navigable[activeIdx]);
    }
  };

  const globalNavOffset = useMemo(() => {
    let offset = 0;
    const map = new Map<string, number>();
    if (!hasQuery) {
      recent.forEach((term) => {
        map.set(`recent:${term}`, offset++);
      });
      quickLinks.forEach((link) => {
        map.set(`link:${link.href}`, offset++);
      });
      return map;
    }
    flatHits.forEach((hit) => {
      map.set(`hit:${hit.id}`, offset++);
    });
    return map;
  }, [hasQuery, recent, quickLinks, flatHits]);

  const isActive = (key: string) => globalNavOffset.get(key) === activeIdx;

  const overlay =
    mounted && open
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] flex animate-fade-in items-start justify-center bg-secondary/25 px-3 pb-6 pt-[max(4rem,8vh)] backdrop-blur-[6px] sm:px-4 sm:pt-[10vh]"
            role="presentation"
            onClick={close}
          >
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t('search')}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/50 bg-canvas/95 shadow-[0_28px_90px_rgba(61,26,11,0.16)] backdrop-blur-xl animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-1 opacity-[0.07] select-none [&_.logo-wrap]:bg-transparent"
              >
                <Logo surface="light" className="[&_.logo-wordmark]:h-20" />
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-warm-150/60 px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <Logo surface="light" className="shrink-0 [&_.logo-wordmark]:h-7 sm:[&_.logo-wordmark]:h-8" />
                  <div className="min-w-0 border-l border-warm-200/70 pl-3">
                    <p className="font-heading text-sm font-semibold text-secondary">{t('search')}</p>
                    <p className="truncate text-xs text-secondary/50">{t('searchSubtitle')}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t('close')}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary/50 transition-colors hover:bg-warm-150/50 hover:text-secondary"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>

              <div className="px-4 pb-2 pt-3 sm:px-5 sm:pb-3 sm:pt-4">
                <label className="search-palette-field">
                  <Icon name="search" size={18} className="shrink-0 text-primary/75" />
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="search"
                    enterKeyHint="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={onInputKeyDown}
                    placeholder={t('searchPlaceholder')}
                    aria-label={t('search')}
                    autoComplete="off"
                    spellCheck={false}
                    className="search-palette-input"
                  />
                  {hasQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setQ('');
                        setResults(null);
                        inputRef.current?.focus();
                      }}
                      aria-label={t('searchClear')}
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-secondary/45 transition-colors hover:bg-warm-150/60 hover:text-secondary"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  )}
                </label>
              </div>

              <div className="max-h-[min(50vh,20rem)] overflow-y-auto overscroll-contain border-t border-warm-150/50 px-2 py-2 sm:max-h-[min(54vh,24rem)] sm:px-3">
                {loading && (
                  <p className="flex items-center justify-center gap-2 px-3 py-12 text-sm text-secondary/50">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    {t('loading')}
                  </p>
                )}

                {!hasQuery && !loading && (
                  <>
                    {recent.length > 0 && (
                      <section className="mb-3">
                        <p className="px-2 py-1.5 font-heading text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary/40">
                          {t('searchRecent')}
                        </p>
                        <ul className="flex flex-wrap gap-1.5 px-1">
                          {recent.map((term) => {
                            const key = `recent:${term}`;
                            const active = isActive(key);
                            return (
                              <li key={term}>
                                <button
                                  type="button"
                                  data-active={active}
                                  onMouseEnter={() => setActiveIdx(globalNavOffset.get(key) ?? 0)}
                                  onClick={() => activateNavItem({ type: 'recent', term })}
                                  className={cn(
                                    'glass-pill text-xs font-medium transition-colors',
                                    active
                                      ? 'bg-primary/10 text-primary ring-1 ring-primary/25'
                                      : 'text-secondary/65 hover:bg-white/80 hover:text-primary',
                                  )}
                                >
                                  <Icon name="clock" size={12} className="mr-1 inline-block opacity-70" />
                                  {term}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    )}
                    <section>
                      <p className="px-2 py-1.5 font-heading text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary/40">
                        {t('searchQuickLinks')}
                      </p>
                      <ul className="space-y-0.5" role="listbox">
                        {quickLinks.map((link) => {
                          const key = `link:${link.href}`;
                          const active = isActive(key);
                          return (
                            <li key={link.href} role="option" aria-selected={active}>
                              <Link
                                href={link.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  activateNavItem({ type: 'link', link });
                                }}
                                onMouseEnter={() => setActiveIdx(globalNavOffset.get(key) ?? 0)}
                                data-active={active}
                                className="search-command-row"
                              >
                                <span className="search-command-icon">
                                  <Icon name={link.icon} size={16} />
                                </span>
                                <span className="min-w-0 flex-1">{link.label}</span>
                                <Icon
                                  name="arrow-right"
                                  size={14}
                                  className={cn(
                                    'shrink-0 transition-opacity',
                                    active ? 'text-primary/60 opacity-100' : 'text-secondary/25 opacity-0',
                                  )}
                                />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  </>
                )}

                {showEmpty && (
                  <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                    <span className="icon-box h-11 w-11 text-secondary/40">
                      <Icon name="search" size={20} />
                    </span>
                    <p className="text-sm text-secondary/55">{t('searchNoResults')}</p>
                  </div>
                )}

                {hasResults && !loading && (
                  <div className="space-y-3" role="listbox">
                    {GROUP_ORDER.map((group) =>
                      results![group].length > 0 ? (
                        <section key={group}>
                          <p className="px-2 py-1 font-heading text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary/40">
                            {groupLabel[group]}
                          </p>
                          <ul className="space-y-0.5">
                            {results![group].map((hit) => {
                              const key = `hit:${hit.id}`;
                              const active = isActive(key);
                              return (
                                <li key={hit.id} role="option" aria-selected={active}>
                                  <Link
                                    href={hrefForHit(hit)}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      activateNavItem({ type: 'hit', hit });
                                    }}
                                    onMouseEnter={() => setActiveIdx(globalNavOffset.get(key) ?? 0)}
                                    data-active={active}
                                    className="search-command-row"
                                  >
                                    <span className="search-command-icon">
                                      <Icon name={iconForHit(hit)} size={16} />
                                    </span>
                                    <span className="min-w-0 flex-1 truncate">{hit.title}</span>
                                    <Icon
                                      name="arrow-right"
                                      size={14}
                                      className={cn(
                                        'shrink-0 transition-opacity',
                                        active ? 'text-primary/60 opacity-100' : 'text-secondary/25 opacity-0',
                                      )}
                                    />
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
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-warm-150/60 bg-warm-50/40 px-4 py-2.5 text-[11px] text-secondary/45 sm:px-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-warm-200/70 bg-white/70 px-1 font-mono text-[10px]">↑↓</kbd>
                    {t('searchNavigate')}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-warm-200/70 bg-white/70 px-1 font-mono text-[10px]">↵</kbd>
                    {t('searchOpen')}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-warm-200/70 bg-white/70 px-1 font-mono text-[10px]">esc</kbd>
                    {t('searchClose')}
                  </span>
                </div>
                <kbd className="hidden rounded-md border border-warm-200/70 bg-white/70 px-2 py-0.5 font-mono text-[10px] sm:inline-block">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        aria-label={t('search')}
        onClick={() => setOpen(true)}
        className="touch-target inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-warm-100 sm:h-10 sm:w-10"
      >
        <Icon name="search" size={20} />
      </button>
      {overlay}
    </>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { Locale } from '@unm/types';
import { cn } from '@/lib/utils';

type NavKey =
  | 'university' | 'faculties' | 'programs' | 'admissions' | 'contact' | 'organisations'
  | 'manifesto' | 'presidentWord' | 'partners' | 'newsUnm' | 'events' | 'newsroom'
  | 'facultyBusinessSchool' | 'facultyGovernance' | 'facultyTechnology' | 'facultySportBusiness';

interface LeafItem { kind: 'leaf'; key: NavKey; fr: string; en: string; comingSoon?: boolean; }
interface ParentItem { kind: 'parent'; key: NavKey; fr: string; en: string; children: LeafItem[]; }
type Item = LeafItem | ParentItem;

const UNIVERSITY_SUB: LeafItem[] = [
  { kind: 'leaf', key: 'manifesto', fr: '/universite/manifeste', en: '/en/university/manifeste' },
  { kind: 'leaf', key: 'presidentWord', fr: '/universite/mot-du-president', en: '/en/university/mot-du-president' },
  { kind: 'leaf', key: 'partners', fr: '/partenaires', en: '/en/partners' },
  { kind: 'leaf', key: 'newsUnm', fr: '/actualites', en: '/en/news' },
  { kind: 'leaf', key: 'events', fr: '/universite/evenements', en: '/en/university/evenements' },
  { kind: 'leaf', key: 'newsroom', fr: '/universite/newsroom', en: '/en/university/newsroom' },
];

const FACULTIES_SUB: LeafItem[] = [
  { kind: 'leaf', key: 'facultyBusinessSchool', fr: '/facultes/business-school', en: '/en/faculties/business-school' },
  { kind: 'leaf', key: 'facultyGovernance', fr: '/facultes/school-of-governance', en: '/en/faculties/school-of-governance' },
  { kind: 'leaf', key: 'facultyTechnology', fr: '/facultes/school-of-technology', en: '/en/faculties/school-of-technology', comingSoon: true },
  { kind: 'leaf', key: 'facultySportBusiness', fr: '/facultes/school-of-sport-business', en: '/en/faculties/school-of-sport-business', comingSoon: true },
];

const ITEMS: Item[] = [
  { kind: 'parent', key: 'university', fr: '/universite', en: '/en/university', children: UNIVERSITY_SUB },
  { kind: 'parent', key: 'faculties', fr: '/facultes', en: '/en/faculties', children: FACULTIES_SUB },
  { kind: 'leaf', key: 'programs', fr: '/programmes', en: '/en/programs' },
  { kind: 'leaf', key: 'admissions', fr: '/admissions', en: '/en/admissions' },
  { kind: 'leaf', key: 'organisations', fr: '/organisations', en: '/en/organizations' },
  { kind: 'leaf', key: 'contact', fr: '/contact', en: '/en/contact' },
];

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    style.position = 'fixed';
    style.top = `-${scrollY}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';
    style.overflow = 'hidden';
    return () => {
      style.position = '';
      style.top = '';
      style.left = '';
      style.right = '';
      style.width = '';
      style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<NavKey | null>(null);
  const locale = useLocale() as Locale;
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  useBodyScrollLock(open);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setExpanded(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const overlay =
    mounted && open
      ? createPortal(
          <>
            <div
              className="fixed inset-0 z-[200] bg-secondary/50 backdrop-blur-sm lg:hidden"
              aria-hidden
              onClick={close}
            />
            <div
              className="glass-strong fixed inset-0 z-[201] flex flex-col lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-warm-150/80 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
                <span className="eyebrow">Menu</span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="touch-target inline-flex items-center justify-center rounded-xl p-2 hover:bg-warm-150/60"
                >
                  <Icon name="close" size={22} />
                </button>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
                <ul className="space-y-2">
                  {ITEMS.map((it) =>
                    it.kind === 'leaf' ? (
                      <li key={it.key}>
                        <Link
                          href={locale === 'en' ? it.en : it.fr}
                          onClick={close}
                          className="flex min-h-12 items-center rounded-xl border border-warm-150/60 bg-white/50 px-4 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-secondary transition-colors hover:border-primary/25 hover:text-primary"
                        >
                          {tNav(it.key)}
                        </Link>
                      </li>
                    ) : (
                      <li key={it.key} className="overflow-hidden rounded-xl border border-warm-150/60 bg-white/50">
                        <button
                          type="button"
                          aria-expanded={expanded === it.key}
                          aria-controls={`mobilesub-${it.key}`}
                          onClick={() => setExpanded((cur) => (cur === it.key ? null : it.key))}
                          className="flex min-h-12 w-full items-center justify-between px-4 py-3 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-secondary"
                        >
                          <span>{tNav(it.key)}</span>
                          <Icon
                            name="chevron-down"
                            size={18}
                            className={cn(
                              'text-warm-400 transition-transform duration-300',
                              expanded === it.key && 'rotate-180',
                            )}
                          />
                        </button>
                        <div
                          id={`mobilesub-${it.key}`}
                          className={cn(
                            'grid transition-[grid-template-rows] duration-300 ease-smooth',
                            expanded === it.key ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                          )}
                        >
                          <ul className="overflow-hidden border-t border-warm-150/60">
                            <li>
                              <Link
                                href={locale === 'en' ? it.en : it.fr}
                                onClick={close}
                                className="flex min-h-11 items-center px-4 text-sm font-semibold text-primary"
                              >
                                {tNav(it.key)} →
                              </Link>
                            </li>
                            {it.children.map((c) =>
                              c.comingSoon ? (
                                <li key={c.key}>
                                  <span className="flex min-h-11 items-center justify-between gap-2 px-4 text-sm text-secondary/50">
                                    {tNav(c.key)}
                                    <span className="rounded-full bg-warm-200 px-2 py-0.5 text-[10px] font-semibold uppercase">
                                      {tNav('comingSoon')}
                                    </span>
                                  </span>
                                </li>
                              ) : (
                                <li key={c.key}>
                                  <Link
                                    href={locale === 'en' ? c.en : c.fr}
                                    onClick={close}
                                    className="flex min-h-11 items-center px-4 text-sm font-medium text-secondary hover:bg-warm-150/40 hover:text-primary"
                                  >
                                    {tNav(c.key)}
                                  </Link>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              </nav>

              <div className="shrink-0 space-y-3 border-t border-warm-150/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <ButtonLink
                  href={locale === 'en' ? '/en/admissions' : '/admissions'}
                  onClick={close}
                  size="lg"
                  fullWidth
                  trailingIcon={<Icon name="arrow-right" size={18} />}
                >
                  {tCommon('apply')}
                </ButtonLink>
                <div className="flex justify-center py-1">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="touch-target inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-warm-150/70 bg-white/60 text-secondary backdrop-blur-md transition-all duration-300 hover:border-primary/30 lg:hidden"
      >
        <Icon name={open ? 'close' : 'menu'} size={22} weight="medium" />
      </button>
      {overlay}
    </>
  );
}

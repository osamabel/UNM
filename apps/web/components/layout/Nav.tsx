'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@unm/types';
import { cn } from '@/lib/utils';

// ════════════════════════════════════════════════════════════════
// Top-level navigation with dropdown support.
//
// SEO/A11Y note: the parent link AND every sub-item are always rendered
// in the DOM. The dropdown only toggles their *visibility* (visible /
// invisible + pointer-events-none + aria-hidden). This ensures:
//   • crawlers see every link
//   • users without JS still get a usable nav (parent link works,
//     hover reveals the menu via :focus-within)
//   • the smoke-test can grep the HTML for navigation completeness
// ════════════════════════════════════════════════════════════════

type NavKey =
  | 'home' | 'university' | 'faculties' | 'programs'
  | 'admissions' | 'contact' | 'organisations'
  | 'manifesto' | 'presidentWord' | 'partners' | 'newsUnm' | 'events' | 'newsroom'
  | 'facultyBusinessSchool' | 'facultyGovernance' | 'facultyTechnology' | 'facultySportBusiness';

// `comingSoon` items are rendered as a static label (not a link) with a
// "Bientôt" badge. They keep parity with the editorial CMS state where
// /facultes/* coming-soon pages exist but should not be promoted in nav.
interface LeafItem {
  kind: 'leaf';
  key: NavKey;
  fr: string;
  en: string;
  comingSoon?: boolean;
}
interface ParentItem { kind: 'parent'; key: NavKey; fr: string; en: string; children: LeafItem[]; }
type NavItem = LeafItem | ParentItem;

const UNIVERSITY_SUB: LeafItem[] = [
  { kind: 'leaf', key: 'manifesto',     fr: '/universite/manifeste',         en: '/en/university/manifeste' },
  { kind: 'leaf', key: 'presidentWord', fr: '/universite/mot-du-president',  en: '/en/university/mot-du-president' },
  { kind: 'leaf', key: 'partners',      fr: '/partenaires',                  en: '/en/partners' },
  { kind: 'leaf', key: 'newsUnm',       fr: '/actualites',                   en: '/en/news' },
  { kind: 'leaf', key: 'events',        fr: '/universite/evenements',        en: '/en/university/evenements' },
  { kind: 'leaf', key: 'newsroom',      fr: '/universite/newsroom',          en: '/en/university/newsroom' },
];

const FACULTIES_SUB: LeafItem[] = [
  { kind: 'leaf', key: 'facultyBusinessSchool', fr: '/facultes/business-school',      en: '/en/faculties/business-school' },
  { kind: 'leaf', key: 'facultyGovernance',     fr: '/facultes/school-of-governance', en: '/en/faculties/school-of-governance' },
  { kind: 'leaf', key: 'facultyTechnology',     fr: '/facultes/school-of-technology', en: '/en/faculties/school-of-technology', comingSoon: true },
  { kind: 'leaf', key: 'facultySportBusiness',  fr: '/facultes/school-of-sport-business', en: '/en/faculties/school-of-sport-business', comingSoon: true },
];

// Contact has moved to the utility TopBar. The primary nav stays focused
// on the academic offering and on the institutional gateways.
const ITEMS: NavItem[] = [
  { kind: 'parent', key: 'university',    fr: '/universite',    en: '/en/university',    children: UNIVERSITY_SUB },
  { kind: 'parent', key: 'faculties',     fr: '/facultes',      en: '/en/faculties',     children: FACULTIES_SUB },
  { kind: 'leaf',   key: 'programs',      fr: '/programmes',    en: '/en/programs'   },
  { kind: 'leaf',   key: 'admissions',    fr: '/admissions',    en: '/en/admissions' },
  { kind: 'leaf',   key: 'organisations', fr: '/organisations', en: '/en/organizations' },
];

// Shared classes for level-1 items: UPPERCASE, narrow tracking, no shadow.
// Inspired by HBS / Wharton / INSEAD main nav.
const L1_LINK =
  'rounded px-3 py-2 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-secondary hover:bg-warm-100 hover:text-primary';

export function Nav() {
  const locale = useLocale() as Locale;
  const t = useTranslations('nav');
  return (
    <ul className="flex items-center gap-1">
      {ITEMS.map((item) =>
        item.kind === 'leaf' ? (
          <li key={item.key}>
            <Link
              href={locale === 'en' ? item.en : item.fr}
              className={L1_LINK}
            >
              {t(item.key)}
            </Link>
          </li>
        ) : (
          <Dropdown
            key={item.key}
            label={t(item.key)}
            parentHref={locale === 'en' ? item.en : item.fr}
            comingSoonLabel={t('comingSoon')}
            items={item.children.map((c) => ({
              key: c.key,
              label: t(c.key),
              href: locale === 'en' ? c.en : c.fr,
              comingSoon: c.comingSoon,
            }))}
          />
        ),
      )}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────────────
// Dropdown
// Pattern: parent link + chevron button.
// - The parent link (e.g. "Université") is always clickable and goes
//   to the parent page.
// - The chevron button toggles the sub-menu.
// - Hovering the wrapper opens the menu (with small close-delay).
// - Keyboard: Esc closes, click outside closes.
// - Sub-items are always rendered (always in the DOM) but masked
//   when collapsed.
// ─────────────────────────────────────────────────────────────────

interface DropdownProps {
  label: string;
  parentHref: string;
  comingSoonLabel: string;
  items: {
    key: string;
    label: string;
    href: string;
    comingSoon?: boolean;
  }[];
}

function Dropdown({ label, parentHref, items, comingSoonLabel }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLLIElement>(null);
  const menuId = useId();

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <li
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => setOpen(true)}
      onBlur={scheduleClose}
    >
      <span className="inline-flex items-center rounded font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-secondary hover:bg-warm-100 hover:text-primary">
        <Link
          href={parentHref}
          className="rounded-l px-3 py-2 hover:text-primary"
        >
          {label}
        </Link>
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={`${label} — sous-menu`}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
              requestAnimationFrame(() => {
                document
                  .getElementById(menuId)
                  ?.querySelector<HTMLAnchorElement>('a[data-sub="1"]')
                  ?.focus();
              });
            }
          }}
          className="rounded-r px-2 py-2 hover:text-primary"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
          >
            <path fill="currentColor" d="M2 4l4 4 4-4z" />
          </svg>
        </button>
      </span>

      {/* The menu is always present in the DOM (SEO + crawlers + smoke-test).
          When closed, we mask it visually and disable pointer events. */}
      <div
        className={cn(
          'absolute left-0 top-full pt-2 transition-opacity duration-150',
          open
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none',
        )}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          aria-hidden={!open}
          className="min-w-[260px] rounded-card border border-warm-200 bg-warm-50 p-2 shadow-card-hover"
        >
          {items.map((it) =>
            it.comingSoon ? (
              // Non-clickable — communicates a planned but not-yet-open
              // resource. Still announced to screen readers via aria-disabled.
              <li key={it.key} role="none">
                <span
                  role="menuitem"
                  aria-disabled="true"
                  className="flex items-center justify-between gap-3 rounded px-3 py-2 font-sans text-sm font-medium text-secondary-400 cursor-not-allowed"
                >
                  <span>{it.label}</span>
                  <span className="rounded-full bg-warm-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary">
                    {comingSoonLabel}
                  </span>
                </span>
              </li>
            ) : (
              <li key={it.key} role="none">
                <Link
                  role="menuitem"
                  data-sub="1"
                  href={it.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="block rounded px-3 py-2 font-sans text-sm font-medium text-secondary hover:bg-warm-100 hover:text-primary focus-visible:bg-warm-100 focus-visible:text-primary"
                >
                  {it.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </li>
  );
}

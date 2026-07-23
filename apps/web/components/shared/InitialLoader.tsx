'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { useLocale, useTranslations } from 'next-intl';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { getBrandLogoSrc } from '@/lib/site-settings';
import { cn } from '@/lib/utils';

/** Hide splash for the rest of the browser session after Continuer. */
const STORAGE_KEY = 'unm-improvement-splash-v5';
const FADE_MS = 720;

/**
 * Set NEXT_PUBLIC_SHOW_RENOVATION_SPLASH=0 to hide the splash entirely.
 * Default: show once per session until the visitor clicks Continuer.
 */
const SPLASH_ENABLED = process.env.NEXT_PUBLIC_SHOW_RENOVATION_SPLASH !== '0';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-splash-display',
});

/** Deterministic ambient particles — no runtime randomness. */
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${3 + ((i * 19) % 94)}%`,
  top: `${5 + ((i * 31) % 90)}%`,
  size: 1.5 + (i % 4) * 0.75,
  delay: `${(i % 12) * 0.35}s`,
  duration: `${7 + (i % 7)}s`,
  tone: i % 3,
}));

function clearSiteLock() {
  document.documentElement.classList.remove('unm-site-locked');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

/**
 * Premium renovation splash. Visitors can continue into the site.
 */
export function InitialLoader() {
  const locale = useLocale();
  const t = useTranslations('renovation');
  const settings = useSiteSettings();
  const logoSrc = getBrandLogoSrc(settings) ?? LOGO_SRC;

  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!SPLASH_ENABLED) return;

    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      /* ignore */
    }

    setVisible(true);
    document.documentElement.classList.add('unm-site-locked');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const id = window.setTimeout(() => setReady(true), 32);
    return () => {
      window.clearTimeout(id);
      clearSiteLock();
    };
  }, []);

  useEffect(() => {
    if (!visible || exiting) return;

    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        root.style.setProperty('--mx', x.toFixed(3));
        root.style.setProperty('--my', y.toFixed(3));
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [visible, exiting]);

  const continueToSite = useCallback(() => {
    if (exiting) return;

    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }

    setExiting(true);
    clearSiteLock();

    window.setTimeout(() => setVisible(false), FADE_MS);
  }, [exiting]);

  useEffect(() => {
    if (!visible || exiting) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        continueToSite();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, exiting, continueToSite]);

  if (!visible) return null;

  const progressLabel =
    locale === 'en' ? 'Update in progress' : 'Mise à jour en cours';

  return (
    <section
      ref={rootRef}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="unm-maint-title"
      aria-describedby="unm-maint-subtitle"
      className={cn(
        'unm-maint',
        playfair.variable,
        ready && 'is-ready',
        exiting && 'is-exiting',
      )}
      style={{ ['--mx' as string]: '0', ['--my' as string]: '0' }}
    >
      <div className="unm-maint-frost" aria-hidden="true" />

      <div className="unm-maint-bg" aria-hidden="true">
        <div className="unm-maint-aurora" />
        <span className="unm-maint-orb unm-maint-orb-a" />
        <span className="unm-maint-orb unm-maint-orb-b" />
        <span className="unm-maint-orb unm-maint-orb-c" />
        <span className="unm-maint-veil" />
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className={cn('unm-maint-particle', `is-tone-${p.tone}`)}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="unm-maint-stage">
        <article className="unm-maint-card">
          <div className="unm-maint-glass" aria-hidden="true">
            <span className="unm-maint-specular" />
            <span className="unm-maint-shine" />
          </div>

          <header className="unm-maint-header">
            <div className="unm-maint-logo">
              <span className="unm-maint-logo-glow" aria-hidden="true" />
              <span className="unm-maint-ring unm-maint-ring-pulse" aria-hidden="true" />
              <span className="unm-maint-ring unm-maint-ring-a" aria-hidden="true" />
              <span className="unm-maint-ring unm-maint-ring-b" aria-hidden="true" />
              <span className="unm-maint-ring unm-maint-ring-c" aria-hidden="true" />
              <div className="unm-maint-logo-core">
                <Image
                  src={logoSrc}
                  alt={LOGO_ALT}
                  width={320}
                  height={148}
                  priority
                  unoptimized={logoSrc.startsWith('/cms-media/')}
                  className="unm-maint-logo-img"
                />
              </div>
            </div>

            <p className="unm-maint-badge">
              <span className="unm-maint-badge-dot" aria-hidden="true" />
              <span>{t('splashEyebrow')}</span>
            </p>

            <h1 id="unm-maint-title" className="unm-maint-title">
              {t('splashTitle')}
            </h1>
          </header>

          <p id="unm-maint-subtitle" className="unm-maint-subtitle">
            {t('splashSubtitle')}
          </p>

          <div
            className="unm-maint-loader"
            role="progressbar"
            aria-label={progressLabel}
            aria-valuetext={t('splashStatus')}
          >
            <span className="unm-maint-loader-track">
              <span className="unm-maint-loader-bar" />
              <span className="unm-maint-loader-glow" />
            </span>
          </div>

          <p className="unm-maint-status">{t('splashStatus')}</p>

          <div className="unm-maint-actions">
            <button
              type="button"
              className="unm-maint-cta"
              onClick={continueToSite}
              disabled={exiting}
            >
              {t('splashContinue')}
            </button>
          </div>
        </article>

        <footer className="unm-maint-footer">
          <p>{t('splashFooter')}</p>
        </footer>
      </div>
    </section>
  );
}

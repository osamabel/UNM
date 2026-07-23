'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LOGO_ALT, LOGO_SRC } from '@/lib/logo';
import { useSiteSettings } from '@/components/providers/SiteSettingsProvider';
import { getBrandLogoSrc } from '@/lib/site-settings';
import { cn } from '@/lib/utils';

/** Hide splash for the rest of the browser session after Continuer. */
const STORAGE_KEY = 'unm-improvement-splash-v5';
const FADE_MS = 420;

/**
 * Set NEXT_PUBLIC_SHOW_RENOVATION_SPLASH=0 to hide the splash entirely.
 * Default: show once per session until the visitor clicks Continuer.
 */
const SPLASH_ENABLED = process.env.NEXT_PUBLIC_SHOW_RENOVATION_SPLASH !== '0';

/** Deterministic ambient particles — no runtime randomness. */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${3 + ((i * 19) % 94)}%`,
  top: `${5 + ((i * 31) % 90)}%`,
  size: 1.5 + (i % 4) * 0.75,
  delay: `${(i % 12) * 0.35}s`,
  duration: `${7 + (i % 7)}s`,
  tone: i % 3,
}));

function clearSiteLock() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.remove('unm-site-locked');
  document.documentElement.style.removeProperty('overflow');
  document.body.style.removeProperty('overflow');
}

function applySiteLock() {
  document.documentElement.classList.add('unm-site-locked');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

type Phase = 'idle' | 'open' | 'leaving' | 'gone';

/**
 * Renovation splash.
 * Once shown, stays mounted and is only hidden with CSS (never unmounted)
 * to prevent React "removeChild" crashes with translators / HMR / portals.
 */
export function InitialLoader() {
  const locale = useLocale();
  const t = useTranslations('renovation');
  const settings = useSiteSettings();
  const logoSrc = getBrandLogoSrc(settings) ?? LOGO_SRC;

  const rootRef = useRef<HTMLElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [ready, setReady] = useState(false);
  /** True after splash has been opened this session render — never unmount after. */
  const [mountedOnce, setMountedOnce] = useState(false);

  useEffect(() => {
    if (!SPLASH_ENABLED) return;

    let skipped = false;
    try {
      skipped = window.sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      /* ignore */
    }
    if (skipped) return;

    setMountedOnce(true);
    setPhase('open');
    applySiteLock();
    const id = window.setTimeout(() => setReady(true), 32);

    return () => {
      window.clearTimeout(id);
      if (exitTimer.current) clearTimeout(exitTimer.current);
      clearSiteLock();
    };
  }, []);

  useEffect(() => {
    if (phase !== 'open') return;

    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
  }, [phase]);

  const continueToSite = useCallback(() => {
    if (phase !== 'open') return;

    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }

    setPhase('leaving');
    clearSiteLock();

    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => {
      setPhase('gone');
    }, FADE_MS);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'open') return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        continueToSite();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, continueToSite]);

  if (!mountedOnce) return null;

  const progressLabel =
    locale === 'en' ? 'Update in progress' : 'Mise à jour en cours';
  const leaving = phase === 'leaving';
  const gone = phase === 'gone';

  return (
    <section
      ref={rootRef}
      translate="no"
      role="alertdialog"
      aria-modal={phase === 'open'}
      aria-hidden={leaving || gone}
      aria-labelledby="unm-maint-title"
      aria-describedby="unm-maint-subtitle"
      className={cn(
        'unm-maint',
        ready && 'is-ready',
        leaving && 'is-exiting',
        gone && 'is-gone',
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
                {/* Plain img avoids next/image DOM churn during HMR / dismiss */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoSrc}
                  alt={LOGO_ALT}
                  width={320}
                  height={148}
                  className="unm-maint-logo-img"
                  decoding="async"
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
              disabled={leaving || gone}
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

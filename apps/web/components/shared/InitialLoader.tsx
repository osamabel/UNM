'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { BrandLoader } from '@/components/shared/BrandLoader';

const MIN_MS = 700;
const FADE_MS = 420;

/**
 * Brief first-paint splash with the UNM logo.
 * Fades out after window load (or a minimum display time).
 */
export function InitialLoader() {
  const locale = useLocale();
  const label = locale === 'en' ? 'Loading…' : 'Chargement…';
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();

    const finish = () => {
      const wait = Math.max(0, MIN_MS - (Date.now() - started));
      window.setTimeout(() => {
        if (cancelled) return;
        setExiting(true);
        window.setTimeout(() => {
          if (!cancelled) setVisible(false);
        }, FADE_MS);
      }, wait);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', finish);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={exiting ? 'brand-loader-exit' : undefined}
      style={{ pointerEvents: exiting ? 'none' : undefined }}
    >
      <BrandLoader fullscreen label={label} />
    </div>
  );
}

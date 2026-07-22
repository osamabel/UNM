'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';

const STORAGE_KEY = 'unm-renovation-banner-hidden-until';
/** Show again this many ms after the visitor dismisses it. */
const RESHOW_AFTER_MS = 30 * 60 * 1000; // 30 minutes

export function RenovationNotice() {
  const t = useTranslations('renovation');
  const [open, setOpen] = useState(false);
  const reshowRef = useRef<number | null>(null);

  useEffect(() => {
    function clearReshow() {
      if (reshowRef.current != null) {
        window.clearTimeout(reshowRef.current);
        reshowRef.current = null;
      }
    }

    function reveal() {
      setOpen(true);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }

    function scheduleReshow(delayMs: number) {
      clearReshow();
      reshowRef.current = window.setTimeout(reveal, Math.max(0, delayMs));
    }

    let boot: number | undefined;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const hiddenUntil = raw ? Number(raw) : 0;
      const now = Date.now();

      if (Number.isFinite(hiddenUntil) && hiddenUntil > now) {
        scheduleReshow(hiddenUntil - now);
      } else {
        boot = window.setTimeout(reveal, 300);
        if (raw) window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      boot = window.setTimeout(reveal, 300);
    }

    return () => {
      if (boot) window.clearTimeout(boot);
      clearReshow();
    };
  }, []);

  function dismiss() {
    setOpen(false);
    const hiddenUntil = Date.now() + RESHOW_AFTER_MS;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(hiddenUntil));
    } catch {
      /* ignore */
    }
    if (reshowRef.current != null) window.clearTimeout(reshowRef.current);
    reshowRef.current = window.setTimeout(() => {
      setOpen(true);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      reshowRef.current = null;
    }, RESHOW_AFTER_MS);
  }

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative z-[45] border-b border-primary/20 bg-secondary text-warm-50 animate-fade-in"
    >
      <div className="container-page flex items-start gap-3 py-2.5 sm:items-center sm:py-3">
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-200 sm:mt-0">
          <Icon name="sparkles" size={14} />
        </span>

        <p className="min-w-0 flex-1 text-[13px] leading-snug text-warm-100/95 sm:text-sm sm:leading-relaxed">
          <span className="font-heading font-semibold text-warm-50">{t('title')}.</span>{' '}
          <span className="text-warm-200/90">{t('message')}</span>
        </p>

        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md p-1.5 text-warm-300 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={t('close')}
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  );
}

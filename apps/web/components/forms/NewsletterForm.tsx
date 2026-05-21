'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const t = useTranslations('footer');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'ok' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={submit} className={cn('flex flex-col gap-3', className)} aria-label="Newsletter">
      <label
        htmlFor="newsletter-email"
        className="font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-200"
      >
        {t('newsletter')}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder={t('newsletterPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-footer"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-uni btn-uni-primary h-11 shrink-0 rounded-xl px-6 text-sm sm:px-5"
        >
          {t('newsletterSubmit')}
        </button>
      </div>
      {status === 'ok' && (
        <p className="text-xs text-warm-100" role="status">
          {t('newsletterSuccess')}
        </p>
      )}
      {status === 'error' && (
        <p className="text-xs text-primary-200" role="alert">
          !
        </p>
      )}
    </form>
  );
}

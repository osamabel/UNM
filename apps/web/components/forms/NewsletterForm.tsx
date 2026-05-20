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
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={submit} className={cn('flex flex-col gap-2', className)} aria-label="Newsletter">
      <label htmlFor="newsletter-email" className="font-heading text-xs font-semibold uppercase tracking-wider text-warm-50">
        {t('newsletter')}
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder={t('newsletterPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 flex-1 rounded border border-warm-500/40 bg-secondary-700 px-3 text-sm text-warm-50 placeholder:text-warm-300 focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="h-10 rounded bg-primary px-3 font-heading text-sm font-medium text-white hover:bg-[#CE4B2A] disabled:opacity-50"
        >
          OK
        </button>
      </div>
      {status === 'ok' && <p className="text-xs text-warm-100">✓</p>}
      {status === 'error' && <p className="text-xs text-primary-100">!</p>}
    </form>
  );
}

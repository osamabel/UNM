'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@unm/types';

interface Props {
  programSlug: string;
  programTitle: string;
}

export function BrochureDownload({ programSlug, programTitle }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const t = useTranslations('forms');
  const tc = useTranslations('common');
  const locale = useLocale() as Locale;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('errorEmail'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName: 'Brochure',
          lastName: 'Request',
          phone: '',
          programSlug,
          source: 'brochure',
          medium: 'website',
          campaign: programSlug,
          consentGiven: true,
        }),
      });
      if (!res.ok) throw new Error();
      const data: { brochureUrl?: string } = await res.json();
      setDownloadUrl(data.brochureUrl ?? `/api/brochures/${programSlug}`);
    } catch {
      setError(t('errorGeneric'));
    } finally {
      setLoading(false);
    }
  }

  if (downloadUrl) {
    return (
      <div id="brochure" className="rounded-card bg-warm-100 p-6 text-center">
        <p className="font-heading text-secondary">{t('thankYou')}</p>
        <a
          href={downloadUrl}
          className="mt-4 inline-flex"
          download
        >
          <Button>{tc('downloadBrochure')}</Button>
        </a>
      </div>
    );
  }

  return (
    <form
      id="brochure"
      onSubmit={submit}
      className="rounded-card bg-warm-100 p-6"
      aria-label="Brochure"
    >
      <h3 className="font-display text-xl text-secondary">
        {locale === 'en' ? 'Get the brochure' : 'Recevoir la brochure'}
      </h3>
      <p className="mt-1 text-sm text-secondary-400">
        {programTitle}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          label={t('email')}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error ?? undefined}
          className="flex-1"
        />
        <Button type="submit" loading={loading}>
          {tc('downloadBrochure')}
        </Button>
      </div>
    </form>
  );
}

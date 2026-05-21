'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

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
  const tp = useTranslations('program');
  const tc = useTranslations('common');

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
      <div id="brochure" className="form-panel px-6 py-10 text-center sm:px-10 sm:py-12">
        <span className="icon-box mx-auto h-14 w-14">
          <Icon name="check-circle" size={28} className="text-primary" />
        </span>
        <p className="mt-5 font-display text-xl text-secondary">{t('thankYou')}</p>
        <a href={downloadUrl} className="mt-6 inline-flex w-full sm:w-auto" download>
          <Button
            fullWidth
            size="lg"
            trailingIcon={<Icon name="document" size={18} />}
            className="sm:!w-auto"
          >
            {tc('downloadBrochure')}
          </Button>
        </a>
      </div>
    );
  }

  return (
    <form
      id="brochure"
      onSubmit={submit}
      className="form-panel relative overflow-hidden"
      aria-label={tp('brochureTitle')}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex min-w-0 flex-1 gap-4 sm:max-w-[42%]">
          <span className="icon-box h-11 w-11 shrink-0 sm:h-12 sm:w-12">
            <Icon name="document" size={22} />
          </span>
          <div className="min-w-0">
            <p className="eyebrow">{tp('brochureEyebrow')}</p>
            <h3 className="mt-2 font-display text-display-md text-secondary">{tp('brochureTitle')}</h3>
            <p className="mt-1.5 font-medium text-secondary/80 line-clamp-2">{programTitle}</p>
            <p className="mt-2 text-xs leading-relaxed text-secondary/50">{tp('brochureHint')}</p>
          </div>
        </div>

        <div className="relative min-w-0 flex-1 sm:pt-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <Input
                label={t('email')}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error ?? undefined}
                autoComplete="email"
              />
            </div>
            <Button
              type="submit"
              loading={loading}
              size="lg"
              fullWidth
              trailingIcon={<Icon name="arrow-right" size={18} />}
              className="shrink-0 sm:!w-auto sm:min-w-[12.5rem]"
            >
              {tc('downloadBrochure')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

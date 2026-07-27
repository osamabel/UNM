'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
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
  const locale = useLocale() as Locale;
  const isEn = locale === 'en';
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
      <ScrollReveal from="up" duration={800}>
        <div id="brochure" className="brochure-shell brochure-shell--success">
          <div className="brochure-success">
            <span className="brochure-success-icon" aria-hidden>
              <Icon name="check-circle" size={28} />
            </span>
            <p className="brochure-success-title">{t('thankYou')}</p>
            <p className="brochure-success-hint">{tp('brochureHint')}</p>
            <a href={downloadUrl} className="brochure-success-action" download>
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
        </div>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal from="up" duration={900} blur>
      <form
        id="brochure"
        onSubmit={submit}
        className="brochure-shell"
        aria-label={tp('brochureTitle')}
      >
        <div className="brochure-glow" aria-hidden />

        <div className="brochure-layout">
          <div className="brochure-copy glass-dark">
            <span className="brochure-copy-shine" aria-hidden />
            <div className="brochure-meta">
              <span className="brochure-icon" aria-hidden>
                <Icon name="document" size={20} />
              </span>
              <p className="brochure-eyebrow">{tp('brochureEyebrow')}</p>
            </div>

            <h3 className="brochure-title">{tp('brochureTitle')}</h3>
            <p className="brochure-program">{programTitle}</p>
            <p className="brochure-hint">{tp('brochureHint')}</p>

            <ul className="brochure-proofs">
              <li>
                <Icon name="check" size={14} />
                PDF
              </li>
              <li>
                <Icon name="check" size={14} />
                {isEn ? 'Instant download' : 'Envoi immédiat'}
              </li>
            </ul>
          </div>

          <div className="brochure-form">
            <Input
              label={t('email')}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error ?? undefined}
              autoComplete="email"
              placeholder="name@email.com"
            />
            <Button
              type="submit"
              loading={loading}
              size="lg"
              fullWidth
              trailingIcon={<Icon name="arrow-right" size={18} />}
            >
              {tc('downloadBrochure')}
            </Button>
          </div>
        </div>
      </form>
    </ScrollReveal>
  );
}

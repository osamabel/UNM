'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CallbackRequestForm } from '@/components/forms/CallbackRequestForm';
import type { Locale, Program } from '@unm/types';
import { formatCurrency, localized } from '@/lib/utils';

interface Props {
  program: Program;
}

export function StickyProgramCTA({ program }: Props) {
  const locale = useLocale() as Locale;
  const tc = useTranslations('common');
  const t = useTranslations('program');
  const [callbackOpen, setCallbackOpen] = useState(false);

  return (
    <>
      <aside className="rounded-card border border-warm-200 bg-white p-6 shadow-card lg:sticky lg:top-32 lg:self-start">
        <p className="font-heading text-xs font-semibold uppercase tracking-wider text-secondary-400">
          {t('tuition')}
        </p>
        <p className="mt-1 font-display text-3xl text-secondary">
          {program.tuitionFee != null
            ? formatCurrency(program.tuitionFee, locale)
            : t('tuitionOnRequest')}
        </p>
        <p className="mt-3 text-sm text-secondary-400">
          {t('startDate')}:{' '}
          <span className="font-medium text-secondary">
            {new Date(program.startDate).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href={`${locale === 'en' ? '/en/admissions' : '/admissions'}?program=${program.slug}`}
          >
            <Button fullWidth size="lg">{tc('apply')}</Button>
          </Link>
          <Link href="#brochure">
            <Button fullWidth variant="ghost">
              {tc('downloadBrochure')}
            </Button>
          </Link>
          {/* "Être contacté" — opens the lightweight callback modal */}
          <Button
            fullWidth
            variant="secondary"
            onClick={() => setCallbackOpen(true)}
          >
            {tc('requestCallback')}
          </Button>
        </div>
      </aside>

      <Modal
        open={callbackOpen}
        onClose={() => setCallbackOpen(false)}
        title={tc('requestCallback')}
        size="sm"
      >
        <CallbackRequestForm
          programSlug={program.slug}
          programTitle={localized(program.title, locale)}
          onSuccess={() => setCallbackOpen(false)}
        />
      </Modal>
    </>
  );
}

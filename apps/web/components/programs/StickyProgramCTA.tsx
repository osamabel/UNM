'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Icon } from '@/components/ui/Icon';
import { CallbackRequestForm } from '@/components/forms/CallbackRequestForm';
import type { Locale, Program } from '@unm/types';
import { formatCurrency, localized } from '@/lib/utils';

interface Props {
  program: Program;
}

export function ProgramCTACard({
  program,
  onCallback,
}: {
  program: Program;
  onCallback: () => void;
}) {
  const locale = useLocale() as Locale;
  const tc = useTranslations('common');
  const t = useTranslations('program');

  return (
    <div className="card-interactive p-6">
      <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary/50">
        {t('tuition')}
      </p>
      <p className="mt-1 font-display text-2xl text-secondary sm:text-3xl">
        {program.tuitionFee != null
          ? formatCurrency(program.tuitionFee, locale)
          : t('tuitionOnRequest')}
      </p>
      <p className="mt-3 flex items-center gap-2 text-sm text-secondary/65">
        <Icon name="calendar" size={14} className="shrink-0 text-primary/80" />
        <span>
          {t('startDate')}:{' '}
          <span className="font-medium text-secondary">
            {new Date(program.startDate).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </span>
      </p>
      <div className="mt-6 flex flex-col gap-2.5">
        <ButtonLink
          href={`${locale === 'en' ? '/en/admissions' : '/admissions'}?program=${program.slug}`}
          fullWidth
          size="lg"
          trailingIcon={<Icon name="arrow-right" size={18} />}
        >
          {tc('apply')}
        </ButtonLink>
        <ButtonLink href="#brochure" fullWidth variant="ghost">
          {tc('downloadBrochure')}
        </ButtonLink>
        <Button fullWidth variant="secondary" onClick={onCallback}>
          {tc('requestCallback')}
        </Button>
      </div>
    </div>
  );
}

/** Sidebar on desktop; also renders mobile CTA card when used inside the content column. */
export function StickyProgramCTA({ program }: Props) {
  const [callbackOpen, setCallbackOpen] = useState(false);
  const locale = useLocale() as Locale;
  const tc = useTranslations('common');
  const openCallback = () => setCallbackOpen(true);

  return (
    <>
      <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <ProgramCTACard program={program} onCallback={openCallback} />
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

/** Mobile-only CTA block — place at top of programme content column. */
export function ProgramCTAMobile({ program }: Props) {
  const [callbackOpen, setCallbackOpen] = useState(false);
  const locale = useLocale() as Locale;
  const tc = useTranslations('common');

  return (
    <>
      <div className="lg:hidden">
        <ProgramCTACard program={program} onCallback={() => setCallbackOpen(true)} />
      </div>
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

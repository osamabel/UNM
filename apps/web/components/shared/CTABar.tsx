'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@unm/types';

interface CTABarProps {
  programSlug?: string;
  hidden?: boolean;
}

export function CTABar({ programSlug, hidden }: CTABarProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

  if (hidden) return null;

  const applyHref =
    locale === 'en' ? '/en/admissions' : '/admissions';
  const brochureAnchor = programSlug ? '#brochure' : '#';
  const waMessage = encodeURIComponent(
    locale === 'en'
      ? `Hello, I would like more info on ${programSlug ?? 'UNM programs'}.`
      : `Bonjour, je souhaite des informations sur ${programSlug ?? "les programmes UNM"}.`,
  );

  const contactHref = locale === 'en' ? '/en/contact' : '/contact';

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-20 border-t border-warm-200 bg-warm-50/95 backdrop-blur pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
      role="navigation"
      aria-label={t('apply')}
    >
      <div className="grid grid-cols-3 divide-x divide-warm-200">
        <Link
          href={applyHref}
          className="flex h-14 items-center justify-center bg-primary font-heading text-sm font-semibold text-white"
        >
          {t('apply')}
        </Link>
        <Link
          href={programSlug ? brochureAnchor : contactHref}
          className="flex h-14 items-center justify-center font-heading text-sm font-medium text-secondary"
        >
          {programSlug ? t('downloadBrochure') : t('contactUs')}
        </Link>
        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center font-heading text-sm font-medium text-secondary"
        >
          {t('whatsapp')}
        </a>
      </div>
    </div>
  );
}

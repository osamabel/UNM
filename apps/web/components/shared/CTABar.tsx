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

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-warm-200 bg-warm-50/95 backdrop-blur lg:hidden">
      <div className="grid grid-cols-3 divide-x divide-warm-200">
        <Link
          href={applyHref}
          className="flex h-14 items-center justify-center bg-primary font-heading text-sm font-semibold text-white"
        >
          {t('apply')}
        </Link>
        <a
          href={brochureAnchor}
          className="flex h-14 items-center justify-center font-heading text-sm font-medium text-secondary"
        >
          {t('downloadBrochure')}
        </a>
        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center font-heading text-sm font-medium text-secondary"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}

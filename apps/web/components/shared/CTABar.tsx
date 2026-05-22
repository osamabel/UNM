'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
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

  const applyHref = locale === 'en' ? '/en/admissions' : '/admissions';
  const brochureAnchor = programSlug ? '#brochure' : '#';
  const waMessage = encodeURIComponent(
    locale === 'en'
      ? `Hello, I would like more info on ${programSlug ?? 'UNM programs'}.`
      : `Bonjour, je souhaite des informations sur ${programSlug ?? 'les programmes UNM'}.`,
  );
  const contactHref = locale === 'en' ? '/en/contact' : '/contact';

  return (
    <div
      className="glass-strong fixed inset-x-0 bottom-0 z-20 border-t border-white/50 lg:hidden"
      role="navigation"
      aria-label={t('apply')}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-3 divide-x divide-warm-150/80">
        <Link
          href={applyHref}
          className="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 bg-primary px-2 font-heading text-xs font-semibold text-white sm:text-sm"
        >
          <Icon name="send" size={16} className="opacity-90" />
          <span>{t('apply')}</span>
        </Link>
        <Link
          href={programSlug ? brochureAnchor : contactHref}
          className="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 px-2 font-heading text-xs font-medium text-secondary sm:text-sm"
        >
          <Icon name="document" size={16} className="text-primary/80" />
          <span className="line-clamp-1 text-center">
            {programSlug ? t('downloadBrochure') : t('contactUs')}
          </span>
        </Link>
        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 px-2 font-heading text-xs font-medium text-secondary sm:text-sm"
        >
          <Icon name="phone" size={16} className="text-[#25D366]" />
          <span>{t('whatsapp')}</span>
        </a>
      </div>
    </div>
  );
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@unm/types';

interface Props {
  programName?: string;
}

export function WhatsAppButton({ programName }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/[^0-9]/g, '');
  const subject = programName ?? (locale === 'en' ? 'UNM programs' : 'les programmes UNM');
  const message = encodeURIComponent(
    locale === 'en'
      ? `Hello, I would like more information about ${subject}.`
      : `Bonjour, je souhaite des informations sur ${subject}.`,
  );

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp')}
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] right-4 z-30 hidden h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-[#25D366]/90 text-white shadow-lg backdrop-blur-md transition-all duration-300 ease-smooth hover:scale-110 hover:shadow-[0_8px_32px_rgba(37,211,102,0.45)] lg:bottom-6 lg:flex motion-reduce:hover:scale-100"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 2C8.3 2 2 8.3 2 16c0 2.5.7 4.9 2 7L2 30l7.1-1.9c2 1.1 4.4 1.7 6.9 1.7 7.7 0 14-6.3 14-14S23.7 2 16 2zm0 25.5c-2.2 0-4.3-.6-6.1-1.7l-.4-.3-4.2 1.1 1.1-4.1-.3-.4A11.5 11.5 0 1 1 16 27.5zm6.3-8.7c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.6.2-.2.3-.4.5-.6.2-.2.2-.3.4-.5.1-.2.1-.4 0-.5-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.3 3.1c.2.3 2.2 3.3 5.3 4.7.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.3z"
        />
      </svg>
    </a>
  );
}

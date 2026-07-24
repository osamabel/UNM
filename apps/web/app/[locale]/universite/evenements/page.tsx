import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@unm/types';

/** Legacy URL — events now live under the Actualités hub. */
export default function EventsRedirect({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  redirect(params.locale === 'en' ? '/en/news?tab=evenement' : '/actualites?tab=evenement');
}

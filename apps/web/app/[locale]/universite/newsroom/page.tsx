import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@unm/types';

/** Legacy URL — newsroom now lives under the Actualités hub. */
export default function NewsroomRedirect({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  redirect(params.locale === 'en' ? '/en/news?tab=newsroom' : '/actualites?tab=newsroom');
}

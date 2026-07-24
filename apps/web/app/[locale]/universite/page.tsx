import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@unm/types';

/** University index is hidden — send visitors to the Manifesto. */
export default function UniversityIndexRedirect({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  redirect(params.locale === 'en' ? '/en/university/manifeste' : '/universite/manifeste');
}

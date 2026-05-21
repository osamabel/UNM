import { cookies, headers } from 'next/headers';
import { ButtonLink } from '@/components/ui/Button';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';

async function detectLocale(): Promise<'fr' | 'en'> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  if (localeCookie === 'en') return 'en';

  const h = await headers();
  const pathHint = h.get('x-invoke-path') ?? h.get('referer') ?? '';
  if (pathHint.includes('/en')) return 'en';
  return 'fr';
}

export default async function NotFound() {
  const locale = await detectLocale();
  const t = locale === 'en' ? enMessages.notFound : frMessages.notFound;
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        {t.eyebrow}
      </p>
      <h1 className="mt-3 font-display text-display-lg text-secondary">{t.title}</h1>
      <p className="mt-4 max-w-md text-secondary-400">{t.description}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href={prefix || '/'}>{t.home}</ButtonLink>
        <ButtonLink href={locale === 'en' ? '/en/programs' : '/programmes'} variant="ghost">
          {t.programs}
        </ButtonLink>
        <ButtonLink href={`${prefix}/contact`} variant="ghost">
          {t.contact}
        </ButtonLink>
      </div>
    </div>
  );
}

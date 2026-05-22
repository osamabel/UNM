import { cookies, headers } from 'next/headers';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
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
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="icon-box h-16 w-16 text-primary">
        <Icon name="search" size={32} className="text-primary/80" />
      </span>
      <p className="eyebrow mt-8">{t.eyebrow}</p>
      <h1 className="mt-3 font-display text-display-lg text-secondary">{t.title}</h1>
      <p className="mt-4 max-w-md leading-relaxed text-secondary/75">{t.description}</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href={prefix || '/'} leadingIcon={<Icon name="home" size={18} />}>
          {t.home}
        </ButtonLink>
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

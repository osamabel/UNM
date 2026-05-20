import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { Faculty, Locale } from '@unm/types';
import { localized } from '@/lib/utils';

interface Props {
  faculty: Faculty;
}

export function FacultyHero({ faculty }: Props) {
  const locale = useLocale() as Locale;
  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{ backgroundColor: faculty.color || '#B5341A' }}
    >
      {faculty.coverImage?.url && (
        <Image
          src={faculty.coverImage.url}
          alt=""
          fill
          priority
          className="-z-10 object-cover opacity-30"
          sizes="100vw"
        />
      )}
      <div className="container-page py-20 lg:py-28">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
          {locale === 'en' ? 'Faculty' : 'Faculté'}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-display-lg">
          {localized(faculty.name, locale)}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/90">
          {localized(faculty.description, locale)}
        </p>
      </div>
    </section>
  );
}

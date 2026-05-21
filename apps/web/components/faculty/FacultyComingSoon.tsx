import { useLocale } from 'next-intl';
import type { Faculty, Locale } from '@unm/types';
import { ButtonLink } from '@/components/ui/Button';
import { localized } from '@/lib/utils';

// Rendered when a faculty is announced but not yet open.
// Replaces the full faculty template with a single dignified hero.
export function FacultyComingSoon({ faculty }: { faculty: Faculty }) {
  const locale = useLocale() as Locale;
  const isEn = locale === 'en';
  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{ backgroundColor: faculty.color || '#3D1A0B' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(60%_50%_at_15%_30%,rgba(255,255,255,0.25),transparent_60%)]"
      />
      <div className="container-page py-24 lg:py-32">
        <span className="inline-flex rounded-full bg-white/20 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
          {isEn ? 'In preparation' : 'En préparation'}
        </span>
        <h1 className="mt-4 max-w-3xl font-display text-display-lg">
          {localized(faculty.name, locale)}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/90">
          {localized(faculty.description, locale)}
        </p>
        <p className="mt-10 font-heading text-sm uppercase tracking-[0.18em] text-white/80">
          {isEn
            ? 'Opening in a future intake — get notified.'
            : 'Ouverture à une prochaine rentrée — restez informé.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={isEn ? '/en/contact' : '/contact'} size="lg" variant="secondary">
            {isEn ? 'Get notified' : 'Être informé'}
          </ButtonLink>
          <ButtonLink
            href={isEn ? '/en/faculties' : '/facultes'}
            size="lg"
            variant="ghost"
            className="border border-white/30 text-white hover:bg-white/10"
          >
            {isEn ? 'Back to faculties' : 'Voir les facultés'}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

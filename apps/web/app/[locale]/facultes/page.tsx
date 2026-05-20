import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { FacultiesShowcase } from '@/components/faculty/FacultiesShowcase';
import { getFaculties } from '@/lib/api';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const isEn = params.locale === 'en';
  return {
    title: isEn ? 'Faculties' : 'Facultés',
    description: isEn
      ? 'UNM Business School is the first operational faculty. Three more faculties are in preparation: Governance & Public Affairs, Technology, Sport Business.'
      : "L'UNM Business School est la première faculté opérationnelle. Trois autres facultés sont en préparation : Gouvernance & Affaires Publiques, Technology, Sport Business.",
  };
}

export default async function FacultiesIndex({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
  const faculties = await getFaculties();
  const isEn = params.locale === 'en';
  const active = faculties.filter((f) => !f.comingSoon).length;
  const upcoming = faculties.filter((f) => f.comingSoon).length;

  return (
    <>
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          { name: isEn ? 'Faculties' : 'Facultés', url: isEn ? '/en/faculties' : '/facultes' },
        ]}
      />

      {/* Editorial intro — fine line of context, no oversized hero */}
      <section className="border-b border-warm-200">
        <div className="container-page py-12 lg:py-16">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            {isEn ? 'Faculties' : 'Facultés'}
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-display-lg text-secondary">
            {isEn
              ? 'One operational school. Three in the making.'
              : 'Une école en activité. Trois en préparation.'}
          </h1>
          <p className="mt-4 max-w-2xl text-secondary-400">
            {isEn
              ? `UNM is structured around four faculties. ${active} is operational today, ${upcoming} are being prepared for upcoming intakes.`
              : `L'UNM est structurée autour de quatre facultés. ${active} est opérationnelle aujourd'hui, ${upcoming} sont en préparation pour les prochaines rentrées.`}
          </p>
        </div>
      </section>

      <FacultiesShowcase faculties={faculties} />
    </>
  );
}

import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PartnerLogos } from '@/components/home/PartnerLogos';
import { getPartners } from '@/lib/api';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return { title: params.locale === 'en' ? 'Partners' : 'Partenaires' };
}

export default async function PartnersPage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);
  const partners = await getPartners();
  const isEn = params.locale === 'en';
  return (
    <>
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          { name: isEn ? 'Partners' : 'Partenaires', url: isEn ? '/en/partners' : '/partenaires' },
        ]}
      />
      <SectionWrapper>
        <h1 className="font-display text-display-lg text-secondary">
          {isEn ? 'Our partners' : 'Nos partenaires'}
        </h1>
        <p className="mt-3 max-w-2xl text-secondary-400">
          {isEn
            ? 'Academic, industry, and government partners supporting our students.'
            : 'Partenaires académiques, industriels et institutionnels qui soutiennent nos étudiants.'}
        </p>
      </SectionWrapper>
      <PartnerLogos partners={partners} />
    </>
  );
}

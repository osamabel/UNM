import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PhotoHero } from '@/components/patterns/PhotoHero';
import { PartnersShowcase } from '@/components/partners/PartnersShowcase';
import { PartnersEbsFeature } from '@/components/partners/PartnersEbsFeature';
import { CTABanner } from '@/components/home/CTABanner';
import { getPartners } from '@/lib/api';
import { PAGE_HERO_IMAGE } from '@/lib/page-heroes';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'partnersIndex' });
  return { title: t('metaTitle') };
}

export default async function PartnersPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [partners, t, tb] = await Promise.all([
    getPartners(),
    getTranslations({ locale: params.locale, namespace: 'partnersIndex' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const partnersUrl = isEn ? '/en/partners' : '/partenaires';

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: partnersUrl },
        ]}
      />

      <PhotoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        imageSrc={PAGE_HERO_IMAGE.partners}
        imageAlt={
          isEn
            ? 'African executive leader — UNM ecosystem and partnerships'
            : 'Dirigeante africaine — écosystème et partenariats UNM'
        }
        imagePosition="center 30%"
      />

      <SectionWrapper tone="canvas" className="!pb-6 !pt-10 sm:!pb-8 sm:!pt-12">
        <PartnersEbsFeature locale={params.locale} />
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <PartnersShowcase partners={partners} />
      </SectionWrapper>

      <CTABanner />
    </>
  );
}

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PhotoHero } from '@/components/patterns/PhotoHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { FacultiesShowcase } from '@/components/faculty/FacultiesShowcase';
import { CTABanner } from '@/components/home/CTABanner';
import { getFaculties } from '@/lib/api';
import { PAGE_HERO_IMAGE } from '@/lib/page-heroes';
import type { Locale } from '@unm/types';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'facultiesIndex' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function FacultiesIndex({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [faculties, t, tb] = await Promise.all([
    getFaculties(),
    getTranslations({ locale: params.locale, namespace: 'facultiesIndex' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const facultiesUrl = isEn ? '/en/faculties' : '/facultes';
  const programsUrl = isEn ? '/en/programs' : '/programmes';
  const active = faculties.filter((f) => !f.comingSoon).length;
  const upcoming = faculties.filter((f) => f.comingSoon).length;

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: facultiesUrl },
        ]}
      />

      <PhotoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle', { active, upcoming })}
        imageSrc={PAGE_HERO_IMAGE.faculties}
        imageAlt={
          isEn
            ? 'African professionals — UNM faculties and schools'
            : 'Professionnels africains — facultés et écoles UNM'
        }
        imagePosition="center 40%"
      >
        <div className="faculties-hero-actions">
          <ButtonLink
            href="#facultes-liste"
            size="lg"
            trailingIcon={<Icon name="arrow-right" size={18} />}
          >
            {t('ctaExplore')}
          </ButtonLink>
          <ButtonLink
            href={programsUrl}
            size="lg"
            variant="ghost"
            className="faculties-hero-ghost"
            trailingIcon={<Icon name="arrow-right" size={16} />}
          >
            {t('ctaPrograms')}
          </ButtonLink>
        </div>
        <ul className="photo-hero-trust mt-5">
          <li>
            <Icon name="check-circle" size={14} className="text-[rgba(255,196,170,0.95)]" />
            {t('trustActive', { count: active })}
          </li>
          <li>
            <Icon name="library" size={14} className="text-[rgba(255,196,170,0.95)]" />
            {t('trustUpcoming', { count: upcoming })}
          </li>
        </ul>
      </PhotoHero>

      <SectionWrapper tone="canvas" className="!pt-9 sm:!pt-11" id="facultes-liste">
        <FacultiesShowcase faculties={faculties} />
      </SectionWrapper>

      <CTABanner />
    </>
  );
}

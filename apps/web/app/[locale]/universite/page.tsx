import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PageHeader } from '@/components/patterns/PageHeader';
import { Icon } from '@/components/ui/Icon';
import { StatsBar } from '@/components/home/StatsBar';
import { EBSPartnership } from '@/components/home/EBSPartnership';
import { CTABanner } from '@/components/home/CTABanner';
import type { Locale } from '@unm/types';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'universityIndex' });
  return { title: t('metaTitle') };
}

const ACCREDITATIONS = ['EFMD', 'AACSB Business Education Alliance', 'CEFDG'] as const;

const CAMPUSES = [
  {
    city: { fr: 'Marrakech', en: 'Marrakech' },
    line1: { fr: 'Borj Menara I', en: 'Borj Menara I' },
    line2: { fr: 'Av. Abdelkrim El Khattabi, Marrakech, Maroc', en: 'Av. Abdelkrim El Khattabi, Marrakech, Morocco' },
  },
  {
    city: { fr: 'Laâyoune', en: 'Laâyoune' },
    line1: { fr: 'N°8, Al Bouchra', en: 'N°8, Al Bouchra' },
    line2: { fr: 'Av. Alfourssane, Laâyoune, Maroc', en: 'Av. Alfourssane, Laâyoune, Morocco' },
  },
] as const;

export default async function UniversityPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [t, tb] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: 'universityIndex' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const universityUrl = isEn ? '/en/university' : '/universite';
  const loc = isEn ? 'en' : 'fr';

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: universityUrl },
        ]}
      />

      <SectionWrapper tone="soft" className="!pb-10 sm:!pb-12">
        <PageHeader
          icon="landmark"
          eyebrow={t('eyebrow')}
          title={t('title')}
          className="border-0 pb-0"
        />
        <div className="prose prose-secondary mt-6 max-w-prose text-secondary/80 sm:mt-8">
          <p>{t('intro1')}</p>
          <p>{t('intro2')}</p>
          <p>{t('intro3')}</p>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2 sm:mt-8">
          <li>
            <a
              href={isEn ? '/en/university/manifeste' : '/universite/manifeste'}
              className="glass-pill text-xs font-semibold text-secondary/75 transition-colors hover:bg-white/90"
            >
              {isEn ? 'Manifesto' : 'Manifeste'}
            </a>
          </li>
          <li>
            <a
              href={isEn ? '/en/university/mot-du-president' : '/universite/mot-du-president'}
              className="glass-pill text-xs font-semibold text-secondary/75 transition-colors hover:bg-white/90"
            >
              {isEn ? "President's word" : 'Mot du Président'}
            </a>
          </li>
        </ul>
      </SectionWrapper>

      <StatsBar />

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <EBSPartnership />
      </SectionWrapper>

      <SectionWrapper tone="soft">
        <p className="eyebrow">{t('missionTitle')}</p>
        <p className="mt-4 max-w-3xl font-display text-xl leading-snug text-secondary sm:text-2xl">
          {t('missionBody')}
        </p>

        <h2 className="mt-12 font-display text-display-md text-secondary sm:mt-14">{t('campusesTitle')}</h2>
        <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-5">
          {CAMPUSES.map((c) => (
            <div key={c.city.fr} className="card-interactive p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="icon-box h-10 w-10 shrink-0">
                  <Icon name="map-pin" size={20} />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    {c.city[loc]}
                  </p>
                  <p className="mt-1 font-display text-xl text-secondary">{c.line1[loc]}</p>
                  <p className="mt-1 text-sm leading-relaxed text-secondary/60">{c.line2[loc]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-display-md text-secondary sm:mt-14">
          {t('accreditationsTitle')}
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {ACCREDITATIONS.map((label) => (
            <li key={label} className="glass-pill text-sm font-medium text-secondary/75">
              <Icon name="shield" size={14} className="shrink-0 text-primary/80" />
              {label}
            </li>
          ))}
        </ul>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}

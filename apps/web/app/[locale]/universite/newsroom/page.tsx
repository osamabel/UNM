import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { UniversitySubHero } from '@/components/university/UniversitySubHero';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { NEWSROOM_RESOURCES_STUB } from '@/lib/newsroom-resources';
import { localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'newsroomIndex' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function NewsroomPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const [t, tu, tb] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: 'newsroomIndex' }),
    getTranslations({ locale: params.locale, namespace: 'universityIndex' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const universityUrl = isEn ? '/en/university' : '/universite';
  const newsroomUrl = isEn ? '/en/university/newsroom' : '/universite/newsroom';
  const newsUrl = isEn ? '/en/news' : '/actualites';

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: tu('breadcrumb'), url: universityUrl },
          { name: t('breadcrumb'), url: newsroomUrl },
        ]}
      />

      <UniversitySubHero eyebrow={t('eyebrow')} title={t('title')} subtitle={t('intro')} />

      <SectionWrapper tone="soft">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_minmax(0,18rem)] lg:gap-14">
          <div className="min-w-0">
            <h2 className="font-display text-2xl text-secondary sm:text-3xl">{t('resourcesTitle')}</h2>
            <p className="mt-2 max-w-prose text-sm text-secondary/60">{t('resourcesHint')}</p>
            <ul className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4">
              {NEWSROOM_RESOURCES_STUB.map((r, i) => (
                <li key={r.key}>
                  <ScrollReveal delay={i * 50} className="h-full">
                    <div className="card-flat flex h-full items-center gap-4 p-4 sm:p-5">
                      <span className="icon-box h-10 w-10 shrink-0">
                        <Icon name={r.icon} size={20} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-heading text-sm font-semibold text-secondary">
                          {localized(r.name, params.locale)}
                        </p>
                        <p className="mt-0.5 text-xs text-secondary/50">{localized(r.size, params.locale)}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>

          <aside className="card-interactive h-fit p-5 sm:p-6 lg:sticky lg:top-32">
            <p className="eyebrow">{t('contactEyebrow')}</p>
            <p className="mt-3 font-display text-xl text-secondary sm:text-2xl">{t('contactTitle')}</p>
            <ul className="mt-5 space-y-3 text-sm text-secondary/75">
              <li>
                <a
                  href="mailto:presse@unm.ma"
                  className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary-600"
                >
                  <Icon name="mail" size={16} className="shrink-0" />
                  presse@unm.ma
                </a>
              </li>
              <li>
                <a
                  href="tel:+212662626219"
                  className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary-600"
                >
                  <Icon name="phone" size={16} className="shrink-0" />
                  +212 6 62 62 62 19
                </a>
              </li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-secondary/55">{t('contactNote')}</p>
            <ButtonLink href="mailto:presse@unm.ma" className="mt-6 w-full justify-center sm:w-auto">
              {t('contactCta')}
            </ButtonLink>
          </aside>
        </div>
      </SectionWrapper>

      <SectionWrapper tone="canvas">
        <h2 className="font-display text-2xl text-secondary sm:text-3xl">{t('releasesTitle')}</h2>
        <div className="card-flat mt-6 flex flex-col items-center gap-4 px-6 py-10 text-center sm:px-10 sm:py-12">
          <span className="icon-box h-12 w-12">
            <Icon name="newspaper" size={24} />
          </span>
          <p className="max-w-md text-sm leading-relaxed text-secondary/60">{t('releasesEmpty')}</p>
          <ButtonLink href={newsUrl} variant="secondary">
            {t('releasesLink')}
          </ButtonLink>
        </div>
      </SectionWrapper>
    </>
  );
}

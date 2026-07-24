import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PhotoHero } from '@/components/patterns/PhotoHero';
import { Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { NewsArticleList } from '@/components/news/NewsArticleList';
import { NewsHubTabs } from '@/components/news/NewsHubTabs';
import { CTABanner } from '@/components/home/CTABanner';
import { getArticles } from '@/lib/api';
import { parseNewsHubTab } from '@/lib/article-category';
import { PAGE_HERO_IMAGE } from '@/lib/page-heroes';
import type { Locale } from '@unm/types';

export const revalidate = 300;

interface Props {
  params: { locale: Locale };
  searchParams: { page?: string; tab?: string };
}

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'newsIndex' });
  return { title: t('metaTitle'), description: t('subtitle') };
}

export default async function NewsIndex({ params, searchParams }: Props) {
  setRequestLocale(params.locale);
  const tab = parseNewsHubTab(searchParams.tab);
  const page = Math.max(1, Number(searchParams.page) || 1);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const newsUrl = isEn ? '/en/news' : '/actualites';
  const contactUrl = isEn ? '/en/contact' : '/contact';

  const [{ docs, totalPages }, allCount, actualiteCount, evenementCount, newsroomCount, t, tb] =
    await Promise.all([
      getArticles({
        page,
        perPage: 12,
        channel: tab === 'all' ? 'all' : tab,
      }),
      getArticles({ page: 1, perPage: 1, channel: 'all' }),
      getArticles({ page: 1, perPage: 1, channel: 'actualite' }),
      getArticles({ page: 1, perPage: 1, channel: 'evenement' }),
      getArticles({ page: 1, perPage: 1, channel: 'newsroom' }),
      getTranslations({ locale: params.locale, namespace: 'newsIndex' }),
      getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
    ]);

  const counts = {
    all: allCount.totalDocs,
    actualite: actualiteCount.totalDocs,
    evenement: evenementCount.totalDocs,
    newsroom: newsroomCount.totalDocs,
  };

  const pageHref = (n: number) => {
    const params = new URLSearchParams();
    if (tab !== 'all') params.set('tab', tab);
    if (n > 1) params.set('page', String(n));
    const q = params.toString();
    return q ? `${newsUrl}?${q}` : newsUrl;
  };

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: newsUrl },
        ]}
      />

      <PhotoHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        imageSrc={PAGE_HERO_IMAGE.news}
        imageAlt={
          isEn
            ? 'UNM community and African graduates — news hub'
            : 'Communauté UNM et diplômés africains — hub actualités'
        }
        imagePosition="center 28%"
      />

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        <NewsHubTabs active={tab} counts={counts} basePath={newsUrl} />

        {docs.length > 0 ? (
          <div className="mt-8 sm:mt-10">
            <NewsArticleList articles={docs} locale={params.locale} />
          </div>
        ) : (
          <div className="card-flat mt-8 px-6 py-16 text-center sm:mt-10 sm:px-10">
            <span className="icon-box mx-auto h-14 w-14">
              <Icon name="newspaper" size={28} />
            </span>
            <p className="mt-5 font-display text-xl text-secondary">
              {tab === 'all' ? t('empty') : t('emptyTab')}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex flex-wrap justify-center gap-2 sm:mt-12">
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              const active = n === page;
              return (
                <Link
                  key={n}
                  href={pageHref(n)}
                  aria-current={active ? 'page' : undefined}
                  className={
                    active
                      ? 'glass-pill min-h-9 min-w-9 justify-center bg-primary/90 font-semibold text-white'
                      : 'glass-pill min-h-9 min-w-9 justify-center font-medium text-secondary/70 hover:bg-white/90'
                  }
                >
                  {n}
                </Link>
              );
            })}
          </nav>
        )}

        {tab === 'newsroom' || tab === 'all' ? (
          <aside className="news-hub-press mt-12 sm:mt-14">
            <div className="news-hub-press-inner">
              <p className="eyebrow text-primary">{t('pressContactTitle')}</p>
              <p className="mt-3 max-w-xl text-secondary/75">{t('pressContactBody')}</p>
              <ButtonLink
                href={contactUrl}
                size="md"
                className="mt-5"
                trailingIcon={<Icon name="arrow-right" size={16} />}
              >
                {t('pressContactCta')}
              </ButtonLink>
            </div>
          </aside>
        ) : null}
      </SectionWrapper>

      <CTABanner />
    </>
  );
}

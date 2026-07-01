import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PageHeader } from '@/components/patterns/PageHeader';
import { Icon } from '@/components/ui/Icon';
import { NewsArticleList } from '@/components/news/NewsArticleList';
import { CTABanner } from '@/components/home/CTABanner';
import { getArticles } from '@/lib/api';
import type { Locale } from '@unm/types';

export const revalidate = 300;

interface Props {
  params: { locale: Locale };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'newsIndex' });
  return { title: t('metaTitle') };
}

export default async function NewsIndex({ params, searchParams }: Props) {
  setRequestLocale(params.locale);
  const page = Math.max(1, Number(searchParams.page) || 1);
  const [{ docs, totalPages }, t, tb] = await Promise.all([
    getArticles(page, 12),
    getTranslations({ locale: params.locale, namespace: 'newsIndex' }),
    getTranslations({ locale: params.locale, namespace: 'breadcrumb' }),
  ]);
  const isEn = params.locale === 'en';
  const homeUrl = isEn ? '/en' : '/';
  const newsUrl = isEn ? '/en/news' : '/actualites';

  return (
    <>
      <Breadcrumb
        items={[
          { name: tb('home'), url: homeUrl },
          { name: t('breadcrumb'), url: newsUrl },
        ]}
      />

      <SectionWrapper tone="soft" className="!pb-10 sm:!pb-12">
        <PageHeader
          icon="newspaper"
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('subtitle')}
          className="border-0 pb-0"
        />
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pt-8 sm:!pt-10">
        {docs.length > 0 ? (
          <NewsArticleList articles={docs} locale={params.locale} />
        ) : (
          <div className="card-flat px-6 py-16 text-center sm:px-10">
            <span className="icon-box mx-auto h-14 w-14">
              <Icon name="newspaper" size={28} />
            </span>
            <p className="mt-5 font-display text-xl text-secondary">{t('empty')}</p>
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
                  href={`?page=${n}`}
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
      </SectionWrapper>

      <CTABanner />
    </>
  );
}

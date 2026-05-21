import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/shared/JsonLd';
import { CTABanner } from '@/components/home/CTABanner';
import { articleSchema } from '@/lib/schema';
import {
  accentForArticleCategory,
  articleCategoryLabel,
  iconForArticleCategory,
  isPlaceholderCover,
} from '@/lib/article-category';
import { getArticle, getArticles } from '@/lib/api';
import { articlePath, formatDate, localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export const revalidate = 600;

interface Params {
  params: { locale: Locale; slug: string };
}

export async function generateStaticParams() {
  const { docs } = await getArticles(1, 100).catch(() => ({ docs: [], totalPages: 0 }));
  return docs.flatMap((a) => [
    { locale: 'fr', slug: a.slug },
    { locale: 'en', slug: a.slug },
  ]);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return {};
  return {
    title: localized(article.title, params.locale),
    description: localized(article.excerpt, params.locale),
    openGraph: {
      title: localized(article.title, params.locale),
      description: localized(article.excerpt, params.locale),
      type: 'article',
      images: article.coverImage?.url ? [article.coverImage.url] : [],
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  unstable_setRequestLocale(params.locale);
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const isEn = params.locale === 'en';
  const title = localized(article.title, params.locale);
  const categoryLabel = articleCategoryLabel(article.category, params.locale);
  const catIcon = iconForArticleCategory(article.category);
  const accent = accentForArticleCategory(article.category);
  const showCover =
    article.coverImage?.url && !isPlaceholderCover(article.coverImage.url, article.coverImage.alt);

  return (
    <>
      <JsonLd data={articleSchema(article, params.locale)} />
      <Breadcrumb
        items={[
          { name: isEn ? 'Home' : 'Accueil', url: isEn ? '/en' : '/' },
          { name: isEn ? 'News' : 'Actualités', url: isEn ? '/en/news' : '/actualites' },
          { name: title, url: articlePath(article.slug, params.locale) },
        ]}
      />

      <SectionWrapper tone="soft" className="!pb-8 sm:!pb-10">
        <div className="mx-auto max-w-3xl min-w-0">
          <span className="glass-pill text-xs font-semibold uppercase tracking-[0.1em] text-secondary/75">
            <Icon name={catIcon} size={14} className="shrink-0 text-primary" />
            {categoryLabel}
          </span>
          <h1 className="mt-5 break-words font-display text-3xl leading-tight text-secondary sm:text-4xl lg:text-display-lg">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-secondary/70 sm:text-lg">
            {localized(article.excerpt, params.locale)}
          </p>
          <ul className="mt-6 flex flex-wrap gap-3 text-sm text-secondary/55">
            <li className="inline-flex items-center gap-1.5">
              <Icon name="user" size={15} className="text-primary/75" />
              {article.author.name}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Icon name="calendar" size={15} className="text-primary/75" />
              {formatDate(article.publishedAt, params.locale)}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Icon name="clock" size={15} className="text-primary/75" />
              {article.readingTime} min
            </li>
          </ul>
        </div>
      </SectionWrapper>

      <SectionWrapper tone="canvas" className="!pt-0">
        <div className="mx-auto max-w-3xl min-w-0">
          {showCover ? (
            <div className="card-flat relative aspect-[16/9] w-full overflow-hidden p-0">
              <Image
                src={article.coverImage.url}
                alt={article.coverImage.alt || title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="card-flat relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden p-0"
              style={{ background: `linear-gradient(135deg, ${accent}12 0%, var(--unm-canvas) 55%, ${accent}08 100%)` }}
            >
              <span
                className="flex h-20 w-20 items-center justify-center rounded-2xl sm:h-24 sm:w-24"
                style={{ backgroundColor: `${accent}20`, color: accent }}
              >
                <Icon name={catIcon} size={44} weight="medium" />
              </span>
            </div>
          )}
          <div
            className="prose prose-lg mt-8 max-w-none text-secondary/90 sm:mt-10"
            dangerouslySetInnerHTML={{ __html: localized(article.body, params.locale) }}
          />
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}

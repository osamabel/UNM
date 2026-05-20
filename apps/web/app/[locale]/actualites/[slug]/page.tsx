import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JsonLd } from '@/components/shared/JsonLd';
import { articleSchema } from '@/lib/schema';
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
  return (
    <>
      <JsonLd data={articleSchema(article, params.locale)} />
      <Breadcrumb
        items={[
          { name: params.locale === 'en' ? 'Home' : 'Accueil', url: params.locale === 'en' ? '/en' : '/' },
          { name: params.locale === 'en' ? 'News' : 'Actualités', url: params.locale === 'en' ? '/en/news' : '/actualites' },
          { name: localized(article.title, params.locale), url: articlePath(article.slug, params.locale) },
        ]}
      />
      <article className="container-page py-10 lg:py-16">
        <p className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">
          {article.category}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-display-lg text-secondary">
          {localized(article.title, params.locale)}
        </h1>
        <p className="mt-4 text-sm text-secondary-400">
          {article.author.name} · {formatDate(article.publishedAt, params.locale)} · {article.readingTime} min
        </p>
        {article.coverImage?.url && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-card">
            <Image
              src={article.coverImage.url}
              alt={article.coverImage.alt ?? ''}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        )}
        <div
          className="prose prose-lg mt-10 max-w-prose text-secondary"
          dangerouslySetInnerHTML={{ __html: localized(article.body, params.locale) }}
        />
      </article>
    </>
  );
}

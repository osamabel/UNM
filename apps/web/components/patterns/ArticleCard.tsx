import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import {
  accentForArticleCategory,
  articleCategoryLabel,
  iconForArticleCategory,
  isPlaceholderCover,
} from '@/lib/article-category';
import { articlePath, formatDate, localized } from '@/lib/utils';
import type { Article, Locale } from '@unm/types';

interface Props {
  article: Article;
  locale: Locale;
}

export function ArticleCard({ article, locale }: Props) {
  const title = localized(article.title, locale);
  const categoryLabel = articleCategoryLabel(article.category, locale);
  const catIcon = iconForArticleCategory(article.category);
  const accent = accentForArticleCategory(article.category);
  const showCover =
    article.coverImage?.url && !isPlaceholderCover(article.coverImage.url, article.coverImage.alt);

  return (
    <Link href={articlePath(article.slug, locale)} className="group block h-full min-w-0">
      <article className="card-interactive flex h-full flex-col overflow-hidden p-0">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-warm-100">
          {showCover ? (
            <>
              <Image
                src={article.coverImage.url}
                alt={article.coverImage.alt || title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03] motion-reduce:transform-none"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
            </>
          ) : (
            <>
              <div
                className="absolute inset-0 bg-gradient-to-br from-white/80 via-warm-50/90 to-warm-100"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full blur-2xl opacity-40"
                style={{ backgroundColor: accent }}
                aria-hidden
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20"
                  style={{ backgroundColor: `${accent}18`, color: accent }}
                >
                  <Icon name={catIcon} size={36} weight="medium" />
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <span className="glass-pill w-fit text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary/75">
            <Icon name={catIcon} size={13} className="shrink-0 text-primary" />
            {categoryLabel}
          </span>
          <h2 className="mt-3 font-display text-lg leading-snug text-secondary line-clamp-2 transition-colors duration-300 group-hover:text-primary sm:text-xl">
            {title}
          </h2>
          <p className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-xs text-secondary/55 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="calendar" size={14} className="text-primary/75" />
              {formatDate(article.publishedAt, locale)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" size={14} className="text-primary/75" />
              {article.readingTime} min
            </span>
            <Icon
              name="arrow-right"
              size={15}
              className="ml-auto text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 [@media(hover:none)]:opacity-70"
            />
          </p>
        </div>
      </article>
    </Link>
  );
}

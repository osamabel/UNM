'use client';

import { ScrollReveal } from '@/components/patterns/ScrollReveal';
import { ArticleCard } from '@/components/patterns/ArticleCard';
import type { Article, Locale } from '@unm/types';

interface Props {
  articles: Article[];
  locale: Locale;
}

export function NewsArticleList({ articles, locale }: Props) {
  return (
    <ul className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {articles.map((article, index) => (
        <li key={article.id} className="min-w-0">
          <ScrollReveal delay={60 + index * 55}>
            <ArticleCard article={article} locale={locale} />
          </ScrollReveal>
        </li>
      ))}
    </ul>
  );
}

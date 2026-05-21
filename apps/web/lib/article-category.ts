import type { IconName } from '@/components/ui/Icon';
import type { ArticleCategory, Locale } from '@unm/types';

const CATEGORY_ICON: Record<ArticleCategory, IconName> = {
  campus: 'map-pin',
  recherche: 'flask',
  partenariats: 'sparkles',
  evenements: 'calendar',
};

const CATEGORY_ACCENT: Record<ArticleCategory, string> = {
  campus: '#B5341A',
  recherche: '#3D1A0B',
  partenariats: '#8B3D2A',
  evenements: '#C45A2A',
};

/** CMS seed uses the UNM logo JPEG as placeholder cover — treat as missing art. */
export function isPlaceholderCover(url?: string | null, alt?: string | null): boolean {
  if (!url) return true;
  const hay = `${url} ${alt ?? ''}`.toLowerCase();
  return hay.includes('logo') || hay.includes('placeholder') || hay.includes('logo-unm') || hay.includes('unm.png');
}

export function iconForArticleCategory(category: ArticleCategory): IconName {
  return CATEGORY_ICON[category] ?? 'newspaper';
}

export function accentForArticleCategory(category: ArticleCategory): string {
  return CATEGORY_ACCENT[category] ?? '#B5341A';
}

export function articleCategoryLabel(category: ArticleCategory, locale: Locale): string {
  const labels: Record<ArticleCategory, { fr: string; en: string }> = {
    campus: { fr: 'Campus', en: 'Campus' },
    recherche: { fr: 'Recherche', en: 'Research' },
    partenariats: { fr: 'Partenariats', en: 'Partnerships' },
    evenements: { fr: 'Événements', en: 'Events' },
  };
  return labels[category]?.[locale] ?? category;
}

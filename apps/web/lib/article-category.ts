import type { IconName } from '@/components/ui/Icon';
import type { ArticleCategory, ArticleChannel, ArticleEventKind, Locale } from '@unm/types';

export type NewsHubTab = 'all' | ArticleChannel;

export const NEWS_HUB_TABS: NewsHubTab[] = ['all', 'actualite', 'evenement', 'newsroom'];

const CATEGORY_ICON: Record<ArticleCategory, IconName> = {
  campus: 'map-pin',
  recherche: 'flask',
  partenariats: 'handshake',
  evenements: 'megaphone',
  presse: 'newspaper',
};

const CATEGORY_ACCENT: Record<ArticleCategory, string> = {
  campus: '#B5341A',
  recherche: '#3D1A0B',
  partenariats: '#8B3D2A',
  evenements: '#C45A2A',
  presse: '#5C2E1A',
};

const CHANNEL_ICON: Record<ArticleChannel, IconName> = {
  actualite: 'newspaper',
  evenement: 'calendar',
  newsroom: 'megaphone',
};

/** CMS seed uses the UNM logo JPEG as placeholder cover — treat as missing art. */
export function isPlaceholderCover(url?: string | null, alt?: string | null): boolean {
  if (!url) return true;
  const hay = `${url} ${alt ?? ''}`.toLowerCase();
  return (
    hay.includes('logo') ||
    hay.includes('placeholder') ||
    hay.includes('logo-unm') ||
    hay.includes('unm.png') ||
    hay.includes('unmtrans')
  );
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
    presse: { fr: 'Presse', en: 'Press' },
  };
  return labels[category]?.[locale] ?? category;
}

export function iconForChannel(channel: ArticleChannel): IconName {
  return CHANNEL_ICON[channel] ?? 'newspaper';
}

export function parseNewsHubTab(raw?: string | null): NewsHubTab {
  if (raw === 'actualite' || raw === 'evenement' || raw === 'newsroom' || raw === 'all') return raw;
  // Legacy deep-links from old university pages
  if (raw === 'evenements' || raw === 'events') return 'evenement';
  if (raw === 'presse' || raw === 'press') return 'newsroom';
  return 'all';
}

export function eventKindLabel(kind: ArticleEventKind | undefined, locale: Locale): string {
  if (!kind || kind === 'other') {
    return locale === 'en' ? 'Event' : 'Événement';
  }
  const labels: Record<Exclude<ArticleEventKind, 'other'>, { fr: string; en: string }> = {
    openDay: { fr: 'Journée Portes Ouvertes', en: 'Open day' },
    webinar: { fr: 'Webinaire', en: 'Webinar' },
    masterclass: { fr: 'Masterclass', en: 'Masterclass' },
  };
  return labels[kind][locale];
}

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { NEWS_HUB_TABS, iconForChannel, type NewsHubTab } from '@/lib/article-category';
import { cn } from '@/lib/utils';
import type { ArticleChannel } from '@unm/types';

type Counts = Partial<Record<NewsHubTab, number>>;

type Props = {
  active: NewsHubTab;
  counts?: Counts;
  basePath: string;
};

export function NewsHubTabs({ active, counts, basePath }: Props) {
  const t = useTranslations('newsIndex');

  return (
    <nav className="news-hub-tabs" aria-label={t('tabsLabel')}>
      <ul className="news-hub-tabs-list" role="tablist">
        {NEWS_HUB_TABS.map((tab) => {
          const selected = tab === active;
          const href = tab === 'all' ? basePath : `${basePath}?tab=${tab}`;
          const count = counts?.[tab];
          const icon =
            tab === 'all' ? ('layers' as const) : iconForChannel(tab as ArticleChannel);

          return (
            <li key={tab} role="presentation">
              <Link
                href={href}
                role="tab"
                aria-selected={selected}
                className={cn('news-hub-tab', selected && 'is-active')}
                scroll={false}
              >
                <Icon name={icon} size={15} className="shrink-0 opacity-80" />
                <span>{t(`tabs.${tab}`)}</span>
                {typeof count === 'number' ? (
                  <span className="news-hub-tab-count" aria-hidden>
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="news-hub-tabs-hint">{t(`hints.${active}`)}</p>
    </nav>
  );
}

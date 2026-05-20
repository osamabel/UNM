import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { getArticles } from '@/lib/api';
import { articlePath, formatDate, localized } from '@/lib/utils';
import type { Locale } from '@unm/types';

export const revalidate = 300;

interface Props {
  params: { locale: Locale };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return { title: params.locale === 'en' ? 'News' : 'Actualités' };
}

export default async function NewsIndex({ params, searchParams }: Props) {
  unstable_setRequestLocale(params.locale);
  const page = Math.max(1, Number(searchParams.page) || 1);
  const { docs, totalPages } = await getArticles(page, 12);
  return (
    <>
      <Breadcrumb
        items={[
          { name: params.locale === 'en' ? 'Home' : 'Accueil', url: params.locale === 'en' ? '/en' : '/' },
          { name: params.locale === 'en' ? 'News' : 'Actualités', url: params.locale === 'en' ? '/en/news' : '/actualites' },
        ]}
      />
      <SectionWrapper>
        <h1 className="font-display text-display-lg text-secondary">
          {params.locale === 'en' ? 'News' : 'Actualités'}
        </h1>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((a) => (
            <Link key={a.id} href={articlePath(a.slug, params.locale)}>
              <Card interactive className="overflow-hidden h-full">
                {a.coverImage?.url && (
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={a.coverImage.url}
                      alt={a.coverImage.alt ?? ''}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-xs font-heading font-semibold uppercase tracking-wider text-primary">
                    {a.category}
                  </p>
                  <h2 className="mt-2 font-display text-lg text-secondary line-clamp-2">
                    {localized(a.title, params.locale)}
                  </h2>
                  <p className="mt-2 text-sm text-secondary-400">
                    {formatDate(a.publishedAt, params.locale)} · {a.readingTime} min
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              return (
                <Link
                  key={n}
                  href={`?page=${n}`}
                  aria-current={n === page ? 'page' : undefined}
                  className={`h-9 w-9 rounded grid place-items-center text-sm ${
                    n === page ? 'bg-primary text-white' : 'bg-warm-100 text-secondary hover:bg-warm-200'
                  }`}
                >
                  {n}
                </Link>
              );
            })}
          </nav>
        )}
      </SectionWrapper>
    </>
  );
}

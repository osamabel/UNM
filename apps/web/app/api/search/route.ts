import { NextResponse } from 'next/server';
import { MeiliSearch } from 'meilisearch';

export const runtime = 'nodejs';

const client = new MeiliSearch({
  host: process.env.MEILI_HOST ?? 'http://localhost:7700',
  apiKey: process.env.MEILI_SEARCH_KEY,
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? '';
  const locale = url.searchParams.get('locale') ?? 'fr';
  if (!q.trim()) {
    return NextResponse.json({ programs: [], faculties: [], articles: [] });
  }
  const titleField = locale === 'en' ? 'title.en' : 'title.fr';
  try {
    const [programs, faculties, articles] = await Promise.all([
      client.index('programs').search(q, { limit: 5 }),
      client.index('faculties').search(q, { limit: 5 }),
      client.index('articles').search(q, { limit: 5 }),
    ]);
    const map = (hits: any[], kind: 'program' | 'faculty' | 'article') =>
      hits.map((h) => ({
        id: h.id,
        slug: h.slug,
        title:
          (locale === 'en' ? h.title?.en : h.title?.fr) ??
          h.title?.fr ??
          h.name?.fr ??
          h.name?.en ??
          '',
        kind,
      }));
    return NextResponse.json(
      {
        programs: map(programs.hits, 'program'),
        faculties: map(faculties.hits, 'faculty'),
        articles: map(articles.hits, 'article'),
      },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      },
    );
  } catch {
    return NextResponse.json({ programs: [], faculties: [], articles: [] });
  }
}

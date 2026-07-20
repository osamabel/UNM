import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-demand ISR purge after CMS edits.
 * GET/POST /api/revalidate?secret=...&tag=partners
 * Optional: &path=/  (also revalidate a route)
 */
export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const expected = process.env.REVALIDATE_SECRET || process.env.PAYLOAD_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const tag = req.nextUrl.searchParams.get('tag') || 'partners';
  const path = req.nextUrl.searchParams.get('path');

  const tags = tag === 'all'
    ? ['partners', 'site-settings', 'faculties', 'programs', 'testimonials', 'articles']
    : tag.split(',').map((t) => t.trim()).filter(Boolean);

  for (const t of tags) {
    revalidateTag(t);
  }

  if (path) {
    revalidatePath(path);
    revalidatePath('/en');
  } else {
    // Home + partners pages always refresh with partner edits
    revalidatePath('/');
    revalidatePath('/en');
    revalidatePath('/partenaires');
    revalidatePath('/en/partners');
  }

  return NextResponse.json({ ok: true, revalidated: { tags, paths: path ? [path] : ['/', '/en', '/partenaires', '/en/partners'] } });
}

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 86400;

function cmsOrigin(): string {
  const raw =
    process.env.CMS_API_URL?.replace(/\/api\/?$/, '') ||
    process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '') ||
    'http://localhost:3001';
  return raw.replace(/\/$/, '').replace(/\/api$/, '');
}

/**
 * Runtime proxy: /cms-media/<file> → CMS /media/<file>
 * Uses server env at request time (unlike next.config rewrites baked at build).
 */
export async function GET(
  _req: NextRequest,
  context: { params: { path: string[] } },
) {
  const segments = context.params.path ?? [];
  if (segments.length === 0) {
    return new NextResponse('Not found', { status: 404 });
  }

  // Prevent path traversal
  if (segments.some((s) => s === '..' || s.includes('\\'))) {
    return new NextResponse('Bad request', { status: 400 });
  }

  const filename = segments.map(encodeURIComponent).join('/');
  const target = `${cmsOrigin()}/media/${filename}`;

  try {
    const upstream = await fetch(target, {
      headers: { Accept: 'image/*,application/pdf,*/*' },
      next: { revalidate: 86400 },
    });

    if (!upstream.ok || !upstream.body) {
      return new NextResponse('Not found', { status: 404 });
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch {
    return new NextResponse('Bad gateway', { status: 502 });
  }
}

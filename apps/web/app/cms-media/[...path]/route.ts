import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function cmsOrigin(): string {
  const raw =
    process.env.CMS_API_URL?.replace(/\/api\/?$/, '') ||
    process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '') ||
    'http://localhost:3001';
  return raw.replace(/\/$/, '').replace(/\/api$/, '');
}

/**
 * Runtime proxy: /cms-media/<file> → CMS /media/<file>
 * Short cache so Media tray edits show up quickly after ISR refresh.
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
      next: { revalidate: 60 },
    });

    if (!upstream.ok || !upstream.body) {
      return new NextResponse('Not found', { status: 404 });
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch {
    return new NextResponse('Bad gateway', { status: 502 });
  }
}

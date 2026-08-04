import { NextResponse } from 'next/server';
import { getBrochurePublicUrl } from '@/lib/brochures';

export const runtime = 'nodejs';

/** Redirect to the static brochure PDF for a program slug. */
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug?.trim();
  if (!slug) {
    return NextResponse.json({ error: 'missing_slug' }, { status: 400 });
  }
  return NextResponse.redirect(new URL(getBrochurePublicUrl(slug), _req.url), 302);
}

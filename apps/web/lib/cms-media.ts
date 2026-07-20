/**
 * Serve Payload uploads through the Next.js origin (`/cms-media/...`)
 * so HTTPS pages never load bare `http://IP:3001/media/...` (mixed content).
 */

const CMS_MEDIA_PREFIX = '/cms-media/';

function cmsOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '') ||
    process.env.CMS_API_URL?.replace(/\/api\/?$/, '') ||
    'http://localhost:3001';
  return raw.replace(/\/api\/?$/, '');
}

/** True when this absolute URL points at our CMS host. */
function isCmsHost(hostname: string): boolean {
  try {
    return hostname === new URL(cmsOrigin()).hostname;
  } catch {
    return false;
  }
}

/**
 * Convert a CMS media URL (absolute or `/media/...`) into a same-origin
 * public path the browser can load over HTTPS.
 */
export function toPublicMediaUrl(url?: string | null): string | null {
  if (!url) return null;

  if (url.startsWith(CMS_MEDIA_PREFIX)) return url;

  // Local static assets — leave alone
  if (
    url.startsWith('/LOGS/') ||
    url.startsWith('/images/') ||
    url.startsWith('/unm') ||
    url.startsWith('/home') ||
    url.startsWith('/logo')
  ) {
    return url;
  }

  if (url.startsWith('/media/')) {
    return `${CMS_MEDIA_PREFIX}${url.slice('/media/'.length)}`;
  }

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      const isMediaPath = parsed.pathname.startsWith('/media/');

      // Already secure CMS (future domain) — keep as-is
      if (parsed.protocol === 'https:' && isMediaPath && isCmsHost(parsed.hostname)) {
        return url;
      }

      // HTTP CMS (IP or localhost) or any CMS /media path → proxy
      if (isMediaPath && (parsed.protocol === 'http:' || isCmsHost(parsed.hostname))) {
        return `${CMS_MEDIA_PREFIX}${parsed.pathname.slice('/media/'.length)}${parsed.search}`;
      }
    } catch {
      return url;
    }
  }

  return url;
}

/** Rewrite `url` on a Media-like object. */
export function rewriteMedia<T extends { url?: string | null } | null | undefined>(media: T): T {
  if (!media || typeof media !== 'object') return media;
  const next = toPublicMediaUrl(media.url);
  if (!next || next === media.url) return media;
  return { ...media, url: next };
}

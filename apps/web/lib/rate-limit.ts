// Token-bucket rate limit per IP. Backed by Upstash REST in production,
// falls back to an in-memory map in development.

interface Bucket {
  remaining: number;
  resetAt: number;
}

const memoryStore = new Map<string, Bucket>();
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export async function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60 * 60 * 1000,
): Promise<RateLimitResult> {
  const now = Date.now();
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    const ttlSeconds = Math.ceil(windowMs / 1000);
    const r = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      body: JSON.stringify([
        ['INCR', `rl:${key}`],
        ['EXPIRE', `rl:${key}`, ttlSeconds, 'NX'],
      ]),
    }).then((res) => res.json());
    const count = Number(r?.[0]?.result ?? 0);
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetAt: now + windowMs,
    };
  }

  // Dev fallback
  const existing = memoryStore.get(key);
  if (!existing || existing.resetAt < now) {
    memoryStore.set(key, { remaining: limit - 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (existing.remaining <= 0) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }
  existing.remaining -= 1;
  return { allowed: true, remaining: existing.remaining, resetAt: existing.resetAt };
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

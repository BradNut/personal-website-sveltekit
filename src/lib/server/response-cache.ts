import { NO_CACHE } from '#lib/constants/cache-control.ts';
import { redisService } from '#lib/server/redis.ts';

/** A cached payload and the cache-control header to send with it. */
export type CachedResponse<T> = { value: T; cacheControl: string };

/**
 * Cached JSON payloads for one external data source (Wallabag articles, Bandcamp albums).
 * Owns the cache-control policy for cached responses so every source handles TTLs alike.
 * Redis stays optional: a disabled or unreachable cache reads as a miss and skips writes.
 */
export type ResponseCache<T> = {
  /** The cached payload with a TTL-derived `max-age`, or `null` on a miss or unreadable entry. */
  read(key: string): Promise<CachedResponse<T> | null>;
  /** Stores the payload for the cache's TTL. */
  write(key: string, value: T): Promise<void>;
  /** The cache-control header for a freshly fetched payload that was just written. */
  readonly freshCacheControl: string;
};

export function createResponseCache<T>({ prefix, ttlSeconds }: { prefix: string; ttlSeconds: number }): ResponseCache<T> {
  return {
    freshCacheControl: `max-age=${ttlSeconds}`,

    async read(key) {
      const cached = await redisService.get({ prefix, key });
      if (!cached) return null;

      let value: T;
      try {
        value = JSON.parse(cached);
      } catch {
        console.warn(`[cache] unreadable ${prefix} entry, treating as a miss`);
        return null;
      }

      const ttl = await redisService.ttl({ prefix, key });
      // ttl <= 0: expired since the read (-2), no expiry set (-1), or the lookup failed open (0);
      // never send max-age=0 or a negative max-age
      return { value, cacheControl: ttl > 0 ? `max-age=${ttl}` : NO_CACHE };
    },

    async write(key, value) {
      await redisService.setWithExpiry({ prefix, key, value: JSON.stringify(value), expiry: ttlSeconds });
    },
  };
}

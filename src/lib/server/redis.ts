import { Redis } from 'ioredis';
import { ENV } from 'varlock/env';
import { building } from '$app/env';

const NAMESPACE = 'personal-website';

/**
 * The cache is optional: a command gets this long before it counts as failed. Pages must
 * not wait on an unreachable Redis, so every failure is treated as a miss or a skipped write.
 */
const COMMAND_TIMEOUT_MS = 500;
/** How long one connection attempt may take before ioredis gives up and schedules a retry. */
const CONNECT_TIMEOUT_MS = 1000;
/** Connection states in which Redis is known to be down; commands are skipped instead of queued. */
const UNAVAILABLE_STATUSES: ReadonlySet<Redis['status']> = new Set<Redis['status']>(['reconnecting', 'close', 'end']);

export const REDIS_PREFIXES = {
  ARTICLES: 'articles',
  BANDCAMP_ALBUMS: 'bandcampAlbums',
  PAGE_CACHE: 'pageCache',
} as const;

class RedisService {
  private readonly namespace = NAMESPACE;
  // undefined = not created yet; null = caching disabled (or running during `vite build`)
  private client: Redis | null | undefined;

  /**
   * Created on first use rather than at import: SvelteKit imports server modules while
   * analysing routes during `vite build`, where the Redis host is unreachable.
   */
  private get redis(): Redis | null {
    if (this.client === undefined) {
      this.client = building || !ENV.USE_REDIS_CACHE || !ENV.REDIS_URI ? null : this.connect(ENV.REDIS_URI);
    }
    return this.client;
  }

  private connect(uri: string): Redis {
    const redis = new Redis(uri, {
      commandTimeout: COMMAND_TIMEOUT_MS,
      connectTimeout: CONNECT_TIMEOUT_MS,
      // Don't hold queued commands across reconnect attempts; the default retryStrategy keeps
      // reconnecting (capped backoff), so caching resumes on its own when Redis is back.
      maxRetriesPerRequest: 1,
    });
    redis.on('error', (error) => console.error('[redis] connection error:', error.message));
    return redis;
  }

  private buildKey(prefix: string, key: string): string {
    return `${this.namespace}:${prefix}:${key}`;
  }

  /**
   * Runs a cache command, failing open: if Redis is down, slow, or errors, returns `fallback`
   * instead of throwing or waiting, so callers behave as on a cache miss.
   */
  private async failOpen<T>(label: string, fallback: T, operation: (redis: Redis) => Promise<T>): Promise<T> {
    const redis = this.redis;
    if (!redis || UNAVAILABLE_STATUSES.has(redis.status)) return fallback;
    try {
      return await operation(redis);
    } catch (error) {
      console.warn(`[redis] ${label} failed, skipping cache:`, error instanceof Error ? error.message : error);
      return fallback;
    }
  }

  async get(data: { prefix: string; key: string }): Promise<string | null> {
    return this.failOpen('get', null, (redis) => redis.get(this.buildKey(data.prefix, data.key)));
  }

  async set(data: { prefix: string; key: string; value: string }): Promise<void> {
    await this.failOpen('set', undefined, async (redis) => {
      await redis.set(this.buildKey(data.prefix, data.key), data.value);
    });
  }

  async delete(data: { prefix: string; key: string }): Promise<void> {
    await this.failOpen('del', undefined, async (redis) => {
      await redis.del(this.buildKey(data.prefix, data.key));
    });
  }

  async setWithExpiry(data: { prefix: string; key: string; value: string; expiry: number }): Promise<void> {
    await this.failOpen('setex', undefined, async (redis) => {
      await redis.set(this.buildKey(data.prefix, data.key), data.value, 'EX', Math.floor(data.expiry));
    });
  }

  async scan(data: { prefix: string; pattern: string }): Promise<string[]> {
    return this.failOpen('scan', [], async (redis) => {
      const keys: string[] = [];
      const scanPattern = `${this.namespace}:${data.prefix}:${data.pattern}`;
      let cursor = '0';

      do {
        const result = await redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);
        cursor = result[0];
        const foundKeys = result[1];

        // Remove the namespace and prefix from the keys to return just the key part
        const cleanKeys = foundKeys.map((key) => key.replace(`${this.namespace}:${data.prefix}:`, ''));
        keys.push(...cleanKeys);
      } while (cursor !== '0');

      return keys;
    });
  }

  async ttl(data: { prefix: string; key: string }): Promise<number> {
    return this.failOpen('ttl', 0, (redis) => redis.ttl(this.buildKey(data.prefix, data.key)));
  }
}

export const redisService = new RedisService();

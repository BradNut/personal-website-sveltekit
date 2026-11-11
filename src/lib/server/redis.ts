import { Redis } from 'ioredis';
import { ENV } from 'varlock/env';
import { building } from '$app/environment';

const NAMESPACE = 'personal-website';

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
    const redis = new Redis(uri);
    redis.on('error', (error) => console.error('[redis] connection error:', error.message));
    return redis;
  }

  private buildKey(prefix: string, key: string): string {
    return `${this.namespace}:${prefix}:${key}`;
  }

  async get(data: { prefix: string; key: string }): Promise<string | null> {
    if (!this.redis) return null;
    return this.redis.get(this.buildKey(data.prefix, data.key));
  }

  async set(data: { prefix: string; key: string; value: string }): Promise<void> {
    if (!this.redis) return;
    await this.redis.set(this.buildKey(data.prefix, data.key), data.value);
  }

  async delete(data: { prefix: string; key: string }): Promise<void> {
    if (!this.redis) return;
    await this.redis.del(this.buildKey(data.prefix, data.key));
  }

  async setWithExpiry(data: { prefix: string; key: string; value: string; expiry: number }): Promise<void> {
    if (!this.redis) return;
    await this.redis.set(this.buildKey(data.prefix, data.key), data.value, 'EX', Math.floor(data.expiry));
  }

  async scan(data: { prefix: string; pattern: string }): Promise<string[]> {
    const redis = this.redis;
    if (!redis) return [];

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
  }

  async ttl(data: { prefix: string; key: string }): Promise<number> {
    if (!this.redis) return 0;
    return this.redis.ttl(this.buildKey(data.prefix, data.key));
  }
}

export const redisService = new RedisService();

import { Redis } from 'ioredis';
import { REDIS_URI, USE_REDIS_CACHE } from '$env/static/private';

const NAMESPACE = 'personal-website';

export const REDIS_PREFIXES = {
  ARTICLES: 'articles',
  BANDCAMP_ALBUMS: 'bandcampAlbums',
  PAGE_CACHE: 'pageCache',
} as const;

class RedisService {
  public redis: Redis | null;
  private namespace: string;

  constructor() {
    this.redis = USE_REDIS_CACHE === 'true' && REDIS_URI ? new Redis(REDIS_URI) : null;
    this.namespace = NAMESPACE;
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
    if (!this.redis) return [];
    
    const keys: string[] = [];
    const scanPattern = `${this.namespace}:${data.prefix}:${data.pattern}`;
    let cursor = '0';

    do {
      const result = await this.redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);
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

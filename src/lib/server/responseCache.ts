import { redisService } from '$lib/server/redis';

export const RESPONSE_CACHE_TTL_SECONDS = 43200;

export type CachedJsonHit<T> = {
  hit: true;
  value: T;
  cacheControl: string;
};

export type CachedJsonMiss = {
  hit: false;
  cacheControl: string;
};

export type CachedJsonResult<T> = CachedJsonHit<T> | CachedJsonMiss;

export type CachedJsonOptions = {
  enabled: boolean;
  prefix: string;
  key: string;
  fallbackTtl?: number;
};

export type WriteCachedJsonOptions<T> = {
  enabled: boolean;
  prefix: string;
  key: string;
  value: T;
  ttl: number;
};

export async function readCachedJson<T>(options: CachedJsonOptions): Promise<CachedJsonResult<T>> {
  const fallbackCacheControl = `max-age=${options.fallbackTtl ?? 0}`;
  if (!options.enabled) {
    return {
      hit: false,
      cacheControl: fallbackCacheControl,
    };
  }

  let cached: string | null;
  try {
    cached = await redisService.get({ prefix: options.prefix, key: options.key });
  } catch {
    return {
      hit: false,
      cacheControl: fallbackCacheControl,
    };
  }

  if (!cached) {
    return {
      hit: false,
      cacheControl: fallbackCacheControl,
    };
  }

  const ttl = await redisService.ttl({ prefix: options.prefix, key: options.key });
  const cacheControl = ttl > 0 ? `max-age=${ttl}` : fallbackCacheControl;

  return {
    hit: true,
    value: JSON.parse(cached as string) as T,
    cacheControl,
  };
}

export async function writeCachedJson<T>(options: WriteCachedJsonOptions<T>): Promise<void> {
  if (!options.enabled) return;
  await redisService.setWithExpiry({
    prefix: options.prefix,
    key: options.key,
    value: JSON.stringify(options.value),
    expiry: options.ttl,
  });
}

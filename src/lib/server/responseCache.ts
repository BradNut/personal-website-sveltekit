import { REDIS_PREFIXES, redisService } from '$lib/server/redis';

export const RESPONSE_CACHE_TTL_SECONDS = 43200;

const RESPONSE_CACHES = {
  favoriteArticles: {
    prefix: REDIS_PREFIXES.ARTICLES,
    ttl: RESPONSE_CACHE_TTL_SECONDS,
  },
  currentlyListening: {
    prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS,
    ttl: RESPONSE_CACHE_TTL_SECONDS,
  },
} as const;

type ResponseCacheName = keyof typeof RESPONSE_CACHES;

type ResponseCacheTarget = { cacheName: ResponseCacheName; prefix?: never } | { cacheName?: never; prefix: string };

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

export type CachedJsonOptions = ResponseCacheTarget & {
  enabled: boolean;
  key: string;
  fallbackTtl?: number;
};

export type WriteCachedJsonOptions<T> = ResponseCacheTarget & {
  enabled: boolean;
  key: string;
  value: T;
  ttl?: number;
};

function resolveCachePolicy(options: ResponseCacheTarget): { prefix: string; ttl: number } {
  if (options.cacheName) {
    return RESPONSE_CACHES[options.cacheName];
  }

  return {
    prefix: options.prefix,
    ttl: RESPONSE_CACHE_TTL_SECONDS,
  };
}

export async function readCachedJson<T>(options: CachedJsonOptions): Promise<CachedJsonResult<T>> {
  const policy = resolveCachePolicy(options);
  const fallbackCacheControl = `max-age=${options.fallbackTtl ?? policy.ttl}`;
  if (!options.enabled) {
    return {
      hit: false,
      cacheControl: fallbackCacheControl,
    };
  }

  let cached: string | null;
  try {
    cached = await redisService.get({ prefix: policy.prefix, key: options.key });
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

  const ttl = await redisService.ttl({ prefix: policy.prefix, key: options.key });
  const cacheControl = ttl > 0 ? `max-age=${ttl}` : fallbackCacheControl;

  return {
    hit: true,
    value: JSON.parse(cached as string) as T,
    cacheControl,
  };
}

export async function writeCachedJson<T>(options: WriteCachedJsonOptions<T>): Promise<void> {
  if (!options.enabled) return;
  const policy = resolveCachePolicy(options);
  await redisService.setWithExpiry({
    prefix: policy.prefix,
    key: options.key,
    value: JSON.stringify(options.value),
    expiry: options.ttl ?? policy.ttl,
  });
}

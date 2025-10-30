import { error, json, type RequestEvent } from '@sveltejs/kit';
import scrapeIt, { type ScrapeResult } from 'scrape-it';
import { BANDCAMP_USERNAME, USE_REDIS_CACHE } from '$env/static/private';
import { apiRateLimiter } from '$lib/server/rateLimiter';
import { REDIS_PREFIXES, redisService } from '$lib/server/redis';
import type { Album, BandCampResults } from '$lib/types/album';

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 500): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (attempt === maxRetries) break;
      const delay = baseDelay * 2 ** attempt; // 500ms, 1s, 2s
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}

export async function GET(event: RequestEvent) {
  // Check rate limit
  if (await apiRateLimiter.isLimited(event)) {
    error(429, 'Too many requests. Please try again later.');
  }

  const { setHeaders } = event;

  try {
    if (USE_REDIS_CACHE === 'true') {
      const cached: string | null = await redisService.get({ prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS, key: 'albums' });

      if (cached) {
        const response: Album[] = JSON.parse(cached);
        const ttl = await redisService.ttl({ prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS, key: 'albums' });
        if (ttl) {
          setHeaders({
            'cache-control': `max-age=${ttl}`,
          });
        } else {
          setHeaders({
            'cache-control': 'max-age=43200',
          });
        }
        return json(response);
      }
    }

    // Scrape Bandcamp with realistic headers, plus retry/backoff
    const { data }: ScrapeResult<BandCampResults> = await retryWithBackoff(
      async () =>
        await scrapeIt(`https://bandcamp.com/${BANDCAMP_USERNAME}`, {
          collectionItems: {
            listItem: '.collection-item-container',
            data: {
              url: { selector: '.collection-title-details > a.item-link', attr: 'href' },
              artwork: { selector: 'div.collection-item-art-container a img', attr: 'src' },
              title: { selector: 'span.item-link-alt > div.collection-item-title' },
              artist: { selector: 'span.item-link-alt > div.collection-item-artist' },
            },
          },
        }),
    );

    const albums: Album[] = data?.collectionItems || [];
    if (albums && albums.length > 0) {
      if (USE_REDIS_CACHE === 'true') {
        await redisService.setWithExpiry({ prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS, key: 'albums', value: JSON.stringify(albums), expiry: 43200 });
      }
      setHeaders({ 'cache-control': 'max-age=43200' });
      return json(albums);
    }
    return json([]);
  } catch (error) {
    console.error(error);
    return json([]);
  }
}

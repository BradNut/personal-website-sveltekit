import { json, type RequestEvent } from '@sveltejs/kit';
import scrapeIt, { type ScrapeResult } from 'scrape-it';
import { ENV } from 'varlock/env';
import { REDIS_PREFIXES } from '$lib/server/redis';
import { RESPONSE_CACHE_TTL_SECONDS, readCachedJson, writeCachedJson } from '$lib/server/responseCache';
import type { Album, BandCampResults } from '$lib/types/album';
import { retryWithBackoff } from '$lib/util/retry';

export async function GET(event: RequestEvent) {
  const { setHeaders } = event;

  try {
    const cached = await readCachedJson<Album[]>({
      enabled: ENV.USE_REDIS_CACHE === true,
      prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS,
      key: 'albums',
      fallbackTtl: RESPONSE_CACHE_TTL_SECONDS,
    });

    if (cached.hit) {
      setHeaders({
        'cache-control': cached.cacheControl,
      });
      return json(cached.value);
    }

    // Scrape Bandcamp with realistic headers, plus retry/backoff
    const { data }: ScrapeResult<BandCampResults> = await retryWithBackoff(
      async () =>
        await scrapeIt(`https://bandcamp.com/${ENV.BANDCAMP_USERNAME}`, {
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
      await writeCachedJson({ enabled: ENV.USE_REDIS_CACHE === true, prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS, key: 'albums', value: albums, ttl: RESPONSE_CACHE_TTL_SECONDS });
      setHeaders({ 'cache-control': `max-age=${RESPONSE_CACHE_TTL_SECONDS}` });
      return json(albums);
    }
    return json([]);
  } catch (error) {
    console.error(error);
    return json([]);
  }
}

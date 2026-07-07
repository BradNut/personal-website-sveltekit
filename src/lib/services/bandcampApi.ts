import scrapeIt, { type ScrapeResult } from 'scrape-it';
import { ENV } from 'varlock/env';
import { REDIS_PREFIXES, redisService } from '$lib/server/redis';
import type { Album, BandCampResults } from '$lib/types/album';
import { retryWithBackoff } from '$lib/util/retry';

const CACHE_KEY = 'albums';
const CACHE_TTL_SECONDS = 43200; // 12 hours
const FALLBACK_CACHE_CONTROL = `max-age=${CACHE_TTL_SECONDS}`;

export type AlbumsResult = {
  albums: Album[];
  cacheControl: string;
};

async function getCachedAlbums(): Promise<AlbumsResult | null> {
  if (!ENV.USE_REDIS_CACHE) return null;

  const cached = await redisService.get({ prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS, key: CACHE_KEY });
  if (!cached) return null;

  const albums: Album[] = JSON.parse(cached);
  const ttl = await redisService.ttl({ prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS, key: CACHE_KEY });
  return { albums, cacheControl: ttl ? `max-age=${ttl}` : FALLBACK_CACHE_CONTROL };
}

async function scrapeAlbums(): Promise<Album[]> {
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

  return data?.collectionItems || [];
}

export async function fetchAlbums(): Promise<AlbumsResult> {
  try {
    const cached = await getCachedAlbums();
    if (cached) return cached;

    const albums = await scrapeAlbums();

    if (albums.length === 0) {
      return { albums: [], cacheControl: 'no-cache' };
    }

    if (ENV.USE_REDIS_CACHE) {
      await redisService.setWithExpiry({
        prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS,
        key: CACHE_KEY,
        value: JSON.stringify(albums),
        expiry: CACHE_TTL_SECONDS,
      });
    }

    return { albums, cacheControl: FALLBACK_CACHE_CONTROL };
  } catch (error) {
    console.error(error);
    return { albums: [], cacheControl: 'no-cache' };
  }
}

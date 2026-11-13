import scrapeIt, { type ScrapeResult } from 'scrape-it';
import { ENV } from 'varlock/env';
import { NO_CACHE } from '#lib/constants/cache-control.ts';
import { REDIS_PREFIXES } from '#lib/server/redis.ts';
import { createResponseCache } from '#lib/server/responseCache.ts';
import type { Album, BandCampResults } from '#lib/types/album.ts';
import { retryWithBackoff } from '#lib/util/retry.ts';

const CACHE_KEY = 'albums';
const albumsCache = createResponseCache<Album[]>({ prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS, ttlSeconds: 43200 }); // 12 hours

export type AlbumsResult = {
  albums: Album[];
  cacheControl: string;
};

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
    const cached = await albumsCache.read(CACHE_KEY);
    if (cached) return { albums: cached.value, cacheControl: cached.cacheControl };

    const albums = await scrapeAlbums();

    if (albums.length === 0) {
      return { albums: [], cacheControl: NO_CACHE };
    }

    await albumsCache.write(CACHE_KEY, albums);

    return { albums, cacheControl: albumsCache.freshCacheControl };
  } catch (error) {
    console.error(error);
    return { albums: [], cacheControl: NO_CACHE };
  }
}

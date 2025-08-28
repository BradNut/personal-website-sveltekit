import type { ScrapeResult } from 'scrape-it';
import scrapeIt from 'scrape-it';
import { BANDCAMP_USERNAME, USE_REDIS_CACHE } from '$env/static/private';
import { redis } from '$lib/server/redis';
import type { Album, BandCampResults } from '../types/album';

export async function fetchBandcampAlbums(): Promise<Album[] & { cacheControl?: string }> {
  try {
    if (USE_REDIS_CACHE === 'true') {
      const cached: string | null = await redis.get('bandcampAlbums');

      if (cached) {
        const response: Album[] = JSON.parse(cached);
        console.log('Cache hit!');
        const ttl = await redis.ttl('bandcampAlbums');

        // Preserve array shape; attach cacheControl as a non-enumerable property.
        if (typeof ttl === 'number' && ttl > 0) {
          Object.defineProperty(response, 'cacheControl', {
            value: `max-age=${ttl}`,
            enumerable: false,
          });
        }
        return response as Album[] & { cacheControl?: string };
      }
    }

    const { data }: ScrapeResult<BandCampResults> = await scrapeIt(`https://bandcamp.com/${BANDCAMP_USERNAME}`, {
      collectionItems: {
        listItem: '.collection-item-container',
        data: {
          url: {
            selector: '.collection-title-details > a.item-link',
            attr: 'href',
          },
          artwork: {
            selector: 'div.collection-item-art-container a img',
            attr: 'src',
          },
          title: {
            selector: 'span.item-link-alt > div.collection-item-title',
          },
          artist: {
            selector: 'span.item-link-alt > div.collection-item-artist',
          },
        },
      },
    });

    const albums: Album[] = data?.collectionItems || [];

    if (albums && albums?.length > 0) {
      if (USE_REDIS_CACHE === 'true') {
        // Store in Redis for 12 hours.
        redis.set('bandcampAlbums', JSON.stringify(albums), 'EX', 43200);
        // Reflect the cache TTL on the returned array as a hint to clients.
        Object.defineProperty(albums, 'cacheControl', {
          value: 'max-age=43200',
          enumerable: false,
        });
      }
      return albums as Album[] & { cacheControl?: string };
    }
    return [] as Album[] & { cacheControl?: string };
  } catch (error) {
    console.error(error);
    return [] as Album[] & { cacheControl?: string };
  }
}

import { json, error } from '@sveltejs/kit';
import { BANDCAMP_USERNAME, USE_REDIS_CACHE } from '$env/static/private';
import { redis } from '$lib/server/redis';
import type { Album, BandCampResults } from '$lib/types/album';
import scrapeIt, { type ScrapeResult } from 'scrape-it';

export async function GET({ setHeaders, url }) {
  try {
    if (USE_REDIS_CACHE === 'true') {
      const cached: string | null = await redis.get('bandcampAlbums');

      if (cached) {
				const response: Album[] = JSON.parse(cached);
				const ttl = await redis.ttl("bandcampAlbums");
        if (ttl) {
          setHeaders({
            "cache-control": `max-age=${ttl}`,
          });
        } else {
          setHeaders({
            "cache-control": "max-age=43200",
          });
        }
        return json(response);
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
        redis.set('bandcampAlbums', JSON.stringify(albums), 'EX', 43200);
      }
      setHeaders({
        "cache-control": "max-age=43200",
      });
      return json(albums);
    }
		return json([]);
  } catch (error) {
    console.error(error);
    return json([]);
  }
}

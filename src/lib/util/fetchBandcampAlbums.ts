import { BANDCAMP_USERNAME, USE_REDIS_CACHE } from '$env/static/private';
import scrapeIt from 'scrape-it';
import type { ScrapeResult } from 'scrape-it';
import { redis } from '$lib/server/redis';
import type { Album, BandCampResults } from '../types/album';

export async function fetchBandcampAlbums() {
	try {
		if (USE_REDIS_CACHE) {
			const cached: string | null = await redis.get('bandcampAlbums');

			if (cached) {
				const response: Album[] = JSON.parse(cached);
				console.log(`Cache hit!`);
				const ttl = await redis.ttl('bandcampAlbums');

				return response;
			}
		}

		const { data }: ScrapeResult<BandCampResults> = await scrapeIt(
			`https://bandcamp.com/${BANDCAMP_USERNAME}`,
			{
				collectionItems: {
					listItem: '.collection-item-container',
					data: {
						url: {
							selector: '.collection-title-details > a.item-link',
							attr: 'href'
						},
						artwork: {
							selector: 'div.collection-item-art-container a img',
							attr: 'src'
						},
						title: {
							selector: 'span.item-link-alt > div.collection-item-title'
						},
						artist: {
							selector: 'span.item-link-alt > div.collection-item-artist'
						}
					}
				}
			}
		);

		const albums: Album[] = data?.collectionItems || [];

		if (albums && albums?.length > 0) {
			if (USE_REDIS_CACHE) {
				redis.set('bandcampAlbums', JSON.stringify(albums), 'EX', 43200);
			}
			return albums;
		} else {
			return [];
		}
	} catch (error) {
		console.error(error);
	}
}

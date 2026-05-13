import scrapeIt, { type ScrapeResult } from 'scrape-it';
import { ENV } from 'varlock/env';
import { REDIS_PREFIXES, redisService } from '$lib/server/redis';
import type { Album, BandCampResults } from '$lib/types/album';
import { retryWithBackoff } from '$lib/util/retry';

const BANDCAMP_ALBUMS_CACHE_KEY = 'albums';
const BANDCAMP_ALBUMS_CACHE_MAX_AGE = 43200;

export type CurrentlyListeningAlbumsResult = {
	albums: Album[];
	cacheMaxAge: number | null;
};

export async function getCurrentlyListeningAlbums(): Promise<CurrentlyListeningAlbumsResult> {
	try {
		const cached = await getCachedAlbums();
		if (cached) return cached;

		const albums = await scrapeCurrentlyListeningAlbums();
		if (albums.length === 0) return { albums: [], cacheMaxAge: null };

		await cacheAlbums(albums);
		return { albums, cacheMaxAge: BANDCAMP_ALBUMS_CACHE_MAX_AGE };
	} catch (error) {
		console.error(error);
		return { albums: [], cacheMaxAge: null };
	}
}

async function getCachedAlbums(): Promise<CurrentlyListeningAlbumsResult | null> {
	if (!ENV.USE_REDIS_CACHE) return null;

	const cached = await redisService.get({ prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS, key: BANDCAMP_ALBUMS_CACHE_KEY });
	if (!cached) return null;

	const albums: Album[] = JSON.parse(cached);
	const ttl = await redisService.ttl({ prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS, key: BANDCAMP_ALBUMS_CACHE_KEY });
	return { albums, cacheMaxAge: ttl || BANDCAMP_ALBUMS_CACHE_MAX_AGE };
}

async function scrapeCurrentlyListeningAlbums(): Promise<Album[]> {
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

	return data?.collectionItems || [];
}

async function cacheAlbums(albums: Album[]): Promise<void> {
	if (!ENV.USE_REDIS_CACHE) return;

	await redisService.setWithExpiry({
		prefix: REDIS_PREFIXES.BANDCAMP_ALBUMS,
		key: BANDCAMP_ALBUMS_CACHE_KEY,
		value: JSON.stringify(albums),
		expiry: BANDCAMP_ALBUMS_CACHE_MAX_AGE,
	});
}

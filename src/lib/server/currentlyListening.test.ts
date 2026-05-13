import { beforeEach, describe, expect, it, vi } from 'vitest';

const redisGetMock = vi.fn();
const redisTtlMock = vi.fn();
const redisSetWithExpiryMock = vi.fn();
const scrapeItMock = vi.fn();

vi.mock('$lib/server/redis', () => ({
	redisService: {
		get: (data: unknown) => redisGetMock(data),
		ttl: (data: unknown) => redisTtlMock(data),
		setWithExpiry: (data: unknown) => redisSetWithExpiryMock(data),
	},
	REDIS_PREFIXES: {
		ARTICLES: 'articles',
		BANDCAMP_ALBUMS: 'bandcampAlbums',
		PAGE_CACHE: 'pageCache',
	},
}));

vi.mock('scrape-it', () => ({ default: (...args: unknown[]) => scrapeItMock(...args) }));

vi.mock('$lib/util/retry', () => ({
	retryWithBackoff: (fn: () => Promise<unknown>) => fn(),
}));

import { getCurrentlyListeningAlbums } from './currentlyListening';

const makeAlbum = () => ({
	url: 'https://bandcamp.com/album/123',
	artwork: 'https://img.bandcamp.com/art.jpg',
	title: 'Test Album',
	artist: 'Test Artist',
});

beforeEach(() => {
	vi.resetAllMocks();
});

describe('getCurrentlyListeningAlbums', () => {
	it('returns cached albums with TTL cache metadata', async () => {
		const cached = [makeAlbum()];
		redisGetMock.mockResolvedValueOnce(JSON.stringify(cached));
		redisTtlMock.mockResolvedValueOnce(3600);

		const result = await getCurrentlyListeningAlbums();

		expect(result).toEqual({ albums: cached, cacheMaxAge: 3600 });
		expect(redisGetMock).toHaveBeenCalledWith({ prefix: 'bandcampAlbums', key: 'albums' });
		expect(redisTtlMock).toHaveBeenCalledWith({ prefix: 'bandcampAlbums', key: 'albums' });
		expect(scrapeItMock).not.toHaveBeenCalled();
	});

	it('returns cached albums with fallback cache metadata when TTL is unavailable', async () => {
		const cached = [makeAlbum()];
		redisGetMock.mockResolvedValueOnce(JSON.stringify(cached));
		redisTtlMock.mockResolvedValueOnce(0);

		const result = await getCurrentlyListeningAlbums();

		expect(result).toEqual({ albums: cached, cacheMaxAge: 43200 });
		expect(scrapeItMock).not.toHaveBeenCalled();
	});

	it('scrapes, caches, and returns albums with default cache metadata on cache miss', async () => {
		const scraped = [makeAlbum()];
		redisGetMock.mockResolvedValueOnce(null);
		scrapeItMock.mockResolvedValueOnce({ data: { collectionItems: scraped } });

		const result = await getCurrentlyListeningAlbums();

		expect(result).toEqual({ albums: scraped, cacheMaxAge: 43200 });
		expect(scrapeItMock).toHaveBeenCalledWith('https://bandcamp.com/test-user', expect.any(Object));
		expect(redisSetWithExpiryMock).toHaveBeenCalledWith({
			prefix: 'bandcampAlbums',
			key: 'albums',
			value: JSON.stringify(scraped),
			expiry: 43200,
		});
	});

	it('returns empty albums without cache metadata when scrape returns no items', async () => {
		redisGetMock.mockResolvedValueOnce(null);
		scrapeItMock.mockResolvedValueOnce({ data: { collectionItems: [] } });

		const result = await getCurrentlyListeningAlbums();

		expect(result).toEqual({ albums: [], cacheMaxAge: null });
		expect(redisSetWithExpiryMock).not.toHaveBeenCalled();
	});

	it('returns empty albums without cache metadata when scrape fails', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		redisGetMock.mockResolvedValueOnce(null);
		scrapeItMock.mockRejectedValueOnce(new Error('scrape failed'));

		const result = await getCurrentlyListeningAlbums();

		expect(result).toEqual({ albums: [], cacheMaxAge: null });
		expect(redisSetWithExpiryMock).not.toHaveBeenCalled();
	});
});

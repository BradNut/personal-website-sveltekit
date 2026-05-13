import { beforeEach, describe, expect, it, vi } from 'vitest';

const getCurrentlyListeningAlbumsMock = vi.fn();

vi.mock('$lib/server/currentlyListening', () => ({
	getCurrentlyListeningAlbums: () => getCurrentlyListeningAlbumsMock(),
}));

import { GET } from './+server.js';

const makeAlbum = () => ({
	url: 'https://bandcamp.com/album/123',
	artwork: 'https://img.bandcamp.com/art.jpg',
	title: 'Test Album',
	artist: 'Test Artist',
});

function makeRequestEvent() {
	const capturedHeaders: Record<string, string> = {};
	const event = {
		setHeaders: (h: Record<string, string>) => Object.assign(capturedHeaders, h),
	} as unknown as Parameters<typeof GET>[0];
	return { event, capturedHeaders };
}

beforeEach(() => {
	vi.resetAllMocks();
});

describe('GET /api/bandcamp/albums', () => {
	it('returns albums and applies cache metadata from the Currently Listening module', async () => {
		const albums = [makeAlbum()];
		getCurrentlyListeningAlbumsMock.mockResolvedValueOnce({ albums, cacheMaxAge: 3600 });

		const { event, capturedHeaders } = makeRequestEvent();
		const response = await GET(event);
		const body = await response.json();

		expect(body).toEqual(albums);
		expect(capturedHeaders['cache-control']).toBe('max-age=3600');
	});

	it('returns albums without cache-control when the module has no cache metadata', async () => {
		getCurrentlyListeningAlbumsMock.mockResolvedValueOnce({ albums: [], cacheMaxAge: null });

		const { event, capturedHeaders } = makeRequestEvent();
		const response = await GET(event);
		const body = await response.json();

		expect(body).toEqual([]);
		expect(capturedHeaders).toEqual({});
	});
});

import { describe, it, expect } from 'vitest';
import { fetchBandcampAlbums } from './fetchBandcampAlbums';

describe('test fetchBandcampAlbums', () => {
	it('fetches bandcamp albums', async () => {
		const albums = await fetchBandcampAlbums();
		console.log('albums');
		expect(albums).not.toBeNull();
		expect(albums).toBeTruthy();
		expect(albums?.length).toBeGreaterThan(0);
		for (const album of albums) {
			expect(album?.artist).toHaveLength;
			expect(album?.artwork).toHaveLength;
			expect(album?.src).toHaveLength;
			expect(album?.title).toHaveLength;
			expect(album?.url).toHaveLength;
		}
	});
});

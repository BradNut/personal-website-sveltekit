import { json, type RequestEvent } from '@sveltejs/kit';
import { getCurrentlyListeningAlbums } from '$lib/server/currentlyListening';

export async function GET(event: RequestEvent) {
	const { setHeaders } = event;
	const { albums, cacheMaxAge } = await getCurrentlyListeningAlbums();

	if (cacheMaxAge !== null) {
		setHeaders({ 'cache-control': `max-age=${cacheMaxAge}` });
	}

	return json(albums);
}

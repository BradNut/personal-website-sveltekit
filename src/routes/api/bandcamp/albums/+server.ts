import { json, type RequestEvent } from '@sveltejs/kit';
import { fetchAlbums } from '$lib/services/bandcampApi';

export async function GET(event: RequestEvent) {
  const { setHeaders } = event;

  const { albums, cacheControl } = await fetchAlbums();
  setHeaders({ 'cache-control': cacheControl });
  return json(albums);
}

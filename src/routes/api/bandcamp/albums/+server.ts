import type { RequestEvent } from '@sveltejs/kit';
import { fetchAlbums } from '#lib/services/bandcamp-api.ts';

export async function GET(event: RequestEvent) {
  const { setHeaders } = event;

  const { albums, cacheControl } = await fetchAlbums();
  setHeaders({ 'cache-control': cacheControl });
  return Response.json(albums);
}

import type { RequestEvent } from '@sveltejs/kit';
import { fetchAlbums } from '#lib/services/bandcampApi.ts';

export async function GET(event: RequestEvent) {
  const { setHeaders } = event;

  const { albums, cacheControl } = await fetchAlbums();
  setHeaders({ 'cache-control': cacheControl });
  return Response.json(albums);
}

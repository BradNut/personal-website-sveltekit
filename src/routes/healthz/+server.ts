import type { RequestHandler } from './$types';

// Liveness probe for the Coolify/Docker healthcheck.
// Must not touch Wallabag, Bandcamp, or Redis so a slow upstream can't fail a deploy.
export const GET: RequestHandler = () => new Response('ok', { headers: { 'content-type': 'text/plain', 'cache-control': 'no-store' } });

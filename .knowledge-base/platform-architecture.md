# Platform Architecture

## Data Flow

```
Browser
  └─ SvelteKit SSR (+page.server.ts load)
       ├─ /api/bandcamp/albums  → scrape-it → bandcamp.com → Redis cache
       └─ /api/articles         → Wallabag API (wallabag.it) → Redis cache
```

Home `load` fires both in parallel via `Promise.all`.

## Server/Client Boundaries

- `src/lib/server/` — server-only: `redis.ts`, `rateLimiter.ts`
- `src/lib/api.ts` + `src/lib/services/articlesApi.ts` — server-only. `articlesApi.ts` is maintained; `api.ts` may be dead.
- `src/routes/api/` — server-only API routes
- Rest of `src/lib/` — client or universal

## Caching

Redis key pattern: `personal-website:<prefix>:<key>`

| Prefix | Key | TTL |
|---|---|---|
| `articles` | URLSearchParams string | 43200s (12h) |
| `bandcampAlbums` | `albums` | 43200s (12h) |
| `pageCache` | (reserved) | — |

`USE_REDIS_CACHE` toggles cache. Always `true` in prod.

## OG Images

`/og?header=...&page=...&content=...` → satori SVG → resvg PNG. Used in `<meta og:image>` on all pages.

## Rate Limiting

`sveltekit-rate-limiter`, Redis-backed. `src/lib/server/rateLimiter.ts`.

## Storybook

Stories in `.storybook/`. `pnpm storybook` → port 6006. Chromatic for visual regression.

## Deployment

Coolify + Nixpacks. `pnpm build` → `node build/index.js`. Port 3000. See [deployment runbook](./runbooks/deployment.md).

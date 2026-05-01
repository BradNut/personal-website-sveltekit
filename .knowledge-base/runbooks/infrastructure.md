# Infrastructure Troubleshooting

## Redis

### Symptoms
- Articles/albums not loading (cache miss + upstream also failing)
- `ECONNREFUSED` or `EHOSTUNREACH` in logs

### Diagnosis
```bash
redis-cli -u $REDIS_URI ping
# Expect: PONG
```

### Fixes
| Problem | Fix |
|---|---|
| Wrong `REDIS_URI` | Update in Coolify env → redeploy |
| Redis container down | Restart Redis in Coolify |
| Network mismatch | Put app and Redis on same Coolify network |
| Disable for debugging | `USE_REDIS_CACHE=false` in env |

Redis key pattern: `personal-website:<prefix>:<key>`. TTL 43200s (12h) for all caches.

---

## Wallabag (Articles)

### Symptoms
- `/api/articles` returns empty `[]` or errors
- "Favorite Articles" section blank on home page

### Diagnosis
```bash
# Test auth
curl -X POST https://app.wallabag.it/oauth/v2/token \
  -d "grant_type=password&client_id=...&client_secret=...&username=...&password=..."
# Expect: JSON with access_token
```

### Fixes
| Problem | Fix |
|---|---|
| Expired/wrong credentials | Rotate in wallabag.it settings → update Coolify env |
| `WALLABAG_URL` missing trailing path | Must be base URL only e.g. `https://app.wallabag.it` |
| Articles have no `programming` tag | Tag articles in Wallabag with `programming` tag |
| Wallabag.it down | Check https://app.wallabag.it — service outage |

Articles filtered by `programming` tag in `src/lib/types/articleTag.ts`.

---

## Bandcamp Scraping

### Symptoms
- "Currently Listening" section blank on home page
- `/api/bandcamp/albums` returns `[]`

### Diagnosis
```bash
curl https://bradleyshellnut.com/api/bandcamp/albums
# Expect: JSON array of albums
```

Check `BANDCAMP_USERNAME` is correct (no `@`, just username).

### Fixes
| Problem | Fix |
|---|---|
| Wrong `BANDCAMP_USERNAME` | Verify exact Bandcamp profile URL slug |
| Bandcamp HTML changed | Scrape selectors in `+server.ts` may need updating — inspect `bandcamp.com/<username>` |
| Rate limited by Bandcamp | Response cached 12h — rarely an issue |

Scrape selectors: `src/routes/api/bandcamp/albums/+server.ts`.

---

## Sentry

### Symptoms
- Errors not appearing in Sentry dashboard

### Fixes
- Verify `PUBLIC_SENTRY_URL` (browser) and `SENTRY_BACKEND_URL` (server) both set
- Verify `SENTRY_AUTH_TOKEN` set for source map uploads during build

## Related

- [Environment Configuration](./environment-config.md)
- [Deployment](./deployment.md)

---

## Redis Service

`src/lib/server/redis.ts`. Import: `import { redisService, REDIS_PREFIXES } from '$lib/server/redis'`.

Key pattern: `personal-website:<prefix>:<key>`. Namespace isolates from other projects on shared Redis.

### Prefixes

```typescript
REDIS_PREFIXES.ARTICLES        // articles — query param strings, TTL 12h
REDIS_PREFIXES.BANDCAMP_ALBUMS // bandcampAlbums — key 'albums', TTL 12h
REDIS_PREFIXES.PAGE_CACHE      // pageCache — reserved, not yet used
```

### API

```typescript
await redisService.get({ prefix, key })               // → string | null
await redisService.set({ prefix, key, value })
await redisService.setWithExpiry({ prefix, key, value, expiry }) // expiry in seconds
await redisService.delete({ prefix, key })
await redisService.ttl({ prefix, key })               // → remaining seconds
await redisService.scan({ prefix, pattern })          // → string[] (keys without prefix)
```

Graceful degradation: all ops no-op if `USE_REDIS_CACHE !== 'true'` or Redis is unreachable.

---

## Rate Limiting

`src/lib/server/rateLimiter.ts`. In-memory (no Redis). Resets on server restart.

**Protected**: `/api/articles`, `/api/bandcamp/albums`

**Limits**: 30 req/min per IP+UA → 100 req/hr per IP. First limit hit wins.

Returns `429 { "message": "Too many requests. Please try again later." }`.

### Custom limiter

```typescript
import { createRateLimiter } from '$lib/server/rateLimiter';
const limiter = createRateLimiter({ IPUA: [10, 'm'], IP: [50, 'h'] });
```

### Test locally

```bash
for i in {1..35}; do curl -s http://localhost:5173/api/articles?page=1 > /dev/null; echo $i; done
# Request 31+ should return 429
```

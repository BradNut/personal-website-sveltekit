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
curl https://production-url.com/api/bandcamp/albums
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

### Reportable Error Policy & Backup Crawler Filtering

App-owned policy (primary layer, enforced in code):
- `src/lib/shared/reportableError.ts` — `isReportableError()`. Only 5xx (or an error object carrying a 5xx `status`) is reportable. All intentional 4xx (Route Misses, rate limits, validation, etc.) are Expected HTTP Errors and are never sent to Bugsink. Consumed symmetrically by `src/hooks.server.ts` and `src/hooks.client.ts`.
- `src/lib/server/probeRequest.ts` — `isProbeRequest()`. Curated denylist (WordPress, sensitive files, CGI, root-level PHP) for known high-signal scanner paths. Matches are short-circuited in `handleProbeRequest` (`src/hooks.server.ts`, first in the `sequence(...)` chain) with a plain generic 404 — no route resolution, no Sentry, no production log. Expand the denylist as new scanner patterns show up in access logs.

Backup layer (Bugsink/Sentry inbound filters): **not available on this stack.** This site runs self-hosted [Bugsink](https://bugsink.com), which is Sentry-SDK-compatible for ingestion but does not implement Sentry SaaS's "Inbound Data Filters" project setting (the `web-crawlers` / `browser-extensions` / `legacy-browser` toggles are implemented in Sentry's closed-source Relay service and have no Bugsink equivalent as of this writing). So there is no dashboard toggle to enable here — the app-owned policy above is the only enforcement layer. If Bugsink adds inbound filtering in the future, revisit this section and enable it as a genuine second layer.

In the meantime, the manual backup is Bugsink's own issue tooling: mute or resolve noisy issues per-project in the Bugsink UI (Issue → Mute/Resolve). This doesn't prevent ingestion, but keeps them out of the active triage view. Prefer adding the underlying path to `PROBE_DENYLIST_*` in `probeRequest.ts` over muting recurring scanner noise by hand.

### Verifying suppressed vs. reportable behavior

```bash
# Known Probe Request path -> plain generic 404, no Bugsink event
curl -i https://production-url.com/wp-login.php
# Expect: HTTP/1.1 404, body "Not Found", no corresponding issue in Bugsink

# Ordinary Route Miss -> normal site 404 page, no Bugsink event
curl -i https://production-url.com/some-typo-page
# Expect: HTTP/1.1 404 with the site's styled not-found page, no corresponding issue in Bugsink

# Genuine unexpected failure -> still reported
# (trigger a real 5xx, e.g. a temporarily broken upstream integration)
# Expect: an issue appears in Bugsink with request/status context and the response includes an errorId
```

If a suppressed path unexpectedly shows up as a Bugsink issue, check `isProbeRequest`/`isReportableError` first before assuming a backup filter is misconfigured — there isn't one to misconfigure.

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

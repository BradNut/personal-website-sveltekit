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

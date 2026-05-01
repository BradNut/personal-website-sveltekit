# Environment Configuration

Reference: `.env.example`

## Required

| Variable | Example | Notes |
|---|---|---|
| `ORIGIN` | `https://bradleyshellnut.com` | SvelteKit CSRF/cookie origin. Must match public URL. |
| `PUBLIC_SITE_URL` | `https://bradleyshellnut.com` | Used in OG image URLs and meta tags. |
| `PUBLIC_SITE_VERSION` | `1.0.0` | App version shown in UI/logs. |
| `WALLABAG_URL` | `https://app.wallabag.it` | Wallabag instance base URL. |
| `WALLABAG_CLIENT_ID` | `<id>` | Wallabag OAuth client ID. |
| `WALLABAG_CLIENT_SECRET` | `<secret>` | Wallabag OAuth client secret. |
| `WALLABAG_USERNAME` | `<user>` | Wallabag account username. |
| `WALLABAG_PASSWORD` | `<pass>` | Wallabag account password. |
| `BANDCAMP_USERNAME` | `<username>` | Bandcamp profile username for scraping. |
| `REDIS_URI` | `redis://redis:6379` | Redis connection URI. |
| `USE_REDIS_CACHE` | `true` | Enable Redis caching. Always `true` in prod. |
| `PAGE_SIZE` | `6` | Default articles per page. |

## Optional

| Variable | Notes |
|---|---|
| `PUBLIC_SENTRY_URL` | Sentry DSN for browser error tracking. |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for source map uploads. |
| `SENTRY_BACKEND_URL` | Sentry DSN for server-side error tracking. |
| `PUBLIC_UMAMI_URL` | Umami analytics endpoint. |
| `PUBLIC_UMAMI_ID` | Umami website ID. |
| `PUBLIC_UMAMI_DO_NOT_TRACK` | Set `true` to disable tracking in dev. |
| `WALLABAG_MAX_ARTICLES` | Max articles per Wallabag request. Default `30`. |
| `WALLABAG_MAX_PAGES` | Max pages to fetch from Wallabag. Default `5`. |
| `ENVIRONMENT` | `development` or `production`. |

## Local Dev Setup

```bash
cp .env.example .env
# Fill in WALLABAG_*, BANDCAMP_USERNAME, REDIS_URI
# Set USE_REDIS_CACHE=false to skip Redis locally
pnpm dev
```

## Related

- [Deployment](./deployment.md)
- [Infrastructure](./infrastructure.md)

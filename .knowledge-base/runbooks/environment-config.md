# Environment Configuration

Reference: `.env.example`

## Required

| Variable | Example | Notes |
|---|---|---|
| `ORIGIN` | `https://production-url.com` | SvelteKit CSRF/cookie origin. Must match public URL. |
| `PUBLIC_SITE_URL` | `https://production-url.com` | Used in OG image URLs and meta tags. |
| `PUBLIC_SITE_VERSION` | `1.0.0` | App version shown in UI/logs. |
| `WALLABAG_URL` | `<wallabag-url>` | Wallabag instance base URL. |
| `WALLABAG_CLIENT_ID` | `<id>` | Wallabag OAuth client ID. |
| `WALLABAG_CLIENT_SECRET` | `<secret>` | Wallabag OAuth client secret. |
| `WALLABAG_USERNAME` | `<user>` | Wallabag account username. |
| `WALLABAG_PASSWORD` | `<pass>` | Wallabag account password. |
| `BANDCAMP_USERNAME` | `<username>` | Bandcamp profile username for scraping. |
| `REDIS_URI` | `<redis-uri>` | Redis connection URI. |
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
| `ENVIRONMENT` | `development`, `staging`, `production`, or `test`. Controls which `.env.[env]` file varlock loads. |

## Local Dev Setup

```bash
cp .env.example .env
# Fill in WALLABAG_*, BANDCAMP_USERNAME, REDIS_URI
# Set USE_REDIS_CACHE=false to skip Redis locally
pnpm dev
```

## Unit Testing

`pnpm test:unit` automatically sets `ENVIRONMENT=test`, which causes varlock to load `.env.test`.

`.env.test` must exist and contain **fake/safe values** — never real secrets. Required keys:

```
ENVIRONMENT=test
WALLABAG_URL=https://wallabag.test
WALLABAG_CLIENT_ID=test-client-id
WALLABAG_CLIENT_SECRET=test-client-secret
WALLABAG_USERNAME=test-user
WALLABAG_PASSWORD=test-password
REDIS_URI=redis://test-host:6379
USE_REDIS_CACHE=true
PAGE_SIZE=10
```

Test mocks use `vi.mock('varlock/env', ...)` (not `$env/static/private`) since `ENV` is resolved at runtime by varlock, not replaced at build time.

## Related

- [Deployment](./deployment.md)
- [Infrastructure](./infrastructure.md)

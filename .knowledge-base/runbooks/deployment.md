# Deployment

## Method

Coolify + Nixpacks. Push to `main` → Coolify auto-builds → replaces container.

## Build

```bash
pnpm install --frozen-lockfile
pnpm build   # vite build → outputs to build/
```

Start: `node build/index.js` (adapter-node).

## Required Env Before Deploy

`ORIGIN`, `PUBLIC_SITE_URL`, `WALLABAG_*`, `REDIS_URI`, `USE_REDIS_CACHE=true`.

Full list: [environment-config.md](./environment-config.md).

## Post-Deploy Check

```bash
curl -I https://production-url.com/
# Expect: 200

curl https://production-url.com/api/bandcamp/albums
# Expect: JSON array

curl https://production-url.com/api/articles?page=1&limit=3
# Expect: JSON with articles array
```

## Rollback

Coolify → deployment history → redeploy last successful.

## Related

- [Environment Configuration](./environment-config.md)
- [Build Troubleshooting](./build-troubleshooting.md)

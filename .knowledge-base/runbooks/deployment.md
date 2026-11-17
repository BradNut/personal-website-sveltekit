# Deployment

## Method

Coolify (4.x) + Railpack, configured by `railpack.json` (Node 24, start command `pnpm start`). Push to `master` → Coolify auto-builds → replaces container.

## Build

```bash
pnpm install --frozen-lockfile
pnpm build   # vite build → outputs to build/
```

Start: `pnpm start`, which runs `varlock run -- node build/index.js` (adapter-node), so varlock validates the env before the server starts.

## Required Env Before Deploy

`ORIGIN`, `PUBLIC_SITE_URL`, `WALLABAG_*`, `REDIS_URI`, `USE_REDIS_CACHE=true`.

Full list: [environment-config.md](./environment-config.md).

## Request Origin

adapter-node builds every request URL (`url.origin`, `url.protocol`) and SvelteKit's CSRF origin check from, in order:

1. `paths.origin` in the SvelteKit config (not set here);
2. the `ORIGIN` env var, read at runtime, so changing it needs a restart, not a rebuild;
3. otherwise the request headers: `PROTOCOL_HEADER` / `HOST_HEADER` if set, else the `Host` header with the scheme **assumed `https`**.

Set `ORIGIN=https://bradleyshellnut.com` as a runtime env var on the Coolify app, so the origin doesn't depend on what the proxy forwards. Security headers that depend on the scheme (HSTS) rely on this being right.

- **Local `node build` / `pnpm start` over plain HTTP:** set `ORIGIN=http://localhost:3000` (or your port). Without it the server assumes `https` and every URL it builds is wrong.
- **`pnpm dev` / `pnpm preview`:** Vite serves these, not adapter-node, so `ORIGIN` has no effect.
- **Never set `ORIGIN` to an empty string.** adapter-node refuses to start on an invalid `ORIGIN`. Leaving it unset is fine: varlock doesn't pass an unset variable to the server, and it rejects a non-URL value before the server starts.

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

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

`ORIGIN` (optional in `.env.schema` so dev can omit it, but set it in production), `PUBLIC_SITE_URL`, `WALLABAG_*`, `REDIS_URI`, `USE_REDIS_CACHE=true`.

Full list: [environment-config.md](./environment-config.md).

## Request Origin

adapter-node builds every request URL (`url.origin`, `url.protocol`) and SvelteKit's CSRF origin check from, in order:

1. `paths.origin` in the `sveltekit()` options in `vite.config.ts` (not set);
2. the `ORIGIN` env var, read at runtime, so changing it needs a restart, not a rebuild;
3. otherwise the request headers: `PROTOCOL_HEADER` / `HOST_HEADER` if set, else the `Host` header with the scheme **assumed `https`**.

Set `ORIGIN=https://bradleyshellnut.com` as a runtime env var on the Coolify app, so the origin doesn't depend on what the proxy forwards.

- **Local `node build` / `pnpm start` over plain HTTP:** set `ORIGIN=http://localhost:3000` (or your port). Without it the server assumes `https` and every URL it builds is wrong.
- **`pnpm dev` / `pnpm preview`:** Vite serves these, not adapter-node, so `ORIGIN` has no effect.
- **Never set `ORIGIN` to an empty string**, e.g. a blank Coolify variable. varlock passes `""` through unchecked and adapter-node then crashes at startup with `Invalid ORIGIN: ''`. Leaving it unset is fine: varlock doesn't pass an unset variable on. A non-empty value that isn't a URL is rejected by varlock before the server starts.

## Post-Deploy Check

```bash
curl -I https://bradleyshellnut.com/
# Expect: 200

curl https://bradleyshellnut.com/api/bandcamp/albums
# Expect: JSON array

curl https://bradleyshellnut.com/api/articles?page=1&limit=3
# Expect: JSON with articles array
```

## Rollback

Coolify → deployment history → redeploy last successful.

## Related

- [Environment Configuration](./environment-config.md)
- [Build Troubleshooting](./build-troubleshooting.md)

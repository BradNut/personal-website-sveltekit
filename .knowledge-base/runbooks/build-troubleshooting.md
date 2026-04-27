# Build Troubleshooting

## OOM During Build

`sharp` and `@resvg/resvg-js` have native deps. Build can OOM on low-RAM machines.

Fix: increase Coolify container memory limit or add swap before build.

```bash
NODE_OPTIONS=--max-old-space-size=2048 pnpm build
```

## Native Deps (sharp, resvg-js)

Nixpacks needs `libvips-dev` for sharp. If missing:

```
Error: Cannot find module './build/Release/sharp.node'
```

Add to Nixpacks apt packages or Dockerfile:

```
libvips-dev libvips-tools build-essential
```

## TypeScript Errors

Run locally first:

```bash
pnpm check
```

Common issues:
- Missing `$env/static/private` vars at typecheck time → ensure `.env` populated
- `svelte-kit sync` not run → `pnpm check` runs it automatically

## Vite Build Fails on Image Imports

`vite-imagetools` or `@sveltejs/enhanced-img` failures. Check image paths are relative and files exist.

## Local Build Verify

```bash
pnpm build && node build/index.js
curl -I http://localhost:3000/
```

## Related

- [Deployment](./deployment.md)
- [Environment Configuration](./environment-config.md)

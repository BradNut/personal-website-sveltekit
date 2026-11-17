# Build Troubleshooting

## OOM During Build

`sharp` and `@resvg/resvg-js` have native deps. Build can OOM on low-RAM machines.

Fix: increase Coolify container memory limit or add swap before build.

```bash
NODE_OPTIONS=--max-old-space-size=2048 pnpm build
```

## Native Deps (sharp, resvg-js)

sharp (transitive, via `vite-imagetools`) and `@resvg/resvg-js` ship prebuilt platform binaries as optional dependencies (`@img/sharp-*`, `@resvg/resvg-js-*`). No system libvips is needed. If the platform binary is missing:

```
Error: Could not load the "sharp" module using the linux-x64 runtime
```

Make sure the install didn't skip optional dependencies (`pnpm install --frozen-lockfile`, no `--no-optional`).

## TypeScript Errors

Run locally first:

```bash
pnpm check
```

Common issues:
- Env errors → env is loaded by varlock from `.env.schema` + `.env`; ensure `.env` is populated
- `svelte-kit sync` not run → `pnpm check` runs it automatically

## Vite Build Fails on Image Imports

`vite-imagetools` or `@sveltejs/enhanced-img` failures. Check image paths are relative and files exist.

## Local Build Verify

```bash
pnpm build && pnpm start   # varlock run -- node build/index.js
curl -I http://localhost:3000/
```

## Related

- [Deployment](./deployment.md)
- [Environment Configuration](./environment-config.md)

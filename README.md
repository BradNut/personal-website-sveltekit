# Personal Website

Rewriting my personal website, originally in Gatsby, using SvelteKit.

This is a work in progress to get the site on par with my old one and eventually update with ever newer things!

## Developing

Requires Node 24+ and pnpm. Env comes through varlock (`.env.schema`); see the [environment runbook](.knowledge-base/runbooks/environment-config.md).

```bash
pnpm install
pnpm dev
```

## Checks

```bash
pnpm lint              # Biome
pnpm check             # svelte-check
pnpm test:unit         # Vitest
pnpm test:integration  # Playwright
```

## Building

```bash
pnpm build
pnpm start   # varlock run -- node build/index.js (adapter-node)
```

Deployed with Coolify + Railpack. See the [deployment runbook](.knowledge-base/runbooks/deployment.md).

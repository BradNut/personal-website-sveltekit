# Agent Guide

Personal website. SvelteKit 3, Svelte 5, TypeScript strict, Bits UI. Styling: PostCSS global styles + scoped component `<style>`.

## Commands

- Use `pnpm` only.
- `pnpm dev`: Vite dev server (`--inspect --host`).
- `pnpm check`: `svelte-kit sync` + `svelte-check` (loads env through varlock).
- `pnpm lint`: `biome check .`, the same check CI runs. `pnpm format` formats in place.
- `pnpm test:unit`: Vitest. `pnpm test:integration`: Playwright. `pnpm test:scripts`: repo guard scripts.
- `pnpm check:pinned-refs`: GitHub Actions and images are pinned to digests.

Git hooks in `.githooks/` (enabled by `pnpm install`): `commit-msg` enforces Conventional Commits, `pre-commit` runs the env-file guard, `varlock scan`, Biome and the pinned-refs guard on staged files, and `pre-push` runs `pnpm check`.

## Where to Look

Locate code with CodeGraph (`codegraph_explore`) first when the repo is indexed, then read only what you need:

- **Unfamiliar with app**: [overview](.knowledge-base/overview.md) then [architecture](.knowledge-base/platform-architecture.md)
- **Svelte/component/style work**: [core principles](.knowledge-base/core-principles.md), [Svelte](docs/agents/svelte.md), or the Svelte MCP
- **Routes/loading/boundaries**: [SvelteKit](docs/agents/sveltekit.md)
- **Naming/TypeScript**: [TypeScript](docs/agents/typescript.md)
- **Tests**: [testing](docs/agents/testing.md)
- **Ops/deployment/env**: [runbooks](.knowledge-base/runbooks/index.md)
- **All docs**: [KB index](.knowledge-base/index.md)

## Non-Negotiable Rules

- **Svelte 5 runes only**: no legacy reactivity (`export let`, `$:`).
- **Constants first**: reuse `src/lib/constants/**` and `src/lib/shared/**` before adding literals.
- **Boundaries**: server-only code (`src/lib/server/**`, `src/lib/services/**`) and secrets stay out of client bundles.
- **Const objects**: `as const` objects instead of TypeScript enums.
- **Suppressions**: `@ts-ignore`, `eslint-disable`, `biome-ignore` and `svelte-ignore` need approval.
- **Root causes**: minimal upstream fixes over workarounds.
- **Tests**: happy paths plus negative/edge cases.
- **Lazy infra**: external connections (Redis) open on first use, never at import.
- **Naming**: kebab-case files; PascalCase for component, type and interface symbols ([TypeScript](docs/agents/typescript.md#naming)).

## Agent Skills

- **Issue tracker**: GitHub Issues for `BradNut/personal-website-sveltekit` via `gh` ([guide](docs/agents/issue-tracker.md)). `.issues/` is legacy.
- **Triage labels**: [vocabulary](docs/agents/triage-labels.md).
- **Domain docs**: `GLOSSARY.md`, `CONTEXT.md` and `docs/adr/` ([guide](docs/agents/domain.md)).

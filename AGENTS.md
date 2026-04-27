# AGENTS

Personal website. SvelteKit 2, Svelte 5, TypeScript strict, Tailwind v4, Bits UI.

## Essentials

- Package manager: `pnpm`
- Dev: `pnpm dev` (Vite `--inspect --host`)
- Typecheck: `pnpm check` (`svelte-kit sync` + `svelte-check`)
- Test unit: `pnpm test:unit` (Vitest)
- Test e2e: `pnpm test:integration` (Playwright)

## Read Only What You Need

- **Unfamiliar with app**: [overview](.knowledge-base/overview.md) then [architecture](.knowledge-base/platform-architecture.md)
- **Svelte/component work**: [core principles](.knowledge-base/core-principles.md) or Svelte MCP
- **Ops/deployment/env**: [runbooks](.knowledge-base/runbooks/index.md)
- **All docs**: [KB index](.knowledge-base/index.md)

## Non-Negotiable Rules

- Svelte 5 runes only. No legacy reactivity.
- No `svelte-ignore`, `@ts-ignore`, `eslint-disable` without explicit approval.
- Never import server-only modules into client bundles.
- Never expose secrets to client.

# TypeScript conventions

Use these rules for TypeScript across the project.

## General

- Use TypeScript for application code.
- Prefer `interface` for object shapes.
- Avoid enums; use `as const` objects.
- Keep strict typing and avoid `any` unless justified.

## Naming

- **Files**: kebab-case (`external-link.svelte`, `response-cache.ts`). SvelteKit route files (`+page.svelte`, `+server.ts`) keep their framework names.
- **Tests**: `{name}.test.ts` next to the source; stories: `{name}.stories.svelte`.
- **Components, classes, interfaces, type aliases**: PascalCase (`ExternalLink`, `RedisService`, `ArticleTag`).
- **Functions and variables**: camelCase (`isProbeRequest`, `redisService`).
- **Constants**: UPPER_SNAKE_CASE (`REDIS_PREFIXES`, `COMMAND_TIMEOUT_MS`).

## Imports

Import app code through the `#lib` subpath import (`package.json` `imports`) with the real file extension: `#lib/server/redis.ts`, `#lib/components/external-link.svelte`. Use `./` for siblings.

## Shared values

- Put client-safe shared constants in `src/lib/constants/**` or `src/lib/shared/**`.
- Keep server-only constants/config in server-only modules.

# Testing expectations

Use these rules for test work.

## Test commands

- Unit tests: `pnpm test:unit` (Vitest, `ENVIRONMENT=test` so varlock loads `.env.test`)
- Integration tests: `pnpm test:integration` (Playwright)
- Repo guard scripts: `pnpm test:scripts` (`node --test`)

## File layout

- Unit tests sit next to the source as `{name}.test.ts` (Vitest includes `src/**/*.{test,spec}.{js,ts}`).
- Route tests sit in the route folder without the `+` (`page.server.test.ts`, `server.test.ts`).
- Playwright specs live in `tests/`; shared helpers in `tests/helpers/`.
- Redis-backed code is tested against `src/lib/server/testing/fake-ioredis.ts`, never a real Redis.

## Coverage expectations

- Include happy-path and negative-path tests.
- Cover validation failures, not-found behavior, permission failures, and dependency failures where relevant.
- Keep tests deterministic and isolated.

## Scope

- Services: cover public methods.
- Routes/handlers: cover success and failure responses.
- Components: cover key user interactions and edge states.

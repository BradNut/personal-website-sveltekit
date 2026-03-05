# Testing expectations

Use these rules for test work.

## Test commands

- Unit tests: `pnpm test:unit` (Vitest)
- Integration tests: `pnpm test:integration` (Playwright)

## Coverage expectations

- Include happy-path and negative-path tests.
- Cover validation failures, not-found behavior, permission failures, and dependency failures where relevant.
- Keep tests deterministic and isolated.

## Scope

- Services: cover public methods.
- Routes/handlers: cover success and failure responses.
- Components: cover key user interactions and edge states.

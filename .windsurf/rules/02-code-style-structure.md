---
trigger: always_on
---

# Code Style and Structure

## General Guidelines

- Write concise, technical TypeScript or JavaScript code with accurate examples
- Use functional and declarative programming patterns; avoid unnecessary classes except for state machines
- Prefer iteration and modularization over code duplication
- Structure files: component logic, markup, styles, helpers, types
- Follow Svelte's official documentation for setup and configuration: https://svelte.dev/docs

## Shared and Server Boundaries

- Place reusable constants/const objects/shared domain values in client-safe shared modules (for example `src/lib/shared/**`).
- Before introducing new literals (strings/numbers/flags), first reuse existing constants/types/const objects from shared domain modules; add new constants only when no existing domain value fits.
- Keep server-only constants/configuration in server-only modules (`src/lib/server/**`, `+page.server.ts`, `+layout.server.ts`, `+server.ts`, hooks/server utilities).
- Never import server-only code into Svelte pages/components or other client-bundled modules.
- Never expose secrets, private env vars, credentials, or server-only implementation details to Svelte pages; return only sanitized/public values via server `load` or API responses.

## Drizzle Migration Discipline

- Never hand-write, manually create, or manually edit migration SQL in `drizzle/*.sql`.
- Never hand-create or hand-edit Drizzle metadata/journal files in `drizzle/meta/**` (including `_journal.json` and snapshots).
- Always generate and apply migrations via Drizzle tooling (`drizzle-kit generate` and migration commands) so SQL and meta files stay aligned.

## File Organization

Organize your SvelteKit project with clear separation of concerns:

```
src/
├── lib/
│   ├── components/
│   ├── utils/
│   └── types/
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── api/
└── app.html
```

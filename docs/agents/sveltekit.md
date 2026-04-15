# SvelteKit conventions

Use these rules for routing, data loading, and server/client boundaries.

## Routing and loading

- Follow file-based routing in `src/routes`.
- Use `+page.server.ts` / `+layout.server.ts` for server-only logic.
- Use universal `load` only when data is needed on both server and client.

## Server/client boundaries

- Keep secrets and private env vars in server-only modules.
- Never import server-only code into client-bundled modules.
- Return only sanitized public data to pages/components.

## Rendering

- Prefer SSR/SSG defaults.
- Use prerendering when a route is static.
- Keep client JavaScript minimal.

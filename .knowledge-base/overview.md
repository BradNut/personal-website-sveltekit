# App Overview

Personal website. SvelteKit 2, Svelte 5, TypeScript strict, Tailwind v4, Bits UI. Node adapter. Coolify + Nixpacks. Vitest + Playwright + Storybook. Biome.

## Pages

| Route | Description |
|---|---|
| `/` | Home — currently listening albums + favorite articles preview |
| `/about` | Bio, tech stack, courses |
| `/articles` | Paginated articles list from Wallabag |
| `/articles/[page]` | Paginated articles page |
| `/portfolio` | Projects showcase |
| `/uses` | Hardware, dev tools, privacy tools |
| `/privacy` | Privacy policy |
| `/og` | OG image generation endpoint (satori + resvg) |
| `/sitemap.xml` | Auto-generated sitemap |

## API Routes

| Route | Description |
|---|---|
| `/api/articles` | Fetches articles from Wallabag with Redis cache |
| `/api/bandcamp/albums` | Scrapes Bandcamp collection with Redis cache |

## External Services

- **Wallabag** (wallabag.it) — reads tagged articles for the Favorite Articles section
- **Bandcamp** — scrapes user collection for Currently Listening section
- **Redis** — caching layer for Wallabag + Bandcamp responses (always on in prod)
- **Sentry** — error tracking (browser + node)
- **Umami** — privacy-friendly analytics

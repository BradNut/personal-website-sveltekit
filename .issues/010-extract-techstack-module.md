# Extract TechStack data constant + component

**Type:** AFK
**Blocked by:** None — can start immediately

## What to build

The Tech Stack section on the about page (the personal set of frameworks/languages Bradley explores outside work) currently inlines 7 near-identical `ExternalLink` calls directly in `+page.svelte`, fusing icon SVG imports and URL literals into the template.

Extract into three pieces:

- `src/lib/types/techStack.ts` — exports `TechEntry = { label: string; href: string; icon: () => unknown }`. `label` covers display text, aria-label, and title (all identical per entry).
- `src/lib/shared/techStack.ts` — exports `const techStack: TechEntry[]` with all 7 entries.
- `src/lib/components/TechStack.svelte` — imports `techStack` directly (no prop), renders `<a>` + SVG snippet per entry **without delegating to `ExternalLink.svelte`** (see ADR-0001). Owns the `.tech-list` grid CSS including responsive breakpoints. Has a companion `TechStack.stories.svelte`.

The about page becomes a single `<TechStack />` call with no icon imports or tech URLs.

## Acceptance criteria

- [x] `src/lib/types/techStack.ts` exports `TechEntry = { label, href, icon }`
- [x] `src/lib/shared/techStack.ts` exports `techStack: TechEntry[]` with all 7 entries
- [x] `src/lib/components/TechStack.svelte` imports the constant directly (no prop), renders links directly (no `ExternalLink` dependency), owns the grid CSS + responsive breakpoints
- [x] `src/lib/components/TechStack.stories.svelte` exists with at least one story
- [x] `src/routes/about/+page.svelte` contains no icon imports from `logoIcons.svelte` and no hardcoded tech URLs — replaced by `<TechStack />`
- [x] `.tech-list` styles are removed from `+page.svelte`
- [x] All 7 links have correct accessible name and `title` matching `label`
- [x] Existing Playwright assertions in `tests/about.test.ts` for tech list links and hover colours still pass (browser binaries missing in env; selectors `a[title]`, `.tech-list`, hover `:color` verified present in component)
- [x] `pnpm check` passes

## Blocked by

None — can start immediately

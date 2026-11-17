# Core Principles

## Svelte 5 — Runes Only

```typescript
let count = $state(0);
let doubled = $derived(count * 2);
$effect(() => { /* side effect */ });
let { title, isActive = false }: Props = $props();
```

No `export let`, no `$:`, no legacy stores for component state.

## TypeScript

- Strict. Interfaces > types. Const objects > enums.
- Props typed via interface. Types in `src/lib/types/`. Consts in `src/lib/constants/`. Reuse before new literals.

## Component Structure

```svelte
<script lang="ts">
  // 1. Imports
  // 2. Props interface + $props()
  // 3. $state
  // 4. $derived
  // 5. $effect
  // 6. Functions
</script>
<!-- 7. Markup -->
<!-- 8. Scoped styles (if needed) -->
```

## Styling

No Tailwind or utility-class framework.

- Global styles: `.pcss` files in `src/styles/` (`reset`, `typeography`, `global`, `styles`; custom properties in `global.pcss`). Use the custom properties (`var(--textColor)`, `var(--linkHover)`, …) rather than hard-coded values.
- PostCSS (`postcss.config.cjs`): `postcss-import`, `postcss-preset-env` (stage 3, nesting, media-query ranges) and `postcss-custom-media`.
- Breakpoints: `postcss.config.cjs` defines custom media (`--below_med`, `--above_large`, …), but components currently use plain `@media (max-width: …)` queries.
- Component styles: scoped `<style lang="postcss">` (or plain `<style>`) blocks in the component.
- Bits UI for headless interactive components, styled with scoped styles.

## Accessibility

Semantic HTML. ARIA where needed. Keyboard nav. Alt text.

## Server/Client

- Secrets → `+page.server.ts`, `src/lib/server/**`, `+server.ts` only.
- Never expose private env vars to client.
- Universal `load` only when needed on both sides.

## Fix Root Causes

No `svelte-ignore`, `@ts-ignore`, `eslint-disable` without explicit approval.

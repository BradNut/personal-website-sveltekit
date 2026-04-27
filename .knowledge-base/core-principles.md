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

- Tailwind v4 utility classes.
- Bits UI for headless interactive components.
- `cn()` from `$lib/utils` for conditional class merging.
- Scoped `<style>` only when Tailwind insufficient.

## Accessibility

Semantic HTML. ARIA where needed. Keyboard nav. Alt text.

## Server/Client

- Secrets → `+page.server.ts`, `src/lib/server/**`, `+server.ts` only.
- Never expose private env vars to client.
- Universal `load` only when needed on both sides.

## Fix Root Causes

No `svelte-ignore`, `@ts-ignore`, `eslint-disable` without explicit approval.

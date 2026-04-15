# Svelte conventions

Use these rules for Svelte component tasks.

## Version and syntax

- Target Svelte 5.
- Prefer runes (`$state`, `$derived`, `$effect`, `$props`, `$bindable`) over legacy reactivity syntax.
- Keep component logic concise and colocated with the component unless it is reused.

## Component structure

- Keep scripts in TypeScript.
- Use descriptive prop names and explicit prop interfaces.
- Keep styles scoped unless intentionally global.

## UI behavior

- Prefer SSR-friendly patterns and minimal client-only logic.
- Use transitions/animations intentionally, not by default.
- Keep markup accessible (semantic elements, labels, alt text, keyboard support).

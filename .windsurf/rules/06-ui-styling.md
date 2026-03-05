---
trigger: always_on
---

# UI and Styling

## Tailwind CSS

- Use Tailwind CSS for utility-first styling approach
- Leverage Shadcn components for pre-built, customizable UI elements
- Import Shadcn components from `$lib/components/ui`
- Organize Tailwind classes using the `cn()` utility from `$lib/utils`
- Use Svelte's built-in transition and animation features

## Shadcn Integration

```svelte
<script>
  import { Button } from '$lib/components/ui/button';
  import { cn } from '$lib/utils';
</script>

<Button class={cn('w-full', isActive && 'bg-primary')}>
  Click me
</Button>
```

## Svelte Transitions

```svelte
<script>
  import { fade, slide } from 'svelte/transition';
</script>

{#if visible}
  <div transition:fade={{ duration: 300 }}>
    Content with fade transition
  </div>
{/if}
```

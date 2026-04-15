---
trigger: always_on
---

# Performance Optimization

## Svelte Optimizations

- Leverage Svelte's compile-time optimizations
- Use `{#key}` blocks to force re-rendering of components when needed
- Implement code splitting using dynamic imports for large applications
- Profile and monitor performance using browser developer tools
- Use `$effect.tracking()` to optimize effect dependencies
- Minimize use of client-side JavaScript; leverage SvelteKit's SSR and SSG
- Implement proper lazy loading for images and other assets

## Key Blocks for Re-rendering

```svelte
<script>
  let user = $state({ id: 1, name: 'John' });
</script>

<!-- Force re-render when user.id changes -->
{#key user.id}
  <UserProfile {user} />
{/key}
```

## Code Splitting

```typescript
// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent.svelte'));

// Dynamic imports in load functions
export async function load() {
  const module = await import('./heavy-utils.js');
  return { data: module.processData() };
}
```

## Effect Optimization

```typescript
$effect(() => {
  // Only re-run when specific dependencies change
  const tracking = $effect.tracking();
  if (tracking.has(user.id)) {
    console.log('User ID changed');
  }
});
```

## Image Optimization

```svelte
<script>
  import { browser } from '$app/environment';
</script>

{#if browser}
  <img 
    src="/images/hero.jpg" 
    alt="Hero image"
    loading="lazy"
    decoding="async"
  />
{/if}
```

## Bundle Analysis

```bash
# Analyze bundle size
pnpm build
pnpm analyze
```

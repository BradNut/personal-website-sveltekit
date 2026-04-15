---
trigger: always_on
---

# Server-Side Rendering (SSR) and Static Site Generation (SSG)

## SSR Capabilities

- Leverage SvelteKit's SSR capabilities for dynamic content
- Implement SSG for static pages using prerender option
- Use the adapter-auto for automatic deployment configuration

## Prerendering

```typescript
// src/routes/about/+page.ts
export const prerender = true; // Static generation

// src/routes/blog/+page.ts
export const prerender = 'auto'; // Prerender if possible, SSR otherwise
```

## Load Function Types

```typescript
// Server-side only
export async function load({ params, request, url }) {
  // Access to server-side APIs
  const data = await fetch('https://api.example.com/data');
  return { data: await data.json() };
}

// Universal (runs on both server and client)
export const load = async ({ fetch, params }) => {
  const response = await fetch(`/api/posts/${params.slug}`);
  return { post: await response.json() };
};
```

## Adapter Configuration

```typescript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';

export default {
  kit: {
    adapter: adapter()
  }
};
```

## Environment Variables

```typescript
// Access in load functions
export async function load({ platform }) {
  const apiKey = platform?.env?.API_KEY;
  // Use API key for server-side requests
}
```

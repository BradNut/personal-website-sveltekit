---
trigger: always_on
---

# Routing and Pages

## File-Based Routing

- Utilize SvelteKit's file-based routing system in the `src/routes/` directory
- Implement dynamic routes using `[slug]` syntax
- Use load functions for server-side data fetching and pre-rendering
- Implement proper error handling with `+error.svelte` pages

## Route Structure

```
src/routes/
├── +layout.svelte          # Root layout
├── +page.svelte           # Home page
├── about/
│   └── +page.svelte       # About page
├── blog/
│   ├── +page.svelte       # Blog index
│   └── [slug]/
│       ├── +page.svelte   # Blog post
│       └── +page.server.ts # Server-side data loading
└── api/
    └── posts/
        └── +server.ts     # API endpoint
```

## Dynamic Routes

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
  export let data;
</script>

<h1>{data.post.title}</h1>
<p>{data.post.content}</p>
```

## Load Functions

```typescript
// src/routes/blog/[slug]/+page.server.ts
export async function load({ params }) {
  const post = await getPost(params.slug);
  
  if (!post) {
    throw error(404, 'Post not found');
  }
  
  return {
    post
  };
}
```

## Error Handling

```svelte
<!-- src/routes/+error.svelte -->
<script>
  import { page } from '$app/stores';
</script>

<h1>{$page.status}</h1>
<p>{$page.error.message}</p>
```

---
trigger: always_on
---

# Data Fetching and API Routes

## Load Functions

- Use load functions for server-side data fetching
- Implement proper error handling for data fetching
- Use universal load functions when data is needed on both server and client

## API Routes

```typescript
// src/routes/api/posts/+server.ts
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const posts = await getPosts();
  return json(posts);
}

export async function POST({ request }) {
  const data = await request.json();
  const post = await createPost(data);
  return json(post, { status: 201 });
}
```

## Data Loading Patterns

```typescript
// Server-side data loading
export async function load({ params, locals }) {
  try {
    const post = await locals.db.posts.findUnique({
      where: { slug: params.slug }
    });
    
    if (!post) {
      throw error(404, 'Post not found');
    }
    
    return { post };
  } catch (err) {
    throw error(500, 'Failed to load post');
  }
}
```

## Error Handling

```typescript
// src/routes/posts/+page.server.ts
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  try {
    const post = await getPost(params.slug);
    return { post };
  } catch (err) {
    if (err.status === 404) {
      throw error(404, 'Post not found');
    }
    throw error(500, 'Server error');
  }
}
```

## Form Actions

```typescript
// src/routes/contact/+page.server.ts
import { fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    
    if (!email) {
      return fail(400, { email, missing: true });
    }
    
    try {
      await sendEmail(email);
      return { success: true };
    } catch (err) {
      return fail(500, { email, error: 'Failed to send email' });
    }
  }
};
```

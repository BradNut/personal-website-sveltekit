---
trigger: always_on
---

# Naming Conventions

## File Naming

- Use lowercase with hyphens for component files (e.g., `components/auth-form.svelte`)
- Use PascalCase for component names in imports and usage
- Use camelCase for variables, functions, and props

## Examples

```typescript
// File: components/user-profile.svelte
// Component name: UserProfile
import UserProfile from '$lib/components/user-profile.svelte';

// Variables and functions
let userName = 'John';
const handleUserClick = () => {};

// Props interface
interface UserProps {
  userId: string;
  isActive: boolean;
}
```

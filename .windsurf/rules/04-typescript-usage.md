---
trigger: always_on
---

# TypeScript Usage

## TypeScript Guidelines

- Use TypeScript for all code; prefer interfaces over types
- Avoid enums; use const objects instead
- Use functional components with TypeScript interfaces for props
- Enable strict mode in TypeScript for better type safety
- Put enum-like const objects/constants in `src/lib/shared/**` when both server and frontend need them; keep server-only constants in server-only modules.

## Interface vs Type

```typescript
// ✅ Prefer interfaces
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Avoid types when interfaces work
type User = {
  id: string;
  name: string;
  email: string;
}
```

## Const Objects Instead of Enums

```typescript
// ✅ Use const objects
const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const;

// ❌ Avoid enums
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
```

## Component Props

```typescript
interface ComponentProps {
  title: string;
  isVisible?: boolean;
  onClose?: () => void;
}

let { title, isVisible = false, onClose } = $props<ComponentProps>();
```

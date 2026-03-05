---
trigger: always_on
---

# Svelte Runes

## State Management

### `$state`: Declare reactive state

```typescript
let count = $state(0);
let user = $state({ name: 'John', age: 30 });
```

### `$derived`: Compute derived values

```typescript
let doubled = $derived(count * 2);
let userDisplayName = $derived(`${user.name} (${user.age})`);
```

### `$effect`: Manage side effects and lifecycle

```typescript
$effect(() => {
  console.log(`Count is now ${count}`);
});

$effect(() => {
  // Cleanup function
  const timer = setInterval(() => {
    console.log('Timer tick');
  }, 1000);
  
  return () => clearInterval(timer);
});
```

## Component Props

### `$props`: Declare component props

```typescript
let { optionalProp = 42, requiredProp } = $props<{
  optionalProp?: number;
  requiredProp: string;
}>();
```

### `$bindable`: Create two-way bindable props

```typescript
let { bindableProp = $bindable() } = $props<{
  bindableProp: string;
}>();
```

## Debugging

### `$inspect`: Debug reactive state (development only)

```typescript
$inspect(count); // Logs count changes in development
$inspect(user, 'user'); // Custom label
```

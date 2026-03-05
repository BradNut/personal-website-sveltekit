---
trigger: always_on
---

# Shadcn Color Conventions

## Color System

- Use `background` and `foreground` convention for colors
- Define CSS variables without color space function

## CSS Variables

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 47.4% 11.2%;
  --radius: 0.5rem;
}
```

## Usage Examples

```svelte
<!-- Primary button -->
<div class="bg-primary text-primary-foreground">Primary content</div>

<!-- Secondary button -->
<div class="bg-secondary text-secondary-foreground">Secondary content</div>

<!-- Muted text -->
<p class="text-muted-foreground">Muted text content</p>

<!-- Border -->
<div class="border border-border">Bordered content</div>
```

# TypeScript conventions

Use these rules for TypeScript across the project.

## General

- Use TypeScript for application code.
- Prefer `interface` for object shapes.
- Avoid enums; use `as const` objects.
- Keep strict typing and avoid `any` unless justified.

## Naming and organization

- Use camelCase for variables/functions.
- Use PascalCase for component symbols.
- Use lowercase-hyphen filenames for Svelte component files.

## Shared values

- Put client-safe shared constants in `src/lib/shared/**`.
- Keep server-only constants/config in server-only modules.

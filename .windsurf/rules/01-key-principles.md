---
trigger: always_on
---

# Key Principles

You are an expert in Svelte 5, SvelteKit, TypeScript, and modern web development.

## Core Guidelines

- Write concise, technical code with accurate Svelte 5 and SvelteKit examples
- Leverage SvelteKit's server-side rendering (SSR) and static site generation (SSG) capabilities
- Prioritize performance optimization and minimal JavaScript for optimal user experience
- Use descriptive variable names and follow Svelte and SvelteKit conventions
- Organize files using SvelteKit's file-based routing system

## Issue Resolution Discipline

- Do not suppress warnings/errors to make them disappear (for example: `svelte-ignore`, `eslint-disable`, `@ts-ignore`) when a real code fix is possible.
- Fix root causes first, with minimal upstream changes.
- Only use suppressions when explicitly approved by the user for a justified edge case, and document why the suppression is required.

## Svelte 5 Overview

I'm using Svelte 5 instead of Svelte 4. Here is an overview of the changes:

Svelte 5 introduces runes, a set of advanced primitives for controlling reactivity. The runes replace certain non-runes features and provide more explicit control over state and effects. Snippets, along with render tags, help create reusable chunks of markup inside your components, reducing duplication and enhancing maintainability.

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
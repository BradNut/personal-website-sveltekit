# ADR-0001: TechStack renders icon-links directly instead of via ExternalLink

**Status:** Accepted  
**Date:** 2026-07-01

## Context

Every other icon link on the site (contact hub, course cards, social links) is rendered via `ExternalLink.svelte`, which accepts `iconData / linkData / textData` triples and handles text positioning, decoration, and tracking events.

The Tech Stack grid on the about page has a fixed, uniform layout: icon above, label below, `target="_blank"`, no underline, hover yellow. All 7 entries are identical in structure.

## Decision

`TechStack.svelte` renders `<a>` + SVG snippet directly, without delegating to `ExternalLink.svelte`.

## Reasoning

`ExternalLink`'s interface complexity is not justified for a fixed-layout grid. Routing through it would require constructing the full prop triple for each entry with no behavioural gain — the prop-mapping cost equals the implementation. Rendering directly keeps the component to ~10 lines of markup with no external dependency.

## Consequences

- If the Tech Stack grid ever needs general-purpose link features (tracking events, configurable text position), the render logic will need to be updated or migrated to use `ExternalLink`.
- New contributors should not assume `ExternalLink` is mandatory for all icon links — this component is a deliberate exception for uniform grids.

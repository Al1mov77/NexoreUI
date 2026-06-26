---
name: nexoreui-components
description: Guidelines for building and documenting NexoreUI components. Use when creating new components, editing existing ones, or building documentation pages.
---

# NexoreUI Components Skill

## Component Rules
- 100% TypeScript, no any
- forwardRef on all components
- JSDoc for every prop
- displayName on every component
- Export both named and types

## Props Pattern
- Always destructure custom props before spreading to DOM
- Use cva for variants
- Support className and ...props spread
- Provide sensible defaults

## Documentation Pattern
Every component page must have:
1. PropsEditor — live interactive playground
2. Code block with copy button and AI assistant
3. Props table with all props, types, defaults
4. 5+ usage examples with pagination

## File Structure
- Component: packages/ui/src/components/name.tsx
- Section: apps/docs/app/components/sections/NameSection.tsx
- Always export from packages/ui/src/index.ts

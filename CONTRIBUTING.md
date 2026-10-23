# Contributing to NexoreUI

Thank you for contributing to NexoreUI. This document provides setup instructions, engineering standards, and contribution workflows for our monorepo.

---

## Development Setup

### Prerequisites
- Node.js >= 18.18.0
- pnpm >= 9.0.0

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Al1mov77/NexoreUI.git
   cd NexoreUI
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the local development server:
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` to view the documentation and component playground.

4. Build all packages:
   ```bash
   pnpm build
   ```

---

## Monorepo Structure

- **`packages/ui`**: Core React component library published to npm as `nexoreui`.
- **`packages/cli`**: Scaffolding and registry installation tool published to npm as `nexoreui-cli`.
- **`apps/docs`**: Documentation platform, template showcase, and workspace console built on Next.js 15.

---

## Developing and Testing the CLI

1. Build the CLI package:
   ```bash
   pnpm --filter nexoreui-cli build
   ```

2. Run commands directly using Node:
   ```bash
   node packages/cli/dist/index.js list
   node packages/cli/dist/index.js add button
   node packages/cli/dist/index.js auth --status
   ```

3. Rebuild the UI package after CLI changes:
   ```bash
   pnpm --filter nexoreui build
   ```
   *Note: This automatically syncs the CLI binary to `packages/ui/bin/nexoreui.js`.*

---

## Engineering Standards & Quality Gates

NexoreUI maintains strict design and code quality requirements. Every contribution must pass these criteria:

### 1. Code Standards
- **Zero Comments in Production Code:** Comments, TODOs, and JSDoc blocks are reserved for documentation files (.md/.mdx), not production TypeScript files.
- **Strict TypeScript:** No `any`, no implicit types, and no unsafe casts. Use clear interfaces and `satisfies` constraints.
- **Tailwind Tokens:** Use semantic tokens only (`bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-muted-foreground`). Hardcoded hex colors, RGB literals, and arbitrary color utility classes are not allowed.

### 2. Design Integrity (Anti-Slop)
- No decorative gradient text, glowing buttons, or aurora background blobs.
- No pill badges above headings.
- No emojis in UI interfaces, commit messages, or comments.
- No fake telemetry metrics, fictitious partner logos, or fabricated testimonials.
- Every interactive element must provide visible `:focus-visible` outlines.

### 3. Motion Budget & Accessibility
- Always respect `prefers-reduced-motion` using Framer Motion's `useReducedMotion()`.
- When reduced motion is preferred, animations must be bypassed and content displayed immediately.
- Interactive states must be accessible via keyboard navigation.

### 4. Template Audit & Export Sync
When adding or updating templates:
1. Run the template audit script to verify anti-slop rules:
   ```bash
   node scripts/audit-template.js <path-to-template>
   ```
2. Sync the template export to the CLI registry:
   ```bash
   node scripts/sync-template-export.js <slug>
   ```
3. Verify that the CLI registry export is identical to the preview implementation.

---

## Commit Guidelines

We use Conventional Commits:

- `feat(scope): add new component or feature`
- `fix(scope): resolve an issue or regression`
- `refactor(scope): internal code refactoring without behavior change`
- `perf(scope): performance optimization`
- `docs(scope): documentation updates`
- `chore(scope): build, dependency, or version changes`

Scope examples: `cli`, `ui`, `docs`, `template`, `auth`, `theme`.

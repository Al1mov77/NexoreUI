# Contributing to NexoreUI 🌌

Thank you for your interest in contributing to NexoreUI! This guide will help you get started with our monorepo setup and contribution guidelines.

---

## 🛠️ Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Al1mov77/NexoreUI.git
   cd NexoreUI
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start development servers**:
   ```bash
   pnpm dev
   ```

4. **Build all packages**:
   ```bash
   pnpm build
   ```

---

## 📦 Monorepo Packages

- **`packages/ui`**: Core React component library built with TypeScript and `cva`.
- **`packages/cli`**: CLI tool (`nexoreui-cli`) for scaffolding projects, installing components, and adding production templates.
- **`packages/mcp-server`**: Model Context Protocol integration for AI assistants.
- **`apps/docs`**: Next.js 15 documentation website with interactive playground and templates showcase.

---

## 💻 CLI & NPM Development Workflow

### Testing the CLI Locally
You can develop and test `nexoreui-cli` commands locally:

1. **Build the CLI package**:
   ```bash
   cd packages/cli
   pnpm run build
   ```

2. **Link the CLI globally**:
   ```bash
   npm link
   # Now `nexoreui` or `create-nexore-app` will use your local build!
   nexoreui list
   ```

3. **Or run directly via Node**:
   ```bash
   node packages/cli/dist/index.js list
   node packages/cli/dist/index.js add button
   node packages/cli/dist/index.js add template-juris-vault
   ```

### Publishing the CLI to NPM
To release a new version of `nexoreui-cli` to the npm registry:

1. Bump the version in [`packages/cli/package.json`](file:///c:/Users/Umar/Desktop/NexoreUI/packages/cli/package.json):
   ```json
   "version": "1.7.0"
   ```
2. Build the production bundle:
   ```bash
   cd packages/cli
   npm run build
   ```
3. Verify the build bundle in `packages/cli/dist/index.js`.
4. Publish to npm:
   ```bash
   npm publish --access public
   ```

---

## 🧩 Adding New Templates to NexoreUI

NexoreUI templates provide production-ready application starters. To contribute a new template:

1. **Register Template Metadata**:
   Add the template item to `TEMPLATES` in [`apps/docs/app/data/templates.ts`](file:///c:/Users/Umar/Desktop/NexoreUI/apps/docs/app/data/templates.ts) with `id`, `slug`, `title`, `description`, `category`, `tags`, `cliCommand`, `features`, and a runnable `codeSnippet`.

2. **Build the Interactive Preview Component**:
   Create `apps/docs/app/components/templates/previews/{Name}Preview.tsx`:
   - Use `@container` on the root wrapper for responsive container queries.
   - Use CSS custom properties: `var(--template-bg)`, `var(--template-fg)`, `var(--template-surface)`, `var(--template-border)`, `var(--template-primary)`.
   - Ensure full fidelity in both **Light Mode** and **Dark Mode**.
   - Ensure zero horizontal overflow across 375px, 768px, and 1024px+ viewports.
   - Add interactive states (modals, sliders, buttons, filters) rather than static mockups.

3. **Register the Preview**:
   Import and register the preview in [`apps/docs/app/components/templates/TemplatePreviews.tsx`](file:///c:/Users/Umar/Desktop/NexoreUI/apps/docs/app/components/templates/TemplatePreviews.tsx).

4. **Register in CLI Registry**:
   - Create `packages/cli/src/registry/template-{name}.ts` with component dependencies and code content.
   - Export and register the template in [`packages/cli/src/registry/index.ts`](file:///c:/Users/Umar/Desktop/NexoreUI/packages/cli/src/registry/index.ts).

---

## 🎨 Theme Studio Guidelines

All components and templates must respect:
1. CSS Variables for theming (`--primary`, `--primary-foreground`, `--background`, `--card`, `--border`).
2. Configurable corner radius (`--radius`).
3. Both `:root` (Light Mode) and `.dark` (Dark Mode) support.
4. Tailwind CSS v4 `@theme` tokens.
5. Zero horizontal overflow on mobile viewports (375px+).

---

## 📄 Git Commit Conventions

We follow Conventional Commits:
- `feat(scope): ...`
- `fix(scope): ...`
- `docs(scope): ...`
- `refactor(scope): ...`
- `chore(scope): ...`

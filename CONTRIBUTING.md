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
- **`packages/cli`**: CLI tool for scaffolding projects and copying component files.
- **`packages/mcp-server`**: Model Context Protocol integration for AI assistants.
- **`apps/docs`**: Next.js 15 documentation website with interactive playground.

---

## 🎨 Theme Studio Guidelines

All components must respect:
1. CSS Variables for theming (`--primary`, `--primary-foreground`, `--background`, `--card`, `--border`).
2. Configurable corner radius (`--radius`).
3. Both `:root` and `.dark` mode support.
4. Tailwind CSS v4 `@theme` tokens.

---

## 📄 Git Commit Conventions

We follow Conventional Commits:
- `feat(scope): ...`
- `fix(scope): ...`
- `docs(scope): ...`
- `refactor(scope): ...`
- `chore(scope): ...`

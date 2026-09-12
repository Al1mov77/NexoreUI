# NexoreUI

<p align="center">
  <strong>Modern, animated, production-ready React components with Tailwind CSS & Framer Motion.</strong>
</p>

<p align="center">
  <a href="https://nexoreui.site">Website & Documentation</a> •
  <a href="https://nexoreui.site/create">Project Studio</a> •
  <a href="https://github.com/Al1mov77/NexoreUI">GitHub</a>
</p>

---

## ⚡ Features

- 🎨 **Theme & Design System**: 8 curated color palettes (Cyan, Indigo, Violet, Emerald, Rose, Amber, Slate, Neon) with full dark mode support.
- 🚀 **Zero Setup Overhead**: Works as an NPM package or through an interactive CLI.
- ✨ **Fluid Micro-Interactions**: Handcrafted Framer Motion physics and spring animations.
- 📐 **Tailwind CSS v4 & v3 Ready**: First-class `@theme` token integration.
- 🛡️ **TypeScript Native**: 100% type-safe components with autocomplete for variants and sizes.
- ⚛️ **React 18 & 19 Support**: Verified compatibility with modern React runtimes.

---

## 🚀 Quick Start (One Command)

### Option 1: Initialize in an existing project

Initialize NexoreUI with your chosen theme in a single command:

```bash
npx nexoreui init --theme emerald --radius 0.75
```

Or with your preferred package manager:
```bash
# pnpm
pnpm dlx nexoreui init

# bun
bunx nexoreui init
```

Then add components directly into your codebase:
```bash
npx nexoreui add button card modal table
# Or install all 40+ components at once:
npx nexoreui add --all
```

---

### Option 2: Use as an NPM package

Install `nexoreui` and its peer dependencies:

```bash
npm install nexoreui framer-motion lucide-react clsx tailwind-merge
# or
pnpm add nexoreui framer-motion lucide-react clsx tailwind-merge
# or
bun add nexoreui framer-motion lucide-react clsx tailwind-merge
```

#### 1. Import Styles

Import the CSS variables and base styles in your main entry file (`src/main.tsx`, `src/index.tsx`, or `app/layout.tsx`):

```tsx
import "nexoreui/styles.css";
```

#### 2. Configure Tailwind CSS

If you use **Tailwind CSS v4**, add the `@source` directive in your main CSS file (`src/index.css` or `globals.css`):

```css
@import "tailwindcss";
@source "../node_modules/nexoreui/dist/**/*.{js,mjs}";
```

If you use **Tailwind CSS v3**, add the package path to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/nexoreui/dist/**/*.{js,mjs}",
  ],
  // ...
};
```

#### 3. Start Building

```tsx
import React from "react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "nexoreui";

export function App() {
  return (
    <div className="p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to NexoreUI</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="default">Primary Action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="neon">Neon Glow</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🎨 Theme Customization

NexoreUI uses CSS custom properties (`--primary`, `--background`, `--radius`, etc.) that allow dynamic runtime theming:

```css
:root {
  --primary: hsl(142.1 76.2% 36.3%);
  --primary-foreground: hsl(0 0% 100%);
  --radius: 0.75rem;
}

.dark {
  --primary: hsl(142.1 70.6% 45.3%);
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
}
```

Customize palettes interactively with the [NexoreUI Theme Studio](https://nexoreui.site/create).

---

## 🛠️ CLI Commands

| Command | Description |
| :--- | :--- |
| `npx nexoreui create [name]` | Scaffold a brand new React + Vite + Tailwind starter project |
| `npx nexoreui init` | Configure path aliases, CSS tokens, and theme settings in existing project |
| `npx nexoreui add [comps...]` | Add component files directly to your project (`--all` installs entire library) |
| `npx nexoreui list` | List all available components and templates in the registry |

---

## 📄 License

MIT © [NexoreUI](https://nexoreui.site)

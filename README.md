# NexoreUI

[![npm version](https://img.shields.io/npm/v/nexoreui)](https://www.npmjs.com/package/nexoreui)
[![CLI version](https://img.shields.io/npm/v/nexoreui-cli)](https://www.npmjs.com/package/nexoreui-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Production-ready, animated React component library and application templates engineered for Next.js 15, Tailwind CSS v4, and Framer Motion.

Built around strict semantic design tokens, clean surface hierarchy, native dark/light themes, and real accessibility.

[Documentation & Studio](https://www.nexoreui.site)

---

## Quickstart

### Option A: Add Individual Components via CLI (Recommended)

Initialize NexoreUI in an existing React / Next.js project:

```bash
npx nexoreui init
```

Install components directly into your `@/components/ui/` directory:

```bash
npx nexoreui add button card modal table
```

To install all available components at once:

```bash
npx nexoreui add --all
```

### Option B: Scaffold a New Project

Create a pre-configured project with Next.js or Vite, Tailwind CSS v4, and standard font tokens:

```bash
npx nexoreui create my-app
```

### Option C: Use as a Standard NPM Package

Install the core package along with peer dependencies:

```bash
npm install nexoreui framer-motion lucide-react clsx tailwind-merge
```

Import the stylesheet in your root layout (`app/layout.tsx` or `src/main.tsx`):

```tsx
import "nexoreui/styles.css";
```

---

## NexoreUI Pro Templates & CLI Authentication

NexoreUI includes full production templates (3D interactive video scrubbers, SaaS dashboards, auth flows, storefronts, and work consoles).

To authenticate your developer machine:

```bash
npx nexoreui auth <your-license-key>
```

Check your authentication and active machine slots:

```bash
npx nexoreui auth --status
```

Install any Pro template directly into your project:

```bash
npx nexoreui add template-ferrari-nocturne
```

*Note: All associated media assets (.mp4 videos, canvas frame sequences) are downloaded automatically during template installation.*

---

## Configuration (`nexore.json`)

The CLI reads configuration from `nexore.json` in your project root:

```json
{
  "$schema": "https://www.nexoreui.site/schema.json",
  "style": "default",
  "theme": "zinc",
  "radius": 0.625,
  "framework": "next",
  "packageManager": "pnpm",
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components/ui",
    "utils": "@/lib/utils"
  }
}
```

---

## Architecture & Principles

- **No AI Slop:** No decorative glow overlays, no rainbow gradients, no fake telemetry metrics, and no pill badges above headings.
- **Design Tokens:** Strict neutral palette based on standard CSS variables (`--background`, `--foreground`, `--card`, `--border`, `--muted`, `--primary`).
- **Accessible Motion:** All animations respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion`.
- **Radix UI Primitives:** Dialogs, dropdowns, tabs, and tooltips are built on tested keyboard and screen-reader accessible primitives.
- **Tailwind CSS v4 Native:** Full compatibility with `@theme` directives and CSS variable token mapping.

---

## Monorepo Layout

```
NexoreUI/
├── apps/
│   └── docs          # Documentation site, interactive playground, and templates studio
└── packages/
    ├── ui            # Core React component package (nexoreui)
    └── cli           # CLI tool (nexoreui-cli / create-nexore-app)
```

---

## Usage Example

```tsx
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "nexoreui";

export default function WorkspaceOverview() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production Deployment</CardTitle>
          <CardDescription>
            All services operational across primary regions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm font-mono text-muted-foreground">
            Status: healthy (12 nodes active)
          </span>
          <Button variant="default" size="sm">
            Manage Cluster
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

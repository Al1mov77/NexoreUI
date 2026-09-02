# NexoreUI 🌌

[![npm version](https://img.shields.io/npm/v/nexoreui)](https://www.npmjs.com/package/nexoreui)
[![CLI version](https://img.shields.io/npm/v/nexoreui-cli)](https://www.npmjs.com/package/nexoreui-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/Al1mov77/NexoreUI/actions/workflows/ci.yml/badge.svg)](https://github.com/Al1mov77/NexoreUI/actions)

A state-of-the-art, animated, production-ready React component library engineered for modern web applications with **Tailwind CSS v4** and **Framer Motion**.

Designed to amaze at first glance with curated color palettes, dark mode glassmorphism, glowing micro-animations, and full accessibility.

**[🌐 View Live Documentation & Studio](https://nexoreui.site)**

---

## ⚡ Instant Setup & Theme Studio

### Option A: One-Command Project Creator
Scaffold a complete React + Vite + Tailwind v4 project with the Theme Studio Cyan preset:
```bash
npx nexoreui-cli create my-app --theme cyan --radius 1.0
```

### Option B: Add Individual Components via CLI
```bash
# Add flagship components
npx nexoreui-cli add aurora-border-card morphing-geometry interactive-code-block button card

# Or install full component package directly
npm i nexoreui
```

---

## 🎨 Theme Studio Specification (`nexore.json`)

```json
{
  "$schema": "https://nexoreui.site/schema.json",
  "style": "default",
  "theme": "cyan",
  "radius": 1,
  "framework": "vite",
  "packageManager": "npm",
  "font": "system",
  "density": "default",
  "animation": "energetic",
  "defaultMode": "light",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
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

## 🚀 Key Highlights

- **40+ Production Ready Components**: Tables, Data Grids, Stat Cards, Charts, Modals, Drawers, File Dropzones, Sliders, and Steppers.
- **Tailwind CSS v4 Native**: Utilizes `@theme` directives and CSS variable token mapping with instant compile times.
- **Dynamic Animation Tokens**: Kinetic loaders (`WifiLoader`, `BatteryLoader`, `BouncingBalls`), spring hover physics, and reveal transitions.
- **Accessible & Screen-Reader Friendly**: Built on top of Radix UI primitives with ARIA compliance.
- **Unified Package & CLI**: Available as both a standard npm package (`nexoreui`) and copy-paste CLI registry (`nexoreui-cli`).

---

## 📦 Monorepo Architecture

```
NexoreUI/
├── apps/
│   └── docs          # Next.js 15 Documentation Site & Component Playground
└── packages/
    ├── ui            # Core React component library (@nexoreui)
    ├── cli           # CLI scaffolding tool (nexoreui / create-nexore-app)
    └── mcp-server    # Model Context Protocol server for AI pair programming
```

---

## 💻 Usage Example

```tsx
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  AreaChartSimple, 
  StatCard, 
  Table 
} from 'nexoreui';

export default function Dashboard() {
  return (
    <div className="p-8 space-y-6">
      <StatCard 
        title="Active Telemetry Nodes" 
        value="18,420" 
        trend={{ value: "+22.4%", positive: true }} 
      />
      <AreaChartSimple 
        data={[35, 42, 58, 65, 82, 91, 125]} 
        color="#06b6d4" 
        height={200} 
      />
      <Button variant="neon" size="lg">
        Deploy Cluster
      </Button>
    </div>
  );
}
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
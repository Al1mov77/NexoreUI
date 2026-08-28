# NexoreUI CLI 🚀

The official CLI tool to scaffold, configure, and install **NexoreUI** components in React, Vite, and Next.js applications with Tailwind CSS v4.

[![npm version](https://img.shields.io/npm/v/nexoreui-cli)](https://www.npmjs.com/package/nexoreui-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## ⚡ Quick Start

### 1. Create a New Project from Scratch
```bash
# Interactive project generator with Cyan Theme Studio preset
npx nexoreui create my-nexore-app --theme cyan --radius 1.0
```

### 2. Initialize in an Existing Project
```bash
# Automatically configures nexore.json, @/ path aliases, and @theme CSS tokens
npx nexoreui init --theme cyan --radius 1.0 -y
```

### 3. Add Components
```bash
# Add specific components
npx nexoreui add button card modal table tabs

# Or batch install all 40+ components at once
npx nexoreui add --all
```

---

## 🛠️ Commands

| Command | Description | Example |
| :--- | :--- | :--- |
| `create [name]` | Scaffolds a complete starter app with Tailwind v4 and NexoreUI | `npx nexoreui create my-app` |
| `init` | Configures `nexore.json`, `@/*` path alias, and theme tokens | `npx nexoreui init --theme cyan` |
| `add [components...]` | Adds components to your `src/components/ui/` directory | `npx nexoreui add button modal` |
| `add --all` | Installs all registered components from the registry | `npx nexoreui add --all` |
| `list` | Lists all available components in the registry | `npx nexoreui list` |

---

## 🎨 Theme Studio Presets

Available color palettes:
- `cyan` (Default Theme Studio preset: `hsl(190.4 95% 39%)`)
- `indigo` (`hsl(250 85% 50%)`)
- `violet` (`hsl(262.1 83.3% 57.8%)`)
- `emerald` (`hsl(142.1 76.2% 36.3%)`)
- `rose` (`hsl(346.8 77.2% 49.8%)`)
- `amber` (`hsl(37.7 92.1% 50.2%)`)
- `slate` (`hsl(240 5.9% 10%)`)
- `neon` (`hsl(173 80% 40%)`)

Corner Radius values:
`0`, `0.3`, `0.5`, `0.75`, `1.0` (rem).

---

## 📄 License
MIT © [NexoreUI](https://nexoreui.site)

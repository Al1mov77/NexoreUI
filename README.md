# NexoreUI 🌌

[![npm version](https://img.shields.io/npm/v/nexoreui)](https://www.npmjs.com/package/nexoreui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/Al1mov77/NexoreUI/actions/workflows/ci.yml/badge.svg)](https://github.com/Al1mov77/NexoreUI/actions)

A premium, highly interactive, and beautiful component library built with React, Framer Motion, and Tailwind CSS v4.

Designed to wow at first glance with rich aesthetics, glassmorphism, glowing effects, and smooth transitions.

**[🌐 View Live Demo](https://nexoreui.vercel.app)**

## 🚀 Features

- **Consolidated Variants**: Core components like Button, Alert, and Avatar are unified with multiple premium variants (Neon, Glow, Cyberpunk, Glass, and more).
- **Pro Components**: Interactive dashboards, commerce UI widgets, and feedback tools.
- **Ultra Premium Effects**: Mac-like Dock, ShinyText, Marquee, NumberTicker, and TypingAnimation.
- **SEO Optimized Documentation**: Static site metadata ready for deployment.
- **Fast Building**: Built with TSup and Turborepo.

## 📦 Project Structure

```
├── apps
│   └── docs          # Next.js 15 Documentation Site with live playground
└── packages
    ├── ui            # Core component library
    └── cli           # CLI tool for scaffolding
```

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

Install the core UI library in your project:

```bash
npm install nexoreui
# or
pnpm add nexoreui
# or
yarn add nexoreui
```

### Usage

Here is a quick example of how to use NexoreUI components in your React application:

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from 'nexoreui';

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-6">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to NexoreUI</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            Build premium interfaces with beautiful interactive components.
          </p>
          <Button variant="neon" size="lg" className="w-full">
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 🗺️ Roadmap (In Progress)

The following core components are currently being unified into single components with flexible variants and sizes (Step 3 of NexoreMake code generation updates):
- [ ] **Input**: Consolidating floating labels, outline designs, and custom sizes.
- [ ] **Badge**: Expanding variants (`destructive`, `outline`, etc.).
- [ ] **Card**: Adding native `variant` and `sizeVariant` props to influence internal UI.

## 👨‍💻 Local Development

To run the documentation app locally in development mode:

```bash
pnpm install
pnpm dev
```

To build all packages:

```bash
pnpm build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
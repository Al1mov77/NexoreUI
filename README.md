# NexoreUI 🌌

A premium, highly interactive, and beautiful component library built with React, Framer Motion, and Tailwind CSS v4.

Designed to wow at first glance with rich aesthetics, glassmorphism, glowing effects, and smooth transitions.

## 🚀 Features

- **Consolidated Variants**: Core components like Button, Card, Input, Alert, Avatar, and Badge are unified with multiple premium variants (Neon, Glow, Cyberpunk, Glass, and more).
- **Pro Components**: Interactive inputs, dashboards, commerce UI widgets, and feedback tools.
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

Clone the repository and install dependencies:

```bash
pnpm install
```

### Running Locally

To run the documentation app locally in development mode:

```bash
pnpm dev
```

To build all packages:

```bash
pnpm build
```

## 🧹 Audit & Cleanups Done

NexoreUI went through a thorough audit to consolidate duplicate files into core atomic variants:
- **Loaders**: Unified Wifi, Hourglass, Battery, Clock, BouncingBalls, and Box loaders into a single `<Loader>` component.
- **Buttons**: Merged special button styles into `<Button>` variants.
- **Cards**: Consolidates Spotlight, Hover, Glass, Glow, and Tilt cards.
- **Inputs**: Unified Floating labels, outline designs, and more into `<Input>` variants.
- **Special Effects**: Merged TypingAnimation into special animations helper.
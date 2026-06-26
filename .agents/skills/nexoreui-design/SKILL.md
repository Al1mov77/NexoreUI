---
name: nexoreui-design
description: Design system and UI guidelines for NexoreUI documentation site. Use when creating or editing any page, component, or layout on the docs site.
---

# NexoreUI Design Skill

## Core Principles
- Minimal and clean — lots of whitespace
- Dark theme first: background #09090b
- Subtle borders: border-white/8 or border-white/10
- No loud gradients — only subtle ones
- Animations: barely noticeable, smooth
- Typography: Inter font, tight tracking

## Color Palette
- Background: hsl(225 15% 5%) (deep dark ink-blue)
- Surface/Card: hsl(225 12% 7%)
- Surface 2: hsl(225 10% 12%)
- Border: hsl(225 10% 14%)
- Primary: hsl(250 85% 65%) (custom indigo)
- Primary glow: hsl(250 85% 65% / 15%)
- Text: hsl(210 20% 95%) (warm text-paper white)
- Muted text: hsl(220 10% 55%)

## Typography Rules
- Headings: font-semibold tracking-tight
- Body: text-zinc-400
- Code: JetBrains Mono
- Large hero text: text-5xl md:text-7xl

## Component Style Rules
- Cards: rounded-xl border border-white/8 bg-zinc-900/50
- Buttons: rounded-lg, subtle shadows
- Code blocks: mac-style dots, dark bg, syntax highlighting
- Hover effects: subtle glow or border color change only

## Layout Rules
- Max content width: max-w-6xl mx-auto
- Section padding: py-24 px-6
- Grid gaps: gap-6 or gap-8
- Mobile first, fully responsive

## Animation Rules
- Use Framer Motion only
- Entrance: opacity 0→1, y 20→0, duration 0.5s
- Stagger children: 0.1s delay each
- No bouncy springs on UI elements
- Hover scale: 1.02 maximum

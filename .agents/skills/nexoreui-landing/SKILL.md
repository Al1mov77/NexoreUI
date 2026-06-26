---
name: nexoreui-landing
description: Guidelines for the NexoreUI landing page. Use when editing apps/docs/app/page.tsx or the home page layout.
---

# NexoreUI Landing Page Skill

## Page Structure
1. HeroBackground — subtle static gradient mesh blobs
2. Hero — badge, title, subtitle, buttons, install command, and live component previews grid in one clean viewport
3. Stats — 4 dynamic/honest metrics (stars, components count, bundle size, FPS) with NumberTicker and TechMarquee
4. Features — Bento grid layout with interactive elements (physics sandbox, SVG graph, keys indicators, mock terminal)
5. CTA — clean, high-performance call-to-action block
6. Footer — copyright and documentation/GitHub links

## Hero Rules
- Background: HeroBackground mesh blobs
- Badge at top: small pill with arrow and link to installation
- Title: static, bold, tracking-tight
- Subtitle: concise description of the library features
- Two buttons: primary (with backdrop glow) + outline
- Install command below buttons: copyable console command box
- Live showcases: interactive showcases mapping core component properties (Button click, Pulse Status, Toggle Switch, SVG Progress, hover Tooltip, volume Slider)
- All elements animate in with BlurFade

## What NOT to do
- No rainbow gradients
- No particle backgrounds
- No auto-playing videos
- No more than 2 font sizes per section
- No more than 3 colors per section

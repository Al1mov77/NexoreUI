# Identity brief: template-portfolio-pro

Save as `.agents/briefs/template-portfolio-pro.md`. Fill every line. No blanks.

## Story (3 lines)
1. Product and visitor: NEXFOLIO is a Swiss rationalist portfolio and studio showcase for staff design engineers and creative technologists; the visitor is an engineering VP, design executive, or founder looking to hire high-craft engineering advisory or commission specialized software.
2. What the visitor must feel or decide: Feel the quiet confidence of high-craft software engineering, typographic restraint, and architectural precision; inspect interactive case studies and initiate a direct advisory engagement.
3. Signature moment shows: S6 Project index with interactive case study inspection, desktop pointer-follower preview cards with spring damping, and touch-adaptive cards on mobile with zero squished columns.

## Identity (10 axes)
1. Archetype (A-L): J Index / list with studio bento (clean top bar with live Zurich status, asymmetric editorial statement, structured project index table with category filter tabs, interactive case study drawer, and conversion panel).
2. Grid and density: Desktop 12 columns with 1px hairline rules, 24px gutter, 8pt base unit. Vertical section padding: 96px desktop / 64px tablet / 40px mobile.
3. Display type: Geist (weights 400, 500, 600, 700), Google Fonts URL: `https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap`, verified 200.
4. Body and aux type: Geist for body reading; Geist Mono for timestamps, status labels, metrics, and tags.
5. Palette (hex): P14 Steel Graphite (native dark default, refined light secondary).
   - Dark: bg #101113 / surface #17191C / surfaceAlt #202327 / line #26292E / text #E8EAED / muted #8A9099 / accent #FF7A1A / accentInk #1C0C00.
   - Light: bg #F8F9FA / surface #FFFFFF / surfaceAlt #F1F3F5 / line #E5E7EB / text #111827 / muted #6B7280 / accent #EA580C / accentInk #FFFFFF.
6. Surface language (SL1-SL6): SL2 Soft cards (radius 12px to 16px, 1px low-contrast line border, soft subtle micro-shadow, clean refined cards, zero clunky brutalist offset boxes).
7. Motion personality (M1-M7): M1 Precise (spring 520 / 38 / 0.7, snappy, hover lift 2px, press scale 0.98, touch-native equivalents, full reduced motion support).
8. Signature moment (S-code), mechanism, real content it acts on, mobile fallback: S6 Project index with interactive case study modal inspector. On desktop, hover floats a cursor-follower preview; on mobile, adapts to touch-native cards with inline photography and instant modal inspection.
9. Copy voice: Dry technical design engineer. Verbs and concrete nouns. Sample headline: "Staff design engineering for complex interfaces and systems." Sample button: "Initiate advisory inquiry".
10. Imagery treatment: Precision aspect ratios (16:10 and 16:9), 12px radius, subtle border, authentic curated photography, clean caption labels.

## Collision check
Compared against ledger rows:
- Lamborghini Revuelto (L, T4, P12, SL3, M4, S2): differs on Archetype (J vs L), Type (T3 vs T4), Palette (P14 vs P12), Surface (SL2 vs SL3), Motion (M1 vs M4), Signature (S6 vs S2) -> 6 axes.
- Psyche Obsidian (J, T16, P1, SL1, M3, S25): differs on Type (T3 vs T16), Palette (P14 vs P1), Surface (SL2 vs SL1), Motion (M1 vs M3), Signature (S6 vs S25) -> 5 axes.
- Vortex Apex (C, T15, P4, SL1, M4, S1): differs on Archetype, Type, Palette, Surface, Motion, Signature -> 6 axes.
- Levitas Cryo (F, T3, P6, SL2, M1, S5): differs on Archetype (J vs F), Palette (P14 vs P6), Signature (S6 vs S5), Grid, Voice, Imagery -> 6 axes.
- Aerovoid (legacy): differs on Archetype, Type, Palette, Surface, Motion, Signature, Section order -> 7 axes.
Axes that differ from closest row: 5+ axes. No collision.

## Section sequence (one job each, 5-6)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | `#hero` | Present practitioner thesis, location, status, and live clock | Asymmetric editorial split with left headline and right meta card | Clean stacked single column with full-width CTAs | 2-column compact split |
| 2 | `#index` | Signature S6: Curate 6 production case studies with filters | Ruled index list on desktop with cursor preview & modal | Touch card list with inline imagery | 2-column card grid |
| 3 | `#capabilities` | Detail technical & design proficiency matrix | Typographic 3-column ruled grid with verified badges | Stacked single-column cards | 2-column card grid |
| 4 | `#experience` | Document career trajectory and verified achievements | Asymmetric timeline: left decade anchor, right milestone cards | Stacked milestone cards | 2-column timeline |
| 5 | `#inquiry` | Convert: Select advisory scope, budget tier, and send inquiry | 2-column panel with scope tabs & budget selectors | Single-column clean form | 2-column form |
| 6 | `#colophon` | Provide studio legal notes, colophon specifications, and links | 4-column structured grid | Single-column clean list | 2-column grid |

## Macro choreographies (4+)
1. Hero load choreography: Staggered rise of header status rule, headline, and bio blocks.
2. S6 Cursor-following media preview + scroll velocity skew: Desktop cursor follower floats with spring damping; scroll velocity skews typography slightly.
3. Case study modal transition: Full-screen architectural drawer reveal with AnimatePresence, locking background scroll.
4. Shared layout indicators: Framer Motion `layoutId="portfolio-category"` on filter pills and `layoutId="budget-tier"` on inquiry budget selector.

## Micro interactions (12+)
1. Interactive theme switch (Light / Dark) with smooth color transition.
2. Category filter tabs with `layoutId` active indicator pill.
3. Project row hover lift and subtle line highlight.
4. Project row pointer tracking for cursor follower image (desktop).
5. Quick case study modal open/close with keyboard `Escape` listener.
6. Copy email to clipboard with animated checkmark feedback.
7. Budget tier selector with `layoutId` pill.
8. Live Zurich UTC clock ticking seconds.
9. Link underline draw on hover in bio and colophon.
10. WhileTap scale 0.98 feedback on all buttons and interactive cards.
11. Focus-visible rings styled with 2px line offset.
12. Toast alert feedback on project inquiry submit.

## Deleted from the old version (rewrite only)
What slop was removed and which true facts were kept:
- Deleted: Harsh blocky brutalist wireframe styling, raw black borders, offset drop-shadow boxes.
- Deleted: Broken Tailwind `lg:grid-cols-12` that collapsed on mobile preview switcher.
- Deleted: text-indigo-400 / text-indigo-600 used on 20+ lines.
- Deleted: Default Tailwind zinc-400/500/800/900 palette used 560 times.
- Deleted: Banned buzzwords ("next-generation" 2x, "elevate"); replaced with clean engineering descriptions.
- Deleted: Middle-dot separators (`•`).
- Deleted: Fake telemetry; kept verified real metrics.
- Added: Full `template-adaptive-preview` JavaScript deviceMode detection (`isMobile`, `isTablet`, `isDesktop`) across every single section.
- Added: Refined SL2 soft cards with 12-16px radius, subtle 1px borders, smooth typography.
- Kept: 6 curated case studies with real architectural imagery, 4 career milestones (Vercel, Linear, Apple, Stripe), live Zurich clock.

## Not allowed here (self-check)
No primitives, particles, HUD, toys, pill/kicker, emoji, pulse dots, fake facts, Aerovoid structure.

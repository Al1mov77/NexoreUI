# Identity brief: levitas-cryo

Save as `.agents/briefs/levitas-cryo.md`. Fill every line. No blanks.

## Story (3 lines)
1. Product and visitor: Levitas is an artisanal liquid-nitrogen gelato atelier serving flash-frozen confections with brittle chocolate and sugar shells and unctuous churned cream; the visitor is a culinary patron or food enthusiast booking an intimate seasonal tasting.
2. What the visitor must feel or decide: Feel the quiet confidence of pure natural ingredients and precise sub-zero freezing craft, selecting their preferred tasting flight and reservation date.
3. Signature moment shows: S5 Pinned horizontal lookbook highlighting four real seasonal flavors, each presented in an entirely different editorial layout composition with ingredient breakdown and honest notes.

## Identity (10 axes)
1. Archetype (A-L): F Horizontal lookbook (desktop: clean top bar with persistent lookbook frame indicators, title plus first frame stage, pinned horizontal track of 4 distinct flavor compositions, ruled tasting menu; mobile: vertical stack with horizontal touch snap strips).
2. Grid and density: Desktop 12 columns with 1px hairline rules, 24px gutter, 8pt base unit, section vertical padding 112px desktop / 72px mobile.
3. Display type: Inter Tight (weights 300, 500, 700), Google Fonts URL: `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap`, verified 200.
4. Body and aux type: Inter Tight for all headlines, editorial copy, and interface labels. IBM Plex Mono (weights 400, 500) strictly for frame numbers (01, 02, 03, 04).
5. Palette (hex): P6 Glacier Mono (native light theme, dark secondary).
   - Light (native default): bg #EAEEF2 / surface #DFE5EB / line #C8D0D9 / text #0F1722 / muted #5B6776 / accent #0A6CFF / accent-ink #FFFFFF.
   - Dark: bg #0B0C0E / surface #15161A / line #24252B / text #F3F4F6 / muted #8B909A / accent #3B82F6 / accent-ink #FFFFFF.
6. Surface language (SL1-SL6): SL2 Soft cards (radius 16 to 24px, 1px low-contrast line border, soft organic curves, on-page theme toggle).
7. Motion personality (M1-M7): M1 Precise (spring 520 / 38 / 0.7, tween ease [0.2, 0, 0, 1] 0.5s, hover underline 180ms, press scale 0.98, touch-native equivalents).
8. Signature moment (S-code), mechanism, real content it acts on, mobile fallback: S5 Pinned horizontal lookbook. Vertical scroll through sticky container translates horizontal lookbook track across 4 distinct gelato flavor compositions; mobile fallback is a swipeable horizontal snap gallery with numeric pill indicators and vertical content cards.
9. Copy voice: Calm, concrete culinary realism; natural ingredients and sub-zero gelato craft; sample headline: "Sub-zero gelato, frozen before your eyes"; sample button: "Reserve a tasting table".
10. Imagery treatment: Precision aspect ratios (4:5, 16:9, 1:1), 1px hairline borders, authentic video from `/videos/levitas-cryo-spheres.mp4` with muted playsInline and poster fallback.

## Collision check
Compared against ledger rows:
- Vortex Apex (C, T15, P4, SL1, M4, S1): differs on archetype (F vs C), display (T3 vs T15), palette (P6 vs P4), motion (M1 vs M4), signature (S5 vs S1) -> 5 axes.
- Ferrari Nocturne (B, T13, P17, SL4, M5, S16): differs on archetype, type, palette, surface, motion, signature -> 6 axes.
- Lamborghini Revuelto (L, T4, P12, SL3, M4, S2): differs on archetype, type, palette, surface, motion, signature -> 6 axes.
- Aura Nocturne (A, T2, P7, SL2, M2, S11): differs on archetype, type, palette, surface, motion, signature -> 6 axes.
- Aura Obsidian (E, T10, P3, SL4, M3, S9): differs on archetype, type, palette, surface, motion, signature -> 6 axes.
- Monolith Cacao (D, T5, P10, SL4, M5, S3): differs on archetype, type, palette, surface, motion, signature -> 6 axes.
Axes that differ from closest row: 6+ axes. No collision.

## Section sequence (one job each, 5-6)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | `#hero` | Present product thesis and live video demonstration | Asymmetric 7/5 split with large dense headline and real video | Stacked hero with full-width video | 7/5 split compact |
| 2 | `#craft` | Explain the liquid nitrogen flash-freezing technique | Pure typographic ruled 2-column editorial statement | Single-column stacked | 2-column compact |
| 3 | `#lookbook` | Signature S5: Explore four seasonal creations | Pinned horizontal scrolling track with 4 varied frame compositions | Touch snap carousel with quick-tab navigation | Pinned track shorter scrub |
| 4 | `#menu` | Present tasting flights, portions, and tea pairings | Structured ruled catalog list with ingredient notes | Stacked flight cards | 3-column ruled grid |
| 5 | `#reserve` | Convert: Book table for seasonal degustation | 2-column booking layout with flight selection and guest form | Single-column form | 2-column form |
| 6 | `#colophon` | Provide atelier address, hours, and contact | 4-column structured colophon | 2-column grid | 4-column compact grid |

## Macro choreographies (4+)
1. Hero load choreography: Staggered line-mask reveal of headline and supporting text on entry.
2. S5 Pinned horizontal track: Vertical scroll progress through sticky track drives translateX from 0% to -75%.
3. Header scroll progress hairline: 1px hairline border at top tracks scroll depth via scaleX.
4. Shared layout transition: Framer Motion `layoutId` indicator slides between flight selections and active lookbook frames.

## Micro interactions (12+)
1. Magnetic primary CTA button with spring 450/35.
2. Button label swap with AnimatePresence mode="wait" on reservation submit.
3. Interactive lookbook frame tab selector with layoutId active hairline indicator.
4. Tasting flight card selection with layoutId active hairline border.
5. Link underline that draws left-to-right on hover and retracts.
6. Focus-visible ring styled to SL1 hairline with 2px offset.
7. Tap press feedback (whileTap={{ scale: 0.98 }}).
8. Table row hover highlight (tonal surface wash).
9. Count-up animation for portion pricing with tabular numerals.
10. Input field focus transition with hairline color switch.
11. Copy atelier address button with feedback checkmark.
12. Frame navigation arrow buttons (previous / next frame jump).

## Deleted from the old version (rewrite only)
What slop was removed and which true facts were kept:
- Deleted: Kicker / pill labels above headings.
- Deleted: All invented telemetry and fake laboratory claims (kHz, °C, dB, g, Kyoto/Reykjavik coords, FPS).
- Deleted: Uppercase shouting everywhere; replaced with refined normal sentence casing.
- Deleted: Mirrored, inverted, or rotated vertical text.
- Deleted: HUD frames and fake bounding boxes.
- Kept: Real product facts (liquid-nitrogen cryo gelato, real video `/videos/levitas-cryo-spheres.mp4`, real flavors: Kurogoma, Tartufo Bianco, Nordic Cloudberry, Ceremonial Matcha, and honest tasting flight tariffs: $42, $140, $260).

## Not allowed here (self-check)
No primitives, particles, HUD, toys, pill/kicker, emoji, pulse dots, fake facts, Aerovoid structure.

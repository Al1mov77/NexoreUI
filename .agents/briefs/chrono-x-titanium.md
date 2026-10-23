# Identity brief: chrono-x-titanium

Save as `.agents/briefs/chrono-x-titanium.md`. Fill every line. No blanks.

## Story (3 lines)
1. Product and visitor: Chrono-X Titanium is a manual-wind mechanical chronometer forged from aerospace Grade 5 titanium, housing a 4 Hz (28,800 vph) flying tourbillon escapement and 72-hour power reserve; the visitor is a collector, horological engineer, or connoisseur evaluating craftsmanship, movement architecture, and case ergonomics.
2. What the visitor must feel or decide: Feel the quiet confidence of pure mechanical horology and architectural restraint without marketing hyperbole, inspect the rotating 360-degree titanium case across four authentic movement chapters, and reserve an allocation or install the template.
3. Signature moment shows: S2 Frame scrub where a 179-frame sequence of the titanium chronometer smoothly rotates with scroll on an optimized canvas, synchronized with four authentic caliber chapters (Chassis, Escapement, Hermetic Crown, and Movement Architecture).

## Identity (10 axes)
1. Archetype (A-L): K Ceremonial centered (balanced monumental typography, disciplined symmetry, generous editorial margins, centered hero, and structured horizontal rule ledger).
2. Grid and density: 12-column grid, max width 1152px, 16px to 24px gap, section padding py-20 to py-28 desktop, py-12 to py-16 mobile.
3. Display type (family, weights or axes, Google Fonts URL, verified 200): Cormorant Garamond (`wght@400;500;600;700`), Tenor Sans (`wght@400`), Google Fonts URL: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Tenor+Sans&display=swap` (Verified 200).
4. Body and aux type: Tenor Sans for body and headings; Cormorant Garamond for ceremonial display titles; Geist Mono for caliber numbers, frequencies, and tolerances.
5. Palette (hex): P2 Midnight Ledger (Horology Midnight Obsidian & Champagne Gold):
   - Dark (native): bg #0B0F14 / surface #121821 / line #1F2733 / text #E9EDF2 / muted #8793A3 / accent #E8B84B (Champagne Gold) / accent-ink #1A1303.
   - Light variant: bg #F5F6F8 / surface #EBF0F5 / line #D8DFE8 / text #0B0F14 / muted #5B6675 / accent #A17417 (Antique Bronze) / accent-ink #FFFFFF.
6. Surface language (SL1-SL6): SL1 Hairline flat (radius 2px to 4px, 1px crisp line border using line token, zero heavy drop shadows, structure achieved through ruled hairlines and generous whitespace).
7. Motion personality (M1-M7): M1 Precise (tight, instrument feel, spring 520 / 38 / 0.7, duration 0.24s to 0.4s, masked reveals, hover underline and subtle tone shift, press scale 0.98, full useReducedMotion support).
8. Signature moment (S-code), mechanism, real content it acts on, mobile fallback: S2 Frame scrub with 179 high-resolution frames of the Chrono-X watch in `/videos/chrono_frames/` rendered on a responsive canvas with optimized exponential lerp and frame caching, synchronized with 4 authentic horological chapters. Mobile fallback: touch scrub slider with chapter indicators and stacked cards. Reduced-motion fallback: static showcase with chapter tabs.
9. Copy voice: Ceremonial, terse, precise horological facts without buzzwords; sample headline: "Forged in Grade 5 Titanium"; sample button: "Reserve chronometer".
10. Imagery treatment: Real 179-frame sequence in `/videos/chrono_frames/frame_001.jpg` to `frame_179.jpg`, displayed on a crisp vitrine canvas with theme-adaptive background matching and subtle hairline frame.

## Collision check
Compared against ledger rows:
- Aerovoid Obsidian (legacy, dark/amber, SL6, exploded layers): differs on Archetype (K vs legacy), Type (T9 vs legacy), Palette (P2 vs dark/amber), Surface (SL1 vs SL6), Motion (M1 vs legacy), Signature (S2 vs exploded layers) -> 6 axes.
- Vortex Apex (C, T15, P4, SL1, M4, S1): differs on Archetype (K vs C), Type (T9 vs T15), Palette (P2 vs P4), Motion (M1 vs M4), Signature (S2 vs S1) -> 5 axes.
- Ferrari Nocturne (B, T13, P17, SL4, M5, S16): differs on Archetype (K vs B), Type (T9 vs T13), Palette (P2 vs P17), Surface (SL1 vs SL4), Motion (M1 vs M5), Signature (S2 vs S16) -> 6 axes.
- Lamborghini Revuelto (D, T3, P17, SL2, M1, S2): differs on Archetype (K vs D), Type (T9 vs T3), Palette (P2 vs P17), Surface (SL1 vs SL2), Voice -> 5 axes.
- Zenith Elixir (G, T3, P1, SL1, M1, S21): differs on Archetype (K vs G), Type (T9 vs T3), Palette (P2 vs P1), Signature (S2 vs S21), Voice -> 5 axes.
- Aura Nocturne (A, T2, P7, SL2, M2, S11): differs on Archetype (K vs A), Type (T9 vs T2), Palette (P2 vs P7), Surface (SL1 vs SL2), Motion (M1 vs M2), Signature (S2 vs S11) -> 6 axes.
Axes that differ from closest row: 5+ axes. No collision.

## Section sequence (one job each, 5-7)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | `#hero` | Present Chrono-X Titanium chronometer with key physical facts | Ceremonial centered layout with Cormorant title, horology facts strip, and primary action | Stacked single column, wrapped headline words | Balanced 2-column stats |
| 2 | `#showcase` | S2 Signature Moment: 360° scroll-driven frame scrub with 4 synchronized caliber chapters | Pinned showcase vitrine with chapter selector, metric cards, and canvas | Sticky vitrine with touch scrub and stacked cards | Compact vitrine with side chapter panel |
| 3 | `#manifesto` | Typographic thesis on mechanical autonomy and aerospace material integrity | Typographic-only centered statement in Cormorant and Tenor | Stacked single column | Centered column with wider margins |
| 4 | `#specifications` | Complete technical ledger of dimensions, tolerances, materials, and power reserve | 2-column hairline ruled specification table | Full-width single definition list | 2-column table |
| 5 | `#craftsmanship` | Manufacturing and finishing process (forging, chamfering, 5-position regulation) | 3-block asymmetrical process ledger | Stacked cards | 3-column compact |
| 6 | `#acquisition` | Allocation console with strap selection, CLI install snippet, and reservation | 2-column configuration console | Stacked single column | 2-column console |
| 7 | `#colophon` | Horological archive details, Geneva precision standards reference, and studio colophon | 4-column structured footer | Stacked blocks | 2-column footer |

## Macro choreographies (4+)
1. Hero load choreography: Staggered smooth fade-in of Cormorant title, subtitle, and three key technical metrics with M1 precise timing.
2. S2 360° Frame Scrubbing: Scroll-driven canvas frame sequence with critically damped exponential lerp and frame caching, eliminating CPU bottlenecks.
3. Chapter transitions: Animated layout indicator for active chapter tab (`active-chapter-pill`) with synced technical caliber specs.
4. In-template Theme Inversion: Instant switch between Midnight Ledger dark mode and clean vellum light mode.
5. Pinned vitrine stage: Pinned 3D showcase during scroll while the four caliber chapters update smoothly.

## Micro interactions (12+)
1. In-template theme switcher (Sun/Moon) with smooth rotation.
2. Strap material selector pills (Titanium bracelet vs vulcanized FKM rubber) with active border.
3. Chapter navigation tabs with animated active pill indicator.
4. Primary button hover lift (`y: -2`) and active press (`scale: 0.98`).
5. Secondary ghost button hover background shift.
6. Copy CLI command button with feedback checkmark.
7. Fullscreen toggle button with icon state change.
8. Touch scrub range slider for manual rotation on mobile.
9. Technical spec table row hover highlight.
10. Process block hover subtle border brightening.
11. Focus-visible ring on all interactive elements.
12. Smooth scroll-to-showcase navigation link.

## Deleted from the old version (rewrite only)
What slop was removed and which true facts were kept:
- Deleted: 16 audit errors and 24 warnings, including fake telemetry ("neural computing", "bio-photonic pulsed laser optical telemetry"), game UI ("HUD", "crosshairs"), blur blobs (`backdrop-blur-2xl`), `animate-pulse` dots, fake scarcity ("LIMITED BATCH"), middle-dot separators, gradient text, unoptimized per-frame CPU pixel manipulation.
- Kept: Grade 5 titanium case, 44mm diameter, 28,800 vph escapement frequency, 100m water resistance, genuine 179-frame scrub asset sequence.

## Not allowed here (self-check)
No primitives, particles, HUD, toys, pill/kicker, emoji, pulse dots, fake facts, Aerovoid structure.

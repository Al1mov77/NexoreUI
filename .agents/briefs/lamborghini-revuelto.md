# Identity brief: lamborghini-revuelto

Save as `.agents/briefs/lamborghini-revuelto.md`. Fill every line. No blanks.

## Story (3 lines)
1. Product and visitor: Lamborghini Revuelto is Sant'Agata Bolognese's 1015 CV High Performance Electrified Vehicle (HPEV) pairing an atmospheric 6.5-liter V12 (9,500 RPM limiter) with three axial-flux electric motors; the visitor is an automotive collector, performance driver, or engineer inspecting chassis construction, aerodynamics, and powertrain architecture.
2. What the visitor must feel or decide: Feel the refined precision, authentic Italian craftsmanship, and raw performance of Sant'Agata engineering without AI jargon or fake telemetry, examine the 360-degree rotation of the car across four distinct mechanical chapters, and reserve an allocation.
3. Signature moment shows: S2 Frame scrub where a 240-frame high-resolution 360-degree rotation sequence scrubs with scroll, seamlessly transitioning between four real engineering chapters (Aero Stance, Carbon Monocoque, Atmospheric V12, and Electric All-Wheel Drive).

## Identity (10 axes)
1. Archetype (A-L): D Product sheet / catalog (clear top navigation with theme toggle, focused hero with real technical metrics, full-width 360-degree inspection stage, asymmetric powertrain and aerodynamics breakdown, and reservation console).
2. Grid and density: 12-column grid, max width 1152px, 16px to 24px gap, section padding py-20 to py-28 desktop, py-12 to py-16 mobile.
3. Display type (family, weights or axes, Google Fonts URL, verified 200): Geist (`wght@400;500;600;700`), Geist Mono (`wght@400;500;600`), Google Fonts URL: `https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap` (Verified 200).
4. Body and aux type: Geist for headings and body; Geist Mono for metadata, units, and tabular metrics.
5. Palette (hex): Carbon Rosso (Refined Black & Crimson):
   - Dark (native): bg #09090b / surface #121215 / surfaceRaised #18181b / line #27272a / text #f4f4f5 / muted #a1a1aa / accent #dc2626 (Rosso Corsa) / accent-ink #ffffff.
   - Light variant: bg #ffffff / surface #f8f9fa / surfaceRaised #f1f3f5 / line #e4e4e7 / text #09090b / muted #71717a / accent #dc2626 / accent-ink #ffffff.
6. Surface language (SL1-SL6): SL2 Soft cards (radius 12px to 16px / rounded-xl, 1px subtle line border using line token, clean shadow-sm, zero square harsh boxes).
7. Motion personality (M1-M7): M1 Precise (tight, instrument feel, tween duration 0.25s to 0.4s, ease [0.16, 1, 0.3, 1], hover lift 2px, active press scale 0.98, full useReducedMotion support).
8. Signature moment (S-code), mechanism, real content it acts on, mobile fallback: S2 Frame scrub with 240 high-resolution frames of the Revuelto on a canvas with real-time luma-alpha extraction, synchronized to 4 authentic engineering chapters. Mobile fallback: touch scrub slider with chapter indicators and stacked cards. Reduced-motion fallback: static showcase with chapter tabs.
9. Copy voice: Dry technical, terse, precise factual numbers from Sant'Agata Bolognese; sample headline: "The first hybrid V12 super sports car"; sample button: "Configure allocation".
10. Imagery treatment: Real 240-frame sequence in `/videos/lamborghini_frames/frame_001.jpg` to `frame_240.jpg`, processed via real-time canvas luma-alpha extraction, framed in a smooth rounded-2xl vitrine with theme-adaptive drop-shadow.

## Collision check
Compared against ledger rows:
- Aerovoid Obsidian (legacy, dark/amber, SL6, exploded layers): differs on Archetype, Type, Palette, Surface, Motion, Signature -> 6 axes.
- Vortex Apex (C, T15, P4, SL1, M4, S1): differs on Archetype (D vs C), Type (Geist vs T15), Palette (Carbon Rosso vs P4), Surface (SL2 vs SL1), Signature (S2 vs S1) -> 5 axes.
- Ferrari Nocturne (B, T13, P17, SL4, M5, S16): differs on Archetype (D vs B), Type (Geist vs T13), Surface (SL2 vs SL4), Motion (M1 vs M5), Signature (S2 vs S16) -> 5 axes.
- Chrono X Titanium (K, T9, P2, SL1, M1, S4): differs on Archetype (D vs K), Type (Geist vs T9), Palette (Carbon Rosso vs P2), Surface (SL2 vs SL1), Signature (S2 vs S4) -> 5 axes.
- Zenith Elixir (G, T3, P1, SL1, M1, S21): differs on Archetype (D vs G), Palette (Carbon Rosso vs Zinc), Surface (SL2 vs SL1), Signature (S2 vs S21), Voice -> 5 axes.
Axes that differ from closest row: 5+ axes. No collision.

## Section sequence (one job each, 5-7)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | `#hero` | Present Revuelto HPEV benchmark with key performance specs | Clean asymmetric hero split with headline, metrics strip, and actions | Stacked single column | 2-column split |
| 2 | `#showcase` | S2 Signature Moment: 360° scroll-driven frame scrub with 4 synchronized engineering chapters | Pinned showcase vitrine with chapter selector and spec cards | Sticky 45vh vitrine with touch scrub and stacked cards | Compact vitrine with side chapter panel |
| 3 | `#manifesto` | Typographic thesis on Sant'Agata's choice of natural aspiration at 9,500 RPM | Typographic-only 2-column statement in Geist | Stacked single column | 2-column balanced grid |
| 4 | `#powertrain` | 4-block architecture breakdown of the 6.5L V12, 3 electric motors, and 8-speed DCT | 4 rounded-xl cards with power metrics | 1-column card stack | 2x2 grid |
| 5 | `#aerodynamics` | ALA 2.0 active aerodynamics ledger with Low Drag, High Downforce, and Aero Brake modes | 3 interactive cards with downforce and drag values | Stacked cards | 3-column compact |
| 6 | `#allocation` | Factory configuration console with paint selector, wheel choice, and CLI snippet | 2-column console with interactive swatches | Stacked single column | 2-column console |
| 7 | `#colophon` | Sant'Agata Bolognese coordinates, WLTP homologation data, and legal credits | 4-column structured footer | Stacked blocks | 2-column footer |

## Macro choreographies (4+)
1. Hero load choreography: Staggered smooth fade-in of Geist headline, description, and benchmark metric cards.
2. S2 360° Frame Scrubbing: Scroll-driven canvas frame sequence with critically damped exponential lerp and real-time luma-alpha extraction.
3. Chapter transitions: Animated layout indicator for active chapter tab (`active-chapter-pill`) with synced technical specs.
4. In-template Theme Inversion: Instant switch between Carbon Rosso dark mode and clean porcelain light mode.
5. Pinned vitrine stage: Pinned 3D showcase during scroll while the four chapters update smoothly.

## Micro interactions (12+)
1. In-template theme switcher (Sun/Moon) with smooth rotation.
2. Paint livery selector pills with active ring indicator.
3. Wheel specification toggle with active border.
4. Aerodynamic profile selection tabs with active highlight.
5. Primary button hover lift (`y: -2`) and active press (`scale: 0.98`).
6. Secondary ghost button hover background shift.
7. Copy CLI command button with feedback checkmark.
8. Fullscreen toggle button with icon state change.
9. Touch scrub range slider for manual rotation on mobile.
10. Power unit selector (Metric CV / Power kW).
11. Chapter navigation buttons with smooth scroll-to.
12. Table row hover highlight in specification tables.

## Deleted from the old version (rewrite only)
- Deleted: Big Shoulders Display stretched blocky font, 0px harsh square boxes with heavy 2px borders, fake `//` delimiters, fake degrees `°` and bearing telemetry, fake frame counters, AI orange color, backdrop-blur-2xl blur blobs, animate-pulse ping dots.
- Replaced with: Geist & Geist Mono typography, rounded-xl modern luxury surfaces, Carbon Rosso colorway (#09090b / #dc2626), clean human editorial copy, bug-free dirty-flag canvas frame scrubbing.

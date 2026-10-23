# Identity brief: ironpaw-tools

Save as `.agents/briefs/ironpaw-tools.md`.

## Story (3 lines)
1. Product and visitor: Professional-grade manual and power tools catalog built for contractors, builders, and craftspeople who value raw durability and precision.
2. What the visitor must feel or decide: Feel the unstoppable tactile force of high-torque industrial machinery, smash through doubt, and gear up with a complete equipment kit in one click.
3. Signature moment shows: A cinematic 240-frame 3D raccoon in safety goggles, sneakers, and red sledgehammer leaping in, dropping with heavy momentum to pulverize a watermelon in high-impact glory before the paper catalog takes over.

## Identity (10 axes)
1. Archetype (A-L): L brutalist raw / industrial tool workshop
2. Grid and density: 12-column catalog grid with auto-fill minmax(250px, 1fr), 640svh sticky scrub stage, dense 4-tile paper drawer, gutter 14-20px, section padding 48px to 130px.
3. Display type: 'Inter Tight' (weights 500, 700, 900), uppercase, tracking -0.045em, line-height 0.86 to 0.92. Google Fonts: https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700;900&family=Golos+Text:wght@400;500;600&display=swap
4. Body and aux type: 'Golos Text' (weights 400, 500, 600), tabular-nums for specs, prices and metrics.
5. Palette (hex): 
   - Red: #E10600
   - Red Deep: #B50500
   - Ink: #16110F
   - Paper: #ECEAE5
   - Line: #D0CBC3
   - Muted: #6B645D
   - Sun / Safety Yellow: #FFC21A
   - Backdrop gradient: rgb(118,14,22) to rgb(193,65,58)
6. Surface language (SL1-SL6): SL3 Industrial / Raw Flat paper & ink with hairline borders (#D0CBC3), 6px ink top border on sliding catalog drawer, 20px radius on product cards, 6-8px radius on header controls.
7. Motion personality (M1-M7): M4 Mechanical / Direct. Scroll-driven rAF piecewise linear interpolation without bouncing (damping factor 0.13), cubic-bezier rise masks for hero title, easeOutCubic drawer rise, and scroll-linked SVG hammer rotation (-52deg to -22deg).
8. Signature moment (S-code): S2 3D interactive frame scrubbing with piecewise-linear keyframe mapping (skipping empty frames 72-105), left-edge feathered mask composite, and bottom paper panel drawer takeover at p > 0.84.
9. Copy voice: Direct, tactile, industrial. "Break it. Build it.", "Tool up.", "Shop tools".
10. Imagery treatment: 1024x576 WebP 3D frame sequence rendered onto high-performance 2D canvas with DPR capped at 1.5, feathered into a sampled gradient studio background.

## Collision check
Compared against ledger rows:
- Archetype: L (differs from A, B, C, D, E, F, G, H, I, J, K; matches Revuelto on L, but completely different domain and palette).
- Palette: Red/Paper/Yellow (differs from Revuelto Sand/Olive, differs from Vortex Red Paper by using industrial yellow & paper beige with studio red gradient).
- Display/Body: Inter Tight + Golos Text (unique across all templates).
- Surface: SL3 with 6px ink border drawer and 20px cards.
- Motion: Pure rAF + Canvas (zero motion library), unique piecewise frame skipper.
Axes that differ from closest row: 7 of 10 axes.

## Section sequence (one job each, 5-7)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | Header | Sticky navigation, search, and cart counter | Fixed top pill bar, transparent to solid red at p > 0.9 | Search collapses to icon, cart auto margin | Compact search |
| 2 | Stage (Hero + 3D) | Scroll-scrubbed raccoon hammer smash story | 640svh sticky viewport with 100svh canvas stage | Bottom-aligned raccoon, top hero typography | Centered raccoon 62% width |
| 3 | Drawer (Tool up.) | 4-aisle overview panel sliding up | Paper drawer with 4 category tiles | 2-column tiles, fit content height | 2-column tiles |
| 4 | Catalog (Shop) | Filterable tool grid with instant add-to-cart | Filter chips + responsive minmax(250px, 1fr) grid | 1-column cards, full width buy buttons | 2-column cards |
| 5 | CTA Banner | High-voltage yellow purchase prompt | Safety yellow banner with scroll-rotating outlined sledgehammer | Scaled typography, centered action | Proportional sledgehammer |
| 6 | Footer | Sitemap, support links and legal terms | 4-column dark ink grid | 2-column grid, stacked brand info | 4-column balanced grid |

## Macro choreographies (4+)
1. Canvas 3D Frame Scrubbing: Piecewise linear progress mapping from scroll offset to 240 WebP frames with empty frame skipping (72-105 skipped).
2. Dual-line Masked Headline Slide-up: Hero H1 lines rise from clipped masks using cubic-bezier timing.
3. Bottom Paper Drawer Elevation: Over p: 0.84-1.0, the #ECEAE5 drawer elevates smoothly via easeOutCubic transform.
4. CTA Sledgehammer Scroll Rotation: Huge outlined SVG hammer rotates smoothly between -52deg and -22deg as CTA section scrolls through the viewport.

## Micro interactions (12+)
1. Parallel image preloader bar filling with scaleX.
2. Search input focus glow with backdrop blur.
3. Cart pill bump animation when item added.
4. Hero Aisles card hover link color shift to light red.
5. Dripping scroll indicator line keyframe animation.
6. Drawer tile hover background invert to solid red with white text.
7. Category filter chips hover border change and active red fill.
8. Product card hover lift (-4px translateY) with red glow shadow.
9. "Add to cart" button active state with temporary checkmark and counter bump.
10. Primary pill button hover scale lift (-2px translateY) with black fill.
11. Dripping hint fadeout over p 0 to 0.03.
12. Topbar smooth background transition from transparent to solid red with shadow at p > 0.9.

## Deleted from the old version (rewrite only)
N/A (Brand new template built from scratch).

## Not allowed here (self-check)
No primitives, particles, HUD, toys, pill/kicker, emoji, pulse dots, fake facts, Aerovoid structure. All verified.

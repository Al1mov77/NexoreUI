# Identity brief: psyche-obsidian

## Story (3 lines)
1. Product and visitor: An archival lepidopterology gallery and conservation studio presenting preserved photonic-crystal butterfly specimens (*Morpho*, *Chrysiridia*, *Troides*, *Saturnia*) to natural history curators and private collectors.
2. What the visitor must feel or decide: Experience the full-bleed iridescent wing optics in the hero, inspect the anatomical cross-sections through a sticky scroll-linked dissection, test Bragg's interference law live, and commission a sealed conservation vitrine.
3. Signature moment shows: A pinned sticky split-screen optical dissection with synchronized marginalia annotations (S25) and a live 4-stage interactive cross-section diagram that transforms as the visitor scrolls through the four anatomical chapters (with compact visual cards on mobile).

## Identity (10 axes)
1. Archetype (A-L): B + J hybrid — Full-bleed cinematic video hero leading into a visual specimen index and pinned optical dissection.
2. Grid and density: 12 columns / 24px gutter / 8px base unit / section padding 112px desktop, 80px tablet, 64px mobile.
3. Display type: Gloock (400), loaded via `https://fonts.googleapis.com/css2?family=Gloock&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap` (verified HTTP 200).
4. Body and aux type: Inter (400, 500, 600) for concise copy; IBM Plex Mono (400, 500) for wavelengths, angles, and catalog metrics.
5. Palette (hex): P9/P2 Obsidian & Porcelain.
   - Dark (Obsidian — native): bg `#090D12` / surface `#111720` / line `#1E2938` / text `#ECF1F6` / muted `#8A99AD` / accent `#38BDF8` / accent-ink `#06131F`
   - Light (Porcelain): bg `#F4F6F8` / surface `#FFFFFF` / line `#DCE3EC` / text `#0D1520` / muted `#526275` / accent `#0284C7` / accent-ink `#FFFFFF`
6. Surface language (SL1-SL6): SL2 Soft cards — radius 16px to 20px on cards and interactive panels (`rounded-2xl`), 10px to 12px on buttons and controls (`rounded-xl`), 1px subtle border (`#1E2938` dark / `#DCE3EC` light), soft layered elevation shadow.
7. Motion personality (M1-M7): M3 Editorial — tween in-out-quart `[0.76, 0, 0.24, 1]` at `0.85s` for reveals, scroll-linked sticky stage transforms, and `[0.22, 1, 0.36, 1]` at `0.45s` for shared-layout tabs and card transitions.
8. Signature moment (S-code): S25 Marginalia & Optical Dissection Stage. A tall scroll-tracked sticky showcase where scrolling progresses through 4 optical scales (Macro Wing -> Cover Scales -> 180 nm Chitin Ridges -> Melanin Substrate), morphing a multi-layer anatomical SVG diagram and its paired marginalia callout card in real time.
9. Copy voice: Concise, visual, scientific. Sample headline: "Structural color born from light and geometry." Sample button label: "Configure Vitrine".
10. Imagery treatment: Full-bleed `100svh` hero video (`/videos/psyche-obsidian-atelier.mp4`, poster `/images/psyche-obsidian-poster.jpg`) with `disablePictureInPicture`, directional bottom/left scrim, and interactive spectral cards with custom SVG optical plates.

## Collision check
Compared against ledger rows:
- Differs from every completed template on 6+ axes (Display T16 Gloock, S25 Marginalia + Optical Dissection, SL2 soft cards with Obsidian/Porcelain palette, M3 editorial motion, Bragg optical bench).

## Section sequence (one job each, 5 sections)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | Full-Bleed Video Hero & Floating Header | Immerse the visitor in the *Morpho* wing video with floating translucent nav, Obsidian/Porcelain theme switcher, illumination mode selector, and 4-column glass metric strip | `100svh` full-bleed background video with bottom-left editorial display title and bottom metric bar | `92svh` full-bleed portrait video crop, compact top bar with drawer, 2x2 metric grid at bottom | `100svh` full-bleed video with 2-row controls and 4-column metric bar |
| 2 | Pinned Optical Dissection & Marginalia (Signature S25) | Visually dissect the 4 physical layers of structural iridescence as the user scrolls | 280vh sticky split-screen: left sticky interactive SVG optical microscope + marginalia card; right 4 concise visual step cards | Vertical sequence of 4 visual diagram cards with interactive stage switcher tabs | Sticky 50/50 split with live stage diagram and marginalia note |
| 3 | Interactive Bragg Lattice Workbench | Let the visitor drag incident angle `θ` and ridge spacing `d` to see live ray diffraction and spectral shift | 7/5 rounded-2xl instrument studio: live SVG ray-tracing schematic with spectrum bar on left, tactile sliders + specimen presets on right | Stacked rounded-2xl card: SVG ray schematic on top, sliders and preset pills below | 6/6 split instrument cards |
| 4 | Visual Specimen Gallery & Detail Inspector | Compare 5 preserved Lepidoptera species with visual spectral swatches, wing scale geometry diagrams, and one-click bench loading | Asymmetric 5-column selector list + 7-column rich visual specimen showcase card (`layoutId` selection) | Horizontal snap/tab selector with rich visual specimen card below | 5/7 split gallery with animated detail panel |
| 5 | Hermetic Vitrine Configurator & Live Preview | Configure the physical titanium/quartz/argon enclosure with a live visual vitrine diagram and instant commissioning | 6/6 split: left interactive visual vitrine blueprint + live specs; right rounded-xl option cards and 1-step request | Visual vitrine preview card on top, option selectors and submit button below | 6/6 split vitrine preview and configurator |

## Macro choreographies (4+)
1. **Hero scroll-leave video & typography choreography:** Nearest-scroller `useScrollProgress(heroRef, "leave")` scales the full-bleed background video (`1 -> 1.12`) and shifts the hero title block upward with fade.
2. **Pinned scroll-linked 4-stage optical dissection (S25):** `useScrollProgress(dissectionRef, "track")` drives the active anatomical stage (01–04), smoothly morphing the SVG microscope zoom, highlighting active chitin lamellae, and updating the marginalia annotation card.
3. **Scroll-linked spectral ribbon & header progress:** Top progress bar and section reveal masks animate with M3 editorial easing `[0.76, 0, 0.24, 1]`.
4. **Shared-layout (`layoutId`) gallery & configurator transitions:** Switching specimens, illumination modes, or theme modes smoothly glides active indicators and crossfades visual specimen plates (`AnimatePresence mode="wait"`).

## Micro interactions (12+)
1. In-template `Obsidian` (Dark) / `Porcelain` (Light) theme switcher with `layoutId` pill and instant palette transition.
2. Hero illumination mode switcher (`Solar 33°`, `Grazing 52°`, `Amber Cuticle`) with `layoutId` indicator and live video atmospheric tint.
3. Navigation link hover underline draw (`scaleX` origin-left to origin-right).
4. Dissection stage quick-jump pills (`01 Macro` to `04 Melanin`) with `layoutId` active state.
5. Marginalia citation copy button with icon morph (`Copy` -> `Check`).
6. Bragg incident angle (`θ`) slider with live ray rotation and dynamic wavelength badge.
7. Bragg lamellar period (`d`) slider with real-time shelf expansion in the SVG schematic.
8. Visible spectrum ruler (380–750 nm) with animated cursor marker tracking `λ`.
9. Specimen gallery cards with hover elevation, spectral bar fill, and `layoutId` active border.
10. "Test in Bragg Workbench" button that loads specimen `d` and `θ` and scrolls smoothly to the workbench.
11. Vitrine material selector cards (Frame, Glazing, Gas) with live blueprint layer highlights and mass/price calculation.
12. Commission submit button with `AnimatePresence` confirmation state.

## Deleted from the old version (rewrite only)
- Replaced boxed 4:5 video card with a full-bleed `100svh` background video hero (`disablePictureInPicture`) so no browser PiP overlay spoils the composition.
- Replaced text-heavy essay and plain text manifesto blocks with visual interactive sections (pinned SVG dissection stage, interactive specimen gallery with visual wing-scale plates, and live vitrine blueprint).
- Replaced sharp 0px corners and dull brownish dark mode with SL2 rounded cards (`rounded-2xl` / `rounded-xl`) and a deep Obsidian sapphire-charcoal dark theme (`#090D12` / `#111720` / `#38BDF8`).

## Not allowed here (self-check)
No primitives, particles, HUD, toys, pill/kicker, emoji, pulse dots, fake facts, Aerovoid structure.

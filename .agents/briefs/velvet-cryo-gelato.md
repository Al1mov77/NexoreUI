# Identity brief: velvet-cryo-gelato

Save as `.agents/briefs/velvet-cryo-gelato.md`. Fill every line. No blanks.

## Story (3 lines)
1. Product and visitor: Velvet Gelato is a sub-zero small-batch gelato confectioner using low-overrun rotary cryogenic churns, grass-fed Jersey cream, and pure Sicilian fruit and nuts; the visitor is a food epicure or dessert connoisseur ordering fresh tubs or booking an intimate tasting flight.
2. What the visitor must feel or decide: Feel the warmth of artisanal craft paired with cold culinary discipline, explore flavors, configure a bespoke tasting box with real ingredient and price updates, and reserve a tasting session.
3. Signature moment shows: S14 Configurator changing real content, where visitors customize flavor, tub format, and topping crunches, watching price, ingredients, temperature advice, and tasting notes update live.

## Identity (10 axes)
1. Archetype (A-L): H Bento (desktop: pill-less top nav with integrated theme switcher, editorial headline, 5-tile bento grid combining authentic video, flavor origin, dairy specs, and atelier hours; mobile: 2-column compact bento collapsing into focused touch cards).
2. Grid and density: Desktop 12 columns with 20px gutter, 28px card radius, 8pt base unit, section vertical padding 88px desktop / 56px mobile.
3. Display type (family, weights or axes, Google Fonts URL, verified 200): Young Serif, regular weight 400. Google Fonts URL: `https://fonts.googleapis.com/css2?family=Young+Serif&family=Albert+Sans:wght@400;500;600;700&display=swap`, verified 200.
4. Body and aux type: Albert Sans (weights 400, 500, 600, 700) for all body copy, specifications, and button labels.
5. Palette (hex): P16 Citrus Cream. Light (native default) and Dark:
   - Light (native): bg #FBF5DC / surface #F3EBC6 / line #E3D8A8 / text #14213D / muted #5F6678 / accent #C25916 / accent-ink #FFFFFF.
   - Dark: bg #121624 / surface #1B2032 / line #2C334D / text #FBF5DC / muted #949EBA / accent #E87A38 / accent-ink #121624.
6. Surface language (SL1-SL6): SL5 Pill-forward (radius 999 for interactive chips and buttons, 28px rounded corners for bento tiles, soft 1px border lines, gentle organic surfaces).
7. Motion personality (M1-M7): M2 Soft (spring stiffness 170, damping 26, mass 1; reveal fade plus 16px rise 0.9s ease [0.22, 1, 0.36, 1]; hover lift 3px, press scale 0.97; touch-native tap feedback).
8. Signature moment (S-code), mechanism, real content it acts on, mobile fallback: S14 Configurator changing real content. Interactive tabs and chip controls update flavor profile, container format, toppings, and notes with synchronized live price and spec updates; touch-friendly mobile layout uses full-width radio cards and sticky order preview.
9. Copy voice: Warm, sensory, culinary realism; sample headline: "Sub-zero churned cream, sculpted with cold air"; sample button: "Add to tasting order".
10. Imagery treatment: Soft rounded 24px and 28px card containers, 1px subtle line borders, authentic video from `/videos/velvet-cryo-gelato.mp4` with muted playsInline and poster fallback.

## Collision check
Compared against ledger rows:
- Aerovoid Obsidian (legacy, dark/amber, SL6, legacy, exploded layers): differs on all 10 axes.
- Vortex Apex (C Swiss poster, Archivo, P4 Signal Red, SL1, M4, S1): differs on archetype (H vs C), type (T14 vs T15), palette (P16 vs P4), surface (SL5 vs SL1), motion (M2 vs M4), signature (S14 vs S1) -> 6 axes.
- Chrono X Titanium (K ceremonial, Cormorant, P2 Midnight Ledger, SL1, M1, S4): differs on archetype, type, palette, surface, motion, signature -> 6 axes.
- Ferrari Nocturne (B full-bleed, Syne, P17, SL4, M5, S16): differs on archetype, type, palette, surface, motion, signature -> 6 axes.
- Aura Nocturne (A editorial, Instrument Serif, P7, SL2, M2, S11): differs on archetype (H vs A), type (T14 vs T2), palette (P16 vs P7), surface (SL5 vs SL2), signature (S14 vs S11) -> 5 axes.
- Aura Obsidian (E stacking, Newsreader, P3, SL4, M3, S9): differs on archetype, type, palette, surface, motion, signature -> 6 axes.
- Levitas Cryo (F lookbook, Inter Tight, P6 Glacier, SL2, M1, S5): differs on archetype (H vs F), type (T14 vs T3), palette (P16 vs P6), surface (SL5 vs SL2), motion (M2 vs M1), signature (S14 vs S5) -> 6 axes.
- Nex Portfolio (J index, Inter Tight, P14 Steel, SL2, M1, S6): differs on archetype, type, palette, surface, motion, signature -> 6 axes.
Axes that differ from closest row: 5+ axes. No collision.

## Section sequence (one job each, 5-7)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | `#hero` | Present brand thesis and core product bento | 12-column Bento grid with embedded video, active flavor, dairy spec, churn metrics, and atelier hours | Stacked bento cards with responsive video | 2-column bento cards |
| 2 | `#philosophy` | State culinary thesis and low-overrun freezing technique | Pure typographic two-column editorial split with large serif statement and dairy facts | Single-column text stack | 2-column compact split |
| 3 | `#configurator` | Signature S14: Configure custom gelato order with live real content updates | Interactive 2-column studio: flavor, format, and crunch selection on left; live order card, nutrition, and price on right | Vertical stack with sticky order bar | 2-column balanced stage |
| 4 | `#process` | Detail 3-phase cryogenic churning method | Horizontal sequential process strip with milestone steps and temperatures | Vertical timeline with progress indicators | 3-column process strip |
| 5 | `#degustation` | Present tasting room flights and table reservation | 2-column split with tasting sessions catalog on left and reservation form on right | Single-column booking stack | 2-column compact form |
| 6 | `#colophon` | Provide atelier address, hours, allergen policy, and CLI install command | 4-column structured colophon with one-click terminal copy | 2-column mobile footer | 4-column compact footer |

## Macro choreographies (4+)
1. Hero Bento load choreography: Staggered entrance of the 5 bento tiles using M2 soft spring tokens.
2. Scroll progress line: 1px hairline indicator at the top of the viewport tracking scroll depth via scaleX.
3. Shared layout transition: Framer Motion `layoutId` indicator smoothly sliding behind selected flavor, container size, and guest count buttons.
4. Process step scroll reveal: Each stage in the 3-phase cryogenic sequence rises 16px with soft opacity reveal as it enters view.

## Micro interactions (12+)
1. On-page theme toggle (Sun/Moon) in header and floating bottom-right dock.
2. Flavor selector chip with active outline and soft lift.
3. Tub format selector pill with `layoutId` sliding background.
4. Topping crunch selector radio chip with check icon.
5. Quantity counter stepper (- / +) with tabular numerals.
6. "Add to Order" action button with animated checkmark confirmation using `AnimatePresence`.
7. Video play/pause toggle button on the hero video tile.
8. Tasting flight catalog item selection with active line highlight.
9. Guest count selector pills with active selection ring.
10. Reservation date chip selector.
11. One-click CLI command copy button with copied confirmation feedback.
12. Reservation confirmation button with tap scale (0.97) and status feedback.
13. Navigation anchor links with smooth scroll to sections.

## Deleted from the old version (rewrite only)
What slop was removed and which true facts were kept:
- Deleted: Banned words ("haute", "seamless", "curated", "bespoke atelier", "supercharge").
- Deleted: Accent-to-slate gradient buttons (`linear-gradient(135deg, ${accent}, #0f172a)`).
- Deleted: Pulsing/pinging elements (`animate-ping`, `animate-pulse`).
- Deleted: Blur blobs (`backdrop-blur-2xl`, `blur-[22px]`).
- Deleted: Pill kickers above headings (`rounded-full` uppercase badges).
- Deleted: Fake telemetry ("3.8-micron silk mouthfeel", "Laboratory Telemetry Ribbon", "allocatedCount" fake scarcity).
- Deleted: Middle-dot generated copy separators (`•`).
- Deleted: AmbientAudioEngine sound synthesizer.
- Kept: Real video `/videos/velvet-cryo-gelato.mp4`, authentic flavors (Bronte Pistachio, Smoked Salted Toffee, Dark Ruby Cacao), real -14°C sub-zero churn temperature, pure ingredients (grass-fed Jersey cream, fleur de sel, single-origin cacao).

## Not allowed here (self-check)
No primitives, particles, HUD, toys, pill/kicker, emoji, pulse dots, fake facts, Aerovoid structure.

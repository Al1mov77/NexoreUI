# Identity brief: aura-obsidian

Save as `.agents/briefs/aura-obsidian.md`. Fill every line. No blanks.

## Story (3 lines)
1. Product and visitor: Aura Obsidian Botanica is a phyto-lipid laboratory formulating three pure, cold-pressed botanical crus in UV-filtering obsidian glass; the visitor is a dermatologist, cosmetic formulator, or patron seeking unadulterated lipid chemistry without emulsifiers or synthetic carriers.
2. What the visitor must feel or decide: Feel the unhurried authority of restorative botanical craft, inspect active fatty-acid and terpene compositions across three terroir harvests, and reserve an allocation flacon.
3. Signature moment shows: S9 Stacking sheets where full-height botanical specimen sheets pin and scale down deliberately under M3 Editorial easing as subsequent sheets slide into place.

## Identity (10 axes)
1. Archetype (A-L): E Stacking sheets (floating minimal top bar, hero as first specimen sheet, each chapter a full-height pinned sheet with tonal surface stepping, mobile transforms to sticky compact headers with natural card stacking).
2. Grid and density: Desktop 12 columns, 24px gutter, 8pt base unit, section vertical padding 96px desktop / 64px mobile.
3. Display type: Newsreader (ital, opsz, wght 300..700), Google Fonts URL: `https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Schibsted+Grotesk:wght@400;500;600&display=swap`, verified 200.
4. Body and aux type: Schibsted Grotesk (weights 400, 500, 600) for body, specifications, navigation, and tabular data.
5. Palette (hex): P3 Moss & Cream (native light theme, dark variant provided).
   - Light (native default): bg #EEF0E4 / surface #E2E6D2 / line #CBD1B6 / text #1C2418 / muted #5E6955 / accent #2F5D3A / accent-ink #F2F6EA.
   - Dark: bg #121711 / surface #1A2119 / line #2B3629 / text #ECEFE8 / muted #8A9684 / accent #4E875C / accent-ink #0E140D.
6. Surface language (SL1-SL6): SL4 Tonal layers (radius 16px to 24px, no heavy borders or specular highlights, depth achieved through tonal stepping between bg and surface, soft hairline divisions).
7. Motion personality (M1-M7): M3 Editorial (cubic-bezier [0.76, 0, 0.24, 1] in-out-quart, durationNormal 0.65s, durationSlow 0.9s, clip-path inset reveals, line-mask text rises, hover image scale 1.03 inside mask, press tap feedback).
8. Signature moment (S-code), mechanism, real content it acts on, mobile fallback: S9 Stacking sheets. Pinned container layers scale to 0.96 and dim slightly as user scrolls down, revealing next botanical chapter; mobile fallback preserves sticky top headers and clean sequential card layering.
9. Copy voice: Literary, technical, restrained; real botanical chemistry without pseudoscience; sample headline: "Pure botanical lipids, unheated and unfiltered"; sample button: "Reserve flacon allocation".
10. Imagery treatment: Editorial 16:9 and 4:5 crops, subtle moss-toned masks, authentic video from `/videos/aura-obsidian-botanica.mp4` with muted playsInline and poster fallback.

## Collision check
Compared against ledger rows:
- Aerovoid Obsidian (legacy, dark/amber, SL6, exploded layers): differs on archetype (E vs legacy), type (T10 vs legacy), palette (P3 vs dark amber), surface (SL4 vs SL6), motion (M3 vs legacy), signature (S9 vs exploded) -> 6 axes.
- Vortex Apex (C, T15, P4, SL1, M4, S1): differs on archetype (E vs C), display (T10 vs T15), palette (P3 vs P4), surface (SL4 vs SL1), motion (M3 vs M4), signature (S9 vs S1) -> 6 axes.
- Chrono X Titanium (K, T9, P2, SL1, M1, S4): differs on archetype (E vs K), display (T10 vs T9), palette (P3 vs P2), surface (SL4 vs SL1), motion (M3 vs M1), signature (S9 vs S4) -> 6 axes.
- Ferrari Nocturne (B, T13, P17, SL4, M5, S16): differs on archetype, display, palette, motion, signature -> 5 axes.
- Levitas Cryo (F, T3, P6, SL2, M1, S5): differs on archetype, display, palette, surface, motion, signature -> 6 axes.
- Aura Nocturne (A, T2, P7, SL2, M2, S11): differs on archetype, display, palette, surface, motion, signature -> 6 axes.
Axes that differ from closest row: 5+ axes. No collision.

## Section sequence (one job each, 5-7)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | `#hero` | Present thesis and living botanical specimen video | Asymmetric 7/5 split sheet with large Newsreader serif and video window | Stacked sheet with full-width video | 7/5 split compact |
| 2 | `#extraction` | Explain the 3 physical cold-extraction methods | Ruled 3-column asymmetric process ledger with extraction metrics | Stacked single-column ledger | 3-column ruled grid |
| 3 | `#atlas` | S9 Core: Interactive formulation deep dive across 3 Crus | Tabbed formulation atlas with active layoutId indicator and lipid profile | Stacked cards with tab selector | Side-by-side tabbed view |
| 4 | `#vessels` | Present obsidian glass UV-filtration and 3 flacon sizes | 3-column vessel comparison with real volumes and prices | Stacked vessel cards | 3-column compact grid |
| 5 | `#reserve` | Convert: Select formulation, flacon volume, and confirm allocation | Split allocation desk with quantity counter, pricing summary, and CLI copy | Stacked single-column desk | 2-column desk |
| 6 | `#colophon` | Provide laboratory locations, ethical harvest ethics, and colophon | 4-column structured editorial colophon | 2-column grid | 4-column compact grid |

## Macro choreographies (4+)
1. Hero load choreography: Staggered line-mask reveal of serif headline and supporting copy on entry.
2. S9 Stacking sheets: Sticky pinning and scroll-driven scale (1 to 0.96) / dimming between sheets.
3. Clip-path reveal: Specimen video and image frames wipe smoothly from `inset(0 0 100% 0)` to `inset(0 0 0% 0)`.
4. Shared layout transition: Framer Motion `layoutId` indicator slides between active formula crus and flacon choices.
5. Header scroll hairline: Hairline progress indicator along the bottom of the navigation bar.

## Micro interactions (12+)
1. Magnetic primary CTA button with gentle press feedback (`whileTap={{ scale: 0.98 }}`).
2. Formula selector pill with smooth `layoutId="active-formula-pill"` slide.
3. Flacon size switcher with `layoutId="active-flacon-pill"` indicator.
4. Copy CLI command button with animated icon swap (`Terminal` to `Check`).
5. Button label swap with `AnimatePresence mode="wait"` on allocation order placement.
6. Link hover underline drawing from left to right with CSS scaleX.
7. Focus-visible ring styled with 2px offset for keyboard navigation.
8. Interactive video play/pause toggle button with state change.
9. Interactive fullscreen toggle button for specimen viewing.
10. Allocation quantity decrement and increment buttons with boundary validation.
11. Table row hover highlight with soft tonal wash.
12. Specimen card hover scale (`whileHover={{ scale: 1.02 }}`) inside overflow-hidden container.

## Deleted from the old version (rewrite only)
What slop was removed and which true facts were kept:
- Deleted: Banned words ("haute", "bespoke atelier", "reimagined").
- Deleted: Decorative blur blobs (`backdrop-blur-2xl`, `blur-[...]`).
- Deleted: Accent-to-slate gradient buttons (`linear-gradient(135deg, ${accent}, #0f172a)`).
- Deleted: Pulsing/pinging status dots (`animate-pulse`, `animate-ping`).
- Deleted: Kicker / pill labels above headings (`rounded-full uppercase` kickers).
- Deleted: Middle-dot separators (` • `).
- Deleted: Invented telemetry and fake laboratory claims ("telemetry", "Purity: 99.98%", "Temp: 21°C", fake coords).
- Deleted: Fake scarcity ("only 28 allocations left", countdown counters).
- Kept: Real botanical formulations (Wild Marula & Gold Camellia, Black Truffle & Sea Buckthorn, Blue Tansy & Squalane), real video `/videos/aura-obsidian-botanica.mp4`, realistic flacon sizes (30ml, 50ml, 100ml) and prices ($145, $210, $340), and working CLI command.

## Not allowed here (self-check)
No primitives, particles, HUD, toys, pill/kicker, emoji, pulse dots, fake facts, Aerovoid structure.

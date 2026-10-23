# Identity brief: aura-nocturne

Save as `.agents/briefs/aura-nocturne.md`. Fill every line. No blanks.

## Story (3 lines)
1. Product and visitor: Aura Nocturne Extrait is an independent perfume laboratory distilling rare botanical resins, wild Kalimantan agarwood, and Grasse centifolia rose into 32% extraits de parfum; the visitor is an olfactive connoisseur or design collector seeking concentrated extraits crafted without synthetic emulsifiers or rapid distillation.
2. What the visitor must feel or decide: Feel the patient, nocturnal warmth of slow-macerated botanicals, evaluate note pyramids and maceration specs across three distinct extraits, and select a flacon allocation.
3. Signature moment shows: S11 Word-by-word text scrub where an olfactive formulation thesis illuminates smoothly word by word as the user scrolls, paired with formulation parameters in the margin.

## Identity (10 axes)
1. Archetype (A-L): A Editorial split (wordmark and minimalist text nav with hairline; 7/5 hero with large serif headline and 4:5 framed video crop; alternating text columns with marginal notes, pull quotes, two-column spec breakdown; mobile renders 4:5 video first, headline below, marginal notes inline).
2. Grid and density: 12 columns, 24px gutter, 8pt base unit, section vertical padding 96px desktop / 64px mobile.
3. Display type (family, weights or axes, Google Fonts URL, verified 200): Instrument Serif (`family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600&display=swap`), Google Fonts URL verified 200.
4. Body and aux type: Instrument Sans (weights 400, 500, 600) for body, captions, notes, and buttons.
5. Palette (hex): P7 Terracotta Clay
   - Light (native default): bg #F1E6DA / surface #E7D8C8 / line #D3BFA9 / text #2A1A12 / muted #7A6354 / accent #A8432A / accent-ink #FFF3EA.
   - Dark variant: bg #1A120E / surface #261B15 / line #3D2C24 / text #F1E6DA / muted #9E8777 / accent #D96547 / accent-ink #1A120E.
6. Surface language (SL1-SL6): SL2 Soft cards (radius 18px-24px, 1px hairline border at low contrast using line token, layered soft shadow 0 1px 2px rgba(42,26,18,0.05), 0 12px 32px -12px rgba(42,26,18,0.12)).
7. Motion personality (M1-M7): M2 Soft (warm, unhurried; spring: { stiffness: 170, damping: 26, mass: 1 }; tween ease: [0.22, 1, 0.36, 1]; duration: normal 0.9s, fast 0.3s; hover lift 3px; press scale 0.97).
8. Signature moment (S-code), mechanism, real content it acts on, mobile fallback: S11 Word-by-word text scrub. A formulation thesis paragraph calculates word-level opacity [0.2 -> 1.0] based on scroll progress of the container, illuminating each word in sequence. Touch and mobile retain natural scroll-linked illumination; reduced-motion defaults to 1.0 opacity.
9. Copy voice: Ceremonial, sensory, precise; sample headline: "Concentrated extraits born of night and resin"; sample button: "Acquire flacon allocation".
10. Imagery treatment: Soft-cornered 4:5 and 16:9 crops (radius 18px), hairline terracotta line borders, authentic video /videos/aura-nocturne-perfume.mp4 with muted playsInline and poster fallback.

## Collision check
Compared against ledger rows:
- Aerovoid Obsidian (legacy, dark/amber, SL6, exploded layers): differs on Archetype (A vs legacy), Type (T2 vs legacy), Palette (P7 vs dark amber), Surface (SL2 vs SL6), Motion (M2 vs legacy), Signature (S11 vs exploded) -> 6 axes.
- Aura Obsidian (E, T10, P3, SL4, M3, S9): differs on Archetype (A vs E), Display (T2 vs T10), Palette (P7 vs P3), Surface (SL2 vs SL4), Motion (M2 vs M3), Signature (S11 vs S9) -> 6 axes.
- Levitas Cryo (F, T3, P6, SL2, M1, S5): differs on Archetype (A vs F), Display (T2 vs T3), Palette (P7 vs P6), Motion (M2 vs M1), Signature (S11 vs S5) -> 5 axes.
- Vortex Apex (C, T15, P4, SL1, M4, S1): differs on Archetype (A vs C), Display (T2 vs T15), Palette (P7 vs P4), Surface (SL2 vs SL1), Motion (M2 vs M4), Signature (S11 vs S1) -> 6 axes.
- Chrono X Titanium (K, T9, P2, SL1, M1, S4): differs on Archetype (A vs K), Display (T2 vs T9), Palette (P7 vs P2), Surface (SL2 vs SL1), Motion (M2 vs M1), Signature (S11 vs S4) -> 6 axes.
- Stayline (A, T17, P18, SL2, M3, S12): differs on Display (T2 vs T17), Palette (P7 vs P18), Motion (M2 vs M3), Signature (S11 vs S12) -> 4 axes (differs on core design expression).
Axes that differ from closest row: 5+ axes across archetype, display, palette, motion, and signature. No collision.

## Section sequence (one job each, 5-7)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | `#hero` | Present the perfume extrait maison and motion film of the flacon | Editorial 7/5 split with Instrument Serif display and 4:5 video window | Video 4:5 first, headline below | 6/6 split compact |
| 2 | `#manifesto` | S11 Signature: Olfactive formulation philosophy word-by-word text scrub | Sticky tracked text scrub with marginal distillation metrics | Stacked inline text scrub | Compact split scrub |
| 3 | `#collection` | Interactive exploration of the three extraits with note pyramids | 2-column formulation studio with active layoutId tabs | Stacked layout with tab selector | 2-column studio |
| 4 | `#distillation` | Explain the 3 physical extraction stages without marketing jargon | 3-column asymmetric process grid with stage durations | Stacked stage cards | 3-column compact |
| 5 | `#acquisition` | Select flacon volume, specify allocation quantity, and reserve | Split allocation console with live pricing and CLI snippet | Stacked console | 2-column console |
| 6 | `#colophon` | Provide atelier coordinates, distillation ethics, and colophon | 4-column structured colophon | 2-column grid | 4-column compact |

## Macro choreographies (4+)
1. Hero load choreography: Staggered line-mask reveal of Instrument Serif display headline, lead paragraph, and soft clip-in of the 4:5 flacon film.
2. S11 Word-by-word text scrub: Scroll progress mapped to individual word illumination opacity across the formulation thesis.
3. Shared layout transitions: Animated Framer Motion layoutId pill indicators for extrait selection (`active-extrait-tab`) and flacon volume selection (`active-flacon-tab`).
4. Clip-path reveals: Smooth inset reveals for distillation stage panels and imagery frames.
5. Sticky header scroll line: Hairline indicator measuring scroll progress across the top navigation bar.

## Micro interactions (12+)
1. Primary CTA press feedback (`whileTap={{ scale: 0.97 }}`).
2. Primary CTA hover lift (`whileHover={{ y: -3 }}`).
3. Tab selector slide via Framer Motion `layoutId="active-extrait-indicator"`.
4. Flacon volume selector slide via `layoutId="active-flacon-indicator"`.
5. Order button label swap with `AnimatePresence mode="wait"` upon reservation confirmation.
6. Copy CLI command feedback with icon swap (`Terminal` to `Check`).
7. Allocation quantity increment and decrement buttons with boundary validation (1 to 6 flacons).
8. Header navigation link hover with smooth underline expansion from left to right.
9. Focus-visible rings on interactive buttons and inputs with 2px offset for keyboard accessibility.
10. Interactive video playback toggle (Play/Pause button on the flacon specimen).
11. Interactive video fullscreen / expand toggle.
12. Olfactive note card hover lift (`whileHover={{ y: -3 }}`) with subtle shadow expansion.

## Deleted from the old version (rewrite only)
What slop was removed and which true facts were kept:
- Deleted: Banned words ("haute", "bespoke atelier", "seamless", "reimagined").
- Deleted: Decorative blur blobs (`backdrop-blur-2xl`, glowing orb layers).
- Deleted: Accent-to-slate gradient buttons (`linear-gradient(135deg, ${accent}, #0f172a)`).
- Deleted: Pulsing/pinging elements (`animate-pulse`, `animate-ping`).
- Deleted: Kicker / pill labels above headings (`rounded-full uppercase` kickers).
- Deleted: Middle-dot separators (` • `).
- Deleted: Invented telemetry and fake metrics ("telemetry", "Temp: 31°C", fake coordinates).
- Deleted: Fake scarcity ("only 24 left", countdown timer).
- Kept: Real extraits (Kyara Oudh, Solar Bergamot, Rose Fumée), authentic video asset `/videos/aura-nocturne-perfume.mp4`, realistic flacon sizes (30ml, 50ml, 100ml) and prices ($185, $280, $460), real note pyramids and maceration durations.

## Not allowed here (self-check)
No primitives, particles, HUD, toys, pill/kicker, emoji, pulse dots, fake facts, Aerovoid structure.

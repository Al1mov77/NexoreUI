# Identity brief: zenith-elixir

Save as `.agents/briefs/zenith-elixir.md`. Fill every line. No blanks.

## Story (3 lines)
1. Product and visitor: Zenith Botanical Elixir is a slow-crafted botanical tea atelier cold-infusing rare first-flush Camellia Sinensis, high-altitude Uji Gyokuro, and wild mountain florals at sub-zero temperatures (2.2°C) without synthetic additives or artificial extracts; the visitor is an epicurean collector, tea sommelier, or design-conscious connoisseur seeking restorative botanicals with authentic L-theanine profiles.
2. What the visitor must feel or decide: Feel the unhurried serenity and botanical purity of cold-macerated infusions, examine three specific botanical profiles (Jade Gyokuro, Amber Oolong, Highland Orchid), follow the physical slow-brewing extraction timeline, and reserve a hand-sealed decanter.
3. Signature moment shows: S21 SVG path timeline where an organic winding botanical path draws as the user scrolls, lighting up 4 authentic cold-infusion milestones with stage temperatures, durations, and physical processes.

## Identity (10 axes)
1. Archetype (A-L): G Single-column manifesto (centered small wordmark with links and in-template theme switcher; clean, deliberate manifesto column that expands into structured specification cards and an authentic cold-brew video window; asymmetric process steps; mobile renders single full-width column with touch-safe controls).
2. Grid and density: Single manifesto column (max 720px reading width, max 1152px overall container), vertical rhythm py-24 to py-32 desktop, py-14 to py-18 mobile, 20px side padding.
3. Display type (family, weights or axes, Google Fonts URL, verified 200): Geist (`family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap`), Google Fonts URL verified 200.
4. Body and aux type: Geist for body, Geist Mono for metadata, labels, status badges, and CLI snippets.
5. Palette (hex): Dark-White Zinc Monochrome (shadcn style):
   - Light (native): bg #ffffff / surface #fafafa / surfaceRaised #f4f4f5 / line #e4e4e7 / text #09090b / muted #71717a / accent #18181b / accent-ink #fafafa / badge #059669.
   - Dark variant: bg #09090b / surface #121215 / surfaceRaised #18181b / line #27272a / text #fafafa / muted #a1a1aa / accent #fafafa / accent-ink #09090b / badge #10b981.
6. Surface language (SL1-SL6): SL1 Hairline flat / shadcn (radius 8px-12px, 1px subtle hairline border using line token, minimal shadow-sm, crisp 1px dividers).
7. Motion personality (M1-M7): M1 Precise (tight, instrument feel; spring: { stiffness: 180, damping: 28, mass: 1 }; tween ease: [0.16, 1, 0.3, 1]; duration: normal 0.45s, fast 0.2s; hover opacity / scale 0.98; press scale 0.95).
8. Signature moment (S-code), mechanism, real content it acts on, mobile fallback: S21 SVG path timeline with real physical extraction stages (Harvest, 18H Sub-Zero Infusion, Micro-Filtration, Hermetic Bottling). As you scroll, the SVG line draws with scroll progress and milestone nodes illuminate. Mobile fallback: linear vertical track with progressive reveal. Reduced-motion fallback: static path (pathLength: 1) with all stages visible.
9. Copy voice: Direct, sensory, precise botanical facts without banned marketing words; sample headline: "Botanical purity brewed at two degrees"; sample button: "Reserve decanter".
10. Imagery treatment: Real video asset /videos/zenith-tea-elixir.mp4 with muted autoPlay loop playsInline preload="metadata", organic radial and linear edge vignette scrim blending into the background canvas so it doesn't look like a raw rectangular video embed, with laboratory specimen overlay tag and minimalist controls.

## Collision check
Compared against ledger rows:
- Aerovoid Obsidian (legacy, dark/amber, SL6, exploded layers): differs on Archetype (G vs legacy), Type (T1 vs legacy), Palette (White-Emerald vs dark amber), Surface (SL2 vs SL6), Motion (M2 vs legacy), Signature (S21 vs exploded) -> 6 axes.
- Aura Nocturne (A, T2, P7, SL2, M2, S11): differs on Archetype (G vs A), Type (T1 vs T2), Palette (White-Emerald vs P7), Signature (S21 vs S11), Voice -> 5 axes.
- Aura Obsidian (E, T10, P3, SL4, M3, S9): differs on Archetype (G vs E), Type (T1 vs T10), Palette (White-Emerald vs P3), Surface (SL2 vs SL4), Motion (M2 vs M3), Signature (S21 vs S9) -> 6 axes.
- Levitas Cryo (F, T3, P6, SL2, M1, S5): differs on Archetype (G vs F), Type (T1 vs T3), Palette (White-Emerald vs P6), Motion (M2 vs M1), Signature (S21 vs S5) -> 5 axes.
- Velvet Gelato (H, T14, P16, SL5, M2, S14): differs on Archetype (G vs H), Type (T1 vs T14), Palette (White-Emerald vs P16), Surface (SL2 vs SL5), Signature (S21 vs S14) -> 5 axes.
- Vortex Apex (C, T15, P4, SL1, M4, S1): differs on Archetype (G vs C), Type (T1 vs T15), Palette (White-Emerald vs P4), Surface (SL2 vs SL1), Motion (M2 vs M4), Signature (S21 vs S1) -> 6 axes.
- Stayline (A, T17, P18, SL2, M3, S12): differs on Archetype (G vs A), Type (T1 vs T17), Palette (White-Emerald vs P18), Motion (M2 vs M3), Signature (S21 vs S12) -> 5 axes.
Axes that differ from closest row: 5+ axes across archetype, display, palette, motion, and signature. No collision.

## Section sequence (one job each, 5-7)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | `#hero` | Introduce the botanical tea atelier, statement headline in Fraunces, and cold-brew video window | Centered manifesto hero with video frame | Video 16:9 full width, stacked action | Compact centered hero |
| 2 | `#manifesto` | Unhurried single-column botanical thesis: cold water physics, preservation of volatile terpenes | Focused 680px column with quote accents | 100% width with generous text padding | 640px centered column |
| 3 | `#timeline` | S21 Signature: SVG Path timeline tracing 4 physical extraction stages with progressive illumination | Vertical interactive SVG path with milestone nodes | Stacked milestone cards along left vertical trace | Compact SVG timeline |
| 4 | `#blends` | Interactive formulation selector between 3 distinct botanical profiles | 2-column tasting deck with layoutId tabs | Stacked selector with scrollable pills | 2-column card deck |
| 5 | `#specifications` | Comparative specification ledger of biochemical attributes | Ruled definition table with 2-column breakdown | Single-column definition list | 2-column ledger |
| 6 | `#reserve` | Allocation console with bottle size selection, stepper, live total, and CLI snippet | Split checkout console with interactive summary | Stacked single column with full-width CTA | 2-column console |
| 7 | `#colophon` | Atelier coordinates, botanical harvest ethics, and colophon | 3-column structured colophon | Stacked rows | 3-column compact |

## Macro choreographies (4+)
1. Hero load choreography: Staggered soft rise of Fraunces display headline, botanical statement lead, and smooth fade-in of the decanter video.
2. S21 SVG path timeline: Scroll-linked SVG line stroke drawing (pathLength animation) through 4 physical extraction stages with node lighting.
3. Shared layout transitions: Animated Framer Motion layoutId pill indicators for blend selector tabs (`active-blend-pill`) and bottle volume selector (`active-size-pill`).
4. In-template Theme Transition: Smooth full-canvas color switch when toggling between light (porcelain white-emerald) and dark (deep cypress-emerald) modes.
5. Top navigation hairline progress: Hairline indicator measuring scroll progress across the top navigation bar.

## Micro interactions (12+)
1. In-template theme toggle button with Sun/Moon icon switch and smooth rotation.
2. Primary CTA hover lift (`whileHover={{ y: -3 }}`).
3. Primary CTA tap press feedback (`whileTap={{ scale: 0.97 }}`).
4. Secondary ghost button hover underline and background shift.
5. Blend selection tab switch with `layoutId="active-blend-indicator"`.
6. Bottle volume toggle (375ml / 750ml) with `layoutId="active-size-indicator"`.
7. Allocation quantity increment button with boundary validation (max 6 decanters).
8. Allocation quantity decrement button with boundary validation (min 1 decanter).
9. Video play/pause toggle button with state feedback.
10. Copy CLI command snippet with icon swap (Copy to Check) and timeout.
11. Reserve order submit button with AnimatePresence label morph to "Reservation Confirmed".
12. Timeline milestone card hover lift (`whileHover={{ y: -3 }}`) with subtle shadow expansion.
13. Specification ledger row hover highlight with line contrast enhancement.
14. Focus-visible keyboard outlines on all interactive buttons with ring-2 ring-emerald-500 ring-offset-2.

## Deleted from the old version (rewrite only)
What slop was removed and which true facts were kept:
- Deleted: Banned words ("seamless", "elevate", "revolutionary", "state-of-the-art", "haute", "bespoke atelier").
- Deleted: Decorative blur blobs (backdrop-blur-2xl, glowing orb layers).
- Deleted: Accent-to-slate gradient buttons (`linear-gradient(135deg, ${accent}, #0f172a)`).
- Deleted: Pulsing/pinging elements (`animate-pulse`, `animate-ping`).
- Deleted: Kicker / pill labels above headings (`rounded-full uppercase` kickers).
- Deleted: Middle-dot separators (` • `).
- Deleted: Invented telemetry and fake metrics ("telemetry", "Temp: 2.2°C • 0 Tannin Extraction", fake coordinates).
- Deleted: Fake scarcity ("only 84 left", countdown timer).
- Kept: Authentic video asset `/videos/zenith-tea-elixir.mp4`, genuine botanical profiles (Golden Amber Reserve, Zen Jade Ceremonial, Midnight Ruby Orchid), realistic harvest origins (Wuyi Mountains, Uji Heritage Gardens, Mount Ali), real extraction parameters (sub-zero temperature 2.2°C, 18-hour cold brew, L-theanine concentrations).

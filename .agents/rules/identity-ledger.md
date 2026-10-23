# Identity ledger

One row per template. Before starting, pick values not already used in a way that violates the collision rule (differ from every other row on at least 5 of 10 axes, see `uniqueness.md`). The tokens (A to L, T1 to T18, P1 to P18, SL1 to SL6, M1 to M7, S-codes) are defined in `.agents/skills/template-studio/identity-library.md`.

Statuses: `todo` (still old, probably slop), `assigned` (target identity, not built), `done` (rewritten to this identity, audited, exported).
When you finish a template, change its row to `done`. If you deviate from the assignment, update the row to what you actually built, and make sure the collision rule still holds.

| Template | Archetype | Display / body | Palette | Surface | Motion | Signature | Status |
|---|---|---|---|---|---|---|---|
| Aerovoid Obsidian Technical Parka | legacy | legacy | dark, amber | SL6 | legacy | exploded layers | done, reference quality only, do not imitate |
| Vortex Apex | C Swiss poster grid | T15 Archivo wdth | P4 Signal Red Paper | SL1 | M4 | S1 variable-font weight/width scroll | assigned |
| Chrono X Titanium | K ceremonial centered | T9 Cormorant + Tenor | P2 Midnight Ledger | SL1 | M1 | S2 frame scrub with caliber chapters | done |
| Ferrari Nocturne | B full-bleed cinematic | T13 Syne + DM Sans | P17 Carbon Rosso | SL4 | M5 | S16 video-in-type hero | assigned |
| Lamborghini Revuelto | D product sheet | T3 Geist + Geist Mono | P17 Carbon Rosso | SL2 | M1 | S2 frame scrub with synced captions | done |
| Aura Sound Pro | D product sheet | T7 Space Grotesk + Mono | P8 Carbon Lime | SL1 | M1 | S2 frame scrub + S8 acoustic spec ledger | done |
| Aura Nocturne | A editorial split | T2 Instrument Serif + Sans | P7 Terracotta Clay | SL2 | M2 | S11 word-by-word text scrub | done |
| Aura Obsidian | E stacking sheets | T10 Newsreader + Schibsted | P3 Moss & Cream | SL4 | M3 | S9 stacking sheets | done |
| Velvet Gelato | H bento | T14 Young Serif + Albert | P16 Citrus Cream | SL5 | M2 | S14 configurator changing real content | done |
| Zenith Elixir | G single-column manifesto | T3 Geist + Geist Mono | P1 Zinc Monochrome | SL1 | M1 | S21 SVG path timeline | done |
| Monolith Cacao | D product sheet | T5 Bricolage + Hanken | P10 Cocoa Gold | SL4 | M5 | S3 clip-path image expand | assigned |
| Amarena Royale | I sticky split-screen | T8 Outfit + Figtree | P13 Blush Porcelain | SL5 | M6 | S15 scroll-velocity marquee | assigned |
| Levitas Cryo | F horizontal lookbook | T3 Inter Tight + Plex Mono | P6 Glacier Mono | SL2 | M1 | S5 pinned horizontal lookbook | done |
| Rose Nocturne | K ceremonial centered | T6 Cinzel + Plus Jakarta | P5 Plum Noir | SL2 | M7 | S5 pinned horizontal protocol sequence | done |
| Psyche Obsidian | J index / list | T16 Gloock + Inter | P1 Bone & Ink | SL1 | M3 | S25 marginalia annotations | done |
| Vapor Obsidian | I sticky split-screen | T12 Martian Mono + Inter | P9 Ocean Teal Ink | SL4 | M6 | S13 pointer-proximity variable headline | assigned |
| Vantr Particle | A editorial split | T12 JetBrains Mono + Inter | P11 Paper Cobalt | SL1 | M4 | S24 view transitions (drop the particle field) | assigned |
| Stayline | A editorial split | T17 DM Serif + DM Sans | P18 Seaglass | SL2 | M3 | S12 before/after wipe | assigned |
| Nex Portfolio | J index / list | T3 Geist + Geist Mono | P14 Steel Graphite | SL2 | M1 | S6 index list with cursor image preview | done |
| Nex Store | app, store | choose from library | P3 | SL2 | M2 | S7 shared-element card to detail | assigned |
| Nex Core Admin | app, dashboard | T3 Inter Tight + Plex Mono | P11 Paper Cobalt | SL1 | M1 | S18 command palette | done |
| Nex Users Table | app, table | T3 Inter Tight + Plex Mono | P6 Glacier Mono | SL1 | M1 | S19 FLIP table | done |
| Nex Auth | app, auth | choose from library | P1 | SL2 | M2 | S28 auth container morph | assigned |
| AI Chat Interface | app, chat | choose from library | P14 | SL4 | M6 | S29 streaming word-mask | assigned |
| Swagger Form Builder | app, builder | choose from library | P9 | SL1 | M1 | S30 drag reorder with live preview | assigned |
| Ironpaw Tools | L brutalist raw | T3 Inter Tight + Golos Text | P4 Signal Red Paper & Yellow | SL3 | M4 | S2 3D raccoon video scrubbing canvas with piecewise-linear frame mapping | done |
| FLIP Skate Shop | D product sheet / skate workshop | Unbounded + Manrope | Hero Olive Green & Lime + Orange | SL3 | M1 | S2 240-frame skateboard flip & exploded parts scrub | done |
| PULL Noodle Bar | B full-bleed cinematic | Unbounded + Manrope | Dark Crimson #741e20 & Gold #ffc845 | SL4 | M1 | S2 240-frame hand-pulled noodle scroll scrub with live cart | done |

Notes
- Two rows may share one token on an axis, never on 6 or more axes.
- New templates: add a row first, status `assigned`, then build.
- The app UI rows still need a distinct display/body pairing and radius/motion character. Pick them from the library before building and write them into the row.

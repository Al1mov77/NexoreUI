# Identity brief: template-users-table-pro

Save as `.agents/briefs/template-users-table-pro.md`. Fill every line. No blanks.

## Story (3 lines)
1. Product and visitor: NEXUSERS is an enterprise user directory and data table for systems administrators, engineering leads, and IT operations managers managing enterprise identity, roles, and 2FA access.
2. What the visitor must feel or decide: Feel the speed, density, and precision of a high-performance administrative table; sort, filter, inspect user details, and connect live REST/Swagger endpoints in real-time.
3. Signature moment shows: S19 FLIP animated data table with live Swagger/REST API synchronization, column sorting with fluid row reordering, drawer inspection with shared layout, and floating bulk action bar.

## Identity (10 axes)
1. Archetype (A-L): App, data table (dense high-utility enterprise registry with sticky table header, inline REST/Swagger live data connect bar, metric tiles, multi-parameter filter toolbar, and slide-over audit drawer).
2. Grid and density: 4px base grid, max-w-7xl (1280px), dense tabular cells (py-3 px-4), hairline 1px rules. Section padding: 24px desktop / 16px tablet / 12px mobile.
3. Display type: Inter Tight (weights 400, 500, 600, 700), Google Fonts URL: `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap`, verified 200.
4. Body and aux type: Inter Tight for interface labels, headings, table contents; IBM Plex Mono for IDs, timestamps, counts, numbers (tabular-nums), status tags, API endpoints, and JSON editor.
5. Palette (hex): P6 Glacier Mono (native light, engineered dark variant).
   - Light: bg #EAEEF2 / surface #FFFFFF / surfaceAlt #DFE5EB / line #C8D0D9 / text #0F1722 / muted #5B6776 / accent #0A6CFF / accentInk #FFFFFF.
   - Dark: bg #0A0E14 / surface #11161F / surfaceAlt #161D27 / line #1F2937 / text #E2E8F0 / muted #64748B / accent #3B82F6 / accentInk #FFFFFF.
   - Status accents: Active #10B981, Pending #F59E0B, Suspended #EF4444.
6. Surface language (SL1-SL6): SL1 Hairline flat (radius 6px to 8px, 1px crisp line border, no drop shadows, structural rules, zero gradient bloat).
7. Motion personality (M1-M7): M1 Precise (spring 520 / 38 / 0.7, snappy, press scale 0.98, hover lift 1px, layout transitions on row reorder, full useReducedMotion support).
8. Signature moment (S-code), mechanism, real content it acts on, mobile fallback: S19 FLIP animated table rows on sort and filter; inline Live Swagger/REST API sync toolbar with real-time fetch from DummyJSON or custom endpoints; mobile transforms table rows into responsive structured cards with zero horizontal squish.
9. Copy voice: Dry technical enterprise. Verbs and concrete nouns. Sample headline: "Directory & Access Registry". Sample button: "Sync Live Endpoint", "Export CSV".
10. Imagery treatment: Real verified user avatars with 1px hairline border, circular 32px crops, deterministic fallback initials.

## Collision check
Compared against ledger rows:
- Aerovoid (legacy, dark/amber, SL6, S-exploded layers) -> differs on Archetype, Type, Palette, Surface, Motion, Signature, Voice -> 7 axes.
- Vortex Apex (C, T15, P4, SL1, M4, S1) -> differs on Archetype, Type, Palette, Motion, Signature, Voice -> 6 axes.
- Chrono X Titanium (K, T9, P2, SL1, M1, S4) -> differs on Archetype, Type, Palette, Signature, Voice -> 5 axes.
- Nex Portfolio (J, T3, P14, SL2, M1, S6) -> differs on Archetype, Palette (P6 vs P14), Surface (SL1 vs SL2), Signature (S19 vs S6), Voice -> 5 axes.
- Nex Core Admin (app dashboard, P11, SL1, M1, S18) -> differs on Archetype, Palette (P6 vs P11), Signature (S19 vs S18), Voice, Imagery -> 5 axes.
Axes that differ from closest row: 5+ axes. No collision.

## Section sequence (one job each, 5-7)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | Top Bar | Global identity, internal theme toggle, CSV export, and Add Member CTA | Sticky header with title, status, and utility actions | 2-row stacked mobile bar | Compact horizontal bar |
| 2 | Live API Sync Bar | Direct Swagger/REST API connection, endpoint presets, and JSON editor | Collapsible precision toolbar with URL input and preset triggers | Full-width vertical stack | 2-row layout |
| 3 | Metric Ledger | Real-time counts of total, active, pending, and suspended users with filter triggers | 4-column ruled ledger cards with tabular numbers | 2x2 grid | 4-column compact grid |
| 4 | Search & Filter Bar | Search query input, role filter, department filter, and table/grid view toggle | Horizontal filter strip with search and select menus | Stacked search and dual select | 2-row filter strip |
| 5 | Table & Card Canvas | Signature S19: FLIP-animated data table with sorting, selection, and pagination | 7-column ruled high-density table with checkbox selection | Responsive structured card feed | Responsive table with scroll fallback |
| 6 | Slide-over User Detail Drawer | Comprehensive inspection of user permissions, 2FA, logs, and actions | Right slide-over sheet with backdrop | Full-screen bottom sheet | Right slide-over sheet |
| 7 | Floating Bulk Action Bar | Batch status mutation and bulk deletion for selected members | Floating anchored pill with count and action triggers | Sticky bottom full-width bar | Floating bottom pill |

## Macro choreographies (4+)
1. FLIP Table Reordering: Rows reorder with Framer Motion `layout` when sorted by Name, Role, Department, or Status.
2. Live API Stream Ingestion: Fetching live records triggers a loading state and smoothly replaces rows with stagger.
3. Slide-over Detail Reveal: Right-hand drawer slides in with spring damping while background dims.
4. Floating Bulk Bar Entrance: Springs up from screen bottom when one or more rows are selected.

## Micro interactions (12+)
1. Internal Theme Switch: Sun/Moon button toggles between P6 Glacier Light and Dark palettes.
2. Live Data Source Toggle: Opens/collapses the Swagger / REST API connection panel.
3. Quick Endpoint Presets: One-click buttons for DummyJSON (30 users) and JSONPlaceholder (10 users).
4. Raw JSON Importer: Direct textarea to paste, validate, and apply custom user datasets.
5. Metric Tile Filter Triggers: Clicking a metric tile filters the table by that status with visual active state.
6. Column Sort Direction: Header clicks toggle asc/desc indicators and re-sort data with FLIP.
7. Row Selection Checkbox: Custom styled checkbox toggles single or select-all states.
8. Email Clipboard Copy: Clicking user email copies to clipboard with animated checkmark feedback.
9. Status Quick Toggle: Contextual menu allows switching active/suspended status instantly.
10. Slide-over Keyboard Escape: Pressing Escape closes the active user detail drawer.
11. View Mode Switcher: Toggles between dense tabular view and card grid view.
12. WhileTap Scale Feedback: Snappy 0.98 scale feedback on all buttons and interactive controls.

## Deleted from the old version (rewrite only)
What slop was removed:
- Removed 62+ purple, indigo, violet utility classes and gradients.
- Removed animate-pulse glowing dots.
- Removed PRO pill badges and generic kickers.
- Removed default 508x Tailwind zinc palette, replaced with P6 Glacier Mono design system tokens.
- Removed hidden customizer restriction: brought live Swagger/REST API and JSON mock dataset capabilities directly into the visible template interface.

## Not allowed here (self-check)
No primitives, particles, HUD, toys, pill/kicker, emoji, pulse dots, fake facts, Aerovoid structure.

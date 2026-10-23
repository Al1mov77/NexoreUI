# Identity brief: template-nexcore-admin-pro

Save as `.agents/briefs/template-nexcore-admin-pro.md`. Fill every line. No blanks.

## Story (3 lines)
1. Product and visitor: NEXCORE is an enterprise operations control center and admin dashboard for operations leads, financial controllers, and engineering teams monitoring revenue velocity, order throughput, and regional infrastructure.
2. What the visitor must feel or decide: Feel the clinical precision, density, and quiet control of an institutional cockpit; switch date ranges, toggle visualization types, inspect transaction ledgers, and trigger actions via keyboard command palette.
3. Signature moment shows: S18 interactive command palette (`Cmd+K` / `Ctrl+K`) with real-time fuzzy filtering, keyboard navigation, theme toggling, view switching, and data export execution with tactile toast feedback.

## Identity (10 axes)
1. Archetype (A-L): App, dashboard (Institutional administrative workspace featuring an icon-and-label sidebar navigation, global search top bar, 4-tile KPI ledger with sparklines, interactive multi-mode chart canvas, acquisition breakdown, real-time transaction ledger, and infrastructure health strip).
2. Grid and density: 4px base grid, max-w-7xl (1280px), dense tabular cells (py-2.5 px-3.5), hairline 1px rules. Section padding: 24px desktop / 16px tablet / 12px mobile.
3. Display type: Inter Tight (weights 400, 500, 600, 700), Google Fonts URL: `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap`, verified 200.
4. Body and aux type: Inter Tight for interface labels, headings, navigation, table contents; IBM Plex Mono for IDs, timestamps, counts, numbers (tabular-nums), status tags, sparkline labels, and command shortcuts.
5. Palette (hex): P11 Paper Cobalt (native light, engineered dark variant).
   - Light: bg #F7F7F2 / surface #FFFFFF / surfaceElevated #EDEDE5 / surfaceMuted #F0F0E8 / line #D8D8CC / text #101322 / muted #5C6075 / accent #2438E8 / accentInk #FFFFFF.
   - Dark: bg #0B0E14 / surface #121721 / surfaceElevated #18202E / surfaceMuted #161B26 / line #222B3D / text #EDF1F7 / muted #7A889B / accent #4D6BFE / accentInk #FFFFFF.
   - Status accents: Settled/Operational #0D9488 (light) / #10B981 (dark), Pending/Review #D97706 (light) / #F59E0B (dark), Failed/Incident #DC2626 (light) / #EF4444 (dark).
6. Surface language (SL1-SL6): SL1 Hairline flat (radius 6px, 1px crisp line border, no drop shadows, structural rules, zero gradient bloat, zero glow).
7. Motion personality (M1-M7): M1 Precise (spring 520 / 38 / 0.7, snappy, press scale 0.98, hover lift 1px, layout transitions on tab and filter switches, full useReducedMotion support).
8. Signature moment (S-code), mechanism, real content it acts on, mobile fallback: S18 Command Palette (`Cmd+K` / `Ctrl+K`) with keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`), fuzzy search across dashboard pages, quick actions (toggle theme, export telemetry, filter 30D/7D), and confirmation toast; mobile fallback presents an accessible full-width action sheet.
9. Copy voice: Dry technical enterprise. Verbs and concrete nouns. Sample headline: "Operations Control Center". Sample button: "Export Ledger", "Quick Action".
10. Imagery treatment: No decorative stock photos or 3D primitives; crisp geometric vector mark, authentic monochrome avatar initials with hairline borders, precise vector sparklines.

## Collision check
Compared against ledger rows:
- Aerovoid (legacy, dark/amber, SL6, S-exploded layers) -> differs on Archetype, Type, Palette, Surface, Motion, Signature, Voice -> 7 axes.
- Chrono X Titanium (K, T9, P2, SL1, M1, S2) -> differs on Archetype, Type, Palette, Signature, Voice -> 5 axes.
- Aura Sound Pro (D, T7, P8, SL1, M1, S2) -> differs on Archetype, Type, Palette, Signature, Voice -> 5 axes.
- Nex Users Table (app table, T3, P6, SL1, M1, S19) -> differs on Archetype (dashboard vs table), Palette (P11 vs P6), Signature (S18 vs S19), Layout, Views -> 5 axes.
- Nex Portfolio (J index, T3, P14, SL2, M1, S6) -> differs on Archetype, Palette, Surface, Signature, Voice -> 5 axes.
Axes that differ from closest row: 5+ axes. No collision.

## Section sequence (one job each, 5-7)
| # | Section | Job | Layout form | Mobile transform | Tablet transform |
|---|---|---|---|---|---|
| 1 | Top Bar & Workspace Header | Global brand identity, internal theme toggle, search trigger, date range selector, export action | Horizontal bar with workspace indicator, search input, actions | 2-tier mobile header with hamburger drawer | Compact horizontal bar |
| 2 | Metric Ledger (KPIs) | Real-time operational metrics (Revenue, Orders, Active Accounts, Conversion) with sparklines | 4-column ruled grid with tabular numbers and mini SVG charts | 2x2 grid or stacked cards | 4-column compact grid |
| 3 | Performance Analytics Canvas | Interactive revenue overview with chart type switcher (Bar / Line / Area) and hover data tooltip | Large card with header controls, dynamic SVG chart, and metrics strip | Stacked card with scrollable chart area | Full-width card with compact controls |
| 4 | Operations & Channel Breakdown | Revenue acquisition channels and real-time transaction ledger | 2-column asymmetric split (5:7 ratio) | Stacked single-column sections | Stacked 2-column grid |
| 5 | Regional Infrastructure Health | Latency, throughput, DB query speed, and node status monitoring | Ruled horizontal strip with metric badges and status pills | 2-column status card grid | 4-column status strip |
| 6 | S18 Command Palette (Modal) | Keyboard-accessible instant navigation, action runner, and search | Centered modal with backdrop, keyboard hints, and filter list | Full-screen bottom sheet | Centered modal dialog |

## Macro choreographies (4+)
1. Date Range Transition: Switching between Today, 7D, 30D, and 90D recalculates all KPI cards and smoothly morphs the chart bars/paths using Framer Motion springs.
2. Chart Mode Switch: Toggling between Bar, Line, and Area types smoothly morphs SVG geometry with layout animation.
3. Command Palette Entrance: `Cmd+K` triggers modal backdrop fade and centered dialog spring reveal with auto-focused input.
4. Export Confirmation Toast: Springs up from bottom-right on data export with automated dismissal after 2.5s.

## Micro interactions (12+)
1. Internal Theme Switch: Header toggle switches between light and dark palettes instantly with animated icon rotation.
2. Date Range Buttons: Active range pill glides between segments using Framer Motion `layoutId`.
3. Chart Type Selector: Segmented pill controls toggle between Bar, Line, and Area visualizations with `layoutId`.
4. Chart Bar/Point Hover: Hovering points displays exact currency values in a floating tooltip.
5. Command Palette Trigger: Clicking search bar or pressing `Cmd+K` / `Ctrl+K` opens the palette.
6. Command Item Keyboard Navigation: Up/Down arrow keys highlight items; Enter activates selection.
7. Quick Action Execution: Triggering an action runs the callback and closes palette with feedback.
8. Navigation Item Selection: Switching sidebar pages highlights active route with primary indicator.
9. Export Button Feedback: Triggers spinner state then displays green checkmark in toast notification.
10. Metric Card Hover: 1px border accentuates and sparkline opacity elevates on mouseover.
11. Transaction Row Inspect: Hovering a ledger row shows timestamp and transaction ID in monospace.
12. Mobile Drawer Toggle: Hamburger icon animates smoothly to close icon with sliding navigation tray.

## Responsive review (375, 768, 1280)
- 375 mobile: Sidebar collapses into a top navigation bar with toggleable slide-out drawer; metric cards render in clean 2x2 or 1-col cards; charts resize gracefully with SVG viewBox; tables become structured transaction cards.
- 768 tablet: Sidebar displays as compact icon-and-label rail (w-56); metric cards span 2x2 or 4x1; charts and distribution stack comfortably; tap targets >= 44px.
- 1280 desktop: Full desktop cockpit with 240px sidebar, 4-column metric ledger, multi-mode chart canvas, split transaction feed, and command palette.

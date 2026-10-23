# Non-Product Templates (apps, dashboards, forms, portfolios, stores)

`craft.md` covers general design craft. This file covers apps, dashboards, tables, auth, chat, forms, stores and portfolios. The same goals apply: no slop, its own design language (`uniqueness.md`), and one signature moment assigned in `identity-ledger.md`. A specular top highlight is allowed only in the SL6 surface language.

## Universal for app UI

- Density with calm: tight spacing in data areas, generous spacing around them. Use a 4px grid.
- Real data shapes: names, emails, dates, statuses and amounts that look like real data. No "Lorem ipsum", no "John Doe", no "User 1". No fake KPI hero ("10x faster", "99.9% uptime").
- Every list or table has: a loaded state, an empty state with a useful action, and a loading skeleton that matches the real layout.
- Keyboard first: visible focus ring, arrow navigation in lists, `Escape` closes overlays, `Cmd/Ctrl + K` opens a palette where it makes sense.
- Numbers use `tabular-nums` and animate with a spring when they change.
- State changes use `layout` animation (FLIP): rows reorder, cards expand, panels resize. Never snap.
- Surface language: neutral page, panels at 3 to 5 percent white, specular top line on raised panels, one accent for active and primary actions only.
- No decorative illustrations, no mascot, no gradient hero in app screens.
- Icons: one set, one stroke width, used for meaning only.

## By type

### Dashboard and admin
- Layout: slim sidebar, top bar with search and one user control, content grid. Mobile: sidebar becomes a bottom sheet or tab bar.
- Max 4 metric tiles. Each tile is a number, a delta and a tiny sparkline drawn with SVG `pathLength` animation.
- One main chart with spring-smoothed value changes and a pointer crosshair that tracks the cursor.
- Wow moment candidates: command palette with fuzzy search, live chart that morphs between ranges, keyboard-driven row navigation.

### Data table
- Sticky header, column sorting with FLIP row animation, row expand into a detail panel with `layoutId`.
- Inline editing: double click or Enter to edit, Escape to cancel, spring on confirm.
- Selection: shift click range, floating action bar that springs in from the bottom.
- Mobile: rows become cards. No horizontal scrolling tables.

### Auth
- One centered card, nothing else. No split-screen marketing panel with fake testimonials.
- Modes (sign in, sign up, reset) share one container that resizes with `layout`, fields enter and leave with springs.
- Real validation messages next to fields, password strength shown as a continuous bar, not as colored badges.
- Wow moment candidates: container morph between modes, magnetic submit button, focus ring that slides between fields with `layoutId`.

### Chat or AI interface
- Messages stream in word by word with the masked reveal. Composer grows with a spring.
- Show real structure: code blocks with copy, lists, a stop button during streaming.
- No glowing orb, no sparkle icon everywhere, no "Powered by AI" labels.

### Form builder
- Canvas with drag-to-reorder using layout animation, a property panel, a live preview that updates per keystroke.
- Field types are real: text, select, checkbox, date. No made-up field types.

### Portfolio
- Large type, few elements. Project list with a preview card that follows the pointer with a spring, magnetic hover on rows.
- Real project structure: title, year, role, one line. No fake clients.

### Store
- Product grid with consistent aspect ratios, shared-element transition from card to detail with `layoutId`, variant selectors with sliding indicators, cart drawer with spring.
- Price, stock and shipping are plain and consistent. No countdown timers, no "3 people are viewing this".

### Brand or agency
- Pinned horizontal story, big numbers, one media piece. No team grid with stock avatars unless asked.

## Mobile for app UI

- Navigation moves to a bottom tab bar or sheet. Tap targets 44px or more.
- Tables become cards, sidebars become sheets, hover actions become swipe or long-press or always visible.
- Test at 375px wide. Nothing overflows.

## Audit additions for app UI

In addition to the audit in `anti-slop.md`:
1. Empty, loading and error states exist.
2. Every changing value or order change is animated.
3. The whole flow works with keyboard only.
4. Data looks real and is consistent across the screen.
5. No marketing fluff inside an app screen.

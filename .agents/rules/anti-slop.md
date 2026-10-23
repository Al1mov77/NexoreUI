# Anti-slop

Slop is anything that reads as generated. Three families: visual slop, copy slop, uniqueness slop. The static check is `node scripts/audit-template.js <file>`. The human check is the list at the bottom.

## 1. Visual slop (delete, do not restyle)

| Slop | Do instead |
|---|---|
| Emoji anywhere, emoji-like glyph bullets | Nothing, or an inline SVG that matches the icon style |
| Pill badge or kicker label above a heading | Heading alone. Put context in the paragraph below |
| Pulsing or pinging status dot (`animate-ping`, `animate-pulse`) | A static element, or nothing |
| Purple, pink, indigo, rainbow gradients | Palette from the brief, flat or tonal |
| Blur blobs, glowing orbs behind content | Flat surface, or a real photo |
| Glow on every card and button | One shadow system from the surface language |
| Gradient text on headings | Solid color. Emphasis through weight, italic or accent underline |
| Accent-to-slate gradient buttons | Solid fill, hard border or underline per surface language |
| Glassmorphism on every container | Glass only for a sticky header or one overlay, and only if the surface language says so |
| Everything centered, three identical cards in a row | Asymmetric layout, varied spans, one dominant element per section |
| Identical card grid repeated in several sections | A different structure per section (list, table, split, timeline, strip) |
| Tiny text (under 12px), low-contrast gray on dark | Real scale, AA contrast |
| Stock Tailwind zinc/slate look, default Inter-only text | Brief palette and loaded fonts |
| Floating 3D shapes, spheres, rings, cubes, particles | Real content: type, photo, video, product facts |
| Dot separators between every item (`a · b · c`) | Layout spacing, hairlines |

## 2. Copy slop

Banned words and phrases: revolutionary, cutting-edge, next-generation, seamless, unleash, elevate, empower, game-changing, supercharge, world-class, state-of-the-art, effortless, "reimagined", "redefined", "where X meets Y", "crafted for those who".

Banned content: invented numbers presented as measurements, invented awards or press quotes, invented lab or partner names, fake serial numbers and batch codes, fake countdowns, "only 3 left", fake reviews and star ratings, fake "trusted by N users".

Rules:
- Short, concrete, true to the product. Verbs and nouns over adjectives.
- Every number has a reason to exist. Keep real specs from the original template if they were real. If unsure, remove.
- Voice follows the brief (for example dry and technical, warm and domestic, terse and architectural).
- Headings state a fact or a promise you can keep. No filler headings like "Why choose us".
- Button labels are verbs about the action ("Reserve a table"), not "Learn more" everywhere.

## 3. Uniqueness slop (new, the most expensive kind)

- Copying another template's structure, spring, card style, section order or copy (especially Aerovoid).
- Changing only the accent color or font and calling it new.
- Scenes that look like a 2D game: floating objects, HUD, crosshair, level or health metaphors, particle toys, draggable physics sandboxes, cursor trails, confetti.
- 3D primitives used as decoration with no relation to the product.
- Canvas effects that carry no content.
- A hero where the only content is a heading over an abstract shape.
- Every section animating in the same fade-up. Same easing everywhere.
- Desktop-only layout that collapses to a single stacked column on mobile.

## Replace, do not restyle

If the existing template has any item from the tables above, delete it. Do not tint it, shrink it or rename it. If a section's only job was filling space, delete the whole section.

## Pre-delivery audit (answer every line honestly)

1. `node scripts/audit-template.js` returns zero ERRORs; warnings are fixed or justified in the report.
2. No emoji, no glyph bullets, no pill or kicker above any heading.
3. No pulse or ping, no blobs, no purple or pink gradient, no glow-on-everything.
4. No banned marketing words. No invented numbers, partners, awards, reviews, scarcity.
5. Every section has a one-line job, written in the brief.
6. Fonts are loaded and visible in the code (`fonts.googleapis.com` link or `next/font`).
7. The palette is the brief's palette. One accent. No default zinc look.
8. The ledger collision rule holds (5 of 10 axes differ from every other row).
9. Squint test: it would not be mistaken for Aerovoid or any other template.
10. Signature moment uses real content and has a mobile version.
11. Motion budget met (4 macro, 12 micro), personality tokens used, no default spring everywhere.
12. `useReducedMotion` respected. No hover-only functionality.
13. 375, 768, 1280 each have their own layout and nothing overflows horizontally.
14. Registry export regenerated with `sync-template-export.js` and the check passed.
15. Report states what was not verified in a browser.

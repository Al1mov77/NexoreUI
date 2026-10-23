# Identity library

Menus. Pick one value per axis, record it in the brief. Tokens are referenced from `identity-ledger.md`. Values are starting points: adjust within the spirit, never swap in the stock look.

## 1. Archetypes (layout language)

Each archetype defines nav form, hero composition, grid, section forms and the mobile transform.

**A. Editorial split.** Nav: wordmark left, 3 text links right, hairline under. Hero: 7/5 split, huge headline left bleeding into the grid, one tall crop right (4:5). Grid: 12 col, 24 gutter. Sections: alternating text columns with marginal captions, pull quotes, a two-column spec list. Mobile: image first as 4:5, headline below, captions inline.

**B. Full-bleed cinematic.** Nav: minimal, wordmark only, menu button. Hero: media fills the viewport (video), headline lower-left, scrim from bottom. Sections: full-bleed chapters with one line each, big scroll distance between. Mobile: video crops to portrait focus, headline above fold bottom, chapters stack at 80svh.

**C. Swiss poster grid.** Nav: top bar with column numbers aligned to the grid, no logo mark. Hero: type fills 12 columns at 20vw, tight leading, rules between rows. Sections: strict grid with ruled rows, left label column. Mobile: 4 columns, label above content, rules keep rhythm.

**D. Product sheet / catalog.** Nav: top bar with product name and a buy button. Hero: product image center-right, spec table left with ruled rows. Sections: dimension drawings, spec ledger, options table, a comparison strip. Mobile: image on top, spec table full width as definition list.

**E. Stacking sheets.** Nav: floating compact bar. Hero: first sheet. Each section is a full-height sheet with its own background that pins and the next slides over it (sticky stack with scale-down of the previous). Mobile: same stacking at shorter height, sheet heading always visible.

**F. Horizontal lookbook.** Nav: left vertical rail on desktop. Hero: title plus first frame. The core is a pinned horizontal track of frames (3 to 6) each with caption and number. Mobile: vertical stack of frames with horizontal snap strips.

**G. Single-column manifesto.** Nav: centered small wordmark. One 640px column with a wide type scale, occasional full-bleed images that break the column. Paragraph-driven, statements, one timeline. Mobile: same column, larger margins.

**H. Bento.** Nav: top bar, pill-less. Hero: headline and a bento of 5 to 7 tiles of different spans, each tile a different content type (photo, number, quote, ingredient list, map). Mobile: 2-column dense grid, then single column.

**I. Sticky split-screen.** Nav: slim top. Left half is sticky media that changes as the right half scrolls through chapters. Mobile: media becomes a sticky 40svh top strip, chapters scroll below.

**J. Index / list.** Nav: top with filters. The page is a typographic index: large rows, each a project or item, hover reveals media. Mobile: rows with inline thumbnails, tap expands.

**K. Ceremonial centered.** Nav: centered wordmark with links on both sides. Symmetry, generous margins, serif display, a single product in the middle, slow motion. Mobile: same, fewer ornaments, bigger type.

**L. Brutalist raw.** Nav: oversized links as a block. Visible borders, offset shadows, mono type, flat saturated blocks, asymmetric collisions. Still functional, readable and aligned. Mobile: blocks stack with thick borders.

## 2. Type systems (all on Google Fonts)

Use inline `fontFamily`. Load with `<link>` at the template root. Verify the URL returns 200.

| Token | Display / body | URL (family part) | Character |
|---|---|---|---|
| T1 | Fraunces / Inter Tight | `family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter+Tight:wght@400;500;600` | warm soft serif, wonky italic |
| T2 | Instrument Serif / Instrument Sans | `family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600` | condensed editorial serif |
| T3 | Inter Tight / IBM Plex Mono | `family=Inter+Tight:wght@300;500;700&family=IBM+Plex+Mono:wght@400;500` | Swiss neutral plus technical mono |
| T4 | Big Shoulders Display / Barlow | `family=Big+Shoulders+Display:wght@600;800;900&family=Barlow:wght@400;500;600` | industrial condensed |
| T5 | Bricolage Grotesque / Hanken Grotesk | `family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Hanken+Grotesk:wght@400;500;600` | characterful grotesque |
| T6 | Bodoni Moda / Jost | `family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..800;1,6..96,400..800&family=Jost:wght@300;400;500` | high-contrast fashion |
| T7 | Space Grotesk / Space Mono | `family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700` | techno retro |
| T8 | Outfit / Figtree | `family=Outfit:wght@300;500;700&family=Figtree:wght@400;500;600` | geometric friendly |
| T9 | Cormorant Garamond / Tenor Sans | `family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Tenor+Sans` | classical luxe |
| T10 | Newsreader / Schibsted Grotesk | `family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Schibsted+Grotesk:wght@400;500;600` | journalistic |
| T11 | Unbounded / Manrope | `family=Unbounded:wght@500;700;900&family=Manrope:wght@400;500;600` | wide display, use sparingly |
| T12 | JetBrains Mono / Inter | `family=JetBrains+Mono:wght@300;500;700&family=Inter:wght@400;500;600` | developer |
| T13 | Syne / DM Sans | `family=Syne:wght@500;700;800&family=DM+Sans:wght@400;500;600` | art-gallery quirk |
| T14 | Young Serif / Albert Sans | `family=Young+Serif&family=Albert+Sans:wght@400;500;600` | warm bold serif |
| T15 | Archivo (width axis) | `family=Archivo:wdth,wght@62..125,100..900` | variable width poster type |
| T16 | Gloock / Inter | `family=Gloock&family=Inter:wght@400;500;600` | sharp display serif |
| T17 | DM Serif Display / DM Sans | `family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600` | friendly classic |
| T18 | Playfair Display / Source Sans 3 | `family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Sans+3:wght@400;500;600` | traditional editorial |

Usage rules: display clamp examples. Poster sans: `clamp(3.5rem, 12vw, 11rem)`, tracking `-0.04em`, leading `0.88`. Serif: `clamp(2.75rem, 7vw, 6.5rem)`, tracking `-0.015em`, leading `1.0`. Mono captions 12px, tracking `0.04em`.

## 3. Palettes

Roles: bg / surface / line / text / muted / accent / accent-ink (text color on accent). Provide light and dark variants. The native mode is the default.

| Token | Native | bg | surface | line | text | muted | accent | accent-ink |
|---|---|---|---|---|---|---|---|---|
| P1 Bone & Ink | light | #F3EFE7 | #EAE4D8 | #D6CFC0 | #1A1814 | #6B655A | #C2410C | #FFF7F0 |
| P2 Midnight Ledger | dark | #0B0F14 | #121821 | #1F2733 | #E9EDF2 | #8793A3 | #E8B84B | #1A1303 |
| P3 Moss & Cream | light | #EEF0E4 | #E2E6D2 | #CBD1B6 | #1C2418 | #5E6955 | #2F5D3A | #F2F6EA |
| P4 Signal Red Paper | light | #F6F4F0 | #ECE8E1 | #D9D3C8 | #141414 | #6E6A63 | #E5322D | #FFFFFF |
| P5 Plum Noir | dark | #120B14 | #1B1220 | #2B1D31 | #F1E8F2 | #A08CA5 | #F2B5C8 | #2A0F1B |
| P6 Glacier Mono | light | #EAEEF2 | #DFE5EB | #C8D0D9 | #0F1722 | #5B6776 | #0A6CFF | #FFFFFF |
| P7 Terracotta Clay | light | #F1E6DA | #E7D8C8 | #D3BFA9 | #2A1A12 | #7A6354 | #A8432A | #FFF3EA |
| P8 Carbon Lime | dark | #0C0D0C | #141614 | #232623 | #ECEFE8 | #8B9185 | #C6F432 | #121A00 |
| P9 Ocean Teal Ink | dark | #07151A | #0D1F26 | #173039 | #E3F2F3 | #7E9CA2 | #3DD6C6 | #02201C |
| P10 Cocoa Gold | dark | #150E0A | #1F1511 | #33241C | #F3E9DD | #A38E7B | #D9A441 | #1E1202 |
| P11 Paper Cobalt | light | #F7F7F2 | #EDEDE5 | #D8D8CC | #101322 | #5C6075 | #2438E8 | #FFFFFF |
| P12 Sand Olive Brutal | light | #E9E4D4 | #DDD6C0 | #1A1A14 | #1A1A14 | #5E5C48 | #FF5A1F | #1A0800 |
| P13 Blush Porcelain | light | #F8EFEA | #F0E1D9 | #E0CABF | #2B1A1D | #85666B | #B8546C | #FFF5F7 |
| P14 Steel Graphite | dark | #101113 | #17191C | #26292E | #E8EAED | #8A9099 | #FF7A1A | #1C0C00 |
| P15 Forest Night Ivory | dark | #0A1410 | #101D17 | #1D3027 | #EDE9D6 | #8FA196 | #E9E3C8 | #0F1A14 |
| P16 Citrus Cream | light | #FBF5DC | #F3EBC6 | #E3D8A8 | #14213D | #5F6678 | #14213D | #FBF5DC |
| P17 Carbon Rosso | dark | #0D0C0C | #151313 | #2A2525 | #F2EEEA | #968E88 | #D40000 | #FFFFFF |
| P18 Seaglass | light | #E6F0EE | #D8E7E4 | #BFD4D0 | #0E2421 | #567470 | #E4572E | #FFFFFF |

Light variant of a dark palette: bg is a warm off white tinted from the same hue, text is the dark bg, accent is darkened for 4.5 contrast. Dark variant of a light palette: bg is the text color, text is the bg color, accent lightened. Build both deliberately.

## 4. Surface languages

- SL1 Hairline flat: radius 0 to 2, 1px line borders, no shadow, structure through rules.
- SL2 Soft cards: radius 16 to 24, 1px line at low contrast, one soft layered shadow (`0 1px 2px rgb(0 0 0/.04), 0 12px 32px -12px rgb(0 0 0/.12)`).
- SL3 Hard brutal: radius 0, 2px solid line borders, hard offset shadow (`6px 6px 0 var(--line)`), flat blocks.
- SL4 Tonal layers: radius 12 to 20, no borders, depth from step in surface tone only.
- SL5 Pill-forward: radius 999 for buttons and tags, large radius 28 on cards, friendly weights.
- SL6 Specular dark: dark only, 1px top inset highlight (`inset 0 1px 0 rgb(255 255 255/.1)`), deep shadows. Used by Aerovoid. Avoid for new work.

## 5. Motion personalities

| Token | Feel | Spring / tween | Reveal | Hover / press |
|---|---|---|---|---|
| M1 Precise | tight, instrument | spring 520 / 38 / 0.7 | masked line clip 0.5s `[0.2,0,0,1]` | hover underline 180ms, press scale .98 |
| M2 Soft | warm, unhurried | spring 170 / 26 / 1 | fade plus 16px rise, 0.9s `[0.22,1,0.36,1]` | hover lift 3px, press scale .97 |
| M3 Editorial | magazine, deliberate | tween in-out-quart `[0.76,0,0.24,1]` 0.9s | clip-path inset reveals, line masks | hover image scale 1.04 inside mask, press no scale |
| M4 Mechanical | stepped, exact | tween linear/steps, 0.25s `[0.3,0,0.2,1]` | wipe left to right, number ticks | hover invert colors, press translate 2px |
| M5 Weighty | heavy, slight overshoot | spring 260 / 18 / 1.4 | rise 40px with overshoot | hover shift 6px, press scale .94 |
| M6 Fluid | velocity-linked | spring 120 / 20 / 0.9, scroll velocity drives skew | stretch and settle | hover magnetic, press squish |
| M7 Quiet | near still | tween 1.2s `[0.4,0,0.2,1]` | opacity only plus slight blur-in | hover opacity, press opacity |

## 6. Signature moments (website-native; each works on real content)

- S1 Variable-font headline: weight and width axes animate with scroll progress across the headline.
- S2 Frame or video scrub: `<canvas>` or video currentTime tied to scroll with synced captions (needs `canvas-ok:` comment).
- S3 Clip-path expand: a framed photo grows to full-bleed on scroll while text counter-scrolls.
- S4 Sticky split with morphing media: right media crossfades or clips between states as left copy advances.
- S5 Pinned horizontal lookbook: vertical scroll drives horizontal track with parallax per frame.
- S6 Index list with cursor-following image preview and velocity skew.
- S7 Shared-element transition: card expands into the detail view via `layoutId`.
- S8 Scroll spec ledger: rows draw in with number ticks, a rule fills as you scroll.
- S9 Stacking sheets: sticky sheets scale down and darken as the next slides over.
- S10 Curtain loader intro: type-led intro that wipes away to reveal the page, skippable and short.
- S11 Word-by-word text scrub: a paragraph's words light up with scroll progress.
- S12 Before/after wipe: draggable and scroll-driven comparison on real photos.
- S13 Pointer-proximity variable type: letters change weight by cursor distance (touch: scroll-driven).
- S14 Configurator changing real content: choices update image, price, spec, copy live.
- S15 Scroll-velocity marquee: text rows move with and react to scroll speed.
- S16 Video-in-type: the headline is a mask over the supplied video.
- S21 SVG path timeline: a path draws as you scroll while milestones light up.
- S23 Cursor-lit surface: a mask follows the cursor over a real texture or photo (one per template, must not use the Aerovoid weave).
- S24 View transitions between states or pages.
- S25 Marginalia annotations: notes appear in the margin next to the paragraph in view.
- S17 pricing morph, S18 command palette, S19 FLIP table, S28 auth morph, S29 streaming word-mask chat, S30 drag-reorder with live preview: app moments.

Every signature moment needs: the mechanism, the real content it acts on, the mobile fallback, the reduced-motion fallback.

## 7. Copy voices

- Dry technical: facts, numbers from the real product, no adjectives.
- Warm domestic: first-person plural, sensory words, short sentences.
- Terse architectural: nouns, fragments, periods.
- Dry wit: one understated joke per page at most.
- Ceremonial: slow sentences, third person, few words.
- Direct sales: verb first, price visible, no hype.

## 8. Imagery treatment

Choose one and apply to every image: raw full-color with thin border; duotone from palette; grain plus slight desaturation; hard-cropped monochrome; rounded soft frames with caption; edge-to-edge bleed with scrim. Consistent aspect ratios per section.

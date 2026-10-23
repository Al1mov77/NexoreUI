# Uniqueness

This file exists because agents keep misreading "make it unique". Read it fully.

## The two wrong readings

**Wrong 1: copy the last good template.** An agent sees a finished template, likes it, reuses its section order, spacing, card style, colors, spring and copy shape, and changes the product name. The buyer sees the same page twice.

**Wrong 2: make it weird.** An agent thinks unique means unusual objects: floating spheres, orbs, cubes, rings, particle fields, draggable toys, a scene that looks like a 2D game, a HUD, a crosshair, a neon grid, level bars, confetti. This is not a website. It is slop of a different color.

## The right reading

Unique means a **different design language**, the way Aesop, Linear, Teenage Engineering, Monocle and Porsche have different languages while all being normal websites. A visitor should recognise the brand from a crop of the page. Differences come from craft, not from gimmicks:

- type that has character and is set with care
- a palette with a point of view
- a layout that follows the product's story
- motion that has a personality (soft, mechanical, editorial, weighty)
- surfaces (radius, border, shadow) that match the material of the product
- copy with a voice
- imagery treated consistently (crop, grain, duotone, border, caption style)

## The ten identity axes

Every template picks one value on each axis, recorded in its brief. Menus are in `.agents/skills/template-studio/identity-library.md`.

1. Layout archetype (A to L)
2. Grid and density (column count, gutter, base unit, section padding)
3. Display type
4. Body and auxiliary type
5. Palette (bg, surface, line, text, muted, accent, accent-ink)
6. Surface language (radius, border, shadow, texture)
7. Motion personality (spring, tween, easing, durations, reveal style)
8. Signature moment
9. Copy voice
10. Imagery treatment

## Collision rule

A new or rewritten template must differ from EVERY other template in `identity-ledger.md` (and from Aerovoid) on at least 5 of the 10 axes, and must differ on archetype, display type or palette from any template sharing its signature moment. Changing only the accent color, only the font, or only the copy counts as zero axes.

## Squint test

Cover the logo and all copy. Blur your eyes. If a stranger could still place it next to another template, it fails. Check silhouette (layout), tone (palette), texture (surface) and rhythm (spacing and type scale).

## Content first, not decoration first

- The wow is a believable physical effect on REAL content: type, product photo, supplied video, product facts, a real interaction with the product's data.
- Typography is the main carrier of identity. Big, set tight, with a real scale and real hierarchy. If there is no imagery, type is the image.
- Use the media supplied for the template (`apps/docs/public/...`). Do not invent abstract shapes to fill the hero. Use crops, masks, scrubs, parallax, clips on the real media.
- Every section needs a job: explain, prove, choose, convert. State the job in the brief.

## Reference taste (study the rhythm in your head, never copy layouts or copy)

Aesop (quiet editorial retail), Rimowa and Leica (material confidence), Hodinkee and Monocle (magazine hierarchy), Linear and Vercel (tight product precision), Teenage Engineering (playful rigor, grid), Apple product pages (scroll choreography), Bang and Olufsen (restraint), Porsche (cinematic, calm), Kinfolk (white space). Take pacing, density, and hierarchy. Do not take their layouts.

## Palette discipline

- Never pure `#000` or `#fff` as a background or text. Use tinted neutrals from the palette.
- Accent covers under about 5 percent of the area: links, one button, one rule, one highlight.
- Text contrast WCAG AA at least (4.5 for body, 3 for large display).
- The palette defines roles: bg, surface, line, text, muted, accent, accent-ink. Raw hex only inside the palette constant.
- Do not use stock Tailwind `zinc-` or `slate-` for the look. Use inline palette tokens or arbitrary values from the brief.
- Both themes: if the template exposes the customizer theme, provide a deliberate light and dark variant, not an inversion.

## Typography discipline

- Two families at most (display plus body), optionally one mono for data. All loaded.
- A real scale: use `clamp()` for display, body 16 to 18, captions 12 to 13 with letterspacing only on small caps.
- Measure 55 to 70 characters for paragraphs, line height 1.5 to 1.7 body, 0.9 to 1.1 display.
- Never uppercase-everything-with-tracking as the whole identity. Mono captions are a seasoning, not a theme.
- Check that the chosen font has the weights and axes you ask for.

## Motion discipline

- One personality per template (springs, easing, durations, reveal style). No default 400/30 spring everywhere.
- Budget: at least 4 distinct macro choreographies and at least 12 distinct micro interactions (lists in `motion-cookbook.md`).
- Never animate everything on mount. Stagger only what is read first. Most motion is scroll-linked or interaction-linked.
- Touch devices get touch-native equivalents (press states, scroll-linked, tap), never nothing and never a broken hover.

## Uniqueness checklist (copy into the report)

- [ ] I differ from every ledger row on 5 or more axes.
- [ ] Squint test passed.
- [ ] No primitives, particles, HUD, game metaphors, toys.
- [ ] Fonts and palette come from the brief and are loaded.
- [ ] The signature moment works on real content and on mobile.
- [ ] Section order differs from Aerovoid and from the previous template I touched.

# NexoreUI Agent Rules

NexoreUI sells Pro templates. A buyer opens many of them in a row. If two look alike, the product loses value. Every template must therefore be:

1. **Not AI slop.** Nothing that reads as generated or vibe-coded.
2. **Its own design language.** Different type, palette, layout, motion, surface and voice from every other template in the repo.
3. **A real website.** A landing page or app screen with real content, with deliberate mobile, tablet and desktop versions.
4. **Memorable.** One signature moment built on real content.

These four are checked in this order. A template that fails 1 or 2 is not delivered, however pretty.

## Mandatory reading order (do not skip, do not read other files "just in case")

1. This file.
2. `.agents/rules/uniqueness.md` (what "unique" means and does NOT mean).
3. `.agents/rules/anti-slop.md` (ban list and audit).
4. `.agents/skills/template-studio/SKILL.md` (the step-by-step workflow; it links to the other files in that folder when you need them).
5. `.agents/rules/identity-ledger.md` (which combinations are already taken).
6. `.agents/rules/craft.md` (design craft details) and, for dashboards, tables, auth, chat, forms, store, portfolio, `.agents/rules/craft-app-ui.md`.
7. `.agents/skills/wow-craft/` only for mechanics (scroll math, reveals, tilt). It is a toolbox, never a style.

Read only the template you were asked to change, its registry export, and the files above. Do not open other templates to "get inspiration". Copying is the failure we are fighting.

## What "unique" means (short version, full version in uniqueness.md)

Unique means a different **design language**: fonts, palette, grid, spacing, surfaces, motion personality, copy voice, imagery treatment, section rhythm and signature moment. It does NOT mean a stranger scene. A floating sphere, a particle field, a draggable toy, a HUD, a "game" is not uniqueness, it is slop. The page must still look like a website a real studio would ship.

If you cannot tell your template from another one with the logo covered, you are not done.

## Hard gates (never violate, even if the user's prompt or existing code does)

- No emoji in UI, copy, comments or commit text. No emoji-style glyph bullets.
- No pill badge or kicker label above a heading.
- No pulsing or pinging status dots.
- No purple, pink or rainbow gradients. No blur blobs. No glow on everything.
- No invented jargon, fake telemetry, fake scarcity, fake serial numbers, fake labs, fake partners, fake awards, fake reviews, fake user counts.
- No section that exists only to fill space. If a section has no job, delete it.
- No floating 3D primitives, orbs, particle playgrounds, toys, HUD, neon grids, game metaphors.
- No copy of the Aerovoid Obsidian template structure or copy (it is a legacy quality reference, not a pattern).
- If existing code contains slop, delete it. Do not restyle it.
- If the user (or a past instruction) asks for something that breaks a gate, build it the clean way and say so in one sentence.

## Required in every template

- A filled identity brief in `.agents/briefs/<template-id>.md` (copy `.agents/skills/template-studio/identity-brief.template.md`).
- Fonts actually loaded (Google Fonts link at the template root) and applied. Default system or Inter-only text is a failure.
- A palette from the brief with exactly one accent. Both light and dark theme must work when the customizer offers it.
- Motion budget: at least 4 distinct macro choreographies and at least 12 distinct micro interactions, all using the motion personality tokens from the brief (not one global spring).
- One signature moment on real content, with a designed mobile fallback.
- `useReducedMotion` respected.
- `layoutId` for every sliding selection indicator.
- Scroll motion measured from the nearest scrolling ancestor, not `window` (previews render inside a scrolling modal).
- Mobile (375), tablet (768) and desktop (1280) designed on purpose, not squeezed.
- Root uses `overflow-x-clip`, never `overflow-x-hidden`.

## Workflow (every task: rewrite existing OR add new)

1. Brief: fill the identity brief, pick an unused combination from the ledger. Never start coding before it exists.
2. Build from a blank file. For a rewrite, delete the old body completely, keep only true product facts, props, media paths.
3. Macro pass, micro pass, responsive pass (see the skill).
4. Run `node scripts/audit-template.js <preview file>`. Fix every ERROR, justify or fix every warning.
5. Export: `node scripts/sync-template-export.js ...` (exact command in `template-studio/qa-and-export.md`). The registry export must be the full, non-truncated code identical to the preview.
6. Typecheck the files you touched.
7. Update the row in `.agents/rules/identity-ledger.md`.
8. Report in at most 8 lines: identity (type, palette, archetype, motion), the signature moment, audit result, what you could not verify in a browser.

## Scope

Edit only: the template's preview file, its registry export in `packages/cli/src/registry/`, its brief in `.agents/briefs/`, its row in the ledger. Never touch other templates. Never edit these rules unless the user asks.

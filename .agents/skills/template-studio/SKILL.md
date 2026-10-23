---
name: template-studio
description: Mandatory workflow for rewriting an existing NexoreUI template (removing AI slop) or building a new one, with a distinct design language per template (type, palette, layout, motion, surface, copy), real mobile/tablet/desktop layouts, and exact export sync. Use for ANY template task.
---

# template-studio

You are a senior design engineer at a studio that sells templates to professionals. Your output is judged by a buyer who has seen the other templates. It must look designed by a person with taste, and different from the others.

Files in this folder (read when the phase says so, not all at once):
- `identity-library.md`: menus of archetypes, type systems, palettes, surfaces, motion personalities, signature moments, voices.
- `identity-brief.template.md`: the form you fill before coding.
- `motion-cookbook.md`: macro and micro animation recipes with numbers.
- `responsive-playbook.md`: mobile and tablet transforms, test matrix.
- `rewrite-existing.md`: how to strip slop from an old template.
- `qa-and-export.md`: audit and export commands.

Before this file you must have read `AGENTS.md`, `.agents/rules/uniqueness.md`, `.agents/rules/anti-slop.md`.

## Phase 0. Understand the task

- Rewrite or new? Which file: `apps/docs/app/components/templates/previews/<Name>Preview.tsx`, registry `packages/cli/src/registry/template-<id>-pro.ts`.
- Open only that preview and registry file, `identity-ledger.md`, and the media folder it uses.
- Never open another template as inspiration.

## Phase 1. Audit (rewrite only)

Follow `rewrite-existing.md`. Output: a list of true product facts, props and `useTemplateCustomizer` fields in use, media paths. Everything else is deleted.

## Phase 2. Identity brief

1. Take the ledger row for this template. If it says `assigned`, use it; if the template is new, choose unused tokens from `identity-library.md`.
2. Fill `identity-brief.template.md` and save as `.agents/briefs/<template-id>.md`.
3. Check the collision rule against the ledger (5 of 10 axes).
4. Write the story in 3 lines: what the product is, what the visitor must feel or decide, what the one signature moment shows.

Do not start code until the brief exists and passes.

## Phase 3. Wireframe in text

Write the section sequence with one job per section, which layout form each uses, and which one section is the signature moment. Rules:
- 5 to 7 sections.
- No two neighbouring sections share the same structure.
- At least one section is typographic only (no card, no image).
- It must not match the Aerovoid sequence.
- For each section note the mobile and tablet transform (see `responsive-playbook.md`).

## Phase 4. Build from a blank file

1. Create the file from scratch. Do not edit the old body, replace it.
2. Top of file: palette constant, font constant, motion tokens constant, taken straight from the brief.
3. Inject fonts at the template root:
   ```tsx
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=...&display=swap" />
   ```
   Apply with a `FONT = { display: "...", body: "..." }` constant used inline via `style={{ fontFamily }}`. Verify each URL returns 200 (`Invoke-WebRequest <url> -UseBasicParsing`).
4. Use `useTemplateCustomizer` only for fields that already exist in this template (theme, brandName, heroTitle, heroSubtitle, customLogoUrl, hiddenSections, deviceMode). Check how the previous version used them and keep that contract.
5. Responsive detection and scroll helpers from `wow-craft/SKILL.md` (nearest scroller, ResizeObserver, `overflow-x-clip`).
6. Build the section sequence. Typography and layout first, motion later.

## Phase 5. Macro pass

Add at least 4 distinct macro choreographies from `motion-cookbook.md` (load, scroll-linked transform, clip reveal, pinned section, background tone shift, velocity effect, shared layout). Each must differ in mechanism, not just in direction. Use only your personality tokens.

## Phase 6. Micro pass

Add at least 12 distinct micro interactions (list in the cookbook). Each has hover or press state and a touch equivalent, a focus-visible state, and the same easing family as the macro pass.

## Phase 7. Responsive pass

Build and review 375, 768, 1280 per `responsive-playbook.md`. Mobile is a different composition, not a narrower desktop. No horizontal overflow. Tap targets 44px.

## Phase 8. QA and export

Follow `qa-and-export.md`: audit script, export sync, typecheck, ledger row. Fix every ERROR.

## Phase 9. Report (8 lines max)

Identity (archetype, fonts, palette, surface, motion), signature moment, collision check result, audit result, export check result, what you could not verify in a browser.

## Common agent failure modes (read and avoid)

1. Copying the structure of Aerovoid or the last template you saw. Fix: Phase 2 and 3 before code.
2. "Unique" interpreted as 3D shapes, particles, toys, HUD. Banned. Unique = design language on real content.
3. Default fonts (system, Inter only). Always load the brief fonts.
4. Default zinc palette plus one accent. Use the brief palette with 7 roles.
5. Everything centered with 3 equal cards. Use asymmetric grids, lists, splits, tables, strips.
6. One global spring everywhere. Use the personality tokens, tween for editorial.
7. Animating everything on mount. Scroll-link and interaction-link instead.
8. Tiny uppercase tracked mono labels as the entire personality. Use one at most per section.
9. Desktop-only; mobile is the desktop stacked. Follow the playbook.
10. Forgetting to regenerate the registry export. Run the sync script.
11. Fake numbers, fake logos, fake reviews, filler sections. Delete.
12. Overwriting working props or customizer behaviour. Keep the contract.
13. Declaring success without running the audit, typecheck and responsive review.
14. Editing other templates or the rules. Out of scope.
15. Signature moment that needs a mouse. Provide a touch version.
16. Using `window` scroll in a preview that scrolls inside a modal. Use the nearest scroller.
17. Hooks inside `.map()`. Make a child component.
18. Large video autoplay without `muted playsInline` and a poster.

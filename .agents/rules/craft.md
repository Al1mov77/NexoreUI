# Craft

Design details that separate a shipped site from a generated one. These are techniques, not a template. Pick what fits your identity brief; do not apply all of them to every template.

## 1. Structure

- Start from the product story: what is the one thing a visitor must understand, believe, and do? Section sequence follows that, not a template skeleton.
- Vary section rhythm: dense, then airy; full-bleed, then contained; text-led, then media-led. Never the same padding and card shape in three sections in a row.
- Asymmetry beats centering. Place the dominant element off-axis, let one element break the grid.
- Maximum 6 to 8 sections. Each has one job (explain, prove, choose, convert). A section that cannot state its job is deleted.
- Navigation form follows the archetype (see identity library): top bar, side rail, index, minimal wordmark only, floating compact bar.

## 2. Type

- Display with `clamp(min, vw, max)`, tracking tightened as size grows (about -0.02em to -0.05em for big sans, 0 to -0.01em for serifs).
- Body 16 to 18px on desktop, never under 15px on mobile. Captions 12 to 13px.
- 55 to 70 characters per line. Use `max-w-[62ch]`.
- Use real typographic details: proper quotes, en dash for ranges, `tabular-nums` for numbers, `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs, `font-feature-settings` (oldstyle or small caps) only where the font supports it.
- Hierarchy through size and weight first, color second.
- Variable fonts: use axes (weight, width, optical size) as design material, always with a static fallback.

## 3. Space and grid

- 8pt base (4 for small elements). Section vertical padding from a scale such as 96, 128, 160 on desktop, 64, 80 on mobile.
- Define the grid in the brief: 12 columns with a 24 gutter, or 6 columns, or a single column with a 640 measure. Align to it. Misalignment must be deliberate.
- Hairline rules (1px, line color) create structure without boxes. Prefer them to cards.

## 4. Surface and depth

- Follow the brief's surface language: radius, border, shadow, texture.
- Realistic shadows are layered: two or three shadows with growing offset and blur, low opacity, tinted by the background, not pure black.
- A specular top highlight (inset 1px light edge) belongs only to the specular dark surface language. Do not add it elsewhere.
- Use scrims (a single directional gradient from background color to transparent) behind text on media, not blur or heavy overlays.
- Grain: a subtle noise overlay (SVG feTurbulence data URI at 3 to 6 percent) can give paper or film feel. Only if the identity wants texture.
- Images: crop with intent (aspect ratios such as 4:5, 3:2, 1:1, 21:9), never leave default 16:9 everywhere. Treat consistently: radius, border, grain or duotone, caption style.

## 5. Signature moment

- Exactly one, chosen from the identity library menu, assigned in the ledger, built on real content, tuned until it feels physical (damping, mass, velocity).
- It is the thing a buyer demos to a client. It must survive mobile in a simplified, still beautiful form.
- Its supporting micro interactions echo its mechanics (same easing, same timing), so the page feels like one system.

## 6. Motion

- Personality tokens from the brief decide every transition. Springs for direct manipulation, tweens with custom easings for editorial reveals.
- Layering: macro (scroll-linked, page-level) sets the stage; micro (hover, press, focus) gives feedback; neither fights the other.
- Reveal only what the eye reaches first; stagger 40 to 90 ms; total reveal under 900 ms.
- Respect `useReducedMotion`: swap movement for opacity, stop scrubs, keep layout identical.
- Never block interaction on an animation. Never loop motion in the background that competes with reading.
- Details list in `template-studio/motion-cookbook.md`.

## 7. Mobile and tablet

- Designed, not squeezed. Mobile 375, tablet 768, desktop 1280 each get an intentional composition (see `responsive-playbook.md`).
- Tap targets 44px, thumb-zone actions at the bottom for app UIs, no hover-only features.
- Replace pinned scrubs with shorter tracks or vertical sequences that still feel choreographed.
- `100svh`/measured scroller height instead of `100vh`. Sticky requires `overflow-x-clip` on ancestors.

## 8. Details that signal quality

- Selection color (`::selection`) from the accent, custom scrollbar only if the identity wants it, visible `:focus-visible` rings styled to the surface language.
- Link underline animations, button press feedback, input label transitions, toast or copy feedback.
- Skeleton or loading states for anything async.
- Empty, error and long-text states exist.
- `aria-label`, alt text, real button and link semantics.

## 9. Copy

- Voice from the brief. Short. Concrete. Real facts only.
- Keep claims you can verify. Remove anything you cannot.
- No filler sections, no testimonial walls, no fake logos.

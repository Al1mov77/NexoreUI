# Extra Recipes

More mechanics for the wow ledger. Same constants as `SKILL.md`: `SPRING`, `SPECULAR`, `useScrollProgress`, `findScroller`.

## Scroll-scrubbed frame sequence (cars, watches, objects)

Extract frames from the video in advance (jpg or webp, 60 to 120 frames, 1280px wide). Draw them to a `<canvas>` according to scroll progress. Never scrub `video.currentTime` directly, it stutters.

```tsx
const frames = useMemo(() => Array.from({ length: COUNT }, (_, i) => `/frames/car/${String(i + 1).padStart(3, "0")}.webp`), []);
const imgs = useRef<HTMLImageElement[]>([]);
useEffect(() => {
  imgs.current = frames.map((src) => { const im = new Image(); im.src = src; return im; });
}, [frames]);

const p = useScrollProgress(trackRef, "track", viewH);
const sp = useSpring(p, { stiffness: 140, damping: 30, mass: 0.5 });
useMotionValueEvent(sp, "change", (v) => {
  const i = Math.min(COUNT - 1, Math.round(v * (COUNT - 1)));
  const im = imgs.current[i]; const c = canvasRef.current; const ctx = c?.getContext("2d");
  if (im?.complete && c && ctx) ctx.drawImage(im, 0, 0, c.width, c.height);
});
```

Synced copy: show one line of text per progress range with `useTransform(sp, [a, b, c, d], [0, 1, 1, 0])` for opacity and a small `y` shift. Canvas size follows the container with a `ResizeObserver`, scaled by `devicePixelRatio` capped at 2.

## Before/after drag

```tsx
const x = useMotionValue(0.5);
const sx = useSpring(x, { stiffness: 300, damping: 30 });
const clip = useTransform(sx, (v) => `inset(0 ${(1 - v) * 100}% 0 0)`);
// after image: style={{ clipPath: clip }}. handle: style={{ left: useTransform(sx, v => `${v*100}%`) }}
// onPointerMove while dragging: x.set(clamp((clientX - rect.left) / rect.width, 0, 1)). Use setPointerCapture.
// Mobile: touch-action: pan-y so vertical scroll still works.
```

## Pinned horizontal story

```tsx
// outer height = viewH * (panels + 0.5), inner sticky top-0 h-[viewH] overflow-hidden
const x = useTransform(sp, [0, 1], ["0%", `-${(panels - 1) * 100}%`]);
<motion.div className="flex h-full" style={{ x, width: `${panels * 100}%` }}>
  {panels.map(...)} {/* each panel w-full shrink-0 */}
</motion.div>
```

Add parallax inside panels: media moves at 0.8x of the track speed using a second `useTransform`. Add a thin progress bar under the story with `scaleX = sp`.

## Pointer-repelled particle field (real spring physics)

Use a canvas, 80 to 200 dots, each with a home position, velocity and spring:

```ts
for (const d of dots) {
  const dx = d.x - mx, dy = d.y - my, dist = Math.hypot(dx, dy);
  if (dist < R) { const f = (1 - dist / R) * 6; d.vx += (dx / dist) * f; d.vy += (dy / dist) * f; }
  d.vx += (d.hx - d.x) * 0.04; d.vy += (d.hy - d.y) * 0.04; // return spring
  d.vx *= 0.88; d.vy *= 0.88; d.x += d.vx; d.y += d.vy;
}
```

Pause the loop when the canvas is off screen (`IntersectionObserver`). Limit count on mobile. Dots can assemble into a logo by sampling a text or SVG mask into home positions on scroll progress.

## SVG path draw for charts and sparklines

```tsx
<motion.path d={d} fill="none" stroke={accent} strokeWidth={1.5}
  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
```

Pointer crosshair: track `onPointerMove`, snap to the nearest data index, show value in a floating label that follows with `useSpring`.

## Shared-element transition (store, portfolio)

Wrap card image and title in `layoutId={`img-${id}`}` and `layoutId={`title-${id}`}`. Open a detail layer in `AnimatePresence` using the same ids. Backdrop fades, content below enters with `y: 24 -> 0`. Close on Escape and on backdrop click.

## Pointer-following preview (portfolio)

```tsx
const x = useSpring(0, { stiffness: 300, damping: 30 });
const y = useSpring(0, { stiffness: 300, damping: 30 });
// window pointermove sets x and y to clientX/Y minus half preview size
// preview card: fixed, pointer-events-none, scale 0.8 -> 1 and opacity 0 -> 1 on row hover, image swapped with AnimatePresence
```

## Command palette

`Cmd/Ctrl + K` toggles. Centered panel with specular border, input, results list. Selection highlight is one `layoutId` bar that slides with arrow keys. `Enter` runs, `Escape` closes. Results filter as you type with FLIP layout animation. Focus is trapped while open.

## Drag-to-reorder list

Use `Reorder.Group` and `Reorder.Item` from framer-motion. Lifted item: `whileDrag={{ scale: 1.03, boxShadow: SPECULAR }}`. Items get `layout` so neighbors slide with springs.

## Liquid or color wash revealed by pointer

Two stacked layers: a neutral layer, and a saturated or colored layer masked by `useMotionTemplate` radial gradient at the pointer. For smoke or vapor, draw soft circles to a canvas with decaying alpha and use that canvas as the mask source via `mask-image`. Always set a good default position for touch devices.

## Performance guard

- Pause rAF loops off screen.
- Cap canvas DPR at 2.
- Keep per-frame work small. No state updates per frame, write to motion values or canvas.
- Reduce counts on mobile and when `useReducedMotion` is true.

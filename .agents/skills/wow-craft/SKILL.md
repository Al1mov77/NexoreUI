---
name: wow-craft
description: Building-block mechanics (scroll helpers, masked word reveals, count-ups, tilt, magnet, CSS 3D plates, responsive detection). Toolbox only, never a composition or style. Use together with template-studio when a brief needs one of these mechanics.
---

# wow-craft

Read `AGENTS.md`, then the `template-studio` skill, first. This file is a toolbox of mechanics.

## What this file is and is not

These are building blocks: scroll math, reveal mechanics, tilt, magnet, 3D plates. They are NOT compositions.

- Never copy a recipe's visual treatment. The values in the recipes below (springs, colors, radii, shadows, textures such as the ripstop grid, the 58 degree plate tilt, the `colorway-ring`) come from one legacy template, Aerovoid. They are placeholders. Replace every value with the tokens of your own identity brief (`.agents/skills/template-studio/identity-library.md`).
- Never reuse the Aerovoid section order (header, hero, three stats, sticky exploded layers, spotlight material, colorway cards, order card, footer). `node scripts/audit-template.js` fails files that contain its fingerprints.
- Use a recipe only when your brief's signature moment or macro/micro pass needs that mechanic.
- The exploded 3D scene is allowed only when the product genuinely has layers or parts. It is never decoration.

Springs: pick the spring of your motion personality (see `template-studio/identity-library.md`, Motion personalities). The 400/30/0.8 spring shown in recipes is only a placeholder.

Root element: `className="relative w-full overflow-x-clip"`. Never `overflow-x-hidden`, it breaks `position: sticky`.


## Responsive detection (works inside preview frames)

```ts
const [width, setWidth] = useState(1200);
useEffect(() => {
  if (!rootRef.current) return;
  const ro = new ResizeObserver((e) => e.forEach((x) => setWidth(x.contentRect.width)));
  ro.observe(rootRef.current);
  return () => ro.disconnect();
}, []);
const isMobile = deviceMode === "mobile" || width < 640;
const isTablet = deviceMode === "tablet" || (!isMobile && width < 1024);
```

## Scroll helpers (nearest scroll container, not window)

```ts
function findScroller(el: HTMLElement | null): HTMLElement | null {
  let p = el?.parentElement ?? null;
  while (p) {
    const o = getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
    p = p.parentElement;
  }
  return null;
}

function useViewHeight(ref: RefObject<HTMLElement | null>) {
  const [h, setH] = useState(800);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const s = findScroller(el);
    const read = () => setH(s ? s.clientHeight : window.innerHeight);
    read();
    if (s) { const ro = new ResizeObserver(read); ro.observe(s); return () => ro.disconnect(); }
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [ref]);
  return h;
}

// "leave": 0 -> 1 as the element scrolls out. "track": 0 -> 1 across a tall sticky track.
function useScrollProgress(ref, kind: "leave" | "track", viewH: number) {
  const mv = useMotionValue(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const s = findScroller(el);
    const update = () => {
      const r = el.getBoundingClientRect();
      const top = s ? s.getBoundingClientRect().top : 0;
      const vh = s ? s.clientHeight : window.innerHeight;
      const total = kind === "track" ? r.height - vh : r.height;
      mv.set(total > 0 ? Math.min(1, Math.max(0, -(r.top - top) / total)) : 0);
    };
    update();
    const t: HTMLElement | Window = s ?? window;
    t.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { t.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [ref, kind, mv, viewH]);
  return mv;
}
```

Usage: `const p = useScrollProgress(ref, "track", viewH); const sp = useSpring(p, { stiffness: 140, damping: 30, mass: 0.5 });` then `useTransform(sp, [0, 1], [a, b])`.

Sticky scene: outer `height = viewH * 3.4`, inner `sticky top-0 overflow-hidden` with `height = viewH` and `paddingTop = headerHeight`.

## Masked word reveal (display type)

```tsx
function SplitWords({ text, className, delay = 0, onView = false }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            {...(onView ? { whileInView: { y: 0 }, viewport: { once: true, margin: "-10% 0px" } } : { animate: { y: 0 } })}
            transition={{ ...SPRING, delay: delay + i * 0.07 }}
          >{w}</motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
```

## Count-up number (once, respects reduced motion)

```tsx
function Counter({ to, suffix = "", delay = 0, duration = 1.8 }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, to, delay, duration, reduce]);
  return <span ref={ref} className="tabular-nums">{Math.round(v).toLocaleString("en-US")}{suffix}</span>;
}
```

## Hero with scroll and pointer response

- Video: `motion.video` with `scale 1.08 -> 1.3`, `filter blur(0) brightness(1) -> blur(14px) brightness(.35)` tied to the hero "leave" progress.
- Headline: `y 0 -> -140`, opacity `1 -> 0` over the first 55 percent.
- Pointer parallax: `useSpring` x/y updated from `onPointerMove` on the hero, video moves by `-18px/-12px` max, title moves the opposite way at 1.4x.
- Vignette: one `linear-gradient(to bottom, rgba(8,9,12,.7), rgba(8,9,12,.12) 35%, rgba(8,9,12,.55) 72%, #08090c)` overlay. Needed for legibility.

## Exploded 3D scene (CSS 3D)

```tsx
<div style={{ perspective: 1400 }} className="relative h-full w-full">
  <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d", rotateX: 58, rotateZ: planeRotate }}>
    {layers.map((l, i) => <Plate key={l.id} index={i} spread={spread} gap={96} ... />)}
  </motion.div>
</div>
```

- `spread = useTransform(sp, [0.04, 0.3], [0, 1])` then each plate `z = (1 - index) * gap * spread`.
- `planeRotate = useTransform(sp, [0, 1], [-40, -22])` keeps the scene alive.
- Active layer index from progress with `useMotionValueEvent` (`<0.5`, `<0.76`, else). Active plate: `animate={{ z: 24, opacity: 1, borderColor: accent }}`, others `opacity .38`.
- Outer plate wrapper has `transformStyle: "preserve-3d"`. The leaf plate (with opacity) has none. Opacity on a preserve-3d element flattens it.
- Textures from gradients: ripstop grid (two line layers at 10px and 50px), baffles (`repeating-linear-gradient(180deg, ...)`), smooth lining (diagonal sheen plus dot grid).
- Colorway changes the shell color with `transition-colors duration-700`.
- Mobile: plate size 190, gap 62, diagram `minmax(0,1fr)` row on top, copy block below.

## Cursor-lit material

```tsx
const x = useSpring(300, { stiffness: 220, damping: 28 });
const y = useSpring(180, { stiffness: 220, damping: 28 });
const mask = useMotionTemplate`radial-gradient(circle 190px at ${x}px ${y}px, #000 0%, transparent 100%)`;
// base layer: dim grid. lit layer: bright grid + accent lines, style={{ maskImage: mask, WebkitMaskImage: mask }}
// onPointerLeave: spring back to a pleasant default so touch devices still look designed.
```

## Tilt card with glare

```tsx
const rx = useSpring(0, { stiffness: 260, damping: 24, mass: 0.6 });
const ry = useSpring(0, { stiffness: 260, damping: 24, mass: 0.6 });
const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), transparent 55%)`;
// onPointerMove: ry = (px - .5) * 12, rx = -(py - .5) * 12, gx/gy = px*100/py*100
// style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} whileHover={{ y: -4 }} whileTap={{ scale: .96 }}
// active ring: <motion.span layoutId="colorway-ring" .../> so it slides between cards
```

## Magnetic button

```tsx
const x = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
const y = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
// onPointerMove: x = (clientX - centerX) * .12, y = (clientY - centerY) * .35. onPointerLeave: 0.
// Label swap with AnimatePresence mode="wait": new label slides in y: 10 -> 0, check icon pops scale 0 -> 1.
```

## Header

- `sticky top-0`, height 64 (mobile) or 80, `marginBottom: -height` so the hero sits behind it.
- Background and border interpolate from transparent to `rgba(8,9,12,.8)` over the first 1.5 percent of page scroll, with `backdrop-blur-xl`.
- Progress line: `motion.div` at the bottom, `scaleX = spring(pageProgress)`, `origin-left`, accent color.
- Links scroll with `scrollIntoView` on `#id` targets queried from the root, not with hash navigation.

## Shared selector pattern

Tabs, size pills and step bars all use the same structure:

```tsx
{active && <motion.span layoutId="unique-id" transition={SPRING} className="absolute inset-0 rounded-lg" style={{ backgroundColor: pill }} />}
<span className="relative">{label}</span>
```

## Final check

Run the audit at the end of `anti-slop.md`. If any item fails, fix it before replying.

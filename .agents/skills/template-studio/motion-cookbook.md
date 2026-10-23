# Motion cookbook

Animation that feels designed comes from variety with a common system. Take the tokens from your motion personality (identity-library section 5). Code uses framer-motion (`motion/react`, as the existing templates do).

## Budget

- Macro: at least 4 choreographies, each with a different mechanism.
- Micro: at least 12 distinct interactions.
- Never more than 3 things moving at once in the viewport unless one is the signature moment.

## Macro menu (pick 4 or more, different mechanisms)

1. **Load choreography.** Order: background tone, headline lines (mask rise or clip), supporting text, nav. Total under 1.2s. Skip on revisit if cheap.
2. **Scroll-linked transform.** `useScroll` target plus `useTransform`: scale, translate, rotate of one element, tied to progress, not time.
3. **Clip-path reveal.** `clipPath: inset(0 0 100% 0)` to `inset(0)` on images and blocks, in view.
4. **Line-mask text reveal.** Each line in `overflow-hidden`, inner line translates from 110 percent.
5. **Pinned section.** `position: sticky` track (height = viewH * n), progress drives content inside.
6. **Background tone shift.** Section background interpolates between palette surfaces via `useTransform` color.
7. **Scroll-velocity effect.** `useVelocity` plus `useSpring` drives skewY or marquee speed.
8. **Shared layout.** `layoutId` transitions between a thumbnail and a detail, or between tabs.
9. **Parallax layers.** Media and caption move at different rates (0.85 and 1.15 of scroll).
10. **Scrubbed number or progress rule.** A rule that draws with scroll while numbers tick.
11. **Horizontal track.** Vertical progress to translateX.
12. **Stack and scale.** Previous sheet scales to .94 and dims while the next overlaps.

## Micro menu (pick 12 or more)

1. Link underline that draws left to right on hover, retracts to the right.
2. Button press: scale or translate, with spring from tokens.
3. Button label swap: old label slides up, new slides in (`AnimatePresence mode="wait"`).
4. Focus-visible ring styled to the surface language, offset 2 to 3px.
5. Input floating label that moves and shrinks.
6. Toggle or switch with a spring thumb.
7. Tab or segmented control with `layoutId` indicator.
8. Image hover: scale 1.04 inside an overflow-hidden mask.
9. Cursor label (desktop only): small follower reading "View" or "Drag" over media.
10. Copy-to-clipboard feedback with icon morph.
11. Number tick on change (digit column rolls).
12. Accordion with measured height and rotated indicator.
13. Toast that slides and settles, auto-dismiss with progress rule.
14. Card tilt on pointer, max 6 degrees, no glare unless the surface language wants it.
15. Magnetic button, 0.12 factor, only on the primary action.
16. Hover row highlight in lists (background sweeps in from the left).
17. Scroll progress hairline in the header.
18. Skeleton shimmer for loading states.
19. Selection highlight color (`::selection`).
20. Staggered list entry on filter change.
21. Drag handle feedback (lift, shadow growth).
22. Tooltip with 8px offset and 120ms delay.

## Snippets (replace values with tokens)

```tsx
// Personality tokens, define once
const MOTION = {
  spring: { type: "spring", stiffness: 520, damping: 38, mass: 0.7 },   // M1 example
  ease: [0.2, 0, 0, 1] as const,
  reveal: 0.5,
  stagger: 0.05,
};
```

```tsx
// Line mask reveal (in view)
function Line({ children, i = 0 }: { children: React.ReactNode; i?: number }) {
  return (
    <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
      <motion.span className="block"
        initial={{ y: "110%" }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: MOTION.reveal, ease: MOTION.ease, delay: i * MOTION.stagger }}>
        {children}
      </motion.span>
    </span>
  );
}
```

```tsx
// Clip reveal for media
<motion.div initial={{ clipPath: "inset(0 0 100% 0)" }} whileInView={{ clipPath: "inset(0 0 0% 0)" }}
  viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
  <motion.img whileHover={{ scale: 1.04 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
</motion.div>
```

```tsx
// Underline draw
<a className="relative inline-block group">
  <span>Label</span>
  <span className="absolute left-0 -bottom-0.5 h-px w-full origin-right scale-x-0 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" style={{ background: "currentColor" }} />
</a>
```

```tsx
// Velocity skew
const v = useVelocity(scrollYProgress);
const sv = useSpring(v, { stiffness: 120, damping: 30 });
const skew = useTransform(sv, [-1, 1], [-4, 4]);
```

```tsx
// Reduced motion
const reduce = useReducedMotion();
const t = reduce ? { duration: 0 } : MOTION.spring;
```

For scroll helpers that read the nearest scroller, copy them from `.agents/skills/wow-craft/SKILL.md`. For longer recipes (frame scrub, before/after, horizontal story, SVG path draw, command palette), see `.agents/skills/wow-craft/recipes.md`, then restyle with your tokens.

## Rules

- A tween easing or spring set per personality. Do not mix three families.
- Scroll-linked values pass through `useSpring` only if the personality is fluid or soft. Mechanical personalities stay linear.
- Animate transform and opacity. Avoid animating layout properties unless using `layout`.
- Always provide the reduced-motion version.

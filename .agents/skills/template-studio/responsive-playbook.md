# Responsive playbook

Three real compositions per template. Desktop 1280, tablet 768, mobile 375. Previews also have a device switcher (`deviceMode` from `useTemplateCustomizer`), so detect with both the container width (ResizeObserver) and `deviceMode`. Breakpoints: mobile under 640, tablet under 1024.

## Principles

- Mobile is a different composition. Re-sequence, re-crop, re-scale. Do not just stack columns.
- Type scales with `clamp()`, not with breakpoints alone. Display never below 2.5rem on mobile, never wraps to 7+ lines.
- Margins: 20 mobile, 32 to 48 tablet, 64 to 120 desktop (per archetype).
- Tap targets at least 44px. No hover-only features: provide tap or scroll-driven equivalents.
- Use measured `viewH` from the scroller (see wow-craft), `svh` units for CSS heights, never bare `100vh`.
- Sticky tracks: shorter on mobile (viewH * 2 to 2.6).
- `overflow-x-clip` on the root. Fix horizontal overflow, do not hide it.
- Images: change the crop per breakpoint (`object-position`, aspect ratio), not just size.
- Large media: poster, `preload="metadata"`, `muted playsInline` for video, no autoplay 4K on mobile.

## Archetype transforms

| Archetype | Tablet | Mobile |
|---|---|---|
| A Editorial split | 6/6 split, smaller crop | image 4:5 first, headline, captions inline |
| B Full-bleed cinematic | full-bleed keeps, headline narrower | portrait crop, chapters 80svh stacked |
| C Swiss poster grid | 8 columns | 4 columns, label above content, rules retained |
| D Product sheet | image over table, 2 col specs | image top, spec as definition list |
| E Stacking sheets | stacking kept, smaller offsets | stacking kept, sheet heading sticky |
| F Horizontal lookbook | horizontal track kept, shorter | vertical frames with snap strips |
| G Manifesto column | column 600 | column full width, larger margin |
| H Bento | 4 columns, merge tiles | 2 columns dense, then single |
| I Sticky split | split 45/55 | sticky 40svh media strip, chapters below |
| J Index list | rows plus inline thumbs | rows with tap-to-expand |
| K Ceremonial | symmetric, tighter | symmetric, fewer ornaments |
| L Brutalist | blocks stay, borders thick | blocks stack, borders 2px |

## Device mode detection

```ts
const [width, setWidth] = useState(1200);
useEffect(() => {
  const el = rootRef.current; if (!el) return;
  const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
  ro.observe(el); return () => ro.disconnect();
}, []);
const isMobile = deviceMode === "mobile" || width < 640;
const isTablet = !isMobile && (deviceMode === "tablet" || width < 1024);
```

## Test matrix (do this before reporting)

For each of 375, 768, 1280, and the preview switcher:
- No horizontal scrollbar.
- Headline fits, no orphan words, no clipped glyphs.
- Signature moment works (or its mobile fallback does).
- Header and menu usable.
- Every tap target reachable, forms usable with the on-screen keyboard height in mind.
- Sticky sections release correctly at the end.
- Reduced motion on: layout identical, nothing broken.

If you cannot run a browser, say so in the report. Do not claim you verified.

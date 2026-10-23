---
name: template-adaptive-preview
description: Standards, formulas, and architecture for multi-device template adaptation across Desktop, Tablet, and Mobile modes. Guarantees templates adapt accurately both in actual browser viewports and inside preview frame switchers (Desktop, Tablet, Mobile buttons).
---

# Template Adaptive Preview Skill

How to build templates in NexoreUI that look like senior design engineering work on **every device** — Desktop, Tablet, and Mobile — without layout breaks, clipped words, or squished columns.

---

## 1. The Core Architecture Problem

### The Tailwind Viewport Trap
Standard Tailwind CSS prefixes (`sm:`, `md:`, `lg:`, `xl:`) evaluate media queries against the **browser window** (`window.innerWidth`), **NOT** against the preview frame container.

When a user on a 1920×1080 desktop monitor clicks the **«Mobile»** (390px) or **«Tablet»** (768px) switcher button:
- The browser window remains 1920px wide.
- Tailwind evaluates `sm:grid-cols-3` or `lg:grid-cols-12` as **true**.
- Result: 3 tiny unreadable columns are squished into a 370px phone mockup, headings are rendered at 8rem, and cards overflow horizontally.

> [!IMPORTANT]
> **Manual browser resize and zoom might work, but toolbar switchers will fail unless templates adapt via JavaScript device state.** Never rely on `sm:`, `md:`, `lg:` for structural column counts, hero typography, or device-specific containers.

---

## 2. Universal Device Detection Pattern

Every template preview must detect device modes using **both** the switcher state (`deviceMode`) and the container width (`ResizeObserver`):

```tsx
/* Container width observation for preview frames & modal vitrines */
const rootRef = useRef<HTMLDivElement>(null);
const [containerWidth, setContainerWidth] = useState(1200);

useEffect(() => {
  if (!rootRef.current) return;
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      setContainerWidth(entry.contentRect.width);
    }
  });
  ro.observe(rootRef.current);
  return () => ro.disconnect();
}, []);

/* Multi-device flags (switches instantly on toolbar click & container resize) */
const isMobile = deviceMode === "mobile" || containerWidth < 640;
const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);
const isDesktop = !isMobile && !isTablet;
```

When building standalone templates for export, provide default props:

```tsx
export default function TemplateName({
  brandName = "BRAND",
  theme = "dark",
  deviceMode = "desktop",
}: {
  brandName?: string;
  theme?: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
}) {
  const isDark = theme === "dark";
  // Apply the same containerWidth + deviceMode logic
}
```

---

## 3. Tablet Ergonomics (Mandatory Rules)

Tablet is **never** just desktop squeezed down, and **never** just oversized mobile. Tablet (~768px – 1024px) requires intentional intermediate design:

1. **Grid Strategy**:
   - 3-column desktop card grids become **2-column** on tablet, or compact 3-column with reduced padding:
     ```tsx
     className={`grid ${
       isMobile ? "grid-cols-1 gap-3" : isTablet ? "grid-cols-2 sm:grid-cols-3 gap-3" : "grid-cols-3 gap-6"
     }`}
     ```
   - 12-column split stages (e.g. 8/4 canvas + specs) collapse vertically into full-width sections on tablet:
     ```tsx
     className={isMobile || isTablet ? "flex flex-col gap-6 w-full" : "grid grid-cols-12 gap-8 items-center"}
     ```

2. **Headline Sizing**:
   - `text-8xl` on a 768px tablet wraps into 4 awkward lines.
   - Use `text-5xl` to `text-6xl` on tablet:
     ```tsx
     className={`font-black uppercase tracking-[-0.04em] leading-[0.92] ${
       isMobile ? "text-3xl" : isTablet ? "text-5xl" : "text-7xl lg:text-8xl"
     }`}
     ```

3. **Section Padding**:
   - Desktop: `px-10 py-32`
   - Tablet: `px-6 py-20` to `px-8 py-24`
   - Mobile: `px-4 py-12` to `px-5 py-16`

4. **3D Models & Interactive Plate Sizes**:
   - Reduce 3D gaps and diameters so sticky scenes still fit the viewport:
     - Desktop: 300px – 320px diameter / 96px gap
     - Tablet: 220px – 240px diameter / 72px gap
     - Mobile: 160px – 180px diameter / 52px gap

5. **Header Navigation on Tablet**:
   - If links crowd the wordmark on 768px, hide the text navigation or collapse it, keeping the wordmark and the primary action button:
     ```tsx
     {!isMobile && !isTablet && (
       <nav className="flex items-center gap-8 text-xs text-zinc-400">
         {/* Links */}
       </nav>
     )}
     ```

---

## 4. Mobile Ergonomics (390px Phone Frame)

1. **Headline Word Integrity**:
   - Never allow single long words (e.g., `AMARENA`, `OBSIDIAN`, `CHRONOMETER`) to break across lines (e.g. `AMARE` on line 1, `NA` on line 2).
   - Wrap each display word into its own block container:
     ```tsx
     <h1 className={isMobile ? "text-3xl leading-[0.92]" : "text-7xl leading-[0.95]"}>
       <div className="flex flex-col">
         <span className="block"><SplitWords text="AMARENA" /></span>
         <span className="block"><SplitWords text="ROYALE" /></span>
       </div>
     </h1>
     ```

2. **Touch Targets (Apple 44px Minimum)**:
   - Every interactive control must have at least `min-h-[44px]` and `min-w-[44px]` tap area.
   - Buttons on mobile: `w-full py-3.5 px-4 text-xs font-bold`.

3. **Touch-Safe Pointer Events**:
   - On interactive sliders, lenses, and scrubbers:
     - Use `pointerId` capturing: `(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)`.
     - Apply `touch-none` strictly to the canvas/handle, **never** to the outer section (which would block scrolling the page).

4. **Static Defaults for Hover Effects**:
   - On mobile/touch, hover does not exist.
   - Tilt cards: skip 3D rotation on pointer move if `isMobile`:
     ```tsx
     onPointerMove={(e) => {
       if (isMobile) return;
       // Compute tilt
     }}
     ```
   - Cursor-lit lenses: default spotlight to the center `(width / 2, height / 2)` so the material looks illuminated by default without requiring a touch.

5. **No Horizontal Scroll**:
   - Root must always have `overflow-x-clip`.
   - Never use `overflow-x-hidden` on the root, as it breaks CSS `position: sticky`.

---

## 5. Summary Cheat Sheet

| Property | Mobile (`isMobile`) | Tablet (`isTablet`) | Desktop (`isDesktop`) |
|---|---|---|---|
| **Hero Title** | `text-3xl` | `text-5xl` | `text-7xl` to `text-8xl` |
| **Hero Height** | `h-[500px]` / `min-h-[480px]` | `h-[620px]` / `min-h-[600px]` | `min-h-[92vh]` |
| **Card Grids** | 1 column (`grid-cols-1`) | 2-3 compact columns | 3 columns |
| **Section Pad**| `px-4 py-12` | `px-6 py-20` | `px-10 py-32` |
| **Inspector View**| `aspect-[4/3] rounded-xl` | `aspect-[16/11] rounded-2xl` | `aspect-[16/9] rounded-2xl` |
| **Primary CTA**| Full width, `py-3.5` | Standard width, `py-4` | Standard width, `py-4` |
| **Nav Links** | Hidden | Hidden if crowded | 3 text links |

---

## 6. Code Export Checklist

When exporting code to the CLI registry (`packages/cli/src/registry/template-*.ts`):
1. **Never truncate code.** Code must be 100% complete with all sub-components and types.
2. **Prop interface:** Accept `{ brandName, theme, deviceMode }`.
3. **No context dependency in export:** Replace docs-only context imports (`useTemplateCustomizer`) with standard props and internal state.
4. **Self-contained:** The exported file must run directly after `npx nexoreui add <template-name>` without missing helper files.

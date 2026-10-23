"use client";

import React, { useEffect, useRef, useState, RefObject } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

/* ───────────────────────────────────────────────────────────────────────────
   Tokens
─────────────────────────────────────────────────────────────────────────── */

const SPRING = { type: "spring", stiffness: 400, damping: 30, mass: 0.8 } as const;
const TILT = { stiffness: 260, damping: 24, mass: 0.6 } as const;

const SPECULAR =
  "inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 8px 32px -4px rgba(0, 0, 0, 0.5)";

type ColorwayKey = "obsidian" | "glacier" | "graphite";

const COLORWAYS: Record<
  ColorwayKey,
  { name: string; accent: string; shell: string; line: string; note: string }
> = {
  obsidian: {
    name: "Obsidian",
    accent: "#7dd3fc",
    shell: "#0a0c10",
    line: "rgba(255,255,255,0.07)",
    note: "Matte black shell, cold blue zipper tape.",
  },
  glacier: {
    name: "Glacier",
    accent: "#22d3ee",
    shell: "#aab4c0",
    line: "rgba(0,0,0,0.14)",
    note: "Light grey shell, reflective seam tape.",
  },
  graphite: {
    name: "Graphite",
    accent: "#a5b4fc",
    shell: "#2a2e39",
    line: "rgba(255,255,255,0.08)",
    note: "Charcoal shell, soft violet-grey detailing.",
  },
};

const LAYERS = [
  {
    label: "Shell",
    title: "Waterproof face fabric, taped at every seam.",
    body: "Ripstop nylon bonded to a waterproof membrane. The surface is treated so rain beads up and rolls off instead of soaking in.",
    figure: 30000,
    unit: " mm",
    caption: "Waterproof rating",
  },
  {
    label: "Insulation",
    title: "950 fill power goose down in box-wall baffles.",
    body: "The baffles keep the down evenly spread across the chest and shoulders, so there are no cold spots. The down keeps its loft when damp.",
    figure: 950,
    unit: " FP",
    caption: "Fill power",
  },
  {
    label: "Lining",
    title: "A smooth lining that moves moisture out.",
    body: "Low-friction inner fabric slides over mid-layers and vents sweat while you walk, so you stay dry from the inside too.",
    figure: 36000,
    unit: " g/m²",
    caption: "Breathability per 24h",
  },
] as const;

const SIZES = ["S", "M", "L", "XL"] as const;

/* ───────────────────────────────────────────────────────────────────────────
   Scroll helpers
   The preview lives inside a scrolling modal, so we find the nearest scroll
   container instead of assuming window.
─────────────────────────────────────────────────────────────────────────── */

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
    const el = ref.current;
    if (!el) return;
    const scroller = findScroller(el);
    const read = () => setH(scroller ? scroller.clientHeight : window.innerHeight);
    read();
    if (scroller) {
      const ro = new ResizeObserver(read);
      ro.observe(scroller);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [ref]);
  return h;
}

/** kind "leave": 0 -> 1 while the element scrolls out of view.
 *  kind "track": 0 -> 1 while a tall element passes through the viewport (sticky sections). */
function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  kind: "leave" | "track",
  viewH: number
) {
  const mv = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const scroller = findScroller(el);
    const update = () => {
      const r = el.getBoundingClientRect();
      const top = scroller ? scroller.getBoundingClientRect().top : 0;
      const vh = scroller ? scroller.clientHeight : window.innerHeight;
      const rel = r.top - top;
      const total = kind === "track" ? r.height - vh : r.height;
      mv.set(total > 0 ? Math.min(1, Math.max(0, -rel / total)) : 0);
    };
    update();
    const target: HTMLElement | Window = scroller ?? window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, kind, mv, viewH]);
  return mv;
}

/* ───────────────────────────────────────────────────────────────────────────
   Small building blocks
─────────────────────────────────────────────────────────────────────────── */

function SplitWords({
  text,
  className,
  delay = 0,
  onView = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  onView?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            {...(onView
              ? { whileInView: { y: 0 }, viewport: { once: true, margin: "-10% 0px" } }
              : { animate: { y: 0 } })}
            transition={{ ...SPRING, delay: delay + i * 0.07 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

function Counter({
  to,
  suffix = "",
  delay = 0,
  duration = 1.8,
}: {
  to: number;
  suffix?: string;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: reduce ? 0 : duration,
      delay: reduce ? 0 : delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (x) => setV(x),
    });
    return () => c.stop();
  }, [inView, to, delay, duration, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {Math.round(v).toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

function MagneticButton({
  children,
  onClick,
  className,
  style,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const x = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.12);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
      style={{ x, y, ...style }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Exploded layer diagram
─────────────────────────────────────────────────────────────────────────── */

function plateTexture(index: number, shell: string, line: string): React.CSSProperties {
  if (index === 0) {
    return {
      backgroundColor: shell,
      backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px), linear-gradient(${line} 2px, transparent 2px), linear-gradient(90deg, ${line} 2px, transparent 2px)`,
      backgroundSize: "10px 10px, 10px 10px, 50px 50px, 50px 50px",
    };
  }
  if (index === 1) {
    return {
      backgroundColor: "#171a22",
      backgroundImage:
        "repeating-linear-gradient(180deg, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 1px, rgba(255,255,255,0.06) 3px, rgba(0,0,0,0.38) 40px, rgba(255,255,255,0.16) 41px)",
    };
  }
  return {
    backgroundColor: "#12141a",
    backgroundImage:
      "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0) 60%), radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
    backgroundSize: "100% 100%, 14px 14px",
  };
}

function Plate({
  index,
  spread,
  gap,
  size,
  active,
  accent,
  shell,
  line,
  label,
}: {
  index: number;
  spread: MotionValue<number>;
  gap: number;
  size: number;
  active: number;
  accent: string;
  shell: string;
  line: string;
  label: string;
}) {
  const z = useTransform(spread, (v) => (1 - index) * gap * v);
  const isActive = active === index;
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        z,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl overflow-hidden transition-colors duration-700"
        animate={{
          z: isActive ? 24 : 0,
          opacity: isActive ? 1 : 0.38,
          borderColor: isActive ? accent : "rgba(255,255,255,0.14)",
        }}
        transition={SPRING}
        style={{
          ...plateTexture(index, shell, line),
          borderWidth: 1,
          borderStyle: "solid",
          boxShadow: SPECULAR,
        }}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <span
          className="absolute left-3 top-3 font-mono text-[10px] tracking-[0.2em] uppercase"
          style={{ color: index === 0 && shell === "#aab4c0" ? "#18181b" : "#e4e4e7" }}
        >
          {String(index + 1).padStart(2, "0")} {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Fabric spotlight
─────────────────────────────────────────────────────────────────────────── */

function Weave({ accent, isMobile }: { accent: string; isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(300, { stiffness: 220, damping: 28 });
  const y = useSpring(180, { stiffness: 220, damping: 28 });

  const center = () => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(r.width * 0.68);
    y.set(r.height * 0.4);
  };

  useEffect(() => {
    center();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mask = useMotionTemplate`radial-gradient(circle 190px at ${x}px ${y}px, #000 0%, transparent 100%)`;

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={center}
      className="relative overflow-hidden rounded-2xl border cursor-crosshair"
      style={{
        height: isMobile ? 360 : 460,
        backgroundColor: "#0a0c10",
        borderColor: "rgba(255,255,255,0.1)",
        boxShadow: SPECULAR,
        touchAction: "pan-y",
      }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Base weave */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* Lit weave, revealed under the pointer */}
      <motion.div
        className="absolute inset-0 transition-[background-image] duration-500"
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(${accent} 2px, transparent 2px), linear-gradient(90deg, ${accent} 2px, transparent 2px)`,
          backgroundSize: "12px 12px, 12px 12px, 60px 60px, 60px 60px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />

      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
        <h3
          className={`font-black tracking-[-0.04em] leading-[1] text-white ${
            isMobile ? "text-4xl" : "text-6xl"
          }`}
        >
          Ripstop, up close.
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
          A heavier thread every 5 mm stops a small snag from becoming a tear.
          Move over the fabric to see the grid.
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Colorway card
─────────────────────────────────────────────────────────────────────────── */

function ColorwayCard({
  data,
  active,
  onSelect,
  surface,
  border,
  muted,
}: {
  data: (typeof COLORWAYS)[ColorwayKey];
  active: boolean;
  onSelect: () => void;
  surface: string;
  border: string;
  muted: string;
}) {
  const rx = useSpring(0, TILT);
  const ry = useSpring(0, TILT);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), transparent 55%)`;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 12);
        rx.set(-(py - 0.5) * 12);
        gx.set(px * 100);
        gy.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        gx.set(50);
        gy.set(50);
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 900,
        backgroundColor: surface,
        borderColor: border,
        boxShadow: SPECULAR,
      }}
      className="relative text-left rounded-2xl border p-4 cursor-pointer"
    >
      <div
        className="relative h-36 rounded-xl overflow-hidden"
        style={{
          backgroundColor: data.shell,
          backgroundImage: `linear-gradient(${data.line} 1px, transparent 1px), linear-gradient(90deg, ${data.line} 1px, transparent 1px)`,
          backgroundSize: "10px 10px",
        }}
      >
        <div
          className="absolute right-5 inset-y-0 w-1.5"
          style={{ backgroundColor: data.accent }}
        />
        <motion.div className="absolute inset-0" style={{ background: glare }} />
      </div>

      <div className="mt-4 px-1 pb-1">
        <div className="text-base font-bold tracking-[-0.02em]">{data.name}</div>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: muted }}>
          {data.note}
        </p>
      </div>

      {active && (
        <motion.span
          layoutId="colorway-ring"
          transition={SPRING}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1.5px solid ${data.accent}` }}
        />
      )}
    </motion.button>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Template
─────────────────────────────────────────────────────────────────────────── */

export function AerovoidObsidianPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const isDark = config.theme === "dark";
  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(1200);
  useEffect(() => {
    if (!rootRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });
    ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  const isMobile = deviceMode === "mobile" || width < 640;
  const isTablet = deviceMode === "tablet" || (!isMobile && width < 1024);

  const viewH = useViewHeight(rootRef);
  const headerH = isMobile ? 64 : 80;
  const heroH = Math.min(Math.max(viewH, 560), 880);
  const trackH = viewH * 3.4;

  /* Scroll-driven values */
  const rootP = useScrollProgress(rootRef, "track", viewH);
  const rootSpring = useSpring(rootP, { stiffness: 200, damping: 34, mass: 0.4 });
  const heroP = useScrollProgress(heroRef, "leave", viewH);
  const heroSpring = useSpring(heroP, { stiffness: 120, damping: 28, mass: 0.4 });
  const trackP = useScrollProgress(trackRef, "track", viewH);
  const trackSpring = useSpring(trackP, { stiffness: 140, damping: 30, mass: 0.5 });

  const headerBg = useTransform(rootP, [0, 0.015], ["rgba(8,9,12,0)", "rgba(8,9,12,0.8)"]);
  const headerBorder = useTransform(
    rootP,
    [0, 0.015],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.1)"]
  );

  const videoScale = useTransform(heroSpring, [0, 1], [1.08, 1.3]);
  const videoFilter = useTransform(
    heroSpring,
    [0, 1],
    ["blur(0px) brightness(1)", "blur(14px) brightness(0.35)"]
  );
  const titleY = useTransform(heroSpring, [0, 1], [0, -140]);
  const titleOpacity = useTransform(heroSpring, [0, 0.55], [1, 0]);
  const statsOpacity = useTransform(heroSpring, [0, 0.4], [1, 0]);

  const px = useSpring(0, { stiffness: 80, damping: 22 });
  const py = useSpring(0, { stiffness: 80, damping: 22 });
  const titleX = useTransform(px, (v) => -v * 1.4);

  /* Exploded layers */
  const spread = useTransform(trackSpring, [0.04, 0.3], [0, 1]);
  const planeRotate = useTransform(trackSpring, [0, 1], [-40, -22]);
  const hintOpacity = useTransform(trackSpring, [0, 0.08], [1, 0]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(trackP, "change", (v) => setActive(v < 0.5 ? 0 : v < 0.76 ? 1 : 2));

  /* State */
  const [colorway, setColorway] = useState<ColorwayKey>("obsidian");
  const [size, setSize] = useState<(typeof SIZES)[number]>("M");
  const [added, setAdded] = useState(false);

  const current = COLORWAYS[colorway];
  const layer = LAYERS[active];

  /* Palette */
  const fg = isDark ? "#f4f4f5" : "#18181b";
  const muted = isDark ? "#a1a1aa" : "#52525b";
  const bg = isDark ? "#08090c" : "#fafafa";
  const surface = isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.9)";
  const border = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(24, 24, 27, 0.1)";
  const pill = isDark ? "rgba(255,255,255,0.08)" : "rgba(24,24,27,0.06)";

  const brand = config.brandName || "Aerovoid";
  const sectionPad = isMobile ? "px-5 py-20" : "px-10 py-32";
  const plateSize = isMobile ? 190 : isTablet ? 240 : 290;
  const plateGap = isMobile ? 62 : 96;

  const go = (id: string) => {
    rootRef.current
      ?.querySelector(`#aero-${id}`)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-clip font-sans selection:bg-white/20"
      style={{ backgroundColor: bg, color: fg }}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <motion.header
        className="sticky top-0 z-40 flex items-center justify-between backdrop-blur-xl border-b"
        style={{
          height: headerH,
          marginBottom: -headerH,
          paddingInline: isMobile ? 20 : 40,
          backgroundColor: headerBg,
          borderBottomColor: headerBorder,
        }}
      >
        <span className="text-sm font-bold tracking-[-0.02em] text-white">{brand}</span>

        {!isMobile && (
          <nav className="flex items-center gap-8 text-xs text-zinc-300">
            {[
              ["construction", "Construction"],
              ["weave", "Fabric"],
              ["colorways", "Colorways"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {label}
              </button>
            ))}
          </nav>
        )}

        <motion.button
          type="button"
          onClick={() => go("order")}
          whileTap={{ scale: 0.96 }}
          transition={SPRING}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-white text-zinc-950 cursor-pointer"
        >
          Buy
        </motion.button>

        <motion.div
          className="absolute bottom-0 inset-x-0 h-px origin-left"
          style={{ scaleX: rootSpring, backgroundColor: current.accent }}
        />
      </motion.header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        onPointerMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set(((e.clientX - r.left) / r.width - 0.5) * -18);
          py.set(((e.clientY - r.top) / r.height - 0.5) * -12);
        }}
        className="relative w-full overflow-hidden flex flex-col"
        style={{ height: heroH }}
      >
        <motion.video
          src="/videos/aerovoid-obsidian-parka.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ scale: videoScale, filter: videoFilter, x: px, y: py }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,9,12,0.7) 0%, rgba(8,9,12,0.12) 35%, rgba(8,9,12,0.55) 72%, #08090c 100%)",
          }}
        />

        <motion.div
          className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5"
          style={{ y: titleY, x: titleX, opacity: titleOpacity }}
        >
          <h1
            className={`font-black leading-[0.95] tracking-[-0.04em] text-white ${
              isMobile ? "text-5xl" : isTablet ? "text-7xl" : "text-8xl"
            }`}
          >
            <SplitWords text={config.heroTitle || "Built for the cold."} delay={0.1} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.55 }}
            className={`mt-6 text-zinc-300 max-w-md ${isMobile ? "text-sm" : "text-base"}`}
          >
            {config.heroSubtitle ||
              "A waterproof down parka with a 950 fill power core. One jacket for the whole winter."}
          </motion.p>
        </motion.div>

        <motion.div
          className="relative z-10 grid grid-cols-3 border-t"
          style={{
            opacity: statsOpacity,
            borderColor: "rgba(255,255,255,0.12)",
            marginInline: isMobile ? 20 : 40,
            paddingTop: isMobile ? 20 : 24,
            paddingBottom: isMobile ? 24 : 40,
          }}
        >
          {[
            { to: 30000, suffix: " mm", l: "Waterproof" },
            { to: 950, suffix: " FP", l: "Goose down" },
            { to: -40, suffix: "°C", l: "Tested to" },
          ].map((s, i) => (
            <div key={s.l}>
              <div
                className={`font-bold tracking-[-0.03em] text-white ${
                  isMobile ? "text-base" : "text-3xl"
                }`}
              >
                <Counter to={s.to} suffix={s.suffix} delay={0.8 + i * 0.12} />
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400 mt-1">
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Construction: sticky exploded view ───────────────────────────── */}
      <div id="aero-construction" ref={trackRef} className="relative" style={{ height: trackH }}>
        <div
          className="sticky top-0 overflow-hidden"
          style={{ height: viewH, paddingTop: headerH }}
        >
          <div
            className={`h-full max-w-6xl mx-auto grid items-center gap-4 ${
              isMobile ? "grid-rows-[minmax(0,1fr)_auto] px-5 pb-6" : "grid-cols-2 px-10 gap-12"
            }`}
          >
            {/* Diagram */}
            <div
              className={`relative h-full w-full ${isMobile ? "" : "order-2"}`}
              style={{ perspective: 1400 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  transformStyle: "preserve-3d",
                  rotateX: 58,
                  rotateZ: planeRotate,
                }}
              >
                {LAYERS.map((l, i) => (
                  <Plate
                    key={l.label}
                    index={i}
                    spread={spread}
                    gap={plateGap}
                    size={plateSize}
                    active={active}
                    accent={current.accent}
                    shell={current.shell}
                    line={current.line}
                    label={l.label}
                  />
                ))}
              </motion.div>

              <motion.div
                className="absolute bottom-2 inset-x-0 text-center font-mono text-[10px] tracking-[0.2em] uppercase"
                style={{ opacity: hintOpacity, color: muted }}
              >
                Scroll to separate the layers
              </motion.div>
            </div>

            {/* Copy */}
            <div className={isMobile ? "" : "order-1"}>
              <h2
                className={`font-black tracking-[-0.04em] leading-[1] ${
                  isMobile ? "text-3xl" : isTablet ? "text-5xl" : "text-6xl"
                }`}
              >
                <SplitWords text="Three layers. One job each." onView />
              </h2>

              <div className={`${isMobile ? "mt-5" : "mt-10"} space-y-1`}>
                {LAYERS.map((l, i) => {
                  const on = i === active;
                  return (
                    <div
                      key={l.label}
                      className="relative flex items-center gap-3 py-1.5 pl-4 transition-colors duration-300"
                      style={{ color: on ? fg : muted }}
                    >
                      {on && (
                        <motion.span
                          layoutId="layer-bar"
                          transition={SPRING}
                          className="absolute left-0 inset-y-1 w-0.5 rounded-full"
                          style={{ backgroundColor: current.accent }}
                        />
                      )}
                      <span className="font-mono text-[10px] tracking-[0.2em]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base font-semibold tracking-[-0.02em]">
                        {l.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className={isMobile ? "mt-4" : "mt-8"} style={{ minHeight: isMobile ? 150 : 210 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={layer.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={SPRING}
                  >
                    <div
                      className={`font-black tracking-[-0.04em] leading-none ${
                        isMobile ? "text-4xl" : "text-6xl"
                      }`}
                      style={{ color: current.accent }}
                    >
                      {layer.figure.toLocaleString("en-US")}
                      {layer.unit}
                    </div>
                    <div
                      className="font-mono text-[10px] tracking-[0.2em] uppercase mt-2"
                      style={{ color: muted }}
                    >
                      {layer.caption}
                    </div>
                    <h3
                      className={`font-bold tracking-[-0.02em] leading-snug ${
                        isMobile ? "mt-3 text-base" : "mt-6 text-xl"
                      }`}
                    >
                      {layer.title}
                    </h3>
                    <p
                      className={`mt-2 leading-relaxed max-w-md ${isMobile ? "text-xs" : "text-sm"}`}
                      style={{ color: muted }}
                    >
                      {layer.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fabric ───────────────────────────────────────────────────────── */}
      <section id="aero-weave" className={`max-w-6xl mx-auto ${sectionPad}`}>
        <Reveal>
          <Weave accent={current.accent} isMobile={isMobile} />
        </Reveal>
      </section>

      {/* ── Colorways ────────────────────────────────────────────────────── */}
      <section id="aero-colorways" className={`max-w-5xl mx-auto ${sectionPad} pt-0`}>
        <h2
          className={`font-black tracking-[-0.04em] leading-[1] ${
            isMobile ? "text-4xl" : "text-6xl"
          }`}
        >
          <SplitWords text="Pick a color." onView />
        </h2>

        <div className={`mt-12 grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
          {(Object.keys(COLORWAYS) as ColorwayKey[]).map((key, i) => (
            <Reveal key={key} delay={i * 0.08}>
              <ColorwayCard
                data={COLORWAYS[key]}
                active={key === colorway}
                onSelect={() => setColorway(key)}
                surface={surface}
                border={border}
                muted={muted}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Order ────────────────────────────────────────────────────────── */}
      <section id="aero-order" className={`max-w-3xl mx-auto ${sectionPad} pt-0`}>
        <Reveal>
          <div
            className="relative rounded-2xl border p-8 overflow-hidden"
            style={{ backgroundColor: surface, borderColor: border, boxShadow: SPECULAR }}
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <h2 className="text-3xl font-black tracking-[-0.04em]">{brand} Parka</h2>
                <div className="mt-2 flex items-center gap-2 text-sm" style={{ color: muted }}>
                  <span
                    className="w-3 h-3 rounded-full transition-colors duration-500"
                    style={{ backgroundColor: current.accent }}
                  />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current.name}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                    >
                      {current.name}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <div className="text-3xl font-black tracking-[-0.04em] tabular-nums">$1,480</div>
            </div>

            <div className="mt-8">
              <div
                className="font-mono text-[10px] tracking-[0.2em] uppercase"
                style={{ color: muted }}
              >
                Size
              </div>
              <div
                className="mt-3 inline-flex p-1 rounded-xl border"
                style={{ borderColor: border }}
              >
                {SIZES.map((s) => {
                  const on = s === size;
                  return (
                    <motion.button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      whileTap={{ scale: 0.96 }}
                      transition={SPRING}
                      className="relative w-14 h-10 text-sm font-semibold cursor-pointer"
                      style={{ color: on ? fg : muted }}
                    >
                      {on && (
                        <motion.span
                          layoutId="size-pill"
                          transition={SPRING}
                          className="absolute inset-0 rounded-lg"
                          style={{ backgroundColor: pill }}
                        />
                      )}
                      <span className="relative">{s}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <MagneticButton
              onClick={handleAdd}
              className="mt-8 w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors duration-500"
              style={{ backgroundColor: current.accent, color: "#08090c" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={SPRING}
                    className="flex items-center gap-2"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={SPRING}
                      className="flex"
                    >
                      <Check className="w-4 h-4" />
                    </motion.span>
                    Added to cart
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={SPRING}
                    className="flex items-center gap-2"
                  >
                    Add to cart, size {size}
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </MagneticButton>

            <p className="mt-4 text-xs text-center" style={{ color: muted }}>
              Free shipping. 30-day returns.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="border-t px-5 sm:px-10 py-8 flex items-center justify-between text-xs"
        style={{ borderColor: border, color: muted }}
      >
        <span>{brand}</span>
        <span>Outerwear for winter</span>
      </footer>
    </div>
  );
}

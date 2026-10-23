"use client";

import React, { useEffect, useRef, useState, RefObject } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

/* ───────────────────────────────────────────────────────────────────────────
   Constants & Motion Tokens
   ─────────────────────────────────────────────────────────────────────────── */

const SPRING = { type: "spring", stiffness: 400, damping: 30, mass: 0.8 } as const;
const TILT = { stiffness: 260, damping: 24, mass: 0.6 } as const;

type EditionKey = "royale" | "chantilly" | "noir";

interface Edition {
  id: EditionKey;
  name: string;
  tagline: string;
  cacao: string;
  accentDark: string;
  accentLight: string;
  notes: string;
  priceFour: number;
  priceEight: number;
}

const EDITIONS: Record<EditionKey, Edition> = {
  royale: {
    id: "royale",
    name: "Amarena Royale",
    tagline: "Wild stone-fruit reduction, 70% dark sponge, Bourbon chantilly.",
    cacao: "70% Sur del Lago",
    accentDark: "#fb7185",
    accentLight: "#be123c",
    notes: "Wild Emilia-Romagna cherries slow-steeped for 96 hours, paired with single-origin Venezuelan chocolate and hand-laid gold flakes.",
    priceFour: 48,
    priceEight: 88,
  },
  chantilly: {
    id: "chantilly",
    name: "Chantilly d'Or",
    tagline: "Double-whipped mascarpone, bean caviar, fleur de sel caramel.",
    cacao: "66% Grand Cru",
    accentDark: "#fbbf24",
    accentLight: "#b45309",
    notes: "Madagascar bourbon vanilla caviar folded into chilled Normandie cream over a crisp hazelnut sablé base.",
    priceFour: 46,
    priceEight: 84,
  },
  noir: {
    id: "noir",
    name: "Noir Absolu",
    tagline: "Single-estate 80% ganache, tart griotte coulis, smoked sea salt.",
    cacao: "80% Sur del Lago",
    accentDark: "#f43f5e",
    accentLight: "#9f1239",
    notes: "Unsweetened dark chocolate conche with high fruit acidity, balanced by tart wild cherries and mineral flake salt.",
    priceFour: 52,
    priceEight: 96,
  },
};

const STATS = [
  { figure: 70, suffix: "%", label: "Sur del Lago cacao" },
  { figure: 96, suffix: "h", label: "Cherry maceration" },
  { figure: 4, suffix: "°C", label: "Serving temperature" },
] as const;

const ANATOMY = [
  {
    title: "Crisp 70% shell",
    detail: "Hand-tempered chocolate dome with an audible snap. Finished with a high-gloss glaze.",
    metric: "31.5°C",
    caption: "Temper set",
  },
  {
    title: "Bourbon chantilly",
    detail: "Double-emulsified mascarpone whipped with scraped Madagascar vanilla pods.",
    metric: "38%",
    caption: "Butterfat density",
  },
  {
    title: "Molten cherry core",
    detail: "Whole wild amarena cherries reduced in their natural ruby syrup.",
    metric: "64°",
    caption: "Brix concentration",
  },
] as const;

/* ───────────────────────────────────────────────────────────────────────────
   Scroll Helpers (Modal-safe scroller detection)
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

function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  kind: "leave" | "track"
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
  }, [ref, kind, mv]);
  return mv;
}

/* ───────────────────────────────────────────────────────────────────────────
   Micro-components
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
          className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
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

function Counter({
  to,
  suffix = "",
  delay = 0,
  duration = 1.6,
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
      onUpdate: (val) => setV(val),
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
   SIGNATURE WOW MOMENT: Spring-Damped Cleave (Cross-Section Split Inspector)
   ─────────────────────────────────────────────────────────────────────────── */

function CleaveInspector({
  isDark,
  accent,
  isMobile,
  isTablet,
}: {
  isDark: boolean;
  accent: string;
  isMobile: boolean;
  isTablet: boolean;
}) {
  const [split, setSplit] = useState(0.5);
  const splitSpring = useSpring(0.5, SPRING);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateSplitFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const pct = Math.min(0.96, Math.max(0.04, (clientX - r.left) / r.width));
    setSplit(pct);
    splitSpring.set(pct);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateSplitFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    updateSplitFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const setPreset = (target: number) => {
    setSplit(target);
    splitSpring.set(target);
  };

  const splitPct = useTransform(splitSpring, (v) => `${(v * 100).toFixed(2)}%`);
  const leftClip = useTransform(splitSpring, (v) => `inset(0 ${(100 - v * 100).toFixed(2)}% 0 0)`);
  const rightClip = useTransform(splitSpring, (v) => `inset(0 0 0 ${(v * 100).toFixed(2)}%)`);

  return (
    <div className={isMobile ? "space-y-3" : "space-y-6"}>
      {/* Interactive Lens Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative w-full overflow-hidden select-none cursor-ew-resize border touch-none ${
          isMobile
            ? "aspect-[4/3] rounded-xl"
            : isTablet
            ? "aspect-[16/11] rounded-2xl"
            : "aspect-[16/9] rounded-2xl"
        }`}
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          boxShadow: isDark
            ? "inset 0 1px 0 0 rgba(255,255,255,0.12), 0 8px 32px -4px rgba(0,0,0,0.5)"
            : "inset 0 1px 0 0 rgba(255,255,255,0.8), 0 8px 24px -4px rgba(0,0,0,0.06)",
        }}
      >
        {/* Top specular ray */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent z-30 pointer-events-none" />

        {/* ─── LEFT: Exterior Glazed Dome ─── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
          style={{
            clipPath: leftClip,
            backgroundColor: isDark ? "#0c080a" : "#f5edea",
          }}
        >
          {/* Subtle texture grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: isDark
                ? "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)"
                : "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Exterior Artwork Simulation */}
          <div
            className={`relative rounded-full flex items-center justify-center ${
              isMobile
                ? "w-40 h-40"
                : isTablet
                ? "w-56 h-56"
                : "w-72 h-72"
            }`}
          >
            {/* Ambient Shadow */}
            <div className="absolute inset-0 rounded-full bg-black/40 blur-xl transform translate-y-3" />

            {/* Tempered Chocolate Dome */}
            <div
              className={`relative rounded-full overflow-hidden border ${
                isMobile
                  ? "w-32 h-32"
                  : isTablet
                  ? "w-44 h-44"
                  : "w-60 h-60"
              }`}
              style={{
                background: isDark
                  ? "radial-gradient(circle at 35% 30%, #2a1118 0%, #17070b 55%, #080305 100%)"
                  : "radial-gradient(circle at 35% 30%, #471e28 0%, #260c13 55%, #150508 100%)",
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.15)",
                boxShadow: "inset -8px -12px 28px rgba(0,0,0,0.8), inset 6px 8px 18px rgba(255,255,255,0.18)",
              }}
            >
              {/* Specular Ray on Dome */}
              <div
                className="absolute top-3 left-4 sm:top-6 sm:left-8 w-14 sm:w-20 h-6 sm:h-10 rounded-full transform -rotate-25 blur-sm pointer-events-none"
                style={{ background: "rgba(255, 255, 255, 0.22)" }}
              />

              {/* Hand-laid 24K Gold Leaf Flecks */}
              <div
                className="absolute top-8 right-8 w-2 h-1.5 rotate-12 rounded-sm"
                style={{ backgroundColor: "#fbbf24", boxShadow: "0 0 8px rgba(251,191,36,0.6)" }}
              />
              <div
                className="absolute top-14 right-12 w-1.5 h-1 -rotate-45 rounded-sm"
                style={{ backgroundColor: "#fef08a", boxShadow: "0 0 6px rgba(254,240,138,0.7)" }}
              />
              <div
                className="absolute bottom-10 left-10 w-2 h-1 rotate-35 rounded-sm"
                style={{ backgroundColor: "#f59e0b", boxShadow: "0 0 6px rgba(245,158,11,0.5)" }}
              />

              {/* Crown Candied Cherry */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                  isMobile ? "w-9 h-9" : isTablet ? "w-14 h-14" : "w-18 h-18"
                }`}
                style={{
                  background: "radial-gradient(circle at 35% 32%, #e11d48 0%, #881337 55%, #4c0519 100%)",
                  borderColor: "rgba(255,255,255,0.2)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.6), inset 2px 3px 6px rgba(255,255,255,0.35)",
                }}
              >
                <div className="absolute top-1 left-2 w-3 h-1.5 rounded-full bg-white/40 -rotate-20" />
              </div>
            </div>
          </div>

          {/* Corner Caption */}
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 pointer-events-none">
            <span
              className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded border backdrop-blur-md"
              style={{
                backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.75)",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                color: isDark ? "#f4f4f5" : "#18181b",
              }}
            >
              Exterior Shell
            </span>
          </div>
        </motion.div>

        {/* ─── RIGHT: Interior Cross-Section ─── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
          style={{
            clipPath: rightClip,
            backgroundColor: isDark ? "#080608" : "#f1e8e5",
          }}
        >
          {/* Subtle texture grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: isDark
                ? "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)"
                : "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Cross-section Artwork */}
          <div
            className={`relative rounded-full flex items-center justify-center ${
              isMobile
                ? "w-40 h-40"
                : isTablet
                ? "w-56 h-56"
                : "w-72 h-72"
            }`}
          >
            {/* Ambient Shadow */}
            <div className="absolute inset-0 rounded-full bg-black/40 blur-xl transform translate-y-3" />

            {/* Cleaved Hemisphere Cross-section */}
            <div
              className={`relative rounded-full overflow-hidden border p-2 flex flex-col justify-end ${
                isMobile
                  ? "w-32 h-32"
                  : isTablet
                  ? "w-44 h-44"
                  : "w-60 h-60"
              }`}
              style={{
                backgroundColor: isDark ? "#170a0e" : "#32161e",
                borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)",
                boxShadow: "inset 0 0 32px rgba(0,0,0,0.85)",
              }}
            >
              {/* Outer Shell Ring */}
              <div
                className="absolute inset-0 rounded-full border-2 sm:border-3 pointer-events-none"
                style={{ borderColor: "#1e0b11" }}
              />

              {/* Layer 1: Aerated Sponge Base */}
              <div
                className={`relative w-full rounded-b-full border-t flex items-center justify-center overflow-hidden ${
                  isMobile ? "h-12" : isTablet ? "h-16" : "h-20"
                }`}
                style={{
                  backgroundColor: isDark ? "#261319" : "#42222a",
                  borderColor: "rgba(255,255,255,0.08)",
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.35) 1.5px, transparent 0)",
                  backgroundSize: "8px 8px",
                }}
              >
                <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-400 opacity-70">
                  Micro-sponge
                </span>
              </div>

              {/* Layer 2: Folded Bourbon Chantilly */}
              <div
                className={`relative w-full border-t flex items-center justify-center ${
                  isMobile ? "h-10" : isTablet ? "h-14" : "h-18"
                }`}
                style={{
                  backgroundColor: isDark ? "#f5edd6" : "#fef8ee",
                  borderColor: "rgba(0,0,0,0.15)",
                  color: "#1c1917",
                }}
              >
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, #78350f 1px, transparent 0)",
                    backgroundSize: "12px 12px",
                  }}
                />
                <span className="relative font-mono text-[8px] uppercase tracking-widest text-stone-700 font-semibold">
                  Chantilly
                </span>
              </div>

              {/* Layer 3: Central Molten Wild Amarena Core */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border flex items-center justify-center ${
                  isMobile ? "w-12 h-12" : isTablet ? "w-16 h-16" : "w-20 h-20"
                }`}
                style={{
                  background: "radial-gradient(circle at 40% 35%, #e11d48 0%, #9f1239 60%, #4c0519 100%)",
                  borderColor: "rgba(255,255,255,0.25)",
                  boxShadow: "0 0 24px rgba(225,29,72,0.45), inset 0 2px 8px rgba(255,255,255,0.3)",
                }}
              >
                <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-widest text-white/90 text-center px-1 font-bold">
                  Molten Core
                </span>
              </div>
            </div>
          </div>

          {/* Corner Caption */}
          <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 pointer-events-none">
            <span
              className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded border backdrop-blur-md"
              style={{
                backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.75)",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                color: isDark ? "#f4f4f5" : "#18181b",
              }}
            >
              Interior Cleave
            </span>
          </div>
        </motion.div>

        {/* ─── Drag Line & Handle ─── */}
        <motion.div
          className="absolute top-0 bottom-0 z-20 w-0.5 pointer-events-none"
          style={{
            left: splitPct,
            backgroundColor: accent,
            boxShadow: `0 0 12px ${accent}`,
          }}
        >
          {/* Central Circular Knob */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border flex items-center justify-center backdrop-blur-xl shadow-lg transition-transform hover:scale-105 ${
              isMobile ? "w-7 h-7" : "w-9 h-9"
            }`}
            style={{
              backgroundColor: isDark ? "rgba(12, 8, 10, 0.92)" : "rgba(255, 255, 255, 0.95)",
              borderColor: accent,
            }}
          >
            <div className="flex items-center gap-0.5 sm:gap-1">
              <div className="w-0.5 sm:w-1 h-2.5 sm:h-3 rounded-full" style={{ backgroundColor: accent }} />
              <div className="w-0.5 sm:w-1 h-2.5 sm:h-3 rounded-full opacity-40" style={{ backgroundColor: accent }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preset Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div
          className="flex items-center gap-1 p-0.5 sm:p-1 rounded-lg sm:rounded-xl border"
          style={{
            backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
            borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          }}
        >
          {[
            { label: "Glaze Shell", val: 0.1 },
            { label: "Even Split", val: 0.5 },
            { label: "Molten Core", val: 0.9 },
          ].map((preset) => {
            const active = Math.abs(split - preset.val) < 0.15;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => setPreset(preset.val)}
                className={`relative rounded-md sm:rounded-lg font-medium transition-colors cursor-pointer ${
                  isMobile ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
                }`}
                style={{
                  color: active
                    ? isDark ? "#ffffff" : "#09090b"
                    : isDark ? "#a1a1aa" : "#71717a",
                }}
              >
                {active && (
                  <motion.span
                    layoutId="cleave-preset-pill"
                    transition={SPRING}
                    className="absolute inset-0 rounded-md sm:rounded-lg"
                    style={{
                      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    }}
                  />
                )}
                <span className="relative z-10">{preset.label}</span>
              </button>
            );
          })}
        </div>

        {!isMobile && (
          <p className="font-mono text-[11px] text-zinc-500">
            Drag divider to inspect interior aeration.
          </p>
        )}
      </div>

      {/* 3 Physical Strata Callouts */}
      <div className={`grid pt-2 ${isMobile ? "grid-cols-1 gap-2" : isTablet ? "grid-cols-3 gap-3" : "grid-cols-3 gap-4"}`}>
        {ANATOMY.map((item) => (
          <div
            key={item.title}
            className={`rounded-xl border relative ${
              isMobile ? "p-3 space-y-1" : "p-4 space-y-1.5"
            }`}
            style={{
              backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold" style={{ color: accent }}>
                {item.metric}
              </span>
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                {item.caption}
              </span>
            </div>
            <h3
              className="text-xs font-semibold tracking-tight"
              style={{ color: isDark ? "#f4f4f5" : "#18181b" }}
            >
              {item.title}
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   CURSOR-LIT MATERIAL INSPECTOR
   ─────────────────────────────────────────────────────────────────────────── */

function CursorLitMaterial({
  isDark,
  accent,
  isMobile,
}: {
  isDark: boolean;
  accent: string;
  isMobile: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useSpring(240, { stiffness: 220, damping: 28 });
  const y = useSpring(140, { stiffness: 220, damping: 28 });

  const mask = useMotionTemplate`radial-gradient(circle 200px at ${x}px ${y}px, #000 0%, transparent 100%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    x.set(r.width / 2);
    y.set(r.height / 2);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full overflow-hidden border select-none cursor-crosshair ${
        isMobile ? "aspect-[4/3] rounded-xl" : "aspect-[16/9] rounded-2xl"
      }`}
      style={{
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        backgroundColor: isDark ? "#090607" : "#f5edea",
        boxShadow: isDark
          ? "inset 0 1px 0 0 rgba(255,255,255,0.12), 0 8px 32px -4px rgba(0,0,0,0.5)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.8), 0 8px 24px -4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Top specular ray */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

      {/* Dim Base Texture */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0), linear-gradient(135deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
          backgroundSize: "28px 28px, 100% 100%",
        }}
      />

      {/* Lit Layer: High Specular Glaze & 24K Flecks revealed by mask */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          background: isDark
            ? "radial-gradient(circle at center, rgba(225,29,72,0.3) 0%, rgba(251,191,36,0.12) 45%, transparent 75%)"
            : "radial-gradient(circle at center, rgba(190,18,60,0.25) 0%, rgba(217,119,6,0.1) 45%, transparent 75%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Specular glints */}
        <div
          className="absolute top-1/4 left-1/3 w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: "#fbbf24", boxShadow: "0 0 14px #fbbf24" }}
        />
        <div
          className="absolute top-2/3 left-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: "#fef08a", boxShadow: "0 0 10px #fef08a" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full"
          style={{ backgroundColor: "#fbbf24", boxShadow: "0 0 16px #fbbf24" }}
        />
      </motion.div>

      {/* Label */}
      <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-10 pointer-events-none space-y-0.5">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-zinc-400 block">
          Specular Glaze Lens
        </span>
        <span
          className="text-[11px] font-semibold block"
          style={{ color: isDark ? "#f4f4f5" : "#18181b" }}
        >
          Hover pointer to illuminate crystal structure
        </span>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Tilt Card Component
   ─────────────────────────────────────────────────────────────────────────── */

function TiltCard({
  children,
  onClick,
  active,
  isDark,
  accent,
  isMobile,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  isDark: boolean;
  accent: string;
  isMobile: boolean;
}) {
  const rx = useSpring(0, TILT);
  const ry = useSpring(0, TILT);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const glare = useMotionTemplate`radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.14), transparent 55%)`;

  return (
    <motion.div
      onClick={onClick}
      onPointerMove={(e) => {
        if (isMobile) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 10);
        rx.set(-(py - 0.5) * 10);
        setGlarePos({ x: px * 100, y: py * 100 });
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      whileHover={isMobile ? undefined : { y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 900,
        backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        borderColor: active ? accent : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        boxShadow: isDark
          ? "inset 0 1px 0 0 rgba(255,255,255,0.1), 0 8px 32px -4px rgba(0,0,0,0.4)"
          : "inset 0 1px 0 0 rgba(255,255,255,0.7), 0 8px 24px -4px rgba(0,0,0,0.04)",
      }}
      className={`relative border cursor-pointer overflow-hidden transition-colors ${
        isMobile ? "p-4 rounded-xl" : "p-5 sm:p-6 rounded-2xl"
      }`}
    >
      {/* Glare overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: glare }}
      />

      {/* Top highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Active layoutId border indicator */}
      {active && (
        <motion.span
          layoutId="edition-active-indicator"
          transition={SPRING}
          className={`absolute inset-0 pointer-events-none border-2 ${
            isMobile ? "rounded-xl" : "rounded-2xl"
          }`}
          style={{ borderColor: accent }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ─────────────────────────────────────────────────────────────────────────── */

export function AmarenaRoyalePreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  /* Container width observation for preview frames */
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
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

  const isMobile = deviceMode === "mobile" || containerWidth < 640;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);

  /* State */
  const [selectedEdition, setSelectedEdition] = useState<EditionKey>("royale");
  const [boxSize, setBoxSize] = useState<4 | 8>(4);
  const [reserved, setReserved] = useState(false);

  const current = EDITIONS[selectedEdition];
  const accent = isDark ? current.accentDark : current.accentLight;

  /* Hero Parallax & Scroll Transforms */
  const heroProgress = useScrollProgress(heroRef, "leave");
  const heroSpring = useSpring(heroProgress, { stiffness: 140, damping: 28 });

  const videoScale = useTransform(heroSpring, [0, 1], [1.06, 1.25]);
  const videoBlur = useTransform(heroSpring, [0, 1], ["blur(0px)", "blur(14px)"]);
  const videoBrightness = useTransform(heroSpring, [0, 1], [1, 0.35]);
  const heroTextY = useTransform(heroSpring, [0, 1], [0, isMobile ? -24 : -60]);
  const heroTextOpacity = useTransform(heroSpring, [0, 0.65], [1, 0]);

  /* Pointer parallax in hero */
  const heroX = useSpring(0, { stiffness: 200, damping: 25 });
  const heroY = useSpring(0, { stiffness: 200, damping: 25 });

  const handleHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (isMobile) return;
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    heroX.set((e.clientX - (r.left + r.width / 2)) * 0.04);
    heroY.set((e.clientY - (r.top + r.height / 2)) * 0.04);
  };

  const handleHeroPointerLeave = () => {
    heroX.set(0);
    heroY.set(0);
  };

  /* Header scroll progress */
  const pageProgress = useScrollProgress(rootRef, "track");
  const headerSpring = useSpring(pageProgress, { stiffness: 200, damping: 30 });
  const progressScaleX = useTransform(headerSpring, [0, 1], [0, 1]);

  const scrollToSection = (id: string) => {
    if (!rootRef.current) return;
    const el = rootRef.current.querySelector(`#${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleReserve = () => {
    setReserved(true);
    setTimeout(() => setReserved(false), 3500);
  };

  const activePrice = boxSize === 4 ? current.priceFour : current.priceEight;

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-clip transition-colors duration-300 font-sans select-none"
      style={{
        backgroundColor: isDark ? "#09090b" : "#fafafa",
        color: isDark ? "#f4f4f5" : "#18181b",
      }}
    >
      {/* ─── HEADER ─── */}
      <header
        className={`sticky top-0 z-50 flex items-center justify-between border-b backdrop-blur-xl transition-colors duration-300 ${
          isMobile
            ? "h-14 px-4 -mb-14"
            : isTablet
            ? "h-16 px-6 -mb-16"
            : "h-20 px-10 -mb-20"
        }`}
        style={{
          backgroundColor: isDark ? "rgba(9, 9, 11, 0.82)" : "rgba(250, 250, 250, 0.85)",
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        }}
      >
        <span
          className={`font-black tracking-widest uppercase ${
            isMobile ? "text-xs" : "text-sm"
          }`}
        >
          {config.brandName || "AMARENA ROYALE"}
        </span>

        {!isMobile && !isTablet && (
          <nav className="flex items-center gap-8 text-xs text-zinc-400">
            <button
              type="button"
              onClick={() => scrollToSection("cleave")}
              className="hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Cross-section
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("glaze")}
              className="hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Glaze
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("editions")}
              className="hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Editions
            </button>
          </nav>
        )}

        <button
          type="button"
          onClick={() => scrollToSection("reserve")}
          className={`rounded-lg font-semibold transition-all cursor-pointer border ${
            isMobile ? "px-2.5 py-1 text-[11px]" : "px-4 py-2 text-xs"
          }`}
          style={{
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
            color: isDark ? "#f4f4f5" : "#18181b",
          }}
        >
          Reserve Box
        </button>

        {/* Scroll Progress Line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
          style={{
            scaleX: progressScaleX,
            backgroundColor: accent,
          }}
        />
      </header>

      {/* ─── SECTION 1: HERO ─── */}
      <section
        ref={heroRef}
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
        className={`relative flex flex-col justify-between overflow-hidden ${
          isMobile
            ? "h-[500px] pt-16 pb-4 px-4"
            : isTablet
            ? "h-[620px] pt-20 pb-8 px-6"
            : "min-h-[92vh] pt-32 pb-12 px-10"
        }`}
      >
        {/* Full-bleed Video Media */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.video
            src="/videos/amarena-royale-cupcake.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center"
            style={{
              scale: videoScale,
              filter: videoBlur,
              opacity: videoBrightness,
              x: heroX,
              y: heroY,
            }}
          />

          {/* Neutral Atmospheric Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "linear-gradient(to bottom, rgba(9,9,11,0.65) 0%, rgba(9,9,11,0.2) 40%, rgba(9,9,11,0.7) 75%, #09090b 100%)"
                : "linear-gradient(to bottom, rgba(250,250,250,0.65) 0%, rgba(250,250,250,0.2) 40%, rgba(250,250,250,0.7) 75%, #fafafa 100%)",
            }}
          />
        </div>

        {/* Spacer */}
        <div className="relative z-10" />

        {/* Monumental Headline */}
        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className={`relative z-10 max-w-4xl ${isMobile ? "space-y-2 my-auto" : "space-y-4"}`}
        >
          <h1
            className={`font-black tracking-[-0.04em] leading-[0.92] uppercase ${
              isMobile
                ? "text-3xl"
                : isTablet
                ? "text-5xl"
                : "text-7xl lg:text-8xl"
            }`}
          >
            <div className="flex flex-col">
              <span className="block"><SplitWords text="AMARENA" /></span>
              <span className="block"><SplitWords text="ROYALE" /></span>
            </div>
          </h1>

          <p
            className={`text-zinc-400 leading-relaxed ${
              isMobile ? "text-xs max-w-xs" : isTablet ? "text-sm max-w-sm" : "text-base max-w-lg"
            }`}
          >
            Grand Cru Venezuelan cacao, steeped wild cherries, Madagascar chantilly.
          </p>
        </motion.div>

        {/* 3 Counted Numbers */}
        <motion.div
          className={`relative z-10 grid grid-cols-3 border-t ${
            isMobile ? "gap-2 pt-3 pb-1" : isTablet ? "gap-4 pt-6 pb-2" : "gap-6 pt-10"
          }`}
          style={{
            opacity: heroTextOpacity,
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          }}
        >
          {STATS.map((s, idx) => (
            <div key={s.label} className="space-y-0.5">
              <div
                className={`font-black tracking-tight tabular-nums ${
                  isMobile
                    ? "text-lg"
                    : isTablet
                    ? "text-2xl"
                    : "text-3xl lg:text-4xl"
                }`}
                style={{ color: isDark ? "#f4f4f5" : "#18181b" }}
              >
                <Counter to={s.figure} suffix={s.suffix} delay={0.2 * idx} />
              </div>
              <p
                className={`font-mono text-zinc-500 uppercase tracking-wider ${
                  isMobile ? "text-[8px]" : isTablet ? "text-[10px]" : "text-xs"
                }`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── SECTION 2: THE WOW MOMENT (CLEAVE SLIDER) ─── */}
      <section
        id="cleave"
        className={`w-full max-w-6xl mx-auto ${
          isMobile
            ? "px-4 py-12 space-y-4"
            : isTablet
            ? "px-6 py-20 space-y-8"
            : "px-10 py-32 space-y-10"
        }`}
      >
        <div className="space-y-1.5 max-w-2xl">
          <h2
            className={`font-black tracking-[-0.03em] leading-tight ${
              isMobile ? "text-2xl" : isTablet ? "text-3xl" : "text-4xl lg:text-5xl"
            }`}
          >
            The cross-section.
          </h2>
          <p
            className={`text-zinc-400 leading-relaxed ${
              isMobile ? "text-xs" : "text-sm sm:text-base"
            }`}
          >
            Slice through the 70% dark shell to inspect the aeration and molten core.
          </p>
        </div>

        <CleaveInspector
          isDark={isDark}
          accent={accent}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      </section>

      {/* ─── SECTION 3: DETAIL (CURSOR-LIT GLAZE) ─── */}
      <section
        id="glaze"
        className={`w-full max-w-6xl mx-auto ${
          isMobile
            ? "px-4 py-12 space-y-4"
            : isTablet
            ? "px-6 py-20 space-y-8"
            : "px-10 py-28 space-y-10"
        }`}
      >
        <div className="space-y-1.5 max-w-2xl">
          <h2
            className={`font-black tracking-[-0.03em] leading-tight ${
              isMobile ? "text-2xl" : isTablet ? "text-3xl" : "text-4xl lg:text-5xl"
            }`}
          >
            Cursor-lit glaze.
          </h2>
          <p
            className={`text-zinc-400 leading-relaxed ${
              isMobile ? "text-xs" : "text-sm sm:text-base"
            }`}
          >
            Move your pointer across the surface to inspect the tempered gloss and gold leaf.
          </p>
        </div>

        <div
          className={
            isMobile || isTablet
              ? "flex flex-col gap-4"
              : "grid grid-cols-12 gap-8 items-center"
          }
        >
          <div className={isMobile || isTablet ? "w-full" : "col-span-8"}>
            <CursorLitMaterial
              isDark={isDark}
              accent={accent}
              isMobile={isMobile}
            />
          </div>

          <div
            className={
              isMobile || isTablet
                ? "w-full grid grid-cols-1 gap-2.5"
                : "col-span-4 space-y-4"
            }
          >
            <div
              className={`rounded-xl border space-y-1.5 ${
                isMobile ? "p-3.5" : "p-5 sm:p-6 rounded-2xl"
              }`}
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              }}
            >
              <span className="font-mono text-xs font-bold" style={{ color: accent }}>
                31.5°C
              </span>
              <h3
                className="text-xs sm:text-sm font-semibold tracking-tight"
                style={{ color: isDark ? "#f4f4f5" : "#18181b" }}
              >
                Stable Beta-V Temper
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                Controlled cooling locks the cocoa butter crystals into uniform lattice, giving the mirror sheen and clean snap.
              </p>
            </div>

            <div
              className={`rounded-xl border space-y-1.5 ${
                isMobile ? "p-3.5" : "p-5 sm:p-6 rounded-2xl"
              }`}
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              }}
            >
              <span className="font-mono text-xs font-bold" style={{ color: accent }}>
                24-Karat
              </span>
              <h3
                className="text-xs sm:text-sm font-semibold tracking-tight"
                style={{ color: isDark ? "#f4f4f5" : "#18181b" }}
              >
                Edible Gold Leafing
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                Hammered gold leaves applied by hand onto the warm glaze prior to cooling, catching ambient light reflections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: CHOICE (EDITIONS) ─── */}
      <section
        id="editions"
        className={`w-full max-w-6xl mx-auto ${
          isMobile
            ? "px-4 py-12 space-y-4"
            : isTablet
            ? "px-6 py-20 space-y-8"
            : "px-10 py-32 space-y-10"
        }`}
      >
        <div className="space-y-1.5 max-w-2xl">
          <h2
            className={`font-black tracking-[-0.03em] leading-tight ${
              isMobile ? "text-2xl" : isTablet ? "text-3xl" : "text-4xl lg:text-5xl"
            }`}
          >
            Three compositions.
          </h2>
          <p
            className={`text-zinc-400 leading-relaxed ${
              isMobile ? "text-xs" : "text-sm sm:text-base"
            }`}
          >
            Each edition is balanced for a distinct chocolate and cherry profile.
          </p>
        </div>

        <div
          className={`grid ${
            isMobile
              ? "grid-cols-1 gap-3"
              : isTablet
              ? "grid-cols-3 gap-3"
              : "grid-cols-3 gap-6"
          }`}
        >
          {(["royale", "chantilly", "noir"] as const).map((key) => {
            const ed = EDITIONS[key];
            const active = selectedEdition === key;
            return (
              <TiltCard
                key={ed.id}
                active={active}
                isDark={isDark}
                accent={accent}
                isMobile={isMobile}
                onClick={() => setSelectedEdition(key)}
              >
                <div className="space-y-2.5 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-zinc-500">
                      {ed.cacao}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: isDark ? ed.accentDark : ed.accentLight }}
                    />
                  </div>

                  <h3
                    className="text-sm sm:text-base md:text-lg font-bold tracking-tight"
                    style={{ color: isDark ? "#f4f4f5" : "#18181b" }}
                  >
                    {ed.name}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                    {ed.tagline}
                  </p>

                  <div
                    className="pt-2 sm:pt-4 border-t flex justify-between items-center text-xs font-mono text-zinc-500"
                    style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
                  >
                    <span>From ${ed.priceFour}</span>
                    <span className="capitalize">{active ? "Selected" : "Select"}</span>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>

        {/* Selected Composition Callout */}
        <div
          className={`border flex justify-between ${
            isMobile
              ? "p-4 rounded-xl flex-col gap-2"
              : "p-6 rounded-2xl flex-row items-center gap-4"
          }`}
          style={{
            backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
            borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          }}
        >
          <div className="space-y-1">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
              Selected Edition Details
            </span>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              {current.notes}
            </p>
          </div>
          <div className="font-mono text-[10px] sm:text-xs text-zinc-400 shrink-0">
            Handcrafted in small morning batches
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: ACTION (RESERVATION CARD) ─── */}
      <section
        id="reserve"
        className={`w-full max-w-3xl mx-auto ${
          isMobile
            ? "px-4 py-12"
            : isTablet
            ? "px-6 py-20"
            : "px-10 py-32"
        }`}
      >
        <div
          className={`border relative overflow-hidden ${
            isMobile
              ? "p-5 rounded-2xl space-y-5"
              : isTablet
              ? "p-8 rounded-2xl space-y-6"
              : "p-12 rounded-3xl space-y-8"
          }`}
          style={{
            backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            boxShadow: isDark
              ? "inset 0 1px 0 0 rgba(255,255,255,0.12), 0 8px 32px -4px rgba(0,0,0,0.5)"
              : "inset 0 1px 0 0 rgba(255,255,255,0.8), 0 8px 24px -4px rgba(0,0,0,0.06)",
          }}
        >
          {/* Top specular highlight */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

          <div className="space-y-1.5">
            <h2
              className={`font-black tracking-[-0.03em] leading-tight ${
                isMobile ? "text-2xl" : "text-3xl lg:text-4xl"
              }`}
            >
              Reserve a box.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Dispatched daily in chilled isothermal packaging across Paris and Bologna.
            </p>
          </div>

          {/* Size Choice with layoutId */}
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block">
              Box Quantity
            </label>
            <div
              className={`grid p-1 rounded-xl border ${
                isMobile ? "grid-cols-1 gap-2" : "grid-cols-2 gap-3"
              }`}
              style={{
                backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
                borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              }}
            >
              {[
                { size: 4 as const, label: "Box of 4 Pieces", price: current.priceFour },
                { size: 8 as const, label: "Box of 8 Pieces", price: current.priceEight },
              ].map((item) => {
                const active = boxSize === item.size;
                return (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => setBoxSize(item.size)}
                    className="relative py-2.5 px-3 sm:px-4 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
                    style={{
                      color: active
                        ? isDark ? "#ffffff" : "#09090b"
                        : isDark ? "#a1a1aa" : "#71717a",
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="box-size-pill"
                        transition={SPRING}
                        className="absolute inset-0 rounded-lg shadow-sm"
                        style={{
                          backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                    <span className="relative z-10 font-mono">${item.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Details */}
          <div
            className="space-y-1 text-xs font-mono text-zinc-400 pt-2 border-t"
            style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
          >
            <div className="flex justify-between">
              <span>Selected Composition:</span>
              <span className="font-semibold" style={{ color: isDark ? "#f4f4f5" : "#18181b" }}>
                {current.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Storage Life:</span>
              <span>48h chilled at 4°C</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Method:</span>
              <span>Same-day temperature controlled</span>
            </div>
          </div>

          {/* Magnetic CTA Button */}
          <div className="pt-1">
            <MagneticButton
              onClick={handleReserve}
              className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-95 shadow-lg border"
              style={{
                backgroundColor: accent,
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              <AnimatePresence mode="wait">
                {reserved ? (
                  <motion.span
                    key="booked"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={SPRING}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Reserved • Scheduled for courier</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={SPRING}
                    className="flex items-center gap-2"
                  >
                    <span>Reserve Box — ${activePrice}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className={`w-full border-t text-center ${
          isMobile ? "py-4 px-4" : "py-8 px-10"
        }`}
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          color: isDark ? "#71717a" : "#a1a1aa",
        }}
      >
        <p className="font-mono text-[10px] sm:text-[11px]">
          Amarena Royale Pâtisserie. Paris & Bologna. Handcrafted daily.
        </p>
      </footer>
    </div>
  );
}

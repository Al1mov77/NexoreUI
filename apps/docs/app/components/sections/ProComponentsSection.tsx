"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import {
  LiveObject,
  HoloFinishCard,
  ParticleRevealCard,
  GlassShatterCard,
  FrostHoverCard,
  SoundPulse,
  SilkUnveil,
} from "nexoreui";

/* ─── Motion Physics ─── */
const SPRING: Transition = { type: "spring", stiffness: 400, damping: 30, mass: 0.8 };
const REVEAL: Transition = { type: "spring", stiffness: 240, damping: 28, mass: 0.85 };

/* ─── Effect Registry ─── */
type Effect = "holo" | "object" | "particle" | "shatter" | "frost" | "pulse" | "silk";
type Filter = "all" | Effect;

const EFFECTS: Record<Effect, { label: string; cli: string; anchor: string; hint: string }> = {
  holo: { label: "HoloFinishCard", cli: "holo-finish-card", anchor: "pro-cards", hint: "Tilt · Foil Sheen" },
  object: { label: "LiveObject", cli: "live-object", anchor: "pro-objects", hint: "3D Tilt · Gyroscope" },
  particle: { label: "ParticleRevealCard", cli: "particle-reveal-card", anchor: "pro-cards", hint: "Hover to Repel" },
  shatter: { label: "GlassShatterCard", cli: "glass-shatter-card", anchor: "pro-cards", hint: "Click to Shatter" },
  frost: { label: "FrostHoverCard", cli: "frost-hover-card", anchor: "pro-cards", hint: "Hover to Wipe" },
  pulse: { label: "SoundPulse", cli: "sound-pulse", anchor: "pro-objects", hint: "Audio Reactive" },
  silk: { label: "SilkUnveil", cli: "silk-unveil", anchor: "pro-objects", hint: "Verlet Cloth" },
};

const FILTER_ORDER: Effect[] = ["holo", "object", "particle", "shatter", "frost", "pulse", "silk"];

/* ─── Showcase Data (Strictly Interleaved — No Adjacent Duplicates) ─── */
interface ShowcaseItem {
  id: string;
  effect: Effect;
  title: string;
  subtitle: string;
  description: string;
  src: string;
  price?: string;
  accent?: string;
  holoColors?: string[];
  productWidth?: string;
}

const ITEMS: ShowcaseItem[] = [
  // Row 1
  {
    id: "holo-chrono",
    effect: "holo",
    title: "Titanium Chronograph",
    subtitle: "Aerospace Grade 5",
    price: "$1,450",
    description: "Satin-brushed titanium with iridescent holographic reflection masked to the watch silhouette.",
    src: "/images/products/watch-chronograph.png",
    holoColors: ["#94a3b8", "#cbd5e1", "#38bdf8", "#e2e8f0"],
  },
  {
    id: "obj-camera",
    effect: "object",
    title: "Mirrorless Optics",
    subtitle: "50mm f/1.2 Chassis",
    price: "$2,199",
    description: "Solid magnesium body with knurled physical dials. Tracks pointer in 3D with realistic specular sheen.",
    src: "/images/products/camera-mirrorless.png",
    accent: "#38bdf8",
  },
  {
    id: "particle-mouse",
    effect: "particle",
    title: "Carbon Esports Mouse",
    subtitle: "Pixel Synthesis",
    price: "$180",
    description: "Chassis silhouette reconstructed from thousands of discrete pixel particles with spring dynamics.",
    src: "/images/products/gaming-mouse.png",
  },

  // Row 2
  {
    id: "shatter-chrono",
    effect: "shatter",
    title: "Prism Chronometer",
    subtitle: "Sapphire Crystal",
    price: "$1,890",
    description: "Watertight irregular glass pane fracturing into polygonal shards on click, restoring smoothly.",
    src: "/images/products/watch-chronograph.png",
  },
  {
    id: "frost-sneaker",
    effect: "frost",
    title: "Stealth Runner",
    subtitle: "Condensed Vapor",
    price: "$320",
    description: "Misted glass layer with realistic condensation texture, cleared by cursor trajectory.",
    src: "/images/products/sneaker-blackcat.png",
  },
  {
    id: "pulse-speaker",
    effect: "pulse",
    title: "Acoustic Cylinder",
    subtitle: "Procedural Web Audio",
    price: "$450",
    description: "Integrated audio synthesizer driving 56 radial frequency bars and bass-reactive scale pulse.",
    src: "/images/products/portable-speaker.png",
    accent: "#8b5cf6",
  },

  // Row 3
  {
    id: "silk-perfume",
    effect: "silk",
    title: "Architectural Flacon",
    subtitle: "Verlet Integration",
    price: "$280",
    description: "Draped silk fabric with real-time fold shading and wind ripple, pulled away in a smooth unveil.",
    src: "/images/products/perfume-bottle.png",
    productWidth: "48%",
  },
  {
    id: "holo-gold",
    effect: "holo",
    title: "Solar Gold Chronograph",
    subtitle: "18K Solid Alloy",
    price: "$2,850",
    description: "Mirror-polished solar gold finish with warm champagne holographic foil refraction.",
    src: "/images/products/watch-chronograph.png",
    holoColors: ["#f59e0b", "#fbbf24", "#f43f5e", "#fef08a"],
  },
  {
    id: "obj-drone",
    effect: "object",
    title: "Stealth Quadcopter",
    subtitle: "Carbon Aerodynamics",
    price: "$1,299",
    description: "Aerodynamic drone frame with alpha-silhouette reflection and organic breathing idle physics.",
    src: "/images/products/drone-quadcopter.png",
    accent: "#f59e0b",
  },

  // Row 4
  {
    id: "particle-audio",
    effect: "particle",
    title: "Studio Acoustics",
    subtitle: "Acoustic Particles",
    price: "$650",
    description: "Headphone silhouette assembling from floating spring particles, dispersing on cursor contact.",
    src: "/images/products/headphones-studio.png",
  },
  {
    id: "shatter-camera",
    effect: "shatter",
    title: "Optics Display Pane",
    subtitle: "Tempered Glass",
    price: "$2,199",
    description: "Direct impact coordinates drive the Voronoi fracture pattern with gravitational impulse.",
    src: "/images/products/camera-mirrorless.png",
  },
  {
    id: "frost-camera",
    effect: "frost",
    title: "Mirrorless Aperture",
    subtitle: "Moisture Aperture",
    price: "$2,199",
    description: "Condensed vapor layer wiping clear to reveal high-end 50mm f/1.2 magnesium lens details.",
    src: "/images/products/camera-mirrorless.png",
  },

  // Row 5
  {
    id: "pulse-keyboard",
    effect: "pulse",
    title: "Custom CNC Keyboard",
    subtitle: "Synthesizer Step Sequencer",
    price: "$340",
    description: "Gunmetal keyboard chassis pulsing to an algorithmic Web Audio synth step sequencer.",
    src: "/images/products/mechanical-keyboard.png",
    accent: "#ec4899",
  },
  {
    id: "silk-car",
    effect: "silk",
    title: "Concept Coupé",
    subtitle: "Showroom Cloth Unveil",
    price: "$85,000",
    description: "Heavy draped showroom fabric with dynamic fold physics, swept away on interactive command.",
    src: "/images/products/toy-car.png",
    productWidth: "68%",
  },
  {
    id: "obj-gamepad",
    effect: "object",
    title: "Esports Gamepad Pro",
    subtitle: "Tactile Triggers",
    price: "$249",
    description: "Precision metal thumbsticks and dual-stage triggers with specular rim lighting in 3D space.",
    src: "/images/products/gamepad-pro.png",
    accent: "#a855f7",
  },

  // Row 6
  {
    id: "holo-obsidian",
    effect: "holo",
    title: "Obsidian DLC Smartwatch",
    subtitle: "Diamond-Like Carbon",
    price: "$1,680",
    description: "Deep noir carbon coating with cybernetic holographic sheen and real-time pointer physics.",
    src: "/images/products/watch-cyber.png",
    holoColors: ["#0284c7", "#38bdf8", "#818cf8", "#c084fc"],
  },
  {
    id: "particle-visor",
    effect: "particle",
    title: "Cyber Monoshield Visor",
    subtitle: "Velocity Dispersion",
    price: "$260",
    description: "Iridescent wraparound visor dispersing into floating pixels upon cursor velocity thresholds.",
    src: "/images/products/sunglasses-cyber.png",
  },
  {
    id: "shatter-ring",
    effect: "shatter",
    title: "Solitaire Band",
    subtitle: "Crystal Enclosure",
    price: "$2,850",
    description: "Sapphire glass enclosure exploding into angular shards upon click with auto spring return.",
    src: "/images/products/test-ring.png",
  },
];

/* ─── Viewport Intersection Hook ─── */
function useNearViewport<T extends Element>(margin = "350px") {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin, visible]);
  return { ref, visible };
}

/* ─── Unified Stage Component ───
 * Renders ONLY the pure physical/interactive effect without duplicate labels,
 * redundant titles, or nested card borders.
 */
function UnifiedStage({ item }: { item: ShowcaseItem }) {
  switch (item.effect) {
    case "object":
      return (
        <LiveObject
          src={item.src}
          accentColor={item.accent}
          width="100%"
          height={390}
          maxTilt={24}
          autoplayIntro={false}
          ambientSweep={true}
        />
      );
    case "holo":
      return (
        <HoloFinishCard
          src={item.src}
          title={item.title}
          subtitle={item.subtitle}
          price={item.price}
          holoColors={item.holoColors}
          intensity="medium"
          cardWidth="100%"
          cardHeight={390}
          showLabels={false}
          showSwatches={false}
          maxTilt={24}
        />
      );
    case "particle":
      return (
        <ParticleRevealCard
          src={item.src}
          title={item.title}
          subtitle={item.subtitle}
          price={item.price}
          scatterOnLoad={false}
          showLabels={false}
          cardWidth="100%"
          cardHeight={390}
          gap={2.4}
          repelRadius={95}
          repelForce={7.5}
        />
      );
    case "shatter":
      return (
        <GlassShatterCard
          src={item.src}
          title={item.title}
          subtitle={item.subtitle}
          price={item.price}
          shatterForce={11}
          gravity={0.36}
          showLabels={false}
          cardWidth="100%"
          cardHeight={390}
        />
      );
    case "frost":
      return (
        <FrostHoverCard
          src={item.src}
          title={item.title}
          subtitle={item.subtitle}
          price={item.price}
          wipeRadius={120}
          blurAmount={16}
          showLabels={false}
          cardWidth="100%"
          cardHeight={390}
        />
      );
    case "pulse":
      return (
        <div className="w-full h-full flex items-center justify-center p-2">
          <SoundPulse
            src={item.src}
            accentFrom={item.accent || "#8b5cf6"}
            accentTo="#38bdf8"
            stageSize={380}
            bpm={98}
          />
        </div>
      );
    case "silk":
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <SilkUnveil
            src={item.src}
            aspectRatio="1/1"
            productWidth={item.productWidth || "62%"}
            clothDark={[18, 22, 32]}
            clothLight={[165, 180, 210]}
            alt={item.title}
          />
        </div>
      );
  }
}

/* ─── Unified Showcase Card ─── */
function ShowcaseCard({
  item,
  index,
  total,
  copied,
  onCopy,
  onConfigure,
}: {
  item: ShowcaseItem;
  index: number;
  total: number;
  copied: boolean;
  onCopy: (id: string, cmd: string) => void;
  onConfigure: (anchor: string) => void;
}) {
  const meta = EFFECTS[item.effect];
  const cmd = `npx nexoreui add ${meta.cli}`;
  const { ref, visible } = useNearViewport<HTMLDivElement>();

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ ...REVEAL, delay: (index % 3) * 0.05 }}
      whileHover={{ y: -4, transition: SPRING }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[hsl(225_12%_7%)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_32px_-4px_rgba(0,0,0,0.5)] transition-[border-color] duration-300 hover:border-black/[0.14] dark:hover:border-white/[0.14]"
    >
      {/* Top Specular Rim Ray */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Header Plate */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
            {meta.label}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
          {meta.hint}
        </span>
      </header>

      {/* Unified Interactive Stage (Monumental 400px Edge-to-Edge Stage) */}
      <div
        ref={ref}
        className="relative mx-3.5 my-1 flex h-[400px] items-center justify-center overflow-hidden rounded-xl border border-black/[0.04] dark:border-white/[0.05] bg-zinc-50/80 dark:bg-[hsl(225_16%_5%)]"
      >
        {/* Subtle Architectural Micro-Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.04)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)]" />

        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {visible ? (
            <UnifiedStage item={item} />
          ) : (
            <div className="h-[380px] w-full rounded-xl bg-black/[0.02] dark:bg-white/[0.02]" />
          )}
        </div>
      </div>

      {/* Typographic Plate */}
      <div className="flex flex-1 flex-col justify-between gap-3.5 p-5">
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
              {item.title}
            </h3>
            {item.price && (
              <span className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {item.price}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {item.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 border-t border-black/[0.05] dark:border-white/[0.05] pt-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
            onClick={() => onCopy(item.id, cmd)}
            className="group/cli relative inline-flex min-w-0 items-center gap-2 rounded-lg border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.025] px-2.5 py-1.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
            aria-label={`Copy ${cmd}`}
          >
            <span className="text-zinc-400 dark:text-zinc-600">$</span>
            <span className="truncate">add {meta.cli}</span>
            <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="ok"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={SPRING}
                    className="flex text-emerald-600 dark:text-emerald-400"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={SPRING}
                    className="flex opacity-50 group-hover/cli:opacity-100"
                  >
                    <Copy className="h-3 w-3" />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
            onClick={() => onConfigure(meta.anchor)}
            className="group/cfg inline-flex shrink-0 items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            Configure
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cfg:-translate-y-px group-hover/cfg:translate-x-px" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Main ProComponentsSection ─── */
export function ProComponentsSection() {
  const [filter, setFilter] = useState<Filter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = { all: ITEMS.length } as Record<Filter, number>;
    FILTER_ORDER.forEach((e) => (c[e] = ITEMS.filter((i) => i.effect === e).length));
    return c;
  }, []);

  const visibleItems = useMemo(
    () => (filter === "all" ? ITEMS : ITEMS.filter((i) => i.effect === filter)),
    [filter]
  );

  const copy = useCallback((id: string, cmd: string) => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1800);
  }, []);

  const configure = useCallback((anchor: string) => {
    if (typeof window === "undefined") return;
    window.location.hash = anchor;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All Variants" },
    ...FILTER_ORDER.map((e) => ({ id: e as Filter, label: EFFECTS[e].label })),
  ];

  return (
    <section id="pro-components" className="scroll-mt-20 space-y-10">
      {/* ─── Header ─── */}
      <div className="space-y-5">
        <div className="max-w-2xl space-y-2.5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.04em] text-zinc-900 dark:text-white">
            PRO Components
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Physical 3D live objects and reactive cards engineered with real-time physics engines —
            holographic foils, Verlet cloth, Voronoi shatter, particle synthesis, and Web Audio.
          </p>
        </div>

        {/* Filter Navigation Rail */}
        <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            role="tablist"
            aria-label="Filter by component"
            className="inline-flex items-center gap-1 rounded-xl border border-black/[0.06] dark:border-white/[0.07] bg-black/[0.025] dark:bg-white/[0.025] p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
          >
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <motion.button
                  key={f.id}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  transition={SPRING}
                  onClick={() => setFilter(f.id)}
                  className={`relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium tracking-tight transition-colors cursor-pointer ${
                    active
                      ? "text-zinc-900 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="pro-filter-indicator"
                      className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.06),0_4px_12px_-4px_rgba(0,0,0,0.6)]"
                      transition={SPRING}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                  <span
                    className={`relative z-10 font-mono text-[10px] tabular-nums ${
                      active ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-600"
                    }`}
                  >
                    {counts[f.id]}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Grid ─── */}
      <div key={filter} className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleItems.map((item, i) => (
          <ShowcaseCard
            key={item.id}
            item={item}
            index={i}
            total={visibleItems.length}
            copied={copiedId === item.id}
            onCopy={copy}
            onConfigure={configure}
          />
        ))}
      </div>
    </section>
  );
}

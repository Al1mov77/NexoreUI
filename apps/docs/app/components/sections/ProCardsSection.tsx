"use client";

import React, { useState } from "react";
import {
  HoloFinishCard,
  ProductFinishItem,
  HoloFinishIntensity,
  ParticleRevealCard,
  GlassShatterCard,
  FrostHoverCard,
} from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";

// Product datasets for live demonstrations
const WATCH_FINISHES: ProductFinishItem[] = [
  {
    id: "raw-titanium",
    name: "Raw Titanium",
    label: "01 / SATIN BRUSH",
    image: "/images/products/watch-chronograph.png",
    holoColors: ["#94a3b8", "#cbd5e1", "#38bdf8", "#e2e8f0"],
    price: "$1,450",
    description: "Satin-brushed aerospace Grade 5 titanium case with iridescent bevels.",
  },
  {
    id: "obsidian-dlc",
    name: "Obsidian DLC",
    label: "02 / DIAMOND-LIKE CARBON",
    image: "/images/products/watch-cyber.png",
    holoColors: ["#0284c7", "#38bdf8", "#818cf8", "#c084fc"],
    price: "$1,680",
    description: "Deep noir diamond-like carbon coating with cybernetic holographic sheen.",
  },
  {
    id: "solar-gold",
    name: "Solar Gold",
    label: "03 / 18K SOLID ALLOY",
    image: "/images/products/watch-chronograph.png",
    holoColors: ["#f59e0b", "#fbbf24", "#f43f5e", "#fef08a"],
    price: "$2,850",
    description: "Mirror-polished 18-karat solar yellow gold with warm champagne refraction.",
  },
];

const SAMPLE_PRODUCTS = [
  {
    id: "watch",
    name: "Cyber Chronograph",
    src: "/images/products/watch-chronograph.png",
    tagline: "Aerospace Titanium & Sapphire",
    price: "$1,450",
  },
  {
    id: "watch-cyber",
    name: "Smartwatch Neo",
    src: "/images/products/watch-cyber.png",
    tagline: "Electric Cyan Horizon Display",
    price: "$899",
  },
  {
    id: "camera",
    name: "Mirrorless Optics",
    src: "/images/products/camera-mirrorless.png",
    tagline: "50mm f/1.2 Magnesium Chassis",
    price: "$2,199",
  },
  {
    id: "drone",
    name: "Stealth Quadcopter",
    src: "/images/products/drone-quadcopter.png",
    tagline: "Carbon Fiber 4K Telemetry",
    price: "$1,299",
  },
  {
    id: "gamepad",
    name: "Esports Gamepad Pro",
    src: "/images/products/gamepad-pro.png",
    tagline: "Precision Metal Thumbsticks",
    price: "$249",
  },
  {
    id: "headphones",
    name: "Studio Acoustics",
    src: "/images/products/headphones-studio.png",
    tagline: "Graphene Transducers & Hybrid ANC",
    price: "$650",
  },
  {
    id: "sneaker",
    name: "Stealth Runner",
    src: "/images/products/sneaker-blackcat.png",
    tagline: "Carbon-Fiber Speed Chassis",
    price: "$320",
  },
  {
    id: "smart-ring",
    name: "Biometric Smart Ring",
    src: "/images/products/smart-ring.png",
    tagline: "Titanium Pulse Optical Array",
    price: "$399",
  },
  {
    id: "perfume",
    name: "Architectural Flacon",
    src: "/images/products/perfume-bottle.png",
    tagline: "Obsidian Glass & Magnetic Gold Cap",
    price: "$280",
  },
];

// Props tables
const HOLO_PROPS = [
  {
    name: "src",
    type: "string",
    defaultValue: "undefined",
    description: "Transparent PNG image URL for standalone single-finish mode.",
  },
  {
    name: "finishes",
    type: "ProductFinishItem[]",
    defaultValue: "[]",
    description: "Array of finish variants with name, PNG image, and holoColors.",
  },
  {
    name: "intensity",
    type: '"subtle" | "medium" | "vibrant"',
    defaultValue: '"medium"',
    description: "Iridescent foil sheen intensity and reflective opacity.",
  },
  {
    name: "maxTilt",
    type: "number",
    defaultValue: "32",
    description: "Maximum 3D tilt angle in degrees during cursor tracking.",
  },
  {
    name: "cardWidth / cardHeight",
    type: "number | string",
    defaultValue: "360 / 480",
    description: "Outer card dimensions in pixels or CSS dimension string.",
  },
  {
    name: "showLabels",
    type: "boolean",
    defaultValue: "true",
    description: "Whether typographic plates (name, price, edition) are rendered.",
  },
  {
    name: "showSwatches",
    type: "boolean",
    defaultValue: "true",
    description: "Whether the interactive bottom finish swatch selector bar is displayed.",
  },
];

const PARTICLE_PROPS = [
  {
    name: "src",
    type: "string",
    defaultValue: "required",
    description: "Transparent PNG image URL of the product.",
  },
  {
    name: "particleSize",
    type: "number",
    defaultValue: "2.2",
    description: "Size in pixels of each rendered pixel particle.",
  },
  {
    name: "gap",
    type: "number",
    defaultValue: "3",
    description: "Pixel sampling step/density. Lower value yields denser particles.",
  },
  {
    name: "repelRadius",
    type: "number",
    defaultValue: "85",
    description: "Cursor repulsion radius in pixels.",
  },
  {
    name: "repelForce",
    type: "number",
    defaultValue: "6.5",
    description: "Physical repulsion impulse force pushing particles away from cursor.",
  },
  {
    name: "springStiffness",
    type: "number",
    defaultValue: "0.08",
    description: "Spring acceleration pulling particles back to their home pixel coordinate.",
  },
  {
    name: "scatterOnLoad",
    type: "boolean",
    defaultValue: "true",
    description: "Whether particles begin scattered and assemble dynamically on load.",
  },
];

const SHATTER_PROPS = [
  {
    name: "src",
    type: "string",
    defaultValue: "required",
    description: "Transparent PNG image URL of the product.",
  },
  {
    name: "gridCols / gridRows",
    type: "number",
    defaultValue: "5 / 6",
    description: "Triangular mesh subdivision density.",
  },
  {
    name: "jitterAmount",
    type: "number",
    defaultValue: "0.35",
    description: "Displacement factor for interior jagged vertex jitter.",
  },
  {
    name: "shatterForce",
    type: "number",
    defaultValue: "11",
    description: "Explosion impulse magnitude applied to shards upon click.",
  },
  {
    name: "gravity",
    type: "number",
    defaultValue: "0.36",
    description: "Downward gravitational acceleration acting on airborne shards.",
  },
  {
    name: "autoRestoreDelay",
    type: "number",
    defaultValue: "1600",
    description: "Delay in milliseconds before shards spring back into watertight position.",
  },
];

const FROST_PROPS = [
  {
    name: "src",
    type: "string",
    defaultValue: "required",
    description: "Transparent PNG image URL of the product.",
  },
  {
    name: "wipeRadius",
    type: "number",
    defaultValue: "110",
    description: "Radius in pixels of the cleared circular aperture under the cursor.",
  },
  {
    name: "blurAmount",
    type: "number",
    defaultValue: "16",
    description: "Backdrop filter blur strength applied to steamed glass layer.",
  },
  {
    name: "cardWidth / cardHeight",
    type: "number | string",
    defaultValue: "360 / 480",
    description: "Outer card dimensions in pixels or CSS dimension string.",
  },
];

type ActiveCardType = "holo" | "particle" | "shatter" | "frost";

const CARD_TYPES: { id: ActiveCardType; name: string; tag: string }[] = [
  { id: "holo", name: "HoloFinishCard", tag: "Holographic foil & 3D tilt" },
  { id: "particle", name: "ParticleRevealCard", tag: "Spring pixel synthesis" },
  { id: "shatter", name: "GlassShatterCard", tag: "Jagged shard physics" },
  { id: "frost", name: "FrostHoverCard", tag: "Steamed glass wipe mask" },
];

export function ProCardsSection() {
  const [activeCard, setActiveCard] = useState<ActiveCardType>("holo");
  const [activeProduct, setActiveProduct] = useState(SAMPLE_PRODUCTS[0]);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  // HoloFinishCard props state
  const [holoIntensity, setHoloIntensity] = useState<HoloFinishIntensity>("medium");
  const [holoMaxTilt, setHoloMaxTilt] = useState(32);

  // ParticleRevealCard props state
  const [particleGap, setParticleGap] = useState(3);
  const [particleRepelRadius, setParticleRepelRadius] = useState(85);

  // GlassShatterCard props state
  const [shatterForce, setShatterForce] = useState(11);
  const [shatterJitter, setShatterJitter] = useState(0.35);

  // FrostHoverCard props state
  const [frostWipeRadius, setFrostWipeRadius] = useState(110);
  const [frostBlur, setFrostBlur] = useState(16);

  const getCodeSnippet = () => {
    switch (activeCard) {
      case "holo":
        return `import { HoloFinishCard } from "nexoreui";

export default function HoloCardDemo() {
  return (
    <HoloFinishCard
      src="${activeProduct.src}"
      title="${activeProduct.name}"
      subtitle="${activeProduct.tagline}"
      price="${activeProduct.price}"
      intensity="${holoIntensity}"
      maxTilt={${holoMaxTilt}}
      cardWidth={360}
      cardHeight={480}
    />
  );
}`;
      case "particle":
        return `import { ParticleRevealCard } from "nexoreui";

export default function ParticleCardDemo() {
  return (
    <ParticleRevealCard
      src="${activeProduct.src}"
      title="${activeProduct.name}"
      subtitle="${activeProduct.tagline}"
      price="${activeProduct.price}"
      gap={${particleGap}}
      repelRadius={${particleRepelRadius}}
      cardWidth={360}
      cardHeight={480}
    />
  );
}`;
      case "shatter":
        return `import { GlassShatterCard } from "nexoreui";

export default function ShatterCardDemo() {
  return (
    <GlassShatterCard
      src="${activeProduct.src}"
      title="${activeProduct.name}"
      subtitle="${activeProduct.tagline}"
      price="${activeProduct.price}"
      shatterForce={${shatterForce}}
      jitterAmount={${shatterJitter}}
      cardWidth={360}
      cardHeight={480}
    />
  );
}`;
      case "frost":
        return `import { FrostHoverCard } from "nexoreui";

export default function FrostCardDemo() {
  return (
    <FrostHoverCard
      src="${activeProduct.src}"
      title="${activeProduct.name}"
      subtitle="${activeProduct.tagline}"
      price="${activeProduct.price}"
      wipeRadius={${frostWipeRadius}}
      blurAmount={${frostBlur}}
      cardWidth={360}
      cardHeight={480}
    />
  );
}`;
    }
  };

  const getCliCommand = () => {
    switch (activeCard) {
      case "holo":
        return "npx nexoreui add holo-finish-card";
      case "particle":
        return "npx nexoreui add particle-reveal-card";
      case "shatter":
        return "npx nexoreui add glass-shatter-card";
      case "frost":
        return "npx nexoreui add frost-hover-card";
    }
  };

  const getActivePropsData = () => {
    switch (activeCard) {
      case "holo": return HOLO_PROPS;
      case "particle": return PARTICLE_PROPS;
      case "shatter": return SHATTER_PROPS;
      case "frost": return FROST_PROPS;
    }
  };

  return (
    <section id="pro-cards" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary dark:text-primary text-xs font-semibold">
          <span>Pro Components</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
          Pro Cards Suite
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          Four standalone physical cards engineered for high-end product presentation.
          Each accepts any transparent PNG silhouette via the{" "}
          <code className="text-primary dark:text-primary font-mono font-semibold">src</code>{" "}
          prop.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-xs font-mono w-fit mt-3">
          <span className="text-slate-500 dark:text-slate-400">{getCliCommand()}</span>
        </div>
      </div>

      {/* Card Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {CARD_TYPES.map((card) => {
          const isSelected = activeCard === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setActiveCard(card.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8"
              }`}
            >
              <div className="font-semibold text-sm font-mono">
                {card.name}
              </div>
              <div className={`text-[11px] mt-0.5 ${isSelected ? "text-primary-foreground/70" : "text-slate-400 dark:text-slate-500"}`}>
                {card.tag}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Interactive Playground
          </h2>
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === "preview"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === "code"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Export Code
            </button>
          </div>
        </div>

        {activeTab === "preview" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* Live Component Preview */}
            <div className="xl:col-span-2 min-h-[520px] flex items-center justify-center p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-[#07090f] relative overflow-hidden">
              {activeCard === "holo" && (
                <HoloFinishCard
                  src={activeProduct.src}
                  title={activeProduct.name}
                  subtitle={activeProduct.tagline}
                  price={activeProduct.price}
                  intensity={holoIntensity}
                  maxTilt={holoMaxTilt}
                  cardWidth={360}
                  cardHeight={480}
                />
              )}
              {activeCard === "particle" && (
                <ParticleRevealCard
                  src={activeProduct.src}
                  title={activeProduct.name}
                  subtitle={activeProduct.tagline}
                  price={activeProduct.price}
                  gap={particleGap}
                  repelRadius={particleRepelRadius}
                  cardWidth={360}
                  cardHeight={480}
                />
              )}
              {activeCard === "shatter" && (
                <GlassShatterCard
                  src={activeProduct.src}
                  title={activeProduct.name}
                  subtitle={activeProduct.tagline}
                  price={activeProduct.price}
                  shatterForce={shatterForce}
                  jitterAmount={shatterJitter}
                  cardWidth={360}
                  cardHeight={480}
                />
              )}
              {activeCard === "frost" && (
                <FrostHoverCard
                  src={activeProduct.src}
                  title={activeProduct.name}
                  subtitle={activeProduct.tagline}
                  price={activeProduct.price}
                  wipeRadius={frostWipeRadius}
                  blurAmount={frostBlur}
                  cardWidth={360}
                  cardHeight={480}
                />
              )}
            </div>

            {/* Controls Panel */}
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0a0d14] space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Configure Props
              </h3>

              {/* Product Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Product Image
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
                  {SAMPLE_PRODUCTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveProduct(p)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        activeProduct.id === p.id
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-semibold truncate">{p.name}</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${activeProduct.id === p.id ? "text-primary-foreground/70" : "text-slate-400 dark:text-slate-500"}`}>
                        {p.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* HoloFinishCard Controls */}
              {activeCard === "holo" && (
                <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-white/10">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Foil Intensity
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["subtle", "medium", "vibrant"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setHoloIntensity(lvl)}
                          className={`py-1.5 text-xs rounded-xl border capitalize transition-all cursor-pointer font-mono ${
                            holoIntensity === lvl
                              ? "bg-primary text-primary-foreground font-bold border-primary shadow-xs"
                              : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Max Tilt</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">{holoMaxTilt}°</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={45}
                      value={holoMaxTilt}
                      onChange={(e) => setHoloMaxTilt(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              )}

              {/* ParticleRevealCard Controls */}
              {activeCard === "particle" && (
                <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-white/10">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Particle Density (Gap)
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">{particleGap}px</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={5}
                      step={1}
                      value={particleGap}
                      onChange={(e) => setParticleGap(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Repel Radius
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {particleRepelRadius}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={140}
                      value={particleRepelRadius}
                      onChange={(e) => setParticleRepelRadius(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              )}

              {/* GlassShatterCard Controls */}
              {activeCard === "shatter" && (
                <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-white/10">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Explosion Force
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {shatterForce}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={18}
                      value={shatterForce}
                      onChange={(e) => setShatterForce(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Jitter Amount
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {shatterJitter}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.15}
                      max={0.45}
                      step={0.05}
                      value={shatterJitter}
                      onChange={(e) => setShatterJitter(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              )}

              {/* FrostHoverCard Controls */}
              {activeCard === "frost" && (
                <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-white/10">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Wipe Radius
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {frostWipeRadius}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={60}
                      max={160}
                      value={frostWipeRadius}
                      onChange={(e) => setFrostWipeRadius(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Backdrop Blur
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {frostBlur}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={28}
                      value={frostBlur}
                      onChange={(e) => setFrostBlur(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
            <ComponentSource
              sourceCode={getCodeSnippet()}
              fileName={`${activeCard}-card.tsx`}
            />
          </div>
        )}
      </div>

      {/* 4-Card Comparison Grid */}
      <div className="space-y-6 pt-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Usage Examples
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. HoloFinishCard */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                1. HoloFinishCard — Holographic Foil
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Iridescent foil sheen masked to product PNG alpha channel with 3D cursor tilt.
              </p>
            </div>
            <div className="min-h-[460px] flex items-center justify-center p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#07090f]">
              <HoloFinishCard
                src="/images/products/watch-chronograph.png"
                title="HoloFinishCard"
                subtitle="HOLOGRAPHIC ALPHA FOIL"
                price="$1,450"
                cardWidth={300}
                cardHeight={420}
              />
            </div>
          </div>

          {/* 2. ParticleRevealCard */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                2. ParticleRevealCard — Pixel Synthesis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Spring-physics pixel particles assemble on load, repel from cursor.
              </p>
            </div>
            <div className="min-h-[460px] flex items-center justify-center p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#07090f]">
              <ParticleRevealCard
                src="/images/products/watch-cyber.png"
                title="ParticleRevealCard"
                subtitle="SPRING PIXEL SYNTHESIS"
                price="$899"
                cardWidth={300}
                cardHeight={420}
              />
            </div>
          </div>

          {/* 3. GlassShatterCard */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                3. GlassShatterCard — Shard Physics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Click to shatter into jagged triangular shards with gravity and auto-restore.
              </p>
            </div>
            <div className="min-h-[460px] flex items-center justify-center p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#07090f]">
              <GlassShatterCard
                src="/images/products/headphones-studio.png"
                title="GlassShatterCard"
                subtitle="WATERTIGHT JAGGED SHARDS"
                price="$650"
                cardWidth={300}
                cardHeight={420}
              />
            </div>
          </div>

          {/* 4. FrostHoverCard */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                4. FrostHoverCard — Steamed Glass
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Frosted glass layer clears with a circular wipe mask following the cursor.
              </p>
            </div>
            <div className="min-h-[460px] flex items-center justify-center p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#07090f]">
              <FrostHoverCard
                src="/images/products/sneaker-blackcat.png"
                title="FrostHoverCard"
                subtitle="STEAMED VAPOR WIPED GLASS"
                price="$320"
                cardWidth={300}
                cardHeight={420}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Props API Tables */}
      <div className="space-y-8 pt-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Component Props Reference
        </h2>

        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
              HoloFinishCardProps
            </h3>
            <PropsTable propsData={HOLO_PROPS} />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
              ParticleRevealCardProps
            </h3>
            <PropsTable propsData={PARTICLE_PROPS} />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
              GlassShatterCardProps
            </h3>
            <PropsTable propsData={SHATTER_PROPS} />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
              FrostHoverCardProps
            </h3>
            <PropsTable propsData={FROST_PROPS} />
          </div>
        </div>
      </div>
    </section>
  );
}

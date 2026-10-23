"use client";

import React, { useState } from "react";
import { LiveObject } from "nexoreui";
import { liveObject } from "../../../../../packages/cli/src/registry/live-object";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SoundPulseSection } from "./SoundPulseSection";
import { SilkUnveilSection } from "./SilkUnveilSection";
import { Sparkles, Activity, Layers, Disc3 } from "lucide-react";

const PRO_OBJECT_TABS = [
  { id: "live-object", name: "LiveObject", desc: "3D Physical Tilt & Sheen" },
  { id: "sound-pulse", name: "SoundPulse", desc: "Audio-Reactive Synth & Halo" },
  { id: "silk-unveil", name: "SilkUnveil", desc: "Verlet Cloth Physics Reveal" },
] as const;

type ProObjectTab = (typeof PRO_OBJECT_TABS)[number]["id"];

const PROPS_DATA = [
  {
    name: "src",
    type: "string",
    defaultValue: "required",
    description: "Transparent PNG image URL of the object or product silhouette.",
  },
  {
    name: "accentColor",
    type: "string",
    defaultValue: '"#38bdf8"',
    description: "Hex or RGB color driving the ignition flash, radial streaks, and RGB silhouette glitch.",
  },
  {
    name: "autoplayIntro",
    type: "boolean",
    defaultValue: "true",
    description: "Whether the ignition intro plays automatically upon entering viewport.",
  },
  {
    name: "width",
    type: "number | string",
    defaultValue: "440",
    description: "Outer stage width in pixels or CSS dimension.",
  },
  {
    name: "height",
    type: "number | string",
    defaultValue: "480",
    description: "Outer stage height in pixels or CSS dimension.",
  },
  {
    name: "maxTilt",
    type: "number",
    defaultValue: "30",
    description: "Maximum 3D tilt angle in degrees during cursor tracking or mobile gyroscope orientation.",
  },
  {
    name: "perspective",
    type: "number",
    defaultValue: "1000",
    description: "CSS 3D perspective distance in pixels for realistic depth.",
  },
  {
    name: "ambientSweep",
    type: "boolean",
    defaultValue: "true",
    description: "Subtle diagonal light beam sweep across background every 5-6s during idle state.",
  },
  {
    name: "alt",
    type: "string",
    defaultValue: '"Live Object"',
    description: "Accessibility image alt description.",
  },
];

const PRODUCT_PRESETS = [
  {
    id: "watch-cyber",
    name: "Cybernetic Smartwatch",
    src: "/images/products/watch-cyber.png",
    accent: "#38bdf8",
    tagline: "Ultra-high frequency holographic display & dual crown",
  },
  {
    id: "watch-chronograph",
    name: "Titanium Chronograph",
    src: "/images/products/watch-chronograph.png",
    accent: "#f59e0b",
    tagline: "Grade 5 aerospace titanium with sapphire crystal",
  },
  {
    id: "headphones",
    name: "Studio Acoustics",
    src: "/images/products/headphones-studio.png",
    accent: "#ec4899",
    tagline: "Graphene composite acoustic transducers with ANC",
  },
  {
    id: "sneaker",
    name: "Aerodynamic Sneaker",
    src: "/images/products/sneaker-blackcat.png",
    accent: "#10b981",
    tagline: "Carbon-fiber propulsion plate & micro-mesh upper",
  },
  {
    id: "camera",
    name: "Mirrorless Optics",
    src: "/images/products/camera-mirrorless.png",
    accent: "#38bdf8",
    tagline: "50mm f/1.2 magnesium chassis & precision knurled dials",
  },
  {
    id: "drone",
    name: "Stealth Quadcopter",
    src: "/images/products/drone-quadcopter.png",
    accent: "#f59e0b",
    tagline: "Carbon fiber aerodynamic frame with 4K HDR gimbal telemetry",
  },
  {
    id: "gamepad",
    name: "Esports Gamepad Pro",
    src: "/images/products/gamepad-pro.png",
    accent: "#a855f7",
    tagline: "Precision metal thumbsticks & tactile dual-stage triggers",
  },
  {
    id: "smart-ring",
    name: "Biometric Smart Ring",
    src: "/images/products/smart-ring.png",
    accent: "#10b981",
    tagline: "Aerospace titanium band with emerald pulse optical array",
  },
  {
    id: "perfume",
    name: "Architectural Flacon",
    src: "/images/products/perfume-bottle.png",
    accent: "#f59e0b",
    tagline: "Heavy obsidian crystal glass with magnetic golden cap",
  },
  {
    id: "sunglasses",
    name: "Cyber Monoshield Visor",
    src: "/images/products/sunglasses-cyber.png",
    accent: "#38bdf8",
    tagline: "Aerodynamic wraparound titanium with iridescent lens",
  },
  {
    id: "vr-headset",
    name: "Spatial Computing Visor",
    src: "/images/products/vr-headset.png",
    accent: "#6366f1",
    tagline: "Laminated curved glass visor with spatial audio headband",
  },
  {
    id: "speaker",
    name: "Acoustic Cylinder",
    src: "/images/products/portable-speaker.png",
    accent: "#38bdf8",
    tagline: "Micro-perforated acoustic grille with glowing touch crown",
  },
  {
    id: "keyboard",
    name: "Custom CNC 65% Keyboard",
    src: "/images/products/mechanical-keyboard.png",
    accent: "#ec4899",
    tagline: "Anodized gunmetal aluminum chassis with hot-swap switches",
  },
  {
    id: "mouse",
    name: "Carbon Esports Mouse",
    src: "/images/products/gaming-mouse.png",
    accent: "#a855f7",
    tagline: "Ultra-lightweight ergonomic chassis with optical switches",
  },
];

const ACCENT_PALETTE = [
  { label: "Electric Cyan", hex: "#38bdf8" },
  { label: "Neon Crimson", hex: "#f43f5e" },
  { label: "Amber Flame", hex: "#f59e0b" },
  { label: "Emerald Laser", hex: "#10b981" },
  { label: "Ultraviolet", hex: "#a855f7" },
  { label: "Pure White", hex: "#ffffff" },
];

export function ProObjectsSection() {
  const [activeObjectTab, setActiveObjectTab] = useState<ProObjectTab>("live-object");
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_PRESETS[0]);
  const [accentColor, setAccentColor] = useState(selectedProduct.accent);
  const [maxTilt, setMaxTilt] = useState(30);
  const [perspective, setPerspective] = useState(1000);
  const [ambientSweep, setAmbientSweep] = useState(true);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [remountKey, setRemountKey] = useState(0);

  const handleProductSelect = (preset: (typeof PRODUCT_PRESETS)[0]) => {
    setSelectedProduct(preset);
    setAccentColor(preset.accent);
    setRemountKey((k) => k + 1);
  };

  const reignite = () => {
    setRemountKey((k) => k + 1);
  };

  const generatedCode = `import { LiveObject } from "nexoreui";

export default function ProductShowcase() {
  return (
    <LiveObject
      src="${selectedProduct.src}"
      accentColor="${accentColor}"
      maxTilt={${maxTilt}}
      perspective={${perspective}}
      ambientSweep={${ambientSweep}}
      width={460}
      height={500}
    />
  );
}`;

  const examples = [
    {
      title: "1. Cybernetic Smartwatch — Electric Neon",
      description: "High-tech timepiece with electric blue streaks and synchronized specular surface sheen.",
      component: (
        <LiveObject
          src="/images/products/watch-cyber.png"
          accentColor="#38bdf8"
          width={400}
          height={440}
        />
      ),
      code: `import { LiveObject } from "nexoreui";

<LiveObject
  src="/images/products/watch-cyber.png"
  accentColor="#38bdf8"
  width={400}
  height={440}
/>`,
    },
    {
      title: "2. Aerospace Chronograph — Amber Luster",
      description: "Warm gold and amber optical reflections gliding across satin-brushed titanium bezels.",
      component: (
        <LiveObject
          src="/images/products/watch-chronograph.png"
          accentColor="#f59e0b"
          width={400}
          height={440}
        />
      ),
      code: `import { LiveObject } from "nexoreui";

<LiveObject
  src="/images/products/watch-chronograph.png"
  accentColor="#f59e0b"
  width={400}
  height={440}
/>`,
    },
    {
      title: "3. Studio Acoustics — Rose Flame",
      description: "Lustrous metallic reflections reacting dynamically to cursor and mobile gyroscope motion.",
      component: (
        <LiveObject
          src="/images/products/headphones-studio.png"
          accentColor="#ec4899"
          width={400}
          height={440}
        />
      ),
      code: `import { LiveObject } from "nexoreui";

<LiveObject
  src="/images/products/headphones-studio.png"
  accentColor="#ec4899"
  width={400}
  height={440}
/>`,
    },
    {
      title: "4. Carbon Sneaker — Emerald Matrix",
      description: "High-energy athletic footwear with laser emerald ignition flash and fluid tilt physics.",
      component: (
        <LiveObject
          src="/images/products/sneaker-blackcat.png"
          accentColor="#10b981"
          width={400}
          height={440}
        />
      ),
      code: `import { LiveObject } from "nexoreui";

<LiveObject
  src="/images/products/sneaker-blackcat.png"
  accentColor="#10b981"
  width={400}
  height={440}
/>`,
    },
  ];

  return (
    <section id="pro-objects" className="space-y-12 scroll-mt-20">
      {/* Top Pro Objects Component Suite Selector Tabs */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary dark:text-primary text-xs font-semibold">
          <span>Pro Objects Suite</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 w-fit">
          {PRO_OBJECT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveObjectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeObjectTab === tab.id
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs border border-slate-200/50 dark:border-white/10"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>{tab.name}</span>
              <span className="hidden sm:inline text-[10px] opacity-60 font-normal">
                ({tab.desc})
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeObjectTab === "sound-pulse" ? (
        <SoundPulseSection />
      ) : activeObjectTab === "silk-unveil" ? (
        <SilkUnveilSection />
      ) : (
        <>
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              LiveObject
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Not a static card, but the live product itself. Plays a cinematic
              <span className="text-slate-900 dark:text-white font-semibold"> ignition intro </span>
              with radial light streaks and alpha-silhouette RGB glitch. Transforms into a physical
              interactive object responding to desktop cursor or mobile
              <span className="text-primary dark:text-primary font-semibold"> gyroscope tilt</span>.
            </p>

            {/* CLI Quick Add */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-xs font-mono w-fit mt-3">
              <span className="text-slate-500 dark:text-slate-400">npx nexoreui add live-object</span>
            </div>
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
                  Component Source (CLI 1:1)
                </button>
              </div>
            </div>

        {activeTab === "preview" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* Live Component Preview */}
            <div className="xl:col-span-2 min-h-[520px] flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-[#07090f] relative overflow-hidden">
              {/* Stage Blueprint Grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* The LiveObject Instance */}
              <div key={remountKey} className="relative z-10">
                <LiveObject
                  src={selectedProduct.src}
                  accentColor={accentColor}
                  maxTilt={maxTilt}
                  perspective={perspective}
                  ambientSweep={ambientSweep}
                  width={420}
                  height={460}
                />
              </div>

              {/* Product Name Badge */}
              <div className="absolute top-4 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/8 text-[11px] font-mono text-slate-600 dark:text-slate-400 backdrop-blur-md pointer-events-none z-20">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="text-slate-900 dark:text-white font-semibold">
                  {selectedProduct.name}
                </span>
              </div>

              {/* Re-Ignite Button */}
              <button
                type="button"
                onClick={reignite}
                className="absolute top-4 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-slate-200 dark:border-white/15 text-xs font-mono text-slate-700 dark:text-white transition-all backdrop-blur-md cursor-pointer active:scale-95 shadow-sm z-20"
              >
                <span>Re-Ignite</span>
              </button>
            </div>

            {/* Controls Panel */}
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0a0d14] space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Configure Props
              </h3>

              {/* Product Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Product Silhouette
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1">
                  {PRODUCT_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProductSelect(p)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedProduct.id === p.id
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-semibold truncate">{p.name}</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${selectedProduct.id === p.id ? "text-primary-foreground/70" : "text-slate-400 dark:text-slate-500"}`}>
                        PNG Silhouette
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Accent Color
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{accentColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {ACCENT_PALETTE.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setAccentColor(c.hex)}
                      className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
                        accentColor === c.hex
                          ? "scale-115 ring-2 ring-primary/50 border-slate-400 dark:border-white"
                          : "opacity-60 hover:opacity-100 border-slate-300 dark:border-white/20"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Max Tilt Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Max Tilt Angle</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{maxTilt}°</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={45}
                  value={maxTilt}
                  onChange={(e) => setMaxTilt(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Perspective Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Perspective Depth</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{perspective}px</span>
                </div>
                <input
                  type="range"
                  min={600}
                  max={1400}
                  step={50}
                  value={perspective}
                  onChange={(e) => setPerspective(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Ambient Sweep Toggle */}
              <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-white/10 text-xs font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ambientSweep}
                    onChange={(e) => setAmbientSweep(e.target.checked)}
                    className="rounded accent-primary cursor-pointer"
                  />
                  <span className="text-slate-700 dark:text-slate-300">Ambient Light Sweep</span>
                </label>
              </div>

              {/* Reset to Defaults */}
              <button
                type="button"
                onClick={() => {
                  setMaxTilt(30);
                  setPerspective(1000);
                  setAmbientSweep(true);
                  reignite();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <span>Reset to Defaults</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
            <ComponentSource
              sourceCode={liveObject.content}
              fileName="live-object.tsx"
            />
          </div>
        )}
      </div>

      {/* Usage Examples */}
      <div className="space-y-6 pt-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Usage Examples
        </h2>
        <div className="space-y-8">
          {examples.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.description}
                </p>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <div className="min-h-[400px] flex items-center justify-center p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#07090f]">
                  {item.component}
                </div>
                <ComponentSource sourceCode={item.code} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Reference Table */}
      <div className="pt-6">
        <PropsTable propsData={PROPS_DATA} />
      </div>
        </>
      )}
    </section>
  );
}

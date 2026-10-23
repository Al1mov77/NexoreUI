"use client";

import React, { useState } from "react";
import { SoundPulse } from "nexoreui";
import { soundPulse } from "../../../../../packages/cli/src/registry/sound-pulse";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { Music, Radio, Sparkles, Sliders } from "lucide-react";

const PROPS_DATA = [
  {
    name: "src",
    type: "string",
    defaultValue: "required",
    description: "Transparent PNG image URL of the product silhouette.",
  },
  {
    name: "accentFrom",
    type: "string",
    defaultValue: '"#8b5cf6"',
    description: "Gradient start color for radial frequency bars and ambient halo glow.",
  },
  {
    name: "accentTo",
    type: "string",
    defaultValue: '"#06b6d4"',
    description: "Gradient end color for radial frequency bars and ambient halo glow.",
  },
  {
    name: "bpm",
    type: "number",
    defaultValue: "100",
    description: "Tempo in beats per minute driving the procedural Web Audio step sequencer.",
  },
  {
    name: "stageSize",
    type: "number | string",
    defaultValue: "460",
    description: "Maximum width and height of the 1:1 square stage in pixels.",
  },
  {
    name: "alt",
    type: "string",
    defaultValue: '"SoundPulse Audio-Reactive Product"',
    description: "Accessibility image description.",
  },
];

const PRODUCT_PRESETS = [
  {
    id: "headphones-studio",
    name: "Studio Acoustics ANC",
    tagline: "High-fidelity wireless studio monitors",
    src: "/images/products/headphones-studio.png",
    accentFrom: "#8b5cf6",
    accentTo: "#06b6d4",
    bpm: 100,
  },
  {
    id: "speaker",
    name: "Acoustic Cylinder",
    tagline: "360° omnidirectional acoustic transducer",
    src: "/images/products/portable-speaker.png",
    accentFrom: "#f43f5e",
    accentTo: "#fb923c",
    bpm: 110,
  },
  {
    id: "watch-cyber",
    name: "Cybernetic Smartwatch",
    tagline: "Holographic telemetry & haptic audio pulses",
    src: "/images/products/watch-cyber.png",
    accentFrom: "#06b6d4",
    accentTo: "#3b82f6",
    bpm: 96,
  },
  {
    id: "smart-ring",
    name: "Biometric Smart Ring",
    tagline: "Optical pulse rate & circadian bio-rhythm sensor",
    src: "/images/products/smart-ring.png",
    accentFrom: "#10b981",
    accentTo: "#a3e635",
    bpm: 90,
  },
  {
    id: "gamepad",
    name: "Esports Gamepad Pro",
    tagline: "Haptic dual-stage force feedback triggers",
    src: "/images/products/gamepad-pro.png",
    accentFrom: "#a855f7",
    accentTo: "#ec4899",
    bpm: 120,
  },
];

const COLOR_THEMES = [
  { label: "Neon Cyan / Violet", from: "#8b5cf6", to: "#06b6d4" },
  { label: "Amber / Rose Flame", from: "#f43f5e", to: "#fbbf24" },
  { label: "Emerald / Lime Pulse", from: "#059669", to: "#84cc16" },
  { label: "Electric Azure / Blue", from: "#2563eb", to: "#38bdf8" },
  { label: "Ultraviolet / Magenta", from: "#7c3aed", to: "#f43f5e" },
];

export function SoundPulseSection() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_PRESETS[0]);
  const [accentFrom, setAccentFrom] = useState(PRODUCT_PRESETS[0].accentFrom);
  const [accentTo, setAccentTo] = useState(PRODUCT_PRESETS[0].accentTo);
  const [bpm, setBpm] = useState(100);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [remountKey, setRemountKey] = useState(0);

  const handleProductSelect = (preset: (typeof PRODUCT_PRESETS)[0]) => {
    setSelectedProduct(preset);
    setAccentFrom(preset.accentFrom);
    setAccentTo(preset.accentTo);
    setBpm(preset.bpm);
    setRemountKey((k) => k + 1);
  };

  const handleThemeSelect = (theme: (typeof COLOR_THEMES)[0]) => {
    setAccentFrom(theme.from);
    setAccentTo(theme.to);
    setRemountKey((k) => k + 1);
  };

  const generatedUsageCode = `import { SoundPulse } from "nexoreui";

export default function AudioProductShowcase() {
  return (
    <SoundPulse
      src="${selectedProduct.src}"
      accentFrom="${accentFrom}"
      accentTo="${accentTo}"
      bpm={${bpm}}
      stageSize={460}
      alt="${selectedProduct.name}"
    />
  );
}`;

  const examples = [
    {
      title: "1. Studio Acoustics ANC — Neon Violet to Cyan",
      description: "Default showcase featuring wireless studio headphones with 56 radial frequency bars, bass-driven glow halo, and kick-reactive micro-scaling.",
      component: (
        <SoundPulse
          src="/images/products/headphones-studio.png"
          accentFrom="#8b5cf6"
          accentTo="#06b6d4"
          bpm={100}
          stageSize={380}
        />
      ),
      code: `import { SoundPulse } from "nexoreui";

export function StudioHeadphonesDemo() {
  return (
    <SoundPulse
      src="/images/products/headphones-studio.png"
      accentFrom="#8b5cf6"
      accentTo="#06b6d4"
      bpm={100}
      stageSize={380}
      alt="Studio Acoustics ANC"
    />
  );
}`,
    },
    {
      title: "2. Acoustic Cylinder Speaker — Amber & Rose Flame",
      description: "Warm flame harmonics with high-tempo 115 BPM electronic drum pulses driving the radial audio visualizer.",
      component: (
        <SoundPulse
          src="/images/products/portable-speaker.png"
          accentFrom="#f43f5e"
          accentTo="#fbbf24"
          bpm={115}
          stageSize={380}
        />
      ),
      code: `import { SoundPulse } from "nexoreui";

export function AcousticSpeakerDemo() {
  return (
    <SoundPulse
      src="/images/products/portable-speaker.png"
      accentFrom="#f43f5e"
      accentTo="#fbbf24"
      bpm={115}
      stageSize={380}
      alt="Acoustic Cylinder Speaker"
    />
  );
}`,
    },
    {
      title: "3. Biometric Smart Ring — Emerald Laser Bio-Pulse",
      description: "Low-tempo 88 BPM rhythmic cadence simulating cardiovascular optical telemetry with luminous green accents.",
      component: (
        <SoundPulse
          src="/images/products/smart-ring.png"
          accentFrom="#059669"
          accentTo="#84cc16"
          bpm={88}
          stageSize={380}
        />
      ),
      code: `import { SoundPulse } from "nexoreui";

export function BiometricSmartRingDemo() {
  return (
    <SoundPulse
      src="/images/products/smart-ring.png"
      accentFrom="#059669"
      accentTo="#84cc16"
      bpm={88}
      stageSize={380}
      alt="Biometric Smart Ring"
    />
  );
}`,
    },
    {
      title: "4. Cybernetic Smartwatch — Deep Azure & Electric Blue",
      description: "Clean cybernetic pulse surrounding an aerospace titanium smartwatch with procedural synthesizer bass drops.",
      component: (
        <SoundPulse
          src="/images/products/watch-cyber.png"
          accentFrom="#2563eb"
          accentTo="#38bdf8"
          bpm={96}
          stageSize={380}
        />
      ),
      code: `import { SoundPulse } from "nexoreui";

export function CyberneticWatchDemo() {
  return (
    <SoundPulse
      src="/images/products/watch-cyber.png"
      accentFrom="#2563eb"
      accentTo="#38bdf8"
      bpm={96}
      stageSize={380}
      alt="Cybernetic Smartwatch"
    />
  );
}`,
    },
    {
      title: "5. Esports Gamepad Pro — Ultraviolet Overdrive",
      description: "High-octane 125 BPM synthesizer pulse tuned for competitive gaming hardware showcases.",
      component: (
        <SoundPulse
          src="/images/products/gamepad-pro.png"
          accentFrom="#7c3aed"
          accentTo="#ec4899"
          bpm={125}
          stageSize={380}
        />
      ),
      code: `import { SoundPulse } from "nexoreui";

export function EsportsGamepadDemo() {
  return (
    <SoundPulse
      src="/images/products/gamepad-pro.png"
      accentFrom="#7c3aed"
      accentTo="#ec4899"
      bpm={125}
      stageSize={380}
      alt="Esports Gamepad Pro"
    />
  );
}`,
    },
  ];

  return (
    <section id="sound-pulse" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Music className="w-3.5 h-3.5" />
          <span>Pro Objects</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
          SoundPulse
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          Audio-reactive product presentation stage. Features an embedded procedural
          <span className="text-slate-900 dark:text-white font-semibold"> Web Audio synthesizer </span>
          with 8-step sequencer (kick, hi-hat, bassline), 56 radial frequency analyzer bars,
          bass-reactive atmospheric halo glow, and harmonic scale pulsing. No external audio files required.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-xs font-mono w-fit mt-3">
          <span className="text-slate-500 dark:text-slate-400">npx nexoreui add sound-pulse</span>
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
              <div key={remountKey} className="relative z-10 w-full flex items-center justify-center">
                <SoundPulse
                  src={selectedProduct.src}
                  accentFrom={accentFrom}
                  accentTo={accentTo}
                  bpm={bpm}
                  stageSize={440}
                  alt={selectedProduct.name}
                />
              </div>

              {/* Product Badge */}
              <div className="absolute top-4 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/8 text-[11px] font-mono text-slate-600 dark:text-slate-400 backdrop-blur-md pointer-events-none z-20">
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: accentTo }}
                />
                <span className="text-slate-900 dark:text-white font-semibold">
                  {selectedProduct.name}
                </span>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0a0d14] space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Configure Props
              </h3>

              {/* Product Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Product Silhouette
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
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
                        {p.tagline}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Palettes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Frequency Bar Gradient
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {COLOR_THEMES.map((theme) => (
                    <button
                      key={theme.label}
                      onClick={() => handleThemeSelect(theme)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                        accentFrom === theme.from && accentTo === theme.to
                          ? "border-primary bg-primary/10 text-slate-900 dark:text-white font-bold"
                          : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span>{theme.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.from }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.to }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* BPM Tempo Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Synth Tempo (BPM)</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{bpm} BPM</span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={140}
                  value={bpm}
                  onChange={(e) => {
                    setBpm(Number(e.target.value));
                    setRemountKey((k) => k + 1);
                  }}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Reset to Defaults */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(PRODUCT_PRESETS[0]);
                  setAccentFrom("#8b5cf6");
                  setAccentTo("#06b6d4");
                  setBpm(100);
                  setRemountKey((k) => k + 1);
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
              sourceCode={soundPulse.content}
              fileName="sound-pulse.tsx"
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
                <div className="min-h-[420px] flex items-center justify-center p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#07090f]">
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
    </section>
  );
}

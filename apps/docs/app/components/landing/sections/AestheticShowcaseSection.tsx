"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Sliders,
  ArrowRight,
  Copy,
  Check,
  Zap,
  Wand2
} from "lucide-react";
import { copyToClipboard } from "../../../utils/clipboard";

// Interactive Aurora Glow Card with color switcher
function InteractiveAuroraCard() {
  const [activeColor, setActiveColor] = useState<string>("#8b5cf6");
  const colors = [
    { name: "Violet", hex: "#8b5cf6" },
    { name: "Cyan", hex: "#06b6d4" },
    { name: "Emerald", hex: "#10b981" },
    { name: "Rose", hex: "#f43f5e" },
    { name: "Amber", hex: "#f59e0b" },
  ];

  return (
    <div className="relative p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md overflow-hidden flex flex-col justify-between h-full group">
      {/* Dynamic ambient glow behind card */}
      <div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-[80px] pointer-events-none opacity-40 transition-colors duration-500"
        style={{ backgroundColor: activeColor }}
      />

      <div className="space-y-2 z-10">
        <div className="flex items-center justify-between">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors"
            style={{
              backgroundColor: `${activeColor}15`,
              borderColor: `${activeColor}40`,
              color: activeColor,
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>Aurora Border FX</span>
          </div>

          {/* Color Switcher */}
          <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-full border border-border">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setActiveColor(c.hex)}
                className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                  activeColor === c.hex ? "scale-125 ring-2 ring-foreground/40 shadow-xs" : "hover:scale-110 opacity-70"
                }`}
                style={{ backgroundColor: c.hex }}
                title={`Switch glow to ${c.name}`}
              />
            ))}
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground">Reactive Aurora Borders</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Smooth multi-color conic gradients that dynamically track and react with zero JavaScript canvas lag.
        </p>
      </div>

      {/* Live Interactive Preview Box */}
      <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-center z-10">
        <div
          className="relative p-[1.5px] rounded-xl overflow-hidden transition-all duration-300 w-full max-w-[260px]"
          style={{
            background: `linear-gradient(135deg, ${activeColor}, transparent 60%, ${activeColor}80)`,
          }}
        >
          <div className="bg-card px-4 py-3 rounded-[11px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: activeColor }}
              />
              <span className="text-xs font-mono font-semibold text-foreground">Interactive Aurora Pill</span>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Component Link */}
      <Link
        href="/docs/components/aurora-border-card"
        className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        <span className="font-medium">View component & live props</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

// Live Morphing Radius Playground
function InteractiveMorphSandbox() {
  const [radiusVal, setRadiusVal] = useState<number>(14);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  return (
    <div className="relative p-5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md overflow-hidden flex flex-col justify-between h-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold">
            <Sliders className="w-3 h-3" />
            <span>Fluid Morphing</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            radius: {radiusVal}px
          </span>
        </div>

        <h3 className="text-base font-bold text-foreground">Morphing Geometry</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Drag the slider to test fluid corner transitions and token synchronization across components.
        </p>
      </div>

      {/* Animated Morph Target */}
      <div className="my-5 flex items-center justify-center h-28">
        <motion.div
          animate={isRotating ? { rotate: [0, 90, 180, 270, 360] } : { rotate: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 bg-gradient-to-tr from-primary/80 to-violet-500 border border-primary/40 shadow-lg flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all"
          style={{
            borderRadius: `${radiusVal}px`,
            boxShadow: "0 10px 30px -5px rgba(var(--primary-rgb), 0.3)",
          }}
          onClick={() => setIsRotating(!isRotating)}
          title="Click to toggle spin animation"
        >
          <Wand2 className="w-7 h-7" />
        </motion.div>
      </div>

      {/* Slider Control */}
      <div className="space-y-1 pt-2 border-t border-border/60">
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>Sharp (0px)</span>
          <span>Pill (48px)</span>
        </div>
        <input
          type="range"
          min="0"
          max="48"
          value={radiusVal}
          onChange={(e) => setRadiusVal(Number(e.target.value))}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-muted accent-primary"
        />
      </div>

      {/* Direct Component Link */}
      <Link
        href="/docs/components/morphing-geometry"
        className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        <span className="font-medium">View component & live props</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

// Interactive Code Snippet with 1-click test copy
function InteractiveCodePreview() {
  const [copied, setCopied] = useState(false);
  const codeSnippet = `import { Button } from "nexoreui";

export default function HeroAction() {
  return (
    <Button variant="aurora" size="lg">
      Launch Studio
    </Button>
  );
}`;

  const handleCopy = async () => {
    await copyToClipboard(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative p-5 rounded-2xl border border-border/80 bg-zinc-950 text-zinc-200 overflow-hidden flex flex-col justify-between h-full shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-xs font-mono text-zinc-400">HeroAction.tsx</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-[11px] font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="py-3 overflow-x-auto">
        <pre className="text-xs font-mono leading-relaxed text-zinc-300">
          <span className="text-violet-400">import</span> &#123; Button &#125; <span className="text-violet-400">from</span> <span className="text-emerald-300">"nexoreui"</span>;{"\n\n"}
          <span className="text-violet-400">export default function</span> <span className="text-sky-300">HeroAction</span>() &#123;{"\n"}
          &nbsp;&nbsp;<span className="text-violet-400">return</span> ({"\n"}
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-sky-400">Button</span> <span className="text-amber-300">variant</span>=<span className="text-emerald-300">"aurora"</span> <span className="text-amber-300">size</span>=<span className="text-emerald-300">"lg"</span>&gt;{"\n"}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Launch Studio{"\n"}
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-sky-400">Button</span>&gt;{"\n"}
          &nbsp;&nbsp;);{"\n"}
          &#125;
        </pre>
      </div>

      {/* Direct Component Link */}
      <Link
        href="/docs/components/interactive-code-block"
        className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 hover:text-white transition-colors"
      >
        <span className="font-medium">View component & live props</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

// Flagship Aesthetic Bento Section
export function AestheticShowcaseSection() {
  return (
    <section className="py-24 px-6 border-t border-border/50 relative overflow-hidden select-none">
      {/* Subtle radial ambient illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aesthetic Engineering</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Crafted for <span className="text-primary">visual impact.</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every component is fine-tuned with precision physics, adaptive dark/light contrast, and fluid micro-animations that make your apps feel alive.
          </p>
        </div>

        {/* 3-Column Interactive Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          <InteractiveAuroraCard />
          <InteractiveMorphSandbox />
          <InteractiveCodePreview />
        </div>

        {/* Bottom Fast Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-muted-foreground font-medium">
          <Link
            href="/docs/installation"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
          >
            <span>Explore Installation</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <span>•</span>
          <Link
            href="/create"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
          >
            <span>Launch Studio Builder</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <span>•</span>
          <Link
            href="/nexoremake"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
          >
            <span>Nexore Make Editor</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AestheticShowcaseSection;

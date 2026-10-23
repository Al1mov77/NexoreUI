"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Copy,
  Check,
  Wand2
} from "lucide-react";
import { copyToClipboard } from "../../../utils/clipboard";
import { AuroraBorderFX } from "nexoreui";

// Interactive Aurora Glow Card with color switcher
function InteractiveAuroraCard() {
  return (
    <AuroraBorderFX
      color="zinc"
      glow="medium"
      radius="lg"
      showColorPicker={true}
      badgeText="Aurora Border FX"
      badgeIcon={null}
      title="Reactive Aurora Borders"
      description="Smooth specular highlights and border tracks that dynamically react with zero JavaScript canvas lag."
      footerSlot={
        <Link
          href="/docs/components/aurora-border-fx"
          className="pt-2 flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span className="font-medium">View component & live props</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      }
    />
  );
}

// Live Morphing Radius Playground
function InteractiveMorphSandbox() {
  const [radiusVal, setRadiusVal] = useState<number>(14);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  return (
    <div className="relative p-5 rounded-2xl border border-border/80 dark:border-white/10 bg-card/40 dark:bg-zinc-950/60 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_12px_32px_-8px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col justify-between h-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider font-semibold">
            Fluid Geometry
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            radius: {radiusVal}px
          </span>
        </div>

        <h3 className="text-base font-bold text-foreground tracking-tight">Morphing Geometry</h3>
        <p className="text-xs text-muted-foreground leading-relaxed font-normal">
          Drag the slider to test fluid corner transitions and token synchronization across components.
        </p>
      </div>

      {/* Animated Morph Target */}
      <div className="my-5 flex items-center justify-center h-28">
        <motion.div
          animate={isRotating ? { rotate: [0, 90, 180, 270, 360] } : { rotate: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 bg-zinc-900 border border-white/20 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_24px_rgba(0,0,0,0.5)]"
          style={{
            borderRadius: `${radiusVal}px`,
          }}
          onClick={() => setIsRotating(!isRotating)}
          title="Click to toggle spin animation"
        >
          <Wand2 className="w-7 h-7 text-zinc-300" />
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
    <div className="relative p-5 rounded-2xl border border-border/80 dark:border-white/10 bg-zinc-950 text-zinc-200 overflow-hidden flex flex-col justify-between h-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_12px_32px_-8px_rgba(0,0,0,0.5)]">
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
          <span className="text-zinc-100">import</span> &#123; Button &#125; <span className="text-zinc-100">from</span> <span className="text-emerald-300">"nexoreui"</span>;{"\n\n"}
          <span className="text-zinc-100">export default function</span> <span className="text-zinc-100">HeroAction</span>() &#123;{"\n"}
          &nbsp;&nbsp;<span className="text-zinc-100">return</span> ({"\n"}
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-zinc-100">Button</span> <span className="text-amber-300">variant</span>=<span className="text-emerald-300">"default"</span> <span className="text-amber-300">size</span>=<span className="text-emerald-300">"lg"</span>&gt;{"\n"}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Launch Studio{"\n"}
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-zinc-100">Button</span>&gt;{"\n"}
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
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground block">
            Aesthetic Engineering
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.04em] text-foreground">
            Crafted for visual impact.
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
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

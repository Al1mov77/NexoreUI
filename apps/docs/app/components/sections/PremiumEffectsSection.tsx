"use client";

import React from "react";
import { ComponentSource } from "../ComponentSource";
import {
  GlowSpotlightCard,
  WordFadeReveal,
  AnimatedGridBackground,
  BentoGrid,
  BentoCard,
} from "nexoreui";
import { Zap, Shield, Code, Terminal, Layers } from "lucide-react";

const variants = [
  {
    name: "Glow Spotlight Card",
    component: (
      <div className="flex gap-4 flex-wrap justify-center w-full max-w-2xl p-2">
        <GlowSpotlightCard className="w-72 h-44 flex flex-col justify-between border border-border bg-card relative">
          <div>
            <Zap className="w-6 h-6 text-foreground mb-2" />
            <h4 className="font-semibold text-foreground">Interactive Spotlight</h4>
            <p className="text-xs text-muted-foreground mt-1">Move your cursor over this card to follow the radial spotlight gradient.</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Default Token</span>
        </GlowSpotlightCard>
        <GlowSpotlightCard
          glowColor="color-mix(in srgb, var(--foreground) 14%, transparent)"
          className="w-72 h-44 flex flex-col justify-between border border-border bg-card relative"
        >
          <div>
            <Layers className="w-6 h-6 text-foreground mb-2" />
            <h4 className="font-semibold text-foreground">Custom Tint</h4>
            <p className="text-xs text-muted-foreground mt-1">Pass any CSS color or color-mix token via the glowColor prop.</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Configurable</span>
        </GlowSpotlightCard>
      </div>
    ),
    code: `import { GlowSpotlightCard } from "nexoreui";
import { Zap } from "lucide-react";

<GlowSpotlightCard className="w-72 h-44 flex flex-col justify-between bg-card">
  <div>
    <Zap className="w-6 h-6 text-foreground" />
    <h4 className="font-semibold">Interactive Spotlight</h4>
    <p className="text-xs text-muted-foreground">Move your cursor over this card.</p>
  </div>
</GlowSpotlightCard>`,
  },
  {
    name: "Word Fade Reveal",
    component: (
      <div className="flex flex-col items-center justify-center p-6 text-center max-w-lg">
        <WordFadeReveal
          text="Build responsive interfaces with precise layout systems and accessible primitives."
          className="text-xl font-bold tracking-tight text-foreground"
        />
      </div>
    ),
    code: `import { WordFadeReveal } from "nexoreui";

<WordFadeReveal
  text="Build responsive interfaces with precise layout systems and accessible primitives."
  className="text-xl font-bold tracking-tight"
/>`,
  },
  {
    name: "Animated Grid Background",
    component: (
      <div className="relative w-full h-[240px] overflow-hidden rounded-xl border border-border bg-card flex items-center justify-center">
        <AnimatedGridBackground
          width={40}
          height={40}
          flashInterval={900}
        />
        <div className="relative z-10 text-center space-y-2 p-5 bg-background/90 border border-border rounded-xl max-w-xs">
          <Terminal className="w-6 h-6 text-foreground mx-auto" />
          <h4 className="font-semibold text-foreground text-sm">Dynamic Coordinate Grid</h4>
          <p className="text-xs text-muted-foreground">Subtle grid cells highlight at configurable intervals using theme border tokens.</p>
        </div>
      </div>
    ),
    code: `import { AnimatedGridBackground } from "nexoreui";

<div className="relative h-[240px] border border-border rounded-xl overflow-hidden flex items-center justify-center">
  <AnimatedGridBackground width={40} height={40} flashInterval={900} />
  <div className="relative z-10">Grid Content</div>
</div>`,
  },
  {
    name: "Bento Grid Layout",
    component: (
      <div className="w-full max-w-2xl p-2">
        <BentoGrid>
          <BentoCard
            title="Access Control"
            description="Role-based permissions and encrypted session storage."
            span="md:col-span-2"
            icon={<Shield className="w-5 h-5" />}
            header={
              <div className="h-16 bg-muted border border-border rounded-lg flex items-center justify-center text-foreground font-mono text-xs">
                RBAC · Audit Trail
              </div>
            }
          />
          <BentoCard
            title="Low Latency"
            description="Regional edge caching."
            span="md:col-span-1"
            icon={<Zap className="w-5 h-5" />}
          />
          <BentoCard
            title="Typed API"
            description="Strict TypeScript props."
            span="md:col-span-1"
            icon={<Code className="w-5 h-5" />}
          />
          <BentoCard
            title="Composable Primitives"
            description="Copy source files directly into your repository."
            span="md:col-span-2"
            icon={<Layers className="w-5 h-5" />}
          />
        </BentoGrid>
      </div>
    ),
    code: `import { BentoGrid, BentoCard } from "nexoreui";
import { Shield, Zap } from "lucide-react";

<BentoGrid>
  <BentoCard
    title="Access Control"
    description="Role-based permissions and encrypted session storage."
    span="md:col-span-2"
    icon={<Shield className="w-5 h-5" />}
  />
  <BentoCard
    title="Low Latency"
    description="Regional edge caching."
    icon={<Zap className="w-5 h-5" />}
  />
</BentoGrid>`,
  },
];

export function PremiumEffectsSection() {
  return (
    <section id="premium-effects" className="space-y-12 scroll-mt-20">
      {variants.map((item, i) => (
        <div key={i} className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">{item.name}</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div
              data-demo-preview
              className="flex min-h-[260px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-6 relative"
            >
              {item.component}
            </div>
            <ComponentSource sourceCode={item.code} />
          </div>
        </div>
      ))}
    </section>
  );
}

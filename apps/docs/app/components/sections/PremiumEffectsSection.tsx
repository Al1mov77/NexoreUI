"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { 
  GlowSpotlightCard, 
  WordFadeReveal, 
  AnimatedGridBackground, 
  BentoGrid, 
  BentoCard, 
  Button 
} from "nexoreui";
import { Zap, Shield, Sparkles, Code, Terminal, Heart } from "lucide-react";

const variants = [
  {
    name: "Glow Spotlight Card",
    component: (
      <div className="flex gap-4 flex-wrap justify-center w-full max-w-2xl p-4">
        <GlowSpotlightCard className="w-72 h-44 flex flex-col justify-between group border border-border/40 bg-card/40 backdrop-blur-sm relative">
          <div>
            <Sparkles className="w-8 h-8 text-primary mb-2" />
            <h4 className="font-semibold text-foreground">Interactive Spotlight</h4>
            <p className="text-xs text-muted-foreground mt-1">Move your cursor over this card to watch the radial glow trace your movement.</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-primary font-mono font-medium">SAAS Effect</span>
        </GlowSpotlightCard>
        <GlowSpotlightCard 
          glowColor="rgba(236, 72, 153, 0.15)"
          className="w-72 h-44 flex flex-col justify-between group border border-border/40 bg-card/40 backdrop-blur-sm relative"
        >
          <div>
            <Zap className="w-8 h-8 text-pink-500 mb-2" />
            <h4 className="font-semibold text-foreground">Customizable Color</h4>
            <p className="text-xs text-muted-foreground mt-1">Pass any RGBA color or CSS variable color token to style the spotlight glow.</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-pink-500 font-mono font-medium">Customizable</span>
        </GlowSpotlightCard>
      </div>
    ),
    code: `import { GlowSpotlightCard } from "nexoreui"\nimport { Sparkles } from "lucide-react"\n\n<GlowSpotlightCard className="w-72 h-44 flex flex-col justify-between bg-card">\n  <div>\n    <Sparkles className="w-8 h-8 text-primary" />\n    <h4 className="font-semibold">Interactive Spotlight</h4>\n    <p className="text-xs text-muted-foreground">Move your cursor over this card.</p>\n  </div>\n</GlowSpotlightCard>`
  },
  {
    name: "Word Fade Reveal",
    component: (
      <div className="flex flex-col items-center justify-center p-6 text-center max-w-lg">
        <WordFadeReveal 
          text="Elevate your workspace with beautiful and high performance interactive animations."
          className="text-xl font-bold tracking-tight text-foreground"
        />
      </div>
    ),
    code: `import { WordFadeReveal } from "nexoreui"\n\n<WordFadeReveal \n  text="Elevate your workspace with beautiful and high performance interactive animations."\n  className="text-xl font-bold tracking-tight"\n/>`
  },
  {
    name: "Animated Grid Background",
    component: (
      <div className="relative w-full h-[250px] overflow-hidden rounded-xl border border-border/60 bg-zinc-950 flex items-center justify-center">
        <AnimatedGridBackground 
          width={40}
          height={40}
          strokeColor="rgba(255, 255, 255, 0.04)"
          cellFlashColor="rgba(168, 85, 247, 0.15)"
          flashInterval={800}
        />
        <div className="relative z-10 text-center space-y-2 p-6 bg-zinc-900/60 border border-white/5 backdrop-blur-md rounded-xl max-w-xs">
          <Terminal className="w-8 h-8 text-primary mx-auto" />
          <h4 className="font-semibold text-white">Dynamic Grid</h4>
          <p className="text-xs text-zinc-400">Random grid cells shimmer with a pulse transition to create a live developer aesthetic.</p>
        </div>
      </div>
    ),
    code: `import { AnimatedGridBackground } from "nexoreui"\n\n<div className="relative h-[250px] bg-zinc-950 flex items-center justify-center">\n  <AnimatedGridBackground \n    width={40}\n    height={40}\n    strokeColor="rgba(255, 255, 255, 0.04)"\n    cellFlashColor="rgba(168, 85, 247, 0.15)"\n    flashInterval={800}\n  />\n  <div className="z-10">Dynamic Grid Content</div>\n</div>`
  },
  {
    name: "Bento Grid Dashboard Layout",
    component: (
      <div className="w-full max-w-2xl p-4 bg-background/50 rounded-2xl border border-border/40">
        <BentoGrid>
          <BentoCard
            title="Premium Security"
            description="Enterprise level end-to-end data encryption."
            span="md:col-span-2"
            icon={<Shield className="w-5 h-5" />}
            header={<div className="h-20 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-mono text-xs">Secure Shield</div>}
          />
          <BentoCard
            title="Infinite Speed"
            description="Global CDN edge routing."
            span="md:col-span-1"
            icon={<Zap className="w-5 h-5" />}
          />
          <BentoCard
            title="Clean Code"
            description="Highly extensible API design."
            span="md:col-span-1"
            icon={<Code className="w-5 h-5" />}
          />
          <BentoCard
            title="Built with Love"
            description="Crafted with modern design principles."
            span="md:col-span-2"
            icon={<Heart className="w-5 h-5 text-red-500" />}
          />
        </BentoGrid>
      </div>
    ),
    code: `import { BentoGrid, BentoCard } from "nexoreui"\nimport { Shield, Zap, Code, Heart } from "lucide-react"\n\n<BentoGrid>\n  <BentoCard\n    title="Security"\n    description="Enterprise level end-to-end encryption."\n    span="md:col-span-2"\n    icon={<Shield />}\n  />\n  <BentoCard\n    title="Speed"\n    description="Global CDN edge routing."\n    icon={<Zap />}\n  />\n</BentoGrid>`
  }
];

export function PremiumEffectsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="premium-effects" className="space-y-8 scroll-mt-20 mt-16">
      <div className="flex items-center justify-between border-t border-border/40 pt-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Premium SAAS Effects</h2>
          <p className="text-muted-foreground">Cutting edge micro-interactions and grid effects to wow your visitors.</p>
        </div>
      </div>
      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-6 relative">
                {item.component}
              </div>
              <ComponentSource sourceCode={item.code} />
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
          <span className="text-sm font-medium mx-4">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      )}
    </section>
  );
}

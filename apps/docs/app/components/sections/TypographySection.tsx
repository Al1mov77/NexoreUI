"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { GradientText, GlitchText, HighlightText, RevealText, OutlineText, GlowText, NeonText, BlurText, ShadowText, AnimatedHeroText, MorphingText, ShinyText, Button } from "nexoreui";

const variants = [
  {
    name: "Gradient Text",
    component: <div className="text-4xl font-bold"><GradientText>Gradient Flow</GradientText></div>,
    code: `import { GradientText } from "nexoreui"\n\n<GradientText>\n  Gradient Flow\n</GradientText>`
  },
  {
    name: "Glitch Text",
    component: <div className="text-4xl font-bold"><GlitchText text="CYBERPUNK" /></div>,
    code: `import { GlitchText } from "nexoreui"\n\n<GlitchText text="CYBERPUNK" />`
  },
  {
    name: "Highlight Text",
    component: <div className="text-2xl font-bold">Discover the <HighlightText color="bg-yellow-200 dark:bg-yellow-500/30">new features</HighlightText> today.</div>,
    code: `import { HighlightText } from "nexoreui"\n\n<HighlightText color="bg-yellow-200">\n  new features\n</HighlightText>`
  },
  {
    name: "Reveal Text",
    component: <div className="text-3xl font-bold"><RevealText text="Hover to Reveal Secrets" /></div>,
    code: `import { RevealText } from "nexoreui"\n\n<RevealText text="Hover to Reveal Secrets" />`
  },
  {
    name: "Outline Text",
    component: <div className="text-5xl font-extrabold uppercase"><OutlineText>OUTLINE</OutlineText></div>,
    code: `import { OutlineText } from "nexoreui"\n\n<OutlineText>OUTLINE</OutlineText>`
  },
  {
    name: "Glow Text",
    component: <div className="text-4xl font-bold"><GlowText>Glowing Energy</GlowText></div>,
    code: `import { GlowText } from "nexoreui"\n\n<GlowText>Glowing Energy</GlowText>`
  },
  {
    name: "Neon Text",
    component: <div className="p-4 bg-zinc-950 rounded-lg text-4xl font-mono"><NeonText>NEON SIGN</NeonText></div>,
    code: `import { NeonText } from "nexoreui"\n\n<NeonText>NEON SIGN</NeonText>`
  },
  {
    name: "Blur Text",
    component: <div className="text-4xl font-bold"><BlurText>Focus Me on Hover</BlurText></div>,
    code: `import { BlurText } from "nexoreui"\n\n<BlurText>Focus Me on Hover</BlurText>`
  },
  {
    name: "Animated Hero Text",
    component: <AnimatedHeroText />,
    code: `import { AnimatedHeroText } from "nexoreui"\n\n<AnimatedHeroText />`
  },
  {
    name: "Shiny Text",
    component: <div className="text-4xl font-bold bg-zinc-950 p-4 rounded-lg"><ShinyText>Premium Quality</ShinyText></div>,
    code: `import { ShinyText } from "nexoreui"\n\n<ShinyText>Premium Quality</ShinyText>`
  }
];

export function TypographySection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="typography" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Typography</h2>
          <p className="text-muted-foreground">Text effects, animations, and beautiful typographic components.</p>
        </div>
      </div>
      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-border bg-background p-6">
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

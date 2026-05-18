"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { GlassCard, GlowCard, GradientCard, HoverCard, NeumorphicCard, GradientMeshCard, TiltCard, FeatureCard, MetricCard, SpotlightCard, Button } from "nexoreui";

const variants = [
  {
    name: "Glass Card",
    component: <div className="p-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl w-full max-w-sm"><GlassCard className="p-6">Glassmorphism effect over complex backgrounds.</GlassCard></div>,
    code: `import { GlassCard } from "nexoreui"\n\n<GlassCard className="p-6">\n  Glassmorphism effect...\n</GlassCard>`
  },
  {
    name: "Glow Card",
    component: <GlowCard className="p-6 w-full max-w-sm"><h3 className="font-bold">Glow Effect</h3><p className="text-sm text-muted-foreground mt-2">Soft colored shadow around the card.</p></GlowCard>,
    code: `import { GlowCard } from "nexoreui"\n\n<GlowCard className="p-6">\n  <h3>Glow Effect</h3>\n</GlowCard>`
  },
  {
    name: "Gradient Card",
    component: <GradientCard className="p-6 w-full max-w-sm"><h3 className="font-bold text-white">Gradient Card</h3><p className="text-sm text-white/80 mt-2">Fully colored gradient background.</p></GradientCard>,
    code: `import { GradientCard } from "nexoreui"\n\n<GradientCard className="p-6">\n  <h3>Gradient Card</h3>\n</GradientCard>`
  },
  {
    name: "Hover Reveal Card",
    component: <HoverCard className="w-full max-w-sm h-48 flex items-center justify-center border rounded-xl"><span className="font-medium">Hover me to reveal</span></HoverCard>,
    code: `import { HoverCard } from "nexoreui"\n\n<HoverCard>\n  <span>Hover me to reveal</span>\n</HoverCard>`
  },
  {
    name: "Neumorphic Card",
    component: <NeumorphicCard className="p-6 w-full max-w-sm"><h3 className="font-bold text-zinc-800 dark:text-zinc-200">Soft UI Design</h3><p className="text-sm mt-2">Extruded plastic look.</p></NeumorphicCard>,
    code: `import { NeumorphicCard } from "nexoreui"\n\n<NeumorphicCard className="p-6">\n  <h3>Soft UI Design</h3>\n</NeumorphicCard>`
  },
  {
    name: "Gradient Mesh Card",
    component: <GradientMeshCard className="w-full max-w-sm h-48 rounded-xl flex items-center justify-center text-white font-bold text-xl">Mesh Background</GradientMeshCard>,
    code: `import { GradientMeshCard } from "nexoreui"\n\n<GradientMeshCard className="h-48 rounded-xl">\n  Mesh Background\n</GradientMeshCard>`
  },
  {
    name: "Tilt Card (3D)",
    component: <TiltCard className="w-full max-w-sm h-48 bg-secondary rounded-xl flex items-center justify-center border shadow-lg cursor-pointer font-medium">Hover to tilt in 3D</TiltCard>,
    code: `import { TiltCard } from "nexoreui"\n\n<TiltCard className="h-48 rounded-xl">\n  Hover to tilt in 3D\n</TiltCard>`
  },
  {
    name: "Feature Card",
    component: <FeatureCard icon={<div className="h-6 w-6 bg-primary rounded-full" />} title="Lightning Fast" description="Optimized for performance and speed." />,
    code: `import { FeatureCard } from "nexoreui"\n\n<FeatureCard \n  icon={<Zap />} \n  title="Lightning Fast" \n  description="..." \n/>`
  },
  {
    name: "Metric Card",
    component: <MetricCard title="Active Users" metric="12,450" change="+15%" isPositive={true} chart={<div className="h-8 w-full bg-primary/20 rounded-md mt-4"></div>} />,
    code: `import { MetricCard } from "nexoreui"\n\n<MetricCard \n  title="Active Users" \n  metric="12,450" \n  change="+15%" \n  isPositive={true} \n  chart={<Sparkline />} \n/>`
  },
  {
    name: "Spotlight Card",
    component: <SpotlightCard className="p-8 w-full max-w-sm bg-zinc-950 rounded-xl border border-white/10 text-white font-medium"><p>Move your mouse over this card to see the spotlight effect illuminating the borders and content.</p></SpotlightCard>,
    code: `import { SpotlightCard } from "nexoreui"\n\n<SpotlightCard className="p-8 bg-zinc-950 text-white">\n  Move your mouse over this card...\n</SpotlightCard>`
  }
];

export function SpecialCardsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(variants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = variants.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="special-cards" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Special Cards</h2>
          <p className="text-muted-foreground">Premium card components with advanced styling and effects.</p>
        </div>
      </div>
      <div className="space-y-12">
        {visibleItems.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-lg font-medium">{item.name}</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="flex min-h-[250px] items-center justify-center rounded-xl border border-border bg-background p-6">
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

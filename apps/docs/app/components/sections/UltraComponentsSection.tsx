"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  AnimatedGradientBorder,
  ShinyText,
  RetroGrid,
} from "nexoreui";

export function UltraComponentsSection() {
  return (
    <SuiteSectionLayout
      id="ultra-components"
      title="Ultra Components"
      badge="Atmospheric Effects"
      description="Next-generation background effects and spatial primitives: rotating conic gradient tracks, retro grid perspective planes, and reflective specular text."
      cliCommand="npx nexoreui add ultra-components"
      items={[
        {
          name: "Animated Gradient Border Card",
          description: "Card container with an orbital conic gradient light beam sweeping across its border path.",
          component: (
            <div className="w-full max-w-sm">
              <AnimatedGradientBorder className="p-6 rounded-xl bg-card">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Continuous Border Flow</h4>
                  <p className="text-xs text-muted-foreground">
                    Smoothly rotating gradient border track using conic shader animation.
                  </p>
                </div>
              </AnimatedGradientBorder>
            </div>
          ),
          code: `import { AnimatedGradientBorder } from "nexoreui"

<AnimatedGradientBorder className="p-6 rounded-xl bg-card">
  <h4>Continuous Border Flow</h4>
  <p>Smoothly rotating gradient border track.</p>
</AnimatedGradientBorder>`
        },
        {
          name: "Shiny Text",
          description: "Glinting typography effect with moving specular shimmer across letterforms.",
          component: (
            <div className="py-6">
              <ShinyText className="text-xl md:text-2xl font-bold font-mono tracking-tight text-center">
                ENGINEERED FOR MODERN INTERFACES
              </ShinyText>
            </div>
          ),
          code: `import { ShinyText } from "nexoreui"

<ShinyText className="text-2xl font-bold font-mono">
  ENGINEERED FOR MODERN INTERFACES
</ShinyText>`
        },
        {
          name: "Retro Perspective Grid",
          description: "Geometric horizon grid plane with infinite forward scroll perspective.",
          component: (
            <div className="w-full h-48 relative border rounded-xl overflow-hidden bg-background flex items-center justify-center">
              <RetroGrid />
              <span className="relative z-10 text-xs font-mono font-bold bg-background/80 px-3 py-1 rounded border">
                3D Horizon Perspective
              </span>
            </div>
          ),
          code: `import { RetroGrid } from "nexoreui"

<div className="relative h-64 overflow-hidden border rounded-xl">
  <RetroGrid />
</div>`
        }
      ]}
      a11yNotes={[
        "Performance: RetroGrid and animated borders pause when out of viewport or when reduced motion is preferred.",
        "Contrast: Shiny text retains full contrast ratio above WCAG 2.1 AA standards."
      ]}
    />
  );
}

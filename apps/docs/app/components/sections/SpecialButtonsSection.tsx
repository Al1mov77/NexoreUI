"use client";

import React from "react";
import { ComponentCard } from "../ComponentSource";
import { GlowButton, ShinyButton, GradientButton, GlassButton, OutlineGradientButton, MorphButton, SplitButton, CopyTextButton, ExpandButton, StatusButton, Button } from "nexoreui";
import { ArrowRight } from "lucide-react";

export function SpecialButtonsSection() {
  return (
    <section id="special-buttons" className="space-y-8 scroll-mt-20">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Special Buttons</h2>
        <p className="text-sm text-muted-foreground mt-1">Advanced button components with animations and effects.</p>
      </div>

      <div className="space-y-6">
        <ComponentCard
          title="Glow Button"
          description="Button with a radial glow effect behind it"
          code={`import { GlowButton } from "nexoreui"\n\n<GlowButton>Glow Effect</GlowButton>`}
          fileName="glow-button.tsx"
        >
          <div className="flex justify-center">
            <GlowButton>Glow Effect</GlowButton>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Shiny Button"
          description="Button with a light sweep animation on hover"
          code={`import { ShinyButton } from "nexoreui"\n\n<ShinyButton>Shiny Animation</ShinyButton>`}
          fileName="shiny-button.tsx"
        >
          <div className="flex justify-center">
            <ShinyButton>Shiny Animation</ShinyButton>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Gradient Button"
          description="Button with indigo-purple-pink gradient"
          code={`import { GradientButton } from "nexoreui"\n\n<GradientButton>Gradient Style</GradientButton>`}
          fileName="gradient-button.tsx"
        >
          <div className="flex justify-center">
            <GradientButton>Gradient Style</GradientButton>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Glass Button"
          description="Glassmorphic button with backdrop blur"
          code={`import { GlassButton } from "nexoreui"\n\n<GlassButton>Glassmorphism</GlassButton>`}
          fileName="glass-button.tsx"
        >
          <div className="flex justify-center p-4 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg">
            <GlassButton>Glassmorphism</GlassButton>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Outline Gradient"
          description="Gradient border with transparent background"
          code={`import { OutlineGradientButton } from "nexoreui"\n\n<OutlineGradientButton>Outline Gradient</OutlineGradientButton>`}
          fileName="outline-gradient.tsx"
        >
          <div className="flex justify-center">
            <OutlineGradientButton>Outline Gradient</OutlineGradientButton>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Morph Button"
          description="Shape morphs from rounded to pill on hover"
          code={`import { MorphButton } from "nexoreui"\n\n<MorphButton>Morph Shape</MorphButton>`}
          fileName="morph-button.tsx"
        >
          <div className="flex justify-center">
            <MorphButton>Morph Shape</MorphButton>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Split Button"
          description="Primary action with secondary dropdown"
          code={`import { SplitButton } from "nexoreui"\n\n<SplitButton\n  primary="Publish"\n  secondary="▼"\n/>`}
          fileName="split-button.tsx"
        >
          <div className="flex justify-center">
            <SplitButton primary="Publish" secondary="▼" />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Copy Text Button"
          description="Click to copy text with visual feedback"
          code={`import { CopyTextButton } from "nexoreui"\n\n<CopyTextButton text="npm install nexoreui" />`}
          fileName="copy-button.tsx"
        >
          <div className="flex justify-center">
            <CopyTextButton text="npm install nexoreui" />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Expand Button"
          description="Reveals an icon on hover"
          code={`import { ExpandButton } from "nexoreui"\nimport { ArrowRight } from "lucide-react"\n\n<ExpandButton icon={<ArrowRight className="h-4 w-4" />}>\n  Get Started\n</ExpandButton>`}
          fileName="expand-button.tsx"
        >
          <div className="flex justify-center">
            <ExpandButton icon={<ArrowRight className="h-4 w-4" />}>
              Get Started
            </ExpandButton>
          </div>
        </ComponentCard>
      </div>
    </section>
  );
}

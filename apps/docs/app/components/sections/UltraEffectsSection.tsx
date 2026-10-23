"use client";

import React from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  MorphingText,
  InteractiveHoverButton,
  WordPullUp,
  BoxReveal,
  TextShimmer,
} from "nexoreui";

export function UltraEffectsSection() {
  return (
    <SuiteSectionLayout
      id="ultra-effects"
      title="Ultra Effects"
      badge="Motion & Typography"
      description="Motion typography and interactive button effects engineered with Framer Motion: fluid text morphing, box reveal masking, interactive hover states, and shimmer text."
      cliCommand="npx nexoreui add ultra-effects"
      items={[
        {
          name: "Morphing Text",
          description: "Smooth blur-fade text transitions cycling through an array of key phrases.",
          component: (
            <div className="text-xl md:text-2xl font-bold font-mono tracking-tight text-center py-6">
              <MorphingText
                texts={["Performance First", "TypeScript Native", "Tailwind CSS v4", "Radix UI Primitives"]}
                interval={2500}
              />
            </div>
          ),
          code: `import { MorphingText } from "nexoreui"

<MorphingText
  texts={["Performance First", "TypeScript Native", "Tailwind CSS v4", "Radix UI Primitives"]}
  interval={2500}
/>`,
          propsData: [
            { name: "texts", type: "string[]", defaultValue: "—", description: "Array of string values to cycle through.", required: true },
            { name: "interval", type: "number", defaultValue: "3000", description: "Duration in milliseconds between text transitions.", required: false }
          ]
        },
        {
          name: "Word Pull-Up",
          description: "Staggered spring entrance animation revealing words sequentially from the bottom.",
          component: (
            <div className="py-4">
              <WordPullUp
                words="Built for high-scale applications"
                className="text-xl md:text-2xl font-bold tracking-tight text-center"
              />
            </div>
          ),
          code: `import { WordPullUp } from "nexoreui"

<WordPullUp
  words="Built for high-scale applications"
  className="text-2xl font-bold tracking-tight"
/>`,
          propsData: [
            { name: "words", type: "string", defaultValue: "—", description: "Text sentence to split and animate word-by-word.", required: true },
            { name: "delayMultiple", type: "number", defaultValue: "0.08", description: "Stagger delay between consecutive words.", required: false }
          ]
        },
        {
          name: "Box Reveal",
          description: "Masking block wipe that reveals heading text with a slide-and-fade transition.",
          component: (
            <div className="space-y-2 py-2">
              <BoxReveal boxColor="var(--primary)" duration={0.5}>
                <h3 className="text-xl font-bold">Nexore Design System</h3>
              </BoxReveal>
              <BoxReveal boxColor="var(--primary)" duration={0.6}>
                <p className="text-xs text-muted-foreground">
                  Uncompromising precision in UI engineering and animation mechanics.
                </p>
              </BoxReveal>
            </div>
          ),
          code: `import { BoxReveal } from "nexoreui"

<BoxReveal boxColor="var(--primary)" duration={0.5}>
  <h3 className="text-xl font-bold">Nexore Design System</h3>
</BoxReveal>`
        },
        {
          name: "Interactive Hover Button",
          description: "Tactile action button with icon slide-in and expanded label indicator.",
          component: (
            <div className="p-4 flex items-center justify-center">
              <InteractiveHoverButton text="Deploy to Production" />
            </div>
          ),
          code: `import { InteractiveHoverButton } from "nexoreui"

<InteractiveHoverButton text="Deploy to Production" />`,
          propsData: [
            { name: "text", type: "string", defaultValue: "'Button'", description: "Label text shown initially on the button.", required: false }
          ]
        },
        {
          name: "Text Shimmer",
          description: "Subtle specular light beam sweeping across typography for subtle focal emphasis.",
          component: (
            <div className="py-4">
              <TextShimmer className="text-sm font-mono font-medium tracking-wide">
                ✦ Synchronizing cluster across 8 geographic regions...
              </TextShimmer>
            </div>
          ),
          code: `import { TextShimmer } from "nexoreui"

<TextShimmer className="text-sm font-mono">
  ✦ Synchronizing cluster across 8 geographic regions...
</TextShimmer>`
        }
      ]}
      a11yNotes={[
        "Reduced Motion: All text transitions and sliding boxes automatically disable animations when prefers-reduced-motion is active.",
        "Semantic Structure: WordPullUp and MorphingText preserve readable DOM text structure for accessibility tools and web scrapers."
      ]}
    />
  );
}

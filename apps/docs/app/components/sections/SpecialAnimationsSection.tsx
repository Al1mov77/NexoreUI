"use client";

import React, { useState } from "react";
import { SuiteSectionLayout } from "./SuiteSectionLayout";
import {
  FadeIn,
  SlideUp,
  ScaleIn,
  Float,
  RevealClip,
  StaggerContainer,
  StaggerItem,
  TypingAnimation,
  Button,
} from "nexoreui";

export function SpecialAnimationsSection() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <SuiteSectionLayout
      id="special-animations"
      title="Special Animations"
      badge="Motion Utilities"
      description="Composable Framer Motion wrappers for entrance choreographies, staggered cascades, floating micro-physics, and dynamic typewriter animations."
      cliCommand="npx nexoreui add special-animations"
      items={[
        {
          name: "Staggered Container & Items",
          description: "Cascading entrance animation that staggers child items with smooth ease-out physics.",
          component: (
            <div className="w-full max-w-sm space-y-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setReplayKey((k) => k + 1)}>
                  Replay
                </Button>
              </div>
              <div key={replayKey} className="space-y-2">
                <StaggerContainer staggerChildren={0.08} delayChildren={0.05}>
                  {["Authentication verified", "Profile state hydrated", "Workspace connected"].map((step, i) => (
                    <StaggerItem key={i}>
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/60 text-xs font-medium my-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>{step}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          ),
          code: `import { StaggerContainer, StaggerItem } from "nexoreui"

<StaggerContainer staggerChildren={0.08} delayChildren={0.05}>
  <StaggerItem><Card>Step 1</Card></StaggerItem>
  <StaggerItem><Card>Step 2</Card></StaggerItem>
  <StaggerItem><Card>Step 3</Card></StaggerItem>
</StaggerContainer>`,
          propsData: [
            { name: "staggerChildren", type: "number", defaultValue: "0.1", description: "Delay interval between child reveals.", required: false },
            { name: "delayChildren", type: "number", defaultValue: "0.1", description: "Initial start delay before container triggers.", required: false }
          ]
        },
        {
          name: "Float Animation",
          description: "Subtle continuous floating physics for decorative accents or cards.",
          component: (
            <div className="py-8">
              <Float>
                <div className="px-4 py-2.5 rounded-xl border border-border bg-card shadow-sm text-xs font-mono font-semibold text-foreground">
                  Floating Element ✦
                </div>
              </Float>
            </div>
          ),
          code: `import { Float } from "nexoreui"

<Float>
  <div className="p-4 rounded-xl border bg-card">Floating Card</div>
</Float>`
        },
        {
          name: "Typing Animation",
          description: "Typewriter effect cycling through multiple strings with cursor blink.",
          component: (
            <div className="p-4 rounded-xl border border-border bg-card/60 font-mono text-sm">
              <TypingAnimation
                texts={[
                  "Crafting zero-slop interfaces.",
                  "Engineered for Next.js 15 & React 19.",
                  "Export full standalone code."
                ]}
                speed={70}
                deleteSpeed={35}
                pauseDuration={1800}
              />
            </div>
          ),
          code: `import { TypingAnimation } from "nexoreui"

<TypingAnimation
  texts={["Welcome to NexoreUI", "Clean, modern components"]}
  speed={70}
/>`
        },
        {
          name: "Reveal Clip Transition",
          description: "Curtain wipe effect using CSS clip-path interpolation.",
          component: (
            <div className="py-4 w-full max-w-sm text-center">
              <RevealClip duration={0.6}>
                <div className="p-4 rounded-xl border border-border bg-muted/40 font-mono text-xs">
                  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%)
                </div>
              </RevealClip>
            </div>
          ),
          code: `import { RevealClip } from "nexoreui"

<RevealClip duration={0.6}>
  <div className="p-4 rounded-xl border">Clipped Content</div>
</RevealClip>`
        },
        {
          name: "Slide & Scale Combinators",
          description: "Directional entrance primitives with configurable duration and delay.",
          component: (
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-center text-xs">
              <SlideUp duration={0.6}><div className="p-3 border rounded-lg bg-card">SlideUp</div></SlideUp>
              <ScaleIn duration={0.6}><div className="p-3 border rounded-lg bg-card">ScaleIn</div></ScaleIn>
            </div>
          ),
          code: `import { SlideUp, ScaleIn } from "nexoreui"

<SlideUp duration={0.6}><div>SlideUp</div></SlideUp>
<ScaleIn duration={0.6}><div>ScaleIn</div></ScaleIn>`
        }
      ]}
      a11yNotes={[
        "Prefers-Reduced-Motion: All directional transitions collapse to instantaneous opacity reveals when users request reduced motion.",
        "Performance: Animations use GPU-accelerated transform properties only."
      ]}
    />
  );
}

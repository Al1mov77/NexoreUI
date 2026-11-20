"use client";

import React, { useState } from "react";
import { SwipeDeck } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "stiff", type: "number", defaultValue: "220", description: "Hooke's law spring stiffness restoring position." },
  { name: "damp", type: "number", defaultValue: "22", description: "Harmonic damping preventing infinite oscillation." },
  { name: "tilt", type: "number", defaultValue: "8", description: "Rotational tilt angle in degrees per 100px drag offset." },
  { name: "fling", type: "number", defaultValue: "650", description: "Minimum release velocity threshold for flick discharge (px/s)." },
  { name: "depth", type: "number", defaultValue: "3", description: "Number of cascading visible background cards in stack." },
  { name: "offset", type: "number", defaultValue: "16", description: "Vertical stacking offset distance in pixels." },
  { name: "shrink", type: "number", defaultValue: "0.06", description: "Scale reduction factor per card depth level." },
  { name: "radius", type: "number", defaultValue: "26", description: "Card corner border radius in pixels." },
  { name: "lift", type: "number", defaultValue: "1.04", description: "Active card scale boost when grabbed." },
  { name: "bg", type: "string", defaultValue: '"#0f1014"', description: "Container stage backdrop fill." },
  { name: "cards", type: "DeckCardItem[]", defaultValue: "DEFAULT_CARDS", description: "Custom array of cards with word, bg, fg, and text." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { SwipeDeck } from "nexoreui";

export function PhysicalDeckDemo() {
  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl flex items-center justify-center">
      <SwipeDeck
        stiff={220}
        damp={22}
        tilt={8}
        fling={650}
        depth={3}
        offset={16}
        radius={24}
        bg="#0f1014"
        className="h-full w-full"
      />
    </div>
  );
}`;

export function SwipeDeckSection() {
  const [stiff, setStiff] = useState(220);
  const [damp, setDamp] = useState(22);
  const [tilt, setTilt] = useState(8);
  const [offset, setOffset] = useState(16);
  const [radius, setRadius] = useState(26);

  return (
    <section id="swipe-deck" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Swipe Deck
        </h2>
        <p className="text-base text-muted-foreground">
          Tactile gesture card deck with physical spring relaxation, velocity-driven fling discharge,
          haptic vibration impulses, and infinite cyclical card recycling.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setStiff(220);
              setDamp(22);
              setTilt(8);
              setOffset(16);
              setRadius(26);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-[#0f1014] overflow-hidden h-[460px] relative flex items-center justify-center">
            <SwipeDeck
              stiff={stiff}
              damp={damp}
              tilt={tilt}
              offset={offset}
              radius={radius}
              bg="#0f1014"
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Drag top card left or right, or flick fast to dismiss
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Controls
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Spring Stiffness</span>
                  <span className="font-mono text-foreground">{stiff}</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="450"
                  step="10"
                  value={stiff}
                  onChange={(e) => setStiff(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Spring Damping</span>
                  <span className="font-mono text-foreground">{damp}</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="45"
                  step="1"
                  value={damp}
                  onChange={(e) => setDamp(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Drag Tilt Factor</span>
                  <span className="font-mono text-foreground">{tilt}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="18"
                  step="0.5"
                  value={tilt}
                  onChange={(e) => setTilt(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Stack Offset</span>
                  <span className="font-mono text-foreground">{offset}px</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="32"
                  step="1"
                  value={offset}
                  onChange={(e) => setOffset(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Corner Radius</span>
                  <span className="font-mono text-foreground">{radius}px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="40"
                  step="1"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Installation & Usage</h2>
        <ComponentSource sourceCode={CODE_EXAMPLE} />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">API Reference</h2>
        <PropsTable propsData={PROPS_DATA} />
      </div>
    </section>
  );
}

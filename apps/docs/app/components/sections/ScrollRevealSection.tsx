"use client";

import React, { useState } from "react";
import { ScrollReveal } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "rot", type: "number", defaultValue: "-6", description: "Initial angular card rotation on entry in degrees." },
  { name: "sc", type: "number", defaultValue: "0.78", description: "Entry initial scale factor." },
  { name: "bl", type: "number", defaultValue: "8", description: "Entry initial blur filter radius in pixels." },
  { name: "rad", type: "number", defaultValue: "48", description: "Card panel corner radius in pixels." },
  { name: "stag", type: "number", defaultValue: "5", description: "Letter timeline stagger percentage offset." },
  { name: "sh", type: "number", defaultValue: "60", description: "Letter entry vertical rise distance in vh." },
  { name: "lr", type: "number", defaultValue: "8", description: "Letter entry twist tilt in degrees." },
  { name: "items", type: "RevealItem[]", defaultValue: "DEFAULT_ITEMS", description: "Card slides array with word, bg, and fg values." },
];

const CODE_EXAMPLE = `import { ScrollReveal } from "nexoreui";

export function CSSRevealDemo() {
  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl">
      <ScrollReveal
        rot={-6}
        sc={0.8}
        bl={8}
        rad={32}
        stag={5}
        sh={50}
        className="h-full w-full"
      />
    </div>
  );
}`;

export function ScrollRevealSection() {
  const [rot, setRot] = useState(-6);
  const [sc, setSc] = useState(0.78);
  const [bl, setBl] = useState(8);
  const [rad, setRad] = useState(48);
  const [stag, setStag] = useState(5);

  return (
    <section id="scroll-reveal" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Scroll Reveal
        </h2>
        <p className="text-base text-muted-foreground">
          Zero-JS hardware-accelerated viewport transitions using native CSS animation-timeline: view(),
          view-driven scale/blur transitions, and calculated character stagger offsets.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setRot(-6);
              setSc(0.78);
              setBl(8);
              setRad(48);
              setStag(5);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-[#101014] overflow-hidden h-[460px] relative">
            <ScrollReveal
              rot={rot}
              sc={sc}
              bl={bl}
              rad={rad}
              stag={stag}
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Scroll inside the stage to trigger CSS timeline animations
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
                  <span>Entry Rotation</span>
                  <span className="font-mono text-foreground">{rot}°</span>
                </div>
                <input
                  type="range"
                  min="-25"
                  max="25"
                  step="1"
                  value={rot}
                  onChange={(e) => setRot(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Entry Scale</span>
                  <span className="font-mono text-foreground">{sc.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.02"
                  value={sc}
                  onChange={(e) => setSc(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Blur Filter (px)</span>
                  <span className="font-mono text-foreground">{bl}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={bl}
                  onChange={(e) => setBl(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Panel Radius</span>
                  <span className="font-mono text-foreground">{rad}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="2"
                  value={rad}
                  onChange={(e) => setRad(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Letter Stagger</span>
                  <span className="font-mono text-foreground">{stag}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={stag}
                  onChange={(e) => setStag(parseFloat(e.target.value))}
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

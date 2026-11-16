"use client";

import React, { useState } from "react";
import { TypeProximity } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "rad", type: "number", defaultValue: "240", description: "Proximity influence radius in pixels around pointer." },
  { name: "wmin", type: "number", defaultValue: "200", description: "Font weight when pointer is far." },
  { name: "wmax", type: "number", defaultValue: "850", description: "Font weight when pointer is directly hovering." },
  { name: "dmin", type: "number", defaultValue: "75", description: "Font width percentage axis when pointer is far." },
  { name: "dmax", type: "number", defaultValue: "100", description: "Font width percentage axis when pointer is near." },
  { name: "fall", type: "number", defaultValue: "1.6", description: "Exponential distance attenuation curve power." },
  { name: "size", type: "number", defaultValue: "11", description: "Font size in viewport width units (vw)." },
  { name: "ease", type: "number", defaultValue: "0.22", description: "Per-frame interpolation smoothing factor." },
  { name: "idle", type: "number", defaultValue: "0.7", description: "Sine wave idle sweep speed multiplier." },
  { name: "hue", type: "number", defaultValue: "0.85", description: "Accent color shift intensity factor." },
  { name: "tint", type: "string", defaultValue: '"#ff4a2b"', description: "Hover accent color blended with ink." },
  { name: "bg", type: "string", defaultValue: '"#e8eaee"', description: "Substrate background color." },
  { name: "ink", type: "string", defaultValue: '"#0d0e12"', description: "Resting text color." },
  { name: "lines", type: "string[]", defaultValue: '["Weight", "follows", "your touch"]', description: "Array of text lines displayed on stage." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { TypeProximity } from "nexoreui";

export function HeroTypeDemo() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl">
      <TypeProximity
        rad={260}
        wmin={200}
        wmax={800}
        size={9}
        idle={0.8}
        tint="#ff4a2b"
        bg="#e8eaee"
        ink="#0d0e12"
        lines={["Weight", "follows", "your touch"]}
        className="h-full w-full"
      />
    </div>
  );
}`;

export function TypeProximitySection() {
  const [rad, setRad] = useState(240);
  const [wmin, setWmin] = useState(200);
  const [wmax, setWmax] = useState(850);
  const [fall, setFall] = useState(1.6);
  const [size, setSize] = useState(9);
  const [hue, setHue] = useState(0.85);

  return (
    <section id="type-proximity" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Type Proximity
        </h1>
        <p className="text-base text-muted-foreground">
          Dynamic typography matrix where every letter calculates its distance to your finger or cursor,
          fluidly morphing its variable weight, width, and tint axes without layout thrashing.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setRad(240);
              setWmin(200);
              setWmax(850);
              setFall(1.6);
              setSize(9);
              setHue(0.85);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-[#e8eaee] overflow-hidden h-[420px] relative">
            <TypeProximity
              rad={rad}
              wmin={wmin}
              wmax={wmax}
              fall={fall}
              size={size}
              hue={hue}
              tint="#ff4a2b"
              ink="#0d0e12"
              bg="#e8eaee"
              lines={["Weight", "follows", "your touch"]}
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Move cursor or finger near letters
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
                  <span>Proximity Radius</span>
                  <span className="font-mono text-foreground">{rad}px</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="500"
                  step="5"
                  value={rad}
                  onChange={(e) => setRad(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Weight (Near)</span>
                  <span className="font-mono text-foreground">{wmax}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="900"
                  step="10"
                  value={wmax}
                  onChange={(e) => setWmax(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Distance Falloff</span>
                  <span className="font-mono text-foreground">{fall.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.5"
                  step="0.05"
                  value={fall}
                  onChange={(e) => setFall(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Font Size (vw)</span>
                  <span className="font-mono text-foreground">{size.toFixed(1)}vw</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="14"
                  step="0.5"
                  value={size}
                  onChange={(e) => setSize(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tint Blend Ratio</span>
                  <span className="font-mono text-foreground">{hue.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={hue}
                  onChange={(e) => setHue(parseFloat(e.target.value))}
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

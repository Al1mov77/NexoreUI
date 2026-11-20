"use client";

import React, { useState } from "react";
import { TextRail } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "amp", type: "number", defaultValue: "0.16", description: "Spline wave curve amplitude relative to viewport height." },
  { name: "freq", type: "number", defaultValue: "1.6", description: "Harmonic wave cycle frequency across the track." },
  { name: "size", type: "number", defaultValue: "0.2", description: "Font size scalar relative to viewport height." },
  { name: "speed", type: "number", defaultValue: "0.2", description: "Idle text drift velocity." },
  { name: "gain", type: "number", defaultValue: "1.2", description: "Scroll translation acceleration gain." },
  { name: "bend", type: "number", defaultValue: "1.2", description: "Kinetic velocity path bend factor." },
  { name: "rails", type: "number", defaultValue: "3", description: "Number of parallel text tracks (1 to 4)." },
  { name: "gap", type: "number", defaultValue: "0.28", description: "Vertical spacing between tracks." },
  { name: "outline", type: "number", defaultValue: "0.55", description: "Outline fill ratio on alternating lines." },
  { name: "line", type: "number", defaultValue: "0.25", description: "Guide wire path stroke opacity." },
  { name: "rot", type: "number", defaultValue: "-8", description: "Base angular rotation tilt of the rail group in degrees." },
  { name: "skew", type: "number", defaultValue: "1", description: "Scroll velocity angular skew amplification." },
  { name: "drift", type: "number", defaultValue: "0.5", description: "Harmonic phase drift speed." },
  { name: "inertia", type: "number", defaultValue: "0.12", description: "Kinetic scroll smoothing factor." },
  { name: "vgain", type: "number", defaultValue: "1", description: "Velocity calculation multiplier." },
  { name: "bg", type: "string", defaultValue: '"#101014"', description: "Container backdrop fill." },
  { name: "ink", type: "string", defaultValue: '"#f2efe8"', description: "Primary text fill color." },
  { name: "c2", type: "string", defaultValue: '"#ff4a2b"', description: "Accent text color for alternating lines." },
  { name: "captureWheel", type: "boolean", defaultValue: "false", description: "Capture wheel events directly on container." },
  { name: "autoScroll", type: "boolean", defaultValue: "false", description: "Enable auto-scroll drift animation." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { TextRail } from "nexoreui";

export function KineticRailDemo() {
  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-2xl">
      <TextRail
        autoScroll={true}
        autoSpeed={2.5}
        rails={3}
        amp={0.16}
        freq={1.6}
        size={0.2}
        rot={-8}
        bg="#101014"
        ink="#f2efe8"
        c2="#ff4a2b"
        className="h-full w-full"
      />
    </div>
  );
}`;

export function TextRailSection() {
  const [amp, setAmp] = useState(0.16);
  const [freq, setFreq] = useState(1.6);
  const [size, setSize] = useState(0.2);
  const [rot, setRot] = useState(-8);
  const [bend, setBend] = useState(1.2);

  return (
    <section id="text-rail" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Text Rail
        </h2>
        <p className="text-base text-muted-foreground">
          Continuous kinetic typography running along 9-point Catmull-Rom cubic Bezier splines.
          Scroll impulses and velocity dynamically bend the spline curve and rotate the track cluster.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setAmp(0.16);
              setFreq(1.6);
              setSize(0.2);
              setRot(-8);
              setBend(1.2);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-[#101014] overflow-hidden h-[420px] relative">
            <TextRail
              autoScroll={true}
              autoSpeed={2}
              captureWheel={true}
              amp={amp}
              freq={freq}
              size={size}
              rot={rot}
              bend={bend}
              rails={3}
              bg="#101014"
              ink="#f2efe8"
              c2="#ff4a2b"
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Scroll wheel over canvas or watch auto-drift
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
                  <span>Wave Height (Amp)</span>
                  <span className="font-mono text-foreground">{amp.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.35"
                  step="0.005"
                  value={amp}
                  onChange={(e) => setAmp(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Wave Frequency</span>
                  <span className="font-mono text-foreground">{freq.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={freq}
                  onChange={(e) => setFreq(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Typography Size</span>
                  <span className="font-mono text-foreground">{size.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.08"
                  max="0.3"
                  step="0.01"
                  value={size}
                  onChange={(e) => setSize(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Angular Tilt</span>
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
                  <span>Velocity Curve Bend</span>
                  <span className="font-mono text-foreground">{bend.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.05"
                  value={bend}
                  onChange={(e) => setBend(parseFloat(e.target.value))}
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

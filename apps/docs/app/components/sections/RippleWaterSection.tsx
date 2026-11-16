"use client";

import React, { useState } from "react";
import { RippleWater } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "fq", type: "number", defaultValue: "48", description: "Spatial frequency of ripple concentric wave oscillations." },
  { name: "spd", type: "number", defaultValue: "1.1", description: "Wave radial propagation velocity." },
  { name: "damp", type: "number", defaultValue: "1.1", description: "Temporal wave decay damping factor." },
  { name: "wd", type: "number", defaultValue: "0.18", description: "Gaussian ring envelope thickness width." },
  { name: "amp", type: "number", defaultValue: "1", description: "Wave height perturbation amplitude." },
  { name: "refr", type: "number", defaultValue: "1.2", description: "UV coordinate refraction deflection multiplier." },
  { name: "disp", type: "number", defaultValue: "0.35", description: "Chromatic aberration spectral dispersion." },
  { name: "spec", type: "number", defaultValue: "0.8", description: "Specular reflection glossiness." },
  { name: "shade", type: "number", defaultValue: "2.5", description: "Wave normal shading depth." },
  { name: "gap", type: "number", defaultValue: "0.12", description: "Minimum distance threshold between spawned cursor ripples." },
  { name: "idle", type: "number", defaultValue: "0.6", description: "Idle state rain drop spawn frequency (0 to disable)." },
  { name: "background", type: "HTMLCanvasElement | HTMLImageElement | string", defaultValue: "procedural", description: "Custom background image URL or canvas source." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { RippleWater } from "nexoreui";

export function StillWaterDemo() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
      <RippleWater
        fq={52}
        spd={1.2}
        damp={1.0}
        amp={1.1}
        refr={1.4}
        disp={0.3}
        className="h-full w-full"
      />
    </div>
  );
}`;

export function RippleWaterSection() {
  const [fq, setFq] = useState(48);
  const [spd, setSpd] = useState(1.1);
  const [amp, setAmp] = useState(1);
  const [refr, setRefr] = useState(1.2);
  const [idle, setIdle] = useState(0.6);

  return (
    <section id="ripple-water" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Ripple Water
        </h1>
        <p className="text-base text-muted-foreground">
          Still fluid surface simulation with 16-slot ring buffer ripples, pointer drag waves,
          refraction dispersion, and ambient rain droplets.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setFq(48);
              setSpd(1.1);
              setAmp(1);
              setRefr(1.2);
              setIdle(0.6);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-black/90 overflow-hidden h-[420px] relative">
            <RippleWater
              fq={fq}
              spd={spd}
              amp={amp}
              refr={refr}
              idle={idle}
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Drag cursor to trigger fluid ripples
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
                  <span>Wave Frequency</span>
                  <span className="font-mono text-foreground">{fq}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="1"
                  value={fq}
                  onChange={(e) => setFq(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Wave Speed</span>
                  <span className="font-mono text-foreground">{spd.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.05"
                  value={spd}
                  onChange={(e) => setSpd(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Wave Strength</span>
                  <span className="font-mono text-foreground">{amp.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2"
                  step="0.05"
                  value={amp}
                  onChange={(e) => setAmp(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Refraction Depth</span>
                  <span className="font-mono text-foreground">{refr.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2.5"
                  step="0.05"
                  value={refr}
                  onChange={(e) => setRefr(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Idle Rain Probability</span>
                  <span className="font-mono text-foreground">{idle.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={idle}
                  onChange={(e) => setIdle(parseFloat(e.target.value))}
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

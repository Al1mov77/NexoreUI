"use client";

import React, { useState } from "react";
import { FlutedGlass } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "cnt", type: "number", defaultValue: "22", description: "Number of vertical fluted ribs across screen." },
  { name: "bend", type: "number", defaultValue: "0.85", description: "Rib curvature depth creating lens refraction." },
  { name: "disp", type: "number", defaultValue: "0.25", description: "Chromatic aberration dispersion factor." },
  { name: "frost", type: "number", defaultValue: "0.25", description: "Frosting diffusion blur amount." },
  { name: "ang", type: "number", defaultValue: "0", description: "Orientation angle in radians (0 is vertical)." },
  { name: "warp", type: "number", defaultValue: "0.5", description: "Sine wave perturbation amplitude." },
  { name: "edge", type: "number", defaultValue: "0.5", description: "Contrast darkening at rib seam boundaries." },
  { name: "hl", type: "number", defaultValue: "0.8", description: "Specular highlight sheen across rib apex." },
  { name: "pinf", type: "number", defaultValue: "1", description: "Pointer influence radius bending nearest ribs." },
  { name: "tin", type: "number", defaultValue: "0", description: "Tint color mix ratio." },
  { name: "tint", type: "string", defaultValue: '"#ffffff"', description: "Hex tint tone blended with refracted color." },
  { name: "background", type: "HTMLCanvasElement | HTMLImageElement | string", defaultValue: "procedural", description: "Custom background image URL or canvas source." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { FlutedGlass } from "nexoreui";

export function ReededGlassDemo() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
      <FlutedGlass
        cnt={24}
        bend={0.9}
        disp={0.25}
        frost={0.2}
        pinf={1.2}
        className="h-full w-full"
      />
    </div>
  );
}`;

export function FlutedGlassSection() {
  const [cnt, setCnt] = useState(22);
  const [bend, setBend] = useState(0.85);
  const [disp, setDisp] = useState(0.25);
  const [warp, setWarp] = useState(0.5);
  const [pinf, setPinf] = useState(1);

  return (
    <section id="fluted-glass" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Fluted Glass
        </h1>
        <p className="text-base text-muted-foreground">
          Architectural reeded glass shader with dynamic cylindrical rib curvature, chromatic split,
          and interactive pointer distortion.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setCnt(22);
              setBend(0.85);
              setDisp(0.25);
              setWarp(0.5);
              setPinf(1);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-black/90 overflow-hidden h-[420px] relative">
            <FlutedGlass
              cnt={cnt}
              bend={bend}
              disp={disp}
              warp={warp}
              pinf={pinf}
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Hover near ribs to bend curvature
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
                  <span>Rib Count</span>
                  <span className="font-mono text-foreground">{cnt}</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="60"
                  step="1"
                  value={cnt}
                  onChange={(e) => setCnt(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Curvature</span>
                  <span className="font-mono text-foreground">{bend.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.6"
                  step="0.05"
                  value={bend}
                  onChange={(e) => setBend(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Dispersion</span>
                  <span className="font-mono text-foreground">{disp.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={disp}
                  onChange={(e) => setDisp(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Wave Perturbation</span>
                  <span className="font-mono text-foreground">{warp.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={warp}
                  onChange={(e) => setWarp(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Pointer Reach</span>
                  <span className="font-mono text-foreground">{pinf.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={pinf}
                  onChange={(e) => setPinf(parseFloat(e.target.value))}
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

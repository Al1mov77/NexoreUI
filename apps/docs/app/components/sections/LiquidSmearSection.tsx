"use client";

import React, { useState } from "react";
import { LiquidSmear } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "push", type: "number", defaultValue: "1.4", description: "Cursor motion velocity impulse multiplier." },
  { name: "rad", type: "number", defaultValue: "0.22", description: "Fluid brush dispersion radius." },
  { name: "relax", type: "number", defaultValue: "0.975", description: "Temporal viscosity relaxation memory [0.9..0.998]." },
  { name: "spread", type: "number", defaultValue: "0.35", description: "Neighboring pixel velocity diffusion factor." },
  { name: "amt", type: "number", defaultValue: "1", description: "Visual refraction distortion depth." },
  { name: "disp", type: "number", defaultValue: "0.4", description: "Chromatic aberration spectral dispersion." },
  { name: "spec", type: "number", defaultValue: "0.6", description: "Specular reflection gloss intensity." },
  { name: "shade", type: "number", defaultValue: "3", description: "Fluid surface gloss normal depth." },
  { name: "background", type: "HTMLCanvasElement | HTMLImageElement | string", defaultValue: "procedural", description: "Custom background image URL or canvas source." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { LiquidSmear } from "nexoreui";

export function FluidSmearDemo() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
      <LiquidSmear
        push={1.5}
        rad={0.25}
        relax={0.98}
        spread={0.35}
        amt={1.2}
        disp={0.35}
        className="h-full w-full"
      />
    </div>
  );
}`;

export function LiquidSmearSection() {
  const [push, setPush] = useState(1.4);
  const [rad, setRad] = useState(0.22);
  const [relax, setRelax] = useState(0.975);
  const [amt, setAmt] = useState(1);
  const [disp, setDisp] = useState(0.4);

  return (
    <section id="liquid-smear" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Liquid Smear
        </h1>
        <p className="text-base text-muted-foreground">
          Double-buffered ping-pong FBO fluid simulation where cursor motion pushes viscous velocity
          fields that slowly diffuse, relax, and settle.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setPush(1.4);
              setRad(0.22);
              setRelax(0.975);
              setAmt(1);
              setDisp(0.4);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-black/90 overflow-hidden h-[420px] relative">
            <LiquidSmear
              push={push}
              rad={rad}
              relax={relax}
              amt={amt}
              disp={disp}
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Drag cursor to smear viscous liquid surface
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
                  <span>Push Force</span>
                  <span className="font-mono text-foreground">{push.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.05"
                  value={push}
                  onChange={(e) => setPush(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Brush Radius</span>
                  <span className="font-mono text-foreground">{rad.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.01"
                  value={rad}
                  onChange={(e) => setRad(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Fluid Memory (Relax)</span>
                  <span className="font-mono text-foreground">{relax.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.9"
                  max="0.995"
                  step="0.001"
                  value={relax}
                  onChange={(e) => setRelax(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Distortion Depth</span>
                  <span className="font-mono text-foreground">{amt.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={amt}
                  onChange={(e) => setAmt(parseFloat(e.target.value))}
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

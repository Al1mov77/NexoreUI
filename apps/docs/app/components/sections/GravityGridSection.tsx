"use client";

import React, { useState } from "react";
import { GravityGrid } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "cell", type: "number", defaultValue: "24", description: "Grid density frequency controlling cell dimensions." },
  { name: "lw", type: "number", defaultValue: "0.012", description: "Grid line thickness." },
  { name: "mass", type: "number", defaultValue: "1.6", description: "Gravitational mass attraction strength of cursor points." },
  { name: "fall", type: "number", defaultValue: "3.2", description: "Exponential spatial falloff steepness." },
  { name: "dots", type: "number", defaultValue: "0", description: "Transition blend from continuous lines (0) to discrete dots (1)." },
  { name: "wave", type: "number", defaultValue: "0.5", description: "Radial gravity wave propagation amplitude." },
  { name: "glow", type: "number", defaultValue: "0.6", description: "Ambient heat glow intensity at singularity center." },
  { name: "lag", type: "number", defaultValue: "0.1", description: "Inertial tracking delay for secondary satellite masses." },
  { name: "bg", type: "string", defaultValue: '"#0b0c12"', description: "Hex deep space background tone." },
  { name: "ink", type: "string", defaultValue: '"#cfd6ee"', description: "Hex grid line baseline tone." },
  { name: "hot", type: "string", defaultValue: '"#ff6a3d"', description: "Hex high-tension singularity core color." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { GravityGrid } from "nexoreui";

export function SpacetimeGridDemo() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
      <GravityGrid
        cell={26}
        mass={1.8}
        fall={3.5}
        glow={0.7}
        hot="#ff6a3d"
        ink="#cbd5e1"
        bg="#090a0f"
        className="h-full w-full"
      />
    </div>
  );
}`;

export function GravityGridSection() {
  const [cell, setCell] = useState(24);
  const [mass, setMass] = useState(1.6);
  const [fall, setFall] = useState(3.2);
  const [dots, setDots] = useState(0);
  const [glow, setGlow] = useState(0.6);

  return (
    <section id="gravity-grid" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Gravity Grid
        </h2>
        <p className="text-base text-muted-foreground">
          Curved spacetime coordinate grid where three trailing gravitational masses pull,
          distort lines, and radiate concentric gravity waves.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setCell(24);
              setMass(1.6);
              setFall(3.2);
              setDots(0);
              setGlow(0.6);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-black/90 overflow-hidden h-[420px] relative">
            <GravityGrid
              cell={cell}
              mass={mass}
              fall={fall}
              dots={dots}
              glow={glow}
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Move cursor to warp spacetime grid
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
                  <span>Grid Density</span>
                  <span className="font-mono text-foreground">{cell}</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="60"
                  step="1"
                  value={cell}
                  onChange={(e) => setCell(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Gravitational Mass</span>
                  <span className="font-mono text-foreground">{mass.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-0.5"
                  max="3.5"
                  step="0.05"
                  value={mass}
                  onChange={(e) => setMass(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Falloff Steepness</span>
                  <span className="font-mono text-foreground">{fall.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.1"
                  value={fall}
                  onChange={(e) => setFall(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Lines to Dots</span>
                  <span className="font-mono text-foreground">{dots.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={dots}
                  onChange={(e) => setDots(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Core Glow</span>
                  <span className="font-mono text-foreground">{glow.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={glow}
                  onChange={(e) => setGlow(parseFloat(e.target.value))}
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

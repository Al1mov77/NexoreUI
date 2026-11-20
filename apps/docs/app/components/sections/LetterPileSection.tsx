"use client";

import React, { useState } from "react";
import { LetterPile } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "count", type: "number", defaultValue: "54", description: "Total number of simulated physics discs." },
  { name: "size", type: "number", defaultValue: "5.2", description: "Disk radius scalar relative to viewport min dimension." },
  { name: "grav", type: "number", defaultValue: "1", description: "Gravity acceleration coefficient." },
  { name: "bounce", type: "number", defaultValue: "0.45", description: "Restitution elasticity factor on collision." },
  { name: "drag", type: "number", defaultValue: "0.15", description: "Aerodynamic linear drag damping velocity." },
  { name: "push", type: "number", defaultValue: "1.4", description: "Cursor repulsion force magnitude." },
  { name: "gyro", type: "number", defaultValue: "1", description: "Device tilt gravity steering gain." },
  { name: "swing", type: "number", defaultValue: "0.35", description: "Idle harmonic gravity oscillation angle." },
  { name: "c1", type: "string", defaultValue: '"#ff4a2b"', description: "Primary disk palette color." },
  { name: "c2", type: "string", defaultValue: '"#2d4bff"', description: "Secondary disk palette color." },
  { name: "c3", type: "string", defaultValue: '"#f4f1e8"', description: "Tertiary disk palette color." },
  { name: "bg", type: "string", defaultValue: '"#101014"', description: "Scene background fill." },
  { name: "ink", type: "string", defaultValue: '"#101014"', description: "Letter color for high-luminance disks." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { LetterPile } from "nexoreui";

export function LetterPhysicsDemo() {
  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-2xl">
      <LetterPile
        count={50}
        size={5.5}
        grav={1.1}
        bounce={0.5}
        push={1.6}
        c1="#ff4a2b"
        c2="#2d4bff"
        c3="#f4f1e8"
        bg="#101014"
        className="h-full w-full"
      />
    </div>
  );
}`;

export function LetterPileSection() {
  const [count, setCount] = useState(54);
  const [size, setSize] = useState(5.2);
  const [grav, setGrav] = useState(1);
  const [bounce, setBounce] = useState(0.45);
  const [push, setPush] = useState(1.4);

  return (
    <section id="letter-pile" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Letter Pile
        </h2>
        <p className="text-base text-muted-foreground">
          2D rigid body simulation of letter disks with multi-pass circle collisions,
          aerodynamic drag, pointer push forces, and gyroscope roll gravity on touch devices.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setCount(54);
              setSize(5.2);
              setGrav(1);
              setBounce(0.45);
              setPush(1.4);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-[#101014] overflow-hidden h-[420px] relative">
            <LetterPile
              count={count}
              size={size}
              grav={grav}
              bounce={bounce}
              push={push}
              c1="#ff4a2b"
              c2="#2d4bff"
              c3="#f4f1e8"
              bg="#101014"
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Drag or click pointer to push letter disks
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
                  <span>Disks Count</span>
                  <span className="font-mono text-foreground">{count}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="1"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Disk Radius</span>
                  <span className="font-mono text-foreground">{size.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="8"
                  step="0.1"
                  value={size}
                  onChange={(e) => setSize(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Gravity</span>
                  <span className="font-mono text-foreground">{grav.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={grav}
                  onChange={(e) => setGrav(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Bounce Elasticity</span>
                  <span className="font-mono text-foreground">{bounce.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.9"
                  step="0.02"
                  value={bounce}
                  onChange={(e) => setBounce(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Pointer Push Force</span>
                  <span className="font-mono text-foreground">{push.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.05"
                  value={push}
                  onChange={(e) => setPush(parseFloat(e.target.value))}
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

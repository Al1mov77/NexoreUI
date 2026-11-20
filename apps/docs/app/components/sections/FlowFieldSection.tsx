"use client";

import React, { useState } from "react";
import { FlowField } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "count", type: "number", defaultValue: "1600", description: "Target number of tracer particles in the flow field." },
  { name: "scale", type: "number", defaultValue: "1.4", description: "Spatial frequency scale determining vortex density." },
  { name: "curl", type: "number", defaultValue: "1.2", description: "Curl magnitude distorting trajectory angles." },
  { name: "speed", type: "number", defaultValue: "90", description: "Particle linear velocity in pixels per second." },
  { name: "drift", type: "number", defaultValue: "0.6", description: "Continuous temporal field drift rate." },
  { name: "fade", type: "number", defaultValue: "0.045", description: "Canvas background trail persistence alpha." },
  { name: "lw", type: "number", defaultValue: "1.2", description: "Tracer particle stroke width." },
  { name: "pf", type: "number", defaultValue: "1.2", description: "Pointer repulsion vector force." },
  { name: "prad", type: "number", defaultValue: "200", description: "Pointer influence radius in pixels." },
  { name: "hue", type: "number", defaultValue: "190", description: "Base HSLA hue angle in degrees." },
  { name: "range", type: "number", defaultValue: "140", description: "Spectral hue distribution width." },
  { name: "glow", type: "number", defaultValue: "1", description: "Additive lighter blend mode toggle (1 on, 0 off)." },
  { name: "bg", type: "string", defaultValue: '"#07080c"', description: "Background clear color." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { FlowField } from "nexoreui";

export function VectorFieldDemo() {
  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-2xl">
      <FlowField
        count={1800}
        speed={95}
        curl={1.3}
        scale={1.5}
        hue={190}
        range={140}
        glow={1}
        bg="#07080c"
        className="h-full w-full"
      />
    </div>
  );
}`;

export function FlowFieldSection() {
  const [count, setCount] = useState(1600);
  const [speed, setSpeed] = useState(90);
  const [curl, setCurl] = useState(1.2);
  const [scale, setScale] = useState(1.4);
  const [hue, setHue] = useState(190);

  return (
    <section id="flow-field" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Flow Field
        </h2>
        <p className="text-base text-muted-foreground">
          Trigonometric vector field steering thousands of tracer particles with triple-harmonic curl noise,
          batched 12-bucket stroke rendering, dynamic EMA frame throttling, and additive glow caustics.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setCount(1600);
              setSpeed(90);
              setCurl(1.2);
              setScale(1.4);
              setHue(190);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-[#07080c] overflow-hidden h-[420px] relative">
            <FlowField
              count={count}
              speed={speed}
              curl={curl}
              scale={scale}
              hue={hue}
              range={140}
              glow={1}
              bg="#07080c"
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Move cursor over particles to warp current
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
                  <span>Particle Stream</span>
                  <span className="font-mono text-foreground">{count}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3500"
                  step="50"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Drift Speed</span>
                  <span className="font-mono text-foreground">{speed}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="5"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Vorticity (Curl)</span>
                  <span className="font-mono text-foreground">{curl.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="3"
                  step="0.05"
                  value={curl}
                  onChange={(e) => setCurl(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Field Scale</span>
                  <span className="font-mono text-foreground">{scale.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="3"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Hue Angle</span>
                  <span className="font-mono text-foreground">{hue}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
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

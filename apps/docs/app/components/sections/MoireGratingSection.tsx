"use client";

import React, { useState } from "react";
import { MoireGrating } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "type", type: "number", defaultValue: "0", description: "Grating pattern mode (0: concentric circles, 1: parallel lines, 2: radial beams)." },
  { name: "gap", type: "number", defaultValue: "9", description: "Line spacing in pixels." },
  { name: "duty", type: "number", defaultValue: "0.42", description: "Line thickness duty cycle ratio." },
  { name: "ratio", type: "number", defaultValue: "1.04", description: "Secondary layer scale ratio multiplier creating interference fringes." },
  { name: "rot", type: "number", defaultValue: "0.05", description: "Rotational angular velocity in radians." },
  { name: "drift", type: "number", defaultValue: "0.4", description: "Lissajous idle drift speed multiplier." },
  { name: "follow", type: "number", defaultValue: "0.12", description: "Pointer tracking smoothing lag factor." },
  { name: "mix", type: "number", defaultValue: "1", description: "Multiply blend opacity of the secondary grating." },
  { name: "bg", type: "string", defaultValue: '"#e8ebef"', description: "Substrate background color." },
  { name: "a", type: "string", defaultValue: '"#101014"', description: "Primary grating ink." },
  { name: "b", type: "string", defaultValue: '"#ff4a2b"', description: "Secondary interference grating ink." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { MoireGrating } from "nexoreui";

export function OpticalMoireDemo() {
  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-2xl">
      <MoireGrating
        type={0}
        gap={9}
        ratio={1.04}
        rot={0.06}
        bg="#e8ebef"
        a="#101014"
        b="#ff4a2b"
        className="h-full w-full"
      />
    </div>
  );
}`;

export function MoireGratingSection() {
  const [type, setType] = useState(0);
  const [gap, setGap] = useState(9);
  const [ratio, setRatio] = useState(1.04);
  const [rot, setRot] = useState(0.05);
  const [mix, setMix] = useState(1);

  return (
    <section id="moire-grating" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Moiré Grating
        </h1>
        <p className="text-base text-muted-foreground">
          Optical interference simulator superimposing two micro-gratings under multiply blending,
          producing geometric interference patterns driven by pointer follower coordinates and Lissajous drift.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setType(0);
              setGap(9);
              setRatio(1.04);
              setRot(0.05);
              setMix(1);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-[#e8ebef] overflow-hidden h-[420px] relative">
            <MoireGrating
              type={type}
              gap={gap}
              ratio={ratio}
              rot={rot}
              mix={mix}
              bg="#e8ebef"
              a="#101014"
              b="#ff4a2b"
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Move cursor over canvas to drag second layer
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
                  <span>Pattern Mode</span>
                  <span className="font-mono text-foreground">{type === 0 ? "Circles" : type === 1 ? "Lines" : "Rays"}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={type}
                  onChange={(e) => setType(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slit Spacing (Gap)</span>
                  <span className="font-mono text-foreground">{gap}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="28"
                  step="0.5"
                  value={gap}
                  onChange={(e) => setGap(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Layer Ratio</span>
                  <span className="font-mono text-foreground">{ratio.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.92"
                  max="1.15"
                  step="0.002"
                  value={ratio}
                  onChange={(e) => setRatio(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Spin Speed</span>
                  <span className="font-mono text-foreground">{rot.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="-0.3"
                  max="0.3"
                  step="0.005"
                  value={rot}
                  onChange={(e) => setRot(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Layer B Mix</span>
                  <span className="font-mono text-foreground">{mix.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.02"
                  value={mix}
                  onChange={(e) => setMix(parseFloat(e.target.value))}
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

"use client";

import React, { useState } from "react";
import { CameraMirror } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "cell", type: "number", defaultValue: "12", description: "Raster cell resolution in pixels." },
  { name: "mode", type: "number", defaultValue: "0", description: "Display raster mode (0: circles, 1: square grid, 2: monospace ASCII text)." },
  { name: "contrast", type: "number", defaultValue: "1.4", description: "Luminance contrast amplification factor." },
  { name: "bright", type: "number", defaultValue: "0", description: "Brightness exposure offset (-0.4 to 0.4)." },
  { name: "inv", type: "number", defaultValue: "0", description: "Color inversion toggle (0 normal, 1 inverted)." },
  { name: "dot", type: "number", defaultValue: "1", description: "Raster element scale multiplier." },
  { name: "trail", type: "number", defaultValue: "0.35", description: "Camera feed frame motion trail persistence." },
  { name: "col", type: "number", defaultValue: "0", description: "Full video color preservation ratio (0 monochrome, 1 full color)." },
  { name: "c1", type: "string", defaultValue: '"#f2efe8"', description: "Primary raster element ink tone." },
  { name: "bg", type: "string", defaultValue: '"#08080b"', description: "Stage backdrop fill." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { CameraMirror } from "nexoreui";

export function VideoRasterDemo() {
  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-2xl">
      <CameraMirror
        cell={10}
        mode={0}
        contrast={1.5}
        dot={1}
        bg="#08080b"
        c1="#f2efe8"
        className="h-full w-full"
      />
    </div>
  );
}`;

export function CameraMirrorSection() {
  const [cell, setCell] = useState(12);
  const [mode, setMode] = useState(0);
  const [contrast, setContrast] = useState(1.4);
  const [dot, setDot] = useState(1);
  const [trail, setTrail] = useState(0.35);

  return (
    <section id="camera-mirror" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Camera Mirror
        </h1>
        <p className="text-base text-muted-foreground">
          Local device camera or procedural raster visualizer projecting real-time luminance into
          geometric circles, structured square matrices, or monospace ASCII glyphs.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setCell(12);
              setMode(0);
              setContrast(1.4);
              setDot(1);
              setTrail(0.35);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-[#08080b] overflow-hidden h-[420px] relative">
            <CameraMirror
              cell={cell}
              mode={mode}
              contrast={contrast}
              dot={dot}
              trail={trail}
              bg="#08080b"
              c1="#f2efe8"
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Click &quot;Use camera&quot; or observe simulation blobs
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
                  <span>Raster Mode</span>
                  <span className="font-mono text-foreground">
                    {mode === 0 ? "Dots (Circles)" : mode === 1 ? "Squares" : "ASCII Text"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={mode}
                  onChange={(e) => setMode(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Cell Size</span>
                  <span className="font-mono text-foreground">{cell}px</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="24"
                  step="1"
                  value={cell}
                  onChange={(e) => setCell(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Contrast</span>
                  <span className="font-mono text-foreground">{contrast.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={contrast}
                  onChange={(e) => setContrast(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Element Scale</span>
                  <span className="font-mono text-foreground">{dot.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.4"
                  step="0.02"
                  value={dot}
                  onChange={(e) => setDot(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Trail Persistence</span>
                  <span className="font-mono text-foreground">{trail.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={trail}
                  onChange={(e) => setTrail(parseFloat(e.target.value))}
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

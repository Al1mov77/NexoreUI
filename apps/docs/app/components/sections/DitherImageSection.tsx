"use client";

import React, { useState } from "react";
import { DitherImage } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "px", type: "number", defaultValue: "3", description: "Quantized pixel block size in CSS pixels." },
  { name: "lv", type: "number", defaultValue: "3", description: "Number of luminance quantization stepping levels [2..8]." },
  { name: "bn", type: "number", defaultValue: "3", description: "Bayer matrix size dimension (1 for 2x2, 2 for 4x4, 3 for 8x8)." },
  { name: "cont", type: "number", defaultValue: "1.3", description: "Luma contrast multiplier." },
  { name: "bias", type: "number", defaultValue: "0", description: "Luminance offset bias." },
  { name: "anim", type: "number", defaultValue: "0", description: "Flicker animation noise frequency." },
  { name: "mode", type: "number", defaultValue: "0", description: "Color mapping mode (0 for palette mix, 1 for quantized source)." },
  { name: "rad", type: "number", defaultValue: "0.22", description: "Radius of the interactive pointer reveal spotlight." },
  { name: "soft", type: "number", defaultValue: "0.18", description: "Edge softness feathering of the pointer reveal lens." },
  { name: "rv", type: "number", defaultValue: "1", description: "Reveal lens blend amount (0 to keep fully dithered)." },
  { name: "c0", type: "string", defaultValue: '"#0a0a0f"', description: "Hex darkest shadow palette tone." },
  { name: "c1", type: "string", defaultValue: '"#2d3bff"', description: "Hex mid-low palette tone." },
  { name: "c2", type: "string", defaultValue: '"#ff6a3d"', description: "Hex mid-high palette tone." },
  { name: "c3", type: "string", defaultValue: '"#f6f1e6"', description: "Hex brightest highlight palette tone." },
  { name: "background", type: "HTMLCanvasElement | HTMLImageElement | string", defaultValue: "procedural", description: "Custom background image URL or canvas source." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { DitherImage } from "nexoreui";

export function DitherShowcase() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
      <DitherImage
        px={3}
        lv={3}
        bn={3}
        rad={0.25}
        soft={0.2}
        c0="#090a0f"
        c1="#1e293b"
        c2="#94a3b8"
        c3="#f8fafc"
        className="h-full w-full"
      />
    </div>
  );
}`;

export function DitherImageSection() {
  const [px, setPx] = useState(3);
  const [lv, setLv] = useState(3);
  const [cont, setCont] = useState(1.3);
  const [rad, setRad] = useState(0.22);
  const [soft, setSoft] = useState(0.18);

  return (
    <section id="dither-image" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Dither Image
        </h2>
        <p className="text-base text-muted-foreground">
          Ordered Bayer matrix dithering shader that maps imagery to custom multi-tone palettes
          with dynamic pixel scaling and interactive pointer reveal lens.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setPx(3);
              setLv(3);
              setCont(1.3);
              setRad(0.22);
              setSoft(0.18);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-black/90 overflow-hidden h-[420px] relative">
            <DitherImage
              px={px}
              lv={lv}
              cont={cont}
              rad={rad}
              soft={soft}
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Hover pointer to reveal original unfiltered pixels
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
                  <span>Pixel Size</span>
                  <span className="font-mono text-foreground">{px.toFixed(1)}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={px}
                  onChange={(e) => setPx(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Quantize Levels</span>
                  <span className="font-mono text-foreground">{lv}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={lv}
                  onChange={(e) => setLv(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Luma Contrast</span>
                  <span className="font-mono text-foreground">{cont.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={cont}
                  onChange={(e) => setCont(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Reveal Radius</span>
                  <span className="font-mono text-foreground">{rad.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.6"
                  step="0.02"
                  value={rad}
                  onChange={(e) => setRad(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Lens Softness</span>
                  <span className="font-mono text-foreground">{soft.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.02"
                  value={soft}
                  onChange={(e) => setSoft(parseFloat(e.target.value))}
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

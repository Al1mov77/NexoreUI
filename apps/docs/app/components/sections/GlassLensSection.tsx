"use client";

import React, { useState } from "react";
import { GlassLens } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "size", type: "number", defaultValue: "0.3", description: "Base radius of the refractive lens." },
  { name: "thick", type: "number", defaultValue: "1.3", description: "Bevel thickness multiplier determining refraction curve." },
  { name: "disp", type: "number", defaultValue: "0.3", description: "Chromatic aberration dispersion factor separating R, G, B channels." },
  { name: "blur", type: "number", defaultValue: "0.35", description: "Frosting blur kernel width applied across refracted texture." },
  { name: "mag", type: "number", defaultValue: "1.12", description: "Lens magnification scale factor." },
  { name: "smo", type: "number", defaultValue: "0.35", description: "Smooth minimum distance blend threshold for secondary droplets." },
  { name: "rim", type: "number", defaultValue: "0.55", description: "Fresnel rim light intensity along the droplet periphery." },
  { name: "spec", type: "number", defaultValue: "0.7", description: "Specular gloss highlight intensity from virtual directional light." },
  { name: "lag", type: "number", defaultValue: "0.12", description: "Inertial follower damping factor for trailing droplets." },
  { name: "tin", type: "number", defaultValue: "0.06", description: "Tint color mix ratio." },
  { name: "tint", type: "string", defaultValue: '"#9fd8ff"', description: "Hex tint tone blended with refracted color." },
  { name: "background", type: "HTMLCanvasElement | HTMLImageElement | string", defaultValue: "procedural", description: "Custom background image URL or canvas source." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { GlassLens } from "nexoreui";

export function HeroGlassDemo() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
      <GlassLens
        size={0.32}
        thick={1.4}
        disp={0.3}
        blur={0.25}
        mag={1.15}
        rim={0.6}
        spec={0.8}
        tint="#9fd8ff"
        className="h-full w-full"
      />
    </div>
  );
}`;

export function GlassLensSection() {
  const [size, setSize] = useState(0.3);
  const [thick, setThick] = useState(1.3);
  const [disp, setDisp] = useState(0.3);
  const [blur, setBlur] = useState(0.35);
  const [mag, setMag] = useState(1.12);
  const [rim, setRim] = useState(0.55);
  const [spec, setSpec] = useState(0.7);

  return (
    <section id="glass-lens" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Glass Lens
        </h2>
        <p className="text-base text-muted-foreground">
          Liquid refractive glass lens that tracks pointer coordinates with inertial follower droplets,
          dynamic chromatic dispersion, and directional specular highlights.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setSize(0.3);
              setThick(1.3);
              setDisp(0.3);
              setBlur(0.35);
              setMag(1.12);
              setRim(0.55);
              setSpec(0.7);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-black/90 overflow-hidden h-[420px] relative">
            <GlassLens
              size={size}
              thick={thick}
              disp={disp}
              blur={blur}
              mag={mag}
              rim={rim}
              spec={spec}
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Drag pointer across stage
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
                  <span>Size</span>
                  <span className="font-mono text-foreground">{size.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.6"
                  step="0.01"
                  value={size}
                  onChange={(e) => setSize(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Bevel Thickness</span>
                  <span className="font-mono text-foreground">{thick.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.05"
                  value={thick}
                  onChange={(e) => setThick(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Chromatic Dispersion</span>
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
                  <span>Magnification</span>
                  <span className="font-mono text-foreground">{mag.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.8"
                  step="0.02"
                  value={mag}
                  onChange={(e) => setMag(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Frost Blur</span>
                  <span className="font-mono text-foreground">{blur.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={blur}
                  onChange={(e) => setBlur(parseFloat(e.target.value))}
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

"use client";

import React, { useState } from "react";
import { HoloFoil } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

const PROPS_DATA = [
  { name: "tilt", type: "number", defaultValue: "16", description: "Maximum angular card tilt in degrees." },
  { name: "foil", type: "number", defaultValue: "1", description: "Holographic spectral reflection intensity." },
  { name: "sparkle", type: "number", defaultValue: "1", description: "Micro-glitter sparkle lattice visibility." },
  { name: "glare", type: "number", defaultValue: "0.7", description: "Radial specular surface sheen brightness." },
  { name: "hue", type: "number", defaultValue: "0", description: "Color hue rotation offset in degrees." },
  { name: "depth", type: "number", defaultValue: "22", description: "Isolated text parallax offset amplitude in pixels." },
  { name: "radius", type: "number", defaultValue: "22", description: "Card corner border radius in pixels." },
  { name: "gyro", type: "number", defaultValue: "1", description: "Mobile device gyroscope tilt sensitivity multiplier." },
  { name: "ease", type: "number", defaultValue: "0.12", description: "Kinetic response smoothing factor." },
  { name: "title", type: "string", defaultValue: '"Foil"', description: "Primary display heading rendered on card surface." },
  { name: "subtitle", type: "string", defaultValue: '"Tilt your phone or move the pointer."', description: "Descriptive subtitle rendered on card surface." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { HoloFoil } from "nexoreui";

export function HoloCardDemo() {
  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl flex items-center justify-center">
      <HoloFoil
        tilt={18}
        foil={1.1}
        sparkle={1.2}
        glare={0.8}
        radius={22}
        title="Foil"
        subtitle="Tilt device or drag pointer"
        className="h-full w-full"
      />
    </div>
  );
}`;

export function HoloFoilSection() {
  const [tilt, setTilt] = useState(16);
  const [foil, setFoil] = useState(1);
  const [sparkle, setSparkle] = useState(1);
  const [glare, setGlare] = useState(0.7);
  const [hue, setHue] = useState(0);

  return (
    <section id="holo-foil" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Holo Foil
        </h2>
        <p className="text-base text-muted-foreground">
          Multi-pass holographic foil card featuring color-dodge iridescence, dual-mesh glitter sparkles,
          radial glare caustics, and real device gyroscope orientation tracking.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={() => {
              setTilt(16);
              setFoil(1);
              setSparkle(1);
              setGlare(0.7);
              setHue(0);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl border border-border bg-[#090a10] overflow-hidden h-[460px] relative">
            <HoloFoil
              tilt={tilt}
              foil={foil}
              sparkle={sparkle}
              glare={glare}
              hue={hue}
              radius={22}
              title="Foil"
              subtitle="Tilt your phone or move pointer"
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
              Hover pointer or tilt phone to rotate
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
                  <span>Tilt Angle</span>
                  <span className="font-mono text-foreground">{tilt.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="0.5"
                  value={tilt}
                  onChange={(e) => setTilt(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Foil Reflection</span>
                  <span className="font-mono text-foreground">{foil.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.6"
                  step="0.02"
                  value={foil}
                  onChange={(e) => setFoil(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Sparkle Intensity</span>
                  <span className="font-mono text-foreground">{sparkle.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.6"
                  step="0.02"
                  value={sparkle}
                  onChange={(e) => setSparkle(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Specular Glare</span>
                  <span className="font-mono text-foreground">{glare.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={glare}
                  onChange={(e) => setGlare(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Hue Shift</span>
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

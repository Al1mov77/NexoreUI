"use client";

import React, { useState, useRef } from "react";
import { ScrollWarp } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw, ChevronUp, ChevronDown, Play, Pause } from "lucide-react";

const PROPS_DATA = [
  { name: "curve", type: "number", defaultValue: "1", description: "Pinch curvature distortion scaled by scroll velocity." },
  { name: "skew", type: "number", defaultValue: "0.6", description: "Directional shear deformation along horizontal axis." },
  { name: "split", type: "number", defaultValue: "0.8", description: "Chromatic aberration velocity offset." },
  { name: "wave", type: "number", defaultValue: "0.4", description: "Sine ripple perturbation on frame borders." },
  { name: "zoom", type: "number", defaultValue: "0.5", description: "Push-zoom depth scaling at high velocities." },
  { name: "inertia", type: "number", defaultValue: "0.12", description: "Exponential scroll smoothing interpolation rate." },
  { name: "vgain", type: "number", defaultValue: "1", description: "Sensitivity multiplier for scroll velocity delta." },
  { name: "grain", type: "number", defaultValue: "0.04", description: "Procedural film grain noise overlay amount." },
  { name: "slices", type: "number", defaultValue: "4", description: "Number of full-height vertical scenes encoded in texture." },
  { name: "scrollProgress", type: "number", defaultValue: "undefined", description: "Direct normalized scroll value [0..1] to drive without window scroll." },
  { name: "background", type: "HTMLCanvasElement | HTMLImageElement | string", defaultValue: "procedural", description: "Custom background image URL or canvas source." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { ScrollWarp } from "nexoreui";

export function WarpShowcase() {
  return (
    <div className="relative h-[550px] w-full overflow-hidden rounded-2xl">
      <ScrollWarp
        curve={1.1}
        skew={0.7}
        split={0.9}
        wave={0.4}
        className="h-full w-full"
      />
    </div>
  );
}`;

export function ScrollWarpSection() {
  const [curve, setCurve] = useState(1);
  const [skew, setSkew] = useState(0.6);
  const [split, setSplit] = useState(0.8);
  const [zoom, setZoom] = useState(0.5);
  const [isAutoDrift, setIsAutoDrift] = useState(false);
  const [scrubPosition, setScrubPosition] = useState<number | null>(null);
  const stageCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const triggerScrollImpulse = (deltaY: number) => {
    setScrubPosition(null);
    if (stageCanvasRef.current) {
      stageCanvasRef.current.dispatchEvent(
        new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true })
      );
    }
  };

  const handleReset = () => {
    setCurve(1);
    setSkew(0.6);
    setSplit(0.8);
    setZoom(0.5);
    setIsAutoDrift(false);
    setScrubPosition(null);
  };

  return (
    <section id="scroll-warp" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Scroll Warp
        </h1>
        <p className="text-base text-muted-foreground">
          Scroll-driven velocity warp shader that physically bends the viewport canvas,
          splits RGB channels, and applies non-linear push zoom during flicks.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Stage</h2>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="flex flex-col lg:col-span-8 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="relative h-[420px] w-full bg-black/95">
              <ScrollWarp
                ref={stageCanvasRef}
                curve={curve}
                skew={skew}
                split={split}
                zoom={zoom}
                captureWheel={true}
                autoScroll={isAutoDrift}
                scrollProgress={scrubPosition !== null ? scrubPosition : undefined}
                className="h-full w-full"
              />
              <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/40 bg-background/80 px-2 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
                In-Place Kinetic Scroll · Wheel directly over canvas or trigger kinetic impulse
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">Kinetic Controls:</span>
                <button
                  type="button"
                  onClick={() => triggerScrollImpulse(-600)}
                  className="flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 text-xs font-mono text-foreground transition hover:bg-muted"
                  title="Simulate rapid upward scroll flick"
                >
                  <ChevronUp className="h-3 w-3" />
                  Flick Up
                </button>
                <button
                  type="button"
                  onClick={() => triggerScrollImpulse(600)}
                  className="flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 text-xs font-mono text-foreground transition hover:bg-muted"
                  title="Simulate rapid downward scroll flick"
                >
                  <ChevronDown className="h-3 w-3" />
                  Flick Down
                </button>
                <button
                  type="button"
                  onClick={() => setIsAutoDrift((prev) => !prev)}
                  className={`flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-mono transition ${
                    isAutoDrift
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {isAutoDrift ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  {isAutoDrift ? "Pause Drift" : "Auto-Drift"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-muted-foreground">Scrub:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.005"
                  value={scrubPosition !== null ? scrubPosition : 0.25}
                  onChange={(e) => {
                    setIsAutoDrift(false);
                    setScrubPosition(parseFloat(e.target.value));
                  }}
                  className="w-24 accent-primary h-1.5 bg-muted rounded appearance-none cursor-pointer"
                />
                {scrubPosition !== null && (
                  <button
                    type="button"
                    onClick={() => setScrubPosition(null)}
                    className="text-[10px] font-mono text-muted-foreground underline hover:text-foreground"
                  >
                    Release
                  </button>
                )}
              </div>
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
                  <span>Pinch Curvature</span>
                  <span className="font-mono text-foreground">{curve.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={curve}
                  onChange={(e) => setCurve(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Shear Offset</span>
                  <span className="font-mono text-foreground">{skew.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={skew}
                  onChange={(e) => setSkew(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>RGB Split</span>
                  <span className="font-mono text-foreground">{split.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.05"
                  value={split}
                  onChange={(e) => setSplit(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Push Zoom</span>
                  <span className="font-mono text-foreground">{zoom.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
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

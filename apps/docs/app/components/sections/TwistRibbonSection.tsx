"use client";

import React, { useState, useRef } from "react";
import { TwistRibbon } from "nexoreui";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { SlidersHorizontal, RotateCcw, ChevronUp, ChevronDown, Play, Pause } from "lucide-react";

const PROPS_DATA = [
  { name: "twist", type: "number", defaultValue: "1.6", description: "Base helical twist revolutions of ribbon strips." },
  { name: "flex", type: "number", defaultValue: "1.2", description: "Dynamic twist flex elasticity scaled by scroll velocity." },
  { name: "spd", type: "number", defaultValue: "0.35", description: "Idle continuous drift rotation speed." },
  { name: "boost", type: "number", defaultValue: "1", description: "Scroll impulse boost multiplier." },
  { name: "wid", type: "number", defaultValue: "0.55", description: "Half-width of the 3D ribbon strip." },
  { name: "tilt", type: "number", defaultValue: "0.28", description: "Spatial camera tilt angle in radians." },
  { name: "wamp", type: "number", defaultValue: "0.3", description: "Wave height oscillation amplitude along ribbon spine." },
  { name: "wfq", type: "number", defaultValue: "1.2", description: "Spatial frequency of ribbon spine sine wave." },
  { name: "cam", type: "number", defaultValue: "4.5", description: "Camera Z-distance perspective focal position." },
  { name: "cnt", type: "number", defaultValue: "2", description: "Number of overlapping ribbon mesh instances [1..3]." },
  { name: "spread", type: "number", defaultValue: "0.9", description: "Vertical separation gap between multiple ribbons." },
  { name: "rep", type: "number", defaultValue: "3", description: "Horizontal texture repeat iterations." },
  { name: "shade", type: "number", defaultValue: "0.6", description: "Normal diffuse shading contrast depth." },
  { name: "paper", type: "string", defaultValue: '"#f2efe8"', description: "Hex front surface tone." },
  { name: "ink", type: "string", defaultValue: '"#0b0b10"', description: "Hex ribbon typography tone." },
  { name: "back", type: "string", defaultValue: '"#ff4a2b"', description: "Hex back surface tone." },
  { name: "bg", type: "string", defaultValue: '"#15151b"', description: "Hex viewport background tone." },
  { name: "text", type: "string", defaultValue: '"Scroll / Twist / "', description: "Text rendered on procedural ribbon texture." },
  { name: "scrollProgress", type: "number", defaultValue: "undefined", description: "Direct normalized scroll value [0..1] to drive without window scroll." },
  { name: "background", type: "HTMLCanvasElement | HTMLImageElement | string", defaultValue: "procedural", description: "Custom background image URL or canvas source." },
  { name: "paused", type: "boolean", defaultValue: "false", description: "Pause animation loop manually." },
];

const CODE_EXAMPLE = `import { TwistRibbon } from "nexoreui";

export function RibbonShowcase() {
  return (
    <div className="relative h-[550px] w-full overflow-hidden rounded-2xl">
      <TwistRibbon
        twist={1.8}
        flex={1.4}
        wid={0.5}
        cnt={2}
        text="Motion / WebGL / Physics / "
        paper="#f2efe8"
        back="#ff4a2b"
        className="h-full w-full"
      />
    </div>
  );
}`;

export function TwistRibbonSection() {
  const [twist, setTwist] = useState(1.6);
  const [wid, setWid] = useState(0.55);
  const [tilt, setTilt] = useState(0.28);
  const [wamp, setWamp] = useState(0.3);
  const [cnt, setCnt] = useState(2);
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
    setTwist(1.6);
    setWid(0.55);
    setTilt(0.28);
    setWamp(0.3);
    setCnt(2);
    setIsAutoDrift(false);
    setScrubPosition(null);
  };

  return (
    <section id="twist-ribbon" className="space-y-10 scroll-mt-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Twist Ribbon
        </h2>
        <p className="text-base text-muted-foreground">
          3D twisting helical ribbon mesh rendered with triangle strips, depth testing,
          scroll-velocity impulse physics, and double-sided contrasting typography.
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
              <TwistRibbon
                ref={stageCanvasRef}
                twist={twist}
                wid={wid}
                tilt={tilt}
                wamp={wamp}
                cnt={cnt}
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
                  <span>Helical Twist</span>
                  <span className="font-mono text-foreground">{twist.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.05"
                  value={twist}
                  onChange={(e) => setTwist(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Ribbon Width</span>
                  <span className="font-mono text-foreground">{wid.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.02"
                  value={wid}
                  onChange={(e) => setWid(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tilt Angle</span>
                  <span className="font-mono text-foreground">{tilt.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-0.8"
                  max="0.8"
                  step="0.02"
                  value={tilt}
                  onChange={(e) => setTilt(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Ribbon Layers</span>
                  <span className="font-mono text-foreground">{cnt}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={cnt}
                  onChange={(e) => setCnt(parseInt(e.target.value, 10))}
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

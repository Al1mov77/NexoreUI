"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { cn } from "../utils/cn";
import { Eye, EyeOff, Droplets } from "lucide-react";

export interface FrostHoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Transparent PNG image URL of the product or object.
   */
  src: string;
  /**
   * Card title or product name.
   */
  title?: string;
  /**
   * Secondary label or subtitle.
   */
  subtitle?: string;
  /**
   * Optional price string.
   */
  price?: string;
  /**
   * Badge text displayed at top of card.
   */
  badge?: string;
  /**
   * Card width in pixels or CSS dimension string.
   * @default 360
   */
  cardWidth?: number | string;
  /**
   * Card height in pixels or CSS dimension string.
   * @default 480
   */
  cardHeight?: number | string;
  /**
   * Radius in pixels of the wiped clear circular viewport under the cursor.
   * @default 110
   */
  wipeRadius?: number;
  /**
   * Backdrop blur strength in pixels applied to the steamed glass layer.
   * @default 16
   */
  blurAmount?: number;
  /**
   * Whether to display typographic labels and chrome plates.
   * @default true
   */
  showLabels?: boolean;
}

/**
 * FrostHoverCard
 *
 * Luxury product showcase card concealed behind a steamed frosted glass overlay.
 * Moving the cursor dynamically wipes away the frost with realistic radial gradient
 * mask physics, and smoothly steams back up once the pointer departs.
 */
export const FrostHoverCard = React.forwardRef<HTMLDivElement, FrostHoverCardProps>(
  (
    {
      src,
      title = "Aero Stealth H1",
      subtitle = "CONDENSATION SEALED • ACTIVE ANC",
      price = "$780",
      badge = "Frosted Vapor",
      cardWidth = 360,
      cardHeight = 480,
      wipeRadius = 110,
      blurAmount = 16,
      showLabels = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const cardId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const frostLayerRef = useRef<HTMLDivElement>(null);

    const INITIAL_RADIUS = 55;
    const targetRadiusRef = useRef(INITIAL_RADIUS);
    const currRadiusRef = useRef(INITIAL_RADIUS);
    const animFrameRef = useRef<number | null>(null);

    const [isForceWiped, setIsForceWiped] = useState(false);
    const [wipePercent, setWipePercent] = useState(25);

    // Physics Animation Loop for Frost Hole Smooth Growth & Decay
    useEffect(() => {
      let isRunning = true;

      const physicsLoop = () => {
        if (!isRunning) return;

        const effectiveTarget = isForceWiped ? 1200 : targetRadiusRef.current;
        const delta = effectiveTarget - currRadiusRef.current;

        // Smooth spring/lerp easing for radius
        currRadiusRef.current += delta * 0.16;

        if (frostLayerRef.current) {
          const r = Math.max(INITIAL_RADIUS, currRadiusRef.current);
          frostLayerRef.current.style.setProperty("--r", `${r.toFixed(1)}px`);
        }

        const pct = isForceWiped
          ? 100
          : Math.min(100, Math.max(0, Math.round((currRadiusRef.current / wipeRadius) * 100)));
        setWipePercent(pct);

        animFrameRef.current = requestAnimationFrame(physicsLoop);
      };

      animFrameRef.current = requestAnimationFrame(physicsLoop);

      return () => {
        isRunning = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [isForceWiped, wipeRadius]);

    // Pointer Wipe Handlers
    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!containerRef.current || isForceWiped) return;
        const rect = containerRef.current.getBoundingClientRect();

        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

        const xPct = (x / rect.width) * 100;
        const yPct = (y / rect.height) * 100;

        if (frostLayerRef.current) {
          frostLayerRef.current.style.setProperty("--mx", `${xPct.toFixed(1)}%`);
          frostLayerRef.current.style.setProperty("--my", `${yPct.toFixed(1)}%`);
        }

        targetRadiusRef.current = wipeRadius;
      },
      [isForceWiped, wipeRadius]
    );

    const handlePointerLeave = useCallback(() => {
      if (!isForceWiped) {
        targetRadiusRef.current = INITIAL_RADIUS;
      }
    }, [isForceWiped]);

    return (
      <div
        ref={ref}
        className={cn("group flex flex-col items-center select-none w-full h-full", className)}
        style={{
          width: typeof cardWidth === "number" ? `${cardWidth}px` : cardWidth || "100%",
          height: typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight || "100%",
          ...style,
        }}
        {...props}
      >
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={cn(
            "relative w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300",
            showLabels
              ? "p-5 border border-white/10 bg-[hsl(225_12%_7%)] hover:border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_32px_-4px_rgba(0,0,0,0.5)] cursor-crosshair"
              : "p-0 border-0 bg-transparent shadow-none items-center justify-center cursor-crosshair"
          )}
          style={{
            minHeight: showLabels ? (typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight) : undefined,
          }}
        >
          {showLabels && (
            <>
              {/* Top specular rim */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-30" />

              {/* Top Header Plate */}
              <div className="relative z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-400">
                    {badge}
                  </span>
                </div>

                {/* Force Wipe Toggle */}
                <button
                  type="button"
                  onClick={() => setIsForceWiped(!isForceWiped)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-all cursor-pointer active:scale-95"
                  title="Toggle full glass wipe"
                >
                  <span>{isForceWiped ? "Steam up" : "Clear"}</span>
                </button>
              </div>
            </>
          )}

          {/* Ambient Silhouetting Glow (Ensures product is never pitch black) */}
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-65"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 48%, transparent 72%)",
            }}
          />

          {/* Base Product Visual */}
          <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none select-none">
            <img
              src={src}
              alt={title}
              className="w-full h-full max-h-[320px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)] transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Steamed / Frosted Glass Overlay with dynamic mask hole */}
          <div
            ref={frostLayerRef}
            className="absolute inset-0 pointer-events-none z-10 transition-[backdrop-filter] duration-300"
            style={{
              backdropFilter: `blur(${blurAmount}px) saturate(130%)`,
              WebkitBackdropFilter: `blur(${blurAmount}px) saturate(130%)`,
              backgroundColor: "rgba(10, 14, 23, 0.45)",
              maskImage:
                "radial-gradient(circle at var(--mx, 50%) var(--my, 45%), transparent 0px, transparent var(--r, 55px), black calc(var(--r, 55px) + 50px))",
              WebkitMaskImage:
                "radial-gradient(circle at var(--mx, 50%) var(--my, 45%), transparent 0px, transparent var(--r, 55px), black calc(var(--r, 55px) + 50px))",
            }}
          >
            {/* Fine Condensation Droplets Texture Grid */}
            <div
              className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1.5px, transparent 1.5px), radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 2.5px, transparent 2.5px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.5) 2px, transparent 2px)",
                backgroundSize: "32px 32px, 54px 54px, 42px 42px",
              }}
            />

            {/* Steamy Vignette Edge */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(9,11,16,0.5) 100%)",
              }}
            />
          </div>

          {showLabels && (
            <div className="relative z-20 border-t border-white/8 pt-4">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {title}
                </h3>
                {price && (
                  <span className="text-sm font-mono font-bold text-zinc-200">
                    {price}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-400 font-mono tracking-wide">
                  {subtitle}
                </p>
                <span className="text-[10px] font-mono text-zinc-500">
                  {isForceWiped ? "100% Clear" : `${wipePercent}% Wiped`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

FrostHoverCard.displayName = "FrostHoverCard";

"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { cn } from "../utils/cn";
import { Sparkles, RotateCcw } from "lucide-react";

export interface ParticleRevealCardProps extends React.HTMLAttributes<HTMLDivElement> {
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
   * Diameter of each pixel particle in pixels.
   * @default 2.2
   */
  particleSize?: number;
  /**
   * Sampling step/gap between sampled pixels. Lower value = higher particle density.
   * @default 3
   */
  gap?: number;
  /**
   * Cursor repulsion radius in pixels.
   * @default 85
   */
  repelRadius?: number;
  /**
   * Repulsion force multiplier.
   * @default 6.5
   */
  repelForce?: number;
  /**
   * Spring stiffness pulling particles back to their home coordinate.
   * @default 0.08
   */
  springStiffness?: number;
  /**
   * Velocity friction/damping factor (0.8 - 0.95).
   * @default 0.88
   */
  damping?: number;
  /**
   * Whether particles scatter randomly on initial load and spring-assemble.
   * @default true
   */
  scatterOnLoad?: boolean;
  /**
   * Whether to display typographic labels and chrome plates.
   * @default true
   */
  showLabels?: boolean;
}

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

/**
 * ParticleRevealCard
 *
 * Luxury showcase card where the product photo assembles from thousands of floating
 * particles upon load with spring physics, and the cursor dynamically repels particles.
 */
export const ParticleRevealCard = React.forwardRef<HTMLDivElement, ParticleRevealCardProps>(
  (
    {
      src,
      title = "Quantum Chronograph",
      subtitle = "CALIBRE 01 • FORGED TITANIUM",
      price = "$1,450",
      badge = "Particle Physics",
      cardWidth = 360,
      cardHeight = 480,
      particleSize = 2.2,
      gap = 3,
      repelRadius = 85,
      repelForce = 6.5,
      springStiffness = 0.08,
      damping = 0.88,
      scatterOnLoad = true,
      showLabels = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const cardId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number | null>(null);
    const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
      x: -9999,
      y: -9999,
      active: false,
    });

    const [isLoaded, setIsLoaded] = useState(false);
    const [particleCount, setParticleCount] = useState(0);

    // Scatter particles to random explosive offsets
    const triggerScatter = useCallback(() => {
      const particles = particlesRef.current;
      const canvas = canvasRef.current;
      if (!canvas || particles.length === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * Math.max(cw, ch) * 0.8;
        p.vx = Math.cos(angle) * (6 + Math.random() * 8);
        p.vy = Math.sin(angle) * (6 + Math.random() * 8);
        p.x = p.homeX + Math.cos(angle) * dist;
        p.y = p.homeY + Math.sin(angle) * dist;
      }
    }, []);

    // Load and sample transparent PNG pixels
    useEffect(() => {
      if (!src) return;
      let cancelled = false;
      setIsLoaded(false);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;

      img.onload = () => {
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const displayWidth = canvas.clientWidth || (typeof cardWidth === "number" ? cardWidth : 380);
        const displayHeight = canvas.clientHeight || (typeof cardHeight === "number" ? cardHeight : 380);

        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;

        const offscreen = document.createElement("canvas");
        const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
        if (!offCtx) return;

        // Scale image to fit comfortably within display bounds with minimal padding
        const padding = 10;
        const maxW = displayWidth - padding * 2;
        const maxH = displayHeight - padding * 2;
        const scale = Math.min(maxW / img.width, maxH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const offsetX = (displayWidth - drawW) / 2;
        const offsetY = (displayHeight - drawH) / 2;

        offscreen.width = displayWidth;
        offscreen.height = displayHeight;

        offCtx.clearRect(0, 0, displayWidth, displayHeight);
        offCtx.drawImage(img, offsetX, offsetY, drawW, drawH);

        const imgData = offCtx.getImageData(0, 0, displayWidth, displayHeight);
        const pixels = imgData.data;
        const newParticles: Particle[] = [];

        const samplingGap = Math.max(2, Math.round(gap));

        for (let y = 0; y < displayHeight; y += samplingGap) {
          for (let x = 0; x < displayWidth; x += samplingGap) {
            const index = (y * displayWidth + x) * 4;
            const alpha = pixels[index + 3];

            // Only sample solid silhouette pixels
            if (alpha > 30) {
              const r = pixels[index];
              const g = pixels[index + 1];
              const b = pixels[index + 2];
              const a = (alpha / 255).toFixed(2);

              const homeX = x * dpr;
              const homeY = y * dpr;

              let startX = homeX;
              let startY = homeY;
              let startVx = 0;
              let startVy = 0;

              if (scatterOnLoad) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 120 + Math.random() * Math.max(displayWidth, displayHeight) * 0.9 * dpr;
                startX = homeX + Math.cos(angle) * dist;
                startY = homeY + Math.sin(angle) * dist;
                startVx = (Math.random() - 0.5) * 8;
                startVy = (Math.random() - 0.5) * 8;
              }

              newParticles.push({
                homeX,
                homeY,
                x: startX,
                y: startY,
                vx: startVx,
                vy: startVy,
                color: `rgba(${r},${g},${b},${a})`,
              });
            }
          }
        }

        particlesRef.current = newParticles;
        setParticleCount(newParticles.length);
        setIsLoaded(true);
      };

      return () => {
        cancelled = true;
      };
    }, [src, gap, scatterOnLoad]);

    // Canvas Physics Animation Loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let isRunning = true;

      const render = () => {
        if (!isRunning) return;

        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const particles = particlesRef.current;
        const ptr = pointerRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scaledRepelRad = repelRadius * dpr;
        const scaledRepelRadSq = scaledRepelRad * scaledRepelRad;
        const pSize = particleSize * dpr;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // 1. Cursor Repulsion
          if (ptr.active) {
            const dx = p.x - ptr.x;
            const dy = p.y - ptr.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < scaledRepelRadSq && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / scaledRepelRad) * repelForce * dpr;
              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * force;
              p.vy += Math.sin(angle) * force;
            }
          }

          // 2. Spring Physics to Home
          const homeDx = p.homeX - p.x;
          const homeDy = p.homeY - p.y;
          p.vx += homeDx * springStiffness;
          p.vy += homeDy * springStiffness;

          // 3. Friction & Position Integration
          p.vx *= damping;
          p.vy *= damping;
          p.x += p.vx;
          p.y += p.vy;

          // 4. Render Particle
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - pSize / 2, p.y - pSize / 2, pSize, pSize);
        }

        animFrameRef.current = requestAnimationFrame(render);
      };

      animFrameRef.current = requestAnimationFrame(render);

      return () => {
        isRunning = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [particleSize, repelRadius, repelForce, springStiffness, damping]);

    // Pointer Event Handlers
    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

      const px = (e.clientX - rect.left) * dpr;
      const py = (e.clientY - rect.top) * dpr;

      pointerRef.current = {
        x: px,
        y: py,
        active: true,
      };
    }, []);

    const handlePointerLeave = useCallback(() => {
      pointerRef.current.active = false;
    }, []);

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
              ? "p-5 border border-white/10 bg-[hsl(225_12%_7%)] hover:border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_32px_-4px_rgba(0,0,0,0.5)]"
              : "p-0 border-0 bg-transparent shadow-none items-center justify-center"
          )}
          style={{
            minHeight: showLabels ? (typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight) : undefined,
          }}
        >
          {showLabels && (
            <>
              {/* Top specular rim */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              {/* Top Header Plate */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-400">
                    {badge}
                  </span>
                </div>

                {/* Scatter Re-trigger Button */}
                <button
                  type="button"
                  onClick={triggerScatter}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-all cursor-pointer active:scale-95"
                  title="Re-scatter particles"
                >
                  <RotateCcw className="w-3 h-3 text-zinc-400" />
                  <span>Scatter</span>
                </button>
              </div>
            </>
          )}

          {/* Center Stage: Interactive Particle Canvas */}
          <div className={cn("relative w-full flex items-center justify-center", showLabels ? "h-[260px] my-auto" : "h-full")}>
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair touch-none"
            />

            {!isLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500">
                <span className="text-xs font-mono">Synthesizing particles...</span>
              </div>
            )}
          </div>

          {showLabels && (
            <div className="relative z-10 border-t border-white/8 pt-4">
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
                {particleCount > 0 && (
                  <span className="text-[10px] font-mono text-zinc-500">
                    {particleCount.toLocaleString()} pts
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ParticleRevealCard.displayName = "ParticleRevealCard";

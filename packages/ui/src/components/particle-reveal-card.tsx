"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "../utils/cn";
import { RotateCcw } from "lucide-react";

export interface ParticleRevealCardProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  title?: string;
  subtitle?: string;
  price?: string;
  badge?: string;
  cardWidth?: number | string;
  cardHeight?: number | string;
  particleSize?: number;
  gap?: number;
  repelRadius?: number;
  repelForce?: number;
  springStiffness?: number;
  damping?: number;
  scatterOnLoad?: boolean;
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
    const shouldReduceMotion = useReducedMotion();
    const effectiveScatter = scatterOnLoad && !shouldReduceMotion;

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

    const triggerScatter = useCallback(() => {
      if (shouldReduceMotion) return;
      const particles = particlesRef.current;
      const canvas = canvasRef.current;
      if (!canvas || particles.length === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * Math.max(cw, ch) * 0.4;
        p.vx = Math.cos(angle) * (3 + Math.random() * 4);
        p.vy = Math.sin(angle) * (3 + Math.random() * 4);
        p.x = p.homeX + Math.cos(angle) * dist;
        p.y = p.homeY + Math.sin(angle) * dist;
      }
    }, [shouldReduceMotion]);

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

              if (effectiveScatter) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 60 + Math.random() * Math.max(displayWidth, displayHeight) * 0.4 * dpr;
                startX = homeX + Math.cos(angle) * dist;
                startY = homeY + Math.sin(angle) * dist;
                startVx = (Math.random() - 0.5) * 4;
                startVy = (Math.random() - 0.5) * 4;
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
    }, [src, gap, effectiveScatter, cardWidth, cardHeight]);

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

          if (!shouldReduceMotion && ptr.active) {
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

          if (!shouldReduceMotion) {
            const homeDx = p.homeX - p.x;
            const homeDy = p.homeY - p.y;
            p.vx += homeDx * springStiffness;
            p.vy += homeDy * springStiffness;

            p.vx *= damping;
            p.vy *= damping;
            p.x += p.vx;
            p.y += p.vy;
          } else {
            p.x = p.homeX;
            p.y = p.homeY;
          }

          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - pSize / 2, p.y - pSize / 2, pSize, pSize);
        }

        if (!shouldReduceMotion) {
          animFrameRef.current = requestAnimationFrame(render);
        }
      };

      animFrameRef.current = requestAnimationFrame(render);

      return () => {
        isRunning = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [particleSize, repelRadius, repelForce, springStiffness, damping, shouldReduceMotion]);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (shouldReduceMotion) return;
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
    }, [shouldReduceMotion]);

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
              ? "p-5 border border-border bg-card hover:border-foreground/20 text-card-foreground shadow-sm"
              : "p-0 border-0 bg-transparent shadow-none items-center justify-center"
          )}
          style={{
            minHeight: showLabels ? (typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight) : undefined,
          }}
        >
          {showLabels && (
            <>
              <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-border to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {badge}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={triggerScatter}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border transition-all cursor-pointer active:scale-95"
                  title="Re-scatter particles"
                >
                  <RotateCcw className="w-3 h-3 text-muted-foreground" />
                  <span>Scatter</span>
                </button>
              </div>
            </>
          )}

          <div className={cn("relative w-full flex items-center justify-center", showLabels ? "h-[260px] my-auto" : "h-full")}>
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair touch-none"
            />

            {!isLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <span className="text-xs font-mono">Synthesizing particles...</span>
              </div>
            )}
          </div>

          {showLabels && (
            <div className="relative z-10 border-t border-border pt-4">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  {title}
                </h3>
                {price && (
                  <span className="text-sm font-mono font-bold text-foreground">
                    {price}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-mono tracking-wide">
                  {subtitle}
                </p>
                {particleCount > 0 && (
                  <span className="text-[10px] font-mono text-muted-foreground">
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

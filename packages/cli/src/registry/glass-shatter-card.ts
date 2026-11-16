export const glassShatterCard = {
  name: "glass-shatter-card",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "lucide-react"
],
  
  fileName: "glass-shatter-card.tsx",
  content: `"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { cn } from "../utils/cn";
import { Zap, RotateCcw } from "lucide-react";

export interface GlassShatterCardProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  title?: string;
  subtitle?: string;
  price?: string;
  badge?: string;
  cardWidth?: number | string;
  cardHeight?: number | string;
  gridCols?: number;
  gridRows?: number;
  jitterAmount?: number;
  shatterForce?: number;
  gravity?: number;
  autoRestoreDelay?: number;
  showLabels?: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface Shard {
  p0: Point;
  p1: Point;
  p2: Point;
  cx: number;
  cy: number;
  x: number;
  y: number;
  rot: number;
  vx: number;
  vy: number;
  vrot: number;
}

export const GlassShatterCard = React.forwardRef<HTMLDivElement, GlassShatterCardProps>(
  (
    {
      src,
      title = "Prism Chronometer",
      subtitle = "SHATTERED SAPPHIRE CRYSTAL",
      price = "$1,890",
      badge = "Glass Physics",
      cardWidth = 360,
      cardHeight = 480,
      gridCols = 5,
      gridRows = 6,
      jitterAmount = 0.35,
      shatterForce = 11,
      gravity = 0.36,
      autoRestoreDelay = 1600,
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
    const imageRef = useRef<HTMLImageElement | null>(null);
    const shardsRef = useRef<Shard[]>([]);
    const animFrameRef = useRef<number | null>(null);
    const restoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isShatteredRef = useRef(false);
    const isReturningRef = useRef(false);
    const [isShatteredState, setIsShatteredState] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const buildMesh = useCallback(
      (width: number, height: number, dpr: number) => {
        const cols = Math.max(3, gridCols);
        const rows = Math.max(3, gridRows);
        const cellW = width / cols;
        const cellH = height / rows;

        const vertices: Point[][] = [];
        for (let r = 0; r <= rows; r++) {
          vertices[r] = [];
          for (let c = 0; c <= cols; c++) {
            let vx = c * cellW;
            let vy = r * cellH;

            if (c > 0 && c < cols && r > 0 && r < rows) {
              const jx = (Math.random() - 0.5) * cellW * jitterAmount;
              const jy = (Math.random() - 0.5) * cellH * jitterAmount;
              vx += jx;
              vy += jy;
            }

            vertices[r][c] = { x: vx * dpr, y: vy * dpr };
          }
        }

        const shards: Shard[] = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p00 = vertices[r][c];
            const p10 = vertices[r][c + 1];
            const p11 = vertices[r + 1][c + 1];
            const p01 = vertices[r + 1][c];

            const alternateDiag = (r + c) % 2 === 0;

            if (alternateDiag) {
              const t1_cx = (p00.x + p10.x + p11.x) / 3;
              const t1_cy = (p00.y + p10.y + p11.y) / 3;
              shards.push({
                p0: p00,
                p1: p10,
                p2: p11,
                cx: t1_cx,
                cy: t1_cy,
                x: 0,
                y: 0,
                rot: 0,
                vx: 0,
                vy: 0,
                vrot: 0,
              });

              const t2_cx = (p00.x + p11.x + p01.x) / 3;
              const t2_cy = (p00.y + p11.y + p01.y) / 3;
              shards.push({
                p0: p00,
                p1: p11,
                p2: p01,
                cx: t2_cx,
                cy: t2_cy,
                x: 0,
                y: 0,
                rot: 0,
                vx: 0,
                vy: 0,
                vrot: 0,
              });
            } else {
              const t1_cx = (p00.x + p10.x + p01.x) / 3;
              const t1_cy = (p00.y + p10.y + p01.y) / 3;
              shards.push({
                p0: p00,
                p1: p10,
                p2: p01,
                cx: t1_cx,
                cy: t1_cy,
                x: 0,
                y: 0,
                rot: 0,
                vx: 0,
                vy: 0,
                vrot: 0,
              });

              const t2_cx = (p10.x + p11.x + p01.x) / 3;
              const t2_cy = (p10.y + p11.y + p01.y) / 3;
              shards.push({
                p0: p10,
                p1: p11,
                p2: p01,
                cx: t2_cx,
                cy: t2_cy,
                x: 0,
                y: 0,
                rot: 0,
                vx: 0,
                vy: 0,
                vrot: 0,
              });
            }
          }
        }

        shardsRef.current = shards;
      },
      [gridCols, gridRows, jitterAmount]
    );

    useEffect(() => {
      if (!src) return;
      let cancelled = false;
      setIsLoaded(false);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;

      img.onload = () => {
        if (cancelled) return;
        imageRef.current = img;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const displayW = canvas.clientWidth || (typeof cardWidth === "number" ? cardWidth : 380);
        const displayH = canvas.clientHeight || (typeof cardHeight === "number" ? cardHeight : 380);

        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;

        buildMesh(displayW, displayH, dpr);
        setIsLoaded(true);
      };

      return () => {
        cancelled = true;
      };
    }, [src, buildMesh, cardWidth, cardHeight]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ro = new ResizeObserver(() => {
        if (!imageRef.current) return;
        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const w = canvas.clientWidth || 360;
        const h = canvas.clientHeight || 360;
        if (w > 30 && h > 30 && (Math.abs(canvas.width - w * dpr) > 4 || Math.abs(canvas.height - h * dpr) > 4)) {
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          buildMesh(w, h, dpr);
        }
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }, [buildMesh]);

    const triggerShatter = useCallback(
      (clientX?: number, clientY?: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !imageRef.current) return;

        if (restoreTimerRef.current) {
          clearTimeout(restoreTimerRef.current);
        }

        const rect = canvas.getBoundingClientRect();
        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

        const clickX = clientX !== undefined ? (clientX - rect.left) * dpr : canvas.width / 2;
        const clickY = clientY !== undefined ? (clientY - rect.top) * dpr : canvas.height / 2;

        const shards = shardsRef.current;
        const force = shatterForce * dpr;

        for (let i = 0; i < shards.length; i++) {
          const s = shards[i];
          const dx = s.cx - clickX;
          const dy = s.cy - clickY;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;

          const impulse = (force * (0.8 + Math.random() * 0.6)) / Math.max(1, dist * 0.015);
          s.vx = (dx / dist) * impulse + (Math.random() - 0.5) * 5 * dpr;
          s.vy = (dy / dist) * impulse - (3 + Math.random() * 7) * dpr;
          s.vrot = (Math.random() - 0.5) * 0.32;
        }

        isShatteredRef.current = true;
        isReturningRef.current = false;
        setIsShatteredState(true);

        restoreTimerRef.current = setTimeout(() => {
          isReturningRef.current = true;
        }, autoRestoreDelay);
      },
      [shatterForce, autoRestoreDelay]
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let isRunning = true;

      const render = () => {
        if (!isRunning) return;

        const img = imageRef.current;
        const shards = shardsRef.current;
        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (img && isLoaded && shards.length > 0) {
          const padding = 10 * dpr;
          const maxW = canvas.width - padding * 2;
          const maxH = canvas.height - padding * 2;
          const scale = Math.min(maxW / img.width, maxH / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const offsetX = (canvas.width - drawW) / 2;
          const offsetY = (canvas.height - drawH) / 2;

          let allSettled = true;
          const grav = gravity * dpr;

          for (let i = 0; i < shards.length; i++) {
            const s = shards[i];

            if (isShatteredRef.current) {
              if (isReturningRef.current) {
                const springStiffness = 0.09;
                const springDamping = 0.85;

                s.vx += (0 - s.x) * springStiffness;
                s.vy += (0 - s.y) * springStiffness;
                s.vrot += (0 - s.rot) * springStiffness;

                s.vx *= springDamping;
                s.vy *= springDamping;
                s.vrot *= springDamping;

                s.x += s.vx;
                s.y += s.vy;
                s.rot += s.vrot;

                if (
                  Math.abs(s.x) > 0.3 ||
                  Math.abs(s.y) > 0.3 ||
                  Math.abs(s.rot) > 0.01
                ) {
                  allSettled = false;
                } else {
                  s.x = 0;
                  s.y = 0;
                  s.rot = 0;
                  s.vx = 0;
                  s.vy = 0;
                  s.vrot = 0;
                }
              } else {
                s.vy += grav;
                s.vx *= 0.985;
                s.x += s.vx;
                s.y += s.vy;
                s.rot += s.vrot;
                allSettled = false;
              }
            }

            ctx.save();
            ctx.translate(s.cx + s.x, s.cy + s.y);
            if (s.rot !== 0) {
              ctx.rotate(s.rot);
            }

            ctx.beginPath();
            ctx.moveTo(s.p0.x - s.cx, s.p0.y - s.cy);
            ctx.lineTo(s.p1.x - s.cx, s.p1.y - s.cy);
            ctx.lineTo(s.p2.x - s.cx, s.p2.y - s.cy);
            ctx.closePath();

            ctx.clip();
            ctx.drawImage(img, offsetX - s.cx, offsetY - s.cy, drawW, drawH);

            if (s.x !== 0 || s.y !== 0) {
              ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
              ctx.lineWidth = 1 * dpr;
              ctx.stroke();
            }

            ctx.restore();
          }

          if (isShatteredRef.current && isReturningRef.current && allSettled) {
            isShatteredRef.current = false;
            isReturningRef.current = false;
            setIsShatteredState(false);
          }
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
    }, [gravity, isLoaded]);

    return (
      <div
        ref={ref}
        className={cn("group flex flex-col items-center select-none w-full h-full", className)}
        style={{
          width: typeof cardWidth === "number" ? \`\${cardWidth}px\` : cardWidth || "100%",
          height: typeof cardHeight === "number" ? \`\${cardHeight}px\` : cardHeight || "100%",
          ...style,
        }}
        {...props}
      >
        <div
          ref={containerRef}
          onClick={(e) => triggerShatter(e.clientX, e.clientY)}
          className={cn(
            "relative w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300",
            showLabels
              ? "p-5 border border-white/10 bg-[hsl(225_12%_7%)] hover:border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_32px_-4px_rgba(0,0,0,0.5)]"
              : "p-0 border-0 bg-transparent shadow-none items-center justify-center"
          )}
          style={{
            minHeight: showLabels ? (typeof cardHeight === "number" ? \`\${cardHeight}px\` : cardHeight) : undefined,
          }}
        >
          {showLabels && (
            <>
              {/* Top specular rim */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              {/* Top Header Plate */}
              <div className="relative z-10 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-400">
                    {badge}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/8">
                  <span>{isShatteredState ? "Shattered" : "Click to shatter"}</span>
                </div>
              </div>
            </>
          )}

          {/* Center Stage: Interactive Shard Canvas */}
          <div className={cn("relative w-full flex items-center justify-center", showLabels ? "h-[260px] my-auto" : "h-full")}>
            <canvas
              ref={canvasRef}
              className="w-full h-full"
            />
          </div>

          {showLabels && (
            <div className="relative z-10 border-t border-white/8 pt-4 pointer-events-none">
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
                  {gridCols * gridRows * 2} shards
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

GlassShatterCard.displayName = "GlassShatterCard";
`
};

"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Eye, RotateCcw } from "lucide-react";
import { cn } from "../utils/cn";

export interface SilkUnveilProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Transparent PNG image URL of the product.
   */
  src: string;
  /**
   * Aspect ratio of the stage scene.
   * Use "3/4" for tall products (perfume, shoes, bottles) or "4/3" for wide products (cars, keyboards).
   * @default "3/4"
   */
  aspectRatio?: string;
  /**
   * Product width as percentage of the stage scene.
   * @default "52%"
   */
  productWidth?: string;
  /**
   * Dark shadow tone of the silk cloth as RGB [r, g, b].
   * @default [24, 24, 27]
   */
  clothDark?: [number, number, number];
  /**
   * Luminous highlight tone of the silk cloth as RGB [r, g, b].
   * @default [228, 228, 231]
   */
  clothLight?: [number, number, number];
  /**
   * Accessibility image alt text description.
   * @default "Unveiled Product"
   */
  alt?: string;
  /**
   * Whether the cloth starts pulled away upon initial mount.
   * @default false
   */
  defaultUnveiled?: boolean;
}

interface Point {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  pinned: boolean;
  row: number;
  col: number;
}

interface Constraint {
  p1: Point;
  p2: Point;
  restLength: number;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const COLS = 12;
const ROWS = 15;
const ANIM_DURATION_MS = 1100;

/**
 * SilkUnveil
 *
 * Interactive cloth physics unveil component based on Verlet integration.
 * A procedural draped silk fabric with dynamic fold-shading, gravitational settling,
 * and wind ripples covers the product, pulled away on command with a physics-driven cinematic unveil.
 */
export const SilkUnveil = React.forwardRef<HTMLDivElement, SilkUnveilProps>(
  (
    {
      src,
      aspectRatio = "3/4",
      productWidth = "52%",
      clothDark = [24, 24, 27],
      clothLight = [228, 228, 231],
      alt = "Unveiled Product",
      defaultUnveiled = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafIdRef = useRef<number | null>(null);

    // Physics state
    const pointsRef = useRef<Point[][]>([]);
    const constraintsRef = useRef<Constraint[]>([]);
    const spacingXRef = useRef<number>(0);
    const spacingYRef = useRef<number>(0);
    const stageDimRef = useRef<{ w: number; h: number }>({ w: 400, h: 500 });

    // Unveil animation state (dragT: 0 = covered, 1 = away)
    const dragTRef = useRef<number>(defaultUnveiled ? 1 : 0);
    const animStateRef = useRef<{
      active: boolean;
      startTime: number;
      startT: number;
      targetT: number;
    }>({
      active: false,
      startTime: 0,
      startT: defaultUnveiled ? 1 : 0,
      targetT: defaultUnveiled ? 1 : 0,
    });

    const [isUnveiled, setIsUnveiled] = useState<boolean>(defaultUnveiled);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Reduced motion media query
    useEffect(() => {
      if (typeof window === "undefined") return;
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }, []);

    // Build Verlet cloth grid and structural constraints
    const initClothGrid = useCallback((width: number, height: number, initialDragT: number) => {
      stageDimRef.current = { w: width, h: height };
      const spacingX = (width + 40) / (COLS - 1);
      const spacingY = (height * 1.25 + 40) / (ROWS - 1);
      spacingXRef.current = spacingX;
      spacingYRef.current = spacingY;

      const pts: Point[][] = [];
      const easeT = easeInOutCubic(initialDragT);

      for (let r = 0; r < ROWS; r++) {
        const rowPts: Point[] = [];
        for (let c = 0; c < COLS; c++) {
          const isTop = r === 0;
          let initX = -20 + c * spacingX;
          let initY = -30 + r * spacingY;

          if (isTop) {
            const coveredX = -20 + c * spacingX;
            const coveredY = -30;
            const awayX = width * 0.9 + c * 5;
            const awayY = -height * 0.9 - c * 6;
            initX = coveredX + (awayX - coveredX) * easeT;
            initY = coveredY + (awayY - coveredY) * easeT;
          }

          rowPts.push({
            x: initX,
            y: initY,
            prevX: initX,
            prevY: initY,
            pinned: isTop,
            row: r,
            col: c,
          });
        }
        pts.push(rowPts);
      }

      // Constraints: horizontal, vertical, and both diagonals per cell
      const links: Constraint[] = [];

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const p = pts[r][c];

          // Horizontal link
          if (c < COLS - 1) {
            const pRight = pts[r][c + 1];
            links.push({
              p1: p,
              p2: pRight,
              restLength: spacingX,
            });
          }

          // Vertical link
          if (r < ROWS - 1) {
            const pDown = pts[r + 1][c];
            links.push({
              p1: p,
              p2: pDown,
              restLength: spacingY,
            });
          }

          // Diagonal links (shear resistance)
          if (r < ROWS - 1 && c < COLS - 1) {
            const pDiag1 = pts[r + 1][c + 1];
            links.push({
              p1: p,
              p2: pDiag1,
              restLength: Math.hypot(spacingX, spacingY),
            });

            const pRight = pts[r][c + 1];
            const pDown = pts[r + 1][c];
            links.push({
              p1: pRight,
              p2: pDown,
              restLength: Math.hypot(spacingX, spacingY),
            });
          }
        }
      }

      pointsRef.current = pts;
      constraintsRef.current = links;
    }, []);

    // Toggle unveil / cover animation
    const toggleUnveil = useCallback(() => {
      const nextTarget = isUnveiled ? 0 : 1;
      setIsUnveiled(!isUnveiled);

      animStateRef.current = {
        active: true,
        startTime: performance.now(),
        startT: dragTRef.current,
        targetT: nextTarget,
      };
    }, [isUnveiled]);

    // Handle container resize & canvas scaling
    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const handleResize = () => {
        const rect = container.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.resetTransform?.();
          ctx.scale(dpr, dpr);
        }

        initClothGrid(rect.width, rect.height, dragTRef.current);
      };

      handleResize();
      const ro = new ResizeObserver(handleResize);
      ro.observe(container);

      return () => ro.disconnect();
    }, [initClothGrid]);

    // Physics and render simulation loop
    useEffect(() => {
      let active = true;

      const loop = (time: number) => {
        if (!active) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const pts = pointsRef.current;
        const links = constraintsRef.current;
        const { w: width, h: height } = stageDimRef.current;

        if (canvas && ctx && pts.length > 0 && links.length > 0) {
          // 1. Advance unveil transition
          const anim = animStateRef.current;
          if (anim.active) {
            const elapsed = (time - anim.startTime) / ANIM_DURATION_MS;
            if (elapsed >= 1) {
              dragTRef.current = anim.targetT;
              anim.active = false;
            } else {
              dragTRef.current = anim.startT + (anim.targetT - anim.startT) * elapsed;
            }
          }

          const currentDragT = dragTRef.current;
          const easeT = easeInOutCubic(currentDragT);
          const spacingX = spacingXRef.current;

          // 2. Position pinned top anchors according to dragT
          for (let c = 0; c < COLS; c++) {
            const anchor = pts[0][c];
            const coveredX = -20 + c * spacingX;
            const coveredY = -30;
            const awayX = width * 0.9 + c * 5;
            const awayY = -height * 0.9 - c * 6;

            const targetX = coveredX + (awayX - coveredX) * easeT;
            const targetY = coveredY + (awayY - coveredY) * easeT;

            anchor.x = targetX;
            anchor.y = targetY;
            anchor.prevX = targetX;
            anchor.prevY = targetY;
          }

          // 3. Integrate unpinned points (Verlet + Gravity + Breathing Wind)
          const gravity = prefersReducedMotion ? 0.35 : 0.42;
          for (let r = 1; r < ROWS; r++) {
            const rowRatio = r / ROWS;
            for (let c = 0; c < COLS; c++) {
              const p = pts[r][c];
              const vx = (p.x - p.prevX) * 0.985;
              const vy = (p.y - p.prevY) * 0.985;

              p.prevX = p.x;
              p.prevY = p.y;

              const wind = prefersReducedMotion
                ? 0
                : Math.sin(time * 0.0016 + p.y * 0.02) * 0.1 * rowRatio;

              p.x += vx + wind;
              p.y += vy + gravity;
            }
          }

          // 4. Relax constraints (5 iterations per frame)
          for (let iter = 0; iter < 5; iter++) {
            for (let i = 0; i < links.length; i++) {
              const link = links[i];
              const p1 = link.p1;
              const p2 = link.p2;

              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const dist = Math.hypot(dx, dy) || 0.0001;
              const diff = (dist - link.restLength) / dist;

              if (p1.pinned && !p2.pinned) {
                p2.x -= dx * diff;
                p2.y -= dy * diff;
              } else if (!p1.pinned && p2.pinned) {
                p1.x += dx * diff;
                p1.y += dy * diff;
              } else if (!p1.pinned && !p2.pinned) {
                p1.x += dx * 0.5 * diff;
                p1.y += dy * 0.5 * diff;
                p2.x -= dx * 0.5 * diff;
                p2.y -= dy * 0.5 * diff;
              }
            }
          }

          // 5. Render cloth quads
          ctx.clearRect(0, 0, width, height);

          for (let r = 0; r < ROWS - 1; r++) {
            const rowRatio = r / ROWS;
            for (let c = 0; c < COLS - 1; c++) {
              const P00 = pts[r][c];
              const P10 = pts[r][c + 1];
              const P11 = pts[r + 1][c + 1];
              const P01 = pts[r + 1][c];

              // Color formula based on horizontal tension compression
              const topLen = Math.hypot(P10.x - P00.x, P10.y - P00.y);
              const btmLen = Math.hypot(P11.x - P01.x, P11.y - P01.y);
              const avgHoriz = (topLen + btmLen) * 0.5;
              const compression = spacingX - avgHoriz;

              let t = 0.5 + compression * 0.05 - rowRatio * 0.12;
              t = Math.max(0, Math.min(1, t));

              const rc = Math.round(clothDark[0] + (clothLight[0] - clothDark[0]) * t);
              const gc = Math.round(clothDark[1] + (clothLight[1] - clothDark[1]) * t);
              const bc = Math.round(clothDark[2] + (clothLight[2] - clothDark[2]) * t);

              ctx.beginPath();
              ctx.moveTo(P00.x, P00.y);
              ctx.lineTo(P10.x, P10.y);
              ctx.lineTo(P11.x, P11.y);
              ctx.lineTo(P01.x, P01.y);
              ctx.closePath();

              ctx.fillStyle = `rgb(${rc}, ${gc}, ${bc})`;
              ctx.fill();

              // Subtle seam smoothing
              ctx.strokeStyle = `rgba(${rc}, ${gc}, ${bc}, 0.35)`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }

        rafIdRef.current = requestAnimationFrame(loop);
      };

      rafIdRef.current = requestAnimationFrame(loop);

      return () => {
        active = false;
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }, [clothDark, clothLight, prefersReducedMotion]);

    return (
      <div
        ref={ref}
        className={cn("relative flex flex-col items-center select-none", className)}
        style={{ ...style }}
        {...props}
      >
        {/* Stage Container */}
        <div
          ref={containerRef}
          className="relative w-full rounded-3xl bg-zinc-950/90 border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-md"
          style={{ aspectRatio }}
        >
          {/* Subtle Ambient Background Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* Layer 1 (Bottom): Shadow Ellipse under the product */}
          <div
            className="absolute pointer-events-none rounded-[100%] opacity-80"
            style={{
              bottom: "16%",
              width: "60%",
              height: "18%",
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 45%, transparent 72%)",
              filter: "blur(8px)",
            }}
          />

          {/* Layer 2 (Middle): Product image centered */}
          <div
            className="relative z-10 flex items-center justify-center pointer-events-none transition-transform duration-300"
            style={{
              width: productWidth,
              filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.7))",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="w-full h-auto object-contain select-none drag-none"
              draggable={false}
            />
          </div>

          {/* Layer 3 (Top): Verlet Fabric Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          />

          {/* Unveil Action Trigger Button */}
          <div className="absolute bottom-4 z-30 flex items-center justify-center">
            <button
              type="button"
              onClick={toggleUnveil}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-white bg-zinc-900/85 hover:bg-zinc-800 border border-white/12 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer active:scale-95"
              aria-label={isUnveiled ? "Cover product with silk" : "Unveil product"}
            >
              {isUnveiled ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Drape</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Unveil</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SilkUnveil.displayName = "SilkUnveil";

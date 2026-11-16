export const flowField = {
  name: "flow-field",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "flow-field.tsx",
  content: `"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "../utils/cn";

export interface FlowFieldProps extends React.HTMLAttributes<HTMLCanvasElement> {
  count?: number;
  scale?: number;
  curl?: number;
  speed?: number;
  drift?: number;
  fade?: number;
  lw?: number;
  pf?: number;
  prad?: number;
  hue?: number;
  range?: number;
  glow?: number;
  bg?: string;
  paused?: boolean;
}

function parseHex(h: string): [number, number, number] {
  const c = h.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export const FlowField = React.forwardRef<HTMLCanvasElement, FlowFieldProps>(
  function FlowField(
    {
      count = 1600,
      scale = 1.4,
      curl = 1.2,
      speed = 90,
      drift = 0.6,
      fade = 0.045,
      lw = 1.2,
      pf = 1.2,
      prad = 200,
      hue = 190,
      range = 140,
      glow = 1,
      bg = "#07080c",
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointerRef = useRef<{ x: number; y: number; t: number }>({ x: -1e4, y: -1e4, t: -1e9 });
    const isVisibleRef = useRef<boolean>(true);

    const buffersRef = useRef<{
      maxN: number;
      X: Float32Array;
      Y: Float32Array;
      VX: Float32Array;
      VY: Float32Array;
      A: Float32Array;
      q: number;
      ema: number;
      buckets: number[][];
    }>({
      maxN: 4000,
      X: new Float32Array(4000),
      Y: new Float32Array(4000),
      VX: new Float32Array(4000),
      VY: new Float32Array(4000),
      A: new Float32Array(4000),
      q: 1,
      ema: 0.016,
      buckets: Array.from({ length: 12 }, () => []),
    });

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(cvs);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;

      const onPointerMove = (e: PointerEvent) => {
        const rect = cvs.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          t: performance.now(),
        };
      };

      const onPointerLeave = () => {
        pointerRef.current = { x: -1e4, y: -1e4, t: -1e9 };
      };

      cvs.addEventListener("pointermove", onPointerMove);
      cvs.addEventListener("pointerdown", onPointerMove);
      cvs.addEventListener("pointerleave", onPointerLeave);

      return () => {
        cvs.removeEventListener("pointermove", onPointerMove);
        cvs.removeEventListener("pointerdown", onPointerMove);
        cvs.removeEventListener("pointerleave", onPointerLeave);
      };
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      if (!ctx) return;

      let lastTime = performance.now();
      let rafId = 0;

      const resize = () => {
        const rect = cvs.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        cvs.width = Math.round(rect.width * dpr);
        cvs.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, rect.width, rect.height);
        buffersRef.current.A.fill(0);
      };

      const ro = new ResizeObserver(resize);
      ro.observe(cvs);
      resize();

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const rect = cvs.getBoundingClientRect();
          const w = rect.width;
          const h = rect.height;

          if (w > 0 && h > 0) {
            const dt = Math.min((ms - lastTime) / 1000, 0.05) || 0.016;
            lastTime = ms;
            const t = ms / 1000;

            const b = buffersRef.current;
            b.ema += (dt - b.ema) * 0.05;
            if (b.ema > 0.026) b.q = Math.max(0.25, b.q * 0.985);
            else if (b.ema < 0.019 && b.q < 1) b.q = Math.min(1, b.q * 1.005);

            const n = Math.min(b.maxN, Math.floor(count * b.q));
            const sc = scale / 1000;
            const tt = t * drift;
            const isPointerActive = performance.now() - pointerRef.current.t < 2500;
            const buckets = b.buckets;

            for (let i = 0; i < 12; i++) {
              buckets[i] = [];
            }

            const bgRgb = parseHex(bg);
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = \`rgba(\${bgRgb[0]},\${bgRgb[1]},\${bgRgb[2]},\${fade})\`;
            ctx.fillRect(0, 0, w, h);

            for (let i = 0; i < n; i++) {
              let px = b.X[i] ?? 0;
              let py = b.Y[i] ?? 0;
              let fresh = false;

              b.A[i] = (b.A[i] ?? 0) - 1;
              if ((b.A[i] ?? 0) <= 0 || px < -20 || px > w + 20 || py < -20 || py > h + 20) {
                px = Math.random() * w;
                py = Math.random() * h;
                b.A[i] = 80 + Math.random() * 200;
                b.VX[i] = 0;
                b.VY[i] = 0;
                fresh = true;
              }

              const a =
                Math.sin(px * sc + tt) +
                Math.sin(py * sc * 1.27 - tt * 0.8) +
                Math.sin((px + py) * sc * 0.63 + tt * 0.5);
              const ang = a * curl;

              const vxTarget = Math.cos(ang) * speed;
              const vyTarget = Math.sin(ang) * speed;
              const vx = ((b.VX[i] ?? 0) + (vxTarget - (b.VX[i] ?? 0)) * 0.15);
              const vy = ((b.VY[i] ?? 0) + (vyTarget - (b.VY[i] ?? 0)) * 0.15);
              b.VX[i] = vx;
              b.VY[i] = vy;

              let nx = px + vx * dt;
              let ny = py + vy * dt;

              if (isPointerActive) {
                const dx = px - pointerRef.current.x;
                const dy = py - pointerRef.current.y;
                const qDist = dx * dx + dy * dy;
                if (qDist < prad * prad) {
                  const dd = Math.sqrt(qDist) + 1;
                  const f = Math.pow(1 - dd / prad, 2) * pf * speed * 3 * dt;
                  nx += (dx / dd) * f;
                  ny += (dy / dd) * f;
                }
              }

              if (!fresh) {
                const bucketIdx = Math.min(11, Math.max(0, Math.floor((a / 6 + 0.5) * 12)));
                buckets[bucketIdx]?.push(px, py, nx, ny);
              }

              b.X[i] = nx;
              b.Y[i] = ny;
            }

            ctx.globalCompositeOperation = glow ? "lighter" : "source-over";
            ctx.lineWidth = lw;
            ctx.lineCap = "round";

            for (let k = 0; k < 12; k++) {
              const segs = buckets[k];
              if (!segs || segs.length === 0) continue;

              ctx.strokeStyle = \`hsla(\${hue + (k / 12) * range}, 90%, \${glow ? 55 : 60}%, 0.8)\`;
              ctx.beginPath();
              for (let j = 0; j < segs.length; j += 4) {
                ctx.moveTo(segs[j] ?? 0, segs[j + 1] ?? 0);
                ctx.lineTo(segs[j + 2] ?? 0, segs[j + 3] ?? 0);
              }
              ctx.stroke();
            }
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
      };
    }, [paused, count, scale, curl, speed, drift, fade, lw, pf, prad, hue, range, glow, bg]);

    return (
      <canvas
        ref={(node) => {
          canvasRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("block w-full h-full touch-none select-none", className)}
        style={{ ...style }}
        {...rest}
      />
    );
  }
);

FlowField.displayName = "FlowField";
`
};

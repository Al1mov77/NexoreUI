"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export interface MoireGratingProps extends React.HTMLAttributes<HTMLCanvasElement> {
  type?: number;
  gap?: number;
  duty?: number;
  ratio?: number;
  rot?: number;
  drift?: number;
  follow?: number;
  mix?: number;
  bg?: string;
  a?: string;
  b?: string;
  paused?: boolean;
}

export const MoireGrating = React.forwardRef<HTMLCanvasElement, MoireGratingProps>(
  function MoireGrating(
    {
      type = 0,
      gap = 9,
      duty = 0.42,
      ratio = 1.04,
      rot = 0.05,
      drift = 0.4,
      follow = 0.12,
      mix = 1,
      bg = "#e8ebef",
      a = "#101014",
      b = "#ff4a2b",
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointerRef = useRef<{ x: number; y: number; t: number }>({ x: -1e4, y: -1e4, t: -1e9 });
    const posB = useRef<{ bx: number; by: number }>({ bx: 400, by: 300 });
    const isVisibleRef = useRef<boolean>(true);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);

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

      let rafId = 0;

      const resize = () => {
        const rect = cvs.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        cvs.width = Math.round(rect.width * dpr);
        cvs.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        posB.current.bx = rect.width / 2;
        posB.current.by = rect.height / 2;
      };

      const ro = new ResizeObserver(resize);
      ro.observe(cvs);
      resize();

      const drawGrating = (
        cx: number,
        cy: number,
        curGap: number,
        ang: number,
        col: string,
        alpha: number,
        diag: number
      ) => {
        ctx.strokeStyle = col;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = Math.max(0.5, curGap * duty);
        ctx.beginPath();

        if (type === 0) {
          for (let r = curGap / 2; r < diag; r += curGap) {
            ctx.moveTo(cx + r, cy);
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
          }
        } else if (type === 1) {
          const cos = Math.cos(ang);
          const sin = Math.sin(ang);
          for (let p = -diag; p < diag; p += curGap) {
            ctx.moveTo(cx - cos * diag - sin * p, cy - sin * diag + cos * p);
            ctx.lineTo(cx + cos * diag - sin * p, cy + sin * diag + cos * p);
          }
        } else {
          const n = Math.round(2000 / curGap);
          for (let k = 0; k < n; k++) {
            const radAngle = ang + (k / n) * Math.PI * 2;
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(radAngle) * diag, cy + Math.sin(radAngle) * diag);
          }
        }

        ctx.stroke();
      };

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const rect = cvs.getBoundingClientRect();
          const w = rect.width;
          const h = rect.height;

          if (w > 0 && h > 0) {
            const t = ms / 1000;
            const diag = Math.hypot(w, h);
            const isPointerActive = performance.now() - pointerRef.current.t < 2500;

            const tx = isPointerActive
              ? pointerRef.current.x
              : w / 2 + Math.sin(t * 0.4 * drift) * w * 0.2;
            const ty = isPointerActive
              ? pointerRef.current.y
              : h / 2 + Math.cos(t * 0.31 * drift) * h * 0.2;

            const bPos = posB.current;
            bPos.bx += (tx - bPos.bx) * follow;
            bPos.by += (ty - bPos.by) * follow;

            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            const baseAng = reducedMotion ? 0 : t * rot * 0.2;

            drawGrating(w / 2, h / 2, gap, baseAng, a, 1, diag);

            ctx.globalCompositeOperation = "multiply";
            drawGrating(
              bPos.bx,
              bPos.by,
              gap * ratio,
              baseAng + (ratio - 1) * 1.2,
              b,
              mix,
              diag
            );

            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
      };
    }, [paused, reducedMotion, type, gap, duty, ratio, rot, drift, follow, mix, bg, a, b]);

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

MoireGrating.displayName = "MoireGrating";

"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export interface LetterPileProps extends React.HTMLAttributes<HTMLCanvasElement> {
  count?: number;
  size?: number;
  grav?: number;
  bounce?: number;
  drag?: number;
  push?: number;
  gyro?: number;
  swing?: number;
  c1?: string;
  c2?: string;
  c3?: string;
  bg?: string;
  ink?: string;
  paused?: boolean;
}

interface Disk {
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  f: number;
  ci: number;
  ch: string;
  r: number;
}

function parseHex(h: string): [number, number, number] {
  const c = h.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const CHAR_SET = "MOTIONKITSCROLLDEPTHGLASS";

export const LetterPile = React.forwardRef<HTMLCanvasElement, LetterPileProps>(
  function LetterPile(
    {
      count = 54,
      size = 5.2,
      grav = 1,
      bounce = 0.45,
      drag = 0.15,
      push = 1.4,
      gyro = 1,
      swing = 0.35,
      c1 = "#ff4a2b",
      c2 = "#2d4bff",
      c3 = "#f4f1e8",
      bg = "#101014",
      ink = "#101014",
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const disksRef = useRef<Disk[]>([]);
    const pointerRef = useRef<{ x: number; y: number; t: number; down: boolean }>({
      x: -1e4,
      y: -1e4,
      t: -1e9,
      down: false,
    });
    const gyroRef = useRef<{ on: boolean; g: number; b: number }>({ on: false, g: 0, b: 0 });
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
      const onOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null && e.beta !== null) {
          gyroRef.current.on = true;
          gyroRef.current.g = e.gamma;
          gyroRef.current.b = e.beta;
        }
      };
      window.addEventListener("deviceorientation", onOrientation);
      return () => window.removeEventListener("deviceorientation", onOrientation);
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;

      const onPointerMove = (e: PointerEvent) => {
        const rect = cvs.getBoundingClientRect();
        pointerRef.current.x = e.clientX - rect.left;
        pointerRef.current.y = e.clientY - rect.top;
        pointerRef.current.t = performance.now();
      };

      const onPointerDown = (e: PointerEvent) => {
        onPointerMove(e);
        pointerRef.current.down = true;
      };

      const onPointerUp = () => {
        pointerRef.current.down = false;
      };

      const onPointerLeave = () => {
        pointerRef.current.x = -1e4;
        pointerRef.current.y = -1e4;
        pointerRef.current.t = -1e9;
        pointerRef.current.down = false;
      };

      cvs.addEventListener("pointermove", onPointerMove);
      cvs.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
      cvs.addEventListener("pointerleave", onPointerLeave);

      return () => {
        cvs.removeEventListener("pointermove", onPointerMove);
        cvs.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
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
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cvs.width = Math.round(rect.width * dpr);
        cvs.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
            let dt = Math.min((ms - lastTime) / 1000, 0.033) || 0.016;
            lastTime = ms;
            const t = ms / 1000;

            const disks = disksRef.current;
            const rb = (size * Math.min(w, h)) / 100;

            while (disks.length < count) {
              disks.push({
                x: Math.random() * w,
                y: Math.random() * h * 0.35,
                vx: 0,
                vy: 0,
                a: Math.random() * 6,
                f: 0.75 + Math.random() * 0.5,
                ci: Math.floor(Math.random() * 3),
                ch: CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)] ?? "A",
                r: 0,
              });
            }
            if (disks.length > count) {
              disks.length = count;
            }

            const gyroState = gyroRef.current;
            const ang = gyroState.on
              ? (Math.min(80, Math.max(-80, gyroState.g)) * Math.PI) / 180 * gyro
              : reducedMotion
              ? 0
              : Math.sin(t * 0.7) * swing;

            const gx = Math.sin(ang) * grav * 1600;
            const gy = Math.cos(ang) * grav * 1600;
            const isPointerActive = performance.now() - pointerRef.current.t < 2500;
            const pr = rb * 4;

            for (const p of disks) {
              p.r = rb * p.f;
              p.vx += gx * dt;
              p.vy += gy * dt;
              const k = Math.max(0, 1 - drag * dt);
              p.vx *= k;
              p.vy *= k;

              if (isPointerActive) {
                const dx = p.x - pointerRef.current.x;
                const dy = p.y - pointerRef.current.y;
                const dd = Math.hypot(dx, dy) || 1;
                const totalR = p.r + pr;
                if (dd < totalR) {
                  const force =
                    (1 - dd / totalR) *
                    push *
                    (pointerRef.current.down ? 2.5 : 1) *
                    2200 *
                    dt;
                  p.vx += (dx / dd) * force;
                  p.vy += (dy / dd) * force;
                }
              }

              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.a += (p.vx / p.r) * dt * 0.6;
            }

            for (let it = 0; it < 3; it++) {
              for (let i = 0; i < disks.length; i++) {
                for (let j = i + 1; j < disks.length; j++) {
                  const a = disks[i];
                  const b = disks[j];
                  if (!a || !b) continue;

                  const dx = a.x - b.x;
                  const dy = a.y - b.y;
                  const m = a.r + b.r;
                  const q = dx * dx + dy * dy;

                  if (q < m * m && q > 0.01) {
                    const dd = Math.sqrt(q);
                    const nx = dx / dd;
                    const ny = dy / dd;
                    const ov = (m - dd) / 2;
                    a.x += nx * ov;
                    a.y += ny * ov;
                    b.x -= nx * ov;
                    b.y -= ny * ov;

                    const vn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                    if (vn < 0) {
                      const impulse = -((1 + bounce) * vn) / 2;
                      a.vx += nx * impulse;
                      a.vy += ny * impulse;
                      b.vx -= nx * impulse;
                      b.vy -= ny * impulse;
                    }
                  }
                }
              }

              for (const p of disks) {
                if (p.x < p.r) {
                  p.x = p.r;
                  p.vx = Math.abs(p.vx) * bounce;
                }
                if (p.x > w - p.r) {
                  p.x = w - p.r;
                  p.vx = -Math.abs(p.vx) * bounce;
                }
                if (p.y < p.r) {
                  p.y = p.r;
                  p.vy = Math.abs(p.vy) * bounce;
                }
                if (p.y > h - p.r) {
                  p.y = h - p.r;
                  p.vy = -Math.abs(p.vy) * bounce;
                  p.vx *= 1 - 0.9 * dt;
                }
              }
            }

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const palette = [c1, c2, c3];

            for (const p of disks) {
              const diskColor = palette[p.ci] ?? c1;
              const rgb = parseHex(diskColor);
              ctx.fillStyle = diskColor;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
              ctx.fill();

              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.a);
              const lum = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
              ctx.fillStyle = lum > 140 ? ink : "#ffffff";
              ctx.font = `800 ${Math.floor(p.r * 1.15)}px "Schibsted Grotesk", sans-serif`;
              ctx.fillText(p.ch, 0, p.r * 0.04);
              ctx.restore();
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
    }, [paused, reducedMotion, count, size, grav, bounce, drag, push, gyro, swing, c1, c2, c3, bg, ink]);

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

LetterPile.displayName = "LetterPile";

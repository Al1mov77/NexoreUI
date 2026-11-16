export const holoFoil = {
  name: "holo-foil",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "holo-foil.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export interface HoloFoilProps extends React.HTMLAttributes<HTMLDivElement> {
  tilt?: number;
  foil?: number;
  sparkle?: number;
  glare?: number;
  hue?: number;
  depth?: number;
  radius?: number;
  gyro?: number;
  ease?: number;
  title?: string;
  subtitle?: string;
  paused?: boolean;
}

export const HoloFoil = React.forwardRef<HTMLDivElement, HoloFoilProps>(
  function HoloFoil(
    {
      tilt = 16,
      foil = 1,
      sparkle = 1,
      glare = 0.7,
      hue = 0,
      depth = 22,
      radius = 22,
      gyro = 1,
      ease = 0.12,
      title = "Foil",
      subtitle = "Tilt your phone or move the pointer.",
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLDivElement | null>(null);
    const posRef = useRef<{ x: number; y: number; nx: number; ny: number; t: number; hasGyro: boolean; gGamma: number; gBeta: number }>({
      x: 0,
      y: 0,
      nx: 0,
      ny: 0,
      t: -1e9,
      hasGyro: false,
      gGamma: 0,
      gBeta: 0,
    });
    const isVisibleRef = useRef<boolean>(true);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [showGyroBtn, setShowGyroBtn] = useState(false);

    useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const onOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null && e.beta !== null) {
          posRef.current.hasGyro = true;
          posRef.current.gGamma = e.gamma;
          posRef.current.gBeta = e.beta;
        }
      };

      window.addEventListener("deviceorientation", onOrientation);

      const winAny = window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } };
      if (typeof winAny.DeviceOrientationEvent?.requestPermission === "function") {
        setShowGyroBtn(true);
      }

      return () => {
        window.removeEventListener("deviceorientation", onOrientation);
      };
    }, []);

    const enableMotion = () => {
      const winAny = window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } };
      if (typeof winAny.DeviceOrientationEvent?.requestPermission === "function") {
        winAny.DeviceOrientationEvent.requestPermission().then((res) => {
          if (res === "granted") {
            setShowGyroBtn(false);
          }
        }).catch(() => {});
      }
    };

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;

      const onPointerMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        posRef.current.x = Math.min(1, Math.max(-1, nx));
        posRef.current.y = Math.min(1, Math.max(-1, ny));
        posRef.current.t = performance.now();
      };

      const onPointerLeave = () => {
        posRef.current.t = -1e9;
      };

      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerdown", onPointerMove);
      el.addEventListener("pointerleave", onPointerLeave);

      return () => {
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerdown", onPointerMove);
        el.removeEventListener("pointerleave", onPointerLeave);
      };
    }, []);

    useEffect(() => {
      let rafId = 0;

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const t = ms / 1000;
          const pos = posRef.current;
          let targetX = 0;
          let targetY = 0;

          if (pos.hasGyro) {
            targetX = Math.min(1, Math.max(-1, (pos.gGamma / 30) * gyro));
            targetY = Math.min(1, Math.max(-1, ((pos.gBeta - 55) / 30) * gyro));
          } else if (performance.now() - pos.t < 2500) {
            targetX = pos.x;
            targetY = pos.y;
          } else {
            targetX = reducedMotion ? 0 : Math.sin(t * 0.7) * 0.6;
            targetY = reducedMotion ? 0 : Math.cos(t * 0.9) * 0.5;
          }

          pos.nx += (targetX - pos.nx) * ease;
          pos.ny += (targetY - pos.ny) * ease;

          const cx = pos.nx;
          const cy = pos.ny;
          const card = cardRef.current;
          const txt = textRef.current;

          if (card) {
            card.style.transform = \`rotateY(\${cx * tilt}deg) rotateX(\${-cy * tilt}deg)\`;
            card.style.boxShadow = \`\${-cx * 28}px \${30 - cy * 20}px 60px rgba(0,0,0,0.55)\`;
            card.style.setProperty("--mx", String(50 + cx * 50));
            card.style.setProperty("--my", String(50 + cy * 50));
            card.style.setProperty("--d", String(Math.hypot(cx, cy) / 1.414));
            card.style.setProperty("--foil", String(foil));
            card.style.setProperty("--sp", String(sparkle));
            card.style.setProperty("--gl", String(glare));
            card.style.setProperty("--hue", \`\${hue}deg\`);
            card.style.setProperty("--r", \`\${radius}px\`);
          }

          if (txt) {
            txt.style.transform = \`translate(\${cx * depth}px, \${cy * depth * 0.6}px)\`;
          }
        }

        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }, [paused, reducedMotion, tilt, foil, sparkle, glare, hue, depth, radius, gyro, ease]);

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn(
          "relative flex items-center justify-center overflow-hidden touch-none select-none",
          className
        )}
        style={{
          perspective: 1000,
          background: "radial-gradient(80% 60% at 50% 35%, #2b3150, #090a10)",
          ...style,
        }}
        {...rest}
      >
        <div
          ref={cardRef}
          className="relative isolate overflow-hidden"
          style={{
            width: "min(300px, 72vw)",
            aspectRatio: "5/7",
            borderRadius: radius,
            willChange: "transform",
          }}
        >
          <div
            className="absolute inset-0 flex flex-col justify-end gap-2 p-[9%] overflow-hidden pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "radial-gradient(circle at 50% 30%, #4a5075, #232744 55%, #12142a)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "repeating-radial-gradient(circle at 50% 30%, transparent 0 16px, rgba(255,255,255,0.1) 16px 17px)",
              }}
            />
            <div ref={textRef} className="relative z-10 flex flex-col gap-1 will-change-transform">
              <span className="font-extrabold text-5xl sm:text-6xl tracking-tight leading-none text-white">
                {title}
              </span>
              <span className="text-xs sm:text-sm font-medium text-white/80 max-w-[18ch] leading-relaxed">
                {subtitle}
              </span>
            </div>
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "linear-gradient(115deg,#ff3d7f 0%,#ffb13d 14%,#f6ff3d 28%,#3dff9a 42%,#3dc7ff 57%,#7a3dff 71%,#ff3d7f 85%,#ffb13d 100%)",
              backgroundSize: "300% 300%",
              backgroundPosition: "calc(var(--mx, 50) * 1%) calc(var(--my, 50) * 1%)",
              mixBlendMode: "color-dodge",
              opacity: "calc(var(--foil, 1) * 0.5)",
              filter: "hue-rotate(var(--hue, 0deg)) saturate(1.4)",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "conic-gradient(from calc(var(--mx, 50) * 3.6deg) at calc(var(--mx, 50) * 1%) calc(var(--my, 50) * 1%), #ff3d7f, #7a3dff, #3dc7ff, #3dff9a, #f6ff3d, #ff3d7f)",
              mixBlendMode: "overlay",
              opacity: "calc(var(--foil, 1) * 0.45)",
              filter: "hue-rotate(var(--hue, 0deg))",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "radial-gradient(circle, #fff 0 0.7px, transparent 1.8px) calc(var(--mx, 50) * 0.5px) calc(var(--my, 50) * 0.5px) / 29px 33px, radial-gradient(circle, #fff 0 0.7px, transparent 1.8px) calc(13px - var(--mx, 50) * 0.3px) calc(9px - var(--my, 50) * 0.3px) / 19px 23px",
              mixBlendMode: "color-dodge",
              filter: "brightness(1.6)",
              opacity: "calc(var(--sp, 1) * (0.2 + var(--d, 0) * 0.9))",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "radial-gradient(circle at calc(var(--mx, 50) * 1%) calc(var(--my, 50) * 1%), rgba(255, 255, 255, var(--gl, 0.7)), transparent 55%)",
              mixBlendMode: "soft-light",
            }}
          />
        </div>

        {showGyroBtn && (
          <button
            type="button"
            onClick={enableMotion}
            className="absolute bottom-4 px-4 py-2 rounded-full bg-white text-black text-xs font-semibold shadow-md z-20 hover:opacity-90"
          >
            Enable Motion
          </button>
        )}
      </div>
    );
  }
);

HoloFoil.displayName = "HoloFoil";
`
};

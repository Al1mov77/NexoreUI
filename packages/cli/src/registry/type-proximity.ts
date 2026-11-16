export const typeProximity = {
  name: "type-proximity",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "type-proximity.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { cn } from "../utils/cn";

export interface TypeProximityProps extends React.HTMLAttributes<HTMLDivElement> {
  rad?: number;
  wmin?: number;
  wmax?: number;
  dmin?: number;
  dmax?: number;
  fall?: number;
  size?: number;
  ease?: number;
  idle?: number;
  hue?: number;
  tint?: string;
  bg?: string;
  ink?: string;
  lines?: string[];
  paused?: boolean;
}

function parseHex(h: string): [number, number, number] {
  const c = h.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const DEFAULT_LINES = ["Weight", "follows", "your touch"];

export const TypeProximity = React.forwardRef<HTMLDivElement, TypeProximityProps>(
  function TypeProximity(
    {
      rad = 240,
      wmin = 200,
      wmax = 850,
      dmin = 75,
      dmax = 100,
      fall = 1.6,
      size = 11,
      ease = 0.22,
      idle = 0.7,
      hue = 0.85,
      tint = "#ff4a2b",
      bg = "#e8eaee",
      ink = "#0d0e12",
      lines = DEFAULT_LINES,
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const spansRef = useRef<Map<number, HTMLSpanElement>>(new Map());
    const stateV = useRef<number[]>([]);
    const pointerRef = useRef<{ x: number; y: number; t: number }>({ x: -1e4, y: -1e4, t: -1e9 });
    const isVisibleRef = useRef<boolean>(true);
    const [reducedMotion, setReducedMotion] = useState(false);

    const totalChars = useMemo(() => {
      let count = 0;
      for (const line of lines) {
        for (const word of line.split(" ")) {
          count += word.length;
        }
      }
      return count;
    }, [lines]);

    useEffect(() => {
      stateV.current = new Array(totalChars).fill(0);
    }, [totalChars]);

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
      const el = rootRef.current;
      if (!el) return;

      const onPointerMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          t: performance.now(),
        };
      };

      const onPointerLeave = () => {
        pointerRef.current = { x: -1e4, y: -1e4, t: -1e9 };
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
          const el = rootRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const t = ms / 1000;
            const isPointerActive = performance.now() - pointerRef.current.t < 2500;

            let px = pointerRef.current.x;
            let py = pointerRef.current.y;

            if (!isPointerActive) {
              if (idle > 0 && !reducedMotion && w > 0 && h > 0) {
                px = w * (0.5 + 0.46 * Math.sin(t * 0.55 * idle));
                py = h * (0.5 + 0.3 * Math.sin(t * 0.8 * idle + 1));
              } else {
                px = -1e4;
                py = -1e4;
              }
            }

            const inkRgb = parseHex(ink);
            const tintRgb = parseHex(tint);
            const map = spansRef.current;
            const sizeMap = map.size;

            const rects: (DOMRect | null)[] = new Array(sizeMap);
            for (let i = 0; i < sizeMap; i++) {
              const span = map.get(i);
              rects[i] = span ? span.getBoundingClientRect() : null;
            }

            const vArr = stateV.current;
            for (let i = 0; i < sizeMap; i++) {
              const span = map.get(i);
              const r = rects[i];
              if (!span || !r) continue;

              const spanX = r.left - rect.left + r.width / 2;
              const spanY = r.top - rect.top + r.height / 2;
              const d = Math.hypot(px - spanX, py - spanY);
              const clamped = Math.min(1, Math.max(0, 1 - d / rad));
              const k = Math.pow(clamped, fall);

              const curV = (vArr[i] ?? 0) + (k - (vArr[i] ?? 0)) * ease;
              vArr[i] = curV;
              const m = curV * hue;

              const weight = Math.round(wmin + (wmax - wmin) * curV);
              const width = Math.round(dmin + (dmax - dmin) * curV);
              span.style.fontVariationSettings = \`"wght" \${weight}, "wdth" \${width}\`;

              const cr = Math.round(inkRgb[0] + (tintRgb[0] - inkRgb[0]) * m);
              const cg = Math.round(inkRgb[1] + (tintRgb[1] - inkRgb[1]) * m);
              const cb = Math.round(inkRgb[2] + (tintRgb[2] - inkRgb[2]) * m);
              span.style.color = \`rgb(\${cr},\${cg},\${cb})\`;
            }
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }, [paused, reducedMotion, rad, wmin, wmax, dmin, dmax, fall, ease, idle, hue, ink, tint]);

    let charGlobalIndex = 0;

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("relative flex flex-col justify-center select-none overflow-hidden touch-none", className)}
        style={{
          backgroundColor: bg,
          fontSize: \`\${size}vw\`,
          lineHeight: 0.92,
          letterSpacing: "-0.04em",
          ...style,
        }}
        {...rest}
      >
        <div className="flex flex-col justify-center px-[5vw]">
          {lines.map((lineText, lineIdx) => {
            const words = lineText.split(" ");
            return (
              <div key={lineIdx} className="whitespace-nowrap">
                {words.map((word, wordIdx) => {
                  const chars = Array.from(word);
                  return (
                    <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.22em]">
                      {chars.map((char) => {
                        const idx = charGlobalIndex++;
                        return (
                          <span
                            key={idx}
                            ref={(el) => {
                              if (el) spansRef.current.set(idx, el);
                              else spansRef.current.delete(idx);
                            }}
                            className="inline-block"
                          >
                            {char}
                          </span>
                        );
                      })}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

TypeProximity.displayName = "TypeProximity";
`
};

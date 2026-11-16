"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { cn } from "../utils/cn";

export interface TextRailProps extends React.HTMLAttributes<HTMLDivElement> {
  amp?: number;
  freq?: number;
  size?: number;
  speed?: number;
  gain?: number;
  bend?: number;
  rails?: number;
  gap?: number;
  outline?: number;
  line?: number;
  rot?: number;
  skew?: number;
  drift?: number;
  inertia?: number;
  vgain?: number;
  bg?: string;
  ink?: string;
  c2?: string;
  text?: string;
  captureWheel?: boolean;
  autoScroll?: boolean;
  autoSpeed?: number;
  scrollProgress?: number;
  paused?: boolean;
}

function rectPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    d += `C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export const TextRail = React.forwardRef<HTMLDivElement, TextRailProps>(
  function TextRail(
    {
      amp = 0.16,
      freq = 1.6,
      size = 0.2,
      speed = 0.2,
      gain = 1.2,
      bend = 1.2,
      rails = 3,
      gap = 0.28,
      outline = 0.55,
      line = 0.25,
      rot = -8,
      skew = 1,
      drift = 0.5,
      inertia = 0.12,
      vgain = 1,
      bg = "#101014",
      ink = "#f2efe8",
      c2 = "#ff4a2b",
      text = "Scroll · Motion · Rhythm · ",
      captureWheel = false,
      autoScroll = false,
      autoSpeed = 1,
      scrollProgress,
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const groupRef = useRef<SVGGElement | null>(null);
    const pathsRef = useRef<(SVGPathElement | null)[]>([]);
    const textsRef = useRef<(SVGTextElement | null)[]>([]);
    const textPathsRef = useRef<(SVGTextPathElement | null)[]>([]);
    const isVisibleRef = useRef<boolean>(true);

    const uid = useId().replace(/:/g, "");
    const [dims, setDims] = useState<{ w: number; h: number }>({ w: 800, h: 600 });

    const scrollState = useRef<{
      virtualScroll: number;
      sm: number;
      sv: number;
      vs: number;
      ph: number;
      unit: number;
      cachedFontSize: number;
    }>({
      virtualScroll: 0,
      sm: 0,
      sv: 0,
      vs: 0,
      ph: 0,
      unit: 800,
      cachedFontSize: 0,
    });

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

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            setDims({ w: width, h: height });
            scrollState.current.cachedFontSize = 0;
          }
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    useEffect(() => {
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(() => {
          scrollState.current.cachedFontSize = 0;
        });
      }
    }, []);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;

      const onWheel = (e: WheelEvent) => {
        if (!captureWheel) return;
        e.preventDefault();
        scrollState.current.virtualScroll += e.deltaY;
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }, [captureWheel]);

    useEffect(() => {
      let lastTime = performance.now();
      let rafId = 0;

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const dt = Math.min((ms - lastTime) / 1000, 0.05) || 0.016;
          lastTime = ms;
          const t = ms / 1000;
          const { w, h } = dims;

          if (w > 0 && h > 0) {
            const st = scrollState.current;
            const nRails = Math.min(4, Math.max(1, Math.round(rails)));
            const fs = size * h;

            if (autoScroll) {
              st.virtualScroll += dt * autoSpeed * 200;
            }

            let effectiveScroll = st.virtualScroll;
            if (scrollProgress !== undefined) {
              effectiveScroll = scrollProgress * h * 4;
            }

            st.sm += (effectiveScroll - st.sm) * inertia;
            const v = (st.sm - st.sv) / h / Math.max(dt, 0.004);
            st.sv = st.sm;
            st.vs += (Math.min(2, Math.max(-2, v * 0.25 * vgain)) - st.vs) * 0.12;

            if (st.cachedFontSize !== fs) {
              textsRef.current.forEach((txt) => {
                if (txt) txt.style.fontSize = `${fs}px`;
              });
              const firstTp = textPathsRef.current[0];
              if (firstTp) {
                try {
                  st.unit = firstTp.getComputedTextLength() / 6 || 800;
                } catch {
                  st.unit = 800;
                }
              }
              st.cachedFontSize = fs;
            }

            st.ph += dt * (drift + st.vs * bend * 2);
            const amplitude = amp * h * (1 + bend * Math.abs(st.vs));
            const base = st.sm * gain + t * speed * 120;
            const u = st.unit > 0 ? st.unit : 800;

            if (groupRef.current) {
              groupRef.current.setAttribute(
                "transform",
                `rotate(${rot + st.vs * skew * 4} ${w / 2} ${h / 2})`
              );
            }

            for (let i = 0; i < 4; i++) {
              const pathEl = pathsRef.current[i];
              const textEl = textsRef.current[i];
              const tpEl = textPathsRef.current[i];
              const on = i < nRails;

              if (pathEl) pathEl.style.display = on ? "" : "none";
              if (textEl) textEl.style.display = on ? "" : "none";
              if (!on || !pathEl || !textEl || !tpEl) continue;

              const cy = h / 2 + (i - (nRails - 1) / 2) * gap * h;
              const pts: [number, number][] = [];
              for (let k = 0; k < 9; k++) {
                pts.push([
                  -w * 0.25 + (k * w * 1.5) / 8,
                  cy + Math.sin(k * freq * 0.8 + st.ph + i * 0.9) * amplitude,
                ]);
              }

              pathEl.setAttribute("d", rectPath(pts));
              pathEl.setAttribute("stroke", ink);
              pathEl.setAttribute("stroke-opacity", String(line));

              const dir = i % 2 ? -1 : 1;
              const sh = (((base * dir) % u) + u) % u;
              tpEl.setAttribute("startOffset", `${sh - u}`);

              if (i % 2) {
                textEl.setAttribute("fill", c2);
                textEl.setAttribute("fill-opacity", String(1 - outline));
                textEl.setAttribute("stroke", c2);
                textEl.setAttribute("stroke-width", `${fs * 0.012}`);
              } else {
                textEl.setAttribute("fill", ink);
                textEl.setAttribute("fill-opacity", "1");
                textEl.removeAttribute("stroke");
              }
            }
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }, [paused, dims, autoScroll, autoSpeed, scrollProgress, rails, size, inertia, vgain, drift, bend, amp, gain, speed, rot, skew, gap, freq, ink, line, c2, outline]);

    const repeatedText = text.repeat(6);

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("relative w-full h-full overflow-hidden select-none touch-none", className)}
        style={{ backgroundColor: bg, ...style }}
        {...rest}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <g ref={groupRef}>
            {[0, 1, 2, 3].map((i) => {
              const pathId = `rail-path-${uid}-${i}`;
              return (
                <React.Fragment key={i}>
                  <path
                    id={pathId}
                    ref={(el) => {
                      pathsRef.current[i] = el;
                    }}
                    fill="none"
                  />
                  <text
                    ref={(el) => {
                      textsRef.current[i] = el;
                    }}
                    style={{
                      fontFamily: '"Bricolage Grotesque", "Schibsted Grotesk", sans-serif',
                      fontWeight: 800,
                      fontVariationSettings: '"wdth" 80',
                      letterSpacing: "-0.03em",
                    }}
                  >
                    <textPath
                      ref={(el) => {
                        textPathsRef.current[i] = el;
                      }}
                      href={`#${pathId}`}
                    >
                      {repeatedText}
                    </textPath>
                  </text>
                </React.Fragment>
              );
            })}
          </g>
        </svg>
      </div>
    );
  }
);

TextRail.displayName = "TextRail";

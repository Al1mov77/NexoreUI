export const scrollReveal = {
  name: "scroll-reveal",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "scroll-reveal.tsx",
  content: `"use client";

import React, { useEffect, useState } from "react";
import { cn } from "../utils/cn";

export interface RevealItem {
  word: string;
  bg: string;
  fg: string;
}

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  rot?: number;
  sc?: number;
  bl?: number;
  rad?: number;
  stag?: number;
  sh?: number;
  lr?: number;
  items?: RevealItem[];
}

const DEFAULT_ITEMS: RevealItem[] = [
  { word: "Slow", bg: "#ff4a2b", fg: "#101014" },
  { word: "Down", bg: "#101014", fg: "#f2efe8" },
  { word: "Then", bg: "#2d4bff", fg: "#ffe14a" },
  { word: "Look", bg: "#f2efe8", fg: "#101014" },
  { word: "Again", bg: "#ffe14a", fg: "#101014" },
];

export const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  function ScrollReveal(
    {
      rot = -6,
      sc = 0.78,
      bl = 8,
      rad = 48,
      stag = 5,
      sh = 60,
      lr = 8,
      items = DEFAULT_ITEMS,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const [supported, setSupported] = useState<boolean>(true);

    useEffect(() => {
      if (typeof CSS !== "undefined" && typeof CSS.supports === "function") {
        setSupported(CSS.supports("animation-timeline", "view()"));
      }
    }, []);

    const cssVars = {
      "--rot": String(rot),
      "--sc": String(sc),
      "--bl": String(bl),
      "--rad": String(rad),
      "--stag": String(stag),
      "--sh": String(sh),
      "--lr": String(lr),
      scrollTimeline: "--rv block",
    } as React.CSSProperties;

    return (
      <div
        ref={forwardedRef}
        className={cn(
          "relative w-full h-full overflow-y-auto scrollbar-none [touch-action:pan-y] select-none",
          className
        )}
        style={{ ...cssVars, ...style }}
        {...rest}
      >
        <style>{\`
          @keyframes rvin {
            from {
              scale: var(--sc, 0.78);
              rotate: calc(var(--rot, -6) * 1deg);
              filter: blur(calc(var(--bl, 8) * 1px));
            }
            to {
              scale: 1;
              rotate: 0deg;
              filter: blur(0);
            }
          }
          @keyframes rvl {
            from {
              translate: 0 calc(var(--sh, 60) * 1vh);
              rotate: calc(var(--lr, 8) * 1deg);
              opacity: 0;
            }
            to {
              translate: 0 0;
              rotate: 0deg;
              opacity: 1;
            }
          }
          @keyframes rvbar {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          .sr-bar {
            position: sticky;
            top: 0;
            height: 3px;
            background: #fff;
            mix-blend-mode: difference;
            transform-origin: 0 50%;
            z-index: 10;
            animation: rvbar linear both;
            animation-timeline: --rv;
          }
          .sr-panel {
            position: absolute;
            inset: 3vw;
            border-radius: calc(var(--rad, 48) * 1px);
            animation: rvin linear both;
            animation-timeline: view();
            animation-range: entry 0% cover 38%;
          }
          .sr-word i {
            font-style: normal;
            display: inline-block;
            animation: rvl linear both;
            animation-timeline: view();
            animation-range: entry calc(8% + var(--i) * var(--stag, 5) * 1%) entry calc(70% + var(--i) * var(--stag, 5) * 1%);
          }
          @supports not (animation-timeline: view()) {
            .sr-panel, .sr-word i, .sr-bar {
              animation: none !important;
            }
          }
        \`}</style>

        <div className="sr-bar" />

        {!supported && (
          <div className="sticky top-12 mx-auto max-w-sm rounded-lg bg-black/80 border border-white/20 p-3 text-center text-xs text-white/80 z-20">
            Scroll-driven animations require a modern browser (Chrome 115+, Edge 115+, Safari 26+).
          </div>
        )}

        {items.map((item, idx) => (
          <section
            key={idx}
            className="relative h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden"
          >
            <div className="sr-panel" style={{ backgroundColor: item.bg }} />
            <div
              className="sr-word relative flex font-extrabold tracking-tight leading-none"
              style={{
                color: item.fg,
                fontSize: "clamp(3.5rem, 20vw, 12rem)",
                fontVariationSettings: '"wdth" 75',
                letterSpacing: "-0.05em",
              }}
            >
              {Array.from(item.word).map((char, charIdx) => (
                <i
                  key={charIdx}
                  style={{ "--i": charIdx } as React.CSSProperties}
                >
                  {char}
                </i>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }
);

ScrollReveal.displayName = "ScrollReveal";
`
};

"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { TEMPLATES, TemplateItem } from "../../../data/templates";
import { MarqueeColumn } from "./MarqueeColumn";

const LIGHT_TONE_SLUGS = new Set<string>([
  "capy-spa",
  "burlit-coffee",
  "flip-skate",
  "bear-lift",
  "panda-bakery",
  "ironpaw-tools",
  "pull-noodle",
  "vapor-obsidian-atelier",
  "nexstore-ecommerce-pro",
  "zenith-botanical-elixir",
  "amarena-royale-patisserie",
  "aura-obsidian-botanica",
  "monolith-obsidian-cacao",
  "aura-nocturne-parfum",
  "levitas-cryo-atelier",
  "nexcore-admin-pro",
]);

const COLUMN_CONFIGS = [
  {
    direction: "up" as const,
    duration: 36,
    focusClass: "md:scale-90 opacity-90 md:opacity-90",
    visibilityClass: "block",
  },
  {
    direction: "down" as const,
    duration: 42,
    focusClass: "md:scale-95 opacity-95 md:opacity-95",
    visibilityClass: "block",
  },
  {
    direction: "up" as const,
    duration: 48,
    focusClass: "md:scale-[0.98] opacity-100 md:opacity-100",
    visibilityClass: "hidden md:block",
  },
  {
    direction: "down" as const,
    duration: 52,
    focusClass: "md:scale-100 opacity-100 md:opacity-100",
    visibilityClass: "hidden md:block",
  },
  {
    direction: "up" as const,
    duration: 49,
    focusClass: "md:scale-[0.98] opacity-100 md:opacity-100",
    visibilityClass: "hidden md:block",
  },
  {
    direction: "down" as const,
    duration: 43,
    focusClass: "md:scale-95 opacity-95 md:opacity-95",
    visibilityClass: "hidden md:block",
  },
  {
    direction: "up" as const,
    duration: 37,
    focusClass: "md:scale-90 opacity-90 md:opacity-90",
    visibilityClass: "hidden md:block",
  },
] as const;

function buildSevenBalancedColumns(items: readonly TemplateItem[]): TemplateItem[][] {
  const lightPool: TemplateItem[] = [];
  const darkPool: TemplateItem[] = [];

  for (const item of items) {
    if (LIGHT_TONE_SLUGS.has(item.slug)) {
      lightPool.push(item);
    } else {
      darkPool.push(item);
    }
  }

  const columnCount = 7;
  const itemsPerColumn = 8;
  const columns: TemplateItem[][] = Array.from({ length: columnCount }, () => []);

  for (let col = 0; col < columnCount; col++) {
    const startWithLight = col % 2 === 0;
    for (let pair = 0; pair < itemsPerColumn / 2; pair++) {
      const lIdx = (col * 2 + pair * 3) % lightPool.length;
      const dIdx = (col * 2 + pair * 3) % darkPool.length;

      if (startWithLight) {
        columns[col].push(lightPool[lIdx]);
        columns[col].push(darkPool[dIdx]);
      } else {
        columns[col].push(darkPool[dIdx]);
        columns[col].push(lightPool[lIdx]);
      }
    }
  }

  return columns;
}

export function TemplatesMarquee() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [tiltMode, setTiltMode] = useState<"angled" | "symmetric">("angled");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("tilt") === "symmetric") {
      setTiltMode("symmetric");
    } else if (params.get("tilt") === "angled") {
      setTiltMode("angled");
    }
  }, []);

  const columns = useMemo(() => buildSevenBalancedColumns(TEMPLATES), []);

  const planeTransformClass =
    tiltMode === "symmetric"
      ? "md:[transform:translate3d(-50%,-50%,0)_rotateX(24deg)]"
      : "md:[transform:translate3d(-50%,-50%,0)_rotateX(22deg)_rotateY(0deg)_rotateZ(-4deg)]";

  return (
    <div className="relative z-10 flex w-full flex-col items-center select-none">
      <div className="relative left-1/2 -translate-x-1/2 h-[540px] sm:h-[640px] lg:h-[720px] w-screen max-w-[100vw] overflow-hidden">
        <div
          className="h-full w-full"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        >
          <div
            className="relative h-full w-full md:[perspective:1800px]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 78%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 78%, transparent 100%)",
            }}
          >
            <div
              className={`h-full w-full px-3 sm:px-6 md:px-0 ${
                prefersReducedMotion
                  ? "md:mx-auto md:w-full"
                  : `md:absolute md:top-1/2 md:left-1/2 md:h-[155%] md:w-[140%] md:origin-center ${planeTransformClass} md:[transform-style:preserve-3d]`
              }`}
            >
              <div className="grid grid-cols-2 md:flex md:justify-center gap-4 h-full w-full">
                {COLUMN_CONFIGS.map((cfg, colIdx) => (
                  <MarqueeColumn
                    key={`marquee-col-${colIdx}`}
                    templates={columns[colIdx] || []}
                    direction={cfg.direction}
                    duration={cfg.duration}
                    columnIndex={colIdx}
                    reducedMotion={prefersReducedMotion}
                    focusClass={cfg.focusClass}
                    visibilityClass={cfg.visibilityClass}
                  />
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background via-background/60 to-transparent z-20" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/60 to-transparent z-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

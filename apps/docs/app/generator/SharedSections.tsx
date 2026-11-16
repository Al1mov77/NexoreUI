"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Info } from "lucide-react";
import { ScoredAsset, ValidatedMetric } from "../../lib/generator/schema";

export function XRayScoreBadge({
  scored,
  show,
  accent,
  accentFg,
  labelPrefix = "Score",
}: {
  scored: ScoredAsset;
  show: boolean;
  accent: string;
  accentFg: string;
  labelPrefix?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!show) return null;

  return (
    <div className="absolute top-3 left-3 z-30 max-w-[280px]">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((prev) => !prev);
        }}
        style={{ backgroundColor: "rgba(16, 16, 16, 0.92)", borderColor: accent }}
        className="flex items-center gap-2 rounded border px-2.5 py-1 text-left text-xs text-white backdrop-blur-md shadow-xs cursor-pointer"
      >
        <span
          style={{ backgroundColor: accent, color: accentFg }}
          className="rounded px-1.5 py-0.5 font-mono font-semibold tabular-nums"
        >
          {scored.score.total}
        </span>
        <span className="truncate">
          {labelPrefix}: {scored.asset.shotScale}
        </span>
        <Info className="h-3 w-3 shrink-0 opacity-75" />
      </button>

      {expanded && (
        <div
          style={{ backgroundColor: "rgba(16, 16, 16, 0.95)", borderColor: accent }}
          className="mt-1.5 rounded border p-3 text-xs text-white/90 space-y-1 backdrop-blur-md shadow-md"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1 font-semibold text-white">
            <span>Why selected</span>
            <span>{scored.asset.negativeSpace}</span>
          </div>
          {scored.score.reasons.map((r) => (
            <div key={r} className="leading-snug text-neutral-300">
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AnimatedCountUpMetric({
  metric,
  bodyFont,
  monoFont,
  fg,
  muted,
}: {
  metric: ValidatedMetric;
  bodyFont: string;
  monoFont: string;
  fg: string;
  muted: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const [currentVal, setCurrentVal] = useState<number>(
    prefersReducedMotion ? metric.numericValue : 0
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentVal(metric.numericValue);
      return;
    }
    if (!isInView) return;

    let frameId: number;
    const duration = 950;
    const startTime = performance.now();
    const target = metric.numericValue;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrentVal(target * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, metric.numericValue, prefersReducedMotion]);

  const formatted =
    metric.kind === "acceleration"
      ? `${currentVal.toFixed(2)} ${metric.unit}`
      : metric.kind === "price"
      ? `$${Math.round(currentVal).toLocaleString("en-US")}`
      : `${Math.round(currentVal).toLocaleString("en-US")} ${metric.unit}`;

  return (
    <div ref={containerRef} style={{ fontFamily: bodyFont }}>
      <span style={{ color: muted }} className="text-xs font-medium block">
        {metric.label}
      </span>
      <p
        style={{ fontFamily: monoFont, color: fg }}
        className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums"
      >
        {formatted}
      </p>
      <span style={{ color: muted }} className="mt-1 text-xs block opacity-85">
        {metric.contextNote}
      </span>
    </div>
  );
}

export function MaskedHeadline({
  text,
  displayFont,
  duration,
  ease,
  className,
}: {
  text: string;
  displayFont: string;
  duration: number;
  ease: readonly [number, number, number, number];
  className: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const safeText = text.replace(
    /([A-Za-zÜüÖöÄä0-9])-([A-Za-zÜüÖöÄä0-9])/g,
    "$1\u2011$2"
  );
  const words = safeText.split(/\s+/).filter(Boolean);

  if (prefersReducedMotion) {
    return (
      <h1
        style={{
          fontFamily: displayFont,
          hyphens: "none",
          wordBreak: "keep-all",
          overflowWrap: "normal",
        }}
        className={className}
      >
        {safeText}
      </h1>
    );
  }

  return (
    <h1
      style={{
        fontFamily: displayFont,
        hyphens: "none",
        wordBreak: "keep-all",
        overflowWrap: "normal",
      }}
      className={`${className} flex flex-wrap gap-x-[0.26em] gap-y-1`}
    >
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="overflow-hidden inline-block py-0.5 whitespace-nowrap"
        >
          <motion.span
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration,
              delay: idx * 0.04,
              ease: [ease[0], ease[1], ease[2], ease[3]],
            }}
            className="inline-block whitespace-nowrap"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

interface TelemetryMetric {
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
  readonly caption: string;
}

const fmt = (v: number) =>
  String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function AnimatedCounter({
  target,
  suffix = "",
  inView,
}: {
  target: number;
  suffix?: string;
  inView: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const prefersReduced = Boolean(useReducedMotion());

  const animate = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);

    if (prefersReduced) {
      el.textContent = fmt(target);
      return;
    }

    let start: number | null = null;
    const duration = 1600;

    const step = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = fmt(target * ease);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        el.textContent = fmt(target);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [target, prefersReduced]);

  useEffect(() => {
    if (!inView) return;
    animate();
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, animate]);

  return (
    <span className="tabular-nums font-bold text-foreground">
      <span ref={ref}>{fmt(target)}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [cliDownloads, setCliDownloads] = useState(2236);
  const [libDownloads, setLibDownloads] = useState(2865);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch("https://api.npmjs.org/downloads/point/last-year/nexoreui")
        .then((r) => r.json())
        .catch(() => null),
      fetch("https://api.npmjs.org/downloads/point/last-year/nexoreui-cli")
        .then((r) => r.json())
        .catch(() => null),
    ])
      .then(([d1, d2]) => {
        if (!mounted) return;
        if (d1?.downloads && typeof d1.downloads === "number") {
          setLibDownloads(d1.downloads);
        }
        if (d2?.downloads && typeof d2.downloads === "number") {
          setCliDownloads(d2.downloads);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const totalDownloads = libDownloads + cliDownloads;

  const metrics: readonly TelemetryMetric[] = [
    {
      value: totalDownloads,
      suffix: "+",
      label: "npm downloads",
      caption: "Combined library & CLI total",
    },
    {
      value: 60,
      suffix: "+",
      label: "UI components",
      caption: "Primitives, dialogs, bento & dock",
    },
    {
      value: 350,
      suffix: "+",
      label: "Component variants",
      caption: "States, interactive sizes & styles",
    },
    {
      value: 100,
      suffix: "%",
      label: "TypeScript strict",
      caption: "Full type safety with zero any",
    },
  ];

  return (
    <section
      id="telemetry"
      ref={sectionRef}
      className="py-20 sm:py-28 px-4 sm:px-6 border-b border-border/60 bg-muted/10 transition-colors"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-3 max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground block">
            Telemetry &amp; Scale
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.035em] text-foreground leading-[1.08] text-balance">
            Production telemetry &amp; ecosystem scale
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Real telemetry verified across the npm registry and codebase. Uninflated numbers and open distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/80 rounded-2xl overflow-hidden border border-border/80 shadow-xs">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-card p-6 sm:p-7 flex flex-col justify-between gap-4"
            >
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                <AnimatedCounter
                  target={m.value}
                  suffix={m.suffix}
                  inView={inView}
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-foreground block">
                  {m.label}
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {m.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;

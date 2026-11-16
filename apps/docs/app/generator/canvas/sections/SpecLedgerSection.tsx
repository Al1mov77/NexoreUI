"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { ValidatedMetric } from "../../../../lib/generator/schema";
import { AnimatedCountUpMetric } from "../../SharedSections";
import {
  getTransitionSpec,
  SectionComponentProps,
  TrimLiveState,
} from "../canvas-types";
import { SectionShell, SectionTitleRow } from "./SectionShell";

function applyTrimToMetric(
  metric: ValidatedMetric,
  trimState: TrimLiveState | null | undefined,
  isBakery: boolean
): ValidatedMetric {
  if (!trimState || isBakery) return metric;

  if (metric.kind === "price") {
    const nextVal = Math.max(0, metric.numericValue + trimState.priceDelta);
    return {
      ...metric,
      numericValue: nextVal,
      displayValue: `$${nextVal.toLocaleString()}`,
      contextNote: trimState.buildCode
        ? `${metric.contextNote} (${trimState.buildCode})`
        : metric.contextNote,
    };
  }
  if (metric.kind === "acceleration") {
    const nextVal = Number(
      Math.max(1.2, metric.numericValue + trimState.accelDeltaSec).toFixed(2)
    );
    return {
      ...metric,
      numericValue: nextVal,
      displayValue: `${nextVal.toFixed(2)} s`,
    };
  }
  if (metric.kind === "downforce") {
    const nextVal = Math.max(0, metric.numericValue + trimState.downforceDeltaKg);
    return {
      ...metric,
      numericValue: nextVal,
      displayValue: `${nextVal.toLocaleString()} kg`,
    };
  }
  if (metric.kind === "range") {
    const nextVal = Math.max(120, metric.numericValue + trimState.rangeDeltaKm);
    return {
      ...metric,
      numericValue: nextVal,
      displayValue: `${nextVal.toLocaleString()} km`,
    };
  }
  if (metric.kind === "mass-delta") {
    const nextVal = metric.numericValue + trimState.massDeltaKg;
    return {
      ...metric,
      numericValue: nextVal,
      displayValue: `${nextVal > 0 ? `+${nextVal}` : nextVal} kg`,
    };
  }
  return metric;
}

function formatConvertedMetric(
  metric: ValidatedMetric,
  imperial: boolean
): ValidatedMetric {
  if (!imperial) return metric;
  if (metric.unit === "km") {
    const val = Math.round(metric.numericValue * 0.621371);
    return {
      ...metric,
      numericValue: val,
      unit: "mi",
      displayValue: `${val.toLocaleString()} mi`,
    };
  }
  if (metric.unit === "km/h") {
    const val = Math.round(metric.numericValue * 0.621371);
    return {
      ...metric,
      numericValue: val,
      unit: "mph",
      displayValue: `${val.toLocaleString()} mph`,
    };
  }
  if (metric.unit === "kg") {
    const val = Math.round(metric.numericValue * 2.20462);
    return {
      ...metric,
      numericValue: val,
      unit: "lb",
      displayValue: `${val.toLocaleString()} lb`,
    };
  }
  return metric;
}

export function SpecLedgerSection({
  section,
  payload,
  pal,
  reducedMotion,
  isBakery,
  trimState,
}: SectionComponentProps) {
  const { tokens, validatedMetrics } = payload;
  const [imperial, setImperial] = useState(false);

  const metrics = validatedMetrics
    .slice(0, 4)
    .map((m) => applyTrimToMetric(m, trimState, isBakery))
    .map((m) => formatConvertedMetric(m, !isBakery && imperial));

  const unitSwitch =
    !isBakery &&
    (tokens.archetype === "track" || tokens.archetype === "showroom") ? (
      <div
        style={{
          borderColor: pal.border,
          backgroundColor: pal.surface,
          borderRadius: tokens.buttonRadius,
        }}
        className="inline-flex border p-1 self-start shrink-0"
      >
        {(["Metric", "Imperial"] as const).map((unitLabel) => {
          const isImp = unitLabel === "Imperial";
          const selected = imperial === isImp;
          return (
            <button
              key={unitLabel}
              type="button"
              aria-pressed={selected}
              onClick={() => setImperial(isImp)}
              style={{
                color: selected ? pal.accentFg : pal.fg,
                borderRadius: tokens.buttonRadius,
              }}
              className="relative px-3 py-1.5 text-xs font-medium min-h-[32px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {selected && (
                <motion.span
                  layoutId={reducedMotion ? undefined : "spec-unit-pill"}
                  transition={getTransitionSpec(tokens, reducedMotion)}
                  style={{
                    backgroundColor: pal.accent,
                    borderRadius: tokens.buttonRadius,
                  }}
                  className="absolute inset-0"
                />
              )}
              <span className="relative z-10">{unitLabel}</span>
            </button>
          );
        })}
      </div>
    ) : null;

  if (tokens.archetype === "monolith") {
    return (
      <SectionShell
        id={section.kind}
        tokens={tokens}
        pal={pal}
        reducedMotion={reducedMotion}
      >
        <div className="space-y-10">
          <SectionTitleRow section={section} tokens={tokens} pal={pal} />
          <div
            style={{ borderColor: pal.border }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l"
          >
            {metrics.map((m) => (
              <div
                key={m.id}
                style={{ borderColor: pal.border, backgroundColor: pal.surface }}
                className="border-r border-b p-7"
              >
                <AnimatedCountUpMetric
                  metric={m}
                  bodyFont={tokens.fontPair.bodyFamily}
                  monoFont={tokens.fontPair.monoFamily}
                  fg={pal.fg}
                  muted={pal.muted}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    );
  }

  if (tokens.archetype === "track") {
    return (
      <SectionShell
        id={section.kind}
        tokens={tokens}
        pal={pal}
        reducedMotion={reducedMotion}
      >
        <div className="space-y-8">
          <SectionTitleRow
            section={section}
            tokens={tokens}
            pal={pal}
            rightSlot={unitSwitch}
          />
          <div className="grid gap-3 md:grid-cols-2">
            {metrics.map((m) => (
              <div
                key={m.id}
                style={{
                  borderColor: pal.border,
                  backgroundColor: pal.surface,
                  borderRadius: tokens.cardRadius,
                }}
                className="border p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <div style={{ color: pal.fg }} className="text-sm font-semibold">
                    {m.label}
                  </div>
                  <div style={{ color: pal.muted }} className="text-xs">
                    {m.contextNote}
                  </div>
                </div>
                <span
                  style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                  className="text-2xl font-semibold tabular-nums shrink-0"
                >
                  {m.displayValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    );
  }

  if (tokens.archetype === "editorial") {
    return (
      <SectionShell
        id={section.kind}
        tokens={tokens}
        pal={pal}
        reducedMotion={reducedMotion}
      >
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-3">
            <h2
              style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
              className="text-2xl sm:text-3xl font-semibold tracking-tight"
            >
              {section.title}
            </h2>
            <p
              style={{ color: pal.muted }}
              className="text-sm sm:text-base leading-relaxed"
            >
              {section.subtitle}
            </p>
          </div>
          <div
            style={{ borderColor: pal.border }}
            className="lg:col-span-8 border-t divide-y"
          >
            {metrics.map((m) => (
              <div
                key={m.id}
                style={{ borderColor: pal.border }}
                className="py-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2"
              >
                <div>
                  <span style={{ color: pal.fg }} className="text-base font-medium">
                    {m.label}
                  </span>
                  <span
                    style={{ color: pal.muted }}
                    className="text-xs sm:ml-3 block sm:inline"
                  >
                    {m.contextNote}
                  </span>
                </div>
                <span
                  style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                  className="text-2xl font-semibold tabular-nums shrink-0"
                >
                  {m.displayValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id={section.kind}
      tokens={tokens}
      pal={pal}
      reducedMotion={reducedMotion}
    >
      <div className="space-y-8">
        <SectionTitleRow
          section={section}
          tokens={tokens}
          pal={pal}
          rightSlot={unitSwitch}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {metrics.map((m) => (
            <div
              key={m.id}
              style={{
                borderColor: pal.border,
                backgroundColor: pal.surface,
                borderRadius: tokens.cardRadius,
              }}
              className="border p-6 space-y-1.5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span style={{ color: pal.muted }} className="text-xs font-medium">
                  {m.label}
                </span>
                <span
                  style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                  className="text-3xl font-semibold tabular-nums"
                >
                  {m.displayValue}
                </span>
              </div>
              <p style={{ color: pal.muted }} className="text-xs">
                {m.contextNote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

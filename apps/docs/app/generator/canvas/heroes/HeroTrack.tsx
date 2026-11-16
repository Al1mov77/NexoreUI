"use client";

import React from "react";
import { MaskedHeadline } from "../../SharedSections";
import { HeroActionButtons, HeroMediaPlate, HeroRenderProps } from "./HeroShared";

export function HeroTrack({
  payload,
  pal,
  reducedMotion,
  cleanCity,
  firstSectionHref,
}: HeroRenderProps) {
  const { tokens, validatedMetrics } = payload;
  const variant = tokens.heroVariant;

  if (variant === "thermal-split-dossier") {
    return (
      <section
        id="overview"
        style={{ borderColor: pal.border }}
        className="border-b grid lg:grid-cols-12 min-h-[520px]"
      >
        <div
          style={{ borderColor: pal.border }}
          className="lg:col-span-7 relative min-h-[340px] border-b lg:border-b-0 lg:border-r overflow-hidden"
        >
          <HeroMediaPlate
            payload={payload}
            pal={pal}
            reducedMotion={reducedMotion}
          />
        </div>
        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span
              style={{ color: pal.accent }}
              className="text-xs uppercase tracking-wider font-medium block"
            >
              {cleanCity} Track Division
            </span>
            <MaskedHeadline
              text={payload.headline}
              displayFont={tokens.fontPair.displayFamily}
              duration={tokens.motion.duration}
              ease={tokens.motion.ease}
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.05]"
            />
            <p
              style={{ color: pal.muted }}
              className="text-sm sm:text-base leading-relaxed"
            >
              {payload.subheadline}
            </p>
            <HeroActionButtons
              payload={payload}
              pal={pal}
              firstSectionHref={firstSectionHref}
            />
          </div>
          <div
            style={{ borderColor: pal.border }}
            className="border-t pt-4 grid grid-cols-3 gap-3"
          >
            {validatedMetrics.slice(0, 3).map((m) => (
              <div key={m.id}>
                <div
                  style={{
                    fontFamily: tokens.fontPair.monoFamily,
                    color: pal.fg,
                  }}
                  className="text-lg font-semibold tabular-nums"
                >
                  {m.displayValue}
                </div>
                <div style={{ color: pal.muted }} className="text-xs">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "overhead-aero-windtunnel") {
    return (
      <section id="overview" style={{ borderColor: pal.border }} className="border-b">
        <div
          style={{ borderColor: pal.border }}
          className="relative aspect-[21/9] min-h-[300px] w-full border-b overflow-hidden"
        >
          <HeroMediaPlate
            payload={payload}
            pal={pal}
            reducedMotion={reducedMotion}
          />
        </div>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-2">
            <span
              style={{ color: pal.accent }}
              className="text-xs uppercase tracking-wider font-medium block"
            >
              {cleanCity} Engineering
            </span>
            <MaskedHeadline
              text={payload.headline}
              displayFont={tokens.fontPair.displayFamily}
              duration={tokens.motion.duration}
              ease={tokens.motion.ease}
              className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.05]"
            />
          </div>
          <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <p
              style={{ color: pal.muted }}
              className="text-sm sm:text-base leading-relaxed max-w-md"
            >
              {payload.subheadline}
            </p>
            <HeroActionButtons
              payload={payload}
              pal={pal}
              firstSectionHref={firstSectionHref}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="overview" style={{ borderColor: pal.border }} className="border-b">
      <div className="grid lg:grid-cols-12 min-h-[480px]">
        <div
          style={{ borderColor: pal.border }}
          className="lg:col-span-5 p-6 sm:p-10 lg:p-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r space-y-5"
        >
          <span
            style={{ color: pal.accent }}
            className="text-xs uppercase tracking-wider font-medium block"
          >
            {cleanCity} Division
          </span>
          <MaskedHeadline
            text={payload.headline}
            displayFont={tokens.fontPair.displayFamily}
            duration={tokens.motion.duration}
            ease={tokens.motion.ease}
            className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]"
          />
          <p style={{ color: pal.muted }} className="text-base leading-relaxed">
            {payload.subheadline}
          </p>
          <HeroActionButtons
            payload={payload}
            pal={pal}
            firstSectionHref={firstSectionHref}
          />
        </div>
        <div className="lg:col-span-7 relative min-h-[340px] overflow-hidden">
          <HeroMediaPlate
            payload={payload}
            pal={pal}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
      <div
        style={{ borderColor: pal.border, backgroundColor: pal.surface }}
        className="border-t grid grid-cols-2 sm:grid-cols-4 divide-x"
      >
        {validatedMetrics.slice(0, 4).map((m) => (
          <div
            key={m.id}
            style={{ borderColor: pal.border }}
            className="px-6 py-4"
          >
            <div
              style={{
                fontFamily: tokens.fontPair.monoFamily,
                color: pal.fg,
              }}
              className="text-xl font-semibold tabular-nums"
            >
              {m.displayValue}
            </div>
            <div style={{ color: pal.muted }} className="text-xs">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { MaskedHeadline } from "../../SharedSections";
import { getSafeOverlayStyle } from "../canvas-types";
import { HeroActionButtons, HeroMediaPlate, HeroRenderProps } from "./HeroShared";

export function HeroMonolith({
  payload,
  pal,
  reducedMotion,
  isBakery,
  cleanCity,
  firstSectionHref,
}: HeroRenderProps) {
  const { tokens, config, heroAsset, validatedMetrics } = payload;
  const variant = tokens.heroVariant;
  const placeTag = isBakery ? `${cleanCity} Bakehouse` : `${cleanCity} Showroom`;

  if (variant === "split-vertical-guillotine") {
    return (
      <section
        id="overview"
        style={{ borderColor: pal.border }}
        className="border-b grid lg:grid-cols-12 min-h-[580px]"
      >
        <div
          style={{ borderColor: pal.border }}
          className="lg:col-span-6 p-8 sm:p-14 lg:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r"
        >
          <span
            style={{ color: pal.accent }}
            className="text-xs uppercase tracking-wider font-medium block"
          >
            {placeTag}
          </span>
          <div className="space-y-5 my-10">
            <MaskedHeadline
              text={payload.headline}
              displayFont={tokens.fontPair.displayFamily}
              duration={tokens.motion.duration}
              ease={tokens.motion.ease}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.02]"
            />
            <p
              style={{ color: pal.muted }}
              className="text-base sm:text-lg leading-relaxed max-w-lg"
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
            className="grid grid-cols-2 border-t pt-6 gap-6"
          >
            {validatedMetrics.slice(0, 2).map((m) => (
              <div key={m.id}>
                <div
                  style={{
                    fontFamily: tokens.fontPair.monoFamily,
                    color: pal.fg,
                  }}
                  className="text-2xl font-semibold tabular-nums"
                >
                  {m.displayValue}
                </div>
                <div style={{ color: pal.muted }} className="text-xs mt-0.5">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-6 relative min-h-[380px] overflow-hidden">
          <HeroMediaPlate
            payload={payload}
            pal={pal}
            reducedMotion={reducedMotion}
          />
        </div>
      </section>
    );
  }

  if (variant === "architectural-plinth") {
    return (
      <section id="overview" style={{ borderColor: pal.border }} className="border-b">
        <div
          style={{ borderColor: pal.border }}
          className="max-w-6xl mx-auto px-6 sm:px-10 py-14 lg:py-20 grid lg:grid-cols-12 gap-8 items-end border-b"
        >
          <div className="lg:col-span-7 space-y-4">
            <span
              style={{ color: pal.accent }}
              className="text-xs uppercase tracking-wider font-medium block"
            >
              {cleanCity} Architecture
            </span>
            <MaskedHeadline
              text={payload.headline}
              displayFont={tokens.fontPair.displayFamily}
              duration={tokens.motion.duration}
              ease={tokens.motion.ease}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.02]"
            />
          </div>
          <div className="lg:col-span-5 space-y-5">
            <p style={{ color: pal.muted }} className="text-base leading-relaxed">
              {payload.subheadline}
            </p>
            <HeroActionButtons
              payload={payload}
              pal={pal}
              firstSectionHref={firstSectionHref}
            />
          </div>
        </div>
        <div className="relative aspect-[21/9] min-h-[320px] w-full overflow-hidden">
          <HeroMediaPlate
            payload={payload}
            pal={pal}
            reducedMotion={reducedMotion}
          />
        </div>
      </section>
    );
  }

  const safeOverlay = getSafeOverlayStyle(heroAsset.asset, config.themeMode);

  return (
    <section
      id="overview"
      style={{ borderColor: pal.border }}
      className="relative border-b min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden"
    >
      <HeroMediaPlate
        payload={payload}
        pal={pal}
        reducedMotion={reducedMotion}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        style={{ background: safeOverlay.scrimGradient }}
        className="absolute inset-0 pointer-events-none"
      />

      <div
        className={`relative z-10 max-w-6xl mx-auto w-full px-6 sm:px-10 py-16 lg:py-20 ${safeOverlay.flexAlignClass}`}
      >
        <div
          style={{
            backgroundColor:
              config.themeMode === "light"
                ? "rgba(255, 255, 255, 0.88)"
                : "rgba(0, 0, 0, 0.80)",
            borderColor: pal.border,
            borderRadius: tokens.cardRadius,
          }}
          className="max-w-xl p-8 sm:p-10 border backdrop-blur-md space-y-5 shadow-2xl"
        >
          <span
            style={{ color: pal.accent }}
            className="text-xs uppercase tracking-wider font-medium block"
          >
            {placeTag}
          </span>
          <MaskedHeadline
            text={payload.headline}
            displayFont={tokens.fontPair.displayFamily}
            duration={tokens.motion.duration}
            ease={tokens.motion.ease}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.04]"
          />
          <p
            style={{ color: pal.muted }}
            className="text-base leading-relaxed max-w-lg"
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

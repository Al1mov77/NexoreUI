"use client";

import React from "react";
import { MaskedHeadline } from "../../SharedSections";
import { getSafeOverlayStyle } from "../canvas-types";
import { HeroActionButtons, HeroMediaPlate, HeroRenderProps } from "./HeroShared";

export function HeroShowroom({
  payload,
  pal,
  reducedMotion,
  isBakery,
  cleanCity,
  firstSectionHref,
}: HeroRenderProps) {
  const { tokens, config, heroAsset, validatedMetrics } = payload;
  const variant = tokens.heroVariant;
  const placeTag = (suffix: string) =>
    isBakery ? `${cleanCity} Bakehouse` : `${cleanCity} ${suffix}`;

  if (variant === "bespoke-split-configurator") {
    return (
      <section
        id="overview"
        style={{ borderColor: pal.border }}
        className="border-b py-14 sm:py-20 px-6 sm:px-10"
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 items-stretch">
          <div
            style={{
              borderColor: pal.border,
              borderRadius: tokens.cardRadius,
            }}
            className="lg:col-span-7 relative border overflow-hidden min-h-[380px]"
          >
            <HeroMediaPlate
              payload={payload}
              pal={pal}
              reducedMotion={reducedMotion}
            />
          </div>
          <div
            style={{
              borderColor: pal.border,
              backgroundColor: pal.surface,
              borderRadius: tokens.cardRadius,
            }}
            className="lg:col-span-5 border p-8 sm:p-10 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <span
                style={{ color: pal.accent }}
                className="text-xs uppercase tracking-wider font-medium block"
              >
                {placeTag("Showroom")}
              </span>
              <MaskedHeadline
                text={payload.headline}
                displayFont={tokens.fontPair.displayFamily}
                duration={tokens.motion.duration}
                ease={tokens.motion.ease}
                className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.05]"
              />
              <p
                style={{ color: pal.muted }}
                className="text-sm sm:text-base leading-relaxed"
              >
                {payload.subheadline}
              </p>
            </div>
            <div style={{ borderColor: pal.border }} className="border-t pt-4 space-y-3">
              {validatedMetrics.slice(0, 3).map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span style={{ color: pal.muted }}>{m.label}</span>
                  <span
                    style={{
                      fontFamily: tokens.fontPair.monoFamily,
                      color: pal.fg,
                    }}
                    className="font-semibold tabular-nums"
                  >
                    {m.displayValue}
                  </span>
                </div>
              ))}
            </div>
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

  if (variant === "cockpit-first-immersion") {
    const safeOverlay = getSafeOverlayStyle(heroAsset.asset, config.themeMode);
    return (
      <section
        id="overview"
        style={{ borderColor: pal.border }}
        className="border-b py-12 sm:py-16 px-6 sm:px-10"
      >
        <div className="max-w-6xl mx-auto">
          <div
            style={{
              borderColor: pal.border,
              borderRadius: tokens.cardRadius,
            }}
            className={`relative border overflow-hidden min-h-[520px] items-end p-6 sm:p-10 ${safeOverlay.flexAlignClass}`}
          >
            <HeroMediaPlate
              payload={payload}
              pal={pal}
              reducedMotion={reducedMotion}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              style={{
                borderColor: pal.border,
                backgroundColor: pal.surface,
                borderRadius: tokens.cardRadius,
              }}
              className="relative z-10 border p-6 sm:p-8 max-w-xl space-y-4"
            >
              <span
                style={{ color: pal.accent }}
                className="text-xs uppercase tracking-wider font-medium block"
              >
                {placeTag("Cabin & Studio")}
              </span>
              <MaskedHeadline
                text={payload.headline}
                displayFont={tokens.fontPair.displayFamily}
                duration={tokens.motion.duration}
                ease={tokens.motion.ease}
                className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.05]"
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
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="overview"
      style={{ borderColor: pal.border }}
      className="border-b py-14 sm:py-20 px-6 sm:px-10"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="max-w-2xl space-y-4">
          <span
            style={{ color: pal.accent }}
            className="text-xs uppercase tracking-wider font-medium block"
          >
            {placeTag("Showroom")}
          </span>
          <MaskedHeadline
            text={payload.headline}
            displayFont={tokens.fontPair.displayFamily}
            duration={tokens.motion.duration}
            ease={tokens.motion.ease}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.04]"
          />
          <p
            style={{ color: pal.muted }}
            className="text-base sm:text-lg leading-relaxed max-w-xl"
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
          style={{
            borderColor: pal.border,
            borderRadius: tokens.cardRadius,
          }}
          className="relative border overflow-hidden aspect-[16/9]"
        >
          <HeroMediaPlate
            payload={payload}
            pal={pal}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
    </section>
  );
}

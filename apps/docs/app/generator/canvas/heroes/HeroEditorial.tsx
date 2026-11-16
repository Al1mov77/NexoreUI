"use client";

import React from "react";
import { MaskedHeadline } from "../../SharedSections";
import { HeroActionButtons, HeroMediaPlate, HeroRenderProps } from "./HeroShared";

export function HeroEditorial({
  payload,
  pal,
  reducedMotion,
  isBakery,
  cleanCity,
  firstSectionHref,
}: HeroRenderProps) {
  const { tokens } = payload;
  const variant = tokens.heroVariant;
  const placeTag = isBakery ? `${cleanCity} Bakehouse` : `${cleanCity} Edition`;

  if (variant === "monograph-chapter-index") {
    return (
      <section
        id="overview"
        style={{ borderColor: pal.border }}
        className="border-b py-16 sm:py-24 px-6 sm:px-10"
      >
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-5">
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
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]"
            />
            <p
              style={{ color: pal.muted }}
              className="text-base sm:text-lg leading-relaxed"
            >
              {payload.subheadline}
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href="#cta"
                style={{
                  backgroundColor: pal.accent,
                  color: pal.accentFg,
                  borderRadius: tokens.buttonRadius,
                }}
                className="px-6 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {payload.ctaPrimary}
              </a>
              <a
                href={firstSectionHref}
                style={{
                  borderColor: pal.border,
                  color: pal.fg,
                  borderRadius: tokens.buttonRadius,
                }}
                className="border px-6 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {payload.ctaSecondary}
              </a>
            </div>
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

  if (variant === "panoramic-gallery-salon") {
    return (
      <section
        id="overview"
        style={{ borderColor: pal.border }}
        className="border-b py-16 sm:py-24 px-6 sm:px-10"
      >
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <span
                style={{ color: pal.accent }}
                className="text-xs uppercase tracking-wider font-medium block"
              >
                {cleanCity} Salon
              </span>
              <MaskedHeadline
                text={payload.headline}
                displayFont={tokens.fontPair.displayFamily}
                duration={tokens.motion.duration}
                ease={tokens.motion.ease}
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]"
              />
            </div>
            <div className="lg:col-span-5 space-y-4">
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
          <div
            style={{
              borderColor: pal.border,
              borderRadius: tokens.cardRadius,
            }}
            className="relative border overflow-hidden aspect-[21/9] min-h-[300px]"
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

  return (
    <section
      id="overview"
      style={{ borderColor: pal.border }}
      className="border-b py-16 sm:py-24 px-6 sm:px-10"
    >
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-12 items-center">
        <div className="lg:col-span-5 space-y-5">
          <span
            style={{ color: pal.accent }}
            className="text-xs uppercase tracking-wider font-medium block"
          >
            {cleanCity} Collection
          </span>
          <MaskedHeadline
            text={payload.headline}
            displayFont={tokens.fontPair.displayFamily}
            duration={tokens.motion.duration}
            ease={tokens.motion.ease}
            className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.06]"
          />
          <p
            style={{ color: pal.muted }}
            className="text-base sm:text-lg leading-relaxed"
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
          className="lg:col-span-7 relative border overflow-hidden aspect-[16/10]"
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

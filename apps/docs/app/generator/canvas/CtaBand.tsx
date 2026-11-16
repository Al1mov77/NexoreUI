"use client";

import { motion } from "framer-motion";
import React from "react";
import { interpolateText } from "../../../lib/generator/copy-bank";
import { SynthesizedLandingPayload } from "../../../lib/generator/schema";
import { getTransitionSpec, SurfacePalette } from "./canvas-types";

export function CtaBand({
  payload,
  pal,
  reducedMotion,
  isBakery,
  ctaSentence,
}: {
  payload: SynthesizedLandingPayload;
  pal: SurfacePalette;
  reducedMotion: boolean;
  isBakery: boolean;
  ctaSentence: string;
}) {
  const { config, tokens } = payload;
  const ctaHeading = interpolateText(
    isBakery
      ? "Visit {brandName} in {location}"
      : "Experience the {modelName} in {location}",
    config
  );

  const reveal = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: getTransitionSpec(tokens, false),
      };

  if (tokens.archetype === "editorial") {
    return (
      <motion.section
        id="cta"
        {...reveal}
        style={{ borderColor: pal.border, backgroundColor: pal.surface }}
        className="border-b py-20 sm:py-24 px-6 sm:px-10"
      >
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2
            style={{
              fontFamily: tokens.fontPair.displayFamily,
              color: pal.fg,
            }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight"
          >
            {ctaHeading}
          </h2>
          <p style={{ color: pal.muted }} className="text-base leading-relaxed">
            {ctaSentence}
          </p>
          <div>
            <a
              href="#overview"
              style={{
                backgroundColor: pal.accent,
                color: pal.accentFg,
                borderRadius: tokens.buttonRadius,
              }}
              className="inline-block px-8 py-3.5 text-sm font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {payload.ctaPrimary}
            </a>
          </div>
        </div>
      </motion.section>
    );
  }

  if (tokens.archetype === "showroom") {
    return (
      <motion.section
        id="cta"
        {...reveal}
        style={{ borderColor: pal.border }}
        className="border-b py-16 sm:py-20 px-6 sm:px-10"
      >
        <div
          style={{
            borderColor: pal.border,
            backgroundColor: pal.surface,
            borderRadius: tokens.cardRadius,
          }}
          className="max-w-6xl mx-auto border p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          <div className="max-w-xl space-y-2">
            <h2
              style={{
                fontFamily: tokens.fontPair.displayFamily,
                color: pal.fg,
              }}
              className="text-2xl sm:text-3xl font-semibold tracking-tight"
            >
              {ctaHeading}
            </h2>
            <p style={{ color: pal.muted }} className="text-sm sm:text-base">
              {ctaSentence}
            </p>
          </div>
          <div>
            <a
              href="#overview"
              style={{
                backgroundColor: pal.accent,
                color: pal.accentFg,
                borderRadius: tokens.buttonRadius,
              }}
              className="inline-block px-7 py-3.5 text-sm font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {payload.ctaPrimary}
            </a>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      id="cta"
      {...reveal}
      style={{ borderColor: pal.border, backgroundColor: pal.surface }}
      className="border-b py-16 sm:py-20 px-6 sm:px-10"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-xl space-y-2">
          <h2
            style={{
              fontFamily: tokens.fontPair.displayFamily,
              color: pal.fg,
            }}
            className="text-2xl sm:text-3xl font-semibold tracking-tight"
          >
            {ctaHeading}
          </h2>
          <p style={{ color: pal.muted }} className="text-sm sm:text-base">
            {ctaSentence}
          </p>
        </div>
        <div>
          <a
            href="#overview"
            style={{
              backgroundColor: pal.accent,
              color: pal.accentFg,
              borderRadius: tokens.buttonRadius,
            }}
            className="inline-block px-7 py-3.5 text-sm font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {payload.ctaPrimary}
          </a>
        </div>
      </div>
    </motion.section>
  );
}

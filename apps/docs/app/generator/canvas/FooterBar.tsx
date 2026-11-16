"use client";

import React from "react";
import { SynthesizedLandingPayload } from "../../../lib/generator/schema";
import { SurfacePalette } from "./canvas-types";

export function FooterBar({
  payload,
  pal,
  cleanCity,
  firstSectionHref,
}: {
  payload: SynthesizedLandingPayload;
  pal: SurfacePalette;
  cleanCity: string;
  firstSectionHref: string;
}) {
  const { config, tokens } = payload;

  return (
    <footer
      key="footer"
      style={{
        borderColor: pal.border,
        backgroundColor: pal.bg,
        color: pal.muted,
      }}
      className="py-10 px-4 sm:px-6 lg:px-10 text-xs sm:text-sm"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <p
          style={{
            color: pal.fg,
            fontFamily: tokens.fontPair.displayFamily,
          }}
          className="text-sm sm:text-base font-medium max-w-2xl"
        >
          {payload.manifestoQuote}
        </p>

        <div
          style={{ borderColor: pal.border }}
          className="border-t pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span style={{ color: pal.fg }} className="font-semibold">
              {config.brandName}
            </span>
            <span>{cleanCity}</span>
            <span
              style={{ fontFamily: tokens.fontPair.monoFamily }}
              className="tabular-nums"
            >
              {config.year}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#overview" className="hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2">
              Privacy
            </a>
            <a href={firstSectionHref} className="hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2">
              Terms
            </a>
            <a href="#cta" className="hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React from "react";
import { SynthesizedLandingPayload } from "../../../lib/generator/schema";
import { SurfacePalette } from "./canvas-types";

export function NavigationBar({
  payload,
  pal,
  firstSectionHref,
}: {
  payload: SynthesizedLandingPayload;
  pal: SurfacePalette;
  firstSectionHref: string;
}) {
  const { config, tokens } = payload;
  const navSections = payload.sections.slice(0, 2);

  return (
    <header
      style={{
        borderColor: pal.border,
        backgroundColor: pal.bg,
        fontFamily: tokens.fontPair.bodyFamily,
      }}
      className="border-b px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4"
    >
      <span
        style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
        className="text-lg font-semibold tracking-tight truncate"
      >
        {config.brandName}
      </span>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a
          href="#overview"
          style={{ color: pal.muted }}
          className="hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Overview
        </a>
        {navSections.map((sec) => (
          <a
            key={sec.kind}
            href={`#${sec.kind === "section-trim-builder" ? "cta" : sec.kind}`}
            style={{ color: pal.muted }}
            className="hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {sec.code}
          </a>
        ))}
        {navSections.length === 0 && (
          <a
            href={firstSectionHref}
            style={{ color: pal.muted }}
            className="hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Details
          </a>
        )}
      </nav>

      <a
        href="#cta"
        style={{
          backgroundColor: pal.accent,
          color: pal.accentFg,
          borderRadius: tokens.buttonRadius,
        }}
        className="px-4 py-2 text-xs sm:text-sm font-medium transition-opacity hover:opacity-90 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {payload.ctaPrimary}
      </a>
    </header>
  );
}

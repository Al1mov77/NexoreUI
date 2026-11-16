"use client";

import { motion } from "framer-motion";
import React from "react";
import {
  ArchetypeDesignTokens,
  SynthesizedSectionSpec,
} from "../../../../lib/generator/schema";
import { getTransitionSpec, SurfacePalette } from "../canvas-types";

export function SectionShell({
  id,
  tokens,
  pal,
  reducedMotion,
  children,
}: {
  id: string;
  tokens: ArchetypeDesignTokens;
  pal: SurfacePalette;
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  const paddingClass =
    tokens.archetype === "track"
      ? "py-14 sm:py-16"
      : tokens.archetype === "editorial"
        ? "py-20 sm:py-28"
        : tokens.archetype === "monolith"
          ? "py-18 sm:py-24"
          : "py-16 sm:py-22";

  if (reducedMotion) {
    return (
      <section
        id={id}
        style={{ borderColor: pal.border }}
        className={`border-b ${paddingClass} px-4 sm:px-6 lg:px-10`}
      >
        <div className="max-w-6xl mx-auto">{children}</div>
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={getTransitionSpec(tokens, false)}
      style={{ borderColor: pal.border }}
      className={`border-b ${paddingClass} px-4 sm:px-6 lg:px-10`}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </motion.section>
  );
}

export function SectionTitleRow({
  section,
  tokens,
  pal,
  rightSlot,
}: {
  section: SynthesizedSectionSpec;
  tokens: ArchetypeDesignTokens;
  pal: SurfacePalette;
  rightSlot?: React.ReactNode;
}) {
  if (tokens.archetype === "track") {
    return (
      <div
        style={{ borderColor: pal.border }}
        className="border-b pb-5 flex flex-col lg:flex-row lg:items-end justify-between gap-4"
      >
        <h2
          style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
          className="text-2xl sm:text-3xl font-semibold tracking-tight"
        >
          {section.title}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:max-w-xl">
          <p style={{ color: pal.muted }} className="text-sm sm:text-base leading-relaxed">
            {section.subtitle}
          </p>
          {rightSlot}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
      <div className="max-w-2xl space-y-2">
        <h2
          style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
          className="text-2xl sm:text-3xl font-semibold tracking-tight"
        >
          {section.title}
        </h2>
        <p style={{ color: pal.muted }} className="text-sm sm:text-base leading-relaxed">
          {section.subtitle}
        </p>
      </div>
      {rightSlot}
    </div>
  );
}

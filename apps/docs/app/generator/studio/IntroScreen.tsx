"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React, { RefObject } from "react";
import { UI_STRINGS } from "../../../lib/generator/ui-strings";

export function IntroScreen({
  prefersReducedMotion,
  stepHeadingRef,
  onStart,
}: {
  prefersReducedMotion: boolean | null;
  stepHeadingRef: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
}) {
  return (
    <motion.section
      key="intake-intro"
      data-testid="screen-0-intro"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      style={{
        borderColor: "var(--tool-border)",
        backgroundColor: "var(--tool-surface)",
      }}
      className="max-w-2xl mx-auto rounded-2xl border p-8 sm:p-14 text-center space-y-6 my-6 sm:my-12"
    >
      <span
        style={{
          borderColor: "var(--tool-border)",
          backgroundColor: "var(--tool-surface-elevated)",
          color: "var(--tool-muted)",
        }}
        className="inline-block rounded-md border px-3 py-1 text-xs font-medium"
      >
        {UI_STRINGS.intro.betaNote}
      </span>

      <h1
        ref={stepHeadingRef}
        tabIndex={-1}
        className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.08] outline-none"
      >
        {UI_STRINGS.intro.headline}
      </h1>

      <p
        style={{ color: "var(--tool-muted)" }}
        className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
      >
        {UI_STRINGS.intro.sentence}
      </p>

      <div className="pt-2">
        <button
          type="button"
          data-testid="btn-intro-start"
          onClick={onStart}
          style={{
            backgroundColor: "var(--tool-accent)",
            color: "var(--tool-accent-fg)",
          }}
          className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-medium transition-opacity hover:opacity-90 cursor-pointer"
        >
          <span>{UI_STRINGS.intro.startButton}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.section>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, SkipForward } from "lucide-react";
import type { SynthesizedLandingPayload } from "../../lib/generator/schema";
import { UI_STRINGS } from "../../lib/generator/ui-strings";
import {
  StageAssetContactSheet,
  StageBriefAndMetrics,
  StageCandidateRanking,
  StageSequenceAndAudit,
  StageTypographicProof,
} from "./studio/AssemblyStageViews";

interface AssemblyStageVisualizerProps {
  payload: SynthesizedLandingPayload;
  activeStage: number;
  buildMode?: "initial" | "variant";
  onSkipToResult: () => void;
}

export function AssemblyStageVisualizer({
  payload,
  activeStage,
  buildMode = "initial",
  onSkipToResult,
}: AssemblyStageVisualizerProps) {
  const reducedMotion = Boolean(useReducedMotion());
  const stages = UI_STRINGS.assembly.stages;
  const clampedStage = Math.max(1, Math.min(stages.length, activeStage));
  const currentStage = stages.find((s) => s.id === clampedStage) || stages[0];
  const progressRatio = clampedStage / Math.max(1, stages.length);

  const modeSummary =
    buildMode === "variant"
      ? `Variant #${String(payload.config.variationSeed).padStart(2, "0")} composition for ${payload.config.brandName} ${payload.config.modelName}`
      : `Assembling landing canvas for ${payload.config.brandName} ${payload.config.modelName}`;

  return (
    <motion.section
      data-testid="assembly-stage-visualizer"
      data-active-stage={activeStage}
      aria-live="polite"
      aria-label="Landing page assembly progress"
      layoutId={reducedMotion ? undefined : "generator-canvas-frame"}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderColor: "var(--tool-border)",
        backgroundColor: "var(--tool-surface)",
      }}
      className="rounded-2xl border overflow-x-clip"
    >
      <link rel="stylesheet" href={payload.tokens.fontPair.googleFontsUrl} />

      <div
        style={{ borderColor: "var(--tool-border)" }}
        className="px-5 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 border-b"
      >
        <div className="space-y-1 min-w-0">
          <h2
            style={{ color: "var(--tool-fg)" }}
            className="text-base sm:text-lg font-semibold tracking-tight truncate"
          >
            {currentStage.detail}
          </h2>
          <p style={{ color: "var(--tool-muted)" }} className="text-xs truncate">
            {modeSummary}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            style={{ color: "var(--tool-muted)" }}
            className="text-xs font-mono tabular-nums"
          >
            {String(clampedStage).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
          </span>

          <button
            type="button"
            data-testid="btn-skip-build"
            onClick={onSkipToResult}
            style={{
              borderColor: "var(--tool-border)",
              backgroundColor: "var(--tool-surface-elevated)",
              color: "var(--tool-fg)",
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-2"
          >
            <span>{UI_STRINGS.assembly.skipButton}</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        style={{ backgroundColor: "var(--tool-border)" }}
        className="h-[2px] w-full overflow-hidden"
      >
        <motion.div
          initial={reducedMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: progressRatio }}
          transition={
            reducedMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
          }
          style={{
            transformOrigin: "left",
            backgroundColor: "var(--tool-accent)",
          }}
          className="h-full w-full"
        />
      </div>

      <div
        style={{
          borderColor: "var(--tool-border)",
          backgroundColor: "var(--tool-bg)",
        }}
        className="grid grid-cols-5 border-b"
      >
        {stages.map((stage, idx) => {
          const isDone = clampedStage > stage.id;
          const isActive = clampedStage === stage.id;

          return (
            <div
              key={stage.id}
              style={{
                borderColor: "var(--tool-border)",
                color: isActive ? "var(--tool-fg)" : "var(--tool-muted)",
                opacity: !isActive && !isDone ? 0.55 : 1,
              }}
              className={`relative px-2 sm:px-4 py-2.5 flex items-center justify-center sm:justify-start gap-2 text-xs ${
                idx > 0 ? "border-l" : ""
              }`}
            >
              <span className="font-mono text-[11px] tabular-nums shrink-0 inline-flex items-center gap-1">
                {isDone && <Check className="w-3 h-3" />}
                {String(stage.id).padStart(2, "0")}
              </span>
              <span
                className={`hidden sm:inline truncate ${
                  isActive ? "font-medium" : "font-normal"
                }`}
              >
                {stage.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId={reducedMotion ? undefined : "assembly-step-rail"}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 36 }
                  }
                  style={{ backgroundColor: "var(--tool-accent)" }}
                  className="absolute inset-x-0 bottom-0 h-[2px]"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {clampedStage === 1 && (
            <StageBriefAndMetrics key="stage-1" payload={payload} reducedMotion={reducedMotion} />
          )}
          {clampedStage === 2 && (
            <StageAssetContactSheet key="stage-2" payload={payload} reducedMotion={reducedMotion} />
          )}
          {clampedStage === 3 && (
            <StageCandidateRanking key="stage-3" payload={payload} reducedMotion={reducedMotion} />
          )}
          {clampedStage === 4 && (
            <StageSequenceAndAudit key="stage-4" payload={payload} reducedMotion={reducedMotion} />
          )}
          {clampedStage === 5 && (
            <StageTypographicProof key="stage-5" payload={payload} reducedMotion={reducedMotion} />
          )}
        </AnimatePresence>
      </div>

      <div
        style={{
          borderColor: "var(--tool-border)",
          backgroundColor: "var(--tool-bg)",
          color: "var(--tool-muted)",
        }}
        className="px-5 py-3 sm:px-6 border-t flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span style={{ color: "var(--tool-fg)" }}>{payload.tokens.archetypeLabel}</span>
          <span>{payload.tokens.palette.name}</span>
          <span>{payload.tokens.fontPair.name}</span>
        </div>
        <span className="tabular-nums">
          Seed #{String(payload.config.variationSeed).padStart(2, "0")}
        </span>
      </div>
    </motion.section>
  );
}

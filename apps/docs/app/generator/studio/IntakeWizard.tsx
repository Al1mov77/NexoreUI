"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { RefObject } from "react";
import {
  AutoSubcategoryId,
  EngineeringTag,
  GeneratorUserConfig,
  SynthesizedLandingPayload,
} from "../../../lib/generator/schema";
import { UI_STRINGS } from "../../../lib/generator/ui-strings";
import { BriefSummarySidebar } from "./BriefSummarySidebar";
import { IntakeStepsPrimary } from "./IntakeStepsPrimary";
import { IntakeStepsStyle } from "./IntakeStepsStyle";
import { IntakeStep } from "./studio-types";

export function IntakeWizard({
  prefersReducedMotion,
  intakeStep,
  config,
  sanitizedConfig,
  payload,
  stepHeadingRef,
  nameInputRef,
  cityInputRef,
  onSetIntakeStep,
  onSetConfig,
  onSelectSubcategory,
  onToggleFocusTag,
  onBuild,
}: {
  prefersReducedMotion: boolean | null;
  intakeStep: IntakeStep;
  config: GeneratorUserConfig;
  sanitizedConfig: GeneratorUserConfig;
  payload: SynthesizedLandingPayload;
  stepHeadingRef: RefObject<HTMLHeadingElement | null>;
  nameInputRef: RefObject<HTMLInputElement | null>;
  cityInputRef: RefObject<HTMLInputElement | null>;
  onSetIntakeStep: React.Dispatch<React.SetStateAction<IntakeStep>>;
  onSetConfig: React.Dispatch<React.SetStateAction<GeneratorUserConfig>>;
  onSelectSubcategory: (sub: AutoSubcategoryId) => void;
  onToggleFocusTag: (tag: EngineeringTag) => void;
  onBuild: () => void;
}) {
  return (
    <motion.section
      key={`intake-step-${intakeStep}`}
      data-testid={`intake-step-${intakeStep}`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="grid gap-8 lg:grid-cols-12 items-start"
    >
      <div
        style={{
          borderColor: "var(--tool-border)",
          backgroundColor: "var(--tool-surface)",
        }}
        className="lg:col-span-8 rounded-2xl border p-6 sm:p-10 space-y-8"
      >
        <div
          style={{ borderColor: "var(--tool-border)" }}
          className="flex items-center justify-between border-b pb-4 text-xs"
        >
          <span
            style={{ color: "var(--tool-muted)" }}
            className="font-mono font-medium tabular-nums"
          >
            {intakeStep <= 5
              ? `${intakeStep} ${UI_STRINGS.intake.stepOf} 5`
              : "5 / 5 · Complete"}
          </span>
          <span
            style={{ color: "var(--tool-muted)" }}
            className="hidden sm:inline"
          >
            {UI_STRINGS.intake.keyboardHint}
          </span>
        </div>

        {intakeStep <= 3 ? (
          <IntakeStepsPrimary
            intakeStep={intakeStep}
            config={config}
            stepHeadingRef={stepHeadingRef}
            nameInputRef={nameInputRef}
            onSetConfig={onSetConfig}
            onSelectSubcategory={onSelectSubcategory}
          />
        ) : (
          <IntakeStepsStyle
            intakeStep={intakeStep}
            config={config}
            payload={payload}
            stepHeadingRef={stepHeadingRef}
            cityInputRef={cityInputRef}
            onSetConfig={onSetConfig}
            onToggleFocusTag={onToggleFocusTag}
            onBuild={onBuild}
          />
        )}

        <div
          style={{ borderColor: "var(--tool-border)" }}
          className="flex items-center justify-between border-t pt-5"
        >
          <button
            type="button"
            data-testid="btn-intake-back"
            onClick={() =>
              onSetIntakeStep((prev) => Math.max(0, prev - 1) as IntakeStep)
            }
            style={{
              borderColor: "var(--tool-border)",
              backgroundColor: "var(--tool-surface-elevated)",
              color: "var(--tool-fg)",
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-xs font-medium hover:opacity-85 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{UI_STRINGS.intake.backButton}</span>
          </button>

          <div className="flex items-center gap-2.5">
            {intakeStep === 5 && (
              <button
                type="button"
                data-testid="btn-intake-skip"
                onClick={() => onSetIntakeStep(6)}
                style={{ color: "var(--tool-muted)" }}
                className="rounded-lg px-3 py-2.5 text-xs font-medium hover:opacity-85 cursor-pointer"
              >
                {UI_STRINGS.intake.skipButton}
              </button>
            )}

            {intakeStep < 6 && (
              <button
                type="button"
                data-testid="btn-intake-continue"
                onClick={() =>
                  onSetIntakeStep((prev) => Math.min(6, prev + 1) as IntakeStep)
                }
                style={{
                  backgroundColor: "var(--tool-accent)",
                  color: "var(--tool-accent-fg)",
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-xs font-medium hover:opacity-90 cursor-pointer"
              >
                <span>{UI_STRINGS.intake.continueButton}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <BriefSummarySidebar
          intakeStep={intakeStep}
          sanitizedConfig={sanitizedConfig}
          payload={payload}
        />
      </div>
    </motion.section>
  );
}

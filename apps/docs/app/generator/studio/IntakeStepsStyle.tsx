"use client";

import { Check } from "lucide-react";
import React, { RefObject } from "react";
import { ENGINEERING_TAG_META } from "../../../lib/generator/catalog-auto";
import {
  EngineeringTag,
  GeneratorUserConfig,
  SynthesizedLandingPayload,
} from "../../../lib/generator/schema";
import { UI_STRINGS } from "../../../lib/generator/ui-strings";
import { IntakeStep, TONE_ORDER } from "./studio-types";

export function IntakeStepsStyle({
  intakeStep,
  config,
  payload,
  stepHeadingRef,
  cityInputRef,
  onSetConfig,
  onToggleFocusTag,
  onBuild,
}: {
  intakeStep: IntakeStep;
  config: GeneratorUserConfig;
  payload: SynthesizedLandingPayload;
  stepHeadingRef: RefObject<HTMLHeadingElement | null>;
  cityInputRef: RefObject<HTMLInputElement | null>;
  onSetConfig: React.Dispatch<React.SetStateAction<GeneratorUserConfig>>;
  onToggleFocusTag: (tag: EngineeringTag) => void;
  onBuild: () => void;
}) {
  if (intakeStep === 4) {
    return (
      <div className="space-y-6">
        <div>
          <h2
            ref={stepHeadingRef}
            tabIndex={-1}
            className="text-2xl sm:text-3xl font-semibold tracking-tight outline-none"
          >
            {UI_STRINGS.intake.q4.question}
          </h2>
          <p style={{ color: "var(--tool-muted)" }} className="mt-1.5 text-sm">
            {UI_STRINGS.intake.q4.helper}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {TONE_ORDER.map((tId) => {
            const tMeta = UI_STRINGS.tones[tId];
            const active = config.tone === tId;
            return (
              <button
                key={tId}
                type="button"
                data-testid={`tone-${tId}`}
                onClick={() => onSetConfig((prev) => ({ ...prev, tone: tId }))}
                style={{
                  borderColor: active
                    ? "var(--tool-fg)"
                    : "var(--tool-border)",
                  backgroundColor: active
                    ? "var(--tool-surface-active)"
                    : "var(--tool-surface-elevated)",
                  color: "var(--tool-fg)",
                }}
                className={`rounded-xl border p-5 text-left transition-all cursor-pointer space-y-3 ${
                  active ? "ring-1 ring-border-strong" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">{tMeta.title}</span>
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        borderColor: "var(--tool-border)",
                        color: "var(--tool-muted)",
                      }}
                      className="text-[11px] px-2 py-0.5 rounded border"
                    >
                      {tMeta.fontSummary}
                    </span>
                    {active && <Check className="h-4 w-4 shrink-0" />}
                  </div>
                </div>

                <div
                  style={{
                    borderColor: active
                      ? "var(--tool-border-strong)"
                      : "var(--tool-border)",
                    backgroundColor: "var(--tool-surface)",
                  }}
                  className="rounded-lg border px-3.5 py-2.5 opacity-95"
                >
                  <span className="text-lg font-semibold tracking-tight block">
                    {tMeta.specimenHeadline}
                  </span>
                  <span
                    style={{ color: "var(--tool-muted)" }}
                    className="font-mono text-[11px] tabular-nums block mt-0.5"
                  >
                    {tMeta.specimenMeta}
                  </span>
                </div>

                <p
                  style={{ color: "var(--tool-muted)" }}
                  className="text-xs leading-relaxed opacity-90"
                >
                  {tMeta.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        <div
          style={{ borderColor: "var(--tool-border)" }}
          className="border-t pt-5 space-y-2.5"
        >
          <span className="text-xs font-medium block">
            Hardware focus tags (guides photo selection and trim options)
          </span>
          <div className="flex flex-wrap gap-2">
            {ENGINEERING_TAG_META.map((tag) => {
              const active = config.focusTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  data-testid={`intake-tag-${tag.id}`}
                  onClick={() => onToggleFocusTag(tag.id)}
                  style={{
                    borderColor: active
                      ? "var(--tool-fg)"
                      : "var(--tool-border)",
                    backgroundColor: active
                      ? "var(--tool-surface-active)"
                      : "var(--tool-surface-elevated)",
                    color: "var(--tool-fg)",
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors"
                >
                  {active && <Check className="h-3 w-3 shrink-0" />}
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (intakeStep === 5) {
    return (
      <div className="space-y-6">
        <div>
          <h2
            ref={stepHeadingRef}
            tabIndex={-1}
            className="text-2xl sm:text-3xl font-semibold tracking-tight outline-none"
          >
            {UI_STRINGS.intake.q5.question}
          </h2>
          <p style={{ color: "var(--tool-muted)" }} className="mt-1.5 text-sm">
            {UI_STRINGS.intake.q5.helper}
          </p>
        </div>

        <div>
          <label
            htmlFor="intake-city-input"
            className="block text-xs font-medium mb-1.5"
          >
            City or region (optional)
          </label>
          <input
            ref={cityInputRef}
            id="intake-city-input"
            data-testid="input-city"
            type="text"
            value={config.location}
            placeholder={UI_STRINGS.intake.q5.placeholder}
            onChange={(e) =>
              onSetConfig((prev) => ({
                ...prev,
                location: e.target.value,
              }))
            }
            style={{
              borderColor: "var(--tool-border-strong)",
              backgroundColor: "var(--tool-surface-elevated)",
              color: "var(--tool-fg)",
            }}
            className="w-full rounded-xl border px-4 py-3.5 text-base outline-none"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2
          ref={stepHeadingRef}
          tabIndex={-1}
          className="text-2xl sm:text-3xl font-semibold tracking-tight outline-none"
        >
          {UI_STRINGS.intake.summary.headline}
        </h2>
        <p style={{ color: "var(--tool-muted)" }} className="mt-1.5 text-sm">
          {UI_STRINGS.intake.summary.subheadline}
        </p>
      </div>

      <div
        style={{
          borderColor: "var(--tool-border)",
          backgroundColor: "var(--tool-surface-elevated)",
        }}
        className="rounded-xl border p-5 space-y-3 text-sm"
      >
        <div className="flex justify-between">
          <span style={{ color: "var(--tool-muted)" }}>Headline preview</span>
          <span className="font-semibold text-right">{payload.headline}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--tool-muted)" }}>
            Primary call to action
          </span>
          <span className="font-semibold">{payload.ctaPrimary}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--tool-muted)" }}>
            Design linter check
          </span>
          <span className="font-semibold">
            {payload.linter.checks.filter((c) => c.passed).length}/
            {payload.linter.checks.length} passed
          </span>
        </div>
      </div>

      <button
        type="button"
        data-testid="btn-build-landing"
        onClick={onBuild}
        style={{
          backgroundColor: "var(--tool-accent)",
          color: "var(--tool-accent-fg)",
        }}
        className="w-full rounded-xl px-6 py-4 text-base font-medium transition-opacity hover:opacity-90 cursor-pointer"
      >
        {UI_STRINGS.intake.buildButton}
      </button>
    </div>
  );
}

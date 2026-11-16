"use client";

import React from "react";
import { ENGINEERING_TAG_META } from "../../../lib/generator/catalog-auto";
import {
  GeneratorUserConfig,
  SynthesizedLandingPayload,
} from "../../../lib/generator/schema";
import { UI_STRINGS } from "../../../lib/generator/ui-strings";
import { IntakeStep } from "./studio-types";

export function BriefSummarySidebar({
  intakeStep,
  sanitizedConfig,
  payload,
}: {
  intakeStep: IntakeStep;
  sanitizedConfig: GeneratorUserConfig;
  payload: SynthesizedLandingPayload;
}) {
  const activeTagLabels = sanitizedConfig.focusTags
    .map((id) => ENGINEERING_TAG_META.find((item) => item.id === id)?.code)
    .filter((code): code is string => Boolean(code));

  return (
    <aside
      aria-label="Your brief summary"
      style={{
        backgroundColor: "var(--tool-surface)",
        borderColor: "var(--tool-border)",
        color: "var(--tool-fg)",
      }}
      className="rounded-xl border p-6 space-y-5 h-fit"
    >
      <div
        style={{ borderColor: "var(--tool-border)" }}
        className="flex items-center justify-between border-b pb-3.5"
      >
        <span className="text-xs font-semibold uppercase tracking-wider">
          {UI_STRINGS.intake.briefTitle}
        </span>
        <span
          style={{ color: "var(--tool-muted)" }}
          className="text-xs font-mono tabular-nums"
        >
          {intakeStep === 6 ? "Ready" : `Step ${intakeStep} / 5`}
        </span>
      </div>

      <dl className="space-y-3.5 text-sm">
        <div
          style={{ borderColor: "var(--tool-border)" }}
          className="flex items-start justify-between gap-4 border-b pb-3"
        >
          <dt style={{ color: "var(--tool-muted)" }}>
            {UI_STRINGS.intake.briefFields.dealership}
          </dt>
          <dd className="font-medium text-right">
            {UI_STRINGS.presets[sanitizedConfig.subcategory].title}
          </dd>
        </div>

        <div
          style={{ borderColor: "var(--tool-border)" }}
          className="flex items-start justify-between gap-4 border-b pb-3"
        >
          <dt style={{ color: "var(--tool-muted)" }}>
            {UI_STRINGS.intake.briefFields.businessName}
          </dt>
          <dd className="font-medium text-right">
            {sanitizedConfig.brandName} · {sanitizedConfig.modelName}
          </dd>
        </div>

        <div
          style={{ borderColor: "var(--tool-border)" }}
          className="flex items-start justify-between gap-4 border-b pb-3"
        >
          <dt style={{ color: "var(--tool-muted)" }}>
            {UI_STRINGS.intake.briefFields.visitorAction}
          </dt>
          <dd className="font-medium text-right">
            {sanitizedConfig.primaryCta}
          </dd>
        </div>

        <div
          style={{ borderColor: "var(--tool-border)" }}
          className="flex items-start justify-between gap-4 border-b pb-3"
        >
          <dt style={{ color: "var(--tool-muted)" }}>
            {UI_STRINGS.intake.briefFields.tone}
          </dt>
          <dd className="font-medium text-right">
            {UI_STRINGS.tones[sanitizedConfig.tone].title}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-4">
          <dt style={{ color: "var(--tool-muted)" }}>
            {UI_STRINGS.intake.briefFields.city}
          </dt>
          <dd className="font-medium text-right">
            {sanitizedConfig.location}
          </dd>
        </div>
      </dl>

      {activeTagLabels.length > 0 && (
        <div
          style={{ borderColor: "var(--tool-border)" }}
          className="border-t pt-3.5 space-y-1.5"
        >
          <span
            style={{ color: "var(--tool-muted)" }}
            className="text-[11px] block"
          >
            Hardware focus
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activeTagLabels.map((code) => (
              <span
                key={code}
                style={{
                  borderColor: "var(--tool-border)",
                  backgroundColor: "var(--tool-surface-elevated)",
                  color: "var(--tool-fg)",
                }}
                className="rounded border px-2 py-0.5 font-mono text-[10px]"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          borderColor: "var(--tool-border)",
          backgroundColor: "var(--tool-surface-elevated)",
        }}
        className="rounded-lg border p-3.5 text-xs space-y-1.5"
      >
        <div
          style={{ color: "var(--tool-muted)" }}
          className="flex items-center justify-between"
        >
          <span>Archetype & radius</span>
          <span style={{ color: "var(--tool-fg)" }} className="font-medium">
            {payload.tokens.archetype} ({payload.tokens.cardRadius})
          </span>
        </div>
        <div
          style={{ color: "var(--tool-muted)" }}
          className="flex items-center justify-between"
        >
          <span>Curated palette</span>
          <span
            style={{ color: "var(--tool-fg)" }}
            className="inline-flex items-center gap-1.5 font-medium"
          >
            <span
              style={{ backgroundColor: payload.tokens.palette.dominantHex }}
              className="h-2.5 w-2.5 rounded-full inline-block border border-black/20"
            />
            {payload.tokens.palette.name}
          </span>
        </div>
      </div>
    </aside>
  );
}

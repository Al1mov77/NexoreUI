"use client";

import { Check } from "lucide-react";
import React, { RefObject } from "react";
import {
  AutoSubcategoryId,
  GeneratorUserConfig,
} from "../../../lib/generator/schema";
import { UI_STRINGS } from "../../../lib/generator/ui-strings";
import { IntakeStep, SUBCATEGORY_ORDER } from "./studio-types";

export function IntakeStepsPrimary({
  intakeStep,
  config,
  stepHeadingRef,
  nameInputRef,
  onSetConfig,
  onSelectSubcategory,
}: {
  intakeStep: IntakeStep;
  config: GeneratorUserConfig;
  stepHeadingRef: RefObject<HTMLHeadingElement | null>;
  nameInputRef: RefObject<HTMLInputElement | null>;
  onSetConfig: React.Dispatch<React.SetStateAction<GeneratorUserConfig>>;
  onSelectSubcategory: (sub: AutoSubcategoryId) => void;
}) {
  if (intakeStep === 1) {
    return (
      <div className="space-y-6">
        <div>
          <h2
            ref={stepHeadingRef}
            tabIndex={-1}
            className="text-2xl sm:text-3xl font-semibold tracking-tight outline-none"
          >
            {UI_STRINGS.intake.q1.question}
          </h2>
          <p style={{ color: "var(--tool-muted)" }} className="mt-1.5 text-sm">
            {UI_STRINGS.intake.q1.helper}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {SUBCATEGORY_ORDER.map((subId) => {
            const item = UI_STRINGS.presets[subId];
            const active = config.subcategory === subId;
            return (
              <button
                key={subId}
                type="button"
                data-testid={`preset-${subId}`}
                onClick={() => onSelectSubcategory(subId)}
                style={{
                  borderColor: active
                    ? "var(--tool-fg)"
                    : "var(--tool-border)",
                  backgroundColor: active
                    ? "var(--tool-surface-active)"
                    : "var(--tool-surface-elevated)",
                  color: "var(--tool-fg)",
                }}
                className={`rounded-xl border p-5 text-left transition-all cursor-pointer min-h-[108px] flex flex-col justify-between ${
                  active ? "ring-1 ring-border-strong" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-semibold">{item.title}</span>
                  {active && <Check className="h-4 w-4 shrink-0" />}
                </div>
                <p
                  style={{ color: "var(--tool-muted)" }}
                  className="mt-2 text-xs leading-relaxed opacity-90"
                >
                  {item.line}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (intakeStep === 2) {
    return (
      <div className="space-y-6">
        <div>
          <h2
            ref={stepHeadingRef}
            tabIndex={-1}
            className="text-2xl sm:text-3xl font-semibold tracking-tight outline-none"
          >
            {UI_STRINGS.intake.q2.question}
          </h2>
          <p style={{ color: "var(--tool-muted)" }} className="mt-1.5 text-sm">
            {UI_STRINGS.intake.q2.helper}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="intake-brand-input"
              className="block text-xs font-medium mb-1.5"
            >
              Dealership or brand name
            </label>
            <input
              ref={nameInputRef}
              id="intake-brand-input"
              data-testid="input-brand-name"
              type="text"
              value={config.brandName}
              placeholder={UI_STRINGS.intake.q2.placeholder}
              onChange={(e) =>
                onSetConfig((prev) => ({
                  ...prev,
                  brandName: e.target.value,
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

          <div>
            <label
              htmlFor="intake-model-input"
              className="block text-xs font-medium mb-1.5"
            >
              {UI_STRINGS.intake.q2.modelLabel}
            </label>
            <input
              id="intake-model-input"
              data-testid="input-model-name"
              type="text"
              value={config.modelName}
              placeholder={UI_STRINGS.intake.q2.modelPlaceholder}
              onChange={(e) =>
                onSetConfig((prev) => ({
                  ...prev,
                  modelName: e.target.value,
                }))
              }
              style={{
                borderColor: "var(--tool-border-strong)",
                backgroundColor: "var(--tool-surface-elevated)",
                color: "var(--tool-fg)",
              }}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
            />
          </div>
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
          {UI_STRINGS.intake.q3.question}
        </h2>
        <p style={{ color: "var(--tool-muted)" }} className="mt-1.5 text-sm">
          {UI_STRINGS.intake.q3.helper}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {UI_STRINGS.visitorActions.map((act) => {
          const active = (config.primaryCta || "Book a test drive") === act.id;
          return (
            <button
              key={act.id}
              type="button"
              data-testid={`cta-option-${act.id}`}
              onClick={() =>
                onSetConfig((prev) => ({
                  ...prev,
                  primaryCta: act.id,
                }))
              }
              style={{
                borderColor: active ? "var(--tool-fg)" : "var(--tool-border)",
                backgroundColor: active
                  ? "var(--tool-surface-active)"
                  : "var(--tool-surface-elevated)",
                color: "var(--tool-fg)",
              }}
              className={`rounded-xl border p-5 text-left transition-all cursor-pointer min-h-[104px] flex flex-col justify-between ${
                active ? "ring-1 ring-border-strong" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-semibold">{act.label}</span>
                {active && <Check className="h-4 w-4 shrink-0" />}
              </div>
              <p
                style={{ color: "var(--tool-muted)" }}
                className="mt-2 text-xs leading-relaxed opacity-90"
              >
                {act.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

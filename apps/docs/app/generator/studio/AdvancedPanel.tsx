"use client";

import React from "react";
import {
  ArchetypeId,
  GeneratorUserConfig,
  SynthesizedLandingPayload,
} from "../../../lib/generator/schema";
import { UI_STRINGS } from "../../../lib/generator/ui-strings";
import { InfoTooltip } from "./InfoTooltip";

export function AdvancedPanel({
  config,
  payload,
  onSetConfig,
  onApplyToolTheme,
}: {
  config: GeneratorUserConfig;
  payload: SynthesizedLandingPayload;
  onSetConfig: React.Dispatch<React.SetStateAction<GeneratorUserConfig>>;
  onApplyToolTheme: (mode: "dark" | "light", persist?: boolean) => void;
}) {
  return (
    <div
      data-testid="panel-advanced"
      style={{
        borderColor: "var(--tool-border)",
        backgroundColor: "var(--tool-surface)",
      }}
      className="rounded-xl border p-5 space-y-5"
    >
      <div
        style={{ borderColor: "var(--tool-border)" }}
        className="flex items-center justify-between border-b pb-3"
      >
        <h3 className="text-sm font-semibold">{UI_STRINGS.advanced.title}</h3>
        <span style={{ color: "var(--tool-muted)" }} className="text-xs">
          Linter: {payload.linter.checks.filter((c) => c.passed).length}/
          {payload.linter.checks.length} passed
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-medium block">
            {UI_STRINGS.advanced.seedLabel}
            <InfoTooltip text={UI_STRINGS.advanced.tooltips.seed} />
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const active = config.variationSeed === num;
              return (
                <button
                  key={num}
                  type="button"
                  data-testid={`seed-btn-${num}`}
                  onClick={() =>
                    onSetConfig((prev) => ({
                      ...prev,
                      variationSeed: num,
                      heroOverrideId: undefined,
                    }))
                  }
                  style={{
                    borderColor: active
                      ? "var(--tool-fg)"
                      : "var(--tool-border)",
                    backgroundColor: active
                      ? "var(--tool-surface-active)"
                      : "var(--tool-surface-elevated)",
                    color: "var(--tool-fg)",
                  }}
                  className="rounded-lg border py-1.5 font-mono text-xs font-medium tabular-nums cursor-pointer"
                >
                  #{num}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-medium block">
            {UI_STRINGS.advanced.archetypeLabel}
            <InfoTooltip text={UI_STRINGS.advanced.tooltips.archetype} />
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                { id: "auto", label: "Auto" },
                { id: "monolith", label: "Monolith" },
                { id: "track", label: "Track" },
                { id: "editorial", label: "Editorial" },
                { id: "showroom", label: "Showroom" },
              ] as const
            ).map((item) => {
              const active = config.forcedArchetype === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onSetConfig((prev) => ({
                      ...prev,
                      forcedArchetype: item.id as ArchetypeId | "auto",
                    }))
                  }
                  style={{
                    borderColor: active
                      ? "var(--tool-fg)"
                      : "var(--tool-border)",
                    backgroundColor: active
                      ? "var(--tool-surface-active)"
                      : "var(--tool-surface-elevated)",
                    color: "var(--tool-fg)",
                  }}
                  className="rounded-lg border px-2.5 py-1.5 text-xs font-medium cursor-pointer"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-2">
          <span className="text-xs font-medium block">
            {UI_STRINGS.advanced.themeLabel}
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {(["dark", "light"] as const).map((mode) => {
              const active = config.themeMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onApplyToolTheme(mode, true)}
                  style={{
                    borderColor: active
                      ? "var(--tool-fg)"
                      : "var(--tool-border)",
                    backgroundColor: active
                      ? "var(--tool-surface-active)"
                      : "var(--tool-surface-elevated)",
                    color: "var(--tool-fg)",
                  }}
                  className="rounded-lg border py-1.5 text-xs font-medium capitalize cursor-pointer"
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{ borderColor: "var(--tool-border)" }}
        className="border-t pt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
      >
        {payload.linter.checks.map((chk) => (
          <div
            key={chk.id}
            style={{
              borderColor: "var(--tool-border)",
              backgroundColor: "var(--tool-surface-elevated)",
            }}
            className="rounded-lg border px-3 py-2 text-xs flex items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <span className="font-semibold block truncate">{chk.label}</span>
              <span
                style={{ color: "var(--tool-muted)" }}
                className="text-[11px] block truncate"
              >
                {chk.actual}
              </span>
            </div>
            <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold shrink-0">
              PASS
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

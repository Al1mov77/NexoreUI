"use client";

import { Check } from "lucide-react";
import React from "react";
import { ENGINEERING_TAG_META } from "../../../lib/generator/catalog-auto";
import {
  EngineeringTag,
  GeneratorUserConfig,
  SynthesizedLandingPayload,
} from "../../../lib/generator/schema";
import { UI_STRINGS } from "../../../lib/generator/ui-strings";
import {
  getAssetImageUrl,
  getAssetObjectPosition,
} from "../canvas/canvas-types";
import { TONE_ORDER } from "./studio-types";

export function RefinePanel({
  config,
  payload,
  onSetConfig,
  onToggleFocusTag,
  onClose,
}: {
  config: GeneratorUserConfig;
  payload: SynthesizedLandingPayload;
  onSetConfig: React.Dispatch<React.SetStateAction<GeneratorUserConfig>>;
  onToggleFocusTag: (tag: EngineeringTag) => void;
  onClose: () => void;
}) {
  return (
    <div
      data-testid="panel-refine"
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
        <div>
          <h3 className="text-sm font-semibold">{UI_STRINGS.refine.title}</h3>
          <p style={{ color: "var(--tool-muted)" }} className="text-xs">
            {UI_STRINGS.refine.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            borderColor: "var(--tool-border)",
            backgroundColor: "var(--tool-surface-elevated)",
            color: "var(--tool-fg)",
          }}
          className="rounded-lg border px-3 py-1 text-xs font-medium cursor-pointer"
        >
          {UI_STRINGS.refine.closeButton}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6 space-y-2.5">
          <span className="text-xs font-medium block">
            {UI_STRINGS.refine.swapHeroLabel}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {payload.allScoredCandidates
              .filter((c) => c.asset.heroViability >= 80)
              .slice(0, 4)
              .map((cand) => {
                const selected = payload.heroAsset.asset.id === cand.asset.id;
                return (
                  <button
                    key={cand.asset.id}
                    type="button"
                    data-testid={`refine-hero-${cand.asset.id}`}
                    onClick={() =>
                      onSetConfig((prev) => ({
                        ...prev,
                        heroOverrideId: cand.asset.id,
                      }))
                    }
                    style={{
                      borderColor: selected
                        ? "var(--tool-accent)"
                        : "var(--tool-border)",
                      backgroundColor: "var(--tool-surface-elevated)",
                    }}
                    className="overflow-hidden rounded-lg border text-left cursor-pointer transition-all"
                  >
                    <img
                      src={getAssetImageUrl(cand)}
                      alt={cand.asset.partCode}
                      style={{
                        objectPosition: getAssetObjectPosition(cand.asset),
                      }}
                      className="h-16 w-full object-cover"
                    />
                    <div className="p-1.5 text-[10px]">
                      <div className="font-semibold truncate">
                        {cand.asset.shotScale}
                      </div>
                      <div
                        style={{ color: "var(--tool-muted)" }}
                        className="font-mono tabular-nums"
                      >
                        {cand.score.total} pts
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-2.5">
          <span className="text-xs font-medium block">
            {UI_STRINGS.refine.switchToneLabel}
          </span>
          <div className="grid grid-cols-2 gap-2">
            {TONE_ORDER.map((tId) => {
              const active = config.tone === tId;
              return (
                <button
                  key={tId}
                  type="button"
                  onClick={() =>
                    onSetConfig((prev) => ({ ...prev, tone: tId }))
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
                  className="rounded-lg border px-2.5 py-2 text-xs font-medium cursor-pointer"
                >
                  {UI_STRINGS.tones[tId].title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-2.5">
          <span className="text-xs font-medium block">
            {UI_STRINGS.refine.switchCtaLabel}
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {UI_STRINGS.visitorActions.map((act) => {
              const active =
                (config.primaryCta || "Book a test drive") === act.id;
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() =>
                    onSetConfig((prev) => ({
                      ...prev,
                      primaryCta: act.id,
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
                  className="rounded-lg border px-3 py-1.5 text-left text-xs font-medium cursor-pointer"
                >
                  {act.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{ borderColor: "var(--tool-border)" }}
        className="border-t pt-4 grid gap-5 lg:grid-cols-12"
      >
        <div className="lg:col-span-7 space-y-2">
          <span className="text-xs font-medium block">
            Hardware focus systems
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ENGINEERING_TAG_META.map((tag) => {
              const active = config.focusTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  data-testid={`refine-tag-${tag.id}`}
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
                  className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium cursor-pointer"
                >
                  {active && <Check className="h-3 w-3 shrink-0" />}
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-3 gap-2.5">
          <div>
            <label
              htmlFor="refine-power-hp"
              style={{ color: "var(--tool-muted)" }}
              className="block text-[11px] font-medium mb-1"
            >
              Output (hp)
            </label>
            <input
              id="refine-power-hp"
              type="number"
              min={150}
              max={2500}
              step={10}
              value={config.customMetrics.powerHp}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isFinite(v)) return;
                onSetConfig((prev) => ({
                  ...prev,
                  customMetrics: {
                    ...prev.customMetrics,
                    powerHp: Math.min(2500, Math.max(150, v)),
                  },
                }));
              }}
              style={{
                borderColor: "var(--tool-border)",
                backgroundColor: "var(--tool-surface-elevated)",
                color: "var(--tool-fg)",
              }}
              className="w-full rounded-lg border px-2.5 py-1.5 font-mono text-xs tabular-nums outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="refine-accel-sec"
              style={{ color: "var(--tool-muted)" }}
              className="block text-[11px] font-medium mb-1"
            >
              0-100 km/h (s)
            </label>
            <input
              id="refine-accel-sec"
              type="number"
              min={1.4}
              max={9.9}
              step={0.05}
              value={config.customMetrics.accelSeconds}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isFinite(v)) return;
                onSetConfig((prev) => ({
                  ...prev,
                  customMetrics: {
                    ...prev.customMetrics,
                    accelSeconds: Number(
                      Math.min(9.9, Math.max(1.4, v)).toFixed(2)
                    ),
                  },
                }));
              }}
              style={{
                borderColor: "var(--tool-border)",
                backgroundColor: "var(--tool-surface-elevated)",
                color: "var(--tool-fg)",
              }}
              className="w-full rounded-lg border px-2.5 py-1.5 font-mono text-xs tabular-nums outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="refine-price-usd"
              style={{ color: "var(--tool-muted)" }}
              className="block text-[11px] font-medium mb-1"
            >
              Base price ($)
            </label>
            <input
              id="refine-price-usd"
              type="number"
              min={30000}
              max={5000000}
              step={5000}
              value={config.customMetrics.basePriceUsd}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isFinite(v)) return;
                onSetConfig((prev) => ({
                  ...prev,
                  customMetrics: {
                    ...prev.customMetrics,
                    basePriceUsd: Math.min(5000000, Math.max(30000, v)),
                  },
                }));
              }}
              style={{
                borderColor: "var(--tool-border)",
                backgroundColor: "var(--tool-surface-elevated)",
                color: "var(--tool-fg)",
              }}
              className="w-full rounded-lg border px-2.5 py-1.5 font-mono text-xs tabular-nums outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

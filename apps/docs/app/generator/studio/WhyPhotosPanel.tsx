"use client";

import React from "react";
import {
  GeneratorUserConfig,
  SynthesizedLandingPayload,
} from "../../../lib/generator/schema";
import {
  getAssetImageUrl,
  getAssetObjectPosition,
} from "../canvas/canvas-types";

export function WhyPhotosPanel({
  config,
  payload,
  onToggleXRay,
}: {
  config: GeneratorUserConfig;
  payload: SynthesizedLandingPayload;
  onToggleXRay: (checked: boolean) => void;
}) {
  return (
    <div
      data-testid="panel-why-photos"
      style={{
        borderColor: "var(--tool-border)",
        backgroundColor: "var(--tool-surface)",
      }}
      className="rounded-xl border p-5 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">
            Why these{" "}
            {Math.min(
              1 + payload.featureAssets.length,
              payload.allScoredCandidates.length
            )}{" "}
            curated assets were selected from{" "}
            {payload.allScoredCandidates.length} candidates
          </h3>
          <p style={{ color: "var(--tool-muted)" }} className="text-xs">
            Each asset is scored by shot scale, negative space for headline
            legibility, focal framing, and palette harmony.
          </p>
        </div>
        <label
          style={{ color: "var(--tool-muted)" }}
          className="inline-flex items-center gap-2 text-xs cursor-pointer"
        >
          <input
            type="checkbox"
            checked={config.showXRayScoring}
            onChange={(e) => onToggleXRay(e.target.checked)}
            className="rounded"
          />
          <span>Show score badges on page</span>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[payload.heroAsset, ...payload.featureAssets.slice(0, 4)].map(
          (item, idx) => {
            const focalSummary = item.asset.focalPoint
              ? `${Math.round(item.asset.focalPoint.x * 100)}%/${Math.round(
                  item.asset.focalPoint.y * 100
                )}%`
              : "auto";
            const safeRegion = item.asset.safeTextArea?.region ?? "auto";
            return (
              <div
                key={item.asset.id}
                style={{
                  borderColor: "var(--tool-border)",
                  backgroundColor: "var(--tool-surface-elevated)",
                }}
                className="rounded-lg border p-3 flex gap-3"
              >
                <img
                  src={getAssetImageUrl(item)}
                  alt={item.asset.partCode}
                  style={{
                    objectPosition: getAssetObjectPosition(item.asset),
                  }}
                  className="h-16 w-24 object-cover rounded shrink-0"
                />
                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">
                      {idx === 0 ? "Hero asset" : `Gallery #${idx}`}
                    </span>
                    <span
                      style={{
                        backgroundColor: "var(--tool-accent)",
                        color: "var(--tool-accent-fg)",
                      }}
                      className="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums"
                    >
                      {item.score.total} pts
                    </span>
                  </div>
                  <p
                    style={{ color: "var(--tool-muted)" }}
                    className="truncate mt-0.5"
                  >
                    {item.asset.shotScale} · {item.asset.negativeSpace}
                  </p>
                  <p
                    style={{ color: "var(--tool-muted)" }}
                    className="text-[11px] font-mono truncate mt-0.5"
                  >
                    focal {focalSummary} · safe {safeRegion}
                  </p>
                  <p
                    style={{ color: "var(--tool-muted)" }}
                    className="text-[11px] truncate mt-0.5"
                  >
                    {item.score.reasons[0]}
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

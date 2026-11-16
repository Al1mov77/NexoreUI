"use client";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  History,
  Info,
  RefreshCw,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import React from "react";
import {
  GeneratorUserConfig,
  SynthesizedLandingPayload,
} from "../../../lib/generator/schema";
import { UI_STRINGS } from "../../../lib/generator/ui-strings";
import { HistoryBuildEntry } from "./studio-types";

export function ReadyToolbar({
  lastBuildSeconds,
  sanitizedConfig,
  payload,
  showWhyPhotos,
  showRefinePanel,
  showAdvanced,
  copiedShare,
  buildHistory,
  onToggleWhyPhotos,
  onNextVariation,
  onToggleRefinePanel,
  onToggleExportModal,
  onCopyShareLink,
  onToggleAdvanced,
  onSelectHistoryConfig,
}: {
  lastBuildSeconds: string;
  sanitizedConfig: GeneratorUserConfig;
  payload: SynthesizedLandingPayload;
  showWhyPhotos: boolean;
  showRefinePanel: boolean;
  showAdvanced: boolean;
  copiedShare: boolean;
  buildHistory: HistoryBuildEntry[];
  onToggleWhyPhotos: () => void;
  onNextVariation: () => void;
  onToggleRefinePanel: () => void;
  onToggleExportModal: () => void;
  onCopyShareLink: () => void;
  onToggleAdvanced: () => void;
  onSelectHistoryConfig: (cfg: GeneratorUserConfig) => void;
}) {
  return (
    <>
      <div
        data-testid="post-build-bar"
        style={{
          borderColor: "var(--tool-border)",
          backgroundColor: "var(--tool-surface)",
        }}
        className="rounded-xl border px-4 py-3 flex flex-wrap items-center justify-between gap-3"
      >
        <div
          style={{ color: "var(--tool-muted)" }}
          className="flex flex-wrap items-center gap-2 text-xs"
        >
          <span style={{ color: "var(--tool-fg)" }} className="font-semibold">
            {UI_STRINGS.postBuild.builtPrefix} {lastBuildSeconds}
            {UI_STRINGS.postBuild.secondsShort}
          </span>
          <span>·</span>
          <span>
            {Math.min(
              1 + payload.featureAssets.length,
              payload.allScoredCandidates.length
            )}{" "}
            {UI_STRINGS.postBuild.photosUsedMiddle}{" "}
            {payload.allScoredCandidates.length}{" "}
            {UI_STRINGS.postBuild.photosUsedSuffix}
          </span>
          <span>·</span>
          <span>
            Seed #{sanitizedConfig.variationSeed} ({payload.tokens.archetype})
          </span>
          {payload.thinLibraryNotice && (
            <>
              <span>·</span>
              <span
                style={{ color: "var(--tool-accent)" }}
                className="font-medium"
              >
                {payload.thinLibraryNotice}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="btn-why-photos"
            onClick={onToggleWhyPhotos}
            style={{
              borderColor: showWhyPhotos
                ? "var(--tool-accent)"
                : "var(--tool-border)",
              backgroundColor: showWhyPhotos
                ? "var(--tool-accent)"
                : "var(--tool-surface-elevated)",
              color: showWhyPhotos ? "var(--tool-accent-fg)" : "var(--tool-fg)",
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            <Info className="h-3.5 w-3.5" />
            <span>{UI_STRINGS.postBuild.whyPhotosButton}</span>
          </button>

          <button
            type="button"
            data-testid="btn-new-variant"
            onClick={onNextVariation}
            style={{
              borderColor: "var(--tool-border)",
              backgroundColor: "var(--tool-surface-elevated)",
              color: "var(--tool-fg)",
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{UI_STRINGS.postBuild.newVariantButton}</span>
          </button>

          <button
            type="button"
            data-testid="btn-refine"
            onClick={onToggleRefinePanel}
            style={{
              borderColor: showRefinePanel
                ? "var(--tool-accent)"
                : "var(--tool-border)",
              backgroundColor: showRefinePanel
                ? "var(--tool-accent)"
                : "var(--tool-surface-elevated)",
              color: showRefinePanel
                ? "var(--tool-accent-fg)"
                : "var(--tool-fg)",
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{UI_STRINGS.postBuild.refineButton}</span>
          </button>

          <button
            type="button"
            data-testid="btn-export-code"
            onClick={onToggleExportModal}
            style={{
              backgroundColor: "var(--tool-accent)",
              color: "var(--tool-accent-fg)",
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium cursor-pointer"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>{UI_STRINGS.postBuild.exportCodeButton}</span>
          </button>

          <button
            type="button"
            data-testid="btn-share-link"
            onClick={onCopyShareLink}
            style={{
              borderColor: "var(--tool-border)",
              backgroundColor: "var(--tool-surface-elevated)",
              color: "var(--tool-fg)",
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            {copiedShare ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Share2 className="h-3.5 w-3.5" />
            )}
            <span>
              {copiedShare
                ? UI_STRINGS.postBuild.shareLinkCopied
                : UI_STRINGS.postBuild.shareLinkButton}
            </span>
          </button>

          <button
            type="button"
            data-testid="btn-advanced"
            onClick={onToggleAdvanced}
            style={{
              borderColor: "var(--tool-border)",
              backgroundColor: "var(--tool-surface-elevated)",
              color: "var(--tool-fg)",
            }}
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            <span>{UI_STRINGS.postBuild.advancedButton}</span>
            {showAdvanced ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {buildHistory.length > 0 && (
        <div
          style={{
            borderColor: "var(--tool-border)",
            backgroundColor: "var(--tool-surface)",
          }}
          className="rounded-xl border px-4 py-2.5 flex flex-wrap items-center gap-2 text-xs"
        >
          <span
            style={{ color: "var(--tool-muted)" }}
            className="inline-flex items-center gap-1.5 font-medium mr-1"
          >
            <History className="h-3.5 w-3.5" />
            <span>{UI_STRINGS.postBuild.historyLabel}:</span>
          </span>
          {buildHistory.map((item) => {
            const isCurrent =
              item.config.variationSeed === sanitizedConfig.variationSeed &&
              item.config.subcategory === sanitizedConfig.subcategory &&
              item.config.tone === sanitizedConfig.tone;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectHistoryConfig(item.config)}
                style={{
                  borderColor: isCurrent
                    ? "var(--tool-accent)"
                    : "var(--tool-border)",
                  backgroundColor: isCurrent
                    ? "var(--tool-accent)"
                    : "var(--tool-surface-elevated)",
                  color: isCurrent
                    ? "var(--tool-accent-fg)"
                    : "var(--tool-fg)",
                }}
                className="rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer"
              >
                {item.label} · {item.timestamp}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

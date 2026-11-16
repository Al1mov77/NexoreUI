"use client";

import { motion } from "framer-motion";
import { Check, Film } from "lucide-react";
import type { ScoredAsset, SynthesizedLandingPayload } from "../../../lib/generator/schema";
import { UI_STRINGS } from "../../../lib/generator/ui-strings";
import { getAssetImageUrl, getAssetObjectPosition } from "../canvas/canvas-types";

interface StageViewProps {
  payload: SynthesizedLandingPayload;
  reducedMotion: boolean;
}

const STAGE_EASE = [0.22, 1, 0.36, 1] as const;

function getStageMotionProps(reducedMotion: boolean) {
  return {
    initial: reducedMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: reducedMotion ? { duration: 0 } : { duration: 0.22, ease: STAGE_EASE },
  } as const;
}

function getHeroMediaLabel(asset: ScoredAsset["asset"]): string {
  if (asset.mediaType === "video") {
    const frames = asset.video?.scrollFrameCount;
    return frames ? `Scroll clip, ${frames} frames` : "Scroll motion clip";
  }
  return asset.shotScale;
}

export function StageBriefAndMetrics({ payload, reducedMotion }: StageViewProps) {
  const presetTitle = UI_STRINGS.presets[payload.config.subcategory].title;
  const briefRows = [
    { label: "Brand & Model", value: `${payload.config.brandName} ${payload.config.modelName}` },
    { label: "Preset", value: presetTitle },
    { label: "Tone & Theme", value: `${payload.config.tone} / ${payload.config.themeMode}` },
    {
      label: "Market & Variant",
      value: `${payload.config.location} / #${String(payload.config.variationSeed).padStart(2, "0")}`,
    },
  ];

  return (
    <motion.div {...getStageMotionProps(reducedMotion)} className="space-y-5">
      <div
        style={{ borderColor: "var(--tool-border)", backgroundColor: "var(--tool-bg)" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border rounded-lg overflow-hidden"
      >
        {briefRows.map((row, idx) => (
          <div
            key={row.label}
            style={{ borderColor: "var(--tool-border)" }}
            className={`px-4 py-3 space-y-1 ${idx > 0 ? "border-t sm:border-t-0 lg:border-l" : ""} ${
              idx === 1 ? "sm:border-l" : ""
            } ${idx >= 2 ? "sm:border-t lg:border-t-0" : ""} ${idx === 3 ? "sm:border-l" : ""}`}
          >
            <div style={{ color: "var(--tool-muted)" }} className="text-[11px] font-mono uppercase tracking-wider">
              {row.label}
            </div>
            <div style={{ color: "var(--tool-fg)" }} className="text-xs font-medium truncate">
              {row.value}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2.5">
        <div
          style={{ color: "var(--tool-muted)" }}
          className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider"
        >
          <span>Normalized Specifications</span>
          <span className="tabular-nums">{payload.validatedMetrics.length} Verified Figures</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {payload.validatedMetrics.slice(0, 6).map((metric, idx) => (
            <motion.div
              key={metric.id}
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.2, delay: idx * 0.035, ease: STAGE_EASE }
              }
              style={{ borderColor: "var(--tool-border)", backgroundColor: "var(--tool-surface-elevated)" }}
              className="border rounded-lg px-3.5 py-2.5"
            >
              <div style={{ color: "var(--tool-muted)" }} className="text-[11px] truncate">
                {metric.label}
              </div>
              <div style={{ color: "var(--tool-fg)" }} className="mt-1 text-base font-semibold tracking-tight tabular-nums">
                {metric.displayValue}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {payload.config.focusTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span style={{ color: "var(--tool-muted)" }} className="text-[11px] font-mono uppercase tracking-wider">
            Focus Tags
          </span>
          {payload.config.focusTags.map((tag) => (
            <span
              key={tag}
              style={{
                borderColor: "var(--tool-border)",
                backgroundColor: "var(--tool-bg)",
                color: "var(--tool-fg)",
              }}
              className="px-2 py-0.5 text-[11px] font-mono rounded border"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function StageAssetContactSheet({ payload, reducedMotion }: StageViewProps) {
  const candidates = payload.allScoredCandidates.slice(0, 8);
  const heroId = payload.heroAsset.asset.id;

  return (
    <motion.div {...getStageMotionProps(reducedMotion)} className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {candidates.map((cand, idx) => {
          const isSelected = cand.asset.id === heroId;
          return (
            <motion.div
              key={cand.asset.id}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.22, delay: idx * 0.03, ease: STAGE_EASE }
              }
              style={{
                borderColor: isSelected ? "var(--tool-accent)" : "var(--tool-border)",
                backgroundColor: isSelected ? "var(--tool-surface-elevated)" : "var(--tool-bg)",
              }}
              className="rounded-lg overflow-hidden border transition-colors"
            >
              <div style={{ backgroundColor: "var(--tool-surface)" }} className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={getAssetImageUrl(cand)}
                  alt={cand.asset.partCode}
                  style={{ objectPosition: getAssetObjectPosition(cand.asset) }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-2.5 py-2 flex items-center justify-between gap-2 text-[11px] font-mono">
                <span
                  style={{ color: isSelected ? "var(--tool-fg)" : "var(--tool-muted)" }}
                  className={`truncate ${isSelected ? "font-semibold" : ""}`}
                >
                  {cand.asset.partCode}
                </span>
                <span style={{ color: "var(--tool-muted)" }} className="inline-flex items-center gap-1 shrink-0 tabular-nums">
                  {cand.asset.mediaType === "video" && <Film className="w-3 h-3" />}
                  {cand.score.total}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div
        style={{ borderColor: "var(--tool-border)", color: "var(--tool-muted)" }}
        className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t text-[11px] font-mono"
      >
        <span>
          Evaluated {payload.allScoredCandidates.length} assets across subcategory, tone and framing weights
        </span>
        <span className="tabular-nums">
          {payload.eliminatedCandidates.length} excluded by quality threshold
        </span>
      </div>
    </motion.div>
  );
}

export function StageCandidateRanking({ payload, reducedMotion }: StageViewProps) {
  const { heroAsset } = payload;
  const runnersUp = payload.allScoredCandidates
    .filter((item) => item.asset.id !== heroAsset.asset.id)
    .slice(0, 2);

  const scoreRows = [
    { label: "Image & Lighting Quality", value: heroAsset.score.baseQuality, cap: 55 },
    { label: "Subcategory Alignment", value: heroAsset.score.subcategoryMatch, cap: 25 },
    { label: "Tone Fit", value: heroAsset.score.toneMatch, cap: 20 },
    { label: "Negative-Space Framing", value: heroAsset.score.compositionFit, cap: 20 },
    { label: "Engineering Tags", value: heroAsset.score.tagMatch, cap: 20 },
  ];

  return (
    <motion.div {...getStageMotionProps(reducedMotion)} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
      <div
        style={{ borderColor: "var(--tool-border)", backgroundColor: "var(--tool-bg)" }}
        className="md:col-span-7 rounded-lg overflow-hidden border"
      >
        <div style={{ backgroundColor: "var(--tool-surface)" }} className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={getAssetImageUrl(heroAsset)}
            alt={heroAsset.asset.partCode}
            style={{ objectPosition: getAssetObjectPosition(heroAsset.asset) }}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          style={{ borderColor: "var(--tool-border)" }}
          className="px-4 py-2.5 flex items-center justify-between gap-3 border-t text-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span style={{ color: "var(--tool-fg)" }} className="font-mono font-semibold truncate">
              {heroAsset.asset.partCode}
            </span>
            <span style={{ color: "var(--tool-muted)" }} className="font-mono text-[11px] truncate">
              {getHeroMediaLabel(heroAsset.asset)}
            </span>
          </div>
          <span style={{ color: "var(--tool-fg)" }} className="font-mono text-[11px] font-medium tabular-nums shrink-0">
            Score {heroAsset.score.total}
          </span>
        </div>
      </div>

      <div className="md:col-span-5 space-y-4">
        <div style={{ borderColor: "var(--tool-border)", backgroundColor: "var(--tool-bg)" }} className="rounded-lg border p-4 space-y-3">
          <div
            style={{ color: "var(--tool-muted)" }}
            className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider"
          >
            <span>Selection Weights</span>
            <span className="tabular-nums">Seed +{heroAsset.score.seedOffset}</span>
          </div>
          <div className="space-y-2.5">
            {scoreRows.map((row, idx) => {
              const pct = Math.max(8, Math.min(100, Math.round((row.value / row.cap) * 100)));
              return (
                <div key={row.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--tool-muted)" }}>{row.label}</span>
                    <span style={{ color: "var(--tool-fg)" }} className="font-mono tabular-nums">
                      +{row.value}
                    </span>
                  </div>
                  <div style={{ backgroundColor: "var(--tool-surface-elevated)" }} className="h-1 w-full rounded-full overflow-hidden">
                    <motion.div
                      initial={reducedMotion ? false : { scaleX: 0 }}
                      animate={{ scaleX: pct / 100 }}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { duration: 0.35, delay: idx * 0.04, ease: STAGE_EASE }
                      }
                      style={{ transformOrigin: "left", backgroundColor: "var(--tool-accent)" }}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {runnersUp.length > 0 && (
          <div style={{ borderColor: "var(--tool-border)", backgroundColor: "var(--tool-bg)" }} className="rounded-lg border overflow-hidden">
            {runnersUp.map((cand, idx) => (
              <div
                key={cand.asset.id}
                style={{ borderColor: "var(--tool-border)" }}
                className={`px-3 py-2 flex items-center justify-between gap-3 ${idx > 0 ? "border-t" : ""}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={getAssetImageUrl(cand)}
                    alt={cand.asset.partCode}
                    style={{ objectPosition: getAssetObjectPosition(cand.asset), borderColor: "var(--tool-border)" }}
                    className="w-11 h-7 rounded object-cover border shrink-0"
                  />
                  <span style={{ color: "var(--tool-muted)" }} className="text-[11px] font-mono truncate">
                    {cand.asset.partCode}
                  </span>
                </div>
                <span style={{ color: "var(--tool-muted)" }} className="text-[11px] font-mono tabular-nums shrink-0">
                  {cand.score.total} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function StageSequenceAndAudit({ payload, reducedMotion }: StageViewProps) {
  const { tokens, config, linter } = payload;
  const activePalette = config.themeMode === "light" ? tokens.palette.light : tokens.palette.dark;
  const swatches = [
    { label: "Ground", hex: activePalette.bg },
    { label: "Surface", hex: activePalette.surface },
    { label: "Ink", hex: activePalette.fg },
    { label: "Accent", hex: activePalette.accent },
  ];

  const blocks = [
    { index: "01", code: tokens.heroVariant, title: `${tokens.archetypeLabel} Hero Stage`, meta: tokens.heroVariantLabel },
    ...payload.sections.slice(0, 4).map((sec, i) => ({
      index: String(i + 2).padStart(2, "0"),
      code: sec.code,
      title: sec.title,
      meta: `${sec.primaryAssets.length} media plates`,
    })),
  ];

  return (
    <motion.div {...getStageMotionProps(reducedMotion)} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <div className="lg:col-span-7 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {swatches.map((swatch) => (
            <div
              key={swatch.label}
              style={{ borderColor: "var(--tool-border)", backgroundColor: "var(--tool-bg)" }}
              className="rounded-lg border p-2.5 space-y-2"
            >
              <div className="h-6 w-full rounded border" style={{ backgroundColor: swatch.hex, borderColor: "var(--tool-border)" }} />
              <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                <span style={{ color: "var(--tool-muted)" }}>{swatch.label}</span>
                <span style={{ color: "var(--tool-fg)" }} className="uppercase">
                  {swatch.hex}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderColor: "var(--tool-border)", backgroundColor: "var(--tool-bg)" }} className="rounded-lg border overflow-hidden">
          {blocks.map((block, idx) => (
            <div
              key={block.index}
              style={{ borderColor: "var(--tool-border)" }}
              className={`px-3.5 py-2.5 flex items-center justify-between gap-3 ${idx > 0 ? "border-t" : ""}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span style={{ color: "var(--tool-muted)" }} className="text-[11px] font-mono tabular-nums w-5 shrink-0">
                  {block.index}
                </span>
                <div className="min-w-0">
                  <div style={{ color: "var(--tool-fg)" }} className="text-xs font-medium truncate">
                    {block.title}
                  </div>
                  <div style={{ color: "var(--tool-muted)" }} className="text-[11px] font-mono truncate">
                    {block.code}
                  </div>
                </div>
              </div>
              <span style={{ color: "var(--tool-muted)" }} className="text-[11px] font-mono shrink-0 hidden sm:inline">
                {block.meta}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderColor: "var(--tool-border)", backgroundColor: "var(--tool-bg)" }} className="lg:col-span-5 rounded-lg border p-4 space-y-3">
        <div
          style={{ color: "var(--tool-muted)" }}
          className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider"
        >
          <span>Quality Gate Checks</span>
          <span className="tabular-nums">
            {tokens.fontPair.displayFamily} / {tokens.cardRadius}
          </span>
        </div>

        <div>
          {linter.checks.slice(0, 7).map((check, idx) => (
            <div
              key={check.id}
              style={{ borderColor: "var(--tool-border)" }}
              className={`py-2 flex items-center justify-between gap-2 text-xs ${idx > 0 ? "border-t" : ""}`}
            >
              <span style={{ color: "var(--tool-fg)" }} className="inline-flex items-center gap-2 truncate">
                <Check style={{ color: "var(--tool-muted)" }} className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{check.label}</span>
              </span>
              <span style={{ color: "var(--tool-muted)" }} className="font-mono text-[11px] shrink-0">
                {check.passed ? check.actual : "Adjusting"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function StageTypographicProof({ payload, reducedMotion }: StageViewProps) {
  const { tokens, config, heroAsset, linter } = payload;
  const activePalette = config.themeMode === "light" ? tokens.palette.light : tokens.palette.dark;
  const canHandoffPlate = heroAsset.asset.mediaType !== "video" && !reducedMotion;

  return (
    <motion.div
      {...getStageMotionProps(reducedMotion)}
      style={{ backgroundColor: activePalette.bg, color: activePalette.fg, borderColor: activePalette.border }}
      className="rounded-xl border p-5 sm:p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-4">
          <h3
            style={{
              fontFamily: tokens.fontPair.displayFamily,
              letterSpacing: tokens.fontPair.headingTracking,
              fontWeight: tokens.fontPair.headingWeight,
              textTransform: tokens.fontPair.uppercaseDisplay ? "uppercase" : "none",
            }}
            className="text-2xl sm:text-3xl leading-[1.06] text-balance"
          >
            {payload.headline}
          </h3>

          <p style={{ fontFamily: tokens.fontPair.bodyFamily, color: activePalette.muted }} className="text-sm leading-relaxed max-w-xl">
            {payload.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span
              style={{ backgroundColor: activePalette.accent, color: activePalette.accentFg, borderRadius: tokens.buttonRadius }}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold"
            >
              {payload.ctaPrimary}
            </span>
            <span
              style={{ borderColor: activePalette.border, color: activePalette.fg, borderRadius: tokens.buttonRadius }}
              className="inline-flex items-center px-4 py-2 text-xs font-medium border"
            >
              {payload.ctaSecondary}
            </span>
          </div>

          <div
            style={{ borderColor: activePalette.border, color: activePalette.muted }}
            className="pt-3 border-t flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-mono tabular-nums"
          >
            <span>{tokens.archetypeLabel}</span>
            <span>{tokens.palette.name}</span>
            <span>{tokens.fontPair.name}</span>
            <span>Contrast {linter.minContrastRatio.toFixed(1)}:1</span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div style={{ borderColor: activePalette.border, borderRadius: tokens.cardRadius }} className="overflow-hidden border aspect-[16/10] w-full">
            <motion.img
              layoutId={canHandoffPlate ? "generator-hero-plate" : undefined}
              src={getAssetImageUrl(heroAsset)}
              alt={payload.headline}
              style={{ objectPosition: getAssetObjectPosition(heroAsset.asset) }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

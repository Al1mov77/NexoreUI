"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { interpolateText } from "../../../../lib/generator/copy-bank";
import {
  getAssetImageUrl,
  getAssetObjectPosition,
  getTransitionSpec,
  SectionComponentProps,
} from "../canvas-types";
import { SectionShell, SectionTitleRow } from "./SectionShell";

export function StateMorphSection({
  section,
  payload,
  pal,
  reducedMotion,
  isBakery,
}: SectionComponentProps) {
  const { tokens, config, morphPack, featureAssets, validatedMetrics } = payload;
  const [activeMode, setActiveMode] = useState<"A" | "B">("A");
  const [trackPlateIdx, setTrackPlateIdx] = useState(0);

  if (isBakery) {
    const items = section.primaryAssets.length >= 2 ? section.primaryAssets : featureAssets;
    const plateA = items[0] || payload.heroAsset;
    const plateB = items[1] || payload.secondaryHeroAsset;
    const currentPlate = activeMode === "A" ? plateA : plateB;

    return (
      <SectionShell id={section.kind} tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
        <div className="space-y-8">
          <SectionTitleRow section={section} tokens={tokens} pal={pal} />
          <div className="flex flex-wrap gap-2">
            {(["A", "B"] as const).map((key) => {
              const label = key === "A" ? "Morning pastry bench" : "Afternoon hearth loaves";
              const isSelected = activeMode === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveMode(key)}
                  style={{
                    borderColor: isSelected ? pal.accent : pal.border,
                    color: isSelected ? pal.accentFg : pal.fg,
                    borderRadius: tokens.buttonRadius,
                  }}
                  className="relative border px-4 py-2.5 text-xs sm:text-sm font-medium min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 overflow-hidden"
                >
                  {isSelected && (
                    <motion.span
                      layoutId={reducedMotion ? undefined : "morph-mode-tab"}
                      transition={getTransitionSpec(tokens, reducedMotion)}
                      style={{ backgroundColor: pal.accent }}
                      className="absolute inset-0"
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
          <div className="grid lg:grid-cols-12 gap-6 items-center">
            <div
              style={{ borderColor: pal.border, borderRadius: tokens.cardRadius }}
              className="lg:col-span-7 border overflow-hidden aspect-[16/10]"
            >
              <img
                src={getAssetImageUrl(currentPlate)}
                alt={interpolateText(currentPlate.asset.titleTemplate, config)}
                style={{ objectPosition: getAssetObjectPosition(currentPlate.asset) }}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="lg:col-span-5 grid gap-4">
              {validatedMetrics.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  style={{
                    borderColor: pal.border,
                    backgroundColor: pal.surface,
                    borderRadius: tokens.cardRadius,
                  }}
                  className="border p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <div style={{ color: pal.fg }} className="text-sm font-semibold">
                      {m.label}
                    </div>
                    <div style={{ color: pal.muted }} className="text-xs">
                      {m.contextNote}
                    </div>
                  </div>
                  <span
                    style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                    className="text-xl font-semibold tabular-nums"
                  >
                    {m.displayValue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  const trackPlates = [
    { label: "Front aero stance", url: morphPack.stateBFrontUrl },
    { label: "Rear diffuser view", url: morphPack.stateBRearUrl },
    { label: "Ceramic brake cooling", url: morphPack.stateBBrakeUrl },
  ];

  const activeImageUrl =
    activeMode === "A"
      ? morphPack.stateAFrontUrl
      : (trackPlates[trackPlateIdx] || trackPlates[0]).url;
  const activeSpecs = activeMode === "A" ? morphPack.stateASpecs : morphPack.stateBSpecs;
  const activeDesc = activeMode === "A" ? morphPack.stateADescription : morphPack.stateBDescription;

  return (
    <SectionShell id={section.kind} tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
      <div className="space-y-8">
        <SectionTitleRow
          section={section}
          tokens={tokens}
          pal={pal}
          rightSlot={
            <div
              style={{
                borderColor: pal.border,
                backgroundColor: pal.surface,
                borderRadius: tokens.buttonRadius,
              }}
              className="inline-flex border p-1 self-start shrink-0"
            >
              {(["A", "B"] as const).map((key) => {
                const isSelected = activeMode === key;
                const label = key === "A" ? morphPack.stateACode : morphPack.stateBCode;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setActiveMode(key)}
                    style={{
                      color: isSelected ? pal.accentFg : pal.fg,
                      borderRadius: tokens.buttonRadius,
                    }}
                    className="relative px-4 py-2 text-xs sm:text-sm font-medium min-h-[36px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {isSelected && (
                      <motion.span
                        layoutId={reducedMotion ? undefined : "morph-mode-pill"}
                        transition={getTransitionSpec(tokens, reducedMotion)}
                        style={{ backgroundColor: pal.accent, borderRadius: tokens.buttonRadius }}
                        className="absolute inset-0"
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}
            </div>
          }
        />

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div
              style={{
                borderColor: pal.border,
                backgroundColor: pal.surface,
                borderRadius: tokens.cardRadius,
              }}
              className="relative border overflow-hidden aspect-[16/10]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeImageUrl}
                  src={activeImageUrl}
                  alt={activeMode === "A" ? morphPack.stateALabel : morphPack.stateBLabel}
                  initial={reducedMotion ? false : { opacity: 0.35 }}
                  animate={reducedMotion ? false : { opacity: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0.35 }}
                  transition={getTransitionSpec(tokens, reducedMotion)}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>

            {activeMode === "B" && (
              <div className="grid grid-cols-3 gap-3">
                {trackPlates.map((plate, idx) => {
                  const selected = idx === trackPlateIdx;
                  return (
                    <button
                      key={plate.url}
                      type="button"
                      onClick={() => setTrackPlateIdx(idx)}
                      style={{
                        borderColor: selected ? pal.accent : pal.border,
                        backgroundColor: pal.surface,
                        color: selected ? pal.fg : pal.muted,
                        borderRadius: tokens.buttonRadius,
                      }}
                      className="border p-2.5 text-left text-xs font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {plate.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div
            style={{
              borderColor: pal.border,
              backgroundColor: pal.surface,
              borderRadius: tokens.cardRadius,
            }}
            className="lg:col-span-5 border p-6 sm:p-8 flex flex-col justify-between gap-6"
          >
            <div className="space-y-2">
              <div
                style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
                className="text-xl font-semibold tracking-tight"
              >
                {activeMode === "A" ? morphPack.stateALabel : morphPack.stateBLabel}
              </div>
              <p style={{ color: pal.muted }} className="text-sm leading-relaxed">
                {activeDesc}
              </p>
            </div>

            <div style={{ borderColor: pal.border }} className="border-t divide-y">
              {activeSpecs.map((spec) => (
                <div
                  key={spec.id}
                  style={{ borderColor: pal.border }}
                  className="py-3.5 flex items-baseline justify-between gap-4"
                >
                  <div>
                    <div style={{ color: pal.fg }} className="text-sm font-medium">
                      {spec.label}
                    </div>
                    <div style={{ color: pal.muted }} className="text-xs">
                      {spec.contextNote}
                    </div>
                  </div>
                  <span
                    style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                    className="text-lg font-semibold tabular-nums shrink-0"
                  >
                    {spec.displayValue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

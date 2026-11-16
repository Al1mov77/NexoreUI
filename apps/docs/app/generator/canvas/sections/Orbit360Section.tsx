"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef, useState } from "react";
import { interpolateText } from "../../../../lib/generator/copy-bank";
import {
  getAssetImageUrl,
  getAssetObjectPosition,
  getTransitionSpec,
  SectionComponentProps,
} from "../canvas-types";
import { SectionShell, SectionTitleRow } from "./SectionShell";

export function Orbit360Section({
  section,
  payload,
  pal,
  reducedMotion,
  isBakery,
}: SectionComponentProps) {
  const { tokens, config, featureAssets } = payload;
  const [frameIdx, setFrameIdx] = useState(0);
  const dragStartX = useRef<number | null>(null);

  const bakeryFrames = (section.primaryAssets.length > 0 ? section.primaryAssets : featureAssets.slice(0, 4)).map(
    (scored, idx) => ({
      angle: idx * 60,
      label: `Plate ${String(idx + 1).padStart(2, "0")}`,
      url: getAssetImageUrl(scored),
      objectPosition: getAssetObjectPosition(scored.asset),
      note: interpolateText(scored.asset.descriptionByVoice[tokens.voice], config),
      readout: `${scored.asset.aspectRatio}`,
    })
  );

  const autoFrames = payload.orbitPack.frames.map((f) => ({
    angle: f.angle,
    label: `${f.angle}° ${f.label}`,
    url: f.url,
    objectPosition: "50% 50%",
    note: f.telemetryNote,
    readout: f.dragCoefficient,
  }));

  const frames = isBakery ? bakeryFrames : autoFrames;
  const active = frames[frameIdx % frames.length] || frames[0];
  if (!active) return null;

  const stepFrame = (delta: number) => {
    setFrameIdx((prev) => (prev + delta + frames.length) % frames.length);
  };

  return (
    <SectionShell id={section.kind} tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
      <div className="space-y-8">
        <SectionTitleRow
          section={section}
          tokens={tokens}
          pal={pal}
          rightSlot={
            <div className="flex items-center gap-3 shrink-0">
              {!isBakery && (
                <span
                  style={{
                    borderColor: pal.border,
                    backgroundColor: pal.surface,
                    color: pal.muted,
                    borderRadius: tokens.buttonRadius,
                    fontFamily: tokens.fontPair.monoFamily,
                  }}
                  className="hidden sm:inline-flex border px-3 py-1.5 text-xs tabular-nums"
                >
                  {config.brandName} {config.modelName} · {config.chassisCode}
                </span>
              )}
              <button
                type="button"
                aria-label="Previous angle"
                onClick={() => stepFrame(-1)}
                style={{
                  borderColor: pal.border,
                  backgroundColor: pal.surface,
                  color: pal.fg,
                  borderRadius: tokens.buttonRadius,
                }}
                className="border h-10 w-10 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next angle"
                onClick={() => stepFrame(1)}
                style={{
                  borderColor: pal.border,
                  backgroundColor: pal.surface,
                  color: pal.fg,
                  borderRadius: tokens.buttonRadius,
                }}
                className="border h-10 w-10 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          }
        />

        <div
          style={{
            borderColor: pal.border,
            backgroundColor: pal.surface,
            borderRadius: tokens.cardRadius,
          }}
          className="border overflow-hidden"
        >
          <div
            onPointerDown={(e) => {
              dragStartX.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (dragStartX.current === null) return;
              const diff = e.clientX - dragStartX.current;
              dragStartX.current = null;
              if (Math.abs(diff) > 36) {
                stepFrame(diff > 0 ? -1 : 1);
              }
            }}
            className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
          >
            <img
              src={active.url}
              alt={active.label}
              style={{ objectPosition: active.objectPosition }}
              className="h-full w-full object-cover"
              draggable={false}
            />
            <div
              style={{
                backgroundColor:
                  config.themeMode === "light" ? "rgba(255,255,255,0.9)" : "rgba(10,10,12,0.88)",
                borderColor: pal.border,
                color: pal.fg,
                borderRadius: tokens.buttonRadius,
              }}
              className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 border px-3 py-1.5 text-xs flex items-center gap-3 backdrop-blur-sm"
            >
              <span style={{ fontFamily: tokens.fontPair.monoFamily }} className="font-semibold tabular-nums">
                {active.readout}
              </span>
              <span style={{ color: pal.muted }}>{active.label}</span>
            </div>
          </div>

          <div
            style={{ borderColor: pal.border }}
            className="border-t p-4 sm:p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              {frames.map((item, idx) => {
                const isActive = idx === frameIdx % frames.length;
                return (
                  <button
                    key={item.label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setFrameIdx(idx)}
                    style={{
                      borderColor: isActive ? pal.accent : pal.border,
                      color: isActive ? pal.accentFg : pal.fg,
                      borderRadius: tokens.buttonRadius,
                    }}
                    className="relative border px-3 py-2 text-xs font-medium min-h-[36px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 overflow-hidden"
                  >
                    {isActive && (
                      <motion.span
                        layoutId={reducedMotion ? undefined : "orbit-angle-pill"}
                        transition={getTransitionSpec(tokens, reducedMotion)}
                        style={{ backgroundColor: pal.accent }}
                        className="absolute inset-0"
                      />
                    )}
                    <span
                      style={{ fontFamily: tokens.fontPair.monoFamily }}
                      className="relative z-10 tabular-nums"
                    >
                      {isBakery ? `${idx + 1}` : `${item.angle}°`}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p style={{ color: pal.muted }} className="text-sm leading-relaxed max-w-2xl">
                {active.note}
              </p>
              <div className="flex items-center gap-3 min-w-[180px]">
                <label htmlFor={`orbit-range-${section.kind}`} className="sr-only">
                  Angle slider
                </label>
                <input
                  id={`orbit-range-${section.kind}`}
                  type="range"
                  min={0}
                  max={frames.length - 1}
                  value={frameIdx % frames.length}
                  onChange={(e) => setFrameIdx(Number(e.target.value))}
                  style={{ accentColor: pal.accent }}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

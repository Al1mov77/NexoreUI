"use client";

import React, { useState } from "react";
import { interpolateText } from "../../../../lib/generator/copy-bank";
import {
  getAssetImageUrl,
  getAssetObjectPosition,
  SectionComponentProps,
} from "../canvas-types";
import { SectionShell, SectionTitleRow } from "./SectionShell";

export function CockpitPovSection({
  section,
  payload,
  pal,
  reducedMotion,
  isBakery,
}: SectionComponentProps) {
  const { tokens, config, cockpitPack, featureAssets } = payload;
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (isBakery) {
    const stations = (section.primaryAssets.length > 0 ? section.primaryAssets : featureAssets.slice(0, 3)).slice(0, 4);
    const currentStation = stations[selectedIdx % stations.length] || payload.heroAsset;
    return (
      <SectionShell id={section.kind} tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
        <div className="space-y-8">
          <SectionTitleRow section={section} tokens={tokens} pal={pal} />
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            <div
              style={{ borderColor: pal.border, borderRadius: tokens.cardRadius }}
              className="lg:col-span-7 border overflow-hidden aspect-[16/10]"
            >
              <img
                src={getAssetImageUrl(currentStation)}
                alt={interpolateText(currentStation.asset.titleTemplate, config)}
                style={{ objectPosition: getAssetObjectPosition(currentStation.asset) }}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-3">
              {stations.map((item, idx) => {
                const isSelected = idx === selectedIdx % stations.length;
                return (
                  <button
                    key={item.asset.id}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    style={{
                      borderColor: isSelected ? pal.accent : pal.border,
                      backgroundColor: pal.surface,
                      borderRadius: tokens.cardRadius,
                    }}
                    className="border p-4 text-left space-y-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <div
                      style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
                      className="text-sm font-semibold"
                    >
                      {interpolateText(item.asset.titleTemplate, config)}
                    </div>
                    <p style={{ color: pal.muted }} className="text-xs leading-relaxed">
                      {interpolateText(item.asset.descriptionByVoice[tokens.voice], config)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  const hotspots = cockpitPack.hotspots;
  const activeHotspot = hotspots[selectedIdx % hotspots.length] || hotspots[0];
  if (!activeHotspot) return null;

  return (
    <SectionShell id={section.kind} tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
      <div className="space-y-8">
        <SectionTitleRow
          section={section}
          tokens={tokens}
          pal={pal}
          rightSlot={
            <span
              style={{
                borderColor: pal.border,
                backgroundColor: pal.surface,
                color: pal.muted,
                borderRadius: tokens.buttonRadius,
                fontFamily: tokens.fontPair.monoFamily,
              }}
              className="hidden sm:inline-flex border px-3 py-1.5 text-xs shrink-0"
            >
              {config.modelName} · {config.chassisCode}
            </span>
          }
        />
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 space-y-4">
            <div
              style={{
                borderColor: pal.border,
                backgroundColor: pal.surface,
                borderRadius: tokens.cardRadius,
              }}
              className="relative border overflow-hidden aspect-[16/10]"
            >
              <img
                src={cockpitPack.mainPovUrl}
                alt={`${config.modelName} cabin layout`}
                className="h-full w-full object-cover"
              />
              {hotspots.map((hs, idx) => {
                const isSelected = idx === selectedIdx % hotspots.length;
                return (
                  <button
                    key={hs.id}
                    type="button"
                    aria-label={hs.label}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedIdx(idx)}
                    style={{
                      left: `${hs.coordX}%`,
                      top: `${hs.coordY}%`,
                      backgroundColor: isSelected ? pal.accent : pal.bg,
                      color: isSelected ? pal.accentFg : pal.fg,
                      borderColor: isSelected ? pal.fg : pal.accent,
                      fontFamily: tokens.fontPair.monoFamily,
                    }}
                    className="hidden sm:flex absolute -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-2 items-center justify-center text-xs font-semibold tabular-nums transition-transform duration-200 hover:scale-110 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 shadow-md"
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {hotspots.map((hs, idx) => {
                const isSelected = idx === selectedIdx % hotspots.length;
                const matchesFocus = config.focusTags.includes(hs.tag);
                return (
                  <button
                    key={hs.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedIdx(idx)}
                    style={{
                      borderColor: isSelected ? pal.accent : matchesFocus ? pal.fg : pal.border,
                      backgroundColor: isSelected ? pal.accent : pal.surface,
                      color: isSelected ? pal.accentFg : pal.fg,
                      borderRadius: tokens.buttonRadius,
                    }}
                    className="border px-3 py-2 text-left text-xs font-medium min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <span
                      style={{ fontFamily: tokens.fontPair.monoFamily }}
                      className="opacity-75 mr-1.5 tabular-nums"
                    >
                      0{idx + 1}
                    </span>
                    <span className="truncate">{hs.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              borderColor: pal.border,
              backgroundColor: pal.surface,
              borderRadius: tokens.cardRadius,
            }}
            className="lg:col-span-5 border overflow-hidden flex flex-col justify-between"
          >
            <div className="aspect-[16/10] overflow-hidden border-b" style={{ borderColor: pal.border }}>
              <img
                src={activeHotspot.detailAssetUrl}
                alt={activeHotspot.headline}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span style={{ color: pal.muted }}>{activeHotspot.materialSpec}</span>
                  <span
                    style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                    className="font-semibold tabular-nums"
                  >
                    {activeHotspot.partCode}
                  </span>
                </div>
                <h3
                  style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
                  className="text-xl font-semibold tracking-tight"
                >
                  {activeHotspot.headline}
                </h3>
                <p style={{ color: pal.muted }} className="text-sm leading-relaxed">
                  {activeHotspot.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

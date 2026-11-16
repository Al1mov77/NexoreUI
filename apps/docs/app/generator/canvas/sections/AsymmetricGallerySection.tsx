"use client";

import React, { useState } from "react";
import { interpolateText } from "../../../../lib/generator/copy-bank";
import { XRayScoreBadge } from "../../SharedSections";
import {
  getAssetImageUrl,
  getAssetObjectPosition,
  SectionComponentProps,
} from "../canvas-types";
import { SectionShell, SectionTitleRow } from "./SectionShell";

export function AsymmetricGallerySection({
  section,
  payload,
  pal,
  reducedMotion,
}: SectionComponentProps) {
  const { tokens, config, featureAssets } = payload;
  const items = (section.primaryAssets.length >= 2 ? section.primaryAssets : featureAssets).slice(0, 4);
  const [spotlightIdx, setSpotlightIdx] = useState(0);

  if (tokens.archetype === "showroom" && items.length > 0) {
    const active = items[spotlightIdx % items.length] || items[0];
    return (
      <SectionShell id={section.kind} tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
        <div className="space-y-8">
          <SectionTitleRow section={section} tokens={tokens} pal={pal} />
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            <article
              style={{
                borderColor: pal.border,
                backgroundColor: pal.surface,
                borderRadius: tokens.cardRadius,
              }}
              className="lg:col-span-8 border overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <XRayScoreBadge
                  scored={active}
                  show={config.showXRayScoring}
                  accent={pal.accent}
                  accentFg={pal.accentFg}
                  labelPrefix="Spotlight"
                />
                <img
                  src={getAssetImageUrl(active)}
                  alt={interpolateText(active.asset.titleTemplate, config)}
                  style={{ objectPosition: getAssetObjectPosition(active.asset) }}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 space-y-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3
                    style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
                    className="text-lg font-semibold tracking-tight"
                  >
                    {interpolateText(active.asset.titleTemplate, config)}
                  </h3>
                  <span
                    style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                    className="text-xs font-semibold tabular-nums shrink-0"
                  >
                    {active.asset.specMetric.displayValue}
                  </span>
                </div>
                <p style={{ color: pal.muted }} className="text-sm leading-relaxed">
                  {interpolateText(active.asset.descriptionByVoice[tokens.voice], config)}
                </p>
              </div>
            </article>

            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
              {items.map((scored, idx) => {
                const selected = idx === spotlightIdx % items.length;
                const title = interpolateText(scored.asset.titleTemplate, config);
                return (
                  <button
                    key={scored.asset.id}
                    type="button"
                    onClick={() => setSpotlightIdx(idx)}
                    style={{
                      borderColor: selected ? pal.accent : pal.border,
                      backgroundColor: pal.surface,
                      borderRadius: tokens.cardRadius,
                    }}
                    className="border p-3 text-left flex flex-col sm:flex-row lg:items-center gap-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <div className="w-full sm:w-24 aspect-[16/10] shrink-0 overflow-hidden rounded">
                      <img
                        src={getAssetImageUrl(scored)}
                        alt={title}
                        style={{ objectPosition: getAssetObjectPosition(scored.asset) }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div
                        style={{ color: pal.fg, fontFamily: tokens.fontPair.displayFamily }}
                        className="text-xs sm:text-sm font-semibold line-clamp-2"
                      >
                        {title}
                      </div>
                      <div
                        style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.muted }}
                        className="text-xs tabular-nums"
                      >
                        {scored.asset.specMetric.displayValue}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  if (tokens.archetype === "track" && items.length > 0) {
    const lead = items[0];
    const side = items.slice(1);
    return (
      <SectionShell id={section.kind} tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
        <div className="space-y-8">
          <SectionTitleRow section={section} tokens={tokens} pal={pal} />
          <div className="grid lg:grid-cols-12 gap-5">
            <article
              style={{
                borderColor: pal.border,
                backgroundColor: pal.surface,
                borderRadius: tokens.cardRadius,
              }}
              className="lg:col-span-7 border overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <XRayScoreBadge
                  scored={lead}
                  show={config.showXRayScoring}
                  accent={pal.accent}
                  accentFg={pal.accentFg}
                  labelPrefix="Photo 1"
                />
                <img
                  src={getAssetImageUrl(lead)}
                  alt={interpolateText(lead.asset.titleTemplate, config)}
                  style={{ objectPosition: getAssetObjectPosition(lead.asset) }}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-6 space-y-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3
                    style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
                    className="text-lg font-semibold tracking-tight"
                  >
                    {interpolateText(lead.asset.titleTemplate, config)}
                  </h3>
                  <span
                    style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                    className="text-xs font-semibold tabular-nums shrink-0"
                  >
                    {lead.asset.specMetric.displayValue}
                  </span>
                </div>
                <p style={{ color: pal.muted }} className="text-sm leading-relaxed">
                  {interpolateText(lead.asset.descriptionByVoice[tokens.voice], config)}
                </p>
              </div>
            </article>

            <div className="lg:col-span-5 flex flex-col gap-4">
              {side.map((scored) => {
                const title = interpolateText(scored.asset.titleTemplate, config);
                const body = interpolateText(scored.asset.descriptionByVoice[tokens.voice], config);
                return (
                  <article
                    key={scored.asset.id}
                    style={{
                      borderColor: pal.border,
                      backgroundColor: pal.surface,
                      borderRadius: tokens.cardRadius,
                    }}
                    className="border p-4 grid grid-cols-12 gap-4 items-center group overflow-hidden"
                  >
                    <div className="col-span-5 relative aspect-[16/10] overflow-hidden">
                      <img
                        src={getAssetImageUrl(scored)}
                        alt={title}
                        style={{ objectPosition: getAssetObjectPosition(scored.asset) }}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="col-span-7 space-y-1">
                      <h3
                        style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
                        className="text-sm font-semibold tracking-tight"
                      >
                        {title}
                      </h3>
                      <p style={{ color: pal.muted }} className="text-xs leading-relaxed line-clamp-2">
                        {body}
                      </p>
                      <span
                        style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                        className="text-xs font-semibold tabular-nums block pt-0.5"
                      >
                        {scored.asset.specMetric.displayValue}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell id={section.kind} tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
      <div className="space-y-10">
        <SectionTitleRow section={section} tokens={tokens} pal={pal} />
        <div
          style={{ borderColor: pal.border }}
          className={
            tokens.archetype === "monolith"
              ? "grid lg:grid-cols-12 border-t border-l"
              : "grid gap-8 sm:grid-cols-2"
          }
        >
          {items.map((scored, idx) => {
            const title = interpolateText(scored.asset.titleTemplate, config);
            const body = interpolateText(scored.asset.descriptionByVoice[tokens.voice], config);
            const spanClass =
              tokens.archetype === "monolith"
                ? idx === 0 || idx === 3
                  ? "lg:col-span-7 border-r border-b"
                  : "lg:col-span-5 border-r border-b"
                : "";
            const offsetClass =
              tokens.archetype === "editorial" && idx % 2 === 1 ? "sm:mt-10" : "";
            return (
              <article
                key={scored.asset.id}
                style={{
                  borderColor: pal.border,
                  backgroundColor: tokens.archetype === "editorial" ? "transparent" : pal.surface,
                  borderRadius: tokens.cardRadius,
                }}
                className={`${spanClass} ${offsetClass} flex flex-col group overflow-hidden`}
              >
                <div
                  style={{ borderColor: pal.border, borderRadius: tokens.cardRadius }}
                  className={`relative aspect-[16/10] overflow-hidden ${
                    tokens.archetype === "editorial" ? "border" : ""
                  }`}
                >
                  <XRayScoreBadge
                    scored={scored}
                    show={config.showXRayScoring}
                    accent={pal.accent}
                    accentFg={pal.accentFg}
                    labelPrefix={`Photo ${idx + 1}`}
                  />
                  <img
                    src={getAssetImageUrl(scored)}
                    alt={title}
                    style={{ objectPosition: getAssetObjectPosition(scored.asset) }}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                </div>
                <div
                  style={{ borderColor: pal.border }}
                  className={
                    tokens.archetype === "editorial"
                      ? "border-b py-4 space-y-1.5"
                      : "p-6 space-y-1.5"
                  }
                >
                  <h3
                    style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
                    className="text-lg font-semibold tracking-tight"
                  >
                    {title}
                  </h3>
                  <p style={{ color: pal.muted }} className="text-sm leading-relaxed">
                    {body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

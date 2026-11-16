"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import { interpolateText } from "../../../../lib/generator/copy-bank";
import { XRayScoreBadge } from "../../SharedSections";
import {
  getAssetImageUrl,
  getAssetObjectPosition,
  SectionComponentProps,
} from "../canvas-types";
import { SectionShell, SectionTitleRow } from "./SectionShell";

export function HardwareStripSection({
  section,
  payload,
  pal,
  reducedMotion,
}: SectionComponentProps) {
  const { tokens, config, featureAssets } = payload;
  const stripRef = useRef<HTMLDivElement | null>(null);
  const items = (section.primaryAssets.length >= 2 ? section.primaryAssets : featureAssets).slice(0, 6);

  const scrollStrip = (dir: number) => {
    if (!stripRef.current) return;
    stripRef.current.scrollBy({
      left: dir * 360,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  if (tokens.archetype === "track") {
    return (
      <SectionShell id={section.kind} tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
        <div className="space-y-8">
          <SectionTitleRow section={section} tokens={tokens} pal={pal} />
          <div className="grid md:grid-cols-2 gap-4">
            {items.slice(0, 4).map((scored, idx) => {
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
                  className="border grid grid-cols-12 gap-4 items-center overflow-hidden p-4 group"
                >
                  <div className="col-span-5 relative aspect-[16/10] overflow-hidden">
                    <XRayScoreBadge
                      scored={scored}
                      show={config.showXRayScoring}
                      accent={pal.accent}
                      accentFg={pal.accentFg}
                      labelPrefix={`Item ${idx + 1}`}
                    />
                    <img
                      src={getAssetImageUrl(scored)}
                      alt={title}
                      style={{ objectPosition: getAssetObjectPosition(scored.asset) }}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="col-span-7 space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.muted }}>
                        {scored.asset.partCode}
                      </span>
                      <span style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }} className="font-semibold tabular-nums">
                        {scored.asset.specMetric.displayValue}
                      </span>
                    </div>
                    <h3
                      style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
                      className="text-sm sm:text-base font-semibold tracking-tight"
                    >
                      {title}
                    </h3>
                    <p style={{ color: pal.muted }} className="text-xs leading-relaxed line-clamp-2">
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

  return (
    <SectionShell id={section.kind} tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
      <div className="space-y-8">
        <SectionTitleRow
          section={section}
          tokens={tokens}
          pal={pal}
          rightSlot={
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                aria-label="Scroll hardware left"
                onClick={() => scrollStrip(-1)}
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
                aria-label="Scroll hardware right"
                onClick={() => scrollStrip(1)}
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
          ref={stripRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3"
        >
          {items.map((scored, idx) => {
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
                className="min-w-[270px] sm:min-w-[330px] max-w-[360px] shrink-0 snap-start border overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <XRayScoreBadge
                    scored={scored}
                    show={config.showXRayScoring}
                    accent={pal.accent}
                    accentFg={pal.accentFg}
                    labelPrefix={`Item ${idx + 1}`}
                  />
                  <img
                    src={getAssetImageUrl(scored)}
                    alt={title}
                    style={{ objectPosition: getAssetObjectPosition(scored.asset) }}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.muted }}
                        className="text-xs tabular-nums"
                      >
                        {scored.asset.partCode}
                      </span>
                      <span
                        style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.fg }}
                        className="text-xs font-semibold tabular-nums"
                      >
                        {scored.asset.specMetric.displayValue}
                      </span>
                    </div>
                    <h3
                      style={{ fontFamily: tokens.fontPair.displayFamily, color: pal.fg }}
                      className="text-base font-semibold tracking-tight"
                    >
                      {title}
                    </h3>
                  </div>
                  <p style={{ color: pal.muted }} className="text-xs leading-relaxed">
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

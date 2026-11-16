"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { XRayScoreBadge } from "../../SharedSections";
import {
  getAssetImageUrl,
  getAssetObjectPosition,
  getTransitionSpec,
  SectionComponentProps,
} from "../canvas-types";
import { SectionShell, SectionTitleRow } from "./SectionShell";

export function EditorialTimelineSection({
  section,
  payload,
  pal,
  reducedMotion,
}: SectionComponentProps) {
  const { tokens, config, timelineChapters } = payload;
  const [chapterIdx, setChapterIdx] = useState(0);
  const chapters = timelineChapters.length > 0 ? timelineChapters : [];
  const active = chapters[chapterIdx % chapters.length];
  if (!active) return null;

  const isWide = tokens.archetype === "showroom";

  return (
    <SectionShell id={section.kind} tokens={tokens} pal={pal} reducedMotion={reducedMotion}>
      <div className="space-y-10">
        <SectionTitleRow section={section} tokens={tokens} pal={pal} />
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div
            style={{ borderColor: pal.border }}
            className={`${isWide ? "lg:col-span-4" : "lg:col-span-5"} border-t divide-y`}
          >
            {chapters.map((chapter, idx) => {
              const selected = idx === chapterIdx % chapters.length;
              return (
                <button
                  key={chapter.index}
                  type="button"
                  onClick={() => setChapterIdx(idx)}
                  style={{ borderColor: pal.border }}
                  className="w-full py-5 px-2 text-left flex gap-4 items-start relative cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {selected && (
                    <motion.span
                      layoutId={reducedMotion ? undefined : "timeline-active-bar"}
                      transition={getTransitionSpec(tokens, reducedMotion)}
                      style={{ backgroundColor: pal.accent }}
                      className="absolute left-0 top-4 bottom-4 w-0.5"
                    />
                  )}
                  <span
                    style={{
                      fontFamily: tokens.fontPair.monoFamily,
                      color: selected ? pal.fg : pal.muted,
                    }}
                    className="text-xs font-semibold tabular-nums pt-1 pl-2"
                  >
                    {chapter.index}
                  </span>
                  <div className="space-y-1.5">
                    <div
                      style={{
                        fontFamily: tokens.fontPair.displayFamily,
                        color: pal.fg,
                      }}
                      className="text-base sm:text-lg font-semibold tracking-tight"
                    >
                      {chapter.title}
                    </div>
                    <p style={{ color: pal.muted }} className="text-sm leading-relaxed">
                      {chapter.body}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            style={{
              borderColor: pal.border,
              backgroundColor: pal.surface,
              borderRadius: tokens.cardRadius,
            }}
            className={`${isWide ? "lg:col-span-8" : "lg:col-span-7"} border overflow-hidden`}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <XRayScoreBadge
                scored={active.asset}
                show={config.showXRayScoring}
                accent={pal.accent}
                accentFg={pal.accentFg}
                labelPrefix={`Chapter ${active.index}`}
              />
              <img
                src={getAssetImageUrl(active.asset)}
                alt={active.title}
                style={{ objectPosition: getAssetObjectPosition(active.asset.asset) }}
                className="h-full w-full object-cover"
              />
            </div>
            <div
              style={{ borderColor: pal.border }}
              className="border-t px-6 py-4 flex items-center justify-between gap-4 text-xs"
            >
              <span style={{ color: pal.fg }} className="font-medium">
                {active.title}
              </span>
              <span
                style={{ fontFamily: tokens.fontPair.monoFamily, color: pal.muted }}
                className="tabular-nums shrink-0"
              >
                {active.phaseCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

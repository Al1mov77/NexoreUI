"use client";

import { motion } from "framer-motion";
import React from "react";
import { SynthesizedLandingPayload } from "../../../../lib/generator/schema";
import { XRayScoreBadge } from "../../SharedSections";
import {
  getAssetObjectPosition,
  getTransitionSpec,
  SurfacePalette,
} from "../canvas-types";
import { ScrollVideoCanvas } from "../ScrollVideoCanvas";

export interface HeroRenderProps {
  payload: SynthesizedLandingPayload;
  pal: SurfacePalette;
  reducedMotion: boolean;
  isBakery: boolean;
  cleanCity: string;
  firstSectionHref: string;
}

export function HeroMediaPlate({
  payload,
  pal,
  reducedMotion,
  className = "h-full w-full object-cover",
}: {
  payload: SynthesizedLandingPayload;
  pal: SurfacePalette;
  reducedMotion: boolean;
  className?: string;
}) {
  const { heroAsset, tokens, config } = payload;
  const objectPosition = getAssetObjectPosition(heroAsset.asset);

  return (
    <>
      <XRayScoreBadge
        scored={heroAsset}
        show={config.showXRayScoring}
        accent={pal.accent}
        accentFg={pal.accentFg}
        labelPrefix="Hero"
      />
      {heroAsset.asset.mediaType === "video" && heroAsset.asset.video ? (
        <ScrollVideoCanvas
          video={heroAsset.asset.video}
          posterUrl={heroAsset.asset.video.posterUrl || heroAsset.asset.url}
          objectPosition={objectPosition}
          reducedMotion={reducedMotion}
          className={className}
        />
      ) : (
        <motion.img
          key={heroAsset.asset.id}
          layoutId={reducedMotion ? undefined : "generator-hero-plate"}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.985 }}
          animate={reducedMotion ? false : { opacity: 1, scale: 1 }}
          transition={getTransitionSpec(tokens, reducedMotion)}
          src={heroAsset.asset.url}
          alt={payload.headline}
          style={{ objectPosition }}
          className={className}
        />
      )}
    </>
  );
}

export function HeroActionButtons({
  payload,
  pal,
  firstSectionHref,
}: {
  payload: SynthesizedLandingPayload;
  pal: SurfacePalette;
  firstSectionHref: string;
}) {
  const { tokens } = payload;
  return (
    <div className="pt-2 flex flex-wrap gap-3">
      <a
        href="#cta"
        style={{
          backgroundColor: pal.accent,
          color: pal.accentFg,
          borderRadius: tokens.buttonRadius,
        }}
        className="px-6 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {payload.ctaPrimary}
      </a>
      <a
        href={firstSectionHref}
        style={{
          borderColor: pal.border,
          backgroundColor: pal.surface,
          color: pal.fg,
          borderRadius: tokens.buttonRadius,
        }}
        className="border px-6 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {payload.ctaSecondary}
      </a>
    </div>
  );
}

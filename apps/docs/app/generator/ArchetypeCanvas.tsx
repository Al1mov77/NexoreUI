"use client";

import { motion, useReducedMotion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { selectSectionSentences } from "../../lib/generator/copy-bank";
import { selectTestBakeryCopy } from "../../lib/generator/niches/test-bakery";
import {
  SectionKind,
  SynthesizedLandingPayload,
  SynthesizedSectionSpec,
} from "../../lib/generator/schema";
import { SectionComponentProps, SurfacePalette, TrimLiveState } from "./canvas/canvas-types";
import { CtaBand } from "./canvas/CtaBand";
import { FooterBar } from "./canvas/FooterBar";
import { HeroRenderer } from "./canvas/heroes/HeroRenderer";
import { NavigationBar } from "./canvas/NavigationBar";
import { AsymmetricGallerySection } from "./canvas/sections/AsymmetricGallerySection";
import { CockpitPovSection } from "./canvas/sections/CockpitPovSection";
import { EditorialTimelineSection } from "./canvas/sections/EditorialTimelineSection";
import { HardwareStripSection } from "./canvas/sections/HardwareStripSection";
import { Orbit360Section } from "./canvas/sections/Orbit360Section";
import { SpecLedgerSection } from "./canvas/sections/SpecLedgerSection";
import { StateMorphSection } from "./canvas/sections/StateMorphSection";
import { TrimBuilderSection } from "./canvas/sections/TrimBuilderSection";

const SECTION_SLOT_ROLE: Readonly<Record<SectionKind, "specs" | "gallery" | "cta">> = {
  "section-spec-ledger": "specs",
  "section-state-morph": "specs",
  "section-horizontal-strip": "gallery",
  "section-asymmetric-dossier": "gallery",
  "section-orbit-360": "gallery",
  "section-cockpit-pov": "gallery",
  "section-editorial-timeline": "gallery",
  "section-trim-builder": "cta",
};

export function ArchetypeCanvas({
  payload,
}: {
  payload: SynthesizedLandingPayload;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [trimState, setTrimState] = useState<TrimLiveState | null>(null);
  const { config, tokens } = payload;

  useEffect(() => {
    setTrimState(null);
  }, [config.niche, config.subcategory, config.variationSeed, config.chassisCode]);

  const pal: SurfacePalette =
    config.themeMode === "light" ? tokens.palette.light : tokens.palette.dark;

  const cleanCity =
    (config.location || "Zurich").split(",")[0].split("·")[0].trim() || "Zurich";
  const isBakery = config.niche === "test-bakery";

  const firstSectionHref = payload.sections[0]
    ? `#${payload.sections[0].kind === "section-trim-builder" ? "cta" : payload.sections[0].kind}`
    : "#cta";

  const sectionCopy = isBakery
    ? selectTestBakeryCopy(config, tokens.voice)
    : selectSectionSentences(config);

  const hasTrimBuilder = payload.sections.some(
    (s) => s.kind === "section-trim-builder"
  );

  const renderSectionKind = (
    section: SynthesizedSectionSpec,
    sectionIndex: number
  ) => {
    const commonProps: SectionComponentProps = {
      section,
      sectionIndex,
      payload,
      pal,
      reducedMotion: Boolean(prefersReducedMotion),
      isBakery,
      cleanCity,
      trimState,
      onTrimChange: setTrimState,
    };
    switch (section.kind) {
      case "section-orbit-360":
        return <Orbit360Section {...commonProps} />;
      case "section-state-morph":
        return <StateMorphSection {...commonProps} />;
      case "section-cockpit-pov":
        return <CockpitPovSection {...commonProps} />;
      case "section-asymmetric-dossier":
        return <AsymmetricGallerySection {...commonProps} />;
      case "section-editorial-timeline":
        return <EditorialTimelineSection {...commonProps} />;
      case "section-horizontal-strip":
        return <HardwareStripSection {...commonProps} />;
      case "section-spec-ledger":
        return <SpecLedgerSection {...commonProps} />;
      case "section-trim-builder":
        return <TrimBuilderSection {...commonProps} />;
    }
  };

  const ctaOrderIdx = payload.sectionOrder.indexOf("cta");
  const specsOrderIdx = payload.sectionOrder.indexOf("specs");
  const galleryOrderIdx = payload.sectionOrder.indexOf("gallery");

  const bodyNodes: React.ReactNode[] = [];
  let ctaEmitted = hasTrimBuilder;

  payload.sections.forEach((section, idx) => {
    const slot = SECTION_SLOT_ROLE[section.kind];
    const slotPos =
      slot === "specs"
        ? specsOrderIdx
        : slot === "gallery"
          ? galleryOrderIdx
          : ctaOrderIdx;

    if (!ctaEmitted && ctaOrderIdx !== -1 && slotPos > ctaOrderIdx) {
      bodyNodes.push(
        <CtaBand
          key="standalone-cta"
          payload={payload}
          pal={pal}
          reducedMotion={Boolean(prefersReducedMotion)}
          isBakery={isBakery}
          ctaSentence={sectionCopy.ctaSentence}
        />
      );
      ctaEmitted = true;
    }

    bodyNodes.push(
      <React.Fragment key={section.kind}>
        {renderSectionKind(section, idx)}
      </React.Fragment>
    );
  });

  if (!ctaEmitted) {
    bodyNodes.push(
      <CtaBand
        key="standalone-cta"
        payload={payload}
        pal={pal}
        reducedMotion={Boolean(prefersReducedMotion)}
        isBakery={isBakery}
        ctaSentence={sectionCopy.ctaSentence}
      />
    );
  }

  return (
    <motion.div
      layoutId={prefersReducedMotion ? undefined : "generator-canvas-frame"}
      style={{
        backgroundColor: pal.bg,
        color: pal.fg,
        fontFamily: tokens.fontPair.bodyFamily,
      }}
      className="min-h-screen w-full overflow-x-clip transition-colors duration-300"
    >
      <link rel="stylesheet" href={tokens.fontPair.googleFontsUrl} />
      <NavigationBar
        payload={payload}
        pal={pal}
        firstSectionHref={firstSectionHref}
      />
      <HeroRenderer
        payload={payload}
        pal={pal}
        reducedMotion={Boolean(prefersReducedMotion)}
        isBakery={isBakery}
        cleanCity={cleanCity}
        firstSectionHref={firstSectionHref}
      />
      {bodyNodes}
      <FooterBar
        payload={payload}
        pal={pal}
        cleanCity={cleanCity}
        firstSectionHref={firstSectionHref}
      />
    </motion.div>
  );
}

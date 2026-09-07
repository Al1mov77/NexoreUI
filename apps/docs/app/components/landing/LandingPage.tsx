"use client";

import React from "react";
import { HeroSection } from "./sections/HeroSection";
import { StatsSection } from "./sections/StatsSection";
import { AestheticShowcaseSection } from "./sections/AestheticShowcaseSection";
import { TemplatesShowcaseSection } from "./sections/TemplatesShowcaseSection";
import { NexoreMakeSection } from "./sections/NexoreMakeSection";
import { CTASection } from "./sections/CTASection";
import { FooterSection } from "./sections/FooterSection";

/**
 * Landing page orchestrator.
 *
 * Sections:
 *  1. HeroSection             — headline, CTA, 6-component mini showcase
 *  2. StatsSection            — real stats (GitHub stars, npm downloads) + tech marquee
 *  3. AestheticShowcaseSection — interactive bento sandbox (aurora fx, morphing geometry, live code)
 *  4. TemplatesShowcaseSection — interactive multi-device template player & code exporter
 *  5. NexoreMakeSection       — visual component builder showcase & access CTA
 *  6. CTASection             — install command + docs links
 *  7. FooterSection          — links, license
 */
export default function LandingPage() {
  return (
    <main
      className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-foreground relative overflow-x-hidden"
      id="landing-root"
    >
      <HeroSection />
      <StatsSection />
      <AestheticShowcaseSection />
      <TemplatesShowcaseSection />
      <NexoreMakeSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}

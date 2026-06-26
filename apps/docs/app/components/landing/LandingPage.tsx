"use client";

import React from "react";
import { HeroSection } from "./sections/HeroSection";
import { StatsSection } from "./sections/StatsSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { CTASection } from "./sections/CTASection";
import { FooterSection } from "./sections/FooterSection";

/**
 * Landing page orchestrator.
 *
 * Sections are intentionally separated into individual files for:
 * - Easier maintenance and navigation
 * - Smaller bundle per section (tree-shaking friendly)
 * - No monolithic 800+ line component that's impossible to reason about
 *
 * Sections:
 *  1. HeroSection    — headline, CTA, 6-component mini showcase
 *  2. StatsSection   — real stats (GitHub stars, npm downloads) + tech marquee
 *  3. FeaturesSection — bento grid of honest feature cards
 *  4. CTASection     — install command + docs links
 *  5. FooterSection  — links, license
 */
export default function LandingPage() {
  return (
    <main
      className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-foreground relative overflow-x-hidden"
      id="landing-root"
    >
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}

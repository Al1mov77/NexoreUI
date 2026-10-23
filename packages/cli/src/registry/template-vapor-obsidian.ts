export const templateVaporObsidian = {
  name: "template-vapor-obsidian",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-vapor-obsidian.tsx",
  content: `"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Check,
  Copy,
  Terminal,
  Maximize2,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   VAPOR OBSIDIAN ATELIER — Precision Optics Editorial Lookbook
   Minimalist High Fashion • Gentle Monster / Acronym Dark Luxury Aesthetics
   Pure Typographic Elegance • Frosted Glass Instant Wipe • Zero Vibe-Code Clutter
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Minimalist Editorial Noir Palette ── */
const BG_DEEP = "#07080a";
const BG_SURFACE = "#0d0e12";
const FG_PRIMARY = "#f8fafc";
const FG_MUTED = "#8e95a5";
const FG_FAINT = "#474d5d";
const BORDER_SUBTLE = "rgba(255, 255, 255, 0.08)";
const BORDER_ACTIVE = "rgba(255, 255, 255, 0.25)";
const ACCENT_AMBER = "#f59e0b";

export default function VaporObsidianTemplate({
  brandName = "VAPOR OBSIDIAN",
  hiddenSections,
  heroSubtitle,
  deviceMode = "desktop",
}: {
  brandName?: string;
  hiddenSections?: Record<string, boolean>;
  heroSubtitle?: string;
  deviceMode?: "desktop" | "tablet" | "mobile";
}) {
  const config = { brandName, hiddenSections, heroSubtitle };
  const prefersReducedMotion = useReducedMotion();

  /* ── Container width observation ── */
  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  const isMobile = containerWidth > 0 ? containerWidth < 640 : deviceMode === "mobile";
  const isTablet = containerWidth > 0 ? containerWidth < 1024 : deviceMode === "tablet";
  const isDesktop = !isMobile && !isTablet;

  /* ── Interactive State ── */
  const [isGlassForceWiped, setIsGlassForceWiped] = useState<boolean>(false);
  const [wipePercent, setWipePercent] = useState<number>(0);
  const [selectedFrame, setSelectedFrame] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  /* ── Refs ── */
  const heroRef = useRef<HTMLElement>(null);
  const frostRef = useRef<HTMLDivElement>(null);

  /* Physics Coordinates for Frosted Glass Hole */
  const targetRadiusRef = useRef<number>(0);
  const currRadiusRef = useRef<number>(0);

  /* ══════════════════════════════════════════════════════════════════════════
     FROSTED GLASS WIPE (ZERO-LAG MOUSE TRACKING + SMOOTH RADIUS DECAY)
  ══════════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    let rAFId: number;
    let isActive = true;
    const baseMaxRadius = isMobile ? 120 : 180;

    const physicsLoop = () => {
      if (!isActive) return;

      const effectiveTargetRadius = isGlassForceWiped ? 1800 : targetRadiusRef.current;
      const deltaR = effectiveTargetRadius - currRadiusRef.current;

      /* Smooth interpolation for radius only */
      currRadiusRef.current += deltaR * 0.18;

      if (frostRef.current) {
        const rVal = Math.max(0, currRadiusRef.current);
        frostRef.current.style.setProperty("--r", \`\${rVal.toFixed(1)}px\`);
      }

      const calculatedPercent = isGlassForceWiped
        ? 100
        : Math.min(100, Math.max(0, Math.round((currRadiusRef.current / baseMaxRadius) * 100)));
      setWipePercent(calculatedPercent);

      rAFId = requestAnimationFrame(physicsLoop);
    };

    rAFId = requestAnimationFrame(physicsLoop);
    return () => {
      isActive = false;
      cancelAnimationFrame(rAFId);
    };
  }, [isMobile, isGlassForceWiped]);

  const updatePointerWipe = useCallback(
    (clientX: number, clientY: number) => {
      if (!heroRef.current || isGlassForceWiped) return;
      const rect = heroRef.current.getBoundingClientRect();
      const clampedX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const clampedY = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const xPercent = (clampedX / rect.width) * 100;
      const yPercent = (clampedY / rect.height) * 100;

      /* Instant 0ms position update under cursor */
      if (frostRef.current) {
        frostRef.current.style.setProperty("--mx", \`\${xPercent.toFixed(1)}%\`);
        frostRef.current.style.setProperty("--my", \`\${yPercent.toFixed(1)}%\`);
      }
      targetRadiusRef.current = isMobile ? 120 : 180;
    },
    [isMobile, isGlassForceWiped]
  );

  const handlePointerLeave = useCallback(() => {
    if (!isGlassForceWiped) {
      targetRadiusRef.current = 0;
    }
  }, [isGlassForceWiped]);

  /* ── Universal Scroll Tracking for Smooth Hero Photo Fade-Out ── */
  const [heroScrollRatio, setHeroScrollRatio] = useState<number>(0);
  const targetHeroScrollRatioRef = useRef<number>(0);
  const currHeroScrollRatioRef = useRef<number>(0);

  useEffect(() => {
    /* Discover nearest scrollable ancestor or fallback to window */
    let scrollEl: HTMLElement | Window = window;
    let curr = rootRef.current?.parentElement;
    while (curr) {
      const style = window.getComputedStyle(curr);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        scrollEl = curr;
        break;
      }
      curr = curr.parentElement;
    }

    const onScroll = () => {
      let st = 0;
      if (scrollEl === window) {
        st = window.scrollY || document.documentElement.scrollTop;
      } else {
        st = (scrollEl as HTMLElement).scrollTop;
      }
      const fadeThreshold = isMobile ? 320 : 500;
      const ratio = Math.min(1, Math.max(0, st / fadeThreshold));
      targetHeroScrollRatioRef.current = ratio;
    };

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let rAFId: number;
    let isRunning = true;
    const smoothScrollLoop = () => {
      if (!isRunning) return;
      const diff = targetHeroScrollRatioRef.current - currHeroScrollRatioRef.current;
      if (Math.abs(diff) > 0.0005) {
        currHeroScrollRatioRef.current += diff * 0.12;
        setHeroScrollRatio(currHeroScrollRatioRef.current);
      }
      rAFId = requestAnimationFrame(smoothScrollLoop);
    };
    rAFId = requestAnimationFrame(smoothScrollLoop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rAFId);
      scrollEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMobile]);

  /* ── Bespoke Lookbook Collection 01 ── */
  const lookbookItems = [
    {
      spec: "SPEC. 01",
      name: "AERO-TITANIUM MONOBLOC",
      material: "Grade 5 Beta-Titanium • Cold-Forged",
      weight: "14.8 grams",
      hinge: "Screwless Cylindrical Lock",
      lens: "High-Index Polarized Amber",
      price: "$1,280",
      description:
        "Cold-forged under 800-ton hydraulic pressure from a single titanium billet. Zero screws, zero solder joints. Engineered strictly for nocturnal glare suppression and structural permanence.",
    },
    {
      spec: "SPEC. 02",
      name: "SMOKED ACETATE NOIR",
      material: "8mm Cured Takiron Organic Plant Cellulose",
      weight: "24.2 grams",
      hinge: "7-Barrel German Precision Joint",
      lens: "Photochromic Deep Obsidian",
      price: "$960",
      description:
        "Hand-carved from solid 8mm cured Japanese plant cellulose blocks. Aged for six months and hand-beveled with organic walnut granulate tumblers for deep tactile warmth.",
    },
    {
      spec: "SPEC. 03",
      name: "DARK PLATINUM WIRE",
      material: "0.8mm Platinum-Ruthenium Alloy",
      weight: "11.2 grams",
      hinge: "Micro-Ball Flex Detent",
      lens: "Multi-Layer Sapphire Anti-Reflective",
      price: "$1,450",
      description:
        "An ethereal architectural silhouette fabricated from platinum-ruthenium micro-wire. Fitted with hand-knurled pure titanium nose pads and biocompatible hypoallergenic sleeves.",
    },
  ];

  /* ── CLI Copy ── */
  const copyCliCommand = () => {
    navigator.clipboard.writeText("npx nexoreui add template-vapor-obsidian");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div
      ref={rootRef}
      className="@container w-full min-h-screen font-sans select-none overflow-x-clip relative"
      style={{
        backgroundColor: BG_DEEP,
        color: FG_PRIMARY,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
      />
      {/* ═══════════════════════════════════════════════════════════════════════
          MINIMALIST EDITORIAL NAVIGATION (CLEAN & TIMELESS)
      ═══════════════════════════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 border-b px-5 sm:px-8 md:px-12 py-4 flex items-center justify-between transition-colors"
        style={{
          backgroundColor: "rgba(7, 8, 10, 0.95)",
          borderColor: BORDER_SUBTLE,
        }}
      >
        <div className="flex items-center gap-6">
          <span className="font-extrabold text-sm sm:text-base tracking-[0.25em] uppercase text-white">
            {config.brandName || "VAPOR OBSIDIAN"}
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 hidden md:inline border-l pl-6 border-white/10 font-mono">
            COLLECTION 01 • ATELIER
          </span>
        </div>

        {/* Minimal Text Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs tracking-[0.18em] uppercase text-neutral-400 font-medium">
          <a href="#hero" className="hover:text-white transition-colors">Hero</a>
          <a href="#manifesto" className="hover:text-white transition-colors">Manifesto</a>
          <a href="#archive" className="hover:text-white transition-colors">Archive</a>
          <a href="#craft" className="hover:text-white transition-colors">Craftsmanship</a>
        </nav>

        {/* Header Action Controls */}
        <div className="flex items-center gap-3">
          {/* Glass Wipe Toggle */}
          <button
            onClick={() => setIsGlassForceWiped(!isGlassForceWiped)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs tracking-wider uppercase transition-all cursor-pointer font-mono"
            style={{
              borderColor: isGlassForceWiped ? BORDER_ACTIVE : BORDER_SUBTLE,
              backgroundColor: isGlassForceWiped ? "rgba(255,255,255,0.08)" : "transparent",
              color: isGlassForceWiped ? "#fff" : FG_MUTED,
            }}
          >
            {isGlassForceWiped ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isGlassForceWiped ? "Clear" : "Frosted"}</span>
          </button>


          {/* CLI Copy */}
          <button
            onClick={copyCliCommand}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-mono font-bold tracking-wider uppercase hover:bg-neutral-200 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "CLI"}</span>
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: HERO CHAMBER — EDITORIAL LOOKBOOK
          Inspired directly by the high-fashion lookbook reference
      ═══════════════════════════════════════════════════════════════════════ */}
      {!config.hiddenSections?.hero && (
        <section
          id="hero"
          ref={heroRef}
          onMouseMove={(e) => updatePointerWipe(e.clientX, e.clientY)}
          onMouseLeave={handlePointerLeave}
          onTouchMove={(e) => {
            if (e.touches[0]) {
              updatePointerWipe(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={handlePointerLeave}
          className={\`relative w-full overflow-hidden flex flex-col justify-between cursor-crosshair \${
            isMobile
              ? "h-auto min-h-[520px] py-12 px-6"
              : isTablet
              ? "h-[560px] min-h-[500px] p-10"
              : "h-[calc(100vh-4.2rem)] min-h-[580px] max-h-[720px] p-12"
          }\`}
        >
          {/* Base Clean Photo (Model with Amber Glasses) with Smooth Scroll Fade */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden bg-[#07080a] will-change-transform"
            style={{
              opacity: Math.max(0, 1 - heroScrollRatio * 1.15),
              transform: \`translate3d(0, \${(heroScrollRatio * 110).toFixed(1)}px, 0) scale(\${(1 - heroScrollRatio * 0.05).toFixed(3)})\`,
              filter: \`brightness(\${(1 - heroScrollRatio * 0.4).toFixed(2)}) blur(\${(heroScrollRatio * 6).toFixed(1)}px)\`,
            }}
          >
            <img
              src="/images/templates/vapor-obsidian.jpg"
              alt="Vapor Obsidian Eyewear"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
            />

            {/* Subtle Vignette to integrate seamlessly into dark atelier floor */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: \`linear-gradient(to bottom, rgba(7,8,10,0.6) 0%, transparent 20%, transparent 75%, \${BG_DEEP} 100%)\`,
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: \`radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(7,8,10,0.65) 100%)\`,
              }}
            />
          </div>

          {/* Fade-to-dark obsidian veil ensuring buttery smooth background transition */}
          <div
            className="absolute inset-0 pointer-events-none z-[5] bg-[#07080a]"
            style={{
              opacity: Math.min(1, heroScrollRatio * 1.02),
            }}
          />

          {/* Frosted Glass Overlay with dynamic mask hole */}
          <div
            ref={frostRef}
            className="absolute inset-0 pointer-events-none select-none z-10 transition-[backdrop-filter] duration-200"
            style={{
              opacity: Math.max(0, 1 - heroScrollRatio * 1.25),
              backdropFilter: "blur(14px) saturate(115%)",
              WebkitBackdropFilter: "blur(14px) saturate(115%)",
              backgroundColor: "rgba(7, 8, 10, 0.42)",
              maskImage:
                "radial-gradient(circle at var(--mx) var(--my), transparent 0px, transparent var(--r), black calc(var(--r) + 70px))",
              WebkitMaskImage:
                "radial-gradient(circle at var(--mx) var(--my), transparent 0px, transparent var(--r), black calc(var(--r) + 70px))",
            }}
          >
            {/* Delicate Condensation Texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
              style={{
                backgroundImage: \`radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 1px, transparent 1px)\`,
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          {/* Top Row: Vertical Badge & Interaction Hint */}
          <div className="relative z-20 w-full flex items-center justify-between text-xs tracking-[0.2em] uppercase font-mono text-neutral-400">
            <span className="hidden md:inline">NOCTURNE OPTICAL DISCIPLINE</span>
            <span className="text-[11px] text-neutral-400 font-mono tracking-wider ml-auto">
              [ HOVER TO WIPE VAPOR GLASS ]
            </span>
          </div>

          {/* Massive Editorial Headline wrapping around the model */}
          <div
            className="relative z-20 w-full my-auto pointer-events-none transition-transform"
            style={{
              opacity: Math.max(0, 1 - heroScrollRatio * 1.35),
              transform: \`translate3d(0, -\${(heroScrollRatio * 45).toFixed(1)}px, 0)\`,
            }}
          >
            <div className="flex items-center justify-between w-full select-none">
              {/* Left wordmark */}
              <h1
                className="font-black tracking-[-0.03em] uppercase leading-none text-white/90 drop-shadow-2xl"
                style={{
                  fontSize: isMobile ? "2.5rem" : isTablet ? "5rem" : "7.5rem",
                  letterSpacing: "-0.04em",
                }}
              >
                C Ø L L E
              </h1>

              {/* Right wordmark */}
              <h1
                className="font-black tracking-[-0.03em] uppercase leading-none text-white/90 drop-shadow-2xl"
                style={{
                  fontSize: isMobile ? "2.5rem" : isTablet ? "5rem" : "7.5rem",
                  letterSpacing: "-0.04em",
                }}
              >
                TION 01
              </h1>
            </div>

            {/* Asymmetrical Editorial Text Block on the Left (Direct reference style) */}
            <div className="mt-4 sm:mt-6 max-w-sm text-left space-y-4 pointer-events-auto">
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                {config.heroSubtitle ||
                  "Hand-forged aerospace beta-titanium and cured Takiron cellulose. Engineered strictly for nocturnal glare suppression and structural permanence."}
              </p>
              <div className="pt-2">
                <a
                  href="#archive"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-xs font-bold tracking-[0.15em] uppercase hover:bg-neutral-200 transition-all cursor-pointer shadow-xl"
                >
                  <span>Explore Archive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Strip */}
          <div
            className="relative z-20 w-full border-t pt-4 flex items-center justify-between text-xs tracking-[0.15em] uppercase font-mono text-neutral-400"
            style={{ borderColor: BORDER_SUBTLE }}
          >
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-white font-medium">CHAMBER CONDENSATION: 84% RH</span>
            </div>

            <div className="flex items-center gap-6 text-[11px] hidden sm:flex">
              <span>WIPE STATUS: {wipePercent}%</span>
              <span>INDEX: 1.74 POLARIZED</span>
              <span>JAPANESE TAKIRON</span>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: THE ATELIER MANIFESTO (CLEAN EDITORIAL TEXT)
          Minimalist, dignified, high-fashion text presentation
      ═══════════════════════════════════════════════════════════════════════ */}
      {!config.hiddenSections?.manifesto && (
        <section
          id="manifesto"
          className="relative w-full py-20 sm:py-28 px-6 sm:px-12 md:px-16 border-t"
          style={{
            backgroundColor: BG_SURFACE,
            borderColor: BORDER_SUBTLE,
          }}
        >
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 border-b pb-12" style={{ borderColor: BORDER_SUBTLE }}>
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-500">
                01 / PHILOSOPHY
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-white max-w-2xl leading-tight">
                We do not build eyewear for the daylight. We forge optical instruments for the nocturnal sanctuary.
              </h2>
            </div>

            {/* 3 Text Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-neutral-300">
              <div className="space-y-4">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] block">
                  [ 01 • MONOBLOC INTEGRITY ]
                </span>
                <h3 className="text-lg font-bold text-white tracking-wide uppercase">
                  Cold-Forged Beta-Titanium
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                  Cold-forged under 800-ton hydraulic pressure from a single titanium billet. Zero screws, zero solder
                  joints. Formed to eliminate mechanical fatigue and retain tension across two decades of nocturnal wear.
                </p>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] block">
                  [ 02 • ORGANIC MATERIALITY ]
                </span>
                <h3 className="text-lg font-bold text-white tracking-wide uppercase">
                  Cured Japanese Acetate
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                  Carved from solid 8mm cured Japanese plant cellulose blocks. Aged for six months and hand-beveled with
                  organic walnut granulate tumblers for deep tactile warmth and obsidian luster.
                </p>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] block">
                  [ 03 • POLARIZED OPTICS ]
                </span>
                <h3 className="text-lg font-bold text-white tracking-wide uppercase">
                  Amber Vapor Polarization
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                  Custom high-refractive-index lenses equipped with multi-layer titanium sputtering. Eliminates 99.9% of
                  harsh nocturnal strobes, wet asphalt reflections, and neon light scatter.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: ARCHIVAL LOOKBOOK — COLLECTION 01
          Clean, spacious, high-end fashion product presentation
      ═══════════════════════════════════════════════════════════════════════ */}
      {!config.hiddenSections?.archive && (
        <section
          id="archive"
          className="relative w-full py-20 sm:py-28 px-6 sm:px-12 md:px-16 border-t"
          style={{
            backgroundColor: BG_DEEP,
            borderColor: BORDER_SUBTLE,
          }}
        >
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-8" style={{ borderColor: BORDER_SUBTLE }}>
              <div>
                <span className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-500 block mb-2">
                  02 / ARCHIVE
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                  Collection 01 Lookbook
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400 tracking-wider">
                3 ARCHIVAL EDITIONS — SPECIFICATION REGISTRY
              </span>
            </div>

            {/* Lookbook Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {lookbookItems.map((item, idx) => {
                const isSelected = selectedFrame === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedFrame(idx)}
                    className={\`border p-8 transition-all duration-300 cursor-pointer flex flex-col justify-between \${
                      isSelected
                        ? "border-white bg-neutral-900/40"
                        : "border-white/10 hover:border-white/30 bg-transparent"
                    }\`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-6">
                        <span>{item.spec}</span>
                        <span className="text-white font-bold">{item.price}</span>
                      </div>

                      <h3 className="text-xl font-bold tracking-tight text-white mb-2 uppercase">
                        {item.name}
                      </h3>
                      <p className="text-xs font-mono text-amber-400/90 mb-6">{item.material}</p>

                      <p className="text-xs text-neutral-400 leading-relaxed font-light mb-8">
                        {item.description}
                      </p>

                      <div className="space-y-2 border-t pt-6 text-xs font-mono text-neutral-400" style={{ borderColor: BORDER_SUBTLE }}>
                        <div className="flex justify-between">
                          <span>Weight:</span>
                          <span className="text-white">{item.weight}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hinge:</span>
                          <span className="text-white">{item.hinge}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Optics:</span>
                          <span className="text-white">{item.lens}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                      <span className={isSelected ? "text-white font-bold" : "text-neutral-500"}>
                        {isSelected ? "Selected" : "Select Edition"}
                      </span>
                      <ArrowUpRight className={\`w-4 h-4 \${isSelected ? "text-white" : "text-neutral-500"}\`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4: TECHNICAL CRAFTSMANSHIP DISCIPLINE (SIMPLE TEXT GRID)
          Authentic luxury data table in pure typography
      ═══════════════════════════════════════════════════════════════════════ */}
      {!config.hiddenSections?.craft && (
        <section
          id="craft"
          className="relative w-full py-20 sm:py-28 px-6 sm:px-12 md:px-16 border-t"
          style={{
            backgroundColor: BG_SURFACE,
            borderColor: BORDER_SUBTLE,
          }}
        >
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-8" style={{ borderColor: BORDER_SUBTLE }}>
              <div>
                <span className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-500 block mb-2">
                  03 / CRAFTSMANSHIP
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                  Technical Specifications & Discipline
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400 tracking-wider">
                CERTIFIED SABAE & NEUCHÂTEL PROTOCOLS
              </span>
            </div>

            {/* Clean Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse">
                <thead>
                  <tr className="border-b text-neutral-500 text-[10px] tracking-[0.2em] uppercase" style={{ borderColor: BORDER_SUBTLE }}>
                    <th className="pb-4 font-normal">DISCIPLINE</th>
                    <th className="pb-4 font-normal">SPECIFICATION</th>
                    <th className="pb-4 font-normal">TOLERANCE</th>
                    <th className="pb-4 font-normal text-right">PROVENANCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300 font-light">
                  <tr>
                    <td className="py-5 font-semibold text-white">Optical Substrate</td>
                    <td className="py-5">High-Index 1.74 Polarized Titanium</td>
                    <td className="py-5 text-neutral-400">±0.01 Diopter Precision</td>
                    <td className="py-5 text-right text-neutral-400">Sabae, Fukui, Japan</td>
                  </tr>
                  <tr>
                    <td className="py-5 font-semibold text-white">Chassis Monobloc</td>
                    <td className="py-5">Aerospace Grade 5 Beta-Titanium</td>
                    <td className="py-5 text-neutral-400">±0.005mm CNC Hydraulic</td>
                    <td className="py-5 text-right text-neutral-400">Neuchâtel, Switzerland</td>
                  </tr>
                  <tr>
                    <td className="py-5 font-semibold text-white">Organic Acetate</td>
                    <td className="py-5">8mm Takiron Japanese Cellulose</td>
                    <td className="py-5 text-neutral-400">6-Month Humidity Curing</td>
                    <td className="py-5 text-right text-neutral-400">Tokyo, Japan</td>
                  </tr>
                  <tr>
                    <td className="py-5 font-semibold text-white">Surface Sputtering</td>
                    <td className="py-5">Matte Vapor Carbon PVD</td>
                    <td className="py-5 text-neutral-400">0.003mm Layer Density</td>
                    <td className="py-5 text-right text-neutral-400">Pforzheim, Germany</td>
                  </tr>
                  <tr>
                    <td className="py-5 font-semibold text-white">Mechanical Lock</td>
                    <td className="py-5">Screwless Cylindrical Friction Detent</td>
                    <td className="py-5 text-neutral-400">20,000 Cyclic Fatigue</td>
                    <td className="py-5 text-right text-neutral-400">Atelier Private Lab</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5: CLI — NEXT.JS CLI INSTALLATION DOCK
      ═══════════════════════════════════════════════════════════════════════ */}
      {!config.hiddenSections?.cli && (
        <section
          id="cli"
          className="relative w-full py-20 px-6 sm:px-12 border-t"
          style={{
            backgroundColor: BG_DEEP,
            borderColor: BORDER_SUBTLE,
          }}
        >
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-500">
              04 / INSTALLATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              Deploy Vapor Obsidian Template
            </h2>

            {/* Minimal Command Bar */}
            <div
              className="border p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto"
              style={{
                backgroundColor: BG_SURFACE,
                borderColor: BORDER_SUBTLE,
              }}
            >
              <div className="font-mono text-xs sm:text-sm text-neutral-200">
                <span className="text-neutral-500 mr-3">$</span>
                <span>npx nexoreui add template-vapor-obsidian</span>
              </div>

              <button
                onClick={copyCliCommand}
                className="px-5 py-2 rounded-full bg-white text-black text-xs font-mono font-bold tracking-wider uppercase hover:bg-neutral-200 transition-all cursor-pointer shrink-0"
              >
                {copied ? "Copied" : "Copy Command"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          EDITORIAL NOIR FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer
        className="w-full py-12 px-6 sm:px-12 border-t text-xs font-mono text-neutral-500"
        style={{
          backgroundColor: BG_DEEP,
          borderColor: BORDER_SUBTLE,
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-white font-bold tracking-[0.2em] uppercase">
            {config.brandName || "VAPOR OBSIDIAN ATELIER"} © 2026
          </span>
          <div className="flex items-center gap-8 text-[11px] tracking-wider uppercase">
            <span>OPTICAL DISCIPLINE</span>
            <span>POLARIZED TITANIUM</span>
            <span>NEXT.JS 15</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
`,
};

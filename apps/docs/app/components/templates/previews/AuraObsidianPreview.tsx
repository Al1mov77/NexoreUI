"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Check,
  Terminal,
  Copy,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

const FONT = {
  display: "'Newsreader', Georgia, serif",
  body: "'Schibsted Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
};

const PALETTE = {
  light: {
    bg: "#EEF0E4",
    surface: "#E2E6D2",
    surfaceRaised: "#D8DEC6",
    line: "#CBD1B6",
    text: "#1C2418",
    muted: "#5E6955",
    accent: "#2F5D3A",
    accentInk: "#F2F6EA",
  },
  dark: {
    bg: "#121711",
    surface: "#1A2119",
    surfaceRaised: "#232D22",
    line: "#2B3629",
    text: "#ECEFE8",
    muted: "#8A9684",
    accent: "#4E875C",
    accentInk: "#0E140D",
  },
};

const MOTION = {
  ease: [0.76, 0, 0.24, 1] as const,
  durationSlow: 0.9,
  durationNormal: 0.65,
  durationFast: 0.25,
};

type FormulaKey = "marula-camellia" | "truffle-seabuckthorn" | "blue-tansy";
type FlaconKey = "daily-30" | "master-50" | "decanter-100";

interface FormulaData {
  id: FormulaKey;
  number: string;
  name: string;
  tagline: string;
  harvest: string;
  viscosity: string;
  absorption: string;
  description: string;
  profile: { name: string; share: string }[];
}

const FORMULAS: Record<FormulaKey, FormulaData> = {
  "marula-camellia": {
    id: "marula-camellia",
    number: "Cru 01",
    name: "Wild Marula & Gold Camellia",
    tagline: "Cold-pressed virgin lipid nectar for barrier restoration",
    harvest: "Sub-Saharan wild marula groves and Kyoto camellia terraces",
    viscosity: "48 cSt silken lipid",
    absorption: "Under 12 seconds",
    description:
      "Cold-pressed from wild marula kernels and winter-harvested gold camellia seed. Replaces depleted epidermal lipids without synthetic emulsifiers or silicones.",
    profile: [
      { name: "Virgin Oleic Acid", share: "72%" },
      { name: "Camellia Oleifera Active", share: "18%" },
      { name: "Plant-Derived Squalane", share: "7%" },
      { name: "Tocopherol Complex", share: "3%" },
    ],
  },
  "truffle-seabuckthorn": {
    id: "truffle-seabuckthorn",
    number: "Cru 02",
    name: "Black Truffle & Sea Buckthorn",
    tagline: "Supercritical CO2 extract for nocturnal lipid recovery",
    harvest: "Perigord oak forest floors and high Himalayan plateaus",
    viscosity: "62 cSt velvet lipid",
    absorption: "Gradual overnight absorption",
    description:
      "Supercritical carbon dioxide extraction of French black truffles paired with high-altitude sea buckthorn berries. Rich in rare palmitoleic fatty acids for restorative rest cycles.",
    profile: [
      { name: "Palmitoleic Omega-7", share: "34%" },
      { name: "Superoxide Dismutase Fraction", share: "28%" },
      { name: "Ergosterol Phyto-Sterols", share: "22%" },
      { name: "Tuber Melanosporum Extract", share: "16%" },
    ],
  },
  "blue-tansy": {
    id: "blue-tansy",
    number: "Cru 03",
    name: "Blue Tansy & Squalane",
    tagline: "Steam-distilled chamazulene nectar for skin equilibrium",
    harvest: "Moroccan Cape Malabata and sugarcane ferment stills",
    viscosity: "36 cSt light lipid",
    absorption: "Immediate saturation",
    description:
      "Intensely azure botanical lipid derived from Moroccan blue tansy blossoms suspended in pure sugarcane squalane. Calms reactive barriers and rebalances skin moisture.",
    profile: [
      { name: "Pure Chamazulene Fraction", share: "14%" },
      { name: "Fermented Plant Squalane", share: "64%" },
      { name: "Alpha-Copaene Active", share: "12%" },
      { name: "Natural Bisabolol", share: "10%" },
    ],
  },
};

interface FlaconData {
  id: FlaconKey;
  name: string;
  capacity: string;
  price: string;
  cents: number;
  dispenser: string;
  dimensions: string;
  shelfLife: string;
  applications: string;
}

const FLACONS: Record<FlaconKey, FlaconData> = {
  "daily-30": {
    id: "daily-30",
    name: "Daily Flacon",
    capacity: "30 ml",
    price: "$145",
    cents: 145,
    dispenser: "Calibrated glass pipette dropper",
    dimensions: "32mm diameter by 98mm height",
    shelfLife: "18 months unsealed",
    applications: "60 to 75 applications",
  },
  "master-50": {
    id: "master-50",
    name: "Master Flacon",
    capacity: "50 ml",
    price: "$210",
    cents: 210,
    dispenser: "Drop-metered obsidian pour collar",
    dimensions: "38mm diameter by 118mm height",
    shelfLife: "24 months unsealed",
    applications: "100 to 120 applications",
  },
  "decanter-100": {
    id: "decanter-100",
    name: "Decanter Flacon",
    capacity: "100 ml",
    price: "$340",
    cents: 340,
    dispenser: "Apothecary ground-glass stopper",
    dimensions: "48mm diameter by 142mm height",
    shelfLife: "30 months unsealed",
    applications: "200 to 240 applications",
  },
};

const EXTRACTIONS = [
  {
    step: "Phase 01",
    title: "Subcritical CO2 Extraction",
    parameter: "31°C at 74 bar pressure",
    details:
      "Supercritical carbon dioxide dissolves fat-soluble botanical compounds without thermal degradation or hydrocarbon solvent residue, leaving 100% active lipid yield.",
  },
  {
    step: "Phase 02",
    title: "Low-Temperature Cold Press",
    parameter: "Under 28°C continuous friction",
    details:
      "Wild kernels undergo single-pass mechanical screw pressing at strictly managed temperatures to protect delicate polyunsaturated chains from thermo-oxidation.",
  },
  {
    step: "Phase 03",
    title: "Biophotonic Nitrogen Enclosure",
    parameter: "0.02% residual oxygen headspace",
    details:
      "Flacons are sealed within an inert nitrogen envelope inside deep violet obsidian glass, eliminating oxidative degradation and photon damage.",
  },
];

function findScroller(el: HTMLElement | null): HTMLElement | null {
  let p = el?.parentElement ?? null;
  while (p) {
    const o = window.getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
    p = p.parentElement;
  }
  return null;
}

export function AuraObsidianPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const shouldReduceMotion = useReducedMotion();

  const [themeOverride, setThemeOverride] = useState<"light" | "dark" | null>(null);
  const currentTheme = themeOverride ?? (config.theme === "dark" ? "dark" : "light");
  const isDark = currentTheme === "dark";
  const colors = isDark ? PALETTE.dark : PALETTE.light;

  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [containerWidth, setContainerWidth] = useState(1200);
  const [activeFormula, setActiveFormula] = useState<FormulaKey>("marula-camellia");
  const [activeFlacon, setActiveFlacon] = useState<FlaconKey>("master-50");
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!rootRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  const isMobile = deviceMode === "mobile" || containerWidth < 640;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);
  const isDesktop = !isMobile && !isTablet;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scroller = findScroller(root);
    const target = scroller || window;

    const handleScroll = () => {
      let currentTop = 0;
      let scrollHeight = 1;

      if (scroller) {
        currentTop = scroller.scrollTop;
        scrollHeight = scroller.scrollHeight - scroller.clientHeight;
      } else {
        currentTop = window.scrollY || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      }

      const p = scrollHeight > 0 ? Math.min(1, Math.max(0, currentTop / scrollHeight)) : 0;
      setScrollProgress(p);
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  const copyCommand = () => {
    navigator.clipboard.writeText("npx nexoreui add template-aura-obsidian-pro");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      rootRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePlaceOrder = () => {
    setOrderConfirmed(true);
    setTimeout(() => setOrderConfirmed(false), 3200);
  };

  const currentFormulaData = FORMULAS[activeFormula];
  const currentFlaconData = FLACONS[activeFlacon];
  const totalPrice = currentFlaconData.cents * quantity;

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-clip transition-colors duration-500"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: FONT.body,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Schibsted+Grotesk:wght@400;500;600&display=swap"
      />

      <header
        className="sticky top-0 z-50 w-full transition-colors duration-300"
        style={{
          backgroundColor: isDark
            ? "rgba(18, 23, 17, 0.92)"
            : "rgba(238, 240, 228, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${colors.line}`,
        }}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between ${
            isMobile ? "px-4 h-14" : isTablet ? "px-6 h-15" : "px-8 h-16"
          }`}
        >
          <div className="flex items-center gap-3">
            <a
              href="#hero"
              className={`font-semibold tracking-tight transition-opacity hover:opacity-80 ${
                isMobile ? "text-sm" : "text-base"
              }`}
              style={{ fontFamily: FONT.display }}
            >
              {config.brandName || "Aura Obsidian Botanica"}
            </a>
            {!isMobile && (
              <span
                className="text-xs uppercase tracking-widest px-2 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.muted,
                }}
              >
                Phyto-Lipids
              </span>
            )}
          </div>

          {!isMobile && !isTablet && (
            <nav className="flex items-center gap-6 text-xs uppercase tracking-wider font-medium">
              <a
                href="#hero"
                className="transition-colors hover:opacity-100 opacity-70"
                style={{ color: colors.text }}
              >
                Living Specimen
              </a>
              <a
                href="#extraction"
                className="transition-colors hover:opacity-100 opacity-70"
                style={{ color: colors.text }}
              >
                Extraction
              </a>
              <a
                href="#atlas"
                className="transition-colors hover:opacity-100 opacity-70"
                style={{ color: colors.text }}
              >
                Lipid Atlas
              </a>
              <a
                href="#vessels"
                className="transition-colors hover:opacity-100 opacity-70"
                style={{ color: colors.text }}
              >
                Flacons
              </a>
              <a
                href="#reserve"
                className="transition-colors hover:opacity-100 opacity-70"
                style={{ color: colors.text }}
              >
                Reserve
              </a>
            </nav>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setThemeOverride(isDark ? "light" : "dark")}
              className={`flex items-center gap-1.5 rounded-lg transition-colors cursor-pointer ${
                isMobile ? "p-2" : "px-2.5 py-1.5 text-xs font-medium"
              }`}
              style={{
                backgroundColor: colors.surface,
                color: colors.text,
              }}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-emerald-800" />
              )}
              {!isMobile && <span>{isDark ? "Light" : "Dark"}</span>}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={{
                backgroundColor: colors.surface,
                color: colors.text,
              }}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>

            {!isMobile && (
              <button
                type="button"
                onClick={copyCommand}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Terminal className="w-3.5 h-3.5 opacity-60" />
                )}
                <span>{copied ? "Copied" : "CLI"}</span>
              </button>
            )}

            <a
              href="#reserve"
              className="rounded-lg font-medium transition-transform active:scale-95 cursor-pointer text-center px-3.5 py-1.5 text-xs"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentInk,
              }}
            >
              Reserve
            </a>
          </div>
        </div>

        <div
          className="w-full h-[1px] transition-all origin-left"
          style={{
            backgroundColor: colors.accent,
            transform: `scaleX(${scrollProgress})`,
          }}
        />
      </header>

      <section
        id="hero"
        className={`relative w-full overflow-hidden flex flex-col justify-between ${
          isMobile
            ? "min-h-[560px] p-5"
            : isTablet
            ? "min-h-[660px] p-8"
            : "min-h-[calc(100vh-4rem)] p-10 lg:p-14"
        }`}
      >
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            ref={videoRef}
            src="/videos/aura-obsidian-botanica.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center pointer-events-none"
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? "linear-gradient(to top, rgba(18,23,17,0.85) 0%, rgba(18,23,17,0.35) 45%, rgba(18,23,17,0.1) 75%, transparent 100%)"
                : "linear-gradient(to top, rgba(238,240,228,0.88) 0%, rgba(238,240,228,0.4) 45%, rgba(238,240,228,0.15) 75%, transparent 100%)",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? "linear-gradient(to bottom, rgba(18,23,17,0.4) 0%, transparent 25%)"
                : "linear-gradient(to bottom, rgba(238,240,228,0.4) 0%, transparent 25%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center">
          <div
            className="flex items-center p-1 rounded-xl"
            style={{
              backgroundColor: isDark
                ? "rgba(18, 23, 17, 0.65)"
                : "rgba(238, 240, 228, 0.65)",
              border: `1px solid ${colors.line}`,
              backdropFilter: "blur(8px)",
            }}
          >
            {(Object.keys(FORMULAS) as FormulaKey[]).map((fKey) => (
              <button
                key={fKey}
                type="button"
                onClick={() => setActiveFormula(fKey)}
                className="relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                style={{
                  color: activeFormula === fKey ? colors.accentInk : colors.text,
                }}
              >
                {activeFormula === fKey && (
                  <motion.div
                    layoutId="hero-active-formula"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: colors.accent }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 38,
                    }}
                  />
                )}
                <span className="relative z-10">{FORMULAS[fKey].number}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto mt-auto pt-16">
          <div className="max-w-3xl">
            <span
              className="inline-block text-xs uppercase tracking-widest font-medium mb-3"
              style={{ color: colors.accent }}
            >
              {currentFormulaData.harvest}
            </span>

            <h1
              className={`font-medium tracking-tight text-balance mb-4 ${
                isMobile
                  ? "text-3xl leading-[1.08]"
                  : isTablet
                  ? "text-5xl leading-[1.04]"
                  : "text-6xl lg:text-7xl leading-[1.02]"
              }`}
              style={{ fontFamily: FONT.display }}
            >
              {config.heroTitle || currentFormulaData.name}
            </h1>

            <p
              className={`leading-relaxed mb-6 max-w-2xl ${
                isMobile ? "text-sm" : isTablet ? "text-base" : "text-lg"
              }`}
              style={{ color: colors.muted }}
            >
              {config.heroSubtitle || currentFormulaData.description}
            </p>

            <div className={`flex items-center gap-3 ${isMobile ? "flex-col w-full" : "flex-row"}`}>
              <a
                href="#reserve"
                className={`rounded-xl text-sm font-medium transition-all hover:opacity-95 active:scale-95 cursor-pointer text-center ${
                  isMobile ? "w-full py-3" : "px-6 py-3"
                }`}
                style={{
                  backgroundColor: colors.accent,
                  color: colors.accentInk,
                }}
              >
                Reserve Allocation
              </a>
              <a
                href="#atlas"
                className={`rounded-xl text-sm font-medium transition-all hover:opacity-90 active:scale-95 cursor-pointer text-center ${
                  isMobile ? "w-full py-3" : "px-6 py-3"
                }`}
                style={{
                  backgroundColor: isDark
                    ? "rgba(26, 33, 25, 0.75)"
                    : "rgba(226, 230, 210, 0.75)",
                  color: colors.text,
                  border: `1px solid ${colors.line}`,
                  backdropFilter: "blur(8px)",
                }}
              >
                Inspect Lipid Atlas
              </a>
            </div>

            <div
              className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono ${
                isMobile ? "flex-col items-start gap-2" : "flex-row"
              }`}
              style={{
                borderColor: colors.line,
                color: colors.muted,
              }}
            >
              <div className="flex items-center gap-4">
                <span>Viscosity: {currentFormulaData.viscosity}</span>
                <span>Absorption: {currentFormulaData.absorption}</span>
              </div>
              <span>Basel &bull; Paris &bull; Kyoto</span>
            </div>
          </div>
        </div>
      </section>

      <main
        className={`max-w-7xl mx-auto flex flex-col ${
          isMobile ? "px-4 py-6 gap-6" : isTablet ? "px-6 py-8 gap-8" : "px-8 py-10 gap-10"
        }`}
      >
        {!config.hiddenSections?.extraction && (
          <section
            id="extraction"
            className={`sticky ${isMobile ? "top-16" : "top-20"} z-20 w-full rounded-2xl md:rounded-3xl flex flex-col justify-between transition-all ${
              isMobile ? "p-5" : isTablet ? "p-8" : "p-10 lg:p-12"
            }`}
            style={{
              backgroundColor: colors.surfaceRaised,
              boxShadow: isDark
                ? "0 20px 40px -15px rgba(0,0,0,0.6)"
                : "0 20px 40px -15px rgba(28,36,24,0.08)",
            }}
          >
            <div>
              <div
                className={`flex justify-between mb-8 ${
                  isMobile ? "flex-col gap-2" : "flex-row items-baseline gap-4"
                }`}
              >
                <div>
                  <span
                    className="inline-block text-xs uppercase tracking-widest font-medium mb-2"
                    style={{ color: colors.muted }}
                  >
                    Extraction Methodology
                  </span>
                  <h2
                    className={`font-medium tracking-tight ${
                      isMobile ? "text-2xl" : "text-3xl sm:text-4xl"
                    }`}
                    style={{ fontFamily: FONT.display }}
                  >
                    The Three Cold Extraction Mechanics
                  </h2>
                </div>
                <span className="text-xs font-mono" style={{ color: colors.muted }}>
                  Zero Hydrocarbon Solvents
                </span>
              </div>

              <div
                className={`grid ${
                  isMobile ? "grid-cols-1 gap-4" : isTablet ? "grid-cols-1 gap-4" : "grid-cols-3 gap-6"
                }`}
              >
                {EXTRACTIONS.map((item, idx) => (
                  <motion.div
                    key={item.step}
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    className="p-6 rounded-2xl flex flex-col justify-between gap-6 transition-all"
                    style={{
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.line}`,
                    }}
                  >
                    <div>
                      <span
                        className="text-xs font-mono uppercase tracking-wider block mb-3"
                        style={{ color: colors.accent }}
                      >
                        {item.step}
                      </span>
                      <h3
                        className="text-xl font-medium tracking-tight mb-2"
                        style={{ fontFamily: FONT.display }}
                      >
                        {item.title}
                      </h3>
                      <div
                        className="text-xs font-mono px-2.5 py-1 rounded inline-block mb-4"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                        }}
                      >
                        {item.parameter}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>
                        {item.details}
                      </p>
                    </div>

                    <div
                      className="pt-4 border-t text-xs font-mono flex items-center justify-between"
                      style={{
                        borderColor: colors.line,
                        color: colors.muted,
                      }}
                    >
                      <span>Specimen 0{idx + 1}</span>
                      <span>Verified Active</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div
              className={`mt-8 pt-6 border-t flex items-center justify-between text-xs ${
                isMobile ? "flex-col items-start gap-3" : "flex-row gap-4"
              }`}
              style={{
                borderColor: colors.line,
                color: colors.muted,
              }}
            >
              <span>Cryogenic preservation locks heat-fragile vitamins in active state.</span>
              <a
                href="#atlas"
                className="inline-flex items-center gap-1 font-medium hover:opacity-80 transition-opacity"
                style={{ color: colors.text }}
              >
                Inspect active formulations
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>
        )}

        {!config.hiddenSections?.atlas && (
          <section
            id="atlas"
            className={`sticky ${isMobile ? "top-20" : "top-24"} z-30 w-full rounded-2xl md:rounded-3xl flex flex-col justify-between transition-all ${
              isMobile ? "p-5" : isTablet ? "p-8" : "p-10 lg:p-12"
            }`}
            style={{
              backgroundColor: colors.surface,
              boxShadow: isDark
                ? "0 20px 40px -15px rgba(0,0,0,0.7)"
                : "0 20px 40px -15px rgba(28,36,24,0.1)",
            }}
          >
            <div>
              <div
                className={`flex justify-between mb-8 ${
                  isMobile ? "flex-col gap-3" : "flex-row items-baseline gap-4"
                }`}
              >
                <div>
                  <span
                    className="inline-block text-xs uppercase tracking-widest font-medium mb-2"
                    style={{ color: colors.muted }}
                  >
                    Terroir & Chemistry
                  </span>
                  <h2
                    className={`font-medium tracking-tight ${
                      isMobile ? "text-2xl" : "text-3xl sm:text-4xl"
                    }`}
                    style={{ fontFamily: FONT.display }}
                  >
                    Interactive Formulation Atlas
                  </h2>
                </div>

                <div
                  className="flex items-center p-1 rounded-xl"
                  style={{
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.line}`,
                  }}
                >
                  {(Object.keys(FORMULAS) as FormulaKey[]).map((fKey) => (
                    <button
                      key={fKey}
                      type="button"
                      onClick={() => setActiveFormula(fKey)}
                      className="relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      style={{
                        color: activeFormula === fKey ? colors.accentInk : colors.text,
                      }}
                    >
                      {activeFormula === fKey && (
                        <motion.div
                          layoutId="atlas-formula-active"
                          className="absolute inset-0 rounded-lg"
                          style={{ backgroundColor: colors.accent }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 38,
                          }}
                        />
                      )}
                      <span className="relative z-10">{FORMULAS[fKey].number}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`grid ${
                  isMobile || isTablet ? "grid-cols-1 gap-6" : "grid-cols-12 gap-8"
                } items-start`}
              >
                <div className={`${isMobile || isTablet ? "w-full" : "col-span-7"} flex flex-col gap-6`}>
                  <div>
                    <span
                      className="text-xs font-mono uppercase tracking-widest block mb-2"
                      style={{ color: colors.accent }}
                    >
                      {currentFormulaData.number} Harvest
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-medium tracking-tight mb-2"
                      style={{ fontFamily: FONT.display }}
                    >
                      {currentFormulaData.name}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: colors.muted }}>
                      {currentFormulaData.tagline}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.text }}>
                    {currentFormulaData.description}
                  </p>

                  <div
                    className={`grid ${
                      isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-4"
                    } p-5 rounded-2xl`}
                    style={{
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.line}`,
                    }}
                  >
                    <div>
                      <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: colors.muted }}>
                        Origin Terroir
                      </span>
                      <p className="text-xs sm:text-sm font-medium">{currentFormulaData.harvest}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wider block mb-1" style={{ color: colors.muted }}>
                        Lipid Dynamics
                      </span>
                      <p className="text-xs sm:text-sm font-medium">
                        {currentFormulaData.viscosity} &bull; {currentFormulaData.absorption}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    isMobile || isTablet ? "w-full" : "col-span-5"
                  } p-6 rounded-2xl flex flex-col justify-between gap-6`}
                  style={{
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.line}`,
                  }}
                >
                  <div>
                    <h4
                      className="text-lg font-medium tracking-tight mb-4"
                      style={{ fontFamily: FONT.display }}
                    >
                      Lipid Composition Share
                    </h4>

                    <div className="flex flex-col gap-4">
                      {currentFormulaData.profile.map((item) => (
                        <div key={item.name} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span>{item.name}</span>
                            <span className="font-mono">{item.share}</span>
                          </div>
                          <div
                            className="w-full h-1.5 rounded-full overflow-hidden"
                            style={{ backgroundColor: colors.surface }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: item.share }}
                              transition={{ duration: 0.8, ease: MOTION.ease }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: colors.accent }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="pt-4 border-t flex items-center justify-between text-xs"
                    style={{
                      borderColor: colors.line,
                      color: colors.muted,
                    }}
                  >
                    <span>Terpene Bio-Availability: 100%</span>
                    <a
                      href="#reserve"
                      className="font-medium hover:opacity-80 transition-opacity"
                      style={{ color: colors.text }}
                    >
                      Select this Cru &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`mt-8 pt-6 border-t flex items-center justify-between text-xs ${
                isMobile ? "flex-col items-start gap-2" : "flex-row"
              }`}
              style={{
                borderColor: colors.line,
                color: colors.muted,
              }}
            >
              <span>Formulated without synthetic carriers, essential oils, or added perfume.</span>
              <span className="font-mono">Batch Stability Tested</span>
            </div>
          </section>
        )}

        {!config.hiddenSections?.vessels && (
          <section
            id="vessels"
            className={`sticky ${isMobile ? "top-24" : "top-28"} z-40 w-full rounded-2xl md:rounded-3xl flex flex-col justify-between transition-all ${
              isMobile ? "p-5" : isTablet ? "p-8" : "p-10 lg:p-12"
            }`}
            style={{
              backgroundColor: colors.surfaceRaised,
              boxShadow: isDark
                ? "0 20px 40px -15px rgba(0,0,0,0.8)"
                : "0 20px 40px -15px rgba(28,36,24,0.12)",
            }}
          >
            <div>
              <div
                className={`flex justify-between mb-8 ${
                  isMobile ? "flex-col gap-2" : "flex-row items-baseline gap-4"
                }`}
              >
                <div>
                  <span
                    className="inline-block text-xs uppercase tracking-widest font-medium mb-2"
                    style={{ color: colors.muted }}
                  >
                    Biophotonic Storage
                  </span>
                  <h2
                    className={`font-medium tracking-tight ${
                      isMobile ? "text-2xl" : "text-3xl sm:text-4xl"
                    }`}
                    style={{ fontFamily: FONT.display }}
                  >
                    The Obsidian Glass Vessels
                  </h2>
                </div>
                <span className="text-xs font-mono" style={{ color: colors.muted }}>
                  100% UV Protection
                </span>
              </div>

              <div
                className={`grid ${
                  isMobile ? "grid-cols-1 gap-4" : isTablet ? "grid-cols-1 gap-4" : "grid-cols-3 gap-6"
                }`}
              >
                {(Object.keys(FLACONS) as FlaconKey[]).map((fKey) => {
                  const flacon = FLACONS[fKey];
                  const isSelected = activeFlacon === fKey;
                  return (
                    <motion.div
                      key={fKey}
                      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                      onClick={() => setActiveFlacon(fKey)}
                      className="p-6 rounded-2xl flex flex-col justify-between gap-6 transition-all cursor-pointer"
                      style={{
                        backgroundColor: colors.surface,
                        border: isSelected
                          ? `2px solid ${colors.accent}`
                          : `1px solid ${colors.line}`,
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className="text-xs font-mono uppercase tracking-wider"
                            style={{ color: colors.muted }}
                          >
                            {flacon.capacity}
                          </span>
                          <span
                            className="text-lg font-mono font-medium"
                            style={{ color: colors.text }}
                          >
                            {flacon.price}
                          </span>
                        </div>

                        <h3
                          className="text-xl font-medium tracking-tight mb-2"
                          style={{ fontFamily: FONT.display }}
                        >
                          {flacon.name}
                        </h3>

                        <p className="text-xs sm:text-sm mb-4" style={{ color: colors.muted }}>
                          {flacon.dispenser}
                        </p>

                        <div
                          className="space-y-2 pt-4 border-t text-xs font-mono"
                          style={{
                            borderColor: colors.line,
                            color: colors.muted,
                          }}
                        >
                          <div className="flex justify-between">
                            <span>Dimensions:</span>
                            <span>{flacon.dimensions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lifespan:</span>
                            <span>{flacon.shelfLife}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Yield:</span>
                            <span>{flacon.applications}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFlacon(fKey);
                        }}
                        className="w-full py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? colors.accent : colors.bg,
                          color: isSelected ? colors.accentInk : colors.text,
                        }}
                      >
                        {isSelected ? "Selected Flacon" : "Select Format"}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div
              className={`mt-8 pt-6 border-t flex items-center justify-between text-xs ${
                isMobile ? "flex-col items-start gap-3" : "flex-row gap-4"
              }`}
              style={{
                borderColor: colors.line,
                color: colors.muted,
              }}
            >
              <span>Obsidian violet glass filters all visible light while admitting restorative violet & infrared spectrums.</span>
              <a
                href="#reserve"
                className="inline-flex items-center gap-1 font-medium hover:opacity-80 transition-opacity"
                style={{ color: colors.text }}
              >
                Proceed to acquisition
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>
        )}

        {!config.hiddenSections?.reserve && (
          <section
            id="reserve"
            className={`sticky ${isMobile ? "top-28" : "top-32"} z-50 w-full rounded-2xl md:rounded-3xl flex flex-col justify-between transition-all ${
              isMobile ? "p-5" : isTablet ? "p-8" : "p-10 lg:p-12"
            }`}
            style={{
              backgroundColor: colors.surface,
              boxShadow: isDark
                ? "0 20px 40px -15px rgba(0,0,0,0.9)"
                : "0 20px 40px -15px rgba(28,36,24,0.15)",
            }}
          >
            <div>
              <div
                className={`flex justify-between mb-8 ${
                  isMobile ? "flex-col gap-2" : "flex-row items-baseline gap-4"
                }`}
              >
                <div>
                  <span
                    className="inline-block text-xs uppercase tracking-widest font-medium mb-2"
                    style={{ color: colors.muted }}
                  >
                    Allocation & Acquisition
                  </span>
                  <h2
                    className={`font-medium tracking-tight ${
                      isMobile ? "text-2xl" : "text-3xl sm:text-4xl"
                    }`}
                    style={{ fontFamily: FONT.display }}
                  >
                    Reserve Harvest Flacon
                  </h2>
                </div>
                <span className="text-xs font-mono" style={{ color: colors.muted }}>
                  Direct Laboratory Fulfillment
                </span>
              </div>

              <div
                className={`grid ${
                  isMobile || isTablet ? "grid-cols-1 gap-6" : "grid-cols-12 gap-8"
                }`}
              >
                <div
                  className={`${
                    isMobile || isTablet ? "w-full p-5" : "col-span-7 p-8"
                  } rounded-2xl flex flex-col gap-6`}
                  style={{
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.line}`,
                  }}
                >
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider block mb-2">
                      1. Select Cru Formulation
                    </label>
                    <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-3 gap-2"}`}>
                      {(Object.keys(FORMULAS) as FormulaKey[]).map((fKey) => (
                        <button
                          key={fKey}
                          type="button"
                          onClick={() => setActiveFormula(fKey)}
                          className="p-3 rounded-xl text-left border transition-all cursor-pointer"
                          style={{
                            backgroundColor: activeFormula === fKey ? colors.surface : "transparent",
                            borderColor: activeFormula === fKey ? colors.accent : colors.line,
                          }}
                        >
                          <span className="text-xs font-mono block opacity-60">
                            {FORMULAS[fKey].number}
                          </span>
                          <span className="text-xs font-medium block truncate">
                            {FORMULAS[fKey].name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider block mb-2">
                      2. Select Flacon Format
                    </label>
                    <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-3 gap-2"}`}>
                      {(Object.keys(FLACONS) as FlaconKey[]).map((flKey) => (
                        <button
                          key={flKey}
                          type="button"
                          onClick={() => setActiveFlacon(flKey)}
                          className="p-3 rounded-xl text-left border transition-all cursor-pointer"
                          style={{
                            backgroundColor: activeFlacon === flKey ? colors.surface : "transparent",
                            borderColor: activeFlacon === flKey ? colors.accent : colors.line,
                          }}
                        >
                          <span className="text-xs font-mono block opacity-60">
                            {FLACONS[flKey].capacity}
                          </span>
                          <span className="text-xs font-medium block">
                            {FLACONS[flKey].name}
                          </span>
                          <span className="text-xs font-mono block font-medium mt-1">
                            {FLACONS[flKey].price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider block mb-2">
                      3. Quantity Allocation
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold transition-opacity hover:opacity-80 cursor-pointer"
                        style={{ borderColor: colors.line, backgroundColor: colors.surface }}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-mono text-sm font-semibold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                        className="w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold transition-opacity hover:opacity-80 cursor-pointer"
                        style={{ borderColor: colors.line, backgroundColor: colors.surface }}
                      >
                        +
                      </button>
                      <span className="text-xs ml-2" style={{ color: colors.muted }}>
                        Max 5 flacons per allocation
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    isMobile || isTablet ? "w-full p-5" : "col-span-5 p-8"
                  } rounded-2xl flex flex-col justify-between gap-6`}
                  style={{
                    backgroundColor: colors.surfaceRaised,
                    border: `1px solid ${colors.line}`,
                  }}
                >
                  <div className="space-y-4">
                    <h3
                      className="text-xl font-medium tracking-tight"
                      style={{ fontFamily: FONT.display }}
                    >
                      Allocation Summary
                    </h3>

                    <div
                      className="space-y-2 text-xs border-y py-4"
                      style={{ borderColor: colors.line }}
                    >
                      <div className="flex justify-between">
                        <span style={{ color: colors.muted }}>Formulation:</span>
                        <span className="font-medium text-right">{currentFormulaData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.muted }}>Vessel format:</span>
                        <span className="font-medium">
                          {currentFlaconData.name} ({currentFlaconData.capacity})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.muted }}>Flacon unit price:</span>
                        <span className="font-mono">{currentFlaconData.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.muted }}>Quantity:</span>
                        <span className="font-mono">{quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.muted }}>Preservation seal:</span>
                        <span>Nitrogen purged</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-2">
                      <span className="text-sm font-medium">Total Allocation</span>
                      <span className="text-2xl font-mono font-semibold" style={{ color: colors.text }}>
                        ${totalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:opacity-95 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.accentInk,
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {orderConfirmed ? (
                          <motion.span
                            key="confirmed"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="inline-flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Allocation Confirmed
                          </motion.span>
                        ) : (
                          <motion.span
                            key="default"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                          >
                            Acquire Flacon Allocation
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>

                    <div className="flex items-center justify-between text-xs font-mono" style={{ color: colors.muted }}>
                      <span>Complimentary DHL Express</span>
                      <span>Carbon Neutral Shipment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`mt-8 pt-6 border-t flex items-center justify-between text-xs ${
                isMobile ? "flex-col items-start gap-3" : "flex-row gap-4"
              }`}
              style={{
                borderColor: colors.line,
                color: colors.muted,
              }}
            >
              <span>Ships in shock-absorbent mycelium insulation. Hand-numbered flacon label.</span>
              <button
                type="button"
                onClick={copyCommand}
                className="inline-flex items-center gap-1.5 font-mono hover:opacity-80 transition-opacity"
                style={{ color: colors.text }}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>npx nexoreui add template-aura-obsidian-pro</span>
              </button>
            </div>
          </section>
        )}
      </main>

      <footer
        className="w-full mt-16 border-t transition-colors"
        style={{
          borderColor: colors.line,
          backgroundColor: colors.surface,
          color: colors.muted,
        }}
      >
        <div
          className={`max-w-7xl mx-auto py-12 ${
            isMobile ? "px-4" : isTablet ? "px-6" : "px-8"
          }`}
        >
          <div
            className={`grid mb-12 ${
              isMobile ? "grid-cols-1 gap-8" : isTablet ? "grid-cols-2 gap-8" : "grid-cols-4 gap-8"
            }`}
          >
            <div>
              <span
                className="text-base font-semibold block mb-3"
                style={{ color: colors.text, fontFamily: FONT.display }}
              >
                {config.brandName || "Aura Obsidian Botanica"}
              </span>
              <p className="text-xs leading-relaxed max-w-xs">
                Bio-identical phyto-lipid laboratory. Formulating supercritical plant extracts in biophotonic obsidian glass.
              </p>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider block mb-3" style={{ color: colors.text }}>
                Laboratories
              </span>
              <ul className="space-y-2 text-xs">
                <li>Basel &bull; Clarification & CO2 Press</li>
                <li>Paris &bull; Terpene Profiling</li>
                <li>Kyoto &bull; Camellia Seed Extraction</li>
              </ul>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider block mb-3" style={{ color: colors.text }}>
                Extraction Standards
              </span>
              <ul className="space-y-2 text-xs">
                <li>0.00% Hydrocarbon Solvents</li>
                <li>Single-Pass Mechanical Press</li>
                <li>Inert Nitrogen Enclosure</li>
                <li>Biophotonic UV Glass</li>
              </ul>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider block mb-3" style={{ color: colors.text }}>
                Developer CLI
              </span>
              <p className="text-xs mb-3">Install standalone template into your Next.js application:</p>
              <button
                type="button"
                onClick={copyCommand}
                className="w-full p-2.5 rounded-lg text-left font-mono text-xs flex items-center justify-between transition-colors cursor-pointer"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.line}`,
                }}
              >
                <span className="truncate">npx nexoreui add template-aura-obsidian-pro</span>
                {copied ? <Check className="w-3.5 h-3.5 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
              </button>
            </div>
          </div>

          <div
            className={`pt-8 border-t flex items-center justify-between text-xs font-mono ${
              isMobile ? "flex-col items-start gap-2" : "flex-row"
            }`}
            style={{ borderColor: colors.line }}
          >
            <span>&copy; {new Date().getFullYear()} Aura Obsidian Botanica. All rights reserved.</span>
            <span>NexoreUI Pro Template Specification</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

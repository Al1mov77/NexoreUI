"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  Menu,
  Moon,
  RotateCcw,
  Sun,
  X,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

type ThemeMode = "dark" | "light";
type IlluminationKey = "solar" | "grazing" | "cuticle";

interface PaletteTokens {
  bg: string;
  surface: string;
  elevated: string;
  line: string;
  text: string;
  muted: string;
  accent: string;
  accentInk: string;
}

const PALETTE: Record<ThemeMode, PaletteTokens> = {
  dark: {
    bg: "#090A0C",
    surface: "#111317",
    elevated: "#181B21",
    line: "#232730",
    text: "#F3F4F6",
    muted: "#8E95A5",
    accent: "#38BDF8",
    accentInk: "#090A0C",
  },
  light: {
    bg: "#F7F7F5",
    surface: "#FFFFFF",
    elevated: "#EFECE6",
    line: "#DEDAD2",
    text: "#121316",
    muted: "#5C606B",
    accent: "#0284C7",
    accentInk: "#FFFFFF",
  },
};

const FONT = {
  display: "'Gloock', Georgia, serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'IBM Plex Mono', monospace",
} as const;

const MOTION = {
  editorialEase: [0.76, 0, 0.24, 1] as const,
  softEase: [0.22, 1, 0.36, 1] as const,
  revealDuration: 0.75,
  microDuration: 0.35,
} as const;

const ILLUMINATION_MODES: Record<
  IlluminationKey,
  {
    label: string;
    overlay: string;
  }
> = {
  solar: {
    label: "Solar 33°",
    overlay: "rgba(56, 189, 248, 0.08)",
  },
  grazing: {
    label: "Oblique 52°",
    overlay: "rgba(2, 132, 199, 0.14)",
  },
  cuticle: {
    label: "Backlit Base",
    overlay: "rgba(217, 119, 6, 0.10)",
  },
};

interface DissectionPlate {
  id: string;
  magnification: string;
  scaleMetric: string;
  title: string;
  description: string;
  image: string;
  captionTitle: string;
  captionBody: string;
}

const DISSECTION_PLATES: readonly DissectionPlate[] = [
  {
    id: "plate-01",
    magnification: "20× Macro",
    scaleMetric: "154 mm Forewing",
    title: "Dorsal Forewing Membrane",
    description:
      "When immersed in organic solvent, the dorsal forewing of Morpho didius loses none of its color. Its cobalt luminance comes from physical sub-micron geometry rather than chemical dye.",
    image: "/images/psyche-stage-1-wing.jpg",
    captionTitle: "Refractive Index Contrast",
    captionBody:
      "Alternating layers of translucent cuticle and interstitial air act as a natural dielectric mirror.",
  },
  {
    id: "plate-02",
    magnification: "800× Darkfield",
    scaleMetric: "100 × 50 μm Scale",
    title: "Imbricated Cover & Ground Scales",
    description:
      "Over 120,000 overlapping scales tile the wing surface like roof slates. Each scale carries parallel longitudinal ridges spaced 700 nanometers apart that diffuse light across a wide viewing cone.",
    image: "/images/psyche-stage-2-scales.jpg",
    captionTitle: "Disordered Ridge Heights",
    captionBody:
      "Subtle height variations between neighboring ridges prevent mirror glare and keep the blue uniform across angles.",
  },
  {
    id: "plate-03",
    magnification: "25,000× SEM",
    scaleMetric: "180 nm Shelf Period",
    title: "Quarter-Wave Chitin Lamellae",
    description:
      "Under scanning electron microscopy, each ridge branches into eight to ten horizontal nano-shelves separated by 180 nm air gaps, amplifying 472 nm blue wavefronts in phase.",
    image: "/images/psyche-stage-3-lamellae.jpg",
    captionTitle: "Constructive Interference",
    captionBody:
      "Nine serial chitin-air interfaces reflect 78% of incident blue light within a narrow 35 nm spectral band.",
  },
  {
    id: "plate-04",
    magnification: "40,000× Section",
    scaleMetric: "Basal Substrate",
    title: "Melanin Absorption Floor",
    description:
      "Red, yellow, and green wavelengths pass through the upper chitin lattice and are absorbed by a dense basal layer of melanin granules, preventing white backscatter.",
    image: "/images/psyche-stage-4-vitrine.jpg",
    captionTitle: "Stray-Light Suppression",
    captionBody:
      "Without this dark underlying floor, ambient light would scatter back and wash out the cobalt reflection.",
  },
] as const;

interface SpecimenEntry {
  id: string;
  scientificName: string;
  commonName: string;
  locality: string;
  wingspan: string;
  latticeD: number;
  angleTheta: number;
  lamellae: number;
  reflectance: string;
  image: string;
  note: string;
}

const SPECIMENS: readonly SpecimenEntry[] = [
  {
    id: "morpho-didius",
    scientificName: "Morpho didius",
    commonName: "Giant Blue Morpho",
    locality: "Huánuco Valley, Peru",
    wingspan: "154 mm",
    latticeD: 180,
    angleTheta: 33,
    lamellae: 9,
    reflectance: "78%",
    image: "/images/psyche-stage-1-wing.jpg",
    note: "Nine-tier dendritic ridge grating above a dense melanin floor produces wide-angle cobalt iridescence.",
  },
  {
    id: "morpho-rhetenor",
    scientificName: "Morpho rhetenor",
    commonName: "Rhetenor Blue Morpho",
    locality: "Saül Canopy, French Guiana",
    wingspan: "138 mm",
    latticeD: 168,
    angleTheta: 28,
    lamellae: 11,
    reflectance: "84%",
    image: "/images/psyche-stage-2-scales.jpg",
    note: "Lacks diffused cover scales; exposed ground scales generate a directional mirror-like flash at 464 nm.",
  },
  {
    id: "troides-priamus",
    scientificName: "Troides priamus",
    commonName: "Priam's Birdwing",
    locality: "Morobe Province, Papua New Guinea",
    wingspan: "162 mm",
    latticeD: 195,
    angleTheta: 26,
    lamellae: 7,
    reflectance: "71%",
    image: "/images/psyche-stage-3-lamellae.jpg",
    note: "Couples 548 nm multilayer groove interference with fluorescent pigment inside the scale lumen.",
  },
  {
    id: "chrysiridia-rhipheus",
    scientificName: "Chrysiridia rhipheus",
    commonName: "Madagascan Sunset Moth",
    locality: "Ranomafana, Madagascar",
    wingspan: "92 mm",
    latticeD: 215,
    angleTheta: 22,
    lamellae: 6,
    reflectance: "74%",
    image: "/images/psyche-stage-4-vitrine.jpg",
    note: "Curved cuticular ribbons reflect polarized light between adjacent scales, shifting from emerald to gold.",
  },
] as const;

interface VitrineSpecGroup {
  id: string;
  label: string;
  options: readonly {
    id: string;
    name: string;
    spec: string;
    delta: number;
    massG: number;
  }[];
}

const VITRINE_GROUPS: readonly VitrineSpecGroup[] = [
  {
    id: "frame",
    label: "Housing Alloy",
    options: [
      {
        id: "ti-g5",
        name: "Grade 5 Titanium",
        spec: "CNC monoblock Ti-6Al-4V, bead-blasted matte finish",
        delta: 0,
        massG: 1420,
      },
      {
        id: "cu-ox",
        name: "Archival Bronze",
        spec: "Solid CuZn37 billet with hand-rubbed dark patina",
        delta: 280,
        massG: 2180,
      },
      {
        id: "ta-pvd",
        name: "Brushed Stainless 316L",
        spec: "Passivated low-carbon steel with matte vapor barrier",
        delta: 460,
        massG: 1890,
      },
    ],
  },
  {
    id: "glazing",
    label: "Optical Glazing",
    options: [
      {
        id: "quartz-uv",
        name: "UV-Cut Fused Quartz",
        spec: "99.8% ultraviolet block, <0.3% surface reflection",
        delta: 0,
        massG: 380,
      },
      {
        id: "ar-boro",
        name: "Anti-Reflective Borosilicate",
        spec: "Multi-coated museum glass, 99.4% light transmission",
        delta: 190,
        massG: 340,
      },
    ],
  },
  {
    id: "atmosphere",
    label: "Conservation Seal",
    options: [
      {
        id: "argon-5n",
        name: "Dry Argon Fill",
        spec: "Positive-pressure inert gas at 0% relative humidity",
        delta: 0,
        massG: 18,
      },
      {
        id: "nitrogen-pd",
        name: "Dry Nitrogen Seal",
        spec: "Molecular-sieve nitrogen with oxygen absorber",
        delta: 120,
        massG: 14,
      },
    ],
  },
] as const;

function findScroller(el: HTMLElement | null): HTMLElement | null {
  let p = el?.parentElement ?? null;
  while (p) {
    const o = getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
    p = p.parentElement;
  }
  return null;
}

function useScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  kind: "leave" | "track"
) {
  const mv = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = findScroller(el);
    const update = () => {
      const r = el.getBoundingClientRect();
      const top = s ? s.getBoundingClientRect().top : 0;
      const vh = s ? s.clientHeight : window.innerHeight;
      const total = kind === "track" ? r.height - vh : r.height;
      mv.set(total > 0 ? Math.min(1, Math.max(0, -(r.top - top) / total)) : 0);
    };
    update();
    const target: HTMLElement | Window = s ?? window;
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, kind, mv]);
  return mv;
}

function computeBraggWavelength(dNm: number, thetaDeg: number): number {
  const nEff = 1.563;
  const rad = (thetaDeg * Math.PI) / 180;
  return Math.round(2 * nEff * dNm * Math.cos(rad));
}

function describeWavelength(lambda: number): {
  band: string;
  colorName: string;
  swatchHex: string;
} {
  if (lambda < 380) {
    return {
      band: "Near-UV (<380 nm)",
      colorName: "Ultraviolet",
      swatchHex: "#0284C7",
    };
  }
  if (lambda < 445) {
    return {
      band: "Short-Wave",
      colorName: "Deep Violet-Blue",
      swatchHex: "#0284C7",
    };
  }
  if (lambda < 500) {
    return {
      band: "Peak Band",
      colorName: "Morpho Cobalt Blue",
      swatchHex: "#38BDF8",
    };
  }
  if (lambda < 565) {
    return {
      band: "Mid-Wave",
      colorName: "Birdwing Emerald",
      swatchHex: "#10B981",
    };
  }
  if (lambda <= 750) {
    return {
      band: "Long-Wave",
      colorName: "Cuticle Amber",
      swatchHex: "#D97706",
    };
  }
  return {
    band: "Near-IR (>750 nm)",
    colorName: "Infrared",
    swatchHex: "#D97706",
  };
}

function BrandMark({ color }: { color: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M13.5 14.5L4.5 6.5C4.5 14 7.5 20.5 13.5 22.5V14.5Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 14.5L23.5 4.5C23.5 13.5 19.8 20.5 14.5 22.5V14.5Z"
        fill={color}
      />
    </svg>
  );
}

export function PsycheObsidianPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const reduceMotion = useReducedMotion() ?? false;

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const dissectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [themeMode, setThemeMode] = useState<ThemeMode>(
    config.theme === "light" ? "light" : "dark"
  );

  useEffect(() => {
    if (config.theme === "light" || config.theme === "dark") {
      setThemeMode(config.theme);
    }
  }, [config.theme]);

  const palette = PALETTE[themeMode];

  const [containerWidth, setContainerWidth] = useState<number>(1280);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isMobile = deviceMode === "mobile" || containerWidth < 640;
  const isTablet = !isMobile && (deviceMode === "tablet" || containerWidth < 1024);
  const isCompact = isMobile || isTablet;

  const pageProgress = useScrollProgress(rootRef, "track");
  const smoothPageProgress = useSpring(pageProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.7,
  });

  const heroLeave = useScrollProgress(heroRef, "leave");
  const heroVideoScale = useTransform(
    heroLeave,
    [0, 1],
    reduceMotion ? [1, 1] : [1.02, 1.12]
  );
  const heroContentY = useTransform(
    heroLeave,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -36]
  );

  const dissectionProgress = useScrollProgress(dissectionRef, "track");
  const [activePlateIdx, setActivePlateIdx] = useState<number>(0);

  useMotionValueEvent(dissectionProgress, "change", (v) => {
    if (isCompact) return;
    if (v < 0.25) setActivePlateIdx(0);
    else if (v < 0.52) setActivePlateIdx(1);
    else if (v < 0.78) setActivePlateIdx(2);
    else setActivePlateIdx(3);
  });

  const [illumination, setIllumination] = useState<IlluminationKey>("solar");
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string>("morpho-didius");

  const [latticeD, setLatticeD] = useState<number>(180);
  const [angleTheta, setAngleTheta] = useState<number>(33);

  const [vitrineSelections, setVitrineSelections] = useState<Record<string, string>>({
    frame: "ti-g5",
    glazing: "quartz-uv",
    atmosphere: "argon-5n",
  });

  const [curatorEmail, setCuratorEmail] = useState<string>("curator@naturalhistory.org");
  const [commissionSubmitted, setCommissionSubmitted] = useState<boolean>(false);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const calculatedLambda = useMemo(
    () => computeBraggWavelength(latticeD, angleTheta),
    [latticeD, angleTheta]
  );
  const spectral = useMemo(
    () => describeWavelength(calculatedLambda),
    [calculatedLambda]
  );

  const activePlate = DISSECTION_PLATES[activePlateIdx] ?? DISSECTION_PLATES[0];
  const activeSpecimen = useMemo(
    () => SPECIMENS.find((s) => s.id === selectedSpecimenId) ?? SPECIMENS[0],
    [selectedSpecimenId]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion) {
      video.pause();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduceMotion]);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const root = rootRef.current;
    if (!root) return;
    const target = root.querySelector(`#${sectionId}`) as HTMLElement | null;
    if (target) {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  };

  const handleSelectSpecimenForBench = (spec: SpecimenEntry) => {
    setSelectedSpecimenId(spec.id);
    setLatticeD(spec.latticeD);
    setAngleTheta(spec.angleTheta);
    scrollToSection("workbench");
  };

  const handleCopyFormula = () => {
    const text = `${activeSpecimen.scientificName} — d=${latticeD}nm, θ=${angleTheta}°, λ=${calculatedLambda}nm (${spectral.colorName})`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2200);
  };

  const chosenFrame =
    VITRINE_GROUPS[0].options.find((o) => o.id === vitrineSelections.frame) ??
    VITRINE_GROUPS[0].options[0];
  const chosenGlazing =
    VITRINE_GROUPS[1].options.find((o) => o.id === vitrineSelections.glazing) ??
    VITRINE_GROUPS[1].options[0];
  const chosenGas =
    VITRINE_GROUPS[2].options.find((o) => o.id === vitrineSelections.atmosphere) ??
    VITRINE_GROUPS[2].options[0];

  const totalPrice = 2650 + chosenFrame.delta + chosenGlazing.delta + chosenGas.delta;
  const totalMassKg = (
    (chosenFrame.massG + chosenGlazing.massG + chosenGas.massG) /
    1000
  ).toFixed(2);

  const brandTitle = config.brandName || "Psyche Obsidian";
  const currentIllum = ILLUMINATION_MODES[illumination];

  const sectionHeadingSize = isMobile
    ? "1.85rem"
    : isTablet
      ? "2.45rem"
      : "3.15rem";
  const sectionPadClass = isMobile
    ? "py-14"
    : isTablet
      ? "py-20"
      : "py-28";
  const containerPadClass = isMobile ? "px-4" : isTablet ? "px-6" : "px-8";

  return (
    <div
      ref={rootRef}
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
        fontFamily: FONT.body,
      }}
      className="relative w-full min-h-screen overflow-x-clip transition-colors duration-500 selection:bg-[#38BDF8] selection:text-[#090A0C]"
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Gloock&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
      />

      <header
        style={{
          backgroundColor:
            themeMode === "dark"
              ? "rgba(9, 10, 12, 0.84)"
              : "rgba(247, 247, 245, 0.88)",
          borderBottom: `1px solid ${palette.line}`,
        }}
        className="sticky top-0 z-40 w-full backdrop-blur-xl transition-colors duration-500"
      >
        <div
          className={`max-w-[1240px] mx-auto ${containerPadClass} h-16 flex items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {config.customLogoUrl ? (
              <img
                src={config.customLogoUrl}
                alt={brandTitle}
                className="w-7 h-7 rounded-md object-cover shrink-0"
              />
            ) : (
              <BrandMark color={palette.text} />
            )}
            <span
              style={{ fontFamily: FONT.display, color: palette.text }}
              className={`${isMobile ? "text-base" : "text-lg"} tracking-tight truncate`}
            >
              {brandTitle}
            </span>
          </div>

          {!isCompact && (
            <nav
              aria-label="Primary navigation"
              className="flex items-center gap-7 text-sm font-medium"
            >
              {[
                { id: "dissection", label: "Microscopy" },
                { id: "workbench", label: "Optics" },
                { id: "specimens", label: "Specimens" },
                { id: "vitrine", label: "Vitrine" },
              ].map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  style={{ color: palette.muted }}
                  className="relative py-1 hover:opacity-100 transition-opacity cursor-pointer group focus-visible:outline-none focus-visible:ring-2 rounded"
                >
                  <span style={{ color: palette.text }}>{link.label}</span>
                  <span
                    style={{ backgroundColor: palette.accent }}
                    className="absolute left-0 bottom-0 h-px w-full origin-right scale-x-0 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
                  />
                </button>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <div
              role="group"
              aria-label="Theme mode"
              style={{
                borderColor: palette.line,
                backgroundColor: palette.surface,
              }}
              className="inline-flex items-center p-1 rounded-xl border"
            >
              {(
                [
                  { id: "dark", label: "Obsidian", icon: Moon },
                  { id: "light", label: "Bone", icon: Sun },
                ] as const
              ).map((item) => {
                const active = themeMode === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setThemeMode(item.id)}
                    aria-pressed={active}
                    aria-label={item.label}
                    style={{
                      color: active ? palette.bg : palette.muted,
                    }}
                    className={`relative min-h-[32px] ${
                      isMobile ? "px-2.5" : "px-3"
                    } py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2`}
                  >
                    {active && (
                      <motion.span
                        layoutId="psyche-theme-indicator"
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { duration: MOTION.microDuration, ease: MOTION.softEase }
                        }
                        style={{ backgroundColor: palette.text }}
                        className="absolute inset-0 rounded-lg"
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                    {!isMobile && <span className="relative z-10">{item.label}</span>}
                  </button>
                );
              })}
            </div>

            {!isCompact && (
              <button
                type="button"
                onClick={() => scrollToSection("vitrine")}
                style={{
                  backgroundColor: palette.text,
                  color: palette.bg,
                }}
                className="min-h-[38px] px-4 py-2 rounded-xl text-xs font-medium transition-opacity hover:opacity-90 cursor-pointer"
              >
                Reserve Vitrine
              </button>
            )}

            {isCompact && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                style={{
                  borderColor: palette.line,
                  backgroundColor: palette.surface,
                  color: palette.text,
                }}
                className="min-h-[40px] min-w-[40px] rounded-xl border flex items-center justify-center cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        <motion.div
          style={{
            scaleX: smoothPageProgress,
            backgroundColor: palette.accent,
          }}
          className="h-[1.5px] w-full origin-left"
        />

        <AnimatePresence>
          {isCompact && mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: MOTION.softEase }}
              style={{
                backgroundColor: palette.surface,
                borderBottom: `1px solid ${palette.line}`,
              }}
              className={`overflow-hidden ${containerPadClass} py-4 space-y-1`}
            >
              {[
                { id: "dissection", label: "Microscopy" },
                { id: "workbench", label: "Optics" },
                { id: "specimens", label: "Specimens" },
                { id: "vitrine", label: "Vitrine" },
              ].map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  style={{ borderColor: palette.line, color: palette.text }}
                  className="w-full min-h-[44px] text-left py-2.5 border-b text-sm font-medium flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-4 h-4" style={{ color: palette.muted }} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section
        ref={heroRef}
        className="relative w-full flex flex-col justify-end overflow-hidden"
        style={{
          minHeight: isMobile ? "520px" : isTablet ? "620px" : "86svh",
          borderBottom: `1px solid ${palette.line}`,
        }}
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <motion.div style={{ scale: heroVideoScale }} className="w-full h-full">
            <video
              ref={videoRef}
              src="/videos/psyche-obsidian-atelier.mp4"
              poster="/images/psyche-obsidian-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              preload="metadata"
              className="w-full h-full object-cover object-center pointer-events-none"
              style={{ filter: "brightness(0.75) contrast(1.06)" }}
            />
          </motion.div>

          <div
            style={{ backgroundColor: currentIllum.overlay }}
            className="absolute inset-0 transition-colors duration-700"
          />

          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(9, 10, 12, 0.55) 0%, rgba(9, 10, 12, 0.25) 45%, rgba(9, 10, 12, 0.92) 100%)",
            }}
            className="absolute inset-0"
          />
        </div>

        <motion.div
          style={{ y: heroContentY }}
          className={`relative z-10 w-full max-w-[1240px] mx-auto ${containerPadClass} ${
            isMobile ? "pt-16 pb-12" : "pt-28 pb-20"
          }`}
        >
          <div className="max-w-3xl space-y-5">
            <h1
              style={{
                fontFamily: FONT.display,
                color: "#F3F4F6",
                fontSize: isMobile
                  ? "2.2rem"
                  : isTablet
                    ? "3.3rem"
                    : "4.65rem",
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
              }}
              className="font-normal text-balance"
            >
              {config.heroTitle || "Structural color born from light and geometry."}
            </h1>

            <p
              style={{ color: "#D1D5DB" }}
              className={`${
                isMobile ? "text-sm" : "text-lg"
              } leading-relaxed max-w-[54ch] font-normal`}
            >
              {config.heroSubtitle ||
                "No blue pigment exists inside a Morpho wing. Microscopic chitin lamellae spaced 180 nanometers apart sculpt ambient light into pure cobalt interference."}
            </p>

            <div
              className={`pt-2 flex ${
                isMobile ? "flex-col items-stretch" : "flex-wrap items-center"
              } gap-3`}
            >
              <button
                type="button"
                onClick={() => scrollToSection("dissection")}
                style={{
                  backgroundColor: "#F3F4F6",
                  color: "#090A0C",
                }}
                className="min-h-[46px] px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <span>Explore Microscopy</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div
                role="radiogroup"
                aria-label="Lighting angle"
                className={`inline-flex items-center p-1 rounded-xl bg-black/55 border border-white/15 backdrop-blur-md ${
                  isMobile ? "w-full justify-between" : ""
                }`}
              >
                {(Object.keys(ILLUMINATION_MODES) as IlluminationKey[]).map((key) => {
                  const item = ILLUMINATION_MODES[key];
                  const active = illumination === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setIllumination(key)}
                      style={{
                        color: active ? "#090A0C" : "#F3F4F6",
                      }}
                      className={`relative min-h-[38px] ${
                        isMobile ? "flex-1 px-2" : "px-3.5"
                      } py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors text-center`}
                    >
                      {active && (
                        <motion.span
                          layoutId="psyche-hero-mode"
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : { duration: MOTION.microDuration, ease: MOTION.softEase }
                          }
                          style={{ backgroundColor: "#38BDF8" }}
                          className="absolute inset-0 rounded-lg"
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {!config.hiddenSections?.dissection && (
        <section
          id="dissection"
          ref={dissectionRef}
          style={{ borderBottom: `1px solid ${palette.line}` }}
          className={sectionPadClass}
        >
          <div className={`max-w-[1240px] mx-auto ${containerPadClass}`}>
            <div className="max-w-2xl space-y-3 mb-10">
              <h2
                style={{
                  fontFamily: FONT.display,
                  color: palette.text,
                  fontSize: sectionHeadingSize,
                  lineHeight: 1.08,
                }}
              >
                Four magnifications of a photonic wing
              </h2>
              <p style={{ color: palette.muted }} className="text-base leading-relaxed">
                Select a magnification step below to inspect the wing from whole-membrane macro photography down to its sub-micron chitin shelves.
              </p>
            </div>

            <div
              className={
                isCompact
                  ? "flex flex-col gap-6"
                  : "grid grid-cols-12 gap-10 items-start"
              }
            >
              <div
                className={
                  isCompact
                    ? "w-full space-y-4"
                    : "col-span-7 sticky top-24 space-y-4"
                }
              >
                <div
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.line,
                  }}
                  className="rounded-2xl border overflow-hidden"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activePlate.id}
                        src={activePlate.image}
                        alt={activePlate.title}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
                        transition={{ duration: 0.45, ease: MOTION.softEase }}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    <div
                      style={{
                        background:
                          "linear-gradient(to top, rgba(9, 10, 12, 0.85) 0%, transparent 55%)",
                      }}
                      className="absolute inset-0 pointer-events-none"
                    />

                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
                      <h3
                        style={{ fontFamily: FONT.display, color: "#F3F4F6" }}
                        className={isMobile ? "text-xl" : "text-2xl"}
                      >
                        {activePlate.title}
                      </h3>
                      <span
                        style={{ color: "#D1D5DB" }}
                        className="text-xs font-medium shrink-0"
                      >
                        {activePlate.magnification}
                      </span>
                    </div>
                  </div>

                  <div className={isMobile ? "p-4 space-y-1" : "p-6 space-y-1.5"}>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        style={{ color: palette.text }}
                        className="text-sm font-semibold"
                      >
                        {activePlate.captionTitle}
                      </span>
                      <span
                        style={{ color: palette.muted }}
                        className="text-xs tabular-nums"
                      >
                        {activePlate.scaleMetric}
                      </span>
                    </div>
                    <p style={{ color: palette.muted }} className="text-sm leading-relaxed">
                      {activePlate.captionBody}
                    </p>
                  </div>
                </div>

                <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} gap-2`}>
                  {DISSECTION_PLATES.map((plate, idx) => {
                    const active = activePlateIdx === idx;
                    return (
                      <button
                        key={plate.id}
                        type="button"
                        onClick={() => setActivePlateIdx(idx)}
                        style={{
                          borderColor: active ? palette.text : palette.line,
                          backgroundColor: active ? palette.surface : "transparent",
                          color: active ? palette.text : palette.muted,
                        }}
                        className="p-3 rounded-xl border text-left transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-semibold block">
                          {plate.magnification}
                        </span>
                        <span className="text-xs block truncate mt-0.5" style={{ color: palette.muted }}>
                          {plate.scaleMetric}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={isCompact ? "w-full space-y-3" : "col-span-5 space-y-4"}>
                {DISSECTION_PLATES.map((plate, idx) => {
                  const active = activePlateIdx === idx;
                  return (
                    <div
                      key={plate.id}
                      onClick={() => setActivePlateIdx(idx)}
                      style={{
                        backgroundColor: active ? palette.surface : "transparent",
                        borderColor: active ? palette.text : palette.line,
                      }}
                      className={`${
                        isMobile ? "p-4" : "p-6"
                      } rounded-2xl border transition-colors cursor-pointer space-y-2`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span
                          style={{
                            color: active ? palette.accent : palette.muted,
                          }}
                          className="font-medium"
                        >
                          {plate.magnification}
                        </span>
                        <span
                          style={{ color: palette.muted }}
                          className="tabular-nums"
                        >
                          {plate.scaleMetric}
                        </span>
                      </div>

                      <h3
                        style={{ fontFamily: FONT.display, color: palette.text }}
                        className={`${isMobile ? "text-lg" : "text-2xl"} tracking-tight`}
                      >
                        {plate.title}
                      </h3>

                      <p
                        style={{ color: palette.muted }}
                        className="text-sm leading-relaxed"
                      >
                        {plate.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {!config.hiddenSections?.workbench && (
        <section
          id="workbench"
          style={{ borderBottom: `1px solid ${palette.line}` }}
          className={sectionPadClass}
        >
          <div className={`max-w-[1240px] mx-auto ${containerPadClass} space-y-10`}>
            <div className="space-y-3 max-w-2xl">
              <h2
                style={{
                  fontFamily: FONT.display,
                  color: palette.text,
                  fontSize: sectionHeadingSize,
                  lineHeight: 1.08,
                }}
              >
                Test how geometry shifts wavelength
              </h2>
              <p style={{ color: palette.muted }} className="text-base leading-relaxed">
                Adjust lamellar shelf spacing and viewing angle to see how structural interference shifts across the visible spectrum.
              </p>
            </div>

            <div
              className={
                isCompact
                  ? "flex flex-col gap-6"
                  : "grid grid-cols-12 gap-8 items-stretch"
              }
            >
              <div
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.line,
                }}
                className={`${
                  isCompact ? "w-full" : "col-span-6"
                } ${isMobile ? "p-5" : "p-8"} rounded-2xl border flex flex-col justify-between space-y-6`}
              >
                <div className="space-y-6">
                  <div
                    className="flex items-baseline justify-between gap-3 border-b pb-5"
                    style={{ borderColor: palette.line }}
                  >
                    <div>
                      <span
                        style={{ color: palette.muted }}
                        className="text-xs block mb-1"
                      >
                        Reflected Wavelength
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span
                          style={{
                            fontFamily: FONT.display,
                            color: palette.text,
                            fontSize: isMobile ? "2.4rem" : "3.5rem",
                            lineHeight: 1,
                          }}
                          className="tabular-nums"
                        >
                          {calculatedLambda}
                        </span>
                        <span
                          style={{ color: palette.muted }}
                          className="text-base"
                        >
                          nm
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className="inline-flex items-center gap-2 text-sm font-medium"
                        style={{ color: palette.text }}
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: spectral.swatchHex }}
                        />
                        {spectral.colorName}
                      </span>
                      <span
                        style={{ color: palette.muted }}
                        className="text-xs block mt-1"
                      >
                        {spectral.band}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <label htmlFor="bragg-d" className="font-medium">
                        Shelf Spacing
                      </label>
                      <span
                        style={{ color: palette.text }}
                        className="font-semibold tabular-nums shrink-0"
                      >
                        {latticeD} nm
                      </span>
                    </div>
                    <input
                      id="bragg-d"
                      type="range"
                      min={120}
                      max={260}
                      step={2}
                      value={latticeD}
                      onChange={(e) => setLatticeD(Number(e.target.value))}
                      style={{ accentColor: palette.accent }}
                      className="w-full h-2 rounded-lg cursor-pointer"
                    />
                    <div
                      style={{ color: palette.muted }}
                      className="flex justify-between text-xs tabular-nums"
                    >
                      <span>120 nm</span>
                      <span>180 nm</span>
                      <span>260 nm</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <label htmlFor="bragg-theta" className="font-medium">
                        Viewing Angle
                      </label>
                      <span
                        style={{ color: palette.text }}
                        className="font-semibold tabular-nums shrink-0"
                      >
                        {angleTheta}°
                      </span>
                    </div>
                    <input
                      id="bragg-theta"
                      type="range"
                      min={0}
                      max={68}
                      step={1}
                      value={angleTheta}
                      onChange={(e) => setAngleTheta(Number(e.target.value))}
                      style={{ accentColor: palette.accent }}
                      className="w-full h-2 rounded-lg cursor-pointer"
                    />
                    <div
                      style={{ color: palette.muted }}
                      className="flex justify-between text-xs tabular-nums"
                    >
                      <span>0° Normal</span>
                      <span>33° Standard</span>
                      <span>68° Grazing</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span
                      style={{ color: palette.muted }}
                      className="text-xs font-medium block"
                    >
                      Species Presets
                    </span>
                    <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
                      {SPECIMENS.map((spec) => {
                        const active =
                          latticeD === spec.latticeD && angleTheta === spec.angleTheta;
                        return (
                          <button
                            key={spec.id}
                            type="button"
                            onClick={() => {
                              setSelectedSpecimenId(spec.id);
                              setLatticeD(spec.latticeD);
                              setAngleTheta(spec.angleTheta);
                            }}
                            style={{
                              borderColor: active ? palette.text : palette.line,
                              backgroundColor: active ? palette.elevated : palette.bg,
                              color: palette.text,
                            }}
                            className="p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-2"
                          >
                            <span className="text-xs font-medium italic truncate">
                              {spec.scientificName}
                            </span>
                            <span
                              style={{ color: palette.muted }}
                              className="text-xs tabular-nums shrink-0"
                            >
                              {spec.latticeD} nm
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div
                  style={{ borderTop: `1px solid ${palette.line}` }}
                  className="pt-4 flex flex-wrap items-center justify-between gap-2"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLatticeD(180);
                      setAngleTheta(33);
                    }}
                    style={{
                      borderColor: palette.line,
                      backgroundColor: palette.bg,
                      color: palette.text,
                    }}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-medium inline-flex items-center gap-2 cursor-pointer hover:opacity-80"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyFormula}
                    style={{
                      borderColor: palette.line,
                      backgroundColor: palette.bg,
                      color: palette.text,
                    }}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-medium inline-flex items-center gap-2 cursor-pointer hover:opacity-80"
                  >
                    {copiedCitation ? (
                      <>
                        <Check className="w-3.5 h-3.5" style={{ color: palette.accent }} />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Values</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.line,
                }}
                className={`${
                  isCompact ? "w-full" : "col-span-6"
                } ${isMobile ? "p-5" : "p-8"} rounded-2xl border flex flex-col justify-between space-y-6`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span style={{ color: palette.muted }} className="font-medium">
                    Ray Path Cross-Section
                  </span>
                  <span
                    style={{ color: palette.text }}
                    className="tabular-nums font-medium"
                  >
                    {latticeD} nm · {angleTheta}°
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: palette.bg,
                    borderColor: palette.line,
                  }}
                  className="rounded-xl border p-4"
                >
                  {(() => {
                    const rad = (angleTheta * Math.PI) / 180;
                    const hitX = 280;
                    const hitY = 96;
                    const rayLen = 84;
                    const incX = hitX - Math.sin(rad) * rayLen;
                    const incY = hitY - Math.cos(rad) * rayLen;
                    const refX = hitX + Math.sin(rad) * rayLen;
                    const refY = hitY - Math.cos(rad) * rayLen;
                    const shelfGap = 11 + ((latticeD - 120) / 140) * 10;

                    return (
                      <svg
                        viewBox="0 0 560 240"
                        className="w-full h-auto block"
                        role="img"
                        aria-label={`Ray diagram for d=${latticeD} nm and angle=${angleTheta} degrees`}
                      >
                        <line
                          x1="40"
                          y1="214"
                          x2="520"
                          y2="214"
                          stroke={palette.line}
                          strokeWidth="2"
                        />

                        {[140, 280, 420].map((rx) => {
                          const isCenter = rx === 280;
                          const shelves = [0, 1, 2, 3, 4, 5];
                          return (
                            <g key={rx}>
                              <line
                                x1={rx}
                                y1="92"
                                x2={rx}
                                y2="214"
                                stroke={isCenter ? spectral.swatchHex : palette.muted}
                                strokeWidth="3"
                                opacity={isCenter ? "0.9" : "0.3"}
                              />
                              {shelves.map((s) => {
                                const sy = 96 + s * shelfGap;
                                if (sy > 208) return null;
                                return (
                                  <line
                                    key={s}
                                    x1={rx - 36}
                                    y1={sy}
                                    x2={rx + 36}
                                    y2={sy}
                                    stroke={isCenter ? spectral.swatchHex : palette.text}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    opacity={isCenter ? "0.95" : "0.22"}
                                  />
                                );
                              })}
                            </g>
                          );
                        })}

                        <line
                          x1={hitX}
                          y1="16"
                          x2={hitX}
                          y2="96"
                          stroke={palette.muted}
                          strokeDasharray="3 3"
                          strokeWidth="1"
                        />

                        <line
                          x1={incX}
                          y1={incY}
                          x2={hitX}
                          y2={hitY}
                          stroke={palette.text}
                          strokeWidth="2"
                        />

                        <line
                          x1={hitX}
                          y1={hitY}
                          x2={refX}
                          y2={refY}
                          stroke={spectral.swatchHex}
                          strokeWidth="3"
                        />

                        <circle cx={hitX} cy={hitY} r="4" fill={spectral.swatchHex} />
                      </svg>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div
                    style={{ backgroundColor: palette.bg, borderColor: palette.line }}
                    className="p-3 rounded-xl border"
                  >
                    <span
                      style={{ color: palette.muted }}
                      className="block text-[11px]"
                    >
                      Angle
                    </span>
                    <span
                      style={{ color: palette.text }}
                      className="text-sm font-semibold mt-0.5 block tabular-nums"
                    >
                      {angleTheta}°
                    </span>
                  </div>
                  <div
                    style={{ backgroundColor: palette.bg, borderColor: palette.line }}
                    className="p-3 rounded-xl border"
                  >
                    <span
                      style={{ color: palette.muted }}
                      className="block text-[11px]"
                    >
                      Spacing
                    </span>
                    <span
                      style={{ color: palette.text }}
                      className="text-sm font-semibold mt-0.5 block tabular-nums"
                    >
                      {latticeD} nm
                    </span>
                  </div>
                  <div
                    style={{ backgroundColor: palette.bg, borderColor: palette.line }}
                    className="p-3 rounded-xl border"
                  >
                    <span
                      style={{ color: palette.muted }}
                      className="block text-[11px]"
                    >
                      Peak
                    </span>
                    <span
                      style={{ color: spectral.swatchHex }}
                      className="text-sm font-semibold mt-0.5 block tabular-nums"
                    >
                      {calculatedLambda} nm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!config.hiddenSections?.specimens && (
        <section
          id="specimens"
          style={{ borderBottom: `1px solid ${palette.line}` }}
          className={sectionPadClass}
        >
          <div className={`max-w-[1240px] mx-auto ${containerPadClass} space-y-10`}>
            <div
              className={
                isCompact
                  ? "flex flex-col gap-3"
                  : "flex flex-row items-end justify-between gap-6"
              }
            >
              <h2
                style={{
                  fontFamily: FONT.display,
                  color: palette.text,
                  fontSize: sectionHeadingSize,
                  lineHeight: 1.08,
                }}
              >
                Cataloged Lepidoptera
              </h2>
              <p style={{ color: palette.muted }} className="text-base max-w-[42ch]">
                Select a specimen to inspect its macro plate, provenance, and structural reflectance.
              </p>
            </div>

            <div
              className={
                isCompact
                  ? "flex flex-col gap-8"
                  : "grid grid-cols-12 gap-10 items-start"
              }
            >
              <div
                className={isCompact ? "w-full border-t" : "col-span-6 border-t"}
                style={{ borderColor: palette.line }}
              >
                {SPECIMENS.map((spec) => {
                  const active = spec.id === selectedSpecimenId;
                  const lambda = computeBraggWavelength(spec.latticeD, spec.angleTheta);
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setSelectedSpecimenId(spec.id)}
                      style={{
                        borderBottom: `1px solid ${palette.line}`,
                        backgroundColor: active ? palette.surface : "transparent",
                      }}
                      className="w-full py-4 px-3.5 text-left transition-colors cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <span
                          style={{ fontFamily: FONT.display, color: palette.text }}
                          className={`${isMobile ? "text-lg" : "text-xl"} italic block truncate`}
                        >
                          {spec.scientificName}
                        </span>
                        <span style={{ color: palette.muted }} className="text-xs block truncate">
                          {spec.commonName} · {spec.locality}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          style={{ color: palette.text }}
                          className="text-sm font-semibold block tabular-nums"
                        >
                          {lambda} nm
                        </span>
                        <span
                          style={{ color: palette.muted }}
                          className="text-xs block tabular-nums"
                        >
                          {spec.wingspan}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={isCompact ? "w-full" : "col-span-6"}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpecimen.id}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: MOTION.softEase }}
                    style={{
                      backgroundColor: palette.surface,
                      borderColor: palette.line,
                    }}
                    className="rounded-2xl border overflow-hidden"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                      <img
                        src={activeSpecimen.image}
                        alt={activeSpecimen.scientificName}
                        className="w-full h-full object-cover"
                      />
                      <div
                        style={{
                          background:
                            "linear-gradient(to top, rgba(9, 10, 12, 0.85) 0%, transparent 60%)",
                        }}
                        className="absolute inset-0"
                      />
                      <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <h3
                            style={{ fontFamily: FONT.display, color: "#F3F4F6" }}
                            className={`${isMobile ? "text-xl" : "text-3xl"} italic truncate`}
                          >
                            {activeSpecimen.scientificName}
                          </h3>
                          <span style={{ color: "#D1D5DB" }} className="text-xs block">
                            {activeSpecimen.locality}
                          </span>
                        </div>
                        <span
                          style={{ color: "#F3F4F6" }}
                          className="text-xs font-medium tabular-nums shrink-0"
                        >
                          {activeSpecimen.wingspan}
                        </span>
                      </div>
                    </div>

                    <div className={`${isMobile ? "p-5" : "p-8"} space-y-6`}>
                      <p
                        style={{ color: palette.text }}
                        className="text-sm leading-relaxed"
                      >
                        {activeSpecimen.note}
                      </p>

                      <div
                        style={{ borderTop: `1px solid ${palette.line}` }}
                        className={`pt-5 grid ${
                          isMobile ? "grid-cols-2" : "grid-cols-4"
                        } gap-4`}
                      >
                        {[
                          { label: "Spacing", value: `${activeSpecimen.latticeD} nm` },
                          { label: "Angle", value: `${activeSpecimen.angleTheta}°` },
                          { label: "Lamellae", value: `${activeSpecimen.lamellae} tiers` },
                          { label: "Reflectance", value: activeSpecimen.reflectance },
                        ].map((item) => (
                          <div key={item.label}>
                            <span
                              style={{ color: palette.muted }}
                              className="text-xs block"
                            >
                              {item.label}
                            </span>
                            <span
                              style={{ color: palette.text }}
                              className="text-sm font-semibold mt-0.5 block tabular-nums"
                            >
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-1 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSelectSpecimenForBench(activeSpecimen)}
                          style={{
                            backgroundColor: palette.text,
                            color: palette.bg,
                          }}
                          className={`min-h-[42px] px-5 py-2.5 rounded-xl text-xs font-medium inline-flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 ${
                            isMobile ? "w-full" : ""
                          }`}
                        >
                          <span>Inspect in Optics Bench</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => scrollToSection("vitrine")}
                          style={{
                            borderColor: palette.line,
                            backgroundColor: palette.bg,
                            color: palette.text,
                          }}
                          className={`min-h-[42px] px-4 py-2.5 rounded-xl border text-xs font-medium cursor-pointer hover:opacity-85 ${
                            isMobile ? "w-full" : ""
                          }`}
                        >
                          Configure Enclosure
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      )}

      {!config.hiddenSections?.vitrine && (
        <section
          id="vitrine"
          style={{ borderBottom: `1px solid ${palette.line}` }}
          className={sectionPadClass}
        >
          <div className={`max-w-[1240px] mx-auto ${containerPadClass} space-y-10`}>
            <div className="max-w-2xl space-y-3">
              <h2
                style={{
                  fontFamily: FONT.display,
                  color: palette.text,
                  fontSize: sectionHeadingSize,
                  lineHeight: 1.08,
                }}
              >
                Commission a conservation vitrine
              </h2>
              <p style={{ color: palette.muted }} className="text-base leading-relaxed">
                Ambient humidity swells chitin lamellae and shifts structural wavelength. Each specimen is permanently sealed in dry inert gas behind UV-cut quartz.
              </p>
            </div>

            <div
              className={
                isCompact
                  ? "flex flex-col gap-8"
                  : "grid grid-cols-12 gap-10 items-start"
              }
            >
              <div className={isCompact ? "w-full space-y-6" : "col-span-7 space-y-8"}>
                {VITRINE_GROUPS.map((group) => (
                  <div key={group.id} className="space-y-3">
                    <span
                      style={{ color: palette.muted }}
                      className="text-xs font-medium block"
                    >
                      {group.label}
                    </span>
                    <div
                      className={`grid ${
                        isMobile
                          ? "grid-cols-1"
                          : group.options.length === 3
                            ? "grid-cols-3"
                            : "grid-cols-2"
                      } gap-3`}
                    >
                      {group.options.map((opt) => {
                        const selected = vitrineSelections[group.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setVitrineSelections((prev) => ({
                                ...prev,
                                [group.id]: opt.id,
                              }))
                            }
                            style={{
                              borderColor: selected ? palette.text : palette.line,
                              backgroundColor: selected ? palette.surface : "transparent",
                            }}
                            className="p-4 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  style={{ color: palette.text }}
                                  className="text-sm font-medium"
                                >
                                  {opt.name}
                                </span>
                                {selected && (
                                  <Check
                                    className="w-4 h-4 shrink-0"
                                    style={{ color: palette.accent }}
                                  />
                                )}
                              </div>
                              <p
                                style={{ color: palette.muted }}
                                className="text-xs leading-relaxed"
                              >
                                {opt.spec}
                              </p>
                            </div>
                            <span
                              style={{ color: palette.muted }}
                              className="text-xs block pt-2 border-t tabular-nums"
                            >
                              {opt.delta === 0 ? "Included" : `+$${opt.delta}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.line,
                }}
                className={`${
                  isCompact ? "w-full" : "col-span-5"
                } ${isMobile ? "p-5" : "p-8"} rounded-2xl border space-y-6`}
              >
                <div
                  className="flex items-center justify-between border-b pb-4"
                  style={{ borderColor: palette.line }}
                >
                  <span style={{ color: palette.text }} className="text-sm font-medium">
                    Enclosure Summary
                  </span>
                  <span style={{ color: palette.muted }} className="text-xs tabular-nums">
                    {totalMassKg} kg
                  </span>
                </div>

                <dl className="space-y-3 text-sm">
                  <div
                    className="flex justify-between gap-2 py-1.5 border-b"
                    style={{ borderColor: palette.line }}
                  >
                    <dt style={{ color: palette.muted }}>Mounted Specimen</dt>
                    <dd style={{ color: palette.text }} className="font-medium italic text-right">
                      {activeSpecimen.scientificName}
                    </dd>
                  </div>
                  <div
                    className="flex justify-between gap-2 py-1.5 border-b"
                    style={{ borderColor: palette.line }}
                  >
                    <dt style={{ color: palette.muted }}>Housing</dt>
                    <dd style={{ color: palette.text }} className="font-medium text-right">
                      {chosenFrame.name}
                    </dd>
                  </div>
                  <div
                    className="flex justify-between gap-2 py-1.5 border-b"
                    style={{ borderColor: palette.line }}
                  >
                    <dt style={{ color: palette.muted }}>Glazing</dt>
                    <dd style={{ color: palette.text }} className="font-medium text-right">
                      {chosenGlazing.name}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2 pt-1">
                    <dt style={{ color: palette.muted }}>Conservation Seal</dt>
                    <dd style={{ color: palette.text }} className="font-medium text-right">
                      {chosenGas.name}
                    </dd>
                  </div>
                </dl>

                <div className="flex items-baseline justify-between pt-2">
                  <span style={{ color: palette.muted }} className="text-xs">
                    Total
                  </span>
                  <span
                    style={{ fontFamily: FONT.display, color: palette.text }}
                    className="text-3xl tabular-nums"
                  >
                    ${totalPrice.toLocaleString("en-US")}
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCommissionSubmitted(true);
                    setTimeout(() => setCommissionSubmitted(false), 3800);
                  }}
                  className="space-y-3 pt-2"
                >
                  <div>
                    <label
                      htmlFor="curator-email-input"
                      style={{ color: palette.muted }}
                      className="text-xs block mb-1.5"
                    >
                      Email address
                    </label>
                    <input
                      id="curator-email-input"
                      type="email"
                      required
                      value={curatorEmail}
                      onChange={(e) => setCuratorEmail(e.target.value)}
                      style={{
                        borderColor: palette.line,
                        backgroundColor: palette.bg,
                        color: palette.text,
                      }}
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border text-sm focus-visible:outline-none focus-visible:ring-2"
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: palette.text,
                      color: palette.bg,
                    }}
                    className="w-full min-h-[46px] px-5 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {commissionSubmitted ? (
                        <motion.span
                          key="done"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Reservation Sent</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="req"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <span>Reserve Vitrine</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="py-10">
        <div
          className={`max-w-[1240px] mx-auto ${containerPadClass} flex ${
            isMobile
              ? "flex-col items-start gap-3"
              : "flex-row items-center justify-between gap-4"
          } text-xs`}
        >
          <div className="flex items-center gap-2.5">
            <BrandMark color={palette.text} />
            <span
              style={{ fontFamily: FONT.display, color: palette.text }}
              className="text-base"
            >
              {brandTitle}
            </span>
          </div>
          <p style={{ color: palette.muted }} className="text-xs">
            Structural Lepidopterology &amp; Archival Conservation.
          </p>
        </div>
      </footer>
    </div>
  );
}

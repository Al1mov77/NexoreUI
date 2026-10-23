"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Check,
  ShieldCheck,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

/* ═══════════════════════════════════════════════════════════════════════════
   NOCTURNE ATELIER — MASTERPIECE AUTOMOTIVE TEMPLATE (SINGLE FILE ARCHITECTURE)
   Automotive Manufacturer Level (Pagani, Koenigsegg, Porsche Configurator)
   Zero AI-Slop: No glowing buttons, no fake urgency pills, no tracked red labels
   ═══════════════════════════════════════════════════════════════════════════ */

const NOCTURNE_DATA = {
  meta: {
    brand: "NOCTURNE",
    model: "Nocturne Prototype 04",
    ateliers: "Maranello Atelier",
    subtitle: "Maranello Hybrid V8 Prototype",
    editorial: "A study in nocturnal aerodynamics and hybrid propulsion, engineered in Maranello.",
    fullDescription:
      "A dual-motor front e-axle paired with a mid-mounted twin-turbo V8 powertrain, delivering immediate electric torque and relentless high-speed downforce.",
  },
  telemetry: [
    {
      id: "power",
      value: "1,000",
      unit: "CV",
      label: "Combined Output",
      description: "735 kW Twin-Turbo Hybrid V8",
    },
    {
      id: "acceleration",
      value: "2.3",
      unit: "s",
      label: "0–100 km/h",
      description: "6.7 s 0–200 km/h sprint",
    },
    {
      id: "vmax",
      value: "340+",
      unit: "km/h",
      label: "V-Max Top Speed",
      description: "Electronic track threshold",
    },
    {
      id: "downforce",
      value: "390",
      unit: "kg",
      label: "Aerodynamic Load",
      description: "Active downforce @ 250 km/h",
    },
  ],
  specifications: [
    { label: "Powertrain", value: "90° V8 Twin-Turbo + Tri-Motor Hybrid" },
    { label: "Displacement", value: "3,990 cm³" },
    { label: "Transmission", value: "8-Speed Dual-Clutch F1 Architecture" },
    { label: "Dry Weight", value: "1,570 kg" },
    { label: "Weight Distribution", value: "42% Front / 58% Rear" },
    { label: "Chassis", value: "Pre-preg Carbon Fiber Tub with Titanium Nodes" },
  ],
  anatomyNodes: [
    {
      id: "optics",
      code: "01",
      title: "Matrix LED Optics",
      subtitle: "Illumination Architecture",
      description:
        "Adaptive beam projection system with 84 micro-emitters. Dynamic dark-sector masking ensures surgical apex illumination without peripheral glare.",
      specifications: ["84 Active Matrix Segments", "650 m Projector Reach", "Dynamic Apex Corner Tracking"],
    },
    {
      id: "braking",
      code: "02",
      title: "Carbon-Ceramic CCM-R",
      subtitle: "Thermal Deceleration",
      description:
        "Direct Formula racing derivation with carbon-matrix composite discs. Sustained friction stability up to 800°C with monobloc 6-piston front calipers.",
      specifications: ["398 mm Front / 360 mm Rear", "800°C Thermal Peak", "60% Unsprung Mass Reduction"],
    },
    {
      id: "aero",
      code: "03",
      title: "Active Aerodynamic Halo",
      subtitle: "Variable Flow Field",
      description:
        "Adaptive twin-foil rear profile with electronically actuated 15° pitch range. Seamlessly shifts between minimum low-drag velocity and 390 kg cornering grip.",
      specifications: ["15° Variable Angle of Attack", "390 kg @ 250 km/h", "0.32 Drag Coefficient"],
    },
    {
      id: "monocoque",
      code: "04",
      title: "Carbon Composite Cell",
      subtitle: "Structural Monocoque",
      description:
        "Autoclave-cured high-modulus carbon cell engineered for maximum torsional rigidity. Precision hand-laid satin weave visible through protective matte lacquer.",
      specifications: ["High-Modulus Pre-preg Carbon", "46,000 Nm/deg Rigidity", "Integrated Roll Protection"],
    },
  ],
  liveries: [
    { id: "nero", name: "Nero Nocturne", finish: "Satin Monocoque", hex: "#111215" },
    { id: "rosso", name: "Rosso Corsa Dark", finish: "Deep Monocoque Tint", hex: "#8b181b" },
    { id: "grigio", name: "Grigio Silverstone", finish: "Titanium Charcoal", hex: "#32353b" },
  ],
  accents: [
    { id: "scuderia", name: "Rosso Scuderia", hex: "#b91c1c" },
    { id: "modena", name: "Giallo Modena", hex: "#d97706" },
    { id: "polare", name: "Bianco Polare", hex: "#e2e8f0" },
  ],
  aeroPackages: [
    {
      id: "fiorano",
      name: "Assetto Fiorano Package",
      tag: "Circuit Specification",
      description: "High-downforce configuration with carbon dive planes and track-tuned dampers.",
      downforceSpec: "390 kg Downforce @ 250 km/h",
    },
    {
      id: "gt",
      name: "Gran Turismo Spec",
      tag: "Grand Touring Contour",
      description: "Low-drag balance engineered for cross-continental stability and touring refinement.",
      downforceSpec: "280 kg Downforce @ 250 km/h (Cd 0.30)",
    },
  ],
  commissionNotice: {
    allocation: "Individual Atelier Allocation",
    leadTime: "14-week handcraft cycle in Maranello",
  },
} as const;

export function FerrariNocturnePreview() {
  const { deviceMode } = useTemplateCustomizer();

  /* Container width observation for adaptive responsiveness in all preview modes */
  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

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

  /* Adaptive device detection based on customizer deviceMode and container width */
  const isMobile = deviceMode === "mobile" || containerWidth < 640;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);
  const isDesktop = !isMobile && !isTablet;

  /* Interactive States */
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [selectedLivery, setSelectedLivery] = useState<"nero" | "rosso" | "grigio">("nero");
  const [selectedAccent, setSelectedAccent] = useState<"scuderia" | "modena" | "polare">("scuderia");
  const [selectedAero, setSelectedAero] = useState<"fiorano" | "gt">("fiorano");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentLivery = NOCTURNE_DATA.liveries.find((l) => l.id === selectedLivery)!;
  const currentAccent = NOCTURNE_DATA.accents.find((a) => a.id === selectedAccent)!;
  const currentAero = NOCTURNE_DATA.aeroPackages.find((p) => p.id === selectedAero)!;
  const activeNode = NOCTURNE_DATA.anatomyNodes[activeNodeIndex];

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setInquirySubmitted(true);
    }, 600);
  };

  return (
    <div
      ref={rootRef}
      className="w-full min-h-screen bg-[#07080a] text-[#f8fafc] font-sans selection:bg-[#b91c1c] selection:text-white overflow-x-hidden relative"
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          STICKY HEADER WITH NOCTURNE BRAND CREST (NO PHYSICAL SOUND BUTTON)
      ═══════════════════════════════════════════════════════════════════════ */}
      <header
        className={`sticky top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#07080a]/92 backdrop-blur-xl border-b border-white/[0.07] py-3"
            : "bg-[#07080a]/60 backdrop-blur-md border-b border-white/[0.04] py-3.5 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Brand Monogram & Sculpted Emblem */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick("#hero", e)}
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-sm"
            aria-label="Nocturne Atelier Homepage"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-black shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.6)]">
              <img
                src="/images/nocturne-emblem.jpg"
                alt="Nocturne Hypercar Crest"
                className="w-full h-full object-cover transform scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-[0.22em] text-white uppercase transition-colors group-hover:text-zinc-200">
                {NOCTURNE_DATA.meta.brand}
              </span>
              <span className="text-[10px] tracking-[0.16em] uppercase text-zinc-500 font-mono">
                Hypercar Atelier
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          {isDesktop && (
            <nav className="flex items-center gap-8" aria-label="Main Navigation">
              <a href="#propulsion" onClick={(e) => handleLinkClick("#propulsion", e)} className="text-xs font-medium tracking-wider uppercase text-zinc-400 hover:text-white transition-colors py-1">Propulsion</a>
              <a href="#engineering" onClick={(e) => handleLinkClick("#engineering", e)} className="text-xs font-medium tracking-wider uppercase text-zinc-400 hover:text-white transition-colors py-1">Engineering</a>
              <a href="#specifications" onClick={(e) => handleLinkClick("#specifications", e)} className="text-xs font-medium tracking-wider uppercase text-zinc-400 hover:text-white transition-colors py-1">Specifications</a>
              <a href="#configurator" onClick={(e) => handleLinkClick("#configurator", e)} className="text-xs font-medium tracking-wider uppercase text-zinc-400 hover:text-white transition-colors py-1">Configurator</a>
            </nav>
          )}

          {/* Header Action Button */}
          {isDesktop ? (
            <div className="flex items-center gap-4">
              <a
                href="#configurator"
                onClick={(e) => handleLinkClick("#configurator", e)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold tracking-wider uppercase bg-[#b91c1c] hover:bg-[#991b1b] active:scale-[0.98] text-white transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
              >
                <span>Commission</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          ) : (
            /* Mobile / Tablet Menu Button */
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-md border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white bg-white/[0.04] transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Mobile / Tablet Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="border-b border-white/10 bg-[#07080a]/98 backdrop-blur-2xl overflow-hidden px-6 py-6 space-y-4"
            >
              <nav className="flex flex-col space-y-2">
                <a href="#propulsion" onClick={(e) => handleLinkClick("#propulsion", e)} className="text-sm font-semibold tracking-wider uppercase text-zinc-300 hover:text-white py-2 border-b border-white/[0.05]">Propulsion</a>
                <a href="#engineering" onClick={(e) => handleLinkClick("#engineering", e)} className="text-sm font-semibold tracking-wider uppercase text-zinc-300 hover:text-white py-2 border-b border-white/[0.05]">Engineering</a>
                <a href="#specifications" onClick={(e) => handleLinkClick("#specifications", e)} className="text-sm font-semibold tracking-wider uppercase text-zinc-300 hover:text-white py-2 border-b border-white/[0.05]">Specifications</a>
                <a href="#configurator" onClick={(e) => handleLinkClick("#configurator", e)} className="text-sm font-semibold tracking-wider uppercase text-zinc-300 hover:text-white py-2 border-b border-white/[0.05]">Configurator</a>
              </nav>
              <div className="pt-2">
                <a
                  href="#configurator"
                  onClick={(e) => handleLinkClick("#configurator", e)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-xs font-semibold tracking-wider uppercase bg-[#b91c1c] text-white active:scale-[0.98]"
                >
                  <span>Request Commission</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: HERO CHAMBER (PURE CINEMATIC VIDEO & MONUMENTAL TITLE)
          NO bottom telemetry strip! Clean focus on video and vehicle identity
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative w-full h-[100svh] min-h-[560px] flex flex-col justify-center items-center overflow-hidden bg-[#07080a] select-none"
        aria-label="Nocturne Presentation Hero"
      >
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <video
            ref={videoRef}
            src="/videos/ferrari-nocturne.mp4"
            poster="/videos/ferrari-nocturne-poster.jpg"
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
            className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoLoaded ? "opacity-100" : "opacity-90"
            }`}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #07080a 0%, rgba(7, 8, 10, 0.7) 30%, rgba(7, 8, 10, 0.45) 60%, rgba(7, 8, 10, 0.8) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(7, 8, 10, 0.85) 95%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-xs sm:text-sm font-medium tracking-[0.24em] uppercase text-zinc-400 mb-3 sm:mb-4 font-mono"
          >
            {NOCTURNE_DATA.meta.subtitle}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className={`font-extrabold tracking-[-0.03em] uppercase text-white leading-none mb-4 sm:mb-6 ${
              isMobile ? "text-4xl sm:text-5xl" : isTablet ? "text-6xl" : "text-6xl sm:text-7xl lg:text-8xl"
            }`}
          >
            {NOCTURNE_DATA.meta.brand}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-sm sm:text-base text-zinc-300 font-normal max-w-xl mx-auto leading-relaxed mb-8 px-4"
          >
            {NOCTURNE_DATA.meta.editorial}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <a
              href="#propulsion"
              onClick={(e) => handleLinkClick("#propulsion", e)}
              className="inline-flex items-center gap-2 px-7 sm:px-9 py-3.5 rounded-md text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#b91c1c] hover:bg-[#991b1b] text-white transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Specification</span>
              <ArrowDown className="w-3.5 h-3.5 opacity-80" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: HYBRID V8 PROPULSION & LINEAR METRICS
          Large numbers without icons, divided by thin hairline rules
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="propulsion"
        className="relative z-20 py-20 sm:py-32 md:py-40 bg-[#07080a] border-t border-white/[0.08]"
        aria-label="Performance Telemetry"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-14 sm:mb-20">
            <p className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-zinc-500 mb-3">
              Powertrain Architecture
            </p>
            <h2
              className={`font-extrabold tracking-[-0.03em] text-white uppercase leading-tight mb-4 ${
                isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl"
              }`}
            >
              Hybrid V8 Propulsion
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-2xl">
              {NOCTURNE_DATA.meta.fullDescription}
            </p>
          </div>

          {/* Large Numbers Divided by Thin Hairlines */}
          <div
            className={`grid border-y border-white/[0.1] divide-white/[0.1] mb-16 sm:mb-24 ${
              isMobile
                ? "grid-cols-2 divide-x divide-y"
                : isTablet
                ? "grid-cols-2 divide-x divide-y"
                : "grid-cols-4 divide-x divide-y-0"
            }`}
          >
            {NOCTURNE_DATA.telemetry.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="py-6 sm:py-10 px-4 sm:px-8 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-500 block mb-2 sm:mb-4">
                    0{idx + 1} • {item.label}
                  </span>
                  <div className="flex items-baseline gap-1 mb-1 sm:mb-2">
                    <span className="font-bold font-mono tracking-tight text-white text-3xl sm:text-5xl">
                      {item.value}
                    </span>
                    {item.unit && (
                      <span className="text-sm sm:text-lg font-mono font-semibold text-[#dc2626]">
                        {item.unit}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs font-mono text-zinc-400 mt-2">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Technical Blueprint Specifications Sheet */}
          <div id="specifications" className="pt-4 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-white/[0.08] mb-8 gap-2">
              <div>
                <p className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500 mb-1">
                  Data Verification
                </p>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
                  Technical Blueprint
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                FIA Group Hypercar Standard
              </span>
            </div>

            <div
              className={`grid gap-x-12 gap-y-4 ${
                isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {NOCTURNE_DATA.specifications.map((spec, idx) => (
                <div
                  key={idx}
                  className="py-2.5 border-b border-white/[0.06] flex items-baseline justify-between gap-4 text-xs font-mono"
                >
                  <span className="text-zinc-500 uppercase tracking-wider">{spec.label}</span>
                  <span className="text-zinc-200 font-medium text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: ENGINEERING ARCHITECTURE (STRUCTURAL SYSTEM INSPECTION)
          Clean split layout, hairlines, zero blur glow
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="engineering"
        className="relative z-20 py-20 sm:py-32 md:py-40 bg-[#07080a] border-t border-white/[0.08]"
        aria-label="Engineering Systems Inspection"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-14 sm:mb-20">
            <p className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-zinc-500 mb-3">
              System Inspection
            </p>
            <h2
              className={`font-extrabold tracking-[-0.03em] text-white uppercase leading-tight mb-4 ${
                isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl"
              }`}
            >
              Engineering Architecture
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-2xl">
              Four primary structural assemblies engineered to sustain continuous track velocity and high thermal loading.
            </p>
          </div>

          <div
            className={`grid gap-8 lg:gap-12 border-t border-white/[0.1] pt-8 ${
              isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
            }`}
          >
            {/* System Nodes Selector */}
            <div
              className={`flex flex-col divide-y divide-white/[0.07] border-b lg:border-b-0 border-white/[0.07] ${
                isMobile ? "w-full" : "lg:col-span-5"
              }`}
            >
              {NOCTURNE_DATA.anatomyNodes.map((node, idx) => {
                const isSelected = activeNodeIndex === idx;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNodeIndex(idx)}
                    className={`py-4 sm:py-6 px-3 sm:px-4 text-left transition-all flex items-start justify-between group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                      isSelected ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`text-xs font-mono font-bold mt-0.5 transition-colors ${
                          isSelected ? "text-[#dc2626]" : "text-zinc-500 group-hover:text-zinc-400"
                        }`}
                      >
                        {node.code}
                      </span>
                      <div>
                        <h3
                          className={`text-sm sm:text-base font-semibold tracking-tight transition-colors ${
                            isSelected ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                          }`}
                        >
                          {node.title}
                        </h3>
                        <p className="text-xs font-mono text-zinc-500 mt-1">
                          {node.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 pt-1">
                      <div
                        className={`w-2 h-2 rounded-full transition-all ${
                          isSelected
                            ? "bg-[#dc2626] ring-4 ring-red-950/40"
                            : "bg-transparent border border-white/20 group-hover:border-white/40"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Node Detail */}
            <div className={isMobile ? "w-full py-2" : "lg:col-span-7 flex flex-col justify-between py-2 sm:py-4"}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-6 sm:space-y-8"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 tracking-wider uppercase mb-2">
                      <span>Assembly {activeNode.code}</span>
                      <span>•</span>
                      <span>{activeNode.subtitle}</span>
                    </div>
                    <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-white mb-3 sm:mb-4">
                      {activeNode.title}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                      {activeNode.description}
                    </p>
                  </div>

                  <div className="border-t border-white/[0.08] pt-6">
                    <p className="text-xs font-mono tracking-[0.16em] uppercase text-zinc-500 mb-4">
                      Engineering Parameters
                    </p>
                    <div className={`grid gap-3 sm:gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
                      {activeNode.specifications.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3.5 sm:p-4 rounded-md bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-zinc-200 leading-normal"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626] mb-2" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4: ATELIER CONFIGURATOR (PORSCHE / PAGANI CRAFT STANDARD)
          Clear swatches, authentic status, tactile crimson action button
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="configurator"
        className="relative z-20 py-20 sm:py-32 md:py-40 bg-[#07080a] border-t border-white/[0.08]"
        aria-label="Atelier Vehicle Configurator"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-14 sm:mb-20">
            <p className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-zinc-500 mb-3">
              Bespoke Specification
            </p>
            <h2
              className={`font-extrabold tracking-[-0.03em] text-white uppercase leading-tight mb-4 ${
                isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl"
              }`}
            >
              Atelier Configurator
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-2xl">
              Configure individual vehicle specifications. Every chassis is finished by hand at the Maranello Atelier over a 14-week fabrication period.
            </p>
          </div>

          <div
            className={`grid gap-10 lg:gap-14 border-t border-white/[0.1] pt-10 ${
              isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
            }`}
          >
            {/* Options Selectors */}
            <div className={`space-y-10 sm:space-y-12 ${isMobile ? "w-full" : "lg:col-span-7"}`}>
              {/* 1. Exterior Livery */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-xs font-mono tracking-[0.16em] uppercase text-zinc-400 font-semibold">
                    01 • Exterior Livery
                  </span>
                  <span className="text-xs font-mono text-zinc-500">{currentLivery.name}</span>
                </div>
                <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
                  {NOCTURNE_DATA.liveries.map((liv) => {
                    const isSelected = selectedLivery === liv.id;
                    return (
                      <button
                        key={liv.id}
                        type="button"
                        onClick={() => setSelectedLivery(liv.id)}
                        className={`min-h-[54px] p-3.5 rounded-md border text-left transition-all flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                          isSelected
                            ? "bg-white/[0.06] border-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                            : "bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                        aria-pressed={isSelected}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full shrink-0 border transition-transform ${
                              isSelected ? "border-white ring-2 ring-white/20 scale-105" : "border-white/20"
                            }`}
                            style={{ backgroundColor: liv.hex }}
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-white tracking-tight">{liv.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">{liv.finish}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-zinc-200 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Caliper & Accent */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-xs font-mono tracking-[0.16em] uppercase text-zinc-400 font-semibold">
                    02 • Caliper &amp; Light Ring Accent
                  </span>
                  <span className="text-xs font-mono text-zinc-500">{currentAccent.name}</span>
                </div>
                <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
                  {NOCTURNE_DATA.accents.map((acc) => {
                    const isSelected = selectedAccent === acc.id;
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setSelectedAccent(acc.id)}
                        className={`min-h-[54px] p-3.5 rounded-md border text-left transition-all flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                          isSelected
                            ? "bg-white/[0.06] border-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                            : "bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                        aria-pressed={isSelected}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full shrink-0 border transition-transform ${
                              isSelected ? "border-white ring-2 ring-white/20 scale-105" : "border-white/20"
                            }`}
                            style={{ backgroundColor: acc.hex }}
                          />
                          <span className="text-xs font-medium text-white tracking-tight">{acc.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-zinc-200 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Aerodynamics Package */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-xs font-mono tracking-[0.16em] uppercase text-zinc-400 font-semibold">
                    03 • Aerodynamics Specification
                  </span>
                  <span className="text-xs font-mono text-zinc-500">{currentAero.name}</span>
                </div>
                <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                  {NOCTURNE_DATA.aeroPackages.map((pkg) => {
                    const isSelected = selectedAero === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedAero(pkg.id)}
                        className={`min-h-[80px] p-4 rounded-md border text-left transition-all flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                          isSelected
                            ? "bg-white/[0.06] border-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                            : "bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                        aria-pressed={isSelected}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xs font-semibold text-white tracking-tight">{pkg.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-zinc-200" />}
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">{pkg.description}</p>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{pkg.downforceSpec}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Commission Summary */}
            <div className={isMobile ? "w-full" : "lg:col-span-5"}>
              <div className="sticky top-24 p-6 sm:p-8 rounded-lg border border-white/[0.1] bg-[#0c0e14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-6">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500 block mb-1">
                    Commission Summary
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-white uppercase">{NOCTURNE_DATA.meta.model}</h3>
                </div>

                <div className="space-y-3 border-y border-white/[0.08] py-4 sm:py-5 text-xs font-mono">
                  <div className="flex justify-between items-center"><span className="text-zinc-500">Livery</span><span className="text-zinc-200 font-medium">{currentLivery.name}</span></div>
                  <div className="flex justify-between items-center"><span className="text-zinc-500">Accent Trim</span><span className="text-zinc-200 font-medium">{currentAccent.name}</span></div>
                  <div className="flex justify-between items-center"><span className="text-zinc-500">Aerodynamics</span><span className="text-zinc-200 font-medium">{currentAero.name}</span></div>
                  <div className="flex justify-between items-center"><span className="text-zinc-500">Powertrain</span><span className="text-zinc-200 font-medium">1,000 CV Hybrid V8</span></div>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{NOCTURNE_DATA.commissionNotice.allocation} • {NOCTURNE_DATA.commissionNotice.leadTime}</span>
                </div>

                <form onSubmit={handleSubmitInquiry}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[48px] px-6 py-3.5 rounded-md font-semibold text-xs sm:text-sm tracking-wider uppercase text-white bg-[#b91c1c] hover:bg-[#991b1b] active:scale-[0.98] transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Registering Inquiry...</span>
                    ) : (
                      <>
                        <span>Request Atelier Allocation</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Confirmation Dialog */}
        <AnimatePresence>
          {inquirySubmitted && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="max-w-lg w-full bg-[#0c0e14] border border-white/15 p-6 sm:p-8 rounded-lg shadow-2xl relative space-y-6"
              >
                <button
                  type="button"
                  onClick={() => setInquirySubmitted(false)}
                  className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-1">
                    Commission Request Logged
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white uppercase">
                    Maranello Atelier Reference #N04-2026
                  </h3>
                </div>

                <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-md space-y-2 text-xs font-mono text-zinc-300">
                  <p><span className="text-zinc-500">Chassis:</span> {NOCTURNE_DATA.meta.model}</p>
                  <p><span className="text-zinc-500">Livery:</span> {currentLivery.name}</p>
                  <p><span className="text-zinc-500">Accent:</span> {currentAccent.name}</p>
                  <p><span className="text-zinc-500">Aero:</span> {currentAero.name}</p>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your bespoke specification dossier has been compiled. An Atelier client representative will review the engineering allocation and coordinate your consultation.
                </p>

                <button
                  type="button"
                  onClick={() => setInquirySubmitted(false)}
                  className="w-full py-3 rounded-md bg-white/10 hover:bg-white/15 text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Return to Showcase
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5: FOOTER (MANUFACTURER PROVENANCE & ATTRIBUTION)
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#050608] border-t border-white/[0.08] py-16 text-zinc-500 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div>
              <span className="font-extrabold tracking-[0.25em] text-sm text-white uppercase block mb-2">
                {NOCTURNE_DATA.meta.brand}
              </span>
              <p className="text-zinc-400 max-w-md font-sans text-xs">
                Autonomous nocturnal aerodynamics atelier & prototype division. Built to FIA Hypercar specification guidelines in Maranello.
              </p>
            </div>
            <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider text-zinc-400">
              <a href="#hero" onClick={(e) => handleLinkClick("#hero", e)} className="hover:text-white">Top</a>
              <span>•</span>
              <a href="#propulsion" onClick={(e) => handleLinkClick("#propulsion", e)} className="hover:text-white">Propulsion</a>
              <span>•</span>
              <a href="#engineering" onClick={(e) => handleLinkClick("#engineering", e)} className="hover:text-white">Engineering</a>
              <span>•</span>
              <a href="#configurator" onClick={(e) => handleLinkClick("#configurator", e)} className="hover:text-white">Configurator</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-zinc-600">
            <p>© {new Date().getFullYear()} Nocturne Hypercar Division. All specifications preliminary.</p>
            <div className="flex items-center gap-4">
              <span>Combined Output: 1,000 CV (735 kW)</span>
              <span>•</span>
              <span>0–100 km/h: 2.3 s</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

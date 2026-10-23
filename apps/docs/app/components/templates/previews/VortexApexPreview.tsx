/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind,
  Layers,
  Shield,
  ArrowRight,
  Sliders,
  Check,
  ChevronDown,
  Eye,
  Activity,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

/* ═══════════════════════════════════════════════════════════════════════════
   1. SINGLE SOURCE OF TRUTH: PHYSICS & SPECS DATA MODEL
   All dynamic metrics are computed as pure mathematical functions of speed v.
   Static material properties are stored once and never duplicated as raw strings.
═══════════════════════════════════════════════════════════════════════════ */

export const SPECS = {
  mass: 1280, // grams
  modulus: 324, // GPa (Toray T1100G)
  tensileStrength: 7.0, // GPa
  autoclavePressure: 7.2, // bar
  lightTransmittance: 99.2, // %
  impactAbsorption: 96.4, // % deceleration dissipation
  homologation: "FIA 8860-2018-ABP Specification",
  disclaimer: "Demonstration telemetry data based on boundary-layer computational fluid dynamics.",
} as const;

export const PHYSICS = {
  /** Dynamic Pressure q = 0.5 * rho * v^2 in kPa (rho = 1.225 kg/m^3) */
  dynamicPressure: (vKmH: number): number => {
    const vMs = vKmH / 3.6;
    return (0.5 * 1.225 * vMs * vMs) / 1000;
  },

  /** Vertical Downforce Fz in N, scaling quadratically from 42.8 N @ 200 km/h */
  downforce: (vKmH: number): number => {
    return 42.8 * Math.pow(vKmH / 200, 2);
  },

  /** Reynolds number Re = (v_ms * L) / nu with L = 0.31m, nu = 1.51e-5 m^2/s */
  reynolds: (vKmH: number): number => {
    const vMs = vKmH / 3.6;
    return (vMs * 0.31) / 1.51e-5;
  },

  /** Drag coefficient Cd with slight boundary layer compression */
  cd: (vKmH: number): number => {
    return 0.264 + (vKmH - 200) * 0.00003;
  },

  /** Flow regime classification */
  flowRegime: (vKmH: number): string => {
    if (vKmH < 180) return "Laminar Attached";
    if (vKmH < 280) return "Transitional Boundary Layer";
    return "Controlled Diffuser Separation";
  },
} as const;

/* Number formatter with thousands separator and zero decimal places */
const intlInt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const intlDec1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const intlDec2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const intlDec3 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

/* ═══════════════════════════════════════════════════════════════════════════
   2. COLOR EDITIONS ARCHITECTURE
   Three authentic Grand Prix editions. Each edition defines exactly ONE accent
   color; all other page chrome remains neutral carbon/graphite/white.
═══════════════════════════════════════════════════════════════════════════ */

export type EditionKey = "obsidian" | "rosso" | "verde";

export interface EditionConfig {
  id: EditionKey;
  queryParam: string;
  name: string;
  label: string;
  accent: string;
  accentRgb: string;
  swatch: string;
  videoSrc: string;
  posterSrc: string;
  weaveDesc: string;
  tagline: string;
}

/**
 * ASSET REQUIREMENTS FOR SEAMLESS 3-VIDEO ENGINE:
 * - Formats: MP4 (H.264) + WebM fallback
 * - Duration: Identical duration (e.g. 8.0s) & keyframe cadence
 * - Resolution: 1080p desktop, 720p mobile
 * - Target Bitrate: ~6–8 MB max per file
 * - Loop: Seamless start/end matching frame
 */
export const EDITIONS: Record<EditionKey, EditionConfig> = {
  obsidian: {
    id: "obsidian",
    queryParam: "blue",
    name: "Obsidian Blue",
    label: "Obsidian",
    accent: "#38bdf8",
    accentRgb: "56, 189, 248",
    swatch: "#38bdf8",
    videoSrc: "/videos/vortex-apex-obsidian.mp4",
    posterSrc: "/images/templates/vortex-apex-obsidian-poster.jpg",
    weaveDesc: "12K Twill Unidirectional Autoclave Core",
    tagline: "High-Modulus Carbon Monocoque",
  },
  rosso: {
    id: "rosso",
    queryParam: "red",
    name: "Rosso Velocity",
    label: "Rosso",
    accent: "#ef4444",
    accentRgb: "239, 68, 68",
    swatch: "#ef4444",
    videoSrc: "/videos/vortex-apex-rosso.mp4",
    posterSrc: "/images/templates/vortex-apex-rosso-poster.jpg",
    weaveDesc: "Toray T1100G Biaxial Carbon Infusion",
    tagline: "Scuderia Aerodynamic Shell",
  },
  verde: {
    id: "verde",
    queryParam: "green",
    name: "Verde Corse",
    label: "Verde",
    accent: "#10b981",
    accentRgb: "16, 185, 129",
    swatch: "#10b981",
    videoSrc: "/videos/vortex-apex-verde.mp4",
    posterSrc: "/images/templates/vortex-apex-verde-poster.jpg",
    weaveDesc: "Hybrid Carbon-Aramid High-Impact Weave",
    tagline: "Monza Telemetry Specification",
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   3. SEAMLESS SYNCED VIDEOS HOOK (useSyncedVideos)
═══════════════════════════════════════════════════════════════════════════ */

interface UseSyncedVideosOptions {
  activeEdition: EditionKey;
  isMobile: boolean;
  isInView: boolean;
  prefersReducedMotion: boolean;
}

function useSyncedVideos(
  videoRefs: Record<EditionKey, React.RefObject<HTMLVideoElement | null>>,
  { activeEdition, isMobile, isInView, prefersReducedMotion }: UseSyncedVideosOptions
) {
  const [isReady, setIsReady] = useState(false);
  const activeVideoRef = videoRefs[activeEdition];

  /* Align currentTime across videos when active edition changes */
  const switchVideo = useCallback(
    async (nextKey: EditionKey) => {
      if (prefersReducedMotion) return;

      const currentEl = activeVideoRef.current;
      const nextEl = videoRefs[nextKey].current;
      if (!nextEl) return;

      const syncTime = currentEl && !Number.isNaN(currentEl.currentTime) ? currentEl.currentTime : 0;

      try {
        if (Math.abs(nextEl.currentTime - syncTime) > 0.08) {
          nextEl.currentTime = syncTime;
          await new Promise<void>((resolve) => {
            const onSeeked = () => {
              nextEl.removeEventListener("seeked", onSeeked);
              resolve();
            };
            nextEl.addEventListener("seeked", onSeeked);
            setTimeout(() => {
              nextEl.removeEventListener("seeked", onSeeked);
              resolve();
            }, 120);
          });
        }

        const playPromise = nextEl.play();
        if (playPromise !== undefined) {
          await playPromise.catch(() => {});
        }

        /* On mobile, pause inactive videos to save decoders */
        if (isMobile) {
          Object.entries(videoRefs).forEach(([k, ref]) => {
            if (k !== nextKey && ref.current && !ref.current.paused) {
              ref.current.pause();
            }
          });
        }
      } catch {
        /* Fallback: graceful opacity cross-fade */
      }
    },
    [activeVideoRef, isMobile, prefersReducedMotion, videoRefs]
  );

  /* Playback & Viewport Control */
  useEffect(() => {
    if (prefersReducedMotion) return;

    if (!isInView) {
      /* Pause all when hero is off-screen */
      Object.values(videoRefs).forEach((ref) => {
        if (ref.current && !ref.current.paused) {
          ref.current.pause();
        }
      });
      return;
    }

    if (isMobile) {
      /* Mobile: only active video plays */
      const activeEl = activeVideoRef.current;
      if (activeEl && activeEl.paused) {
        activeEl.play().catch(() => {});
      }
      Object.entries(videoRefs).forEach(([k, ref]) => {
        if (k !== activeEdition && ref.current && !ref.current.paused) {
          ref.current.pause();
        }
      });
    } else {
      /* Desktop: all videos play concurrently for instant zero-latency switch */
      Object.values(videoRefs).forEach((ref) => {
        if (ref.current && ref.current.paused) {
          ref.current.play().catch(() => {});
        }
      });
    }
  }, [isInView, isMobile, activeEdition, prefersReducedMotion, activeVideoRef, videoRefs]);

  /* Drift synchronization loop (~1 second interval) */
  useEffect(() => {
    if (prefersReducedMotion || !isInView) return;

    const interval = setInterval(() => {
      const master = activeVideoRef.current;
      if (!master || master.paused) return;

      const masterTime = master.currentTime;

      Object.entries(videoRefs).forEach(([k, ref]) => {
        if (k === activeEdition) return;
        const slave = ref.current;
        if (!slave) return;

        /* If playing on desktop or paused on mobile, verify drift */
        if (!isMobile && slave.paused) {
          slave.play().catch(() => {});
        }

        if (Math.abs(slave.currentTime - masterTime) > 0.12) {
          slave.currentTime = masterTime;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeEdition, activeVideoRef, isInView, isMobile, prefersReducedMotion, videoRefs]);

  /* Mark ready on active video canplay */
  useEffect(() => {
    const activeEl = activeVideoRef.current;
    if (!activeEl) return;

    const onCanPlay = () => setIsReady(true);
    if (activeEl.readyState >= 2) {
      setIsReady(true);
    } else {
      activeEl.addEventListener("canplay", onCanPlay);
      return () => activeEl.removeEventListener("canplay", onCanPlay);
    }
  }, [activeVideoRef]);

  return { isReady, switchVideo };
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. REAL AERODYNAMIC HELMET PROFILE SVG (SIDE VIEW)
   Accurate Grand Prix competition helmet silhouette with visor aperture,
   chin vent wedge, and rear diffuser Kamm-tail.
═══════════════════════════════════════════════════════════════════════════ */

interface HelmetProfileSvgProps {
  accent: string;
  className?: string;
  activeLayer?: number;
}

function HelmetProfileSvg({ accent, className = "", activeLayer = 0 }: HelmetProfileSvgProps) {
  return (
    <svg
      viewBox="0 0 380 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Aerodynamic Grand Prix Helmet Contour"
    >
      <defs>
        {/* Subtle carbon weave gradient for shell stratum */}
        <linearGradient id="vx-shell-grad" x1="60" y1="30" x2="340" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e2230" />
          <stop offset="50%" stopColor="#141722" />
          <stop offset="100%" stopColor="#0d0f17" />
        </linearGradient>

        {/* Dynamic accent highlight glow */}
        <linearGradient id="vx-accent-glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* ─── LAYER 1: EPS Impact Matrix (Internal Core) ─── */}
      <path
        d="M 95 195 C 80 180 75 160 85 145 C 95 130 110 95 140 70 C 180 40 250 45 285 80 C 315 110 310 150 290 185 C 270 215 220 225 160 220 Z"
        fill="#11141e"
        stroke={activeLayer === 1 ? accent : "rgba(255,255,255,0.12)"}
        strokeWidth={activeLayer === 1 ? 2.5 : 1}
        strokeDasharray={activeLayer === 1 ? "none" : "3 3"}
        className="transition-colors duration-300"
      />

      {/* ─── LAYER 0: Outer Carbon Shell Monocoque ─── */}
      <path
        d="M 75 200 C 65 185 60 165 72 148 L 98 148 C 96 128 106 100 126 82 C 160 48 230 40 278 68 C 308 85 330 102 342 110 C 348 114 340 125 332 128 C 315 134 298 152 288 185 C 275 222 230 234 165 232 C 120 230 90 218 75 200 Z"
        fill="url(#vx-shell-grad)"
        stroke={activeLayer === 0 ? accent : "rgba(255,255,255,0.22)"}
        strokeWidth={activeLayer === 0 ? 3 : 1.5}
        className="transition-colors duration-300"
      />

      {/* ─── Rear Kamm-Tail Diffuser / Gurney Aero Flap ─── */}
      <path
        d="M 315 95 L 352 108 L 342 124 L 308 118 Z"
        fill="#161a26"
        stroke={accent}
        strokeWidth={1.5}
      />

      {/* ─── LAYER 2: Optical Class 1 Polycarbonate Visor ─── */}
      <path
        d="M 98 148 C 88 126 98 102 126 82 C 145 70 178 72 195 85 C 210 98 212 120 200 138 C 182 152 135 152 98 148 Z"
        fill={activeLayer === 2 ? `${accent}15` : "rgba(15, 23, 42, 0.75)"}
        stroke={activeLayer === 2 ? accent : "rgba(255, 255, 255, 0.65)"}
        strokeWidth={activeLayer === 2 ? 3 : 2}
        className="transition-colors duration-300"
      />

      {/* Visor Hinge Pivot & Locking Hardware */}
      <circle cx="196" cy="115" r="7" fill="#0d0f17" stroke={accent} strokeWidth="2" />
      <circle cx="196" cy="115" r="2.5" fill="#f8fafc" />

      {/* Front Chin Ram-Air Intake Slit */}
      <path
        d="M 68 180 L 82 180 L 80 188 L 66 188 Z"
        fill="#07090e"
        stroke={accent}
        strokeWidth="1.2"
      />

      {/* Tear-Off Post */}
      <circle cx="118" cy="125" r="2.2" fill={accent} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. MAIN COMPONENT: VORTEX APEX CORSE
═══════════════════════════════════════════════════════════════════════════ */

export function VortexApexPreview() {
  const { config, deviceMode } = useTemplateCustomizer();
  const isDark = config.theme !== "light"; // Dark-first aesthetic

  /* Responsive container detection */
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [showStickyMiniHeader, setShowStickyMiniHeader] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Measure width */
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

  /* Reduced motion & data save */
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Hero IntersectionObserver: pause off-screen, show sticky mini-header */
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsHeroInView(entry.isIntersecting);
          setShowStickyMiniHeader(!entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  /* Active Color Edition (Sync with URL query ?color=...) */
  const [activeEdition, setActiveEdition] = useState<EditionKey>("obsidian");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const colorQuery = params.get("color");
      if (colorQuery === "red" || colorQuery === "rosso") setActiveEdition("rosso");
      else if (colorQuery === "green" || colorQuery === "verde") setActiveEdition("verde");
      else if (colorQuery === "blue" || colorQuery === "obsidian") setActiveEdition("obsidian");
    } catch {
      /* Safe no-op */
    }
  }, []);

  const currentEdition = EDITIONS[activeEdition];

  /* 3 Video Refs */
  const obsidianVideoRef = useRef<HTMLVideoElement | null>(null);
  const rossoVideoRef = useRef<HTMLVideoElement | null>(null);
  const verdeVideoRef = useRef<HTMLVideoElement | null>(null);

  const videoRefs = useMemo(
    () => ({
      obsidian: obsidianVideoRef,
      rosso: rossoVideoRef,
      verde: verdeVideoRef,
    }),
    []
  );

  const { switchVideo } = useSyncedVideos(videoRefs, {
    activeEdition,
    isMobile,
    isInView: isHeroInView,
    prefersReducedMotion,
  });

  const handleSelectEdition = useCallback(
    (key: EditionKey) => {
      if (key === activeEdition) return;
      setActiveEdition(key);
      switchVideo(key);

      /* Seamlessly sync URL query without reload */
      if (typeof window !== "undefined") {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set("color", EDITIONS[key].queryParam);
          window.history.replaceState({}, "", url.toString());
        } catch {
          /* Fallback */
        }
      }
    },
    [activeEdition, switchVideo]
  );

  /* Wind Tunnel Simulator Interactive State */
  const [windSpeed, setWindSpeed] = useState<number>(240);
  const simulatorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSimulatorInView, setIsSimulatorInView] = useState(true);
  const simulatorContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = simulatorContainerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setIsSimulatorInView(e.isIntersecting));
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Canvas Streamline Simulation */
  useEffect(() => {
    const canvas = simulatorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let active = true;

    const particleCount = isMobile ? 24 : isTablet ? 40 : 58;
    const particles: {
      x: number;
      y: number;
      baseY: number;
      speed: number;
      length: number;
      opacity: number;
      layer: number;
    }[] = [];

    const initParticles = (w: number, h: number) => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        const baseY = h * 0.14 + (i / particleCount) * (h * 0.72);
        particles.push({
          x: Math.random() * w,
          y: baseY,
          baseY,
          speed: 2.2 + Math.random() * 2.4,
          length: isMobile ? 18 + Math.random() * 18 : 28 + Math.random() * 38,
          opacity: 0.35 + Math.random() * 0.55,
          layer: i % 3,
        });
      }
    };

    const render = () => {
      if (!active) return;

      if (!isSimulatorInView || prefersReducedMotion) {
        animId = requestAnimationFrame(render);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;

      if (particles.length === 0) {
        initParticles(w, h);
      }

      ctx.fillStyle = isDark ? "rgba(9, 10, 15, 0.32)" : "rgba(248, 250, 252, 0.32)";
      ctx.fillRect(0, 0, w, h);

      /* Streamline velocity ratio */
      const vRatio = windSpeed / 200;
      const helmetX = w * (isMobile ? 0.48 : 0.5);
      const helmetY = h * 0.5;
      const helmetR = Math.min(w, h) * (isMobile ? 0.28 : 0.26);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speed * vRatio * 1.8;
        if (p.x > w + p.length) {
          p.x = -p.length;
          p.baseY = h * 0.14 + Math.random() * (h * 0.72);
          p.y = p.baseY;
        }

        const dx = p.x - helmetX;
        const dy = p.baseY - helmetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influenceR = helmetR * 1.35;

        if (dist < influenceR && dx < helmetR * 1.4) {
          const pushFactor = (1 - dist / influenceR) * (dy >= 0 ? 1 : -1);
          p.y = p.baseY + pushFactor * (helmetR * 0.75);
        } else if (p.x > helmetX + helmetR * 0.85) {
          /* Trailing wake separation behind rear diffuser */
          const wakeFactor = Math.min(1, (p.x - helmetX) / (w * 0.4));
          const freq = 0.06 * vRatio;
          const amp = (isMobile ? 3.5 : 7) * wakeFactor * (vRatio * 0.85);
          p.y = p.baseY + Math.sin(p.x * freq + Date.now() * 0.004) * amp;
        } else {
          p.y += (p.baseY - p.y) * 0.1;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p.x - p.length, p.baseY);
        ctx.quadraticCurveTo(p.x - p.length * 0.5, p.y, p.x, p.y);

        const gradient = ctx.createLinearGradient(p.x - p.length, p.y, p.x, p.y);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(
          0.7,
          p.layer === 0
            ? currentEdition.accent
            : isDark
            ? `rgba(255, 255, 255, ${p.opacity * 0.7})`
            : `rgba(15, 23, 42, ${p.opacity * 0.5})`
        );
        gradient.addColorStop(1, currentEdition.accent);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.layer === 0 ? (isMobile ? 1.5 : 2.0) : 1.0;
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles(rect.width, rect.height);
    };

    handleResize();
    animId = requestAnimationFrame(render);

    window.addEventListener("resize", handleResize);
    return () => {
      active = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [windSpeed, currentEdition.accent, isDark, isMobile, isTablet, isSimulatorInView, prefersReducedMotion]);

  /* Materials Interactive State */
  const [activeMaterialLayer, setActiveMaterialLayer] = useState<number>(0);

  const materialLayers = [
    {
      id: 0,
      title: "Toray T1100G Prepreg Carbon",
      role: "Outer Aero Monocoque Shell",
      metricLabel: "Tensile Strength",
      metricVal: `${intlDec1.format(SPECS.tensileStrength)} GPa`,
      modulus: `${intlInt.format(SPECS.modulus)} GPa`,
      weight: `${intlInt.format(SPECS.mass)} g`,
      description:
        "Dual-directional 12K carbon fiber pre-impregnated with toughened epoxy resin. Autoclave cured at 7.2 bar to eliminate micro-voids and deliver absolute rigidity under high-speed boundary layer turbulence.",
      specs: [
        { label: "Shell Mass", val: `${intlInt.format(SPECS.mass)} g` },
        { label: "Modulus", val: `${intlInt.format(SPECS.modulus)} GPa` },
        { label: "Pressure", val: `${intlDec1.format(SPECS.autoclavePressure)} bar` },
      ],
    },
    {
      id: 1,
      title: "Multi-Density Venturi EPS Matrix",
      role: "Kinetic Impact Absorption Core",
      metricLabel: "Deceleration Absorption",
      metricVal: `${intlDec1.format(SPECS.impactAbsorption)}%`,
      modulus: "5 Density Gradients",
      weight: "Variable Foam Core",
      description:
        "Five progressive density zones with internal computational Bernoulli airflow channels. Directs ram air from frontal inlets across the skull into negative-pressure diffuser extractors while progressively dissipating impact energy.",
      specs: [
        { label: "Energy Dissipation", val: `${intlDec1.format(SPECS.impactAbsorption)}%` },
        { label: "Zonal Layers", val: "5 Variable Densities" },
        { label: "Attenuation", val: "-14.2 dB Acoustic" },
      ],
    },
    {
      id: 2,
      title: "Optical Class 1 Polycarbonate Visor",
      role: "Distortion-Free Aero Aperture",
      metricLabel: "Light Transmittance",
      metricVal: `${intlDec1.format(SPECS.lightTransmittance)}%`,
      modulus: "3.3 mm Variable Shield",
      weight: "Class 1 Optical Grade",
      description:
        "3.3mm variable injection geometry eliminates optical refraction at extreme viewing angles. Equipped with sealed tear-off posts, dual metal locking pins, and Pinlock MaxVision 120 anti-fog seal.",
      specs: [
        { label: "Transmittance", val: `${intlDec1.format(SPECS.lightTransmittance)}%` },
        { label: "Thickness", val: "3.3 mm Variable" },
        { label: "Optics Standard", val: "Class 1 Zero-Refraction" },
      ],
    },
  ];

  /* Bespoke Configurator State */
  const [selectedSize, setSelectedSize] = useState<string>("M (57-58cm)");
  const [selectedCheekPad, setSelectedCheekPad] = useState<string>("25mm Grand Prix");
  const [selectedVisor, setSelectedVisor] = useState<string>("Iridium Gold");
  const [selectedDiffuser, setSelectedDiffuser] = useState<string>("Extended Gurney Flap");
  const [isRequested, setIsRequested] = useState<boolean>(false);

  /* Calculated dynamic telemetry values from single source of truth */
  const dynamicCd = PHYSICS.cd(windSpeed);
  const dynamicFz = PHYSICS.downforce(windSpeed);
  const dynamicQ = PHYSICS.dynamicPressure(windSpeed);
  const dynamicRe = PHYSICS.reynolds(windSpeed);
  const dynamicRegime = PHYSICS.flowRegime(windSpeed);

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-hidden font-sans selection:bg-white/20"
      style={
        {
          "--accent": currentEdition.accent,
          "--accent-rgb": currentEdition.accentRgb,
          backgroundColor: isDark ? "#090a0f" : "#fafafa",
          color: isDark ? "#f8fafc" : "#0f172a",
        } as React.CSSProperties
      }
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          QUIET STICKY MINI-HEADER (Appears on scroll past hero)
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showStickyMiniHeader && (
          <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-0 inset-x-0 z-50 h-14 border-b backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between"
            style={{
              backgroundColor: isDark ? "rgba(9, 10, 15, 0.88)" : "rgba(255, 255, 255, 0.92)",
              borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)",
              boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm tracking-tight text-foreground">
                {config.brandName || "Vortex Apex Corse"}
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-zinc-600" />
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentEdition.accent }}
                />
                <span>{currentEdition.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mini color switcher */}
              <div className="flex items-center gap-1 p-0.5 rounded-full bg-black/30 border border-white/10">
                {(Object.keys(EDITIONS) as EditionKey[]).map((key) => {
                  const ed = EDITIONS[key];
                  const active = activeEdition === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectEdition(key)}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        active ? "scale-110 ring-2 ring-white/60" : "opacity-60 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: ed.swatch }}
                      title={ed.name}
                      aria-label={`Switch to ${ed.name}`}
                    />
                  );
                })}
              </div>

              <a
                href="#specification"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-transform active:scale-95 shadow-sm"
                style={{ backgroundColor: currentEdition.accent }}
              >
                Inquire Build
              </a>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          MINIMAL TRANSPARENT HEADER
          Clean wordmark on left, 3-4 navigation links on right, mobile burger.
          NO AI slop (no Mute, no Fullscreen, no CLI badges).
      ═══════════════════════════════════════════════════════════════════════ */}
      <header className="absolute top-0 inset-x-0 z-40 h-20 px-4 sm:px-8 md:px-12 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          {config.customLogoUrl ? (
            <img
              src={config.customLogoUrl}
              alt="Brand Logo"
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="font-extrabold text-base sm:text-lg tracking-[-0.03em] uppercase text-white">
              {config.brandName || "Vortex Apex"}
            </span>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-300">
          <a href="#aerodynamics" className="hover:text-white transition-colors">
            Aerodynamics
          </a>
          <a href="#composites" className="hover:text-white transition-colors">
            Composites
          </a>
          <a href="#telemetry" className="hover:text-white transition-colors">
            Telemetry
          </a>
          <a href="#specification" className="hover:text-white transition-colors">
            Specification
          </a>
        </nav>

        {/* Action Button & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <a
            href="#specification"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-transform active:scale-95"
            style={{
              backgroundColor: currentEdition.accent,
              boxShadow: `0 4px 20px -2px ${currentEdition.accent}55`,
            }}
          >
            <span>Inquire Build</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-black/40 border border-white/10 text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 p-6 bg-zinc-950/95 border-b border-white/10 backdrop-blur-2xl md:hidden space-y-4 text-center"
          >
            <nav className="flex flex-col gap-4 text-sm font-medium">
              <a
                href="#aerodynamics"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-zinc-300 hover:text-white"
              >
                Aerodynamics
              </a>
              <a
                href="#composites"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-zinc-300 hover:text-white"
              >
                Composites
              </a>
              <a
                href="#telemetry"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-zinc-300 hover:text-white"
              >
                Telemetry
              </a>
              <a
                href="#specification"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-zinc-300 hover:text-white"
              >
                Specification
              </a>
            </nav>
            <a
              href="#specification"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 rounded-xl text-xs font-bold text-white text-center"
              style={{ backgroundColor: currentEdition.accent }}
            >
              Inquire Build
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO CHAMBER (100svh) WITH SEAMLESS 3-VIDEO STACK
          Stacked <video> elements with cross-fade opacity and zero audio/black flash.
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[580px] h-[100svh] overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-14"
      >
        {/* Seamless 3-Video Concurrent Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-zinc-950">
          <video
            ref={obsidianVideoRef}
            src="/videos/vortex-apex-obsidian.mp4"
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-500 ease-in-out"
            style={{ opacity: activeEdition === "obsidian" ? 1 : 0 }}
          />

          <video
            ref={rossoVideoRef}
            src="/videos/vortex-apex-rosso.mp4"
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-500 ease-in-out"
            style={{ opacity: activeEdition === "rosso" ? 1 : 0 }}
          />

          <video
            ref={verdeVideoRef}
            src="/videos/vortex-apex-verde.mp4"
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-500 ease-in-out"
            style={{ opacity: activeEdition === "verde" ? 1 : 0 }}
          />

          {/* High-Contrast Scrim Backdrop Gradients (AA contrast for white typography) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(9, 10, 15, 0.95) 0%, rgba(9, 10, 15, 0.55) 30%, transparent 60%, rgba(9, 10, 15, 0.65) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 65% at 50% 50%, transparent 40%, rgba(9, 10, 15, 0.70) 100%)",
            }}
          />
        </div>

        {/* Top Spacer */}
        <div className="relative z-10 w-full h-12" />

        {/* Hero Architectural Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 my-auto pb-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[-0.03em] leading-tight text-white drop-shadow-lg"
          >
            {config.heroTitle || "Vortex Apex Corse"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-zinc-100 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow"
          >
            {config.heroSubtitle ||
              "Grand Prix aerodynamic carbon monocoque engineered for extreme velocity."}
          </motion.p>

          {/* COLOR SWITCHER (Lives inside Hero with 44x44px accessible tap targets) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-2 flex flex-col items-center justify-center gap-2"
          >
            <div
              role="radiogroup"
              aria-label="Helmet Color Edition"
              className="inline-flex items-center gap-2 p-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl"
            >
              {(Object.keys(EDITIONS) as EditionKey[]).map((key) => {
                const item = EDITIONS[key];
                const isSelected = activeEdition === key;
                return (
                  <button
                    key={key}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelectEdition(key)}
                    className="relative flex items-center gap-2 px-3 py-1.5 rounded-full min-h-[44px] text-xs font-medium text-white transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 transition-transform"
                      style={{
                        backgroundColor: item.swatch,
                        boxShadow: isSelected ? `0 0 10px ${item.swatch}` : "none",
                        transform: isSelected ? "scale(1.2)" : "scale(1)",
                      }}
                    />
                    <span className={isSelected ? "font-bold text-white" : "text-zinc-400"}>
                      {item.label}
                    </span>

                    {/* Active Underline Pill */}
                    {isSelected && (
                      <motion.div
                        layoutId="hero-color-pill"
                        className="absolute inset-0 rounded-full border border-white/20 -z-10 bg-white/10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <span className="text-[11px] font-mono text-zinc-400 tracking-wide">
              {currentEdition.name} • {currentEdition.tagline}
            </span>
          </motion.div>
        </div>

        {/* Hero Footer: Clean 3-Metric Block with Thin Dividers */}
        <div className="relative z-10 w-full max-w-5xl mx-auto border-t border-white/10 pt-4">
          <div className="grid grid-cols-3 divide-x divide-white/10 text-center font-mono">
            <div className="px-2 sm:px-4 space-y-0.5">
              <div className="text-sm sm:text-xl md:text-2xl font-bold text-white">
                {intlInt.format(SPECS.mass)} g
              </div>
              <div className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">
                Shell Mass
              </div>
            </div>

            <div className="px-2 sm:px-4 space-y-0.5">
              <div
                className="text-sm sm:text-xl md:text-2xl font-bold"
                style={{ color: currentEdition.accent }}
              >
                {intlInt.format(SPECS.modulus)} GPa
              </div>
              <div className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">
                Tensile Modulus
              </div>
            </div>

            <div className="px-2 sm:px-4 space-y-0.5">
              <div className="text-sm sm:text-xl md:text-2xl font-bold text-white">
                42.8 N
              </div>
              <div className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-wider">
                Downforce @ 200 km/h
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: AERODYNAMIC TUNNEL SIMULATION (CFD CANVAS)
          Real helmet silhouette SVG, potential flow streamlines, inside slider,
          single row of metrics, exactly one accent color.
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="aerodynamics"
        ref={simulatorContainerRef}
        className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-white/10 space-y-8"
      >
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-0.03em] text-foreground">
            Aerodynamic Tunnel Simulation
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Real-time smoke streamline field simulating boundary layer adherence and diffuser wake
            dissipation around the carbon shell.
          </p>
        </div>

        {/* Minimalist Wind Velocity Slider (Directly under heading) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-muted-foreground">Wind Velocity Parameter:</span>
            <span className="font-bold text-base" style={{ color: currentEdition.accent }}>
              {windSpeed} km/h
            </span>
          </div>

          <input
            type="range"
            min="80"
            max="360"
            step="5"
            value={windSpeed}
            onChange={(e) => setWindSpeed(Number(e.target.value))}
            className="w-full cursor-pointer h-1.5 rounded-lg appearance-none bg-zinc-800"
            style={{ accentColor: currentEdition.accent }}
            aria-label="Wind Velocity"
          />

          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>80 km/h (Pit Lane)</span>
            <span>200 km/h (Benchmark)</span>
            <span>360 km/h (Straightaway)</span>
          </div>
        </div>

        {/* Wind Tunnel Simulation Chamber with Real Helmet SVG Silhouette */}
        <div
          className="relative w-full rounded-2xl overflow-hidden border shadow-2xl bg-zinc-950 flex items-center justify-center"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          {/* Canvas for dynamic streamlines */}
          <canvas
            ref={simulatorCanvasRef}
            className="w-full block h-[260px] sm:h-[360px] md:h-[440px]"
          />

          {/* Real Helmet SVG Silhouette Centered Over the Flow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
            <HelmetProfileSvg
              accent={currentEdition.accent}
              className="w-[200px] sm:w-[280px] md:w-[340px] h-auto drop-shadow-2xl"
              activeLayer={0}
            />
          </div>

          {/* Clean Flow Regime Label (Plain text, no pulsing dot) */}
          <div className="absolute bottom-3 left-4 text-[11px] font-mono text-zinc-400 bg-black/60 px-2.5 py-1 rounded-md border border-white/5 backdrop-blur-md">
            Flow State: <span className="text-white font-medium">{dynamicRegime}</span>
          </div>

          <div className="absolute top-3 right-4 text-[10px] font-mono text-zinc-500">
            {SPECS.disclaimer}
          </div>
        </div>

        {/* Telemetry Row: Single Row of Large Numbers with Thin Dividers */}
        <div
          id="telemetry"
          className="w-full rounded-2xl p-5 border border-white/10 bg-zinc-950/40 backdrop-blur-md"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 font-mono text-center">
            <div className="p-3 space-y-1">
              <div className="text-[10px] sm:text-xs text-muted-foreground uppercase">
                Drag Coefficient
              </div>
              <div className="text-lg sm:text-2xl font-bold" style={{ color: currentEdition.accent }}>
                {intlDec3.format(dynamicCd)} Cd
              </div>
            </div>

            <div className="p-3 space-y-1">
              <div className="text-[10px] sm:text-xs text-muted-foreground uppercase">
                Vertical Downforce
              </div>
              <div className="text-lg sm:text-2xl font-bold text-white">
                {intlDec1.format(dynamicFz)} N
              </div>
            </div>

            <div className="p-3 space-y-1">
              <div className="text-[10px] sm:text-xs text-muted-foreground uppercase">
                Dynamic Pressure
              </div>
              <div className="text-lg sm:text-2xl font-bold text-white">
                {intlDec2.format(dynamicQ)} kPa
              </div>
            </div>

            <div className="p-3 space-y-1">
              <div className="text-[10px] sm:text-xs text-muted-foreground uppercase">
                Reynolds Number
              </div>
              <div className="text-lg sm:text-2xl font-bold text-white">
                {intlInt.format(Math.round(dynamicRe))} Re
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: TRI-COMPOSITE MATERIAL MATRIX
          Interactive cutaway SVG, underlined tabs, single big percentage,
          thin-line specs table, single accent color.
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="composites"
        className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-white/10 space-y-8"
      >
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-0.03em] text-foreground">
            Tri-Composite Material Matrix
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Three protective strata engineered for impact deceleration dissipation and optical clarity.
          </p>
        </div>

        {/* Underlined Layer Navigation Tabs (layoutId slide indicator) */}
        <div className="flex border-b border-white/10 gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          {materialLayers.map((layer) => {
            const isSelected = activeMaterialLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveMaterialLayer(layer.id)}
                className="relative pb-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
                style={{ color: isSelected ? "#ffffff" : "#71717a" }}
              >
                <span>{layer.title}</span>
                {isSelected && (
                  <motion.div
                    layoutId="material-tab-underline"
                    className="absolute bottom-0 inset-x-0 h-0.5"
                    style={{ backgroundColor: currentEdition.accent }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Cutaway Blueprint & Specs Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl p-6 sm:p-8 bg-zinc-950 border border-white/10">
          {/* Interactive SVG Cutaway Diagram */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-zinc-900/40 border border-white/5">
            <HelmetProfileSvg
              accent={currentEdition.accent}
              activeLayer={activeMaterialLayer}
              className="w-full max-w-[280px] h-auto drop-shadow-xl"
            />
            <div className="text-[11px] font-mono text-zinc-400 mt-4 text-center">
              Active Stratum: <span className="text-white font-medium">{materialLayers[activeMaterialLayer].role}</span>
            </div>
          </div>

          {/* Active Material Deep-Dive Details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: currentEdition.accent }}>
                Stratum 0{activeMaterialLayer + 1} Specification
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {materialLayers[activeMaterialLayer].title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
                {materialLayers[activeMaterialLayer].description}
              </p>
            </div>

            {/* Prominent Deceleration / Stratum Metric */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-baseline gap-4">
              <div className="text-3xl sm:text-4xl font-extrabold" style={{ color: currentEdition.accent }}>
                {materialLayers[activeMaterialLayer].metricVal}
              </div>
              <div className="text-xs font-mono text-zinc-400">
                {materialLayers[activeMaterialLayer].metricLabel}
              </div>
            </div>

            {/* Thin-Line Specs Table */}
            <div className="divide-y divide-white/10 border-y border-white/10 font-mono text-xs">
              {materialLayers[activeMaterialLayer].specs.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2.5">
                  <span className="text-zinc-400">{item.label}</span>
                  <span className="text-white font-medium">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3-Layer Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-950/60 p-4">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400">
                <th className="pb-2 font-normal">Layer</th>
                <th className="pb-2 font-normal">Material Formulation</th>
                <th className="pb-2 font-normal">Primary Metric</th>
                <th className="pb-2 font-normal">Function</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              <tr>
                <td className="py-2.5 font-bold text-white">Shell</td>
                <td className="py-2.5">12K Toray T1100G Prepreg</td>
                <td className="py-2.5" style={{ color: currentEdition.accent }}>324 GPa Modulus</td>
                <td className="py-2.5">Projectile & Rigidity Barrier</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Core</td>
                <td className="py-2.5">5-Density Venturi EPS</td>
                <td className="py-2.5 text-white">96.4% Absorption</td>
                <td className="py-2.5">Progressive Deceleration Matrix</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Aperture</td>
                <td className="py-2.5">Class 1 Polycarbonate</td>
                <td className="py-2.5 text-white">99.2% Transmittance</td>
                <td className="py-2.5">Zero-Refraction High-Speed Optics</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4: BESPOKE GRAND PRIX SPECIFICATION (ORDER / INQUIRY)
          No fake urgency, clean summary of chosen configuration, single CTA.
          Mobile sticky bottom bar for easy thumb tapping.
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="specification"
        className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 border-t border-white/10 space-y-8"
      >
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-0.03em] text-foreground">
            Bespoke Grand Prix Specification
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Configure competition ergonomics, visor optics, and aerodynamic rear diffuser package.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Configurator Selectors */}
          <div className="lg:col-span-7 space-y-6">
            {/* Synchronized Color Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex justify-between">
                <span>Color Edition</span>
                <span className="font-bold" style={{ color: currentEdition.accent }}>
                  {currentEdition.name}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(EDITIONS) as EditionKey[]).map((key) => {
                  const ed = EDITIONS[key];
                  const active = activeEdition === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectEdition(key)}
                      className={`p-3 rounded-xl border text-center font-mono text-xs transition-all cursor-pointer ${
                        active
                          ? "bg-white/10 font-bold border-white/40 shadow-sm"
                          : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full mx-auto mb-1.5"
                        style={{ backgroundColor: ed.swatch }}
                      />
                      <span>{ed.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shell Size */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex justify-between">
                <span>Shell Circumference Size</span>
                <span className="font-bold text-white">{selectedSize}</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  "XS (54cm)",
                  "S (55-56cm)",
                  "M (57-58cm)",
                  "L (59-60cm)",
                  "XL (61-62cm)",
                ].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-1 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                      selectedSize === size
                        ? "bg-white/15 text-white font-bold border-white/30"
                        : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {size.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Cheek Pad Compression */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex justify-between">
                <span>Ergonomic Cheek Pad Fit</span>
                <span className="font-bold text-white">{selectedCheekPad}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "20mm Sprint", label: "20mm Sprint Tight" },
                  { id: "25mm Grand Prix", label: "25mm Grand Prix Pro" },
                  { id: "30mm Endurance", label: "30mm Endurance" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCheekPad(item.id)}
                    className={`p-3 rounded-lg border font-mono text-xs text-left transition-all cursor-pointer ${
                      selectedCheekPad === item.id
                        ? "bg-white/15 text-white font-bold border-white/30"
                        : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visor Optics */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex justify-between">
                <span>Optical Class 1 Shield Aperture</span>
                <span className="font-bold text-white">{selectedVisor}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "Iridium Gold", desc: "Solar Glare Deflection" },
                  { id: "Dark Smoke", desc: "80% Tint Anti-UV" },
                  { id: "Clear Contrast", desc: "Night & Rain Racing" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedVisor(item.id)}
                    className={`p-3 rounded-lg border font-mono text-xs text-left transition-all cursor-pointer ${
                      selectedVisor === item.id
                        ? "bg-white/15 text-white font-bold border-white/30"
                        : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="font-bold">{item.id}</div>
                    <div className="text-[10px] text-zinc-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rear Diffuser Winglet */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex justify-between">
                <span>Rear Aerodynamic Spoiler</span>
                <span className="font-bold text-white">{selectedDiffuser}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "Extended Gurney Flap", desc: "Maximum High-Speed Downforce" },
                  { id: "Low-Drag Sprint Winglet", desc: "Maximum Top-Speed Slipstream" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDiffuser(item.id)}
                    className={`p-3 rounded-lg border font-mono text-xs text-left transition-all cursor-pointer ${
                      selectedDiffuser === item.id
                        ? "bg-white/15 text-white font-bold border-white/30"
                        : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="font-bold">{item.id}</div>
                    <div className="text-[10px] text-zinc-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration Summary & Request Action */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl space-y-5">
            <div className="border-b border-white/10 pb-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                Configuration Summary
              </div>
              <div className="text-xl font-bold text-white mt-1">
                Vortex Apex Corse
              </div>
            </div>

            <div className="space-y-2.5 font-mono text-xs divide-y divide-white/5">
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Edition</span>
                <span className="font-bold" style={{ color: currentEdition.accent }}>
                  {currentEdition.name}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Shell Size</span>
                <span className="font-bold text-white">{selectedSize}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Cheek Pads</span>
                <span className="font-bold text-white">{selectedCheekPad}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Visor Treatment</span>
                <span className="font-bold text-white">{selectedVisor}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Aero Diffuser</span>
                <span className="font-bold text-white">{selectedDiffuser}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Homologation</span>
                <span className="font-bold text-zinc-300">{SPECS.homologation}</span>
              </div>
            </div>

            <button
              onClick={() => setIsRequested(true)}
              disabled={isRequested}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              style={{
                backgroundColor: isRequested ? "#10b981" : currentEdition.accent,
                boxShadow: isRequested ? "none" : `0 4px 24px -2px ${currentEdition.accent}66`,
              }}
            >
              {isRequested ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Inquiry Transmitted to Corse Atelier</span>
                </>
              ) : (
                <>
                  <span>Request Helmet Build</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] font-mono text-zinc-500 text-center">
              Tailored fabrication begins upon technical telemetry verification.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE FIXED BOTTOM CTA BAR (One-thumb interaction)
      ═══════════════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-3 bg-zinc-950/90 border-t border-white/10 backdrop-blur-xl flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono text-zinc-400">Vortex Apex Corse</div>
            <div className="text-xs font-bold text-white">{currentEdition.name}</div>
          </div>
          <a
            href="#specification"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white"
            style={{ backgroundColor: currentEdition.accent }}
          >
            Inquire Build
          </a>
        </div>
      )}

      {/* Subtle Footer */}
      <footer className="w-full border-t border-white/10 py-8 px-4 text-center font-mono text-xs text-zinc-500">
        <div>Vortex Apex Corse Atelier • Grand Prix Aerodynamic Monocoque</div>
        <div className="text-[10px] text-zinc-600 mt-1">
          Designed with NexoreUI Masterpiece Craft Standards.
        </div>
      </footer>
    </div>
  );
}
export default VortexApexPreview;

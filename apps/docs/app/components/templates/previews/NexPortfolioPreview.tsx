"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  Check,
  Copy,
  X,
  Sun,
  Moon,
  Clock,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

const PALETTE = {
  dark: {
    bg: "#09090B",
    surface: "#111113",
    surfaceAlt: "#18181B",
    line: "#27272A",
    text: "#FAFAFA",
    textSecondary: "#E4E4E7",
    muted: "#A1A1AA",
    accent: "#FF6600",
  },
  light: {
    bg: "#FFFFFF",
    surface: "#F4F4F5",
    surfaceAlt: "#ECECEE",
    line: "#E4E4E7",
    text: "#09090B",
    textSecondary: "#27272A",
    muted: "#71717A",
    accent: "#EA580C",
  },
};

const FONT = {
  sans: 'var(--font-sans), "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: 'var(--font-mono), "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
};

const MOTION = {
  spring: { type: "spring", stiffness: 500, damping: 36, mass: 0.6 },
  snappy: { type: "spring", stiffness: 600, damping: 36, mass: 0.5 },
  ease: [0.2, 0, 0, 1] as const,
  duration: 0.25,
};

export type ProjectCategory = "All" | "Design Systems" | "Fintech" | "Spatial & AI" | "Type & Craft";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  client: string;
  category: ProjectCategory;
  year: string;
  role: string;
  tagline: string;
  description: string;
  challenge: string;
  solution: string;
  metrics: ProjectMetric[];
  tags: string[];
  image: string;
  liveUrl?: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface CapabilityItem {
  number: string;
  title: string;
  summary: string;
  skills: string[];
}

const PROJECTS: ProjectItem[] = [
  {
    id: "kronos-terminal",
    index: "01",
    title: "KRONOS",
    client: "Kronos Capital",
    category: "Fintech",
    year: "2025",
    role: "Principal Design Engineer",
    tagline: "High-throughput quantitative trading terminal with real-time DOM depth charts.",
    description: "Architected the low-latency web execution console for quantitative market-making desks. Built custom Canvas 2D and WebGL order book depth visualizations with sub-millisecond data pipelines.",
    challenge: "Traditional fintech dashboards experience severe frame drops during high-volatility events, blinding operators to real-time order depth transitions.",
    solution: "Built a dual-buffer Canvas rendering layer decoupling websocket event ingestion from React state reconciliation, maintaining 120 FPS across 16 active asset streams.",
    metrics: [
      { label: "Execution Latency", value: "0.4ms" },
      { label: "Order Throughput", value: "+340%" },
      { label: "Daily Volume", value: "$18.4B" },
    ],
    tags: ["WebGL", "TypeScript", "Canvas 2D", "High-Frequency", "Design Systems"],
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://kronos.nexore.io",
  },
  {
    id: "aura-spatial",
    index: "02",
    title: "AURA Spatial System",
    client: "Aura Labs",
    category: "Design Systems",
    year: "2025",
    role: "System Architect & Lead",
    tagline: "Volumetric design tokens, physical depth hierarchies, and spatial acoustic feedback primitives.",
    description: "Created the enterprise design language for spatial computing environments. Standardized cross-platform tokens across Figma, visionOS RealityKit, and WebXR applications.",
    challenge: "Spatial software lacked unified tokens for volumetric depth, specular refraction, and gaze-dwell micro-interactions across devices.",
    solution: "Constructed an automated multi-target token compiler producing native JSON, Swift RealityKit packages, and CSS custom variables with calibrated audio feedback triggers.",
    metrics: [
      { label: "Tokens Standardized", value: "14,200+" },
      { label: "Design Teams", value: "48 Teams" },
      { label: "Coverage", value: "100% Type-Safe" },
    ],
    tags: ["Spatial UI", "Design Tokens", "visionOS", "Figma API", "Acoustics"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://aura.nexore.io",
  },
  {
    id: "nexus-canvas",
    index: "03",
    title: "NEXUS Orchestrator",
    client: "Nexus AI Research",
    category: "Spatial & AI",
    year: "2024",
    role: "Lead Interface Technologist",
    tagline: "Infinite node-based workflow graph engine for collaborative autonomous agent networks.",
    description: "Conceived and engineered the graphical workflow interface where research teams compose multi-model agent clusters with live streaming token inspection and branch rollback.",
    challenge: "Complex multi-agent pipelines were opaque black boxes with terminal logs that made debugging probabilistic agent routing difficult.",
    solution: "Developed an infinite-canvas DAG editor with reactive force-directed layout springs, sub-millisecond pan and zoom, and live visual execution data pipes.",
    metrics: [
      { label: "Active Researchers", value: "190k MAU" },
      { label: "Graph Performance", value: "60 FPS at 10k Nodes" },
      { label: "Debugging Speed", value: "4.8x Faster" },
    ],
    tags: ["React Flow", "Framer Motion", "LLM Orchestration", "Node Graphs"],
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://nexus.nexore.io",
  },
  {
    id: "helvetica-noir",
    index: "04",
    title: "HELVETICA NOIR",
    client: "Basel Typographic Guild",
    category: "Type & Craft",
    year: "2024",
    role: "Creative Director",
    tagline: "Interactive variable font specimen, optical kerning laboratory, and tactile Swiss print archive.",
    description: "An homage to Swiss rationalist graphic design. An experimental digital specimen featuring real-time glyph variable axis interpolation and physical printing press preview.",
    challenge: "Digital type specimens often feel static and fail to convey the tactile micro-typographic nuances of physical lead-type letterpress printing.",
    solution: "Built a responsive browser-based kerning simulation engine with SVG bezier glyph decomposition, variable weight sliders, and darkroom inverted color palettes.",
    metrics: [
      { label: "Specimen Views", value: "520k+" },
      { label: "Typographic Axis", value: "6 Axes" },
      { label: "Glyph Library", value: "840 Glyphs" },
    ],
    tags: ["Variable Fonts", "Swiss Design", "SVG Glyphs", "Interactive Specimen"],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://helvetica.nexore.io",
  },
  {
    id: "strata-cloud",
    index: "05",
    title: "STRATA Global Mesh",
    client: "Strata Protocol",
    category: "Fintech",
    year: "2024",
    role: "Frontend Architect",
    tagline: "Decentralized edge compute observability console with interactive 3D BGP routing globes.",
    description: "Visual redesign of the edge infrastructure control plane. Allows DevOps teams to inspect any node in the global network with live latency monitoring.",
    challenge: "Monitoring 2.4 million distributed edge bare-metal nodes produced overwhelming tabular data that blinded operators to regional network partitions.",
    solution: "Translated complex geo-distributed consensus into a hierarchical orthographic globe map with localized latency clusters and instant failure failover triggers.",
    metrics: [
      { label: "Edge Nodes Managed", value: "2.4M" },
      { label: "Alarm Latency", value: "<120ms" },
      { label: "SLA Uptime", value: "99.999%" },
    ],
    tags: ["Three.js", "Edge Compute", "Observability", "Infrastructure"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://strata.nexore.io",
  },
  {
    id: "vela-audio",
    index: "06",
    title: "VELA Acoustic Studio",
    client: "Vela Hardware Corp",
    category: "Type & Craft",
    year: "2023",
    role: "Industrial & Interaction Design",
    tagline: "Physical anodized aluminum rotary console accompanied by companion Web Bluetooth DSP tuner.",
    description: "Designed both the physical industrial aesthetic and the browser-based DSP parametric equalizer companion app for high-fidelity audiophile mastering monitors.",
    challenge: "Bridging the gap between tactile physical rotary hardware knobs and instant web browser audio manipulation without Bluetooth latency delays.",
    solution: "Used Web Bluetooth API with bilateral event streaming and a customized circular rotary component featuring sub-pixel haptic vibration feedback.",
    metrics: [
      { label: "Hardware Units", value: "32,000" },
      { label: "DSP Latency", value: "1.2ms" },
      { label: "Audio Fidelity", value: "96 kHz / 24-bit" },
    ],
    tags: ["Web Bluetooth", "Hardware Design", "Web Audio API", "Industrial"],
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    liveUrl: "https://vela.nexore.io",
  },
];

const EXPERIENCES: ExperienceItem[] = [
  {
    period: "2024 - Present",
    role: "Staff Design Engineer",
    company: "Core Interface Architecture Lab",
    location: "Zurich / San Francisco",
    description: "Spearheading design engineering across developer toolchains, design token infrastructure, and interactive observability dashboards.",
    achievements: [
      "Pioneered Next.js 15 interactive streaming components and sub-millisecond latency profiler",
      "Unified design system primitives reducing bundle size by 38% across dashboard routes",
      "Mentored a team of 8 design engineers across EMEA and Americas time zones",
    ],
    skills: ["Next.js", "TypeScript", "React 19", "System Architecture", "Performance"],
  },
  {
    period: "2022 - 2024",
    role: "Principal Product Designer",
    company: "Vector Systems Studio",
    location: "Zurich, Switzerland",
    description: "Designed core workflow navigation patterns, keyboard-first interaction models, and roadmap data visualizations.",
    achievements: [
      "Led the redesign of the workflow metrics chart engine and cumulative flow diagrams",
      "Authored 60+ micro-interactions and keyboard shortcut primitives adopted platform-wide",
      "Maintained strict typographic craft standards and sub-16ms response times",
    ],
    skills: ["Interaction Design", "Keyboard UX", "Micro-animations", "Prototyping"],
  },
  {
    period: "2020 - 2022",
    role: "Design Technologist",
    company: "Spatial Interaction Laboratory",
    location: "Cupertino, CA",
    description: "Researched and prototyped multi-touch and spatial interface concepts across hardware and software.",
    achievements: [
      "Contributed to early prototype interaction models for spatial computing window management",
      "Built high-fidelity tactile haptic simulators used in user research environments",
      "Authored 3 interface interaction specifications in multi-device gesture handoff",
    ],
    skills: ["Spatial UI", "Hardware Prototyping", "C++", "Swift", "Design Research"],
  },
  {
    period: "2018 - 2020",
    role: "Interface Engineer",
    company: "Fintech Platform Engineering",
    location: "San Francisco, CA",
    description: "Built developer-facing billing dashboards, API documentation explorers, and multi-currency checkout components.",
    achievements: [
      "Developed high-performance transaction UI components and secure payment flows",
      "Architected accessible, WCAG AAA compliant form elements and focus management",
    ],
    skills: ["Design Systems", "Accessibility", "React", "Fintech", "Payment UX"],
  },
];

const CAPABILITIES: CapabilityItem[] = [
  {
    number: "01",
    title: "Design Systems & Token Architecture",
    summary: "Multi-platform token compilers, volumetric depth tokens, and calibrated spatial audio feedback triggers.",
    skills: [
      "Multi-target token generation (Figma, iOS, Web)",
      "Accessible contrast math & WCAG AAA compliance",
      "Tactile kinetic micro-interactions & haptics",
    ],
  },
  {
    number: "02",
    title: "High-Performance Web & Graphics",
    summary: "Zero-reconciliation Canvas 2D engines, custom WebGL depth buffers, and sub-millisecond latency profiling.",
    skills: [
      "Locked 120 FPS WebGL data visualization",
      "Web Audio DSP parametric tuners & Web Bluetooth",
      "Complex node graph orchestrators (DAG editors)",
    ],
  },
  {
    number: "03",
    title: "Specialized Interface Engineering",
    summary: "Decoupled institutional trading workstations, spatial window hierarchies, and autonomous agent debugging canvases.",
    skills: [
      "High-frequency institutional order books",
      "Spatial window management & volumetric depth",
      "Live token streaming & agent state rollback",
    ],
  },
];

export function NexPortfolioPreview() {
  const { config, deviceMode } = useTemplateCustomizer();

  const themeMode = config.theme ?? "dark";
  const [internalDark, setInternalDark] = useState<boolean>(themeMode === "dark");

  useEffect(() => {
    setInternalDark(themeMode === "dark");
  }, [themeMode]);

  const p = internalDark ? PALETTE.dark : PALETTE.light;
  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);

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
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 1024);
  const isDesktop = !isMobile && !isTablet;

  const brand = config.brandName || "NEXFOLIO";
  const title = config.heroTitle || "Staff design engineering for complex interfaces and systems.";
  const subtitle =
    config.heroSubtitle ||
    "Kaelen Vance operates at the intersection of Swiss typographic rigor and production-grade frontend architecture. Direct advisory and engineering execution for interface systems and spatial software.";
  const hide = config.hiddenSections || {};

  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [hoveredProject, setHoveredProject] = useState<ProjectItem | null>(null);
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const [selectedScope, setSelectedScope] = useState<string>("Design Systems");
  const [selectedBudget, setSelectedBudget] = useState<string>("$25k - $50k");
  const [inquiryName, setInquiryName] = useState<string>("");
  const [inquiryEmail, setInquiryEmail] = useState<string>("");
  const [inquiryMessage, setInquiryMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const contactEmail = "kaelen.vance@nexore.design";

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(contactEmail);
    setCopiedEmail(true);
    triggerToast(`Email copied: ${contactEmail}`);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setInquiryName("");
      setInquiryEmail("");
      setInquiryMessage("");
      triggerToast("Advisory inquiry dispatched. Response within 24 hours.");
    }, 700);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeModalProject) {
        setActiveModalProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalProject]);

  const [currentTime, setCurrentTime] = useState<string>("17:42:00 UTC+1");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/Zurich",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setCurrentTime(now.toLocaleTimeString("en-GB", options) + " UTC+1");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return PROJECTS;
    return PROJECTS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const indexTableRef = useRef<HTMLDivElement>(null);

  const handleTableMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || isTablet) return;
    const rect = indexTableRef.current?.getBoundingClientRect();
    if (rect) {
      setPointerPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const { scrollYProgress } = useScroll({ container: rootRef });
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 280, damping: 28 });
  const textSkew = useTransform(smoothVelocity, [-1, 1], [-1.2, 1.2]);

  return (
    <div
      ref={rootRef}
      className="relative w-full min-h-screen overflow-x-clip transition-colors duration-200"
      style={{
        backgroundColor: p.bg,
        color: p.text,
        fontFamily: FONT.sans,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
      />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={MOTION.spring}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 border text-xs font-medium rounded-lg flex items-center gap-2.5 shadow-2xl"
            style={{
              backgroundColor: p.surface,
              borderColor: p.line,
              color: p.text,
              fontFamily: FONT.sans,
            }}
          >
            <Check className="w-3.5 h-3.5 shrink-0" style={{ color: p.accent }} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className="border-b transition-colors duration-200"
        style={{
          borderColor: p.line,
          backgroundColor: p.surface,
          fontFamily: FONT.mono,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-semibold tracking-tight text-sm" style={{ color: p.text, fontFamily: FONT.sans }}>
              {brand}
            </span>
            <span style={{ color: p.muted }}>
              / Staff Design Engineer
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <nav className="hidden sm:flex items-center gap-5 text-xs" style={{ color: p.muted }}>
              <a href="#works" className="hover:opacity-75 transition-opacity" style={{ color: p.muted }}>
                Index
              </a>
              <a href="#capabilities" className="hover:opacity-75 transition-opacity" style={{ color: p.muted }}>
                Capabilities
              </a>
              <a href="#experience" className="hover:opacity-75 transition-opacity" style={{ color: p.muted }}>
                Experience
              </a>
              <a href="#inquiry" className="hover:opacity-75 transition-opacity" style={{ color: p.muted }}>
                Inquiry
              </a>
            </nav>

            {!isMobile && (
              <div className="flex items-center gap-1.5 tabular-nums text-xs" style={{ color: p.muted }}>
                <Clock className="w-3.5 h-3.5" />
                <span>Zurich {currentTime}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setInternalDark(!internalDark)}
              className="px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 text-xs font-medium"
              style={{
                borderColor: p.line,
                backgroundColor: p.surfaceAlt,
                color: p.text,
              }}
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {internalDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{internalDark ? "Light" : "Dark"}</span>
            </button>
          </div>
        </div>
      </header>

      {!hide["hero"] && (
        <section id="hero" className="border-b" style={{ borderColor: p.line }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
            <div className="max-w-3xl space-y-6">
              <motion.h1
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={MOTION.spring}
                className={`font-semibold tracking-tight ${
                  isMobile
                    ? "text-3xl leading-[1.14]"
                    : isTablet
                    ? "text-5xl leading-[1.08]"
                    : "text-6xl leading-[1.05]"
                }`}
                style={{
                  fontFamily: FONT.sans,
                  color: p.text,
                }}
              >
                {title}
              </motion.h1>

              <p
                className={`leading-relaxed max-w-2xl ${
                  isMobile ? "text-sm" : "text-base sm:text-lg"
                }`}
                style={{ color: p.muted }}
              >
                {subtitle}
              </p>

              <div className={`pt-2 flex ${isMobile ? "flex-col gap-3 w-full" : "flex-wrap items-center gap-3.5"}`}>
                <a
                  href="#inquiry"
                  className={`px-6 py-3 rounded-md font-medium text-xs tracking-tight transition-transform active:scale-98 text-center ${
                    isMobile ? "w-full" : ""
                  }`}
                  style={{
                    backgroundColor: p.text,
                    color: p.bg,
                    fontFamily: FONT.sans,
                  }}
                >
                  Initiate advisory inquiry
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`px-4 py-3 rounded-md border text-xs font-medium flex items-center justify-center gap-2 transition-colors hover:opacity-85 ${
                    isMobile ? "w-full" : ""
                  }`}
                  style={{
                    backgroundColor: p.surface,
                    borderColor: p.line,
                    color: p.textSecondary,
                    fontFamily: FONT.mono,
                  }}
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" style={{ color: p.accent }} /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{contactEmail}</span>
                </button>
              </div>
            </div>

            <div
              className={`mt-16 pt-8 border-t grid ${
                isMobile
                  ? "grid-cols-2 gap-4 text-xs"
                  : isTablet
                  ? "grid-cols-4 gap-6 text-xs"
                  : "grid-cols-4 gap-8 text-xs"
              }`}
              style={{ borderColor: p.line, fontFamily: FONT.mono }}
            >
              <div>
                <span className="block text-[11px] mb-1" style={{ color: p.muted }}>
                  Discipline
                </span>
                <span className="font-medium" style={{ color: p.text }}>Interface Engineering</span>
              </div>
              <div>
                <span className="block text-[11px] mb-1" style={{ color: p.muted }}>
                  Location
                </span>
                <span className="font-medium" style={{ color: p.text }}>Zurich (UTC+1) & SF</span>
              </div>
              <div>
                <span className="block text-[11px] mb-1" style={{ color: p.muted }}>
                  Core Stack
                </span>
                <span className="font-medium" style={{ color: p.text }}>TypeScript, WebGL, Swift</span>
              </div>
              <div>
                <span className="block text-[11px] mb-1" style={{ color: p.muted }}>
                  Focus
                </span>
                <span className="font-medium" style={{ color: p.text }}>Production Architecture</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {!hide["works"] && (
        <section
          id="works"
          ref={indexTableRef}
          onMouseMove={handleTableMouseMove}
          className="relative border-b"
          style={{ borderColor: p.line }}
        >
          <div
            className="border-b px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4"
            style={{
              borderColor: p.line,
              backgroundColor: p.surface,
            }}
          >
            <div>
              <h2
                className="text-xl sm:text-2xl font-semibold tracking-tight"
                style={{ fontFamily: FONT.sans, color: p.text }}
              >
                Selected Works ({filteredProjects.length})
              </h2>
            </div>

            <div className="flex items-center gap-5 sm:gap-6 overflow-x-auto no-scrollbar text-xs" style={{ fontFamily: FONT.mono }}>
              {(["All", "Design Systems", "Fintech", "Spatial & AI", "Type & Craft"] as ProjectCategory[]).map(
                (cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className="relative pb-1 transition-colors whitespace-nowrap"
                      style={{
                        color: isActive ? p.text : p.muted,
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      <span>{cat}</span>
                      {isActive && (
                        <motion.div
                          layoutId="category-underline"
                          transition={reduce ? { duration: 0 } : MOTION.snappy}
                          className="absolute bottom-0 left-0 right-0 h-[2px]"
                          style={{ backgroundColor: p.text }}
                        />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {isDesktop && hoveredProject && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute z-30 w-80 rounded-lg border overflow-hidden shadow-2xl"
              style={{
                left: pointerPos.x + 24,
                top: pointerPos.y - 100,
                borderColor: p.line,
                backgroundColor: p.surface,
              }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={MOTION.snappy}
            >
              <div className="aspect-[16/10] overflow-hidden bg-black relative">
                <img
                  src={hoveredProject.image}
                  alt={hoveredProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-xs" style={{ fontFamily: FONT.sans }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm" style={{ color: p.text }}>{hoveredProject.title}</span>
                  <span style={{ color: p.accent, fontFamily: FONT.mono }}>{hoveredProject.metrics[0].value}</span>
                </div>
                <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: p.muted }}>
                  {hoveredProject.tagline}
                </p>
                <div className="mt-2.5 pt-2 border-t flex items-center justify-between text-[11px]" style={{ borderColor: p.line, fontFamily: FONT.mono, color: p.muted }}>
                  <span>{hoveredProject.client}</span>
                  <span>{hoveredProject.year}</span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="max-w-5xl mx-auto">
            {isMobile ? (
              <div className="p-6 space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setActiveModalProject(project)}
                    className="rounded-lg border overflow-hidden cursor-pointer active:scale-98 transition-transform"
                    style={{
                      backgroundColor: p.surface,
                      borderColor: p.line,
                    }}
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-black relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-base" style={{ fontFamily: FONT.sans, color: p.text }}>
                            {project.title}
                          </h3>
                          <span className="text-xs font-semibold" style={{ color: p.accent, fontFamily: FONT.mono }}>
                            {project.metrics[0].value}
                          </span>
                        </div>
                        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: p.muted }}>
                          {project.tagline}
                        </p>
                      </div>

                      <div
                        className="w-full py-2 rounded border text-xs font-medium flex items-center justify-center gap-1.5"
                        style={{
                          backgroundColor: p.surfaceAlt,
                          borderColor: p.line,
                          color: p.text,
                          fontFamily: FONT.sans,
                        }}
                      >
                        <span>Inspect case study</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isTablet ? (
              <div className="p-6 grid grid-cols-2 gap-5">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setActiveModalProject(project)}
                    className="rounded-lg border overflow-hidden cursor-pointer hover:border-white/20 transition-all flex flex-col justify-between"
                    style={{
                      backgroundColor: p.surface,
                      borderColor: p.line,
                    }}
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-black relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-base" style={{ fontFamily: FONT.sans, color: p.text }}>
                            {project.title}
                          </h3>
                          <span className="text-xs font-semibold" style={{ color: p.accent, fontFamily: FONT.mono }}>
                            {project.metrics[0].value}
                          </span>
                        </div>
                        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: p.muted }}>
                          {project.tagline}
                        </p>
                      </div>

                      <div
                        className="w-full py-2 rounded border text-xs font-medium flex items-center justify-center gap-1.5"
                        style={{
                          backgroundColor: p.surfaceAlt,
                          borderColor: p.line,
                          color: p.text,
                          fontFamily: FONT.sans,
                        }}
                      >
                        <span>Inspect spec</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: p.line }}>
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    onMouseEnter={() => setHoveredProject(project)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onClick={() => setActiveModalProject(project)}
                    style={reduce ? {} : { skewY: textSkew }}
                    className="group relative cursor-pointer px-6 sm:px-8 py-5 flex items-center justify-between gap-6 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <div className="flex items-center gap-8 min-w-0">
                      <span
                        className="text-sm font-semibold tabular-nums w-8"
                        style={{ color: p.accent, fontFamily: FONT.mono }}
                      >
                        {project.index}
                      </span>

                      <div>
                        <div className="flex items-center gap-3">
                          <h3
                            className="text-lg font-semibold tracking-tight transition-colors group-hover:text-amber-500"
                            style={{ fontFamily: FONT.sans, color: p.text }}
                          >
                            {project.title}
                          </h3>
                          <span
                            className="text-xs font-normal"
                            style={{
                              fontFamily: FONT.mono,
                              color: p.muted,
                            }}
                          >
                            / {project.category}
                          </span>
                        </div>

                        <p className="text-xs mt-1 line-clamp-1 max-w-[55ch]" style={{ color: p.muted }}>
                          {project.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 shrink-0">
                      <div className="text-right">
                        <span
                          className="block text-xs font-semibold tabular-nums"
                          style={{ color: p.accent, fontFamily: FONT.mono }}
                        >
                          {project.metrics[0].value}
                        </span>
                        <span className="text-[11px]" style={{ color: p.muted, fontFamily: FONT.mono }}>
                          {project.metrics[0].label}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="block text-xs font-medium" style={{ color: p.textSecondary }}>{project.client}</span>
                        <span className="text-[11px]" style={{ color: p.muted, fontFamily: FONT.mono }}>
                          {project.year}
                        </span>
                      </div>

                      <div
                        className="px-3 py-1 rounded border text-xs font-medium flex items-center gap-1.5 transition-transform group-hover:translate-x-1"
                        style={{
                          borderColor: p.line,
                          backgroundColor: p.surface,
                          color: p.text,
                          fontFamily: FONT.sans,
                        }}
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section id="spotlight" className="border-b" style={{ borderColor: p.line }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2" style={{ fontFamily: FONT.sans, color: p.text }}>
              Engineering Spotlight: KRONOS Workstation
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: p.muted }}>
              Institutional trading desks require sub-millisecond market depth visualizations. Kronos decoupled streaming data processing from React component lifecycle, sustaining locked 120 FPS across 16 active feeds.
            </p>
          </div>

          <div className={`grid ${isMobile || isTablet ? "grid-cols-1 gap-6" : "grid-cols-12 gap-8 items-center"}`}>
            <div className={isMobile || isTablet ? "w-full" : "col-span-7"}>
              <div
                className="rounded-lg border overflow-hidden aspect-[16/10] bg-black relative cursor-pointer"
                style={{ borderColor: p.line }}
                onClick={() => setActiveModalProject(PROJECTS[0])}
              >
                <img
                  src="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80"
                  alt="Kronos Execution Console"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white font-mono">
                  <span>WebGL 2.0 / Dual-Buffer Canvas</span>
                  <span>120 FPS Locked</span>
                </div>
              </div>
            </div>

            <div className={isMobile || isTablet ? "w-full space-y-5" : "col-span-5 space-y-6"}>
              <div className="space-y-4">
                <div className="border-b pb-4" style={{ borderColor: p.line }}>
                  <span className="block text-xs font-semibold" style={{ color: p.accent, fontFamily: FONT.mono }}>
                    0.4ms Execution Latency
                  </span>
                  <p className="text-xs leading-relaxed mt-1" style={{ color: p.muted }}>
                    Zero-overhead memory buffers bypass garbage collection pauses during high-frequency volatility bursts.
                  </p>
                </div>

                <div className="border-b pb-4" style={{ borderColor: p.line }}>
                  <span className="block text-xs font-semibold" style={{ color: p.text, fontFamily: FONT.mono }}>
                    14,200+ Design Tokens
                  </span>
                  <p className="text-xs leading-relaxed mt-1" style={{ color: p.muted }}>
                    Unified cross-platform token pipeline powering web workstations, native desktop, and spatial operating systems.
                  </p>
                </div>

                <div>
                  <span className="block text-xs font-semibold" style={{ color: p.text, fontFamily: FONT.mono }}>
                    Multi-Agent Orchestration
                  </span>
                  <p className="text-xs leading-relaxed mt-1" style={{ color: p.muted }}>
                    Force-directed DAG graph editor for streaming token inspection and probabilistic branch rollback.
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setActiveModalProject(PROJECTS[0])}
                  className="px-5 py-2.5 rounded-md text-xs font-medium flex items-center gap-2 transition-transform active:scale-98"
                  style={{
                    backgroundColor: p.text,
                    color: p.bg,
                    fontFamily: FONT.sans,
                  }}
                >
                  <span>Open full case study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!hide["stack"] && (
        <section id="capabilities" className="border-b" style={{ borderColor: p.line }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
            <div className="max-w-2xl mb-10">
              <h2
                className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2"
                style={{ fontFamily: FONT.sans, color: p.text }}
              >
                Core Capabilities & Architecture
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: p.muted }}>
                Technical proficiencies verified across production codebases and high-throughput systems.
              </p>
            </div>

            <div
              className={`grid ${
                isMobile
                  ? "grid-cols-1 gap-4"
                  : isTablet
                  ? "grid-cols-2 gap-5"
                  : "grid-cols-3 gap-6"
              }`}
            >
              {CAPABILITIES.map((cap) => (
                <div
                  key={cap.number}
                  className="p-6 rounded-lg border flex flex-col justify-between"
                  style={{
                    backgroundColor: p.surface,
                    borderColor: p.line,
                  }}
                >
                  <div>
                    <span
                      className="text-xs font-semibold tabular-nums block mb-2"
                      style={{ color: p.accent, fontFamily: FONT.mono }}
                    >
                      SPEC {cap.number}
                    </span>

                    <h3 className="font-semibold text-base mb-2" style={{ fontFamily: FONT.sans, color: p.text }}>
                      {cap.title}
                    </h3>

                    <p className="text-xs leading-relaxed mb-4" style={{ color: p.muted }}>
                      {cap.summary}
                    </p>

                    <ul className="space-y-2 border-t pt-3 text-xs" style={{ borderColor: p.line, color: p.textSecondary }}>
                      {cap.skills.map((skill) => (
                        <li key={skill} className="flex items-start gap-2">
                          <span style={{ color: p.accent, fontFamily: FONT.mono }}>-</span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!hide["experience"] && (
        <section id="experience" className="border-b" style={{ borderColor: p.line }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
            <div className="max-w-2xl mb-12">
              <h2
                className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2"
                style={{ fontFamily: FONT.sans, color: p.text }}
              >
                Career & Impact Ledger
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: p.muted }}>
                Eight years engineering foundational user experiences across developer infrastructure, high-frequency execution desks, and consumer hardware.
              </p>
            </div>

            <div className="divide-y" style={{ borderColor: p.line }}>
              {EXPERIENCES.map((exp) => (
                <div
                  key={exp.company}
                  className={`py-8 grid ${isMobile ? "grid-cols-1 gap-3" : "grid-cols-12 gap-6 items-start"}`}
                >
                  <div className={isMobile ? "w-full" : "col-span-3 text-xs"} style={{ fontFamily: FONT.mono }}>
                    <span className="font-semibold block" style={{ color: p.text }}>{exp.period}</span>
                    <span style={{ color: p.muted }}>{exp.location}</span>
                  </div>

                  <div className={isMobile ? "w-full space-y-3" : "col-span-9 space-y-3"}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-lg font-semibold" style={{ fontFamily: FONT.sans, color: p.text }}>
                        {exp.role}
                      </h3>
                      <span className="text-xs font-semibold" style={{ color: p.accent, fontFamily: FONT.mono }}>
                        {exp.company}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed max-w-2xl" style={{ color: p.muted }}>
                      {exp.description}
                    </p>

                    <ul className="space-y-1.5 text-xs pt-1" style={{ color: p.textSecondary }}>
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span style={{ color: p.accent, fontFamily: FONT.mono }}>-</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 text-xs" style={{ fontFamily: FONT.mono, color: p.muted }}>
                      {exp.skills.map((skill, sIdx) => (
                        <span key={skill}>
                          {skill}{sIdx < exp.skills.length - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="inquiry" className="border-b" style={{ borderColor: p.line }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
          <div className={`grid ${isMobile || isTablet ? "grid-cols-1 gap-10" : "grid-cols-12 gap-12"}`}>
            <div className={isMobile || isTablet ? "w-full" : "col-span-5"}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3" style={{ fontFamily: FONT.sans, color: p.text }}>
                    Initiate Advisory
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: p.muted }}>
                    I partner with executive engineering teams, Series A through Pre-IPO founders, and boutique studios to resolve foundational frontend performance bottlenecks and strengthen interface craft.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t text-xs" style={{ borderColor: p.line, fontFamily: FONT.mono }}>
                  <div className="p-4 rounded-lg border" style={{ borderColor: p.line, backgroundColor: p.surface }}>
                    <span className="block font-semibold mb-1" style={{ color: p.text }}>
                      Direct Executive Access
                    </span>
                    <p style={{ color: p.muted }}>Zero account management overhead. Direct architecture execution and pull requests.</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ borderColor: p.line, backgroundColor: p.surface }}>
                    <span className="block font-semibold mb-1" style={{ color: p.text }}>
                      Production Deliverables
                    </span>
                    <p style={{ color: p.muted }}>Deliverables are verified pull requests, automated benchmarks, and documented token pipelines.</p>
                  </div>
                </div>

                <div className="pt-2 text-xs" style={{ fontFamily: FONT.mono }}>
                  <span className="block mb-1" style={{ color: p.muted }}>Current Capacity:</span>
                  <span className="font-semibold" style={{ color: p.accent }}>1 Direct Advisory Slot Open (Q1 2027)</span>
                </div>
              </div>
            </div>

            <div className={isMobile || isTablet ? "w-full" : "col-span-7"}>
              <div
                className="p-6 sm:p-8 rounded-lg border"
                style={{
                  backgroundColor: p.surface,
                  borderColor: p.line,
                }}
              >
                <form onSubmit={handleInquirySubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ fontFamily: FONT.mono, color: p.text }}>
                      Engagement Scope
                    </label>
                    <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-3 gap-2"}`}>
                      {["Design Systems", "High-Throughput Web", "Spatial Interface"].map((scope) => {
                        const isScope = selectedScope === scope;
                        return (
                          <button
                            key={scope}
                            type="button"
                            onClick={() => setSelectedScope(scope)}
                            className="py-2.5 px-3 rounded border text-xs font-medium text-center transition-all"
                            style={{
                              borderColor: isScope ? p.text : p.line,
                              backgroundColor: isScope ? p.surfaceAlt : "transparent",
                              color: isScope ? p.text : p.muted,
                              fontFamily: FONT.sans,
                            }}
                          >
                            {scope}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ fontFamily: FONT.mono, color: p.text }}>
                      Estimated Budget
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["$15k - $25k", "$25k - $50k", "$50k+"].map((tier) => {
                        const isTier = selectedBudget === tier;
                        return (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setSelectedBudget(tier)}
                            className="py-2.5 px-3 rounded border text-xs font-mono transition-all text-center"
                            style={{
                              borderColor: isTier ? p.text : p.line,
                              backgroundColor: isTier ? p.surfaceAlt : "transparent",
                              color: isTier ? p.text : p.muted,
                            }}
                          >
                            {tier}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`grid ${isMobile ? "grid-cols-1 gap-3.5" : "grid-cols-2 gap-4"}`}>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ fontFamily: FONT.mono, color: p.text }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="Alex Mercer"
                        className="w-full px-3.5 py-2.5 rounded border text-xs outline-none transition-colors"
                        style={{
                          backgroundColor: p.surfaceAlt,
                          borderColor: p.line,
                          color: p.text,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ fontFamily: FONT.mono, color: p.text }}>
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 rounded border text-xs outline-none transition-colors"
                        style={{
                          backgroundColor: p.surfaceAlt,
                          borderColor: p.line,
                          color: p.text,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ fontFamily: FONT.mono, color: p.text }}>
                      Project Specification
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder="Outline key architectural goals, current codebase bottlenecks, and target timeline..."
                      className="w-full px-3.5 py-2.5 rounded border text-xs outline-none transition-colors"
                      style={{
                        backgroundColor: p.surfaceAlt,
                        borderColor: p.line,
                        color: p.text,
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`py-3 rounded-md font-semibold text-xs transition-transform active:scale-98 text-center ${
                      isMobile ? "w-full" : "px-8"
                    }`}
                    style={{
                      backgroundColor: p.text,
                      color: p.bg,
                      fontFamily: FONT.sans,
                    }}
                  >
                    {isSubmitting ? "Transmitting..." : "Submit inquiry"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        className="px-6 sm:px-8 py-12"
        style={{
          backgroundColor: p.surface,
          fontFamily: FONT.mono,
        }}
      >
        <div
          className={`max-w-5xl mx-auto mb-10 ${
            isMobile
              ? "flex flex-col gap-8 text-xs"
              : isTablet
              ? "grid grid-cols-2 gap-8 text-xs"
              : "grid grid-cols-4 gap-8 text-xs"
          }`}
        >
          <div>
            <span className="block font-semibold mb-2 uppercase" style={{ color: p.accent }}>
              {brand}
            </span>
            <p className="leading-relaxed" style={{ color: p.muted }}>
              Minimalist portfolio and studio showcase designed under Swiss rationalist principles.
            </p>
          </div>

          <div>
            <span className="block font-semibold mb-2 uppercase" style={{ color: p.text }}>
              Colophon
            </span>
            <ul className="space-y-1.5" style={{ color: p.muted }}>
              <li>Typeface: Geist & Geist Mono</li>
              <li>Palette: Zinc Monochrome</li>
              <li>Engine: Next.js 15 & Framer Motion</li>
            </ul>
          </div>

          <div>
            <span className="block font-semibold mb-2 uppercase" style={{ color: p.text }}>
              Coordinates
            </span>
            <ul className="space-y-1.5" style={{ color: p.muted }}>
              <li>Zurich, Switzerland (UTC+1)</li>
              <li>San Francisco, California</li>
              <li>Clock: {currentTime}</li>
              <li>Status: Operational</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="block font-semibold uppercase" style={{ color: p.text }}>
                Theme
              </span>
              <button
                type="button"
                onClick={() => setInternalDark(!internalDark)}
                className="px-2 py-0.5 rounded border text-[11px] flex items-center gap-1.5 hover:opacity-85"
                style={{ borderColor: p.line, color: p.text }}
                aria-label="Toggle Theme in Colophon"
              >
                {internalDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                <span>{internalDark ? "Light" : "Dark"}</span>
              </button>
            </div>
            <ul className="space-y-1.5">
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline" style={{ color: p.muted }}>
                  GitHub / Source
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline" style={{ color: p.muted }}>
                  Twitter / Updates
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:underline" style={{ color: p.muted }}>
                  LinkedIn / Network
                </a>
              </li>
              <li>
                <button type="button" onClick={handleCopyEmail} className="hover:underline text-left" style={{ color: p.muted }}>
                  Direct / Email Copy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="max-w-5xl mx-auto border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]"
          style={{ borderColor: p.line, color: p.muted }}
        >
          <span>2026 KAELEN VANCE. ALL RIGHTS RESERVED.</span>
          <span>NEXOREUI PRO TEMPLATE SPECIFICATION</span>
        </div>
      </footer>

      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalProject(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 12 }}
              transition={MOTION.spring}
              className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border flex flex-col shadow-2xl"
              style={{
                backgroundColor: p.bg,
                borderColor: p.line,
                color: p.text,
              }}
            >
              <div
                className="sticky top-0 z-20 border-b px-5 py-4 flex items-center justify-between"
                style={{
                  backgroundColor: p.surface,
                  borderColor: p.line,
                  fontFamily: FONT.mono,
                }}
              >
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold" style={{ color: p.accent }}>
                    {activeModalProject.index}
                  </span>
                  <span className="font-semibold uppercase tracking-wider">{activeModalProject.title}</span>
                  <span style={{ color: p.muted }}>/</span>
                  <span style={{ color: p.muted }}>{activeModalProject.category}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalProject(null)}
                  className="p-1.5 rounded border hover:opacity-75 transition-opacity"
                  style={{ borderColor: p.line, color: p.text }}
                  aria-label="Close Case Study"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                <div className="rounded border aspect-[16/9] overflow-hidden bg-black" style={{ borderColor: p.line }}>
                  <img
                    src={activeModalProject.image}
                    alt={activeModalProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3
                    className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2"
                    style={{ fontFamily: FONT.sans, color: p.text }}
                  >
                    {activeModalProject.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: p.muted }}>
                    {activeModalProject.tagline}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-y py-4" style={{ borderColor: p.line }}>
                  {activeModalProject.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="p-3.5 rounded border text-center"
                      style={{ borderColor: p.line, backgroundColor: p.surface }}
                    >
                      <span
                        className="block text-xl font-semibold tabular-nums mb-1"
                        style={{ color: p.accent, fontFamily: FONT.mono }}
                      >
                        {m.value}
                      </span>
                      <span className="text-[11px]" style={{ color: p.muted, fontFamily: FONT.mono }}>
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed">
                  <div className="p-4 rounded border" style={{ borderColor: p.line, backgroundColor: p.surface }}>
                    <span
                      className="block text-[11px] font-semibold uppercase mb-2"
                      style={{ color: p.accent, fontFamily: FONT.mono }}
                    >
                      The Architectural Problem
                    </span>
                    <p style={{ color: p.muted }}>{activeModalProject.challenge}</p>
                  </div>

                  <div className="p-4 rounded border" style={{ borderColor: p.line, backgroundColor: p.surface }}>
                    <span
                      className="block text-[11px] font-semibold uppercase mb-2"
                      style={{ color: p.accent, fontFamily: FONT.mono }}
                    >
                      Engineered Solution
                    </span>
                    <p style={{ color: p.muted }}>{activeModalProject.solution}</p>
                  </div>
                </div>

                <div>
                  <span
                    className="block text-[11px] font-semibold uppercase mb-2"
                    style={{ fontFamily: FONT.mono, color: p.text }}
                  >
                    System Domains & Stack
                  </span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ fontFamily: FONT.mono, color: p.muted }}>
                    {activeModalProject.tags.map((t, tIdx) => (
                      <span key={t}>
                        {t}{tIdx < activeModalProject.tags.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t flex flex-wrap items-center gap-3" style={{ borderColor: p.line }}>
                  {activeModalProject.liveUrl && (
                    <a
                      href={activeModalProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded border text-xs font-semibold flex items-center gap-2"
                      style={{
                        backgroundColor: p.text,
                        color: p.bg,
                        borderColor: p.line,
                        fontFamily: FONT.sans,
                      }}
                    >
                      <span>Inspect live deployment</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveModalProject(null)}
                    className="px-4 py-2.5 rounded border text-xs font-medium"
                    style={{
                      backgroundColor: p.surface,
                      borderColor: p.line,
                      color: p.text,
                      fontFamily: FONT.sans,
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

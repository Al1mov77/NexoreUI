"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sliders,
  Sparkles,
  Download,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  Moon,
  Sun,
  Palette,
  Type,
  Layout,
  Layers,
  Check,
  Zap,
  Terminal,
  Shield,
  Compass,
  Cpu,
  Flame,
  Activity,
  Box,
  Shuffle,
  Upload,
  Trash2,
  Image as ImageIcon,
  Copy,
  Code2,
  FileCode2,
  Grid,
  CircleDot,
  Wand2,
  Eye,
  EyeOff,
  User,
  Globe,
  RefreshCw,
  BarChart3,
  Database,
  DollarSign,
} from "lucide-react";
import {
  useTemplateCustomizer,
  TEMPLATE_COLOR_PRESETS,
  FONT_OPTIONS,
  CURATED_STYLE_PRESETS,
  TemplateColorPreset,
  TemplateFontFamily,
  TemplateRadius,
  TemplateDensity,
  TemplateMotion,
  TemplateLogoIcon,
  TemplateBackgroundEffect,
  TemplateFontScale,
} from "../../context/TemplateCustomizerContext";
import { TemplateItem, isCinematicVideoTemplate } from "../../data/templates";
import { RenderTemplatePreview } from "./TemplatePreviews";
import { TemplatePreviewWrapper } from "./TemplatePreviewWrapper";
import { TemplateCodeExportModal } from "./TemplateCodeExportModal";

function getTemplateSections(id: string) {
  if (id === "template-portfolio-pro") {
    return [
      {
        id: "hero",
        title: "Hero Headline & Identity",
        description: "Minimalist intro statement, status pill, and direct email copy.",
      },
      {
        id: "works",
        title: "Selected Works Showcase",
        description: "Editorial case studies grid with live modal preview and metrics.",
      },
      {
        id: "experience",
        title: "Career & Leadership Timeline",
        description: "Chronological role progression, company tags, and key achievements.",
      },
      {
        id: "stack",
        title: "Technical Capabilities & Stack",
        description: "Official SVG tech badges across Design Craft, Engineering, and Specialized Domains.",
      },
      {
        id: "about",
        title: "Design Philosophy & Principles",
        description: "Four core rationalist tenets and architectural contrast principles.",
      },
      {
        id: "testimonials",
        title: "Client & Peer Endorsements",
        description: "Grid of executive testimonials and peer recommendations.",
      },
      {
        id: "contact",
        title: "Footer Consultation Banner",
        description: "Full-width call to action with quick conversation modal trigger.",
      },
    ];
  }
  if (id === "template-users-table-pro") {
    return [
      {
        id: "kpi",
        title: "Status Summary Cards",
        description: "KPI metric blocks counting total members, active, pending, and suspended users.",
      },
      {
        id: "filters",
        title: "Search & Filters Toolbar",
        description: "Full-text search input, status/role/department dropdowns, and view switch.",
      },
      {
        id: "pagination",
        title: "Pagination Controls",
        description: "Bottom row counter, items per page selector, and page number buttons.",
      },
    ];
  }
  if (id === "template-nexcore-admin-pro") {
    return [
      {
        id: "kpis",
        title: "Executive KPI Cards",
        description: "Top metric cards for Revenue, Orders, Visitors, Conversion, Avg. Order, and Bounce Rate.",
      },
      {
        id: "revenueChart",
        title: "Revenue Overview Chart",
        description: "Main interactive timeline chart (Bar, Line, or Area) with monthly breakdown.",
      },
      {
        id: "trafficDonut",
        title: "Traffic Sources Donut",
        description: "Segmented breakdown of Direct, Organic, Referral, and Social visitors.",
      },
      {
        id: "recentActivity",
        title: "Recent Activity Feed",
        description: "Real-time stream of member purchases, plan upgrades, and refund events.",
      },
    ];
  }
  if (id === "template-ferrari-nocturne") {
    return [
      {
        id: "hero",
        title: "Cinematic Dark Garage Hero",
        description: "Full-bleed video background, Stealth-Xenon headlight beam toggle, and audio synthesis controls.",
      },
      {
        id: "telemetry",
        title: "Kinetic Performance Telemetry",
        description: "Photon streamline animations, 1,000 CV, 2.5s 0-100, and 340+ km/h benchmark metrics.",
      },
      {
        id: "anatomy",
        title: "Spotlight Anatomy Inspection",
        description: "Interactive 4-node aerodynamic inspection: Matrix LED, CCM-R Rotors, Active Aero Halo, and Cockpit Monocoque.",
      },
      {
        id: "configurator",
        title: "Tailor Made Bespoke Atelier",
        description: "Interactive livery color, accent pinstripe, and aerodynamic package configurator with slot allocation.",
      },
      {
        id: "cliDock",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy terminal trigger.",
      },
    ];
  }
  if (id === "template-vantr-particle" || id === "template-vantr-particle-pro") {
    return [
      {
        id: "hero",
        title: "Kinetic Particle Campaign Hero",
        description: "Interactive Hooke's spring relaxation portrait with dynamic motion dispersion and brand headline.",
      },
      {
        id: "archive",
        title: "Capsule 01 Lookbook Archive",
        description: "Editorial 3-look collection grid featuring All-Weather Shell, Toric Amber Visor, and Balaclava Collar.",
      },
      {
        id: "manifesto",
        title: "Atelier Manifesto",
        description: "Editorial statement on physical protection, reduction, and Tokyo-Neuchâtel craftsmanship.",
      },
      {
        id: "register",
        title: "Private Register & Allocation",
        description: "Direct reservation access and client priority newsletter.",
      },
    ];
  }
  if (id === "template-vapor-obsidian") {
    return [
      {
        id: "hero",
        title: "Nocturne Vapor Hero Chamber",
        description: "High-fashion lookbook hero with frosted glass wipe physics and Web Audio noir drone.",
      },
      {
        id: "manifesto",
        title: "The Atelier Manifesto",
        description: "Editorial philosophy text covering cold-forged beta-titanium, cured Takiron acetate, and polarized vapor optics.",
      },
      {
        id: "archive",
        title: "Collection 01 Lookbook Archive",
        description: "Haute optical collection: Aero-Titanium Monobloc, Smoked Acetate Noir, and Dark Platinum Wire.",
      },
      {
        id: "craft",
        title: "Technical Specifications & Discipline",
        description: "Clean certified Sabae and Neuchâtel craftsmanship protocols table in pure typography.",
      },
      {
        id: "cli",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy trigger.",
      },
    ];
  }
  if (id === "template-rose-nocturne") {
    return [
      {
        id: "hero",
        title: "Cinematic Nocturne Rose Chamber",
        description: "Full-bleed video background, midnight greenhouse atmosphere audio synthesis, and dew glint controls.",
      },
      {
        id: "extraction",
        title: "Cryo-Maceration Rheology Simulator",
        description: "Interactive HTML5 canvas simulation of Damask rose oil droplet deformation, surface tension, and cryogenic refractive index.",
      },
      {
        id: "petals",
        title: "Rare Phenotype Herbarium",
        description: "Interactive botanical genotype archive: Rosa Damascena Noir, Centifolia Glaciale, and Midnight Velvet Noir.",
      },
      {
        id: "reserve",
        title: "Flacon Allocation & Wax Seal Selection",
        description: "Bespoke basalt glass flacon configurator with sealing wax stamp, volume extractor, and allocation counter.",
      },
      {
        id: "cli",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy trigger.",
      },
    ];
  }
  if (id === "template-psyche-obsidian") {
    return [
      {
        id: "hero",
        title: "Cinematic Chitin Luminescence Hero",
        description: "Full-bleed video background, nocturnal biomimetic hum audio synthesis, and luminescence spectrum mode controls.",
      },
      {
        id: "nanoscale",
        title: "Photonic Wing Scale Refraction",
        description: "Interactive HTML5 canvas simulation of structural light wave diffraction across sub-micron chitin ridges.",
      },
      {
        id: "specimens",
        title: "Nocturnal Lepidoptera Archive",
        description: "Interactive rare specimen collection: Morpho Helena Nocturne, Saturnia Obsidian Titan, and Atrophaneura Ruby Starlight.",
      },
      {
        id: "vitrine",
        title: "Hermetic Museum Vitrine Commission",
        description: "Museum-grade display case configurator with titanium alloy frame, optical quartz barrier, and inert argon purge.",
      },
      {
        id: "cli",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy trigger.",
      },
    ];
  }
  if (id === "template-vortex-apex-pro") {
    return [
      {
        id: "simulator",
        title: "Wind Tunnel CFD Simulator",
        description: "Interactive aerodynamic smoke streamline simulation on HTML5 canvas with real-time drag and downforce telemetry HUD.",
      },
      {
        id: "materials",
        title: "3-Tier Composite Materials Atlas",
        description: "Interactive composite materials layers: 12K Toray T1100G prepreg weave, venturi EPS, and Class 1 optical visor.",
      },
      {
        id: "configurator",
        title: "FIM Homologation Configurator",
        description: "Bespoke Grand Prix racing commission configurator with cheek pads, visor optics, and aero diffusers.",
      },
      {
        id: "cli",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy terminal trigger.",
      },
    ];
  }
  if (id === "template-velvet-gelato-pro") {
    return [
      {
        id: "craft",
        title: "Sub-Zero Cryo Craft Simulator",
        description: "Flash liquid nitrogen churn physics, viscosity rheology, and cryo churning dials.",
      },
      {
        id: "flavors",
        title: "Tasting Notes & Terroir Origins",
        description: "Interactive terroir cards for Bronte Pistachio, Smoked Caramel Noir, and Dark Ruby Cacao.",
      },
      {
        id: "reserve",
        title: "Private Reserve Atelier Allocations",
        description: "Batch allocation reservation builder with private tasting room slots.",
      },
      {
        id: "cli",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy terminal trigger.",
      },
    ];
  }
  if (id === "template-zenith-elixir-pro") {
    return [
      {
        id: "ritual",
        title: "Cryo-Extraction Ritual",
        description: "Interactive 3-step cryogenic cold-steep extraction ceremony with micro-chamber telemetry.",
      },
      {
        id: "cellar",
        title: "Sensory Tasting Cellar",
        description: "Interactive botanical profile inspection, terroir origins, and decanter volume allocation.",
      },
      {
        id: "cli",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy terminal trigger.",
      },
    ];
  }
  if (id === "template-aura-nocturne-pro") {
    return [
      {
        id: "alchemy",
        title: "The Alchemical Extraction",
        description: "Supercritical CO2 extraction process, French Limousin oak cask aging, and flacon sealing.",
      },
      {
        id: "vitrine",
        title: "Haute Parfumerie Vitrine",
        description: "Interactive olfactive notes pyramid, sillage radar, and flacon crystal showcase.",
      },
      {
        id: "reserve",
        title: "Private Flacon Allocation",
        description: "Hand-numbered crystal flacon bottle allocation reservation builder.",
      },
      {
        id: "cli",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy terminal trigger.",
      },
    ];
  }
  if (id === "template-aura-obsidian-pro") {
    return [
      {
        id: "alchemy",
        title: "Phyto-Cryo Botanical Alchemy",
        description: "Biophotonic cold-press extraction metrics, lipid barrier restoration, and cell plump telemetry.",
      },
      {
        id: "botanicals",
        title: "Bio-Identical Lipid Nectars",
        description: "Wild Marula, Gold Camellia, and Black Truffle botanical lipid nectar formulas.",
      },
      {
        id: "reserve",
        title: "Apothecary Nectar Allocation",
        description: "Bespoke apothecary bottle allocation and private reserve order builder.",
      },
      {
        id: "cli",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy terminal trigger.",
      },
    ];
  }
  if (id === "template-levitas-cryo-pro") {
    return [
      {
        id: "acoustic",
        title: "Ultrasonic Acoustic Field",
        description: "Interactive 28.4 kHz soundwave visualizer canvas and cryogenic dry-ice vapor nodal traps.",
      },
      {
        id: "spheres",
        title: "Curated Cryo-Spheres Tasting",
        description: "Kurogoma Obsidian, Tartufo Bianco, and Crimson Ruby Fig acoustic levitation specs.",
      },
      {
        id: "omakase",
        title: "12-Seat Sub-Zero Omakase Flight",
        description: "Private acoustic culinary atelier session booking and seat allocation selector.",
      },
      {
        id: "cli",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy terminal trigger.",
      },
    ];
  }
  if (id === "template-monolith-cacao-pro") {
    return [
      {
        id: "process",
        title: "Glaze Pour & Chiaroscuro Raytracing",
        description: "Sticky scroll-driven glaze pour with real-time polyhedral facet normal calculation.",
      },
      {
        id: "facet",
        title: "Mirror Glaze Surface Close-Up",
        description: "Cursor-lit material detail revealing Form V beta crystalline structure.",
      },
      {
        id: "editions",
        title: "Three Geometric Cuts",
        description: "Single-origin editions presented on 3D perspective tilt cards with weight selector.",
      },
      {
        id: "order",
        title: "Direct Reservation Card",
        description: "Order summary with climate-controlled delivery notes and magnetic action button.",
      },
    ];
  }
  if (id === "template-aerovoid-obsidian-pro") {
    return [
      {
        id: "canvas",
        title: "Sessile Droplet & Aerodynamics",
        description: "Interactive contact angle physics on HTML5 canvas with dynamic wind speed slider.",
      },
      {
        id: "layers",
        title: "4-Layer Nanomembrane Stack",
        description: "DWR lotus architecture, graphene ripstop, goose down baffles, and aerogel cold-bridge map.",
      },
      {
        id: "allocation",
        title: "Expedition Parka Reservation",
        description: "Extreme cold weather expedition parka allocation builder with size and shell customizer.",
      },
      {
        id: "cli",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy terminal trigger.",
      },
    ];
  }
  if (id === "template-amarena-royale-pro") {
    return [
      {
        id: "viscometer",
        title: "Chantilly & Coulis Viscometer",
        description: "Live physics canvas with mascarpone chantilly viscosity, coulis brix, and gold leaf caustics.",
      },
      {
        id: "creations",
        title: "Haute Confectionery Archive",
        description: "Interactive tasting archive for Amarena Royale, Chantilly d'Or, and Noir Absolu 80%.",
      },
      {
        id: "reservation",
        title: "Private Haute Atelier Flight",
        description: "Bespoke confection allocation reservation with luxury gift presentation case.",
      },
      {
        id: "cli",
        title: "Next.js CLI Installation Dock",
        description: "Terminal installation command box and quick-copy terminal trigger.",
      },
    ];
  }
  return [
    {
      id: "simulator",
      title: "Interactive Telemetry / Simulation",
      description: "Live 3D or canvas telemetry visualization engine.",
    },
    {
      id: "features",
      title: "Architecture Features",
      description: "Interactive feature showcase and technical specifications.",
    },
    {
      id: "configurator",
      title: "Bespoke Configurator",
      description: "Interactive configuration and commission builder.",
    },
    {
      id: "cli",
      title: "Next.js CLI Installation Dock",
      description: "Terminal command installer and quick-copy dock.",
    },
  ];
}

interface TemplateCustomizerStudioProps {
  template: TemplateItem;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateCustomizerStudio({
  template,
  isOpen,
  onClose,
}: TemplateCustomizerStudioProps) {
  const {
    config,
    updateConfig,
    setColorPreset,
    setCustomPrimaryColor,
    setCustomLogoUrl,
    removeCustomLogo,
    applyStylePreset,
    randomizeConfig,
    exportConfigJson,
    importConfigJson,
    resetToTemplateDefaults,
    deviceMode,
    setDeviceMode,
  } = useTemplateCustomizer();

  const isCinematic = isCinematicVideoTemplate(template.id);
  const [activeSection, setActiveSection] = useState<
    | "brand"
    | "presets"
    | "colors"
    | "typography"
    | "layout"
    | "appearance"
    | "copywriting"
    | "sections"
    | "portfolio"
    | "stack"
    | "api"
    | "charts"
  >(
    template.id === "template-portfolio-pro"
      ? "portfolio"
      : template.id === "template-users-table-pro"
      ? "api"
      : template.id === "template-nexcore-admin-pro"
      ? "brand"
      : "brand"
  );
  const [logoMode, setLogoMode] = useState<"preset" | "custom">(config.customLogoUrl ? "custom" : "preset");
  const [customLogoUrlInput, setCustomLogoUrlInput] = useState(config.customLogoUrl || "");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [customHexInput, setCustomHexInput] = useState(config.colors.primary);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Users Table Swagger / REST API & Mock Data State
  const [apiUrlInput, setApiUrlInput] = useState(config.swaggerApiUrl || "https://dummyjson.com/users");
  const [isFetchingApi, setIsFetchingApi] = useState(false);
  const [apiSyncStatus, setApiSyncStatus] = useState<string | null>(null);
  const [customJsonInput, setCustomJsonInput] = useState(
    config.customUsersData ? JSON.stringify(config.customUsersData, null, 2) : ""
  );

  const handleSyncApi = async (urlToFetch?: string) => {
    const targetUrl = urlToFetch || apiUrlInput;
    if (!targetUrl.trim()) return;
    setIsFetchingApi(true);
    setApiSyncStatus(null);
    try {
      const res = await fetch(targetUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : data.users || data.items || data.data || [];
      if (!rawList || rawList.length === 0) {
        throw new Error("No array of users found in API response");
      }
      const mapped = rawList.map((u: any, idx: number) => ({
        id: u.id ? String(u.id) : `api-${idx + 1}`,
        name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Enterprise Member",
        email: u.email || `user${idx + 1}@example.com`,
        avatar: u.image || u.avatar || `https://images.unsplash.com/photo-${1534528741775 + idx}?auto=format&fit=crop&w=200&q=80`,
        role: u.role || u.company?.title || (idx % 3 === 0 ? "Staff Engineer" : idx % 2 === 0 ? "Product Designer" : "Fullstack Developer"),
        department: u.department || u.company?.department || (idx % 2 === 0 ? "Engineering" : "Design"),
        status: (u.status === "active" || u.status === "invited" || u.status === "suspended") ? u.status : (idx % 4 === 0 ? "invited" : "active"),
        lastActive: "Just now",
        joinedDate: "2026",
        twoFactorEnabled: Boolean(u.twoFactorEnabled ?? true),
        location: u.address?.city || u.location || "San Francisco",
        projectsCount: Number(u.projectsCount || ((idx * 3) % 12) + 2),
      }));
      updateConfig({
        swaggerApiUrl: targetUrl,
        customUsersData: mapped,
      });
      setCustomJsonInput(JSON.stringify(mapped, null, 2));
      setApiSyncStatus(`Success! Synced ${mapped.length} live users from ${targetUrl}`);
    } catch (err: any) {
      setApiSyncStatus(`Error: ${err.message || "Failed to fetch"}. Check URL or CORS.`);
    } finally {
      setIsFetchingApi(false);
    }
  };

  if (!isOpen) return null;

  const isDark = config.theme === "dark";

  const logoOptions: { id: TemplateLogoIcon; label: string; icon: any }[] = [
    { id: "sparkles", label: "Sparkles", icon: Sparkles },
    { id: "zap", label: "Zap", icon: Zap },
    { id: "box", label: "Box", icon: Box },
    { id: "terminal", label: "Terminal", icon: Terminal },
    { id: "shield", label: "Shield", icon: Shield },
    { id: "compass", label: "Compass", icon: Compass },
    { id: "layers", label: "Layers", icon: Layers },
    { id: "cpu", label: "CPU", icon: Cpu },
    { id: "flame", label: "Flame", icon: Flame },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Image size should be less than 3MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomLogoUrl(dataUrl);
        setCustomLogoUrlInput(dataUrl);
        setLogoMode("custom");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setCustomLogoUrl(dataUrl);
          setCustomLogoUrlInput(dataUrl);
          setLogoMode("custom");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportConfigJson());
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
      {/* Studio Top Navigation Bar */}
      <header className="h-14 border-b border-white/10 px-4 flex items-center justify-between bg-zinc-950/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Customizer Studio"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight">{template.title}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
              CUSTOMIZER STUDIO
            </span>
          </div>
        </div>

        {/* Viewport switchers & quick actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* 🎲 Instant Randomizer Button */}
          <button
            onClick={randomizeConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-purple-200 hover:text-white hover:border-purple-400 text-xs font-semibold shadow-xs transition-all"
            title="Randomize & Shuffle Palette, Typography, and Radius"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Shuffle Theme</span>
          </button>

          {/* Viewport switchers */}
          <div className="flex items-center p-1 rounded-lg bg-zinc-900 border border-white/10 text-xs">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                deviceMode === "desktop" ? "bg-white/15 text-white font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode("tablet")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                deviceMode === "tablet" ? "bg-white/15 text-white font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                deviceMode === "mobile" ? "bg-white/15 text-white font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          <button
            onClick={() => updateConfig({ theme: isDark ? "light" : "dark" })}
            className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-indigo-400" />}
          </button>

          <button
            onClick={() => resetToTemplateDefaults(template.id, template.title)}
            className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Reset to Template Defaults"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Action Button: Export Code */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyJson}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-zinc-900 text-xs text-zinc-300 hover:text-white transition-colors"
            title="Copy theme configuration JSON"
          >
            {copiedConfig ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedConfig ? "Copied JSON" : "Copy Config"}</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md transition-all hover:brightness-110 flex items-center gap-1.5"
            style={{ backgroundColor: config.colors.primary }}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Get Customized Code</span>
          </button>
        </div>
      </header>

      {/* Main Studio Dual-Pane Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Pane: Customization Controls (width: ~380px) */}
        <aside className="w-full md:w-84 lg:w-[410px] border-b md:border-b-0 md:border-r border-white/10 bg-zinc-950 p-4 sm:p-5 overflow-y-auto no-scrollbar shrink-0 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Section Tabs */}
            {template.id === "template-portfolio-pro" ? (
              <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-inner text-xs">
                {[
                  { id: "portfolio", label: "Profile", icon: User },
                  { id: "stack", label: "Stack", icon: Layers },
                  { id: "sections", label: "Sections", icon: Layout },
                  { id: "appearance", label: "Style", icon: Palette },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id as any)}
                    className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                      activeSection === s.id
                        ? "bg-white/15 text-white font-bold shadow-md border border-white/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <s.icon className={`h-4 w-4 ${activeSection === s.id ? "text-indigo-400" : "text-zinc-400"}`} />
                    <span className="text-[11px] font-semibold tracking-tight">{s.label}</span>
                  </button>
                ))}
              </div>
            ) : template.id === "template-users-table-pro" ? (
              <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-inner text-xs">
                {[
                  { id: "sections", label: "Sections", icon: Layout },
                  { id: "appearance", label: "Style", icon: Palette },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id as any)}
                    className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                      activeSection === s.id
                        ? "bg-white/15 text-white font-bold shadow-md border border-white/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <s.icon className={`h-4 w-4 ${activeSection === s.id ? "text-indigo-400" : "text-zinc-400"}`} />
                    <span className="text-[11px] font-semibold tracking-tight">{s.label}</span>
                  </button>
                ))}
              </div>
            ) : template.id === "template-nexcore-admin-pro" ? (
              <div className="grid grid-cols-5 gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-inner text-xs">
                {[
                  { id: "brand", label: "Workspace", icon: Sparkles },
                  { id: "charts", label: "Charts", icon: BarChart3 },
                  { id: "sections", label: "Sections", icon: Layout },
                  { id: "typography", label: "Fonts", icon: Type },
                  { id: "appearance", label: "Style", icon: Palette },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id as any)}
                    className={`flex flex-col items-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
                      activeSection === s.id
                        ? "bg-white/15 text-white font-bold shadow-md border border-white/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <s.icon className={`h-4 w-4 ${activeSection === s.id ? "text-indigo-400" : "text-zinc-400"}`} />
                    <span className="text-[10px] font-semibold tracking-tight">{s.label}</span>
                  </button>
                ))}
              </div>
            ) : isCinematic ? (
              <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-inner text-xs">
                {[
                  { id: "brand", label: "Brand", icon: Sparkles },
                  { id: "copywriting", label: "Copy", icon: Type },
                  { id: "sections", label: "Sections", icon: Layout },
                  { id: "appearance", label: "Theme", icon: Sun },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id as any)}
                    className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                      activeSection === s.id
                        ? "bg-white/15 text-white font-bold shadow-md border border-white/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <s.icon className={`h-4 w-4 ${activeSection === s.id ? "text-indigo-400" : "text-zinc-400"}`} />
                    <span className="text-[11px] font-semibold tracking-tight">{s.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl shadow-inner text-xs">
                {[
                  { id: "brand", label: "Brand", icon: Sparkles },
                  { id: "presets", label: "Presets", icon: Wand2 },
                  { id: "colors", label: "Colors", icon: Palette },
                  { id: "typography", label: "Fonts", icon: Type },
                  { id: "layout", label: "Layout", icon: Layout },
                  { id: "appearance", label: "Theme", icon: Sun },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id as any)}
                    className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all cursor-pointer ${
                      activeSection === s.id
                        ? "bg-white/15 text-white font-bold shadow-md border border-white/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <s.icon className={`h-3.5 w-3.5 ${activeSection === s.id ? "text-indigo-400" : "text-zinc-400"}`} />
                    <span className="text-[10px] font-semibold tracking-tight">{s.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* ─── SPECIALIZED PANEL: NEXFOLIO PORTFOLIO ─────────────────────────── */}
            {activeSection === "portfolio" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-3.5 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md text-xs text-zinc-300 shadow-sm">
                  <span className="font-semibold text-white">Profile & Identity:</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Customize your name, role, avatar, timezone, and contact email.
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight">Full Name</label>
                  <input
                    type="text"
                    value={config.brandName || "Kaelen Vance"}
                    onChange={(e) => updateConfig({ brandName: e.target.value })}
                    placeholder="e.g. Elena Rostova / Alex Rivera"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                </div>

                {/* Role / Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight">Professional Role</label>
                  <input
                    type="text"
                    value={config.brandTagline || "Principal Design Eng"}
                    onChange={(e) => updateConfig({ brandTagline: e.target.value })}
                    placeholder="e.g. Staff Design Engineer / Founder"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                </div>

                {/* Avatar URL & Upload */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-200 tracking-tight">Avatar Image</label>
                    {config.customLogoUrl && (
                      <button
                        onClick={() => updateConfig({ customLogoUrl: "" })}
                        className="text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 transition-colors cursor-pointer"
                      >
                        Reset Avatar
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={config.customLogoUrl || ""}
                    onChange={(e) => updateConfig({ customLogoUrl: e.target.value })}
                    placeholder="Paste image URL (Unsplash, GitHub, CDN...)"
                    className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono text-[11px]"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Avatar</span>
                    </button>
                    {/* Quick Avatar Presets */}
                    <div className="flex items-center gap-1">
                      {[
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
                      ].map((avUrl, i) => (
                        <img
                          key={i}
                          src={avUrl}
                          alt="Preset avatar"
                          onClick={() => updateConfig({ customLogoUrl: avUrl })}
                          className={`h-8 w-8 rounded-full object-cover cursor-pointer border-2 transition-all hover:scale-110 shadow-sm ${
                            config.customLogoUrl === avUrl ? "border-indigo-500 ring-2 ring-indigo-500/40" : "border-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location / Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight">Timezone & Location Note</label>
                  <input
                    type="text"
                    value={config.portfolioConfig?.location || "Zurich • Open for Q4/Q1 Advisory"}
                    onChange={(e) =>
                      updateConfig({
                        portfolioConfig: {
                          ...config.portfolioConfig,
                          location: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. San Francisco • Booking Q1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                </div>

                {/* Contact Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight">Direct Contact Email</label>
                  <input
                    type="email"
                    value={config.portfolioConfig?.email || "kaelen.vance@nexore.design"}
                    onChange={(e) =>
                      updateConfig({
                        portfolioConfig: {
                          ...config.portfolioConfig,
                          email: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. yourname@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                </div>

                {/* Hero Headline */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight">Hero Headline</label>
                  <textarea
                    rows={2}
                    value={config.heroTitle || "Crafting high-precision interfaces for visionary engineering teams."}
                    onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium resize-none"
                  />
                </div>

                {/* Hero Bio */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight">Bio / Operating Tenet</label>
                  <textarea
                    rows={3}
                    value={
                      config.heroSubtitle ||
                      "I partner with founders and product teams to bridge the chasm between Swiss rationalist design and zero-compromise frontend engineering. Currently Staff Design Engineer at Vercel."
                    }
                    onChange={(e) => updateConfig({ heroSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* ─── SPECIALIZED PANEL: NEXFOLIO STACK ─────────────────────────────── */}
            {activeSection === "stack" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-3.5 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md text-xs text-zinc-300 shadow-sm">
                  <span className="font-semibold text-white">Technical Arsenal Badges:</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Official SVG logos rendered natively in both Light & Dark modes.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "React 19 & Next.js 15", category: "Engineering", experience: "7 yrs" },
                    { name: "TypeScript & Strict SDKs", category: "Engineering", experience: "8 yrs" },
                    { name: "Canvas 2D & WebGL Shaders", category: "Engineering", experience: "5 yrs" },
                    { name: "TailwindCSS & CSS Tokens", category: "Engineering", experience: "6 yrs" },
                    { name: "Figma Token Pipelines", category: "Design Systems", experience: "8 yrs" },
                    { name: "Framer Motion & Spring Physics", category: "Design Systems", experience: "9 yrs" },
                    { name: "Swiss Typography & Grid", category: "Design Systems", experience: "10 yrs" },
                    { name: "Spatial UI (visionOS / RealityKit)", category: "Specialized", experience: "3 yrs" },
                    { name: "High-Frequency Fintech Cockpits", category: "Specialized", experience: "4 yrs" },
                    { name: "LLM Agent Graph Orchestration", category: "Specialized", experience: "2 yrs" },
                  ].map((tech) => (
                    <div
                      key={tech.name}
                      className="p-3 rounded-2xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-900/90 flex items-center justify-between text-xs transition-all shadow-sm"
                    >
                      <div>
                        <span className="font-semibold text-white block text-[11px]">{tech.name}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{tech.category}</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        {tech.experience}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}








            {/* ─── SPECIALIZED PANEL: NEXCORE ADMIN CHARTS & TELEMETRY ──────────── */}
            {activeSection === "charts" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-3 rounded-xl border border-white/10 bg-zinc-900/60 text-xs text-zinc-300">
                  <span className="font-semibold text-white">Charts & Metric Visualizations:</span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Select how revenue, conversions, and telemetry data are rendered in the dashboard.
                  </p>
                </div>

                {/* Chart Type */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 mb-2">Revenue Chart Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "bar" as const, label: "Bar Chart", icon: BarChart3 },
                      { id: "line" as const, label: "Line Curve", icon: Activity },
                      { id: "area" as const, label: "Area Gradient", icon: Layout },
                    ].map((chart) => {
                      const isActive = (config.adminConfig?.chartType || "bar") === chart.id;
                      return (
                        <button
                          key={chart.id}
                          onClick={() =>
                            updateConfig({
                              adminConfig: {
                                ...config.adminConfig,
                                chartType: chart.id,
                              },
                            })
                          }
                          className={`p-2.5 rounded-xl border text-xs flex flex-col items-center gap-1.5 transition-all ${
                            isActive
                              ? "bg-white/15 border-white text-white font-bold shadow-sm"
                              : "border-white/10 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <chart.icon className="h-4 w-4" />
                          <span className="text-[11px]">{chart.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Currency Symbol */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 mb-2">Workspace Currency</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { sym: "$", label: "USD" },
                      { sym: "€", label: "EUR" },
                      { sym: "£", label: "GBP" },
                      { sym: "¥", label: "JPY" },
                      { sym: "₹", label: "INR" },
                    ].map((c) => {
                      const isActive = (config.adminConfig?.currency || "$") === c.sym;
                      return (
                        <button
                          key={c.sym}
                          onClick={() =>
                            updateConfig({
                              adminConfig: {
                                ...config.adminConfig,
                                currency: c.sym,
                              },
                            })
                          }
                          className={`py-2 rounded-xl border text-center transition-all ${
                            isActive
                              ? "bg-white/15 border-white text-white font-bold"
                              : "border-white/10 text-zinc-400 hover:text-white"
                          }`}
                        >
                          <span className="text-sm font-bold block">{c.sym}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 1. Brand & Logo Controls (Featuring Custom Logo / Avatar Upload & Scaling) */}
            {activeSection === "brand" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {/* Logo Visibility Switch */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md shadow-sm transition-all hover:border-white/15">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white tracking-tight">Show Brand Logo / Avatar</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-300">HEADER</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">Toggle display of logo badge in navigation bar</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateConfig({ showLogo: config.showLogo === false ? true : false })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      config.showLogo !== false ? "bg-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.5)]" : "bg-zinc-800 border border-white/10"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                        config.showLogo !== false ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Brand / Company Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-200 tracking-tight">
                      Brand / Company Name
                    </label>
                    {config.brandName && (
                      <button
                        onClick={() => updateConfig({ brandName: "" })}
                        className="text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 transition-colors cursor-pointer"
                      >
                        Reset to template
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={config.brandName}
                    onChange={(e) => updateConfig({ brandName: e.target.value })}
                    placeholder={template.title}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Updates headers, cards, and titles across the template.
                  </p>
                </div>

                {/* Brand Tagline */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-200 tracking-tight">
                      Brand Tagline / Subtitle
                    </label>
                    {config.brandTagline && (
                      <button
                        onClick={() => updateConfig({ brandTagline: "" })}
                        className="text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={config.brandTagline || ""}
                    onChange={(e) => updateConfig({ brandTagline: e.target.value })}
                    placeholder="e.g. Next-Gen Intelligent Infrastructure"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                </div>

                {/* Logo & Icon Selection: Preset vs Custom Upload */}
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-200 tracking-tight">
                      Logo & Brand Icon
                    </label>
                    <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-white/10 text-xs">
                      <button
                        onClick={() => setLogoMode("preset")}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          logoMode === "preset"
                            ? "bg-white/20 text-white font-bold shadow-sm border border-white/20"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Presets
                      </button>
                      <button
                        onClick={() => setLogoMode("custom")}
                        className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          logoMode === "custom"
                            ? "bg-indigo-600 text-white font-bold shadow-sm"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Custom</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode A: Preset Glyph Icons */}
                  {logoMode === "preset" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-5 gap-2">
                        {logoOptions.map((opt) => {
                          const isSelected = !config.customLogoUrl && config.logoIcon === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => {
                                removeCustomLogo();
                                updateConfig({ logoIcon: opt.id });
                              }}
                              title={opt.label}
                              className={`h-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                                isSelected
                                  ? "bg-white text-zinc-950 border-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)] ring-2 ring-white/30 scale-105"
                                  : "bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white hover:border-white/25 hover:bg-zinc-800/80 shadow-sm"
                              }`}
                            >
                              <opt.icon className="w-4 h-4" />
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Choose from 10 crisp vector glyphs, or click "Upload Custom" to upload your own icon or avatar.
                      </p>
                    </div>
                  )}

                  {/* Mode B: Custom Logo / Avatar Upload */}
                  {logoMode === "custom" && (
                    <div className="space-y-3">
                      {/* Active Custom Logo Box */}
                      {config.customLogoUrl ? (
                        <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/5 space-y-3.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-xs font-semibold text-white">Custom Logo Active</span>
                            </div>
                            <button
                              onClick={() => {
                                removeCustomLogo();
                                setCustomLogoUrlInput("");
                              }}
                              className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-medium px-2 py-0.5 rounded-md hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>

                          {/* Live Avatar & Badge Rendering Preview */}
                          <div className="p-3 rounded-xl bg-zinc-900/90 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-zinc-300">Live Header Badge Preview</span>
                              <span className="text-[10px] font-mono text-indigo-400">
                                {config.logoFit === "contain" ? "Contain (Emblem)" : "Cover (Full Fill Avatar)"}
                              </span>
                            </div>

                            <div className="flex items-center gap-4">
                              {/* Circular Avatar Preview */}
                              <div className="text-center space-y-1">
                                <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center mx-auto overflow-hidden shadow-md">
                                  <img
                                    src={config.customLogoUrl}
                                    alt="Avatar Circle Preview"
                                    className={`w-full h-full ${
                                      config.logoFit === "contain" ? "object-contain p-1.5" : "object-cover"
                                    }`}
                                    style={{
                                      transform: config.logoScale && config.logoScale !== 1 ? `scale(${config.logoScale})` : undefined,
                                    }}
                                  />
                                </div>
                                <span className="text-[10px] font-mono text-zinc-400">Circle Avatar</span>
                              </div>

                              {/* Squircle Badge Preview */}
                              <div className="text-center space-y-1">
                                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/20 flex items-center justify-center mx-auto overflow-hidden shadow-md">
                                  <img
                                    src={config.customLogoUrl}
                                    alt="Squircle Badge Preview"
                                    className={`w-full h-full ${
                                      config.logoFit === "contain" ? "object-contain p-1.5" : "object-cover"
                                    }`}
                                    style={{
                                      transform: config.logoScale && config.logoScale !== 1 ? `scale(${config.logoScale})` : undefined,
                                    }}
                                  />
                                </div>
                                <span className="text-[10px] font-mono text-zinc-400">Squircle Badge</span>
                              </div>

                              <div className="flex-1 text-left border-l border-white/10 pl-3 space-y-1">
                                <p className="text-[11px] font-medium text-zinc-200">Edge-to-Edge Fill</p>
                                <p className="text-[9px] text-zinc-400 leading-tight">
                                  Your avatar automatically fills the badge without tiny squishing or awkward margins.
                                </p>
                              </div>
                            </div>

                            {/* Fit Mode Toggle: Cover vs Contain */}
                            <div className="pt-2 border-t border-white/10 space-y-1.5">
                              <label className="text-[11px] font-medium text-zinc-300">Avatar / Logo Scaling Mode</label>
                              <div className="grid grid-cols-2 gap-1.5 p-0.5 rounded-lg bg-zinc-950 border border-white/10 text-xs">
                                <button
                                  type="button"
                                  onClick={() => updateConfig({ logoFit: "cover" })}
                                  className={`py-1.5 px-2 rounded-md font-medium text-[11px] transition-all ${
                                    (config.logoFit ?? "cover") === "cover"
                                      ? "bg-indigo-600 text-white shadow-xs font-semibold"
                                      : "text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  Cover (Full Fill / Avatar)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateConfig({ logoFit: "contain" })}
                                  className={`py-1.5 px-2 rounded-md font-medium text-[11px] transition-all ${
                                    config.logoFit === "contain"
                                      ? "bg-indigo-600 text-white shadow-xs font-semibold"
                                      : "text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  Contain (Icon / Emblem)
                                </button>
                              </div>
                            </div>

                            {/* Scale / Zoom Slider */}
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-zinc-300 font-medium">Avatar Zoom / Scale</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-indigo-400 text-[10px]">
                                    {Math.round((config.logoScale ?? 1) * 100)}%
                                  </span>
                                  {config.logoScale && config.logoScale !== 1 && (
                                    <button
                                      type="button"
                                      onClick={() => updateConfig({ logoScale: 1 })}
                                      className="text-[10px] text-zinc-500 hover:text-zinc-300"
                                    >
                                      Reset
                                    </button>
                                  )}
                                </div>
                              </div>
                              <input
                                type="range"
                                min={0.6}
                                max={1.6}
                                step={0.05}
                                value={config.logoScale ?? 1}
                                onChange={(e) => updateConfig({ logoScale: parseFloat(e.target.value) })}
                                className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {/* Dropzone File Upload */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                          isDragging
                            ? "border-indigo-400 bg-indigo-500/10"
                            : "border-white/15 hover:border-white/30 bg-zinc-900/60 hover:bg-zinc-900"
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="p-2 rounded-lg bg-white/10 text-indigo-400">
                            <Upload className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-medium text-zinc-200">
                            Click to browse or drop avatar / logo here
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            Supports SVG, PNG, WebP, JPG (auto-filled edge-to-edge)
                          </p>
                        </div>
                      </div>

                      {/* Remote URL input */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400">Or enter an image URL:</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="url"
                            placeholder="https://.../avatar.png"
                            value={customLogoUrlInput}
                            onChange={(e) => setCustomLogoUrlInput(e.target.value)}
                            className="w-full p-2 rounded-lg border border-white/10 bg-zinc-900 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                          />
                          <button
                            onClick={() => {
                              if (customLogoUrlInput.trim()) {
                                setCustomLogoUrl(customLogoUrlInput.trim());
                              }
                            }}
                            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-medium transition-colors shrink-0"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Cinematic Section: Copywriting & Headlines */}
            {isCinematic && activeSection === "copywriting" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-3.5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 text-xs text-zinc-300 shadow-sm">
                  <span className="font-semibold text-white">Live Hero & Cinematic Typography:</span>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Directly updates the main hero title, subtitle, and primary call-to-action button across this cinematic template.
                  </p>
                </div>

                {/* Main Hero Headline */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-200 tracking-tight">Main Hero Title</label>
                    {config.heroTitle && (
                      <button
                        onClick={() => updateConfig({ heroTitle: "" })}
                        className="text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 transition-colors cursor-pointer"
                      >
                        Reset to default
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={config.heroTitle || ""}
                    onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                    placeholder={template.title}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                  <p className="text-[10px] text-zinc-500 font-mono">
                    Rendered with optical blur and scroll-reactive physics in the hero viewport.
                  </p>
                </div>

                {/* Hero Subtitle / Tagline */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-200 tracking-tight">Hero Subtitle / Description</label>
                    {config.heroSubtitle && (
                      <button
                        onClick={() => updateConfig({ heroSubtitle: "" })}
                        className="text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 transition-colors cursor-pointer"
                      >
                        Reset to default
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={config.heroSubtitle || ""}
                    onChange={(e) => updateConfig({ heroSubtitle: e.target.value })}
                    placeholder={template.subtitle}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium resize-none"
                  />
                </div>

                {/* Call-to-Action (CTA) Button Text */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-200 tracking-tight">Primary CTA Button</label>
                    {config.ctaText && (
                      <button
                        onClick={() => updateConfig({ ctaText: "" })}
                        className="text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={config.ctaText || ""}
                    onChange={(e) => updateConfig({ ctaText: e.target.value })}
                    placeholder="e.g. Request Commission / Reserve / Explore"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md text-xs text-white placeholder:text-zinc-500 shadow-inner focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                </div>
              </motion.div>
            )}

            {/* Section & Module Visibility Toggles */}
            {activeSection === "sections" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-3.5 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md text-xs text-zinc-300 shadow-sm">
                  <span className="font-semibold text-white">Section & Module Visibility:</span>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Toggle individual modules and interactive stages on or off. Hidden sections are dynamically removed from view.
                  </p>
                </div>

                <div className="space-y-2">
                  {getTemplateSections(template.id).map((sec) => {
                    const isHidden = Boolean(config.hiddenSections?.[sec.id]);
                    return (
                      <div
                        key={sec.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isHidden
                            ? "border-red-500/20 bg-red-500/5 opacity-60"
                            : "border-white/10 bg-zinc-900/70 hover:border-white/20 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              {isHidden ? (
                                <EyeOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
                              ) : (
                                <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              )}
                              <span className={`text-xs font-semibold ${isHidden ? "text-zinc-400 line-through" : "text-white"}`}>
                                {sec.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                              {sec.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              updateConfig({
                                hiddenSections: {
                                  ...config.hiddenSections,
                                  [sec.id]: !isHidden,
                                },
                              });
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                              isHidden
                                ? "bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30"
                                : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30"
                            }`}
                          >
                            {isHidden ? "Hidden" : "Visible"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 2. Curated Style Presets & Randomizer */}
            {activeSection === "presets" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight mb-1">
                    One-Click Style Presets
                  </label>
                  <p className="text-[11px] text-zinc-400 mb-3">
                    Instantly transform the entire design with harmonized color palettes, typography, and corner styling.
                  </p>

                  <div className="space-y-2">
                    {CURATED_STYLE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyStylePreset(preset.id)}
                        className="w-full p-3.5 rounded-2xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-900 hover:border-white/20 text-left transition-all flex items-center justify-between group cursor-pointer shadow-sm"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {preset.name}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-tight">
                            {preset.tagline}
                          </p>
                        </div>
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-sm"
                          style={{ backgroundColor: preset.config.colors?.primary }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <button
                    onClick={randomizeConfig}
                    className="w-full py-2.5 rounded-xl border border-purple-500/40 bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Surprise Me (Randomize Theme)</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. Colors Controls */}
            {activeSection === "colors" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight mb-2.5">
                    Curated Color Themes
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(TEMPLATE_COLOR_PRESETS).map((preset) => {
                      if (preset.id === "custom") return null;
                      const isSelected = config.colors.presetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => setColorPreset(preset.id)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white/15 border-white text-white font-semibold shadow-sm"
                              : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white bg-zinc-900/50"
                          }`}
                        >
                          <div
                            className="h-4 w-4 rounded-full border border-white/20 shadow-sm shrink-0"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <span className="truncate text-[11px] font-medium">{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Input */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight">
                    Custom Primary Hex
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors.primary}
                      onChange={(e) => {
                        setCustomHexInput(e.target.value);
                        setCustomPrimaryColor(e.target.value);
                      }}
                      className="h-9 w-9 rounded-xl cursor-pointer bg-transparent border border-white/10 p-0.5"
                    />
                    <input
                      type="text"
                      value={customHexInput}
                      onChange={(e) => {
                        setCustomHexInput(e.target.value);
                        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                          setCustomPrimaryColor(e.target.value);
                        }
                      }}
                      placeholder="#6366f1"
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-zinc-900/80 font-mono text-xs text-white focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. Typography Controls */}
            {activeSection === "typography" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight mb-1.5">
                    Body Font Family
                  </label>
                  <div className="space-y-1.5">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => updateConfig({ typography: { ...config.typography, fontFamily: font.id } })}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          config.typography.fontFamily === font.id
                            ? "bg-white/15 border-white text-white font-bold shadow-sm"
                            : "border-white/10 text-zinc-400 hover:text-white bg-zinc-900/40 hover:bg-zinc-900"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-xs" style={{ fontFamily: `'${font.id}', sans-serif` }}>
                            {font.label}
                          </p>
                          <p className="text-[10px] text-zinc-500">{font.sample}</p>
                        </div>
                        {config.typography.fontFamily === font.id && <Check className="h-4 w-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight">
                    Heading Font Family
                  </label>
                  <select
                    value={config.typography.headingFont}
                    onChange={(e) =>
                      updateConfig({
                        typography: { ...config.typography, headingFont: e.target.value as TemplateFontFamily },
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 text-xs text-white focus:outline-none focus:border-indigo-500/60 cursor-pointer"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight">
                    Font Scale & Sizing
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["compact", "normal", "spacious"] as TemplateFontScale[]).map((scale) => (
                      <button
                        key={scale}
                        onClick={() => updateConfig({ typography: { ...config.typography, scale } })}
                        className={`py-2 rounded-xl border capitalize text-[11px] font-medium transition-all cursor-pointer ${
                          config.typography.scale === scale
                            ? "bg-white/20 border-white text-white font-bold shadow-sm"
                            : "border-white/10 text-zinc-400 hover:text-white bg-zinc-900/40"
                        }`}
                      >
                        {scale}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. Layout, Spacing & Background Effects */}
            {activeSection === "layout" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight mb-2">
                    Border Radius
                  </label>
                  <div className="grid grid-cols-5 gap-1.5 text-xs">
                    {(["sharp", "small", "medium", "large", "full"] as TemplateRadius[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => updateConfig({ ui: { ...config.ui, radius: r } })}
                        className={`py-2 rounded-xl border capitalize text-[11px] font-mono transition-all cursor-pointer ${
                          config.ui.radius === r
                            ? "bg-white/20 border-white text-white font-bold shadow-sm"
                            : "border-white/10 text-zinc-400 hover:text-white bg-zinc-900/40"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight mb-2">
                    Content Density & Spacing
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["compact", "normal", "relaxed"] as TemplateDensity[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => updateConfig({ ui: { ...config.ui, density: d } })}
                        className={`py-2 rounded-xl border capitalize text-xs font-medium transition-all cursor-pointer ${
                          config.ui.density === d
                            ? "bg-white/20 border-white text-white font-bold shadow-sm"
                            : "border-white/10 text-zinc-400 hover:text-white bg-zinc-900/40"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight mb-2">
                    Canvas Atmosphere & Background Pattern
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: "none" as TemplateBackgroundEffect, label: "Solid Clean", icon: Layout },
                      { id: "grid" as TemplateBackgroundEffect, label: "Tech Grid", icon: Grid },
                      { id: "dots" as TemplateBackgroundEffect, label: "Dot Matrix", icon: CircleDot },
                      { id: "glow" as TemplateBackgroundEffect, label: "Ambient Glow", icon: Sparkles },
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() =>
                          updateConfig({
                            effects: {
                              ...config.effects,
                              backgroundEffect: bg.id,
                            },
                          })
                        }
                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          config.effects.backgroundEffect === bg.id
                            ? "bg-white/15 border-white text-white font-bold shadow-sm"
                            : "border-white/10 text-zinc-400 hover:text-white bg-zinc-900/40"
                        }`}
                      >
                        <bg.icon className="h-4 w-4" />
                        <span className="text-[11px]">{bg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. Appearance, Motion & JSON Sync */}
            {activeSection === "appearance" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight mb-2">
                    Color Appearance
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => updateConfig({ theme: "dark" })}
                      className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all cursor-pointer ${
                        config.theme === "dark"
                          ? "bg-white/20 border-white text-white font-bold shadow-md ring-1 ring-white/20"
                          : "border-white/10 text-zinc-400 hover:text-white bg-zinc-900/60"
                      }`}
                    >
                      <Moon className="h-4 w-4" />
                      <span>Dark Theme</span>
                    </button>
                    <button
                      onClick={() => updateConfig({ theme: "light" })}
                      className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all cursor-pointer ${
                        config.theme === "light"
                          ? "bg-white text-zinc-950 border-white font-bold shadow-md ring-1 ring-white/20"
                          : "border-white/10 text-zinc-400 hover:text-white bg-zinc-900/60"
                      }`}
                    >
                      <Sun className="h-4 w-4 text-amber-500" />
                      <span>Light Theme</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight mb-2">
                    Animation Level
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["reduced", "normal", "expressive"] as TemplateMotion[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => updateConfig({ motion: m })}
                        className={`py-2 rounded-xl border capitalize text-xs font-medium transition-all cursor-pointer ${
                          config.motion === m
                            ? "bg-white/20 border-white text-white font-bold shadow-sm"
                            : "border-white/10 text-zinc-400 hover:text-white bg-zinc-900/60"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <label className="block text-xs font-semibold text-zinc-200 tracking-tight">
                    Share & Export Configuration
                  </label>
                  <button
                    onClick={handleCopyJson}
                    className="w-full py-2.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                  >
                    {copiedConfig ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedConfig ? "Copied to Clipboard!" : "Copy Configuration JSON"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-4 pl-16 pr-4 sm:pl-16 border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl shrink-0 relative z-20">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="w-full py-3 rounded-2xl text-xs font-bold text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-all hover:brightness-110 hover:shadow-[0_6px_25px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              style={{ backgroundColor: config.colors.primary || "#4f46e5" }}
            >
              <Code2 className="h-4 w-4" />
              <span>Export Clean Code</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/30 text-white/90">TSX</span>
            </button>
          </div>
        </aside>

        {/* Right Pane: Real-Time Preview Canvas */}
        <main className="flex-1 bg-zinc-950 p-2 sm:p-4 lg:p-6 overflow-y-auto no-scrollbar flex items-start justify-center">
          <TemplatePreviewWrapper maxHeight="max-h-full">
            <RenderTemplatePreview templateId={template.id} />
          </TemplatePreviewWrapper>
        </main>
      </div>

      {/* Code Export Modal */}
      <TemplateCodeExportModal
        template={template}
        config={config}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

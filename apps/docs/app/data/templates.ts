export type TemplateCategory =
  | "All"
  | "Landing"
  | "Dashboard"
  | "Developer Tools"
  | "Portfolio"
  | "Fintech"
  | "E-Commerce"
  | "Agency"
  | "AI Application"
  | "Waitlist"
  | "Documentation"
  | "Healthcare"
  | "Web3"
  | "EdTech"
  | "Events"
  | "Media"
  | "Real Estate"
  | "Infrastructure"
  | "AI & Automation"
  | "Hospitality"
  | "Support"
  | "Fitness"
  | "Travel"
  | "DevOps"
  | "Audio"
  | "Gaming"
  | "Architecture"
  | "Cybersecurity"
  | "CleanTech"
  | "LegalTech"
  | "Aerospace"
  | "Film & Media"
  | "Smart Home"
  | "Automotive"
  | "Fine Art"
  | "Academic Research"
  | "HR & People"
  | "Restaurant Tech"
  | "Mental Health";

export interface TemplateItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: TemplateCategory;
  badge: string;
  badgeColor: string;
  tags: string[];
  cliCommand: string;
  features: string[];
  codeSnippet: string;
}

export const TEMPLATES: TemplateItem[] = [
  {
    id: "template-ai-startup",
    slug: "ai-startup-landing",
    title: "Synthetix AI",
    subtitle: "Autonomous reasoning engine with live multi-model playground & latency benchmarks",
    description: "Designed for modern AI infrastructure & LLM developer platforms. Features sub-10ms inference telemetry, real-time multi-model benchmarks (R1 vs Claude 3.5 vs GPT-4o), and dynamic monthly/annual tiered pricing.",
    category: "Landing",
    badge: "Flagship",
    badgeColor: "from-indigo-500 to-violet-600",
    tags: ["Next.js 15", "Tailwind v4", "Multi-Model", "Benchmarks", "Pricing Calculator"],
    cliCommand: "npx nexoreui add template-ai-startup",
    features: [
      "Interactive multi-model prompt simulator (R1, Claude 3.5, GPT-4o)",
      "Real-time token streaming and memory allocation telemetry",
      "Model inference benchmark table with TTFT and throughput",
      "Dynamic monthly/annual billing calculator with discount badge",
      "True dual-theme Light and Dark mode with responsive mobile navigation",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Sparkles, ArrowRight, Check, Send } from "lucide-react";

export default function AiStartupTemplate() {
  const [selectedModel, setSelectedModel] = useState<"DeepSeek-R1" | "Claude-3.5" | "GPT-4o">("DeepSeek-R1");
  const [promptText, setPromptText] = useState("Synthesize an edge-routed vector indexing service");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(
    "✓ Tensor graph compiled. 4 regions provisioned. TTFT: 14ms. Throughput: 142 tok/s."
  );

  const handleSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setOutput(\`✓ [\${selectedModel}] execution complete. 2,140 tokens streamed. Latency: 1.1ms.\`);
    }, 800);
  };

  return (
    <div
      className="min-h-screen transition-colors text-left"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="sticky top-0 z-30 border-b backdrop-blur-xl px-4 sm:px-6 h-16 flex items-center justify-between" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <span className="font-bold text-base">Synthetix AI</span>
        <button className="text-xs font-semibold px-4 py-2 rounded-xl text-white" style={{ backgroundColor: "var(--template-primary, #6366f1)" }}>
          Get API Key
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">Autonomous AI Inference at Global Edge</h1>
        <p className="text-sm max-w-xl mx-auto mb-8 opacity-75">Stream deep reasoning tokens directly to edge clients with zero cold starts.</p>
        <form onSubmit={handleSynthesize} className="max-w-xl mx-auto p-2 rounded-2xl border flex gap-2" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="w-full bg-transparent px-3 text-xs outline-none"
          />
          <button type="submit" disabled={isGenerating} className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: "var(--template-primary, #6366f1)" }}>
            {isGenerating ? "Synthesizing..." : "Execute"}
          </button>
        </form>
        {output && <p className="mt-4 text-xs font-mono opacity-80">{output}</p>}
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-modern-saas",
    slug: "modern-saas-platform",
    title: "Aura Cloud",
    subtitle: "High-velocity developer cloud with CI/CD deployment graph & Cmd+K command palette",
    description: "Built for high-velocity software engineering teams. Includes simulated Cmd+K keyboard command menu, atomic pipeline status tracker, and collaborative multi-cursor presence.",
    category: "Landing",
    badge: "Popular",
    badgeColor: "from-blue-500 to-cyan-600",
    tags: ["Next.js 15", "Developer Cloud", "Cmd+K Palette", "CI/CD Pipeline", "Edge KV"],
    cliCommand: "npx nexoreui add template-modern-saas",
    features: [
      "Interactive Cmd+K quick command menu simulation with search filtering",
      "Real-time CI/CD deployment graph with commit hashes and build states",
      "Interactive feature switcher (Branch Previews, Atomic Rollbacks, Telemetry)",
      "Live team collaboration cursor overlay with responsive positioning",
      "Crisp architectural borders and high-contrast typography in both modes",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { GitBranch, CheckCircle2, Search, ArrowRight } from "lucide-react";

export default function ModernSaasTemplate() {
  const [activeTab, setActiveTab] = useState<"branch" | "edge" | "telemetry">("branch");

  return (
    <div
      className="min-h-screen transition-colors text-left"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="sticky top-0 z-30 border-b backdrop-blur-xl px-4 sm:px-6 h-16 flex items-center justify-between" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <span className="font-bold text-base">Aura Cloud</span>
        <button className="text-xs font-semibold px-4 py-2 rounded-xl text-white" style={{ backgroundColor: "var(--template-primary, #3b82f6)" }}>
          Console
        </button>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">The Developer Cloud for Modern Teams</h1>
        <p className="text-sm max-w-xl mx-auto mb-8 opacity-75">Push code, spawn instant ephemeral preview environments, and deploy across 300 edge nodes.</p>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-analytics-dashboard",
    slug: "analytics-command-center",
    title: "Prism Analytics",
    subtitle: "Executive financial telemetry center with sparklines & customer transaction ledger",
    description: "Enterprise data command center featuring interactive date-range switching (Today, 7D, 30D, 90D), animated sparkline cards, revenue bar charts, and a filterable live customer stream.",
    category: "Dashboard",
    badge: "Trending",
    badgeColor: "from-emerald-500 to-teal-600",
    tags: ["Dashboard", "KPI Cards", "Sparklines", "Date Range Filter", "CSV Export"],
    cliCommand: "npx nexoreui add template-analytics-dashboard",
    features: [
      "Dynamic date range switching (Today, 7D, 30D, 90D) that recomputes metrics",
      "Executive KPI trend cards with SVG sparklines and percentage deltas",
      "Interactive revenue inflow bar chart with daily intervals",
      "Customer transaction activity stream with category filtering",
      "Mobile-friendly drawer navigation and working CSV export notification",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { BarChart3, TrendingUp, Users, CreditCard, Download } from "lucide-react";

export default function AnalyticsDashboardTemplate() {
  const [dateRange, setDateRange] = useState("30D");

  return (
    <div
      className="min-h-screen transition-colors text-left flex flex-col md:flex-row"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <aside className="w-full md:w-60 border-r p-5" style={{ borderColor: "var(--template-border, #e2e8f0)", backgroundColor: "var(--template-surface, #f8f9fa)" }}>
        <div className="font-bold text-base mb-6">Prism Analytics</div>
        <nav className="space-y-1 text-xs">
          <button className="w-full text-left px-3 py-2 rounded-xl text-white font-semibold" style={{ backgroundColor: "var(--template-primary, #10b981)" }}>
            Overview
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-4">Executive Financial Telemetry</h1>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-devtools-cli",
    slug: "hyperterminal-devtools",
    title: "HyperTerminal",
    subtitle: "Precision developer workstation with interactive browser terminal sandbox",
    description: "Crafted for CLI tools, developer frameworks, and open-source infrastructure. Features an interactive browser terminal sandbox, real-time benchmark matrix, and instant curl install copy.",
    category: "Developer Tools",
    badge: "Open Source",
    badgeColor: "from-amber-500 to-orange-600",
    tags: ["Developer Tools", "CLI", "Interactive Terminal", "Benchmarks", "Raycast Style"],
    cliCommand: "npx nexoreui add template-devtools-cli",
    features: [
      "Interactive simulated terminal sandbox with working command execution",
      "Performance comparison table (Cold start latency, memory footprint, FPS)",
      "One-click copyable curl installation script with toast notification",
      "GitHub star ticker and open-source MIT license attribution",
      "Responsive touch command chips for mobile workstations",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

export default function DevtoolsCliTemplate() {
  const [copied, setCopied] = useState(false);
  const curlCmd = "curl -fsSL https://hyper.sh/install.sh | sh";

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-mono"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center mb-8">
        <span className="font-bold text-sm">HyperTerminal CLI</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(curlCmd);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5"
          style={{ borderColor: "var(--template-border, #e2e8f0)" }}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied" : "Copy curl"}</span>
        </button>
      </header>
    </div>
  );
}`,
  },
  {
    id: "template-creative-portfolio",
    slug: "studio-monolith-portfolio",
    title: "Studio Monolith",
    subtitle: "Editorial monograph portfolio with asymmetric masonry & interactive case studies",
    description: "Editorial digital art direction for creative directors and luxury design studios. Displays refined typography, asymmetric project grid, interactive inspection drawer, and commission brief modal.",
    category: "Portfolio",
    badge: "Editorial",
    badgeColor: "from-rose-500 to-pink-600",
    tags: ["Portfolio", "Editorial", "Serif Typography", "Masonry", "Awwwards Style"],
    cliCommand: "npx nexoreui add template-creative-portfolio",
    features: [
      "Asymmetric editorial masonry layout with hover zoom reveals",
      "Interactive case study inspection modal with client metrics",
      "Availability status ticker with multi-city location time",
      "Commission inquiry modal with interactive budget scope selector",
      "Exquisite typographic hierarchy with light and dark mode balance",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { ArrowUpRight, Award, X } from "lucide-react";

export default function CreativePortfolioTemplate() {
  return (
    <div
      className="min-h-screen transition-colors text-left p-8"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center mb-16 font-mono text-xs">
        <span className="font-bold uppercase tracking-tight">Studio Monolith</span>
        <span>Tokyo • Zurich • New York</span>
      </header>
      <h1 className="text-4xl sm:text-6xl font-serif font-light leading-tight mb-12">
        Architecting singular digital experiences for enduring brands.
      </h1>
    </div>
  );
}`,
  },
  {
    id: "template-fintech-app",
    slug: "apex-fintech-app",
    title: "Apex Capital",
    subtitle: "Corporate treasury management with virtual titanium card and instant wire transfers",
    description: "Stripe & Mercury inspired executive banking interface. Features a virtual titanium corporate card with freeze/unfreeze actions, instant multi-currency switching, and a wire transfer simulator.",
    category: "Fintech",
    badge: "Executive",
    badgeColor: "from-emerald-600 to-teal-700",
    tags: ["Fintech", "Corporate Card", "Multi-Currency", "Wire Transfers", "Mercury Style"],
    cliCommand: "npx nexoreui add template-fintech-app",
    features: [
      "Interactive virtual titanium debit card with reveal number & freeze toggle",
      "Multi-currency treasury selector (USD, EUR, GBP) with live APY yield rates",
      "Instant wire transfer modal simulator with FedNow rails and toast feedback",
      "Visual spending category breakdown with interactive progress bars",
      "Encrypted security radar status and FDIC insurance validation",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { CreditCard, Send, Lock, Unlock, ShieldCheck } from "lucide-react";

export default function FintechAppTemplate() {
  const [frozen, setFrozen] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 sm:p-8"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <h1 className="text-2xl font-bold mb-4">Apex Capital Treasury</h1>
      <button
        onClick={() => setFrozen(!frozen)}
        className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
        style={{ backgroundColor: "var(--template-primary, #059669)" }}
      >
        {frozen ? "Unfreeze Corporate Card" : "Freeze Corporate Card"}
      </button>
    </div>
  );
}`,
  },
  {
    id: "template-ecommerce-store",
    slug: "atelier-luxury-store",
    title: "Atelier Objects",
    subtitle: "Luxury craft atelier boutique with tactile swatches & slide-over bag drawer",
    description: "Minimalist craftsmanship store. Features live colorway swatch switching, size selectors with low stock indicators, and an interactive slide-over cart drawer with subtotal calculation.",
    category: "E-Commerce",
    badge: "Luxury",
    badgeColor: "from-amber-600 to-stone-600",
    tags: ["E-Commerce", "Slide-over Cart", "Color Swatches", "Accordion Details", "Minimalist"],
    cliCommand: "npx nexoreui add template-ecommerce-store",
    features: [
      "Dynamic colorway swatch switcher with instant product image update",
      "Variant size picker with real-time stock availability badges",
      "Slide-over shopping bag drawer with quantity adjustments and live subtotal",
      "Materials, sizing, and sustainable craftsmanship accordion breakdown",
      "Mobile-friendly thumbnail gallery and responsive touch targets",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";

export default function EcommerceStoreTemplate() {
  const [isBagOpen, setIsBagOpen] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 sm:p-8"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center mb-8 border-b pb-4" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <span className="font-bold uppercase tracking-tight">Atelier Objects</span>
        <button onClick={() => setIsBagOpen(true)} className="flex items-center gap-2 text-xs font-medium">
          <ShoppingBag className="h-4 w-4" />
          <span>Bag (1)</span>
        </button>
      </header>
    </div>
  );
}`,
  },
  {
    id: "template-agency-creative",
    slug: "vanguard-digital-agency",
    title: "Vanguard Digital",
    subtitle: "High-velocity product engineering studio with scope & investment calculator",
    description: "Authoritative digital product studio site. Features typographic scale, interactive capabilities accordion with deliverable chips, and an interactive budget & sprint scope calculator.",
    category: "Agency",
    badge: "Studio",
    badgeColor: "from-purple-600 to-indigo-700",
    tags: ["Agency", "Studio", "Scope Estimator", "Capabilities Accordion", "Interactive"],
    cliCommand: "npx nexoreui add template-agency-creative",
    features: [
      "Multi-city global time ticker (New York, London, Tokyo)",
      "Interactive capabilities accordion showing technical deliverables",
      "Interactive project budget & timeline scope slider ($20k to $120k+)",
      "Valuation created metric cards and partner engineering showcase",
      "Mutual NDA sprint proposal modal for instant RFP inquiries",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function AgencyCreativeTemplate() {
  return (
    <div
      className="min-h-screen transition-colors text-left p-6 sm:p-8"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <h1 className="text-4xl sm:text-6xl font-black uppercase mb-6">Vanguard Digital</h1>
      <p className="text-sm opacity-75 max-w-xl">We engineer singular digital products that define categorical market leadership.</p>
    </div>
  );
}`,
  },
  {
    id: "template-ai-chat",
    slug: "cortex-ai-assistant",
    title: "Cortex Workspace",
    subtitle: "Calm AI reasoning canvas with model switcher & expandable thought traces",
    description: "Desktop AI interface featuring a collapsible session sidebar, active model selector (Reasoning R1, Fast 4o, Vision Pro), expandable agent reasoning process step, and syntax code runner with copy action.",
    category: "AI Application",
    badge: "Reasoning",
    badgeColor: "from-sky-500 to-indigo-600",
    tags: ["AI Chat", "Reasoning Step", "Code Runner", "Model Switcher", "Claude Style"],
    cliCommand: "npx nexoreui add template-ai-chat",
    features: [
      "Model switcher dropdown (Cortex Reasoning R1, Cortex Fast 4o, Vision Pro)",
      "Expandable AI thought/reasoning process disclosure panel",
      "Syntax-highlighted code output box with one-click copy feedback",
      "Collapsible conversation session history with mobile drawer support",
      "Working interactive message submission and response streaming simulator",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Send, Cpu } from "lucide-react";

export default function AiChatTemplate() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Cortex reasoning engine ready. How can I assist your architecture today?" }
  ]);

  return (
    <div
      className="min-h-screen transition-colors text-left flex p-4"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <div className="flex-1 max-w-3xl mx-auto space-y-4">
        <h1 className="text-xl font-bold">Cortex Workspace</h1>
      </div>
    </div>
  );
}`,
  },
  {
    id: "template-project-management",
    slug: "orbit-flow-pm",
    title: "Orbit Flow",
    subtitle: "High-efficiency sprint tracking & Kanban board with responsive view modes",
    description: "Keyboard-first sprint and issue management application. Features Kanban status columns (Backlog, In Progress, In Review, Done), priority indicators, sprint velocity meter, and a quick issue creator.",
    category: "Dashboard",
    badge: "Productivity",
    badgeColor: "from-blue-600 to-indigo-600",
    tags: ["Kanban", "Sprint Tracking", "Issue Creator", "Velocity Meter", "Linear Style"],
    cliCommand: "npx nexoreui add template-project-management",
    features: [
      "Kanban board with status columns and mobile column pill switcher",
      "View mode switcher between Kanban Board and dense List",
      "Issue priority badges (Urgent with flame, High, Medium) and estimate points",
      "Sprint velocity burn-down progress meter (38/48 pts, 79%)",
      "Quick issue creation dialog with immediate insertion into the board",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Plus, Kanban } from "lucide-react";

export default function ProjectManagementTemplate() {
  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <h1 className="text-xl font-bold mb-4">Orbit Flow</h1>
    </div>
  );
}`,
  },
  {
    id: "template-startup-waitlist",
    slug: "genesis-stealth-waitlist",
    title: "Genesis Stealth",
    subtitle: "Curated product waitlist with responsive countdown & viral referral queue",
    description: "Designed for stealth product announcements and invite-only beta queues. Features a responsive countdown clock, email capture with instant queue position, and referral invite link.",
    category: "Waitlist",
    badge: "Stealth",
    badgeColor: "from-violet-600 to-purple-700",
    tags: ["Waitlist", "Viral Queue", "Countdown Timer", "Stealth Launch", "Minimal"],
    cliCommand: "npx nexoreui add template-startup-waitlist",
    features: [
      "Live countdown timer ticker with responsive 4-column layout",
      "Interactive email waitlist form that generates instant queue position (#142)",
      "Copyable viral referral invite link with +5 spots queue jump reward",
      "Atmospheric radial gradient aura calibrated for light and dark modes",
      "Live verified signups counter ticker across international regions",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";

export default function StartupWaitlistTemplate() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-center flex flex-col justify-center items-center p-6"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">Genesis Stealth</h1>
      <p className="text-sm opacity-75 max-w-md mb-8">Access the autonomous computing substrate. Private beta commences in 14 days.</p>
    </div>
  );
}`,
  },
  {
    id: "template-docs-platform",
    slug: "codex-developer-docs",
    title: "Codex Docs",
    subtitle: "Developer documentation platform with interactive REST API request runner",
    description: "Modern developer documentation platform. Features a responsive 3-column layout, multi-language code snippets with tab switcher (cURL, Node, Python, Go), callout alerts, and an interactive REST API request runner.",
    category: "Documentation",
    badge: "Developer",
    badgeColor: "from-emerald-500 to-teal-600",
    tags: ["Documentation", "API Explorer", "Multi-Language Tabs", "Clean Docs", "Search Kbd"],
    cliCommand: "npx nexoreui add template-docs-platform",
    features: [
      "Three-column documentation layout with mobile navigation drawer",
      "Multi-language code block with language tabs (cURL, Node.js, Python, Go)",
      "Interactive REST API test runner with simulated HTTP 200 JSON payload",
      "Global search trigger bar with ⌘K keyboard shortcut indicator",
      "Security alert callout blocks and structured API parameter tables",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Search, Code2, Send } from "lucide-react";

export default function DocsPlatformTemplate() {
  return (
    <div
      className="min-h-screen transition-colors text-left p-6"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <h1 className="text-2xl font-bold mb-4">Codex Developer Documentation</h1>
    </div>
  );
}`,
  },
  {
    id: "template-healthcare-portal",
    slug: "pulsecare-health-portal",
    title: "PulseCare Health",
    subtitle: "Patient health command center with continuous biometric telemetry & specialist scheduling",
    description: "Clinical-grade patient health portal designed for modern digital health providers and telehealth platforms. Features live biometric streams (Heart Rate BPM, SpO2, Sleep Score, HRV), medication adherence tracker, symptom triage assistant, and specialist appointment booking.",
    category: "Healthcare",
    badge: "Clinical",
    badgeColor: "from-teal-500 to-cyan-600",
    tags: ["Healthcare", "Biometrics", "Telemetry", "Telehealth", "Medication Tracker"],
    cliCommand: "npx nexoreui add template-healthcare-portal",
    features: [
      "Live biometric telemetry strip with Heart Rate (BPM), SpO2, Sleep Score, and HRV trend line",
      "Daily medication regimen checklist with scheduled dosage timings (Morning / Midday / Evening)",
      "Specialist appointment booking modal with specialty chips and instant confirmation toast",
      "Interactive symptom triage assistant with severity scoring and recommended care route",
      "Lab panel telemetry cards with reference range bars and downloadable PDF summary",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Activity, Heart, Calendar, CheckCircle2, AlertCircle, Plus, ChevronRight, User } from "lucide-react";

export default function HealthcarePortalTemplate() {
  const [selectedRegimen, setSelectedRegimen] = useState<string[]>(["rx-1"]);
  const [activeTab, setActiveTab] = useState<"vitals" | "meds" | "booking">("vitals");

  const vitals = [
    { label: "Resting Heart Rate", value: "68", unit: "BPM", status: "Optimal", delta: "-2 bpm vs avg" },
    { label: "Blood Oxygen", value: "98.4", unit: "%", status: "Normal", delta: "+0.3% vs yesterday" },
    { label: "Sleep Recovery", value: "86", unit: "/100", status: "High", delta: "7h 45m restorative" },
    { label: "Heart Rate Var.", value: "54", unit: "ms", status: "Good", delta: "+6ms vs baseline" },
  ];

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div>
          <div className="text-xs font-semibold tracking-wider uppercase text-teal-600">PulseCare Telehealth</div>
          <h1 className="text-2xl font-bold">Patient Health Telemetry</h1>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500">
          Book Specialist
        </button>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        {vitals.map((v) => (
          <div key={v.label} className="p-4 rounded-xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
            <div className="text-xs opacity-75">{v.label}</div>
            <div className="text-2xl font-extrabold my-1">{v.value} <span className="text-xs font-normal opacity-70">{v.unit}</span></div>
            <div className="text-xs text-teal-600 font-medium">{v.delta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },
  {
    id: "template-web3-dex",
    slug: "novaswap-dex-terminal",
    title: "NovaSwap Protocol",
    subtitle: "High-throughput decentralized liquidity terminal with instant multi-chain token swaps",
    description: "Next-generation Web3 DEX and liquidity pool interface. Features multi-token swap routing with slippage tolerance controls, live candlestick & depth visualizer, filterable yield farming pools, dynamic Gwei gas tracker, and simulated Web3 wallet connection.",
    category: "Web3",
    badge: "DeFi",
    badgeColor: "from-cyan-500 to-blue-600",
    tags: ["Web3", "DeFi", "Token Swap", "Liquidity Pools", "Candlestick Chart"],
    cliCommand: "npx nexoreui add template-web3-dex",
    features: [
      "Interactive multi-asset token swap card (ETH, USDC, SOL, ARB, NEXO) with pair flip and live quote calculation",
      "Slippage tolerance selector (0.1%, 0.5%, 1.0%, Custom) with transaction route visualization",
      "Live interactive candlestick & depth chart with timeframe toggles (1H, 24H, 7D, 1M)",
      "Filterable liquidity pools ledger with TVL, 24h volume, and APY yield badges",
      "Dynamic Gwei gas fee tracker and simulated Web3 wallet connection modal",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { ArrowDownUp, Zap, SlidersHorizontal, ShieldCheck, Wallet, ChevronDown } from "lucide-react";

export default function Web3DexTemplate() {
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("1.5");
  const [slippage, setSlippage] = useState("0.5%");
  const [isSwapping, setIsSwapping] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans flex items-center justify-center"
      style={{
        backgroundColor: "var(--template-bg, #08090d)",
        color: "var(--template-fg, #ffffff)",
      }}
    >
      <div className="w-full max-w-md p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #12141c)", borderColor: "var(--template-border, #1f2232)" }}>
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-base">NovaSwap Terminal</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">14 Gwei</span>
        </div>

        <div className="p-4 rounded-xl mb-2 border" style={{ backgroundColor: "var(--template-surface-elevated, #181a24)", borderColor: "var(--template-border, #1f2232)" }}>
          <div className="flex justify-between text-xs opacity-75 mb-1">
            <span>You Pay</span>
            <span>Balance: 4.82 ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-2xl font-bold bg-transparent outline-none w-1/2"
            />
            <span className="px-3 py-1.5 rounded-xl font-semibold text-xs border" style={{ borderColor: "var(--template-border, #1f2232)" }}>{fromToken}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsSwapping(true);
            setTimeout(() => setIsSwapping(false), 1200);
          }}
          className="w-full py-3 mt-4 rounded-xl font-bold text-xs text-white bg-cyan-500 hover:bg-cyan-400 transition-colors"
        >
          {isSwapping ? "Executing Smart Contract..." : "Swap Tokens"}
        </button>
      </div>
    </div>
  );
}`,
  },
  {
    id: "template-edtech-learning",
    slug: "polymath-course-platform",
    title: "Polymath Academy",
    subtitle: "Interactive technical learning platform with split-screen curriculum & code challenge sandbox",
    description: "Developer course platform and technical learning management system (LMS). Features a modular curriculum tree with progress tracking, split-screen lesson reader with interactive code verification challenges, unlockable skill tree matrix, and activity streak calendar.",
    category: "EdTech",
    badge: "Education",
    badgeColor: "from-emerald-500 to-green-600",
    tags: ["EdTech", "LMS", "Interactive Code", "Skill Tree", "Streak Heatmap"],
    cliCommand: "npx nexoreui add template-edtech-learning",
    features: [
      "Collapsible module curriculum syllabus with lesson completion checkmarks and XP indicators",
      "Split-view lesson workspace with concept breakdown on the left and executable quiz/code sandbox on the right",
      "Interactive code answer evaluation with instant pass/fail telemetry and hint disclosure",
      "Skill tree matrix with visual progression and unlockable developer achievement badges",
      "Yearly activity streak contribution calendar with daily learning habit tracker",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { BookOpen, CheckCircle, Code, Award, Flame, Play } from "lucide-react";

export default function EdtechLearningTemplate() {
  const [activeLesson, setActiveLesson] = useState("concurrency-primitives");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);

  const handleVerify = () => {
    if (selectedAnswer === 1) setVerified(true);
    else setVerified(false);
  };

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-4 mb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-emerald-500" />
          <h1 className="font-bold text-lg">Polymath Academy</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600">
          <Flame className="h-4 w-4 fill-amber-500" />
          <span>14 Day Streak</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-xl font-bold mb-2">Lesson 3: Distributed Consensus & Raft</h2>
          <p className="text-sm opacity-80 mb-6">Understand leader election and log replication invariants across 5 nodes.</p>
          <button onClick={handleVerify} className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600">
            Verify Answer
          </button>
        </div>
      </div>
    </div>
  );
}`,
  },
  {
    id: "template-conference-event",
    slug: "vertex-summit-event",
    title: "Vertex Summit 2027",
    subtitle: "Global developer & design summit website with multi-track schedule & tier pass checkout",
    description: "Flagship technology conference and summit landing page. Features a live countdown hero, multi-track interactive schedule timeline (AI Systems, Design Architecture, Cloud Infrastructure), keynote speaker grid with session details, and tiered ticket pass checkout.",
    category: "Events",
    badge: "Summit",
    badgeColor: "from-purple-500 to-pink-600",
    tags: ["Events", "Conference", "Multi-Track Schedule", "Speaker Grid", "Ticket Checkout"],
    cliCommand: "npx nexoreui add template-conference-event",
    features: [
      "Event hero with venue details (San Francisco & Global Virtual) and live countdown timer",
      "Interactive multi-track schedule filterable by day (Day 1, Day 2, Day 3) and topic tracks",
      "Keynote speaker grid with talk briefs, company badges, and expandable speaker bios",
      "Tiered ticket pass selector (Standard, VIP All-Access, Virtual Pass) with live pricing",
      "Spatial interactive venue floor map and travel lodging recommendations",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Calendar, MapPin, Users, Ticket, ArrowRight } from "lucide-react";

export default function ConferenceEventTemplate() {
  const [activeDay, setActiveDay] = useState<"day-1" | "day-2" | "day-3">("day-1");
  const [selectedTrack, setSelectedTrack] = useState<string>("All");

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans"
      style={{
        backgroundColor: "var(--template-bg, #090a0f)",
        color: "var(--template-fg, #ffffff)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #1f2232)" }}>
        <span className="font-extrabold text-base tracking-tight">Vertex Summit 2027</span>
        <button className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500">
          Claim Pass
        </button>
      </header>
      <main className="py-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-400 mb-4">
          <Calendar className="h-3.5 w-3.5" />
          <span>October 14–16, 2027 • San Francisco, CA</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">The Convergence of Intelligent Systems</h1>
        <p className="text-sm opacity-75 max-w-xl mx-auto mb-8">Join 4,000+ engineers, systems architects, and designers shaping next-generation software.</p>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-audio-podcast",
    slug: "echowave-podcast-player",
    title: "EchoWave Audio",
    subtitle: "High-fidelity broadcast & podcast streaming studio with interactive waveform player",
    description: "Modern audio broadcasting hub and podcast listening workstation. Features a persistent scrubbable audio waveform player, playback speed multiplier, clickable chapter marks, synchronized search transcript viewer, and filterable episode playlist.",
    category: "Media",
    badge: "Broadcast",
    badgeColor: "from-violet-500 to-indigo-600",
    tags: ["Media", "Podcast", "Audio Waveform", "Player", "Synchronized Transcript"],
    cliCommand: "npx nexoreui add template-audio-podcast",
    features: [
      "Persistent audio player bar with scrubbable waveform visualizer, time elapsed/total, and volume slider",
      "Playback speed selector (1.0x, 1.25x, 1.5x, 2.0x) and 15s skip backward/forward actions",
      "Clickable timestamp chapter markers with instant playback scrub (e.g. 04:12 Architecture breakdown)",
      "Synchronized interactive transcript with real-time word search and highlighted quotes",
      "Filterable season episode playlist with duration badges, guest credits, and offline download action",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Play, Pause, FastForward, Rewind, Volume2, Headphones, Download, Search } from "lucide-react";

export default function AudioPodcastTemplate() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0x");
  const [activeChapter, setActiveChapter] = useState("04:15");

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans flex flex-col justify-between"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-4 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2 font-bold text-base">
          <Headphones className="h-5 w-5 text-indigo-600" />
          <span>EchoWave Studio</span>
        </div>
        <button className="px-3 py-1.5 rounded-lg border text-xs font-semibold" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
          Subscribe RSS
        </button>
      </header>

      <main className="max-w-3xl mx-auto py-12 text-center">
        <h1 className="text-3xl font-extrabold mb-2">EP 142: Zero-Cost Abstractions at Scale</h1>
        <p className="text-xs opacity-75 mb-6">Featuring Linus M. • Recorded Live in Studio A</p>
      </main>

      <footer className="p-4 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 rounded-full text-white bg-indigo-600">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
        </button>
        <span className="text-xs font-mono">04:15 / 48:20</span>
      </footer>
    </div>
  );
}`,
  },
  {
    id: "template-real-estate",
    slug: "haven-luxury-estates",
    title: "Haven Luxury Estates",
    subtitle: "Architectural property showcase and luxury residence booking with split-view floor plans",
    description: "High-end architectural residence showcase and boutique booking platform. Features editorial property photography, multi-level interactive architectural floor plan viewer, luxury amenity lifestyle matrix, and date range stay quote calculator.",
    category: "Real Estate",
    badge: "Architectural",
    badgeColor: "from-stone-600 to-zinc-700",
    tags: ["Real Estate", "Architecture", "Floor Plan Viewer", "Luxury Booking", "Stay Estimator"],
    cliCommand: "npx nexoreui add template-real-estate",
    features: [
      "Editorial architectural gallery with location badges (Aspen, Kyoto, Amalfi) and architectural specs",
      "Interactive architectural blueprint & floor plan viewer with level toggle (Ground, Penthouse, Terrace)",
      "Luxury amenity lifestyle matrix with feature cards (Infinity Pool, Smart Climate, Private Heliport)",
      "Stay quote estimator with check-in/out date selection, guest count slider, and instant cost breakdown",
      "Neighborhood walk-score & proximity radar to Michelin dining, airports, and wellness clubs",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Building2, Calendar, MapPin, Users, Compass, ShieldCheck } from "lucide-react";

export default function RealEstateTemplate() {
  const [activeLevel, setActiveLevel] = useState<"ground" | "upper" | "terrace">("ground");
  const [nights, setNights] = useState(4);
  const baseRate = 1850;

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-4 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <span className="font-serif text-lg tracking-wide uppercase font-light">Haven Estates</span>
        <span className="text-xs tracking-wider uppercase opacity-70">Kyoto • Aspen • Zurich</span>
      </header>

      <main className="max-w-5xl mx-auto py-12">
        <h1 className="text-3xl sm:text-5xl font-serif font-light mb-4">The Obsidian Pavilion — Aspen Valley</h1>
        <p className="text-sm opacity-75 max-w-2xl mb-8">A 9,400 sq.ft cantilevered cedar and blackened steel retreat with panoramic mountain views.</p>
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">\${baseRate * nights} <span className="text-xs font-normal opacity-70">({nights} nights)</span></span>
            <button className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-stone-900">
              Reserve Residence
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-uptime-status",
    slug: "beacon-status-page",
    title: "Beacon Status",
    subtitle: "Real-time infrastructure status & incident response with 90-day interactive uptime heatbars",
    description: "Enterprise-grade system availability monitor and public/private incident response portal. Features overall system health metrics, 90-day interactive uptime heatbar grids with incident inspection, global regional latency probes, and active incident timeline.",
    category: "Infrastructure",
    badge: "Reliability",
    badgeColor: "from-emerald-600 to-teal-700",
    tags: ["Infrastructure", "Status Page", "Uptime Bars", "Incident Response", "Latency Probes"],
    cliCommand: "npx nexoreui add template-uptime-status",
    features: [
      "System operational banner with overall uptime availability telemetry (99.994% Availability)",
      "90-day interactive uptime heatbar grids across core services with hover incident tooltips",
      "Global regional latency ping monitor across 6 international nodes (US-East, EU-Central, AP-East)",
      "Chronological incident response timeline with lifecycle badges (Investigating, Identified, Resolved)",
      "Incident notification subscription modal for SMS, Email, and Slack webhook alert dispatches",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, Globe, Bell, ShieldCheck } from "lucide-react";

export default function UptimeStatusTemplate() {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  const services = [
    { name: "API Gateway & Edge Routing", uptime: "99.99%", latency: "14ms", status: "Operational" },
    { name: "Authentication & Identity Engine", uptime: "100.0%", latency: "22ms", status: "Operational" },
    { name: "Global Edge Key-Value Store", uptime: "99.98%", latency: "9ms", status: "Operational" },
    { name: "Vector Indexing Pipeline", uptime: "99.95%", latency: "38ms", status: "Operational" },
  ];

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-4xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-base">Beacon Status</span>
        </div>
        <button onClick={() => setIsSubscribeOpen(true)} className="px-3.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
          <Bell className="h-3.5 w-3.5" />
          <span>Subscribe to Updates</span>
        </button>
      </header>

      <div className="my-8 p-4 rounded-xl border flex items-center gap-3 bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-semibold text-sm">All Core Systems Fully Operational</span>
      </div>

      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.name} className="p-4 rounded-xl border flex justify-between items-center" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
            <div>
              <div className="font-bold text-sm">{s.name}</div>
              <div className="text-xs opacity-70">Latency: {s.latency} • Uptime: {s.uptime}</div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },
  {
    id: "template-agent-workflow",
    slug: "nexus-nodes-workflow",
    title: "Nexus Nodes",
    subtitle: "Visual node-based AI agent workflow canvas with connecting wires & test runner simulator",
    description: "Visual workflow automation canvas for AI agent builders and pipeline orchestrators. Features an interactive node graph canvas (Trigger, LLM Model, Tool Function, Output), connecting cable visualizer, parameter configuration drawer, and step-by-step test execution simulator.",
    category: "AI & Automation",
    badge: "Canvas",
    badgeColor: "from-blue-600 to-cyan-600",
    tags: ["AI Automation", "Node Graph", "Agent Workflow", "Execution Simulator", "Canvas"],
    cliCommand: "npx nexoreui add template-agent-workflow",
    features: [
      "Visual node graph canvas featuring connected pipeline steps (Webhook Trigger → Reasoning LLM → Vector Tool → Output)",
      "Interactive node parameter configuration drawer with temperature slider, prompt template, and model picker",
      "One-click pipeline execution simulator with animated wire pulses and step execution latency logs",
      "Preset workflow recipe switcher (Customer Support Auto-Responder, RAG Doc Search, Lead Enrichment)",
      "Zoom and pan navigation controls with mobile-friendly node selection",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Play, Sliders, CheckCircle2, GitBranch, Cpu, Database, Send } from "lucide-react";

export default function AgentWorkflowTemplate() {
  const [isRunning, setIsRunning] = useState(false);
  const [executionLog, setExecutionLog] = useState<string | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setExecutionLog("Executing Node 1: Webhook Trigger...");
    setTimeout(() => {
      setExecutionLog("Executing Node 2: Reasoning Model (Claude 3.5)...");
      setTimeout(() => {
        setIsRunning(false);
        setExecutionLog("✓ Workflow execution complete in 840ms. Output dispatched.");
      }, 700);
    }, 600);
  };

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans"
      style={{
        backgroundColor: "var(--template-bg, #08090d)",
        color: "var(--template-fg, #ffffff)",
      }}
    >
      <header className="flex justify-between items-center pb-4 border-b" style={{ borderColor: "var(--template-border, #1f2232)" }}>
        <span className="font-bold text-base">Nexus Nodes Canvas</span>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 flex items-center gap-1.5"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>{isRunning ? "Running Pipeline..." : "Test Workflow"}</span>
        </button>
      </header>
      {executionLog && <div className="mt-4 p-3 rounded-xl border text-xs font-mono" style={{ borderColor: "var(--template-border, #1f2232)" }}>{executionLog}</div>}
    </div>
  );
}`,
  },
  {
    id: "template-restaurant-culinary",
    slug: "komorebi-dining-bistro",
    title: "Komorebi Dining",
    subtitle: "Contemporary gastronomy showcase with seasonal tasting menus & table reservation engine",
    description: "Fine dining culinary showcase and interactive reservation portal for Michelin-caliber restaurants. Features seasonal multi-course tasting menus with dietary filter pills (Vegan, Gluten-Free, Chef Signature), sommelier wine pairings, and a multi-step table reservation engine.",
    category: "Hospitality",
    badge: "Gastronomy",
    badgeColor: "from-amber-600 to-orange-700",
    tags: ["Hospitality", "Fine Dining", "Table Reservation", "Tasting Menu", "Wine Pairing"],
    cliCommand: "npx nexoreui add template-restaurant-culinary",
    features: [
      "Atmospheric gastronomy hero with opening times, Michelin star badge, and reservation booking trigger",
      "Multi-course seasonal tasting menu breakdown (Omakase, 7-Course Tasting) with sommelier wine pairing notes",
      "Dietary filter pills (Vegetarian, Gluten-Free, Chef Signature) that dynamically adjust course details",
      "Interactive step-by-step table reservation widget: party size, date calendar, seating time, and seating area",
      "Chef philosophy spotlight and seasonal local farm provenance storytelling section",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Utensils, Calendar, Users, Clock, Award, Sparkles } from "lucide-react";

export default function RestaurantCulinaryTemplate() {
  const [partySize, setPartySize] = useState(2);
  const [selectedTime, setSelectedTime] = useState("19:30");
  const [reserved, setReserved] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-4xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold">Komorebi Gastronomy</span>
          <h1 className="text-2xl font-serif">Contemporary Seasonal Dining</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700">
          <Award className="h-4 w-4" />
          <span>Two Michelin Stars</span>
        </div>
      </header>

      <main className="py-12">
        <h2 className="text-xl font-serif mb-4">Autumn Tasting Menu (8 Courses)</h2>
        <p className="text-sm opacity-75 mb-6">Foraged chanterelles, Hokkaido scallops, and dry-aged wagyu with paired wines.</p>

        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-4">Reserve a Table</h3>
          <div className="flex gap-2 mb-4">
            {["18:00", "19:30", "21:00"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={\`px-3 py-1.5 rounded-lg text-xs font-semibold border \${selectedTime === t ? "bg-amber-600 text-white" : ""}\`}
              >
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => setReserved(true)} className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-700 hover:bg-amber-600">
            {reserved ? "Table Confirmed ✓" : "Complete Reservation"}
          </button>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-help-center",
    slug: "resolv-help-center",
    title: "Resolv Desk",
    subtitle: "Omnichannel customer support hub with instant search, article categories & ticket modal",
    description: "Customer support portal, self-serve knowledge base, and live ticketing desk. Features a prominent instant search bar with quick tags, categorized article grid with read counters, interactive FAQ accordions with helpfulness voting, and support ticket submission modal.",
    category: "Support",
    badge: "Support",
    badgeColor: "from-indigo-500 to-sky-600",
    tags: ["Support", "Help Center", "Knowledge Base", "FAQ Accordion", "Ticket Modal"],
    cliCommand: "npx nexoreui add template-help-center",
    features: [
      "Hero search bar with instant query filtering and popular quick-search tags (Reset 2FA, Billing, SSO)",
      "Categorized knowledge base card grid with article counts (Getting Started, Billing, Security, API)",
      "Interactive FAQ accordions with helpfulness voting telemetry (Was this helpful? Yes / No)",
      "Support ticket submission modal with department routing, priority selector (Low, Normal, Urgent), and file upload mock",
      "Live support agent availability card with average wait time indicator (< 4 mins)",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Search, HelpCircle, FileText, Send, CheckCircle2, ChevronRight, MessageSquare } from "lucide-react";

export default function HelpCenterTemplate() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-4xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <span className="font-bold text-base">Resolv Support Desk</span>
        <button onClick={() => setIsTicketOpen(true)} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500">
          Open Support Ticket
        </button>
      </header>

      <div className="py-12 text-center">
        <h1 className="text-3xl font-extrabold mb-4">How can our team help you today?</h1>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-3 h-4 w-4 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, guides, API errors..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs outline-none"
            style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}
          />
        </div>
      </div>
    </div>
  );
}`,
  },
  {
    id: "template-fitness-athletics",
    slug: "aeropulse-athletics",
    title: "AeroPulse Athletics",
    subtitle: "High-performance athletic telemetry suite tracking heart rate training zones & volume overload",
    description: "Cardiovascular strain analysis and progressive overload planning suite for endurance athletes and coaches. Features interactive 5-stage heart rate zone breakdown with target BPM slider, weekly volume bar chart with distance/tonnage toggles, PR trophy shelf, and structured interval workout checklist with rest timer.",
    category: "Fitness",
    badge: "Athletics",
    badgeColor: "from-rose-500 to-orange-600",
    tags: ["Fitness", "Athletics", "Heart Rate Zones", "Workout Intervals", "Rest Timer"],
    cliCommand: "npx nexoreui add template-fitness-athletics",
    features: [
      "Dynamic 5-stage cardio heart rate zone spectrum simulator with interactive BPM slider",
      "Progressive overload weekly volume bar chart toggleable between distance (km), tonnage (kg), and duration",
      "Interactive interval training checklist with RPE effort tags and target heart rate zones",
      "Active rest timer with countdown presets (60s, 90s, 120s) between threshold sets",
      "Personal records (PR) milestone trophy shelf with historical timestamped split paces",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Activity, Heart, Flame, Trophy, Timer, Plus, CheckCircle2 } from "lucide-react";

export default function FitnessAthleticsTemplate() {
  const [bpm, setBpm] = useState(158);
  const [intervals, setIntervals] = useState([
    { title: "Dynamic Hip Mobility", target: "10 min • Zone 1", done: true },
    { title: "Progressive Aerobic Build", target: "15 min @ 140 BPM", done: true },
    { title: "4 x 1,000m Lactate Repeats", target: "4 reps @ 3:42/km", done: false },
  ]);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          <span className="font-bold text-base">AeroPulse Athletics</span>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
          Recovery: 88% Ready
        </div>
      </header>

      <main className="py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
            <span className="text-xs opacity-70">Daily Strain</span>
            <div className="text-2xl font-extrabold mt-1">14.8 / 21.0</div>
          </div>
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
            <span className="text-xs opacity-70">Current Target BPM</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{bpm} BPM</div>
          </div>
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
            <span className="text-xs opacity-70">Resting Heart Rate</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">48 bpm</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Cardio Zone Spectrum</h3>
          <input
            type="range"
            min="100"
            max="195"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-wilderness-travel",
    slug: "nomadroute-expeditions",
    title: "NomadRoute Expeditions",
    subtitle: "Backcountry expedition planner with elevation waypoint topography & pack-weight calculator",
    description: "Wilderness journey planning and backcountry logistics platform. Features interactive trail elevation profile with clickable checkpoints, dynamic pack-weight distribution meter with ultralight compliance gauge, day-by-day stage itinerary, mountain hut reservation drawer, and live satellite telemetry card.",
    category: "Travel",
    badge: "Expedition",
    badgeColor: "from-emerald-500 to-teal-600",
    tags: ["Travel", "Wilderness", "Topography", "Pack Weight", "Permits"],
    cliCommand: "npx nexoreui add template-wilderness-travel",
    features: [
      "Interactive alpine trail elevation profile with clickable milestone waypoints",
      "Dynamic pack-weight distribution calculator with real-time ultralight compliance feedback",
      "Day-by-day expedition stage cards with cumulative ascent meters and weather telemetry",
      "National park wilderness hut and bivvy reservation drawer with gear rental bundles",
      "Garmin InReach satellite telemetry status card with live ranger check-in sync",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Compass, Mountain, Scale, Radio, Tent } from "lucide-react";

export default function WildernessTravelTemplate() {
  const [baseWeight, setBaseWeight] = useState(6.4);
  const [foodDays, setFoodDays] = useState(6);
  const totalWeight = (baseWeight + foodDays * 0.75 + 2.0).toFixed(1);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-base">NomadRoute Expeditions</span>
        </div>
        <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600">
          Reserve Permits
        </button>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-xl font-extrabold mb-1">Patagonia High Icefield Crossing</h2>
          <p className="text-xs opacity-70">148 km • +6,850m Cumulative Gain • 8 Days</p>
        </div>

        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Skin-Out Pack Weight: {totalWeight} kg</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">Ultralight Load</span>
          </div>
          <input
            type="range"
            min="4.0"
            max="12.0"
            step="0.2"
            value={baseWeight}
            onChange={(e) => setBaseWeight(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-devops-kubernetes",
    slug: "kubeorbit-cloud",
    title: "KubeOrbit Cloud",
    subtitle: "Multi-region Kubernetes cluster fleet manager with node pressure heatmaps & pod logs",
    description: "SRE and DevOps platform for container orchestration. Features multi-region node cluster grid with CPU/RAM pressure indicators, searchable pod health matrix with status filtering, live streaming pod stdout log viewer, and interactive canary deployment traffic splitter.",
    category: "DevOps",
    badge: "DevOps",
    badgeColor: "from-blue-600 to-indigo-600",
    tags: ["DevOps", "Kubernetes", "Pod Matrix", "Live Logs", "Canary Split"],
    cliCommand: "npx nexoreui add template-devops-kubernetes",
    features: [
      "Multi-region node fleet grid with CPU and memory pressure saturation meters",
      "Filterable pod health inventory with quick status chips (Running, CrashLoop, Pending)",
      "Live streaming container log terminal with timestamping and log-level highlighting",
      "Interactive canary ingress traffic slider with real-time error rate telemetry",
      "One-click pod restart simulation and manifest deployment modal",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Server, Cpu, Database, Terminal, Search, SlidersHorizontal } from "lucide-react";

export default function DevopsKubernetesTemplate() {
  const [canary, setCanary] = useState(15);
  const [search, setSearch] = useState("");

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-mono max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b font-sans" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-base">KubeOrbit Cloud</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-mono">
          242/248 Pods Healthy
        </span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border font-sans" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Canary Ingress Weight: {canary}%</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={canary}
            onChange={(e) => setCanary(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-audio-daw",
    slug: "soundforge-studio",
    title: "SoundForge Studio",
    subtitle: "Browser-based DAW & beatmaker marketplace with 16-step sequencer & stem mixer",
    description: "Web-based music production workstation and beat licensing marketplace. Features an interactive 16-step drum sequencer matrix with tempo BPM control and live playhead, 4-track stem mixing console with faders and mute/solo toggles, frequency spectrum visualizer, and commercial licensing tier checkout.",
    category: "Audio",
    badge: "Audio DAW",
    badgeColor: "from-purple-500 to-pink-600",
    tags: ["Audio", "DAW", "Step Sequencer", "Stem Mixer", "Music Tech"],
    cliCommand: "npx nexoreui add template-audio-daw",
    features: [
      "Interactive 16-step drum sequencer matrix with live step playhead and BPM tempo control",
      "4-channel stem mixer console with vertical faders, dB peak meters, and Mute/Solo logic",
      "Real-time audio frequency spectrum analyzer visualizer simulation",
      "Analog master FX rack with reverb, delay feedback, and low-pass filter knobs",
      "Royalty-free commercial audio licensing tier selector with instant PDF agreement checkout",
    ],
    codeSnippet: `"use client";
import React, { useState, useEffect } from "react";
import { Play, Pause, Disc, Sliders, Volume2, ShoppingBag } from "lucide-react";

export default function AudioDawTemplate() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(140);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => setStep((s) => (s + 1) % 16), (60 / bpm / 4) * 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, bpm]);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Disc className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-base">SoundForge Studio</span>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 flex items-center gap-1.5">
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? "Pause" : "Play Groove"}</span>
        </button>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm">16-Step Beat Grid ({bpm} BPM)</h3>
            <span className="font-mono text-xs opacity-60">Step {step + 1} / 16</span>
          </div>
          <div className="grid grid-cols-16 gap-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={\`h-10 rounded border \${step === i && isPlaying ? "bg-purple-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}\`} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-gamified-habits",
    slug: "questcraft-rpg",
    title: "QuestCraft RPG",
    subtitle: "Gamified habit & productivity dashboard turning tasks into character XP, gold & loot",
    description: "Role-playing gamified productivity console designed to turn daily habits into rewarding RPG adventures. Features hero character card with attribute meters (Strength, Wisdom, Focus), interactive daily quest board with instant XP/gold reward feedback, weekly raid boss battle, armory loot merchant, and 25-minute flow dungeon timer.",
    category: "Gaming",
    badge: "Gamified",
    badgeColor: "from-amber-500 to-yellow-600",
    tags: ["Gaming", "Productivity", "Habit Tracker", "RPG Progression", "Focus Timer"],
    cliCommand: "npx nexoreui add template-gamified-habits",
    features: [
      "Hero avatar profile card with level badge, XP progress bar, and 4 RPG attributes",
      "Daily quest checklist with checkmarks that award instant floating XP and gold coins",
      "Weekly raid boss challenge card that takes damage upon high-priority habit completions",
      "Loot armory & equipment shop allowing users to spend earned gold on attribute boosts",
      "Integrated 25-minute flow dungeon timer with ambient work sounds",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Shield, Sword, Sparkles, Coins, Flame, CheckCircle2 } from "lucide-react";

export default function GamifiedHabitsTemplate() {
  const [xp, setXp] = useState(2450);
  const [gold, setGold] = useState(1420);
  const [quests, setQuests] = useState([
    { id: 1, title: "Slay 90m Deep Focus Work Block", xp: 180, done: false },
    { id: 2, title: "Drink 2.5L Water Elixir", xp: 60, done: true },
  ]);

  const toggle = (id: number, questXp: number) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id && !q.done) {
          setXp((x) => x + questXp);
          setGold((g) => g + 40);
          return { ...q, done: true };
        }
        return q;
      })
    );
  };

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-base">QuestCraft RPG</span>
        </div>
        <div className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1">
          <Coins className="w-3.5 h-3.5" />
          <span>{gold} Gold</span>
        </div>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="font-extrabold text-base mb-1">Level 14 Paladin • {xp} / 3,000 XP</h2>
          <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: \`\${(xp / 3000) * 100}%\` }} />
          </div>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-global-logistics",
    slug: "vanguard-logistics",
    title: "Vanguard Logistics",
    subtitle: "Intermodal freight telemetry platform monitoring global cargo vessels & cold chain IoT",
    description: "Global supply chain and freight forwarding command center. Features Bill of Lading consignment journey stepper with milestone checkpoints, live reefer container IoT temperature telemetry, maritime vessel fleet AIS cards, border customs documentation matrix, and intermodal transport dispatch reroute modal.",
    category: "Infrastructure",
    badge: "Logistics",
    badgeColor: "from-blue-500 to-cyan-600",
    tags: ["Logistics", "Supply Chain", "Maritime Fleet", "Cold Chain", "Customs"],
    cliCommand: "npx nexoreui add template-global-logistics",
    features: [
      "Bill of Lading consignment tracker with interactive 5-stage multimodal journey stepper",
      "Refrigerated reefer container IoT telemetry cards with temperature & seal alarms",
      "Active container vessel fleet cards with speed (knots), draught, and satellite ETA alerts",
      "Border customs documentation matrix with clearance verification timestamps",
      "Multimodal dispatch reroute modal for express road freight and rail links",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Ship, Truck, Thermometer, Anchor, Navigation } from "lucide-react";

export default function GlobalLogisticsTemplate() {
  const [activeStage, setActiveStage] = useState(2);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Anchor className="w-5 h-5 text-cyan-600" />
          <span className="font-bold text-base">Vanguard Logistics</span>
        </div>
        <span className="text-xs font-mono text-emerald-600 font-bold">14 Vessels Active</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <span className="text-xs font-mono opacity-60">MASTER BILL OF LADING</span>
          <h2 className="text-xl font-extrabold font-mono mt-1">BOL-849204-HKG</h2>
          <p className="text-xs opacity-70 mt-1">Shenzhen (YTN) &rarr; Rotterdam Gateway (RTM)</p>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-gaming-esports",
    slug: "valkyrie-esports",
    title: "Valkyrie Esports",
    subtitle: "Championship tournament portal featuring double-elimination brackets & live match HUD",
    description: "Competitive esports broadcasting hub and tournament management portal. Features interactive double-elimination tournament tree with match progression, live Grand Finals match HUD with round economy indicators, interactive Map Veto pick/ban procedure, head-to-head pro player comparison, and community fan MVP ballot.",
    category: "Gaming",
    badge: "Esports",
    badgeColor: "from-rose-500 to-red-600",
    tags: ["Gaming", "Esports", "Tournament Bracket", "Match HUD", "Map Veto"],
    cliCommand: "npx nexoreui add template-gaming-esports",
    features: [
      "Interactive double-elimination tournament bracket with scores and advancing seeds",
      "Live Grand Finals broadcast HUD with round score, team logos, and economy vaults",
      "Interactive Map Veto (Pick & Ban) timeline with map win-rate records",
      "Pro star player 5-axis comparison table (ADR, K/D Rating, Headshot %, Clutches)",
      "Interactive fan match prediction and MVP voting widget with live percentage updates",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Trophy, Tv, Users, Target, Crown } from "lucide-react";

export default function GamingEsportsTemplate() {
  const [votes, setVotes] = useState(64);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-rose-500" />
          <span className="font-bold text-base">Valkyrie Esports</span>
        </div>
        <span className="text-xs font-bold text-rose-500 font-mono">LIVE • 284k Viewers</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="font-extrabold text-lg">Sentinels (11)</div>
          <div className="font-mono text-xs opacity-60">Map 5 Inferno</div>
          <div className="font-extrabold text-lg">Cloud9 (9)</div>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-architecture-spatial",
    slug: "arcform-spatial",
    title: "Arcform Spatial",
    subtitle: "Precision architectural studio and blueprint explorer with daylight azimuth simulation",
    description: "Architectural blueprint and spatial design presentation portal. Features interactive technical CAD floorplan with toggleable BIM overlays (Structural, Glazing, MEP, Millwork), solar daylight azimuth slider with thermal heat gain calculation, sustainable tactile material palette with embodied carbon metrics, and CSI spec package export.",
    category: "Architecture",
    badge: "Architecture",
    badgeColor: "from-amber-600 to-stone-700",
    tags: ["Architecture", "CAD Blueprint", "Solar Azimuth", "Materials", "BIM"],
    cliCommand: "npx nexoreui add template-architecture-spatial",
    features: [
      "Interactive technical CAD floorplan canvas with toggleable architectural overlay layers",
      "Solar sun angle azimuth slider simulating daylight lux and direct passive heat gain",
      "Tactile sustainable material palette spec sheet with embodied carbon metrics (CO₂e/m²)",
      "Project spatial specifications table with Gross Internal Area (GIA) and U-values",
      "One-click architectural CSI 3-Part specification package export modal",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Layers, Sun, Building, FileText } from "lucide-react";

export default function ArchitectureSpatialTemplate() {
  const [hour, setHour] = useState(13);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-base">Arcform Spatial</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono">
          LEED Platinum • 620 m²
        </span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Solar Daylight Azimuth ({hour}:00 JST)</h3>
          <input
            type="range"
            min="8"
            max="18"
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="w-full accent-amber-600"
          />
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-cybersecurity-soc",
    slug: "aegis-soc",
    title: "Aegis SOC",
    subtitle: "Enterprise Security Operations Center dashboard with SIEM triage & host isolation",
    description: "SecOps threat intelligence and autonomous incident response workstation. Features DEFCON-level system readiness barometer, incoming SIEM incident triage queue with MITRE ATT&CK technique tags and SLA countdown timers, deep packet payload inspector with hex viewer, and one-click zero-trust host airgap isolation.",
    category: "Cybersecurity",
    badge: "SecOps",
    badgeColor: "from-red-600 to-rose-700",
    tags: ["Cybersecurity", "SOC", "SIEM Triage", "MITRE ATT&CK", "Zero Trust"],
    cliCommand: "npx nexoreui add template-cybersecurity-soc",
    features: [
      "DEFCON readiness barometer and live threat origin ingestion telemetry",
      "Active SIEM alert triage queue with severity tags (Critical, High, Medium) and SLA countdowns",
      "Deep packet inspector panel showing raw byte sequences, target hosts, and risk scores",
      "Interactive zero-trust host isolation kill-switch with immediate air-gap confirmation",
      "Live MITRE ATT&CK technique tagging with automated mitigation recommendations",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { ShieldAlert, Terminal, Lock, CheckCircle2 } from "lucide-react";

export default function CybersecuritySocTemplate() {
  const [quarantined, setQuarantined] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-mono max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b font-sans" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span className="font-bold text-base">Aegis SOC</span>
        </div>
        <button
          onClick={() => setQuarantined(!quarantined)}
          className={\`px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white \${quarantined ? "bg-gray-600" : "bg-rose-600"}\`}
        >
          {quarantined ? "Host Air-Gapped" : "Isolate Host"}
        </button>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs text-rose-600 font-bold mb-1">CRITICAL • MITRE T1021.002</div>
          <h2 className="text-base font-extrabold font-sans">Pass-the-Hash Lateral Movement via SMB</h2>
          <p className="text-xs opacity-70 mt-1">Target Host: srv-dc-primary-01.internal (10.240.12.8)</p>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-cleantech-agriculture",
    slug: "verdant-iot",
    title: "Verdant IoT",
    subtitle: "Controlled environment vertical farming & smart hydroponic nutrient dosing console",
    description: "Precision agricultural technology and vertical farm telemetry console. Features ambient climate and vapor pressure deficit (VPD) monitors, automated peristaltic nutrient dosing pump controls (pH & EC calibration), 3-band photosynthetic LED spectrum programmer (Deep Red, Royal Blue, Far Red), and multi-bay crop batch growth stage tracking.",
    category: "CleanTech",
    badge: "CleanTech",
    badgeColor: "from-emerald-600 to-green-700",
    tags: ["CleanTech", "Smart Agriculture", "Hydroponics", "IoT Telemetry", "LED Spectrum"],
    cliCommand: "npx nexoreui add template-cleantech-agriculture",
    features: [
      "Canopy environmental telemetry cards monitoring temperature, humidity, VPD, and CO₂ ppm",
      "Peristaltic nutrient dosing calibration sliders for automated water pH and electrical conductivity (EC)",
      "Photosynthetic LED photon flux programmer with adjustable Deep Red, Royal Blue, and Far Red bands",
      "Hydroponic crop growth stage tracker with projected yield (kg) and biological health scores",
      "Automated closed-loop water recirculation telemetry with 98.4% conservation efficiency",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Sprout, Droplets, Sun, Wind, Leaf } from "lucide-react";

export default function CleantechAgricultureTemplate() {
  const [ph, setPh] = useState(6.2);
  const [red, setRed] = useState(65);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-base">Verdant IoT</span>
        </div>
        <span className="text-xs font-mono text-emerald-600 font-bold">98.4% Water Recycled</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Hydroponic pH Level: {ph}</h3>
          <input
            type="range"
            min="5.5"
            max="7.0"
            step="0.1"
            value={ph}
            onChange={(e) => setPh(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-juris-vault",
    slug: "jurisvault-contract-ai",
    title: "JurisVault AI",
    subtitle: "Enterprise legal contract redlining, clause risk assessment & cryptographic e-signatures",
    description: "Intelligent legal workspace for corporate counsels. Features side-by-side clause diffs, corporate playbook risk scoring, fallback clause injection, and multi-party cryptographic e-signatures.",
    category: "LegalTech",
    badge: "New",
    badgeColor: "from-indigo-600 to-blue-700",
    tags: ["Next.js 15", "LegalTech", "Contract Redlining", "Risk Scoring", "E-Signature"],
    cliCommand: "npx nexoreui add template-juris-vault",
    features: [
      "Split-screen contract viewer comparing original standard form against counterparty redlines",
      "Real-time legal risk scoring matrix identifying non-standard liability deviations",
      "Playbook fallback clause library with one-click draft injection",
      "Multi-party cryptographic e-signature progress stepper and signer status tracker",
      "Adaptive dual-theme Light and Dark mode with responsive mobile navigation",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Scale, FileText, CheckCircle2, AlertTriangle, PenTool } from "lucide-react";

export default function JurisVaultTemplate() {
  const [signed, setSigned] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-base">JurisVault AI</span>
        </div>
        <button
          onClick={() => setSigned(true)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600"
        >
          {signed ? "Executed & Signed" : "Approve & E-Sign"}
        </button>
      </header>
      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs text-rose-600 font-bold mb-1">CRITICAL RISK • SEC-8.2</div>
          <h2 className="text-base font-bold">Limitation of Liability & Consequential Damages</h2>
          <p className="text-xs opacity-70 mt-2">Counterparty proposes uncapped liability. Recommended: Insert 2x ACV fallback clause.</p>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-orbitalx-mission",
    slug: "orbitalx-mission-control",
    title: "OrbitalX Operations",
    subtitle: "LEO satellite constellation tracking, orbital telemetry & ground station command terminal",
    description: "Flight dynamics and satellite operations cockpit. Includes live orbital pass tracking, subsystem telemetry (solar generation, delta-v propulsion, reaction wheels), and safety-interlocked command uplink.",
    category: "Aerospace",
    badge: "New",
    badgeColor: "from-blue-600 to-indigo-800",
    tags: ["Aerospace", "Mission Control", "Satellite Telemetry", "Ground Stations", "Telecommand"],
    cliCommand: "npx nexoreui add template-orbitalx-mission",
    features: [
      "Orbital physics display with live velocity, apogee, perigee, and sub-satellite position",
      "Ground station pass predictor tracking upcoming acquisition of signal (AOS) windows",
      "Subsystem health cards monitoring solar generation (W), battery charge, and delta-v",
      "Safety-interlocked telecommand uplink modal with dual-operator arming lock verification",
      "Tactile aerospace control room aesthetics optimized for both daylight and dark operational suites",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Satellite, Radio, Compass, Zap, Terminal } from "lucide-react";

export default function OrbitalXTemplate() {
  const [armed, setArmed] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-mono max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b font-sans" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-base">OrbitalX Operations</span>
        </div>
        <span className="text-xs font-mono text-emerald-500 font-bold">AOS in 04m 12s</span>
      </header>
      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs opacity-60">ORBITAL VELOCITY: 7.58 km/s • LEO 545 km</div>
          <h2 className="text-base font-bold font-sans mt-1">AstraConstellation-07 (NORAD 58210)</h2>
          <p className="text-xs opacity-75 mt-2">Propellant: 78.4% Hydrazine • Solar: 1,420 W Nominal</p>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-cineboard-studio",
    slug: "cineboard-film-studio",
    title: "CineBoard Studio",
    subtitle: "Cinematic pre-production visual storyboard deck, camera framing & production stripboard",
    description: "Designed for film directors and cinematographers. Features interactive aspect ratio framing (2.39:1, 16:9, 4:3), prime lens optics inspector, production day stripboard scheduler, and camera rental manifest.",
    category: "Film & Media",
    badge: "New",
    badgeColor: "from-rose-600 to-pink-700",
    tags: ["Film Production", "Storyboard", "Aspect Ratio", "Camera Optics", "Stripboard"],
    cliCommand: "npx nexoreui add template-cineboard-studio",
    features: [
      "Dynamic aspect ratio switcher supporting 2.39:1 Anamorphic, 16:9 Cinema, and 4:3 Academy",
      "Visual storyboard shot cards with framing reticles, duration timestamps, and scene numbers",
      "Director & DP technical specs inspector for focal length, camera movement, and lighting setups",
      "Production call sheet stripboard organizing scenes by day/night, location, and cast",
      "Interactive camera rental package manifest with reservation confirmation workflow",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Clapperboard, Film, Camera, Video } from "lucide-react";

export default function CineBoardTemplate() {
  const [ratio, setRatio] = useState("2.39:1");

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Clapperboard className="w-5 h-5 text-rose-600" />
          <span className="font-bold text-base">CineBoard Studio</span>
        </div>
        <div className="text-xs font-mono font-bold bg-rose-600/10 text-rose-600 px-2 py-1 rounded">
          Framing: {ratio}
        </div>
      </header>
      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-base font-bold">SCENE 14A • SHOT 01 (EXT. HIGHWAY DUSK)</h2>
          <p className="text-xs opacity-75 mt-1">Cooke Anamorphic 40mm T2.3 • Drone Push-In (3.2m/s)</p>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-domus-living",
    slug: "domus-smart-living",
    title: "Domus Living",
    subtitle: "Whole-home ambient IoT console with multi-room climate dials, scene presets & solar microgrid",
    description: "Tactile smart home automation dashboard. Controls zone microclimates, relative humidity, atmospheric lighting presets, rooftop solar power flow, and biometric perimeter security locks.",
    category: "Smart Home",
    badge: "New",
    badgeColor: "from-emerald-600 to-teal-700",
    tags: ["Smart Home", "Ambient IoT", "Climate Control", "Microgrid Solar", "Perimeter Security"],
    cliCommand: "npx nexoreui add template-domus-living",
    features: [
      "Multi-room spatial navigation strip with real-time temperature, humidity, and active lights",
      "Tactile microclimate setpoint slider with HVAC eco status and HEPA air quality indices",
      "One-tap atmospheric scene triggers (Cinema Lounge, Focus & Code, Morning Sunrise, Deep Rest)",
      "Whole-house solar microgrid and storage telemetry with net utility feed-in tracking",
      "Perimeter security toggle with smart lock arming confirmation toast",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Home, Thermometer, Sun, Zap, ShieldCheck } from "lucide-react";

export default function DomusLivingTemplate() {
  const [temp, setTemp] = useState(21.5);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-base">Domus Living</span>
        </div>
        <span className="text-xs font-semibold text-emerald-600">Perimeter Armed</span>
      </header>
      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Living Pavilion Climate: {temp}°C</h3>
          <input
            type="range"
            min="18.0"
            max="26.0"
            step="0.5"
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-hyperion-ev",
    slug: "hyperion-ev-fleet",
    title: "Hyperion Fleet EV",
    subtitle: "Commercial EV fleet battery telemetry, 350kW fast charger depot & dynamic payload range engine",
    description: "Enterprise electric vehicle and commercial charging operations hub. Displays real-time battery State of Charge (SoC), TPMS tire pressures, 350kW CCS depot bays, and temperature-adjusted payload range estimation.",
    category: "Automotive",
    badge: "New",
    badgeColor: "from-cyan-600 to-blue-700",
    tags: ["Automotive", "EV Fleet", "Battery Telemetry", "DC Fast Charge", "Range Estimator"],
    cliCommand: "npx nexoreui add template-hyperion-ev",
    features: [
      "Commercial fleet vehicle selector cards displaying VIN, plate, State of Charge, and driver",
      "High-voltage battery pack telemetry displaying pack voltage and 80% fast-charge milestones",
      "TPMS 4-wheel tire pressure monitoring matrix with nominal heat dissipation indicators",
      "Dynamic payload (kg) and ambient temperature (°C) route range calculation engine",
      "Depot 350kW liquid-cooled CCS fast charger bay grid with live session toggles",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Car, BatteryCharging, Zap, Gauge } from "lucide-react";

export default function HyperionEvTemplate() {
  const [soc, setSoc] = useState(74);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-cyan-600" />
          <span className="font-bold text-base">Hyperion Fleet EV</span>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-600">{soc}% SoC</span>
      </header>
      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-base font-bold">Hyperion Freight Hauler Max (CA-941-EV)</h2>
          <p className="text-xs opacity-75 mt-1">Usable Capacity: 210 kWh / 280 kWh • 780V Architecture</p>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-sovereign-auctions",
    slug: "sovereign-live-auctions",
    title: "Sovereign Auctions",
    subtitle: "Curated fine art live bidding terminal with saleroom stream, provenance & currency conversion",
    description: "Prestigious live auction salon for museum-grade masterworks and rare collectibles. Includes real-time paddle raise increments, auctioneer ledger, institutional provenance timeline, and multi-currency converter.",
    category: "Fine Art",
    badge: "New",
    badgeColor: "from-amber-600 to-yellow-700",
    tags: ["Fine Art", "Live Auction", "Paddle Bidding", "Provenance", "Multi-Currency"],
    cliCommand: "npx nexoreui add template-sovereign-auctions",
    features: [
      "Museum-grade live lot stage showcasing artwork dimensions, medium, and estimated hammer range",
      "Interactive paddle bidding controls with incremental bid raises (+$50k, +$100k, +$200k, +$500k)",
      "Real-time currency converter updating bids across USD ($), EUR (€), and GBP (£)",
      "Verified institutional provenance and exhibition history timeline with foundation seals",
      "Conservator condition report modal with UV light examination and structural integrity details",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Gavel, ShieldCheck, DollarSign, Award } from "lucide-react";

export default function SovereignAuctionsTemplate() {
  const [bid, setBid] = useState(2450000);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Gavel className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-base">Sovereign Auctions</span>
        </div>
        <span className="text-xs font-mono font-bold text-amber-600">\${bid.toLocaleString()}</span>
      </header>
      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs opacity-60">LOT 24 • EVENING SALE LONDON</div>
          <h2 className="text-base font-bold mt-1">Composition in Cadmium & Cobalt Resonance, 1988</h2>
          <button
            onClick={() => setBid(bid + 50000)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600"
          >
            Raise Bid +$50,000
          </button>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-scholaris-archive",
    slug: "scholaris-research-archive",
    title: "Scholaris Archive",
    subtitle: "Open-access scientific preprint platform with LaTeX formula viewer & citation dependency tree",
    description: "Research preprint repository and academic citation explorer. Features math rendering, peer review reproducibility scores, Zenodo dataset downloads, and one-click BibTeX export.",
    category: "Academic Research",
    badge: "New",
    badgeColor: "from-sky-600 to-indigo-700",
    tags: ["Science", "Preprints", "Citation Graph", "LaTeX", "BibTeX Export"],
    cliCommand: "npx nexoreui add template-scholaris-archive",
    features: [
      "Preprint paper abstract reader with LaTeX mathematical equation rendering and DOI metadata",
      "Interactive citation dependency tree switching between derivative works and foundational antecedents",
      "Open Science reproducibility scorecard verifying Docker containers and Zenodo dataset mirrors",
      "One-click BibTeX academic citation export modal with instant clipboard copy",
      "Author affiliations and ORCID directory badges with double-blind referee consensus metrics",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { BookOpen, FileText, Download, Award } from "lucide-react";

export default function ScholarisArchiveTemplate() {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-600" />
          <span className="font-bold text-base">Scholaris Archive</span>
        </div>
        <span className="text-xs font-mono text-emerald-600 font-bold">Reproducibility: 9.8/10</span>
      </header>
      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs text-sky-600 font-mono font-bold mb-1">DOI: 10.1038/s41586-026-09214-x</div>
          <h2 className="text-base font-bold">Sub-Quadratic Attention via Orthogonal State Space Projections</h2>
          <p className="text-xs opacity-75 mt-2">Dr. Evelyn Zhao (Stanford) • Prof. Kenneth Sterling (MIT)</p>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-talentorbit-hr",
    slug: "talentorbit-people-ops",
    title: "TalentOrbit HR",
    subtitle: "Global people ops hub with interactive org chart, team PTO radar & 360 performance scorecard",
    description: "Modern organization development and talent operations console. Features collapsible department hierarchies, international time-off coverage calendars, and 9-box performance talent calibration.",
    category: "HR & People",
    badge: "New",
    badgeColor: "from-violet-600 to-purple-700",
    tags: ["HR Tech", "Org Chart", "PTO Planner", "People Ops", "360 Performance"],
    cliCommand: "npx nexoreui add template-talentorbit-hr",
    features: [
      "Interactive organization hierarchy directory filtered by Engineering, Product, and Design",
      "Employee cards detailing global timezones (UTC), direct reports count, and 9-box performance tiers",
      "Global team PTO calendar with automated sprint overlap conflict warnings",
      "Time-off request modal with vacation/wellness categorization and live balance deductions",
      "Executive headcount analytics, eNPS sentiment indicators, and cohort velocity tracking",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { Users, Calendar, Award, MapPin } from "lucide-react";

export default function TalentOrbitTemplate() {
  const [ptoDays, setPtoDays] = useState(18);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-600" />
          <span className="font-bold text-base">TalentOrbit HR</span>
        </div>
        <span className="text-xs font-semibold text-violet-600">{ptoDays} Days PTO Left</span>
      </header>
      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-base font-bold">Sophia Lindqvist • VP of Engineering</h2>
          <p className="text-xs opacity-70 mt-1">Stockholm (UTC+1) • 24 Direct Reports • Top Performer (9-Box 1A)</p>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-miseenplace-kds",
    slug: "miseenplace-kitchen-kds",
    title: "MiseEnPlace KDS",
    subtitle: "Commercial kitchen display system with dynamic ticket cook timers & station expediter",
    description: "Back-of-house commercial kitchen display. Categorizes order tickets by prep line (Grill, Saute, Pantry), flags allergen alerts in high-visibility red, and tracks cook times with bump bar completion actions.",
    category: "Restaurant Tech",
    badge: "New",
    badgeColor: "from-orange-600 to-red-700",
    tags: ["Restaurant Tech", "KDS", "Kitchen Display", "Order Expediter", "Allergy Alert"],
    cliCommand: "npx nexoreui add template-miseenplace-kds",
    features: [
      "Dynamic ticket board color-coded by elapsed cook times (<5m On Time, 5-10m Warning, >12m Critical)",
      "Kitchen line filtering allowing cooks to view Grill, Saute, Cold Pantry, or All Lines",
      "High-visibility allergen alert banners highlighting severe peanut, dairy, and gluten restrictions",
      "Tactile bump bar action completing tickets with real-time recall capability",
      "Anti-glare high-contrast interface designed for busy culinary cook environments",
    ],
    codeSnippet: `"use client";
import React, { useState } from "react";
import { UtensilsCrossed, Flame, Clock, Check } from "lucide-react";

export default function MiseEnPlaceTemplate() {
  const [bumped, setBumped] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-orange-600" />
          <span className="font-bold text-base">MiseEnPlace KDS</span>
        </div>
        <span className="text-xs font-mono font-bold text-orange-600">3 ACTIVE ORDERS</span>
      </header>
      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs font-mono font-bold text-rose-600 mb-1">TABLE 12 • 04:15 ELAPSED</div>
          <h2 className="text-base font-bold">2x 45-Day Dry Aged Ribeye (Med-Rare)</h2>
          <p className="text-xs opacity-75 mt-1">Station: GRILL • Extra flaky Maldon salt</p>
          <button
            onClick={() => setBumped(true)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600"
          >
            {bumped ? "Order Bumped" : "Bump Order"}
          </button>
        </div>
      </main>
    </div>
  );
}`,
  },
  {
    id: "template-aurasolace-sanctuary",
    slug: "aurasolace-wellness-sanctuary",
    title: "AuraSolace",
    subtitle: "Somatic mindfulness sanctuary with guided 4-7-8 rhythmic breath pacer & acoustic sound mixer",
    description: "Calming mental health and somatic regulation canvas. Features animated 4-7-8 breathing circle pacer, multi-layer ambient soundscape faders (Rain, Singing Bowls, Fire, 432Hz), and mindful reflection journaling.",
    category: "Mental Health",
    badge: "New",
    badgeColor: "from-teal-600 to-emerald-700",
    tags: ["Mental Health", "Mindfulness", "Breath Pacer", "Soundscape Mixer", "Journaling"],
    cliCommand: "npx nexoreui add template-aurasolace-sanctuary",
    features: [
      "Guided 4-7-8 parasympathetic breathing orb with real-time countdowns (Inhale 4s, Hold 7s, Exhale 8s)",
      "Multi-track acoustic sanctuary mixer with volume faders for coastal rain, singing bowls, and 432Hz tones",
      "Daily emotional dialectic check-in allowing somatic state tagging and qualitative reflection",
      "Distraction-free mindful reflection journal modal with compassionate introspective prompts",
      "Calm, restorative visual palette engineered for gentle focus and sensory grounding",
    ],
    codeSnippet: `"use client";
import React, { useState, useEffect } from "react";
import { Heart, Wind, Volume2, Sparkles } from "lucide-react";

export default function AuraSolaceTemplate() {
  const [phase, setPhase] = useState("Inhale (4s)");

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-teal-600" />
          <span className="font-bold text-base">AuraSolace Sanctuary</span>
        </div>
        <span className="text-xs font-semibold text-teal-600">Peaceful Grounded</span>
      </header>
      <main className="py-8 space-y-6 text-center">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="w-32 h-32 rounded-full border-2 border-teal-500 mx-auto flex items-center justify-center font-bold text-xs text-teal-600">
            {phase}
          </div>
          <h2 className="text-base font-bold mt-4">Parasympathetic Nervous System Regulation</h2>
        </div>
      </main>
    </div>
  );
}`,
  },
];



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
  | "Documentation";

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
];

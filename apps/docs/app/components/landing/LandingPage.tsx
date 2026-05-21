"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Copy, Check, Terminal, Zap, Shield, 
  Sparkles, Code, Layers, Sliders, Play, CheckCircle2,
  Lock, Eye, EyeOff, User, Settings, Bell, X, Info, CheckCircle,
  HelpCircle, AlertCircle, FileText, ChevronRight, Download, Search, Info as InfoIcon
} from "lucide-react";

// List of all 38 components in the library
const ALL_COMPONENTS = [
  { id: "modal", name: "Dialog / Modal", desc: "Overlay dialogs that focus the user's attention.", category: "overlays", hasInteractive: true },
  { id: "input", name: "Password Validator", desc: "Text field inputs with floating labels and live validations.", category: "primitives", hasInteractive: true },
  { id: "slider", name: "Slider", desc: "Custom range selectors with moving tooltip bubbles.", category: "primitives", hasInteractive: true },
  { id: "tabs", name: "Tabs", desc: "Segmented tab headers with sliding underline animation.", category: "layout", hasInteractive: true },
  { id: "avatar", name: "Avatar Group", desc: "Expanding stacks of team member user profile icons.", category: "primitives", hasInteractive: true },
  { id: "accordion", name: "Accordion", desc: "Collapsible vertical panels for structured QA lists.", category: "layout", hasInteractive: true },
  { id: "alert", name: "Alert", desc: "Status notification callouts with customizable styles.", category: "overlays", hasInteractive: true },
  { id: "tooltip", name: "Tooltip", desc: "Small contextual popups appearing on element hover.", category: "overlays", hasInteractive: true },
  { id: "switch", name: "Switch & Checkbox", desc: "Interactive toggle selectors for settings panels.", category: "primitives", hasInteractive: true },
  { id: "progress", name: "Progress Bar", desc: "Linear loading bars with percentage transition states.", category: "primitives", hasInteractive: true },
  
  // Static code / catalog items
  { id: "button", name: "Button", desc: "Basic and advanced buttons with loading and hover scale.", category: "primitives", hasInteractive: false },
  { id: "card", name: "Card", desc: "Content container cards with headers, bodies and footers.", category: "layout", hasInteractive: false },
  { id: "badge", name: "Badge", desc: "Small status pills indicating flags, levels or counters.", category: "primitives", hasInteractive: false },
  { id: "skeleton", name: "Skeleton Loader", desc: "Placeholder skeletons showing content shapes while loading.", category: "primitives", hasInteractive: false },
  { id: "rating", name: "Rating", desc: "Star and custom shape feedback rating selectors.", category: "primitives", hasInteractive: false },
  { id: "command", name: "Command Palette", desc: "Cmd+K searchable overlays for keyboard operations.", category: "pro", hasInteractive: false },
  { id: "table", name: "Data Table", desc: "Rich tables supporting sorting, filtering and pagination.", category: "pro", hasInteractive: false },
  { id: "stepper", name: "Stepper", desc: "Multi-step wizards displaying active milestones.", category: "layout", hasInteractive: false },
  { id: "scroll-area", name: "Scroll Area", desc: "Custom scrollable zones with cross-browser scrollbars.", category: "layout", hasInteractive: false },
  { id: "file-upload", name: "File Upload", desc: "Drag and drop upload zones with progress bars.", category: "pro", hasInteractive: false },
  { id: "navigation", name: "Navigation Menu", desc: "Dropdown links and hover navigation headers.", category: "layout", hasInteractive: false },
  { id: "icons", name: "Icon Assets", desc: "Custom SVG iconography integrated within NexoreUI.", category: "primitives", hasInteractive: false },
  { id: "charts", name: "Premium Charts", desc: "Line, bar, and pie diagrams for data visual representation.", category: "pro", hasInteractive: false },
  { id: "data-display", name: "Data Display", desc: "Structured labels and descriptive lists panels.", category: "layout", hasInteractive: false },
  { id: "dark-mode", name: "Theme Toolkit", desc: "Class and media queries utilities to manage templates.", category: "primitives", hasInteractive: false },
  { id: "commerce", name: "Commerce Cards", desc: "Shopping cards, pricing tables and product listings.", category: "pro", hasInteractive: false },
  { id: "cookie", name: "Cookie Consent", desc: "GDPR dialog banners seeking user cookies consent.", category: "pro", hasInteractive: false },
  { id: "social", name: "Social Elements", desc: "Chat interfaces, comments section and profile banners.", category: "pro", hasInteractive: false },
  { id: "premium-effects", name: "Premium Effects", desc: "Aesthetic gradient borders and shiny particle layouts.", category: "animations", hasInteractive: false },
  { id: "loaders", name: "Loading Spinners", desc: "Dynamic spinners and load tracks for pending operations.", category: "primitives", hasInteractive: false },
  { id: "marquee", name: "Marquee Scroll", desc: "Infinite horizontal marquee sliders.", category: "animations", hasInteractive: false },
  { id: "number-ticker", name: "Number Ticker", desc: "Animated numerical digits tracking statistics.", category: "animations", hasInteractive: false },
  { id: "animated-number", name: "Animated Number", desc: "Smooth decimal counters for charts and analytics.", category: "animations", hasInteractive: false },
  { id: "typing-animation", name: "Typing Effect", desc: "Typewriter typing simulations for title headers.", category: "animations", hasInteractive: false },
  { id: "blur-fade", name: "Blur Fade In", desc: "Scroll-triggered blur transitions for section cards.", category: "animations", hasInteractive: false },
  { id: "box-reveal", name: "Box Reveal", desc: "Slide-up block covers revealing text elements.", category: "animations", hasInteractive: false },
  { id: "file-preview-card", name: "File Preview Card", desc: "Attachment visual cards showing thumbnails and extensions.", category: "pro", hasInteractive: false },
  { id: "image-compare", name: "Image Comparison", desc: "Split sliders letting users compare two images.", category: "animations", hasInteractive: false },
];

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const [installTab, setInstallTab] = useState<"pnpm" | "npm" | "yarn" | "bun">("pnpm");
  const [selectedComponent, setSelectedComponent] = useState<string>("modal");
  
  // Directory States
  const [dirSearch, setDirSearch] = useState("");
  const [dirCategory, setDirCategory] = useState("all");

  // 1. Modal demo states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectCategory, setProjectCategory] = useState("web");
  const [projectVisibility, setProjectVisibility] = useState("public");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Input validation demo states
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 3. Slider demo state
  const [sliderVal, setSliderVal] = useState(65);

  // 4. Tabs demo state
  const [activeShowcaseTab, setActiveShowcaseTab] = useState("account");

  // 5. Avatar demo hover states
  const [hoveredAvatar, setHoveredAvatar] = useState<number | null>(null);

  // 6. Accordion states
  const [activeAccordion, setActiveAccordion] = useState<string | null>("1");

  // 7. Alert demo variant
  const [alertVariant, setAlertVariant] = useState<"info" | "success" | "danger">("info");

  // 8. Tooltip hover trigger state
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);

  // 9. Switch toggles state
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);

  // 10. Progress simulator states
  const [simProgress, setSimProgress] = useState(35);
  const [isSimulating, setIsSimulating] = useState(false);

  // Showcase code copying state
  const [codeCopied, setCodeCopied] = useState(false);

  const installCommands = {
    pnpm: "pnpm dlx nexoreui@latest init",
    npm: "npx nexoreui@latest init",
    yarn: "yarn dlx nexoreui@latest init",
    bun: "bun x nexoreui@latest init",
  };

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(installCommands[installTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom Event for Global Search redirects to active tab in the showcase
  useEffect(() => {
    const handleSelectComponent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const componentId = customEvent.detail;
      const targetComponent = ALL_COMPONENTS.find(c => c.id === componentId);
      if (targetComponent) {
        setSelectedComponent(targetComponent.id);
        const element = document.getElementById("showcase");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    window.addEventListener("select-component", handleSelectComponent);
    return () => window.removeEventListener("select-component", handleSelectComponent);
  }, []);

  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passwordStrength = Object.values(passwordCriteria).filter(Boolean).length;

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setModalSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setProjectName("");
        setProjectDesc("");
        setProjectCategory("web");
        setProjectVisibility("public");
        setModalSuccess(false);
      }, 1500);
    }, 1200);
  };

  const runProgressSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimProgress(0);
    
    const interval = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Code snippets for sandbox components
  const componentCodes: Record<string, string> = {
    modal: `import { Modal, Button } from "nexoreui";
import { useState } from "react";

export default function DialogDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Project Panel</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
        title="Create New Project"
        description="Setup your project name and settings below."
      >
        <form className="space-y-4 pt-2">
          <input placeholder="Project Name" className="w-full border p-2 rounded" />
          <textarea placeholder="Description" className="w-full border p-2 rounded" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}`,
    input: `import { Input } from "nexoreui";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordValidator() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full max-w-sm">
      <Input
        type={show ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password..."
        className="pr-10"
      />
      <button 
        type="button"
        onClick={() => setShow(!show)} 
        className="absolute right-3 top-3 text-muted-foreground"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}`,
    slider: `import { Slider } from "nexoreui";
import { useState } from "react";

export default function SliderDemo() {
  const [value, setValue] = useState(65);

  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="flex justify-between text-xs font-mono">
        <span>Intensity</span>
        <span>{value}%</span>
      </div>
      <Slider
        min={0}
        max={100}
        value={value}
        onChange={(val) => setValue(val)}
      />
    </div>
  );
}`,
    tabs: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";

export default function SettingsTabs() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Update account details...</TabsContent>
      <TabsContent value="security">Change credentials...</TabsContent>
      <TabsContent value="alerts">Setup notification levels...</TabsContent>
    </Tabs>
  );
}`,
    avatar: `import { Avatar, AvatarGroup } from "nexoreui";

export default function TeamAvatars() {
  return (
    <AvatarGroup limit={4}>
      <Avatar src="/sarah.jpg" alt="Sarah Chen" />
      <Avatar src="/alex.jpg" alt="Alex Rivera" />
      <Avatar src="/elena.jpg" alt="Elena Rostova" />
      <Avatar src="/marcus.jpg" alt="Marcus Vance" />
    </AvatarGroup>
  );
}`,
    accordion: `import { Accordion, AccordionItem } from "nexoreui";

export default function FAQAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" title="Is it fast?">
        Yes, NexoreUI compiles with zero-bloat and runs on React 19.
      </AccordionItem>
      <AccordionItem value="item-2" title="Tailwind v4 supported?">
        Fully optimized out-of-the-box for Tailwind v4 theme variables.
      </AccordionItem>
      <AccordionItem value="item-3" title="Radix primitives?">
        Uses unstyled Radix primitives to guarantee accessibility.
      </AccordionItem>
    </Accordion>
  );
}`,
    alert: `import { Alert, AlertTitle, AlertDescription } from "nexoreui";
import { Info } from "lucide-react";

export default function StatusAlert() {
  return (
    <Alert variant="default">
      <Info className="h-4 w-4" />
      <AlertTitle>Updates Available</AlertTitle>
      <AlertDescription>
        A new version of NexoreUI is ready to download.
      </AlertDescription>
    </Alert>
  );
}`,
    tooltip: `import { Tooltip, TooltipTrigger, TooltipContent } from "nexoreui";

export default function ActionTooltip() {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger className="border px-4 py-2 rounded">
        Hover trigger
      </TooltipTrigger>
      <TooltipContent>
        Provides helpful context on hover.
      </TooltipContent>
    </Tooltip>
  );
}`,
    switch: `import { Switch, Label } from "nexoreui";

export default function SwitchDemo() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="notify" defaultChecked />
      <Label htmlFor="notify">Enable notifications</Label>
    </div>
  );
}`,
    progress: `import { Progress } from "nexoreui";

export default function ProgressSimulation() {
  return (
    <div className="w-full space-y-2">
      <Progress value={45} />
    </div>
  );
}`
  };

  const getCodeSnippet = (id: string, name: string) => {
    if (componentCodes[id]) return componentCodes[id];
    return `import { ${name.replace(/[^a-zA-Z0-9]/g, "")} } from "nexoreui";

export default function Demo() {
  return (
    <${name.replace(/[^a-zA-Z0-9]/g, "")}>
      {/* Component content goes here */}
    </${name.replace(/[^a-zA-Z0-9]/g, "")}>
  );
}`;
  };

  const copyShowcaseCode = () => {
    const code = getCodeSnippet(selectedComponent, ALL_COMPONENTS.find(c => c.id === selectedComponent)?.name || "");
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Filter Directory list
  const filteredDirectory = ALL_COMPONENTS.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(dirSearch.toLowerCase()) || 
                          comp.desc.toLowerCase().includes(dirSearch.toLowerCase());
    const matchesCategory = dirCategory === "all" || comp.category === dirCategory;
    return matchesSearch && matchesCategory;
  });

  const selectAndScrollToComponent = (id: string) => {
    setSelectedComponent(id);
    const element = document.getElementById("showcase");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 md:pt-40 md:pb-36 max-w-5xl mx-auto">
        {/* Visual glow bg */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <a 
          href="#installation" 
          className="relative inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mb-8 animate-fade-in"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Introducing NexoreUI v1.0.0</span>
          <ArrowRight className="h-3 w-3" />
        </a>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] animate-fade-in-up">
          Build Beautiful Interfaces.
          <br />
          <span className="text-muted-foreground/90 font-medium">Faster than ever.</span>
        </h1>

        <p className="mt-8 text-base sm:text-lg text-muted-foreground max-w-[650px] leading-relaxed animate-fade-in-up">
          300+ modern, animated, production-ready React 19 components. Built with Tailwind CSS v4, Framer Motion and Radix UI. Copy. Paste. Ship.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-fade-in-up">
          <a
            href="#installation"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
          >
            Get Started
          </a>
          <a
            href="#showcase"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-all"
          >
            Browse Components
          </a>
        </div>
      </section>

      {/* 2. Setup & Installation Guide Section */}
      <section id="installation" className="border-t border-border bg-card/20 scroll-mt-16">
        <div className="max-w-screen-xl mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Easy Installation
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Follow our guide to configure NexoreUI correctly in your React 19 or Next.js project.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Steps Guide & Best Practices */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Download size={18} className="text-muted-foreground" />
                  CLI Setup Steps
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Our CLI automatically sets up Tailwind configuration, aliases, and imports. Run this in your project root.
                </p>
              </div>

              {/* Steps Checklist */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Run CLI Init Command</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Choose your package manager on the right, copy the command and run it. The CLI will inspect your workspace.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Configure Path Aliases</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      When prompted, we recommend accepting the default alias <code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">@/components/ui</code>. Ensure your <code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">tsconfig.json</code> matches:
                    </p>
                    <pre className="mt-2 bg-muted/50 border border-border/60 rounded p-2.5 font-mono text-[11px] text-foreground max-w-full overflow-x-auto">
{`"paths": {
  "@/*": ["./*"]
}`}
                    </pre>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Tailwind v4 Integration</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Tailwind CSS v4 handles configuration inside CSS. Insert the `@source` declaration at the top of your global CSS file to compile the styles correctly:
                    </p>
                    <pre className="mt-2 bg-muted/50 border border-border/60 rounded p-2.5 font-mono text-[11px] text-foreground max-w-full overflow-x-auto">
{`@import "tailwindcss";
@source "../packages/ui/src/**/*.{ts,tsx}";`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Troubleshooting Tips / Best Practices */}
              <div className="p-5 rounded-lg border border-border bg-muted/30">
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Info size={16} className="text-muted-foreground" />
                  Important Verification Checklist
                </h4>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Peer Dependencies:</strong> Ensure <code className="bg-muted px-1 rounded">framer-motion</code> and <code className="bg-muted px-1 rounded">lucide-react</code> are installed manually if not upgrading automatically.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Hydration Warning:</strong> In Next.js layouts, add <code className="bg-muted px-1 rounded">suppressHydrationWarning</code> to the <code className="bg-muted px-1 rounded">&lt;html&gt;</code> element to support theme switching without console errors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>TypeScript Config:</strong> Ensure your project target compiles to ES6+ or NextJS native standards.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interactive Package Manager Code Terminal */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl border border-border bg-zinc-950 overflow-hidden font-mono text-sm shadow-2xl">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="text-[11px] text-zinc-500 select-none">bash / terminal</div>
                  <button 
                    onClick={handleCopyInstall}
                    className="text-zinc-400 hover:text-white transition-colors"
                    title="Copy CLI command"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400 animate-pulse" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Package manager tabs */}
                <div className="flex border-b border-zinc-800 bg-zinc-900/30 text-xs text-zinc-400 select-none">
                  {(["pnpm", "npm", "yarn", "bun"] as const).map((pm) => (
                    <button
                      key={pm}
                      onClick={() => setInstallTab(pm)}
                      className={`px-4 py-2 border-r border-zinc-800 hover:text-zinc-200 transition-colors ${
                        installTab === pm ? "bg-zinc-950 text-white font-medium border-t-2 border-t-white" : ""
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>

                {/* Terminal Contents */}
                <div className="p-6 overflow-x-auto text-zinc-300 min-h-[220px]">
                  <div className="flex gap-4">
                    <span className="text-zinc-600 select-none">1</span>
                    <span><span className="text-zinc-500"># Initializing component configurations</span></span>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <span className="text-zinc-600 select-none">2</span>
                    <span>
                      <span className="text-purple-400">$</span>{" "}
                      <span className="text-white">{installCommands[installTab]}</span>
                    </span>
                  </div>
                  
                  <div className="flex gap-4 mt-6">
                    <span className="text-zinc-600 select-none">3</span>
                    <span className="text-zinc-500">? Which style would you like to use? › Default</span>
                  </div>
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-zinc-600 select-none">4</span>
                    <span className="text-zinc-500">? Which base color? › Zinc</span>
                  </div>
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-zinc-600 select-none">5</span>
                    <span className="text-zinc-400">✔ Writing configurations...</span>
                  </div>
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-zinc-600 select-none">6</span>
                    <span className="text-emerald-400">✔ Done! NexoreUI is ready to ship.</span>
                  </div>
                </div>
              </div>

              {/* CLI features list */}
              <div className="mt-6 space-y-3.5 pl-2">
                <div className="flex items-center gap-2.5 text-xs">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-muted-foreground">React 19 & Tailwind CSS v4 support built-in</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-muted-foreground">Zero bloat — code is directly copied into your repo</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-muted-foreground">Full tree shaking support out of the box</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Showcase / Sandbox Section */}
      <section id="showcase" className="border-t border-border bg-background py-24 scroll-mt-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Interactive Component Explorer
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Interact with our premium primitives. Highly polished, fully accessible, responsive and theme-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Sidebar Menu */}
            <div className="lg:col-span-4 flex flex-col gap-2 max-h-[640px] overflow-y-auto pr-2 border-r border-border/40">
              <span className="text-xs font-semibold text-muted-foreground px-3 mb-2 tracking-wider">
                COMPONENTS / PRIMITIVES
              </span>
              
              {[
                { id: "modal", label: "Dialog / Modal", desc: "Animated overlay dialog with validation form." },
                { id: "input", label: "Password Validator", desc: "Form input with dynamic password validation." },
                { id: "slider", label: "Volume Range Slider", desc: "Responsive range bar with value popups." },
                { id: "tabs", label: "Segmented Tabs", desc: "Interactive tabbed panels with smooth layout ID." },
                { id: "avatar", label: "Hover Avatar Group", desc: "Expanding stack of custom team user profiles." },
                { id: "accordion", label: "Accordion FAQ", desc: "Collapsible vertical panels for Q&A structures." },
                { id: "alert", label: "Status Alert Card", desc: "Information callout blocks for system notices." },
                { id: "tooltip", label: "Hover Tooltip", desc: "Helpful contextual overlays triggered on hover." },
                { id: "switch", name: "Switch & Checkbox", label: "Toggle switches", desc: "Slide and check controls for settings panels." },
                { id: "progress", label: "Progress simulation", desc: "Simulated load tracking status bars." }
              ].map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm group flex flex-col justify-between ${
                    selectedComponent === comp.id
                      ? "bg-card text-foreground border-border shadow-md"
                      : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold">{comp.label}</span>
                    <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${selectedComponent === comp.id ? "opacity-100" : ""}`} />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {comp.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Right Live Preview / Code Explorer */}
            <div className="lg:col-span-8 flex flex-col border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
              
              {/* Preview Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold font-mono uppercase tracking-wider text-muted-foreground">
                    Live Sandbox / Preview
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={copyShowcaseCode}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {codeCopied ? (
                      <>
                        <Check size={12} className="text-emerald-500 animate-pulse" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Active Component Live Sandbox */}
              <div className="flex-1 min-h-[380px] flex items-center justify-center p-8 bg-muted/10 relative overflow-hidden">
                
                {/* 1. DIALOG / MODAL SHOWCASE */}
                {selectedComponent === "modal" && (
                  <div className="flex flex-col items-center justify-center text-center">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-md"
                    >
                      <Sparkles size={16} />
                      Trigger Project Dialog
                    </button>
                    <p className="text-xs text-muted-foreground mt-4 max-w-xs leading-relaxed">
                      Click the button above to launch the interactive modal. It has full escape key close support and a backdrop-blur mask.
                    </p>

                    <AnimatePresence>
                      {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                          />

                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", duration: 0.35 }}
                            className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl z-10 overflow-hidden"
                          >
                            <button
                              onClick={() => setIsModalOpen(false)}
                              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-full transition-colors"
                            >
                              <X size={16} />
                            </button>

                            <AnimatePresence mode="wait">
                              {!modalSuccess ? (
                                <motion.div
                                  key="form"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <h3 className="text-lg font-bold tracking-tight">Create New Project</h3>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Configure your development environment.
                                  </p>

                                  <form onSubmit={handleModalSubmit} className="space-y-4 mt-5">
                                    <div className="space-y-1.5">
                                      <label className="text-xs font-semibold text-muted-foreground">Project Name</label>
                                      <input
                                        type="text"
                                        required
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        placeholder="e.g. Acme Dashboard"
                                        className="w-full h-9 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring"
                                      />
                                    </div>

                                    <div className="space-y-1.5">
                                      <label className="text-xs font-semibold text-muted-foreground">Description (Optional)</label>
                                      <textarea
                                        value={projectDesc}
                                        onChange={(e) => setProjectDesc(e.target.value)}
                                        placeholder="Briefly describe what this project does..."
                                        rows={3}
                                        className="w-full rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring resize-none"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">Category</label>
                                        <select
                                          value={projectCategory}
                                          onChange={(e) => setProjectCategory(e.target.value)}
                                          className="w-full h-9 rounded-lg border border-border bg-muted/40 px-2 text-xs text-foreground focus:outline-none focus:border-ring"
                                        >
                                          <option value="web">Web Application</option>
                                          <option value="ai">AI / LLM Integration</option>
                                          <option value="mobile">Mobile App</option>
                                        </select>
                                      </div>

                                      <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">Visibility</label>
                                        <div className="flex bg-muted/50 rounded-lg p-0.5 border border-border text-[11px] h-9 items-center">
                                          <button
                                            type="button"
                                            onClick={() => setProjectVisibility("public")}
                                            className={`flex-1 text-center h-full rounded font-medium transition-colors ${
                                              projectVisibility === "public" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                                            }`}
                                          >
                                            Public
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setProjectVisibility("private")}
                                            className={`flex-1 text-center h-full rounded font-medium transition-colors ${
                                              projectVisibility === "private" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                                            }`}
                                          >
                                            Private
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-6 pt-2 border-t border-border">
                                      <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="h-9 px-4 rounded-lg border border-border text-xs font-semibold hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="h-9 px-4 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                                      >
                                        {isSubmitting ? (
                                          <span className="h-3 w-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                        ) : "Create Project"}
                                      </button>
                                    </div>
                                  </form>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="success"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="flex flex-col items-center justify-center py-8 text-center"
                                >
                                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                                    <Check className="h-6 w-6 text-emerald-500" />
                                  </div>
                                  <h3 className="text-base font-bold text-foreground">Project Created successfully</h3>
                                  <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                                    Project &quot;{projectName}&quot; has been initialized. Closing window...
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 2. PASSWORD VALIDATOR SHOWCASE */}
                {selectedComponent === "input" && (
                  <div className="w-full max-w-sm flex flex-col gap-4">
                    <div className="relative">
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                        Create Secure Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Type password..."
                          className="w-full h-9 rounded-lg border border-border bg-card px-3 pr-10 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-muted-foreground">Strength Metrics</span>
                        <span className={`font-semibold ${
                          passwordStrength <= 1 ? "text-rose-500" : passwordStrength <= 3 ? "text-amber-500" : "text-emerald-500"
                        }`}>
                          {passwordStrength === 0 ? "Empty" : passwordStrength <= 1 ? "Weak" : passwordStrength <= 3 ? "Fair" : "Strong"}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-muted border border-border/60 rounded-full overflow-hidden flex gap-0.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-full flex-1 transition-all duration-300 ${
                              level <= passwordStrength 
                                ? passwordStrength <= 1 
                                  ? "bg-rose-500" 
                                  : passwordStrength <= 3 
                                    ? "bg-amber-500" 
                                    : "bg-emerald-500"
                                : "bg-transparent"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="space-y-1.5 pt-2">
                        {[
                          { key: "length", label: "Minimum 8 characters long" },
                          { key: "uppercase", label: "Contains an uppercase letter (A-Z)" },
                          { key: "number", label: "Contains at least one number (0-9)" },
                          { key: "special", label: "Contains a special character (!@#...)" }
                        ].map((criteria) => {
                          const met = passwordCriteria[criteria.key as keyof typeof passwordCriteria];
                          return (
                            <div key={criteria.key} className="flex items-center gap-2 text-xs">
                              {met ? (
                                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-border shrink-0 flex items-center justify-center text-[8px] text-muted-foreground/60">•</span>
                              )}
                              <span className={met ? "text-foreground font-medium" : "text-muted-foreground"}>
                                {criteria.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. VOLUME SLIDER SHOWCASE */}
                {selectedComponent === "slider" && (
                  <div className="w-full max-w-xs flex flex-col gap-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Volume Control</span>
                      <span className="font-mono bg-muted border border-border px-1.5 py-0.5 rounded text-[11px] font-semibold text-foreground">
                        {sliderVal}%
                      </span>
                    </div>

                    <div className="relative py-4 flex items-center select-none w-full">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderVal}
                        onChange={(e) => setSliderVal(Number(e.target.value))}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground border border-border"
                      />
                      
                      <div 
                        className="absolute bottom-6 bg-foreground text-background text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-md pointer-events-none transform -translate-x-1/2 transition-all duration-75"
                        style={{ left: `${sliderVal}%` }}
                      >
                        {sliderVal}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                      <span>MUTE</span>
                      <span>50%</span>
                      <span>MAX</span>
                    </div>
                  </div>
                )}

                {/* 4. SEGMENTED TABS SHOWCASE */}
                {selectedComponent === "tabs" && (
                  <div className="w-full max-w-sm flex flex-col gap-5">
                    <div className="relative grid grid-cols-3 bg-muted/60 p-1 border border-border rounded-xl">
                      {[
                        { id: "account", label: "Account", icon: User },
                        { id: "security", label: "Security", icon: Lock },
                        { id: "alerts", label: "Alerts", icon: Bell },
                      ].map((tab) => {
                        const IconComp = tab.icon;
                        const isSelected = activeShowcaseTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveShowcaseTab(tab.id)}
                            className="relative flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all focus-visible:outline-none"
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="showcase-tabs"
                                className="absolute inset-0 bg-card border border-border rounded-lg shadow-sm"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                            <span className="relative z-10 flex items-center gap-1">
                              <IconComp size={12} className={isSelected ? "text-foreground" : "text-muted-foreground"} />
                              <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>
                                {tab.label}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-5 border border-border rounded-xl bg-card min-h-[120px] flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {activeShowcaseTab === "account" && (
                          <motion.div
                            key="account"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="space-y-2"
                          >
                            <h4 className="text-xs font-bold text-foreground">Profile Information</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Manage user profile identifiers, username handles, and workspace email routing preferences.
                            </p>
                          </motion.div>
                        )}

                        {activeShowcaseTab === "security" && (
                          <motion.div
                            key="security"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="space-y-2"
                          >
                            <h4 className="text-xs font-bold text-foreground">Security Credentials</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Configure multi-factor authentication codes, rotate API developer keys, and audit active browser sessions.
                            </p>
                          </motion.div>
                        )}

                        {activeShowcaseTab === "alerts" && (
                          <motion.div
                            key="alerts"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="space-y-2"
                          >
                            <h4 className="text-xs font-bold text-foreground">Alert Levels</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Setup email notification triggers, webhooks alerts, and billing threshold messages.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* 5. HOVER AVATAR GROUP SHOWCASE */}
                {selectedComponent === "avatar" && (
                  <div className="flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center -space-x-3.5 select-none py-4">
                      {[
                        { id: 1, name: "Sarah Chen", role: "Design Lead", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" },
                        { id: 2, name: "Alex Rivera", role: "Frontend Dev", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
                        { id: 3, name: "Elena Rostova", role: "Product Manager", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
                        { id: 4, name: "Marcus Vance", role: "Security Spec", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" },
                        { id: 5, name: "Amara Okafor", role: "DevOps Engineer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" },
                      ].map((user, idx) => (
                        <div
                          key={user.id}
                          className="relative"
                          onMouseEnter={() => setHoveredAvatar(user.id)}
                          onMouseLeave={() => setHoveredAvatar(null)}
                        >
                          <motion.img
                            src={user.img}
                            alt={user.name}
                            className="w-11 h-11 rounded-full border-2 border-card bg-muted object-cover cursor-pointer ring-1 ring-border"
                            style={{ zIndex: hoveredAvatar === user.id ? 20 : idx }}
                            whileHover={{ scale: 1.15, y: -2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          />
                          
                          <AnimatePresence>
                            {hoveredAvatar === user.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                className="absolute bottom-14 left-1/2 transform -translate-x-1/2 z-30 bg-foreground text-background text-[10px] py-1.5 px-2.5 rounded-lg shadow-lg border border-border whitespace-nowrap flex flex-col items-center"
                              >
                                <span className="font-bold">{user.name}</span>
                                <span className="opacity-80 text-[9px] mt-0.5">{user.role}</span>
                                <div className="w-1.5 h-1.5 bg-foreground rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center max-w-xs">
                      Hover over any avatar to expand the layout profile bubble. Uses spring motion mechanics.
                    </p>
                  </div>
                )}

                {/* 6. ACCORDION SHOWCASE */}
                {selectedComponent === "accordion" && (
                  <div className="w-full max-w-md flex flex-col gap-3">
                    {[
                      { id: "1", q: "Is NexoreUI customizable?", a: "Yes. You can copy the code directly and change utility classes or CSS properties to fit your brand identity." },
                      { id: "2", q: "Does it support TypeScript?", a: "Fully. All component properties are strictly typed, offering automatic autocompletion in your editor." },
                      { id: "3", q: "Are Radix primitives required?", a: "Yes, Radix UI primitives power the focus managers, keyboard tabs access, and screen-reader tags." },
                    ].map((item) => {
                      const isOpen = activeAccordion === item.id;
                      return (
                        <div key={item.id} className="border border-border rounded-xl bg-card overflow-hidden">
                          <button
                            onClick={() => setActiveAccordion(isOpen ? null : item.id)}
                            className="w-full flex items-center justify-between p-4 text-xs font-bold text-foreground text-left focus:outline-none hover:bg-muted/30"
                          >
                            <span>{item.q}</span>
                            <span className={`text-muted-foreground transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
                          </button>
                          
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40 bg-muted/10">
                                  {item.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 7. ALERT SHOWCASE */}
                {selectedComponent === "alert" && (
                  <div className="w-full max-w-md flex flex-col gap-4">
                    {/* Toggle Alert buttons */}
                    <div className="flex gap-2 justify-center mb-2">
                      {(["info", "success", "danger"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setAlertVariant(v)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors capitalize ${
                            alertVariant === v 
                              ? "bg-foreground text-background border-transparent" 
                              : "bg-card text-muted-foreground border-border hover:text-foreground"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {alertVariant === "info" && (
                        <motion.div
                          key="info"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-500"
                        >
                          <InfoIcon size={16} className="shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold leading-none">System Update Running</h4>
                            <p className="text-[11px] opacity-90 leading-relaxed">
                              System core is updating assets cache directories. Estimated delay is 2 minutes.
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {alertVariant === "success" && (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                        >
                          <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold leading-none">Compilation Successful</h4>
                            <p className="text-[11px] opacity-90 leading-relaxed">
                              All packages built and optimized static HTML static files exported.
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {alertVariant === "danger" && (
                        <motion.div
                          key="danger"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500"
                        >
                          <AlertCircle size={16} className="shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold leading-none">Deployment Failed</h4>
                            <p className="text-[11px] opacity-90 leading-relaxed">
                              Authentication keys credentials rejected by production target node.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 8. TOOLTIP SHOWCASE */}
                {selectedComponent === "tooltip" && (
                  <div className="relative flex flex-col items-center justify-center">
                    <button
                      onMouseEnter={() => setIsTooltipHovered(true)}
                      onMouseLeave={() => setIsTooltipHovered(false)}
                      className="px-5 py-2.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold transition-colors"
                    >
                      Hover Tooltip Target
                    </button>

                    <AnimatePresence>
                      {isTooltipHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute -top-12 bg-foreground text-background text-[11px] py-1.5 px-3 rounded-lg shadow-lg border border-border z-10 whitespace-nowrap"
                        >
                          This is a custom interactive tooltip.
                          <div className="w-1.5 h-1.5 bg-foreground rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 9. SWITCH / TOGGLE SHOWCASE */}
                {selectedComponent === "switch" && (
                  <div className="w-full max-w-xs flex flex-col gap-4">
                    <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-card">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-foreground">Airplane Mode</span>
                        <span className="text-[10px] text-muted-foreground">Disable network activities.</span>
                      </div>
                      <button
                        onClick={() => setAirplaneMode(!airplaneMode)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none border border-border/40 ${
                          airplaneMode ? "bg-foreground" : "bg-muted"
                        }`}
                      >
                        <motion.div
                          layout
                          className={`w-3.5 h-3.5 rounded-full bg-background ${
                            airplaneMode ? "ml-4" : ""
                          }`}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-card">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-foreground">Marketing Alerts</span>
                        <span className="text-[10px] text-muted-foreground">Receive promo campaign letters.</span>
                      </div>
                      <button
                        onClick={() => setMarketingEmails(!marketingEmails)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none border border-border/40 ${
                          marketingEmails ? "bg-foreground" : "bg-muted"
                        }`}
                      >
                        <motion.div
                          layout
                          className={`w-3.5 h-3.5 rounded-full bg-background ${
                            marketingEmails ? "ml-4" : ""
                          }`}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* 10. PROGRESS SHOWCASE */}
                {selectedComponent === "progress" && (
                  <div className="w-full max-w-xs flex flex-col gap-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">File Compilation</span>
                      <span className="font-mono text-[11px] font-bold">{simProgress}%</span>
                    </div>

                    <div className="w-full h-2 bg-muted border border-border/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-foreground transition-all duration-300 ease-out" 
                        style={{ width: `${simProgress}%` }}
                      />
                    </div>

                    <button
                      onClick={runProgressSimulation}
                      disabled={isSimulating}
                      className="self-center h-8 px-4 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                      {isSimulating ? "Processing..." : "Run Simulation"}
                    </button>
                  </div>
                )}

              </div>

              {/* Code Snippet Display Area */}
              <div className="border-t border-border bg-muted/20">
                <div className="px-6 py-2.5 flex items-center justify-between border-b border-border bg-muted/40">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Code size={13} />
                    <span className="font-semibold font-mono">CODE IMPLEMENTATION</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/60 font-mono">React / Radix UI / Tailwind CSS</span>
                </div>
                <div className="relative font-mono text-[11px] p-5 max-h-[220px] overflow-y-auto bg-zinc-950 text-zinc-300">
                  <pre className="whitespace-pre-wrap leading-relaxed select-text">
                    {getCodeSnippet(selectedComponent, ALL_COMPONENTS.find(c => c.id === selectedComponent)?.name || "")}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ALL COMPONENTS DIRECTORY SECTION */}
      <section id="directory" className="border-t border-border bg-card/10 py-24 scroll-mt-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Component Directory
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Browse all 38 primitive and composite components included in NexoreUI. Filter by category or search instantly.
            </p>
          </div>

          {/* Directory Filtering Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search components..."
                value={dirSearch}
                onChange={(e) => setDirSearch(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-card pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring"
              />
              {dirSearch && (
                <button 
                  onClick={() => setDirSearch("")} 
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex bg-muted/60 p-0.5 border border-border rounded-lg text-xs overflow-x-auto w-full sm:w-auto max-w-full">
              {[
                { id: "all", label: "All" },
                { id: "primitives", label: "Primitives" },
                { id: "overlays", label: "Overlays" },
                { id: "layout", label: "Layout" },
                { id: "animations", label: "Motion" },
                { id: "pro", label: "Pro/Special" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDirCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                    dirCategory === tab.id 
                      ? "bg-card text-foreground shadow-sm font-semibold" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Cards Grid */}
          {filteredDirectory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredDirectory.map((comp) => (
                <Link 
                  key={comp.id}
                  href={comp.id === "installation" ? "/docs/installation" : comp.id === "icons" ? "/docs/icons" : `/docs/components/${comp.id}`}
                  className="flex flex-col justify-between p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all group hover:-translate-y-0.5 duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center rounded-full bg-muted border border-border/80 px-2 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        {comp.category}
                      </span>
                      {comp.hasInteractive && (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Interactive demo available" />
                      )}
                    </div>
                    
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {comp.name}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                      {comp.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border/40 flex justify-end">
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground group/btn transition-colors"
                    >
                      <span>View Documentation</span>
                      <ArrowRight size={12} className="transform group-hover/btn:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">No components found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search keywords.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Core Features Summary */}
      <section className="border-t border-border bg-card/10">
        <div className="max-w-screen-xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightweight & Fast",
                desc: "Zero-bloat components optimized for maximum performance, clean bundle sizes and smooth Framer Motion runs."
              },
              {
                icon: Shield,
                title: "Radix UI Powered",
                desc: "Unstyled, accessible primitives build the foundation. Keyboard navigation and screen reader support out of the box."
              },
              {
                icon: Sparkles,
                title: "Beautiful Animations",
                desc: "Meticulously crafted micro-interactions. Subtle, fluid, and premium motion design that makes your site feel alive."
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted border border-border text-foreground mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

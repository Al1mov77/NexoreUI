export const templateAgencyCreative = {
  name: "template-agency-creative",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-agency-creative.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Layers,
  Code2,
  Cpu,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  X,
  Menu,
  Sliders,
  Calendar,
  ShieldCheck,
  Check,
  ExternalLink,
} from "lucide-react";

export interface AgencyCreativeTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function AgencyCreativeTemplate({
  brandName = "Vanguard Digital",
  theme = "dark",
}: AgencyCreativeTemplateProps) {
  
    const isDark = theme === "dark";

  const [activeService, setActiveService] = useState<number>(0);
  const [budgetSlider, setBudgetSlider] = useState(45); // $45k
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const services = [
    {
      num: "01",
      title: "Real-Time 3D & WebGL Systems",
      desc: "Custom GLSL fragment shaders, physics simulation, and 60FPS fluid canvas architectures built for enterprise hardware scales.",
      deliverables: ["Custom Shaders", "Asset Compression Pipeline", "Sub-200ms TTFB", "Spatial Interaction"],
      leadTime: "3-4 Weeks",
      focus: "Hardware Accelerated",
    },
    {
      num: "02",
      title: "Design Systems & Token Architecture",
      desc: "Multi-brand token architectures, accessible primitive engines, and automated NPM distribution pipelines for Fortune 500 engineering teams.",
      deliverables: ["WCAG AAA Compliant", "Figma Token Sync", "Automated Playwright Tests", "Zero-Runtime CSS"],
      leadTime: "4-6 Weeks",
      focus: "Design Ops & Code",
    },
    {
      num: "03",
      title: "Autonomous Agentic Interfaces",
      desc: "Generative UI workflows, streaming multimodal canvas surfaces, and natural language command systems engineered for high-trust workflows.",
      deliverables: ["Zero-Latency Streaming", "Edge Quantization", "State Machine Sync", "Sandboxed Evaluation"],
      leadTime: "6-8 Weeks",
      focus: "AI Reasoning UX",
    },
  ];

  const recentPartners = [
    { name: "Vercel Ecosystem", category: "Framework Infrastructure" },
    { name: "Monolith Robotics", category: "Autonomous Systems" },
    { name: "Kinetix Bio", category: "Computational Genomics" },
    { name: "Hyperion Capital", category: "Quantitative Treasury" },
  ];

  return (
    <div
      className="w-full min-h-screen transition-colors text-left font-sans"
      
    >
      {/* Top Global Ticker */}
      <div
        className="w-full py-2.5 px-4 sm:px-6 text-xs font-mono border-b flex items-center justify-between transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          color: "#9aa0aa",
        }}
      >
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NYC 09:42 EST</span>
          </span>
          <span className="hidden sm:inline">LDN 14:42 GMT</span>
          <span className="hidden md:inline">TYO 23:42 JST</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block px-2.5 py-1 rounded border text-xs font-semibold" >
            Q3 Bandwidth: 2 Sprints Open
          </span>
        </div>
      </div>

      {/* Studio Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4" />
              <span
                className="font-extrabold text-sm sm:text-base tracking-tight uppercase"
                
              >
                {brandName || "Vanguard Digital"}
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-wider" >
            <a href="#capabilities" className="hover:text-[#f4f4f7] transition-colors">
              Capabilities
            </a>
            <a href="#partners" className="hover:text-[#f4f4f7] transition-colors">
              Selected Work
            </a>
            <a href="#estimator" className="hover:text-[#f4f4f7] transition-colors">
              Investment Model
            </a>
            <a href="#studio" className="hover:text-[#f4f4f7] transition-colors">
              Studio Dossier
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProposalModalOpen(true)}
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 shrink-0"
              
            >
              <span>Initiate Sprint</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b overflow-hidden"
              
            >
              <div className="px-4 py-4 space-y-3 text-xs uppercase font-medium">
                <a
                  href="#capabilities"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Studio Capabilities
                </a>
                <a
                  href="#partners"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Selected Client Partners
                </a>
                <a
                  href="#estimator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Scope & Investment Calculator
                </a>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsProposalModalOpen(true);
                  }}
                  className="w-full text-left py-2.5 text-[#6366f1] font-bold flex items-center justify-between"
                >
                  <span>Request Studio Pitch</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 lg:pt-28 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider mb-6" >
            <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
            <span>Digital Product Engineering Studio • Global</span>
          </div>

          <h1
            className="text-2xl @xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.08] mb-6"
            
          >
            We engineer singular digital products that define categorical market leadership.
          </h1>

          <p className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mb-8" >
            Operating at the intersection of high-fidelity interface design, real-time graphics engineering, and autonomous agent orchestration for world-defining technology institutions.
          </p>
        </div>

        {/* Studio Impact Metric Ledger */}
        <div
          className="grid grid-cols-1 @xs:grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border shadow-sm mt-8"
          
        >
          <div className="space-y-1">
            <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#6366f1]">$1.8B+</p>
            <p className="text-xs uppercase font-semibold" >Valuation Created</p>
            <p className="text-xs font-mono" >Across 18 enterprise exits</p>
          </div>
          <div className="space-y-1 @xs:border-l @xs:pl-4" >
            <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight">42</p>
            <p className="text-xs uppercase font-semibold" >Design Systems</p>
            <p className="text-xs font-mono" >Enterprise token pipelines</p>
          </div>
          <div className="space-y-1 md:border-l md:pl-4" >
            <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight">99.8%</p>
            <p className="text-xs uppercase font-semibold" >Sprint Velocity SLA</p>
            <p className="text-xs font-mono" >Weekly zero-defect releases</p>
          </div>
          <div className="space-y-1 @xs:border-l @xs:pl-4" >
            <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight">14x</p>
            <p className="text-xs uppercase font-semibold" >Industry Honors</p>
            <p className="text-xs font-mono" >Awwwards SOTD & Red Dot Best</p>
          </div>
        </div>
      </section>

      {/* Selected Client Partners Strip */}
      <section id="partners" className="py-12 border-y transition-colors" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <span className="text-xs font-mono uppercase tracking-widest font-semibold" >
              Selected Collaborative Engagements
            </span>
            <span className="text-xs font-mono" >
              Deployments 2024–2026
            </span>
          </div>

          <div className="grid grid-cols-1 @xs:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentPartners.map((p, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.01]"
                
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm sm:text-base tracking-tight">{p.name}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-50" />
                </div>
                <span className="text-xs font-mono" >
                  {p.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Capabilities Section */}
      <section id="capabilities" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-2 text-[#6366f1] font-semibold">
              Studio Core Practices
            </p>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
              
            >
              Architectural Capabilities
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono max-w-xs" >
            Select any capability domain to inspect engineering deliverables and typical turnaround cycles.
          </p>
        </div>

        <div className="space-y-4">
          {services.map((svc, idx) => (
            <div
              key={idx}
              onClick={() => setActiveService(idx)}
              className={\`p-6 sm:p-8 rounded-2xl border cursor-pointer transition-all shadow-sm \${
                activeService === idx
                  ? "ring-2 shadow-md"
                  : "hover:scale-[1.005] opacity-80 hover:opacity-100"
              }\`}
              style={{
                backgroundColor: activeService === idx ? "#181a24" : "#12141c",
                borderColor: activeService === idx ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                borderRadius: "0.75rem",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-sm sm:text-base font-bold text-[#6366f1]">
                    {svc.num}
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3
                        className="text-lg sm:text-xl font-bold tracking-tight"
                        
                      >
                        {svc.title}
                      </h3>
                      <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-xs font-mono border" >
                        {svc.focus}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed max-w-2xl" >
                      {svc.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono shrink-0">
                  <span className="text-xs" >Lead: {svc.leadTime}</span>
                  <div className="p-1.5 rounded-lg border" >
                    <ArrowUpRight
                      className={\`h-4 w-4 transition-transform duration-300 \${
                        activeService === idx ? "rotate-45 text-[#6366f1]" : ""
                      }\`}
                    />
                  </div>
                </div>
              </div>

              {activeService === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 pt-5 border-t space-y-4"
                  
                >
                  <p className="text-xs font-mono font-semibold uppercase tracking-wider" >
                    Guaranteed Architectural Deliverables:
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {svc.deliverables.map((del, dIdx) => (
                      <span
                        key={dIdx}
                        className="px-3 py-1.5 rounded-lg border flex items-center gap-2 shadow-sm"
                        
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{del}</span>
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Scope & Investment Estimator */}
      <section id="estimator" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div
          className="p-6 sm:p-10 rounded-2xl border shadow-xl transition-all"
          
        >
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6366f1] font-semibold mb-2">
              <Sliders className="h-4 w-4" />
              <span>Dedicated Sprint Calibration</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
              
            >
              Interactive Scope & Investment Estimator
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed" >
              Select your capital commitment to calibrate allocated engineering staff, weekly sprint volume, and time-to-production cadence.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" >
              <div>
                <span className="text-xs font-mono uppercase font-semibold" >
                  Target Sprint Allocation
                </span>
                <p className="text-xs" >Fixed weekly retainers with zero scope-creep</p>
              </div>
              <span className="font-mono text-3xl font-bold text-[#6366f1]">
                \${budgetSlider},000 <span className="text-xs font-normal opacity-60">USD</span>
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min={20}
                max={120}
                step={5}
                value={budgetSlider}
                onChange={(e) => setBudgetSlider(Number(e.target.value))}
                className="w-full cursor-pointer h-2.5 rounded-lg appearance-none bg-zinc-200 dark:bg-zinc-800 accent-[#6366f1]"
                style={{ accentColor: "#6366f1" }}
              />
              <div className="flex justify-between text-xs font-mono" >
                <span>$20k (Focused Sprint)</span>
                <span>$60k (Standard Multi-Team)</span>
                <span>$120k (Full Platform Build)</span>
              </div>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t text-xs font-mono"
              
            >
              <div className="p-4 rounded-xl border" >
                <p className="text-xs uppercase font-semibold mb-1" >
                  ESTIMATED RUNTIME
                </p>
                <p className="font-bold text-sm">
                  {Math.round(budgetSlider / 10)} to {Math.round(budgetSlider / 7)} Weeks
                </p>
              </div>
              <div className="p-4 rounded-xl border" >
                <p className="text-xs uppercase font-semibold mb-1" >
                  ENGINEERING SQUAD
                </p>
                <p className="font-bold text-sm">
                  {budgetSlider > 60
                    ? "Principal Lead + 3 Senior Eng + 1 3D"
                    : "Lead Designer + 2 Full-Stack Eng"}
                </p>
              </div>
              <div className="p-4 rounded-xl border" >
                <p className="text-xs uppercase font-semibold mb-1" >
                  DELIVERY CADENCE
                </p>
                <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  Continuous Weekly Releases
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setIsProposalModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                
              >
                <span>Request Scope Pitch for \${budgetSlider}k</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono" >
                Guaranteed NDA on first contact • Response within 6 business hours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* RFP / Proposal Modal */}
      <AnimatePresence>
        {isProposalModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsProposalModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl relative"
              style={{
                backgroundColor: "#12141c",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
                borderRadius: "0.75rem",
              }}
            >
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5"
                
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              {proposalSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Scope Brief Received</h3>
                  <p className="text-xs sm:text-sm max-w-sm mx-auto" >
                    Our partner engineering leads have queued your brief. We will dispatch the mutual NDA and scheduling link within 6 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setProposalSubmitted(false);
                      setIsProposalModalOpen(false);
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white"
                    
                  >
                    Return to Studio
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div>
                    <span className="text-xs font-mono text-[#6366f1] font-semibold uppercase">
                      Sprint RFP
                    </span>
                    <h3 className="text-xl font-bold tracking-tight">Initiate Engineering Scope</h3>
                    <p className="text-xs" >
                      Target allocation: \${budgetSlider},000 USD
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono mb-1 font-medium">Work Email</label>
                      <input
                        type="email"
                        placeholder="vp.eng@institution.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none focus:ring-2"
                        
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1 font-medium">Primary Focus</label>
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none"
                        
                      >
                        <option value="shaders">Real-Time 3D & WebGL</option>
                        <option value="tokens">Design Systems & Token Architecture</option>
                        <option value="agents">Autonomous Agentic Interfaces</option>
                        <option value="full">Comprehensive Full-Stack Redesign</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1 font-medium">Brief Description / Requirements</label>
                      <textarea
                        rows={3}
                        placeholder="Brief summary of target outcomes, architectural constraints, and desired launch date..."
                        className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none resize-none"
                        
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setProposalSubmitted(true)}
                    className="w-full py-3 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    
                  >
                    <span>Submit RFP Under Mutual NDA</span>
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Studio Footer */}
      <footer
        className="py-12 px-4 sm:px-6 lg:px-8 border-t text-xs transition-colors"
        
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <p>© {new Date().getFullYear()} {brandName || "Vanguard Digital"}. High-velocity product engineering.</p>
          <div className="flex items-center gap-6">
            <a href="#github" className="hover:underline">GitHub</a>
            <a href="#npm" className="hover:underline">NPM Packages</a>
            <a href="#careers" className="hover:underline">Careers (2)</a>
            <a href="#security" className="hover:underline">SOC2 Type II</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
`,
};

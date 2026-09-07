"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Check,
  X,
  Send,
  Eye,
  Award,
  Layers,
  Globe,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function CreativePortfolioPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryBudget, setInquiryBudget] = useState("$25k - $50k");

  const projects = [
    {
      id: "lumina",
      title: "Lumina Spatial Audio",
      client: "Bang & Olufsen Acoustic Lab",
      category: "Creative Direction & WebGL",
      year: "2025",
      award: "Awwwards SOTD",
      summary: "An interactive spatial audio visualizer engineered using custom GLSL shaders and real-time frequency mapping.",
      metric: "+180% Session Duration",
    },
    {
      id: "vortex",
      title: "Komorebi Timepieces",
      client: "Grand Seiko Haute Horlogerie",
      category: "Digital Flagship & E-commerce",
      year: "2024",
      award: "FWA of the Month",
      summary: "Editorial digital commerce architecture celebrating Japanese micro-artisan craftsmanship and mechanical movements.",
      metric: "$4.2M Launch Volume",
    },
    {
      id: "neural",
      title: "Monolith Architecture",
      client: "Zaha Hadid Foundation",
      category: "Exhibition Monograph",
      year: "2025",
      award: "Cannes Bronze Lion",
      summary: "Archive curation and interactive parametric building exploration for the global retrospective exhibition tour.",
      metric: "1.2M Virtual Visitors",
    },
    {
      id: "apex",
      title: "Hyperion Autonomous EV",
      client: "Hyperion Motors Sweden",
      category: "HMI & Telemetry Interface",
      year: "2024",
      award: "Red Dot Best of Best",
      summary: "In-cockpit digital instrument cluster and companion telemetry application engineered for electric hypercars.",
      metric: "Sub-16ms Framerate",
    },
  ];

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans selection:bg-indigo-500/20"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Editorial Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.88)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-base @sm:text-lg font-bold tracking-tight uppercase"
              style={{ fontFamily: "var(--template-heading-font)" }}
            >
              {config.brandName || "Studio Monolith"}
            </span>
            <span className="hidden @sm:inline text-xs @sm:text-sm" style={{ color: "var(--template-fg-muted)" }}>
              / Zurich & Tokyo
            </span>
          </div>

          <div className="flex items-center gap-3 @sm:gap-4">
            <div
              className="hidden @sm:flex items-center gap-2 text-xs"
              style={{ color: "var(--template-fg-muted)" }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Commissions</span>
            </div>

            <button
              onClick={() => setIsInquiryOpen(true)}
              className="text-xs @sm:text-sm font-semibold px-4 py-2 rounded-full text-white shadow-sm transition-all hover:brightness-110 flex items-center gap-2 shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <span>Initiate Project</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Large Editorial Statement Hero */}
      <section className="pt-12 @sm:pt-20 @lg:pt-28 pb-12 @sm:pb-16 px-4 @sm:px-6 @lg:px-8 max-w-6xl mx-auto text-left">
        <p
          className="text-xs uppercase tracking-widest font-mono mb-4"
          style={{ color: "var(--template-primary)" }}
        >
          Design Direction & Digital Architecture
        </p>

        <h1
          className="text-3xl @xs:text-4xl @sm:text-5xl @lg:text-6xl font-light tracking-tight leading-[1.12] mb-8"
          style={{ fontFamily: "var(--template-heading-font)" }}
        >
          Sculpting singular digital experiences for cultural and luxury institutions.
        </h1>

        <div
          className="grid grid-cols-1 @sm:grid-cols-3 gap-6 pt-8 border-t text-xs @sm:text-sm"
          style={{ borderColor: "var(--template-border)" }}
        >
          <div>
            <p className="font-semibold mb-1 text-sm @sm:text-base" style={{ color: "var(--template-fg)" }}>
              Curation & Strategy
            </p>
            <p className="leading-relaxed" style={{ color: "var(--template-fg-muted)" }}>
              Transforming brand narratives into sensory digital monographs.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1 text-sm @sm:text-base" style={{ color: "var(--template-fg)" }}>
              Spatial & Real-Time
            </p>
            <p className="leading-relaxed" style={{ color: "var(--template-fg-muted)" }}>
              Custom interactive 3D environments engineered for silky 60FPS fluid motion.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1 text-sm @sm:text-base" style={{ color: "var(--template-fg)" }}>
              Accolades
            </p>
            <p className="leading-relaxed" style={{ color: "var(--template-fg-muted)" }}>
              14x Awwwards SOTD, 8x FWA of the Day, Cannes Lions Bronze Winner.
            </p>
          </div>
        </div>
      </section>

      {/* Project Showcase Grid */}
      <section
        className="py-12 @sm:py-16 px-4 @sm:px-6 @lg:px-8 max-w-7xl mx-auto border-t"
        style={{ borderColor: "var(--template-border)" }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs @sm:text-sm uppercase font-mono tracking-widest opacity-60">
            Selected Monographs (2024 — 2025)
          </h2>
          <span className="text-xs @sm:text-sm font-mono" style={{ color: "var(--template-fg-muted)" }}>
            4 Featured Works
          </span>
        </div>

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-6 @sm:gap-8">
          {projects.map((proj) => (
            <motion.div
              key={proj.id}
              whileHover={{ y: -4 }}
              onClick={() => setActiveProject(proj)}
              className="cursor-pointer rounded-2xl border p-6 @sm:p-8 flex flex-col justify-between min-h-[320px] transition-all group"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
                boxShadow: "var(--template-card-shadow)",
              }}
            >
              <div>
                <div
                  className="flex items-center justify-between text-xs font-mono mb-4"
                  style={{ color: "var(--template-fg-muted)" }}
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span>{proj.award}</span>
                  </span>
                  <span>{proj.year}</span>
                </div>

                <h3
                  className="text-2xl @sm:text-3xl font-bold tracking-tight mb-2 group-hover:opacity-90 transition-opacity"
                  style={{ fontFamily: "var(--template-heading-font)", color: "var(--template-fg)" }}
                >
                  {proj.title}
                </h3>
                <p className="text-xs @sm:text-sm mb-4 font-medium" style={{ color: "var(--template-primary)" }}>
                  {proj.client}
                </p>
                <p className="text-xs @sm:text-sm leading-relaxed line-clamp-2" style={{ color: "var(--template-fg-muted)" }}>
                  {proj.summary}
                </p>
              </div>

              <div
                className="pt-4 border-t flex items-center justify-between text-xs @sm:text-sm mt-4"
                style={{ borderColor: "var(--template-border)" }}
              >
                <span style={{ color: "var(--template-fg-muted)" }}>{proj.category}</span>
                <span
                  className="flex items-center gap-1.5 font-semibold group-hover:underline"
                  style={{ color: "var(--template-primary)" }}
                >
                  <span>Explore Monograph</span>
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border p-6 @sm:p-8 shadow-2xl relative"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:opacity-75 transition-opacity"
                aria-label="Close Project Modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono mb-4 border"
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  borderColor: "rgba(245, 158, 11, 0.3)",
                  color: "#d97706",
                }}
              >
                <Award className="h-3.5 w-3.5" />
                <span>{activeProject.award}</span>
              </div>

              <h3
                className="text-2xl @sm:text-3xl font-bold mb-1.5"
                style={{ fontFamily: "var(--template-heading-font)", color: "var(--template-fg)" }}
              >
                {activeProject.title}
              </h3>
              <p className="text-xs @sm:text-sm mb-4" style={{ color: "var(--template-fg-muted)" }}>
                {activeProject.client} • {activeProject.year}
              </p>

              <p className="text-xs @sm:text-sm leading-relaxed mb-6" style={{ color: "var(--template-fg-muted)" }}>
                {activeProject.summary}
              </p>

              <div
                className="p-4 rounded-xl border flex items-center justify-between text-xs @sm:text-sm font-mono mb-6"
                style={{
                  borderColor: "var(--template-border)",
                  backgroundColor: "var(--template-surface-muted)",
                }}
              >
                <span style={{ color: "var(--template-fg-muted)" }}>Demonstrated Impact:</span>
                <span className="font-bold text-emerald-500">{activeProject.metric}</span>
              </div>

              <button
                onClick={() => {
                  alert(`Navigating to monograph: ${activeProject.title}`);
                  setActiveProject(null);
                }}
                className="w-full h-11 rounded-xl text-xs @sm:text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--template-primary)", borderRadius: "var(--template-radius)" }}
              >
                <span>View Complete Case Study</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initiate Project Modal */}
      <AnimatePresence>
        {isInquiryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsInquiryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <h3 className="font-bold text-base uppercase tracking-wider" style={{ fontFamily: "var(--template-heading-font)" }}>
                  Initiate Commission
                </h3>
                <button onClick={() => setIsInquiryOpen(false)} className="p-1 rounded hover:opacity-75">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs @sm:text-sm leading-relaxed" style={{ color: "var(--template-fg-muted)" }}>
                We accept a select number of architecture, luxury, and digital monograph commissions per quarter.
              </p>

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--template-fg-muted)" }}>
                  Target Investment Bracket
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["$15k - $25k", "$25k - $50k", "$50k - $100k", "$100k+"].map((b) => (
                    <button
                      key={b}
                      onClick={() => setInquiryBudget(b)}
                      className={`h-11 rounded-xl border text-xs @sm:text-sm font-medium transition-all flex items-center justify-center ${
                        inquiryBudget === b ? "font-semibold shadow-sm text-white" : "opacity-75"
                      }`}
                      style={{
                        backgroundColor: inquiryBudget === b ? "var(--template-primary)" : "var(--template-surface)",
                        borderColor: inquiryBudget === b ? "var(--template-primary)" : "var(--template-border)",
                        color: inquiryBudget === b ? "#ffffff" : "var(--template-fg)",
                        borderRadius: "var(--template-radius)",
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  alert("Project inquiry transmitted to Zurich & Tokyo studio partners.");
                  setIsInquiryOpen(false);
                }}
                className="w-full h-11 rounded-xl text-xs @sm:text-sm font-semibold text-white shadow-md transition-all hover:brightness-110"
                style={{ backgroundColor: "var(--template-primary)", borderRadius: "var(--template-radius)" }}
              >
                Transmit Project Proposal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer
        className="py-10 px-4 @sm:px-6 border-t text-center text-xs @sm:text-sm"
        style={{
          borderColor: "var(--template-border)",
          color: "var(--template-fg-muted)",
        }}
      >
        <p>© {new Date().getFullYear()} {config.brandName || "Studio Monolith"}. All rights reserved.</p>
      </footer>
    </div>
  );
}

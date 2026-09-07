"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  LayoutDashboard,
  FolderGit2,
  Gift,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  Terminal,
  ArrowRight,
  ExternalLink,
  Code2,
  CheckCircle2,
  ChevronRight,
  Eye,
  Sliders,
  Cpu,
  Layers,
  CreditCard,
  ShoppingBag,
  Briefcase,
  Bot,
  Kanban,
  FileText,
} from "lucide-react";
import { TEMPLATES, TemplateItem } from "../../../data/templates";
import { RenderTemplatePreview } from "../../templates/TemplatePreviews";
import { TemplatePreviewWrapper } from "../../templates/TemplatePreviewWrapper";
import { TemplateCustomizerProvider, useTemplateCustomizer, DeviceMode } from "../../../context/TemplateCustomizerContext";

const TEMPLATE_ICONS: Record<string, React.ElementType> = {
  "template-ai-startup": Cpu,
  "template-modern-saas": Layers,
  "template-analytics-dashboard": LayoutDashboard,
  "template-devtools-cli": Terminal,
  "template-creative-portfolio": FolderGit2,
  "template-fintech-app": CreditCard,
  "template-ecommerce-store": ShoppingBag,
  "template-agency-creative": Briefcase,
  "template-ai-chat": Bot,
  "template-project-management": Kanban,
  "template-startup-waitlist": Gift,
  "template-docs-platform": FileText,
};

function TemplatesShowcaseContent() {
  const [activeTemplateId, setActiveTemplateId] = useState<string>("template-ai-startup");
  const { deviceMode, setDeviceMode } = useTemplateCustomizer();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  const activeTemplate = TEMPLATES.find((t) => t.id === activeTemplateId) || TEMPLATES[0];

  const handleCopyCode = () => {
    if (!activeTemplate) return;
    navigator.clipboard.writeText(activeTemplate.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyCli = () => {
    if (!activeTemplate) return;
    navigator.clipboard.writeText(activeTemplate.cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <section className="py-24 px-4 sm:px-6 border-t border-border/50 relative z-10 overflow-hidden" id="templates">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary/[0.06] via-fuchsia-500/[0.03] to-transparent blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-gradient-to-tl from-indigo-500/[0.04] to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-4"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>PRODUCTION TEMPLATES</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-3 leading-tight"
            >
              Ship in Hours,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-cyan-400">
                Not Weeks
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-muted-foreground leading-relaxed"
            >
              12 unique, production-ready architectures built with NexoreUI components and Tailwind CSS v4.
              Customize design tokens in real-time, test viewports, or copy the clean code.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium shadow-sm hover:brightness-110 transition-all group"
            >
              <span>Explore All 12 Starters</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Template Switcher Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar"
        >
          {TEMPLATES.map((tmpl) => {
            const IconComp = TEMPLATE_ICONS[tmpl.id] || Sparkles;
            const isActive = tmpl.id === activeTemplateId;

            return (
              <button
                key={tmpl.id}
                onClick={() => setActiveTemplateId(tmpl.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-semibold border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border-transparent"
                }`}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tmpl.title}</span>
                <span className="sm:hidden">{tmpl.category}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white font-bold"
                      : "bg-white/5 text-muted-foreground"
                  }`}
                >
                  {tmpl.badge}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Interactive Player Frame */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-border/60 bg-card/30 backdrop-blur-2xl shadow-2xl shadow-black/20 overflow-hidden"
        >
          {/* Top Bar */}
          <div className="px-4 py-3 border-b border-border/50 bg-muted/10 flex flex-wrap items-center justify-between gap-3">
            {/* Window dots + info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block hover:bg-red-500 transition-colors" />
                <span className="w-3 h-3 rounded-full bg-amber-500/70 inline-block hover:bg-amber-500 transition-colors" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/70 inline-block hover:bg-emerald-500 transition-colors" />
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-background/60 border border-border/40">
                <div className="h-3 w-3 rounded-sm bg-primary/20 flex items-center justify-center">
                  <span className="text-[6px] text-primary font-bold">N</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {activeTemplate.slug}.nexoreui.site
                </span>
              </div>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-background/60 border border-border/50 text-xs shadow-xs">
              {([
                { mode: "desktop" as DeviceMode, icon: Monitor, label: "100%" },
                { mode: "tablet" as DeviceMode, icon: Tablet, label: "768px" },
                { mode: "mobile" as DeviceMode, icon: Smartphone, label: "390px" },
              ]).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setDeviceMode(mode)}
                  title={`${mode} (${label})`}
                  className={`p-1.5 rounded-lg transition-all ${
                    deviceMode === mode
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/templates?template=${activeTemplate.slug}&mode=customize`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium shadow-sm hover:brightness-110 transition-all"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Customize</span>
              </Link>

              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/80 hover:bg-background border border-border text-xs font-medium text-foreground transition-all shadow-xs"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                <span>{copiedCode ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Viewport Frame with native TemplatePreviewWrapper */}
          <div className="p-3 sm:p-6 bg-zinc-950 flex items-center justify-center min-h-[520px]">
            <TemplatePreviewWrapper maxHeight="max-h-[660px]">
              <RenderTemplatePreview templateId={activeTemplate.id} />
            </TemplatePreviewWrapper>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function TemplatesShowcaseSection() {
  return (
    <TemplateCustomizerProvider>
      <TemplatesShowcaseContent />
    </TemplateCustomizerProvider>
  );
}

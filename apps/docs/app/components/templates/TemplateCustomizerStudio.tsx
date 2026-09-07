"use client";

import React, { useState } from "react";
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
  ChevronDown,
  Check,
  Zap,
  Terminal,
  Shield,
  Compass,
  Cpu,
  Flame,
  Activity,
  Box,
  Eye,
} from "lucide-react";
import {
  useTemplateCustomizer,
  TEMPLATE_COLOR_PRESETS,
  FONT_OPTIONS,
  TemplateColorPreset,
  TemplateFontFamily,
  TemplateRadius,
  TemplateDensity,
  TemplateMotion,
  TemplateLogoIcon,
} from "../../context/TemplateCustomizerContext";
import { TemplateItem } from "../../data/templates";
import { RenderTemplatePreview } from "./TemplatePreviews";
import { TemplatePreviewWrapper } from "./TemplatePreviewWrapper";
import { TemplateCodeExportModal } from "./TemplateCodeExportModal";

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
    resetToTemplateDefaults,
    deviceMode,
    setDeviceMode,
  } = useTemplateCustomizer();

  const [activeSection, setActiveSection] = useState<"brand" | "colors" | "typography" | "layout" | "appearance">("colors");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [customHexInput, setCustomHexInput] = useState(config.colors.primary);

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

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
      {/* Studio Top Navigation Bar */}
      <header className="h-14 border-b border-white/10 px-4 flex items-center justify-between bg-zinc-950/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
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

        {/* Viewport switchers & theme quick toggle */}
        <div className="hidden md:flex items-center gap-2">
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
        {/* Left Pane: Customization Controls (width: ~340px) */}
        <aside className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-white/10 bg-zinc-950 p-4 sm:p-5 overflow-y-auto no-scrollbar shrink-0 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Section Tabs */}
            <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-zinc-900 border border-white/10 text-xs">
              {[
                { id: "colors", label: "Colors", icon: Palette },
                { id: "brand", label: "Brand", icon: Sparkles },
                { id: "typography", label: "Fonts", icon: Type },
                { id: "layout", label: "Layout", icon: Layout },
                { id: "appearance", label: "Theme", icon: Sun },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id as any)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${
                    activeSection === s.id
                      ? "bg-white/15 text-white font-bold shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <s.icon className="h-3.5 w-3.5" />
                  <span className="text-[10px]">{s.label}</span>
                </button>
              ))}
            </div>

            {/* 1. Colors Controls */}
            {activeSection === "colors" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2.5">
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
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                            isSelected
                              ? "bg-white/10 border-white text-white font-semibold"
                              : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <div
                            className="h-4 w-4 rounded-full border border-white/20 shadow-sm shrink-0"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <span className="truncate text-[11px]">{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Input */}
                <div className="pt-3 border-t border-white/10">
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
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
                      className="h-8 w-8 rounded-lg cursor-pointer bg-transparent border border-white/10"
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
                      className="w-full p-2 rounded-lg border border-white/10 bg-zinc-900 font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. Brand & Logo Controls */}
            {activeSection === "brand" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Brand / Company Name
                  </label>
                  <p className="text-[11px] text-zinc-400 mb-2">
                    Updates headers, titles, and logos in real-time.
                  </p>
                  <input
                    type="text"
                    value={config.brandName}
                    onChange={(e) => updateConfig({ brandName: e.target.value })}
                    placeholder="e.g. Acme Studio"
                    className="w-full p-2.5 rounded-lg border border-white/10 bg-zinc-900 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Logo Icon Glyph
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {logoOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => updateConfig({ logoIcon: opt.id })}
                        title={opt.label}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                          config.logoIcon === opt.id
                            ? "bg-white/20 border-white text-white scale-105"
                            : "border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <opt.icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. Typography Controls */}
            {activeSection === "typography" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Body Font Family
                  </label>
                  <div className="space-y-1.5">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => updateConfig({ typography: { ...config.typography, fontFamily: font.id } })}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          config.typography.fontFamily === font.id
                            ? "bg-white/15 border-white text-white font-bold"
                            : "border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <div>
                          <p className="font-semibold" style={{ fontFamily: `'${font.id}', sans-serif` }}>
                            {font.label}
                          </p>
                          <p className="text-[10px] text-zinc-500">{font.sample}</p>
                        </div>
                        {config.typography.fontFamily === font.id && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Heading Font Family
                  </label>
                  <select
                    value={config.typography.headingFont}
                    onChange={(e) =>
                      updateConfig({
                        typography: { ...config.typography, headingFont: e.target.value as TemplateFontFamily },
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-white/10 bg-zinc-900 text-xs text-white focus:outline-none"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* 4. Layout & Spacing */}
            {activeSection === "layout" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Border Radius
                  </label>
                  <div className="grid grid-cols-5 gap-1.5 text-xs">
                    {(["sharp", "small", "medium", "large", "full"] as TemplateRadius[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => updateConfig({ ui: { ...config.ui, radius: r } })}
                        className={`py-2 rounded-lg border capitalize text-[11px] font-mono transition-all ${
                          config.ui.radius === r
                            ? "bg-white/20 border-white text-white font-bold"
                            : "border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Content Density & Spacing
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["compact", "normal", "relaxed"] as TemplateDensity[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => updateConfig({ ui: { ...config.ui, density: d } })}
                        className={`py-2 rounded-lg border capitalize text-xs font-medium transition-all ${
                          config.ui.density === d
                            ? "bg-white/20 border-white text-white font-bold"
                            : "border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. Appearance & Motion */}
            {activeSection === "appearance" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Color Appearance
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => updateConfig({ theme: "dark" })}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${
                        config.theme === "dark"
                          ? "bg-white/20 border-white text-white font-bold"
                          : "border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Moon className="h-3.5 w-3.5" />
                      <span>Dark Theme</span>
                    </button>
                    <button
                      onClick={() => updateConfig({ theme: "light" })}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${
                        config.theme === "light"
                          ? "bg-white/20 border-white text-white font-bold"
                          : "border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Sun className="h-3.5 w-3.5 text-amber-400" />
                      <span>Light Theme</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Animation Level
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["reduced", "normal", "expressive"] as TemplateMotion[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => updateConfig({ motion: m })}
                        className={`py-2 rounded-lg border capitalize text-xs font-medium transition-all ${
                          config.motion === m
                            ? "bg-white/20 border-white text-white font-bold"
                            : "border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-xl transition-all hover:brightness-110 flex items-center justify-center gap-1.5"
              style={{ backgroundColor: config.colors.primary }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Customized Source</span>
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

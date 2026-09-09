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
  FileCode2,
  Grid,
  CircleDot,
  Wand2,
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

  const [activeSection, setActiveSection] = useState<"brand" | "presets" | "colors" | "typography" | "layout" | "appearance">("brand");
  const [logoMode, setLogoMode] = useState<"preset" | "custom">(config.customLogoUrl ? "custom" : "preset");
  const [customLogoUrlInput, setCustomLogoUrlInput] = useState(config.customLogoUrl || "");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [customHexInput, setCustomHexInput] = useState(config.colors.primary);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            {/* Section Tabs (6 tabs) */}
            <div className="grid grid-cols-6 gap-1 p-1 rounded-xl bg-zinc-900 border border-white/10 text-xs">
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

            {/* 1. Brand & Logo Controls (Featuring Custom Logo Upload) */}
            {activeSection === "brand" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {/* Brand / Company Name */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      Brand / Company Name
                    </label>
                    {config.brandName && (
                      <button
                        onClick={() => updateConfig({ brandName: "" })}
                        className="text-[10px] text-zinc-500 hover:text-zinc-300"
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
                    className="w-full p-2.5 rounded-lg border border-white/10 bg-zinc-900 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Updates headers, cards, and titles across the template.
                  </p>
                </div>

                {/* Brand Tagline */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Brand Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={config.brandTagline || ""}
                    onChange={(e) => updateConfig({ brandTagline: e.target.value })}
                    placeholder="e.g. Next-Gen Intelligent Infrastructure"
                    className="w-full p-2 rounded-lg border border-white/10 bg-zinc-900 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Logo & Icon Selection: Preset vs Custom Upload */}
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300">
                      Logo & Brand Icon
                    </label>
                    <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-white/10 text-[11px]">
                      <button
                        onClick={() => setLogoMode("preset")}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          logoMode === "preset" ? "bg-white/15 text-white font-semibold" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Presets
                      </button>
                      <button
                        onClick={() => setLogoMode("custom")}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          logoMode === "custom" ? "bg-indigo-600 text-white font-semibold" : "text-zinc-400 hover:text-white"
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
                        {logoOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              removeCustomLogo();
                              updateConfig({ logoIcon: opt.id });
                            }}
                            title={opt.label}
                            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                              !config.customLogoUrl && config.logoIcon === opt.id
                                ? "bg-white/20 border-white text-white scale-105 shadow-sm"
                                : "border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <opt.icon className="h-4 w-4" />
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-zinc-500">
                        Choose from 10 crisp vector glyphs, or click "Upload Custom" to upload your own icon.
                      </p>
                    </div>
                  )}

                  {/* Mode B: Custom Logo Upload */}
                  {logoMode === "custom" && (
                    <div className="space-y-3">
                      {/* Active Custom Logo Box */}
                      {config.customLogoUrl ? (
                        <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/5 space-y-3">
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

                          {/* Live 1:1 Size Scaling Test Box */}
                          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/90 border border-white/10">
                            <div className="text-center space-y-1">
                              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                                <img src={config.customLogoUrl} alt="Logo preview 16px" className="w-4 h-4 object-contain aspect-square" />
                              </div>
                              <span className="text-[9px] font-mono text-zinc-400">16px</span>
                            </div>
                            <div className="text-center space-y-1">
                              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                                <img src={config.customLogoUrl} alt="Logo preview 20px" className="w-5 h-5 object-contain aspect-square" />
                              </div>
                              <span className="text-[9px] font-mono text-zinc-400">20px</span>
                            </div>
                            <div className="text-center space-y-1">
                              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                                <img src={config.customLogoUrl} alt="Logo preview 24px" className="w-6 h-6 object-contain aspect-square" />
                              </div>
                              <span className="text-[9px] font-mono text-zinc-400">24px</span>
                            </div>
                            <div className="flex-1 text-left border-l border-white/10 pl-2.5">
                              <p className="text-[11px] font-medium text-zinc-200">Pixel-Matched Size</p>
                              <p className="text-[9px] text-zinc-400 leading-tight">Proportionally rendered into template headers at identical icon dimensions.</p>
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
                            Click to browse or drop icon file here
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            Supports SVG, PNG, WebP, JPG (auto-scaled to 1:1 icon size)
                          </p>
                        </div>
                      </div>

                      {/* Remote URL input */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-400">Or enter an image URL:</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="url"
                            placeholder="https://.../logo.svg"
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

            {/* 2. Curated Style Presets & Randomizer */}
            {activeSection === "presets" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
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
                        className="w-full p-3 rounded-xl border border-white/10 bg-zinc-900/60 hover:bg-zinc-900 hover:border-white/20 text-left transition-all flex items-center justify-between group"
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
                          <p className="text-[10px] text-zinc-400 leading-tight">
                            {preset.tagline}
                          </p>
                        </div>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: preset.config.colors?.primary }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <button
                    onClick={randomizeConfig}
                    className="w-full py-2.5 rounded-xl border border-purple-500/40 bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
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

            {/* 4. Typography Controls */}
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

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Font Scale & Sizing
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["compact", "normal", "spacious"] as TemplateFontScale[]).map((scale) => (
                      <button
                        key={scale}
                        onClick={() => updateConfig({ typography: { ...config.typography, scale } })}
                        className={`py-2 rounded-lg border capitalize text-[11px] font-medium transition-all ${
                          config.typography.scale === scale
                            ? "bg-white/20 border-white text-white font-bold"
                            : "border-white/10 text-zinc-400 hover:text-white"
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

                <div className="pt-2 border-t border-white/10">
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
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
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                          config.effects.backgroundEffect === bg.id
                            ? "bg-white/15 border-white text-white font-bold shadow-sm"
                            : "border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <bg.icon className="h-3.5 w-3.5" />
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

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Share & Export Configuration
                  </label>
                  <button
                    onClick={handleCopyJson}
                    className="w-full py-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedConfig ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedConfig ? "Copied to Clipboard!" : "Copy Configuration JSON"}</span>
                  </button>
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

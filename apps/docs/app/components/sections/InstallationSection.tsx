"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ComponentSource } from "../ComponentSource";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";
import { Terminal, Package, Wand2, Palette, Sliders, Laptop, Sparkles, Check, Copy } from "lucide-react";
import {
  useThemeCustomizer,
  COLOR_PRESETS,
  RADIUS_PRESETS,
  FrameworkType,
  PackageManagerType,
} from "../../context/ThemeCustomizerContext";

export function InstallationSection() {
  const {
    themeColor,
    setThemeColor,
    radius,
    setRadius,
    framework,
    setFramework,
    packageManager,
    setPackageManager,
    getInitCommand,
    getGlobalsCssSnippet,
  } = useThemeCustomizer();

  const [copiedInit, setCopiedInit] = useState(false);

  const handleCopyInit = () => {
    navigator.clipboard.writeText(getInitCommand());
    setCopiedInit(true);
    setTimeout(() => setCopiedInit(false), 2000);
  };

  return (
    <section id="installation" className="max-w-4xl space-y-12 pb-16 pt-4">
      {/* Header */}
      <div className="pb-8 border-b border-border/60">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Setup</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          Installation & Setup Guide
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
          Initialize NexoreUI in your project with customized theme colors and radius, or install individual components via CLI.
        </p>
      </div>

      {/* Step 1: Interactive Configurator */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
              1
            </span>
            <span>Interactive Project Configurator</span>
          </h3>
          <p className="text-muted-foreground ml-11 text-sm">
            Choose your framework, preferred package manager, theme color, and border radius. All settings update live!
          </p>
        </div>

        <div className="ml-11 p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-md space-y-6 shadow-sm">
          {/* Framework and PM Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Framework */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Laptop className="h-3.5 w-3.5 text-primary" />
                <span>Framework</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "nextjs", label: "Next.js", icon: "▲" },
                  { id: "vite", label: "Vite (React)", icon: "⚡" },
                  { id: "remix", label: "Remix", icon: "💿" },
                  { id: "astro", label: "Astro", icon: "🚀" },
                ].map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() => setFramework(fw.id as FrameworkType)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                      framework === fw.id
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{fw.icon}</span>
                    <span>{fw.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Package Manager */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                <span>Package Manager</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["pnpm", "npm", "yarn", "bun"] as PackageManagerType[]).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setPackageManager(pm)}
                    className={`py-2 rounded-lg border text-xs font-mono font-medium transition-all text-center ${
                      packageManager === pm
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color & Radius Customizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/60">
            {/* Color Palette */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Palette className="h-3.5 w-3.5 text-primary" />
                <span>Theme Color</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {Object.values(COLOR_PRESETS).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setThemeColor(preset.id)}
                    className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-xs transition-all ${
                      themeColor === preset.id
                        ? "border-primary bg-primary/10 ring-1 ring-primary font-semibold"
                        : "border-border bg-card/60 hover:border-border/80"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: preset.previewHex }}
                    />
                    <span className="truncate text-[11px] capitalize">{preset.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Radius */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-primary" />
                <span>Border Radius</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {RADIUS_PRESETS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRadius(r.value)}
                    className={`py-1.5 rounded-lg border text-xs font-mono transition-all text-center ${
                      radius === r.value
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated CLI Command Box */}
          <div className="pt-4 border-t border-border/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                <span>Generated Quick Start Command</span>
              </span>
              <Link
                href="/create"
                className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
              >
                <Wand2 className="h-3 w-3" />
                <span>Open Full Studio & Configurator</span>
              </Link>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-border text-xs font-mono text-zinc-200">
              <span className="truncate mr-3">{getInitCommand()}</span>
              <button
                onClick={handleCopyInit}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-200 font-sans shrink-0 transition-colors"
              >
                {copiedInit ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Add Components */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground text-sm font-bold">
              2
            </span>
            <span>Add Components via CLI</span>
          </h3>
          <p className="text-muted-foreground ml-11 text-sm">
            Add components directly into your codebase. You own the code.
          </p>
        </div>

        <div className="ml-11">
          <Tabs defaultValue="cli-method" className="w-full">
            <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl flex w-fit max-w-full overflow-x-auto hide-scrollbar">
              <TabsTrigger
                value="cli-method"
                className="rounded-lg px-6 py-2.5 text-sm flex items-center gap-2"
              >
                <Terminal className="h-4 w-4" />
                CLI (Recommended)
              </TabsTrigger>
              <TabsTrigger
                value="npm-method"
                className="rounded-lg px-6 py-2.5 text-sm flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Full Package (npm)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cli-method" className="space-y-4 outline-none">
              <ComponentSource
                hideFormatSelector
                sourceCode={`# 1. Initialize configuration\n${getInitCommand()}\n\n# 2. Add individual components\nnpx nexoreui add button card modal alert\n\n# 3. Or add AI Agentic suite\nnpx nexoreui add thinking-indicator tool-call-card agent-status-pill`}
              />
            </TabsContent>

            <TabsContent value="npm-method" className="space-y-4 outline-none">
              <Tabs defaultValue="pnpm" className="w-full">
                <TabsList className="mb-3 bg-muted/50 p-1 rounded-lg flex w-full overflow-x-auto hide-scrollbar max-w-sm">
                  <TabsTrigger value="pnpm" className="flex-1 rounded-md text-xs">pnpm</TabsTrigger>
                  <TabsTrigger value="npm" className="flex-1 rounded-md text-xs">npm</TabsTrigger>
                  <TabsTrigger value="yarn" className="flex-1 rounded-md text-xs">yarn</TabsTrigger>
                  <TabsTrigger value="bun" className="flex-1 rounded-md text-xs">bun</TabsTrigger>
                </TabsList>
                <TabsContent value="pnpm" className="mt-0 outline-none">
                  <ComponentSource hideFormatSelector sourceCode={`pnpm add nexoreui lucide-react framer-motion`} />
                </TabsContent>
                <TabsContent value="npm" className="mt-0 outline-none">
                  <ComponentSource hideFormatSelector sourceCode={`npm install nexoreui lucide-react framer-motion`} />
                </TabsContent>
                <TabsContent value="yarn" className="mt-0 outline-none">
                  <ComponentSource hideFormatSelector sourceCode={`yarn add nexoreui lucide-react framer-motion`} />
                </TabsContent>
                <TabsContent value="bun" className="mt-0 outline-none">
                  <ComponentSource hideFormatSelector sourceCode={`bun add nexoreui lucide-react framer-motion`} />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Step 3: CSS Theme Variables */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground text-sm font-bold">
              3
            </span>
            <span>Configure globals.css</span>
          </h3>
          <p className="text-muted-foreground ml-11 text-sm">
            Add the generated theme tokens to your stylesheet for automatic dark/light mode support and custom radius.
          </p>
        </div>

        <div className="ml-11">
          <ComponentSource hideFormatSelector sourceCode={getGlobalsCssSnippet()} />
        </div>
      </div>
    </section>
  );
}

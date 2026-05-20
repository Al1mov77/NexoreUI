"use client";

import React from "react";
import { ComponentSource } from "../ComponentSource";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";

export function InstallationSection() {
  return (
    <section id="installation" className="space-y-8 scroll-mt-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
          <p className="text-muted-foreground">How to install dependencies and structure your app.</p>
        </div>
      </div>

      <div className="space-y-12 max-w-3xl">
        {/* Step 1 */}
        <div className="relative pl-8 border-l border-border/60 ml-3 space-y-6">
          <span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm">1</span>
          <div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">Install NexoreUI</h3>
            <p className="text-muted-foreground mb-4">Choose how you want to install and use components in your project.</p>
            <Tabs defaultValue="npm-method" className="w-full">
              <TabsList className="mb-4 border-b border-border/50 pb-2">
                <TabsTrigger value="npm-method">npm install</TabsTrigger>
                <TabsTrigger value="cli-method">NexoreUI CLI</TabsTrigger>
              </TabsList>
              <TabsContent value="npm-method" className="mt-0 space-y-4">
                <p className="text-sm text-muted-foreground">Install the full library package as a dependency and configure TailwindCSS.</p>
                <Tabs defaultValue="pnpm" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                    <TabsTrigger value="npm">npm</TabsTrigger>
                    <TabsTrigger value="yarn">yarn</TabsTrigger>
                    <TabsTrigger value="bun">bun</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pnpm" className="mt-0">
                    <ComponentSource sourceCode={`pnpm add nexoreui tailwindcss @tailwindcss/vite`} />
                  </TabsContent>
                  <TabsContent value="npm" className="mt-0">
                    <ComponentSource sourceCode={`npm install nexoreui tailwindcss @tailwindcss/vite`} />
                  </TabsContent>
                  <TabsContent value="yarn" className="mt-0">
                    <ComponentSource sourceCode={`yarn add nexoreui tailwindcss @tailwindcss/vite`} />
                  </TabsContent>
                  <TabsContent value="bun" className="mt-0">
                    <ComponentSource sourceCode={`bun add nexoreui tailwindcss @tailwindcss/vite`} />
                  </TabsContent>
                </Tabs>
              </TabsContent>
              <TabsContent value="cli-method" className="mt-0 space-y-4">
                <p className="text-sm text-muted-foreground">Add components individually directly to your codebase using our interactive CLI utility.</p>
                <div className="space-y-4">
                  <ComponentSource sourceCode={`npx nexoreui add button\nnpx nexoreui add modal card alert`} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative pl-8 border-l border-border/60 ml-3 space-y-6">
          <span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm">2</span>
          <div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">Configure Vite</h3>
            <p className="text-muted-foreground mb-4">Add the Tailwind CSS Vite plugin to your <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">vite.config.ts</code> (or <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">vite.config.js</code>).</p>
            <div>
              <ComponentSource sourceCode={`import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport tailwindcss from '@tailwindcss/vite'\n\n// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n})`} />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative pl-8 border-l border-transparent ml-3 space-y-6">
          <span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm">3</span>
          <div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">Add Styles to CSS</h3>
            <p className="text-muted-foreground mb-4">Add the following imports, theme tokens, glassmorphism utilities, and micro-animations to your main CSS file (e.g., <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">index.css</code> or <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">globals.css</code>).</p>
            <div>
              <ComponentSource sourceCode={`@import "tailwindcss";\n@source "../node_modules/nexoreui/dist/**/*.{js,mjs}";\n\n@theme {\n  /* ━━━ Основные переменные дизайна ━━━ */\n  \n  /* Light Mode (Светлая тема) */\n  --color-background: #fafafa;\n  --color-foreground: #09090b;\n  \n  --color-card: #ffffff;\n  --color-card-foreground: #09090b;\n  \n  --color-popover: #ffffff;\n  --color-popover-foreground: #09090b;\n  \n  --color-primary: #7c3aed;\n  --color-primary-foreground: #faf5ff;\n  \n  --color-secondary: #f4f4f5;\n  --color-secondary-foreground: #18181b;\n  \n  --color-muted: #f4f4f5;\n  --color-muted-foreground: #71717a;\n  \n  --color-accent: #f4f4f5;\n  --color-accent-foreground: #18181b;\n  \n  --color-destructive: #ef4444;\n  --color-destructive-foreground: #fafafa;\n  \n  --color-border: #e4e4e7;\n  --color-input: #e4e4e7;\n  --color-ring: #7c3aed;\n  \n  --radius-sm: 0.25rem;\n  --radius-md: 0.375rem;\n  --radius-lg: 0.5rem;\n}\n\n/* Dark Mode (Темная тема — класс .dark на html/body) */\n.dark {\n  --color-background: #09090b;\n  --color-foreground: #fafafa;\n  \n  --color-card: #0c0c0f;\n  --color-card-foreground: #fafafa;\n  \n  --color-popover: #0c0c0f;\n  --color-popover-foreground: #fafafa;\n  \n  --color-primary: #8b5cf6;\n  --color-primary-foreground: #faf5ff;\n  \n  --color-secondary: #18181b;\n  --color-secondary-foreground: #fafafa;\n  \n  --color-muted: #18181b;\n  --color-muted-foreground: #a1a1aa;\n  \n  --color-accent: #18181b;\n  --color-accent-foreground: #fafafa;\n  \n  --color-destructive: #7f1d1d;\n  --color-destructive-foreground: #fafafa;\n  \n  --color-border: rgba(255, 255, 255, 0.06);\n  --color-input: rgba(255, 255, 255, 0.06);\n  --color-ring: #8b5cf6;\n}\n\n@layer base {\n  body {\n    background-color: var(--color-background);\n    color: var(--color-foreground);\n    font-family: system-ui, -apple-system, sans-serif;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n}\n\n/* Glassmorphism (Стекло) */\n@utility glass {\n  background-color: rgba(255, 255, 255, 0.03);\n  backdrop-filter: blur(20px) saturate(180%);\n  -webkit-backdrop-filter: blur(20px) saturate(180%);\n  border: 1px solid rgba(255, 255, 255, 0.06);\n}\n\n.dark .glass {\n  background-color: rgba(12, 12, 15, 0.7);\n  border: 1px solid rgba(255, 255, 255, 0.04);\n}\n\n/* ━━━ Анимации ━━━ */\n@keyframes marquee-left {\n  from { transform: translateX(0); }\n  to { transform: translateX(calc(-100% - var(--gap))); }\n}\n@keyframes marquee-right {\n  from { transform: translateX(calc(-100% - var(--gap))); }\n  to { transform: translateX(0); }\n}\n@keyframes shimmer-text {\n  from { background-position: 200% 0; }\n  to { background-position: -200% 0; }\n}\n@keyframes meteor {\n  0% { transform: rotate(215deg) translateX(0); opacity: 1; }\n  70% { opacity: 1; }\n  100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }\n}\n@keyframes pulse-ring {\n  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }\n  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }\n}\n@keyframes rainbow {\n  0% { background-position: 0%; }\n  100% { background-position: 200%; }\n}\n@keyframes text-shimmer {\n  from { background-position: 200% 0; }\n  to { background-position: -200% 0; }\n}\n@keyframes grid-scroll {\n  0% { transform: translateY(-50%); }\n  100% { transform: translateY(0); }\n}\n@keyframes fade-in {\n  from { opacity: 0; transform: translateY(6px) scale(0.98); }\n  to { opacity: 1; transform: translateY(0) scale(1); }\n}\n@keyframes fade-in-up {\n  from { opacity: 0; transform: translateY(12px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n@keyframes subtle-pulse {\n  0%, 100% { opacity: 0.4; }\n  50% { opacity: 0.7; }\n}\n@keyframes glow-pulse {\n  0%, 100% { opacity: 0.4; filter: blur(40px); }\n  50% { opacity: 0.6; filter: blur(50px); }\n}\n@keyframes float {\n  0%, 100% { transform: translateY(0px); }\n  50% { transform: translateY(-6px); }\n}\n@keyframes border-glow {\n  0%, 100% { border-color: rgba(139, 92, 246, 0.1); }\n  50% { border-color: rgba(139, 92, 246, 0.25); }\n}\n@keyframes gradient-shift {\n  0% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; }\n}\n\n@utility animate-marquee-left {\n  animation: marquee-left var(--duration) linear infinite;\n}\n@utility animate-marquee-right {\n  animation: marquee-right var(--duration) linear infinite;\n}\n@utility animate-shimmer-text {\n  animation: shimmer-text 3s linear infinite;\n}\n@utility animate-meteor {\n  animation: meteor 5s linear infinite;\n}\n@utility animate-pulse-ring {\n  animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;\n}\n@utility animate-rainbow {\n  animation: rainbow 2s linear infinite;\n}\n@utility animate-text-shimmer {\n  animation: text-shimmer 2s linear infinite;\n}\n@utility animate-grid {\n  animation: grid-scroll 15s linear infinite;\n}\n@utility animate-fade-in {\n  animation: fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n}\n@utility animate-fade-in-up {\n  animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n}\n@utility animate-glow-pulse {\n  animation: glow-pulse 4s ease-in-out infinite;\n}\n@utility animate-float {\n  animation: float 6s ease-in-out infinite;\n}\n@utility animate-border-glow {\n  animation: border-glow 3s ease-in-out infinite;\n}\n@utility animate-gradient-shift {\n  animation: gradient-shift 8s ease infinite;\n  background-size: 200% 200%;\n}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

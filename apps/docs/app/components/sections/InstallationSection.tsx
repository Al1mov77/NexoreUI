"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";
import { Check, Copy, Terminal, Package, Sparkles, Layers, Cpu } from "lucide-react";

export function InstallationSection() {
  const [copiedCli, setCopiedCli] = useState(false);

  const copyCliCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <section id="installation" className="space-y-10 scroll-mt-20">
      {/* Header Banner */}
      <div className="border border-border/60 bg-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>NexoreUI v0.1.2</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Installation Guide</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Get started with NexoreUI in seconds. Install the full library package or bring individual interactive components to your app using the NexoreUI CLI.
          </p>
        </div>
      </div>

      <div className="space-y-12 max-w-4xl">
        {/* Step 1: Package / CLI Selection */}
        <div className="relative pl-8 border-l border-border/60 ml-3 space-y-6">
          <span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground text-sm font-bold shadow-md">
            1
          </span>
          <div>
            <h3 className="text-xl font-bold mb-2 tracking-tight flex items-center gap-2">
              <Package className="h-5 w-5 text-violet-400" />
              <span>Choose Installation Method</span>
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Select your preferred package manager or use our CLI to copy components into your codebase.
            </p>

            <Tabs defaultValue="npm-method" className="w-full">
              <TabsList className="mb-4 border-b border-border/50 pb-2 flex gap-2">
                <TabsTrigger value="npm-method" className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" />
                  <span>Full Package (npm)</span>
                </TabsTrigger>
                <TabsTrigger value="cli-method" className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>NexoreUI CLI</span>
                </TabsTrigger>
              </TabsList>

              {/* Package Install */}
              <TabsContent value="npm-method" className="mt-0 space-y-4">
                <p className="text-xs text-muted-foreground">
                  Install the core package alongside Tailwind CSS into your React / Next.js / Vite project.
                </p>
                <Tabs defaultValue="pnpm" className="w-full">
                  <TabsList className="mb-3">
                    <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                    <TabsTrigger value="npm">npm</TabsTrigger>
                    <TabsTrigger value="yarn">yarn</TabsTrigger>
                    <TabsTrigger value="bun">bun</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pnpm" className="mt-0">
                    <ComponentSource sourceCode={`pnpm add nexoreui lucide-react framer-motion`} />
                  </TabsContent>
                  <TabsContent value="npm" className="mt-0">
                    <ComponentSource sourceCode={`npm install nexoreui lucide-react framer-motion`} />
                  </TabsContent>
                  <TabsContent value="yarn" className="mt-0">
                    <ComponentSource sourceCode={`yarn add nexoreui lucide-react framer-motion`} />
                  </TabsContent>
                  <TabsContent value="bun" className="mt-0">
                    <ComponentSource sourceCode={`bun add nexoreui lucide-react framer-motion`} />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* CLI Method */}
              <TabsContent value="cli-method" className="mt-0 space-y-4">
                <p className="text-xs text-muted-foreground">
                  Add components on demand with full control over source code:
                </p>
                <ComponentSource sourceCode={`# Add individual components\nnpx nexoreui add button\nnpx nexoreui add card modal input alert`} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Step 2: Framework Configuration */}
        <div className="relative pl-8 border-l border-border/60 ml-3 space-y-6">
          <span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm">
            2
          </span>
          <div>
            <h3 className="text-xl font-bold mb-2 tracking-tight flex items-center gap-2">
              <Cpu className="h-5 w-5 text-violet-400" />
              <span>Framework Setup</span>
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Configure your build tools for Next.js or Vite.
            </p>

            <Tabs defaultValue="nextjs" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="nextjs">Next.js (App Router)</TabsTrigger>
                <TabsTrigger value="vite">Vite (React)</TabsTrigger>
              </TabsList>

              <TabsContent value="nextjs" className="mt-0 space-y-3">
                <p className="text-xs text-muted-foreground">
                  In Next.js, add <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">nexoreui</code> to your CSS imports in <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">app/globals.css</code>.
                </p>
                <ComponentSource sourceCode={`// app/layout.tsx\nimport './globals.css';\nimport { ThemeProvider } from 'next-themes';\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en" suppressHydrationWarning>\n      <body>\n        <ThemeProvider attribute="class" defaultTheme="dark">\n          {children}\n        </ThemeProvider>\n      </body>\n    </html>\n  );\n}`} />
              </TabsContent>

              <TabsContent value="vite" className="mt-0 space-y-3">
                <p className="text-xs text-muted-foreground">
                  In Vite React projects, configure Tailwind CSS plugin in <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">vite.config.ts</code>.
                </p>
                <ComponentSource sourceCode={`import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport tailwindcss from '@tailwindcss/vite'\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n})`} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Step 3: CSS Tokens & Theme Variables */}
        <div className="relative pl-8 border-l border-transparent ml-3 space-y-6">
          <span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm">
            3
          </span>
          <div>
            <h3 className="text-xl font-bold mb-2 tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-violet-400" />
              <span>Configure CSS & Theme Variables</span>
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Add the following theme CSS definitions to your main stylesheet (<code className="bg-muted px-1 py-0.5 rounded text-foreground">globals.css</code> / <code className="bg-muted px-1 py-0.5 rounded text-foreground">index.css</code>).
            </p>
            <ComponentSource sourceCode={`@import "tailwindcss";\n@source "../node_modules/nexoreui/dist/**/*.{js,mjs}";\n\n@theme {\n  --color-background: var(--background);\n  --color-foreground: var(--foreground);\n  --color-card: var(--card);\n  --color-card-foreground: var(--card-foreground);\n  --color-primary: var(--primary);\n  --color-primary-foreground: var(--primary-foreground);\n  --color-border: var(--border);\n}\n\n:root {\n  --background: #ffffff;\n  --foreground: #09090b;\n  --card: #ffffff;\n  --card-foreground: #09090b;\n  --primary: #7c3aed;\n  --primary-foreground: #ffffff;\n  --border: #e4e4e7;\n}\n\n.dark {\n  --background: #09090b;\n  --foreground: #fafafa;\n  --card: #09090b;\n  --card-foreground: #fafafa;\n  --primary: #8b5cf6;\n  --primary-foreground: #ffffff;\n  --border: rgba(255, 255, 255, 0.08);\n}`} />
          </div>
        </div>

        {/* Quick Demo */}
        <div className="border border-border/60 bg-card rounded-xl p-6 space-y-4">
          <h4 className="text-base font-bold tracking-tight">Quick Start Demo</h4>
          <p className="text-xs text-muted-foreground">
            Import components from <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">nexoreui</code> and use them anywhere in your app:
          </p>
          <ComponentSource sourceCode={`import React from 'react';\nimport { Button, Card, Badge } from 'nexoreui';\n\nexport default function App() {\n  return (\n    <div className="p-6 flex flex-col gap-4 max-w-sm">\n      <Badge variant="outline">NexoreUI Ready</Badge>\n      <Card className="p-4 space-y-3">\n        <h3 className="font-semibold text-lg">Welcome</h3>\n        <p className="text-xs text-muted-foreground">\n          Build ultra-modern interfaces with pre-built micro-animations and glassmorphism.\n        </p>\n        <Button className="w-full">Get Started</Button>\n      </Card>\n    </div>\n  );\n}`} />
        </div>
      </div>
    </section>
  );
}

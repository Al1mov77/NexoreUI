"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";
import { Terminal, Package } from "lucide-react";

export function InstallationSection() {
  return (
    <section id="installation" className="max-w-4xl space-y-12 pb-16 pt-8">
      {/* Header */}
      <div className="pb-8 border-b border-border/40">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Installation Guide
        </h2>
        <p className="text-muted-foreground text-lg">
          Add components to your project or install the full library. Designed for modern React frameworks like Next.js and Vite.
        </p>
      </div>

      <div className="space-y-12">
        {/* Step 1 */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground text-sm font-bold">1</span>
              Install packages
            </h3>
            <p className="text-muted-foreground ml-11">Choose between the full npm package or the CLI tool.</p>
          </div>

          <div className="ml-11">
            <Tabs defaultValue="npm-method" className="w-full">
              <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl flex w-fit max-w-full overflow-x-auto hide-scrollbar">
                <TabsTrigger 
                  value="npm-method" 
                  className="rounded-lg px-6 py-2.5 text-sm flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Full Package
                </TabsTrigger>
                <TabsTrigger 
                  value="cli-method" 
                  className="rounded-lg px-6 py-2.5 text-sm flex items-center gap-2"
                >
                  <Terminal className="h-4 w-4" />
                  NexoreUI CLI
                </TabsTrigger>
              </TabsList>

              <TabsContent value="npm-method" className="space-y-4 outline-none">
                <Tabs defaultValue="pnpm" className="w-full">
                  <TabsList className="mb-3 bg-muted/50 p-1 rounded-lg flex w-full overflow-x-auto hide-scrollbar max-w-sm">
                    <TabsTrigger value="pnpm" className="flex-1 rounded-md text-xs">pnpm</TabsTrigger>
                    <TabsTrigger value="npm" className="flex-1 rounded-md text-xs">npm</TabsTrigger>
                    <TabsTrigger value="yarn" className="flex-1 rounded-md text-xs">yarn</TabsTrigger>
                    <TabsTrigger value="bun" className="flex-1 rounded-md text-xs">bun</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pnpm" className="mt-0 outline-none"><ComponentSource hideFormatSelector sourceCode={`pnpm add nexoreui lucide-react framer-motion`} /></TabsContent>
                  <TabsContent value="npm" className="mt-0 outline-none"><ComponentSource hideFormatSelector sourceCode={`npm install nexoreui lucide-react framer-motion`} /></TabsContent>
                  <TabsContent value="yarn" className="mt-0 outline-none"><ComponentSource hideFormatSelector sourceCode={`yarn add nexoreui lucide-react framer-motion`} /></TabsContent>
                  <TabsContent value="bun" className="mt-0 outline-none"><ComponentSource hideFormatSelector sourceCode={`bun add nexoreui lucide-react framer-motion`} /></TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="cli-method" className="space-y-4 outline-none">
                <ComponentSource hideFormatSelector sourceCode={`# Initialize CLI\nnpx nexoreui init\n\n# Add individual components\nnpx nexoreui add button card modal alert`} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground text-sm font-bold">2</span>
              Framework Setup
            </h3>
            <p className="text-muted-foreground ml-11">Configure your build tools for Next.js or Vite.</p>
          </div>

          <div className="ml-11">
            <Tabs defaultValue="nextjs" className="w-full">
              <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl flex w-fit max-w-full overflow-x-auto hide-scrollbar">
                <TabsTrigger value="nextjs" className="rounded-lg px-6 py-2.5 text-sm whitespace-nowrap">Next.js (App Router)</TabsTrigger>
                <TabsTrigger value="vite" className="rounded-lg px-6 py-2.5 text-sm whitespace-nowrap">Vite (React)</TabsTrigger>
              </TabsList>

              <TabsContent value="nextjs" className="space-y-4 outline-none">
                <p className="text-sm text-muted-foreground">In Next.js, import styles and configure your ThemeProvider in <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">app/layout.tsx</code>.</p>
                <ComponentSource hideFormatSelector sourceCode={`// app/layout.tsx\nimport './globals.css';\nimport { ThemeProvider } from 'next-themes';\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en" suppressHydrationWarning>\n      <body>\n        <ThemeProvider attribute="class" defaultTheme="dark">\n          {children}\n        </ThemeProvider>\n      </body>\n    </html>\n  );\n}`} />
              </TabsContent>

              <TabsContent value="vite" className="space-y-4 outline-none">
                <p className="text-sm text-muted-foreground">In Vite, add the Tailwind CSS plugin to <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-xs">vite.config.ts</code>.</p>
                <ComponentSource hideFormatSelector sourceCode={`import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport tailwindcss from '@tailwindcss/vite'\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n})`} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground text-sm font-bold">3</span>
              CSS Variables
            </h3>
            <p className="text-muted-foreground ml-11">Add the theme CSS variables to your main stylesheet.</p>
          </div>

          <div className="ml-11">
            <ComponentSource hideFormatSelector sourceCode={`@import "tailwindcss";\n@source "../node_modules/nexoreui/dist/**/*.{js,mjs}";\n\n@theme {\n  --color-background: var(--background);\n  --color-foreground: var(--foreground);\n  --color-card: var(--card);\n  --color-card-foreground: var(--card-foreground);\n  --color-primary: var(--primary);\n  --color-primary-foreground: var(--primary-foreground);\n  --color-border: var(--border);\n}\n\n:root {\n  --background: #ffffff;\n  --foreground: #09090b;\n  --card: #ffffff;\n  --card-foreground: #09090b;\n  --primary: #7c3aed;\n  --primary-foreground: #ffffff;\n  --border: #e4e4e7;\n}\n\n.dark {\n  --background: #09090b;\n  --foreground: #fafafa;\n  --card: #09090b;\n  --card-foreground: #fafafa;\n  --primary: #8b5cf6;\n  --primary-foreground: #ffffff;\n  --border: rgba(255, 255, 255, 0.08);\n}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "nexoreui";
import { Check, Copy, Terminal, Package, Sparkles, Layers, Cpu, Code2, Download } from "lucide-react";

export function InstallationSection() {
  const [copiedCli, setCopiedCli] = useState(false);

  const copyCliCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <section id="installation" className="space-y-12 pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#050505] border border-white/5 p-8 md:p-14 shadow-2xl">
        {/* Advanced Glass/Glow Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/20 via-background to-transparent opacity-60 pointer-events-none transform -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-transparent opacity-50 pointer-events-none transform translate-y-1/3 -translate-x-1/3" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-start gap-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white/5 text-violet-300 border border-white/10 backdrop-blur-md shadow-inner">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="tracking-wide">NexoreUI v0.1.2</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50">
            Installation Guide
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light">
            Install the full library or seamlessly integrate individual components. Built specifically for modern React architectures like Next.js and Vite.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Step 1 */}
        <div className="group relative bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm transition-shadow hover:shadow-md overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-indigo-500 opacity-80" />
          
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 font-bold text-xl border border-violet-500/20">
              1
            </div>
            <div className="flex-1 w-full space-y-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Download className="h-5 w-5 text-violet-400" />
                  Installation
                </h3>
                <p className="text-muted-foreground text-sm mt-1">Choose between the full npm package or the CLI tool.</p>
              </div>

              <Tabs defaultValue="npm-method" className="w-full">
                <TabsList className="w-full justify-start border-b border-border/40 pb-px mb-4 bg-transparent gap-6 h-auto p-0 rounded-none hide-scrollbar overflow-x-auto flex">
                  <TabsTrigger 
                    value="npm-method" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-500 rounded-none px-0 pb-3 text-sm flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    Full Package
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cli-method" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-500 rounded-none px-0 pb-3 text-sm flex items-center gap-2"
                  >
                    <Terminal className="h-4 w-4" />
                    NexoreUI CLI
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="npm-method" className="space-y-4 outline-none">
                  <p className="text-sm text-muted-foreground">Install the core package alongside Tailwind CSS and Framer Motion.</p>
                  <Tabs defaultValue="pnpm" className="w-full">
                    <TabsList className="mb-3 bg-muted/50 p-1 rounded-lg flex w-full overflow-x-auto hide-scrollbar">
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
                  <p className="text-sm text-muted-foreground">Add components on demand directly to your repository.</p>
                  <ComponentSource hideFormatSelector sourceCode={`# Initialize CLI\nnpx nexoreui init\n\n# Add individual components\nnpx nexoreui add button card modal alert`} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="group relative bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm transition-shadow hover:shadow-md overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-cyan-500 opacity-80" />
          
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 font-bold text-xl border border-indigo-500/20">
              2
            </div>
            <div className="flex-1 w-full space-y-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-indigo-400" />
                  Framework Setup
                </h3>
                <p className="text-muted-foreground text-sm mt-1">Configure your build tools for Next.js or Vite.</p>
              </div>

              <Tabs defaultValue="nextjs" className="w-full">
                <TabsList className="w-full justify-start border-b border-border/40 pb-px mb-4 bg-transparent gap-6 h-auto p-0 rounded-none hide-scrollbar overflow-x-auto flex">
                  <TabsTrigger value="nextjs" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 pb-3 text-sm whitespace-nowrap">Next.js (App Router)</TabsTrigger>
                  <TabsTrigger value="vite" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 pb-3 text-sm whitespace-nowrap">Vite (React)</TabsTrigger>
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
        </div>

        {/* Step 3 */}
        <div className="group relative bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm transition-shadow hover:shadow-md overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-emerald-500 opacity-80" />
          
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 font-bold text-xl border border-cyan-500/20">
              3
            </div>
            <div className="flex-1 w-full space-y-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Layers className="h-5 w-5 text-cyan-400" />
                  CSS Variables
                </h3>
                <p className="text-muted-foreground text-sm mt-1">Add the theme CSS variables to your main stylesheet.</p>
              </div>

              <ComponentSource hideFormatSelector sourceCode={`@import "tailwindcss";\n@source "../node_modules/nexoreui/dist/**/*.{js,mjs}";\n\n@theme {\n  --color-background: var(--background);\n  --color-foreground: var(--foreground);\n  --color-card: var(--card);\n  --color-card-foreground: var(--card-foreground);\n  --color-primary: var(--primary);\n  --color-primary-foreground: var(--primary-foreground);\n  --color-border: var(--border);\n}\n\n:root {\n  --background: #ffffff;\n  --foreground: #09090b;\n  --card: #ffffff;\n  --card-foreground: #09090b;\n  --primary: #7c3aed;\n  --primary-foreground: #ffffff;\n  --border: #e4e4e7;\n}\n\n.dark {\n  --background: #09090b;\n  --foreground: #fafafa;\n  --card: #09090b;\n  --card-foreground: #fafafa;\n  --primary: #8b5cf6;\n  --primary-foreground: #ffffff;\n  --border: rgba(255, 255, 255, 0.08);\n}`} />
            </div>
          </div>
        </div>

        {/* Demo */}
        <div className="bg-muted/30 border border-border/40 rounded-2xl p-6 md:p-8 text-center space-y-4 mt-4">
          <Code2 className="h-8 w-8 text-muted-foreground mx-auto" />
          <h4 className="text-lg font-bold tracking-tight">You're all set!</h4>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Import components from <code className="bg-background px-1.5 py-0.5 rounded text-foreground border border-border/50 font-mono text-xs">nexoreui</code> and start building beautiful interfaces.
          </p>
        </div>
      </div>
    </section>
  );
}

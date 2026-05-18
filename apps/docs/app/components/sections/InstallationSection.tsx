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
            <p className="text-muted-foreground mb-4">Run the following command in your terminal to add the core library to your project.</p>
            <Tabs defaultValue="pnpm" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="yarn">yarn</TabsTrigger>
                <TabsTrigger value="bun">bun</TabsTrigger>
              </TabsList>
              <TabsContent value="pnpm" className="mt-0">
                <ComponentSource sourceCode={`pnpm add nexoreui`} />
              </TabsContent>
              <TabsContent value="npm" className="mt-0">
                <ComponentSource sourceCode={`npm install nexoreui`} />
              </TabsContent>
              <TabsContent value="yarn" className="mt-0">
                <ComponentSource sourceCode={`yarn add nexoreui`} />
              </TabsContent>
              <TabsContent value="bun" className="mt-0">
                <ComponentSource sourceCode={`bun add nexoreui`} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative pl-8 border-l border-border/60 ml-3 space-y-6">
          <span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm">2</span>
          <div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">Configure Next.js (Optional)</h3>
            <p className="text-muted-foreground mb-4">If you are using Tailwind CSS v4, make sure to include the package in your source paths in <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">globals.css</code>.</p>
            <div>
              <ComponentSource sourceCode={`@import "tailwindcss";\n@source "../node_modules/nexoreui/src/**/*.{ts,tsx}";`} />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative pl-8 border-l border-transparent ml-3 space-y-6">
          <span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-bold shadow-sm">3</span>
          <div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">Add Components (CLI)</h3>
            <p className="text-muted-foreground mb-4">You can use our CLI to automatically copy components into your project.</p>
            <Tabs defaultValue="pnpm" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                <TabsTrigger value="npm">npm</TabsTrigger>
              </TabsList>
              <TabsContent value="pnpm" className="mt-0">
                <ComponentSource sourceCode={"pnpm dlx nexoreui add [component-name]"} />
              </TabsContent>
              <TabsContent value="npm" className="mt-0">
                <ComponentSource sourceCode={"npx nexoreui add [component-name]"} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}

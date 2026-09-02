"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { InteractiveCodeBlock, Button } from "nexoreui";
import { Sparkles, Terminal, Code2, Copy, Layers } from "lucide-react";

export function InteractiveCodeBlockSection() {
  const [theme, setTheme] = useState<any>("aurora");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [copyable, setCopyable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const sampleSnippet = `import { Button, AuroraBorderCard } from "nexoreui";

export function WelcomeHero() {
  return (
    <AuroraBorderCard variant="aurora" glow="medium">
      <h1 className="text-2xl font-bold">Build Faster</h1>
      <Button variant="aurora">Get Started</Button>
    </AuroraBorderCard>
  );
}`;

  const examples = [
    {
      name: "1. Aurora Glow Terminal Theme",
      component: (
        <InteractiveCodeBlock
          code={`const studio = new NexoreStudio({
  theme: "aurora",
  acceleration: "hardware-60fps",
});`}
          filename="studio.config.ts"
          theme="aurora"
          badgeText="TypeScript"
          showLineNumbers={true}
          highlightLines={[2]}
        />
      ),
      code: `import { InteractiveCodeBlock } from "nexoreui";

<InteractiveCodeBlock
  code={code}
  filename="studio.config.ts"
  theme="aurora"
  badgeText="TypeScript"
  showLineNumbers={true}
  highlightLines={[2]}
/>`
    },
    {
      name: "2. Neon Cyberpunk Theme",
      component: (
        <InteractiveCodeBlock
          code={`export async function queryAI(prompt: string) {
  const response = await fetch("/api/make-ai", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
  return response.json();
}`}
          filename="aiService.ts"
          theme="neon"
          badgeText="API"
          showLineNumbers={true}
        />
      ),
      code: `import { InteractiveCodeBlock } from "nexoreui";

<InteractiveCodeBlock
  code={code}
  filename="aiService.ts"
  theme="neon"
  badgeText="API"
  showLineNumbers={true}
/>`
    },
    {
      name: "3. Minimal Dark Theme",
      component: (
        <InteractiveCodeBlock
          code={`npx nexoreui-cli add aurora-border-card
npx nexoreui-cli add morphing-geometry
npx nexoreui-cli add interactive-code-block`}
          filename="Terminal"
          theme="dark"
          showLineNumbers={false}
          badgeText="CLI"
        />
      ),
      code: `import { InteractiveCodeBlock } from "nexoreui";

<InteractiveCodeBlock
  code={commands}
  filename="Terminal"
  theme="dark"
  showLineNumbers={false}
  badgeText="CLI"
/>`
    }
  ];

  const itemsPerPage = 2;
  const totalPages = Math.ceil(examples.length / itemsPerPage);
  const visibleItems = examples.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="interactive-code-block" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Component</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Interactive Code Block</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          A macOS-inspired code presentation card with instant 1-click copy feedback,
          syntax layout, line numbering, and vibrant theme styling.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border text-xs font-mono w-fit mt-3">
          <span className="text-muted-foreground">npx nexoreui-cli add interactive-code-block</span>
        </div>
      </div>

      {/* Interactive Props Editor Playground */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Playground</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Live Preview Box */}
          <div className="xl:col-span-2 min-h-[300px] flex items-center justify-center p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md relative overflow-hidden">
            <div className="w-full max-w-lg">
              <InteractiveCodeBlock
                code={sampleSnippet}
                filename="HeroComponent.tsx"
                theme={theme}
                showLineNumbers={showLineNumbers}
                copyable={copyable}
                badgeText="React 19"
                highlightLines={[4, 7]}
              />
            </div>
          </div>

          {/* Controls Panel */}
          <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configure Props</h3>

            {/* Theme Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Color Theme</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['dark', 'aurora', 'neon', 'glass', 'midnight'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                      theme === t ? 'bg-primary text-primary-foreground font-semibold border-primary' : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                  className="rounded accent-primary cursor-pointer"
                />
                <span className="font-medium">Show Line Numbers</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={copyable}
                  onChange={(e) => setCopyable(e.target.checked)}
                  className="rounded accent-primary cursor-pointer"
                />
                <span className="font-medium">1-Click Copy Button</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-8 pt-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Usage Examples</h2>
        <div className="space-y-10">
          {visibleItems.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <div className="min-h-[180px] flex items-center justify-center p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md overflow-hidden">
                  <div className="w-full">{item.component}</div>
                </div>
                <ComponentSource sourceCode={item.code} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-xs font-mono text-muted-foreground mx-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* API Reference Table */}
      <div className="space-y-4 pt-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">API Reference</h2>
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-semibold">
                <th className="p-3">Prop</th>
                <th className="p-3">Type</th>
                <th className="p-3">Default</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-mono font-bold text-primary">code</td>
                <td className="p-3 font-mono text-purple-400">string</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Source code string to render inside the block.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">filename</td>
                <td className="p-3 font-mono text-purple-400">string</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;Component.tsx&quot;</td>
                <td className="p-3">File title displayed in the macOS titlebar.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">theme</td>
                <td className="p-3 font-mono text-purple-400">&quot;dark&quot; | &quot;aurora&quot; | &quot;neon&quot; | &quot;glass&quot; | &quot;midnight&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;dark&quot;</td>
                <td className="p-3">Visual color scheme styling.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">showLineNumbers</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">true</td>
                <td className="p-3">Whether numeric line numbers are shown.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">highlightLines</td>
                <td className="p-3 font-mono text-purple-400">number[]</td>
                <td className="p-3 font-mono text-muted-foreground">[]</td>
                <td className="p-3">Array of line numbers highlighted with subtle background tint.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">copyable</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">true</td>
                <td className="p-3">Whether the copy-to-clipboard button is rendered.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default InteractiveCodeBlockSection;

"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsEditor } from "../PropsEditor";
import { MorphingGeometry, Button } from "nexoreui";
import { Sparkles, Wand2, Zap, Sliders, Play, RotateCw } from "lucide-react";

export function MorphingGeometrySection() {
  const [shape, setShape] = useState<any>("squircle");
  const [color, setColor] = useState<any>("violet");
  const [variant, setVariant] = useState<any>("gradient");
  const [size, setSize] = useState<any>("md");
  const [spin, setSpin] = useState<boolean>(false);
  const [glow, setGlow] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);

  const examples = [
    {
      name: "1. Interactive Click-to-Morph",
      component: (
        <MorphingGeometry
          shape="squircle"
          color="violet"
          size="lg"
          interactive={true}
          glow={true}
          icon={<Wand2 className="w-8 h-8 text-white" />}
        />
      ),
      code: `import { MorphingGeometry } from "nexoreui";
import { Wand2 } from "lucide-react";

export default function InteractiveDemo() {
  return (
    <MorphingGeometry
      shape="squircle"
      color="violet"
      size="lg"
      interactive={true}
      glow={true}
      icon={<Wand2 className="w-8 h-8 text-white" />}
    />
  );
}`
    },
    {
      name: "2. Continuous Ambient Spin",
      component: (
        <MorphingGeometry
          shape="squircle"
          color="cyan"
          size="md"
          spin={true}
          spinDuration={5}
          glow={true}
          icon={<Sparkles className="w-6 h-6 text-white" />}
        />
      ),
      code: `import { MorphingGeometry } from "nexoreui";
import { Sparkles } from "lucide-react";

export default function SpinDemo() {
  return (
    <MorphingGeometry
      shape="squircle"
      color="cyan"
      size="md"
      spin={true}
      spinDuration={5}
      glow={true}
      icon={<Sparkles className="w-6 h-6 text-white" />}
    />
  );
}`
    },
    {
      name: "3. Aurora Rainbow Gradient",
      component: (
        <MorphingGeometry
          shape="circle"
          color="rainbow"
          variant="aurora"
          size="lg"
          glow={true}
          icon={<Zap className="w-7 h-7 text-white" />}
        />
      ),
      code: `import { MorphingGeometry } from "nexoreui";
import { Zap } from "lucide-react";

export default function AuroraDemo() {
  return (
    <MorphingGeometry
      shape="circle"
      color="rainbow"
      variant="aurora"
      size="lg"
      glow={true}
      icon={<Zap className="w-7 h-7 text-white" />}
    />
  );
}`
    },
    {
      name: "4. Status Pill Capsule",
      component: (
        <MorphingGeometry
          shape="pill"
          color="emerald"
          size="custom"
          dimension={52}
          glow={true}
          className="px-6 py-2 !w-auto !h-auto flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-semibold text-white font-mono">LIVE CLUSTER</span>
        </MorphingGeometry>
      ),
      code: `import { MorphingGeometry } from "nexoreui";

export default function StatusCapsule() {
  return (
    <MorphingGeometry
      shape="pill"
      color="emerald"
      glow={true}
      className="px-6 py-2 !w-auto !h-auto flex items-center gap-2"
    >
      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
      <span className="text-xs font-semibold text-white font-mono">LIVE CLUSTER</span>
    </MorphingGeometry>
  );
}`
    },
    {
      name: "5. Cyber Neon Glass",
      component: (
        <MorphingGeometry
          shape="squircle"
          color="rose"
          variant="neon"
          size="lg"
          glow={true}
          icon={<Sliders className="w-8 h-8 text-rose-300" />}
        />
      ),
      code: `import { MorphingGeometry } from "nexoreui";
import { Sliders } from "lucide-react";

export default function CyberNeonDemo() {
  return (
    <MorphingGeometry
      shape="squircle"
      color="rose"
      variant="neon"
      size="lg"
      glow={true}
      icon={<Sliders className="w-8 h-8 text-rose-300" />}
    />
  );
}`
    }
  ];

  const itemsPerPage = 2;
  const totalPages = Math.ceil(examples.length / itemsPerPage);
  const visibleItems = examples.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="morphing-geometry" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Component</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Morphing Geometry</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          An interactive geometric entity with fluid corner transitions, continuous ambient rotation,
          specular surface glare, and customizable color gradient palettes.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border text-xs font-mono w-fit mt-3">
          <span className="text-muted-foreground">npx nexoreui-cli add morphing-geometry</span>
        </div>
      </div>

      {/* Interactive Props Editor Playground */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Playground</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Live Preview Box */}
          <div className="xl:col-span-2 min-h-[300px] flex items-center justify-center p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />
            <MorphingGeometry
              shape={shape}
              color={color}
              variant={variant}
              size={size}
              spin={spin}
              glow={glow}
              interactive={true}
              icon={<Wand2 className="w-8 h-8" />}
            />
          </div>

          {/* Controls Panel */}
          <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configure Props</h3>

            {/* Shape selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Shape</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['squircle', 'circle', 'pill', 'square'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShape(s)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                      shape === s ? 'bg-primary text-primary-foreground font-semibold border-primary' : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color preset selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Color Theme</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['violet', 'cyan', 'emerald', 'rose', 'amber', 'rainbow'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                      color === c ? 'bg-primary text-primary-foreground font-semibold border-primary' : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Surface Variant</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['gradient', 'aurora', 'neon', 'glass', 'outline', 'subtle'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVariant(v)}
                    className={`py-1 px-1.5 text-[11px] rounded-lg border capitalize transition-all cursor-pointer ${
                      variant === v ? 'bg-primary text-primary-foreground font-semibold border-primary' : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles: Spin & Glow */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={spin}
                  onChange={(e) => setSpin(e.target.checked)}
                  className="rounded accent-primary cursor-pointer"
                />
                <span className="font-medium">Spin Animation</span>
              </label>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={glow}
                  onChange={(e) => setGlow(e.target.checked)}
                  className="rounded accent-primary cursor-pointer"
                />
                <span className="font-medium">Ambient Glow</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples with Pagination */}
      <div className="space-y-8 pt-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Usage Examples</h2>
        <div className="space-y-10">
          {visibleItems.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <div className="min-h-[180px] flex items-center justify-center p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md overflow-hidden">
                  {item.component}
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
                <td className="p-3 font-mono font-bold text-primary">shape</td>
                <td className="p-3 font-mono text-purple-400">&quot;squircle&quot; | &quot;circle&quot; | &quot;pill&quot; | &quot;square&quot; | &quot;custom&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;squircle&quot;</td>
                <td className="p-3">Corner curvature profile for geometry morphing.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">radius</td>
                <td className="p-3 font-mono text-purple-400">number | string</td>
                <td className="p-3 font-mono text-muted-foreground">-</td>
                <td className="p-3">Explicit border radius override (e.g. 24 or &apos;1.5rem&apos;).</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">color</td>
                <td className="p-3 font-mono text-purple-400">&quot;violet&quot; | &quot;cyan&quot; | &quot;emerald&quot; | &quot;rose&quot; | &quot;amber&quot; | &quot;rainbow&quot; | &quot;mono&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;violet&quot;</td>
                <td className="p-3">Color theme with matching gradients and specular borders.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">variant</td>
                <td className="p-3 font-mono text-purple-400">&quot;gradient&quot; | &quot;aurora&quot; | &quot;neon&quot; | &quot;glass&quot; | &quot;outline&quot; | &quot;subtle&quot;</td>
                <td className="p-3 font-mono text-muted-foreground">&quot;gradient&quot;</td>
                <td className="p-3">Surface material treatment.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">spin</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">false</td>
                <td className="p-3">Enables continuous 360-degree rotational animation.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">interactive</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">false</td>
                <td className="p-3">Whether clicking smoothly morphs the shape to the next preset.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">glow</td>
                <td className="p-3 font-mono text-purple-400">boolean</td>
                <td className="p-3 font-mono text-muted-foreground">true</td>
                <td className="p-3">Renders matching ambient box-shadow glow.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default MorphingGeometrySection;

"use client";

import React, { useState } from "react";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { AuroraBorderFX, AuroraFXColor, AuroraFXGlow, AuroraFXRadius, Button } from "nexoreui";
import { Sparkles, ArrowRight, Check, Sliders, Wand2, Zap, Palette, Layers, Terminal } from "lucide-react";

export function AuroraBorderFXSection() {
  const [color, setColor] = useState<AuroraFXColor>("violet");
  const [glow, setGlow] = useState<AuroraFXGlow>("medium");
  const [radius, setRadius] = useState<AuroraFXRadius>("lg");
  const [showColorPicker, setShowColorPicker] = useState<boolean>(true);
  const [badgeText, setBadgeText] = useState<string>("Aurora Border FX");
  const [title, setTitle] = useState<string>("Reactive Aurora Borders");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const generateLiveCode = () => {
    const propsList: string[] = [];
    if (color !== "violet") propsList.push(`color="${color}"`);
    if (glow !== "medium") propsList.push(`glow="${glow}"`);
    if (radius !== "lg") propsList.push(`radius="${radius}"`);
    if (!showColorPicker) propsList.push(`showColorPicker={false}`);
    if (badgeText !== "Aurora Border FX") propsList.push(`badgeText="${badgeText}"`);
    if (title !== "Reactive Aurora Borders") propsList.push(`title="${title}"`);

    const propsStr = propsList.length > 0 ? " " + propsList.join(" ") : "";
    return `import { AuroraBorderFX } from "nexoreui";

export default function Demo() {
  return (
    <AuroraBorderFX${propsStr} />
  );
}`;
  };

  const propsData = [
    {
      name: "color",
      type: '"violet" | "cyan" | "emerald" | "rose" | "amber" | string',
      defaultValue: '"violet"',
      description: "Color preset or custom CSS hex color code for the Aurora glow.",
      required: false,
    },
    {
      name: "glow",
      type: '"none" | "subtle" | "medium" | "strong"',
      defaultValue: '"medium"',
      description: "Intensity level of the atmospheric radial glow.",
      required: false,
    },
    {
      name: "radius",
      type: '"sm" | "md" | "lg" | "xl" | "full"',
      defaultValue: '"lg"',
      description: "Corner radius profile for the outer container and inner elements.",
      required: false,
    },
    {
      name: "showColorPicker",
      type: "boolean",
      defaultValue: "true",
      description: "Renders interactive color switcher buttons at top right.",
      required: false,
    },
    {
      name: "badgeText",
      type: "string",
      defaultValue: '"Aurora Border FX"',
      description: "Text inside the animated badge pill.",
      required: false,
    },
    {
      name: "title",
      type: "string",
      defaultValue: '"Reactive Aurora Borders"',
      description: "Main headline inside the card body.",
      required: false,
    },
    {
      name: "description",
      type: "string",
      defaultValue: '"Smooth multi-color conic gradients..."',
      description: "Subtitle or description text explaining the component.",
      required: false,
    },
    {
      name: "colors",
      type: "AuroraColorOption[]",
      defaultValue: "defaultAuroraColors",
      description: "Custom array of { name, hex } options for the color switcher.",
      required: false,
    },
    {
      name: "children",
      type: "React.ReactNode",
      defaultValue: "undefined",
      description: "Custom children. When provided, replaces the default card interior.",
      required: false,
    },
  ];

  const examples = [
    {
      name: "1. Interactive Color Switching Card",
      component: (
        <div className="w-full max-w-sm">
          <AuroraBorderFX
            color="violet"
            glow="medium"
            radius="lg"
            showColorPicker={true}
            badgeText="Aurora Border FX"
            title="Reactive Aurora Borders"
            description="Smooth multi-color conic gradients that dynamically track and react with zero JavaScript canvas lag."
          />
        </div>
      ),
      code: `import { AuroraBorderFX } from "nexoreui";

export default function InteractiveDemo() {
  return (
    <AuroraBorderFX
      color="violet"
      glow="medium"
      radius="lg"
      showColorPicker={true}
    />
  );
}`,
    },
    {
      name: "2. Cyan Glow with Custom Content Slot",
      component: (
        <div className="w-full max-w-sm">
          <AuroraBorderFX color="cyan" glow="strong" radius="xl" showColorPicker={false}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-cyan-400">METRIC DASHBOARD</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">Live</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-foreground tracking-tight">99.98%</h4>
                <p className="text-xs text-muted-foreground mt-0.5">High-availability cluster uptime</p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/80 overflow-hidden">
                <div className="h-full w-[99.9%] rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
              </div>
            </div>
          </AuroraBorderFX>
        </div>
      ),
      code: `import { AuroraBorderFX } from "nexoreui";

export default function MetricCardDemo() {
  return (
    <AuroraBorderFX color="cyan" glow="strong" radius="xl" showColorPicker={false}>
      <div className="space-y-4">
        <span className="text-xs font-mono font-semibold text-cyan-400">METRIC DASHBOARD</span>
        <h4 className="text-2xl font-bold text-foreground">99.98%</h4>
        <p className="text-xs text-muted-foreground">High-availability cluster uptime</p>
      </div>
    </AuroraBorderFX>
  );
}`,
    },
    {
      name: "3. Emerald Glowing Hero Card",
      component: (
        <div className="w-full max-w-sm">
          <AuroraBorderFX
            color="emerald"
            glow="strong"
            radius="lg"
            badgeText="Ultra Fast"
            title="Next-Gen Architecture"
            description="Zero-runtime CSS animations powered by hardware accelerated GPU rasterization."
            showColorPicker={false}
          />
        </div>
      ),
      code: `import { AuroraBorderFX } from "nexoreui";

export default function EmeraldDemo() {
  return (
    <AuroraBorderFX
      color="emerald"
      glow="strong"
      radius="lg"
      badgeText="Ultra Fast"
      title="Next-Gen Architecture"
      description="Zero-runtime CSS animations powered by hardware accelerated GPU rasterization."
      showColorPicker={false}
    />
  );
}`,
    },
    {
      name: "4. Rose Cyber Glow Card",
      component: (
        <div className="w-full max-w-sm">
          <AuroraBorderFX
            color="rose"
            glow="medium"
            radius="xl"
            badgeText="Cyber Security"
            title="Encrypted Channels"
            description="End-to-end authenticated state synchronization with differential cryptographic proofs."
            showColorPicker={true}
          />
        </div>
      ),
      code: `import { AuroraBorderFX } from "nexoreui";

export default function RoseDemo() {
  return (
    <AuroraBorderFX
      color="rose"
      glow="medium"
      radius="xl"
      badgeText="Cyber Security"
      title="Encrypted Channels"
    />
  );
}`,
    },
    {
      name: "5. Amber Gold Ambient Card",
      component: (
        <div className="w-full max-w-sm">
          <AuroraBorderFX
            color="amber"
            glow="subtle"
            radius="sm"
            badgeText="Pro Edition"
            title="Premium Tier Perks"
            description="Unlimited team members, priority CDN rendering, and tailored design token exports."
            showColorPicker={false}
          />
        </div>
      ),
      code: `import { AuroraBorderFX } from "nexoreui";

export default function AmberDemo() {
  return (
    <AuroraBorderFX
      color="amber"
      glow="subtle"
      radius="sm"
      badgeText="Pro Edition"
      title="Premium Tier Perks"
      showColorPicker={false}
    />
  );
}`,
    },
  ];

  const itemsPerPage = 2;
  const totalPages = Math.ceil(examples.length / itemsPerPage);
  const visibleItems = examples.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="aurora-border-fx" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flagship Showcase Component</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Aurora Border FX
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          The flagship reactive Aurora glow card from the NexoreUI home page. Features multi-color
          gradient borders, dynamic atmospheric blur, interactive color switcher bar, and versatile
          children slot support.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border text-xs font-mono w-fit mt-3">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground">npx nexoreui-cli add aurora-border-fx</span>
        </div>
      </div>

      {/* Interactive Props Editor Playground */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Interactive Playground</h2>
          <span className="text-xs text-muted-foreground font-mono">Live dynamic controls</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Live Preview Box */}
          <div className="xl:col-span-2 min-h-[360px] flex items-center justify-center p-6 sm:p-10 rounded-2xl border border-border bg-card/40 backdrop-blur-md relative overflow-hidden">
            <div className="w-full max-w-md">
              <AuroraBorderFX
                color={color}
                glow={glow}
                radius={radius}
                showColorPicker={showColorPicker}
                badgeText={badgeText}
                title={title}
                onColorChange={(newHex) => {
                  setColor(newHex);
                }}
              />
            </div>
          </div>

          {/* Controls Panel */}
          <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Configure Props
            </h3>

            {/* Color preset */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Color Theme</label>
              <div className="grid grid-cols-5 gap-1.5">
                {(["violet", "cyan", "emerald", "rose", "amber"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                      color === c
                        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Glow intensity */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Glow Intensity</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["none", "subtle", "medium", "strong"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGlow(g)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                      glow === g
                        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Radius */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Radius</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["sm", "md", "lg", "xl"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadius(r)}
                    className={`py-1.5 px-2 text-xs rounded-lg border uppercase font-mono transition-all cursor-pointer ${
                      radius === r
                        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Show color picker switch */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs font-medium text-foreground">Color Picker Bar</label>
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  showColorPicker ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.75 ${
                    showColorPicker ? "translate-x-4.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Text inputs */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Badge Text</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Card Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Live Generated Code Snippet */}
        <div className="pt-2">
          <ComponentSource sourceCode={generateLiveCode()} />
        </div>
      </div>

      {/* Props Table */}
      <div className="space-y-4">
        <PropsTable propsData={propsData} />
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Usage Examples</h2>
          <span className="text-xs text-muted-foreground font-mono">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="space-y-8">
          {visibleItems.map((ex, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{ex.name}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <div className="min-h-[260px] flex items-center justify-center p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-md">
                  {ex.component}
                </div>
                <ComponentSource sourceCode={ex.code} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}

export default AuroraBorderFXSection;

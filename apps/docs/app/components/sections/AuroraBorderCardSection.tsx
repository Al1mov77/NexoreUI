"use client";

import React, { useState, useMemo } from "react";
import { PropsTable } from "../PropsTable";
import {
  AuroraBorderCard,
  AuroraVariant,
  AuroraSpeed,
  AuroraGlow,
  AuroraRadius,
  AuroraAnimation,
} from "nexoreui";
import {
  Sparkles,
  Zap,
  Sliders,
  Smartphone,
  Copy,
  Check,
  Eye,
  Code2,
  Bot,
  ArrowRight,
  ShieldCheck,
  Type,
  Layers,
  Wand2,
} from "lucide-react";
import { copyToClipboard } from "../../utils/clipboard";

const auroraBorderCardPropsData = [
  {
    name: "variant",
    type: '"aurora" | "ocean" | "sunset" | "forest" | "cyber" | "gold" | "mono"',
    defaultValue: '"aurora"',
    description: "Color palette theme for the continuously circulating animated gradient border.",
    required: false,
  },
  {
    name: "speed",
    type: '"slow" | "normal" | "fast"',
    defaultValue: '"normal"',
    description: "Cycle duration: slow (8s), normal (4.5s), fast (2.5s).",
    required: false,
  },
  {
    name: "glow",
    type: '"subtle" | "medium" | "strong" | "none"',
    defaultValue: '"medium"',
    description: "Intensity of the ambient luminous glow diffusing around the card perimeter.",
    required: false,
  },
  {
    name: "borderWidth",
    type: "1 | 2 | 3 | number",
    defaultValue: "2",
    description: "Stroke thickness of the animated border in pixels.",
    required: false,
  },
  {
    name: "radius",
    type: '"sm" | "md" | "lg" | "xl"',
    defaultValue: '"xl"',
    description: "Corner curvature: sm (rounded-xl), md (rounded-2xl), lg (rounded-3xl), xl (rounded-[2rem]).",
    required: false,
  },
  {
    name: "animation",
    type: '"flow" | "wave" | "pulse"',
    defaultValue: '"flow"',
    description: "Motion style: flow (360° perimeter wave rotation), wave (linear wave shift), pulse (breathing luminance).",
    required: false,
  },
  {
    name: "title",
    type: "string",
    defaultValue: '"Beautiful Components"',
    description: "Heading text rendered in the card header.",
    required: false,
  },
  {
    name: "subtitle",
    type: "string",
    defaultValue: '"For Modern Builders"',
    description: "Gradient subtitle rendered beneath the heading.",
    required: false,
  },
  {
    name: "description",
    type: "string",
    defaultValue: '"Build stunning interfaces with premium animated components."',
    description: "Body copy rendered in default content mode.",
    required: false,
  },
  {
    name: "badgeText",
    type: "string",
    defaultValue: '"NexoreUI"',
    description: "Text for the top badge.",
    required: false,
  },
  {
    name: "buttonText",
    type: "string",
    defaultValue: '"Get Started"',
    description: "Text for the call-to-action button.",
    required: false,
  },
  {
    name: "children",
    type: "React.ReactNode",
    defaultValue: "undefined",
    description: "Custom content rendered inside the card surface. If omitted, default showcase content is rendered.",
    required: false,
  },
  {
    name: "className",
    type: "string",
    defaultValue: "—",
    description: "Additional CSS classes applied to the outer container.",
    required: false,
  },
];

interface VariantOption {
  id: AuroraVariant;
  name: string;
  gradientText: string;
  dotColor: string;
}

const variantOptions: VariantOption[] = [
  {
    id: "aurora",
    name: "Aurora",
    gradientText: "Purple → Pink → Blue → Cyan",
    dotColor: "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]",
  },
  {
    id: "ocean",
    name: "Ocean",
    gradientText: "Blue → Cyan → Teal",
    dotColor: "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]",
  },
  {
    id: "sunset",
    name: "Sunset",
    gradientText: "Orange → Pink → Purple",
    dotColor: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]",
  },
  {
    id: "forest",
    name: "Forest",
    gradientText: "Green → Lime → Emerald",
    dotColor: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]",
  },
  {
    id: "cyber",
    name: "Cyber",
    gradientText: "Pink → Purple → Cyan",
    dotColor: "bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]",
  },
  {
    id: "gold",
    name: "Gold",
    gradientText: "Yellow → Orange → Red",
    dotColor: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]",
  },
  {
    id: "mono",
    name: "Mono",
    gradientText: "White → Gray → Black",
    dotColor: "bg-zinc-300 shadow-[0_0_10px_rgba(212,212,216,0.8)]",
  },
];

export function AuroraBorderCardSection() {
  // Live Style Props State
  const [variant, setVariant] = useState<AuroraVariant>("aurora");
  const [speed, setSpeed] = useState<AuroraSpeed>("fast");
  const [glow, setGlow] = useState<AuroraGlow>("medium");
  const [borderWidth, setBorderWidth] = useState<1 | 2 | 3>(1);
  const [radius, setRadius] = useState<AuroraRadius>("xl");
  const [animation, setAnimation] = useState<AuroraAnimation>("flow");

  // Live Content Props State (Editable by user)
  const [title, setTitle] = useState("Beautiful Components");
  const [subtitle, setSubtitle] = useState("For Modern Builders");
  const [description, setDescription] = useState("Build stunning interfaces with premium animated components.");
  const [badgeText, setBadgeText] = useState("NexoreUI");
  const [buttonText, setButtonText] = useState("Get Started");

  // UI Tabs State
  const [activeTab, setActiveTab] = useState<"preview" | "controls" | "code">("preview");
  const [copied, setCopied] = useState(false);

  // Generated React Code based on Live Props
  const generatedCode = useMemo(() => {
    const customProps: string[] = [];
    if (variant !== "aurora") customProps.push(`variant="${variant}"`);
    if (speed !== "fast") customProps.push(`speed="${speed}"`);
    if (glow !== "medium") customProps.push(`glow="${glow}"`);
    if (borderWidth !== 1) customProps.push(`borderWidth={${borderWidth}}`);
    if (radius !== "xl") customProps.push(`radius="${radius}"`);
    if (animation !== "flow") customProps.push(`animation="${animation}"`);
    if (badgeText !== "NexoreUI") customProps.push(`badgeText="${badgeText}"`);
    if (title !== "Beautiful Components") customProps.push(`title="${title}"`);
    if (subtitle !== "For Modern Builders") customProps.push(`subtitle="${subtitle}"`);
    if (description !== "Build stunning interfaces with premium animated components.")
      customProps.push(`description="${description}"`);
    if (buttonText !== "Get Started") customProps.push(`buttonText="${buttonText}"`);

    const propsStr = customProps.length > 0 ? `\n  ${customProps.join("\n  ")}\n` : " ";

    return `<AuroraBorderCard${propsStr}/>`;
  }, [variant, speed, glow, borderWidth, radius, animation, title, subtitle, description, badgeText, buttonText]);

  const handleCopy = async () => {
    await copyToClipboard(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="aurora-border-card" className="space-y-12 scroll-mt-20">
      {/* ─── Hero Header ─── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Aurora Border Card
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            New
          </span>
        </div>
        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          A modern, state-of-the-art card featuring continuously flowing Aurora Borealis gradient waves.
          Autonomous on mount without requiring hover, with high-vibrancy chromatic waves and customizable live props.
        </p>
      </div>

      {/* ─── Key Features Row ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Zap, title: "Luminous Wave Flow", desc: "Visible flowing chromatic aurora bands" },
          { icon: Sparkles, title: "7 Rich Variants", desc: "Aurora, Ocean, Sunset, Forest & more" },
          { icon: Sliders, title: "Editable Live Props", desc: "Change text, titles, speed & glow" },
          { icon: Smartphone, title: "Light & Dark Ready", desc: "Pure white light & deep obsidian dark" },
        ].map((feat, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-900/40 space-y-1"
          >
            <div className="flex items-center gap-2 text-primary font-semibold text-xs">
              <feat.icon className="w-3.5 h-3.5" />
              <span>{feat.title}</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* ─── Interactive Showcase / Playground ─── */}
      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/60 overflow-hidden shadow-sm">
        {/* Top Action / Tab Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md">
          {/* Tabs: Preview | Controls | Code */}
          <div className="flex items-center gap-1.5 bg-zinc-200/60 dark:bg-white/5 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "preview"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("controls")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "controls"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Controls</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "code"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
          </div>

          {/* Quick Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-10">
          {activeTab === "preview" && (
            <div className="flex flex-col items-center justify-center min-h-[380px] w-full py-4">
              <AuroraBorderCard
                variant={variant}
                speed={speed}
                glow={glow}
                borderWidth={borderWidth}
                radius={radius}
                animation={animation}
                title={title}
                subtitle={subtitle}
                description={description}
                badgeText={badgeText}
                buttonText={buttonText}
                className="w-full max-w-lg"
              />
            </div>
          )}

          {activeTab === "controls" && (
            <div className="space-y-6 max-w-4xl mx-auto py-2">
              {/* Content Props Section */}
              <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Type className="w-4 h-4" />
                  <span>Card Content Props</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Title (Heading)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Subtitle (Gradient)
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Description Body
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>

              {/* Style & Animation Props Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Variant Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Variant Palette
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {variantOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setVariant(opt.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          variant === opt.id
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                            : "border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${opt.dotColor}`} />
                        <span className="text-xs">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation Speed */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Animation Speed
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["slow", "normal", "fast"] as AuroraSpeed[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSpeed(s)}
                        className={`py-2 rounded-xl border text-xs font-medium capitalize transition-all cursor-pointer ${
                          speed === s
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                            : "border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {s} {s === "slow" ? "(8s)" : s === "normal" ? "(4.5s)" : "(2.5s)"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glow Intensity */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Glow Intensity
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["none", "subtle", "medium", "strong"] as AuroraGlow[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGlow(g)}
                        className={`py-2 rounded-xl border text-xs font-medium capitalize transition-all cursor-pointer ${
                          glow === g
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                            : "border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Width */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Border Width
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([1, 2, 3] as const).map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setBorderWidth(w)}
                        className={`py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          borderWidth === w
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                            : "border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {w}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Radius */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Corner Radius
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["sm", "md", "lg", "xl"] as AuroraRadius[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRadius(r)}
                        className={`py-2 rounded-xl border text-xs font-medium uppercase transition-all cursor-pointer ${
                          radius === r
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                            : "border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation Style */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Animation Movement
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["flow", "wave", "pulse"] as AuroraAnimation[]).map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAnimation(a)}
                        className={`py-2 rounded-xl border text-xs font-medium capitalize transition-all cursor-pointer ${
                          animation === a
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                            : "border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "code" && (
            <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 text-zinc-200 p-5 font-mono text-xs leading-relaxed">
              <pre className="overflow-x-auto">
                <code>{generatedCode}</code>
              </pre>
            </div>
          )}
        </div>

        {/* ─── Choose Your Variant Interactive Pill Bar ─── */}
        <div className="px-5 py-6 border-t border-zinc-200/80 dark:border-white/10 bg-white/40 dark:bg-zinc-950/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
            Choose Your Variant
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {variantOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setVariant(opt.id)}
                className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between gap-2 cursor-pointer ${
                  variant === opt.id
                    ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-md shadow-primary/10 ring-2 ring-primary/40"
                    : "border-zinc-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${opt.dotColor}`} />
                    <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                      {opt.name}
                    </span>
                  </div>
                  {variant === opt.id && (
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                  {opt.gradientText}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── API Reference (Props Table) ─── */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            API Reference
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Complete list of properties and customization options available for{" "}
            <code className="text-primary font-mono text-xs">AuroraBorderCard</code>.
          </p>
        </div>
        <PropsTable propsData={auroraBorderCardPropsData} />
      </div>

      {/* ─── Real-World Examples (1 Page, 2 Best Examples Only) ─── */}
      <div className="space-y-6 pt-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Real-World Examples
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            Explore responsive implementation patterns across AI features and SaaS pricing tiers.
          </p>
        </div>

        {/* 2 Showcase Examples in 1 clean grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Example 1: AI Feature Showcase Card */}
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/40 dark:bg-zinc-950/40 space-y-5 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                AI Feature Showcase Card
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Hero showcase card for highlighting state-of-the-art AI agent capabilities.
              </p>
            </div>

            <div className="flex items-center justify-center py-4 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-xl p-4">
              <AuroraBorderCard
                variant="aurora"
                speed="fast"
                glow="medium"
                radius="xl"
                borderWidth={1}
                className="w-full max-w-md"
              >
                <div className="flex flex-col h-full justify-between gap-6">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Next-Gen Agent</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">v2.4.0</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                      Autonomous Intelligence
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Synthesize multi-modal workflows with continuous real-time reasoning and deterministic tool orchestration.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <span>Launch Pipeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button className="py-2.5 px-4 rounded-xl text-xs font-medium border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                      Docs
                    </button>
                  </div>
                </div>
              </AuroraBorderCard>
            </div>

            <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 p-3 font-mono text-[11px] text-zinc-300">
              <pre className="overflow-x-auto max-h-40">
                <code>{`import { AuroraBorderCard } from "nexoreui";
import { Bot, ArrowRight } from "lucide-react";

export default function FeatureCard() {
  return (
    <AuroraBorderCard variant="aurora" speed="normal" glow="medium" radius="xl" borderWidth={2}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-purple-400">Next-Gen Agent</span>
          <span className="text-xs text-zinc-500">v2.4.0</span>
        </div>
        <h4 className="text-2xl font-bold">Autonomous Intelligence</h4>
        <button className="w-full py-2.5 rounded-xl bg-primary text-white">
          Launch Pipeline →
        </button>
      </div>
    </AuroraBorderCard>
  );
}`}</code>
              </pre>
            </div>
          </div>

          {/* Example 2: SaaS Pricing Tier (Pro Plan) */}
          <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/40 dark:bg-zinc-950/40 space-y-5 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                SaaS Pricing Tier (Pro Plan)
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Highlighted pricing card with vibrant Sunset gradient to maximize conversion.
              </p>
            </div>

            <div className="flex items-center justify-center py-4 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-xl p-4">
              <AuroraBorderCard
                variant="sunset"
                speed="fast"
                glow="strong"
                radius="xl"
                borderWidth={1}
                className="w-full max-w-md"
              >
                <div className="flex flex-col h-full justify-between gap-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                      Most Popular
                    </span>
                    <span className="text-xs text-zinc-500">Billed monthly</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">$49</span>
                      <span className="text-sm text-zinc-500">/ month</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Everything modern engineering teams need to scale.
                    </p>
                  </div>
                  <div className="space-y-2 border-t border-zinc-200/80 dark:border-white/10 pt-4 text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Unlimited AI completions & streaming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Dedicated low-latency edge nodes</span>
                    </div>
                  </div>
                  <button className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-95 shadow-md shadow-orange-500/20 cursor-pointer">
                    Upgrade to Pro
                  </button>
                </div>
              </AuroraBorderCard>
            </div>

            <div className="rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 p-3 font-mono text-[11px] text-zinc-300">
              <pre className="overflow-x-auto max-h-40">
                <code>{`import { AuroraBorderCard } from "nexoreui";
import { ShieldCheck } from "lucide-react";

export default function PricingCard() {
  return (
    <AuroraBorderCard variant="sunset" speed="normal" glow="strong" radius="xl">
      <div className="flex flex-col gap-6">
        <span className="text-xs font-bold uppercase text-orange-500">Most Popular</span>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-white">$49</span>
          <span className="text-sm text-zinc-400">/ month</span>
        </div>
        <button className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500">
          Upgrade to Pro
        </button>
      </div>
    </AuroraBorderCard>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuroraBorderCardSection;

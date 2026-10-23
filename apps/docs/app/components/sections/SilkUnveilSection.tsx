"use client";

import React, { useState } from "react";
import { SilkUnveil } from "nexoreui";
import { silkUnveil } from "../../../../../packages/cli/src/registry/silk-unveil";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { Sparkles, Layers, Sliders, Eye } from "lucide-react";

const PROPS_DATA = [
  {
    name: "src",
    type: "string",
    defaultValue: "required",
    description: "Transparent PNG image URL of the product silhouette.",
  },
  {
    name: "aspectRatio",
    type: "string",
    defaultValue: '"3/4"',
    description: 'Stage aspect ratio. Use "4/3" for wide products like cars or keyboards, and "3/4" for tall silhouettes.',
  },
  {
    name: "productWidth",
    type: "string",
    defaultValue: '"52%"',
    description: "Width of the product image relative to the stage width.",
  },
  {
    name: "clothDark",
    type: "[number, number, number]",
    defaultValue: "[96, 20, 34]",
    description: "RGB dark base shadow tone of the silk fabric.",
  },
  {
    name: "clothLight",
    type: "[number, number, number]",
    defaultValue: "[214, 172, 102]",
    description: "RGB highlight sheen tone of the silk fabric.",
  },
  {
    name: "defaultUnveiled",
    type: "boolean",
    defaultValue: "false",
    description: "Whether the fabric is already pulled away upon initial component mount.",
  },
  {
    name: "alt",
    type: "string",
    defaultValue: '"Unveiled Product"',
    description: "Accessibility image description.",
  },
];

const CLOTH_PALETTES = [
  {
    name: "Royal Crimson & Gold (Default)",
    dark: [96, 20, 34] as [number, number, number],
    light: [214, 172, 102] as [number, number, number],
    tag: "Luxury / Haute Couture",
  },
  {
    name: "Midnight Navy & Silver (Toy / Automotive)",
    dark: [24, 38, 92] as [number, number, number],
    light: [190, 205, 235] as [number, number, number],
    tag: "Collector's Showcase",
  },
  {
    name: "Emerald Noir & Jade Luster",
    dark: [16, 52, 34] as [number, number, number],
    light: [167, 243, 208] as [number, number, number],
    tag: "Horology & Fine Jewelry",
  },
  {
    name: "Obsidian & Iridescent Violet",
    dark: [24, 16, 36] as [number, number, number],
    light: [192, 132, 252] as [number, number, number],
    tag: "Cyberpunk / Tech Pro",
  },
];

const PRODUCT_PRESETS = [
  {
    id: "toy-car",
    name: "Vintage Gullwing 300SL",
    tagline: "Diecast collector's sports coupe with gullwing doors",
    src: "/images/products/toy-car.png",
    aspectRatio: "4/3",
    productWidth: "56%",
    palette: CLOTH_PALETTES[1], // Midnight Navy & Silver
  },
  {
    id: "perfume",
    name: "Architectural Flacon Perfume",
    tagline: "Obsidian crystal glass with magnetic golden cap",
    src: "/images/products/perfume-bottle.png",
    aspectRatio: "3/4",
    productWidth: "48%",
    palette: CLOTH_PALETTES[0], // Royal Crimson & Gold
  },
  {
    id: "sneaker",
    name: "Aerodynamic Sneaker",
    tagline: "Carbon-fiber speed plate & micro-mesh upper",
    src: "/images/products/sneaker-blackcat.png",
    aspectRatio: "4/3",
    productWidth: "58%",
    palette: CLOTH_PALETTES[3],
  },
  {
    id: "headphones",
    name: "Studio Acoustics ANC",
    tagline: "Graphene composite acoustic transducers with ANC",
    src: "/images/products/headphones-studio.png",
    aspectRatio: "3/4",
    productWidth: "52%",
    palette: CLOTH_PALETTES[0],
  },
  {
    id: "watch-cyber",
    name: "Cybernetic Smartwatch",
    tagline: "Ultra-high frequency holographic display & dual crown",
    src: "/images/products/watch-cyber.png",
    aspectRatio: "3/4",
    productWidth: "50%",
    palette: CLOTH_PALETTES[2],
  },
];

export function SilkUnveilSection() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_PRESETS[0]);
  const [aspectRatio, setAspectRatio] = useState(PRODUCT_PRESETS[0].aspectRatio);
  const [productWidth, setProductWidth] = useState(PRODUCT_PRESETS[0].productWidth);
  const [selectedPalette, setSelectedPalette] = useState(PRODUCT_PRESETS[0].palette);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [remountKey, setRemountKey] = useState(0);

  const handleProductSelect = (preset: (typeof PRODUCT_PRESETS)[0]) => {
    setSelectedProduct(preset);
    setAspectRatio(preset.aspectRatio);
    setProductWidth(preset.productWidth);
    setSelectedPalette(preset.palette);
    setRemountKey((k) => k + 1);
  };

  const handlePaletteSelect = (palette: (typeof CLOTH_PALETTES)[0]) => {
    setSelectedPalette(palette);
    setRemountKey((k) => k + 1);
  };

  const examples = [
    {
      title: "1. Vintage Gullwing 300SL — Midnight Navy & Silver Silk (4/3)",
      description: "Collector's automotive launch presentation with wide 4/3 aspect ratio, physical shadow ellipse, and deep navy silk drape.",
      component: (
        <div className="w-full max-w-md mx-auto">
          <SilkUnveil
            src="/images/products/toy-car.png"
            aspectRatio="4/3"
            productWidth="56%"
            clothDark={[24, 38, 92]}
            clothLight={[190, 205, 235]}
            alt="Vintage Gullwing 300SL"
          />
        </div>
      ),
      code: `import { SilkUnveil } from "nexoreui";

export function VintageCarUnveilDemo() {
  return (
    <SilkUnveil
      src="/images/products/toy-car.png"
      aspectRatio="4/3"
      productWidth="56%"
      clothDark={[24, 38, 92]}
      clothLight={[190, 205, 235]}
      alt="Vintage Gullwing 300SL"
    />
  );
}`,
    },
    {
      title: "2. Architectural Flacon Perfume — Royal Crimson & Champagne Gold (3/4)",
      description: "Haute couture luxury cosmetics reveal with tall 3/4 aspect ratio and gold-highlighted burgundy fabric.",
      component: (
        <div className="w-full max-w-sm mx-auto">
          <SilkUnveil
            src="/images/products/perfume-bottle.png"
            aspectRatio="3/4"
            productWidth="48%"
            clothDark={[96, 20, 34]}
            clothLight={[214, 172, 102]}
            alt="Architectural Flacon Perfume"
          />
        </div>
      ),
      code: `import { SilkUnveil } from "nexoreui";

export function LuxuryPerfumeUnveilDemo() {
  return (
    <SilkUnveil
      src="/images/products/perfume-bottle.png"
      aspectRatio="3/4"
      productWidth="48%"
      clothDark={[96, 20, 34]}
      clothLight={[214, 172, 102]}
      alt="Architectural Flacon Perfume"
    />
  );
}`,
    },
    {
      title: "3. Aerodynamic Sneaker — Obsidian & Violet Silk (4/3)",
      description: "Sportswear athletic footwear reveal with wide proportions and iridescent purple textile physics.",
      component: (
        <div className="w-full max-w-md mx-auto">
          <SilkUnveil
            src="/images/products/sneaker-blackcat.png"
            aspectRatio="4/3"
            productWidth="58%"
            clothDark={[24, 16, 36]}
            clothLight={[192, 132, 252]}
            alt="Aerodynamic Sneaker"
          />
        </div>
      ),
      code: `import { SilkUnveil } from "nexoreui";

export function SneakerUnveilDemo() {
  return (
    <SilkUnveil
      src="/images/products/sneaker-blackcat.png"
      aspectRatio="4/3"
      productWidth="58%"
      clothDark={[24, 16, 36]}
      clothLight={[192, 132, 252]}
      alt="Aerodynamic Sneaker"
    />
  );
}`,
    },
    {
      title: "4. Studio Acoustics Headphones — Crimson & Gold (3/4)",
      description: "Audio hardware reveal with draped cloth gathering in folds around the headphones.",
      component: (
        <div className="w-full max-w-sm mx-auto">
          <SilkUnveil
            src="/images/products/headphones-studio.png"
            aspectRatio="3/4"
            productWidth="52%"
            clothDark={[96, 20, 34]}
            clothLight={[214, 172, 102]}
            alt="Studio Acoustics Headphones"
          />
        </div>
      ),
      code: `import { SilkUnveil } from "nexoreui";

export function HeadphonesUnveilDemo() {
  return (
    <SilkUnveil
      src="/images/products/headphones-studio.png"
      aspectRatio="3/4"
      productWidth="52%"
      clothDark={[96, 20, 34]}
      clothLight={[214, 172, 102]}
      alt="Studio Acoustics Headphones"
    />
  );
}`,
    },
    {
      title: "5. Cybernetic Smartwatch — Emerald Noir & Jade Sheen (3/4)",
      description: "Jewelry-grade horology presentation with emerald cloth drape and natural gravitational settling.",
      component: (
        <div className="w-full max-w-sm mx-auto">
          <SilkUnveil
            src="/images/products/watch-cyber.png"
            aspectRatio="3/4"
            productWidth="50%"
            clothDark={[16, 52, 34]}
            clothLight={[167, 243, 208]}
            alt="Cybernetic Smartwatch"
          />
        </div>
      ),
      code: `import { SilkUnveil } from "nexoreui";

export function SmartwatchUnveilDemo() {
  return (
    <SilkUnveil
      src="/images/products/watch-cyber.png"
      aspectRatio="3/4"
      productWidth="50%"
      clothDark={[16, 52, 34]}
      clothLight={[167, 243, 208]}
      alt="Cybernetic Smartwatch"
    />
  );
}`,
    },
  ];

  return (
    <section id="silk-unveil" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pro Objects</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
          SilkUnveil
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          Interactive cloth physics unveil component based on Verlet integration.
          Features a 12×15 procedural fabric mesh with dynamic fold compression shading,
          continuous organic breathing wind, and spring-gathered top anchors pulled away on command.
          No external physics engines or image textures used.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-xs font-mono w-fit mt-3">
          <span className="text-slate-500 dark:text-slate-400">npx nexoreui add silk-unveil</span>
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Interactive Playground
          </h2>
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === "preview"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === "code"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Component Source (CLI 1:1)
            </button>
          </div>
        </div>

        {activeTab === "preview" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* Live Component Preview */}
            <div className="xl:col-span-2 min-h-[520px] flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-[#07090f] relative overflow-hidden">
              <div key={remountKey} className="relative z-10 w-full max-w-[480px] flex items-center justify-center">
                <SilkUnveil
                  src={selectedProduct.src}
                  aspectRatio={aspectRatio}
                  productWidth={productWidth}
                  clothDark={selectedPalette.dark}
                  clothLight={selectedPalette.light}
                  alt={selectedProduct.name}
                />
              </div>

              {/* Product Badge */}
              <div className="absolute top-4 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/8 text-[11px] font-mono text-slate-600 dark:text-slate-400 backdrop-blur-md pointer-events-none z-30">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: `rgb(${selectedPalette.light.join(",")})`,
                  }}
                />
                <span className="text-slate-900 dark:text-white font-semibold">
                  {selectedProduct.name}
                </span>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0a0d14] space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Configure Props
              </h3>

              {/* Product Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Product Silhouette
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {PRODUCT_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProductSelect(p)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedProduct.id === p.id
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-semibold truncate">{p.name}</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${selectedProduct.id === p.id ? "text-primary-foreground/70" : "text-slate-400 dark:text-slate-500"}`}>
                        {p.tagline}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cloth Fabric Palette */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Silk Fabric Palette
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {CLOTH_PALETTES.map((pal) => (
                    <button
                      key={pal.name}
                      onClick={() => handlePaletteSelect(pal)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                        selectedPalette.name === pal.name
                          ? "border-primary bg-primary/10 text-slate-900 dark:text-white font-bold"
                          : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className="truncate pr-2">{pal.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{
                            backgroundColor: `rgb(${pal.dark.join(",")})`,
                          }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{
                            backgroundColor: `rgb(${pal.light.join(",")})`,
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["4/3", "3/4"].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => {
                        setAspectRatio(ratio);
                        setRemountKey((k) => k + 1);
                      }}
                      className={`py-1.5 text-xs rounded-xl border font-mono transition-all cursor-pointer ${
                        aspectRatio === ratio
                          ? "bg-primary text-primary-foreground font-bold border-primary shadow-xs"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {ratio} {ratio === "4/3" ? "(Wide)" : "(Tall)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Width Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Product Width</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{productWidth}</span>
                </div>
                <input
                  type="range"
                  min={35}
                  max={75}
                  value={parseInt(productWidth, 10)}
                  onChange={(e) => {
                    setProductWidth(`${e.target.value}%`);
                    setRemountKey((k) => k + 1);
                  }}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Reset to Defaults */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(PRODUCT_PRESETS[0]);
                  setAspectRatio("4/3");
                  setProductWidth("56%");
                  setSelectedPalette(PRODUCT_PRESETS[0].palette);
                  setRemountKey((k) => k + 1);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <span>Reset to Defaults</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
            <ComponentSource
              sourceCode={silkUnveil.content}
              fileName="silk-unveil.tsx"
            />
          </div>
        )}
      </div>

      {/* Usage Examples */}
      <div className="space-y-6 pt-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Usage Examples
        </h2>
        <div className="space-y-8">
          {examples.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.description}
                </p>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <div className="min-h-[420px] flex items-center justify-center p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#07090f]">
                  {item.component}
                </div>
                <ComponentSource sourceCode={item.code} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Reference Table */}
      <div className="pt-6">
        <PropsTable propsData={PROPS_DATA} />
      </div>
    </section>
  );
}

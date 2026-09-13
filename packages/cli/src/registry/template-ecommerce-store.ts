export const templateEcommerceStore = {
  name: "template-ecommerce-store",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-ecommerce-store.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Check,
  ChevronDown,
  ChevronRight,
  X,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  Menu,
  Eye,
  Layers,
  ArrowRight,
  Star,
  Compass,
} from "lucide-react";

export interface EcommerceStoreTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function EcommerceStoreTemplate({
  brandName = "Atelier Objects",
  theme = "dark",
}: EcommerceStoreTemplateProps) {
  
    const isDark = theme === "dark";

  const [selectedColor, setSelectedColor] = useState<"Obsidian" | "Dune Sand" | "Nordic Sage" | "Terracotta">("Obsidian");
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [bagItems, setBagItems] = useState([
    {
      id: "parka-1",
      name: "The No. 04 Modular Field Parka",
      color: "Obsidian",
      size: "M",
      price: 380,
      qty: 1,
    },
  ]);
  const [openAccordion, setOpenAccordion] = useState<string | null>("materials");

  const colors = [
    { name: "Obsidian", hex: "#18181b", label: "01 / Carbon Black" },
    { name: "Dune Sand", hex: "#d4c5b9", label: "02 / Raw Mineral" },
    { name: "Nordic Sage", hex: "#7a8a7c", label: "03 / Glacial Moss" },
    { name: "Terracotta", hex: "#a45d4c", label: "04 / Baked Earth" },
  ] as const;

  const productImages = [
    { label: "Front Profile", desc: "Minimalist storm collar with covered storm flap" },
    { label: "Material Macro", desc: "320gsm high-density Japanese gabardine weave" },
    { label: "Internal Structure", desc: "Removable thermal lining with magnetic utility pockets" },
  ];

  const bagSubtotal = bagItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleAddToBag = () => {
    setBagItems((prev) => {
      const existing = prev.find((i) => i.color === selectedColor && i.size === selectedSize);
      if (existing) {
        return prev.map((i) =>
          i.color === selectedColor && i.size === selectedSize ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: \`parka-\${Date.now()}\`,
          name: "The No. 04 Modular Field Parka",
          color: selectedColor,
          size: selectedSize,
          price: 380,
          qty: 1,
        },
      ];
    });
    setIsBagOpen(true);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors text-left font-sans"
      
    >
      {/* Top Banner */}
      <div
        className="w-full py-2.5 px-4 text-center text-xs font-mono border-b flex items-center justify-center gap-2"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          color: "#9aa0aa",
        }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Complimentary Climate-Neutral Delivery Worldwide On Orders Over $250</span>
      </div>

      {/* Atelier Navigation */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Mobile Menu Trigger & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-4 w-4" />
              <span
                className="text-sm sm:text-base font-bold tracking-tight uppercase"
                
              >
                {brandName || "Atelier Objects"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wide uppercase" >
            <a href="#outerwear" className="hover:text-[#f4f4f7] transition-colors">
              Outerwear
            </a>
            <a href="#modular" className="hover:text-[#f4f4f7] transition-colors">
              Modular Gear
            </a>
            <a href="#archive" className="hover:text-[#f4f4f7] transition-colors">
              Archive
            </a>
            <a href="#provenance" className="hover:text-[#f4f4f7] transition-colors">
              Provenance
            </a>
          </nav>

          {/* Actions: Wishlist & Bag */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2.5 rounded-full border transition-colors hover:bg-black/5 dark:hover:bg-white/5 hidden sm:flex items-center justify-center"
              
              aria-label="Wishlist"
            >
              <Heart className={\`h-4 w-4 transition-colors \${isWishlisted ? "fill-rose-500 text-rose-500" : ""}\`} />
            </button>

            <button
              onClick={() => setIsBagOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all shadow-sm hover:scale-[1.02]"
              
            >
              <ShoppingBag className="h-4 w-4 text-[#6366f1]" />
              <span>Bag ({bagItems.reduce((acc, i) => acc + i.qty, 0)})</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b overflow-hidden"
              
            >
              <div className="px-4 py-4 space-y-3 text-xs uppercase font-medium">
                <a
                  href="#outerwear"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Outerwear (Winter 2026)
                </a>
                <a
                  href="#modular"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Modular Utility Systems
                </a>
                <a
                  href="#archive"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Archive & Limited Runs
                </a>
                <a
                  href="#provenance"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5"
                >
                  Fabric Provenance & Kyoto Mills
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Product Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-mono mb-6" >
          <span>Archive 2026</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Technical Outerwear</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#f4f4f7] font-medium">No. 04 Modular Field Parka</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Tactile Product Visual Showcase */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="w-full aspect-[4/5] sm:aspect-[4/4] rounded-2xl border p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all shadow-lg group"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#f4f3f0",
                borderColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: "0.75rem",
              }}
            >
              {/* Product Badge Header */}
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col gap-1.5">
                  <span
                    className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm"
                    
                  >
                    Edition 04 • 200 Handcrafted Units
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium pl-1">
                    In Stock • Ready to Dispatch
                  </span>
                </div>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3 rounded-full border shadow-sm transition-transform active:scale-95 hover:scale-105"
                  
                  aria-label="Save to wishlist"
                >
                  <Heart
                    className={\`h-4 w-4 transition-colors \${
                      isWishlisted ? "fill-rose-500 text-rose-500" : "text-[#9aa0aa]"
                    }\`}
                  />
                </button>
              </div>

              {/* Product Visual Centerpiece */}
              <div className="w-full flex-1 flex flex-col items-center justify-center my-6">
                <div
                  className="w-52 sm:w-64 h-64 sm:h-80 rounded-2xl shadow-2xl transition-all duration-700 border flex flex-col justify-between p-6 relative overflow-hidden"
                  style={{
                    backgroundColor: colors.find((c) => c.name === selectedColor)?.hex,
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  {/* Subtle woven texture overlay */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                      backgroundSize: "8px 8px",
                    }}
                  />

                  <div className="flex justify-between items-center text-xs font-mono text-white/80 tracking-widest uppercase z-10">
                    <span>ATELIER NO. 04</span>
                    <span className="border border-white/20 px-2 py-0.5 rounded text-[11px]">JAPAN</span>
                  </div>

                  <div className="text-center z-10 space-y-1">
                    <p className="text-white font-mono text-base tracking-wider font-semibold">
                      {selectedColor.toUpperCase()}
                    </p>
                    <p className="text-white/75 font-mono text-xs">
                      {productImages[activeImageIndex].label}
                    </p>
                  </div>

                  <div className="flex justify-between items-end text-xs font-mono text-white/80 z-10">
                    <span>KYOTO MILL</span>
                    <span>320 GSM GABARDINE</span>
                  </div>
                </div>

                <p className="text-xs font-mono mt-4 text-center max-w-sm" >
                  {productImages[activeImageIndex].desc}
                </p>
              </div>

              {/* Bottom Technical Spec Bar */}
              <div
                className="flex items-center justify-between text-xs font-mono pt-3 border-t z-10"
                
              >
                <span>Hand-stitched in Kyoto, JP</span>
                <span>Waterproof 20,000mm Rating</span>
              </div>
            </div>

            {/* Thumbnail View Switcher */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={\`p-3 rounded-xl border text-left transition-all \${
                    activeImageIndex === idx
                      ? "ring-2 shadow-sm"
                      : "opacity-70 hover:opacity-100"
                  }\`}
                  style={{
                    backgroundColor: "#12141c",
                    borderColor: activeImageIndex === idx ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <p className="text-xs sm:text-sm font-semibold truncate">{img.label}</p>
                  <p className="text-xs font-mono truncate mt-0.5" >
                    View 0{idx + 1}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Specification & Purchase Engine */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#6366f1] font-semibold">
                  Modular System Series
                </span>
                <span className="text-xs font-mono opacity-40">•</span>
                <div className="flex items-center text-amber-500 text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  <span className="text-xs font-mono ml-1 font-semibold">4.9</span>
                  <span className="text-xs font-mono opacity-60 ml-1">(48 verified reviews)</span>
                </div>
              </div>

              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2"
                
              >
                The No. 04 Modular Field Parka
              </h1>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-bold">$380</span>
                <span className="text-xs font-mono" >
                  USD • VAT Included
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed" >
              Engineered for extreme versatility across unpredictable climates. Crafted with double-faced Japanese gabardine cotton, detachable storm hood, and interior harness for thermal heat regulation.
            </p>

            {/* Color Selector */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium">Selected Colorway:</span>
                <span className="font-mono font-semibold text-[#6366f1]">{selectedColor}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name as any)}
                    className={\`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all \${
                      selectedColor === c.name
                        ? "ring-2 shadow-sm font-semibold"
                        : "opacity-75 hover:opacity-100"
                    }\`}
                    style={{
                      backgroundColor: "#12141c",
                      borderColor: selectedColor === c.name ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded-full border shrink-0"
                      style={{ backgroundColor: c.hex, borderColor: "rgba(0,0,0,0.15)" }}
                    />
                    <span className="text-xs truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium">Select Size (EU/US):</span>
                <button className="text-xs font-mono underline hover:text-[#6366f1] transition-colors">
                  Size Guide & Fit Predictor
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["S", "M", "L", "XL"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={\`h-11 rounded-xl text-xs sm:text-sm font-mono font-medium border transition-all flex items-center justify-center \${
                      selectedSize === s
                        ? "shadow-sm font-bold"
                        : "opacity-70 hover:opacity-100"
                    }\`}
                    style={{
                      backgroundColor: selectedSize === s ? "#181a24" : "#12141c",
                      borderColor: selectedSize === s ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                      color: selectedSize === s ? "#6366f1" : "#f4f4f7",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                ● In stock in Size {selectedSize} — 2 units remain for immediate dispatch
              </p>
            </div>

            {/* Add to Bag CTA */}
            <div className="space-y-3.5 pt-2">
              <button
                onClick={handleAddToBag}
                className="w-full h-12 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5"
                
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Shopping Bag — $380 USD</span>
              </button>

              <div
                className="grid grid-cols-3 gap-2 p-3.5 rounded-xl border text-center text-xs font-mono"
                
              >
                <div className="flex flex-col items-center gap-1">
                  <Truck className="h-4 w-4 text-[#6366f1]" />
                  <span className="text-[11px]">DHL Express (2-3d)</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x" >
                  <RotateCcw className="h-4 w-4 text-[#6366f1]" />
                  <span className="text-[11px]">30-Day Atelier Trial</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-[#6366f1]" />
                  <span className="text-[11px]">Lifetime Repair</span>
                </div>
              </div>
            </div>

            {/* Structured Technical Specifications */}
            <div
              className="border-t divide-y text-xs sm:text-sm"
              
            >
              {[
                {
                  id: "materials",
                  title: "Materials & Kyoto Provenance",
                  content:
                    "Crafted from 100% recycled organic Japanese gabardine cotton (320gsm) infused with an invisible micro-porous membrane. Horn buttons sustainably sourced from traditional Bavarian workshops.",
                },
                {
                  id: "fit",
                  title: "Architectural Cut & Proportions",
                  content:
                    "Designed with a relaxed contemporary drop-shoulder cut allowing effortless layering over heavy knitwear. Model is 186cm wearing size M.",
                },
                {
                  id: "sustainability",
                  title: "Circularity & Repair Guarantee",
                  content:
                    "Every Atelier No. 04 garment includes our free lifetime restitching and hardware replacement guarantee at our studios in Kyoto and Zurich.",
                },
              ].map((item) => (
                <div key={item.id} className="py-3.5">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between font-medium text-left hover:text-[#6366f1] transition-colors text-xs sm:text-sm"
                  >
                    <span>{item.title}</span>
                    <span className="font-mono text-sm">{openAccordion === item.id ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {openAccordion === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-2 text-xs sm:text-sm leading-relaxed"
                        
                      >
                        {item.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Slide-over Shopping Bag Drawer */}
      <AnimatePresence>
        {isBagOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
            onClick={() => setIsBagOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md h-full border-l p-6 flex flex-col justify-between shadow-2xl"
              style={{
                backgroundColor: "#12141c",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <div>
                <div
                  className="flex items-center justify-between pb-4 border-b"
                  
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="h-5 w-5 text-[#6366f1]" />
                    <span className="font-bold text-sm sm:text-base tracking-tight uppercase">
                      Shopping Bag ({bagItems.reduce((acc, i) => acc + i.qty, 0)})
                    </span>
                  </div>
                  <button
                    onClick={() => setIsBagOpen(false)}
                    className="p-2 rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    
                    aria-label="Close bag"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto">
                  {bagItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border flex items-start justify-between gap-3"
                      
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-xs sm:text-sm leading-tight">{item.name}</p>
                        <p className="text-xs font-mono" >
                          {item.color} • Size {item.size}
                        </p>
                        <p className="font-mono text-sm font-bold text-[#6366f1]">
                          \${item.price * item.qty} USD
                        </p>
                      </div>

                      <div
                        className="flex items-center gap-2 border rounded-lg p-1 text-xs"
                        
                      >
                        <button
                          onClick={() => {
                            if (item.qty > 1) {
                              setBagItems((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty - 1 } : i))
                              );
                            } else {
                              setBagItems((prev) => prev.filter((i) => i.id !== item.id));
                            }
                          }}
                          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono px-1 font-semibold">{item.qty}</span>
                        <button
                          onClick={() => {
                            setBagItems((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
                            );
                          }}
                          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {bagItems.length === 0 && (
                    <div className="py-12 text-center text-xs sm:text-sm font-mono" >
                      Your shopping bag is currently empty.
                    </div>
                  )}
                </div>
              </div>

              {/* Checkout Summary Footer */}
              <div
                className="pt-4 border-t space-y-3"
                
              >
                <div className="space-y-1.5 text-xs sm:text-sm font-mono">
                  <div className="flex justify-between" >
                    <span>Shipping (Climate-Neutral)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Complimentary</span>
                  </div>
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-[#6366f1]">\${bagSubtotal} USD</span>
                  </div>
                </div>

                <button
                  disabled={bagItems.length === 0}
                  onClick={() => alert(\`Initiating secure encrypted checkout for $\${bagSubtotal} USD...\`)}
                  className="w-full h-12 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  
                >
                  <span>Proceed to Encrypted Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atelier Footer */}
      <footer
        className="py-10 px-4 sm:px-6 lg:px-8 border-t text-xs sm:text-sm transition-colors"
        
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {brandName || "Atelier Objects"}. Sustainable luxury garment architecture.</p>
          <div className="flex items-center gap-5 text-xs font-mono">
            <a href="#circularity" className="hover:underline">Circularity Report</a>
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
`,
};

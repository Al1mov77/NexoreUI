"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel,
  ShieldCheck,
  Clock,
  Sparkles,
  DollarSign,
  ChevronRight,
  Eye,
  CheckCircle2,
  X,
  History,
  FileCheck,
  TrendingUp,
  Award,
  Globe,
  Radio,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function SovereignAuctionsPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [currentBidUsd, setCurrentBidUsd] = useState(2450000);
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP">("USD");
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [auctionToast, setAuctionToast] = useState<string | null>(null);

  const rates: Record<"USD" | "EUR" | "GBP", { symbol: string; rate: number }> = {
    USD: { symbol: "$", rate: 1.0 },
    EUR: { symbol: "€", rate: 0.92 },
    GBP: { symbol: "£", rate: 0.78 },
  };

  const formatPrice = (usdAmount: number) => {
    const converted = usdAmount * rates[currency].rate;
    return `${rates[currency].symbol}${converted.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}`;
  };

  const handlePlaceBid = (increment: number) => {
    const nextBid = currentBidUsd + increment;
    setCurrentBidUsd(nextBid);
    setAuctionToast(`Paddle #418 placed leading bid: ${formatPrice(nextBid)}!`);
    setTimeout(() => setAuctionToast(null), 4000);
  };

  const lot = {
    lotNumber: "LOT 24",
    title: "Composition in Cadmium & Cobalt Resonance",
    artist: "Jean-Michel Vane (b. 1954)",
    medium: "Oil, cold wax, and crushed lapis on Belgian linen",
    dimensions: "195 x 160 cm (76.7 x 63 in)",
    signed: "Signed and dated lower recto 'Vane '88'",
    estimateUsd: "$2,200,000 - $3,000,000",
    provenance: [
      "Galerie Beyeler, Basel (acquired directly from the artist)",
      "Private Collection, Zurich (acquired from the above in 1994)",
      "Exhibited: Centre Pompidou, Paris, 'Lyrical Geometry', 2011",
    ],
    conditionSummary:
      "Original unlined canvas on archival cedar stretcher. Surface impasto crisp under UV inspection. Zero restoration or overpainting detected.",
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans text-left"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(16, 12, 10, 0.88)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "sparkles"} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Sovereign Auctions</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(217, 119, 6, 0.12)",
                    color: "var(--template-primary)",
                  }}
                >
                  Fine Art
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">
                Evening Sale: Post-War & Contemporary Masterworks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Currency Selector */}
            <div
              className="flex items-center gap-1 p-1 rounded-lg border text-xs"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              {(["USD", "EUR", "GBP"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${
                    currency === c ? "bg-amber-600 text-white shadow-sm" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsConditionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--template-primary)" }}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Condition Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {auctionToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(217, 119, 6, 0.12)" : "#fffbeb",
                borderColor: "rgba(217, 119, 6, 0.3)",
                color: "#d97706",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>{auctionToast}</span>
              </div>
              <button onClick={() => setAuctionToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Lot Stage */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6 items-start">
          {/* Left: Artwork Stage Canvas & Provenance (7 cols) */}
          <div className="@lg:col-span-7 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-6"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              {/* Artwork Visual Stage */}
              <div
                className="w-full h-80 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 border"
                style={{
                  backgroundColor: isDark ? "#080605" : "#18181b",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                }}
              >
                {/* Simulated Museum Lighting & Texture Canvas */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/30 via-transparent to-blue-900/30 opacity-70 pointer-events-none" />
                <div className="absolute inset-8 border border-white/20 rounded pointer-events-none flex items-center justify-center">
                  <div className="text-center p-6 space-y-2">
                    <span className="text-xs font-serif italic text-amber-300">Jean-Michel Vane (b. 1954)</span>
                    <h2 className="text-xl font-bold tracking-tight text-white max-w-sm">
                      Composition in Cadmium & Cobalt Resonance, 1988
                    </h2>
                    <span className="text-[11px] opacity-75 font-mono">195 x 160 cm • Belgian Linen</span>
                  </div>
                </div>

                <div className="flex items-center justify-between z-10 text-[10px] font-mono">
                  <span className="bg-amber-600 px-2 py-0.5 rounded font-bold text-white">
                    {lot.lotNumber} • CURRENT LOT
                  </span>
                  <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-emerald-400">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>LIVE SALEROOM LONDON</span>
                  </div>
                </div>

                <div className="z-10 flex items-center justify-between text-[11px] opacity-80 pt-2 border-t border-white/10">
                  <span>{lot.dimensions}</span>
                  <span className="font-mono">{lot.signed}</span>
                </div>
              </div>

              {/* Artwork Details & Provenance */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">Verified Provenance</h3>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Authenticated by Vane Foundation</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {lot.provenance.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border flex items-start gap-2.5"
                      style={{
                        borderColor: "var(--template-border)",
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                      }}
                    >
                      <span className="font-mono text-[10px] opacity-50 shrink-0 mt-0.5">0{idx + 1}</span>
                      <span className="opacity-80 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Bidding Terminal (5 cols) */}
          <div className="@lg:col-span-5 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-6"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div>
                  <span className="text-xs font-mono opacity-60">CURRENT HIGH BID</span>
                  <div className="text-3xl font-black text-amber-500 font-mono tracking-tight mt-0.5">
                    {formatPrice(currentBidUsd)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] opacity-50 block font-mono">ESTIMATE</span>
                  <span className="text-xs font-semibold">{lot.estimateUsd}</span>
                </div>
              </div>

              {/* Paddle Raise Increments */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">
                  Raise Bid (Paddle #418)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[50000, 100000, 200000, 500000].map((inc) => (
                    <button
                      key={inc}
                      onClick={() => handlePlaceBid(inc)}
                      className="p-3 rounded-xl border text-left transition-all hover:border-amber-500 hover:bg-amber-500/10 active:scale-95"
                      style={{
                        borderColor: "var(--template-border)",
                      }}
                    >
                      <div className="text-[10px] opacity-60 font-mono">+ {formatPrice(inc)}</div>
                      <div className="text-xs font-bold mt-0.5">{formatPrice(currentBidUsd + inc)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Saleroom Bid Log */}
              <div className="space-y-2 pt-2 border-t" style={{ borderColor: "var(--template-border)" }}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider opacity-60">Saleroom Ledger</span>
                  <span className="font-mono text-[10px] text-emerald-500 font-semibold">RESERVE MET</span>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  {[
                    { source: "Online Paddle #418 (You)", amount: formatPrice(currentBidUsd), time: "Just now", leading: true },
                    { source: "Telephone Desk 04 (Tokyo)", amount: formatPrice(currentBidUsd - 50000), time: "32s ago", leading: false },
                    { source: "Saleroom Floor (London)", amount: formatPrice(currentBidUsd - 150000), time: "1m 14s ago", leading: false },
                    { source: "Telephone Desk 12 (New York)", amount: formatPrice(currentBidUsd - 250000), time: "2m 05s ago", leading: false },
                  ].map((entry, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border flex items-center justify-between"
                      style={{
                        backgroundColor: entry.leading ? "rgba(217, 119, 6, 0.1)" : isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                        borderColor: entry.leading ? "rgba(217, 119, 6, 0.3)" : "var(--template-border)",
                      }}
                    >
                      <div>
                        <div className="font-semibold">{entry.source}</div>
                        <div className="text-[10px] opacity-50">{entry.time}</div>
                      </div>
                      <span className={`font-bold ${entry.leading ? "text-amber-500" : "opacity-80"}`}>
                        {entry.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Condition Report Modal */}
      <AnimatePresence>
        {isConditionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#100d0a" : "#ffffff",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold">Conservator Condition Report</h3>
                </div>
                <button onClick={() => setIsConditionModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="leading-relaxed opacity-80">{lot.conditionSummary}</p>

                <div
                  className="p-3 rounded-xl border space-y-1.5"
                  style={{
                    backgroundColor: "var(--template-surface)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div className="flex justify-between font-semibold">
                    <span>UV Examination</span>
                    <span className="text-emerald-500">Pristine • No Inpainting</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Tension & Stretcher</span>
                    <span className="text-emerald-500">Original Archival Cedar</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Inspection Date</span>
                    <span className="opacity-75">Aug 28, 2026</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsConditionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  Close Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

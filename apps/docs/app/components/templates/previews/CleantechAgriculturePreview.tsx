"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  Droplets,
  Sun,
  Wind,
  Thermometer,
  Activity,
  Sliders,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  Calendar,
  Layers,
  Leaf,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function CleantechAgriculturePreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [phLevel, setPhLevel] = useState(6.2);
  const [ecLevel, setEcLevel] = useState(1.8);
  const [redSpectrum, setRedSpectrum] = useState(65);
  const [blueSpectrum, setBlueSpectrum] = useState(25);
  const [farRedSpectrum, setFarRedSpectrum] = useState(10);
  const [isDosingModalOpen, setIsDosingModalOpen] = useState(false);
  const [dosingToast, setDosingToast] = useState<string | null>(null);

  const cropBatches = [
    { name: "Wasabi Microgreens", bay: "Bay 01-A", stage: "Late Vegetative", day: 18, totalDays: 24, progress: 75, yieldKg: "42.5 kg", health: "Optimal 98%" },
    { name: "Genovese Sweet Basil", bay: "Bay 03-C", stage: "Harvest Ready", day: 36, totalDays: 36, progress: 100, yieldKg: "128.0 kg", health: "Prime Harvest" },
    { name: "Red Butterhead Lettuce", bay: "Bay 02-B", stage: "Canopy Expansion", day: 14, totalDays: 30, progress: 46, yieldKg: "85.2 kg", health: "Optimal 96%" },
    { name: "Culinary Shiso Leaves", bay: "Bay 04-A", stage: "Germination Spike", day: 6, totalDays: 28, progress: 21, yieldKg: "34.0 kg", health: "Rooting Fast" },
  ];

  const handleDosingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDosingModalOpen(false);
    setDosingToast("Peristaltic nutrient injection initiated! Water pH & EC recalibrated.");
    setTimeout(() => setDosingToast(null), 4000);
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
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.85)" : "rgba(255, 255, 255, 0.88)",
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
              <TemplateLogo icon={config.logoIcon || "sprout"} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm @sm:text-base tracking-tight"
                  style={{ fontFamily: "var(--template-heading-font)" }}
                >
                  {config.brandName || "Verdant IoT"}
                </span>
                <span className="hidden @sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Closed Loop CEA
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">Controlled Environment Agriculture & Hydroponics Telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            <div
              className="hidden @md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>98.4% Water Recycled</span>
              <span className="opacity-30">•</span>
              <span className="text-emerald-500">Zero Pesticides</span>
            </div>

            <button
              onClick={() => setIsDosingModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Leaf className="h-3.5 w-3.5" />
              <span>Dose Nutrients</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {dosingToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "var(--template-border)",
              color: "var(--template-fg)",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{dosingToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @lg:py-8 space-y-6">
        {/* Top 4 Environmental Telemetry Cards */}
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Canopy Air Temperature</span>
              <Thermometer className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">22.4°C</span>
              <span className="text-xs text-emerald-500 font-medium">Target ±0.5°C</span>
            </div>
            <p className="text-[11px] opacity-65">Chilled HVAC loop maintaining day/night thermal delta.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[72%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Humidity & VPD Pressure</span>
              <Wind className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">1.12</span>
              <span className="text-xs opacity-60">kPa VPD (68% RH)</span>
            </div>
            <p className="text-[11px] opacity-65">Ideal transpiration rate with zero tipburn risk.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full w-[80%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">CO₂ Photosynthesis Enrichment</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-emerald-500">950</span>
              <span className="text-xs opacity-60">PPM</span>
            </div>
            <p className="text-[11px] opacity-65">+40% Biomass acceleration vs ambient atmosphere.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[88%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Hydroponic Water Chemistry</span>
              <Droplets className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">pH 6.2</span>
              <span className="text-xs opacity-60">EC 1.84 mS</span>
            </div>
            <p className="text-[11px] opacity-65">Automated nutrient absorption at root rhizosphere.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[92%]" />
            </div>
          </div>
        </div>

        {/* Section 1 & 2: Dosing Station Controls & Photosynthetic Light Spectrum */}
        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
          {/* Hydroponic Nutrient Dosing Dispenser */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold tracking-tight">Peristaltic Nutrient Dosing Pumps</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Sub-System Online
                </span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between mb-1 font-sans">
                    <span className="opacity-80">Water Acidity Calibration (pH Target)</span>
                    <span className="font-bold text-cyan-400 font-mono">{phLevel.toFixed(1)} pH</span>
                  </div>
                  <input
                    type="range"
                    min="5.5"
                    max="7.0"
                    step="0.1"
                    value={phLevel}
                    onChange={(e) => setPhLevel(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] opacity-50 font-sans mt-0.5">
                    <span>5.5 Acidic</span>
                    <span>6.2 Optimal</span>
                    <span>7.0 Neutral</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-sans">
                    <span className="opacity-80">Electrical Conductivity (EC Nutrient Density)</span>
                    <span className="font-bold text-emerald-500 font-mono">{ecLevel.toFixed(1)} mS/cm</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.1"
                    value={ecLevel}
                    onChange={(e) => setEcLevel(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] opacity-50 font-sans mt-0.5">
                    <span>1.0 Seedlings</span>
                    <span>1.8 Full Growth</span>
                    <span>3.0 Heavy Bloom</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px]">
                  <div className="p-2.5 rounded-xl border" style={{ borderColor: "var(--template-border)" }}>
                    <div className="opacity-50 text-[10px]">Nitrogen (N)</div>
                    <div className="font-bold text-emerald-500">180 ppm</div>
                  </div>
                  <div className="p-2.5 rounded-xl border" style={{ borderColor: "var(--template-border)" }}>
                    <div className="opacity-50 text-[10px]">Phosphorus</div>
                    <div className="font-bold text-indigo-400">45 ppm</div>
                  </div>
                  <div className="p-2.5 rounded-xl border" style={{ borderColor: "var(--template-border)" }}>
                    <div className="opacity-50 text-[10px]">Potassium</div>
                    <div className="font-bold text-amber-500">220 ppm</div>
                  </div>
                  <div className="p-2.5 rounded-xl border" style={{ borderColor: "var(--template-border)" }}>
                    <div className="opacity-50 text-[10px]">Cal-Mag</div>
                    <div className="font-bold text-cyan-400">120 ppm</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t text-[11px] opacity-70 flex items-center justify-between" style={{ borderColor: "var(--template-border)" }}>
              <span>Reverse Osmosis Filtration: 99.9% Purity</span>
              <span className="text-emerald-500 font-semibold">Pump Cycle: Standby</span>
            </div>
          </div>

          {/* LED Spectrum Programmer */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-rose-500" />
                  <h3 className="text-base font-bold tracking-tight">Photosynthetic Photon Flux (PPFD)</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 font-mono">
                  16h / 8h Photoperiod
                </span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between mb-1 font-sans">
                    <span className="opacity-80">Deep Red 660nm (Biomass & Stemming)</span>
                    <span className="font-bold text-rose-500 font-mono">{redSpectrum}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={redSpectrum}
                    onChange={(e) => setRedSpectrum(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-sans">
                    <span className="opacity-80">Royal Blue 450nm (Leaf Chlorophyll Synthesis)</span>
                    <span className="font-bold text-blue-500 font-mono">{blueSpectrum}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={blueSpectrum}
                    onChange={(e) => setBlueSpectrum(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-sans">
                    <span className="opacity-80">Far Red 730nm (Cryptochrome Photoreceptor)</span>
                    <span className="font-bold text-purple-500 font-mono">{farRedSpectrum}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={farRedSpectrum}
                    onChange={(e) => setFarRedSpectrum(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl border flex items-center justify-between font-sans text-[11px]" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                  <span>Daily Light Integral (DLI):</span>
                  <span className="font-mono font-bold text-emerald-500">17.8 mol/m²/day</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t text-[11px] opacity-70 flex items-center justify-between" style={{ borderColor: "var(--template-border)" }}>
              <span>Fixture Efficacy: 2.85 µmol/J</span>
              <span>PAR Delivery: Uniform 250 µmol/m²/s</span>
            </div>
          </div>
        </div>

        {/* Section 3: Active Crop Growth Stage & Harvest Pipeline */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold tracking-tight">Active Hydroponic Crop Batches</h3>
              <p className="text-xs opacity-65">Real-time biological lifecycle tracking across automated grow bays</p>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-semibold">Facility Status: 100% Operational</span>
          </div>

          <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
            {cropBatches.map((crop, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border flex flex-col justify-between"
                style={{
                  backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                  borderColor: "var(--template-border)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">
                      {crop.bay}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500">{crop.health}</span>
                  </div>

                  <h4 className="text-xs font-bold mb-1">{crop.name}</h4>
                  <div className="text-[11px] opacity-70 mb-3">{crop.stage}</div>

                  {/* Progress bar */}
                  <div className="space-y-1 text-[10px] font-mono mb-3">
                    <div className="flex justify-between opacity-60">
                      <span>Day {crop.day} of {crop.totalDays}</span>
                      <span>{crop.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${crop.progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center justify-between text-xs font-mono" style={{ borderColor: "var(--template-border)" }}>
                  <span className="opacity-60 text-[10px]">Proj. Harvest:</span>
                  <span className="font-bold text-emerald-500">{crop.yieldKg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Dosing Dispatch Modal */}
      <AnimatePresence>
        {isDosingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "var(--template-bg)",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              <button
                onClick={() => setIsDosingModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold">Automated Nutrient Dispenser</h3>
              </div>

              <form onSubmit={handleDosingSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Botanical Target Recipe</label>
                  <select
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                  >
                    <option value="microgreens">Microgreens Fast-Rooting Formula (EC 1.4, pH 6.1)</option>
                    <option value="leafy">Leafy Greens Maximum Crispness (EC 1.8, pH 6.2)</option>
                    <option value="herbs">Essential Terpene Synthesis (EC 2.2, pH 6.0)</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl border space-y-1 font-mono text-[11px]" style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}>
                  <div className="flex justify-between">
                    <span className="opacity-70">Automated Pump Dispense:</span>
                    <span className="font-bold">45ml Stock A + 45ml Stock B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Recirculation Time:</span>
                    <span className="font-bold text-emerald-500">3.5 Minutes Total</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: "var(--template-primary)" }}
                >
                  Inject Nutrient Formula to Grow Bays
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

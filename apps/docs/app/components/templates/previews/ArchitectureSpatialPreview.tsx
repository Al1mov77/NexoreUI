"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Layers,
  Sun,
  Maximize2,
  Grid,
  CheckCircle2,
  X,
  FileText,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function ArchitectureSpatialPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [sunHour, setSunHour] = useState(13); // 13:00 / 1 PM
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    walls: true,
    glazing: true,
    electrical: false,
    hvac: false,
    furniture: true,
  });
  const [selectedMaterial, setSelectedMaterial] = useState("terrazzo");
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [specToast, setSpecToast] = useState<string | null>(null);

  // Compute solar metrics from hour
  const solarAzimuth = Math.round(90 + (sunHour - 8) * 18);
  const solarLux = Math.round(Math.sin(((sunHour - 6) / 12) * Math.PI) * 65000);
  const thermalGain = (Math.sin(((sunHour - 6) / 12) * Math.PI) * 3.8).toFixed(1);

  const materials = [
    {
      id: "terrazzo",
      name: "Venetian Composite Terrazzo",
      finish: "Honed Matte R10",
      origin: "Carrara, Italy",
      carbon: "14.2 kg CO₂e/m²",
      recycled: "78% Recycled Aggregate",
      uValue: "0.22 W/m²K",
      desc: "Low-porosity composite cast with reclaimed Carrara marble chips and natural lime binder.",
    },
    {
      id: "yakisugi",
      name: "Charred Shou Sugi Ban Cedar",
      finish: "Deep Carbonized Gendai",
      origin: "Nagano, Japan",
      carbon: "-2.4 kg CO₂e/m² (Carbon Negative)",
      recycled: "100% FSC Forested",
      uValue: "0.14 W/m²K",
      desc: "Ancient fire-treated cryptomeria timber offering natural insect and fire resilience without synthetic sealers.",
    },
    {
      id: "oak",
      name: "Fluted Quarter-Sawn White Oak",
      finish: "Organic Raw Wax Oil",
      origin: "Bavaria, Germany",
      carbon: "8.6 kg CO₂e/m²",
      recycled: "PEFC Certified",
      uValue: "0.18 W/m²K",
      desc: "Acoustically tuned micro-fluted wall baffles providing NRC 0.85 reverberation absorption.",
    },
    {
      id: "bronze",
      name: "Patinated Architectural Bronze",
      finish: "Living Statuary Brown",
      origin: "Zurich, Switzerland",
      carbon: "22.0 kg CO₂e/m²",
      recycled: "94% Reclaimed Scrap",
      uValue: "N/A (Facade Louver)",
      desc: "Custom extruded exterior solar shading fins that naturally age with climate exposure.",
    },
  ];

  const toggleLayer = (layerKey: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const handleSpecDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSpecModalOpen(false);
    setSpecToast("BIM IFC structural schedule & CSI 3-Part spec downloaded.");
    setTimeout(() => setSpecToast(null), 4000);
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
              <TemplateLogo icon={config.logoIcon || "layers"} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm @sm:text-base tracking-tight"
                  style={{ fontFamily: "var(--template-heading-font)" }}
                >
                  {config.brandName || "Arcform Spatial"}
                </span>
                <span className="hidden @sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  LEED Platinum
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">Architectural Blueprint & Spatial Daylight Studio</p>
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
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              <span>Project: Pavilion Kanso</span>
              <span className="opacity-30">•</span>
              <span className="text-emerald-500">620 m² GIA</span>
            </div>

            <button
              onClick={() => setIsSpecModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Export CSI Specs</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {specToast && (
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
            <span>{specToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @lg:py-8 space-y-6">
        {/* Project Overview Ribbon */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                  RESIDENTIAL RESIDENCE
                </span>
                <span className="opacity-70">Kyoto Foothills, Japan</span>
                <span className="opacity-40">•</span>
                <span className="opacity-70">Completed 2026</span>
              </div>
              <h1 className="text-xl @sm:text-3xl font-extrabold tracking-tight mb-2">
                Pavilion Kanso: Biophilic Courtyard Residence
              </h1>
              <p className="text-xs @sm:text-sm opacity-70 max-w-2xl">
                A single-level cantilevered timber and rammed-earth residence integrated with native Japanese black pines, passive solar ventilation, and central reflection pond.
              </p>
            </div>

            <div className="grid grid-cols-2 @sm:grid-cols-4 gap-3 text-center shrink-0">
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-xs opacity-60">Gross Area</div>
                <div className="text-lg font-extrabold font-mono">620 m²</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-xs opacity-60">Ceiling Height</div>
                <div className="text-lg font-extrabold font-mono text-emerald-500">3.80 m</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-xs opacity-60">Glazed Ratio</div>
                <div className="text-lg font-extrabold font-mono">48% Low-E</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-xs opacity-60">EUI Rating</div>
                <div className="text-lg font-extrabold font-mono text-amber-500">18 kWh/m²</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive Blueprint Floorplan Viewer with Layer Toggles */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold tracking-tight">Interactive Architectural CAD Floorplan</h2>
              <p className="text-xs opacity-65">Toggle technical BIM layers to inspect structural, MEP, and millwork overlays</p>
            </div>

            {/* Layer Toggles */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                { key: "walls", label: "Structural Walls" },
                { key: "glazing", label: "Glazing & Low-E" },
                { key: "electrical", label: "Electrical / Data" },
                { key: "hvac", label: "Passive HVAC" },
                { key: "furniture", label: "Millwork" },
              ].map((layer) => {
                const active = activeLayers[layer.key];
                return (
                  <button
                    key={layer.key}
                    onClick={() => toggleLayer(layer.key)}
                    className={`px-2.5 py-1 rounded-lg border transition-all ${
                      active ? "bg-indigo-600 text-white font-semibold" : "opacity-60 hover:opacity-100"
                    }`}
                    style={{ borderColor: active ? undefined : "var(--template-border)" }}
                  >
                    {layer.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blueprint SVG Canvas */}
          <div
            className="p-6 rounded-xl border relative min-h-[300px] flex items-center justify-center font-mono overflow-x-auto"
            style={{
              backgroundColor: isDark ? "#060913" : "#f1f5f9",
              borderColor: "var(--template-border)",
            }}
          >
            {/* Grid coordinate overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-2xl min-w-[500px] h-64 border-2 border-dashed rounded-xl p-4 flex flex-col justify-between" style={{ borderColor: isDark ? "#38bdf844" : "#0284c744" }}>
              {/* Outer walls */}
              <div className="flex justify-between text-[10px] opacity-50">
                <span>[GRID 1A]</span>
                <span>NORTH ELEVATION: 28.40m</span>
                <span>[GRID 4A]</span>
              </div>

              {/* Rooms layout */}
              <div className="grid grid-cols-3 gap-3 h-40">
                {/* Master Pavilion */}
                <div className={`p-3 rounded border flex flex-col justify-between transition-opacity ${activeLayers.walls ? "border-sky-400 bg-sky-500/5" : "border-transparent"}`}>
                  <span className="text-[11px] font-bold">01 • Master Pavilion</span>
                  <div className="text-[10px] opacity-70">
                    {activeLayers.furniture && "Tatami Mat Plinth"}
                    {activeLayers.hvac && " • Underfloor Radiant Hydronic"}
                  </div>
                  <span className="text-[10px] text-sky-400">74 m² • Honed Oak</span>
                </div>

                {/* Central Reflection Courtyard */}
                <div className="p-3 rounded border-2 border-indigo-500/30 bg-indigo-500/10 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold text-indigo-400">Inner Atrium Courtyard</span>
                  <span className="text-[10px] opacity-70 mt-1">Reflecting Basin & Moss Garden</span>
                  {activeLayers.glazing && <span className="text-[9px] text-emerald-500 mt-1">Triple Low-E Cavity</span>}
                </div>

                {/* Tea Pavilion & Living */}
                <div className={`p-3 rounded border flex flex-col justify-between transition-opacity ${activeLayers.walls ? "border-sky-400 bg-sky-500/5" : "border-transparent"}`}>
                  <span className="text-[11px] font-bold">02 • Sunken Tea Room</span>
                  <div className="text-[10px] opacity-70">
                    {activeLayers.electrical && "Dali Smart Dimming Circuits"}
                  </div>
                  <span className="text-[10px] text-sky-400">92 m² • Terrazzo Slab</span>
                </div>
              </div>

              <div className="flex justify-between text-[10px] opacity-50">
                <span>DATUM LEVEL: ±0.000</span>
                <span>SCALE: 1:100 @ A1</span>
                <span>CROSS SECTION B-B</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 & 3: Daylight Sun Angle Slider & Material Spec Sheet */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* Daylight Sun Angle Azimuth Simulator */}
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
                  <Sun className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold tracking-tight">Solar Daylight Azimuth</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 font-mono">
                  {sunHour}:00 JST
                </span>
              </div>

              {/* Sun Angle Display */}
              <div className="p-4 rounded-xl border text-center mb-6 font-mono" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-3xl font-extrabold text-amber-400">
                  {solarAzimuth}° <span className="text-xs font-normal opacity-70 font-sans">Azimuth Angle</span>
                </div>
                <div className="text-xs opacity-60 mt-1">
                  Solar Illuminance: {solarLux.toLocaleString()} Lux
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2 mb-6 text-xs font-mono">
                <div className="flex justify-between opacity-70">
                  <span>08:00 Morning</span>
                  <span>18:00 Dusk</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="18"
                  value={sunHour}
                  onChange={(e) => setSunHour(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: "var(--template-border)" }}>
                  <span className="opacity-70">Direct Solar Thermal Gain</span>
                  <span className="font-mono text-emerald-500 font-bold">{thermalGain} kW/h</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg border" style={{ borderColor: "var(--template-border)" }}>
                  <span className="opacity-70">Overhang Shadow Depth</span>
                  <span className="font-mono font-bold">1.45 m (100% Glare cut)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t text-[11px] opacity-70" style={{ borderColor: "var(--template-border)" }}>
              Passive cooling verified with CFD airflow simulation.
            </div>
          </div>

          {/* Sustainable Material Specification Drawer */}
          <div
            className="@lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold tracking-tight">Tactile Material Finishes Palette</h3>
                  <p className="text-xs opacity-65">Embodied carbon emissions & sustainable circularity ratings</p>
                </div>
                <span className="text-xs font-mono opacity-70">Cradle to Cradle Certified</span>
              </div>

              <div className="grid grid-cols-1 @sm:grid-cols-2 gap-3 mb-4">
                {materials.map((mat) => {
                  const isSelected = selectedMaterial === mat.id;
                  return (
                    <div
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected ? "ring-2 ring-indigo-500 shadow-sm" : "hover:border-indigo-500/40"
                      }`}
                      style={{
                        backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                        borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold">{mat.name}</h4>
                        <span className="text-[10px] font-mono text-emerald-500 font-bold">{mat.carbon}</span>
                      </div>
                      <div className="text-[11px] opacity-70 mb-2">{mat.finish} • {mat.origin}</div>
                      <p className="text-[10px] opacity-60 leading-relaxed line-clamp-2">{mat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border flex items-center justify-between text-xs" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)", borderColor: "var(--template-border)" }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Selected Material: {materials.find((m) => m.id === selectedMaterial)?.name}</span>
              </div>
              <span className="font-mono text-[11px] opacity-70">U-Val: {materials.find((m) => m.id === selectedMaterial)?.uValue}</span>
            </div>
          </div>
        </div>
      </main>

      {/* CSI Spec Sheet Export Modal */}
      <AnimatePresence>
        {isSpecModalOpen && (
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
                onClick={() => setIsSpecModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Export Architectural Specification</h3>
              </div>

              <form onSubmit={handleSpecDownload} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Specification Standard</label>
                  <select
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                  >
                    <option value="csi">CSI MasterFormat 2026 (Divisions 03 - 12)</option>
                    <option value="ifc">buildingSMART openIFC 4.3 BIM Model</option>
                    <option value="leed">LEED v4.1 Materials & Resources Documentation</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl border space-y-1 font-mono text-[11px]" style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}>
                  <div className="flex justify-between">
                    <span className="opacity-70">Project File:</span>
                    <span className="font-bold">Pavilion_Kanso_Full_Spec.zip</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">File Size:</span>
                    <span className="font-bold">42.8 MB (with CAD vector layers)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: "var(--template-primary)" }}
                >
                  Download Complete Architectural Package
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

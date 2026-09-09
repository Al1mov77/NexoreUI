"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Truck,
  Anchor,
  Compass,
  Thermometer,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  X,
  Plus,
  Navigation,
  ExternalLink,
  Layers,
  Container,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function GlobalLogisticsPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [activeStage, setActiveStage] = useState(2); // In transit (Malacca)
  const [searchBol, setSearchBol] = useState("BOL-849204-HKG");
  const [selectedVessel, setSelectedVessel] = useState(0);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  const stages = [
    { id: 0, label: "Origin Berth", location: "Shenzhen Yantian", date: "Sep 01, 08:30 UTC", status: "Completed", note: "Loaded 420 TEU onto Bay 12." },
    { id: 1, label: "Ocean Transit", location: "Strait of Malacca", date: "Sep 05, 14:10 UTC", status: "Completed", note: "Cruising 16.4 knots. Calm seas." },
    { id: 2, label: "Chokepoint Crossing", location: "Bab-el-Mandeb Strait", date: "Sep 10, 04:00 UTC", status: "Active Stage", note: "Navigating escorted transit corridor." },
    { id: 3, label: "Destination Port", location: "Rotterdam Gateway", date: "Sep 18, 11:00 UTC (ETA)", status: "Scheduled", note: "Automated crane berth reserved." },
    { id: 4, label: "Intermodal Rail", location: "Duisburg Terminal", date: "Sep 20, 16:30 UTC (ETA)", status: "Scheduled", note: "Direct electric freight rail link." },
  ];

  const reeferContainers = [
    { id: "MSKU-94812-4", temp: "-20.4°C", setPoint: "-20.0°C", humidity: "88%", seal: "Cryptographic Intact", cargo: "Vaccines & Pharmaceuticals", status: "Optimal" },
    { id: "CMAU-20914-8", temp: "+2.8°C", setPoint: "+3.0°C", humidity: "92%", seal: "Cryptographic Intact", cargo: "Organic Hass Avocados", status: "Optimal" },
    { id: "HLCU-51820-1", temp: "-18.2°C", setPoint: "-18.0°C", humidity: "85%", seal: "Cryptographic Intact", cargo: "Deep-Sea Frozen Tuna", status: "Optimal" },
  ];

  const vessels = [
    { name: "MV Vanguard Titan", imo: "IMO 982341", speed: "16.8 kts", draught: "14.2m", teus: "18,400 TEU", pos: "12°42'N 43°18'E", eta: "Sep 18" },
    { name: "MV Pacific Horizon", imo: "IMO 940192", speed: "15.2 kts", draught: "12.8m", teus: "14,200 TEU", pos: "04°12'N 100°22'E", eta: "Sep 24" },
    { name: "MV Atlantic Vanguard", imo: "IMO 978120", speed: "17.4 kts", draught: "15.0m", teus: "21,000 TEU", pos: "36°14'N 05°21'W", eta: "Sep 14" },
  ];

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatchModalOpen(false);
    setDispatchToast("Intermodal priority manifest updated! Customs pre-clearance transmitted.");
    setTimeout(() => setDispatchToast(null), 4000);
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
              <TemplateLogo icon={config.logoIcon || "anchor"} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm @sm:text-base tracking-tight"
                  style={{ fontFamily: "var(--template-heading-font)" }}
                >
                  {config.brandName || "Vanguard Logistics"}
                </span>
                <span className="hidden @sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Global Fleet Telemetry
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">Intermodal Container Freight & Cold-Chain Tracking</p>
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
              <Ship className="w-3.5 h-3.5 text-indigo-400" />
              <span>Active Fleet: 14 Vessels</span>
              <span className="opacity-30">•</span>
              <span className="text-emerald-500">99.4% On Schedule</span>
            </div>

            <button
              onClick={() => setIsDispatchModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Intermodal Dispatch</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {dispatchToast && (
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
            <span>{dispatchToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @lg:py-8 space-y-6">
        {/* Active BOL Consignment Tracker Bar */}
        <div
          className="p-5 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex flex-col @md:flex-row @md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono opacity-60">MASTER BILL OF LADING</span>
                <h2 className="text-base font-extrabold font-mono tracking-tight">{searchBol}</h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="px-3 py-1.5 rounded-xl border font-mono" style={{ borderColor: "var(--template-border)" }}>
                <span className="opacity-50">Origin: </span>
                <span className="font-bold">SZX (China)</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl border font-mono" style={{ borderColor: "var(--template-border)" }}>
                <span className="opacity-50">Destination: </span>
                <span className="font-bold">RTM (Netherlands)</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl border font-mono text-emerald-500 font-bold" style={{ borderColor: "var(--template-border)" }}>
                ETA: Sep 18, 2026
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive Multi-Stage Stepper */}
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
              <h3 className="text-base font-bold tracking-tight">Intermodal Shipment Route Stages</h3>
              <p className="text-xs opacity-65">Click any stage milestone to inspect checkpoint audit & customs release timestamps</p>
            </div>
            <span className="text-xs font-mono opacity-70">Stage 3 of 5 In Transit</span>
          </div>

          <div className="grid grid-cols-1 @sm:grid-cols-5 gap-3 pt-2">
            {stages.map((stg) => {
              const isSelected = activeStage === stg.id;
              const isDone = stg.id < activeStage;
              const isCurrent = stg.id === activeStage;

              return (
                <div
                  key={stg.id}
                  onClick={() => setActiveStage(stg.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:border-indigo-500/40"
                  }`}
                  style={{
                    backgroundColor: isSelected ? (isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)") : (isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)"),
                    borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-indigo-600 text-white"
                          : "bg-zinc-200 dark:bg-zinc-800 opacity-60"
                      }`}
                    >
                      {isDone ? "✓" : stg.id + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isDone
                          ? "text-emerald-500 bg-emerald-500/10"
                          : isCurrent
                          ? "text-indigo-400 bg-indigo-500/10"
                          : "opacity-50"
                      }`}
                    >
                      {stg.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold truncate">{stg.label}</h4>
                  <p className="text-[11px] opacity-70 truncate">{stg.location}</p>
                  <p className="text-[10px] font-mono opacity-50 mt-1">{stg.date}</p>
                </div>
              );
            })}
          </div>

          {/* Stage Note Banner */}
          <div className="p-3.5 rounded-xl border mt-4 text-xs flex items-center gap-3" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)", borderColor: "var(--template-border)" }}>
            <Anchor className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="font-bold mr-2">{stages[activeStage].location}:</span>
              <span className="opacity-80">{stages[activeStage].note}</span>
            </div>
          </div>
        </div>

        {/* Section 2 & 3: Reefer IoT Cold Chain & Vessel Fleet */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* Reefer Cold-Chain Telemetry */}
          <div
            className="@lg:col-span-2 p-6 rounded-2xl border"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold tracking-tight">Refrigerated Reefer IoT Telemetry</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Continuous Telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 @sm:grid-cols-3 gap-4">
              {reeferContainers.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold">{c.id}</span>
                      <span className="text-[10px] font-bold text-emerald-500">{c.status}</span>
                    </div>

                    <div className="p-3 rounded-lg border text-center mb-3" style={{ borderColor: "var(--template-border)" }}>
                      <div className="text-2xl font-extrabold font-mono text-cyan-400">{c.temp}</div>
                      <div className="text-[10px] opacity-60 mt-0.5">Target: {c.setPoint}</div>
                    </div>

                    <p className="text-[11px] font-semibold opacity-90 mb-1">{c.cargo}</p>
                    <div className="text-[10px] opacity-65 space-y-0.5">
                      <div>Relative Humidity: {c.humidity}</div>
                      <div>Door Seal: {c.seal}</div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t text-[10px] text-emerald-500 font-semibold flex items-center gap-1" style={{ borderColor: "var(--template-border)" }}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cold Chain Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Vessels Fleet */}
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
                  <Ship className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Carrier Vessels</h3>
                </div>
                <span className="text-xs font-mono opacity-70">Live AIS Feed</span>
              </div>

              <div className="space-y-3">
                {vessels.map((v, idx) => {
                  const isSelected = selectedVessel === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedVessel(idx)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected ? "border-indigo-500 bg-indigo-500/10" : "hover:border-indigo-500/30"
                      }`}
                      style={{ borderColor: isSelected ? undefined : "var(--template-border)" }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{v.name}</span>
                        <span className="text-[10px] font-mono text-emerald-500 font-semibold">{v.speed}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] opacity-70 font-mono">
                        <span>{v.teus}</span>
                        <span>ETA {v.eta}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t text-[11px] opacity-70 flex items-center justify-between" style={{ borderColor: "var(--template-border)" }}>
              <span>Draught: {vessels[selectedVessel].draught}</span>
              <span>Pos: {vessels[selectedVessel].pos}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Customs Documentation Matrix */}
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
              <h3 className="text-base font-bold tracking-tight">Border Customs & Single Window Compliance</h3>
              <p className="text-xs opacity-65">Cryptographically signed manifest documents cleared with EU Customs Authority</p>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-bold">Port Health Clearance: Approved</span>
          </div>

          <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">Bill of Lading</span>
                <span className="text-emerald-500">CLEARED</span>
              </div>
              <p className="text-[10px] opacity-60 font-sans">Endorsed to Dutch consignee</p>
            </div>

            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">Commercial Invoice</span>
                <span className="text-emerald-500">CLEARED</span>
              </div>
              <p className="text-[10px] opacity-60 font-sans">VAT & Import duty prepaid</p>
            </div>

            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">Phytosanitary Cert</span>
                <span className="text-emerald-500">CLEARED</span>
              </div>
              <p className="text-[10px] opacity-60 font-sans">No quarantine pests detected</p>
            </div>

            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">T1 Transit Bond</span>
                <span className="text-amber-500">ISSUED</span>
              </div>
              <p className="text-[10px] opacity-60 font-sans">In-bond rail transit authorized</p>
            </div>
          </div>
        </div>
      </main>

      {/* Intermodal Dispatch Modal */}
      <AnimatePresence>
        {isDispatchModalOpen && (
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
                onClick={() => setIsDispatchModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Intermodal Dispatch Reroute</h3>
              </div>

              <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Final Mile Transport Mode</label>
                  <select
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                  >
                    <option value="rail">Electrified Freight Rail (Duisburg Hub) - Low Carbon</option>
                    <option value="truck">Dedicated Express Reefer Truck - Priority 24h</option>
                    <option value="barge">Rhine River Inland Container Barge - Bulk Eco</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl border space-y-1 font-mono text-[11px]" style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}>
                  <div className="flex justify-between">
                    <span className="opacity-70">Estimated Transit:</span>
                    <span className="font-bold">14 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">CO2 Emissions:</span>
                    <span className="text-emerald-500 font-bold">-72% vs Standard Road Freight</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: "var(--template-primary)" }}
                >
                  Authorize Priority Dispatch Order
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

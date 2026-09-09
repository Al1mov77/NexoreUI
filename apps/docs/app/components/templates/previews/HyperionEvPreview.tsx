"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  BatteryCharging,
  Zap,
  Gauge,
  Sliders,
  CheckCircle2,
  X,
  Sparkles,
  Shield,
  Activity,
  Navigation,
  Thermometer,
  Clock,
  ChevronRight,
  TrendingUp,
  Cpu,
  Power,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function HyperionEvPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  const [payloadKg, setPayloadKg] = useState(1200);
  const [ambientTempC, setAmbientTempC] = useState(20);
  const [isChargingModalOpen, setIsChargingModalOpen] = useState(false);
  const [activeChargingBays, setActiveChargingBays] = useState<number[]>([1, 2]);
  const [fleetToast, setFleetToast] = useState<string | null>(null);

  const vehicles = [
    {
      vin: "HYP-EV-8041",
      model: "Hyperion Freight Hauler Max",
      plate: "CA-941-EV",
      soc: 74,
      rangeKm: 420,
      baseMaxRange: 550,
      batteryHealth: "98.2% SoH",
      consumption: "88 kWh/100km",
      tpmsPsi: [110, 110, 108, 109],
      status: "DEPOT_IDLE",
      driver: "Marcus Vance",
      currentBay: "Bay 01 (Plugged)",
    },
    {
      vin: "HYP-EV-8042",
      model: "Veloce Urban Delivery Van",
      plate: "CA-228-EV",
      soc: 38,
      rangeKm: 165,
      baseMaxRange: 380,
      batteryHealth: "97.4% SoH",
      consumption: "32 kWh/100km",
      tpmsPsi: [45, 45, 44, 45],
      status: "FAST_CHARGING",
      driver: "Elena Rostova",
      currentBay: "Bay 02 (350kW CCS)",
    },
    {
      vin: "HYP-EV-8043",
      model: "AeroPulse Autonomous Shuttle",
      plate: "CA-770-EV",
      soc: 91,
      rangeKm: 480,
      baseMaxRange: 520,
      batteryHealth: "99.1% SoH",
      consumption: "28 kWh/100km",
      tpmsPsi: [42, 42, 42, 41],
      status: "ROUTE_ACTIVE",
      driver: "AI Autopilot L4",
      currentBay: "En Route Metro Loop",
    },
  ];

  const currentVehicle = vehicles[selectedVehicleIndex];

  // Estimated range computation based on payload and ambient temperature
  const estimatedRange = Math.round(
    currentVehicle.baseMaxRange *
      (currentVehicle.soc / 100) *
      (1 - payloadKg / 10000) *
      (ambientTempC < 0 ? 0.8 : ambientTempC > 35 ? 0.88 : 1.0)
  );

  const handleToggleChargeBay = (bayNumber: number) => {
    if (activeChargingBays.includes(bayNumber)) {
      setActiveChargingBays(activeChargingBays.filter((b) => b !== bayNumber));
      setFleetToast(`Depot Bay 0${bayNumber}: Charging session stopped & disengaged.`);
    } else {
      setActiveChargingBays([...activeChargingBays, bayNumber]);
      setFleetToast(`Depot Bay 0${bayNumber}: 350kW DC Fast Charge session started!`);
    }
    setTimeout(() => setFleetToast(null), 3500);
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
          backgroundColor: isDark ? "rgba(8, 12, 18, 0.88)" : "rgba(255, 255, 255, 0.92)",
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
              <TemplateLogo icon={config.logoIcon || "cpu"} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Hyperion Fleet EV</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(14, 165, 233, 0.12)",
                    color: "var(--template-primary)",
                  }}
                >
                  Automotive
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">
                Commercial EV Battery Telemetry & 350kW Depot Charging Station
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden @sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              <span>Depot Grid: 480 kW Peak</span>
            </div>

            <button
              onClick={() => setIsChargingModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--template-primary)" }}
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>Charger Matrix</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {fleetToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(6, 182, 212, 0.12)" : "#ecfeff",
                borderColor: "rgba(6, 182, 212, 0.3)",
                color: "#0891b2",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                <span>{fleetToast}</span>
              </div>
              <button onClick={() => setFleetToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vehicle Selection Cards */}
        <div className="grid grid-cols-1 @md:grid-cols-3 gap-3">
          {vehicles.map((veh, idx) => {
            const isSelected = selectedVehicleIndex === idx;
            return (
              <button
                key={veh.vin}
                onClick={() => setSelectedVehicleIndex(idx)}
                className="p-4 rounded-2xl border text-left transition-all relative overflow-hidden"
                style={{
                  backgroundColor: isSelected ? "var(--template-surface)" : "transparent",
                  borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: "var(--template-primary)" }}
                  />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-bold opacity-60">{veh.plate}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      veh.status === "FAST_CHARGING"
                        ? "bg-cyan-500/15 text-cyan-500 border border-cyan-500/20"
                        : veh.status === "ROUTE_ACTIVE"
                        ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                        : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20"
                    }`}
                  >
                    {veh.status}
                  </span>
                </div>
                <div className="text-sm font-bold tracking-tight">{veh.model}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t text-xs" style={{ borderColor: "var(--template-border)" }}>
                  <div className="flex items-center gap-1.5 font-bold">
                    <BatteryCharging className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{veh.soc}% SoC</span>
                  </div>
                  <span className="opacity-60">{veh.rangeKm} km est.</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Vehicle Instrument Deck & Range Estimator */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6">
          {/* Main Battery State of Charge & Telemetry (7 cols) */}
          <div className="@lg:col-span-7 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-6"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div>
                  <span className="text-xs font-mono opacity-60">BATTERY MANAGEMENT SYSTEM (BMS)</span>
                  <h3 className="text-base font-bold tracking-tight">{currentVehicle.model}</h3>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-500">{currentVehicle.batteryHealth}</span>
              </div>

              {/* Large SoC Gauge Display */}
              <div
                className="p-5 rounded-xl border flex flex-col @sm:flex-row items-center justify-between gap-4"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                  borderColor: "var(--template-border)",
                }}
              >
                <div className="space-y-1 text-center @sm:text-left">
                  <div className="text-xs font-semibold opacity-60">CURRENT STATE OF CHARGE</div>
                  <div className="text-4xl font-black text-cyan-500 font-mono">{currentVehicle.soc}%</div>
                  <div className="text-xs opacity-75">Pack Voltage: 780V Architecture</div>
                </div>

                <div className="w-full @sm:w-64 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="opacity-60">Usable Capacity</span>
                    <span className="font-bold">210 kWh / 280 kWh</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                      style={{ width: `${currentVehicle.soc}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] opacity-50 font-mono">
                    <span>0% (Empty)</span>
                    <span>80% (DC Fast Cap)</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* TPMS Tire Pressure Matrix */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 block mb-2">
                  Tire Pressure Monitoring (TPMS)
                </span>
                <div className="grid grid-cols-2 @sm:grid-cols-4 gap-2 text-center text-xs">
                  {currentVehicle.tpmsPsi.map((psi, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border"
                      style={{ borderColor: "var(--template-border)" }}
                    >
                      <div className="text-[10px] opacity-50 uppercase">
                        {idx === 0 ? "Front L" : idx === 1 ? "Front R" : idx === 2 ? "Rear L" : "Rear R"}
                      </div>
                      <div className="font-mono font-bold text-sm text-emerald-500 mt-0.5">{psi} PSI</div>
                      <div className="text-[9px] opacity-50">Nominal 45°C</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver & Assignment */}
              <div className="p-3.5 rounded-xl border flex items-center justify-between text-xs" style={{ borderColor: "var(--template-border)" }}>
                <div>
                  <div className="font-bold">Assigned Operator: {currentVehicle.driver}</div>
                  <div className="text-[11px] opacity-60">Status: {currentVehicle.currentBay}</div>
                </div>
                <span className="font-mono font-bold opacity-75">{currentVehicle.consumption}</span>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Route Range Estimator (5 cols) */}
          <div className="@lg:col-span-5 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-5"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Payload & Weather Range Engine
                </span>
                <Navigation className="w-4 h-4 text-cyan-500" />
              </div>

              {/* Calculated Range Pill */}
              <div
                className="p-4 rounded-xl border text-center space-y-1"
                style={{
                  backgroundColor: isDark ? "rgba(6, 182, 212, 0.08)" : "#ecfeff",
                  borderColor: "rgba(6, 182, 212, 0.25)",
                }}
              >
                <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                  DYNAMIC ESTIMATED DRIVING RANGE
                </div>
                <div className="text-3xl font-black text-cyan-500 font-mono">{estimatedRange} km</div>
                <div className="text-[10px] opacity-60">Safe return margin: +45 km reserved</div>
              </div>

              {/* Payload Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">Cargo Payload Weight</span>
                  <span className="font-mono font-bold">{payloadKg} kg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4000"
                  step="100"
                  value={payloadKg}
                  onChange={(e) => setPayloadKg(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">Ambient Temperature</span>
                  <span className="font-mono font-bold">{ambientTempC}°C</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="45"
                  step="1"
                  value={ambientTempC}
                  onChange={(e) => setAmbientTempC(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="text-[10px] opacity-50">
                  Extreme cold or heat automatically recalculates battery pack thermal regulation draw.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Charging Bay Matrix Modal */}
      <AnimatePresence>
        {isChargingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#090d14" : "#ffffff",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-500" />
                  <h3 className="text-sm font-bold">Depot 350kW DC Fast Charger Bays</h3>
                </div>
                <button onClick={() => setIsChargingModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {[1, 2, 3, 4].map((bay) => {
                  const isActive = activeChargingBays.includes(bay);
                  return (
                    <div
                      key={bay}
                      className="p-3 rounded-xl border flex items-center justify-between"
                      style={{
                        backgroundColor: "var(--template-surface)",
                        borderColor: "var(--template-border)",
                      }}
                    >
                      <div>
                        <div className="text-xs font-bold">Bay 0{bay} • CCS 350kW Liquid-Cooled</div>
                        <div className="text-[10px] opacity-60">
                          {isActive ? "Delivering 280 kW • 680V DC" : "Standby • Ready for connection"}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleChargeBay(bay)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          isActive ? "bg-rose-500/20 text-rose-500" : "bg-cyan-500 text-white"
                        }`}
                      >
                        {isActive ? "Stop" : "Engage"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsChargingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

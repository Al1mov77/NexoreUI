"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Mountain,
  MapPin,
  Wind,
  Droplets,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Scale,
  Radio,
  Tent,
  CheckCircle2,
  X,
  Sparkles,
  AlertTriangle,
  Sun,
  CloudSnow,
  CloudRain,
  Navigation,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function WildernessTravelPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [selectedWaypoint, setSelectedWaypoint] = useState(1);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [baseWeight, setBaseWeight] = useState(6.2); // kg
  const [foodDays, setFoodDays] = useState(6);
  const [waterLiters, setWaterLiters] = useState(2.0);
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
  const [trekkersCount, setTrekkersCount] = useState(2);
  const [selectedHut, setSelectedHut] = useState("refugio-viedma");
  const [rentCrampons, setRentCrampons] = useState(true);
  const [rentBeacon, setRentBeacon] = useState(false);
  const [permitToast, setPermitToast] = useState<string | null>(null);

  // Compute pack weight
  const consumablesWeight = (foodDays * 0.75 + waterLiters).toFixed(1);
  const totalPackWeight = (baseWeight + parseFloat(consumablesWeight)).toFixed(1);

  const waypoints = [
    {
      id: 0,
      name: "El Chaltén Trailhead",
      elev: "410m",
      dist: "0.0 km",
      status: "Check-in Station",
      water: "Abundant",
      wind: "15 km/h",
      exposure: "Low",
    },
    {
      id: 1,
      name: "Paso del Viento (Pass of Winds)",
      elev: "1,420m",
      dist: "34.2 km",
      status: "Glacier Crossing",
      water: "Glacial stream (filter req.)",
      wind: "75 km/h Gusts",
      exposure: "Extreme High",
    },
    {
      id: 2,
      name: "Refugio Glaciar Viedma",
      elev: "680m",
      dist: "68.5 km",
      status: "High Mountain Hut",
      water: "Gravity Spring",
      wind: "30 km/h",
      exposure: "Moderate",
    },
    {
      id: 3,
      name: "Paso Huemul Ridge",
      elev: "980m",
      dist: "102.4 km",
      status: "Fixed Cable Traverse",
      water: "Seasonal snowmelt",
      wind: "60 km/h",
      exposure: "High",
    },
    {
      id: 4,
      name: "Bahía Túnel Lake Terminus",
      elev: "220m",
      dist: "148.0 km",
      status: "Ferry Dock Extraction",
      water: "Lakefront potable",
      wind: "20 km/h",
      exposure: "Low",
    },
  ];

  const itineraryDays = [
    {
      day: 1,
      title: "Valley Incline & Rio Fitz Roy Approach",
      dist: "16.4 km",
      gain: "+620m / -120m",
      time: "5.5 hrs",
      weather: "Partly Cloudy • 14°C",
      camp: "Campamento Poincenot (Forest Shelter)",
      notes: "Cross suspension bridge over glacial torrent. Good tree cover for high wind protection.",
    },
    {
      day: 2,
      title: "Moraine Ascent to Paso del Viento",
      dist: "18.2 km",
      gain: "+940m / -380m",
      time: "7.0 hrs",
      weather: "High Winds • 4°C",
      camp: "Campamento Paso del Viento (Rock Bivvy)",
      notes: "Tyrolean zip traverse across Rio Túnel required. Helmets & harness mandatory.",
    },
    {
      day: 3,
      title: "Patagonian Icecap Rim & Glaciar Viedma",
      dist: "14.5 km",
      gain: "+310m / -850m",
      time: "6.0 hrs",
      weather: "Snow Flurries • 1°C",
      camp: "Refugio Viedma Mountain Base",
      notes: "Spectacular panoramic vista over the Southern Patagonian Icefield. Crampons advised.",
    },
    {
      day: 4,
      title: "Southern Shoreline of Lago Viedma",
      dist: "21.0 km",
      gain: "+480m / -540m",
      time: "6.5 hrs",
      weather: "Sunny Intervals • 12°C",
      camp: "Campamento Bahia de los Témpanos",
      notes: "Follow natural iceberg washup zone. Ice blocks calving every 30-45 minutes.",
    },
  ];

  const handlePermitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPermitModalOpen(false);
    setPermitToast(`Wilderness Permit issued for ${trekkersCount} trekkers! Confirmation: #PAT-${Math.floor(10000 + Math.random() * 90000)}`);
    setTimeout(() => setPermitToast(null), 4000);
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
              <TemplateLogo icon={config.logoIcon || "compass"} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm @sm:text-base tracking-tight"
                  style={{ fontFamily: "var(--template-heading-font)" }}
                >
                  {config.brandName || "NomadRoute Expeditions"}
                </span>
                <span className="hidden @sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Patagonia Crossing
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">Wilderness Backcountry Topography & Permits</p>
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
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Iridium Satellite: Active</span>
              <span className="opacity-30">•</span>
              <span className="text-emerald-500">SOS Sync OK</span>
            </div>

            <button
              onClick={() => setIsPermitModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Tent className="h-3.5 w-3.5" />
              <span>Reserve Permits</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {permitToast && (
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
            <span>{permitToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @lg:py-8 space-y-6">
        {/* Expedition Hero Ribbon */}
        <div
          className="p-6 rounded-2xl border relative overflow-hidden"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Grade IV Wilderness
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono border" style={{ borderColor: "var(--template-border)" }}>
                  Los Glaciares National Park
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono border" style={{ borderColor: "var(--template-border)" }}>
                  Coordinates: 49°16'S 73°02'W
                </span>
              </div>
              <h1 className="text-xl @sm:text-3xl font-extrabold tracking-tight mb-2">
                The Southern Patagonian Icefield Circuit
              </h1>
              <p className="text-xs @sm:text-sm opacity-70 max-w-2xl">
                A non-technical alpine high traverse negotiating moraine boulder fields, tyrolean river cables, and high passes above the third-largest ice field on Earth.
              </p>
            </div>

            <div className="grid grid-cols-2 @sm:grid-cols-4 gap-3 text-center shrink-0">
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-xs opacity-60">Total Trek</div>
                <div className="text-lg font-extrabold font-mono">148 km</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-xs opacity-60">Total Gain</div>
                <div className="text-lg font-extrabold font-mono text-emerald-500">+6,850m</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-xs opacity-60">Duration</div>
                <div className="text-lg font-extrabold font-mono">8 Days</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-xs opacity-60">Max Elevation</div>
                <div className="text-lg font-extrabold font-mono text-amber-500">1,420m</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive Elevation & Waypoint Topography Profile */}
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
              <h2 className="text-base font-bold tracking-tight">Interactive Elevation Topography & Waypoints</h2>
              <p className="text-xs opacity-65">Click waypoint markers along the ridge profile to view live checkpoint telemetry</p>
            </div>
            <span className="text-xs font-mono opacity-70">Datum: WGS84 Elevation Profile</span>
          </div>

          {/* Graphical Elevation Chart Simulation */}
          <div className="relative pt-6 pb-2 px-2 border rounded-xl mb-6 overflow-x-auto" style={{ borderColor: "var(--template-border)", backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.6)" }}>
            <div className="min-w-[600px] h-40 flex items-end justify-between relative px-6">
              {/* SVG Mountain contour line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 600 160">
                <defs>
                  <linearGradient id="topoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--template-primary)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--template-primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 130 Q 80 120, 150 25 T 300 85 T 440 50 T 580 140 L 580 160 L 20 160 Z"
                  fill="url(#topoGradient)"
                />
                <path
                  d="M 20 130 Q 80 120, 150 25 T 300 85 T 440 50 T 580 140"
                  fill="none"
                  stroke="var(--template-primary)"
                  strokeWidth="3"
                />
              </svg>

              {/* Waypoint interactive markers */}
              {waypoints.map((wp) => {
                const isSelected = selectedWaypoint === wp.id;
                return (
                  <button
                    key={wp.id}
                    onClick={() => setSelectedWaypoint(wp.id)}
                    className="relative z-10 flex flex-col items-center group focus:outline-none transition-transform active:scale-95"
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-md transition-all ${
                        isSelected ? "scale-125 ring-4 ring-indigo-500/20 text-white" : "opacity-80 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: isSelected ? "var(--template-primary)" : "var(--template-surface)",
                        borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                      }}
                    >
                      {wp.id + 1}
                    </div>
                    <span className="text-[11px] font-semibold mt-1 max-w-[90px] text-center truncate">
                      {wp.name}
                    </span>
                    <span className="text-[10px] font-mono opacity-65">{wp.elev}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Waypoint Detail Card */}
          {waypoints[selectedWaypoint] && (
            <div
              className="p-4 rounded-xl border grid grid-cols-2 @sm:grid-cols-3 @lg:grid-cols-6 gap-3 text-xs"
              style={{
                backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
                borderColor: "var(--template-border)",
              }}
            >
              <div>
                <span className="opacity-60 block text-[10px]">Checkpoint</span>
                <span className="font-bold">{waypoints[selectedWaypoint].name}</span>
              </div>
              <div>
                <span className="opacity-60 block text-[10px]">Elevation</span>
                <span className="font-mono font-bold text-amber-500">{waypoints[selectedWaypoint].elev}</span>
              </div>
              <div>
                <span className="opacity-60 block text-[10px]">Route Distance</span>
                <span className="font-mono">{waypoints[selectedWaypoint].dist}</span>
              </div>
              <div>
                <span className="opacity-60 block text-[10px]">Terrain Class</span>
                <span className="font-semibold text-emerald-500">{waypoints[selectedWaypoint].status}</span>
              </div>
              <div>
                <span className="opacity-60 block text-[10px]">Water Refill</span>
                <span>{waypoints[selectedWaypoint].water}</span>
              </div>
              <div>
                <span className="opacity-60 block text-[10px]">Exposure / Wind</span>
                <span className="text-rose-500 font-semibold">{waypoints[selectedWaypoint].wind}</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2 & 3: Pack Weight Calculator & Day-by-Day Stages */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* Pack Weight Calculator */}
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
                  <Scale className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Pack Weight Distribution</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {parseFloat(totalPackWeight) < 12 ? "Ultralight" : "Expedition Load"}
                </span>
              </div>

              {/* Total Display */}
              <div className="p-4 rounded-xl border text-center mb-6" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div className="text-4xl font-extrabold font-mono tracking-tight" style={{ color: "var(--template-primary)" }}>
                  {totalPackWeight} <span className="text-sm font-normal opacity-70">KG</span>
                </div>
                <div className="text-xs opacity-60 mt-1">
                  Base Weight: {baseWeight}kg • Consumables: {consumablesWeight}kg
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="opacity-80">Base Gear (Shelter, Sleep, Cook)</span>
                    <span className="font-mono font-bold">{baseWeight.toFixed(1)} kg</span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="10.0"
                    step="0.2"
                    value={baseWeight}
                    onChange={(e) => setBaseWeight(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="opacity-80">Ration Days (0.75 kg/day)</span>
                    <span className="font-mono font-bold">{foodDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="1"
                    value={foodDays}
                    onChange={(e) => setFoodDays(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="opacity-80">Hydration Volume</span>
                    <span className="font-mono font-bold">{waterLiters.toFixed(1)} Liters</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="4.0"
                    step="0.5"
                    value={waterLiters}
                    onChange={(e) => setWaterLiters(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t text-[11px] opacity-70 flex items-center gap-2" style={{ borderColor: "var(--template-border)" }}>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Recommended skin-out pack weight &lt; 20% of trekker body mass.</span>
            </div>
          </div>

          {/* Day-by-Day Stages */}
          <div
            className="@lg:col-span-2 p-6 rounded-2xl border"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold tracking-tight">Expedition Stages Itinerary</h3>
                <p className="text-xs opacity-65">Tap any day stage to review terrain hazards & camp coordinates</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg border" style={{ borderColor: "var(--template-border)" }}>
                4 of 8 Days Detailed
              </span>
            </div>

            <div className="space-y-3">
              {itineraryDays.map((stage) => {
                const isExpanded = expandedDay === stage.day;
                return (
                  <div
                    key={stage.day}
                    className="rounded-xl border transition-all overflow-hidden"
                    style={{
                      backgroundColor: isExpanded ? (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)") : "transparent",
                      borderColor: isExpanded ? "var(--template-primary)" : "var(--template-border)",
                    }}
                  >
                    <button
                      onClick={() => setExpandedDay(isExpanded ? null : stage.day)}
                      className="w-full p-3.5 flex items-center justify-between text-left gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                          style={{
                            backgroundColor: isExpanded ? "var(--template-primary)" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"),
                            color: isExpanded ? "#ffffff" : "inherit",
                          }}
                        >
                          D{stage.day}
                        </span>
                        <div>
                          <h4 className="text-xs @sm:text-sm font-bold">{stage.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] opacity-65 mt-0.5">
                            <span>{stage.dist}</span>
                            <span>•</span>
                            <span>{stage.gain}</span>
                            <span>•</span>
                            <span className="font-mono">{stage.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden @sm:inline-block text-xs font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                          {stage.weather}
                        </span>
                        <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 pt-1 border-t text-xs space-y-2"
                          style={{ borderColor: "var(--template-border)" }}
                        >
                          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                            <Tent className="w-3.5 h-3.5" />
                            <span>Designated Bivvy: {stage.camp}</span>
                          </div>
                          <p className="opacity-75 leading-relaxed">{stage.notes}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 4: Satellite Telemetry & Emergency SOS Card */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm @sm:text-base font-bold">Garmin InReach Satellite Telemetry Active</h3>
                <p className="text-xs opacity-65">Automated 10-minute location beacon pings transmitted to Park Rangers</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="opacity-50 block text-[10px]">Battery Level</span>
                <span className="font-bold text-emerald-500">94% (6 Days left)</span>
              </div>
              <div>
                <span className="opacity-50 block text-[10px]">Emergency VHF</span>
                <span className="font-bold">147.525 MHz</span>
              </div>
              <div>
                <span className="opacity-50 block text-[10px]">Active Trackers</span>
                <span className="font-bold">4 Rangers online</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reservation & Permit Modal */}
      <AnimatePresence>
        {isPermitModalOpen && (
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
                onClick={() => setIsPermitModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Tent className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Reserve Wilderness Permits</h3>
              </div>

              <form onSubmit={handlePermitSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Designated Mountain Hut / Sector</label>
                  <select
                    value={selectedHut}
                    onChange={(e) => setSelectedHut(e.target.value)}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                  >
                    <option value="refugio-viedma">Refugio Glaciar Viedma (Sector B)</option>
                    <option value="camp-poincenot">Campamento Poincenot (Forest Pods)</option>
                    <option value="paso-huemul">Paso Huemul High Bivvy</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Party Size (Trekkers)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={trekkersCount}
                      onChange={(e) => setTrekkersCount(parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Start Date</label>
                    <input
                      type="date"
                      defaultValue="2026-11-15"
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t" style={{ borderColor: "var(--template-border)" }}>
                  <label className="block font-semibold opacity-80">Essential Technical Rentals</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rentCrampons}
                      onChange={(e) => setRentCrampons(e.target.checked)}
                      className="accent-indigo-500"
                    />
                    <span>Petzl Steel Crampons & Ice Axe Bundle ($18/day)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rentBeacon}
                      onChange={(e) => setRentBeacon(e.target.checked)}
                      className="accent-indigo-500"
                    />
                    <span>Garmin InReach Satellite SOS Transceiver ($24/day)</span>
                  </label>
                </div>

                <div className="p-3 rounded-xl border flex items-center justify-between font-mono" style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}>
                  <span className="opacity-70">Permit & Park Fee:</span>
                  <span className="font-bold text-sm text-emerald-500">${trekkersCount * 45 + (rentCrampons ? 36 : 0)} USD</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: "var(--template-primary)" }}
                >
                  Issue National Park Permit
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

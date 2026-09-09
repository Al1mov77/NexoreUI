"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  MapPin,
  Users,
  Compass,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Award,
  Sparkles,
  Layers,
  PhoneCall,
  X,
  Share2,
  Eye,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function RealEstatePreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [activeFloorLevel, setActiveFloorLevel] = useState<"level-1" | "level-2" | "terrace">("level-1");
  const [selectedHotspot, setSelectedHotspot] = useState<string>("suite");
  const [nights, setNights] = useState(4);
  const [guests, setGuests] = useState(4);
  const [includeChef, setIncludeChef] = useState(true);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveToast, setReserveToast] = useState(false);

  const baseRatePerNight = 2450;
  const chefServicePerNight = 650;
  const calculatedTotal =
    (baseRatePerNight + (includeChef ? chefServicePerNight : 0)) * nights + 450; // 450 cleaning & concierge

  const floorPlans = {
    "level-1": {
      name: "Level 1: Great Room & Culinary Pavilion",
      area: "4,200 sq.ft",
      hotspots: [
        { id: "suite", name: "Cantilevered Great Hall", desc: "Double-height 24ft glazing with direct mountain vistas and fireplace." },
        { id: "kitchen", name: "Chef's Kitchen & Cellar", desc: "Custom Boffi cabinetry, Gaggenau 400 series, 1,200 bottle tasting cellar." },
        { id: "pool", name: "Heated Black-Granite Pool", desc: "Zero-edge infinity pool extending 60 feet over the alpine canyon." },
      ],
    },
    "level-2": {
      name: "Level 2: Master Sanctuary & Wellness Spa",
      area: "3,400 sq.ft",
      hotspots: [
        { id: "master", name: "Primary Master Suite", desc: "Private wrap-around cedar deck, freestanding soaking tub, dual dressing rooms." },
        { id: "spa", name: "Finnish Sauna & Cold Plunge", desc: "Thermal hydrotherapy suite with mountain view sauna and steam grotto." },
      ],
    },
    terrace: {
      name: "Terrace: Stargazing Deck & Helipad",
      area: "1,800 sq.ft",
      hotspots: [
        { id: "deck", name: "Stargazing Fire Table", desc: "Custom basalt gas fire table with heated lounge seating." },
        { id: "helipad", name: "Private Aviation Helipad", desc: "FAA-certified private landing pad with lighted windsock and ground power." },
      ],
    },
  };

  const amenities = [
    { title: "Heated Black-Granite Infinity Pool", subtitle: "Year-round 104°F alpine soak with cantilevered canyon views" },
    { title: "Direct Ski-in / Ski-out Access", subtitle: "Private heated gear locker connected to Aspen Mountain trails" },
    { title: "Dedicated Private Sommelier & Chef", subtitle: "Personalized seasonal menus paired with rare vintage reserves" },
    { title: "FAA-Certified Private Helipad", subtitle: "Direct executive helicopter arrivals from Aspen (ASE) or Denver (DEN)" },
  ];

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReserveModalOpen(false);
    setReserveToast(true);
    setTimeout(() => setReserveToast(false), 3500);
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
      {/* Editorial Luxury Header */}
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
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "box"} className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-serif text-sm @sm:text-base tracking-widest uppercase font-light"
                style={{ fontFamily: "var(--template-heading-font)" }}
              >
                {config.brandName || "Haven Luxury Estates"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 @sm:gap-4">
            <span className="hidden @md:inline-block text-[11px] uppercase tracking-widest opacity-60 font-mono">
              Aspen • Kyoto • Amalfi • Zurich
            </span>

            <button
              onClick={() => setIsReserveModalOpen(true)}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              Inquire Residence
            </button>
          </div>
        </div>
      </header>

      {/* Property Hero Showcase */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-8 space-y-10">
        <div className="space-y-4">
          <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-2 border-b pb-4" style={{ borderColor: "var(--template-border)" }}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider uppercase opacity-60">Architectural Residence #04</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                Available for Season
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs opacity-75 font-mono">
              <MapPin className="h-3.5 w-3.5 text-stone-500" />
              <span>Red Mountain • Aspen Valley, Colorado</span>
            </div>
          </div>

          <h1
            className="text-3xl @sm:text-5xl @lg:text-6xl font-serif font-light tracking-tight leading-tight"
            style={{ fontFamily: "var(--template-heading-font)" }}
          >
            The Obsidian Pavilion
          </h1>

          <p className="text-sm @sm:text-base opacity-75 max-w-3xl leading-relaxed font-light">
            Designed by studio Olson Kundig. A 9,400 sq.ft private alpine sanctuary crafted from charred Japanese cedar, raw board-formed concrete, and floor-to-ceiling guillotine glass walls overlooking the Continental Divide.
          </p>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 @sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: "Interior Living Area", val: "9,400 sq.ft" },
              { label: "Bedrooms & Suites", val: "5 Master Suites" },
              { label: "Bathrooms", val: "6 Full, 2 Half" },
              { label: "Private Estate Grounds", val: "14.2 Secluded Acres" },
            ].map((spec) => (
              <div
                key={spec.label}
                className="p-3.5 rounded-xl border"
                style={{
                  backgroundColor: "var(--template-surface)",
                  borderColor: "var(--template-border)",
                  borderRadius: "var(--template-radius)",
                }}
              >
                <div className="text-[11px] opacity-60 uppercase tracking-wider">{spec.label}</div>
                <div className="text-sm @sm:text-base font-serif font-bold mt-0.5">{spec.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Layout: Blueprint Viewer (7 Cols) + Reservation Calculator (5 Cols) */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-8">
          {/* Architectural Floor Plan Viewer: 7 Cols */}
          <div className="@lg:col-span-7 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-4 shadow-sm"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base @sm:text-lg font-bold">Interactive Floor Plans</h2>
                  <p className="text-xs opacity-65">Explore blueprint levels and spatial room dimensions.</p>
                </div>

                {/* Level Switcher */}
                <div
                  className="inline-flex p-1 rounded-xl border text-xs"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  {(["level-1", "level-2", "terrace"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setActiveFloorLevel(lvl);
                        setSelectedHotspot(floorPlans[lvl].hotspots[0].id);
                      }}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        activeFloorLevel === lvl
                          ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-black font-bold shadow-sm"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      {lvl === "level-1" ? "Level 1" : lvl === "level-2" ? "Level 2" : "Terrace"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Architectural Blueprint SVG Schematic */}
              <div
                className="w-full h-64 rounded-xl border p-4 relative flex flex-col justify-between overflow-hidden"
                style={{
                  backgroundColor: isDark ? "#0d0f17" : "#f1f3f5",
                  borderColor: "var(--template-border)",
                }}
              >
                <div className="flex justify-between text-[11px] font-mono opacity-50">
                  <span>SCALE: 1/8" = 1'-0" • NORTH ↗</span>
                  <span>{floorPlans[activeFloorLevel].area}</span>
                </div>

                {/* Hotspot Room Selector Buttons inside Blueprint schematic */}
                <div className="grid grid-cols-1 @sm:grid-cols-3 gap-2 my-auto">
                  {floorPlans[activeFloorLevel].hotspots.map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedHotspot(spot.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        selectedHotspot === spot.id
                          ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/10 font-bold"
                          : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 bg-white/40 dark:bg-black/40"
                      }`}
                    >
                      <div className="font-semibold truncate">{spot.name}</div>
                      <div className="text-[10px] opacity-60 mt-0.5">Inspect Spec →</div>
                    </button>
                  ))}
                </div>

                <div className="text-[10px] font-mono opacity-40 text-right">
                  ARCHITECTURAL ELEVATION: 8,420 FT ASL
                </div>
              </div>

              {/* Hotspot Detail Callout */}
              {(() => {
                const currentSpot = floorPlans[activeFloorLevel].hotspots.find(
                  (s) => s.id === selectedHotspot
                ) || floorPlans[activeFloorLevel].hotspots[0];
                return (
                  <div
                    className="p-4 rounded-xl border space-y-1 text-xs"
                    style={{
                      backgroundColor: "var(--template-surface-elevated)",
                      borderColor: "var(--template-border)",
                    }}
                  >
                    <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>{currentSpot.name}</span>
                    </div>
                    <p className="opacity-80 leading-relaxed font-light">{currentSpot.desc}</p>
                  </div>
                );
              })()}
            </div>

            {/* Curated Luxury Amenities */}
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-4"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <h3 className="font-serif text-base font-bold">Estate Curations & Amenities</h3>
              <div className="grid grid-cols-1 @sm:grid-cols-2 gap-3 text-xs">
                {amenities.map((amenity) => (
                  <div
                    key={amenity.title}
                    className="p-3.5 rounded-xl border space-y-1"
                    style={{
                      backgroundColor: "var(--template-surface-elevated)",
                      borderColor: "var(--template-border)",
                    }}
                  >
                    <div className="font-bold">{amenity.title}</div>
                    <div className="text-[11px] opacity-70 font-light leading-relaxed">
                      {amenity.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stay Reservation Calculator: 5 Cols */}
          <div className="@lg:col-span-5 space-y-4">
            <div
              className="p-6 rounded-2xl border space-y-6 shadow-md"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="border-b pb-4">
                <div className="text-2xl @sm:text-3xl font-serif font-bold">
                  ${baseRatePerNight.toLocaleString()}{" "}
                  <span className="text-xs font-sans font-normal opacity-60">/ night</span>
                </div>
                <p className="text-xs opacity-65 mt-1 font-mono">Minimum 3 nights stay required</p>
              </div>

              {/* Calculator Inputs */}
              <div className="space-y-4 text-xs">
                {/* Nights slider */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Stay Duration</span>
                    <span className="font-mono text-sm">{nights} Nights</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="14"
                    value={nights}
                    onChange={(e) => setNights(parseInt(e.target.value))}
                    className="w-full accent-stone-800 dark:accent-stone-200"
                  />
                  <div className="flex justify-between text-[10px] font-mono opacity-50">
                    <span>3 nights</span>
                    <span>7 nights</span>
                    <span>14 nights</span>
                  </div>
                </div>

                {/* Guests counter */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Accommodating Guests</span>
                    <span className="font-mono text-sm">{guests} Guests</span>
                  </div>
                  <div className="flex items-center justify-between border rounded-xl p-2" style={{ borderColor: "var(--template-border)" }}>
                    <span className="opacity-75">Max 10 guests across 5 suites</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-sm"
                        style={{ borderColor: "var(--template-border)" }}
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-mono font-bold">{guests}</span>
                      <button
                        onClick={() => setGuests(Math.min(10, guests + 1))}
                        className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-sm"
                        style={{ borderColor: "var(--template-border)" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add-on: Dedicated Private Chef */}
                <label
                  className="p-3.5 rounded-xl border flex items-center justify-between cursor-pointer"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div>
                    <div className="font-bold">Private Michelin Chef Service</div>
                    <div className="text-[11px] opacity-65 font-light">Breakfast & 5-course dinner (+$650/night)</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeChef}
                    onChange={(e) => setIncludeChef(e.target.checked)}
                    className="w-4 h-4 rounded accent-stone-800"
                  />
                </label>

                {/* Cost Breakdown Ledger */}
                <div
                  className="p-4 rounded-xl border space-y-2 text-xs font-mono"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div className="flex justify-between">
                    <span>Residence ({nights} nights)</span>
                    <span>${(baseRatePerNight * nights).toLocaleString()}</span>
                  </div>
                  {includeChef && (
                    <div className="flex justify-between">
                      <span>Chef Service ({nights} nights)</span>
                      <span>${(chefServicePerNight * nights).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Valet & Alpine Concierge</span>
                    <span>$450</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-sm font-sans" style={{ borderColor: "var(--template-border)" }}>
                    <span>Estimated Total Stay</span>
                    <span>${calculatedTotal.toLocaleString()} USD</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsReserveModalOpen(true)}
                  className="w-full py-3.5 rounded-xl font-serif tracking-wide uppercase font-bold text-xs text-white shadow-lg transition-transform active:scale-[0.98]"
                  style={{
                    backgroundColor: "var(--template-primary)",
                    borderRadius: "var(--template-radius)",
                  }}
                >
                  Reserve Obsidian Pavilion
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reservation Inquiry Modal */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              color: "var(--template-fg)",
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--template-border)" }}>
              <span className="font-serif font-bold text-base">Inquire: The Obsidian Pavilion</span>
              <button onClick={() => setIsReserveModalOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReserveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 opacity-80">Full Name</label>
                <input
                  type="text"
                  defaultValue="Lord & Lady Sterling"
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  style={{ borderColor: "var(--template-border)" }}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Private Email Address</label>
                <input
                  type="email"
                  defaultValue="sterling@monolith.ch"
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  style={{ borderColor: "var(--template-border)" }}
                />
              </div>

              <div className="p-3 rounded-xl border text-[11px] font-mono opacity-80" style={{ borderColor: "var(--template-border)" }}>
                Selected: {nights} Nights • {guests} Guests • Estimated Quote: ${calculatedTotal.toLocaleString()} USD
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-semibold opacity-75"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-serif font-bold uppercase tracking-wider text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Toast */}
      {reserveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-stone-900 text-white text-xs font-serif font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Inquiry received. Private concierge will call within 2 hours.</span>
        </div>
      )}
    </div>
  );
}

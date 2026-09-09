"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Calendar,
  Users,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Wine,
  Leaf,
  X,
  PhoneCall,
  Heart,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function RestaurantCulinaryPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [activeMenuTab, setActiveMenuTab] = useState<"omakase" | "autumn" | "vegetal">("autumn");
  const [selectedDietary, setSelectedDietary] = useState<string>("All");
  const [partySize, setPartySize] = useState(2);
  const [selectedDate, setSelectedDate] = useState("Fri, Sep 18");
  const [selectedTime, setSelectedTime] = useState("19:30");
  const [seatingArea, setSeatingArea] = useState("hinoki");
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveToast, setReserveToast] = useState(false);

  const coursesData = {
    autumn: [
      {
        course: "Course I • Amuse",
        dish: "Hokkaido Sea Urchin & Dashi Tartlet",
        desc: "Smoked seaweed sablé, finger lime pearls, dashi reduction",
        pairing: "Krug Grande Cuvée 170th Edition",
        tags: ["Chef Signature"],
      },
      {
        course: "Course II • Cold Ocean",
        dish: "Wild Shima-Aji & Foraged Matsutake",
        desc: "Dry-aged striped jack sashimi, compressed persimmon, fermented shiso vinaigrette",
        pairing: "Kokuryu Ishidaya Daiginjo Sake",
        tags: ["Gluten-Free Available"],
      },
      {
        course: "Course III • Earth & Fire",
        dish: "A5 Miyazaki Wagyu Tenderloin",
        desc: "Binchotan charcoal sear, glazed autumn chanterelles, black garlic jus",
        pairing: "2018 Domaine de la Romanée-Conti Corton",
        tags: ["Chef Signature"],
      },
      {
        course: "Course IV • Dessert",
        dish: "Roasted White Truffle & Hojicha Gelato",
        desc: "Smoked caramel tuile, Piedmont white truffle shavings, single-origin matcha crumble",
        pairing: "Iced Kyoto Ceremonial Uji Gyokuro",
        tags: ["Vegetarian Safe"],
      },
    ],
    omakase: [
      {
        course: "Course I",
        dish: "Chawanmushi with Bluefin Otoro & Caviar",
        desc: "Silken egg custard, Oscietra royal reserve caviar",
        pairing: "Dom Pérignon Vintage 2013",
        tags: ["Chef Signature"],
      },
      {
        course: "Course II",
        dish: "Charcoal-Grilled Black Cod & Saikyo Miso",
        desc: "Caramelized 72-hour Kyoto white miso marinade, pickled ginger root",
        pairing: "Isojiman Naka-dori Daiginjo",
        tags: ["Gluten-Free Available"],
      },
    ],
    vegetal: [
      {
        course: "Course I",
        dish: "Heirloom Beet Tartare & Roasted Sesame Emulsion",
        desc: "Charred baby leeks, aged tamari pearls, puffed buckwheat",
        pairing: "Bio-dynamic Alsace Riesling Grand Cru",
        tags: ["Vegetarian Safe"],
      },
      {
        course: "Course II",
        dish: "Braised Wild Mountain Yam & Black Truffle",
        desc: "Nagaimo braised in kombu dashi, shaved Périgord winter truffle",
        pairing: "Kenbishi Mizuho Junmai Sake",
        tags: ["Vegetarian Safe"],
      },
    ],
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
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
      {/* Restaurant Header */}
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
              <TemplateLogo icon={config.logoIcon || "sparkles"} className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-serif text-sm @sm:text-base tracking-widest uppercase font-semibold"
                style={{ fontFamily: "var(--template-heading-font)" }}
              >
                {config.brandName || "Komorebi Dining"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden @md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
              <Award className="h-3.5 w-3.5" />
              <span>Two Michelin Stars</span>
            </div>

            <button
              onClick={() => setIsReserveModalOpen(true)}
              className="px-4 py-1.5 rounded-xl text-xs font-serif uppercase tracking-wider font-bold text-white shadow-sm transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              Reserve Table
            </button>
          </div>
        </div>
      </header>

      {/* Culinary Hero */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-10 space-y-12">
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif tracking-widest uppercase opacity-70 border" style={{ borderColor: "var(--template-border)" }}>
            <MapPin className="h-3.5 w-3.5 text-amber-600" />
            <span>Minami-Aoyama, Tokyo • Dinner Service 17:30 – 23:00</span>
          </div>

          <h1
            className="text-3xl @sm:text-5xl @lg:text-6xl font-serif font-light tracking-tight leading-tight"
            style={{ fontFamily: "var(--template-heading-font)" }}
          >
            A Symphony of Wild Foraging & Modern Japanese Gastronomy
          </h1>

          <p className="text-sm @sm:text-base opacity-75 max-w-2xl mx-auto leading-relaxed font-light">
            Crafted nightly around hyper-seasonal ingredients harvested from local mountain purveyors and Toyosu market fisheries, prepared over fragrant binchotan charcoal.
          </p>
        </section>

        {/* Core Layout: Tasting Menu (7 Cols) + Table Reservation Engine (5 Cols) */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-8">
          {/* Tasting Menu Breakdown: 7 Cols */}
          <div className="@lg:col-span-7 space-y-6">
            <div
              className="p-6 rounded-3xl border space-y-6"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: "var(--template-border)" }}>
                <div>
                  <h2 className="font-serif text-lg @sm:text-xl font-bold">Seasonal Menus</h2>
                  <p className="text-xs opacity-65">Curated by Executive Chef Kenji Takahashi</p>
                </div>

                {/* Menu Tab Selector */}
                <div
                  className="inline-flex p-1 rounded-xl border text-xs"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  {[
                    { id: "autumn", label: "Autumn (¥28,000)" },
                    { id: "omakase", label: "Omakase (¥38,000)" },
                    { id: "vegetal", label: "Vegetal (¥22,000)" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveMenuTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-serif font-semibold transition-all ${
                        activeMenuTab === tab.id
                          ? "bg-amber-700 text-white shadow-sm"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Courses List */}
              <div className="space-y-4">
                {coursesData[activeMenuTab].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border space-y-2 transition-colors"
                    style={{
                      backgroundColor: "var(--template-surface-elevated)",
                      borderColor: "var(--template-border)",
                    }}
                  >
                    <div className="flex justify-between items-start text-xs font-serif">
                      <span className="font-bold text-amber-700 dark:text-amber-400">{item.course}</span>
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold">
                        {item.tags[0]}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-base text-foreground">{item.dish}</h3>
                      <p className="text-xs opacity-75 mt-0.5 font-light leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px] opacity-70 font-mono">
                      <Wine className="h-3.5 w-3.5 text-amber-600" />
                      <span>Pairing: {item.pairing}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table Reservation Engine: 5 Cols */}
          <div className="@lg:col-span-5 space-y-4">
            <div
              className="p-6 rounded-3xl border space-y-5 shadow-sm"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="border-b pb-3">
                <h3 className="font-serif text-lg font-bold">Reserve a Table</h3>
                <p className="text-xs opacity-65 font-mono mt-0.5">Direct online booking with instant confirmation</p>
              </div>

              {/* Step 1: Party Size */}
              <div className="space-y-2 text-xs">
                <label className="font-semibold block opacity-80 font-serif">1. Party Size</label>
                <div className="flex gap-1.5">
                  {[1, 2, 4, 6, 8].map((size) => (
                    <button
                      key={size}
                      onClick={() => setPartySize(size)}
                      className={`flex-1 py-2 rounded-xl border font-bold text-xs transition-colors ${
                        partySize === size
                          ? "bg-amber-700 text-white border-amber-700"
                          : "border-zinc-300 dark:border-zinc-700 opacity-75 hover:opacity-100"
                      }`}
                    >
                      {size} {size === 1 ? "Guest" : "Guests"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Date Selector */}
              <div className="space-y-2 text-xs">
                <label className="font-semibold block opacity-80 font-serif">2. Seating Date</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Fri, Sep 18", "Sat, Sep 19", "Sun, Sep 20", "Wed, Sep 23", "Thu, Sep 24", "Fri, Sep 25"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`p-2 rounded-xl border text-center font-mono text-[11px] font-semibold transition-colors ${
                        selectedDate === d
                          ? "bg-amber-700 text-white border-amber-700"
                          : "border-zinc-300 dark:border-zinc-700 opacity-75 hover:opacity-100"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Seating Time */}
              <div className="space-y-2 text-xs">
                <label className="font-semibold block opacity-80 font-serif">3. Preferred Seating Time</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["17:30", "18:45", "20:00", "21:15"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-xl border text-center font-mono text-xs font-bold transition-colors ${
                        selectedTime === t
                          ? "bg-amber-700 text-white border-amber-700"
                          : "border-zinc-300 dark:border-zinc-700 opacity-75 hover:opacity-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Seating Area */}
              <div className="space-y-2 text-xs">
                <label className="font-semibold block opacity-80 font-serif">4. Seating Area</label>
                <div className="space-y-1.5">
                  {[
                    { id: "hinoki", name: "Chef's Hinoki Counter (Front row view)" },
                    { id: "main", name: "Main Dining Room (Intimate table)" },
                    { id: "garden", name: "Bamboo Garden Tea Pavilion" },
                  ].map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setSeatingArea(area.id)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                        seatingArea === area.id
                          ? "border-amber-600 bg-amber-600/10 font-bold"
                          : "border-zinc-300 dark:border-zinc-700 opacity-75"
                      }`}
                    >
                      <span>{area.name}</span>
                      {seatingArea === area.id && <CheckCircle2 className="h-4 w-4 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={() => setIsReserveModalOpen(true)}
                  className="w-full py-3 rounded-xl font-serif uppercase tracking-widest font-bold text-xs text-white shadow-md transition-transform active:scale-[0.98]"
                  style={{
                    backgroundColor: "var(--template-primary)",
                    borderRadius: "var(--template-radius)",
                  }}
                >
                  Confirm Table for {partySize}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reservation Confirmation Modal */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              color: "var(--template-fg)",
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--template-border)" }}>
              <span className="font-serif font-bold text-base">Confirm Reservation</span>
              <button onClick={() => setIsReserveModalOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReservationSubmit} className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border bg-amber-500/10 border-amber-500/20 space-y-1 font-serif">
                <div className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                  {selectedDate} at {selectedTime}
                </div>
                <div className="text-xs opacity-80 font-sans">
                  Party of {partySize} Guests • {seatingArea === "hinoki" ? "Chef's Counter" : "Main Dining"}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80 font-serif">Guest Name</label>
                <input
                  type="text"
                  defaultValue="Kenji Sutherland"
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  style={{ borderColor: "var(--template-border)" }}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80 font-serif">Special Dietary Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Shellfish allergy, birthday celebration"
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  style={{ borderColor: "var(--template-border)" }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-serif"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-serif font-bold uppercase tracking-wider text-white bg-amber-700 hover:bg-amber-600"
                >
                  Complete Booking
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Toast */}
      {reserveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-amber-700 text-white text-xs font-serif font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Table confirmed! Confirmation SMS dispatched.</span>
        </div>
      )}
    </div>
  );
}

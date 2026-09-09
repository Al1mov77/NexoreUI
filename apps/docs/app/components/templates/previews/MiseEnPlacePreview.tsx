"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Flame,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  RotateCcw,
  Volume2,
  ChefHat,
  Timer,
  ShoppingBag,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function MiseEnPlacePreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [activeStation, setActiveStation] = useState<"ALL" | "GRILL" | "SAUTE" | "PANTRY">("ALL");
  const [bumpedTickets, setBumpedTickets] = useState<string[]>([]);
  const [kdsToast, setKdsToast] = useState<string | null>(null);

  const initialTickets = [
    {
      id: "TKT-84",
      table: "TABLE 12",
      type: "DINE_IN",
      timeElapsed: "04:15",
      isUrgent: false,
      server: "Julian",
      items: [
        { name: "2x 45-Day Dry Aged Ribeye (Med-Rare)", station: "GRILL", notes: "Bone marrow butter, flaky Maldon salt" },
        { name: "1x Truffle Pommes Frites", station: "SAUTE", notes: "Extra crispy, parmesan snow" },
        { name: "1x Charred Broccolini", station: "GRILL", notes: "Preserved lemon vinaigrette" },
      ],
      allergy: null,
    },
    {
      id: "TKT-85",
      table: "UBEREATS #901",
      type: "DELIVERY",
      timeElapsed: "13:40",
      isUrgent: true,
      server: "Delivery Courier Waiting",
      items: [
        { name: "1x Crispy Buttermilk Fried Chicken", station: "SAUTE", notes: "Spicy habanero honey on side" },
        { name: "1x Heirloom Tomato & Burrata Salad", station: "PANTRY", notes: "ALLERGY: SEVERE TREE NUT ALLERGY" },
      ],
      allergy: "SEVERE TREE NUT ALLERGY - CLEAN SANITIZE BOARD",
    },
    {
      id: "TKT-86",
      table: "TABLE 04",
      type: "DINE_IN",
      timeElapsed: "08:22",
      isUrgent: false,
      server: "Chloe",
      items: [
        { name: "2x Pan-Seared Chilean Sea Bass", station: "SAUTE", notes: "Dashi beurre blanc, crispy leeks" },
        { name: "1x Hamachi Crudo", station: "PANTRY", notes: "Yuzu kosho, pickled radish" },
      ],
      allergy: null,
    },
  ];

  const handleBumpTicket = (ticketId: string) => {
    if (!bumpedTickets.includes(ticketId)) {
      setBumpedTickets([...bumpedTickets, ticketId]);
      setKdsToast(`Ticket [${ticketId}] Bumped! Routed to Expediter & Runner.`);
      setTimeout(() => setKdsToast(null), 3500);
    }
  };

  const handleRecallTicket = () => {
    if (bumpedTickets.length > 0) {
      const last = bumpedTickets[bumpedTickets.length - 1];
      setBumpedTickets(bumpedTickets.slice(0, -1));
      setKdsToast(`Ticket [${last}] recalled back to active line!`);
      setTimeout(() => setKdsToast(null), 3500);
    }
  };

  const visibleTickets = initialTickets.filter((tkt) => {
    if (bumpedTickets.includes(tkt.id)) return false;
    if (activeStation === "ALL") return true;
    return tkt.items.some((item) => item.station === activeStation);
  });

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
          backgroundColor: isDark ? "rgba(18, 12, 10, 0.9)" : "rgba(255, 255, 255, 0.92)",
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
              <TemplateLogo icon={config.logoIcon || "flame"} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">MiseEnPlace KDS</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(249, 115, 22, 0.12)",
                    color: "var(--template-primary)",
                  }}
                >
                  Restaurant Tech
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">
                Commercial Kitchen Display System & Line Order Expediter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRecallTicket}
              disabled={bumpedTickets.length === 0}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5"
              style={{ borderColor: "var(--template-border)" }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recall Last</span>
            </button>

            <div
              className="px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 text-orange-500"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>{visibleTickets.length} ACTIVE ORDERS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {kdsToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(249, 115, 22, 0.12)" : "#fff7ed",
                borderColor: "rgba(249, 115, 22, 0.3)",
                color: "#ea580c",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                <span>{kdsToast}</span>
              </div>
              <button onClick={() => setKdsToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Station Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl text-xs">
            {(["ALL", "GRILL", "SAUTE", "PANTRY"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setActiveStation(st)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeStation === st ? "bg-orange-500 text-white shadow-sm" : "opacity-60 hover:opacity-100"
                }`}
              >
                {st === "ALL" ? "All Kitchen Lines" : st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt; 5m On Time
            </span>
            <span className="flex items-center gap-1.5 text-amber-500">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> 5-10m Warning
            </span>
            <span className="flex items-center gap-1.5 text-rose-500">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> &gt; 12m Critical
            </span>
          </div>
        </div>

        {/* KDS Order Tickets Grid */}
        <div className="grid grid-cols-1 @md:grid-cols-3 gap-4">
          {visibleTickets.map((tkt) => (
            <div
              key={tkt.id}
              className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-sm transition-all ${
                tkt.isUrgent ? "border-rose-500 ring-2 ring-rose-500/20" : ""
              }`}
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: tkt.isUrgent ? undefined : "var(--template-border)",
              }}
            >
              {/* Ticket Header Bar */}
              <div
                className={`p-4 border-b flex items-center justify-between text-xs font-mono font-bold ${
                  tkt.isUrgent ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : ""
                }`}
                style={{ borderColor: "var(--template-border)" }}
              >
                <div>
                  <span className="text-sm font-black">{tkt.table}</span>
                  <div className="text-[10px] opacity-70 font-normal mt-0.5">{tkt.id} • {tkt.server}</div>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <Timer className={`w-3.5 h-3.5 ${tkt.isUrgent ? "text-rose-500 animate-spin" : "opacity-60"}`} />
                  <span>{tkt.timeElapsed}</span>
                </div>
              </div>

              {/* Allergy Warning Flag */}
              {tkt.allergy && (
                <div className="p-2.5 bg-rose-600 text-white text-[11px] font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>{tkt.allergy}</span>
                </div>
              )}

              {/* Ticket Items List */}
              <div className="p-4 space-y-3 flex-1">
                {tkt.items.map((item, idx) => (
                  <div key={idx} className="space-y-0.5 pb-2.5 border-b last:border-b-0" style={{ borderColor: "var(--template-border)" }}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold leading-tight">{item.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 font-semibold">
                        {item.station}
                      </span>
                    </div>
                    <div className="text-[11px] opacity-60 italic">{item.notes}</div>
                  </div>
                ))}
              </div>

              {/* Bump Ticket Footer Button */}
              <div className="p-3 border-t bg-black/5 dark:bg-white/5" style={{ borderColor: "var(--template-border)" }}>
                <button
                  onClick={() => handleBumpTicket(tkt.id)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 hover:opacity-90"
                  style={{ backgroundColor: "var(--template-primary)" }}
                >
                  <Check className="w-4 h-4" />
                  <span>Bump Order (Complete)</span>
                </button>
              </div>
            </div>
          ))}

          {visibleTickets.length === 0 && (
            <div
              className="@md:col-span-3 p-12 text-center rounded-2xl border space-y-2"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <ChefHat className="w-8 h-8 mx-auto text-emerald-500" />
              <h3 className="text-base font-bold">All Orders Cleared!</h3>
              <p className="text-xs opacity-60">Kitchen line is all prepped and clear for upcoming dinner rush.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

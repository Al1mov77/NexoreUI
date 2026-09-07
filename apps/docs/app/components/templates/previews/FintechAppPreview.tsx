"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Lock,
  Unlock,
  Send,
  Download,
  Search,
  CheckCircle2,
  RefreshCw,
  Globe,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function FintechAppPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  const [activeCurrency, setActiveCurrency] = useState<"USD" | "EUR" | "GBP">("USD");
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("4500");
  const [transferToast, setTransferToast] = useState(false);

  const balances = {
    USD: { symbol: "$", total: "2,841,920.40", yield: "+5.18% APY", wireLimit: "$500,000" },
    EUR: { symbol: "€", total: "1,940,210.00", yield: "+3.92% APY", wireLimit: "€450,000" },
    GBP: { symbol: "£", total: "820,450.15", yield: "+4.85% APY", wireLimit: "£300,000" },
  }[activeCurrency];

  const transactions = [
    { name: "AWS Cloud Infrastructure", cat: "Hosting & CDN", date: "Today, 14:22", amount: "-$12,420.00", status: "Cleared" },
    { name: "Stripe Settlement Inflow", cat: "Merchant Volume", date: "Today, 09:15", amount: "+$48,920.50", status: "Cleared" },
    { name: "Gartner Research Advisory", cat: "Subscriptions", date: "Yesterday", amount: "-$3,500.00", status: "Cleared" },
    { name: "Figma Enterprise Seats", cat: "Design Software", date: "Sep 04", amount: "-$1,840.00", status: "Cleared" },
  ];

  const handleSendWire = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransferOpen(false);
    setTransferToast(true);
    setTimeout(() => setTransferToast(false), 3000);
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors font-sans"
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
        <div className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <TemplateLogo icon={config.logoIcon || "shield"} className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-sm @sm:text-base tracking-tight"
              style={{ fontFamily: "var(--template-heading-font)" }}
            >
              {config.brandName || "Apex Capital"}
            </span>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            {/* Currency Switcher */}
            <div
              className="flex items-center p-1 rounded-lg border text-xs"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              {(["USD", "EUR", "GBP"] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setActiveCurrency(curr)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    activeCurrency === curr ? "text-white font-bold shadow-sm" : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: activeCurrency === curr ? "var(--template-primary)" : "transparent",
                    color: activeCurrency === curr ? "#ffffff" : "var(--template-fg)",
                    borderRadius: "calc(var(--template-radius) - 4px)",
                  }}
                >
                  {curr}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsTransferOpen(true)}
              className="text-xs @sm:text-sm font-semibold px-3.5 py-2 rounded-lg text-white shadow-sm transition-all hover:brightness-110 flex items-center gap-2 shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Send className="h-4 w-4" />
              <span className="hidden @sm:inline">Send Wire</span>
              <span className="@sm:hidden">Wire</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Treasury Dashboard Section */}
      <section className="pt-8 @sm:pt-12 @lg:pt-16 pb-12 @sm:pb-16 px-4 @sm:px-6 @lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-8 items-start">
          {/* Virtual Titanium Debit Card */}
          <div className="@lg:col-span-5 flex flex-col items-center w-full">
            <div
              className={`w-full max-w-md h-56 @sm:h-60 rounded-2xl p-6 border shadow-xl relative flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                isCardFrozen ? "grayscale brightness-75" : ""
              }`}
              style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
                color: "#ffffff",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-zinc-300 font-semibold">
                  APEX TITANIUM
                </span>
                <span
                  className="text-xs font-mono px-2.5 py-1 rounded-full border border-white/20 font-bold"
                  style={{
                    backgroundColor: isCardFrozen ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                    color: isCardFrozen ? "#f87171" : "#6ee7b7",
                  }}
                >
                  {isCardFrozen ? "FROZEN" : "ACTIVE"}
                </span>
              </div>

              {/* EMV Chip & Contactless */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-8 rounded bg-gradient-to-tr from-amber-400 to-amber-200 shadow-inner" />
                <div className="h-5 w-5 border-2 border-white/30 rounded-full" />
              </div>

              <div>
                <p className="font-mono text-lg @sm:text-xl tracking-widest mb-1.5 text-white">
                  {showCardNumber ? "4829 9102 3847 1092" : "•••• •••• •••• 1092"}
                </p>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                  <span>EXECUTIVE CORP</span>
                  <span>EXP 08/29</span>
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="flex items-center gap-3 mt-4 w-full max-w-md justify-center">
              <button
                onClick={() => setShowCardNumber(!showCardNumber)}
                className="flex-1 h-10 px-3 py-2 rounded-lg border text-xs @sm:text-sm font-medium flex items-center justify-center gap-2 hover:opacity-80 transition-opacity shadow-sm"
                style={{
                  backgroundColor: "var(--template-surface)",
                  borderColor: "var(--template-border)",
                  color: "var(--template-fg)",
                  borderRadius: "var(--template-radius)",
                }}
              >
                {showCardNumber ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                <span>{showCardNumber ? "Hide Number" : "Show Number"}</span>
              </button>

              <button
                onClick={() => setIsCardFrozen(!isCardFrozen)}
                className="flex-1 h-10 px-3 py-2 rounded-lg border text-xs @sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                style={{
                  backgroundColor: isCardFrozen ? "rgba(239, 68, 68, 0.1)" : "var(--template-surface)",
                  borderColor: isCardFrozen ? "#ef4444" : "var(--template-border)",
                  color: isCardFrozen ? "#ef4444" : "var(--template-fg)",
                  borderRadius: "var(--template-radius)",
                }}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{isCardFrozen ? "Unfreeze" : "Freeze"}</span>
              </button>
            </div>
          </div>

          {/* Treasury Summary & Yield */}
          <div className="@lg:col-span-7 space-y-6 w-full">
            <div
              className="p-5 @sm:p-7 rounded-2xl border transition-all"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
                boxShadow: "var(--template-card-shadow)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono tracking-wider" style={{ color: "var(--template-fg-muted)" }}>
                  Liquid Treasury Balance
                </span>
                <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  {balances.yield}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-3xl @xs:text-4xl @sm:text-5xl font-bold font-mono tracking-tight truncate">
                  {balances.symbol}{balances.total}
                </span>
                <span className="text-sm font-mono opacity-60 shrink-0">{activeCurrency}</span>
              </div>

              <div
                className="grid grid-cols-1 @xs:grid-cols-3 gap-3 pt-5 border-t text-xs font-mono"
                style={{ borderColor: "var(--template-border)" }}
              >
                <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--template-surface-muted)" }}>
                  <p className="text-xs mb-0.5" style={{ color: "var(--template-fg-muted)" }}>WIRE LIMIT</p>
                  <p className="font-semibold text-sm">{balances.wireLimit}</p>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--template-surface-muted)" }}>
                  <p className="text-xs mb-0.5" style={{ color: "var(--template-fg-muted)" }}>TRANSIT NETWORK</p>
                  <p className="font-semibold text-sm text-emerald-500">FedNow Instant</p>
                </div>
                <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--template-surface-muted)" }}>
                  <p className="text-xs mb-0.5" style={{ color: "var(--template-fg-muted)" }}>INSURANCE</p>
                  <p className="font-semibold text-sm">$5M FDIC Pool</p>
                </div>
              </div>
            </div>

            {/* Recent Corporate Ledger */}
            <div
              className="p-5 @sm:p-7 rounded-2xl border transition-all"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
                boxShadow: "var(--template-card-shadow)",
              }}
            >
              <div className="flex items-center justify-between pb-3.5 mb-3 border-b text-sm" style={{ borderColor: "var(--template-border)" }}>
                <span className="font-semibold text-sm @sm:text-base">Recent Treasury Transactions</span>
                <span className="text-xs font-mono" style={{ color: "var(--template-fg-muted)" }}>4 transactions</span>
              </div>

              <div className="divide-y text-sm" style={{ borderColor: "var(--template-border)" }}>
                {transactions.map((tx, i) => (
                  <div key={i} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="truncate min-w-0">
                      <p className="font-medium truncate" style={{ color: "var(--template-fg)" }}>
                        {tx.name}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: "var(--template-fg-muted)" }}>
                        {tx.cat} • {tx.date}
                      </p>
                    </div>
                    <span
                      className={`font-mono font-bold text-sm shrink-0 ${
                        tx.amount.startsWith("+") ? "text-emerald-500" : ""
                      }`}
                      style={{ color: tx.amount.startsWith("+") ? undefined : "var(--template-fg)" }}
                    >
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Send Wire Modal */}
      <AnimatePresence>
        {isTransferOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsTransferOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSendWire}
              className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <h3 className="font-bold text-base" style={{ fontFamily: "var(--template-heading-font)" }}>
                  Initiate FedNow Outbound Wire
                </h3>
                <button type="button" onClick={() => setIsTransferOpen(false)} className="p-1 rounded hover:opacity-75">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--template-fg-muted)" }}>
                  Beneficiary Account Name
                </label>
                <input
                  type="text"
                  required
                  defaultValue="Anthropic PBC"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent focus:outline-none"
                  style={{ borderColor: "var(--template-border)", color: "var(--template-fg)", borderRadius: "var(--template-radius)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--template-fg-muted)" }}>
                  Transfer Amount ({activeCurrency})
                </label>
                <input
                  type="number"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-base font-mono font-bold bg-transparent focus:outline-none"
                  style={{ borderColor: "var(--template-border)", color: "var(--template-fg)", borderRadius: "var(--template-radius)" }}
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs @sm:text-sm font-medium hover:opacity-80"
                  style={{ borderColor: "var(--template-border)", color: "var(--template-fg)", borderRadius: "var(--template-radius)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs @sm:text-sm font-semibold text-white shadow-sm hover:brightness-110"
                  style={{ backgroundColor: "var(--template-primary)", borderRadius: "var(--template-radius)" }}
                >
                  Authorize Wire
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wire Sent Toast Notification */}
      <AnimatePresence>
        {transferToast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 right-6 p-3.5 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-mono z-50"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              color: "var(--template-fg)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Wire authorized and submitted to FedNow rail.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer
        className="py-8 px-4 @sm:px-6 border-t text-center text-xs @sm:text-sm"
        style={{
          borderColor: "var(--template-border)",
          color: "var(--template-fg-muted)",
        }}
      >
        <p>© {new Date().getFullYear()} {config.brandName || "Apex Capital"}. Member FDIC insured.</p>
      </footer>
    </div>
  );
}

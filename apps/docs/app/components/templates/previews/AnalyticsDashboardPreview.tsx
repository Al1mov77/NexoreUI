"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Users,
  Download,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  ChevronDown,
  RefreshCw,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function AnalyticsDashboardPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  const [dateRange, setDateRange] = useState<"Today" | "7D" | "30D" | "90D">("30D");
  const [eventFilter, setEventFilter] = useState<"all" | "sub" | "upgrade">("all");
  const [exportToast, setExportToast] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dynamic metrics based on date range
  const metricsData = {
    Today: { mrr: "$6,240", delta: "+4.1%", teams: "31", nrr: "128.4%", bars: [45, 60, 35, 70, 85, 90, 65, 80] },
    "7D": { mrr: "$42,800", delta: "+8.9%", teams: "184", nrr: "125.1%", bars: [30, 45, 60, 75, 55, 80, 95, 88] },
    "30D": { mrr: "$148,920", delta: "+14.8%", teams: "642", nrr: "124.2%", bars: [40, 55, 35, 70, 60, 85, 75, 100, 90, 95] },
    "90D": { mrr: "$412,500", delta: "+22.4%", teams: "1,890", nrr: "121.8%", bars: [25, 40, 60, 55, 70, 80, 65, 85, 95, 100] },
  }[dateRange];

  const activities = [
    { type: "sub", user: "Sarah Jenkins", plan: "Enterprise Pro ($490/mo)", time: "2m ago", amount: "+$490" },
    { type: "upgrade", user: "Acme Corp Devs", plan: "Seat Expansion (+12 seats)", time: "14m ago", amount: "+$240" },
    { type: "sub", user: "HyperScale Ltd", plan: "Annual Developer Plan", time: "38m ago", amount: "+$1,200" },
    { type: "upgrade", user: "Nexus Studio", plan: "Storage Tier 4 Upgrade", time: "1h ago", amount: "+$85" },
  ];

  const filteredActivities = activities.filter(
    (a) => eventFilter === "all" || a.type === eventFilter
  );

  const handleExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2500);
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors flex flex-col @lg:flex-row font-sans"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Mobile Top Header */}
      <header
        className="@lg:hidden flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{
          backgroundColor: "var(--template-surface)",
          borderColor: "var(--template-border)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: "var(--template-primary)", borderRadius: "var(--template-radius)" }}
          >
            <TemplateLogo icon={config.logoIcon} className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-sm leading-tight block" style={{ fontFamily: "var(--template-heading-font)" }}>
              {config.brandName || "Prism HQ"}
            </span>
            <span className="text-[11px] font-mono leading-none block" style={{ color: "var(--template-fg-muted)" }}>
              Analytics Suite
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors"
          style={{ borderColor: "var(--template-border)", color: "var(--template-fg)" }}
          aria-label="Toggle navigation"
        >
          {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      {/* Mobile Sidebar Dropdown */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="@lg:hidden border-b p-4 space-y-2 text-sm overflow-hidden"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
            }}
          >
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-white shadow-sm"
              style={{ backgroundColor: "var(--template-primary)", borderRadius: "var(--template-radius)" }}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Revenue Streams</span>
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
            >
              <Users className="h-4 w-4" />
              <span>Subscribers</span>
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
            >
              <CreditCard className="h-4 w-4" />
              <span>Payouts & Tax</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation (Desktop / Tablet Expanded) */}
      <aside
        className="hidden @lg:flex w-64 border-r p-5 shrink-0 flex-col justify-between transition-colors text-sm"
        style={{
          backgroundColor: "var(--template-surface)",
          borderColor: "var(--template-border)",
        }}
      >
        <div>
          {/* Workspace Switcher */}
          <div
            className="flex items-center justify-between p-2.5 rounded-xl border mb-6 transition-all"
            style={{
              backgroundColor: "var(--template-surface-muted)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: "var(--template-primary)", borderRadius: "calc(var(--template-radius) - 2px)" }}
              >
                <TemplateLogo icon={config.logoIcon} className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm truncate block" style={{ fontFamily: "var(--template-heading-font)" }}>
                  {config.brandName || "Prism HQ"}
                </span>
                <span className="text-xs truncate block" style={{ color: "var(--template-fg-muted)" }}>
                  Enterprise Suite
                </span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-white shadow-sm"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-mono font-medium">Live</span>
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg opacity-75 hover:opacity-100 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Revenue Streams</span>
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg opacity-75 hover:opacity-100 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Subscribers</span>
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg opacity-75 hover:opacity-100 transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              <span>Payouts & Tax</span>
            </button>
          </nav>
        </div>

        {/* User Card */}
        <div
          className="pt-4 border-t flex items-center gap-3 text-sm"
          style={{ borderColor: "var(--template-border)" }}
        >
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
            style={{ backgroundColor: "var(--template-primary)" }}
          >
            EX
          </div>
          <div className="truncate min-w-0">
            <p className="font-semibold text-sm leading-tight truncate">Executive Ops</p>
            <p className="text-xs truncate" style={{ color: "var(--template-fg-muted)" }}>Admin • Pro Plan</p>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Canvas */}
      <main className="flex-1 p-4 @sm:p-6 @lg:p-8 overflow-y-auto min-w-0">
        {/* Top Action Bar */}
        <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-xl @sm:text-2xl @lg:text-3xl font-bold tracking-tight mb-1"
              style={{ fontFamily: "var(--template-heading-font)" }}
            >
              Executive Command Overview
            </h1>
            <p className="text-xs @sm:text-sm" style={{ color: "var(--template-fg-muted)" }}>
              Multi-currency financial telemetry & real-time inflow metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Range Selector */}
            <div
              className="flex items-center p-1 rounded-lg border text-xs"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              {(["Today", "7D", "30D", "90D"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                    dateRange === r
                      ? "text-white font-semibold shadow-sm"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: dateRange === r ? "var(--template-primary)" : "transparent",
                    color: dateRange === r ? "#ffffff" : "var(--template-fg)",
                    borderRadius: "calc(var(--template-radius) - 4px)",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <button
              onClick={handleExport}
              className="px-3.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all hover:opacity-80 shadow-sm"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 @xs:grid-cols-2 @xl:grid-cols-4 gap-4 mb-6">
          {/* Card 1: MRR */}
          <div
            className="p-4 @sm:p-5 rounded-xl border flex flex-col justify-between transition-all"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
              boxShadow: "var(--template-card-shadow)",
            }}
          >
            <div>
              <div className="flex items-center justify-between text-xs @sm:text-sm mb-1.5" style={{ color: "var(--template-fg-muted)" }}>
                <span className="font-medium">Monthly Recurring</span>
                <span className="text-emerald-500 font-mono text-xs flex items-center font-bold">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> {metricsData.delta}
                </span>
              </div>
              <p className="text-2xl @sm:text-3xl font-bold font-mono tracking-tight mb-1 truncate">{metricsData.mrr}</p>
              <p className="text-xs" style={{ color: "var(--template-fg-muted)" }}>Trailing {dateRange} cycle</p>
            </div>
            {/* Sparkline mini bars */}
            <div className="h-8 flex items-end gap-1.5 mt-4">
              {metricsData.bars.map((b, i) => (
                <div
                  key={i}
                  style={{
                    height: `${b}%`,
                    backgroundColor: "var(--template-primary)",
                  }}
                  className="flex-1 rounded-t opacity-75 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Card 2: NRR */}
          <div
            className="p-4 @sm:p-5 rounded-xl border flex flex-col justify-between transition-all"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
              boxShadow: "var(--template-card-shadow)",
            }}
          >
            <div>
              <div className="flex items-center justify-between text-xs @sm:text-sm mb-1.5" style={{ color: "var(--template-fg-muted)" }}>
                <span className="font-medium">Net Retention (NRR)</span>
                <span className="text-emerald-500 font-mono text-xs flex items-center font-bold">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +2.4%
                </span>
              </div>
              <p className="text-2xl @sm:text-3xl font-bold font-mono tracking-tight mb-1 truncate">{metricsData.nrr}</p>
              <p className="text-xs" style={{ color: "var(--template-fg-muted)" }}>Negative revenue churn</p>
            </div>
            <div className="h-8 flex items-end gap-1.5 mt-4">
              {[50, 60, 65, 70, 75, 85, 90, 95].map((b, i) => (
                <div
                  key={i}
                  style={{ height: `${b}%` }}
                  className="flex-1 bg-emerald-500 rounded-t opacity-75 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Card 3: Workspaces */}
          <div
            className="p-4 @sm:p-5 rounded-xl border flex flex-col justify-between transition-all"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
              boxShadow: "var(--template-card-shadow)",
            }}
          >
            <div>
              <div className="flex items-center justify-between text-xs @sm:text-sm mb-1.5" style={{ color: "var(--template-fg-muted)" }}>
                <span className="font-medium">Paid Workspaces</span>
                <span className="text-emerald-500 font-mono text-xs flex items-center font-bold">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +12.1%
                </span>
              </div>
              <p className="text-2xl @sm:text-3xl font-bold font-mono tracking-tight mb-1 truncate">{metricsData.teams}</p>
              <p className="text-xs" style={{ color: "var(--template-fg-muted)" }}>Active enterprise seats</p>
            </div>
            <div className="h-8 flex items-end gap-1.5 mt-4">
              {[30, 45, 55, 65, 70, 80, 85, 90].map((b, i) => (
                <div
                  key={i}
                  style={{ height: `${b}%`, backgroundColor: "var(--template-primary)" }}
                  className="flex-1 rounded-t opacity-75 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Card 4: Gross Margin */}
          <div
            className="p-4 @sm:p-5 rounded-xl border flex flex-col justify-between transition-all"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
              boxShadow: "var(--template-card-shadow)",
            }}
          >
            <div>
              <div className="flex items-center justify-between text-xs @sm:text-sm mb-1.5" style={{ color: "var(--template-fg-muted)" }}>
                <span className="font-medium">Gross Margin</span>
                <span className="text-emerald-500 font-mono text-xs flex items-center font-bold">
                  84.2%
                </span>
              </div>
              <p className="text-2xl @sm:text-3xl font-bold font-mono tracking-tight mb-1 truncate">84.2%</p>
              <p className="text-xs" style={{ color: "var(--template-fg-muted)" }}>Sub-16% COGS overhead</p>
            </div>
            <div className="h-8 flex items-end gap-1.5 mt-4">
              {[70, 72, 75, 78, 80, 82, 83, 85].map((b, i) => (
                <div
                  key={i}
                  style={{ height: `${b}%` }}
                  className="flex-1 bg-emerald-500 rounded-t opacity-75 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Live Customer Activity Stream */}
        <div
          className="rounded-xl border p-4 @sm:p-6 transition-all"
          style={{
            backgroundColor: "var(--template-surface-elevated)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
            boxShadow: "var(--template-card-shadow)",
          }}
        >
          <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-3 pb-4 mb-4 border-b text-sm" style={{ borderColor: "var(--template-border)" }}>
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4" style={{ color: "var(--template-primary)" }} />
              <span className="font-semibold text-sm @sm:text-base">Live Inflow Ledger</span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              {(["all", "sub", "upgrade"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setEventFilter(f)}
                  className={`px-3 py-1 rounded capitalize transition-all ${
                    eventFilter === f ? "font-semibold text-white shadow-sm" : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: eventFilter === f ? "var(--template-primary)" : "transparent",
                    color: eventFilter === f ? "#ffffff" : "var(--template-fg)",
                    borderRadius: "calc(var(--template-radius) - 4px)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Activity items list */}
          <div className="divide-y text-sm" style={{ borderColor: "var(--template-border)" }}>
            {filteredActivities.map((act, i) => (
              <div key={i} className="py-3 flex items-center justify-between gap-3">
                <div className="truncate min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: "var(--template-fg)" }}>
                    {act.user}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: "var(--template-fg-muted)" }}>
                    {act.plan} • {act.time}
                  </p>
                </div>
                <span className="font-mono font-bold text-emerald-500 text-sm shrink-0">
                  {act.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Export Toast Notification */}
        <AnimatePresence>
          {exportToast && (
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
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Exported CSV ledger successfully.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

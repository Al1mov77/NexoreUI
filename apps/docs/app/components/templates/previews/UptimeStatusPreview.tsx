"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Globe,
  Bell,
  ShieldCheck,
  Clock,
  Server,
  Activity,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  X,
  Send,
  Zap,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function UptimeStatusPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [hoveredDay, setHoveredDay] = useState<{ service: string; day: number; uptime: string } | null>(null);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribedToast, setSubscribedToast] = useState(false);

  const services = [
    {
      name: "Global Anycast Edge CDN & Ingress",
      category: "Routing & CDN",
      uptime: "100.0%",
      latency: "11ms",
      status: "Operational",
      incidentDays: [] as number[],
    },
    {
      name: "Authentication & OAuth SSO Engine",
      category: "Security",
      uptime: "99.99%",
      latency: "24ms",
      status: "Operational",
      incidentDays: [22],
    },
    {
      name: "Distributed Vector Indexing Pipeline",
      category: "Compute",
      uptime: "99.97%",
      latency: "38ms",
      status: "Operational",
      incidentDays: [54],
    },
    {
      name: "Transaction Database Clusters (Postgres)",
      category: "Storage",
      uptime: "99.95%",
      latency: "14ms",
      status: "Operational",
      incidentDays: [12, 68],
    },
    {
      name: "Asynchronous Webhook & Queue Workers",
      category: "Integration",
      uptime: "99.99%",
      latency: "18ms",
      status: "Operational",
      incidentDays: [] as number[],
    },
  ];

  const regions = [
    { region: "US-East (N. Virginia)", ping: "12ms", load: "18%", status: "Optimal" },
    { region: "US-West (Oregon)", ping: "22ms", load: "24%", status: "Optimal" },
    { region: "EU-Central (Frankfurt)", ping: "16ms", load: "32%", status: "Optimal" },
    { region: "AP-East (Tokyo)", ping: "38ms", load: "28%", status: "Optimal" },
    { region: "SA-East (São Paulo)", ping: "78ms", load: "14%", status: "Optimal" },
    { region: "AP-South (Singapore)", ping: "44ms", load: "21%", status: "Optimal" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    setIsSubscribeOpen(false);
    setSubscribedToast(true);
    setTimeout(() => setSubscribedToast(false), 3500);
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
      {/* Top Header */}
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
              <TemplateLogo icon={config.logoIcon || "shield"} className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-bold text-sm @sm:text-base tracking-tight"
                style={{ fontFamily: "var(--template-heading-font)" }}
              >
                {config.brandName || "Beacon Status"}
              </span>
              <span className="hidden @md:inline-block text-xs opacity-60 ml-2 font-mono">
                • Public Availability Telemetry
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSubscribeOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
            style={{
              backgroundColor: "var(--template-primary)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Subscribe to Alerts</span>
          </button>
        </div>
      </header>

      {/* Main Status Portal Body */}
      <main className="w-full max-w-5xl mx-auto px-4 @sm:px-6 @lg:px-8 py-8 space-y-8">
        {/* System Availability Status Hero Banner */}
        <div
          className="p-5 @sm:p-6 rounded-2xl border flex flex-col @sm:flex-row items-start @sm:items-center justify-between gap-4 shadow-sm"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "rgba(16, 185, 129, 0.3)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-base @sm:text-lg">All Core Systems Fully Operational</h1>
              <p className="text-xs opacity-75 mt-0.5">
                99.994% overall uptime across 35 edge regions over the last 90 days.
              </p>
            </div>
          </div>

          <div className="text-left @sm:text-right border-t @sm:border-t-0 pt-3 @sm:pt-0 w-full @sm:w-auto" style={{ borderColor: "var(--template-border)" }}>
            <div className="text-[11px] font-mono opacity-60">Automated Probes: Every 30s</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Zero Unresolved Incidents</div>
          </div>
        </div>

        {/* 90-Day Component Uptime Grid */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-sm @sm:text-base flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-500" />
              <span>Core Service Availability (Past 90 Days)</span>
            </h2>
            <span className="text-xs font-mono opacity-60 hidden @sm:inline">Hover on bars for daily log</span>
          </div>

          <div className="space-y-3">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="p-4 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: "var(--template-surface)",
                  borderColor: "var(--template-border)",
                  borderRadius: "var(--template-radius)",
                }}
              >
                <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <span className="font-bold text-sm text-foreground">{svc.name}</span>
                    <span className="text-xs opacity-60 ml-2 font-mono">({svc.category})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] opacity-70">Latency: {svc.latency}</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {svc.uptime}
                    </span>
                  </div>
                </div>

                {/* 90-Day Bar Strip */}
                <div className="flex items-center gap-0.5 h-7">
                  {Array.from({ length: 90 }).map((_, dayIdx) => {
                    const hasIncident = svc.incidentDays.includes(dayIdx);
                    const barColor = hasIncident
                      ? "bg-amber-500 hover:bg-amber-400"
                      : "bg-emerald-500/80 hover:bg-emerald-400";
                    return (
                      <div
                        key={dayIdx}
                        onMouseEnter={() =>
                          setHoveredDay({
                            service: svc.name,
                            day: 90 - dayIdx,
                            uptime: hasIncident ? "99.82% (Minor incident resolved)" : "100.0% Optimal",
                          })
                        }
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`flex-1 h-full rounded-sm transition-transform hover:scale-125 cursor-pointer ${barColor}`}
                      />
                    );
                  })}
                </div>

                <div className="flex justify-between text-[10px] font-mono opacity-50 pt-1">
                  <span>90 days ago</span>
                  <span>45 days ago</span>
                  <span>Today (100% Operational)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Hover tooltip readout */}
          {hoveredDay && (
            <div
              className="p-3 rounded-xl border text-xs font-mono flex items-center justify-between bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
            >
              <span>{hoveredDay.service} • {hoveredDay.day} days ago</span>
              <span className="font-bold">{hoveredDay.uptime}</span>
            </div>
          )}
        </section>

        {/* Global Regional Latency Monitor Grid */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-sm @sm:text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-500" />
              <span>Global Regional Latency Probes</span>
            </h2>
            <span className="text-xs font-mono opacity-60">Real-time ICMP ping telemetry</span>
          </div>

          <div className="grid grid-cols-2 @md:grid-cols-3 gap-3">
            {regions.map((r) => (
              <div
                key={r.region}
                className="p-3.5 rounded-xl border space-y-1.5"
                style={{
                  backgroundColor: "var(--template-surface)",
                  borderColor: "var(--template-border)",
                  borderRadius: "var(--template-radius)",
                }}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold truncate">{r.region}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    {r.status}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs font-mono">
                  <span className="text-lg font-black text-foreground">{r.ping}</span>
                  <span className="text-[11px] opacity-60">CPU: {r.load}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Past Incident Response Log */}
        <section className="space-y-4">
          <h2 className="font-bold text-sm @sm:text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span>Incident Response History</span>
          </h2>

          <div
            className="p-5 @sm:p-6 rounded-2xl border space-y-4"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-1 border-b pb-3" style={{ borderColor: "var(--template-border)" }}>
              <div>
                <span className="text-xs font-mono font-bold text-amber-500">INC-4829</span>
                <h3 className="font-bold text-sm mt-0.5">Elevated Connection Pool Latency on Postgres Read-Replica</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold w-fit">
                Resolved in 14m
              </span>
            </div>

            <div className="space-y-3 text-xs opacity-85 leading-relaxed pl-3 border-l-2 border-emerald-500">
              <div>
                <span className="font-bold text-foreground">14:22 UTC - Resolved:</span> Automatic failover triggered to secondary multi-AZ replica. Latency normalized to 14ms.
              </div>
              <div>
                <span className="font-bold text-foreground">14:12 UTC - Monitoring:</span> Traffic drained from degraded node. Verification telemetry stable.
              </div>
              <div>
                <span className="font-bold text-foreground">14:08 UTC - Investigating:</span> SRE team paged. Query queue depth elevated on us-east cluster.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Subscription Modal */}
      {isSubscribeOpen && (
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
              <span className="font-bold text-base">Subscribe to Incident Alerts</span>
              <button onClick={() => setIsSubscribeOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3 text-xs">
              <p className="opacity-75 leading-relaxed">
                Receive immediate dispatch notifications whenever an incident is reported, updated, or resolved.
              </p>
              <div>
                <label className="block font-semibold mb-1 opacity-80">Email or Slack Webhook URL</label>
                <input
                  type="email"
                  required
                  placeholder="sre-alerts@company.com"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  style={{ borderColor: "var(--template-border)" }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubscribeOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-semibold opacity-75"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Toast */}
      {subscribedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Subscribed to Beacon Status notifications!</span>
        </div>
      )}
    </div>
  );
}

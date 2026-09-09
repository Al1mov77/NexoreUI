"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Lock,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Crosshair,
  Server,
  Zap,
  Globe,
  Sliders,
  FileCode,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function CybersecuritySocPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [selectedIncident, setSelectedIncident] = useState(0);
  const [isQuarantineModalOpen, setIsQuarantineModalOpen] = useState(false);
  const [quarantinedHosts, setQuarantinedHosts] = useState<string[]>([]);
  const [socToast, setSocToast] = useState<string | null>(null);

  const incidents = [
    {
      id: "INC-98214",
      title: "Pass-the-Hash Lateral Movement via SMB",
      mitre: "T1021.002",
      severity: "CRITICAL",
      sla: "07:22",
      host: "srv-dc-primary-01.internal",
      ip: "10.240.12.8",
      sourceIp: "185.220.101.5",
      riskScore: 96,
      payload: "0x4E 0x54 0x4C 0x4D 0x53 0x53 0x50 ... [NTLMSSP Auth Negotiate NTLM2 Key]",
      desc: "Anomalous NTLM authentication token reused across 12 high-privilege domain controllers within 45 seconds.",
    },
    {
      id: "INC-98215",
      title: "LSASS Process Memory Dumper Heuristic",
      mitre: "T1003.001",
      severity: "HIGH",
      sla: "18:40",
      host: "dev-macbook-eng-41.corp",
      ip: "10.240.88.19",
      sourceIp: "194.26.29.112",
      riskScore: 84,
      payload: "com.apple.proc.memory.dump -> /tmp/.hidden_kext_cache",
      desc: "Unsigned Mach-O binary invoked ptrace() against local security authority memory space.",
    },
    {
      id: "INC-98216",
      title: "High-Entropy DNS Tunneling Data Exfiltration",
      mitre: "T1071.004",
      severity: "MEDIUM",
      sla: "42:15",
      host: "app-worker-node-14.k8s",
      ip: "10.240.64.92",
      sourceIp: "45.154.255.89",
      riskScore: 68,
      payload: "TXT 8a9f4c029b.ns1.malicious-darknet.xyz -> base64 decode",
      desc: "Sustained burst of 450 Base64-encoded DNS TXT queries matching known C2 heartbeat patterns.",
    },
  ];

  const currentInc = incidents[selectedIncident];
  const isCurrentHostQuarantined = quarantinedHosts.includes(currentInc.host);

  const handleQuarantineConfirm = () => {
    setQuarantinedHosts((prev) => [...prev, currentInc.host]);
    setIsQuarantineModalOpen(false);
    setSocToast(`HOST ISOLATED: ${currentInc.host} air-gapped from internal mesh. Firewall zero-trust drop applied.`);
    setTimeout(() => setSocToast(null), 4000);
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
              <TemplateLogo icon={config.logoIcon || "shield-alert"} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm @sm:text-base tracking-tight"
                  style={{ fontFamily: "var(--template-heading-font)" }}
                >
                  {config.brandName || "Aegis SOC"}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  DEFCON 3: ELEVATED
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">Security Operations Center & Automated Threat Defense</p>
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
              <Radio className="w-3.5 h-3.5 text-emerald-500" />
              <span>SIEM Ingest: 82,400 eps</span>
              <span className="opacity-30">•</span>
              <span className="text-emerald-500">99.8% Auto-Mitigated</span>
            </div>

            <button
              onClick={() => setIsQuarantineModalOpen(true)}
              disabled={isCurrentHostQuarantined}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor: isCurrentHostQuarantined ? "#6b7280" : "#e11d48",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{isCurrentHostQuarantined ? "Host Air-Gapped" : "Isolate Host"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {socToast && (
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
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{socToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @lg:py-8 space-y-6">
        {/* Top 4 SOC Health KPI Cards */}
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Critical Incidents in Queue</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-rose-500">1</span>
              <span className="text-xs opacity-60">/ 3 Active Alarms</span>
            </div>
            <p className="text-[11px] opacity-65">SLA Countdown: 07:22 to escalation breach.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full w-[85%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">MITRE Techniques Flagged</span>
              <Crosshair className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">4</span>
              <span className="text-xs text-amber-500 font-medium">T1021, T1003</span>
            </div>
            <p className="text-[11px] opacity-65">Privilege escalation & Credential Access.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[60%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Zero-Trust Network Airgaps</span>
              <Lock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">
                {quarantinedHosts.length}
              </span>
              <span className="text-xs opacity-60">Isolated Hosts</span>
            </div>
            <p className="text-[11px] opacity-65">Micro-segmentation policy enforced at eBPF kernel.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[45%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">CVE Vulnerability Shielding</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-emerald-500">100%</span>
              <span className="text-xs opacity-60">Virtual Patched</span>
            </div>
            <p className="text-[11px] opacity-65">WAF heuristics blocking zero-day exploits.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[100%]" />
            </div>
          </div>
        </div>

        {/* Section 1 & 2: SIEM Triage Queue & Deep Payload Inspector */}
        <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
          {/* SIEM Incident Queue */}
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
                <h3 className="text-base font-bold tracking-tight">Active Incident Triage Stream</h3>
                <p className="text-xs opacity-65">Select an alert to inspect origin traces & MITRE signatures</p>
              </div>
              <span className="text-xs font-mono opacity-70">3 Incidents Pending SLA</span>
            </div>

            <div className="space-y-3">
              {incidents.map((inc, idx) => {
                const isSelected = selectedIncident === idx;
                const isQuarantined = quarantinedHosts.includes(inc.host);

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:border-indigo-500/40"
                    }`}
                    style={{
                      backgroundColor: isSelected ? (isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)") : (isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)"),
                      borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{inc.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inc.severity === "CRITICAL"
                              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              : inc.severity === "HIGH"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          }`}
                        >
                          {inc.severity}
                        </span>
                        <span className="font-mono px-2 py-0.5 rounded text-[10px] bg-zinc-200 dark:bg-zinc-800">
                          MITRE {inc.mitre}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="opacity-60">SLA: {inc.sla}</span>
                        {isQuarantined && (
                          <span className="px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 font-bold text-[10px]">
                            AIR-GAPPED
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs font-bold mb-1">{inc.title}</h4>
                    <p className="text-[11px] opacity-70 mb-2 leading-relaxed">{inc.desc}</p>

                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono opacity-60">
                      <span>Target Host: {inc.host}</span>
                      <span>Target IP: {inc.ip}</span>
                      <span className="text-rose-400">Threat Origin: {inc.sourceIp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deep Payload & Risk Score Inspector */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between font-mono"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4 font-sans">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Packet Payload Inspector</h3>
                </div>
                <span className="text-xs font-mono text-rose-500 font-bold">
                  Risk: {currentInc.riskScore}/100
                </span>
              </div>

              {/* Target info card */}
              <div className="p-3 rounded-xl border text-xs space-y-1 mb-4" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
                <div><span className="opacity-50">Target Host: </span><span className="font-bold">{currentInc.host}</span></div>
                <div><span className="opacity-50">Ingress Point: </span><span>{currentInc.sourceIp}</span></div>
                <div><span className="opacity-50">Technique: </span><span className="text-amber-400">{currentInc.mitre}</span></div>
              </div>

              {/* Raw Payload snippet */}
              <div className="space-y-1 text-xs">
                <span className="opacity-60 text-[11px] font-sans">Raw Byte Sequence:</span>
                <div
                  className="p-3 rounded-xl border text-[11px] leading-relaxed break-all max-h-36 overflow-y-auto"
                  style={{
                    backgroundColor: isDark ? "#08090f" : "#f1f5f9",
                    borderColor: "var(--template-border)",
                    color: isDark ? "#38bdf8" : "#0369a1",
                  }}
                >
                  {currentInc.payload}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t font-sans">
              <button
                onClick={() => setIsQuarantineModalOpen(true)}
                disabled={isCurrentHostQuarantined}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: isCurrentHostQuarantined ? "#6b7280" : "#e11d48" }}
              >
                {isCurrentHostQuarantined ? "Host Air-Gapped" : `Isolate ${currentInc.host}`}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Isolation Confirmation Modal */}
      <AnimatePresence>
        {isQuarantineModalOpen && (
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
                onClick={() => setIsQuarantineModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-rose-500">Emergency Host Air-Gap Isolation</h3>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <p className="leading-relaxed opacity-80">
                  Executing an air-gap will instantly sever all TCP/UDP connections to <strong>{currentInc.host}</strong> ({currentInc.ip}) via SDN kernel drop rules. Active sessions will be terminated immediately.
                </p>

                <div className="p-3 rounded-xl border font-mono space-y-1 text-[11px]" style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}>
                  <div>Target Asset: {currentInc.host}</div>
                  <div>Origin Signature: {currentInc.mitre}</div>
                  <div>SLA Action: Immediate Airgap Quarantine</div>
                </div>

                <button
                  onClick={handleQuarantineConfirm}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-95 bg-rose-600 hover:bg-rose-700"
                >
                  Confirm Immediate Air-Gap Isolation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  ShieldAlert,
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Sliders,
  ChevronRight,
  GitPullRequest,
  History,
  PenTool,
  Check,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function JurisVaultPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // State
  const [selectedClauseIndex, setSelectedClauseIndex] = useState(0);
  const [clauseFilter, setClauseFilter] = useState<"ALL" | "HIGH_RISK" | "RESOLVED">("ALL");
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signedParties, setSignedParties] = useState<string[]>(["Legal Counsel (Acme Corp)"]);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const clauses = [
    {
      id: "SEC-8.2",
      title: "Limitation of Liability & Consequential Damages",
      risk: "CRITICAL",
      riskScore: 94,
      status: "COUNTER_PROPOSED",
      original:
        "In no event shall either party's aggregate cumulative liability arising out of or related to this Agreement exceed twelve (12) months of service fees paid prior to the incident giving rise to claim.",
      proposed:
        "Counterparty proposes: Liability cap raised to five million dollars ($5,000,000 USD) and eliminates standard exclusion for consequential, lost revenue, and punitive damages.",
      riskExplanation:
        "Uncapped liability exposure for third-party indirect damages drastically deviates from corporate playbook standard.",
      recommendation: "Reject uncapped consequential damages. Counter with 2x annual contract value cap with standard IP carve-out.",
    },
    {
      id: "SEC-14.1",
      title: "Intellectual Property Indemnification & Defense",
      risk: "HIGH",
      riskScore: 78,
      status: "UNDER_REVIEW",
      original:
        "Provider shall defend, indemnify and hold harmless Customer against any third-party claims asserting that the Platform infringes any valid United States patent or copyright.",
      proposed:
        "Counterparty requests: Worldwide patent, trademark, and trade secret indemnification with sole settlement authority and immediate defense counsel appointment.",
      riskExplanation:
        "Worldwide coverage introduces foreign patent troll exposure. Immediate counsel appointment limits internal defense strategy.",
      recommendation: "Limit defense indemnity to US/EU jurisdictions with mutual consultation prior to any public settlement.",
    },
    {
      id: "SEC-4.3",
      title: "Net Payment Terms & Late Interest Accrual",
      risk: "LOW",
      riskScore: 22,
      status: "RESOLVED",
      original:
        "Invoices are payable Net 30 days from date of receipt via automated ACH or electronic wire transfer.",
      proposed:
        "Customer requests Net 45 days. Accepted as standard enterprise commercial trade concession.",
      riskExplanation: "Minimal financial impact; aligned with standard treasury cash-flow tolerance.",
      recommendation: "Clause resolved and approved by commercial director on Sep 8.",
    },
  ];

  const filteredClauses = clauses.filter((c) => {
    if (clauseFilter === "HIGH_RISK") return c.risk === "CRITICAL" || c.risk === "HIGH";
    if (clauseFilter === "RESOLVED") return c.status === "RESOLVED";
    return true;
  });

  const currentClause = clauses[selectedClauseIndex] || clauses[0];

  const handleSignContract = (signer: string) => {
    if (!signedParties.includes(signer)) {
      setSignedParties([...signedParties, signer]);
      setActionToast(`Cryptographic e-signature verified for ${signer}`);
      setTimeout(() => setActionToast(null), 3500);
    }
  };

  const handleAcceptFallback = () => {
    setActionToast("Fallback Clause injected into Master Document (v2.5 draft created)");
    setTimeout(() => setActionToast(null), 3500);
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
      {/* Top Navigation */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(10, 12, 18, 0.88)" : "rgba(255, 255, 255, 0.92)",
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
              <TemplateLogo icon={config.logoIcon || "shield"} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">JurisVault AI</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(99, 102, 241, 0.12)",
                    color: "var(--template-primary)",
                  }}
                >
                  LegalTech
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">
                Master Services Agreement • Enterprise Redline Review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden @md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <FileText className="w-3.5 h-3.5 opacity-60" />
              <span className="font-medium">MSA-2026-AcmeCorp-v2.4.docx</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            </div>

            <button
              onClick={() => setIsSignModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--template-primary)" }}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Signatures ({signedParties.length}/2)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {actionToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.12)" : "#ecfdf5",
                borderColor: "rgba(16, 185, 129, 0.3)",
                color: "#10b981",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{actionToast}</span>
              </div>
              <button onClick={() => setActionToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Executive Summary Bar */}
        <div className="grid grid-cols-2 @md:grid-cols-4 gap-3">
          <div
            className="p-4 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold opacity-60">Overall Risk Score</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-500">68/100</span>
              <span className="text-[11px] font-medium text-rose-500">High Exposure</span>
            </div>
            <p className="text-[10px] opacity-50 mt-1">2 critical non-standard clauses</p>
          </div>

          <div
            className="p-4 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold opacity-60">Redlines Detected</span>
              <GitPullRequest className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">14</span>
              <span className="text-[11px] opacity-70">modifications</span>
            </div>
            <p className="text-[10px] opacity-50 mt-1">11 approved • 3 outstanding</p>
          </div>

          <div
            className="p-4 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold opacity-60">Playbook Adherence</span>
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-500">82%</span>
              <span className="text-[11px] text-emerald-500 font-medium">+5% vs draft 1</span>
            </div>
            <p className="text-[10px] opacity-50 mt-1">Corporate Standard 2026.Q3</p>
          </div>

          <div
            className="p-4 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold opacity-60">Execution SLA</span>
              <History className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">48 hrs</span>
              <span className="text-[11px] text-emerald-500 font-medium">On Track</span>
            </div>
            <p className="text-[10px] opacity-50 mt-1">Target close: Sep 12, 2026</p>
          </div>
        </div>

        {/* Workspace: Left clause selector / Right interactive redline comparison */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Clause Navigation List */}
          <div className="@lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider opacity-60">
                Key Redline Clauses
              </h2>
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg text-[10px]">
                <button
                  onClick={() => setClauseFilter("ALL")}
                  className={`px-2 py-1 rounded-md font-semibold transition-all ${
                    clauseFilter === "ALL" ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-60"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setClauseFilter("HIGH_RISK")}
                  className={`px-2 py-1 rounded-md font-semibold transition-all ${
                    clauseFilter === "HIGH_RISK" ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-60"
                  }`}
                >
                  Risk
                </button>
                <button
                  onClick={() => setClauseFilter("RESOLVED")}
                  className={`px-2 py-1 rounded-md font-semibold transition-all ${
                    clauseFilter === "RESOLVED" ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-60"
                  }`}
                >
                  Done
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {filteredClauses.map((clause, idx) => {
                const isSelected = clause.id === currentClause.id;
                return (
                  <button
                    key={clause.id}
                    onClick={() => {
                      const realIndex = clauses.findIndex((c) => c.id === clause.id);
                      setSelectedClauseIndex(realIndex);
                    }}
                    className="w-full text-left p-3.5 rounded-xl border transition-all relative overflow-hidden"
                    style={{
                      backgroundColor: isSelected ? "var(--template-surface)" : "transparent",
                      borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                    }}
                  >
                    {isSelected && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: "var(--template-primary)" }}
                      />
                    )}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono font-bold opacity-60">{clause.id}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          clause.risk === "CRITICAL"
                            ? "bg-rose-500/15 text-rose-500 border border-rose-500/20"
                            : clause.risk === "HIGH"
                            ? "bg-amber-500/15 text-amber-500 border border-amber-500/20"
                            : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                        }`}
                      >
                        {clause.risk}
                      </span>
                    </div>
                    <p className="text-xs font-semibold line-clamp-1">{clause.title}</p>
                    <p className="text-[11px] opacity-60 mt-1 line-clamp-1">{clause.proposed}</p>
                  </button>
                );
              })}
            </div>

            {/* AI Assistant Callout */}
            <div
              className="p-4 rounded-2xl border space-y-2"
              style={{
                backgroundColor: isDark ? "rgba(99, 102, 241, 0.05)" : "#f5f3ff",
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-500">JurisVault Copilot</span>
              </div>
              <p className="text-[11px] opacity-75 leading-relaxed">
                Counterparty legal team historically conceded consequential damage caps when offered a
                mutual 1.5x fee limitation. Recommended to send approved Playbook Form 4B.
              </p>
            </div>
          </div>

          {/* Right Column: Deep Clause Diff & Review */}
          <div className="@lg:col-span-8 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-6"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold opacity-60">{currentClause.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentClause.risk === "CRITICAL"
                          ? "bg-rose-500/15 text-rose-500"
                          : currentClause.risk === "HIGH"
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-emerald-500/15 text-emerald-500"
                      }`}
                    >
                      {currentClause.risk} RISK • Score: {currentClause.riskScore}/100
                    </span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight">{currentClause.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAcceptFallback}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--template-primary)" }}
                  >
                    Insert Fallback Clause
                  </button>
                </div>
              </div>

              {/* Side-by-Side Diff Panels */}
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                {/* Standard Playbook Clause */}
                <div
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                      Standard Company Form
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-500">Approved</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-85">{currentClause.original}</p>
                </div>

                {/* Counterparty Proposed Redline */}
                <div
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: isDark ? "rgba(244, 63, 94, 0.05)" : "#fff1f2",
                    borderColor: "rgba(244, 63, 94, 0.2)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                      Counterparty Proposed Redline
                    </span>
                    <span className="text-[10px] font-semibold text-rose-500">Deviated</span>
                  </div>
                  <p className="text-xs leading-relaxed text-rose-950 dark:text-rose-200">
                    {currentClause.proposed}
                  </p>
                </div>
              </div>

              {/* AI Risk Analysis & Legal Playbook Recommendation */}
              <div
                className="p-4 rounded-xl border space-y-3"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
                  borderColor: "var(--template-border)",
                }}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Legal Risk Impact Analysis</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed">{currentClause.riskExplanation}</p>

                <div className="pt-2 border-t flex items-start gap-2" style={{ borderColor: "var(--template-border)" }}>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold">Playbook Recommendation:</span>
                    <p className="text-xs opacity-75 mt-0.5">{currentClause.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* E-Signature Modal */}
      <AnimatePresence>
        {isSignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#0d1117" : "#ffffff",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold">Contract E-Signature & Attestation</h3>
                </div>
                <button onClick={() => setIsSignModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs opacity-70">
                Execute electronic signatures using FIPS-compliant cryptographic verification. All signers must
                complete identity verification before closing.
              </p>

              <div className="space-y-3">
                {[
                  { name: "Legal Counsel (Acme Corp)", role: "Counterparty Counsel", email: "counsel@acmecorp.com" },
                  { name: "VP Engineering (Nexore Technologies)", role: "Internal Signer", email: "vp@nexore.dev" },
                ].map((signer) => {
                  const isSigned = signedParties.includes(signer.name);
                  return (
                    <div
                      key={signer.name}
                      className="p-3 rounded-xl border flex items-center justify-between"
                      style={{
                        backgroundColor: "var(--template-surface)",
                        borderColor: "var(--template-border)",
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{signer.name}</span>
                          {isSigned && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-500">
                              Signed
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] opacity-60">{signer.role} • {signer.email}</p>
                      </div>

                      {!isSigned ? (
                        <button
                          onClick={() => handleSignContract(signer.name)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                          style={{ backgroundColor: "var(--template-primary)" }}
                        >
                          Sign Now
                        </button>
                      ) : (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsSignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: "var(--template-border)" }}
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

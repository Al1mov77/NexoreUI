"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MapPin,
  Mail,
  UserPlus,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function TalentOrbitPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [selectedDept, setSelectedDept] = useState<"ALL" | "ENG" | "PRODUCT" | "DESIGN">("ALL");
  const [isPtoModalOpen, setIsPtoModalOpen] = useState(false);
  const [approvedPtoDays, setApprovedPtoDays] = useState(18);
  const [hrToast, setHrToast] = useState<string | null>(null);

  const teamMembers = [
    {
      id: "EMP-101",
      name: "Sophia Lindqvist",
      title: "VP of Engineering",
      department: "ENG",
      location: "Stockholm (UTC+1)",
      status: "ACTIVE",
      reports: 24,
      performance: "Top Performer (9-Box: 1A)",
      avatarColor: "bg-indigo-500",
    },
    {
      id: "EMP-102",
      name: "Marcus Sterling",
      title: "Principal Distributed Systems Architect",
      department: "ENG",
      location: "San Francisco (UTC-8)",
      status: "ACTIVE",
      reports: 6,
      performance: "Core Contributor (9-Box: 2A)",
      avatarColor: "bg-blue-500",
    },
    {
      id: "EMP-103",
      name: "Amara Okonjo",
      title: "Head of Product Design & Brand",
      department: "DESIGN",
      location: "London (UTC+0)",
      status: "ON_PTO",
      reports: 8,
      performance: "High Potential Leader (9-Box: 1B)",
      avatarColor: "bg-rose-500",
    },
    {
      id: "EMP-104",
      name: "Daisuke Tanaka",
      title: "Senior Product Director",
      department: "PRODUCT",
      location: "Tokyo (UTC+9)",
      status: "ACTIVE",
      reports: 12,
      performance: "Top Performer (9-Box: 1A)",
      avatarColor: "bg-amber-500",
    },
  ];

  const filteredMembers = teamMembers.filter((m) => {
    if (selectedDept === "ALL") return true;
    return m.department === selectedDept;
  });

  const handleRequestPto = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPtoModalOpen(false);
    setApprovedPtoDays(approvedPtoDays - 4);
    setHrToast("4-Day PTO Request submitted & routed to manager for one-click signoff!");
    setTimeout(() => setHrToast(null), 3500);
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
          backgroundColor: isDark ? "rgba(12, 10, 20, 0.88)" : "rgba(255, 255, 255, 0.92)",
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
              <TemplateLogo icon={config.logoIcon || "activity"} className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">TalentOrbit HR</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(139, 92, 246, 0.12)",
                    color: "var(--template-primary)",
                  }}
                >
                  HR & People
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">
                Modern Org Architecture, Capacity Planning & 360 Performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPtoModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--template-primary)" }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Request PTO ({approvedPtoDays}d left)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {hrToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(139, 92, 246, 0.12)" : "#f5f3ff",
                borderColor: "rgba(139, 92, 246, 0.3)",
                color: "#7c3aed",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-500" />
                <span>{hrToast}</span>
              </div>
              <button onClick={() => setHrToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Workforce Summary */}
        <div className="grid grid-cols-2 @md:grid-cols-4 gap-3">
          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
            }}
          >
            <div className="text-[11px] font-semibold opacity-60">Global Headcount</div>
            <div className="text-2xl font-black mt-1">148</div>
            <div className="text-[10px] text-emerald-500 font-medium">+12 in Q3 cohort</div>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
            }}
          >
            <div className="text-[11px] font-semibold opacity-60">Active on PTO</div>
            <div className="text-2xl font-black mt-1">6</div>
            <div className="text-[10px] opacity-60 font-medium">Coverage at 96%</div>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
            }}
          >
            <div className="text-[11px] font-semibold opacity-60">eNPS Sentiment</div>
            <div className="text-2xl font-black text-violet-500 mt-1">+68</div>
            <div className="text-[10px] text-emerald-500 font-medium">Top 5% tech percentile</div>
          </div>

          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
            }}
          >
            <div className="text-[11px] font-semibold opacity-60">Global Timezones</div>
            <div className="text-2xl font-black mt-1">14</div>
            <div className="text-[10px] opacity-60 font-medium">Async-first collaboration</div>
          </div>
        </div>

        {/* Interactive Org Directory & Department Switcher */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6">
          {/* Team Tree List (7 cols) */}
          <div className="@lg:col-span-7 space-y-4">
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-5"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div>
                  <span className="text-xs font-mono opacity-60">PEOPLE DIRECTORY</span>
                  <h3 className="text-base font-bold tracking-tight">Organization Tree</h3>
                </div>

                {/* Department filter buttons */}
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg text-[10px]">
                  {(["ALL", "ENG", "PRODUCT", "DESIGN"] as const).map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`px-2 py-1 rounded font-semibold transition-all ${
                        selectedDept === dept ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-60"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl border flex flex-col @sm:flex-row @sm:items-center justify-between gap-3"
                    style={{
                      borderColor: "var(--template-border)",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${member.avatarColor} text-white font-bold flex items-center justify-center text-xs shrink-0`}>
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{member.name}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              member.status === "ACTIVE"
                                ? "bg-emerald-500/15 text-emerald-500"
                                : "bg-amber-500/15 text-amber-500"
                            }`}
                          >
                            {member.status === "ACTIVE" ? "Active" : "On PTO"}
                          </span>
                        </div>
                        <div className="text-[11px] opacity-70 mt-0.5">{member.title}</div>
                        <div className="flex items-center gap-2 text-[10px] opacity-50 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{member.location}</span>
                          <span>•</span>
                          <span>{member.reports} direct reports</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left @sm:text-right text-[11px]">
                      <span className="font-semibold block text-violet-500">{member.performance}</span>
                      <span className="text-[10px] opacity-50">Review Cycle: 2026.Q3</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Global Team PTO Coverage (5 cols) */}
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
                  PTO Calendar & Overlap Radar
                </span>
                <span className="text-xs font-mono text-emerald-500 font-bold">ZERO SPRINT CLASHES</span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { name: "Amara Okonjo", role: "Design Lead", dates: "Sep 07 - Sep 14", status: "Approved" },
                  { name: "Marcus Vance", role: "Sr. Backend", dates: "Sep 22 - Sep 28", status: "Pending Manager" },
                  { name: "Chloe Dupont", role: "Staff Frontend", dates: "Oct 02 - Oct 08", status: "Approved" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border flex items-center justify-between"
                    style={{ borderColor: "var(--template-border)" }}
                  >
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-[10px] opacity-60">{item.role} • {item.dates}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/15 text-violet-500">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* 9-Box Talent Matrix Snippet */}
              <div
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                  borderColor: "var(--template-border)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-bold">Talent Calibration Matrix</span>
                </div>
                <p className="text-[11px] opacity-75 leading-relaxed">
                  84% of engineering ICs currently calibrated in Tier 1 (Exceeding Expectations) and ready for senior promotion tracks in Q4.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* PTO Request Modal */}
      <AnimatePresence>
        {isPtoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#0e0a16" : "#ffffff",
                borderColor: "var(--template-border)",
                color: "var(--template-fg)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--template-border)" }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  <h3 className="text-sm font-bold">Submit Time-Off Request</h3>
                </div>
                <button onClick={() => setIsPtoModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRequestPto} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold block">Time-Off Category</label>
                  <select
                    className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                    style={{ borderColor: "var(--template-border)" }}
                  >
                    <option value="VACATION">Paid Annual Vacation (PTO)</option>
                    <option value="MENTAL_HEALTH">Wellness & Mental Health Day</option>
                    <option value="PARENTAL">Parental Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold block">Start Date</label>
                    <input
                      type="date"
                      defaultValue="2026-09-21"
                      className="w-full p-2 rounded-xl border bg-transparent outline-none"
                      style={{ borderColor: "var(--template-border)" }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">End Date</label>
                    <input
                      type="date"
                      defaultValue="2026-09-25"
                      className="w-full p-2 rounded-xl border bg-transparent outline-none"
                      style={{ borderColor: "var(--template-border)" }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl border flex items-center gap-2 text-emerald-500 font-semibold" style={{ borderColor: "var(--template-border)" }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Zero team coverage conflicts during this sprint window.</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPtoModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border"
                    style={{ borderColor: "var(--template-border)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{ backgroundColor: "var(--template-primary)" }}
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

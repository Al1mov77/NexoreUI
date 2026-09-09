"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Sparkles,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Globe,
  ExternalLink,
  Mic,
  Video,
  Layers,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function ConferenceEventPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [activeDay, setActiveDay] = useState<"day-1" | "day-2" | "day-3">("day-1");
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [expandedSession, setExpandedSession] = useState<string | null>("ses-1");
  const [selectedTier, setSelectedTier] = useState<"standard" | "vip" | "virtual">("vip");
  const [ticketQuantity, setTicketQuantity] = useState(2);
  const [checkoutToast, setCheckoutToast] = useState(false);

  const tracks = ["All", "AI Systems", "UI Architecture", "Distributed Cloud", "Security"];

  const sessions = [
    {
      id: "ses-1",
      day: "day-1",
      time: "09:00 - 10:15 AM",
      stage: "Keynote Main Hall",
      track: "AI Systems",
      title: "Opening Keynote: Autonomous Inference Substrates at Global Edge",
      speaker: "Dr. Elena Vance",
      role: "VP of Research, Synthetix Labs",
      synopsis:
        "An architectural deep dive into compiling dynamic reasoning graphs across 350 distributed edge points with sub-10ms time-to-first-token.",
    },
    {
      id: "ses-2",
      day: "day-1",
      time: "10:45 - 11:45 AM",
      stage: "Stage B • Architecture",
      track: "UI Architecture",
      title: "Building Deterministic Design Systems for 100M+ Users",
      speaker: "Marcus Sterling",
      role: "Design Engineering Lead, Monolith",
      synopsis:
        "Techniques for eliminating layout shift, achieving sub-pixel optical balance, and implementing resilient dark/light mode token hierarchies.",
    },
    {
      id: "ses-3",
      day: "day-1",
      time: "01:30 - 02:45 PM",
      stage: "Stage C • Cloud",
      track: "Distributed Cloud",
      title: "Zero-Downtime Microsecond State Replication with Raft & eBPF",
      speaker: "Hiroshi Tanaka",
      role: "Principal Systems Architect, HyperMesh",
      synopsis:
        "High-performance kernel-bypass networking patterns for managing multi-region database clusters under peak burst traffic.",
    },
    {
      id: "ses-4",
      day: "day-2",
      time: "09:30 - 10:45 AM",
      stage: "Keynote Main Hall",
      track: "AI Systems",
      title: "Autonomous Agent Orchestration: Memory, Tools, and Safety Boundaries",
      speaker: "Aria Thorne",
      role: "Chief Scientist, Cortex Labs",
      synopsis:
        "Practical engineering strategies for agent self-correction, sandboxed execution pipelines, and deterministic verification.",
    },
    {
      id: "ses-5",
      day: "day-3",
      time: "11:00 - 12:15 PM",
      stage: "Main Stage",
      track: "Security",
      title: "Post-Quantum Cryptography & Zero-Knowledge Verification in Production",
      speaker: "Dr. Julian Croft",
      role: "Head of Cryptography, Apex Security",
      synopsis:
        "Transitioning enterprise production environments to quantum-resistant lattice primitives without latency penalties.",
    },
  ];

  const filteredSessions = sessions.filter((s) => {
    const matchDay = s.day === activeDay;
    const matchTrack = selectedTrack === "All" || s.track === selectedTrack;
    return matchDay && matchTrack;
  });

  const speakers = [
    {
      name: "Dr. Elena Vance",
      company: "Synthetix Labs",
      topic: "Autonomous Edge Inference",
      initials: "EV",
      color: "bg-purple-600",
    },
    {
      name: "Marcus Sterling",
      company: "Studio Monolith",
      topic: "Deterministic Design Systems",
      initials: "MS",
      color: "bg-indigo-600",
    },
    {
      name: "Hiroshi Tanaka",
      company: "HyperMesh Systems",
      topic: "eBPF Kernel State Replication",
      initials: "HT",
      color: "bg-pink-600",
    },
    {
      name: "Aria Thorne",
      company: "Cortex Labs",
      topic: "Agent Pipeline Verification",
      initials: "AT",
      color: "bg-cyan-600",
    },
  ];

  const passTiers = {
    standard: { name: "Conference Pass", price: 499, perks: ["Access to all 3 stages", "Keynote recordings", "After-party access"] },
    vip: { name: "All-Access VIP", price: 999, perks: ["Reserved front-row seating", "VIP speaker lounge", "Private workshop tracks", "Gourmet catering & dinners"] },
    virtual: { name: "Global Virtual", price: 149, perks: ["4K low-latency livestreams", "Interactive chat Q&A", "Full session archive"] },
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutToast(true);
    setTimeout(() => setCheckoutToast(false), 3500);
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
      {/* Top Conference Header */}
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
            <span
              className="font-black text-sm @sm:text-base tracking-tight"
              style={{ fontFamily: "var(--template-heading-font)" }}
            >
              {config.brandName || "Vertex Summit 2027"}
            </span>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            <div
              className="hidden @sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <MapPin className="h-3 w-3 text-purple-500" />
              <span>San Francisco, CA</span>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById("tickets-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              Claim Pass
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 pt-12 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <Calendar className="h-3.5 w-3.5" />
          <span>October 14–16, 2027 • Yerba Buena Center, San Francisco & Virtual</span>
        </div>

        <h1
          className="text-3xl @sm:text-5xl @lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight"
          style={{ fontFamily: "var(--template-heading-font)" }}
        >
          The Convergence of Autonomous Systems & Spatial Architecture
        </h1>

        <p className="text-sm @sm:text-base opacity-75 max-w-2xl mx-auto leading-relaxed">
          Gathering 4,500+ systems engineers, AI researchers, and digital product leaders to shape the foundations of high-velocity software.
        </p>

        {/* Live Countdown Clock */}
        <div className="flex items-center justify-center gap-2 @sm:gap-4 pt-2">
          {[
            { val: "242", label: "Days" },
            { val: "14", label: "Hours" },
            { val: "38", label: "Minutes" },
            { val: "19", label: "Seconds" },
          ].map((item) => (
            <div
              key={item.label}
              className="px-4 py-3 rounded-2xl border min-w-[70px] @sm:min-w-[90px] text-center"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="text-xl @sm:text-3xl font-black font-mono tracking-tight">{item.val}</div>
              <div className="text-[10px] @sm:text-xs opacity-60 uppercase tracking-wider font-semibold">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Track Schedule Section */}
      <section className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-8 space-y-6">
        <div className="flex flex-col @md:flex-row @md:items-end justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--template-border)" }}>
          <div>
            <h2 className="text-xl @sm:text-2xl font-black">Interactive Conference Schedule</h2>
            <p className="text-xs opacity-65 mt-1">Select dates and filter by engineering track.</p>
          </div>

          {/* Day Switcher */}
          <div
            className="inline-flex p-1 rounded-xl border text-xs"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
            }}
          >
            {[
              { id: "day-1", label: "Day 1 (Oct 14)" },
              { id: "day-2", label: "Day 2 (Oct 15)" },
              { id: "day-3", label: "Day 3 (Oct 16)" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id as any)}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeDay === d.id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Track Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {tracks.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrack(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                selectedTrack === t
                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/40"
                  : "border-zinc-300 dark:border-zinc-700 opacity-70 hover:opacity-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          {filteredSessions.map((session) => {
            const isExpanded = expandedSession === session.id;
            return (
              <div
                key={session.id}
                className="p-4 @sm:p-5 rounded-2xl border transition-colors space-y-3"
                style={{
                  backgroundColor: "var(--template-surface)",
                  borderColor: "var(--template-border)",
                  borderRadius: "var(--template-radius)",
                }}
              >
                <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      {session.time}
                    </span>
                    <span className="text-xs font-semibold opacity-70">{session.stage}</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700 opacity-60 w-fit">
                    {session.track}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm @sm:text-base leading-snug">{session.title}</h3>
                    <div className="text-xs opacity-75 mt-1">
                      <span className="font-semibold text-foreground">{session.speaker}</span> • {session.role}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                    className="p-1.5 rounded-xl border hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
                    style={{ borderColor: "var(--template-border)" }}
                    aria-label="Toggle session synopsis"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2 border-t text-xs opacity-80 leading-relaxed"
                    style={{ borderColor: "var(--template-border)" }}
                  >
                    {session.synopsis}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Keynote Speakers Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-10 space-y-6">
        <div>
          <h2 className="text-xl @sm:text-2xl font-black">Distinguished Keynote Speakers</h2>
          <p className="text-xs opacity-65 mt-1">Leading researchers and infrastructure pioneers.</p>
        </div>

        <div className="grid grid-cols-2 @md:grid-cols-4 gap-4">
          {speakers.map((spk) => (
            <div
              key={spk.name}
              className="p-4 rounded-2xl border space-y-3 text-center"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div
                className={`w-14 h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center mx-auto shadow-md ${spk.color}`}
              >
                {spk.initials}
              </div>
              <div>
                <div className="font-bold text-xs @sm:text-sm">{spk.name}</div>
                <div className="text-[11px] opacity-60 font-semibold">{spk.company}</div>
              </div>
              <div className="text-[10px] opacity-75 font-mono border-t pt-2" style={{ borderColor: "var(--template-border)" }}>
                {spk.topic}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ticket Tiers Section */}
      <section id="tickets-section" className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-12 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black">Choose Your Summit Access</h2>
          <p className="text-xs opacity-65 mt-1">In-person seats are limited to 4,500 attendees.</p>
        </div>

        <div className="grid grid-cols-1 @md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {(["standard", "vip", "virtual"] as const).map((tierKey) => {
            const tier = passTiers[tierKey];
            const isSelected = selectedTier === tierKey;

            return (
              <div
                key={tierKey}
                onClick={() => setSelectedTier(tierKey)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all space-y-4 relative ${
                  isSelected ? "ring-2 shadow-xl" : "opacity-85 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: isSelected ? "var(--template-surface-elevated)" : "var(--template-surface)",
                  borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                  borderRadius: "var(--template-radius)",
                }}
              >
                {tierKey === "vip" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-purple-600 shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-base">{tier.name}</h3>
                  <div className="text-3xl font-black font-mono my-2">
                    ${tier.price} <span className="text-xs font-normal opacity-60">/ attendee</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs opacity-80 border-t pt-4" style={{ borderColor: "var(--template-border)" }}>
                  {tier.perks.map((perk) => (
                    <div key={perk} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-md"
                      : "border border-zinc-300 dark:border-zinc-700 opacity-75"
                  }`}
                >
                  {isSelected ? "Selected" : "Select Pass"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Checkout Calculator summary */}
        <div
          className="p-6 rounded-2xl border max-w-xl mx-auto flex flex-col @sm:flex-row items-center justify-between gap-4"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div>
            <div className="text-xs opacity-70">
              Pass: <span className="font-bold text-foreground">{passTiers[selectedTier].name}</span>
            </div>
            <div className="text-xl font-black font-mono mt-0.5">
              ${passTiers[selectedTier].price * ticketQuantity}{" "}
              <span className="text-xs font-normal opacity-60">({ticketQuantity} passes)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-xl" style={{ borderColor: "var(--template-border)" }}>
              <button
                onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                className="px-3 py-1 text-sm font-bold opacity-70 hover:opacity-100"
              >
                -
              </button>
              <span className="px-3 text-xs font-mono font-bold">{ticketQuantity}</span>
              <button
                onClick={() => setTicketQuantity(ticketQuantity + 1)}
                className="px-3 py-1 text-sm font-bold opacity-70 hover:opacity-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleCheckout}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              Register Passes
            </button>
          </div>
        </div>
      </section>

      {/* Confirmation Toast */}
      {checkoutToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Reserved {ticketQuantity} × {passTiers[selectedTier].name}! Receipt sent to email.</span>
        </div>
      )}
    </div>
  );
}

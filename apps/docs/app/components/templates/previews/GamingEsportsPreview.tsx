"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Swords,
  Flame,
  Tv,
  Users,
  Target,
  Crown,
  CheckCircle2,
  Calendar,
  X,
  ChevronRight,
  Shield,
  Zap,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function GamingEsportsPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // States
  const [selectedMatch, setSelectedMatch] = useState("grand-final");
  const [votedTeam, setVotedTeam] = useState<string | null>("Sentinels");
  const [sentinelsVotes, setSentinelsVotes] = useState(64);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [voteToast, setVoteToast] = useState<string | null>(null);

  const bracketMatches = [
    { id: "ub-semi-1", round: "Upper Semifinal", team1: "Sentinels", score1: 2, team2: "Fnatic", score2: 0, winner: "Sentinels" },
    { id: "ub-semi-2", round: "Upper Semifinal", team1: "Cloud9", score1: 2, team2: "Paper Rex", score2: 1, winner: "Cloud9" },
    { id: "ub-final", round: "Upper Final", team1: "Sentinels", score1: 2, team2: "Cloud9", score2: 1, winner: "Sentinels" },
    { id: "grand-final", round: "Grand Championship Final", team1: "Sentinels", score1: 2, team2: "Cloud9", score2: 2, winner: "LIVE MATCH" },
  ];

  const mapDraft = [
    { map: "Mirage", action: "Banned by Sentinels", tag: "Ban", status: "banned" },
    { map: "Anubis", action: "Banned by Cloud9", tag: "Ban", status: "banned" },
    { map: "Ancient", action: "Picked by Sentinels (13-9 Win)", tag: "Map 1", status: "team1" },
    { map: "Dust II", action: "Picked by Cloud9 (13-11 Win)", tag: "Map 2", status: "team2" },
    { map: "Inferno", action: "Decider Map 5 • Currently In Progress", tag: "Live", status: "live" },
  ];

  const playerComparison = [
    { metric: "Rating 2.0", p1: "1.42", p2: "1.38", p1Adv: true },
    { metric: "Damage / Round (ADR)", p1: "94.2", p2: "89.5", p1Adv: true },
    { metric: "Headshot Accuracy", p1: "58.4%", p2: "64.2%", p1Adv: false },
    { metric: "Opening Duel Wins", p1: "18 Kills", p2: "14 Kills", p1Adv: true },
    { metric: "Clutch 1vX Success", p1: "74%", p2: "62%", p1Adv: true },
  ];

  const handleVoteSubmit = (team: string) => {
    setVotedTeam(team);
    if (team === "Sentinels") setSentinelsVotes((v) => v + 1);
    setIsVoteModalOpen(false);
    setVoteToast(`Vote registered for ${team}! Community live prediction updated.`);
    setTimeout(() => setVoteToast(null), 3500);
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
              <TemplateLogo icon={config.logoIcon || "trophy"} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm @sm:text-base tracking-tight"
                  style={{ fontFamily: "var(--template-heading-font)" }}
                >
                  {config.brandName || "Valkyrie Esports"}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  BERLIN MAJOR
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden @sm:block">Championship Bracket & Real-Time Match HUD</p>
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
              <Tv className="w-3.5 h-3.5 text-rose-500" />
              <span>284,400 Stream Viewers</span>
              <span className="opacity-30">•</span>
              <span className="text-amber-400">$1,000,000 Prize Pool</span>
            </div>

            <button
              onClick={() => setIsVoteModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <Crown className="h-3.5 w-3.5" />
              <span>Vote Match MVP</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {voteToast && (
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
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{voteToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @lg:py-8 space-y-6">
        {/* Live Match Grand Finals HUD Banner */}
        <div
          className="p-6 rounded-2xl border relative overflow-hidden"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-6">
            {/* Team 1 */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-extrabold text-rose-500 text-xl shrink-0">
                SEN
              </div>
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">North America Seed 1</span>
                <h2 className="text-xl @sm:text-2xl font-extrabold tracking-tight">Sentinels</h2>
                <div className="text-xs opacity-60 font-mono mt-0.5">Full Buy: $24,800 Vault</div>
              </div>
            </div>

            {/* Match Score Display */}
            <div className="p-4 rounded-xl border text-center shrink-0 min-w-[220px]" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)", borderColor: "var(--template-border)" }}>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">
                Grand Final • Map 5 (Inferno)
              </div>
              <div className="text-4xl font-extrabold font-mono tracking-tight flex items-center justify-center gap-3">
                <span className="text-rose-500">11</span>
                <span className="opacity-30 text-2xl">:</span>
                <span className="text-cyan-400">9</span>
              </div>
              <div className="text-[11px] opacity-60 font-mono mt-1">Series Tied 2 - 2 (Best of 5)</div>
            </div>

            {/* Team 2 */}
            <div className="flex items-center gap-4 flex-1 justify-end text-right">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Europe Seed 1</span>
                <h2 className="text-xl @sm:text-2xl font-extrabold tracking-tight">Cloud9</h2>
                <div className="text-xs opacity-60 font-mono mt-0.5">Force Buy: $8,400 Vault</div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-extrabold text-cyan-400 text-xl shrink-0">
                C9
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive Tournament Bracket */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            borderRadius: "var(--template-radius)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold tracking-tight">Playoff Championship Tree</h3>
              <p className="text-xs opacity-65">Double-elimination stage bracket with match history and seeding</p>
            </div>
            <span className="text-xs font-mono opacity-70">Stage: Finals Weekend</span>
          </div>

          <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
            {bracketMatches.map((m) => {
              const isSelected = selectedMatch === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatch(m.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:border-indigo-500/40"
                  }`}
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: isSelected ? "var(--template-primary)" : "var(--template-border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3 text-[11px]">
                    <span className="opacity-60">{m.round}</span>
                    <span className="px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/10 text-amber-500 text-[10px]">
                      {m.winner}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded border" style={{ borderColor: "var(--template-border)" }}>
                      <span className="font-bold">{m.team1}</span>
                      <span className="font-bold text-sm text-indigo-400">{m.score1}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border" style={{ borderColor: "var(--template-border)" }}>
                      <span className="font-bold">{m.team2}</span>
                      <span className="font-bold text-sm text-indigo-400">{m.score2}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2 & 3: Map Veto Phase & Player Stat Comparison */}
        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
          {/* Map Veto & Pick/Ban Timeline */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Map Draft / Veto Procedure</h3>
                </div>
                <span className="text-xs font-mono opacity-70">Best of 5 Format</span>
              </div>

              <div className="space-y-3">
                {mapDraft.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border flex items-center justify-between text-xs"
                    style={{
                      backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                      borderColor: "var(--template-border)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-mono text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold">{item.map}</div>
                        <div className="text-[11px] opacity-65">{item.action}</div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === "live"
                          ? "bg-rose-500 text-white animate-pulse"
                          : item.status === "team1"
                          ? "bg-rose-500/10 text-rose-500"
                          : item.status === "team2"
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "opacity-50"
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t text-[11px] opacity-70 flex items-center justify-between" style={{ borderColor: "var(--template-border)" }}>
              <span>Overtime Rule: MR3 $10,000 Max</span>
              <span>Tactical Timeouts: 1 / 4 remaining</span>
            </div>
          </div>

          {/* Player Head-to-Head Comparison */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            style={{
              backgroundColor: "var(--template-surface)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Star Duel: TenZ vs Ax1Le</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500">
                  Duel of MVPs
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {playerComparison.map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={row.p1Adv ? "text-rose-500 font-bold" : "opacity-70"}>{row.p1}</span>
                      <span className="font-sans opacity-60 text-[11px]">{row.metric}</span>
                      <span className={!row.p1Adv ? "text-cyan-400 font-bold" : "opacity-70"}>{row.p2}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full flex overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: row.p1Adv ? "56%" : "44%" }} />
                      <div className="h-full bg-cyan-500 flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Fan Prediction Bar */}
            <div className="pt-4 mt-6 border-t" style={{ borderColor: "var(--template-border)" }}>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-rose-500">Sentinels {sentinelsVotes}%</span>
                <span className="text-cyan-400">Cloud9 {100 - sentinelsVotes}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${sentinelsVotes}%` }} />
                <div className="h-full bg-cyan-400 flex-1" />
              </div>
              <div className="text-[10px] opacity-60 text-center mt-2">Based on 14,280 community predictions</div>
            </div>
          </div>
        </div>
      </main>

      {/* Vote MVP Modal */}
      <AnimatePresence>
        {isVoteModalOpen && (
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
                onClick={() => setIsVoteModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold">Cast Major MVP Ballot</h3>
              </div>

              <div className="space-y-3 text-xs">
                <p className="opacity-75">
                  Select your vote for the Finals Most Valuable Player. Fans who accurately predict receive a limited badge.
                </p>

                <button
                  onClick={() => handleVoteSubmit("Sentinels")}
                  className="w-full p-3 rounded-xl border flex items-center justify-between hover:border-rose-500/50 transition-all"
                  style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 font-bold flex items-center justify-center">SEN</span>
                    <div className="text-left">
                      <div className="font-bold">TenZ (Tyson Ngo)</div>
                      <div className="text-[10px] opacity-60">1.42 Rating • 28 Kills Map 4</div>
                    </div>
                  </div>
                  <span className="text-rose-500 font-bold">&rarr;</span>
                </button>

                <button
                  onClick={() => handleVoteSubmit("Cloud9")}
                  className="w-full p-3 rounded-xl border flex items-center justify-between hover:border-cyan-500/50 transition-all"
                  style={{ backgroundColor: "var(--template-surface)", borderColor: "var(--template-border)" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center">C9</span>
                    <div className="text-left">
                      <div className="font-bold">Ax1Le (Sergey Rykhtorov)</div>
                      <div className="text-[10px] opacity-60">1.38 Rating • 64% Headshot</div>
                    </div>
                  </div>
                  <span className="text-cyan-400 font-bold">&rarr;</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

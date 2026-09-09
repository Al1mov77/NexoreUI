"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Award,
  Flame,
  Play,
  Check,
  ChevronRight,
  ChevronDown,
  Lock,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Bookmark,
  Share2,
  Terminal,
  Trophy,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function EdtechLearningPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  // Course outline data
  const modules = [
    {
      id: "mod-1",
      title: "Module 1: Concurrency & Threads",
      completed: true,
      lessons: [
        { id: "les-1", title: "1.1 Memory Barriers & Atomics", time: "15m", done: true },
        { id: "les-2", title: "1.2 Mutex Invariants & Deadlocks", time: "22m", done: true },
      ],
    },
    {
      id: "mod-2",
      title: "Module 2: Distributed Consensus (Raft)",
      completed: false,
      lessons: [
        { id: "les-3", title: "2.1 Leader Election Invariants", time: "18m", done: true },
        { id: "les-4", title: "2.2 Log Replication & Quorums", time: "25m", done: false, active: true },
        { id: "les-5", title: "2.3 Split Brain Mitigation", time: "20m", done: false },
      ],
    },
    {
      id: "mod-3",
      title: "Module 3: Conflict-Free Replicated Data (CRDT)",
      completed: false,
      locked: true,
      lessons: [
        { id: "les-6", title: "3.1 State-based vs Op-based CRDTs", time: "30m", done: false },
        { id: "les-7", title: "3.2 Vector Clocks & Causality", time: "25m", done: false },
      ],
    },
  ];

  // States
  const [activeLessonId, setActiveLessonId] = useState("les-4");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(1);
  const [verificationResult, setVerificationResult] = useState<"success" | "failure" | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [xpPoints, setXpPoints] = useState(4820);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(3);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (selectedAnswer === 1) {
        setVerificationResult("success");
        setXpPoints((prev) => prev + 150);
        setCompletedLessonsCount(4);
      } else {
        setVerificationResult("failure");
      }
    }, 800);
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
      {/* Academy Navigation Bar */}
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
              <TemplateLogo icon={config.logoIcon || "compass"} className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-bold text-sm @sm:text-base tracking-tight"
                style={{ fontFamily: "var(--template-heading-font)" }}
              >
                {config.brandName || "Polymath Academy"}
              </span>
              <span className="hidden @md:inline-block text-xs opacity-60 ml-2 font-mono">
                • Distributed Systems Track
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 @sm:gap-3">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            >
              <Flame className="h-3.5 w-3.5 fill-amber-500" />
              <span>14 Day Streak</span>
            </div>

            {/* XP Badge */}
            <div
              className="hidden @sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
              }}
            >
              <Trophy className="h-3.5 w-3.5 text-emerald-500" />
              <span>{xpPoints.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Learning Interface: Syllabus + Lesson Workspace */}
      <main className="w-full max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8 py-6 @sm:py-8">
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-6">
          {/* Left Column: Syllabus Outline (4 Cols) */}
          <div className="@lg:col-span-4 space-y-4">
            <div
              className="p-4 @sm:p-5 rounded-2xl border space-y-4"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-sm">Course Syllabus</h2>
                  <p className="text-xs opacity-65">Mastering Distributed Consensus</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-500">
                  {Math.round((completedLessonsCount / 7) * 100)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: "var(--template-primary)",
                    width: `${(completedLessonsCount / 7) * 100}%`,
                  }}
                />
              </div>

              {/* Modules Accordion */}
              <div className="space-y-3 pt-2">
                {modules.map((mod) => (
                  <div key={mod.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold opacity-85">
                      <div className="flex items-center gap-1.5 truncate">
                        {mod.locked ? (
                          <Lock className="h-3.5 w-3.5 opacity-50 shrink-0" />
                        ) : mod.completed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <BookOpen className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        )}
                        <span className="truncate">{mod.title}</span>
                      </div>
                    </div>

                    {!mod.locked && (
                      <div className="space-y-1 pl-4 border-l ml-1.5" style={{ borderColor: "var(--template-border)" }}>
                        {mod.lessons.map((les) => {
                          const isActive = activeLessonId === les.id;
                          return (
                            <button
                              key={les.id}
                              onClick={() => setActiveLessonId(les.id)}
                              className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                                isActive
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30"
                                  : "opacity-75 hover:opacity-100"
                              }`}
                            >
                              <span className="truncate">{les.title}</span>
                              <span className="text-[10px] font-mono opacity-60 ml-2 shrink-0">{les.time}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Badges Mini Card */}
            <div
              className="p-4 @sm:p-5 rounded-2xl border space-y-3"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <h3 className="font-bold text-xs flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Earned Mastery Badges</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className="p-2.5 rounded-xl border text-center space-y-1"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto font-bold text-xs">
                    ⚡
                  </div>
                  <div className="font-bold text-[11px]">Concurrency Pro</div>
                  <div className="text-[9px] opacity-60 font-mono">Completed Mod 1</div>
                </div>

                <div
                  className="p-2.5 rounded-xl border text-center space-y-1"
                  style={{
                    backgroundColor: "var(--template-surface-elevated)",
                    borderColor: "var(--template-border)",
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto font-bold text-xs">
                    🛡
                  </div>
                  <div className="font-bold text-[11px]">Quorum Guard</div>
                  <div className="text-[9px] opacity-60 font-mono">100% Quiz Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Lesson Player & Verification Sandbox (8 Cols) */}
          <div className="@lg:col-span-8 space-y-6">
            <div
              className="p-6 @sm:p-8 rounded-2xl border space-y-6"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              {/* Lesson Header */}
              <div className="border-b pb-4 space-y-2" style={{ borderColor: "var(--template-border)" }}>
                <div className="flex items-center gap-2 text-xs font-mono opacity-60">
                  <span>Module 2 • Lesson 2.2</span>
                  <span>•</span>
                  <span>Estimated: 25 mins</span>
                </div>
                <h1 className="text-xl @sm:text-2xl font-extrabold tracking-tight">
                  Log Replication & Quorum Commit Invariants
                </h1>
                <p className="text-xs @sm:text-sm opacity-75 leading-relaxed">
                  In the Raft protocol, once a Leader is elected, it manages client state transitions via an append-only log replicated across cluster nodes.
                </p>
              </div>

              {/* Theory Concept Callout Block */}
              <div
                className="p-4 rounded-xl border space-y-2 text-xs leading-relaxed"
                style={{
                  backgroundColor: "var(--template-surface-elevated)",
                  borderColor: "var(--template-border)",
                }}
              >
                <div className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Lightbulb className="h-4 w-4" />
                  <span>The Fundamental Quorum Invariant</span>
                </div>
                <p className="opacity-80">
                  For a 5-node cluster (Nodes A, B, C, D, E), an entry is committed safely only when written to a majority (at least 3 nodes). What happens if network partition isolates 2 nodes?
                </p>
              </div>

              {/* Interactive Code Exercise Sandbox */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <Code2 className="h-4 w-4 text-emerald-500" />
                    <span>Challenge Question: Select the Invariant Rule</span>
                  </span>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>{showHint ? "Hide Hint" : "Need Hint?"}</span>
                  </button>
                </div>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-xl border bg-amber-500/10 border-amber-500/20 text-xs text-amber-700 dark:text-amber-300"
                  >
                    Hint: A leader cannot commit an entry from an earlier term solely by counting replicas. Review Section 5.4.2 of Ongaro & Ousterhout.
                  </motion.div>
                )}

                {/* Multiple Choice Answers */}
                <div className="space-y-2.5">
                  {[
                    "A partitioned minority of 2 nodes can commit writes independently to optimize latency.",
                    "The Leader requires a majority quorum (3 of 5 nodes) before returning an acknowledgment to the client.",
                    "Any follower node can commit entries without communicating with the current Term Leader.",
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-3 ${
                        selectedAnswer === idx
                          ? "border-emerald-500 bg-emerald-500/10 font-bold"
                          : "hover:border-zinc-400 opacity-80"
                      }`}
                      style={{
                        backgroundColor: selectedAnswer === idx ? undefined : "var(--template-surface-elevated)",
                        borderColor: selectedAnswer === idx ? undefined : "var(--template-border)",
                      }}
                    >
                      <span className="w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[11px] shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  ))}
                </div>

                {/* Verification Result Feedback */}
                {verificationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border text-xs space-y-1 ${
                      verificationResult === "success"
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                        : "bg-rose-500/15 border-rose-500/30 text-rose-800 dark:text-rose-300"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {verificationResult === "success" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Correct Solution! +150 XP Awarded</span>
                        </>
                      ) : (
                        <span>Incorrect Invariant. Review quorum overlap definitions.</span>
                      )}
                    </div>
                    {verificationResult === "success" && (
                      <p className="opacity-90 leading-relaxed">
                        Excellent! By requiring majority quorum consensus (⌊N/2⌋ + 1), any two quorums must intersect in at least one node, guaranteeing linearizability.
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Submit Action Button */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs opacity-60">Reward: 150 XP • Skill: Raft Consensus</span>
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying || selectedAnswer === null}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm flex items-center gap-2 transition-transform active:scale-95"
                    style={{
                      backgroundColor: "var(--template-primary)",
                      borderRadius: "var(--template-radius)",
                    }}
                  >
                    {isVerifying ? (
                      <span>Validating Invariants...</span>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Run & Verify Solution</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Contribution Calendar Heatmap */}
            <div
              className="p-5 @sm:p-6 rounded-2xl border space-y-3"
              style={{
                backgroundColor: "var(--template-surface)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">2026 Learning Activity Stream</span>
                <span className="opacity-60 font-mono">148 lessons completed this year</span>
              </div>

              {/* Heatmap Grid */}
              <div className="grid grid-cols-12 @sm:grid-cols-24 gap-1 pt-2">
                {Array.from({ length: 48 }).map((_, i) => {
                  const intensity = (i * 7) % 5;
                  const bg =
                    intensity === 0
                      ? "opacity-15 bg-zinc-400"
                      : intensity === 1
                      ? "bg-emerald-500/30"
                      : intensity === 2
                      ? "bg-emerald-500/60"
                      : "bg-emerald-500";
                  return (
                    <div
                      key={i}
                      className={`h-3.5 rounded-sm ${bg} transition-colors hover:scale-110`}
                      title={`Day ${i + 1}: ${intensity * 3} exercises`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

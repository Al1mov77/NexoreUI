"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Copy,
  Check,
  Zap,
  Users,
  Clock,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";
import { TemplateLogo } from "../TemplateLogo";

export function StartupWaitlistPreview() {
  const { config } = useTemplateCustomizer();
  const isDark = config.theme === "dark";

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queueNumber, setQueueNumber] = useState(142);
  const [copiedLink, setCopiedLink] = useState(false);

  // Simulated countdown
  const [timeLeft, setTimeLeft] = useState({ days: 18, hours: 9, mins: 42, secs: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setQueueNumber(Math.floor(Math.random() * 80) + 110);
    setIsSubmitted(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://genesis.stealth.dev/invite?ref=dev_${queueNumber}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className="@container w-full min-h-screen transition-colors relative flex flex-col justify-between font-sans text-center"
      style={{
        backgroundColor: "var(--template-bg)",
        color: "var(--template-fg)",
        fontFamily: "var(--template-font)",
      }}
    >
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-4 @sm:px-6 @lg:px-8 h-16 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all shrink-0"
            style={{
              backgroundColor: "var(--template-primary)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <TemplateLogo icon={config.logoIcon || "sparkles"} className="h-4 w-4" />
          </div>
          <span
            className="font-bold text-sm @sm:text-base tracking-tight"
            style={{ fontFamily: "var(--template-heading-font)" }}
          >
            {config.brandName || "Genesis Stealth"}
          </span>
        </div>

        <span
          className="text-xs font-mono px-3 py-1.5 rounded-full border transition-colors"
          style={{
            backgroundColor: "var(--template-surface)",
            borderColor: "var(--template-border)",
            color: "var(--template-fg-muted)",
          }}
        >
          ALLOCATION #GNX-09
        </span>
      </header>

      {/* Main Suspense Hero */}
      <main className="px-4 @sm:px-6 max-w-3xl mx-auto my-auto py-10 @sm:py-16 w-full">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono mb-6 transition-colors"
          style={{
            backgroundColor: "var(--template-surface-muted)",
            borderColor: "var(--template-border)",
            color: "var(--template-primary)",
          }}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Private Alpha Unlocks In:</span>
        </div>

        {/* Countdown Timer Block (Responsive single-row) */}
        <div className="flex items-center justify-center gap-2.5 @sm:gap-4 mb-8 font-mono">
          {[
            { label: "DAYS", val: timeLeft.days },
            { label: "HOURS", val: timeLeft.hours },
            { label: "MINS", val: timeLeft.mins },
            { label: "SECS", val: timeLeft.secs },
          ].map((t, idx) => (
            <div
              key={idx}
              className="p-3 @sm:p-5 rounded-2xl border min-w-[64px] @sm:min-w-[84px] transition-all"
              style={{
                backgroundColor: "var(--template-surface-elevated)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
                boxShadow: "var(--template-card-shadow)",
              }}
            >
              <span className="text-2xl @sm:text-4xl font-bold tracking-tight">
                {String(t.val).padStart(2, "0")}
              </span>
              <p className="text-xs mt-1 font-mono uppercase" style={{ color: "var(--template-fg-muted)" }}>
                {t.label}
              </p>
            </div>
          ))}
        </div>

        <h1
          className="text-2xl @xs:text-3xl @sm:text-4xl @lg:text-5xl font-bold tracking-tight mb-4 leading-[1.15]"
          style={{ fontFamily: "var(--template-heading-font)" }}
        >
          The Next Paradigm in Autonomous Compute.
        </h1>

        <p
          className="text-sm @sm:text-base max-w-xl mx-auto mb-8 leading-relaxed"
          style={{ color: "var(--template-fg-muted)" }}
        >
          We are building the fundamental runtime substrate for hyper-scale autonomous agents. Request early access
          to secure your dedicated compute quota.
        </p>

        {/* Email Capture Form or Queue Position */}
        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-2 rounded-2xl border flex flex-col @sm:flex-row gap-2 shadow-lg transition-all"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-border)",
              borderRadius: "var(--template-radius)",
              boxShadow: "var(--template-card-shadow-elevated)",
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email..."
              className="flex-1 bg-transparent px-4 py-2.5 text-xs @sm:text-sm focus:outline-none"
              style={{ color: "var(--template-fg)" }}
            />
            <button
              type="submit"
              className="h-11 px-5 rounded-xl text-xs @sm:text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 flex items-center justify-center gap-2 shrink-0"
              style={{
                backgroundColor: "var(--template-primary)",
                borderRadius: "calc(var(--template-radius) - 3px)",
              }}
            >
              <span>Request Quota</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md mx-auto p-6 rounded-2xl border space-y-4 shadow-xl transition-all"
            style={{
              backgroundColor: "var(--template-surface-elevated)",
              borderColor: "var(--template-primary)",
              borderRadius: "var(--template-radius)",
            }}
          >
            <div className="flex items-center justify-center gap-2 text-emerald-500 text-xs @sm:text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>You are officially in the alpha queue</span>
            </div>

            <div>
              <p className="text-4xl @sm:text-5xl font-bold font-mono" style={{ color: "var(--template-primary)" }}>
                #{queueNumber}
              </p>
              <p className="text-xs @sm:text-sm mt-1" style={{ color: "var(--template-fg-muted)" }}>
                Share your invite link to advance your priority
              </p>
            </div>

            <div
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-mono"
              style={{
                backgroundColor: "var(--template-surface-muted)",
                borderColor: "var(--template-border)",
                borderRadius: "var(--template-radius)",
              }}
            >
              <span className="truncate opacity-80 max-w-[240px]">genesis.stealth.dev/ref={queueNumber}</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1.5 rounded hover:opacity-75 transition-opacity shrink-0"
                aria-label="Copy invitation link"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 opacity-70" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* Live Signups Ticker */}
        <div
          className="mt-8 flex items-center justify-center gap-2 text-xs @sm:text-sm font-mono"
          style={{ color: "var(--template-fg-muted)" }}
        >
          <Users className="h-4 w-4" />
          <span>4,892 verified engineers queued across 42 countries</span>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-8 px-4 border-t text-center text-xs @sm:text-sm shrink-0"
        style={{
          borderColor: "var(--template-border)",
          color: "var(--template-fg-muted)",
        }}
      >
        <p>© {new Date().getFullYear()} {config.brandName || "Genesis Stealth"}. Non-disclosure terms apply.</p>
      </footer>
    </div>
  );
}

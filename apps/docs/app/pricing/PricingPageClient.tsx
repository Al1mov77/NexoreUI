"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, ArrowRight, X } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface ComparisonRow {
  feature: string;
  category: string;
  free: string | boolean;
  pro: string | boolean;
}

const FAQ_ITEMS: readonly FAQItem[] = [
  {
    question: "What is included with the Lifetime Pro access?",
    answer: "Permanent access to all 30+ production templates with full source code (Next.js 15, React 19, Tailwind CSS v4, Framer Motion), CLI template scaffolding (npx nexoreui add <template>), visual canvas code exports in Nexore Make, workspace management, 2 transferable developer invite links, and all future templates and components added to NexoreUI."
  },
  {
    question: "What team and workspace management features are included?",
    answer: "Pro includes an account workspace where you can generate and track 2 permanent colleague invite links, reassign unredeemed tokens, manage CLI authorization keys, and configure access for client and production repositories."
  },
  {
    question: "How do the 2 developer team invite links work?",
    answer: "Your workspace generates 2 unique invite links. You can share them with two teammates. Once activated, both developers receive their own account with full Pro access. Invited accounts cannot re-generate invite links."
  },
  {
    question: "What is the difference between Nexore Make Free and Pro exports?",
    answer: "In the free tier, Nexore Make allows 5 to 10 visual canvas code exports per session. NexoreUI Pro provides full code exports (TSX, JSX, Tailwind styles, and responsive CSS) without session caps."
  },
  {
    question: "Can I use the templates and code for commercial client work?",
    answer: "Yes. NexoreUI Pro includes a commercial license. You can build, deploy, and host client projects, SaaS web applications, internal dashboards, and commercial digital products without attribution."
  },
  {
    question: "Will I have to pay for future updates or templates?",
    answer: "No. Every template release and new component added to NexoreUI is unlocked for your account with no recurring monthly or annual subscription fees. The current price is $39 as an introductory offer. Regular price is $79 and will increase as more templates join the suite."
  },
  {
    question: "What is the delivery method and refund policy?",
    answer: "Delivery is digital: license tokens, CLI credentials, and workspace access are provided on screen upon payment completion and sent via email. Because NexoreUI Pro provides uncompiled downloadable source code, sales of digital goods are final. For technical questions or setup help, email support at nexoreuiteam@mail.ru."
  }
] as const;

const COMPARISON_DATA: readonly ComparisonRow[] = [
  { feature: "Base UI components (60+)", category: "Components", free: true, pro: true },
  { feature: "Tailwind CSS v4 and motion primitives", category: "Components", free: true, pro: true },
  { feature: "CLI single-component installer", category: "Components", free: true, pro: true },
  { feature: "Interactive node graph and forms", category: "Components", free: true, pro: true },
  { feature: "Flagship production templates (30+)", category: "Templates", free: "Preview only", pro: "Full source code" },
  { feature: "CLI full template scaffold command", category: "Templates", free: false, pro: true },
  { feature: "Nexore Make canvas code exports", category: "Visual Builder", free: "5-10 per session", pro: "Unlimited" },
  { feature: "Nexore Make canvas templates", category: "Visual Builder", free: false, pro: true },
  { feature: "Workspace dashboard and seats", category: "Licensing & Team", free: false, pro: true },
  { feature: "Colleague developer seats", category: "Licensing & Team", free: false, pro: "2 permanent seats" },
  { feature: "License key and CLI token controls", category: "Licensing & Team", free: false, pro: true },
  { feature: "Future updates and new templates", category: "Licensing & Team", free: "Core only", pro: "Lifetime included" },
  { feature: "Commercial client and SaaS license", category: "Licensing & Team", free: true, pro: true }
] as const;

const COMPARISON_CATEGORIES = [
  "Components",
  "Templates",
  "Visual Builder",
  "Licensing & Team"
] as const;

export function PricingPageClient() {
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [currentUser, setCurrentUser] = useState<{ email: string; name?: string } | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated && json.user) {
            setCurrentUser(json.user);
            setCheckoutEmail(json.user.email);
          }
        }
      } catch {
        // Fallback
      }
    }

    checkAuth();

    const checkoutParam = searchParams.get("checkout");
    if (checkoutParam === "open" || checkoutParam === "true") {
      setCheckoutOpen(true);
    }
  }, [searchParams]);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleStartCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const emailToUse = currentUser?.email || checkoutEmail;

    if (!emailToUse || !emailToUse.includes("@")) {
      setCheckoutError("Please confirm your developer Google account first.");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse }),
      });

      const json = await res.json();
      if (!res.ok) {
        setCheckoutError(json.error || "Unable to initiate payment.");
      } else if (json.checkoutUrl) {
        window.location.href = json.checkoutUrl;
      }
    } catch {
      setCheckoutError("Network error. Please try again or reach out to support.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground overflow-x-clip py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-20">
        <header className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground text-balance">
            Pricing and commercial license
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground text-balance">
            Choose between the open-source component library and the Pro lifetime license for complete source code, 30+ production templates, and team seats.
          </p>
        </header>

        <section aria-label="Pricing plans" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <article className="rounded-lg border border-border bg-card p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Community</div>
                <h2 className="text-xl font-semibold text-foreground">Free Tier</h2>
                <p className="text-sm text-muted-foreground">
                  Core UI primitives and documentation for individual developers and small projects.
                </p>
              </div>

              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">$0</span>
                <span className="text-xs text-muted-foreground">/ free forever</span>
              </div>

              <div className="h-px w-full bg-border" />

              <div className="space-y-3">
                <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Included:</div>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>60+ core UI components</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>Tailwind CSS v4 and Framer Motion primitives</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>CLI single-component installer</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>Light and dark theme token synchronization</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>5-10 code exports per session in Nexore Make</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>MIT License for personal and commercial usage</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/docs/components"
                className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background hover:bg-muted text-foreground text-sm font-medium transition-colors"
              >
                <span>Browse components</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>

          <article className="rounded-lg border border-foreground/30 bg-card p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Commercial License</div>
                <h2 className="text-xl font-semibold text-foreground">Pro Lifetime</h2>
                <p className="text-sm text-muted-foreground">
                  Full source code access to all 30+ production templates, CLI scaffolding, unlimited visual builder exports, and 2 developer seats.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">$39</span>
                  <span className="text-sm text-muted-foreground line-through tabular-nums">$79</span>
                  <span className="text-xs text-muted-foreground">/ one-time</span>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  Launch price. Regular price is $79 as new templates are added.
                </p>
              </div>

              <div className="h-px w-full bg-border" />

              <div className="space-y-3">
                <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Everything in Free, plus:</div>
                <ul className="space-y-2.5 text-sm text-foreground">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>All 30+ production templates with full source code</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>CLI template generator (npx nexoreui add &lt;template&gt;)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>Unlimited visual canvas exports in Nexore Make</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>2 permanent developer seats for team members</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>Workspace management for license keys and invite links</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>Perpetual commercial license for client projects and SaaS</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                    <span>All future template releases and updates included</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setCheckoutOpen(true);
                  setCheckoutError(null);
                }}
                className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium transition-opacity cursor-pointer"
              >
                <span>Get Pro license</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                <span>Already purchased or invited?</span>
                <a href="/api/auth/google" className="text-foreground hover:underline font-semibold">
                  Sign in with Google
                </a>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground text-center">
                One-time payment. Instant access to license keys and source code.
              </p>
            </div>
          </article>
        </section>

        <section aria-label="Feature comparison" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Plan comparison</h2>
            <p className="text-sm text-muted-foreground">
              Detailed feature breakdown between Community and Pro tiers.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-medium">Capability</th>
                    <th className="py-3 px-4 font-medium">Community (Free)</th>
                    <th className="py-3 px-4 font-medium text-foreground">Pro Lifetime ($39)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {COMPARISON_CATEGORIES.map((category) => {
                    const rows = COMPARISON_DATA.filter((r) => r.category === category);
                    return (
                      <React.Fragment key={category}>
                        <tr className="bg-muted/40">
                          <td colSpan={3} className="py-2 px-4 font-mono text-xs uppercase tracking-wider text-muted-foreground font-medium">
                            {category}
                          </td>
                        </tr>
                        {rows.map((row) => (
                          <tr key={row.feature} className="hover:bg-muted/20 transition-colors">
                            <td className="py-3 px-4 text-foreground font-medium">
                              {row.feature}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {typeof row.free === "boolean" ? (
                                row.free ? (
                                  <Check className="w-4 h-4 text-foreground" />
                                ) : (
                                  <span className="text-muted-foreground/40 font-mono">-</span>
                                )
                              ) : (
                                <span>{row.free}</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-foreground font-medium">
                              {typeof row.pro === "boolean" ? (
                                row.pro ? (
                                  <Check className="w-4 h-4 text-foreground" />
                                ) : (
                                  <span className="text-muted-foreground/40 font-mono">-</span>
                                )
                              ) : (
                                <span>{row.pro}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section aria-label="Purchase terms" className="rounded-lg border border-border bg-card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Digital delivery
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                License tokens, CLI credentials, and workspace access are delivered immediately on screen upon payment completion and sent to your email.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Commercial rights
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Perpetual, royalty-free commercial license for unlimited client projects, SaaS products, and internal tools. Because access grants downloadable source code, sales are final.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Direct support
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Assistance directly from the engineers who built the system. Contact us at nexoreuiteam@mail.ru for setup and integration questions.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Support:</span>
              <a href="mailto:nexoreuiteam@mail.ru" className="font-mono text-foreground hover:underline">
                nexoreuiteam@mail.ru
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/workspace" className="hover:text-foreground transition-colors underline underline-offset-4">
                Workspace
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors underline underline-offset-4">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors underline underline-offset-4">
                Privacy Policy
              </Link>
            </div>
          </div>
        </section>

        <section aria-label="Frequently asked questions" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Common questions regarding licensing, team seats, updates, and templates.
            </p>
          </div>

          <div className="divide-y divide-border rounded-lg border border-border bg-card overflow-hidden">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="p-4 sm:p-5">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between gap-4 text-left font-medium text-sm sm:text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.2,
                          ease: "easeOut"
                        }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 text-sm text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
              onClick={() => setCheckoutOpen(false)}
              className="absolute inset-0 bg-black/60"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: "easeOut" }}
              className="relative w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-md space-y-4 z-10"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Order Checkout</div>
                  <h3 className="text-lg font-semibold text-foreground">NexoreUI Pro Lifetime</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-md border border-border bg-muted/40 space-y-1 text-xs">
                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="text-sm font-semibold text-foreground">$39 USD</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Includes all 30+ production templates, unlimited visual builder exports, and 2 developer seats.
                </p>
              </div>

              {!currentUser ? (
                /* Step 1: Confirm Google Account */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Step 1 of 2 · Account Verification
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      Confirm your Google account
                    </h3>
                    <p className="text-xs text-muted-foreground leading-normal">
                      To prevent lost keys and unauthorized sharing, your Pro lifetime license and 2 team seats are tied directly to your Google account.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-md border border-border bg-muted/30 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span className="font-semibold text-foreground">Pro Lifetime</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-semibold text-foreground">$39 USD</span>
                    </div>
                  </div>

                  <a
                    href="/api/auth/google?returnTo=/pricing?checkout=open"
                    className="w-full h-10 inline-flex items-center justify-center gap-2.5 rounded-md bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Continue with Google to Purchase</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setCheckoutOpen(false)}
                      className="h-8 px-3 rounded-md border border-border text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Payment */
                <form onSubmit={handleStartCheckout} className="space-y-4">
                  <div className="space-y-1">
                    <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Step 2 of 2 · Payment
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      Complete your Pro purchase
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-md border border-border bg-muted/40 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Account:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">{currentUser.email}</span>
                        <a
                          href="/api/auth/google?returnTo=/pricing?checkout=open"
                          className="text-[11px] text-muted-foreground hover:text-foreground underline"
                        >
                          switch
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-semibold text-foreground">$39 USD</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Seats:</span>
                      <span className="text-foreground">3 (1 Developer + 2 Teammates)</span>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="p-2.5 rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-xs">
                      {checkoutError}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutOpen(false)}
                      className="h-9 px-3.5 rounded-md border border-border text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={checkoutLoading}
                      className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      {checkoutLoading ? "Preparing..." : "Proceed to payment ($39)"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              <div className="pt-2 border-t border-border text-[11px] text-center text-muted-foreground font-mono">
                Instant digital delivery upon payment confirmation.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

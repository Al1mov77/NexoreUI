"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Clock, ShieldCheck, HelpCircle, FileText, Terminal, ArrowUpRight } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-border bg-muted/40 font-mono text-[11px] text-muted-foreground">
              <span>Customer Help & Engineering Desk</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Support & Contact
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Official assistance directly from core library engineers. We assist with license activations, CLI setup, and component integrations.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-foreground/90 text-sm leading-relaxed">
          {/* Support Email Card */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-5 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-foreground text-background">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Direct Engineering Channel</h2>
                  <p className="text-xs text-muted-foreground">For license retrieval, enterprise inquiries, and template integration</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border border-border bg-muted/50 text-muted-foreground">
                24/7 Monitored
              </span>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Official Support Inbox</div>
                <a
                  href="mailto:nexoreuiteam@mail.ru"
                  className="text-base font-mono font-semibold text-foreground hover:underline select-all"
                >
                  nexoreuiteam@mail.ru
                </a>
              </div>
              <a
                href="mailto:nexoreuiteam@mail.ru"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Compose Email</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground p-3 rounded-lg border border-border/60 bg-background/50">
                <Clock className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground font-medium">Turnaround Time:</strong> Typical reply within 12–24 hours, 7 days a week.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground p-3 rounded-lg border border-border/60 bg-background/50">
                <ShieldCheck className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground font-medium">Core Engineers:</strong> You interact directly with the template authors.
                </span>
              </div>
            </div>
          </section>

          {/* Scope of Support */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
              What We Help You With
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 space-y-1">
                <div className="font-semibold text-foreground">License Activation & Recovery</div>
                <p className="text-muted-foreground leading-normal">
                  Immediate re-issue of lost license keys, team seat invitations, or hardware device registration resets.
                </p>
              </div>
              <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 space-y-1">
                <div className="font-semibold text-foreground">CLI Scaffolding Help</div>
                <p className="text-muted-foreground leading-normal">
                  Troubleshooting <code className="font-mono text-foreground bg-muted px-1 py-0.5 rounded">npx nexoreui add</code> command execution in custom Next.js configurations.
                </p>
              </div>
              <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 space-y-1">
                <div className="font-semibold text-foreground">React 19 & Tailwind v4</div>
                <p className="text-muted-foreground leading-normal">
                  Assistance with build tool compatibility, server actions, Framer Motion motion budgets, and CSS tokens.
                </p>
              </div>
              <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 space-y-1">
                <div className="font-semibold text-foreground">Commercial Invoicing</div>
                <p className="text-muted-foreground leading-normal">
                  Official VAT-compliant payment receipts, company billing information updates, and corporate licensing.
                </p>
              </div>
            </div>
          </section>

          {/* Quick Legal Links */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Related Documents & Policies
            </h3>
            <div className="flex flex-wrap gap-4 text-xs font-mono">
              <Link href="/terms" className="text-foreground hover:underline inline-flex items-center gap-1 font-medium">
                Terms of Service & Public Offer <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
              </Link>
              <Link href="/pricing" className="text-foreground hover:underline inline-flex items-center gap-1 font-medium">
                Pricing & License Tiers <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
              </Link>
              <Link href="/privacy" className="text-foreground hover:underline inline-flex items-center gap-1 font-medium">
                Privacy Policy <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

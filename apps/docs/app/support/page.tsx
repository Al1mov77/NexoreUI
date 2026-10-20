"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Clock, ShieldCheck, HelpCircle, FileText } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
          Customer Support & Contact
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">
          NexoreUI Core Engineering & Merchant Help Center
        </p>

        <div className="space-y-6 text-foreground/90 text-sm leading-relaxed">
          {/* Support Email Card */}
          <section className="rounded-xl border border-border/70 bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Direct Support Channel</h2>
                <p className="text-xs text-muted-foreground">For license activation, order inquiries, and technical help</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Official Support Email</div>
                <a
                  href="mailto:nexoreuiteam@mail.ru"
                  className="text-base font-mono font-medium text-foreground hover:underline"
                >
                  nexoreuiteam@mail.ru
                </a>
              </div>
              <a
                href="mailto:nexoreuiteam@mail.ru"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
              >
                Send Email
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <Clock className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">Response Time:</strong> Inquiries are processed within 12–24 hours, 7 days a week.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">Engineering Assistance:</strong> Direct assistance from core library developers.
                </span>
              </div>
            </div>
          </section>

          {/* Scope of Support */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
              What We Can Help You With
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground leading-normal">
              <li><strong>License Key Retrieval & Activation:</strong> Instant re-issuance if confirmation emails were delayed or lost.</li>
              <li><strong>CLI Authorization & Tokens:</strong> Assistance configuring <code className="font-mono text-foreground">npx nexoreui auth &lt;key&gt;</code> in CI/CD or local terminals.</li>
              <li><strong>Template Code Integration:</strong> Guidance on React 19, Next.js 15, and Tailwind CSS v4 setup.</li>
              <li><strong>Billing & Invoicing:</strong> Order receipts, transaction confirmations, and commercial license documentation.</li>
            </ul>
          </section>

          {/* Quick Legal Links */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Related Policies & Documentation
            </h3>
            <div className="flex flex-wrap gap-4 text-xs">
              <Link href="/terms" className="text-primary hover:underline font-medium">
                Terms of Service & Public Offer →
              </Link>
              <Link href="/pricing" className="text-primary hover:underline font-medium">
                Pricing & License Tiers →
              </Link>
              <Link href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

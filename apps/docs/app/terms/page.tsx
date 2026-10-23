"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";

export default function TermsOfServicePage() {
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
              <span>Public Commercial Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Terms of Service & Public Offer
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: October 2026 • Effective worldwide
            </p>
          </div>
        </div>
        
        <div className="space-y-8 text-foreground/90 text-sm leading-relaxed">
          <section className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="w-4 h-4 text-foreground" />
              <span className="font-mono text-xs uppercase tracking-wider">Service Summary & Verification</span>
            </div>
            <p className="text-muted-foreground text-xs leading-normal">
              NexoreUI delivers digital developer software assets, production Next.js templates, uncompiled TypeScript source packages, and visual canvas tools.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground border-b border-border/70 pb-2">
              1. Subject of the Agreement
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              This document constitutes a binding public offer and agreement between NexoreUI (&quot;Service&quot;, &quot;we&quot;, &quot;us&quot;) and the customer (&quot;User&quot;, &quot;you&quot;). 
              By completing a payment for NexoreUI Pro or using website assets, you agree to comply with and be bound by these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground border-b border-border/70 pb-2">
              2. Description of Digital Products & Pricing
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              NexoreUI provides digital licenses for developer templates and tools:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Free Community Tier:</strong> Open-source components provided free of charge under the standard MIT license.
              </li>
              <li>
                <strong className="text-foreground">NexoreUI Pro Lifetime Access:</strong> One-time fee of $39 (standard regular price $79). Includes full source code for 30+ PRO templates, CLI generator access, unlimited code exports in Nexore Make, workspace management, two permanent developer invite links, and all future updates.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground border-b border-border/70 pb-2">
              3. Delivery Terms & Order Fulfillment
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              All items provided by NexoreUI are <strong className="text-foreground">strictly digital goods</strong>. Delivery is instantaneous:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>Upon successful transaction confirmation via our payment processor, digital access keys, license tokens, and download access are granted immediately on screen.</li>
              <li>A digital confirmation receipt and access credentials are dispatched to your provided email address within minutes.</li>
              <li>No physical shipment or freight delivery is required.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground border-b border-border/70 pb-2">
              4. Refund & Cancellation Policy
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Due to the immediate digital fulfillment and uncompiled source code access provided with NexoreUI Pro:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><strong className="text-foreground">All sales are final.</strong> Because digital code assets, repository access, and license credentials cannot be revoked or returned once downloaded, purchases are non-refundable.</li>
              <li>In accordance with statutory consumer protection standards for digital goods (including EU Directive 2011/83/EU Article 16(m)), you acknowledge and agree that digital delivery commences immediately upon transaction completion, waiving statutory withdrawal rights.</li>
              <li><strong className="text-foreground">Engineering Assistance:</strong> If you encounter code compilation errors or discrepancies with documented component behavior, our core team assists directly with code remediation. Contact us at <span className="font-mono text-foreground font-semibold">nexoreuiteam@mail.ru</span>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground border-b border-border/70 pb-2">
              5. Commercial License & Intellectual Property
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Purchasing NexoreUI Pro grants you a perpetual, worldwide, non-exclusive commercial license to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>Use the source code in unlimited personal, SaaS, client, and commercial projects.</li>
              <li>Modify, adapt, and build applications on top of the templates without paying royalties.</li>
              <li>Share permanent access with up to 2 direct team colleagues using your unique account invite tokens.</li>
              <li><strong className="text-foreground">Restrictions:</strong> You may not redistribute, resell, or publish the raw standalone source code bundles as a competing template pack or UI theme marketplace item.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-mono uppercase tracking-wider">6. Customer Support & Inquiries</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our engineering team is available 24/7 to assist with license activation, installation issues, and billing inquiries:
            </p>
            <div className="p-3.5 rounded-lg border border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono text-muted-foreground">Engineering Support Email</div>
                <a href="mailto:nexoreuiteam@mail.ru" className="text-sm font-mono font-semibold text-foreground hover:underline">
                  nexoreuiteam@mail.ru
                </a>
              </div>
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Support Center</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

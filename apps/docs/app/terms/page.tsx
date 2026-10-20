"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail } from "lucide-react";

export default function TermsOfServicePage() {
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
        
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">Terms of Service & Public Offer</h1>
        <p className="text-muted-foreground mb-8 text-sm">Last updated: October 2026</p>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground/90 text-sm leading-relaxed">
          <section className="rounded-xl border border-border/70 bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Service Summary & Verification</span>
            </div>
            <p className="text-muted-foreground text-xs leading-normal">
              NexoreUI provides digital developer software assets, production website templates, UI component code libraries, and visual canvas export tooling.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground">1. Subject of the Agreement</h2>
            <p>
              This document constitutes a public offer and agreement between NexoreUI ("Service", "we", "us") and the customer ("User", "you"). 
              By completing a payment for NexoreUI Pro or using the website services, you agree to comply with and be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground">2. Description of Digital Products & Pricing</h2>
            <p>
              NexoreUI offers digital licenses for developer templates and tools:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-muted-foreground">
              <li><strong>Free Community Tier:</strong> Open-source components provided free of charge under the MIT license.</li>
              <li><strong>NexoreUI Pro Lifetime Access:</strong> Introductory one-time fee of $39 (standard regular price $79). Includes full source code for 30+ PRO templates, CLI generator access, unlimited code exports in Nexore Make, team & workspace management, two permanent developer invite links, and all future updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground">3. Delivery Terms & Order Fulfillment</h2>
            <p>
              All products sold on NexoreUI are <strong>strictly digital goods</strong>. Delivery is instantaneous:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-muted-foreground">
              <li>Upon successful transaction confirmation via our payment processor, digital access keys, license tokens, and download access are granted immediately on screen.</li>
              <li>A digital confirmation receipt and access link are dispatched to your provided email address within minutes.</li>
              <li>No physical shipment, freight, or courier delivery is required.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground">4. Refund & Cancellation Policy</h2>
            <p>
              Due to the immediate digital fulfillment and uncompiled source code access provided with NexoreUI Pro:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-muted-foreground">
              <li><strong>All sales are final.</strong> Because digital code assets, repository access, and license credentials cannot be revoked or returned once downloaded, purchases are non-refundable.</li>
              <li>In accordance with applicable statutory consumer protection standards for digital goods (including EU Directive 2011/83/EU Article 16(m)), you acknowledge and agree that digital delivery commences immediately upon transaction completion, thereby waiving any statutory right of withdrawal.</li>
              <li><strong>Engineering Guarantee:</strong> If you encounter code compilation errors or discrepancies with documented component behavior, our core engineering team will assist directly with code remediation. Contact us with your order details at <span className="font-mono text-foreground">nexoreuiteam@mail.ru</span>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground">5. Commercial License & Intellectual Property</h2>
            <p>
              Purchasing NexoreUI Pro grants you a perpetual, worldwide, non-exclusive commercial license to:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-muted-foreground">
              <li>Use the source code in unlimited personal, SaaS, client, and commercial projects.</li>
              <li>Modify, adapt, and build applications on top of the templates without paying royalties.</li>
              <li>Share permanent access with up to 2 direct team colleagues using your unique account invite tokens.</li>
              <li><strong>Restrictions:</strong> You may not redistribute, resell, or publish the raw standalone source code bundles as a competing template pack or UI theme marketplace item.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground">6. Customer Support & Inquiries</h2>
            <p>
              Our engineering team is available to assist with license activation, installation issues, and billing inquiries:
            </p>
            <div className="mt-3">
              <div className="p-4 rounded-lg border border-border bg-card flex items-center gap-3 max-w-md">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Engineering Support Email</div>
                  <a href="mailto:nexoreuiteam@mail.ru" className="text-xs font-mono font-medium text-foreground hover:underline">
                    nexoreuiteam@mail.ru
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

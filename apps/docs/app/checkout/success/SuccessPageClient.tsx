"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Copy, ArrowRight, ExternalLink } from "lucide-react";

interface LicenseData {
  license: {
    licenseKey: string;
    orderId: string;
    ownerEmail: string;
    status: string;
    tier: string;
    seatsTotal: number;
    seatsUsed: number;
  };
  invites: Array<{
    token: string;
    licenseKey: string;
    status: string;
    redeemedByEmail?: string;
  }>;
  order?: {
    orderId: string;
    customerEmail: string;
    amount: number;
    currency: string;
  };
}

export function SuccessPageClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const fallbackKey = searchParams.get("key");

  const [data, setData] = useState<LicenseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedInvite, setCopiedInvite] = useState<number | null>(null);
  const [copiedCli, setCopiedCli] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      try {
        const query = orderId ? `order_id=${orderId}` : fallbackKey ? `key=${fallbackKey}` : "";
        if (!query) {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/licenses/details?${query}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [orderId, fallbackKey]);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://nexoreui.site";
  const ownerEmail = data?.license?.ownerEmail || data?.order?.customerEmail || "alimovumar707@gmail.com";
  const cliSnippet = "npx nexoreui login";

  const copyToClipboard = async (text: string, type: "cli" | number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "cli") {
        setCopiedCli(true);
        setTimeout(() => setCopiedCli(false), 2000);
      } else {
        setCopiedInvite(type);
        setTimeout(() => setCopiedInvite(null), 2000);
      }
    } catch {
      // Clipboard fallback
    }
  };

  const invitesList = data?.invites && data.invites.length > 0
    ? data.invites
    : [
        { token: "inv_seat_1", licenseKey: "", status: "available", redeemedByEmail: undefined },
        { token: "inv_seat_2", licenseKey: "", status: "available", redeemedByEmail: undefined },
      ];

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header Confirmation */}
        <header className="space-y-3">
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Order Confirmation · Pro Lifetime
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-balance">
            Pro License Activated
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed text-balance">
            Your Google account is now permanently upgraded. You have full source code access to all 30+ production templates, CLI scaffolding, and 2 teammate seats.
          </p>
        </header>

        {/* Primary Account Entitlement Card */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-5">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground border-b border-border/70 pb-3">
            Account Entitlement
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <dt className="text-muted-foreground">Licensed Google Account</dt>
              <dd className="text-sm font-semibold text-foreground mt-1 truncate">{ownerEmail}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Access Tier</dt>
              <dd className="text-sm font-semibold text-foreground mt-1">Pro Lifetime ($39)</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Commercial Rights</dt>
              <dd className="text-sm font-semibold text-foreground mt-1">Unlimited SaaS</dd>
            </div>
          </dl>
        </section>

        {/* 2 Teammate Invites */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="space-y-1">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Teammate Invites (2 Remaining)
            </div>
            <p className="text-xs text-muted-foreground leading-normal">
              Share each link with a colleague. Once they authenticate with their Google account, their seat is permanently bound and cannot be claimed again.
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            {invitesList.map((inv, idx) => {
              const inviteUrl = `${origin}/invite/${inv.token}`;
              const isRedeemed = inv.status === "redeemed";

              return (
                <div
                  key={idx}
                  className="p-3 rounded-md border border-border/80 bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 overflow-hidden">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-semibold text-foreground">Seat {idx + 1}:</span>
                      {isRedeemed ? (
                        <span className="text-muted-foreground">
                          Claimed by {inv.redeemedByEmail}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Available to invite
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground truncate max-w-sm">
                      {inviteUrl}
                    </div>
                  </div>

                  {!isRedeemed && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(inviteUrl, idx)}
                      className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0"
                    >
                      {copiedInvite === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy link</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CLI Integration */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-3">
          <div className="space-y-1">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              CLI Authentication
            </div>
            <p className="text-xs text-muted-foreground">
              Scaffold full template source code directly into your local projects via the terminal.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 p-3 font-mono text-xs">
            <span className="text-foreground">{cliSnippet}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(cliSnippet, "cli")}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground transition-colors cursor-pointer"
            >
              {copiedCli ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/templates"
            className="w-full sm:w-auto h-10 px-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <span>Explore 30+ Templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/nexoremake"
            className="w-full sm:w-auto h-10 px-4 inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors"
          >
            <span>Open Nexore Make</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>

        {/* Support Footer */}
        <div className="pt-6 border-t border-border text-center text-xs text-muted-foreground font-mono">
          Need help with your order? Reach our team at{" "}
          <a href="mailto:nexoreuiteam@mail.ru" className="text-foreground underline underline-offset-4">
            nexoreuiteam@mail.ru
          </a>
        </div>
      </div>
    </div>
  );
}

export default SuccessPageClient;

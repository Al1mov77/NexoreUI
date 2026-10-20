"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Check, 
  Copy, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  Users, 
  ExternalLink,
  Layers,
  Sparkles
} from "lucide-react";

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
  const [copiedKey, setCopiedKey] = useState(false);
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
      } catch (e) {
        // Fallback UI handles missing data
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [orderId, fallbackKey]);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://nexoreui.site";
  const licenseKey = data?.license?.licenseKey || "NX-PRO-DEMO-XXXX-XXXX";
  const cliSnippet = `npx nexoreui auth ${licenseKey}`;

  const copyToClipboard = async (text: string, type: "key" | "cli" | number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "key") {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      } else if (type === "cli") {
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

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      {/* Subtle grid background */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="relative mx-auto max-w-3xl space-y-8">
        {/* Header confirmation */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-medium uppercase tracking-wider">
            <Check className="w-3.5 h-3.5" />
            <span>Order Confirmed · Pro Lifetime Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Welcome to NexoreUI Pro
          </h1>

          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Your license credentials, colleague invite tokens, and CLI permissions are ready. 
            A confirmation receipt has also been dispatched to your email.
          </p>
        </div>

        {/* Primary License Key Card */}
        <div className="rounded-2xl border-2 border-foreground bg-card p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">License Identifier</div>
              <div className="text-lg font-bold text-foreground">Lifetime Commercial Key</div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-muted text-[11px] font-mono text-muted-foreground">
                3 Total Seats
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[11px] font-mono font-medium">
                Active
              </span>
            </div>
          </div>

          {/* Key Display with Copy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3.5">
              <code className="font-mono text-sm sm:text-base font-semibold tracking-wider text-foreground">
                {licenseKey}
              </code>

              <button
                type="button"
                onClick={() => copyToClipboard(licenseKey, "key")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Key</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-muted-foreground font-mono flex items-center justify-between">
              <span>Account: {data?.license?.ownerEmail || "pro-developer"}</span>
              <span>Unlimited Commercial SaaS License</span>
            </div>

            {/* Google Account One-Click Binding */}
            <div className="pt-2">
              <a
                href="/api/auth/google"
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-foreground text-xs font-semibold transition-all"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <span>Link Google Account (Passwordless 1-Click Access)</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2 Developer Team Invite Links */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <Users className="w-4 h-4 text-foreground" />
              <span>2 Permanent Developer Team Invites</span>
            </div>
            <p className="text-xs text-muted-foreground leading-normal">
              Share each link with a teammate. Once redeemed, they receive their own permanent Pro access forever.
            </p>
          </div>

          <div className="space-y-3">
            {(data?.invites && data.invites.length > 0
              ? data.invites
              : [
                  { token: "inv_sample_seat_1", licenseKey: "", status: "available", redeemedByEmail: undefined },
                  { token: "inv_sample_seat_2", licenseKey: "", status: "available", redeemedByEmail: undefined },
                ]
            ).map((inv, idx) => {
              const inviteUrl = `${origin}/invite/${inv.token}`;
              const isRedeemed = inv.status === "redeemed";
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-border/70 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <span>Seat {idx + 1}:</span>
                      {isRedeemed ? (
                        <span className="font-mono text-[10px] text-emerald-500 uppercase font-medium">
                          Claimed ({inv.redeemedByEmail})
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">
                          Available to invite
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground truncate max-w-md">
                      {inviteUrl}
                    </div>
                  </div>

                  {!isRedeemed && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(inviteUrl, idx)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted transition-colors cursor-pointer shrink-0"
                    >
                      {copiedInvite === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CLI Integration Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <Terminal className="w-4 h-4 text-foreground" />
            <span>CLI Quick Authorization</span>
          </div>

          <p className="text-xs text-muted-foreground leading-normal">
            Authenticate the NexoreUI CLI on your local development machine to generate full Pro templates directly:
          </p>

          <div className="flex items-center justify-between rounded-xl border border-border bg-zinc-950 p-3 text-zinc-100 font-mono text-xs">
            <code>{cliSnippet}</code>
            <button
              type="button"
              onClick={() => copyToClipboard(cliSnippet, "cli")}
              className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Copy command"
            >
              {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Navigation & Next Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Link
            href="/templates"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity shadow-xs"
          >
            <span>Explore 30+ PRO Templates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/nexoremake"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <span>Open Nexore Make Studio</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Support note */}
        <div className="text-center pt-4 text-xs text-muted-foreground">
          Need onboarding or repository setup assistance? Contact core engineering at{" "}
          <a href="mailto:nexoreuiteam@mail.ru" className="text-foreground font-mono hover:underline">
            nexoreuiteam@mail.ru
          </a>
        </div>
      </div>
    </div>
  );
}

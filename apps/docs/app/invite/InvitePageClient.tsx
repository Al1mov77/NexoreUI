"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ArrowRight, ShieldCheck, Users, AlertCircle } from "lucide-react";

export function InvitePageClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimed, setClaimed] = useState<{
    licenseKey?: string;
    ownerEmail?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Missing invite token in URL.");
      return;
    }

    if (!email || !email.includes("@")) {
      setError("Please provide a valid developer email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/invites/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to redeem invite.");
      } else {
        setClaimed({
          licenseKey: json.licenseKey,
          ownerEmail: json.ownerEmail,
        });
      }
    } catch {
      setError("Network error while claiming seat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="relative w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>Team Seat Invitation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Claim Your NexoreUI Pro Seat
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground">
            A fellow developer has granted you permanent, lifetime Pro access to all 30+ templates and unlimited Make studio exports.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-md">
          {claimed ? (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">Access Granted Forever</h2>
                <p className="text-xs text-muted-foreground">
                  Your seat is permanently registered under <strong className="text-foreground">{email}</strong>.
                </p>
              </div>

              {claimed.licenseKey && (
                <div className="p-3 rounded-xl border border-border bg-muted/40 font-mono text-xs text-foreground">
                  License: <span className="font-bold">{claimed.licenseKey}</span>
                </div>
              )}

              <div className="pt-2 space-y-2">
                <Link
                  href="/templates"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <span>Explore All PRO Templates</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/nexoremake"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-medium hover:bg-muted transition-colors"
                >
                  <span>Open Nexore Make</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="dev-email" className="block text-xs font-semibold text-foreground">
                  Your Developer Email
                </label>
                <input
                  id="dev-email"
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                />
                <p className="text-[10px] text-muted-foreground">
                  This binds permanent Pro credentials to your email address.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {loading ? "Activating Seat..." : "Claim Lifetime Access"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        <div className="text-center text-[11px] text-muted-foreground">
          Need help? Contact <a href="mailto:nexoreuiteam@mail.ru" className="font-mono text-foreground hover:underline">nexoreuiteam@mail.ru</a>
        </div>
      </div>
    </div>
  );
}

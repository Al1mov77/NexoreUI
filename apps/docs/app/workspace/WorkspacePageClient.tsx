"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProBadge } from "../components/layout/ProBadge";
import { Check, 
  Copy, 
  Users, 
  Terminal, 
  ArrowRight, 
  ExternalLink, 
  Search,
  Laptop,
  RotateCcw,
  AlertCircle
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
    lastResetAt?: number;
    resetsCount?: number;
  };
  invites: Array<{
    token: string;
    licenseKey: string;
    status: string;
    redeemedByEmail?: string;
  }>;
  activations?: Array<{
    activationId: string;
    deviceId: string;
    deviceName: string;
    createdAt: number;
    lastSeenAt: number;
  }>;
}

export function WorkspacePageClient() {
  const searchParams = useSearchParams();
  const initialKey = searchParams.get("key") || "";

  const [inputVal, setInputVal] = useState(initialKey);
  const [data, setData] = useState<LicenseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAuth, setCopiedAuth] = useState(false);
  const [copiedAdd, setCopiedAdd] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState<number | null>(null);
  const [resettingDevices, setResettingDevices] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleResetDevices = async () => {
    if (!data?.license?.licenseKey) return;
    setResettingDevices(true);
    setResetMessage(null);
    try {
      const res = await fetch("/api/licenses/reset-devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: data.license.licenseKey }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setResetMessage(json.message || "All devices detached successfully.");
        await fetchLicense(data.license.licenseKey);
      } else {
        setResetMessage(json.error || "Failed to reset devices.");
      }
    } catch {
      setResetMessage("Network error resetting devices.");
    } finally {
      setResettingDevices(false);
    }
  };

  const fetchLicense = async (queryVal: string) => {
    if (!queryVal) return;
    setLoading(true);
    setError(null);

    try {
      const isEmail = queryVal.includes("@");
      const param = isEmail ? `email=${encodeURIComponent(queryVal)}` : `key=${encodeURIComponent(queryVal)}`;
      const res = await fetch(`/api/licenses/details?${param}`);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setError(errJson.error || "No active Pro license found for this identifier.");
        setData(null);
      } else {
        const json = await res.json();
        if (json.licenses && json.licenses.length > 0) {
          setData(json.licenses[0]);
          if (json.licenses[0].license?.licenseKey) {
            try {
              localStorage.setItem("nexoreui_license_key", json.licenses[0].license.licenseKey);
              localStorage.setItem("nexoreui_is_pro", "true");
              window.dispatchEvent(new Event("nexoreui_pro_updated"));
            } catch {}
          }
        } else if (json.license) {
          setData(json);
          if (json.license?.licenseKey) {
            try {
              localStorage.setItem("nexoreui_license_key", json.license.licenseKey);
              localStorage.setItem("nexoreui_is_pro", "true");
              window.dispatchEvent(new Event("nexoreui_pro_updated"));
            } catch {}
          }
        } else {
          setError("No active license found.");
          setData(null);
        }
      }
    } catch {
      setError("Network error fetching workspace credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialKey) {
      fetchLicense(initialKey);
    } else {
      const storedKey = typeof window !== "undefined" ? localStorage.getItem("nexoreui_license_key") : null;
      if (storedKey) {
        setInputVal(storedKey);
        fetchLicense(storedKey);
      } else {
        fetch("/api/auth/me")
          .then((r) => (r.ok ? r.json() : null))
          .then((auth) => {
            if (auth?.isPro && auth?.licenseKey) {
              setInputVal(auth.licenseKey);
              fetchLicense(auth.licenseKey);
            }
          })
          .catch(() => {});
      }
    }
  }, [initialKey]);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://nexoreui.site";

  const copyToClipboard = async (text: string, type: "key" | "auth" | "add" | number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "key") {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      } else if (type === "auth") {
        setCopiedAuth(true);
        setTimeout(() => setCopiedAuth(false), 2000);
      } else if (type === "add") {
        setCopiedAdd(true);
        setTimeout(() => setCopiedAdd(false), 2000);
      } else {
        setCopiedInvite(type);
        setTimeout(() => setCopiedInvite(null), 2000);
      }
    } catch {}
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-balance">
            Workspace & Team Console
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed text-balance">
            Manage your NexoreUI Pro license, oversee active developer machines, and distribute colleague invite seats.
          </p>
        </header>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchLicense(inputVal);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter License Key (NX-PRO-XXXXXX-XXXXXX-XXXXXX)"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? "Searching..." : "Access Workspace"}</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
            <span>Don&apos;t have your license key handy?</span>
            <Link
              href="/auth/login?state=/workspace"
              className="font-semibold text-foreground hover:underline inline-flex items-center gap-1"
            >
              <span>Sign in with Email 6-Digit Code or Google</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </section>

        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Account Owner</div>
                <div className="text-sm font-semibold text-foreground truncate">{data.license.ownerEmail}</div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-1">
                <div className="flex items-center justify-between"><div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">License Tier</div><ProBadge /></div>
                <div className="text-sm font-semibold text-foreground">Lifetime Commercial (All 30+ Templates)</div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Team Allocation</div>
                <div className="text-sm font-semibold text-foreground">
                  {data.license.seatsUsed} / {data.license.seatsTotal} Seats Assigned
                </div>
              </div>
            </div>

            <section className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Active License Key</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Active & Verified
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-background border border-border">
                <code className="text-xs sm:text-sm font-mono font-semibold text-foreground tracking-wider select-all">
                  {data.license.licenseKey}
                </code>
                <button
                  onClick={() => copyToClipboard(data.license.licenseKey, "key")}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium px-2.5 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer shrink-0"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-foreground">CLI Scaffolding & Quickstart</h2>
                <p className="text-xs text-muted-foreground">
                  Authenticate your developer machine once, then add any Pro template into your projects via terminal.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Step 1: Authenticate CLI</span>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-xs overflow-x-auto">
                    <code>npx nexoreui auth {data.license.licenseKey}</code>
                    <button
                      onClick={() => copyToClipboard(`npx nexoreui auth ${data.license.licenseKey}`, "auth")}
                      className="text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedAuth ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Step 2: Add Any Pro Template</span>
                  <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-xs overflow-x-auto">
                    <code>npx nexoreui add template-ironpaw-pro</code>
                    <button
                      onClick={() => copyToClipboard(`npx nexoreui add template-ironpaw-pro`, "add")}
                      className="text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedAdd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Active Machine Activations</h2>
                  <p className="text-xs text-muted-foreground">
                    Hardware fingerprints registered with this license (max 3 concurrent devices).
                  </p>
                </div>
                <button
                  onClick={handleResetDevices}
                  disabled={resettingDevices}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive font-medium transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${resettingDevices ? "animate-spin" : ""}`} />
                  <span>{resettingDevices ? "Detaching..." : "Detach All Machines"}</span>
                </button>
              </div>

              {resetMessage && (
                <div className="p-3 rounded-lg border border-border bg-muted text-xs text-foreground">
                  {resetMessage}
                </div>
              )}

              {data.activations && data.activations.length > 0 ? (
                <div className="divide-y divide-border">
                  {data.activations.map((act) => (
                    <div key={act.activationId} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Laptop className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-foreground truncate">{act.deviceName}</div>
                          <div className="text-[11px] font-mono text-muted-foreground truncate">{act.deviceId}</div>
                        </div>
                      </div>
                      <div className="text-right text-[11px] font-mono text-muted-foreground shrink-0">
                        Last active: {new Date(act.lastSeenAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                  No developer machines authenticated yet. Run <code>npx nexoreui auth {data.license.licenseKey}</code> in your terminal to pair your machine.
                </div>
              )}
            </section>

            <section className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4">
              <div className="space-y-1 border-b border-border/70 pb-3">
                <h2 className="text-sm font-semibold text-foreground">Team Member Invites (2 Seats Available)</h2>
                <p className="text-xs text-muted-foreground">
                  Distribute these one-time activation links to teammates. Each link grants full Lifetime Pro access.
                </p>
              </div>

              <div className="space-y-3">
                {data.invites && data.invites.length > 0 ? (
                  data.invites.map((inv, idx) => {
                    const inviteUrl = `${origin}/invite/${inv.token}`;
                    const isRedeemed = inv.status === "redeemed";

                    return (
                      <div
                        key={inv.token}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-background border border-border"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">Seat {idx + 1}</span>
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                                isRedeemed
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}
                            >
                              {isRedeemed ? "Redeemed" : "Available"}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-muted-foreground truncate max-w-md">
                            {isRedeemed ? `Activated by: ${inv.redeemedByEmail || "Teammate"}` : inviteUrl}
                          </div>
                        </div>

                        {!isRedeemed && (
                          <button
                            onClick={() => copyToClipboard(inviteUrl, idx)}
                            className="inline-flex items-center justify-center gap-1.5 text-xs text-foreground font-medium px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer shrink-0"
                          >
                            {copiedInvite === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedInvite === idx ? "Copied" : "Copy Link"}</span>
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                    No invite tokens available for this license tier.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

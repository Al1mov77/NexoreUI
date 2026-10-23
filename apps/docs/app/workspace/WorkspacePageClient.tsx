"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Check, 
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
        setError("No active Pro license found for this identifier.");
        setData(null);
      } else {
        const json = await res.json();
        if (json.licenses && json.licenses.length > 0) {
          setData(json.licenses[0]);
        } else if (json.license) {
          setData(json);
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
    } catch {
      // Clipboard fallback
    }
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
                placeholder="Enter License Key (NX-PRO-...) or Account Email"
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
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">License Tier</div>
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
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Active License Key</span>
                <span className="font-mono text-[11px] text-success font-semibold">Active & Verified</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
                <code className="font-mono text-xs sm:text-sm font-semibold text-foreground select-all tracking-wider">
                  {data.license.licenseKey}
                </code>

                <button
                  type="button"
                  onClick={() => copyToClipboard(data.license.licenseKey, "key")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4">
              <div className="space-y-1">
                <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  CLI Scaffolding & Quickstart
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Authenticate your developer machine once, then add any Pro template into your projects via terminal.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-muted-foreground">1. Authenticate your machine</span>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5 font-mono text-xs">
                    <span className="text-foreground truncate select-all">{`npx nexoreui auth ${data.license.licenseKey}`}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(`npx nexoreui auth ${data.license.licenseKey}`, "auth")}
                      className="inline-flex items-center gap-1.5 h-6 px-2 rounded border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground transition-colors cursor-pointer shrink-0 ml-2"
                    >
                      {copiedAuth ? (
                        <>
                          <Check className="w-3 h-3 text-success" />
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
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-muted-foreground">2. Add template to your project</span>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-2.5 font-mono text-xs">
                    <span className="text-foreground truncate select-all">npx nexoreui add template-aura-sound-pro</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("npx nexoreui add template-aura-sound-pro", "add")}
                      className="inline-flex items-center gap-1.5 h-6 px-2 rounded border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground transition-colors cursor-pointer shrink-0 ml-2"
                    >
                      {copiedAdd ? (
                        <>
                          <Check className="w-3 h-3 text-success" />
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
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span>2 Permanent Colleague Team Seats</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Share these unique links with colleagues. Once claimed, their developer email will receive permanent lifetime Pro status.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {data.invites.map((inv, idx) => {
                  const inviteUrl = `${origin}/invite/${inv.token}`;
                  const isClaimed = inv.status === "redeemed";
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-border/70 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <span>Team Seat #{idx + 1}:</span>
                          {isClaimed ? (
                            <span className="font-mono text-[11px] text-success font-medium">
                              Active · {inv.redeemedByEmail}
                            </span>
                          ) : (
                            <span className="font-mono text-[11px] text-muted-foreground">
                              Unclaimed Link
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground truncate max-w-lg">
                          {inviteUrl}
                        </div>
                      </div>

                      {!isClaimed && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(inviteUrl, idx)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium hover:bg-muted transition-colors cursor-pointer shrink-0"
                        >
                          {copiedInvite === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-success" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>Copy Invite Link</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Active Device Slots ({data.activations?.length || 0} / 3 active)</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Each Pro license permits up to 3 authorized machines simultaneously. If you replace a machine, you can reset all device slots.
                  </p>
                </div>

                {(() => {
                  const now = Date.now();
                  const cooldownMs = 14 * 24 * 60 * 60 * 1000;
                  const isCooldown =
                    Boolean(data.license.lastResetAt) &&
                    now - (data.license.lastResetAt || 0) < cooldownMs;
                  const daysRemaining = isCooldown
                    ? Math.ceil((cooldownMs - (now - (data.license.lastResetAt || 0))) / (24 * 60 * 60 * 1000))
                    : 0;

                  return (
                    <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleResetDevices}
                        disabled={resettingDevices || (data.activations?.length || 0) === 0 || isCooldown}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium hover:bg-muted transition-colors cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${resettingDevices ? "animate-spin" : ""}`} />
                        <span>{resettingDevices ? "Resetting..." : "Reset All Devices"}</span>
                      </button>
                      {isCooldown && (
                        <span className="text-[10px] font-mono text-warning">
                          Cooldown: available in {daysRemaining} day{daysRemaining > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>

              {resetMessage && (
                <div className="p-3 rounded-lg border border-border/60 bg-muted/30 text-xs font-mono text-foreground">
                  {resetMessage}
                </div>
              )}

              {data.activations && data.activations.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {data.activations.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-border/70 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <div>
                          <span className="font-semibold text-foreground">{act.deviceName || "Developer Machine"}</span>
                          <span className="text-muted-foreground ml-2 font-mono text-[11px]">
                            ID: {act.deviceId.slice(0, 16)}...
                          </span>
                        </div>
                      </div>
                      <div className="text-muted-foreground font-mono text-[11px]">
                        Last active: {new Date(act.lastSeenAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground font-mono">
                  No machines currently active. Run <code className="text-foreground">npx nexoreui auth &lt;key&gt;</code> to bind your first machine.
                </div>
              )}
            </section>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Browse All PRO Templates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/nexoremake"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <span>Nexore Make Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

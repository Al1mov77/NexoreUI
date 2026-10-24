"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, ShieldCheck, AlertCircle, Mail, KeyRound, ArrowLeft, RefreshCw } from "lucide-react";
import { NexoreLogo } from "../../components/layout/NexoreLogo";

function AuthLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get("state") || searchParams.get("returnTo") || "/pricing";
  const errorParam = searchParams.get("error");

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    window.location.href = `/api/auth/google?state=${encodeURIComponent(state)}`;
  };

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.cooldownRemaining) {
          setCooldown(data.cooldownRemaining);
        }
        setError(data.error || "Failed to send verification code.");
      } else {
        setStep("code");
        setCooldown(60);
      }
    } catch {
      setError("Network error while sending code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();
    if (cleanCode.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: cleanCode,
          state,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid verification code.");
      } else {
        window.dispatchEvent(new Event("nexoreui_pro_updated"));
        router.push(data.redirectUrl || "/pricing");
      }
    } catch {
      setError("Network error while verifying code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-foreground" />
          <span>24/7 Developer Verification</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {step === "email" ? "Sign in to NexoreUI" : "Enter Verification Code"}
        </h1>
        <p className="text-xs text-muted-foreground leading-normal">
          {step === "email"
            ? "Enter your email to receive a 6-digit verification code or continue with your Google account."
            : `We sent a 6-digit code from nexore.verify@mail.ru to ${email.trim().toLowerCase()}.`}
        </p>
      </div>

      {(error || errorParam) && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs leading-normal flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {error ||
              (errorParam === "missing_config"
                ? "Google OAuth Client ID is not configured yet."
                : errorParam === "auth_failed"
                ? "Google authorization was cancelled or failed. Please try again."
                : "Authentication error occurred. Please try again.")}
          </span>
        </div>
      )}

      {step === "email" ? (
        <div className="space-y-4">
          <form onSubmit={handleSendCode} className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="block text-xs font-medium text-foreground">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@gmail.com"
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background hover:opacity-90 text-xs font-semibold transition-opacity cursor-pointer shadow-xs disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending 6-digit code...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-border/60" />
            <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              or
            </span>
            <div className="flex-grow border-t border-border/60" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full h-10 inline-flex items-center justify-center gap-2.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-xs disabled:opacity-60 active:scale-[0.99]"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
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
            )}
            <span>{googleLoading ? "Redirecting to Google..." : "Continue with Google Account"}</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="auth-code" className="block text-xs font-medium text-foreground">
                6-digit security code
              </label>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError(null);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change email</span>
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="auth-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full h-11 pl-9 pr-3 rounded-lg border border-border bg-background text-center font-mono text-base font-bold tracking-[0.4em] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring transition-all tabular-nums"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background hover:opacity-90 text-xs font-semibold transition-opacity cursor-pointer shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying code...</span>
              </>
            ) : (
              <>
                <span>Verify & Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
            <span>Didn&apos;t receive the email?</span>
            <button
              type="button"
              disabled={cooldown > 0 || loading}
              onClick={() => handleSendCode()}
              className="inline-flex items-center gap-1 font-medium text-foreground hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}</span>
            </button>
          </div>
        </form>
      )}

      <div className="pt-2 border-t border-border/60 text-center">
        <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Return to pricing
        </Link>
      </div>
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="mb-6 flex items-center gap-2">
        <NexoreLogo size={24} />
        <span className="font-semibold text-sm tracking-tight">NexoreUI</span>
      </div>

      <Suspense fallback={<div className="text-xs text-muted-foreground font-mono">Loading authentication...</div>}>
        <AuthLoginForm />
      </Suspense>
    </div>
  );
}

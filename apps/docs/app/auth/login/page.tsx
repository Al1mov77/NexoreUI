"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { NexoreLogo } from "../../components/layout/NexoreLogo";

function AuthLoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const state = searchParams.get("state") || searchParams.get("returnTo") || "/pricing";
  const [email, setEmail] = useState("alimovumar707@gmail.com");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, state }),
      });

      const json = await res.json();
      if (json.redirectUrl) {
        window.location.href = json.redirectUrl;
      } else {
        window.location.href = state.startsWith("/") ? state : "/pricing";
      }
    } catch {
      router.push("/pricing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Account Verification
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Continue with Google
        </h1>
        <p className="text-xs text-muted-foreground leading-normal">
          Confirm your developer Google account to bind your Pro lifetime access and team seats.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="auth-email" className="block text-xs font-medium text-foreground">
            Google Account Email
          </label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors font-mono"
            placeholder="developer@gmail.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-9 inline-flex items-center justify-center gap-2 rounded-md bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
          <span>Continue with Google</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-70" />
        </button>
      </form>

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

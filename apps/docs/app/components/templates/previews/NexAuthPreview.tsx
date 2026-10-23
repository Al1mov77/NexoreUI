"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  LogOut,
  Laptop,
} from "lucide-react";
import { useTemplateCustomizer } from "../../../context/TemplateCustomizerContext";

// ─── AUTHENTIC SVG ICONS ────────────────────────────────────────────────────────
function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
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
  );
}

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

// ─── TYPES ──────────────────────────────────────────────────────────────────────
export type AuthMode = "signin" | "signup" | "forgot" | "otp" | "session";

// ─── COMPONENT ──────────────────────────────────────────────────────────────────
export function NexAuthPreview() {
  const { config: customizerConfig, deviceMode } = useTemplateCustomizer();

  const initialTheme = customizerConfig?.theme ?? "dark";
  const [internalDark, setInternalDark] = useState<boolean>(initialTheme === "dark");

  useEffect(() => {
    if (customizerConfig?.theme) {
      setInternalDark(customizerConfig.theme === "dark");
    }
  }, [customizerConfig?.theme]);

  // Responsive observation
  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);

  useEffect(() => {
    if (!rootRef.current) return;
    const updateWidth = () => {
      if (rootRef.current) {
        setContainerWidth(rootRef.current.clientWidth || rootRef.current.getBoundingClientRect().width);
      }
    };
    updateWidth();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  const isMobile = deviceMode === "mobile" || containerWidth < 600;
  const isTablet = deviceMode === "tablet" || (!isMobile && containerWidth < 900);

  // Auth State
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // OTP State (6 digits)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Authenticated State
  const [activeUserEmail, setActiveUserEmail] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    if (resendTimer > 0 && (mode === "otp" || resetSent)) {
      const t = setTimeout(() => setResendTimer((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer, mode, resetSent]);

  // Auto-Fill Demo
  const handleDemoFill = () => {
    setEmail("name@example.com");
    setPassword("mypassword123");
    setErrorMsg(null);
  };

  // Sign In submit
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveUserEmail(email);
      setMode("session");
    }, 800);
  };

  // Sign Up submit
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMode("otp");
      setResendTimer(30);
    }, 800);
  };

  // Forgot Password submit
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
      setResendTimer(45);
    }, 800);
  };

  // OTP input handler
  const handleOtpInput = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      return;
    }
    const char = clean[clean.length - 1];
    const next = [...otp];
    next[index] = char;
    setOtp(next);
    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setErrorMsg("Please enter the 6-digit code.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveUserEmail(email || "name@example.com");
      setMode("session");
    }, 800);
  };

  // Social Auth
  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveUserEmail(`user@${provider.toLowerCase()}.com`);
      setMode("session");
    }, 700);
  };

  // Sign out
  const handleSignOut = () => {
    setActiveUserEmail(null);
    setPassword("");
    setConfirmPassword("");
    setOtp(["", "", "", "", "", ""]);
    setResetSent(false);
    setMode("signin");
  };

  const navModes = [
    { id: "signin" as const, label: "Login" },
    { id: "signup" as const, label: "Register" },
    { id: "forgot" as const, label: "Forgot" },
    { id: "otp" as const, label: "2FA" },
    { id: "session" as const, label: "Account" },
  ];

  return (
    <div
      ref={rootRef}
      className={`w-full min-h-screen font-sans transition-colors duration-200 select-none flex flex-col ${
        internalDark ? "bg-[#09090b] text-[#fafafa]" : "bg-white text-[#09090b]"
      }`}
    >
      {/* ─── MINIMAL SHADCN TOP NAVIGATION ─── */}
      <header
        className={`border-b transition-colors shrink-0 ${
          internalDark ? "border-zinc-800 bg-[#09090b]" : "border-zinc-200 bg-white"
        }`}
      >
        {/* Top Row */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-2">
            <div
              className={`h-6 w-6 rounded flex items-center justify-center font-bold text-xs ${
                internalDark ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-zinc-50"
              }`}
            >
              N
            </div>
            <span className="font-semibold text-sm tracking-tight">Nexore</span>
          </div>

          {/* Desktop/Tablet Mode Switcher */}
          {!isMobile && (
            <div
              className={`flex items-center rounded-lg border p-0.5 text-xs ${
                internalDark ? "border-zinc-800 bg-zinc-900/60" : "border-zinc-200 bg-zinc-100"
              }`}
            >
              {navModes.map((t) => {
                const isActive = mode === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setMode(t.id);
                      setErrorMsg(null);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? internalDark
                          ? "bg-zinc-800 text-zinc-50 shadow-sm"
                          : "bg-white text-zinc-900 shadow-sm"
                        : internalDark
                        ? "text-zinc-400 hover:text-zinc-200"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleDemoFill}
              className={`px-2 py-1 rounded-md border text-xs font-medium transition-colors ${
                internalDark
                  ? "border-zinc-800 hover:bg-zinc-900 text-zinc-300"
                  : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
              }`}
            >
              Demo fill
            </button>
            <button
              onClick={() => setInternalDark(!internalDark)}
              className={`p-1.5 rounded-md border transition-colors ${
                internalDark
                  ? "border-zinc-800 hover:bg-zinc-900 text-zinc-300"
                  : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
              }`}
              title="Toggle theme"
            >
              {internalDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Mode Scroll Bar */}
        {isMobile && (
          <div
            className={`flex items-center gap-1 px-3 py-1.5 border-t overflow-x-auto scrollbar-none ${
              internalDark ? "border-zinc-800/60 bg-zinc-950/40" : "border-zinc-200/60 bg-zinc-50"
            }`}
          >
            {navModes.map((t) => {
              const isActive = mode === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setMode(t.id);
                    setErrorMsg(null);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? internalDark
                        ? "bg-zinc-800 text-zinc-50 shadow-sm"
                        : "bg-white text-zinc-900 shadow-sm"
                      : internalDark
                      ? "text-zinc-400 hover:text-zinc-200"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ─── CENTERED AUTH LAYOUT (RESPONSIVE FOR MOBILE, TABLET & DESKTOP) ─── */}
      <div
        className={`flex-1 flex items-center justify-center ${
          isMobile ? "p-4 py-8" : isTablet ? "p-6 py-10" : "p-8 py-12"
        }`}
      >
        <div className="w-full max-w-[360px] space-y-5">
          {/* Error Notification */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ═══════════════ VIEW 1: SIGN IN ═══════════════ */}
            {mode === "signin" && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-5"
              >
                <div className="space-y-1 text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Login</h1>
                  <p
                    className={`text-xs sm:text-sm ${
                      internalDark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Enter your email below to login to your account
                  </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs sm:text-sm font-medium leading-none">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border text-xs sm:text-sm outline-none transition-colors ${
                        internalDark
                          ? "bg-transparent border-zinc-800 placeholder:text-zinc-600 focus:border-zinc-400"
                          : "bg-transparent border-zinc-200 placeholder:text-zinc-400 focus:border-zinc-900"
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs sm:text-sm font-medium leading-none">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setErrorMsg(null);
                        }}
                        className={`text-xs underline-offset-4 hover:underline ${
                          internalDark ? "text-zinc-400" : "text-zinc-600"
                        }`}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-3 py-2 pr-9 rounded-md border text-xs sm:text-sm outline-none transition-colors ${
                          internalDark
                            ? "bg-transparent border-zinc-800 placeholder:text-zinc-600 focus:border-zinc-400"
                            : "bg-transparent border-zinc-200 placeholder:text-zinc-400 focus:border-zinc-900"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                      internalDark
                        ? "bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
                        : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In with Email</span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span
                      className={`w-full border-t ${
                        internalDark ? "border-zinc-800" : "border-zinc-200"
                      }`}
                    />
                  </div>
                  <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                    <span
                      className={`px-2 ${
                        internalDark
                          ? "bg-[#09090b] text-zinc-500"
                          : "bg-white text-zinc-500"
                      }`}
                    >
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Real Social Auth Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth("Google")}
                    className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-md border text-xs font-medium transition-colors ${
                      internalDark
                        ? "border-zinc-800 hover:bg-zinc-900 text-zinc-200"
                        : "border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    <GoogleIcon className="h-4 w-4 shrink-0" />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialAuth("GitHub")}
                    className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-md border text-xs font-medium transition-colors ${
                      internalDark
                        ? "border-zinc-800 hover:bg-zinc-900 text-zinc-200"
                        : "border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    <GithubIcon className="h-4 w-4 shrink-0" />
                    <span>GitHub</span>
                  </button>
                </div>

                <p
                  className={`text-center text-xs ${
                    internalDark ? "text-zinc-500" : "text-zinc-500"
                  }`}
                >
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("signup");
                      setErrorMsg(null);
                    }}
                    className={`underline underline-offset-4 hover:opacity-80 font-medium ${
                      internalDark ? "text-zinc-300" : "text-zinc-800"
                    }`}
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
            )}

            {/* ═══════════════ VIEW 2: SIGN UP ═══════════════ */}
            {mode === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-5"
              >
                <div className="space-y-1 text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Create an account</h1>
                  <p
                    className={`text-xs sm:text-sm ${
                      internalDark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Enter your email below to create your account
                  </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs sm:text-sm font-medium leading-none">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border text-xs sm:text-sm outline-none transition-colors ${
                        internalDark
                          ? "bg-transparent border-zinc-800 placeholder:text-zinc-600 focus:border-zinc-400"
                          : "bg-transparent border-zinc-200 placeholder:text-zinc-400 focus:border-zinc-900"
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs sm:text-sm font-medium leading-none">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-3 py-2 pr-9 rounded-md border text-xs sm:text-sm outline-none transition-colors ${
                          internalDark
                            ? "bg-transparent border-zinc-800 placeholder:text-zinc-600 focus:border-zinc-400"
                            : "bg-transparent border-zinc-200 placeholder:text-zinc-400 focus:border-zinc-900"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs sm:text-sm font-medium leading-none">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border text-xs sm:text-sm outline-none transition-colors ${
                        internalDark
                          ? "bg-transparent border-zinc-800 placeholder:text-zinc-600 focus:border-zinc-400"
                          : "bg-transparent border-zinc-200 placeholder:text-zinc-400 focus:border-zinc-900"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                      internalDark
                        ? "bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
                        : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span
                      className={`w-full border-t ${
                        internalDark ? "border-zinc-800" : "border-zinc-200"
                      }`}
                    />
                  </div>
                  <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                    <span
                      className={`px-2 ${
                        internalDark
                          ? "bg-[#09090b] text-zinc-500"
                          : "bg-white text-zinc-500"
                      }`}
                    >
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Real Social Auth Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth("Google")}
                    className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-md border text-xs font-medium transition-colors ${
                      internalDark
                        ? "border-zinc-800 hover:bg-zinc-900 text-zinc-200"
                        : "border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    <GoogleIcon className="h-4 w-4 shrink-0" />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialAuth("GitHub")}
                    className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-md border text-xs font-medium transition-colors ${
                      internalDark
                        ? "border-zinc-800 hover:bg-zinc-900 text-zinc-200"
                        : "border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    <GithubIcon className="h-4 w-4 shrink-0" />
                    <span>GitHub</span>
                  </button>
                </div>

                <p
                  className={`text-center text-[11px] sm:text-xs px-2 leading-normal ${
                    internalDark ? "text-zinc-500" : "text-zinc-500"
                  }`}
                >
                  By clicking continue, you agree to our{" "}
                  <span className="underline underline-offset-4 cursor-pointer">Terms</span> and{" "}
                  <span className="underline underline-offset-4 cursor-pointer">Privacy Policy</span>.
                </p>

                <p
                  className={`text-center text-xs ${
                    internalDark ? "text-zinc-500" : "text-zinc-500"
                  }`}
                >
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("signin");
                      setErrorMsg(null);
                    }}
                    className={`underline underline-offset-4 hover:opacity-80 font-medium ${
                      internalDark ? "text-zinc-300" : "text-zinc-800"
                    }`}
                  >
                    Login
                  </button>
                </p>
              </motion.div>
            )}

            {/* ═══════════════ VIEW 3: FORGOT PASSWORD ═══════════════ */}
            {mode === "forgot" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-5"
              >
                <div className="space-y-1 text-center sm:text-left">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMsg(null);
                    }}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium mb-1 ${
                      internalDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to login</span>
                  </button>
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Forgot password</h1>
                  <p
                    className={`text-xs sm:text-sm ${
                      internalDark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Enter your email address and we will send you a reset link
                  </p>
                </div>

                {!resetSent ? (
                  <form onSubmit={handleForgotPassword} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-xs sm:text-sm font-medium leading-none">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3 py-2 rounded-md border text-xs sm:text-sm outline-none transition-colors ${
                          internalDark
                            ? "bg-transparent border-zinc-800 placeholder:text-zinc-600 focus:border-zinc-400"
                            : "bg-transparent border-zinc-200 placeholder:text-zinc-400 focus:border-zinc-900"
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-2 px-4 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                        internalDark
                          ? "bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
                          : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Sending link...</span>
                        </>
                      ) : (
                        <span>Send Reset Link</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div
                    className={`p-4 rounded-md border text-center space-y-3 ${
                      internalDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-zinc-50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Check your inbox</p>
                      <p className="text-xs text-zinc-500">
                        We sent a password reset link to <span className="font-medium text-zinc-300">{email}</span>
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={resendTimer > 0}
                        onClick={() => setResendTimer(45)}
                        className={`text-xs underline-offset-4 hover:underline disabled:opacity-40 ${
                          internalDark ? "text-zinc-400" : "text-zinc-600"
                        }`}
                      >
                        {resendTimer > 0 ? `Resend email in ${resendTimer}s` : "Resend email"}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════════════ VIEW 4: 2FA OTP ═══════════════ */}
            {mode === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-5"
              >
                <div className="space-y-1 text-center sm:text-left">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMsg(null);
                    }}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium mb-1 ${
                      internalDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to login</span>
                  </button>
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Two-factor authentication</h1>
                  <p
                    className={`text-xs sm:text-sm ${
                      internalDark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Enter the 6-digit code sent to your authenticator
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* 6 Digit Input Boxes (Mobile adaptive sizes) */}
                  <div className="flex justify-between gap-1 sm:gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpInput(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-10 sm:w-11 h-11 sm:h-12 text-center text-base sm:text-lg font-mono font-medium rounded-md border outline-none transition-colors ${
                          internalDark
                            ? "bg-transparent border-zinc-800 focus:border-zinc-400 text-zinc-50"
                            : "bg-transparent border-zinc-200 focus:border-zinc-900 text-zinc-900"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setOtp(["1", "2", "3", "4", "5", "6"]);
                      }}
                      className={`underline-offset-4 hover:underline ${
                        internalDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      Demo code
                    </button>
                    <button
                      type="button"
                      disabled={resendTimer > 0}
                      onClick={() => setResendTimer(30)}
                      className={`underline-offset-4 hover:underline disabled:opacity-40 ${
                        internalDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                      internalDark
                        ? "bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
                        : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <span>Verify code</span>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ═══════════════ VIEW 5: ACTIVE SESSION ═══════════════ */}
            {mode === "session" && (
              <motion.div
                key="session"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-5"
              >
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Welcome back</h1>
                  </div>
                  <p
                    className={`text-xs sm:text-sm ${
                      internalDark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Signed in as <span className="font-medium text-zinc-200">{activeUserEmail || "name@example.com"}</span>
                  </p>
                </div>

                <div
                  className={`p-4 rounded-md border space-y-2.5 text-xs ${
                    internalDark ? "border-zinc-800 bg-zinc-900/40" : "border-zinc-200 bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Status</span>
                    <span className="font-medium text-emerald-500">Authenticated</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Role</span>
                    <span className="font-medium">Administrator</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">2FA Security</span>
                    <span className="font-medium">Active</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={`w-full py-2 px-4 rounded-md border text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      internalDark
                        ? "border-zinc-800 hover:bg-zinc-900 text-zinc-200"
                        : "border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

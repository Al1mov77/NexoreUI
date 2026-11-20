"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useTheme } from "next-themes";

type TurnstileWidgetId = string;

interface TurnstileRenderOptions {
  sitekey: string;
  action: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  appearance?: "always" | "execute" | "interaction-only";
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => TurnstileWidgetId;
  reset: (widgetId?: TurnstileWidgetId) => void;
  remove: (widgetId?: TurnstileWidgetId) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  action?: string;
  resetKey: number;
  onTokenChange: (token: string) => void;
  onError?: (message: string | null) => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export function TurnstileWidget({
  action = "auth_otp",
  resetKey,
  onTokenChange,
  onError,
}: TurnstileWidgetProps) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const onErrorRef = useRef(onError);
  const [mounted, setMounted] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  onTokenChangeRef.current = onTokenChange;
  onErrorRef.current = onError;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.turnstile) {
      setScriptReady(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !scriptReady || !SITE_KEY || !containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current !== null) return;

    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      action,
      theme: resolvedTheme === "light" ? "light" : "dark",
      size: "flexible",
      appearance: "interaction-only",
      callback: (token: string) => {
        onErrorRef.current?.(null);
        onTokenChangeRef.current(token);
      },
      "expired-callback": () => {
        onTokenChangeRef.current("");
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
      "error-callback": () => {
        onTokenChangeRef.current("");
        onErrorRef.current?.(
          "Security check failed to load. Disable any script blocker or continue with Google."
        );
      },
    });

    widgetIdRef.current = widgetId;

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignore removal race on fast unmount
        }
      }
      widgetIdRef.current = null;
      onTokenChangeRef.current("");
    };
  }, [mounted, scriptReady, action, resolvedTheme]);

  useEffect(() => {
    if (resetKey === 0) return;
    onTokenChangeRef.current("");
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        // Ignore reset race
      }
    }
  }, [resetKey]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => {
          onTokenChangeRef.current("");
          onErrorRef.current?.(
            "Unable to load Cloudflare security check. Please disable blockers or use Google."
          );
        }}
      />
      <div ref={containerRef} className="w-full empty:hidden" />
    </>
  );
}

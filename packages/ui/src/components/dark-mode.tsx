"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "../utils/cn";

export type ThemeMode = "light" | "dark" | "system";

export interface DarkModeToggleProps {
  theme?: ThemeMode;
  variant?: "pill" | "icon" | "segmented" | "card";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  storageKey?: string;
  onChange?: (theme: ThemeMode) => void;
  className?: string;
}

function applyThemeToDocument(mode: ThemeMode) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = mode === "dark" || (mode === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", shouldBeDark);
}

export function DarkModeToggle({
  theme: controlledTheme,
  variant = "pill",
  size = "md",
  showLabel = false,
  storageKey = "nexore-theme",
  onChange,
  className,
}: DarkModeToggleProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalTheme, setInternalTheme] = React.useState<ThemeMode>("system");
  const [resolvedDark, setResolvedDark] = React.useState(true);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (controlledTheme === undefined) {
      try {
        const stored = window.localStorage.getItem(storageKey) as ThemeMode | null;
        if (stored === "light" || stored === "dark" || stored === "system") {
          setInternalTheme(stored);
        }
      } catch {
      }
    }
  }, [controlledTheme, storageKey]);

  const activeTheme: ThemeMode = controlledTheme !== undefined ? controlledTheme : internalTheme;

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const dark = activeTheme === "dark" || (activeTheme === "system" && mq.matches);
      setResolvedDark(dark);
      if (controlledTheme === undefined) {
        applyThemeToDocument(activeTheme);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [activeTheme, controlledTheme]);

  const handleToggle = (newTheme: ThemeMode) => {
    if (controlledTheme === undefined) {
      setInternalTheme(newTheme);
      try {
        window.localStorage.setItem(storageKey, newTheme);
      } catch {
      }
      applyThemeToDocument(newTheme);
    }
    onChange?.(newTheme);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => handleToggle(resolvedDark ? "light" : "dark")}
        className={cn(
          "relative flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors duration-200 cursor-pointer shadow-xs",
          size === "sm" ? "w-8 h-8" : size === "lg" ? "w-11 h-11" : "w-9 h-9",
          className
        )}
        title={`Switch to ${resolvedDark ? "light" : "dark"} theme`}
        aria-label="Toggle theme"
      >
        <motion.div
          key={resolvedDark ? "dark" : "light"}
          initial={shouldReduceMotion ? false : { rotate: -60, scale: 0.85, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18 }}
        >
          {resolvedDark ? (
            <Moon className={size === "sm" ? "w-3.5 h-3.5 text-foreground" : "w-4 h-4 text-foreground"} />
          ) : (
            <Sun className={size === "sm" ? "w-3.5 h-3.5 text-foreground" : "w-4 h-4 text-foreground"} />
          )}
        </motion.div>
      </button>
    );
  }

  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label="Theme mode"
        className={cn(
          "inline-flex items-center gap-1 p-1 rounded-xl border border-border bg-muted/40 shadow-xs",
          className
        )}
      >
        {(["light", "dark", "system"] as const).map((t) => {
          const isActive = activeTheme === t;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => handleToggle(t)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors duration-150 cursor-pointer",
                isActive
                  ? "bg-card text-foreground shadow-xs border border-border font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "light" && <Sun className="w-3.5 h-3.5" />}
              {t === "dark" && <Moon className="w-3.5 h-3.5" />}
              {t === "system" && <Monitor className="w-3.5 h-3.5" />}
              {showLabel && <span>{t}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "card") {
    const cards: { id: ThemeMode; label: string; desc: string; icon: React.ReactNode }[] = [
      { id: "light", label: "Light", desc: "Clean daylight surface", icon: <Sun className="w-4 h-4" /> },
      { id: "dark", label: "Dark", desc: "Low-glare dark surface", icon: <Moon className="w-4 h-4" /> },
      { id: "system", label: "System", desc: "Matches OS preference", icon: <Monitor className="w-4 h-4" /> },
    ];
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg", className)}>
        {cards.map((item) => {
          const isActive = activeTheme === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToggle(item.id)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-colors cursor-pointer",
                isActive
                  ? "border-foreground bg-card text-foreground shadow-xs"
                  : "border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <div className="flex w-full items-center justify-between">
                {item.icon}
                {isActive && <Check className="w-3.5 h-3.5 text-foreground" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">{item.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  const dimensions =
    size === "sm"
      ? { track: "w-11 h-6", thumb: "w-4.5 h-4.5", icon: "w-2.5 h-2.5", offset: 20 }
      : size === "lg"
      ? { track: "w-16 h-9", thumb: "w-7 h-7", icon: "w-4 h-4", offset: 28 }
      : { track: "w-14 h-7.5", thumb: "w-5.5 h-5.5", icon: "w-3 h-3", offset: 24 };

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={resolvedDark}
        onClick={() => handleToggle(resolvedDark ? "light" : "dark")}
        className={cn(
          "relative rounded-full transition-colors duration-200 border border-border shadow-xs cursor-pointer p-0.75",
          resolvedDark ? "bg-foreground" : "bg-muted",
          dimensions.track
        )}
        title={`Switch to ${resolvedDark ? "light" : "dark"} mode`}
        aria-label="Toggle dark mode"
      >
        <motion.div
          animate={{ x: resolvedDark ? dimensions.offset : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
          className={cn(
            "rounded-full bg-background text-foreground shadow-xs flex items-center justify-center",
            dimensions.thumb
          )}
        >
          {resolvedDark ? <Moon className={dimensions.icon} /> : <Sun className={dimensions.icon} />}
        </motion.div>
      </button>

      {showLabel && (
        <span className="text-xs font-semibold text-foreground/90 capitalize select-none">
          {activeTheme} mode
        </span>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "../utils/cn";

export interface DarkModeToggleProps {
  theme?: "light" | "dark" | "system";
  variant?: "pill" | "icon" | "segmented";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  onChange?: (theme: "light" | "dark" | "system") => void;
  className?: string;
}

export function DarkModeToggle({
  theme: controlledTheme,
  variant = "pill",
  size = "md",
  showLabel = false,
  onChange,
  className,
}: DarkModeToggleProps) {
  const [internalTheme, setInternalTheme] = useState<"light" | "dark" | "system">("dark");

  const activeTheme = controlledTheme !== undefined ? controlledTheme : internalTheme;

  const handleToggle = (newTheme: "light" | "dark" | "system") => {
    if (controlledTheme === undefined) {
      setInternalTheme(newTheme);
      // Toggle class on documentElement for vanilla / non-provider environments
      if (typeof document !== "undefined") {
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else if (newTheme === "light") {
          document.documentElement.classList.remove("dark");
        }
      }
    }
    onChange?.(newTheme);
  };

  const isDark = activeTheme === "dark";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => handleToggle(isDark ? "light" : "dark")}
        className={cn(
          "relative flex items-center justify-center rounded-xl border border-border/80 bg-card hover:bg-muted/60 text-foreground transition-all duration-200 cursor-pointer shadow-xs",
          size === "sm" ? "w-8 h-8" : size === "lg" ? "w-11 h-11" : "w-9 h-9",
          className
        )}
        title={`Switch to ${isDark ? "light" : "dark"} theme`}
        aria-label="Toggle theme"
      >
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon className={size === "sm" ? "w-3.5 h-3.5 text-primary" : "w-4.5 h-4.5 text-primary"} />
          ) : (
            <Sun className={size === "sm" ? "w-3.5 h-3.5 text-amber-500" : "w-4.5 h-4.5 text-amber-500"} />
          )}
        </motion.div>
      </button>
    );
  }

  if (variant === "segmented") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 p-1 rounded-xl border border-border/80 bg-muted/40 backdrop-blur-md shadow-xs",
          className
        )}
      >
        {(["light", "dark", "system"] as const).map((t) => {
          const isActive = activeTheme === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => handleToggle(t)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-card text-foreground shadow-xs border border-border/60 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "light" && <Sun className="w-3.5 h-3.5 text-amber-500" />}
              {t === "dark" && <Moon className="w-3.5 h-3.5 text-primary" />}
              {t === "system" && <Monitor className="w-3.5 h-3.5 text-muted-foreground" />}
              {showLabel && <span>{t}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Pill toggle
  const dimensions =
    size === "sm"
      ? { track: "w-11 h-6", thumb: "w-4.5 h-4.5", icon: "w-2.5 h-2.5" }
      : size === "lg"
      ? { track: "w-16 h-9", thumb: "w-7 h-7", icon: "w-4 h-4" }
      : { track: "w-14 h-7.5", thumb: "w-5.5 h-5.5", icon: "w-3 h-3" };

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={() => handleToggle(isDark ? "light" : "dark")}
        className={cn(
          "relative rounded-full transition-colors duration-300 border border-border/80 shadow-xs cursor-pointer p-0.75",
          isDark ? "bg-zinc-900 border-primary/40" : "bg-zinc-200 dark:bg-zinc-800",
          dimensions.track
        )}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
        aria-label="Toggle dark mode"
      >
        <motion.div
          animate={{
            x: isDark ? (size === "sm" ? 20 : size === "lg" ? 28 : 25) : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "rounded-full bg-white shadow-md flex items-center justify-center transition-colors",
            dimensions.thumb
          )}
        >
          {isDark ? (
            <Moon className={cn(dimensions.icon, "text-zinc-900")} />
          ) : (
            <Sun className={cn(dimensions.icon, "text-amber-500")} />
          )}
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

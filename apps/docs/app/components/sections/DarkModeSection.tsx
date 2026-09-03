"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ComponentSource } from "../ComponentSource";
import { PropsTable } from "../PropsTable";
import { Button } from "nexoreui";
import { Sun, Moon, Monitor, Palette, Sparkles, Check, Laptop, Terminal } from "lucide-react";
import { cn } from "nexoreui";

export interface DarkModeToggleProps {
  theme?: "light" | "dark" | "system";
  variant?: "pill" | "icon" | "segmented" | "card";
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
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [internalTheme, setInternalTheme] = useState<"light" | "dark" | "system">("dark");

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme =
    controlledTheme !== undefined
      ? controlledTheme
      : mounted && nextTheme
      ? (nextTheme as "light" | "dark" | "system")
      : internalTheme;

  const handleToggle = (newTheme: "light" | "dark" | "system") => {
    if (controlledTheme === undefined) {
      setInternalTheme(newTheme);
      if (mounted) {
        setNextTheme(newTheme);
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
      ? { track: "w-11 h-6", thumb: "w-4.5 h-4.5", shift: "translate-x-5", icon: "w-2.5 h-2.5" }
      : size === "lg"
      ? { track: "w-16 h-9", thumb: "w-7 h-7", shift: "translate-x-7", icon: "w-4 h-4" }
      : { track: "w-14 h-7.5", thumb: "w-5.5 h-5.5", shift: "translate-x-6.5", icon: "w-3 h-3" };

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

export function DarkModeSection() {
  const [playTheme, setPlayTheme] = useState<"light" | "dark" | "system">("dark");
  const [playVariant, setPlayVariant] = useState<"pill" | "icon" | "segmented">("pill");
  const [playSize, setPlaySize] = useState<"sm" | "md" | "lg">("md");
  const [playShowLabel, setPlayShowLabel] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const generateLiveCode = () => {
    const props: string[] = [];
    if (playVariant !== "pill") props.push(`variant="${playVariant}"`);
    if (playSize !== "md") props.push(`size="${playSize}"`);
    if (playShowLabel) props.push(`showLabel`);
    props.push(`theme="${playTheme}"`);
    props.push(`onChange={setTheme}`);

    return `import { DarkModeToggle } from "nexoreui";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("${playTheme}");

  return (
    <DarkModeToggle
      ${props.join("\n      ")}
    />
  );
}`;
  };

  const propsData = [
    {
      name: "theme",
      type: '"light" | "dark" | "system"',
      defaultValue: '"dark"',
      description: "Current active theme state. Can be controlled or bound to next-themes.",
      required: false,
    },
    {
      name: "variant",
      type: '"pill" | "icon" | "segmented"',
      defaultValue: '"pill"',
      description: "Visual appearance style of the theme switcher.",
      required: false,
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "Dimensions profile for the toggle switch.",
      required: false,
    },
    {
      name: "showLabel",
      type: "boolean",
      defaultValue: "false",
      description: "Displays textual theme indicator label next to the control.",
      required: false,
    },
    {
      name: "onChange",
      type: '(theme: "light" | "dark" | "system") => void',
      defaultValue: "undefined",
      description: "Callback fired when the user selects or toggles a theme.",
      required: false,
    },
  ];

  const examples = [
    {
      name: "1. Animated Pill Sun/Moon Switcher",
      component: (
        <DarkModeToggle
          variant="pill"
          size="md"
          showLabel={true}
          theme={playTheme}
          onChange={(t) => setPlayTheme(t)}
        />
      ),
      code: `import { DarkModeToggle } from "nexoreui";

export default function PillDemo() {
  return (
    <DarkModeToggle variant="pill" size="md" showLabel />
  );
}`,
    },
    {
      name: "2. Compact Segmented Multi-Theme Switcher",
      component: (
        <DarkModeToggle
          variant="segmented"
          showLabel={true}
          theme={playTheme}
          onChange={(t) => setPlayTheme(t)}
        />
      ),
      code: `import { DarkModeToggle } from "nexoreui";

export default function SegmentedDemo() {
  return (
    <DarkModeToggle variant="segmented" showLabel />
  );
}`,
    },
    {
      name: "3. Minimalist Icon-Only Button",
      component: (
        <div className="flex items-center gap-3">
          <DarkModeToggle variant="icon" size="sm" theme={playTheme} onChange={(t) => setPlayTheme(t)} />
          <DarkModeToggle variant="icon" size="md" theme={playTheme} onChange={(t) => setPlayTheme(t)} />
          <DarkModeToggle variant="icon" size="lg" theme={playTheme} onChange={(t) => setPlayTheme(t)} />
        </div>
      ),
      code: `import { DarkModeToggle } from "nexoreui";

export default function IconDemo() {
  return (
    <DarkModeToggle variant="icon" size="md" />
  );
}`,
    },
    {
      name: "4. System Theme Card Indicator",
      component: (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card/60 w-full max-w-sm">
          <div className="flex items-center gap-3">
            <Monitor className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs font-semibold text-foreground">Sync with Operating System</p>
              <p className="text-[11px] text-muted-foreground">Auto-switches based on OS preference</p>
            </div>
          </div>
          <DarkModeToggle
            variant="pill"
            size="sm"
            theme={playTheme}
            onChange={(t) => setPlayTheme(t)}
          />
        </div>
      ),
      code: `import { DarkModeToggle } from "nexoreui";
import { Monitor } from "lucide-react";

export default function SystemSyncDemo() {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card">
      <div>
        <h4 className="text-xs font-semibold">Sync with OS</h4>
        <p className="text-[11px] text-muted-foreground">Matches system dark/light theme</p>
      </div>
      <DarkModeToggle variant="pill" size="sm" />
    </div>
  );
}`,
    },
  ];

  const itemsPerPage = 2;
  const totalPages = Math.ceil(examples.length / itemsPerPage);
  const visibleItems = examples.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="dark-mode" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pro Suites — Theme Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Dark Mode Toolkit
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
          Production-grade theme controllers, sun/moon morphing switches, segmented pickers, and
          zero-flicker Next.js integration hooks. Fully interactive with live theme toggling.
        </p>

        {/* CLI Quick Add */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/60 border border-border text-xs font-mono w-fit mt-3">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground">npx nexoreui-cli add dark-mode</span>
        </div>
      </div>

      {/* Interactive Live Playground */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Interactive Live Playground
          </h2>
          <span className="text-xs text-muted-foreground font-mono">Live Theme Engine</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Live Preview Box */}
          <div className="xl:col-span-2 min-h-[280px] flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-card/40 backdrop-blur-md relative overflow-hidden gap-4">
            <DarkModeToggle
              theme={playTheme}
              variant={playVariant}
              size={playSize}
              showLabel={playShowLabel}
              onChange={(t) => setPlayTheme(t)}
            />
            <p className="text-xs text-muted-foreground font-mono">
              Current state: <span className="text-primary font-bold">{playTheme}</span>
            </p>
          </div>

          {/* Controls Panel */}
          <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Configure Props
            </h3>

            {/* Theme state */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Theme State</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPlayTheme(t)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                      playTheme === t
                        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Style Variant</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["pill", "icon", "segmented"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setPlayVariant(v)}
                    className={`py-1.5 px-2 text-xs rounded-lg border capitalize transition-all cursor-pointer ${
                      playVariant === v
                        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Size</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["sm", "md", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPlaySize(s)}
                    className={`py-1.5 px-2 text-xs rounded-lg border uppercase font-mono transition-all cursor-pointer ${
                      playSize === s
                        ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                        : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Show label toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs font-medium text-foreground">Show Text Label</label>
              <button
                type="button"
                onClick={() => setPlayShowLabel(!playShowLabel)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  playShowLabel ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.75 ${
                    playShowLabel ? "translate-x-4.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Live Generated Code */}
        <div className="pt-2">
          <ComponentSource sourceCode={generateLiveCode()} scope={{ DarkModeToggle }} />
        </div>
      </div>

      {/* Props Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Props Reference</h2>
        <PropsTable propsData={propsData} />
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Usage Examples</h2>
          <span className="text-xs text-muted-foreground font-mono">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="space-y-8">
          {visibleItems.map((ex, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{ex.name}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
                <div className="min-h-[180px] flex items-center justify-center p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-md">
                  {ex.component}
                </div>
                <ComponentSource sourceCode={ex.code} scope={{ DarkModeToggle }} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}

export default DarkModeSection;

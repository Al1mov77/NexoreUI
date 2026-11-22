export const darkMode = {
  name: "dark-mode",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion",
  "lucide-react"
],
  
  fileName: "dark-mode.tsx",
  content: `"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Sun, Moon, Monitor, Check } from "lucide-react"
import { cn } from "../utils/cn"

export type ThemeMode = "light" | "dark" | "system"

export interface DarkModeToggleProps {
  theme?: ThemeMode
  variant?: "pill" | "icon" | "segmented" | "card" | "dial"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  storageKey?: string
  onChange?: (theme: ThemeMode) => void
  className?: string
}

function applyThemeToDocument(mode: ThemeMode) {
  if (typeof window === "undefined" || typeof document === "undefined") return
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const shouldBeDark = mode === "dark" || (mode === "system" && prefersDark)
  document.documentElement.classList.toggle("dark", shouldBeDark)
}

function EclipseGlyph({
  isDark,
  sizePx,
  reducedMotion,
}: {
  isDark: boolean
  sizePx: number
  reducedMotion: boolean
}) {
  const rawId = React.useId().replace(/:/g, "")
  const maskId = \`eclipse-mask-\${rawId}\`
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const }

  const rayAngles = [0, 45, 90, 135, 180, 225, 270, 315]

  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <motion.circle
            cx={12}
            cy={12}
            r={6}
            fill="black"
            initial={false}
            animate={isDark ? { cx: 16.5, cy: 8.5, r: 5.8 } : { cx: 26, cy: 3, r: 0 }}
            transition={transition}
          />
        </mask>
      </defs>

      <motion.circle
        cx="12"
        cy="12"
        r={5}
        fill="currentColor"
        mask={\`url(#\${maskId})\`}
        initial={false}
        animate={{ r: isDark ? 6.5 : 4.5 }}
        transition={transition}
      />

      <motion.g
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.55 : 1, rotate: isDark ? 45 : 0 }}
        transition={transition}
        style={{ transformOrigin: "12px 12px" }}
      >
        {rayAngles.map((deg) => {
          const rad = (deg * Math.PI) / 180
          const x1 = 12 + Math.cos(rad) * 7.5
          const y1 = 12 + Math.sin(rad) * 7.5
          const x2 = 12 + Math.cos(rad) * 9.8
          const y2 = 12 + Math.sin(rad) * 9.8
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </motion.g>
    </svg>
  )
}

const DIAL_ORDER: ThemeMode[] = ["light", "system", "dark"]

export function DarkModeToggle({
  theme: controlledTheme,
  variant = "pill",
  size = "md",
  showLabel = false,
  storageKey = "nexore-theme",
  onChange,
  className,
}: DarkModeToggleProps) {
  const shouldReduceMotion = Boolean(useReducedMotion())
  const instanceId = React.useId().replace(/:/g, "")
  const [internalTheme, setInternalTheme] = React.useState<ThemeMode>("system")
  const [resolvedDark, setResolvedDark] = React.useState(
    controlledTheme === "light" ? false : true
  )
  const radioRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (controlledTheme === undefined) {
      try {
        const stored = window.localStorage.getItem(storageKey) as ThemeMode | null
        if (stored === "light" || stored === "dark" || stored === "system") {
          setInternalTheme(stored)
        }
      } catch {
      }
    }
  }, [controlledTheme, storageKey])

  const activeTheme: ThemeMode =
    controlledTheme !== undefined ? controlledTheme : internalTheme

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const sync = () => {
      const dark = activeTheme === "dark" || (activeTheme === "system" && mq.matches)
      setResolvedDark(dark)
      if (controlledTheme === undefined) {
        applyThemeToDocument(activeTheme)
      }
    }
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [activeTheme, controlledTheme])

  const handleToggle = (newTheme: ThemeMode) => {
    if (controlledTheme === undefined) {
      setInternalTheme(newTheme)
      try {
        window.localStorage.setItem(storageKey, newTheme)
      } catch {
      }
      applyThemeToDocument(newTheme)
    }
    onChange?.(newTheme)
  }

  const handleRadioKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    modes: readonly ThemeMode[],
    index: number
  ) => {
    let nextIndex = -1
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = (index + 1) % modes.length
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex = (index - 1 + modes.length) % modes.length
    } else if (e.key === "Home") {
      nextIndex = 0
    } else if (e.key === "End") {
      nextIndex = modes.length - 1
    }
    if (nextIndex !== -1) {
      e.preventDefault()
      handleToggle(modes[nextIndex])
      radioRefs.current[nextIndex]?.focus()
    }
  }

  if (variant === "icon") {
    const iconPx = size === "sm" ? 15 : size === "lg" ? 20 : 17
    return (
      <button
        type="button"
        onClick={() => handleToggle(resolvedDark ? "light" : "dark")}
        className={cn(
          "relative flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors duration-200 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          size === "sm" ? "w-8 h-8" : size === "lg" ? "w-11 h-11" : "w-9 h-9",
          className
        )}
        title={\`Switch to \${resolvedDark ? "light" : "dark"} theme\`}
        aria-label={\`Switch to \${resolvedDark ? "light" : "dark"} theme\`}
      >
        <EclipseGlyph
          isDark={resolvedDark}
          sizePx={iconPx}
          reducedMotion={shouldReduceMotion}
        />
      </button>
    )
  }

  if (variant === "dial") {
    const dialAngle = activeTheme === "light" ? 0 : activeTheme === "system" ? 90 : 180
    const nextMode = DIAL_ORDER[(DIAL_ORDER.indexOf(activeTheme) + 1) % DIAL_ORDER.length]

    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <button
          type="button"
          onClick={() => handleToggle(nextMode)}
          onKeyDown={(e) => {
            const idx = DIAL_ORDER.indexOf(activeTheme)
            if (e.key === "ArrowRight") {
              e.preventDefault()
              handleToggle(DIAL_ORDER[(idx + 1) % DIAL_ORDER.length])
            } else if (e.key === "ArrowLeft") {
              e.preventDefault()
              handleToggle(DIAL_ORDER[(idx - 1 + DIAL_ORDER.length) % DIAL_ORDER.length])
            }
          }}
          aria-label={\`Theme dial: \${activeTheme}. Click to switch to \${nextMode}\`}
          className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card hover:bg-muted/60 px-3 py-1.5 text-foreground shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <svg width="34" height="20" viewBox="0 0 36 22" fill="none" aria-hidden="true">
            <path
              d="M 6 17 A 12 12 0 0 1 30 17"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="17"
              x2="32"
              y2="17"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="6" cy="17" r="1.25" fill="currentColor" fillOpacity="0.45" />
            <circle cx="18" cy="5" r="1.25" fill="currentColor" fillOpacity="0.45" />
            <circle cx="30" cy="17" r="1.25" fill="currentColor" fillOpacity="0.45" />
            <motion.g
              initial={false}
              animate={{ rotate: dialAngle }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 360, damping: 28 }
              }
              style={{ transformOrigin: "18px 17px" }}
            >
              <line
                x1="18"
                y1="17"
                x2="6"
                y2="17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="6" cy="17" r="2.75" fill="currentColor" />
            </motion.g>
          </svg>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider min-w-[50px] text-left">
            {activeTheme}
          </span>
        </button>
      </div>
    )
  }

  if (variant === "segmented") {
    const modes: readonly ThemeMode[] = ["light", "dark", "system"]
    return (
      <div
        role="radiogroup"
        aria-label="Theme mode"
        className={cn(
          "inline-flex items-center gap-1 p-1 rounded-xl border border-border bg-muted/40 shadow-xs",
          className
        )}
      >
        {modes.map((t, idx) => {
          const isActive = activeTheme === t
          return (
            <button
              key={t}
              ref={(el) => {
                radioRefs.current[idx] = el
              }}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={\`\${t} theme\`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleToggle(t)}
              onKeyDown={(e) => handleRadioKeyDown(e, modes, idx)}
              className={cn(
                "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={\`theme-seg-\${instanceId}\`}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 440, damping: 34 }
                  }
                  className="absolute inset-0 rounded-lg bg-card border border-border shadow-xs z-0"
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                {t === "light" && <Sun className="w-3.5 h-3.5" />}
                {t === "dark" && <Moon className="w-3.5 h-3.5" />}
                {t === "system" && <Monitor className="w-3.5 h-3.5" />}
                {showLabel && <span>{t}</span>}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === "card") {
    const cards: {
      id: ThemeMode
      label: string
      desc: string
      icon: React.ReactNode
    }[] = [
      { id: "light", label: "Light", desc: "High-key daylight surface", icon: <Sun className="w-3.5 h-3.5" /> },
      { id: "dark", label: "Dark", desc: "Low-glare studio surface", icon: <Moon className="w-3.5 h-3.5" /> },
      { id: "system", label: "System", desc: "Matches OS preference", icon: <Monitor className="w-3.5 h-3.5" /> },
    ]

    const lightCanvasClass = resolvedDark
      ? "bg-foreground text-background border-foreground/20"
      : "bg-background text-foreground border-border"
    const lightBarMuted = resolvedDark ? "bg-background/20" : "bg-muted"
    const lightBarSolid = resolvedDark ? "bg-background/70" : "bg-foreground/70"

    const darkCanvasClass = resolvedDark
      ? "bg-background text-foreground border-border"
      : "bg-foreground text-background border-foreground/20"
    const darkBarMuted = resolvedDark ? "bg-muted" : "bg-background/20"
    const darkBarSolid = resolvedDark ? "bg-foreground/70" : "bg-background/70"

    return (
      <div
        role="radiogroup"
        aria-label="Theme preset"
        className={cn("grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg", className)}
      >
        {cards.map((item, idx) => {
          const isActive = activeTheme === item.id
          return (
            <button
              key={item.id}
              ref={(el) => {
                radioRefs.current[idx] = el
              }}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleToggle(item.id)}
              onKeyDown={(e) => handleRadioKeyDown(e, DIAL_ORDER, idx)}
              className={cn(
                "flex flex-col items-start gap-2.5 rounded-xl border p-3 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "border-foreground bg-card text-foreground shadow-xs"
                  : "border-border bg-muted/25 text-muted-foreground hover:text-foreground hover:bg-muted/45"
              )}
            >
              <div className="w-full h-14 rounded-lg border overflow-hidden grid grid-cols-1">
                {item.id === "light" && (
                  <div className={cn("p-2 flex flex-col justify-between h-full border-0", lightCanvasClass)}>
                    <div className="flex items-center justify-between">
                      <span className={cn("h-1.5 w-8 rounded-full", lightBarSolid)} />
                      <span className={cn("h-2 w-2 rounded-full", lightBarSolid)} />
                    </div>
                    <div className="space-y-1">
                      <span className={cn("block h-1.5 w-full rounded-full", lightBarMuted)} />
                      <span className={cn("block h-1.5 w-2/3 rounded-full", lightBarMuted)} />
                    </div>
                  </div>
                )}
                {item.id === "dark" && (
                  <div className={cn("p-2 flex flex-col justify-between h-full border-0", darkCanvasClass)}>
                    <div className="flex items-center justify-between">
                      <span className={cn("h-1.5 w-8 rounded-full", darkBarSolid)} />
                      <span className={cn("h-2 w-2 rounded-full", darkBarSolid)} />
                    </div>
                    <div className="space-y-1">
                      <span className={cn("block h-1.5 w-full rounded-full", darkBarMuted)} />
                      <span className={cn("block h-1.5 w-2/3 rounded-full", darkBarMuted)} />
                    </div>
                  </div>
                )}
                {item.id === "system" && (
                  <div className="grid grid-cols-2 h-full">
                    <div className={cn("p-1.5 flex flex-col justify-between border-r border-border", lightCanvasClass)}>
                      <span className={cn("h-1.5 w-5 rounded-full", lightBarSolid)} />
                      <span className={cn("h-1.5 w-full rounded-full", lightBarMuted)} />
                    </div>
                    <div className={cn("p-1.5 flex flex-col justify-between", darkCanvasClass)}>
                      <span className={cn("h-1.5 w-5 rounded-full", darkBarSolid)} />
                      <span className={cn("h-1.5 w-full rounded-full", darkBarMuted)} />
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {isActive && <Check className="w-3.5 h-3.5 text-foreground shrink-0" />}
                </div>
                <div className="text-[11px] text-muted-foreground leading-snug">
                  {item.desc}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  const dimensions =
    size === "sm"
      ? { track: "w-11 h-6 p-0.5", thumb: "w-5 h-5", icon: "w-2.5 h-2.5", offset: 20 }
      : size === "lg"
      ? { track: "w-16 h-8 p-1", thumb: "w-6 h-6", icon: "w-3.5 h-3.5", offset: 32 }
      : { track: "w-14 h-7 p-0.5", thumb: "w-6 h-6", icon: "w-3 h-3", offset: 28 }

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={resolvedDark}
        onClick={() => handleToggle(resolvedDark ? "light" : "dark")}
        className={cn(
          "relative flex items-center rounded-full transition-colors duration-200 border border-border shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          resolvedDark ? "bg-foreground" : "bg-muted",
          dimensions.track
        )}
        title={\`Switch to \${resolvedDark ? "light" : "dark"} mode\`}
        aria-label="Toggle dark mode"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.5"
        >
          <Sun
            className={cn(
              dimensions.icon,
              resolvedDark ? "text-background/45" : "text-transparent"
            )}
          />
          <Moon
            className={cn(
              dimensions.icon,
              resolvedDark ? "text-transparent" : "text-muted-foreground/70"
            )}
          />
        </span>

        <motion.span
          initial={false}
          animate={{ x: resolvedDark ? dimensions.offset : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
          className={cn(
            "relative z-10 rounded-full bg-background text-foreground shadow-xs flex items-center justify-center",
            dimensions.thumb
          )}
        >
          {resolvedDark ? <Moon className={dimensions.icon} /> : <Sun className={dimensions.icon} />}
        </motion.span>
      </button>

      {showLabel && (
        <span className="text-xs font-mono font-medium text-foreground capitalize select-none">
          {activeTheme} mode
        </span>
      )}
    </div>
  )
}
`
};

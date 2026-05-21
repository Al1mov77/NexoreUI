"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// Re-export standard button variants as alias wrappers for backward compatibility
export { GlowButton as NeonGlowButton, GradientButton as OutlineGradientButton, GlassButton as GlassmorphButton } from "./button"

// ============================================
// 1. MorphButton — Shape morphing button
// ============================================
export function MorphButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props
  return (
    <motion.button
      className={cn(
        "relative px-6 py-2.5 rounded-lg font-semibold bg-primary text-primary-foreground border border-primary/20",
        className
      )}
      whileHover={{
        borderRadius: "24px",
        scale: 1.05,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...motionSafeProps}
    >
      {children}
    </motion.button>
  )
}

// ============================================
// 2. SplitButton
// ============================================
export function SplitButton({ primary, secondary, onPrimary, onSecondary, className }: {
  primary: string
  secondary: string
  onPrimary?: () => void
  onSecondary?: () => void
  className?: string
}) {
  return (
    <div className={cn("inline-flex rounded-lg overflow-hidden shadow-sm", className)}>
      <button onClick={onPrimary} className="px-4 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
        {primary}
      </button>
      <button onClick={onSecondary} className="px-3 py-2 bg-primary/80 text-primary-foreground border-l border-primary-foreground/20 hover:bg-primary/70 transition-colors">
        {secondary}
      </button>
    </div>
  )
}

// ============================================
// 3. CopyTextButton — Copy text to clipboard with visual feedback
// ============================================
export function CopyTextButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <button
      className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-all active:scale-95", className)}
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
    >
      <span className="truncate max-w-[200px]">{text}</span>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.svg key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></motion.svg>
        ) : (
          <motion.svg key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></motion.svg>
        )}
      </AnimatePresence>
    </button>
  )
}

// ============================================
// 4. ExpandButton — Expands on hover to show icon
// ============================================
export function ExpandButton({ children, icon, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode }) {
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props
  return (
    <motion.button
      className={cn("inline-flex items-center gap-0 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold overflow-hidden", className)}
      whileHover="expanded"
      initial="collapsed"
      {...motionSafeProps}
    >
      <span>{children}</span>
      <motion.span
        variants={{
          collapsed: { width: 0, opacity: 0, marginLeft: 0 },
          expanded: { width: "auto", opacity: 1, marginLeft: 8 }
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="overflow-hidden"
      >
        {icon}
      </motion.span>
    </motion.button>
  )
}

// ============================================
// 5. StatusButton — Shows loading/success/error states
// ============================================
export function StatusButton({ status = "idle", children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { status?: "idle" | "loading" | "success" | "error" }) {
  const variants: Record<string, { bg: string; text: string }> = {
    idle: { bg: "bg-primary", text: "text-primary-foreground" },
    loading: { bg: "bg-yellow-500 dark:bg-yellow-600", text: "text-white" },
    success: { bg: "bg-emerald-500 dark:bg-emerald-600", text: "text-white" },
    error: { bg: "bg-red-500 dark:bg-red-600", text: "text-white" },
  }
  const v = variants[status]
  return (
    <button className={cn("relative px-5 py-2.5 rounded-lg font-semibold transition-all duration-300", v.bg, v.text, status === "loading" && "animate-pulse", className)} disabled={status === "loading"} {...props}>
      <AnimatePresence mode="wait">
        <motion.span key={status} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="inline-flex items-center gap-2">
          {status === "loading" && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {status === "success" && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          {status === "error" && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
          {status === "idle" ? children : status === "loading" ? "Loading..." : status === "success" ? "Done!" : "Failed"}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

// ============================================
// 6. SegmentedButton — Button group with selection
// ============================================
export function SegmentedButton({ options, value, onChange, className }: {
  options: string[]
  value: string
  onChange: (val: string) => void
  className?: string
}) {
  return (
    <div className={cn("inline-flex rounded-lg bg-muted p-1 gap-0.5", className)}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "relative px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            value === opt ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {value === opt && (
            <motion.div layoutId="segmented-bg" className="absolute inset-0 bg-background rounded-md shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
          )}
          <span className="relative z-10">{opt}</span>
        </button>
      ))}
    </div>
  )
}

// ============================================
// 7. TextButton — Minimal text with underline animation
// ============================================
export function TextButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "relative font-medium text-foreground group transition-colors",
        className
      )}
      {...props}
    >
      {children}
      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </button>
  )
}

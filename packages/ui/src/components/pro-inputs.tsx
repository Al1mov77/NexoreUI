"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. GradientInput — Gradient border on focus
// ============================================
export function GradientFocusInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = React.useState(false)
  return (
    <div className={cn("relative rounded-lg p-[2px]", focused ? "bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500" : "bg-border", className)}>
      <input
        className="w-full px-4 py-2.5 rounded-[6px] bg-background text-foreground text-sm outline-none placeholder:text-muted-foreground"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </div>
  )
}

// ============================================
// 2. AnimatedLabelInput — Label slides up on focus
// ============================================
export function AnimatedLabelInput({ label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const [focused, setFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)
  const active = focused || hasValue

  return (
    <div className={cn("relative", className)}>
      <input
        className="w-full px-4 pt-5 pb-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all peer"
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(!!e.target.value) }}
        placeholder=" "
        {...props}
      />
      <label className={cn(
        "absolute left-4 transition-all duration-200 pointer-events-none",
        active ? "top-1.5 text-[10px] text-primary font-medium" : "top-3.5 text-sm text-muted-foreground"
      )}>
        {label}
      </label>
    </div>
  )
}

// ============================================
// 3. OTPInput — One-time passcode input
// ============================================
export function OTPCodeInput({ length = 6, className, onChange }: { length?: number; className?: string; onChange?: (val: string) => void }) {
  const [values, setValues] = React.useState<string[]>(Array(length).fill(""))
  const refs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return
    const newVals = [...values]
    newVals[i] = v.slice(-1)
    setValues(newVals)
    onChange?.(newVals.join(""))
    if (v && i < length - 1) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[i] && i > 0) refs.current[i - 1]?.focus()
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-12 text-center text-lg font-mono rounded-lg border border-border bg-background text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
        />
      ))}
    </div>
  )
}

// ============================================
// 4. TagInput — Input with tags
// ============================================
export function TagInput({ placeholder = "Add tag...", className }: { placeholder?: string; className?: string }) {
  const [tags, setTags] = React.useState<string[]>(["React", "TypeScript"])
  const [input, setInput] = React.useState("")

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setInput("")
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-border bg-background min-h-[44px]", className)}>
      <AnimatePresence>
        {tags.map((tag) => (
          <motion.span
            key={tag}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
          >
            {tag}
            <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-destructive">×</button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        className="flex-1 min-w-[100px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
        placeholder={placeholder}
      />
    </div>
  )
}

// ============================================
// 5. SearchCommandInput — Search with keyboard shortcut
// ============================================
export function SearchCommandInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      <input
        className="w-full pl-10 pr-16 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
        placeholder="Search..."
        {...props}
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border">⌘K</kbd>
    </div>
  )
}

// ============================================
// 6. CurrencyInput
// ============================================
export function CurrencyInput({ currency = "$", className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { currency?: string }) {
  return (
    <div className={cn("relative", className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">{currency}</span>
      <input
        type="number"
        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
        placeholder="0.00"
        {...props}
      />
    </div>
  )
}

// ============================================
// 7. TextareaAutosize — Auto-expanding textarea
// ============================================
export function TextareaAutosize({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = React.useRef<HTMLTextAreaElement>(null)

  const handleInput = () => {
    if (!ref.current) return
    ref.current.style.height = "auto"
    ref.current.style.height = ref.current.scrollHeight + "px"
  }

  return (
    <textarea
      ref={ref}
      onInput={handleInput}
      className={cn(
        "w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none min-h-[80px] placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

// ============================================
// 8. RangeSliderInput
// ============================================
export function RangeSliderInput({ min = 0, max = 100, value: initialValue = 50, label, className }: {
  min?: number; max?: number; value?: number; label?: string; className?: string
}) {
  const [value, setValue] = React.useState(initialValue)
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("space-y-2", className)}>
      {label && <div className="flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>}
      <div className="relative h-2 rounded-full bg-secondary">
        <div className="absolute h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        <input
          type="range" min={min} max={max} value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary border-2 border-primary-foreground shadow-lg transition-all pointer-events-none" style={{ left: `calc(${pct}% - 10px)` }} />
      </div>
    </div>
  )
}

// ============================================
// 9. ColorPickerInput
// ============================================
export function ColorPickerInput({ value: initial = "#8b5cf6", label, className, onChange }: {
  value?: string; label?: string; className?: string; onChange?: (color: string) => void
}) {
  const [color, setColor] = React.useState(initial)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <div className="w-10 h-10 rounded-lg border-2 border-border overflow-hidden" style={{ backgroundColor: color }} />
        <input
          type="color" value={color}
          onChange={(e) => { setColor(e.target.value); onChange?.(e.target.value) }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <div>
        {label && <p className="text-sm font-medium">{label}</p>}
        <p className="text-xs text-muted-foreground font-mono">{color}</p>
      </div>
    </div>
  )
}

// ============================================
// 10. ToggleInput — Input with inline toggle
// ============================================
export function ToggleInput({ label, className }: { label: string; className?: string }) {
  const [enabled, setEnabled] = React.useState(false)

  return (
    <div className={cn("flex items-center justify-between p-3 rounded-lg border border-border bg-background", className)}>
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={cn("relative w-11 h-6 rounded-full transition-colors", enabled ? "bg-primary" : "bg-muted")}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ left: enabled ? "22px" : "2px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}

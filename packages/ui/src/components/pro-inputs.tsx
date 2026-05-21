"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// Re-export standard input variants for backward compatibility
export { GradientInput as GradientFocusInput, FloatingLabelInput as AnimatedLabelInput, SearchInput as SearchCommandInput } from "./input"

// ============================================
// 1. OTPInput — One-time passcode input
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
// 2. TagInput — Input with tags
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
// 3. CurrencyInput
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
// 4. TextareaAutosize — Auto-expanding textarea
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
// 5. ColorPickerInput
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

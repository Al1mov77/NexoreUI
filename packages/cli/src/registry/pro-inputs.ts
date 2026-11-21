export const proInputs = {
  name: "pro-inputs",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion"
],
  fileName: "pro-inputs.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

export function OTPCodeInput({ length = 6, className, onChange }: { length?: number; className?: string; onChange?: (val: string) => void }) {
  const [values, setValues] = React.useState<string[]>(() => Array(length).fill(""))
  const refs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (i: number, v: string) => {
    const digits = v.replace(/\\D/g, "")
    if (!digits && v !== "") return
    const newVals = [...values]
    newVals[i] = digits.slice(-1)
    setValues(newVals)
    onChange?.(newVals.join(""))
    if (digits && i < length - 1) refs.current[i + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\\D/g, "").slice(0, length)
    if (!pasted) return
    const newVals = Array.from({ length }, (_, idx) => pasted[idx] || "")
    setValues(newVals)
    onChange?.(newVals.join(""))
    const focusIdx = Math.min(pasted.length, length - 1)
    refs.current[focusIdx]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[i] && i > 0) refs.current[i - 1]?.focus()
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus()
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus()
  }

  return (
    <div className={cn("flex max-w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2", className)}>
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          aria-label={\`Digit \${i + 1} of \${length}\`}
          onChange={(e) => handleChange(i, e.target.value)}
          onPaste={handlePaste}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-9 h-10 sm:w-10 sm:h-11 text-center text-base sm:text-lg font-mono rounded-lg border border-border bg-background text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
        />
      ))}
    </div>
  )
}

export function TagInput({
  placeholder = "Add tag...",
  value,
  defaultValue = ["React", "TypeScript"],
  onChange,
  className,
}: {
  placeholder?: string
  value?: string[]
  defaultValue?: string[]
  onChange?: (tags: string[]) => void
  className?: string
}) {
  const [internalTags, setInternalTags] = React.useState<string[]>(defaultValue)
  const tags = value !== undefined ? value : internalTags
  const [input, setInput] = React.useState("")

  const updateTags = (next: string[]) => {
    if (value === undefined) setInternalTags(next)
    onChange?.(next)
  }

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      updateTags([...tags, trimmed])
      setInput("")
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-border bg-background min-h-[44px]", className)}>
      <AnimatePresence>
        {tags.map((tag) => (
          <motion.span
            key={tag}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              aria-label={\`Remove \${tag}\`}
              onClick={() => updateTags(tags.filter(t => t !== tag))}
              className="hover:text-destructive cursor-pointer"
            >
              ×
            </button>
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
`
};

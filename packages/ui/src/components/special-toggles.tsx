"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"
import { Checkbox } from "./checkbox"
import { Switch } from "./switch"
import { Check, X } from "lucide-react"

// ============================================
// 1. GlowCheckbox — Checkbox with glow effect when checked
// ============================================
export function GlowCheckbox({ className, ...props }: React.ComponentProps<typeof Checkbox>) {
  return (
    <div className="relative group inline-flex items-center justify-center">
      <div className="absolute -inset-1 bg-primary rounded-full blur opacity-0 group-has-[[data-state=checked]]:opacity-30 transition-opacity" />
      <Checkbox className={cn("relative", className)} {...props} />
    </div>
  )
}

// ============================================
// 2. CircularCheckbox — Round checkbox variant
// ============================================
export function CircularCheckbox({ className, ...props }: React.ComponentProps<typeof Checkbox>) {
  return (
    <Checkbox className={cn("rounded-full", className)} {...props} />
  )
}

// ============================================
// 3. CardCheckbox — Selectable card-style checkbox
// ============================================
export interface CardCheckboxProps {
  /** Title text for the card */
  title: string
  /** Optional description text */
  description?: string
  /** Whether the card is checked */
  checked?: boolean
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Additional CSS classes */
  className?: string
}

export function CardCheckbox({ title, description, checked, onCheckedChange, className }: CardCheckboxProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer rounded-lg border p-4 hover:bg-accent transition-colors",
        checked ? "border-primary bg-primary/5" : "border-border bg-card",
        className
      )}
    >
      <div className="flex flex-1 flex-col">
        <span className="font-medium">{title}</span>
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </div>
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} className="ml-4 mt-0.5 rounded-full" />
    </label>
  )
}

// ============================================
// 4. IconSwitch — Switch with icons inside the thumb
// ============================================
export interface IconSwitchProps {
  /** Whether the switch is checked */
  checked?: boolean
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Additional CSS classes */
  className?: string
  /** Icon/emoji to show when ON */
  iconOn?: React.ReactNode
  /** Icon/emoji to show when OFF */
  iconOff?: React.ReactNode
}

export function IconSwitch({ checked, onCheckedChange, className, iconOn, iconOff }: IconSwitchProps) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn("w-14 h-7", className)}
    >
      <span className={cn("pointer-events-none block h-6 w-6 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0 flex items-center justify-center")}>
        {checked ? (iconOn ? <span className="text-[10px]">{iconOn}</span> : <Check className="h-3 w-3 text-primary" />) : (iconOff ? <span className="text-[10px]">{iconOff}</span> : <X className="h-3 w-3 text-muted-foreground" />)}
      </span>
    </Switch>
  )
}

// ============================================
// 5. ThickSwitch — A thicker switch variant
// ============================================
export function ThickSwitch({ className, ...props }: React.ComponentProps<typeof Switch>) {
  return (
    <Switch 
      className={cn("h-8 w-16 [&>span]:h-6 [&>span]:w-6 [&>span[data-state=checked]]:translate-x-8", className)} 
      {...props} 
    />
  )
}

// ============================================
// 6. GlowSwitch — Switch with glow effect when checked
// ============================================
export function GlowSwitch({ className, ...props }: React.ComponentProps<typeof Switch>) {
  return (
    <div className="relative group inline-flex items-center">
      <div className="absolute -inset-1 bg-primary rounded-full blur opacity-0 group-has-[[data-state=checked]]:opacity-40 transition-opacity" />
      <Switch className={cn("relative", className)} {...props} />
    </div>
  )
}

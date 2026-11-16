"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"
import { Check, Upload, Star, Plus, Minus } from "lucide-react"

export interface RadioCardProps {
  title: string
  description?: string
  checked?: boolean
  selected?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: () => void
  value?: string
  name?: string
}

export const RadioCard = ({ title, description, checked, selected, onChange, onClick, value, name }: RadioCardProps) => {
  const isChecked = checked ?? selected;
  return (
    <label onClick={onClick} className={cn("relative flex cursor-pointer rounded-lg border p-4 hover:bg-accent transition-all", isChecked ? "border-primary bg-primary/5 shadow-xs" : "border-border bg-card")}>
      <input type="radio" name={name} value={value} checked={isChecked} onChange={onChange} className="sr-only" />
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{title}</span>
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
        <div className={cn("flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors", isChecked ? "border-primary bg-primary" : "border-muted-foreground")}>
          {isChecked && <div className="h-2 w-2 rounded-full bg-background" />}
        </div>
      </div>
    </label>
  );
};

export interface ColorSwatchProps {
  color: string
  selected?: boolean
  onClick?: () => void
}

export const ColorSwatch = ({ color, selected, onClick }: ColorSwatchProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn("relative flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-105 cursor-pointer", selected && "ring-2 ring-primary ring-offset-2 ring-offset-background")}
    style={{ backgroundColor: color }}
  >
    {selected && <Check className="h-4 w-4 text-white drop-shadow-sm" />}
  </button>
)

export interface NumberStepperProps {
  value?: number
  onChange?: (val: number) => void
  min?: number
  max?: number
}

export const NumberStepper = ({ value = 0, onChange, min = 0, max = 100 }: NumberStepperProps) => (
  <div className="flex items-center space-x-2 rounded-md border border-border p-1 w-fit bg-card">
    <button type="button" onClick={() => onChange?.(Math.max(min, value - 1))} className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer"><Minus className="h-4 w-4" /></button>
    <div className="w-8 text-center font-mono font-medium text-sm tabular-nums">{value}</div>
    <button type="button" onClick={() => onChange?.(Math.min(max, value + 1))} className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer"><Plus className="h-4 w-4" /></button>
  </div>
)

export interface FileDropzoneProps {
  onDrop?: (files: FileList) => void
  className?: string
}

export const FileDropzone = ({ onDrop: _onDrop, className }: FileDropzoneProps) => (
  <div className={cn("flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl bg-card hover:bg-accent/40 transition-colors cursor-pointer group", className)}>
    <div className="p-3.5 rounded-full bg-muted group-hover:bg-background transition-colors mb-2">
      <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    <p className="text-sm font-medium">Click or drag file to this area to upload</p>
    <p className="text-xs text-muted-foreground mt-1">Direct upload supporting standard formats.</p>
  </div>
)

export interface RatingStarsProps {
  rating?: number
  value?: number
  max?: number
  onRate?: (rate: number) => void
  onChange?: (rate: number) => void
}

export const RatingStars = ({ rating = 0, value, max = 5, onRate, onChange }: RatingStarsProps) => {
  const currentRating = value ?? rating;
  const handleRate = onChange ?? onRate;
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: max }).map((_, i) => (
        <button key={i} type="button" onClick={() => handleRate?.(i + 1)} className="p-1 focus:outline-none transition-transform hover:scale-105 cursor-pointer">
          <Star className={cn("h-5 w-5", i < currentRating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground")} />
        </button>
      ))}
    </div>
  );
};

export interface ToggleGroupItemWrapperProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export const ToggleGroupItemWrapper = ({ children, active, onClick }: ToggleGroupItemWrapperProps) => (
  <button type="button" onClick={onClick} className={cn("px-4 py-2 text-sm font-medium transition-colors border border-transparent cursor-pointer", active ? "bg-background text-foreground shadow-xs rounded-md" : "text-muted-foreground hover:text-foreground")}>
    {children}
  </button>
)

export interface ToggleGroupWrapperProps {
  children: React.ReactNode
}

export const ToggleGroupWrapper = ({ children }: ToggleGroupWrapperProps) => (
  <div className="inline-flex items-center rounded-lg bg-muted p-1">{children}</div>
)

export interface InputWithLabelOverlayProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export const InputWithLabelOverlay = ({ label, id, ...props }: InputWithLabelOverlayProps) => (
  <div className="relative">
    <input id={id} className="block w-full rounded-md border border-border bg-background px-3 pb-2 pt-6 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary peer" placeholder=" " {...props} />
    <label htmlFor={id} className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary cursor-text">
      {label}
    </label>
  </div>
)

export interface VisualSelectCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  selected?: boolean
}

export const VisualSelectCard = ({ icon: Icon, title, description, selected }: VisualSelectCardProps) => (
  <div className={cn("flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all cursor-pointer hover:border-primary", selected ? "border-primary bg-primary/5" : "border-border bg-card")}>
    <Icon className={cn("h-7 w-7 mb-3", selected ? "text-primary" : "text-muted-foreground")} />
    <h3 className="font-semibold text-sm mb-1">{title}</h3>
    {description && <p className="text-xs text-muted-foreground">{description}</p>}
  </div>
)

export interface FloatingActionFormProps {
  isOpen: boolean
  toggle: () => void
  children: React.ReactNode
}

export const FloatingActionForm = ({ isOpen, toggle, children }: FloatingActionFormProps) => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <div className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            className="absolute bottom-16 right-0 w-80 bg-card border rounded-xl shadow-lg p-4 origin-bottom-right"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" onClick={toggle} className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer">
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }}><Plus className="h-5 w-5" /></motion.div>
      </button>
    </div>
  )
}

export interface OTPInputProps {
  length?: number
}

export const OTPInput = ({ length = 6 }: OTPInputProps) => (
  <div className="flex space-x-2">
    {Array.from({ length }).map((_, i) => (
      <input key={i} type="text" maxLength={1} className="w-11 h-13 text-center text-lg font-mono font-bold rounded-md border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
    ))}
  </div>
)

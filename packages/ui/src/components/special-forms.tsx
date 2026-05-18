"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"
import { Check, Upload, Star, Plus, Minus } from "lucide-react"

// 1. RadioCard
export const RadioCard = ({ title, description, checked, onChange, value, name }: any) => (
  <label className={cn("relative flex cursor-pointer rounded-lg border p-4 hover:bg-accent transition-all", checked ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card")}>
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
    <div className="flex w-full justify-between items-center">
      <div className="flex flex-col">
        <span className="font-semibold">{title}</span>
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </div>
      <div className={cn("flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors", checked ? "border-primary bg-primary" : "border-muted-foreground")}>
        {checked && <div className="h-2.5 w-2.5 rounded-full bg-background" />}
      </div>
    </div>
  </label>
)

// 2. ColorSwatch
export const ColorSwatch = ({ color, selected, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={cn("relative flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110", selected && "ring-2 ring-primary ring-offset-2 ring-offset-background")}
    style={{ backgroundColor: color }}
  >
    {selected && <Check className="h-5 w-5 text-white drop-shadow-md" />}
  </button>
)

// 3. NumberStepper
export const NumberStepper = ({ value = 0, onChange, min = 0, max = 100 }: any) => (
  <div className="flex items-center space-x-2 rounded-md border border-border p-1 w-fit bg-card">
    <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"><Minus className="h-4 w-4" /></button>
    <div className="w-8 text-center font-medium text-sm">{value}</div>
    <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"><Plus className="h-4 w-4" /></button>
  </div>
)

// 4. FileDropzone
export const FileDropzone = ({ onDrop }: any) => (
  <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-xl bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
    <div className="p-4 rounded-full bg-muted group-hover:bg-background transition-colors mb-2">
      <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    <p className="text-sm font-medium">Click or drag file to this area to upload</p>
    <p className="text-xs text-muted-foreground mt-1">Support for a single or bulk upload.</p>
  </div>
)

// 5. RatingStars
export const RatingStars = ({ rating = 0, max = 5, onRate }: any) => (
  <div className="flex items-center space-x-1">
    {Array.from({ length: max }).map((_, i) => (
      <button key={i} type="button" onClick={() => onRate?.(i + 1)} className="p-1 focus:outline-none transition-transform hover:scale-110">
        <Star className={cn("h-6 w-6", i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground")} />
      </button>
    ))}
  </div>
)

// 6. ToggleGroupItem (Visual wrapper)
export const ToggleGroupItemWrapper = ({ children, active, onClick }: any) => (
  <button type="button" onClick={onClick} className={cn("px-4 py-2 text-sm font-medium transition-colors border border-transparent", active ? "bg-background text-foreground shadow-sm rounded-md" : "text-muted-foreground hover:text-foreground")}>
    {children}
  </button>
)

export const ToggleGroupWrapper = ({ children }: any) => (
  <div className="inline-flex items-center rounded-lg bg-muted p-1">{children}</div>
)

// 7. InputWithLabelOverlay
export const InputWithLabelOverlay = ({ label, id, ...props }: any) => (
  <div className="relative">
    <input id={id} className="block w-full rounded-md border border-border bg-background px-3 pb-2 pt-6 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary peer" placeholder=" " {...props} />
    <label htmlFor={id} className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary cursor-text">
      {label}
    </label>
  </div>
)

// 8. VisualSelectCard
export const VisualSelectCard = ({ icon: Icon, title, description, selected }: any) => (
  <div className={cn("flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all cursor-pointer hover:border-primary", selected ? "border-primary bg-primary/5" : "border-border bg-card")}>
    <Icon className={cn("h-8 w-8 mb-4", selected ? "text-primary" : "text-muted-foreground")} />
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
)

// 9. FloatingActionForm (Button that expands into form)
export const FloatingActionForm = ({ isOpen, toggle, children }: any) => (
  <div className="relative">
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} className="absolute bottom-16 right-0 w-80 bg-card border rounded-xl shadow-xl p-4 origin-bottom-right">
          {children}
        </motion.div>
      )}
    </AnimatePresence>
    <button type="button" onClick={toggle} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform active:scale-95">
      <motion.div animate={{ rotate: isOpen ? 45 : 0 }}><Plus className="h-6 w-6" /></motion.div>
    </button>
  </div>
)

// 10. OTPInput (Visual boxes)
export const OTPInput = ({ length = 6 }: any) => (
  <div className="flex space-x-2">
    {Array.from({ length }).map((_, i) => (
      <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold rounded-md border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
    ))}
  </div>
)

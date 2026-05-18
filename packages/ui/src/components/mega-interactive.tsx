"use client"

import * as React from "react"
import { Check, ChevronDown, X, Info, HelpCircle, Bell, Star, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// --- ACCORDIONS ---
export const SimpleAccordion = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="w-full max-w-md border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex justify-between items-center hover:bg-muted/50 transition-colors font-medium">
        <span>Is this library free?</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 text-sm text-muted-foreground border-t border-border/50 mt-2 pt-2">
              Yes, it is completely free and open source.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const PlusAccordion = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="w-full max-w-md border-b border-border/50">
      <button onClick={() => setOpen(!open)} className="w-full py-4 flex justify-between items-center font-medium hover:text-primary transition-colors">
        <span>How do I install it?</span>
        <div className="relative w-4 h-4 flex items-center justify-center">
          <div className="absolute w-4 h-0.5 bg-current rounded-full" />
          <div className={`absolute w-0.5 h-4 bg-current rounded-full transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm text-muted-foreground pb-4">
              You can install it via pnpm, npm, or yarn using the CLI.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const NeonAccordion = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <div className={`w-full max-w-md border rounded-xl overflow-hidden bg-black transition-all duration-300 ${open ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-neutral-800'}`}>
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex justify-between items-center font-medium text-white">
        <span className={open ? 'text-cyan-400' : 'text-white'}>Premium Features</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180 text-cyan-400' : 'text-white'}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 text-sm text-neutral-400 border-t border-neutral-800 mt-2 pt-2">
              Access to exclusive animated components and premium layouts.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- MODALS ---
export const BasicModal = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">Open Basic Modal</button>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-background rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 border border-border/50"
            >
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
              <h3 className="font-bold text-lg mb-2">Basic Modal</h3>
              <p className="text-muted-foreground text-sm mb-6">This is a simple modal dialog that can be used for various purposes.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-muted rounded-lg text-sm font-medium transition-colors">Cancel</button>
                <button onClick={() => setOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export const InteractiveGlassModal = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors">Open Glass Modal</button>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 border border-white/20 text-white"
            >
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/20">
                <Star className="w-6 h-6 text-yellow-300" />
              </div>
              <h3 className="font-bold text-xl mb-2">Premium Glass Effect</h3>
              <p className="text-white/70 text-sm mb-6">This modal uses full glassmorphism for a stunning visual effect.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">Maybe Later</button>
                <button onClick={() => setOpen(false)} className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">Upgrade Now</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export const DangerModal = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">Delete Account</button>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ rotate: 5, scale: 0.9, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -5, scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-background rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10 border border-destructive/20"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-2">Are you absolutely sure?</h3>
                <p className="text-muted-foreground text-sm">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
              </div>
              <div className="flex border-t border-border/50 bg-muted/50">
                <button onClick={() => setOpen(false)} className="flex-1 py-3 font-medium hover:bg-muted transition-colors border-r border-border/50">Cancel</button>
                <button onClick={() => setOpen(false)} className="flex-1 py-3 font-medium text-destructive hover:bg-destructive/10 transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

// --- CHECKBOXES ---
export const SimpleCheckbox = () => {
  const [checked, setChecked] = React.useState(false)
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${checked ? 'bg-primary border-primary text-primary-foreground scale-110' : 'border-border group-hover:border-primary'}`}>
        {checked && <Check className="w-3 h-3 stroke-[3]" />}
      </div>
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
      <span className="text-sm font-medium select-none text-muted-foreground group-hover:text-foreground transition-colors">Accept terms and conditions</span>
    </label>
  )
}

export const InteractiveCardCheckbox = ({ title = "Pro Plan", description = "$29/month. Billed annually.", checked: externalChecked, onCheckedChange, ...props }: any) => {
  const [localChecked, setLocalChecked] = React.useState(false)
  const isChecked = externalChecked !== undefined ? externalChecked : localChecked
  const setChecked = onCheckedChange || setLocalChecked

  return (
    <label className={`flex gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-300 ${isChecked ? 'border-primary ring-1 ring-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`} {...props}>
      <div className={`w-5 h-5 rounded-full border mt-0.5 flex shrink-0 items-center justify-center transition-all duration-200 ${isChecked ? 'bg-primary border-primary text-primary-foreground scale-110' : 'border-border'}`}>
        {isChecked && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
      </div>
      <input type="checkbox" className="hidden" checked={isChecked} onChange={(e) => setChecked(e.target.checked)} />
      <div>
        <div className={`font-medium transition-colors ${isChecked ? 'text-primary' : 'text-foreground'}`}>{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </label>
  )
}



// --- SWITCHES ---
export const SimpleSwitch = () => {
  const [checked, setChecked] = React.useState(false)
  return (
    <div className="flex items-center justify-between w-full max-w-xs p-3 border rounded-lg bg-muted/20">
      <span className="text-sm font-medium">Airplane Mode</span>
      <button 
        onClick={() => setChecked(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-background absolute top-0.5 transition-transform duration-300 shadow-md ${checked ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
      </button>
    </div>
  )
}

export const NeonSwitch = () => {
  const [checked, setChecked] = React.useState(false)
  return (
    <div className="flex items-center justify-between w-full max-w-xs p-3 border border-neutral-800 rounded-lg bg-black">
      <span className="text-sm font-medium text-white">Dark Energy</span>
      <button 
        onClick={() => setChecked(!checked)}
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${checked ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-neutral-800'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-300 shadow-md ${checked ? 'translate-x-[26px]' : 'translate-x-[2px]'}`} />
      </button>
    </div>
  )
}

// --- SELECTS ---
export const SimpleSelect = () => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("Apple")
  const options = ["Apple", "Banana", "Orange", "Grape"]
  
  return (
    <div className="relative w-full max-w-xs">
      <button onClick={() => setOpen(!open)} className="w-full px-3 py-2 border border-border/50 rounded-lg flex justify-between items-center text-sm bg-card/50 backdrop-blur-sm hover:border-primary transition-colors">
        <span className="font-medium">{value}</span>
        <ChevronDown className={`w-4 h-4 opacity-50 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full mt-1 border border-border/50 rounded-lg bg-card backdrop-blur-md shadow-lg z-50 py-1"
          >
            {options.map(opt => (
              <div 
                key={opt} 
                onClick={() => { setValue(opt); setOpen(false); }}
                className={`px-3 py-2 text-sm hover:bg-muted cursor-pointer flex justify-between items-center ${value === opt ? 'text-primary font-medium' : 'text-foreground'}`}
              >
                {opt} {value === opt && <Check className="w-4 h-4" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- TOOLTIPS ---
interface SimpleTooltipProps {
  content: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  children?: React.ReactNode
}

export const SimpleTooltip = ({ content, position = "top", children }: SimpleTooltipProps) => {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2 origin-top",
    left: "right-full top-1/2 -translate-y-1/2 mr-2 origin-right",
    right: "left-full top-1/2 -translate-y-1/2 ml-2 origin-left",
  }

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-foreground",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-foreground",
    left: "left-full top-1/2 -translate-y-1/2 border-l-foreground",
    right: "right-full top-1/2 -translate-y-1/2 border-r-foreground",
  }

  return (
    <div className="group relative inline-block">
      {children ? (
        children
      ) : (
        <button className="p-3 border border-border/50 rounded-full hover:bg-muted/50 transition-colors bg-card/50 backdrop-blur-sm">
          <Info className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      )}
      <div className={`absolute z-50 w-max px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none shadow-lg ${positionClasses[position]}`}>
        {content}
        <div className={`absolute border-4 border-transparent ${arrowClasses[position]}`} />
      </div>
    </div>
  )
}

interface RichTooltipProps {
  content: React.ReactNode
  children?: React.ReactNode
}

export const RichTooltip = ({ content, children }: RichTooltipProps) => {
  return (
    <div className="group relative inline-block">
      {children ? (
        children
      ) : (
        <button className="p-3 border border-border/50 rounded-full hover:bg-muted/50 transition-colors bg-card/50 backdrop-blur-sm">
          <HelpCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      )}
      <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-card border border-border/50 rounded-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none origin-bottom shadow-xl backdrop-blur-md">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-card" />
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border/50 -z-10" />
      </div>
    </div>
  )
}

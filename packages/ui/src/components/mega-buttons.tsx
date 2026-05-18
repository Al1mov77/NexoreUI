"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

// 1. NeonButton
export const NeonButton = ({ children, ...props }: any) => (
  <button className="relative px-6 py-2 bg-black text-white font-bold rounded-lg group" {...props}>
    <span className="absolute inset-0 w-full h-full rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70 blur-md group-hover:opacity-100 transition-opacity duration-300"></span>
    <span className="relative z-10">{children}</span>
  </button>
)

// 2. ThreeDButton
export const ThreeDButton = ({ children, ...props }: any) => (
  <button className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow-[0_5px_0_hsl(var(--primary-dark,0,0%,30%))] hover:shadow-[0_2px_0_hsl(var(--primary-dark,0,0%,30%))] hover:translate-y-[3px] transition-all" {...props}>
    {children}
  </button>
)

// 3. RippleButton (Simplified CSS ripple)
export const RippleButton = ({ children, ...props }: any) => (
  <button className="relative overflow-hidden px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg group" {...props}>
    <span className="absolute inset-0 bg-white/20 scale-0 rounded-full group-active:scale-[2] transition-transform duration-500 origin-center"></span>
    <span className="relative z-10">{children}</span>
  </button>
)

// 4. CyberpunkButton
export const CyberpunkButton = ({ children, ...props }: any) => (
  <button className="px-6 py-2 bg-yellow-400 text-black font-extrabold uppercase tracking-widest border-2 border-black hover:bg-black hover:text-yellow-400 transition-colors shadow-[4px_4px_0_0_#000]" {...props}>
    {children}
  </button>
)

// 5. MagneticButton
export const MagneticButton = ({ children, ...props }: any) => (
  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="px-6 py-2 bg-secondary text-secondary-foreground font-medium rounded-full" {...props}>
    {children}
  </motion.button>
)

// 6. ShimmerButton
export const ShimmerButton = ({ children, ...props }: any) => (
  <button className="relative px-6 py-2 font-medium bg-slate-900 text-white rounded-lg overflow-hidden" {...props}>
    <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
    <span className="relative z-10">{children}</span>
  </button>
)

// 7. BorderBeamButton
export const BorderBeamButton = ({ children, ...props }: any) => (
  <button className="relative px-6 py-2 font-medium bg-background text-foreground rounded-lg overflow-hidden border border-border group" {...props}>
    <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
    <span className="relative z-10">{children}</span>
  </button>
)

// 8. LoadingButton
export const LoadingButton = ({ isLoading, children, ...props }: any) => (
  <button disabled={isLoading} className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg flex items-center gap-2 disabled:opacity-70" {...props}>
    {isLoading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>}
    {children}
  </button>
)

// 9. DestructiveGlowButton
export const DestructiveGlowButton = ({ children, ...props }: any) => (
  <button className="px-6 py-2 bg-destructive/10 text-destructive font-medium rounded-lg hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all" {...props}>
    {children}
  </button>
)

// 10. GhostOutlineButton
export const GhostOutlineButton = ({ children, ...props }: any) => (
  <button className="px-6 py-2 border-2 border-transparent hover:border-primary text-foreground hover:text-primary font-medium rounded-lg transition-colors" {...props}>
    {children}
  </button>
)

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

/** Polymorphic "as" prop type for typography components */
interface TypographyBaseProps {
  /** HTML element to render as */
  as?: React.ElementType
  /** Additional CSS classes */
  className?: string
  /** Content */
  children?: React.ReactNode
}

// ============================================
// 1. GradientText — Text with gradient fill
// ============================================
export function GradientText({ className, children, as: Component = "span" }: TypographyBaseProps) {
  return (
    <Component
      className={cn("text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500", className)}
    >
      {children}
    </Component>
  )
}

// ============================================
// 2. GlitchText — CSS-based glitch effect
// ============================================
export interface GlitchTextProps {
  /** The text to display with glitch effect */
  text: string
  /** HTML element to render as */
  as?: React.ElementType
  /** Additional CSS classes */
  className?: string
}

export function GlitchText({ className, text, as: Component = "span" }: GlitchTextProps) {
  return (
    <Component
      className={cn("relative inline-block font-bold", className)}
      data-text={text}
    >
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-[-1px] -z-10 w-full h-full text-red-500 opacity-70 translate-x-[2px] animate-pulse">{text}</span>
      <span className="absolute top-0 left-[1px] -z-10 w-full h-full text-blue-500 opacity-70 translate-x-[-2px] animate-pulse" style={{ animationDelay: '0.1s' }}>{text}</span>
    </Component>
  )
}

// ============================================
// 3. HighlightText — Highlighted/marked text
// ============================================
export interface HighlightTextProps extends TypographyBaseProps {
  /** Background color class for the highlight */
  color?: string
}

export function HighlightText({ className, children, color = "bg-yellow-200/50 dark:bg-yellow-800/50", as: Component = "mark" }: HighlightTextProps) {
  return (
    <Component
      className={cn("rounded-sm px-1 py-0.5 text-inherit", color, className)}
    >
      {children}
    </Component>
  )
}

// ============================================
// 4. RevealText — Text with reveal animation
// ============================================
export interface RevealTextProps {
  /** Text to reveal */
  text: string
  /** Additional CSS classes */
  className?: string
  /** Delay before animation starts (seconds) */
  delay?: number
}

export function RevealText({ text, className, delay = 0 }: RevealTextProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("inline-block", className)}
    >
      {text}
    </motion.span>
  )
}

// ============================================
// 5. OutlineText — Text with stroke outline
// ============================================
export function OutlineText({ className, children, as: Component = "span" }: TypographyBaseProps) {
  return (
    <Component
      className={cn("text-transparent stroke-foreground", className)}
      style={{ WebkitTextStroke: "1px currentColor" }}
    >
      {children}
    </Component>
  )
}

// ============================================
// 6. GlowText — Text with glow shadow
// ============================================
export function GlowText({ className, children, as: Component = "span" }: TypographyBaseProps) {
  return (
    <Component
      className={cn("text-foreground", className)}
      style={{ textShadow: "0 0 10px rgba(139, 92, 246, 0.5)" }}
    >
      {children}
    </Component>
  )
}

// ============================================
// 7. NeonText — Text with neon glow effect
// ============================================
export interface NeonTextProps extends TypographyBaseProps {
  /** Color for the neon glow */
  color?: string
}

export function NeonText({ className, children, color = "#ff007f", as: Component = "span" }: NeonTextProps) {
  return (
    <Component
      className={cn("font-bold text-white", className)}
      style={{ textShadow: `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}` }}
    >
      {children}
    </Component>
  )
}

// ============================================
// 8. BlurText — Text that unblurs on hover
// ============================================
export function BlurText({ className, children, as: Component = "span" }: TypographyBaseProps) {
  return (
    <Component
      className={cn("text-foreground filter blur-sm hover:blur-none transition-all duration-300", className)}
    >
      {children}
    </Component>
  )
}

// ============================================
// 9. ShadowText — Text with drop shadow
// ============================================
export function ShadowText({ className, children, as: Component = "span" }: TypographyBaseProps) {
  return (
    <Component
      className={cn("text-foreground font-bold", className)}
      style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.2)" }}
    >
      {children}
    </Component>
  )
}

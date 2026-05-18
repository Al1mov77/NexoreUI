"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "../utils/cn"
import { buttonVariants } from "./button"
import type { VariantProps } from "class-variance-authority"

/** Props shared by all special button variants */
interface SpecialButtonBaseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode
  className?: string
}

// ============================================
// 1. GlowButton — A button with a radial glow effect behind it
// ============================================
export interface GlowButtonProps extends SpecialButtonBaseProps {
  /** Color of the glow behind the button */
  glowColor?: string
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant, size, glowColor = "rgba(139, 92, 246, 0.15)", children, ...props }, ref) => {
    // Destructure props that conflict with framer-motion
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props

    return (
      <div className="relative group">
        <div
          className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
          style={{ backgroundColor: glowColor }}
        />
        <motion.button
          className={cn(buttonVariants({ variant, size, className }), "relative bg-background")}
          ref={ref}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          {...(motionSafeProps as HTMLMotionProps<"button">)}
        >
          {children}
        </motion.button>
      </div>
    )
  }
)
GlowButton.displayName = "GlowButton"

// ============================================
// 2. ShinyButton — A button with a shiny light effect moving across it
// ============================================
export const ShinyButton = React.forwardRef<HTMLButtonElement, SpecialButtonBaseProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props

    return (
      <motion.button
        className={cn(
          buttonVariants({ variant, size, className }),
          "relative overflow-hidden group"
        )}
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        {...(motionSafeProps as HTMLMotionProps<"button">)}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </motion.button>
    )
  }
)
ShinyButton.displayName = "ShinyButton"

// ============================================
// 3. GradientButton — A button with a beautiful gradient background
// ============================================
export const GradientButton = React.forwardRef<HTMLButtonElement, SpecialButtonBaseProps>(
  ({ className, size, children, ...props }, ref) => {
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, variant, ...motionSafeProps } = props as SpecialButtonBaseProps

    return (
      <motion.button
        className={cn(
          buttonVariants({ size, className }),
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:opacity-90 shadow-lg shadow-purple-500/20"
        )}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...(motionSafeProps as HTMLMotionProps<"button">)}
      >
        {children}
      </motion.button>
    )
  }
)
GradientButton.displayName = "GradientButton"

// ============================================
// 4. GlassButton — A glassmorphic button
// ============================================
export const GlassButton = React.forwardRef<HTMLButtonElement, SpecialButtonBaseProps>(
  ({ className, size, children, ...props }, ref) => {
    const { onDrag, onDragStart, onDragEnd, onAnimationStart, variant, ...motionSafeProps } = props as SpecialButtonBaseProps

    return (
      <motion.button
        className={cn(
          buttonVariants({ size, className }),
          "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-foreground"
        )}
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        {...(motionSafeProps as HTMLMotionProps<"button">)}
      >
        {children}
      </motion.button>
    )
  }
)
GlassButton.displayName = "GlassButton"

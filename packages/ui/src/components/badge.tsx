'use client';

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"
import { motion } from "framer-motion"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-default",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border hover:bg-accent",
        // New WOW Variants
        gradient: "border-transparent bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-sm",
        neon: "border-primary/50 bg-primary/10 text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]",
        success: "border-transparent bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-1.5 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Whether to show a pulse animation on the dot
   * @default false
   */
  pulse?: boolean;
  /**
   * Whether to show a dot indicator
   * @default false
   */
  dot?: boolean;
}

function Badge({ className, variant, size, pulse = false, dot = false, children, ...props }: BadgeProps) {
  const showDot = dot || pulse;
  
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {showDot && (
        <span className="relative flex h-2 w-2 mr-1">
          {pulse && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          )}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }

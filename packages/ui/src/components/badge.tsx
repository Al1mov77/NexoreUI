'use client';

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-default",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border hover:bg-accent",
        gradient: "border-transparent bg-gradient-to-r from-violet-600 to-pink-600 dark:from-violet-500 dark:to-pink-500 text-white shadow-sm",
        neon: "border-primary/50 bg-primary/10 text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]",
        success: "border-transparent bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
        warning: "border-transparent bg-amber-500/20 text-amber-600 dark:text-amber-400",
        info: "border-transparent bg-blue-500/20 text-blue-600 dark:text-blue-400",
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
   * Описание для pulse
   * @default undefined
   */
  pulse?: boolean;
  /**
   * Описание для dot
   * @default undefined
   */
  dot?: boolean;
  /**
   * Описание для text
   * @default undefined
   */
  text?: string;
}

function Badge({ className, variant, size, pulse = false, dot = false, children, text, ...props }: BadgeProps) {
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
      {children || text}
    </div>
  )
}

export { Badge, badgeVariants }

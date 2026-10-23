'use client';

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-default",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive/15 text-destructive border border-destructive/20",
        outline: "text-foreground border-border hover:bg-accent",
        /** @deprecated Use secondary instead */
        gradient: "border-transparent bg-secondary text-secondary-foreground shadow-xs",
        /** @deprecated Use outline instead */
        neon: "border-border bg-muted text-foreground shadow-xs",
        success: "border-transparent bg-success/15 text-success border border-success/20",
        warning: "border-transparent bg-warning/15 text-warning border border-warning/20",
        info: "border-transparent bg-info/15 text-info border border-info/20",
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
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-current opacity-50"></span>
          )}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children || text}
    </div>
  )
}

export { Badge, badgeVariants }

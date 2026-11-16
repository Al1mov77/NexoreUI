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
        gradient: "border-transparent bg-secondary text-secondary-foreground shadow-xs",
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
  pulse?: boolean;
  dot?: boolean;
  text?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, pulse = false, dot = false, children, text, ...props }, ref) => {
    const showDot = dot || pulse;

    return (
      <div ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
        {showDot && (
          <span className="relative flex h-2 w-2 mr-1">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
          </span>
        )}
        {children || text}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants }

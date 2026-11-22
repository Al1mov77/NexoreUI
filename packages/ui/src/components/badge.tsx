"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "../utils/cn"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-default select-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-destructive/25 bg-destructive/15 text-destructive",
        outline: "border-border bg-background text-foreground hover:bg-accent",
        muted: "border-border/70 bg-muted text-muted-foreground",
        gradient: "border-border bg-secondary text-secondary-foreground shadow-xs",
        neon: "border-foreground/25 bg-card text-foreground shadow-xs",
        success: "border-success/25 bg-success/15 text-success",
        warning: "border-warning/25 bg-warning/15 text-warning",
        info: "border-info/25 bg-info/15 text-info",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px] leading-tight",
        default: "px-2.5 py-0.5 text-xs leading-snug",
        lg: "px-3 py-1 text-sm leading-snug",
      },
      shape: {
        pill: "rounded-full",
        rounded: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "pill",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean
  dot?: boolean
  text?: string
  icon?: React.ReactNode
  count?: number | string
  removable?: boolean
  onRemove?: () => void
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      pulse = false,
      dot = false,
      icon,
      count,
      removable = false,
      onRemove,
      children,
      text,
      ...props
    },
    ref
  ) => {
    const showDot = dot || pulse
    const labelText = children ?? text

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, shape }), className)}
        {...props}
      >
        {showDot && (
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex h-1.5 w-1.5 rounded-full bg-current shrink-0",
              pulse && "ring-2 ring-current/25"
            )}
          />
        )}
        {icon && (
          <span className="inline-flex items-center justify-center shrink-0">
            {icon}
          </span>
        )}
        {labelText !== undefined && labelText !== null && (
          <span>{labelText}</span>
        )}
        {count !== undefined && (
          <span className="ml-0.5 border-l border-current/25 pl-1.5 font-mono text-[10px] font-semibold tabular-nums leading-none">
            {count}
          </span>
        )}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.()
            }}
            aria-label={typeof labelText === "string" ? `Remove ${labelText}` : "Remove"}
            className="ml-0.5 -mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full opacity-70 hover:opacity-100 hover:bg-foreground/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        )}
      </div>
    )
  }
)
Badge.displayName = "Badge"

export interface SplitBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: React.ReactNode
  variant?: VariantProps<typeof badgeVariants>["variant"]
  size?: "sm" | "default"
}

const splitValueToneMap: Record<string, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  destructive: "bg-destructive/15 text-destructive",
  default: "bg-card text-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "bg-background text-foreground",
  muted: "bg-muted/40 text-foreground",
  gradient: "bg-card text-foreground",
  neon: "bg-card text-foreground",
}

const SplitBadge = React.forwardRef<HTMLDivElement, SplitBadgeProps>(
  ({ label, value, variant = "default", size = "default", className, ...props }, ref) => {
    const toneClass = splitValueToneMap[variant || "default"] || splitValueToneMap.default
    const padClass = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]"

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-stretch rounded-md border border-border overflow-hidden font-mono select-none shadow-2xs",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "inline-flex items-center bg-muted/60 text-muted-foreground border-r border-border font-medium",
            padClass
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "inline-flex items-center font-semibold tabular-nums",
            padClass,
            toneClass
          )}
        >
          {value}
        </span>
      </div>
    )
  }
)
SplitBadge.displayName = "SplitBadge"

export { Badge, SplitBadge, badgeVariants }

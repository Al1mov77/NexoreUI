'use client';

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"
import { Star } from "lucide-react"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-default",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border hover:bg-accent",
        gradient: "border-transparent bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-sm",
        neon: "border-purple-500/50 bg-purple-500/10 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]",
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
  pulse?: boolean;
  dot?: boolean;
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

// ----------------------------------------------------
// Consolidated Badge Components
// ----------------------------------------------------

export const GlowBadge = ({ children, className, ...props }: BadgeProps) => (
  <Badge variant="neon" className={className} {...props}>{children}</Badge>
)

export const GlassBadge = ({ children, className, ...props }: BadgeProps) => (
  <Badge variant="outline" className={cn("backdrop-blur-md bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10", className)} {...props}>{children}</Badge>
)

export const DotBadge = ({ children, className, ...props }: BadgeProps) => (
  <Badge dot={true} className={className} {...props}>{children}</Badge>
)

export const GradientBadge = ({ children, className, ...props }: BadgeProps) => (
  <Badge variant="gradient" className={className} {...props}>{children}</Badge>
)

export const OutlineGlowBadge = ({ children, className, ...props }: BadgeProps) => (
  <Badge variant="neon" className={cn("bg-transparent border border-purple-500/50", className)} {...props}>{children}</Badge>
)

export const PulseBadge = ({ children, className, ...props }: BadgeProps) => (
  <Badge pulse={true} className={className} {...props}>{children}</Badge>
)

export const SoftBadge = ({ children, className, ...props }: BadgeProps) => (
  <Badge variant="secondary" className={className} {...props}>{children}</Badge>
)

export const TagBadge = ({ children, className, ...props }: BadgeProps) => (
  <Badge className={cn("rounded-md", className)} {...props}>{children}</Badge>
)

export const PremiumBadge = ({ children, className, ...props }: BadgeProps) => (
  <Badge variant="gradient" className={cn("bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500", className)} {...props}>{children}</Badge>
)

export const MinimalBadge = ({ children, className, ...props }: BadgeProps) => (
  <Badge size="sm" variant="outline" className={className} {...props}>{children}</Badge>
)

export const NotificationBadge = ({ count, className }: { count: number; className?: string }) => (
  <div className={cn("flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-sm", className)}>
    {count}
  </div>
)

export const RibbonBadge = ({ children, text, className }: { children?: React.ReactNode; text?: string; className?: string }) => (
  <div className={cn("absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider", className)}>
    {children || text}
  </div>
)

export interface OutlineDotBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: string;
  text?: string;
}

export const OutlineDotBadge = ({ children, className, status, text, ...props }: OutlineDotBadgeProps) => {
  const statusColors: Record<string, string> = {
    online: "bg-emerald-500",
    offline: "bg-muted-foreground/50",
    away: "bg-amber-500",
    busy: "bg-red-500",
  }
  const dotColor = status ? statusColors[status] || "bg-emerald-500" : "bg-primary"
  return (
    <Badge variant="outline" className={className} {...props}>
      <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", dotColor)} />
      {children || text}
    </Badge>
  )
}

export interface GradientOutlineBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export const GradientOutlineBadge = ({ children, text, className, ...props }: GradientOutlineBadgeProps) => (
  <Badge className={cn("p-[1px] bg-gradient-to-r from-violet-500 to-pink-500 rounded-full border-0", className)} {...props}>
    <div className="bg-background text-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">
      {children || text}
    </div>
  </Badge>
)

export interface IconBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  text?: string;
}

export const IconBadge = ({ children, icon, text, className, ...props }: IconBadgeProps) => {
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === "string") {
      if (icon.toLowerCase() === "star") {
        return <Star className="h-3 w-3 mr-1" />
      }
      return <span className="mr-1">{icon}</span>
    }
    return <span className="mr-1">{icon}</span>
  }

  return (
    <Badge className={cn("inline-flex items-center gap-1", className)} {...props}>
      {renderIcon()}
      {children || text}
    </Badge>
  )
}

export interface FloatingBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export const FloatingBadge = ({ children, text, className, ...props }: FloatingBadgeProps) => (
  <Badge className={cn("absolute -top-2 -right-2 z-10 animate-[bounce_3s_infinite]", className)} {...props}>
    {children || text}
  </Badge>
)

export interface ProgressBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  text?: string;
}

export const ProgressBadge = ({ children, progress = 50, text, className, ...props }: ProgressBadgeProps) => (
  <Badge variant="outline" className={cn("relative overflow-hidden", className)} {...props}>
    <div className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-300" style={{ width: `${progress}%` }} />
    <span className="relative z-10">{children || (text ? `${text} (${progress}%)` : `${progress}%`)}</span>
  </Badge>
)

export interface StatusRingBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: "success" | "error" | "warning" | "active" | string;
}

export const StatusRingBadge = ({ status = "success", children, className, ...props }: StatusRingBadgeProps) => {
  const ringColors: Record<string, string> = {
    success: "border-emerald-500/30 ring-emerald-500/20 bg-emerald-500",
    active: "border-emerald-500/30 ring-emerald-500/20 bg-emerald-500",
    error: "border-red-500/30 ring-red-500/20 bg-red-500",
    warning: "border-amber-500/30 ring-amber-500/20 bg-amber-500",
  }
  const colorClass = ringColors[status] || ringColors.success;
  return (
    <span className={cn("relative flex h-2.5 w-2.5 rounded-full ring-4 border-2 border-transparent", colorClass, className)} {...props} />
  )
}

export interface NeonOutlineBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export const NeonOutlineBadge = ({ children, text, className, ...props }: NeonOutlineBadgeProps) => (
  <Badge variant="outline" className={cn("border-2 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)] bg-transparent", className)} {...props}>
    {children || text}
  </Badge>
)

export interface TagLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  text?: string;
}

export const TagLabel = ({ children, text, className, ...props }: TagLabelProps) => (
  <span className={cn("px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground cursor-pointer transition-colors before:content-['#'] before:mr-0.5 before:opacity-50", className)} {...props}>
    {children || text}
  </span>
)

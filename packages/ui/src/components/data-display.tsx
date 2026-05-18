"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check, Copy, LucideIcon } from "lucide-react"
import { cn } from "../utils/cn"
import { Button } from "./button"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Badge } from "./badge"

// 1. Kbd - Keyboard shortcut component
export function Kbd({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}

// 2. AvatarGroup - Overlapping avatars
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  limit?: number
  items: { src?: string; fallback: string }[]
}

export function AvatarGroup({ items, limit = 3, className, ...props }: AvatarGroupProps) {
  const visibleItems = items.slice(0, limit)
  const remaining = items.length - limit

  return (
    <div className={cn("flex -space-x-3 items-center", className)} {...props}>
      {visibleItems.map((item, index) => (
        <Avatar key={index} className="border-2 border-background w-8 h-8">
          {item.src && <AvatarImage src={item.src} />}
          <AvatarFallback>{item.fallback}</AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border-2 border-background text-xs font-medium">
          +{remaining}
        </div>
      )}
    </div>
  )
}

// 3. StatCard - Individual stat card
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string
  description?: string
  icon?: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
}

export function StatCard({ title, value, description, icon: Icon, trend, className, ...props }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded-full",
                  trend.positive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}
              >
                {trend.positive ? "+" : "-"}{trend.value}
              </span>
            )}
          </div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {Icon && (
          <div className="p-2 bg-muted rounded-md">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}

// 4. Timeline - Vertical timeline
interface TimelineItem {
  title: string
  description: string
  time: string
  status?: "completed" | "current" | "upcoming"
}

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      {items.map((item, index) => (
        <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
          {index !== items.length - 1 && (
            <div className="absolute left-[11px] top-4 h-full w-[2px] bg-border" />
          )}
          <div
            className={cn(
              "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
              item.status === "completed" && "border-primary bg-primary text-primary-foreground",
              item.status === "current" && "border-primary bg-background",
              item.status === "upcoming" && "border-border bg-muted"
            )}
          >
            {item.status === "completed" && <Check className="h-3 w-3" />}
            {item.status === "current" && <div className="h-2 w-2 rounded-full bg-primary" />}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{item.title}</h4>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// 5. CodeBlock - Code block with copy button
interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
  language?: string
}

export function CodeBlock({ code, language, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative rounded-lg border bg-muted/50 p-4 font-mono text-sm overflow-hidden", className)} {...props}>
      <div className="absolute right-4 top-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      {language && (
        <div className="absolute left-4 top-2 text-xs text-muted-foreground uppercase">
          {language}
        </div>
      )}
      <pre className={cn("overflow-x-auto", language && "pt-6")}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

// 6. PricingCard - Premium pricing card
interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  price: string
  description: string
  features: string[]
  buttonText?: string
  popular?: boolean
}

export function PricingCard({ title, price, description, features, buttonText = "Get Started", popular = false, className, ...props }: PricingCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 flex flex-col justify-between relative",
        popular && "border-primary shadow-lg shadow-primary/5",
        className
      )}
      {...props}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <div>
        <div className="space-y-1.5 mb-6">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="mb-6">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">/mo</span>
        </div>
        <ul className="space-y-3 mb-6 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button variant={popular ? "default" : "outline"} className="w-full">
        {buttonText}
      </Button>
    </div>
  )
}

// 7. Divider - Simple divider line
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The orientation of the divider
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
}

export function Divider({ orientation = "horizontal", className, ...props }: DividerProps) {
  return (
    <div
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-[1px] w-full" : "w-[1px] h-full",
        className
      )}
      {...props}
    />
  );
}

export const tooltip = {
  name: "tooltip",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "framer-motion",
  "@radix-ui/react-tooltip"
],
  
  fileName: "tooltip.tsx",
  content: `"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

const TooltipProvider = TooltipPrimitive.Provider

const TooltipRoot = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipArrow = TooltipPrimitive.Arrow

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  variant?: "default" | "dark" | "light"
  showArrow?: boolean
}

const contentVariantClasses: Record<"default" | "dark" | "light", string> = {
  default: "bg-foreground text-background border-foreground shadow-sm",
  dark: "bg-primary text-primary-foreground border-primary shadow-md",
  light: "bg-popover text-popover-foreground border-border shadow-md",
}

const arrowFillClasses: Record<"default" | "dark" | "light", string> = {
  default: "fill-foreground",
  dark: "fill-primary",
  light: "fill-popover",
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      sideOffset = 6,
      variant = "default",
      showArrow = true,
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()

    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            "z-50 max-w-xs overflow-visible rounded-lg border px-2.5 py-1.5 text-xs font-medium",
            !shouldReduceMotion &&
              "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1.5 data-[side=left]:slide-in-from-right-1.5 data-[side=right]:slide-in-from-left-1.5 data-[side=top]:slide-in-from-bottom-1.5",
            contentVariantClasses[variant],
            className
          )}
          {...props}
        >
          {children}
          {showArrow && (
            <TooltipPrimitive.Arrow
              width={10}
              height={5}
              className={arrowFillClasses[variant]}
            />
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    )
  }
)
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  sideOffset?: number
  delay?: number
  delayDuration?: number
  variant?: "default" | "dark" | "light"
  shortcut?: string
  showArrow?: boolean
  className?: string
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 6,
  delay,
  delayDuration,
  variant = "default",
  shortcut,
  showArrow = true,
  className,
}: TooltipProps) {
  const resolvedDelay = delayDuration ?? delay ?? 200

  return (
    <TooltipProvider delayDuration={resolvedDelay}>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          variant={variant}
          showArrow={showArrow}
          className={className}
        >
          <span className="inline-flex items-center gap-2">
            <span>{content}</span>
            {shortcut && (
              <kbd
                className={cn(
                  "inline-flex items-center rounded px-1 py-0.5 font-mono text-[10px] leading-none border",
                  variant === "light"
                    ? "border-border bg-muted text-muted-foreground"
                    : "border-current/25 bg-current/15 text-current"
                )}
              >
                {shortcut}
              </kbd>
            )}
          </span>
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}

export interface SimpleTooltipProps {
  content: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  children: React.ReactNode
  delay?: number
  variant?: "default" | "dark" | "light"
  shortcut?: string
  showArrow?: boolean
  className?: string
}

export function SimpleTooltip({
  content,
  position = "top",
  children,
  delay = 200,
  variant = "default",
  shortcut,
  showArrow = true,
  className,
}: SimpleTooltipProps) {
  return (
    <Tooltip
      content={content}
      side={position}
      delay={delay}
      variant={variant}
      shortcut={shortcut}
      showArrow={showArrow}
      className={className}
    >
      {children}
    </Tooltip>
  )
}

export interface RichTooltipProps {
  content?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  meta?: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  children: React.ReactNode
  delay?: number
  variant?: "default" | "dark" | "light"
}

export function RichTooltip({
  content,
  title,
  description,
  meta,
  side = "top",
  children,
  delay = 200,
  variant,
}: RichTooltipProps) {
  const isStructured = Boolean(title || description || meta)
  const resolvedVariant = variant ?? (isStructured ? "light" : "default")

  const body = isStructured ? (
    <div className="space-y-1 max-w-[240px] py-0.5">
      {(title || meta) && (
        <div className="flex items-center justify-between gap-3">
          {title && <span className="font-semibold text-xs">{title}</span>}
          {meta && (
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums shrink-0">
              {meta}
            </span>
          )}
        </div>
      )}
      {description && (
        <p className="text-[11px] font-normal text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  ) : (
    content
  )

  return (
    <Tooltip content={body} side={side} delay={delay} variant={resolvedVariant}>
      {children}
    </Tooltip>
  )
}

export { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow }
`
};

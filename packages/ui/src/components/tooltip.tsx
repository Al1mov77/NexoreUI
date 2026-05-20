"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "../utils/cn"

const TooltipProvider = TooltipPrimitive.Provider

const TooltipRoot = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-lg border border-border/50 bg-popover/90 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export interface TooltipProps {
  /**
   * The content to display in the tooltip
   */
  content: React.ReactNode;
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactNode;
  /**
   * The side of the trigger to display the tooltip on
   * @default "top"
   */
  side?: "top" | "bottom" | "left" | "right";
  /**
   * The delay in milliseconds before the tooltip opens
   * @default 700
   */
  delay?: number;
  /**
   * The visual theme style of the tooltip content
   * @default "default"
   */
  variant?: "default" | "dark" | "light";
}

export function Tooltip({
  content,
  children,
  side = "top",
  delay = 700,
  variant = "default",
}: TooltipProps) {
  const variantClasses = {
    default: "",
    dark: "bg-zinc-950/95 text-zinc-50 border-zinc-800",
    light: "bg-white/95 text-zinc-950 border-zinc-200 shadow-md",
  };

  return (
    <TooltipProvider delayDuration={delay}>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={variantClasses[variant]}>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}

export { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider }

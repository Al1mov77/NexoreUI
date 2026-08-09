"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown, Plus } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"

const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      glass: "backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-2",
      outline: "border border-border/50 rounded-xl p-2",
      neon: "bg-black rounded-xl", // Moved border and shadow to items for dynamic glow
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & VariantProps<typeof accordionVariants>;

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn(accordionVariants({ variant, className }))}
    {...(props as any)}
  />
))
Accordion.displayName = "Accordion"

const accordionItemVariants = cva("border-b transition-all duration-300", {
  variants: {
    variant: {
      default: "border-border/50 data-[state=open]:bg-muted/30 rounded-lg px-2",
      neon: "border-neutral-800 data-[state=open]:border-cyan-400 data-[state=open]:shadow-[0_0_20px_rgba(6,182,212,0.5)] rounded-xl mb-2 overflow-hidden bg-neutral-950/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & VariantProps<typeof accordionItemVariants>;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ variant, className }))}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  iconType?: "chevron" | "plus";
  iconClassName?: string;
  variant?: "default" | "neon";
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, iconType = "chevron", iconClassName, variant = "default", ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:text-primary [&[data-state=open]>svg.chevron]:rotate-180 [&[data-state=open]>svg.plus]:rotate-45",
        variant === "neon" && "text-white px-4 data-[state=open]:text-cyan-400",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">{children}</span>
      {iconType === "chevron" ? (
        <ChevronDown className={cn("chevron h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out text-muted-foreground", iconClassName)} />
      ) : (
        <Plus className={cn("plus h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out text-muted-foreground", iconClassName)} />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-1 px-1 text-muted-foreground leading-relaxed", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

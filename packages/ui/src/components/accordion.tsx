"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown, Plus } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"

const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "divide-y divide-border",
      glass: "backdrop-blur-md bg-card/80 border border-border rounded-xl p-2 space-y-1",
      outline: "border border-border rounded-xl p-2 bg-card space-y-1",
      neon: "border border-border rounded-xl p-2 bg-card space-y-1.5",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type AccordionProps = (
  | AccordionPrimitive.AccordionSingleProps
  | AccordionPrimitive.AccordionMultipleProps
) &
  VariantProps<typeof accordionVariants>

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>((props, ref) => {
  const { className, variant, ...rest } = props
  const rootClass = cn(accordionVariants({ variant, className }))
  if (rest.type === "multiple") {
    return <AccordionPrimitive.Root ref={ref} className={rootClass} {...rest} />
  }
  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={rootClass}
      {...(rest as AccordionPrimitive.AccordionSingleProps)}
    />
  )
})
Accordion.displayName = "Accordion"

const accordionItemVariants = cva("transition-colors duration-200", {
  variants: {
    variant: {
      default:
        "border-b border-border last:border-b-0 data-[state=open]:bg-muted/25 rounded-lg px-2",
      neon: "border border-border data-[state=open]:border-foreground/40 data-[state=open]:bg-muted/30 rounded-lg px-3",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
  VariantProps<typeof accordionItemVariants>

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

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  iconType?: "chevron" | "plus"
  iconClassName?: string
  variant?: "default" | "neon"
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(
  (
    {
      className,
      children,
      iconType = "chevron",
      iconClassName,
      variant = "default",
      ...props
    },
    ref
  ) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between gap-3 py-3.5 text-left text-sm font-medium text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&[data-state=open]>svg.chevron]:rotate-180 [&[data-state=open]>svg.plus]:rotate-45",
          variant === "neon" && "font-semibold",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-2 min-w-0">{children}</span>
        {iconType === "chevron" ? (
          <ChevronDown
            className={cn(
              "chevron h-4 w-4 shrink-0 transition-transform duration-200 ease-out text-muted-foreground",
              iconClassName
            )}
          />
        ) : (
          <Plus
            className={cn(
              "plus h-4 w-4 shrink-0 transition-transform duration-200 ease-out text-muted-foreground",
              iconClassName
            )}
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
)
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
    <div className={cn("pb-4 pt-0.5 text-muted-foreground leading-relaxed", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

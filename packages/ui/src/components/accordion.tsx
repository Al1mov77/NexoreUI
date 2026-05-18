"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "../utils/cn"

const AccordionRoot = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-border/50 transition-all duration-300 data-[state=open]:bg-muted/30 rounded-lg px-2", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:text-primary [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">{children}</span>
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out text-muted-foreground" />
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
    <div className={cn("pb-4 pt-1 px-1 text-muted-foreground leading-relaxed", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export interface AccordionItemData {
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  /**
   * The array of accordion items
   */
  items: AccordionItemData[];
  /**
   * The type of accordion
   * @default "single"
   */
  type?: "single" | "multiple";
  /**
   * The variant of the accordion
   * @default "default"
   */
  variant?: "default" | "glass" | "outline";
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Whether the items can be collapsed (only for type="single")
   * @default true
   */
  collapsible?: boolean;
}

export function Accordion({
  items,
  type = "single",
  variant = "default",
  className,
  collapsible = true,
}: AccordionProps) {
  const variantClasses = {
    default: "",
    glass: "backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-2",
    outline: "border border-border/50 rounded-xl p-2",
  };

  const content = items.map((item, index) => (
    <AccordionItem key={index} value={`item-${index}`}>
      <AccordionTrigger>{item.title}</AccordionTrigger>
      <AccordionContent>{item.content}</AccordionContent>
    </AccordionItem>
  ));

  if (type === "single") {
    return (
      <AccordionPrimitive.Root type="single" collapsible={collapsible} className={cn("w-full", variantClasses[variant], className)}>
        {content}
      </AccordionPrimitive.Root>
    );
  }

  return (
    <AccordionPrimitive.Root type="multiple" className={cn("w-full", variantClasses[variant], className)}>
      {content}
    </AccordionPrimitive.Root>
  );
}

export { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent }

"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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

// --- ACCORDIONS ---
export interface SimpleAccordionProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const SimpleAccordion = ({
  title = "Is this library free?",
  children = "Yes, it is completely free and open source.",
  defaultOpen = false,
  className = ""
}: SimpleAccordionProps) => {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div className={cn("w-full max-w-md border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm border-border/50", className)}>
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex justify-between items-center hover:bg-muted/50 transition-colors font-medium">
        <span>{title}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", open ? "rotate-180" : "")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 text-sm text-muted-foreground border-t border-border/50 mt-2 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const PlusAccordion = ({
  title = "How do I install it?",
  children = "You can install it via pnpm, npm, or yarn using the CLI.",
  defaultOpen = false,
  className = ""
}: SimpleAccordionProps) => {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div className={cn("w-full max-w-md border-b border-border/50", className)}>
      <button onClick={() => setOpen(!open)} className="w-full py-4 flex justify-between items-center font-medium hover:text-primary transition-colors">
        <span>{title}</span>
        <div className="relative w-4 h-4 flex items-center justify-center">
          <div className="absolute w-4 h-0.5 bg-current rounded-full" />
          <div className={cn("absolute w-0.5 h-4 bg-current rounded-full transition-transform duration-300", open ? "rotate-90" : "")} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="text-sm text-muted-foreground pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const NeonAccordion = ({
  title = "Premium Features",
  children = "Access to exclusive animated components and premium layouts.",
  defaultOpen = false,
  className = ""
}: SimpleAccordionProps) => {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div className={cn("w-full max-w-md border rounded-xl overflow-hidden bg-black transition-all duration-300", open ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "border-neutral-800", className)}>
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex justify-between items-center font-medium text-white">
        <span className={open ? "text-cyan-400" : "text-white"}>{title}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", open ? "rotate-180 text-cyan-400" : "text-white")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 text-sm text-neutral-400 border-t border-neutral-800 mt-2 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "../utils/cn"

const TabsRoot = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center justify-center rounded-xl bg-muted/50 backdrop-blur-sm p-1 text-muted-foreground border border-border/50",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:border-border/50 border border-transparent",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export interface TabsItem {
  label: React.ReactNode;
  value: string;
  content: React.ReactNode;
}

export interface TabsProps {
  /**
   * The array of tab items
   */
  items?: TabsItem[];
  /**
   * The default active tab value
   */
  defaultValue?: string;
  /**
   * The variant of the tabs
   * @default "default"
   */
  variant?: "default" | "glass" | "outline";
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Children for compound usage
   */
  children?: React.ReactNode;
}

export function Tabs({
  items,
  defaultValue,
  variant = "default",
  className,
  children,
}: TabsProps) {
  const defVal = defaultValue || items?.[0]?.value;

  return (
    <TabsPrimitive.Root defaultValue={defVal} className={cn("w-full", className)}>
      {items ? (
        <>
          <TabsList>
            {items.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {items.map((item) => (
            <TabsContent key={item.value} value={item.value}>
              {item.content}
            </TabsContent>
          ))}
        </>
      ) : (
        children
      )}
    </TabsPrimitive.Root>
  )
}

export { TabsRoot, TabsList, TabsTrigger, TabsContent }

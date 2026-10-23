export const switchComponent = {
  name: "switch",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "@radix-ui/react-switch"
  ],
  
  fileName: "switch.tsx",
  content: `"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "../utils/cn"

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /**
   * The visual variant of the switch
   * @default "default"
   */
  variant?: "default" | "neon"
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, variant = "default", ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-foreground data-[state=checked]:border-foreground",
      "data-[state=unchecked]:bg-zinc-200 dark:data-[state=unchecked]:bg-zinc-800 data-[state=unchecked]:border-zinc-300 dark:data-[state=unchecked]:border-zinc-700",
      variant === "neon" && "data-[state=checked]:shadow-[0_0_12px_rgba(255,255,255,0.35)]",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full shadow-md ring-0 transition-transform duration-200 ease-in-out border",
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        "data-[state=checked]:bg-background data-[state=checked]:border-black/10 dark:data-[state=checked]:border-white/10",
        "data-[state=unchecked]:bg-white dark:data-[state=unchecked]:bg-zinc-300 data-[state=unchecked]:border-black/5 dark:data-[state=unchecked]:border-white/10"
      )}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
`
};

"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../utils/cn"

export interface SliderProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  "value" | "defaultValue" | "onChange"
> {
  /**
   * The minimum value
   * @default 0
   */
  min?: number;
  /**
   * The maximum value
   * @default 100
   */
  max?: number;
  /**
   * The step value
   * @default 1
   */
  step?: number;
  /**
   * The current value
   */
  value?: number;
  /**
   * Callback function called when the value changes
   */
  onChange?: (value: number) => void;
  /**
   * Whether to show the current value
   * @default false
   */
  showValue?: boolean;
  /**
   * The variant of the slider
   * @default "default"
   */
  variant?: "default" | "success" | "warning" | "error";
  /**
   * Additional class names
   */
  className?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ min = 0, max = 100, step = 1, value = 0, onChange, showValue = false, variant = "default", className, ...props }, ref) => {
  const handleValueChange = (val: number[]) => {
    onChange?.(val[0]);
  };

  const variantClasses: Record<"default" | "success" | "warning" | "error", string> = {
    default: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
  };

  const thumbBorderClasses: Record<"default" | "success" | "warning" | "error", string> = {
    default: "border-primary",
    success: "border-emerald-500",
    warning: "border-amber-500",
    error: "border-red-500",
  };

  const activeVariant = variant as "default" | "success" | "warning" | "error";

  return (
    <div className="w-full space-y-2">
      {showValue && (
        <div className="flex justify-between text-sm font-medium">
          <span>Value</span>
          <span>{value}</span>
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={handleValueChange}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary border border-border/20">
          <SliderPrimitive.Range className={cn("absolute h-full", variantClasses[activeVariant])} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={cn(
          "block h-5 w-5 rounded-full border-2 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm cursor-grab active:cursor-grabbing",
          thumbBorderClasses[activeVariant]
        )} />
      </SliderPrimitive.Root>
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider }

export interface RangeSliderInputProps {
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  onChange?: (value: number[]) => void;
}

export function RangeSliderInput({
  defaultValue = [20, 80],
  min = 0,
  max = 100,
  step = 1,
  className,
  onChange,
}: RangeSliderInputProps) {
  const [value, setValue] = React.useState<number[]>(defaultValue);

  const handleValueChange = (val: number[]) => {
    setValue(val);
    onChange?.(val);
  };

  return (
    <SliderPrimitive.Root
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={handleValueChange}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
}

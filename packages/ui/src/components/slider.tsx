"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../utils/cn"

export interface SliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    "value" | "defaultValue" | "onChange"
  > {
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  value?: number
  onChange?: (value: number) => void
  showValue?: boolean
  label?: string
  valueSuffix?: string
  variant?: "default" | "success" | "warning" | "error"
  className?: string
}

const variantClasses: Record<"default" | "success" | "warning" | "error", string> = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
}

const thumbBorderClasses: Record<"default" | "success" | "warning" | "error", string> = {
  default: "border-primary",
  success: "border-success",
  warning: "border-warning",
  error: "border-destructive",
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue = 0,
      onChange,
      showValue = false,
      label,
      valueSuffix = "",
      variant = "default",
      orientation = "horizontal",
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<number>(defaultValue)
    const currentValue = isControlled ? value : internalValue

    React.useEffect(() => {
      if (!isControlled && defaultValue !== undefined) {
        setInternalValue(defaultValue)
      }
    }, [defaultValue, isControlled])

    const handleValueChange = (val: number[]) => {
      if (!isControlled) {
        setInternalValue(val[0])
      }
      onChange?.(val[0])
    }

    const activeVariant = variant in variantClasses ? variant : "default"
    const isVertical = orientation === "vertical"

    return (
      <div
        className={cn(
          "space-y-2",
          isVertical ? "inline-flex flex-col items-center h-full" : "w-full"
        )}
      >
        {(showValue || label) && (
          <div
            className={cn(
              "flex items-center justify-between gap-2 text-xs font-medium",
              isVertical ? "flex-col text-center" : "w-full"
            )}
          >
            <span className="text-foreground">{label ?? "Value"}</span>
            {showValue && (
              <span className="font-mono text-muted-foreground tabular-nums">
                {currentValue}
                {valueSuffix}
              </span>
            )}
          </div>
        )}
        <SliderPrimitive.Root
          ref={ref}
          min={min}
          max={max}
          step={step}
          orientation={orientation}
          value={[currentValue]}
          onValueChange={handleValueChange}
          className={cn(
            "relative flex touch-none select-none items-center",
            isVertical
              ? "h-full min-h-[140px] w-auto flex-col"
              : "w-full",
            className
          )}
          {...props}
        >
          <SliderPrimitive.Track
            className={cn(
              "relative grow overflow-hidden rounded-full bg-secondary border border-border",
              isVertical ? "h-full w-2" : "h-2 w-full"
            )}
          >
            <SliderPrimitive.Range
              className={cn(
                "absolute",
                isVertical ? "w-full" : "h-full",
                variantClasses[activeVariant]
              )}
            />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            aria-label={label ?? props["aria-label"] ?? "Slider value"}
            className={cn(
              "block h-5 w-5 rounded-full border-2 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-xs cursor-grab active:cursor-grabbing",
              thumbBorderClasses[activeVariant]
            )}
          />
        </SliderPrimitive.Root>
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }

export interface RangeSliderInputProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    "value" | "defaultValue" | "onChange"
  > {
  defaultValue?: number[]
  value?: number[]
  min?: number
  max?: number
  step?: number
  className?: string
  onChange?: (value: number[]) => void
}

export const RangeSliderInput = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RangeSliderInputProps
>(
  (
    {
      defaultValue = [20, 80],
      value,
      min = 0,
      max = 100,
      step = 1,
      className,
      onChange,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<number[]>(defaultValue)
    const currentValue = isControlled ? value : internalValue

    const handleValueChange = (val: number[]) => {
      if (!isControlled) {
        setInternalValue(val)
      }
      onChange?.(val)
    }

    return (
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onValueChange={handleValueChange}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary border border-border">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label="Minimum range value"
          className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-xs cursor-grab active:cursor-grabbing"
        />
        <SliderPrimitive.Thumb
          aria-label="Maximum range value"
          className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-xs cursor-grab active:cursor-grabbing"
        />
      </SliderPrimitive.Root>
    )
  }
)
RangeSliderInput.displayName = "RangeSliderInput"

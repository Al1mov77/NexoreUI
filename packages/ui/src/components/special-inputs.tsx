"use client"

import * as React from "react"
import { Search, Eye, EyeOff, X } from "lucide-react"
import { cn } from "../utils/cn"
import { Input } from "./input"
import { Button } from "./button"

// 1. Search Input - Input with a search icon
export const SearchInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className={cn("pl-10", className)}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

// 2. Password Input - Input with show/hide toggle
export const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = React.useState(false)

    return (
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
          onClick={() => setShow(!show)}
          type="button"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

// 3. Glass Input - Glassmorphic input
export const GlassInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        className={cn(
          "bg-white/5 backdrop-blur-md border-white/10 focus:border-white/20 focus:ring-0",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
GlassInput.displayName = "GlassInput"

// 4. Gradient Input - Input with gradient border on focus
export const GradientInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative group rounded-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <Input
          className={cn("relative m-[1px] bg-background", className)}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
GradientInput.displayName = "GradientInput"

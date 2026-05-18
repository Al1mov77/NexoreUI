"use client"

import * as React from "react"
import { cn } from "../utils/cn"
import { cva, type VariantProps } from "class-variance-authority"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full transition-all duration-300",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
      variant: {
        default: "border-2 border-background",
        gradient: "p-[2px] bg-gradient-to-tr from-violet-500 to-pink-500",
        glow: "shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] border-2 border-primary",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    }
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  status?: "online" | "offline" | "away" | "busy";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, variant, status, children, ...props }, ref) => {
    const statusColors = {
      online: "bg-emerald-500",
      offline: "bg-muted-foreground/50",
      away: "bg-amber-500",
      busy: "bg-red-500",
    }

    return (
      <div className="relative inline-block">
        <div
          ref={ref}
          className={cn(avatarVariants({ size, variant, className }))}
          {...props}
        >
          {variant === "gradient" ? (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background p-[1px]">
              {children}
            </div>
          ) : (
            children
          )}
        </div>
        {status && (
          <span className={cn(
            "absolute bottom-0 right-0 block rounded-full border-2 border-background",
            statusColors[status],
            size === "sm" ? "h-2 w-2" : size === "xl" ? "h-4 w-4" : "h-3 w-3"
          )} />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover rounded-full", className)}
      {...props}
    />
  )
)
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }

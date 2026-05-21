"use client"

import * as React from "react"
import { cn } from "../utils/cn"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

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
        glow: "shadow-[0_0_15px_rgba(139,92,246,0.5)] border-2 border-violet-500",
        glass: "backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10",
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
      <div className="relative inline-block group">
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
            size === "sm" ? "h-2.5 w-2.5" : size === "xl" ? "h-4.5 w-4.5" : "h-3.5 w-3.5"
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
      "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

// ----------------------------------------------------
// Consolidated Avatar Exports
// ----------------------------------------------------

export const GlowAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} variant="glow" status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const StatusAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const GlassAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} variant="glass" status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const SquareAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("rounded-xl [&>div]:rounded-xl [&_img]:rounded-xl [&_div]:rounded-xl", className)}>
    {src ? <AvatarImage src={src} className="rounded-xl" /> : <AvatarFallback className="rounded-xl">{fallback}</AvatarFallback>}
  </Avatar>
)

export const HexagonAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("clip-path-hexagon", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const SquircleAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("rounded-[35%] [&>div]:rounded-[35%] [&_img]:rounded-[35%] [&_div]:rounded-[35%]", className)}>
    {src ? <AvatarImage src={src} className="rounded-[35%]" /> : <AvatarFallback className="rounded-[35%]">{fallback}</AvatarFallback>}
  </Avatar>
)

export const GradientRingAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} variant="gradient" status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const InitialsAvatar = ({ fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={className}>
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
)

export const InitialsGradientAvatar = ({ fallback, size, status, className }: any) => (
  <Avatar size={size} variant="gradient" status={status} className={className}>
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
)

export const OutlineAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("border-2 border-primary", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const HoverExpandAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("hover:scale-110 active:scale-95 transition-transform", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const PulseAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("ring-2 ring-primary ring-offset-2 animate-pulse", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const StackAvatar = ({
  avatars,
  urls,
  max = 4,
  className
}: {
  avatars?: Array<{ src?: string; fallback: string }>;
  urls?: string[];
  max?: number;
  className?: string;
}) => {
  const resolvedAvatars = avatars 
    ? avatars 
    : (urls || []).map(url => ({ src: url, fallback: "U" }));

  const visible = resolvedAvatars.slice(0, max)
  const remaining = resolvedAvatars.length - max
  return (
    <div className={cn("flex -space-x-3 items-center", className)}>
      {visible.map((av, i) => (
        <Avatar key={i} size="sm" className="border-2 border-background ring-1 ring-black/5 hover:-translate-y-1 transition-transform">
          {av.src ? <AvatarImage src={av.src} /> : <AvatarFallback>{av.fallback}</AvatarFallback>}
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold text-muted-foreground ring-1 ring-black/5">
          +{remaining}
        </div>
      )}
    </div>
  )
}

export const DottedAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("border-2 border-dashed border-primary p-[1px]", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const ShadowAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("shadow-2xl shadow-primary/40", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const PolymorphAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("rounded-none hover:rounded-[40%] transition-all duration-500", className)}>
    {src ? <AvatarImage src={src} className="rounded-none hover:rounded-[40%] transition-all duration-500" /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const TooltipAvatar = ({ src, fallback, size, status, tooltipText, className }: any) => (
  <div className="relative group/tooltip inline-block">
    <Avatar size={size} status={status} className={className}>
      {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
    </Avatar>
    {tooltipText && (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-black/90 text-[10px] font-semibold text-white rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50">
        {tooltipText}
      </div>
    )}
  </div>
)

export const AnimatedBorderAvatar = ({ src, fallback }: any) => (
  <div className="relative p-[2px] rounded-full overflow-hidden inline-block">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,hsl(var(--primary))_360deg)]" />
    <Avatar className="relative border-2 border-background">
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  </div>
)

export { Avatar, AvatarImage, AvatarFallback }

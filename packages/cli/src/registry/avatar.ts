export const avatar = {
  name: "avatar",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "class-variance-authority",
  "framer-motion"
],
  
  fileName: "avatar.tsx",
  content: `"use client"

import * as React from "react"
import { cn } from "../utils/cn"
import { cva, type VariantProps } from "class-variance-authority"
import { useReducedMotion } from "framer-motion"

type ImageLoadStatus = "loading" | "loaded" | "error"

interface AvatarContextValue {
  imageStatus: ImageLoadStatus
  setImageStatus: (status: ImageLoadStatus) => void
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null)

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full transition-all duration-200",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
      variant: {
        default: "border-2 border-background bg-muted",
        gradient: "p-[2px] border border-foreground/25 bg-muted",
        glow: "border-2 border-foreground/40 shadow-xs bg-muted",
        glass: "backdrop-blur-sm bg-card/85 border border-border",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  status?: "online" | "offline" | "away" | "busy"
}

const statusColors: Record<NonNullable<AvatarProps["status"]>, string> = {
  online: "bg-success",
  offline: "bg-muted-foreground/50",
  away: "bg-warning",
  busy: "bg-destructive",
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, variant, status, children, ...props }, ref) => {
    const [imageStatus, setImageStatus] = React.useState<ImageLoadStatus>("loading")

    const contextValue = React.useMemo(
      () => ({ imageStatus, setImageStatus }),
      [imageStatus]
    )

    return (
      <AvatarContext.Provider value={contextValue}>
        <div className="relative inline-block group shrink-0">
          <div
            ref={ref}
            className={cn(avatarVariants({ size, variant }), className)}
            {...props}
          >
            {variant === "gradient" ? (
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-background overflow-hidden">
                {children}
              </div>
            ) : (
              children
            )}
          </div>
          {status && (
            <span
              role="img"
              aria-label={\`Status: \${status}\`}
              title={\`Status: \${status}\`}
              className={cn(
                "absolute bottom-0 right-0 block rounded-full border-2 border-background",
                statusColors[status],
                size === "sm"
                  ? "h-2.5 w-2.5"
                  : size === "xl"
                  ? "h-4 w-4"
                  : "h-3 w-3"
              )}
            />
          )}
        </div>
      </AvatarContext.Provider>
    )
  }
)
Avatar.displayName = "Avatar"

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, onLoad, onError, ...props }, ref) => {
    const context = React.useContext(AvatarContext)
    const internalRef = React.useRef<HTMLImageElement | null>(null)
    const [localStatus, setLocalStatus] = React.useState<ImageLoadStatus>(
      src ? "loading" : "error"
    )

    const setRefs = React.useCallback(
      (node: HTMLImageElement | null) => {
        internalRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    const updateStatus = React.useCallback(
      (next: ImageLoadStatus) => {
        setLocalStatus(next)
        context?.setImageStatus(next)
      },
      [context]
    )

    React.useEffect(() => {
      if (!src) {
        updateStatus("error")
        return
      }
      updateStatus("loading")
      const img = internalRef.current
      if (img && img.complete) {
        updateStatus(img.naturalWidth > 0 ? "loaded" : "error")
      }
    }, [src, updateStatus])

    if (!src || localStatus === "error") {
      return null
    }

    return (
      <img
        ref={setRefs}
        src={src}
        alt={alt || "User avatar"}
        onLoad={(e) => {
          updateStatus("loaded")
          onLoad?.(e)
        }}
        onError={(e) => {
          updateStatus("error")
          onError?.(e)
        }}
        className={cn(
          "aspect-square h-full w-full object-cover rounded-full",
          localStatus !== "loaded" && "opacity-0 absolute inset-0",
          className
        )}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(AvatarContext)
  if (context && context.imageStatus === "loaded") {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted font-mono text-xs font-semibold text-foreground select-none",
        className
      )}
      {...props}
    />
  )
})
AvatarFallback.displayName = "AvatarFallback"

export interface HelperAvatarProps {
  src?: string
  fallback?: React.ReactNode
  size?: VariantProps<typeof avatarVariants>["size"]
  status?: "online" | "offline" | "away" | "busy"
  className?: string
  tooltipText?: string
  shape?: "circle" | "square" | "squircle" | "hexagon" | string
  initials?: string
  name?: string
}

export const GlowAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar size={size} variant="glow" status={status} className={className}>
    {src && <AvatarImage src={src} />}
    <AvatarFallback>{fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const StatusAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={className}>
    {src && <AvatarImage src={src} />}
    <AvatarFallback>{fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const GlassAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar size={size} variant="glass" status={status} className={className}>
    {src && <AvatarImage src={src} />}
    <AvatarFallback>{fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const SquareAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={cn("rounded-xl", className)}>
    {src && <AvatarImage src={src} className="rounded-xl" />}
    <AvatarFallback className="rounded-xl">{fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const HexagonAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar
    size={size}
    status={status}
    className={cn("rounded-none border-0", className)}
    style={{
      clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
    }}
  >
    {src && <AvatarImage src={src} className="rounded-none" />}
    <AvatarFallback className="rounded-none">{fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const SquircleAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={cn("rounded-[34%]", className)}>
    {src && <AvatarImage src={src} className="rounded-[34%]" />}
    <AvatarFallback className="rounded-[34%]">{fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const GradientRingAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar size={size} variant="gradient" status={status} className={className}>
    {src && <AvatarImage src={src} />}
    <AvatarFallback>{fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const InitialsAvatar = ({
  fallback,
  initials,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={className}>
    <AvatarFallback>{initials || fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const InitialsGradientAvatar = ({
  fallback,
  initials,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar size={size} variant="gradient" status={status} className={className}>
    <AvatarFallback>{initials || fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const OutlineAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar
    size={size}
    status={status}
    className={cn("border-2 border-foreground", className)}
  >
    {src && <AvatarImage src={src} />}
    <AvatarFallback>{fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const HoverExpandAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <Avatar
      size={size}
      status={status}
      className={cn(
        !shouldReduceMotion &&
          "hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150",
        className
      )}
    >
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback || "NX"}</AvatarFallback>
    </Avatar>
  )
}

export const PulseAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar
    size={size}
    status={status}
    className={cn("ring-2 ring-foreground/40 ring-offset-2 ring-offset-background", className)}
  >
    {src && <AvatarImage src={src} />}
    <AvatarFallback>{fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export interface StackAvatarItem {
  src?: string
  fallback: string
  name?: string
}

export const StackAvatar = ({
  avatars,
  urls,
  max = 4,
  size = "sm",
  className,
}: {
  avatars?: StackAvatarItem[]
  urls?: string[]
  max?: number
  size?: "sm" | "default" | "lg"
  className?: string
}) => {
  const shouldReduceMotion = useReducedMotion()
  const resolvedAvatars: StackAvatarItem[] = avatars
    ? avatars
    : (urls || []).map((url, idx) => ({ src: url, fallback: \`U\${idx + 1}\` }))

  const visible = resolvedAvatars.slice(0, max)
  const remaining = resolvedAvatars.length - max

  const counterSizeClass =
    size === "lg"
      ? "h-12 w-12 text-xs"
      : size === "default"
      ? "h-10 w-10 text-xs"
      : "h-8 w-8 text-[10px]"

  return (
    <div
      className={cn(
        "group/stack inline-flex items-center -space-x-2.5",
        !shouldReduceMotion && "hover:space-x-0.5 transition-[margin,gap] duration-200",
        className
      )}
    >
      {visible.map((av, i) => (
        <div
          key={av.name || \`\${av.fallback}-\${i}\`}
          title={av.name}
          className={cn(
            "relative rounded-full transition-transform duration-200",
            !shouldReduceMotion && "hover:-translate-y-0.5 hover:z-10"
          )}
        >
          <Avatar size={size} className="border-2 border-background ring-1 ring-border">
            {av.src && <AvatarImage src={av.src} alt={av.name || av.fallback} />}
            <AvatarFallback>{av.fallback}</AvatarFallback>
          </Avatar>
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "relative z-0 flex items-center justify-center rounded-full border-2 border-background bg-muted font-mono font-semibold text-foreground ring-1 ring-border tabular-nums",
            counterSizeClass
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

export const DottedAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar
    size={size}
    status={status}
    className={cn("border-2 border-dashed border-foreground/45 p-0.5 bg-background", className)}
  >
    {src && <AvatarImage src={src} />}
    <AvatarFallback>{fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const ShadowAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => (
  <Avatar
    size={size}
    status={status}
    className={cn("border border-border shadow-md", className)}
  >
    {src && <AvatarImage src={src} />}
    <AvatarFallback>{fallback || "NX"}</AvatarFallback>
  </Avatar>
)

export const PolymorphAvatar = ({
  src,
  fallback,
  size,
  status,
  shape = "square",
  className,
}: HelperAvatarProps) => {
  const shouldReduceMotion = useReducedMotion()

  if (shape === "hexagon") {
    return (
      <HexagonAvatar
        src={src}
        fallback={fallback}
        size={size}
        status={status}
        className={cn(
          !shouldReduceMotion && "transition-transform duration-200 hover:scale-[1.02]",
          className
        )}
      />
    )
  }

  const shapeClass =
    shape === "squircle"
      ? "rounded-[34%] hover:rounded-full"
      : shape === "circle"
      ? "rounded-full hover:rounded-xl"
      : "rounded-lg hover:rounded-[34%]"

  return (
    <Avatar
      size={size}
      status={status}
      className={cn(
        shapeClass,
        !shouldReduceMotion && "transition-[border-radius] duration-200",
        className
      )}
    >
      {src && <AvatarImage src={src} className="rounded-inherit" />}
      <AvatarFallback className="rounded-inherit">{fallback || "NX"}</AvatarFallback>
    </Avatar>
  )
}

export const TooltipAvatar = ({
  src,
  fallback,
  size,
  status,
  tooltipText,
  name,
  className,
}: HelperAvatarProps) => {
  const label = tooltipText || name
  return (
    <div
      tabIndex={0}
      aria-label={label}
      className="relative group/tooltip inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-default"
    >
      <Avatar size={size} status={status} className={className}>
        {src && <AvatarImage src={src} alt={label || "User avatar"} />}
        <AvatarFallback>{fallback || (name ? name.slice(0, 2).toUpperCase() : "NX")}</AvatarFallback>
      </Avatar>
      {label && (
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-popover text-[11px] font-medium text-popover-foreground border border-border rounded-md whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100 transition-opacity duration-150 z-50 shadow-sm"
        >
          {label}
        </div>
      )}
    </div>
  )
}

export const AnimatedBorderAvatar = ({
  src,
  fallback,
  size,
  status,
  className,
}: HelperAvatarProps) => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <Avatar
      size={size}
      status={status}
      className={cn(
        "border-2 border-background ring-1 ring-border ring-offset-2 ring-offset-background hover:ring-foreground/50",
        !shouldReduceMotion && "transition-[box-shadow] duration-200",
        className
      )}
    >
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback || "NX"}</AvatarFallback>
    </Avatar>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
`
};

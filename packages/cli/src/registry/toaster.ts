export const toaster = {
  name: "toaster",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "sonner",
  "next-themes",
  "lucide-react",
  "framer-motion"
],
  
  fileName: "toaster.tsx",
  content: `"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as SonnerToaster, toast } from "sonner"
import { useReducedMotion } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from "lucide-react"
import { cn } from "../utils/cn"

export type ToasterProps = React.ComponentProps<typeof SonnerToaster> & {
  variant?: "default" | "bordered" | "minimal"
}

export function Toaster({
  variant = "default",
  className,
  toastOptions,
  icons,
  ...props
}: ToasterProps) {
  const { theme = "system" } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  const variantToastClass =
    variant === "bordered"
      ? "border-2 border-border shadow-md"
      : variant === "minimal"
      ? "border border-border bg-background shadow-xs"
      : "border border-border bg-card shadow-md"

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      className={cn("toaster group", className)}
      icons={{
        success: <CheckCircle2 className="h-4 w-4 text-success shrink-0" />,
        error: <XCircle className="h-4 w-4 text-destructive shrink-0" />,
        warning: <AlertTriangle className="h-4 w-4 text-warning shrink-0" />,
        info: <Info className="h-4 w-4 text-info shrink-0" />,
        loading: (
          <Loader2
            className={cn(
              "h-4 w-4 text-muted-foreground shrink-0",
              !shouldReduceMotion && "animate-spin"
            )}
          />
        ),
        ...icons,
      }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: cn(
            "group toast w-full max-w-[360px] rounded-xl text-card-foreground font-sans",
            variantToastClass
          ),
          title: "text-xs sm:text-sm font-semibold text-foreground",
          description: "text-xs text-muted-foreground leading-relaxed",
          actionButton:
            "rounded-lg bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          cancelButton:
            "rounded-lg border border-border bg-muted text-foreground text-xs font-medium px-2.5 py-1 hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          closeButton:
            "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted",
          success: "border-success/35",
          error: "border-destructive/35",
          warning: "border-warning/35",
          info: "border-info/35",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  )
}

export interface ToastCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  status?: "default" | "success" | "warning" | "error" | "info"
  meta?: string
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
  progress?: number
  remainingSeconds?: number
}

const statusBorderClasses: Record<
  NonNullable<ToastCardProps["status"]>,
  string
> = {
  default: "border-border",
  success: "border-success/35",
  warning: "border-warning/35",
  error: "border-destructive/35",
  info: "border-info/35",
}

const statusProgressClasses: Record<
  NonNullable<ToastCardProps["status"]>,
  string
> = {
  default: "bg-foreground",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  info: "bg-info",
}

const statusIcons: Record<
  NonNullable<ToastCardProps["status"]>,
  React.ReactNode
> = {
  default: <Info className="h-4 w-4 text-foreground shrink-0" />,
  success: <CheckCircle2 className="h-4 w-4 text-success shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning shrink-0" />,
  error: <XCircle className="h-4 w-4 text-destructive shrink-0" />,
  info: <Info className="h-4 w-4 text-info shrink-0" />,
}

export const ToastCard = React.forwardRef<HTMLDivElement, ToastCardProps>(
  (
    {
      title,
      description,
      status = "default",
      meta,
      actionLabel,
      onAction,
      onDismiss,
      progress,
      remainingSeconds,
      className,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()
    const clampedProgress =
      progress !== undefined ? Math.min(100, Math.max(0, progress)) : undefined

    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          "relative w-full max-w-[360px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-md p-3.5",
          statusBorderClasses[status],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 shrink-0" aria-hidden="true">
            {statusIcons[status]}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs sm:text-sm font-semibold text-foreground truncate">
                {title}
              </div>
              {remainingSeconds !== undefined && (
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums px-1.5 py-0.5 rounded bg-muted border border-border shrink-0">
                  {remainingSeconds.toFixed(1)}s
                </span>
              )}
            </div>

            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}

            {(meta || actionLabel) && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5">
                {meta ? (
                  <code className="font-mono text-[10px] text-muted-foreground bg-muted/60 border border-border px-1.5 py-0.5 rounded truncate">
                    {meta}
                  </code>
                ) : (
                  <span />
                )}

                {actionLabel && (
                  <button
                    type="button"
                    onClick={onAction}
                    className="rounded-md bg-primary text-primary-foreground px-2.5 py-1 text-[11px] font-medium hover:bg-primary/90 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            )}
          </div>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss notification"
              className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {clampedProgress !== undefined && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-0.5 bg-muted"
          >
            <div
              className={cn(
                "h-full",
                statusProgressClasses[status],
                shouldReduceMotion
                  ? "transition-none"
                  : "transition-[width] duration-75 linear"
              )}
              style={{ width: \`\${clampedProgress}%\` }}
            />
          </div>
        )}
      </div>
    )
  }
)
ToastCard.displayName = "ToastCard"

export interface NotifyCountdownOptions {
  title: React.ReactNode
  description?: React.ReactNode
  duration?: number
  status?: ToastCardProps["status"]
  meta?: string
  actionLabel?: string
  onAction?: () => void
  onExpire?: () => void
}

interface CountdownToastContentProps extends NotifyCountdownOptions {
  toastId: string | number
}

function CountdownToastContent({
  toastId,
  title,
  description,
  duration = 5000,
  status = "warning",
  meta,
  actionLabel = "Undo",
  onAction,
  onExpire,
}: CountdownToastContentProps) {
  const safeDuration = Math.max(500, duration)
  const [remainingMs, setRemainingMs] = React.useState(safeDuration)
  const [paused, setPaused] = React.useState(false)
  const expiredRef = React.useRef(false)

  React.useEffect(() => {
    if (paused) return
    const stepMs = 50
    const interval = window.setInterval(() => {
      setRemainingMs((prev) => {
        const next = Math.max(0, prev - stepMs)
        if (next === 0 && !expiredRef.current) {
          expiredRef.current = true
          window.clearInterval(interval)
          onExpire?.()
          toast.dismiss(toastId)
        }
        return next
      })
    }, stepMs)
    return () => window.clearInterval(interval)
  }, [paused, toastId, onExpire])

  const pct = (remainingMs / safeDuration) * 100

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ToastCard
        title={title}
        description={description}
        status={status}
        meta={meta}
        actionLabel={actionLabel}
        progress={pct}
        remainingSeconds={remainingMs / 1000}
        onAction={() => {
          expiredRef.current = true
          onAction?.()
          toast.dismiss(toastId)
        }}
        onDismiss={() => {
          expiredRef.current = true
          toast.dismiss(toastId)
        }}
      />
    </div>
  )
}

export interface NotifyStatusOptions {
  title: React.ReactNode
  description?: React.ReactNode
  status?: ToastCardProps["status"]
  meta?: string
  actionLabel?: string
  onAction?: () => void
  duration?: number
}

export const notify = {
  countdown(options: NotifyCountdownOptions) {
    return toast.custom(
      (id) => <CountdownToastContent toastId={id} {...options} />,
      { duration: Infinity }
    )
  },
  status({
    title,
    description,
    status = "default",
    meta,
    actionLabel,
    onAction,
    duration = 4500,
  }: NotifyStatusOptions) {
    return toast.custom(
      (id) => (
        <ToastCard
          title={title}
          description={description}
          status={status}
          meta={meta}
          actionLabel={actionLabel}
          onAction={
            actionLabel
              ? () => {
                  onAction?.()
                  toast.dismiss(id)
                }
              : undefined
          }
          onDismiss={() => toast.dismiss(id)}
        />
      ),
      { duration }
    )
  },
}

export { toast }
`
};

export const alert = {
  name: "alert",
  dependencies: [
  "clsx",
  "tailwind-merge",
  "class-variance-authority",
  "framer-motion",
  "lucide-react"
],
  
  fileName: "alert.tsx",
  content: `"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion"
import {
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  Cookie,
  WifiOff,
  AlertTriangle,
  X,
  ChevronDown,
} from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 transition-colors duration-200 shadow-xs",
  {
    variants: {
      variant: {
        default: "bg-card border-border text-card-foreground",
        destructive: "border-destructive/35 bg-destructive/10 text-foreground",
        danger: "border-destructive/35 bg-destructive/10 text-foreground",
        success: "border-success/35 bg-success/10 text-foreground",
        warning: "border-warning/35 bg-warning/10 text-foreground",
        info: "border-info/35 bg-info/10 text-foreground",
        glass: "backdrop-blur-md bg-card/85 border-border text-card-foreground",
        floating:
          "fixed bottom-5 right-5 z-50 w-[calc(100vw-2rem)] max-w-sm bg-card/95 backdrop-blur-md border-border text-card-foreground shadow-md",
        minimal: "border-0 bg-muted/50 px-3.5 py-3 text-sm rounded-xl text-foreground shadow-none",
        neon: "border-foreground/25 bg-card text-foreground shadow-xs",
        cyberpunk:
          "border-border border-l-4 border-l-foreground bg-muted/25 text-foreground rounded-none font-mono shadow-xs",
        gradient: "bg-muted/40 border-border text-foreground",
        banner: "w-full bg-primary text-primary-foreground border-transparent shadow-sm rounded-xl",
        primary: "bg-card text-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  animate?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  meta?: string
  details?: React.ReactNode
  detailsLabel?: string
  dismissible?: boolean
  onDismiss?: () => void
  actionText?: string
  onAction?: () => void
}

const iconToneMap: Record<string, string> = {
  destructive: "text-destructive",
  danger: "text-destructive",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
  banner: "text-primary-foreground",
  default: "text-foreground",
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      animate = true,
      title,
      description,
      icon,
      meta,
      details,
      detailsLabel = "Diagnostics",
      dismissible = false,
      onDismiss,
      actionText,
      onAction,
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()
    const [isOpen, setIsOpen] = React.useState(true)
    const [detailsOpen, setDetailsOpen] = React.useState(false)
    const detailsId = React.useId()

    if (!isOpen) return null

    const resolvedVariant = variant || "default"
    const isBanner = resolvedVariant === "banner"

    const defaultIcon =
      icon !== undefined ? (
        icon
      ) : resolvedVariant === "destructive" || resolvedVariant === "danger" ? (
        <XCircle className="h-4 w-4" />
      ) : resolvedVariant === "success" ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : resolvedVariant === "warning" ? (
        <AlertTriangle className="h-4 w-4" />
      ) : resolvedVariant === "info" ? (
        <Info className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )

    const iconTone = iconToneMap[resolvedVariant] || "text-foreground"

    const innerContent = (
      <div className="flex items-start gap-3">
        {defaultIcon && (
          <div className={cn("shrink-0 mt-0.5", iconTone)} aria-hidden="true">
            {defaultIcon}
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-1">
          {(title || meta) && (
            <div className="flex flex-wrap items-center gap-2">
              {title && (
                <AlertTitle
                  className={isBanner ? "text-primary-foreground" : "text-foreground"}
                >
                  {title}
                </AlertTitle>
              )}
              {meta && (
                <code
                  className={cn(
                    "font-mono text-[10px] px-1.5 py-0.5 rounded border tabular-nums",
                    isBanner
                      ? "border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground"
                      : "border-border bg-muted/70 text-muted-foreground"
                  )}
                >
                  {meta}
                </code>
              )}
            </div>
          )}

          {description && (
            <AlertDescription
              className={
                isBanner
                  ? "text-primary-foreground/85"
                  : "text-muted-foreground"
              }
            >
              {description}
            </AlertDescription>
          )}

          {!title && !description && children}

          {(details || (!isBanner && actionText)) && (
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              {details && (
                <button
                  type="button"
                  aria-expanded={detailsOpen}
                  aria-controls={detailsId}
                  onClick={() => setDetailsOpen((prev) => !prev)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-mono font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isBanner
                      ? "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25"
                      : "border border-border bg-background/80 text-foreground hover:bg-muted"
                  )}
                >
                  <span>{detailsLabel}</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-150",
                      detailsOpen && "rotate-180"
                    )}
                  />
                </button>
              )}

              {!isBanner && actionText && (
                <button
                  type="button"
                  onClick={onAction}
                  className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {actionText}
                </button>
              )}
            </div>
          )}

          <AnimatePresence initial={false}>
            {details && detailsOpen && (
              <motion.div
                id={detailsId}
                initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.16, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div
                  className={cn(
                    "mt-2 rounded-lg border p-2.5 text-xs font-mono leading-relaxed",
                    isBanner
                      ? "border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground"
                      : "border-border bg-background/80 text-muted-foreground"
                  )}
                >
                  {details}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {(isBanner && actionText) || dismissible ? (
          <div className="flex items-center gap-1.5 shrink-0">
            {isBanner && actionText && (
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center rounded-lg bg-primary-foreground px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary-foreground/90 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {actionText}
              </button>
            )}
            {dismissible && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onDismiss?.()
                }}
                aria-label="Dismiss"
                className={cn(
                  "rounded-lg p-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isBanner
                    ? "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/15"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : null}
      </div>
    )

    const alertClass = cn(alertVariants({ variant: resolvedVariant }), className)

    if (animate && !shouldReduceMotion) {
      return (
        <motion.div
          ref={ref}
          role="alert"
          initial={{ opacity: 0, y: resolvedVariant === "floating" ? 16 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: resolvedVariant === "floating" ? 12 : 4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={alertClass}
          {...(props as HTMLMotionProps<"div">)}
        >
          {innerContent}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={alertClass}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {innerContent}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-semibold leading-snug tracking-tight text-sm", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs sm:text-sm leading-relaxed [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export interface ToastAlertWrapperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  time?: string
}

export const ToastAlertWrapper = React.forwardRef<
  HTMLDivElement,
  ToastAlertWrapperProps
>(({ children, className, title, description, time, ...props }, ref) => (
  <div
    ref={ref}
    role="status"
    className={cn(
      "max-w-sm w-full bg-card text-card-foreground border border-border shadow-md rounded-xl p-4 flex gap-3 items-start",
      className
    )}
    {...props}
  >
    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0">
      {title && <h4 className="font-semibold text-sm text-foreground">{title}</h4>}
      {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      {children}
    </div>
    {time && (
      <span className="text-[11px] font-mono text-muted-foreground tabular-nums shrink-0">
        {time}
      </span>
    )}
  </div>
))
ToastAlertWrapper.displayName = "ToastAlertWrapper"

export const CookieAlert = ({
  onAccept,
  onDecline,
}: {
  onAccept?: () => void
  onDecline?: () => void
}) => {
  const [visible, setVisible] = React.useState(true)
  if (!visible) return null
  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="max-w-md w-full bg-card text-card-foreground border border-border rounded-xl p-5 shadow-md space-y-4"
    >
      <div className="flex items-center gap-2.5">
        <Cookie className="h-5 w-5 text-foreground shrink-0" />
        <h4 className="font-semibold text-sm text-foreground">Cookie Preferences</h4>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Essential cookies keep your session secure. Analytics cookies are optional and never shared with third parties.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            setVisible(false)
            onAccept?.()
          }}
          className="flex-1 h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => {
            setVisible(false)
            onDecline?.()
          }}
          className="flex-1 h-9 px-4 border border-border bg-background text-foreground rounded-lg text-xs font-medium hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Decline Optional
        </button>
      </div>
    </div>
  )
}

export const OfflineBanner = () => (
  <div
    role="alert"
    className="w-full bg-destructive text-destructive-foreground px-4 py-3 flex justify-center items-center gap-2 text-xs sm:text-sm font-medium rounded-xl shadow-xs"
  >
    <WifiOff className="w-4 h-4 shrink-0" />
    <span>You are currently offline. Changes will sync when reconnected.</span>
  </div>
)

export interface RateLimitAlertProps {
  seconds?: number
  className?: string
}

export const RateLimitAlert = ({
  seconds = 45,
  className,
}: RateLimitAlertProps) => {
  const shouldReduceMotion = useReducedMotion()
  const [remaining, setRemaining] = React.useState(seconds)

  React.useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  React.useEffect(() => {
    if (remaining <= 0) return
    const id = window.setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [remaining])

  const pct = seconds > 0 ? Math.round((remaining / seconds) * 100) : 0

  return (
    <div
      role="alert"
      className={cn(
        "border border-warning/35 bg-warning/10 p-4 rounded-xl flex gap-3 items-start w-full max-w-md shadow-xs",
        className
      )}
    >
      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-sm text-foreground">Rate Limit Exceeded</h4>
          <span className="font-mono text-[11px] font-semibold text-warning tabular-nums shrink-0">
            {remaining > 0 ? \`\${remaining}s\` : "Ready"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {remaining > 0
            ? \`Too many requests from this token. Retry available in \${remaining} seconds.\`
            : "Cooldown complete. You may retry your request now."}
        </p>
        <div className="w-full h-1.5 bg-warning/20 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full bg-warning rounded-full",
              shouldReduceMotion ? "transition-none" : "transition-[width] duration-700 ease-linear"
            )}
            style={{ width: \`\${pct}%\` }}
          />
        </div>
        {remaining === 0 && (
          <button
            type="button"
            onClick={() => setRemaining(seconds)}
            className="text-[11px] font-mono font-medium text-foreground underline underline-offset-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Simulate cooldown again
          </button>
        )}
      </div>
    </div>
  )
}

export const CyberAlert = ({
  title,
  description,
  variant,
  ...props
}: AlertProps) => (
  <Alert
    variant="cyberpunk"
    title={title}
    description={description}
    {...props}
  />
)

export const SoftAlert = ({
  title,
  description,
  variant = "default",
  ...props
}: AlertProps) => (
  <Alert
    variant={variant === "success" ? "success" : "info"}
    title={title}
    description={description}
    {...props}
  />
)

export const MinimalAlert = ({
  title,
  description,
  ...props
}: AlertProps) => (
  <Alert variant="minimal" title={title} description={description} {...props} />
)

export const LeftBorderAlert = ({
  title,
  description,
  variant = "default",
  className,
  ...props
}: AlertProps) => (
  <Alert
    variant={variant === "warning" ? "warning" : "default"}
    className={cn("border-l-4 border-l-primary", className)}
    title={title}
    description={description}
    {...props}
  />
)

export interface IconTopAlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: string
}

export const IconTopAlert = ({
  title,
  description,
  variant = "default",
  className,
  ...props
}: IconTopAlertProps) => (
  <div
    role="alert"
    className={cn(
      "flex flex-col items-center text-center p-5 bg-card text-card-foreground border border-border rounded-xl shadow-xs",
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center mb-3",
        variant === "success"
          ? "bg-success/15 text-success"
          : variant === "warning"
          ? "bg-warning/15 text-warning"
          : "bg-destructive/15 text-destructive"
      )}
    >
      <AlertCircle className="h-5 w-5" />
    </div>
    {title && <h4 className="font-semibold text-sm text-foreground mb-1">{title}</h4>}
    {description && <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>}
  </div>
)

export interface SolidAlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "error" | "success" | "warning" | "default" | string
}

export const SolidAlert = ({
  title,
  description,
  variant = "default",
  className,
  ...props
}: SolidAlertProps) => {
  const bgClasses: Record<string, string> = {
    error: "bg-destructive text-destructive-foreground border-transparent",
    success: "bg-success text-success-foreground border-transparent",
    warning: "bg-warning text-warning-foreground border-transparent",
    default: "bg-primary text-primary-foreground border-transparent",
  }
  const bgClass = bgClasses[variant] || bgClasses.default
  return (
    <div
      role="alert"
      className={cn("p-4 rounded-xl shadow-xs flex gap-3 items-start", bgClass, className)}
      {...props}
    >
      <Info className="h-4 w-4 shrink-0 mt-0.5" />
      <div className="min-w-0">
        {title && <h4 className="font-semibold text-sm">{title}</h4>}
        {description && <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{description}</p>}
      </div>
    </div>
  )
}

export interface BannerAlertProps extends AlertProps {
  message?: React.ReactNode
}

export const BannerAlert = ({
  message,
  title,
  ...props
}: BannerAlertProps) => (
  <Alert variant="banner" title={message || title} {...props} />
)

export const NeonAlert = ({ title, description, ...props }: AlertProps) => (
  <Alert variant="neon" title={title} description={description} {...props} />
)

export const GlassAlert = ({ title, description, ...props }: AlertProps) => (
  <Alert variant="glass" title={title} description={description} {...props} />
)

export const DismissibleAlert = ({
  variant = "default",
  title,
  description,
  ...props
}: AlertProps) => (
  <Alert
    variant={variant}
    title={title || "Attention"}
    description={description || "Action required"}
    dismissible={true}
    {...props}
  />
)

export { Alert, AlertTitle, AlertDescription }
`
};

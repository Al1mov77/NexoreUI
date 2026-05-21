"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Info, CheckCircle2, XCircle, Cookie, BellRing, WifiOff, AlertTriangle, X } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 transition-all duration-300 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-background/50 border-border text-foreground",
        destructive: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
        glass: "backdrop-blur-md bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5 text-foreground",
        floating: "fixed bottom-5 right-5 z-50 max-w-sm bg-card/95 backdrop-blur-md border border-border/80 text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.25)] animate-slide-up",
        minimal: "border-0 bg-muted/40 p-3 text-sm rounded-xl text-foreground hover:bg-muted/60 shadow-none [&>svg]:top-3.5",
        neon: "border-purple-500/50 bg-purple-500/10 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)] [&>svg]:text-purple-400",
        cyberpunk: "border-l-4 border-yellow-400 bg-black text-yellow-400 shadow-[4px_4px_0_0_rgba(250,204,21,1)] rounded-none font-mono uppercase [&>svg]:text-yellow-400",
        gradient: "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-foreground [&>svg]:text-blue-500",
        banner: "w-full bg-indigo-600 text-white border-0 shadow-md rounded-none sm:rounded-xl [&>svg]:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertVariants> {
  animate?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  actionText?: string;
  onAction?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant,
      animate = true,
      title,
      description,
      icon,
      dismissible = false,
      onDismiss,
      actionText,
      onAction,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(true);

    if (!isOpen) return null;

    const isMinimal = variant === "minimal";
    const isBanner = variant === "banner";

    const content = (
      <>
        {icon && <div className={cn("absolute left-4", isMinimal ? "top-3" : "top-4")}>{icon}</div>}
        <div className={cn(icon ? "pl-7" : "", "pr-8")}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
          {!title && !description && children}
        </div>
        {isBanner && actionText && (
          <button
            onClick={onAction}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
          >
            {actionText}
          </button>
        )}
        {dismissible && (
          <button
            onClick={() => {
              setIsOpen(false);
              onDismiss?.();
            }}
            className="absolute right-4 top-4 opacity-50 hover:opacity-100 transition-opacity p-0.5 rounded-md hover:bg-muted"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </>
    );

    const alertClass = cn(alertVariants({ variant }), className);

    if (animate) {
      return (
        <motion.div
          ref={ref}
          role="alert"
          initial={{ opacity: 0, y: variant === "floating" ? 30 : 15, scale: variant === "floating" ? 0.95 : 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: variant === "floating" ? 20 : 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 24 }}
          className={alertClass}
          {...(props as any)}
        >
          {content}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={alertClass}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {content}
      </div>
    );
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight text-base text-foreground", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed mt-1 opacity-90 [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

// ----------------------------------------------------
// Merged subcomponents and wrappers
// ----------------------------------------------------

// 1. ToastAlertWrapper
export const ToastAlertWrapper = ({ children, className, title, description, time }: any) => (
  <div className={cn("max-w-sm w-full bg-background border border-border/80 shadow-xl rounded-2xl p-4 flex gap-4 items-start relative", className)}>
    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
    <div className="flex-1">
      {title && <h4 className="font-semibold text-sm">{title}</h4>}
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      {children}
    </div>
    {time && <span className="text-xs text-muted-foreground/60">{time}</span>}
  </div>
)

// 2. CookieAlert
export const CookieAlert = ({ onAccept, onDecline }: { onAccept?: () => void; onDecline?: () => void }) => {
  const [visible, setVisible] = React.useState(true)
  if (!visible) return null
  return (
    <div className="max-w-md bg-card border rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Cookie className="h-6 w-6 text-orange-500 animate-bounce" />
        <h4 className="font-bold text-lg">Cookie Preferences</h4>
      </div>
      <p className="text-sm text-muted-foreground">
        We use cookies to improve your experience. By continuing to visit this site you agree to our use of cookies.
      </p>
      <div className="flex gap-3 pt-2">
        <button 
          onClick={() => { setVisible(false); onAccept?.(); }}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 transition-colors rounded-xl text-sm font-semibold shadow-md shadow-primary/10"
        >
          Accept All
        </button>
        <button 
          onClick={() => { setVisible(false); onDecline?.(); }}
          className="flex-1 px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  )
}

// 3. OfflineBanner
export const OfflineBanner = () => (
  <div className="w-full bg-red-600 text-white p-3.5 flex justify-center items-center gap-2 text-sm font-semibold shadow-md sm:rounded-xl">
    <WifiOff className="w-4 h-4 animate-pulse" /> You are currently offline. Some features may be unavailable.
  </div>
)

// 4. RateLimitAlert
export const RateLimitAlert = () => (
  <div className="border border-orange-500/30 bg-orange-500/10 p-5 rounded-2xl flex gap-3 items-start max-w-md shadow-sm">
    <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 animate-pulse" />
    <div className="flex-1">
      <h4 className="font-bold text-orange-600 dark:text-orange-400">Rate Limit Exceeded</h4>
      <p className="text-sm text-orange-600/80 dark:text-orange-400/80 mt-1 mb-4">
        You have made too many requests. Please wait 45 seconds before trying again.
      </p>
      <div className="w-full h-1.5 bg-orange-500/20 rounded-full overflow-hidden">
        <motion.div animate={{ width: ["100%", "0%"] }} transition={{ duration: 45, ease: "linear" }} className="h-full bg-orange-500" />
      </div>
    </div>
  </div>
)

// Re-export original/merged components
export { Alert, AlertTitle, AlertDescription }
export const CyberAlert = ({ title, description, variant, ...props }: any) => (
  <Alert variant="cyberpunk" title={title} description={description} {...props} />
)
export const SoftAlert = ({ title, description, variant, ...props }: any) => (
  <Alert variant={variant === "success" ? "success" : "info"} title={title} description={description} {...props} />
)
export const MinimalAlert = ({ title, description, variant, ...props }: any) => (
  <Alert variant="minimal" title={title} description={description} {...props} />
)
export const LeftBorderAlert = ({ title, description, variant, ...props }: any) => (
  <Alert variant={variant === "warning" ? "warning" : "default"} className="border-l-4 border-l-primary" title={title} description={description} {...props} />
)
export const IconTopAlert = ({ title, description, variant, ...props }: any) => (
  <div className="flex flex-col items-center text-center p-6 bg-card border rounded-2xl" {...props}>
    <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
      <AlertCircle className="h-6 w-6" />
    </div>
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
)
export const SolidAlert = ({ title, description, variant, ...props }: any) => {
  const bgClasses: Record<string, string> = {
    error: "bg-red-600 text-white border-0",
    success: "bg-emerald-600 text-white border-0",
    warning: "bg-amber-500 text-black border-0",
    default: "bg-primary text-primary-foreground border-0",
  }
  const bgClass = bgClasses[variant] || bgClasses.default
  return (
    <div className={cn("p-4 rounded-xl shadow-lg flex gap-3 items-start", bgClass)} {...props}>
      <Info className="h-5 w-5 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm opacity-90 mt-1">{description}</p>
      </div>
    </div>
  )
}
export const BannerAlert = ({ message, variant, ...props }: any) => (
  <Alert variant="banner" title={message} {...props} />
)
export const NeonAlert = ({ title, description, variant, ...props }: any) => (
  <Alert variant="neon" title={title} description={description} {...props} />
)
export const GlassAlert = ({ title, description, variant, ...props }: any) => (
  <Alert variant="glass" title={title} description={description} {...props} />
)
export const DismissibleAlert = ({ variant, title, description, ...props }: any) => (
  <Alert variant={variant} title={title || "Attention"} description={description || "Action required"} dismissible={true} {...props} />
)


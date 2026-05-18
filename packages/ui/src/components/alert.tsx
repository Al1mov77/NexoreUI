"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"
import { motion, HTMLMotionProps } from "framer-motion"

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-background/50 border-border text-foreground",
        destructive: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
        glass: "backdrop-blur-md bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5 text-foreground",
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
  /**
   * Whether to enable entry animations
   * @default true
   */
  animate?: boolean;
  /**
   * The title of the alert
   */
  title?: React.ReactNode;
  /**
   * The description of the alert
   */
  description?: React.ReactNode;
  /**
   * An optional icon to display
   */
  icon?: React.ReactNode;
  /**
   * Whether the alert can be dismissed
   */
  dismissible?: boolean;
  /**
   * Callback function called when the alert is dismissed
   */
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, animate = true, title, description, icon, dismissible, onDismiss, children, ...props }, ref) => {
    const isCompound = !title && !description && !icon;
    const [isOpen, setIsOpen] = React.useState(true);

    if (!isOpen) return null;

    const content = isCompound ? (
      children
    ) : (
      <>
        {icon && <div className="absolute left-4 top-4">{icon}</div>}
        <div className={cn(icon ? "pl-7" : "")}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
          {!title && !description && children}
        </div>
        {dismissible && (
          <button
            onClick={() => {
              setIsOpen(false);
              onDismiss?.();
            }}
            className="absolute right-4 top-4 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
      </>
    );

    if (animate) {
      return (
        <motion.div
          ref={ref}
          role="alert"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className={cn(alertVariants({ variant }), className)}
          {...(props as unknown as HTMLMotionProps<"div">)}
        >
          {content}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
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
    className={cn("mb-1 font-semibold leading-none tracking-tight text-base", className)}
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
    className={cn("text-sm opacity-90 [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

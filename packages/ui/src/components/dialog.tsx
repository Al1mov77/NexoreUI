"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { motion, useReducedMotion } from "framer-motion"
import { X, Check } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-foreground/25 dark:bg-background/80 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const dialogContentVariants = cva(
  "fixed left-1/2 top-1/2 z-50 grid w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 border bg-card text-card-foreground p-6 shadow-md duration-200 motion-reduce:duration-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-2xl",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        glass: "border-border bg-card/90 backdrop-blur-md text-card-foreground",
        destructive: "border-destructive/40 bg-card text-card-foreground",
        success: "border-success/40 bg-card text-card-foreground",
        fullscreen:
          "left-0 top-0 translate-x-0 translate-y-0 w-screen max-w-none h-screen rounded-none border-0 bg-background text-foreground",
        drawer:
          "left-0 right-0 bottom-0 top-auto translate-x-0 translate-y-0 w-full max-w-none rounded-t-2xl rounded-b-none border-x-0 border-b-0 border-border bg-card text-card-foreground max-h-[85vh] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        command:
          "top-[18%] translate-y-0 border-border bg-card text-card-foreground p-0 overflow-hidden",
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        full: "max-w-[95vw] md:max-w-[90vw]",
      },
      scrollable: {
        true: "max-h-[82vh] overflow-y-auto",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "fullscreen",
        className: "max-w-none w-screen",
      },
      {
        variant: "drawer",
        className: "max-w-none w-full",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "lg",
      scrollable: false,
    },
  }
)

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  showEscHint?: boolean
  hideClose?: boolean
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      variant,
      size,
      scrollable,
      showEscHint = false,
      hideClose = false,
      children,
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(dialogContentVariants({ variant, size, scrollable }), className)}
        {...props}
      >
        {(variant === "destructive" || variant === "success") && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-5 top-0 h-0.5 rounded-full",
              variant === "destructive" ? "bg-destructive" : "bg-success"
            )}
          />
        )}
        {variant === "drawer" && (
          <div className="flex justify-center -mt-2 mb-1" aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>
        )}
        {children}
        {!hideClose && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5">
            {showEscHint && (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-border bg-muted/60 font-mono text-[10px] font-medium text-muted-foreground select-none">
                ESC
              </kbd>
            )}
            <DialogPrimitive.Close
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
)
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-left pr-12", className)}
    {...props}
  />
))
DialogHeader.displayName = "DialogHeader"

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2",
      className
    )}
    {...props}
  />
))
DialogFooter.displayName = "DialogFooter"

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-y-auto py-3 text-sm text-muted-foreground border-y border-border/60",
        className
      )}
      {...props}
    />
  )
)
DialogBody.displayName = "DialogBody"

export interface DialogStepHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
  totalSteps: number
  label?: string
}

const DialogStepHeader = React.forwardRef<HTMLDivElement, DialogStepHeaderProps>(
  ({ step, totalSteps, label, className, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    const safeTotal = Math.max(1, totalSteps)
    const clampedStep = Math.min(safeTotal, Math.max(1, step))

    return (
      <div
        ref={ref}
        className={cn("space-y-2.5 pr-12", className)}
        {...props}
      >
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-foreground truncate">
            {label || `Step ${clampedStep}`}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums shrink-0">
            {String(clampedStep).padStart(2, "0")} / {String(safeTotal).padStart(2, "0")}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={clampedStep}
          aria-valuemin={1}
          aria-valuemax={safeTotal}
          aria-label={label || "Dialog step progress"}
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${safeTotal}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: safeTotal }).map((_, idx) => {
            const active = idx < clampedStep
            return (
              <div
                key={idx}
                className="h-1 rounded-full bg-muted overflow-hidden"
              >
                <motion.div
                  initial={false}
                  animate={{ scaleX: active ? 1 : 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.22, ease: "easeOut" }
                  }
                  className="h-full w-full origin-left rounded-full bg-foreground"
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
DialogStepHeader.displayName = "DialogStepHeader"

export interface DialogConfirmButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onConfirm: () => void
  holdDuration?: number
  label?: string
  holdingLabel?: string
  confirmedLabel?: string
  variant?: "destructive" | "primary"
}

const DialogConfirmButton = React.forwardRef<
  HTMLButtonElement,
  DialogConfirmButtonProps
>(
  (
    {
      onConfirm,
      holdDuration = 1200,
      label = "Hold to confirm",
      holdingLabel = "Keep holding...",
      confirmedLabel = "Confirmed",
      variant = "destructive",
      disabled = false,
      className,
      onKeyDown,
      onKeyUp,
      onBlur,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()
    const [progress, setProgress] = React.useState(0)
    const [holding, setHolding] = React.useState(false)
    const [confirmed, setConfirmed] = React.useState(false)
    const rafRef = React.useRef<number | null>(null)
    const startRef = React.useRef<number>(0)

    const stopHold = React.useCallback(() => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      setHolding(false)
      setProgress(0)
    }, [])

    React.useEffect(() => {
      return () => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current)
        }
      }
    }, [])

    const startHold = React.useCallback(() => {
      if (disabled || confirmed || holding) return
      if (holdDuration <= 0) {
        setConfirmed(true)
        onConfirm()
        return
      }
      setHolding(true)
      startRef.current = performance.now()

      const tick = (now: number) => {
        const elapsed = now - startRef.current
        const next = Math.min(1, elapsed / holdDuration)
        setProgress(next)
        if (next >= 1) {
          rafRef.current = null
          setHolding(false)
          setConfirmed(true)
          onConfirm()
          return
        }
        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    }, [disabled, confirmed, holding, holdDuration, onConfirm])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e)
      if ((e.key === " " || e.key === "Enter") && !e.repeat) {
        e.preventDefault()
        startHold()
      }
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyUp?.(e)
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        if (!confirmed) stopHold()
      }
    }

    const remainingSeconds = Math.max(
      0,
      ((1 - progress) * holdDuration) / 1000
    ).toFixed(1)

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onPointerDown={startHold}
        onPointerUp={() => {
          if (!confirmed) stopHold()
        }}
        onPointerLeave={() => {
          if (!confirmed) stopHold()
        }}
        onPointerCancel={() => {
          if (!confirmed) stopHold()
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={(e) => {
          onBlur?.(e)
          if (!confirmed) stopHold()
        }}
        aria-label={confirmed ? confirmedLabel : label}
        className={cn(
          "relative inline-flex h-9 items-center justify-center gap-2 overflow-hidden rounded-lg px-4 text-xs font-semibold select-none transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none",
          variant === "destructive"
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0",
            variant === "destructive"
              ? "bg-destructive-foreground/20"
              : "bg-primary-foreground/20",
            shouldReduceMotion ? "transition-none" : "transition-none"
          )}
          style={{ width: `${Math.round((confirmed ? 1 : progress) * 100)}%` }}
        />
        <span className="relative z-10 inline-flex items-center gap-2">
          {confirmed ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>{confirmedLabel}</span>
            </>
          ) : holding ? (
            <>
              <span>{holdingLabel}</span>
              <span className="font-mono text-[11px] tabular-nums opacity-90">
                {remainingSeconds}s
              </span>
            </>
          ) : (
            <span>{label}</span>
          )}
        </span>
      </button>
    )
  }
)
DialogConfirmButton.displayName = "DialogConfirmButton"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-snug tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogBody,
  DialogStepHeader,
  DialogConfirmButton,
  DialogTitle,
  DialogDescription,
}

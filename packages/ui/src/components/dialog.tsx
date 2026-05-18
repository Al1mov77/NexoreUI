"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "../utils/cn"
import { Button } from "./button"

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
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border/50 bg-background/95 backdrop-blur-md p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:scale-95 data-[state=open]:scale-100 data-[state=closed]:translate-y-[-48%] data-[state=open]:translate-y-[-50%] rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent",
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
  DialogTitle,
  DialogDescription,
}

export interface ModalProps {
  /**
   * The title of the modal
   */
  title?: React.ReactNode;
  /**
   * The description of the modal
   */
  description?: React.ReactNode;
  /**
   * The content of the modal
   */
  children?: React.ReactNode;
  /**
   * The trigger element to open the modal
   */
  trigger?: React.ReactNode;
  /**
   * Callback function called when the confirm button is clicked
   */
  onConfirm?: () => void;
  /**
   * Callback function called when the cancel button is clicked
   */
  onCancel?: () => void;
  /**
   * The text for the confirm button
   * @default "Confirm"
   */
  confirmText?: string;
  /**
   * The text for the cancel button
   * @default "Cancel"
   */
  cancelText?: string;
  /**
   * Whether the modal is open
   */
  isOpen?: boolean;
  /**
   * Callback function called when the open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * The variant of the modal
   * @default "default"
   */
  variant?: "default" | "glass" | "destructive" | "success" | "fullscreen" | "drawer";
  /**
   * Whether the content is scrollable
   * @default false
   */
  scrollable?: boolean;
  /**
   * Additional className for the dialog content
   */
  className?: string;
}

export function Modal({
  title,
  description,
  children,
  trigger,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isOpen,
  onOpenChange,
  variant = "default",
  scrollable = false,
  className,
}: ModalProps) {
  const variantClasses = {
    default: "",
    glass: "bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl",
    destructive: "border-destructive/20",
    success: "border-green-500/20",
    fullscreen: "max-w-full h-screen rounded-none",
    drawer: "sm:max-w-full sm:h-[50vh] sm:rounded-b-none sm:rounded-t-[20px] fixed bottom-0 top-auto translate-y-0",
  }

  const isDestructive = variant === "destructive";
  const isSuccess = variant === "success";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn(variantClasses[variant], scrollable ? "max-h-[80vh] overflow-y-auto" : "", className)}>
        {(title || description || isDestructive || isSuccess) && (
          <DialogHeader className={cn((isDestructive || isSuccess) ? "flex flex-col items-center text-center sm:text-center" : "")}>
            {isDestructive && (
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            )}
            {isSuccess && (
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mb-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            )}
            {title && <DialogTitle className={cn((isDestructive || isSuccess) ? "text-xl" : "")}>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className="py-4">{children}</div>
        {(onConfirm || onCancel || isDestructive || isSuccess) && (
          <DialogFooter className={cn((isDestructive || isSuccess) ? "sm:justify-center flex-col sm:flex-row gap-2" : "")}>
            {onCancel && (
              <DialogPrimitive.Close asChild>
                <Button variant="outline" className={cn((isDestructive || isSuccess) ? "w-full sm:w-auto" : "")} onClick={onCancel}>{cancelText}</Button>
              </DialogPrimitive.Close>
            )}
            {onConfirm && (
              <Button 
                variant={isDestructive ? "destructive" : "default"} 
                className={cn((isDestructive || isSuccess) ? "w-full sm:w-auto" : "", isSuccess ? "bg-green-500 hover:bg-green-600" : "")} 
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

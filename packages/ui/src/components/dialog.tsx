"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, AlertTriangle, CheckCircle, Star } from "lucide-react"
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
   * The size of the modal
   * @default "lg"
   */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
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
  size = "lg",
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

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-[95vw] md:max-w-[90vw]",
  }

  const isDestructive = variant === "destructive";
  const isSuccess = variant === "success";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn(sizeClasses[size], variantClasses[variant], scrollable ? "max-h-[80vh] overflow-y-auto" : "", className)}>
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

// ============================================
// Backward compatibility wrappers & variants
// ============================================

export interface BasicModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const BasicModal = ({
  isOpen,
  onOpenChange,
  trigger,
  title = "Basic Modal",
  description = "This is a simple modal dialog that can be used for various purposes.",
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  className = "",
  size = "lg"
}: BasicModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      className={className}
      variant="default"
      size={size}
    >
      {children}
    </Modal>
  )
}

export interface InteractiveGlassModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const InteractiveGlassModal = ({
  isOpen,
  onOpenChange,
  trigger,
  icon = <Star className="w-6 h-6 text-yellow-300" />,
  title = "Premium Glass Effect",
  description = "This modal uses full glassmorphism for a stunning visual effect.",
  children,
  confirmText = "Upgrade Now",
  cancelText = "Maybe Later",
  onConfirm,
  onCancel,
  className = "",
  size = "lg"
}: InteractiveGlassModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={<span className="flex items-center gap-2">{icon} {title}</span>}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      className={className}
      variant="glass"
      size={size}
    >
      {children}
    </Modal>
  )
}

export interface DangerModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export const DangerModal = ({
  isOpen,
  onOpenChange,
  trigger,
  icon = <X className="w-8 h-8" />,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  children,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  className = "",
  size = "lg"
}: DangerModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      className={className}
      variant="destructive"
      size={size}
    >
      {children}
    </Modal>
  )
}

export interface GlassModalProps {
  trigger?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
}

export function GlassModal({ trigger, title = "Glass Modal", description, children, open, onOpenChange, size = "lg" }: GlassModalProps) {
  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={title}
      description={description}
      variant="glass"
      size={size}
    >
      {children}
    </Modal>
  )
}

export interface AlertModalProps {
  trigger?: React.ReactNode
  title?: string
  description?: string
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AlertModal({ 
  trigger, 
  title = "Are you absolutely sure?", 
  description, 
  onConfirm, 
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  children, 
  open, 
  onOpenChange 
}: AlertModalProps) {
  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      variant="destructive"
    >
      {children}
    </Modal>
  )
}

export interface SuccessModalProps {
  trigger?: React.ReactNode
  title?: string
  description?: string
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  confirmText?: string
  onConfirm?: () => void
}

export function SuccessModal({ 
  trigger, 
  title = "Success!", 
  description, 
  children, 
  open, 
  onOpenChange,
  confirmText = "Awesome",
  onConfirm
}: SuccessModalProps) {
  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={title}
      description={description}
      confirmText={confirmText}
      onConfirm={onConfirm}
      variant="success"
    >
      {children}
    </Modal>
  )
}

export interface CommandPaletteModalProps {
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CommandPaletteModal({ trigger, open, onOpenChange }: CommandPaletteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-0 overflow-hidden sm:max-w-[600px] gap-0">
        <div className="flex items-center border-b px-3">
          <svg className="mr-2 h-4 w-4 shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" placeholder="Type a command or search..." />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Suggestions</div>
          <div className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent/50">
            Calendar
          </div>
          <div className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent/50">
            Search Emoji
          </div>
          <div className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent/50">
            Calculator
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export interface BottomSheetSimulatedProps {
  trigger: React.ReactNode
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function BottomSheetSimulated({ trigger, children, open, onOpenChange }: BottomSheetSimulatedProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-full sm:h-[50vh] sm:rounded-b-none sm:rounded-t-[10px] fixed bottom-0 top-auto translate-y-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {children}
      </DialogContent>
    </Dialog>
  )
}

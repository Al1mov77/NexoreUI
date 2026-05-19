"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "../utils/cn"
import { Button } from "./button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "./dialog"

// ============================================
// 1. GlassModal — Glassmorphic modal dialog
// ============================================
export interface GlassModalProps {
  /** Trigger element that opens the modal */
  trigger?: React.ReactNode
  /** Modal title */
  title?: React.ReactNode
  /** Optional modal description */
  description?: React.ReactNode
  /** Modal body content */
  children?: React.ReactNode
  /** Control open state externally */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
}

export function GlassModal({ trigger, title = "Glass Modal", description, children, open, onOpenChange }: GlassModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl sm:max-w-[425px]">
        <DialogHeader>
          {title && <DialogTitle className="text-foreground">{title}</DialogTitle>}
          {description && <DialogDescription className="text-muted-foreground">{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// 2. AlertModal — Destructive confirmation modal
// ============================================
export interface AlertModalProps {
  /** Trigger element that opens the modal */
  trigger?: React.ReactNode
  /** Modal title */
  title?: string
  /** Optional modal description */
  description?: string
  /** Callback when user confirms the action */
  onConfirm?: () => void
  /** Callback when user cancels the action */
  onCancel?: () => void
  /** Confirm button text */
  confirmText?: string
  /** Cancel button text */
  cancelText?: string
  /** Modal body content */
  children?: React.ReactNode
  /** Control open state externally */
  open?: boolean
  /** Callback when open state changes */
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[400px] border-destructive/20">
        <DialogHeader className="flex flex-col items-center text-center sm:text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          {title && <DialogTitle className="text-xl">{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter className="sm:justify-center flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto" onClick={onCancel}>{cancelText}</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm} className="w-full sm:w-auto">{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// 3. SuccessModal — Success state modal
// ============================================
export interface SuccessModalProps {
  /** Trigger element */
  trigger?: React.ReactNode
  /** Modal title */
  title?: string
  /** Optional description */
  description?: string
  /** Modal body content */
  children?: React.ReactNode
  /** Control open state externally */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Confirm button text */
  confirmText?: string
  /** Callback when user confirms */
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[400px] border-green-500/20">
        <DialogHeader className="flex flex-col items-center text-center sm:text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mb-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          {title && <DialogTitle className="text-xl">{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600" onClick={onConfirm}>{confirmText}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// 4. CommandPaletteModal — Command palette style modal
// ============================================
export interface CommandPaletteModalProps {
  /** Trigger element */
  trigger: React.ReactNode
  /** Control open state externally */
  open?: boolean
  /** Callback when open state changes */
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

// ============================================
// 5. BottomSheetSimulated — Bottom sheet style dialog
// ============================================
export interface BottomSheetSimulatedProps {
  /** Trigger element */
  trigger: React.ReactNode
  /** Content inside the bottom sheet */
  children?: React.ReactNode
  /** Control open state externally */
  open?: boolean
  /** Callback when open state changes */
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

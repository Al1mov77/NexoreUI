"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"
import { Check, Upload, Star, Plus, Minus, FileText, X } from "lucide-react"

export interface RadioCardProps {
  title: string
  description?: string
  checked?: boolean
  selected?: boolean
  readOnly?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: () => void
  value?: string
  name?: string
  className?: string
}

export const RadioCard = ({
  title,
  description,
  checked,
  selected,
  readOnly,
  onChange,
  onClick,
  value,
  name,
  className,
}: RadioCardProps) => {
  const isChecked = Boolean(checked ?? selected)
  const hasInteractiveHandler = Boolean(onChange || onClick)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    if (!onChange && onClick) {
      onClick()
    }
  }

  return (
    <label
      className={cn(
        "relative flex cursor-pointer rounded-lg border p-4 hover:bg-accent/50 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        isChecked ? "border-primary bg-primary/5 shadow-xs" : "border-border bg-card",
        className
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={hasInteractiveHandler ? handleInputChange : undefined}
        readOnly={readOnly ?? !hasInteractiveHandler}
        className="sr-only"
      />
      <div className="flex w-full justify-between items-center gap-3">
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-foreground">{title}</span>
          {description && (
            <span className="text-xs text-muted-foreground mt-0.5">{description}</span>
          )}
        </div>
        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            isChecked ? "border-primary bg-primary" : "border-muted-foreground/50"
          )}
        >
          {isChecked && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
        </div>
      </div>
    </label>
  )
}

export interface ColorSwatchProps {
  color: string
  selected?: boolean
  onClick?: () => void
}

export const ColorSwatch = ({ color, selected, onClick }: ColorSwatchProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Select color ${color}`}
    aria-pressed={selected}
    className={cn(
      "relative flex h-9 w-9 items-center justify-center rounded-full border border-border transition-transform hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      selected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
    )}
    style={{ backgroundColor: color }}
  >
    {selected && <Check className="h-4 w-4 text-primary-foreground drop-shadow-xs" />}
  </button>
)

export interface NumberStepperProps {
  value?: number
  onChange?: (val: number) => void
  min?: number
  max?: number
}

export const NumberStepper = ({ value = 0, onChange, min = 0, max = 100 }: NumberStepperProps) => (
  <div className="flex items-center space-x-2 rounded-md border border-border p-1 w-fit bg-card">
    <button
      type="button"
      aria-label="Decrease value"
      disabled={value <= min}
      onClick={() => onChange?.(Math.max(min, value - 1))}
      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Minus className="h-4 w-4" />
    </button>
    <div className="w-8 text-center font-mono font-medium text-sm tabular-nums text-foreground">
      {value}
    </div>
    <button
      type="button"
      aria-label="Increase value"
      disabled={value >= max}
      onClick={() => onChange?.(Math.min(max, value + 1))}
      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Plus className="h-4 w-4" />
    </button>
  </div>
)

export interface FileDropzoneProps {
  onDrop?: (files: FileList) => void
  accept?: string
  multiple?: boolean
  className?: string
}

function formatDropzoneSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const FileDropzone = ({
  onDrop,
  accept,
  multiple = true,
  className,
}: FileDropzoneProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const nextList = Array.from(files)
    setSelectedFiles((prev) => (multiple ? [...prev, ...nextList] : nextList.slice(0, 1)))
    onDrop?.(files)
  }

  const removeFile = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation()
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className={cn("w-full space-y-2.5", className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          "flex flex-col items-center justify-center w-full min-h-36 px-4 py-5 border border-dashed rounded-xl bg-card hover:bg-accent/40 transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isDragging ? "border-primary bg-accent/60" : "border-border"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ""
          }}
          className="sr-only"
        />
        <div className="p-2.5 rounded-lg bg-muted border border-border group-hover:bg-background transition-colors mb-2.5">
          <Upload className="h-4 w-4 text-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground text-center">
          {selectedFiles.length > 0
            ? `${selectedFiles.length} ${selectedFiles.length === 1 ? "file" : "files"} attached`
            : "Click or drag files to upload"}
        </p>
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {accept ? `Accepted formats: ${accept}` : "Supports documents, CSV, JSON, and image files."}
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card overflow-hidden">
          {selectedFiles.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between gap-3 px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium text-foreground truncate">{file.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {formatDropzoneSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={(e) => removeFile(e, idx)}
                  aria-label={`Remove ${file.name}`}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export interface RatingStarsProps {
  rating?: number
  value?: number
  max?: number
  onRate?: (rate: number) => void
  onChange?: (rate: number) => void
}

export const RatingStars = ({
  rating = 0,
  value,
  max = 5,
  onRate,
  onChange,
}: RatingStarsProps) => {
  const currentRating = value ?? rating
  const handleRate = onChange ?? onRate

  return (
    <div className="flex items-center space-x-1" role="group" aria-label="Rating">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1
        const isActive = i < currentRating
        return (
          <button
            key={i}
            type="button"
            aria-label={`Rate ${starValue} out of ${max}`}
            aria-pressed={isActive}
            onClick={() => handleRate?.(starValue)}
            className="p-1 rounded-sm transition-transform hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Star
              className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "fill-warning text-warning" : "fill-muted text-muted-foreground/50"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export interface ToggleGroupItemWrapperProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export const ToggleGroupItemWrapper = ({
  children,
  active,
  onClick,
}: ToggleGroupItemWrapperProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "px-4 py-2 text-sm font-medium transition-colors border border-transparent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      active
        ? "bg-background text-foreground shadow-xs rounded-md"
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
  </button>
)

export interface ToggleGroupWrapperProps {
  children: React.ReactNode
}

export const ToggleGroupWrapper = ({ children }: ToggleGroupWrapperProps) => (
  <div className="inline-flex items-center rounded-lg bg-muted p-1 border border-border">{children}</div>
)

export interface InputWithLabelOverlayProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export const InputWithLabelOverlay = ({ label, id, ...props }: InputWithLabelOverlayProps) => (
  <div className="relative">
    <input
      id={id}
      className="block w-full rounded-md border border-border bg-background px-3 pb-2 pt-6 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary peer"
      placeholder=" "
      {...props}
    />
    <label
      htmlFor={id}
      className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-foreground cursor-text"
    >
      {label}
    </label>
  </div>
)

export interface VisualSelectCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  selected?: boolean
}

export const VisualSelectCard = ({
  icon: Icon,
  title,
  description,
  selected,
}: VisualSelectCardProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-colors cursor-pointer hover:border-foreground/40",
      selected ? "border-primary bg-primary/5" : "border-border bg-card"
    )}
  >
    <Icon className={cn("h-7 w-7 mb-3", selected ? "text-primary" : "text-muted-foreground")} />
    <h3 className="font-semibold text-sm mb-1 text-foreground">{title}</h3>
    {description && <p className="text-xs text-muted-foreground">{description}</p>}
  </div>
)

export interface FloatingActionFormProps {
  isOpen: boolean
  toggle: () => void
  children: React.ReactNode
}

export const FloatingActionForm = ({ isOpen, toggle, children }: FloatingActionFormProps) => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <div className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
            className="absolute bottom-16 right-0 w-80 bg-card border border-border rounded-xl shadow-md p-4 origin-bottom-right"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close action menu" : "Open action menu"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.16 }}
        >
          <Plus className="h-5 w-5" />
        </motion.div>
      </button>
    </div>
  )
}

export interface OTPInputProps {
  length?: number
}

export const OTPInput = ({ length = 6 }: OTPInputProps) => (
  <div className="flex space-x-2">
    {Array.from({ length }).map((_, i) => (
      <input
        key={i}
        type="text"
        maxLength={1}
        aria-label={`Verification digit ${i + 1}`}
        className="w-11 h-12 text-center text-lg font-mono font-bold rounded-md border border-border bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none tabular-nums"
      />
    ))}
  </div>
)

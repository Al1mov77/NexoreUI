"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { UploadCloud, File, X, AlertCircle } from "lucide-react"
import { cn } from "../utils/cn"
import { Button } from "./button"

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onUpload: (files: File[]) => void
  accept?: string
  maxSize?: number
  multiple?: boolean
  variant?: "default" | "dropzone" | "button"
  className?: string
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      onUpload,
      accept,
      maxSize = 10 * 1024 * 1024,
      multiple = false,
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion()
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [dragActive, setDragActive] = React.useState(false)
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
    const [error, setError] = React.useState<string | null>(null)

    const handleFiles = (files: FileList | null) => {
      if (!files) return
      setError(null)
      const validFiles: File[] = []

      const fileArray = Array.from(files)
      const limit = multiple ? fileArray.length : 1
      const filesToProcess = fileArray.slice(0, limit)

      for (const file of filesToProcess) {
        if (file.size > maxSize) {
          setError(
            `File "${file.name}" exceeds the maximum allowed size of ${(maxSize / (1024 * 1024)).toFixed(0)}MB.`
          )
          return
        }

        if (accept) {
          const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase())
          const fileName = file.name.toLowerCase()
          const fileType = file.type.toLowerCase()
          const isAccepted = acceptedTypes.some((type) => {
            if (type.startsWith(".")) {
              return fileName.endsWith(type)
            }
            if (type.endsWith("/*")) {
              const baseType = type.split("/")[0]
              return fileType.startsWith(`${baseType}/`)
            }
            return fileType === type
          })

          if (!isAccepted) {
            setError(`File type for "${file.name}" is not supported.`)
            return
          }
        }

        validFiles.push(file)
      }

      if (validFiles.length > 0) {
        const updated = multiple ? [...selectedFiles, ...validFiles] : validFiles
        setSelectedFiles(updated)
        onUpload(updated)
      }
    }

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files)
        e.target.value = ""
      }
    }

    const removeFile = (idx: number) => {
      const updated = selectedFiles.filter((_, i) => i !== idx)
      setSelectedFiles(updated)
      onUpload(updated)
    }

    const triggerFileInput = () => {
      fileInputRef.current?.click()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        triggerFileInput()
      }
    }

    return (
      <div ref={ref} className={cn("w-full space-y-3", className)} {...props}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />

        {variant === "button" ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground shrink-0">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Select File{multiple ? "s" : ""}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {accept ? `Supports: ${accept}` : "Any file"} (Max:{" "}
                  {(maxSize / (1024 * 1024)).toFixed(0)}MB)
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="default"
              onClick={triggerFileInput}
              className="flex items-center gap-2 shrink-0 w-full sm:w-auto"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Browse Files</span>
            </Button>
          </div>
        ) : (
          <motion.div
            role="button"
            tabIndex={0}
            aria-label="Upload files by clicking or dropping"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            onKeyDown={handleKeyDown}
            className={cn(
              "relative flex flex-col items-center justify-center border border-dashed rounded-xl cursor-pointer transition-colors p-6 text-center select-none bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background group",
              dragActive
                ? "border-primary bg-muted/50"
                : "border-border hover:border-foreground/40 hover:bg-muted/20",
              variant === "dropzone" ? "min-h-[200px]" : "min-h-[140px]"
            )}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-muted rounded-full border border-border transition-colors group-hover:bg-background">
                <UploadCloud className="h-5 w-5 text-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  {accept ? `Supports: ${accept}` : "All files supported"} (Max:{" "}
                  {(maxSize / (1024 * 1024)).toFixed(0)}MB)
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
              className="border border-border rounded-xl divide-y divide-border overflow-hidden bg-card"
            >
              {selectedFiles.map((file, idx) => (
                <motion.div
                  key={`${file.name}-${idx}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
                  className="flex items-center justify-between p-3 text-sm bg-card gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <File className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex flex-col text-left">
                      <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-[280px]">
                        {file.name}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                        {Math.max(1, Math.round(file.size / 1024))} KB
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${file.name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(idx)
                    }}
                    className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

FileUpload.displayName = "FileUpload"

export { FileUpload }

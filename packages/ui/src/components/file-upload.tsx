"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, File, X, AlertCircle } from "lucide-react"
import { cn } from "../utils/cn"
import { Button } from "./button"

/**
 * Props for the FileUpload component
 */
export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /**
   * Callback fired when files are successfully validated and selected
   */
  onUpload: (files: File[]) => void
  /**
   * Accepted mime types or extensions, e.g. "image/*,application/pdf"
   */
  accept?: string
  /**
   * Maximum file size in bytes
   * @default 10 * 1024 * 1024 (10MB)
   */
  maxSize?: number
  /**
   * Whether to allow multiple file uploads
   * @default false
   */
  multiple?: boolean
  /**
   * Layout visual style
   * @default "default"
   */
  variant?: "default" | "dropzone" | "button"
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * FileUpload component manages local file selection, validation, drag-and-drop state, and displays current uploads.
 */
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
        // Validate size
        if (file.size > maxSize) {
          setError(`File "${file.name}" exceeds the maximum allowed size of ${(maxSize / (1024 * 1024)).toFixed(0)}MB.`)
          return
        }

        // Validate accept
        if (accept) {
          const acceptedTypes = accept.split(",").map(t => t.trim())
          const isAccepted = acceptedTypes.some((type) => {
            if (type.startsWith(".")) {
              return file.name.endsWith(type)
            }
            if (type.endsWith("/*")) {
              const baseType = type.split("/")[0]
              return file.type.startsWith(`${baseType}/`)
            }
            return file.type === type
          })

          if (!isAccepted) {
            setError(`File type for "${file.name}" is not supported.`)
            return
          }
        }

        validFiles.push(file)
      }

      if (validFiles.length > 0) {
        let updated: File[]
        if (multiple) {
          updated = [...selectedFiles, ...validFiles]
        } else {
          updated = validFiles
        }
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

    return (
      <div ref={ref} className={cn("w-full space-y-4", className)} {...props}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        {variant === "button" ? (
          <Button variant="default" onClick={triggerFileInput} className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            <span>Upload File{multiple ? "s" : ""}</span>
          </Button>
        ) : (
          <motion.div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={cn(
              "relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 p-6 text-center select-none bg-muted/5",
              dragActive
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border hover:border-muted-foreground/40 hover:bg-muted/10",
              variant === "dropzone" ? "min-h-[220px]" : "min-h-[140px]"
            )}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-muted/40 rounded-full border border-border group-hover:scale-110 transition-transform">
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-muted-foreground">
                  {accept ? `Supports: ${accept}` : "All files supported"} (Max: {(maxSize / (1024 * 1024)).toFixed(0)}MB)
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error messaging */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected file preview tags */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-border/60 rounded-xl divide-y divide-border/40 overflow-hidden"
            >
              {selectedFiles.map((file, idx) => (
                <motion.div
                  key={file.name + idx}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between p-3 text-sm bg-card"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <File className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0 flex flex-col text-left">
                      <span className="font-medium text-foreground truncate max-w-[280px]">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(idx)
                    }}
                    className="h-7 w-7 rounded-lg text-muted-foreground/60 hover:text-foreground"
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

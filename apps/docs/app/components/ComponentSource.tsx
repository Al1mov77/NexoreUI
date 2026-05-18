"use client"

import React, { useState, useCallback } from "react"
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "nexoreui"

interface ComponentCardProps {
  /** Component title */
  title: string
  /** Component description */
  description?: string
  /** Source code to display */
  code: string
  /** File name for the code block header */
  fileName?: string
  /** Live demo content */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

export function ComponentCard({
  title,
  description,
  code,
  fileName = "component.tsx",
  children,
  className,
}: ComponentCardProps) {
  const [copied, setCopied] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className={cn("rounded-xl border border-border/60 bg-card overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/20">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground/70 mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50"
        >
          {showCode ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          Code
        </button>
      </div>

      {/* Demo Area */}
      <div className="p-6 bg-background dark:bg-[#0a0a0c] demo-grid-pattern min-h-[120px] flex items-center justify-center">
        <div className="w-full">
          {children}
        </div>
      </div>

      {/* Code Block (collapsible) */}
      {showCode && (
        <div className="border-t border-border/50">
          {/* Mac-style header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f0f12] dark:bg-[#0c0c0e]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
              </div>
              <span className="text-[11px] text-white/30 font-mono">{fileName}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          {/* Code content */}
          <div className="overflow-x-auto bg-[#0f0f12] dark:bg-[#0c0c0e] p-4 max-h-[300px]">
            <pre className="text-[13px] leading-relaxed text-white/50 font-mono">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Section wrapper — groups component demos under a single heading
 */
interface ComponentSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ComponentSection({ title, description, children, className }: ComponentSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  )
}

/**
 * Backward-compatible ComponentSource — used by existing section files.
 * Renders a code block with mac-style header and copy button.
 */
interface ComponentSourceProps {
  sourceCode: string
  fileName?: string
  className?: string
}

export function ComponentSource({ sourceCode, fileName = "component.tsx", className }: ComponentSourceProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(sourceCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [sourceCode])

  return (
    <div className={cn("rounded-xl border border-border/40 overflow-hidden", className)}>
      {/* Mac-style header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f0f12] dark:bg-[#0c0c0e]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
          </div>
          <span className="text-[11px] text-white/30 font-mono">{fileName}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <div className="overflow-x-auto bg-[#0f0f12] dark:bg-[#0c0c0e] p-4 max-h-[300px]">
        <pre className="text-[13px] leading-relaxed text-white/50 font-mono">
          <code>{sourceCode}</code>
        </pre>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { usePathname } from "next/navigation"
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "nexoreui"
import { AIAssistant } from "./AIAssistant"
import * as NexoreUI from "nexoreui"
import * as LucideIcons from "lucide-react"
import * as FramerMotion from "framer-motion"
import * as Babel from "@babel/standalone"
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
// Helper to translate code synchronously using regex as a fallback
function translateReactCodeRegex(code: string, target: 'react' | 'html' | 'vue'): string {
  if (target === 'react') return code;
  
  let clean = code.replace(/import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?/g, "").trim();
  const returnMatch = clean.match(/return\s*\(\s*(<[\s\S]*>)\s*\)/);
  let jsx = returnMatch ? returnMatch[1] : clean;
  if (!returnMatch) {
    const fnMatch = clean.match(/export\s+default\s+function\s+\w+\(\)\s*\{([\s\S]*)\}/);
    if (fnMatch) jsx = fnMatch[1].trim();
  }
  jsx = jsx.replace(/className=/g, 'class=');
  return target === 'html' ? `<!-- HTML Markup -->\n${jsx}` : `<template>\n  ${jsx}\n</template>\n\n<script setup>\n</script>`;
}

const TAB_EXT_MAP: Record<string, string> = {
  react: '.tsx',
  html: '.html',
  vue: '.vue',
};

// Complete scope injection for transpiled JSX execution
const componentsScope = {
  React,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ...NexoreUI,
  ...LucideIcons,
  ...FramerMotion,
}

// Babel transform JSX transpiler
function transpileJSX(code: string): string {
  try {
    const result = Babel.transform(code, {
      presets: ["react"],
      filename: "component.tsx"
    })
    return result.code || ""
  } catch (e) {
    console.error("Transpile error:", e)
    return ""
  }
}

// Safely evaluate transpiled JS string inside custom scope
function evaluateCode(transpiledCode: string, scope: any): React.ComponentType<any> | null {
  const cleanedCode = transpiledCode
    .replace(/\bexport\s+default\s+/g, "const DefaultComponent = ")
    .replace(/\bexport\s+(function|const|let|var)\s+/g, "$1 ")

  const keys = Object.keys(scope)
  const values = Object.values(scope)

  let targetComponentName = "DefaultComponent"

  if (!cleanedCode.includes("DefaultComponent")) {
    const fnMatch = cleanedCode.match(/\bfunction\s+([a-zA-Z0-9_]+)\b/)
    if (fnMatch) {
      targetComponentName = fnMatch[1]
    } else {
      const constMatch = cleanedCode.match(/\bconst\s+([a-zA-Z0-9_]+)\b/)
      if (constMatch) {
        targetComponentName = constMatch[1]
      }
    }
  }

  let executionCode = cleanedCode
  const hasFunctionOrClass = cleanedCode.includes("function") || 
                             cleanedCode.includes("=>") ||
                             cleanedCode.includes("class ");

  if (!hasFunctionOrClass && cleanedCode.includes("React.createElement")) {
    const cleanExpr = cleanedCode.trim().replace(/;+\s*$/, "");
    executionCode = `const DirectJSXComponent = () => { return (${cleanExpr}); };`
    targetComponentName = "DirectJSXComponent"
  }

  const fnBody = `
    ${executionCode}
    return typeof ${targetComponentName} !== 'undefined' ? ${targetComponentName} : null;
  `

  try {
    const evaluator = new Function(...keys, fnBody)
    return evaluator(...values)
  } catch (err) {
    console.error("Function evaluation error:", err);
    return null;
  }
}

// Safe React runtime Error Boundary
class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full flex flex-col items-center gap-3">
          <div className="w-full pointer-events-none opacity-50">
            {this.props.fallback}
          </div>
          <div className="w-full text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 font-mono overflow-x-auto text-left leading-relaxed">
            <span className="font-bold block mb-1">Runtime Render Error:</span>
            {this.state.error?.message || String(this.state.error)}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function SafeComponent({ Component, fallback }: { Component: React.ComponentType<any>; fallback: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={fallback}>
      <Component />
    </ErrorBoundary>
  )
}

interface DynamicComponentRunnerProps {
  code: string
  fallback: React.ReactNode
}

function DynamicComponentRunner({ code, fallback }: DynamicComponentRunnerProps) {
  const [error, setError] = useState<string | null>(null)

  const Component = useMemo(() => {
    try {
      setError(null)
      let cleanCode = code
        .replace(/import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?/g, "") // remove imports
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // remove JSX comments: {/* ... */}
        .replace(/\/\*[\s\S]*?\*\//g, "") // remove JS block comments: /* ... */
        .replace(/\/\/.*$/gm, "") // remove single-line comments
        .trim()

      if (!cleanCode) return null

      // If raw JSX snippet without component function, wrap in fragment/div before transpile
      const isRawSnippet = !cleanCode.includes("function") && 
                           !cleanCode.includes("=>") && 
                           !cleanCode.includes("class ");
      if (isRawSnippet) {
        cleanCode = `<div className="flex flex-wrap items-center justify-center gap-3">${cleanCode}</div>`;
      }

      const transpiled = transpileJSX(cleanCode)
      const compiled = evaluateCode(transpiled, componentsScope)
      return compiled
    } catch (err: any) {
      console.error("Dynamic compilation error:", err)
      setError(err.message || "Failed to compile component")
      return null
    }
  }, [code])

  if (error || !Component) {
    return (
      <div className="w-full flex flex-col items-center gap-3">
        <div className="w-full pointer-events-none opacity-50">
          {fallback}
        </div>
        {error && (
          <div className="w-full text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 font-mono overflow-x-auto text-left leading-relaxed">
            <span className="font-bold block mb-1">Compilation Error:</span>
            {error}
          </div>
        )}
      </div>
    )
  }

  return <SafeComponent Component={Component} fallback={fallback} />
}

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
  const [currentCode, setCurrentCode] = useState(code)
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false)
  const [copyFormat, setCopyFormat] = useState<'react' | 'html' | 'vue'>('react')
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const pathname = usePathname() || "/"

  useEffect(() => {
    setCurrentCode(code)
  }, [code])

  useEffect(() => {
    if (copyFormat === 'react') {
      setGeneratedCode(currentCode);
      return;
    }
    
    let isMounted = true;
    
    // Asynchronously generate HTML to avoid render blocking or nested update errors
    setTimeout(() => {
      try {
        let cleanCode = currentCode.replace(/import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?/g, "").trim();
        const isRawSnippet = !cleanCode.includes("function") && !cleanCode.includes("=>") && !cleanCode.includes("class ");
        if (isRawSnippet) cleanCode = `<div className="flex flex-col gap-3">${cleanCode}</div>`;

        const transpiled = transpileJSX(cleanCode);
        const Component = evaluateCode(transpiled, componentsScope);
        
        if (Component && isMounted) {
          const div = document.createElement('div');
          const root = createRoot(div);
          root.render(<Component />);
          
          // Wait for render
          setTimeout(() => {
            if (isMounted) {
              let html = div.innerHTML;
              html = html.replace(/></g, '>\n  <').replace(/className=/g, 'class=');
              
              const finalOut = copyFormat === 'html' 
                ? `<!-- HTML Markup -->\n<!-- Be sure to include Tailwind CSS -->\n${html}`
                : `<template>\n  ${html.replace(/\n/g, '\n  ')}\n</template>\n\n<script setup>\n</script>`;
                
              setGeneratedCode(finalOut);
            }
            root.unmount();
          }, 20);
        } else if (isMounted) {
          setGeneratedCode(translateReactCodeRegex(currentCode, copyFormat));
        }
      } catch (err) {
        if (isMounted) setGeneratedCode(translateReactCodeRegex(currentCode, copyFormat));
      }
    }, 0);
    
    return () => { isMounted = false; };
  }, [currentCode, copyFormat]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    fetch("/api/telegram-notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "copy",
        componentName: `${title} (${copyFormat})`,
        fileName,
        path: pathname,
      }),
    }).catch((err) => console.error("Error sending copy notification:", err))
  }, [currentCode, title, fileName, pathname, copyFormat])

  return (
    <div className={cn("rounded-xl border border-border/60 bg-card", isAIPopupOpen ? "overflow-visible" : "overflow-hidden", className)}>
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
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer"
        >
          {showCode ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          Code
        </button>
      </div>

      {/* Demo Area */}
      <div className="p-6 bg-background dark:bg-[#0a0a0c] demo-grid-pattern min-h-[120px] flex items-center justify-center">
        <div className="w-full flex items-center justify-center">
          {currentCode !== code ? (
            <DynamicComponentRunner code={currentCode} fallback={children} />
          ) : (
            children
          )}
        </div>
      </div>

      {/* Code Block (collapsible) */}
      {showCode && (
        <div className="border-t border-border/50">
          {/* Mac-style header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f0f12] dark:bg-[#0c0c0e] relative">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
              </div>
              <span className="text-[11px] text-white/30 font-mono">
                {copyFormat === 'react' ? fileName : fileName.replace(/\.\w+$/, TAB_EXT_MAP[copyFormat] || '.txt')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={copyFormat}
                onChange={(e) => setCopyFormat(e.target.value as any)}
                className="text-[9px] bg-transparent text-white/30 border border-white/10 rounded px-1.5 py-0.5 outline-none hover:text-white/60 transition-colors font-sans"
              >
                <option value="react" className="bg-zinc-950">React</option>
                <option value="html" className="bg-zinc-950">HTML/CSS</option>
                <option value="vue" className="bg-zinc-950">Vue.js</option>
              </select>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer"
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
              <AIAssistant
                currentCode={currentCode}
                onCodeChange={setCurrentCode}
                onReset={() => setCurrentCode(code)}
                isModified={currentCode !== code}
                onPopupOpenChange={setIsAIPopupOpen}
              />
            </div>
          </div>
          {/* Code content */}
          <div className="overflow-x-auto bg-[#0f0f12] dark:bg-[#0c0c0e] p-4 max-h-[300px]">
            <pre className="text-[13px] leading-relaxed text-white/50 font-mono">
              <code>{generatedCode}</code>
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
  /** When true, hides the React/HTML/Vue format selector (useful for bash/config code) */
  hideFormatSelector?: boolean
}

export function ComponentSource({ sourceCode, fileName = "component.tsx", className, hideFormatSelector }: ComponentSourceProps) {
  const [copied, setCopied] = useState(false)
  const [currentCode, setCurrentCode] = useState(sourceCode)
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false)
  const [copyFormat, setCopyFormat] = useState<'react' | 'html' | 'vue'>('react')
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const pathname = usePathname() || "/"

  useEffect(() => {
    setCurrentCode(sourceCode)
  }, [sourceCode])

  useEffect(() => {
    if (copyFormat === 'react' || hideFormatSelector) {
      setGeneratedCode(currentCode);
      return;
    }
    
    let isMounted = true;
    setTimeout(() => {
      try {
        let cleanCode = currentCode.replace(/import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?/g, "").trim();
        const isRawSnippet = !cleanCode.includes("function") && !cleanCode.includes("=>") && !cleanCode.includes("class ");
        if (isRawSnippet) cleanCode = `<div className="flex flex-col gap-3">${cleanCode}</div>`;

        const transpiled = transpileJSX(cleanCode);
        const Component = evaluateCode(transpiled, componentsScope);
        
        if (Component && isMounted) {
          const div = document.createElement('div');
          const root = createRoot(div);
          root.render(<Component />);
          
          setTimeout(() => {
            if (isMounted) {
              let html = div.innerHTML;
              html = html.replace(/></g, '>\n  <').replace(/className=/g, 'class=');
              
              const finalOut = copyFormat === 'html' 
                ? `<!-- HTML Markup -->\n<!-- Be sure to include Tailwind CSS -->\n${html}`
                : `<template>\n  ${html.replace(/\n/g, '\n  ')}\n</template>\n\n<script setup>\n</script>`;
                
              setGeneratedCode(finalOut);
            }
            root.unmount();
          }, 20);
        } else if (isMounted) {
          setGeneratedCode(translateReactCodeRegex(currentCode, copyFormat));
        }
      } catch (err) {
        if (isMounted) setGeneratedCode(translateReactCodeRegex(currentCode, copyFormat));
      }
    }, 0);
    
    return () => { isMounted = false; };
  }, [currentCode, copyFormat, hideFormatSelector]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    fetch("/api/telegram-notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "copy",
        componentName: `${fileName} (${copyFormat})`,
        fileName,
        path: pathname,
      }),
    }).catch((err) => console.error("Error sending copy notification:", err))
  }, [currentCode, fileName, pathname, copyFormat])

  return (
    <div className={cn("rounded-xl border border-border/40", isAIPopupOpen ? "overflow-visible" : "overflow-hidden", className)}>
      {/* Mac-style header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f0f12] dark:bg-[#0c0c0e] relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
          </div>
          <span className="text-[11px] text-white/30 font-mono">
            {copyFormat === 'react' ? fileName : fileName.replace(/\.\w+$/, TAB_EXT_MAP[copyFormat] || '.txt')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!hideFormatSelector && (
            <select
              value={copyFormat}
              onChange={(e) => setCopyFormat(e.target.value as any)}
              className="text-[9px] bg-transparent text-white/30 border border-white/10 rounded px-1.5 py-0.5 outline-none hover:text-white/60 transition-colors font-sans"
            >
              <option value="react" className="bg-zinc-950">React</option>
              <option value="html" className="bg-zinc-950">HTML/CSS</option>
              <option value="vue" className="bg-zinc-950">Vue.js</option>
            </select>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer"
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
          <AIAssistant
            currentCode={currentCode}
            onCodeChange={setCurrentCode}
            onReset={() => setCurrentCode(sourceCode)}
            isModified={currentCode !== sourceCode}
            onPopupOpenChange={setIsAIPopupOpen}
          />
        </div>
      </div>
      {/* Dynamic Demo Area when modified */}
      {currentCode !== sourceCode && (
        <div className="p-6 bg-background dark:bg-[#0a0a0c] demo-grid-pattern border-b border-border/40 min-h-[120px] flex items-center justify-center">
          <div className="w-full flex items-center justify-center">
            <DynamicComponentRunner code={currentCode} fallback={<span className="text-xs text-muted-foreground">Original Preview</span>} />
          </div>
        </div>
      )}
      {/* Code content */}
      <div className="overflow-x-auto bg-[#0f0f12] dark:bg-[#0c0c0e] p-4 max-h-[300px]">
        <pre className="text-[13px] leading-relaxed text-white/50 font-mono">
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  )
}

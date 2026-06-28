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

function translateReactCode(code: string, target: 'react' | 'html' | 'vue' | 'svelte' | 'angular' | 'vanilla'): string {
  if (target === 'react') return code;
  
  // Strip imports
  let clean = code.replace(/import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?/g, "").trim();
  
  // Extract JSX return body if present
  const returnMatch = clean.match(/return\s*\(\s*(<[\s\S]*>)\s*\)/);
  let jsx = returnMatch ? returnMatch[1] : clean;
  
  if (!returnMatch) {
    const fnMatch = clean.match(/export\s+default\s+function\s+\w+\(\)\s*\{([\s\S]*)\}/);
    if (fnMatch) jsx = fnMatch[1].trim();
  }

  // Basic translations
  const classTag = target === 'angular' ? 'className' : 'class';
  if (classTag === 'class') {
    jsx = jsx.replace(/className=/g, 'class=');
  }

  // Event handlers mapping
  if (target === 'vue') {
    jsx = jsx.replace(/onClick=\{([^}]+)\}/g, '@click="$1"');
    jsx = jsx.replace(/onChange=\{([^}]+)\}/g, '@change="$1"');
  } else if (target === 'svelte') {
    jsx = jsx.replace(/onClick=\{([^}]+)\}/g, 'on:click={$1}');
    jsx = jsx.replace(/onChange=\{([^}]+)\}/g, 'on:change={$1}');
  } else if (target === 'angular') {
    jsx = jsx.replace(/onClick=\{([^}]+)\}/g, '(click)="$1"');
    jsx = jsx.replace(/onChange=\{([^}]+)\}/g, '(change)="$1"');
  }

  // Tag mapping
  jsx = jsx.replace(/<Button/g, '<button');
  jsx = jsx.replace(/<\/Button>/g, '</button>');
  jsx = jsx.replace(/<Input/g, '<input');
  jsx = jsx.replace(/<\/Input>/g, '</input>');
  jsx = jsx.replace(/<Badge/g, '<span');
  jsx = jsx.replace(/<\/Badge>/g, '</span>');
  jsx = jsx.replace(/<Card/g, '<div');
  jsx = jsx.replace(/<\/Card>/g, '</div>');

  switch (target) {
    case 'html':
      return `<!-- HTML Markup -->\n${jsx}`;
    case 'vue':
      return `<template>\n  ${jsx.replace(/\n/g, '\n  ')}\n</template>\n\n<script setup>\n// Vue 3 Composition API\n</script>`;
    case 'svelte':
      return `<script>\n// Svelte component logic\n</script>\n\n${jsx}`;
    case 'angular':
      return `@Component({\n  selector: 'app-custom-el',\n  template: \`\n    ${jsx.replace(/\n/g, '\n    ')}\n  \`\n})\nexport class CustomElComponent {}`;
    case 'vanilla':
      return `// Vanilla JS Element Creation\nconst container = document.createElement('div');\ncontainer.innerHTML = \`\n  ${jsx.replace(/\n/g, '\n  ')}\n\`;\ndocument.body.appendChild(container);`;
    default:
      return jsx;
  }
}

const TAB_EXT_MAP: Record<string, string> = {
  react: '.tsx',
  html: '.html',
  vue: '.vue',
  svelte: '.svelte',
  angular: '.ts',
  vanilla: '.js',
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
  const isRawJSX = !cleanedCode.includes("function") && 
                   !cleanedCode.includes("=>") && 
                   cleanedCode.includes("React.createElement");
  if (isRawJSX) {
    const expression = cleanedCode.trim().endsWith(";") 
      ? cleanedCode.trim().slice(0, -1) 
      : cleanedCode;
    executionCode = `const DirectJSXComponent = () => { return (${expression}); };`
    targetComponentName = "DirectJSXComponent"
  }

  const fnBody = `
    ${executionCode}
    return typeof ${targetComponentName} !== 'undefined' ? ${targetComponentName} : null;
  `

  const evaluator = new Function(...keys, fnBody)
  return evaluator(...values)
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
      const cleanCode = code
        .replace(/import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?/g, "") // remove imports
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // remove JSX comments: {/* ... */}
        .replace(/\/\*[\s\S]*?\*\//g, "") // remove JS block comments: /* ... */
        .replace(/\/\/.*$/gm, "") // remove single-line comments
        .trim()

      if (!cleanCode) return null

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
  const [copyFormat, setCopyFormat] = useState<'react' | 'html' | 'vue' | 'svelte' | 'angular' | 'vanilla'>('react')
  const pathname = usePathname() || "/"

  useEffect(() => {
    setCurrentCode(code)
  }, [code])

  const handleCopy = useCallback(() => {
    const translated = translateReactCode(currentCode, copyFormat)
    navigator.clipboard.writeText(translated)
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
                <option value="vue" className="bg-zinc-950">Vue</option>
                <option value="svelte" className="bg-zinc-950">Svelte</option>
                <option value="angular" className="bg-zinc-950">Angular</option>
                <option value="vanilla" className="bg-zinc-950">Vanilla JS</option>
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
              <code>{copyFormat === 'react' ? currentCode : translateReactCode(currentCode, copyFormat)}</code>
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
  const [currentCode, setCurrentCode] = useState(sourceCode)
  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false)
  const [copyFormat, setCopyFormat] = useState<'react' | 'html' | 'vue' | 'svelte' | 'angular' | 'vanilla'>('react')
  const pathname = usePathname() || "/"

  useEffect(() => {
    setCurrentCode(sourceCode)
  }, [sourceCode])

  const handleCopy = useCallback(() => {
    const translated = translateReactCode(currentCode, copyFormat)
    navigator.clipboard.writeText(translated)
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
          <select
            value={copyFormat}
            onChange={(e) => setCopyFormat(e.target.value as any)}
            className="text-[9px] bg-transparent text-white/30 border border-white/10 rounded px-1.5 py-0.5 outline-none hover:text-white/60 transition-colors font-sans"
          >
            <option value="react" className="bg-zinc-950">React</option>
            <option value="html" className="bg-zinc-950">HTML/CSS</option>
            <option value="vue" className="bg-zinc-950">Vue</option>
            <option value="svelte" className="bg-zinc-950">Svelte</option>
            <option value="angular" className="bg-zinc-950">Angular</option>
            <option value="vanilla" className="bg-zinc-950">Vanilla JS</option>
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
          <code>{copyFormat === 'react' ? currentCode : translateReactCode(currentCode, copyFormat)}</code>
        </pre>
      </div>
    </div>
  )
}

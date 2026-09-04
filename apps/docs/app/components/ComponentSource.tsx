"use client"

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { usePathname } from "next/navigation"
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "nexoreui"
import { AIAssistant } from "./AIAssistant"
import { trackEvent } from "../../hooks/useAnalytics"
import { copyToClipboard } from "../utils/clipboard"
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
const componentsScope: Record<string, any> = {
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
  scope?: Record<string, any>
}

function DynamicComponentRunner({ code, fallback, scope }: DynamicComponentRunnerProps) {
  const [error, setError] = useState<string | null>(null)

  const Component = useMemo(() => {
    try {
      setError(null)
      let cleanCode = code
        .replace(/import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?/g, "") // remove imports
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // remove JSX comments: {/* ... */}
        .replace(/\/\*[\s\S]*?\*\//g, "") // remove JS block comments: /* ... */
        .replace(/(?<!:)\/\/.*$/gm, "") // remove single-line comments (preserves https:// and http://)
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
      const compiled = evaluateCode(transpiled, { ...componentsScope, ...scope })
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

  const handleCopy = useCallback(async () => {
    const textToCopy = generatedCode || currentCode || "";
    await copyToClipboard(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    trackEvent({
      eventType: "copy_code",
      component: title,
      framework: copyFormat,
    });
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
  scope?: Record<string, any>
}

export function ComponentSource({
  sourceCode,
  fileName = "component.tsx",
  className,
  hideFormatSelector,
  scope,
}: ComponentSourceProps) {
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
        const Component = evaluateCode(transpiled, { ...componentsScope, ...scope });
        
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

  const handleCopy = useCallback(async () => {
    const textToCopy = generatedCode || currentCode || "";
    await copyToClipboard(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    trackEvent({
      eventType: "copy_code",
      component: fileName,
      framework: copyFormat,
    });
  }, [currentCode, fileName, pathname, copyFormat])

function tokenizeCodeLine(line: string): React.ReactNode[] {
  const tokenRegex = /(\/\/(?:(?<!:).*)$|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Z]\w*|<\/?[a-z][a-z0-9-]*|\b(?:import|export|default|function|return|const|let|var|from|as|type|interface|class|extends|async|await|true|false|null|undefined)\b|\b(?:useState|useEffect|useCallback|useMemo|useRef)\b|\b[a-zA-Z_][a-zA-Z0-9_-]*(?==)|\b\d+(?:\.\d+)?\b|[{}()[\],;]|=>|===|!==|==|!=|<=|>=|\/>|>|<)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(line)) !== null) {
    const prevText = line.substring(lastIndex, match.index);
    if (prevText) {
      elements.push(<span key={`text-${lastIndex}`}>{prevText}</span>);
    }

    const token = match[0];
    const key = `tok-${match.index}`;

    if (token.startsWith("//") || token.startsWith("/*")) {
      elements.push(<span key={key} className="text-zinc-400 dark:text-zinc-500 italic">{token}</span>);
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
      elements.push(<span key={key} className="text-emerald-700 dark:text-emerald-300">{token}</span>);
    } else if (/^<\/?[A-Z]/.test(token)) {
      elements.push(<span key={key} className="text-cyan-700 dark:text-cyan-300 font-medium">{token}</span>);
    } else if (/^<\/?[a-z]/.test(token)) {
      elements.push(<span key={key} className="text-sky-700 dark:text-sky-300">{token}</span>);
    } else if (/^(import|export|default|function|return|const|let|var|from|as|type|interface|class|extends|async|await|true|false|null|undefined)$/.test(token)) {
      elements.push(<span key={key} className="text-purple-700 dark:text-purple-300 font-semibold">{token}</span>);
    } else if (/^(useState|useEffect|useCallback|useMemo|useRef)$/.test(token)) {
      elements.push(<span key={key} className="text-violet-700 dark:text-violet-300">{token}</span>);
    } else if (match.index + token.length < line.length && line[match.index + token.length] === "=" && /^[a-zA-Z_]/.test(token)) {
      elements.push(<span key={key} className="text-amber-700 dark:text-amber-200">{token}</span>);
    } else if (/^\d/.test(token)) {
      elements.push(<span key={key} className="text-orange-700 dark:text-orange-300">{token}</span>);
    } else if (token === "=>" || token === "/>" || token === ">" || token === "<") {
      elements.push(<span key={key} className="text-cyan-700 dark:text-cyan-500/80">{token}</span>);
    } else if (/[{}()[\]]/.test(token)) {
      elements.push(<span key={key} className="text-zinc-500 dark:text-zinc-400">{token}</span>);
    } else {
      elements.push(<span key={key} className="text-zinc-800 dark:text-zinc-300">{token}</span>);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  const remaining = line.substring(lastIndex);
  if (remaining) {
    elements.push(<span key={`rem-${lastIndex}`}>{remaining}</span>);
  }

  return elements.length > 0 ? elements : [line || " "];
}

function HighlightedCode({ code }: { code: string }) {
  const lines = useMemo(() => (code || "").trim().split("\n"), [code]);
  return (
    <div className="font-mono text-[12.5px] leading-[1.65] select-text">
      {lines.map((line, idx) => (
        <div key={idx} className="flex hover:bg-zinc-200/50 dark:hover:bg-white/[0.03] px-1.5 py-0.5 rounded transition-colors group">
          <span className="w-8 shrink-0 select-none text-zinc-400 dark:text-zinc-600 text-right pr-4 text-[11px] group-hover:text-zinc-700 dark:group-hover:text-zinc-400 transition-colors">
            {idx + 1}
          </span>
          <span className="flex-1 text-zinc-800 dark:text-zinc-200 whitespace-pre overflow-x-visible">
            {tokenizeCodeLine(line)}
          </span>
        </div>
      ))}
    </div>
  );
}

  return (
    <div className={cn("rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#090a0d] flex flex-col w-full h-auto self-start shadow-xs dark:shadow-xl", isAIPopupOpen ? "overflow-visible" : "overflow-hidden", className)}>
      {/* Mac-style header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-100/90 dark:bg-[#0b0c11] relative border-b border-zinc-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono font-medium">
            {copyFormat === 'react' ? fileName : fileName.replace(/\.\w+$/, TAB_EXT_MAP[copyFormat] || '.txt')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!hideFormatSelector && (
            <select
              value={copyFormat}
              onChange={(e) => setCopyFormat(e.target.value as any)}
              className="text-[10px] bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 rounded px-2 py-0.5 outline-none hover:border-zinc-300 dark:hover:border-white/20 transition-colors font-sans cursor-pointer shadow-2xs"
            >
              <option value="react" className="bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200">React</option>
              <option value="html" className="bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200">HTML/CSS</option>
              <option value="vue" className="bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200">Vue.js</option>
            </select>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors px-2 py-1 rounded-md hover:bg-zinc-200/60 dark:hover:bg-white/5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
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
        <div className="p-6 bg-white dark:bg-[#0a0a0c] demo-grid-pattern border-b border-zinc-200 dark:border-border/40 min-h-[120px] flex items-center justify-center">
          <div className="w-full flex items-center justify-center">
            <DynamicComponentRunner code={currentCode} scope={scope} fallback={<span className="text-xs text-muted-foreground">Original Preview</span>} />
          </div>
        </div>
      )}
      {/* Code content */}
      <div className="overflow-x-auto overflow-y-auto max-h-[440px] bg-zinc-50/70 dark:bg-[#090a0d] p-3 sm:p-4 border-t border-zinc-200/60 dark:border-white/[0.04]">
        <HighlightedCode code={generatedCode} />
      </div>
    </div>
  )
}

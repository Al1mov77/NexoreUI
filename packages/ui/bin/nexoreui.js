#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/commands/add.ts
var fs4 = __toESM(require("fs"));
var path4 = __toESM(require("path"));
var readline = __toESM(require("readline"));
var import_child_process = require("child_process");

// src/utils/detect.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
function detectProject(cwd = process.cwd()) {
  let packageManager = "npm";
  let projectType = "unknown";
  let hasSrcDir = false;
  let currentDir = cwd;
  let baseDir = cwd;
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, "package.json"))) {
      baseDir = currentDir;
      break;
    }
    currentDir = path.dirname(currentDir);
  }
  if (fs.existsSync(path.join(baseDir, "pnpm-lock.yaml"))) {
    packageManager = "pnpm";
  } else if (fs.existsSync(path.join(baseDir, "yarn.lock"))) {
    packageManager = "yarn";
  } else if (fs.existsSync(path.join(baseDir, "bun.lockb")) || fs.existsSync(path.join(baseDir, "bun.lock"))) {
    packageManager = "bun";
  }
  if (fs.existsSync(path.join(baseDir, "src"))) {
    hasSrcDir = true;
  }
  try {
    const packageJsonPath = path.join(baseDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      if (deps["next"]) {
        projectType = "next";
      } else if (deps["vite"] || deps["@tailwindcss/vite"]) {
        projectType = "vite";
      } else if (deps["react-scripts"]) {
        projectType = "cra";
      }
    }
  } catch (err) {
  }
  return {
    packageManager,
    projectType,
    hasSrcDir,
    baseDir
  };
}

// src/utils/copy.ts
var fs2 = __toESM(require("fs"));
var path2 = __toESM(require("path"));
var CN_TEMPLATE = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;
function ensureDir(dirPath) {
  if (!fs2.existsSync(dirPath)) {
    fs2.mkdirSync(dirPath, { recursive: true });
  }
}
function getRelativeImportPath(fromDir, toFile) {
  let relativePath = path2.relative(fromDir, toFile);
  relativePath = relativePath.replace(/\\/g, "/");
  relativePath = relativePath.replace(/\.(ts|tsx|js|jsx)$/, "");
  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }
  return relativePath;
}
function ensureCnUtil(utilsPath) {
  const dir = path2.dirname(utilsPath);
  ensureDir(dir);
  if (!fs2.existsSync(utilsPath)) {
    fs2.writeFileSync(utilsPath, CN_TEMPLATE, "utf8");
    return true;
  }
  return false;
}
function copyComponentFile(content, targetFilePath, utilsFilePath) {
  const targetDir = path2.dirname(targetFilePath);
  ensureDir(targetDir);
  const relativeImport = getRelativeImportPath(targetDir, utilsFilePath);
  const rewrittenContent = content.replace(
    /['"](\.\.\/(?:utils\/)?cn(?:\.js)?|@\/lib\/utils(?:\.js)?|\.\.\/\.\.\/lib\/utils(?:\.js)?)['"]/g,
    `"${relativeImport}"`
  );
  fs2.writeFileSync(targetFilePath, rewrittenContent, "utf8");
}

// src/registry/accordion.ts
var accordion = {
  name: "accordion",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "lucide-react",
    "@radix-ui/react-accordion"
  ],
  fileName: "accordion.tsx",
  content: `"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown, Plus } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"

const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      glass: "backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-2",
      outline: "border border-border/50 rounded-xl p-2",
      neon: "bg-black rounded-xl", // Moved border and shadow to items for dynamic glow
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & VariantProps<typeof accordionVariants>;

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn(accordionVariants({ variant, className }))}
    {...(props as any)}
  />
))
Accordion.displayName = "Accordion"

const accordionItemVariants = cva("border-b transition-all duration-300", {
  variants: {
    variant: {
      default: "border-border/50 data-[state=open]:bg-muted/30 rounded-lg px-2",
      neon: "border-neutral-800 data-[state=open]:border-cyan-400 data-[state=open]:shadow-[0_0_20px_rgba(6,182,212,0.5)] rounded-xl mb-2 overflow-hidden bg-neutral-950/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & VariantProps<typeof accordionItemVariants>;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ variant, className }))}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  iconType?: "chevron" | "plus";
  iconClassName?: string;
  variant?: "default" | "neon";
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, iconType = "chevron", iconClassName, variant = "default", ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:text-primary [&[data-state=open]>svg.chevron]:rotate-180 [&[data-state=open]>svg.plus]:rotate-45",
        variant === "neon" && "text-white px-4 data-[state=open]:text-cyan-400",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">{children}</span>
      {iconType === "chevron" ? (
        <ChevronDown className={cn("chevron h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out text-muted-foreground", iconClassName)} />
      ) : (
        <Plus className={cn("plus h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out text-muted-foreground", iconClassName)} />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-1 px-1 text-muted-foreground leading-relaxed", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
`
};

// src/registry/ai-prompt-input.ts
var aiPromptInput = {
  name: "ai-prompt-input",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "ai-prompt-input.tsx",
  content: `'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Send,
  Square,
  Mic,
  Paperclip,
  Globe,
  Sparkles,
  Bot,
  ChevronDown,
  X,
  FileText,
  Image as ImageIcon,
  Cpu,
} from 'lucide-react';
import { cn } from '../utils/cn';

const sizeMap = {
  sm: {
    outerRadius: 'rounded-xl',
    innerRadius: 'rounded-[calc(0.75rem-2px)]',
    padding: 'p-2.5 gap-2',
    text: 'text-xs',
    rx: 12,
  },
  md: {
    outerRadius: 'rounded-2xl',
    innerRadius: 'rounded-[calc(1rem-2px)]',
    padding: 'p-3.5 gap-2.5',
    text: 'text-sm',
    rx: 16,
  },
  lg: {
    outerRadius: 'rounded-3xl',
    innerRadius: 'rounded-[calc(1.5rem-2px)]',
    padding: 'p-4 gap-3',
    text: 'text-base',
    rx: 24,
  },
};

export interface AIModelOption {
  id: string;
  name: string;
  badge?: string;
  icon?: React.ElementType;
}

export interface AttachedFile {
  id: string;
  name: string;
  size?: string;
  type?: 'image' | 'file' | 'code';
}

export interface AiPromptInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSubmit'> {
  /**
   * Visual theme variant
   * @default "default"
   */
  variant?: 'default' | 'glow' | 'aurora' | 'glass' | 'minimal';
  /**
   * Dimension scale
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Text prompt value (controlled)
   */
  value?: string;
  /**
   * Default text prompt value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Callback fired when text changes
   */
  onChange?: (value: string) => void;
  /**
   * Callback fired when prompt is submitted (via button or Enter key)
   */
  onSubmit?: (prompt: string, options?: { model?: string; webSearch?: boolean; files?: AttachedFile[] }) => void;
  /**
   * Textarea placeholder text
   * @default "Ask anything or describe what you want to build..."
   */
  placeholder?: string;
  /**
   * Whether the AI is currently generating a response (switches Send to Stop button)
   * @default false
   */
  isLoading?: boolean;
  /**
   * Callback fired when user clicks stop generation
   */
  onStop?: () => void;
  /**
   * List of available models in the selector dropdown
   */
  models?: AIModelOption[];
  /**
   * Currently active model ID
   */
  selectedModel?: string;
  /**
   * Callback when active model is changed
   */
  onModelChange?: (modelId: string) => void;
  /**
   * Attached files list preview
   */
  files?: AttachedFile[];
  /**
   * Callback when a file is removed
   */
  onRemoveFile?: (fileId: string) => void;
  /**
   * Callback when user clicks the attach file button
   */
  onAttachClick?: () => void;
  /**
   * Whether voice listening is active
   * @default false
   */
  isListening?: boolean;
  /**
   * Callback when microphone button is clicked
   */
  onVoiceToggle?: () => void;
  /**
   * Whether web search enhancement is enabled
   * @default false
   */
  webSearchEnabled?: boolean;
  /**
   * Callback when web search toggle is clicked
   */
  onWebSearchToggle?: () => void;
  /**
   * Whether Deep Reasoning mode is enabled
   * @default false
   */
  reasoningEnabled?: boolean;
  /**
   * Callback when Deep Reasoning mode toggle is clicked
   */
  onReasoningToggle?: () => void;
  /**
   * Disables all interactive inputs
   * @default false
   */
  disabled?: boolean;
}

const defaultModels: AIModelOption[] = [
  { id: 'claude-3-7', name: 'Claude 3.7 Sonnet', badge: 'Hybrid', icon: Sparkles },
  { id: 'gpt-4o', name: 'GPT-4o', badge: 'Fast', icon: Bot },
  { id: 'gemini-2-flash', name: 'Gemini 2.0 Flash', badge: 'Multimodal', icon: Cpu },
  { id: 'deepseek-r1', name: 'DeepSeek R1', badge: 'Reasoning', icon: Globe },
];

/**
 * AiPromptInput Component
 *
 * An ultra-premium input bar for conversational and agentic AI interfaces.
 * Supports auto-expanding textarea, model selector, attachments, voice pulse,
 * web search / reasoning toggles, and SVG perimeter-traveling Aurora waves.
 */
export const AiPromptInput = React.forwardRef<HTMLDivElement, AiPromptInputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      value: controlledValue,
      defaultValue = '',
      onChange,
      onSubmit,
      placeholder = 'Ask anything or describe what you want to build...',
      isLoading = false,
      onStop,
      models = defaultModels,
      selectedModel: controlledModel,
      onModelChange,
      files: controlledFiles,
      onRemoveFile,
      onAttachClick,
      isListening: controlledListening,
      onVoiceToggle,
      webSearchEnabled: controlledWebSearch,
      onWebSearchToggle,
      reasoningEnabled: controlledReasoning,
      onReasoningToggle,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [internalModel, setInternalModel] = React.useState(models[0]?.id || 'claude-3-7');
    const [isModelDropdownOpen, setIsModelDropdownOpen] = React.useState(false);
    const [internalListening, setInternalListening] = React.useState(false);
    const [internalWebSearch, setInternalWebSearch] = React.useState(false);
    const [internalReasoning, setInternalReasoning] = React.useState(false);
    const [internalFiles, setInternalFiles] = React.useState<AttachedFile[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const shouldReduceMotion = useReducedMotion();
    const id = React.useId().replace(/:/g, '');

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const currentModelId = controlledModel !== undefined ? controlledModel : internalModel;
    const currentModel = models.find((m) => m.id === currentModelId) || models[0];

    const isListening = controlledListening !== undefined ? controlledListening : internalListening;
    const webSearch = controlledWebSearch !== undefined ? controlledWebSearch : internalWebSearch;
    const reasoning = controlledReasoning !== undefined ? controlledReasoning : internalReasoning;
    const files = controlledFiles !== undefined ? controlledFiles : internalFiles;

    const activeSize = sizeMap[size] || sizeMap.md;

    // Auto-resize textarea height
    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = \`\${Math.min(textareaRef.current.scrollHeight, 180)}px\`;
      }
    }, [value]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleSubmit = () => {
      if (isLoading) {
        onStop?.();
        return;
      }
      if (!value.trim() && files.length === 0) return;
      onSubmit?.(value, {
        model: currentModelId,
        webSearch,
        files,
      });
      if (!isControlled) setInternalValue('');
    };

    const handleVoiceClick = () => {
      if (onVoiceToggle) onVoiceToggle();
      else setInternalListening(!internalListening);
    };

    const handleWebSearchClick = () => {
      if (onWebSearchToggle) onWebSearchToggle();
      else setInternalWebSearch(!internalWebSearch);
    };

    const handleReasoningClick = () => {
      if (onReasoningToggle) onReasoningToggle();
      else setInternalReasoning(!internalReasoning);
    };

    const handleAttachClick = () => {
      if (onAttachClick) {
        onAttachClick();
      } else if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (selected && selected.length > 0) {
        const newFiles: AttachedFile[] = Array.from(selected).map((f, i) => ({
          id: \`\${Date.now()}-\${i}\`,
          name: f.name,
          size: \`\${(f.size / (1024 * 1024)).toFixed(1)} MB\`,
          type: f.type.startsWith('image/') ? 'image' : 'file',
        }));
        setInternalFiles((prev) => [...prev, ...newFiles]);
      }
    };

    const handleRemoveFileInternal = (id: string) => {
      if (onRemoveFile) onRemoveFile(id);
      else setInternalFiles((prev) => prev.filter((f) => f.id !== id));
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative isolate w-full transition-all duration-300 select-none group',
          activeSize.outerRadius,
          className
        )}
        {...props}
      >
        {/* Hidden file input for uncontrolled attach */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelected}
        />

        {/* \u2500\u2500\u2500 Aurora Variant: SVG Traveling Border Waves \u2500\u2500\u2500 */}
        {variant === 'aurora' && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={\`ai-aurora-grad1-\${id}\`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="25%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="75%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id={\`ai-aurora-grad2-\${id}\`} x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="35%" stopColor="#6366f1" />
                <stop offset="70%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <filter id={\`ai-aurora-glow-\${id}\`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base border line (Always visible) */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={activeSize.rx}
              fill="none"
              className="stroke-zinc-200 dark:stroke-white/10"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Ambient traveling snake wave glow */}
            {!shouldReduceMotion && (
              <motion.rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx={activeSize.rx}
                fill="none"
                pathLength={100}
                stroke={\`url(#ai-aurora-grad1-\${id})\`}
                strokeWidth="5"
                strokeDasharray="26 74"
                strokeLinecap="round"
                filter={\`url(#ai-aurora-glow-\${id})\`}
                opacity="0.65"
                vectorEffect="non-scaling-stroke"
                animate={{
                  strokeDashoffset: [0, -100],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Single traveling aurora snake */}
            {!shouldReduceMotion ? (
              <motion.rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx={activeSize.rx}
                fill="none"
                pathLength={100}
                stroke={\`url(#ai-aurora-grad1-\${id})\`}
                strokeWidth="2.5"
                strokeDasharray="26 74"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                animate={{
                  strokeDashoffset: [0, -100],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx={activeSize.rx}
                fill="none"
                stroke={\`url(#ai-aurora-grad1-\${id})\`}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
        )}

        {/* \u2500\u2500\u2500 Inner Prompt Input Container Surface \u2500\u2500\u2500 */}
        <div
          className={cn(
            'relative z-10 flex flex-col w-full transition-all duration-300',
            activeSize.padding,
            activeSize.text,
            activeSize.outerRadius,
            variant === 'aurora' &&
              'bg-white dark:bg-[#0c0d14] text-zinc-900 dark:text-zinc-100 shadow-xl',
            variant === 'default' &&
              'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-lg shadow-zinc-950/5 dark:shadow-black/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20',
            variant === 'glow' &&
              'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-[0_0_20px_rgba(99,60,220,0.18)] focus-within:border-primary focus-within:shadow-[0_0_25px_rgba(99,60,220,0.35)]',
            variant === 'glass' &&
              'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl focus-within:border-primary/50',
            variant === 'minimal' &&
              'bg-zinc-100/80 dark:bg-zinc-900/80 border border-transparent focus-within:bg-white dark:focus-within:bg-zinc-950 focus-within:border-zinc-300 dark:focus-within:border-zinc-700'
          )}
        >
          {/* \u2500\u2500\u2500 Attached Files Pill Drawer \u2500\u2500\u2500 */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-0.5 pb-1">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/80 shadow-sm"
                  >
                    {file.type === 'image' ? (
                      <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-primary" />
                    )}
                    <span className="max-w-[140px] truncate font-medium">{file.name}</span>
                    {file.size && <span className="text-[10px] text-zinc-400">({file.size})</span>}
                    <button
                      type="button"
                      onClick={() => handleRemoveFileInternal(file.id)}
                      className="ml-1 p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* \u2500\u2500\u2500 Main Textarea \u2500\u2500\u2500 */}
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening to your voice...' : placeholder}
              disabled={disabled}
              className="w-full bg-transparent resize-none border-0 p-0 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-0 leading-relaxed max-h-[180px] overflow-y-auto"
            />
          </div>

          {/* \u2500\u2500\u2500 Bottom Actions Toolbar \u2500\u2500\u2500 */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-white/5">
            {/* Left Controls: Model dropdown, Search, Reasoning */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Model Selector Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  disabled={disabled}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-white/10 transition-colors cursor-pointer"
                >
                  {currentModel?.icon ? (
                    <currentModel.icon className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  )}
                  <span>{currentModel?.name || 'Model'}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Model Dropdown Menu */}
                {isModelDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-56 p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Select AI Model
                    </div>
                    {models.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          if (onModelChange) onModelChange(model.id);
                          else setInternalModel(model.id);
                          setIsModelDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left',
                          currentModelId === model.id
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {model.icon ? (
                            <model.icon className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                          )}
                          <span>{model.name}</span>
                        </div>
                        {model.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                            {model.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Web Search Toggle Pill */}
              <button
                type="button"
                onClick={handleWebSearchClick}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  webSearch
                    ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Deep Reasoning Mode Toggle Pill */}
              <button
                type="button"
                onClick={handleReasoningClick}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer',
                  reasoning
                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Deep Think</span>
              </button>
            </div>

            {/* Right Controls: Attach, Voice, Submit/Stop */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Attach File Button */}
              <button
                type="button"
                onClick={handleAttachClick}
                disabled={disabled}
                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                title="Attach files or media"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice Input Button */}
              <button
                type="button"
                onClick={handleVoiceClick}
                disabled={disabled}
                className={cn(
                  'p-2 rounded-xl transition-all cursor-pointer relative',
                  isListening
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                )}
                title={isListening ? 'Stop listening' : 'Speak to AI'}
              >
                {isListening && !shouldReduceMotion && (
                  <span className="absolute inset-0 rounded-xl bg-red-500 animate-ping opacity-50" />
                )}
                <Mic className="w-4 h-4 relative z-10" />
              </button>

              {/* Submit / Stop Morphing Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={disabled || (!isLoading && !value.trim() && files.length === 0)}
                className={cn(
                  'inline-flex items-center justify-center p-2 rounded-xl text-white font-semibold transition-all duration-200 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed',
                  isLoading
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-zinc-950/20'
                    : 'bg-primary hover:bg-primary/90 active:scale-95 shadow-primary/25'
                )}
                title={isLoading ? 'Stop generation' : 'Send prompt (Enter)'}
              >
                {isLoading ? (
                  <Square className="w-4 h-4 fill-current" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AiPromptInput.displayName = 'AiPromptInput';
`
};

// src/registry/alert.ts
var alert = {
  name: "alert",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "alert.tsx",
  content: `"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"
import { motion } from "framer-motion"
import { AlertCircle, Info, CheckCircle2, XCircle, Cookie, WifiOff, AlertTriangle, X } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 transition-all duration-300 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-background/50 border-border text-foreground",
        destructive: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
        glass: "backdrop-blur-md bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5 text-foreground",
        floating: "fixed bottom-5 right-5 z-50 max-w-sm bg-card/95 backdrop-blur-md border border-border/80 text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.25)] animate-slide-up",
        minimal: "border-0 bg-muted/40 p-3 text-sm rounded-xl text-foreground hover:bg-muted/60 shadow-none [&>svg]:top-3.5",
        neon: "border-purple-500/50 bg-purple-500/10 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)] [&>svg]:text-purple-400",
        cyberpunk: "border-l-4 border-yellow-400 bg-black text-yellow-400 shadow-[4px_4px_0_0_rgba(250,204,21,1)] rounded-none font-mono uppercase [&>svg]:text-yellow-400",
        gradient: "bg-linear-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-foreground [&>svg]:text-blue-500",
        banner: "w-full bg-indigo-600 text-white border-0 shadow-md rounded-none sm:rounded-xl [&>svg]:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertVariants> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F animate
   * @default undefined
   */
  animate?: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F title
   * @default undefined
   */
  title?: React.ReactNode;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F description
   * @default undefined
   */
  description?: React.ReactNode;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F icon
   * @default undefined
   */
  icon?: React.ReactNode;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F dismissible
   * @default undefined
   */
  dismissible?: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F onDismiss
   * @default undefined
   */
  onDismiss?: () => void;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F actionText
   * @default undefined
   */
  actionText?: string;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F onAction
   * @default undefined
   */
  onAction?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant,
      animate = true,
      title,
      description,
      icon,
      dismissible = false,
      onDismiss,
      actionText,
      onAction,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(true);

    if (!isOpen) return null;

    const isMinimal = variant === "minimal";
    const isBanner = variant === "banner";

    const defaultIcon = icon || (
      variant === "destructive" ? <XCircle className="h-4 w-4" /> :
      variant === "success" ? <CheckCircle2 className="h-4 w-4" /> :
      variant === "warning" ? <AlertTriangle className="h-4 w-4" /> :
      variant === "info" ? <Info className="h-4 w-4" /> :
      variant === "default" ? <AlertCircle className="h-4 w-4" /> :
      null
    );

    const content = (
      <>
        {defaultIcon && <div className={cn("absolute left-4", isMinimal ? "top-3" : "top-4")}>{defaultIcon}</div>}
        <div className={cn(defaultIcon ? "pl-7" : "", "pr-8")}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
          {!title && !description && children}
        </div>
        {isBanner && actionText && (
          <button
            onClick={onAction}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
          >
            {actionText}
          </button>
        )}
        {dismissible && (
          <button
            onClick={() => {
              setIsOpen(false);
              onDismiss?.();
            }}
            className="absolute right-4 top-4 opacity-50 hover:opacity-100 transition-opacity p-0.5 rounded-md hover:bg-muted"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </>
    );

    const alertClass = cn(alertVariants({ variant }), className);

    if (animate) {
      return (
        <motion.div
          ref={ref}
          role="alert"
          initial={{ opacity: 0, y: variant === "floating" ? 30 : 15, scale: variant === "floating" ? 0.95 : 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: variant === "floating" ? 20 : 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 24 }}
          className={alertClass}
          {...(props as any)}
        >
          {content}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={alertClass}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        {content}
      </div>
    );
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight text-base text-foreground", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed mt-1 opacity-90 [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

// ----------------------------------------------------
// Merged subcomponents and wrappers
// ----------------------------------------------------

// 1. ToastAlertWrapper
export const ToastAlertWrapper = ({ children, className, title, description, time }: any) => (
  <div className={cn("max-w-sm w-full bg-background border border-border/80 shadow-xl rounded-2xl p-4 flex gap-4 items-start relative", className)}>
    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
    <div className="flex-1">
      {title && <h4 className="font-semibold text-sm">{title}</h4>}
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      {children}
    </div>
    {time && <span className="text-xs text-muted-foreground/60">{time}</span>}
  </div>
)

// 2. CookieAlert
export const CookieAlert = ({ onAccept, onDecline }: { onAccept?: () => void; onDecline?: () => void }) => {
  const [visible, setVisible] = React.useState(true)
  if (!visible) return null
  return (
    <div className="max-w-md bg-card border rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Cookie className="h-6 w-6 text-orange-500 animate-bounce" />
        <h4 className="font-bold text-lg">Cookie Preferences</h4>
      </div>
      <p className="text-sm text-muted-foreground">
        We use cookies to improve your experience. By continuing to visit this site you agree to our use of cookies.
      </p>
      <div className="flex gap-3 pt-2">
        <button 
          onClick={() => { setVisible(false); onAccept?.(); }}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 transition-colors rounded-xl text-sm font-semibold shadow-md shadow-primary/10"
        >
          Accept All
        </button>
        <button 
          onClick={() => { setVisible(false); onDecline?.(); }}
          className="flex-1 px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  )
}

// 3. OfflineBanner
export const OfflineBanner = () => (
  <div className="w-full bg-red-600 text-white p-3.5 flex justify-center items-center gap-2 text-sm font-semibold shadow-md sm:rounded-xl">
    <WifiOff className="w-4 h-4 animate-pulse" /> You are currently offline. Some features may be unavailable.
  </div>
)

// 4. RateLimitAlert
export const RateLimitAlert = () => (
  <div className="border border-orange-500/30 bg-orange-500/10 p-5 rounded-2xl flex gap-3 items-start max-w-md shadow-sm">
    <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 animate-pulse" />
    <div className="flex-1">
      <h4 className="font-bold text-orange-600 dark:text-orange-400">Rate Limit Exceeded</h4>
      <p className="text-sm text-orange-600/80 dark:text-orange-400/80 mt-1 mb-4">
        You have made too many requests. Please wait 45 seconds before trying again.
      </p>
      <div className="w-full h-1.5 bg-orange-500/20 rounded-full overflow-hidden">
        <motion.div animate={{ width: ["100%", "0%"] }} transition={{ duration: 45, ease: "linear" }} className="h-full bg-orange-500" />
      </div>
    </div>
  </div>
)

// Re-export original/merged components
export { Alert, AlertTitle, AlertDescription }
/**
 * @deprecated Use the unified \`<Alert variant="cyberpunk">\` instead.
 */
export const CyberAlert = ({ title, description, variant = "default", ...props }: any) => (
  <Alert variant="cyberpunk" title={title} description={description} {...props} />
)

/**
 * @deprecated Use \`<Alert variant="success">\` or \`<Alert variant="info">\` instead.
 */
export const SoftAlert = ({ title, description, variant = "default", ...props }: any) => (
  <Alert variant={variant === "success" ? "success" : "info"} title={title} description={description} {...props} />
)

/**
 * @deprecated Use \`<Alert variant="minimal">\` instead.
 */
export const MinimalAlert = ({ title, description, variant = "default", ...props }: any) => (
  <Alert variant="minimal" title={title} description={description} {...props} />
)

/**
 * @deprecated Use \`<Alert className="border-l-4 ...">\` instead.
 */
export const LeftBorderAlert = ({ title, description, variant = "default", ...props }: any) => (
  <Alert variant={variant === "warning" ? "warning" : "default"} className="border-l-4 border-l-primary" title={title} description={description} {...props} />
)

/**
 * @deprecated Use custom styled layouts or standard elements instead.
 */
export const IconTopAlert = ({ title, description, variant = "default", ...props }: any) => (
  <div className="flex flex-col items-center text-center p-6 bg-card border rounded-2xl" {...props}>
    <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
      <AlertCircle className="h-6 w-6" />
    </div>
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
)

/**
 * @deprecated Use standard tailwind background colors on unified \`<Alert>\` instead.
 */
export const SolidAlert = ({ title, description, variant = "default", ...props }: any) => {
  const bgClasses: Record<string, string> = {
    error: "bg-red-600 text-white border-0",
    success: "bg-emerald-600 text-white border-0",
    warning: "bg-amber-500 text-black border-0",
    default: "bg-primary text-primary-foreground border-0",
  }
  const bgClass = bgClasses[variant] || bgClasses.default
  return (
    <div className={cn("p-4 rounded-xl shadow-lg flex gap-3 items-start", bgClass)} {...props}>
      <Info className="h-5 w-5 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm opacity-90 mt-1">{description}</p>
      </div>
    </div>
  )
}

/**
 * @deprecated Use \`<Alert variant="banner">\` instead.
 */
export const BannerAlert = ({ message, variant = "default", ...props }: any) => (
  <Alert variant="banner" title={message} {...props} />
)

/**
 * @deprecated Use \`<Alert variant="neon">\` instead.
 */
export const NeonAlert = ({ title, description, variant = "default", ...props }: any) => (
  <Alert variant="neon" title={title} description={description} {...props} />
)

/**
 * @deprecated Use \`<Alert variant="glass">\` instead.
 */
export const GlassAlert = ({ title, description, variant = "default", ...props }: any) => (
  <Alert variant="glass" title={title} description={description} {...props} />
)

/**
 * @deprecated Use \`<Alert dismissible={true}>\` instead.
 */
export const DismissibleAlert = ({ variant = "default", title, description, ...props }: any) => (
  <Alert variant={variant} title={title || "Attention"} description={description || "Action required"} dismissible={true} {...props} />
)

`
};

// src/registry/aurora-border-card.ts
var auroraBorderCard = {
  name: "aurora-border-card",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "aurora-border-card.tsx",
  content: `'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

export type AuroraVariant = 'aurora' | 'ocean' | 'sunset' | 'forest' | 'cyber' | 'gold' | 'mono';
export type AuroraSpeed = 'slow' | 'normal' | 'fast';
export type AuroraGlow = 'subtle' | 'medium' | 'strong' | 'none';
export type AuroraRadius = 'sm' | 'md' | 'lg' | 'xl';
export type AuroraAnimation = 'flow' | 'wave' | 'pulse';

const radiusMap: Record<AuroraRadius, { outer: string; inner: string; rx: number }> = {
  sm: { outer: 'rounded-xl', inner: 'rounded-[calc(0.75rem-2px)]', rx: 12 },
  md: { outer: 'rounded-2xl', inner: 'rounded-[calc(1rem-2px)]', rx: 16 },
  lg: { outer: 'rounded-3xl', inner: 'rounded-[calc(1.5rem-2px)]', rx: 24 },
  xl: { outer: 'rounded-[2rem]', inner: 'rounded-[calc(2rem-3px)]', rx: 32 },
};

const speedDurations: Record<AuroraSpeed, number> = {
  slow: 7.5,
  normal: 4.5,
  fast: 2.5,
};

const variantColorStops: Record<AuroraVariant, { s1: string; s2: string; s3: string; s4: string }> = {
  aurora: { s1: '#a855f7', s2: '#ec4899', s3: '#3b82f6', s4: '#06b6d4' },
  ocean: { s1: '#0284c7', s2: '#06b6d4', s3: '#38bdf8', s4: '#10b981' },
  sunset: { s1: '#ff5722', s2: '#f97316', s3: '#ec4899', s4: '#8b5cf6' },
  forest: { s1: '#059669', s2: '#10b981', s3: '#84cc16', s4: '#4ade80' },
  cyber: { s1: '#f43f5e', s2: '#ec4899', s3: '#a855f7', s4: '#06b6d4' },
  gold: { s1: '#d97706', s2: '#f59e0b', s3: '#f97316', s4: '#fbbf24' },
  mono: { s1: '#ffffff', s2: '#d4d4d8', s3: '#71717a', s4: '#ffffff' },
};

const subtitleGradients: Record<AuroraVariant, string> = {
  aurora: 'from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-300 dark:to-cyan-400',
  ocean: 'from-blue-600 via-cyan-600 to-teal-500 dark:from-blue-400 dark:via-cyan-300 dark:to-teal-300',
  sunset: 'from-orange-600 via-pink-600 to-purple-600 dark:from-orange-400 dark:via-pink-400 dark:to-purple-300',
  forest: 'from-emerald-600 via-green-600 to-lime-600 dark:from-emerald-400 dark:via-green-300 dark:to-lime-300',
  cyber: 'from-pink-600 via-purple-600 to-cyan-600 dark:from-pink-400 dark:via-purple-300 dark:to-cyan-300',
  gold: 'from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-300 dark:to-rose-400',
  mono: 'from-zinc-900 via-zinc-700 to-zinc-950 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-400',
};

export interface AuroraBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AuroraVariant;
  speed?: AuroraSpeed;
  glow?: AuroraGlow;
  borderWidth?: 1 | 2 | 3 | number;
  radius?: AuroraRadius;
  animation?: AuroraAnimation;
  title?: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
}

/**
 * AuroraBorderCard Component
 *
 * Displays a permanent visible border with a single, continuous traveling Aurora snake wave.
 * Crisp and luminous on both Light and Dark themes.
 */
export const AuroraBorderCard = React.forwardRef<HTMLDivElement, AuroraBorderCardProps>(
  (
    {
      variant = 'aurora',
      speed = 'fast',
      glow = 'medium',
      borderWidth = 1,
      radius = 'xl',
      animation = 'flow',
      title = 'Beautiful Components',
      subtitle = 'For Modern Builders',
      description = 'Build stunning interfaces with premium animated components.',
      badgeText = 'NexoreUI',
      buttonText = 'Get Started',
      buttonHref,
      onButtonClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const duration = speedDurations[speed] || 2.5;
    const radiusConfig = radiusMap[radius] || radiusMap.xl;
    const colors = variantColorStops[variant] || variantColorStops.aurora;
    const id = React.useId().replace(/:/g, '');

    const glowOpacity = glow === 'none' ? 0 : glow === 'subtle' ? 0.35 : glow === 'medium' ? 0.65 : 0.9;

    return (
      <div
        ref={ref}
        className={cn(
          'relative isolate select-none group transition-all duration-300',
          radiusConfig.outer,
          className
        )}
        {...props}
      >
        {/* \u2500\u2500\u2500 SVG Single Traveling Snake Wave System \u2500\u2500\u2500 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dynamic Multi-Stop Gradient for the Snake */}
            <linearGradient id={\`snake-grad-\${id}\`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.s1} />
              <stop offset="35%" stopColor={colors.s2} />
              <stop offset="70%" stopColor={colors.s3} />
              <stop offset="100%" stopColor={colors.s4} />
            </linearGradient>

            {/* Glowing Aura Filter */}
            <filter id={\`snake-glow-\${id}\`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* \u2500\u2500\u2500 1. Permanent Static Base Border (Always Visible in Light & Dark) \u2500\u2500\u2500 */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx={radiusConfig.rx}
            fill="none"
            className="stroke-zinc-300/90 dark:stroke-white/15"
            strokeWidth={borderWidth}
            vectorEffect="non-scaling-stroke"
          />

          {/* \u2500\u2500\u2500 2. Single Traveling Snake Glow (Moves with the snake head) \u2500\u2500\u2500 */}
          {!shouldReduceMotion && glow !== 'none' && (
            <motion.rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={radiusConfig.rx}
              fill="none"
              pathLength={100}
              stroke={\`url(#snake-grad-\${id})\`}
              strokeWidth={Math.max(borderWidth * 2.5, 3)}
              strokeDasharray="26 74"
              strokeLinecap="round"
              filter={\`url(#snake-glow-\${id})\`}
              vectorEffect="non-scaling-stroke"
              opacity={glowOpacity}
              animate={{
                strokeDashoffset: [0, -100],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}

          {/* \u2500\u2500\u2500 3. Single Traveling Aurora Snake (Main Wave Head & Body) \u2500\u2500\u2500 */}
          {!shouldReduceMotion ? (
            <motion.rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={radiusConfig.rx}
              fill="none"
              pathLength={100}
              stroke={\`url(#snake-grad-\${id})\`}
              strokeWidth={Math.max(borderWidth * 1.5, 2)}
              strokeDasharray="26 74"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              animate={{
                strokeDashoffset: [0, -100],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ) : (
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={radiusConfig.rx}
              fill="none"
              stroke={\`url(#snake-grad-\${id})\`}
              strokeWidth={borderWidth}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* \u2500\u2500\u2500 Inner Card Surface \u2500\u2500\u2500 */}
        <div
          className={cn(
            'relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-8 transition-colors duration-200',
            // Light Theme: Crisp pure white surface with dark text
            'bg-white text-zinc-900 shadow-xl shadow-zinc-950/5 border border-zinc-200/70',
            // Dark Theme: Deep sleek obsidian with white text
            'dark:bg-[#0c0d14] dark:text-zinc-100 dark:shadow-2xl dark:shadow-black/70 dark:border-white/5',
            radiusConfig.inner
          )}
        >
          {children ? (
            children
          ) : (
            <div className="flex flex-col h-full justify-between gap-6">
              {/* Top Header / Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-white/[0.06] dark:text-zinc-200 dark:border-white/10 backdrop-blur-md shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>{badgeText}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  {title}
                </h3>
                <h4
                  className={cn(
                    'text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r',
                    subtitleGradients[variant] || subtitleGradients.aurora
                  )}
                >
                  {subtitle}
                </h4>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed pt-1 max-w-md">
                  {description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {buttonHref ? (
                  <a
                    href={buttonHref}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/25 cursor-pointer"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onButtonClick}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/25 cursor-pointer"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

AuroraBorderCard.displayName = 'AuroraBorderCard';
`
};

// src/registry/aurora-border-fx.ts
var auroraBorderFx = {
  name: "aurora-border-fx",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "aurora-border-fx.tsx",
  content: `'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

export type AuroraFXColor = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber' | string;
export type AuroraFXGlow = 'none' | 'subtle' | 'medium' | 'strong';
export type AuroraFXRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface AuroraColorOption {
  name: string;
  hex: string;
}

export const defaultAuroraColors: AuroraColorOption[] = [
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
];

const colorPresetMap: Record<string, string> = {
  violet: '#8b5cf6',
  cyan: '#06b6d4',
  emerald: '#10b981',
  rose: '#f43f5e',
  amber: '#f59e0b',
};

const radiusMap: Record<AuroraFXRadius, { outer: string; inner: string }> = {
  sm: { outer: 'rounded-lg', inner: 'rounded-[calc(0.5rem-1px)]' },
  md: { outer: 'rounded-xl', inner: 'rounded-[calc(0.75rem-1px)]' },
  lg: { outer: 'rounded-2xl', inner: 'rounded-[calc(1rem-1px)]' },
  xl: { outer: 'rounded-3xl', inner: 'rounded-[calc(1.5rem-1.5px)]' },
  full: { outer: 'rounded-full', inner: 'rounded-full' },
};

const glowOpacityMap: Record<AuroraFXGlow, number> = {
  none: 0,
  subtle: 0.25,
  medium: 0.45,
  strong: 0.75,
};

export interface AuroraBorderFXProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Color preset ('violet', 'cyan', 'emerald', 'rose', 'amber') or any valid CSS hex/rgb color */
  color?: AuroraFXColor;
  /** Ambient dynamic glow intensity */
  glow?: AuroraFXGlow;
  /** Corner radius preset */
  radius?: AuroraFXRadius;
  /** Badge text displayed at the top */
  badgeText?: string;
  /** Icon displayed next to badge text */
  badgeIcon?: React.ReactNode;
  /** Card title */
  title?: string;
  /** Card description */
  description?: string;
  /** Whether to show the interactive color switcher */
  showColorPicker?: boolean;
  /** Custom color options for the color switcher */
  colors?: AuroraColorOption[];
  /** Controlled active color */
  activeColor?: string;
  /** Callback fired when color changes in color picker */
  onColorChange?: (colorHex: string) => void;
  /** Preview slot inside card body */
  previewSlot?: React.ReactNode;
  /** Footer slot at the bottom of the card */
  footerSlot?: React.ReactNode;
  /** Custom children \u2014 replaces standard card body if provided */
  children?: React.ReactNode;
}

/**
 * AuroraBorderFX Component
 *
 * State-of-the-art interactive card with reactive Aurora glow,
 * dynamic gradient border tracking, ambient atmospheric blur,
 * and built-in interactive color switcher.
 */
export const AuroraBorderFX = React.forwardRef<HTMLDivElement, AuroraBorderFXProps>(
  (
    {
      color = 'violet',
      glow = 'medium',
      radius = 'lg',
      badgeText = 'Aurora Border FX',
      badgeIcon = <Sparkles className="w-3 h-3" />,
      title = 'Reactive Aurora Borders',
      description = 'Smooth multi-color conic gradients that dynamically track and react with zero JavaScript canvas lag.',
      showColorPicker = true,
      colors = defaultAuroraColors,
      activeColor: controlledColor,
      onColorChange,
      previewSlot,
      footerSlot,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedInitialColor = colorPresetMap[color] || color || '#8b5cf6';
    const [internalColor, setInternalColor] = React.useState<string>(resolvedInitialColor);

    React.useEffect(() => {
      if (colorPresetMap[color]) {
        setInternalColor(colorPresetMap[color]);
      } else if (color) {
        setInternalColor(color);
      }
    }, [color]);

    const currentColor = controlledColor !== undefined ? controlledColor : internalColor;
    const radiusConfig = radiusMap[radius] || radiusMap.lg;
    const glowOpacity = glowOpacityMap[glow] ?? 0.45;

    const handleSelectColor = (hex: string) => {
      if (controlledColor === undefined) {
        setInternalColor(hex);
      }
      onColorChange?.(hex);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative isolate p-5 sm:p-6 overflow-hidden flex flex-col justify-between group transition-all duration-300',
          'border border-border/80 bg-card/60 backdrop-blur-xl shadow-xl',
          radiusConfig.outer,
          className
        )}
        {...props}
      >
        {/* Ambient Dynamic Background Glow */}
        {glow !== 'none' && (
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[85px] pointer-events-none transition-colors duration-500 -z-10"
            style={{
              backgroundColor: currentColor,
              opacity: glowOpacity,
            }}
          />
        )}

        {/* Ambient Secondary Counter-Glow for depth */}
        {glow !== 'none' && glow !== 'subtle' && (
          <div
            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[90px] pointer-events-none transition-colors duration-700 -z-10"
            style={{
              backgroundColor: currentColor,
              opacity: glowOpacity * 0.4,
            }}
          />
        )}

        {/* Custom Children Mode */}
        {children ? (
          <div className="relative z-10 w-full h-full">{children}</div>
        ) : (
          <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
            {/* Header: Badge & Color Switcher */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                {badgeText && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-300 shadow-xs"
                    style={{
                      backgroundColor: \`\${currentColor}18\`,
                      borderColor: \`\${currentColor}40\`,
                      color: currentColor,
                    }}
                  >
                    {badgeIcon}
                    <span>{badgeText}</span>
                  </div>
                )}

                {/* Color Switcher */}
                {showColorPicker && colors && colors.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-muted/60 dark:bg-muted/40 p-1 rounded-full border border-border/60 backdrop-blur-md">
                    {colors.map((c) => {
                      const isActive = currentColor.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleSelectColor(c.hex)}
                          className={cn(
                            'w-3.5 h-3.5 rounded-full transition-all duration-200 cursor-pointer',
                            isActive
                              ? 'scale-125 ring-2 ring-foreground/40 shadow-xs'
                              : 'hover:scale-110 opacity-70 hover:opacity-100'
                          )}
                          style={{ backgroundColor: c.hex }}
                          title={\`Switch to \${c.name}\`}
                          aria-label={\`Switch glow to \${c.name}\`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div>
                {title && (
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="pt-2 flex items-center justify-center">
              {previewSlot ? (
                previewSlot
              ) : (
                <div
                  className={cn(
                    'relative p-[1.5px] overflow-hidden transition-all duration-300 w-full max-w-[280px]',
                    radiusConfig.inner
                  )}
                  style={{
                    background: \`linear-gradient(135deg, \${currentColor}, transparent 60%, \${currentColor}90)\`,
                  }}
                >
                  <div
                    className={cn(
                      'bg-card/90 dark:bg-card/80 px-4 py-3 flex items-center justify-between backdrop-blur-md shadow-inner',
                      radiusConfig.inner
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
                        style={{ backgroundColor: currentColor }}
                      />
                      <span className="text-xs font-mono font-semibold text-foreground">
                        Interactive Aurora Pill
                      </span>
                    </div>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md font-medium border"
                      style={{
                        backgroundColor: \`\${currentColor}12\`,
                        borderColor: \`\${currentColor}30\`,
                        color: currentColor,
                      }}
                    >
                      {currentColor.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Slot */}
            {footerSlot && <div className="pt-2 border-t border-border/50">{footerSlot}</div>}
          </div>
        )}
      </div>
    );
  }
);

AuroraBorderFX.displayName = 'AuroraBorderFX';
`
};

// src/registry/aurora-search-pill.ts
var auroraSearchPill = {
  name: "aurora-search-pill",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "aurora-search-pill.tsx",
  content: `'use client';

import * as React from 'react';
import { Globe, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

// Register hardware angle property once for conic gradient rotation
if (typeof window !== 'undefined' && typeof (window as any).CSS !== 'undefined' && 'registerProperty' in (window as any).CSS) {
  try {
    (window as any).CSS.registerProperty({
      name: '--aurora-deg',
      syntax: '<angle>',
      inherits: false,
      initialValue: '0deg',
    });
  } catch {}
}

export interface AuroraSearchSource {
  /** Unique key for the source badge */
  id: string;
  /** Label or tooltip text for the source */
  label?: string;
  /** Direct avatar image URL (e.g. favicon, PNG, SVG) */
  avatarUrl?: string;
  /** Custom icon or element */
  icon?: React.ReactNode;
  /** Text initials to display inside badge */
  initials?: string;
  /** Built-in preset type or custom */
  type?: 'globe' | 'gradient' | 'github' | 'claude' | 'chatgpt' | 'perplexity' | 'custom';
  /** Custom background CSS string or hex */
  bg?: string;
}

export type AuroraSearchPillSize = 'sm' | 'md' | 'lg';
export type AuroraSearchPillSpeed = 'slow' | 'normal' | 'fast';
export type AuroraSearchPillTheme = 'light' | 'dark' | 'auto';
export type AuroraSearchPillGlow = 'subtle' | 'medium' | 'strong' | 'none';
export type AuroraSpinMode = 'always' | 'searching' | 'hover' | 'never';

export interface AuroraSearchPillProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  /** Controlled searching state */
  isSearching?: boolean;
  /** Uncontrolled default searching state */
  defaultSearching?: boolean;
  /** Callback fired when searching state toggles */
  onToggle?: (searching: boolean) => void;
  /** Main search title text shown when active (default: "Search...") */
  searchLabel?: string;
  /** List of badge sources to render in the active state */
  sources?: AuroraSearchSource[];
  /** Shortcut array of avatar image URLs */
  sourceAvatars?: string[];
  /** Color theme for the pill body: light, dark, or auto (follows dark mode) */
  theme?: AuroraSearchPillTheme;
  /** Size scale of the pill */
  size?: AuroraSearchPillSize;
  /** Glow intensity of the surrounding ambient aurora */
  glowIntensity?: AuroraSearchPillGlow;
  /** Speed of the rotating aurora beam */
  speed?: AuroraSearchPillSpeed;
  /**
   * When the aurora beam should rotate:
   * - 'always' (default): continuously rotates the aurora light wave all the time
   * - 'searching': only spins while searching/active, remains calm when idle
   * - 'hover': spins on cursor hover / focus
   * - 'never': static gradient, no rotation
   */
  spinMode?: AuroraSpinMode;
  /** Manually override spinning state */
  isSpinning?: boolean;
  /** Automatically toggle searching state at a set interval (demo mode) */
  autoCycle?: boolean;
  /** Interval in ms for autoCycle (default: 2400) */
  cycleInterval?: number;
}

const DEFAULT_SOURCES: AuroraSearchSource[] = [
  { id: 'web', type: 'globe', label: 'Web' },
  { id: 'gradient', type: 'gradient', label: 'Neural Index' },
  { id: 'github', type: 'github', label: 'GitHub' },
];

const SPEED_MAP: Record<AuroraSearchPillSpeed, string> = {
  slow: '5s',
  normal: '3.2s',
  fast: '1.8s',
};

const GLOW_OPACITY: Record<AuroraSearchPillGlow, number> = {
  none: 0,
  subtle: 0.45,
  medium: 0.75,
  strong: 0.95,
};

const SIZE_CONFIG: Record<
  AuroraSearchPillSize,
  {
    height: string;
    paddingDots: string;
    paddingSearch: string;
    dotSize: string;
    dotGap: string;
    fontSize: string;
    badgeSize: string;
    badgeMargin: string;
    minWidthSearch: string;
  }
> = {
  sm: {
    height: 'h-10',
    paddingDots: 'px-4',
    paddingSearch: 'px-4',
    dotSize: 'w-1.5 h-1.5',
    dotGap: 'gap-1.5',
    fontSize: 'text-xs',
    badgeSize: 'w-4 h-4',
    badgeMargin: '-ml-1',
    minWidthSearch: 'min-w-[160px]',
  },
  md: {
    height: 'h-12',
    paddingDots: 'px-5',
    paddingSearch: 'px-5',
    dotSize: 'w-[6.5px] h-[6.5px]',
    dotGap: 'gap-[7px]',
    fontSize: 'text-sm sm:text-base',
    badgeSize: 'w-[22px] h-[22px]',
    badgeMargin: '-ml-1.5',
    minWidthSearch: 'min-w-[190px]',
  },
  lg: {
    height: 'h-14',
    paddingDots: 'px-6',
    paddingSearch: 'px-6',
    dotSize: 'w-2 h-2',
    dotGap: 'gap-2',
    fontSize: 'text-base sm:text-lg',
    badgeSize: 'w-6 h-6',
    badgeMargin: '-ml-2',
    minWidthSearch: 'min-w-[220px]',
  },
};

/**
 * AuroraSearchPill Component
 *
 * An ultra-premium AI search pill with an ambient rotating aurora conic glow,
 * 1.5px illuminated border track, and smooth transition between pulsing dots and
 * active search query with source badges.
 */
export const AuroraSearchPill = React.forwardRef<HTMLDivElement, AuroraSearchPillProps>(
  (
    {
      isSearching: controlledSearching,
      defaultSearching = false,
      onToggle,
      searchLabel = 'Search...',
      sources = DEFAULT_SOURCES,
      sourceAvatars,
      theme = 'auto',
      size = 'md',
      glowIntensity = 'medium',
      speed = 'normal',
      spinMode = 'always',
      isSpinning: controlledSpinning,
      autoCycle = false,
      cycleInterval = 2400,
      className,
      onClick,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledSearching !== undefined;
    const [uncontrolledSearching, setUncontrolledSearching] = React.useState(defaultSearching);
    const active = isControlled ? controlledSearching : uncontrolledSearching;

    const [isHovered, setIsHovered] = React.useState(false);

    // Resolve active sources list (support direct sourceAvatars list)
    const activeSources = React.useMemo<AuroraSearchSource[]>(() => {
      if (sourceAvatars && sourceAvatars.length > 0) {
        return sourceAvatars.map((url, i): AuroraSearchSource => ({
          id: \`avatar-\${i}\`,
          avatarUrl: url,
          label: \`Source \${i + 1}\`,
          type: 'custom',
        }));
      }
      return sources;
    }, [sourceAvatars, sources]);

    // Determine whether the aurora beam should actively rotate (default: always on)
    const shouldSpin = React.useMemo(() => {
      if (controlledSpinning !== undefined) return controlledSpinning;
      if (spinMode === 'never') return false;
      if (spinMode === 'searching') return active;
      if (spinMode === 'hover') return isHovered;
      // Default: 'always' -> continuously rotates in both idle (dots) and searching states
      return true;
    }, [controlledSpinning, spinMode, isHovered, active]);

    // Auto demo cycling
    React.useEffect(() => {
      if (!autoCycle) return;
      const interval = setInterval(() => {
        if (isControlled) {
          onToggle?.(!active);
        } else {
          setUncontrolledSearching((prev) => {
            const next = !prev;
            onToggle?.(next);
            return next;
          });
        }
      }, cycleInterval);

      return () => clearInterval(interval);
    }, [autoCycle, cycleInterval, active, isControlled, onToggle]);

    const handleToggle = (e?: React.SyntheticEvent) => {
      onClick?.(e as React.MouseEvent<HTMLDivElement>);
      if (!isControlled) {
        setUncontrolledSearching(!active);
      }
      onToggle?.(!active);
    };

    const sizeStyle = SIZE_CONFIG[size] || SIZE_CONFIG.md;
    const animationDuration = SPEED_MAP[speed] || SPEED_MAP.normal;
    const glowAlpha = GLOW_OPACITY[glowIntensity] ?? GLOW_OPACITY.medium;

    // Theme resolution for pill body
    const bodyThemeClass =
      theme === 'light'
        ? 'bg-white text-slate-900 border-white/60 shadow-sm'
        : theme === 'dark'
        ? 'bg-[#090d16] text-white border-white/10 shadow-lg shadow-black/40'
        : 'bg-white text-slate-900 dark:bg-[#090d16] dark:text-white border-white/60 dark:border-white/10 shadow-sm dark:shadow-black/40';

    const dotsColorClass =
      theme === 'light'
        ? 'bg-slate-900'
        : theme === 'dark'
        ? 'bg-white'
        : 'bg-slate-900 dark:bg-white';

    const {
      onKeyDown,
      ...restProps
    } = props;

    return (
      <div
        ref={ref}
        {...restProps}
        onClick={(e) => {
          onClick?.(e);
          handleToggle(e);
        }}
        onMouseEnter={(e) => {
          setIsHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          onMouseLeave?.(e);
        }}
        role="button"
        tabIndex={0}
        aria-pressed={active}
        aria-label={active ? \`Searching: \${searchLabel}\` : 'Activate AI Search'}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle(e);
          }
        }}
        className={cn(
          'relative inline-flex items-center justify-center cursor-pointer select-none isolate outline-none group',
          'transition-transform duration-200 ease-out active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
          className
        )}
      >
        {/* Scoped CSS for hardware accelerated conic rotation and pulse */}
        <style dangerouslySetInnerHTML={{
          __html: \`
            @property --aurora-deg {
              syntax: '<angle>';
              initial-value: 0deg;
              inherits: false;
            }
            @keyframes spinAurora {
              from {
                --aurora-deg: 0deg;
              }
              to {
                --aurora-deg: 360deg;
              }
            }
            @keyframes dotPulse {
              0%, 80%, 100% {
                opacity: 0.35;
                transform: scale(0.75);
              }
              40% {
                opacity: 1;
                transform: scale(1.15);
              }
            }
          \`,
        }} />

        {/* 1. Ambient Volumetric Glow (Aurora Ambient Glow) */}
        {glowIntensity !== 'none' && (
          <div
            className="absolute -inset-1.5 rounded-full pointer-events-none blur-md z-0 transition-opacity duration-300"
            style={{
              opacity: glowAlpha,
              background: \`conic-gradient(
                from var(--aurora-deg, 0deg) at 50% 50%,
                transparent 0deg,
                rgba(59, 130, 246, 0.75) 60deg,
                rgba(139, 92, 246, 0.9) 110deg,
                rgba(236, 72, 153, 0.95) 160deg,
                rgba(244, 63, 94, 0.8) 200deg,
                transparent 250deg,
                transparent 360deg
              )\`,
              animation: shouldSpin
                ? \`spinAurora \${animationDuration} linear infinite\`
                : undefined,
            }}
          />
        )}

        {/* 2. Sharp 1.5px Conic Border Track */}
        <div
          className="relative z-10 p-[1.5px] rounded-full transition-shadow duration-300 shadow-sm"
          style={{
            background: \`conic-gradient(
              from var(--aurora-deg, 0deg) at 50% 50%,
              rgba(226, 232, 240, 0.8) 0deg,
              rgba(59, 130, 246, 0.85) 60deg,
              rgba(139, 92, 246, 1) 110deg,
              rgba(236, 72, 153, 1) 160deg,
              rgba(244, 63, 94, 0.85) 200deg,
              rgba(226, 232, 240, 0.6) 260deg,
              rgba(226, 232, 240, 0.8) 360deg
            )\`,
            animation: shouldSpin
              ? \`spinAurora \${animationDuration} linear infinite\`
              : undefined,
          }}
        >
          {/* 3. Center Pill Body */}
          <div
            className={cn(
              'relative z-20 rounded-full flex items-center justify-center overflow-hidden border',
              sizeStyle.height,
              active ? cn(sizeStyle.paddingSearch, sizeStyle.minWidthSearch) : sizeStyle.paddingDots,
              bodyThemeClass,
              'transition-all duration-500 ease-out'
            )}
          >
            {/* STATE 1: Pulsing Dots (Idle/Listening) */}
            <div
              className={cn(
                'flex items-center',
                sizeStyle.dotGap,
                'transition-all duration-400 ease-out',
                active
                  ? 'opacity-0 scale-50 -translate-y-2 pointer-events-none absolute'
                  : 'opacity-100 scale-100 translate-y-0'
              )}
            >
              {[0, 1, 2].map((idx) => (
                <span
                  key={idx}
                  className={cn('rounded-full inline-block', sizeStyle.dotSize, dotsColorClass)}
                  style={{
                    animation: \`dotPulse 1.4s ease-in-out infinite both\`,
                    animationDelay: \`\${idx === 0 ? -0.32 : idx === 1 ? -0.16 : 0}s\`,
                  }}
                />
              ))}
            </div>

            {/* STATE 2: Active Search Label + Overlapping Sources */}
            <div
              className={cn(
                'flex items-center gap-2.5 whitespace-nowrap',
                'transition-all duration-400 ease-out',
                active
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-90 translate-y-2 pointer-events-none absolute'
              )}
            >
              {/* Search Title */}
              <span className={cn('font-medium tracking-tight', sizeStyle.fontSize)}>
                {searchLabel}
              </span>

              {/* Overlapping Sources Row */}
              {activeSources && activeSources.length > 0 && (
                <div className="inline-flex items-center pl-0.5">
                  {activeSources.map((src, i) => {
                    const isFirst = i === 0;

                    return (
                      <div
                        key={src.id || i}
                        title={src.label || src.id}
                        className={cn(
                          'rounded-full border-[1.5px] border-white dark:border-zinc-900 flex items-center justify-center shrink-0 shadow-xs overflow-hidden',
                          sizeStyle.badgeSize,
                          !isFirst && sizeStyle.badgeMargin
                        )}
                        style={{
                          backgroundColor:
                            src.type === 'globe'
                              ? '#0b1120'
                              : src.type === 'github'
                              ? '#ffffff'
                              : src.type === 'claude'
                              ? '#d97757'
                              : src.type === 'chatgpt'
                              ? '#10a37f'
                              : src.type === 'perplexity'
                              ? '#1fb8cd'
                              : src.type === 'custom' && src.bg
                              ? src.bg
                              : undefined,
                          background:
                            src.type === 'gradient'
                              ? 'linear-gradient(135deg, #06b6d4 45%, #3b82f6 55%)'
                              : undefined,
                        }}
                      >
                        {src.avatarUrl ? (
                          <img
                            src={src.avatarUrl}
                            alt={src.label || src.id}
                            className="w-full h-full object-cover"
                          />
                        ) : src.icon ? (
                          src.icon
                        ) : src.type === 'globe' ? (
                          <Globe className="w-3 h-3 text-sky-400 stroke-[2.5]" />
                        ) : src.type === 'github' ? (
                          <svg className="w-3.5 h-3.5 fill-[#181717]" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        ) : src.type === 'claude' ? (
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        ) : src.type === 'chatgpt' ? (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        ) : src.type === 'perplexity' ? (
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        ) : src.initials ? (
                          <span className="text-[8px] font-bold text-white uppercase">
                            {src.initials}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AuroraSearchPill.displayName = 'AuroraSearchPill';
`
};

// src/registry/avatar.ts
var avatar = {
  name: "avatar",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "framer-motion"
  ],
  fileName: "avatar.tsx",
  content: `"use client"

import * as React from "react"
import { cn } from "../utils/cn"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full transition-all duration-300",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
      variant: {
        default: "border-2 border-background",
        gradient: "p-[2px] bg-linear-to-tr from-violet-500 to-pink-500",
        glow: "shadow-[0_0_15px_rgba(139,92,246,0.5)] border-2 border-violet-500",
        glass: "backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    }
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F status
   * @default undefined
   */
  status?: "online" | "offline" | "away" | "busy";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, variant, status, children, ...props }, ref) => {
    const statusColors = {
      online: "bg-emerald-500",
      offline: "bg-muted-foreground/50",
      away: "bg-amber-500",
      busy: "bg-red-500",
    }

    return (
      <div className="relative inline-block group">
        <div
          ref={ref}
          className={cn(avatarVariants({ size, variant, className }))}
          {...props}
        >
          {variant === "gradient" ? (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background p-px">
              {children}
            </div>
          ) : (
            children
          )}
        </div>
        {status && (
          <span className={cn(
            "absolute bottom-0 right-0 block rounded-full border-2 border-background",
            statusColors[status],
            size === "sm" ? "h-2.5 w-2.5" : size === "xl" ? "h-4.5 w-4.5" : "h-3.5 w-3.5"
          )} />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover rounded-full", className)}
      {...props}
    />
  )
)
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

// ----------------------------------------------------
// Consolidated Avatar Exports
// ----------------------------------------------------

export const GlowAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} variant="glow" status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const StatusAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const GlassAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} variant="glass" status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const SquareAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("rounded-xl [&>div]:rounded-xl [&_img]:rounded-xl [&_div]:rounded-xl", className)}>
    {src ? <AvatarImage src={src} className="rounded-xl" /> : <AvatarFallback className="rounded-xl">{fallback}</AvatarFallback>}
  </Avatar>
)

export const HexagonAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("clip-path-hexagon", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const SquircleAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("rounded-[35%] [&>div]:rounded-[35%] [&_img]:rounded-[35%] [&_div]:rounded-[35%]", className)}>
    {src ? <AvatarImage src={src} className="rounded-[35%]" /> : <AvatarFallback className="rounded-[35%]">{fallback}</AvatarFallback>}
  </Avatar>
)

export const GradientRingAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} variant="gradient" status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const InitialsAvatar = ({ fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={className}>
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
)

export const InitialsGradientAvatar = ({ fallback, size, status, className }: any) => (
  <Avatar size={size} variant="gradient" status={status} className={className}>
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
)

export const OutlineAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("border-2 border-primary", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const HoverExpandAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("hover:scale-110 active:scale-95 transition-transform", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const PulseAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("ring-2 ring-primary ring-offset-2 animate-pulse", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const StackAvatar = ({
  avatars,
  urls,
  max = 4,
  className
}: {
  avatars?: Array<{ src?: string; fallback: string }>;
  urls?: string[];
  max?: number;
  className?: string;
}) => {
  const resolvedAvatars = avatars 
    ? avatars 
    : (urls || []).map(url => ({ src: url, fallback: "U" }));

  const visible = resolvedAvatars.slice(0, max)
  const remaining = resolvedAvatars.length - max
  return (
    <div className={cn("flex -space-x-3 items-center", className)}>
      {visible.map((av, i) => (
        <Avatar key={i} size="sm" className="border-2 border-background ring-1 ring-black/5 hover:-translate-y-1 transition-transform">
          {av.src ? <AvatarImage src={av.src} /> : <AvatarFallback>{av.fallback}</AvatarFallback>}
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold text-muted-foreground ring-1 ring-black/5">
          +{remaining}
        </div>
      )}
    </div>
  )
}

export const DottedAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("border-2 border-dashed border-primary p-px", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const ShadowAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("shadow-2xl shadow-primary/40", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const PolymorphAvatar = ({ src, fallback, size, status, className }: any) => (
  <Avatar size={size} status={status} className={cn("rounded-none hover:rounded-[40%] transition-all duration-500", className)}>
    {src ? <AvatarImage src={src} className="rounded-none hover:rounded-[40%] transition-all duration-500" /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const TooltipAvatar = ({ src, fallback, size, status, tooltipText, className }: any) => (
  <div className="relative group/tooltip inline-block">
    <Avatar size={size} status={status} className={className}>
      {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
    </Avatar>
    {tooltipText && (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-black/90 text-[10px] font-semibold text-white rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50">
        {tooltipText}
      </div>
    )}
  </div>
)

export const AnimatedBorderAvatar = ({ src, fallback }: any) => (
  <div className="relative p-[2px] rounded-full overflow-hidden inline-block">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,hsl(var(--primary))_360deg)]" />
    <Avatar className="relative border-2 border-background">
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  </div>
)

export { Avatar, AvatarImage, AvatarFallback }
`
};

// src/registry/badge.ts
var badge = {
  name: "badge",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority"
  ],
  fileName: "badge.tsx",
  content: `'use client';

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-default",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border hover:bg-accent",
        gradient: "border-transparent bg-linear-to-r from-violet-600 to-pink-600 dark:from-violet-500 dark:to-pink-500 text-white shadow-sm",
        neon: "border-primary/50 bg-primary/10 text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]",
        success: "border-transparent bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
        warning: "border-transparent bg-amber-500/20 text-amber-600 dark:text-amber-400",
        info: "border-transparent bg-blue-500/20 text-blue-600 dark:text-blue-400",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-1.5 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F pulse
   * @default undefined
   */
  pulse?: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F dot
   * @default undefined
   */
  dot?: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F text
   * @default undefined
   */
  text?: string;
}

function Badge({ className, variant, size, pulse = false, dot = false, children, text, ...props }: BadgeProps) {
  const showDot = dot || pulse;
  
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {showDot && (
        <span className="relative flex h-2 w-2 mr-1">
          {pulse && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          )}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children || text}
    </div>
  )
}

export { Badge, badgeVariants }
`
};

// src/registry/blur-fade.ts
var blurFade = {
  name: "blur-fade",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "blur-fade.tsx",
  content: `"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "../utils/cn"

/**
 * Props for the BlurFade component
 */
export interface BlurFadeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Children components to animate
   */
  children: React.ReactNode
  /**
   * Animation delay in seconds
   * @default 0
   */
  delay?: number
  /**
   * Animation duration in seconds
   * @default 0.4
   */
  duration?: number
  /**
   * Y axis offset translation on start
   * @default 6
   */
  yOffset?: number
  /**
   * Start blur level (CSS blur radius value)
   * @default "4px"
   */
  blur?: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Whether to animate based on viewport entry
   * @default true
   */
  inView?: boolean
  /**
   * Trigger animation only once
   * @default true
   */
  once?: boolean
  /**
   * Viewport margin threshold for in-view trigger
   * @default "-50px"
   */
  margin?: string
}

/**
 * BlurFade animates elements with a smooth blur and fade transition as they enter the viewport.
 */
const BlurFade = React.forwardRef<HTMLDivElement, BlurFadeProps>(
  (
    {
      children,
      delay = 0,
      duration = 0.4,
      yOffset = 6,
      blur = "4px",
      className,
      inView = true,
      once = true,
      margin = "-50px",
      ...props
    },
    ref
  ) => {
    const localRef = React.useRef<HTMLDivElement>(null)
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || localRef
    
    // Check if element is in view (if requested)
    type UseInViewOptions = NonNullable<Parameters<typeof useInView>[1]>
    const isInView = useInView(combinedRef, { once, margin: margin as UseInViewOptions["margin"] })
    const animateState = inView ? (isInView ? "visible" : "hidden") : "visible"

    const variants = {
      hidden: {
        y: yOffset,
        opacity: 0,
        filter: \`blur(\${blur})\`,
      },
      visible: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
      },
    }

    return (
      <motion.div
        ref={combinedRef}
        initial="hidden"
        animate={animateState}
        variants={variants}
        transition={{
          delay,
          duration,
          ease: [0.25, 0.4, 0.25, 1.0], // smooth cubic-bezier physics feel
        }}
        className={cn("w-full", className)}
        {...(props as any)}
      >
        {children}
      </motion.div>
    )
  }
)

BlurFade.displayName = "BlurFade"

export { BlurFade }
`
};

// src/registry/button.ts
var button = {
  name: "button",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "button.tsx",
  content: `'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { motion, useReducedMotion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Premium variants
        premium: "bg-linear-to-r from-violet-600 via-pink-600 to-orange-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30",
        neon: "bg-background border-2 border-primary text-foreground shadow-[0_0_var(--glow-radius)_rgba(var(--glow-color),var(--glow-strength))] hover:shadow-[0_0_calc(var(--glow-radius)*1.5)_rgba(var(--glow-color),calc(var(--glow-strength)*1.5))]",
        glass: "backdrop-blur-md bg-zinc-900/10 dark:bg-zinc-100/10 border border-zinc-900/20 dark:border-zinc-100/20 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-900/20 dark:hover:bg-zinc-100/20 shadow-md",
        shimmer: "relative overflow-hidden bg-slate-900 text-white dark:bg-white dark:text-black",
        // New requested variants
        gradient: "bg-linear-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-indigo-500 dark:via-purple-500 dark:to-violet-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:opacity-95",
        glow: "bg-primary text-primary-foreground shadow-[0_0_var(--glow-radius)_rgba(var(--glow-color),var(--glow-strength))] hover:shadow-[0_0_calc(var(--glow-radius)*1.5)_rgba(var(--glow-color),calc(var(--glow-strength)*1.5))] border border-primary/20",
        magnetic: "bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-md hover:shadow-lg",
        loading: "bg-primary/80 text-primary-foreground/80 pointer-events-none cursor-wait",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-sm px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Props for the Button component
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 
   * Enable hover/tap spring motion animation
   * @default true 
   */
  animate?: boolean;
  /** 
   * Enable shimmer light animation effect
   * @default false
   */
  shimmer?: boolean;
  /** 
   * Enable neon glow effect
   * @default false
   */
  glow?: boolean;
  /** 
   * Display loading spinner icon and disable actions
   * @default false
   */
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      animate = true,
      shimmer = false,
      glow = false,
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const isShimmer = variant === 'shimmer' || shimmer;
    const isMagnetic = variant === 'magnetic';
    const isGlow = variant === 'glow' || glow;

    // Track mouse coords for magnetic hover movement
    const [magneticPos, setMagneticPos] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isMagnetic) return;
      const { clientX, clientY, currentTarget } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      // spring weight multiplier
      setMagneticPos({ x: x * 0.35, y: y * 0.35 });
    };

    const handleMouseLeave = () => {
      if (!isMagnetic) return;
      setMagneticPos({ x: 0, y: 0 });
    };

    const buttonContent = (
      <>
        {isShimmer && (
          <motion.div
            className="absolute inset-0 w-[200%] bg-linear-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 2,
              ease: 'linear',
            }}
            style={{ transform: 'skewX(-20deg)' }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading && <Loader2 className="animate-spin h-4 w-4 shrink-0" />}
          {children}
        </span>
      </>
    );

    const activeVariant = isLoading ? "loading" : variant;

    // Disable button if loading
    const disabledState = props.disabled || isLoading;

    // Destructure custom props to avoid passing invalid props down to HTML element
    const { ...htmlProps } = props;

    // Setup base styles
    const resolvedClassName = cn(
      buttonVariants({ variant: activeVariant, size, className }),
      isShimmer && "relative overflow-hidden",
      isGlow && "shadow-[0_0_var(--glow-radius)_rgba(var(--glow-color),var(--glow-strength))]"
    );

    const shouldReduceMotion = useReducedMotion();
    const shouldAnimate = animate && !shouldReduceMotion;

    if (!shouldAnimate) {
      return (
        <button
          ref={ref}
          disabled={disabledState}
          className={resolvedClassName}
          {...(htmlProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {buttonContent}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabledState}
        className={resolvedClassName}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={isMagnetic ? { x: magneticPos.x, y: magneticPos.y } : undefined}
        whileHover={{
          scale: isMagnetic ? 1.02 : 1.03,
          y: isMagnetic ? 0 : -1.5,
          shadow: isGlow ? "0 0 calc(var(--glow-radius)*1.5) rgba(var(--glow-color), calc(var(--glow-strength)*1.5))" : undefined,
        }}
        whileTap={{ scale: 0.97 }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 20,
        }}
        {...(htmlProps as any)}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

// ----------------------------------------------------
// Deprecated button wrappers for backward compatibility
// ----------------------------------------------------

/**
 * @deprecated Use the unified \`<Button variant="neon">\` instead.
 */
export const NeonButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="neon" glow={true} {...props}>
      {children}
    </Button>
  )
);
NeonButton.displayName = "NeonButton";

/**
 * @deprecated Use custom styles or class variance utilities on the unified \`<Button>\` instead.
 */
export const ThreeDButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "shadow-[0_5px_0_hsl(var(--primary-dark,240_5.9%_30%))] hover:shadow-[0_2px_0_hsl(var(--primary-dark,240_5.9%_30%))] active:translate-y-0.75 active:shadow-[0_0px_0_transparent] transition-all",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);
ThreeDButton.displayName = "ThreeDButton";

/**
 * @deprecated Use custom ripple animations on the unified \`<Button>\` instead.
 */
export const RippleButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "relative overflow-hidden group active:scale-95 transition-transform",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 bg-white/20 scale-0 rounded-full group-active:scale-[2] transition-transform duration-500 origin-center"></span>
      <span className="relative z-10">{children}</span>
    </Button>
  )
);
RippleButton.displayName = "RippleButton";

/**
 * @deprecated Use standard utility classes on the unified \`<Button>\` instead.
 */
export const CyberpunkButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "bg-yellow-400 text-black font-extrabold uppercase tracking-widest border-2 border-black hover:bg-black hover:text-yellow-400 hover:border-yellow-400 transition-colors shadow-[4px_4px_0_0_#000] rounded-none hover:shadow-[4px_4px_0_0_#fff]",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);
CyberpunkButton.displayName = "CyberpunkButton";

/**
 * @deprecated Use the unified \`<Button variant="magnetic">\` instead.
 */
export const MagneticButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="magnetic" {...props}>
      {children}
    </Button>
  )
);
MagneticButton.displayName = "MagneticButton";

/**
 * @deprecated Use the unified \`<Button variant="shimmer">\` instead.
 */
export const ShimmerButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="shimmer" shimmer={true} {...props}>
      {children}
    </Button>
  )
);
ShimmerButton.displayName = "ShimmerButton";

/**
 * @deprecated Use a custom hover effect on the unified \`<Button>\` instead.
 */
export const BorderBeamButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "relative overflow-hidden border border-border group",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-linear-to-r from-primary to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
      <div className="absolute top-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      <span className="relative z-10">{children}</span>
    </Button>
  )
);
BorderBeamButton.displayName = "BorderBeamButton";

/**
 * @deprecated Use the unified \`<Button isLoading={...}>\` instead.
 */
export const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps & { isLoading?: boolean }>(
  ({ children, isLoading = true, ...props }, ref) => (
    <Button ref={ref} isLoading={isLoading} {...props}>
      {children}
    </Button>
  )
);
LoadingButton.displayName = "LoadingButton";

/**
 * @deprecated Use the unified \`<Button variant="destructive" glow>\` instead.
 */
export const DestructiveGlowButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="destructive" glow={true} {...props}>
      {children}
    </Button>
  )
);
DestructiveGlowButton.displayName = "DestructiveGlowButton";

/**
 * @deprecated Use the unified \`<Button variant="outline">\` instead.
 */
export const GhostOutlineButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="outline" {...props}>
      {children}
    </Button>
  )
);
GhostOutlineButton.displayName = "GhostOutlineButton";

/**
 * @deprecated Use the unified \`<Button variant="glow">\` instead.
 */
export const GlowButton = React.forwardRef<HTMLButtonElement, ButtonProps & { glowColor?: string }>(
  ({ children, glowColor = "rgba(139, 92, 246, 0.15)", className, ...props }, ref) => (
    <div className="relative group inline-block">
      <div
        className="absolute -inset-0.5 bg-linear-to-r from-primary to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
        style={{ backgroundColor: glowColor }}
      />
      <Button ref={ref} className={cn("relative bg-background", className)} {...props}>
        {children}
      </Button>
    </div>
  )
);
GlowButton.displayName = "GlowButton";

/**
 * @deprecated Use the unified \`<Button shimmer>\` instead.
 */
export const ShinyButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} shimmer={true} {...props}>
      {children}
    </Button>
  )
);
ShinyButton.displayName = "ShinyButton";

/**
 * @deprecated Use the unified \`<Button variant="gradient">\` instead.
 */
export const GradientButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="gradient" {...props}>
      {children}
    </Button>
  )
);
GradientButton.displayName = "GradientButton";

/**
 * @deprecated Use the unified \`<Button variant="glass">\` instead.
 */
export const GlassButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="glass" {...props}>
      {children}
    </Button>
  )
);
GlassButton.displayName = "GlassButton";

`
};

// src/registry/card.ts
var card = {
  name: "card",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "framer-motion"
  ],
  fileName: "card.tsx",
  content: `'use client';

import * as React from "react"
import { cn } from "../utils/cn"
import { motion, useReducedMotion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "rounded-xl text-card-foreground transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border bg-card text-card-foreground shadow-sm hover:shadow-md",
        glass: "backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-lg",
        gradient: "bg-linear-to-br from-violet-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 shadow-lg shadow-purple-500/5",
        glow: "bg-card border-2 border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.2)]",
        // New variants
        bento: "border border-border/60 bg-linear-to-br from-card to-muted/20 text-card-foreground shadow-md hover:shadow-lg hover:border-primary/30 relative",
        spotlight: "border bg-card text-card-foreground relative hover:border-primary/20",
        flip: "bg-transparent border-0 shadow-none overflow-visible relative",
        tilt: "border bg-card text-card-foreground shadow-md",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1.5 hover:shadow-lg",
        glow: "hover:border-primary/50 hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.25)]",
      }
    },
    defaultVariants: {
      variant: "default",
      hover: "lift",
    }
  }
)

/**
 * Props for the Card component
 */
export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof cardVariants> {
  /**
   * Whether to enable hover spring animations
   * @default true
   */
  animate?: boolean;
  /**
   * Back content displayed when using the \`flip\` variant on hover
   */
  backContent?: React.ReactNode;
  /**
   * Custom radial spotlight background color (e.g., rgba(168, 85, 247, 0.15))
   * @default "rgba(139, 92, 246, 0.15)"
   */
  spotlightColor?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      hover,
      animate = true,
      backContent,
      spotlightColor = "rgba(139, 92, 246, 0.15)",
      children,
      ...props
    },
    ref
  ) => {
    // Feature toggles based on variants
    const isSpotlight = variant === "spotlight";
    const isFlip = variant === "flip";
    const isTilt = variant === "tilt";

    // Spotlight mouse tracking state
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const handleMouseMoveSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSpotlight) return;
      const { currentTarget, clientX, clientY } = e;
      const { left, top } = currentTarget.getBoundingClientRect();
      setMousePos({ x: clientX - left, y: clientY - top });
    };

    // Tilt mouse tracking state
    const [tiltPos, setTiltPos] = React.useState({ rotateX: 0, rotateY: 0 });
    const handleMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isTilt) return;
      const { currentTarget, clientX, clientY } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      const maxTilt = 12; // degrees max rotation
      const rotateX = ((y - height / 2) / (height / 2)) * -maxTilt;
      const rotateY = ((x - width / 2) / (width / 2)) * maxTilt;
      setTiltPos({ rotateX, rotateY });
    };

    const handleMouseLeaveTilt = () => {
      if (!isTilt) return;
      setTiltPos({ rotateX: 0, rotateY: 0 });
    };

    // Flip card hover state
    const [isFlipped, setIsFlipped] = React.useState(false);

    // Destructure custom props to avoid DOM validation warnings
    const { ...htmlProps } = props;

    // Flip Variant Render
    if (isFlip) {
      return (
        <div
          ref={ref}
          className={cn(cardVariants({ variant, hover, className }), "perspective-1000 w-full h-full")}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
          {...(htmlProps as React.HTMLAttributes<HTMLDivElement>)}
        >
          <motion.div
            className="relative w-full h-full transition-all duration-500 preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            {/* Front Face */}
            <div className="absolute inset-0 backface-hidden border bg-card text-card-foreground rounded-xl shadow-sm flex flex-col justify-between overflow-hidden">
              {children}
            </div>

            {/* Back Face */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 border bg-linear-to-br from-primary/10 to-primary/5 text-card-foreground rounded-xl shadow-sm flex flex-col p-6 items-center justify-center text-center overflow-hidden">
              {backContent || (
                <div className="text-sm font-medium text-muted-foreground">
                  Flip side content placeholder
                </div>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    // Spotlight Variant Render Extra Element
    const spotlightEffect = isSpotlight && (
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: \`radial-gradient(400px circle at \${mousePos.x}px \${mousePos.y}px, \${spotlightColor}, transparent 80%)\`,
        }}
      />
    );

    // Build the resolved element attributes
    const cardClass = cn(cardVariants({ variant, hover: isFlip || isTilt ? "none" : hover, className }), isSpotlight && "group");

    const shouldReduceMotion = useReducedMotion();
    const shouldAnimate = (animate && !shouldReduceMotion) || isTilt;

    if (shouldAnimate) {
      return (
        <motion.div
          ref={ref}
          className={cardClass}
          onMouseMove={(e) => {
            if (isSpotlight) handleMouseMoveSpotlight(e);
            if (isTilt) handleMouseMoveTilt(e);
          }}
          onMouseLeave={() => {
            if (isTilt) handleMouseLeaveTilt();
          }}
          animate={
            isTilt
              ? { rotateX: tiltPos.rotateX, rotateY: tiltPos.rotateY }
              : undefined
          }
          whileHover={isTilt ? undefined : { scale: 1.015 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          {...(htmlProps as any)}
        >
          {spotlightEffect}
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cardClass}
        {...(htmlProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-xl bg-linear-to-br from-foreground to-foreground/75 bg-clip-text text-transparent", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed mt-1", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 leading-relaxed text-sm text-foreground/90", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-border/10 mt-auto", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

export const GlassCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="glass" {...props}>
      {children}
    </Card>
  )
);
GlassCard.displayName = "GlassCard";

export const GlowCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="glow" {...props}>
      {children}
    </Card>
  )
);
GlowCard.displayName = "GlowCard";

export const GradientCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="gradient" {...props}>
      {children}
    </Card>
  )
);
GradientCard.displayName = "GradientCard";

export const HoverCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} hover="lift" {...props}>
      {children}
    </Card>
  )
);
HoverCard.displayName = "HoverCard";

export const SpotlightCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card ref={ref} variant="spotlight" {...props}>
      {children}
    </Card>
  )
);
SpotlightCard.displayName = "SpotlightCard";




`
};

// src/registry/checkbox.ts
var checkbox = {
  name: "checkbox",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react",
    "@radix-ui/react-checkbox"
  ],
  fileName: "checkbox.tsx",
  content: `"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "../utils/cn"
import { motion } from "framer-motion"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-md border border-muted-foreground/30 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 data-[state=checked]:bg-linear-to-br data-[state=checked]:from-primary data-[state=checked]:to-primary/80 data-[state=checked]:text-primary-foreground data-[state=checked]:border-transparent data-[state=checked]:shadow-lg data-[state=checked]:shadow-primary/20",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      </motion.div>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
`
};

// src/registry/command.ts
var command = {
  name: "command",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react",
    "@radix-ui/react-dialog"
  ],
  fileName: "command.tsx",
  content: `"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import { cn } from "../utils/cn"

/**
 * Interface representing a Command palette item
 */
export interface CommandItem {
  label: string
  value: string
  icon?: React.ReactNode
  onSelect: () => void
}

/**
 * Props for the Command palette component
 */
export interface CommandProps {
  /**
   * Array of command items
   */
  items: CommandItem[]
  /**
   * Input search placeholder text
   * @default "Type a command or search..."
   */
  placeholder?: string
  /**
   * Whether the command dialog is open
   */
  open?: boolean
  /**
   * Callback fired when the open state changes
   */
  onOpenChange?: (open: boolean) => void
}

/**
 * Command component provides an interactive Command Palette (Cmd+K / Ctrl+K) dialog.
 */
const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ items, placeholder = "Type a command or search...", open: customOpen, onOpenChange }, ref) => {
    const [localOpen, setLocalOpen] = React.useState(false)
    const open = customOpen !== undefined ? customOpen : localOpen
    const setOpen = onOpenChange || setLocalOpen

    const [search, setSearch] = React.useState("")
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const listRef = React.useRef<HTMLDivElement>(null)

    // Toggle palette on Cmd+K / Ctrl+K
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault()
          setOpen(!open)
        }
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [open, setOpen])

    // Filter items based on search query
    const filteredItems = React.useMemo(() => {
      if (!search.trim()) return items
      return items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.value.toLowerCase().includes(search.toLowerCase())
      )
    }, [items, search])

    // Reset selected item when filtered items change
    React.useEffect(() => {
      setSelectedIndex(0)
    }, [filteredItems])

    // Handle key navigation inside the list
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (filteredItems.length === 0) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        const selected = filteredItems[selectedIndex]
        if (selected) {
          selected.onSelect()
          setOpen(false)
        }
      }
    }

    return (
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <DialogPrimitive.Portal forceMount>
              {/* Overlay */}
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
                />
              </DialogPrimitive.Overlay>

              {/* Palette Container */}
              <DialogPrimitive.Content asChild>
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    onKeyDown={handleKeyDown}
                    ref={ref}
                    className="relative w-full max-w-[550px] bg-card/95 border border-border/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col focus:outline-none"
                  >
                    {/* Header Input */}
                    <div className="flex items-center gap-3 px-4 border-b border-border/40">
                      <Search className="h-4.5 w-4.5 text-muted-foreground/60 shrink-0" />
                      <input
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 h-12 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground/40 font-medium"
                      />
                      <kbd className="inline-flex h-5.5 select-none items-center rounded border border-border bg-muted/40 px-1.5 font-mono text-[9px] font-medium text-muted-foreground/50">
                        ESC
                      </kbd>
                    </div>

                    {/* Scrollable list */}
                    <div
                      ref={listRef}
                      className="max-h-[300px] overflow-y-auto p-2 space-y-0.5"
                    >
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item, idx) => {
                          const isSelected = idx === selectedIndex
                          return (
                            <button
                              key={item.value + idx}
                              onClick={() => {
                                item.onSelect()
                                setOpen(false)
                              }}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all text-left outline-none",
                                isSelected
                                  ? "bg-primary/10 text-primary font-medium shadow-[inset_0_0_1px_rgba(var(--primary-rgb),0.2)]"
                                  : "text-foreground hover:bg-muted/40"
                              )}
                            >
                              {item.icon && (
                                <span className={cn("shrink-0", isSelected ? "text-primary" : "text-muted-foreground/70")}>
                                  {item.icon}
                                </span>
                              )}
                              <span className="flex-1 truncate">{item.label}</span>
                              {isSelected && (
                                <span className="text-[10px] uppercase font-bold tracking-widest text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded-md">
                                  Select
                                </span>
                              )}
                            </button>
                          )
                        })
                      ) : (
                        <div className="py-8 text-center text-sm text-muted-foreground/60">
                          No results found.
                        </div>
                      )}
                    </div>

                    {/* Footer guides */}
                    <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border/40 bg-muted/10">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                        <kbd className="inline-flex h-4 items-center rounded border border-border bg-muted/20 px-1 font-mono text-[8px]">\u2191\u2193</kbd>
                        <span>Navigate</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                        <kbd className="inline-flex h-4 items-center rounded border border-border bg-muted/20 px-1 font-mono text-[8px]">\u21B5</kbd>
                        <span>Select</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    )
  }
)

Command.displayName = "Command"

export { Command }
`
};

// src/registry/dark-mode.ts
var darkMode = {
  name: "dark-mode",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "dark-mode.tsx",
  content: `"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "../utils/cn";

export interface DarkModeToggleProps {
  theme?: "light" | "dark" | "system";
  variant?: "pill" | "icon" | "segmented";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  onChange?: (theme: "light" | "dark" | "system") => void;
  className?: string;
}

export function DarkModeToggle({
  theme: controlledTheme,
  variant = "pill",
  size = "md",
  showLabel = false,
  onChange,
  className,
}: DarkModeToggleProps) {
  const [internalTheme, setInternalTheme] = useState<"light" | "dark" | "system">("dark");

  const activeTheme = controlledTheme !== undefined ? controlledTheme : internalTheme;

  const handleToggle = (newTheme: "light" | "dark" | "system") => {
    if (controlledTheme === undefined) {
      setInternalTheme(newTheme);
      // Toggle class on documentElement for vanilla / non-provider environments
      if (typeof document !== "undefined") {
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else if (newTheme === "light") {
          document.documentElement.classList.remove("dark");
        }
      }
    }
    onChange?.(newTheme);
  };

  const isDark = activeTheme === "dark";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => handleToggle(isDark ? "light" : "dark")}
        className={cn(
          "relative flex items-center justify-center rounded-xl border border-border/80 bg-card hover:bg-muted/60 text-foreground transition-all duration-200 cursor-pointer shadow-xs",
          size === "sm" ? "w-8 h-8" : size === "lg" ? "w-11 h-11" : "w-9 h-9",
          className
        )}
        title={\`Switch to \${isDark ? "light" : "dark"} theme\`}
        aria-label="Toggle theme"
      >
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon className={size === "sm" ? "w-3.5 h-3.5 text-primary" : "w-4.5 h-4.5 text-primary"} />
          ) : (
            <Sun className={size === "sm" ? "w-3.5 h-3.5 text-amber-500" : "w-4.5 h-4.5 text-amber-500"} />
          )}
        </motion.div>
      </button>
    );
  }

  if (variant === "segmented") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 p-1 rounded-xl border border-border/80 bg-muted/40 backdrop-blur-md shadow-xs",
          className
        )}
      >
        {(["light", "dark", "system"] as const).map((t) => {
          const isActive = activeTheme === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => handleToggle(t)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-card text-foreground shadow-xs border border-border/60 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "light" && <Sun className="w-3.5 h-3.5 text-amber-500" />}
              {t === "dark" && <Moon className="w-3.5 h-3.5 text-primary" />}
              {t === "system" && <Monitor className="w-3.5 h-3.5 text-muted-foreground" />}
              {showLabel && <span>{t}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Pill toggle
  const dimensions =
    size === "sm"
      ? { track: "w-11 h-6", thumb: "w-4.5 h-4.5", icon: "w-2.5 h-2.5" }
      : size === "lg"
      ? { track: "w-16 h-9", thumb: "w-7 h-7", icon: "w-4 h-4" }
      : { track: "w-14 h-7.5", thumb: "w-5.5 h-5.5", icon: "w-3 h-3" };

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={() => handleToggle(isDark ? "light" : "dark")}
        className={cn(
          "relative rounded-full transition-colors duration-300 border border-border/80 shadow-xs cursor-pointer p-0.75",
          isDark ? "bg-zinc-900 border-primary/40" : "bg-zinc-200 dark:bg-zinc-800",
          dimensions.track
        )}
        title={\`Switch to \${isDark ? "light" : "dark"} mode\`}
        aria-label="Toggle dark mode"
      >
        <motion.div
          animate={{
            x: isDark ? (size === "sm" ? 20 : size === "lg" ? 28 : 25) : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "rounded-full bg-white shadow-md flex items-center justify-center transition-colors",
            dimensions.thumb
          )}
        >
          {isDark ? (
            <Moon className={cn(dimensions.icon, "text-zinc-900")} />
          ) : (
            <Sun className={cn(dimensions.icon, "text-amber-500")} />
          )}
        </motion.div>
      </button>

      {showLabel && (
        <span className="text-xs font-semibold text-foreground/90 capitalize select-none">
          {activeTheme} mode
        </span>
      )}
    </div>
  );
}
`
};

// src/registry/data-display.ts
var dataDisplay = {
  name: "data-display",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  componentsDependencies: [
    "button",
    "avatar"
  ],
  fileName: "data-display.tsx",
  content: `"use client"

import * as React from "react"
import { Check, Copy, type LucideIcon } from "lucide-react"
import { cn } from "../utils/cn"
import { Button } from "./button"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

// 1. Kbd - Keyboard shortcut component
export function Kbd({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}

// 2. AvatarGroup - Overlapping avatars
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F limit
   * @default undefined
   */
  limit?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F items
   * @default undefined
   */
  items: { src?: string; fallback: string }[]
}

export function AvatarGroup({ items, limit = 3, className, ...props }: AvatarGroupProps) {
  const visibleItems = items.slice(0, limit)
  const remaining = items.length - limit

  return (
    <div className={cn("flex -space-x-3 items-center", className)} {...props}>
      {visibleItems.map((item, index) => (
        <Avatar key={index} className="border-2 border-background w-8 h-8">
          {item.src && <AvatarImage src={item.src} />}
          <AvatarFallback>{item.fallback}</AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border-2 border-background text-xs font-medium">
          +{remaining}
        </div>
      )}
    </div>
  )
}

// 3. StatCard - Individual stat card
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F title
   * @default undefined
   */
  title: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F value
   * @default undefined
   */
  value: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F description
   * @default undefined
   */
  description?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F icon
   * @default undefined
   */
  icon?: LucideIcon
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F trend
   * @default undefined
   */
  trend?: {
    /**
     * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F value
     * @default undefined
     */
    value: string
    /**
     * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F positive
     * @default undefined
     */
    positive: boolean
  }
}

export function StatCard({ title, value, description, icon: Icon, trend, className, ...props }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded-full",
                  trend.positive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}
              >
                {trend.positive ? "+" : "-"}{trend.value}
              </span>
            )}
          </div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {Icon && (
          <div className="p-2 bg-muted rounded-md">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}

// 4. Timeline - Vertical timeline
interface TimelineItem {
  title: string
  description: string
  time: string
  status?: "completed" | "current" | "upcoming"
}

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      {items.map((item, index) => (
        <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
          {index !== items.length - 1 && (
            <div className="absolute left-[11px] top-4 h-full w-0.5 bg-border" />
          )}
          <div
            className={cn(
              "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
              item.status === "completed" && "border-primary bg-primary text-primary-foreground",
              item.status === "current" && "border-primary bg-background",
              item.status === "upcoming" && "border-border bg-muted"
            )}
          >
            {item.status === "completed" && <Check className="h-3 w-3" />}
            {item.status === "current" && <div className="h-2 w-2 rounded-full bg-primary" />}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{item.title}</h4>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// 5. CodeBlock - Code block with copy button
interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F code
   * @default undefined
   */
  code: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F language
   * @default undefined
   */
  language?: string
}

export function CodeBlock({ code, language, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative rounded-lg border bg-muted/50 p-4 font-mono text-sm overflow-hidden", className)} {...props}>
      <div className="absolute right-4 top-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      {language && (
        <div className="absolute left-4 top-2 text-xs text-muted-foreground uppercase">
          {language}
        </div>
      )}
      <pre className={cn("overflow-x-auto", language && "pt-6")}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

// 6. PricingCard - Premium pricing card
interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F title
   * @default undefined
   */
  title: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F price
   * @default undefined
   */
  price: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F description
   * @default undefined
   */
  description: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F features
   * @default undefined
   */
  features: string[]
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F buttonText
   * @default undefined
   */
  buttonText?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F popular
   * @default undefined
   */
  popular?: boolean
}

export function PricingCard({ title, price, description, features, buttonText = "Get Started", popular = false, className, ...props }: PricingCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 flex flex-col justify-between relative",
        popular && "border-primary shadow-lg shadow-primary/5",
        className
      )}
      {...props}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <div>
        <div className="space-y-1.5 mb-6">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="mb-6">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">/mo</span>
        </div>
        <ul className="space-y-3 mb-6 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button variant={popular ? "default" : "outline"} className="w-full">
        {buttonText}
      </Button>
    </div>
  )
}

// 7. Divider - Simple divider line
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The orientation of the divider
   * @default "horizontal"
   */
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F orientation
   * @default undefined
   */
  orientation?: "horizontal" | "vertical";
}

export function Divider({ orientation = "horizontal", className, ...props }: DividerProps) {
  return (
    <div
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
      {...props}
    />
  );
}
`
};

// src/registry/dialog.ts
var dialog = {
  name: "dialog",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "lucide-react",
    "@radix-ui/react-dialog"
  ],
  fileName: "dialog.tsx",
  content: `"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"

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

const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background/95 backdrop-blur-md p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:scale-95 data-[state=open]:scale-100 data-[state=closed]:translate-y-[-48%] data-[state=open]:translate-y-[-50%] rounded-2xl",
  {
    variants: {
      variant: {
        default: "border-border/50",
        glass: "bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl",
        destructive: "border-destructive/20",
        success: "border-green-500/20",
        fullscreen: "max-w-full h-screen rounded-none",
        drawer: "sm:max-w-full sm:h-[50vh] sm:rounded-b-none sm:rounded-t-[20px] fixed bottom-0 top-auto translate-y-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        full: "max-w-[95vw] md:max-w-[90vw]",
      },
      scrollable: {
        true: "max-h-[80vh] overflow-y-auto",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
      scrollable: false,
    },
  }
)

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, variant, size, scrollable, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ variant, size, scrollable, className }))}
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
      "text-xl font-semibold leading-none tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent",
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
`
};

// src/registry/dock.ts
var dock = {
  name: "dock",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "dock.tsx",
  content: `"use client"

import React, { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "../utils/cn"

export interface DockProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F items
   * @default undefined
   */
  items: {
    /**
     * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F icon
     * @default undefined
     */
    icon: React.ReactNode
    /**
     * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F label
     * @default undefined
     */
    label: string
    /**
     * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F onClick
     * @default undefined
     */
    onClick?: () => void
  }[]
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F magnification
   * @default undefined
   */
  magnification?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F distance
   * @default undefined
   */
  distance?: number
}

export function Dock({
  items,
  className,
  magnification = 60,
  distance = 140,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const numMagnification = Number(magnification) || 60;
  const numDistance = Number(distance) || 140;

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-14 items-end gap-3 rounded-2xl border border-border bg-background/80 px-4 pb-2 backdrop-blur-md",
        className
      )}
    >
      {items.map((item, i) => (
        <DockIcon key={i} mouseX={mouseX} magnification={numMagnification} distance={numDistance} {...item} />
      ))}
    </motion.div>
  )
}

function DockIcon({
  mouseX,
  magnification,
  distance,
  icon,
  label,
  onClick,
}: {
  mouseX: any
  magnification: number
  distance: number
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const numDistance = Number(distance) || 140
  const numMagnification = Number(magnification) || 60

  const distanceVal = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(
    distanceVal,
    [-numDistance, 0, numDistance],
    [40, numMagnification, 40]
  )

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-muted/80 hover:bg-accent transition-colors"
      onClick={onClick}
      title={label}
    >
      <div className="flex items-center justify-center text-foreground">
        {icon}
      </div>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        {label}
      </span>
    </motion.div>
  )
}
`
};

// src/registry/file-upload.ts
var fileUpload = {
  name: "file-upload",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  componentsDependencies: [
    "button"
  ],
  fileName: "file-upload.tsx",
  content: `"use client"

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
          setError(\`File "\${file.name}" exceeds the maximum allowed size of \${(maxSize / (1024 * 1024)).toFixed(0)}MB.\`)
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
              return file.type.startsWith(\`\${baseType}/\`)
            }
            return file.type === type
          })

          if (!isAccepted) {
            setError(\`File type for "\${file.name}" is not supported.\`)
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Select File{multiple ? "s" : ""}</p>
                <p className="text-xs text-muted-foreground">
                  {accept ? \`Supports: \${accept}\` : "Any file"} (Max: {(maxSize / (1024 * 1024)).toFixed(0)}MB)
                </p>
              </div>
            </div>
            <Button variant="default" onClick={triggerFileInput} className="flex items-center gap-2 shrink-0">
              <UploadCloud className="h-4 w-4" />
              <span>Browse Files</span>
            </Button>
          </div>
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
                  {accept ? \`Supports: \${accept}\` : "All files supported"} (Max: {(maxSize / (1024 * 1024)).toFixed(0)}MB)
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
`
};

// src/registry/frost-hover-card.ts
var frostHoverCard = {
  name: "frost-hover-card",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "frost-hover-card.tsx",
  content: '"use client";\n\nimport * as React from "react";\nimport { useState, useRef, useEffect, useCallback, useId } from "react";\nimport { cn } from "../utils/cn";\nimport { Eye, EyeOff, Droplets } from "lucide-react";\n\nexport interface FrostHoverCardProps extends React.HTMLAttributes<HTMLDivElement> {\n  /**\n   * Transparent PNG image URL of the product or object.\n   */\n  src: string;\n  /**\n   * Card title or product name.\n   */\n  title?: string;\n  /**\n   * Secondary label or subtitle.\n   */\n  subtitle?: string;\n  /**\n   * Optional price string.\n   */\n  price?: string;\n  /**\n   * Badge text displayed at top of card.\n   */\n  badge?: string;\n  /**\n   * Card width in pixels or CSS dimension string.\n   * @default 360\n   */\n  cardWidth?: number | string;\n  /**\n   * Card height in pixels or CSS dimension string.\n   * @default 480\n   */\n  cardHeight?: number | string;\n  /**\n   * Radius in pixels of the wiped clear circular viewport under the cursor.\n   * @default 110\n   */\n  wipeRadius?: number;\n  /**\n   * Backdrop blur strength in pixels applied to the steamed glass layer.\n   * @default 16\n   */\n  blurAmount?: number;\n}\n\n/**\n * FrostHoverCard\n *\n * Luxury product showcase card concealed behind a steamed frosted glass overlay.\n * Moving the cursor dynamically wipes away the frost with realistic radial gradient\n * mask physics, and smoothly steams back up once the pointer departs.\n */\nexport const FrostHoverCard = React.forwardRef<HTMLDivElement, FrostHoverCardProps>(\n  (\n    {\n      src,\n      title = "Aero Stealth H1",\n      subtitle = "CONDENSATION SEALED \u2022 ACTIVE ANC",\n      price = "$780",\n      badge = "Frosted Vapor",\n      cardWidth = 360,\n      cardHeight = 480,\n      wipeRadius = 110,\n      blurAmount = 16,\n      className,\n      style,\n      ...props\n    },\n    ref\n  ) => {\n    const cardId = useId();\n    const containerRef = useRef<HTMLDivElement>(null);\n    const frostLayerRef = useRef<HTMLDivElement>(null);\n\n    const targetRadiusRef = useRef(0);\n    const currRadiusRef = useRef(0);\n    const animFrameRef = useRef<number | null>(null);\n\n    const [isForceWiped, setIsForceWiped] = useState(false);\n    const [wipePercent, setWipePercent] = useState(0);\n\n    // Physics Animation Loop for Frost Hole Smooth Growth & Decay\n    useEffect(() => {\n      let isRunning = true;\n\n      const physicsLoop = () => {\n        if (!isRunning) return;\n\n        const effectiveTarget = isForceWiped ? 1200 : targetRadiusRef.current;\n        const delta = effectiveTarget - currRadiusRef.current;\n\n        // Smooth spring/lerp easing for radius\n        currRadiusRef.current += delta * 0.16;\n\n        if (frostLayerRef.current) {\n          const r = Math.max(0, currRadiusRef.current);\n          frostLayerRef.current.style.setProperty("--r", `${r.toFixed(1)}px`);\n        }\n\n        const pct = isForceWiped\n          ? 100\n          : Math.min(100, Math.max(0, Math.round((currRadiusRef.current / wipeRadius) * 100)));\n        setWipePercent(pct);\n\n        animFrameRef.current = requestAnimationFrame(physicsLoop);\n      };\n\n      animFrameRef.current = requestAnimationFrame(physicsLoop);\n\n      return () => {\n        isRunning = false;\n        if (animFrameRef.current) {\n          cancelAnimationFrame(animFrameRef.current);\n        }\n      };\n    }, [isForceWiped, wipeRadius]);\n\n    // Pointer Wipe Handlers\n    const handlePointerMove = useCallback(\n      (e: React.PointerEvent<HTMLDivElement>) => {\n        if (!containerRef.current || isForceWiped) return;\n        const rect = containerRef.current.getBoundingClientRect();\n\n        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));\n        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));\n\n        const xPct = (x / rect.width) * 100;\n        const yPct = (y / rect.height) * 100;\n\n        if (frostLayerRef.current) {\n          frostLayerRef.current.style.setProperty("--mx", `${xPct.toFixed(1)}%`);\n          frostLayerRef.current.style.setProperty("--my", `${yPct.toFixed(1)}%`);\n        }\n\n        targetRadiusRef.current = wipeRadius;\n      },\n      [isForceWiped, wipeRadius]\n    );\n\n    const handlePointerLeave = useCallback(() => {\n      if (!isForceWiped) {\n        targetRadiusRef.current = 0;\n      }\n    }, [isForceWiped]);\n\n    return (\n      <div\n        ref={ref}\n        className={cn("group flex flex-col items-center select-none", className)}\n        style={{\n          width: typeof cardWidth === "number" ? `${cardWidth}px` : cardWidth,\n          ...style,\n        }}\n        {...props}\n      >\n        <div\n          ref={containerRef}\n          onPointerMove={handlePointerMove}\n          onPointerLeave={handlePointerLeave}\n          className="relative w-full rounded-2xl p-5 border border-white/10 bg-[hsl(225_12%_7%)] hover:border-white/20 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col justify-between cursor-crosshair"\n          style={{\n            minHeight: typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight,\n          }}\n        >\n          {/* Subtle Backstage Ambient Atmosphere */}\n          <div className="absolute -top-24 left-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />\n          <div className="absolute -bottom-24 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />\n\n          {/* Base Product Visual */}\n          <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none select-none">\n            <img\n              src={src}\n              alt={title}\n              className="max-w-full max-h-[260px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] transform transition-transform duration-500 group-hover:scale-105"\n            />\n          </div>\n\n          {/* Steamed / Frosted Glass Overlay with dynamic mask hole */}\n          <div\n            ref={frostLayerRef}\n            className="absolute inset-0 pointer-events-none z-10 transition-[backdrop-filter] duration-300"\n            style={{\n              backdropFilter: `blur(${blurAmount}px) saturate(125%)`,\n              WebkitBackdropFilter: `blur(${blurAmount}px) saturate(125%)`,\n              backgroundColor: "rgba(9, 11, 16, 0.52)",\n              maskImage:\n                "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), transparent 0px, transparent var(--r, 0px), black calc(var(--r, 0px) + 55px))",\n              WebkitMaskImage:\n                "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), transparent 0px, transparent var(--r, 0px), black calc(var(--r, 0px) + 55px))",\n            }}\n          >\n            {/* Fine Condensation Droplets Texture Grid */}\n            <div\n              className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"\n              style={{\n                backgroundImage:\n                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 2px, transparent 2px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25) 1.5px, transparent 1.5px)",\n                backgroundSize: "28px 28px, 48px 48px, 36px 36px",\n              }}\n            />\n\n            {/* Steamy Vignette Edge */}\n            <div\n              className="absolute inset-0 pointer-events-none"\n              style={{\n                background:\n                  "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 60%, rgba(9,11,16,0.4) 100%)",\n              }}\n            />\n          </div>\n\n          {/* Top Header Plate */}\n          <div className="relative z-20 flex items-center justify-between">\n            <div className="flex items-center gap-2">\n              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />\n              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400/90">\n                {badge}\n              </span>\n            </div>\n\n            {/* Force Wipe Toggle */}\n            <button\n              type="button"\n              onClick={() => setIsForceWiped(!isForceWiped)}\n              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-all cursor-pointer active:scale-95"\n              title="Toggle full glass wipe"\n            >\n              {isForceWiped ? (\n                <>\n                  <EyeOff className="w-3 h-3 text-cyan-400" />\n                  <span>Steam Up</span>\n                </>\n              ) : (\n                <>\n                  <Eye className="w-3 h-3 text-emerald-400" />\n                  <span>Wipe All</span>\n                </>\n              )}\n            </button>\n          </div>\n\n          {/* Center Hint (Fades when wiped) */}\n          <div\n            className="relative z-20 my-auto pointer-events-none text-center transition-opacity duration-300"\n            style={{ opacity: wipePercent > 35 ? 0 : 0.8 }}\n          >\n            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[10px] font-mono text-zinc-400">\n              <Droplets className="w-3 h-3 text-cyan-400 animate-pulse" />\n              <span>Hover to wipe condensation</span>\n            </div>\n          </div>\n\n          {/* Bottom Card Typographic Plate */}\n          <div className="relative z-20 border-t border-white/8 pt-4">\n            <div className="flex items-baseline justify-between mb-1">\n              <h3 className="text-base font-semibold text-white tracking-tight">\n                {title}\n              </h3>\n              {price && (\n                <span className="text-sm font-mono font-bold text-emerald-400">\n                  {price}\n                </span>\n              )}\n            </div>\n\n            <div className="flex items-center justify-between">\n              <p className="text-xs text-zinc-400 font-mono tracking-wide">\n                {subtitle}\n              </p>\n              <span className="text-[10px] font-mono text-zinc-500">\n                {isForceWiped ? "100% Clear" : `${wipePercent}% Wiped`}\n              </span>\n            </div>\n          </div>\n        </div>\n      </div>\n    );\n  }\n);\n\nFrostHoverCard.displayName = "FrostHoverCard";\n'
};

// src/registry/glass-shatter-card.ts
var glassShatterCard = {
  name: "glass-shatter-card",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "glass-shatter-card.tsx",
  content: '"use client";\n\nimport * as React from "react";\nimport { useState, useRef, useEffect, useCallback, useId } from "react";\nimport { cn } from "../utils/cn";\nimport { Zap, RotateCcw } from "lucide-react";\n\nexport interface GlassShatterCardProps extends React.HTMLAttributes<HTMLDivElement> {\n  /**\n   * Transparent PNG image URL of the product or object.\n   */\n  src: string;\n  /**\n   * Card title or product name.\n   */\n  title?: string;\n  /**\n   * Secondary label or subtitle.\n   */\n  subtitle?: string;\n  /**\n   * Optional price string.\n   */\n  price?: string;\n  /**\n   * Badge text displayed at top of card.\n   */\n  badge?: string;\n  /**\n   * Card width in pixels or CSS dimension string.\n   * @default 360\n   */\n  cardWidth?: number | string;\n  /**\n   * Card height in pixels or CSS dimension string.\n   * @default 480\n   */\n  cardHeight?: number | string;\n  /**\n   * Number of grid columns for triangular glass shard subdivision.\n   * @default 5\n   */\n  gridCols?: number;\n  /**\n   * Number of grid rows for triangular glass shard subdivision.\n   * @default 6\n   */\n  gridRows?: number;\n  /**\n   * Jitter displacement factor for jagged internal vertices (0.1 to 0.45).\n   * @default 0.35\n   */\n  jitterAmount?: number;\n  /**\n   * Explosion impulse force magnitude on click.\n   * @default 11\n   */\n  shatterForce?: number;\n  /**\n   * Downward gravitational acceleration acting on floating shards.\n   * @default 0.36\n   */\n  gravity?: number;\n  /**\n   * Delay in milliseconds before shards automatically spring back together.\n   * @default 1600\n   */\n  autoRestoreDelay?: number;\n}\n\ninterface Point {\n  x: number;\n  y: number;\n}\n\ninterface Shard {\n  p0: Point;\n  p1: Point;\n  p2: Point;\n  cx: number;\n  cy: number;\n  x: number;\n  y: number;\n  rot: number;\n  vx: number;\n  vy: number;\n  vrot: number;\n}\n\n/**\n * GlassShatterCard\n *\n * Luxury showcase card where the product is subdivided into an irregular watertight\n * mesh of glass shards with zero gaps at rest. Clicking triggers an explosive shatter\n * with gravity and rotation physics, followed by an organic spring return.\n */\nexport const GlassShatterCard = React.forwardRef<HTMLDivElement, GlassShatterCardProps>(\n  (\n    {\n      src,\n      title = "Prism Chronometer",\n      subtitle = "SHATTERED SAPPHIRE CRYSTAL",\n      price = "$1,890",\n      badge = "Glass Physics",\n      cardWidth = 360,\n      cardHeight = 480,\n      gridCols = 5,\n      gridRows = 6,\n      jitterAmount = 0.35,\n      shatterForce = 11,\n      gravity = 0.36,\n      autoRestoreDelay = 1600,\n      className,\n      style,\n      ...props\n    },\n    ref\n  ) => {\n    const cardId = useId();\n    const containerRef = useRef<HTMLDivElement>(null);\n    const canvasRef = useRef<HTMLCanvasElement | null>(null);\n    const imageRef = useRef<HTMLImageElement | null>(null);\n    const shardsRef = useRef<Shard[]>([]);\n    const animFrameRef = useRef<number | null>(null);\n    const restoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);\n\n    const isShatteredRef = useRef(false);\n    const isReturningRef = useRef(false);\n    const [isShatteredState, setIsShatteredState] = useState(false);\n    const [isLoaded, setIsLoaded] = useState(false);\n\n    // Build watertight jagged shard mesh\n    const buildMesh = useCallback(\n      (width: number, height: number, dpr: number) => {\n        const cols = Math.max(3, gridCols);\n        const rows = Math.max(3, gridRows);\n        const cellW = width / cols;\n        const cellH = height / rows;\n\n        // 1. Generate grid vertices with shared interior jitter\n        const vertices: Point[][] = [];\n        for (let r = 0; r <= rows; r++) {\n          vertices[r] = [];\n          for (let c = 0; c <= cols; c++) {\n            let vx = c * cellW;\n            let vy = r * cellH;\n\n            // Apply jitter only to interior vertices to keep rectangular outer boundaries watertight\n            if (c > 0 && c < cols && r > 0 && r < rows) {\n              const jx = (Math.random() - 0.5) * cellW * jitterAmount;\n              const jy = (Math.random() - 0.5) * cellH * jitterAmount;\n              vx += jx;\n              vy += jy;\n            }\n\n            vertices[r][c] = { x: vx * dpr, y: vy * dpr };\n          }\n        }\n\n        // 2. Generate triangular shards with shared vertices\n        const shards: Shard[] = [];\n        for (let r = 0; r < rows; r++) {\n          for (let c = 0; c < cols; c++) {\n            const p00 = vertices[r][c];\n            const p10 = vertices[r][c + 1];\n            const p11 = vertices[r + 1][c + 1];\n            const p01 = vertices[r + 1][c];\n\n            const alternateDiag = (r + c) % 2 === 0;\n\n            if (alternateDiag) {\n              // Diagonal from p00 to p11\n              const t1_cx = (p00.x + p10.x + p11.x) / 3;\n              const t1_cy = (p00.y + p10.y + p11.y) / 3;\n              shards.push({\n                p0: p00,\n                p1: p10,\n                p2: p11,\n                cx: t1_cx,\n                cy: t1_cy,\n                x: 0,\n                y: 0,\n                rot: 0,\n                vx: 0,\n                vy: 0,\n                vrot: 0,\n              });\n\n              const t2_cx = (p00.x + p11.x + p01.x) / 3;\n              const t2_cy = (p00.y + p11.y + p01.y) / 3;\n              shards.push({\n                p0: p00,\n                p1: p11,\n                p2: p01,\n                cx: t2_cx,\n                cy: t2_cy,\n                x: 0,\n                y: 0,\n                rot: 0,\n                vx: 0,\n                vy: 0,\n                vrot: 0,\n              });\n            } else {\n              // Diagonal from p10 to p01\n              const t1_cx = (p00.x + p10.x + p01.x) / 3;\n              const t1_cy = (p00.y + p10.y + p01.y) / 3;\n              shards.push({\n                p0: p00,\n                p1: p10,\n                p2: p01,\n                cx: t1_cx,\n                cy: t1_cy,\n                x: 0,\n                y: 0,\n                rot: 0,\n                vx: 0,\n                vy: 0,\n                vrot: 0,\n              });\n\n              const t2_cx = (p10.x + p11.x + p01.x) / 3;\n              const t2_cy = (p10.y + p11.y + p01.y) / 3;\n              shards.push({\n                p0: p10,\n                p1: p11,\n                p2: p01,\n                cx: t2_cx,\n                cy: t2_cy,\n                x: 0,\n                y: 0,\n                rot: 0,\n                vx: 0,\n                vy: 0,\n                vrot: 0,\n              });\n            }\n          }\n        }\n\n        shardsRef.current = shards;\n      },\n      [gridCols, gridRows, jitterAmount]\n    );\n\n    // Load Image\n    useEffect(() => {\n      if (!src) return;\n      let cancelled = false;\n      setIsLoaded(false);\n\n      const img = new Image();\n      img.crossOrigin = "anonymous";\n      img.src = src;\n\n      img.onload = () => {\n        if (cancelled) return;\n        imageRef.current = img;\n\n        const canvas = canvasRef.current;\n        if (!canvas) return;\n\n        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;\n        const displayW = canvas.clientWidth || 320;\n        const displayH = canvas.clientHeight || 280;\n\n        canvas.width = displayW * dpr;\n        canvas.height = displayH * dpr;\n\n        buildMesh(displayW, displayH, dpr);\n        setIsLoaded(true);\n      };\n\n      return () => {\n        cancelled = true;\n      };\n    }, [src, buildMesh]);\n\n    // Shatter explosion trigger\n    const triggerShatter = useCallback(\n      (clientX?: number, clientY?: number) => {\n        const canvas = canvasRef.current;\n        if (!canvas || !imageRef.current) return;\n\n        if (restoreTimerRef.current) {\n          clearTimeout(restoreTimerRef.current);\n        }\n\n        const rect = canvas.getBoundingClientRect();\n        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;\n\n        const clickX = clientX !== undefined ? (clientX - rect.left) * dpr : canvas.width / 2;\n        const clickY = clientY !== undefined ? (clientY - rect.top) * dpr : canvas.height / 2;\n\n        const shards = shardsRef.current;\n        const force = shatterForce * dpr;\n\n        for (let i = 0; i < shards.length; i++) {\n          const s = shards[i];\n          const dx = s.cx - clickX;\n          const dy = s.cy - clickY;\n          const dist = Math.sqrt(dx * dx + dy * dy) + 1;\n\n          const impulse = (force * (0.8 + Math.random() * 0.6)) / Math.max(1, dist * 0.015);\n          s.vx = (dx / dist) * impulse + (Math.random() - 0.5) * 5 * dpr;\n          s.vy = (dy / dist) * impulse - (3 + Math.random() * 7) * dpr;\n          s.vrot = (Math.random() - 0.5) * 0.32;\n        }\n\n        isShatteredRef.current = true;\n        isReturningRef.current = false;\n        setIsShatteredState(true);\n\n        // Schedule organic spring return\n        restoreTimerRef.current = setTimeout(() => {\n          isReturningRef.current = true;\n        }, autoRestoreDelay);\n      },\n      [shatterForce, autoRestoreDelay]\n    );\n\n    // Canvas Physics Animation Loop\n    useEffect(() => {\n      const canvas = canvasRef.current;\n      if (!canvas) return;\n      const ctx = canvas.getContext("2d");\n      if (!ctx) return;\n\n      let isRunning = true;\n\n      const render = () => {\n        if (!isRunning) return;\n\n        const img = imageRef.current;\n        const shards = shardsRef.current;\n        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;\n\n        ctx.clearRect(0, 0, canvas.width, canvas.height);\n\n        if (img && isLoaded && shards.length > 0) {\n          // Scale image to fit canvas proportionally with margins\n          const padding = 20 * dpr;\n          const maxW = canvas.width - padding * 2;\n          const maxH = canvas.height - padding * 2;\n          const scale = Math.min(maxW / img.width, maxH / img.height);\n          const drawW = img.width * scale;\n          const drawH = img.height * scale;\n          const offsetX = (canvas.width - drawW) / 2;\n          const offsetY = (canvas.height - drawH) / 2;\n\n          let allSettled = true;\n          const grav = gravity * dpr;\n\n          for (let i = 0; i < shards.length; i++) {\n            const s = shards[i];\n\n            // 1. Physics Integration\n            if (isShatteredRef.current) {\n              if (isReturningRef.current) {\n                // Spring pull towards origin (0, 0, 0)\n                const springStiffness = 0.09;\n                const springDamping = 0.85;\n\n                s.vx += (0 - s.x) * springStiffness;\n                s.vy += (0 - s.y) * springStiffness;\n                s.vrot += (0 - s.rot) * springStiffness;\n\n                s.vx *= springDamping;\n                s.vy *= springDamping;\n                s.vrot *= springDamping;\n\n                s.x += s.vx;\n                s.y += s.vy;\n                s.rot += s.vrot;\n\n                if (\n                  Math.abs(s.x) > 0.3 ||\n                  Math.abs(s.y) > 0.3 ||\n                  Math.abs(s.rot) > 0.01\n                ) {\n                  allSettled = false;\n                } else {\n                  s.x = 0;\n                  s.y = 0;\n                  s.rot = 0;\n                  s.vx = 0;\n                  s.vy = 0;\n                  s.vrot = 0;\n                }\n              } else {\n                // Explosive flight with gravity\n                s.vy += grav;\n                s.vx *= 0.985;\n                s.x += s.vx;\n                s.y += s.vy;\n                s.rot += s.vrot;\n                allSettled = false;\n              }\n            }\n\n            // 2. Render Shard\n            ctx.save();\n            ctx.translate(s.cx + s.x, s.cy + s.y);\n            if (s.rot !== 0) {\n              ctx.rotate(s.rot);\n            }\n\n            ctx.beginPath();\n            ctx.moveTo(s.p0.x - s.cx, s.p0.y - s.cy);\n            ctx.lineTo(s.p1.x - s.cx, s.p1.y - s.cy);\n            ctx.lineTo(s.p2.x - s.cx, s.p2.y - s.cy);\n            ctx.closePath();\n\n            ctx.clip();\n            ctx.drawImage(img, offsetX - s.cx, offsetY - s.cy, drawW, drawH);\n\n            // Shard reflection highlight edge when detached\n            if (s.x !== 0 || s.y !== 0) {\n              ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";\n              ctx.lineWidth = 1 * dpr;\n              ctx.stroke();\n            }\n\n            ctx.restore();\n          }\n\n          if (isShatteredRef.current && isReturningRef.current && allSettled) {\n            isShatteredRef.current = false;\n            isReturningRef.current = false;\n            setIsShatteredState(false);\n          }\n        }\n\n        animFrameRef.current = requestAnimationFrame(render);\n      };\n\n      animFrameRef.current = requestAnimationFrame(render);\n\n      return () => {\n        isRunning = false;\n        if (animFrameRef.current) {\n          cancelAnimationFrame(animFrameRef.current);\n        }\n      };\n    }, [gravity, isLoaded]);\n\n    return (\n      <div\n        ref={ref}\n        className={cn("group flex flex-col items-center select-none", className)}\n        style={{\n          width: typeof cardWidth === "number" ? `${cardWidth}px` : cardWidth,\n          ...style,\n        }}\n        {...props}\n      >\n        <div\n          ref={containerRef}\n          onClick={(e) => triggerShatter(e.clientX, e.clientY)}\n          className="relative w-full rounded-2xl p-5 border border-white/10 bg-[hsl(225_12%_7%)] hover:border-amber-400/30 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col justify-between cursor-pointer"\n          style={{\n            minHeight: typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight,\n          }}\n        >\n          {/* Subtle Ambient Radial Glow */}\n          <div className="absolute -top-24 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />\n          <div className="absolute -bottom-24 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />\n\n          {/* Top Header Plate */}\n          <div className="relative z-10 flex items-center justify-between pointer-events-none">\n            <div className="flex items-center gap-2">\n              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />\n              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400/90">\n                {badge}\n              </span>\n            </div>\n\n            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/8">\n              <Zap className="w-3 h-3 text-amber-400" />\n              <span>{isShatteredState ? "Shattered" : "Click to Shatter"}</span>\n            </div>\n          </div>\n\n          {/* Center Stage: Interactive Shard Canvas */}\n          <div className="relative w-full h-[260px] my-auto flex items-center justify-center">\n            <canvas\n              ref={canvasRef}\n              className="w-full h-full"\n            />\n          </div>\n\n          {/* Bottom Card Typographic Plate */}\n          <div className="relative z-10 border-t border-white/8 pt-4 pointer-events-none">\n            <div className="flex items-baseline justify-between mb-1">\n              <h3 className="text-base font-semibold text-white tracking-tight">\n                {title}\n              </h3>\n              {price && (\n                <span className="text-sm font-mono font-bold text-amber-400">\n                  {price}\n                </span>\n              )}\n            </div>\n\n            <div className="flex items-center justify-between">\n              <p className="text-xs text-zinc-400 font-mono tracking-wide">\n                {subtitle}\n              </p>\n              <span className="text-[10px] font-mono text-zinc-500">\n                {gridCols * gridRows * 2} shards\n              </span>\n            </div>\n          </div>\n        </div>\n      </div>\n    );\n  }\n);\n\nGlassShatterCard.displayName = "GlassShatterCard";\n'
};

// src/registry/holo-finish-card.ts
var holoFinishCard = {
  name: "holo-finish-card",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "holo-finish-card.tsx",
  content: `"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "../utils/cn";

export interface ProductFinishItem {
  id: string;
  name: string;
  label?: string;
  image: string;
  holoColors: string[];
  price?: string;
  description?: string;
}

export type HoloFinishIntensity = "subtle" | "medium" | "vibrant";

export interface HoloFinishCardProps extends React.HTMLAttributes<HTMLDivElement> {
  finishes: ProductFinishItem[];
  selectedFinishId?: string;
  onSelectFinish?: (finish: ProductFinishItem) => void;
  cardWidth?: number | string;
  cardHeight?: number | string;
  intensity?: HoloFinishIntensity;
  showLabels?: boolean;
  maxTilt?: number;
  perspective?: number;
  elevateZ?: number;
  idleAnimation?: boolean;
  showGlare?: boolean;
  showSwatches?: boolean;
}

export const HoloFinishCard = React.forwardRef<HTMLDivElement, HoloFinishCardProps>(
  (
    {
      finishes,
      selectedFinishId,
      onSelectFinish,
      cardWidth = 360,
      cardHeight = 480,
      intensity = "medium",
      showLabels = true,
      maxTilt = 32,
      perspective = 900,
      elevateZ = 45,
      idleAnimation = true,
      showGlare = true,
      showSwatches = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [internalSelectedId, setInternalSelectedId] = useState<string>(() => {
      return selectedFinishId || (finishes.length > 0 ? finishes[0].id : "");
    });

    const activeId = selectedFinishId ?? internalSelectedId;
    const activeFinish = useMemo(() => {
      const found = finishes.find((f) => f.id === activeId);
      return found || finishes[0] || null;
    }, [finishes, activeId]);

    const handleSelect = useCallback(
      (finish: ProductFinishItem) => {
        if (!selectedFinishId) {
          setInternalSelectedId(finish.id);
        }
        onSelectFinish?.(finish);
      },
      [selectedFinishId, onSelectFinish]
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const foilRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    const rectRef = useRef<DOMRect | null>(null);
    const isHoveringRef = useRef(false);
    const targetPointerRef = useRef({ x: 0.5, y: 0.5 });
    const animFrameRef = useRef<number | null>(null);

    const currentPhysicsRef = useRef({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      holoX: 50,
      holoY: 50,
      glareX: 50,
      glareY: 50,
      glareAlpha: 0,
    });

    const foilOpacity = useMemo(() => {
      switch (intensity) {
        case "subtle":
          return 0.38;
        case "vibrant":
          return 0.85;
        case "medium":
        default:
          return 0.62;
      }
    }, [intensity]);

    const updateRect = useCallback(() => {
      if (cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
    }, []);

    const handlePointerEnter = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        updateRect();
        isHoveringRef.current = true;
        if (rectRef.current) {
          const px = Math.max(0, Math.min(1, (e.clientX - rectRef.current.left) / rectRef.current.width));
          const py = Math.max(0, Math.min(1, (e.clientY - rectRef.current.top) / rectRef.current.height));
          targetPointerRef.current = { x: px, y: py };
        }
      },
      [updateRect]
    );

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (!rectRef.current && cardRef.current) {
        rectRef.current = cardRef.current.getBoundingClientRect();
      }
      if (rectRef.current && rectRef.current.width > 0 && rectRef.current.height > 0) {
        const px = Math.max(0, Math.min(1, (e.clientX - rectRef.current.left) / rectRef.current.width));
        const py = Math.max(0, Math.min(1, (e.clientY - rectRef.current.top) / rectRef.current.height));
        targetPointerRef.current = { x: px, y: py };
      }
    }, []);

    const handlePointerLeave = useCallback(() => {
      isHoveringRef.current = false;
      targetPointerRef.current = { x: 0.5, y: 0.5 };
    }, []);

    useEffect(() => {
      const onResize = () => {
        updateRect();
      };
      window.addEventListener("resize", onResize, { passive: true });
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, [updateRect]);

    useEffect(() => {
      let isMounted = true;

      const loop = (timestamp: number) => {
        if (!isMounted) return;

        const card = cardRef.current;
        const foil = foilRef.current;
        const glare = glareRef.current;
        const p = currentPhysicsRef.current;

        let targetRotX = 0;
        let targetRotY = 0;
        let targetScale = 1;
        let targetHX = 50;
        let targetHY = 50;
        let targetGX = 50;
        let targetGY = 50;
        let targetGA = 0;

        if (isHoveringRef.current) {
          const px = targetPointerRef.current.x;
          const py = targetPointerRef.current.y;

          targetRotY = (px - 0.5) * maxTilt;
          targetRotX = -(py - 0.5) * maxTilt;
          targetScale = 1.025;

          targetHX = px * 100;
          targetHY = py * 100;

          targetGX = px * 100;
          targetGY = py * 100;
          targetGA = intensity === "subtle" ? 0.35 : intensity === "vibrant" ? 0.75 : 0.55;
        } else if (idleAnimation) {
          const time = timestamp * 0.0015;
          targetRotX = Math.sin(time) * 2.5;
          targetRotY = Math.cos(time * 0.8) * 2.5;
          targetScale = 1;

          targetHX = 50 + Math.sin(time * 1.2) * 35;
          targetHY = 50 + Math.cos(time * 0.9) * 35;

          targetGX = 50 + Math.sin(time * 1.2) * 30;
          targetGY = 50 + Math.cos(time * 0.9) * 30;
          targetGA = 0.22;
        } else {
          targetRotX = 0;
          targetRotY = 0;
          targetScale = 1;
          targetHX = 50;
          targetHY = 50;
          targetGX = 50;
          targetGY = 50;
          targetGA = 0;
        }

        const lerpFactor = isHoveringRef.current ? 0.09 : 0.05;
        p.rotateX += (targetRotX - p.rotateX) * lerpFactor;
        p.rotateY += (targetRotY - p.rotateY) * lerpFactor;
        p.scale += (targetScale - p.scale) * lerpFactor;
        p.holoX += (targetHX - p.holoX) * lerpFactor;
        p.holoY += (targetHY - p.holoY) * lerpFactor;
        p.glareX += (targetGX - p.glareX) * lerpFactor;
        p.glareY += (targetGY - p.glareY) * lerpFactor;
        p.glareAlpha += (targetGA - p.glareAlpha) * lerpFactor;

        if (card) {
          card.style.transform = \`rotateX(\${p.rotateX.toFixed(2)}deg) rotateY(\${p.rotateY.toFixed(2)}deg) scale3d(\${p.scale.toFixed(3)}, \${p.scale.toFixed(3)}, \${p.scale.toFixed(3)})\`;
        }

        if (foil) {
          foil.style.backgroundPosition = \`\${p.holoX.toFixed(1)}% \${p.holoY.toFixed(1)}%\`;
        }

        if (glare && showGlare) {
          glare.style.background = \`radial-gradient(circle at \${p.glareX.toFixed(1)}% \${p.glareY.toFixed(1)}%, rgba(255,255,255,\${p.glareAlpha.toFixed(2)}) 0%, rgba(255,255,255,\${(p.glareAlpha * 0.35).toFixed(2)}) 22%, transparent 60%)\`;
        }

        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);

      return () => {
        isMounted = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [maxTilt, idleAnimation, intensity, showGlare]);

    if (!activeFinish) {
      return null;
    }

    const widthStyle = typeof cardWidth === "number" ? \`\${cardWidth}px\` : cardWidth;
    const heightStyle = typeof cardHeight === "number" ? \`\${cardHeight}px\` : cardHeight;
    const primaryFinishColor = activeFinish.holoColors[0] || "#ffffff";
    const finishGradientString = activeFinish.holoColors.join(", ");

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center select-none", className)}
        style={{
          width: widthStyle,
          ...style,
        }}
        {...props}
      >
        <div
          ref={containerRef}
          className="relative w-full"
          style={{
            height: heightStyle,
            perspective: \`\${perspective}px\`,
          }}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div
            ref={cardRef}
            className={cn(
              "relative w-full h-full rounded-3xl overflow-hidden cursor-pointer",
              "border border-black/[0.08] dark:border-white/[0.12]",
              "bg-gradient-to-b from-white via-slate-50 to-slate-100",
              "dark:from-[#151821] dark:via-[#0e1017] dark:to-[#090b10]",
              "shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]",
              "dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_0_rgba(255,255,255,0.12)]",
              "transition-shadow duration-300"
            )}
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
              touchAction: "pan-y",
            }}
            onClick={() => handleSelect(activeFinish)}
          >
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-700 opacity-20 dark:opacity-25"
              style={{
                background: \`radial-gradient(circle at 50% 50%, \${primaryFinishColor} 0%, transparent 65%)\`,
              }}
            />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {showGlare && (
              <div
                ref={glareRef}
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  mixBlendMode: "overlay",
                  zIndex: 20,
                }}
              />
            )}

            {showLabels && (
              <div
                className="absolute top-0 inset-x-0 p-5 sm:p-6 flex items-start justify-between pointer-events-none z-10"
                style={{
                  transform: "translateZ(28px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                    {activeFinish.label || "FINISH SPEC"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shadow-xs"
                      style={{
                        backgroundColor: primaryFinishColor,
                        boxShadow: \`0 0 8px \${primaryFinishColor}\`,
                      }}
                    />
                    <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                      REF. {activeFinish.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>

                {activeFinish.price && (
                  <div className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-xs font-mono font-semibold text-slate-800 dark:text-white">
                    {activeFinish.price}
                  </div>
                )}
              </div>
            )}

            <div
              className="absolute inset-0 flex items-center justify-center p-8 sm:p-10 pointer-events-none"
              style={{
                transform: \`translateZ(\${elevateZ}px)\`,
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src={activeFinish.image}
                alt={activeFinish.name}
                className="relative max-w-full max-h-full object-contain pointer-events-none select-none transition-all duration-500"
                style={{
                  filter:
                    "drop-shadow(0 25px 35px rgba(0,0,0,0.45)) drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
                }}
              />

              <div
                ref={foilRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  backgroundImage: \`linear-gradient(115deg, \${finishGradientString})\`,
                  backgroundSize: "340% 340%",
                  backgroundPosition: "50% 50%",
                  mixBlendMode: "color-dodge",
                  opacity: foilOpacity,
                  WebkitMaskImage: \`url("\${activeFinish.image}")\`,
                  maskImage: \`url("\${activeFinish.image}")\`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  transform: "translateZ(1px)",
                }}
              />
            </div>

            {showLabels && (
              <div
                className="absolute bottom-0 inset-x-0 p-5 sm:p-6 pointer-events-none z-10"
                style={{
                  transform: "translateZ(32px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                      {activeFinish.name}
                    </h3>
                    {activeFinish.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-[240px] leading-relaxed">
                        {activeFinish.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/5 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: primaryFinishColor }}
                    />
                    <span className="text-[10px] font-mono font-medium text-slate-700 dark:text-slate-300 uppercase">
                      Finish
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showSwatches && finishes.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-md max-w-full">
            {finishes.map((finish) => {
              const isSelected = finish.id === activeFinish.id;
              const finishColor = finish.holoColors[0] || "#fff";

              return (
                <button
                  key={finish.id}
                  type="button"
                  onClick={() => handleSelect(finish)}
                  className={cn(
                    "group relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer",
                    isSelected
                      ? "bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs font-semibold border border-black/10 dark:border-white/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5 border border-transparent"
                  )}
                >
                  <span
                    className={cn(
                      "w-3.5 h-3.5 rounded-full transition-transform duration-200 shrink-0",
                      isSelected ? "scale-110 ring-2 ring-offset-1 ring-slate-400 dark:ring-white/40 ring-offset-white dark:ring-offset-black" : "group-hover:scale-105"
                    )}
                    style={{
                      background: \`linear-gradient(135deg, \${finish.holoColors.join(", ")})\`,
                      boxShadow: isSelected ? \`0 0 8px \${finishColor}66\` : "none",
                    }}
                  />
                  <span className="truncate max-w-[120px]">{finish.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

HoloFinishCard.displayName = "HoloFinishCard";
`
};

// src/registry/live-object.ts
var liveObject = {
  name: "live-object",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "live-object.tsx",
  content: '"use client";\n\nimport * as React from "react";\nimport { useState, useRef, useEffect, useCallback, useId, useMemo } from "react";\nimport { cn } from "../utils/cn";\n\nexport interface LiveObjectProps extends React.HTMLAttributes<HTMLDivElement> {\n  /**\n   * Transparent PNG image URL of the object or product silhouette.\n   */\n  src: string;\n  /**\n   * Hex/RGB accent color driving the ignition flash, light streaks, and chromatic aberration.\n   * @default "#38bdf8"\n   */\n  accentColor?: string;\n  /**\n   * Whether ignition intro animation plays automatically once the object enters viewport.\n   * @default true\n   */\n  autoplayIntro?: boolean;\n  /**\n   * Outer container width in pixels or CSS dimension.\n   * @default 440\n   */\n  width?: number | string;\n  /**\n   * Outer container height in pixels or CSS dimension.\n   * @default 480\n   */\n  height?: number | string;\n  /**\n   * Accessibility image alt description.\n   * @default "Live Object"\n   */\n  alt?: string;\n  /**\n   * Maximum 3D tilt angle in degrees during cursor or gyroscope tracking.\n   * @default 30\n   */\n  maxTilt?: number;\n  /**\n   * CSS perspective depth in pixels.\n   * @default 1000\n   */\n  perspective?: number;\n  /**\n   * Whether subtle diagonal ambient light beam sweeps across background every 5-6s.\n   * @default true\n   */\n  ambientSweep?: boolean;\n}\n\ninterface Streak {\n  id: number;\n  angle: number;\n  length: number;\n  width: number;\n  delay: number;\n}\n\n/**\n * LiveObject\n *\n * An interactive physical product presentation component (not a card, but the live object itself).\n * Features a cinematic ignition intro upon entering viewport with radial light streaks,\n * screen flash, and alpha-silhouette RGB glitch. Followed by silky requestAnimationFrame + lerp\n * 3D tilt tracking cursor on desktop or mobile deviceorientation gyroscope with silhouette-masked specular sheen.\n */\nexport const LiveObject = React.forwardRef<HTMLDivElement, LiveObjectProps>(\n  (\n    {\n      src,\n      accentColor = "#38bdf8",\n      autoplayIntro = true,\n      width = 440,\n      height = 480,\n      alt = "Live Object",\n      maxTilt = 30,\n      perspective = 1000,\n      ambientSweep = true,\n      className,\n      style,\n      ...props\n    },\n    ref\n  ) => {\n    const objectId = useId();\n    const containerRef = useRef<HTMLDivElement>(null);\n    const objectWrapperRef = useRef<HTMLDivElement>(null);\n    const glareRef = useRef<HTMLDivElement>(null);\n\n    // Physics coordinates and targets\n    const targetTiltRef = useRef({ x: 0, y: 0 });\n    const currentTiltRef = useRef({ x: 0, y: 0 });\n    const isHoveringRef = useRef(false);\n    const animFrameRef = useRef<number | null>(null);\n\n    // Gyroscope tracking calibration\n    const [gyroSupported, setGyroSupported] = useState(false);\n    const [gyroActive, setGyroActive] = useState(false);\n    const calibRef = useRef<{ beta: number; gamma: number } | null>(null);\n\n    // Phase 1 Intro Ignition State\n    const [introActive, setIntroActive] = useState(false);\n    const [hasPlayedIntro, setHasPlayedIntro] = useState(false);\n    const [flashOpacity, setFlashOpacity] = useState(0);\n    const [glitchOffset, setGlitchOffset] = useState(0);\n    const [scaleBounce, setScaleBounce] = useState(1);\n    const [streaks, setStreaks] = useState<Streak[]>([]);\n\n    // Derive chromatic aberration color pairs from accentColor\n    const { chromaRed, chromaCyan, lightGlow } = useMemo(() => {\n      return {\n        chromaRed: "rgba(255, 40, 75, 0.9)",\n        chromaCyan: accentColor,\n        lightGlow: accentColor,\n      };\n    }, [accentColor]);\n\n    // Check deviceorientation support on mount\n    useEffect(() => {\n      if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {\n        // Detect if mobile / touch device\n        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;\n        if (isTouch) {\n          setGyroSupported(true);\n        }\n      }\n    }, []);\n\n    // Phase 1 Ignition Trigger Function\n    const triggerIgnition = useCallback(() => {\n      setIntroActive(true);\n\n      // 1. Generate 12 radial light streaks\n      const newStreaks: Streak[] = Array.from({ length: 12 }, (_, i) => ({\n        id: i,\n        angle: (i * 360) / 12 + (Math.random() - 0.5) * 22,\n        length: 180 + Math.random() * 140,\n        width: 1.5 + Math.random() * 2.5,\n        delay: Math.random() * 60,\n      }));\n      setStreaks(newStreaks);\n\n      const startTime = performance.now();\n      const introDuration = 700; // ms\n\n      const stepIntro = (time: number) => {\n        const elapsed = time - startTime;\n        const progress = Math.min(1, elapsed / introDuration);\n\n        // A. White Flash: sharp peak opacity ~0.85 at ~10% (first 70ms), then sharp decay\n        if (progress < 0.1) {\n          setFlashOpacity((progress / 0.1) * 0.85);\n        } else {\n          const decayProgress = (progress - 0.1) / 0.9;\n          setFlashOpacity(Math.max(0, 0.85 * Math.pow(1 - decayProgress, 3)));\n        }\n\n        // B. RGB Glitch drop-shadow offset: decays from 16px down to 0 over 0.6s\n        if (progress < 0.85) {\n          const glitchProgress = progress / 0.85;\n          const jitter = (Math.random() - 0.5) * 4;\n          setGlitchOffset(Math.max(0, (1 - glitchProgress) * 16 + jitter));\n        } else {\n          setGlitchOffset(0);\n        }\n\n        // C. Scale Bounce with overshoot: 0.5 -> 1.08 -> 0.96 -> 1.0\n        let s = 1;\n        if (progress < 0.4) {\n          // 0.5 -> 1.08\n          const p = progress / 0.4;\n          s = 0.5 + (1.08 - 0.5) * Math.sin((p * Math.PI) / 2);\n        } else if (progress < 0.75) {\n          // 1.08 -> 0.96\n          const p = (progress - 0.4) / 0.35;\n          s = 1.08 - (1.08 - 0.96) * Math.sin((p * Math.PI) / 2);\n        } else {\n          // 0.96 -> 1.0\n          const p = (progress - 0.75) / 0.25;\n          s = 0.96 + (1.0 - 0.96) * Math.sin((p * Math.PI) / 2);\n        }\n        setScaleBounce(s);\n\n        if (progress < 1) {\n          requestAnimationFrame(stepIntro);\n        } else {\n          setIntroActive(false);\n          setFlashOpacity(0);\n          setGlitchOffset(0);\n          setScaleBounce(1);\n          setStreaks([]);\n        }\n      };\n\n      requestAnimationFrame(stepIntro);\n    }, []);\n\n    // Viewport Intersection Observer for Autoplay Intro\n    useEffect(() => {\n      const container = containerRef.current;\n      if (!container || !autoplayIntro || hasPlayedIntro) return;\n\n      const observer = new IntersectionObserver(\n        (entries) => {\n          for (const entry of entries) {\n            if (entry.isIntersecting && !hasPlayedIntro) {\n              setHasPlayedIntro(true);\n              triggerIgnition();\n              observer.disconnect();\n              break;\n            }\n          }\n        },\n        { threshold: 0.3 }\n      );\n\n      observer.observe(container);\n      return () => observer.disconnect();\n    }, [autoplayIntro, hasPlayedIntro, triggerIgnition]);\n\n    // Request & Listen to Mobile Gyroscope DeviceOrientation\n    const toggleGyro = useCallback(async () => {\n      if (typeof window === "undefined") return;\n\n      const DeviceOrientationEventAny = window.DeviceOrientationEvent as unknown as {\n        requestPermission?: () => Promise<"granted" | "denied">;\n      };\n\n      if (typeof DeviceOrientationEventAny?.requestPermission === "function") {\n        try {\n          const perm = await DeviceOrientationEventAny.requestPermission();\n          if (perm === "granted") {\n            setGyroActive(true);\n            calibRef.current = null;\n          }\n        } catch {\n          // Ignore\n        }\n      } else {\n        // Android / Chromium: Direct listening without explicit requestPermission\n        setGyroActive((prev) => !prev);\n        calibRef.current = null;\n      }\n    }, []);\n\n    useEffect(() => {\n      if (!gyroActive) return;\n\n      const handleOrientation = (e: DeviceOrientationEvent) => {\n        const beta = e.beta ?? 0;\n        const gamma = e.gamma ?? 0;\n\n        // Calibrate reference zero point upon first activation\n        if (!calibRef.current) {\n          calibRef.current = { beta, gamma };\n          return;\n        }\n\n        const deltaGamma = gamma - calibRef.current.gamma;\n        const deltaBeta = beta - calibRef.current.beta;\n\n        // Clamp to \xB1maxTilt\n        const clampedY = Math.max(-maxTilt, Math.min(maxTilt, deltaGamma));\n        const clampedX = Math.max(-maxTilt, Math.min(maxTilt, -deltaBeta));\n\n        targetTiltRef.current = { x: clampedX, y: clampedY };\n      };\n\n      window.addEventListener("deviceorientation", handleOrientation);\n      return () => {\n        window.removeEventListener("deviceorientation", handleOrientation);\n      };\n    }, [gyroActive, maxTilt]);\n\n    // Phase 2 \u2014 Silky rAF + Lerp Physics Loop for 3D Tilt & Specular Sheen\n    useEffect(() => {\n      let isRunning = true;\n      let idleTime = 0;\n\n      const physicsLoop = () => {\n        if (!isRunning) return;\n\n        idleTime += 0.016;\n\n        let tx = targetTiltRef.current.x;\n        let ty = targetTiltRef.current.y;\n\n        // If resting without hover/gyro, add very subtle organic breathing\n        if (!isHoveringRef.current && !gyroActive && !introActive) {\n          tx += Math.sin(idleTime * 1.4) * 3;\n          ty += Math.cos(idleTime * 1.1) * 3.5;\n        }\n\n        // Buttery smooth lerp (0.085)\n        const lerpFactor = 0.085;\n        currentTiltRef.current.x += (tx - currentTiltRef.current.x) * lerpFactor;\n        currentTiltRef.current.y += (ty - currentTiltRef.current.y) * lerpFactor;\n\n        const curX = currentTiltRef.current.x;\n        const curY = currentTiltRef.current.y;\n\n        // Update 3D Object Transform\n        if (objectWrapperRef.current) {\n          objectWrapperRef.current.style.transform = `perspective(${perspective}px) rotateX(${curX.toFixed(\n            2\n          )}deg) rotateY(${curY.toFixed(2)}deg) scale3d(${scaleBounce.toFixed(\n            3\n          )}, ${scaleBounce.toFixed(3)}, ${scaleBounce.toFixed(3)})`;\n        }\n\n        // Update Specular Glare Coordinates (moves synchronized with tilt)\n        if (glareRef.current) {\n          const gx = 50 + (curY / maxTilt) * 45;\n          const gy = 50 - (curX / maxTilt) * 45;\n          glareRef.current.style.setProperty("--gx", `${gx.toFixed(1)}%`);\n          glareRef.current.style.setProperty("--gy", `${gy.toFixed(1)}%`);\n        }\n\n        animFrameRef.current = requestAnimationFrame(physicsLoop);\n      };\n\n      animFrameRef.current = requestAnimationFrame(physicsLoop);\n\n      return () => {\n        isRunning = false;\n        if (animFrameRef.current) {\n          cancelAnimationFrame(animFrameRef.current);\n        }\n      };\n    }, [maxTilt, perspective, scaleBounce, gyroActive, introActive]);\n\n    // Desktop Pointer Tracking\n    const handlePointerMove = useCallback(\n      (e: React.PointerEvent<HTMLDivElement>) => {\n        if (!containerRef.current || gyroActive) return;\n        isHoveringRef.current = true;\n\n        const rect = containerRef.current.getBoundingClientRect();\n        const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);\n        const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);\n\n        targetTiltRef.current = {\n          x: Math.max(-maxTilt, Math.min(maxTilt, -normY * maxTilt)),\n          y: Math.max(-maxTilt, Math.min(maxTilt, normX * maxTilt)),\n        };\n      },\n      [gyroActive, maxTilt]\n    );\n\n    const handlePointerLeave = useCallback(() => {\n      isHoveringRef.current = false;\n      if (!gyroActive) {\n        targetTiltRef.current = { x: 0, y: 0 };\n      }\n    }, [gyroActive]);\n\n    // Mobile Fallback: Touch Drag Tracking\n    const handleTouchMove = useCallback(\n      (e: React.TouchEvent<HTMLDivElement>) => {\n        if (!containerRef.current || gyroActive) return;\n        isHoveringRef.current = true;\n        const touch = e.touches[0];\n        if (!touch) return;\n\n        const rect = containerRef.current.getBoundingClientRect();\n        const normX = (touch.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);\n        const normY = (touch.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);\n\n        targetTiltRef.current = {\n          x: Math.max(-maxTilt, Math.min(maxTilt, -normY * maxTilt)),\n          y: Math.max(-maxTilt, Math.min(maxTilt, normX * maxTilt)),\n        };\n      },\n      [gyroActive, maxTilt]\n    );\n\n    const handleTouchEnd = useCallback(() => {\n      isHoveringRef.current = false;\n      if (!gyroActive) {\n        targetTiltRef.current = { x: 0, y: 0 };\n      }\n    }, [gyroActive]);\n\n    return (\n      <div\n        ref={ref}\n        className={cn(\n          "relative flex items-center justify-center select-none overflow-hidden touch-none",\n          className\n        )}\n        style={{\n          width: typeof width === "number" ? `${width}px` : width,\n          height: typeof height === "number" ? `${height}px` : height,\n          ...style,\n        }}\n        {...props}\n      >\n        <div\n          ref={containerRef}\n          onPointerMove={handlePointerMove}\n          onPointerLeave={handlePointerLeave}\n          onTouchMove={handleTouchMove}\n          onTouchEnd={handleTouchEnd}\n          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"\n        >\n          {/* Ambient Radial Halo Behind Object */}\n          <div\n            className="absolute w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-25 transition-colors duration-500"\n            style={{ backgroundColor: accentColor }}\n          />\n\n          {/* Ambient Diagonal Light Sweep (Passes behind object every 5-6s) */}\n          {ambientSweep && (\n            <div\n              className="absolute inset-0 pointer-events-none overflow-hidden"\n              style={{ opacity: 0.15 }}\n            >\n              <div\n                className="w-full h-full"\n                style={{\n                  background: `linear-gradient(115deg, transparent 35%, ${accentColor} 50%, transparent 65%)`,\n                  animation: "liveObjectSweep 5.8s ease-in-out infinite",\n                }}\n              />\n            </div>\n          )}\n\n          {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n              PHASE 1: IGNITION LIGHT STREAKS (10-14 streaks)\n          \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}\n          {introActive && (\n            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">\n              {streaks.map((s) => (\n                <div\n                  key={s.id}\n                  className="absolute origin-left rounded-full"\n                  style={{\n                    width: `${s.length}px`,\n                    height: `${s.width}px`,\n                    background: `linear-gradient(90deg, transparent 0%, ${accentColor} 40%, #ffffff 80%, transparent 100%)`,\n                    transform: `rotate(${s.angle}deg)`,\n                    animation: `liveStreakShoot 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards ${s.delay}ms`,\n                  }}\n                />\n              ))}\n            </div>\n          )}\n\n          {/* White / Accent Screen Flash */}\n          <div\n            className="absolute inset-0 pointer-events-none z-40 transition-opacity duration-75"\n            style={{\n              backgroundColor: "#ffffff",\n              opacity: flashOpacity,\n              mixBlendMode: "screen",\n            }}\n          />\n\n          {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n              PHASE 2: 3D FLOATING OBJECT STAGE\n          \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}\n          <div\n            ref={objectWrapperRef}\n            className="relative w-[78%] h-[78%] flex items-center justify-center will-change-transform"\n            style={{\n              transformStyle: "preserve-3d",\n            }}\n          >\n            {/* The Transparent PNG Object with Alpha RGB Glitch Drop-Shadow */}\n            <img\n              src={src}\n              alt={alt}\n              className="relative w-full h-full object-contain pointer-events-none select-none z-10"\n              style={{\n                filter:\n                  glitchOffset > 0.1\n                    ? `drop-shadow(${glitchOffset.toFixed(1)}px 0 ${chromaRed}) drop-shadow(-${glitchOffset.toFixed(\n                        1\n                      )}px 0 ${chromaCyan}) drop-shadow(0 20px 35px rgba(0,0,0,0.6))`\n                    : "drop-shadow(0 25px 45px rgba(0,0,0,0.65))",\n                transform: "translateZ(30px)",\n              }}\n            />\n\n            {/* Specular Glare Sheen (Masked strictly to product PNG silhouette) */}\n            <div\n              ref={glareRef}\n              className="absolute inset-0 pointer-events-none select-none z-20"\n              style={{\n                WebkitMaskImage: `url("${src}")`,\n                maskImage: `url("${src}")`,\n                WebkitMaskSize: "contain",\n                maskSize: "contain",\n                WebkitMaskRepeat: "no-repeat",\n                maskRepeat: "no-repeat",\n                WebkitMaskPosition: "center",\n                maskPosition: "center",\n                background:\n                  "radial-gradient(ellipse 65% 55% at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.18) 32%, transparent 65%)",\n                mixBlendMode: "screen",\n                transform: "translateZ(31px)",\n                opacity: 0.85,\n              }}\n            />\n          </div>\n        </div>\n\n        {/* Global Keyframes for Ambient Sweep & Radial Streak Shoot */}\n        <style dangerouslySetInnerHTML={{\n          __html: `\n            @keyframes liveObjectSweep {\n              0% { transform: translateX(-140%) rotate(25deg); opacity: 0; }\n              15% { opacity: 0.18; }\n              35% { transform: translateX(140%) rotate(25deg); opacity: 0; }\n              100% { transform: translateX(140%) rotate(25deg); opacity: 0; }\n            }\n            @keyframes liveStreakShoot {\n              0% {\n                transform: rotate(var(--angle, 0deg)) scaleX(0.1) translateX(0);\n                opacity: 0;\n              }\n              25% {\n                opacity: 1;\n              }\n              100% {\n                transform: rotate(var(--angle, 0deg)) scaleX(1.4) translateX(90px);\n                opacity: 0;\n              }\n            }\n          `\n        }} />\n      </div>\n    );\n  }\n);\n\nLiveObject.displayName = "LiveObject";\n'
};

// src/registry/particle-reveal-card.ts
var particleRevealCard = {
  name: "particle-reveal-card",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "particle-reveal-card.tsx",
  content: '"use client";\n\nimport * as React from "react";\nimport { useState, useRef, useEffect, useCallback, useId } from "react";\nimport { cn } from "../utils/cn";\nimport { Sparkles, RotateCcw } from "lucide-react";\n\nexport interface ParticleRevealCardProps extends React.HTMLAttributes<HTMLDivElement> {\n  /**\n   * Transparent PNG image URL of the product or object.\n   */\n  src: string;\n  /**\n   * Card title or product name.\n   */\n  title?: string;\n  /**\n   * Secondary label or subtitle.\n   */\n  subtitle?: string;\n  /**\n   * Optional price string.\n   */\n  price?: string;\n  /**\n   * Badge text displayed at top of card.\n   */\n  badge?: string;\n  /**\n   * Card width in pixels or CSS dimension string.\n   * @default 360\n   */\n  cardWidth?: number | string;\n  /**\n   * Card height in pixels or CSS dimension string.\n   * @default 480\n   */\n  cardHeight?: number | string;\n  /**\n   * Diameter of each pixel particle in pixels.\n   * @default 2.2\n   */\n  particleSize?: number;\n  /**\n   * Sampling step/gap between sampled pixels. Lower value = higher particle density.\n   * @default 3\n   */\n  gap?: number;\n  /**\n   * Cursor repulsion radius in pixels.\n   * @default 85\n   */\n  repelRadius?: number;\n  /**\n   * Repulsion force multiplier.\n   * @default 6.5\n   */\n  repelForce?: number;\n  /**\n   * Spring stiffness pulling particles back to their home coordinate.\n   * @default 0.08\n   */\n  springStiffness?: number;\n  /**\n   * Velocity friction/damping factor (0.8 - 0.95).\n   * @default 0.88\n   */\n  damping?: number;\n  /**\n   * Whether particles scatter randomly on initial load and spring-assemble.\n   * @default true\n   */\n  scatterOnLoad?: boolean;\n}\n\ninterface Particle {\n  homeX: number;\n  homeY: number;\n  x: number;\n  y: number;\n  vx: number;\n  vy: number;\n  color: string;\n}\n\n/**\n * ParticleRevealCard\n *\n * Luxury showcase card where the product photo assembles from thousands of floating\n * particles upon load with spring physics, and the cursor dynamically repels particles.\n */\nexport const ParticleRevealCard = React.forwardRef<HTMLDivElement, ParticleRevealCardProps>(\n  (\n    {\n      src,\n      title = "Quantum Chronograph",\n      subtitle = "CALIBRE 01 \u2022 FORGED TITANIUM",\n      price = "$1,450",\n      badge = "Particle Physics",\n      cardWidth = 360,\n      cardHeight = 480,\n      particleSize = 2.2,\n      gap = 3,\n      repelRadius = 85,\n      repelForce = 6.5,\n      springStiffness = 0.08,\n      damping = 0.88,\n      scatterOnLoad = true,\n      className,\n      style,\n      ...props\n    },\n    ref\n  ) => {\n    const cardId = useId();\n    const containerRef = useRef<HTMLDivElement>(null);\n    const canvasRef = useRef<HTMLCanvasElement | null>(null);\n    const particlesRef = useRef<Particle[]>([]);\n    const animFrameRef = useRef<number | null>(null);\n    const pointerRef = useRef<{ x: number; y: number; active: boolean }>({\n      x: -9999,\n      y: -9999,\n      active: false,\n    });\n\n    const [isLoaded, setIsLoaded] = useState(false);\n    const [particleCount, setParticleCount] = useState(0);\n\n    // Scatter particles to random explosive offsets\n    const triggerScatter = useCallback(() => {\n      const particles = particlesRef.current;\n      const canvas = canvasRef.current;\n      if (!canvas || particles.length === 0) return;\n\n      const cw = canvas.width;\n      const ch = canvas.height;\n\n      for (let i = 0; i < particles.length; i++) {\n        const p = particles[i];\n        const angle = Math.random() * Math.PI * 2;\n        const dist = 100 + Math.random() * Math.max(cw, ch) * 0.8;\n        p.vx = Math.cos(angle) * (6 + Math.random() * 8);\n        p.vy = Math.sin(angle) * (6 + Math.random() * 8);\n        p.x = p.homeX + Math.cos(angle) * dist;\n        p.y = p.homeY + Math.sin(angle) * dist;\n      }\n    }, []);\n\n    // Load and sample transparent PNG pixels\n    useEffect(() => {\n      if (!src) return;\n      let cancelled = false;\n      setIsLoaded(false);\n\n      const img = new Image();\n      img.crossOrigin = "anonymous";\n      img.src = src;\n\n      img.onload = () => {\n        if (cancelled) return;\n\n        const canvas = canvasRef.current;\n        if (!canvas) return;\n\n        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;\n        const displayWidth = canvas.clientWidth || 320;\n        const displayHeight = canvas.clientHeight || 280;\n\n        canvas.width = displayWidth * dpr;\n        canvas.height = displayHeight * dpr;\n\n        const offscreen = document.createElement("canvas");\n        const offCtx = offscreen.getContext("2d", { willReadFrequently: true });\n        if (!offCtx) return;\n\n        // Scale image to fit comfortably within display bounds with margins\n        const padding = 20;\n        const maxW = displayWidth - padding * 2;\n        const maxH = displayHeight - padding * 2;\n        const scale = Math.min(maxW / img.width, maxH / img.height);\n        const drawW = img.width * scale;\n        const drawH = img.height * scale;\n        const offsetX = (displayWidth - drawW) / 2;\n        const offsetY = (displayHeight - drawH) / 2;\n\n        offscreen.width = displayWidth;\n        offscreen.height = displayHeight;\n\n        offCtx.clearRect(0, 0, displayWidth, displayHeight);\n        offCtx.drawImage(img, offsetX, offsetY, drawW, drawH);\n\n        const imgData = offCtx.getImageData(0, 0, displayWidth, displayHeight);\n        const pixels = imgData.data;\n        const newParticles: Particle[] = [];\n\n        const samplingGap = Math.max(2, Math.round(gap));\n\n        for (let y = 0; y < displayHeight; y += samplingGap) {\n          for (let x = 0; x < displayWidth; x += samplingGap) {\n            const index = (y * displayWidth + x) * 4;\n            const alpha = pixels[index + 3];\n\n            // Only sample solid silhouette pixels\n            if (alpha > 30) {\n              const r = pixels[index];\n              const g = pixels[index + 1];\n              const b = pixels[index + 2];\n              const a = (alpha / 255).toFixed(2);\n\n              const homeX = x * dpr;\n              const homeY = y * dpr;\n\n              let startX = homeX;\n              let startY = homeY;\n              let startVx = 0;\n              let startVy = 0;\n\n              if (scatterOnLoad) {\n                const angle = Math.random() * Math.PI * 2;\n                const dist = 120 + Math.random() * Math.max(displayWidth, displayHeight) * 0.9 * dpr;\n                startX = homeX + Math.cos(angle) * dist;\n                startY = homeY + Math.sin(angle) * dist;\n                startVx = (Math.random() - 0.5) * 8;\n                startVy = (Math.random() - 0.5) * 8;\n              }\n\n              newParticles.push({\n                homeX,\n                homeY,\n                x: startX,\n                y: startY,\n                vx: startVx,\n                vy: startVy,\n                color: `rgba(${r},${g},${b},${a})`,\n              });\n            }\n          }\n        }\n\n        particlesRef.current = newParticles;\n        setParticleCount(newParticles.length);\n        setIsLoaded(true);\n      };\n\n      return () => {\n        cancelled = true;\n      };\n    }, [src, gap, scatterOnLoad]);\n\n    // Canvas Physics Animation Loop\n    useEffect(() => {\n      const canvas = canvasRef.current;\n      if (!canvas) return;\n      const ctx = canvas.getContext("2d");\n      if (!ctx) return;\n\n      let isRunning = true;\n\n      const render = () => {\n        if (!isRunning) return;\n\n        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;\n        const particles = particlesRef.current;\n        const ptr = pointerRef.current;\n\n        ctx.clearRect(0, 0, canvas.width, canvas.height);\n\n        const scaledRepelRad = repelRadius * dpr;\n        const scaledRepelRadSq = scaledRepelRad * scaledRepelRad;\n        const pSize = particleSize * dpr;\n\n        for (let i = 0; i < particles.length; i++) {\n          const p = particles[i];\n\n          // 1. Cursor Repulsion\n          if (ptr.active) {\n            const dx = p.x - ptr.x;\n            const dy = p.y - ptr.y;\n            const distSq = dx * dx + dy * dy;\n\n            if (distSq < scaledRepelRadSq && distSq > 0) {\n              const dist = Math.sqrt(distSq);\n              const force = (1 - dist / scaledRepelRad) * repelForce * dpr;\n              const angle = Math.atan2(dy, dx);\n              p.vx += Math.cos(angle) * force;\n              p.vy += Math.sin(angle) * force;\n            }\n          }\n\n          // 2. Spring Physics to Home\n          const homeDx = p.homeX - p.x;\n          const homeDy = p.homeY - p.y;\n          p.vx += homeDx * springStiffness;\n          p.vy += homeDy * springStiffness;\n\n          // 3. Friction & Position Integration\n          p.vx *= damping;\n          p.vy *= damping;\n          p.x += p.vx;\n          p.y += p.vy;\n\n          // 4. Render Particle\n          ctx.fillStyle = p.color;\n          ctx.fillRect(p.x - pSize / 2, p.y - pSize / 2, pSize, pSize);\n        }\n\n        animFrameRef.current = requestAnimationFrame(render);\n      };\n\n      animFrameRef.current = requestAnimationFrame(render);\n\n      return () => {\n        isRunning = false;\n        if (animFrameRef.current) {\n          cancelAnimationFrame(animFrameRef.current);\n        }\n      };\n    }, [particleSize, repelRadius, repelForce, springStiffness, damping]);\n\n    // Pointer Event Handlers\n    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {\n      const canvas = canvasRef.current;\n      if (!canvas) return;\n      const rect = canvas.getBoundingClientRect();\n      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;\n\n      const px = (e.clientX - rect.left) * dpr;\n      const py = (e.clientY - rect.top) * dpr;\n\n      pointerRef.current = {\n        x: px,\n        y: py,\n        active: true,\n      };\n    }, []);\n\n    const handlePointerLeave = useCallback(() => {\n      pointerRef.current.active = false;\n    }, []);\n\n    return (\n      <div\n        ref={ref}\n        className={cn("group flex flex-col items-center select-none", className)}\n        style={{\n          width: typeof cardWidth === "number" ? `${cardWidth}px` : cardWidth,\n          ...style,\n        }}\n        {...props}\n      >\n        <div\n          ref={containerRef}\n          onPointerMove={handlePointerMove}\n          onPointerLeave={handlePointerLeave}\n          className="relative w-full rounded-2xl p-5 border border-white/10 bg-[hsl(225_12%_7%)] hover:border-white/20 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col justify-between"\n          style={{\n            minHeight: typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight,\n          }}\n        >\n          {/* Subtle Aurora Ambient Radial Glow */}\n          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />\n          <div className="absolute -bottom-24 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />\n\n          {/* Top Header Plate */}\n          <div className="relative z-10 flex items-center justify-between">\n            <div className="flex items-center gap-2">\n              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />\n              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-400/90">\n                {badge}\n              </span>\n            </div>\n\n            {/* Scatter Re-trigger Button */}\n            <button\n              type="button"\n              onClick={triggerScatter}\n              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-all cursor-pointer active:scale-95"\n              title="Re-scatter particles"\n            >\n              <RotateCcw className="w-3 h-3" />\n              <span>Scatter</span>\n            </button>\n          </div>\n\n          {/* Center Stage: Interactive Particle Canvas */}\n          <div className="relative w-full h-[260px] my-auto flex items-center justify-center">\n            <canvas\n              ref={canvasRef}\n              className="w-full h-full cursor-crosshair touch-none"\n            />\n\n            {!isLoaded && (\n              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500">\n                <Sparkles className="w-5 h-5 animate-spin text-cyan-400" />\n                <span className="text-xs font-mono">Synthesizing particles...</span>\n              </div>\n            )}\n          </div>\n\n          {/* Bottom Card Typographic Plate */}\n          <div className="relative z-10 border-t border-white/8 pt-4">\n            <div className="flex items-baseline justify-between mb-1">\n              <h3 className="text-base font-semibold text-white tracking-tight">\n                {title}\n              </h3>\n              {price && (\n                <span className="text-sm font-mono font-bold text-cyan-400">\n                  {price}\n                </span>\n              )}\n            </div>\n\n            <div className="flex items-center justify-between">\n              <p className="text-xs text-zinc-400 font-mono tracking-wide">\n                {subtitle}\n              </p>\n              {particleCount > 0 && (\n                <span className="text-[10px] font-mono text-zinc-500">\n                  {particleCount.toLocaleString()} pts\n                </span>\n              )}\n            </div>\n          </div>\n        </div>\n      </div>\n    );\n  }\n);\n\nParticleRevealCard.displayName = "ParticleRevealCard";\n'
};

// src/registry/input.ts
var input = {
  name: "input",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "input.tsx",
  content: `'use client';

import * as React from "react"
import { cn } from "../utils/cn"
import { motion, AnimatePresence } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Search, Mail, AlertCircle, CheckCircle2 } from "lucide-react"

const inputVariants = cva(
  "flex h-10 w-full rounded-xl border bg-transparent px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
        glass: "backdrop-blur-md bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5 focus:border-white/30 dark:focus:border-white/15 focus:bg-white/10 focus:ring-2 focus:ring-white/10",
        gradient: "border-purple-500/20 bg-background/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20",
        underline: "rounded-none border-t-0 border-x-0 border-b border-muted bg-transparent px-1 focus:border-primary focus:ring-0",
        // New variants
        otp: "text-center text-lg font-bold border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
        tags: "hidden", // Handled by tags wrapper styles
        autocomplete: "border-input bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    }
  }
)

/**
 * Props for the Input component
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue">,
    VariantProps<typeof inputVariants> {
  /**
   * Enable entrance spring animation
   * @default true
   */
  animate?: boolean;
  /**
   * Current text value of the input
   */
  value?: string;
  /**
   * Initial default value for uncontrolled inputs
   */
  defaultValue?: string | number;
  /**
   * Callback fired when value changes
   */
  onChange?: (value: string) => void;
  /**
   * Value for OTP inputs (should be length 6 string)
   */
  otpValue?: string;
  /**
   * Callback fired when OTP string changes
   */
  onOtpChange?: (value: string) => void;
  /**
   * Current active list of tag strings for the \`tags\` variant
   */
  tags?: string[];
  /**
   * Callback fired when the tags list updates
   */
  onTagsChange?: (tags: string[]) => void;
  /**
   * Suggestions list strings for the \`autocomplete\` variant
   */
  suggestions?: string[];
  /**
   * Callback fired when a suggestion item is clicked
   */
  onSuggestionSelect?: (value: string) => void;
  /**
   * Label displayed above the input field
   * @example <Input label="Email address" />
   */
  label?: string;
  /**
   * Helper text displayed below the input field
   * @example <Input description="We'll never share your email" />
   */
  description?: string;
  /**
   * Validation error message \u2014 shown in red below the field
   * @example <Input error={errors.email?.message} />
   */
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant,
      animate = true,
      value: propValue,
      defaultValue,
      onChange,
      otpValue = "",
      onOtpChange,
      tags = [],
      onTagsChange,
      suggestions = [],
      onSuggestionSelect,
      label,
      description,
      error,
      required,
      id,
      ...props
    },
    ref
  ) => {
    // Manage internal value if component is uncontrolled
    const isControlled = propValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(
      defaultValue !== undefined ? String(defaultValue) : ""
    );
    const currentValue = isControlled ? propValue : internalValue;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e.target.value);
    };

    // Generate a stable ID for label association if not provided
    const inputId = id || React.useId();
    const descId = description ? \`\${inputId}-desc\` : undefined;
    const errId = error ? \`\${inputId}-err\` : undefined;
    const isOtp = variant === "otp";
    const isTags = variant === "tags";
    const isAutocomplete = variant === "autocomplete";

    // \u2501\u2501\u2501 1. OTP INPUT VARIANT IMPLEMENTATION \u2501\u2501\u2501
    const otpLength = 6;
    const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    
    // Split OTP value into array
    const otpArray = React.useMemo(() => {
      const arr = Array(otpLength).fill("");
      for (let i = 0; i < Math.min(otpValue.length, otpLength); i++) {
        arr[i] = otpValue[i];
      }
      return arr;
    }, [otpValue]);

    const handleOtpChange = (val: string, index: number) => {
      const newOtp = [...otpArray];
      // Keep only last char if multiple input
      newOtp[index] = val.slice(-1);
      const newOtpString = newOtp.join("");
      onOtpChange?.(newOtpString);

      // Focus next input
      if (val !== "" && index < otpLength - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace" && otpArray[index] === "" && index > 0) {
        // Move focus backward on backspace
        otpRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowLeft" && index > 0) {
        otpRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < otpLength - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").trim().slice(0, otpLength);
      if (/^\\d+$/.test(pastedData)) {
        onOtpChange?.(pastedData);
        // Focus the last populated field or the next empty
        const nextFocusIndex = Math.min(pastedData.length, otpLength - 1);
        otpRefs.current[nextFocusIndex]?.focus();
      }
    };


    // \u2501\u2501\u2501 2. TAGS INPUT VARIANT IMPLEMENTATION \u2501\u2501\u2501
    const [tagInput, setTagInput] = React.useState("");
    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
        e.preventDefault();
        const cleanTag = tagInput.trim().replace(/,/g, "");
        if (cleanTag && !tags.includes(cleanTag)) {
          const newTags = [...tags, cleanTag];
          onTagsChange?.(newTags);
        }
        setTagInput("");
      } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
        // Delete last tag
        const newTags = tags.slice(0, -1);
        onTagsChange?.(newTags);
      }
    };

    const handleRemoveTag = (idx: number) => {
      const newTags = tags.filter((_, i) => i !== idx);
      onTagsChange?.(newTags);
    };


    // \u2501\u2501\u2501 3. AUTOCOMPLETE VARIANT IMPLEMENTATION \u2501\u2501\u2501
    const [focused, setFocused] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const filteredSuggestions = React.useMemo(() => {
      if (!currentValue) return [];
      return suggestions.filter(s =>
        s.toLowerCase().includes(currentValue.toLowerCase()) &&
        s.toLowerCase() !== currentValue.toLowerCase()
      );
    }, [suggestions, currentValue]);

    React.useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setFocused(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);


    // \u2501\u2501\u2501 RENDER STAGE \u2501\u2501\u2501

    // Destructure custom props to avoid DOM warning dumps
    const { ...htmlProps } = props;

    // A. RENDER OTP
    if (isOtp) {
      return (
        <div className="flex gap-2 justify-center w-full">
          {Array.from({ length: otpLength }).map((_, idx) => (
            <input
              key={idx}
              type="text"
              pattern="\\d*"
              inputMode="numeric"
              maxLength={1}
              ref={(el) => {
                otpRefs.current[idx] = el;
              }}
              value={otpArray[idx]}
              onChange={(e) => handleOtpChange(e.target.value, idx)}
              onKeyDown={(e) => handleOtpKeyDown(e, idx)}
              onPaste={handleOtpPaste}
              className={cn(
                inputVariants({ variant: "otp" }),
                "w-12 h-12 rounded-xl text-center font-bold text-lg border-2"
              )}
              {...(htmlProps as any)}
            />
          ))}
        </div>
      );
    }

    // B. RENDER TAGS
    if (isTags) {
      return (
        <div
          className={cn(
            "flex flex-wrap items-center gap-1.5 min-h-[44px] w-full rounded-xl border border-input bg-background/50 px-3 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all",
            className
          )}
        >
          <AnimatePresence>
            {tags.map((tag, idx) => (
              <motion.span
                key={tag + idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-2 py-0.5 rounded-md"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(idx)}
                  className="hover:bg-primary/20 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            ref={ref}
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder={tags.length === 0 ? props.placeholder : ""}
            className="flex-1 bg-transparent border-0 outline-none text-sm p-0.5 placeholder:text-muted-foreground/50 focus:ring-0 min-w-[60px]"
            {...(htmlProps as any)}
          />
        </div>
      );
    }

    // C. RENDER AUTOCOMPLETE OR STANDARD
    const textInputContent = (
      <input
        ref={ref}
        type={type}
        value={currentValue}
        onChange={handleInputChange}
        className={cn(inputVariants({ variant: isAutocomplete ? "autocomplete" : variant, className }))}
        onFocus={() => isAutocomplete && setFocused(true)}
        {...(htmlProps as any)}
      />
    );

    if (isAutocomplete) {
      return (
        <div ref={containerRef} className="relative w-full">
          {textInputContent}
          <AnimatePresence>
            {focused && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="absolute z-50 w-full mt-1.5 bg-card border border-border/80 shadow-lg rounded-xl overflow-hidden max-h-[200px] overflow-y-auto p-1 space-y-0.5"
              >
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={item + idx}
                    type="button"
                    onClick={() => {
                      onSuggestionSelect?.(item)
                      setFocused(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-colors outline-none focus:bg-muted/50"
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Standard input rendering with optional animations
    const inputElement = (
      <motion.div
        className="relative w-full"
        initial={animate ? { opacity: 0, y: 4 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.25 }}
      >
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={currentValue}
          onChange={handleInputChange}
          required={required}
          aria-invalid={!!error}
          aria-describedby={[descId, errId].filter(Boolean).join(" ") || undefined}
          className={cn(inputVariants({ variant: isAutocomplete ? "autocomplete" : variant, className }), error && "border-destructive focus:border-destructive focus:ring-destructive/20")}
          onFocus={() => isAutocomplete && setFocused(true)}
          {...(htmlProps as any)}
        />
        {variant === "gradient" && (
          <div className="absolute inset-0 -z-10 rounded-xl bg-linear-to-r from-violet-500 to-pink-500 opacity-0 blur transition-opacity peer-focus:opacity-20" />
        )}
      </motion.div>
    );

    // If no label/description/error, render bare input (backward compatible)
    if (!label && !description && !error) {
      return inputElement;
    }

    // With label/description/error wrapper
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive ml-1" aria-hidden>*</span>}
          </label>
        )}
        {inputElement}
        {description && !error && (
          <p id={descId} className="text-xs text-muted-foreground">{description}</p>
        )}
        {error && (
          <p id={errId} role="alert" className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
)
Input.displayName = "Input"

export { Input }

// ----------------------------------------------------
// Merged input components for backward compatibility
// ----------------------------------------------------

export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
      <Input ref={ref} className={cn("pl-9", className)} {...props} />
    </div>
  )
);
SearchInput.displayName = "SearchInput";

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    return (
      <div className="relative w-full">
        <Input ref={ref} type={show ? "text" : "password"} className={cn("pr-10", className)} {...props} />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/60 hover:text-foreground select-none"
        >
          {show ? "HIDE" : "SHOW"}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export const GlassInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <Input ref={ref} variant="glass" {...props} />
);
GlassInput.displayName = "GlassInput";

export const GradientInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <Input ref={ref} variant="gradient" {...props} />
);
GradientInput.displayName = "GradientInput";

export const UnderlineInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <Input ref={ref} variant="underline" {...props} />
);
UnderlineInput.displayName = "UnderlineInput";

export const PillInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => <Input ref={ref} className={cn("rounded-full px-5", className)} {...props} />
);
PillInput.displayName = "PillInput";

export interface ErrorInputProps extends InputProps {
  errorMessage?: string;
}

export const ErrorInput = React.forwardRef<HTMLInputElement, ErrorInputProps>(
  ({ className, errorMessage, ...props }, ref) => (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative flex items-center w-full">
        <Input
          ref={ref}
          className={cn(
            "border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-600 placeholder:text-red-400/50 pr-10",
            className
          )}
          {...props}
        />
        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
      </div>
      {errorMessage && <span className="text-xs text-red-500 px-1">{errorMessage}</span>}
    </div>
  )
);
ErrorInput.displayName = "ErrorInput";

export const SuccessInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <div className="relative flex items-center w-full">
      <Input
        ref={ref}
        className={cn(
          "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20 text-emerald-600 placeholder:text-emerald-400/50 pr-10",
          className
        )}
        {...props}
      />
      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
    </div>
  )
);
SuccessInput.displayName = "SuccessInput";

export const GhostInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn(
        "border-transparent bg-transparent shadow-none hover:bg-muted/30 focus:bg-muted/50 focus:ring-0",
        className
      )}
      {...props}
    />
  )
);
GhostInput.displayName = "GhostInput";

export const NeumorphicInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn(
        "border-0 bg-secondary/30 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_1px_1px_3px_rgba(255,255,255,0.05)] focus:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
      {...props}
    />
  )
);
NeumorphicInput.displayName = "NeumorphicInput";

export interface IconInputProps extends InputProps {
  icon?: React.ReactNode;
}

export const IconInputLeft = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, icon, ...props }, ref) => {
    const Icon = icon || <Search className="h-4 w-4" />;
    return (
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
          {Icon}
        </div>
        <Input ref={ref} className={cn("pl-9", className)} {...props} />
      </div>
    );
  }
);
IconInputLeft.displayName = "IconInputLeft";

export const IconInputRight = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, icon, ...props }, ref) => {
    const Icon = icon || <Mail className="h-4 w-4" />;
    return (
      <div className="relative w-full">
        <Input ref={ref} className={cn("pr-9", className)} {...props} />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
          {Icon}
        </div>
      </div>
    );
  }
);
IconInputRight.displayName = "IconInputRight";

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, InputProps & { label: string }>(
  ({ className, label, value = "", placeholder, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [hasVal, setHasVal] = React.useState(value !== "");

    React.useEffect(() => {
      setHasVal(value !== "");
    }, [value]);

    return (
      <div className="relative w-full pt-2">
        <Input
          ref={ref}
          value={value}
          placeholder=""
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            setHasVal(e.target.value !== "");
          }}
          className={className}
          {...props}
        />
        <label
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none select-none text-muted-foreground/60",
            focused || hasVal
              ? "-top-1 text-[10px] font-bold text-primary bg-background px-1"
              : "top-5 text-sm"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export const MinimalDropInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn(
        "border-0 bg-muted/40 hover:bg-muted/60 focus:bg-background border-b-2 border-transparent focus:border-primary rounded-t-xl rounded-b-none",
        className
      )}
      {...props}
    />
  )
);
MinimalDropInput.displayName = "MinimalDropInput";

`
};

// src/registry/interactive-code-block.ts
var interactiveCodeBlock = {
  name: "interactive-code-block",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "interactive-code-block.tsx",
  content: `'use client';

import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../utils/cn';

export type CodeBlockTheme = 'dark' | 'aurora' | 'neon' | 'glass' | 'midnight';

export interface InteractiveCodeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onCopy'> {
  /** Source code snippet string to display */
  code: string;
  /** Filename or title displayed in the macOS titlebar */
  filename?: string;
  /** Programming language identifier */
  language?: string;
  /** Whether to show numeric line numbers */
  showLineNumbers?: boolean;
  /** Array of line numbers to highlight */
  highlightLines?: number[];
  /** Color theme styling */
  theme?: CodeBlockTheme;
  /** Whether to render the 1-click clipboard copy button */
  copyable?: boolean;
  /** Custom badge tag displayed in the header */
  badgeText?: string;
  /** Callback fired when code is copied */
  onCopy?: (code: string) => void;
}

const themeStyles: Record<CodeBlockTheme, { container: string; header: string; text: string; border: string }> = {
  dark: {
    container: 'bg-zinc-950 text-zinc-100',
    header: 'bg-zinc-900/90 border-zinc-800',
    text: 'text-zinc-300',
    border: 'border-zinc-800/80',
  },
  aurora: {
    container: 'bg-zinc-950 text-zinc-100 shadow-[0_0_30px_rgba(139,92,246,0.15)]',
    header: 'bg-zinc-900/90 border-violet-500/30',
    text: 'text-zinc-200',
    border: 'border-violet-500/40',
  },
  neon: {
    container: 'bg-black text-cyan-200 shadow-[0_0_25px_rgba(6,182,212,0.2)]',
    header: 'bg-zinc-950 border-cyan-500/40',
    text: 'text-cyan-100',
    border: 'border-cyan-500/50',
  },
  glass: {
    container: 'bg-zinc-950/70 backdrop-blur-xl text-zinc-100',
    header: 'bg-white/5 border-white/10',
    text: 'text-zinc-200',
    border: 'border-white/15',
  },
  midnight: {
    container: 'bg-slate-950 text-slate-100',
    header: 'bg-slate-900 border-slate-800',
    text: 'text-slate-300',
    border: 'border-slate-800',
  },
};

/**
 * InteractiveCodeBlock Component
 *
 * A macOS-inspired code presentation card with instant 1-click copy,
 * syntax layout, line numbering, and vibrant theme styling.
 */
export const InteractiveCodeBlock = React.forwardRef<HTMLDivElement, InteractiveCodeBlockProps>(
  (
    {
      code,
      filename = 'Component.tsx',
      language = 'tsx',
      showLineNumbers = true,
      highlightLines = [],
      theme = 'dark',
      copyable = true,
      badgeText,
      onCopy,
      className,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        onCopy?.(code);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code', err);
      }
    };

    const lines = React.useMemo(() => code.trim().split('\\n'), [code]);
    const themeConfig = themeStyles[theme] || themeStyles.dark;

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border shadow-2xl overflow-hidden font-mono text-xs select-text transition-all duration-300',
          themeConfig.container,
          themeConfig.border,
          className
        )}
        {...props}
      >
        {/* macOS Window Titlebar */}
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2.5 border-b select-none',
            themeConfig.header
          )}
        >
          {/* Traffic light buttons */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] shadow-xs" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] shadow-xs" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840] shadow-xs" />
            <span className="ml-2 font-medium opacity-75">{filename}</span>
          </div>

          {/* Right actions: Badge + Copy */}
          <div className="flex items-center gap-2">
            {badgeText && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-sans font-medium">
                {badgeText}
              </span>
            )}

            {copyable && (
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy code to clipboard"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px] font-sans">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span className="text-[11px] font-sans">Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Code Content Container */}
        <div className="p-4 overflow-x-auto">
          <pre className={cn('leading-relaxed whitespace-pre font-mono text-xs', themeConfig.text)}>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlightLines.includes(lineNum);

              return (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center px-1 rounded transition-colors',
                    isHighlighted ? 'bg-white/10 -mx-1 px-2' : ''
                  )}
                >
                  {showLineNumbers && (
                    <span className="w-8 shrink-0 select-none text-zinc-600 text-[11px] text-right pr-3">
                      {lineNum}
                    </span>
                  )}
                  <span className="flex-1">{line || ' '}</span>
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    );
  }
);

InteractiveCodeBlock.displayName = 'InteractiveCodeBlock';
export default InteractiveCodeBlock;
`
};

// src/registry/loader.ts
var loader = {
  name: "loader",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "loader.tsx",
  content: `"use client"

import { motion } from "framer-motion"
import { cn } from "../utils/cn"

// Helper map for standard sizes
const sizeMap = {
  sm: "scale-75",
  md: "scale-100",
  lg: "scale-125",
}

export interface LoaderProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F variant
   * @default undefined
   */
  variant?:
    | "dots"
    | "ring"
    | "bars"
    | "pulse"
    | "spinner"
    | "wifi"
    | "hourglass"
    | "heartbeat"
    | "box"
    | "clock"
    | "battery"
    | "square-spin"
    | "text"
    | "progress-ring"
    | "skeleton-card"
    | "shimmer-block"
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F size
   * @default undefined
   */
  size?: "sm" | "md" | "lg" | number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F color
   * @default undefined
   */
  color?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F text
   * @default undefined
   */
  text?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F progress
   * @default undefined
   */
  progress?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F strokeWidth
   * @default undefined
   */
  strokeWidth?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
}

// 1. WifiLoader wrapper & definition
export const WifiLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const style = typeof size === "number" ? { transform: \`scale(\${size / 32})\` } : {}
  return (
    <div 
      className={cn("flex flex-col items-center justify-end h-8 w-8 gap-1 origin-bottom", scaleClass, className)}
      style={{ ...style, color }}
    >
      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-8 h-2 bg-current rounded-t-full rounded-b-sm" />
      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-5 h-2 bg-current rounded-t-full rounded-b-sm" />
      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-current rounded-full" />
    </div>
  )
}

// 2. HourglassLoader wrapper & definition
export const HourglassLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("inline-flex items-center justify-center", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      <motion.div 
        animate={{ rotate: 180 }} 
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 0.5 }}
        className="relative w-6 h-8 border-y-4 border-x-2 border-x-transparent flex flex-col justify-between items-center"
        style={{ borderColor: \`\${color} transparent \${color} transparent\` }}
      >
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] opacity-50" style={{ borderTopColor: color }} />
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] opacity-50" style={{ borderBottomColor: color }} />
      </motion.div>
    </div>
  )
}

// 3. HeartbeatLoader
export const HeartbeatLoader = ({ className, color = "#ef4444", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 24 : size === "lg" ? 40 : 32)
  return (
    <motion.div 
      animate={{ scale: [1, 1.2, 1, 1.3, 1] }} 
      transition={{ repeat: Infinity, duration: 1.2 }}
      className={cn("inline-block", scaleClass, className)}
    >
      <svg className="fill-current" style={{ color, width: pixelSize, height: pixelSize }} viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </motion.div>
  )
}

// 4. BoxLoader
export const BoxLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 24 : size === "lg" ? 40 : 32)
  return (
    <div className={cn("relative inline-block", className)} style={{ width: pixelSize, height: pixelSize }}>
      <motion.div 
        animate={{ rotate: 360, borderRadius: ["20%", "50%", "20%"] }} 
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }} 
        className="w-full h-full" 
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

// 5. BouncingBalls
export const BouncingBalls = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex gap-2 items-center origin-center", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      {[0, 1, 2].map(i => (
        <motion.div 
          key={i} 
          animate={{ y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

// 6. GlowRingLoader
export const GlowRingLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 30 : size === "lg" ? 50 : 40)
  return (
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
      className={cn("rounded-full border-4 border-current/25", className)} 
      style={{ 
        width: pixelSize, 
        height: pixelSize, 
        color, 
        borderTopColor: color, 
        boxShadow: \`0 0 10px \${color}80\` 
      }} 
    />
  )
}

// 7. LineScaleLoader
export const LineScaleLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex gap-1 items-end h-8 origin-bottom", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div 
          key={i} 
          animate={{ height: ["20%", "100%", "20%"] }} 
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }} 
          className="w-1.5 rounded-full" 
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

// 8. ClockLoader
export const ClockLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 30 : size === "lg" ? 50 : 40)
  return (
    <div 
      className={cn("relative rounded-full border-2", className)} 
      style={{ width: pixelSize, height: pixelSize, borderColor: color }}
    >
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }} 
        className="absolute top-1/2 left-1/2 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full" 
        style={{ height: \`\${(pixelSize / 2) - 4}px\`, backgroundColor: color }}
      />
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
        className="absolute top-1/2 left-1/2 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full opacity-70" 
        style={{ height: \`\${(pixelSize / 2) - 2}px\`, backgroundColor: color }}
      />
    </div>
  )
}

// 9. BatteryLoader
export const BatteryLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex items-center origin-left", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      <div className="w-12 h-6 border-2 rounded-sm p-0.5 flex" style={{ borderColor: color }}>
        <motion.div animate={{ width: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="h-full bg-emerald-500 rounded-sm" />
      </div>
      <div className="w-1 h-2 rounded-r-sm" style={{ backgroundColor: color }} />
    </div>
  )
}

// 10. SquareSpinLoader
export const SquareSpinLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 24 : size === "lg" ? 40 : 32)
  return (
    <motion.div 
      animate={{ rotateX: [0, 180, 180, 0], rotateY: [0, 0, 180, 180] }} 
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
      className={className}
      style={{ width: pixelSize, height: pixelSize, backgroundColor: color }} 
    />
  )
}

// 11. SpinnerLoader
export function SpinnerLoader({ className, size = 24, color = "currentColor" }: { className?: string; size?: number; color?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

// 12. DotsLoader
export function DotsLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex space-x-1.5 items-center justify-center h-10 origin-center", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
    </div>
  )
}

// 13. PulseLoader
export function PulseLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 16 : size === "lg" ? 28 : 20)
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: pixelSize, height: pixelSize }}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full" style={{ backgroundColor: color, width: pixelSize, height: pixelSize }} />
    </div>
  )
}

// 14. BarLoader
export function BarLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex space-x-1 items-center justify-center h-10 origin-center", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1.5 h-4 rounded-full origin-bottom" style={{ backgroundColor: color }} />
      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-4 rounded-full origin-bottom" style={{ backgroundColor: color }} />
      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-4 rounded-full origin-bottom" style={{ backgroundColor: color }} />
    </div>
  )
}

// 15. CircleLoader
export function CircleLoader({ className, size = 32, color = "currentColor" }: { className?: string; size?: number; color?: string }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border-2 opacity-20" style={{ borderColor: color }} />
      <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-r-transparent border-b-transparent animate-spin" style={{ borderLeftColor: color }} />
    </div>
  )
}

// 16. RingLoader
export function RingLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 40 : 1
  return (
    <div className={cn("inline-block relative w-10 h-10 origin-center", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      <motion.div 
        className="absolute inset-0 rounded-full border-4 border-t-transparent"
        style={{ borderColor: \`\${color} transparent \${color} \${color}\` }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      />
      <motion.div 
        className="absolute inset-2 rounded-full border-4 border-b-transparent opacity-50"
        style={{ borderColor: \`\${color} \${color} transparent \${color}\` }}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
    </div>
  )
}

// 17. TextLoader
export function TextLoader({ text = "Loading...", className, color = "currentColor" }: { text?: string; className?: string; color?: string }) {
  return (
    <div className={cn("font-mono text-sm font-medium flex items-center gap-2", className)} style={{ color }}>
      <span>{text}</span>
      <span className="flex gap-0.5">
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}>.</motion.span>
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>.</motion.span>
      </span>
    </div>
  )
}

// 18. ProgressRing
export function ProgressRing({ progress = 50, size = 60, strokeWidth = 4, className, color = "currentColor" }: { progress?: number; size?: number; strokeWidth?: number; className?: string; color?: string }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted stroke-current opacity-20"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ color }}
        />
        <motion.circle
          className="stroke-current"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ strokeDasharray: circumference, strokeLinecap: "round", color }}
        />
      </svg>
      <span className="absolute text-xs font-semibold" style={{ color }}>{progress}%</span>
    </div>
  )
}

// 19. SkeletonCard
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("border bg-card p-4 rounded-xl space-y-3 w-full max-w-sm border-border/60", className)}>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-[150px] bg-muted animate-pulse rounded" />
          <div className="h-3 w-[100px] bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-[80%] bg-muted animate-pulse rounded" />
      </div>
    </div>
  )
}

// 20. ShimmerBlock
export function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-muted rounded-md h-24 w-full", className)}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent"
        animate={{ translateX: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
    </div>
  )
}

// Unified Loader component
export function Loader({
  variant = "dots",
  size = "md",
  color,
  text,
  progress = 50,
  strokeWidth = 4,
  className,
}: LoaderProps) {
  const activeColor = color || "currentColor"

  switch (variant) {
    case "ring":
      return <RingLoader className={className} color={activeColor} size={size} />
    case "bars":
      return <BarLoader className={className} color={activeColor} size={size} />
    case "pulse":
      return <PulseLoader className={className} color={activeColor} size={size} />
    case "spinner":
      const pixelSizeSpinner = typeof size === "number" ? size : (size === "sm" ? 18 : size === "lg" ? 36 : 24)
      return <SpinnerLoader className={className} color={activeColor} size={pixelSizeSpinner} />
    case "wifi":
      return <WifiLoader className={className} color={activeColor} size={size} />
    case "hourglass":
      return <HourglassLoader className={className} color={activeColor} size={size} />
    case "heartbeat":
      return <HeartbeatLoader className={className} color={activeColor} size={size} />
    case "box":
      return <BoxLoader className={className} color={activeColor} size={size} />
    case "clock":
      return <ClockLoader className={className} color={activeColor} size={size} />
    case "battery":
      return <BatteryLoader className={className} color={activeColor} size={size} />
    case "square-spin":
      return <SquareSpinLoader className={className} color={activeColor} size={size} />
    case "text":
      return <TextLoader text={text} className={className} color={activeColor} />
    case "progress-ring":
      const pixelSizeProgress = typeof size === "number" ? size : (size === "sm" ? 50 : size === "lg" ? 80 : 60)
      return <ProgressRing progress={progress} size={pixelSizeProgress} strokeWidth={strokeWidth} className={className} color={activeColor} />
    case "skeleton-card":
      return <SkeletonCard className={className} />
    case "shimmer-block":
      return <ShimmerBlock className={className} />
    case "dots":
    default:
      return <DotsLoader className={className} color={activeColor} size={size} />
  }
}
`
};

// src/registry/marquee.ts
var marquee = {
  name: "marquee",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "marquee.tsx",
  content: `"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

/**
 * Props for the Marquee component
 */
export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content of the marquee
   */
  children: React.ReactNode
  /**
   * Speed of the scrolling animation (higher is faster, represented in pixels per second or duration)
   * @default 40
   */
  speed?: number
  /**
   * Direction of the scrolling
   * @default "left"
   */
  direction?: "left" | "right"
  /**
   * Whether to pause scrolling when hovering
   * @default true
   */
  pauseOnHover?: boolean
  /**
   * Gap between items in pixels
   * @default 16
   */
  gap?: number
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Marquee component provides a smooth infinite auto-scrolling marquee of children.
 */
const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      children,
      speed = 40,
      direction = "left",
      pauseOnHover = true,
      gap = 16,
      className,
      ...props
    },
    ref
  ) => {
    // We calculate a duration based on speed
    const duration = 1000 / speed

    const [isHovered, setIsHovered] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn("group flex overflow-hidden p-2 select-none w-full", className)}
        onMouseEnter={() => pauseOnHover && setIsHovered(true)}
        onMouseLeave={() => pauseOnHover && setIsHovered(false)}
        {...props}
      >
        <motion.div
          className="flex shrink-0 min-w-full justify-around items-center"
          style={{ gap: \`\${gap}px\` }}
          animate={{
            x: direction === "left" ? [0, \`calc(-50% - \${gap / 2}px)\`] : [\`calc(-50% - \${gap / 2}px)\`, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: duration,
            ease: "linear",
          }}
          // Dynamic control of pause using dynamic style mapping or animation controls
          // For Framer Motion, we can animate play state by using values or simple CSS animation playState
        >
          {/* We duplicate the children array multiple times to ensure seamless infinite overflow */}
          <div className="flex shrink-0 items-center justify-around" style={{ gap: \`\${gap}px\`, animationPlayState: isHovered ? 'paused' : 'running' }}>
            {children}
          </div>
          <div className="flex shrink-0 items-center justify-around" style={{ gap: \`\${gap}px\`, animationPlayState: isHovered ? 'paused' : 'running' }}>
            {children}
          </div>
        </motion.div>
      </div>
    )
  }
)

Marquee.displayName = "Marquee"

export { Marquee }
`
};

// src/registry/modal.ts
var modal = {
  name: "modal",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "modal.tsx",
  content: `'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

export interface ModalProps {
  /**
   * Controlled open state of the modal
   */
  isOpen: boolean;
  /**
   * Callback fired when modal wants to close (backdrop click / escape key / close button)
   */
  onClose: () => void;
  /**
   * Title of the modal
   */
  title?: string;
  /**
   * Subtitle description text
   */
  description?: string;
  /**
   * Size variation of the modal panel layout
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg' | 'xl';
  /**
   * Modal content children
   */
  children?: React.ReactNode;
  /**
   * Extra className for modal panel container
   */
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  default: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-5xl",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'default',
  children,
  className,
}) => {
  const [mounted, setMounted] = React.useState(false);

  // Sync portal mount state
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Sync Escape key listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Panel Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className={cn(
              "relative w-full overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-2xl z-10",
              sizeClasses[size],
              className
            )}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-md p-1 opacity-70 hover:opacity-100 hover:bg-muted/40 transition-all select-none cursor-pointer"
            >
              <X size={16} className="text-foreground" />
              <span className="sr-only">Close dialog</span>
            </button>

            {/* Header Content */}
            {(title || description) && (
              <div className="mb-5 space-y-1.5 pr-6">
                {title && (
                  <h2 className="text-lg font-semibold leading-none tracking-tight text-foreground">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-xs text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div className="text-sm text-foreground/90 leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
`
};

// src/registry/morphing-geometry.ts
var morphingGeometry = {
  name: "morphing-geometry",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "morphing-geometry.tsx",
  content: `'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

export type MorphingShape = 'pill' | 'circle' | 'square' | 'squircle' | 'custom';
export type MorphingVariant = 'gradient' | 'aurora' | 'neon' | 'glass' | 'outline' | 'subtle';
export type MorphingColor = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'rainbow' | 'mono';
export type MorphingSize = 'sm' | 'md' | 'lg' | 'xl' | 'custom';

export interface MorphingGeometryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Shape geometry preset */
  shape?: MorphingShape;
  /** Explicit corner radius (in pixels or css string) when shape is custom or morphed */
  radius?: number | string;
  /** Visual surface variant style */
  variant?: MorphingVariant;
  /** Color theme palette */
  color?: MorphingColor;
  /** Standardized size preset */
  size?: MorphingSize;
  /** Custom width/height dimension in pixels if size is 'custom' */
  dimension?: number;
  /** Whether the geometry undergoes continuous slow rotation */
  spin?: boolean;
  /** Spin duration in seconds */
  spinDuration?: number;
  /** Whether clicking morphs the shape dynamically */
  interactive?: boolean;
  /** Ambient box-shadow glow intensity */
  glow?: boolean;
  /** Icon or graphic to display centered within the shape */
  icon?: React.ReactNode;
  /** Content rendered inside the morphing shape */
  children?: React.ReactNode;
}

const sizeMap: Record<MorphingSize, string> = {
  sm: 'w-16 h-16 text-xs',
  md: 'w-24 h-24 text-sm',
  lg: 'w-32 h-32 text-base',
  xl: 'w-44 h-44 text-lg',
  custom: '',
};

const shapeRadiusMap: Record<MorphingShape, string> = {
  pill: '9999px',
  circle: '50%',
  square: '0px',
  squircle: '28%',
  custom: '16px',
};

const colorGradients: Record<MorphingColor, { bg: string; border: string; glow: string; text: string }> = {
  violet: {
    bg: 'from-violet-600 via-purple-600 to-indigo-700',
    border: 'border-violet-400/40',
    glow: 'rgba(139, 92, 246, 0.45)',
    text: 'text-white',
  },
  cyan: {
    bg: 'from-cyan-500 via-teal-500 to-blue-600',
    border: 'border-cyan-400/40',
    glow: 'rgba(6, 182, 212, 0.45)',
    text: 'text-white',
  },
  emerald: {
    bg: 'from-emerald-500 via-green-600 to-teal-700',
    border: 'border-emerald-400/40',
    glow: 'rgba(16, 185, 129, 0.45)',
    text: 'text-white',
  },
  rose: {
    bg: 'from-rose-500 via-pink-600 to-red-600',
    border: 'border-rose-400/40',
    glow: 'rgba(244, 63, 94, 0.45)',
    text: 'text-white',
  },
  amber: {
    bg: 'from-amber-500 via-orange-600 to-yellow-600',
    border: 'border-amber-400/40',
    glow: 'rgba(245, 158, 11, 0.45)',
    text: 'text-white',
  },
  rainbow: {
    bg: 'from-violet-500 via-pink-500 via-amber-400 to-cyan-400',
    border: 'border-white/30',
    glow: 'rgba(236, 72, 153, 0.45)',
    text: 'text-white',
  },
  mono: {
    bg: 'from-zinc-800 via-zinc-900 to-black dark:from-zinc-100 dark:via-zinc-200 dark:to-white',
    border: 'border-zinc-700 dark:border-zinc-300',
    glow: 'rgba(113, 113, 122, 0.3)',
    text: 'text-white dark:text-zinc-900',
  },
};

/**
 * MorphingGeometry Component
 *
 * An interactive geometric entity with fluid corner transitions, dynamic physics,
 * luminous glow, and continuous ambient rotational states.
 */
export const MorphingGeometry = React.forwardRef<HTMLDivElement, MorphingGeometryProps>(
  (
    {
      shape = 'squircle',
      radius,
      variant = 'gradient',
      color = 'violet',
      size = 'md',
      dimension,
      spin = false,
      spinDuration = 6,
      interactive = false,
      glow = true,
      icon,
      children,
      className,
      style,
      onClick,
      ...props
    },
    ref
  ) => {
    const [currentShape, setCurrentShape] = React.useState<MorphingShape>(shape);

    React.useEffect(() => {
      setCurrentShape(shape);
    }, [shape]);

    const handleInteractiveClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) {
        const shapesList: MorphingShape[] = ['square', 'squircle', 'circle', 'pill'];
        const nextIdx = (shapesList.indexOf(currentShape) + 1) % shapesList.length;
        setCurrentShape(shapesList[nextIdx]);
      }
      onClick?.(e);
    };

    const colorScheme = colorGradients[color] || colorGradients.violet;
    const computedRadius = radius !== undefined
      ? typeof radius === 'number' ? \`\${radius}px\` : radius
      : shapeRadiusMap[currentShape];

    const customDimensionStyle: React.CSSProperties = size === 'custom' && dimension
      ? { width: \`\${dimension}px\`, height: \`\${dimension}px\` }
      : {};

    const glowStyle: React.CSSProperties = glow
      ? { boxShadow: \`0 12px 36px -4px \${colorScheme.glow}\` }
      : {};

    let variantClasses = '';
    if (variant === 'gradient') {
      variantClasses = \`bg-linear-to-tr \${colorScheme.bg} border \${colorScheme.border} \${colorScheme.text}\`;
    } else if (variant === 'aurora') {
      variantClasses = \`bg-linear-to-tr \${colorScheme.bg} border-2 border-white/40 shadow-2xl \${colorScheme.text}\`;
    } else if (variant === 'neon') {
      variantClasses = \`bg-black/90 border-2 \${colorScheme.border} \${colorScheme.text}\`;
    } else if (variant === 'glass') {
      variantClasses = \`bg-white/10 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 text-foreground\`;
    } else if (variant === 'outline') {
      variantClasses = \`bg-transparent border-2 \${colorScheme.border} \${colorScheme.text}\`;
    } else if (variant === 'subtle') {
      variantClasses = \`bg-muted/60 border border-border text-foreground\`;
    }

    return (
      <motion.div
        ref={ref}
        animate={spin ? { rotate: [0, 90, 180, 270, 360] } : { rotate: 0 }}
        transition={{
          rotate: {
            duration: spinDuration,
            repeat: Infinity,
            ease: 'linear',
          },
          borderRadius: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleInteractiveClick}
        className={cn(
          'relative flex items-center justify-center select-none overflow-hidden transition-all duration-300',
          sizeMap[size],
          variantClasses,
          interactive ? 'cursor-pointer' : '',
          className
        )}
        style={{
          borderRadius: computedRadius,
          ...glowStyle,
          ...customDimensionStyle,
          ...style,
        }}
        {...(props as any)}
      >
        {/* Specular ambient surface highlight */}
        <div className="absolute inset-0 bg-linear-to-b from-white/25 via-transparent to-black/20 pointer-events-none" />

        {/* Content / Icon Slot */}
        <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
          {icon || (children ? children : <Sparkles className="w-6 h-6 drop-shadow-md" />)}
        </div>
      </motion.div>
    );
  }
);

MorphingGeometry.displayName = 'MorphingGeometry';
export default MorphingGeometry;
`
};

// src/registry/navigation.ts
var navigation = {
  name: "navigation",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  componentsDependencies: [
    "button"
  ],
  fileName: "navigation.tsx",
  content: `"use client"

import * as React from "react"
import { ChevronRight, ChevronLeft, Check, Home, Search, Bell, User, Settings, Menu } from "lucide-react"
import { cn } from "../utils/cn"
import { Button } from "./button"
import { motion } from "framer-motion"

// 1. Breadcrumb - Navigation path
interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F items
   * @default undefined
   */
  items: { label: string; href?: string }[]
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F separator
   * @default undefined
   */
  separator?: React.ReactNode
}

export function Breadcrumb({ items, separator = <ChevronRight className="h-4 w-4" />, className, ...props }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground bg-muted/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/50 width-fit", className)} {...props}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            {index > 0 && <span className="text-muted-foreground/50">{separator}</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-primary transition-colors font-medium">
                {item.label}
              </a>
            ) : (
              <span className="font-semibold text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// 2. Pagination - Page navigation
interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F totalPages
   * @default undefined
   */
  totalPages: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F currentPage
   * @default undefined
   */
  currentPage: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F onPageChange
   * @default undefined
   */
  onPageChange?: (page: number) => void
}

export function Pagination({ totalPages, currentPage, onPageChange, className, ...props }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className={cn("flex justify-center", className)} {...props}>
      <ul className="flex items-center space-x-2">
        <li>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange?.(page)}
              className={cn("rounded-full", currentPage === page && "shadow-lg shadow-primary/30")}
            >
              {page}
            </Button>
          </li>
        ))}
        <li>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}

// 3. Steps - Visual progress steps
interface Step {
  title: string
  description?: string
  status: "complete" | "current" | "upcoming"
}

export function Steps({ items, className }: { items: Step[]; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-4 group">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                item.status === "complete" && "border-transparent bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20",
                item.status === "current" && "border-primary bg-background text-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10",
                item.status === "upcoming" && "border-muted-foreground/30 bg-muted text-muted-foreground"
              )}
            >
              {item.status === "complete" ? (
                <Check className="h-5 w-5 stroke-[3]" />
              ) : (
                <span>{index + 1}</span>
              )}
            </motion.div>
            {index !== items.length - 1 && (
              <div className={cn(
                "h-full w-0.5 min-h-[30px] my-2 transition-colors duration-300",
                item.status === "complete" ? "bg-emerald-500" : "bg-border"
              )} />
            )}
          </div>
          <div className="pt-1.5 flex-1">
            <h4 className={cn("font-semibold text-base transition-colors", item.status === "current" && "text-primary")}>{item.title}</h4>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// Backward compatibility navbars and menu items
// ============================================

export const SimpleNavbar = () => (
  <nav className="flex items-center justify-between p-4 border-b bg-background w-full">
    <div className="font-bold text-lg">Logo</div>
    <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
      <a href="#" className="text-foreground">Home</a>
      <a href="#" className="hover:text-foreground">About</a>
      <a href="#" className="hover:text-foreground">Services</a>
      <a href="#" className="hover:text-foreground">Contact</a>
    </div>
    <div className="flex gap-4">
      <button><Search className="w-5 h-5" /></button>
      <button className="md:hidden"><Menu className="w-5 h-5" /></button>
    </div>
  </nav>
)

export const CenteredNavbar = () => (
  <nav className="flex items-center justify-between p-4 border-b bg-background w-full">
    <div className="flex-1"><div className="font-bold text-lg">Logo</div></div>
    <div className="hidden md:flex gap-6 text-sm font-medium">
      <a href="#">Products</a>
      <a href="#">Solutions</a>
      <a href="#">Pricing</a>
    </div>
    <div className="flex-1 flex justify-end gap-2">
      <button className="px-4 py-2 text-sm font-medium">Log in</button>
      <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md">Sign up</button>
    </div>
  </nav>
)

export const GlassNavbar = () => (
  <nav className="flex items-center justify-between px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-[90%] mx-auto mt-4 shadow-lg sticky top-4 z-50">
    <div className="font-bold text-white">Glass UI</div>
    <div className="flex gap-6 text-sm font-medium text-white/80">
      <a href="#" className="hover:text-white transition-colors">Features</a>
      <a href="#" className="hover:text-white transition-colors">Pricing</a>
    </div>
    <button className="px-4 py-1.5 bg-white text-black rounded-full text-sm font-bold">Start</button>
  </nav>
)

export const FloatingNavbar = () => (
  <nav className="flex items-center justify-center gap-8 px-8 py-3 bg-card border rounded-full w-fit mx-auto mt-4 shadow-xl">
    <a href="#" className="flex flex-col items-center gap-1 text-primary"><Home className="w-5 h-5" /><span className="text-[10px] font-medium">Home</span></a>
    <a href="#" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><Search className="w-5 h-5" /><span className="text-[10px] font-medium">Search</span></a>
    <a href="#" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><Bell className="w-5 h-5" /><span className="text-[10px] font-medium">Alerts</span></a>
    <a href="#" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"><User className="w-5 h-5" /><span className="text-[10px] font-medium">Profile</span></a>
  </nav>
)

export const SidebarMenu = () => (
  <div className="w-64 h-full min-h-[300px] border-r bg-background p-4 flex flex-col gap-2">
    <div className="font-bold text-xl mb-6 px-2">Dashboard</div>
    <a href="#" className="flex items-center gap-3 px-3 py-2 bg-muted rounded-md font-medium text-sm"><Home className="w-4 h-4" /> Overview</a>
    <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md font-medium text-sm"><Settings className="w-4 h-4" /> Settings</a>
    <a href="#" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md font-medium text-sm mt-auto"><User className="w-4 h-4" /> Account</a>
  </div>
)

export const BottomNav = () => (
  <div className="flex items-center justify-around p-3 border-t bg-background w-full mt-auto">
    <button className="flex flex-col items-center gap-1 text-primary"><Home className="w-5 h-5" /></button>
    <button className="flex flex-col items-center gap-1 text-muted-foreground"><Search className="w-5 h-5" /></button>
    <div className="relative -top-5"><button className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg"><Menu className="w-6 h-6" /></button></div>
    <button className="flex flex-col items-center gap-1 text-muted-foreground"><Bell className="w-5 h-5" /></button>
    <button className="flex flex-col items-center gap-1 text-muted-foreground"><User className="w-5 h-5" /></button>
  </div>
)

export const BreadcrumbTrail = () => (
  <nav className="flex items-center text-sm text-muted-foreground space-x-1">
    <a href="#" className="hover:text-foreground hover:underline">Home</a>
    <ChevronRight className="w-4 h-4" />
    <a href="#" className="hover:text-foreground hover:underline">Products</a>
    <ChevronRight className="w-4 h-4" />
    <span className="text-foreground font-medium">Laptop</span>
  </nav>
)

export const StepIndicator = () => (
  <div className="flex items-center w-full max-w-sm">
    <div className="flex items-center text-primary"><div className="w-8 h-8 rounded-full border-2 border-primary bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div></div>
    <div className="flex-1 h-0.5 bg-primary mx-2"></div>
    <div className="flex items-center text-primary"><div className="w-8 h-8 rounded-full border-2 border-primary bg-background flex items-center justify-center font-bold text-sm">2</div></div>
    <div className="flex-1 h-0.5 bg-muted mx-2"></div>
    <div className="flex items-center text-muted-foreground"><div className="w-8 h-8 rounded-full border-2 border-muted bg-background flex items-center justify-center font-bold text-sm">3</div></div>
  </div>
)

export const TabMenu = () => (
  <div className="flex border-b w-full">
    <button className="px-6 py-3 border-b-2 border-primary text-primary font-medium text-sm">Account</button>
    <button className="px-6 py-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium text-sm transition-colors">Password</button>
    <button className="px-6 py-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground font-medium text-sm transition-colors">Notifications</button>
  </div>
)

export const DropdownMenuVisual = () => (
  <div className="w-48 border bg-card rounded-md shadow-md p-1 flex flex-col">
    <div className="px-2 py-1.5 text-sm font-semibold border-b mb-1">My Account</div>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Profile</button>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Billing</button>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Settings</button>
    <div className="border-t my-1"></div>
    <button className="px-2 py-1.5 text-sm text-left text-destructive hover:bg-destructive/10 rounded-sm transition-colors">Log out</button>
  </div>
)
`
};

// src/registry/node-flow-graph.ts
var nodeFlowGraph = {
  name: "node-flow-graph",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "node-flow-graph.tsx",
  content: `'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, CheckCircle2, AlertCircle, Loader2, Sparkles, Bot, Database, Globe, Cpu, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

export type NodeStatus = 'idle' | 'running' | 'completed' | 'error';

export interface FlowNode {
  id: string;
  label: string;
  type: string;
  icon?: 'bot' | 'db' | 'globe' | 'cpu';
  status: NodeStatus;
  x: number;
  y: number;
  dataSummary?: string;
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  animated?: boolean;
}

export interface NodeFlowGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of initial graph nodes */
  initialNodes?: FlowNode[];
  /** Array of directed edges linking nodes */
  initialEdges?: FlowEdge[];
  /** Whether nodes can be dragged */
  interactive?: boolean;
  /** Whether the execution toolbar is visible */
  showToolbar?: boolean;
  /** Title header for the workflow canvas */
  title?: string;
  /** Theme mode override */
  theme?: 'dark' | 'light' | 'auto';
}

const defaultNodes: FlowNode[] = [
  {
    id: 'n1',
    label: 'AI Intent Classifier',
    type: 'Model Agent',
    icon: 'bot',
    status: 'completed',
    x: 40,
    y: 90,
    dataSummary: 'gpt-4o-mini ~ 99.4% conf',
  },
  {
    id: 'n2',
    label: 'Vector DB Retrieval',
    type: 'Semantic Index',
    icon: 'db',
    status: 'idle',
    x: 290,
    y: 50,
    dataSummary: 'Pinecone / 1536 dims',
  },
  {
    id: 'n3',
    label: 'External API Webhook',
    type: 'Integration',
    icon: 'globe',
    status: 'idle',
    x: 290,
    y: 190,
    dataSummary: 'Stripe v2 Webhook',
  },
  {
    id: 'n4',
    label: 'Synthesis & Dispatch',
    type: 'Executor',
    icon: 'cpu',
    status: 'idle',
    x: 540,
    y: 120,
    dataSummary: '200 OK / 142ms latency',
  },
];

const defaultEdges: FlowEdge[] = [
  { id: 'e1-2', from: 'n1', to: 'n2', animated: true },
  { id: 'e1-3', from: 'n1', to: 'n3', animated: true },
  { id: 'e2-4', from: 'n2', to: 'n4', animated: true },
  { id: 'e3-4', from: 'n3', to: 'n4', animated: true },
];

export const NodeFlowGraph = React.forwardRef<HTMLDivElement, NodeFlowGraphProps>(
  (
    {
      initialNodes = defaultNodes,
      initialEdges = defaultEdges,
      interactive = true,
      showToolbar = true,
      title = 'AGENTIC WORKFLOW PIPELINE',
      theme = 'auto',
      className,
      ...props
    },
    ref
  ) => {
    const [nodes, setNodes] = React.useState<FlowNode[]>(initialNodes);
    const [edges] = React.useState<FlowEdge[]>(initialEdges);
    const [isRunning, setIsRunning] = React.useState(false);
    const [activeEdge, setActiveEdge] = React.useState<string | null>(null);

    const canvasRef = React.useRef<HTMLDivElement>(null);
    const draggingNodeRef = React.useRef<{ id: string; startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);

    // Node dragging handlers
    const handlePointerDown = (id: string, e: React.PointerEvent) => {
      if (!interactive) return;
      const targetNode = nodes.find((n) => n.id === id);
      if (!targetNode) return;

      draggingNodeRef.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        nodeX: targetNode.x,
        nodeY: targetNode.y,
      };
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!draggingNodeRef.current) return;
      const { id, startX, startY, nodeX, nodeY } = draggingNodeRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      setNodes((prev) =>
        prev.map((node) => {
          if (node.id !== id) return node;
          return {
            ...node,
            x: Math.max(10, Math.min(640, nodeX + dx)),
            y: Math.max(10, Math.min(260, nodeY + dy)),
          };
        })
      );
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!draggingNodeRef.current) return;
      (e.target as Element).releasePointerCapture?.(e.pointerId);
      draggingNodeRef.current = null;
    };

    // Sequential pipeline run simulation
    const runPipeline = React.useCallback(async () => {
      if (isRunning) return;
      setIsRunning(true);

      // Reset all nodes
      setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));
      setActiveEdge(null);

      // Step 1: n1 running
      setNodes((prev) => prev.map((n) => (n.id === 'n1' ? { ...n, status: 'running' } : n)));
      await new Promise((r) => setTimeout(r, 700));
      setNodes((prev) => prev.map((n) => (n.id === 'n1' ? { ...n, status: 'completed' } : n)));

      // Data emits along e1-2 & e1-3
      setActiveEdge('e1-2');
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: n2 & n3 running
      setNodes((prev) =>
        prev.map((n) => (n.id === 'n2' || n.id === 'n3' ? { ...n, status: 'running' } : n))
      );
      await new Promise((r) => setTimeout(r, 800));
      setNodes((prev) =>
        prev.map((n) => (n.id === 'n2' || n.id === 'n3' ? { ...n, status: 'completed' } : n))
      );

      // Data emits along e2-4 & e3-4
      setActiveEdge('e2-4');
      await new Promise((r) => setTimeout(r, 600));

      // Step 3: n4 running
      setNodes((prev) => prev.map((n) => (n.id === 'n4' ? { ...n, status: 'running' } : n)));
      await new Promise((r) => setTimeout(r, 750));
      setNodes((prev) => prev.map((n) => (n.id === 'n4' ? { ...n, status: 'completed' } : n)));

      setActiveEdge(null);
      setIsRunning(false);
    }, [isRunning]);

    const resetPipeline = () => {
      setIsRunning(false);
      setActiveEdge(null);
      setNodes(defaultNodes);
    };

    const getNodeCoordinates = (id: string): { outputX: number; outputY: number; inputX: number; inputY: number } => {
      const node = nodes.find((n) => n.id === id);
      if (!node) return { outputX: 0, outputY: 0, inputX: 0, inputY: 0 };
      return {
        outputX: node.x + 190,
        outputY: node.y + 36,
        inputX: node.x,
        inputY: node.y + 36,
      };
    };

    const renderIcon = (icon?: string) => {
      switch (icon) {
        case 'bot':
          return <Bot className="w-3.5 h-3.5 text-cyan-500" />;
        case 'db':
          return <Database className="w-3.5 h-3.5 text-purple-500" />;
        case 'globe':
          return <Globe className="w-3.5 h-3.5 text-emerald-500" />;
        default:
          return <Cpu className="w-3.5 h-3.5 text-amber-500" />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex flex-col p-6 rounded-3xl transition-all duration-300 select-none overflow-hidden',
          'bg-white dark:bg-[#07090f] border border-slate-200/90 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-black/70 w-full',
          className
        )}
        {...props}
      >
        {/* Top Header */}
        <div className="w-full flex items-center justify-between mb-4 z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase">
              {title}
            </span>
          </div>

          {showToolbar && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetPipeline}
                disabled={isRunning}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                title="Reset Workflow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={runPipeline}
                disabled={isRunning}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer',
                  isRunning
                    ? 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30'
                    : 'bg-primary text-primary-foreground border-primary hover:opacity-90 shadow-md shadow-primary/20'
                )}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> EXECUTING...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> RUN PIPELINE
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Interactive Graph Canvas */}
        <div
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full h-[360px] rounded-2xl bg-slate-50 dark:bg-[#090c14] border border-slate-200/70 dark:border-white/5 overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(148, 163, 184, 0.25) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* Connecting SVG Bezier Spline Cables */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="flow-cable-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="cable-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {edges.map((edge) => {
              const fromCoords = getNodeCoordinates(edge.from);
              const toCoords = getNodeCoordinates(edge.to);

              const x1 = fromCoords.outputX;
              const y1 = fromCoords.outputY;
              const x2 = toCoords.inputX;
              const y2 = toCoords.inputY;

              const dx = Math.abs(x2 - x1) * 0.55;
              const pathD = \`M \${x1} \${y1} C \${x1 + dx} \${y1}, \${x2 - dx} \${y2}, \${x2} \${y2}\`;

              const isEdgeActive = isRunning || activeEdge === edge.id;

              return (
                <g key={edge.id}>
                  {/* Background Cable Wire */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="text-slate-300 dark:text-slate-800"
                  />
                  {/* Active Highlight Cable */}
                  {isEdgeActive && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="url(#flow-cable-grad)"
                      strokeWidth={2.5}
                      filter="url(#cable-glow)"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Flow Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              onPointerDown={(e) => handlePointerDown(node.id, e)}
              style={{
                transform: \`translate3d(\${node.x}px, \${node.y}px, 0)\`,
              }}
              className={cn(
                'absolute w-[190px] rounded-xl p-3 select-none transition-shadow duration-200 z-10',
                interactive ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
                'bg-white dark:bg-[#0e121c] border border-slate-200/90 dark:border-white/10 shadow-lg',
                node.status === 'running' && 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
                node.status === 'completed' && 'border-emerald-500/40'
              )}
            >
              {/* Input Port Anchor */}
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-primary" />

              {/* Output Port Anchor */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-emerald-500" />

              {/* Node Header Row */}
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    {renderIcon(node.icon)}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{node.type}</span>
                </div>

                {/* Status Indicator */}
                {node.status === 'running' ? (
                  <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                ) : node.status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : node.status === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                )}
              </div>

              {/* Node Title */}
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {node.label}
              </h4>

              {/* Data Summary Subtext */}
              {node.dataSummary && (
                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-white/5 text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  {node.dataSummary}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

NodeFlowGraph.displayName = 'NodeFlowGraph';
`
};

// src/registry/number-ticker.ts
var numberTicker = {
  name: "number-ticker",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "number-ticker.tsx",
  content: `"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion"
import { cn } from "../utils/cn"

/**
 * Props for the NumberTicker component
 */
export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The target numeric value to animate to
   */
  value: number
  /**
   * Duration of the animation in seconds
   * @default 2
   */
  duration?: number
  /**
   * Optional prefix to display before the number
   */
  prefix?: string
  /**
   * Optional suffix to display after the number
   */
  suffix?: string
  /**
   * Number of decimal places to show
   * @default 0
   */
  decimals?: number
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * NumberTicker component animates a number from 0 to value when it enters the viewport.
 */
const NumberTicker = React.forwardRef<HTMLSpanElement, NumberTickerProps>(
  (
    {
      value,
      duration = 2,
      prefix = "",
      suffix = "",
      decimals = 0,
      className,
      ...props
    },
    ref
  ) => {
    const elementRef = React.useRef<HTMLSpanElement>(null)
    const combinedRef = (ref as React.RefObject<HTMLSpanElement>) || elementRef
    const inView = useInView(combinedRef, { once: true, margin: "0px 0px -50px 0px" })

    // Motion value initialized to 0
    const motionValue = useMotionValue(0)

    // Spring animation for natural spring physics feel
    const springValue = useSpring(motionValue, {
      stiffness: 70,
      damping: 15,
      mass: 1,
    })

    // Transform spring output to clean formatted string
    const displayValue = useTransform(springValue, (latest) => {
      const formatted = Number(latest.toFixed(decimals))
      return formatted.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    })

    React.useEffect(() => {
      if (inView) {
        // Animate the motion value from 0 to the target value
        motionValue.set(value)
      }
    }, [inView, value, motionValue])

    return (
      <span
        ref={combinedRef}
        className={cn(
          "inline-block tabular-nums text-foreground tracking-tight",
          className
        )}
        {...props}
      >
        {prefix}
        <motion.span>{displayValue}</motion.span>
        {suffix}
      </span>
    )
  }
)

NumberTicker.displayName = "NumberTicker"

export { NumberTicker }

export interface AnimatedNumberProps {
  value: number
  className?: string
  duration?: number
  formatFn?: (v: number) => string
}

export function AnimatedNumber({
  value,
  className,
  duration: _duration = 0.5,
  formatFn,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(value)
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 15,
  })

  React.useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  const [displayValue, setDisplayValue] = React.useState(
    formatFn ? formatFn(value) : String(value)
  )

  React.useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (formatFn) {
        setDisplayValue(formatFn(latest))
      } else {
        setDisplayValue(String(Math.round(latest)))
      }
    })
    return () => unsubscribe()
  }, [springValue, formatFn])

  return (
    <span className={cn("inline-block tabular-nums", className)}>
      {displayValue}
    </span>
  )
}

`
};

// src/registry/premium-charts.ts
var premiumCharts = {
  name: "premium-charts",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "premium-charts.tsx",
  content: `"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. DonutChart \u2014 Animated donut/ring chart
// ============================================
export function DonutChart({ value, max = 100, size = 120, strokeWidth = 10, color = "hsl(var(--primary))", label, className }: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  className?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = (value / max) * 100
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted/30" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
        {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
      </div>
    </div>
  )
}

// ============================================
// 2. BarChartSimple \u2014 Animated vertical bars
// ============================================
export function BarChartSimple({ data, height = 200, className }: {
  data: { label: string; value: number; color?: string }[]
  height?: number
  className?: string
}) {
  const maxVal = Math.max(...data.map(d => d.value))

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end gap-2 justify-between" style={{ height }}>
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-muted-foreground">{item.value}</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: \`\${(item.value / maxVal) * 100}%\` }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              className={cn("w-full rounded-t-md min-h-[4px]", item.color || "bg-primary")}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// 3. AreaChart \u2014 Simple area/sparkline chart
// ============================================
export function AreaChartSimple({ data, height = 80, color = "hsl(var(--primary))", className }: {
  data: number[]
  height?: number
  color?: string
  className?: string
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 300
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: height - ((v - min) / range) * (height - 10) - 5,
  }))
  const pathD = points.map((p, i) => (i === 0 ? \`M\${p.x},\${p.y}\` : \`L\${p.x},\${p.y}\`)).join(" ")
  const areaD = \`\${pathD} L\${w},\${height} L0,\${height} Z\`

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox={\`0 0 \${w} \${height}\`} className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaD}
          fill="url(#area-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
    </div>
  )
}

// ============================================
// 4. StatWidget \u2014 Stat with sparkline
// ============================================
export function StatWidget({ title, value, change, changeType = "positive", data = [], className }: {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative"
  data?: number[]
  className?: string
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        {change && (
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
            changeType === "positive" ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"
          )}>{change}</span>
        )}
      </div>
      <p className="text-2xl font-bold mb-3">{value}</p>
      {data.length > 0 && (
        <AreaChartSimple data={data} height={40} color={changeType === "positive" ? "#10b981" : "#ef4444"} />
      )}
    </div>
  )
}

// ============================================
// 5. ProgressCircle \u2014 Circular progress ring
// ============================================
export function ProgressCircle({ value, size = 60, label, className }: {
  value: number
  size?: number
  label?: string
  className?: string
}) {
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted/20" />
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-primary"
        />
      </svg>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  )
}

// ============================================
// 6. ComparisonBar \u2014 Horizontal comparison
// ============================================
export function ComparisonBar({ label1, label2, value1, value2, className }: {
  label1: string
  label2: string
  value1: number
  value2: number
  className?: string
}) {
  const total = value1 + value2
  const percent1 = (value1 / total) * 100
  const percent2 = (value2 / total) * 100

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">{label1} <span className="text-muted-foreground">({value1})</span></span>
        <span className="font-medium">{label2} <span className="text-muted-foreground">({value2})</span></span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: \`\${percent1}%\` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-primary rounded-l-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: \`\${percent2}%\` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="bg-violet-500 rounded-r-full"
        />
      </div>
    </div>
  )
}

// ============================================
// 7. HeatmapGrid \u2014 Activity heatmap
// ============================================
export function HeatmapGrid({ data, columns = 7, className }: {
  data: number[]
  columns?: number
  className?: string
}) {
  const max = Math.max(...data)

  return (
    <div className={cn("inline-grid gap-1", className)} style={{ gridTemplateColumns: \`repeat(\${columns}, 1fr)\` }}>
      {data.map((val, i) => {
        const intensity = max > 0 ? val / max : 0
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: \`hsl(var(--primary) / \${0.1 + intensity * 0.9})\` }}
            title={\`\${val}\`}
          />
        )
      })}
    </div>
  )
}

// ============================================
// 8. LeaderboardWidget \u2014 Ranked list
// ============================================
export function LeaderboardWidget({ items, title, className }: {
  items: { name: string; score: number; avatar?: string }[]
  title?: string
  className?: string
}) {
  const maxScore = Math.max(...items.map(i => i.score))

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      {title && <h4 className="font-semibold mb-4">{title}</h4>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
              i === 0 ? "bg-amber-500/20 text-amber-500" :
              i === 1 ? "bg-slate-300/20 text-slate-400" :
              i === 2 ? "bg-orange-500/20 text-orange-500" :
              "bg-muted text-muted-foreground"
            )}>{i + 1}</span>
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {item.avatar || item.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: \`\${(item.score / maxScore) * 100}%\` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-muted-foreground shrink-0">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// 9. FunnelChart \u2014 Conversion funnel
// ============================================
export function FunnelChart({ steps, className }: {
  steps: { label: string; value: number; color?: string }[]
  className?: string
}) {
  const maxVal = steps[0]?.value || 1

  return (
    <div className={cn("w-full space-y-2", className)}>
      {steps.map((step, i) => {
        const widthPercent = (step.value / maxVal) * 100
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs text-muted-foreground w-20 text-right shrink-0">{step.label}</span>
            <div className="flex-1 h-8 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: \`\${widthPercent}%\` }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={cn("h-full rounded-md flex items-center px-3", step.color || "bg-primary")}
                style={{ minWidth: "40px" }}
              >
                <span className="text-xs font-medium text-primary-foreground">{step.value.toLocaleString()}</span>
              </motion.div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================
// 10. KPIDashboard \u2014 Multi-stat KPI row
// ============================================
export function KPIDashboard({ metrics, className }: {
  metrics: { label: string; value: string; icon?: React.ReactNode; trend?: string; trendType?: "up" | "down" }[]
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {metrics.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{m.label}</span>
            {m.icon && <span className="text-muted-foreground">{m.icon}</span>}
          </div>
          <p className="text-xl font-bold">{m.value}</p>
          {m.trend && (
            <span className={cn("text-xs font-medium",
              m.trendType === "up" ? "text-emerald-500" : "text-red-500"
            )}>
              {m.trendType === "up" ? "\u2191" : "\u2193"} {m.trend}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// Modern Charts Engine (SVG + Framer Motion)
// ============================================

const chartColorMap: Record<string, { stroke: string; fill: string; glow: string; text: string }> = {
  violet: { stroke: "#8b5cf6", fill: "rgba(139, 92, 246, 0.2)", glow: "rgba(139, 92, 246, 0.4)", text: "text-violet-400" },
  cyan: { stroke: "#06b6d4", fill: "rgba(6, 182, 212, 0.2)", glow: "rgba(6, 182, 212, 0.4)", text: "text-cyan-400" },
  emerald: { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.2)", glow: "rgba(16, 185, 129, 0.4)", text: "text-emerald-400" },
  rose: { stroke: "#f43f5e", fill: "rgba(244, 63, 94, 0.2)", glow: "rgba(244, 63, 94, 0.4)", text: "text-rose-400" },
  amber: { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.2)", glow: "rgba(245, 158, 11, 0.4)", text: "text-amber-400" },
};

export interface ModernAreaChartProps {
  data?: { label: string; value: number }[];
  color?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  currency?: string;
  className?: string;
}

export function ModernAreaChart({
  data = [
    { label: "Mon", value: 3400 },
    { label: "Tue", value: 4200 },
    { label: "Wed", value: 3900 },
    { label: "Thu", value: 5800 },
    { label: "Fri", value: 6400 },
    { label: "Sat", value: 5900 },
    { label: "Sun", value: 7800 },
  ],
  color = "violet",
  height = 240,
  showGrid = true,
  showTooltip = true,
  currency = "$",
  className,
}: ModernAreaChartProps) {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const colorTheme = chartColorMap[color] || chartColorMap.violet;

  const padding = { top: 20, right: 20, bottom: 35, left: 45 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values) * 0.85;
  const maxVal = Math.max(...values) * 1.1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(1, data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.value - minVal) / Math.max(1, maxVal - minVal)) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i, a) => {
    if (i === 0) return \`M \${p.x} \${p.y}\`;
    const prev = a[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return \`\${acc} C \${cp1x} \${cp1y}, \${cp2x} \${cp2y}, \${p.x} \${p.y}\`;
  }, "");

  const areaD = points.length > 0
    ? \`\${pathD} L \${points[points.length - 1].x} \${padding.top + chartHeight} L \${points[0].x} \${padding.top + chartHeight} Z\`
    : "";

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1] || { label: "", value: 0, x: 0, y: 0 };

  return (
    <div className={cn("relative w-full select-none", className)}>
      <svg
        viewBox={\`0 0 \${width} \${height}\`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={\`area-grad-\${color}\`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorTheme.stroke} stopOpacity="0.4" />
            <stop offset="85%" stopColor={colorTheme.stroke} stopOpacity="0.02" />
            <stop offset="100%" stopColor={colorTheme.stroke} stopOpacity="0" />
          </linearGradient>
          <filter id={\`glow-\${color}\`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {showGrid && (
          <g className="stroke-border/40" strokeDasharray="3 3">
            {[0, 0.33, 0.66, 1].map((ratio, i) => {
              const y = padding.top + chartHeight * ratio;
              return <line key={i} x1={padding.left} y1={y} x2={width - padding.right} y2={y} />;
            })}
          </g>
        )}

        {areaD && (
          <motion.path
            d={areaD}
            fill={\`url(#area-grad-\${color})\`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}

        <motion.path
          d={pathD}
          fill="none"
          stroke={colorTheme.stroke}
          strokeWidth="2.5"
          filter={\`url(#glow-\${color})\`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {points.map((p, i) => (
          <g key={i} className="cursor-pointer" onMouseEnter={() => setHoverIndex(i)}>
            <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIndex === i ? 5.5 : 3.5}
              fill="#09090b"
              stroke={colorTheme.stroke}
              strokeWidth={hoverIndex === i ? 3 : 2}
              className="transition-all duration-150"
            />
            <text
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className={cn(
                "text-[11px] font-mono fill-muted-foreground transition-colors",
                hoverIndex === i && "fill-foreground font-bold"
              )}
            >
              {p.label}
            </text>
          </g>
        ))}

        {hoverIndex !== null && (
          <line
            x1={activePoint.x}
            y1={padding.top}
            x2={activePoint.x}
            y2={padding.top + chartHeight}
            stroke={colorTheme.stroke}
            strokeWidth="1.5"
            strokeDasharray="2 2"
            opacity="0.6"
          />
        )}
      </svg>

      {showTooltip && (
        <div className="absolute top-2 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-card/90 backdrop-blur-md shadow-lg pointer-events-none">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorTheme.stroke }} />
          <span className="text-xs font-mono text-muted-foreground">{activePoint.label}:</span>
          <span className="text-xs font-mono font-bold text-foreground">
            {currency}
            {activePoint.value.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

export interface ModernBarChartProps {
  data?: { label: string; value: number }[];
  color?: string;
  height?: number;
  className?: string;
}

export function ModernBarChart({
  data = [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 68 },
    { label: "Mar", value: 85 },
    { label: "Apr", value: 52 },
    { label: "May", value: 94 },
    { label: "Jun", value: 76 },
    { label: "Jul", value: 110 },
  ],
  color = "cyan",
  height = 220,
  className,
}: ModernBarChartProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const colorTheme = chartColorMap[color] || chartColorMap.cyan;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15;

  return (
    <div className={cn("w-full select-none space-y-2", className)}>
      <div className="flex items-end gap-3 justify-between w-full px-2" style={{ height }}>
        {data.map((item, idx) => {
          const heightPct = (item.value / maxVal) * 100;
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full gap-2 cursor-pointer group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span
                className={cn(
                  "text-[10px] font-mono text-muted-foreground transition-all duration-150",
                  isHovered && "text-foreground font-bold scale-110"
                )}
              >
                {item.value}
              </span>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: \`\${heightPct}%\` }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={cn(
                  "w-full rounded-t-lg transition-all duration-200 relative overflow-hidden",
                  isHovered ? "opacity-100 shadow-lg" : "opacity-80 hover:opacity-100"
                )}
                style={{
                  backgroundColor: colorTheme.stroke,
                  boxShadow: isHovered ? \`0 0 20px \${colorTheme.glow}\` : "none",
                }}
              >
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-white/20" />
              </motion.div>

              <span
                className={cn(
                  "text-[11px] font-mono text-muted-foreground",
                  isHovered && "text-foreground font-bold"
                )}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface ModernDonutChartProps {
  percentage?: number;
  title?: string;
  subtitle?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ModernDonutChart({
  percentage = 78,
  title = "78%",
  subtitle = "Conversion Rate",
  color = "emerald",
  size = 180,
  strokeWidth = 14,
  className,
}: ModernDonutChartProps) {
  const colorTheme = chartColorMap[color] || chartColorMap.emerald;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center select-none", className)}>
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorTheme.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: \`drop-shadow(0 0 8px \${colorTheme.glow})\`,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <span className="text-3xl font-extrabold text-foreground tracking-tight">{title}</span>
        {subtitle && (
          <span className="text-[11px] font-mono text-muted-foreground mt-0.5">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
`
};

// src/registry/premium-commerce.ts
var premiumCommerce = {
  name: "premium-commerce",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "premium-commerce.tsx",
  content: `"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  Heart,
  Star,
  Check,
  ShieldCheck,
  Lock,
  Download,
  Copy,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Tag
} from "lucide-react"
import { cn } from "../utils/cn"

// ============================================
// 1. ProductCardPro \u2014 Modern Luxury Product Card
// ============================================

export interface ProductCardProProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  price: string | number
  originalPrice?: string | number
  badge?: string
  rating?: number
  reviewCount?: number
  imageSrc?: string
  image?: string
  colors?: string[]
  onAddToCart?: () => void
}

export function ProductCardPro({
  name,
  price,
  originalPrice,
  badge = "Bestseller",
  rating = 4.9,
  reviewCount = 248,
  imageSrc,
  image,
  colors = ["#18181b", "#6366f1", "#06b6d4"],
  onAddToCart,
  className,
  ...props
}: ProductCardProProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const [selectedColor, setSelectedColor] = React.useState(0)
  const [isAdded, setIsAdded] = React.useState(false)

  const effectiveImage = image || imageSrc

  const handleAdd = () => {
    setIsAdded(true)
    onAddToCart?.()
    setTimeout(() => setIsAdded(false), 1800)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "rounded-3xl border border-border/80 bg-card text-card-foreground p-4 w-full max-w-sm shadow-xl shadow-black/5 dark:shadow-black/40 overflow-hidden relative group backdrop-blur-md",
        className
      )}
      {...(props as any)}
    >
      {/* Product Image / Visual Container */}
      <div className="relative aspect-[4/3] rounded-2xl bg-linear-to-br from-muted/60 via-card to-background border border-border/50 overflow-hidden flex items-center justify-center">
        {/* Atmospheric ambient glow */}
        <div
          className="absolute inset-0 opacity-20 blur-2xl transition-colors duration-500 pointer-events-none"
          style={{ backgroundColor: colors[selectedColor] || "#6366f1" }}
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-[11px] font-bold tracking-wide shadow-md backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              {badge}
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 hover:bg-background backdrop-blur-md border border-border/80 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-xs"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isWishlisted ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-foreground"
            )}
          />
        </button>

        {/* Product Visual */}
        {effectiveImage ? (
          <img
            src={effectiveImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 select-none group-hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-primary/20 via-primary/10 to-transparent border border-primary/20 flex items-center justify-center text-primary shadow-lg">
              <ShoppingBag className="w-9 h-9" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
              STUDIO SERIES
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="pt-4 space-y-3">
        {/* Rating & Color Swatches */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-foreground">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>

          {/* Color choices */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1">
              {colors.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedColor(i)}
                  className={cn(
                    "w-4 h-4 rounded-full border border-background shadow-xs transition-transform cursor-pointer",
                    selectedColor === i ? "scale-125 ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                  )}
                  style={{ backgroundColor: c }}
                  title={\`Color option \${i + 1}\`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Name Title */}
        <h3 className="font-bold text-base text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-foreground tracking-tight">
            \${price}
          </span>
          {originalPrice && (
            <span className="text-sm font-medium text-muted-foreground line-through">
              \${originalPrice}
            </span>
          )}
          {originalPrice && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 ml-auto">
              SAVE \${(Number(originalPrice) - Number(price)).toFixed(0)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAdd}
          className={cn(
            "w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md",
            isAdded
              ? "bg-emerald-600 text-white shadow-emerald-500/25"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

// ============================================
// 2. CheckoutSummary \u2014 High-Conversion Order Summary
// ============================================

export interface CheckoutSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  subtotal: string | number
  shipping?: string
  tax?: string | number
  total: string | number
  onCheckout?: () => void
}

export function CheckoutSummary({
  subtotal = "299.98",
  shipping = "Free",
  tax = "24.00",
  total = "323.98",
  onCheckout,
  className,
  ...props
}: CheckoutSummaryProps) {
  const [promoCode, setPromoCode] = React.useState("")
  const [applied, setApplied] = React.useState(false)

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    if (promoCode.trim()) {
      setApplied(true)
    }
  }

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md p-6 w-full max-w-md shadow-2xl shadow-black/10 dark:shadow-black/40 space-y-5 text-card-foreground",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <h3 className="font-bold text-base text-foreground tracking-tight">Order Summary</h3>
        <span className="text-xs font-mono text-muted-foreground">3 Items</span>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value)
              setApplied(false)
            }}
            placeholder="Discount code or gift card"
            className="w-full pl-8.5 pr-3 py-2 text-xs rounded-xl border border-border bg-background/60 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={!promoCode.trim() || applied}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border disabled:opacity-40 transition-colors cursor-pointer"
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </form>

      {/* Cost Breakdown */}
      <div className="space-y-2.5 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-mono font-medium text-foreground">\${subtotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Express Delivery</span>
          <span className="font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {shipping}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Estimated Taxes (HST)</span>
          <span className="font-mono font-medium text-foreground">\${tax}</span>
        </div>

        {applied && (
          <div className="flex justify-between items-center text-emerald-500 font-medium">
            <span>Promo Discount (10% OFF)</span>
            <span className="font-mono">-$29.99</span>
          </div>
        )}
      </div>

      {/* Total Separator */}
      <div className="pt-3 border-t border-border flex items-baseline justify-between">
        <div>
          <span className="font-bold text-sm text-foreground">Total Due</span>
          <p className="text-[10px] text-muted-foreground">Includes all regional sales taxes</p>
        </div>
        <span className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
          \${total}
        </span>
      </div>

      {/* Primary CTA Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onCheckout}
        className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <Lock className="w-3.5 h-3.5" />
        <span>Complete Secure Checkout</span>
      </motion.button>

      {/* Security & Trust Row */}
      <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-muted-foreground select-none">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>256-Bit SSL</span>
        </div>
        <span>\u2022</span>
        <span>Money-Back Guarantee</span>
        <span>\u2022</span>
        <span>Apple Pay</span>
      </div>
    </div>
  )
}

// ============================================
// 3. SubscriptionCard \u2014 Modern SaaS Tier Card
// ============================================

export interface SubscriptionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  plan: string
  price: string | number
  billingPeriod?: string
  nextBilling?: string
  status?: "active" | "cancelled" | "past_due"
  features?: string[]
  isPopular?: boolean
  onUpgrade?: () => void
}

export function SubscriptionCard({
  plan = "Pro Developer",
  price = "49",
  billingPeriod = "month",
  nextBilling = "Oct 01, 2026",
  status = "active",
  features = [
    "Unlimited Team Workspaces",
    "Real-time Cloud Analytics",
    "Priority 24/7 Support",
    "Dedicated CDN Edge Endpoints",
    "Custom Domain Verification"
  ],
  isPopular = true,
  onUpgrade,
  className,
  ...props
}: SubscriptionCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md p-6 w-full max-w-sm shadow-xl relative overflow-hidden text-card-foreground space-y-6",
        isPopular && "border-primary/50 shadow-primary/10",
        className
      )}
      {...props}
    >
      {/* Decorative Glow */}
      {isPopular && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {plan}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-foreground tracking-tight font-mono">
              \${price}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/{billingPeriod}</span>
          </div>
        </div>

        {isPopular && (
          <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider">
            POPULAR
          </span>
        )}
      </div>

      {/* Features List */}
      <div className="space-y-2.5 pt-2 border-t border-border/60">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Included with plan:
        </p>
        <ul className="space-y-2 text-xs">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-foreground/90">
              <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onUpgrade}
        className="w-full py-3 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <span>Upgrade to {plan}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  )
}

// ============================================
// 4. CreditCardVisual \u2014 Holographic Luxury Card
// ============================================

export interface CreditCardVisualProps extends React.HTMLAttributes<HTMLDivElement> {
  holder?: string
  number?: string
  expiry?: string
  type?: "visa" | "mastercard" | "amex"
}

export function CreditCardVisual({
  holder = "ALEXANDER VANCE",
  number = "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 8842",
  expiry = "09/29",
  type = "visa",
  className,
  ...props
}: CreditCardVisualProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-sm aspect-[1.6/1] rounded-2xl bg-linear-to-tr from-zinc-950 via-zinc-900 to-zinc-800 border border-white/10 p-6 text-white shadow-2xl overflow-hidden select-none flex flex-col justify-between",
        className
      )}
      {...props}
    >
      {/* Gloss reflection overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header with Chip and Contactless */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {/* Gold EMV Chip */}
          <div className="w-10 h-7 rounded-md bg-linear-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200/50 shadow-xs relative overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-amber-900/30" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-amber-900/30" />
          </div>

          {/* Contactless Wave */}
          <svg className="w-5 h-5 text-white/70 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.393 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>

        {/* Brand */}
        <span className="font-mono text-sm font-extrabold tracking-widest uppercase opacity-80">
          NEXORE BLACK
        </span>
      </div>

      {/* Middle Card Number */}
      <div className="z-10 tracking-[0.2em] font-mono text-lg text-white/95 font-medium shadow-xs">
        {number}
      </div>

      {/* Bottom Cardholder & Expiry */}
      <div className="flex items-end justify-between z-10 text-[11px] font-mono">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-white/50">CARDHOLDER</p>
          <p className="font-semibold tracking-wider uppercase text-white/90">{holder}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-widest text-white/50">EXPIRES</p>
          <p className="font-semibold tracking-wider text-white/90">{expiry}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 5. CartItem \u2014 Modern Cart Drawer List Item
// ============================================

export interface CartItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  price: string | number
  quantity?: number
  onQuantityChange?: (qty: number) => void
  onRemove?: () => void
}

export function CartItem({
  name,
  price,
  quantity = 1,
  onQuantityChange,
  onRemove,
  className,
  ...props
}: CartItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 py-3.5 px-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-primary shrink-0">
        <ShoppingBag className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm truncate text-foreground">{name}</h4>
        <p className="text-xs font-mono font-bold text-primary mt-0.5">\${price}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0 bg-muted/40 p-1 rounded-xl border border-border/60">
        <button
          type="button"
          onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
          className="w-6 h-6 rounded-lg bg-card hover:bg-muted flex items-center justify-center text-xs transition-colors cursor-pointer border border-border/40"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-xs font-mono font-bold">{quantity}</span>
        <button
          type="button"
          onClick={() => onQuantityChange?.(quantity + 1)}
          className="w-6 h-6 rounded-lg bg-card hover:bg-muted flex items-center justify-center text-xs transition-colors cursor-pointer border border-border/40"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ============================================
// 6. InvoiceCard \u2014 Digital Invoice Summary
// ============================================

export interface InvoiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  invoiceNumber: string
  date: string
  status?: "paid" | "pending" | "overdue"
  amount: string | number
  client: string
  onDownload?: () => void
}

export function InvoiceCard({
  invoiceNumber = "INV-2026-001",
  date = "Oct 24, 2026",
  status = "paid",
  amount = "1,250.00",
  client = "Acme Global Corp",
  onDownload,
  className,
  ...props
}: InvoiceCardProps) {
  const statusStyles = {
    paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    overdue: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 hover:shadow-lg transition-all duration-200 w-full max-w-sm text-card-foreground space-y-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-xs font-bold text-foreground">{invoiceNumber}</span>
          <p className="text-[11px] text-muted-foreground">{date}</p>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border",
            statusStyles[status] || statusStyles.paid
          )}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">BILLED TO</p>
          <p className="text-xs font-semibold text-foreground">{client}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">AMOUNT</p>
          <p className="text-lg font-bold font-mono text-foreground">\${amount}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDownload || (() => alert("Downloading PDF..."))}
        className="w-full py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-primary" />
        <span>Download Receipt (PDF)</span>
      </button>
    </div>
  )
}

// ============================================
// 7. CouponCard \u2014 Promotional Voucher
// ============================================

export interface CouponCardProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
  discount: string
  description?: string
  validUntil?: string
}

export function CouponCard({
  code = "NEXORE50",
  discount = "50% OFF",
  description = "Valid across all annual developer packages.",
  validUntil = "Dec 31, 2026",
  className,
  ...props
}: CouponCardProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 w-full max-w-sm relative overflow-hidden text-card-foreground space-y-3",
        className
      )}
      {...props}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-black text-primary font-mono">{discount}</span>
        {validUntil && <span className="text-[10px] font-mono text-muted-foreground">Exp: {validUntil}</span>}
      </div>

      {description && <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>}

      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1 px-3 py-2 rounded-xl bg-background border border-border font-mono text-xs text-center font-bold tracking-widest text-foreground">
          {code}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
    </div>
  )
}

// ============================================
// 8. PricingSlider \u2014 Interactive Tiers Slider
// ============================================

export interface PricingSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers?: { name: string; price: string | number; features: string[] }[]
}

export function PricingSlider({
  tiers = [
    { name: "Starter", price: "19", features: ["Up to 5 Projects", "Community Support", "Basic Analytics"] },
    { name: "Professional", price: "49", features: ["Unlimited Projects", "Priority Support", "Advanced Analytics", "Custom Domain"] },
    { name: "Enterprise", price: "99", features: ["Unlimited Everything", "24/7 Phone Support", "Custom SLAs", "Dedicated Engineer"] },
  ],
  className,
  ...props
}: PricingSliderProps) {
  const [selected, setSelected] = React.useState(1)
  const current = tiers[selected] || tiers[0]

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-6 w-full max-w-md shadow-xl text-card-foreground space-y-5",
        className
      )}
      {...props}
    >
      <div className="text-center space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">{current.name} Plan</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-extrabold font-mono text-foreground">\${current.price}</span>
          <span className="text-xs text-muted-foreground font-mono">/month</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={tiers.length - 1}
        value={selected}
        onChange={(e) => setSelected(Number(e.target.value))}
        className="w-full accent-primary cursor-pointer"
      />

      <div className="space-y-2 pt-2 border-t border-border/60">
        <p className="text-[11px] font-bold text-muted-foreground uppercase">Key Features:</p>
        <ul className="space-y-1.5 text-xs">
          {current.features.map((f, idx) => (
            <li key={idx} className="flex items-center gap-2 text-foreground/90">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ============================================
// 9. ReviewStars & TrustBadge
// ============================================

export function ReviewStars({ rating = 4.8, size = 18, reviewCount }: { rating?: number; size?: number; reviewCount?: number }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} style={{ width: size, height: size }} className={cn(s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted/40")} />
        ))}
      </div>
      <span className="text-xs font-bold text-foreground">{rating}</span>
      {reviewCount && <span className="text-xs text-muted-foreground">({reviewCount})</span>}
    </div>
  )
}

export function TrustBadge({
  icon,
  title = "Guaranteed Checkout",
  subtitle = "256-Bit SSL Protection",
  className,
}: {
  icon?: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn("inline-flex items-center gap-3 p-3 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs", className)}>
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon || <ShieldCheck className="w-5 h-5" />}
      </div>
      <div>
        <h5 className="text-xs font-bold text-foreground leading-tight">{title}</h5>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
`
};

// src/registry/premium-effects.ts
var premiumEffects = {
  name: "premium-effects",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "premium-effects.tsx",
  content: `"use client"

import * as React from "react"
import { motion, useMotionValue, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. GlowSpotlightCard \u2014 Cursor-tracking glowing card
// ============================================
export interface GlowSpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F children
   * @default undefined
   */
  children: React.ReactNode
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F glowColor
   * @default undefined
   */
  glowColor?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F glowSize
   * @default undefined
   */
  glowSize?: number
}

export const GlowSpotlightCard = React.forwardRef<HTMLDivElement, GlowSpotlightCardProps>(
  ({ children, className, glowColor = "rgba(139, 92, 246, 0.15)", glowSize = 300, ...props }, ref) => {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const handleMouseMove = React.useCallback(
      ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
      },
      [mouseX, mouseY]
    )

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md",
          className
        )}
        {...props}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: \`radial-gradient(\${glowSize}px circle at var(--x, 0px) var(--y, 0px), \${glowColor}, transparent 80%)\`,
            // Custom properties injected dynamically
            WebkitMaskImage: "radial-gradient(circle, black, transparent)",
          }}
          animate={{
            opacity: [0, 1],
          }}
        />
        {/* Fallback mouse tracker using CSS variables */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={
            {
              background: \`radial-gradient(\${glowSize}px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), \${glowColor}, transparent 80%)\`,
              "--mouse-x": mouseX.get() + "px",
              "--mouse-y": mouseY.get() + "px",
            } as React.CSSProperties
          }
        />
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)
GlowSpotlightCard.displayName = "GlowSpotlightCard"

// ============================================
// 2. WordFadeReveal \u2014 Word-by-word fade with spring
// ============================================
export interface WordFadeRevealProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F text
   * @default undefined
   */
  text: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F delay
   * @default undefined
   */
  delay?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F delayMultiple
   * @default undefined
   */
  delayMultiple?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F duration
   * @default undefined
   */
  duration?: number
}

export function WordFadeReveal({
  text,
  className,
  delay = 0,
  delayMultiple = 0.05,
  duration = 0.5,
  ...props
}: WordFadeRevealProps) {
  const words = text.split(" ")

  return (
    <h3 className={cn("flex flex-wrap justify-center gap-x-1.5", className)} {...props}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: delay + i * delayMultiple,
            duration,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h3>
  )
}

// ============================================
// 3. AnimatedGridBackground \u2014 Tech grid with flashing cells
// ============================================
export interface AnimatedGridBackgroundProps extends React.SVGProps<SVGSVGElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F width
   * @default undefined
   */
  width?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F height
   * @default undefined
   */
  height?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F strokeWidth
   * @default undefined
   */
  strokeWidth?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F strokeColor
   * @default undefined
   */
  strokeColor?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F cellFlashColor
   * @default undefined
   */
  cellFlashColor?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F flashInterval
   * @default undefined
   */
  flashInterval?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F maxFlashes
   * @default undefined
   */
  maxFlashes?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
}

export function AnimatedGridBackground({
  width = 40,
  height = 40,
  strokeWidth = 1,
  strokeColor = "rgba(255, 255, 255, 0.05)",
  cellFlashColor = "rgba(139, 92, 246, 0.1)",
  flashInterval = 1000,
  maxFlashes = 4,
  className,
  ...props
}: AnimatedGridBackgroundProps) {
  const id = React.useId()
  const [flashingCells, setFlashingCells] = React.useState<{ x: number; y: number; id: number }[]>([])

  React.useEffect(() => {
    const timer = setInterval(() => {
      setFlashingCells((prev) => {
        // Randomly add new flash cells and limit maximum flashing cells
        const newFlash = {
          x: Math.floor(Math.random() * 20) * width,
          y: Math.floor(Math.random() * 20) * height,
          id: Math.random(),
        }
        const filtered = prev.filter((_, idx) => idx > prev.length - maxFlashes)
        return [...filtered, newFlash]
      })
    }, flashInterval)

    return () => clearInterval(timer)
  }, [width, height, flashInterval, maxFlashes])

  return (
    <svg
      className={cn("absolute inset-0 h-full w-full pointer-events-none select-none", className)}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x="-1"
          y="-1"
        >
          <path
            d={\`M \${width} 0 L 0 0 0 \${height}\`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={\`url(#\${id})\`} />
      <AnimatePresence>
        {flashingCells.map((cell) => (
          <motion.rect
            key={cell.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            x={cell.x}
            y={cell.y}
            width={width - strokeWidth}
            height={height - strokeWidth}
            fill={cellFlashColor}
          />
        ))}
      </AnimatePresence>
    </svg>
  )
}

// ============================================
// 4. BentoGrid \u2014 Premium Dashboard Layout
// ============================================
export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F children
   * @default undefined
   */
  children: React.ReactNode
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
}

export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[180px] w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  header?: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
  span?: string
  delay?: number
}

export function BentoCard({
  title,
  description,
  header,
  icon,
  children,
  span = "md:col-span-1",
  className,
  delay = 0,
  ...props
}: BentoCardProps) {
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 100, damping: 15 }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/10 p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/20",
        span,
        className
      )}
      {...(motionSafeProps as any)}
    >
      {/* Glow highlight */}
      <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-tr from-primary/5 via-transparent to-transparent" />

      {header && <div className="w-full overflow-hidden rounded-lg mb-4">{header}</div>}

      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary transition-transform duration-300 group-hover:scale-110">{icon}</div>}
          <h3 className="font-semibold tracking-tight text-card-foreground text-sm md:text-base">
            {title}
          </h3>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground max-w-[220px]">
          {description}
        </p>
      </div>

      {children && <div className="mt-4">{children}</div>}
    </motion.div>
  )
}
`
};

// src/registry/premium-media.ts
var premiumMedia = {
  name: "premium-media",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "premium-media.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. ImageCarousel \u2014 Auto-playing carousel
// ============================================
export function ImageCarousel({ images, autoPlay = true, interval = 4000, className }: {
  images: { src: string; alt?: string }[]
  autoPlay?: boolean
  interval?: number
  className?: string
}) {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!autoPlay || images.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, images.length])

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-muted", className)}>
      <div className="relative aspect-video">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: i === current ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="w-full h-full bg-linear-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center text-muted-foreground">
              {img.alt || \`Slide \${i + 1}\`}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn("w-2 h-2 rounded-full transition-all", i === current ? "bg-white w-6" : "bg-white/50 hover:bg-white/70")}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================
// 2. VideoPlayer \u2014 Styled video player
// ============================================
export function VideoPlayer({ title, duration = "3:45", thumbnail: _thumbnail, className }: {
  title?: string
  duration?: string
  thumbnail?: string
  className?: string
}) {
  const [playing, setPlaying] = React.useState(false)

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-muted group cursor-pointer", className)}>
      <div className="aspect-video bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPlaying(!playing)}
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg"
        >
          {playing ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          ) : (
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </motion.button>
      </div>
      {(title || duration) && (
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
          {title && <p className="text-white text-sm font-medium">{title}</p>}
          {duration && <span className="text-white/70 text-xs">{duration}</span>}
        </div>
      )}
    </div>
  )
}

// ============================================
// 3. AudioWaveform \u2014 Audio visualizer
// ============================================
export function AudioWaveform({ playing = false, bars = 24, className }: {
  playing?: boolean
  bars?: number
  className?: string
}) {
  return (
    <div className={cn("flex items-end gap-[2px] h-8", className)}>
      {Array.from({ length: bars }).map((_, i) => {
        const height = Math.random() * 100
        return (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-primary"
            animate={playing ? {
              height: [\`\${20 + Math.random() * 30}%\`, \`\${50 + Math.random() * 50}%\`, \`\${20 + Math.random() * 30}%\`],
            } : { height: "20%" }}
            transition={playing ? {
              duration: 0.4 + Math.random() * 0.4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            } : {}}
            style={{ height: \`\${height}%\` }}
          />
        )
      })}
    </div>
  )
}

import { FileText, Image as ImageIcon, Video as VideoIcon, FileCode2, Code2 } from "lucide-react"

// ============================================
// 4. FilePreviewCard \u2014 File with icon/preview
// ============================================
export function FilePreviewCard({ name, size, type = "file", className }: {
  name: string
  size: string
  type?: "file" | "image" | "video" | "pdf" | "code"
  className?: string
}) {
  const iconMap = {
    file: FileText,
    image: ImageIcon,
    video: VideoIcon,
    pdf: FileCode2,
    code: Code2,
  }
  const Icon = iconMap[type] || FileText

  const colors = {
    file: "from-blue-500/10 to-blue-500/5 text-blue-500",
    image: "from-pink-500/10 to-pink-500/5 text-pink-500",
    video: "from-violet-500/10 to-violet-500/5 text-violet-500",
    pdf: "from-red-500/10 to-red-500/5 text-red-500",
    code: "from-emerald-500/10 to-emerald-500/5 text-emerald-500",
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn("rounded-xl border border-border bg-card p-4 flex items-center gap-3 cursor-pointer transition-shadow hover:shadow-md", className)}
    >
      <div className={cn("w-12 h-12 rounded-lg bg-linear-to-br flex items-center justify-center shrink-0 border border-border/40", colors[type])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{size}</p>
      </div>
      <svg className="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </motion.div>
  )
}

// ============================================
// 5. EmbedCard \u2014 oEmbed-style preview card
// ============================================
export function EmbedCard({ title, description, domain, favicon, className }: {
  title: string
  description?: string
  domain: string
  favicon?: string
  className?: string
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer", className)}>
      <div className="h-36 bg-linear-to-br from-violet-500/20 via-blue-500/20 to-pink-500/20" />
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[8px]">
            {favicon || domain.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-muted-foreground">{domain}</span>
        </div>
        <h4 className="text-sm font-semibold mb-1 line-clamp-1">{title}</h4>
        {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}
      </div>
    </div>
  )
}

// ============================================
// 6. MusicPlayer \u2014 Mini music player widget
// ============================================
export function MusicPlayer({ title, artist, album, className }: {
  title: string
  artist: string
  album?: string
  className?: string
}) {
  const [playing, setPlaying] = React.useState(false)
  const [progress] = React.useState(35)

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 w-full max-w-sm", className)}>
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          animate={playing ? { rotate: 360 } : {}}
          transition={playing ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
          className="w-14 h-14 rounded-full bg-linear-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shrink-0"
        >
          <div className="w-5 h-5 rounded-full bg-background" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{artist}</p>
          {album && <p className="text-xs text-muted-foreground/60 truncate">{album}</p>}
        </div>
      </div>
      <div className="mb-3">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: \`\${progress}%\` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>1:15</span>
          <span>3:45</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/></svg>
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setPlaying(!playing)}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
        >
          {playing ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </motion.button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 18h-2V6h2v12zm-3.5-6L6 6v12l8.5-6z"/></svg>
        </button>
      </div>
    </div>
  )
}

// ============================================
// 7. ImageCompare \u2014 Before/After slider
// ============================================
export function ImageCompare({ 
  leftImage, 
  rightImage, 
  leftLabel = "Before", 
  rightLabel = "After", 
  className 
}: {
  leftImage?: string
  rightImage?: string
  leftLabel?: string
  rightLabel?: string
  className?: string
}) {
  const [position, setPosition] = React.useState(50)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, x)))
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    if (e.touches[0]) {
      const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100
      setPosition(Math.max(0, Math.min(100, x)))
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative aspect-video rounded-xl overflow-hidden cursor-col-resize select-none", className)}
      onMouseMove={handleMove}
      onTouchMove={handleTouchMove}
    >
      {/* Right side (Background - After) */}
      {rightImage ? (
        <img src={rightImage} alt={rightLabel} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-slate-600 to-slate-800" />
      )}

      {/* Left side (Foreground - Before) */}
      {leftImage ? (
        <img 
          src={leftImage} 
          alt={leftLabel} 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ clipPath: \`inset(0 \${100 - position}% 0 0)\` }} 
        />
      ) : (
        <div 
          className="absolute inset-0 bg-linear-to-br from-violet-500 to-pink-500" 
          style={{ clipPath: \`inset(0 \${100 - position}% 0 0)\` }} 
        />
      )}

      <div className="absolute top-0 bottom-0" style={{ left: \`\${position}%\` }}>
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg -translate-x-1/2" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
        </div>
      </div>
      <span className="absolute top-3 left-3 text-xs font-medium text-white bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">{leftLabel}</span>
      <span className="absolute top-3 right-3 text-xs font-medium text-white bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">{rightLabel}</span>
    </div>
  )
}

// ============================================
// 8. GalleryGrid \u2014 Masonry-style gallery
// ============================================
export function GalleryGrid({ items, className }: {
  items: { title: string; color?: string }[]
  className?: string
}) {
  const colors = [
    "from-violet-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
  ]

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-3", className)}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          className={cn(
            "rounded-xl bg-linear-to-br p-4 flex items-end cursor-pointer transition-shadow hover:shadow-lg",
            item.color || colors[i % colors.length],
            i === 0 ? "row-span-2 min-h-[200px]" : "min-h-[100px]"
          )}
        >
          <span className="text-white text-sm font-medium drop-shadow-md">{item.title}</span>
        </motion.div>
      ))}
    </div>
  )
}

// ============================================
// 9. CodeSnippet \u2014 Syntax-highlighted block
// ============================================
export function CodeSnippet({ code, language = "tsx", filename, className }: {
  code: string
  language?: string
  filename?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  return (
    <div className={cn("rounded-xl border border-border bg-slate-950 overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {filename && <span className="text-xs text-slate-400 ml-2 font-mono">{filename}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono uppercase">{language}</span>
          <button
            onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
          </button>
        </div>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="font-mono text-slate-200">{code}</code>
      </pre>
    </div>
  )
}

// ============================================
// 10. TestimonialCarousel \u2014 Animated testimonials
// ============================================
export function TestimonialCarousel({ testimonials, className }: {
  testimonials: { quote: string; author: string; role: string }[]
  className?: string
}) {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const t = testimonials[current]

  return (
    <div className={cn("relative text-center py-8", className)}>
      <svg className="w-10 h-10 text-primary/20 mx-auto mb-4" fill="currentColor" viewBox="0 0 32 32">
        <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z"/>
      </svg>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg leading-relaxed mb-4 max-w-lg mx-auto">{t.quote}</p>
          <p className="font-semibold text-sm">{t.author}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-1.5 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn("w-2 h-2 rounded-full transition-all", i === current ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50")}
          />
        ))}
      </div>
    </div>
  )
}
`
};

// src/registry/premium-overlays.ts
var premiumOverlays = {
  name: "premium-overlays",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  componentsDependencies: [
    "scroll-area"
  ],
  fileName: "premium-overlays.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"
import { X } from "lucide-react"

// ============================================
// 1. ScrollArea Re-export
// ============================================
export { ScrollArea, type ScrollAreaProps } from "./scroll-area"

// ============================================
// 2. Drawer \u2014 Slide-in panel from bottom or side
// ============================================
export interface DrawerProps {
  /** Whether the drawer is open */
  open: boolean
  /** Callback when drawer should close */
  onClose: () => void
  /** Direction the drawer slides from */
  side?: "bottom" | "right" | "left"
  /** Drawer content */
  children: React.ReactNode
  /** Additional CSS classes for the drawer panel */
  className?: string
  /** Title for the drawer header */
  title?: string
}

const slideVariants = {
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    className: "inset-x-0 bottom-0 rounded-t-2xl max-h-[85vh]",
  },
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    className: "inset-y-0 right-0 w-full max-w-md h-full",
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    className: "inset-y-0 left-0 w-full max-w-md h-full",
  },
}

export function Drawer({
  open,
  onClose,
  side = "bottom",
  children,
  className,
  title,
}: DrawerProps) {
  const variant = slideVariants[side]

  // Close on Escape key
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "absolute bg-card border border-border shadow-2xl overflow-y-auto",
              variant.className,
              className
            )}
          >
            {/* Handle for bottom drawer */}
            {side === "bottom" && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
              </div>
            )}
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// 3. CommandPalette \u2014 Cmd+K search overlay
// ============================================
export interface CommandPaletteItem {
  /** Unique identifier */
  id: string
  /** Display label */
  label: string
  /** Optional icon */
  icon?: React.ReactNode
  /** Optional group/category */
  group?: string
  /** Action when selected */
  onSelect?: () => void
}

export interface CommandPaletteProps {
  /** Whether the palette is open */
  open: boolean
  /** Callback when palette should close */
  onClose: () => void
  /** Items to display */
  items: CommandPaletteItem[]
  /** Placeholder text */
  placeholder?: string
  /** Additional CSS classes */
  className?: string
}

export function CommandPalette({
  open,
  onClose,
  items,
  placeholder = "Type a command or search...",
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const filtered = React.useMemo(
    () => items.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  )

  // Group items
  const groups = React.useMemo(() => {
    const map = new Map<string, CommandPaletteItem[]>()
    filtered.forEach(item => {
      const group = item.group || "Results"
      if (!map.has(group)) map.set(group, [])
      map.get(group)!.push(item)
    })
    return map
  }, [filtered])

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
    }
  }, [open])

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        filtered[selectedIndex]?.onSelect?.()
        onClose()
      } else if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, filtered, selectedIndex, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "relative w-full max-w-lg mx-4 bg-card border border-border rounded-xl shadow-2xl overflow-hidden",
              className
            )}
          >
            {/* Search input */}
            <div className="flex items-center gap-2 px-4 border-b border-border">
              <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder={placeholder}
              />
            </div>
            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filtered.length > 0 ? (
                Array.from(groups.entries()).map(([groupName, groupItems]) => (
                  <div key={groupName}>
                    <div className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {groupName}
                    </div>
                    {groupItems.map((item) => {
                      const globalIndex = filtered.indexOf(item)
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            item.onSelect?.()
                            onClose()
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-left",
                            globalIndex === selectedIndex
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-muted/50"
                          )}
                        >
                          {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No results found.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// ============================================
// 4. ContextMenu \u2014 Right-click context menu
// ============================================
export interface ContextMenuItem {
  /** Display label */
  label: string
  /** Action when clicked */
  onClick?: () => void
  /** Keyboard shortcut hint */
  shortcut?: string
  /** Whether this is a separator */
  separator?: boolean
  /** Whether the item is disabled */
  disabled?: boolean
  /** Whether this is a destructive action */
  destructive?: boolean
}

export interface ContextMenuProps {
  /** Items in the context menu */
  items: ContextMenuItem[]
  /** Content to right-click on */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const menuRef = React.useRef<HTMLDivElement>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setOpen(true)
  }

  React.useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener("click", close)
    window.addEventListener("scroll", close)
    window.addEventListener("resize", close)
    return () => {
      window.removeEventListener("click", close)
      window.removeEventListener("scroll", close)
      window.removeEventListener("resize", close)
    }
  }, [open])

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className}>
        {children}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-[100] min-w-[180px] bg-card border border-border rounded-lg shadow-xl p-1 overflow-hidden"
            style={{ left: position.x, top: position.y }}
          >
            {items.map((item, i) =>
              item.separator ? (
                <div key={i} className="my-1 h-px bg-border" />
              ) : (
                <button
                  key={i}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.()
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-md px-3 py-1.5 text-sm transition-colors",
                    item.disabled && "opacity-50 cursor-not-allowed",
                    item.destructive
                      ? "text-destructive hover:bg-destructive/10"
                      : "hover:bg-accent"
                  )}
                >
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className="text-[11px] text-muted-foreground font-mono">{item.shortcut}</span>
                  )}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
`
};

// src/registry/premium-social.ts
var premiumSocial = {
  name: "premium-social",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "premium-social.tsx",
  content: `'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Bell,
  Copy,
  Plus,
  MessageSquare,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../utils/cn';

// ============================================================================
// 1. CHAT MESSAGE (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface ChatMessageContextValue {
  variant: 'sent' | 'received';
  isOwn: boolean;
}

const ChatMessageContext = React.createContext<ChatMessageContextValue>({
  variant: 'received',
  isOwn: false,
});

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sent' | 'received';
  isOwn?: boolean;
  // Legacy / fallback props:
  message?: string;
  sender?: string;
  time?: string;
  avatar?: string;
  children?: React.ReactNode;
}

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      variant,
      isOwn,
      message,
      sender,
      time,
      avatar,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedVariant: 'sent' | 'received' =
      variant || (isOwn ? 'sent' : 'received');
    const resolvedIsOwn = resolvedVariant === 'sent';

    const contextValue = React.useMemo(
      () => ({ variant: resolvedVariant, isOwn: resolvedIsOwn }),
      [resolvedVariant, resolvedIsOwn]
    );

    // If compound children are provided, render compound tree
    if (children) {
      return (
        <ChatMessageContext.Provider value={contextValue}>
          <div
            ref={ref}
            className={cn(
              'flex gap-3 group/msg transition-all duration-200',
              resolvedIsOwn ? 'flex-row-reverse justify-start' : 'flex-row justify-start',
              className
            )}
            {...props}
          >
            {children}
          </div>
        </ChatMessageContext.Provider>
      );
    }

    // Graceful backward compatibility with flat props
    return (
      <ChatMessageContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            'flex gap-3 group/msg transition-all duration-200',
            resolvedIsOwn ? 'flex-row-reverse justify-start' : 'flex-row justify-start',
            className
          )}
          {...props}
        >
          <ChatMessageAvatar fallback={avatar || sender?.charAt(0) || 'U'} />
          <ChatMessageBody>
            {(sender || time) && (
              <ChatMessageHeader>
                {sender && <ChatMessageSender>{sender}</ChatMessageSender>}
                {time && <ChatMessageTime>{time}</ChatMessageTime>}
              </ChatMessageHeader>
            )}
            {message && <ChatMessageContent>{message}</ChatMessageContent>}
          </ChatMessageBody>
        </div>
      </ChatMessageContext.Provider>
    );
  }
);
ChatMessage.displayName = 'ChatMessage';

export interface ChatMessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  isOnline?: boolean;
}

export const ChatMessageAvatar = React.forwardRef<HTMLDivElement, ChatMessageAvatarProps>(
  ({ src, fallback, isOnline, className, children, ...props }, ref) => {
    const { isOwn } = React.useContext(ChatMessageContext);

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 select-none shadow-sm',
          isOwn
            ? 'bg-linear-to-tr from-primary to-violet-500 text-white shadow-primary/20'
            : 'bg-linear-to-tr from-zinc-700 to-zinc-900 dark:from-zinc-800 dark:to-zinc-950 text-white border border-border/80',
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt="avatar" className="w-full h-full rounded-full object-cover" />
        ) : children ? (
          children
        ) : (
          <span>{fallback || (isOwn ? 'Y' : 'U')}</span>
        )}

        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
        )}
      </div>
    );
  }
);
ChatMessageAvatar.displayName = 'ChatMessageAvatar';

export const ChatMessageBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isOwn } = React.useContext(ChatMessageContext);
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col max-w-[80%] sm:max-w-[70%]',
          isOwn ? 'items-end' : 'items-start',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatMessageBody.displayName = 'ChatMessageBody';

export const ChatMessageHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isOwn } = React.useContext(ChatMessageContext);
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 mb-1 px-1',
          isOwn ? 'flex-row-reverse text-right' : 'flex-row text-left',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatMessageHeader.displayName = 'ChatMessageHeader';

export const ChatMessageSender = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-xs font-semibold text-foreground/90 tracking-tight', className)}
      {...props}
    >
      {children}
    </span>
  )
);
ChatMessageSender.displayName = 'ChatMessageSender';

export const ChatMessageTime = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-[11px] font-mono text-muted-foreground/80', className)}
      {...props}
    >
      {children}
    </span>
  )
);
ChatMessageTime.displayName = 'ChatMessageTime';

export interface ChatMessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sent' | 'received';
}

export const ChatMessageContent = React.forwardRef<HTMLDivElement, ChatMessageContentProps>(
  ({ variant: propVariant, className, children, ...props }, ref) => {
    const context = React.useContext(ChatMessageContext);
    const isOwn = propVariant ? propVariant === 'sent' : context.isOwn;

    return (
      <div
        ref={ref}
        className={cn(
          'px-4 py-2.5 text-sm leading-relaxed tracking-normal shadow-xs transition-colors duration-200',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-xs selection:bg-primary-foreground/20 selection:text-primary-foreground font-medium'
            : 'bg-card/90 dark:bg-zinc-900 text-card-foreground border border-border/70 rounded-2xl rounded-tl-xs backdrop-blur-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatMessageContent.displayName = 'ChatMessageContent';

export interface ChatMessageStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: 'sent' | 'delivered' | 'read';
}

export const ChatMessageStatus = React.forwardRef<HTMLSpanElement, ChatMessageStatusProps>(
  ({ status = 'read', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center text-[10px] text-muted-foreground ml-1.5', className)}
        {...props}
      >
        {status === 'sent' && <Check className="w-3 h-3 text-muted-foreground" />}
        {status === 'delivered' && <CheckCheck className="w-3 h-3 text-muted-foreground" />}
        {status === 'read' && <CheckCheck className="w-3 h-3 text-primary" />}
      </span>
    );
  }
);
ChatMessageStatus.displayName = 'ChatMessageStatus';

// Compound Dot-notation assignment for ChatMessage
export const ChatMessageCompound = Object.assign(ChatMessage, {
  Avatar: ChatMessageAvatar,
  Body: ChatMessageBody,
  Header: ChatMessageHeader,
  Sender: ChatMessageSender,
  Time: ChatMessageTime,
  Content: ChatMessageContent,
  Status: ChatMessageStatus,
});


// ============================================================================
// 2. CHAT INPUT (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface ChatInputProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  onSend?: (message: string) => void;
  children?: React.ReactNode;
}

export const ChatInput = React.forwardRef<HTMLDivElement, ChatInputProps>(
  ({ placeholder = 'Type a message...', onSend, className, children, ...props }, ref) => {
    const [text, setText] = React.useState('');

    const handleSend = () => {
      if (text.trim()) {
        onSend?.(text);
        setText('');
      }
    };

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-2 pl-4 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-2 pl-4 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200',
          className
        )}
        {...props}
      >
        <ChatInputAction icon={<Paperclip className="w-4 h-4" />} title="Attach file" />
        <ChatInputField
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={placeholder}
        />
        <ChatInputAction icon={<Smile className="w-4 h-4" />} title="Add emoji" />
        <ChatInputSubmit onClick={handleSend} disabled={!text.trim()} />
      </div>
    );
  }
);
ChatInput.displayName = 'ChatInput';

export const ChatInputField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70 min-w-0 font-normal',
        className
      )}
      {...props}
    />
  )
);
ChatInputField.displayName = 'ChatInputField';

export const ChatInputActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-1 shrink-0', className)} {...props}>
      {children}
    </div>
  )
);
ChatInputActions.displayName = 'ChatInputActions';

export interface ChatInputActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export const ChatInputAction = React.forwardRef<HTMLButtonElement, ChatInputActionProps>(
  ({ icon, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 active:scale-95 transition-all duration-150 cursor-pointer shrink-0',
        className
      )}
      {...props}
    >
      {icon || children}
    </button>
  )
);
ChatInputAction.displayName = 'ChatInputAction';

export interface ChatInputSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

export const ChatInputSubmit = React.forwardRef<HTMLButtonElement, ChatInputSubmitProps>(
  ({ disabled = false, className, children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: disabled ? 1 : 0.92 }}
      disabled={disabled}
      className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer',
        disabled
          ? 'bg-muted/70 text-muted-foreground/50 cursor-not-allowed'
          : 'bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90',
        className
      )}
      {...(props as any)}
    >
      {children || <Send className="w-4 h-4" />}
    </motion.button>
  )
);
ChatInputSubmit.displayName = 'ChatInputSubmit';

export const ChatInputCompound = Object.assign(ChatInput, {
  Field: ChatInputField,
  Actions: ChatInputActions,
  Action: ChatInputAction,
  Submit: ChatInputSubmit,
});


// ============================================================================
// 3. USER PROFILE CARD (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface UserProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  username?: string;
  bio?: string;
  stats?: { label: string; value: string }[];
  isFollowing?: boolean;
  avatar?: string;
  coverGradient?: string;
  children?: React.ReactNode;
}

export const UserProfileCard = React.forwardRef<HTMLDivElement, UserProfileCardProps>(
  (
    {
      name = 'Jane Doe',
      username = '@janedoe',
      bio,
      stats,
      isFollowing = false,
      avatar,
      coverGradient,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [following, setFollowing] = React.useState(isFollowing);

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-2xl border border-border/80 bg-card text-card-foreground overflow-hidden w-full max-w-sm shadow-xl shadow-black/5 dark:shadow-black/40 transition-all duration-300',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-border/80 bg-card text-card-foreground overflow-hidden w-full max-w-sm shadow-xl shadow-black/5 dark:shadow-black/40 transition-all duration-300',
          className
        )}
        {...props}
      >
        <UserProfileCover gradient={coverGradient} />
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-9 mb-3">
            <UserProfileAvatar fallback={avatar || name.charAt(0)} />
            <UserProfileFollowButton following={following} onClick={() => setFollowing(!following)} />
          </div>

          <UserProfileInfo>
            <UserProfileName>{name}</UserProfileName>
            <UserProfileHandle>{username}</UserProfileHandle>
          </UserProfileInfo>

          {bio && <UserProfileBio>{bio}</UserProfileBio>}

          {stats && stats.length > 0 && (
            <UserProfileStats>
              {stats.map((s, idx) => (
                <UserProfileStat key={idx} label={s.label} value={s.value} />
              ))}
            </UserProfileStats>
          )}
        </div>
      </div>
    );
  }
);
UserProfileCard.displayName = 'UserProfileCard';

export interface UserProfileCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: string;
  imageSrc?: string;
}

export const UserProfileCover = React.forwardRef<HTMLDivElement, UserProfileCoverProps>(
  ({ gradient, imageSrc, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'h-36 w-full relative overflow-hidden rounded-t-2xl',
        gradient || 'bg-linear-to-r from-violet-600 via-indigo-600 to-cyan-500',
        className
      )}
      {...props}
    >
      {/* Decorative Grid Mesh Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
      {/* Soft atmospheric radial glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/40 rounded-full blur-2xl pointer-events-none" />
      {/* Smooth bottom blend into card */}
      <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent pointer-events-none" />
      {imageSrc && <img src={imageSrc} alt="Cover" className="w-full h-full object-cover" />}
      {children}
    </div>
  )
);
UserProfileCover.displayName = 'UserProfileCover';

export interface UserProfileAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  status?: 'online' | 'busy' | 'offline';
}

export const UserProfileAvatar = React.forwardRef<HTMLDivElement, UserProfileAvatarProps>(
  ({ src, fallback, status = 'online', className, children, ...props }, ref) => (
    <div className="relative shrink-0">
      <div
        ref={ref}
        className={cn(
          'w-20 h-20 rounded-full border-4 border-card ring-2 ring-primary/30 bg-linear-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-2xl overflow-hidden select-none',
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt="avatar" className="w-full h-full object-cover" />
        ) : children ? (
          children
        ) : (
          <span>{fallback || 'U'}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ring-card shadow-sm',
            status === 'online' && 'bg-emerald-500',
            status === 'busy' && 'bg-rose-500',
            status === 'offline' && 'bg-zinc-500'
          )}
          title={\`Status: \${status}\`}
        />
      )}
    </div>
  )
);
UserProfileAvatar.displayName = 'UserProfileAvatar';

export const UserProfileInfo = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-0.5', className)} {...props}>
      {children}
    </div>
  )
);
UserProfileInfo.displayName = 'UserProfileInfo';

export const UserProfileName = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="flex items-center gap-1.5">
      <h4 ref={ref} className={cn('font-bold text-lg text-foreground tracking-tight', className)} {...props}>
        {children}
      </h4>
      <svg className="w-4 h-4 text-primary fill-primary/20 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
);
UserProfileName.displayName = 'UserProfileName';

export const UserProfileHandle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs font-mono text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
);
UserProfileHandle.displayName = 'UserProfileHandle';

export const UserProfileBio = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3', className)} {...props}>
      {children}
    </p>
  )
);
UserProfileBio.displayName = 'UserProfileBio';

export const UserProfileStats = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-6 mt-4 pt-4 border-t border-border/70', className)}
      {...props}
    >
      {children}
    </div>
  )
);
UserProfileStats.displayName = 'UserProfileStats';

export interface UserProfileStatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
}

export const UserProfileStat = React.forwardRef<HTMLDivElement, UserProfileStatProps>(
  ({ label, value, className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-0.5', className)} {...props}>
      <p className="font-bold text-sm text-foreground tracking-tight">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
);
UserProfileStat.displayName = 'UserProfileStat';

export interface UserProfileFollowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  following?: boolean;
}

export const UserProfileFollowButton = React.forwardRef<HTMLButtonElement, UserProfileFollowButtonProps>(
  ({ following = false, className, children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs',
        following
          ? 'bg-muted/80 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 border border-border/80'
          : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25',
        className
      )}
      {...(props as any)}
    >
      {children || (following ? 'Following' : 'Follow')}
    </motion.button>
  )
);
UserProfileFollowButton.displayName = 'UserProfileFollowButton';

export const UserProfileCardCompound = Object.assign(UserProfileCard, {
  Cover: UserProfileCover,
  Avatar: UserProfileAvatar,
  Info: UserProfileInfo,
  Name: UserProfileName,
  Handle: UserProfileHandle,
  Bio: UserProfileBio,
  Stats: UserProfileStats,
  Stat: UserProfileStat,
  FollowButton: UserProfileFollowButton,
});


// ============================================================================
// 4. COMMENT THREAD (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface CommentData {
  author: string;
  text: string;
  time: string;
  avatar?: string;
  replies?: { author: string; text: string; time: string; avatar?: string }[];
}

export interface CommentThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  comments?: CommentData[];
  children?: React.ReactNode;
}

export const CommentThread = React.forwardRef<HTMLDivElement, CommentThreadProps>(
  ({ comments, className, children, ...props }, ref) => {
    if (children) {
      return (
        <div ref={ref} className={cn('space-y-4 w-full', className)} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-4 w-full', className)} {...props}>
        {comments?.map((comment, i) => (
          <div key={i} className="space-y-3">
            <CommentItem>
              <CommentAvatar fallback={comment.author.charAt(0)} />
              <CommentBody>
                <CommentHeader>
                  <CommentAuthor>{comment.author}</CommentAuthor>
                  <CommentTime>{comment.time}</CommentTime>
                </CommentHeader>
                <CommentText>{comment.text}</CommentText>
                <CommentActions>
                  <button type="button" className="hover:text-primary transition-colors cursor-pointer">
                    Reply
                  </button>
                </CommentActions>
              </CommentBody>
            </CommentItem>

            {comment.replies?.map((reply, j) => (
              <CommentReply key={j}>
                <CommentAvatar fallback={reply.author.charAt(0)} size="sm" />
                <CommentBody>
                  <CommentHeader>
                    <CommentAuthor>{reply.author}</CommentAuthor>
                    <CommentTime>{reply.time}</CommentTime>
                  </CommentHeader>
                  <CommentText>{reply.text}</CommentText>
                </CommentBody>
              </CommentReply>
            ))}
          </div>
        ))}
      </div>
    );
  }
);
CommentThread.displayName = 'CommentThread';

export const CommentItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex gap-3.5 items-start', className)} {...props}>
      {children}
    </div>
  )
);
CommentItem.displayName = 'CommentItem';

export interface CommentAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  size?: 'sm' | 'md';
}

export const CommentAvatar = React.forwardRef<HTMLDivElement, CommentAvatarProps>(
  ({ src, fallback, size = 'md', className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white shrink-0 bg-linear-to-tr from-violet-500 to-indigo-600 shadow-xs',
        size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs',
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full rounded-full object-cover" />
      ) : children ? (
        children
      ) : (
        <span>{fallback || 'U'}</span>
      )}
    </div>
  )
);
CommentAvatar.displayName = 'CommentAvatar';

export const CommentBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 min-w-0 space-y-1', className)} {...props}>
      {children}
    </div>
  )
);
CommentBody.displayName = 'CommentBody';

export const CommentHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2 mb-0.5', className)} {...props}>
      {children}
    </div>
  )
);
CommentHeader.displayName = 'CommentHeader';

export const CommentAuthor = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('font-semibold text-xs text-foreground', className)} {...props}>
      {children}
    </span>
  )
);
CommentAuthor.displayName = 'CommentAuthor';

export const CommentTime = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('text-[11px] font-mono text-muted-foreground', className)} {...props}>
      {children}
    </span>
  )
);
CommentTime.displayName = 'CommentTime';

export const CommentText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs sm:text-sm text-foreground/80 leading-relaxed', className)} {...props}>
      {children}
    </p>
  )
);
CommentText.displayName = 'CommentText';

export const CommentActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3 pt-1 text-[11px] text-muted-foreground', className)} {...props}>
      {children}
    </div>
  )
);
CommentActions.displayName = 'CommentActions';

export const CommentReply = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex gap-3 items-start ml-11 pl-2 border-l border-border/60', className)} {...props}>
      {children}
    </div>
  )
);
CommentReply.displayName = 'CommentReply';

export const CommentThreadCompound = Object.assign(CommentThread, {
  Item: CommentItem,
  Avatar: CommentAvatar,
  Body: CommentBody,
  Header: CommentHeader,
  Author: CommentAuthor,
  Time: CommentTime,
  Text: CommentText,
  Actions: CommentActions,
  Reply: CommentReply,
});


// ============================================================================
// 5. SOCIAL POST (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface SocialPostProps extends React.HTMLAttributes<HTMLDivElement> {
  author?: string;
  handle?: string;
  content?: string;
  time?: string;
  avatar?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  children?: React.ReactNode;
}

export const SocialPost = React.forwardRef<HTMLDivElement, SocialPostProps>(
  (
    {
      author = 'John Smith',
      handle = '@johnsmith',
      content = 'Just launched my new project powered by NexoreUI! Check it out.',
      time = '2h ago',
      avatar,
      likes = 42,
      comments = 12,
      shares = 5,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [liked, setLiked] = React.useState(false);
    const [likeCount, setLikeCount] = React.useState(likes);

    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-2xl border border-border/80 bg-card text-card-foreground p-5 w-full shadow-lg shadow-black/5 dark:shadow-black/30 transition-all duration-200',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-border/80 bg-card text-card-foreground p-5 w-full shadow-lg shadow-black/5 dark:shadow-black/30 transition-all duration-200',
          className
        )}
        {...props}
      >
        <SocialPostHeader>
          <SocialPostAvatar fallback={avatar || author.charAt(0)} />
          <div className="flex-1 min-w-0">
            <SocialPostAuthor>{author}</SocialPostAuthor>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <SocialPostHandle>{handle}</SocialPostHandle>
              <span>\xB7</span>
              <SocialPostTime>{time}</SocialPostTime>
            </div>
          </div>
        </SocialPostHeader>

        <SocialPostContent>{content}</SocialPostContent>

        <SocialPostActions>
          <SocialPostAction
            active={liked}
            icon={<Heart className={cn('w-4 h-4', liked && 'fill-rose-500 text-rose-500')} />}
            label={likeCount}
            onClick={() => {
              setLiked(!liked);
              setLikeCount(liked ? likeCount - 1 : likeCount + 1);
            }}
          />
          <SocialPostAction icon={<MessageCircle className="w-4 h-4" />} label={comments} />
          <SocialPostAction icon={<Share2 className="w-4 h-4" />} label={shares} />
        </SocialPostActions>
      </div>
    );
  }
);
SocialPost.displayName = 'SocialPost';

export const SocialPostHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3 mb-3.5', className)} {...props}>
      {children}
    </div>
  )
);
SocialPostHeader.displayName = 'SocialPostHeader';

export const SocialPostAvatar = React.forwardRef<HTMLDivElement, CommentAvatarProps>(
  ({ src, fallback, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'w-10 h-10 rounded-full bg-linear-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-xs',
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full rounded-full object-cover" />
      ) : children ? (
        children
      ) : (
        <span>{fallback || 'U'}</span>
      )}
    </div>
  )
);
SocialPostAvatar.displayName = 'SocialPostAvatar';

export const SocialPostAuthor = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('font-semibold text-sm text-foreground tracking-tight', className)} {...props}>
      {children}
    </p>
  )
);
SocialPostAuthor.displayName = 'SocialPostAuthor';

export const SocialPostHandle = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('font-mono text-xs text-muted-foreground', className)} {...props}>
      {children}
    </span>
  )
);
SocialPostHandle.displayName = 'SocialPostHandle';

export const SocialPostTime = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('text-xs text-muted-foreground/80', className)} {...props}>
      {children}
    </span>
  )
);
SocialPostTime.displayName = 'SocialPostTime';

export const SocialPostContent = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm leading-relaxed text-foreground/90 mb-4', className)} {...props}>
      {children}
    </p>
  )
);
SocialPostContent.displayName = 'SocialPostContent';

export const SocialPostActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-6 pt-3 border-t border-border/70', className)} {...props}>
      {children}
    </div>
  )
);
SocialPostActions.displayName = 'SocialPostActions';

export interface SocialPostActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  active?: boolean;
}

export const SocialPostAction = React.forwardRef<HTMLButtonElement, SocialPostActionProps>(
  ({ icon, label, active, className, children, ...props }, ref) => (
    <motion.button
      ref={ref}
      type="button"
      whileTap={{ scale: 0.9 }}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer',
        active && 'text-rose-500 hover:text-rose-500 font-medium',
        className
      )}
      {...(props as any)}
    >
      {icon}
      {label !== undefined && <span>{label}</span>}
      {children}
    </motion.button>
  )
);
SocialPostAction.displayName = 'SocialPostAction';

export const SocialPostCompound = Object.assign(SocialPost, {
  Header: SocialPostHeader,
  Avatar: SocialPostAvatar,
  Author: SocialPostAuthor,
  Handle: SocialPostHandle,
  Time: SocialPostTime,
  Content: SocialPostContent,
  Actions: SocialPostActions,
  Action: SocialPostAction,
});


// ============================================================================
// 6. REACTION BAR (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface ReactionData {
  emoji: string;
  count: number;
  active?: boolean;
}

export interface ReactionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  reactions?: ReactionData[];
  onReact?: (emoji: string) => void;
  children?: React.ReactNode;
}

export const ReactionBar = React.forwardRef<HTMLDivElement, ReactionBarProps>(
  ({ reactions, onReact, className, children, ...props }, ref) => {
    if (children) {
      return (
        <div ref={ref} className={cn('flex flex-wrap items-center gap-2', className)} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex flex-wrap items-center gap-2', className)} {...props}>
        {reactions?.map((r, i) => (
          <ReactionItem
            key={i}
            emoji={r.emoji}
            count={r.count}
            active={r.active}
            onClick={() => onReact?.(r.emoji)}
          />
        ))}
        <ReactionAdd onAdd={() => onReact?.('\u2728')} />
      </div>
    );
  }
);
ReactionBar.displayName = 'ReactionBar';

export interface ReactionItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  emoji: string;
  count: number;
  active?: boolean;
}

export const ReactionItem = React.forwardRef<HTMLButtonElement, ReactionItemProps>(
  ({ emoji, count, active = false, className, ...props }, ref) => (
    <motion.button
      ref={ref}
      type="button"
      whileTap={{ scale: 0.92 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-all duration-200 cursor-pointer shadow-2xs',
        active
          ? 'border-primary/40 bg-primary/10 text-primary font-semibold'
          : 'border-border/80 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground',
        className
      )}
      {...(props as any)}
    >
      <span className="text-sm leading-none">{emoji}</span>
      <span className="font-mono">{count}</span>
    </motion.button>
  )
);
ReactionItem.displayName = 'ReactionItem';

export const ReactionAdd = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { onAdd?: () => void }>(
  ({ onAdd, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onAdd}
      className={cn(
        'inline-flex items-center justify-center w-7 h-7 rounded-full border border-dashed border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-xs cursor-pointer',
        className
      )}
      {...props}
    >
      <Plus className="w-3.5 h-3.5" />
    </button>
  )
);
ReactionAdd.displayName = 'ReactionAdd';

export const ReactionBarCompound = Object.assign(ReactionBar, {
  Item: ReactionItem,
  Add: ReactionAdd,
});


// ============================================================================
// 7. ACTIVITY ITEM (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface ActivityItemProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: string;
  action?: string;
  target?: string;
  time?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const ActivityItem = React.forwardRef<HTMLDivElement, ActivityItemProps>(
  ({ user, action, target, time, icon, className, children, ...props }, ref) => {
    if (children) {
      return (
        <div ref={ref} className={cn('flex items-start gap-3 py-3 w-full', className)} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex items-start gap-3 py-3 w-full', className)} {...props}>
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
          {icon || user?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-foreground/90 leading-snug">
            <span className="font-semibold text-foreground">{user}</span>{' '}
            <span className="text-muted-foreground">{action}</span>{' '}
            {target && <span className="font-medium text-foreground">{target}</span>}
          </p>
          {time && <span className="text-[11px] font-mono text-muted-foreground mt-0.5 block">{time}</span>}
        </div>
      </div>
    );
  }
);
ActivityItem.displayName = 'ActivityItem';


// ============================================================================
// 8. ONLINE USERS LIST (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface OnlineUserData {
  name: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  avatar?: string;
}

export interface OnlineUsersListProps extends React.HTMLAttributes<HTMLDivElement> {
  users?: OnlineUserData[];
  children?: React.ReactNode;
}

export const OnlineUsersList = React.forwardRef<HTMLDivElement, OnlineUsersListProps>(
  ({ users, className, children, ...props }, ref) => {
    const statusColors = {
      online: 'bg-emerald-500',
      away: 'bg-amber-500',
      busy: 'bg-rose-500',
      offline: 'bg-muted-foreground/50',
    };

    if (children) {
      return (
        <div
          ref={ref}
          className={cn('rounded-2xl border border-border/80 bg-card p-4 shadow-lg w-full max-w-xs', className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    const onlineCount = users?.filter((u) => u.status === 'online').length || 0;

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl border border-border/80 bg-card p-4 shadow-lg w-full max-w-xs', className)}
        {...props}
      >
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/60">
          <h4 className="font-semibold text-xs tracking-tight text-foreground">Active Team Members</h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
            {onlineCount} Online
          </span>
        </div>
        <div className="space-y-2">
          {users?.map((user, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1">
              <div className="relative shrink-0">
                <div className="w-7 h-7 rounded-full bg-linear-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shadow-2xs">
                  {user.name.charAt(0)}
                </div>
                <div
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-card',
                    statusColors[user.status || 'offline']
                  )}
                />
              </div>
              <span className="text-xs font-medium text-foreground/90">{user.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
OnlineUsersList.displayName = 'OnlineUsersList';


// ============================================================================
// 9. SHARE SHEET (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface ShareSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  url?: string;
  title?: string;
  children?: React.ReactNode;
}

export const ShareSheet = React.forwardRef<HTMLDivElement, ShareSheetProps>(
  ({ url = 'https://nexoreui.site', title = 'Share this project', className, children, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    if (children) {
      return (
        <div
          ref={ref}
          className={cn('rounded-2xl border border-border/80 bg-card p-5 shadow-lg max-w-sm w-full', className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    const platforms: { name: string; color: string; icon: React.ReactNode }[] = [
      { name: 'Twitter', color: 'bg-zinc-900 dark:bg-zinc-800', icon: '\u{1D54F}' },
      { name: 'Facebook', color: 'bg-blue-600', icon: 'f' },
      { name: 'LinkedIn', color: 'bg-indigo-600', icon: 'in' },
      { name: 'Telegram', color: 'bg-cyan-500', icon: <Send className="w-3.5 h-3.5 -rotate-45" /> },
    ];

    const handleCopy = () => {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl border border-border/80 bg-card p-5 shadow-lg max-w-sm w-full space-y-4', className)}
        {...props}
      >
        <h4 className="font-semibold text-sm text-foreground tracking-tight">{title}</h4>
        <div className="flex gap-2.5">
          {platforms.map((p, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.92 }}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm transition-transform cursor-pointer',
                p.color
              )}
              title={p.name}
            >
              {p.icon}
            </motion.button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-xl bg-muted/60 text-xs font-mono text-muted-foreground truncate border border-border/60">
            {url}
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium shrink-0 flex items-center gap-1.5 shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>
        </div>
      </div>
    );
  }
);
ShareSheet.displayName = 'ShareSheet';


// ============================================================================
// 10. NOTIFICATION CENTER (Compound Architecture + Backward Compatibility)
// ============================================================================

export interface NotificationItemData {
  title: string;
  message: string;
  time: string;
  read?: boolean;
  type?: 'info' | 'success' | 'warning';
}

export interface NotificationCenterProps extends React.HTMLAttributes<HTMLDivElement> {
  notifications?: NotificationItemData[];
  onMarkAllRead?: () => void;
  children?: React.ReactNode;
}

export const NotificationCenter = React.forwardRef<HTMLDivElement, NotificationCenterProps>(
  ({ notifications, onMarkAllRead, className, children, ...props }, ref) => {
    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-2xl border border-border/80 bg-card text-card-foreground overflow-hidden max-w-sm w-full shadow-xl',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    const typeIcons: Record<string, React.ReactNode> = {
      info: <MessageSquare className="w-4 h-4 text-blue-500" />,
      success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-border/80 bg-card text-card-foreground overflow-hidden max-w-sm w-full shadow-xl',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-muted/30">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-xs text-foreground tracking-tight">Notifications</h4>
          </div>
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
          >
            Mark all read
          </button>
        </div>
        <div className="divide-y divide-border/60 max-h-[360px] overflow-y-auto">
          {notifications?.map((n, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer',
                !n.read && 'bg-primary/5'
              )}
            >
              <span className="shrink-0 mt-0.5">{typeIcons[n.type || 'info'] || <Bell className="w-4 h-4 text-muted-foreground" />}</span>
              <div className="flex-1 min-w-0">
                <p className={cn('text-xs', !n.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80')}>
                  {n.title}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{n.message}</p>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
              {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
NotificationCenter.displayName = 'NotificationCenter';
`
};

// src/registry/pro-ai.ts
var proAi = {
  name: "pro-ai",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "pro-ai.tsx",
  content: `"use client"

import { motion } from "framer-motion"
import { Sparkles, Send, Mic, Copy, Bot, User, FileText, ChevronDown, RefreshCw, Plus } from "lucide-react"

// 1. ChatBubbleUser
export const ChatBubbleUser = ({ message }: any) => (
  <div className="flex gap-4 justify-end mb-6">
    <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
      <p className="leading-relaxed">{message || "How do I build a Next.js application with Tailwind CSS?"}</p>
    </div>
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 border"><User className="w-4 h-4" /></div>
  </div>
)

// 2. ChatBubbleAI
export const ChatBubbleAI = ({ message }: any) => (
  <div className="flex gap-4 mb-6">
    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20"><Bot className="w-4 h-4" /></div>
    <div className="bg-muted/50 px-5 py-3 rounded-2xl rounded-tl-sm max-w-[80%] border border-border/50">
      <p className="leading-relaxed text-foreground">{message || "You can start by running npx create-next-app@latest and selecting Tailwind CSS during the setup process."}</p>
      <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
        <button className="text-muted-foreground hover:text-foreground"><Copy className="w-4 h-4" /></button>
        <button className="text-muted-foreground hover:text-foreground"><RefreshCw className="w-4 h-4" /></button>
      </div>
    </div>
  </div>
)

// 3. AIPromptInput
export const AIPromptInput = () => (
  <div className="w-full relative border rounded-2xl bg-card shadow-lg flex items-end p-2 focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
    <button className="p-3 text-muted-foreground hover:text-foreground"><Mic className="w-5 h-5" /></button>
    <textarea className="flex-1 max-h-32 min-h-[44px] py-3 bg-transparent outline-none resize-none placeholder:text-muted-foreground" placeholder="Ask anything..." rows={1} />
    <button className="p-3 bg-primary text-primary-foreground rounded-xl shadow-sm hover:opacity-90"><Send className="w-5 h-5" /></button>
  </div>
)

// 4. ThinkingLoader
export const ThinkingLoader = () => (
  <div className="flex gap-4 mb-6">
    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20"><Bot className="w-4 h-4" /></div>
    <div className="bg-muted/50 px-5 py-4 rounded-2xl rounded-tl-sm border border-border/50 flex items-center gap-1.5">
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0 }} className="w-2 h-2 rounded-full bg-foreground" />
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-2 h-2 rounded-full bg-foreground" />
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-2 h-2 rounded-full bg-foreground" />
    </div>
  </div>
)

// 5. ModelSelector
export const ModelSelector = () => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg border cursor-pointer hover:bg-muted/80 transition-colors">
    <Sparkles className="w-4 h-4 text-primary" />
    <span className="text-sm font-medium">GPT-4 Turbo</span>
    <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
  </div>
)

// 6. GeneratedCodeBlock
export const GeneratedCodeBlock = () => (
  <div className="rounded-xl border border-border bg-zinc-950 overflow-hidden my-4 max-w-2xl">
    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
      <span className="text-xs text-zinc-400 font-mono">tsx</span>
      <button className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white"><Copy className="w-3 h-3" /> Copy code</button>
    </div>
    <pre className="p-4 text-sm text-zinc-300 font-mono overflow-x-auto">
      <code>{\`export default function App() {\\n  return (\\n    <div className="p-4">\\n      <h1 className="text-2xl font-bold">Hello World</h1>\\n    </div>\\n  );\\n}\`}</code>
    </pre>
  </div>
)

// 7. ChatHistorySidebar
export const ChatHistorySidebar = () => (
  <div className="w-64 h-full border-r bg-background p-4 flex flex-col">
    <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium mb-6 text-sm flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> New Chat</button>
    <div className="text-xs font-semibold text-muted-foreground mb-3 px-2">Today</div>
    <div className="space-y-1">
      <button className="w-full text-left px-3 py-2 text-sm bg-muted rounded-md font-medium truncate flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground shrink-0" /> React State Management</button>
      <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-md truncate flex items-center gap-2"><FileText className="w-4 h-4 shrink-0" /> Tailwind Layouts</button>
    </div>
  </div>
)

// 8. AIFeatureCard
export const AIFeatureCard = () => (
  <div className="p-6 rounded-2xl border bg-card relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 relative z-10"><Sparkles className="w-6 h-6" /></div>
    <h3 className="text-xl font-bold mb-2 relative z-10">Smart Autocomplete</h3>
    <p className="text-sm text-muted-foreground relative z-10">Let AI predict and complete your code in real-time as you type.</p>
  </div>
)

// 9. SuggestionChips
export const SuggestionChips = () => (
  <div className="flex flex-wrap gap-2">
    {["Explain this code", "Refactor for performance", "Add type definitions"].map((text, i) => (
      <button key={i} className="px-4 py-2 rounded-full border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">{text}</button>
    ))}
  </div>
)

// 10. VoiceInputPulse
export const VoiceInputPulse = () => (
  <div className="flex items-center justify-center w-24 h-24 relative">
    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full bg-red-500/20" />
    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }} className="absolute inset-2 rounded-full bg-red-500/30" />
    <button className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center relative z-10 shadow-xl"><Mic className="w-6 h-6" /></button>
  </div>
)
`
};

// src/registry/pro-buttons.ts
var proButtons = {
  name: "pro-buttons",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  componentsDependencies: [
    "button"
  ],
  fileName: "pro-buttons.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// Re-export standard button variants as alias wrappers for backward compatibility
export { GlowButton as NeonGlowButton, GradientButton as OutlineGradientButton, GlassButton as GlassmorphButton } from "./button"

// ============================================
// 1. MorphButton \u2014 Shape morphing button
// ============================================
export function MorphButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props
  return (
    <motion.button
      className={cn(
        "relative px-6 py-2.5 rounded-lg font-semibold bg-primary text-primary-foreground border border-primary/20",
        className
      )}
      whileHover={{
        borderRadius: "24px",
        scale: 1.05,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...motionSafeProps}
    >
      {children}
    </motion.button>
  )
}

// ============================================
// 2. SplitButton
// ============================================
export function SplitButton({ primary, secondary, onPrimary, onSecondary, className }: {
  primary: string
  secondary: string
  onPrimary?: () => void
  onSecondary?: () => void
  className?: string
}) {
  return (
    <div className={cn("inline-flex rounded-lg overflow-hidden shadow-sm", className)}>
      <button onClick={onPrimary} className="px-4 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
        {primary}
      </button>
      <button onClick={onSecondary} className="px-3 py-2 bg-primary/80 text-primary-foreground border-l border-primary-foreground/20 hover:bg-primary/70 transition-colors">
        {secondary}
      </button>
    </div>
  )
}

// ============================================
// 3. CopyTextButton \u2014 Copy text to clipboard with visual feedback
// ============================================
export function CopyTextButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <button
      className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-all active:scale-95", className)}
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
    >
      <span className="truncate max-w-[200px]">{text}</span>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.svg key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></motion.svg>
        ) : (
          <motion.svg key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></motion.svg>
        )}
      </AnimatePresence>
    </button>
  )
}

// ============================================
// 4. ExpandButton \u2014 Expands on hover to show icon
// ============================================
export function ExpandButton({ children, icon, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode }) {
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props
  return (
    <motion.button
      className={cn("inline-flex items-center gap-0 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold overflow-hidden", className)}
      whileHover="expanded"
      initial="collapsed"
      {...motionSafeProps}
    >
      <span>{children}</span>
      <motion.span
        variants={{
          collapsed: { width: 0, opacity: 0, marginLeft: 0 },
          expanded: { width: "auto", opacity: 1, marginLeft: 8 }
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="overflow-hidden"
      >
        {icon}
      </motion.span>
    </motion.button>
  )
}

// ============================================
// 5. StatusButton \u2014 Shows loading/success/error states
// ============================================
export function StatusButton({ status = "idle", children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { status?: "idle" | "loading" | "success" | "error" }) {
  const variants: Record<string, { bg: string; text: string }> = {
    idle: { bg: "bg-primary", text: "text-primary-foreground" },
    loading: { bg: "bg-yellow-500 dark:bg-yellow-600", text: "text-white" },
    success: { bg: "bg-emerald-500 dark:bg-emerald-600", text: "text-white" },
    error: { bg: "bg-red-500 dark:bg-red-600", text: "text-white" },
  }
  const v = variants[status]
  return (
    <button className={cn("relative px-5 py-2.5 rounded-lg font-semibold transition-all duration-300", v.bg, v.text, status === "loading" && "animate-pulse", className)} disabled={status === "loading"} {...props}>
      <AnimatePresence mode="wait">
        <motion.span key={status} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="inline-flex items-center gap-2">
          {status === "loading" && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {status === "success" && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          {status === "error" && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
          {status === "idle" ? children : status === "loading" ? "Loading..." : status === "success" ? "Done!" : "Failed"}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

// ============================================
// 6. SegmentedButton \u2014 Button group with selection
// ============================================
export function SegmentedButton({ options, value, onChange, className }: {
  options: string[]
  value: string
  onChange: (val: string) => void
  className?: string
}) {
  return (
    <div className={cn("inline-flex rounded-lg bg-muted p-1 gap-0.5", className)}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "relative px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            value === opt ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {value === opt && (
            <motion.div layoutId="segmented-bg" className="absolute inset-0 bg-background rounded-md shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
          )}
          <span className="relative z-10">{opt}</span>
        </button>
      ))}
    </div>
  )
}

// ============================================
// 7. TextButton \u2014 Minimal text with underline animation
// ============================================
export function TextButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "relative font-medium text-foreground group transition-colors",
        className
      )}
      {...props}
    >
      {children}
      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </button>
  )
}
`
};

// src/registry/pro-cards.ts
var proCards = {
  name: "pro-cards",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "pro-cards.tsx",
  content: `"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. NeumorphicCard
// ============================================
export function NeumorphicCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "rounded-2xl p-6 bg-background shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.05)]",
      className
    )}>
      {children}
    </div>
  )
}

// ============================================
// 2. GradientMeshCard
// ============================================
export function GradientMeshCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative rounded-2xl overflow-hidden", className)}>
      <div className="absolute inset-0 bg-linear-to-br from-violet-500/20 via-transparent to-pink-500/20 dark:from-violet-500/10 dark:to-pink-500/10" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 dark:bg-orange-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 dark:bg-blue-400/10 rounded-full blur-3xl" />
      <div className="relative p-6 border border-white/10 dark:border-white/5 rounded-2xl backdrop-blur-sm">
        {children}
      </div>
    </div>
  )
}

// ============================================
// 3. TiltCard \u2014 3D tilt on hover
// ============================================
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [transform, setTransform] = React.useState("")

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransform(\`perspective(600px) rotateX(\${y * -10}deg) rotateY(\${x * 10}deg) scale3d(1.02,1.02,1.02)\`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransform("")}
      className={cn("rounded-2xl border border-border bg-card p-6 transition-transform duration-200 ease-out", className)}
      style={{ transform }}
    >
      {children}
    </div>
  )
}

// ============================================
// 4. FeatureCard \u2014 Card with icon, title, desc
// ============================================
export function FeatureCard({ icon, title, description, className }: {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn("rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lg dark:hover:shadow-primary/5", className)}
    >
      <div className="mb-3 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h4 className="font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}

// ============================================
// 5. MetricCard \u2014 Stat card with trend
// ============================================
export function MetricCard({ title, value, change, changeType = "positive", className }: {
  title: string
  value: string
  change: string
  changeType?: "positive" | "negative" | "neutral"
  className?: string
}) {
  const colors = {
    positive: "text-emerald-500 bg-emerald-500/10",
    negative: "text-red-500 bg-red-500/10",
    neutral: "text-muted-foreground bg-muted",
  }
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", colors[changeType])}>{change}</span>
      </div>
    </div>
  )
}
`
};

// src/registry/pro-dashboards.ts
var proDashboards = {
  name: "pro-dashboards",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "pro-dashboards.tsx",
  content: `"use client"

import { DollarSign, ArrowUpRight, HardDrive, Server, Zap, Plus, FileText, Settings } from "lucide-react"

// 1. DashboardShell (Visual structure)
export const DashboardShell = ({ children }: any) => (
  <div className="flex h-[400px] w-full border rounded-xl overflow-hidden bg-background">
    <div className="w-48 border-r bg-muted/20 p-4 flex flex-col gap-2">
      <div className="w-full h-8 bg-muted rounded mb-4" />
      {[1, 2, 3].map(i => <div key={i} className="w-full h-6 bg-muted/50 rounded" />)}
    </div>
    <div className="flex-1 flex flex-col">
      <div className="h-12 border-b flex items-center px-4 justify-between bg-card"><div className="w-32 h-4 bg-muted rounded" /><div className="w-8 h-8 bg-muted rounded-full" /></div>
      <div className="flex-1 p-4 overflow-y-auto bg-muted/10">{children || <div className="w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">Dashboard Content</div>}</div>
    </div>
  </div>
)

// 2. StatWidgetCard
export const StatWidgetCard = ({ title = "Total Revenue", value = "$45,231.89", icon: Icon = DollarSign, trend = "+20.1%" }: any) => (
  <div className="p-6 border rounded-xl bg-card shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-xs text-muted-foreground mt-1"><span className="text-green-500 font-medium flex items-center inline-flex"><ArrowUpRight className="w-3 h-3 mr-1" />{trend}</span> from last month</p>
  </div>
)

// 3. ActivityFeed
export const ActivityFeed = () => (
  <div className="border rounded-xl bg-card p-6">
    <h3 className="font-bold mb-4">Recent Activity</h3>
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-border before:to-transparent">
      {[1, 2].map(i => (
        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"><Zap className="w-4 h-4" /></div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] border rounded-lg p-3 bg-background shadow-sm">
            <div className="flex justify-between items-center mb-1"><h4 className="font-bold text-sm">System Update</h4><time className="text-xs text-muted-foreground">2 hrs ago</time></div>
            <p className="text-xs text-muted-foreground">Server deployed successfully.</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// 4. ProgressWidget
export const ProgressWidget = () => (
  <div className="border rounded-xl bg-card p-6">
    <h3 className="font-bold mb-4 text-sm">Monthly Goal</h3>
    <div className="flex justify-between items-end mb-2">
      <div className="text-2xl font-bold">12,450 <span className="text-sm font-normal text-muted-foreground">/ 20,000</span></div>
      <div className="text-sm font-medium text-primary">62%</div>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary w-[62%]" /></div>
  </div>
)

// 5. QuickActionsWidget
export const QuickActionsWidget = () => (
  <div className="border rounded-xl bg-card p-4 grid grid-cols-3 gap-2">
    <button className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-muted transition-colors gap-2"><div className="p-2 bg-primary/10 text-primary rounded-full"><Plus className="w-4 h-4" /></div><span className="text-xs font-medium">New Project</span></button>
    <button className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-muted transition-colors gap-2"><div className="p-2 bg-blue-500/10 text-blue-500 rounded-full"><FileText className="w-4 h-4" /></div><span className="text-xs font-medium">Create Invoice</span></button>
    <button className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-muted transition-colors gap-2"><div className="p-2 bg-zinc-500/10 text-zinc-500 rounded-full"><Settings className="w-4 h-4" /></div><span className="text-xs font-medium">Settings</span></button>
  </div>
)

// 6. TaskChecklist
export const TaskChecklist = () => (
  <div className="border rounded-xl bg-card p-6">
    <h3 className="font-bold mb-4 text-sm">Tasks</h3>
    <div className="space-y-3">
      {['Review pull requests', 'Deploy new staging environment', 'Update documentation'].map((t, i) => (
        <div key={i} className="flex items-center gap-3">
          <input type="checkbox" defaultChecked={i === 0} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <span className={\`text-sm \${i === 0 ? 'line-through text-muted-foreground' : 'font-medium'}\`}>{t}</span>
        </div>
      ))}
    </div>
  </div>
)

// 7. StorageWidget
export const StorageWidget = () => (
  <div className="border rounded-xl bg-card p-6 flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4"><HardDrive className="w-8 h-8 text-blue-500" /></div>
    <h3 className="font-bold mb-1">Storage Usage</h3>
    <p className="text-2xl font-bold mb-1">45.2 GB <span className="text-sm font-normal text-muted-foreground">/ 100 GB</span></p>
    <div className="w-full h-2 bg-muted rounded-full mt-4"><div className="h-full bg-blue-500 rounded-full w-[45%]" /></div>
  </div>
)

// 8. RevenueChartWidget (Visual Mock)
export const RevenueChartWidget = () => (
  <div className="border rounded-xl bg-card p-6 h-48 flex flex-col">
    <h3 className="font-bold text-sm mb-4">Revenue Overview</h3>
    <div className="flex-1 flex items-end gap-2">
      {[30, 50, 40, 70, 50, 90, 80].map((h, i) => <div key={i} className="flex-1 bg-primary hover:opacity-80 transition-opacity rounded-t-sm" style={{ height: \`\${h}%\` }} />)}
    </div>
  </div>
)

// 9. RecentUsersWidget
export const RecentUsersWidget = () => (
  <div className="border rounded-xl bg-card p-6">
    <h3 className="font-bold text-sm mb-4">New Users</h3>
    <div className="flex -space-x-3 overflow-hidden">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-xs border font-medium">{i}</div>)}
    </div>
    <button className="text-xs font-medium text-primary mt-4 hover:underline">View all users</button>
  </div>
)

// 10. ServerStatusWidget
export const ServerStatusWidget = () => (
  <div className="border rounded-xl bg-card p-6 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-green-500/10 rounded-full"><Server className="w-6 h-6 text-green-500" /></div>
      <div><h3 className="font-bold">us-east-1</h3><p className="text-xs text-green-500 font-medium flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />Operational</p></div>
    </div>
    <div className="text-right"><p className="text-xs text-muted-foreground mb-1">Ping</p><p className="font-mono font-bold text-sm">24ms</p></div>
  </div>
)
`
};

// src/registry/pro-ecommerce.ts
var proEcommerce = {
  name: "pro-ecommerce",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "pro-ecommerce.tsx",
  content: `"use client"

import * as React from "react"
import { Star, Trash2, ShoppingBag, ArrowRight, Lock } from "lucide-react"

export const ProductGallery = () => {
  const [active, setActive] = React.useState(1)
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} onClick={() => setActive(i)} className={\`w-16 h-16 md:w-20 md:h-24 bg-muted rounded-lg border-2 transition-all \${i === active ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent cursor-pointer hover:border-foreground/20'}\`} />
        ))}
      </div>
      <div className="flex-1 bg-muted rounded-2xl aspect-[4/3] flex items-center justify-center text-muted-foreground order-1 md:order-2 overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-tr from-background/10 to-transparent" />
        <span className="font-medium">Product View {active}</span>
      </div>
    </div>
  )
}

export const AddToCartBar = () => {
  const [qty, setQty] = React.useState(1)
  return (
    <div className="flex items-center gap-4 w-full p-4 border rounded-2xl bg-card shadow-lg sticky bottom-4 z-10 max-w-2xl mx-auto">
      <div><p className="text-sm text-muted-foreground">Total Price</p><h3 className="text-2xl font-bold">\${(qty * 129).toFixed(2)}</h3></div>
      <div className="flex-1"></div>
      <div className="flex items-center border rounded-lg h-12 overflow-hidden bg-background">
        <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 hover:bg-muted h-full transition-colors">-</button>
        <span className="px-4 font-bold min-w-[2.5rem] text-center">{qty}</span>
        <button onClick={() => setQty(qty + 1)} className="px-4 hover:bg-muted h-full transition-colors">+</button>
      </div>
      <button className="px-6 md:px-8 h-12 bg-primary text-primary-foreground font-bold rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"><ShoppingBag className="w-5 h-5" /> <span className="hidden md:inline">Add to Cart</span></button>
    </div>
  )
}

export const CartDrawerItem = () => {
  const [qty, setQty] = React.useState(1)
  const [visible, setVisible] = React.useState(true)
  
  if (!visible) return null;

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="w-20 h-20 bg-muted rounded-xl border" />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between"><h4 className="font-bold text-sm md:text-base">Premium Wireless Headphones</h4><button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-destructive transition-colors p-1"><Trash2 className="w-4 h-4" /></button></div>
        <p className="text-sm text-muted-foreground mb-auto">Matte Black</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center border rounded-lg overflow-hidden h-8 bg-background">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 hover:bg-muted transition-colors">-</button>
            <span className="px-3 text-sm font-bold min-w-[2rem] text-center">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="px-3 hover:bg-muted transition-colors">+</button>
          </div>
          <span className="font-bold text-lg">\${(qty * 299).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export const OrderSummaryCard = () => (
  <div className="p-6 bg-card border rounded-2xl shadow-sm space-y-4">
    <h3 className="font-bold text-xl border-b pb-4">Order Summary</h3>
    <div className="space-y-3 text-sm">
      <div className="flex justify-between font-medium"><span className="text-muted-foreground">Subtotal</span><span>$129.00</span></div>
      <div className="flex justify-between font-medium"><span className="text-muted-foreground">Shipping</span><span>$10.00</span></div>
      <div className="flex justify-between font-medium"><span className="text-muted-foreground">Tax</span><span>$6.45</span></div>
    </div>
    <div className="border-t pt-4 flex justify-between font-black text-xl"><span>Total</span><span>$145.45</span></div>
    <button className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl mt-4 flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5">Checkout <ArrowRight className="w-4 h-4" /></button>
    <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground opacity-50">
      <Lock className="w-3 h-3" /> <span className="text-xs font-medium">Secure Checkout</span>
    </div>
  </div>
)

// 5. PromoCodeInput
export const PromoCodeInput = () => (
  <div className="flex gap-2">
    <input className="flex-1 px-4 py-2 border rounded-md text-sm" placeholder="Discount code" />
    <button className="px-6 py-2 bg-secondary text-secondary-foreground font-medium rounded-md text-sm">Apply</button>
  </div>
)

// 6. ShippingAddressForm
export const ShippingAddressForm = () => (
  <div className="space-y-4">
    <h3 className="font-bold text-lg mb-2">Shipping Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <input className="p-2 border rounded-md w-full" placeholder="First Name" />
      <input className="p-2 border rounded-md w-full" placeholder="Last Name" />
    </div>
    <input className="p-2 border rounded-md w-full" placeholder="Address" />
    <input className="p-2 border rounded-md w-full" placeholder="Apartment, suite, etc. (optional)" />
    <div className="grid grid-cols-3 gap-4">
      <input className="p-2 border rounded-md w-full" placeholder="City" />
      <select className="p-2 border rounded-md w-full bg-background"><option>State</option></select>
      <input className="p-2 border rounded-md w-full" placeholder="ZIP code" />
    </div>
  </div>
)

// 7. ProductReview
export const ProductReview = () => (
  <div className="py-6 border-b">
    <div className="flex justify-between mb-2">
      <div className="font-semibold">Alex Johnson</div>
      <div className="text-sm text-muted-foreground">October 12, 2025</div>
    </div>
    <div className="flex text-yellow-400 mb-3">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
    <h4 className="font-bold mb-1">Incredible sound quality!</h4>
    <p className="text-muted-foreground text-sm leading-relaxed">I've been using these for a month and they are absolutely fantastic. The noise cancellation is top tier and battery life is exactly as advertised.</p>
  </div>
)

// 8. ColorSelector
export const ColorSelector = () => (
  <div>
    <h4 className="text-sm font-medium mb-3">Color - <span className="text-muted-foreground">Matte Black</span></h4>
    <div className="flex gap-3">
      {['bg-black', 'bg-gray-300', 'bg-blue-900', 'bg-red-700'].map((color, i) => (
        <button key={i} className={\`w-10 h-10 rounded-full \${color} ring-offset-2 \${i === 0 ? 'ring-2 ring-primary' : 'ring-1 ring-border'}\`} />
      ))}
    </div>
  </div>
)

// 9. SizeSelector
export const SizeSelector = () => (
  <div>
    <div className="flex justify-between items-end mb-3">
      <h4 className="text-sm font-medium">Size</h4>
      <a href="#" className="text-xs text-primary hover:underline">Size guide</a>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {['S', 'M', 'L', 'XL'].map((size, i) => (
        <button key={i} className={\`py-2 border rounded-md font-medium transition-colors \${i === 1 ? 'border-primary bg-primary/5 text-primary' : 'hover:border-foreground'}\`}>{size}</button>
      ))}
    </div>
  </div>
)

// 10. CategoryCard
export const CategoryCard = () => (
  <div className="relative group overflow-hidden rounded-2xl cursor-pointer aspect-square bg-muted flex items-center justify-center">
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
    <div className="absolute inset-0 scale-100 group-hover:scale-110 transition-transform duration-500 bg-linear-to-tr from-indigo-500 to-purple-500 opacity-50" />
    <div className="relative z-20 text-white text-center">
      <h3 className="text-3xl font-bold mb-2">Sneakers</h3>
      <div className="flex items-center gap-1 text-sm font-medium justify-center group-hover:gap-2 transition-all">Shop Now <ArrowRight className="w-4 h-4" /></div>
    </div>
  </div>
)
`
};

// src/registry/pro-feedback.ts
var proFeedback = {
  name: "pro-feedback",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  componentsDependencies: [
    "alert"
  ],
  fileName: "pro-feedback.tsx",
  content: `"use client"

import { motion } from "framer-motion"
import { CheckCircle2, X, FileBox, UploadCloud } from "lucide-react"

// Re-export OfflineBanner and RateLimitAlert from alert.tsx for backward compatibility
export { OfflineBanner, RateLimitAlert } from "./alert"

// 1. ConfettiSuccess (Visual)
export const ConfettiSuccess = () => (
  <div className="flex flex-col items-center justify-center p-8 border rounded-xl bg-card text-center relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none flex justify-center">
      {[1,2,3,4,5,6].map(i => <motion.div key={i} animate={{ y: [0, 100], x: [(i%2===0?1:-1)*20, (i%2===0?1:-1)*40], opacity: [1, 0], rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 2, delay: i*0.2 }} className={\`w-2 h-2 absolute top-0 \${i%3===0?'bg-red-500':i%2===0?'bg-blue-500':'bg-yellow-500'}\`} />)}
    </div>
    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 relative z-10"><CheckCircle2 className="w-8 h-8" /></div>
    <h3 className="text-2xl font-bold mb-2 relative z-10">Payment Successful!</h3>
    <p className="text-muted-foreground relative z-10">Your order #12345 has been processed.</p>
  </div>
)

// 2. ActionToast
export const ActionToast = () => (
  <div className="flex items-center justify-between p-4 bg-foreground text-background rounded-lg shadow-xl max-w-sm mx-auto">
    <div><p className="text-sm font-medium">Item moved to trash</p></div>
    <div className="flex gap-4 items-center"><button className="text-sm font-bold text-primary hover:underline">Undo</button><button><X className="w-4 h-4 text-muted" /></button></div>
  </div>
)

// 3. MultiStepProgress
export const MultiStepProgress = () => (
  <div className="w-full">
    <div className="flex justify-between mb-2 text-sm font-medium"><span className="text-primary">Cart</span><span className="text-primary">Shipping</span><span className="text-muted-foreground">Payment</span></div>
    <div className="flex h-2 bg-muted rounded-full overflow-hidden"><div className="w-1/3 bg-primary border-r-2 border-background" /><div className="w-1/3 bg-primary/50" /></div>
  </div>
)

// 4. SkeletonList
export const SkeletonList = () => (
  <div className="space-y-4 w-full border p-4 rounded-xl bg-card">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-2"><div className="h-4 bg-muted rounded w-1/3 animate-pulse" /><div className="h-3 bg-muted rounded w-1/2 animate-pulse" /></div>
      </div>
    ))}
  </div>
)

// 5. EmptyStatePro
export const EmptyStatePro = () => (
  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/10 text-center">
    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground"><FileBox className="w-8 h-8" /></div>
    <h3 className="text-xl font-bold mb-2">No projects found</h3>
    <p className="text-muted-foreground mb-6 max-w-sm">Get started by creating a new project. You can also import an existing one.</p>
    <button className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shadow-sm hover:opacity-90">Create Project</button>
  </div>
)

// 6. TooltipForm (Visual)
export const TooltipForm = () => (
  <div className="relative inline-block mt-8">
    <button className="px-4 py-2 bg-muted rounded-md font-medium">Hover me</button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-card border shadow-xl rounded-lg z-10">
      <h4 className="font-bold text-sm mb-2">Quick Edit</h4>
      <input className="w-full p-2 border rounded text-xs mb-2 bg-background" placeholder="New name..." />
      <button className="w-full py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded">Save</button>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-b border-r transform rotate-45" />
    </div>
  </div>
)

// 7. PasswordStrengthMeter
export const PasswordStrengthMeter = ({ score = 3 }: any) => (
  <div className="w-full max-w-sm space-y-2">
    <input type="password" placeholder="Password" className="w-full p-2 border rounded-md" defaultValue="Str0ngP@ss" />
    <div className="flex gap-1 h-1.5">
      {[1, 2, 3, 4].map(i => <div key={i} className={\`flex-1 rounded-full \${i <= score ? (score < 2 ? 'bg-red-500' : score < 4 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-muted'}\`} />)}
    </div>
    <p className={\`text-xs font-medium \${score < 2 ? 'text-red-500' : score < 4 ? 'text-yellow-500' : 'text-green-500'}\`}>{score < 2 ? 'Weak' : score < 4 ? 'Good' : 'Strong'}</p>
  </div>
)

// 8. UploadProgress
export const UploadProgress = () => (
  <div className="w-full max-w-sm border rounded-lg p-3 flex items-center gap-4 bg-card shadow-sm">
    <div className="p-2 bg-primary/10 text-primary rounded-md"><UploadCloud className="w-5 h-5" /></div>
    <div className="flex-1">
      <div className="flex justify-between text-sm mb-1"><span className="font-medium truncate max-w-[150px]">design-assets.zip</span><span className="text-muted-foreground">45%</span></div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary w-[45%]" /></div>
    </div>
    <button><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
  </div>
)
`
};

// src/registry/pro-forms.ts
var proForms = {
  name: "pro-forms",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "pro-forms.tsx",
  content: `"use client"

import * as React from "react"
import { Lock, Mail, User, Eye, CreditCard, Upload, Search, Frown, Meh, Smile, Laugh, Heart } from "lucide-react"

// 1. LoginFormPro
export const LoginFormPro = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = () => {
    setIsLoading(true)
    setTimeout(() => { setIsLoading(false); setSuccess(true) }, 1500)
  }

  return (
    <div className="w-full max-w-sm p-6 border rounded-2xl bg-card shadow-lg">
      <div className="text-center mb-6"><h2 className="text-2xl font-bold">Welcome back</h2><p className="text-muted-foreground text-sm">Enter your credentials to access your account</p></div>
      {success ? (
        <div className="p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-center mb-4 font-medium">Successfully logged in! Redirecting...</div>
      ) : null}
      <div className="space-y-4">
        <div className="space-y-1"><label className="text-sm font-medium">Email</label><div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input className="w-full pl-9 pr-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="m@example.com" /></div></div>
        <div className="space-y-1"><div className="flex justify-between"><label className="text-sm font-medium">Password</label><a href="#" className="text-xs text-primary hover:underline">Forgot password?</a></div><div className="relative"><Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input type="password" className="w-full pl-9 pr-10 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" /><Eye className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" /></div></div>
        <button onClick={handleSubmit} disabled={isLoading} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex justify-center items-center">
          {isLoading ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : "Sign In"}
        </button>
      </div>
      <div className="mt-4 text-center text-sm">Don't have an account? <a href="#" className="text-primary hover:underline font-medium">Sign up</a></div>
    </div>
  )
}

// 2. RegisterFormPro
export const RegisterFormPro = () => (
  <div className="w-full max-w-sm p-6 border rounded-2xl bg-card shadow-lg">
    <div className="text-center mb-6"><h2 className="text-2xl font-bold">Create an account</h2><p className="text-muted-foreground text-sm">Start your 14-day free trial</p></div>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1"><label className="text-sm font-medium">First name</label><input className="w-full px-3 py-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="Max" /></div>
        <div className="space-y-1"><label className="text-sm font-medium">Last name</label><input className="w-full px-3 py-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="Robinson" /></div>
      </div>
      <div className="space-y-1"><label className="text-sm font-medium">Email</label><input className="w-full px-3 py-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="m@example.com" /></div>
      <div className="space-y-1"><label className="text-sm font-medium">Password</label><input type="password" className="w-full px-3 py-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" /></div>
      <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">Create Account</button>
    </div>
  </div>
)

// 3. PaymentFormPro
export const PaymentFormPro = () => {
  const [method, setMethod] = React.useState('card')
  return (
    <div className="w-full max-w-md p-6 border rounded-2xl bg-card">
      <h3 className="text-lg font-bold mb-4">Payment Method</h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button onClick={() => setMethod('card')} className={\`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 hover:bg-muted transition-colors \${method === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary' : 'text-muted-foreground'}\`}><CreditCard className="h-6 w-6" /><span className="text-xs font-medium">Card</span></button>
        <button onClick={() => setMethod('paypal')} className={\`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 hover:bg-muted transition-colors \${method === 'paypal' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary' : 'text-muted-foreground'}\`}><div className="font-bold text-lg leading-none">P</div><span className="text-xs font-medium">PayPal</span></button>
        <button onClick={() => setMethod('apple')} className={\`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 hover:bg-muted transition-colors \${method === 'apple' ? 'border-primary bg-primary/5 ring-1 ring-primary text-primary' : 'text-muted-foreground'}\`}><div className="font-bold text-lg leading-none">\uF8FF</div><span className="text-xs font-medium">Apple Pay</span></button>
      </div>
      {method === 'card' ? (
        <div className="space-y-4">
          <div className="space-y-1"><label className="text-sm font-medium">Cardholder Name</label><input className="w-full px-3 py-2 border rounded-lg bg-background" placeholder="John Doe" /></div>
          <div className="space-y-1"><label className="text-sm font-medium">Card Number</label><div className="relative"><CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input className="w-full pl-9 pr-3 py-2 border rounded-lg bg-background" placeholder="0000 0000 0000 0000" /></div></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-sm font-medium">Expiry Date</label><input className="w-full px-3 py-2 border rounded-lg bg-background" placeholder="MM/YY" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">CVC</label><input className="w-full px-3 py-2 border rounded-lg bg-background" placeholder="123" /></div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center border-2 border-dashed rounded-xl bg-muted/10">
          <p className="text-sm text-muted-foreground">You will be redirected to {method === 'paypal' ? 'PayPal' : 'Apple Pay'} to complete your purchase securely.</p>
        </div>
      )}
      <button className="w-full py-2.5 bg-foreground text-background rounded-lg font-medium mt-6">Pay $99.00</button>
    </div>
  )
}

// 4. ProfileSettingsForm
export const ProfileSettingsForm = () => (
  <div className="w-full max-w-md space-y-6">
    <div className="flex items-center gap-6">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border"><User className="h-8 w-8 text-muted-foreground" /></div>
      <div className="flex gap-2"><button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md">Change</button><button className="px-4 py-2 border text-sm font-medium rounded-md">Remove</button></div>
    </div>
    <div className="space-y-4">
      <div className="space-y-1"><label className="text-sm font-medium">Username</label><input className="w-full px-3 py-2 border rounded-md" defaultValue="al1mov77" /></div>
      <div className="space-y-1"><label className="text-sm font-medium">Bio</label><textarea className="w-full px-3 py-2 border rounded-md h-24" defaultValue="Frontend Developer building UI components." /></div>
      <button className="px-4 py-2 bg-foreground text-background font-medium rounded-md">Save Changes</button>
    </div>
  </div>
)

// 5. SubscriptionForm
export const SubscriptionForm = () => (
  <div className="w-full max-w-sm p-1 border rounded-full bg-muted flex">
    <input className="flex-1 bg-transparent px-4 py-2 outline-none text-sm" placeholder="Enter your email" />
    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-sm">Subscribe</button>
  </div>
)

// 6. ContactFormPro
export const ContactFormPro = () => (
  <div className="w-full space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1"><label className="text-sm">First Name</label><input className="w-full p-2 border rounded-md bg-muted/50" /></div>
      <div className="space-y-1"><label className="text-sm">Last Name</label><input className="w-full p-2 border rounded-md bg-muted/50" /></div>
    </div>
    <div className="space-y-1"><label className="text-sm">Email</label><input className="w-full p-2 border rounded-md bg-muted/50" /></div>
    <div className="space-y-1"><label className="text-sm">Message</label><textarea className="w-full p-2 border rounded-md bg-muted/50 h-32" /></div>
    <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-md">Send Message</button>
  </div>
)

// 7. AdvancedSearchForm
export const AdvancedSearchForm = () => (
  <div className="w-full max-w-2xl bg-card border rounded-xl shadow-lg p-2 flex items-center gap-2">
    <div className="flex-1 flex items-center px-3 border-r"><Search className="h-5 w-5 text-muted-foreground mr-2" /><input className="w-full py-2 bg-transparent outline-none" placeholder="Search properties..." /></div>
    <div className="w-48 px-3 border-r"><select className="w-full bg-transparent py-2 outline-none text-sm"><option>All Categories</option><option>Houses</option><option>Apartments</option></select></div>
    <div className="w-32 px-3"><select className="w-full bg-transparent py-2 outline-none text-sm"><option>Any Price</option><option>$100k - $500k</option></select></div>
    <button className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shrink-0">Search</button>
  </div>
)

// 8. FileUploadForm
export const FileUploadForm = () => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [files, setFiles] = React.useState<File[]>([])

  return (
    <div className="w-full p-6 border-2 border-dashed rounded-xl bg-muted/10 hover:bg-muted/30 transition-colors">
      <input type="file" multiple className="hidden" ref={inputRef} onChange={(e) => {
        if(e.target.files) setFiles(Array.from(e.target.files))
      }} />
      <div onClick={() => inputRef.current?.click()} className="flex flex-col items-center justify-center text-center cursor-pointer">
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"><Upload className="h-6 w-6" /></div>
        <h3 className="font-semibold mb-1">Click to upload or drag and drop</h3>
        <p className="text-sm text-muted-foreground mb-4">SVG, PNG, JPG or GIF (max. 800x400px)</p>
      </div>
      {files.length > 0 && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <p className="text-sm font-bold">Selected Files:</p>
          {files.map((f, i) => (
            <div key={i} className="text-xs p-2 bg-background border rounded flex justify-between">
              <span className="truncate">{f.name}</span>
              <span className="text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 9. FeedbackForm
export const FeedbackForm = () => {
  const [selected, setSelected] = React.useState<number | null>(null)
  const sentiments = [
    { icon: Frown, label: "Poor", color: "hover:text-red-500 hover:bg-red-500/10", active: "text-red-500 bg-red-500/10 border-red-500/30" },
    { icon: Meh, label: "Fair", color: "hover:text-amber-500 hover:bg-amber-500/10", active: "text-amber-500 bg-amber-500/10 border-amber-500/30" },
    { icon: Smile, label: "Good", color: "hover:text-sky-500 hover:bg-sky-500/10", active: "text-sky-500 bg-sky-500/10 border-sky-500/30" },
    { icon: Laugh, label: "Great", color: "hover:text-emerald-500 hover:bg-emerald-500/10", active: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30" },
    { icon: Heart, label: "Loved", color: "hover:text-pink-500 hover:bg-pink-500/10", active: "text-pink-500 bg-pink-500/10 border-pink-500/30" },
  ]

  return (
    <div className="w-full max-w-sm p-6 border rounded-xl bg-card space-y-4 text-center">
      <h3 className="font-bold text-lg">How was your experience?</h3>
      <div className="flex justify-center gap-2">
        {sentiments.map((s, i) => {
          const Icon = s.icon
          const isSelected = selected === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              title={s.label}
              className={\`p-2.5 rounded-xl border transition-all cursor-pointer \${
                isSelected
                  ? s.active
                  : "border-border/60 text-muted-foreground " + s.color
              }\`}
            >
              <Icon className="w-5 h-5" />
            </button>
          )
        })}
      </div>
      <textarea className="w-full p-3 border rounded-md text-sm mt-4 resize-none h-20 bg-background" placeholder="Tell us more (optional)" />
      <button className="w-full py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">Submit Feedback</button>
    </div>
  )
}

// 10. InviteUsersForm
export const InviteUsersForm = () => (
  <div className="w-full border rounded-xl bg-card p-4 space-y-4">
    <div className="flex gap-2">
      <input className="flex-1 p-2 border rounded-md text-sm" placeholder="Email address" />
      <select className="p-2 border rounded-md text-sm bg-background"><option>Member</option><option>Admin</option></select>
      <button className="px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-md text-sm">Send Invite</button>
    </div>
    <div className="border-t pt-4 space-y-3">
      <h4 className="text-sm font-semibold">Pending Invites</h4>
      <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">john@example.com</span><span className="px-2 py-1 bg-muted rounded text-xs">Member</span></div>
    </div>
  </div>
)
`
};

// src/registry/pro-inputs.ts
var proInputs = {
  name: "pro-inputs",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  componentsDependencies: [
    "input"
  ],
  fileName: "pro-inputs.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// Re-export standard input variants for backward compatibility
export { GradientInput as GradientFocusInput, FloatingLabelInput as AnimatedLabelInput, SearchInput as SearchCommandInput } from "./input"

// ============================================
// 1. OTPInput \u2014 One-time passcode input
// ============================================
export function OTPCodeInput({ length = 6, className, onChange }: { length?: number; className?: string; onChange?: (val: string) => void }) {
  const [values, setValues] = React.useState<string[]>(Array(length).fill(""))
  const refs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (i: number, v: string) => {
    if (!/^\\d*$/.test(v)) return
    const newVals = [...values]
    newVals[i] = v.slice(-1)
    setValues(newVals)
    onChange?.(newVals.join(""))
    if (v && i < length - 1) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[i] && i > 0) refs.current[i - 1]?.focus()
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-12 text-center text-lg font-mono rounded-lg border border-border bg-background text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
        />
      ))}
    </div>
  )
}

// ============================================
// 2. TagInput \u2014 Input with tags
// ============================================
export function TagInput({ placeholder = "Add tag...", className }: { placeholder?: string; className?: string }) {
  const [tags, setTags] = React.useState<string[]>(["React", "TypeScript"])
  const [input, setInput] = React.useState("")

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setInput("")
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-border bg-background min-h-[44px]", className)}>
      <AnimatePresence>
        {tags.map((tag) => (
          <motion.span
            key={tag}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
          >
            {tag}
            <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-destructive">\xD7</button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        className="flex-1 min-w-[100px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
        placeholder={placeholder}
      />
    </div>
  )
}

// ============================================
// 3. CurrencyInput
// ============================================
export function CurrencyInput({ currency = "$", className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { currency?: string }) {
  return (
    <div className={cn("relative", className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">{currency}</span>
      <input
        type="number"
        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
        placeholder="0.00"
        {...props}
      />
    </div>
  )
}

// ============================================
// 4. TextareaAutosize \u2014 Auto-expanding textarea
// ============================================
export function TextareaAutosize({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = React.useRef<HTMLTextAreaElement>(null)

  const handleInput = () => {
    if (!ref.current) return
    ref.current.style.height = "auto"
    ref.current.style.height = ref.current.scrollHeight + "px"
  }

  return (
    <textarea
      ref={ref}
      onInput={handleInput}
      className={cn(
        "w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none min-h-[80px] placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

// ============================================
// 5. ColorPickerInput
// ============================================
export function ColorPickerInput({ value: initial = "#8b5cf6", label, className, onChange }: {
  value?: string; label?: string; className?: string; onChange?: (color: string) => void
}) {
  const [color, setColor] = React.useState(initial)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <div className="w-10 h-10 rounded-lg border-2 border-border overflow-hidden" style={{ backgroundColor: color }} />
        <input
          type="color" value={color}
          onChange={(e) => { setColor(e.target.value); onChange?.(e.target.value) }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
      <div>
        {label && <p className="text-sm font-medium">{label}</p>}
        <p className="text-xs text-muted-foreground font-mono">{color}</p>
      </div>
    </div>
  )
}
`
};

// src/registry/pro-layouts.ts
var proLayouts = {
  name: "pro-layouts",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "pro-layouts.tsx",
  content: `"use client"

import { User, Bell, Search } from "lucide-react"

// 1. SplitScreenLayout
export const SplitScreenLayout = () => (
  <div className="flex w-full h-[400px] border rounded-xl overflow-hidden bg-background">
    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-card">
      <div className="w-12 h-12 bg-primary rounded-xl mb-8" />
      <h2 className="text-3xl font-bold mb-4">Welcome back</h2>
      <p className="text-muted-foreground mb-8">Please enter your details to sign in.</p>
      <div className="w-full h-10 bg-muted rounded-lg mb-4" />
      <div className="w-full h-10 bg-muted rounded-lg mb-8" />
      <div className="w-full h-12 bg-primary rounded-lg" />
    </div>
    <div className="hidden md:block flex-1 bg-linear-to-br from-indigo-500 to-purple-600 p-12 text-white flex flex-col justify-between">
      <div></div>
      <div>
        <h2 className="text-4xl font-bold mb-4">Nexore UI</h2>
        <p className="text-lg opacity-80">The most powerful and flexible UI library for modern web applications.</p>
      </div>
    </div>
  </div>
)

// 2. AuthenticationLayout (Centered)
export const AuthenticationLayout = () => (
  <div className="w-full h-[400px] bg-muted/20 border rounded-xl flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-card border rounded-2xl shadow-xl p-8 flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6"><User className="w-8 h-8 text-primary" /></div>
      <h2 className="text-2xl font-bold mb-2">Create Account</h2>
      <p className="text-muted-foreground text-center mb-8 text-sm">Join thousands of developers building the future.</p>
      <div className="w-full space-y-4"><div className="w-full h-10 bg-muted rounded-md" /><div className="w-full h-10 bg-muted rounded-md" /><div className="w-full h-10 bg-primary rounded-md mt-4" /></div>
    </div>
  </div>
)

// 3. SidebarLayout
export const SidebarLayout = () => (
  <div className="flex w-full h-[400px] border rounded-xl overflow-hidden bg-background text-sm">
    <div className="w-64 bg-card border-r flex flex-col">
      <div className="h-14 border-b flex items-center px-4 font-bold">App Name</div>
      <div className="p-4 space-y-2 flex-1"><div className="w-full h-8 bg-primary/10 text-primary rounded flex items-center px-3 font-medium">Dashboard</div><div className="w-full h-8 hover:bg-muted rounded flex items-center px-3 text-muted-foreground">Projects</div></div>
      <div className="p-4 border-t flex items-center gap-3"><div className="w-8 h-8 bg-muted rounded-full" /><div className="flex-1 h-4 bg-muted rounded" /></div>
    </div>
    <div className="flex-1 flex flex-col">
      <div className="h-14 border-b flex items-center px-6 justify-between"><div className="font-bold">Overview</div><div className="flex gap-4"><Search className="w-4 h-4 text-muted-foreground" /><Bell className="w-4 h-4 text-muted-foreground" /></div></div>
      <div className="p-6 flex-1 bg-muted/10"><div className="w-full h-full border-2 border-dashed rounded-xl border-muted flex items-center justify-center text-muted-foreground">Content Area</div></div>
    </div>
  </div>
)

// 4. DashboardGridLayout
export const DashboardGridLayout = () => (
  <div className="w-full p-4 border rounded-xl bg-muted/10 space-y-4 h-[400px] overflow-hidden">
    <div className="grid grid-cols-4 gap-4"><div className="col-span-1 h-24 bg-card border rounded-xl shadow-sm" /><div className="col-span-1 h-24 bg-card border rounded-xl shadow-sm" /><div className="col-span-1 h-24 bg-card border rounded-xl shadow-sm" /><div className="col-span-1 h-24 bg-card border rounded-xl shadow-sm" /></div>
    <div className="grid grid-cols-3 gap-4 h-[200px]"><div className="col-span-2 bg-card border rounded-xl shadow-sm" /><div className="col-span-1 bg-card border rounded-xl shadow-sm" /></div>
  </div>
)

// 5. BentoGridVisual
export const BentoGridVisual = () => (
  <div className="w-full h-[400px] border rounded-xl bg-background p-4 grid grid-cols-4 grid-rows-3 gap-4">
    <div className="col-span-2 row-span-2 bg-linear-to-br from-primary/20 to-primary/5 border rounded-2xl p-6 flex flex-col justify-end"><h3 className="text-2xl font-bold">Main Feature</h3></div>
    <div className="col-span-1 row-span-1 bg-card border rounded-2xl" />
    <div className="col-span-1 row-span-2 bg-card border rounded-2xl" />
    <div className="col-span-1 row-span-1 bg-card border rounded-2xl" />
    <div className="col-span-3 row-span-1 bg-card border rounded-2xl" />
  </div>
)

// 6. KanbanBoardVisual
export const KanbanBoardVisual = () => (
  <div className="flex w-full h-[400px] border rounded-xl bg-muted/20 p-4 gap-4 overflow-hidden">
    {[1, 2, 3].map(col => (
      <div key={col} className="w-80 shrink-0 flex flex-col bg-card border rounded-xl p-3 h-full">
        <h4 className="font-bold text-sm mb-3 px-1">{col === 1 ? 'To Do' : col === 2 ? 'In Progress' : 'Done'} <span className="text-muted-foreground font-normal ml-2">3</span></h4>
        <div className="space-y-3 flex-1 overflow-hidden">
          <div className="w-full h-24 bg-background border rounded-lg shadow-sm" />
          <div className="w-full h-32 bg-background border rounded-lg shadow-sm" />
        </div>
      </div>
    ))}
  </div>
)

// 7. ChatLayoutVisual
export const ChatLayoutVisual = () => (
  <div className="flex w-full h-[400px] border rounded-xl overflow-hidden bg-background">
    <div className="w-64 border-r flex flex-col"><div className="p-4 border-b font-bold">Messages</div><div className="p-2 space-y-1 flex-1"><div className="w-full h-12 bg-muted rounded-lg" /><div className="w-full h-12 hover:bg-muted/50 rounded-lg" /></div></div>
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b font-bold flex items-center gap-3"><div className="w-8 h-8 bg-muted rounded-full" /> User Name</div>
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden bg-muted/10">
        <div className="w-64 h-12 bg-muted rounded-2xl rounded-tl-sm" />
        <div className="w-48 h-10 bg-primary rounded-2xl rounded-tr-sm self-end" />
      </div>
      <div className="p-4 border-t"><div className="w-full h-10 bg-muted rounded-full" /></div>
    </div>
  </div>
)

// 8. FeedLayout
export const FeedLayout = () => (
  <div className="w-full h-[400px] border rounded-xl overflow-hidden bg-muted/20 flex justify-center p-4">
    <div className="w-full max-w-lg flex flex-col gap-4">
      <div className="w-full p-4 bg-card border rounded-xl shadow-sm"><div className="flex gap-3 items-center mb-4"><div className="w-10 h-10 bg-muted rounded-full" /><div className="w-32 h-4 bg-muted rounded" /></div><div className="w-full h-24 bg-muted/50 rounded-lg" /></div>
      <div className="w-full p-4 bg-card border rounded-xl shadow-sm"><div className="flex gap-3 items-center mb-4"><div className="w-10 h-10 bg-muted rounded-full" /><div className="w-32 h-4 bg-muted rounded" /></div><div className="w-full h-24 bg-muted/50 rounded-lg" /></div>
    </div>
  </div>
)

// 9. DocumentationLayout
export const DocumentationLayout = () => (
  <div className="flex w-full h-[400px] border rounded-xl overflow-hidden bg-background">
    <div className="w-64 border-r p-4 space-y-4"><div className="w-full h-6 bg-muted rounded mb-6" /><div className="w-full h-4 bg-muted/50 rounded" /><div className="w-3/4 h-4 bg-muted/50 rounded" /><div className="w-5/6 h-4 bg-muted/50 rounded" /></div>
    <div className="flex-1 p-8 overflow-hidden">
      <h1 className="text-3xl font-bold mb-4">Installation</h1>
      <p className="text-muted-foreground mb-6">Learn how to install and setup the library in your project.</p>
      <div className="w-full h-32 bg-zinc-950 rounded-xl mb-6 flex items-center px-4"><span className="font-mono text-zinc-300">npm install nexoreui</span></div>
      <div className="w-full h-4 bg-muted rounded mb-2" /><div className="w-full h-4 bg-muted rounded mb-2" /><div className="w-3/4 h-4 bg-muted rounded" />
    </div>
    <div className="w-48 border-l p-4 space-y-4 hidden lg:block"><div className="text-sm font-bold">On this page</div><div className="w-full h-3 bg-muted rounded" /><div className="w-2/3 h-3 bg-muted rounded" /></div>
  </div>
)

// 10. HeaderFooterLayout
export const HeaderFooterLayout = () => (
  <div className="flex flex-col w-full h-[400px] border rounded-xl overflow-hidden bg-background">
    <header className="h-16 border-b flex items-center justify-between px-6 bg-card"><div className="w-8 h-8 bg-primary rounded" /><div className="flex gap-4"><div className="w-16 h-4 bg-muted rounded" /><div className="w-16 h-4 bg-muted rounded" /></div></header>
    <main className="flex-1 bg-muted/10 p-8"><div className="w-full h-full border-2 border-dashed rounded-xl border-muted flex items-center justify-center">Main Content</div></main>
    <footer className="h-20 border-t bg-card p-6 flex items-center justify-between"><div className="w-32 h-4 bg-muted rounded" /><div className="flex gap-2"><div className="w-6 h-6 bg-muted rounded-full" /><div className="w-6 h-6 bg-muted rounded-full" /></div></footer>
  </div>
)
`
};

// src/registry/pro-lists.ts
var proLists = {
  name: "pro-lists",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "pro-lists.tsx",
  content: `"use client"

import { Phone, Mail, FileText, Download, Briefcase, MapPin, Clock, MessageSquare, Plus, Check } from "lucide-react"

// 1. ContactList
export const ContactList = () => (
  <div className="w-full max-w-md border rounded-xl bg-card divide-y">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">C{i}</div>
          <div><h4 className="font-semibold text-sm">Contact Name {i}</h4><p className="text-xs text-muted-foreground">contact{i}@example.com</p></div>
        </div>
        <div className="flex gap-2 text-muted-foreground"><Phone className="w-4 h-4 hover:text-foreground" /><Mail className="w-4 h-4 hover:text-foreground" /></div>
      </div>
    ))}
  </div>
)

// 2. NotificationList
export const NotificationList = () => (
  <div className="w-full max-w-md border rounded-xl bg-card divide-y">
    <div className="p-4 border-b font-bold flex justify-between items-center">Notifications <span className="text-xs font-normal text-primary hover:underline cursor-pointer">Mark all read</span></div>
    {[1, 2, 3].map(i => (
      <div key={i} className={\`flex gap-4 p-4 \${i === 1 ? 'bg-primary/5' : ''}\`}>
        {i === 1 && <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />}
        <div className="flex-1"><p className="text-sm"><span className="font-bold">System</span> completed the backup successfully.</p><p className="text-xs text-muted-foreground mt-1">2 hours ago</p></div>
      </div>
    ))}
  </div>
)

// 3. TimelineVertical
export const TimelineVertical = () => (
  <div className="w-full max-w-md p-4">
    <div className="relative border-l-2 border-muted ml-3 space-y-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="relative pl-6">
          <div className="absolute w-4 h-4 bg-primary rounded-full border-4 border-background -left-[9px] top-1" />
          <h4 className="font-bold text-sm mb-1">Project Milestone {i}</h4>
          <p className="text-xs text-muted-foreground mb-2">October {10 + i}, 2025</p>
          <p className="text-sm">Completed the initial design phase and got client approval.</p>
        </div>
      ))}
    </div>
  </div>
)

// 4. StepList
export const StepList = () => (
  <div className="w-full max-w-md space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-4">
        <div className={\`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 font-bold text-sm \${i === 1 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'}\`}>{i === 1 ? <Check className="w-4 h-4" /> : i}</div>
        <div><h4 className={\`font-bold text-sm \${i === 1 ? '' : 'text-muted-foreground'}\`}>Step {i} Title</h4><p className="text-sm text-muted-foreground mt-1">Detailed description of what needs to be done in this step.</p></div>
      </div>
    ))}
  </div>
)

// 5. FAQAccordionList (Visual Mock)
export const FAQAccordionList = () => (
  <div className="w-full max-w-2xl border rounded-xl bg-card divide-y">
    {[1, 2, 3].map(i => (
      <div key={i} className="p-4">
        <h4 className="font-bold text-sm mb-2 flex justify-between">How does pricing work? <Plus className="w-4 h-4 text-muted-foreground" /></h4>
        {i === 1 && <p className="text-sm text-muted-foreground mt-2">Pricing is based on the number of users in your workspace. You can upgrade or downgrade at any time.</p>}
      </div>
    ))}
  </div>
)

// 6. FileDownloadList
export const FileDownloadList = () => (
  <div className="w-full max-w-md border rounded-xl bg-card p-4 space-y-3">
    <h3 className="font-bold text-sm mb-4">Attached Files</h3>
    {[1, 2].map(i => (
      <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors">
        <div className="flex items-center gap-3"><FileText className="w-8 h-8 text-primary" /><div><p className="text-sm font-medium">Document-{i}.pdf</p><p className="text-xs text-muted-foreground">2.4 MB</p></div></div>
        <button className="p-2 border bg-background rounded-full hover:text-primary"><Download className="w-4 h-4" /></button>
      </div>
    ))}
  </div>
)

// 7. MessageList
export const MessageList = () => (
  <div className="w-full max-w-md border rounded-xl bg-card divide-y">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-4 p-4 hover:bg-muted/50 cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1"><h4 className="font-bold text-sm truncate">Jane Doe</h4><span className="text-xs text-muted-foreground shrink-0">12:30 PM</span></div>
          <p className="text-sm text-muted-foreground truncate">Hey, are we still on for the meeting later today?</p>
        </div>
      </div>
    ))}
  </div>
)

// 8. JobBoardList
export const JobBoardList = () => (
  <div className="w-full max-w-2xl border rounded-xl bg-card divide-y">
    {[1, 2].map(i => (
      <div key={i} className="p-6 hover:bg-muted/20 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-bold mb-2">Senior React Developer</h3>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> Full-time</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Remote</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Posted 2 days ago</span>
          </div>
        </div>
        <button className="px-6 py-2 border rounded-full text-sm font-bold hover:bg-muted">Apply Now</button>
      </div>
    ))}
  </div>
)

// 9. EventScheduleList
export const EventScheduleList = () => (
  <div className="w-full max-w-lg p-6 bg-card border rounded-xl">
    <h3 className="font-bold text-xl mb-6">Conference Schedule</h3>
    <div className="space-y-6">
      {[1, 2].map(i => (
        <div key={i} className="flex gap-4">
          <div className="text-right w-16 shrink-0"><p className="font-bold">09:00</p><p className="text-xs text-muted-foreground">AM</p></div>
          <div className="w-0.5 bg-primary/20 relative"><div className="absolute top-1 -left-1 w-2.5 h-2.5 rounded-full bg-primary" /></div>
          <div className="pb-6"><h4 className="font-bold text-lg mb-1">Keynote Speech</h4><p className="text-sm text-muted-foreground mb-2">Main Stage</p><div className="flex items-center gap-2 text-xs font-medium bg-muted w-fit px-2 py-1 rounded"><div className="w-4 h-4 bg-primary/20 rounded-full" /> Speaker Name</div></div>
        </div>
      ))}
    </div>
  </div>
)

// 10. RecentCommentsList
export const RecentCommentsList = () => (
  <div className="w-full max-w-md space-y-4">
    {[1, 2].map(i => (
      <div key={i} className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
        <div className="flex-1 bg-card border p-3 rounded-2xl rounded-tl-none text-sm">
          <p className="font-bold mb-1">User {i} <span className="font-normal text-muted-foreground text-xs ml-2">1h ago</span></p>
          <p>This is a great article! Thanks for sharing this information.</p>
          <div className="flex gap-3 mt-2 text-xs font-medium text-muted-foreground"><button className="hover:text-primary flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Reply</button></div>
        </div>
      </div>
    ))}
  </div>
)
`
};

// src/registry/pro-marketing.ts
var proMarketing = {
  name: "pro-marketing",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "pro-marketing.tsx",
  content: `"use client"

import { Check, X, Play, ArrowRight, ShieldCheck } from "lucide-react"

// 1. WaitlistForm
export const WaitlistForm = () => (
  <div className="w-full max-w-md mx-auto text-center space-y-6 bg-card p-8 rounded-3xl border shadow-xl">
    <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full mb-2">EARLY ACCESS</div>
    <h2 className="text-3xl font-extrabold tracking-tight">Join the Waitlist</h2>
    <p className="text-muted-foreground text-sm">Be the first to know when we launch and get 50% off your first year.</p>
    <div className="flex flex-col gap-3">
      <input className="w-full px-4 py-3 bg-muted/50 border rounded-xl outline-none focus:border-primary transition-colors" placeholder="Email address" />
      <button className="w-full py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity">Request Access</button>
    </div>
    <p className="text-xs text-muted-foreground">Over 10,000+ people already joined.</p>
  </div>
)

// 2. PricingToggle
export const PricingToggle = () => (
  <div className="flex items-center justify-center gap-3">
    <span className="font-medium text-sm">Monthly</span>
    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute top-1 left-7 w-4 h-4 bg-background rounded-full transition-all" /></div>
    <span className="font-medium text-sm">Annually <span className="text-green-500 text-xs font-bold bg-green-500/10 px-1.5 py-0.5 rounded ml-1">Save 20%</span></span>
  </div>
)

// 3. FeatureShowcase
export const FeatureShowcase = () => (
  <div className="flex items-center gap-8 bg-card border rounded-2xl p-6 overflow-hidden">
    <div className="flex-1 space-y-4">
      <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
      <h3 className="text-2xl font-bold">Enterprise Security</h3>
      <p className="text-muted-foreground">Bank-grade encryption for all your data. We never compromise on the security of your business.</p>
      <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">Learn more <ArrowRight className="w-4 h-4" /></button>
    </div>
    <div className="flex-1 h-48 bg-muted rounded-xl border flex items-center justify-center font-mono text-muted-foreground text-sm">Illustration Placeholder</div>
  </div>
)

// 4. TrustBanner
export const TrustBanner = () => (
  <div className="py-8 text-center border-y bg-muted/20">
    <p className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-widest">Backed by the best</p>
    <div className="flex justify-center gap-8 flex-wrap opacity-60">
      <div className="font-black text-xl">Y COMBINATOR</div><div className="font-black text-xl">SEQUOIA</div><div className="font-black text-xl">a16z</div>
    </div>
  </div>
)

// 5. ComparisonTableMock
export const ComparisonTableMock = () => (
  <div className="w-full border rounded-2xl bg-card overflow-hidden shadow-sm">
    <div className="grid grid-cols-3 bg-muted/50 p-4 border-b font-bold text-center">
      <div className="text-left">Features</div><div className="text-muted-foreground">Others</div><div className="text-primary">Us</div>
    </div>
    <div className="divide-y text-sm">
      {['Real-time sync', 'End-to-end encryption', '24/7 Support'].map((f, i) => (
        <div key={i} className="grid grid-cols-3 p-4 items-center text-center">
          <div className="text-left font-medium">{f}</div>
          <div className="flex justify-center">
            {i === 0 ? <Check className="w-4 h-4 text-muted-foreground/60" /> : <X className="w-4 h-4 text-muted-foreground/30" />}
          </div>
          <div className="flex justify-center">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// 6. AnimatedHeroText
export const AnimatedHeroText = () => (
  <h1 className="text-4xl md:text-6xl font-black text-center leading-tight">
    Create the next <br/>
    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 animate-[pulse_4s_ease-in-out_infinite]">unicorn startup.</span>
  </h1>
)

// 7. StatCounter
export const StatCounter = () => (
  <div className="grid grid-cols-3 gap-4 border-y py-8 text-center bg-card">
    <div><div className="text-4xl font-black text-primary mb-1">99.9%</div><div className="text-sm font-medium text-muted-foreground">Uptime SLA</div></div>
    <div><div className="text-4xl font-black text-primary mb-1">2M+</div><div className="text-sm font-medium text-muted-foreground">Active Users</div></div>
    <div><div className="text-4xl font-black text-primary mb-1">4.9/5</div><div className="text-sm font-medium text-muted-foreground">Customer Rating</div></div>
  </div>
)

// 8. NewsletterSignup
export const NewsletterSignup = () => (
  <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-3xl text-center md:text-left flex flex-col md:flex-row items-center gap-8 justify-between">
    <div className="max-w-md"><h2 className="text-3xl font-bold mb-2">Subscribe to our newsletter</h2><p className="opacity-90">Get the latest news, articles, and resources delivered to your inbox weekly.</p></div>
    <div className="w-full max-w-sm flex flex-col gap-2">
      <div className="flex gap-2"><input className="flex-1 px-4 py-3 rounded-xl text-foreground outline-none" placeholder="Enter your email" /><button className="px-6 py-3 bg-foreground text-background font-bold rounded-xl">Subscribe</button></div>
      <p className="text-xs opacity-70 text-center md:text-left">We care about your data. Read our Privacy Policy.</p>
    </div>
  </div>
)

// 9. VideoModalVisual
export const VideoModalVisual = () => (
  <div className="relative w-full max-w-2xl mx-auto aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer border border-white/10">
    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Play className="w-6 h-6 text-white ml-1" /></div>
    </div>
    <div className="absolute bottom-4 left-4 text-white"><h4 className="font-bold">Watch the demo</h4><p className="text-sm opacity-80">2 mins</p></div>
  </div>
)

// 10. GradientCTABlock
export const GradientCTABlock = () => (
  <div className="relative p-12 rounded-3xl overflow-hidden border shadow-lg text-center">
    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
    <div className="relative z-10 max-w-lg mx-auto space-y-6">
      <h2 className="text-3xl md:text-4xl font-extrabold">Ready to dive in?</h2>
      <p className="text-lg text-muted-foreground">Start your free 14-day trial today. No credit card required.</p>
      <button className="px-8 py-4 bg-foreground text-background rounded-full font-bold shadow-xl hover:scale-105 transition-transform">Get Started Free</button>
    </div>
  </div>
)
`
};

// src/registry/pro-navigation.ts
var proNavigation = {
  name: "pro-navigation",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "pro-navigation.tsx",
  content: `"use client"

import { Globe, ChevronDown, X, ChevronRight, ChevronLeft } from "lucide-react"

// ============================================
// 1. FilterBar
// ============================================
export const FilterBar = () => (
  <div className="flex flex-wrap gap-3 items-center p-2 border rounded-lg bg-card">
    <span className="text-sm font-bold ml-2">Filters:</span>
    <div className="flex items-center border rounded-full px-3 py-1 bg-muted/50 text-sm gap-2">Status: Active <X className="w-3 h-3 cursor-pointer" /></div>
    <div className="flex items-center border rounded-full px-3 py-1 bg-muted/50 text-sm gap-2">Role: Admin <X className="w-3 h-3 cursor-pointer" /></div>
    <button className="text-sm border-dashed border rounded-full px-3 py-1 text-muted-foreground hover:bg-muted">+ Add Filter</button>
    <button className="text-sm text-muted-foreground hover:text-foreground ml-auto pr-2">Clear all</button>
  </div>
)

// ============================================
// 2. LanguageSelector
// ============================================
export const LanguageSelector = () => (
  <div className="inline-flex items-center border rounded-md bg-card overflow-hidden">
    <div className="px-3 py-2 border-r flex items-center"><Globe className="w-4 h-4 text-muted-foreground" /></div>
    <select className="bg-transparent pl-3 pr-8 py-2 text-sm font-medium outline-none cursor-pointer appearance-none">
      <option>English (US)</option><option>Spanish</option><option>French</option>
    </select>
  </div>
)

// ============================================
// 3. UserMenuDropdown
// ============================================
export const UserMenuDropdown = () => (
  <div className="flex items-center gap-3 cursor-pointer p-2 border rounded-lg hover:bg-muted transition-colors w-fit">
    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">JD</div>
    <div className="flex flex-col"><span className="text-sm font-bold leading-none">John Doe</span><span className="text-xs text-muted-foreground">admin@example.com</span></div>
    <ChevronDown className="w-4 h-4 text-muted-foreground ml-2" />
  </div>
)

// ============================================
// 4. TreeNavigation
// ============================================
export const TreeNavigation = () => (
  <div className="w-64 bg-card border rounded-lg p-4 space-y-1 text-sm">
    <div className="flex items-center gap-2 font-bold cursor-pointer py-1"><ChevronDown className="w-4 h-4" /> Components</div>
    <div className="pl-6 space-y-1">
      <div className="flex items-center gap-2 font-medium text-primary cursor-pointer py-1 bg-primary/10 px-2 rounded">Buttons</div>
      <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer py-1 px-2">Cards</div>
      <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer py-1 px-2">Inputs</div>
    </div>
    <div className="flex items-center gap-2 font-bold text-muted-foreground cursor-pointer py-1"><ChevronRight className="w-4 h-4" /> Hooks</div>
  </div>
)

// ============================================
// 5. ContextActionBar
// ============================================
export const ContextActionBar = () => (
  <div className="flex items-center justify-between p-2 bg-primary text-primary-foreground rounded-lg shadow-xl mx-auto w-fit gap-6 animate-in slide-in-from-bottom-4">
    <span className="text-sm font-medium pl-2">3 items selected</span>
    <div className="flex gap-2">
      <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors">Move</button>
      <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors">Archive</button>
      <button className="px-3 py-1 bg-destructive hover:bg-destructive/90 rounded text-sm font-medium transition-colors">Delete</button>
    </div>
  </div>
)

// ============================================
// 6. PaginationPro
// ============================================
export const PaginationPro = () => (
  <div className="flex items-center gap-1 border bg-card p-1 rounded-md w-fit mx-auto">
    <button className="p-2 hover:bg-muted rounded text-muted-foreground disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
    <button className="w-8 h-8 rounded text-sm font-medium hover:bg-muted">1</button>
    <button className="w-8 h-8 rounded text-sm font-medium bg-primary text-primary-foreground">2</button>
    <button className="w-8 h-8 rounded text-sm font-medium hover:bg-muted">3</button>
    <span className="px-2 text-muted-foreground">...</span>
    <button className="w-8 h-8 rounded text-sm font-medium hover:bg-muted">10</button>
    <button className="p-2 hover:bg-muted rounded text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
  </div>
)
`
};

// src/registry/pro-tables.ts
var proTables = {
  name: "pro-tables",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  componentsDependencies: [
    "table"
  ],
  fileName: "pro-tables.tsx",
  content: `"use client"

import * as React from "react"
import { ArrowUpDown, Download, Edit2, Trash2, CheckCircle2, XCircle, Folder, FileText } from "lucide-react"

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./table"
import { cn } from "../utils/cn"

export interface DataTableProColumn<T = any> {
  header: React.ReactNode
  accessorKey?: keyof T | string
  cell?: (item: T, index: number) => React.ReactNode
  className?: string
}

export interface DataTableProProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  data?: T[]
  columns?: DataTableProColumn<T>[]
  searchPlaceholder?: string
  itemsPerPage?: number
  showSearch?: boolean
  showExport?: boolean
  children?: React.ReactNode
}

export type DataTableProComponent = ((props: DataTableProProps) => React.ReactElement | null) & {
  Header: typeof TableHeader
  Body: typeof TableBody
  Footer: typeof TableFooter
  Row: typeof TableRow
  Head: typeof TableHead
  Cell: typeof TableCell
  Caption: typeof TableCaption
}

// 1. DataTablePro
const DataTableProBase = ({
  data: customData,
  columns: customColumns,
  searchPlaceholder = "Search by name...",
  itemsPerPage = 3,
  showSearch = true,
  showExport = true,
  className,
  children,
  ...props
}: DataTableProProps) => {
  // If compound children are passed, render them directly in a Table container
  if (children) {
    return (
      <div className={cn("w-full border rounded-xl bg-card overflow-hidden", className)} {...props}>
        <Table>{children}</Table>
      </div>
    )
  }

  const defaultUsers = [
    { id: 1, name: "Alice Freeman", role: "Admin", status: "Active" },
    { id: 2, name: "Bob Smith", role: "Editor", status: "Inactive" },
    { id: 3, name: "Charlie Davis", role: "Viewer", status: "Active" },
    { id: 4, name: "Diana Prince", role: "Admin", status: "Active" },
    { id: 5, name: "Evan Wright", role: "User", status: "Inactive" },
    { id: 6, name: "Fiona Gallagher", role: "Viewer", status: "Active" }
  ]

  const [data, setData] = React.useState<any[]>(customData || defaultUsers)
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [editName, setEditName] = React.useState("")

  React.useEffect(() => {
    if (customData) {
      setData(customData)
    }
  }, [customData])

  const handleDelete = (id: number) => {
    setData(data.filter(item => item.id !== id))
  }

  const handleEdit = (id: number, name: string) => {
    setEditingId(id)
    setEditName(name)
  }

  const saveEdit = (id: number) => {
    setData(data.map(item => item.id === id ? { ...item, name: editName } : item))
    setEditingId(null)
  }

  const filteredData = data.filter(item => {
    if (!search.trim()) return true
    return Object.values(item).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  })

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className={cn("w-full border rounded-xl bg-card overflow-hidden", className)} {...props}>
      {showSearch && (
        <div className="flex justify-between items-center p-4 border-b">
          <input 
            className="px-3 py-1.5 border border-border rounded-md text-sm w-64 bg-background placeholder:text-muted-foreground outline-none focus:border-primary" 
            placeholder={searchPlaceholder} 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          {showExport && (
            <button
              type="button"
              onClick={() => alert("Data exported to CSV")}
              className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Export
            </button>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b">
            {customColumns ? (
              <tr>
                {customColumns.map((col, idx) => (
                  <th key={idx} className={cn("px-4 py-3", col.className)}>{col.header}</th>
                ))}
              </tr>
            ) : (
              <tr>
                <th className="px-4 py-3 cursor-pointer hover:text-foreground">Name <ArrowUpDown className="w-3 h-3 inline ml-1" /></th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-border">
            {customColumns ? (
              paginatedData.length > 0 ? paginatedData.map((item, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-muted/30">
                  {customColumns.map((col, colIdx) => (
                    <td key={colIdx} className={cn("px-4 py-3", col.className)}>
                      {col.cell ? col.cell(item, rowIdx) : col.accessorKey ? String(item[col.accessorKey] ?? "") : null}
                    </td>
                  ))}
                </tr>
              )) : (
                <tr><td colSpan={customColumns.length} className="text-center py-6 text-muted-foreground">No entries found.</td></tr>
              )
            ) : (
              paginatedData.length > 0 ? paginatedData.map(item => (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">
                    {editingId === item.id ? (
                      <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-2 py-1 border rounded bg-background" />
                    ) : item.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.role}</td>
                  <td className="px-4 py-3">
                    <span className={\`px-2 py-1 rounded-full text-xs font-medium \${item.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}\`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    {editingId === item.id ? (
                      <button onClick={() => saveEdit(item.id)} className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-medium">Save</button>
                    ) : (
                      <button onClick={() => handleEdit(item.id, item.name)} className="p-1.5 hover:bg-muted rounded text-muted-foreground"><Edit2 className="w-4 h-4" /></button>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-destructive/10 rounded text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">No users found.</td></tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-border text-sm text-muted-foreground flex justify-between items-center">
        <span>Showing {paginatedData.length} of {filteredData.length} entries</span>
        <div className="flex gap-1">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded hover:bg-muted disabled:opacity-50">Prev</button>
          <span className="px-3 py-1 font-medium">{page} / {totalPages}</span>
          <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded hover:bg-muted disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  )
}

// Dot-notation attachment for DataTablePro
export const DataTablePro: DataTableProComponent = Object.assign(DataTableProBase, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
})

// 2. InvoiceTable
export const InvoiceTable = () => (
  <div className="w-full border rounded-xl bg-card overflow-hidden">
    <table className="w-full text-sm text-left">
      <thead className="bg-muted/50 text-muted-foreground border-b">
        <tr><th className="px-6 py-4 font-semibold">Invoice ID</th><th className="px-6 py-4 font-semibold">Date</th><th className="px-6 py-4 font-semibold">Amount</th><th className="px-6 py-4 font-semibold text-right">Download</th></tr>
      </thead>
      <tbody className="divide-y">
        {['INV-001', 'INV-002'].map((inv, i) => (
          <tr key={i} className="hover:bg-muted/30">
            <td className="px-6 py-4 font-medium">{inv}</td><td className="px-6 py-4 text-muted-foreground">Oct 24, 2025</td><td className="px-6 py-4 font-bold">\${(i+1)*150}.00</td>
            <td className="px-6 py-4 text-right"><button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"><Download className="w-4 h-4" /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// 3. UserDirectoryTable
export const UserDirectoryTable = () => (
  <div className="w-full grid gap-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-card hover:border-primary transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted" />
          <div><h4 className="font-bold">John Doe {i}</h4><p className="text-sm text-muted-foreground">Software Engineer</p></div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border rounded-md hover:bg-muted"><Edit2 className="w-4 h-4" /></button>
          <button className="p-2 border rounded-md text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    ))}
  </div>
)

// 4. TransactionHistory
export const TransactionHistory = () => (
  <div className="w-full border rounded-xl bg-card">
    <div className="p-4 border-b font-bold text-lg">Recent Transactions</div>
    <div className="divide-y">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${i % 2 === 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}\`}>
              {i % 2 === 0 ? <ArrowUpDown className="w-5 h-5" /> : <ArrowUpDown className="w-5 h-5 rotate-180" />}
            </div>
            <div><p className="font-medium">{i % 2 === 0 ? 'Payment Received' : 'Subscription Auto-renew'}</p><p className="text-xs text-muted-foreground">Today, 10:23 AM</p></div>
          </div>
          <div className={\`font-bold \${i % 2 === 0 ? 'text-green-500' : 'text-foreground'}\`}>{i % 2 === 0 ? '+' : '-'}\${i * 45}.00</div>
        </div>
      ))}
    </div>
  </div>
)

// 5. FileExplorerTable (Mock)
export const FileExplorerTable = () => (
  <div className="w-full border rounded-xl bg-card text-sm">
    <div className="grid grid-cols-12 px-4 py-3 bg-muted/50 border-b font-medium text-muted-foreground"><div className="col-span-6">Name</div><div className="col-span-3">Date Modified</div><div className="col-span-3">Size</div></div>
    <div className="divide-y">
      <div className="grid grid-cols-12 px-4 py-3 items-center hover:bg-muted/30 cursor-pointer">
        <div className="col-span-6 flex items-center gap-2.5 font-medium">
          <Folder className="w-4 h-4 text-sky-500 fill-sky-500/20" />
          <span>Documents</span>
        </div>
        <div className="col-span-3 text-muted-foreground">Oct 12</div>
        <div className="col-span-3 text-muted-foreground">--</div>
      </div>
      <div className="grid grid-cols-12 px-4 py-3 items-center hover:bg-muted/30 cursor-pointer">
        <div className="col-span-6 flex items-center gap-2.5 font-medium">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span>report.pdf</span>
        </div>
        <div className="col-span-3 text-muted-foreground">Oct 10</div>
        <div className="col-span-3 text-muted-foreground">2.4 MB</div>
      </div>
    </div>
  </div>
)

// 6. LeaderboardTable
export const LeaderboardTable = () => (
  <div className="w-full border rounded-2xl bg-linear-to-b from-card to-muted/20 overflow-hidden shadow-lg">
    <div className="p-6 text-center border-b"><h3 className="font-bold text-xl uppercase tracking-widest text-yellow-500">Global Ranking</h3></div>
    <div className="divide-y">
      {[1, 2, 3].map(i => (
        <div key={i} className={\`flex items-center px-6 py-4 \${i === 1 ? 'bg-yellow-500/10' : ''}\`}>
          <div className={\`font-black text-2xl w-8 \${i===1?'text-yellow-500': i===2?'text-gray-400': 'text-amber-700'}\`}>#{i}</div>
          <div className="w-10 h-10 rounded-full bg-muted mx-4" />
          <div className="flex-1 font-bold text-lg">Player {i}</div>
          <div className="font-mono font-bold text-primary">{10000 - i*500} pts</div>
        </div>
      ))}
    </div>
  </div>
)

// 7. ProductInventoryTable
export const ProductInventoryTable = () => (
  <div className="w-full border rounded-xl bg-card overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-muted/50 border-b text-left text-muted-foreground">
        <tr><th className="px-4 py-3 font-medium">Product</th><th className="px-4 py-3 font-medium">SKU</th><th className="px-4 py-3 font-medium">Stock</th><th className="px-4 py-3 font-medium">Price</th></tr>
      </thead>
      <tbody className="divide-y">
        {[1, 2].map(i => (
          <tr key={i}>
            <td className="px-4 py-3 flex items-center gap-3"><div className="w-8 h-8 bg-muted rounded" /><span className="font-medium">Item {i}</span></td>
            <td className="px-4 py-3 text-muted-foreground">SKU-{i}000</td>
            <td className="px-4 py-3"><div className="flex items-center gap-2"><div className={\`w-2 h-2 rounded-full \${i===1?'bg-green-500':'bg-red-500'}\`}/> {i===1?'145 in stock':'Out of stock'}</div></td>
            <td className="px-4 py-3 font-medium">$49.99</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// 8. ScheduleTable
export const ScheduleTable = () => (
  <div className="w-full border rounded-xl bg-card overflow-hidden">
    <div className="grid grid-cols-6 divide-x border-b bg-muted/50 text-center text-xs font-semibold py-2">
      <div>Time</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div>
    </div>
    <div className="grid grid-cols-6 divide-x border-b text-center text-sm h-16">
      <div className="flex items-center justify-center font-medium text-muted-foreground border-r">09:00</div>
      <div className="col-span-2 bg-primary/10 text-primary p-2 m-1 rounded border border-primary/20 text-xs text-left font-medium">Team Meeting</div>
      <div className="col-span-1"></div>
      <div className="col-span-1 bg-indigo-500/10 text-indigo-500 p-2 m-1 rounded border border-indigo-500/20 text-xs text-left font-medium">Design Sync</div>
      <div className="col-span-1"></div>
    </div>
  </div>
)

// 9. PricingComparisonTable
export const PricingComparisonTable = () => (
  <div className="w-full border rounded-xl bg-card overflow-hidden">
    <table className="w-full text-sm text-center">
      <thead className="bg-muted/30 border-b">
        <tr><th className="p-4 text-left">Features</th><th className="p-4 font-bold text-lg">Basic</th><th className="p-4 font-bold text-lg text-primary">Pro</th></tr>
      </thead>
      <tbody className="divide-y">
        {['Unlimited Projects', 'Custom Domain', '24/7 Support'].map((f, i) => (
          <tr key={i} className="hover:bg-muted/10">
            <td className="p-4 text-left font-medium">{f}</td>
            <td className="p-4">{i < 1 ? <CheckCircle2 className="w-5 h-5 mx-auto text-green-500" /> : <XCircle className="w-5 h-5 mx-auto text-muted-foreground/30" />}</td>
            <td className="p-4"><CheckCircle2 className="w-5 h-5 mx-auto text-primary" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// 10. CompactDataList
export const CompactDataList = () => (
  <div className="w-full border rounded-lg bg-card divide-y text-sm">
    {['Server CPU Usage', 'Active Connections', 'Memory Load'].map((l, i) => (
      <div key={i} className="flex justify-between items-center p-3 hover:bg-muted/50 cursor-pointer">
        <span className="text-muted-foreground font-medium">{l}</span>
        <span className="font-bold">{90 - i*15}%</span>
      </div>
    ))}
  </div>
)
`
};

// src/registry/progress.ts
var progress = {
  name: "progress",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "@radix-ui/react-progress"
  ],
  fileName: "progress.tsx",
  content: `"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "../utils/cn"

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /**
   * The current value of the progress bar
   * @default 0
   */
  value?: number;
  /**
   * The maximum value of the progress bar
   * @default 100
   */
  max?: number;
  /**
   * The variant of the progress bar
   * @default "default"
   */
  variant?: "default" | "success" | "warning" | "error";
  /**
   * Whether to show the percentage label
   * @default false
   */
  showLabel?: boolean;
  /**
   * Custom label text shown next to the percentage
   * @default "Progress"
   */
  progressLabel?: string;
  /**
   * The size of the progress bar
   * @default "default"
   */
  size?: "default" | "sm" | "lg";
  /**
   * Whether the progress bar fill animates smoothly
   * @default true
   */
  animated?: boolean;
  /**
   * Whether the progress bar is in an indeterminate loading state
   * @default false
   */
  isIndeterminate?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = "default",
      showLabel = false,
      progressLabel = "Progress",
      size = "default",
      animated = true,
      isIndeterminate = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const variantClasses: Record<"default" | "success" | "warning" | "error", string> = {
      default: "bg-linear-to-r from-primary to-primary/80",
      success: "bg-linear-to-r from-emerald-500 to-teal-500",
      warning: "bg-linear-to-r from-amber-500 to-orange-500",
      error: "bg-linear-to-r from-red-500 to-rose-500",
    };

    const sizeClasses: Record<"default" | "sm" | "lg", string> = {
      default: "h-3.5",
      sm: "h-2",
      lg: "h-5",
    };

    return (
      <div className="w-full space-y-1.5">
        {showLabel && !isIndeterminate && (
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>{progressLabel}</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          value={isIndeterminate ? null : value}
          max={max}
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-muted border border-border/40 shadow-inner",
            sizeClasses[size as "default" | "sm" | "lg"],
            className
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full w-full flex-1 rounded-full",
              variantClasses[variant as "default" | "success" | "warning" | "error"],
              isIndeterminate
                ? "absolute inset-0 -translate-x-full origin-left bg-linear-to-r from-primary/30 via-primary to-primary/30"
                : "transition-transform ease-out",
              animated && !isIndeterminate ? "duration-500" : "duration-0"
            )}
            style={
              isIndeterminate
                // Single animation definition \u2014 not duplicated between className and style
                ? { animation: "shimmer 1.8s infinite" }
                : { transform: \`translateX(-\${100 - percentage}%)\` }
            }
          />
        </ProgressPrimitive.Root>
      </div>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

export interface CircularProgressCardProps {
  value?: number;
  max?: number;
  title?: string;
  label?: string;
  unit?: string;
  className?: string;
}

export const CircularProgressCard = ({
  value = 75,
  max = 100,
  title,
  label,
  unit = "%",
  className,
}: CircularProgressCardProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const displayTitle = title || label || "Progress";

  return (
    <div className={cn("p-6 bg-card border rounded-2xl flex flex-col items-center gap-4 w-full max-w-[200px] shadow-sm", className)}>
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-secondary"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * percentage) / 100}
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-lg font-bold">
          {value}
          <span className="text-xs font-normal text-muted-foreground ml-0.5">{unit}</span>
        </span>
      </div>
      <span className="text-sm font-semibold text-center text-muted-foreground leading-tight">{displayTitle}</span>
    </div>
  );
};
`
};

// src/registry/rating.ts
var rating = {
  name: "rating",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "rating.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Heart, ThumbsUp, Flame, Trophy, Smile, CheckCircle2 } from "lucide-react"
import { cn } from "../utils/cn"

export type RatingVariant = "amber" | "primary" | "emerald" | "rose" | "cyan"
export type RatingIconType = "star" | "heart" | "thumb" | "flame" | "trophy" | "smile"
export type RatingSize = "xs" | "sm" | "md" | "lg" | "xl"

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /**
   * Controlled rating score value
   */
  value?: number
  /**
   * Default initial rating value for uncontrolled usage
   * @default 0
   */
  defaultValue?: number
  /**
   * Maximum rating score count
   * @default 5
   */
  max?: number
  /**
   * Callback fired when rating value changes
   */
  onChange?: (value: number) => void
  /**
   * If true, rating is display-only and non-interactive
   * @default false
   */
  readonly?: boolean
  /**
   * Size of rating icons
   * @default "md"
   */
  size?: RatingSize
  /**
   * Visual icon choice
   * @default "star"
   */
  icon?: RatingIconType
  /**
   * Color theme variant
   * @default "amber"
   */
  variant?: RatingVariant
  /**
   * Allow half-step (0.5) fractional rating precision
   * @default false
   */
  allowHalf?: boolean
  /**
   * Display score number label alongside the rating icons
   * @default false
   */
  showScore?: boolean
  /**
   * Array of tooltip labels corresponding to each step
   * (e.g. ["Poor", "Fair", "Good", "Very Good", "Exceptional"])
   */
  tooltips?: string[]
  /**
   * Additional CSS classes
   */
  className?: string
}

const sizeClasses: Record<RatingSize, string> = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
}

const variantStyles: Record<RatingVariant, { active: string; glow: string }> = {
  amber: {
    active: "fill-amber-400 text-amber-400",
    glow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]",
  },
  primary: {
    active: "fill-primary text-primary",
    glow: "drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.35)]",
  },
  emerald: {
    active: "fill-emerald-400 text-emerald-400",
    glow: "drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]",
  },
  rose: {
    active: "fill-rose-500 text-rose-500",
    glow: "drop-shadow-[0_0_8px_rgba(244,63,94,0.35)]",
  },
  cyan: {
    active: "fill-cyan-400 text-cyan-400",
    glow: "drop-shadow-[0_0_8px_rgba(34,211,238,0.35)]",
  },
}

const getIconComponent = (icon: RatingIconType) => {
  switch (icon) {
    case "heart":
      return Heart
    case "thumb":
      return ThumbsUp
    case "flame":
      return Flame
    case "trophy":
      return Trophy
    case "smile":
      return Smile
    case "star":
    default:
      return Star
  }
}

/**
 * Rating component provides a luxury interactive scoring component supporting stars,
 * hearts, flames, trophies, half-star precision, color themes, and tooltips.
 */
export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      defaultValue = 0,
      max = 5,
      onChange,
      readonly = false,
      size = "md",
      icon = "star",
      variant = "amber",
      allowHalf = false,
      showScore = false,
      tooltips,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<number>(defaultValue)
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)

    const currentValue = isControlled ? value : internalValue
    const activeValue = hoverValue !== null ? hoverValue : currentValue

    React.useEffect(() => {
      if (!isControlled && defaultValue !== undefined) {
        setInternalValue(defaultValue)
      }
    }, [defaultValue, isControlled])

    const handleSelect = (val: number) => {
      if (readonly) return
      if (!isControlled) {
        setInternalValue(val)
      }
      onChange?.(val)
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
      if (readonly) return
      if (!allowHalf) {
        setHoverValue(index + 1)
        return
      }

      const rect = e.currentTarget.getBoundingClientRect()
      const isLeftHalf = e.clientX - rect.left < rect.width / 2
      const computed = isLeftHalf ? index + 0.5 : index + 1
      setHoverValue(computed)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (readonly) return
      const step = allowHalf ? 0.5 : 1

      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault()
        handleSelect(Math.min(max, currentValue + step))
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault()
        handleSelect(Math.max(allowHalf ? 0.5 : 1, currentValue - step))
      }
    }

    const RatingIcon = getIconComponent(icon)
    const styling = variantStyles[variant] || variantStyles.amber

    // Current tooltip label to display
    const currentTooltip =
      tooltips && activeValue > 0
        ? tooltips[Math.min(tooltips.length - 1, Math.ceil(activeValue) - 1)]
        : null

    return (
      <div
        ref={ref}
        role="slider"
        aria-valuenow={currentValue}
        aria-valuemin={allowHalf ? 0.5 : 1}
        aria-valuemax={max}
        tabIndex={readonly ? -1 : 0}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex items-center gap-2 select-none outline-none",
          readonly ? "cursor-default" : "cursor-pointer",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-1.5" onMouseLeave={() => !readonly && setHoverValue(null)}>
          {Array.from({ length: max }).map((_, i) => {
            const indexValue = i + 1
            const isFull = indexValue <= activeValue
            const isHalf = allowHalf && activeValue === i + 0.5

            return (
              <motion.button
                key={i}
                type="button"
                tabIndex={-1}
                disabled={readonly}
                onClick={(e) => {
                  if (allowHalf) {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const isLeftHalf = e.clientX - rect.left < rect.width / 2
                    handleSelect(isLeftHalf ? i + 0.5 : indexValue)
                  } else {
                    handleSelect(indexValue)
                  }
                }}
                onMouseMove={(e) => handleMouseMove(e, i)}
                className={cn(
                  "relative p-0.5 outline-none rounded-md transition-transform focus-visible:ring-2 focus-visible:ring-primary/40",
                  readonly ? "pointer-events-none" : "cursor-pointer"
                )}
                whileHover={readonly ? {} : { scale: 1.15 }}
                whileTap={readonly ? {} : { scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                title={tooltips ? tooltips[i] : \`\${indexValue} / \${max}\`}
              >
                {/* Background Unfilled Icon */}
                <RatingIcon
                  className={cn(
                    sizeClasses[size],
                    "transition-all duration-200 stroke-[1.8] text-muted-foreground/30"
                  )}
                />

                {/* Filled Overlay */}
                {(isFull || isHalf) && (
                  <div
                    className="absolute inset-0 p-0.5 overflow-hidden transition-all duration-150"
                    style={{ width: isHalf ? "50%" : "100%" }}
                  >
                    <RatingIcon
                      className={cn(
                        sizeClasses[size],
                        "transition-all duration-200 stroke-[1.8]",
                        styling.active,
                        styling.glow
                      )}
                    />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Score & Tooltip Label */}
        {(showScore || currentTooltip) && (
          <div className="flex items-center gap-2 text-xs font-semibold">
            {showScore && (
              <span className="font-mono text-foreground px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/50">
                {currentValue.toFixed(allowHalf ? 1 : 0)} / {max}
              </span>
            )}
            {currentTooltip && (
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTooltip}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  className="text-muted-foreground font-medium"
                >
                  {currentTooltip}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    )
  }
)
Rating.displayName = "Rating"

// ============================================
// RatingBreakdown Component
// ============================================

export interface RatingBreakdownProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number
  totalReviews: number
  distribution?: Record<number, number>
  className?: string
}

export function RatingBreakdown({
  rating,
  totalReviews,
  distribution = { 5: 68, 4: 20, 3: 7, 2: 3, 1: 2 },
  className,
  ...props
}: RatingBreakdownProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-5 max-w-sm w-full space-y-4 shadow-lg backdrop-blur-md",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">out of 5</span>
          </div>
          <Rating value={rating} readonly size="sm" variant="amber" allowHalf className="mt-1" />
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-foreground block">{totalReviews.toLocaleString()}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">verified ratings</span>
        </div>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const pct = distribution[stars] || 0
          return (
            <div key={stars} className="flex items-center gap-2.5 text-xs">
              <div className="w-6 flex items-center gap-0.5 font-mono font-medium text-foreground/80 shrink-0">
                <span>{stars}</span>
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: \`\${pct}%\` }}
                  transition={{ duration: 0.8, delay: (5 - stars) * 0.08 }}
                  className="h-full rounded-full bg-amber-400"
                />
              </div>
              <span className="w-8 text-right font-mono text-[11px] text-muted-foreground">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// ReviewCard Component
// ============================================

export interface ReviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  author: string
  avatarUrl?: string
  rating: number
  date: string
  title?: string
  content: string
  verified?: boolean
  className?: string
}

export function ReviewCard({
  author,
  avatarUrl,
  rating,
  date,
  title,
  content,
  verified = true,
  className,
  ...props
}: ReviewCardProps) {
  const initials = author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card/60 p-5 w-full max-w-md space-y-3 backdrop-blur-md shadow-md hover:border-primary/40 transition-colors",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={author} className="w-9 h-9 rounded-full object-cover border border-border" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">{author}</span>
              {verified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">{date}</span>
          </div>
        </div>

        <Rating value={rating} readonly size="sm" variant="amber" allowHalf />
      </div>

      {title && <h4 className="font-semibold text-sm text-foreground">{title}</h4>}
      <p className="text-xs text-muted-foreground leading-relaxed">{content}</p>
    </div>
  )
}
`
};

// src/registry/scroll-area.ts
var scrollArea = {
  name: "scroll-area",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "@radix-ui/react-scroll-area"
  ],
  fileName: "scroll-area.tsx",
  content: `"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "../utils/cn"

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {}

/**
 * ScrollArea component built on top of Radix UI ScrollArea primitives.
 */
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit] [&>div]:!block">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

/**
 * ScrollBar component for ScrollArea.
 */
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors duration-150 rounded-full",
      orientation === "vertical" &&
        "h-full w-2 border-l border-l-transparent p-px hover:bg-black/5 dark:hover:bg-white/5",
      orientation === "horizontal" &&
        "h-2 flex-col border-t border-t-transparent p-px hover:bg-black/5 dark:hover:bg-white/5",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border hover:bg-muted-foreground/60 transition-colors" />
  </ScrollAreaPrimitive.Scrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.Scrollbar.displayName

export { ScrollArea, ScrollBar }
`
};

// src/registry/select.ts
var select = {
  name: "select",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react",
    "@radix-ui/react-select"
  ],
  fileName: "select.tsx",
  content: `"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "../utils/cn"
import { motion } from "framer-motion"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border/50 bg-popover/90 backdrop-blur-md text-popover-foreground shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:scale-95 data-[state=open]:scale-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold text-muted-foreground", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check className="h-4 w-4 stroke-[3] text-primary" />
        </motion.div>
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
}
`
};

// src/registry/skeleton.ts
var skeleton = {
  name: "skeleton",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "skeleton.tsx",
  content: `import * as React from "react"
import { cn } from "../utils/cn"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The width of the skeleton
   */
  width?: string | number;
  /**
   * The height of the skeleton
   */
  height?: string | number;
  /**
   * The variant of the skeleton
   * @default "rect"
   */
  variant?: "line" | "circle" | "rect";
  /**
   * The number of skeletons to render
   * @default 1
   */
  count?: number;
  /**
   * Whether the skeleton is animated
   * @default true
   */
  animated?: boolean;
}

function Skeleton({
  className,
  width,
  height,
  variant = "rect",
  count = 1,
  animated = true,
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    rect: "rounded-md",
    circle: "rounded-full",
    line: "rounded-sm h-4",
  };

  const skeletons = Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className={cn(
        "relative overflow-hidden bg-muted/60 border border-border/30",
        variantClasses[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? \`\${width}px\` : width,
        height: typeof height === 'number' ? \`\${height}px\` : height,
        ...style,
      }}
      {...props}
    >
      {animated && (
        <span
          className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-foreground/5 to-transparent animate-[shimmer_2s_infinite]"
          style={{
            animation: "shimmer 2s infinite",
          }}
        />
      )}
    </div>
  ));

  if (count > 1) {
    return <div className="space-y-2">{skeletons}</div>;
  }

  return skeletons[0];
}

export { Skeleton }
`
};

// src/registry/slider.ts
var slider = {
  name: "slider",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "@radix-ui/react-slider"
  ],
  fileName: "slider.tsx",
  content: `"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../utils/cn"

export interface SliderProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  "value" | "defaultValue" | "onChange"
> {
  /**
   * The minimum value
   * @default 0
   */
  min?: number;
  /**
   * The maximum value
   * @default 100
   */
  max?: number;
  /**
   * The step value
   * @default 1
   */
  step?: number;
  /**
   * The default initial value for uncontrolled usage
   */
  defaultValue?: number;
  /**
   * The current value
   */
  value?: number;
  /**
   * Callback function called when the value changes
   */
  onChange?: (value: number) => void;
  /**
   * Whether to show the current value
   * @default false
   */
  showValue?: boolean;
  /**
   * The variant of the slider
   * @default "default"
   */
  variant?: "default" | "success" | "warning" | "error";
  /**
   * Additional class names
   */
  className?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ min = 0, max = 100, step = 1, value, defaultValue = 0, onChange, showValue = false, variant = "default", className, ...props }, ref) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<number>(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  // Sync internal state if defaultValue changes
  React.useEffect(() => {
    if (!isControlled && defaultValue !== undefined) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const handleValueChange = (val: number[]) => {
    if (!isControlled) {
      setInternalValue(val[0]);
    }
    onChange?.(val[0]);
  };

  const variantClasses: Record<"default" | "success" | "warning" | "error", string> = {
    default: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
  };

  const thumbBorderClasses: Record<"default" | "success" | "warning" | "error", string> = {
    default: "border-primary",
    success: "border-emerald-500",
    warning: "border-amber-500",
    error: "border-red-500",
  };

  const activeVariant = variant as "default" | "success" | "warning" | "error";

  return (
    <div className="w-full space-y-2">
      {showValue && (
        <div className="flex justify-between text-sm font-medium">
          <span>Value</span>
          <span>{currentValue}</span>
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={[currentValue]}
        onValueChange={handleValueChange}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary border border-border/20">
          <SliderPrimitive.Range className={cn("absolute h-full", variantClasses[activeVariant])} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={cn(
          "block h-5 w-5 rounded-full border-2 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm cursor-grab active:cursor-grabbing",
          thumbBorderClasses[activeVariant]
        )} />
      </SliderPrimitive.Root>
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider }

export interface RangeSliderInputProps {
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  onChange?: (value: number[]) => void;
}

export function RangeSliderInput({
  defaultValue = [20, 80],
  min = 0,
  max = 100,
  step = 1,
  className,
  onChange,
}: RangeSliderInputProps) {
  const [value, setValue] = React.useState<number[]>(defaultValue);

  const handleValueChange = (val: number[]) => {
    setValue(val);
    onChange?.(val);
  };

  return (
    <SliderPrimitive.Root
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={handleValueChange}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
}
`
};

// src/registry/sound-pulse.ts
var soundPulse = {
  name: "sound-pulse",
  dependencies: [
    "lucide-react",
    "clsx",
    "tailwind-merge"
  ],
  fileName: "sound-pulse.tsx",
  content: '"use client";\n\nimport * as React from "react";\nimport { useState, useRef, useEffect, useCallback, useId } from "react";\nimport { Play, Pause, Volume2, VolumeX } from "lucide-react";\nimport { cn } from "../utils/cn";\n\nexport interface SoundPulseProps extends React.HTMLAttributes<HTMLDivElement> {\n  /**\n   * Transparent PNG image URL of the product.\n   */\n  src: string;\n  /**\n   * Gradient start color for audio bars and ambient glow.\n   * @default "#71717a"\n   */\n  accentFrom?: string;\n  /**\n   * Gradient end color for audio bars and ambient glow.\n   * @default "#fafafa"\n   */\n  accentTo?: string;\n  /**\n   * Tempo in beats per minute for the algorithmic Web Audio synthesizer.\n   * @default 100\n   */\n  bpm?: number;\n  /**\n   * Image accessibility alt text description.\n   * @default "SoundPulse Audio-Reactive Product"\n   */\n  alt?: string;\n  /**\n   * Width or maximum width of the stage in pixels or CSS dimension.\n   * @default 460\n   */\n  stageSize?: number | string;\n}\n\nconst TOTAL_BARS = 56;\n\n/**\n * SoundPulse\n *\n * Audio-reactive physical product presentation component with an integrated\n * procedural Web Audio API synthesizer step-sequencer. Features 56 radial frequency\n * analyzer bars, dynamic bass-reactive atmospheric radial glow, and micro-harmonic\n * product scale pulsing.\n */\nexport const SoundPulse = React.forwardRef<HTMLDivElement, SoundPulseProps>(\n  (\n    {\n      src,\n      accentFrom = "#71717a",\n      accentTo = "#fafafa",\n      bpm = 100,\n      alt = "SoundPulse Audio-Reactive Product",\n      stageSize = 460,\n      className,\n      style,\n      ...props\n    },\n    ref\n  ) => {\n    const containerRef = useRef<HTMLDivElement>(null);\n    const audioCtxRef = useRef<AudioContext | null>(null);\n    const masterGainRef = useRef<GainNode | null>(null);\n    const analyserRef = useRef<AnalyserNode | null>(null);\n    const sequencerTimerRef = useRef<number | null>(null);\n    const rafIdRef = useRef<number | null>(null);\n    const stepRef = useRef<number>(0);\n    const bassSmoothedRef = useRef<number>(0);\n\n    const [isPlaying, setIsPlaying] = useState(false);\n    const [isMuted, setIsMuted] = useState(false);\n    const [containerPx, setContainerPx] = useState(460);\n    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);\n\n    // Dynamic reactive visual state\n    const [barHeights, setBarHeights] = useState<number[]>(() =>\n      Array.from({ length: TOTAL_BARS }, () => 8)\n    );\n    const [barOpacities, setBarOpacities] = useState<number[]>(() =>\n      Array.from({ length: TOTAL_BARS }, () => 0.4)\n    );\n    const [bassLevel, setBassLevel] = useState<number>(0);\n\n    // Track prefers-reduced-motion\n    useEffect(() => {\n      if (typeof window === "undefined") return;\n      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");\n      setPrefersReducedMotion(mediaQuery.matches);\n      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);\n      mediaQuery.addEventListener("change", listener);\n      return () => mediaQuery.removeEventListener("change", listener);\n    }, []);\n\n    // Track container dimensions for DPR and radius calculation\n    useEffect(() => {\n      const container = containerRef.current;\n      if (!container) return;\n\n      const updateDimensions = () => {\n        const rect = container.getBoundingClientRect();\n        if (rect.width > 0) {\n          setContainerPx(rect.width);\n        }\n      };\n\n      updateDimensions();\n      const ro = new ResizeObserver(updateDimensions);\n      ro.observe(container);\n      return () => ro.disconnect();\n    }, []);\n\n    // Synthesize procedural white noise buffer for hi-hats\n    const createNoiseBuffer = useCallback((ctx: AudioContext, durationSec: number): AudioBuffer => {\n      const bufferSize = Math.floor(ctx.sampleRate * durationSec);\n      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);\n      const output = buffer.getChannelData(0);\n      for (let i = 0; i < bufferSize; i++) {\n        output[i] = Math.random() * 2 - 1;\n      }\n      return buffer;\n    }, []);\n\n    // Step sequencer note execution\n    const playSequencerStep = useCallback(\n      (ctx: AudioContext, master: GainNode, step: number) => {\n        const now = ctx.currentTime;\n\n        // Kick on steps 0 and 4: sine oscillator dropping 120 -> 40 Hz in 0.14s, gain 0.9 -> 0.001 in 0.16s\n        if (step === 0 || step === 4) {\n          try {\n            const kickOsc = ctx.createOscillator();\n            const kickGain = ctx.createGain();\n            kickOsc.type = "sine";\n            kickOsc.frequency.setValueAtTime(120, now);\n            kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.14);\n\n            kickGain.gain.setValueAtTime(0.9, now);\n            kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);\n\n            kickOsc.connect(kickGain);\n            kickGain.connect(master);\n            kickOsc.start(now);\n            kickOsc.stop(now + 0.16);\n          } catch (e) {\n            // AudioContext glitch fallback\n          }\n        }\n\n        // Hi-hat on odd steps (1, 3, 5, 7): 50ms white noise through highpass 7000 Hz, fast decay\n        if (step % 2 === 1) {\n          try {\n            const noise = ctx.createBufferSource();\n            noise.buffer = createNoiseBuffer(ctx, 0.05);\n\n            const filter = ctx.createBiquadFilter();\n            filter.type = "highpass";\n            filter.frequency.setValueAtTime(7000, now);\n\n            const hatGain = ctx.createGain();\n            hatGain.gain.setValueAtTime(0.28, now);\n            hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);\n\n            noise.connect(filter);\n            filter.connect(hatGain);\n            hatGain.connect(master);\n            noise.start(now);\n            noise.stop(now + 0.05);\n          } catch (e) {\n            // AudioContext glitch fallback\n          }\n        }\n\n        // Bass on steps 0, 3, 6: sawtooth through lowpass 900 Hz (55, 73.4, 65.4 Hz), decay 0.3s\n        if (step === 0 || step === 3 || step === 6) {\n          try {\n            const bassOsc = ctx.createOscillator();\n            const bassFilter = ctx.createBiquadFilter();\n            const bassGain = ctx.createGain();\n\n            bassOsc.type = "sawtooth";\n            const freq = step === 0 ? 55 : step === 3 ? 73.4 : 65.4;\n            bassOsc.frequency.setValueAtTime(freq, now);\n\n            bassFilter.type = "lowpass";\n            bassFilter.frequency.setValueAtTime(900, now);\n\n            bassGain.gain.setValueAtTime(0.42, now);\n            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);\n\n            bassOsc.connect(bassFilter);\n            bassFilter.connect(bassGain);\n            bassGain.connect(master);\n\n            bassOsc.start(now);\n            bassOsc.stop(now + 0.3);\n          } catch (e) {\n            // AudioContext glitch fallback\n          }\n        }\n      },\n      [createNoiseBuffer]\n    );\n\n    // AudioContext initialization and resume on user click\n    const togglePlay = useCallback(async () => {\n      if (typeof window === "undefined") return;\n\n      if (!isPlaying) {\n        let ctx = audioCtxRef.current;\n        if (!ctx || ctx.state === "closed") {\n          const AudioContextClass =\n            window.AudioContext ||\n            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;\n          ctx = new AudioContextClass();\n          audioCtxRef.current = ctx;\n\n          const master = ctx.createGain();\n          master.gain.setValueAtTime(isMuted ? 0 : 0.85, ctx.currentTime);\n          masterGainRef.current = master;\n\n          const analyser = ctx.createAnalyser();\n          analyser.fftSize = 128;\n          analyser.smoothingTimeConstant = 0.8;\n          analyserRef.current = analyser;\n\n          master.connect(analyser);\n          analyser.connect(ctx.destination);\n        }\n\n        if (ctx.state === "suspended") {\n          await ctx.resume();\n        }\n\n        // Start step sequencer: 8 steps (eighth notes), interval 60000 / bpm / 2 ms\n        const intervalMs = Math.max(50, 60000 / bpm / 2);\n        if (sequencerTimerRef.current) {\n          window.clearInterval(sequencerTimerRef.current);\n        }\n\n        sequencerTimerRef.current = window.setInterval(() => {\n          if (!audioCtxRef.current || !masterGainRef.current) return;\n          playSequencerStep(audioCtxRef.current, masterGainRef.current, stepRef.current);\n          stepRef.current = (stepRef.current + 1) % 8;\n        }, intervalMs);\n\n        setIsPlaying(true);\n      } else {\n        // Pause sequencer\n        if (sequencerTimerRef.current) {\n          window.clearInterval(sequencerTimerRef.current);\n          sequencerTimerRef.current = null;\n        }\n        if (audioCtxRef.current && audioCtxRef.current.state === "running") {\n          await audioCtxRef.current.suspend();\n        }\n        setIsPlaying(false);\n      }\n    }, [isPlaying, isMuted, bpm, playSequencerStep]);\n\n    // Handle mute toggle\n    const toggleMute = useCallback(() => {\n      const nextMuted = !isMuted;\n      setIsMuted(nextMuted);\n      if (masterGainRef.current && audioCtxRef.current) {\n        masterGainRef.current.gain.setValueAtTime(\n          nextMuted ? 0 : 0.85,\n          audioCtxRef.current.currentTime\n        );\n      }\n    }, [isMuted]);\n\n    // Continuous requestAnimationFrame visual rendering loop\n    useEffect(() => {\n      let active = true;\n      const dataArray = new Uint8Array(64);\n\n      const render = (time: number) => {\n        if (!active) return;\n\n        if (prefersReducedMotion) {\n          setBarHeights(Array.from({ length: TOTAL_BARS }, () => 8));\n          setBarOpacities(Array.from({ length: TOTAL_BARS }, () => 0.4));\n          setBassLevel(0);\n          rafIdRef.current = requestAnimationFrame(render);\n          return;\n        }\n\n        const analyser = analyserRef.current;\n        const heights: number[] = new Array(TOTAL_BARS);\n        const opacities: number[] = new Array(TOTAL_BARS);\n\n        if (isPlaying && analyser) {\n          analyser.getByteFrequencyData(dataArray);\n\n          // Lower ~75% of spectrum = first 48 bins\n          const maxBins = Math.floor(analyser.frequencyBinCount * 0.75);\n\n          // Calculate bass = average of first 8 bins\n          let bassSum = 0;\n          for (let b = 0; b < 8; b++) {\n            bassSum += dataArray[b] || 0;\n          }\n          const rawBass = bassSum / (8 * 255);\n          bassSmoothedRef.current += (rawBass - bassSmoothedRef.current) * 0.25;\n\n          for (let i = 0; i < TOTAL_BARS; i++) {\n            // Symmetrical distribution or linear mapping across lower 75%\n            const binIdx = Math.min(\n              maxBins - 1,\n              Math.floor((i / TOTAL_BARS) * maxBins)\n            );\n            const v = (dataArray[binIdx] || 0) / 255;\n            heights[i] = 6 + v * 46;\n            opacities[i] = 0.35 + v * 0.65;\n          }\n\n          setBassLevel(bassSmoothedRef.current);\n          setBarHeights(heights);\n          setBarOpacities(opacities);\n        } else {\n          // Idle state before play: sinusoidal wave movement so it doesn\'t look dead\n          bassSmoothedRef.current += (0 - bassSmoothedRef.current) * 0.1;\n          for (let i = 0; i < TOTAL_BARS; i++) {\n            const wave = Math.sin(time * 0.0028 + (i / TOTAL_BARS) * Math.PI * 4);\n            const idleV = (wave + 1) * 0.5;\n            heights[i] = 6 + idleV * 16;\n            opacities[i] = 0.3 + idleV * 0.35;\n          }\n\n          setBassLevel(bassSmoothedRef.current);\n          setBarHeights(heights);\n          setBarOpacities(opacities);\n        }\n\n        rafIdRef.current = requestAnimationFrame(render);\n      };\n\n      rafIdRef.current = requestAnimationFrame(render);\n\n      return () => {\n        active = false;\n        if (rafIdRef.current) {\n          cancelAnimationFrame(rafIdRef.current);\n        }\n      };\n    }, [isPlaying, prefersReducedMotion]);\n\n    // Cleanup AudioContext and timers on unmount\n    useEffect(() => {\n      return () => {\n        if (sequencerTimerRef.current) {\n          clearInterval(sequencerTimerRef.current);\n          sequencerTimerRef.current = null;\n        }\n        if (audioCtxRef.current) {\n          audioCtxRef.current.close().catch(() => {});\n          audioCtxRef.current = null;\n        }\n      };\n    }, []);\n\n    // Radius calculation for radial placement: 46% of container dimension\n    const radius = containerPx * 0.46;\n    const productScale = prefersReducedMotion ? 1 : 1 + bassLevel * 0.07;\n    const glowScale = prefersReducedMotion ? 1 : 1 + bassLevel * 0.42;\n    const glowOpacity = prefersReducedMotion ? 0.3 : 0.25 + bassLevel * 0.75;\n\n    return (\n      <div\n        ref={ref}\n        className={cn("relative flex flex-col items-center select-none", className)}\n        style={{ maxWidth: stageSize, width: "100%", ...style }}\n        {...props}\n      >\n        {/* Main 1:1 Stage Scene */}\n        <div\n          ref={containerRef}\n          className="relative w-full aspect-square rounded-3xl bg-zinc-950/80 border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-md"\n          style={\n            {\n              "--accent-from": accentFrom,\n              "--accent-to": accentTo,\n            } as React.CSSProperties\n          }\n        >\n          {/* Ambient Background Grid Pattern */}\n          <div\n            className="absolute inset-0 opacity-15 pointer-events-none"\n            style={{\n              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,\n              backgroundSize: "24px 24px",\n            }}\n          />\n\n          {/* Layer 1: Ambient Glow behind product (radial-gradient, blur ~20px) */}\n          <div\n            className="absolute pointer-events-none rounded-full blur-[24px] transition-transform duration-75 ease-out"\n            style={{\n              width: "56%",\n              height: "56%",\n              background: `radial-gradient(circle, ${accentFrom}44 0%, ${accentTo}22 45%, transparent 72%)`,\n              transform: `scale(${glowScale})`,\n              opacity: glowOpacity,\n            }}\n          />\n\n          {/* Layer 2: 56 Radial Bars around product */}\n          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">\n            {Array.from({ length: TOTAL_BARS }).map((_, i) => {\n              const angle = (360 / TOTAL_BARS) * i;\n              const h = barHeights[i] || 6;\n              const op = barOpacities[i] || 0.35;\n\n              return (\n                <div\n                  key={i}\n                  className="absolute"\n                  style={{\n                    left: "50%",\n                    top: "50%",\n                    width: "3.5px",\n                    height: `${h}px`,\n                    transformOrigin: "50% 100%",\n                    transform: `translate(-50%, -100%) rotate(${angle}deg) translateY(-${radius}px)`,\n                    opacity: op,\n                    background: `linear-gradient(to top, ${accentFrom}, ${accentTo})`,\n                    borderRadius: "9999px",\n                    boxShadow: `0 0 6px rgba(255, 255, 255, 0.25)`,\n                    willChange: "height, opacity",\n                  }}\n                />\n              );\n            })}\n          </div>\n\n          {/* Layer 3: Central Product Silhouette (~52% width, bass scale pulse) */}\n          <div\n            className="relative z-10 w-[52%] h-[52%] flex items-center justify-center transition-transform duration-75 ease-out pointer-events-none"\n            style={{\n              transform: `scale(${productScale})`,\n              filter: `drop-shadow(0 14px 28px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.1))`,\n            }}\n          >\n            {/* eslint-disable-next-line @next/next/no-img-element */}\n            <img\n              src={src}\n              alt={alt}\n              className="w-full h-full object-contain select-none drag-none"\n              draggable={false}\n            />\n          </div>\n\n          {/* Quick Sound Mute Toggle */}\n          {isPlaying && (\n            <button\n              type="button"\n              onClick={toggleMute}\n              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/50 border border-white/10 text-zinc-400 hover:text-white hover:bg-black/70 backdrop-blur-md transition-colors cursor-pointer"\n              title={isMuted ? "Unmute sound" : "Mute sound"}\n              aria-label={isMuted ? "Unmute sound" : "Mute sound"}\n            >\n              {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-zinc-300" />}\n            </button>\n          )}\n\n          {/* Play/Pause Control at Bottom */}\n          <div className="absolute bottom-4 z-20 flex items-center justify-center">\n            <button\n              type="button"\n              onClick={togglePlay}\n              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-white bg-zinc-900/85 hover:bg-zinc-800 border border-white/12 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer active:scale-95"\n              aria-label={isPlaying ? "Pause SoundPulse" : "Start SoundPulse"}\n            >\n              {isPlaying ? (\n                <>\n                  <Pause className="w-3.5 h-3.5 fill-current text-zinc-300" />\n                  <span>Pause</span>\n                </>\n              ) : (\n                <>\n                  <Play className="w-3.5 h-3.5 fill-current text-zinc-300" />\n                  <span>Play</span>\n                </>\n              )}\n            </button>\n          </div>\n        </div>\n      </div>\n    );\n  }\n);\n\nSoundPulse.displayName = "SoundPulse";\n'
};

// src/registry/silk-unveil.ts
var silkUnveil = {
  name: "silk-unveil",
  dependencies: [
    "lucide-react",
    "clsx",
    "tailwind-merge"
  ],
  fileName: "silk-unveil.tsx",
  content: '"use client";\n\nimport * as React from "react";\nimport { useState, useRef, useEffect, useCallback } from "react";\nimport { Sparkles, Eye, RotateCcw } from "lucide-react";\nimport { cn } from "../utils/cn";\n\nexport interface SilkUnveilProps extends React.HTMLAttributes<HTMLDivElement> {\n  /**\n   * Transparent PNG image URL of the product.\n   */\n  src: string;\n  /**\n   * Aspect ratio of the stage scene.\n   * Use "3/4" for tall products (perfume, shoes, bottles) or "4/3" for wide products (cars, keyboards).\n   * @default "3/4"\n   */\n  aspectRatio?: string;\n  /**\n   * Product width as percentage of the stage scene.\n   * @default "52%"\n   */\n  productWidth?: string;\n  /**\n   * Dark shadow tone of the silk cloth as RGB [r, g, b].\n   * @default [24, 24, 27]\n   */\n  clothDark?: [number, number, number];\n  /**\n   * Luminous highlight tone of the silk cloth as RGB [r, g, b].\n   * @default [228, 228, 231]\n   */\n  clothLight?: [number, number, number];\n  /**\n   * Accessibility image alt text description.\n   * @default "Unveiled Product"\n   */\n  alt?: string;\n  /**\n   * Whether the cloth starts pulled away upon initial mount.\n   * @default false\n   */\n  defaultUnveiled?: boolean;\n}\n\ninterface Point {\n  x: number;\n  y: number;\n  prevX: number;\n  prevY: number;\n  pinned: boolean;\n  row: number;\n  col: number;\n}\n\ninterface Constraint {\n  p1: Point;\n  p2: Point;\n  restLength: number;\n}\n\nfunction easeInOutCubic(t: number): number {\n  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;\n}\n\nconst COLS = 12;\nconst ROWS = 15;\nconst ANIM_DURATION_MS = 1100;\n\n/**\n * SilkUnveil\n *\n * Interactive cloth physics unveil component based on Verlet integration.\n * A procedural draped silk fabric with dynamic fold-shading, gravitational settling,\n * and wind ripples covers the product, pulled away on command with a physics-driven cinematic unveil.\n */\nexport const SilkUnveil = React.forwardRef<HTMLDivElement, SilkUnveilProps>(\n  (\n    {\n      src,\n      aspectRatio = "3/4",\n      productWidth = "52%",\n      clothDark = [24, 24, 27],\n      clothLight = [228, 228, 231],\n      alt = "Unveiled Product",\n      defaultUnveiled = false,\n      className,\n      style,\n      ...props\n    },\n    ref\n  ) => {\n    const containerRef = useRef<HTMLDivElement>(null);\n    const canvasRef = useRef<HTMLCanvasElement>(null);\n    const rafIdRef = useRef<number | null>(null);\n\n    // Physics state\n    const pointsRef = useRef<Point[][]>([]);\n    const constraintsRef = useRef<Constraint[]>([]);\n    const spacingXRef = useRef<number>(0);\n    const spacingYRef = useRef<number>(0);\n    const stageDimRef = useRef<{ w: number; h: number }>({ w: 400, h: 500 });\n\n    // Unveil animation state (dragT: 0 = covered, 1 = away)\n    const dragTRef = useRef<number>(defaultUnveiled ? 1 : 0);\n    const animStateRef = useRef<{\n      active: boolean;\n      startTime: number;\n      startT: number;\n      targetT: number;\n    }>({\n      active: false,\n      startTime: 0,\n      startT: defaultUnveiled ? 1 : 0,\n      targetT: defaultUnveiled ? 1 : 0,\n    });\n\n    const [isUnveiled, setIsUnveiled] = useState<boolean>(defaultUnveiled);\n    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);\n\n    // Reduced motion media query\n    useEffect(() => {\n      if (typeof window === "undefined") return;\n      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");\n      setPrefersReducedMotion(mediaQuery.matches);\n      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);\n      mediaQuery.addEventListener("change", listener);\n      return () => mediaQuery.removeEventListener("change", listener);\n    }, []);\n\n    // Build Verlet cloth grid and structural constraints\n    const initClothGrid = useCallback((width: number, height: number, initialDragT: number) => {\n      stageDimRef.current = { w: width, h: height };\n      const spacingX = (width + 40) / (COLS - 1);\n      const spacingY = (height * 1.25 + 40) / (ROWS - 1);\n      spacingXRef.current = spacingX;\n      spacingYRef.current = spacingY;\n\n      const pts: Point[][] = [];\n      const easeT = easeInOutCubic(initialDragT);\n\n      for (let r = 0; r < ROWS; r++) {\n        const rowPts: Point[] = [];\n        for (let c = 0; c < COLS; c++) {\n          const isTop = r === 0;\n          let initX = -20 + c * spacingX;\n          let initY = -30 + r * spacingY;\n\n          if (isTop) {\n            const coveredX = -20 + c * spacingX;\n            const coveredY = -30;\n            const awayX = width * 0.9 + c * 5;\n            const awayY = -height * 0.9 - c * 6;\n            initX = coveredX + (awayX - coveredX) * easeT;\n            initY = coveredY + (awayY - coveredY) * easeT;\n          }\n\n          rowPts.push({\n            x: initX,\n            y: initY,\n            prevX: initX,\n            prevY: initY,\n            pinned: isTop,\n            row: r,\n            col: c,\n          });\n        }\n        pts.push(rowPts);\n      }\n\n      // Constraints: horizontal, vertical, and both diagonals per cell\n      const links: Constraint[] = [];\n\n      for (let r = 0; r < ROWS; r++) {\n        for (let c = 0; c < COLS; c++) {\n          const p = pts[r][c];\n\n          // Horizontal link\n          if (c < COLS - 1) {\n            const pRight = pts[r][c + 1];\n            links.push({\n              p1: p,\n              p2: pRight,\n              restLength: spacingX,\n            });\n          }\n\n          // Vertical link\n          if (r < ROWS - 1) {\n            const pDown = pts[r + 1][c];\n            links.push({\n              p1: p,\n              p2: pDown,\n              restLength: spacingY,\n            });\n          }\n\n          // Diagonal links (shear resistance)\n          if (r < ROWS - 1 && c < COLS - 1) {\n            const pDiag1 = pts[r + 1][c + 1];\n            links.push({\n              p1: p,\n              p2: pDiag1,\n              restLength: Math.hypot(spacingX, spacingY),\n            });\n\n            const pRight = pts[r][c + 1];\n            const pDown = pts[r + 1][c];\n            links.push({\n              p1: pRight,\n              p2: pDown,\n              restLength: Math.hypot(spacingX, spacingY),\n            });\n          }\n        }\n      }\n\n      pointsRef.current = pts;\n      constraintsRef.current = links;\n    }, []);\n\n    // Toggle unveil / cover animation\n    const toggleUnveil = useCallback(() => {\n      const nextTarget = isUnveiled ? 0 : 1;\n      setIsUnveiled(!isUnveiled);\n\n      animStateRef.current = {\n        active: true,\n        startTime: performance.now(),\n        startT: dragTRef.current,\n        targetT: nextTarget,\n      };\n    }, [isUnveiled]);\n\n    // Handle container resize & canvas scaling\n    useEffect(() => {\n      const container = containerRef.current;\n      const canvas = canvasRef.current;\n      if (!container || !canvas) return;\n\n      const handleResize = () => {\n        const rect = container.getBoundingClientRect();\n        if (rect.width <= 0 || rect.height <= 0) return;\n\n        const dpr = Math.min(window.devicePixelRatio || 1, 2);\n        canvas.width = Math.floor(rect.width * dpr);\n        canvas.height = Math.floor(rect.height * dpr);\n\n        const ctx = canvas.getContext("2d");\n        if (ctx) {\n          ctx.resetTransform?.();\n          ctx.scale(dpr, dpr);\n        }\n\n        initClothGrid(rect.width, rect.height, dragTRef.current);\n      };\n\n      handleResize();\n      const ro = new ResizeObserver(handleResize);\n      ro.observe(container);\n\n      return () => ro.disconnect();\n    }, [initClothGrid]);\n\n    // Physics and render simulation loop\n    useEffect(() => {\n      let active = true;\n\n      const loop = (time: number) => {\n        if (!active) return;\n\n        const canvas = canvasRef.current;\n        const ctx = canvas?.getContext("2d");\n        const pts = pointsRef.current;\n        const links = constraintsRef.current;\n        const { w: width, h: height } = stageDimRef.current;\n\n        if (canvas && ctx && pts.length > 0 && links.length > 0) {\n          // 1. Advance unveil transition\n          const anim = animStateRef.current;\n          if (anim.active) {\n            const elapsed = (time - anim.startTime) / ANIM_DURATION_MS;\n            if (elapsed >= 1) {\n              dragTRef.current = anim.targetT;\n              anim.active = false;\n            } else {\n              dragTRef.current = anim.startT + (anim.targetT - anim.startT) * elapsed;\n            }\n          }\n\n          const currentDragT = dragTRef.current;\n          const easeT = easeInOutCubic(currentDragT);\n          const spacingX = spacingXRef.current;\n\n          // 2. Position pinned top anchors according to dragT\n          for (let c = 0; c < COLS; c++) {\n            const anchor = pts[0][c];\n            const coveredX = -20 + c * spacingX;\n            const coveredY = -30;\n            const awayX = width * 0.9 + c * 5;\n            const awayY = -height * 0.9 - c * 6;\n\n            const targetX = coveredX + (awayX - coveredX) * easeT;\n            const targetY = coveredY + (awayY - coveredY) * easeT;\n\n            anchor.x = targetX;\n            anchor.y = targetY;\n            anchor.prevX = targetX;\n            anchor.prevY = targetY;\n          }\n\n          // 3. Integrate unpinned points (Verlet + Gravity + Breathing Wind)\n          const gravity = prefersReducedMotion ? 0.35 : 0.42;\n          for (let r = 1; r < ROWS; r++) {\n            const rowRatio = r / ROWS;\n            for (let c = 0; c < COLS; c++) {\n              const p = pts[r][c];\n              const vx = (p.x - p.prevX) * 0.985;\n              const vy = (p.y - p.prevY) * 0.985;\n\n              p.prevX = p.x;\n              p.prevY = p.y;\n\n              const wind = prefersReducedMotion\n                ? 0\n                : Math.sin(time * 0.0016 + p.y * 0.02) * 0.1 * rowRatio;\n\n              p.x += vx + wind;\n              p.y += vy + gravity;\n            }\n          }\n\n          // 4. Relax constraints (5 iterations per frame)\n          for (let iter = 0; iter < 5; iter++) {\n            for (let i = 0; i < links.length; i++) {\n              const link = links[i];\n              const p1 = link.p1;\n              const p2 = link.p2;\n\n              const dx = p2.x - p1.x;\n              const dy = p2.y - p1.y;\n              const dist = Math.hypot(dx, dy) || 0.0001;\n              const diff = (dist - link.restLength) / dist;\n\n              if (p1.pinned && !p2.pinned) {\n                p2.x -= dx * diff;\n                p2.y -= dy * diff;\n              } else if (!p1.pinned && p2.pinned) {\n                p1.x += dx * diff;\n                p1.y += dy * diff;\n              } else if (!p1.pinned && !p2.pinned) {\n                p1.x += dx * 0.5 * diff;\n                p1.y += dy * 0.5 * diff;\n                p2.x -= dx * 0.5 * diff;\n                p2.y -= dy * 0.5 * diff;\n              }\n            }\n          }\n\n          // 5. Render cloth quads\n          ctx.clearRect(0, 0, width, height);\n\n          for (let r = 0; r < ROWS - 1; r++) {\n            const rowRatio = r / ROWS;\n            for (let c = 0; c < COLS - 1; c++) {\n              const P00 = pts[r][c];\n              const P10 = pts[r][c + 1];\n              const P11 = pts[r + 1][c + 1];\n              const P01 = pts[r + 1][c];\n\n              // Color formula based on horizontal tension compression\n              const topLen = Math.hypot(P10.x - P00.x, P10.y - P00.y);\n              const btmLen = Math.hypot(P11.x - P01.x, P11.y - P01.y);\n              const avgHoriz = (topLen + btmLen) * 0.5;\n              const compression = spacingX - avgHoriz;\n\n              let t = 0.5 + compression * 0.05 - rowRatio * 0.12;\n              t = Math.max(0, Math.min(1, t));\n\n              const rc = Math.round(clothDark[0] + (clothLight[0] - clothDark[0]) * t);\n              const gc = Math.round(clothDark[1] + (clothLight[1] - clothDark[1]) * t);\n              const bc = Math.round(clothDark[2] + (clothLight[2] - clothDark[2]) * t);\n\n              ctx.beginPath();\n              ctx.moveTo(P00.x, P00.y);\n              ctx.lineTo(P10.x, P10.y);\n              ctx.lineTo(P11.x, P11.y);\n              ctx.lineTo(P01.x, P01.y);\n              ctx.closePath();\n\n              ctx.fillStyle = `rgb(${rc}, ${gc}, ${bc})`;\n              ctx.fill();\n\n              // Subtle seam smoothing\n              ctx.strokeStyle = `rgba(${rc}, ${gc}, ${bc}, 0.35)`;\n              ctx.lineWidth = 0.6;\n              ctx.stroke();\n            }\n          }\n        }\n\n        rafIdRef.current = requestAnimationFrame(loop);\n      };\n\n      rafIdRef.current = requestAnimationFrame(loop);\n\n      return () => {\n        active = false;\n        if (rafIdRef.current) {\n          cancelAnimationFrame(rafIdRef.current);\n        }\n      };\n    }, [clothDark, clothLight, prefersReducedMotion]);\n\n    return (\n      <div\n        ref={ref}\n        className={cn("relative flex flex-col items-center select-none", className)}\n        style={{ ...style }}\n        {...props}\n      >\n        {/* Stage Container */}\n        <div\n          ref={containerRef}\n          className="relative w-full rounded-3xl bg-zinc-950/90 border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-md"\n          style={{ aspectRatio }}\n        >\n          {/* Subtle Ambient Background Grid */}\n          <div\n            className="absolute inset-0 opacity-10 pointer-events-none"\n            style={{\n              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,\n              backgroundSize: "28px 28px",\n            }}\n          />\n\n          {/* Layer 1 (Bottom): Shadow Ellipse under the product */}\n          <div\n            className="absolute pointer-events-none rounded-[100%] opacity-80"\n            style={{\n              bottom: "16%",\n              width: "60%",\n              height: "18%",\n              background:\n                "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 45%, transparent 72%)",\n              filter: "blur(8px)",\n            }}\n          />\n\n          {/* Layer 2 (Middle): Product image centered */}\n          <div\n            className="relative z-10 flex items-center justify-center pointer-events-none transition-transform duration-300"\n            style={{\n              width: productWidth,\n              filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.7))",\n            }}\n          >\n            {/* eslint-disable-next-line @next/next/no-img-element */}\n            <img\n              src={src}\n              alt={alt}\n              className="w-full h-auto object-contain select-none drag-none"\n              draggable={false}\n            />\n          </div>\n\n          {/* Layer 3 (Top): Verlet Fabric Canvas */}\n          <canvas\n            ref={canvasRef}\n            className="absolute inset-0 w-full h-full pointer-events-none z-20"\n          />\n\n          {/* Unveil Action Trigger Button */}\n          <div className="absolute bottom-4 z-30 flex items-center justify-center">\n            <button\n              type="button"\n              onClick={toggleUnveil}\n              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-white bg-zinc-900/85 hover:bg-zinc-800 border border-white/12 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer active:scale-95"\n              aria-label={isUnveiled ? "Cover product with silk" : "Unveil product"}\n            >\n              {isUnveiled ? (\n                <>\n                  <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />\n                  <span>Drape</span>\n                </>\n              ) : (\n                <>\n                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />\n                  <span>Unveil</span>\n                </>\n              )}\n            </button>\n          </div>\n        </div>\n      </div>\n    );\n  }\n);\n\nSilkUnveil.displayName = "SilkUnveil";\n'
};

// src/registry/special-animations.ts
var specialAnimations = {
  name: "special-animations",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "special-animations.tsx",
  content: `"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

interface BaseAnimationProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F children
   * @default undefined
   */
  children: React.ReactNode;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F delay
   * @default undefined
   */
  delay?: number;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F duration
   * @default undefined
   */
  duration?: number;
}

// 1. FadeIn
export const FadeIn = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 2. SlideUp
export const SlideUp = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 3. SlideDown
export const SlideDown = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 4. SlideLeft
export const SlideLeft = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 5. SlideRight
export const SlideRight = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 6. ScaleIn
export const ScaleIn = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration }}>
    {children}
  </motion.div>
)

// 7. Bounce
export const Bounce = ({ children, delay = 0 }: Omit<BaseAnimationProps, 'duration'>) => (
  <motion.div
    initial={{ y: -20 }}
    animate={{ y: 0 }}
    transition={{ type: "spring", bounce: 0.5, delay }}
  >
    {children}
  </motion.div>
)

// 8. Flip
export const Flip = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div
    initial={{ rotateX: 90, opacity: 0 }}
    animate={{ rotateX: 0, opacity: 1 }}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
)

// 9. Rotate
export const Rotate = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => (
  <motion.div
    initial={{ rotate: -180, opacity: 0 }}
    animate={{ rotate: 0, opacity: 1 }}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
)

// 10. Pulse (Continuous)
export const PulseAnim = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ repeat: Infinity, duration: 2 }}
  >
    {children}
  </motion.div>
)

// 11. Float (Continuous)
export const Float = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
)

// 12. Wiggle (Hover)
export const WiggleHover = ({ children }: { children: React.ReactNode }) => (
  <motion.div whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
    {children}
  </motion.div>
)

// 13. Heartbeat
export const Heartbeat = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    animate={{ scale: [1, 1.1, 1, 1.1, 1] }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
)

// 14. Reveal (Clip-path)
export const RevealClip = ({ children, delay = 0, duration = 0.8 }: BaseAnimationProps) => (
  <motion.div
    initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
    animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    transition={{ delay, duration, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
)

// 15. StaggerContainer & Item
export const StaggerContainer = ({ children, delayChildren = 0.1, staggerChildren = 0.1 }: { children: React.ReactNode; delayChildren?: number; staggerChildren?: number }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren, delayChildren }
      }
    }}
    initial="hidden"
    animate="show"
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children }: { children: React.ReactNode }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
    {children}
  </motion.div>
)

// New Components requested by user

export interface TypingAnimationProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F texts
   * @default undefined
   */
  texts: string[];
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F speed
   * @default undefined
   */
  speed?: number;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F deleteSpeed
   * @default undefined
   */
  deleteSpeed?: number;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F pauseDuration
   * @default undefined
   */
  pauseDuration?: number;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F loop
   * @default undefined
   */
  loop?: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F cursor
   * @default undefined
   */
  cursor?: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string;
}

export function TypingAnimation({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  loop = true,
  cursor = true,
  className,
}: TypingAnimationProps) {
  const [textIndex, setTextIndex] = React.useState(0);
  const [currentText, setCurrentText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!texts || texts.length === 0) return;

    let timer: any;

    const handleTyping = () => {
      const fullText = texts[textIndex];
      if (!fullText) return;

      if (!isDeleting) {
        const nextText = fullText.slice(0, currentText.length + 1);
        setCurrentText(nextText);
        
        if (nextText === fullText) {
          if (loop || textIndex < texts.length - 1) {
            timer = setTimeout(() => {
              setIsDeleting(true);
            }, pauseDuration);
          }
        } else {
          timer = setTimeout(handleTyping, speed);
        }
      } else {
        const nextText = fullText.slice(0, currentText.length - 1);
        setCurrentText(nextText);
        
        if (nextText === "") {
          setIsDeleting(false);
          setTextIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= texts.length) {
              return loop ? 0 : prevIndex;
            }
            return nextIndex;
          });
        } else {
          timer = setTimeout(handleTyping, deleteSpeed);
        }
      }
    };

    timer = setTimeout(handleTyping, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, textIndex, texts, speed, deleteSpeed, pauseDuration, loop]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{currentText}</span>
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="ml-0.5 inline-block w-0.5 h-[1.1em] bg-current font-normal align-middle"
        >
          |
        </motion.span>
      )}
    </span>
  );
}
`
};

// src/registry/special-forms.ts
var specialForms = {
  name: "special-forms",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "special-forms.tsx",
  content: `"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"
import { Check, Upload, Star, Plus, Minus } from "lucide-react"

// 1. RadioCard
export const RadioCard = ({ title, description, checked, onChange, value, name }: any) => (
  <label className={cn("relative flex cursor-pointer rounded-lg border p-4 hover:bg-accent transition-all", checked ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card")}>
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
    <div className="flex w-full justify-between items-center">
      <div className="flex flex-col">
        <span className="font-semibold">{title}</span>
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </div>
      <div className={cn("flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors", checked ? "border-primary bg-primary" : "border-muted-foreground")}>
        {checked && <div className="h-2.5 w-2.5 rounded-full bg-background" />}
      </div>
    </div>
  </label>
)

// 2. ColorSwatch
export const ColorSwatch = ({ color, selected, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={cn("relative flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110", selected && "ring-2 ring-primary ring-offset-2 ring-offset-background")}
    style={{ backgroundColor: color }}
  >
    {selected && <Check className="h-5 w-5 text-white drop-shadow-md" />}
  </button>
)

// 3. NumberStepper
export const NumberStepper = ({ value = 0, onChange, min = 0, max = 100 }: any) => (
  <div className="flex items-center space-x-2 rounded-md border border-border p-1 w-fit bg-card">
    <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"><Minus className="h-4 w-4" /></button>
    <div className="w-8 text-center font-medium text-sm">{value}</div>
    <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"><Plus className="h-4 w-4" /></button>
  </div>
)

// 4. FileDropzone
export const FileDropzone = ({ onDrop: _onDrop }: any) => (
  <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-xl bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
    <div className="p-4 rounded-full bg-muted group-hover:bg-background transition-colors mb-2">
      <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    <p className="text-sm font-medium">Click or drag file to this area to upload</p>
    <p className="text-xs text-muted-foreground mt-1">Support for a single or bulk upload.</p>
  </div>
)

// 5. RatingStars
export const RatingStars = ({ rating = 0, max = 5, onRate }: any) => (
  <div className="flex items-center space-x-1">
    {Array.from({ length: max }).map((_, i) => (
      <button key={i} type="button" onClick={() => onRate?.(i + 1)} className="p-1 focus:outline-none transition-transform hover:scale-110">
        <Star className={cn("h-6 w-6", i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground")} />
      </button>
    ))}
  </div>
)

// 6. ToggleGroupItem (Visual wrapper)
export const ToggleGroupItemWrapper = ({ children, active, onClick }: any) => (
  <button type="button" onClick={onClick} className={cn("px-4 py-2 text-sm font-medium transition-colors border border-transparent", active ? "bg-background text-foreground shadow-sm rounded-md" : "text-muted-foreground hover:text-foreground")}>
    {children}
  </button>
)

export const ToggleGroupWrapper = ({ children }: any) => (
  <div className="inline-flex items-center rounded-lg bg-muted p-1">{children}</div>
)

// 7. InputWithLabelOverlay
export const InputWithLabelOverlay = ({ label, id, ...props }: any) => (
  <div className="relative">
    <input id={id} className="block w-full rounded-md border border-border bg-background px-3 pb-2 pt-6 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary peer" placeholder=" " {...props} />
    <label htmlFor={id} className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary cursor-text">
      {label}
    </label>
  </div>
)

// 8. VisualSelectCard
export const VisualSelectCard = ({ icon: Icon, title, description, selected }: any) => (
  <div className={cn("flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all cursor-pointer hover:border-primary", selected ? "border-primary bg-primary/5" : "border-border bg-card")}>
    <Icon className={cn("h-8 w-8 mb-4", selected ? "text-primary" : "text-muted-foreground")} />
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
)

// 9. FloatingActionForm (Button that expands into form)
export const FloatingActionForm = ({ isOpen, toggle, children }: any) => (
  <div className="relative">
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} className="absolute bottom-16 right-0 w-80 bg-card border rounded-xl shadow-xl p-4 origin-bottom-right">
          {children}
        </motion.div>
      )}
    </AnimatePresence>
    <button type="button" onClick={toggle} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform active:scale-95">
      <motion.div animate={{ rotate: isOpen ? 45 : 0 }}><Plus className="h-6 w-6" /></motion.div>
    </button>
  </div>
)

// 10. OTPInput (Visual boxes)
export const OTPInput = ({ length = 6 }: any) => (
  <div className="flex space-x-2">
    {Array.from({ length }).map((_, i) => (
      <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold rounded-md border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
    ))}
  </div>
)
`
};

// src/registry/stepper.ts
var stepper = {
  name: "stepper",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "stepper.tsx",
  content: `"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check, ChevronRight } from "lucide-react"
import { cn } from "../utils/cn"

/**
 * Representing a single step definition
 */
export interface StepItem {
  title: string
  description?: string
  icon?: React.ReactNode
}

export type StepperVariant = "default" | "circles" | "arrows"
export type StepperSize = "sm" | "md" | "lg"

/**
 * Props for the Stepper component
 */
export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of step configurations
   */
  steps: StepItem[]
  /**
   * Index of the current active step (0-indexed)
   */
  currentStep: number
  /**
   * Orientation layout of the stepper
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical"
  /**
   * Style variant of the stepper
   * @default "default"
   */
  variant?: StepperVariant
  /**
   * Sizing scale of the stepper indicators
   * @default "md"
   */
  size?: StepperSize
  /**
   * Callback fired when a step indicator is clicked
   */
  onStepClick?: (stepIndex: number) => void
  /**
   * Additional CSS classes
   */
  className?: string
}

const circleSizes: Record<StepperSize, string> = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-[13px]",
  lg: "h-11 w-11 text-[15px]",
}

const checkSizes: Record<StepperSize, string> = {
  sm: "h-3.5 w-3.5 stroke-[3]",
  md: "h-4 w-4 stroke-[3]",
  lg: "h-5 w-5 stroke-[3]",
}

/**
 * Stepper component displays progress through a multi-step sequence with smooth animations.
 */
export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      orientation = "horizontal",
      variant = "default",
      size = "md",
      onStepClick,
      className,
      ...props
    },
    ref
  ) => {
    const isVertical = orientation === "vertical"
    const isInteractive = Boolean(onStepClick)

    // ============================================
    // Vertical Layout
    // ============================================
    if (isVertical) {
      return (
        <div
          ref={ref}
          className={cn("flex flex-col w-full select-none", className)}
          {...props}
        >
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep
            const isActive = idx === currentStep
            const isLast = idx === steps.length - 1

            return (
              <div key={idx} className="flex items-start gap-4 group">
                {/* Left Column: Indicator + Centered Vertical Line */}
                <div className="flex flex-col items-center shrink-0">
                  <motion.button
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => onStepClick?.(idx)}
                    whileHover={isInteractive ? { scale: 1.08 } : {}}
                    whileTap={isInteractive ? { scale: 0.95 } : {}}
                    className={cn(
                      "relative flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 z-10",
                      variant === "arrows" ? "rounded-xl" : "rounded-full",
                      circleSizes[size],
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/25"
                        : isActive
                        ? "border-primary text-primary bg-primary/10 shadow-lg shadow-primary/15 ring-4 ring-primary/20"
                        : "border-border text-muted-foreground bg-muted/30",
                      isInteractive ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      >
                        <Check className={checkSizes[size]} />
                      </motion.div>
                    ) : step.icon ? (
                      step.icon
                    ) : (
                      <span>{idx + 1}</span>
                    )}

                    {isActive && (
                      <span className="absolute inset-0 rounded-full animate-ping bg-primary/25 -z-10" />
                    )}
                  </motion.button>

                  {/* Vertical Connector Line perfectly centered under the circle */}
                  {!isLast && (
                    <div className="w-0.5 min-h-[36px] bg-muted/40 my-1 rounded-full relative overflow-hidden flex-1">
                      <motion.div
                        className="absolute top-0 left-0 right-0 bg-primary"
                        initial={{ height: "0%" }}
                        animate={{ height: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>

                {/* Right Column: Title & Description */}
                <div
                  onClick={() => isInteractive && onStepClick?.(idx)}
                  className={cn(
                    "flex flex-col text-left pt-1 pb-6 transition-colors",
                    isInteractive ? "cursor-pointer" : ""
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      isActive ? "text-foreground" : isCompleted ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-xs text-muted-foreground/70 mt-0.5 max-w-xs leading-relaxed">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    // ============================================
    // Horizontal Layout
    // ============================================
    return (
      <div
        ref={ref}
        className={cn("flex items-center w-full select-none justify-between", className)}
        {...props}
      >
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isActive = idx === currentStep
          const isLast = idx === steps.length - 1

          return (
            <React.Fragment key={idx}>
              {/* Step item: Circle + Text */}
              <div
                onClick={() => isInteractive && onStepClick?.(idx)}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 min-w-0 transition-all",
                  isInteractive ? "cursor-pointer group" : "cursor-default"
                )}
              >
                {/* Visual Circle Indicator */}
                <motion.button
                  type="button"
                  disabled={!isInteractive}
                  onClick={() => onStepClick?.(idx)}
                  whileHover={isInteractive ? { scale: 1.1 } : {}}
                  whileTap={isInteractive ? { scale: 0.95 } : {}}
                  className={cn(
                    "relative shrink-0 flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-300",
                    variant === "arrows" ? "rounded-xl" : "rounded-full",
                    circleSizes[size],
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/25"
                      : isActive
                      ? "border-primary text-primary bg-primary/10 shadow-lg shadow-primary/15 ring-4 ring-primary/20"
                      : "border-border text-muted-foreground bg-muted/30",
                    isInteractive ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      <Check className={checkSizes[size]} />
                    </motion.div>
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span>{idx + 1}</span>
                  )}

                  {isActive && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/25 -z-10" />
                  )}
                </motion.button>

                {/* Step Labels */}
                <div className="flex flex-col text-left min-w-0">
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-semibold transition-colors truncate max-w-[90px] sm:max-w-[120px]",
                      isActive
                        ? "text-foreground"
                        : isCompleted
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground/80"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="hidden xl:inline text-[11px] text-muted-foreground/70 max-w-[80px] sm:max-w-[110px] truncate">
                      {step.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Connector line between steps (never after the last step) */}
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-3 flex items-center min-w-[14px]">
                  {variant === "arrows" ? (
                    <div className="flex items-center justify-center w-full text-muted-foreground/40">
                      <ChevronRight className={cn("h-4 w-4 shrink-0 transition-colors", isCompleted && "text-primary")} />
                    </div>
                  ) : (
                    <div className="h-0.5 w-full bg-muted/50 rounded-full overflow-hidden relative">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)

Stepper.displayName = "Stepper"
`
};

// src/registry/switch.ts
var switchComponent = {
  name: "switch",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "@radix-ui/react-switch"
  ],
  fileName: "switch.tsx",
  content: `"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "../utils/cn"

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /**
   * The visual variant of the switch
   * @default "default"
   */
  variant?: "default" | "neon"
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, variant = "default", ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-foreground data-[state=checked]:border-foreground",
      "data-[state=unchecked]:bg-zinc-200 dark:data-[state=unchecked]:bg-zinc-800 data-[state=unchecked]:border-zinc-300 dark:data-[state=unchecked]:border-zinc-700",
      variant === "neon" && "data-[state=checked]:shadow-[0_0_12px_rgba(255,255,255,0.35)]",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full shadow-md ring-0 transition-transform duration-200 ease-in-out border",
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        "data-[state=checked]:bg-background data-[state=checked]:border-black/10 dark:data-[state=checked]:border-white/10",
        "data-[state=unchecked]:bg-white dark:data-[state=unchecked]:bg-zinc-300 data-[state=unchecked]:border-black/5 dark:data-[state=unchecked]:border-white/10"
      )}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
`
};

// src/registry/table.ts
var table = {
  name: "table",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "framer-motion"
  ],
  fileName: "table.tsx",
  content: `'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

// Define Table styling context to propagate values to children (th, td, tr)
interface TableContextProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F variant
   * @default undefined
   */
  variant: 'default' | 'glass' | 'neon' | 'minimal' | 'cyberpunk' | 'aurora' | 'gradient';
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F density
   * @default undefined
   */
  density: 'compact' | 'normal' | 'spacious';
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F hoverable
   * @default undefined
   */
  hoverable: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F striped
   * @default undefined
   */
  striped: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F bordered
   * @default undefined
   */
  bordered: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F animateRows
   * @default undefined
   */
  animateRows?: boolean;
}

const TableContext = React.createContext<TableContextProps>({
  variant: 'default',
  density: 'normal',
  hoverable: true,
  striped: false,
  bordered: false,
  animateRows: false,
});

const tableContainerVariants = cva(
  "w-full overflow-auto relative transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card border border-border text-card-foreground rounded-2xl shadow-sm",
        glass: "glass bg-white/[0.01] dark:bg-black/10 border border-white/10 dark:border-white/5 rounded-2xl shadow-xl",
        neon: "bg-black/40 border border-purple-500/30 text-white rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.15)]",
        minimal: "bg-transparent border-0 border-b border-border/50 text-foreground rounded-none shadow-none",
        cyberpunk: "bg-black border-2 border-green-500/50 text-green-400 font-mono rounded-none shadow-[0_0_15px_rgba(34,197,94,0.15)]",
        aurora: "bg-card/25 backdrop-blur-xl border border-pink-500/10 text-card-foreground rounded-2xl shadow-xl",
        gradient: "bg-linear-to-b from-card to-muted/20 border border-border/80 text-foreground rounded-2xl shadow-md",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableContainerVariants> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F density
   * @default undefined
   */
  density?: 'compact' | 'normal' | 'spacious';
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F hoverable
   * @default undefined
   */
  hoverable?: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F striped
   * @default undefined
   */
  striped?: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F bordered
   * @default undefined
   */
  bordered?: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F animateRows
   * @default undefined
   */
  animateRows?: boolean;
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F containerClassName
   * @default undefined
   */
  containerClassName?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      containerClassName,
      variant = 'default',
      density = 'normal',
      hoverable = true,
      striped = false,
      bordered = false,
      animateRows = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <TableContext.Provider value={{ 
        variant: (variant === null || variant === undefined) ? 'default' : variant, 
        density: (density === null || density === undefined) ? 'normal' : density, 
        hoverable, 
        striped, 
        bordered, 
        animateRows 
      }}>
        <div className={cn(tableContainerVariants({ variant }), containerClassName)}>
          {/* Cyberpunk corner accents */}
          {variant === 'cyberpunk' && (
            <>
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500" />
            </>
          )}
          <table
            ref={ref}
            className={cn("w-full border-collapse text-left text-sm align-middle", className)}
            {...props}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  }
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  const { variant } = React.useContext(TableContext);

  const headerClass = cn(
    "border-b border-border/80 font-medium text-muted-foreground/95 select-none",
    variant === 'cyberpunk' && "bg-green-950/40 border-b-2 border-green-500/60 text-green-300 font-bold uppercase tracking-wider",
    variant === 'neon' && "bg-purple-950/20 border-b border-purple-500/40 text-purple-200 tracking-wide",
    variant === 'glass' && "bg-white/5 dark:bg-white/3 border-b border-white/10 text-foreground/80",
    variant === 'aurora' && "bg-linear-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border-b border-purple-500/20 text-purple-300",
    variant === 'gradient' && "bg-linear-to-r from-primary/10 to-indigo-500/5 border-b border-border/80 text-foreground/90",
    className
  );

  return (
    <thead ref={ref} className={headerClass} {...props}>
      {children}
    </thead>
  );
});
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => {
  const { variant } = React.useContext(TableContext);

  const bodyClass = cn(
    "divide-y divide-border/40",
    variant === 'minimal' && "divide-y divide-border/20",
    variant === 'cyberpunk' && "divide-y divide-green-500/30",
    className
  );

  return (
    <tbody ref={ref} className={bodyClass} {...props}>
      {children}
    </tbody>
  );
});
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TableContext);
  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t bg-muted/50 font-medium text-muted-foreground",
        variant === 'cyberpunk' && "bg-green-950/20 border-t-2 border-green-500/40 text-green-300 font-mono",
        className
      )}
      {...props}
    />
  );
});
TableFooter.displayName = 'TableFooter';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F index
   * @default undefined
   */
  index?: number;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, index = 0, ...props }, ref) => {
    const { variant, hoverable, striped, animateRows } = React.useContext(TableContext);

    const rowClass = cn(
      "transition-all duration-200 border-b border-border/10 last:border-b-0",
      // Striped logic
      striped && {
        "odd:bg-muted/15": ['default', 'gradient', 'minimal', 'aurora'].includes(variant),
        "odd:bg-white/[0.02] dark:odd:bg-white/[0.01]": variant === 'glass',
        "odd:bg-purple-500/2": variant === 'neon',
        "odd:bg-green-950/20": variant === 'cyberpunk',
      },
      // Hover logic
      hoverable && {
        "hover:bg-muted/40": ['default', 'minimal'].includes(variant),
        "hover:bg-white/5 dark:hover:bg-white/5 hover:backdrop-blur-md": variant === 'glass',
        "hover:bg-purple-500/5 hover:shadow-[inset_0_0_10px_rgba(139,92,246,0.05)]": variant === 'neon',
        "hover:bg-green-500/10 hover:text-green-300": variant === 'cyberpunk',
        "hover:bg-pink-500/5 hover:backdrop-blur-md": variant === 'aurora',
        "hover:bg-indigo-500/5": variant === 'gradient',
      },
      className
    );

    if (animateRows) {
      return (
        <motion.tr
          ref={ref as any}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 24,
            delay: index * 0.05,
          }}
          className={rowClass}
          {...(props as any)}
        />
      );
    }

    return <tr ref={ref} className={rowClass} {...props} />;
  }
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { density, bordered, variant } = React.useContext(TableContext);

  const headClass = cn(
    "font-semibold select-none align-middle text-muted-foreground/80",
    {
      "px-3 py-2 text-xs": density === 'compact',
      "px-4 py-3.5 text-sm": density === 'normal',
      "px-6 py-5 text-base": density === 'spacious',
      "border-r border-border/40 last:border-r-0": bordered,
      "border-r border-green-500/30 last:border-r-0": bordered && variant === 'cyberpunk',
      "border-r border-purple-500/20 last:border-r-0": bordered && variant === 'neon',
    },
    variant === 'cyberpunk' && "text-green-300 font-mono tracking-wider",
    className
  );

  return <th ref={ref} className={headClass} {...props} />;
});
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { density, bordered, variant } = React.useContext(TableContext);

  const cellClass = cn(
    "align-middle transition-colors",
    {
      "px-3 py-2 text-xs": density === 'compact',
      "px-4 py-3 text-sm": density === 'normal',
      "px-6 py-4.5 text-base": density === 'spacious',
      "border-r border-border/40 last:border-r-0": bordered,
      "border-r border-green-500/20 last:border-r-0": bordered && variant === 'cyberpunk',
      "border-r border-purple-500/20 last:border-r-0": bordered && variant === 'neon',
    },
    variant === 'cyberpunk' && "border-green-500/20 text-green-400 font-mono",
    className
  );

  return <td ref={ref} className={cellClass} {...props} />;
});
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TableContext);
  return (
    <caption
      ref={ref}
      className={cn(
        "mt-4 text-xs text-muted-foreground/60 italic text-center pb-3",
        variant === 'cyberpunk' && "text-green-500/50 font-mono uppercase tracking-widest",
        className
      )}
      {...props}
    />
  );
});
TableCaption.displayName = 'TableCaption';

// \u2501\u2501\u2501 High-Level Customizable Table Component \u2501\u2501\u2501
export interface CustomizableTableProps extends TableProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F headers
   * @default undefined
   */
  headers: string[];
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F rows
   * @default undefined
   */
  rows: React.ReactNode[][];
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F caption
   * @default undefined
   */
  caption?: string;
}

export const CustomizableTable: React.FC<CustomizableTableProps> = ({
  headers,
  rows,
  caption,
  ...props
}) => {
  return (
    <Table {...props}>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {headers.map((header, i) => (
            <TableHead key={i}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex} index={rowIndex}>
            {headers.map((_, colIndex) => (
              <TableCell key={colIndex}>
                {row[colIndex] !== undefined && row[colIndex] !== null && row[colIndex] !== "" ? (
                  row[colIndex]
                ) : (
                  <span className="text-muted-foreground/40 font-mono text-xs">\u2014</span>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export interface DataTableColumn<T = any> {
  header: React.ReactNode;
  accessorKey?: keyof T | string;
  cell?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T = any> extends TableProps {
  data?: T[];
  columns?: DataTableColumn<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKey?: keyof T | string;
  pagination?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  children?: React.ReactNode;
}

export function DataTable<T = any>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = "Filter results...",
  searchKey,
  pagination = false,
  pageSize = 5,
  emptyMessage = "No results found.",
  children,
  ...tableProps
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  if (children) {
    return <Table {...tableProps}>{children}</Table>;
  }

  const items = data || [];
  const filtered = items.filter((item: any) => {
    if (!search.trim()) return true;
    if (searchKey && item[searchKey] !== undefined) {
      return String(item[searchKey]).toLowerCase().includes(search.toLowerCase());
    }
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const displayed = pagination
    ? filtered.slice((page - 1) * pageSize, page * pageSize)
    : filtered;

  return (
    <div className="w-full space-y-3">
      {searchable && (
        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="px-3.5 py-1.5 rounded-xl border border-border bg-background/60 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary w-64 shadow-xs"
          />
        </div>
      )}

      <Table {...tableProps}>
        {columns && (
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {displayed.length > 0 ? (
            displayed.map((item, rowIdx) => (
              <TableRow key={rowIdx} index={rowIdx}>
                {columns?.map((col, colIdx) => (
                  <TableCell key={colIdx} className={col.className}>
                    {col.cell
                      ? col.cell(item, rowIdx)
                      : col.accessorKey
                      ? String((item as any)[col.accessorKey] ?? '')
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns?.length || 1}
                className="text-center py-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-1 text-xs text-muted-foreground">
          <span>
            Page {page} of {totalPages} ({filtered.length} items)
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Attach dot-notation to Table & DataTable
export const TableCompound = Object.assign(Table, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
});

Object.assign(DataTable, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
});

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
`
};

// src/registry/tabs.ts
var tabs = {
  name: "tabs",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "@radix-ui/react-tabs"
  ],
  fileName: "tabs.tsx",
  content: `"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "../utils/cn"

import { cva, type VariantProps } from "class-variance-authority"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  "inline-flex h-11 items-center justify-center p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50",
        pill: "bg-transparent gap-2",
        underline: "bg-transparent border-b rounded-none w-full justify-start h-auto p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, className }))}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-transparent",
  {
    variants: {
      variant: {
        default: "rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:border-border/50",
        pill: "rounded-full border-border/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary",
        underline: "rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 pt-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, className }))}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
`
};

// src/registry/toaster.ts
var toaster = {
  name: "toaster",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "sonner",
    "next-themes"
  ],
  fileName: "toaster.tsx",
  content: `"use client"

import { useTheme } from "next-themes"
import { Toaster as SonnerToaster } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme()

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { toast } from "sonner"
`
};

// src/registry/tooltip.ts
var tooltip = {
  name: "tooltip",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "@radix-ui/react-tooltip"
  ],
  fileName: "tooltip.tsx",
  content: `"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "../utils/cn"

const TooltipProvider = TooltipPrimitive.Provider

const TooltipRoot = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-lg border border-border/50 bg-popover/90 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export interface TooltipProps {
  /**
   * The content to display in the tooltip
   */
  content: React.ReactNode;
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactNode;
  /**
   * The side of the trigger to display the tooltip on
   * @default "top"
   */
  side?: "top" | "bottom" | "left" | "right";
  /**
   * The delay in milliseconds before the tooltip opens
   * @default 700
   */
  delay?: number;
  /**
   * The visual theme style of the tooltip content
   * @default "default"
   */
  variant?: "default" | "dark" | "light";
}

export function Tooltip({
  content,
  children,
  side = "top",
  delay = 700,
  variant = "default",
}: TooltipProps) {
  const variantClasses = {
    default: "",
    dark: "bg-zinc-950/95 text-zinc-50 border-zinc-800",
    light: "bg-white/95 text-zinc-950 border-zinc-200 shadow-md",
  };

  return (
    <TooltipProvider delayDuration={delay}>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={variantClasses[variant]}>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}

export { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider }

export interface SimpleTooltipProps {
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  delay?: number;
  variant?: "default" | "dark" | "light";
}

export function SimpleTooltip({
  content,
  position = "top",
  children,
  delay = 200,
  variant = "default",
}: SimpleTooltipProps) {
  return (
    <Tooltip content={content} side={position} delay={delay} variant={variant}>
      {children}
    </Tooltip>
  );
}

export interface RichTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

export function RichTooltip({
  content,
  children,
  delay = 200,
}: RichTooltipProps) {
  return (
    <Tooltip content={content} side="top" delay={delay}>
      {children}
    </Tooltip>
  );
}
`
};

// src/registry/ultra-components.ts
var ultraComponents = {
  name: "ultra-components",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  componentsDependencies: [
    "marquee",
    "number-ticker",
    "special-animations"
  ],
  fileName: "ultra-components.tsx",
  content: `"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. Marquee, NumberTicker, and TypingAnimation Re-exports
// ============================================
export { Marquee, type MarqueeProps } from "./marquee"
export { NumberTicker, type NumberTickerProps } from "./number-ticker"
export { TypingAnimation, type TypingAnimationProps } from "./special-animations"

// ============================================
// 5. AnimatedGradientBorder \u2014 Animated gradient border
// ============================================
export interface AnimatedGradientBorderProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F children
   * @default undefined
   */
  children: React.ReactNode
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F containerClassName
   * @default undefined
   */
  containerClassName?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F gradientClassName
   * @default undefined
   */
  gradientClassName?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F duration
   * @default undefined
   */
  duration?: number
}

export function AnimatedGradientBorder({
  children,
  className,
  containerClassName,
  gradientClassName,
  duration = 3,
}: AnimatedGradientBorderProps) {
  return (
    <div className={cn("relative rounded-xl p-px", containerClassName)}>
      <motion.div
        className={cn(
          "absolute inset-0 rounded-xl",
          gradientClassName
        )}
        style={{
          background: "linear-gradient(var(--angle, 0deg), #ff0080, #7928ca, #ff0080)",
        }}
        animate={{
          "--angle": ["0deg", "360deg"],
        } as any}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className={cn("relative rounded-xl bg-background", className)}>
        {children}
      </div>
    </div>
  )
}


// ============================================
// 7. AnimatedBeam \u2014 SVG beam connecting elements
// ============================================
export interface AnimatedBeamProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F children
   * @default undefined
   */
  children: React.ReactNode
}

export function AnimatedBeam({ className, children }: AnimatedBeamProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  )
}

// ============================================
// 8. ShinyText \u2014 Text with a shimmering highlight
// ============================================
export interface ShinyTextProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F children
   * @default undefined
   */
  children: React.ReactNode
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F shimmerWidth
   * @default undefined
   */
  shimmerWidth?: number
}

export function ShinyText({
  children,
  className,
  shimmerWidth = 100,
}: ShinyTextProps) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent",
        "bg-[length:250%_100%] animate-shimmer-text",
        className
      )}
      style={{
        backgroundImage: \`linear-gradient(110deg, currentColor 35%, rgba(255,255,255,0.8) 50%, currentColor 65%)\`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        backgroundSize: \`\${shimmerWidth * 3}% 100%\`,
      }}
    >
      {children}
    </span>
  )
}

// ============================================
// 9. RetroGrid \u2014 Retro perspective grid background
// ============================================
export interface RetroGridProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F angle
   * @default undefined
   */
  angle?: number
}

export function RetroGrid({ className, angle = 65 }: RetroGridProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [perspective:200px]",
        className
      )}
      style={{ "--grid-angle": \`\${angle}deg\` } as React.CSSProperties}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className="animate-grid"
          style={{
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
            height: "300vh",
            inset: "-50% 0px",
            marginLeft: "-50%",
            transformOrigin: "100% 0 0",
            width: "600vw",
            backgroundImage: \`linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 0),
                              linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 0)\`,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-background to-transparent to-90%" />
    </div>
  )
}

// ============================================
// 10. Meteors \u2014 Falling meteors animation
// ============================================
export interface MeteorsProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F number
   * @default undefined
   */
  number?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
}

export function Meteors({ number = 20, className }: MeteorsProps) {
  const meteors = React.useMemo(() => {
    return [...Array(number)].map((_, idx) => ({
      id: idx,
      size: Math.floor(Math.random() * 2) + 1,
      left: \`\${Math.floor(Math.random() * 100)}%\`,
      animationDelay: \`\${(Math.random() * 2).toFixed(1)}s\`,
      animationDuration: \`\${Math.floor(Math.random() * 8 + 5)}s\`,
    }))
  }, [number])

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute top-0 animate-meteor rounded-full bg-foreground/20 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            left: meteor.left,
            width: \`\${meteor.size}px\`,
            height: \`\${meteor.size * 20}px\`,
            animationDelay: meteor.animationDelay,
            animationDuration: meteor.animationDuration,
          }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 w-px h-full bg-linear-to-b from-foreground/30 to-transparent" />
        </span>
      ))}
    </div>
  )
}
`
};

// src/registry/ultra-effects.ts
var ultraEffects = {
  name: "ultra-effects",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  componentsDependencies: [
    "blur-fade"
  ],
  fileName: "ultra-effects.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

// ============================================
// 1. MorphingText \u2014 Text morphing between values
// ============================================
export interface MorphingTextProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F texts
   * @default undefined
   */
  texts: string[]
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F interval
   * @default undefined
   */
  interval?: number
}

export function MorphingText({
  texts,
  className,
  interval = 3000,
}: MorphingTextProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, interval)
    return () => clearInterval(timer)
  }, [texts.length, interval])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 20, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -20, opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="block"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

// ============================================
// 2. AnimatedList \u2014 Animated notification list
// ============================================
export interface AnimatedListProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F children
   * @default undefined
   */
  children: React.ReactNode
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F delay
   * @default undefined
   */
  delay?: number
}

export function AnimatedList({
  children,
  className,
  delay = 500,
}: AnimatedListProps) {
  const [items, setItems] = React.useState<React.ReactNode[]>([])
  const childArray = React.Children.toArray(children)

  React.useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < childArray.length) {
        setItems((prev) => [...prev, childArray[i]])
        i++
      } else {
        clearInterval(timer)
      }
    }, delay)
    return () => clearInterval(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// 3. BlurFade Re-export
// ============================================
export { BlurFade, type BlurFadeProps } from "./blur-fade"

// ============================================
// 4. InteractiveHoverButton \u2014 Button with expanding hover
// ============================================
export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F text
   * @default undefined
   */
  text?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
}

export function InteractiveHoverButton({
  text = "Button",
  className,
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <button
      className={cn(
        "group relative w-32 cursor-pointer overflow-hidden rounded-full border border-border bg-background p-2 text-center font-semibold transition-colors duration-300",
        className
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
      </div>
      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-primary transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:rounded-none" />
    </button>
  )
}

// ============================================
// 5. PulsatingButton \u2014 Button with pulsating ring
// ============================================
export interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F pulseColor
   * @default undefined
   */
  pulseColor?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F duration
   * @default undefined
   */
  duration?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
}

export function PulsatingButton({
  className,
  children,
  pulseColor = "hsl(var(--primary))",
  duration = "1.5s",
  ...props
}: PulsatingButtonProps) {
  return (
    <button
      className={cn(
        "relative text-center cursor-pointer flex justify-center items-center rounded-lg text-white bg-primary px-4 py-2",
        className
      )}
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute top-1/2 left-1/2 size-full rounded-lg bg-inherit animate-pulse-ring -translate-x-1/2 -translate-y-1/2" />
    </button>
  )
}

// ============================================
// 6. RainbowButton \u2014 Button with rainbow gradient border
// ============================================
export interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent]",
        "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(30,100%,63%),hsl(60,100%,63%),hsl(120,100%,63%),hsl(180,100%,63%),hsl(240,100%,63%),hsl(300,100%,63%),hsl(360,100%,63%))]",
        "dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(30,100%,63%),hsl(60,100%,63%),hsl(120,100%,63%),hsl(180,100%,63%),hsl(240,100%,63%),hsl(300,100%,63%),hsl(360,100%,63%))]",
        "dark:text-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ============================================
// 7. CoolMode \u2014 Particles burst on click
// ============================================
export interface CoolModeProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F children
   * @default undefined
   */
  children: React.ReactElement
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
}

export function CoolMode({ children, className }: CoolModeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const count = 15

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div")
      const size = Math.random() * 8 + 4
      const angle = (Math.PI * 2 * i) / count
      const velocity = Math.random() * 80 + 40

      particle.style.cssText = \`
        position: absolute;
        left: \${x}px;
        top: \${y}px;
        width: \${size}px;
        height: \${size}px;
        border-radius: 50%;
        background: hsl(\${Math.random() * 360}, 70%, 60%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: all \${0.5 + Math.random() * 0.5}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      \`

      containerRef.current?.appendChild(particle)

      requestAnimationFrame(() => {
        particle.style.transform = \`translate(\${Math.cos(angle) * velocity}px, \${Math.sin(angle) * velocity}px)\`
        particle.style.opacity = "0"
      })

      setTimeout(() => particle.remove(), 1000)
    }
  }

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)} onClick={handleClick}>
      {children}
    </div>
  )
}

// ============================================
// 8. WordPullUp \u2014 Words pulling up animation
// ============================================
export interface WordPullUpProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F words
   * @default undefined
   */
  words: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F delayMultiple
   * @default undefined
   */
  delayMultiple?: number
}

export function WordPullUp({
  words,
  className,
  delayMultiple = 0.08,
}: WordPullUpProps) {
  const wordArray = words.split(" ")

  return (
    <div className={cn("flex flex-wrap justify-center gap-x-2", className)}>
      {wordArray.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: i * delayMultiple,
            duration: 0.3,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

// ============================================
// 9. BoxReveal \u2014 Box reveal animation
// ============================================
export interface BoxRevealProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F children
   * @default undefined
   */
  children: React.ReactNode
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F boxColor
   * @default undefined
   */
  boxColor?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F duration
   * @default undefined
   */
  duration?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F delay
   * @default undefined
   */
  delay?: number
}

export function BoxReveal({
  children,
  className,
  boxColor = "hsl(var(--primary))",
  duration = 0.5,
  delay = 0,
}: BoxRevealProps) {
  return (
    <div className={cn("relative inline-block overflow-hidden", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + duration, duration: 0.01 }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: boxColor, transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 1, 0] }}
        transition={{
          duration: duration * 2,
          delay,
          ease: "easeInOut",
          times: [0, 0.5, 0.5, 1],
        }}
      />
    </div>
  )
}

// ============================================
// 10. TextShimmer \u2014 Text with color shimmer
// ============================================
export interface TextShimmerProps {
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F children
   * @default undefined
   */
  children: React.ReactNode
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F className
   * @default undefined
   */
  className?: string
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F duration
   * @default undefined
   */
  duration?: number
  /**
   * \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u0434\u043B\u044F spread
   * @default undefined
   */
  spread?: number
}

export function TextShimmer({
  children,
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  return (
    <span
      className={cn(
        "inline-flex animate-text-shimmer bg-clip-text text-transparent",
        className
      )}
      style={{
        backgroundImage: \`linear-gradient(
          110deg,
          hsl(var(--foreground)) 35%,
          hsl(var(--primary)) \${50 - spread}%,
          hsl(var(--primary)) \${50 + spread}%,
          hsl(var(--foreground)) 65%
        )\`,
        backgroundSize: "250% 100%",
        animationDuration: \`\${duration}s\`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  )
}
`
};

// src/registry/index.ts
var registry = {
  // UI Components
  "accordion": accordion,
  "ai-prompt-input": aiPromptInput,
  "aiPromptInput": aiPromptInput,
  "alert": alert,
  "aurora-border-card": auroraBorderCard,
  "auroraBorderCard": auroraBorderCard,
  "aurora-border-fx": auroraBorderFx,
  "auroraBorderFx": auroraBorderFx,
  "aurora-search-pill": auroraSearchPill,
  "auroraSearchPill": auroraSearchPill,
  "avatar": avatar,
  "badge": badge,
  "blur-fade": blurFade,
  "blurFade": blurFade,
  "button": button,
  "card": card,
  "checkbox": checkbox,
  "command": command,
  "dark-mode": darkMode,
  "darkMode": darkMode,
  "data-display": dataDisplay,
  "dataDisplay": dataDisplay,
  "dialog": dialog,
  "dock": dock,
  "file-upload": fileUpload,
  "fileUpload": fileUpload,
  "frost-hover-card": frostHoverCard,
  "frostHoverCard": frostHoverCard,
  "glass-shatter-card": glassShatterCard,
  "glassShatterCard": glassShatterCard,
  "holo-finish-card": holoFinishCard,
  "holoFinishCard": holoFinishCard,
  "live-object": liveObject,
  "liveObject": liveObject,
  "particle-reveal-card": particleRevealCard,
  "particleRevealCard": particleRevealCard,
  "input": input,
  "interactive-code-block": interactiveCodeBlock,
  "interactiveCodeBlock": interactiveCodeBlock,
  "loader": loader,
  "marquee": marquee,
  "modal": modal,
  "morphing-geometry": morphingGeometry,
  "morphingGeometry": morphingGeometry,
  "navigation": navigation,
  "node-flow-graph": nodeFlowGraph,
  "nodeFlowGraph": nodeFlowGraph,
  "number-ticker": numberTicker,
  "numberTicker": numberTicker,
  "premium-charts": premiumCharts,
  "premiumCharts": premiumCharts,
  "premium-commerce": premiumCommerce,
  "premiumCommerce": premiumCommerce,
  "premium-effects": premiumEffects,
  "premiumEffects": premiumEffects,
  "premium-media": premiumMedia,
  "premiumMedia": premiumMedia,
  "premium-overlays": premiumOverlays,
  "premiumOverlays": premiumOverlays,
  "premium-social": premiumSocial,
  "premiumSocial": premiumSocial,
  "pro-ai": proAi,
  "proAi": proAi,
  "pro-buttons": proButtons,
  "proButtons": proButtons,
  "pro-cards": proCards,
  "proCards": proCards,
  "pro-dashboards": proDashboards,
  "proDashboards": proDashboards,
  "pro-ecommerce": proEcommerce,
  "proEcommerce": proEcommerce,
  "pro-feedback": proFeedback,
  "proFeedback": proFeedback,
  "pro-forms": proForms,
  "proForms": proForms,
  "pro-inputs": proInputs,
  "proInputs": proInputs,
  "pro-layouts": proLayouts,
  "proLayouts": proLayouts,
  "pro-lists": proLists,
  "proLists": proLists,
  "pro-marketing": proMarketing,
  "proMarketing": proMarketing,
  "pro-navigation": proNavigation,
  "proNavigation": proNavigation,
  "pro-tables": proTables,
  "proTables": proTables,
  "progress": progress,
  "rating": rating,
  "scroll-area": scrollArea,
  "scrollArea": scrollArea,
  "select": select,
  "skeleton": skeleton,
  "slider": slider,
  "sound-pulse": soundPulse,
  "soundPulse": soundPulse,
  "silk-unveil": silkUnveil,
  "silkUnveil": silkUnveil,
  "special-animations": specialAnimations,
  "specialAnimations": specialAnimations,
  "special-forms": specialForms,
  "specialForms": specialForms,
  "stepper": stepper,
  "switch": switchComponent,
  "switchComponent": switchComponent,
  "table": table,
  "tabs": tabs,
  "toaster": toaster,
  "tooltip": tooltip,
  "ultra-components": ultraComponents,
  "ultraComponents": ultraComponents,
  "ultra-effects": ultraEffects,
  "ultraEffects": ultraEffects,
  // Aliases
  "loaders": loader,
  "charts": premiumCharts,
  "commerce": premiumCommerce,
  "social": premiumSocial
};

// src/utils/auth.ts
var fs3 = __toESM(require("fs"));
var path3 = __toESM(require("path"));
var os = __toESM(require("os"));
var crypto = __toESM(require("crypto"));
function getConfigPath() {
  const homeDir = os.homedir();
  const configDir = path3.join(homeDir, ".nexoreui");
  if (!fs3.existsSync(configDir)) {
    try {
      fs3.mkdirSync(configDir, { recursive: true });
    } catch {
    }
  }
  return path3.join(configDir, "config.json");
}
function getOrCreateDeviceId() {
  const homeDir = os.homedir();
  const configDir = path3.join(homeDir, ".nexoreui");
  const idPath = path3.join(configDir, "device_id");
  const hostName = os.hostname() || "developer-machine";
  const username = os.userInfo?.()?.username || "user";
  const deviceName = `${hostName} (${username})`;
  try {
    if (fs3.existsSync(idPath)) {
      const existing = fs3.readFileSync(idPath, "utf8").trim();
      if (existing) return { deviceId: existing, deviceName };
    }
  } catch {
  }
  const rawSeed = `${hostName}::${username}::${os.platform()}::${os.arch()}::${crypto.randomBytes(8).toString("hex")}`;
  const deviceId = `dev_${crypto.createHash("sha256").update(rawSeed).digest("hex").slice(0, 24)}`;
  try {
    if (!fs3.existsSync(configDir)) {
      fs3.mkdirSync(configDir, { recursive: true });
    }
    fs3.writeFileSync(idPath, deviceId, "utf8");
  } catch {
  }
  return { deviceId, deviceName };
}
function readStoredConfig() {
  const envKey = process.env.NEXOREUI_LICENSE_KEY?.trim();
  try {
    const configPath = getConfigPath();
    if (fs3.existsSync(configPath)) {
      const content = fs3.readFileSync(configPath, "utf8");
      const parsed = JSON.parse(content);
      if (envKey && !parsed.licenseKey) {
        parsed.licenseKey = envKey;
      }
      return parsed;
    }
  } catch {
  }
  return envKey ? { licenseKey: envKey } : {};
}
function saveStoredConfig(config) {
  try {
    const configPath = getConfigPath();
    fs3.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
  } catch {
  }
}
async function verifyRemoteLicense(key) {
  const cleanKey = key.trim().toUpperCase();
  const { deviceId, deviceName } = getOrCreateDeviceId();
  const apiUrls = [
    process.env.NEXOREUI_API_URL,
    "https://www.nexoreui.site",
    "https://nexoreui.site",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3001",
    "http://localhost:3001"
  ].filter(Boolean);
  for (const baseUrl of apiUrls) {
    try {
      const url = `${baseUrl}/api/licenses/verify?key=${encodeURIComponent(cleanKey)}&device_id=${encodeURIComponent(deviceId)}&device_name=${encodeURIComponent(deviceName)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "nexoreui-cli/2.0.1"
        },
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.valid) {
          return {
            valid: true,
            owner: json.owner,
            tier: json.tier,
            activationsCount: json.activationsCount,
            maxDevices: json.maxDevices
          };
        } else {
          return {
            valid: false,
            error: json.error || "License verification failed",
            activationsCount: json.activationsCount,
            maxDevices: json.maxDevices
          };
        }
      } else {
        const json = await res.json().catch(() => ({}));
        if (json.error) {
          return {
            valid: false,
            error: json.error
          };
        }
      }
    } catch {
    }
  }
  return {
    valid: false,
    error: "License verification service unreachable or key is invalid."
  };
}
async function fetchRemoteTemplate(name, key) {
  const { deviceId, deviceName } = getOrCreateDeviceId();
  const apiUrls = [
    process.env.NEXOREUI_API_URL,
    "https://www.nexoreui.site",
    "https://nexoreui.site",
    "http://127.0.0.1:3000",
    "http://localhost:3000"
  ].filter(Boolean);
  for (const baseUrl of apiUrls) {
    try {
      const url = `${baseUrl}/api/registry/pro?name=${encodeURIComponent(name)}&key=${encodeURIComponent(key)}&device_id=${encodeURIComponent(deviceId)}&device_name=${encodeURIComponent(deviceName)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "nexoreui-cli/2.0.1"
        },
        signal: AbortSignal.timeout(8e3)
      });
      const json = await res.json();
      if (res.ok && json.valid) {
        return json;
      } else if (json.error) {
        return { valid: false, error: json.error };
      }
    } catch {
    }
  }
  return {
    valid: false,
    error: "Failed to connect to NexoreUI Pro registry server."
  };
}

// src/commands/add.ts
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(
    (resolve4) => rl.question(query, (ans) => {
      rl.close();
      resolve4(ans);
    })
  );
}
var TEMPLATE_MEDIA_ASSETS = {
  "template-nexore-case-pro": [
    "/templates/nexore-case/nexore-01-box-closed.jpg",
    "/templates/nexore-case/nexore-02-box-open.jpg",
    "/templates/nexore-case/nexore-03-case-white.jpg",
    "/templates/nexore-case/nexore-04-charms-sheet.jpg",
    "/templates/nexore-case/nexore-05-stars-tray.jpg",
    "/templates/nexore-case/nexore-06-paper-texture.jpg",
    "/templates/nexore-case/nexore-07-seal-pad.jpg"
  ],
  "nexore-case": [
    "/templates/nexore-case/nexore-01-box-closed.jpg",
    "/templates/nexore-case/nexore-02-box-open.jpg",
    "/templates/nexore-case/nexore-03-case-white.jpg",
    "/templates/nexore-case/nexore-04-charms-sheet.jpg",
    "/templates/nexore-case/nexore-05-stars-tray.jpg",
    "/templates/nexore-case/nexore-06-paper-texture.jpg",
    "/templates/nexore-case/nexore-07-seal-pad.jpg"
  ],
  "template-vesuvio-pizza-pro": [
    "/templates/vesuvio-pizza/scene/counter.jpg",
    "/templates/vesuvio-pizza/scene/box-closed.webp",
    "/templates/vesuvio-pizza/scene/box-base.webp",
    "/templates/vesuvio-pizza/scene/box-ajar.webp",
    "/templates/vesuvio-pizza/scene/timer.webp",
    "/templates/vesuvio-pizza/pizza/dough.webp",
    "/templates/vesuvio-pizza/pizza/sauce.webp",
    "/templates/vesuvio-pizza/pizza/crust-baked.webp",
    "/templates/vesuvio-pizza/pizza/pizza-baked-full.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-1.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-2.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-1.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-2.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-1.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-1.webp",
    "/templates/vesuvio-pizza/toppings/basil-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-3.webp",
    "/templates/vesuvio-pizza/toppings/olive-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-2.webp",
    "/templates/vesuvio-pizza/trays/tray-mozzarella.webp",
    "/templates/vesuvio-pizza/trays/tray-pepperoni.webp",
    "/templates/vesuvio-pizza/trays/tray-mushrooms.webp",
    "/templates/vesuvio-pizza/trays/tray-basil.webp",
    "/templates/vesuvio-pizza/trays/tray-olives.webp",
    "/templates/vesuvio-pizza/trays/tray-onion.webp",
    "/templates/vesuvio-pizza/hands/hand-open.webp",
    "/templates/vesuvio-pizza/hands/hand-pinch.webp",
    "/templates/vesuvio-pizza/hands/hand-ok.webp",
    "/templates/vesuvio-pizza/hands/hand-point.webp"
  ],
  "vesuvio-pizza": [
    "/templates/vesuvio-pizza/scene/counter.jpg",
    "/templates/vesuvio-pizza/scene/box-closed.webp",
    "/templates/vesuvio-pizza/scene/box-base.webp",
    "/templates/vesuvio-pizza/scene/box-ajar.webp",
    "/templates/vesuvio-pizza/scene/timer.webp",
    "/templates/vesuvio-pizza/pizza/dough.webp",
    "/templates/vesuvio-pizza/pizza/sauce.webp",
    "/templates/vesuvio-pizza/pizza/crust-baked.webp",
    "/templates/vesuvio-pizza/pizza/pizza-baked-full.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-1.webp",
    "/templates/vesuvio-pizza/toppings/mozzarella-2.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-1.webp",
    "/templates/vesuvio-pizza/toppings/pepperoni-2.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-1.webp",
    "/templates/vesuvio-pizza/toppings/mushroom-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-1.webp",
    "/templates/vesuvio-pizza/toppings/basil-2.webp",
    "/templates/vesuvio-pizza/toppings/basil-3.webp",
    "/templates/vesuvio-pizza/toppings/olive-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-1.webp",
    "/templates/vesuvio-pizza/toppings/onion-2.webp",
    "/templates/vesuvio-pizza/trays/tray-mozzarella.webp",
    "/templates/vesuvio-pizza/trays/tray-pepperoni.webp",
    "/templates/vesuvio-pizza/trays/tray-mushrooms.webp",
    "/templates/vesuvio-pizza/trays/tray-basil.webp",
    "/templates/vesuvio-pizza/trays/tray-olives.webp",
    "/templates/vesuvio-pizza/trays/tray-onion.webp",
    "/templates/vesuvio-pizza/hands/hand-open.webp",
    "/templates/vesuvio-pizza/hands/hand-pinch.webp",
    "/templates/vesuvio-pizza/hands/hand-ok.webp",
    "/templates/vesuvio-pizza/hands/hand-point.webp"
  ],
  "template-pull-noodle-pro": ["/videos/pull-noodle.mp4"],
  "template-ferrari-nocturne": ["/videos/ferrari-nocturne.mp4"],
  "template-rose-nocturne": ["/videos/rose-nocturne-atelier.mp4"],
  "template-psyche-obsidian": ["/videos/psyche-obsidian-atelier.mp4"],
  "template-vortex-apex-pro": ["/videos/vortex-apex-obsidian.mp4"],
  "template-aerovoid-obsidian-pro": ["/videos/aerovoid-obsidian-parka.mp4"],
  "template-amarena-royale-pro": ["/videos/amarena-royale-cupcake.mp4"],
  "template-monolith-cacao-pro": ["/videos/monolith-cacao-glaze.mp4"],
  "template-levitas-cryo-pro": ["/videos/levitas-cryo-spheres.mp4"],
  "template-aura-obsidian-pro": ["/videos/aura-obsidian-botanica.mp4"],
  "template-aura-nocturne-pro": ["/videos/aura-nocturne-perfume.mp4"],
  "template-velvet-gelato-pro": ["/videos/velvet-cryo-gelato.mp4"],
  "template-zenith-elixir-pro": ["/videos/zenith-tea-elixir.mp4"],
  "template-chrono-x-pro": ["/videos/chrono-scrub.mp4"],
  "template-aura-sound-pro": ["/videos/headphones-scrub.mp4"]
};
var PRO_TEMPLATES = [
  { id: "template-nexore-case-pro", slug: "nexore-case", title: "NEXORE CASE \u2014 Custom Phone Case Builder" },
  { id: "template-vesuvio-pizza-pro", slug: "vesuvio-pizza", title: "VESUVIO \u2014 Woodfired Artisanal Pizza Studio" },
  { id: "template-pull-noodle-pro", slug: "pull-noodle", title: "PULL \u2014 Hand-Pulled Noodle Bar" },
  { id: "template-flip-skate-pro", slug: "flip-skate", title: "FLIP \u2014 Skate Shop & Hardware Studio" },
  { id: "template-panda-bakery-pro", slug: "panda-bakery", title: "PANDA \u2014 Artisanal Mochi & Pastry Bakery" },
  { id: "template-capy-spa-pro", slug: "capy-spa", title: "CAPY \u2014 Yuzu Onsen & Botanical Bathhouse" },
  { id: "template-bear-lift-pro", slug: "bear-lift", title: "BEAR LIFT \u2014 Heavy Strength & Barbell Club" },
  { id: "template-burlit-coffee-pro", slug: "burlit-coffee", title: "BURLIT \u2014 Specialty Espresso Roastery" },
  { id: "template-ironpaw-tools-pro", slug: "ironpaw-tools", title: "IRONPAW \u2014 Heavy-Duty Workshop Tools" },
  { id: "template-lamborghini-revuelto-pro", slug: "lamborghini-revuelto", title: "Lamborghini Revuelto \u2014 V12 Hybrid Configurator" },
  { id: "template-stayline-pro", slug: "stayline", title: "STAYLINE \u2014 Architectural Hospitality & Stays" },
  { id: "template-aerovoid-obsidian-pro", slug: "aerovoid-obsidian", title: "Aerovoid Obsidian Technical Parka" },
  { id: "template-vortex-apex-pro", slug: "vortex-apex", title: "Vortex Apex Corse Telemetry" },
  { id: "template-chrono-x-pro", slug: "chrono-x", title: "Chrono X Titanium Horology" },
  { id: "template-ferrari-nocturne", slug: "ferrari-nocturne", title: "Ferrari Nocturne Atelier" },
  { id: "template-aura-sound-pro", slug: "aura-sound", title: "Aura Sound Pro Acoustic Studio" },
  { id: "template-aura-nocturne-pro", slug: "aura-nocturne", title: "Aura Nocturne Parfum" },
  { id: "template-aura-obsidian-pro", slug: "aura-obsidian", title: "Aura Obsidian Botanica" },
  { id: "template-velvet-gelato-pro", slug: "velvet-gelato", title: "Velvet Cryo Gelato" },
  { id: "template-zenith-elixir-pro", slug: "zenith-elixir", title: "Zenith Botanical Elixir" },
  { id: "template-monolith-cacao-pro", slug: "monolith-cacao", title: "Monolith Obsidian Cacao" },
  { id: "template-amarena-royale-pro", slug: "amarena-royale", title: "Amarena Royale Patisserie" },
  { id: "template-levitas-cryo-pro", slug: "levitas-cryo", title: "Levitas Cryo Atelier" },
  { id: "template-rose-nocturne", slug: "rose-nocturne", title: "Rose Nocturne Atelier" },
  { id: "template-psyche-obsidian", slug: "psyche-obsidian", title: "Psyche Obsidian Atelier" },
  { id: "template-vapor-obsidian", slug: "vapor-obsidian", title: "Vapor Obsidian Atelier" },
  { id: "template-vantr-particle", slug: "vantr-particle", title: "Vantr Particle Reveal" },
  { id: "template-portfolio-pro", slug: "portfolio", title: "NexFolio Portfolio Pro" },
  { id: "template-ecommerce-pro", slug: "ecommerce", title: "NexStore E-Commerce Pro" },
  { id: "template-nexcore-admin-pro", slug: "nexcore-admin", title: "NexCore Admin Pro" },
  { id: "template-users-table-pro", slug: "users-table", title: "NexUsers Table Pro" },
  { id: "template-auth-pro", slug: "auth", title: "NexAuth Identity Pro" },
  { id: "template-ai-chat-interface", slug: "ai-chat-interface", title: "AI Chat Interface Pro" },
  { id: "template-swagger-form-builder", slug: "swagger-form-builder", title: "Swagger Form Builder Pro" }
];
var KNOWN_PRO_TEMPLATE_NAMES = new Set(
  PRO_TEMPLATES.flatMap((t) => [t.id, t.slug, `template-${t.slug}`, `${t.slug}-pro`])
);
async function addCommand(components, options = {}) {
  const allRegistryKeys = Object.keys(registry);
  let targetComponents = [...components];
  if (options.all || targetComponents.includes("--all")) {
    targetComponents = allRegistryKeys;
    console.log(`
\x1B[36m\u26A1 Adding all ${targetComponents.length} components from NexoreUI registry...\x1B[0m`);
  }
  if (targetComponents.length === 0) {
    console.error("\x1B[31mError: Please specify components to add or use --all.\x1B[0m");
    console.log("Example: npx nexoreui add button modal table --all");
    return;
  }
  let project = detectProject(process.cwd());
  const hasPackageJson = fs4.existsSync(path4.join(project.baseDir, "package.json"));
  if (!hasPackageJson) {
    try {
      const entries = fs4.readdirSync(process.cwd(), { withFileTypes: true });
      const candidates = entries.filter((d) => d.isDirectory() && !d.name.startsWith(".") && d.name !== "node_modules").map((d) => d.name).filter((dirName) => {
        const subPath = path4.join(process.cwd(), dirName);
        return fs4.existsSync(path4.join(subPath, "nexore.json")) || fs4.existsSync(path4.join(subPath, "package.json"));
      });
      if (candidates.length > 0) {
        const targetCandidate = candidates[0];
        console.warn(`
\x1B[33m\x1B[1m\u26A0\uFE0F  Notice: No package.json found in current directory (${process.cwd()}).\x1B[0m`);
        console.log(`Found a project in subdirectory: \x1B[36m\x1B[1m./${targetCandidate}\x1B[0m
`);
        let shouldNavigate = options.yes;
        if (!options.yes) {
          const ans = await askQuestion(`Would you like to install components inside ./${targetCandidate}? (Y/n): `);
          shouldNavigate = !ans.trim() || ans.trim().toLowerCase() === "y" || ans.trim().toLowerCase() === "yes";
        }
        if (shouldNavigate) {
          console.log(`\x1B[32m\u2714 Switching working directory to ./${targetCandidate}...\x1B[0m
`);
          process.chdir(path4.join(process.cwd(), targetCandidate));
          return addCommand(components, options);
        } else {
          console.error(`\x1B[31mInstallation cancelled. Please change into your project folder first:\x1B[0m`);
          console.log(`  \x1B[36mcd ${targetCandidate}\x1B[0m`);
          console.log(`  \x1B[36mnpx nexoreui add ${components.join(" ")}\x1B[0m
`);
          return;
        }
      }
    } catch {
    }
    console.error(`\x1B[31m\x1B[1mError: No React project (package.json) found in ${process.cwd()}.\x1B[0m`);
    console.error(`Please make sure you are inside your project folder before running \x1B[36mnpx nexoreui add\x1B[0m.
`);
    return;
  }
  console.log(`
\x1B[34mDetected project type:\x1B[0m ${project.projectType.toUpperCase()}`);
  console.log(`\x1B[34mDetected package manager:\x1B[0m ${project.packageManager}
`);
  let customComponentsDir;
  let customUtilsFile;
  try {
    const configPath = path4.join(project.baseDir, "nexore.json");
    if (fs4.existsSync(configPath)) {
      const cfg = JSON.parse(fs4.readFileSync(configPath, "utf8"));
      if (cfg.aliases?.components) {
        customComponentsDir = cfg.aliases.components.replace(/^@\//, project.hasSrcDir ? "src/" : "");
      }
      if (cfg.aliases?.utils) {
        const utilBase = cfg.aliases.utils.replace(/^@\//, project.hasSrcDir ? "src/" : "");
        customUtilsFile = utilBase.endsWith(".ts") || utilBase.endsWith(".js") ? utilBase : `${utilBase}.ts`;
      }
    }
  } catch {
  }
  const componentsToInstall = /* @__PURE__ */ new Set();
  const templatesToInstall = /* @__PURE__ */ new Set();
  const invalidComponents = [];
  const queue = [...targetComponents.filter((c) => c !== "--all")];
  while (queue.length > 0) {
    const compName = queue.shift();
    if (registry[compName]) {
      if (!componentsToInstall.has(compName)) {
        componentsToInstall.add(compName);
        if (registry[compName].componentsDependencies) {
          for (const dep of registry[compName].componentsDependencies) {
            queue.push(dep);
          }
        }
      }
    } else if (compName.startsWith("template-") || compName.endsWith("-pro") || KNOWN_PRO_TEMPLATE_NAMES.has(compName) || TEMPLATE_MEDIA_ASSETS[compName] || TEMPLATE_MEDIA_ASSETS[`template-${compName}`] || TEMPLATE_MEDIA_ASSETS[`template-${compName}-pro`]) {
      templatesToInstall.add(compName);
    } else {
      invalidComponents.push(compName);
    }
  }
  if (invalidComponents.length > 0) {
    console.error(`\x1B[31mError: Component(s) not found in registry: ${invalidComponents.join(", ")}\x1B[0m`);
    console.log("Run \x1B[32mnpx nexoreui list\x1B[0m to see all available components.");
    return;
  }
  const fetchedTemplates = [];
  if (templatesToInstall.size > 0) {
    const config = readStoredConfig();
    let licenseKey = config.licenseKey;
    if (!licenseKey) {
      console.error("\n\x1B[31m\x1B[1mError: NexoreUI Pro license required\x1B[0m");
      console.error(
        `The following item(s) are Pro templates:
  ${Array.from(templatesToInstall).map((t) => `\x1B[33m${t}\x1B[0m`).join(", ")}`
      );
      console.log("\nTo install Pro templates, authenticate with your Pro license key:");
      console.log("  \x1B[36mnpx nexoreui auth <your-license-key>\x1B[0m");
      console.log("\nNeed a Pro license? Get lifetime access at:");
      console.log("  \x1B[36mhttps://nexoreui.site/pricing\x1B[0m\n");
      return;
    }
    const verifyRes = await verifyRemoteLicense(licenseKey);
    if (!verifyRes.valid) {
      console.error(`
\x1B[31m\x1B[1mError: ${verifyRes.error || "Invalid or revoked Pro license key"}\x1B[0m
`);
      return;
    }
    console.log(`\x1B[32m\u2714 Verified Pro license for ${verifyRes.owner || "authorized user"}.\x1B[0m`);
    for (const tName of templatesToInstall) {
      console.log(`\x1B[36m\u23F3 Fetching Pro template from secure registry:\x1B[0m ${tName}...`);
      const tRes = await fetchRemoteTemplate(tName, licenseKey);
      if (!tRes.valid || !tRes.content) {
        console.error(`\x1B[31mError: ${tRes.error || `Could not retrieve template '${tName}'`}\x1B[0m`);
        return;
      }
      fetchedTemplates.push({
        name: tRes.name || tName,
        slug: tRes.slug || tName.replace(/^template-/, ""),
        fileName: tRes.fileName || `${tName}.tsx`,
        content: tRes.content,
        dependencies: tRes.dependencies || ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
        assets: tRes.assets || TEMPLATE_MEDIA_ASSETS[tName] || []
      });
    }
  }
  const defaultComponentsDir = customComponentsDir || (project.hasSrcDir ? "src/components/ui" : "components/ui");
  const defaultUtilsFile = customUtilsFile || (project.hasSrcDir ? "src/lib/utils.ts" : "lib/utils.ts");
  let componentsDirInput = defaultComponentsDir;
  let utilsFileInput = defaultUtilsFile;
  if (!options.yes && !customComponentsDir) {
    const compPrompt = await askQuestion(`Where would you like to install the components? (default: ${defaultComponentsDir}): `);
    componentsDirInput = compPrompt.trim() || defaultComponentsDir;
    const utilsPrompt = await askQuestion(`Where should we create the utilities file (cn helper)? (default: ${defaultUtilsFile}): `);
    utilsFileInput = utilsPrompt.trim() || defaultUtilsFile;
  }
  const absoluteComponentsDir = path4.resolve(project.baseDir, componentsDirInput);
  const absoluteUtilsFile = path4.resolve(project.baseDir, utilsFileInput);
  console.log(`\x1B[33mInstalling components to:\x1B[0m ${absoluteComponentsDir}`);
  console.log(`\x1B[33mUsing cn helper from:\x1B[0m ${absoluteUtilsFile}
`);
  ensureDir(absoluteComponentsDir);
  const didCreateCn = ensureCnUtil(absoluteUtilsFile);
  if (didCreateCn) {
    console.log(`\x1B[32m\u2714 Created utilities file (cn helper) at:\x1B[0m ${utilsFileInput}`);
  }
  const npmDependencies = /* @__PURE__ */ new Set();
  npmDependencies.add("clsx");
  npmDependencies.add("tailwind-merge");
  npmDependencies.add("lucide-react");
  npmDependencies.add("framer-motion");
  npmDependencies.add("class-variance-authority");
  for (const compName of componentsToInstall) {
    const registryItem = registry[compName];
    const targetPath = path4.join(absoluteComponentsDir, registryItem.fileName);
    copyComponentFile(registryItem.content, targetPath, absoluteUtilsFile);
    const displayRelPath = path4.relative(project.baseDir, targetPath).replace(/\\/g, "/");
    console.log(`\x1B[32m\u2714 Added component:\x1B[0m ${compName} -> ${displayRelPath}`);
    registryItem.dependencies.forEach((dep) => npmDependencies.add(dep));
  }
  for (const template of fetchedTemplates) {
    const targetDir = path4.resolve(project.baseDir, project.hasSrcDir ? "src/templates" : "templates");
    ensureDir(targetDir);
    const targetPath = path4.join(targetDir, template.fileName);
    copyComponentFile(template.content, targetPath, absoluteUtilsFile);
    const displayRelPath = path4.relative(project.baseDir, targetPath).replace(/\\/g, "/");
    console.log(`\x1B[32m\u2714 Added Pro template:\x1B[0m ${template.name} -> ${displayRelPath}`);
    if (template.assets && template.assets.length > 0) {
      for (const assetPath of template.assets) {
        const destPath = path4.join(project.baseDir, "public", assetPath.replace(/^\//, ""));
        if (!fs4.existsSync(destPath)) {
          try {
            ensureDir(path4.dirname(destPath));
            const assetUrl = `https://nexoreui.site${assetPath}`;
            console.log(`\x1B[36m\u23F3 Downloading media asset:\x1B[0m ${assetPath}...`);
            const res = await fetch(assetUrl);
            if (res.ok) {
              const arrayBuffer = await res.arrayBuffer();
              fs4.writeFileSync(destPath, Buffer.from(arrayBuffer));
              console.log(`\x1B[32m\u2714 Downloaded asset:\x1B[0m public${assetPath}`);
            }
          } catch {
          }
        }
      }
    }
    template.dependencies.forEach((dep) => npmDependencies.add(dep));
  }
  const depsArray = Array.from(npmDependencies);
  let depsToInstall = [...depsArray];
  try {
    const packageJsonPath = path4.join(project.baseDir, "package.json");
    if (fs4.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs4.readFileSync(packageJsonPath, "utf8"));
      const existingDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      depsToInstall = depsArray.filter((dep) => !existingDeps[dep]);
    }
  } catch {
  }
  if (depsToInstall.length > 0) {
    console.log(`
\x1B[33mInstalling external dependencies:\x1B[0m ${depsToInstall.join(", ")}...`);
    let installCmd = "npm install --legacy-peer-deps";
    if (project.packageManager === "pnpm") installCmd = "pnpm add";
    else if (project.packageManager === "yarn") installCmd = "yarn add";
    else if (project.packageManager === "bun") installCmd = "bun add";
    try {
      (0, import_child_process.execSync)(`${installCmd} ${depsToInstall.join(" ")}`, {
        stdio: "inherit",
        cwd: project.baseDir
      });
      console.log("\x1B[32m\u2714 Dependencies installed successfully!\x1B[0m");
    } catch {
      console.error("\x1B[31mFailed to install dependencies automatically. Please run:\x1B[0m");
      console.log(`  ${installCmd} ${depsToInstall.join(" ")}`);
    }
  }
  const totalCount = componentsToInstall.size + fetchedTemplates.length;
  console.log(`
\x1B[32m\x1B[1m\u{1F389} Done! ${totalCount} NexoreUI item(s) ready to use.\x1B[0m
`);
}

// src/commands/list.ts
function listCommand() {
  console.log("\n\x1B[34m\x1B[1m=== Available NexoreUI Components ===\x1B[0m\n");
  Object.keys(registry).forEach((name) => {
    const item = registry[name];
    console.log(`- \x1B[32m\x1B[1m${name}\x1B[0m (${item.fileName})`);
    if (item.dependencies.length > 0) {
      console.log(`  \x1B[90mDependencies: ${item.dependencies.join(", ")}\x1B[0m`);
    }
    if (item.componentsDependencies && item.componentsDependencies.length > 0) {
      console.log(`  \x1B[33mRequires component: ${item.componentsDependencies.join(", ")}\x1B[0m`);
    }
    console.log("");
  });
  console.log("\n\x1B[35m\x1B[1m=== Available NexoreUI Pro Templates (Requires Pro License) ===\x1B[0m\n");
  PRO_TEMPLATES.forEach((tpl) => {
    console.log(`- \x1B[36m\x1B[1m${tpl.id}\x1B[0m (\x1B[90malias: ${tpl.slug}\x1B[0m) \u2014 ${tpl.title}`);
  });
  console.log("");
}

// src/commands/init.ts
var fs6 = __toESM(require("fs"));
var path6 = __toESM(require("path"));
var readline2 = __toESM(require("readline"));

// src/utils/config.ts
var fs5 = __toESM(require("fs"));
var path5 = __toESM(require("path"));
var import_child_process2 = require("child_process");
var THEME_PALETTES = {
  zinc: { light: "hsl(240 5.9% 10%)", dark: "hsl(0 0% 98%)", rgb: "24 24 27" },
  indigo: { light: "hsl(250 85% 50%)", dark: "hsl(250 85% 65%)", rgb: "99 60 220" },
  violet: { light: "hsl(262.1 83.3% 57.8%)", dark: "hsl(263.4 70% 50.4%)", rgb: "139 92 246" },
  emerald: { light: "hsl(142.1 76.2% 36.3%)", dark: "hsl(142.1 70.6% 45.3%)", rgb: "16 185 129" },
  rose: { light: "hsl(346.8 77.2% 49.8%)", dark: "hsl(346.8 77.2% 55%)", rgb: "244 63 94" },
  amber: { light: "hsl(37.7 92.1% 50.2%)", dark: "hsl(37.7 92.1% 55%)", rgb: "245 158 11" },
  orange: { light: "hsl(24.6 95% 53.1%)", dark: "hsl(24.6 95% 58%)", rgb: "249 115 22" },
  cyan: { light: "hsl(190.4 95% 39%)", dark: "hsl(188.7 94.5% 42.7%)", rgb: "6 182 212" },
  sky: { light: "hsl(198.6 88.7% 48.4%)", dark: "hsl(198.6 88.7% 55%)", rgb: "14 165 233" },
  slate: { light: "hsl(240 5.9% 10%)", dark: "hsl(0 0% 98%)", rgb: "244 244 245" },
  neon: { light: "hsl(173 80% 40%)", dark: "hsl(173 100% 50%)", rgb: "0 255 220" },
  crimson: { light: "hsl(0 72% 51%)", dark: "hsl(0 84% 60%)", rgb: "220 38 38" }
};
function stripJsonComments(str) {
  return str.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^\\:])\/\/.*$/gm, "$1");
}
function ensurePathAlias(baseDir, projectType, hasSrcDir) {
  let updated = false;
  const configsToCheck = [
    path5.join(baseDir, "tsconfig.app.json"),
    path5.join(baseDir, "tsconfig.json"),
    path5.join(baseDir, "jsconfig.json")
  ];
  for (const targetConfig of configsToCheck) {
    if (fs5.existsSync(targetConfig)) {
      try {
        const content = fs5.readFileSync(targetConfig, "utf8");
        const cleanContent = stripJsonComments(content);
        const parsed = JSON.parse(cleanContent);
        parsed.compilerOptions = parsed.compilerOptions || {};
        if (!parsed.compilerOptions.moduleResolution || parsed.compilerOptions.moduleResolution !== "bundler") {
          parsed.compilerOptions.baseUrl = parsed.compilerOptions.baseUrl || ".";
        }
        parsed.compilerOptions.paths = parsed.compilerOptions.paths || {};
        const aliasTarget = hasSrcDir ? ["./src/*"] : ["./*"];
        if (!parsed.compilerOptions.paths["@/*"]) {
          parsed.compilerOptions.paths["@/*"] = aliasTarget;
          fs5.writeFileSync(targetConfig, JSON.stringify(parsed, null, 2), "utf8");
          updated = true;
        }
      } catch {
      }
    }
  }
  if (projectType === "vite") {
    const viteConfigFiles = ["vite.config.ts", "vite.config.js", "vite.config.mjs"];
    for (const fileName of viteConfigFiles) {
      const vitePath = path5.join(baseDir, fileName);
      if (fs5.existsSync(vitePath)) {
        let viteContent = fs5.readFileSync(vitePath, "utf8");
        if (!viteContent.includes("alias") && !viteContent.includes("'@'")) {
          const hasPathImport = viteContent.includes("from 'path'") || viteContent.includes('from "path"');
          let headerAdditions = "";
          if (!hasPathImport) {
            headerAdditions += `import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
`;
          }
          if (viteContent.includes("defineConfig({")) {
            viteContent = headerAdditions + viteContent.replace(
              "defineConfig({",
              `defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './${hasSrcDir ? "src" : "."}'),
    },
  },`
            );
            fs5.writeFileSync(vitePath, viteContent, "utf8");
            updated = true;
          }
        }
        if (!viteContent.includes("@tailwindcss/vite")) {
          let updatedVite = `import tailwindcss from '@tailwindcss/vite'
` + viteContent;
          if (updatedVite.includes("plugins: [")) {
            updatedVite = updatedVite.replace(/plugins:\s*\[/, "plugins: [tailwindcss(), ");
            fs5.writeFileSync(vitePath, updatedVite, "utf8");
            updated = true;
          }
        }
        break;
      }
    }
  }
  return updated;
}
function injectThemeCss(baseDir, cssRelativePath, themeName, radiusValue, fontFamily = "system", density = "default", animationStyle = "energetic") {
  const cssAbsolutePath = path5.join(baseDir, cssRelativePath);
  const palette = THEME_PALETTES[themeName] || THEME_PALETTES.zinc;
  const radius = typeof radiusValue === "number" ? radiusValue : radiusValue !== void 0 && !isNaN(parseFloat(radiusValue)) ? parseFloat(radiusValue) : 0.625;
  const fontMap = {
    geist: "'Geist', sans-serif",
    inter: "'Inter', sans-serif",
    jetbrains: "'Geist Mono', 'JetBrains Mono', monospace",
    system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  };
  const selectedFont = fontMap[fontFamily] || fontMap.geist;
  const densityPadding = density === "compact" ? "0.5rem" : density === "relaxed" ? "1.25rem" : "0.75rem";
  const densityGap = density === "compact" ? "0.375rem" : density === "relaxed" ? "1rem" : "0.5rem";
  let animationCss = "";
  if (animationStyle === "none") {
    animationCss = `
/* NexoreUI Animation Style: None */
:root {
  --motion-ease: linear;
  --motion-duration: 0s;
}
button, a, input, select, textarea, [role="button"], [class*="card"] {
  transition-duration: 0s !important;
  transform: none !important;
}
`;
  } else if (animationStyle === "subtle") {
    animationCss = `
/* NexoreUI Animation Style: Subtle */
:root {
  --motion-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-duration: 0.35s;
}
`;
  } else {
    animationCss = `
/* NexoreUI Animation Style: Energetic */
:root {
  --motion-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
  --motion-duration: 0.2s;
}
`;
  }
  const themeBlock = `/* NexoreUI Theme Tokens */
@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-3xl: max(0rem, calc(var(--radius) * 2));
  --radius-2xl: max(0rem, calc(var(--radius) * 1.5));
  --radius-xl: max(0rem, calc(var(--radius) * 1.25));
  --radius-lg: var(--radius);
  --radius-md: max(0rem, calc(var(--radius) - 2px));
  --radius-sm: max(0rem, calc(var(--radius) - 4px));
  --radius: var(--radius);
  --font-sans: ${selectedFont};
}

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 3.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 3.9%);
  --primary: ${palette.light};
  --primary-foreground: ${themeName === "zinc" ? "hsl(0 0% 98%)" : "hsl(0 0% 100%)"};
  --secondary: hsl(240 4.8% 95.9%);
  --secondary-foreground: hsl(240 5.9% 10%);
  --muted: hsl(240 4.8% 95.9%);
  --muted-foreground: hsl(240 3.8% 46.1%);
  --accent: hsl(240 4.8% 95.9%);
  --accent-foreground: hsl(240 5.9% 10%);
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(240 5.9% 90%);
  --input: hsl(240 5.9% 90%);
  --ring: ${themeName === "zinc" ? "hsl(240 10% 3.9%)" : palette.light};
  --primary-rgb: ${palette.rgb};
  --glow-radius: 0px;
  --glow-strength: 0;
  --glow-color: ${palette.rgb};
  --radius: ${radius}rem;
  --success: hsl(142 71% 36%);
  --success-foreground: hsl(0 0% 100%);
  --warning: hsl(32 95% 44%);
  --warning-foreground: hsl(0 0% 100%);
  --info: hsl(221 83% 53%);
  --info-foreground: hsl(0 0% 100%);
  --chart-1: hsl(240 5.9% 10%);
  --chart-2: hsl(240 4% 30%);
  --chart-3: hsl(240 3.8% 46%);
  --chart-4: hsl(240 5% 65%);
  --chart-5: hsl(240 5.9% 80%);
  --density-padding: ${densityPadding};
  --density-gap: ${densityGap};
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(240 10% 3.9%);
  --card-foreground: hsl(0 0% 98%);
  --popover: hsl(240 10% 3.9%);
  --popover-foreground: hsl(0 0% 98%);
  --primary: ${palette.dark};
  --primary-foreground: ${themeName === "zinc" ? "hsl(240 5.9% 10%)" : "hsl(0 0% 100%)"};
  --secondary: hsl(240 3.7% 15.9%);
  --secondary-foreground: hsl(0 0% 98%);
  --muted: hsl(240 3.7% 15.9%);
  --muted-foreground: hsl(240 5% 64.9%);
  --accent: hsl(240 3.7% 15.9%);
  --accent-foreground: hsl(0 0% 98%);
  --destructive: hsl(0 62.8% 30.6%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(240 3.7% 15.9%);
  --input: hsl(240 3.7% 15.9%);
  --ring: ${themeName === "zinc" ? "hsl(240 4.9% 83.9%)" : palette.dark};
  --primary-rgb: ${palette.rgb === "24 24 27" ? "250 250 250" : palette.rgb};
  --glow-radius: 0px;
  --glow-strength: 0;
  --glow-color: ${palette.rgb};
  --radius: ${radius}rem;
  --success: hsl(142 69% 58%);
  --success-foreground: hsl(240 10% 3.9%);
  --warning: hsl(43 96% 56%);
  --warning-foreground: hsl(240 10% 3.9%);
  --info: hsl(213 94% 68%);
  --info-foreground: hsl(240 10% 3.9%);
  --chart-1: hsl(0 0% 98%);
  --chart-2: hsl(240 5% 80%);
  --chart-3: hsl(240 5% 64.9%);
  --chart-4: hsl(240 4% 46%);
  --chart-5: hsl(240 3.7% 30%);
  --density-padding: ${densityPadding};
  --density-gap: ${densityGap};
}

html, body {
  font-family: var(--font-sans);
  background-color: var(--background);
  color: var(--foreground);
}
${animationCss}
/* End NexoreUI Theme Tokens */`;
  const cleanFullCss = `@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

${themeBlock}
`;
  const cssDir = path5.dirname(cssAbsolutePath);
  if (!fs5.existsSync(cssDir)) fs5.mkdirSync(cssDir, { recursive: true });
  fs5.writeFileSync(cssAbsolutePath, cleanFullCss, "utf8");
  return true;
}
function installPeerDependencies(baseDir, packageManager, dependencies = ["clsx", "tailwind-merge", "lucide-react", "framer-motion", "class-variance-authority"]) {
  try {
    const packageJsonPath = path5.join(baseDir, "package.json");
    let missingDeps = [...dependencies];
    if (fs5.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs5.readFileSync(packageJsonPath, "utf8"));
      const installed = { ...pkg.dependencies, ...pkg.devDependencies };
      missingDeps = dependencies.filter((dep) => !installed[dep]);
    }
    if (missingDeps.length === 0) return true;
    let installCmd = "npm install --legacy-peer-deps";
    if (packageManager === "pnpm") installCmd = "pnpm add";
    else if (packageManager === "yarn") installCmd = "yarn add";
    else if (packageManager === "bun") installCmd = "bun add";
    console.log(`
\x1B[33m\u26A1 Installing peer dependencies:\x1B[0m ${missingDeps.join(", ")}...`);
    (0, import_child_process2.execSync)(`${installCmd} ${missingDeps.join(" ")}`, {
      stdio: "inherit",
      cwd: baseDir
    });
    return true;
  } catch (err) {
    console.warn("\x1B[33mWarning: Automatic peer dependency installation skipped.\x1B[0m");
    return false;
  }
}

// src/commands/init.ts
function askQuestion2(query) {
  const rl = readline2.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(
    (resolve4) => rl.question(query, (ans) => {
      rl.close();
      resolve4(ans);
    })
  );
}
async function initCommand(options = {}) {
  console.log(`
\x1B[36m\x1B[1m=== Initializing NexoreUI in your project ===\x1B[0m
`);
  const project = detectProject(process.cwd());
  console.log(`\x1B[32m\u2714 Detected Project:\x1B[0m ${project.projectType.toUpperCase()} (${project.packageManager})`);
  let theme = options.theme || "zinc";
  let radius = options.radius || "0.625";
  let font = options.font || "geist";
  let density = options.density || "default";
  let animation = options.animation || "energetic";
  let mode = options.mode || "dark";
  const defaultComponentsDir = project.hasSrcDir ? "src/components/ui" : "components/ui";
  const defaultUtilsFile = project.hasSrcDir ? "src/lib/utils.ts" : "lib/utils.ts";
  const defaultCssFile = project.projectType === "next" ? project.hasSrcDir ? "src/app/globals.css" : "app/globals.css" : project.hasSrcDir ? "src/index.css" : "src/index.css";
  let componentsDir = defaultComponentsDir;
  let utilsFile = defaultUtilsFile;
  if (!options.yes) {
    if (!options.theme) {
      const themeAns = await askQuestion2(`Which color theme would you like to use? (zinc, cyan, indigo, violet, emerald, rose, amber, orange, slate, neon) [default: zinc]: `);
      if (themeAns.trim() && THEME_PALETTES[themeAns.trim().toLowerCase()]) {
        theme = themeAns.trim().toLowerCase();
      }
    }
    if (!options.radius) {
      const radiusAns = await askQuestion2(`Which radius value would you like to use? (0, 0.3, 0.5, 0.625, 0.75, 1.0) [default: 0.625]: `);
      if (radiusAns.trim()) {
        radius = radiusAns.trim();
      }
    }
    const compAns = await askQuestion2(`Where should UI components be created? (default: ${defaultComponentsDir}): `);
    if (compAns.trim()) componentsDir = compAns.trim();
    const utilsAns = await askQuestion2(`Where should utility functions (cn helper) be placed? (default: ${defaultUtilsFile}): `);
    if (utilsAns.trim()) utilsFile = utilsAns.trim();
  }
  const absoluteComponentsDir = path6.resolve(project.baseDir, componentsDir);
  const absoluteUtilsFile = path6.resolve(project.baseDir, utilsFile);
  ensureDir(absoluteComponentsDir);
  ensureCnUtil(absoluteUtilsFile);
  const didUpdateAlias = ensurePathAlias(project.baseDir, project.projectType, project.hasSrcDir);
  if (didUpdateAlias) {
    console.log(`\x1B[32m\u2714\x1B[0m Configured path alias \x1B[1m'@/*'\x1B[0m in project config`);
  }
  const didInjectCss = injectThemeCss(project.baseDir, defaultCssFile, theme, radius, font, density, animation);
  if (didInjectCss) {
    console.log(`\x1B[32m\u2714\x1B[0m Injected Tailwind CSS v4 @theme tokens into \x1B[1m${defaultCssFile}\x1B[0m`);
  }
  const indexHtmlPath = path6.join(project.baseDir, "index.html");
  if (fs6.existsSync(indexHtmlPath)) {
    try {
      let html = fs6.readFileSync(indexHtmlPath, "utf8");
      if (mode === "dark" && !html.includes('class="dark"')) {
        html = html.replace(/<html(\s+[^>]*)?>/i, (match) => {
          if (match.includes('class="')) {
            return match.replace('class="', 'class="dark ');
          }
          return match.replace("<html", '<html class="dark"');
        });
      }
      if (!html.includes("fonts.googleapis.com")) {
        const fontLinks = `    <!-- NexoreUI Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">
  </head>`;
        html = html.replace("</head>", fontLinks);
      }
      fs6.writeFileSync(indexHtmlPath, html, "utf8");
    } catch {
    }
  }
  installPeerDependencies(project.baseDir, project.packageManager);
  const config = {
    $schema: "https://nexoreui.site/schema.json",
    style: "default",
    theme,
    radius: Number(radius),
    framework: project.projectType,
    packageManager: project.packageManager,
    font,
    density,
    animation,
    defaultMode: mode,
    tailwind: {
      css: defaultCssFile,
      baseColor: "zinc",
      cssVariables: true
    },
    aliases: {
      components: `@/${componentsDir.replace(/^src\//, "")}`,
      utils: `@/${utilsFile.replace(/^src\//, "").replace(/\.(ts|js)$/, "")}`
    }
  };
  const configPath = path6.join(project.baseDir, "nexore.json");
  fs6.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
  console.log(`\x1B[32m\u2714\x1B[0m Generated \x1B[1mnexore.json\x1B[0m (Theme: ${theme}, Radius: ${radius}rem)`);
  console.log(`\x1B[32m\u2714\x1B[0m Utilities ready at \x1B[1m${utilsFile}\x1B[0m`);
  console.log(`\x1B[32m\u2714\x1B[0m Components directory ready at \x1B[1m${componentsDir}\x1B[0m`);
  console.log(`
\x1B[32m\x1B[1mNexoreUI initialized successfully! You can now add components:\x1B[0m`);
  console.log(`  \x1B[36mnpx nexoreui add button card modal table --all\x1B[0m
`);
}

// src/commands/create.ts
var fs7 = __toESM(require("fs"));
var path7 = __toESM(require("path"));
var import_child_process3 = require("child_process");
var VALID_FRAMEWORKS = [
  "vite",
  "next",
  "next-app",
  "next-pages",
  "remix",
  "astro",
  "turbo",
  "monorepo"
];
async function createCommand(projectName, options = {}) {
  const rawName = projectName || "my-nexore-app";
  const name = rawName.trim().replace(/[^a-zA-Z0-9._-]/g, "-").replace(/^-+|-+$/g, "") || "my-nexore-app";
  const rawFramework = (options.framework || options.template || "vite").toLowerCase();
  if (!VALID_FRAMEWORKS.includes(rawFramework)) {
    console.error(
      `\x1B[31mError: Unsupported framework "${rawFramework}". Valid frameworks: vite, next, remix, astro, turbo\x1B[0m`
    );
    return;
  }
  const framework = rawFramework;
  const targetDir = path7.resolve(process.cwd(), name);
  console.log(`
\x1B[36m\x1B[1mCreating a new NexoreUI Project:\x1B[0m \x1B[32m${name}\x1B[0m (${framework})
`);
  if (fs7.existsSync(targetDir) && fs7.readdirSync(targetDir).length > 0) {
    console.error(`\x1B[31mError: Target directory ${name} already exists and is not empty.\x1B[0m`);
    return;
  }
  console.log(`\x1B[33mStep 1/4: Scaffolding project with ${framework}...\x1B[0m`);
  try {
    if (framework === "next" || framework === "next-app" || framework === "next-pages") {
      (0, import_child_process3.execSync)(`npx -y create-next-app@latest ${name} --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --yes`, {
        stdio: "inherit"
      });
    } else if (framework === "astro") {
      (0, import_child_process3.execSync)(`npx -y create-astro@latest ${name} --template minimal --no-install --no-git --typescript strict`, {
        stdio: "inherit"
      });
    } else if (framework === "remix") {
      (0, import_child_process3.execSync)(`npx -y create-remix@latest ${name} --template remix-run/remix/templates/remix --typescript --no-install`, {
        stdio: "inherit"
      });
    } else if (framework === "turbo" || framework === "monorepo") {
      (0, import_child_process3.execSync)(`npx -y create-turbo@latest ${name} --example basic --no-deps`, {
        stdio: "inherit"
      });
    } else {
      (0, import_child_process3.execSync)(`npx -y create-vite@latest ${name} --template react-ts --no-immediate --no-interactive`, {
        stdio: "inherit"
      });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`\x1B[31mFailed to scaffold ${framework} project: ${errorMsg}\x1B[0m`);
    return;
  }
  process.chdir(targetDir);
  console.log(`
\x1B[33mStep 2/4: Installing NexoreUI core packages and icons...\x1B[0m`);
  try {
    if (framework === "vite") {
      (0, import_child_process3.execSync)(`npm install --legacy-peer-deps lucide-react clsx tailwind-merge framer-motion class-variance-authority @tailwindcss/vite tailwindcss`, {
        stdio: "inherit"
      });
      (0, import_child_process3.execSync)(`npm install -D --legacy-peer-deps @types/node`, { stdio: "inherit" });
    } else if (framework === "astro") {
      (0, import_child_process3.execSync)(`npm install --legacy-peer-deps @astrojs/react @astrojs/tailwind lucide-react clsx tailwind-merge framer-motion class-variance-authority tailwindcss`, {
        stdio: "inherit"
      });
    } else {
      (0, import_child_process3.execSync)(`npm install --legacy-peer-deps lucide-react clsx tailwind-merge framer-motion class-variance-authority`, {
        stdio: "inherit"
      });
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`\x1B[33mWarning during dependency installation: ${errorMsg}\x1B[0m`);
  }
  console.log(`
\x1B[33mStep 3/4: Configuring theme and design tokens...\x1B[0m`);
  await initCommand({
    yes: true,
    theme: options.theme || "slate",
    radius: options.radius || "0.625",
    font: options.font || "geist",
    density: options.density,
    animation: options.animation,
    mode: options.mode
  });
  console.log(`
\x1B[33mStep 4/4: Adding starter UI components (button, card)...\x1B[0m`);
  try {
    await addCommand(["button", "card"], { yes: true });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`\x1B[33mNotice: Could not automatically pre-install button and card (${errorMsg}). You can run "npx nexoreui add button card" manually.\x1B[0m`);
  }
  if (framework === "vite") {
    const appTsxPath = path7.join(targetDir, "src", "App.tsx");
    const isNoAnim = options.animation === "none";
    const starterAppCode = `import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Terminal, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 transition-colors selection:bg-primary/20">
      <div className="max-w-xl w-full space-y-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <Layers className="h-3.5 w-3.5" />
          <span>NexoreUI + Tailwind CSS v4</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Welcome to <span className="text-primary">NexoreUI</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Your project is fully configured with design tokens and modern components.
          </p>
        </div>

        <Card ${isNoAnim ? 'hover="none" animate={false} ' : ""}className="max-w-md mx-auto text-left shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Interactive Component Demo
            </CardTitle>
            <CardDescription className="text-xs">
              Click the button to test component state and styling.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50 border border-border">
              <span className="text-xs font-medium">Click Counter</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-sm bg-primary/15 text-primary">
                {count} clicks
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button ${isNoAnim ? "animate={false} " : ""}onClick={() => setCount((c) => c + 1)} className="flex-1">
                Increment Count
              </Button>
              <Button ${isNoAnim ? "animate={false} " : ""}variant="outline" onClick={() => setCount(0)}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="p-3.5 rounded-md bg-muted/40 border border-border text-xs text-muted-foreground font-mono inline-flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary shrink-0" />
          <span>npx nexoreui add --all</span>
        </div>
      </div>
    </main>
  );
}
`;
    try {
      fs7.writeFileSync(appTsxPath, starterAppCode, "utf8");
    } catch {
    }
    const appCssPath = path7.join(targetDir, "src", "App.css");
    if (fs7.existsSync(appCssPath)) {
      try {
        fs7.writeFileSync(appCssPath, "/* NexoreUI styles loaded from src/index.css */\n", "utf8");
      } catch {
      }
    }
  }
  console.log(`
\x1B[32m\x1B[1mProject ${name} is ready with NexoreUI!\x1B[0m
`);
  console.log(`To get started:`);
  console.log(`  \x1B[36mcd ${name}\x1B[0m`);
  console.log(`  \x1B[36mnpm run dev\x1B[0m
`);
  console.log(`To install components:`);
  console.log(`  \x1B[36mnpx nexoreui add --all\x1B[0m
`);
}

// src/commands/auth.ts
var readline3 = __toESM(require("readline"));
function askQuestion3(query) {
  const rl = readline3.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(
    (resolve4) => rl.question(query, (ans) => {
      rl.close();
      resolve4(ans);
    })
  );
}
async function authCommand(keyArgument, options = {}) {
  const config = readStoredConfig();
  if (options.logout) {
    saveStoredConfig({});
    console.log("\x1B[32m\u2714 Logged out successfully. Stored NexoreUI Pro license removed.\x1B[0m");
    return;
  }
  if (options.status || keyArgument === "--status") {
    if (!config.licenseKey) {
      console.log("\x1B[33mNo NexoreUI Pro license found on this machine.\x1B[0m");
      console.log("Authenticate by running: \x1B[36mnpx nexoreui auth <your-license-key>\x1B[0m");
      console.log("Get a license at: \x1B[36mhttps://nexoreui.site/pricing\x1B[0m\n");
      return;
    }
    console.log("\n\x1B[34m\x1B[1m=== NexoreUI Pro License Status ===\x1B[0m");
    console.log(`\x1B[32mLicense Key:\x1B[0m    ${config.licenseKey}`);
    if (config.ownerEmail) {
      console.log(`\x1B[32mOwner Email:\x1B[0m    ${config.ownerEmail}`);
    }
    if (config.authenticatedAt) {
      console.log(`\x1B[32mLast Verified:\x1B[0m  ${new Date(config.authenticatedAt).toLocaleString()}`);
    }
    console.log("\x1B[32mStatus:\x1B[0m         Active and verified\n");
    return;
  }
  let key = keyArgument?.trim();
  if (!key && config.licenseKey) {
    console.log(`
\x1B[32m\u2714 Currently authenticated with key:\x1B[0m ${config.licenseKey}`);
    if (config.ownerEmail) {
      console.log(`\x1B[90mRegistered to: ${config.ownerEmail}\x1B[0m`);
    }
    const answer = await askQuestion3("\nWould you like to replace your current license key? (y/N): ");
    if (answer.trim().toLowerCase() !== "y" && answer.trim().toLowerCase() !== "yes") {
      console.log("\x1B[90mKeeping existing license.\x1B[0m\n");
      return;
    }
  }
  if (!key) {
    const input2 = await askQuestion3("\nEnter your NexoreUI Pro license key (NX-PRO-XXXXXX-XXXXXX-XXXXXX): ");
    key = input2.trim();
  }
  if (!key) {
    console.error("\n\x1B[31mError: License key cannot be empty.\x1B[0m");
    console.log("You can purchase a NexoreUI Pro license at: \x1B[36mhttps://nexoreui.site/pricing\x1B[0m\n");
    return;
  }
  console.log("\n\x1B[33mVerifying license key...\x1B[0m");
  const result = await verifyRemoteLicense(key);
  if (!result.valid) {
    console.error(`
\x1B[31m\u2716 License verification failed:\x1B[0m ${result.error || "Invalid license key."}`);
    console.log("Please ensure your key matches the format NX-PRO-XXXXXX-XXXXXX-XXXXXX.");
    console.log("Need assistance? Contact support at: \x1B[36mnexoreuiteam@mail.ru\x1B[0m\n");
    return;
  }
  const cleanKey = key.toUpperCase();
  saveStoredConfig({
    licenseKey: cleanKey,
    ownerEmail: result.owner,
    authenticatedAt: Date.now()
  });
  console.log("\n\x1B[32m\x1B[1m\u2714 NexoreUI Pro license activated successfully!\x1B[0m");
  if (result.owner) {
    console.log(`\x1B[34mOwner:\x1B[0m   ${result.owner}`);
  }
  console.log(`\x1B[34mTier:\x1B[0m    ${result.tier || "NexoreUI Pro Lifetime"}`);
  if (result.activationsCount !== void 0 && result.maxDevices !== void 0) {
    console.log(`\x1B[34mDevices:\x1B[0m ${result.activationsCount}/${result.maxDevices} active machine slots used`);
  }
  console.log("\x1B[90mAll Pro templates and assets are now unlocked in the CLI.\x1B[0m\n");
}

// src/index.ts
async function main() {
  const args = process.argv.slice(2);
  const command2 = args[0];
  if (!command2 || command2 === "-h" || command2 === "--help") {
    printHelp();
    return;
  }
  if (command2 === "create") {
    let projectName;
    let framework;
    let theme;
    let radius;
    let font;
    let density;
    let animation;
    let mode;
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if ((arg === "--framework" || arg === "--template") && args[i + 1]) {
        framework = args[++i];
      } else if (arg.startsWith("--framework=")) {
        framework = arg.split("=")[1];
      } else if (arg.startsWith("--template=")) {
        framework = arg.split("=")[1];
      } else if (arg === "--theme" && args[i + 1]) {
        theme = args[++i];
      } else if (arg.startsWith("--theme=")) {
        theme = arg.split("=")[1];
      } else if (arg === "--radius" && args[i + 1]) {
        radius = args[++i];
      } else if (arg.startsWith("--radius=")) {
        radius = arg.split("=")[1];
      } else if (arg === "--font" && args[i + 1]) {
        font = args[++i];
      } else if (arg.startsWith("--font=")) {
        font = arg.split("=")[1];
      } else if (arg === "--density" && args[i + 1]) {
        density = args[++i];
      } else if (arg.startsWith("--density=")) {
        density = arg.split("=")[1];
      } else if (arg === "--animation" && args[i + 1]) {
        animation = args[++i];
      } else if (arg.startsWith("--animation=")) {
        animation = arg.split("=")[1];
      } else if (arg === "--mode" && args[i + 1]) {
        mode = args[++i];
      } else if (arg.startsWith("--mode=")) {
        mode = arg.split("=")[1];
      } else if (!arg.startsWith("-") && !projectName) {
        projectName = arg;
      }
    }
    await createCommand(projectName, { framework, theme, radius, font, density, animation, mode });
  } else if (command2 === "init") {
    let yes = false;
    let theme;
    let radius;
    let font;
    let density;
    let animation;
    let mode;
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === "-y" || arg === "--yes") {
        yes = true;
      } else if (arg === "--theme" && args[i + 1]) {
        theme = args[++i];
      } else if (arg.startsWith("--theme=")) {
        theme = arg.split("=")[1];
      } else if (arg === "--radius" && args[i + 1]) {
        radius = args[++i];
      } else if (arg.startsWith("--radius=")) {
        radius = arg.split("=")[1];
      } else if (arg === "--font" && args[i + 1]) {
        font = args[++i];
      } else if (arg.startsWith("--font=")) {
        font = arg.split("=")[1];
      } else if (arg === "--density" && args[i + 1]) {
        density = args[++i];
      } else if (arg.startsWith("--density=")) {
        density = arg.split("=")[1];
      } else if (arg === "--animation" && args[i + 1]) {
        animation = args[++i];
      } else if (arg.startsWith("--animation=")) {
        animation = arg.split("=")[1];
      } else if (arg === "--mode" && args[i + 1]) {
        mode = args[++i];
      } else if (arg.startsWith("--mode=")) {
        mode = arg.split("=")[1];
      }
    }
    await initCommand({ yes, theme, radius, font, density, animation, mode });
  } else if (command2 === "list") {
    listCommand();
  } else if (command2 === "add") {
    const components = [];
    let yes = false;
    let all = false;
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === "-y" || arg === "--yes") {
        yes = true;
      } else if (arg === "--all" || arg === "-a") {
        all = true;
      } else if (!arg.startsWith("-")) {
        components.push(arg);
      }
    }
    await addCommand(components, { yes, all });
  } else if (command2 === "auth" || command2 === "login") {
    let key;
    let status = false;
    let logout = false;
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === "--status" || arg === "-s") {
        status = true;
      } else if (arg === "--logout") {
        logout = true;
      } else if (!arg.startsWith("-") && !key) {
        key = arg;
      }
    }
    await authCommand(key, { status, logout });
  } else {
    console.error(`\x1B[31mUnknown command: ${command2}\x1B[0m`);
    printHelp();
  }
}
function printHelp() {
  console.log(`
\x1B[36m\x1B[1mNexoreUI CLI\x1B[0m
\x1B[90mModern, animated, production-ready React components with Tailwind CSS v4\x1B[0m

Usage:
  npx nexoreui [command] [options]

Commands:
  \x1B[32mcreate [name]\x1B[0m        Create a new fully configured NexoreUI starter project
  \x1B[32minit\x1B[0m                 Initialize NexoreUI in your project (configure theme, aliases, and CSS)
  \x1B[32madd [components...]\x1B[0m  Add components to your project (use --all to install all 60+ components)
  \x1B[32mauth [key]\x1B[0m           Authenticate your NexoreUI Pro license key (--status, --logout)
  \x1B[32mlist\x1B[0m                 List all available components in registry

Options:
  \x1B[33m--theme <name>\x1B[0m       Set color palette (cyan, indigo, violet, emerald, rose, amber, orange, slate, neon)
  \x1B[33m--radius <val>\x1B[0m       Set border radius (0, 0.3, 0.5, 0.75, 1.0)
  \x1B[33m--font <name>\x1B[0m        Set font family (system, inter, geist, jetbrains)
  \x1B[33m--density <val>\x1B[0m      Set UI density (compact, default, relaxed)
  \x1B[33m--animation <val>\x1B[0m    Set animation style (none, subtle, energetic)
  \x1B[33m--mode <val>\x1B[0m         Set default theme mode (dark, light)
  \x1B[33m--all, -a\x1B[0m            Install all available components at once
  \x1B[33m-y, --yes\x1B[0m            Skip prompts and use defaults automatically
  \x1B[33m-h, --help\x1B[0m           Show help information
  `);
}
main().catch((err) => {
  console.error("\x1B[31mAn unexpected error occurred:\x1B[0m", err);
  process.exit(1);
});
//# sourceMappingURL=index.js.map
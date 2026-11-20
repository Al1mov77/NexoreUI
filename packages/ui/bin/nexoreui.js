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
function detectPackageManagerFromEnv() {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.startsWith("pnpm/")) return "pnpm";
  if (userAgent.startsWith("yarn/")) return "yarn";
  if (userAgent.startsWith("bun/")) return "bun";
  if (userAgent.startsWith("npm/")) return "npm";
  return void 0;
}
function detectProject(cwd = process.cwd()) {
  let packageManager = "npm";
  let projectType = "unknown";
  let hasSrcDir = false;
  let isNextPagesRouter = false;
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
  } else {
    packageManager = detectPackageManagerFromEnv() || "npm";
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
        const hasAppDir = fs.existsSync(path.join(baseDir, "app")) || fs.existsSync(path.join(baseDir, "src", "app"));
        const hasPagesDir = fs.existsSync(path.join(baseDir, "pages")) || fs.existsSync(path.join(baseDir, "src", "pages"));
        isNextPagesRouter = hasPagesDir && !hasAppDir;
      } else if (deps["astro"]) {
        projectType = "astro";
      } else if (deps["@remix-run/react"] || deps["@remix-run/node"] || deps["@react-router/dev"]) {
        projectType = "remix";
      } else if (deps["vite"] || deps["@tailwindcss/vite"]) {
        projectType = "vite";
      } else if (deps["react-scripts"]) {
        projectType = "cra";
      }
    }
  } catch {
  }
  return {
    packageManager,
    projectType,
    hasSrcDir,
    isNextPagesRouter,
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
      neon: "bg-black rounded-xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export type AccordionProps = (
  | AccordionPrimitive.AccordionSingleProps
  | AccordionPrimitive.AccordionMultipleProps
) & VariantProps<typeof accordionVariants>;

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>((props, ref) => {
  const { className, variant, ...rest } = props;
  const rootClass = cn(accordionVariants({ variant, className }));
  if (rest.type === "multiple") {
    return <AccordionPrimitive.Root ref={ref} className={rootClass} {...rest} />;
  }
  return <AccordionPrimitive.Root ref={ref} className={rootClass} {...(rest as AccordionPrimitive.AccordionSingleProps)} />;
})
Accordion.displayName = "Accordion"

const accordionItemVariants = cva("border-b transition-all duration-300", {
  variants: {
    variant: {
      default: "border-border/50 data-[state=open]:bg-muted/30 rounded-lg px-2",
      neon: "border-neutral-800 data-[state=open]:border-primary data-[state=open]:shadow-[0_0_20px_rgba(6,182,212,0.5)] rounded-xl mb-2 overflow-hidden bg-neutral-950/50",
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
        variant === "neon" && "text-white px-4 data-[state=open]:text-primary",
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
  variant?: 'default' | 'glow' | 'aurora' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (prompt: string, options?: { model?: string; webSearch?: boolean; files?: AttachedFile[] }) => void;
  placeholder?: string;
  isLoading?: boolean;
  onStop?: () => void;
  models?: AIModelOption[];
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
  files?: AttachedFile[];
  onRemoveFile?: (fileId: string) => void;
  onAttachClick?: () => void;
  isListening?: boolean;
  onVoiceToggle?: () => void;
  webSearchEnabled?: boolean;
  onWebSearchToggle?: () => void;
  reasoningEnabled?: boolean;
  onReasoningToggle?: () => void;
  disabled?: boolean;
}

const defaultModels: AIModelOption[] = [
  { id: 'claude-3-7', name: 'Claude 3.7 Sonnet', badge: 'Hybrid', icon: Cpu },
  { id: 'gpt-4o', name: 'GPT-4o', badge: 'Fast', icon: Bot },
  { id: 'gemini-2-flash', name: 'Gemini 2.0 Flash', badge: 'Multimodal', icon: Cpu },
  { id: 'deepseek-r1', name: 'DeepSeek R1', badge: 'Reasoning', icon: Globe },
];

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
                    <Cpu className="w-3.5 h-3.5 text-primary" />
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
                            <Cpu className="w-3.5 h-3.5 text-primary" />
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
                    ? 'bg-primary/15 text-primary dark:text-primary border border-primary/30'
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
                    ? 'bg-primary/15 text-primary dark:text-primary border border-primary/30'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                )}
              >
                <Cpu className="w-3.5 h-3.5" />
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
                    ? 'bg-destructive text-destructive-foreground shadow-md shadow-destructive/20'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                )}
                title={isListening ? 'Stop listening' : 'Speak to AI'}
              >
                {isListening && (
                  <span className="absolute inset-0 rounded-xl bg-destructive/30" />
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
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import { AlertCircle, Info, CheckCircle2, XCircle, Cookie, WifiOff, AlertTriangle, X } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 transition-all duration-300 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-background/50 border-border text-foreground",
        destructive: "border-destructive/30 bg-destructive/10 text-destructive [&>svg]:text-destructive",
        success: "border-success/30 bg-success/10 text-success [&>svg]:text-success",
        warning: "border-warning/30 bg-warning/10 text-warning [&>svg]:text-warning",
        info: "border-info/30 bg-info/10 text-info [&>svg]:text-info",
        glass: "backdrop-blur-md bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5 text-foreground",
        floating: "fixed bottom-5 right-5 z-50 max-w-sm bg-card/95 backdrop-blur-md border border-border/80 text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.25)] animate-slide-up",
        minimal: "border-0 bg-muted/40 p-3 text-sm rounded-xl text-foreground hover:bg-muted/60 shadow-none [&>svg]:top-3.5",
        neon: "border-border bg-muted/30 text-foreground shadow-sm [&>svg]:text-foreground",
        cyberpunk: "border-l-4 border-foreground bg-muted/20 text-foreground shadow-[3px_3px_0_0_var(--border)] rounded-none font-mono uppercase [&>svg]:text-foreground",
        gradient: "bg-linear-to-r from-muted/60 to-muted/20 border-border text-foreground [&>svg]:text-foreground",
        banner: "w-full bg-primary text-primary-foreground border-0 shadow-md rounded-none sm:rounded-xl [&>svg]:text-primary-foreground",
        primary: "bg-background text-foreground border-border",
        danger: "border-destructive/30 bg-destructive/10 text-destructive [&>svg]:text-destructive",
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
  animate?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  actionText?: string;
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
    const shouldReduceMotion = useReducedMotion();
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
            className="absolute right-12 top-1/2 -translate-y-1/2 text-xs font-bold bg-primary-foreground text-primary px-3 py-1.5 rounded-md hover:bg-primary-foreground/90 transition-colors"
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

    if (animate && !shouldReduceMotion) {
      return (
        <motion.div
          ref={ref}
          role="alert"
          initial={{ opacity: 0, y: variant === "floating" ? 30 : 15, scale: variant === "floating" ? 0.95 : 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: variant === "floating" ? 20 : 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 24 }}
          className={alertClass}
          {...(props as HTMLMotionProps<"div">)}
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

export interface ToastAlertWrapperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  time?: string;
}

export const ToastAlertWrapper = ({ children, className, title, description, time, ...props }: ToastAlertWrapperProps) => (
  <div className={cn("max-w-sm w-full bg-background border border-border/80 shadow-xl rounded-2xl p-4 flex gap-4 items-start relative", className)} {...props}>
    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
    <div className="flex-1">
      {title && <h4 className="font-semibold text-sm">{title}</h4>}
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      {children}
    </div>
    {time && <span className="text-xs text-muted-foreground/60">{time}</span>}
  </div>
)

export const CookieAlert = ({ onAccept, onDecline }: { onAccept?: () => void; onDecline?: () => void }) => {
  const [visible, setVisible] = React.useState(true)
  if (!visible) return null
  return (
    <div className="max-w-md bg-card border rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Cookie className="h-6 w-6 text-foreground" />
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

export const OfflineBanner = () => (
  <div className="w-full bg-destructive text-destructive-foreground p-3.5 flex justify-center items-center gap-2 text-sm font-semibold shadow-md sm:rounded-xl">
    <WifiOff className="w-4 h-4" /> You are currently offline. Some features may be unavailable.
  </div>
)

export const RateLimitAlert = () => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="border border-warning/30 bg-warning/10 p-5 rounded-2xl flex gap-3 items-start max-w-md shadow-sm">
      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-bold text-warning">Rate Limit Exceeded</h4>
        <p className="text-sm text-warning/80 mt-1 mb-4">
          You have made too many requests. Please wait 45 seconds before trying again.
        </p>
        <div className="w-full h-1.5 bg-warning/20 rounded-full overflow-hidden">
          {shouldReduceMotion ? (
            <div className="h-full bg-warning w-1/2" />
          ) : (
            <motion.div animate={{ width: ["100%", "0%"] }} transition={{ duration: 45, ease: "linear" }} className="h-full bg-warning" />
          )}
        </div>
      </div>
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription }

export const CyberAlert = ({ title, description, variant = "default", ...props }: AlertProps) => (
  <Alert variant="cyberpunk" title={title} description={description} {...props} />
)

export const SoftAlert = ({ title, description, variant = "default", ...props }: AlertProps) => (
  <Alert variant={variant === "success" ? "success" : "info"} title={title} description={description} {...props} />
)

export const MinimalAlert = ({ title, description, variant = "default", ...props }: AlertProps) => (
  <Alert variant="minimal" title={title} description={description} {...props} />
)

export const LeftBorderAlert = ({ title, description, variant = "default", ...props }: AlertProps) => (
  <Alert variant={variant === "warning" ? "warning" : "default"} className="border-l-4 border-l-primary" title={title} description={description} {...props} />
)

export interface IconTopAlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: string;
}

export const IconTopAlert = ({ title, description, variant = "default", ...props }: IconTopAlertProps) => (
  <div className="flex flex-col items-center text-center p-6 bg-card border rounded-2xl" {...props}>
    <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
      <AlertCircle className="h-6 w-6" />
    </div>
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
)

export interface SolidAlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "error" | "success" | "warning" | "default" | string;
}

export const SolidAlert = ({ title, description, variant = "default", ...props }: SolidAlertProps) => {
  const bgClasses: Record<string, string> = {
    error: "bg-destructive text-destructive-foreground border-0",
    success: "bg-success text-success-foreground border-0",
    warning: "bg-warning text-warning-foreground border-0",
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

export interface BannerAlertProps extends AlertProps {
  message?: React.ReactNode;
}

export const BannerAlert = ({ message, variant = "default", ...props }: BannerAlertProps) => (
  <Alert variant="banner" title={message} {...props} />
)

export const NeonAlert = ({ title, description, variant = "default", ...props }: AlertProps) => (
  <Alert variant="neon" title={title} description={description} {...props} />
)

export const GlassAlert = ({ title, description, variant = "default", ...props }: AlertProps) => (
  <Alert variant="glass" title={title} description={description} {...props} />
)

export const DismissibleAlert = ({ variant = "default", title, description, ...props }: AlertProps) => (
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
import { ArrowRight } from 'lucide-react';
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
  aurora: { s1: '#38bdf8', s2: '#818cf8', s3: '#2dd4bf', s4: '#38bdf8' },
  ocean: { s1: '#0284c7', s2: '#38bdf8', s3: '#0ea5e9', s4: '#7dd3fc' },
  sunset: { s1: '#f97316', s2: '#f59e0b', s3: '#ef4444', s4: '#fb923c' },
  forest: { s1: '#10b981', s2: '#14b8a6', s3: '#059669', s4: '#34d399' },
  cyber: { s1: '#06b6d4', s2: '#3b82f6', s3: '#6366f1', s4: '#22d3ee' },
  gold: { s1: '#d97706', s2: '#f59e0b', s3: '#eab308', s4: '#fbbf24' },
  mono: { s1: 'var(--foreground)', s2: 'var(--muted-foreground)', s3: 'var(--border)', s4: 'var(--foreground)' },
};

const subtitleGradients: Record<AuroraVariant, string> = {
  aurora: 'text-foreground',
  ocean: 'text-foreground',
  sunset: 'text-foreground',
  forest: 'text-foreground',
  cyber: 'text-foreground',
  gold: 'text-foreground',
  mono: 'text-foreground',
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

export const AuroraBorderCard = React.forwardRef<HTMLDivElement, AuroraBorderCardProps>(
  (
    {
      variant = 'mono',
      speed = 'fast',
      glow = 'medium',
      borderWidth = 1,
      radius = 'xl',
      animation = 'flow',
      title = 'Interface Component',
      subtitle = 'Adaptive Geometry',
      description = 'Production component container with hardware-accelerated perimeter illumination.',
      badgeText,
      buttonText = 'Explore',
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
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={\`snake-grad-\${id}\`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.s1} />
              <stop offset="35%" stopColor={colors.s2} />
              <stop offset="70%" stopColor={colors.s3} />
              <stop offset="100%" stopColor={colors.s4} />
            </linearGradient>

            <filter id={\`ambient-blur-\${id}\`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation={glow === 'strong' ? 14 : glow === 'medium' ? 9 : 5} />
            </filter>
          </defs>

          {glowOpacity > 0 && !shouldReduceMotion && (
            <motion.rect
              x={borderWidth}
              y={borderWidth}
              width={\`calc(100% - \${borderWidth * 2}px)\`}
              height={\`calc(100% - \${borderWidth * 2}px)\`}
              rx={radiusConfig.rx}
              ry={radiusConfig.rx}
              fill="none"
              stroke={\`url(#snake-grad-\${id})\`}
              strokeWidth={borderWidth * 2.5}
              strokeDasharray={animation === 'pulse' ? '1000 0' : animation === 'wave' ? '260 740' : '160 840'}
              strokeLinecap="round"
              filter={\`url(#ambient-blur-\${id})\`}
              style={{ opacity: glowOpacity }}
              animate={
                animation === 'pulse'
                  ? { opacity: [glowOpacity * 0.35, glowOpacity, glowOpacity * 0.35] }
                  : { strokeDashoffset: animation === 'wave' ? [0, -500, -1000] : [0, -1000] }
              }
              transition={{
                duration,
                repeat: Infinity,
                ease: animation === 'wave' ? 'easeInOut' : 'linear',
              }}
            />
          )}

          {!shouldReduceMotion ? (
            <motion.rect
              x={borderWidth / 2}
              y={borderWidth / 2}
              width={\`calc(100% - \${borderWidth}px)\`}
              height={\`calc(100% - \${borderWidth}px)\`}
              rx={radiusConfig.rx}
              ry={radiusConfig.rx}
              fill="none"
              stroke={\`url(#snake-grad-\${id})\`}
              strokeWidth={borderWidth}
              strokeDasharray={animation === 'pulse' ? '1000 0' : animation === 'wave' ? '260 740' : '180 820'}
              strokeLinecap="round"
              className="opacity-95 dark:opacity-100"
              animate={
                animation === 'pulse'
                  ? { opacity: [0.35, 1, 0.35] }
                  : { strokeDashoffset: animation === 'wave' ? [0, -500, -1000] : [0, -1000] }
              }
              transition={{
                duration,
                repeat: Infinity,
                ease: animation === 'wave' ? 'easeInOut' : 'linear',
              }}
            />
          ) : (
            <rect
              x={borderWidth / 2}
              y={borderWidth / 2}
              width={\`calc(100% - \${borderWidth}px)\`}
              height={\`calc(100% - \${borderWidth}px)\`}
              rx={radiusConfig.rx}
              ry={radiusConfig.rx}
              fill="none"
              stroke="var(--border)"
              strokeWidth={borderWidth}
            />
          )}
        </svg>

        <div
          className={cn(
            'relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-8 transition-colors duration-200',
            'bg-card text-card-foreground shadow-sm border border-border/70',
            radiusConfig.inner
          )}
        >
          {children ? (
            children
          ) : (
            <div className="flex flex-col h-full justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {title}
                </h3>
                <h4
                  className={cn(
                    'text-xl sm:text-2xl font-bold tracking-tight text-foreground',
                    subtitleGradients[variant] || subtitleGradients.aurora
                  )}
                >
                  {subtitle}
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed pt-1 max-w-md">
                  {description}
                </p>
              </div>

              <div className="pt-2">
                {buttonHref ? (
                  <a
                    href={buttonHref}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-xs cursor-pointer"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onButtonClick}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-xs cursor-pointer"
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
import { Layers } from 'lucide-react';
import { cn } from '../utils/cn';

export type AuroraFXColor = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber' | string;
export type AuroraFXGlow = 'none' | 'subtle' | 'medium' | 'strong';
export type AuroraFXRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface AuroraColorOption {
  name: string;
  hex: string;
}

export const defaultAuroraColors: AuroraColorOption[] = [
  { name: 'Zinc', hex: '#71717a' },
  { name: 'Silver', hex: '#a1a1aa' },
  { name: 'White', hex: '#fafafa' },
  { name: 'Dark', hex: '#27272a' },
  { name: 'Muted', hex: '#52525b' },
];

const colorPresetMap: Record<string, string> = {
  zinc: '#71717a',
  silver: '#a1a1aa',
  white: '#fafafa',
  dark: '#27272a',
  muted: '#52525b',
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
  color?: AuroraFXColor;
  glow?: AuroraFXGlow;
  radius?: AuroraFXRadius;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  title?: string;
  description?: string;
  showColorPicker?: boolean;
  colors?: AuroraColorOption[];
  activeColor?: string;
  onColorChange?: (colorHex: string) => void;
  previewSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  children?: React.ReactNode;
}

export const AuroraBorderFX = React.forwardRef<HTMLDivElement, AuroraBorderFXProps>(
  (
    {
      color = 'zinc',
      glow = 'medium',
      radius = 'lg',
      badgeText = 'Aurora Border FX',
      badgeIcon = <Layers className="w-3 h-3" />,
      title = 'Reactive Aurora Borders',
      description = 'Multi-color conic gradients that track and react across device boundaries.',
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
    const resolvedInitialColor = colorPresetMap[color] || color || '#71717a';
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
        {children ? (
          <div className="relative z-10 w-full h-full">{children}</div>
        ) : (
          <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    {badgeText && (
                      <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        {badgeIcon}
                        {badgeText}
                      </span>
                    )}
                  </div>
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

                {showColorPicker && colors && colors.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-muted/60 dark:bg-muted/40 p-1 rounded-full border border-border/60 backdrop-blur-md shrink-0">
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
            </div>

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
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: currentColor }}
                      />
                      <span className="text-xs font-mono font-semibold text-foreground">
                        Aurora Indicator
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
import { Globe, Cpu } from 'lucide-react';
import { cn } from '../utils/cn';

interface CSSWithRegisterProperty {
  registerProperty?: (definition: {
    name: string;
    syntax: string;
    inherits: boolean;
    initialValue: string;
  }) => void;
}

if (typeof window !== 'undefined' && 'CSS' in window) {
  try {
    const cssObj = window.CSS as unknown as CSSWithRegisterProperty;
    if (typeof cssObj.registerProperty === 'function') {
      cssObj.registerProperty({
        name: '--aurora-deg',
        syntax: '<angle>',
        inherits: false,
        initialValue: '0deg',
      });
    }
  } catch {}
}

export interface AuroraSearchSource {
  id: string;
  label?: string;
  avatarUrl?: string;
  icon?: React.ReactNode;
  initials?: string;
  type?: 'globe' | 'gradient' | 'github' | 'claude' | 'chatgpt' | 'perplexity' | 'custom';
  bg?: string;
}

export type AuroraSearchPillSize = 'sm' | 'md' | 'lg';
export type AuroraSearchPillSpeed = 'slow' | 'normal' | 'fast';
export type AuroraSearchPillTheme = 'light' | 'dark' | 'auto';
export type AuroraSearchPillGlow = 'subtle' | 'medium' | 'strong' | 'none';
export type AuroraSpinMode = 'always' | 'searching' | 'hover' | 'never';

export interface AuroraSearchPillProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  isSearching?: boolean;
  defaultSearching?: boolean;
  onToggle?: (searching: boolean) => void;
  searchLabel?: string;
  sources?: AuroraSearchSource[];
  sourceAvatars?: string[];
  theme?: AuroraSearchPillTheme;
  size?: AuroraSearchPillSize;
  glowIntensity?: AuroraSearchPillGlow;
  speed?: AuroraSearchPillSpeed;
  spinMode?: AuroraSpinMode;
  isSpinning?: boolean;
  autoCycle?: boolean;
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

    const shouldSpin = React.useMemo(() => {
      if (controlledSpinning !== undefined) return controlledSpinning;
      if (spinMode === 'never') return false;
      if (spinMode === 'searching') return active;
      if (spinMode === 'hover') return isHovered;
      return true;
    }, [controlledSpinning, spinMode, isHovered, active]);

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

    const bodyThemeClass =
      theme === 'light'
        ? 'bg-zinc-50 text-slate-900 border-black/5 shadow-xs'
        : theme === 'dark'
        ? 'bg-[#090d16] text-white border-white/10 shadow-lg shadow-black/40'
        : 'bg-white text-slate-900 dark:bg-[#090d16] dark:text-white border-black/5 dark:border-white/10 shadow-xs dark:shadow-black/40';

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
            :root {
              --asp-glow: conic-gradient(
                from var(--aurora-deg, 0deg) at 50% 50%,
                transparent 0deg,
                rgba(0, 0, 0, 0.08) 50deg,
                rgba(0, 0, 0, 0.25) 100deg,
                rgba(0, 0, 0, 0.48) 150deg,
                rgba(0, 0, 0, 0.16) 200deg,
                transparent 250deg,
                transparent 360deg
              );
              --asp-track: conic-gradient(
                from var(--aurora-deg, 0deg) at 50% 50%,
                rgba(0, 0, 0, 0.12) 0deg,
                rgba(0, 0, 0, 0.45) 60deg,
                rgba(0, 0, 0, 1) 110deg,
                rgba(0, 0, 0, 0.70) 160deg,
                rgba(0, 0, 0, 0.22) 200deg,
                rgba(0, 0, 0, 0.12) 260deg,
                rgba(0, 0, 0, 0.12) 360deg
              );
            }
            .dark, [data-theme="dark"] {
              --asp-glow: conic-gradient(
                from var(--aurora-deg, 0deg) at 50% 50%,
                transparent 0deg,
                rgba(255, 255, 255, 0.15) 60deg,
                rgba(255, 255, 255, 0.45) 110deg,
                rgba(255, 255, 255, 0.75) 160deg,
                rgba(255, 255, 255, 0.25) 200deg,
                transparent 250deg,
                transparent 360deg
              );
              --asp-track: conic-gradient(
                from var(--aurora-deg, 0deg) at 50% 50%,
                rgba(113, 113, 122, 0.4) 0deg,
                rgba(161, 161, 170, 0.7) 60deg,
                rgba(250, 250, 250, 1) 110deg,
                rgba(212, 212, 216, 0.8) 160deg,
                rgba(113, 113, 122, 0.4) 200deg,
                rgba(63, 63, 70, 0.3) 260deg,
                rgba(113, 113, 122, 0.4) 360deg
              );
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
              background:
                theme === 'light'
                  ? \`conic-gradient(
                      from var(--aurora-deg, 0deg) at 50% 50%,
                      transparent 0deg,
                      rgba(0, 0, 0, 0.08) 50deg,
                      rgba(0, 0, 0, 0.25) 100deg,
                      rgba(0, 0, 0, 0.48) 150deg,
                      rgba(0, 0, 0, 0.16) 200deg,
                      transparent 250deg,
                      transparent 360deg
                    )\`
                  : theme === 'dark'
                  ? \`conic-gradient(
                      from var(--aurora-deg, 0deg) at 50% 50%,
                      transparent 0deg,
                      rgba(255, 255, 255, 0.15) 60deg,
                      rgba(255, 255, 255, 0.45) 110deg,
                      rgba(255, 255, 255, 0.75) 160deg,
                      rgba(255, 255, 255, 0.25) 200deg,
                      transparent 250deg,
                      transparent 360deg
                    )\`
                  : 'var(--asp-glow)',
              animation: shouldSpin
                ? \`spinAurora \${animationDuration} linear infinite\`
                : undefined,
            }}
          />
        )}

        {/* 2. Sharp 2px Conic Border Track */}
        <div
          className="relative z-10 p-[2px] rounded-full transition-shadow duration-300 shadow-sm"
          style={{
            background:
              theme === 'light'
                ? \`conic-gradient(
                    from var(--aurora-deg, 0deg) at 50% 50%,
                    rgba(0, 0, 0, 0.12) 0deg,
                    rgba(0, 0, 0, 0.45) 60deg,
                    rgba(0, 0, 0, 1) 110deg,
                    rgba(0, 0, 0, 0.70) 160deg,
                    rgba(0, 0, 0, 0.22) 200deg,
                    rgba(0, 0, 0, 0.12) 260deg,
                    rgba(0, 0, 0, 0.12) 360deg
                  )\`
                : theme === 'dark'
                ? \`conic-gradient(
                    from var(--aurora-deg, 0deg) at 50% 50%,
                    rgba(113, 113, 122, 0.4) 0deg,
                    rgba(161, 161, 170, 0.7) 60deg,
                    rgba(250, 250, 250, 1) 110deg,
                    rgba(212, 212, 216, 0.8) 160deg,
                    rgba(113, 113, 122, 0.4) 200deg,
                    rgba(63, 63, 70, 0.3) 260deg,
                    rgba(113, 113, 122, 0.4) 360deg
                  )\`
                : 'var(--asp-track)',
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
                              ? 'linear-gradient(135deg, #27272a 45%, #52525b 55%)'
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
                          <Globe className="w-3 h-3 text-primary stroke-[2.5]" />
                        ) : src.type === 'github' ? (
                          <svg className="w-3.5 h-3.5 fill-[#181717]" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        ) : src.type === 'claude' ? (
                          <Cpu className="w-2.5 h-2.5 text-white" />
                        ) : src.type === 'chatgpt' ? (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        ) : src.type === 'perplexity' ? (
                          <Cpu className="w-2.5 h-2.5 text-white" />
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
import { motion, useReducedMotion } from "framer-motion"

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
        gradient: "p-[2px] bg-primary",
        glow: "border-2 border-primary shadow-xs",
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

export interface HelperAvatarProps {
  src?: string;
  fallback?: React.ReactNode;
  size?: VariantProps<typeof avatarVariants>["size"];
  status?: "online" | "offline" | "away" | "busy";
  className?: string;
  tooltipText?: string;
  shape?: string;
  initials?: string;
  name?: string;
}

export const GlowAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} variant="glow" status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const StatusAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const GlassAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} variant="glass" status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const SquareAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={cn("rounded-xl [&>div]:rounded-xl [&_img]:rounded-xl [&_div]:rounded-xl", className)}>
    {src ? <AvatarImage src={src} className="rounded-xl" /> : <AvatarFallback className="rounded-xl">{fallback}</AvatarFallback>}
  </Avatar>
)

export const HexagonAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={cn("clip-path-hexagon", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const SquircleAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={cn("rounded-[35%] [&>div]:rounded-[35%] [&_img]:rounded-[35%] [&_div]:rounded-[35%]", className)}>
    {src ? <AvatarImage src={src} className="rounded-[35%]" /> : <AvatarFallback className="rounded-[35%]">{fallback}</AvatarFallback>}
  </Avatar>
)

export const GradientRingAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} variant="gradient" status={status} className={className}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const InitialsAvatar = ({ fallback, initials, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={className}>
    <AvatarFallback>{initials || fallback}</AvatarFallback>
  </Avatar>
)

export const InitialsGradientAvatar = ({ fallback, initials, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} variant="gradient" status={status} className={className}>
    <AvatarFallback>{initials || fallback}</AvatarFallback>
  </Avatar>
)

export const OutlineAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={cn("border-2 border-primary", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const HoverExpandAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={cn("hover:scale-105 active:scale-95 transition-transform", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const PulseAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={cn("ring-2 ring-primary ring-offset-2", className)}>
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
        <Avatar key={i} size="sm" className="border-2 border-background ring-1 ring-black/5 hover:-translate-y-0.5 transition-transform">
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

export const DottedAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={cn("border-2 border-dashed border-primary p-px", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const ShadowAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={cn("shadow-md shadow-primary/20", className)}>
    {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const PolymorphAvatar = ({ src, fallback, size, status, className }: HelperAvatarProps) => (
  <Avatar size={size} status={status} className={cn("rounded-none hover:rounded-[40%] transition-all duration-300", className)}>
    {src ? <AvatarImage src={src} className="rounded-none hover:rounded-[40%] transition-all duration-300" /> : <AvatarFallback>{fallback}</AvatarFallback>}
  </Avatar>
)

export const TooltipAvatar = ({ src, fallback, size, status, tooltipText, name, className }: HelperAvatarProps) => {
  const label = tooltipText || name;
  return (
    <div className="relative group/tooltip inline-block">
      <Avatar size={size} status={status} className={className}>
        {src ? <AvatarImage src={src} /> : <AvatarFallback>{fallback}</AvatarFallback>}
      </Avatar>
      {label && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-popover text-[10px] font-medium text-popover-foreground border rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 shadow-sm">
          {label}
        </div>
      )}
    </div>
  );
};

export const AnimatedBorderAvatar = ({ src, fallback }: HelperAvatarProps) => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <div className="relative p-[2px] rounded-full overflow-hidden inline-block">
      {!shouldReduceMotion ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-[-50%]"
          style={{ background: "conic-gradient(from 0deg, transparent 0 320deg, var(--primary) 360deg)" }}
        />
      ) : (
        <div className="absolute inset-0 bg-border" />
      )}
      <Avatar className="relative border-2 border-background">
        {src && <AvatarImage src={src} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    </div>
  )
}

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
        default: "border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive/15 text-destructive border border-destructive/20",
        outline: "text-foreground border-border hover:bg-accent",
        gradient: "border-transparent bg-secondary text-secondary-foreground shadow-xs",
        neon: "border-border bg-muted text-foreground shadow-xs",
        success: "border-transparent bg-success/15 text-success border border-success/20",
        warning: "border-transparent bg-warning/15 text-warning border border-warning/20",
        info: "border-transparent bg-info/15 text-info border border-info/20",
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
  pulse?: boolean;
  dot?: boolean;
  text?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, pulse = false, dot = false, children, text, ...props }, ref) => {
    const showDot = dot || pulse;

    return (
      <div ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
        {showDot && (
          <span className="relative flex h-2 w-2 mr-1">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
          </span>
        )}
        {children || text}
      </div>
    );
  }
);
Badge.displayName = "Badge";

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
import { motion, useInView, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../utils/cn"

export interface BlurFadeProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  blur?: string
  className?: string
  inView?: boolean
  once?: boolean
  margin?: string
}

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
    const shouldReduceMotion = useReducedMotion()
    const localRef = React.useRef<HTMLDivElement>(null)
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || localRef

    type UseInViewOptions = NonNullable<Parameters<typeof useInView>[1]>
    const isInView = useInView(combinedRef, { once, margin: margin as UseInViewOptions["margin"] })
    const animateState = inView ? (isInView ? "visible" : "hidden") : "visible"

    const variants = shouldReduceMotion
      ? {
          hidden: { y: 0, opacity: 1, filter: "none" },
          visible: { y: 0, opacity: 1, filter: "none" },
        }
      : {
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
        initial={shouldReduceMotion ? false : "hidden"}
        animate={animateState}
        variants={variants}
        transition={{
          delay: shouldReduceMotion ? 0 : delay,
          duration: shouldReduceMotion ? 0 : duration,
          ease: [0.25, 0.4, 0.25, 1.0],
        }}
        className={cn("w-full", className)}
        {...props}
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
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border shadow-xs",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
        outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-primary text-primary-foreground border border-foreground/10 hover:bg-primary/90 shadow-xs",
        neon: "bg-background border border-input text-foreground hover:bg-accent hover:text-accent-foreground shadow-xs",
        glass: "backdrop-blur-md bg-secondary/80 border border-border text-foreground hover:bg-accent shadow-xs",
        shimmer: "relative overflow-hidden bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        gradient: "bg-secondary text-secondary-foreground border border-border hover:bg-accent shadow-xs",
        glow: "bg-primary text-primary-foreground border border-primary/20 shadow-sm hover:bg-primary/90",
        magnetic: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        loading: "bg-primary/80 text-primary-foreground/80 pointer-events-none cursor-wait",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  animate?: boolean;
  shimmer?: boolean;
  glow?: boolean;
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

    const [magneticPos, setMagneticPos] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isMagnetic) return;
      const { clientX, clientY, currentTarget } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
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
            className="absolute inset-0 w-[200%] bg-linear-to-r from-transparent via-primary-foreground/20 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 2.2,
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

    const disabledState = props.disabled || isLoading;

    const resolvedClassName = cn(
      buttonVariants({ variant: activeVariant, size, className }),
      isShimmer && "relative overflow-hidden",
      isGlow && "shadow-[0_0_20px_rgb(var(--primary-rgb)/0.25)] hover:shadow-[0_0_26px_rgb(var(--primary-rgb)/0.38)]"
    );

    const shouldReduceMotion = useReducedMotion();
    const shouldAnimate = animate && !shouldReduceMotion;

    if (!shouldAnimate) {
      return (
        <button
          ref={ref}
          disabled={disabledState}
          className={resolvedClassName}
          {...props}
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
          scale: isMagnetic ? 1.01 : 1.015,
          y: isMagnetic ? 0 : -1,
        }}
        whileTap={{ scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };


export const NeonButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="neon" glow={true} {...props}>
      {children}
    </Button>
  )
);
NeonButton.displayName = "NeonButton";

export const ThreeDButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "shadow-[0_4px_0_var(--border)] hover:shadow-[0_2px_0_var(--border)] active:translate-y-0.5 active:shadow-none transition-all",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);
ThreeDButton.displayName = "ThreeDButton";

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

export const CyberpunkButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "bg-foreground text-background font-mono font-bold uppercase tracking-widest border-2 border-foreground hover:bg-background hover:text-foreground transition-colors shadow-[3px_3px_0_0_currentColor] rounded-none",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);
CyberpunkButton.displayName = "CyberpunkButton";

export const MagneticButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="magnetic" {...props}>
      {children}
    </Button>
  )
);
MagneticButton.displayName = "MagneticButton";

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="shimmer" shimmer={true} {...props}>
      {children}
    </Button>
  )
);
ShimmerButton.displayName = "ShimmerButton";

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

export const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps & { isLoading?: boolean }>(
  ({ children, isLoading = true, ...props }, ref) => (
    <Button ref={ref} isLoading={isLoading} {...props}>
      {children}
    </Button>
  )
);
LoadingButton.displayName = "LoadingButton";

export const DestructiveGlowButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="destructive" glow={true} {...props}>
      {children}
    </Button>
  )
);
DestructiveGlowButton.displayName = "DestructiveGlowButton";

export const GhostOutlineButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="outline" {...props}>
      {children}
    </Button>
  )
);
GhostOutlineButton.displayName = "GhostOutlineButton";

export const GlowButton = React.forwardRef<HTMLButtonElement, ButtonProps & { glowColor?: string }>(
  ({ children, glowColor = "rgb(var(--primary-rgb) / 0.14)", className, ...props }, ref) => (
    <div className="relative group inline-block">
      <div
        className="absolute -inset-0.5 rounded-lg opacity-40 group-hover:opacity-75 transition duration-500"
        style={{ backgroundColor: glowColor }}
      />
      <Button ref={ref} className={cn("relative", className)} {...props}>
        {children}
      </Button>
    </div>
  )
);
GlowButton.displayName = "GlowButton";

export const ShinyButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} shimmer={true} {...props}>
      {children}
    </Button>
  )
);
ShinyButton.displayName = "ShinyButton";

export const GradientButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button ref={ref} variant="gradient" {...props}>
      {children}
    </Button>
  )
);
GradientButton.displayName = "GradientButton";

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
        default: "border border-border bg-card text-card-foreground shadow-xs hover:border-foreground/20 hover:shadow-sm",
        glass: "backdrop-blur-md bg-card/80 border border-border shadow-xs",
        gradient: "bg-card border border-border shadow-xs hover:border-foreground/20",
        glow: "bg-card border border-border shadow-xs hover:border-foreground/25",
        bento: "border border-border bg-card text-card-foreground shadow-xs hover:border-foreground/20 relative",
        spotlight: "border border-border bg-card text-card-foreground relative hover:border-foreground/20",
        flip: "bg-transparent border-0 shadow-none overflow-visible relative",
        tilt: "border border-border bg-card text-card-foreground shadow-xs",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-sm",
        glow: "hover:border-foreground/25 hover:shadow-xs",
      }
    },
    defaultVariants: {
      variant: "default",
      hover: "lift",
    }
  }
)

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof cardVariants> {
  animate?: boolean;
  backContent?: React.ReactNode;
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
      spotlightColor = "rgb(var(--primary-rgb) / 0.08)",
      children,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const isSpotlight = variant === "spotlight";
    const isFlip = variant === "flip";
    const isTilt = variant === "tilt";

    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const handleMouseMoveSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSpotlight) return;
      const { currentTarget, clientX, clientY } = e;
      const { left, top } = currentTarget.getBoundingClientRect();
      setMousePos({ x: clientX - left, y: clientY - top });
    };

    const [tiltPos, setTiltPos] = React.useState({ rotateX: 0, rotateY: 0 });
    const handleMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isTilt) return;
      const { currentTarget, clientX, clientY } = e;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      const maxTilt = 12;
      const rotateX = ((y - height / 2) / (height / 2)) * -maxTilt;
      const rotateY = ((x - width / 2) / (width / 2)) * maxTilt;
      setTiltPos({ rotateX, rotateY });
    };

    const handleMouseLeaveTilt = () => {
      if (!isTilt) return;
      setTiltPos({ rotateX: 0, rotateY: 0 });
    };

    const [isFlipped, setIsFlipped] = React.useState(false);

    const { ...htmlProps } = props;

    if (isFlip) {
      return (
        <div
          ref={ref}
          className={cn(cardVariants({ variant, hover, className }), "[perspective:1000px] w-full h-full min-h-[200px]")}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
          {...(htmlProps as React.HTMLAttributes<HTMLDivElement>)}
        >
          <motion.div
            className="relative w-full h-full min-h-[200px] [transform-style:preserve-3d]"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="absolute inset-0 [backface-visibility:hidden] border border-border bg-card text-card-foreground rounded-xl shadow-sm flex flex-col justify-between overflow-hidden">
              {children}
            </div>

            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] border border-border bg-muted/40 text-card-foreground rounded-xl shadow-sm flex flex-col p-6 items-center justify-center text-center overflow-hidden">
              {backContent || (
                <div className="text-sm font-medium text-muted-foreground">
                  Flip side content
                </div>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    const spotlightEffect = isSpotlight && (
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: \`radial-gradient(400px circle at \${mousePos.x}px \${mousePos.y}px, \${spotlightColor}, transparent 80%)\`,
        }}
      />
    );

    const cardClass = cn(cardVariants({ variant, hover: isFlip || isTilt ? "none" : hover, className }), isSpotlight && "group");

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
          whileHover={isTilt ? undefined : { scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
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
        {...props}
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
    className={cn("font-semibold leading-none tracking-[-0.035em] text-xl text-foreground [text-wrap:balance]", className)}
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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Search } from "lucide-react"
import { cn } from "../utils/cn"

export interface CommandItem {
  label: string
  value: string
  icon?: React.ReactNode
  onSelect: () => void
}

export interface CommandProps {
  items: CommandItem[]
  placeholder?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  enableShortcut?: boolean
}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ items, placeholder = "Type a command or search...", open: customOpen, onOpenChange, enableShortcut = true }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    const [localOpen, setLocalOpen] = React.useState(false)
    const open = customOpen !== undefined ? customOpen : localOpen
    const setOpen = onOpenChange || setLocalOpen

    const [search, setSearch] = React.useState("")
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const listRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (!enableShortcut) return
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault()
          setOpen(!open)
        }
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [open, setOpen, enableShortcut])

    const filteredItems = React.useMemo(() => {
      if (!search.trim()) return items
      return items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.value.toLowerCase().includes(search.toLowerCase())
      )
    }, [items, search])

    React.useEffect(() => {
      setSelectedIndex(0)
    }, [filteredItems])

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

              <DialogPrimitive.Content asChild>
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
                  <DialogPrimitive.Title className="sr-only">Command Menu</DialogPrimitive.Title>
                  <DialogPrimitive.Description className="sr-only">
                    Search and run available commands
                  </DialogPrimitive.Description>
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -12 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
                    onKeyDown={handleKeyDown}
                    ref={ref}
                    className="relative w-full max-w-[550px] bg-card/95 border border-border/80 rounded-2xl shadow-xl overflow-hidden flex flex-col focus:outline-none"
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
                                  ? "bg-primary/10 text-primary font-medium shadow-[inset_0_0_1px_rgb(var(--primary-rgb)/0.2)]"
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

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "../utils/cn";

export type ThemeMode = "light" | "dark" | "system";

export interface DarkModeToggleProps {
  theme?: ThemeMode;
  variant?: "pill" | "icon" | "segmented" | "card";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  storageKey?: string;
  onChange?: (theme: ThemeMode) => void;
  className?: string;
}

function applyThemeToDocument(mode: ThemeMode) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = mode === "dark" || (mode === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", shouldBeDark);
}

export function DarkModeToggle({
  theme: controlledTheme,
  variant = "pill",
  size = "md",
  showLabel = false,
  storageKey = "nexore-theme",
  onChange,
  className,
}: DarkModeToggleProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalTheme, setInternalTheme] = React.useState<ThemeMode>("system");
  const [resolvedDark, setResolvedDark] = React.useState(true);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (controlledTheme === undefined) {
      try {
        const stored = window.localStorage.getItem(storageKey) as ThemeMode | null;
        if (stored === "light" || stored === "dark" || stored === "system") {
          setInternalTheme(stored);
        }
      } catch {
      }
    }
  }, [controlledTheme, storageKey]);

  const activeTheme: ThemeMode = controlledTheme !== undefined ? controlledTheme : internalTheme;

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const dark = activeTheme === "dark" || (activeTheme === "system" && mq.matches);
      setResolvedDark(dark);
      if (controlledTheme === undefined) {
        applyThemeToDocument(activeTheme);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [activeTheme, controlledTheme]);

  const handleToggle = (newTheme: ThemeMode) => {
    if (controlledTheme === undefined) {
      setInternalTheme(newTheme);
      try {
        window.localStorage.setItem(storageKey, newTheme);
      } catch {
      }
      applyThemeToDocument(newTheme);
    }
    onChange?.(newTheme);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => handleToggle(resolvedDark ? "light" : "dark")}
        className={cn(
          "relative flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors duration-200 cursor-pointer shadow-xs",
          size === "sm" ? "w-8 h-8" : size === "lg" ? "w-11 h-11" : "w-9 h-9",
          className
        )}
        title={\`Switch to \${resolvedDark ? "light" : "dark"} theme\`}
        aria-label="Toggle theme"
      >
        <motion.div
          key={resolvedDark ? "dark" : "light"}
          initial={shouldReduceMotion ? false : { rotate: -60, scale: 0.85, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18 }}
        >
          {resolvedDark ? (
            <Moon className={size === "sm" ? "w-3.5 h-3.5 text-foreground" : "w-4 h-4 text-foreground"} />
          ) : (
            <Sun className={size === "sm" ? "w-3.5 h-3.5 text-foreground" : "w-4 h-4 text-foreground"} />
          )}
        </motion.div>
      </button>
    );
  }

  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label="Theme mode"
        className={cn(
          "inline-flex items-center gap-1 p-1 rounded-xl border border-border bg-muted/40 shadow-xs",
          className
        )}
      >
        {(["light", "dark", "system"] as const).map((t) => {
          const isActive = activeTheme === t;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => handleToggle(t)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors duration-150 cursor-pointer",
                isActive
                  ? "bg-card text-foreground shadow-xs border border-border font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "light" && <Sun className="w-3.5 h-3.5" />}
              {t === "dark" && <Moon className="w-3.5 h-3.5" />}
              {t === "system" && <Monitor className="w-3.5 h-3.5" />}
              {showLabel && <span>{t}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "card") {
    const cards: { id: ThemeMode; label: string; desc: string; icon: React.ReactNode }[] = [
      { id: "light", label: "Light", desc: "Clean daylight surface", icon: <Sun className="w-4 h-4" /> },
      { id: "dark", label: "Dark", desc: "Low-glare dark surface", icon: <Moon className="w-4 h-4" /> },
      { id: "system", label: "System", desc: "Matches OS preference", icon: <Monitor className="w-4 h-4" /> },
    ];
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg", className)}>
        {cards.map((item) => {
          const isActive = activeTheme === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToggle(item.id)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-colors cursor-pointer",
                isActive
                  ? "border-foreground bg-card text-foreground shadow-xs"
                  : "border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <div className="flex w-full items-center justify-between">
                {item.icon}
                {isActive && <Check className="w-3.5 h-3.5 text-foreground" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">{item.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  const dimensions =
    size === "sm"
      ? { track: "w-11 h-6", thumb: "w-4.5 h-4.5", icon: "w-2.5 h-2.5", offset: 20 }
      : size === "lg"
      ? { track: "w-16 h-9", thumb: "w-7 h-7", icon: "w-4 h-4", offset: 28 }
      : { track: "w-14 h-7.5", thumb: "w-5.5 h-5.5", icon: "w-3 h-3", offset: 24 };

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={resolvedDark}
        onClick={() => handleToggle(resolvedDark ? "light" : "dark")}
        className={cn(
          "relative rounded-full transition-colors duration-200 border border-border shadow-xs cursor-pointer p-0.75",
          resolvedDark ? "bg-foreground" : "bg-muted",
          dimensions.track
        )}
        title={\`Switch to \${resolvedDark ? "light" : "dark"} mode\`}
        aria-label="Toggle dark mode"
      >
        <motion.div
          animate={{ x: resolvedDark ? dimensions.offset : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
          className={cn(
            "rounded-full bg-background text-foreground shadow-xs flex items-center justify-center",
            dimensions.thumb
          )}
        >
          {resolvedDark ? <Moon className={dimensions.icon} /> : <Sun className={dimensions.icon} />}
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

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  limit?: number
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

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string
  description?: string
  icon?: LucideIcon
  trend?: {
    value: string
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
                  trend.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
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

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
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

interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  price: string
  description: string
  features: string[]
  buttonText?: string
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
          Featured
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

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
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

// src/registry/dither-image.ts
var ditherImage = {
  name: "dither-image",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "dither-image.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface DitherImageProps extends React.HTMLAttributes<HTMLCanvasElement> {
  px?: number;
  lv?: number;
  bn?: number;
  cont?: number;
  bias?: number;
  anim?: number;
  mode?: number;
  rad?: number;
  soft?: number;
  rv?: number;
  c0?: string;
  c1?: string;
  c2?: string;
  c3?: string;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R,P0;uniform float T,K;uniform sampler2D tx;
uniform float px,lv,bn,cont,bias,anim,mode,rad,soft,rv;uniform vec3 c0,c1,c2,c3;
float b2(vec2 p){p=mod(p,2.);return p.x<1.?(p.y<1.?0.:3.):(p.y<1.?2.:1.);}
float bay(vec2 p,float n){float v=0.;for(int i=0;i<3;i++){if(float(i)>=n)break;v+=b2(floor(p/exp2(float(i))))*exp2(2.*(n-1.-float(i)));}return (v+.5)/exp2(2.*n);}
void main(){
  vec2 uv=gl_FragCoord.xy/R,p=(gl_FragCoord.xy*2.-R)/R.y,fp=floor(gl_FragCoord.xy/(px*K));
  vec3 src=texture2D(tx,uv).rgb;float l=clamp((dot(src,vec3(.299,.587,.114))-.5)*cont+.5+bias,0.,1.);
  float th=bay(fp+floor(T*anim*12.)*vec2(3.,7.),bn)-.5,q=lv-1.;
  float lq=clamp(floor(l*q+th+.5)/q,0.,1.);
  vec3 g=lq<.334?mix(c0,c1,lq*3.):lq<.667?mix(c1,c2,(lq-.334)*3.):mix(c2,c3,(lq-.667)*3.);
  vec3 cc=clamp(floor(src*q+th+.5)/q,0.,1.),d=mix(g,cc,mode);
  gl_FragColor=vec4(mix(d,src,rv*(1.-smoothstep(rad,rad+soft,length(p-P0)))),1.);
}\`;

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function createDefaultTexture(gl: WebGLRenderingContext, w: number, h: number): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, w, h);
  const pal = ["#ff6a3d", "#2d3bff", "#f6f1e6", "#8a5cff"];
  pal.forEach((color, i) => {
    const a = [0.18, 0.88, 0.62, 0.08][i];
    const b = [0.25, 0.3, 0.95, 0.95][i];
    const g = ctx.createRadialGradient(w * a, h * b, 0, w * a, h * b, Math.max(w, h) * 0.5);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let y = 0; y < h; y += 14) {
    ctx.fillRect(0, y, w, 2);
  }
  const fs = Math.min(w / 4, h * 0.35);
  ctx.font = \`800 \${fs}px system-ui, -apple-system, sans-serif\`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Dither", w * 0.06, h * 0.45);
  ctx.fillText("Pixels", w * 0.06, h * 0.45 + fs * 0.88);
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export const DitherImage = forwardRef<HTMLCanvasElement, DitherImageProps>(function DitherImage(
  {
    px = 3,
    lv = 3,
    bn = 3,
    cont = 1.3,
    bias = 0,
    anim = 0,
    mode = 0,
    rad = 0.22,
    soft = 0.18,
    rv = 1,
    c0 = "#0a0a0f",
    c1 = "#2d3bff",
    c2 = "#ff6a3d",
    c3 = "#f6f1e6",
    background,
    paused = false,
    className,
    style,
    ...props
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "q");
    gl.linkProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let defaultTex = createDefaultTexture(gl, canvas.clientWidth || 600, canvas.clientHeight || 400);
    let customTex: WebGLTexture | null = null;

    if (background) {
      if (typeof background === "string") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = background;
        img.onload = () => {
          if (!gl.isContextLost()) {
            customTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, customTex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          }
        };
      } else {
        customTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, customTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
    }

    const m = { x: 0, y: 0 };
    const P0 = [0, 0];
    let lm = -1e5;
    let isVisible = true;
    let isDocVisible = !document.hidden;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      m.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      m.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      lm = performance.now();
    };
    canvas.addEventListener("pointermove", onPointerMove);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let ema = 16.7;
    let rs = 1.0;
    let good = 0;
    let last = 0;
    let animId = 0;
    let hasRenderedOnce = false;

    const render = (ms: number) => {
      animId = requestAnimationFrame(render);
      if (paused || (!isVisible && hasRenderedOnce) || (!isDocVisible && hasRenderedOnce)) return;

      const dt = ms - last;
      last = ms;
      if (dt > 0 && dt < 200) {
        ema += (dt - ema) * 0.05;
        if (ema > 23 && rs > 0.5) {
          rs = Math.max(0.5, rs - 0.1);
          ema = 16.7;
          good = 0;
        } else if (ema < 17.6 && rs < 1.0 && ++good > 180) {
          rs = Math.min(1.0, rs + 0.05);
          good = 0;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * rs;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if (!background) {
          if (defaultTex) gl.deleteTexture(defaultTex);
          defaultTex = createDefaultTexture(gl, w, h);
        }
      }

      const asp = w / h;
      const t = ms / 1000;
      const idle = !reducedMotion && performance.now() - lm > 2500;
      const tx = idle ? Math.sin(t * 0.55) * asp * 0.6 : m.x * asp;
      const ty = idle ? Math.cos(t * 0.8) * 0.45 : m.y;

      P0[0] += (tx - P0[0]) * 0.14;
      P0[1] += (ty - P0[1]) * 0.14;

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "K"), w / canvas.clientWidth);
      gl.uniform1f(gl.getUniformLocation(prog, "T"), reducedMotion ? 3.0 : t);
      gl.uniform2f(gl.getUniformLocation(prog, "P0"), P0[0], P0[1]);

      gl.uniform1f(gl.getUniformLocation(prog, "px"), px);
      gl.uniform1f(gl.getUniformLocation(prog, "lv"), lv);
      gl.uniform1f(gl.getUniformLocation(prog, "bn"), bn);
      gl.uniform1f(gl.getUniformLocation(prog, "cont"), cont);
      gl.uniform1f(gl.getUniformLocation(prog, "bias"), bias);
      gl.uniform1f(gl.getUniformLocation(prog, "anim"), anim);
      gl.uniform1f(gl.getUniformLocation(prog, "mode"), mode);
      gl.uniform1f(gl.getUniformLocation(prog, "rad"), rad);
      gl.uniform1f(gl.getUniformLocation(prog, "soft"), soft);
      gl.uniform1f(gl.getUniformLocation(prog, "rv"), rv);

      const parsedC0 = parseHex(c0);
      const parsedC1 = parseHex(c1);
      const parsedC2 = parseHex(c2);
      const parsedC3 = parseHex(c3);
      gl.uniform3f(gl.getUniformLocation(prog, "c0"), parsedC0[0], parsedC0[1], parsedC0[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "c1"), parsedC1[0], parsedC1[1], parsedC1[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "c2"), parsedC2[0], parsedC2[1], parsedC2[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "c3"), parsedC3[0], parsedC3[1], parsedC3[2]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, customTex || defaultTex);
      gl.uniform1i(gl.getUniformLocation(prog, "tx"), 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      hasRenderedOnce = true;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      if (defaultTex) gl.deleteTexture(defaultTex);
      if (customTex) gl.deleteTexture(customTex);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [px, lv, bn, cont, bias, anim, mode, rad, soft, rv, c0, c1, c2, c3, background, paused]);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      }}
      className={cn("block w-full h-full touch-none select-none", className)}
      style={style}
      {...props}
    />
  );
});

DitherImage.displayName = "DitherImage";
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
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type MotionValue } from "framer-motion"
import { cn } from "../utils/cn"

export interface DockProps {
  items: {
    icon: React.ReactNode
    label: string
    onClick?: () => void
  }[]
  className?: string
  magnification?: number
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
  mouseX: MotionValue<number>
  magnification: number
  distance: number
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  const shouldReduceMotion = useReducedMotion()
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
      style={{ width: shouldReduceMotion ? 40 : width }}
      className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-muted/80 hover:bg-accent transition-colors"
      onClick={onClick}
      title={label}
    >
      <div className="flex items-center justify-center text-foreground">
        {icon}
      </div>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
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
          setError(\`File "\${file.name}" exceeds the maximum allowed size of \${(maxSize / (1024 * 1024)).toFixed(0)}MB.\`)
          return
        }

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

// src/registry/fluted-glass.ts
var flutedGlass = {
  name: "fluted-glass",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "fluted-glass.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface FlutedGlassProps extends React.HTMLAttributes<HTMLCanvasElement> {
  cnt?: number;
  bend?: number;
  disp?: number;
  frost?: number;
  ang?: number;
  warp?: number;
  edge?: number;
  hl?: number;
  pinf?: number;
  tin?: number;
  tint?: string;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R,P0;uniform float T;uniform sampler2D tx;
uniform float cnt,bend,disp,frost,ang,warp,edge,hl,pinf,tin;uniform vec3 tint;
vec3 S(vec2 uv,vec2 o,float bl){
  vec2 b=vec2(bl*.012,0.);
  vec2 st=clamp(uv+o,0.001,0.999);
  vec3 c=texture2D(tx,st).rgb*2.;
  c+=texture2D(tx,clamp(st+b,0.001,0.999)).rgb+texture2D(tx,clamp(st-b,0.001,0.999)).rgb+texture2D(tx,clamp(st+b.yx,0.001,0.999)).rgb+texture2D(tx,clamp(st-b.yx,0.001,0.999)).rgb;
  return c/6.;
}
void main(){
  vec2 uv=gl_FragCoord.xy/R,p=(gl_FragCoord.xy*2.-R)/R.y;
  vec2 dir=vec2(cos(ang),sin(ang)),per=vec2(-dir.y,dir.x);
  float r=dot(p,dir)*cnt*.5,pr=dot(P0,dir)*cnt*.5,id=floor(r),f=fract(r)-.5,dd=r-pr,near=exp(-dd*dd*.03);
  vec2 o=dir*(-f*bend*(1.+pinf*near*1.5)*2./cnt)+per*sin(id*.7+T*.6+dot(p,per)*1.2)*warp*.03;
  o*=vec2(R.y/R.x,1.)*.5;
  vec3 c=vec3(S(uv,o*(1.+disp),frost).r,S(uv,o,frost).g,S(uv,o*(1.-disp),frost).b);
  c=mix(c,tint,tin);
  c*=.96+.08*sin(id*1.77+2.1);
  float q=(f+.3)*6.;
  c+=hl*.3*exp(-q*q)*(.5+near);
  c*=max(1.-edge*smoothstep(.3,.5,abs(f)),0.);
  gl_FragColor=vec4(clamp(c,0.,1.),1.);
}\`;

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function createDefaultTexture(gl: WebGLRenderingContext, w: number, h: number): WebGLTexture | null {
  const cw = Math.max(300, w);
  const ch = Math.max(150, h);
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, cw, ch);
  const pal = ["#ff7a1a", "#ff2e63", "#1b2cff", "#ffd447"];
  pal.forEach((color, i) => {
    const a = [0.18, 0.88, 0.62, 0.08][i];
    const b = [0.25, 0.3, 0.95, 0.95][i];
    const g = ctx.createRadialGradient(cw * a, ch * b, 0, cw * a, ch * b, Math.max(cw, ch) * 0.5);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);
  });
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let y = 0; y < ch; y += 14) {
    ctx.fillRect(0, y, cw, 2);
  }
  const fs = Math.min(cw / 4, ch * 0.35);
  ctx.font = \`800 \${fs}px system-ui, -apple-system, sans-serif\`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Fluted", cw * 0.06, ch * 0.45);
  ctx.fillText("Light", cw * 0.06, ch * 0.45 + fs * 0.88);
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export const FlutedGlass = forwardRef<HTMLCanvasElement, FlutedGlassProps>(function FlutedGlass(
  {
    cnt = 22,
    bend = 0.85,
    disp = 0.25,
    frost = 0.25,
    ang = 0,
    warp = 0.5,
    edge = 0.5,
    hl = 0.8,
    pinf = 1,
    tin = 0,
    tint = "#ffffff",
    background,
    paused = false,
    className,
    style,
    ...props
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "q");
    gl.linkProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let defaultTex = createDefaultTexture(gl, canvas.clientWidth || 600, canvas.clientHeight || 400);
    let customTex: WebGLTexture | null = null;

    if (background) {
      if (typeof background === "string") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = background;
        img.onload = () => {
          if (!gl.isContextLost()) {
            customTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, customTex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          }
        };
      } else {
        customTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, customTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
    }

    const m = { x: 0, y: 0 };
    const P0 = [0, 0];
    let lm = -1e5;
    let isVisible = true;
    let isDocVisible = !document.hidden;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      m.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      m.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      lm = performance.now();
    };
    canvas.addEventListener("pointermove", onPointerMove);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let ema = 16.7;
    let rs = 1.0;
    let good = 0;
    let last = 0;
    let animId = 0;
    let hasRenderedOnce = false;

    const render = (ms: number) => {
      animId = requestAnimationFrame(render);
      if (paused || (!isVisible && hasRenderedOnce) || (!isDocVisible && hasRenderedOnce)) return;

      const dt = ms - last;
      last = ms;
      if (dt > 0 && dt < 200) {
        ema += (dt - ema) * 0.05;
        if (ema > 23 && rs > 0.5) {
          rs = Math.max(0.5, rs - 0.1);
          ema = 16.7;
          good = 0;
        } else if (ema < 17.6 && rs < 1.0 && ++good > 180) {
          rs = Math.min(1.0, rs + 0.05);
          good = 0;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * rs;
      const cw = canvas.clientWidth || 400;
      const ch = canvas.clientHeight || 200;
      const w = Math.max(1, Math.round(cw * dpr));
      const h = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if (!background) {
          if (defaultTex) gl.deleteTexture(defaultTex);
          defaultTex = createDefaultTexture(gl, w, h);
        }
      }

      const asp = w / h;
      const t = ms / 1000;
      const idle = !reducedMotion && performance.now() - lm > 2500;
      const tx = idle ? Math.sin(t * 0.55) * asp * 0.6 : m.x * asp;
      const ty = idle ? Math.cos(t * 0.8) * 0.45 : m.y;

      P0[0] += (tx - P0[0]) * 0.14;
      P0[1] += (ty - P0[1]) * 0.14;

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "T"), reducedMotion ? 3.0 : t);
      gl.uniform2f(gl.getUniformLocation(prog, "P0"), P0[0], P0[1]);

      gl.uniform1f(gl.getUniformLocation(prog, "cnt"), cnt);
      gl.uniform1f(gl.getUniformLocation(prog, "bend"), bend);
      gl.uniform1f(gl.getUniformLocation(prog, "disp"), disp);
      gl.uniform1f(gl.getUniformLocation(prog, "frost"), frost);
      gl.uniform1f(gl.getUniformLocation(prog, "ang"), ang);
      gl.uniform1f(gl.getUniformLocation(prog, "warp"), warp);
      gl.uniform1f(gl.getUniformLocation(prog, "edge"), edge);
      gl.uniform1f(gl.getUniformLocation(prog, "hl"), hl);
      gl.uniform1f(gl.getUniformLocation(prog, "pinf"), pinf);
      gl.uniform1f(gl.getUniformLocation(prog, "tin"), tin);
      const parsedTint = parseHex(tint);
      gl.uniform3f(gl.getUniformLocation(prog, "tint"), parsedTint[0], parsedTint[1], parsedTint[2]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, customTex || defaultTex);
      gl.uniform1i(gl.getUniformLocation(prog, "tx"), 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      hasRenderedOnce = true;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      if (defaultTex) gl.deleteTexture(defaultTex);
      if (customTex) gl.deleteTexture(customTex);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [cnt, bend, disp, frost, ang, warp, edge, hl, pinf, tin, tint, background, paused]);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      }}
      className={cn("block w-full h-full touch-none select-none", className)}
      style={style}
      {...props}
    />
  );
});

FlutedGlass.displayName = "FlutedGlass";
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
  content: `"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { cn } from "../utils/cn";
import { Eye, EyeOff, Droplets } from "lucide-react";

export interface FrostHoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  title?: string;
  subtitle?: string;
  price?: string;
  badge?: string;
  cardWidth?: number | string;
  cardHeight?: number | string;
  wipeRadius?: number;
  blurAmount?: number;
  showLabels?: boolean;
}

export const FrostHoverCard = React.forwardRef<HTMLDivElement, FrostHoverCardProps>(
  (
    {
      src,
      title = "Aero Stealth H1",
      subtitle = "CONDENSATION SEALED \u2022 ACTIVE ANC",
      price = "$780",
      badge = "Frosted Vapor",
      cardWidth = 360,
      cardHeight = 480,
      wipeRadius = 110,
      blurAmount = 16,
      showLabels = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const cardId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const frostLayerRef = useRef<HTMLDivElement>(null);

    const INITIAL_RADIUS = 55;
    const targetRadiusRef = useRef(INITIAL_RADIUS);
    const currRadiusRef = useRef(INITIAL_RADIUS);
    const animFrameRef = useRef<number | null>(null);

    const [isForceWiped, setIsForceWiped] = useState(false);
    const [wipePercent, setWipePercent] = useState(25);

    useEffect(() => {
      let isRunning = true;

      const physicsLoop = () => {
        if (!isRunning) return;

        const effectiveTarget = isForceWiped ? 1200 : targetRadiusRef.current;
        const delta = effectiveTarget - currRadiusRef.current;

        currRadiusRef.current += delta * 0.16;

        if (frostLayerRef.current) {
          const r = Math.max(INITIAL_RADIUS, currRadiusRef.current);
          frostLayerRef.current.style.setProperty("--r", \`\${r.toFixed(1)}px\`);
        }

        const pct = isForceWiped
          ? 100
          : Math.min(100, Math.max(0, Math.round((currRadiusRef.current / wipeRadius) * 100)));
        setWipePercent(pct);

        animFrameRef.current = requestAnimationFrame(physicsLoop);
      };

      animFrameRef.current = requestAnimationFrame(physicsLoop);

      return () => {
        isRunning = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [isForceWiped, wipeRadius]);

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!containerRef.current || isForceWiped) return;
        const rect = containerRef.current.getBoundingClientRect();

        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

        const xPct = (x / rect.width) * 100;
        const yPct = (y / rect.height) * 100;

        if (frostLayerRef.current) {
          frostLayerRef.current.style.setProperty("--mx", \`\${xPct.toFixed(1)}%\`);
          frostLayerRef.current.style.setProperty("--my", \`\${yPct.toFixed(1)}%\`);
        }

        targetRadiusRef.current = wipeRadius;
      },
      [isForceWiped, wipeRadius]
    );

    const handlePointerLeave = useCallback(() => {
      if (!isForceWiped) {
        targetRadiusRef.current = INITIAL_RADIUS;
      }
    }, [isForceWiped]);

    return (
      <div
        ref={ref}
        className={cn("group flex flex-col items-center select-none w-full h-full", className)}
        style={{
          width: typeof cardWidth === "number" ? \`\${cardWidth}px\` : cardWidth || "100%",
          height: typeof cardHeight === "number" ? \`\${cardHeight}px\` : cardHeight || "100%",
          ...style,
        }}
        {...props}
      >
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={cn(
            "relative w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300",
            showLabels
              ? "p-5 border border-white/10 bg-[hsl(225_12%_7%)] hover:border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_32px_-4px_rgba(0,0,0,0.5)] cursor-crosshair"
              : "p-0 border-0 bg-transparent shadow-none items-center justify-center cursor-crosshair"
          )}
          style={{
            minHeight: showLabels ? (typeof cardHeight === "number" ? \`\${cardHeight}px\` : cardHeight) : undefined,
          }}
        >
          {showLabels && (
            <>
              {/* Top specular rim */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-30" />

              {/* Top Header Plate */}
              <div className="relative z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-400">
                    {badge}
                  </span>
                </div>

                {/* Force Wipe Toggle */}
                <button
                  type="button"
                  onClick={() => setIsForceWiped(!isForceWiped)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-all cursor-pointer active:scale-95"
                  title="Toggle full glass wipe"
                >
                  <span>{isForceWiped ? "Steam up" : "Clear"}</span>
                </button>
              </div>
            </>
          )}

          {/* Ambient Silhouetting Glow (Ensures product is never pitch black) */}
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-65"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 48%, transparent 72%)",
            }}
          />

          {/* Base Product Visual */}
          <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none select-none">
            <img
              src={src}
              alt={title}
              className="w-full h-full max-h-[320px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)] transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Steamed / Frosted Glass Overlay with dynamic mask hole */}
          <div
            ref={frostLayerRef}
            className="absolute inset-0 pointer-events-none z-10 transition-[backdrop-filter] duration-300"
            style={{
              backdropFilter: \`blur(\${blurAmount}px) saturate(130%)\`,
              WebkitBackdropFilter: \`blur(\${blurAmount}px) saturate(130%)\`,
              backgroundColor: "rgba(10, 14, 23, 0.45)",
              maskImage:
                "radial-gradient(circle at var(--mx, 50%) var(--my, 45%), transparent 0px, transparent var(--r, 55px), black calc(var(--r, 55px) + 50px))",
              WebkitMaskImage:
                "radial-gradient(circle at var(--mx, 50%) var(--my, 45%), transparent 0px, transparent var(--r, 55px), black calc(var(--r, 55px) + 50px))",
            }}
          >
            {/* Fine Condensation Droplets Texture Grid */}
            <div
              className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 1.5px, transparent 1.5px), radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 2.5px, transparent 2.5px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.5) 2px, transparent 2px)",
                backgroundSize: "32px 32px, 54px 54px, 42px 42px",
              }}
            />

            {/* Steamy Vignette Edge */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(9,11,16,0.5) 100%)",
              }}
            />
          </div>

          {showLabels && (
            <div className="relative z-20 border-t border-white/8 pt-4">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {title}
                </h3>
                {price && (
                  <span className="text-sm font-mono font-bold text-zinc-200">
                    {price}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-400 font-mono tracking-wide">
                  {subtitle}
                </p>
                <span className="text-[10px] font-mono text-zinc-500">
                  {isForceWiped ? "100% Clear" : \`\${wipePercent}% Wiped\`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

FrostHoverCard.displayName = "FrostHoverCard";
`
};

// src/registry/glass-lens.ts
var glassLens = {
  name: "glass-lens",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "glass-lens.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface GlassLensProps extends React.HTMLAttributes<HTMLCanvasElement> {
  size?: number;
  thick?: number;
  disp?: number;
  blur?: number;
  mag?: number;
  smo?: number;
  rim?: number;
  spec?: number;
  lag?: number;
  tin?: number;
  tint?: string;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R,P0,P1,P2;uniform float T,K;uniform sampler2D tx;
uniform float size,thick,disp,blur,mag,smo,rim,spec,tin;uniform vec3 tint;
float sm(float a,float b,float k){float h=max(k-abs(a-b),0.)/k;return min(a,b)-h*h*k*.25;}
vec3 S(vec2 uv,vec2 o,float bl){vec2 b=vec2(bl*.012,0.);vec3 c=texture2D(tx,uv+o).rgb*2.;c+=texture2D(tx,uv+o+b).rgb+texture2D(tx,uv+o-b).rgb+texture2D(tx,uv+o+b.yx).rgb+texture2D(tx,uv+o-b.yx).rgb;return c/6.;}
float F(vec2 p){return sm(sm(length(p-P0)-size,length(p-P1)-size*.78,smo),length(p-P2)-size*.58,smo);}
void main(){
  vec2 uv=gl_FragCoord.xy/R,p=(gl_FragCoord.xy*2.-R)/R.y;
  float d=F(p);
  vec3 col=texture2D(tx,uv).rgb;
  col*=1.-.35*(1.-smoothstep(0.,.12,d))*step(0.,d);
  if(d<.01){
    vec2 e=vec2(.003,0.);
    vec2 g=normalize(vec2(F(p+e.xy)-F(p-e.xy),F(p+e.yx)-F(p-e.yx))+1e-5);
    float ed=clamp(-d/(size*.7),0.,1.),bev=pow(1.-ed,2.5)*thick;
    vec2 c0=(P0*R.y+R)*.5/R,u2=c0+(uv-c0)/mag,o=g*bev*.12*vec2(R.y/R.x,1.);
    vec3 c=vec3(S(u2,o*(1.+disp),blur).r,S(u2,o,blur).g,S(u2,o*(1.-disp),blur).b);
    c=mix(c,tint,tin);
    float L=dot(g,normalize(vec2(-.5,.85))),rm=pow(1.-ed,4.);
    c+=rim*rm*(.25+.75*max(L,0.));
    c*=1.-.25*rm*max(-L,0.);
    c+=spec*pow(max(L,0.),3.)*rm*1.4;
    col=mix(col,c,1.-smoothstep(-.003,.003,d));
  }
  gl_FragColor=vec4(col,1.);
}\`;

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function createDefaultTexture(gl: WebGLRenderingContext, w: number, h: number): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, w, h);
  const pal = ["#ff4a2b", "#25e0c0", "#ffc542", "#6a5cff"];
  pal.forEach((color, i) => {
    const a = [0.18, 0.88, 0.62, 0.08][i];
    const b = [0.25, 0.3, 0.95, 0.95][i];
    const g = ctx.createRadialGradient(w * a, h * b, 0, w * a, h * b, Math.max(w, h) * 0.5);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let y = 0; y < h; y += 14) {
    ctx.fillRect(0, y, w, 2);
  }
  const fs = Math.min(w / 4, h * 0.35);
  ctx.font = \`800 \${fs}px system-ui, -apple-system, sans-serif\`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Liquid", w * 0.06, h * 0.45);
  ctx.fillText("Glass", w * 0.06, h * 0.45 + fs * 0.88);
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export const GlassLens = forwardRef<HTMLCanvasElement, GlassLensProps>(function GlassLens(
  {
    size = 0.3,
    thick = 1.3,
    disp = 0.3,
    blur = 0.35,
    mag = 1.12,
    smo = 0.35,
    rim = 0.55,
    spec = 0.7,
    lag = 0.12,
    tin = 0.06,
    tint = "#9fd8ff",
    background,
    paused = false,
    className,
    style,
    ...props
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "q");
    gl.linkProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let defaultTex = createDefaultTexture(gl, canvas.clientWidth || 600, canvas.clientHeight || 400);
    let customTex: WebGLTexture | null = null;

    if (background) {
      if (typeof background === "string") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = background;
        img.onload = () => {
          if (!gl.isContextLost()) {
            customTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, customTex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          }
        };
      } else {
        customTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, customTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
    }

    const P = [0, 0, 0, 0, 0, 0];
    const m = { x: 0, y: 0 };
    let lm = -1e5;
    let isVisible = true;
    let isDocVisible = !document.hidden;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      m.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      m.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      lm = performance.now();
    };
    canvas.addEventListener("pointermove", onPointerMove);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let ema = 16.7;
    let rs = 1.0;
    let good = 0;
    let last = 0;
    let animId = 0;
    let hasRenderedOnce = false;

    const render = (ms: number) => {
      animId = requestAnimationFrame(render);
      if (paused || (!isVisible && hasRenderedOnce) || (!isDocVisible && hasRenderedOnce)) return;

      const dt = ms - last;
      last = ms;
      if (dt > 0 && dt < 200) {
        ema += (dt - ema) * 0.05;
        if (ema > 23 && rs > 0.5) {
          rs = Math.max(0.5, rs - 0.1);
          ema = 16.7;
          good = 0;
        } else if (ema < 17.6 && rs < 1.0 && ++good > 180) {
          rs = Math.min(1.0, rs + 0.05);
          good = 0;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.25) * rs;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if (!background) {
          if (defaultTex) gl.deleteTexture(defaultTex);
          defaultTex = createDefaultTexture(gl, w, h);
        }
      }

      const asp = w / h;
      const t = ms / 1000;
      const idle = !reducedMotion && performance.now() - lm > 2500;
      const tx = idle ? Math.sin(t * 0.55) * asp * 0.6 : m.x * asp;
      const ty = idle ? Math.cos(t * 0.8) * 0.45 : m.y;

      P[0] += (tx - P[0]) * 0.14;
      P[1] += (ty - P[1]) * 0.14;
      P[2] += (P[0] - P[2]) * lag;
      P[3] += (P[1] - P[3]) * lag;
      P[4] += (P[2] - P[4]) * lag;
      P[5] += (P[3] - P[5]) * lag;

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "K"), w / canvas.clientWidth);
      gl.uniform1f(gl.getUniformLocation(prog, "T"), reducedMotion ? 3.0 : t);
      gl.uniform2f(gl.getUniformLocation(prog, "P0"), P[0], P[1]);
      gl.uniform2f(gl.getUniformLocation(prog, "P1"), P[2], P[3]);
      gl.uniform2f(gl.getUniformLocation(prog, "P2"), P[4], P[5]);

      gl.uniform1f(gl.getUniformLocation(prog, "size"), size);
      gl.uniform1f(gl.getUniformLocation(prog, "thick"), thick);
      gl.uniform1f(gl.getUniformLocation(prog, "disp"), disp);
      gl.uniform1f(gl.getUniformLocation(prog, "blur"), blur);
      gl.uniform1f(gl.getUniformLocation(prog, "mag"), mag);
      gl.uniform1f(gl.getUniformLocation(prog, "smo"), smo);
      gl.uniform1f(gl.getUniformLocation(prog, "rim"), rim);
      gl.uniform1f(gl.getUniformLocation(prog, "spec"), spec);
      gl.uniform1f(gl.getUniformLocation(prog, "tin"), tin);
      const parsedTint = parseHex(tint);
      gl.uniform3f(gl.getUniformLocation(prog, "tint"), parsedTint[0], parsedTint[1], parsedTint[2]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, customTex || defaultTex);
      gl.uniform1i(gl.getUniformLocation(prog, "tx"), 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      hasRenderedOnce = true;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      if (defaultTex) gl.deleteTexture(defaultTex);
      if (customTex) gl.deleteTexture(customTex);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [size, thick, disp, blur, mag, smo, rim, spec, lag, tin, tint, background, paused]);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      }}
      className={cn("block w-full h-full touch-none select-none", className)}
      style={style}
      {...props}
    />
  );
});

GlassLens.displayName = "GlassLens";
`
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
  content: `"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { cn } from "../utils/cn";
import { Zap, RotateCcw } from "lucide-react";

export interface GlassShatterCardProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  title?: string;
  subtitle?: string;
  price?: string;
  badge?: string;
  cardWidth?: number | string;
  cardHeight?: number | string;
  gridCols?: number;
  gridRows?: number;
  jitterAmount?: number;
  shatterForce?: number;
  gravity?: number;
  autoRestoreDelay?: number;
  showLabels?: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface Shard {
  p0: Point;
  p1: Point;
  p2: Point;
  cx: number;
  cy: number;
  x: number;
  y: number;
  rot: number;
  vx: number;
  vy: number;
  vrot: number;
}

export const GlassShatterCard = React.forwardRef<HTMLDivElement, GlassShatterCardProps>(
  (
    {
      src,
      title = "Prism Chronometer",
      subtitle = "SHATTERED SAPPHIRE CRYSTAL",
      price = "$1,890",
      badge = "Glass Physics",
      cardWidth = 360,
      cardHeight = 480,
      gridCols = 5,
      gridRows = 6,
      jitterAmount = 0.35,
      shatterForce = 11,
      gravity = 0.36,
      autoRestoreDelay = 1600,
      showLabels = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const cardId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const shardsRef = useRef<Shard[]>([]);
    const animFrameRef = useRef<number | null>(null);
    const restoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isShatteredRef = useRef(false);
    const isReturningRef = useRef(false);
    const [isShatteredState, setIsShatteredState] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const buildMesh = useCallback(
      (width: number, height: number, dpr: number) => {
        const cols = Math.max(3, gridCols);
        const rows = Math.max(3, gridRows);
        const cellW = width / cols;
        const cellH = height / rows;

        const vertices: Point[][] = [];
        for (let r = 0; r <= rows; r++) {
          vertices[r] = [];
          for (let c = 0; c <= cols; c++) {
            let vx = c * cellW;
            let vy = r * cellH;

            if (c > 0 && c < cols && r > 0 && r < rows) {
              const jx = (Math.random() - 0.5) * cellW * jitterAmount;
              const jy = (Math.random() - 0.5) * cellH * jitterAmount;
              vx += jx;
              vy += jy;
            }

            vertices[r][c] = { x: vx * dpr, y: vy * dpr };
          }
        }

        const shards: Shard[] = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p00 = vertices[r][c];
            const p10 = vertices[r][c + 1];
            const p11 = vertices[r + 1][c + 1];
            const p01 = vertices[r + 1][c];

            const alternateDiag = (r + c) % 2 === 0;

            if (alternateDiag) {
              const t1_cx = (p00.x + p10.x + p11.x) / 3;
              const t1_cy = (p00.y + p10.y + p11.y) / 3;
              shards.push({
                p0: p00,
                p1: p10,
                p2: p11,
                cx: t1_cx,
                cy: t1_cy,
                x: 0,
                y: 0,
                rot: 0,
                vx: 0,
                vy: 0,
                vrot: 0,
              });

              const t2_cx = (p00.x + p11.x + p01.x) / 3;
              const t2_cy = (p00.y + p11.y + p01.y) / 3;
              shards.push({
                p0: p00,
                p1: p11,
                p2: p01,
                cx: t2_cx,
                cy: t2_cy,
                x: 0,
                y: 0,
                rot: 0,
                vx: 0,
                vy: 0,
                vrot: 0,
              });
            } else {
              const t1_cx = (p00.x + p10.x + p01.x) / 3;
              const t1_cy = (p00.y + p10.y + p01.y) / 3;
              shards.push({
                p0: p00,
                p1: p10,
                p2: p01,
                cx: t1_cx,
                cy: t1_cy,
                x: 0,
                y: 0,
                rot: 0,
                vx: 0,
                vy: 0,
                vrot: 0,
              });

              const t2_cx = (p10.x + p11.x + p01.x) / 3;
              const t2_cy = (p10.y + p11.y + p01.y) / 3;
              shards.push({
                p0: p10,
                p1: p11,
                p2: p01,
                cx: t2_cx,
                cy: t2_cy,
                x: 0,
                y: 0,
                rot: 0,
                vx: 0,
                vy: 0,
                vrot: 0,
              });
            }
          }
        }

        shardsRef.current = shards;
      },
      [gridCols, gridRows, jitterAmount]
    );

    useEffect(() => {
      if (!src) return;
      let cancelled = false;
      setIsLoaded(false);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;

      img.onload = () => {
        if (cancelled) return;
        imageRef.current = img;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const displayW = canvas.clientWidth || (typeof cardWidth === "number" ? cardWidth : 380);
        const displayH = canvas.clientHeight || (typeof cardHeight === "number" ? cardHeight : 380);

        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;

        buildMesh(displayW, displayH, dpr);
        setIsLoaded(true);
      };

      return () => {
        cancelled = true;
      };
    }, [src, buildMesh, cardWidth, cardHeight]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ro = new ResizeObserver(() => {
        if (!imageRef.current) return;
        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const w = canvas.clientWidth || 360;
        const h = canvas.clientHeight || 360;
        if (w > 30 && h > 30 && (Math.abs(canvas.width - w * dpr) > 4 || Math.abs(canvas.height - h * dpr) > 4)) {
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          buildMesh(w, h, dpr);
        }
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }, [buildMesh]);

    const triggerShatter = useCallback(
      (clientX?: number, clientY?: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !imageRef.current) return;

        if (restoreTimerRef.current) {
          clearTimeout(restoreTimerRef.current);
        }

        const rect = canvas.getBoundingClientRect();
        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

        const clickX = clientX !== undefined ? (clientX - rect.left) * dpr : canvas.width / 2;
        const clickY = clientY !== undefined ? (clientY - rect.top) * dpr : canvas.height / 2;

        const shards = shardsRef.current;
        const force = shatterForce * dpr;

        for (let i = 0; i < shards.length; i++) {
          const s = shards[i];
          const dx = s.cx - clickX;
          const dy = s.cy - clickY;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;

          const impulse = (force * (0.8 + Math.random() * 0.6)) / Math.max(1, dist * 0.015);
          s.vx = (dx / dist) * impulse + (Math.random() - 0.5) * 5 * dpr;
          s.vy = (dy / dist) * impulse - (3 + Math.random() * 7) * dpr;
          s.vrot = (Math.random() - 0.5) * 0.32;
        }

        isShatteredRef.current = true;
        isReturningRef.current = false;
        setIsShatteredState(true);

        restoreTimerRef.current = setTimeout(() => {
          isReturningRef.current = true;
        }, autoRestoreDelay);
      },
      [shatterForce, autoRestoreDelay]
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let isRunning = true;

      const render = () => {
        if (!isRunning) return;

        const img = imageRef.current;
        const shards = shardsRef.current;
        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (img && isLoaded && shards.length > 0) {
          const padding = 10 * dpr;
          const maxW = canvas.width - padding * 2;
          const maxH = canvas.height - padding * 2;
          const scale = Math.min(maxW / img.width, maxH / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const offsetX = (canvas.width - drawW) / 2;
          const offsetY = (canvas.height - drawH) / 2;

          let allSettled = true;
          const grav = gravity * dpr;

          for (let i = 0; i < shards.length; i++) {
            const s = shards[i];

            if (isShatteredRef.current) {
              if (isReturningRef.current) {
                const springStiffness = 0.09;
                const springDamping = 0.85;

                s.vx += (0 - s.x) * springStiffness;
                s.vy += (0 - s.y) * springStiffness;
                s.vrot += (0 - s.rot) * springStiffness;

                s.vx *= springDamping;
                s.vy *= springDamping;
                s.vrot *= springDamping;

                s.x += s.vx;
                s.y += s.vy;
                s.rot += s.vrot;

                if (
                  Math.abs(s.x) > 0.3 ||
                  Math.abs(s.y) > 0.3 ||
                  Math.abs(s.rot) > 0.01
                ) {
                  allSettled = false;
                } else {
                  s.x = 0;
                  s.y = 0;
                  s.rot = 0;
                  s.vx = 0;
                  s.vy = 0;
                  s.vrot = 0;
                }
              } else {
                s.vy += grav;
                s.vx *= 0.985;
                s.x += s.vx;
                s.y += s.vy;
                s.rot += s.vrot;
                allSettled = false;
              }
            }

            ctx.save();
            ctx.translate(s.cx + s.x, s.cy + s.y);
            if (s.rot !== 0) {
              ctx.rotate(s.rot);
            }

            ctx.beginPath();
            ctx.moveTo(s.p0.x - s.cx, s.p0.y - s.cy);
            ctx.lineTo(s.p1.x - s.cx, s.p1.y - s.cy);
            ctx.lineTo(s.p2.x - s.cx, s.p2.y - s.cy);
            ctx.closePath();

            ctx.clip();
            ctx.drawImage(img, offsetX - s.cx, offsetY - s.cy, drawW, drawH);

            if (s.x !== 0 || s.y !== 0) {
              ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
              ctx.lineWidth = 1 * dpr;
              ctx.stroke();
            }

            ctx.restore();
          }

          if (isShatteredRef.current && isReturningRef.current && allSettled) {
            isShatteredRef.current = false;
            isReturningRef.current = false;
            setIsShatteredState(false);
          }
        }

        animFrameRef.current = requestAnimationFrame(render);
      };

      animFrameRef.current = requestAnimationFrame(render);

      return () => {
        isRunning = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [gravity, isLoaded]);

    return (
      <div
        ref={ref}
        className={cn("group flex flex-col items-center select-none w-full h-full", className)}
        style={{
          width: typeof cardWidth === "number" ? \`\${cardWidth}px\` : cardWidth || "100%",
          height: typeof cardHeight === "number" ? \`\${cardHeight}px\` : cardHeight || "100%",
          ...style,
        }}
        {...props}
      >
        <div
          ref={containerRef}
          onClick={(e) => triggerShatter(e.clientX, e.clientY)}
          className={cn(
            "relative w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300",
            showLabels
              ? "p-5 border border-white/10 bg-[hsl(225_12%_7%)] hover:border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_32px_-4px_rgba(0,0,0,0.5)]"
              : "p-0 border-0 bg-transparent shadow-none items-center justify-center"
          )}
          style={{
            minHeight: showLabels ? (typeof cardHeight === "number" ? \`\${cardHeight}px\` : cardHeight) : undefined,
          }}
        >
          {showLabels && (
            <>
              {/* Top specular rim */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              {/* Top Header Plate */}
              <div className="relative z-10 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-400">
                    {badge}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/8">
                  <span>{isShatteredState ? "Shattered" : "Click to shatter"}</span>
                </div>
              </div>
            </>
          )}

          {/* Center Stage: Interactive Shard Canvas */}
          <div className={cn("relative w-full flex items-center justify-center", showLabels ? "h-[260px] my-auto" : "h-full")}>
            <canvas
              ref={canvasRef}
              className="w-full h-full"
            />
          </div>

          {showLabels && (
            <div className="relative z-10 border-t border-white/8 pt-4 pointer-events-none">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {title}
                </h3>
                {price && (
                  <span className="text-sm font-mono font-bold text-zinc-200">
                    {price}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-400 font-mono tracking-wide">
                  {subtitle}
                </p>
                <span className="text-[10px] font-mono text-zinc-500">
                  {gridCols * gridRows * 2} shards
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

GlassShatterCard.displayName = "GlassShatterCard";
`
};

// src/registry/gravity-grid.ts
var gravityGrid = {
  name: "gravity-grid",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "gravity-grid.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface GravityGridProps extends React.HTMLAttributes<HTMLCanvasElement> {
  cell?: number;
  lw?: number;
  mass?: number;
  fall?: number;
  dots?: number;
  wave?: number;
  glow?: number;
  lag?: number;
  bg?: string;
  ink?: string;
  hot?: string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R,P0,P1,P2;uniform float T;
uniform float cell,lw,mass,fall,dots,wave,glow;uniform vec3 bg,ink,hot;
void main(){
  vec2 p=(gl_FragCoord.xy*2.-R)/R.y,q=p;float gs=0.;
  for(int i=0;i<3;i++){
    vec2 m=i==0?P0:(i==1?P1:P2);float w=i==0?1.:(i==1?.65:.4);vec2 d=p-m;float r2=dot(d,d);
    float g=max(mass*w*exp(-r2*fall)*(1.+wave*.5*sin(sqrt(r2)*14.-T*3.)),-.9);q+=d*g;gs+=g;
  }
  float mg=1.+max(gs,-.9);vec2 u=q*cell*.5,f=fract(u)-.5,dl=(.5-abs(f))/cell*2./mg;
  float aa=3./R.y,dd=length(f)/cell*2./mg;
  float la=1.-smoothstep(lw*.5,lw*.5+aa,min(dl.x,dl.y)),da=1.-smoothstep(lw*1.8,lw*1.8+aa,dd);
  vec3 col=bg+hot*glow*.5*exp(-dot(p-P0,p-P0)*fall*.6);
  col=mix(col,mix(ink,hot,clamp(gs*.45,0.,1.)),mix(la,da,dots));
  gl_FragColor=vec4(col,1.);
}\`;

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export const GravityGrid = forwardRef<HTMLCanvasElement, GravityGridProps>(function GravityGrid(
  {
    cell = 24,
    lw = 0.012,
    mass = 1.6,
    fall = 3.2,
    dots = 0,
    wave = 0.5,
    glow = 0.6,
    lag = 0.1,
    bg = "#0b0c12",
    ink = "#cfd6ee",
    hot = "#ff6a3d",
    paused = false,
    className,
    style,
    ...props
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "q");
    gl.linkProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const P = [0, 0, 0, 0, 0, 0];
    const m = { x: 0, y: 0 };
    let lm = -1e5;
    let isVisible = true;
    let isDocVisible = !document.hidden;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      m.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      m.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      lm = performance.now();
    };
    canvas.addEventListener("pointermove", onPointerMove);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let ema = 16.7;
    let rs = 1.0;
    let good = 0;
    let last = 0;
    let animId = 0;
    let hasRenderedOnce = false;

    const render = (ms: number) => {
      animId = requestAnimationFrame(render);
      if (paused || (!isVisible && hasRenderedOnce) || (!isDocVisible && hasRenderedOnce)) return;

      const dt = ms - last;
      last = ms;
      if (dt > 0 && dt < 200) {
        ema += (dt - ema) * 0.05;
        if (ema > 23 && rs > 0.5) {
          rs = Math.max(0.5, rs - 0.1);
          ema = 16.7;
          good = 0;
        } else if (ema < 17.6 && rs < 1.0 && ++good > 180) {
          rs = Math.min(1.0, rs + 0.05);
          good = 0;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * rs;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const asp = w / h;
      const t = ms / 1000;
      const idle = !reducedMotion && performance.now() - lm > 2500;
      const tx = idle ? Math.sin(t * 0.55) * asp * 0.6 : m.x * asp;
      const ty = idle ? Math.cos(t * 0.8) * 0.45 : m.y;

      P[0] += (tx - P[0]) * 0.14;
      P[1] += (ty - P[1]) * 0.14;
      P[2] += (P[0] - P[2]) * lag;
      P[3] += (P[1] - P[3]) * lag;
      P[4] += (P[2] - P[4]) * lag;
      P[5] += (P[3] - P[5]) * lag;

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "T"), reducedMotion ? 3.0 : t);
      gl.uniform2f(gl.getUniformLocation(prog, "P0"), P[0], P[1]);
      gl.uniform2f(gl.getUniformLocation(prog, "P1"), P[2], P[3]);
      gl.uniform2f(gl.getUniformLocation(prog, "P2"), P[4], P[5]);

      gl.uniform1f(gl.getUniformLocation(prog, "cell"), cell);
      gl.uniform1f(gl.getUniformLocation(prog, "lw"), lw);
      gl.uniform1f(gl.getUniformLocation(prog, "mass"), mass);
      gl.uniform1f(gl.getUniformLocation(prog, "fall"), fall);
      gl.uniform1f(gl.getUniformLocation(prog, "dots"), dots);
      gl.uniform1f(gl.getUniformLocation(prog, "wave"), wave);
      gl.uniform1f(gl.getUniformLocation(prog, "glow"), glow);

      const parsedBg = parseHex(bg);
      const parsedInk = parseHex(ink);
      const parsedHot = parseHex(hot);
      gl.uniform3f(gl.getUniformLocation(prog, "bg"), parsedBg[0], parsedBg[1], parsedBg[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "ink"), parsedInk[0], parsedInk[1], parsedInk[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "hot"), parsedHot[0], parsedHot[1], parsedHot[2]);

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      hasRenderedOnce = true;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [cell, lw, mass, fall, dots, wave, glow, lag, bg, ink, hot, paused]);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      }}
      className={cn("block w-full h-full touch-none select-none", className)}
      style={style}
      {...props}
    />
  );
});

GravityGrid.displayName = "GravityGrid";
`
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
  src?: string;
  title?: string;
  subtitle?: string;
  price?: string;
  holoColors?: string[];
  finishes?: ProductFinishItem[];
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
      src,
      title,
      subtitle,
      price,
      holoColors,
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
    const items = useMemo<ProductFinishItem[]>(() => {
      if (finishes && finishes.length > 0) return finishes;
      if (src) {
        return [
          {
            id: "default-finish",
            name: title || "Product Finish",
            label: subtitle || "PRO EDITION",
            image: src,
            holoColors: holoColors || [
              "rgba(255, 255, 255, 0.9)",
              "rgba(212, 212, 216, 0.7)",
              "rgba(161, 161, 170, 0.6)",
              "rgba(250, 250, 250, 0.95)",
            ],
            price: price,
          },
        ];
      }
      return [];
    }, [finishes, src, title, subtitle, price, holoColors]);

    const [internalSelectedId, setInternalSelectedId] = useState<string>(() => {
      return selectedFinishId || (items.length > 0 ? items[0].id : "");
    });

    const activeId = selectedFinishId ?? internalSelectedId;
    const activeFinish = useMemo(() => {
      const found = items.find((f) => f.id === activeId);
      return found || items[0] || null;
    }, [items, activeId]);

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
      if (!rectRef.current) {
        if (cardRef.current) {
          rectRef.current = cardRef.current.getBoundingClientRect();
        }
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
    const refCode = (() => {
      const seed = \`\${activeFinish.id}:\${activeFinish.name}:\${activeFinish.label ?? ""}\`;
      let h = 2166136261;
      for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return (h >>> 0).toString(16).slice(-4).toUpperCase().padStart(4, "0");
    })();

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center select-none w-full h-full", className)}
        style={{
          width: widthStyle || "100%",
          height: heightStyle || "100%",
          ...style,
        }}
        {...props}
      >
        {/* 3D Perspective Viewport */}
        <div
          ref={containerRef}
          className="relative w-full h-full"
          style={{
            height: heightStyle || "100%",
            perspective: \`\${perspective}px\`,
          }}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {/* Inner 3D Card Layer */}
          <div
            ref={cardRef}
            className={cn(
              "relative w-full h-full rounded-2xl overflow-hidden cursor-pointer",
              showLabels
                ? "border border-border bg-card shadow-2xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                : "border-0 bg-transparent shadow-none"
            )}
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
              touchAction: "pan-y",
            }}
            onClick={() => handleSelect(activeFinish)}
          >
            {/* Ambient tinted radial glow */}
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-700 opacity-15 dark:opacity-20"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.12) 0%, transparent 65%)",
              }}
            />

            {/* Subtle card grid texture / hairline accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Specular Glare Layer */}
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

            {/* Header Plate (Elevated in 3D) */}
            {showLabels && (
              <div
                className="absolute top-0 inset-x-0 p-5 sm:p-6 flex items-start justify-between pointer-events-none z-10"
                style={{
                  transform: "translateZ(28px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                    {activeFinish.label || "FINISH SPEC"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-medium tracking-[0.08em] text-foreground">
                      REF. {refCode}
                    </span>
                  </div>
                </div>

                {activeFinish.price && (
                  <div className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border text-xs font-mono font-semibold">
                    {activeFinish.price}
                  </div>
                )}
              </div>
            )}

            {/* Floating 3D Product & Hologram Container */}
            <div
              className="absolute inset-0 flex items-center justify-center p-8 sm:p-10 pointer-events-none"
              style={{
                transform: \`translateZ(\${elevateZ}px)\`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Product Base Image */}
              <img
                src={activeFinish.image}
                alt={activeFinish.name}
                className="relative max-w-full max-h-full object-contain pointer-events-none select-none transition-all duration-500"
                style={{
                  filter:
                    "drop-shadow(0 25px 35px rgba(0,0,0,0.45)) drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
                }}
              />

              {/* Holographic Iridescent Foil Layer (Masked strictly to product silhouette) */}
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

            {/* Footer Finish Details (Elevated in 3D) */}
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
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-sans">
                      {activeFinish.name}
                    </h3>
                    {activeFinish.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 max-w-[240px] leading-relaxed">
                        {activeFinish.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary border border-border">
                    <span className="text-[10px] font-mono font-medium text-secondary-foreground uppercase">
                      Finish
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Finish Swatch Selector Bar (Outside 3D canvas for crisp clicking) */}
        {showSwatches && items.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border backdrop-blur-md max-w-full">
            {items.map((finish) => {
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
                      ? "bg-card text-foreground shadow-xs font-semibold border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent"
                  )}
                >
                  {/* Holographic mini color swatch badge */}
                  <span
                    className={cn(
                      "w-3.5 h-3.5 rounded-full transition-transform duration-200 shrink-0",
                      isSelected ? "scale-110 ring-2 ring-offset-1 ring-ring ring-offset-background" : "group-hover:scale-105"
                    )}
                    style={{
                      background: \`linear-gradient(135deg, \${finish.holoColors.join(", ")})\`,
                      boxShadow: isSelected ? "0 0 6px rgba(255, 255, 255, 0.3)" : "none",
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

export default HoloFinishCard;
`
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
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        glass: "backdrop-blur-md bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5",
        gradient: "border-border bg-muted/20",
        underline: "rounded-none border-t-0 border-x-0 border-b border-input bg-transparent px-1 shadow-none focus-visible:ring-0 focus-visible:border-b-foreground",
        otp: "text-center text-lg font-bold",
        tags: "hidden", // Handled by tags wrapper styles
        autocomplete: "",
      },
    },
    defaultVariants: {
      variant: "default",
    }
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue">,
    VariantProps<typeof inputVariants> {
  animate?: boolean;
  value?: string;
  defaultValue?: string | number;
  onChange?: (value: string) => void;
  otpValue?: string;
  onOtpChange?: (value: string) => void;
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
  suggestions?: string[];
  onSuggestionSelect?: (value: string) => void;
  label?: string;
  description?: string;
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

    const inputId = id || React.useId();
    const descId = description ? \`\${inputId}-desc\` : undefined;
    const errId = error ? \`\${inputId}-err\` : undefined;
    const isOtp = variant === "otp";
    const isTags = variant === "tags";
    const isAutocomplete = variant === "autocomplete";

    const otpLength = 6;
    const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    
    const otpArray = React.useMemo(() => {
      const arr = Array(otpLength).fill("");
      for (let i = 0; i < Math.min(otpValue.length, otpLength); i++) {
        arr[i] = otpValue[i];
      }
      return arr;
    }, [otpValue]);

    const handleOtpChange = (val: string, index: number) => {
      const newOtp = [...otpArray];
      newOtp[index] = val.slice(-1);
      const newOtpString = newOtp.join("");
      onOtpChange?.(newOtpString);

      if (val !== "" && index < otpLength - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace" && otpArray[index] === "" && index > 0) {
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
        const nextFocusIndex = Math.min(pastedData.length, otpLength - 1);
        otpRefs.current[nextFocusIndex]?.focus();
      }
    };


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
        const newTags = tags.slice(0, -1);
        onTagsChange?.(newTags);
      }
    };

    const handleRemoveTag = (idx: number) => {
      const newTags = tags.filter((_, i) => i !== idx);
      onTagsChange?.(newTags);
    };


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



    const { ...htmlProps } = props;

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
              {...(htmlProps as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          ))}
        </div>
      );
    }

    if (isTags) {
      return (
        <div
          className={cn(
            "flex flex-wrap items-center gap-1.5 min-h-[38px] w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
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
                className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground border border-border text-xs font-medium px-2 py-0.5 rounded-md"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(idx)}
                  className="hover:bg-muted rounded p-0.5"
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
            {...(htmlProps as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        </div>
      );
    }

    const textInputContent = (
      <input
        ref={ref}
        type={type}
        value={currentValue}
        onChange={handleInputChange}
        className={cn(inputVariants({ variant: isAutocomplete ? "autocomplete" : variant, className }))}
        onFocus={() => isAutocomplete && setFocused(true)}
        {...(htmlProps as React.InputHTMLAttributes<HTMLInputElement>)}
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
                className="absolute z-50 w-full mt-1.5 bg-popover border border-border shadow-md rounded-md overflow-hidden max-h-[200px] overflow-y-auto p-1 space-y-0.5"
              >
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={item + idx}
                    type="button"
                    onClick={() => {
                      onSuggestionSelect?.(item)
                      setFocused(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors outline-none focus:bg-accent focus:text-accent-foreground"
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
          className={cn(inputVariants({ variant: isAutocomplete ? "autocomplete" : variant, className }), error && "border-destructive focus-visible:ring-destructive")}
          onFocus={() => isAutocomplete && setFocused(true)}
          {...(htmlProps as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      </motion.div>
    );

    if (!label && !description && !error) {
      return inputElement;
    }

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
            "border-destructive focus-visible:ring-destructive text-destructive placeholder:text-destructive/50 pr-10",
            className
          )}
          {...props}
        />
        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
      </div>
      {errorMessage && <span className="text-xs text-destructive px-1">{errorMessage}</span>}
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
          "border-success focus-visible:ring-success text-success placeholder:text-success/50 pr-10",
          className
        )}
        {...props}
      />
      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
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
              ? "-top-1 text-[10px] font-bold text-foreground bg-background px-1"
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
        "border-0 bg-muted/40 hover:bg-muted/60 focus:bg-background border-b-2 border-transparent focus:border-foreground rounded-t-xl rounded-b-none",
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
  code: string;
  filename?: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  theme?: CodeBlockTheme;
  copyable?: boolean;
  badgeText?: string;
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
    header: 'bg-zinc-900/90 border-primary/30',
    text: 'text-zinc-200',
    border: 'border-primary/40',
  },
  neon: {
    container: 'bg-zinc-950 text-zinc-100 shadow-sm',
    header: 'bg-zinc-900 border-zinc-800',
    text: 'text-zinc-200',
    border: 'border-zinc-700',
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
      } catch {
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

// src/registry/liquid-smear.ts
var liquidSmear = {
  name: "liquid-smear",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "liquid-smear.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface LiquidSmearProps extends React.HTMLAttributes<HTMLCanvasElement> {
  push?: number;
  rad?: number;
  relax?: number;
  spread?: number;
  amt?: number;
  disp?: number;
  spec?: number;
  shade?: number;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";

const FS_SIM = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R,P0,pv;uniform sampler2D fd;
uniform float rad,relax,spread;
vec2 dec(vec2 e){return (e*255.-127.)/127.;}
void main(){
  vec2 uv=gl_FragCoord.xy/R,px=1./R;
  vec2 c=dec(texture2D(fd,uv).xy),s=(dec(texture2D(fd,uv+vec2(px.x,0.)).xy)+dec(texture2D(fd,uv-vec2(px.x,0.)).xy)+dec(texture2D(fd,uv+vec2(0.,px.y)).xy)+dec(texture2D(fd,uv-vec2(0.,px.y)).xy))*.25;
  vec2 v=mix(c,s,spread)*relax;v=sign(v)*max(abs(v)-.004,0.);
  vec2 p=(uv*2.-1.)*vec2(R.x/R.y,1.);float d=length(p-P0);v+=pv*exp(-d*d/(rad*rad));
  v=clamp(v,-1.,1.);gl_FragColor=vec4(v*127./255.+127./255.,0.,1.);
}\`;

const FS_DRAW = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform sampler2D tx,fd;
uniform float amt,disp,spec,shade;
vec2 dec(vec2 e){return (e*255.-127.)/127.;}
void main(){
  vec2 uv=gl_FragCoord.xy/R,v=dec(texture2D(fd,uv).xy),o=-v*amt*.07*vec2(R.y/R.x,1.);
  vec3 c=vec3(texture2D(tx,uv+o*(1.+disp)).r,texture2D(tx,uv+o).g,texture2D(tx,uv+o*(1.-disp)).b);
  float m=clamp(length(v)*2.,0.,1.);vec3 n=normalize(vec3(-v*shade,1.));
  c+=spec*pow(max(dot(n,normalize(vec3(-.4,.6,.7))),0.),30.)*m;c*=1.-m*.08;gl_FragColor=vec4(c,1.);
}\`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function createDefaultTexture(gl: WebGLRenderingContext, w: number, h: number): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, w, h);
  const pal = ["#ff4a2b", "#25e0c0", "#ffc542", "#2d4bff"];
  pal.forEach((color, i) => {
    const a = [0.18, 0.88, 0.62, 0.08][i];
    const b = [0.25, 0.3, 0.95, 0.95][i];
    const g = ctx.createRadialGradient(w * a, h * b, 0, w * a, h * b, Math.max(w, h) * 0.5);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let y = 0; y < h; y += 14) {
    ctx.fillRect(0, y, w, 2);
  }
  const fs = Math.min(w / 4, h * 0.35);
  ctx.font = \`800 \${fs}px system-ui, -apple-system, sans-serif\`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Liquid", w * 0.06, h * 0.45);
  ctx.fillText("Type", w * 0.06, h * 0.45 + fs * 0.88);
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

interface FBOData {
  w: number;
  h: number;
  tx: WebGLTexture[];
  fb: WebGLFramebuffer[];
  i: number;
}

function makeFBO(gl: WebGLRenderingContext, fw: number, fh: number): FBOData | null {
  const z = new Uint8Array(fw * fh * 4);
  for (let i = 0; i < z.length; i += 4) {
    z[i] = 127;
    z[i + 1] = 127;
    z[i + 3] = 255;
  }
  const tx: WebGLTexture[] = [];
  const fb: WebGLFramebuffer[] = [];
  for (let i = 0; i < 2; i++) {
    const t = gl.createTexture();
    if (!t) return null;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fw, fh, 0, gl.RGBA, gl.UNSIGNED_BYTE, z);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const f = gl.createFramebuffer();
    if (!f) return null;
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    tx.push(t);
    fb.push(f);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { w: fw, h: fh, tx, fb, i: 0 };
}

export const LiquidSmear = forwardRef<HTMLCanvasElement, LiquidSmearProps>(function LiquidSmear(
  {
    push = 1.4,
    rad = 0.22,
    relax = 0.975,
    spread = 0.35,
    amt = 1,
    disp = 0.4,
    spec = 0.6,
    shade = 3,
    background,
    paused = false,
    className,
    style,
    ...props
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fsSim = compileShader(gl, gl.FRAGMENT_SHADER, FS_SIM);
    const fsDraw = compileShader(gl, gl.FRAGMENT_SHADER, FS_DRAW);
    if (!vs || !fsSim || !fsDraw) return;

    const progSim = gl.createProgram();
    const progDraw = gl.createProgram();
    if (!progSim || !progDraw) return;

    gl.attachShader(progSim, vs);
    gl.attachShader(progSim, fsSim);
    gl.bindAttribLocation(progSim, 0, "q");
    gl.linkProgram(progSim);

    gl.attachShader(progDraw, vs);
    gl.attachShader(progDraw, fsDraw);
    gl.bindAttribLocation(progDraw, 0, "q");
    gl.linkProgram(progDraw);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let defaultTex = createDefaultTexture(gl, canvas.clientWidth || 600, canvas.clientHeight || 400);
    let customTex: WebGLTexture | null = null;

    if (background) {
      if (typeof background === "string") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = background;
        img.onload = () => {
          if (!gl.isContextLost()) {
            customTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, customTex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          }
        };
      } else {
        customTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, customTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
    }

    let fbo: FBOData | null = null;

    const m = { x: 0, y: 0 };
    const P0 = [0, 0];
    let prevP = [0, 0];
    let lm = -1e5;
    let isVisible = true;
    let isDocVisible = !document.hidden;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      m.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      m.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      lm = performance.now();
    };
    canvas.addEventListener("pointermove", onPointerMove);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let ema = 16.7;
    let rs = 1.0;
    let good = 0;
    let last = 0;
    let animId = 0;
    let hasRenderedOnce = false;

    const render = (ms: number) => {
      animId = requestAnimationFrame(render);
      if (paused || (!isVisible && hasRenderedOnce) || (!isDocVisible && hasRenderedOnce)) return;

      const dt = ms - last;
      last = ms;
      if (dt > 0 && dt < 200) {
        ema += (dt - ema) * 0.05;
        if (ema > 23 && rs > 0.5) {
          rs = Math.max(0.5, rs - 0.1);
          ema = 16.7;
          good = 0;
        } else if (ema < 17.6 && rs < 1.0 && ++good > 180) {
          rs = Math.min(1.0, rs + 0.05);
          good = 0;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * rs;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if (!background) {
          if (defaultTex) gl.deleteTexture(defaultTex);
          defaultTex = createDefaultTexture(gl, w, h);
        }
      }

      const asp = w / h;
      const t = ms / 1000;
      const idle = !reducedMotion && performance.now() - lm > 2500;
      const tx = idle ? Math.sin(t * 0.55) * asp * 0.6 : m.x * asp;
      const ty = idle ? Math.cos(t * 0.8) * 0.45 : m.y;

      P0[0] += (tx - P0[0]) * 0.14;
      P0[1] += (ty - P0[1]) * 0.14;

      const fw = Math.min(512, Math.round(w * 0.4));
      const fh = Math.max(2, Math.round(fw / asp));
      if (!fbo || fbo.w !== fw || fbo.h !== fh) {
        if (fbo) {
          fbo.tx.forEach((t) => gl.deleteTexture(t));
          fbo.fb.forEach((f) => gl.deleteFramebuffer(f));
        }
        fbo = makeFBO(gl, fw, fh);
      }

      if (fbo) {
        gl.useProgram(progSim);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fb[1 - fbo.i]);
        gl.viewport(0, 0, fw, fh);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, fbo.tx[fbo.i]);
        gl.uniform1i(gl.getUniformLocation(progSim, "fd"), 1);

        gl.uniform2f(gl.getUniformLocation(progSim, "R"), fw, fh);
        gl.uniform2f(gl.getUniformLocation(progSim, "P0"), P0[0], P0[1]);
        gl.uniform2f(
          gl.getUniformLocation(progSim, "pv"),
          (P0[0] - prevP[0]) * 12 * push,
          (P0[1] - prevP[1]) * 12 * push
        );
        prevP = [P0[0], P0[1]];

        gl.uniform1f(gl.getUniformLocation(progSim, "rad"), rad);
        gl.uniform1f(gl.getUniformLocation(progSim, "relax"), relax);
        gl.uniform1f(gl.getUniformLocation(progSim, "spread"), spread);

        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      hasRenderedOnce = true;
        fbo.i = 1 - fbo.i;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }

      gl.viewport(0, 0, w, h);
      gl.useProgram(progDraw);

      gl.uniform2f(gl.getUniformLocation(progDraw, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(progDraw, "amt"), amt);
      gl.uniform1f(gl.getUniformLocation(progDraw, "disp"), disp);
      gl.uniform1f(gl.getUniformLocation(progDraw, "spec"), spec);
      gl.uniform1f(gl.getUniformLocation(progDraw, "shade"), shade);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, customTex || defaultTex);
      gl.uniform1i(gl.getUniformLocation(progDraw, "tx"), 0);

      if (fbo) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, fbo.tx[fbo.i]);
        gl.uniform1i(gl.getUniformLocation(progDraw, "fd"), 1);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      hasRenderedOnce = true;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      if (defaultTex) gl.deleteTexture(defaultTex);
      if (customTex) gl.deleteTexture(customTex);
      if (fbo) {
        fbo.tx.forEach((t) => gl.deleteTexture(t));
        fbo.fb.forEach((f) => gl.deleteFramebuffer(f));
      }
      gl.deleteBuffer(quad);
      gl.deleteProgram(progSim);
      gl.deleteProgram(progDraw);
      gl.deleteShader(vs);
      gl.deleteShader(fsSim);
      gl.deleteShader(fsDraw);
    };
  }, [push, rad, relax, spread, amt, disp, spec, shade, background, paused]);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      }}
      className={cn("block w-full h-full touch-none select-none", className)}
      style={style}
      {...props}
    />
  );
});

LiquidSmear.displayName = "LiquidSmear";
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
  content: `"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useId, useMemo } from "react";
import { cn } from "../utils/cn";

export interface LiveObjectProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  accentColor?: string;
  autoplayIntro?: boolean;
  width?: number | string;
  height?: number | string;
  alt?: string;
  maxTilt?: number;
  perspective?: number;
  ambientSweep?: boolean;
}

interface Streak {
  id: number;
  angle: number;
  length: number;
  width: number;
  delay: number;
}

export const LiveObject = React.forwardRef<HTMLDivElement, LiveObjectProps>(
  (
    {
      src,
      accentColor = "#fafafa",
      autoplayIntro = true,
      width = 440,
      height = 480,
      alt = "Live Object",
      maxTilt = 30,
      perspective = 1000,
      ambientSweep = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const objectId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const objectWrapperRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    const targetTiltRef = useRef({ x: 0, y: 0 });
    const currentTiltRef = useRef({ x: 0, y: 0 });
    const isHoveringRef = useRef(false);
    const animFrameRef = useRef<number | null>(null);

    const [gyroSupported, setGyroSupported] = useState(false);
    const [gyroActive, setGyroActive] = useState(false);
    const calibRef = useRef<{ beta: number; gamma: number } | null>(null);

    const [introActive, setIntroActive] = useState(false);
    const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
    const [flashOpacity, setFlashOpacity] = useState(0);
    const [glitchOffset, setGlitchOffset] = useState(0);
    const [scaleBounce, setScaleBounce] = useState(1);
    const [streaks, setStreaks] = useState<Streak[]>([]);

    const { chromaShadow, lightGlow } = useMemo(() => {
      return {
        chromaShadow: "rgba(255, 255, 255, 0.4)",
        lightGlow: accentColor,
      };
    }, [accentColor]);

    useEffect(() => {
      if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        if (isTouch) {
          setGyroSupported(true);
        }
      }
    }, []);

    const triggerIgnition = useCallback(() => {
      setIntroActive(true);

      const newStreaks: Streak[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i * 360) / 12 + (Math.random() - 0.5) * 22,
        length: 180 + Math.random() * 140,
        width: 1.5 + Math.random() * 2.5,
        delay: Math.random() * 60,
      }));
      setStreaks(newStreaks);

      const startTime = performance.now();
      const introDuration = 700; 

      const stepIntro = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(1, elapsed / introDuration);

        if (progress < 0.1) {
          setFlashOpacity((progress / 0.1) * 0.85);
        } else {
          const decayProgress = (progress - 0.1) / 0.9;
          setFlashOpacity(Math.max(0, 0.85 * Math.pow(1 - decayProgress, 3)));
        }

        if (progress < 0.85) {
          const glitchProgress = progress / 0.85;
          const jitter = (Math.random() - 0.5) * 4;
          setGlitchOffset(Math.max(0, (1 - glitchProgress) * 16 + jitter));
        } else {
          setGlitchOffset(0);
        }

        let s = 1;
        if (progress < 0.4) {
          const p = progress / 0.4;
          s = 0.5 + (1.08 - 0.5) * Math.sin((p * Math.PI) / 2);
        } else if (progress < 0.75) {
          const p = (progress - 0.4) / 0.35;
          s = 1.08 - (1.08 - 0.96) * Math.sin((p * Math.PI) / 2);
        } else {
          const p = (progress - 0.75) / 0.25;
          s = 0.96 + (1.0 - 0.96) * Math.sin((p * Math.PI) / 2);
        }
        setScaleBounce(s);

        if (progress < 1) {
          requestAnimationFrame(stepIntro);
        } else {
          setIntroActive(false);
          setFlashOpacity(0);
          setGlitchOffset(0);
          setScaleBounce(1);
          setStreaks([]);
        }
      };

      requestAnimationFrame(stepIntro);
    }, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !autoplayIntro || hasPlayedIntro) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !hasPlayedIntro) {
              setHasPlayedIntro(true);
              triggerIgnition();
              observer.disconnect();
              break;
            }
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(container);
      return () => observer.disconnect();
    }, [autoplayIntro, hasPlayedIntro, triggerIgnition]);

    const toggleGyro = useCallback(async () => {
      if (typeof window === "undefined") return;

      const DeviceOrientationEventAny = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };

      if (typeof DeviceOrientationEventAny?.requestPermission === "function") {
        try {
          const perm = await DeviceOrientationEventAny.requestPermission();
          if (perm === "granted") {
            setGyroActive(true);
            calibRef.current = null;
          }
        } catch {
        }
      } else {
        setGyroActive((prev) => !prev);
        calibRef.current = null;
      }
    }, []);

    useEffect(() => {
      if (!gyroActive) return;

      const handleOrientation = (e: DeviceOrientationEvent) => {
        const beta = e.beta ?? 0;
        const gamma = e.gamma ?? 0;

        if (!calibRef.current) {
          calibRef.current = { beta, gamma };
          return;
        }

        const deltaGamma = gamma - calibRef.current.gamma;
        const deltaBeta = beta - calibRef.current.beta;

        const clampedY = Math.max(-maxTilt, Math.min(maxTilt, deltaGamma));
        const clampedX = Math.max(-maxTilt, Math.min(maxTilt, -deltaBeta));

        targetTiltRef.current = { x: clampedX, y: clampedY };
      };

      window.addEventListener("deviceorientation", handleOrientation);
      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }, [gyroActive, maxTilt]);

    useEffect(() => {
      let isRunning = true;
      let idleTime = 0;

      const physicsLoop = () => {
        if (!isRunning) return;

        idleTime += 0.016;

        let tx = targetTiltRef.current.x;
        let ty = targetTiltRef.current.y;

        if (!isHoveringRef.current && !gyroActive && !introActive) {
          tx += Math.sin(idleTime * 1.4) * 3;
          ty += Math.cos(idleTime * 1.1) * 3.5;
        }

        const lerpFactor = 0.085;
        currentTiltRef.current.x += (tx - currentTiltRef.current.x) * lerpFactor;
        currentTiltRef.current.y += (ty - currentTiltRef.current.y) * lerpFactor;

        const curX = currentTiltRef.current.x;
        const curY = currentTiltRef.current.y;

        if (objectWrapperRef.current) {
          objectWrapperRef.current.style.transform = \`perspective(\${perspective}px) rotateX(\${curX.toFixed(
            2
          )}deg) rotateY(\${curY.toFixed(2)}deg) scale3d(\${scaleBounce.toFixed(
            3
          )}, \${scaleBounce.toFixed(3)}, \${scaleBounce.toFixed(3)})\`;
        }

        if (glareRef.current) {
          const gx = 50 + (curY / maxTilt) * 45;
          const gy = 50 - (curX / maxTilt) * 45;
          glareRef.current.style.setProperty("--gx", \`\${gx.toFixed(1)}%\`);
          glareRef.current.style.setProperty("--gy", \`\${gy.toFixed(1)}%\`);
        }

        animFrameRef.current = requestAnimationFrame(physicsLoop);
      };

      animFrameRef.current = requestAnimationFrame(physicsLoop);

      return () => {
        isRunning = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [maxTilt, perspective, scaleBounce, gyroActive, introActive]);

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!containerRef.current || gyroActive) return;
        isHoveringRef.current = true;

        const rect = containerRef.current.getBoundingClientRect();
        const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        targetTiltRef.current = {
          x: Math.max(-maxTilt, Math.min(maxTilt, -normY * maxTilt)),
          y: Math.max(-maxTilt, Math.min(maxTilt, normX * maxTilt)),
        };
      },
      [gyroActive, maxTilt]
    );

    const handlePointerLeave = useCallback(() => {
      isHoveringRef.current = false;
      if (!gyroActive) {
        targetTiltRef.current = { x: 0, y: 0 };
      }
    }, [gyroActive]);

    const handleTouchMove = useCallback(
      (e: React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current || gyroActive) return;
        isHoveringRef.current = true;
        const touch = e.touches[0];
        if (!touch) return;

        const rect = containerRef.current.getBoundingClientRect();
        const normX = (touch.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const normY = (touch.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

        targetTiltRef.current = {
          x: Math.max(-maxTilt, Math.min(maxTilt, -normY * maxTilt)),
          y: Math.max(-maxTilt, Math.min(maxTilt, normX * maxTilt)),
        };
      },
      [gyroActive, maxTilt]
    );

    const handleTouchEnd = useCallback(() => {
      isHoveringRef.current = false;
      if (!gyroActive) {
        targetTiltRef.current = { x: 0, y: 0 };
      }
    }, [gyroActive]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center select-none overflow-hidden touch-none",
          className
        )}
        style={{
          width: typeof width === "number" ? \`\${width}px\` : width,
          height: typeof height === "number" ? \`\${height}px\` : height,
          ...style,
        }}
        {...props}
      >
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {/* Floor contact shadow - grounds the object physically */}
          <div
            className="absolute left-1/2 bottom-[9%] h-6 w-[58%] -translate-x-1/2 rounded-[50%] pointer-events-none"
            style={{
              background:
                "radial-gradient(closest-side, rgba(0,0,0,0.45), rgba(0,0,0,0.18) 55%, transparent)",
            }}
          />

          {/* Ambient Diagonal Light Sweep (Passes behind object every 5-6s) */}
          {ambientSweep && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ opacity: 0.15 }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: \`linear-gradient(115deg, transparent 35%, \${accentColor} 50%, transparent 65%)\`,
                  animation: "liveObjectSweep 5.8s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
              PHASE 1: IGNITION LIGHT STREAKS (10-14 streaks)
          \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}
          {introActive && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
              {streaks.map((s) => (
                <div
                  key={s.id}
                  className="absolute origin-left rounded-full"
                  style={{
                    width: \`\${s.length}px\`,
                    height: \`\${s.width}px\`,
                    background: \`linear-gradient(90deg, transparent 0%, \${accentColor} 40%, #ffffff 80%, transparent 100%)\`,
                    transform: \`rotate(\${s.angle}deg)\`,
                    animation: \`liveStreakShoot 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards \${s.delay}ms\`,
                  }}
                />
              ))}
            </div>
          )}

          {/* White / Accent Screen Flash */}
          <div
            className="absolute inset-0 pointer-events-none z-40 transition-opacity duration-75"
            style={{
              backgroundColor: "#ffffff",
              opacity: flashOpacity,
              mixBlendMode: "screen",
            }}
          />

          {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
              PHASE 2: 3D FLOATING OBJECT STAGE
          \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}
          <div
            ref={objectWrapperRef}
            className="relative w-[78%] h-[78%] flex items-center justify-center will-change-transform"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* The Transparent PNG Object with Alpha RGB Glitch Drop-Shadow */}
            <img
              src={src}
              alt={alt}
              className="relative w-full h-full object-contain pointer-events-none select-none z-10"
              style={{
                filter:
                  glitchOffset > 0.1
                    ? \`drop-shadow(\${glitchOffset.toFixed(1)}px 0 \${chromaShadow}) drop-shadow(-\${glitchOffset.toFixed(
                        1
                      )}px 0 rgba(200,200,200,0.3)) drop-shadow(0 20px 35px rgba(0,0,0,0.6))\`
                    : "drop-shadow(0 25px 45px rgba(0,0,0,0.65))",
                transform: "translateZ(30px)",
              }}
            />

            {/* Specular Glare Sheen (Masked strictly to product PNG silhouette) */}
            <div
              ref={glareRef}
              className="absolute inset-0 pointer-events-none select-none z-20"
              style={{
                WebkitMaskImage: \`url("\${src}")\`,
                maskImage: \`url("\${src}")\`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                background:
                  "radial-gradient(ellipse 65% 55% at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.18) 32%, transparent 65%)",
                mixBlendMode: "screen",
                transform: "translateZ(31px)",
                opacity: 0.85,
              }}
            />
          </div>


        </div>

        {/* Global Keyframes for Ambient Sweep & Radial Streak Shoot */}
        <style dangerouslySetInnerHTML={{
          __html: \`
            @keyframes liveObjectSweep {
              0% { transform: translateX(-140%) rotate(25deg); opacity: 0; }
              15% { opacity: 0.18; }
              35% { transform: translateX(140%) rotate(25deg); opacity: 0; }
              100% { transform: translateX(140%) rotate(25deg); opacity: 0; }
            }
            @keyframes liveStreakShoot {
              0% {
                transform: rotate(var(--angle, 0deg)) scaleX(0.1) translateX(0);
                opacity: 0;
              }
              25% {
                opacity: 1;
              }
              100% {
                transform: rotate(var(--angle, 0deg)) scaleX(1.4) translateX(90px);
                opacity: 0;
              }
            }
          \`
        }} />
      </div>
    );
  }
);

LiveObject.displayName = "LiveObject";
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

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

const sizeMap = {
  sm: "scale-75",
  md: "scale-100",
  lg: "scale-125",
}

export interface LoaderProps {
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
  size?: "sm" | "md" | "lg" | number
  color?: string
  text?: string
  progress?: number
  strokeWidth?: number
  className?: string
}

export const WifiLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const shouldReduceMotion = useReducedMotion();
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const style = typeof size === "number" ? { transform: \`scale(\${size / 32})\` } : {}
  return (
    <div 
      className={cn("flex flex-col items-center justify-end h-8 w-8 gap-1 origin-bottom", scaleClass, className)}
      style={{ ...style, color }}
    >
      <motion.div animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-8 h-2 bg-current rounded-t-full rounded-b-sm" />
      <motion.div animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-5 h-2 bg-current rounded-t-full rounded-b-sm" />
      <motion.div animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-current rounded-full" />
    </div>
  )
}

export const HourglassLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const shouldReduceMotion = useReducedMotion();
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("inline-flex items-center justify-center", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      <motion.div 
        animate={shouldReduceMotion ? {} : { rotate: 180 }} 
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

export const HeartbeatLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const shouldReduceMotion = useReducedMotion();
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 24 : size === "lg" ? 40 : 32)
  return (
    <motion.div 
      animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1, 1.3, 1] }} 
      transition={{ repeat: Infinity, duration: 1.2 }}
      className={cn("inline-block", scaleClass, className)}
    >
      <svg className="fill-current" style={{ color, width: pixelSize, height: pixelSize }} viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </motion.div>
  )
}

export const BoxLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const shouldReduceMotion = useReducedMotion();
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 24 : size === "lg" ? 40 : 32)
  return (
    <div className={cn("relative inline-block", className)} style={{ width: pixelSize, height: pixelSize }}>
      <motion.div 
        animate={shouldReduceMotion ? {} : { rotate: 360, borderRadius: ["20%", "50%", "20%"] }} 
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }} 
        className="w-full h-full" 
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

export const BouncingBalls = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const shouldReduceMotion = useReducedMotion();
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex gap-2 items-center origin-center", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      {[0, 1, 2].map(i => (
        <motion.div 
          key={i} 
          animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

export const GlowRingLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const shouldReduceMotion = useReducedMotion();
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 30 : size === "lg" ? 50 : 40)
  return (
    <motion.div 
      animate={shouldReduceMotion ? {} : { rotate: 360 }} 
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

export const LineScaleLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const shouldReduceMotion = useReducedMotion();
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex gap-1 items-end h-8 origin-bottom", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div 
          key={i} 
          animate={shouldReduceMotion ? {} : { height: ["20%", "100%", "20%"] }} 
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }} 
          className="w-1.5 rounded-full" 
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

export const ClockLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const shouldReduceMotion = useReducedMotion();
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 30 : size === "lg" ? 50 : 40)
  return (
    <div 
      className={cn("relative rounded-full border-2", className)} 
      style={{ width: pixelSize, height: pixelSize, borderColor: color }}
    >
      <motion.div 
        animate={shouldReduceMotion ? {} : { rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }} 
        className="absolute top-1/2 left-1/2 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full" 
        style={{ height: \`\${(pixelSize / 2) - 4}px\`, backgroundColor: color }}
      />
      <motion.div 
        animate={shouldReduceMotion ? {} : { rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
        className="absolute top-1/2 left-1/2 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full opacity-70" 
        style={{ height: \`\${(pixelSize / 2) - 2}px\`, backgroundColor: color }}
      />
    </div>
  )
}

export const BatteryLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const shouldReduceMotion = useReducedMotion();
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex items-center origin-left", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      <div className="w-12 h-6 border-2 rounded-sm p-0.5 flex" style={{ borderColor: color }}>
        <motion.div animate={shouldReduceMotion ? { width: "100%" } : { width: ["0%", "100%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="h-full bg-primary rounded-sm" />
      </div>
      <div className="w-1 h-2 rounded-r-sm" style={{ backgroundColor: color }} />
    </div>
  )
}

export const SquareSpinLoader = ({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) => {
  const shouldReduceMotion = useReducedMotion();
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 24 : size === "lg" ? 40 : 32)
  return (
    <motion.div 
      animate={shouldReduceMotion ? {} : { rotateX: [0, 180, 180, 0], rotateY: [0, 0, 180, 180] }} 
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
      className={className}
      style={{ width: pixelSize, height: pixelSize, backgroundColor: color }} 
    />
  )
}

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

export function DotsLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const shouldReduceMotion = useReducedMotion();
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex space-x-1.5 items-center justify-center h-10 origin-center", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      <motion.div animate={shouldReduceMotion ? {} : { y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <motion.div animate={shouldReduceMotion ? {} : { y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <motion.div animate={shouldReduceMotion ? {} : { y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
    </div>
  )
}

export function PulseLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const pixelSize = typeof size === "number" ? size : (size === "sm" ? 16 : size === "lg" ? 28 : 20)
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: pixelSize, height: pixelSize }}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full" style={{ backgroundColor: color, width: pixelSize, height: pixelSize }} />
    </div>
  )
}

export function BarLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const shouldReduceMotion = useReducedMotion();
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 32 : 1
  return (
    <div className={cn("flex space-x-1 items-center justify-center h-10 origin-center", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      <motion.div animate={shouldReduceMotion ? {} : { scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-1.5 h-4 rounded-full origin-bottom" style={{ backgroundColor: color }} />
      <motion.div animate={shouldReduceMotion ? {} : { scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-4 rounded-full origin-bottom" style={{ backgroundColor: color }} />
      <motion.div animate={shouldReduceMotion ? {} : { scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-4 rounded-full origin-bottom" style={{ backgroundColor: color }} />
    </div>
  )
}

export function CircleLoader({ className, size = 32, color = "currentColor" }: { className?: string; size?: number; color?: string }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border-2 opacity-20" style={{ borderColor: color }} />
      <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-r-transparent border-b-transparent animate-spin" style={{ borderLeftColor: color }} />
    </div>
  )
}

export function RingLoader({ className, color = "currentColor", size = "md" }: { className?: string; color?: string; size?: "sm" | "md" | "lg" | number }) {
  const shouldReduceMotion = useReducedMotion();
  const scaleClass = typeof size === "string" ? sizeMap[size] : ""
  const scaleVal = typeof size === "number" ? size / 40 : 1
  return (
    <div className={cn("inline-block relative w-10 h-10 origin-center", scaleClass, className)} style={{ transform: \`scale(\${scaleVal})\` }}>
      <motion.div 
        className="absolute inset-0 rounded-full border-4 border-t-transparent"
        style={{ borderColor: \`\${color} transparent \${color} \${color}\` }}
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      />
      <motion.div 
        className="absolute inset-2 rounded-full border-4 border-b-transparent opacity-50"
        style={{ borderColor: \`\${color} \${color} transparent \${color}\` }}
        animate={shouldReduceMotion ? {} : { rotate: -360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
    </div>
  )
}

export function TextLoader({ text = "Loading...", className, color = "currentColor" }: { text?: string; className?: string; color?: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className={cn("font-mono text-sm font-medium flex items-center gap-2", className)} style={{ color }}>
      <span>{text}</span>
      <span className="flex gap-0.5">
        <motion.span animate={shouldReduceMotion ? {} : { opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
        <motion.span animate={shouldReduceMotion ? {} : { opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}>.</motion.span>
        <motion.span animate={shouldReduceMotion ? {} : { opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>.</motion.span>
      </span>
    </div>
  )
}

export function ProgressRing({ progress = 50, size = 60, strokeWidth = 4, className, color = "currentColor" }: { progress?: number; size?: number; strokeWidth?: number; className?: string; color?: string }) {
  const shouldReduceMotion = useReducedMotion();
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
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, ease: "easeInOut" }}
          style={{ strokeDasharray: circumference, strokeLinecap: "round", color }}
        />
      </svg>
      <span className="absolute text-xs font-semibold" style={{ color }}>{progress}%</span>
    </div>
  )
}

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

export function ShimmerBlock({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className={cn("relative overflow-hidden bg-muted rounded-md h-24 w-full", className)}>
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent"
          animate={{ translateX: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      )}
    </div>
  )
}

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

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  gap?: number
  className?: string
}

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
        >
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

// src/registry/morphing-geometry.ts
var morphingGeometry = {
  name: "morphing-geometry",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "morphing-geometry.tsx",
  content: `'use client';

import * as React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/cn';

export type MorphingShape = 'pill' | 'circle' | 'square' | 'squircle' | 'custom';
export type MorphingVariant = 'gradient' | 'aurora' | 'neon' | 'glass' | 'outline' | 'subtle';
export type MorphingColor = 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'rainbow' | 'mono';
export type MorphingSize = 'sm' | 'md' | 'lg' | 'xl' | 'custom';

export interface MorphingGeometryProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  shape?: MorphingShape;
  radius?: number | string;
  variant?: MorphingVariant;
  color?: MorphingColor;
  size?: MorphingSize;
  dimension?: number;
  spin?: boolean;
  spinDuration?: number;
  interactive?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
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
    bg: 'from-zinc-900 via-zinc-800 to-zinc-700 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300',
    border: 'border-border',
    glow: 'rgba(113, 113, 122, 0.3)',
    text: 'text-primary-foreground',
  },
  cyan: {
    bg: 'from-sky-500 via-cyan-600 to-blue-600',
    border: 'border-sky-500/40',
    glow: 'rgba(6, 182, 212, 0.35)',
    text: 'text-white',
  },
  emerald: {
    bg: 'from-emerald-500 via-green-600 to-teal-600',
    border: 'border-emerald-500/40',
    glow: 'rgba(16, 185, 129, 0.35)',
    text: 'text-white',
  },
  rose: {
    bg: 'from-rose-500 via-red-500 to-amber-500',
    border: 'border-rose-500/40',
    glow: 'rgba(244, 63, 94, 0.35)',
    text: 'text-white',
  },
  amber: {
    bg: 'from-amber-400 via-orange-500 to-amber-600',
    border: 'border-amber-400/40',
    glow: 'rgba(245, 158, 11, 0.35)',
    text: 'text-white',
  },
  rainbow: {
    bg: 'from-zinc-800 via-zinc-600 to-zinc-900 dark:from-zinc-200 dark:via-zinc-400 dark:to-zinc-100',
    border: 'border-border',
    glow: 'rgba(113, 113, 122, 0.25)',
    text: 'text-primary-foreground',
  },
  mono: {
    bg: 'from-zinc-900 via-zinc-800 to-zinc-950',
    border: 'border-zinc-700',
    glow: 'rgba(0, 0, 0, 0.2)',
    text: 'text-white',
  },
};

export const MorphingGeometry = React.forwardRef<HTMLDivElement, MorphingGeometryProps>(
  (
    {
      shape = 'circle',
      radius,
      variant = 'gradient',
      color = 'violet',
      size = 'md',
      dimension,
      spin = false,
      spinDuration = 12,
      interactive = false,
      glow = false,
      icon,
      children,
      className,
      style,
      onClick,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
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
      variantClasses = \`bg-transparent border-2 \${colorScheme.border} text-foreground\`;
    } else if (variant === 'subtle') {
      variantClasses = \`bg-muted/60 border border-border text-foreground\`;
    }

    const shouldSpin = spin && !shouldReduceMotion;

    return (
      <motion.div
        ref={ref}
        animate={shouldSpin ? { rotate: [0, 90, 180, 270, 360] } : { rotate: 0 }}
        transition={{
          rotate: {
            duration: spinDuration,
            repeat: Infinity,
            ease: 'linear',
          },
          borderRadius: { duration: shouldReduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] },
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
        {...props}
      >
        <div className="absolute inset-0 bg-linear-to-b from-white/25 via-transparent to-black/20 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
          {icon || (children ? children : <div className="w-5 h-5 rounded-full border-2 border-current opacity-80" />)}
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
import { motion, useReducedMotion } from "framer-motion"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: { label: string; href?: string }[]
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

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  totalPages: number
  currentPage: number
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

interface Step {
  title: string
  description?: string
  status: "complete" | "current" | "upcoming"
}

export function Steps({ items, className }: { items: Step[]; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn("space-y-6", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-4 group">
          <div className="flex flex-col items-center">
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                item.status === "complete" && "border-transparent bg-primary text-primary-foreground shadow-lg shadow-primary/20",
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
                item.status === "complete" ? "bg-primary" : "bg-border"
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
  <nav className="flex items-center justify-between px-6 py-3 bg-card/80 backdrop-blur-md border border-border rounded-full w-[90%] mx-auto mt-4 shadow-lg sticky top-4 z-50">
    <div className="font-bold text-foreground">Workspace</div>
    <div className="flex gap-6 text-sm font-medium text-muted-foreground">
      <a href="#" className="hover:text-foreground transition-colors">Features</a>
      <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
    </div>
    <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold">Start</button>
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
    <span className="text-foreground font-medium">Workspace</span>
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
    <div className="px-2 py-1.5 text-sm font-semibold border-b mb-1">Account</div>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Profile</button>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Billing</button>
    <button className="px-2 py-1.5 text-sm text-left hover:bg-muted rounded-sm transition-colors">Settings</button>
    <div className="border-t my-1"></div>
    <button className="px-2 py-1.5 text-sm text-left text-destructive hover:bg-destructive/10 rounded-sm transition-colors">Sign out</button>
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
import { Play, RotateCcw, CheckCircle2, AlertCircle, Loader2, Bot, Database, Globe, Cpu, ArrowRight } from 'lucide-react';
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
  initialNodes?: FlowNode[];
  initialEdges?: FlowEdge[];
  interactive?: boolean;
  showToolbar?: boolean;
  title?: string;
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

    const runPipeline = React.useCallback(async () => {
      if (isRunning) return;
      setIsRunning(true);

      setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));
      setActiveEdge(null);

      setNodes((prev) => prev.map((n) => (n.id === 'n1' ? { ...n, status: 'running' } : n)));
      await new Promise((r) => setTimeout(r, 700));
      setNodes((prev) => prev.map((n) => (n.id === 'n1' ? { ...n, status: 'completed' } : n)));

      setActiveEdge('e1-2');
      await new Promise((r) => setTimeout(r, 600));

      setNodes((prev) =>
        prev.map((n) => (n.id === 'n2' || n.id === 'n3' ? { ...n, status: 'running' } : n))
      );
      await new Promise((r) => setTimeout(r, 800));
      setNodes((prev) =>
        prev.map((n) => (n.id === 'n2' || n.id === 'n3' ? { ...n, status: 'completed' } : n))
      );

      setActiveEdge('e2-4');
      await new Promise((r) => setTimeout(r, 600));

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
          return <Bot className="w-3.5 h-3.5 text-primary" />;
        case 'db':
          return <Database className="w-3.5 h-3.5 text-primary" />;
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
            <Cpu className="w-4 h-4 text-primary" />
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
                    ? 'bg-primary/15 text-primary border-primary/30'
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
                      className="opacity-80"
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
                node.status === 'running' && 'ring-2 ring-ring shadow-[0_0_20px_rgba(6,182,212,0.3)]',
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
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
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

export interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

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

    const motionValue = useMotionValue(0)

    const springValue = useSpring(motionValue, {
      stiffness: 70,
      damping: 15,
      mass: 1,
    })

    const displayValue = useTransform(springValue, (latest) => {
      const formatted = Number(latest.toFixed(decimals))
      return formatted.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    })

    React.useEffect(() => {
      if (inView) {
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

// src/registry/particle-reveal-card.ts
var particleRevealCard = {
  name: "particle-reveal-card",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "particle-reveal-card.tsx",
  content: `"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "../utils/cn";
import { RotateCcw } from "lucide-react";

export interface ParticleRevealCardProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  title?: string;
  subtitle?: string;
  price?: string;
  badge?: string;
  cardWidth?: number | string;
  cardHeight?: number | string;
  particleSize?: number;
  gap?: number;
  repelRadius?: number;
  repelForce?: number;
  springStiffness?: number;
  damping?: number;
  scatterOnLoad?: boolean;
  showLabels?: boolean;
}

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export const ParticleRevealCard = React.forwardRef<HTMLDivElement, ParticleRevealCardProps>(
  (
    {
      src,
      title = "Quantum Chronograph",
      subtitle = "CALIBRE 01 \u2022 FORGED TITANIUM",
      price = "$1,450",
      badge = "Particle Physics",
      cardWidth = 360,
      cardHeight = 480,
      particleSize = 2.2,
      gap = 3,
      repelRadius = 85,
      repelForce = 6.5,
      springStiffness = 0.08,
      damping = 0.88,
      scatterOnLoad = true,
      showLabels = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const effectiveScatter = scatterOnLoad && !shouldReduceMotion;

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number | null>(null);
    const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
      x: -9999,
      y: -9999,
      active: false,
    });

    const [isLoaded, setIsLoaded] = useState(false);
    const [particleCount, setParticleCount] = useState(0);

    const triggerScatter = useCallback(() => {
      if (shouldReduceMotion) return;
      const particles = particlesRef.current;
      const canvas = canvasRef.current;
      if (!canvas || particles.length === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * Math.max(cw, ch) * 0.4;
        p.vx = Math.cos(angle) * (3 + Math.random() * 4);
        p.vy = Math.sin(angle) * (3 + Math.random() * 4);
        p.x = p.homeX + Math.cos(angle) * dist;
        p.y = p.homeY + Math.sin(angle) * dist;
      }
    }, [shouldReduceMotion]);

    useEffect(() => {
      if (!src) return;
      let cancelled = false;
      setIsLoaded(false);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;

      img.onload = () => {
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const displayWidth = canvas.clientWidth || (typeof cardWidth === "number" ? cardWidth : 380);
        const displayHeight = canvas.clientHeight || (typeof cardHeight === "number" ? cardHeight : 380);

        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;

        const offscreen = document.createElement("canvas");
        const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
        if (!offCtx) return;

        const padding = 10;
        const maxW = displayWidth - padding * 2;
        const maxH = displayHeight - padding * 2;
        const scale = Math.min(maxW / img.width, maxH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const offsetX = (displayWidth - drawW) / 2;
        const offsetY = (displayHeight - drawH) / 2;

        offscreen.width = displayWidth;
        offscreen.height = displayHeight;

        offCtx.clearRect(0, 0, displayWidth, displayHeight);
        offCtx.drawImage(img, offsetX, offsetY, drawW, drawH);

        const imgData = offCtx.getImageData(0, 0, displayWidth, displayHeight);
        const pixels = imgData.data;
        const newParticles: Particle[] = [];

        const samplingGap = Math.max(2, Math.round(gap));

        for (let y = 0; y < displayHeight; y += samplingGap) {
          for (let x = 0; x < displayWidth; x += samplingGap) {
            const index = (y * displayWidth + x) * 4;
            const alpha = pixels[index + 3];

            if (alpha > 30) {
              const r = pixels[index];
              const g = pixels[index + 1];
              const b = pixels[index + 2];
              const a = (alpha / 255).toFixed(2);

              const homeX = x * dpr;
              const homeY = y * dpr;

              let startX = homeX;
              let startY = homeY;
              let startVx = 0;
              let startVy = 0;

              if (effectiveScatter) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 60 + Math.random() * Math.max(displayWidth, displayHeight) * 0.4 * dpr;
                startX = homeX + Math.cos(angle) * dist;
                startY = homeY + Math.sin(angle) * dist;
                startVx = (Math.random() - 0.5) * 4;
                startVy = (Math.random() - 0.5) * 4;
              }

              newParticles.push({
                homeX,
                homeY,
                x: startX,
                y: startY,
                vx: startVx,
                vy: startVy,
                color: \`rgba(\${r},\${g},\${b},\${a})\`,
              });
            }
          }
        }

        particlesRef.current = newParticles;
        setParticleCount(newParticles.length);
        setIsLoaded(true);
      };

      return () => {
        cancelled = true;
      };
    }, [src, gap, effectiveScatter, cardWidth, cardHeight]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let isRunning = true;

      const render = () => {
        if (!isRunning) return;

        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const particles = particlesRef.current;
        const ptr = pointerRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scaledRepelRad = repelRadius * dpr;
        const scaledRepelRadSq = scaledRepelRad * scaledRepelRad;
        const pSize = particleSize * dpr;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (!shouldReduceMotion && ptr.active) {
            const dx = p.x - ptr.x;
            const dy = p.y - ptr.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < scaledRepelRadSq && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / scaledRepelRad) * repelForce * dpr;
              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * force;
              p.vy += Math.sin(angle) * force;
            }
          }

          if (!shouldReduceMotion) {
            const homeDx = p.homeX - p.x;
            const homeDy = p.homeY - p.y;
            p.vx += homeDx * springStiffness;
            p.vy += homeDy * springStiffness;

            p.vx *= damping;
            p.vy *= damping;
            p.x += p.vx;
            p.y += p.vy;
          } else {
            p.x = p.homeX;
            p.y = p.homeY;
          }

          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - pSize / 2, p.y - pSize / 2, pSize, pSize);
        }

        if (!shouldReduceMotion) {
          animFrameRef.current = requestAnimationFrame(render);
        }
      };

      animFrameRef.current = requestAnimationFrame(render);

      return () => {
        isRunning = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [particleSize, repelRadius, repelForce, springStiffness, damping, shouldReduceMotion]);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (shouldReduceMotion) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

      const px = (e.clientX - rect.left) * dpr;
      const py = (e.clientY - rect.top) * dpr;

      pointerRef.current = {
        x: px,
        y: py,
        active: true,
      };
    }, [shouldReduceMotion]);

    const handlePointerLeave = useCallback(() => {
      pointerRef.current.active = false;
    }, []);

    return (
      <div
        ref={ref}
        className={cn("group flex flex-col items-center select-none w-full h-full", className)}
        style={{
          width: typeof cardWidth === "number" ? \`\${cardWidth}px\` : cardWidth || "100%",
          height: typeof cardHeight === "number" ? \`\${cardHeight}px\` : cardHeight || "100%",
          ...style,
        }}
        {...props}
      >
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={cn(
            "relative w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300",
            showLabels
              ? "p-5 border border-border bg-card hover:border-foreground/20 text-card-foreground shadow-sm"
              : "p-0 border-0 bg-transparent shadow-none items-center justify-center"
          )}
          style={{
            minHeight: showLabels ? (typeof cardHeight === "number" ? \`\${cardHeight}px\` : cardHeight) : undefined,
          }}
        >
          {showLabels && (
            <>
              <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-border to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {badge}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={triggerScatter}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border transition-all cursor-pointer active:scale-95"
                  title="Re-scatter particles"
                >
                  <RotateCcw className="w-3 h-3 text-muted-foreground" />
                  <span>Scatter</span>
                </button>
              </div>
            </>
          )}

          <div className={cn("relative w-full flex items-center justify-center", showLabels ? "h-[260px] my-auto" : "h-full")}>
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair touch-none"
            />

            {!isLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <span className="text-xs font-mono">Synthesizing particles...</span>
              </div>
            )}
          </div>

          {showLabels && (
            <div className="relative z-10 border-t border-border pt-4">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  {title}
                </h3>
                {price && (
                  <span className="text-sm font-mono font-bold text-foreground">
                    {price}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-mono tracking-wide">
                  {subtitle}
                </p>
                {particleCount > 0 && (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {particleCount.toLocaleString()} pts
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ParticleRevealCard.displayName = "ParticleRevealCard";
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

export function DonutChart({ value, max = 100, size = 120, strokeWidth = 10, color = "var(--primary)", label, className }: {
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

export function AreaChartSimple({ data, height = 80, color = "var(--primary)", className }: {
  data: number[]
  height?: number
  color?: string
  className?: string
}) {
  const gradientId = React.useId().replace(/:/g, "")
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 300
  const points = data.map((v, i) => ({
    x: (i / Math.max(1, data.length - 1)) * w,
    y: height - ((v - min) / range) * (height - 10) - 5,
  }))
  const pathD = points.map((p, i) => (i === 0 ? \`M\${p.x},\${p.y}\` : \`L\${p.x},\${p.y}\`)).join(" ")
  const areaD = \`\${pathD} L\${w},\${height} L0,\${height} Z\`

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox={\`0 0 \${w} \${height}\`} className="w-full" style={{ height }}>
        <defs>
          <linearGradient id={\`area-fill-\${gradientId}\`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaD}
          fill={\`url(#area-fill-\${gradientId})\`}
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
            changeType === "positive" ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
          )}>{change}</span>
        )}
      </div>
      <p className="text-2xl font-bold mb-3">{value}</p>
      {data.length > 0 && (
        <AreaChartSimple data={data} height={40} color={changeType === "positive" ? "var(--success)" : "var(--destructive)"} />
      )}
    </div>
  )
}

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
          className="bg-muted-foreground/30 rounded-r-full"
        />
      </div>
    </div>
  )
}

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
            style={{ backgroundColor: \`color-mix(in srgb, var(--primary) \${Math.round((0.12 + intensity * 0.88) * 100)}%, transparent)\` }}
            title={\`\${val}\`}
          />
        )
      })}
    </div>
  )
}

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
              i === 0 ? "bg-primary text-primary-foreground" :
              i === 1 ? "bg-muted text-foreground" :
              i === 2 ? "bg-muted/80 text-foreground" :
              "bg-muted text-muted-foreground"
            )}>{i + 1}</span>
            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-foreground text-xs font-semibold shrink-0">
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
              m.trendType === "up" ? "text-success" : "text-destructive"
            )}>
              {m.trendType === "up" ? "\u2191" : "\u2193"} {m.trend}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  )
}


const chartColorMap: Record<string, { stroke: string; fill: string; glow: string; text: string }> = {
  primary: { stroke: "var(--primary)", fill: "var(--primary)", glow: "transparent", text: "text-primary" },
  violet: { stroke: "var(--chart-1)", fill: "var(--chart-1)", glow: "transparent", text: "text-foreground" },
  cyan: { stroke: "var(--chart-2)", fill: "var(--chart-2)", glow: "transparent", text: "text-foreground" },
  emerald: { stroke: "var(--success)", fill: "var(--success)", glow: "transparent", text: "text-success" },
  rose: { stroke: "var(--destructive)", fill: "var(--destructive)", glow: "transparent", text: "text-destructive" },
  amber: { stroke: "var(--warning)", fill: "var(--warning)", glow: "transparent", text: "text-warning" },
  "chart-1": { stroke: "var(--chart-1)", fill: "var(--chart-1)", glow: "transparent", text: "text-foreground" },
  "chart-2": { stroke: "var(--chart-2)", fill: "var(--chart-2)", glow: "transparent", text: "text-foreground" },
  "chart-3": { stroke: "var(--chart-3)", fill: "var(--chart-3)", glow: "transparent", text: "text-foreground" },
  "chart-4": { stroke: "var(--chart-4)", fill: "var(--chart-4)", glow: "transparent", text: "text-foreground" },
  "chart-5": { stroke: "var(--chart-5)", fill: "var(--chart-5)", glow: "transparent", text: "text-foreground" },
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
  color = "primary",
  height = 240,
  showGrid = true,
  showTooltip = true,
  currency = "$",
  className,
}: ModernAreaChartProps) {
  const gradientId = React.useId().replace(/:/g, "");
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const colorTheme = chartColorMap[color] || chartColorMap.primary;

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
          <linearGradient id={\`area-grad-\${gradientId}\`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorTheme.stroke} stopOpacity="0.4" />
            <stop offset="85%" stopColor={colorTheme.stroke} stopOpacity="0.02" />
            <stop offset="100%" stopColor={colorTheme.stroke} stopOpacity="0" />
          </linearGradient>
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
            fill={\`url(#area-grad-\${gradientId})\`}
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
              fill="var(--background)"
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
  color = "primary",
  height = 220,
  className,
}: ModernBarChartProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const colorTheme = chartColorMap[color] || chartColorMap.primary;
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
                  boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
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
  color = "primary",
  size = 180,
  strokeWidth = 14,
  className,
}: ModernDonutChartProps) {
  const colorTheme = chartColorMap[color] || chartColorMap.primary;
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
import { motion, type HTMLMotionProps } from "framer-motion"
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
  ArrowRight,
  Tag
} from "lucide-react"
import { cn } from "../utils/cn"

export interface ProductCardProProps extends HTMLMotionProps<"div"> {
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
  badge = "Featured",
  rating = 4.9,
  reviewCount = 248,
  imageSrc,
  image,
  colors = ["#18181b", "#71717a", "#a1a1aa"],
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-3xl border border-border/80 bg-card text-card-foreground p-4 w-full max-w-sm shadow-sm overflow-hidden relative group",
        className
      )}
      {...props}
    >
      <div className="relative aspect-[4/3] rounded-2xl bg-muted/40 border border-border/50 overflow-hidden flex items-center justify-center">
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold tracking-wide shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              <span>{badge}</span>
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 hover:bg-background border border-border flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isWishlisted ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-foreground"
            )}
          />
        </button>

        {effectiveImage ? (
          <img
            src={effectiveImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 select-none group-hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <ShoppingBag className="w-9 h-9" />
            </div>
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
              STUDIO EDITION
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
            </div>
            <span className="text-xs font-bold text-foreground">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>

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

        <h3 className="font-semibold text-base text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground tracking-tight tabular-nums">
            \${price}
          </span>
          {originalPrice && (
            <span className="text-sm font-medium text-muted-foreground line-through tabular-nums">
              \${originalPrice}
            </span>
          )}
          {originalPrice && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-success/15 text-success border border-success/20 ml-auto tabular-nums">
              Save \${(Number(originalPrice) - Number(price)).toFixed(0)}
            </span>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className={cn(
            "w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-xs",
            isAdded
              ? "bg-success text-success-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart</span>
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
        "rounded-3xl border border-border/80 bg-card p-6 w-full max-w-md shadow-sm space-y-5 text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <h3 className="font-semibold text-base text-foreground tracking-tight">Order Summary</h3>
        <span className="text-xs font-mono text-muted-foreground">3 Items</span>
      </div>

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
            placeholder="Discount code"
            className="w-full pl-8.5 pr-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
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

      <div className="space-y-2.5 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-mono font-medium text-foreground tabular-nums">\${subtotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span className="font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
            {shipping}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Estimated Taxes</span>
          <span className="font-mono font-medium text-foreground tabular-nums">\${tax}</span>
        </div>

        {applied && (
          <div className="flex justify-between items-center text-success font-medium">
            <span>Discount</span>
            <span className="font-mono tabular-nums">-$29.99</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border flex items-baseline justify-between">
        <div>
          <span className="font-semibold text-sm text-foreground">Total</span>
          <p className="text-[10px] text-muted-foreground">All applicable taxes included</p>
        </div>
        <span className="text-2xl font-bold text-foreground tracking-tight font-mono tabular-nums">
          \${total}
        </span>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onCheckout}
        className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <Lock className="w-3.5 h-3.5" />
        <span>Complete Checkout</span>
      </motion.button>

      <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-muted-foreground select-none">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>SSL Verified</span>
        </div>
        <span>\u2022</span>
        <span>Satisfaction Guarantee</span>
      </div>
    </div>
  )
}

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
  plan = "Developer",
  price = "49",
  billingPeriod = "month",
  nextBilling = "Oct 01, 2026",
  status = "active",
  features = [
    "Unlimited Team Workspaces",
    "Real-time Telemetry Analytics",
    "Priority Technical Support",
    "Dedicated Edge Endpoints",
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
        "rounded-3xl border border-border bg-card p-6 w-full max-w-sm shadow-sm relative overflow-hidden text-card-foreground space-y-6",
        isPopular && "border-primary",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {plan}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold text-foreground tracking-tight font-mono tabular-nums">
              \${price}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/{billingPeriod}</span>
          </div>
        </div>

        {isPopular && (
          <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-semibold uppercase tracking-wider">
            Standard
          </span>
        )}
      </div>

      <div className="space-y-2.5 pt-2 border-t border-border/60">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Included features:
        </p>
        <ul className="space-y-2 text-xs">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-foreground/90">
              <div className="w-4 h-4 rounded-full bg-success/15 border border-success/30 text-success flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onUpgrade}
        className="w-full py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <span>Upgrade to {plan}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  )
}

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
        "relative w-full max-w-sm aspect-[1.6/1] rounded-2xl bg-zinc-950 border border-white/10 p-6 text-white shadow-xl overflow-hidden select-none flex flex-col justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-7 rounded-md bg-amber-400 border border-amber-200/50 shadow-xs relative overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-amber-900/30" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-amber-900/30" />
          </div>

          <svg className="w-5 h-5 text-white/70 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.393 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>

        <span className="font-mono text-xs font-semibold tracking-widest uppercase opacity-80">
          OBSIDIAN BLACK
        </span>
      </div>

      <div className="z-10 tracking-[0.2em] font-mono text-base text-white/95 font-medium tabular-nums">
        {number}
      </div>

      <div className="flex items-end justify-between z-10 font-mono text-xs">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-white/50">CARDHOLDER</p>
          <p className="font-semibold tracking-wider text-white/90 truncate max-w-[170px]">{holder}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wider text-white/50">EXPIRES</p>
          <p className="font-semibold tracking-wider text-white/90 tabular-nums">{expiry}</p>
        </div>
      </div>
    </div>
  )
}

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
        "flex items-center gap-4 py-3.5 px-4 rounded-2xl border border-border bg-card shadow-xs text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-primary shrink-0">
        <ShoppingBag className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate text-foreground">{name}</h4>
        <p className="text-xs font-mono font-semibold text-primary mt-0.5 tabular-nums">\${price}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0 bg-muted/50 p-1 rounded-xl border border-border/60">
        <button
          type="button"
          onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}
          className="w-6 h-6 rounded-lg bg-card hover:bg-muted flex items-center justify-center text-xs transition-colors cursor-pointer border border-border/40"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-xs font-mono font-medium tabular-nums">{quantity}</span>
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
  client = "Apex Technologies Corp",
  onDownload,
  className,
  ...props
}: InvoiceCardProps) {
  const statusStyles = {
    paid: "bg-success/15 text-success border-success/30",
    pending: "bg-warning/15 text-warning border-warning/30",
    overdue: "bg-destructive/15 text-destructive border-destructive/30",
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-all duration-200 w-full max-w-sm text-card-foreground space-y-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="font-mono text-xs font-semibold text-foreground">{invoiceNumber}</span>
          <p className="text-[11px] text-muted-foreground">{date}</p>
        </div>
        <span
          className={cn(
            "text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider border",
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
          <p className="text-lg font-bold font-mono text-foreground tabular-nums">\${amount}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDownload}
        className="w-full py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-primary" />
        <span>Download Receipt (PDF)</span>
      </button>
    </div>
  )
}

export interface CouponCardProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
  discount: string
  description?: string
  validUntil?: string
}

export function CouponCard({
  code = "SAVE50",
  discount = "50% OFF",
  description = "Valid across standard subscription tiers.",
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
        "rounded-2xl border border-dashed border-primary/40 bg-card p-5 w-full max-w-sm relative overflow-hidden text-card-foreground space-y-3",
        className
      )}
      {...props}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-primary font-mono">{discount}</span>
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
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  )
}

export interface PricingSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers?: { name: string; price: string | number; features: string[] }[]
}

export function PricingSlider({
  tiers = [
    { name: "Starter", price: "19", features: ["Up to 5 Projects", "Standard Support", "Basic Analytics"] },
    { name: "Professional", price: "49", features: ["Unlimited Projects", "Priority Support", "Advanced Analytics", "Custom Domain"] },
    { name: "Enterprise", price: "99", features: ["Unlimited Everything", "Dedicated Channel", "Custom SLAs", "Dedicated Engineer"] },
  ],
  className,
  ...props
}: PricingSliderProps) {
  const [selected, setSelected] = React.useState(1)
  const current = tiers[selected] || tiers[0]

  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-card p-6 w-full max-w-md shadow-sm text-card-foreground space-y-5",
        className
      )}
      {...props}
    >
      <div className="text-center space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{current.name} Tier</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold font-mono text-foreground tabular-nums">\${current.price}</span>
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
        <p className="text-[11px] font-semibold text-muted-foreground uppercase">Included:</p>
        <ul className="space-y-1.5 text-xs">
          {current.features.map((f, idx) => (
            <li key={idx} className="flex items-center gap-2 text-foreground/90">
              <Check className="w-3.5 h-3.5 text-success shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ReviewStars({ rating = 4.8, size = 18, reviewCount }: { rating?: number; size?: number; reviewCount?: number }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} style={{ width: size, height: size }} className={cn(s <= Math.round(rating) ? "fill-amber-500 text-amber-500" : "text-muted/40")} />
        ))}
      </div>
      <span className="text-xs font-semibold text-foreground tabular-nums">{rating}</span>
      {reviewCount && <span className="text-xs text-muted-foreground tabular-nums">({reviewCount})</span>}
    </div>
  )
}

export function TrustBadge({
  icon,
  title = "Verified Security",
  subtitle = "Cryptographic Verification",
  className,
}: {
  icon?: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn("inline-flex items-center gap-3 p-3 rounded-2xl border border-border bg-card shadow-xs", className)}>
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon || <ShieldCheck className="w-5 h-5" />}
      </div>
      <div>
        <h5 className="text-xs font-semibold text-foreground leading-tight">{title}</h5>
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
import { motion, AnimatePresence, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../utils/cn"

export interface GlowSpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glowColor?: string
  glowSize?: number
}

export const GlowSpotlightCard = React.forwardRef<HTMLDivElement, GlowSpotlightCardProps>(
  ({ children, className, glowColor = "color-mix(in srgb, var(--primary) 16%, transparent)", glowSize = 300, ...props }, ref) => {
    const [pos, setPos] = React.useState({ x: 0, y: 0 })

    const handleMouseMove = React.useCallback(
      ({ clientX, clientY, currentTarget }: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = currentTarget.getBoundingClientRect()
        setPos({ x: clientX - left, y: clientY - top })
      },
      []
    )

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        className={cn(
          "group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-xs transition-shadow duration-300 hover:shadow-sm",
          className
        )}
        {...props}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: \`radial-gradient(\${glowSize}px circle at \${pos.x}px \${pos.y}px, \${glowColor}, transparent 80%)\`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)
GlowSpotlightCard.displayName = "GlowSpotlightCard"

export interface WordFadeRevealProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string
  delay?: number
  delayMultiple?: number
  duration?: number
}

export function WordFadeReveal({
  text,
  className,
  delay = 0,
  delayMultiple = 0.05,
  duration = 0.4,
  ...props
}: WordFadeRevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const words = text.split(" ")

  return (
    <h3 className={cn("flex flex-wrap justify-center gap-x-1.5", className)} {...props}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: shouldReduceMotion ? 0 : delay + i * delayMultiple,
            duration: shouldReduceMotion ? 0 : duration,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h3>
  )
}

export interface AnimatedGridBackgroundProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  strokeWidth?: number
  strokeColor?: string
  cellFlashColor?: string
  flashInterval?: number
  maxFlashes?: number
  className?: string
}

export function AnimatedGridBackground({
  width = 40,
  height = 40,
  strokeWidth = 1,
  strokeColor = "color-mix(in srgb, var(--border) 60%, transparent)",
  cellFlashColor = "color-mix(in srgb, var(--primary) 14%, transparent)",
  flashInterval = 1000,
  maxFlashes = 4,
  className,
  ...props
}: AnimatedGridBackgroundProps) {
  const shouldReduceMotion = useReducedMotion()
  const id = React.useId().replace(/:/g, "")
  const [flashingCells, setFlashingCells] = React.useState<{ x: number; y: number; id: number }[]>([])

  React.useEffect(() => {
    if (shouldReduceMotion) return

    const timer = setInterval(() => {
      setFlashingCells((prev) => {
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
  }, [width, height, flashInterval, maxFlashes, shouldReduceMotion])

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
      {!shouldReduceMotion && (
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
      )}
    </svg>
  )
}

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
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

export interface BentoCardProps extends HTMLMotionProps<"div"> {
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
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: shouldReduceMotion ? 0 : delay, duration: shouldReduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/10 p-6 transition-all duration-200 hover:shadow-sm hover:border-primary/20",
        span,
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-tr from-primary/5 via-transparent to-transparent" />

      {header && <div className="w-full overflow-hidden rounded-lg mb-4">{header}</div>}

      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary transition-transform duration-200 group-hover:scale-105">{icon}</div>}
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
            <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/20 flex items-center justify-center text-muted-foreground">
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
    image: "from-primary/10 to-primary/5 text-primary",
    video: "from-primary/10 to-primary/5 text-primary",
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

export function EmbedCard({ title, description, domain, favicon, className }: {
  title: string
  description?: string
  domain: string
  favicon?: string
  className?: string
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer", className)}>
      <div className="h-36 bg-linear-to-br from-primary/20 via-blue-500/20 to-primary/20" />
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
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-sm shrink-0"
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
          className="absolute inset-0 bg-muted" 
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

export function GalleryGrid({ items, className }: {
  items: { title: string; color?: string }[]
  className?: string
}) {
  const colors = [
    "from-zinc-700 to-zinc-900",
    "from-zinc-800 to-zinc-950",
    "from-slate-700 to-slate-900",
    "from-neutral-700 to-neutral-900",
    "from-stone-700 to-stone-900",
    "from-zinc-600 to-zinc-800",
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
  fileName: "premium-overlays.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"
import { X } from "lucide-react"

export interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: "bottom" | "right" | "left"
  children: React.ReactNode
  className?: string
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

export interface CommandPaletteItem {
  id: string
  label: string
  icon?: React.ReactNode
  group?: string
  onSelect?: () => void
}

export interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  items: CommandPaletteItem[]
  placeholder?: string
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

  const groups = React.useMemo(() => {
    const map = new Map<string, CommandPaletteItem[]>()
    filtered.forEach(item => {
      const group = item.group || "Results"
      if (!map.has(group)) map.set(group, [])
      map.get(group)!.push(item)
    })
    return map
  }, [filtered])

  React.useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
    }
  }, [open])

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

export interface ContextMenuItem {
  label: string
  onClick?: () => void
  shortcut?: string
  separator?: boolean
  disabled?: boolean
  destructive?: boolean
}

export interface ContextMenuProps {
  items: ContextMenuItem[]
  children: React.ReactNode
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
import { motion, type HTMLMotionProps } from 'framer-motion';
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
            {children as React.ReactNode}
          </div>
        </ChatMessageContext.Provider>
      );
    }

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
            ? 'bg-primary text-primary-foreground shadow-xs'
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
        {children as React.ReactNode}
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
        {children as React.ReactNode}
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
      {children as React.ReactNode}
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
      {children as React.ReactNode}
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
        {children as React.ReactNode}
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

export const ChatMessageCompound = Object.assign(ChatMessage, {
  Avatar: ChatMessageAvatar,
  Body: ChatMessageBody,
  Header: ChatMessageHeader,
  Sender: ChatMessageSender,
  Time: ChatMessageTime,
  Content: ChatMessageContent,
  Status: ChatMessageStatus,
});



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
          {children as React.ReactNode}
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
      {children as React.ReactNode}
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

export interface ChatInputSubmitProps extends HTMLMotionProps<'button'> {
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
      {...props}
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
      name = 'Hannah Reid',
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
          {children as React.ReactNode}
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
        gradient || 'bg-muted',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent pointer-events-none" />
      {imageSrc && <img src={imageSrc} alt="Cover" className="w-full h-full object-cover" />}
      {children as React.ReactNode}
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
          'w-20 h-20 rounded-full border-4 border-card ring-2 ring-border bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-2xl shadow-sm overflow-hidden select-none',
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
      {children as React.ReactNode}
    </div>
  )
);
UserProfileInfo.displayName = 'UserProfileInfo';

export const UserProfileName = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="flex items-center gap-1.5">
      <h4 ref={ref} className={cn('font-bold text-lg text-foreground tracking-tight', className)} {...props}>
        {children as React.ReactNode}
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
      {children as React.ReactNode}
    </p>
  )
);
UserProfileHandle.displayName = 'UserProfileHandle';

export const UserProfileBio = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3', className)} {...props}>
      {children as React.ReactNode}
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
      {children as React.ReactNode}
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

export interface UserProfileFollowButtonProps extends HTMLMotionProps<'button'> {
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
      {...props}
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
          {children as React.ReactNode}
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
      {children as React.ReactNode}
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
        'rounded-full flex items-center justify-center font-bold text-primary-foreground shrink-0 bg-primary shadow-xs',
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
      {children as React.ReactNode}
    </div>
  )
);
CommentBody.displayName = 'CommentBody';

export const CommentHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2 mb-0.5', className)} {...props}>
      {children as React.ReactNode}
    </div>
  )
);
CommentHeader.displayName = 'CommentHeader';

export const CommentAuthor = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('font-semibold text-xs text-foreground', className)} {...props}>
      {children as React.ReactNode}
    </span>
  )
);
CommentAuthor.displayName = 'CommentAuthor';

export const CommentTime = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('text-[11px] font-mono text-muted-foreground', className)} {...props}>
      {children as React.ReactNode}
    </span>
  )
);
CommentTime.displayName = 'CommentTime';

export const CommentText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs sm:text-sm text-foreground/80 leading-relaxed', className)} {...props}>
      {children as React.ReactNode}
    </p>
  )
);
CommentText.displayName = 'CommentText';

export const CommentActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3 pt-1 text-[11px] text-muted-foreground', className)} {...props}>
      {children as React.ReactNode}
    </div>
  )
);
CommentActions.displayName = 'CommentActions';

export const CommentReply = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex gap-3 items-start ml-11 pl-2 border-l border-border/60', className)} {...props}>
      {children as React.ReactNode}
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
      author = 'Daniel Park',
      handle = '@marcusvance',
      content = 'Initial release completed. Telemetry and core services operational.',
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
          {children as React.ReactNode}
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
      {children as React.ReactNode}
    </div>
  )
);
SocialPostHeader.displayName = 'SocialPostHeader';

export const SocialPostAvatar = React.forwardRef<HTMLDivElement, CommentAvatarProps>(
  ({ src, fallback, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-xs',
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
      {children as React.ReactNode}
    </p>
  )
);
SocialPostAuthor.displayName = 'SocialPostAuthor';

export const SocialPostHandle = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('font-mono text-xs text-muted-foreground', className)} {...props}>
      {children as React.ReactNode}
    </span>
  )
);
SocialPostHandle.displayName = 'SocialPostHandle';

export const SocialPostTime = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn('text-xs text-muted-foreground/80', className)} {...props}>
      {children as React.ReactNode}
    </span>
  )
);
SocialPostTime.displayName = 'SocialPostTime';

export const SocialPostContent = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm leading-relaxed text-foreground/90 mb-4', className)} {...props}>
      {children as React.ReactNode}
    </p>
  )
);
SocialPostContent.displayName = 'SocialPostContent';

export const SocialPostActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-6 pt-3 border-t border-border/70', className)} {...props}>
      {children as React.ReactNode}
    </div>
  )
);
SocialPostActions.displayName = 'SocialPostActions';

export interface SocialPostActionProps extends HTMLMotionProps<'button'> {
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
      {...props}
    >
      {icon}
      {label !== undefined && <span>{label}</span>}
      {children as React.ReactNode}
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
          {children as React.ReactNode}
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
        <ReactionAdd onAdd={() => onReact?.('+1')} />
      </div>
    );
  }
);
ReactionBar.displayName = 'ReactionBar';

export interface ReactionItemProps extends HTMLMotionProps<'button'> {
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
      {...props}
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
          {children as React.ReactNode}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex items-start gap-3 py-3 w-full', className)} {...props}>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0 shadow-xs">
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
          {children as React.ReactNode}
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
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold shadow-2xs">
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



export interface ShareSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  url?: string;
  title?: string;
  children?: React.ReactNode;
}

export const ShareSheet = React.forwardRef<HTMLDivElement, ShareSheetProps>(
  ({ url = 'https://example.com', title = 'Share this project', className, children, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    if (children) {
      return (
        <div
          ref={ref}
          className={cn('rounded-2xl border border-border/80 bg-card p-5 shadow-lg max-w-sm w-full', className)}
          {...props}
        >
          {children as React.ReactNode}
        </div>
      );
    }

    const platforms: { name: string; color: string; icon: React.ReactNode }[] = [
      { name: 'X', color: 'bg-foreground text-background', icon: 'X' },
      { name: 'Facebook', color: 'bg-primary text-primary-foreground', icon: 'f' },
      { name: 'LinkedIn', color: 'bg-primary text-primary-foreground', icon: 'in' },
      { name: 'Telegram', color: 'bg-primary text-primary-foreground', icon: <Send className="w-3.5 h-3.5 -rotate-45" /> },
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
          {children as React.ReactNode}
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

// src/registry/pro-buttons.ts
var proButtons = {
  name: "pro-buttons",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "pro-buttons.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

export function MorphButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const shouldReduceMotion = useReducedMotion()
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...motionSafeProps } = props
  return (
    <motion.button
      className={cn(
        "relative px-6 py-2.5 rounded-lg font-semibold bg-primary text-primary-foreground border border-primary/20 cursor-pointer",
        className
      )}
      whileHover={shouldReduceMotion ? undefined : { borderRadius: "24px", scale: 1.02 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...motionSafeProps}
    >
      {children}
    </motion.button>
  )
}

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

export function StatusButton({ status = "idle", children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { status?: "idle" | "loading" | "success" | "error" }) {
  const variants: Record<string, { bg: string; text: string }> = {
    idle: { bg: "bg-primary", text: "text-primary-foreground" },
    loading: { bg: "bg-warning", text: "text-warning-foreground" },
    success: { bg: "bg-success", text: "text-success-foreground" },
    error: { bg: "bg-destructive", text: "text-destructive-foreground" },
  }
  const v = variants[status]
  return (
    <button className={cn("relative px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer", v.bg, v.text, className)} disabled={status === "loading"} {...props}>
      <AnimatePresence mode="wait">
        <motion.span key={status} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }} className="inline-flex items-center gap-2">
          {status === "loading" && <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />}
          {status === "success" && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          {status === "error" && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
          {status === "idle" ? children : status === "loading" ? "Loading..." : status === "success" ? "Done" : "Failed"}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export function SegmentedButton({ options, value, onChange, className }: {
  options: string[]
  value: string
  onChange: (val: string) => void
  className?: string
}) {
  const layoutGroupId = React.useId()
  const shouldReduceMotion = useReducedMotion()
  return (
    <div className={cn("inline-flex rounded-lg bg-muted p-1 gap-0.5", className)}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "relative px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer",
            value === opt ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {value === opt && (
            <motion.div
              layoutId={\`segmented-bg-\${layoutGroupId}\`}
              className="absolute inset-0 bg-background rounded-md shadow-xs"
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
            />
          )}
          <span className="relative z-10">{opt}</span>
        </button>
      ))}
    </div>
  )
}

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
  componentsDependencies: [
    "holo-finish-card",
    "particle-reveal-card",
    "glass-shatter-card",
    "frost-hover-card"
  ],
  fileName: "pro-cards.tsx",
  content: `"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../utils/cn"

export * from "./holo-finish-card";
export * from "./particle-reveal-card";
export * from "./glass-shatter-card";
export * from "./frost-hover-card";

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

export function GradientMeshCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative rounded-2xl overflow-hidden border border-border bg-card", className)}>
      <div className="absolute inset-0 bg-linear-to-br from-foreground/[0.04] via-transparent to-foreground/[0.02]" />
      <div className="relative p-6 rounded-2xl backdrop-blur-sm">
        {children}
      </div>
    </div>
  )
}

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

export function FeatureCard({ icon, title, description, className }: {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn("rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lg dark:hover:shadow-foreground/5", className)}
    >
      <div className="mb-3 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-foreground">
        {icon}
      </div>
      <h4 className="font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}

export function MetricCard({ title, value, change, changeType = "positive", className }: {
  title: string
  value: string
  change: string
  changeType?: "positive" | "negative" | "neutral"
  className?: string
}) {
  const colors = {
    positive: "text-success bg-success/10",
    negative: "text-destructive bg-destructive/10",
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

// src/registry/pro-inputs.ts
var proInputs = {
  name: "pro-inputs",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion"
  ],
  fileName: "pro-inputs.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../utils/cn"

export function OTPCodeInput({ length = 6, className, onChange }: { length?: number; className?: string; onChange?: (val: string) => void }) {
  const [values, setValues] = React.useState<string[]>(() => Array(length).fill(""))
  const refs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (i: number, v: string) => {
    const digits = v.replace(/\\D/g, "")
    if (!digits && v !== "") return
    const newVals = [...values]
    newVals[i] = digits.slice(-1)
    setValues(newVals)
    onChange?.(newVals.join(""))
    if (digits && i < length - 1) refs.current[i + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\\D/g, "").slice(0, length)
    if (!pasted) return
    const newVals = Array.from({ length }, (_, idx) => pasted[idx] || "")
    setValues(newVals)
    onChange?.(newVals.join(""))
    const focusIdx = Math.min(pasted.length, length - 1)
    refs.current[focusIdx]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[i] && i > 0) refs.current[i - 1]?.focus()
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus()
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus()
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
          aria-label={\`Digit \${i + 1} of \${length}\`}
          onChange={(e) => handleChange(i, e.target.value)}
          onPaste={handlePaste}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-11 h-11 sm:w-12 sm:h-12 text-center text-lg font-mono rounded-lg border border-border bg-background text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
        />
      ))}
    </div>
  )
}

export function TagInput({
  placeholder = "Add tag...",
  value,
  defaultValue = ["React", "TypeScript"],
  onChange,
  className,
}: {
  placeholder?: string
  value?: string[]
  defaultValue?: string[]
  onChange?: (tags: string[]) => void
  className?: string
}) {
  const [internalTags, setInternalTags] = React.useState<string[]>(defaultValue)
  const tags = value !== undefined ? value : internalTags
  const [input, setInput] = React.useState("")

  const updateTags = (next: string[]) => {
    if (value === undefined) setInternalTags(next)
    onChange?.(next)
  }

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      updateTags([...tags, trimmed])
      setInput("")
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-border bg-background min-h-[44px]", className)}>
      <AnimatePresence>
        {tags.map((tag) => (
          <motion.span
            key={tag}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              aria-label={\`Remove \${tag}\`}
              onClick={() => updateTags(tags.filter(t => t !== tag))}
              className="hover:text-destructive cursor-pointer"
            >
              \xD7
            </button>
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

// src/registry/pro-objects.ts
var proObjects = {
  name: "pro-objects",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  componentsDependencies: [
    "live-object",
    "sound-pulse",
    "silk-unveil"
  ],
  fileName: "pro-objects.tsx",
  content: `"use client";

export * from "./live-object";
export * from "./sound-pulse";
export * from "./silk-unveil";
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
  value?: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "error";
  showLabel?: boolean;
  progressLabel?: string;
  size?: "default" | "sm" | "lg";
  animated?: boolean;
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
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-destructive",
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
                ? "absolute inset-0 -translate-x-full origin-left bg-linear-to-r from-transparent via-primary to-transparent"
                : "transition-transform ease-out",
              animated && !isIndeterminate ? "duration-500" : "duration-0"
            )}
            style={
              isIndeterminate
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
  value?: number
  defaultValue?: number
  max?: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: RatingSize
  icon?: RatingIconType
  variant?: RatingVariant
  allowHalf?: boolean
  showScore?: boolean
  tooltips?: string[]
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
    active: "fill-warning text-warning",
    glow: "",
  },
  primary: {
    active: "fill-foreground text-foreground",
    glow: "",
  },
  emerald: {
    active: "fill-success text-success",
    glow: "",
  },
  rose: {
    active: "fill-destructive text-destructive",
    glow: "",
  },
  cyan: {
    active: "fill-foreground text-foreground",
    glow: "",
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
      variant = "primary",
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
    const styling = variantStyles[variant] || variantStyles.primary

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
                  "relative p-0.5 outline-none rounded-md transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
          <Rating value={rating} readonly size="sm" variant="primary" allowHalf className="mt-1" />
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
                <Star className="w-2.5 h-2.5 fill-foreground text-foreground" />
              </div>
              <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: \`\${pct}%\` }}
                  transition={{ duration: 0.8, delay: (5 - stars) * 0.08 }}
                  className="h-full rounded-full bg-foreground"
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
        "rounded-2xl border border-border/70 bg-card/60 p-5 w-full max-w-md space-y-3 backdrop-blur-md shadow-md hover:border-foreground/20 transition-colors",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={author} className="w-9 h-9 rounded-full object-cover border border-border" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-muted border border-border text-foreground font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">{author}</span>
              {verified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-success font-medium bg-success/10 px-1.5 py-0.5 rounded-full border border-success/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">{date}</span>
          </div>
        </div>

        <Rating value={rating} readonly size="sm" variant="primary" allowHalf />
      </div>

      {title && <h4 className="font-semibold text-sm text-foreground">{title}</h4>}
      <p className="text-xs text-muted-foreground leading-relaxed">{content}</p>
    </div>
  )
}
`
};

// src/registry/ripple-water.ts
var rippleWater = {
  name: "ripple-water",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "ripple-water.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface RippleWaterProps extends React.HTMLAttributes<HTMLCanvasElement> {
  fq?: number;
  spd?: number;
  damp?: number;
  wd?: number;
  amp?: number;
  refr?: number;
  disp?: number;
  spec?: number;
  shade?: number;
  gap?: number;
  idle?: number;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform float T;uniform sampler2D tx;
uniform vec4 RP[16];uniform float fq,spd,damp,wd,refr,disp,spec,shade;
void main(){
  vec2 uv=gl_FragCoord.xy/R,p=(gl_FragCoord.xy*2.-R)/R.y,g=vec2(0.);float h=0.;
  for(int i=0;i<16;i++){
    vec4 r=RP[i];float age=T-r.z;
    if(age<0.||age>9.)continue;
    vec2 dv=p-r.xy;float d=length(dv)+1e-4,s=d-age*spd,env=exp(-s*s/(wd*wd))*exp(-age*damp)*r.w*inversesqrt(.25+age*spd);
    float ph=s*fq,dw=(cos(ph)*fq-sin(ph)*2.*s/(wd*wd))*env;
    g+=dv/d*dw;h+=sin(ph)*env;
  }
  vec2 o=g*refr*.0004*vec2(R.y/R.x,1.);
  vec3 c=vec3(texture2D(tx,uv+o*(1.+disp)).r,texture2D(tx,uv+o).g,texture2D(tx,uv+o*(1.-disp)).b);
  vec3 n=normalize(vec3(-g*shade*.01,1.));
  c+=spec*pow(max(dot(n,normalize(vec3(-.4,.6,.7))),0.),40.);
  c*=1.+h*.12;
  gl_FragColor=vec4(c,1.);
}\`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function createDefaultTexture(gl: WebGLRenderingContext, w: number, h: number): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, w, h);
  const pal = ["#0a5cff", "#00d0c0", "#7a2cff", "#d8f4ff"];
  pal.forEach((color, i) => {
    const a = [0.18, 0.88, 0.62, 0.08][i];
    const b = [0.25, 0.3, 0.95, 0.95][i];
    const g = ctx.createRadialGradient(w * a, h * b, 0, w * a, h * b, Math.max(w, h) * 0.5);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let y = 0; y < h; y += 14) {
    ctx.fillRect(0, y, w, 2);
  }
  const fs = Math.min(w / 4, h * 0.35);
  ctx.font = \`800 \${fs}px system-ui, -apple-system, sans-serif\`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Still", w * 0.06, h * 0.45);
  ctx.fillText("Water", w * 0.06, h * 0.45 + fs * 0.88);
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export const RippleWater = forwardRef<HTMLCanvasElement, RippleWaterProps>(function RippleWater(
  {
    fq = 48,
    spd = 1.1,
    damp = 1.1,
    wd = 0.18,
    amp = 1,
    refr = 1.2,
    disp = 0.35,
    spec = 0.8,
    shade = 2.5,
    gap = 0.12,
    idle = 0.6,
    background,
    paused = false,
    className,
    style,
    ...props
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "q");
    gl.linkProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let defaultTex = createDefaultTexture(gl, canvas.clientWidth || 600, canvas.clientHeight || 400);
    let customTex: WebGLTexture | null = null;

    if (background) {
      if (typeof background === "string") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = background;
        img.onload = () => {
          if (!gl.isContextLost()) {
            customTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, customTex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          }
        };
      } else {
        customTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, customTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
    }

    const rp = new Float32Array(64);
    for (let i = 0; i < 16; i++) rp[i * 4 + 2] = -100;
    let ri = 0;
    const drop = (x: number, y: number, t: number, a: number) => {
      rp[ri * 4] = x;
      rp[ri * 4 + 1] = y;
      rp[ri * 4 + 2] = t;
      rp[ri * 4 + 3] = a;
      ri = (ri + 1) % 16;
    };

    const m = { x: 0, y: 0 };
    let lx = 0;
    let ly = 0;
    let ls = 0;
    let nd = 0;
    let lm = -1e5;
    let isVisible = true;
    let isDocVisible = !document.hidden;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      m.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      m.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      lm = performance.now();
    };
    canvas.addEventListener("pointermove", onPointerMove);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let ema = 16.7;
    let rs = 1.0;
    let good = 0;
    let last = 0;
    let animId = 0;
    let hasRenderedOnce = false;

    const render = (ms: number) => {
      animId = requestAnimationFrame(render);
      if (paused || (!isVisible && hasRenderedOnce) || (!isDocVisible && hasRenderedOnce)) return;

      const dt = ms - last;
      last = ms;
      if (dt > 0 && dt < 200) {
        ema += (dt - ema) * 0.05;
        if (ema > 23 && rs > 0.5) {
          rs = Math.max(0.5, rs - 0.1);
          ema = 16.7;
          good = 0;
        } else if (ema < 17.6 && rs < 1.0 && ++good > 180) {
          rs = Math.min(1.0, rs + 0.05);
          good = 0;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * rs;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if (!background) {
          if (defaultTex) gl.deleteTexture(defaultTex);
          defaultTex = createDefaultTexture(gl, w, h);
        }
      }

      const asp = w / h;
      const t = ms / 1000;
      const isIdle = !reducedMotion && performance.now() - lm > 2500;

      if (!isIdle && Math.hypot(m.x * asp - lx, m.y - ly) > gap && t - ls > 0.04) {
        drop(m.x * asp, m.y, t, amp);
        lx = m.x * asp;
        ly = m.y;
        ls = t;
        nd = t + 1.5;
      } else if (isIdle && idle > 0 && t > nd) {
        drop((Math.random() * 2 - 1) * asp * 0.85, (Math.random() * 2 - 1) * 0.75, t, amp * (0.7 + Math.random() * 0.5));
        nd = t + (1.8 - 1.6 * idle) * (0.6 + Math.random() * 0.8);
      }

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "T"), t);
      gl.uniform4fv(gl.getUniformLocation(prog, "RP[0]"), rp);

      gl.uniform1f(gl.getUniformLocation(prog, "fq"), fq);
      gl.uniform1f(gl.getUniformLocation(prog, "spd"), spd);
      gl.uniform1f(gl.getUniformLocation(prog, "damp"), damp);
      gl.uniform1f(gl.getUniformLocation(prog, "wd"), wd);
      gl.uniform1f(gl.getUniformLocation(prog, "refr"), refr);
      gl.uniform1f(gl.getUniformLocation(prog, "disp"), disp);
      gl.uniform1f(gl.getUniformLocation(prog, "spec"), spec);
      gl.uniform1f(gl.getUniformLocation(prog, "shade"), shade);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, customTex || defaultTex);
      gl.uniform1i(gl.getUniformLocation(prog, "tx"), 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      hasRenderedOnce = true;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      if (defaultTex) gl.deleteTexture(defaultTex);
      if (customTex) gl.deleteTexture(customTex);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [fq, spd, damp, wd, amp, refr, disp, spec, shade, gap, idle, background, paused]);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      }}
      className={cn("block w-full h-full touch-none select-none", className)}
      style={style}
      {...props}
    />
  );
});

RippleWater.displayName = "RippleWater";
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

// src/registry/scroll-drum.ts
var scrollDrum = {
  name: "scroll-drum",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "scroll-drum.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface ScrollDrumProps extends React.HTMLAttributes<HTMLCanvasElement> {
  rad?: number;
  gain?: number;
  spd?: number;
  bulge?: number;
  fade?: number;
  split?: number;
  tilt?: number;
  hl?: number;
  inertia?: number;
  vgain?: number;
  words?: string[];
  scrollContainer?: React.RefObject<HTMLElement | null>;
  scrollProgress?: number;
  captureWheel?: boolean;
  autoScroll?: boolean;
  autoSpeed?: number;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform sampler2D tx;
uniform float rot,vel,rad,bulge,fade,split,tilt,hl;
void main(){
  vec2 p=(gl_FragCoord.xy*2.-R)/R.y;float c=cos(tilt),s=sin(tilt);p=mat2(c,-s,s,c)*p;
  float y=p.y/rad;vec3 col=vec3(.035,.035,.045);
  if(abs(y)<1.){
    float th=asin(y),cz=cos(th),x=p.x/(1.+bulge*(1.-cz)),u=x/(6.28318*rad)+.5,v=(th+rot)/6.28318,ph=split*vel*.04;
    vec3 t=vec3(texture2D(tx,vec2(u,v+ph)).r,texture2D(tx,vec2(u,v)).g,texture2D(tx,vec2(u,v-ph)).b);
    float q=(th-.35)*3.;t=t*mix(1.,pow(cz,1.3),fade)+hl*.22*exp(-q*q);
    col=mix(col,t,1.-smoothstep(.985,1.,abs(y)));
  }
  gl_FragColor=vec4(col,1.);
}\`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function createDrumTexture(gl: WebGLRenderingContext, words: string[]): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 2048;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  const bgs = ["#ff4a2b", "#0b0b10", "#2d4bff", "#f2efe8", "#ffe14a", "#0b0b10", "#25e0c0", "#f2efe8"];
  const fgs = ["#0b0b10", "#f2efe8", "#ffe14a", "#0b0b10", "#0b0b10", "#ff4a2b", "#0b0b10", "#2d4bff"];

  for (let i = 0; i < 8; i++) {
    const text = words[i % words.length] || \`Item \${i + 1}\`;
    ctx.fillStyle = bgs[i % bgs.length];
    ctx.fillRect(0, i * 256, 2048, 256);
    ctx.fillStyle = fgs[i % fgs.length];
    ctx.font = \`900 180px system-ui, -apple-system, sans-serif\`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text, 1024, i * 256 + 134);
  }

  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  return tex;
}

export const ScrollDrum = forwardRef<HTMLCanvasElement, ScrollDrumProps>(function ScrollDrum(
  {
    rad = 1.15,
    gain = 1.2,
    spd = 0.12,
    bulge = 0.35,
    fade = 0.8,
    split = 0.8,
    tilt = -0.12,
    hl = 0.8,
    inertia = 0.1,
    vgain = 1,
    words = ["Design", "Motion", "Depth", "Scroll", "Light", "Glass", "Type", "Flow"],
    scrollContainer,
    scrollProgress,
    captureWheel = false,
    autoScroll = false,
    autoSpeed = 3.5,
    background,
    paused = false,
    className,
    style,
    ...props
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "q");
    gl.linkProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let defaultTex = createDrumTexture(gl, words);
    let customTex: WebGLTexture | null = null;

    if (background) {
      if (typeof background === "string") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = background;
        img.onload = () => {
          if (!gl.isContextLost()) {
            customTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, customTex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
          }
        };
      } else {
        customTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, customTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      }
    }

    let sm = 0;
    let sPrev = 0;
    let vsVal = 0;
    let ph = 0;
    let currentScroll = 0;
    let virtualScroll = 0;
    let isDragging = false;
    let dragStartY = 0;

    let isVisible = true;
    let isDocVisible = !document.hidden;

    const onScroll = () => {
      if (scrollContainer && scrollContainer.current) {
        currentScroll = scrollContainer.current.scrollTop;
      } else {
        currentScroll = window.scrollY;
      }
    };

    const targetEl = scrollContainer && scrollContainer.current ? scrollContainer.current : window;
    targetEl.addEventListener("scroll", onScroll as EventListener, { passive: true });

    const onWheel = (e: WheelEvent) => {
      if (!captureWheel) return;
      e.preventDefault();
      virtualScroll += e.deltaY * 0.9;
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartY = e.clientY;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dy = dragStartY - e.clientY;
      dragStartY = e.clientY;
      virtualScroll += dy * 2.5;
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let ema = 16.7;
    let rs = 1.0;
    let good = 0;
    let last = 0;
    let animId = 0;
    let hasRenderedOnce = false;

    const render = (ms: number) => {
      animId = requestAnimationFrame(render);
      if (paused || (!isVisible && hasRenderedOnce) || (!isDocVisible && hasRenderedOnce)) return;

      const dt = ms - last;
      last = ms;
      if (dt > 0 && dt < 200) {
        ema += (dt - ema) * 0.05;
        if (ema > 23 && rs > 0.5) {
          rs = Math.max(0.5, rs - 0.1);
          ema = 16.7;
          good = 0;
        } else if (ema < 17.6 && rs < 1.0 && ++good > 180) {
          rs = Math.min(1.0, rs + 0.05);
          good = 0;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.25) * rs;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const vh = canvas.clientHeight || window.innerHeight || 800;
      if (autoScroll) {
        virtualScroll += autoSpeed;
      }
      const targetScroll =
        scrollProgress !== undefined
          ? scrollProgress * vh * 6
          : captureWheel || autoScroll
          ? virtualScroll
          : currentScroll;

      const ds = Math.min(dt, 50) / 1000 || 0.016;
      sm += (targetScroll - sm) * inertia;
      const v = (sm - sPrev) / vh / ds;
      sPrev = sm;
      vsVal += (Math.max(-2, Math.min(2, v * 0.25 * vgain)) - vsVal) * 0.12;
      ph += ds * spd;

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "rot"), ph + (sm / vh) * gain);
      gl.uniform1f(gl.getUniformLocation(prog, "vel"), vsVal);
      gl.uniform1f(gl.getUniformLocation(prog, "rad"), rad);
      gl.uniform1f(gl.getUniformLocation(prog, "bulge"), bulge);
      gl.uniform1f(gl.getUniformLocation(prog, "fade"), fade);
      gl.uniform1f(gl.getUniformLocation(prog, "split"), split);
      gl.uniform1f(gl.getUniformLocation(prog, "tilt"), tilt);
      gl.uniform1f(gl.getUniformLocation(prog, "hl"), hl);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, customTex || defaultTex);
      gl.uniform1i(gl.getUniformLocation(prog, "tx"), 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      hasRenderedOnce = true;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      targetEl.removeEventListener("scroll", onScroll as EventListener);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      if (defaultTex) gl.deleteTexture(defaultTex);
      if (customTex) gl.deleteTexture(customTex);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [
    rad,
    gain,
    spd,
    bulge,
    fade,
    split,
    tilt,
    hl,
    inertia,
    vgain,
    words,
    scrollContainer,
    scrollProgress,
    captureWheel,
    background,
    paused,
  ]);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      }}
      className={cn("block w-full h-full touch-none select-none cursor-ns-resize", className)}
      style={style}
      {...props}
    />
  );
});

ScrollDrum.displayName = "ScrollDrum";
`
};

// src/registry/scroll-warp.ts
var scrollWarp = {
  name: "scroll-warp",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "scroll-warp.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface ScrollWarpProps extends React.HTMLAttributes<HTMLCanvasElement> {
  curve?: number;
  skew?: number;
  split?: number;
  wave?: number;
  zoom?: number;
  inertia?: number;
  vgain?: number;
  grain?: number;
  slices?: number;
  words?: string[];
  captions?: string[];
  scrollContainer?: React.RefObject<HTMLElement | null>;
  scrollProgress?: number;
  captureWheel?: boolean;
  autoScroll?: boolean;
  autoSpeed?: number;
  wrapScroll?: boolean;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = "attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}";
const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform float T;uniform sampler2D tx;
uniform float o,vel,N,curve,skew,split,wave,zoom,grain;
void main(){
  vec2 uv=gl_FragCoord.xy/R,p=uv*2.-1.;float asp=R.x/R.y;
  float k=clamp(vel*curve,-.9,.9);p.y=sign(p.y)*pow(abs(p.y)+1e-4,1.+k);
  p/=1.+abs(vel)*zoom*.15;
  p.x=p.x*asp+p.y*vel*skew*.5+sin(p.y*4.+T*1.5)*wave*.05*(.25+abs(vel));
  float ux=p.x/asp*.5+.5,t=o+.5-p.y*.5,sp=split*vel*.04;
  vec3 c=vec3(
    texture2D(tx,vec2(ux,fract(1.-(t+sp)/N))).r,
    texture2D(tx,vec2(ux,fract(1.-t/N))).g,
    texture2D(tx,vec2(ux,fract(1.-(t-sp)/N))).b
  );
  c+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9,78.2))+T)*43758.5)-.5)*grain;
  gl_FragColor=vec4(c,1.);
}\`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function createDefaultTexture(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  N: number,
  words: string[],
  captions: string[]
): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = Math.max(1, w);
  c.height = Math.max(1, h * N);
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  const cols = [
    ["#ff4a2b", "#0b0b10"],
    ["#0b0b10", "#f2efe8"],
    ["#2d4bff", "#ffe14a"],
    ["#f2efe8", "#0b0b10"],
  ];

  for (let i = 0; i < N; i++) {
    const [bg, fg] = cols[i % cols.length];
    const y0 = i * h;
    ctx.fillStyle = bg;
    ctx.fillRect(0, y0, w, h);
    ctx.fillStyle = fg;

    const word = words[i % words.length] || \`Scene \${i + 1}\`;
    const fs = Math.min(w * 0.22, h * 0.38);
    ctx.font = \`900 \${fs}px system-ui, -apple-system, sans-serif\`;
    ctx.fillText(word, w * 0.06, y0 + h * 0.56);

    ctx.globalAlpha = 0.3;
    ctx.fillRect(w * 0.06, y0 + h * 0.14, w * 0.88, 2);
    ctx.fillRect(w * 0.06, y0 + h * 0.86, w * 0.88, 2);
    ctx.globalAlpha = 1.0;

    const cap = captions[i % captions.length] || "Scroll velocity bends the canvas frame.";
    ctx.font = \`500 \${Math.max(13, h * 0.04)}px system-ui, -apple-system, sans-serif\`;
    ctx.fillText(cap, w * 0.06, y0 + h * 0.92);
  }

  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export const ScrollWarp = forwardRef<HTMLCanvasElement, ScrollWarpProps>(function ScrollWarp(
  {
    curve = 1,
    skew = 0.6,
    split = 0.8,
    wave = 0.4,
    zoom = 0.5,
    inertia = 0.12,
    vgain = 1,
    grain = 0.04,
    slices = 4,
    words = ["Scroll", "Pulls", "The", "Page"],
    captions = [
      "Scroll slowly, then flick.",
      "Speed bends the picture.",
      "Direction picks the side.",
      "One texture, one shader.",
    ],
    scrollContainer,
    scrollProgress,
    captureWheel = false,
    autoScroll = false,
    autoSpeed = 3.5,
    wrapScroll = true,
    background,
    paused = false,
    className,
    style,
    ...props
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "q");
    gl.linkProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let defaultTex = createDefaultTexture(
      gl,
      canvas.clientWidth || 600,
      canvas.clientHeight || 400,
      slices,
      words,
      captions
    );
    let customTex: WebGLTexture | null = null;

    if (background) {
      if (typeof background === "string") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = background;
        img.onload = () => {
          if (!gl.isContextLost()) {
            customTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, customTex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          }
        };
      } else {
        customTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, customTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      }
    }

    let sm = 0;
    let sPrev = 0;
    let vsVal = 0;
    let currentScroll = 0;
    let virtualScroll = 0;
    let isDragging = false;
    let dragStartY = 0;

    let isVisible = true;
    let isDocVisible = !document.hidden;

    const onScroll = () => {
      if (scrollContainer && scrollContainer.current) {
        currentScroll = scrollContainer.current.scrollTop;
      } else {
        currentScroll = window.scrollY;
      }
    };

    const targetEl = scrollContainer && scrollContainer.current ? scrollContainer.current : window;
    targetEl.addEventListener("scroll", onScroll as EventListener, { passive: true });

    const onWheel = (e: WheelEvent) => {
      if (!captureWheel) return;
      e.preventDefault();
      const vh = canvas.clientHeight || window.innerHeight || 800;
      virtualScroll += e.deltaY * 0.85;
      if (!wrapScroll) {
        const maxScroll = Math.max(1, (slices - 1) * vh);
        if (virtualScroll < 0) virtualScroll = 0;
        if (virtualScroll > maxScroll) virtualScroll = maxScroll;
      }
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartY = e.clientY;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dy = dragStartY - e.clientY;
      dragStartY = e.clientY;
      const vh = canvas.clientHeight || window.innerHeight || 800;
      virtualScroll += dy * 2.4;
      if (!wrapScroll) {
        const maxScroll = Math.max(1, (slices - 1) * vh);
        if (virtualScroll < 0) virtualScroll = 0;
        if (virtualScroll > maxScroll) virtualScroll = maxScroll;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let ema = 16.7;
    let rs = 1.0;
    let good = 0;
    let last = 0;
    let animId = 0;
    let hasRenderedOnce = false;

    const render = (ms: number) => {
      animId = requestAnimationFrame(render);
      if (paused || (!isVisible && hasRenderedOnce) || (!isDocVisible && hasRenderedOnce)) return;

      const dt = ms - last;
      last = ms;
      if (dt > 0 && dt < 200) {
        ema += (dt - ema) * 0.05;
        if (ema > 23 && rs > 0.5) {
          rs = Math.max(0.5, rs - 0.1);
          ema = 16.7;
          good = 0;
        } else if (ema < 17.6 && rs < 1.0 && ++good > 180) {
          rs = Math.min(1.0, rs + 0.05);
          good = 0;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.25) * rs;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if (!background) {
          if (defaultTex) gl.deleteTexture(defaultTex);
          defaultTex = createDefaultTexture(gl, w, h, slices, words, captions);
        }
      }

      const vh = canvas.clientHeight || window.innerHeight || 800;
      if (autoScroll) {
        virtualScroll += autoSpeed;
      }
      const targetScroll =
        scrollProgress !== undefined
          ? scrollProgress * vh * (slices - 1)
          : captureWheel || autoScroll
          ? virtualScroll
          : currentScroll;

      const ds = Math.min(dt, 50) / 1000 || 0.016;
      sm += (targetScroll - sm) * inertia;
      const v = (sm - sPrev) / vh / ds;
      sPrev = sm;
      vsVal += (Math.max(-2, Math.min(2, v * 0.25 * vgain)) - vsVal) * 0.12;

      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);

      gl.uniform2f(gl.getUniformLocation(prog, "R"), w, h);
      gl.uniform1f(gl.getUniformLocation(prog, "T"), ms / 1000);
      gl.uniform1f(gl.getUniformLocation(prog, "o"), sm / vh);
      gl.uniform1f(gl.getUniformLocation(prog, "vel"), vsVal);
      gl.uniform1f(gl.getUniformLocation(prog, "N"), slices);
      gl.uniform1f(gl.getUniformLocation(prog, "curve"), curve);
      gl.uniform1f(gl.getUniformLocation(prog, "skew"), skew);
      gl.uniform1f(gl.getUniformLocation(prog, "split"), split);
      gl.uniform1f(gl.getUniformLocation(prog, "wave"), wave);
      gl.uniform1f(gl.getUniformLocation(prog, "zoom"), zoom);
      gl.uniform1f(gl.getUniformLocation(prog, "grain"), grain);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, customTex || defaultTex);
      gl.uniform1i(gl.getUniformLocation(prog, "tx"), 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      hasRenderedOnce = true;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      targetEl.removeEventListener("scroll", onScroll as EventListener);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      if (defaultTex) gl.deleteTexture(defaultTex);
      if (customTex) gl.deleteTexture(customTex);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [
    curve,
    skew,
    split,
    wave,
    zoom,
    inertia,
    vgain,
    grain,
    slices,
    words,
    captions,
    scrollContainer,
    scrollProgress,
    captureWheel,
    background,
    paused,
  ]);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      }}
      className={cn("block w-full h-full touch-none select-none cursor-ns-resize", className)}
      style={style}
      {...props}
    />
  );
});

ScrollWarp.displayName = "ScrollWarp";
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

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border/50", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
`
};

// src/registry/silk-unveil.ts
var silkUnveil = {
  name: "silk-unveil",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "silk-unveil.tsx",
  content: `"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { cn } from "../utils/cn";

export interface SilkUnveilProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  aspectRatio?: string;
  productWidth?: string;
  clothDark?: [number, number, number];
  clothLight?: [number, number, number];
  alt?: string;
  defaultUnveiled?: boolean;
}

interface Point {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  pinned: boolean;
  row: number;
  col: number;
}

interface Constraint {
  p1: Point;
  p2: Point;
  restLength: number;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const COLS = 12;
const ROWS = 15;
const ANIM_DURATION_MS = 1100;

export const SilkUnveil = React.forwardRef<HTMLDivElement, SilkUnveilProps>(
  (
    {
      src,
      aspectRatio = "3/4",
      productWidth = "52%",
      clothDark = [24, 24, 27],
      clothLight = [228, 228, 231],
      alt = "Unveiled Product",
      defaultUnveiled = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafIdRef = useRef<number | null>(null);

    const pointsRef = useRef<Point[][]>([]);
    const constraintsRef = useRef<Constraint[]>([]);
    const spacingXRef = useRef<number>(0);
    const spacingYRef = useRef<number>(0);
    const stageDimRef = useRef<{ w: number; h: number }>({ w: 400, h: 500 });

    const dragTRef = useRef<number>(defaultUnveiled ? 1 : 0);
    const animStateRef = useRef<{
      active: boolean;
      startTime: number;
      startT: number;
      targetT: number;
    }>({
      active: false,
      startTime: 0,
      startT: defaultUnveiled ? 1 : 0,
      targetT: defaultUnveiled ? 1 : 0,
    });

    const [isUnveiled, setIsUnveiled] = useState<boolean>(defaultUnveiled);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }, []);

    const initClothGrid = useCallback((width: number, height: number, initialDragT: number) => {
      stageDimRef.current = { w: width, h: height };
      const spacingX = (width + 40) / (COLS - 1);
      const spacingY = (height * 1.25 + 40) / (ROWS - 1);
      spacingXRef.current = spacingX;
      spacingYRef.current = spacingY;

      const pts: Point[][] = [];
      const easeT = easeInOutCubic(initialDragT);

      for (let r = 0; r < ROWS; r++) {
        const rowPts: Point[] = [];
        for (let c = 0; c < COLS; c++) {
          const isTop = r === 0;
          let initX = -20 + c * spacingX;
          let initY = -30 + r * spacingY;

          if (isTop) {
            const coveredX = -20 + c * spacingX;
            const coveredY = -30;
            const awayX = width * 0.9 + c * 5;
            const awayY = -height * 0.9 - c * 6;
            initX = coveredX + (awayX - coveredX) * easeT;
            initY = coveredY + (awayY - coveredY) * easeT;
          }

          rowPts.push({
            x: initX,
            y: initY,
            prevX: initX,
            prevY: initY,
            pinned: isTop,
            row: r,
            col: c,
          });
        }
        pts.push(rowPts);
      }

      const links: Constraint[] = [];

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const p = pts[r][c];

          if (c < COLS - 1) {
            const pRight = pts[r][c + 1];
            links.push({
              p1: p,
              p2: pRight,
              restLength: spacingX,
            });
          }

          if (r < ROWS - 1) {
            const pDown = pts[r + 1][c];
            links.push({
              p1: p,
              p2: pDown,
              restLength: spacingY,
            });
          }

          if (r < ROWS - 1 && c < COLS - 1) {
            const pDiag1 = pts[r + 1][c + 1];
            links.push({
              p1: p,
              p2: pDiag1,
              restLength: Math.hypot(spacingX, spacingY),
            });

            const pRight = pts[r][c + 1];
            const pDown = pts[r + 1][c];
            links.push({
              p1: pRight,
              p2: pDown,
              restLength: Math.hypot(spacingX, spacingY),
            });
          }
        }
      }

      pointsRef.current = pts;
      constraintsRef.current = links;
    }, []);

    const toggleUnveil = useCallback(() => {
      const nextTarget = isUnveiled ? 0 : 1;
      setIsUnveiled(!isUnveiled);

      animStateRef.current = {
        active: true,
        startTime: performance.now(),
        startT: dragTRef.current,
        targetT: nextTarget,
      };
    }, [isUnveiled]);

    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const handleResize = () => {
        const rect = container.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.resetTransform?.();
          ctx.scale(dpr, dpr);
        }

        initClothGrid(rect.width, rect.height, dragTRef.current);
      };

      handleResize();
      const ro = new ResizeObserver(handleResize);
      ro.observe(container);

      return () => ro.disconnect();
    }, [initClothGrid]);

    useEffect(() => {
      let active = true;

      const loop = (time: number) => {
        if (!active) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const pts = pointsRef.current;
        const links = constraintsRef.current;
        const { w: width, h: height } = stageDimRef.current;

        if (canvas && ctx && pts.length > 0 && links.length > 0) {
          const anim = animStateRef.current;
          if (anim.active) {
            const elapsed = (time - anim.startTime) / ANIM_DURATION_MS;
            if (elapsed >= 1) {
              dragTRef.current = anim.targetT;
              anim.active = false;
            } else {
              dragTRef.current = anim.startT + (anim.targetT - anim.startT) * elapsed;
            }
          }

          const currentDragT = dragTRef.current;
          const easeT = easeInOutCubic(currentDragT);
          const spacingX = spacingXRef.current;

          for (let c = 0; c < COLS; c++) {
            const anchor = pts[0][c];
            const coveredX = -20 + c * spacingX;
            const coveredY = -30;
            const awayX = width * 0.9 + c * 5;
            const awayY = -height * 0.9 - c * 6;

            const targetX = coveredX + (awayX - coveredX) * easeT;
            const targetY = coveredY + (awayY - coveredY) * easeT;

            anchor.x = targetX;
            anchor.y = targetY;
            anchor.prevX = targetX;
            anchor.prevY = targetY;
          }

          const gravity = prefersReducedMotion ? 0.35 : 0.42;
          for (let r = 1; r < ROWS; r++) {
            const rowRatio = r / ROWS;
            for (let c = 0; c < COLS; c++) {
              const p = pts[r][c];
              const vx = (p.x - p.prevX) * 0.985;
              const vy = (p.y - p.prevY) * 0.985;

              p.prevX = p.x;
              p.prevY = p.y;

              const wind = prefersReducedMotion
                ? 0
                : Math.sin(time * 0.0016 + p.y * 0.02) * 0.1 * rowRatio;

              p.x += vx + wind;
              p.y += vy + gravity;
            }
          }

          for (let iter = 0; iter < 5; iter++) {
            for (let i = 0; i < links.length; i++) {
              const link = links[i];
              const p1 = link.p1;
              const p2 = link.p2;

              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const dist = Math.hypot(dx, dy) || 0.0001;
              const diff = (dist - link.restLength) / dist;

              if (p1.pinned && !p2.pinned) {
                p2.x -= dx * diff;
                p2.y -= dy * diff;
              } else if (!p1.pinned && p2.pinned) {
                p1.x += dx * diff;
                p1.y += dy * diff;
              } else if (!p1.pinned && !p2.pinned) {
                p1.x += dx * 0.5 * diff;
                p1.y += dy * 0.5 * diff;
                p2.x -= dx * 0.5 * diff;
                p2.y -= dy * 0.5 * diff;
              }
            }
          }

          ctx.clearRect(0, 0, width, height);

          for (let r = 0; r < ROWS - 1; r++) {
            const rowRatio = r / ROWS;
            for (let c = 0; c < COLS - 1; c++) {
              const P00 = pts[r][c];
              const P10 = pts[r][c + 1];
              const P11 = pts[r + 1][c + 1];
              const P01 = pts[r + 1][c];

              const topLen = Math.hypot(P10.x - P00.x, P10.y - P00.y);
              const btmLen = Math.hypot(P11.x - P01.x, P11.y - P01.y);
              const avgHoriz = (topLen + btmLen) * 0.5;
              const compression = spacingX - avgHoriz;

              let t = 0.5 + compression * 0.05 - rowRatio * 0.12;
              t = Math.max(0, Math.min(1, t));

              const rc = Math.round(clothDark[0] + (clothLight[0] - clothDark[0]) * t);
              const gc = Math.round(clothDark[1] + (clothLight[1] - clothDark[1]) * t);
              const bc = Math.round(clothDark[2] + (clothLight[2] - clothDark[2]) * t);

              ctx.beginPath();
              ctx.moveTo(P00.x, P00.y);
              ctx.lineTo(P10.x, P10.y);
              ctx.lineTo(P11.x, P11.y);
              ctx.lineTo(P01.x, P01.y);
              ctx.closePath();

              ctx.fillStyle = \`rgb(\${rc}, \${gc}, \${bc})\`;
              ctx.fill();

              ctx.strokeStyle = \`rgba(\${rc}, \${gc}, \${bc}, 0.35)\`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }

        rafIdRef.current = requestAnimationFrame(loop);
      };

      rafIdRef.current = requestAnimationFrame(loop);

      return () => {
        active = false;
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }, [clothDark, clothLight, prefersReducedMotion]);

    return (
      <div
        ref={ref}
        className={cn("relative flex flex-col items-center select-none", className)}
        style={{ ...style }}
        {...props}
      >
        {/* Stage Container */}
        <div
          ref={containerRef}
          className="relative w-full rounded-3xl bg-zinc-950/90 border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-md"
          style={{ aspectRatio }}
        >
          {/* Subtle Ambient Background Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: \`radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)\`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* Layer 1 (Bottom): Shadow Ellipse under the product */}
          <div
            className="absolute pointer-events-none rounded-[100%] opacity-80"
            style={{
              bottom: "16%",
              width: "60%",
              height: "18%",
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 45%, transparent 72%)",
              filter: "blur(8px)",
            }}
          />

          {/* Layer 2 (Middle): Product image centered */}
          <div
            className="relative z-10 flex items-center justify-center pointer-events-none transition-transform duration-300"
            style={{
              width: productWidth,
              filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.7))",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="w-full h-auto object-contain select-none drag-none"
              draggable={false}
            />
          </div>

          {/* Layer 3 (Top): Verlet Fabric Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          />

          {/* Unveil Action Trigger Button */}
          <div className="absolute bottom-4 z-30 flex items-center justify-center">
            <button
              type="button"
              onClick={toggleUnveil}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-white bg-zinc-900/85 hover:bg-zinc-800 border border-white/12 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer active:scale-95"
              aria-label={isUnveiled ? "Cover product with silk" : "Unveil product"}
            >
              {isUnveiled ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Drape</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Unveil</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SilkUnveil.displayName = "SilkUnveil";
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
  width?: string | number;
  height?: string | number;
  variant?: "line" | "circle" | "rect";
  count?: number;
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
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ min = 0, max = 100, step = 1, value, defaultValue = 0, onChange, showValue = false, variant = "default", className, ...props }, ref) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<number>(defaultValue);
  const currentValue = isControlled ? value : internalValue;

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
    "clsx",
    "tailwind-merge",
    "lucide-react"
  ],
  fileName: "sound-pulse.tsx",
  content: `"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "../utils/cn";

export interface SoundPulseProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  accentFrom?: string;
  accentTo?: string;
  bpm?: number;
  alt?: string;
  stageSize?: number | string;
}

const TOTAL_BARS = 56;

export const SoundPulse = React.forwardRef<HTMLDivElement, SoundPulseProps>(
  (
    {
      src,
      accentFrom = "#71717a",
      accentTo = "#fafafa",
      bpm = 100,
      alt = "SoundPulse Audio-Reactive Product",
      stageSize = 460,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sequencerTimerRef = useRef<number | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const stepRef = useRef<number>(0);
    const bassSmoothedRef = useRef<number>(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [containerPx, setContainerPx] = useState(460);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    const [barHeights, setBarHeights] = useState<number[]>(() =>
      Array.from({ length: TOTAL_BARS }, () => 8)
    );
    const [barOpacities, setBarOpacities] = useState<number[]>(() =>
      Array.from({ length: TOTAL_BARS }, () => 0.4)
    );
    const [bassLevel, setBassLevel] = useState<number>(0);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateDimensions = () => {
        const rect = container.getBoundingClientRect();
        if (rect.width > 0) {
          setContainerPx(rect.width);
        }
      };

      updateDimensions();
      const ro = new ResizeObserver(updateDimensions);
      ro.observe(container);
      return () => ro.disconnect();
    }, []);

    const createNoiseBuffer = useCallback((ctx: AudioContext, durationSec: number): AudioBuffer => {
      const bufferSize = Math.floor(ctx.sampleRate * durationSec);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      return buffer;
    }, []);

    const playSequencerStep = useCallback(
      (ctx: AudioContext, master: GainNode, step: number) => {
        const now = ctx.currentTime;

        if (step === 0 || step === 4) {
          try {
            const kickOsc = ctx.createOscillator();
            const kickGain = ctx.createGain();
            kickOsc.type = "sine";
            kickOsc.frequency.setValueAtTime(120, now);
            kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.14);

            kickGain.gain.setValueAtTime(0.9, now);
            kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

            kickOsc.connect(kickGain);
            kickGain.connect(master);
            kickOsc.start(now);
            kickOsc.stop(now + 0.16);
          } catch (e) {
          }
        }

        if (step % 2 === 1) {
          try {
            const noise = ctx.createBufferSource();
            noise.buffer = createNoiseBuffer(ctx, 0.05);

            const filter = ctx.createBiquadFilter();
            filter.type = "highpass";
            filter.frequency.setValueAtTime(7000, now);

            const hatGain = ctx.createGain();
            hatGain.gain.setValueAtTime(0.28, now);
            hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            noise.connect(filter);
            filter.connect(hatGain);
            hatGain.connect(master);
            noise.start(now);
            noise.stop(now + 0.05);
          } catch (e) {
          }
        }

        if (step === 0 || step === 3 || step === 6) {
          try {
            const bassOsc = ctx.createOscillator();
            const bassFilter = ctx.createBiquadFilter();
            const bassGain = ctx.createGain();

            bassOsc.type = "sawtooth";
            const freq = step === 0 ? 55 : step === 3 ? 73.4 : 65.4;
            bassOsc.frequency.setValueAtTime(freq, now);

            bassFilter.type = "lowpass";
            bassFilter.frequency.setValueAtTime(900, now);

            bassGain.gain.setValueAtTime(0.42, now);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            bassOsc.connect(bassFilter);
            bassFilter.connect(bassGain);
            bassGain.connect(master);

            bassOsc.start(now);
            bassOsc.stop(now + 0.3);
          } catch (e) {
          }
        }
      },
      [createNoiseBuffer]
    );

    const togglePlay = useCallback(async () => {
      if (typeof window === "undefined") return;

      if (!isPlaying) {
        let ctx = audioCtxRef.current;
        if (!ctx || ctx.state === "closed") {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          const master = ctx.createGain();
          master.gain.setValueAtTime(isMuted ? 0 : 0.85, ctx.currentTime);
          masterGainRef.current = master;

          const analyser = ctx.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.8;
          analyserRef.current = analyser;

          master.connect(analyser);
          analyser.connect(ctx.destination);
        }

        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        const intervalMs = Math.max(50, 60000 / bpm / 2);
        if (sequencerTimerRef.current) {
          window.clearInterval(sequencerTimerRef.current);
        }

        sequencerTimerRef.current = window.setInterval(() => {
          if (!audioCtxRef.current || !masterGainRef.current) return;
          playSequencerStep(audioCtxRef.current, masterGainRef.current, stepRef.current);
          stepRef.current = (stepRef.current + 1) % 8;
        }, intervalMs);

        setIsPlaying(true);
      } else {
        if (sequencerTimerRef.current) {
          window.clearInterval(sequencerTimerRef.current);
          sequencerTimerRef.current = null;
        }
        if (audioCtxRef.current && audioCtxRef.current.state === "running") {
          await audioCtxRef.current.suspend();
        }
        setIsPlaying(false);
      }
    }, [isPlaying, isMuted, bpm, playSequencerStep]);

    const toggleMute = useCallback(() => {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setValueAtTime(
          nextMuted ? 0 : 0.85,
          audioCtxRef.current.currentTime
        );
      }
    }, [isMuted]);

    useEffect(() => {
      let active = true;
      const dataArray = new Uint8Array(64);

      const render = (time: number) => {
        if (!active) return;

        if (prefersReducedMotion) {
          setBarHeights(Array.from({ length: TOTAL_BARS }, () => 8));
          setBarOpacities(Array.from({ length: TOTAL_BARS }, () => 0.4));
          setBassLevel(0);
          rafIdRef.current = requestAnimationFrame(render);
          return;
        }

        const analyser = analyserRef.current;
        const heights: number[] = new Array(TOTAL_BARS);
        const opacities: number[] = new Array(TOTAL_BARS);

        if (isPlaying && analyser) {
          analyser.getByteFrequencyData(dataArray);

          const maxBins = Math.floor(analyser.frequencyBinCount * 0.75);

          let bassSum = 0;
          for (let b = 0; b < 8; b++) {
            bassSum += dataArray[b] || 0;
          }
          const rawBass = bassSum / (8 * 255);
          bassSmoothedRef.current += (rawBass - bassSmoothedRef.current) * 0.25;

          for (let i = 0; i < TOTAL_BARS; i++) {
            const binIdx = Math.min(
              maxBins - 1,
              Math.floor((i / TOTAL_BARS) * maxBins)
            );
            const v = (dataArray[binIdx] || 0) / 255;
            heights[i] = 6 + v * 46;
            opacities[i] = 0.35 + v * 0.65;
          }

          setBassLevel(bassSmoothedRef.current);
          setBarHeights(heights);
          setBarOpacities(opacities);
        } else {
          bassSmoothedRef.current += (0 - bassSmoothedRef.current) * 0.1;
          for (let i = 0; i < TOTAL_BARS; i++) {
            const wave = Math.sin(time * 0.0028 + (i / TOTAL_BARS) * Math.PI * 4);
            const idleV = (wave + 1) * 0.5;
            heights[i] = 6 + idleV * 16;
            opacities[i] = 0.3 + idleV * 0.35;
          }

          setBassLevel(bassSmoothedRef.current);
          setBarHeights(heights);
          setBarOpacities(opacities);
        }

        rafIdRef.current = requestAnimationFrame(render);
      };

      rafIdRef.current = requestAnimationFrame(render);

      return () => {
        active = false;
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }, [isPlaying, prefersReducedMotion]);

    useEffect(() => {
      return () => {
        if (sequencerTimerRef.current) {
          clearInterval(sequencerTimerRef.current);
          sequencerTimerRef.current = null;
        }
        if (audioCtxRef.current) {
          audioCtxRef.current.close().catch(() => {});
          audioCtxRef.current = null;
        }
      };
    }, []);

    const radius = containerPx * 0.46;
    const productScale = prefersReducedMotion ? 1 : 1 + bassLevel * 0.07;
    const glowScale = prefersReducedMotion ? 1 : 1 + bassLevel * 0.42;
    const glowOpacity = prefersReducedMotion ? 0.3 : 0.25 + bassLevel * 0.75;

    return (
      <div
        ref={ref}
        className={cn("relative flex flex-col items-center select-none", className)}
        style={{ maxWidth: stageSize, width: "100%", ...style }}
        {...props}
      >
        {/* Main 1:1 Stage Scene */}
        <div
          ref={containerRef}
          className="relative w-full aspect-square rounded-3xl bg-zinc-950/80 border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-md"
          style={
            {
              "--accent-from": accentFrom,
              "--accent-to": accentTo,
            } as React.CSSProperties
          }
        >
          {/* Ambient Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: \`radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)\`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Layer 1: Ambient Glow behind product (radial-gradient, blur ~20px) */}
          <div
            className="absolute pointer-events-none rounded-full blur-[24px] transition-transform duration-75 ease-out"
            style={{
              width: "56%",
              height: "56%",
              background: \`radial-gradient(circle, \${accentFrom}44 0%, \${accentTo}22 45%, transparent 72%)\`,
              transform: \`scale(\${glowScale})\`,
              opacity: glowOpacity,
            }}
          />

          {/* Layer 2: 56 Radial Bars around product */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {Array.from({ length: TOTAL_BARS }).map((_, i) => {
              const angle = (360 / TOTAL_BARS) * i;
              const h = barHeights[i] || 6;
              const op = barOpacities[i] || 0.35;

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: "3.5px",
                    height: \`\${h}px\`,
                    transformOrigin: "50% 100%",
                    transform: \`translate(-50%, -100%) rotate(\${angle}deg) translateY(-\${radius}px)\`,
                    opacity: op,
                    background: \`linear-gradient(to top, \${accentFrom}, \${accentTo})\`,
                    borderRadius: "9999px",
                    boxShadow: \`0 0 6px rgba(255, 255, 255, 0.25)\`,
                    willChange: "height, opacity",
                  }}
                />
              );
            })}
          </div>

          {/* Layer 3: Central Product Silhouette (~52% width, bass scale pulse) */}
          <div
            className="relative z-10 w-[52%] h-[52%] flex items-center justify-center transition-transform duration-75 ease-out pointer-events-none"
            style={{
              transform: \`scale(\${productScale})\`,
              filter: \`drop-shadow(0 14px 28px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.1))\`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain select-none drag-none"
              draggable={false}
            />
          </div>

          {/* Quick Sound Mute Toggle */}
          {isPlaying && (
            <button
              type="button"
              onClick={toggleMute}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/50 border border-white/10 text-zinc-400 hover:text-white hover:bg-black/70 backdrop-blur-md transition-colors cursor-pointer"
              title={isMuted ? "Unmute sound" : "Mute sound"}
              aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-zinc-300" />}
            </button>
          )}

          {/* Play/Pause Control at Bottom */}
          <div className="absolute bottom-4 z-20 flex items-center justify-center">
            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-white bg-zinc-900/85 hover:bg-zinc-800 border border-white/12 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer active:scale-95"
              aria-label={isPlaying ? "Pause SoundPulse" : "Start SoundPulse"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current text-zinc-300" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-zinc-300" />
                  <span>Play</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SoundPulse.displayName = "SoundPulse";
`
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
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

interface BaseAnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const FadeIn = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration }}>
      {children}
    </motion.div>
  );
};

export const SlideUp = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration }}>
      {children}
    </motion.div>
  );
};

export const SlideDown = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration }}>
      {children}
    </motion.div>
  );
};

export const SlideLeft = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration }}>
      {children}
    </motion.div>
  );
};

export const SlideRight = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration }}>
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration }}>
      {children}
    </motion.div>
  );
};

export const Bounce = ({ children, delay = 0 }: Omit<BaseAnimationProps, 'duration'>) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", bounce: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

export const Flip = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ rotateX: 90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
};

export const Rotate = ({ children, delay = 0, duration = 0.5 }: BaseAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ rotate: -180, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
};

export const PulseAnim = ({ children }: { children: React.ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      {children}
    </motion.div>
  );
};

export const Float = ({ children }: { children: React.ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export const WiggleHover = ({ children }: { children: React.ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
      {children}
    </motion.div>
  );
};

export const Heartbeat = ({ children }: { children: React.ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export const RevealClip = ({ children, delay = 0, duration = 0.8 }: BaseAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
      animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      transition={{ delay, duration, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, delayChildren = 0.1, staggerChildren = 0.1 }: { children: React.ReactNode; delayChildren?: number; staggerChildren?: number }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
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
  );
};

export const StaggerItem = ({ children }: { children: React.ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      {children}
    </motion.div>
  );
};

export interface TypingAnimationProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  cursor?: boolean;
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
  const shouldReduceMotion = useReducedMotion();
  const [textIndex, setTextIndex] = React.useState(0);
  const [currentText, setCurrentText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!texts || texts.length === 0) return;

    if (shouldReduceMotion) {
      setCurrentText(texts[0] || "");
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

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

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentText, isDeleting, textIndex, texts, speed, deleteSpeed, pauseDuration, loop, shouldReduceMotion]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{currentText}</span>
      {cursor && !shouldReduceMotion && (
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

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"
import { Check, Upload, Star, Plus, Minus } from "lucide-react"

export interface RadioCardProps {
  title: string
  description?: string
  checked?: boolean
  selected?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: () => void
  value?: string
  name?: string
}

export const RadioCard = ({ title, description, checked, selected, onChange, onClick, value, name }: RadioCardProps) => {
  const isChecked = checked ?? selected;
  return (
    <label onClick={onClick} className={cn("relative flex cursor-pointer rounded-lg border p-4 hover:bg-accent transition-all", isChecked ? "border-primary bg-primary/5 shadow-xs" : "border-border bg-card")}>
      <input type="radio" name={name} value={value} checked={isChecked} onChange={onChange} className="sr-only" />
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{title}</span>
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
        <div className={cn("flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors", isChecked ? "border-primary bg-primary" : "border-muted-foreground")}>
          {isChecked && <div className="h-2 w-2 rounded-full bg-background" />}
        </div>
      </div>
    </label>
  );
};

export interface ColorSwatchProps {
  color: string
  selected?: boolean
  onClick?: () => void
}

export const ColorSwatch = ({ color, selected, onClick }: ColorSwatchProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn("relative flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-105 cursor-pointer", selected && "ring-2 ring-primary ring-offset-2 ring-offset-background")}
    style={{ backgroundColor: color }}
  >
    {selected && <Check className="h-4 w-4 text-white drop-shadow-sm" />}
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
    <button type="button" aria-label="Decrease value" onClick={() => onChange?.(Math.max(min, value - 1))} className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer"><Minus className="h-4 w-4" /></button>
    <div className="w-8 text-center font-mono font-medium text-sm tabular-nums">{value}</div>
    <button type="button" aria-label="Increase value" onClick={() => onChange?.(Math.min(max, value + 1))} className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer"><Plus className="h-4 w-4" /></button>
  </div>
)

export interface FileDropzoneProps {
  onDrop?: (files: FileList) => void
  accept?: string
  multiple?: boolean
  className?: string
}

export const FileDropzone = ({ onDrop, accept, multiple = true, className }: FileDropzoneProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [selectedCount, setSelectedCount] = React.useState(0)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setSelectedCount(files.length)
    onDrop?.(files)
  }

  return (
    <div
      role="button"
      tabIndex={0}
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
        "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl bg-card hover:bg-accent/40 transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isDragging ? "border-primary bg-accent/60" : "border-border",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="sr-only"
      />
      <div className="p-3.5 rounded-full bg-muted group-hover:bg-background transition-colors mb-2">
        <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <p className="text-sm font-medium">
        {selectedCount > 0 ? \`\${selectedCount} file(s) selected\` : "Click or drag files to upload"}
      </p>
      <p className="text-xs text-muted-foreground mt-1">Supports standard document and image formats.</p>
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

export const RatingStars = ({ rating = 0, value, max = 5, onRate, onChange }: RatingStarsProps) => {
  const currentRating = value ?? rating;
  const handleRate = onChange ?? onRate;
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: max }).map((_, i) => (
        <button key={i} type="button" onClick={() => handleRate?.(i + 1)} className="p-1 focus:outline-none transition-transform hover:scale-105 cursor-pointer">
          <Star className={cn("h-5 w-5", i < currentRating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground")} />
        </button>
      ))}
    </div>
  );
};

export interface ToggleGroupItemWrapperProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export const ToggleGroupItemWrapper = ({ children, active, onClick }: ToggleGroupItemWrapperProps) => (
  <button type="button" onClick={onClick} className={cn("px-4 py-2 text-sm font-medium transition-colors border border-transparent cursor-pointer", active ? "bg-background text-foreground shadow-xs rounded-md" : "text-muted-foreground hover:text-foreground")}>
    {children}
  </button>
)

export interface ToggleGroupWrapperProps {
  children: React.ReactNode
}

export const ToggleGroupWrapper = ({ children }: ToggleGroupWrapperProps) => (
  <div className="inline-flex items-center rounded-lg bg-muted p-1">{children}</div>
)

export interface InputWithLabelOverlayProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export const InputWithLabelOverlay = ({ label, id, ...props }: InputWithLabelOverlayProps) => (
  <div className="relative">
    <input id={id} className="block w-full rounded-md border border-border bg-background px-3 pb-2 pt-6 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary peer" placeholder=" " {...props} />
    <label htmlFor={id} className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary cursor-text">
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

export const VisualSelectCard = ({ icon: Icon, title, description, selected }: VisualSelectCardProps) => (
  <div className={cn("flex flex-col items-center justify-center p-6 rounded-xl border text-center transition-all cursor-pointer hover:border-primary", selected ? "border-primary bg-primary/5" : "border-border bg-card")}>
    <Icon className={cn("h-7 w-7 mb-3", selected ? "text-primary" : "text-muted-foreground")} />
    <h3 className="font-semibold text-sm mb-1">{title}</h3>
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
            className="absolute bottom-16 right-0 w-80 bg-card border rounded-xl shadow-lg p-4 origin-bottom-right"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" onClick={toggle} className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer">
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }}><Plus className="h-5 w-5" /></motion.div>
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
      <input key={i} type="text" maxLength={1} className="w-11 h-13 text-center text-lg font-mono font-bold rounded-md border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
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

export interface StepItem {
  title: string
  description?: string
  icon?: React.ReactNode
}

export type StepperVariant = "default" | "circles" | "arrows"
export type StepperSize = "sm" | "md" | "lg"

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[]
  currentStep: number
  orientation?: "horizontal" | "vertical"
  variant?: StepperVariant
  size?: StepperSize
  onStepClick?: (stepIndex: number) => void
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
                        ? "bg-primary border-primary text-primary-foreground shadow-xs"
                        : isActive
                        ? "border-primary text-primary bg-background shadow-xs ring-2 ring-ring ring-offset-2 ring-offset-background"
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
                      isActive ? "text-foreground" : isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
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
                      ? "bg-primary border-primary text-primary-foreground shadow-xs"
                      : isActive
                      ? "border-primary text-primary bg-background shadow-xs ring-2 ring-ring ring-offset-2 ring-offset-background"
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
                </motion.button>

                {/* Step Labels */}
                <div className="flex flex-col text-left min-w-0">
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-semibold transition-colors truncate max-w-[90px] sm:max-w-[120px]",
                      isActive
                        ? "text-foreground"
                        : isCompleted
                        ? "text-foreground font-medium"
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
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/cn';

interface TableContextProps {
  variant: 'default' | 'glass' | 'neon' | 'minimal' | 'cyberpunk' | 'aurora' | 'gradient';
  density: 'compact' | 'normal' | 'spacious';
  hoverable: boolean;
  striped: boolean;
  bordered: boolean;
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
        default: "bg-card border border-border text-card-foreground rounded-xl shadow-xs",
        glass: "backdrop-blur-md bg-card/60 border border-border/60 text-card-foreground rounded-xl shadow-sm",
        neon: "bg-card border border-border text-card-foreground rounded-xl shadow-xs",
        minimal: "bg-transparent border-0 border-b border-border text-foreground rounded-none shadow-none",
        cyberpunk: "bg-card border border-border text-foreground font-mono rounded-none shadow-xs",
        aurora: "bg-card/40 backdrop-blur-md border border-border text-card-foreground rounded-xl shadow-xs",
        gradient: "bg-linear-to-b from-card to-muted/30 border border-border text-foreground rounded-xl shadow-xs",
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
  density?: 'compact' | 'normal' | 'spacious';
  hoverable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  animateRows?: boolean;
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
          {variant === 'cyberpunk' && (
            <>
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-foreground" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-foreground" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-foreground" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-foreground" />
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
    variant === 'cyberpunk' && "bg-muted/30 border-b border-border text-foreground font-mono uppercase tracking-wider",
    variant === 'neon' && "bg-muted/20 border-b border-border text-foreground tracking-wide",
    variant === 'glass' && "bg-muted/10 border-b border-border/60 text-foreground/80",
    variant === 'aurora' && "bg-muted/20 border-b border-border text-foreground",
    variant === 'gradient' && "bg-muted/20 border-b border-border text-foreground/90",
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
    variant === 'cyberpunk' && "divide-y divide-border/40",
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
        variant === 'cyberpunk' && "bg-muted/30 border-t border-border text-foreground font-mono",
        className
      )}
      {...props}
    />
  );
});
TableFooter.displayName = 'TableFooter';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index?: number;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, index = 0, ...props }, ref) => {
    const { variant, hoverable, striped, animateRows } = React.useContext(TableContext);
    const shouldReduceMotion = useReducedMotion();

    const rowClass = cn(
      "transition-all duration-200 border-b border-border/10 last:border-b-0",
      striped && {
        "odd:bg-muted/15": ['default', 'gradient', 'minimal', 'aurora', 'neon'].includes(variant),
        "odd:bg-white/[0.02] dark:odd:bg-white/[0.01]": variant === 'glass',
        "odd:bg-muted/20": variant === 'cyberpunk',
      },
      hoverable && {
        "hover:bg-muted/40": ['default', 'minimal', 'neon'].includes(variant),
        "hover:bg-white/5 dark:hover:bg-white/5 hover:backdrop-blur-md": variant === 'glass',
        "hover:bg-muted/30 hover:text-foreground": variant === 'cyberpunk',
        "hover:bg-muted/30": ['aurora', 'gradient'].includes(variant),
      },
      className
    );

    if (animateRows && !shouldReduceMotion) {
      return (
        <motion.tr
          ref={ref}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 24,
            delay: index * 0.05,
          }}
          className={rowClass}
          {...(props as HTMLMotionProps<"tr">)}
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
    },
    variant === 'cyberpunk' && "text-foreground font-mono tracking-wider",
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
    },
    variant === 'cyberpunk' && "text-foreground font-mono",
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
        variant === 'cyberpunk' && "text-muted-foreground font-mono uppercase tracking-widest",
        className
      )}
      {...props}
    />
  );
});
TableCaption.displayName = 'TableCaption';

export interface CustomizableTableProps extends TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  caption?: string;
}

export const CustomizableTable = ({
  headers,
  rows,
  caption,
  ...props
}: CustomizableTableProps) => {
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
                  <span className="text-muted-foreground/40 font-mono text-xs">-</span>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export interface DataTableColumn<T = Record<string, unknown>> {
  header: React.ReactNode;
  accessorKey?: keyof T | string;
  cell?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T = Record<string, unknown>> extends TableProps {
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

export function DataTable<T extends Record<string, unknown> = Record<string, unknown>>({
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
  const filtered = items.filter((item) => {
    if (!search.trim()) return true;
    if (searchKey && item[searchKey as keyof T] !== undefined) {
      return String(item[searchKey as keyof T]).toLowerCase().includes(search.toLowerCase());
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
            className="h-9 px-3 py-1 rounded-md border border-input bg-background text-xs text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-64 shadow-xs"
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
                      ? String(item[col.accessorKey as keyof T] ?? '')
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
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
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

// src/registry/twist-ribbon.ts
var twistRibbon = {
  name: "twist-ribbon",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "twist-ribbon.tsx",
  content: `"use client";

import * as React from "react";
import { useEffect, useRef, forwardRef } from "react";
import { cn } from "../utils/cn";

export interface TwistRibbonProps extends React.HTMLAttributes<HTMLCanvasElement> {
  twist?: number;
  flex?: number;
  spd?: number;
  boost?: number;
  wid?: number;
  tilt?: number;
  wamp?: number;
  wfq?: number;
  cam?: number;
  cnt?: number;
  spread?: number;
  rep?: number;
  shade?: number;
  inertia?: number;
  vgain?: number;
  paper?: string;
  ink?: string;
  back?: string;
  bg?: string;
  text?: string;
  scrollContainer?: React.RefObject<HTMLElement | null>;
  scrollProgress?: number;
  captureWheel?: boolean;
  autoScroll?: boolean;
  autoSpeed?: number;
  background?: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | string;
  paused?: boolean;
}

const VS = \`attribute vec2 a;uniform float asp,ph,tw,wid,tilt,wamp,wfq,cam,spread,rep;uniform vec2 ix;varying vec2 uv;varying float sh;
void main(){
  float x=a.x*3.4,j=ix.x-(ix.y-1.)*.5,ang=x*tw*.5+ph*1.3+j*1.7;
  float y=wid*a.y,py=cos(ang)*y+sin(x*wfq+ph+j*2.)*wamp+j*spread,pz=sin(ang)*y,tl=tilt+j*.18;
  float px=x*cos(tl)-py*sin(tl),qy=x*sin(tl)+py*cos(tl),k=2.4/(cam-pz);
  gl_Position=vec4(px*k/asp,qy*k,-pz*.12,1.);
  uv=vec2((a.x*.5+.5)*rep+ph*.1+j*.37,a.y*.5+.5);sh=cos(ang);
}\`;

const FS = \`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D tx;
uniform vec3 paper,ink,back;uniform float shade;varying vec2 uv;varying float sh;
void main(){
  float m=texture2D(tx,uv).r;
  vec3 c=sh>0.?mix(paper,ink,m):mix(back,paper,m);
  c*=1.-shade*(1.-abs(sh))*.9;
  gl_FragColor=vec4(c,1.);
}\`;

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function createRibbonTexture(gl: WebGLRenderingContext, text: string): WebGLTexture | null {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 256;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 2048, 256);
  ctx.font = \`900 190px system-ui, -apple-system, sans-serif\`;
  const m = ctx.measureText(text).width;
  ctx.save();
  ctx.scale(2048 / Math.max(1, m), 1);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, 134);
  ctx.restore();

  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  return tex;
}

export const TwistRibbon = forwardRef<HTMLCanvasElement, TwistRibbonProps>(function TwistRibbon(
  {
    twist = 1.6,
    flex = 1.2,
    spd = 0.35,
    boost = 1,
    wid = 0.55,
    tilt = 0.28,
    wamp = 0.3,
    wfq = 1.2,
    cam = 4.5,
    cnt = 2,
    spread = 0.9,
    rep = 3,
    shade = 0.6,
    inertia = 0.12,
    vgain = 1,
    paper = "#f2efe8",
    ink = "#0b0b10",
    back = "#ff4a2b",
    bg = "#15151b",
    text = "Scroll / Twist / ",
    scrollContainer,
    scrollProgress,
    captureWheel = false,
    autoScroll = false,
    autoSpeed = 4.0,
    background,
    paused = false,
    className,
    style,
    ...props
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "a");
    gl.linkProgram(prog);

    const RN = 160;
    const ribN = (RN + 1) * 2;
    const ribBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ribBuf);
    const v: number[] = [];
    for (let i = 0; i <= RN; i++) {
      const q = (i / RN) * 2 - 1;
      v.push(q, -1, q, 1);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let defaultTex = createRibbonTexture(gl, text);
    let customTex: WebGLTexture | null = null;

    if (background) {
      if (typeof background === "string") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = background;
        img.onload = () => {
          if (!gl.isContextLost()) {
            customTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, customTex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
          }
        };
      } else {
        customTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, customTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      }
    }

    let sm = 0;
    let sPrev = 0;
    let vsVal = 0;
    let ph = 0;
    let currentScroll = 0;
    let virtualScroll = 0;
    let isDragging = false;
    let dragStartY = 0;

    let isVisible = true;
    let isDocVisible = !document.hidden;

    const onScroll = () => {
      if (scrollContainer && scrollContainer.current) {
        currentScroll = scrollContainer.current.scrollTop;
      } else {
        currentScroll = window.scrollY;
      }
    };

    const targetEl = scrollContainer && scrollContainer.current ? scrollContainer.current : window;
    targetEl.addEventListener("scroll", onScroll as EventListener, { passive: true });

    const onWheel = (e: WheelEvent) => {
      if (!captureWheel) return;
      e.preventDefault();
      virtualScroll += e.deltaY * 0.9;
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartY = e.clientY;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dy = dragStartY - e.clientY;
      dragStartY = e.clientY;
      virtualScroll += dy * 2.5;
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "300px" }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isDocVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let ema = 16.7;
    let rs = 1.0;
    let good = 0;
    let last = 0;
    let animId = 0;
    let hasRenderedOnce = false;

    const render = (ms: number) => {
      animId = requestAnimationFrame(render);
      if (paused || (!isVisible && hasRenderedOnce) || (!isDocVisible && hasRenderedOnce)) return;

      const dt = ms - last;
      last = ms;
      if (dt > 0 && dt < 200) {
        ema += (dt - ema) * 0.05;
        if (ema > 23 && rs > 0.5) {
          rs = Math.max(0.5, rs - 0.1);
          ema = 16.7;
          good = 0;
        } else if (ema < 17.6 && rs < 1.0 && ++good > 180) {
          rs = Math.min(1.0, rs + 0.05);
          good = 0;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * rs;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const vh = canvas.clientHeight || window.innerHeight || 800;
      if (autoScroll) {
        virtualScroll += autoSpeed;
      }
      const targetScroll =
        scrollProgress !== undefined
          ? scrollProgress * vh * 3
          : captureWheel || autoScroll
          ? virtualScroll
          : currentScroll;

      const ds = Math.min(dt, 50) / 1000 || 0.016;
      sm += (targetScroll - sm) * inertia;
      const v = (sm - sPrev) / vh / ds;
      sPrev = sm;
      vsVal += (Math.max(-2, Math.min(2, v * 0.25 * vgain)) - vsVal) * 0.12;
      ph += ds * (spd + vsVal * boost * 2.2);

      const asp = w / h;

      gl.viewport(0, 0, w, h);
      const parsedBg = parseHex(bg);
      gl.clearColor(parsedBg[0], parsedBg[1], parsedBg[2], 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      gl.useProgram(prog);

      gl.uniform1f(gl.getUniformLocation(prog, "asp"), asp);
      gl.uniform1f(gl.getUniformLocation(prog, "ph"), ph);
      gl.uniform1f(gl.getUniformLocation(prog, "tw"), twist + Math.abs(vsVal) * flex);
      gl.uniform1f(gl.getUniformLocation(prog, "wid"), wid);
      gl.uniform1f(gl.getUniformLocation(prog, "tilt"), tilt);
      gl.uniform1f(gl.getUniformLocation(prog, "wamp"), wamp);
      gl.uniform1f(gl.getUniformLocation(prog, "wfq"), wfq);
      gl.uniform1f(gl.getUniformLocation(prog, "cam"), cam);
      gl.uniform1f(gl.getUniformLocation(prog, "spread"), spread);
      gl.uniform1f(gl.getUniformLocation(prog, "rep"), rep);
      gl.uniform1f(gl.getUniformLocation(prog, "shade"), shade);

      const parsedPaper = parseHex(paper);
      const parsedInk = parseHex(ink);
      const parsedBack = parseHex(back);
      gl.uniform3f(gl.getUniformLocation(prog, "paper"), parsedPaper[0], parsedPaper[1], parsedPaper[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "ink"), parsedInk[0], parsedInk[1], parsedInk[2]);
      gl.uniform3f(gl.getUniformLocation(prog, "back"), parsedBack[0], parsedBack[1], parsedBack[2]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, customTex || defaultTex);
      gl.uniform1i(gl.getUniformLocation(prog, "tx"), 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, ribBuf);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      for (let i = 0; i < cnt; i++) {
        gl.uniform2f(gl.getUniformLocation(prog, "ix"), i, cnt);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, ribN);
      }

      gl.disable(gl.DEPTH_TEST);
      hasRenderedOnce = true;
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      targetEl.removeEventListener("scroll", onScroll as EventListener);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      if (defaultTex) gl.deleteTexture(defaultTex);
      if (customTex) gl.deleteTexture(customTex);
      gl.deleteBuffer(ribBuf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [
    twist,
    flex,
    spd,
    boost,
    wid,
    tilt,
    wamp,
    wfq,
    cam,
    cnt,
    spread,
    rep,
    shade,
    inertia,
    vgain,
    paper,
    ink,
    back,
    bg,
    text,
    scrollContainer,
    scrollProgress,
    captureWheel,
    background,
    paused,
  ]);

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      }}
      className={cn("block w-full h-full touch-none select-none cursor-ns-resize", className)}
      style={style}
      {...props}
    />
  );
});

TwistRibbon.displayName = "TwistRibbon";
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
  fileName: "ultra-components.tsx",
  content: `"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

export interface AnimatedGradientBorderProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  gradientClassName?: string
  duration?: number
}

export function AnimatedGradientBorder({
  children,
  className,
  containerClassName,
  gradientClassName,
  duration = 4,
}: AnimatedGradientBorderProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={cn("relative rounded-xl p-px", containerClassName)}>
      {!shouldReduceMotion ? (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-xl overflow-hidden",
            gradientClassName
          )}
        >
          <motion.div
            className="absolute inset-[-100%]"
            style={{
              background: "conic-gradient(from 0deg, transparent 0 280deg, var(--primary) 360deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 rounded-xl border border-primary/40" />
      )}
      <div className={cn("relative rounded-[calc(0.75rem-1px)] bg-background", className)}>
        {children}
      </div>
    </div>
  )
}

export interface ShinyTextProps {
  children: React.ReactNode
  className?: string
  shimmerWidth?: number
}

export function ShinyText({
  children,
  className,
  shimmerWidth = 100,
}: ShinyTextProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent",
        !shouldReduceMotion && "animate-shimmer-text",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(110deg, var(--muted-foreground) 35%, var(--foreground) 50%, var(--muted-foreground) 65%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundSize: \`\${shimmerWidth * 2.5}% 100%\`,
      }}
    >
      {children}
    </span>
  )
}

export interface RetroGridProps {
  className?: string
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
          style={{
            backgroundRepeat: "repeat",
            backgroundSize: "60px 60px",
            height: "300vh",
            inset: "-50% 0px",
            marginLeft: "-50%",
            transformOrigin: "100% 0 0",
            width: "600vw",
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 0), linear-gradient(to bottom, var(--border) 1px, transparent 0)",
            opacity: 0.55,
          }}
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-background to-transparent to-90%" />
    </div>
  )
}

export interface MeteorsProps {
  number?: number
  className?: string
}

export function Meteors({ number = 10, className }: MeteorsProps) {
  const shouldReduceMotion = useReducedMotion()

  const meteors = React.useMemo(() => {
    if (shouldReduceMotion) return []
    return Array.from({ length: number }, (_, idx) => {
      const seed = ((idx + 1) * 37) % 97
      return {
        id: idx,
        size: (idx % 2) + 1,
        left: \`\${(seed * 100) / 97}%\`,
        animationDelay: \`\${((idx * 0.43) % 2.4).toFixed(2)}s\`,
        animationDuration: \`\${4 + (idx % 5)}s\`,
      }
    })
  }, [number, shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute top-0 animate-meteor rounded-full bg-foreground/25"
          style={{
            left: meteor.left,
            width: \`\${meteor.size}px\`,
            height: \`\${meteor.size * 18}px\`,
            animationDelay: meteor.animationDelay,
            animationDuration: meteor.animationDuration,
          }}
        />
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
  fileName: "ultra-effects.tsx",
  content: `"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "../utils/cn"

export interface MorphingTextProps {
  texts: string[]
  className?: string
  interval?: number
}

export function MorphingText({
  texts,
  className,
  interval = 3000,
}: MorphingTextProps) {
  const shouldReduceMotion = useReducedMotion()
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (shouldReduceMotion || texts.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, interval)
    return () => clearInterval(timer)
  }, [texts.length, interval, shouldReduceMotion])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={shouldReduceMotion ? false : { y: 16, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={shouldReduceMotion ? undefined : { y: -16, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export interface AnimatedListProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedList({
  children,
  className,
  delay = 400,
}: AnimatedListProps) {
  const shouldReduceMotion = useReducedMotion()
  const childArray = React.Children.toArray(children)
  const [visibleCount, setVisibleCount] = React.useState(shouldReduceMotion ? childArray.length : 1)

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setVisibleCount(childArray.length)
      return
    }
    setVisibleCount(1)
    const timer = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= childArray.length) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, delay)
    return () => clearInterval(timer)
  }, [childArray.length, delay, shouldReduceMotion])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <AnimatePresence initial={!shouldReduceMotion}>
        {childArray.slice(0, visibleCount).map((item, index) => (
          <motion.div
            key={index}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: "easeOut" }}
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  className?: string
}

export function InteractiveHoverButton({
  text = "Button",
  className,
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "group relative inline-flex min-w-36 items-center justify-center cursor-pointer overflow-hidden rounded-full border border-border bg-background px-6 py-2.5 text-center font-medium text-sm text-foreground transition-colors duration-200",
        className
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2 transition-all duration-200 group-hover:translate-x-8 group-hover:opacity-0">
        <span className="h-2 w-2 rounded-full bg-primary transition-transform duration-300 group-hover:scale-0" />
        <span>{text}</span>
      </span>
      <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 -translate-x-8 text-primary-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
      </div>
      <div className="absolute inset-0 z-0 scale-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
    </button>
  )
}

export interface WordPullUpProps {
  words: string
  className?: string
  delayMultiple?: number
}

export function WordPullUp({
  words,
  className,
  delayMultiple = 0.08,
}: WordPullUpProps) {
  const shouldReduceMotion = useReducedMotion()
  const wordArray = words.split(" ")

  return (
    <div className={cn("flex flex-wrap justify-center gap-x-2", className)}>
      {wordArray.map((word, i) => (
        <motion.span
          key={i}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: shouldReduceMotion ? 0 : i * delayMultiple,
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

export interface BoxRevealProps {
  children: React.ReactNode
  className?: string
  boxColor?: string
  duration?: number
  delay?: number
}

export function BoxReveal({
  children,
  className,
  boxColor = "var(--primary)",
  duration = 0.45,
  delay = 0,
}: BoxRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

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

export interface TextShimmerProps {
  children: React.ReactNode
  className?: string
  duration?: number
  spread?: number
}

export function TextShimmer({
  children,
  className,
  duration = 2.5,
  spread = 10,
}: TextShimmerProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <span
      className={cn(
        "inline-flex bg-clip-text text-transparent",
        !shouldReduceMotion && "animate-text-shimmer",
        className
      )}
      style={{
        backgroundImage: \`linear-gradient(
          110deg,
          var(--muted-foreground) \${Math.max(10, 42 - spread)}%,
          var(--foreground) 50%,
          var(--muted-foreground) \${Math.min(90, 58 + spread)}%
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

// src/registry/type-proximity.ts
var typeProximity = {
  name: "type-proximity",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "type-proximity.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { cn } from "../utils/cn";

export interface TypeProximityProps extends React.HTMLAttributes<HTMLDivElement> {
  rad?: number;
  wmin?: number;
  wmax?: number;
  dmin?: number;
  dmax?: number;
  fall?: number;
  size?: number;
  ease?: number;
  idle?: number;
  hue?: number;
  tint?: string;
  bg?: string;
  ink?: string;
  lines?: string[];
  paused?: boolean;
}

function parseHex(h: string): [number, number, number] {
  const c = h.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const DEFAULT_LINES = ["Weight", "follows", "your touch"];

export const TypeProximity = React.forwardRef<HTMLDivElement, TypeProximityProps>(
  function TypeProximity(
    {
      rad = 240,
      wmin = 200,
      wmax = 850,
      dmin = 75,
      dmax = 100,
      fall = 1.6,
      size = 11,
      ease = 0.22,
      idle = 0.7,
      hue = 0.85,
      tint = "#ff4a2b",
      bg = "#e8eaee",
      ink = "#0d0e12",
      lines = DEFAULT_LINES,
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const spansRef = useRef<Map<number, HTMLSpanElement>>(new Map());
    const stateV = useRef<number[]>([]);
    const pointerRef = useRef<{ x: number; y: number; t: number }>({ x: -1e4, y: -1e4, t: -1e9 });
    const isVisibleRef = useRef<boolean>(true);
    const [reducedMotion, setReducedMotion] = useState(false);

    const totalChars = useMemo(() => {
      let count = 0;
      for (const line of lines) {
        for (const word of line.split(" ")) {
          count += word.length;
        }
      }
      return count;
    }, [lines]);

    useEffect(() => {
      stateV.current = new Array(totalChars).fill(0);
    }, [totalChars]);

    useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;

      const onPointerMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          t: performance.now(),
        };
      };

      const onPointerLeave = () => {
        pointerRef.current = { x: -1e4, y: -1e4, t: -1e9 };
      };

      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerdown", onPointerMove);
      el.addEventListener("pointerleave", onPointerLeave);

      return () => {
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerdown", onPointerMove);
        el.removeEventListener("pointerleave", onPointerLeave);
      };
    }, []);

    useEffect(() => {
      let rafId = 0;

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const el = rootRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const t = ms / 1000;
            const isPointerActive = performance.now() - pointerRef.current.t < 2500;

            let px = pointerRef.current.x;
            let py = pointerRef.current.y;

            if (!isPointerActive) {
              if (idle > 0 && !reducedMotion && w > 0 && h > 0) {
                px = w * (0.5 + 0.46 * Math.sin(t * 0.55 * idle));
                py = h * (0.5 + 0.3 * Math.sin(t * 0.8 * idle + 1));
              } else {
                px = -1e4;
                py = -1e4;
              }
            }

            const inkRgb = parseHex(ink);
            const tintRgb = parseHex(tint);
            const map = spansRef.current;
            const sizeMap = map.size;

            const rects: (DOMRect | null)[] = new Array(sizeMap);
            for (let i = 0; i < sizeMap; i++) {
              const span = map.get(i);
              rects[i] = span ? span.getBoundingClientRect() : null;
            }

            const vArr = stateV.current;
            for (let i = 0; i < sizeMap; i++) {
              const span = map.get(i);
              const r = rects[i];
              if (!span || !r) continue;

              const spanX = r.left - rect.left + r.width / 2;
              const spanY = r.top - rect.top + r.height / 2;
              const d = Math.hypot(px - spanX, py - spanY);
              const clamped = Math.min(1, Math.max(0, 1 - d / rad));
              const k = Math.pow(clamped, fall);

              const curV = (vArr[i] ?? 0) + (k - (vArr[i] ?? 0)) * ease;
              vArr[i] = curV;
              const m = curV * hue;

              const weight = Math.round(wmin + (wmax - wmin) * curV);
              const width = Math.round(dmin + (dmax - dmin) * curV);
              span.style.fontVariationSettings = \`"wght" \${weight}, "wdth" \${width}\`;

              const cr = Math.round(inkRgb[0] + (tintRgb[0] - inkRgb[0]) * m);
              const cg = Math.round(inkRgb[1] + (tintRgb[1] - inkRgb[1]) * m);
              const cb = Math.round(inkRgb[2] + (tintRgb[2] - inkRgb[2]) * m);
              span.style.color = \`rgb(\${cr},\${cg},\${cb})\`;
            }
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }, [paused, reducedMotion, rad, wmin, wmax, dmin, dmax, fall, ease, idle, hue, ink, tint]);

    let charGlobalIndex = 0;

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("relative flex flex-col justify-center select-none overflow-hidden touch-none", className)}
        style={{
          backgroundColor: bg,
          fontSize: \`\${size}vw\`,
          lineHeight: 0.92,
          letterSpacing: "-0.04em",
          ...style,
        }}
        {...rest}
      >
        <div className="flex flex-col justify-center px-[5vw]">
          {lines.map((lineText, lineIdx) => {
            const words = lineText.split(" ");
            return (
              <div key={lineIdx} className="whitespace-nowrap">
                {words.map((word, wordIdx) => {
                  const chars = Array.from(word);
                  return (
                    <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.22em]">
                      {chars.map((char) => {
                        const idx = charGlobalIndex++;
                        return (
                          <span
                            key={idx}
                            ref={(el) => {
                              if (el) spansRef.current.set(idx, el);
                              else spansRef.current.delete(idx);
                            }}
                            className="inline-block"
                          >
                            {char}
                          </span>
                        );
                      })}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

TypeProximity.displayName = "TypeProximity";
`
};

// src/registry/holo-foil.ts
var holoFoil = {
  name: "holo-foil",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "holo-foil.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export interface HoloFoilProps extends React.HTMLAttributes<HTMLDivElement> {
  tilt?: number;
  foil?: number;
  sparkle?: number;
  glare?: number;
  hue?: number;
  depth?: number;
  radius?: number;
  gyro?: number;
  ease?: number;
  title?: string;
  subtitle?: string;
  paused?: boolean;
}

export const HoloFoil = React.forwardRef<HTMLDivElement, HoloFoilProps>(
  function HoloFoil(
    {
      tilt = 16,
      foil = 1,
      sparkle = 1,
      glare = 0.7,
      hue = 0,
      depth = 22,
      radius = 22,
      gyro = 1,
      ease = 0.12,
      title = "Foil",
      subtitle = "Tilt your phone or move the pointer.",
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLDivElement | null>(null);
    const posRef = useRef<{ x: number; y: number; nx: number; ny: number; t: number; hasGyro: boolean; gGamma: number; gBeta: number }>({
      x: 0,
      y: 0,
      nx: 0,
      ny: 0,
      t: -1e9,
      hasGyro: false,
      gGamma: 0,
      gBeta: 0,
    });
    const isVisibleRef = useRef<boolean>(true);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [showGyroBtn, setShowGyroBtn] = useState(false);

    useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const onOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null && e.beta !== null) {
          posRef.current.hasGyro = true;
          posRef.current.gGamma = e.gamma;
          posRef.current.gBeta = e.beta;
        }
      };

      window.addEventListener("deviceorientation", onOrientation);

      const winAny = window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } };
      if (typeof winAny.DeviceOrientationEvent?.requestPermission === "function") {
        setShowGyroBtn(true);
      }

      return () => {
        window.removeEventListener("deviceorientation", onOrientation);
      };
    }, []);

    const enableMotion = () => {
      const winAny = window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } };
      if (typeof winAny.DeviceOrientationEvent?.requestPermission === "function") {
        winAny.DeviceOrientationEvent.requestPermission().then((res) => {
          if (res === "granted") {
            setShowGyroBtn(false);
          }
        }).catch(() => {});
      }
    };

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;

      const onPointerMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        posRef.current.x = Math.min(1, Math.max(-1, nx));
        posRef.current.y = Math.min(1, Math.max(-1, ny));
        posRef.current.t = performance.now();
      };

      const onPointerLeave = () => {
        posRef.current.t = -1e9;
      };

      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerdown", onPointerMove);
      el.addEventListener("pointerleave", onPointerLeave);

      return () => {
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerdown", onPointerMove);
        el.removeEventListener("pointerleave", onPointerLeave);
      };
    }, []);

    useEffect(() => {
      let rafId = 0;

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const t = ms / 1000;
          const pos = posRef.current;
          let targetX = 0;
          let targetY = 0;

          if (pos.hasGyro) {
            targetX = Math.min(1, Math.max(-1, (pos.gGamma / 30) * gyro));
            targetY = Math.min(1, Math.max(-1, ((pos.gBeta - 55) / 30) * gyro));
          } else if (performance.now() - pos.t < 2500) {
            targetX = pos.x;
            targetY = pos.y;
          } else {
            targetX = reducedMotion ? 0 : Math.sin(t * 0.7) * 0.6;
            targetY = reducedMotion ? 0 : Math.cos(t * 0.9) * 0.5;
          }

          pos.nx += (targetX - pos.nx) * ease;
          pos.ny += (targetY - pos.ny) * ease;

          const cx = pos.nx;
          const cy = pos.ny;
          const card = cardRef.current;
          const txt = textRef.current;

          if (card) {
            card.style.transform = \`rotateY(\${cx * tilt}deg) rotateX(\${-cy * tilt}deg)\`;
            card.style.boxShadow = \`\${-cx * 28}px \${30 - cy * 20}px 60px rgba(0,0,0,0.55)\`;
            card.style.setProperty("--mx", String(50 + cx * 50));
            card.style.setProperty("--my", String(50 + cy * 50));
            card.style.setProperty("--d", String(Math.hypot(cx, cy) / 1.414));
            card.style.setProperty("--foil", String(foil));
            card.style.setProperty("--sp", String(sparkle));
            card.style.setProperty("--gl", String(glare));
            card.style.setProperty("--hue", \`\${hue}deg\`);
            card.style.setProperty("--r", \`\${radius}px\`);
          }

          if (txt) {
            txt.style.transform = \`translate(\${cx * depth}px, \${cy * depth * 0.6}px)\`;
          }
        }

        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }, [paused, reducedMotion, tilt, foil, sparkle, glare, hue, depth, radius, gyro, ease]);

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn(
          "relative flex items-center justify-center overflow-hidden touch-none select-none",
          className
        )}
        style={{
          perspective: 1000,
          background: "radial-gradient(80% 60% at 50% 35%, #2b3150, #090a10)",
          ...style,
        }}
        {...rest}
      >
        <div
          ref={cardRef}
          className="relative isolate overflow-hidden"
          style={{
            width: "min(300px, 72vw)",
            aspectRatio: "5/7",
            borderRadius: radius,
            willChange: "transform",
          }}
        >
          <div
            className="absolute inset-0 flex flex-col justify-end gap-2 p-[9%] overflow-hidden pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "radial-gradient(circle at 50% 30%, #4a5075, #232744 55%, #12142a)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "repeating-radial-gradient(circle at 50% 30%, transparent 0 16px, rgba(255,255,255,0.1) 16px 17px)",
              }}
            />
            <div ref={textRef} className="relative z-10 flex flex-col gap-1 will-change-transform">
              <span className="font-extrabold text-5xl sm:text-6xl tracking-tight leading-none text-white">
                {title}
              </span>
              <span className="text-xs sm:text-sm font-medium text-white/80 max-w-[18ch] leading-relaxed">
                {subtitle}
              </span>
            </div>
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "linear-gradient(115deg,#ff3d7f 0%,#ffb13d 14%,#f6ff3d 28%,#3dff9a 42%,#3dc7ff 57%,#7a3dff 71%,#ff3d7f 85%,#ffb13d 100%)",
              backgroundSize: "300% 300%",
              backgroundPosition: "calc(var(--mx, 50) * 1%) calc(var(--my, 50) * 1%)",
              mixBlendMode: "color-dodge",
              opacity: "calc(var(--foil, 1) * 0.5)",
              filter: "hue-rotate(var(--hue, 0deg)) saturate(1.4)",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "conic-gradient(from calc(var(--mx, 50) * 3.6deg) at calc(var(--mx, 50) * 1%) calc(var(--my, 50) * 1%), #ff3d7f, #7a3dff, #3dc7ff, #3dff9a, #f6ff3d, #ff3d7f)",
              mixBlendMode: "overlay",
              opacity: "calc(var(--foil, 1) * 0.45)",
              filter: "hue-rotate(var(--hue, 0deg))",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "radial-gradient(circle, #fff 0 0.7px, transparent 1.8px) calc(var(--mx, 50) * 0.5px) calc(var(--my, 50) * 0.5px) / 29px 33px, radial-gradient(circle, #fff 0 0.7px, transparent 1.8px) calc(13px - var(--mx, 50) * 0.3px) calc(9px - var(--my, 50) * 0.3px) / 19px 23px",
              mixBlendMode: "color-dodge",
              filter: "brightness(1.6)",
              opacity: "calc(var(--sp, 1) * (0.2 + var(--d, 0) * 0.9))",
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "radial-gradient(circle at calc(var(--mx, 50) * 1%) calc(var(--my, 50) * 1%), rgba(255, 255, 255, var(--gl, 0.7)), transparent 55%)",
              mixBlendMode: "soft-light",
            }}
          />
        </div>

        {showGyroBtn && (
          <button
            type="button"
            onClick={enableMotion}
            className="absolute bottom-4 px-4 py-2 rounded-full bg-white text-black text-xs font-semibold shadow-md z-20 hover:opacity-90"
          >
            Enable Motion
          </button>
        )}
      </div>
    );
  }
);

HoloFoil.displayName = "HoloFoil";
`
};

// src/registry/letter-pile.ts
var letterPile = {
  name: "letter-pile",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "letter-pile.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export interface LetterPileProps extends React.HTMLAttributes<HTMLCanvasElement> {
  count?: number;
  size?: number;
  grav?: number;
  bounce?: number;
  drag?: number;
  push?: number;
  gyro?: number;
  swing?: number;
  c1?: string;
  c2?: string;
  c3?: string;
  bg?: string;
  ink?: string;
  paused?: boolean;
}

interface Disk {
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  f: number;
  ci: number;
  ch: string;
  r: number;
}

function parseHex(h: string): [number, number, number] {
  const c = h.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const CHAR_SET = "MOTIONKITSCROLLDEPTHGLASS";

export const LetterPile = React.forwardRef<HTMLCanvasElement, LetterPileProps>(
  function LetterPile(
    {
      count = 54,
      size = 5.2,
      grav = 1,
      bounce = 0.45,
      drag = 0.15,
      push = 1.4,
      gyro = 1,
      swing = 0.35,
      c1 = "#ff4a2b",
      c2 = "#2d4bff",
      c3 = "#f4f1e8",
      bg = "#101014",
      ink = "#101014",
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const disksRef = useRef<Disk[]>([]);
    const pointerRef = useRef<{ x: number; y: number; t: number; down: boolean }>({
      x: -1e4,
      y: -1e4,
      t: -1e9,
      down: false,
    });
    const gyroRef = useRef<{ on: boolean; g: number; b: number }>({ on: false, g: 0, b: 0 });
    const isVisibleRef = useRef<boolean>(true);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(cvs);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const onOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null && e.beta !== null) {
          gyroRef.current.on = true;
          gyroRef.current.g = e.gamma;
          gyroRef.current.b = e.beta;
        }
      };
      window.addEventListener("deviceorientation", onOrientation);
      return () => window.removeEventListener("deviceorientation", onOrientation);
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;

      const onPointerMove = (e: PointerEvent) => {
        const rect = cvs.getBoundingClientRect();
        pointerRef.current.x = e.clientX - rect.left;
        pointerRef.current.y = e.clientY - rect.top;
        pointerRef.current.t = performance.now();
      };

      const onPointerDown = (e: PointerEvent) => {
        onPointerMove(e);
        pointerRef.current.down = true;
      };

      const onPointerUp = () => {
        pointerRef.current.down = false;
      };

      const onPointerLeave = () => {
        pointerRef.current.x = -1e4;
        pointerRef.current.y = -1e4;
        pointerRef.current.t = -1e9;
        pointerRef.current.down = false;
      };

      cvs.addEventListener("pointermove", onPointerMove);
      cvs.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
      cvs.addEventListener("pointerleave", onPointerLeave);

      return () => {
        cvs.removeEventListener("pointermove", onPointerMove);
        cvs.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
        cvs.removeEventListener("pointerleave", onPointerLeave);
      };
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      if (!ctx) return;

      let lastTime = performance.now();
      let rafId = 0;

      const resize = () => {
        const rect = cvs.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cvs.width = Math.round(rect.width * dpr);
        cvs.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const ro = new ResizeObserver(resize);
      ro.observe(cvs);
      resize();

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const rect = cvs.getBoundingClientRect();
          const w = rect.width;
          const h = rect.height;

          if (w > 0 && h > 0) {
            let dt = Math.min((ms - lastTime) / 1000, 0.033) || 0.016;
            lastTime = ms;
            const t = ms / 1000;

            const disks = disksRef.current;
            const rb = (size * Math.min(w, h)) / 100;

            while (disks.length < count) {
              disks.push({
                x: Math.random() * w,
                y: Math.random() * h * 0.35,
                vx: 0,
                vy: 0,
                a: Math.random() * 6,
                f: 0.75 + Math.random() * 0.5,
                ci: Math.floor(Math.random() * 3),
                ch: CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)] ?? "A",
                r: 0,
              });
            }
            if (disks.length > count) {
              disks.length = count;
            }

            const gyroState = gyroRef.current;
            const ang = gyroState.on
              ? (Math.min(80, Math.max(-80, gyroState.g)) * Math.PI) / 180 * gyro
              : reducedMotion
              ? 0
              : Math.sin(t * 0.7) * swing;

            const gx = Math.sin(ang) * grav * 1600;
            const gy = Math.cos(ang) * grav * 1600;
            const isPointerActive = performance.now() - pointerRef.current.t < 2500;
            const pr = rb * 4;

            for (const p of disks) {
              p.r = rb * p.f;
              p.vx += gx * dt;
              p.vy += gy * dt;
              const k = Math.max(0, 1 - drag * dt);
              p.vx *= k;
              p.vy *= k;

              if (isPointerActive) {
                const dx = p.x - pointerRef.current.x;
                const dy = p.y - pointerRef.current.y;
                const dd = Math.hypot(dx, dy) || 1;
                const totalR = p.r + pr;
                if (dd < totalR) {
                  const force =
                    (1 - dd / totalR) *
                    push *
                    (pointerRef.current.down ? 2.5 : 1) *
                    2200 *
                    dt;
                  p.vx += (dx / dd) * force;
                  p.vy += (dy / dd) * force;
                }
              }

              p.x += p.vx * dt;
              p.y += p.vy * dt;
              p.a += (p.vx / p.r) * dt * 0.6;
            }

            for (let it = 0; it < 3; it++) {
              for (let i = 0; i < disks.length; i++) {
                for (let j = i + 1; j < disks.length; j++) {
                  const a = disks[i];
                  const b = disks[j];
                  if (!a || !b) continue;

                  const dx = a.x - b.x;
                  const dy = a.y - b.y;
                  const m = a.r + b.r;
                  const q = dx * dx + dy * dy;

                  if (q < m * m && q > 0.01) {
                    const dd = Math.sqrt(q);
                    const nx = dx / dd;
                    const ny = dy / dd;
                    const ov = (m - dd) / 2;
                    a.x += nx * ov;
                    a.y += ny * ov;
                    b.x -= nx * ov;
                    b.y -= ny * ov;

                    const vn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                    if (vn < 0) {
                      const impulse = -((1 + bounce) * vn) / 2;
                      a.vx += nx * impulse;
                      a.vy += ny * impulse;
                      b.vx -= nx * impulse;
                      b.vy -= ny * impulse;
                    }
                  }
                }
              }

              for (const p of disks) {
                if (p.x < p.r) {
                  p.x = p.r;
                  p.vx = Math.abs(p.vx) * bounce;
                }
                if (p.x > w - p.r) {
                  p.x = w - p.r;
                  p.vx = -Math.abs(p.vx) * bounce;
                }
                if (p.y < p.r) {
                  p.y = p.r;
                  p.vy = Math.abs(p.vy) * bounce;
                }
                if (p.y > h - p.r) {
                  p.y = h - p.r;
                  p.vy = -Math.abs(p.vy) * bounce;
                  p.vx *= 1 - 0.9 * dt;
                }
              }
            }

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const palette = [c1, c2, c3];

            for (const p of disks) {
              const diskColor = palette[p.ci] ?? c1;
              const rgb = parseHex(diskColor);
              ctx.fillStyle = diskColor;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
              ctx.fill();

              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.a);
              const lum = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
              ctx.fillStyle = lum > 140 ? ink : "#ffffff";
              ctx.font = \`800 \${Math.floor(p.r * 1.15)}px "Schibsted Grotesk", sans-serif\`;
              ctx.fillText(p.ch, 0, p.r * 0.04);
              ctx.restore();
            }
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
      };
    }, [paused, reducedMotion, count, size, grav, bounce, drag, push, gyro, swing, c1, c2, c3, bg, ink]);

    return (
      <canvas
        ref={(node) => {
          canvasRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("block w-full h-full touch-none select-none", className)}
        style={{ ...style }}
        {...rest}
      />
    );
  }
);

LetterPile.displayName = "LetterPile";
`
};

// src/registry/flow-field.ts
var flowField = {
  name: "flow-field",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "flow-field.tsx",
  content: `"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "../utils/cn";

export interface FlowFieldProps extends React.HTMLAttributes<HTMLCanvasElement> {
  count?: number;
  scale?: number;
  curl?: number;
  speed?: number;
  drift?: number;
  fade?: number;
  lw?: number;
  pf?: number;
  prad?: number;
  hue?: number;
  range?: number;
  glow?: number;
  bg?: string;
  paused?: boolean;
}

function parseHex(h: string): [number, number, number] {
  const c = h.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export const FlowField = React.forwardRef<HTMLCanvasElement, FlowFieldProps>(
  function FlowField(
    {
      count = 1600,
      scale = 1.4,
      curl = 1.2,
      speed = 90,
      drift = 0.6,
      fade = 0.045,
      lw = 1.2,
      pf = 1.2,
      prad = 200,
      hue = 190,
      range = 140,
      glow = 1,
      bg = "#07080c",
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointerRef = useRef<{ x: number; y: number; t: number }>({ x: -1e4, y: -1e4, t: -1e9 });
    const isVisibleRef = useRef<boolean>(true);

    const buffersRef = useRef<{
      maxN: number;
      X: Float32Array;
      Y: Float32Array;
      VX: Float32Array;
      VY: Float32Array;
      A: Float32Array;
      q: number;
      ema: number;
      buckets: number[][];
    }>({
      maxN: 4000,
      X: new Float32Array(4000),
      Y: new Float32Array(4000),
      VX: new Float32Array(4000),
      VY: new Float32Array(4000),
      A: new Float32Array(4000),
      q: 1,
      ema: 0.016,
      buckets: Array.from({ length: 12 }, () => []),
    });

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(cvs);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;

      const onPointerMove = (e: PointerEvent) => {
        const rect = cvs.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          t: performance.now(),
        };
      };

      const onPointerLeave = () => {
        pointerRef.current = { x: -1e4, y: -1e4, t: -1e9 };
      };

      cvs.addEventListener("pointermove", onPointerMove);
      cvs.addEventListener("pointerdown", onPointerMove);
      cvs.addEventListener("pointerleave", onPointerLeave);

      return () => {
        cvs.removeEventListener("pointermove", onPointerMove);
        cvs.removeEventListener("pointerdown", onPointerMove);
        cvs.removeEventListener("pointerleave", onPointerLeave);
      };
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      if (!ctx) return;

      let lastTime = performance.now();
      let rafId = 0;

      const resize = () => {
        const rect = cvs.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        cvs.width = Math.round(rect.width * dpr);
        cvs.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, rect.width, rect.height);
        buffersRef.current.A.fill(0);
      };

      const ro = new ResizeObserver(resize);
      ro.observe(cvs);
      resize();

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const rect = cvs.getBoundingClientRect();
          const w = rect.width;
          const h = rect.height;

          if (w > 0 && h > 0) {
            const dt = Math.min((ms - lastTime) / 1000, 0.05) || 0.016;
            lastTime = ms;
            const t = ms / 1000;

            const b = buffersRef.current;
            b.ema += (dt - b.ema) * 0.05;
            if (b.ema > 0.026) b.q = Math.max(0.25, b.q * 0.985);
            else if (b.ema < 0.019 && b.q < 1) b.q = Math.min(1, b.q * 1.005);

            const n = Math.min(b.maxN, Math.floor(count * b.q));
            const sc = scale / 1000;
            const tt = t * drift;
            const isPointerActive = performance.now() - pointerRef.current.t < 2500;
            const buckets = b.buckets;

            for (let i = 0; i < 12; i++) {
              buckets[i] = [];
            }

            const bgRgb = parseHex(bg);
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = \`rgba(\${bgRgb[0]},\${bgRgb[1]},\${bgRgb[2]},\${fade})\`;
            ctx.fillRect(0, 0, w, h);

            for (let i = 0; i < n; i++) {
              let px = b.X[i] ?? 0;
              let py = b.Y[i] ?? 0;
              let fresh = false;

              b.A[i] = (b.A[i] ?? 0) - 1;
              if ((b.A[i] ?? 0) <= 0 || px < -20 || px > w + 20 || py < -20 || py > h + 20) {
                px = Math.random() * w;
                py = Math.random() * h;
                b.A[i] = 80 + Math.random() * 200;
                b.VX[i] = 0;
                b.VY[i] = 0;
                fresh = true;
              }

              const a =
                Math.sin(px * sc + tt) +
                Math.sin(py * sc * 1.27 - tt * 0.8) +
                Math.sin((px + py) * sc * 0.63 + tt * 0.5);
              const ang = a * curl;

              const vxTarget = Math.cos(ang) * speed;
              const vyTarget = Math.sin(ang) * speed;
              const vx = ((b.VX[i] ?? 0) + (vxTarget - (b.VX[i] ?? 0)) * 0.15);
              const vy = ((b.VY[i] ?? 0) + (vyTarget - (b.VY[i] ?? 0)) * 0.15);
              b.VX[i] = vx;
              b.VY[i] = vy;

              let nx = px + vx * dt;
              let ny = py + vy * dt;

              if (isPointerActive) {
                const dx = px - pointerRef.current.x;
                const dy = py - pointerRef.current.y;
                const qDist = dx * dx + dy * dy;
                if (qDist < prad * prad) {
                  const dd = Math.sqrt(qDist) + 1;
                  const f = Math.pow(1 - dd / prad, 2) * pf * speed * 3 * dt;
                  nx += (dx / dd) * f;
                  ny += (dy / dd) * f;
                }
              }

              if (!fresh) {
                const bucketIdx = Math.min(11, Math.max(0, Math.floor((a / 6 + 0.5) * 12)));
                buckets[bucketIdx]?.push(px, py, nx, ny);
              }

              b.X[i] = nx;
              b.Y[i] = ny;
            }

            ctx.globalCompositeOperation = glow ? "lighter" : "source-over";
            ctx.lineWidth = lw;
            ctx.lineCap = "round";

            for (let k = 0; k < 12; k++) {
              const segs = buckets[k];
              if (!segs || segs.length === 0) continue;

              ctx.strokeStyle = \`hsla(\${hue + (k / 12) * range}, 90%, \${glow ? 55 : 60}%, 0.8)\`;
              ctx.beginPath();
              for (let j = 0; j < segs.length; j += 4) {
                ctx.moveTo(segs[j] ?? 0, segs[j + 1] ?? 0);
                ctx.lineTo(segs[j + 2] ?? 0, segs[j + 3] ?? 0);
              }
              ctx.stroke();
            }
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
      };
    }, [paused, count, scale, curl, speed, drift, fade, lw, pf, prad, hue, range, glow, bg]);

    return (
      <canvas
        ref={(node) => {
          canvasRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("block w-full h-full touch-none select-none", className)}
        style={{ ...style }}
        {...rest}
      />
    );
  }
);

FlowField.displayName = "FlowField";
`
};

// src/registry/text-rail.ts
var textRail = {
  name: "text-rail",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "text-rail.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { cn } from "../utils/cn";

export interface TextRailProps extends React.HTMLAttributes<HTMLDivElement> {
  amp?: number;
  freq?: number;
  size?: number;
  speed?: number;
  gain?: number;
  bend?: number;
  rails?: number;
  gap?: number;
  outline?: number;
  line?: number;
  rot?: number;
  skew?: number;
  drift?: number;
  inertia?: number;
  vgain?: number;
  bg?: string;
  ink?: string;
  c2?: string;
  text?: string;
  captureWheel?: boolean;
  autoScroll?: boolean;
  autoSpeed?: number;
  scrollProgress?: number;
  paused?: boolean;
}

function rectPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = \`M\${pts[0]![0]} \${pts[0]![1]}\`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    d += \`C\${p1[0] + (p2[0] - p0[0]) / 6} \${p1[1] + (p2[1] - p0[1]) / 6} \${p2[0] - (p3[0] - p1[0]) / 6} \${p2[1] - (p3[1] - p1[1]) / 6} \${p2[0]} \${p2[1]}\`;
  }
  return d;
}

export const TextRail = React.forwardRef<HTMLDivElement, TextRailProps>(
  function TextRail(
    {
      amp = 0.16,
      freq = 1.6,
      size = 0.2,
      speed = 0.2,
      gain = 1.2,
      bend = 1.2,
      rails = 3,
      gap = 0.28,
      outline = 0.55,
      line = 0.25,
      rot = -8,
      skew = 1,
      drift = 0.5,
      inertia = 0.12,
      vgain = 1,
      bg = "#101014",
      ink = "#f2efe8",
      c2 = "#ff4a2b",
      text = "Scroll \xB7 Motion \xB7 Rhythm \xB7 ",
      captureWheel = false,
      autoScroll = false,
      autoSpeed = 1,
      scrollProgress,
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const groupRef = useRef<SVGGElement | null>(null);
    const pathsRef = useRef<(SVGPathElement | null)[]>([]);
    const textsRef = useRef<(SVGTextElement | null)[]>([]);
    const textPathsRef = useRef<(SVGTextPathElement | null)[]>([]);
    const isVisibleRef = useRef<boolean>(true);

    const uid = useId().replace(/:/g, "");
    const [dims, setDims] = useState<{ w: number; h: number }>({ w: 800, h: 600 });

    const scrollState = useRef<{
      virtualScroll: number;
      sm: number;
      sv: number;
      vs: number;
      ph: number;
      unit: number;
      cachedFontSize: number;
    }>({
      virtualScroll: 0,
      sm: 0,
      sv: 0,
      vs: 0,
      ph: 0,
      unit: 800,
      cachedFontSize: 0,
    });

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            setDims({ w: width, h: height });
            scrollState.current.cachedFontSize = 0;
          }
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    useEffect(() => {
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready.then(() => {
          scrollState.current.cachedFontSize = 0;
        });
      }
    }, []);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;

      const onWheel = (e: WheelEvent) => {
        if (!captureWheel) return;
        e.preventDefault();
        scrollState.current.virtualScroll += e.deltaY;
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }, [captureWheel]);

    useEffect(() => {
      let lastTime = performance.now();
      let rafId = 0;

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const dt = Math.min((ms - lastTime) / 1000, 0.05) || 0.016;
          lastTime = ms;
          const t = ms / 1000;
          const { w, h } = dims;

          if (w > 0 && h > 0) {
            const st = scrollState.current;
            const nRails = Math.min(4, Math.max(1, Math.round(rails)));
            const fs = size * h;

            if (autoScroll) {
              st.virtualScroll += dt * autoSpeed * 200;
            }

            let effectiveScroll = st.virtualScroll;
            if (scrollProgress !== undefined) {
              effectiveScroll = scrollProgress * h * 4;
            }

            st.sm += (effectiveScroll - st.sm) * inertia;
            const v = (st.sm - st.sv) / h / Math.max(dt, 0.004);
            st.sv = st.sm;
            st.vs += (Math.min(2, Math.max(-2, v * 0.25 * vgain)) - st.vs) * 0.12;

            if (st.cachedFontSize !== fs) {
              textsRef.current.forEach((txt) => {
                if (txt) txt.style.fontSize = \`\${fs}px\`;
              });
              const firstTp = textPathsRef.current[0];
              if (firstTp) {
                try {
                  st.unit = firstTp.getComputedTextLength() / 6 || 800;
                } catch {
                  st.unit = 800;
                }
              }
              st.cachedFontSize = fs;
            }

            st.ph += dt * (drift + st.vs * bend * 2);
            const amplitude = amp * h * (1 + bend * Math.abs(st.vs));
            const base = st.sm * gain + t * speed * 120;
            const u = st.unit > 0 ? st.unit : 800;

            if (groupRef.current) {
              groupRef.current.setAttribute(
                "transform",
                \`rotate(\${rot + st.vs * skew * 4} \${w / 2} \${h / 2})\`
              );
            }

            for (let i = 0; i < 4; i++) {
              const pathEl = pathsRef.current[i];
              const textEl = textsRef.current[i];
              const tpEl = textPathsRef.current[i];
              const on = i < nRails;

              if (pathEl) pathEl.style.display = on ? "" : "none";
              if (textEl) textEl.style.display = on ? "" : "none";
              if (!on || !pathEl || !textEl || !tpEl) continue;

              const cy = h / 2 + (i - (nRails - 1) / 2) * gap * h;
              const pts: [number, number][] = [];
              for (let k = 0; k < 9; k++) {
                pts.push([
                  -w * 0.25 + (k * w * 1.5) / 8,
                  cy + Math.sin(k * freq * 0.8 + st.ph + i * 0.9) * amplitude,
                ]);
              }

              pathEl.setAttribute("d", rectPath(pts));
              pathEl.setAttribute("stroke", ink);
              pathEl.setAttribute("stroke-opacity", String(line));

              const dir = i % 2 ? -1 : 1;
              const sh = (((base * dir) % u) + u) % u;
              tpEl.setAttribute("startOffset", \`\${sh - u}\`);

              if (i % 2) {
                textEl.setAttribute("fill", c2);
                textEl.setAttribute("fill-opacity", String(1 - outline));
                textEl.setAttribute("stroke", c2);
                textEl.setAttribute("stroke-width", \`\${fs * 0.012}\`);
              } else {
                textEl.setAttribute("fill", ink);
                textEl.setAttribute("fill-opacity", "1");
                textEl.removeAttribute("stroke");
              }
            }
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }, [paused, dims, autoScroll, autoSpeed, scrollProgress, rails, size, inertia, vgain, drift, bend, amp, gain, speed, rot, skew, gap, freq, ink, line, c2, outline]);

    const repeatedText = text.repeat(6);

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("relative w-full h-full overflow-hidden select-none touch-none", className)}
        style={{ backgroundColor: bg, ...style }}
        {...rest}
      >
        <svg
          ref={svgRef}
          viewBox={\`0 0 \${dims.w} \${dims.h}\`}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <g ref={groupRef}>
            {[0, 1, 2, 3].map((i) => {
              const pathId = \`rail-path-\${uid}-\${i}\`;
              return (
                <React.Fragment key={i}>
                  <path
                    id={pathId}
                    ref={(el) => {
                      pathsRef.current[i] = el;
                    }}
                    fill="none"
                  />
                  <text
                    ref={(el) => {
                      textsRef.current[i] = el;
                    }}
                    style={{
                      fontFamily: '"Bricolage Grotesque", "Schibsted Grotesk", sans-serif',
                      fontWeight: 800,
                      fontVariationSettings: '"wdth" 80',
                      letterSpacing: "-0.03em",
                    }}
                  >
                    <textPath
                      ref={(el) => {
                        textPathsRef.current[i] = el;
                      }}
                      href={\`#\${pathId}\`}
                    >
                      {repeatedText}
                    </textPath>
                  </text>
                </React.Fragment>
              );
            })}
          </g>
        </svg>
      </div>
    );
  }
);

TextRail.displayName = "TextRail";
`
};

// src/registry/moire-grating.ts
var moireGrating = {
  name: "moire-grating",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "moire-grating.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export interface MoireGratingProps extends React.HTMLAttributes<HTMLCanvasElement> {
  type?: number;
  gap?: number;
  duty?: number;
  ratio?: number;
  rot?: number;
  drift?: number;
  follow?: number;
  mix?: number;
  bg?: string;
  a?: string;
  b?: string;
  paused?: boolean;
}

export const MoireGrating = React.forwardRef<HTMLCanvasElement, MoireGratingProps>(
  function MoireGrating(
    {
      type = 0,
      gap = 9,
      duty = 0.42,
      ratio = 1.04,
      rot = 0.05,
      drift = 0.4,
      follow = 0.12,
      mix = 1,
      bg = "#e8ebef",
      a = "#101014",
      b = "#ff4a2b",
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointerRef = useRef<{ x: number; y: number; t: number }>({ x: -1e4, y: -1e4, t: -1e9 });
    const posB = useRef<{ bx: number; by: number }>({ bx: 400, by: 300 });
    const isVisibleRef = useRef<boolean>(true);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(cvs);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;

      const onPointerMove = (e: PointerEvent) => {
        const rect = cvs.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          t: performance.now(),
        };
      };

      const onPointerLeave = () => {
        pointerRef.current = { x: -1e4, y: -1e4, t: -1e9 };
      };

      cvs.addEventListener("pointermove", onPointerMove);
      cvs.addEventListener("pointerdown", onPointerMove);
      cvs.addEventListener("pointerleave", onPointerLeave);

      return () => {
        cvs.removeEventListener("pointermove", onPointerMove);
        cvs.removeEventListener("pointerdown", onPointerMove);
        cvs.removeEventListener("pointerleave", onPointerLeave);
      };
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      if (!ctx) return;

      let rafId = 0;

      const resize = () => {
        const rect = cvs.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        cvs.width = Math.round(rect.width * dpr);
        cvs.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        posB.current.bx = rect.width / 2;
        posB.current.by = rect.height / 2;
      };

      const ro = new ResizeObserver(resize);
      ro.observe(cvs);
      resize();

      const drawGrating = (
        cx: number,
        cy: number,
        curGap: number,
        ang: number,
        col: string,
        alpha: number,
        diag: number
      ) => {
        ctx.strokeStyle = col;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = Math.max(0.5, curGap * duty);
        ctx.beginPath();

        if (type === 0) {
          for (let r = curGap / 2; r < diag; r += curGap) {
            ctx.moveTo(cx + r, cy);
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
          }
        } else if (type === 1) {
          const cos = Math.cos(ang);
          const sin = Math.sin(ang);
          for (let p = -diag; p < diag; p += curGap) {
            ctx.moveTo(cx - cos * diag - sin * p, cy - sin * diag + cos * p);
            ctx.lineTo(cx + cos * diag - sin * p, cy + sin * diag + cos * p);
          }
        } else {
          const n = Math.round(2000 / curGap);
          for (let k = 0; k < n; k++) {
            const radAngle = ang + (k / n) * Math.PI * 2;
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(radAngle) * diag, cy + Math.sin(radAngle) * diag);
          }
        }

        ctx.stroke();
      };

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const rect = cvs.getBoundingClientRect();
          const w = rect.width;
          const h = rect.height;

          if (w > 0 && h > 0) {
            const t = ms / 1000;
            const diag = Math.hypot(w, h);
            const isPointerActive = performance.now() - pointerRef.current.t < 2500;

            const tx = isPointerActive
              ? pointerRef.current.x
              : w / 2 + Math.sin(t * 0.4 * drift) * w * 0.2;
            const ty = isPointerActive
              ? pointerRef.current.y
              : h / 2 + Math.cos(t * 0.31 * drift) * h * 0.2;

            const bPos = posB.current;
            bPos.bx += (tx - bPos.bx) * follow;
            bPos.by += (ty - bPos.by) * follow;

            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            const baseAng = reducedMotion ? 0 : t * rot * 0.2;

            drawGrating(w / 2, h / 2, gap, baseAng, a, 1, diag);

            ctx.globalCompositeOperation = "multiply";
            drawGrating(
              bPos.bx,
              bPos.by,
              gap * ratio,
              baseAng + (ratio - 1) * 1.2,
              b,
              mix,
              diag
            );

            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
      };
    }, [paused, reducedMotion, type, gap, duty, ratio, rot, drift, follow, mix, bg, a, b]);

    return (
      <canvas
        ref={(node) => {
          canvasRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("block w-full h-full touch-none select-none", className)}
        style={{ ...style }}
        {...rest}
      />
    );
  }
);

MoireGrating.displayName = "MoireGrating";
`
};

// src/registry/swipe-deck.ts
var swipeDeck = {
  name: "swipe-deck",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "swipe-deck.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export interface DeckCardItem {
  word: string;
  bg: string;
  fg: string;
  text: string;
}

export interface SwipeDeckProps extends React.HTMLAttributes<HTMLDivElement> {
  stiff?: number;
  damp?: number;
  tilt?: number;
  fling?: number;
  depth?: number;
  offset?: number;
  shrink?: number;
  radius?: number;
  lift?: number;
  bg?: string;
  cards?: DeckCardItem[];
  paused?: boolean;
}

const DEFAULT_CARDS: DeckCardItem[] = [
  { word: "Move", bg: "#ff4a2b", fg: "#101014", text: "Drag me anywhere." },
  { word: "Slow", bg: "#101014", fg: "#f2efe8", text: "Springs settle, they do not snap." },
  { word: "Press", bg: "#2d4bff", fg: "#ffe14a", text: "A fast flick flies off the table." },
  { word: "Pause", bg: "#f2efe8", fg: "#101014", text: "A slow drag comes back." },
  { word: "Look", bg: "#ffe14a", fg: "#101014", text: "The next card leans in." },
  { word: "Loop", bg: "#25e0c0", fg: "#101014", text: "And then it starts over." },
];

interface CardState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  r: number;
  o: number;
  fl: number;
}

export const SwipeDeck = React.forwardRef<HTMLDivElement, SwipeDeckProps>(
  function SwipeDeck(
    {
      stiff = 220,
      damp = 22,
      tilt = 8,
      fling = 650,
      depth = 3,
      offset = 16,
      shrink = 0.06,
      radius = 26,
      lift = 1.04,
      bg = "#0f1014",
      cards = DEFAULT_CARDS,
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cardNodesRef = useRef<(HTMLDivElement | null)[]>([]);
    const cardStates = useRef<CardState[]>(cards.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, s: 1, r: 0, o: 1, fl: 0 })));
    const orderRef = useRef<number[]>(cards.map((_, i) => i));
    const dragRef = useRef<{ ox: number; oy: number; lx: number; lt: number; vx: number } | null>(null);
    const isVisibleRef = useRef<boolean>(true);

    useEffect(() => {
      cardStates.current = cards.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, s: 1, r: 0, o: 1, fl: 0 }));
      orderRef.current = cards.map((_, i) => i);
    }, [cards]);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const onPointerDown = (e: PointerEvent) => {
        const topIdx = orderRef.current[0];
        if (topIdx === undefined) return;
        const topCardNode = cardNodesRef.current[topIdx];
        if (!topCardNode || !topCardNode.contains(e.target as Node)) return;

        const k = cardStates.current[topIdx];
        if (!k) return;

        dragRef.current = {
          ox: k.x - e.clientX,
          oy: k.y - e.clientY,
          lx: e.clientX,
          lt: performance.now(),
          vx: 0,
        };
        k.fl = 0;
        try {
          el.setPointerCapture(e.pointerId);
        } catch {}
      };

      const onPointerMove = (e: PointerEvent) => {
        const d = dragRef.current;
        if (!d) return;
        const topIdx = orderRef.current[0];
        if (topIdx === undefined) return;
        const k = cardStates.current[topIdx];
        if (!k) return;

        const now = performance.now();
        const dt = Math.max(1, now - d.lt) / 1000;
        d.vx += ((e.clientX - d.lx) / dt - d.vx) * 0.35;
        d.lx = e.clientX;
        d.lt = now;
        k.x = e.clientX + d.ox;
        k.y = e.clientY + d.oy;
      };

      const onPointerUp = () => {
        const d = dragRef.current;
        if (!d) return;
        dragRef.current = null;

        const topIdx = orderRef.current[0];
        if (topIdx === undefined) return;
        const k = cardStates.current[topIdx];
        if (!k) return;

        const rect = el.getBoundingClientRect();
        const w = rect.width || 400;
        const isFast = Math.abs(d.vx) > fling;

        if (isFast || Math.abs(k.x) > w * 0.3) {
          k.fl = Math.sign(isFast ? d.vx : k.x) || 1;
          k.vx = k.fl * Math.max(Math.abs(d.vx), fling * 1.2);
          k.vy = 0;
          if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
            navigator.vibrate(6);
          }
        } else {
          k.vx = d.vx;
        }
      };

      el.addEventListener("pointerdown", onPointerDown);
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerup", onPointerUp);
      el.addEventListener("pointercancel", onPointerUp);

      return () => {
        el.removeEventListener("pointerdown", onPointerDown);
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerup", onPointerUp);
        el.removeEventListener("pointercancel", onPointerUp);
      };
    }, [fling]);

    useEffect(() => {
      let lastTime = performance.now();
      let rafId = 0;

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const el = containerRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            const w = rect.width || 400;
            const dt = Math.min((ms - lastTime) / 1000, 0.033) || 0.016;
            lastTime = ms;

            const ord = orderRef.current;
            const states = cardStates.current;
            const n = ord.length;

            const topIdx = ord[0];
            if (topIdx !== undefined) {
              const F = states[topIdx];
              if (F && !dragRef.current) {
                if (F.fl) {
                  F.x += F.vx * dt;
                  if (Math.abs(F.x) > w * 0.5 + 260) {
                    const shifted = ord.shift();
                    if (shifted !== undefined) ord.push(shifted);
                    F.x = 0;
                    F.y = 0;
                    F.vx = 0;
                    F.vy = 0;
                    F.fl = 0;
                    F.o = 0;
                  }
                } else {
                  F.vx += (-stiff * F.x - damp * F.vx) * dt;
                  F.vy += (-stiff * F.y - damp * F.vy) * dt;
                  F.x += F.vx * dt;
                  F.y += F.vy * dt;
                }
              }

              const p = Math.min(1, Math.max(0, Math.abs(F ? F.x : 0) / (w * 0.35)));

              for (let i = 0; i < n; i++) {
                const ci = ord[i];
                if (ci === undefined) continue;
                const k = states[ci];
                const cardNode = cardNodesRef.current[ci];
                if (!k || !cardNode) continue;

                if (i === 0) {
                  k.s += ((dragRef.current ? lift : 1) - k.s) * 0.25;
                  k.r *= 0.85;
                  k.o += (1 - k.o) * 0.3;
                  cardNode.style.transform = \`translate(\${k.x}px, \${k.y}px) rotate(\${(k.x / 100) * tilt + k.r}deg) scale(\${k.s})\`;
                  cardNode.style.setProperty("--sx", \`\${Math.min(120, Math.max(-120, (k.x / w) * 160))}%\`);
                } else {
                  const e = i - p;
                  const ty = e * offset;
                  const ts = 1 - e * shrink;
                  const tr = (i % 2 ? 1 : -1) * e * 1.4;
                  k.x = 0;
                  k.y += (ty - k.y) * 0.2;
                  k.s += (ts - k.s) * 0.2;
                  k.r += (tr - k.r) * 0.2;
                  k.o += ((i < depth ? 1 : 0) - k.o) * 0.2;
                  cardNode.style.transform = \`translate(0px, \${k.y}px) rotate(\${k.r}deg) scale(\${k.s})\`;
                }

                cardNode.style.opacity = String(k.o);
                cardNode.style.zIndex = String(n - i);
                cardNode.style.borderRadius = \`\${radius}px\`;
              }
            }
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafId);
    }, [paused, stiff, damp, tilt, depth, offset, shrink, radius, lift]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn(
          "relative flex items-center justify-center w-full h-full overflow-hidden select-none touch-none",
          className
        )}
        style={{ backgroundColor: bg, ...style }}
        {...rest}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            ref={(node) => {
              cardNodesRef.current[i] = node;
            }}
            className="absolute flex flex-col justify-between p-[8%] overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl will-change-transform touch-none select-none"
            style={{
              width: "min(320px, 78vw)",
              aspectRatio: "3/4.2",
              backgroundColor: card.bg,
              color: card.fg,
              borderRadius: radius,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.3), transparent 70%)",
                transform: "translateX(var(--sx, -120%))",
              }}
            />
            <span
              className="font-extrabold tracking-tight leading-none"
              style={{
                fontSize: "clamp(3.5rem, 18vw, 6rem)",
                fontVariationSettings: '"wdth" 75',
                letterSpacing: "-0.05em",
              }}
            >
              {card.word}
            </span>
            <span className="font-medium text-xs sm:text-sm max-w-[16ch] leading-snug opacity-90">
              {card.text}
            </span>
          </div>
        ))}
      </div>
    );
  }
);

SwipeDeck.displayName = "SwipeDeck";
`
};

// src/registry/camera-mirror.ts
var cameraMirror = {
  name: "camera-mirror",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "camera-mirror.tsx",
  content: `"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

export interface CameraMirrorProps extends React.HTMLAttributes<HTMLDivElement> {
  cell?: number;
  mode?: number;
  contrast?: number;
  bright?: number;
  inv?: number;
  dot?: number;
  trail?: number;
  col?: number;
  c1?: string;
  bg?: string;
  paused?: boolean;
}

function parseHex(h: string): [number, number, number] {
  const c = h.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const GLYPHS = " .:-=+*#%@";

export const CameraMirror = React.forwardRef<HTMLDivElement, CameraMirrorProps>(
  function CameraMirror(
    {
      cell = 12,
      mode = 0,
      contrast = 1.4,
      bright = 0,
      inv = 0,
      dot = 1,
      trail = 0.35,
      col = 0,
      c1 = "#f2efe8",
      bg = "#08080b",
      paused = false,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const atlasCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const atlasKeyRef = useRef<string>("");
    const atlasTileSizeRef = useRef<number>(12);

    const pointerRef = useRef<{ x: number; y: number; t: number }>({ x: -1e4, y: -1e4, t: -1e9 });
    const isVisibleRef = useRef<boolean>(true);
    const [cameraActive, setCameraActive] = useState<boolean>(false);
    const [camMessage, setCamMessage] = useState<string | null>(null);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;

      const onPointerMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          t: performance.now(),
        };
      };

      const onPointerLeave = () => {
        pointerRef.current = { x: -1e4, y: -1e4, t: -1e9 };
      };

      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerdown", onPointerMove);
      el.addEventListener("pointerleave", onPointerLeave);

      return () => {
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerdown", onPointerMove);
        el.removeEventListener("pointerleave", onPointerLeave);
      };
    }, []);

    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 } },
          audio: false,
        });
        const v = document.createElement("video");
        v.srcObject = s;
        v.muted = true;
        v.playsInline = true;
        await v.play();
        videoRef.current = v;
        streamRef.current = s;
        setCameraActive(true);
        setCamMessage(null);
      } catch {
        setCamMessage("No camera access, using simulation");
        setTimeout(() => setCamMessage(null), 3000);
      }
    };

    useEffect(() => {
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      if (!ctx) return;

      if (!sampleCanvasRef.current) {
        sampleCanvasRef.current = document.createElement("canvas");
      }
      if (!atlasCanvasRef.current) {
        atlasCanvasRef.current = document.createElement("canvas");
      }

      const sampleCanvas = sampleCanvasRef.current;
      const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!sampleCtx) return;

      const atlasCanvas = atlasCanvasRef.current;

      let rafId = 0;

      const resize = () => {
        const rect = cvs.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        cvs.width = Math.round(rect.width * dpr);
        cvs.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const ro = new ResizeObserver(resize);
      ro.observe(cvs);
      resize();

      const loop = (ms: number) => {
        if (!paused && !document.hidden && isVisibleRef.current) {
          const rect = cvs.getBoundingClientRect();
          const w = rect.width;
          const h = rect.height;

          if (w > 0 && h > 0) {
            const t = ms / 1000;
            const effectiveCell = Math.max(cell, Math.sqrt((w * h) / 7000));
            const cols = Math.ceil(w / effectiveCell);
            const rows = Math.ceil(h / effectiveCell);

            if (sampleCanvas.width !== cols || sampleCanvas.height !== rows) {
              sampleCanvas.width = cols;
              sampleCanvas.height = rows;
            }

            const video = videoRef.current;
            if (video && video.videoWidth) {
              const vw = video.videoWidth;
              const vh = video.videoHeight;
              const ar = cols / rows;
              let sw = vw;
              let sh = vh;
              if (vw / vh > ar) sw = vh * ar;
              else sh = vw / ar;

              sampleCtx.save();
              sampleCtx.translate(cols, 0);
              sampleCtx.scale(-1, 1);
              sampleCtx.drawImage(
                video,
                (vw - sw) / 2,
                (vh - sh) / 2,
                sw,
                sh,
                0,
                0,
                cols,
                rows
              );
              sampleCtx.restore();
            } else {
              sampleCtx.fillStyle = "#000000";
              sampleCtx.fillRect(0, 0, cols, rows);
              const r0 = Math.min(cols, rows);

              const drawBlob = (bx: number, by: number, r: number) => {
                const gr = sampleCtx.createRadialGradient(bx, by, 0, bx, by, r);
                gr.addColorStop(0, "#ffffff");
                gr.addColorStop(1, "rgba(255,255,255,0)");
                sampleCtx.fillStyle = gr;
                sampleCtx.fillRect(bx - r, by - r, r * 2, r * 2);
              };

              for (let i = 0; i < 3; i++) {
                drawBlob(
                  cols * (0.5 + 0.32 * Math.sin(t * 0.5 + i * 2.1)),
                  rows * (0.5 + 0.3 * Math.cos(t * 0.4 + i * 1.7)),
                  r0 * (0.2 + 0.07 * i)
                );
              }

              if (performance.now() - pointerRef.current.t < 2500) {
                drawBlob(
                  (pointerRef.current.x / w) * cols,
                  (pointerRef.current.y / h) * rows,
                  r0 * 0.18
                );
              }
            }

            const imgData = sampleCtx.getImageData(0, 0, cols, rows);
            const px = imgData.data;
            const c1Rgb = parseHex(c1);
            const bgRgb = parseHex(bg);

            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = \`rgba(\${bgRgb[0]},\${bgRgb[1]},\${bgRgb[2]},\${1 - trail})\`;
            ctx.fillRect(0, 0, w, h);

            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            if (mode === 2) {
              const currentKey = \`\${effectiveCell}|\${c1}|\${dpr}\`;
              if (atlasKeyRef.current !== currentKey) {
                atlasKeyRef.current = currentKey;
                const tileSize = Math.round(effectiveCell * dpr);
                atlasTileSizeRef.current = tileSize;
                atlasCanvas.width = tileSize * 10;
                atlasCanvas.height = tileSize;
                const actx = atlasCanvas.getContext("2d");
                if (actx) {
                  actx.fillStyle = c1;
                  actx.font = \`700 \${tileSize}px "Geist Mono", monospace\`;
                  actx.textAlign = "center";
                  actx.textBaseline = "middle";
                  Array.from(GLYPHS).forEach((ch, idx) => {
                    actx.fillText(ch, idx * tileSize + tileSize / 2, tileSize / 2);
                  });
                }
              }
            }

            ctx.fillStyle = c1;
            const batch = col <= 0.01 && mode < 2;
            if (batch) ctx.beginPath();

            for (let j = 0; j < rows; j++) {
              for (let i = 0; i < cols; i++) {
                const q = (j * cols + i) * 4;
                const rVal = px[q] ?? 0;
                const gVal = px[q + 1] ?? 0;
                const bVal = px[q + 2] ?? 0;

                let luma = (rVal * 0.299 + gVal * 0.587 + bVal * 0.114) / 255;
                luma = Math.min(1, Math.max(0, (luma - 0.5) * contrast + 0.5 + bright));
                if (inv) luma = 1 - luma;
                if (luma < 0.04) continue;

                const cx = i * effectiveCell + effectiveCell / 2;
                const cy = j * effectiveCell + effectiveCell / 2;

                if (mode === 2) {
                  const k = Math.min(9, Math.floor(luma * 10));
                  const tileSize = atlasTileSizeRef.current;
                  if (k > 0) {
                    ctx.drawImage(
                      atlasCanvas,
                      k * tileSize,
                      0,
                      tileSize,
                      tileSize,
                      i * effectiveCell,
                      j * effectiveCell,
                      effectiveCell,
                      effectiveCell
                    );
                  }
                } else {
                  if (!batch) {
                    const cr = Math.round(c1Rgb[0] + (rVal - c1Rgb[0]) * col);
                    const cg = Math.round(c1Rgb[1] + (gVal - c1Rgb[1]) * col);
                    const cb = Math.round(c1Rgb[2] + (bVal - c1Rgb[2]) * col);
                    ctx.fillStyle = \`rgb(\${cr},\${cg},\${cb})\`;
                    ctx.beginPath();
                  }

                  if (mode === 0) {
                    const radiusVal = luma * effectiveCell * 0.5 * dot;
                    ctx.moveTo(cx + radiusVal, cy);
                    ctx.arc(cx, cy, radiusVal, 0, Math.PI * 2);
                  } else {
                    const sizeVal = Math.sqrt(luma) * effectiveCell * dot;
                    ctx.rect(cx - sizeVal / 2, cy - sizeVal / 2, sizeVal, sizeVal);
                  }

                  if (!batch) ctx.fill();
                }
              }
            }

            if (batch) ctx.fill();
          }
        }
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
      };
    }, [paused, cell, mode, contrast, bright, inv, dot, trail, col, c1, bg]);

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("relative w-full h-full overflow-hidden select-none touch-none", className)}
        style={{ backgroundColor: bg, ...style }}
        {...rest}
      >
        <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-auto">
          {!cameraActive && (
            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold shadow-md hover:bg-zinc-200 transition"
            >
              Use camera
            </button>
          )}
          {camMessage && (
            <span className="text-[11px] font-mono text-white/70 bg-black/60 px-2.5 py-0.5 rounded-full">
              {camMessage}
            </span>
          )}
        </div>
      </div>
    );
  }
);

CameraMirror.displayName = "CameraMirror";
`
};

// src/registry/scroll-reveal.ts
var scrollReveal = {
  name: "scroll-reveal",
  dependencies: [
    "clsx",
    "tailwind-merge"
  ],
  fileName: "scroll-reveal.tsx",
  content: `"use client";

import React, { useEffect, useState } from "react";
import { cn } from "../utils/cn";

export interface RevealItem {
  word: string;
  bg: string;
  fg: string;
}

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  rot?: number;
  sc?: number;
  bl?: number;
  rad?: number;
  stag?: number;
  sh?: number;
  lr?: number;
  items?: RevealItem[];
}

const DEFAULT_ITEMS: RevealItem[] = [
  { word: "Slow", bg: "#ff4a2b", fg: "#101014" },
  { word: "Down", bg: "#101014", fg: "#f2efe8" },
  { word: "Then", bg: "#2d4bff", fg: "#ffe14a" },
  { word: "Look", bg: "#f2efe8", fg: "#101014" },
  { word: "Again", bg: "#ffe14a", fg: "#101014" },
];

export const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  function ScrollReveal(
    {
      rot = -6,
      sc = 0.78,
      bl = 8,
      rad = 48,
      stag = 5,
      sh = 60,
      lr = 8,
      items = DEFAULT_ITEMS,
      className,
      style,
      ...rest
    },
    forwardedRef
  ) {
    const [supported, setSupported] = useState<boolean>(true);

    useEffect(() => {
      if (typeof CSS !== "undefined" && typeof CSS.supports === "function") {
        setSupported(CSS.supports("animation-timeline", "view()"));
      }
    }, []);

    const cssVars = {
      "--rot": String(rot),
      "--sc": String(sc),
      "--bl": String(bl),
      "--rad": String(rad),
      "--stag": String(stag),
      "--sh": String(sh),
      "--lr": String(lr),
      scrollTimeline: "--rv block",
    } as React.CSSProperties;

    return (
      <div
        ref={forwardedRef}
        className={cn(
          "relative w-full h-full overflow-y-auto scrollbar-none [touch-action:pan-y] select-none",
          className
        )}
        style={{ ...cssVars, ...style }}
        {...rest}
      >
        <style>{\`
          @keyframes rvin {
            from {
              scale: var(--sc, 0.78);
              rotate: calc(var(--rot, -6) * 1deg);
              filter: blur(calc(var(--bl, 8) * 1px));
            }
            to {
              scale: 1;
              rotate: 0deg;
              filter: blur(0);
            }
          }
          @keyframes rvl {
            from {
              translate: 0 calc(var(--sh, 60) * 1vh);
              rotate: calc(var(--lr, 8) * 1deg);
              opacity: 0;
            }
            to {
              translate: 0 0;
              rotate: 0deg;
              opacity: 1;
            }
          }
          @keyframes rvbar {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
          .sr-bar {
            position: sticky;
            top: 0;
            height: 3px;
            background: #fff;
            mix-blend-mode: difference;
            transform-origin: 0 50%;
            z-index: 10;
            animation: rvbar linear both;
            animation-timeline: --rv;
          }
          .sr-panel {
            position: absolute;
            inset: 3vw;
            border-radius: calc(var(--rad, 48) * 1px);
            animation: rvin linear both;
            animation-timeline: view();
            animation-range: entry 0% cover 38%;
          }
          .sr-word i {
            font-style: normal;
            display: inline-block;
            animation: rvl linear both;
            animation-timeline: view();
            animation-range: entry calc(8% + var(--i) * var(--stag, 5) * 1%) entry calc(70% + var(--i) * var(--stag, 5) * 1%);
          }
          @supports not (animation-timeline: view()) {
            .sr-panel, .sr-word i, .sr-bar {
              animation: none !important;
            }
          }
        \`}</style>

        <div className="sr-bar" />

        {!supported && (
          <div className="sticky top-12 mx-auto max-w-sm rounded-lg bg-black/80 border border-white/20 p-3 text-center text-xs text-white/80 z-20">
            Scroll-driven animations require a modern browser (Chrome 115+, Edge 115+, Safari 26+).
          </div>
        )}

        {items.map((item, idx) => (
          <section
            key={idx}
            className="relative h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden"
          >
            <div className="sr-panel" style={{ backgroundColor: item.bg }} />
            <div
              className="sr-word relative flex font-extrabold tracking-tight leading-none"
              style={{
                color: item.fg,
                fontSize: "clamp(3.5rem, 20vw, 12rem)",
                fontVariationSettings: '"wdth" 75',
                letterSpacing: "-0.05em",
              }}
            >
              {Array.from(item.word).map((char, charIdx) => (
                <i
                  key={charIdx}
                  style={{ "--i": charIdx } as React.CSSProperties}
                >
                  {char}
                </i>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }
);

ScrollReveal.displayName = "ScrollReveal";
`
};

// src/registry/index.ts
var canonicalRegistry = {
  "accordion": accordion,
  "ai-prompt-input": aiPromptInput,
  "alert": alert,
  "aurora-border-card": auroraBorderCard,
  "aurora-border-fx": auroraBorderFx,
  "aurora-search-pill": auroraSearchPill,
  "avatar": avatar,
  "badge": badge,
  "blur-fade": blurFade,
  "button": button,
  "camera-mirror": cameraMirror,
  "card": card,
  "checkbox": checkbox,
  "command": command,
  "dark-mode": darkMode,
  "data-display": dataDisplay,
  "dialog": dialog,
  "dither-image": ditherImage,
  "dock": dock,
  "file-upload": fileUpload,
  "flow-field": flowField,
  "fluted-glass": flutedGlass,
  "frost-hover-card": frostHoverCard,
  "glass-lens": glassLens,
  "glass-shatter-card": glassShatterCard,
  "gravity-grid": gravityGrid,
  "holo-finish-card": holoFinishCard,
  "holo-foil": holoFoil,
  "input": input,
  "interactive-code-block": interactiveCodeBlock,
  "letter-pile": letterPile,
  "liquid-smear": liquidSmear,
  "live-object": liveObject,
  "loader": loader,
  "marquee": marquee,
  "moire-grating": moireGrating,
  "morphing-geometry": morphingGeometry,
  "navigation": navigation,
  "node-flow-graph": nodeFlowGraph,
  "number-ticker": numberTicker,
  "particle-reveal-card": particleRevealCard,
  "premium-charts": premiumCharts,
  "premium-commerce": premiumCommerce,
  "premium-effects": premiumEffects,
  "premium-media": premiumMedia,
  "premium-overlays": premiumOverlays,
  "premium-social": premiumSocial,
  "pro-buttons": proButtons,
  "pro-cards": proCards,
  "pro-inputs": proInputs,
  "pro-objects": proObjects,
  "progress": progress,
  "rating": rating,
  "ripple-water": rippleWater,
  "scroll-area": scrollArea,
  "scroll-drum": scrollDrum,
  "scroll-reveal": scrollReveal,
  "scroll-warp": scrollWarp,
  "select": select,
  "silk-unveil": silkUnveil,
  "skeleton": skeleton,
  "slider": slider,
  "sound-pulse": soundPulse,
  "special-animations": specialAnimations,
  "special-forms": specialForms,
  "stepper": stepper,
  "swipe-deck": swipeDeck,
  "switch": switchComponent,
  "table": table,
  "tabs": tabs,
  "text-rail": textRail,
  "toaster": toaster,
  "tooltip": tooltip,
  "twist-ribbon": twistRibbon,
  "type-proximity": typeProximity,
  "ultra-components": ultraComponents,
  "ultra-effects": ultraEffects
};
var registry = {
  ...canonicalRegistry,
  // Friendly & legacy aliases
  "modal": dialog,
  "loaders": loader,
  "charts": premiumCharts,
  "commerce": premiumCommerce,
  "social": premiumSocial,
  "action-buttons": proButtons,
  "specialized-inputs": proInputs,
  "form-controls": specialForms,
  "product-cards": proCards,
  "spotlight-effects": premiumEffects,
  "text-motion": ultraEffects,
  "atmospheric-effects": ultraComponents,
  "motion-primitives": specialAnimations,
  "media-showcase": premiumMedia,
  "overlays": premiumOverlays,
  // camelCase compatibility aliases
  "aiPromptInput": aiPromptInput,
  "auroraBorderCard": auroraBorderCard,
  "auroraBorderFx": auroraBorderFx,
  "auroraSearchPill": auroraSearchPill,
  "blurFade": blurFade,
  "cameraMirror": cameraMirror,
  "darkMode": darkMode,
  "dataDisplay": dataDisplay,
  "ditherImage": ditherImage,
  "fileUpload": fileUpload,
  "flowField": flowField,
  "flutedGlass": flutedGlass,
  "frostHoverCard": frostHoverCard,
  "glassLens": glassLens,
  "glassShatterCard": glassShatterCard,
  "gravityGrid": gravityGrid,
  "holoFinishCard": holoFinishCard,
  "holoFoil": holoFoil,
  "interactiveCodeBlock": interactiveCodeBlock,
  "letterPile": letterPile,
  "liquidSmear": liquidSmear,
  "liveObject": liveObject,
  "moireGrating": moireGrating,
  "morphingGeometry": morphingGeometry,
  "nodeFlowGraph": nodeFlowGraph,
  "numberTicker": numberTicker,
  "particleRevealCard": particleRevealCard,
  "premiumCharts": premiumCharts,
  "premiumCommerce": premiumCommerce,
  "premiumEffects": premiumEffects,
  "premiumMedia": premiumMedia,
  "premiumOverlays": premiumOverlays,
  "premiumSocial": premiumSocial,
  "proButtons": proButtons,
  "proCards": proCards,
  "proInputs": proInputs,
  "proObjects": proObjects,
  "rippleWater": rippleWater,
  "scrollArea": scrollArea,
  "scrollDrum": scrollDrum,
  "scrollReveal": scrollReveal,
  "scrollWarp": scrollWarp,
  "silkUnveil": silkUnveil,
  "soundPulse": soundPulse,
  "specialAnimations": specialAnimations,
  "specialForms": specialForms,
  "swipeDeck": swipeDeck,
  "switchComponent": switchComponent,
  "textRail": textRail,
  "twistRibbon": twistRibbon,
  "typeProximity": typeProximity,
  "ultraComponents": ultraComponents,
  "ultraEffects": ultraEffects
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
    "https://www.nexoreui.com",
    "https://nexoreui.com",
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
          "User-Agent": "nexoreui-cli/2.0.2"
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
    "https://www.nexoreui.com",
    "https://nexoreui.com",
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
          "User-Agent": "nexoreui-cli/2.0.2"
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
var TOYBERRY_ASSETS_LIST = [
  ...Array.from({ length: 120 }, (_, i) => `/templates/toyberry/frames/s1/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 120 }, (_, i) => `/templates/toyberry/frames/s2/${String(i + 1).padStart(4, "0")}.webp`),
  "/templates/toyberry/toys/dino.png",
  "/templates/toyberry/toys/rocket.png",
  "/templates/toyberry/toys/bear.png",
  "/templates/toyberry/toys/pinkcar.png",
  "/templates/toyberry/toys/duck.png",
  "/templates/toyberry/toys/redcar.png",
  "/templates/toyberry/toys/robot.png",
  "/templates/toyberry/toys/train.png"
];
var KARMIN_ASSETS_LIST = [
  ...Array.from({ length: 120 }, (_, i) => `/templates/karmin/frames/eye/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 120 }, (_, i) => `/templates/karmin/frames/smoke/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 120 }, (_, i) => `/templates/karmin/frames/morph/${String(i + 1).padStart(4, "0")}.webp`),
  "/templates/karmin/stills/halo.webp",
  "/templates/karmin/stills/panther.webp",
  "/templates/karmin/stills/tiger.webp"
];
var FIZZWICK_ASSETS_LIST = [
  "/templates/fizzwick/bg.webp",
  "/templates/fizzwick/box.webp",
  "/templates/fizzwick/ice.webp",
  "/templates/fizzwick/logo.png",
  ...["cherry", "lime", "orange", "lemon", "grape", "blueberry"].flatMap((f) => [
    `/templates/fizzwick/can-${f}-s.webp`,
    `/templates/fizzwick/mascot-${f}.webp`,
    `/templates/fizzwick/splash-${f}.webp`,
    `/templates/fizzwick/wrap-${f}.webp`
  ]),
  ...Array.from({ length: 6 }, (_, i) => `/templates/fizzwick/fx-cherry-${i}.webp`),
  ...Array.from({ length: 5 }, (_, i) => `/templates/fizzwick/fx-lime-${i}.webp`),
  ...Array.from({ length: 5 }, (_, i) => `/templates/fizzwick/fx-orange-${i}.webp`),
  ...Array.from({ length: 5 }, (_, i) => `/templates/fizzwick/fx-lemon-${i}.webp`),
  ...Array.from({ length: 3 }, (_, i) => `/templates/fizzwick/fx-grape-${i}.webp`),
  ...Array.from({ length: 4 }, (_, i) => `/templates/fizzwick/fx-blueberry-${i}.webp`)
];
var MACHINA65_ASSETS_LIST = [
  "/templates/machina-65/hero-board.webp",
  "/templates/machina-65/exploded-1-keycaps.webp",
  "/templates/machina-65/exploded-2-switches.webp",
  "/templates/machina-65/exploded-3-plate.webp",
  "/templates/machina-65/exploded-4-foam.webp",
  "/templates/machina-65/exploded-5-pcb.webp",
  "/templates/machina-65/exploded-6-chassis.webp",
  "/templates/machina-65/exploded-7-weight.webp",
  "/templates/machina-65/top-master.webp",
  "/templates/machina-65/top-chassis-empty.webp",
  "/templates/machina-65/plate-alu.webp",
  "/templates/machina-65/plate-brass.webp",
  "/templates/machina-65/plate-pc.webp",
  "/templates/machina-65/switch-linear.webp",
  "/templates/machina-65/switch-tactile.webp",
  "/templates/machina-65/switch-silent.webp",
  "/templates/machina-65/knob-brass.webp",
  "/templates/machina-65/knob-black.webp",
  "/templates/machina-65/knob-orange.webp",
  "/templates/machina-65/cap-esc-orange.webp",
  "/templates/machina-65/cap-esc-brass.webp",
  "/templates/machina-65/cap-enter-accent.webp",
  "/templates/machina-65/cap-space-accent.webp",
  "/templates/machina-65/cable-coiled.webp",
  "/templates/machina-65/puller-tool.webp",
  "/templates/machina-65/swatch-alu.webp",
  "/templates/machina-65/swatch-brass.webp",
  "/templates/machina-65/swatch-pbt.webp",
  "/templates/machina-65/compare-raw-cnc.webp",
  "/templates/machina-65/compare-finished.webp",
  "/templates/machina-65/case-bottom.webp",
  "/templates/machina-65/case-lid.webp",
  "/templates/machina-65/case-dustcover.webp"
];
var SOLECRAFT_ASSETS_LIST = [
  "/templates/solecraft/shoe-master.webp",
  "/templates/solecraft/shoe-day1.webp",
  "/templates/solecraft/shoe-month12.webp",
  "/templates/solecraft/exploded-1-upper.webp",
  "/templates/solecraft/exploded-2-footbed.webp",
  "/templates/solecraft/exploded-3-strobel.webp",
  "/templates/solecraft/exploded-4-midsole.webp",
  "/templates/solecraft/exploded-5-outsole.webp",
  "/templates/solecraft/swatch-suede.webp",
  "/templates/solecraft/swatch-leather.webp",
  "/templates/solecraft/swatch-ripstop.webp",
  "/templates/solecraft/tex-suede.webp",
  "/templates/solecraft/tex-leather.webp",
  "/templates/solecraft/tex-ripstop.webp",
  "/templates/solecraft/trim-dubrae.webp",
  "/templates/solecraft/trim-hangtag.webp",
  "/templates/solecraft/trim-patch.webp",
  "/templates/solecraft/box-sleeve.webp",
  "/templates/solecraft/box-tray-full.webp",
  "/templates/solecraft/box-tray-front.webp",
  "/templates/solecraft/tissue-paper.webp"
];
var TEMPLATE_MEDIA_ASSETS = {
  "template-machina-65-pro": MACHINA65_ASSETS_LIST,
  "machina-65": MACHINA65_ASSETS_LIST,
  "machina65": MACHINA65_ASSETS_LIST,
  "template-solecraft-pro": SOLECRAFT_ASSETS_LIST,
  "solecraft-run89": SOLECRAFT_ASSETS_LIST,
  "solecraft": SOLECRAFT_ASSETS_LIST,
  "template-fizzwick-soda-pro": FIZZWICK_ASSETS_LIST,
  "fizzwick-soda": FIZZWICK_ASSETS_LIST,
  "fizzwick": FIZZWICK_ASSETS_LIST,
  "template-toyberry-store-pro": TOYBERRY_ASSETS_LIST,
  "toyberry-store": TOYBERRY_ASSETS_LIST,
  "toyberry": TOYBERRY_ASSETS_LIST,
  "template-karmin-film-pro": KARMIN_ASSETS_LIST,
  "karmin-film": KARMIN_ASSETS_LIST,
  "karmin": KARMIN_ASSETS_LIST,
  "template-nexore-tee-pro": [
    "/templates/nexore-tee/nexore-tee-01-box-closed.jpg",
    "/templates/nexore-tee/nexore-tee-02-box-open.jpg",
    "/templates/nexore-tee/nexore-tee-03-tee-white.jpg",
    "/templates/nexore-tee/nexore-tee-04-patch-sheet.jpg",
    "/templates/nexore-tee/nexore-tee-04-patches-sheet.jpg",
    "/templates/nexore-tee/nexore-tee-05-letters-tray.jpg",
    "/templates/nexore-tee/nexore-tee-06-paper-texture.jpg",
    "/templates/nexore-tee/nexore-tee-07-sealed-bag.jpg",
    "/templates/nexore-tee/nexore-tee-08-press-pad.jpg"
  ],
  "nexore-tee": [
    "/templates/nexore-tee/nexore-tee-01-box-closed.jpg",
    "/templates/nexore-tee/nexore-tee-02-box-open.jpg",
    "/templates/nexore-tee/nexore-tee-03-tee-white.jpg",
    "/templates/nexore-tee/nexore-tee-04-patch-sheet.jpg",
    "/templates/nexore-tee/nexore-tee-04-patches-sheet.jpg",
    "/templates/nexore-tee/nexore-tee-05-letters-tray.jpg",
    "/templates/nexore-tee/nexore-tee-06-paper-texture.jpg",
    "/templates/nexore-tee/nexore-tee-07-sealed-bag.jpg",
    "/templates/nexore-tee/nexore-tee-08-press-pad.jpg"
  ],
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
  "template-dustline-dawn-pro": ["/templates/dustline-dawn/ride.mp4", "/templates/dustline-dawn/poster.webp", "/templates/dustline-dawn/p1.webp", "/templates/dustline-dawn/p2.webp", "/templates/dustline-dawn/p3.webp", "/templates/dustline-dawn/p4.webp", "/templates/dustline-dawn/p5.webp"],
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
  { id: "template-machina-65-pro", slug: "machina-65", title: "MACHINA 65 CNC Mechanical Keyboard & Acoustic Studio" },
  { id: "template-solecraft-pro", slug: "solecraft", title: "SOLECRAFT \u2014 Run-89 Footwear Atelier & Box Studio" },
  { id: "template-fizzwick-soda-pro", slug: "fizzwick-soda", title: "FIZZWICK \u2014 3D WebGL Soda Can & 3-Pack Studio" },
  { id: "template-toyberry-store-pro", slug: "toyberry-store", title: "TOYBERRY \u2014 Interactive 3D Toy Store & Self-Checkout Journey" },
  { id: "template-karmin-film-pro", slug: "karmin-film", title: "KARMIN \u2014 3-Film Scroll Cinema & Pigment Study" },
  { id: "template-nexore-tee-pro", slug: "nexore-tee", title: "NEXORE TEE \u2014 Custom Animated T-Shirt Studio" },
  { id: "template-nexore-case-pro", slug: "nexore-case", title: "NEXORE CASE \u2014 Custom Phone Case Builder" },
  { id: "template-vesuvio-pizza-pro", slug: "vesuvio-pizza", title: "VESUVIO \u2014 Woodfired Artisanal Pizza Studio" },
  { id: "template-dustline-dawn-pro", slug: "dustline-dawn", title: "DUSTLINE \u2014 Dawn Horseback Rides" },
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
  const allRegistryKeys = Object.keys(canonicalRegistry);
  let targetComponents = components.flatMap((c) => c.split(",")).map((c) => c.trim()).filter(Boolean);
  if (options.all || targetComponents.includes("--all")) {
    targetComponents = allRegistryKeys;
    console.log(`
\x1B[36mAdding all ${targetComponents.length} components from NexoreUI registry...\x1B[0m`);
  }
  if (targetComponents.length === 0) {
    console.error("\x1B[31mError: Please specify components to add or use --all.\x1B[0m");
    console.log("Example: npx nexoreui add button dialog table --all");
    return [];
  }
  let project = detectProject(process.cwd());
  const effectivePm = options.pm || project.packageManager;
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
\x1B[33m\x1B[1mNotice: No package.json found in current directory (${process.cwd()}).\x1B[0m`);
        console.log(`Found a project in subdirectory: \x1B[36m\x1B[1m./${targetCandidate}\x1B[0m
`);
        let shouldNavigate = options.yes;
        if (!options.yes) {
          const ans = await askQuestion(`Would you like to install components inside ./${targetCandidate}? (Y/n): `);
          shouldNavigate = !ans.trim() || ans.trim().toLowerCase() === "y" || ans.trim().toLowerCase() === "yes";
        }
        if (shouldNavigate) {
          console.log(`\x1B[32mOK Switching working directory to ./${targetCandidate}...\x1B[0m
`);
          process.chdir(path4.join(process.cwd(), targetCandidate));
          return addCommand(components, options);
        } else {
          console.error(`\x1B[31mInstallation cancelled. Please change into your project folder first:\x1B[0m`);
          console.log(`  \x1B[36mcd ${targetCandidate}\x1B[0m`);
          console.log(`  \x1B[36mnpx nexoreui add ${components.join(" ")}\x1B[0m
`);
          return [];
        }
      }
    } catch {
    }
    console.error(`\x1B[31m\x1B[1mError: No React project (package.json) found in ${process.cwd()}.\x1B[0m`);
    console.error(`Please make sure you are inside your project folder before running \x1B[36mnpx nexoreui add\x1B[0m.
`);
    return [];
  }
  console.log(`
\x1B[34mDetected project type:\x1B[0m ${project.projectType.toUpperCase()}`);
  console.log(`\x1B[34mDetected package manager:\x1B[0m ${effectivePm}
`);
  let customComponentsDir;
  let customUtilsFile;
  const resolveAliasPath = (aliasValue) => {
    if (aliasValue.startsWith("~/")) {
      return aliasValue.replace(/^~\//, "app/");
    }
    if (aliasValue.startsWith("@/")) {
      return aliasValue.replace(/^@\//, project.hasSrcDir ? "src/" : "");
    }
    return aliasValue;
  };
  try {
    const configPath = path4.join(project.baseDir, "nexore.json");
    if (fs4.existsSync(configPath)) {
      const cfg = JSON.parse(fs4.readFileSync(configPath, "utf8"));
      if (cfg.aliases?.components) {
        customComponentsDir = resolveAliasPath(cfg.aliases.components);
      }
      if (cfg.aliases?.utils) {
        const utilBase = resolveAliasPath(cfg.aliases.utils);
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
    const regItem = registry[compName];
    if (regItem) {
      const canonicalName = regItem.name;
      if (!componentsToInstall.has(canonicalName)) {
        componentsToInstall.add(canonicalName);
        if (regItem.componentsDependencies) {
          for (const dep of regItem.componentsDependencies) {
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
    return [];
  }
  const fetchedTemplates = [];
  if (templatesToInstall.size > 0) {
    const config = readStoredConfig();
    const licenseKey = config.licenseKey;
    if (!licenseKey) {
      console.error("\n\x1B[31m\x1B[1mError: NexoreUI Pro license required\x1B[0m");
      console.error(
        `The following item(s) are Pro templates:
  ${Array.from(templatesToInstall).map((t) => `\x1B[33m${t}\x1B[0m`).join(", ")}`
      );
      console.log("\nTo install Pro templates, authenticate with your Pro license key:");
      console.log("  \x1B[36mnpx nexoreui auth <your-license-key>\x1B[0m");
      console.log("\nNeed a Pro license? Get lifetime access at:");
      console.log("  \x1B[36mhttps://www.nexoreui.com/pricing\x1B[0m\n");
      return [];
    }
    const verifyRes = await verifyRemoteLicense(licenseKey);
    if (!verifyRes.valid) {
      console.error(`
\x1B[31m\x1B[1mError: ${verifyRes.error || "Invalid or revoked Pro license key"}\x1B[0m
`);
      return [];
    }
    console.log(`\x1B[32mOK Verified Pro license for ${verifyRes.owner || "authorized user"}.\x1B[0m`);
    for (const tName of templatesToInstall) {
      console.log(`\x1B[36mFetching Pro template from secure registry:\x1B[0m ${tName}...`);
      const tRes = await fetchRemoteTemplate(tName, licenseKey);
      if (!tRes.valid || !tRes.content) {
        console.error(`\x1B[31mError: ${tRes.error || `Could not retrieve template '${tName}'`}\x1B[0m`);
        return [];
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
  const defaultComponentsDir = customComponentsDir || (project.projectType === "remix" ? "app/components/ui" : project.hasSrcDir ? "src/components/ui" : "components/ui");
  const defaultUtilsFile = customUtilsFile || (project.projectType === "remix" ? "app/lib/utils.ts" : project.hasSrcDir ? "src/lib/utils.ts" : "lib/utils.ts");
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
    console.log(`\x1B[32mOK Created utilities file (cn helper) at:\x1B[0m ${utilsFileInput}`);
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
    console.log(`\x1B[32mOK Added component:\x1B[0m ${compName} -> ${displayRelPath}`);
    registryItem.dependencies.forEach((dep) => npmDependencies.add(dep));
  }
  for (const template of fetchedTemplates) {
    const targetDir = path4.resolve(project.baseDir, project.hasSrcDir ? "src/templates" : "templates");
    ensureDir(targetDir);
    const targetPath = path4.join(targetDir, template.fileName);
    copyComponentFile(template.content, targetPath, absoluteUtilsFile);
    const displayRelPath = path4.relative(project.baseDir, targetPath).replace(/\\/g, "/");
    console.log(`\x1B[32mOK Added Pro template:\x1B[0m ${template.name} -> ${displayRelPath}`);
    if (template.assets && template.assets.length > 0) {
      for (const assetPath of template.assets) {
        const destPath = path4.join(project.baseDir, "public", assetPath.replace(/^\//, ""));
        if (!fs4.existsSync(destPath)) {
          try {
            ensureDir(path4.dirname(destPath));
            const assetUrl = `https://www.nexoreui.com${assetPath}`;
            console.log(`\x1B[36mDownloading media asset:\x1B[0m ${assetPath}...`);
            const res = await fetch(assetUrl);
            if (res.ok) {
              const arrayBuffer = await res.arrayBuffer();
              fs4.writeFileSync(destPath, Buffer.from(arrayBuffer));
              console.log(`\x1B[32mOK Downloaded asset:\x1B[0m public${assetPath}`);
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
    if (effectivePm === "pnpm") installCmd = "pnpm add";
    else if (effectivePm === "yarn") installCmd = "yarn add";
    else if (effectivePm === "bun") installCmd = "bun add";
    try {
      (0, import_child_process.execSync)(`${installCmd} ${depsToInstall.join(" ")}`, {
        stdio: "inherit",
        cwd: project.baseDir
      });
      console.log("\x1B[32mOK Dependencies installed successfully.\x1B[0m");
    } catch {
      console.error("\x1B[31mFailed to install dependencies automatically. Please run:\x1B[0m");
      console.log(`  ${installCmd} ${depsToInstall.join(" ")}`);
    }
  }
  const totalCount = componentsToInstall.size + fetchedTemplates.length;
  console.log(`
\x1B[32m\x1B[1mDone. ${totalCount} NexoreUI item(s) installed.\x1B[0m
`);
  return Array.from(componentsToInstall);
}

// src/commands/list.ts
function listCommand() {
  const keys = Object.keys(canonicalRegistry);
  console.log(`
\x1B[34m\x1B[1m=== Available NexoreUI Components (${keys.length} Free & Open Source) ===\x1B[0m
`);
  keys.forEach((name) => {
    const item = canonicalRegistry[name];
    console.log(`- \x1B[32m\x1B[1m${name}\x1B[0m (${item.fileName})`);
    if (item.dependencies.length > 0) {
      console.log(`  \x1B[90mDependencies: ${item.dependencies.join(", ")}\x1B[0m`);
    }
    if (item.componentsDependencies && item.componentsDependencies.length > 0) {
      console.log(`  \x1B[33mRequires component: ${item.componentsDependencies.join(", ")}\x1B[0m`);
    }
    console.log("");
  });
  console.log(`
\x1B[35m\x1B[1m=== Available NexoreUI Pro Templates (${PRO_TEMPLATES.length}, Requires Pro License) ===\x1B[0m
`);
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
  slate: {
    light: "hsl(240 5.9% 10%)",
    lightFg: "hsl(0 0% 98%)",
    dark: "hsl(0 0% 98%)",
    darkFg: "hsl(240 5.9% 10%)",
    ringLight: "hsl(240 10% 3.9%)",
    ringDark: "hsl(240 4.9% 83.9%)",
    rgbLight: "24 24 27",
    rgbDark: "250 250 250"
  },
  zinc: {
    light: "hsl(240 5.9% 10%)",
    lightFg: "hsl(0 0% 98%)",
    dark: "hsl(0 0% 98%)",
    darkFg: "hsl(240 5.9% 10%)",
    ringLight: "hsl(240 10% 3.9%)",
    ringDark: "hsl(240 4.9% 83.9%)",
    rgbLight: "24 24 27",
    rgbDark: "250 250 250"
  },
  indigo: {
    light: "hsl(243 75% 59%)",
    lightFg: "hsl(0 0% 100%)",
    dark: "hsl(239 84% 67%)",
    darkFg: "hsl(0 0% 100%)",
    ringLight: "hsl(243 75% 59%)",
    ringDark: "hsl(239 84% 67%)",
    rgbLight: "79 70 229",
    rgbDark: "129 140 248"
  },
  violet: {
    light: "hsl(262.1 83.3% 57.8%)",
    lightFg: "hsl(0 0% 100%)",
    dark: "hsl(263.4 70% 58%)",
    darkFg: "hsl(0 0% 100%)",
    ringLight: "hsl(262.1 83.3% 57.8%)",
    ringDark: "hsl(263.4 70% 58%)",
    rgbLight: "124 58 237",
    rgbDark: "139 92 246"
  },
  emerald: {
    light: "hsl(142.1 76.2% 36.3%)",
    lightFg: "hsl(0 0% 100%)",
    dark: "hsl(142.1 70.6% 45.3%)",
    darkFg: "hsl(240 10% 3.9%)",
    ringLight: "hsl(142.1 76.2% 36.3%)",
    ringDark: "hsl(142.1 70.6% 45.3%)",
    rgbLight: "22 163 74",
    rgbDark: "34 197 94"
  },
  rose: {
    light: "hsl(346.8 77.2% 49.8%)",
    lightFg: "hsl(0 0% 100%)",
    dark: "hsl(346.8 77.2% 55%)",
    darkFg: "hsl(0 0% 100%)",
    ringLight: "hsl(346.8 77.2% 49.8%)",
    ringDark: "hsl(346.8 77.2% 55%)",
    rgbLight: "225 29 72",
    rgbDark: "244 63 94"
  },
  amber: {
    light: "hsl(32 95% 44%)",
    lightFg: "hsl(0 0% 100%)",
    dark: "hsl(38 92% 50%)",
    darkFg: "hsl(240 10% 3.9%)",
    ringLight: "hsl(32 95% 44%)",
    ringDark: "hsl(38 92% 50%)",
    rgbLight: "217 119 6",
    rgbDark: "245 158 11"
  },
  orange: {
    light: "hsl(20.5 90.2% 48.2%)",
    lightFg: "hsl(0 0% 100%)",
    dark: "hsl(24.6 95% 53.1%)",
    darkFg: "hsl(240 10% 3.9%)",
    ringLight: "hsl(20.5 90.2% 48.2%)",
    ringDark: "hsl(24.6 95% 53.1%)",
    rgbLight: "234 88 12",
    rgbDark: "249 115 22"
  },
  cyan: {
    light: "hsl(191.6 91.4% 36.5%)",
    lightFg: "hsl(0 0% 100%)",
    dark: "hsl(188.7 94.5% 42.7%)",
    darkFg: "hsl(240 10% 3.9%)",
    ringLight: "hsl(191.6 91.4% 36.5%)",
    ringDark: "hsl(188.7 94.5% 42.7%)",
    rgbLight: "8 145 178",
    rgbDark: "6 182 212"
  },
  sky: {
    light: "hsl(200.4 98% 39.4%)",
    lightFg: "hsl(0 0% 100%)",
    dark: "hsl(198.6 88.7% 48.4%)",
    darkFg: "hsl(240 10% 3.9%)",
    ringLight: "hsl(200.4 98% 39.4%)",
    ringDark: "hsl(198.6 88.7% 48.4%)",
    rgbLight: "2 132 199",
    rgbDark: "14 165 233"
  },
  neon: {
    light: "hsl(173 80% 34%)",
    lightFg: "hsl(0 0% 100%)",
    dark: "hsl(173 95% 48%)",
    darkFg: "hsl(240 10% 3.9%)",
    ringLight: "hsl(173 80% 34%)",
    ringDark: "hsl(173 95% 48%)",
    rgbLight: "17 156 140",
    rgbDark: "6 239 211"
  },
  crimson: {
    light: "hsl(0 72.2% 50.6%)",
    lightFg: "hsl(0 0% 100%)",
    dark: "hsl(0 84.2% 60.2%)",
    darkFg: "hsl(0 0% 100%)",
    ringLight: "hsl(0 72.2% 50.6%)",
    ringDark: "hsl(0 84.2% 60.2%)",
    rgbLight: "220 38 38",
    rgbDark: "239 68 68"
  }
};
var FONT_CONFIGS = {
  geist: {
    sans: "'Geist', system-ui, -apple-system, sans-serif",
    mono: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    label: "Geist",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
  },
  inter: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    label: "Inter",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
  },
  jetbrains: {
    sans: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    label: "JetBrains Mono",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
  },
  system: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    label: "System UI",
    googleFontsHref: null
  }
};
var DENSITY_CONFIGS = {
  compact: { scale: "0.875", padding: "0.75rem", gap: "0.5rem" },
  default: { scale: "1", padding: "1.25rem", gap: "0.875rem" },
  relaxed: { scale: "1.125", padding: "1.75rem", gap: "1.25rem" }
};
var ANIMATION_CONFIGS = {
  none: { duration: "0s", ease: "linear" },
  subtle: { duration: "0.28s", ease: "cubic-bezier(0.16, 1, 0.3, 1)" },
  energetic: { duration: "0.16s", ease: "cubic-bezier(0.22, 1, 0.36, 1)" }
};
function cleanJsonc(input2) {
  let out = "";
  let inString = false;
  let escaped = false;
  let i = 0;
  while (i < input2.length) {
    const ch = input2[i];
    const next = input2[i + 1];
    if (inString) {
      out += ch;
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      i++;
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
      i++;
      continue;
    }
    if (ch === "/" && next === "/") {
      while (i < input2.length && input2[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < input2.length && !(input2[i] === "*" && input2[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    out += ch;
    i++;
  }
  return out.replace(/,\s*([}\]])/g, "$1");
}
function ensurePathAlias(baseDir, projectType, hasSrcDir) {
  let updated = false;
  const configsToCheck = [
    path5.join(baseDir, "tsconfig.app.json"),
    path5.join(baseDir, "tsconfig.json"),
    path5.join(baseDir, "jsconfig.json")
  ];
  const aliasKey = projectType === "remix" ? "~/*" : "@/*";
  const aliasTarget = projectType === "remix" ? ["./app/*"] : hasSrcDir ? ["./src/*"] : ["./*"];
  for (const targetConfig of configsToCheck) {
    if (fs5.existsSync(targetConfig)) {
      try {
        const content = fs5.readFileSync(targetConfig, "utf8");
        const parsed = JSON.parse(cleanJsonc(content));
        parsed.compilerOptions = parsed.compilerOptions || {};
        parsed.compilerOptions.paths = parsed.compilerOptions.paths || {};
        if (!parsed.compilerOptions.paths[aliasKey]) {
          parsed.compilerOptions.paths[aliasKey] = aliasTarget;
          fs5.writeFileSync(targetConfig, JSON.stringify(parsed, null, 2) + "\n", "utf8");
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
        let changed = false;
        if (!viteContent.includes("alias") && !viteContent.includes("'@'")) {
          const hasUrlImport = viteContent.includes("from 'url'") || viteContent.includes('from "url"') || viteContent.includes("from 'node:url'") || viteContent.includes('from "node:url"');
          const headerAddition = hasUrlImport ? "" : "import { fileURLToPath, URL } from 'node:url'\n";
          if (viteContent.includes("defineConfig({")) {
            viteContent = headerAddition + viteContent.replace(
              "defineConfig({",
              `defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./${hasSrcDir ? "src" : "."}', import.meta.url)),
    },
  },`
            );
            changed = true;
          }
        }
        if (!viteContent.includes("@tailwindcss/vite")) {
          if (viteContent.includes("plugins: [")) {
            viteContent = `import tailwindcss from '@tailwindcss/vite'
` + viteContent;
            viteContent = viteContent.replace(/plugins:\s*\[/, "plugins: [tailwindcss(), ");
            changed = true;
          }
        }
        if (changed) {
          fs5.writeFileSync(vitePath, viteContent, "utf8");
          updated = true;
        }
        break;
      }
    }
  }
  if (projectType === "astro") {
    const astroConfigFiles = ["astro.config.mjs", "astro.config.ts", "astro.config.js"];
    for (const fileName of astroConfigFiles) {
      const astroPath = path5.join(baseDir, fileName);
      if (fs5.existsSync(astroPath)) {
        const content = fs5.readFileSync(astroPath, "utf8");
        if (!content.includes("@astrojs/react") || !content.includes("@tailwindcss/vite")) {
          const nextAstroConfig = `import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
`;
          fs5.writeFileSync(astroPath, nextAstroConfig, "utf8");
          updated = true;
        }
        break;
      }
    }
  }
  return updated;
}
function buildThemeCss(themeName, radiusValue, fontFamily = "geist", density = "default", animationStyle = "subtle") {
  const normalizedTheme = themeName.toLowerCase().trim();
  const palette = THEME_PALETTES[normalizedTheme] || THEME_PALETTES.slate;
  const radius = typeof radiusValue === "number" ? radiusValue : radiusValue !== void 0 && !isNaN(parseFloat(radiusValue)) ? parseFloat(radiusValue) : 0.625;
  const fontConfig = FONT_CONFIGS[fontFamily] || FONT_CONFIGS.geist;
  const densityConfig = DENSITY_CONFIGS[density] || DENSITY_CONFIGS.default;
  const animConfig = ANIMATION_CONFIGS[animationStyle] || ANIMATION_CONFIGS.subtle;
  const reducedMotionCss = animationStyle === "none" ? `
*,
*::before,
*::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
` : `
:root[data-animation="none"] *,
:root[data-animation="none"] *::before,
:root[data-animation="none"] *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
`;
  return `/* NexoreUI Theme Tokens */
@theme inline {
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
  --radius-sm: max(0px, calc(var(--radius) - 4px));
  --radius-md: max(0px, calc(var(--radius) - 2px));
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --font-sans: ${fontConfig.sans};
  --font-mono: ${fontConfig.mono};
}

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 3.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 3.9%);
  --primary: ${palette.light};
  --primary-foreground: ${palette.lightFg};
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
  --ring: ${palette.ringLight};
  --primary-rgb: ${palette.rgbLight};
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
  --density-scale: ${densityConfig.scale};
  --density-padding: ${densityConfig.padding};
  --density-gap: ${densityConfig.gap};
  --motion-duration: ${animConfig.duration};
  --motion-ease: ${animConfig.ease};
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(240 10% 3.9%);
  --card-foreground: hsl(0 0% 98%);
  --popover: hsl(240 10% 3.9%);
  --popover-foreground: hsl(0 0% 98%);
  --primary: ${palette.dark};
  --primary-foreground: ${palette.darkFg};
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
  --ring: ${palette.ringDark};
  --primary-rgb: ${palette.rgbDark};
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
  --density-scale: ${densityConfig.scale};
  --density-padding: ${densityConfig.padding};
  --density-gap: ${densityConfig.gap};
  --motion-duration: ${animConfig.duration};
  --motion-ease: ${animConfig.ease};
}

@layer base {
  * {
    border-color: var(--border);
  }
  html,
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

.animate-accordion-down { animation: accordion-down 0.2s ease-out; }
.animate-accordion-up { animation: accordion-up 0.2s ease-out; }
${reducedMotionCss}
/* End NexoreUI Theme Tokens */`;
}
function injectThemeCss(baseDir, cssRelativePath, themeName, radiusValue, fontFamily = "geist", density = "default", animationStyle = "subtle", replaceExisting = false) {
  const cssAbsolutePath = path5.join(baseDir, cssRelativePath);
  const themeBlock = buildThemeCss(themeName, radiusValue, fontFamily, density, animationStyle);
  const cssDir = path5.dirname(cssAbsolutePath);
  if (!fs5.existsSync(cssDir)) fs5.mkdirSync(cssDir, { recursive: true });
  if (!replaceExisting && fs5.existsSync(cssAbsolutePath)) {
    const existing = fs5.readFileSync(cssAbsolutePath, "utf8");
    const startMarker = "/* NexoreUI Theme Tokens */";
    const endMarker = "/* End NexoreUI Theme Tokens */";
    const startIdx = existing.indexOf(startMarker);
    const endIdx = existing.indexOf(endMarker);
    let nextCss = existing;
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      nextCss = existing.slice(0, startIdx) + themeBlock + existing.slice(endIdx + endMarker.length);
    } else {
      const needsTailwindImport = !/@import\s+["']tailwindcss["']/.test(existing);
      const needsDarkVariant = !existing.includes("@custom-variant dark");
      const prefix = [
        needsTailwindImport ? '@import "tailwindcss";' : "",
        needsDarkVariant ? "@custom-variant dark (&:where(.dark, .dark *));" : ""
      ].filter(Boolean).join("\n\n");
      nextCss = `${prefix ? prefix + "\n\n" : ""}${existing.trimEnd()}

${themeBlock}
`;
    }
    fs5.writeFileSync(cssAbsolutePath, nextCss, "utf8");
    return true;
  }
  const cleanFullCss = `@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

${themeBlock}
`;
  fs5.writeFileSync(cssAbsolutePath, cleanFullCss, "utf8");
  return true;
}
function installPeerDependencies(baseDir, packageManager, dependencies = [
  "clsx",
  "tailwind-merge",
  "lucide-react",
  "framer-motion",
  "class-variance-authority"
]) {
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
\x1B[33mInstalling peer dependencies:\x1B[0m ${missingDeps.join(", ")}...`);
    (0, import_child_process2.execSync)(`${installCmd} ${missingDeps.join(" ")}`, {
      stdio: "inherit",
      cwd: baseDir
    });
    return true;
  } catch {
    console.warn("\x1B[33mWarning: Automatic peer dependency installation skipped.\x1B[0m");
    return false;
  }
}

// src/utils/starter.ts
function getGoogleFontsTags(font) {
  const cfg = FONT_CONFIGS[font] || FONT_CONFIGS.geist;
  if (!cfg.googleFontsHref) return "";
  return [
    '    <link rel="preconnect" href="https://fonts.googleapis.com" />',
    '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
    `    <link href="${cfg.googleFontsHref}" rel="stylesheet" />`
  ].join("\n");
}
function getThemeInitInlineJs(mode) {
  if (mode === "dark") {
    return `(function(){try{var s=localStorage.getItem('nexore-theme');var d=s?s==='dark':true;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`;
  }
  if (mode === "light") {
    return `(function(){try{var s=localStorage.getItem('nexore-theme');var d=s?s==='dark':false;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
  }
  return `(function(){try{var s=localStorage.getItem('nexore-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
}
function buildViteIndexHtml(options) {
  const htmlClass = options.mode === "dark" ? ' class="dark"' : "";
  const fontTags = getGoogleFontsTags(options.font);
  const initScript = getThemeInitInlineJs(options.mode);
  return `<!doctype html>
<html lang="en"${htmlClass} data-density="${options.density}" data-animation="${options.animation}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${options.projectName}</title>
${fontTags ? fontTags + "\n" : ""}    <script>${initScript}</script>
  </head>
  <body class="min-h-screen bg-background text-foreground antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}
function buildNextAppLayout(options) {
  const cfg = FONT_CONFIGS[options.font] || FONT_CONFIGS.geist;
  const htmlClass = options.mode === "dark" ? ' className="dark"' : "";
  const initScript = getThemeInitInlineJs(options.mode);
  const fontHead = cfg.googleFontsHref ? `        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="${cfg.googleFontsHref}" rel="stylesheet" />
` : "";
  return `import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "${options.projectName}",
  description: "Application configured with NexoreUI and Tailwind CSS v4",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"${htmlClass}
      data-density="${options.density}"
      data-animation="${options.animation}"
      suppressHydrationWarning
    >
      <head>
${fontHead}        <script dangerouslySetInnerHTML={{ __html: ${JSON.stringify(initScript)} }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
`;
}
function buildNextPagesDocument(options) {
  const cfg = FONT_CONFIGS[options.font] || FONT_CONFIGS.geist;
  const htmlClass = options.mode === "dark" ? ' className="dark"' : "";
  const initScript = getThemeInitInlineJs(options.mode);
  const fontHead = cfg.googleFontsHref ? `        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="${cfg.googleFontsHref}" rel="stylesheet" />
` : "";
  return `import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      lang="en"${htmlClass}
      data-density="${options.density}"
      data-animation="${options.animation}"
      suppressHydrationWarning
    >
      <Head>
${fontHead}        <script dangerouslySetInnerHTML={{ __html: ${JSON.stringify(initScript)} }} />
      </Head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`;
}
function buildAstroIndexPage(options) {
  const htmlClass = options.mode === "dark" ? ' class="dark"' : "";
  const fontTags = getGoogleFontsTags(options.font);
  const initScript = getThemeInitInlineJs(options.mode);
  return `---
import "../styles/global.css";
import StarterWorkspace from "../components/StarterWorkspace";
---

<!doctype html>
<html lang="en"${htmlClass} data-density="${options.density}" data-animation="${options.animation}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${options.projectName}</title>
${fontTags ? fontTags + "\n" : ""}    <script is:inline>${initScript}</script>
  </head>
  <body class="min-h-screen bg-background text-foreground antialiased">
    <StarterWorkspace client:load />
  </body>
</html>
`;
}
function buildStarterWorkspaceTsx(options) {
  const installed = Array.from(new Set(options.installedComponents)).sort();
  const hasButton = installed.includes("button");
  const hasCard = installed.includes("card");
  const hasInput = installed.includes("input");
  const hasBadge = installed.includes("badge");
  const hasSwitch = installed.includes("switch");
  const isNoAnim = options.animation === "none";
  const fontCfg = FONT_CONFIGS[options.font] || FONT_CONFIGS.geist;
  const addRunner = options.packageManager === "pnpm" ? "pnpm dlx nexoreui add" : options.packageManager === "bun" ? "bunx nexoreui add" : options.packageManager === "yarn" ? "yarn dlx nexoreui add" : "npx nexoreui add";
  const motionReduced = isNoAnim ? "always" : "user";
  const motionTransition = options.animation === "energetic" ? "{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }" : options.animation === "none" ? "{ duration: 0 }" : "{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }";
  const lines = [];
  if (options.includeUseClient) {
    lines.push('"use client";');
    lines.push("");
  }
  lines.push('import { useEffect, useMemo, useState } from "react";');
  lines.push('import { MotionConfig } from "framer-motion";');
  lines.push('import { Check, Copy, Moon, Search, Sun } from "lucide-react";');
  if (hasButton) {
    lines.push(`import { Button } from "${options.importPrefix}/components/ui/button";`);
  }
  if (hasCard) {
    lines.push(
      `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "${options.importPrefix}/components/ui/card";`
    );
  }
  if (hasInput) {
    lines.push(`import { Input } from "${options.importPrefix}/components/ui/input";`);
  }
  if (hasBadge) {
    lines.push(`import { Badge } from "${options.importPrefix}/components/ui/badge";`);
  }
  if (hasSwitch) {
    lines.push(`import { Switch } from "${options.importPrefix}/components/ui/switch";`);
  }
  const installedListLiteral = installed.map((id) => `  "${id}"`).join(",\n");
  const animProp = isNoAnim ? " animate={false}" : "";
  const cardOpen = (title, desc, extra) => hasCard ? `<Card hover="none"${animProp} className="rounded-lg border border-border bg-card text-card-foreground shadow-none">
              <CardHeader style={{ padding: "var(--density-padding)" }} className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm font-semibold tracking-tight">${title}</CardTitle>${extra ? "\n                  " + extra : ""}
                </div>
                <CardDescription className="text-xs text-muted-foreground">${desc}</CardDescription>
              </CardHeader>
              <CardContent style={{ padding: "var(--density-padding)", paddingTop: 0 }} className="space-y-4">` : `<section className="rounded-lg border border-border bg-card text-card-foreground">
              <div style={{ padding: "var(--density-padding)" }} className="pb-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">${title}</h2>${extra ? "\n                  " + extra : ""}
                </div>
                <p className="text-xs text-muted-foreground">${desc}</p>
              </div>
              <div style={{ padding: "var(--density-padding)", paddingTop: 0 }} className="space-y-4">`;
  const cardClose = hasCard ? `              </CardContent>
            </Card>` : `              </div>
            </section>`;
  const countBadge = hasBadge ? `<Badge variant="outline" size="sm" className="font-mono tabular-nums">{filtered.length} / {INSTALLED_COMPONENTS.length}</Badge>` : `<span className="inline-flex items-center rounded-sm border border-border px-2 py-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">{filtered.length} / {INSTALLED_COMPONENTS.length}</span>`;
  const searchField = hasInput ? `<div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={setQuery}
                    placeholder="Filter installed components"
                    aria-label="Filter installed components"${animProp}
                    className="pl-8 text-xs"
                  />
                </div>` : `<div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Filter installed components"
                    aria-label="Filter installed components"
                    className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  />
                </div>`;
  const buttonsDemo = hasButton ? `<div className="grid grid-cols-2 gap-2">
                  <Button size="sm"${animProp} onClick={() => setActiveAction("Primary")}>Primary</Button>
                  <Button size="sm" variant="secondary"${animProp} onClick={() => setActiveAction("Secondary")}>Secondary</Button>
                  <Button size="sm" variant="outline"${animProp} onClick={() => setActiveAction("Outline")}>Outline</Button>
                  <Button size="sm" variant="ghost"${animProp} onClick={() => setActiveAction("Ghost")}>Ghost</Button>
                </div>` : `<div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setActiveAction("Primary")} className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Primary</button>
                  <button type="button" onClick={() => setActiveAction("Secondary")} className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-secondary px-3 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Secondary</button>
                  <button type="button" onClick={() => setActiveAction("Outline")} className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Outline</button>
                  <button type="button" onClick={() => setActiveAction("Ghost")} className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Ghost</button>
                </div>`;
  const switchBlock = hasSwitch ? `                <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium text-foreground">Dark appearance</p>
                    <p className="text-[11px] text-muted-foreground">Switches class on document root</p>
                  </div>
                  <Switch
                    checked={isDark}
                    onCheckedChange={(checked) => applyMode(Boolean(checked))}
                    aria-label="Toggle dark appearance"
                  />
                </div>
` : "";
  lines.push("");
  lines.push("interface ConfigSpec {");
  lines.push("  readonly label: string;");
  lines.push("  readonly value: string;");
  lines.push("  readonly swatch?: boolean;");
  lines.push("}");
  lines.push("");
  lines.push("interface TokenRow {");
  lines.push("  readonly name: string;");
  lines.push("  readonly sampleClass: string;");
  lines.push("}");
  lines.push("");
  lines.push("const INSTALLED_COMPONENTS: readonly string[] = [");
  if (installedListLiteral) {
    lines.push(installedListLiteral);
  }
  lines.push("] as const;");
  lines.push("");
  lines.push("const TOKEN_ROWS: readonly TokenRow[] = [");
  lines.push('  { name: "primary", sampleClass: "bg-primary text-primary-foreground" },');
  lines.push('  { name: "secondary", sampleClass: "bg-secondary text-secondary-foreground" },');
  lines.push('  { name: "muted", sampleClass: "bg-muted text-muted-foreground" },');
  lines.push('  { name: "destructive", sampleClass: "bg-destructive text-destructive-foreground" },');
  lines.push("] as const;");
  lines.push("");
  lines.push(`const ADD_COMMAND = "${addRunner} <component>";`);
  lines.push("");
  lines.push("export default function App() {");
  lines.push(`  const [isDark, setIsDark] = useState(${options.mode === "dark" ? "true" : "false"});`);
  lines.push('  const [query, setQuery] = useState("");');
  lines.push("  const [copied, setCopied] = useState(false);");
  lines.push('  const [activeAction, setActiveAction] = useState("Primary");');
  lines.push("");
  lines.push("  useEffect(() => {");
  lines.push('    setIsDark(document.documentElement.classList.contains("dark"));');
  lines.push("  }, []);");
  lines.push("");
  lines.push("  const applyMode = (nextDark: boolean) => {");
  lines.push("    setIsDark(nextDark);");
  lines.push('    document.documentElement.classList.toggle("dark", nextDark);');
  lines.push("    try {");
  lines.push('      localStorage.setItem("nexore-theme", nextDark ? "dark" : "light");');
  lines.push("    } catch {}");
  lines.push("  };");
  lines.push("");
  lines.push("  const handleCopyCommand = async () => {");
  lines.push("    try {");
  lines.push("      await navigator.clipboard.writeText(ADD_COMMAND);");
  lines.push("      setCopied(true);");
  lines.push("      window.setTimeout(() => setCopied(false), 1800);");
  lines.push("    } catch {}");
  lines.push("  };");
  lines.push("");
  lines.push("  const filtered = useMemo(() => {");
  lines.push("    const q = query.trim().toLowerCase();");
  lines.push("    if (!q) return INSTALLED_COMPONENTS;");
  lines.push("    return INSTALLED_COMPONENTS.filter((item) => item.toLowerCase().includes(q));");
  lines.push("  }, [query]);");
  lines.push("");
  lines.push("  const specs: readonly ConfigSpec[] = [");
  lines.push(`    { label: "Theme", value: "${options.theme}", swatch: true },`);
  lines.push(`    { label: "Radius", value: "${options.radius}rem" },`);
  lines.push(`    { label: "Font", value: "${fontCfg.label}" },`);
  lines.push(`    { label: "Density", value: "${options.density}" },`);
  lines.push(`    { label: "Motion", value: "${options.animation}" },`);
  lines.push(`    { label: "Mode", value: isDark ? "dark" : "light" },`);
  lines.push("  ];");
  lines.push("");
  lines.push("  return (");
  lines.push(`    <MotionConfig reducedMotion="${motionReduced}" transition={${motionTransition}}>`);
  lines.push('      <div className="min-h-screen bg-background text-foreground">');
  lines.push('        <header className="h-14 border-b border-border bg-background">');
  lines.push('          <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-5">');
  lines.push('            <div className="flex items-center gap-3 min-w-0">');
  lines.push(`              <span className="truncate text-sm font-semibold tracking-tight text-foreground">${options.projectName}</span>`);
  lines.push(`              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-muted-foreground">${options.frameworkLabel}</span>`);
  lines.push("            </div>");
  lines.push('            <div className="flex items-center gap-3">');
  lines.push("              <a");
  lines.push('                href="https://www.nexoreui.com/docs"');
  lines.push('                target="_blank"');
  lines.push('                rel="noopener noreferrer"');
  lines.push('                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm px-1.5 py-1"');
  lines.push("              >");
  lines.push("                Docs");
  lines.push("              </a>");
  lines.push("              <button");
  lines.push('                type="button"');
  lines.push("                onClick={() => applyMode(!isDark)}");
  lines.push('                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}');
  lines.push('                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"');
  lines.push("              >");
  lines.push('                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}');
  lines.push("              </button>");
  lines.push("            </div>");
  lines.push("          </div>");
  lines.push("        </header>");
  lines.push("");
  lines.push('        <main className="mx-auto max-w-5xl px-5 py-10 sm:py-12">');
  lines.push('          <div className="flex flex-col" style={{ gap: "var(--density-gap)" }}>');
  lines.push('            <div className="space-y-1.5 pb-2">');
  lines.push('              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.035em] text-foreground [text-wrap:balance]">');
  lines.push(`                ${options.projectName}`);
  lines.push("              </h1>");
  lines.push('              <p className="text-sm text-muted-foreground max-w-xl">');
  lines.push('                Start editing{" "}');
  lines.push(`                <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">${options.entryFile}</code>{" "}`);
  lines.push('                or adjust theme tokens in{" "}');
  lines.push('                <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">nexore.json</code>.');
  lines.push("              </p>");
  lines.push("            </div>");
  lines.push("");
  lines.push("            <section");
  lines.push('              aria-label="Project configuration"');
  lines.push('              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"');
  lines.push('              style={{ gap: "var(--density-gap)" }}');
  lines.push("            >");
  lines.push("              {specs.map((spec) => (");
  lines.push("                <div");
  lines.push("                  key={spec.label}");
  lines.push('                  className="rounded-lg border border-border bg-card"');
  lines.push('                  style={{ padding: "var(--density-padding)" }}');
  lines.push("                >");
  lines.push('                  <div className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted-foreground">');
  lines.push("                    {spec.label}");
  lines.push("                  </div>");
  lines.push('                  <div className="mt-1.5 flex items-center gap-2 text-sm font-medium tabular-nums text-foreground">');
  lines.push("                    {spec.swatch && (");
  lines.push('                      <span className="h-3 w-3 shrink-0 rounded-sm bg-primary border border-border" />');
  lines.push("                    )}");
  lines.push('                    <span className="truncate">{spec.value}</span>');
  lines.push("                  </div>");
  lines.push("                </div>");
  lines.push("              ))}");
  lines.push("            </section>");
  lines.push("");
  lines.push("            <div");
  lines.push('              className="grid grid-cols-1 lg:grid-cols-12 items-start"');
  lines.push('              style={{ gap: "var(--density-gap)" }}');
  lines.push("            >");
  lines.push('              <div className="lg:col-span-7">');
  lines.push(`                ${cardOpen("Installed components", `Files generated in ${options.componentsDir}/`, countBadge)}`);
  lines.push(`                ${searchField}`);
  lines.push("                {filtered.length > 0 ? (");
  lines.push('                  <ul className="grid max-h-64 grid-cols-1 sm:grid-cols-2 gap-1.5 overflow-y-auto pr-1">');
  lines.push("                    {filtered.map((item) => (");
  lines.push("                      <li");
  lines.push("                        key={item}");
  lines.push('                        className="flex items-center justify-between rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground"');
  lines.push("                      >");
  lines.push('                        <span className="truncate">{item}</span>');
  lines.push('                        <span className="ml-2 shrink-0 text-[11px] text-muted-foreground">.tsx</span>');
  lines.push("                      </li>");
  lines.push("                    ))}");
  lines.push("                  </ul>");
  lines.push("                ) : (");
  lines.push('                  <p className="rounded-md border border-border bg-muted/40 px-3 py-4 text-xs text-muted-foreground">');
  lines.push("                    No installed components match this filter.");
  lines.push("                  </p>");
  lines.push("                )}");
  lines.push('                <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">');
  lines.push('                  <code className="truncate font-mono text-xs text-foreground">{ADD_COMMAND}</code>');
  lines.push("                  <button");
  lines.push('                    type="button"');
  lines.push("                    onClick={handleCopyCommand}");
  lines.push('                    className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"');
  lines.push("                  >");
  lines.push('                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}');
  lines.push('                    <span>{copied ? "Copied" : "Copy"}</span>');
  lines.push("                  </button>");
  lines.push("                </div>");
  lines.push(`${cardClose}`);
  lines.push("              </div>");
  lines.push("");
  lines.push('              <div className="lg:col-span-5">');
  lines.push(`                ${cardOpen("Tokens and controls", "Verify contrast and component styling in light and dark mode")}`);
  lines.push(`                ${buttonsDemo}`);
  lines.push('                <div className="flex items-center justify-between border-t border-border pt-3 text-xs">');
  lines.push('                  <span className="text-muted-foreground">Selected variant</span>');
  lines.push('                  <span className="font-mono text-foreground">{activeAction}</span>');
  lines.push("                </div>");
  if (switchBlock) {
    lines.push(switchBlock.trimEnd());
  }
  lines.push('                <div className="grid grid-cols-2 gap-2 pt-1">');
  lines.push("                  {TOKEN_ROWS.map((token) => (");
  lines.push("                    <div");
  lines.push("                      key={token.name}");
  lines.push("                      className={`rounded-md px-2.5 py-2 font-mono text-[11px] font-medium ${token.sampleClass}`}");
  lines.push("                    >");
  lines.push("                      --{token.name}");
  lines.push("                    </div>");
  lines.push("                  ))}");
  lines.push("                </div>");
  lines.push(`${cardClose}`);
  lines.push("              </div>");
  lines.push("            </div>");
  lines.push("          </div>");
  lines.push("        </main>");
  lines.push("      </div>");
  lines.push("    </MotionConfig>");
  lines.push("  );");
  lines.push("}");
  lines.push("");
  return lines.join("\n");
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
  const packageManager = options.pm || project.packageManager;
  console.log(`\x1B[32mOK Detected Project:\x1B[0m ${project.projectType.toUpperCase()} (${packageManager})`);
  let theme = (options.theme || "slate").toLowerCase();
  if (!THEME_PALETTES[theme]) theme = "slate";
  let radius = options.radius || "0.625";
  const font = (options.font || "geist").toLowerCase();
  const density = (options.density || "default").toLowerCase();
  const animation = (options.animation || "subtle").toLowerCase();
  const mode = (options.mode || "system").toLowerCase();
  const isRemix = project.projectType === "remix" || options.framework === "remix";
  const isAstro = project.projectType === "astro" || options.framework === "astro";
  const isNextPages = options.framework === "next-pages" || project.projectType === "next" && project.isNextPagesRouter;
  const defaultComponentsDir = isRemix ? "app/components/ui" : project.hasSrcDir ? "src/components/ui" : "components/ui";
  const defaultUtilsFile = isRemix ? "app/lib/utils.ts" : project.hasSrcDir ? "src/lib/utils.ts" : "lib/utils.ts";
  let defaultCssFile = "src/index.css";
  if (isAstro) {
    defaultCssFile = "src/styles/global.css";
  } else if (isRemix) {
    defaultCssFile = "app/tailwind.css";
  } else if (isNextPages) {
    defaultCssFile = project.hasSrcDir ? "src/styles/globals.css" : "styles/globals.css";
  } else if (project.projectType === "next" || options.framework === "next" || options.framework === "next-app") {
    defaultCssFile = project.hasSrcDir ? "src/app/globals.css" : "app/globals.css";
  } else {
    defaultCssFile = project.hasSrcDir ? "src/index.css" : "index.css";
  }
  let componentsDir = defaultComponentsDir;
  let utilsFile = defaultUtilsFile;
  if (!options.yes) {
    if (!options.theme) {
      const themeAns = await askQuestion2(
        `Which color theme would you like to use? (slate, zinc, indigo, violet, emerald, rose, amber, orange, cyan, sky, neon, crimson) [default: slate]: `
      );
      if (themeAns.trim() && THEME_PALETTES[themeAns.trim().toLowerCase()]) {
        theme = themeAns.trim().toLowerCase();
      }
    }
    if (!options.radius) {
      const radiusAns = await askQuestion2(
        `Which radius value would you like to use? (0, 0.3, 0.5, 0.625, 0.75, 1.0) [default: 0.625]: `
      );
      if (radiusAns.trim()) {
        radius = radiusAns.trim();
      }
    }
    const compAns = await askQuestion2(
      `Where should UI components be created? (default: ${defaultComponentsDir}): `
    );
    if (compAns.trim()) componentsDir = compAns.trim();
    const utilsAns = await askQuestion2(
      `Where should utility functions (cn helper) be placed? (default: ${defaultUtilsFile}): `
    );
    if (utilsAns.trim()) utilsFile = utilsAns.trim();
  }
  const absoluteComponentsDir = path6.resolve(project.baseDir, componentsDir);
  const absoluteUtilsFile = path6.resolve(project.baseDir, utilsFile);
  ensureDir(absoluteComponentsDir);
  ensureCnUtil(absoluteUtilsFile);
  const didUpdateAlias = ensurePathAlias(project.baseDir, project.projectType, project.hasSrcDir);
  if (didUpdateAlias) {
    const aliasLabel = isRemix ? "~/*" : "@/*";
    console.log(`\x1B[32mOK\x1B[0m Configured path alias \x1B[1m'${aliasLabel}'\x1B[0m in project config`);
  }
  const didInjectCss = injectThemeCss(
    project.baseDir,
    defaultCssFile,
    theme,
    radius,
    font,
    density,
    animation,
    Boolean(options.replaceCss)
  );
  if (didInjectCss) {
    console.log(`\x1B[32mOK\x1B[0m Injected Tailwind CSS v4 tokens into \x1B[1m${defaultCssFile}\x1B[0m`);
  }
  const indexHtmlPath = path6.join(project.baseDir, "index.html");
  if (fs6.existsSync(indexHtmlPath)) {
    try {
      let html = fs6.readFileSync(indexHtmlPath, "utf8");
      html = html.replace(/<html(\s+[^>]*)?>/i, (match) => {
        let updated = match;
        if (mode === "dark") {
          if (updated.includes('class="')) {
            if (!updated.includes("dark")) {
              updated = updated.replace('class="', 'class="dark ');
            }
          } else {
            updated = updated.replace("<html", '<html class="dark"');
          }
        }
        if (!updated.includes("data-density=")) {
          updated = updated.replace(/>$/, ` data-density="${density}">`);
        }
        if (!updated.includes("data-animation=")) {
          updated = updated.replace(/>$/, ` data-animation="${animation}">`);
        }
        return updated;
      });
      const fontTags = getGoogleFontsTags(font);
      if (fontTags && !html.includes("fonts.googleapis.com")) {
        html = html.replace("</head>", `${fontTags}
  </head>`);
      }
      if (!html.includes("nexore-theme")) {
        const initScript = getThemeInitInlineJs(mode);
        html = html.replace("</head>", `    <script>${initScript}</script>
  </head>`);
      }
      fs6.writeFileSync(indexHtmlPath, html, "utf8");
    } catch {
    }
  }
  if (options.install !== false) {
    installPeerDependencies(project.baseDir, packageManager);
  }
  const aliasPrefix = isRemix ? "~/" : "@/";
  const stripRootPrefix = isRemix ? /^app\// : /^src\//;
  const config = {
    $schema: "https://www.nexoreui.com/schema.json",
    style: "default",
    theme,
    radius: Number(radius),
    framework: options.framework || project.projectType,
    packageManager,
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
      components: `${aliasPrefix}${componentsDir.replace(stripRootPrefix, "")}`,
      utils: `${aliasPrefix}${utilsFile.replace(stripRootPrefix, "").replace(/\.(ts|js)$/, "")}`
    }
  };
  const configPath = path6.join(project.baseDir, "nexore.json");
  fs6.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf8");
  console.log(`\x1B[32mOK\x1B[0m Generated \x1B[1mnexore.json\x1B[0m (Theme: ${theme}, Radius: ${radius}rem, Font: ${font}, Density: ${density}, Motion: ${animation})`);
  console.log(`\x1B[32mOK\x1B[0m Utilities ready at \x1B[1m${utilsFile}\x1B[0m`);
  console.log(`\x1B[32mOK\x1B[0m Components directory ready at \x1B[1m${componentsDir}\x1B[0m`);
  console.log(`
\x1B[32m\x1B[1mNexoreUI initialized. Add components with:\x1B[0m`);
  console.log(`  \x1B[36mnpx nexoreui add button card dialog --all\x1B[0m
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
var VALID_PMS = ["npm", "pnpm", "yarn", "bun"];
function resolvePackageManager(rawPm) {
  const normalized = (rawPm || "").toLowerCase();
  if (VALID_PMS.includes(normalized)) return normalized;
  return detectPackageManagerFromEnv() || "npm";
}
function getPmCommands(pm) {
  switch (pm) {
    case "pnpm":
      return {
        install: "pnpm install",
        add: "pnpm add",
        addDev: "pnpm add -D",
        dev: "pnpm dev",
        addRunner: "pnpm dlx nexoreui add",
        nextFlag: "--use-pnpm"
      };
    case "yarn":
      return {
        install: "yarn install",
        add: "yarn add",
        addDev: "yarn add -D",
        dev: "yarn dev",
        addRunner: "yarn dlx nexoreui add",
        nextFlag: "--use-yarn"
      };
    case "bun":
      return {
        install: "bun install",
        add: "bun add",
        addDev: "bun add -d",
        dev: "bun run dev",
        addRunner: "bunx nexoreui add",
        nextFlag: "--use-bun"
      };
    case "npm":
    default:
      return {
        install: "npm install --legacy-peer-deps",
        add: "npm install --legacy-peer-deps",
        addDev: "npm install -D --legacy-peer-deps",
        dev: "npm run dev",
        addRunner: "npx nexoreui add",
        nextFlag: "--use-npm"
      };
  }
}
async function createCommand(projectName, options = {}) {
  const rawName = projectName || "my-nexore-app";
  const name = rawName.trim().replace(/[^a-zA-Z0-9._-]/g, "-").replace(/^-+|-+$/g, "") || "my-nexore-app";
  const rawFramework = (options.framework || options.template || "vite").toLowerCase();
  if (!VALID_FRAMEWORKS.includes(rawFramework)) {
    console.error(
      `\x1B[31mError: Unsupported framework "${rawFramework}". Valid frameworks: vite, next, next-pages, remix, astro, turbo\x1B[0m`
    );
    return;
  }
  const framework = rawFramework;
  const pm = resolvePackageManager(options.pm);
  const pmCmds = getPmCommands(pm);
  const theme = (options.theme || "slate").toLowerCase();
  const radius = options.radius || "0.625";
  const font = (options.font || "geist").toLowerCase();
  const density = (options.density || "default").toLowerCase();
  const animation = (options.animation || "subtle").toLowerCase();
  const mode = (options.mode || "system").toLowerCase();
  const targetDir = path7.resolve(process.cwd(), name);
  console.log(
    `
\x1B[36m\x1B[1mCreating a new NexoreUI project:\x1B[0m \x1B[32m${name}\x1B[0m (${framework}, ${pm})
`
  );
  if (fs7.existsSync(targetDir) && fs7.readdirSync(targetDir).length > 0) {
    console.error(`\x1B[31mError: Target directory ${name} already exists and is not empty.\x1B[0m`);
    return;
  }
  console.log(`\x1B[33mStep 1/4: Scaffolding project with ${framework}...\x1B[0m`);
  try {
    if (framework === "next" || framework === "next-app") {
      (0, import_child_process3.execSync)(
        `npx -y create-next-app@latest ${name} --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" ${pmCmds.nextFlag} --yes`,
        { stdio: "inherit" }
      );
    } else if (framework === "next-pages") {
      (0, import_child_process3.execSync)(
        `npx -y create-next-app@latest ${name} --typescript --tailwind --eslint --no-app --src-dir=false --import-alias="@/*" ${pmCmds.nextFlag} --yes`,
        { stdio: "inherit" }
      );
    } else if (framework === "astro") {
      (0, import_child_process3.execSync)(
        `npx -y create-astro@latest ${name} --template minimal --no-install --no-git --typescript strict`,
        { stdio: "inherit" }
      );
    } else if (framework === "remix") {
      (0, import_child_process3.execSync)(
        `npx -y create-remix@latest ${name} --template remix-run/remix/templates/remix --typescript --no-install`,
        { stdio: "inherit" }
      );
    } else if (framework === "turbo" || framework === "monorepo") {
      (0, import_child_process3.execSync)(`npx -y create-turbo@latest ${name} --example basic --no-deps`, {
        stdio: "inherit"
      });
    } else {
      (0, import_child_process3.execSync)(
        `npx -y create-vite@latest ${name} --template react-ts --no-immediate --no-interactive`,
        { stdio: "inherit" }
      );
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`\x1B[31mFailed to scaffold ${framework} project: ${errorMsg}\x1B[0m`);
    return;
  }
  const isMonorepo = framework === "turbo" || framework === "monorepo";
  const appDir = isMonorepo && fs7.existsSync(path7.join(targetDir, "apps", "web")) ? path7.join(targetDir, "apps", "web") : targetDir;
  process.chdir(appDir);
  console.log(`
\x1B[33mStep 2/4: Installing NexoreUI dependencies...\x1B[0m`);
  try {
    if (framework === "vite") {
      (0, import_child_process3.execSync)(
        `${pmCmds.add} lucide-react clsx tailwind-merge framer-motion class-variance-authority @tailwindcss/vite tailwindcss`,
        { stdio: "inherit", cwd: appDir }
      );
      (0, import_child_process3.execSync)(`${pmCmds.addDev} @types/node`, { stdio: "inherit", cwd: appDir });
    } else if (framework === "astro") {
      (0, import_child_process3.execSync)(
        `${pmCmds.add} @astrojs/react @tailwindcss/vite tailwindcss react react-dom lucide-react clsx tailwind-merge framer-motion class-variance-authority`,
        { stdio: "inherit", cwd: appDir }
      );
      (0, import_child_process3.execSync)(`${pmCmds.addDev} @types/react @types/react-dom @types/node`, {
        stdio: "inherit",
        cwd: appDir
      });
    } else if (framework === "remix") {
      (0, import_child_process3.execSync)(pmCmds.install, { stdio: "inherit", cwd: appDir });
      (0, import_child_process3.execSync)(
        `${pmCmds.add} lucide-react clsx tailwind-merge framer-motion class-variance-authority tailwindcss @tailwindcss/vite`,
        { stdio: "inherit", cwd: appDir }
      );
    } else {
      (0, import_child_process3.execSync)(
        `${pmCmds.add} lucide-react clsx tailwind-merge framer-motion class-variance-authority`,
        { stdio: "inherit", cwd: appDir }
      );
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`\x1B[33mWarning during dependency installation: ${errorMsg}\x1B[0m`);
  }
  console.log(`
\x1B[33mStep 3/4: Configuring theme and design tokens...\x1B[0m`);
  await initCommand({
    yes: true,
    theme,
    radius,
    font,
    density,
    animation,
    mode,
    framework: isMonorepo ? "next-app" : framework,
    pm,
    install: false,
    replaceCss: true
  });
  const requestedComponents = options.components && options.components.length > 0 ? options.components : ["button", "card", "input", "badge", "switch"];
  if (options.all) {
    console.log(`
\x1B[33mStep 4/4: Adding all NexoreUI registry components...\x1B[0m`);
  } else {
    console.log(
      `
\x1B[33mStep 4/4: Adding selected UI components (${requestedComponents.join(", ")})...\x1B[0m`
    );
  }
  let installedComponents = [];
  try {
    installedComponents = await addCommand(options.all ? [] : requestedComponents, {
      yes: true,
      all: Boolean(options.all),
      pm
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(
      `\x1B[33mNotice: Could not install components (${errorMsg}). Run "${pmCmds.addRunner} ${requestedComponents.join(" ")}" manually.\x1B[0m`
    );
  }
  if (framework === "vite") {
    const appTsxPath = path7.join(appDir, "src", "App.tsx");
    const starterCode = buildStarterWorkspaceTsx({
      projectName: name,
      frameworkLabel: "Vite + React",
      entryFile: "src/App.tsx",
      componentsDir: "src/components/ui",
      importPrefix: "@",
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      packageManager: pm,
      installedComponents,
      includeUseClient: false
    });
    try {
      fs7.writeFileSync(appTsxPath, starterCode, "utf8");
      fs7.writeFileSync(
        path7.join(appDir, "index.html"),
        buildViteIndexHtml({ projectName: name, font, density, animation, mode }),
        "utf8"
      );
      const appCssPath = path7.join(appDir, "src", "App.css");
      if (fs7.existsSync(appCssPath)) {
        fs7.unlinkSync(appCssPath);
      }
    } catch {
    }
  } else if (framework === "next" || framework === "next-app" || isMonorepo) {
    const appFolder = fs7.existsSync(path7.join(appDir, "src", "app")) ? path7.join(appDir, "src", "app") : path7.join(appDir, "app");
    const componentsDirLabel = fs7.existsSync(path7.join(appDir, "src")) ? "src/components/ui" : "components/ui";
    const entryFileLabel = fs7.existsSync(path7.join(appDir, "src", "app")) ? "src/app/page.tsx" : "app/page.tsx";
    const starterCode = buildStarterWorkspaceTsx({
      projectName: name,
      frameworkLabel: isMonorepo ? "Turborepo + Next.js" : "Next.js App Router",
      entryFile: entryFileLabel,
      componentsDir: componentsDirLabel,
      importPrefix: "@",
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      packageManager: pm,
      installedComponents,
      includeUseClient: true
    });
    try {
      if (fs7.existsSync(appFolder)) {
        fs7.writeFileSync(
          path7.join(appFolder, "layout.tsx"),
          buildNextAppLayout({ projectName: name, font, density, animation, mode }),
          "utf8"
        );
        fs7.writeFileSync(path7.join(appFolder, "page.tsx"), starterCode, "utf8");
      }
    } catch {
    }
  } else if (framework === "next-pages") {
    const pagesFolder = fs7.existsSync(path7.join(appDir, "src", "pages")) ? path7.join(appDir, "src", "pages") : path7.join(appDir, "pages");
    const componentsDirLabel = fs7.existsSync(path7.join(appDir, "src")) ? "src/components/ui" : "components/ui";
    const entryFileLabel = fs7.existsSync(path7.join(appDir, "src", "pages")) ? "src/pages/index.tsx" : "pages/index.tsx";
    const starterCode = buildStarterWorkspaceTsx({
      projectName: name,
      frameworkLabel: "Next.js Pages Router",
      entryFile: entryFileLabel,
      componentsDir: componentsDirLabel,
      importPrefix: "@",
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      packageManager: pm,
      installedComponents,
      includeUseClient: false
    });
    try {
      if (fs7.existsSync(pagesFolder)) {
        fs7.writeFileSync(
          path7.join(pagesFolder, "_document.tsx"),
          buildNextPagesDocument({ font, density, animation, mode }),
          "utf8"
        );
        fs7.writeFileSync(path7.join(pagesFolder, "index.tsx"), starterCode, "utf8");
      }
    } catch {
    }
  } else if (framework === "astro") {
    const compPath = path7.join(appDir, "src", "components", "StarterWorkspace.tsx");
    const indexAstroPath = path7.join(appDir, "src", "pages", "index.astro");
    const starterCode = buildStarterWorkspaceTsx({
      projectName: name,
      frameworkLabel: "Astro + React",
      entryFile: "src/components/StarterWorkspace.tsx",
      componentsDir: "src/components/ui",
      importPrefix: "@",
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      packageManager: pm,
      installedComponents,
      includeUseClient: false
    });
    try {
      fs7.mkdirSync(path7.dirname(compPath), { recursive: true });
      fs7.writeFileSync(compPath, starterCode, "utf8");
      fs7.mkdirSync(path7.dirname(indexAstroPath), { recursive: true });
      fs7.writeFileSync(
        indexAstroPath,
        buildAstroIndexPage({ projectName: name, font, density, animation, mode }),
        "utf8"
      );
    } catch {
    }
  } else if (framework === "remix") {
    const routePath = path7.join(appDir, "app", "routes", "_index.tsx");
    const starterCode = buildStarterWorkspaceTsx({
      projectName: name,
      frameworkLabel: "Remix",
      entryFile: "app/routes/_index.tsx",
      componentsDir: "app/components/ui",
      importPrefix: "~",
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      packageManager: pm,
      installedComponents,
      includeUseClient: false
    });
    try {
      fs7.mkdirSync(path7.dirname(routePath), { recursive: true });
      fs7.writeFileSync(routePath, starterCode, "utf8");
    } catch {
    }
  }
  console.log(`
\x1B[32m\x1B[1mProject ${name} is ready.\x1B[0m
`);
  console.log(`Next steps:`);
  console.log(`  \x1B[36mcd ${name}\x1B[0m`);
  console.log(`  \x1B[36m${pmCmds.dev}\x1B[0m
`);
  console.log(`Add more components anytime:`);
  console.log(`  \x1B[36m${pmCmds.addRunner} <component>\x1B[0m
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
      console.log("Get a license at: \x1B[36mhttps://www.nexoreui.com/pricing\x1B[0m\n");
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
    console.log("You can purchase a NexoreUI Pro license at: \x1B[36mhttps://www.nexoreui.com/pricing\x1B[0m\n");
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
    let pm;
    let all = false;
    const components = [];
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
      } else if (arg === "--pm" && args[i + 1]) {
        pm = args[++i];
      } else if (arg.startsWith("--pm=")) {
        pm = arg.split("=")[1];
      } else if (arg === "--all" || arg === "-a") {
        all = true;
      } else if ((arg === "--components" || arg === "-c") && args[i + 1]) {
        const val = args[++i];
        components.push(
          ...val.split(",").map((s) => s.trim()).filter(Boolean)
        );
        while (projectName && args[i + 1] && !args[i + 1].startsWith("-")) {
          components.push(
            ...args[++i].split(",").map((s) => s.trim()).filter(Boolean)
          );
        }
      } else if (arg.startsWith("--components=")) {
        const val = arg.slice("--components=".length);
        components.push(
          ...val.split(",").map((s) => s.trim()).filter(Boolean)
        );
      } else if (!arg.startsWith("-") && !projectName) {
        projectName = arg;
      }
    }
    await createCommand(projectName, {
      framework,
      theme,
      radius,
      font,
      density,
      animation,
      mode,
      pm,
      all,
      components: components.length > 0 ? components : void 0
    });
  } else if (command2 === "init") {
    let yes = false;
    let theme;
    let radius;
    let font;
    let density;
    let animation;
    let mode;
    let framework;
    let pm;
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === "-y" || arg === "--yes") {
        yes = true;
      } else if (arg === "--framework" && args[i + 1]) {
        framework = args[++i];
      } else if (arg.startsWith("--framework=")) {
        framework = arg.split("=")[1];
      } else if (arg === "--pm" && args[i + 1]) {
        pm = args[++i];
      } else if (arg.startsWith("--pm=")) {
        pm = arg.split("=")[1];
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
    await initCommand({ yes, theme, radius, font, density, animation, mode, framework, pm });
  } else if (command2 === "list") {
    listCommand();
  } else if (command2 === "add") {
    const components = [];
    let yes = false;
    let all = false;
    let pm;
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === "-y" || arg === "--yes") {
        yes = true;
      } else if (arg === "--all" || arg === "-a") {
        all = true;
      } else if (arg === "--pm" && args[i + 1]) {
        pm = args[++i];
      } else if (arg.startsWith("--pm=")) {
        pm = arg.split("=")[1];
      } else if (!arg.startsWith("-")) {
        components.push(arg);
      }
    }
    await addCommand(components, { yes, all, pm });
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
\x1B[90mReact components and Tailwind CSS v4 theme setup\x1B[0m

Usage:
  npx nexoreui [command] [options]

Commands:
  \x1B[32mcreate [name]\x1B[0m        Create a new configured NexoreUI project
  \x1B[32minit\x1B[0m                 Initialize NexoreUI in an existing project
  \x1B[32madd [components...]\x1B[0m  Add components to your project (use --all for all 77 components)
  \x1B[32mauth [key]\x1B[0m           Authenticate your NexoreUI Pro license key (--status, --logout)
  \x1B[32mlist\x1B[0m                 List all available components in registry

Options:
  \x1B[33m--framework <name>\x1B[0m   Framework (vite, next, next-pages, remix, astro, turbo)
  \x1B[33m--pm <name>\x1B[0m          Package manager (npm, pnpm, yarn, bun)
  \x1B[33m--theme <name>\x1B[0m       Color palette (slate, zinc, indigo, violet, emerald, rose, amber, orange, cyan, sky, neon, crimson)
  \x1B[33m--radius <val>\x1B[0m       Border radius (0, 0.3, 0.5, 0.625, 0.75, 1.0)
  \x1B[33m--font <name>\x1B[0m        Font family (geist, inter, jetbrains, system)
  \x1B[33m--density <val>\x1B[0m      UI density (compact, default, relaxed)
  \x1B[33m--animation <val>\x1B[0m    Animation profile (none, subtle, energetic)
  \x1B[33m--mode <val>\x1B[0m         Default theme mode (system, dark, light)
  \x1B[33m--components <list>\x1B[0m  Comma-separated components to install during create
  \x1B[33m--all, -a\x1B[0m            Install all available components
  \x1B[33m-y, --yes\x1B[0m            Skip prompts and use defaults automatically
  \x1B[33m-h, --help\x1B[0m           Show help information
  `);
}
main().catch((err) => {
  console.error("\x1B[31mAn unexpected error occurred:\x1B[0m", err);
  process.exit(1);
});
//# sourceMappingURL=index.js.map
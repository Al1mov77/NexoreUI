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
var fs3 = __toESM(require("fs"));
var path3 = __toESM(require("path"));
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
    /['"]\.\.\/utils\/cn['"]/g,
    `"${relativeImport}"`
  );
  fs2.writeFileSync(targetFilePath, rewrittenContent, "utf8");
}

// src/registry/button.ts
var button = {
  name: "button",
  dependencies: [
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "button.tsx",
  content: `'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
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
        premium: "bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30",
        neon: "bg-background border-2 border-primary text-foreground shadow-[0_0_var(--glow-radius)_rgba(var(--glow-color),var(--glow-strength))] hover:shadow-[0_0_calc(var(--glow-radius)*1.5)_rgba(var(--glow-color),calc(var(--glow-strength)*1.5))]",
        glass: "backdrop-blur-md bg-zinc-900/10 dark:bg-zinc-100/10 border border-zinc-900/20 dark:border-zinc-100/20 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-900/20 dark:hover:bg-zinc-100/20 shadow-md",
        shimmer: "relative overflow-hidden bg-slate-900 text-white dark:bg-white dark:text-black",
        // New requested variants
        gradient: "bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-indigo-500 dark:via-purple-500 dark:to-violet-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:opacity-95",
        glow: "bg-primary text-primary-foreground shadow-[0_0_var(--glow-radius)_rgba(var(--glow-color),var(--glow-strength))] hover:shadow-[0_0_calc(var(--glow-radius)*1.5)_rgba(var(--glow-color),calc(var(--glow-strength)*1.5))] border border-primary/20",
        magnetic: "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md hover:shadow-lg",
        loading: "bg-primary/80 text-primary-foreground/80 pointer-events-none cursor-wait",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-full",
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
            className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent"
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

    if (!animate) {
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
        "shadow-[0_5px_0_hsl(var(--primary-dark,240_5.9%_30%))] hover:shadow-[0_2px_0_hsl(var(--primary-dark,240_5.9%_30%))] active:translate-y-[3px] active:shadow-[0_0px_0_transparent] transition-all",
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
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
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
        className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
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

// src/registry/modal.ts
var modal = {
  name: "modal",
  dependencies: [
    "@radix-ui/react-dialog",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lucide-react",
    "framer-motion"
  ],
  componentsDependencies: [
    "button"
  ],
  fileName: "modal.tsx",
  content: `"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, AlertTriangle, CheckCircle, Star } from "lucide-react"
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
      "text-xl font-semibold leading-none tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent",
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

// src/registry/card.ts
var card = {
  name: "card",
  dependencies: [
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "card.tsx",
  content: `'use client';

import * as React from "react"
import { cn } from "../utils/cn"
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { Heart, Share2, MapPin, Star } from "lucide-react"

const cardVariants = cva(
  "rounded-2xl text-card-foreground transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border bg-card text-card-foreground shadow-sm hover:shadow-md",
        glass: "backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-lg",
        gradient: "bg-gradient-to-br from-violet-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 shadow-lg shadow-purple-500/5",
        glow: "bg-card border-2 border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.2)]",
        // New variants
        bento: "border border-border/60 bg-gradient-to-br from-card to-muted/20 text-card-foreground shadow-md hover:shadow-lg hover:border-primary/30 relative",
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
            <div className="absolute inset-0 backface-hidden border bg-card text-card-foreground rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
              {children}
            </div>

            {/* Back Face */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 border bg-gradient-to-br from-primary/10 to-primary/5 text-card-foreground rounded-2xl shadow-sm flex flex-col p-6 items-center justify-center text-center overflow-hidden">
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
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: \`radial-gradient(400px circle at \${mousePos.x}px \${mousePos.y}px, \${spotlightColor}, transparent 80%)\`,
        }}
      />
    );

    // Build the resolved element attributes
    const cardClass = cn(cardVariants({ variant, hover: isFlip || isTilt ? "none" : hover, className }), isSpotlight && "group");

    if (animate || isTilt) {
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
    className={cn("font-semibold leading-none tracking-tight text-xl bg-gradient-to-br from-foreground to-foreground/75 bg-clip-text text-transparent", className)}
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

// src/registry/alert.ts
var alert = {
  name: "alert",
  dependencies: [
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "alert.tsx",
  content: `"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils/cn"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Info, CheckCircle2, XCircle, Cookie, BellRing, WifiOff, AlertTriangle, X } from "lucide-react"

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
        gradient: "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-foreground [&>svg]:text-blue-500",
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

// src/registry/badge.ts
var badge = {
  name: "badge",
  dependencies: [
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
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
        gradient: "border-transparent bg-gradient-to-r from-violet-600 to-pink-600 dark:from-violet-500 dark:to-pink-500 text-white shadow-sm",
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
import { motion, HTMLMotionProps } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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
    return (
      <motion.div
        ref={ref}
        animate={spin ? { rotate: [0, 90, 180, 270, 360] } : { rotate: 0 }}
        transition={{ rotate: { duration: spinDuration, repeat: Infinity, ease: 'linear' }, borderRadius: { duration: 0.4 } }}
        className={cn('relative flex items-center justify-center select-none overflow-hidden transition-all duration-300 w-24 h-24', className)}
        style={{ borderRadius: radius || '24%', ...style }}
        {...props}
      >
        <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
          {icon || children || <Sparkles className="w-6 h-6 text-white" />}
        </div>
      </motion.div>
    );
  }
);

MorphingGeometry.displayName = 'MorphingGeometry';
export default MorphingGeometry;
`
};

// src/registry/aurora-border-fx.ts
var auroraBorderFX = {
  name: "aurora-border-fx",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
    "lucide-react"
  ],
  fileName: "aurora-border-fx.tsx",
  content: `'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
        {glow !== 'none' && (
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[85px] pointer-events-none transition-colors duration-500 -z-10"
            style={{
              backgroundColor: currentColor,
              opacity: glowOpacity,
            }}
          />
        )}

        {glow !== 'none' && glow !== 'subtle' && (
          <div
            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[90px] pointer-events-none transition-colors duration-700 -z-10"
            style={{
              backgroundColor: currentColor,
              opacity: glowOpacity * 0.4,
            }}
          />
        )}

        {children ? (
          <div className="relative z-10 w-full h-full">{children}</div>
        ) : (
          <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
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
  name: "auroraSearchPill",
  dependencies: [
    "clsx",
    "tailwind-merge",
    "framer-motion",
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

    // Unique style injection ID for CSS custom property and keyframes
    const instanceId = React.useId().replace(/:/g, '');

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

    const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
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

    return (
      <div
        ref={ref}
        onClick={handleToggle}
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
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        className={cn(
          'relative inline-flex items-center justify-center cursor-pointer select-none isolate outline-none group',
          'transition-transform duration-200 ease-out active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
          className
        )}
        {...props}
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
              'transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]'
            )}
          >
            {/* STATE 1: Pulsing Dots (Idle/Listening) */}
            <div
              className={cn(
                'flex items-center',
                sizeStyle.dotGap,
                'transition-all duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
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
                'transition-all duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
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

// src/registry/template-ai-startup.ts
var templateAiStartup = {
  name: "template-ai-startup",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-ai-startup.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Check,
  ChevronRight,
  Send,
  Terminal,
  Activity,
  Layers,
  Menu,
  X,
  Sliders,
  ShieldCheck,
} from "lucide-react";

export interface AiStartupTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function AiStartupTemplate({
  brandName = "Synthetix AI",
  theme = "dark",
}: AiStartupTemplateProps) {
  
    const isDark = theme === "dark";

  const [selectedModel, setSelectedModel] = useState<"Synthetix-R1" | "Claude-3.5" | "GPT-4o">("Synthetix-R1");
  const [promptText, setPromptText] = useState("Generate an edge-routed vector indexing service");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(
    "\u2713 Graph compiled. 4 regions provisioned. TTFT: 12ms. Throughput: 142 tok/s."
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const promptSuggestions = [
    "Edge vector indexer",
    "Rust WebSocket gateway",
    "Zero-knowledge rollup audit",
  ];

  const handleSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setGeneratedOutput(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedOutput(
        \`\u2713 [\${selectedModel}] execution complete. 2,140 tokens streamed with zero-copy serialization. Global latency: 1.2ms.\`
      );
    }, 850);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans selection:bg-indigo-500/20"
      
    >
      {/* Subtle top indicator bar */}
      <div
        className="w-full py-2.5 px-4 text-center text-xs font-mono border-b transition-colors flex items-center justify-center gap-2"
        
      >
        <span
          className="h-2 w-2 rounded-full"
          
        />
        <span className="font-semibold">Synthetix Core 3.4 Operational</span>
        <span className="opacity-40">\u2022</span>
        <span>Global TTFT: 4.2ms</span>
      </div>

      {/* Navigation */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors"
        
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm transition-all"
              
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-base tracking-tight"
              
            >
              {brandName || "Synthetix AI"}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium"
            
          >
            <a href="#playground" className="hover:text-[#f4f4f7] transition-colors">
              Playground
            </a>
            <a href="#benchmarks" className="hover:text-[#f4f4f7] transition-colors">
              Benchmarks
            </a>
            <a href="#architecture" className="hover:text-[#f4f4f7] transition-colors">
              Architecture
            </a>
            <a href="#pricing" className="hover:text-[#f4f4f7] transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              className="hidden sm:inline-flex text-sm font-medium px-4 py-2 rounded-lg border transition-all hover:opacity-80"
              style={{
                borderColor: "rgba(255, 255, 255, 0.08)",
                backgroundColor: "#12141c",
                color: "#f4f4f7",
                borderRadius: "0.75rem",
              }}
            >
              Sign In
            </button>
            <button
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white shadow-sm transition-all flex items-center gap-1.5 hover:brightness-110"
              
            >
              <span>Get API Key</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border transition-colors"
              style={{
                borderColor: "rgba(255, 255, 255, 0.08)",
                backgroundColor: "#12141c",
                color: "#f4f4f7",
              }}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b px-4 py-3 space-y-2 text-sm font-medium overflow-hidden"
              
            >
              <a
                href="#playground"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-[#f4f4f7]"
                
              >
                Interactive Playground
              </a>
              <a
                href="#benchmarks"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-[#f4f4f7]"
                
              >
                Inference Benchmarks
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-[#f4f4f7]"
                
              >
                Tiered Pricing
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="pt-10 sm:pt-16 md:pt-20 pb-12 md:pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        {/* Subtle pill tag */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-medium mb-6 transition-colors"
          
        >
          <Cpu className="h-3.5 w-3.5"  />
          <span>Next-Generation Autonomous Inference Engine</span>
        </div>

        <h1
          className="text-2xl @xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-[1.12]"
          
        >
          Zero Latency. Real Autonomous Intelligence.
        </h1>

        <p
          className="text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed"
          
        >
          Stream deep reasoning tokens directly to edge clients. Synthesize complex backend architectures,
          fine-tune proprietary weights, and run telemetry without cold starts.
        </p>

        {/* Live Interactive Model Playground Card */}
        <div
          id="playground"
          className="max-w-2xl mx-auto rounded-2xl border p-4 sm:p-6 text-left shadow-lg transition-all"
          
        >
          {/* Header Controls */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b"
            
          >
            <div
              className="inline-flex items-center gap-1 p-1 rounded-lg border text-xs"
              
            >
              {(["Synthetix-R1", "Claude-3.5", "GPT-4o"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  className={\`px-3 py-1.5 rounded-md text-xs font-medium transition-all \${
                    selectedModel === m
                      ? "text-white font-semibold shadow-sm"
                      : "opacity-75 hover:opacity-100"
                  }\`}
                  style={{
                    backgroundColor: selectedModel === m ? "#6366f1" : "transparent",
                    color: selectedModel === m ? "#ffffff" : "#f4f4f7",
                    borderRadius: "calc(0.75rem - 4px)",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            <div
              className="flex items-center gap-2 text-xs font-mono"
              
            >
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-500" />
                <span>1,200 tok/s</span>
              </span>
              <span>\u2022</span>
              <span>Sub-15ms TTFT</span>
            </div>
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleSynthesize} className="space-y-3">
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl border transition-all focus-within:ring-1"
              
            >
              <div className="flex items-center gap-2.5 flex-1 px-1.5">
                <Terminal className="h-4 w-4 shrink-0 opacity-40" />
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Type an inference prompt..."
                  className="w-full bg-transparent text-sm focus:outline-none py-1.5"
                  
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                className="h-10 px-5 rounded-lg text-sm font-semibold text-white shrink-0 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:brightness-110"
                style={{
                  backgroundColor: "#6366f1",
                  borderRadius: "calc(0.75rem - 4px)",
                }}
              >
                {isGenerating ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Synthesize</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt suggestions */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="opacity-50">Quick test:</span>
              {promptSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPromptText(s)}
                  className="px-2.5 py-1 rounded-md border transition-colors truncate max-w-[200px]"
                  
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Generated Output Area */}
            <AnimatePresence>
              {generatedOutput && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 rounded-xl border text-xs leading-relaxed"
                  style={{
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                    color: "#f4f4f7",
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5 text-xs" >
                    <span className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="h-3.5 w-3.5"  />
                      <span>Inference Output</span>
                    </span>
                    <span className="text-emerald-500 font-mono font-semibold">200 OK</span>
                  </div>
                  <p className="font-mono text-xs leading-normal">{generatedOutput}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>

      {/* Benchmarks Section */}
      <section
        id="benchmarks"
        className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto border-t"
        
      >
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            
          >
            Precision Benchmarks
          </p>
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight"
            
          >
            Engineered for Microsecond Precision
          </h2>
        </div>

        {/* Responsive Table / Card View */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: "rgba(255, 255, 255, 0.08)",
            backgroundColor: "#12141c",
            borderRadius: "0.75rem",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left min-w-[500px]">
              <thead
                className="text-xs uppercase font-mono border-b"
                
              >
                <tr>
                  <th className="p-3.5 font-semibold">Model Architecture</th>
                  <th className="p-3.5 font-semibold">TTFT</th>
                  <th className="p-3.5 font-semibold">Throughput</th>
                  <th className="p-3.5 font-semibold">Cold Start</th>
                  <th className="p-3.5 font-semibold text-right">Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y" >
                <tr>
                  <td className="p-3.5 font-semibold flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      
                    />
                    <span>Synthetix R1 Ultra</span>
                  </td>
                  <td className="p-3.5 text-emerald-500 font-bold font-mono">4.2ms</td>
                  <td className="p-3.5 font-mono">280 tok/s</td>
                  <td className="p-3.5 font-mono">0.0ms</td>
                  <td className="p-3.5 text-right font-mono text-emerald-500 font-semibold">180 Regions</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium flex items-center gap-2 opacity-75">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    <span>Claude 3.5 Sonnet Standard</span>
                  </td>
                  <td className="p-3.5 opacity-75 font-mono">28.4ms</td>
                  <td className="p-3.5 opacity-75 font-mono">82 tok/s</td>
                  <td className="p-3.5 opacity-75 font-mono">120ms</td>
                  <td className="p-3.5 text-right opacity-75 font-mono">Single Region</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-medium flex items-center gap-2 opacity-75">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    <span>GPT-4o Baseline</span>
                  </td>
                  <td className="p-3.5 opacity-75 font-mono">34.1ms</td>
                  <td className="p-3.5 opacity-75 font-mono">76 tok/s</td>
                  <td className="p-3.5 opacity-75 font-mono">95ms</td>
                  <td className="p-3.5 text-right opacity-75 font-mono">Dual Region</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t"
        
      >
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2"
            
          >
            Predictable Developer Pricing
          </h2>
          <p className="text-sm" >
            Scale from initial prototype to production scale with clear usage terms.
          </p>

          {/* Billing Cycle Pill Toggle */}
          <div
            className="inline-flex items-center gap-1.5 p-1 mt-5 rounded-full border text-xs"
            
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={\`px-3.5 py-1.5 rounded-full font-medium transition-all \${
                billingCycle === "monthly" ? "shadow-sm font-semibold" : "opacity-70 hover:opacity-100"
              }\`}
              style={{
                backgroundColor: billingCycle === "monthly" ? "#181a24" : "transparent",
                color: "#f4f4f7",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={\`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 \${
                billingCycle === "annual" ? "shadow-sm font-semibold" : "opacity-70 hover:opacity-100"
              }\`}
              style={{
                backgroundColor: billingCycle === "annual" ? "#181a24" : "transparent",
                color: "#f4f4f7",
              }}
            >
              <span>Annual</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                }}
              >
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Starter Tier */}
          <div
            className="p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all"
            style={{
              backgroundColor: "#12141c",
              borderColor: "rgba(255, 255, 255, 0.08)",
              borderRadius: "0.75rem",
              }}
          >
            <div>
              <h3 className="font-bold text-lg mb-1">Developer Starter</h3>
              <p className="text-sm mb-5" >
                For engineers building prototypes and internal agents.
              </p>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-bold font-mono">$0</span>
                <span className="text-sm opacity-60">/ forever free</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>100,000 free tokens / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>3 edge regions access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Community Discord support</span>
                </li>
              </ul>
            </div>
            <button
              className="w-full mt-7 h-11 rounded-xl border text-sm font-semibold hover:opacity-80 transition-all flex items-center justify-center"
              style={{
                borderColor: "rgba(255, 255, 255, 0.08)",
                backgroundColor: "#181a24",
                color: "#f4f4f7",
                borderRadius: "0.75rem",
              }}
            >
              Get Started Free
            </button>
          </div>

          {/* Production Tier */}
          <div
            className="p-6 sm:p-7 rounded-2xl border flex flex-col justify-between relative transition-all"
            style={{
              backgroundColor: "#181a24",
              borderColor: "#6366f1",
              borderRadius: "0.75rem",
              }}
          >
            <span
              className="absolute -top-3 right-5 px-3 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
              
            >
              RECOMMENDED
            </span>
            <div>
              <h3 className="font-bold text-lg mb-1">Production Cluster</h3>
              <p className="text-sm mb-5" >
                For high-throughput AI services with guaranteed latency.
              </p>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-bold font-mono">
                  {billingCycle === "annual" ? "$49" : "$65"}
                </span>
                <span className="text-sm opacity-60">/ month</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>100M tokens + $0.20/M overage</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>180+ global edge locations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Zero data retention guarantee</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Dedicated SLA & priority support</span>
                </li>
              </ul>
            </div>
            <button
              className="w-full mt-7 h-11 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 flex items-center justify-center"
              
            >
              Start 14-Day Production Trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 sm:px-6 border-t text-center text-xs"
        
      >
        <p>\xA9 {new Date().getFullYear()} {brandName || "Synthetix AI"}. All rights reserved.</p>
      </footer>
    </div>
  );
}
`
};

// src/registry/template-modern-saas.ts
var templateModernSaas = {
  name: "template-modern-saas",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-modern-saas.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Command,
  Search,
  GitBranch,
  GitCommit,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  ShieldCheck,
  ChevronRight,
  Layers,
  Terminal,
  MousePointer2,
  Server,
  Activity,
  X,
} from "lucide-react";

export interface ModernSaasTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function ModernSaasTemplate({
  brandName = "Aura Cloud",
  theme = "dark",
}: ModernSaasTemplateProps) {
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"branch" | "edge" | "telemetry">("branch");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [showCursors, setShowCursors] = useState(true);

  const commandItems = [
    { label: "Deploy to Production", category: "Deployments", icon: Zap },
    { label: "Create Ephemeral Preview Branch", category: "Git", icon: GitBranch },
    { label: "Inspect Edge Latency Spikes", category: "Telemetry", icon: Clock },
    { label: "Manage Team Access & RBAC", category: "Security", icon: ShieldCheck },
  ];

  const filteredCommands = commandItems.filter((item) =>
    item.label.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors font-sans selection:bg-primary/20">
      {/* Top Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-border/80 bg-background/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <span className="font-bold text-base tracking-tight">
              {brandName}
            </span>
          </div>

          {/* Quick command search trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted/60 text-muted-foreground text-sm transition-all shadow-xs"
          >
            <Search className="h-4 w-4" />
            <span>Search actions or deployments...</span>
            <kbd className="px-1.5 py-0.5 rounded text-xs font-mono border border-border bg-muted text-foreground">
              \u2318K
            </kbd>
          </button>

          <div className="flex items-center gap-2.5">
            {/* Mobile command trigger button */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="md:hidden p-2 rounded-lg border border-border bg-card text-foreground transition-colors"
              title="Search commands (\u2318K)"
              aria-label="Open Command Menu"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowCursors(!showCursors)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="h-3.5 w-3.5" />
              <span>{showCursors ? "Hide Cursors" : "Show Cursors"}</span>
            </button>

            <button className="text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5">
              <span>Console</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 md:pt-20 pb-12 md:pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center relative">
        {/* Collaborative cursor simulation */}
        {showCursors && (
          <>
            <motion.div
              animate={{ x: [0, 40, 20, 0], y: [0, -20, 15, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute top-28 left-8 hidden xl:flex items-center gap-1.5 pointer-events-none z-20"
            >
              <MousePointer2 className="h-4 w-4 text-emerald-500 fill-emerald-500" />
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-sm">
                sarah.ts (editing)
              </span>
            </motion.div>

            <motion.div
              animate={{ x: [0, -30, -10, 0], y: [0, 25, -10, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="absolute top-44 right-12 hidden xl:flex items-center gap-1.5 pointer-events-none z-20"
            >
              <MousePointer2 className="h-4 w-4 text-primary fill-primary" />
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono border border-primary/30 bg-primary/10 text-primary shadow-sm">
                alex.dev (reviewing)
              </span>
            </motion.div>
          </>
        )}

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-5 transition-colors">
          <GitBranch className="h-3.5 w-3.5" />
          <span>Continuous Edge Infrastructure</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 leading-[1.15]">
          The Developer Cloud for <span className="text-primary">High-Velocity Teams</span>.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Push code, spawn instant ephemeral preview environments, and deploy across global edge nodes
          with zero configuration overhead.
        </p>

        {/* Live CI/CD Pipeline Card */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-4 sm:p-6 text-left shadow-xl transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 mb-4 border-b border-border text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-semibold">prod-edge-gateway #8492</span>
              <span className="text-muted-foreground text-xs font-mono">on main</span>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-semibold">Ready in 1.4s</span>
          </div>

          {/* 3 Pipeline Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="p-3.5 rounded-xl border border-border bg-muted/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">1. Build & Tree Shake</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm font-mono font-semibold">14 bundles (42kb)</p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-muted/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">2. Edge Replication</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm font-mono font-semibold">312 nodes synced</p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-muted/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">3. TLS & SSL Routing</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm font-mono font-semibold">Active & Encrypted</p>
            </div>
          </div>

          {/* Generated preview URL bar */}
          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
              <span className="truncate">https://aura-cloud-gateway-preview-q8x.edge.dev</span>
            </div>
            <a
              href="#visit"
              className="flex items-center gap-1.5 font-semibold text-primary shrink-0 hover:underline"
            >
              <span>Visit Preview</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Feature Tabs Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto border-t border-border">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {[
            { id: "branch", label: "Instant Branch Previews" },
            { id: "edge", label: "Zero-Downtime Rollbacks" },
            { id: "telemetry", label: "Edge Telemetry & KV" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={\`px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer \${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm font-semibold"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }\`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Detail View */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-lg transition-all">
          {activeTab === "branch" && (
            <div className="space-y-4 text-sm">
              <h3 className="font-bold text-lg sm:text-xl">
                Every Git commit gets a production replica.
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Share live preview links with team members and clients. Comments left on the preview link are
                automatically linked back to your GitHub PR.
              </p>
              <div className="p-4 rounded-xl font-mono text-xs sm:text-sm border border-border bg-muted/60 overflow-x-auto leading-relaxed">
                git checkout -b feat/redesign-checkout <br />
                git push origin feat/redesign-checkout <br />
                <span className="text-emerald-500 font-semibold">
                  \u2192 [{brandName}] Ephemeral environment deployed at https://pr-42.aura.run (2.1s)
                </span>
              </div>
            </div>
          )}

          {activeTab === "edge" && (
            <div className="space-y-4 text-sm">
              <h3 className="font-bold text-lg sm:text-xl">
                Instant atomic rollbacks with zero traffic drops.
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                If an unexpected error occurs, revert back to any historical checkpoint with a single click or CLI
                command in under 300 milliseconds.
              </p>
              <div className="p-4 rounded-xl font-mono text-xs sm:text-sm border border-border bg-muted/60 overflow-x-auto leading-relaxed">
                $ aura rollback --target=v2.14.0 --atomic <br />
                <span className="text-emerald-500 font-semibold">
                  \u2713 Reverted 312 edge locations to commit [d91a2] in 280ms. Error rate: 0.00%
                </span>
              </div>
            </div>
          )}

          {activeTab === "telemetry" && (
            <div className="space-y-4 text-sm">
              <h3 className="font-bold text-lg sm:text-xl">
                Built-in microsecond telemetry and distributed KV.
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Inspect cold starts, invocation count, memory consumption, and cache hit ratios without configuring
                external log aggregators.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 font-mono">
                <div className="p-3.5 rounded-xl border border-border bg-muted/40">
                  <p className="text-xs text-muted-foreground">CACHE HIT RATE</p>
                  <p className="text-xl font-bold text-emerald-500 mt-1">99.82%</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-muted/40">
                  <p className="text-xs text-muted-foreground">AVG LATENCY</p>
                  <p className="text-xl font-bold text-foreground mt-1">1.2ms</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-muted/40">
                  <p className="text-xs text-muted-foreground">INVOCATIONS</p>
                  <p className="text-xl font-bold text-foreground mt-1">14.2M / day</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-muted/40">
                  <p className="text-xs text-muted-foreground">COLD START</p>
                  <p className="text-xl font-bold text-emerald-500 mt-1">0ms</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Command Modal Simulation */}
      <AnimatePresence>
        {isCommandOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={() => setIsCommandOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            >
              <div className="p-3.5 border-b border-border flex items-center gap-2.5">
                <Search className="h-4 w-4 opacity-50" />
                <input
                  type="text"
                  autoFocus
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  placeholder="Type a command or search deployments..."
                  className="w-full bg-transparent text-sm focus:outline-none py-1 text-foreground"
                />
                <button
                  onClick={() => setIsCommandOpen(false)}
                  className="p-1 rounded hover:opacity-75 transition-opacity"
                  aria-label="Close Command Menu"
                >
                  <X className="h-4 w-4 opacity-60" />
                </button>
              </div>

              <div className="p-2 max-h-60 overflow-y-auto space-y-1">
                {filteredCommands.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      alert(\`Executed command: "\${item.label}"\`);
                      setIsCommandOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-sm hover:bg-muted/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{item.category}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-border text-center text-xs text-muted-foreground">
        <p>\xA9 {new Date().getFullYear()} {brandName}. Designed for high-velocity software engineering.</p>
      </footer>
    </div>
  );
}
`
};

// src/registry/template-analytics-dashboard.ts
var templateAnalyticsDashboard = {
  name: "template-analytics-dashboard",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-analytics-dashboard.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Users,
  Download,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  ChevronDown,
  RefreshCw,
  Search,
  Menu,
  X,
} from "lucide-react";

export interface AnalyticsDashboardTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function AnalyticsDashboardTemplate({
  brandName = "Prism Analytics",
  theme = "dark",
}: AnalyticsDashboardTemplateProps) {
  
    const isDark = theme === "dark";

  const [dateRange, setDateRange] = useState<"Today" | "7D" | "30D" | "90D">("30D");
  const [eventFilter, setEventFilter] = useState<"all" | "sub" | "upgrade">("all");
  const [exportToast, setExportToast] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dynamic metrics based on date range
  const metricsData = {
    Today: { mrr: "$6,240", delta: "+4.1%", teams: "31", nrr: "128.4%", bars: [45, 60, 35, 70, 85, 90, 65, 80] },
    "7D": { mrr: "$42,800", delta: "+8.9%", teams: "184", nrr: "125.1%", bars: [30, 45, 60, 75, 55, 80, 95, 88] },
    "30D": { mrr: "$148,920", delta: "+14.8%", teams: "642", nrr: "124.2%", bars: [40, 55, 35, 70, 60, 85, 75, 100, 90, 95] },
    "90D": { mrr: "$412,500", delta: "+22.4%", teams: "1,890", nrr: "121.8%", bars: [25, 40, 60, 55, 70, 80, 65, 85, 95, 100] },
  }[dateRange];

  const activities = [
    { type: "sub", user: "Sarah Jenkins", plan: "Enterprise Pro ($490/mo)", time: "2m ago", amount: "+$490" },
    { type: "upgrade", user: "Acme Corp Devs", plan: "Seat Expansion (+12 seats)", time: "14m ago", amount: "+$240" },
    { type: "sub", user: "HyperScale Ltd", plan: "Annual Developer Plan", time: "38m ago", amount: "+$1,200" },
    { type: "upgrade", user: "Nexus Studio", plan: "Storage Tier 4 Upgrade", time: "1h ago", amount: "+$85" },
  ];

  const filteredActivities = activities.filter(
    (a) => eventFilter === "all" || a.type === eventFilter
  );

  const handleExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors flex flex-col lg:flex-row font-sans"
      
    >
      {/* Mobile Top Header */}
      <header
        className="lg:hidden flex items-center justify-between px-4 py-3 border-b shrink-0"
        
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm"
            
          >
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-sm leading-tight block" >
              {brandName || "Prism HQ"}
            </span>
            <span className="text-[11px] font-mono leading-none block" >
              Analytics Suite
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors"
          
          aria-label="Toggle navigation"
        >
          {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      {/* Mobile Sidebar Dropdown */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-b p-4 space-y-2 text-sm overflow-hidden"
            
          >
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-white shadow-sm"
              
            >
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Revenue Streams</span>
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
            >
              <Users className="h-4 w-4" />
              <span>Subscribers</span>
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
            >
              <CreditCard className="h-4 w-4" />
              <span>Payouts & Tax</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation (Desktop / Tablet Expanded) */}
      <aside
        className="hidden lg:flex w-64 border-r p-5 shrink-0 flex-col justify-between transition-colors text-sm"
        
      >
        <div>
          {/* Workspace Switcher */}
          <div
            className="flex items-center justify-between p-2.5 rounded-xl border mb-6 transition-all"
            
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: "#6366f1", borderRadius: "calc(0.75rem - 2px)" }}
              >
                <BarChart3 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm truncate block" >
                  {brandName || "Prism HQ"}
                </span>
                <span className="text-xs truncate block" >
                  Enterprise Suite
                </span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-white shadow-sm"
              
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-mono font-medium">Live</span>
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg opacity-75 hover:opacity-100 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Revenue Streams</span>
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg opacity-75 hover:opacity-100 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Subscribers</span>
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg opacity-75 hover:opacity-100 transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              <span>Payouts & Tax</span>
            </button>
          </nav>
        </div>

        {/* User Card */}
        <div
          className="pt-4 border-t flex items-center gap-3 text-sm"
          
        >
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
            
          >
            EX
          </div>
          <div className="truncate min-w-0">
            <p className="font-semibold text-sm leading-tight truncate">Executive Ops</p>
            <p className="text-xs truncate" >Admin \u2022 Pro Plan</p>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Canvas */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-1"
              
            >
              Executive Command Overview
            </h1>
            <p className="text-xs sm:text-sm" >
              Multi-currency financial telemetry & real-time inflow metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Range Selector */}
            <div
              className="flex items-center p-1 rounded-lg border text-xs"
              
            >
              {(["Today", "7D", "30D", "90D"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={\`px-3 py-1.5 rounded text-xs font-mono transition-all \${
                    dateRange === r
                      ? "text-white font-semibold shadow-sm"
                      : "opacity-70 hover:opacity-100"
                  }\`}
                  style={{
                    backgroundColor: dateRange === r ? "#6366f1" : "transparent",
                    color: dateRange === r ? "#ffffff" : "#f4f4f7",
                    borderRadius: "calc(0.75rem - 4px)",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <button
              onClick={handleExport}
              className="px-3.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all hover:opacity-80 shadow-sm"
              style={{
                backgroundColor: "#12141c",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
                borderRadius: "0.75rem",
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 @xs:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {/* Card 1: MRR */}
          <div
            className="p-4 sm:p-5 rounded-xl border flex flex-col justify-between transition-all"
            
          >
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5" >
                <span className="font-medium">Monthly Recurring</span>
                <span className="text-emerald-500 font-mono text-xs flex items-center font-bold">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> {metricsData.delta}
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight mb-1 truncate">{metricsData.mrr}</p>
              <p className="text-xs" >Trailing {dateRange} cycle</p>
            </div>
            {/* Sparkline mini bars */}
            <div className="h-8 flex items-end gap-1.5 mt-4">
              {metricsData.bars.map((b, i) => (
                <div
                  key={i}
                  style={{
                    height: \`\${b}%\`,
                    backgroundColor: "#6366f1",
                  }}
                  className="flex-1 rounded-t opacity-75 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Card 2: NRR */}
          <div
            className="p-4 sm:p-5 rounded-xl border flex flex-col justify-between transition-all"
            
          >
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5" >
                <span className="font-medium">Net Retention (NRR)</span>
                <span className="text-emerald-500 font-mono text-xs flex items-center font-bold">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +2.4%
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight mb-1 truncate">{metricsData.nrr}</p>
              <p className="text-xs" >Negative revenue churn</p>
            </div>
            <div className="h-8 flex items-end gap-1.5 mt-4">
              {[50, 60, 65, 70, 75, 85, 90, 95].map((b, i) => (
                <div
                  key={i}
                  style={{ height: \`\${b}%\` }}
                  className="flex-1 bg-emerald-500 rounded-t opacity-75 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Card 3: Workspaces */}
          <div
            className="p-4 sm:p-5 rounded-xl border flex flex-col justify-between transition-all"
            
          >
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5" >
                <span className="font-medium">Paid Workspaces</span>
                <span className="text-emerald-500 font-mono text-xs flex items-center font-bold">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +12.1%
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight mb-1 truncate">{metricsData.teams}</p>
              <p className="text-xs" >Active enterprise seats</p>
            </div>
            <div className="h-8 flex items-end gap-1.5 mt-4">
              {[30, 45, 55, 65, 70, 80, 85, 90].map((b, i) => (
                <div
                  key={i}
                  style={{ height: \`\${b}%\`, backgroundColor: "#6366f1" }}
                  className="flex-1 rounded-t opacity-75 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Card 4: Gross Margin */}
          <div
            className="p-4 sm:p-5 rounded-xl border flex flex-col justify-between transition-all"
            
          >
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5" >
                <span className="font-medium">Gross Margin</span>
                <span className="text-emerald-500 font-mono text-xs flex items-center font-bold">
                  84.2%
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight mb-1 truncate">84.2%</p>
              <p className="text-xs" >Sub-16% COGS overhead</p>
            </div>
            <div className="h-8 flex items-end gap-1.5 mt-4">
              {[70, 72, 75, 78, 80, 82, 83, 85].map((b, i) => (
                <div
                  key={i}
                  style={{ height: \`\${b}%\` }}
                  className="flex-1 bg-emerald-500 rounded-t opacity-75 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Live Customer Activity Stream */}
        <div
          className="rounded-xl border p-4 sm:p-6 transition-all"
          
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b text-sm" >
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4"  />
              <span className="font-semibold text-sm sm:text-base">Live Inflow Ledger</span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              {(["all", "sub", "upgrade"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setEventFilter(f)}
                  className={\`px-3 py-1 rounded capitalize transition-all \${
                    eventFilter === f ? "font-semibold text-white shadow-sm" : "opacity-60 hover:opacity-100"
                  }\`}
                  style={{
                    backgroundColor: eventFilter === f ? "#6366f1" : "transparent",
                    color: eventFilter === f ? "#ffffff" : "#f4f4f7",
                    borderRadius: "calc(0.75rem - 4px)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Activity items list */}
          <div className="divide-y text-sm" >
            {filteredActivities.map((act, i) => (
              <div key={i} className="py-3 flex items-center justify-between gap-3">
                <div className="truncate min-w-0">
                  <p className="font-medium text-sm truncate" >
                    {act.user}
                  </p>
                  <p className="text-xs truncate mt-0.5" >
                    {act.plan} \u2022 {act.time}
                  </p>
                </div>
                <span className="font-mono font-bold text-emerald-500 text-sm shrink-0">
                  {act.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Export Toast Notification */}
        <AnimatePresence>
          {exportToast && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="fixed bottom-6 right-6 p-3.5 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-mono z-50"
              style={{
                backgroundColor: "#181a24",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
                borderRadius: "0.75rem",
              }}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Exported CSV ledger successfully.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
`
};

// src/registry/template-devtools-cli.ts
var templateDevtoolsCli = {
  name: "template-devtools-cli",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-devtools-cli.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Copy,
  Check,
  Zap,
  Code2,
  Cpu,
  Star,
  Github,
  ChevronRight,
  Sparkles,
  Command,
  Flame,
  Activity,
} from "lucide-react";

export interface DevtoolsCliTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function DevtoolsCliTemplate({
  brandName = "HyperTerminal",
  theme = "dark",
}: DevtoolsCliTemplateProps) {
  
    const isDark = theme === "dark";

  const [copiedCurl, setCopiedCurl] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "hyper init --template=edge-runtime",
    "\u2713 Initialized repository in 12ms",
    "hyper bench --concurrent=1000",
    "\u2713 P99 latency: 0.8ms across 1,000 parallel threads",
  ]);

  const sampleCommands = ["hyper bench --fast", "hyper deploy --prod", "hyper status"];

  const handleCopyCurl = () => {
    navigator.clipboard.writeText("curl -fsSL https://get.hyperterminal.dev | sh");
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleTerminalSubmit = (e?: React.FormEvent, manualCmd?: string) => {
    if (e) e.preventDefault();
    const cmd = (manualCmd || terminalInput).trim();
    if (!cmd) return;
    let response = \`Executed: \${cmd}\`;
    if (cmd.includes("bench")) {
      response = "\u2713 Bench: 4.8M ops/sec. Memory: 12.8MB RSS. Zero memory leaks.";
    } else if (cmd.includes("deploy")) {
      response = "\u2713 Provisioned 35 edge clusters in 380ms. Routing active.";
    } else if (cmd.includes("status")) {
      response = "\u2713 All 35 edge nodes healthy. CPU load: 1.4%. FPS: 120.";
    } else {
      response = \`\u2713 Command '\${cmd}' executed successfully in 6ms.\`;
    }
    setTerminalHistory((prev) => [...prev, cmd, response]);
    setTerminalInput("");
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans"
      
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all shrink-0"
              
            >
              <Terminal className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-sm sm:text-base tracking-tight"
              
            >
              {brandName || "HyperTerminal"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>18.4k stars</span>
            </div>

            <button
              onClick={handleCopyCurl}
              className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 flex items-center gap-2"
              
            >
              {copiedCurl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copiedCurl ? "Copied!" : "Install CLI"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero: Split Value Prop & Terminal View */}
      <section className="pt-8 sm:pt-14 lg:pt-20 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono"
              style={{
                backgroundColor: "#161822",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#6366f1",
              }}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Engineered in Rust \u2022 Zero C FFI</span>
            </div>

            <h1
              className="text-2xl @xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]"
              
            >
              The High-Performance Terminal for Systems Engineers.
            </h1>

            <p className="text-sm sm:text-base leading-relaxed" >
              Sub-millisecond input rendering, native GPU acceleration, multiplexed shell sessions, and
              instant distributed telemetry out of the box.
            </p>

            {/* Quick Curl Box */}
            <div
              className="p-3 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm shadow-sm"
              
            >
              <div className="flex items-center gap-2.5 truncate font-mono text-xs sm:text-sm min-w-0">
                <span className="text-emerald-500 font-bold shrink-0">$</span>
                <span className="truncate" >
                  curl -fsSL https://get.hyperterminal.dev | sh
                </span>
              </div>
              <button
                onClick={handleCopyCurl}
                className="p-1.5 rounded hover:opacity-75 transition-opacity shrink-0"
                aria-label="Copy install command"
              >
                {copiedCurl ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 opacity-60" />}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Terminal Sandbox */}
          <div className="lg:col-span-6 w-full">
            <div
              className="rounded-2xl border shadow-xl overflow-hidden font-mono text-xs sm:text-sm transition-all"
              style={{
                backgroundColor: isDark ? "#08090d" : "#11131a",
                color: "#fafafa",
                borderColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: "0.75rem",
              }}
            >
              {/* Window Titlebar */}
              <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs opacity-60 truncate max-w-[200px]">
                  hyper-session: ~/workspace/prod
                </span>
                <span className="text-xs text-emerald-400 font-bold">120 FPS</span>
              </div>

              {/* Terminal Logs */}
              <div className="p-4 sm:p-5 space-y-2.5 max-h-64 sm:max-h-80 overflow-y-auto no-scrollbar">
                {terminalHistory.map((line, idx) => (
                  <div
                    key={idx}
                    className={line.startsWith("\u2713") ? "text-emerald-400 font-medium" : "text-zinc-200"}
                  >
                    {!line.startsWith("\u2713") && <span className="mr-2" >$</span>}
                    {line}
                  </div>
                ))}

                {/* Active input prompt */}
                <form onSubmit={(e) => handleTerminalSubmit(e)} className="flex items-center gap-2 pt-1">
                  <span >$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="try: hyper bench --fast"
                    className="w-full bg-transparent focus:outline-none text-white placeholder:text-zinc-600 text-xs sm:text-sm"
                  />
                </form>
              </div>

              {/* Quick interactive chip buttons for mobile / touch */}
              <div className="px-4 py-2.5 bg-black/30 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
                <span className="opacity-40">Tap run:</span>
                {sampleCommands.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => handleTerminalSubmit(undefined, cmd)}
                    className="px-2.5 py-1 rounded border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-colors font-mono"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benchmark Matrix */}
      <section
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t"
        
      >
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
            
          >
            Engineered For Pure Performance
          </h2>
          <p className="text-xs sm:text-sm" >
            Verified on 64-core Linux kernel 6.8 environments with native GPU rasterization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div
            className="p-6 rounded-xl border text-center transition-all"
            
          >
            <p className="text-xs font-mono font-semibold uppercase tracking-wider mb-2" >
              COLD START LATENCY
            </p>
            <p className="text-3xl sm:text-4xl font-bold font-mono text-emerald-500 mb-2">0.4ms</p>
            <p className="text-xs sm:text-sm opacity-70">18x faster than traditional shells</p>
          </div>

          <div
            className="p-6 rounded-xl border text-center transition-all"
            
          >
            <p className="text-xs font-mono font-semibold uppercase tracking-wider mb-2" >
              MEMORY FOOTPRINT
            </p>
            <p className="text-3xl sm:text-4xl font-bold font-mono mb-2" >
              12.8 MB
            </p>
            <p className="text-xs sm:text-sm opacity-70">94% less memory than web wrappers</p>
          </div>

          <div
            className="p-6 rounded-xl border text-center transition-all"
            
          >
            <p className="text-xs font-mono font-semibold uppercase tracking-wider mb-2" >
              RENDER REFRESH RATE
            </p>
            <p className="text-3xl sm:text-4xl font-bold font-mono text-amber-500 mb-2">120 FPS</p>
            <p className="text-xs sm:text-sm opacity-70">Metal & Vulkan GPU acceleration</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-4 sm:px-6 border-t text-center text-xs sm:text-sm"
        
      >
        <p>\xA9 {new Date().getFullYear()} {brandName || "HyperTerminal"}. Open source MIT licensed.</p>
      </footer>
    </div>
  );
}
`
};

// src/registry/template-creative-portfolio.ts
var templateCreativePortfolio = {
  name: "template-creative-portfolio",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-creative-portfolio.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Check,
  X,
  Send,
  Eye,
  Award,
  Layers,
  Globe,
} from "lucide-react";

export interface CreativePortfolioTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function CreativePortfolioTemplate({
  brandName = "Studio Monolith",
  theme = "dark",
}: CreativePortfolioTemplateProps) {
  
    const isDark = theme === "dark";

  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryBudget, setInquiryBudget] = useState("$25k - $50k");

  const projects = [
    {
      id: "lumina",
      title: "Lumina Spatial Audio",
      client: "Bang & Olufsen Acoustic Lab",
      category: "Creative Direction & WebGL",
      year: "2025",
      award: "Awwwards SOTD",
      summary: "An interactive spatial audio visualizer engineered using custom GLSL shaders and real-time frequency mapping.",
      metric: "+180% Session Duration",
    },
    {
      id: "vortex",
      title: "Komorebi Timepieces",
      client: "Grand Seiko Haute Horlogerie",
      category: "Digital Flagship & E-commerce",
      year: "2024",
      award: "FWA of the Month",
      summary: "Editorial digital commerce architecture celebrating Japanese micro-artisan craftsmanship and mechanical movements.",
      metric: "$4.2M Launch Volume",
    },
    {
      id: "neural",
      title: "Monolith Architecture",
      client: "Zaha Hadid Foundation",
      category: "Exhibition Monograph",
      year: "2025",
      award: "Cannes Bronze Lion",
      summary: "Archive curation and interactive parametric building exploration for the global retrospective exhibition tour.",
      metric: "1.2M Virtual Visitors",
    },
    {
      id: "apex",
      title: "Hyperion Autonomous EV",
      client: "Hyperion Motors Sweden",
      category: "HMI & Telemetry Interface",
      year: "2024",
      award: "Red Dot Best of Best",
      summary: "In-cockpit digital instrument cluster and companion telemetry application engineered for electric hypercars.",
      metric: "Sub-16ms Framerate",
    },
  ];

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans selection:bg-indigo-500/20"
      
    >
      {/* Editorial Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-base sm:text-lg font-bold tracking-tight uppercase"
              
            >
              {brandName || "Studio Monolith"}
            </span>
            <span className="hidden sm:inline text-xs sm:text-sm" >
              / Zurich & Tokyo
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="hidden sm:flex items-center gap-2 text-xs"
              
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Commissions</span>
            </div>

            <button
              onClick={() => setIsInquiryOpen(true)}
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-full text-white shadow-sm transition-all hover:brightness-110 flex items-center gap-2 shrink-0"
              
            >
              <span>Initiate Project</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Large Editorial Statement Hero */}
      <section className="pt-12 sm:pt-20 lg:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
        <p
          className="text-xs uppercase tracking-widest font-mono mb-4"
          
        >
          Design Direction & Digital Architecture
        </p>

        <h1
          className="text-3xl @xs:text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.12] mb-8"
          
        >
          Sculpting singular digital experiences for cultural and luxury institutions.
        </h1>

        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t text-xs sm:text-sm"
          
        >
          <div>
            <p className="font-semibold mb-1 text-sm sm:text-base" >
              Curation & Strategy
            </p>
            <p className="leading-relaxed" >
              Transforming brand narratives into sensory digital monographs.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1 text-sm sm:text-base" >
              Spatial & Real-Time
            </p>
            <p className="leading-relaxed" >
              Custom interactive 3D environments engineered for silky 60FPS fluid motion.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1 text-sm sm:text-base" >
              Accolades
            </p>
            <p className="leading-relaxed" >
              14x Awwwards SOTD, 8x FWA of the Day, Cannes Lions Bronze Winner.
            </p>
          </div>
        </div>
      </section>

      {/* Project Showcase Grid */}
      <section
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t"
        
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs sm:text-sm uppercase font-mono tracking-widest opacity-60">
            Selected Monographs (2024 \u2014 2025)
          </h2>
          <span className="text-xs sm:text-sm font-mono" >
            4 Featured Works
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((proj) => (
            <motion.div
              key={proj.id}
              whileHover={{ y: -4 }}
              onClick={() => setActiveProject(proj)}
              className="cursor-pointer rounded-2xl border p-6 sm:p-8 flex flex-col justify-between min-h-[320px] transition-all group"
              
            >
              <div>
                <div
                  className="flex items-center justify-between text-xs font-mono mb-4"
                  
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span>{proj.award}</span>
                  </span>
                  <span>{proj.year}</span>
                </div>

                <h3
                  className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 group-hover:opacity-90 transition-opacity"
                  style={{ color: "#f4f4f7" }}
                >
                  {proj.title}
                </h3>
                <p className="text-xs sm:text-sm mb-4 font-medium" >
                  {proj.client}
                </p>
                <p className="text-xs sm:text-sm leading-relaxed line-clamp-2" >
                  {proj.summary}
                </p>
              </div>

              <div
                className="pt-4 border-t flex items-center justify-between text-xs sm:text-sm mt-4"
                
              >
                <span >{proj.category}</span>
                <span
                  className="flex items-center gap-1.5 font-semibold group-hover:underline"
                  
                >
                  <span>Explore Monograph</span>
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl relative"
              
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:opacity-75 transition-opacity"
                aria-label="Close Project Modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono mb-4 border"
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  borderColor: "rgba(245, 158, 11, 0.3)",
                  color: "#d97706",
                }}
              >
                <Award className="h-3.5 w-3.5" />
                <span>{activeProject.award}</span>
              </div>

              <h3
                className="text-2xl sm:text-3xl font-bold mb-1.5"
                style={{ color: "#f4f4f7" }}
              >
                {activeProject.title}
              </h3>
              <p className="text-xs sm:text-sm mb-4" >
                {activeProject.client} \u2022 {activeProject.year}
              </p>

              <p className="text-xs sm:text-sm leading-relaxed mb-6" >
                {activeProject.summary}
              </p>

              <div
                className="p-4 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-mono mb-6"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  backgroundColor: "#161822",
                }}
              >
                <span >Demonstrated Impact:</span>
                <span className="font-bold text-emerald-500">{activeProject.metric}</span>
              </div>

              <button
                onClick={() => {
                  alert(\`Navigating to monograph: \${activeProject.title}\`);
                  setActiveProject(null);
                }}
                className="w-full h-11 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 flex items-center justify-center gap-2"
                
              >
                <span>View Complete Case Study</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initiate Project Modal */}
      <AnimatePresence>
        {isInquiryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsInquiryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <h3 className="font-bold text-base uppercase tracking-wider" >
                  Initiate Commission
                </h3>
                <button onClick={() => setIsInquiryOpen(false)} className="p-1 rounded hover:opacity-75">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed" >
                We accept a select number of architecture, luxury, and digital monograph commissions per quarter.
              </p>

              <div>
                <label className="block text-xs font-semibold mb-2" >
                  Target Investment Bracket
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["$15k - $25k", "$25k - $50k", "$50k - $100k", "$100k+"].map((b) => (
                    <button
                      key={b}
                      onClick={() => setInquiryBudget(b)}
                      className={\`h-11 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-center \${
                        inquiryBudget === b ? "font-semibold shadow-sm text-white" : "opacity-75"
                      }\`}
                      style={{
                        backgroundColor: inquiryBudget === b ? "#6366f1" : "#12141c",
                        borderColor: inquiryBudget === b ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                        color: inquiryBudget === b ? "#ffffff" : "#f4f4f7",
                        borderRadius: "0.75rem",
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  alert("Project inquiry transmitted to Zurich & Tokyo studio partners.");
                  setIsInquiryOpen(false);
                }}
                className="w-full h-11 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:brightness-110"
                
              >
                Transmit Project Proposal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer
        className="py-10 px-4 sm:px-6 border-t text-center text-xs sm:text-sm"
        
      >
        <p>\xA9 {new Date().getFullYear()} {brandName || "Studio Monolith"}. All rights reserved.</p>
      </footer>
    </div>
  );
}
`
};

// src/registry/template-fintech-app.ts
var templateFintechApp = {
  name: "template-fintech-app",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-fintech-app.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Lock,
  Unlock,
  Send,
  Download,
  Search,
  CheckCircle2,
  RefreshCw,
  Globe,
  SlidersHorizontal,
  X,
} from "lucide-react";

export interface FintechAppTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function FintechAppTemplate({
  brandName = "Apex Capital",
  theme = "dark",
}: FintechAppTemplateProps) {
  
    const isDark = theme === "dark";

  const [activeCurrency, setActiveCurrency] = useState<"USD" | "EUR" | "GBP">("USD");
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("4500");
  const [transferToast, setTransferToast] = useState(false);

  const balances = {
    USD: { symbol: "$", total: "2,841,920.40", yield: "+5.18% APY", wireLimit: "$500,000" },
    EUR: { symbol: "\u20AC", total: "1,940,210.00", yield: "+3.92% APY", wireLimit: "\u20AC450,000" },
    GBP: { symbol: "\xA3", total: "820,450.15", yield: "+4.85% APY", wireLimit: "\xA3300,000" },
  }[activeCurrency];

  const transactions = [
    { name: "AWS Cloud Infrastructure", cat: "Hosting & CDN", date: "Today, 14:22", amount: "-$12,420.00", status: "Cleared" },
    { name: "Stripe Settlement Inflow", cat: "Merchant Volume", date: "Today, 09:15", amount: "+$48,920.50", status: "Cleared" },
    { name: "Gartner Research Advisory", cat: "Subscriptions", date: "Yesterday", amount: "-$3,500.00", status: "Cleared" },
    { name: "Figma Enterprise Seats", cat: "Design Software", date: "Sep 04", amount: "-$1,840.00", status: "Cleared" },
  ];

  const handleSendWire = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransferOpen(false);
    setTransferToast(true);
    setTimeout(() => setTransferToast(false), 3000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all shrink-0"
              
            >
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-sm sm:text-base tracking-tight"
              
            >
              {brandName || "Apex Capital"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Switcher */}
            <div
              className="flex items-center p-1 rounded-lg border text-xs"
              
            >
              {(["USD", "EUR", "GBP"] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setActiveCurrency(curr)}
                  className={\`px-2.5 py-1 rounded text-xs font-mono transition-all \${
                    activeCurrency === curr ? "text-white font-bold shadow-sm" : "opacity-70 hover:opacity-100"
                  }\`}
                  style={{
                    backgroundColor: activeCurrency === curr ? "#6366f1" : "transparent",
                    color: activeCurrency === curr ? "#ffffff" : "#f4f4f7",
                    borderRadius: "calc(0.75rem - 4px)",
                  }}
                >
                  {curr}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsTransferOpen(true)}
              className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg text-white shadow-sm transition-all hover:brightness-110 flex items-center gap-2 shrink-0"
              
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send Wire</span>
              <span className="sm:hidden">Wire</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Treasury Dashboard Section */}
      <section className="pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Virtual Titanium Debit Card */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div
              className={\`w-full max-w-md h-56 sm:h-60 rounded-2xl p-6 border shadow-xl relative flex flex-col justify-between overflow-hidden transition-all duration-300 \${
                isCardFrozen ? "grayscale brightness-75" : ""
              }\`}
              style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                borderColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: "0.75rem",
                color: "#ffffff",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-zinc-300 font-semibold">
                  APEX TITANIUM
                </span>
                <span
                  className="text-xs font-mono px-2.5 py-1 rounded-full border border-white/20 font-bold"
                  style={{
                    backgroundColor: isCardFrozen ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                    color: isCardFrozen ? "#f87171" : "#6ee7b7",
                  }}
                >
                  {isCardFrozen ? "FROZEN" : "ACTIVE"}
                </span>
              </div>

              {/* EMV Chip & Contactless */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-8 rounded bg-gradient-to-tr from-amber-400 to-amber-200 shadow-inner" />
                <div className="h-5 w-5 border-2 border-white/30 rounded-full" />
              </div>

              <div>
                <p className="font-mono text-lg sm:text-xl tracking-widest mb-1.5 text-white">
                  {showCardNumber ? "4829 9102 3847 1092" : "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 1092"}
                </p>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                  <span>EXECUTIVE CORP</span>
                  <span>EXP 08/29</span>
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="flex items-center gap-3 mt-4 w-full max-w-md justify-center">
              <button
                onClick={() => setShowCardNumber(!showCardNumber)}
                className="flex-1 h-10 px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 hover:opacity-80 transition-opacity shadow-sm"
                style={{
                  backgroundColor: "#12141c",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  color: "#f4f4f7",
                  borderRadius: "0.75rem",
                }}
              >
                {showCardNumber ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                <span>{showCardNumber ? "Hide Number" : "Show Number"}</span>
              </button>

              <button
                onClick={() => setIsCardFrozen(!isCardFrozen)}
                className="flex-1 h-10 px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                style={{
                  backgroundColor: isCardFrozen ? "rgba(239, 68, 68, 0.1)" : "#12141c",
                  borderColor: isCardFrozen ? "#ef4444" : "rgba(255, 255, 255, 0.08)",
                  color: isCardFrozen ? "#ef4444" : "#f4f4f7",
                  borderRadius: "0.75rem",
                }}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{isCardFrozen ? "Unfreeze" : "Freeze"}</span>
              </button>
            </div>
          </div>

          {/* Treasury Summary & Yield */}
          <div className="lg:col-span-7 space-y-6 w-full">
            <div
              className="p-5 sm:p-7 rounded-2xl border transition-all"
              
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-mono tracking-wider" >
                  Liquid Treasury Balance
                </span>
                <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  {balances.yield}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-3xl @xs:text-4xl sm:text-5xl font-bold font-mono tracking-tight truncate">
                  {balances.symbol}{balances.total}
                </span>
                <span className="text-sm font-mono opacity-60 shrink-0">{activeCurrency}</span>
              </div>

              <div
                className="grid grid-cols-1 @xs:grid-cols-3 gap-3 pt-5 border-t text-xs font-mono"
                
              >
                <div className="p-2 rounded-lg" >
                  <p className="text-xs mb-0.5" >WIRE LIMIT</p>
                  <p className="font-semibold text-sm">{balances.wireLimit}</p>
                </div>
                <div className="p-2 rounded-lg" >
                  <p className="text-xs mb-0.5" >TRANSIT NETWORK</p>
                  <p className="font-semibold text-sm text-emerald-500">FedNow Instant</p>
                </div>
                <div className="p-2 rounded-lg" >
                  <p className="text-xs mb-0.5" >INSURANCE</p>
                  <p className="font-semibold text-sm">$5M FDIC Pool</p>
                </div>
              </div>
            </div>

            {/* Recent Corporate Ledger */}
            <div
              className="p-5 sm:p-7 rounded-2xl border transition-all"
              
            >
              <div className="flex items-center justify-between pb-3.5 mb-3 border-b text-sm" >
                <span className="font-semibold text-sm sm:text-base">Recent Treasury Transactions</span>
                <span className="text-xs font-mono" >4 transactions</span>
              </div>

              <div className="divide-y text-sm" >
                {transactions.map((tx, i) => (
                  <div key={i} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="truncate min-w-0">
                      <p className="font-medium truncate" >
                        {tx.name}
                      </p>
                      <p className="text-xs truncate mt-0.5" >
                        {tx.cat} \u2022 {tx.date}
                      </p>
                    </div>
                    <span
                      className={\`font-mono font-bold text-sm shrink-0 \${
                        tx.amount.startsWith("+") ? "text-emerald-500" : ""
                      }\`}
                      style={{ color: tx.amount.startsWith("+") ? undefined : "#f4f4f7" }}
                    >
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Send Wire Modal */}
      <AnimatePresence>
        {isTransferOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsTransferOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSendWire}
              className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <h3 className="font-bold text-base" >
                  Initiate FedNow Outbound Wire
                </h3>
                <button type="button" onClick={() => setIsTransferOpen(false)} className="p-1 rounded hover:opacity-75">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" >
                  Beneficiary Account Name
                </label>
                <input
                  type="text"
                  required
                  defaultValue="Anthropic PBC"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent focus:outline-none"
                  
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" >
                  Transfer Amount ({activeCurrency})
                </label>
                <input
                  type="number"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-base font-mono font-bold bg-transparent focus:outline-none"
                  
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium hover:opacity-80"
                  
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm hover:brightness-110"
                  
                >
                  Authorize Wire
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wire Sent Toast Notification */}
      <AnimatePresence>
        {transferToast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 right-6 p-3.5 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-mono z-50"
            style={{
              backgroundColor: "#181a24",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
              borderRadius: "0.75rem",
            }}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Wire authorized and submitted to FedNow rail.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer
        className="py-8 px-4 sm:px-6 border-t text-center text-xs sm:text-sm"
        
      >
        <p>\xA9 {new Date().getFullYear()} {brandName || "Apex Capital"}. Member FDIC insured.</p>
      </footer>
    </div>
  );
}
`
};

// src/registry/template-ecommerce-store.ts
var templateEcommerceStore = {
  name: "template-ecommerce-store",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-ecommerce-store.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Check,
  ChevronDown,
  ChevronRight,
  X,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  Menu,
  Eye,
  Layers,
  ArrowRight,
  Star,
  Compass,
} from "lucide-react";

export interface EcommerceStoreTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function EcommerceStoreTemplate({
  brandName = "Atelier Objects",
  theme = "dark",
}: EcommerceStoreTemplateProps) {
  
    const isDark = theme === "dark";

  const [selectedColor, setSelectedColor] = useState<"Obsidian" | "Dune Sand" | "Nordic Sage" | "Terracotta">("Obsidian");
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [bagItems, setBagItems] = useState([
    {
      id: "parka-1",
      name: "The No. 04 Modular Field Parka",
      color: "Obsidian",
      size: "M",
      price: 380,
      qty: 1,
    },
  ]);
  const [openAccordion, setOpenAccordion] = useState<string | null>("materials");

  const colors = [
    { name: "Obsidian", hex: "#18181b", label: "01 / Carbon Black" },
    { name: "Dune Sand", hex: "#d4c5b9", label: "02 / Raw Mineral" },
    { name: "Nordic Sage", hex: "#7a8a7c", label: "03 / Glacial Moss" },
    { name: "Terracotta", hex: "#a45d4c", label: "04 / Baked Earth" },
  ] as const;

  const productImages = [
    { label: "Front Profile", desc: "Minimalist storm collar with covered storm flap" },
    { label: "Material Macro", desc: "320gsm high-density Japanese gabardine weave" },
    { label: "Internal Structure", desc: "Removable thermal lining with magnetic utility pockets" },
  ];

  const bagSubtotal = bagItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleAddToBag = () => {
    setBagItems((prev) => {
      const existing = prev.find((i) => i.color === selectedColor && i.size === selectedSize);
      if (existing) {
        return prev.map((i) =>
          i.color === selectedColor && i.size === selectedSize ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: \`parka-\${Date.now()}\`,
          name: "The No. 04 Modular Field Parka",
          color: selectedColor,
          size: selectedSize,
          price: 380,
          qty: 1,
        },
      ];
    });
    setIsBagOpen(true);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors text-left font-sans"
      
    >
      {/* Top Banner */}
      <div
        className="w-full py-2.5 px-4 text-center text-xs font-mono border-b flex items-center justify-center gap-2"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          color: "#9aa0aa",
        }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Complimentary Climate-Neutral Delivery Worldwide On Orders Over $250</span>
      </div>

      {/* Atelier Navigation */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Mobile Menu Trigger & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-4 w-4" />
              <span
                className="text-sm sm:text-base font-bold tracking-tight uppercase"
                
              >
                {brandName || "Atelier Objects"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wide uppercase" >
            <a href="#outerwear" className="hover:text-[#f4f4f7] transition-colors">
              Outerwear
            </a>
            <a href="#modular" className="hover:text-[#f4f4f7] transition-colors">
              Modular Gear
            </a>
            <a href="#archive" className="hover:text-[#f4f4f7] transition-colors">
              Archive
            </a>
            <a href="#provenance" className="hover:text-[#f4f4f7] transition-colors">
              Provenance
            </a>
          </nav>

          {/* Actions: Wishlist & Bag */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2.5 rounded-full border transition-colors hover:bg-black/5 dark:hover:bg-white/5 hidden sm:flex items-center justify-center"
              
              aria-label="Wishlist"
            >
              <Heart className={\`h-4 w-4 transition-colors \${isWishlisted ? "fill-rose-500 text-rose-500" : ""}\`} />
            </button>

            <button
              onClick={() => setIsBagOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all shadow-sm hover:scale-[1.02]"
              
            >
              <ShoppingBag className="h-4 w-4 text-[#6366f1]" />
              <span>Bag ({bagItems.reduce((acc, i) => acc + i.qty, 0)})</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b overflow-hidden"
              
            >
              <div className="px-4 py-4 space-y-3 text-xs uppercase font-medium">
                <a
                  href="#outerwear"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Outerwear (Winter 2026)
                </a>
                <a
                  href="#modular"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Modular Utility Systems
                </a>
                <a
                  href="#archive"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Archive & Limited Runs
                </a>
                <a
                  href="#provenance"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5"
                >
                  Fabric Provenance & Kyoto Mills
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Product Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-mono mb-6" >
          <span>Archive 2026</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Technical Outerwear</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#f4f4f7] font-medium">No. 04 Modular Field Parka</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Tactile Product Visual Showcase */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="w-full aspect-[4/5] sm:aspect-[4/4] rounded-2xl border p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all shadow-lg group"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#f4f3f0",
                borderColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: "0.75rem",
              }}
            >
              {/* Product Badge Header */}
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col gap-1.5">
                  <span
                    className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm"
                    
                  >
                    Edition 04 \u2022 200 Handcrafted Units
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium pl-1">
                    In Stock \u2022 Ready to Dispatch
                  </span>
                </div>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-3 rounded-full border shadow-sm transition-transform active:scale-95 hover:scale-105"
                  
                  aria-label="Save to wishlist"
                >
                  <Heart
                    className={\`h-4 w-4 transition-colors \${
                      isWishlisted ? "fill-rose-500 text-rose-500" : "text-[#9aa0aa]"
                    }\`}
                  />
                </button>
              </div>

              {/* Product Visual Centerpiece */}
              <div className="w-full flex-1 flex flex-col items-center justify-center my-6">
                <div
                  className="w-52 sm:w-64 h-64 sm:h-80 rounded-2xl shadow-2xl transition-all duration-700 border flex flex-col justify-between p-6 relative overflow-hidden"
                  style={{
                    backgroundColor: colors.find((c) => c.name === selectedColor)?.hex,
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  {/* Subtle woven texture overlay */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                      backgroundSize: "8px 8px",
                    }}
                  />

                  <div className="flex justify-between items-center text-xs font-mono text-white/80 tracking-widest uppercase z-10">
                    <span>ATELIER NO. 04</span>
                    <span className="border border-white/20 px-2 py-0.5 rounded text-[11px]">JAPAN</span>
                  </div>

                  <div className="text-center z-10 space-y-1">
                    <p className="text-white font-mono text-base tracking-wider font-semibold">
                      {selectedColor.toUpperCase()}
                    </p>
                    <p className="text-white/75 font-mono text-xs">
                      {productImages[activeImageIndex].label}
                    </p>
                  </div>

                  <div className="flex justify-between items-end text-xs font-mono text-white/80 z-10">
                    <span>KYOTO MILL</span>
                    <span>320 GSM GABARDINE</span>
                  </div>
                </div>

                <p className="text-xs font-mono mt-4 text-center max-w-sm" >
                  {productImages[activeImageIndex].desc}
                </p>
              </div>

              {/* Bottom Technical Spec Bar */}
              <div
                className="flex items-center justify-between text-xs font-mono pt-3 border-t z-10"
                
              >
                <span>Hand-stitched in Kyoto, JP</span>
                <span>Waterproof 20,000mm Rating</span>
              </div>
            </div>

            {/* Thumbnail View Switcher */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={\`p-3 rounded-xl border text-left transition-all \${
                    activeImageIndex === idx
                      ? "ring-2 shadow-sm"
                      : "opacity-70 hover:opacity-100"
                  }\`}
                  style={{
                    backgroundColor: "#12141c",
                    borderColor: activeImageIndex === idx ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <p className="text-xs sm:text-sm font-semibold truncate">{img.label}</p>
                  <p className="text-xs font-mono truncate mt-0.5" >
                    View 0{idx + 1}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Specification & Purchase Engine */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#6366f1] font-semibold">
                  Modular System Series
                </span>
                <span className="text-xs font-mono opacity-40">\u2022</span>
                <div className="flex items-center text-amber-500 text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  <span className="text-xs font-mono ml-1 font-semibold">4.9</span>
                  <span className="text-xs font-mono opacity-60 ml-1">(48 verified reviews)</span>
                </div>
              </div>

              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2"
                
              >
                The No. 04 Modular Field Parka
              </h1>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-bold">$380</span>
                <span className="text-xs font-mono" >
                  USD \u2022 VAT Included
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed" >
              Engineered for extreme versatility across unpredictable climates. Crafted with double-faced Japanese gabardine cotton, detachable storm hood, and interior harness for thermal heat regulation.
            </p>

            {/* Color Selector */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium">Selected Colorway:</span>
                <span className="font-mono font-semibold text-[#6366f1]">{selectedColor}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name as any)}
                    className={\`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all \${
                      selectedColor === c.name
                        ? "ring-2 shadow-sm font-semibold"
                        : "opacity-75 hover:opacity-100"
                    }\`}
                    style={{
                      backgroundColor: "#12141c",
                      borderColor: selectedColor === c.name ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded-full border shrink-0"
                      style={{ backgroundColor: c.hex, borderColor: "rgba(0,0,0,0.15)" }}
                    />
                    <span className="text-xs truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium">Select Size (EU/US):</span>
                <button className="text-xs font-mono underline hover:text-[#6366f1] transition-colors">
                  Size Guide & Fit Predictor
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["S", "M", "L", "XL"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={\`h-11 rounded-xl text-xs sm:text-sm font-mono font-medium border transition-all flex items-center justify-center \${
                      selectedSize === s
                        ? "shadow-sm font-bold"
                        : "opacity-70 hover:opacity-100"
                    }\`}
                    style={{
                      backgroundColor: selectedSize === s ? "#181a24" : "#12141c",
                      borderColor: selectedSize === s ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                      color: selectedSize === s ? "#6366f1" : "#f4f4f7",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                \u25CF In stock in Size {selectedSize} \u2014 2 units remain for immediate dispatch
              </p>
            </div>

            {/* Add to Bag CTA */}
            <div className="space-y-3.5 pt-2">
              <button
                onClick={handleAddToBag}
                className="w-full h-12 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5"
                
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Shopping Bag \u2014 $380 USD</span>
              </button>

              <div
                className="grid grid-cols-3 gap-2 p-3.5 rounded-xl border text-center text-xs font-mono"
                
              >
                <div className="flex flex-col items-center gap-1">
                  <Truck className="h-4 w-4 text-[#6366f1]" />
                  <span className="text-[11px]">DHL Express (2-3d)</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x" >
                  <RotateCcw className="h-4 w-4 text-[#6366f1]" />
                  <span className="text-[11px]">30-Day Atelier Trial</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-[#6366f1]" />
                  <span className="text-[11px]">Lifetime Repair</span>
                </div>
              </div>
            </div>

            {/* Structured Technical Specifications */}
            <div
              className="border-t divide-y text-xs sm:text-sm"
              
            >
              {[
                {
                  id: "materials",
                  title: "Materials & Kyoto Provenance",
                  content:
                    "Crafted from 100% recycled organic Japanese gabardine cotton (320gsm) infused with an invisible micro-porous membrane. Horn buttons sustainably sourced from traditional Bavarian workshops.",
                },
                {
                  id: "fit",
                  title: "Architectural Cut & Proportions",
                  content:
                    "Designed with a relaxed contemporary drop-shoulder cut allowing effortless layering over heavy knitwear. Model is 186cm wearing size M.",
                },
                {
                  id: "sustainability",
                  title: "Circularity & Repair Guarantee",
                  content:
                    "Every Atelier No. 04 garment includes our free lifetime restitching and hardware replacement guarantee at our studios in Kyoto and Zurich.",
                },
              ].map((item) => (
                <div key={item.id} className="py-3.5">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between font-medium text-left hover:text-[#6366f1] transition-colors text-xs sm:text-sm"
                  >
                    <span>{item.title}</span>
                    <span className="font-mono text-sm">{openAccordion === item.id ? "\u2212" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {openAccordion === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-2 text-xs sm:text-sm leading-relaxed"
                        
                      >
                        {item.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Slide-over Shopping Bag Drawer */}
      <AnimatePresence>
        {isBagOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
            onClick={() => setIsBagOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md h-full border-l p-6 flex flex-col justify-between shadow-2xl"
              style={{
                backgroundColor: "#12141c",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <div>
                <div
                  className="flex items-center justify-between pb-4 border-b"
                  
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="h-5 w-5 text-[#6366f1]" />
                    <span className="font-bold text-sm sm:text-base tracking-tight uppercase">
                      Shopping Bag ({bagItems.reduce((acc, i) => acc + i.qty, 0)})
                    </span>
                  </div>
                  <button
                    onClick={() => setIsBagOpen(false)}
                    className="p-2 rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    
                    aria-label="Close bag"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="py-4 space-y-4 max-h-[50vh] overflow-y-auto">
                  {bagItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border flex items-start justify-between gap-3"
                      
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-xs sm:text-sm leading-tight">{item.name}</p>
                        <p className="text-xs font-mono" >
                          {item.color} \u2022 Size {item.size}
                        </p>
                        <p className="font-mono text-sm font-bold text-[#6366f1]">
                          \${item.price * item.qty} USD
                        </p>
                      </div>

                      <div
                        className="flex items-center gap-2 border rounded-lg p-1 text-xs"
                        
                      >
                        <button
                          onClick={() => {
                            if (item.qty > 1) {
                              setBagItems((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty - 1 } : i))
                              );
                            } else {
                              setBagItems((prev) => prev.filter((i) => i.id !== item.id));
                            }
                          }}
                          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono px-1 font-semibold">{item.qty}</span>
                        <button
                          onClick={() => {
                            setBagItems((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
                            );
                          }}
                          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {bagItems.length === 0 && (
                    <div className="py-12 text-center text-xs sm:text-sm font-mono" >
                      Your shopping bag is currently empty.
                    </div>
                  )}
                </div>
              </div>

              {/* Checkout Summary Footer */}
              <div
                className="pt-4 border-t space-y-3"
                
              >
                <div className="space-y-1.5 text-xs sm:text-sm font-mono">
                  <div className="flex justify-between" >
                    <span>Shipping (Climate-Neutral)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Complimentary</span>
                  </div>
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-[#6366f1]">\${bagSubtotal} USD</span>
                  </div>
                </div>

                <button
                  disabled={bagItems.length === 0}
                  onClick={() => alert(\`Initiating secure encrypted checkout for $\${bagSubtotal} USD...\`)}
                  className="w-full h-12 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  
                >
                  <span>Proceed to Encrypted Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atelier Footer */}
      <footer
        className="py-10 px-4 sm:px-6 lg:px-8 border-t text-xs sm:text-sm transition-colors"
        
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>\xA9 {new Date().getFullYear()} {brandName || "Atelier Objects"}. Sustainable luxury garment architecture.</p>
          <div className="flex items-center gap-5 text-xs font-mono">
            <a href="#circularity" className="hover:underline">Circularity Report</a>
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
`
};

// src/registry/template-agency-creative.ts
var templateAgencyCreative = {
  name: "template-agency-creative",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-agency-creative.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Layers,
  Code2,
  Cpu,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  X,
  Menu,
  Sliders,
  Calendar,
  ShieldCheck,
  Check,
  ExternalLink,
} from "lucide-react";

export interface AgencyCreativeTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function AgencyCreativeTemplate({
  brandName = "Vanguard Digital",
  theme = "dark",
}: AgencyCreativeTemplateProps) {
  
    const isDark = theme === "dark";

  const [activeService, setActiveService] = useState<number>(0);
  const [budgetSlider, setBudgetSlider] = useState(45); // $45k
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const services = [
    {
      num: "01",
      title: "Real-Time 3D & WebGL Systems",
      desc: "Custom GLSL fragment shaders, physics simulation, and 60FPS fluid canvas architectures built for enterprise hardware scales.",
      deliverables: ["Custom Shaders", "Asset Compression Pipeline", "Sub-200ms TTFB", "Spatial Interaction"],
      leadTime: "3-4 Weeks",
      focus: "Hardware Accelerated",
    },
    {
      num: "02",
      title: "Design Systems & Token Architecture",
      desc: "Multi-brand token architectures, accessible primitive engines, and automated NPM distribution pipelines for Fortune 500 engineering teams.",
      deliverables: ["WCAG AAA Compliant", "Figma Token Sync", "Automated Playwright Tests", "Zero-Runtime CSS"],
      leadTime: "4-6 Weeks",
      focus: "Design Ops & Code",
    },
    {
      num: "03",
      title: "Autonomous Agentic Interfaces",
      desc: "Generative UI workflows, streaming multimodal canvas surfaces, and natural language command systems engineered for high-trust workflows.",
      deliverables: ["Zero-Latency Streaming", "Edge Quantization", "State Machine Sync", "Sandboxed Evaluation"],
      leadTime: "6-8 Weeks",
      focus: "AI Reasoning UX",
    },
  ];

  const recentPartners = [
    { name: "Vercel Ecosystem", category: "Framework Infrastructure" },
    { name: "Monolith Robotics", category: "Autonomous Systems" },
    { name: "Kinetix Bio", category: "Computational Genomics" },
    { name: "Hyperion Capital", category: "Quantitative Treasury" },
  ];

  return (
    <div
      className="w-full min-h-screen transition-colors text-left font-sans"
      
    >
      {/* Top Global Ticker */}
      <div
        className="w-full py-2.5 px-4 sm:px-6 text-xs font-mono border-b flex items-center justify-between transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
          borderColor: "rgba(255, 255, 255, 0.08)",
          color: "#9aa0aa",
        }}
      >
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NYC 09:42 EST</span>
          </span>
          <span className="hidden sm:inline">LDN 14:42 GMT</span>
          <span className="hidden md:inline">TYO 23:42 JST</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block px-2.5 py-1 rounded border text-xs font-semibold" >
            Q3 Bandwidth: 2 Sprints Open
          </span>
        </div>
      </div>

      {/* Studio Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4" />
              <span
                className="font-extrabold text-sm sm:text-base tracking-tight uppercase"
                
              >
                {brandName || "Vanguard Digital"}
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-wider" >
            <a href="#capabilities" className="hover:text-[#f4f4f7] transition-colors">
              Capabilities
            </a>
            <a href="#partners" className="hover:text-[#f4f4f7] transition-colors">
              Selected Work
            </a>
            <a href="#estimator" className="hover:text-[#f4f4f7] transition-colors">
              Investment Model
            </a>
            <a href="#studio" className="hover:text-[#f4f4f7] transition-colors">
              Studio Dossier
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProposalModalOpen(true)}
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 shrink-0"
              
            >
              <span>Initiate Sprint</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-b overflow-hidden"
              
            >
              <div className="px-4 py-4 space-y-3 text-xs uppercase font-medium">
                <a
                  href="#capabilities"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Studio Capabilities
                </a>
                <a
                  href="#partners"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Selected Client Partners
                </a>
                <a
                  href="#estimator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 border-b"
                  
                >
                  Scope & Investment Calculator
                </a>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsProposalModalOpen(true);
                  }}
                  className="w-full text-left py-2.5 text-[#6366f1] font-bold flex items-center justify-between"
                >
                  <span>Request Studio Pitch</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 lg:pt-28 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider mb-6" >
            <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
            <span>Digital Product Engineering Studio \u2022 Global</span>
          </div>

          <h1
            className="text-2xl @xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.08] mb-6"
            
          >
            We engineer singular digital products that define categorical market leadership.
          </h1>

          <p className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mb-8" >
            Operating at the intersection of high-fidelity interface design, real-time graphics engineering, and autonomous agent orchestration for world-defining technology institutions.
          </p>
        </div>

        {/* Studio Impact Metric Ledger */}
        <div
          className="grid grid-cols-1 @xs:grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border shadow-sm mt-8"
          
        >
          <div className="space-y-1">
            <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#6366f1]">$1.8B+</p>
            <p className="text-xs uppercase font-semibold" >Valuation Created</p>
            <p className="text-xs font-mono" >Across 18 enterprise exits</p>
          </div>
          <div className="space-y-1 @xs:border-l @xs:pl-4" >
            <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight">42</p>
            <p className="text-xs uppercase font-semibold" >Design Systems</p>
            <p className="text-xs font-mono" >Enterprise token pipelines</p>
          </div>
          <div className="space-y-1 md:border-l md:pl-4" >
            <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight">99.8%</p>
            <p className="text-xs uppercase font-semibold" >Sprint Velocity SLA</p>
            <p className="text-xs font-mono" >Weekly zero-defect releases</p>
          </div>
          <div className="space-y-1 @xs:border-l @xs:pl-4" >
            <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight">14x</p>
            <p className="text-xs uppercase font-semibold" >Industry Honors</p>
            <p className="text-xs font-mono" >Awwwards SOTD & Red Dot Best</p>
          </div>
        </div>
      </section>

      {/* Selected Client Partners Strip */}
      <section id="partners" className="py-12 border-y transition-colors" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <span className="text-xs font-mono uppercase tracking-widest font-semibold" >
              Selected Collaborative Engagements
            </span>
            <span className="text-xs font-mono" >
              Deployments 2024\u20132026
            </span>
          </div>

          <div className="grid grid-cols-1 @xs:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentPartners.map((p, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.01]"
                
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm sm:text-base tracking-tight">{p.name}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-50" />
                </div>
                <span className="text-xs font-mono" >
                  {p.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Capabilities Section */}
      <section id="capabilities" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest mb-2 text-[#6366f1] font-semibold">
              Studio Core Practices
            </p>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
              
            >
              Architectural Capabilities
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono max-w-xs" >
            Select any capability domain to inspect engineering deliverables and typical turnaround cycles.
          </p>
        </div>

        <div className="space-y-4">
          {services.map((svc, idx) => (
            <div
              key={idx}
              onClick={() => setActiveService(idx)}
              className={\`p-6 sm:p-8 rounded-2xl border cursor-pointer transition-all shadow-sm \${
                activeService === idx
                  ? "ring-2 shadow-md"
                  : "hover:scale-[1.005] opacity-80 hover:opacity-100"
              }\`}
              style={{
                backgroundColor: activeService === idx ? "#181a24" : "#12141c",
                borderColor: activeService === idx ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                borderRadius: "0.75rem",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-sm sm:text-base font-bold text-[#6366f1]">
                    {svc.num}
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3
                        className="text-lg sm:text-xl font-bold tracking-tight"
                        
                      >
                        {svc.title}
                      </h3>
                      <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-xs font-mono border" >
                        {svc.focus}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed max-w-2xl" >
                      {svc.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono shrink-0">
                  <span className="text-xs" >Lead: {svc.leadTime}</span>
                  <div className="p-1.5 rounded-lg border" >
                    <ArrowUpRight
                      className={\`h-4 w-4 transition-transform duration-300 \${
                        activeService === idx ? "rotate-45 text-[#6366f1]" : ""
                      }\`}
                    />
                  </div>
                </div>
              </div>

              {activeService === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 pt-5 border-t space-y-4"
                  
                >
                  <p className="text-xs font-mono font-semibold uppercase tracking-wider" >
                    Guaranteed Architectural Deliverables:
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {svc.deliverables.map((del, dIdx) => (
                      <span
                        key={dIdx}
                        className="px-3 py-1.5 rounded-lg border flex items-center gap-2 shadow-sm"
                        
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{del}</span>
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Scope & Investment Estimator */}
      <section id="estimator" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div
          className="p-6 sm:p-10 rounded-2xl border shadow-xl transition-all"
          
        >
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6366f1] font-semibold mb-2">
              <Sliders className="h-4 w-4" />
              <span>Dedicated Sprint Calibration</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
              
            >
              Interactive Scope & Investment Estimator
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed" >
              Select your capital commitment to calibrate allocated engineering staff, weekly sprint volume, and time-to-production cadence.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" >
              <div>
                <span className="text-xs font-mono uppercase font-semibold" >
                  Target Sprint Allocation
                </span>
                <p className="text-xs" >Fixed weekly retainers with zero scope-creep</p>
              </div>
              <span className="font-mono text-3xl font-bold text-[#6366f1]">
                \${budgetSlider},000 <span className="text-xs font-normal opacity-60">USD</span>
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min={20}
                max={120}
                step={5}
                value={budgetSlider}
                onChange={(e) => setBudgetSlider(Number(e.target.value))}
                className="w-full cursor-pointer h-2.5 rounded-lg appearance-none bg-zinc-200 dark:bg-zinc-800 accent-[#6366f1]"
                style={{ accentColor: "#6366f1" }}
              />
              <div className="flex justify-between text-xs font-mono" >
                <span>$20k (Focused Sprint)</span>
                <span>$60k (Standard Multi-Team)</span>
                <span>$120k (Full Platform Build)</span>
              </div>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t text-xs font-mono"
              
            >
              <div className="p-4 rounded-xl border" >
                <p className="text-xs uppercase font-semibold mb-1" >
                  ESTIMATED RUNTIME
                </p>
                <p className="font-bold text-sm">
                  {Math.round(budgetSlider / 10)} to {Math.round(budgetSlider / 7)} Weeks
                </p>
              </div>
              <div className="p-4 rounded-xl border" >
                <p className="text-xs uppercase font-semibold mb-1" >
                  ENGINEERING SQUAD
                </p>
                <p className="font-bold text-sm">
                  {budgetSlider > 60
                    ? "Principal Lead + 3 Senior Eng + 1 3D"
                    : "Lead Designer + 2 Full-Stack Eng"}
                </p>
              </div>
              <div className="p-4 rounded-xl border" >
                <p className="text-xs uppercase font-semibold mb-1" >
                  DELIVERY CADENCE
                </p>
                <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  Continuous Weekly Releases
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setIsProposalModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                
              >
                <span>Request Scope Pitch for \${budgetSlider}k</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono" >
                Guaranteed NDA on first contact \u2022 Response within 6 business hours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* RFP / Proposal Modal */}
      <AnimatePresence>
        {isProposalModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsProposalModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl relative"
              style={{
                backgroundColor: "#12141c",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
                borderRadius: "0.75rem",
              }}
            >
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5"
                
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              {proposalSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Scope Brief Received</h3>
                  <p className="text-xs sm:text-sm max-w-sm mx-auto" >
                    Our partner engineering leads have queued your brief. We will dispatch the mutual NDA and scheduling link within 6 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setProposalSubmitted(false);
                      setIsProposalModalOpen(false);
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white"
                    
                  >
                    Return to Studio
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div>
                    <span className="text-xs font-mono text-[#6366f1] font-semibold uppercase">
                      Sprint RFP
                    </span>
                    <h3 className="text-xl font-bold tracking-tight">Initiate Engineering Scope</h3>
                    <p className="text-xs" >
                      Target allocation: \${budgetSlider},000 USD
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono mb-1 font-medium">Work Email</label>
                      <input
                        type="email"
                        placeholder="vp.eng@institution.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none focus:ring-2"
                        
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1 font-medium">Primary Focus</label>
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none"
                        
                      >
                        <option value="shaders">Real-Time 3D & WebGL</option>
                        <option value="tokens">Design Systems & Token Architecture</option>
                        <option value="agents">Autonomous Agentic Interfaces</option>
                        <option value="full">Comprehensive Full-Stack Redesign</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1 font-medium">Brief Description / Requirements</label>
                      <textarea
                        rows={3}
                        placeholder="Brief summary of target outcomes, architectural constraints, and desired launch date..."
                        className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none resize-none"
                        
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setProposalSubmitted(true)}
                    className="w-full py-3 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    
                  >
                    <span>Submit RFP Under Mutual NDA</span>
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Studio Footer */}
      <footer
        className="py-12 px-4 sm:px-6 lg:px-8 border-t text-xs transition-colors"
        
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <p>\xA9 {new Date().getFullYear()} {brandName || "Vanguard Digital"}. High-velocity product engineering.</p>
          <div className="flex items-center gap-6">
            <a href="#github" className="hover:underline">GitHub</a>
            <a href="#npm" className="hover:underline">NPM Packages</a>
            <a href="#careers" className="hover:underline">Careers (2)</a>
            <a href="#security" className="hover:underline">SOC2 Type II</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
`
};

// src/registry/template-ai-chat.ts
var templateAiChat = {
  name: "template-ai-chat",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-ai-chat.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  Copy,
  Check,
  ChevronDown,
  Cpu,
  Terminal,
  Paperclip,
  Globe,
  CornerDownLeft,
  ChevronRight,
  Menu,
  X,
  BrainCircuit,
} from "lucide-react";

export interface AiChatTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function AiChatTemplate({
  brandName = "Cortex Assistant",
  theme = "dark",
}: AiChatTemplateProps) {
  
    const isDark = theme === "dark";

  const [activeModel, setActiveModel] = useState<"Cortex Reasoning R1" | "Cortex Fast 4o" | "Vision Pro">("Cortex Reasoning R1");
  const [inputText, setInputText] = useState("");
  const [isThinkingOpen, setIsThinkingOpen] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "user",
      content: "Write an edge-safe cache key generator in TypeScript with SHA-256 cryptographic fingerprinting.",
    },
    {
      role: "assistant",
      thought: "Using the Web Crypto API crypto.subtle.digest to guarantee edge runtime compatibility without Node.js crypto dependencies.",
      content: \`export async function createEdgeCacheKey(
  pathname: string,
  params: Record<string, string>
): Promise<string> {
  const normalizedParams = Object.keys(params)
    .sort()
    .map((k) => \\\`\\\${k}=\\\${encodeURIComponent(params[k])}\\\`)
    .join("&");
  const rawKey = \\\`\\\${pathname}?\\\${normalizedParams}\\\`;
  
  const msgBuffer = new TextEncoder().encode(rawKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}\`,
    },
  ]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMsg },
      {
        role: "assistant",
        thought: "Analyzing request against edge vector index and generating structured response...",
        content: \`Acknowledged: "\${userMsg}". Edge telemetry active. Generated response stream in 1.4ms.\`,
      },
    ]);
    setInputText("");
  };

  return (
    <div
      className="w-full min-h-screen transition-colors flex flex-col md:flex-row font-sans"
      
    >
      {/* Mobile Top Navigation Header */}
      <header
        className="md:hidden flex items-center justify-between px-4 py-3 border-b shrink-0"
        
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg border text-xs"
            
            aria-label="Toggle threads drawer"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div
            className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0"
            
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm" >
            {brandName || "Cortex AI"}
          </span>
        </div>

        <button
          onClick={() => {
            setMessages([]);
            setInputText("");
          }}
          className="p-2 rounded-lg border text-xs flex items-center gap-1.5"
          
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Chat</span>
        </button>
      </header>

      {/* Mobile Sidebar Dropdown */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b p-4 space-y-3 text-sm overflow-hidden"
            
          >
            <p className="text-xs font-mono uppercase tracking-wider opacity-60">Recent Threads</p>
            <div className="space-y-1.5">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-white text-left truncate"
                
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">Edge Cache Key Generator</span>
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-80 hover:opacity-100 text-left truncate"
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">Postgres Vector Indexing</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sessions Sidebar */}
      <aside
        className="hidden md:flex w-64 border-r p-5 shrink-0 flex-col justify-between transition-colors text-sm"
        
      >
        <div>
          {/* Header */}
          <div
            className="flex items-center justify-between pb-3.5 mb-4 border-b"
            
          >
            <div className="flex items-center gap-2.5">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
                
              >
                <Sparkles className="h-4 w-4" />
              </div>
              <span
                className="font-bold text-sm tracking-tight truncate"
                
              >
                {brandName || "Cortex AI"}
              </span>
            </div>

            <button
              onClick={() => {
                setMessages([]);
                setInputText("");
              }}
              title="New Chat"
              className="p-2 rounded-lg border hover:opacity-80 transition-opacity"
              
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Session History */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider opacity-60">Recent Threads</p>
            <div className="space-y-1.5">
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-white text-left truncate shadow-sm"
                
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">Edge Cache Key Generator</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-75 hover:opacity-100 text-left truncate transition-opacity">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">Postgres Vector Indexing</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-75 hover:opacity-100 text-left truncate transition-opacity">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">Rust WebSocket Gateway</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t text-xs font-mono opacity-70" >
          <span>1,420 / 10,000 Monthly Credits</span>
        </div>
      </aside>

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col justify-between min-h-[600px] overflow-hidden min-w-0">
        {/* Model Bar */}
        <div
          className="px-4 sm:px-6 py-3 border-b flex items-center justify-between text-xs sm:text-sm transition-colors shrink-0"
          
        >
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-60 uppercase font-mono">Model:</span>
            <span className="font-semibold" >
              {activeModel}
            </span>
          </div>

          <span className="text-xs font-mono text-emerald-500 font-medium">\u25CF Connected</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={\`flex flex-col \${msg.role === "user" ? "items-end" : "items-start"}\`}
            >
              {msg.role === "user" ? (
                <div
                  className="max-w-xl p-4 rounded-2xl text-xs sm:text-sm font-medium text-white shadow-sm"
                  
                >
                  {msg.content}
                </div>
              ) : (
                <div
                  className="w-full max-w-3xl p-4 sm:p-6 rounded-2xl border text-xs sm:text-sm space-y-3.5 transition-all"
                  
                >
                  {/* Thought process indicator */}
                  {msg.thought && (
                    <div
                      className="p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all"
                      style={{
                        backgroundColor: "#161822",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        color: "#9aa0aa",
                        borderRadius: "0.75rem",
                      }}
                    >
                      <button
                        onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                        className="w-full flex items-center justify-between font-medium mb-1"
                      >
                        <span className="flex items-center gap-2">
                          <BrainCircuit className="h-4 w-4"  />
                          <span >Reasoning Trace</span>
                        </span>
                        <ChevronDown className={\`h-4 w-4 transition-transform \${isThinkingOpen ? "rotate-180" : ""}\`} />
                      </button>

                      {isThinkingOpen && (
                        <p className="pt-1.5 opacity-90">{msg.thought}</p>
                      )}
                    </div>
                  )}

                  {/* Code snippet block */}
                  <div
                    className="rounded-xl border font-mono text-xs sm:text-sm overflow-hidden"
                    style={{
                      backgroundColor: isDark ? "#08090d" : "#11131a",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      color: "#fafafa",
                      borderRadius: "0.75rem",
                    }}
                  >
                    <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10 text-xs">
                      <span className="text-zinc-400">TypeScript (Edge Runtime)</span>
                      <button
                        onClick={() => handleCopyCode(msg.content)}
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                      >
                        {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedCode ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-zinc-200 text-xs sm:text-sm leading-relaxed">
                      <code>{msg.content}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div
          className="p-3 sm:p-5 border-t transition-colors shrink-0"
          
        >
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2.5 p-2 rounded-xl border transition-all focus-within:ring-1"
            
          >
            <button
              type="button"
              className="p-2 rounded-lg opacity-60 hover:opacity-100 transition-opacity shrink-0"
              aria-label="Attach File"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a technical or architectural question..."
              className="flex-1 bg-transparent text-xs sm:text-sm focus:outline-none min-w-0"
              
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-lg text-white transition-all disabled:opacity-40 hover:brightness-110 shrink-0"
              style={{
                backgroundColor: "#6366f1",
                borderRadius: "calc(0.75rem - 2px)",
              }}
              aria-label="Send prompt"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
`
};

// src/registry/template-project-management.ts
var templateProjectManagement = {
  name: "template-project-management",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-project-management.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Kanban,
  ListFilter,
  Plus,
  Flame,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";

export interface ProjectManagementTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function ProjectManagementTemplate({
  brandName = "Orbit Flow",
  theme = "dark",
}: ProjectManagementTemplateProps) {
  
    const isDark = theme === "dark";

  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [activeMobileCol, setActiveMobileCol] = useState("progress");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"Urgent" | "High" | "Medium">("High");

  const [issues, setIssues] = useState([
    { id: "ORB-101", title: "Migrate Postgres connections to PgBouncer connection pool", col: "progress", priority: "Urgent", pts: "5", user: "JD" },
    { id: "ORB-102", title: "Implement Web Crypto HMAC SHA-256 tokens", col: "review", priority: "High", pts: "3", user: "SK" },
    { id: "ORB-103", title: "Optimize CSS bundle tree-shaking with Tailwind v4", col: "done", priority: "Medium", pts: "2", user: "UR" },
    { id: "ORB-104", title: "Add multi-region edge failover circuit breaker", col: "backlog", priority: "High", pts: "8", user: "AL" },
    { id: "ORB-105", title: "Refactor global navigation sheet drawer for mobile", col: "done", priority: "Medium", pts: "3", user: "SK" },
  ]);

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newId = \`ORB-\${100 + issues.length + 1}\`;
    setIssues((prev) => [
      { id: newId, title: newTitle.trim(), col: "backlog", priority: newPriority, pts: "3", user: "ME" },
      ...prev,
    ]);
    setNewTitle("");
    setIsCreateOpen(false);
  };

  const columns = [
    { id: "backlog", label: "Backlog", dotColor: "#94a3b8" },
    { id: "progress", label: "In Progress", dotColor: "#f59e0b" },
    { id: "review", label: "In Review", dotColor: "#8b5cf6" },
    { id: "done", label: "Done", dotColor: "#10b981" },
  ];

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all shrink-0"
              
            >
              <Layers className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-sm sm:text-base tracking-tight"
              
            >
              {brandName || "Orbit Flow"}
            </span>

            {/* Sprint Velocity pill */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono"
              
            >
              <span>Sprint 28</span>
              <span className="opacity-40">\u2022</span>
              <span className="text-emerald-500 font-bold">38/48 pts (79%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switcher */}
            <div
              className="flex items-center p-1 rounded-lg border text-xs"
              
            >
              <button
                onClick={() => setViewMode("board")}
                className={\`px-3 py-1.5 rounded font-medium transition-all \${
                  viewMode === "board" ? "shadow-sm font-semibold text-white" : "opacity-70 hover:opacity-100"
                }\`}
                style={{
                  backgroundColor: viewMode === "board" ? "#6366f1" : "transparent",
                  color: viewMode === "board" ? "#ffffff" : "#f4f4f7",
                  borderRadius: "calc(0.75rem - 4px)",
                }}
              >
                Board
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={\`px-3 py-1.5 rounded font-medium transition-all \${
                  viewMode === "list" ? "shadow-sm font-semibold text-white" : "opacity-70 hover:opacity-100"
                }\`}
                style={{
                  backgroundColor: viewMode === "list" ? "#6366f1" : "transparent",
                  color: viewMode === "list" ? "#ffffff" : "#f4f4f7",
                  borderRadius: "calc(0.75rem - 4px)",
                }}
              >
                List
              </button>
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg text-white shadow-sm transition-all hover:brightness-110 flex items-center gap-2 shrink-0"
              
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Issue</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Kanban & Issue Content */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {viewMode === "board" ? (
          <div>
            {/* Mobile Column Switcher (Visible on small containers < @md to prevent compressed vertical columns) */}
            <div className="md:hidden flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
              {columns.map((col) => {
                const count = issues.filter((i) => i.col === col.id).length;
                const isSelected = activeMobileCol === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => setActiveMobileCol(col.id)}
                    className={\`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 shrink-0 transition-all \${
                      isSelected ? "shadow-sm font-semibold ring-1" : "opacity-70"
                    }\`}
                    style={{
                      backgroundColor: isSelected ? "#181a24" : "#12141c",
                      borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                      color: "#f4f4f7",
                      borderRadius: "0.75rem",
                    }}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.dotColor }} />
                    <span>{col.label}</span>
                    <span className="text-xs opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Responsive Columns: 1-col on mobile, 2-col on tablet (md:), 4-col on desktop (xl:) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
              {columns.map((col) => {
                const colIssues = issues.filter((i) => i.col === col.id);
                const isHiddenOnMobile = activeMobileCol !== col.id;

                return (
                  <div
                    key={col.id}
                    className={\`rounded-2xl border p-4 flex flex-col justify-between min-h-[440px] sm:min-h-[500px] transition-all \${
                      isHiddenOnMobile ? "hidden md:flex" : "flex"
                    }\`}
                    style={{
                      backgroundColor: "#12141c",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      borderRadius: "0.75rem",
                      }}
                  >
                    <div>
                      <div
                        className="flex items-center justify-between pb-3.5 mb-3.5 border-b text-xs sm:text-sm font-mono"
                        
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.dotColor }} />
                          <span className="font-semibold" >
                            {col.label}
                          </span>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded border text-xs font-mono font-medium"
                          
                        >
                          {colIssues.length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {colIssues.map((issue) => (
                          <div
                            key={issue.id}
                            className="p-3.5 rounded-xl border text-xs sm:text-sm shadow-sm transition-all cursor-pointer hover:border-zinc-400"
                            
                          >
                            <div className="flex items-center justify-between text-xs font-mono mb-2">
                              <span >{issue.id}</span>
                              <span className="flex items-center gap-1 font-bold">
                                {issue.priority === "Urgent" && <Flame className="h-3.5 w-3.5 text-red-500" />}
                                <span style={{ color: issue.priority === "Urgent" ? "#ef4444" : "#9aa0aa" }}>
                                  {issue.priority}
                                </span>
                              </span>
                            </div>

                            <p
                              className="font-medium mb-3 leading-snug text-xs sm:text-sm"
                              
                            >
                              {issue.title}
                            </p>

                            <div
                              className="flex items-center justify-between pt-2.5 border-t text-xs font-mono"
                              
                            >
                              <span
                                className="px-2 py-0.5 rounded border text-xs"
                                
                              >
                                {issue.pts} pts
                              </span>
                              <div
                                className="h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs text-white"
                                
                              >
                                {issue.user}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCreateOpen(true)}
                      className="w-full mt-4 h-10 rounded-xl border border-dashed text-xs sm:text-sm opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 font-medium"
                      
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Issue</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div
            className="rounded-2xl border divide-y text-xs sm:text-sm font-mono overflow-hidden"
            
          >
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-20 opacity-60 shrink-0 font-medium">{issue.id}</span>
                  <span className="font-sans font-medium truncate" >
                    {issue.title}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 shrink-0">
                  <span
                    className="px-2.5 py-1 rounded border capitalize text-xs"
                    
                  >
                    {issue.col}
                  </span>
                  <span className="text-right opacity-80" >
                    {issue.pts} pts
                  </span>
                  <div
                    className="h-7 w-7 rounded-full text-white flex items-center justify-center font-bold text-xs"
                    
                  >
                    {issue.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Quick Issue Creator Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsCreateOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCreateIssue}
              className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <h3 className="font-bold text-base" >
                  Create New Issue
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1 rounded hover:opacity-75 transition-opacity"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" >
                  Issue Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement Webhook retry backoff"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent focus:outline-none"
                  
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" >
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(["Urgent", "High", "Medium"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={\`py-2 rounded-lg border font-medium transition-all \${
                        newPriority === p ? "shadow-sm font-semibold" : "opacity-70"
                      }\`}
                      style={{
                        backgroundColor: newPriority === p ? "#6366f1" : "transparent",
                        borderColor: newPriority === p ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                        color: newPriority === p ? "#ffffff" : "#f4f4f7",
                        borderRadius: "0.75rem",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium hover:opacity-80"
                  
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
                  
                >
                  Create Issue
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-startup-waitlist.ts
var templateStartupWaitlist = {
  name: "template-startup-waitlist",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-startup-waitlist.tsx",
  content: `"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Copy,
  Check,
  Zap,
  Users,
  Clock,
  Share2,
  CheckCircle2,
} from "lucide-react";

export interface StartupWaitlistTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function StartupWaitlistTemplate({
  brandName = "Genesis Stealth",
  theme = "dark",
}: StartupWaitlistTemplateProps) {
  
    const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queueNumber, setQueueNumber] = useState(142);
  const [copiedLink, setCopiedLink] = useState(false);

  // Simulated countdown
  const [timeLeft, setTimeLeft] = useState({ days: 18, hours: 9, mins: 42, secs: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setQueueNumber(Math.floor(Math.random() * 80) + 110);
    setIsSubmitted(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(\`https://genesis.stealth.dev/invite?ref=dev_\${queueNumber}\`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors relative flex flex-col justify-between font-sans text-center"
      
    >
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all shrink-0"
            
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <span
            className="font-bold text-sm sm:text-base tracking-tight"
            
          >
            {brandName || "Genesis Stealth"}
          </span>
        </div>

        <span
          className="text-xs font-mono px-3 py-1.5 rounded-full border transition-colors"
          
        >
          ALLOCATION #GNX-09
        </span>
      </header>

      {/* Main Suspense Hero */}
      <main className="px-4 sm:px-6 max-w-3xl mx-auto my-auto py-10 sm:py-16 w-full">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono mb-6 transition-colors"
          style={{
            backgroundColor: "#161822",
            borderColor: "rgba(255, 255, 255, 0.08)",
            color: "#6366f1",
          }}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Private Alpha Unlocks In:</span>
        </div>

        {/* Countdown Timer Block (Responsive single-row) */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-8 font-mono">
          {[
            { label: "DAYS", val: timeLeft.days },
            { label: "HOURS", val: timeLeft.hours },
            { label: "MINS", val: timeLeft.mins },
            { label: "SECS", val: timeLeft.secs },
          ].map((t, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-5 rounded-2xl border min-w-[64px] sm:min-w-[84px] transition-all"
              
            >
              <span className="text-2xl sm:text-4xl font-bold tracking-tight">
                {String(t.val).padStart(2, "0")}
              </span>
              <p className="text-xs mt-1 font-mono uppercase" >
                {t.label}
              </p>
            </div>
          ))}
        </div>

        <h1
          className="text-2xl @xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-[1.15]"
          
        >
          The Next Paradigm in Autonomous Compute.
        </h1>

        <p
          className="text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed"
          
        >
          We are building the fundamental runtime substrate for hyper-scale autonomous agents. Request early access
          to secure your dedicated compute quota.
        </p>

        {/* Email Capture Form or Queue Position */}
        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-2 rounded-2xl border flex flex-col sm:flex-row gap-2 shadow-lg transition-all"
            
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email..."
              className="flex-1 bg-transparent px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
              
            />
            <button
              type="submit"
              className="h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 flex items-center justify-center gap-2 shrink-0"
              style={{
                backgroundColor: "#6366f1",
                borderRadius: "calc(0.75rem - 3px)",
              }}
            >
              <span>Request Quota</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md mx-auto p-6 rounded-2xl border space-y-4 shadow-xl transition-all"
            style={{
              backgroundColor: "#181a24",
              borderColor: "#6366f1",
              borderRadius: "0.75rem",
            }}
          >
            <div className="flex items-center justify-center gap-2 text-emerald-500 text-xs sm:text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>You are officially in the alpha queue</span>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-bold font-mono" >
                #{queueNumber}
              </p>
              <p className="text-xs sm:text-sm mt-1" >
                Share your invite link to advance your priority
              </p>
            </div>

            <div
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-mono"
              
            >
              <span className="truncate opacity-80 max-w-[240px]">genesis.stealth.dev/ref={queueNumber}</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1.5 rounded hover:opacity-75 transition-opacity shrink-0"
                aria-label="Copy invitation link"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 opacity-70" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* Live Signups Ticker */}
        <div
          className="mt-8 flex items-center justify-center gap-2 text-xs sm:text-sm font-mono"
          
        >
          <Users className="h-4 w-4" />
          <span>4,892 verified engineers queued across 42 countries</span>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-8 px-4 border-t text-center text-xs sm:text-sm shrink-0"
        
      >
        <p>\xA9 {new Date().getFullYear()} {brandName || "Genesis Stealth"}. Non-disclosure terms apply.</p>
      </footer>
    </div>
  );
}
`
};

// src/registry/template-docs-platform.ts
var templateDocsPlatform = {
  name: "template-docs-platform",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-docs-platform.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Code2,
  Copy,
  Check,
  Send,
  Terminal,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle,
  FileCode,
  Layers,
  Menu,
  X,
  Play,
} from "lucide-react";

export interface DocsPlatformTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function DocsPlatformTemplate({
  brandName = "Codex Docs",
  theme = "dark",
}: DocsPlatformTemplateProps) {
  
    const isDark = theme === "dark";

  const [activeLang, setActiveLang] = useState<"curl" | "node" | "python" | "go">("curl");
  const [activeSection, setActiveSection] = useState("auth");
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const codeSnippets = {
    curl: \`curl -X POST https://api.codex.dev/v1/inference \\\\
  -H "Authorization: Bearer sk_live_849204" \\\\
  -H "Content-Type: application/json" \\\\
  -d '{"model": "r1-ultra", "stream": true, "max_tokens": 1024}'\`,
    node: \`import { Codex } from "@codex/sdk";

const client = new Codex({ apiKey: process.env.CODEX_API_KEY });
const stream = await client.inference.stream({
  model: "r1-ultra",
  maxTokens: 1024,
});\`,
    python: \`from codex import CodexClient

client = CodexClient(api_key="sk_live_849204")
response = client.inference.stream(
    model="r1-ultra",
    max_tokens=1024
)\`,
    go: \`package main

import "github.com/codex-dev/sdk-go"

func main() {
    client := codex.NewClient("sk_live_849204")
    // stream tokens with zero heap allocs
}\`,
  };

  const handleTestApi = () => {
    setIsSending(true);
    setApiResponse(null);
    setTimeout(() => {
      setIsSending(false);
      setApiResponse(
        JSON.stringify(
          {
            status: "success",
            data: {
              id: "inf_94829104",
              model: "r1-ultra",
              ttft_ms: 3.8,
              tokens_streamed: 840,
              cached: true,
            },
          },
          null,
          2
        )
      );
    }, 600);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans"
      
    >
      {/* Global Docs Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-lg border transition-colors"
              
              aria-label="Toggle Docs Navigation"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-all shrink-0"
              
            >
              <FileCode className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-sm sm:text-base tracking-tight"
              
            >
              {brandName || "Codex Docs"}
            </span>
            <span
              className="hidden sm:inline text-xs font-mono px-2 py-0.5 rounded border"
              
            >
              v3.2 Edge
            </span>
          </div>

          {/* Search Bar */}
          <div
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs sm:text-sm w-64 lg:w-80"
            style={{
              borderColor: "rgba(255, 255, 255, 0.08)",
              backgroundColor: "#12141c",
              color: "#9aa0aa",
              borderRadius: "0.75rem",
            }}
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 truncate">Search guides, SDKs, APIs...</span>
            <kbd
              className="px-1.5 py-0.5 rounded border text-xs font-mono"
              
            >
              \u2318K
            </kbd>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg text-white shadow-sm hover:brightness-110 transition-all shrink-0"
              
            >
              API Keys
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-b p-4 space-y-4 text-sm overflow-hidden"
              
            >
              <div>
                <p className="text-xs font-mono uppercase tracking-wider mb-2 opacity-60">
                  Getting Started
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveSection("overview");
                      setMobileNavOpen(false);
                    }}
                    className={\`w-full text-left px-3 py-2 rounded-lg transition-colors \${
                      activeSection === "overview" ? "font-bold text-white shadow-sm" : "opacity-80"
                    }\`}
                    style={{
                      backgroundColor: activeSection === "overview" ? "#6366f1" : "transparent",
                      borderRadius: "0.75rem",
                    }}
                  >
                    Quickstart & Concepts
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("auth");
                      setMobileNavOpen(false);
                    }}
                    className={\`w-full text-left px-3 py-2 rounded-lg transition-colors \${
                      activeSection === "auth" ? "font-bold text-white shadow-sm" : "opacity-80"
                    }\`}
                    style={{
                      backgroundColor: activeSection === "auth" ? "#6366f1" : "transparent",
                      borderRadius: "0.75rem",
                    }}
                  >
                    Authentication & Keys
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-mono uppercase tracking-wider mb-2 opacity-60">
                  Core API Reference
                </p>
                <div className="space-y-1 font-mono text-xs">
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="w-full text-left px-3 py-1.5 rounded opacity-80 hover:opacity-100"
                  >
                    POST /v1/inference
                  </button>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="w-full text-left px-3 py-1.5 rounded opacity-80 hover:opacity-100"
                  >
                    GET /v1/models
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3-Column Docs Layout (Desktop) / Reflowed (Mobile & Tablet) */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* Left Column: Navigation Sidebar (Desktop) */}
        <aside
          className="hidden lg:block w-64 border-r p-5 shrink-0 text-sm space-y-6"
          
        >
          <div>
            <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-3">
              Getting Started
            </p>
            <div className="space-y-1.5">
              <button
                onClick={() => setActiveSection("overview")}
                className={\`w-full text-left px-3 py-2 rounded-lg transition-colors \${
                  activeSection === "overview" ? "font-semibold text-white shadow-sm" : "opacity-75 hover:opacity-100"
                }\`}
                style={{
                  backgroundColor: activeSection === "overview" ? "#6366f1" : "transparent",
                  color: activeSection === "overview" ? "#ffffff" : "#f4f4f7",
                  borderRadius: "0.75rem",
                }}
              >
                Quickstart & Concepts
              </button>
              <button
                onClick={() => setActiveSection("auth")}
                className={\`w-full text-left px-3 py-2 rounded-lg transition-colors \${
                  activeSection === "auth" ? "font-semibold text-white shadow-sm" : "opacity-75 hover:opacity-100"
                }\`}
                style={{
                  backgroundColor: activeSection === "auth" ? "#6366f1" : "transparent",
                  color: activeSection === "auth" ? "#ffffff" : "#f4f4f7",
                  borderRadius: "0.75rem",
                }}
              >
                Authentication & Keys
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg opacity-70 hover:opacity-100 transition-colors">
                Rate Limits & Quotas
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-3">
              Core API Reference
            </p>
            <div className="space-y-1.5 font-mono text-xs">
              <button className="w-full text-left px-3 py-1.5 rounded-lg opacity-75 hover:opacity-100 transition-colors">
                POST /v1/inference
              </button>
              <button className="w-full text-left px-3 py-1.5 rounded-lg opacity-75 hover:opacity-100 transition-colors">
                GET /v1/models
              </button>
              <button className="w-full text-left px-3 py-1.5 rounded-lg opacity-75 hover:opacity-100 transition-colors">
                POST /v1/embeddings
              </button>
            </div>
          </div>
        </aside>

        {/* Center Column: Documentation Content */}
        <main className="flex-1 p-5 sm:p-8 max-w-3xl min-w-0">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-mono mb-2" >
              <span>Docs</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>Authentication</span>
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3"
              
            >
              Authentication & API Security
            </h1>

            <p className="text-sm sm:text-base leading-relaxed mb-6" >
              All requests to the Codex API must authenticate using Bearer tokens in the HTTP Authorization header.
              Your secret keys grant complete administrative access to your cluster quota.
            </p>

            {/* Note Callout */}
            <div
              className="p-4 sm:p-5 rounded-xl border flex items-start gap-3.5 text-xs sm:text-sm leading-relaxed mb-8 transition-all"
              
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5"  />
              <div>
                <span className="font-semibold" >
                  Security Best Practice:
                </span>{" "}
                Never expose production keys in client-side code or public Git repositories.
                Always access Codex endpoints through server-side environment variables.
              </div>
            </div>

            {/* Multi-Language Code Snippet */}
            <div
              className="rounded-2xl border shadow-lg overflow-hidden font-mono text-xs sm:text-sm mb-8"
              style={{
                backgroundColor: isDark ? "#08090d" : "#11131a",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#fafafa",
                borderRadius: "0.75rem",
              }}
            >
              {/* Language Tabs */}
              <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2.5 bg-black/30">
                <div className="flex gap-1.5">
                  {(["curl", "node", "python", "go"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={\`px-3 py-1.5 rounded capitalize font-medium text-xs transition-colors \${
                        activeLang === lang
                          ? "bg-white/20 text-white font-bold"
                          : "text-zinc-400 hover:text-white"
                      }\`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeSnippets[activeLang]);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs transition-colors"
                >
                  {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedCode ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <pre className="p-4 sm:p-5 overflow-x-auto text-zinc-200 text-xs sm:text-sm leading-relaxed">
                <code>{codeSnippets[activeLang]}</code>
              </pre>
            </div>
          </div>
        </main>

        {/* Right Column: Interactive API Playground Runner */}
        <aside
          className="w-full xl:w-84 border-t xl:border-t-0 xl:border-l p-5 shrink-0 text-sm"
          
        >
          <div
            className="p-5 rounded-xl border space-y-3.5 transition-all"
            
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Live API Explorer</span>
              <span className="text-xs font-mono text-emerald-500 font-medium">POST /v1/inference</span>
            </div>

            <button
              onClick={handleTestApi}
              disabled={isSending}
              className="w-full h-11 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-50 shadow-sm text-xs sm:text-sm"
              
            >
              {isSending ? (
                <span>Executing Request...</span>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Execute Test Request</span>
                </>
              )}
            </button>

            {apiResponse && (
              <div className="pt-3 border-t font-mono text-xs" >
                <div className="flex justify-between items-center mb-1.5 text-xs text-emerald-500 font-semibold">
                  <span>HTTP 200 OK</span>
                  <span>3.8ms</span>
                </div>
                <pre
                  className="p-3 rounded-lg overflow-x-auto border text-xs"
                  style={{
                    backgroundColor: "#161822",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                    color: "#f4f4f7",
                    borderRadius: "0.75rem",
                  }}
                >
                  <code>{apiResponse}</code>
                </pre>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer
        className="py-8 px-4 sm:px-6 border-t text-center text-xs sm:text-sm"
        
      >
        <p>\xA9 {new Date().getFullYear()} {brandName || "Codex Docs"}. Built for developer experience.</p>
      </footer>
    </div>
  );
}
`
};

// src/registry/template-healthcare-portal.ts
var templateHealthcarePortal = {
  name: "template-healthcare-portal",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-healthcare-portal.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Heart,
  Calendar,
  Clock,
  Pill,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  User,
  ShieldCheck,
  Video,
  FileText,
  Plus,
  X,
  Stethoscope,
  Sparkles,
  RefreshCw,
  Droplet,
  Moon,
  Zap,
} from "lucide-react";

export interface HealthcarePortalTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function HealthcarePortalTemplate({
  brandName = "PulseCare Telehealth",
  theme = "dark",
}: HealthcarePortalTemplateProps) {
  
    const isDark = theme === "dark";

  // Interactive States
  const [activeTab, setActiveTab] = useState<"telemetry" | "regimen" | "labs">("telemetry");
  const [selectedVital, setSelectedVital] = useState<"bpm" | "spo2" | "sleep" | "hrv">("bpm");
  const [checkedMeds, setCheckedMeds] = useState<string[]>(["med-1", "med-2"]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Cardiology");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("Tomorrow, 10:30 AM");
  const [bookingToast, setBookingToast] = useState(false);
  const [refillToast, setRefillToast] = useState<string | null>(null);
  const [symptomSeverity, setSymptomSeverity] = useState<string | null>(null);

  const vitalsData = {
    bpm: {
      label: "Resting Heart Rate",
      value: "64",
      unit: "BPM",
      delta: "-3 bpm vs 30d avg",
      status: "Optimal",
      icon: Heart,
      color: "text-rose-500",
      bgGlow: "rgba(244, 63, 94, 0.12)",
      trend: [62, 65, 68, 63, 61, 64, 66, 64],
    },
    spo2: {
      label: "Blood Oxygen (SpO2)",
      value: "98.8",
      unit: "%",
      delta: "+0.4% healthy range",
      status: "Excellent",
      icon: Droplet,
      color: "text-sky-500",
      bgGlow: "rgba(14, 165, 233, 0.12)",
      trend: [97, 98, 98.5, 99, 98.2, 98.6, 98.8, 98.8],
    },
    sleep: {
      label: "Sleep Recovery Score",
      value: "88",
      unit: "/100",
      delta: "7h 42m deep restorative",
      status: "Restorative",
      icon: Moon,
      color: "text-indigo-500",
      bgGlow: "rgba(99, 102, 241, 0.12)",
      trend: [72, 78, 81, 85, 82, 89, 84, 88],
    },
    hrv: {
      label: "Heart Rate Variability",
      value: "58",
      unit: "ms",
      delta: "+7ms autonomic balance",
      status: "High Resilience",
      icon: Activity,
      color: "text-emerald-500",
      bgGlow: "rgba(16, 185, 129, 0.12)",
      trend: [48, 52, 55, 51, 56, 54, 60, 58],
    },
  };

  const medications = [
    {
      id: "med-1",
      name: "Atorvastatin Calcium",
      dosage: "20mg \u2022 Oral Tablet",
      schedule: "Morning with meal",
      remaining: "24 days supply",
      prescribedBy: "Dr. Aris Thorne",
    },
    {
      id: "med-2",
      name: "Omega-3 Pure EPA/DHA",
      dosage: "1000mg \u2022 Softgel",
      schedule: "Midday with water",
      remaining: "18 days supply",
      prescribedBy: "Dr. Sarah Lin",
    },
    {
      id: "med-3",
      name: "Magnesium Glycinate",
      dosage: "400mg \u2022 Bedtime",
      schedule: "Evening before rest",
      remaining: "6 days supply (Refill Soon)",
      prescribedBy: "Dr. Aris Thorne",
    },
  ];

  const labPanels = [
    { test: "ApoB Lipoprotein", value: "68 mg/dL", target: "< 80 mg/dL", status: "Optimal", pct: 45 },
    { test: "High-Sensitivity CRP", value: "0.6 mg/L", target: "< 1.0 mg/L", status: "Low Risk", pct: 30 },
    { test: "Fasting Blood Glucose", value: "86 mg/dL", target: "70-99 mg/dL", status: "Optimal", pct: 50 },
    { test: "Estimated GFR (Kidney)", value: "112 mL/min", target: "> 90 mL/min", status: "Healthy", pct: 85 },
  ];

  const handleToggleMed = (id: string) => {
    setCheckedMeds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingOpen(false);
    setBookingToast(true);
    setTimeout(() => setBookingToast(false), 3500);
  };

  const handleRefill = (medName: string) => {
    setRefillToast(\`Refill request sent to pharmacy for \${medName}.\`);
    setTimeout(() => setRefillToast(null), 3000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Top Telehealth Navigation */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-tight"
                  
                >
                  {brandName || "PulseCare Health"}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  <ShieldCheck className="h-3 w-3" />
                  HIPAA Certified
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
              
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] opacity-80">Sync: Dexcom G7 (Active)</span>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <Video className="h-3.5 w-3.5" />
              <span>Book Doctor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Clinical Telemetry Body */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Patient Profile Header Card */}
        <div
          className="p-4 sm:p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center font-bold text-base">
              ER
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg">Elena Rostova</h1>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                  Active Patient #4892
                </span>
              </div>
              <p className="text-xs opacity-75 mt-0.5">
                Primary Physician: Dr. Aris Thorne \u2022 Longevity & Preventive Cardiology
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0" >
            <div className="text-left md:text-right">
              <span className="text-[11px] opacity-60 uppercase tracking-wider block">Next Consultation</span>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">Sep 12, 10:30 AM (Telehealth)</span>
            </div>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="p-2 rounded-xl border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              
              aria-label="View appointment details"
            >
              <Calendar className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Biometrics 4-Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {(["bpm", "spo2", "sleep", "hrv"] as const).map((key) => {
            const item = vitalsData[key];
            const isSelected = selectedVital === key;
            const IconComp = item.icon;

            return (
              <button
                key={key}
                onClick={() => setSelectedVital(key)}
                className={\`p-4 rounded-2xl border text-left transition-all \${
                  isSelected ? "ring-2 shadow-md" : "hover:border-opacity-60"
                }\`}
                style={{
                  backgroundColor: isSelected ? "#181a24" : "#12141c",
                  borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                  borderRadius: "0.75rem",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs opacity-70 font-medium">{item.label}</span>
                  <div className={\`p-1.5 rounded-lg \${item.color}\`} style={{ backgroundColor: item.bgGlow }}>
                    <IconComp className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight">{item.value}</span>
                  <span className="text-xs font-mono opacity-60">{item.unit}</span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {item.delta}
                  </span>
                  <span className="opacity-50 font-mono">{item.status}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Telemetry Waveform Visualization */}
        <div
          className="p-5 sm:p-6 rounded-2xl border space-y-4"
          
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-500" />
                <span>Continuous 24h Telemetry: {vitalsData[selectedVital].label}</span>
              </h2>
              <p className="text-xs opacity-65">Continuous stream sampled every 60s via sensor telemetry.</p>
            </div>

            <div
              className="inline-flex p-1 rounded-xl border text-xs"
              
            >
              {["12H", "24H", "7D", "30D"].map((range, idx) => (
                <span
                  key={range}
                  className={\`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer \${
                    idx === 1 ? "bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold" : "opacity-60"
                  }\`}
                >
                  {range}
                </span>
              ))}
            </div>
          </div>

          {/* SVG Sparkline Curve */}
          <div className="w-full h-28 relative flex items-end pt-4">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 80">
              <defs>
                <linearGradient id="vitalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Shaded Area */}
              <path
                d="M 0 60 Q 100 20, 200 45 T 400 30 T 600 25 L 700 35 L 700 80 L 0 80 Z"
                fill="url(#vitalGradient)"
              />
              {/* Line */}
              <path
                d="M 0 60 Q 100 20, 200 45 T 400 30 T 600 25 L 700 35"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] font-mono opacity-50 pt-1 border-t" >
            <span>00:00 (Midnight)</span>
            <span>06:00 (Waking)</span>
            <span>12:00 (Midday)</span>
            <span>18:00 (Post-Workout)</span>
            <span>Current (Live)</span>
          </div>
        </div>

        {/* Two-Column Clinical Section: Medications + Symptom Triage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Prescription Regimen & Lab Panels */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Medication Checklist */}
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-4"
              
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <Pill className="h-4 w-4 text-indigo-500" />
                    <span>Daily Medication Regimen</span>
                  </h3>
                  <p className="text-xs opacity-65">Tap pills to verify doses administered today.</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  {checkedMeds.length}/{medications.length} Complete
                </span>
              </div>

              <div className="space-y-2.5">
                {medications.map((med) => {
                  const isDone = checkedMeds.includes(med.id);
                  return (
                    <div
                      key={med.id}
                      className="p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors"
                      
                    >
                      <button
                        onClick={() => handleToggleMed(med.id)}
                        className="flex items-center gap-3 text-left flex-1"
                      >
                        <div
                          className={\`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 \${
                            isDone ? "bg-teal-600 border-teal-600 text-white" : "border-zinc-400 opacity-60"
                          }\`}
                        >
                          {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <div className={\`font-semibold text-xs sm:text-sm \${isDone ? "line-through opacity-50" : ""}\`}>
                            {med.name}
                          </div>
                          <div className="text-[11px] opacity-65 flex items-center gap-2">
                            <span>{med.dosage}</span>
                            <span>\u2022</span>
                            <span>{med.schedule}</span>
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-block text-[11px] font-mono opacity-60">{med.remaining}</span>
                        <button
                          onClick={() => handleRefill(med.name)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-medium border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          
                        >
                          Refill
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comprehensive Lab Biomarkers */}
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-4"
              
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-500" />
                    <span>Quarterly Biomarker Panel</span>
                  </h3>
                  <p className="text-xs opacity-65">Verified by Quest Diagnostics Laboratories \u2022 Aug 28, 2026</p>
                </div>
                <button
                  onClick={() => alert("Downloading Lab Results PDF...")}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                >
                  Download PDF
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {labPanels.map((lab) => (
                  <div
                    key={lab.test}
                    className="p-3.5 rounded-xl border space-y-2"
                    
                  >
                    <div className="flex justify-between items-start text-xs">
                      <span className="font-semibold">{lab.test}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        {lab.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-mono font-bold text-sm">{lab.value}</span>
                      <span className="text-[11px] opacity-60">Target: {lab.target}</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{ width: \`\${lab.pct}%\` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Symptom Triage + Care Team */}
          <div className="space-y-6">
            {/* Interactive Symptom Triage Card */}
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-4"
              
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-500">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Symptom Triage Assistant</h3>
                  <p className="text-xs opacity-65">Log current symptoms for clinical review</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] opacity-70 font-medium block">Select Reported Sensations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Mild Fatigue", "Headache", "Tension", "Palpitations", "Joint Stiffness"].map((symp) => (
                    <button
                      key={symp}
                      onClick={() => setSymptomSeverity(symp)}
                      className={\`px-3 py-1 rounded-full text-xs font-medium border transition-colors \${
                        symptomSeverity === symp
                          ? "bg-teal-600 text-white border-teal-600"
                          : "border-zinc-300 dark:border-zinc-700 opacity-80 hover:opacity-100"
                      }\`}
                    >
                      {symp}
                    </button>
                  ))}
                </div>
              </div>

              {symptomSeverity && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl border bg-teal-500/10 border-teal-500/20 text-xs space-y-1"
                >
                  <div className="font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Low Urgency Recorded</span>
                  </div>
                  <p className="opacity-80 leading-relaxed">
                    Condition logged in health record. Dr. Thorne recommended hydration and 8h restorative sleep.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Specialist Care Team */}
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-4"
              
            >
              <h3 className="font-bold text-sm flex items-center gap-2">
                <User className="h-4 w-4 text-teal-500" />
                <span>Primary Care Specialists</span>
              </h3>

              <div className="space-y-3">
                {[
                  {
                    name: "Dr. Aris Thorne, MD",
                    role: "Cardiovascular Medicine",
                    status: "Available Tomorrow",
                    rating: "4.9 \u2605",
                  },
                  {
                    name: "Dr. Sarah Lin, PhD",
                    role: "Metabolic Nutrition",
                    status: "Next slot in 3 days",
                    rating: "5.0 \u2605",
                  },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="p-3 rounded-xl border flex items-center justify-between"
                    
                  >
                    <div>
                      <div className="font-bold text-xs">{doc.name}</div>
                      <div className="text-[10px] opacity-65">{doc.role}</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSpecialty(doc.role);
                        setIsBookingOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white bg-teal-600 hover:bg-teal-500"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Appointment Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-5"
            style={{
              backgroundColor: "#181a24",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" >
              <div className="flex items-center gap-2 font-bold text-base">
                <Calendar className="h-4 w-4 text-teal-500" />
                <span>Schedule Telehealth Visit</span>
              </div>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="p-1.5 rounded-lg opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1.5 opacity-80">Specialty</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  
                >
                  <option value="Cardiology">Preventive Cardiology</option>
                  <option value="Endocrinology">Metabolic Endocrinology</option>
                  <option value="Longevity">Longevity & Biomarkers</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1.5 opacity-80">Preferred Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Tomorrow, 10:30 AM", "Tomorrow, 2:15 PM", "Sep 14, 9:00 AM", "Sep 14, 4:00 PM"].map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={\`p-2 rounded-xl border text-center font-medium transition-colors \${
                        selectedTimeSlot === slot
                          ? "bg-teal-600 text-white border-teal-600"
                          : "border-zinc-300 dark:border-zinc-700 opacity-80 hover:opacity-100"
                      }\`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-teal-500/10 border-teal-500/20 text-[11px] leading-relaxed">
                \u2713 Video consultation link and pre-appointment questionnaire will be dispatched to your email.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-semibold opacity-75 hover:opacity-100"
                  
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-sm"
                >
                  Confirm Visit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Toasts */}
      {bookingToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Consultation confirmed for {selectedTimeSlot}!</span>
        </div>
      )}

      {refillToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{refillToast}</span>
        </div>
      )}
    </div>
  );
}
`
};

// src/registry/template-web3-dex.ts
var templateWeb3Dex = {
  name: "template-web3-dex",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-web3-dex.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownUp,
  Zap,
  SlidersHorizontal,
  ShieldCheck,
  Wallet,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Coins,
  Search,
  X,
  Flame,
  Globe,
  Lock,
} from "lucide-react";

export interface Web3DexTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function Web3DexTemplate({
  brandName = "Aether DEX",
  theme = "dark",
}: Web3DexTemplateProps) {
  
    const isDark = theme === "dark";

  // Tokens config
  const tokens = [
    { symbol: "ETH", name: "Ethereum", balance: "4.821", price: 2640.5 },
    { symbol: "USDC", name: "USD Coin", balance: "14,850.00", price: 1.0 },
    { symbol: "SOL", name: "Solana", balance: "84.20", price: 148.2 },
    { symbol: "NEXO", name: "Nexore Token", balance: "25,000.00", price: 0.85 },
    { symbol: "WBTC", name: "Wrapped BTC", balance: "0.245", price: 62450.0 },
  ];

  // States
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState("1.5");
  const [slippage, setSlippage] = useState("0.5%");
  const [activeTimeframe, setActiveTimeframe] = useState<"1H" | "24H" | "7D" | "1M">("24H");
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(true);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapToast, setSwapToast] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Compute calculated output
  const calculatedOutput = (
    (parseFloat(fromAmount || "0") * fromToken.price) /
    toToken.price
  ).toFixed(toToken.symbol === "USDC" ? 2 : 4);

  const handleFlip = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    setIsSwapping(true);

    setTimeout(() => {
      setIsSwapping(false);
      setSwapToast(\`Swapped \${fromAmount} \${fromToken.symbol} for \${calculatedOutput} \${toToken.symbol}!\`);
      setTimeout(() => setSwapToast(null), 4000);
    }, 1200);
  };

  const liquidityPools = [
    { pair: "ETH / USDC", tvl: "$48.2M", vol24h: "$14.8M", apy: "24.6% APY", fee: "0.05%" },
    { pair: "NEXO / ETH", tvl: "$18.6M", vol24h: "$6.2M", apy: "48.2% APY", fee: "0.30%" },
    { pair: "SOL / USDC", tvl: "$32.4M", vol24h: "$9.4M", apy: "19.8% APY", fee: "0.05%" },
    { pair: "WBTC / ETH", tvl: "$64.1M", vol24h: "$18.2M", apy: "12.4% APY", fee: "0.05%" },
  ];

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* DEX Navigation Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Zap className="h-4 w-4" />
            </div>
            <span
              className="font-bold text-sm sm:text-base tracking-tight"
              
            >
              {brandName || "NovaSwap Protocol"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gas fee ticker */}
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="opacity-70">12 Gwei</span>
              <span className="text-cyan-500 font-bold">\u2022 Fast</span>
            </div>

            {/* Network pill */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium"
              
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Ethereum</span>
            </div>

            {/* Wallet button */}
            <button
              onClick={() => setIsWalletOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>{walletConnected ? "0x7F2...91cB" : "Connect Wallet"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Terminal View */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Market Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "ETH / USD", val: "$2,640.50", delta: "+4.18%", up: true },
            { label: "24h Protocol Volume", val: "$182,490,200", delta: "+12.4%", up: true },
            { label: "Total Value Locked", val: "$842,100,000", delta: "+3.2%", up: true },
            { label: "Average Swap Routing", val: "14ms", delta: "Zero MEV", up: true },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-3.5 rounded-xl border"
              
            >
              <div className="text-[11px] opacity-60 font-medium">{stat.label}</div>
              <div className="text-base sm:text-lg font-bold font-mono my-0.5">{stat.val}</div>
              <div className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{stat.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Core Layout: Swap Card + Candlestick Depth Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Swap Card: 5 Cols */}
          <div className="lg:col-span-5">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-lg"
              
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm sm:text-base">Instant Swap</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                    V3 AMM
                  </span>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="p-1.5 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  
                  aria-label="Swap Settings"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Settings Dropdown Drawer */}
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3.5 rounded-xl border space-y-2 text-xs"
                  
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold opacity-75">Slippage Tolerance</span>
                    <span className="font-mono text-cyan-500 font-bold">{slippage}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {["0.1%", "0.5%", "1.0%", "Custom"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSlippage(s)}
                        className={\`flex-1 py-1 rounded-lg border text-xs font-mono font-medium transition-colors \${
                          slippage === s
                            ? "bg-cyan-600 text-white border-cyan-600 font-bold"
                            : "opacity-75 hover:opacity-100"
                        }\`}
                        
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleExecuteSwap} className="space-y-2">
                {/* Pay Token Container */}
                <div
                  className="p-4 rounded-xl border space-y-1.5"
                  
                >
                  <div className="flex justify-between text-xs opacity-70">
                    <span>You Pay</span>
                    <span className="font-mono">
                      Balance: {fromToken.balance} {fromToken.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="number"
                      step="any"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="text-2xl sm:text-3xl font-mono font-bold bg-transparent outline-none w-full"
                    />
                    <select
                      value={fromToken.symbol}
                      onChange={(e) => {
                        const t = tokens.find((tok) => tok.symbol === e.target.value);
                        if (t) setFromToken(t);
                      }}
                      className="px-3 py-1.5 rounded-xl font-bold text-xs border bg-transparent outline-none cursor-pointer"
                      
                    >
                      {tokens.map((t) => (
                        <option key={t.symbol} value={t.symbol} className="text-black dark:text-white dark:bg-zinc-900">
                          {t.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-[11px] font-mono opacity-50">
                    \u2248 \${(parseFloat(fromAmount || "0") * fromToken.price).toLocaleString()} USD
                  </div>
                </div>

                {/* Flip Pair Trigger */}
                <div className="flex justify-center -my-3 relative z-10">
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="p-2 rounded-xl border shadow-md hover:scale-105 active:scale-95 transition-all"
                    
                    aria-label="Flip tokens"
                  >
                    <ArrowDownUp className="h-4 w-4 text-cyan-500" />
                  </button>
                </div>

                {/* Receive Token Container */}
                <div
                  className="p-4 rounded-xl border space-y-1.5"
                  
                >
                  <div className="flex justify-between text-xs opacity-70">
                    <span>You Receive (Estimated)</span>
                    <span className="font-mono">
                      Balance: {toToken.balance} {toToken.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-2xl sm:text-3xl font-mono font-bold w-full truncate">
                      {calculatedOutput}
                    </div>
                    <select
                      value={toToken.symbol}
                      onChange={(e) => {
                        const t = tokens.find((tok) => tok.symbol === e.target.value);
                        if (t) setToToken(t);
                      }}
                      className="px-3 py-1.5 rounded-xl font-bold text-xs border bg-transparent outline-none cursor-pointer"
                      
                    >
                      {tokens.map((t) => (
                        <option key={t.symbol} value={t.symbol} className="text-black dark:text-white dark:bg-zinc-900">
                          {t.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-[11px] font-mono opacity-50">
                    \u2248 \${(parseFloat(calculatedOutput || "0") * toToken.price).toLocaleString()} USD
                  </div>
                </div>

                {/* Trade Execution Telemetry details */}
                <div
                  className="p-3 rounded-xl border text-[11px] space-y-1 font-mono opacity-75"
                  
                >
                  <div className="flex justify-between">
                    <span>Rate</span>
                    <span>1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(4)} {toToken.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Routing</span>
                    <span className="text-cyan-500 font-semibold">NovaSwap Split-Route (Zero MEV)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Network Fee</span>
                    <span>~$1.24 (0.00047 ETH)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSwapping}
                  className="w-full py-3.5 rounded-xl font-bold text-xs text-white shadow-md transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                  
                >
                  {isSwapping ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Confirming on Chain...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span>Swap {fromToken.symbol} to {toToken.symbol}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Chart & Depth Visualizer: 7 Cols */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-4"
              
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base">
                      {fromToken.symbol} / {toToken.symbol} Market Depth
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-500">+4.18%</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-extrabold mt-1">
                    \${(fromToken.price / toToken.price).toFixed(2)}
                  </div>
                </div>

                <div
                  className="inline-flex p-1 rounded-xl border text-xs"
                  
                >
                  {(["1H", "24H", "7D", "1M"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTimeframe(t)}
                      className={\`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all \${
                        activeTimeframe === t
                          ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400"
                          : "opacity-60 hover:opacity-100"
                      }\`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Candlestick / Bar Visualization */}
              <div className="w-full h-48 relative flex items-end justify-between gap-1 pt-6 px-1">
                {[
                  { h: 40, up: true },
                  { h: 55, up: true },
                  { h: 50, up: false },
                  { h: 65, up: true },
                  { h: 60, up: false },
                  { h: 75, up: true },
                  { h: 85, up: true },
                  { h: 80, up: false },
                  { h: 95, up: true },
                  { h: 90, up: false },
                  { h: 105, up: true },
                  { h: 120, up: true },
                  { h: 115, up: false },
                  { h: 130, up: true },
                  { h: 145, up: true },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className={\`w-full max-w-[14px] rounded-t transition-all \${
                        bar.up ? "bg-emerald-500/80 hover:bg-emerald-400" : "bg-rose-500/80 hover:bg-rose-400"
                      }\`}
                      style={{ height: \`\${bar.h}px\` }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[10px] font-mono opacity-50 border-t pt-2" >
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>Current</span>
              </div>
            </div>

            {/* Yield Farming Liquidity Pools */}
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-4"
              
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <Coins className="h-4 w-4 text-cyan-500" />
                  <span>Featured Liquidity Pools</span>
                </h3>
                <span className="text-xs opacity-60 font-mono">Real-time APY Yields</span>
              </div>

              <div className="space-y-2.5 overflow-x-auto">
                {liquidityPools.map((pool) => (
                  <div
                    key={pool.pair}
                    className="p-3.5 rounded-xl border flex items-center justify-between gap-4 text-xs font-mono"
                    
                  >
                    <div>
                      <div className="font-bold text-sm text-foreground">{pool.pair}</div>
                      <div className="text-[11px] opacity-60">Fee: {pool.fee}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold">{pool.tvl}</div>
                      <div className="text-[10px] opacity-60">TVL</div>
                    </div>

                    <div className="text-right hidden sm:block">
                      <div className="font-bold">{pool.vol24h}</div>
                      <div className="text-[10px] opacity-60">24h Vol</div>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
                      {pool.apy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Wallet Connection Modal */}
      {isWalletOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm p-6 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: "#181a24",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" >
              <span className="font-bold text-sm">Connect Web3 Wallet</span>
              <button onClick={() => setIsWalletOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: "MetaMask", badge: "Installed" },
                { name: "Phantom", badge: "Multi-chain" },
                { name: "Coinbase Wallet", badge: "Smart Wallet" },
                { name: "WalletConnect", badge: "QR Code" },
              ].map((w) => (
                <button
                  key={w.name}
                  onClick={() => {
                    setWalletConnected(true);
                    setIsWalletOpen(false);
                  }}
                  className="w-full p-3 rounded-xl border flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  
                >
                  <span className="font-bold">{w.name}</span>
                  <span className="text-[10px] font-mono opacity-60">{w.badge}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast */}
      {swapToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-cyan-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{swapToast}</span>
        </div>
      )}
    </div>
  );
}
`
};

// src/registry/template-edtech-learning.ts
var templateEdtechLearning = {
  name: "template-edtech-learning",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-edtech-learning.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, 
  BookOpen,
  CheckCircle2,
  Code2,
  Award,
  Flame,
  Play,
  Check,
  ChevronRight,
  ChevronDown,
  Lock,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Bookmark,
  Share2,
  Terminal,
  Trophy,
 } from "lucide-react";

export interface EdtechLearningTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function EdtechLearningTemplate({
  brandName = "Syntapse Academy",
  theme = "dark",
}: EdtechLearningTemplateProps) {
  
    const isDark = theme === "dark";

  // Course outline data
  const modules = [
    {
      id: "mod-1",
      title: "Module 1: Concurrency & Threads",
      completed: true,
      lessons: [
        { id: "les-1", title: "1.1 Memory Barriers & Atomics", time: "15m", done: true },
        { id: "les-2", title: "1.2 Mutex Invariants & Deadlocks", time: "22m", done: true },
      ],
    },
    {
      id: "mod-2",
      title: "Module 2: Distributed Consensus (Raft)",
      completed: false,
      lessons: [
        { id: "les-3", title: "2.1 Leader Election Invariants", time: "18m", done: true },
        { id: "les-4", title: "2.2 Log Replication & Quorums", time: "25m", done: false, active: true },
        { id: "les-5", title: "2.3 Split Brain Mitigation", time: "20m", done: false },
      ],
    },
    {
      id: "mod-3",
      title: "Module 3: Conflict-Free Replicated Data (CRDT)",
      completed: false,
      locked: true,
      lessons: [
        { id: "les-6", title: "3.1 State-based vs Op-based CRDTs", time: "30m", done: false },
        { id: "les-7", title: "3.2 Vector Clocks & Causality", time: "25m", done: false },
      ],
    },
  ];

  // States
  const [activeLessonId, setActiveLessonId] = useState("les-4");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(1);
  const [verificationResult, setVerificationResult] = useState<"success" | "failure" | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [xpPoints, setXpPoints] = useState(4820);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(3);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (selectedAnswer === 1) {
        setVerificationResult("success");
        setXpPoints((prev) => prev + 150);
        setCompletedLessonsCount(4);
      } else {
        setVerificationResult("failure");
      }
    }, 800);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Academy Navigation Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-bold text-sm sm:text-base tracking-tight"
                
              >
                {brandName || "Polymath Academy"}
              </span>
              <span className="hidden md:inline-block text-xs opacity-60 ml-2 font-mono">
                \u2022 Distributed Systems Track
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            >
              <Flame className="h-3.5 w-3.5 fill-amber-500" />
              <span>14 Day Streak</span>
            </div>

            {/* XP Badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold"
              
            >
              <Trophy className="h-3.5 w-3.5 text-emerald-500" />
              <span>{xpPoints.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Learning Interface: Syllabus + Lesson Workspace */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Syllabus Outline (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div
              className="p-4 sm:p-5 rounded-2xl border space-y-4"
              
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-sm">Course Syllabus</h2>
                  <p className="text-xs opacity-65">Mastering Distributed Consensus</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-500">
                  {Math.round((completedLessonsCount / 7) * 100)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: "#6366f1",
                    width: \`\${(completedLessonsCount / 7) * 100}%\`,
                  }}
                />
              </div>

              {/* Modules Accordion */}
              <div className="space-y-3 pt-2">
                {modules.map((mod) => (
                  <div key={mod.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold opacity-85">
                      <div className="flex items-center gap-1.5 truncate">
                        {mod.locked ? (
                          <Lock className="h-3.5 w-3.5 opacity-50 shrink-0" />
                        ) : mod.completed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <BookOpen className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        )}
                        <span className="truncate">{mod.title}</span>
                      </div>
                    </div>

                    {!mod.locked && (
                      <div className="space-y-1 pl-4 border-l ml-1.5" >
                        {mod.lessons.map((les) => {
                          const isActive = activeLessonId === les.id;
                          return (
                            <button
                              key={les.id}
                              onClick={() => setActiveLessonId(les.id)}
                              className={\`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors \${
                                isActive
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30"
                                  : "opacity-75 hover:opacity-100"
                              }\`}
                            >
                              <span className="truncate">{les.title}</span>
                              <span className="text-[10px] font-mono opacity-60 ml-2 shrink-0">{les.time}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Badges Mini Card */}
            <div
              className="p-4 sm:p-5 rounded-2xl border space-y-3"
              
            >
              <h3 className="font-bold text-xs flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Earned Mastery Badges</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className="p-2.5 rounded-xl border text-center space-y-1"
                  
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto font-bold text-xs">
                    \u26A1
                  </div>
                  <div className="font-bold text-[11px]">Concurrency Pro</div>
                  <div className="text-[9px] opacity-60 font-mono">Completed Mod 1</div>
                </div>

                <div
                  className="p-2.5 rounded-xl border text-center space-y-1"
                  
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto font-bold text-xs">
                    \u{1F6E1}
                  </div>
                  <div className="font-bold text-[11px]">Quorum Guard</div>
                  <div className="text-[9px] opacity-60 font-mono">100% Quiz Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Lesson Player & Verification Sandbox (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div
              className="p-6 sm:p-8 rounded-2xl border space-y-6"
              
            >
              {/* Lesson Header */}
              <div className="border-b pb-4 space-y-2" >
                <div className="flex items-center gap-2 text-xs font-mono opacity-60">
                  <span>Module 2 \u2022 Lesson 2.2</span>
                  <span>\u2022</span>
                  <span>Estimated: 25 mins</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Log Replication & Quorum Commit Invariants
                </h1>
                <p className="text-xs sm:text-sm opacity-75 leading-relaxed">
                  In the Raft protocol, once a Leader is elected, it manages client state transitions via an append-only log replicated across cluster nodes.
                </p>
              </div>

              {/* Theory Concept Callout Block */}
              <div
                className="p-4 rounded-xl border space-y-2 text-xs leading-relaxed"
                
              >
                <div className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Lightbulb className="h-4 w-4" />
                  <span>The Fundamental Quorum Invariant</span>
                </div>
                <p className="opacity-80">
                  For a 5-node cluster (Nodes A, B, C, D, E), an entry is committed safely only when written to a majority (at least 3 nodes). What happens if network partition isolates 2 nodes?
                </p>
              </div>

              {/* Interactive Code Exercise Sandbox */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <Code2 className="h-4 w-4 text-emerald-500" />
                    <span>Challenge Question: Select the Invariant Rule</span>
                  </span>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>{showHint ? "Hide Hint" : "Need Hint?"}</span>
                  </button>
                </div>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-xl border bg-amber-500/10 border-amber-500/20 text-xs text-amber-700 dark:text-amber-300"
                  >
                    Hint: A leader cannot commit an entry from an earlier term solely by counting replicas. Review Section 5.4.2 of Ongaro & Ousterhout.
                  </motion.div>
                )}

                {/* Multiple Choice Answers */}
                <div className="space-y-2.5">
                  {[
                    "A partitioned minority of 2 nodes can commit writes independently to optimize latency.",
                    "The Leader requires a majority quorum (3 of 5 nodes) before returning an acknowledgment to the client.",
                    "Any follower node can commit entries without communicating with the current Term Leader.",
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswer(idx)}
                      className={\`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-3 \${
                        selectedAnswer === idx
                          ? "border-emerald-500 bg-emerald-500/10 font-bold"
                          : "hover:border-zinc-400 opacity-80"
                      }\`}
                      style={{
                        backgroundColor: selectedAnswer === idx ? undefined : "#181a24",
                        borderColor: selectedAnswer === idx ? undefined : "rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <span className="w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[11px] shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  ))}
                </div>

                {/* Verification Result Feedback */}
                {verificationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={\`p-4 rounded-xl border text-xs space-y-1 \${
                      verificationResult === "success"
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                        : "bg-rose-500/15 border-rose-500/30 text-rose-800 dark:text-rose-300"
                    }\`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {verificationResult === "success" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Correct Solution! +150 XP Awarded</span>
                        </>
                      ) : (
                        <span>Incorrect Invariant. Review quorum overlap definitions.</span>
                      )}
                    </div>
                    {verificationResult === "success" && (
                      <p className="opacity-90 leading-relaxed">
                        Excellent! By requiring majority quorum consensus (\u230AN/2\u230B + 1), any two quorums must intersect in at least one node, guaranteeing linearizability.
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Submit Action Button */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs opacity-60">Reward: 150 XP \u2022 Skill: Raft Consensus</span>
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying || selectedAnswer === null}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm flex items-center gap-2 transition-transform active:scale-95"
                    
                  >
                    {isVerifying ? (
                      <span>Validating Invariants...</span>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Run & Verify Solution</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Contribution Calendar Heatmap */}
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-3"
              
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">2026 Learning Activity Stream</span>
                <span className="opacity-60 font-mono">148 lessons completed this year</span>
              </div>

              {/* Heatmap Grid */}
              <div className="grid grid-cols-12 sm:grid-cols-24 gap-1 pt-2">
                {Array.from({ length: 48 }).map((_, i) => {
                  const intensity = (i * 7) % 5;
                  const bg =
                    intensity === 0
                      ? "opacity-15 bg-zinc-400"
                      : intensity === 1
                      ? "bg-emerald-500/30"
                      : intensity === 2
                      ? "bg-emerald-500/60"
                      : "bg-emerald-500";
                  return (
                    <div
                      key={i}
                      className={\`h-3.5 rounded-sm \${bg} transition-colors hover:scale-110\`}
                      title={\`Day \${i + 1}: \${intensity * 3} exercises\`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`
};

// src/registry/template-conference-event.ts
var templateConferenceEvent = {
  name: "template-conference-event",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-conference-event.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Sparkles,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Globe,
  ExternalLink,
  Mic,
  Video,
  Layers,
  Flame,
  CheckCircle2,
} from "lucide-react";

export interface ConferenceEventTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function ConferenceEventTemplate({
  brandName = "Vertex Summit 2027",
  theme = "dark",
}: ConferenceEventTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [activeDay, setActiveDay] = useState<"day-1" | "day-2" | "day-3">("day-1");
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const [expandedSession, setExpandedSession] = useState<string | null>("ses-1");
  const [selectedTier, setSelectedTier] = useState<"standard" | "vip" | "virtual">("vip");
  const [ticketQuantity, setTicketQuantity] = useState(2);
  const [checkoutToast, setCheckoutToast] = useState(false);

  const tracks = ["All", "AI Systems", "UI Architecture", "Distributed Cloud", "Security"];

  const sessions = [
    {
      id: "ses-1",
      day: "day-1",
      time: "09:00 - 10:15 AM",
      stage: "Keynote Main Hall",
      track: "AI Systems",
      title: "Opening Keynote: Autonomous Inference Substrates at Global Edge",
      speaker: "Dr. Elena Vance",
      role: "VP of Research, Synthetix Labs",
      synopsis:
        "An architectural deep dive into compiling dynamic reasoning graphs across 350 distributed edge points with sub-10ms time-to-first-token.",
    },
    {
      id: "ses-2",
      day: "day-1",
      time: "10:45 - 11:45 AM",
      stage: "Stage B \u2022 Architecture",
      track: "UI Architecture",
      title: "Building Deterministic Design Systems for 100M+ Users",
      speaker: "Marcus Sterling",
      role: "Design Engineering Lead, Monolith",
      synopsis:
        "Techniques for eliminating layout shift, achieving sub-pixel optical balance, and implementing resilient dark/light mode token hierarchies.",
    },
    {
      id: "ses-3",
      day: "day-1",
      time: "01:30 - 02:45 PM",
      stage: "Stage C \u2022 Cloud",
      track: "Distributed Cloud",
      title: "Zero-Downtime Microsecond State Replication with Raft & eBPF",
      speaker: "Hiroshi Tanaka",
      role: "Principal Systems Architect, HyperMesh",
      synopsis:
        "High-performance kernel-bypass networking patterns for managing multi-region database clusters under peak burst traffic.",
    },
    {
      id: "ses-4",
      day: "day-2",
      time: "09:30 - 10:45 AM",
      stage: "Keynote Main Hall",
      track: "AI Systems",
      title: "Autonomous Agent Orchestration: Memory, Tools, and Safety Boundaries",
      speaker: "Aria Thorne",
      role: "Chief Scientist, Cortex Labs",
      synopsis:
        "Practical engineering strategies for agent self-correction, sandboxed execution pipelines, and deterministic verification.",
    },
    {
      id: "ses-5",
      day: "day-3",
      time: "11:00 - 12:15 PM",
      stage: "Main Stage",
      track: "Security",
      title: "Post-Quantum Cryptography & Zero-Knowledge Verification in Production",
      speaker: "Dr. Julian Croft",
      role: "Head of Cryptography, Apex Security",
      synopsis:
        "Transitioning enterprise production environments to quantum-resistant lattice primitives without latency penalties.",
    },
  ];

  const filteredSessions = sessions.filter((s) => {
    const matchDay = s.day === activeDay;
    const matchTrack = selectedTrack === "All" || s.track === selectedTrack;
    return matchDay && matchTrack;
  });

  const speakers = [
    {
      name: "Dr. Elena Vance",
      company: "Synthetix Labs",
      topic: "Autonomous Edge Inference",
      initials: "EV",
      color: "bg-purple-600",
    },
    {
      name: "Marcus Sterling",
      company: "Studio Monolith",
      topic: "Deterministic Design Systems",
      initials: "MS",
      color: "bg-indigo-600",
    },
    {
      name: "Hiroshi Tanaka",
      company: "HyperMesh Systems",
      topic: "eBPF Kernel State Replication",
      initials: "HT",
      color: "bg-pink-600",
    },
    {
      name: "Aria Thorne",
      company: "Cortex Labs",
      topic: "Agent Pipeline Verification",
      initials: "AT",
      color: "bg-cyan-600",
    },
  ];

  const passTiers = {
    standard: { name: "Conference Pass", price: 499, perks: ["Access to all 3 stages", "Keynote recordings", "After-party access"] },
    vip: { name: "All-Access VIP", price: 999, perks: ["Reserved front-row seating", "VIP speaker lounge", "Private workshop tracks", "Gourmet catering & dinners"] },
    virtual: { name: "Global Virtual", price: 149, perks: ["4K low-latency livestreams", "Interactive chat Q&A", "Full session archive"] },
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutToast(true);
    setTimeout(() => setCheckoutToast(false), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Top Conference Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Calendar className="h-4 w-4" />
            </div>
            <span
              className="font-black text-sm sm:text-base tracking-tight"
              
            >
              {brandName || "Vertex Summit 2027"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
              
            >
              <MapPin className="h-3 w-3 text-purple-500" />
              <span>San Francisco, CA</span>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById("tickets-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
              
            >
              Claim Pass
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <Calendar className="h-3.5 w-3.5" />
          <span>October 14\u201316, 2027 \u2022 Yerba Buena Center, San Francisco & Virtual</span>
        </div>

        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight"
          
        >
          The Convergence of Autonomous Systems & Spatial Architecture
        </h1>

        <p className="text-sm sm:text-base opacity-75 max-w-2xl mx-auto leading-relaxed">
          Gathering 4,500+ systems engineers, AI researchers, and digital product leaders to shape the foundations of high-velocity software.
        </p>

        {/* Live Countdown Clock */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 pt-2">
          {[
            { val: "242", label: "Days" },
            { val: "14", label: "Hours" },
            { val: "38", label: "Minutes" },
            { val: "19", label: "Seconds" },
          ].map((item) => (
            <div
              key={item.label}
              className="px-4 py-3 rounded-2xl border min-w-[70px] sm:min-w-[90px] text-center"
              
            >
              <div className="text-xl sm:text-3xl font-black font-mono tracking-tight">{item.val}</div>
              <div className="text-[10px] sm:text-xs opacity-60 uppercase tracking-wider font-semibold">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Track Schedule Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4" >
          <div>
            <h2 className="text-xl sm:text-2xl font-black">Interactive Conference Schedule</h2>
            <p className="text-xs opacity-65 mt-1">Select dates and filter by engineering track.</p>
          </div>

          {/* Day Switcher */}
          <div
            className="inline-flex p-1 rounded-xl border text-xs"
            
          >
            {[
              { id: "day-1", label: "Day 1 (Oct 14)" },
              { id: "day-2", label: "Day 2 (Oct 15)" },
              { id: "day-3", label: "Day 3 (Oct 16)" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id as any)}
                className={\`px-3.5 py-1.5 rounded-lg font-bold transition-all \${
                  activeDay === d.id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "opacity-70 hover:opacity-100"
                }\`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Track Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {tracks.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrack(t)}
              className={\`px-3 py-1 rounded-full text-xs font-semibold border transition-all \${
                selectedTrack === t
                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/40"
                  : "border-zinc-300 dark:border-zinc-700 opacity-70 hover:opacity-100"
              }\`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          {filteredSessions.map((session) => {
            const isExpanded = expandedSession === session.id;
            return (
              <div
                key={session.id}
                className="p-4 sm:p-5 rounded-2xl border transition-colors space-y-3"
                
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      {session.time}
                    </span>
                    <span className="text-xs font-semibold opacity-70">{session.stage}</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700 opacity-60 w-fit">
                    {session.track}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base leading-snug">{session.title}</h3>
                    <div className="text-xs opacity-75 mt-1">
                      <span className="font-semibold text-foreground">{session.speaker}</span> \u2022 {session.role}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                    className="p-1.5 rounded-xl border hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
                    
                    aria-label="Toggle session synopsis"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2 border-t text-xs opacity-80 leading-relaxed"
                    
                  >
                    {session.synopsis}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Keynote Speakers Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Distinguished Keynote Speakers</h2>
          <p className="text-xs opacity-65 mt-1">Leading researchers and infrastructure pioneers.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {speakers.map((spk) => (
            <div
              key={spk.name}
              className="p-4 rounded-2xl border space-y-3 text-center"
              
            >
              <div
                className={\`w-14 h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center mx-auto shadow-md \${spk.color}\`}
              >
                {spk.initials}
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm">{spk.name}</div>
                <div className="text-[11px] opacity-60 font-semibold">{spk.company}</div>
              </div>
              <div className="text-[10px] opacity-75 font-mono border-t pt-2" >
                {spk.topic}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ticket Tiers Section */}
      <section id="tickets-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black">Choose Your Summit Access</h2>
          <p className="text-xs opacity-65 mt-1">In-person seats are limited to 4,500 attendees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {(["standard", "vip", "virtual"] as const).map((tierKey) => {
            const tier = passTiers[tierKey];
            const isSelected = selectedTier === tierKey;

            return (
              <div
                key={tierKey}
                onClick={() => setSelectedTier(tierKey)}
                className={\`p-6 rounded-2xl border cursor-pointer transition-all space-y-4 relative \${
                  isSelected ? "ring-2 shadow-xl" : "opacity-85 hover:opacity-100"
                }\`}
                style={{
                  backgroundColor: isSelected ? "#181a24" : "#12141c",
                  borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                  borderRadius: "0.75rem",
                }}
              >
                {tierKey === "vip" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-purple-600 shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-base">{tier.name}</h3>
                  <div className="text-3xl font-black font-mono my-2">
                    \${tier.price} <span className="text-xs font-normal opacity-60">/ attendee</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs opacity-80 border-t pt-4" >
                  {tier.perks.map((perk) => (
                    <div key={perk} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={\`w-full py-2.5 rounded-xl font-bold text-xs transition-colors \${
                    isSelected
                      ? "bg-purple-600 text-white shadow-md"
                      : "border border-zinc-300 dark:border-zinc-700 opacity-75"
                  }\`}
                >
                  {isSelected ? "Selected" : "Select Pass"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Checkout Calculator summary */}
        <div
          className="p-6 rounded-2xl border max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
          
        >
          <div>
            <div className="text-xs opacity-70">
              Pass: <span className="font-bold text-foreground">{passTiers[selectedTier].name}</span>
            </div>
            <div className="text-xl font-black font-mono mt-0.5">
              \${passTiers[selectedTier].price * ticketQuantity}{" "}
              <span className="text-xs font-normal opacity-60">({ticketQuantity} passes)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-xl" >
              <button
                onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                className="px-3 py-1 text-sm font-bold opacity-70 hover:opacity-100"
              >
                -
              </button>
              <span className="px-3 text-xs font-mono font-bold">{ticketQuantity}</span>
              <button
                onClick={() => setTicketQuantity(ticketQuantity + 1)}
                className="px-3 py-1 text-sm font-bold opacity-70 hover:opacity-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleCheckout}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-transform active:scale-95"
              
            >
              Register Passes
            </button>
          </div>
        </div>
      </section>

      {/* Confirmation Toast */}
      {checkoutToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Reserved {ticketQuantity} \xD7 {passTiers[selectedTier].name}! Receipt sent to email.</span>
        </div>
      )}
    </div>
  );
}
`
};

// src/registry/template-audio-podcast.ts
var templateAudioPodcast = {
  name: "template-audio-podcast",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-audio-podcast.tsx",
  content: `"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Bookmark,
  Share2,
  Search,
  Download,
  CheckCircle2,
  Radio,
  Clock,
  Sparkles,
  ChevronRight,
  ListMusic,
  FileText,
  Sliders,
} from "lucide-react";

export interface AudioPodcastTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function AudioPodcastTemplate({
  brandName = "EchoWave Audio",
  theme = "dark",
}: AudioPodcastTemplateProps) {
  
    const isDark = theme === "dark";

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<"1.0x" | "1.25x" | "1.5x" | "2.0x">("1.0x");
  const [currentSeconds, setCurrentSeconds] = useState(255); // 04:15
  const [totalSeconds] = useState(3260); // 54:20
  const [volume, setVolume] = useState(80);
  const [activeTab, setActiveTab] = useState<"chapters" | "transcript" | "episodes">("chapters");
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Playback ticker simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSeconds((prev) => (prev < totalSeconds ? prev + 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return \`\${m.toString().padStart(2, "0")}:\${s.toString().padStart(2, "0")}\`;
  };

  const chapters = [
    { time: "00:00", secs: 0, title: "Cold Open & Microbenchmark Disclosures" },
    { time: "04:15", secs: 255, title: "Why Ring Buffers Outperform Channel Primitives" },
    { time: "18:40", secs: 1120, title: "Kernel-Bypass Networking with io_uring" },
    { time: "34:25", secs: 2065, title: "Memory Allocation Invariants in High-Throughput Pipelines" },
    { time: "48:10", secs: 2890, title: "Audience Q&A: The Future of Edge WASM" },
  ];

  const transcriptLines = [
    { time: "04:15", speaker: "Host", text: "Welcome back. Today we're analyzing zero-cost abstractions with Linus M. Linus, let's start with lockless ring buffers." },
    { time: "04:32", speaker: "Linus M.", text: "Right. Standard channel implementations incur severe context-switching overhead because of mutex arbitration. With a single-producer single-consumer circular buffer, memory barriers alone guarantee linearizability without kernel traps." },
    { time: "05:10", speaker: "Host", text: "And that drops cache misses dramatically across modern x86 and ARM Neoverse cores." },
    { time: "05:25", speaker: "Linus M.", text: "Precisely. In our benchmarks, throughput increased from 1.2M ops/sec to over 18.4M ops/sec under 100% saturation." },
  ];

  const episodes = [
    { ep: "EP 148", title: "Zero-Cost Abstractions & Kernel Bypass", date: "Sep 08, 2026", duration: "54:20", active: true },
    { ep: "EP 147", title: "Compiling Vector Indexes Directly to NVMe", date: "Sep 01, 2026", duration: "48:15" },
    { ep: "EP 146", title: "The Distributed Systems Graveyard", date: "Aug 25, 2026", duration: "62:10" },
    { ep: "EP 145", title: "Formal Verification of Raft Invariants with TLA+", date: "Aug 18, 2026", duration: "51:40" },
  ];

  const filteredTranscript = transcriptLines.filter((line) =>
    line.text.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left pb-28"
      
    >
      {/* Studio Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-bold text-sm sm:text-base tracking-tight"
                
              >
                {brandName || "EchoWave Audio"}
              </span>
              <span className="hidden md:inline-block text-xs opacity-60 ml-2 font-mono">
                \u2022 Systems Broadcast
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
            >
              <Radio className="h-3 w-3 animate-pulse" />
              <span>24-bit / 96kHz FLAC</span>
            </div>

            <button
              onClick={() => {
                setDownloadToast("Subscribed to RSS feed! Copied feed URL.");
                setTimeout(() => setDownloadToast(null), 3000);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              
            >
              Subscribe RSS
            </button>
          </div>
        </div>
      </header>

      {/* Featured Episode Hero */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <div
          className="p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden"
          
        >
          {/* Episode Album Art Mockup */}
          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-tr from-indigo-900 via-violet-700 to-sky-500 flex flex-col justify-between p-4 text-white shadow-2xl shrink-0 relative group">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono tracking-widest font-bold uppercase opacity-80">
                EchoWave
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20">
                EP 148
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono opacity-80">Season 4</div>
              <div className="text-sm sm:text-base font-bold leading-tight">Zero-Cost Abstractions</div>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl"
              aria-label="Play or Pause"
            >
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current ml-0.5" />}
              </div>
            </button>
          </div>

          {/* Episode Metadata & Synopsis */}
          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Released Sep 08, 2026 \u2022 54 mins 20 secs</span>
            </div>

            <h1
              className="text-2xl sm:text-4xl font-extrabold tracking-tight"
              
            >
              Zero-Cost Abstractions & Kernel-Bypass Pipelines
            </h1>

            <p className="text-xs sm:text-sm opacity-75 max-w-2xl leading-relaxed">
              We interview Linus M. about dismantling memory barriers, squeezing 18M ops/second from lockless circular queues, and why traditional OS networking stacks fall short for high-frequency trading.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center gap-2 transition-transform active:scale-95"
                
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                <span>{isPlaying ? "Pause Broadcast" : "Listen Episode (54m)"}</span>
              </button>

              <button
                onClick={() => {
                  setDownloadToast("Downloading episode audio (142MB FLAC)...");
                  setTimeout(() => setDownloadToast(null), 3000);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
                
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Audio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Controls: Chapters, Interactive Transcript, Season Episodes */}
        <div
          className="flex items-center gap-2 border-b pb-2 text-xs font-semibold"
          
        >
          {[
            { id: "chapters", label: "Episode Chapters", icon: ListMusic },
            { id: "transcript", label: "Live Transcript", icon: FileText },
            { id: "episodes", label: "Season Archive", icon: Headphones },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={\`flex items-center gap-2 px-4 py-2 rounded-xl transition-all \${
                  isActive
                    ? "bg-indigo-600 text-white font-bold shadow-sm"
                    : "opacity-70 hover:opacity-100"
                }\`}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: Chapters */}
        {activeTab === "chapters" && (
          <div className="space-y-2.5">
            {chapters.map((ch) => {
              const isCurrent = currentSeconds >= ch.secs && currentSeconds < ch.secs + 900;
              return (
                <div
                  key={ch.time}
                  onClick={() => {
                    setCurrentSeconds(ch.secs);
                    setIsPlaying(true);
                  }}
                  className={\`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all \${
                    isCurrent
                      ? "border-indigo-500 bg-indigo-500/10 font-bold"
                      : "hover:border-zinc-400 opacity-80"
                  }\`}
                  style={{
                    backgroundColor: isCurrent ? undefined : "#12141c",
                    borderColor: isCurrent ? undefined : "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                      {ch.time}
                    </span>
                    <span className="text-xs sm:text-sm">{ch.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </div>
              );
            })}
          </div>
        )}

        {/* Tab Content 2: Searchable Transcript */}
        {activeTab === "transcript" && (
          <div
            className="p-5 sm:p-6 rounded-2xl border space-y-4"
            
          >
            <div className="flex justify-between items-center gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 opacity-50" />
                <input
                  type="text"
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  placeholder="Search transcript phrases..."
                  className="w-full pl-8 pr-4 py-1.5 rounded-xl border text-xs bg-transparent outline-none"
                  
                />
              </div>
              <span className="text-xs opacity-60 font-mono hidden sm:inline">Synchronized</span>
            </div>

            <div className="space-y-3 pt-2">
              {filteredTranscript.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border space-y-1 text-xs leading-relaxed"
                  
                >
                  <div className="flex justify-between font-mono text-[11px] opacity-70">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{t.speaker}</span>
                    <span>{t.time}</span>
                  </div>
                  <p className="opacity-85">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Season Episodes Archive */}
        {activeTab === "episodes" && (
          <div className="space-y-2.5">
            {episodes.map((ep) => (
              <div
                key={ep.ep}
                className="p-4 rounded-xl border flex items-center justify-between"
                
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{ep.ep}</span>
                    <span className="font-bold text-xs sm:text-sm">{ep.title}</span>
                  </div>
                  <div className="text-[11px] opacity-60 mt-0.5">{ep.date} \u2022 {ep.duration}</div>
                </div>

                <button
                  onClick={() => setIsPlaying(true)}
                  className="p-2 rounded-xl border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  
                >
                  <Play className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Persistent Audio Waveform Player Bar */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-2xl border-t transition-colors shadow-2xl"
        style={{
          backgroundColor: isDark ? "rgba(9, 10, 15, 0.94)" : "rgba(255, 255, 255, 0.95)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Episode Snippet Info */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-800 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
              EP148
            </div>
            <div className="truncate">
              <div className="font-bold text-xs truncate">Zero-Cost Abstractions</div>
              <div className="text-[10px] opacity-60 truncate">Linus M. \u2022 EP 148</div>
            </div>
          </div>

          {/* Core Controls & Waveform */}
          <div className="flex flex-col items-center gap-1.5 w-full max-w-xl">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentSeconds(Math.max(0, currentSeconds - 15))}
                className="opacity-70 hover:opacity-100"
                title="Rewind 15s"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => setCurrentSeconds(Math.min(totalSeconds, currentSeconds + 15))}
                className="opacity-70 hover:opacity-100"
                title="Forward 15s"
              >
                <RotateCw className="h-4 w-4" />
              </button>

              {/* Speed Multiplier */}
              <button
                onClick={() => {
                  const speeds: ("1.0x" | "1.25x" | "1.5x" | "2.0x")[] = ["1.0x", "1.25x", "1.5x", "2.0x"];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIdx]);
                }}
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border opacity-80 hover:opacity-100"
                
              >
                {playbackSpeed}
              </button>
            </div>

            {/* Scrubbable Waveform Visualizer */}
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] font-mono opacity-60 w-10 text-right">
                {formatTime(currentSeconds)}
              </span>

              {/* SVG Dynamic Waveform Bars */}
              <div className="flex-1 flex items-center gap-0.5 h-6 cursor-pointer">
                {Array.from({ length: 45 }).map((_, i) => {
                  const pct = (i / 45) * totalSeconds;
                  const isPassed = currentSeconds >= pct;
                  const h = 6 + ((i * 11) % 18);
                  return (
                    <div
                      key={i}
                      onClick={() => setCurrentSeconds(Math.floor(pct))}
                      className={\`flex-1 rounded-full transition-all \${
                        isPassed ? "bg-indigo-600" : "bg-zinc-300 dark:bg-zinc-700 opacity-60"
                      }\`}
                      style={{ height: \`\${h}px\` }}
                    />
                  );
                })}
              </div>

              <span className="text-[10px] font-mono opacity-60 w-10">
                {formatTime(totalSeconds)}
              </span>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="hidden md:flex items-center gap-2">
            <Volume2 className="h-4 w-4 opacity-60" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-20 accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Download Notification Toast */}
      {downloadToast && (
        <div className="fixed bottom-24 right-6 z-50 px-4 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{downloadToast}</span>
        </div>
      )}
    </div>
  );
}
`
};

// src/registry/template-real-estate.ts
var templateRealEstate = {
  name: "template-real-estate",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-real-estate.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Calendar,
  MapPin,
  Users,
  Compass,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Award,
  Sparkles,
  Layers,
  PhoneCall,
  X,
  Share2,
  Eye,
} from "lucide-react";

export interface RealEstateTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function RealEstateTemplate({
  brandName = "Haven Luxury Estates",
  theme = "dark",
}: RealEstateTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [activeFloorLevel, setActiveFloorLevel] = useState<"level-1" | "level-2" | "terrace">("level-1");
  const [selectedHotspot, setSelectedHotspot] = useState<string>("suite");
  const [nights, setNights] = useState(4);
  const [guests, setGuests] = useState(4);
  const [includeChef, setIncludeChef] = useState(true);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveToast, setReserveToast] = useState(false);

  const baseRatePerNight = 2450;
  const chefServicePerNight = 650;
  const calculatedTotal =
    (baseRatePerNight + (includeChef ? chefServicePerNight : 0)) * nights + 450; // 450 cleaning & concierge

  const floorPlans = {
    "level-1": {
      name: "Level 1: Great Room & Culinary Pavilion",
      area: "4,200 sq.ft",
      hotspots: [
        { id: "suite", name: "Cantilevered Great Hall", desc: "Double-height 24ft glazing with direct mountain vistas and fireplace." },
        { id: "kitchen", name: "Chef's Kitchen & Cellar", desc: "Custom Boffi cabinetry, Gaggenau 400 series, 1,200 bottle tasting cellar." },
        { id: "pool", name: "Heated Black-Granite Pool", desc: "Zero-edge infinity pool extending 60 feet over the alpine canyon." },
      ],
    },
    "level-2": {
      name: "Level 2: Master Sanctuary & Wellness Spa",
      area: "3,400 sq.ft",
      hotspots: [
        { id: "master", name: "Primary Master Suite", desc: "Private wrap-around cedar deck, freestanding soaking tub, dual dressing rooms." },
        { id: "spa", name: "Finnish Sauna & Cold Plunge", desc: "Thermal hydrotherapy suite with mountain view sauna and steam grotto." },
      ],
    },
    terrace: {
      name: "Terrace: Stargazing Deck & Helipad",
      area: "1,800 sq.ft",
      hotspots: [
        { id: "deck", name: "Stargazing Fire Table", desc: "Custom basalt gas fire table with heated lounge seating." },
        { id: "helipad", name: "Private Aviation Helipad", desc: "FAA-certified private landing pad with lighted windsock and ground power." },
      ],
    },
  };

  const amenities = [
    { title: "Heated Black-Granite Infinity Pool", subtitle: "Year-round 104\xB0F alpine soak with cantilevered canyon views" },
    { title: "Direct Ski-in / Ski-out Access", subtitle: "Private heated gear locker connected to Aspen Mountain trails" },
    { title: "Dedicated Private Sommelier & Chef", subtitle: "Personalized seasonal menus paired with rare vintage reserves" },
    { title: "FAA-Certified Private Helipad", subtitle: "Direct executive helicopter arrivals from Aspen (ASE) or Denver (DEN)" },
  ];

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReserveModalOpen(false);
    setReserveToast(true);
    setTimeout(() => setReserveToast(false), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Editorial Luxury Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-serif text-sm sm:text-base tracking-widest uppercase font-light"
                
              >
                {brandName || "Haven Luxury Estates"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden md:inline-block text-[11px] uppercase tracking-widest opacity-60 font-mono">
              Aspen \u2022 Kyoto \u2022 Amalfi \u2022 Zurich
            </span>

            <button
              onClick={() => setIsReserveModalOpen(true)}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
              
            >
              Inquire Residence
            </button>
          </div>
        </div>
      </header>

      {/* Property Hero Showcase */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4" >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider uppercase opacity-60">Architectural Residence #04</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                Available for Season
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs opacity-75 font-mono">
              <MapPin className="h-3.5 w-3.5 text-stone-500" />
              <span>Red Mountain \u2022 Aspen Valley, Colorado</span>
            </div>
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight leading-tight"
            
          >
            The Obsidian Pavilion
          </h1>

          <p className="text-sm sm:text-base opacity-75 max-w-3xl leading-relaxed font-light">
            Designed by studio Olson Kundig. A 9,400 sq.ft private alpine sanctuary crafted from charred Japanese cedar, raw board-formed concrete, and floor-to-ceiling guillotine glass walls overlooking the Continental Divide.
          </p>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: "Interior Living Area", val: "9,400 sq.ft" },
              { label: "Bedrooms & Suites", val: "5 Master Suites" },
              { label: "Bathrooms", val: "6 Full, 2 Half" },
              { label: "Private Estate Grounds", val: "14.2 Secluded Acres" },
            ].map((spec) => (
              <div
                key={spec.label}
                className="p-3.5 rounded-xl border"
                
              >
                <div className="text-[11px] opacity-60 uppercase tracking-wider">{spec.label}</div>
                <div className="text-sm sm:text-base font-serif font-bold mt-0.5">{spec.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Layout: Blueprint Viewer (7 Cols) + Reservation Calculator (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Architectural Floor Plan Viewer: 7 Cols */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm"
              
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-base sm:text-lg font-bold">Interactive Floor Plans</h2>
                  <p className="text-xs opacity-65">Explore blueprint levels and spatial room dimensions.</p>
                </div>

                {/* Level Switcher */}
                <div
                  className="inline-flex p-1 rounded-xl border text-xs"
                  
                >
                  {(["level-1", "level-2", "terrace"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setActiveFloorLevel(lvl);
                        setSelectedHotspot(floorPlans[lvl].hotspots[0].id);
                      }}
                      className={\`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all \${
                        activeFloorLevel === lvl
                          ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-black font-bold shadow-sm"
                          : "opacity-60 hover:opacity-100"
                      }\`}
                    >
                      {lvl === "level-1" ? "Level 1" : lvl === "level-2" ? "Level 2" : "Terrace"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Architectural Blueprint SVG Schematic */}
              <div
                className="w-full h-64 rounded-xl border p-4 relative flex flex-col justify-between overflow-hidden"
                style={{
                  backgroundColor: isDark ? "#0d0f17" : "#f1f3f5",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex justify-between text-[11px] font-mono opacity-50">
                  <span>SCALE: 1/8" = 1'-0" \u2022 NORTH \u2197</span>
                  <span>{floorPlans[activeFloorLevel].area}</span>
                </div>

                {/* Hotspot Room Selector Buttons inside Blueprint schematic */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-auto">
                  {floorPlans[activeFloorLevel].hotspots.map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedHotspot(spot.id)}
                      className={\`p-3 rounded-xl border text-left text-xs transition-all \${
                        selectedHotspot === spot.id
                          ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/10 font-bold"
                          : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 bg-white/40 dark:bg-black/40"
                      }\`}
                    >
                      <div className="font-semibold truncate">{spot.name}</div>
                      <div className="text-[10px] opacity-60 mt-0.5">Inspect Spec \u2192</div>
                    </button>
                  ))}
                </div>

                <div className="text-[10px] font-mono opacity-40 text-right">
                  ARCHITECTURAL ELEVATION: 8,420 FT ASL
                </div>
              </div>

              {/* Hotspot Detail Callout */}
              {(() => {
                const currentSpot = floorPlans[activeFloorLevel].hotspots.find(
                  (s) => s.id === selectedHotspot
                ) || floorPlans[activeFloorLevel].hotspots[0];
                return (
                  <div
                    className="p-4 rounded-xl border space-y-1 text-xs"
                    
                  >
                    <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>{currentSpot.name}</span>
                    </div>
                    <p className="opacity-80 leading-relaxed font-light">{currentSpot.desc}</p>
                  </div>
                );
              })()}
            </div>

            {/* Curated Luxury Amenities */}
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-4"
              
            >
              <h3 className="font-serif text-base font-bold">Estate Curations & Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {amenities.map((amenity) => (
                  <div
                    key={amenity.title}
                    className="p-3.5 rounded-xl border space-y-1"
                    
                  >
                    <div className="font-bold">{amenity.title}</div>
                    <div className="text-[11px] opacity-70 font-light leading-relaxed">
                      {amenity.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stay Reservation Calculator: 5 Cols */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="p-6 rounded-2xl border space-y-6 shadow-md"
              
            >
              <div className="border-b pb-4">
                <div className="text-2xl sm:text-3xl font-serif font-bold">
                  \${baseRatePerNight.toLocaleString()}{" "}
                  <span className="text-xs font-sans font-normal opacity-60">/ night</span>
                </div>
                <p className="text-xs opacity-65 mt-1 font-mono">Minimum 3 nights stay required</p>
              </div>

              {/* Calculator Inputs */}
              <div className="space-y-4 text-xs">
                {/* Nights slider */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Stay Duration</span>
                    <span className="font-mono text-sm">{nights} Nights</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="14"
                    value={nights}
                    onChange={(e) => setNights(parseInt(e.target.value))}
                    className="w-full accent-stone-800 dark:accent-stone-200"
                  />
                  <div className="flex justify-between text-[10px] font-mono opacity-50">
                    <span>3 nights</span>
                    <span>7 nights</span>
                    <span>14 nights</span>
                  </div>
                </div>

                {/* Guests counter */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Accommodating Guests</span>
                    <span className="font-mono text-sm">{guests} Guests</span>
                  </div>
                  <div className="flex items-center justify-between border rounded-xl p-2" >
                    <span className="opacity-75">Max 10 guests across 5 suites</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-sm"
                        
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-mono font-bold">{guests}</span>
                      <button
                        onClick={() => setGuests(Math.min(10, guests + 1))}
                        className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-sm"
                        
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add-on: Dedicated Private Chef */}
                <label
                  className="p-3.5 rounded-xl border flex items-center justify-between cursor-pointer"
                  
                >
                  <div>
                    <div className="font-bold">Private Michelin Chef Service</div>
                    <div className="text-[11px] opacity-65 font-light">Breakfast & 5-course dinner (+$650/night)</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeChef}
                    onChange={(e) => setIncludeChef(e.target.checked)}
                    className="w-4 h-4 rounded accent-stone-800"
                  />
                </label>

                {/* Cost Breakdown Ledger */}
                <div
                  className="p-4 rounded-xl border space-y-2 text-xs font-mono"
                  
                >
                  <div className="flex justify-between">
                    <span>Residence ({nights} nights)</span>
                    <span>\${(baseRatePerNight * nights).toLocaleString()}</span>
                  </div>
                  {includeChef && (
                    <div className="flex justify-between">
                      <span>Chef Service ({nights} nights)</span>
                      <span>\${(chefServicePerNight * nights).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Valet & Alpine Concierge</span>
                    <span>$450</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-sm font-sans" >
                    <span>Estimated Total Stay</span>
                    <span>\${calculatedTotal.toLocaleString()} USD</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsReserveModalOpen(true)}
                  className="w-full py-3.5 rounded-xl font-serif tracking-wide uppercase font-bold text-xs text-white shadow-lg transition-transform active:scale-[0.98]"
                  
                >
                  Reserve Obsidian Pavilion
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reservation Inquiry Modal */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: "#181a24",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" >
              <span className="font-serif font-bold text-base">Inquire: The Obsidian Pavilion</span>
              <button onClick={() => setIsReserveModalOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReserveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 opacity-80">Full Name</label>
                <input
                  type="text"
                  defaultValue="Lord & Lady Sterling"
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Private Email Address</label>
                <input
                  type="email"
                  defaultValue="sterling@monolith.ch"
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  
                />
              </div>

              <div className="p-3 rounded-xl border text-[11px] font-mono opacity-80" >
                Selected: {nights} Nights \u2022 {guests} Guests \u2022 Estimated Quote: \${calculatedTotal.toLocaleString()} USD
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-semibold opacity-75"
                  
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-serif font-bold uppercase tracking-wider text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Toast */}
      {reserveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-stone-900 text-white text-xs font-serif font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Inquiry received. Private concierge will call within 2 hours.</span>
        </div>
      )}
    </div>
  );
}
`
};

// src/registry/template-uptime-status.ts
var templateUptimeStatus = {
  name: "template-uptime-status",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-uptime-status.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Globe,
  Bell,
  ShieldCheck,
  Clock,
  Server,
  Activity,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  X,
  Send,
  Zap,
} from "lucide-react";

export interface UptimeStatusTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function UptimeStatusTemplate({
  brandName = "Beacon Status",
  theme = "dark",
}: UptimeStatusTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [hoveredDay, setHoveredDay] = useState<{ service: string; day: number; uptime: string } | null>(null);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribedToast, setSubscribedToast] = useState(false);

  const services = [
    {
      name: "Global Anycast Edge CDN & Ingress",
      category: "Routing & CDN",
      uptime: "100.0%",
      latency: "11ms",
      status: "Operational",
      incidentDays: [] as number[],
    },
    {
      name: "Authentication & OAuth SSO Engine",
      category: "Security",
      uptime: "99.99%",
      latency: "24ms",
      status: "Operational",
      incidentDays: [22],
    },
    {
      name: "Distributed Vector Indexing Pipeline",
      category: "Compute",
      uptime: "99.97%",
      latency: "38ms",
      status: "Operational",
      incidentDays: [54],
    },
    {
      name: "Transaction Database Clusters (Postgres)",
      category: "Storage",
      uptime: "99.95%",
      latency: "14ms",
      status: "Operational",
      incidentDays: [12, 68],
    },
    {
      name: "Asynchronous Webhook & Queue Workers",
      category: "Integration",
      uptime: "99.99%",
      latency: "18ms",
      status: "Operational",
      incidentDays: [] as number[],
    },
  ];

  const regions = [
    { region: "US-East (N. Virginia)", ping: "12ms", load: "18%", status: "Optimal" },
    { region: "US-West (Oregon)", ping: "22ms", load: "24%", status: "Optimal" },
    { region: "EU-Central (Frankfurt)", ping: "16ms", load: "32%", status: "Optimal" },
    { region: "AP-East (Tokyo)", ping: "38ms", load: "28%", status: "Optimal" },
    { region: "SA-East (S\xE3o Paulo)", ping: "78ms", load: "14%", status: "Optimal" },
    { region: "AP-South (Singapore)", ping: "44ms", load: "21%", status: "Optimal" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    setIsSubscribeOpen(false);
    setSubscribedToast(true);
    setTimeout(() => setSubscribedToast(false), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Top Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-bold text-sm sm:text-base tracking-tight"
                
              >
                {brandName || "Beacon Status"}
              </span>
              <span className="hidden md:inline-block text-xs opacity-60 ml-2 font-mono">
                \u2022 Public Availability Telemetry
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSubscribeOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
            
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Subscribe to Alerts</span>
          </button>
        </div>
      </header>

      {/* Main Status Portal Body */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* System Availability Status Hero Banner */}
        <div
          className="p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
          style={{
            backgroundColor: "#12141c",
            borderColor: "rgba(16, 185, 129, 0.3)",
            borderRadius: "0.75rem",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg">All Core Systems Fully Operational</h1>
              <p className="text-xs opacity-75 mt-0.5">
                99.994% overall uptime across 35 edge regions over the last 90 days.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto" >
            <div className="text-[11px] font-mono opacity-60">Automated Probes: Every 30s</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Zero Unresolved Incidents</div>
          </div>
        </div>

        {/* 90-Day Component Uptime Grid */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-500" />
              <span>Core Service Availability (Past 90 Days)</span>
            </h2>
            <span className="text-xs font-mono opacity-60 hidden sm:inline">Hover on bars for daily log</span>
          </div>

          <div className="space-y-3">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="p-4 rounded-2xl border space-y-3"
                
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <span className="font-bold text-sm text-foreground">{svc.name}</span>
                    <span className="text-xs opacity-60 ml-2 font-mono">({svc.category})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] opacity-70">Latency: {svc.latency}</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {svc.uptime}
                    </span>
                  </div>
                </div>

                {/* 90-Day Bar Strip */}
                <div className="flex items-center gap-0.5 h-7">
                  {Array.from({ length: 90 }).map((_, dayIdx) => {
                    const hasIncident = svc.incidentDays.includes(dayIdx);
                    const barColor = hasIncident
                      ? "bg-amber-500 hover:bg-amber-400"
                      : "bg-emerald-500/80 hover:bg-emerald-400";
                    return (
                      <div
                        key={dayIdx}
                        onMouseEnter={() =>
                          setHoveredDay({
                            service: svc.name,
                            day: 90 - dayIdx,
                            uptime: hasIncident ? "99.82% (Minor incident resolved)" : "100.0% Optimal",
                          })
                        }
                        onMouseLeave={() => setHoveredDay(null)}
                        className={\`flex-1 h-full rounded-sm transition-transform hover:scale-125 cursor-pointer \${barColor}\`}
                      />
                    );
                  })}
                </div>

                <div className="flex justify-between text-[10px] font-mono opacity-50 pt-1">
                  <span>90 days ago</span>
                  <span>45 days ago</span>
                  <span>Today (100% Operational)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Hover tooltip readout */}
          {hoveredDay && (
            <div
              className="p-3 rounded-xl border text-xs font-mono flex items-center justify-between bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
            >
              <span>{hoveredDay.service} \u2022 {hoveredDay.day} days ago</span>
              <span className="font-bold">{hoveredDay.uptime}</span>
            </div>
          )}
        </section>

        {/* Global Regional Latency Monitor Grid */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-500" />
              <span>Global Regional Latency Probes</span>
            </h2>
            <span className="text-xs font-mono opacity-60">Real-time ICMP ping telemetry</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {regions.map((r) => (
              <div
                key={r.region}
                className="p-3.5 rounded-xl border space-y-1.5"
                
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold truncate">{r.region}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    {r.status}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs font-mono">
                  <span className="text-lg font-black text-foreground">{r.ping}</span>
                  <span className="text-[11px] opacity-60">CPU: {r.load}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Past Incident Response Log */}
        <section className="space-y-4">
          <h2 className="font-bold text-sm sm:text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span>Incident Response History</span>
          </h2>

          <div
            className="p-5 sm:p-6 rounded-2xl border space-y-4"
            
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-3" >
              <div>
                <span className="text-xs font-mono font-bold text-amber-500">INC-4829</span>
                <h3 className="font-bold text-sm mt-0.5">Elevated Connection Pool Latency on Postgres Read-Replica</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold w-fit">
                Resolved in 14m
              </span>
            </div>

            <div className="space-y-3 text-xs opacity-85 leading-relaxed pl-3 border-l-2 border-emerald-500">
              <div>
                <span className="font-bold text-foreground">14:22 UTC - Resolved:</span> Automatic failover triggered to secondary multi-AZ replica. Latency normalized to 14ms.
              </div>
              <div>
                <span className="font-bold text-foreground">14:12 UTC - Monitoring:</span> Traffic drained from degraded node. Verification telemetry stable.
              </div>
              <div>
                <span className="font-bold text-foreground">14:08 UTC - Investigating:</span> SRE team paged. Query queue depth elevated on us-east cluster.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Subscription Modal */}
      {isSubscribeOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: "#181a24",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" >
              <span className="font-bold text-base">Subscribe to Incident Alerts</span>
              <button onClick={() => setIsSubscribeOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3 text-xs">
              <p className="opacity-75 leading-relaxed">
                Receive immediate dispatch notifications whenever an incident is reported, updated, or resolved.
              </p>
              <div>
                <label className="block font-semibold mb-1 opacity-80">Email or Slack Webhook URL</label>
                <input
                  type="email"
                  required
                  placeholder="sre-alerts@company.com"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubscribeOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-semibold opacity-75"
                  
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Toast */}
      {subscribedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Subscribed to Beacon Status notifications!</span>
        </div>
      )}
    </div>
  );
}
`
};

// src/registry/template-agent-workflow.ts
var templateAgentWorkflow = {
  name: "template-agent-workflow",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-agent-workflow.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  Play,
  Sliders,
  CheckCircle2,
  GitBranch,
  Cpu,
  Database,
  Send,
  Plus,
  RefreshCw,
  X,
  Sparkles,
  Zap,
  Code2,
  Settings,
  ChevronRight,
  Terminal,
  Activity,
  Layers,
} from "lucide-react";

export interface AgentWorkflowTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function AgentWorkflowTemplate({
  brandName = "Nexus Nodes",
  theme = "dark",
}: AgentWorkflowTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [activeRecipe, setActiveRecipe] = useState<"support" | "finance" | "lead">("support");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-llm");
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [temperature, setTemperature] = useState(0.2);
  const [modelChoice, setModelChoice] = useState("Claude 3.5 Sonnet");
  const [logs, setLogs] = useState<string[]>([
    "\u2713 Canvas initialized. 4 nodes mounted. Latency baseline: 2ms.",
  ]);

  const nodes = [
    {
      id: "node-trigger",
      title: "Webhook Ingress",
      category: "Trigger",
      icon: Zap,
      color: "border-amber-500 text-amber-500",
      bg: "bg-amber-500/10",
      details: "POST /v1/incoming-inquiry",
      meta: "Payload: JSON Schema 2.0",
    },
    {
      id: "node-rag",
      title: "Vector DB Retrieval",
      category: "Knowledge Tool",
      icon: Database,
      color: "border-cyan-500 text-cyan-500",
      bg: "bg-cyan-500/10",
      details: "Pinecone: support-kb-v4",
      meta: "Top K: 5 \u2022 Cosine Threshold: 0.86",
    },
    {
      id: "node-llm",
      title: "Reasoning LLM",
      category: "Model Engine",
      icon: Cpu,
      color: "border-blue-500 text-blue-500",
      bg: "bg-blue-500/10",
      details: modelChoice,
      meta: \`Temp: \${temperature} \u2022 Max: 1,024 toks\`,
    },
    {
      id: "node-dispatch",
      title: "Action Dispatcher",
      category: "Output Tool",
      icon: Send,
      color: "border-emerald-500 text-emerald-500",
      bg: "bg-emerald-500/10",
      details: "Zendesk & Slack Webhook",
      meta: "Route: #support-escalations",
    },
  ];

  const handleRunPipeline = () => {
    setIsRunning(true);
    setActiveStepIndex(0);
    setLogs(["[00:00] Initializing workflow execution..."]);

    setTimeout(() => {
      setActiveStepIndex(1);
      setLogs((prev) => [...prev, "[00:18] Webhook event received. Parsing customer payload..."]);
      setTimeout(() => {
        setActiveStepIndex(2);
        setLogs((prev) => [
          ...prev,
          "[00:94] Vector search complete. 5 knowledge chunks fetched from Pinecone.",
        ]);
        setTimeout(() => {
          setActiveStepIndex(3);
          setLogs((prev) => [
            ...prev,
            \`[04:20] \${modelChoice} synthesized resolution with 420 reasoning tokens.\`,
          ]);
          setTimeout(() => {
            setIsRunning(false);
            setActiveStepIndex(null);
            setLogs((prev) => [
              ...prev,
              "\u2713 [05:10] Workflow finished! Response delivered to Zendesk ticket #4910.",
            ]);
          }, 800);
        }, 1100);
      }, 700);
    }, 600);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Studio Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-bold text-sm sm:text-base tracking-tight"
                
              >
                {brandName || "Nexus Nodes"}
              </span>
              <span className="hidden md:inline-block text-xs opacity-60 ml-2 font-mono">
                \u2022 Visual Agent Orchestrator
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleRunPipeline}
              disabled={isRunning}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition-transform active:scale-95"
              style={{
                backgroundColor: isRunning ? "#2563eb" : "#6366f1",
                borderRadius: "0.75rem",
              }}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Test Run Workflow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas Workspace */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Pipeline Control Toolbar */}
        <div
          className="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold opacity-70">Preset Workflow:</span>
            <div
              className="inline-flex p-0.5 rounded-xl border"
              
            >
              {[
                { id: "support", label: "Support Auto-Triage" },
                { id: "finance", label: "Doc Extractor" },
                { id: "lead", label: "Lead Scoring" },
              ].map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => setActiveRecipe(rec.id as any)}
                  className={\`px-3 py-1 rounded-lg font-medium transition-all \${
                    activeRecipe === rec.id
                      ? "bg-blue-600 text-white font-bold shadow-sm"
                      : "opacity-70 hover:opacity-100"
                  }\`}
                >
                  {rec.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono opacity-60">
            <span>Canvas Status: Operational</span>
            <span>\u2022</span>
            <span>4 Active Nodes</span>
          </div>
        </div>

        {/* Visual Graph Nodes Flow + Parameter Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Node Canvas Area: 8 Cols */}
          <div className="lg:col-span-8 space-y-6">
            <div
              className="p-6 sm:p-8 rounded-3xl border relative overflow-hidden min-h-[420px] flex flex-col justify-between"
              style={{
                backgroundColor: isDark ? "#090a10" : "#f8fafc",
                borderColor: "rgba(255, 255, 255, 0.08)",
                backgroundImage: \`radial-gradient(\${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} 1px, transparent 1px)\`,
                backgroundSize: "24px 24px",
              }}
            >
              <div className="flex justify-between items-center text-xs opacity-60 font-mono">
                <span>CANVAS: ORCHESTRATION GRAPH</span>
                <span>EXECUTION: SERIAL SYNCHRONOUS</span>
              </div>

              {/* Connected Nodes Flow Sequence */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-auto py-6">
                {nodes.map((node, index) => {
                  const IconComp = node.icon;
                  const isSelected = selectedNodeId === node.id;
                  const isCurrentlyExecuting = activeStepIndex === index;

                  return (
                    <React.Fragment key={node.id}>
                      {/* Node Card */}
                      <button
                        onClick={() => setSelectedNodeId(node.id)}
                        className={\`w-full sm:w-44 p-4 rounded-2xl border text-left transition-all relative \${
                          isCurrentlyExecuting
                            ? "ring-4 ring-blue-500 scale-105 shadow-xl bg-blue-500/20"
                            : isSelected
                            ? "ring-2 ring-blue-500 shadow-md"
                            : "hover:border-zinc-400"
                        }\`}
                        style={{
                          backgroundColor: isSelected
                            ? "#181a24"
                            : "#12141c",
                          borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={\`p-1.5 rounded-lg \${node.bg} \${node.color}\`}>
                            <IconComp className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-mono opacity-60">{node.category}</span>
                        </div>

                        <div className="font-bold text-xs sm:text-sm truncate">{node.title}</div>
                        <div className="text-[11px] opacity-75 font-mono truncate mt-0.5">{node.details}</div>
                      </button>

                      {/* Connecting Cable Connector Indicator */}
                      {index < nodes.length - 1 && (
                        <div className="flex items-center justify-center my-1 sm:my-0">
                          <div
                            className={\`w-6 h-0.5 sm:w-8 transition-colors \${
                              activeStepIndex !== null && activeStepIndex > index
                                ? "bg-blue-500 shadow-sm"
                                : "bg-zinc-300 dark:bg-zinc-700"
                            }\`}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-xs opacity-60">
                <span>Tip: Click any node to configure parameters in inspector.</span>
                <span className="font-mono">Node ID: {selectedNodeId}</span>
              </div>
            </div>

            {/* Live Pipeline Execution Terminal Console */}
            <div
              className="p-5 rounded-2xl border space-y-2 font-mono text-xs"
              style={{
                backgroundColor: isDark ? "#06070a" : "#0f172a",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#e2e8f0",
              }}
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/10 text-[11px] opacity-60">
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-blue-400" />
                  <span>Pipeline Execution Telemetry</span>
                </span>
                <span>Stream Active</span>
              </div>

              <div className="space-y-1 pt-1 max-h-36 overflow-y-auto">
                {logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed opacity-90">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Parameter Inspector Sidebar Drawer: 4 Cols */}
          <div className="lg:col-span-4 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-5 shadow-sm"
              
            >
              <div className="border-b pb-3">
                <div className="text-xs uppercase font-mono tracking-wider opacity-60">Node Parameters</div>
                <h3 className="font-bold text-base mt-0.5">
                  {nodes.find((n) => n.id === selectedNodeId)?.title}
                </h3>
              </div>

              {selectedNodeId === "node-llm" ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Foundation Model</label>
                    <select
                      value={modelChoice}
                      onChange={(e) => setModelChoice(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                      
                    >
                      <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                      <option value="DeepSeek R1">DeepSeek R1 (Reasoning)</option>
                      <option value="GPT-4o Omnimodal">GPT-4o (OpenAI)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1 opacity-80">
                      <span>Sampling Temperature</span>
                      <span className="font-mono">{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] opacity-50 font-mono">
                      <span>Deterministic (0.0)</span>
                      <span>Creative (1.0)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 opacity-80">System Directive</label>
                    <textarea
                      rows={3}
                      defaultValue="Analyze customer ticket intent, cross-reference Pinecone vectors, and generate concise verified resolution."
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none text-xs leading-relaxed"
                      
                    />
                  </div>
                </div>
              ) : selectedNodeId === "node-rag" ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Vector Index</label>
                    <input
                      type="text"
                      defaultValue="support-kb-v4"
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none font-mono"
                      
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Similarity Threshold (Cosine)</label>
                    <input
                      type="text"
                      defaultValue="0.86"
                      className="w-full p-2.5 rounded-xl border bg-transparent outline-none font-mono"
                      
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs opacity-75 leading-relaxed">
                  <p>Standard configuration active for {selectedNodeId}. All payload schema validations passing.</p>
                </div>
              )}

              <div className="border-t pt-4">
                <button
                  onClick={handleRunPipeline}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-sm"
                >
                  Apply & Run Node
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`
};

// src/registry/template-restaurant-culinary.ts
var templateRestaurantCulinary = {
  name: "template-restaurant-culinary",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-restaurant-culinary.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Calendar,
  Users,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Wine,
  Leaf,
  X,
  PhoneCall,
  Heart,
} from "lucide-react";

export interface RestaurantCulinaryTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function RestaurantCulinaryTemplate({
  brandName = "Komorebi Dining",
  theme = "dark",
}: RestaurantCulinaryTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [activeMenuTab, setActiveMenuTab] = useState<"omakase" | "autumn" | "vegetal">("autumn");
  const [selectedDietary, setSelectedDietary] = useState<string>("All");
  const [partySize, setPartySize] = useState(2);
  const [selectedDate, setSelectedDate] = useState("Fri, Sep 18");
  const [selectedTime, setSelectedTime] = useState("19:30");
  const [seatingArea, setSeatingArea] = useState("hinoki");
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveToast, setReserveToast] = useState(false);

  const coursesData = {
    autumn: [
      {
        course: "Course I \u2022 Amuse",
        dish: "Hokkaido Sea Urchin & Dashi Tartlet",
        desc: "Smoked seaweed sabl\xE9, finger lime pearls, dashi reduction",
        pairing: "Krug Grande Cuv\xE9e 170th Edition",
        tags: ["Chef Signature"],
      },
      {
        course: "Course II \u2022 Cold Ocean",
        dish: "Wild Shima-Aji & Foraged Matsutake",
        desc: "Dry-aged striped jack sashimi, compressed persimmon, fermented shiso vinaigrette",
        pairing: "Kokuryu Ishidaya Daiginjo Sake",
        tags: ["Gluten-Free Available"],
      },
      {
        course: "Course III \u2022 Earth & Fire",
        dish: "A5 Miyazaki Wagyu Tenderloin",
        desc: "Binchotan charcoal sear, glazed autumn chanterelles, black garlic jus",
        pairing: "2018 Domaine de la Roman\xE9e-Conti Corton",
        tags: ["Chef Signature"],
      },
      {
        course: "Course IV \u2022 Dessert",
        dish: "Roasted White Truffle & Hojicha Gelato",
        desc: "Smoked caramel tuile, Piedmont white truffle shavings, single-origin matcha crumble",
        pairing: "Iced Kyoto Ceremonial Uji Gyokuro",
        tags: ["Vegetarian Safe"],
      },
    ],
    omakase: [
      {
        course: "Course I",
        dish: "Chawanmushi with Bluefin Otoro & Caviar",
        desc: "Silken egg custard, Oscietra royal reserve caviar",
        pairing: "Dom P\xE9rignon Vintage 2013",
        tags: ["Chef Signature"],
      },
      {
        course: "Course II",
        dish: "Charcoal-Grilled Black Cod & Saikyo Miso",
        desc: "Caramelized 72-hour Kyoto white miso marinade, pickled ginger root",
        pairing: "Isojiman Naka-dori Daiginjo",
        tags: ["Gluten-Free Available"],
      },
    ],
    vegetal: [
      {
        course: "Course I",
        dish: "Heirloom Beet Tartare & Roasted Sesame Emulsion",
        desc: "Charred baby leeks, aged tamari pearls, puffed buckwheat",
        pairing: "Bio-dynamic Alsace Riesling Grand Cru",
        tags: ["Vegetarian Safe"],
      },
      {
        course: "Course II",
        dish: "Braised Wild Mountain Yam & Black Truffle",
        desc: "Nagaimo braised in kombu dashi, shaved P\xE9rigord winter truffle",
        pairing: "Kenbishi Mizuho Junmai Sake",
        tags: ["Vegetarian Safe"],
      },
    ],
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReserveModalOpen(false);
    setReserveToast(true);
    setTimeout(() => setReserveToast(false), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Restaurant Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Utensils className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-serif text-sm sm:text-base tracking-widest uppercase font-semibold"
                
              >
                {brandName || "Komorebi Dining"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
              <Award className="h-3.5 w-3.5" />
              <span>Two Michelin Stars</span>
            </div>

            <button
              onClick={() => setIsReserveModalOpen(true)}
              className="px-4 py-1.5 rounded-xl text-xs font-serif uppercase tracking-wider font-bold text-white shadow-sm transition-transform active:scale-95"
              
            >
              Reserve Table
            </button>
          </div>
        </div>
      </header>

      {/* Culinary Hero */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif tracking-widest uppercase opacity-70 border" >
            <MapPin className="h-3.5 w-3.5 text-amber-600" />
            <span>Minami-Aoyama, Tokyo \u2022 Dinner Service 17:30 \u2013 23:00</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light tracking-tight leading-tight"
            
          >
            A Symphony of Wild Foraging & Modern Japanese Gastronomy
          </h1>

          <p className="text-sm sm:text-base opacity-75 max-w-2xl mx-auto leading-relaxed font-light">
            Crafted nightly around hyper-seasonal ingredients harvested from local mountain purveyors and Toyosu market fisheries, prepared over fragrant binchotan charcoal.
          </p>
        </section>

        {/* Core Layout: Tasting Menu (7 Cols) + Table Reservation Engine (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tasting Menu Breakdown: 7 Cols */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className="p-6 rounded-3xl border space-y-6"
              
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" >
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold">Seasonal Menus</h2>
                  <p className="text-xs opacity-65">Curated by Executive Chef Kenji Takahashi</p>
                </div>

                {/* Menu Tab Selector */}
                <div
                  className="inline-flex p-1 rounded-xl border text-xs"
                  
                >
                  {[
                    { id: "autumn", label: "Autumn (\xA528,000)" },
                    { id: "omakase", label: "Omakase (\xA538,000)" },
                    { id: "vegetal", label: "Vegetal (\xA522,000)" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveMenuTab(tab.id as any)}
                      className={\`px-3 py-1.5 rounded-lg font-serif font-semibold transition-all \${
                        activeMenuTab === tab.id
                          ? "bg-amber-700 text-white shadow-sm"
                          : "opacity-60 hover:opacity-100"
                      }\`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Courses List */}
              <div className="space-y-4">
                {coursesData[activeMenuTab].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border space-y-2 transition-colors"
                    
                  >
                    <div className="flex justify-between items-start text-xs font-serif">
                      <span className="font-bold text-amber-700 dark:text-amber-400">{item.course}</span>
                      <span className="text-[10px] font-sans px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold">
                        {item.tags[0]}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-base text-foreground">{item.dish}</h3>
                      <p className="text-xs opacity-75 mt-0.5 font-light leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px] opacity-70 font-mono">
                      <Wine className="h-3.5 w-3.5 text-amber-600" />
                      <span>Pairing: {item.pairing}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table Reservation Engine: 5 Cols */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="p-6 rounded-3xl border space-y-5 shadow-sm"
              
            >
              <div className="border-b pb-3">
                <h3 className="font-serif text-lg font-bold">Reserve a Table</h3>
                <p className="text-xs opacity-65 font-mono mt-0.5">Direct online booking with instant confirmation</p>
              </div>

              {/* Step 1: Party Size */}
              <div className="space-y-2 text-xs">
                <label className="font-semibold block opacity-80 font-serif">1. Party Size</label>
                <div className="flex gap-1.5">
                  {[1, 2, 4, 6, 8].map((size) => (
                    <button
                      key={size}
                      onClick={() => setPartySize(size)}
                      className={\`flex-1 py-2 rounded-xl border font-bold text-xs transition-colors \${
                        partySize === size
                          ? "bg-amber-700 text-white border-amber-700"
                          : "border-zinc-300 dark:border-zinc-700 opacity-75 hover:opacity-100"
                      }\`}
                    >
                      {size} {size === 1 ? "Guest" : "Guests"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Date Selector */}
              <div className="space-y-2 text-xs">
                <label className="font-semibold block opacity-80 font-serif">2. Seating Date</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Fri, Sep 18", "Sat, Sep 19", "Sun, Sep 20", "Wed, Sep 23", "Thu, Sep 24", "Fri, Sep 25"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={\`p-2 rounded-xl border text-center font-mono text-[11px] font-semibold transition-colors \${
                        selectedDate === d
                          ? "bg-amber-700 text-white border-amber-700"
                          : "border-zinc-300 dark:border-zinc-700 opacity-75 hover:opacity-100"
                      }\`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Seating Time */}
              <div className="space-y-2 text-xs">
                <label className="font-semibold block opacity-80 font-serif">3. Preferred Seating Time</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["17:30", "18:45", "20:00", "21:15"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={\`py-2 rounded-xl border text-center font-mono text-xs font-bold transition-colors \${
                        selectedTime === t
                          ? "bg-amber-700 text-white border-amber-700"
                          : "border-zinc-300 dark:border-zinc-700 opacity-75 hover:opacity-100"
                      }\`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Seating Area */}
              <div className="space-y-2 text-xs">
                <label className="font-semibold block opacity-80 font-serif">4. Seating Area</label>
                <div className="space-y-1.5">
                  {[
                    { id: "hinoki", name: "Chef's Hinoki Counter (Front row view)" },
                    { id: "main", name: "Main Dining Room (Intimate table)" },
                    { id: "garden", name: "Bamboo Garden Tea Pavilion" },
                  ].map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setSeatingArea(area.id)}
                      className={\`w-full p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between \${
                        seatingArea === area.id
                          ? "border-amber-600 bg-amber-600/10 font-bold"
                          : "border-zinc-300 dark:border-zinc-700 opacity-75"
                      }\`}
                    >
                      <span>{area.name}</span>
                      {seatingArea === area.id && <CheckCircle2 className="h-4 w-4 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={() => setIsReserveModalOpen(true)}
                  className="w-full py-3 rounded-xl font-serif uppercase tracking-widest font-bold text-xs text-white shadow-md transition-transform active:scale-[0.98]"
                  
                >
                  Confirm Table for {partySize}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reservation Confirmation Modal */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: "#181a24",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" >
              <span className="font-serif font-bold text-base">Confirm Reservation</span>
              <button onClick={() => setIsReserveModalOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReservationSubmit} className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border bg-amber-500/10 border-amber-500/20 space-y-1 font-serif">
                <div className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                  {selectedDate} at {selectedTime}
                </div>
                <div className="text-xs opacity-80 font-sans">
                  Party of {partySize} Guests \u2022 {seatingArea === "hinoki" ? "Chef's Counter" : "Main Dining"}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80 font-serif">Guest Name</label>
                <input
                  type="text"
                  defaultValue="Kenji Sutherland"
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80 font-serif">Special Dietary Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Shellfish allergy, birthday celebration"
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-serif"
                  
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-serif font-bold uppercase tracking-wider text-white bg-amber-700 hover:bg-amber-600"
                >
                  Complete Booking
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Toast */}
      {reserveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-amber-700 text-white text-xs font-serif font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Table confirmed! Confirmation SMS dispatched.</span>
        </div>
      )}
    </div>
  );
}
`
};

// src/registry/template-help-center.ts
var templateHelpCenter = {
  name: "template-help-center",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-help-center.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy,
  Search,
  HelpCircle,
  FileText,
  Send,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Code2,
  Users,
  Smartphone,
  ThumbsUp,
  ThumbsDown,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export interface HelpCenterTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function HelpCenterTemplate({
  brandName = "Resolv Desk",
  theme = "dark",
}: HelpCenterTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<number, boolean>>({});
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDepartment, setTicketDepartment] = useState("technical");
  const [ticketPriority, setTicketPriority] = useState<"low" | "normal" | "urgent">("normal");
  const [ticketToast, setTicketToast] = useState(false);

  const categories = [
    {
      title: "Getting Started & Onboarding",
      articles: "14 articles",
      icon: LifeBuoy,
      desc: "Quickstart guides, workspace setup, and team invites.",
      sample: "Inviting collaborators to your team workspace",
    },
    {
      title: "Billing & Invoicing",
      articles: "9 articles",
      icon: CreditCard,
      desc: "Managing card payments, enterprise invoicing, and VAT receipts.",
      sample: "Downloading annual billing VAT tax receipts",
    },
    {
      title: "Security, SSO & 2FA",
      articles: "18 articles",
      icon: ShieldCheck,
      desc: "SAML SSO, two-factor authentication, and audit logs.",
      sample: "Configuring Okta and Google Workspace SAML SSO",
    },
    {
      title: "Developer API & Webhooks",
      articles: "22 articles",
      icon: Code2,
      desc: "REST endpoints, rate limits, SDKs, and event signatures.",
      sample: "Handling webhook retry backoff algorithms",
    },
    {
      title: "Team Permissions & RBAC",
      articles: "11 articles",
      icon: Users,
      desc: "Granular access roles, audit trails, and guest permissions.",
      sample: "Setting custom role permissions matrix",
    },
    {
      title: "Mobile & Desktop Apps",
      articles: "8 articles",
      icon: Smartphone,
      desc: "macOS menu bar utilities, iOS notifications, and offline sync.",
      sample: "Enabling offline local cache persistence",
    },
  ];

  const faqs = [
    {
      q: "How do I transfer organization ownership to a new administrator?",
      a: "Navigate to Settings \u2192 Organization \u2192 General. Click 'Transfer Ownership' and select a verified team administrator. An email confirmation link will be sent to both parties to cryptographically authorize the change.",
    },
    {
      q: "What are the default API rate limits for production keys?",
      a: "Production keys are provisioned with 10,000 requests per minute with burst allowance up to 15,000 req/min. Enterprise tiers can configure custom multi-region rate limit pools via our technical architecture team.",
    },
    {
      q: "How does the 30-day money-back refund guarantee work?",
      a: "If you are dissatisfied with your plan within 30 days of initial subscription, submit a ticket under 'Billing & Invoices'. We process 100% full refunds back to your original payment method with zero cancellation penalties.",
    },
    {
      q: "Can we self-host or deploy NexoreUI in an air-gapped private cloud?",
      a: "Yes. Enterprise customers receive access to private container registries, Helm charts, and single-tenant AWS/GCP Terraform modules with zero external phone-home dependencies.",
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTicketModalOpen(false);
    setTicketToast(true);
    setTimeout(() => setTicketToast(false), 3500);
  };

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) ||
      cat.desc.toLowerCase().includes(q) ||
      cat.sample.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Support Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <LifeBuoy className="h-4 w-4" />
            </div>
            <div>
              <span
                className="font-bold text-sm sm:text-base tracking-tight"
                
              >
                {brandName || "Resolv Desk"}
              </span>
              <span className="hidden md:inline-block text-xs opacity-60 ml-2 font-mono">
                \u2022 Help Center & Docs
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
              
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Support: &lt; 4m wait</span>
            </div>

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Instant Search Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 text-center space-y-5">
        <h1
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto"
          
        >
          How can our customer support team help you today?
        </h1>
        <p className="text-xs sm:text-sm opacity-75 max-w-xl mx-auto leading-relaxed">
          Search over 120 verified setup guides, developer tutorials, or connect directly with our engineering tier.
        </p>

        {/* Search Input */}
        <div className="max-w-xl mx-auto relative pt-2">
          <Search className="absolute left-4 top-5 h-4 w-4 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, keywords (e.g. 2FA, refunds, API tokens)..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl border text-xs bg-transparent shadow-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/40"
            
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-5 opacity-60 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Search Shortcut Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
          <span className="opacity-60 text-[11px] mr-1">Popular searches:</span>
          {["Reset 2FA", "Update Billing Card", "API Rate Limits", "Custom SSO"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-1 rounded-lg border text-[11px] opacity-75 hover:opacity-100 transition-colors"
              
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Categorized Knowledge Base Grid */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-base sm:text-lg">Knowledge Base Topics</h2>
            <span className="text-xs opacity-60 font-mono">{filteredCategories.length} Categories</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="p-5 rounded-2xl border space-y-3 transition-colors hover:border-zinc-400 group cursor-pointer"
                  
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono opacity-60 font-semibold">{cat.articles}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs opacity-75 mt-1 leading-relaxed">{cat.desc}</p>
                  </div>

                  <div className="pt-2 border-t text-[11px] opacity-70 flex items-center justify-between" >
                    <span className="truncate">{cat.sample}</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-60 shrink-0 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Interactive FAQ Accordion Section */}
        <section className="space-y-4 max-w-4xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="font-bold text-xl">Frequently Asked Questions</h2>
            <p className="text-xs opacity-65">Instant answers to high-frequency customer questions.</p>
          </div>

          <div className="space-y-3 pt-2">
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              const hasVoted = helpfulFeedback[idx] !== undefined;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border space-y-3 transition-colors"
                  
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left font-bold text-xs sm:text-sm"
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 opacity-60 shrink-0" /> : <ChevronDown className="h-4 w-4 opacity-60 shrink-0" />}
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="pt-2 border-t space-y-4 text-xs opacity-85 leading-relaxed"
                      
                    >
                      <p>{faq.a}</p>

                      {/* Was this helpful feedback trigger */}
                      <div className="flex items-center justify-between pt-2 border-t text-[11px] opacity-75" >
                        <span>Was this answer helpful?</span>
                        {hasVoted ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Feedback recorded. Thank you!</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setHelpfulFeedback((prev) => ({ ...prev, [idx]: true }))}
                              className="px-2.5 py-1 rounded-lg border flex items-center gap-1 hover:bg-emerald-500/10 transition-colors"
                              
                            >
                              <ThumbsUp className="h-3 w-3 text-emerald-500" />
                              <span>Yes</span>
                            </button>
                            <button
                              onClick={() => setHelpfulFeedback((prev) => ({ ...prev, [idx]: false }))}
                              className="px-2.5 py-1 rounded-lg border flex items-center gap-1 hover:bg-rose-500/10 transition-colors"
                              
                            >
                              <ThumbsDown className="h-3 w-3 text-rose-500" />
                              <span>No</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Support Banner */}
        <section
          className="p-6 sm:p-8 rounded-3xl border text-center space-y-4 max-w-4xl mx-auto"
          
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <MessageSquare className="h-6 w-6" />
          </div>

          <h3 className="font-bold text-lg sm:text-xl">Still need direct assistance?</h3>
          <p className="text-xs sm:text-sm opacity-75 max-w-md mx-auto leading-relaxed">
            Our systems and customer engineering staff are on standby 24 hours a day, 7 days a week.
          </p>

          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-transform active:scale-95"
            
          >
            Create New Support Ticket
          </button>
        </section>
      </main>

      {/* Support Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: "#181a24",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <div className="flex justify-between items-center pb-2 border-b" >
              <span className="font-bold text-base">Create Support Ticket</span>
              <button onClick={() => setIsTicketModalOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 opacity-80">Department Routing</label>
                <select
                  value={ticketDepartment}
                  onChange={(e) => setTicketDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  
                >
                  <option value="technical">Technical Support & Architecture</option>
                  <option value="billing">Billing & Invoicing</option>
                  <option value="enterprise">Enterprise SLA & Custom Plans</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Priority Severity</label>
                <div className="flex gap-2">
                  {(["low", "normal", "urgent"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTicketPriority(p)}
                      className={\`flex-1 py-1.5 rounded-lg border font-bold text-xs uppercase tracking-wider transition-colors \${
                        ticketPriority === p
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-zinc-300 dark:border-zinc-700 opacity-75 hover:opacity-100"
                      }\`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Brief description of the issue..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                  
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 opacity-80">Message Body</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please include error logs, relevant URLs, or steps to reproduce..."
                  className="w-full p-2.5 rounded-xl border bg-transparent outline-none text-xs leading-relaxed"
                  
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-semibold opacity-75"
                  
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Toast */}
      {ticketToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Ticket #8492 received! Our engineering tier is reviewing.</span>
        </div>
      )}
    </div>
  );
}
`
};

// src/registry/template-fitness-athletics.ts
var templateFitnessAthletics = {
  name: "template-fitness-athletics",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-fitness-athletics.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Heart,
  Flame,
  Moon,
  Trophy,
  Zap,
  Timer,
  TrendingUp,
  Dumbbell,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Calendar,
  ChevronRight,
  Plus,
  BarChart2,
  Sliders,
  Check,
  X,
  Footprints,
} from "lucide-react";

export interface FitnessAthleticsTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function FitnessAthleticsTemplate({
  brandName = "AeroPulse Athletics",
  theme = "dark",
}: FitnessAthleticsTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [targetBpm, setTargetBpm] = useState(158);
  const [volumeMetric, setVolumeMetric] = useState<"distance" | "tonnage" | "duration">("distance");
  const [activeTab, setActiveTab] = useState<"dashboard" | "intervals" | "records">("dashboard");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logWorkoutType, setLogWorkoutType] = useState("tempo-run");
  const [logToast, setLogToast] = useState<string | null>(null);

  // Interval checklist state
  const [completedIntervals, setCompletedIntervals] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  // Rest timer
  const [restSeconds, setRestSeconds] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Determine HR zone from BPM
  const getHrZone = (bpm: number) => {
    if (bpm < 120) return { zone: 1, name: "Recovery", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", pct: 15 };
    if (bpm < 140) return { zone: 2, name: "Aerobic Base", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", pct: 40 };
    if (bpm < 160) return { zone: 3, name: "Tempo Pace", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", pct: 70 };
    if (bpm < 175) return { zone: 4, name: "Threshold", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", pct: 85 };
    return { zone: 5, name: "VO2 Max Anaerobic", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", pct: 98 };
  };

  const currentZone = getHrZone(targetBpm);

  const weeklyVolumeData = {
    distance: [
      { day: "Mon", val: 12.4, target: 10 },
      { day: "Tue", val: 8.0, target: 8 },
      { day: "Wed", val: 15.2, target: 14 },
      { day: "Thu", val: 0.0, target: 0 },
      { day: "Fri", val: 10.5, target: 10 },
      { day: "Sat", val: 24.8, target: 22 },
      { day: "Sun", val: 6.2, target: 8 },
    ],
    tonnage: [
      { day: "Mon", val: 8400, target: 8000 },
      { day: "Tue", val: 0, target: 0 },
      { day: "Wed", val: 11200, target: 10000 },
      { day: "Thu", val: 6500, target: 6000 },
      { day: "Fri", val: 9800, target: 9000 },
      { day: "Sat", val: 0, target: 0 },
      { day: "Sun", val: 4200, target: 5000 },
    ],
    duration: [
      { day: "Mon", val: 65, target: 60 },
      { day: "Tue", val: 45, target: 45 },
      { day: "Wed", val: 90, target: 80 },
      { day: "Thu", val: 30, target: 30 },
      { day: "Fri", val: 75, target: 70 },
      { day: "Sat", val: 140, target: 120 },
      { day: "Sun", val: 40, target: 45 },
    ],
  };

  const intervals = [
    { title: "Dynamic Warm-up & Hip Mobility", target: "10 min \u2022 Zone 1", rpe: "RPE 4", tag: "Warmup" },
    { title: "Progressive Aerobic Build", target: "15 min @ 138-145 BPM", rpe: "RPE 6", tag: "Zone 2" },
    { title: "4 x 1,000m Lactate Threshold Repeats", target: "4 reps @ 3:42/km (90s rest)", rpe: "RPE 8.5", tag: "Threshold" },
    { title: "VO2 Max Surge Finishers", target: "3 x 400m all-out", rpe: "RPE 9.5", tag: "Zone 5" },
    { title: "Parasympathetic Recovery Cool-down", target: "10 min walk & deep breathing", rpe: "RPE 2", tag: "Recovery" },
  ];

  const personalRecords = [
    { event: "5,000m Track Split", record: "16:48.2", delta: "-14.6s", date: "Last week", icon: Footprints, badge: "Recent PR" },
    { event: "VO2 Max Score", record: "58.4 ml/kg", delta: "+2.1", date: "Lab tested", icon: Activity, badge: "Elite 2%" },
    { event: "Cycling 20m FTP", record: "318 Watts", delta: "+14W", date: "Sep 2026", icon: Zap, badge: "All-Time" },
    { event: "Squat 1RM Load", record: "185 kg", delta: "+7.5 kg", date: "Aug 2026", icon: Dumbbell, badge: "Gold" },
  ];

  const toggleInterval = (index: number) => {
    setCompletedIntervals((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogModalOpen(false);
    setLogToast("Workout logged! Biometric strain recomputed (+3.2 Strain).");
    setTimeout(() => setLogToast(null), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-tight"
                  
                >
                  {brandName || "AeroPulse Athletics"}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Ready to Train
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">Cardiovascular Telemetry & Overload Suite</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>Resting HR: 48 bpm</span>
              <span className="opacity-30">\u2022</span>
              <span className="text-emerald-500">HRV: 74ms</span>
            </div>

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log Session</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {logToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{logToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b pb-4" >
          <div className="flex items-center gap-1.5 p-1 rounded-xl border text-xs font-medium" >
            <button
              onClick={() => setActiveTab("dashboard")}
              className={\`px-3 py-1.5 rounded-lg transition-colors \${activeTab === "dashboard" ? "bg-white dark:bg-zinc-800 shadow-sm font-semibold" : "opacity-70 hover:opacity-100"}\`}
            >
              Telemetry Dashboard
            </button>
            <button
              onClick={() => setActiveTab("intervals")}
              className={\`px-3 py-1.5 rounded-lg transition-colors \${activeTab === "intervals" ? "bg-white dark:bg-zinc-800 shadow-sm font-semibold" : "opacity-70 hover:opacity-100"}\`}
            >
              Today's Intervals
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={\`px-3 py-1.5 rounded-lg transition-colors \${activeTab === "records" ? "bg-white dark:bg-zinc-800 shadow-sm font-semibold" : "opacity-70 hover:opacity-100"}\`}
            >
              PR Hall of Fame
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs opacity-75">
            <Calendar className="w-3.5 h-3.5" />
            <span>Microcycle 14 \u2022 Day 4</span>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recovery Score */}
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Recovery Readiness</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                88% High
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold tracking-tight">88%</span>
              <span className="text-xs text-emerald-500 font-medium">Primed for strain</span>
            </div>
            <p className="text-[11px] opacity-65">HRV baseline +11% above rolling 30-day average.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[88%]" />
            </div>
          </div>

          {/* Daily Strain */}
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Day Strain Score</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold tracking-tight">14.8</span>
              <span className="text-xs opacity-60">/ 21.0 Max</span>
            </div>
            <p className="text-[11px] opacity-65">Target range 14.0 - 17.5 for optimal adaptation.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full w-[70%]" />
            </div>
          </div>

          {/* Active Calorie Burn */}
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Active Metabolic Burn</span>
              <Activity className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold tracking-tight">1,340</span>
              <span className="text-xs opacity-60">kcal</span>
            </div>
            <p className="text-[11px] opacity-65">89% of daily 1,500 kcal exertion target.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full w-[89%]" />
            </div>
          </div>

          {/* Sleep & Rest */}
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Sleep Architecture</span>
              <Moon className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold tracking-tight">8h 12m</span>
              <span className="text-xs text-indigo-400 font-medium">94% Need met</span>
            </div>
            <p className="text-[11px] opacity-65">1h 48m Deep REM \u2022 2 wake disturbances.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[94%]" />
            </div>
          </div>
        </div>

        {/* Dynamic HR Zone Spectrum Simulator & Weekly Volume */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heart Rate Spectrum Interactive Tool */}
          <div
            className="lg:col-span-1 p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold tracking-tight">Cardio Zone Spectrum</h3>
                  <p className="text-xs opacity-65">Adjust target BPM to test physiological zones</p>
                </div>
                <div className={\`px-2.5 py-1 rounded-xl text-xs font-bold border \${currentZone.bg} \${currentZone.color} \${currentZone.border}\`}>
                  Zone {currentZone.zone}
                </div>
              </div>

              {/* Big BPM Display */}
              <div className="p-4 rounded-xl border text-center mb-6" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-4xl font-extrabold tracking-tight" >
                  {targetBpm} <span className="text-sm font-normal opacity-70">BPM</span>
                </div>
                <div className={\`text-xs font-bold uppercase tracking-wider mt-1 \${currentZone.color}\`}>
                  {currentZone.name}
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-mono opacity-70">
                  <span>100 BPM</span>
                  <span>195 BPM Max</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="195"
                  value={targetBpm}
                  onChange={(e) => setTargetBpm(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Zone distribution meters */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Z1 Recovery (&lt;120)</span>
                  <span className="font-mono font-medium">35 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Z2 Aerobic Base (120-140)</span>
                  <span className="font-mono font-semibold text-emerald-500">54 min (Primary)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Z3 Tempo (140-160)</span>
                  <span className="font-mono font-medium">20 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Z4 Threshold (160-175)</span>
                  <span className="font-mono font-medium">15 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Z5 Anaerobic (175+)</span>
                  <span className="font-mono font-medium">4 min</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t text-[11px] opacity-60 flex items-center justify-between" >
              <span>Lactate Threshold: 168 BPM</span>
              <span>Aerobic Decoupling: 2.1%</span>
            </div>
          </div>

          {/* Weekly Training Volume & Overload Bar Chart */}
          <div
            className="lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-base font-bold tracking-tight">Weekly Progressive Overload</h3>
                  <p className="text-xs opacity-65">Total microcycle accumulation vs scheduled stimulus</p>
                </div>
                {/* Metric toggle */}
                <div className="flex items-center gap-1 p-1 rounded-xl border text-xs font-medium self-start" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                  <button
                    onClick={() => setVolumeMetric("distance")}
                    className={\`px-2.5 py-1 rounded-lg transition-colors \${volumeMetric === "distance" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}\`}
                  >
                    Distance (km)
                  </button>
                  <button
                    onClick={() => setVolumeMetric("tonnage")}
                    className={\`px-2.5 py-1 rounded-lg transition-colors \${volumeMetric === "tonnage" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}\`}
                  >
                    Tonnage (kg)
                  </button>
                  <button
                    onClick={() => setVolumeMetric("duration")}
                    className={\`px-2.5 py-1 rounded-lg transition-colors \${volumeMetric === "duration" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}\`}
                  >
                    Duration (m)
                  </button>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b" >
                {weeklyVolumeData[volumeMetric].map((item, idx) => {
                  const maxVal = Math.max(...weeklyVolumeData[volumeMetric].map((d) => d.val), 1);
                  const heightPct = Math.max((item.val / maxVal) * 100, 6);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.val}
                      </div>
                      <div className="w-full max-w-[40px] bg-zinc-200 dark:bg-zinc-800 rounded-t-lg relative overflow-hidden flex items-end" style={{ height: \`\${heightPct}%\` }}>
                        <div
                          className="w-full rounded-t-lg transition-all"
                          style={{
                            height: "100%",
                            backgroundColor: item.val >= item.target && item.val > 0 ? "#6366f1" : "#a855f7",
                            opacity: item.val === 0 ? 0.2 : 0.9,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold opacity-75">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 opacity-80">
                  <span className="w-2.5 h-2.5 rounded-full"  />
                  Completed Stimulus
                </span>
                <span className="flex items-center gap-1.5 opacity-80">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Target Baseline
                </span>
              </div>
              <div className="font-mono text-emerald-500 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8.4% Volume Progression vs W13</span>
              </div>
            </div>
          </div>
        </div>

        {/* Structured Intervals Checklist & Rest Timer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Workout Intervals Checklist */}
          <div
            className="lg:col-span-2 p-6 rounded-2xl border"
            
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold tracking-tight">Prescribed Interval Session</h3>
                <p className="text-xs opacity-65">Lactate Threshold Overload \u2022 5 Blocks</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg border" >
                {Object.values(completedIntervals).filter(Boolean).length} / {intervals.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {intervals.map((item, idx) => {
                const isCompleted = !!completedIntervals[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleInterval(idx)}
                    className={\`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all \${
                      isCompleted ? "opacity-60 bg-emerald-500/5 border-emerald-500/20" : "hover:border-indigo-500/40"
                    }\`}
                    style={{
                      backgroundColor: !isCompleted ? (isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)") : undefined,
                      borderColor: !isCompleted ? "rgba(255, 255, 255, 0.08)" : undefined,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-indigo-500 shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5 opacity-40 hover:opacity-80" />
                        )}
                      </button>
                      <div>
                        <div className={\`text-xs font-bold \${isCompleted ? "line-through opacity-75" : ""}\`}>
                          {item.title}
                        </div>
                        <div className="text-[11px] opacity-60 font-mono mt-0.5">{item.target}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono border" >
                        {item.rpe}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rest Interval Timer */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold tracking-tight">Active Rest Timer</h3>
                <Timer className="w-4 h-4 text-indigo-400" />
              </div>

              {/* Timer Dial */}
              <div className="py-6 text-center">
                <div className="text-5xl font-mono font-extrabold tracking-tight mb-2">
                  01:{restSeconds < 10 ? \`0\${restSeconds}\` : restSeconds}
                </div>
                <p className="text-xs opacity-65">Recovery interval between Threshold splits</p>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-3 gap-2 mb-6 text-xs font-mono">
                {[60, 90, 120].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setRestSeconds(sec)}
                    className={\`py-1.5 rounded-lg border text-center transition-colors \${
                      restSeconds === sec ? "border-indigo-500 bg-indigo-500/10 font-bold" : "opacity-75 hover:opacity-100"
                    }\`}
                    style={{ borderColor: restSeconds === sec ? undefined : "rgba(255, 255, 255, 0.08)" }}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isTimerRunning ? "Pause Rest" : "Start 90s Rest"}</span>
              </button>
              <button
                onClick={() => setRestSeconds(90)}
                className="p-2.5 rounded-xl border text-xs opacity-75 hover:opacity-100"
                
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PR Milestone Hall of Fame */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold tracking-tight">Hall of Fame & All-Time PRs</h3>
            </div>
            <span className="text-xs opacity-65">Verified Telemetry Benchmarks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {personalRecords.map((pr, idx) => {
              const Icon = pr.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border transition-all hover:scale-[1.01]"
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {pr.badge}
                    </span>
                    <Icon className="w-4 h-4 opacity-50" />
                  </div>
                  <div className="text-xs opacity-70 mb-1">{pr.event}</div>
                  <div className="text-xl font-extrabold tracking-tight mb-1">{pr.record}</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-500 font-semibold">{pr.delta}</span>
                    <span className="opacity-50">{pr.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Log Workout Modal */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "#090a0f",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Log Completed Session</h3>
              </div>

              <form onSubmit={handleLogSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Activity Modality</label>
                  <select
                    value={logWorkoutType}
                    onChange={(e) => setLogWorkoutType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    
                  >
                    <option value="tempo-run">Tempo Threshold Run</option>
                    <option value="cycling-ftp">FTP Cycling Intervals</option>
                    <option value="heavy-squat">Strength & Power Hypertrophy</option>
                    <option value="hiit-row">HIIT Aerobic Capacity</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Duration (Minutes)</label>
                    <input
                      type="number"
                      defaultValue="55"
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Average Heart Rate</label>
                    <input
                      type="number"
                      defaultValue="152"
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 opacity-80">Perceived Exertion (RPE 1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    defaultValue="8"
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between opacity-60 text-[10px] mt-1">
                    <span>1 Easy Active</span>
                    <span>10 Maximum Exhaustion</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm mt-2 transition-transform active:scale-95"
                  
                >
                  Confirm & Sync Biometrics
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-wilderness-travel.ts
var templateWildernessTravel = {
  name: "template-wilderness-travel",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-wilderness-travel.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Mountain,
  MapPin,
  Wind,
  Droplets,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Scale,
  Radio,
  Tent,
  CheckCircle2,
  X,
  Sparkles,
  AlertTriangle,
  Sun,
  CloudSnow,
  CloudRain,
  Navigation,
} from "lucide-react";

export interface WildernessTravelTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function WildernessTravelTemplate({
  brandName = "NomadRoute Expeditions",
  theme = "dark",
}: WildernessTravelTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [selectedWaypoint, setSelectedWaypoint] = useState(1);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [baseWeight, setBaseWeight] = useState(6.2); // kg
  const [foodDays, setFoodDays] = useState(6);
  const [waterLiters, setWaterLiters] = useState(2.0);
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
  const [trekkersCount, setTrekkersCount] = useState(2);
  const [selectedHut, setSelectedHut] = useState("refugio-viedma");
  const [rentCrampons, setRentCrampons] = useState(true);
  const [rentBeacon, setRentBeacon] = useState(false);
  const [permitToast, setPermitToast] = useState<string | null>(null);

  // Compute pack weight
  const consumablesWeight = (foodDays * 0.75 + waterLiters).toFixed(1);
  const totalPackWeight = (baseWeight + parseFloat(consumablesWeight)).toFixed(1);

  const waypoints = [
    {
      id: 0,
      name: "El Chalt\xE9n Trailhead",
      elev: "410m",
      dist: "0.0 km",
      status: "Check-in Station",
      water: "Abundant",
      wind: "15 km/h",
      exposure: "Low",
    },
    {
      id: 1,
      name: "Paso del Viento (Pass of Winds)",
      elev: "1,420m",
      dist: "34.2 km",
      status: "Glacier Crossing",
      water: "Glacial stream (filter req.)",
      wind: "75 km/h Gusts",
      exposure: "Extreme High",
    },
    {
      id: 2,
      name: "Refugio Glaciar Viedma",
      elev: "680m",
      dist: "68.5 km",
      status: "High Mountain Hut",
      water: "Gravity Spring",
      wind: "30 km/h",
      exposure: "Moderate",
    },
    {
      id: 3,
      name: "Paso Huemul Ridge",
      elev: "980m",
      dist: "102.4 km",
      status: "Fixed Cable Traverse",
      water: "Seasonal snowmelt",
      wind: "60 km/h",
      exposure: "High",
    },
    {
      id: 4,
      name: "Bah\xEDa T\xFAnel Lake Terminus",
      elev: "220m",
      dist: "148.0 km",
      status: "Ferry Dock Extraction",
      water: "Lakefront potable",
      wind: "20 km/h",
      exposure: "Low",
    },
  ];

  const itineraryDays = [
    {
      day: 1,
      title: "Valley Incline & Rio Fitz Roy Approach",
      dist: "16.4 km",
      gain: "+620m / -120m",
      time: "5.5 hrs",
      weather: "Partly Cloudy \u2022 14\xB0C",
      camp: "Campamento Poincenot (Forest Shelter)",
      notes: "Cross suspension bridge over glacial torrent. Good tree cover for high wind protection.",
    },
    {
      day: 2,
      title: "Moraine Ascent to Paso del Viento",
      dist: "18.2 km",
      gain: "+940m / -380m",
      time: "7.0 hrs",
      weather: "High Winds \u2022 4\xB0C",
      camp: "Campamento Paso del Viento (Rock Bivvy)",
      notes: "Tyrolean zip traverse across Rio T\xFAnel required. Helmets & harness mandatory.",
    },
    {
      day: 3,
      title: "Patagonian Icecap Rim & Glaciar Viedma",
      dist: "14.5 km",
      gain: "+310m / -850m",
      time: "6.0 hrs",
      weather: "Snow Flurries \u2022 1\xB0C",
      camp: "Refugio Viedma Mountain Base",
      notes: "Spectacular panoramic vista over the Southern Patagonian Icefield. Crampons advised.",
    },
    {
      day: 4,
      title: "Southern Shoreline of Lago Viedma",
      dist: "21.0 km",
      gain: "+480m / -540m",
      time: "6.5 hrs",
      weather: "Sunny Intervals \u2022 12\xB0C",
      camp: "Campamento Bahia de los T\xE9mpanos",
      notes: "Follow natural iceberg washup zone. Ice blocks calving every 30-45 minutes.",
    },
  ];

  const handlePermitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPermitModalOpen(false);
    setPermitToast(\`Wilderness Permit issued for \${trekkersCount} trekkers! Confirmation: #PAT-\${Math.floor(10000 + Math.random() * 90000)}\`);
    setTimeout(() => setPermitToast(null), 4000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-tight"
                  
                >
                  {brandName || "NomadRoute Expeditions"}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Patagonia Crossing
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">Wilderness Backcountry Topography & Permits</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Iridium Satellite: Active</span>
              <span className="opacity-30">\u2022</span>
              <span className="text-emerald-500">SOS Sync OK</span>
            </div>

            <button
              onClick={() => setIsPermitModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <Tent className="h-3.5 w-3.5" />
              <span>Reserve Permits</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {permitToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{permitToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Expedition Hero Ribbon */}
        <div
          className="p-6 rounded-2xl border relative overflow-hidden"
          
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Grade IV Wilderness
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono border" >
                  Los Glaciares National Park
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono border" >
                  Coordinates: 49\xB016'S 73\xB002'W
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-2">
                The Southern Patagonian Icefield Circuit
              </h1>
              <p className="text-xs sm:text-sm opacity-70 max-w-2xl">
                A non-technical alpine high traverse negotiating moraine boulder fields, tyrolean river cables, and high passes above the third-largest ice field on Earth.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-xs opacity-60">Total Trek</div>
                <div className="text-lg font-extrabold font-mono">148 km</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-xs opacity-60">Total Gain</div>
                <div className="text-lg font-extrabold font-mono text-emerald-500">+6,850m</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-xs opacity-60">Duration</div>
                <div className="text-lg font-extrabold font-mono">8 Days</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-xs opacity-60">Max Elevation</div>
                <div className="text-lg font-extrabold font-mono text-amber-500">1,420m</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive Elevation & Waypoint Topography Profile */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold tracking-tight">Interactive Elevation Topography & Waypoints</h2>
              <p className="text-xs opacity-65">Click waypoint markers along the ridge profile to view live checkpoint telemetry</p>
            </div>
            <span className="text-xs font-mono opacity-70">Datum: WGS84 Elevation Profile</span>
          </div>

          {/* Graphical Elevation Chart Simulation */}
          <div className="relative pt-6 pb-2 px-2 border rounded-xl mb-6 overflow-x-auto" style={{ borderColor: "rgba(255, 255, 255, 0.08)", backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.6)" }}>
            <div className="min-w-[600px] h-40 flex items-end justify-between relative px-6">
              {/* SVG Mountain contour line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 600 160">
                <defs>
                  <linearGradient id="topoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 130 Q 80 120, 150 25 T 300 85 T 440 50 T 580 140 L 580 160 L 20 160 Z"
                  fill="url(#topoGradient)"
                />
                <path
                  d="M 20 130 Q 80 120, 150 25 T 300 85 T 440 50 T 580 140"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                />
              </svg>

              {/* Waypoint interactive markers */}
              {waypoints.map((wp) => {
                const isSelected = selectedWaypoint === wp.id;
                return (
                  <button
                    key={wp.id}
                    onClick={() => setSelectedWaypoint(wp.id)}
                    className="relative z-10 flex flex-col items-center group focus:outline-none transition-transform active:scale-95"
                  >
                    <div
                      className={\`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-md transition-all \${
                        isSelected ? "scale-125 ring-4 ring-indigo-500/20 text-white" : "opacity-80 hover:opacity-100"
                      }\`}
                      style={{
                        backgroundColor: isSelected ? "#6366f1" : "#12141c",
                        borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      {wp.id + 1}
                    </div>
                    <span className="text-[11px] font-semibold mt-1 max-w-[90px] text-center truncate">
                      {wp.name}
                    </span>
                    <span className="text-[10px] font-mono opacity-65">{wp.elev}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Waypoint Detail Card */}
          {waypoints[selectedWaypoint] && (
            <div
              className="p-4 rounded-xl border grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs"
              style={{
                backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.8)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
            >
              <div>
                <span className="opacity-60 block text-[10px]">Checkpoint</span>
                <span className="font-bold">{waypoints[selectedWaypoint].name}</span>
              </div>
              <div>
                <span className="opacity-60 block text-[10px]">Elevation</span>
                <span className="font-mono font-bold text-amber-500">{waypoints[selectedWaypoint].elev}</span>
              </div>
              <div>
                <span className="opacity-60 block text-[10px]">Route Distance</span>
                <span className="font-mono">{waypoints[selectedWaypoint].dist}</span>
              </div>
              <div>
                <span className="opacity-60 block text-[10px]">Terrain Class</span>
                <span className="font-semibold text-emerald-500">{waypoints[selectedWaypoint].status}</span>
              </div>
              <div>
                <span className="opacity-60 block text-[10px]">Water Refill</span>
                <span>{waypoints[selectedWaypoint].water}</span>
              </div>
              <div>
                <span className="opacity-60 block text-[10px]">Exposure / Wind</span>
                <span className="text-rose-500 font-semibold">{waypoints[selectedWaypoint].wind}</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2 & 3: Pack Weight Calculator & Day-by-Day Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pack Weight Calculator */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Pack Weight Distribution</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {parseFloat(totalPackWeight) < 12 ? "Ultralight" : "Expedition Load"}
                </span>
              </div>

              {/* Total Display */}
              <div className="p-4 rounded-xl border text-center mb-6" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-4xl font-extrabold font-mono tracking-tight" >
                  {totalPackWeight} <span className="text-sm font-normal opacity-70">KG</span>
                </div>
                <div className="text-xs opacity-60 mt-1">
                  Base Weight: {baseWeight}kg \u2022 Consumables: {consumablesWeight}kg
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="opacity-80">Base Gear (Shelter, Sleep, Cook)</span>
                    <span className="font-mono font-bold">{baseWeight.toFixed(1)} kg</span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="10.0"
                    step="0.2"
                    value={baseWeight}
                    onChange={(e) => setBaseWeight(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="opacity-80">Ration Days (0.75 kg/day)</span>
                    <span className="font-mono font-bold">{foodDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="1"
                    value={foodDays}
                    onChange={(e) => setFoodDays(parseInt(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="opacity-80">Hydration Volume</span>
                    <span className="font-mono font-bold">{waterLiters.toFixed(1)} Liters</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="4.0"
                    step="0.5"
                    value={waterLiters}
                    onChange={(e) => setWaterLiters(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t text-[11px] opacity-70 flex items-center gap-2" >
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Recommended skin-out pack weight &lt; 20% of trekker body mass.</span>
            </div>
          </div>

          {/* Day-by-Day Stages */}
          <div
            className="lg:col-span-2 p-6 rounded-2xl border"
            
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold tracking-tight">Expedition Stages Itinerary</h3>
                <p className="text-xs opacity-65">Tap any day stage to review terrain hazards & camp coordinates</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg border" >
                4 of 8 Days Detailed
              </span>
            </div>

            <div className="space-y-3">
              {itineraryDays.map((stage) => {
                const isExpanded = expandedDay === stage.day;
                return (
                  <div
                    key={stage.day}
                    className="rounded-xl border transition-all overflow-hidden"
                    style={{
                      backgroundColor: isExpanded ? (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)") : "transparent",
                      borderColor: isExpanded ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <button
                      onClick={() => setExpandedDay(isExpanded ? null : stage.day)}
                      className="w-full p-3.5 flex items-center justify-between text-left gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                          style={{
                            backgroundColor: isExpanded ? "#6366f1" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"),
                            color: isExpanded ? "#ffffff" : "inherit",
                          }}
                        >
                          D{stage.day}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold">{stage.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] opacity-65 mt-0.5">
                            <span>{stage.dist}</span>
                            <span>\u2022</span>
                            <span>{stage.gain}</span>
                            <span>\u2022</span>
                            <span className="font-mono">{stage.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                          {stage.weather}
                        </span>
                        <ChevronDown className={\`w-4 h-4 opacity-50 transition-transform \${isExpanded ? "rotate-180" : ""}\`} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 pt-1 border-t text-xs space-y-2"
                          
                        >
                          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                            <Tent className="w-3.5 h-3.5" />
                            <span>Designated Bivvy: {stage.camp}</span>
                          </div>
                          <p className="opacity-75 leading-relaxed">{stage.notes}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 4: Satellite Telemetry & Emergency SOS Card */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold">Garmin InReach Satellite Telemetry Active</h3>
                <p className="text-xs opacity-65">Automated 10-minute location beacon pings transmitted to Park Rangers</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="opacity-50 block text-[10px]">Battery Level</span>
                <span className="font-bold text-emerald-500">94% (6 Days left)</span>
              </div>
              <div>
                <span className="opacity-50 block text-[10px]">Emergency VHF</span>
                <span className="font-bold">147.525 MHz</span>
              </div>
              <div>
                <span className="opacity-50 block text-[10px]">Active Trackers</span>
                <span className="font-bold">4 Rangers online</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reservation & Permit Modal */}
      <AnimatePresence>
        {isPermitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "#090a0f",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <button
                onClick={() => setIsPermitModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Tent className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Reserve Wilderness Permits</h3>
              </div>

              <form onSubmit={handlePermitSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Designated Mountain Hut / Sector</label>
                  <select
                    value={selectedHut}
                    onChange={(e) => setSelectedHut(e.target.value)}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    
                  >
                    <option value="refugio-viedma">Refugio Glaciar Viedma (Sector B)</option>
                    <option value="camp-poincenot">Campamento Poincenot (Forest Pods)</option>
                    <option value="paso-huemul">Paso Huemul High Bivvy</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Party Size (Trekkers)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={trekkersCount}
                      onChange={(e) => setTrekkersCount(parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Start Date</label>
                    <input
                      type="date"
                      defaultValue="2026-11-15"
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t" >
                  <label className="block font-semibold opacity-80">Essential Technical Rentals</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rentCrampons}
                      onChange={(e) => setRentCrampons(e.target.checked)}
                      className="accent-indigo-500"
                    />
                    <span>Petzl Steel Crampons & Ice Axe Bundle ($18/day)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rentBeacon}
                      onChange={(e) => setRentBeacon(e.target.checked)}
                      className="accent-indigo-500"
                    />
                    <span>Garmin InReach Satellite SOS Transceiver ($24/day)</span>
                  </label>
                </div>

                <div className="p-3 rounded-xl border flex items-center justify-between font-mono" >
                  <span className="opacity-70">Permit & Park Fee:</span>
                  <span className="font-bold text-sm text-emerald-500">\${trekkersCount * 45 + (rentCrampons ? 36 : 0)} USD</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                  
                >
                  Issue National Park Permit
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-devops-kubernetes.ts
var templateDevopsKubernetes = {
  name: "template-devops-kubernetes",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-devops-kubernetes.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Cpu,
  Database,
  Activity,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Search,
  Filter,
  Play,
  Pause,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  HardDrive,
  X,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Radio,
} from "lucide-react";

export interface DevopsKubernetesTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function DevopsKubernetesTemplate({
  brandName = "KubeOrbit Cloud",
  theme = "dark",
}: DevopsKubernetesTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [selectedCluster, setSelectedCluster] = useState("prod-eu-central-1");
  const [podFilter, setPodFilter] = useState<"all" | "running" | "crashloop" | "pending">("all");
  const [searchPod, setSearchPod] = useState("");
  const [canaryWeight, setCanaryWeight] = useState(15); // 15% canary, 85% stable
  const [selectedNode, setSelectedNode] = useState<number | null>(0);
  const [isLogsPaused, setIsLogsPaused] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deployToast, setDeployToast] = useState<string | null>(null);

  const nodes = [
    { id: 0, name: "node-c5.4xlarge-01", region: "eu-central-1a", cpu: "68%", ram: "74%", pods: 42, status: "Ready", role: "Worker" },
    { id: 1, name: "node-c5.4xlarge-02", region: "eu-central-1b", cpu: "82%", ram: "88%", pods: 46, status: "Ready", role: "Worker" },
    { id: 2, name: "node-g4dn.2xlarge-03", region: "eu-central-1a", cpu: "45%", ram: "52%", pods: 18, status: "Ready", role: "GPU Tensor" },
    { id: 3, name: "node-m5.2xlarge-04", region: "eu-central-1c", cpu: "91%", ram: "94%", pods: 38, status: "Pressure", role: "Memory High" },
  ];

  const pods = [
    { name: "auth-gateway-7b89f6-2dla", namespace: "ingress", status: "Running", restarts: 0, age: "14d", cpu: "140m", mem: "312Mi" },
    { name: "payment-worker-64cb89-x99k", namespace: "finance", status: "Running", restarts: 0, age: "4d", cpu: "420m", mem: "840Mi" },
    { name: "vector-indexer-59fa12-z7lp", namespace: "ai-mesh", status: "CrashLoopBackOff", restarts: 14, age: "12m", cpu: "880m", mem: "1.8Gi" },
    { name: "telemetry-collector-41da-k2pp", namespace: "monitoring", status: "Running", restarts: 1, age: "28d", cpu: "95m", mem: "180Mi" },
    { name: "redis-cache-shard-02", namespace: "cache", status: "Pending", restarts: 0, age: "2m", cpu: "0m", mem: "0Mi" },
    { name: "billing-cron-job-28491-pl9s", namespace: "finance", status: "Running", restarts: 0, age: "1h", cpu: "210m", mem: "410Mi" },
  ];

  const logLines = [
    { time: "14:28:40.102", level: "INFO", src: "auth-gateway", msg: "TLS 1.3 handshake negotiated with 194.26.29.11" },
    { time: "14:28:41.220", level: "INFO", src: "payment-worker", msg: "Batch settled: 420 ledger entries dispatched in 18ms" },
    { time: "14:28:42.508", level: "WARN", src: "node-m5-04", msg: "Kubelet memory eviction threshold warning (free < 6%)" },
    { time: "14:28:43.910", level: "ERROR", src: "vector-indexer", msg: "OOMKilled: container exceeded memory limit 2048MiB" },
    { time: "14:28:44.305", level: "INFO", src: "kube-scheduler", msg: "Pod redis-cache-shard-02 placed on node-c5.4xlarge-01" },
  ];

  const filteredPods = pods.filter((p) => {
    const matchFilter =
      podFilter === "all" ||
      (podFilter === "running" && p.status === "Running") ||
      (podFilter === "crashloop" && p.status === "CrashLoopBackOff") ||
      (podFilter === "pending" && p.status === "Pending");
    const matchSearch = p.name.toLowerCase().includes(searchPod.toLowerCase()) || p.namespace.toLowerCase().includes(searchPod.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleDeploySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeployModalOpen(false);
    setDeployToast("Manifest deployed! Rolling update initiated across 3 replicas.");
    setTimeout(() => setDeployToast(null), 4000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-tight"
                  
                >
                  {brandName || "KubeOrbit Cloud"}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  k8s v1.31.1
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">Kubernetes Multi-Cluster Orchestration & SRE Fleet</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="hidden sm:block px-3 py-1.5 rounded-xl border text-xs font-mono outline-none font-medium"
              
            >
              <option value="prod-eu-central-1">prod-eu-central-1 (Frankfurt)</option>
              <option value="prod-us-east-1">prod-us-east-1 (N. Virginia)</option>
              <option value="staging-ap-east-1">staging-ap-east-1 (Tokyo)</option>
            </select>

            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Deploy Workload</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {deployToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{deployToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Top 4 Cluster Health KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">CPU Capacity Saturation</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">68.4%</span>
              <span className="text-xs opacity-60">128 / 192 Cores</span>
            </div>
            <p className="text-[11px] opacity-65">Healthy headroom across 32 active worker nodes.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[68%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Cluster RAM Allocation</span>
              <Database className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">82.1%</span>
              <span className="text-xs text-amber-500 font-medium">Warning &gt; 80%</span>
            </div>
            <p className="text-[11px] opacity-65">394 GiB of 480 GiB committed by pod requests.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[82%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Pod Lifecycle Status</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-emerald-500">242</span>
              <span className="text-xs opacity-60">/ 248 Healthy</span>
            </div>
            <p className="text-[11px] opacity-65">1 CrashLoopBackOff \u2022 5 Pending scheduling.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[97%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Ingress Mesh Bandwidth</span>
              <Server className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">4.82</span>
              <span className="text-xs opacity-60">Gbps</span>
            </div>
            <p className="text-[11px] opacity-65">Zero packet drop \u2022 Envoy P99 latency 1.4ms.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full w-[54%]" />
            </div>
          </div>
        </div>

        {/* Section 1: Multi-Region Kubernetes Node Cluster Grid */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold tracking-tight">Active Node Fleet & Pressure Telemetry</h2>
              <p className="text-xs opacity-65">Click a node to inspect system metrics and simulate cordon/drain actions</p>
            </div>
            <span className="text-xs font-mono opacity-70">Region: Frankfurt AZ-1a/b/c</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nodes.map((n) => {
              const isSelected = selectedNode === n.id;
              const hasPressure = n.status === "Pressure";
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n.id)}
                  className={\`p-4 rounded-xl border cursor-pointer transition-all \${
                    isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:border-indigo-500/40"
                  }\`}
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono truncate max-w-[150px]">{n.name}</span>
                    <span
                      className={\`px-2 py-0.5 rounded text-[10px] font-bold \${
                        hasPressure
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      }\`}
                    >
                      {n.status}
                    </span>
                  </div>

                  <div className="text-[11px] opacity-60 mb-3">{n.role} \u2022 {n.region}</div>

                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="opacity-70">CPU: {n.cpu}</span>
                        <span className="opacity-70">RAM: {n.ram}</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-indigo-500" style={{ width: n.cpu }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="opacity-60">{n.pods} Running Pods</span>
                      <span className="text-indigo-400 font-semibold text-[10px]">Inspect &rarr;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2 & 3: Pod Health Matrix & Canary Deployment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pod Health Matrix Table */}
          <div
            className="lg:col-span-2 p-6 rounded-2xl border"
            
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold tracking-tight">Pod Workload Inventory</h3>
                <p className="text-xs opacity-65">Real-time status across all namespaces</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border text-xs" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <button
                  onClick={() => setPodFilter("all")}
                  className={\`px-2.5 py-1 rounded-lg \${podFilter === "all" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}\`}
                >
                  All (6)
                </button>
                <button
                  onClick={() => setPodFilter("running")}
                  className={\`px-2.5 py-1 rounded-lg \${podFilter === "running" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}\`}
                >
                  Running
                </button>
                <button
                  onClick={() => setPodFilter("crashloop")}
                  className={\`px-2.5 py-1 rounded-lg \${podFilter === "crashloop" ? "bg-indigo-600 text-white font-semibold" : "opacity-70 hover:opacity-100"}\`}
                >
                  OOM/Crash
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 opacity-50" />
              <input
                type="text"
                placeholder="Search pod name or namespace..."
                value={searchPod}
                onChange={(e) => setSearchPod(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none font-mono"
                style={{ backgroundColor: "#090a0f", borderColor: "rgba(255, 255, 255, 0.08)" }}
              />
            </div>

            {/* Pod Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b opacity-60 text-[11px]" >
                    <th className="pb-2">Pod Identifier</th>
                    <th className="pb-2">Namespace</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">CPU</th>
                    <th className="pb-2">Memory</th>
                    <th className="pb-2">Restarts</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono" >
                  {filteredPods.map((p, idx) => (
                    <tr key={idx} className="hover:bg-zinc-500/5 transition-colors">
                      <td className="py-2.5 font-bold truncate max-w-[180px]">{p.name}</td>
                      <td className="py-2.5 opacity-70">{p.namespace}</td>
                      <td className="py-2.5">
                        <span
                          className={\`px-2 py-0.5 rounded text-[10px] font-bold \${
                            p.status === "Running"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : p.status === "CrashLoopBackOff"
                              ? "bg-rose-500/10 text-rose-500"
                              : "bg-amber-500/10 text-amber-500"
                          }\`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 opacity-70">{p.cpu}</td>
                      <td className="py-2.5 opacity-70">{p.mem}</td>
                      <td className="py-2.5 opacity-70">{p.restarts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Canary Deployment & Ingress Splitter */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Canary Ingress Split</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Istio Route
                </span>
              </div>

              <div className="p-4 rounded-xl border text-center mb-6" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-3xl font-extrabold font-mono tracking-tight text-indigo-500">
                  {canaryWeight}% <span className="text-sm font-normal opacity-70">Canary v2.5.0</span>
                </div>
                <div className="text-xs opacity-60 mt-1">
                  Stable v2.4.0 receiving {100 - canaryWeight}% of live ingress traffic
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-mono opacity-70">
                  <span>0% (Drain Canary)</span>
                  <span>100% (Promote)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={canaryWeight}
                  onChange={(e) => setCanaryWeight(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg border" >
                  <span className="opacity-70">Stable Error Rate</span>
                  <span className="font-mono text-emerald-500 font-bold">0.012% P99</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg border" >
                  <span className="opacity-70">Canary Error Rate</span>
                  <span className="font-mono text-emerald-500 font-bold">0.018% P99</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCanaryWeight(100);
                setDeployToast("Canary promoted to 100% stable production traffic!");
                setTimeout(() => setDeployToast(null), 3500);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white mt-4 shadow-sm transition-transform active:scale-95"
              
            >
              Promote Canary to 100%
            </button>
          </div>
        </div>

        {/* Section 4: Live Streaming Pod Logs Viewer */}
        <div
          className="p-6 rounded-2xl border font-mono"
          
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold font-sans">Live Pod Stream: all-namespaces stdout</h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setIsLogsPaused(!isLogsPaused)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border hover:opacity-100 opacity-75 transition-opacity"
                
              >
                {isLogsPaused ? <Play className="w-3 h-3 text-emerald-500" /> : <Pause className="w-3 h-3 text-amber-500" />}
                <span>{isLogsPaused ? "Resume" : "Pause Stream"}</span>
              </button>
            </div>
          </div>

          <div
            className="p-4 rounded-xl border text-xs space-y-1.5 overflow-x-auto max-h-52 overflow-y-auto"
            style={{
              backgroundColor: isDark ? "#090a0f" : "#f8fafc",
              borderColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            {logLines.map((l, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="opacity-40 shrink-0 text-[10px]">{l.time}</span>
                <span
                  className={\`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 \${
                    l.level === "INFO"
                      ? "text-cyan-400 bg-cyan-400/10"
                      : l.level === "WARN"
                      ? "text-amber-400 bg-amber-400/10"
                      : "text-rose-400 bg-rose-400/10"
                  }\`}
                >
                  {l.level}
                </span>
                <span className="opacity-60 text-indigo-400 shrink-0">[{l.src}]</span>
                <span className="opacity-85">{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Deploy Workload Modal */}
      <AnimatePresence>
        {isDeployModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "#090a0f",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Deploy Container Workload</h3>
              </div>

              <form onSubmit={handleDeploySubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block font-semibold mb-1 opacity-80 font-sans">OCI Image URI</label>
                  <input
                    type="text"
                    defaultValue="ghcr.io/nexore/vector-mesh:v2.5.1"
                    className="w-full p-2.5 rounded-xl border outline-none font-mono"
                    
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 font-sans">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Target Namespace</label>
                    <select
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      
                    >
                      <option value="ingress">ingress</option>
                      <option value="ai-mesh">ai-mesh</option>
                      <option value="finance">finance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Replicas</label>
                    <input
                      type="number"
                      defaultValue="3"
                      min="1"
                      max="16"
                      className="w-full p-2.5 rounded-xl border outline-none font-mono"
                      
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 opacity-80 font-sans">CPU Limit</label>
                    <input
                      type="text"
                      defaultValue="1000m"
                      className="w-full p-2.5 rounded-xl border outline-none"
                      
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 opacity-80 font-sans">Memory Limit</label>
                    <input
                      type="text"
                      defaultValue="2048Mi"
                      className="w-full p-2.5 rounded-xl border outline-none"
                      
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 font-sans"
                  
                >
                  Apply Manifest to Cluster
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-audio-daw.ts
var templateAudioDaw = {
  name: "template-audio-daw",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-audio-daw.tsx",
  content: `"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Radio,
  Disc,
  Headphones,
  Music,
  CheckCircle2,
  X,
  Download,
  Share2,
  Layers,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export interface AudioDawTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function AudioDawTemplate({
  brandName = "SoundForge Studio",
  theme = "dark",
}: AudioDawTemplateProps) {
  
    const isDark = theme === "dark";

  // Sequencer playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(140);
  const [selectedLicense, setSelectedLicense] = useState("wav");
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutToast, setCheckoutToast] = useState<string | null>(null);

  // FX states
  const [reverbWet, setReverbWet] = useState(32);
  const [delayTime, setDelayTime] = useState(250);
  const [filterCutoff, setFilterCutoff] = useState(12500);

  // Sequencer 16-step matrix (4 instruments x 16 steps)
  const [pattern, setPattern] = useState<Record<string, boolean[]>>({
    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    perc: [false, false, true, false, false, false, true, false, false, true, false, false, false, false, true, false],
  });

  // Mixer channels
  const [channels, setChannels] = useState([
    { id: "drums", name: "Drums Bus", volume: 82, pan: 0, mute: false, solo: false, peak: "-2.1 dB" },
    { id: "bass", name: "808 Sub-Bass", volume: 90, pan: 0, mute: false, solo: false, peak: "-0.8 dB" },
    { id: "synth", name: "Neon Synth Lead", volume: 74, pan: -15, mute: false, solo: false, peak: "-4.2 dB" },
    { id: "vocals", name: "Glitch Vox Chops", volume: 68, pan: 20, mute: false, solo: false, peak: "-5.6 dB" },
  ]);

  // Step sequencer animation ticker
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      const stepDuration = (60 / bpm / 4) * 1000;
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % 16);
      }, stepDuration);
    }
    return () => clearInterval(interval);
  }, [isPlaying, bpm]);

  const toggleStep = (instrument: string, stepIdx: number) => {
    setPattern((prev) => ({
      ...prev,
      [instrument]: prev[instrument].map((active, idx) => (idx === stepIdx ? !active : active)),
    }));
  };

  const toggleMute = (channelId: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, mute: !ch.mute } : ch))
    );
  };

  const toggleSolo = (channelId: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, solo: !ch.solo } : ch))
    );
  };

  const updateVolume = (channelId: string, val: number) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, volume: val } : ch))
    );
  };

  const licenses = [
    { id: "mp3", title: "Standard MP3", price: "$29", format: "320kbps MP3", streams: "100,000 Streams", tag: "Starter" },
    { id: "wav", title: "Premium WAV", price: "$69", format: "24-bit 48kHz WAV", streams: "500,000 Streams", tag: "Most Popular" },
    { id: "stems", title: "Trackout Stems", price: "$149", format: "Separated Audio Stems", streams: "Unlimited Distribution", tag: "Pro Mix" },
    { id: "exclusive", title: "Full Exclusive", price: "$399", format: "Full Master Ownership", streams: "Complete Copyright Transfer", tag: "Sole Owner" },
  ];

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutModalOpen(false);
    setCheckoutToast("License agreement issued! High-res stems download link ready.");
    setTimeout(() => setCheckoutToast(null), 4000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-tight"
                  
                >
                  {brandName || "SoundForge Studio"}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  DAW Engine v4.2
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">Virtual Sequencer & Audio Stem Marketplace</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Session: Midnight Cyberpunk</span>
              <span className="opacity-30">\u2022</span>
              <span className="text-amber-500">Key: D Minor</span>
            </div>

            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>License Beat</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {checkoutToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{checkoutToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Top Transport & Master Visualizer Bar */}
        <div
          className="p-5 rounded-2xl border"
          
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Playback controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
                
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono opacity-60">MASTER TEMPO</span>
                  <span className="text-sm font-bold font-mono text-indigo-400">{bpm} BPM</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="90"
                    max="180"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-32 accent-indigo-500 cursor-pointer"
                  />
                  <button
                    onClick={() => setBpm(140)}
                    className="px-2 py-0.5 rounded border text-[10px] font-mono opacity-70 hover:opacity-100"
                    
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Spectrum Visualizer simulation */}
            <div className="flex items-end gap-1 h-12 px-4 py-1 rounded-xl border flex-1 max-w-md justify-between overflow-hidden" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
              {[45, 68, 85, 92, 60, 78, 95, 82, 70, 88, 55, 40, 65, 80, 50, 30].map((barHeight, idx) => (
                <div
                  key={idx}
                  className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t transition-all duration-75"
                  style={{
                    height: isPlaying ? \`\${Math.max(barHeight * (Math.sin(currentStep + idx) * 0.4 + 0.6), 15)}%\` : "15%",
                    backgroundColor: isPlaying ? "#6366f1" : "currentColor",
                    opacity: isPlaying ? 0.9 : 0.2,
                  }}
                />
              ))}
            </div>

            {/* Master Volume Output */}
            <div className="flex items-center gap-3 text-xs font-mono shrink-0">
              <div className="text-right">
                <span className="opacity-50 block text-[10px]">MASTER OUTPUT</span>
                <span className="font-bold text-emerald-500">-0.4 dB LUFS</span>
              </div>
              <div className="w-16 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[92%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive 16-Step Drum Sequencer Grid */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold tracking-tight">Interactive 16-Step Rhythm Sequencer</h2>
              <p className="text-xs opacity-65">Click trigger pads to craft rhythm loops. Current playhead moves in real time.</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() =>
                  setPattern({
                    kick: Array(16).fill(false),
                    snare: Array(16).fill(false),
                    hihat: Array(16).fill(false),
                    perc: Array(16).fill(false),
                  })
                }
                className="px-2.5 py-1 rounded-lg border opacity-70 hover:opacity-100"
                
              >
                Clear
              </button>
              <button
                onClick={() =>
                  setPattern({
                    kick: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
                    snare: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
                    hihat: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
                    perc: [false, false, true, false, false, false, true, false, false, true, false, false, false, false, true, false],
                  })
                }
                className="px-2.5 py-1 rounded-lg border text-indigo-400 font-semibold"
                
              >
                Load Default Groove
              </button>
            </div>
          </div>

          <div className="space-y-3 overflow-x-auto pb-2">
            {Object.keys(pattern).map((instrument) => (
              <div key={instrument} className="flex items-center gap-3 min-w-[620px]">
                <div className="w-24 shrink-0 text-xs font-bold uppercase tracking-wider opacity-80">
                  {instrument === "kick"
                    ? "Kick 808"
                    : instrument === "snare"
                    ? "Snare Clap"
                    : instrument === "hihat"
                    ? "Hi-Hat Clsd"
                    : "Perc / Rim"}
                </div>

                <div className="flex-1 grid grid-cols-16 gap-1.5">
                  {pattern[instrument].map((active, stepIdx) => {
                    const isPlayhead = isPlaying && currentStep === stepIdx;
                    const isQuarter = stepIdx % 4 === 0;

                    return (
                      <button
                        key={stepIdx}
                        onClick={() => toggleStep(instrument, stepIdx)}
                        className={\`h-11 rounded-lg border transition-all flex items-center justify-center relative \${
                          active
                            ? "shadow-sm"
                            : isDark
                            ? "bg-zinc-900/60"
                            : "bg-zinc-100"
                        } \${isPlayhead ? "ring-2 ring-amber-400" : ""}\`}
                        style={{
                          backgroundColor: active ? "#6366f1" : undefined,
                          borderColor: isQuarter ? (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)") : "rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        {active && <span className="w-2 h-2 rounded-full bg-white shadow" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 & 3: 4-Track DAW Mixer & Master FX Rack */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 4-Track DAW Console Mixer */}
          <div
            className="lg:col-span-2 p-6 rounded-2xl border"
            
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold tracking-tight">Multi-Track Stem Mixer</h3>
                <p className="text-xs opacity-65">Faders, Mute/Solo logic & Stereo Panning</p>
              </div>
              <span className="text-xs font-mono opacity-70">4 Stems Routed</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  className="p-4 rounded-xl border flex flex-col items-center text-center gap-3"
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <span className="text-xs font-bold truncate max-w-full">{ch.name}</span>

                  {/* Fader & dB Meter */}
                  <div className="flex items-center gap-3 h-36">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={ch.mute ? 0 : ch.volume}
                      disabled={ch.mute}
                      onChange={(e) => updateVolume(ch.id, Number(e.target.value))}
                      className="h-32 accent-indigo-500 cursor-pointer -rotate-90 w-32"
                    />

                    <div className="h-32 w-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex flex-col justify-end">
                      <div
                        className="w-full rounded-full transition-all"
                        style={{
                          height: ch.mute ? "0%" : \`\${ch.volume}%\`,
                          backgroundColor: ch.volume > 85 ? "#f43f5e" : "#10b981",
                        }}
                      />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono opacity-70">{ch.mute ? "MUTED" : ch.peak}</span>

                  {/* Mute and Solo buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleMute(ch.id)}
                      className={\`w-7 h-7 rounded text-[11px] font-bold border transition-colors \${
                        ch.mute ? "bg-rose-500 text-white border-rose-500" : "opacity-70 hover:opacity-100"
                      }\`}
                      style={{ borderColor: ch.mute ? undefined : "rgba(255, 255, 255, 0.08)" }}
                    >
                      M
                    </button>
                    <button
                      onClick={() => toggleSolo(ch.id)}
                      className={\`w-7 h-7 rounded text-[11px] font-bold border transition-colors \${
                        ch.solo ? "bg-amber-500 text-white border-amber-500" : "opacity-70 hover:opacity-100"
                      }\`}
                      style={{ borderColor: ch.solo ? undefined : "rgba(255, 255, 255, 0.08)" }}
                    >
                      S
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Master FX Controls */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Analog FX Rack</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  DSP Active
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="opacity-80">Studio Plate Reverb Wet</span>
                    <span className="font-bold">{reverbWet}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reverbWet}
                    onChange={(e) => setReverbWet(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="opacity-80">Analog Tape Delay Feedback</span>
                    <span className="font-bold">{delayTime} ms</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="800"
                    value={delayTime}
                    onChange={(e) => setDelayTime(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="opacity-80">Moog Low-Pass Filter Cutoff</span>
                    <span className="font-bold">{filterCutoff} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="20000"
                    value={filterCutoff}
                    onChange={(e) => setFilterCutoff(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t text-[11px] opacity-70 flex items-center justify-between" >
              <span>Oversampling: 4x Linear Phase</span>
              <span>Bit Depth: 32-bit Float</span>
            </div>
          </div>
        </div>

        {/* Section 4: Beat Licensing Marketplace Tiers */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold tracking-tight">Royalty-Free Audio Licensing Tiers</h3>
              <p className="text-xs opacity-65">Instantly clear production rights for Spotify, YouTube, Apple Music, and Film Sync</p>
            </div>
            <span className="text-xs font-mono opacity-70">Instant Automated PDF Agreement</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {licenses.map((lic) => {
              const isSelected = selectedLicense === lic.id;
              return (
                <div
                  key={lic.id}
                  onClick={() => setSelectedLicense(lic.id)}
                  className={\`p-4 rounded-xl border cursor-pointer transition-all \${
                    isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:border-indigo-500/40"
                  }\`}
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400">
                      {lic.tag}
                    </span>
                    <span className="text-lg font-extrabold font-mono">{lic.price}</span>
                  </div>
                  <h4 className="text-xs font-bold mb-1">{lic.title}</h4>
                  <p className="text-[11px] opacity-60 mb-2">{lic.format}</p>
                  <p className="text-[10px] text-emerald-500 font-semibold">{lic.streams}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "#090a0f",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Acquire Audio License</h3>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Selected Production Tier</label>
                  <select
                    value={selectedLicense}
                    onChange={(e) => setSelectedLicense(e.target.value)}
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    
                  >
                    <option value="mp3">Standard MP3 Lease ($29)</option>
                    <option value="wav">Premium Lossless WAV ($69)</option>
                    <option value="stems">Trackout Stems Bundle ($149)</option>
                    <option value="exclusive">Full Exclusive Master Rights ($399)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 opacity-80">Licensee Artist / Label Legal Name</label>
                  <input
                    type="text"
                    defaultValue="Echo Soundworks Ltd."
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    
                  />
                </div>

                <div className="p-3 rounded-xl border flex items-center justify-between font-mono" >
                  <span className="opacity-70">Payable Total:</span>
                  <span className="font-bold text-sm text-emerald-500">
                    {selectedLicense === "mp3" ? "$29" : selectedLicense === "wav" ? "$69" : selectedLicense === "stems" ? "$149" : "$399"} USD
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                  
                >
                  Authorize Payment & Download Stems
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-gamified-habits.ts
var templateGamifiedHabits = {
  name: "template-gamified-habits",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-gamified-habits.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, 
  Shield,
  Sword,
  Sparkles,
  Flame,
  Coins,
  Heart,
  Zap,
  BookOpen,
  Dumbbell,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Pause,
  Award,
  ChevronRight,
  Package,
  X,
  Target,
  Crown,
 } from "lucide-react";

export interface GamifiedHabitsTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function GamifiedHabitsTemplate({
  brandName = "QuestCraft RPG",
  theme = "dark",
}: GamifiedHabitsTemplateProps) {
  
    const isDark = theme === "dark";

  // RPG states
  const [xp, setXp] = useState(2450);
  const [level, setLevel] = useState(14);
  const [gold, setGold] = useState(1420);
  const [bossHp, setBossHp] = useState(2450);
  const [isFocusTimerRunning, setIsFocusTimerRunning] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(1500); // 25 min
  const [rpgToast, setRpgToast] = useState<string | null>(null);

  // Quests
  const [quests, setQuests] = useState([
    { id: 1, title: "Slay 90m Deep Focus Work Block", rewardXp: 180, rewardGold: 45, type: "Legendary", stat: "+2 Focus", completed: false },
    { id: 2, title: "Quench Thirst: 2.5L Pure Water Elixir", rewardXp: 60, rewardGold: 15, type: "Daily", stat: "+1 Vitality", completed: true },
    { id: 3, title: "Iron Temple: 45m Strength Hypertrophy", rewardXp: 140, rewardGold: 35, type: "Hard", stat: "+2 Strength", completed: false },
    { id: 4, title: "Grimoire Study: Read 20 Pages of Tech Docs", rewardXp: 90, rewardGold: 20, type: "Medium", stat: "+1 Wisdom", completed: false },
  ]);

  // Inventory Shop
  const [inventory, setInventory] = useState([
    { id: "helm", name: "Crown of Deep Concentration", cost: 350, bonus: "+4 Wisdom & Focus", bought: true },
    { id: "boots", name: "Hermes Agile Swiftboots", cost: 280, bonus: "+3 Task Velocity", bought: false },
    { id: "elixir", name: "Cold Brew Espresso Elixir", cost: 120, bonus: "+20 Energy Stamina", bought: false },
  ]);

  const toggleQuest = (questId: number) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const nextCompleted = !q.completed;
          if (nextCompleted) {
            setXp((curr) => {
              const newXp = curr + q.rewardXp;
              if (newXp >= 3000) {
                setLevel((lvl) => lvl + 1);
                return newXp - 3000;
              }
              return newXp;
            });
            setGold((g) => g + q.rewardGold);
            setBossHp((hp) => Math.max(hp - q.rewardXp * 2, 0));
            setRpgToast(\`Quest Complete! +\${q.rewardXp} XP, +\${q.rewardGold} Gold! Boss hit for -\${q.rewardXp * 2} HP.\`);
            setTimeout(() => setRpgToast(null), 3500);
          }
          return { ...q, completed: nextCompleted };
        }
        return q;
      })
    );
  };

  const buyItem = (itemId: string, cost: number) => {
    if (gold < cost) {
      setRpgToast("Not enough Gold! Complete more daily quests first.");
      setTimeout(() => setRpgToast(null), 3000);
      return;
    }
    setGold((g) => g - cost);
    setInventory((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, bought: true } : it))
    );
    setRpgToast("Item equipped! Attributes permanently boosted.");
    setTimeout(() => setRpgToast(null), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-tight"
                  
                >
                  {brandName || "QuestCraft RPG"}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Level {level} Paladin
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">Gamified Productivity & Habit Progression RPG</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-amber-400">{gold} G</span>
              <span className="opacity-30">\u2022</span>
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span className="text-orange-500">21d Streak</span>
            </div>

            <button
              onClick={() => setIsFocusTimerRunning(!isFocusTimerRunning)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{isFocusTimerRunning ? "Pause Focus" : "Start Dungeon"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {rpgToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{rpgToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Character Hero Card & Vitals */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shrink-0 relative"
                style={{
                  backgroundColor: "#6366f1",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <span>L{level}</span>
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-400 text-black">
                  <Crown className="w-3 h-3" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-extrabold tracking-tight">Sir Tristan of Code</h1>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold">
                    Grandmaster Architect
                  </span>
                </div>
                <p className="text-xs opacity-65">Experience Bar: {xp} / 3,000 XP to Level {level + 1}</p>
                <div className="w-64 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: \`\${(xp / 3000) * 100}%\` }} />
                </div>
              </div>
            </div>

            {/* RPG Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="flex items-center justify-between opacity-70 mb-1">
                  <span>Strength</span>
                  <Sword className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="text-lg font-bold font-mono">18 <span className="text-[10px] text-emerald-500">+4</span></div>
              </div>

              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="flex items-center justify-between opacity-70 mb-1">
                  <span>Wisdom</span>
                  <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
                </div>
                <div className="text-lg font-bold font-mono">24 <span className="text-[10px] text-emerald-500">+6</span></div>
              </div>

              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="flex items-center justify-between opacity-70 mb-1">
                  <span>Focus</span>
                  <Target className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-lg font-bold font-mono">22 <span className="text-[10px] text-emerald-500">+8</span></div>
              </div>

              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="flex items-center justify-between opacity-70 mb-1">
                  <span>Vitality</span>
                  <Heart className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-lg font-bold font-mono">20 <span className="text-[10px] text-emerald-500">+3</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1 & 2: Daily Quests & Weekly Raid Boss */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Quest Board */}
          <div
            className="lg:col-span-2 p-6 rounded-2xl border"
            
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold tracking-tight">Active Guild Quests</h3>
                <p className="text-xs opacity-65">Complete tasks to earn XP, gold coins, and damage the raid boss</p>
              </div>
              <span className="text-xs font-mono opacity-70">Reset in 8h 14m</span>
            </div>

            <div className="space-y-3">
              {quests.map((q) => (
                <div
                  key={q.id}
                  onClick={() => toggleQuest(q.id)}
                  className={\`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all \${
                    q.completed ? "opacity-60 bg-emerald-500/5 border-emerald-500/20" : "hover:border-indigo-500/40"
                  }\`}
                  style={{
                    backgroundColor: !q.completed ? (isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)") : undefined,
                    borderColor: !q.completed ? "rgba(255, 255, 255, 0.08)" : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-indigo-500 shrink-0">
                      {q.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 opacity-40 hover:opacity-80" />
                      )}
                    </button>
                    <div>
                      <div className={\`text-xs font-bold \${q.completed ? "line-through opacity-75" : ""}\`}>
                        {q.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] opacity-65 font-mono mt-0.5">
                        <span className="text-amber-400 font-bold">+{q.rewardXp} XP</span>
                        <span>\u2022</span>
                        <span className="text-amber-400 font-bold">+{q.rewardGold} Gold</span>
                        <span>\u2022</span>
                        <span className="text-emerald-500">{q.stat}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={\`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 \${
                      q.type === "Legendary"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : q.type === "Hard"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }\`}
                  >
                    {q.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Raid Boss Card */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rose-500" />
                  <h3 className="text-base font-bold tracking-tight">Weekly Raid Boss</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  Level 20 Boss
                </span>
              </div>

              {/* Boss Visual */}
              <div className="p-4 rounded-xl border text-center mb-4" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mb-2">
                  <Sword className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-extrabold">The Procrastination Behemoth</h4>
                <div className="text-xs font-mono font-bold text-rose-500 mt-1">
                  {bossHp} / 5,000 HP Left
                </div>
                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: \`\${(bossHp / 5000) * 100}%\` }} />
                </div>
              </div>

              <p className="text-xs opacity-65 leading-relaxed text-center">
                Every completed quest directly inflicts 2x XP as raw damage. Defeat by Sunday midnight for 500 bonus Gold!
              </p>
            </div>

            <div className="pt-4 border-t text-[11px] opacity-70 flex items-center justify-between" >
              <span>Party Members: 4 Active</span>
              <span className="text-emerald-500 font-semibold">Victory in Sight</span>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Armory Shop & Dungeon Focus Timer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Armory & Shop */}
          <div
            className="lg:col-span-2 p-6 rounded-2xl border"
            
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold tracking-tight">Armory & Magic Loot Merchant</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">{gold} Gold Available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div>
                    <h4 className="text-xs font-bold mb-1">{item.name}</h4>
                    <p className="text-[11px] text-emerald-500 font-semibold mb-3">{item.bonus}</p>
                  </div>

                  {item.bought ? (
                    <span className="w-full py-1.5 rounded-lg border text-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border-emerald-500/20">
                      Equipped
                    </span>
                  ) : (
                    <button
                      onClick={() => buyItem(item.id, item.cost)}
                      className="w-full py-1.5 rounded-lg text-[10px] font-bold text-white shadow-sm transition-transform active:scale-95"
                      
                    >
                      Buy for {item.cost} G
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dungeon Focus Timer */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold tracking-tight">Dungeon Dive Timer</h3>
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>

              <div className="py-4 text-center">
                <div className="text-4xl font-extrabold font-mono mb-1">
                  25:00
                </div>
                <p className="text-xs opacity-65">Floor 4: Catacombs of Flow State</p>
              </div>
            </div>

            <button
              onClick={() => {
                setRpgToast("Entered Dungeon of Deep Focus! 25-minute Pomodoro running.");
                setTimeout(() => setRpgToast(null), 3500);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
              
            >
              Enter Flow Dungeon (+60 XP)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
`
};

// src/registry/template-global-logistics.ts
var templateGlobalLogistics = {
  name: "template-global-logistics",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-global-logistics.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Truck,
  Anchor,
  Compass,
  Thermometer,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  X,
  Plus,
  Navigation,
  ExternalLink,
  Layers,
  Container,
} from "lucide-react";

export interface GlobalLogisticsTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function GlobalLogisticsTemplate({
  brandName = "Vanguard Logistics",
  theme = "dark",
}: GlobalLogisticsTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [activeStage, setActiveStage] = useState(2); // In transit (Malacca)
  const [searchBol, setSearchBol] = useState("BOL-849204-HKG");
  const [selectedVessel, setSelectedVessel] = useState(0);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  const stages = [
    { id: 0, label: "Origin Berth", location: "Shenzhen Yantian", date: "Sep 01, 08:30 UTC", status: "Completed", note: "Loaded 420 TEU onto Bay 12." },
    { id: 1, label: "Ocean Transit", location: "Strait of Malacca", date: "Sep 05, 14:10 UTC", status: "Completed", note: "Cruising 16.4 knots. Calm seas." },
    { id: 2, label: "Chokepoint Crossing", location: "Bab-el-Mandeb Strait", date: "Sep 10, 04:00 UTC", status: "Active Stage", note: "Navigating escorted transit corridor." },
    { id: 3, label: "Destination Port", location: "Rotterdam Gateway", date: "Sep 18, 11:00 UTC (ETA)", status: "Scheduled", note: "Automated crane berth reserved." },
    { id: 4, label: "Intermodal Rail", location: "Duisburg Terminal", date: "Sep 20, 16:30 UTC (ETA)", status: "Scheduled", note: "Direct electric freight rail link." },
  ];

  const reeferContainers = [
    { id: "MSKU-94812-4", temp: "-20.4\xB0C", setPoint: "-20.0\xB0C", humidity: "88%", seal: "Cryptographic Intact", cargo: "Vaccines & Pharmaceuticals", status: "Optimal" },
    { id: "CMAU-20914-8", temp: "+2.8\xB0C", setPoint: "+3.0\xB0C", humidity: "92%", seal: "Cryptographic Intact", cargo: "Organic Hass Avocados", status: "Optimal" },
    { id: "HLCU-51820-1", temp: "-18.2\xB0C", setPoint: "-18.0\xB0C", humidity: "85%", seal: "Cryptographic Intact", cargo: "Deep-Sea Frozen Tuna", status: "Optimal" },
  ];

  const vessels = [
    { name: "MV Vanguard Titan", imo: "IMO 982341", speed: "16.8 kts", draught: "14.2m", teus: "18,400 TEU", pos: "12\xB042'N 43\xB018'E", eta: "Sep 18" },
    { name: "MV Pacific Horizon", imo: "IMO 940192", speed: "15.2 kts", draught: "12.8m", teus: "14,200 TEU", pos: "04\xB012'N 100\xB022'E", eta: "Sep 24" },
    { name: "MV Atlantic Vanguard", imo: "IMO 978120", speed: "17.4 kts", draught: "15.0m", teus: "21,000 TEU", pos: "36\xB014'N 05\xB021'W", eta: "Sep 14" },
  ];

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatchModalOpen(false);
    setDispatchToast("Intermodal priority manifest updated! Customs pre-clearance transmitted.");
    setTimeout(() => setDispatchToast(null), 4000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Ship className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-tight"
                  
                >
                  {brandName || "Vanguard Logistics"}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Global Fleet Telemetry
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">Intermodal Container Freight & Cold-Chain Tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <Ship className="w-3.5 h-3.5 text-indigo-400" />
              <span>Active Fleet: 14 Vessels</span>
              <span className="opacity-30">\u2022</span>
              <span className="text-emerald-500">99.4% On Schedule</span>
            </div>

            <button
              onClick={() => setIsDispatchModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Intermodal Dispatch</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {dispatchToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{dispatchToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Active BOL Consignment Tracker Bar */}
        <div
          className="p-5 rounded-2xl border"
          
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono opacity-60">MASTER BILL OF LADING</span>
                <h2 className="text-base font-extrabold font-mono tracking-tight">{searchBol}</h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="px-3 py-1.5 rounded-xl border font-mono" >
                <span className="opacity-50">Origin: </span>
                <span className="font-bold">SZX (China)</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl border font-mono" >
                <span className="opacity-50">Destination: </span>
                <span className="font-bold">RTM (Netherlands)</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl border font-mono text-emerald-500 font-bold" >
                ETA: Sep 18, 2026
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive Multi-Stage Stepper */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold tracking-tight">Intermodal Shipment Route Stages</h3>
              <p className="text-xs opacity-65">Click any stage milestone to inspect checkpoint audit & customs release timestamps</p>
            </div>
            <span className="text-xs font-mono opacity-70">Stage 3 of 5 In Transit</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {stages.map((stg) => {
              const isSelected = activeStage === stg.id;
              const isDone = stg.id < activeStage;
              const isCurrent = stg.id === activeStage;

              return (
                <div
                  key={stg.id}
                  onClick={() => setActiveStage(stg.id)}
                  className={\`p-3.5 rounded-xl border cursor-pointer transition-all \${
                    isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:border-indigo-500/40"
                  }\`}
                  style={{
                    backgroundColor: isSelected ? (isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)") : (isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)"),
                    borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={\`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold \${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-indigo-600 text-white"
                          : "bg-zinc-200 dark:bg-zinc-800 opacity-60"
                      }\`}
                    >
                      {isDone ? "\u2713" : stg.id + 1}
                    </span>
                    <span
                      className={\`text-[10px] font-bold px-1.5 py-0.2 rounded \${
                        isDone
                          ? "text-emerald-500 bg-emerald-500/10"
                          : isCurrent
                          ? "text-indigo-400 bg-indigo-500/10"
                          : "opacity-50"
                      }\`}
                    >
                      {stg.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold truncate">{stg.label}</h4>
                  <p className="text-[11px] opacity-70 truncate">{stg.location}</p>
                  <p className="text-[10px] font-mono opacity-50 mt-1">{stg.date}</p>
                </div>
              );
            })}
          </div>

          {/* Stage Note Banner */}
          <div className="p-3.5 rounded-xl border mt-4 text-xs flex items-center gap-3" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
            <Anchor className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="font-bold mr-2">{stages[activeStage].location}:</span>
              <span className="opacity-80">{stages[activeStage].note}</span>
            </div>
          </div>
        </div>

        {/* Section 2 & 3: Reefer IoT Cold Chain & Vessel Fleet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reefer Cold-Chain Telemetry */}
          <div
            className="lg:col-span-2 p-6 rounded-2xl border"
            
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold tracking-tight">Refrigerated Reefer IoT Telemetry</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Continuous Telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {reeferContainers.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold">{c.id}</span>
                      <span className="text-[10px] font-bold text-emerald-500">{c.status}</span>
                    </div>

                    <div className="p-3 rounded-lg border text-center mb-3" >
                      <div className="text-2xl font-extrabold font-mono text-cyan-400">{c.temp}</div>
                      <div className="text-[10px] opacity-60 mt-0.5">Target: {c.setPoint}</div>
                    </div>

                    <p className="text-[11px] font-semibold opacity-90 mb-1">{c.cargo}</p>
                    <div className="text-[10px] opacity-65 space-y-0.5">
                      <div>Relative Humidity: {c.humidity}</div>
                      <div>Door Seal: {c.seal}</div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t text-[10px] text-emerald-500 font-semibold flex items-center gap-1" >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cold Chain Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Vessels Fleet */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Carrier Vessels</h3>
                </div>
                <span className="text-xs font-mono opacity-70">Live AIS Feed</span>
              </div>

              <div className="space-y-3">
                {vessels.map((v, idx) => {
                  const isSelected = selectedVessel === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedVessel(idx)}
                      className={\`p-3 rounded-xl border cursor-pointer transition-all \${
                        isSelected ? "border-indigo-500 bg-indigo-500/10" : "hover:border-indigo-500/30"
                      }\`}
                      style={{ borderColor: isSelected ? undefined : "rgba(255, 255, 255, 0.08)" }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{v.name}</span>
                        <span className="text-[10px] font-mono text-emerald-500 font-semibold">{v.speed}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] opacity-70 font-mono">
                        <span>{v.teus}</span>
                        <span>ETA {v.eta}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t text-[11px] opacity-70 flex items-center justify-between" >
              <span>Draught: {vessels[selectedVessel].draught}</span>
              <span>Pos: {vessels[selectedVessel].pos}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Customs Documentation Matrix */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold tracking-tight">Border Customs & Single Window Compliance</h3>
              <p className="text-xs opacity-65">Cryptographically signed manifest documents cleared with EU Customs Authority</p>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-bold">Port Health Clearance: Approved</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">Bill of Lading</span>
                <span className="text-emerald-500">CLEARED</span>
              </div>
              <p className="text-[10px] opacity-60 font-sans">Endorsed to Dutch consignee</p>
            </div>

            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">Commercial Invoice</span>
                <span className="text-emerald-500">CLEARED</span>
              </div>
              <p className="text-[10px] opacity-60 font-sans">VAT & Import duty prepaid</p>
            </div>

            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">Phytosanitary Cert</span>
                <span className="text-emerald-500">CLEARED</span>
              </div>
              <p className="text-[10px] opacity-60 font-sans">No quarantine pests detected</p>
            </div>

            <div className="p-3.5 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">T1 Transit Bond</span>
                <span className="text-amber-500">ISSUED</span>
              </div>
              <p className="text-[10px] opacity-60 font-sans">In-bond rail transit authorized</p>
            </div>
          </div>
        </div>
      </main>

      {/* Intermodal Dispatch Modal */}
      <AnimatePresence>
        {isDispatchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "#090a0f",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Intermodal Dispatch Reroute</h3>
              </div>

              <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Final Mile Transport Mode</label>
                  <select
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    
                  >
                    <option value="rail">Electrified Freight Rail (Duisburg Hub) - Low Carbon</option>
                    <option value="truck">Dedicated Express Reefer Truck - Priority 24h</option>
                    <option value="barge">Rhine River Inland Container Barge - Bulk Eco</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl border space-y-1 font-mono text-[11px]" >
                  <div className="flex justify-between">
                    <span className="opacity-70">Estimated Transit:</span>
                    <span className="font-bold">14 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">CO2 Emissions:</span>
                    <span className="text-emerald-500 font-bold">-72% vs Standard Road Freight</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                  
                >
                  Authorize Priority Dispatch Order
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-gaming-esports.ts
var templateGamingEsports = {
  name: "template-gaming-esports",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-gaming-esports.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, 
  Trophy,
  Swords,
  Flame,
  Tv,
  Users,
  Target,
  Crown,
  CheckCircle2,
  Calendar,
  X,
  ChevronRight,
  Shield,
  Zap,
  BarChart3,
  Sparkles,
 } from "lucide-react";

export interface GamingEsportsTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function GamingEsportsTemplate({
  brandName = "Valkyrie Esports",
  theme = "dark",
}: GamingEsportsTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [selectedMatch, setSelectedMatch] = useState("grand-final");
  const [votedTeam, setVotedTeam] = useState<string | null>("Sentinels");
  const [sentinelsVotes, setSentinelsVotes] = useState(64);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [voteToast, setVoteToast] = useState<string | null>(null);

  const bracketMatches = [
    { id: "ub-semi-1", round: "Upper Semifinal", team1: "Sentinels", score1: 2, team2: "Fnatic", score2: 0, winner: "Sentinels" },
    { id: "ub-semi-2", round: "Upper Semifinal", team1: "Cloud9", score1: 2, team2: "Paper Rex", score2: 1, winner: "Cloud9" },
    { id: "ub-final", round: "Upper Final", team1: "Sentinels", score1: 2, team2: "Cloud9", score2: 1, winner: "Sentinels" },
    { id: "grand-final", round: "Grand Championship Final", team1: "Sentinels", score1: 2, team2: "Cloud9", score2: 2, winner: "LIVE MATCH" },
  ];

  const mapDraft = [
    { map: "Mirage", action: "Banned by Sentinels", tag: "Ban", status: "banned" },
    { map: "Anubis", action: "Banned by Cloud9", tag: "Ban", status: "banned" },
    { map: "Ancient", action: "Picked by Sentinels (13-9 Win)", tag: "Map 1", status: "team1" },
    { map: "Dust II", action: "Picked by Cloud9 (13-11 Win)", tag: "Map 2", status: "team2" },
    { map: "Inferno", action: "Decider Map 5 \u2022 Currently In Progress", tag: "Live", status: "live" },
  ];

  const playerComparison = [
    { metric: "Rating 2.0", p1: "1.42", p2: "1.38", p1Adv: true },
    { metric: "Damage / Round (ADR)", p1: "94.2", p2: "89.5", p1Adv: true },
    { metric: "Headshot Accuracy", p1: "58.4%", p2: "64.2%", p1Adv: false },
    { metric: "Opening Duel Wins", p1: "18 Kills", p2: "14 Kills", p1Adv: true },
    { metric: "Clutch 1vX Success", p1: "74%", p2: "62%", p1Adv: true },
  ];

  const handleVoteSubmit = (team: string) => {
    setVotedTeam(team);
    if (team === "Sentinels") setSentinelsVotes((v) => v + 1);
    setIsVoteModalOpen(false);
    setVoteToast(\`Vote registered for \${team}! Community live prediction updated.\`);
    setTimeout(() => setVoteToast(null), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-tight"
                  
                >
                  {brandName || "Valkyrie Esports"}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  BERLIN MAJOR
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">Championship Bracket & Real-Time Match HUD</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <Tv className="w-3.5 h-3.5 text-rose-500" />
              <span>284,400 Stream Viewers</span>
              <span className="opacity-30">\u2022</span>
              <span className="text-amber-400">$1,000,000 Prize Pool</span>
            </div>

            <button
              onClick={() => setIsVoteModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <Crown className="h-3.5 w-3.5" />
              <span>Vote Match MVP</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {voteToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{voteToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Live Match Grand Finals HUD Banner */}
        <div
          className="p-6 rounded-2xl border relative overflow-hidden"
          
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Team 1 */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-extrabold text-rose-500 text-xl shrink-0">
                SEN
              </div>
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">North America Seed 1</span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Sentinels</h2>
                <div className="text-xs opacity-60 font-mono mt-0.5">Full Buy: $24,800 Vault</div>
              </div>
            </div>

            {/* Match Score Display */}
            <div className="p-4 rounded-xl border text-center shrink-0 min-w-[220px]" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">
                Grand Final \u2022 Map 5 (Inferno)
              </div>
              <div className="text-4xl font-extrabold font-mono tracking-tight flex items-center justify-center gap-3">
                <span className="text-rose-500">11</span>
                <span className="opacity-30 text-2xl">:</span>
                <span className="text-cyan-400">9</span>
              </div>
              <div className="text-[11px] opacity-60 font-mono mt-1">Series Tied 2 - 2 (Best of 5)</div>
            </div>

            {/* Team 2 */}
            <div className="flex items-center gap-4 flex-1 justify-end text-right">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Europe Seed 1</span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Cloud9</h2>
                <div className="text-xs opacity-60 font-mono mt-0.5">Force Buy: $8,400 Vault</div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-extrabold text-cyan-400 text-xl shrink-0">
                C9
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive Tournament Bracket */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold tracking-tight">Playoff Championship Tree</h3>
              <p className="text-xs opacity-65">Double-elimination stage bracket with match history and seeding</p>
            </div>
            <span className="text-xs font-mono opacity-70">Stage: Finals Weekend</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bracketMatches.map((m) => {
              const isSelected = selectedMatch === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatch(m.id)}
                  className={\`p-4 rounded-xl border cursor-pointer transition-all \${
                    isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:border-indigo-500/40"
                  }\`}
                  style={{
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                    borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3 text-[11px]">
                    <span className="opacity-60">{m.round}</span>
                    <span className="px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/10 text-amber-500 text-[10px]">
                      {m.winner}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded border" >
                      <span className="font-bold">{m.team1}</span>
                      <span className="font-bold text-sm text-indigo-400">{m.score1}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border" >
                      <span className="font-bold">{m.team2}</span>
                      <span className="font-bold text-sm text-indigo-400">{m.score2}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2 & 3: Map Veto Phase & Player Stat Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Veto & Pick/Ban Timeline */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Map Draft / Veto Procedure</h3>
                </div>
                <span className="text-xs font-mono opacity-70">Best of 5 Format</span>
              </div>

              <div className="space-y-3">
                {mapDraft.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border flex items-center justify-between text-xs"
                    style={{
                      backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-mono text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold">{item.map}</div>
                        <div className="text-[11px] opacity-65">{item.action}</div>
                      </div>
                    </div>

                    <span
                      className={\`px-2 py-0.5 rounded text-[10px] font-bold \${
                        item.status === "live"
                          ? "bg-rose-500 text-white animate-pulse"
                          : item.status === "team1"
                          ? "bg-rose-500/10 text-rose-500"
                          : item.status === "team2"
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "opacity-50"
                      }\`}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t text-[11px] opacity-70 flex items-center justify-between" >
              <span>Overtime Rule: MR3 $10,000 Max</span>
              <span>Tactical Timeouts: 1 / 4 remaining</span>
            </div>
          </div>

          {/* Player Head-to-Head Comparison */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Star Duel: TenZ vs Ax1Le</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500">
                  Duel of MVPs
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {playerComparison.map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={row.p1Adv ? "text-rose-500 font-bold" : "opacity-70"}>{row.p1}</span>
                      <span className="font-sans opacity-60 text-[11px]">{row.metric}</span>
                      <span className={!row.p1Adv ? "text-cyan-400 font-bold" : "opacity-70"}>{row.p2}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full flex overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: row.p1Adv ? "56%" : "44%" }} />
                      <div className="h-full bg-cyan-500 flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Fan Prediction Bar */}
            <div className="pt-4 mt-6 border-t" >
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-rose-500">Sentinels {sentinelsVotes}%</span>
                <span className="text-cyan-400">Cloud9 {100 - sentinelsVotes}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: \`\${sentinelsVotes}%\` }} />
                <div className="h-full bg-cyan-400 flex-1" />
              </div>
              <div className="text-[10px] opacity-60 text-center mt-2">Based on 14,280 community predictions</div>
            </div>
          </div>
        </div>
      </main>

      {/* Vote MVP Modal */}
      <AnimatePresence>
        {isVoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "#090a0f",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <button
                onClick={() => setIsVoteModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold">Cast Major MVP Ballot</h3>
              </div>

              <div className="space-y-3 text-xs">
                <p className="opacity-75">
                  Select your vote for the Finals Most Valuable Player. Fans who accurately predict receive a limited badge.
                </p>

                <button
                  onClick={() => handleVoteSubmit("Sentinels")}
                  className="w-full p-3 rounded-xl border flex items-center justify-between hover:border-rose-500/50 transition-all"
                  
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 font-bold flex items-center justify-center">SEN</span>
                    <div className="text-left">
                      <div className="font-bold">TenZ (Tyson Ngo)</div>
                      <div className="text-[10px] opacity-60">1.42 Rating \u2022 28 Kills Map 4</div>
                    </div>
                  </div>
                  <span className="text-rose-500 font-bold">&rarr;</span>
                </button>

                <button
                  onClick={() => handleVoteSubmit("Cloud9")}
                  className="w-full p-3 rounded-xl border flex items-center justify-between hover:border-cyan-500/50 transition-all"
                  
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center">C9</span>
                    <div className="text-left">
                      <div className="font-bold">Ax1Le (Sergey Rykhtorov)</div>
                      <div className="text-[10px] opacity-60">1.38 Rating \u2022 64% Headshot</div>
                    </div>
                  </div>
                  <span className="text-cyan-400 font-bold">&rarr;</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-architecture-spatial.ts
var templateArchitectureSpatial = {
  name: "template-architecture-spatial",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-architecture-spatial.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, 
  Compass,
  Layers,
  Sun,
  Maximize2,
  Grid,
  CheckCircle2,
  X,
  FileText,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
 } from "lucide-react";

export interface ArchitectureSpatialTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function ArchitectureSpatialTemplate({
  brandName = "Arcform Spatial",
  theme = "dark",
}: ArchitectureSpatialTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [sunHour, setSunHour] = useState(13); // 13:00 / 1 PM
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    walls: true,
    glazing: true,
    electrical: false,
    hvac: false,
    furniture: true,
  });
  const [selectedMaterial, setSelectedMaterial] = useState("terrazzo");
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [specToast, setSpecToast] = useState<string | null>(null);

  // Compute solar metrics from hour
  const solarAzimuth = Math.round(90 + (sunHour - 8) * 18);
  const solarLux = Math.round(Math.sin(((sunHour - 6) / 12) * Math.PI) * 65000);
  const thermalGain = (Math.sin(((sunHour - 6) / 12) * Math.PI) * 3.8).toFixed(1);

  const materials = [
    {
      id: "terrazzo",
      name: "Venetian Composite Terrazzo",
      finish: "Honed Matte R10",
      origin: "Carrara, Italy",
      carbon: "14.2 kg CO\u2082e/m\xB2",
      recycled: "78% Recycled Aggregate",
      uValue: "0.22 W/m\xB2K",
      desc: "Low-porosity composite cast with reclaimed Carrara marble chips and natural lime binder.",
    },
    {
      id: "yakisugi",
      name: "Charred Shou Sugi Ban Cedar",
      finish: "Deep Carbonized Gendai",
      origin: "Nagano, Japan",
      carbon: "-2.4 kg CO\u2082e/m\xB2 (Carbon Negative)",
      recycled: "100% FSC Forested",
      uValue: "0.14 W/m\xB2K",
      desc: "Ancient fire-treated cryptomeria timber offering natural insect and fire resilience without synthetic sealers.",
    },
    {
      id: "oak",
      name: "Fluted Quarter-Sawn White Oak",
      finish: "Organic Raw Wax Oil",
      origin: "Bavaria, Germany",
      carbon: "8.6 kg CO\u2082e/m\xB2",
      recycled: "PEFC Certified",
      uValue: "0.18 W/m\xB2K",
      desc: "Acoustically tuned micro-fluted wall baffles providing NRC 0.85 reverberation absorption.",
    },
    {
      id: "bronze",
      name: "Patinated Architectural Bronze",
      finish: "Living Statuary Brown",
      origin: "Zurich, Switzerland",
      carbon: "22.0 kg CO\u2082e/m\xB2",
      recycled: "94% Reclaimed Scrap",
      uValue: "N/A (Facade Louver)",
      desc: "Custom extruded exterior solar shading fins that naturally age with climate exposure.",
    },
  ];

  const toggleLayer = (layerKey: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const handleSpecDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSpecModalOpen(false);
    setSpecToast("BIM IFC structural schedule & CSI 3-Part spec downloaded.");
    setTimeout(() => setSpecToast(null), 4000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Box className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-tight"
                  
                >
                  {brandName || "Arcform Spatial"}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  LEED Platinum
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">Architectural Blueprint & Spatial Daylight Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              <span>Project: Pavilion Kanso</span>
              <span className="opacity-30">\u2022</span>
              <span className="text-emerald-500">620 m\xB2 GIA</span>
            </div>

            <button
              onClick={() => setIsSpecModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Export CSI Specs</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {specToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{specToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Project Overview Ribbon */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                  RESIDENTIAL RESIDENCE
                </span>
                <span className="opacity-70">Kyoto Foothills, Japan</span>
                <span className="opacity-40">\u2022</span>
                <span className="opacity-70">Completed 2026</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-2">
                Pavilion Kanso: Biophilic Courtyard Residence
              </h1>
              <p className="text-xs sm:text-sm opacity-70 max-w-2xl">
                A single-level cantilevered timber and rammed-earth residence integrated with native Japanese black pines, passive solar ventilation, and central reflection pond.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center shrink-0">
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-xs opacity-60">Gross Area</div>
                <div className="text-lg font-extrabold font-mono">620 m\xB2</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-xs opacity-60">Ceiling Height</div>
                <div className="text-lg font-extrabold font-mono text-emerald-500">3.80 m</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-xs opacity-60">Glazed Ratio</div>
                <div className="text-lg font-extrabold font-mono">48% Low-E</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-xs opacity-60">EUI Rating</div>
                <div className="text-lg font-extrabold font-mono text-amber-500">18 kWh/m\xB2</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive Blueprint Floorplan Viewer with Layer Toggles */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold tracking-tight">Interactive Architectural CAD Floorplan</h2>
              <p className="text-xs opacity-65">Toggle technical BIM layers to inspect structural, MEP, and millwork overlays</p>
            </div>

            {/* Layer Toggles */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                { key: "walls", label: "Structural Walls" },
                { key: "glazing", label: "Glazing & Low-E" },
                { key: "electrical", label: "Electrical / Data" },
                { key: "hvac", label: "Passive HVAC" },
                { key: "furniture", label: "Millwork" },
              ].map((layer) => {
                const active = activeLayers[layer.key];
                return (
                  <button
                    key={layer.key}
                    onClick={() => toggleLayer(layer.key)}
                    className={\`px-2.5 py-1 rounded-lg border transition-all \${
                      active ? "bg-indigo-600 text-white font-semibold" : "opacity-60 hover:opacity-100"
                    }\`}
                    style={{ borderColor: active ? undefined : "rgba(255, 255, 255, 0.08)" }}
                  >
                    {layer.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blueprint SVG Canvas */}
          <div
            className="p-6 rounded-xl border relative min-h-[300px] flex items-center justify-center font-mono overflow-x-auto"
            style={{
              backgroundColor: isDark ? "#060913" : "#f1f5f9",
              borderColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Grid coordinate overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-2xl min-w-[500px] h-64 border-2 border-dashed rounded-xl p-4 flex flex-col justify-between" style={{ borderColor: isDark ? "#38bdf844" : "#0284c744" }}>
              {/* Outer walls */}
              <div className="flex justify-between text-[10px] opacity-50">
                <span>[GRID 1A]</span>
                <span>NORTH ELEVATION: 28.40m</span>
                <span>[GRID 4A]</span>
              </div>

              {/* Rooms layout */}
              <div className="grid grid-cols-3 gap-3 h-40">
                {/* Master Pavilion */}
                <div className={\`p-3 rounded border flex flex-col justify-between transition-opacity \${activeLayers.walls ? "border-sky-400 bg-sky-500/5" : "border-transparent"}\`}>
                  <span className="text-[11px] font-bold">01 \u2022 Master Pavilion</span>
                  <div className="text-[10px] opacity-70">
                    {activeLayers.furniture && "Tatami Mat Plinth"}
                    {activeLayers.hvac && " \u2022 Underfloor Radiant Hydronic"}
                  </div>
                  <span className="text-[10px] text-sky-400">74 m\xB2 \u2022 Honed Oak</span>
                </div>

                {/* Central Reflection Courtyard */}
                <div className="p-3 rounded border-2 border-indigo-500/30 bg-indigo-500/10 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold text-indigo-400">Inner Atrium Courtyard</span>
                  <span className="text-[10px] opacity-70 mt-1">Reflecting Basin & Moss Garden</span>
                  {activeLayers.glazing && <span className="text-[9px] text-emerald-500 mt-1">Triple Low-E Cavity</span>}
                </div>

                {/* Tea Pavilion & Living */}
                <div className={\`p-3 rounded border flex flex-col justify-between transition-opacity \${activeLayers.walls ? "border-sky-400 bg-sky-500/5" : "border-transparent"}\`}>
                  <span className="text-[11px] font-bold">02 \u2022 Sunken Tea Room</span>
                  <div className="text-[10px] opacity-70">
                    {activeLayers.electrical && "Dali Smart Dimming Circuits"}
                  </div>
                  <span className="text-[10px] text-sky-400">92 m\xB2 \u2022 Terrazzo Slab</span>
                </div>
              </div>

              <div className="flex justify-between text-[10px] opacity-50">
                <span>DATUM LEVEL: \xB10.000</span>
                <span>SCALE: 1:100 @ A1</span>
                <span>CROSS SECTION B-B</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 & 3: Daylight Sun Angle Slider & Material Spec Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daylight Sun Angle Azimuth Simulator */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold tracking-tight">Solar Daylight Azimuth</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 font-mono">
                  {sunHour}:00 JST
                </span>
              </div>

              {/* Sun Angle Display */}
              <div className="p-4 rounded-xl border text-center mb-6 font-mono" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div className="text-3xl font-extrabold text-amber-400">
                  {solarAzimuth}\xB0 <span className="text-xs font-normal opacity-70 font-sans">Azimuth Angle</span>
                </div>
                <div className="text-xs opacity-60 mt-1">
                  Solar Illuminance: {solarLux.toLocaleString()} Lux
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2 mb-6 text-xs font-mono">
                <div className="flex justify-between opacity-70">
                  <span>08:00 Morning</span>
                  <span>18:00 Dusk</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="18"
                  value={sunHour}
                  onChange={(e) => setSunHour(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg border" >
                  <span className="opacity-70">Direct Solar Thermal Gain</span>
                  <span className="font-mono text-emerald-500 font-bold">{thermalGain} kW/h</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg border" >
                  <span className="opacity-70">Overhang Shadow Depth</span>
                  <span className="font-mono font-bold">1.45 m (100% Glare cut)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t text-[11px] opacity-70" >
              Passive cooling verified with CFD airflow simulation.
            </div>
          </div>

          {/* Sustainable Material Specification Drawer */}
          <div
            className="lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold tracking-tight">Tactile Material Finishes Palette</h3>
                  <p className="text-xs opacity-65">Embodied carbon emissions & sustainable circularity ratings</p>
                </div>
                <span className="text-xs font-mono opacity-70">Cradle to Cradle Certified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {materials.map((mat) => {
                  const isSelected = selectedMaterial === mat.id;
                  return (
                    <div
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat.id)}
                      className={\`p-3.5 rounded-xl border cursor-pointer transition-all \${
                        isSelected ? "ring-2 ring-indigo-500 shadow-sm" : "hover:border-indigo-500/40"
                      }\`}
                      style={{
                        backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                        borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold">{mat.name}</h4>
                        <span className="text-[10px] font-mono text-emerald-500 font-bold">{mat.carbon}</span>
                      </div>
                      <div className="text-[11px] opacity-70 mb-2">{mat.finish} \u2022 {mat.origin}</div>
                      <p className="text-[10px] opacity-60 leading-relaxed line-clamp-2">{mat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border flex items-center justify-between text-xs" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Selected Material: {materials.find((m) => m.id === selectedMaterial)?.name}</span>
              </div>
              <span className="font-mono text-[11px] opacity-70">U-Val: {materials.find((m) => m.id === selectedMaterial)?.uValue}</span>
            </div>
          </div>
        </div>
      </main>

      {/* CSI Spec Sheet Export Modal */}
      <AnimatePresence>
        {isSpecModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "#090a0f",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <button
                onClick={() => setIsSpecModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold">Export Architectural Specification</h3>
              </div>

              <form onSubmit={handleSpecDownload} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Specification Standard</label>
                  <select
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    
                  >
                    <option value="csi">CSI MasterFormat 2026 (Divisions 03 - 12)</option>
                    <option value="ifc">buildingSMART openIFC 4.3 BIM Model</option>
                    <option value="leed">LEED v4.1 Materials & Resources Documentation</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl border space-y-1 font-mono text-[11px]" >
                  <div className="flex justify-between">
                    <span className="opacity-70">Project File:</span>
                    <span className="font-bold">Pavilion_Kanso_Full_Spec.zip</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">File Size:</span>
                    <span className="font-bold">42.8 MB (with CAD vector layers)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                  
                >
                  Download Complete Architectural Package
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-cybersecurity-soc.ts
var templateCybersecuritySoc = {
  name: "template-cybersecurity-soc",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-cybersecurity-soc.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Lock,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Crosshair,
  Server,
  Zap,
  Globe,
  Sliders,
  FileCode,
} from "lucide-react";

export interface CybersecuritySocTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function CybersecuritySocTemplate({
  brandName = "Aegis SOC",
  theme = "dark",
}: CybersecuritySocTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [selectedIncident, setSelectedIncident] = useState(0);
  const [isQuarantineModalOpen, setIsQuarantineModalOpen] = useState(false);
  const [quarantinedHosts, setQuarantinedHosts] = useState<string[]>([]);
  const [socToast, setSocToast] = useState<string | null>(null);

  const incidents = [
    {
      id: "INC-98214",
      title: "Pass-the-Hash Lateral Movement via SMB",
      mitre: "T1021.002",
      severity: "CRITICAL",
      sla: "07:22",
      host: "srv-dc-primary-01.internal",
      ip: "10.240.12.8",
      sourceIp: "185.220.101.5",
      riskScore: 96,
      payload: "0x4E 0x54 0x4C 0x4D 0x53 0x53 0x50 ... [NTLMSSP Auth Negotiate NTLM2 Key]",
      desc: "Anomalous NTLM authentication token reused across 12 high-privilege domain controllers within 45 seconds.",
    },
    {
      id: "INC-98215",
      title: "LSASS Process Memory Dumper Heuristic",
      mitre: "T1003.001",
      severity: "HIGH",
      sla: "18:40",
      host: "dev-macbook-eng-41.corp",
      ip: "10.240.88.19",
      sourceIp: "194.26.29.112",
      riskScore: 84,
      payload: "com.apple.proc.memory.dump -> /tmp/.hidden_kext_cache",
      desc: "Unsigned Mach-O binary invoked ptrace() against local security authority memory space.",
    },
    {
      id: "INC-98216",
      title: "High-Entropy DNS Tunneling Data Exfiltration",
      mitre: "T1071.004",
      severity: "MEDIUM",
      sla: "42:15",
      host: "app-worker-node-14.k8s",
      ip: "10.240.64.92",
      sourceIp: "45.154.255.89",
      riskScore: 68,
      payload: "TXT 8a9f4c029b.ns1.malicious-darknet.xyz -> base64 decode",
      desc: "Sustained burst of 450 Base64-encoded DNS TXT queries matching known C2 heartbeat patterns.",
    },
  ];

  const currentInc = incidents[selectedIncident];
  const isCurrentHostQuarantined = quarantinedHosts.includes(currentInc.host);

  const handleQuarantineConfirm = () => {
    setQuarantinedHosts((prev) => [...prev, currentInc.host]);
    setIsQuarantineModalOpen(false);
    setSocToast(\`HOST ISOLATED: \${currentInc.host} air-gapped from internal mesh. Firewall zero-trust drop applied.\`);
    setTimeout(() => setSocToast(null), 4000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-tight"
                  
                >
                  {brandName || "Aegis SOC"}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  DEFCON 3: ELEVATED
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">Security Operations Center & Automated Threat Defense</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <Radio className="w-3.5 h-3.5 text-emerald-500" />
              <span>SIEM Ingest: 82,400 eps</span>
              <span className="opacity-30">\u2022</span>
              <span className="text-emerald-500">99.8% Auto-Mitigated</span>
            </div>

            <button
              onClick={() => setIsQuarantineModalOpen(true)}
              disabled={isCurrentHostQuarantined}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor: isCurrentHostQuarantined ? "#6b7280" : "#e11d48",
                borderRadius: "0.75rem",
              }}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{isCurrentHostQuarantined ? "Host Air-Gapped" : "Isolate Host"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {socToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{socToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Top 4 SOC Health KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Critical Incidents in Queue</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-rose-500">1</span>
              <span className="text-xs opacity-60">/ 3 Active Alarms</span>
            </div>
            <p className="text-[11px] opacity-65">SLA Countdown: 07:22 to escalation breach.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full w-[85%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">MITRE Techniques Flagged</span>
              <Crosshair className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">4</span>
              <span className="text-xs text-amber-500 font-medium">T1021, T1003</span>
            </div>
            <p className="text-[11px] opacity-65">Privilege escalation & Credential Access.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[60%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Zero-Trust Network Airgaps</span>
              <Lock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">
                {quarantinedHosts.length}
              </span>
              <span className="text-xs opacity-60">Isolated Hosts</span>
            </div>
            <p className="text-[11px] opacity-65">Micro-segmentation policy enforced at eBPF kernel.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[45%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">CVE Vulnerability Shielding</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-emerald-500">100%</span>
              <span className="text-xs opacity-60">Virtual Patched</span>
            </div>
            <p className="text-[11px] opacity-65">WAF heuristics blocking zero-day exploits.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[100%]" />
            </div>
          </div>
        </div>

        {/* Section 1 & 2: SIEM Triage Queue & Deep Payload Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SIEM Incident Queue */}
          <div
            className="lg:col-span-2 p-6 rounded-2xl border"
            
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold tracking-tight">Active Incident Triage Stream</h3>
                <p className="text-xs opacity-65">Select an alert to inspect origin traces & MITRE signatures</p>
              </div>
              <span className="text-xs font-mono opacity-70">3 Incidents Pending SLA</span>
            </div>

            <div className="space-y-3">
              {incidents.map((inc, idx) => {
                const isSelected = selectedIncident === idx;
                const isQuarantined = quarantinedHosts.includes(inc.host);

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(idx)}
                    className={\`p-4 rounded-xl border cursor-pointer transition-all \${
                      isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:border-indigo-500/40"
                    }\`}
                    style={{
                      backgroundColor: isSelected ? (isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)") : (isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)"),
                      borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{inc.id}</span>
                        <span
                          className={\`px-2 py-0.5 rounded text-[10px] font-bold \${
                            inc.severity === "CRITICAL"
                              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              : inc.severity === "HIGH"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          }\`}
                        >
                          {inc.severity}
                        </span>
                        <span className="font-mono px-2 py-0.5 rounded text-[10px] bg-zinc-200 dark:bg-zinc-800">
                          MITRE {inc.mitre}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="opacity-60">SLA: {inc.sla}</span>
                        {isQuarantined && (
                          <span className="px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 font-bold text-[10px]">
                            AIR-GAPPED
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs font-bold mb-1">{inc.title}</h4>
                    <p className="text-[11px] opacity-70 mb-2 leading-relaxed">{inc.desc}</p>

                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono opacity-60">
                      <span>Target Host: {inc.host}</span>
                      <span>Target IP: {inc.ip}</span>
                      <span className="text-rose-400">Threat Origin: {inc.sourceIp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deep Payload & Risk Score Inspector */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between font-mono"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4 font-sans">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight">Packet Payload Inspector</h3>
                </div>
                <span className="text-xs font-mono text-rose-500 font-bold">
                  Risk: {currentInc.riskScore}/100
                </span>
              </div>

              {/* Target info card */}
              <div className="p-3 rounded-xl border text-xs space-y-1 mb-4" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <div><span className="opacity-50">Target Host: </span><span className="font-bold">{currentInc.host}</span></div>
                <div><span className="opacity-50">Ingress Point: </span><span>{currentInc.sourceIp}</span></div>
                <div><span className="opacity-50">Technique: </span><span className="text-amber-400">{currentInc.mitre}</span></div>
              </div>

              {/* Raw Payload snippet */}
              <div className="space-y-1 text-xs">
                <span className="opacity-60 text-[11px] font-sans">Raw Byte Sequence:</span>
                <div
                  className="p-3 rounded-xl border text-[11px] leading-relaxed break-all max-h-36 overflow-y-auto"
                  style={{
                    backgroundColor: isDark ? "#08090f" : "#f1f5f9",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                    color: isDark ? "#38bdf8" : "#0369a1",
                  }}
                >
                  {currentInc.payload}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t font-sans">
              <button
                onClick={() => setIsQuarantineModalOpen(true)}
                disabled={isCurrentHostQuarantined}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: isCurrentHostQuarantined ? "#6b7280" : "#e11d48" }}
              >
                {isCurrentHostQuarantined ? "Host Air-Gapped" : \`Isolate \${currentInc.host}\`}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Isolation Confirmation Modal */}
      <AnimatePresence>
        {isQuarantineModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "#090a0f",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <button
                onClick={() => setIsQuarantineModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-rose-500">Emergency Host Air-Gap Isolation</h3>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <p className="leading-relaxed opacity-80">
                  Executing an air-gap will instantly sever all TCP/UDP connections to <strong>{currentInc.host}</strong> ({currentInc.ip}) via SDN kernel drop rules. Active sessions will be terminated immediately.
                </p>

                <div className="p-3 rounded-xl border font-mono space-y-1 text-[11px]" >
                  <div>Target Asset: {currentInc.host}</div>
                  <div>Origin Signature: {currentInc.mitre}</div>
                  <div>SLA Action: Immediate Airgap Quarantine</div>
                </div>

                <button
                  onClick={handleQuarantineConfirm}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-95 bg-rose-600 hover:bg-rose-700"
                >
                  Confirm Immediate Air-Gap Isolation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-cleantech-agriculture.ts
var templateCleantechAgriculture = {
  name: "template-cleantech-agriculture",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-cleantech-agriculture.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  Droplets,
  Sun,
  Wind,
  Thermometer,
  Activity,
  Sliders,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  Calendar,
  Layers,
  Leaf,
  Clock,
  ShieldCheck,
} from "lucide-react";

export interface CleantechAgricultureTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function CleantechAgricultureTemplate({
  brandName = "Verdant IoT",
  theme = "dark",
}: CleantechAgricultureTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [phLevel, setPhLevel] = useState(6.2);
  const [ecLevel, setEcLevel] = useState(1.8);
  const [redSpectrum, setRedSpectrum] = useState(65);
  const [blueSpectrum, setBlueSpectrum] = useState(25);
  const [farRedSpectrum, setFarRedSpectrum] = useState(10);
  const [isDosingModalOpen, setIsDosingModalOpen] = useState(false);
  const [dosingToast, setDosingToast] = useState<string | null>(null);

  const cropBatches = [
    { name: "Wasabi Microgreens", bay: "Bay 01-A", stage: "Late Vegetative", day: 18, totalDays: 24, progress: 75, yieldKg: "42.5 kg", health: "Optimal 98%" },
    { name: "Genovese Sweet Basil", bay: "Bay 03-C", stage: "Harvest Ready", day: 36, totalDays: 36, progress: 100, yieldKg: "128.0 kg", health: "Prime Harvest" },
    { name: "Red Butterhead Lettuce", bay: "Bay 02-B", stage: "Canopy Expansion", day: 14, totalDays: 30, progress: 46, yieldKg: "85.2 kg", health: "Optimal 96%" },
    { name: "Culinary Shiso Leaves", bay: "Bay 04-A", stage: "Germination Spike", day: 6, totalDays: 28, progress: 21, yieldKg: "34.0 kg", health: "Rooting Fast" },
  ];

  const handleDosingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDosingModalOpen(false);
    setDosingToast("Peristaltic nutrient injection initiated! Water pH & EC recalibrated.");
    setTimeout(() => setDosingToast(null), 4000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-tight"
                  
                >
                  {brandName || "Verdant IoT"}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Closed Loop CEA
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">Controlled Environment Agriculture & Hydroponics Telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>98.4% Water Recycled</span>
              <span className="opacity-30">\u2022</span>
              <span className="text-emerald-500">Zero Pesticides</span>
            </div>

            <button
              onClick={() => setIsDosingModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              
            >
              <Leaf className="h-3.5 w-3.5" />
              <span>Dose Nutrients</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {dosingToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-semibold backdrop-blur-md"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              color: "#f4f4f7",
            }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{dosingToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Top 4 Environmental Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Canopy Air Temperature</span>
              <Thermometer className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">22.4\xB0C</span>
              <span className="text-xs text-emerald-500 font-medium">Target \xB10.5\xB0C</span>
            </div>
            <p className="text-[11px] opacity-65">Chilled HVAC loop maintaining day/night thermal delta.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[72%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Humidity & VPD Pressure</span>
              <Wind className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">1.12</span>
              <span className="text-xs opacity-60">kPa VPD (68% RH)</span>
            </div>
            <p className="text-[11px] opacity-65">Ideal transpiration rate with zero tipburn risk.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full w-[80%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">CO\u2082 Photosynthesis Enrichment</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-emerald-500">950</span>
              <span className="text-xs opacity-60">PPM</span>
            </div>
            <p className="text-[11px] opacity-65">+40% Biomass acceleration vs ambient atmosphere.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[88%]" />
            </div>
          </div>

          <div
            className="p-5 rounded-2xl border relative overflow-hidden transition-all hover:shadow-md"
            
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-70">Hydroponic Water Chemistry</span>
              <Droplets className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold font-mono tracking-tight">pH 6.2</span>
              <span className="text-xs opacity-60">EC 1.84 mS</span>
            </div>
            <p className="text-[11px] opacity-65">Automated nutrient absorption at root rhizosphere.</p>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-[92%]" />
            </div>
          </div>
        </div>

        {/* Section 1 & 2: Dosing Station Controls & Photosynthetic Light Spectrum */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hydroponic Nutrient Dosing Dispenser */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold tracking-tight">Peristaltic Nutrient Dosing Pumps</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Sub-System Online
                </span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between mb-1 font-sans">
                    <span className="opacity-80">Water Acidity Calibration (pH Target)</span>
                    <span className="font-bold text-cyan-400 font-mono">{phLevel.toFixed(1)} pH</span>
                  </div>
                  <input
                    type="range"
                    min="5.5"
                    max="7.0"
                    step="0.1"
                    value={phLevel}
                    onChange={(e) => setPhLevel(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] opacity-50 font-sans mt-0.5">
                    <span>5.5 Acidic</span>
                    <span>6.2 Optimal</span>
                    <span>7.0 Neutral</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-sans">
                    <span className="opacity-80">Electrical Conductivity (EC Nutrient Density)</span>
                    <span className="font-bold text-emerald-500 font-mono">{ecLevel.toFixed(1)} mS/cm</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.1"
                    value={ecLevel}
                    onChange={(e) => setEcLevel(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] opacity-50 font-sans mt-0.5">
                    <span>1.0 Seedlings</span>
                    <span>1.8 Full Growth</span>
                    <span>3.0 Heavy Bloom</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px]">
                  <div className="p-2.5 rounded-xl border" >
                    <div className="opacity-50 text-[10px]">Nitrogen (N)</div>
                    <div className="font-bold text-emerald-500">180 ppm</div>
                  </div>
                  <div className="p-2.5 rounded-xl border" >
                    <div className="opacity-50 text-[10px]">Phosphorus</div>
                    <div className="font-bold text-indigo-400">45 ppm</div>
                  </div>
                  <div className="p-2.5 rounded-xl border" >
                    <div className="opacity-50 text-[10px]">Potassium</div>
                    <div className="font-bold text-amber-500">220 ppm</div>
                  </div>
                  <div className="p-2.5 rounded-xl border" >
                    <div className="opacity-50 text-[10px]">Cal-Mag</div>
                    <div className="font-bold text-cyan-400">120 ppm</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t text-[11px] opacity-70 flex items-center justify-between" >
              <span>Reverse Osmosis Filtration: 99.9% Purity</span>
              <span className="text-emerald-500 font-semibold">Pump Cycle: Standby</span>
            </div>
          </div>

          {/* LED Spectrum Programmer */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-rose-500" />
                  <h3 className="text-base font-bold tracking-tight">Photosynthetic Photon Flux (PPFD)</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 font-mono">
                  16h / 8h Photoperiod
                </span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between mb-1 font-sans">
                    <span className="opacity-80">Deep Red 660nm (Biomass & Stemming)</span>
                    <span className="font-bold text-rose-500 font-mono">{redSpectrum}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={redSpectrum}
                    onChange={(e) => setRedSpectrum(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-sans">
                    <span className="opacity-80">Royal Blue 450nm (Leaf Chlorophyll Synthesis)</span>
                    <span className="font-bold text-blue-500 font-mono">{blueSpectrum}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={blueSpectrum}
                    onChange={(e) => setBlueSpectrum(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-sans">
                    <span className="opacity-80">Far Red 730nm (Cryptochrome Photoreceptor)</span>
                    <span className="font-bold text-purple-500 font-mono">{farRedSpectrum}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={farRedSpectrum}
                    onChange={(e) => setFarRedSpectrum(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl border flex items-center justify-between font-sans text-[11px]" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                  <span>Daily Light Integral (DLI):</span>
                  <span className="font-mono font-bold text-emerald-500">17.8 mol/m\xB2/day</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t text-[11px] opacity-70 flex items-center justify-between" >
              <span>Fixture Efficacy: 2.85 \xB5mol/J</span>
              <span>PAR Delivery: Uniform 250 \xB5mol/m\xB2/s</span>
            </div>
          </div>
        </div>

        {/* Section 3: Active Crop Growth Stage & Harvest Pipeline */}
        <div
          className="p-6 rounded-2xl border"
          
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold tracking-tight">Active Hydroponic Crop Batches</h3>
              <p className="text-xs opacity-65">Real-time biological lifecycle tracking across automated grow bays</p>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-semibold">Facility Status: 100% Operational</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cropBatches.map((crop, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border flex flex-col justify-between"
                style={{
                  backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">
                      {crop.bay}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500">{crop.health}</span>
                  </div>

                  <h4 className="text-xs font-bold mb-1">{crop.name}</h4>
                  <div className="text-[11px] opacity-70 mb-3">{crop.stage}</div>

                  {/* Progress bar */}
                  <div className="space-y-1 text-[10px] font-mono mb-3">
                    <div className="flex justify-between opacity-60">
                      <span>Day {crop.day} of {crop.totalDays}</span>
                      <span>{crop.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: \`\${crop.progress}%\` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center justify-between text-xs font-mono" >
                  <span className="opacity-60 text-[10px]">Proj. Harvest:</span>
                  <span className="font-bold text-emerald-500">{crop.yieldKg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Dosing Dispatch Modal */}
      <AnimatePresence>
        {isDosingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl border shadow-2xl relative"
              style={{
                backgroundColor: "#090a0f",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <button
                onClick={() => setIsDosingModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold">Automated Nutrient Dispenser</h3>
              </div>

              <form onSubmit={handleDosingSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Botanical Target Recipe</label>
                  <select
                    className="w-full p-2.5 rounded-xl border outline-none font-medium"
                    
                  >
                    <option value="microgreens">Microgreens Fast-Rooting Formula (EC 1.4, pH 6.1)</option>
                    <option value="leafy">Leafy Greens Maximum Crispness (EC 1.8, pH 6.2)</option>
                    <option value="herbs">Essential Terpene Synthesis (EC 2.2, pH 6.0)</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl border space-y-1 font-mono text-[11px]" >
                  <div className="flex justify-between">
                    <span className="opacity-70">Automated Pump Dispense:</span>
                    <span className="font-bold">45ml Stock A + 45ml Stock B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Recirculation Time:</span>
                    <span className="font-bold text-emerald-500">3.5 Minutes Total</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                  
                >
                  Inject Nutrient Formula to Grow Bays
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-juris-vault.ts
var templateJurisVault = {
  name: "template-juris-vault",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-juris-vault.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  ShieldAlert,
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Sliders,
  ChevronRight,
  GitPullRequest,
  History,
  PenTool,
  Check,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";

export interface JurisVaultTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function JurisVaultTemplate({
  brandName = "JurisVault AI",
  theme = "dark",
}: JurisVaultTemplateProps) {
  
    const isDark = theme === "dark";

  // State
  const [selectedClauseIndex, setSelectedClauseIndex] = useState(0);
  const [clauseFilter, setClauseFilter] = useState<"ALL" | "HIGH_RISK" | "RESOLVED">("ALL");
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signedParties, setSignedParties] = useState<string[]>(["Legal Counsel (Acme Corp)"]);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const clauses = [
    {
      id: "SEC-8.2",
      title: "Limitation of Liability & Consequential Damages",
      risk: "CRITICAL",
      riskScore: 94,
      status: "COUNTER_PROPOSED",
      original:
        "In no event shall either party's aggregate cumulative liability arising out of or related to this Agreement exceed twelve (12) months of service fees paid prior to the incident giving rise to claim.",
      proposed:
        "Counterparty proposes: Liability cap raised to five million dollars ($5,000,000 USD) and eliminates standard exclusion for consequential, lost revenue, and punitive damages.",
      riskExplanation:
        "Uncapped liability exposure for third-party indirect damages drastically deviates from corporate playbook standard.",
      recommendation: "Reject uncapped consequential damages. Counter with 2x annual contract value cap with standard IP carve-out.",
    },
    {
      id: "SEC-14.1",
      title: "Intellectual Property Indemnification & Defense",
      risk: "HIGH",
      riskScore: 78,
      status: "UNDER_REVIEW",
      original:
        "Provider shall defend, indemnify and hold harmless Customer against any third-party claims asserting that the Platform infringes any valid United States patent or copyright.",
      proposed:
        "Counterparty requests: Worldwide patent, trademark, and trade secret indemnification with sole settlement authority and immediate defense counsel appointment.",
      riskExplanation:
        "Worldwide coverage introduces foreign patent troll exposure. Immediate counsel appointment limits internal defense strategy.",
      recommendation: "Limit defense indemnity to US/EU jurisdictions with mutual consultation prior to any public settlement.",
    },
    {
      id: "SEC-4.3",
      title: "Net Payment Terms & Late Interest Accrual",
      risk: "LOW",
      riskScore: 22,
      status: "RESOLVED",
      original:
        "Invoices are payable Net 30 days from date of receipt via automated ACH or electronic wire transfer.",
      proposed:
        "Customer requests Net 45 days. Accepted as standard enterprise commercial trade concession.",
      riskExplanation: "Minimal financial impact; aligned with standard treasury cash-flow tolerance.",
      recommendation: "Clause resolved and approved by commercial director on Sep 8.",
    },
  ];

  const filteredClauses = clauses.filter((c) => {
    if (clauseFilter === "HIGH_RISK") return c.risk === "CRITICAL" || c.risk === "HIGH";
    if (clauseFilter === "RESOLVED") return c.status === "RESOLVED";
    return true;
  });

  const currentClause = clauses[selectedClauseIndex] || clauses[0];

  const handleSignContract = (signer: string) => {
    if (!signedParties.includes(signer)) {
      setSignedParties([...signedParties, signer]);
      setActionToast(\`Cryptographic e-signature verified for \${signer}\`);
      setTimeout(() => setActionToast(null), 3500);
    }
  };

  const handleAcceptFallback = () => {
    setActionToast("Fallback Clause injected into Master Document (v2.5 draft created)");
    setTimeout(() => setActionToast(null), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Top Navigation */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(10, 12, 18, 0.88)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">JurisVault AI</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(99, 102, 241, 0.12)",
                    color: "#6366f1",
                  }}
                >
                  LegalTech
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">
                Master Services Agreement \u2022 Enterprise Redline Review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs"
              
            >
              <FileText className="w-3.5 h-3.5 opacity-60" />
              <span className="font-medium">MSA-2026-AcmeCorp-v2.4.docx</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            </div>

            <button
              onClick={() => setIsSignModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Signatures ({signedParties.length}/2)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {actionToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.12)" : "#ecfdf5",
                borderColor: "rgba(16, 185, 129, 0.3)",
                color: "#10b981",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{actionToast}</span>
              </div>
              <button onClick={() => setActionToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Executive Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            className="p-4 rounded-2xl border flex flex-col justify-between"
            
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold opacity-60">Overall Risk Score</span>
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-500">68/100</span>
              <span className="text-[11px] font-medium text-rose-500">High Exposure</span>
            </div>
            <p className="text-[10px] opacity-50 mt-1">2 critical non-standard clauses</p>
          </div>

          <div
            className="p-4 rounded-2xl border flex flex-col justify-between"
            
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold opacity-60">Redlines Detected</span>
              <GitPullRequest className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">14</span>
              <span className="text-[11px] opacity-70">modifications</span>
            </div>
            <p className="text-[10px] opacity-50 mt-1">11 approved \u2022 3 outstanding</p>
          </div>

          <div
            className="p-4 rounded-2xl border flex flex-col justify-between"
            
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold opacity-60">Playbook Adherence</span>
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-500">82%</span>
              <span className="text-[11px] text-emerald-500 font-medium">+5% vs draft 1</span>
            </div>
            <p className="text-[10px] opacity-50 mt-1">Corporate Standard 2026.Q3</p>
          </div>

          <div
            className="p-4 rounded-2xl border flex flex-col justify-between"
            
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold opacity-60">Execution SLA</span>
              <History className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">48 hrs</span>
              <span className="text-[11px] text-emerald-500 font-medium">On Track</span>
            </div>
            <p className="text-[10px] opacity-50 mt-1">Target close: Sep 12, 2026</p>
          </div>
        </div>

        {/* Workspace: Left clause selector / Right interactive redline comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Clause Navigation List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider opacity-60">
                Key Redline Clauses
              </h2>
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg text-[10px]">
                <button
                  onClick={() => setClauseFilter("ALL")}
                  className={\`px-2 py-1 rounded-md font-semibold transition-all \${
                    clauseFilter === "ALL" ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-60"
                  }\`}
                >
                  All
                </button>
                <button
                  onClick={() => setClauseFilter("HIGH_RISK")}
                  className={\`px-2 py-1 rounded-md font-semibold transition-all \${
                    clauseFilter === "HIGH_RISK" ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-60"
                  }\`}
                >
                  Risk
                </button>
                <button
                  onClick={() => setClauseFilter("RESOLVED")}
                  className={\`px-2 py-1 rounded-md font-semibold transition-all \${
                    clauseFilter === "RESOLVED" ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-60"
                  }\`}
                >
                  Done
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {filteredClauses.map((clause, idx) => {
                const isSelected = clause.id === currentClause.id;
                return (
                  <button
                    key={clause.id}
                    onClick={() => {
                      const realIndex = clauses.findIndex((c) => c.id === clause.id);
                      setSelectedClauseIndex(realIndex);
                    }}
                    className="w-full text-left p-3.5 rounded-xl border transition-all relative overflow-hidden"
                    style={{
                      backgroundColor: isSelected ? "#12141c" : "transparent",
                      borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    {isSelected && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        
                      />
                    )}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono font-bold opacity-60">{clause.id}</span>
                      <span
                        className={\`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase \${
                          clause.risk === "CRITICAL"
                            ? "bg-rose-500/15 text-rose-500 border border-rose-500/20"
                            : clause.risk === "HIGH"
                            ? "bg-amber-500/15 text-amber-500 border border-amber-500/20"
                            : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                        }\`}
                      >
                        {clause.risk}
                      </span>
                    </div>
                    <p className="text-xs font-semibold line-clamp-1">{clause.title}</p>
                    <p className="text-[11px] opacity-60 mt-1 line-clamp-1">{clause.proposed}</p>
                  </button>
                );
              })}
            </div>

            {/* AI Assistant Callout */}
            <div
              className="p-4 rounded-2xl border space-y-2"
              style={{
                backgroundColor: isDark ? "rgba(99, 102, 241, 0.05)" : "#f5f3ff",
                borderColor: "rgba(99, 102, 241, 0.2)",
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-500">JurisVault Copilot</span>
              </div>
              <p className="text-[11px] opacity-75 leading-relaxed">
                Counterparty legal team historically conceded consequential damage caps when offered a
                mutual 1.5x fee limitation. Recommended to send approved Playbook Form 4B.
              </p>
            </div>
          </div>

          {/* Right Column: Deep Clause Diff & Review */}
          <div className="lg:col-span-8 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-6"
              
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold opacity-60">{currentClause.id}</span>
                    <span
                      className={\`text-[10px] font-bold px-2 py-0.5 rounded-full \${
                        currentClause.risk === "CRITICAL"
                          ? "bg-rose-500/15 text-rose-500"
                          : currentClause.risk === "HIGH"
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-emerald-500/15 text-emerald-500"
                      }\`}
                    >
                      {currentClause.risk} RISK \u2022 Score: {currentClause.riskScore}/100
                    </span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight">{currentClause.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAcceptFallback}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    
                  >
                    Insert Fallback Clause
                  </button>
                </div>
              </div>

              {/* Side-by-Side Diff Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Standard Playbook Clause */}
                <div
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                      Standard Company Form
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-500">Approved</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-85">{currentClause.original}</p>
                </div>

                {/* Counterparty Proposed Redline */}
                <div
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    backgroundColor: isDark ? "rgba(244, 63, 94, 0.05)" : "#fff1f2",
                    borderColor: "rgba(244, 63, 94, 0.2)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                      Counterparty Proposed Redline
                    </span>
                    <span className="text-[10px] font-semibold text-rose-500">Deviated</span>
                  </div>
                  <p className="text-xs leading-relaxed text-rose-950 dark:text-rose-200">
                    {currentClause.proposed}
                  </p>
                </div>
              </div>

              {/* AI Risk Analysis & Legal Playbook Recommendation */}
              <div
                className="p-4 rounded-xl border space-y-3"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Legal Risk Impact Analysis</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed">{currentClause.riskExplanation}</p>

                <div className="pt-2 border-t flex items-start gap-2" >
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold">Playbook Recommendation:</span>
                    <p className="text-xs opacity-75 mt-0.5">{currentClause.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* E-Signature Modal */}
      <AnimatePresence>
        {isSignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#0d1117" : "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold">Contract E-Signature & Attestation</h3>
                </div>
                <button onClick={() => setIsSignModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs opacity-70">
                Execute electronic signatures using FIPS-compliant cryptographic verification. All signers must
                complete identity verification before closing.
              </p>

              <div className="space-y-3">
                {[
                  { name: "Legal Counsel (Acme Corp)", role: "Counterparty Counsel", email: "counsel@acmecorp.com" },
                  { name: "VP Engineering (Nexore Technologies)", role: "Internal Signer", email: "vp@nexore.dev" },
                ].map((signer) => {
                  const isSigned = signedParties.includes(signer.name);
                  return (
                    <div
                      key={signer.name}
                      className="p-3 rounded-xl border flex items-center justify-between"
                      
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{signer.name}</span>
                          {isSigned && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-500">
                              Signed
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] opacity-60">{signer.role} \u2022 {signer.email}</p>
                      </div>

                      {!isSigned ? (
                        <button
                          onClick={() => handleSignContract(signer.name)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                          
                        >
                          Sign Now
                        </button>
                      ) : (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsSignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-orbitalx-mission.ts
var templateOrbitalxMission = {
  name: "template-orbitalx-mission",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-orbitalx-mission.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Satellite,
  Radio,
  Compass,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  X,
  Sliders,
  Shield,
  Clock,
  Terminal,
  ChevronRight,
  Globe,
  Sun,
  Flame,
  BatteryCharging,
  Send,
  Lock,
} from "lucide-react";

export interface OrbitalXTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function OrbitalXTemplate({
  brandName = "OrbitalX Operations",
  theme = "dark",
}: OrbitalXTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [selectedSat, setSelectedSat] = useState(0);
  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
  const [isCommandArmLocked, setIsCommandArmLocked] = useState(true);
  const [missionToast, setMissionToast] = useState<string | null>(null);

  const satellites = [
    {
      norad: "ORB-58210",
      name: "AstraConstellation-07",
      orbit: "LEO 545 km \u2022 97.4\xB0 Inclination",
      status: "NOMINAL",
      velocity: "7.58 km/s",
      apogee: "552 km",
      perigee: "538 km",
      propellant: "78.4% Hydrazine",
      solarGen: "1,420 W",
      batteryState: "94% (Charging)",
      thermal: "+18.2 \xB0C (Radiator B)",
      gyroRate: "0.002 \xB0/s (Zero-G Hold)",
      nextPass: "Svalbard Ground Station (04m 12s)",
      downlinkRate: "450 Mbps (Ka-Band)",
    },
    {
      norad: "ORB-58211",
      name: "AstraConstellation-08",
      orbit: "LEO 550 km \u2022 97.4\xB0 Inclination",
      status: "ATTITUDE_TRIM",
      velocity: "7.57 km/s",
      apogee: "560 km",
      perigee: "542 km",
      propellant: "64.1% Hydrazine",
      solarGen: "1,390 W",
      batteryState: "88% (Discharging)",
      thermal: "+22.4 \xB0C (Radiator A)",
      gyroRate: "0.014 \xB0/s (Trimming)",
      nextPass: "Troll Research Station (12m 45s)",
      downlinkRate: "320 Mbps (X-Band)",
    },
    {
      norad: "ORB-58212",
      name: "AstraConstellation-09",
      orbit: "LEO 540 km \u2022 97.4\xB0 Inclination",
      status: "NOMINAL",
      velocity: "7.59 km/s",
      apogee: "548 km",
      perigee: "532 km",
      propellant: "92.0% Hydrazine",
      solarGen: "1,450 W",
      batteryState: "98% (Float)",
      thermal: "+15.9 \xB0C (Radiator B)",
      gyroRate: "0.001 \xB0/s (Locked)",
      nextPass: "Punta Arenas Station (29m 10s)",
      downlinkRate: "500 Mbps (Ka-Band)",
    },
  ];

  const currentSat = satellites[selectedSat];

  const handleExecuteCommand = (cmdName: string) => {
    setIsCommandModalOpen(false);
    setIsCommandArmLocked(true);
    setMissionToast(\`Telecommand Uplink Staged: [\${cmdName}] broadcast to \${currentSat.name}\`);
    setTimeout(() => setMissionToast(null), 4000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(9, 12, 19, 0.9)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Satellite className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">OrbitalX Operations</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(59, 130, 246, 0.12)",
                    color: "#6366f1",
                  }}
                >
                  Aerospace
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">
                LEO Flight Dynamics & Ground Station Telemetry Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
              
            >
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Svalbard AOS in 04:12</span>
            </div>

            <button
              onClick={() => setIsCommandModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              
            >
              <Send className="w-3.5 h-3.5" />
              <span>Uplink Command</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {missionToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-mono"
              style={{
                backgroundColor: isDark ? "rgba(59, 130, 246, 0.12)" : "#eff6ff",
                borderColor: "rgba(59, 130, 246, 0.3)",
                color: "#3b82f6",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>{missionToast}</span>
              </div>
              <button onClick={() => setMissionToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Constellation Sat Selector Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {satellites.map((sat, i) => {
            const isSelected = selectedSat === i;
            return (
              <button
                key={sat.norad}
                onClick={() => setSelectedSat(i)}
                className="p-4 rounded-2xl border text-left transition-all relative overflow-hidden"
                style={{
                  backgroundColor: isSelected ? "#12141c" : "transparent",
                  borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    
                  />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-bold opacity-60">{sat.norad}</span>
                  <span
                    className={\`text-[9px] font-bold px-2 py-0.5 rounded-full \${
                      sat.status === "NOMINAL"
                        ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                        : "bg-amber-500/15 text-amber-500 border border-amber-500/20"
                    }\`}
                  >
                    {sat.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold tracking-tight">{sat.name}</h3>
                <p className="text-[11px] opacity-60 mt-1">{sat.orbit}</p>
              </button>
            );
          })}
        </div>

        {/* Tactical Telemetry Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Orbital Physics & Flight State (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-6"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div>
                  <span className="text-xs font-mono opacity-60">FLIGHT DYNAMICS</span>
                  <h3 className="text-base font-bold tracking-tight">{currentSat.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-emerald-500">REALTIME TELEMETRY</span>
                </div>
              </div>

              {/* Orbital Arc Simulation Display */}
              <div
                className="p-4 rounded-xl border relative overflow-hidden flex flex-col justify-between h-48"
                style={{
                  backgroundColor: isDark ? "#060a12" : "#0f172a",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                }}
              >
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono opacity-70 tracking-wider">
                    {"GROUND TRACK // SUB-SATELLITE POSITION"}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">LAT 78.22\xB0 N \u2022 LON 15.65\xB0 E</span>
                </div>

                {/* SVG Visual Track */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 600 200">
                    <path
                      d="M 20,160 Q 200,20 400,100 T 580,40"
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.8)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                    <circle cx="340" cy="80" r="6" fill="#3b82f6" />
                    <circle cx="340" cy="80" r="14" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-2 z-10 pt-4 border-t border-white/10 font-mono text-xs">
                  <div>
                    <div className="text-[10px] opacity-60">ORBITAL VELOCITY</div>
                    <div className="font-bold text-sm text-cyan-400">{currentSat.velocity}</div>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-60">APOGEE / PERIGEE</div>
                    <div className="font-bold text-sm text-emerald-400">
                      {currentSat.apogee} / {currentSat.perigee}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-60">DOWNLINK CARRIER</div>
                    <div className="font-bold text-sm text-indigo-300">{currentSat.downlinkRate}</div>
                  </div>
                </div>
              </div>

              {/* Subsystem Health Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  className="p-3 rounded-xl border space-y-1"
                  
                >
                  <div className="flex items-center gap-1.5 text-[10px] opacity-60 font-semibold">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>SOLAR POWER</span>
                  </div>
                  <div className="text-sm font-mono font-bold">{currentSat.solarGen}</div>
                  <div className="text-[10px] text-emerald-500">Both Wings Deployed</div>
                </div>

                <div
                  className="p-3 rounded-xl border space-y-1"
                  
                >
                  <div className="flex items-center gap-1.5 text-[10px] opacity-60 font-semibold">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                    <span>STORAGE</span>
                  </div>
                  <div className="text-sm font-mono font-bold">{currentSat.batteryState}</div>
                  <div className="text-[10px] opacity-60">Li-Ion 48V Bus</div>
                </div>

                <div
                  className="p-3 rounded-xl border space-y-1"
                  
                >
                  <div className="flex items-center gap-1.5 text-[10px] opacity-60 font-semibold">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>PROPULSION</span>
                  </div>
                  <div className="text-sm font-mono font-bold">{currentSat.propellant}</div>
                  <div className="text-[10px] opacity-60">Delta-V: 184 m/s</div>
                </div>

                <div
                  className="p-3 rounded-xl border space-y-1"
                  
                >
                  <div className="flex items-center gap-1.5 text-[10px] opacity-60 font-semibold">
                    <Compass className="w-3.5 h-3.5 text-indigo-500" />
                    <span>ATTITUDE GYRO</span>
                  </div>
                  <div className="text-sm font-mono font-bold">{currentSat.gyroRate}</div>
                  <div className="text-[10px] text-emerald-500">3-Axis Stabilized</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ground Station Pass & Telemetry Log (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-5"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Ground Station Acquisition
                </span>
                <span className="text-xs font-mono text-emerald-500">TRACKING PASS #4012</span>
              </div>

              <div className="p-4 rounded-xl border space-y-2" >
                <div className="text-xs font-bold">{currentSat.nextPass}</div>
                <div className="flex items-center justify-between text-[11px] opacity-70">
                  <span>Elevation Peak: 74.2\xB0</span>
                  <span>Duration: 09m 40s</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 w-3/4" />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-2">
                  Telemetry Event Log
                </span>
                <div className="space-y-2 font-mono text-[11px]">
                  {[
                    { t: "16:04:12Z", ev: "Star Tracker #2 autonomously aligned to guide stars", ok: true },
                    { t: "16:02:40Z", ev: "Heater Circuit B engaged: battery temp maintained at 18.2\xB0C", ok: true },
                    { t: "15:58:19Z", ev: "Ka-Band Transponder downlink handshake confirmed", ok: true },
                    { t: "15:44:00Z", ev: "Periodic reaction wheel desaturation scheduled", ok: false },
                  ].map((log, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg border flex items-start justify-between gap-2"
                      style={{
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                        borderColor: "rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <span className="opacity-50 shrink-0">{log.t}</span>
                      <span className="flex-1 opacity-80">{log.ev}</span>
                      <span className={log.ok ? "text-emerald-500" : "text-amber-500"}>\u25CF</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Uplink Command Modal */}
      <AnimatePresence>
        {isCommandModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#080c14" : "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-bold">Staged Telecommand Uplink</h3>
                </div>
                <button onClick={() => setIsCommandModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs opacity-70">
                Target: <span className="font-mono font-bold text-blue-500">{currentSat.name}</span>. Telecommands
                require dual operator arming key verification prior to RF modulation.
              </p>

              {/* Arming Lock Slider */}
              <div
                className="p-3 rounded-xl border flex items-center justify-between text-xs"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#f8fafc",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Lock className={\`w-4 h-4 \${isCommandArmLocked ? "text-amber-500" : "text-emerald-500"}\`} />
                  <span className="font-semibold">
                    {isCommandArmLocked ? "Safety Interlock Armed (Locked)" : "Safety Interlock Bypassed"}
                  </span>
                </div>
                <button
                  onClick={() => setIsCommandArmLocked(!isCommandArmLocked)}
                  className="px-2.5 py-1 rounded text-[11px] font-bold border"
                  
                >
                  {isCommandArmLocked ? "Disarm Interlock" : "Engage Lock"}
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: "EXEC_PAYLOAD_DIAGNOSTICS", desc: "Run spectral sensor baseline self-test" },
                  { name: "REORIENT_NADIR_POINTING", desc: "Slew reaction wheels to earth-center lock" },
                  { name: "TRIM_DELTA_V_BURN_0.2S", desc: "Fire monopropellant thrusters for 200ms" },
                ].map((cmd) => (
                  <button
                    key={cmd.name}
                    disabled={isCommandArmLocked}
                    onClick={() => handleExecuteCommand(cmd.name)}
                    className={\`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between \${
                      isCommandArmLocked
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-blue-500 hover:bg-blue-500/5 cursor-pointer"
                    }\`}
                    
                  >
                    <div>
                      <div className="font-mono text-xs font-bold">{cmd.name}</div>
                      <div className="text-[11px] opacity-60">{cmd.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsCommandModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-cineboard-studio.ts
var templateCineboardStudio = {
  name: "template-cineboard-studio",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-cineboard-studio.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clapperboard,
  Film,
  Camera,
  Layers,
  Sliders,
  CheckCircle2,
  X,
  Sparkles,
  Video,
  Aperture,
  Maximize2,
  Clock,
  Calendar,
  PackageCheck,
  ChevronRight,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";

export interface CineBoardTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function CineBoardTemplate({
  brandName = "CineBoard Studio",
  theme = "dark",
}: CineBoardTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [selectedShot, setSelectedShot] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<"2.39:1" | "16:9" | "4:3">("2.39:1");
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);
  const [gearManifestToast, setGearManifestToast] = useState<string | null>(null);

  const shots = [
    {
      scene: "SCENE 14A",
      shotNumber: "SHOT 01",
      type: "EXT. DESERT HIGHWAY - DUSK",
      framing: "Extreme Wide Shot (EWS)",
      movement: "Slow Drone Push-In (3.2m/s)",
      lens: "Cooke Anamorphic /i Full Frame Plus 40mm T2.3",
      lighting: "Golden Hour Natural Ambient + 12kW HMI Bounce",
      sound: "Low wind rustle, distant vehicle rumble",
      scriptNote: "The lone vintage interceptor vehicle idles on asphalt heat mirage as sodium street lamps buzz to life.",
      colorGrade: "Kodak 5219 500T Stock Emulation",
      duration: "00:08",
    },
    {
      scene: "SCENE 14A",
      shotNumber: "SHOT 02",
      type: "INT. CABIN - DUSK",
      framing: "Tight Close-Up (TCU)",
      movement: "Handheld Micro-Shake (Character Breath)",
      lens: "ARRI Master Prime 85mm T1.3",
      lighting: "Dashboard LED phosphor glow + warm sodium side rim",
      sound: "Heavy analog radio static, ignition click",
      scriptNote: "Elena's knuckles tighten on the leather steering wheel. Eyes dart toward rearview mirror.",
      colorGrade: "Deep Amber Cyan Split Tone",
      duration: "00:05",
    },
    {
      scene: "SCENE 14B",
      shotNumber: "SHOT 03",
      type: "EXT. ABANDONED MOTEL - NIGHT",
      framing: "Medium Two-Shot (M2S)",
      movement: "Dolly Track Left to Right (Circular)",
      lens: "Zeiss Supreme Prime 29mm T1.5",
      lighting: "Flickering neon red tube + cold moonlight backlight",
      sound: "Neon ballast hum, dripping rain gutter",
      scriptNote: "Both operatives exchange encrypted satellite drive under buzzing vacancy sign.",
      colorGrade: "High Contrast Neo-Noir Bleach Bypass",
      duration: "00:12",
    },
  ];

  const currentShot = shots[selectedShot];

  const handleCheckoutPackage = () => {
    setIsGearModalOpen(false);
    setGearManifestToast("Production Gear Manifest submitted to Camera Rental House!");
    setTimeout(() => setGearManifestToast(null), 4000);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(12, 10, 16, 0.88)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Clapperboard className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">CineBoard Studio</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(244, 63, 94, 0.12)",
                    color: "#6366f1",
                  }}
                >
                  Film & Media
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">
                Feature Pre-Production & Visual Storyboard Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Aspect Ratio Selector */}
            <div
              className="flex items-center gap-1 p-1 rounded-lg border text-xs"
              
            >
              {(["2.39:1", "16:9", "4:3"] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={\`px-2 py-1 rounded text-[10px] font-bold font-mono transition-all \${
                    aspectRatio === ratio
                      ? "bg-rose-500 text-white shadow-sm"
                      : "opacity-60 hover:opacity-100"
                  }\`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsGearModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Camera Package</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {gearManifestToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(244, 63, 94, 0.12)" : "#fff1f2",
                borderColor: "rgba(244, 63, 94, 0.3)",
                color: "#e11d48",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                <span>{gearManifestToast}</span>
              </div>
              <button onClick={() => setGearManifestToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Storyboard Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shots.map((shot, idx) => {
            const isSelected = selectedShot === idx;
            return (
              <button
                key={shot.shotNumber}
                onClick={() => setSelectedShot(idx)}
                className="rounded-2xl border text-left overflow-hidden transition-all relative flex flex-col justify-between"
                style={{
                  backgroundColor: "#12141c",
                  borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Visual Viewport Simulation */}
                <div
                  className="w-full p-4 flex flex-col justify-between relative overflow-hidden transition-all"
                  style={{
                    backgroundColor: isDark ? "#09060b" : "#18181b",
                    color: "#ffffff",
                    aspectRatio: aspectRatio === "2.39:1" ? "21/9" : aspectRatio === "16:9" ? "16/9" : "4/3",
                  }}
                >
                  {/* Framing Reticle */}
                  <div className="absolute inset-2 border border-white/20 rounded pointer-events-none flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white/40" />
                  </div>

                  <div className="flex items-center justify-between z-10 text-[10px] font-mono">
                    <span className="bg-rose-600 px-1.5 py-0.5 rounded font-bold text-white">
                      {shot.shotNumber}
                    </span>
                    <span className="opacity-70">{shot.duration}</span>
                  </div>

                  <div className="z-10 text-left">
                    <div className="text-[10px] font-mono text-rose-400 font-semibold">{shot.scene}</div>
                    <div className="text-xs font-bold text-white line-clamp-1">{shot.framing}</div>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold opacity-80 line-clamp-1">{shot.type}</span>
                    <span className="opacity-60 text-[10px] font-mono">{aspectRatio}</span>
                  </div>
                  <p className="text-[11px] opacity-60 line-clamp-1">{shot.scriptNote}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Shot Technical Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Director & DP Specifications (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-6"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-rose-500">
                      {currentShot.scene} {"//"} {currentShot.shotNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 font-mono">
                      TARGET: {currentShot.duration}
                    </span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight">{currentShot.type}</h3>
                </div>

                <span className="text-xs font-mono font-bold opacity-60">{currentShot.framing}</span>
              </div>

              {/* Script Breakdown & Director Notes */}
              <div
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 block">
                  Action & Director Blocking Notes
                </span>
                <p className="text-xs leading-relaxed italic opacity-85">"{currentShot.scriptNote}"</p>
              </div>

              {/* Technical Camera & Optics Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div
                  className="p-3.5 rounded-xl border space-y-1"
                  
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold opacity-60">
                    <Aperture className="w-3.5 h-3.5 text-rose-500" />
                    <span>LENS & FOCAL LENGTH</span>
                  </div>
                  <div className="font-semibold text-xs">{currentShot.lens}</div>
                </div>

                <div
                  className="p-3.5 rounded-xl border space-y-1"
                  
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold opacity-60">
                    <Video className="w-3.5 h-3.5 text-indigo-500" />
                    <span>CAMERA MOVEMENT</span>
                  </div>
                  <div className="font-semibold text-xs">{currentShot.movement}</div>
                </div>

                <div
                  className="p-3.5 rounded-xl border space-y-1"
                  
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold opacity-60">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>LIGHTING & GAFFER DESIGN</span>
                  </div>
                  <div className="font-semibold text-xs">{currentShot.lighting}</div>
                </div>

                <div
                  className="p-3.5 rounded-xl border space-y-1"
                  
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold opacity-60">
                    <Film className="w-3.5 h-3.5 text-emerald-500" />
                    <span>COLOR PALETTE & EMULATION</span>
                  </div>
                  <div className="font-semibold text-xs">{currentShot.colorGrade}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stripboard Production Schedule (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-5"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Call Sheet Stripboard
                </span>
                <span className="text-xs font-mono text-rose-500 font-bold">DAY 03 OF 18</span>
              </div>

              <div className="space-y-2">
                {[
                  { strip: "14A", loc: "EXT. HIGHWAY DUSK", pages: "1 2/8", cast: "ELENA, MARK", time: "18:30 - 20:15", type: "EXT_NIGHT" },
                  { strip: "14B", loc: "INT. SEDAN CABIN", pages: "6/8", cast: "ELENA", time: "20:30 - 22:00", type: "INT_NIGHT" },
                  { strip: "15", loc: "EXT. NEON MOTEL", pages: "2 1/8", cast: "ELENA, OPERATIVE", time: "22:45 - 02:00", type: "EXT_NIGHT" },
                ].map((strip) => (
                  <div
                    key={strip.strip}
                    className="p-3 rounded-xl border text-xs flex items-center justify-between"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold bg-rose-500/20 text-rose-600 px-1.5 py-0.5 rounded text-[10px]">
                          SCENE {strip.strip}
                        </span>
                        <span className="font-bold">{strip.loc}</span>
                      </div>
                      <div className="text-[11px] opacity-60 mt-1">
                        Cast: {strip.cast} \u2022 Pages: {strip.pages}
                      </div>
                    </div>
                    <div className="text-right text-[10px] font-mono opacity-75">{strip.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Camera Package Rental Modal */}
      <AnimatePresence>
        {isGearModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#0d0912" : "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-bold">Rental Package Manifest</h3>
                </div>
                <button onClick={() => setIsGearModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs opacity-70">
                Equipment assigned to Principal Photography Unit A. Insured by Lloyd\u2019s Production Binder #941.
              </p>

              <div className="space-y-2 text-xs">
                {[
                  { item: "ARRI Alexa 35 Camera Body (LPL Mount)", status: "Reserved", serial: "SN-9421" },
                  { item: "Cooke Anamorphic /i Full Frame 5-Lens Set", status: "Reserved", serial: "SN-3081" },
                  { item: "Teradek Bolt 4K 1500 TX/RX Wireless Video", status: "Checked Out", serial: "SN-7712" },
                  { item: "SmallHD Cine 13\u201D 4K High-Bright Monitor", status: "Reserved", serial: "SN-5520" },
                ].map((gear) => (
                  <div
                    key={gear.item}
                    className="p-3 rounded-xl border flex items-center justify-between"
                    
                  >
                    <div>
                      <div className="font-semibold">{gear.item}</div>
                      <div className="text-[10px] font-mono opacity-50">{gear.serial}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-500">
                      {gear.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsGearModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckoutPackage}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  
                >
                  Confirm Reservation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-domus-living.ts
var templateDomusLiving = {
  name: "template-domus-living",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-domus-living.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Sun,
  Moon,
  Wind,
  Thermometer,
  Zap,
  Shield,
  ShieldCheck,
  CheckCircle2,
  X,
  Sliders,
  Sparkles,
  Lock,
  Unlock,
  Tv,
  Coffee,
  Volume2,
  ChevronRight,
  Battery,
  Lightbulb,
} from "lucide-react";

export interface DomusLivingTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function DomusLivingTemplate({
  brandName = "Domus Living",
  theme = "dark",
}: DomusLivingTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [targetTemp, setTargetTemp] = useState(21.5);
  const [activeScene, setActiveScene] = useState<string>("Cinema Lounge");
  const [isPerimeterArmed, setIsPerimeterArmed] = useState(true);
  const [ambientToast, setAmbientToast] = useState<string | null>(null);

  const rooms = [
    {
      name: "Living Pavilion",
      temp: "21.5\xB0C",
      humidity: "46%",
      aqi: "12 (Clean)",
      lightsOn: 4,
      totalLights: 6,
      music: "Miles Davis - Kind of Blue",
      energyNow: "1.4 kW",
    },
    {
      name: "Master Suite",
      temp: "19.0\xB0C",
      humidity: "50%",
      aqi: "8 (Pure)",
      lightsOn: 1,
      totalLights: 4,
      music: "Ambient Rain Frequencies",
      energyNow: "0.6 kW",
    },
    {
      name: "Kitchen & Dining",
      temp: "22.0\xB0C",
      humidity: "42%",
      aqi: "18 (Good)",
      lightsOn: 5,
      totalLights: 5,
      music: "Morning Acoustic Jazz",
      energyNow: "2.1 kW",
    },
    {
      name: "Wellness & Spa",
      temp: "24.0\xB0C",
      humidity: "65%",
      aqi: "10 (Clean)",
      lightsOn: 2,
      totalLights: 3,
      music: "Sound Bath Solfeggio 528Hz",
      energyNow: "3.2 kW",
    },
  ];

  const currentRoom = rooms[selectedRoom];

  const handleSceneTrigger = (sceneName: string) => {
    setActiveScene(sceneName);
    setAmbientToast(\`Ambient Scene Activated: [\${sceneName}] throughout \${currentRoom.name}\`);
    setTimeout(() => setAmbientToast(null), 3500);
  };

  const handleToggleSecurity = () => {
    const nextState = !isPerimeterArmed;
    setIsPerimeterArmed(nextState);
    setAmbientToast(
      nextState ? "Home Perimeter Armed \u2022 Smart Locks Engaged" : "Home Perimeter Disarmed \u2022 Guest Access Enabled"
    );
    setTimeout(() => setAmbientToast(null), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Top Navigation */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(10, 14, 12, 0.88)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Home className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Domus Living</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.12)",
                    color: "#6366f1",
                  }}
                >
                  Smart Home
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">
                Whole-Home Ambient Intelligence & Climate Ecosystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSecurity}
              className={\`px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all active:scale-95 \${
                isPerimeterArmed ? "bg-emerald-600 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-foreground"
              }\`}
            >
              {isPerimeterArmed ? <ShieldCheck className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isPerimeterArmed ? "Perimeter Armed" : "Disarmed"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {ambientToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.12)" : "#ecfdf5",
                borderColor: "rgba(16, 185, 129, 0.3)",
                color: "#10b981",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{ambientToast}</span>
              </div>
              <button onClick={() => setAmbientToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Room Navigation Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {rooms.map((room, idx) => {
            const isSelected = selectedRoom === idx;
            return (
              <button
                key={room.name}
                onClick={() => setSelectedRoom(idx)}
                className="p-4 rounded-2xl border text-left transition-all relative overflow-hidden"
                style={{
                  backgroundColor: isSelected ? "#12141c" : "transparent",
                  borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    
                  />
                )}
                <div className="text-xs font-bold">{room.name}</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-black">{room.temp}</span>
                  <span className="text-[10px] opacity-60">RH {room.humidity}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] opacity-60 mt-1">
                  <span>{room.lightsOn} lights on</span>
                  <span>\u2022</span>
                  <span>{room.energyNow}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tactical Room Command Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Climate & Ambience (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-6"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div>
                  <span className="text-xs font-mono opacity-60">MICROCLIMATE CONTROL</span>
                  <h3 className="text-base font-bold tracking-tight">{currentRoom.name}</h3>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-bold">HVAC INVERTER ECO</span>
              </div>

              {/* Tactile Temp Dial Card */}
              <div
                className="p-6 rounded-2xl border text-center space-y-4 relative overflow-hidden"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="text-xs font-semibold opacity-60 uppercase tracking-wider">
                  Target Ambient Setpoint
                </div>

                <div className="text-5xl font-black tracking-tight" >
                  {targetTemp.toFixed(1)}\xB0C
                </div>

                <div className="max-w-xs mx-auto space-y-2">
                  <input
                    type="range"
                    min="18.0"
                    max="26.0"
                    step="0.5"
                    value={targetTemp}
                    onChange={(e) => setTargetTemp(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono opacity-50">
                    <span>18.0\xB0C (Cool)</span>
                    <span>22.0\xB0C (Comfort)</span>
                    <span>26.0\xB0C (Warm)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs font-medium" >
                  <div>
                    <div className="text-[10px] opacity-50">AIR QUALITY</div>
                    <div className="font-bold text-emerald-500">{currentRoom.aqi}</div>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-50">RELATIVE HUMIDITY</div>
                    <div className="font-bold">{currentRoom.humidity}</div>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-50">AIR RECIRCULATION</div>
                    <div className="font-bold">HEPA H13 Active</div>
                  </div>
                </div>
              </div>

              {/* Ambient Preset Scene Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">
                  Quick Ambient Scenes
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { name: "Cinema Lounge", icon: Tv, desc: "Dim 15% \u2022 Warm 2700K" },
                    { name: "Focus & Code", icon: Sparkles, desc: "Cool 4000K \u2022 100%" },
                    { name: "Morning Sunrise", icon: Sun, desc: "Gradual Circadian" },
                    { name: "Deep Rest", icon: Moon, desc: "Sleep Audio \u2022 0% Lux" },
                  ].map((sc) => {
                    const isActive = activeScene === sc.name;
                    const Icon = sc.icon;
                    return (
                      <button
                        key={sc.name}
                        onClick={() => handleSceneTrigger(sc.name)}
                        className={\`p-3 rounded-xl border text-left transition-all \${
                          isActive
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-transparent hover:border-black/10 dark:hover:border-white/10"
                        }\`}
                        style={{
                          backgroundColor: isActive ? undefined : "#12141c",
                          borderColor: isActive ? undefined : "rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <Icon className="w-4 h-4 mb-1.5" />
                        <div className="text-xs font-bold">{sc.name}</div>
                        <div className="text-[10px] opacity-60 mt-0.5">{sc.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Energy Grid & Whole-House Telemetry (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-5"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Microgrid & Power Flow
                </span>
                <span className="text-xs font-mono text-emerald-500 font-bold">100% SELF-POWERED</span>
              </div>

              {/* Energy Grid Flow Tiles */}
              <div className="space-y-3">
                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  
                >
                  <div className="flex items-center gap-2.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="text-xs font-bold">Rooftop Solar Array</div>
                      <div className="text-[10px] opacity-60">12.4 kW peak output</div>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold text-amber-500">+7.8 kW</span>
                </div>

                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  
                >
                  <div className="flex items-center gap-2.5">
                    <Battery className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="text-xs font-bold">Lithium Powerwall Pack</div>
                      <div className="text-[10px] opacity-60">28.4 kWh \u2022 94% State of Charge</div>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-500">Storing 4.1 kW</span>
                </div>

                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-indigo-500" />
                    <div>
                      <div className="text-xs font-bold">Municipal Utility Grid</div>
                      <div className="text-[10px] opacity-60">Zero import \u2022 Net Exporting</div>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold text-indigo-500">-3.7 kW (Feed-in)</span>
                </div>
              </div>

              {/* Current Ambient Audio Player */}
              <div
                className="p-3.5 rounded-xl border space-y-2"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold">Multi-Zone Architectural Audio</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500">Lossless 24-bit</span>
                </div>
                <p className="text-xs opacity-80 line-clamp-1">Playing: {currentRoom.music}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`
};

// src/registry/template-hyperion-ev.ts
var templateHyperionEv = {
  name: "template-hyperion-ev",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-hyperion-ev.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  BatteryCharging,
  Zap,
  Gauge,
  Sliders,
  CheckCircle2,
  X,
  Sparkles,
  Shield,
  Activity,
  Navigation,
  Thermometer,
  Clock,
  ChevronRight,
  TrendingUp,
  Cpu,
  Power,
} from "lucide-react";

export interface HyperionEvTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function HyperionEvTemplate({
  brandName = "Hyperion Fleet EV",
  theme = "dark",
}: HyperionEvTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  const [payloadKg, setPayloadKg] = useState(1200);
  const [ambientTempC, setAmbientTempC] = useState(20);
  const [isChargingModalOpen, setIsChargingModalOpen] = useState(false);
  const [activeChargingBays, setActiveChargingBays] = useState<number[]>([1, 2]);
  const [fleetToast, setFleetToast] = useState<string | null>(null);

  const vehicles = [
    {
      vin: "HYP-EV-8041",
      model: "Hyperion Freight Hauler Max",
      plate: "CA-941-EV",
      soc: 74,
      rangeKm: 420,
      baseMaxRange: 550,
      batteryHealth: "98.2% SoH",
      consumption: "88 kWh/100km",
      tpmsPsi: [110, 110, 108, 109],
      status: "DEPOT_IDLE",
      driver: "Marcus Vance",
      currentBay: "Bay 01 (Plugged)",
    },
    {
      vin: "HYP-EV-8042",
      model: "Veloce Urban Delivery Van",
      plate: "CA-228-EV",
      soc: 38,
      rangeKm: 165,
      baseMaxRange: 380,
      batteryHealth: "97.4% SoH",
      consumption: "32 kWh/100km",
      tpmsPsi: [45, 45, 44, 45],
      status: "FAST_CHARGING",
      driver: "Elena Rostova",
      currentBay: "Bay 02 (350kW CCS)",
    },
    {
      vin: "HYP-EV-8043",
      model: "AeroPulse Autonomous Shuttle",
      plate: "CA-770-EV",
      soc: 91,
      rangeKm: 480,
      baseMaxRange: 520,
      batteryHealth: "99.1% SoH",
      consumption: "28 kWh/100km",
      tpmsPsi: [42, 42, 42, 41],
      status: "ROUTE_ACTIVE",
      driver: "AI Autopilot L4",
      currentBay: "En Route Metro Loop",
    },
  ];

  const currentVehicle = vehicles[selectedVehicleIndex];

  // Estimated range computation based on payload and ambient temperature
  const estimatedRange = Math.round(
    currentVehicle.baseMaxRange *
      (currentVehicle.soc / 100) *
      (1 - payloadKg / 10000) *
      (ambientTempC < 0 ? 0.8 : ambientTempC > 35 ? 0.88 : 1.0)
  );

  const handleToggleChargeBay = (bayNumber: number) => {
    if (activeChargingBays.includes(bayNumber)) {
      setActiveChargingBays(activeChargingBays.filter((b) => b !== bayNumber));
      setFleetToast(\`Depot Bay 0\${bayNumber}: Charging session stopped & disengaged.\`);
    } else {
      setActiveChargingBays([...activeChargingBays, bayNumber]);
      setFleetToast(\`Depot Bay 0\${bayNumber}: 350kW DC Fast Charge session started!\`);
    }
    setTimeout(() => setFleetToast(null), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(8, 12, 18, 0.88)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Car className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Hyperion Fleet EV</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(14, 165, 233, 0.12)",
                    color: "#6366f1",
                  }}
                >
                  Automotive
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">
                Commercial EV Battery Telemetry & 350kW Depot Charging Station
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
              
            >
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              <span>Depot Grid: 480 kW Peak</span>
            </div>

            <button
              onClick={() => setIsChargingModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>Charger Matrix</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {fleetToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(6, 182, 212, 0.12)" : "#ecfeff",
                borderColor: "rgba(6, 182, 212, 0.3)",
                color: "#0891b2",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                <span>{fleetToast}</span>
              </div>
              <button onClick={() => setFleetToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vehicle Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {vehicles.map((veh, idx) => {
            const isSelected = selectedVehicleIndex === idx;
            return (
              <button
                key={veh.vin}
                onClick={() => setSelectedVehicleIndex(idx)}
                className="p-4 rounded-2xl border text-left transition-all relative overflow-hidden"
                style={{
                  backgroundColor: isSelected ? "#12141c" : "transparent",
                  borderColor: isSelected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    
                  />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-bold opacity-60">{veh.plate}</span>
                  <span
                    className={\`text-[9px] font-bold px-2 py-0.5 rounded-full \${
                      veh.status === "FAST_CHARGING"
                        ? "bg-cyan-500/15 text-cyan-500 border border-cyan-500/20"
                        : veh.status === "ROUTE_ACTIVE"
                        ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                        : "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20"
                    }\`}
                  >
                    {veh.status}
                  </span>
                </div>
                <div className="text-sm font-bold tracking-tight">{veh.model}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t text-xs" >
                  <div className="flex items-center gap-1.5 font-bold">
                    <BatteryCharging className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{veh.soc}% SoC</span>
                  </div>
                  <span className="opacity-60">{veh.rangeKm} km est.</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Vehicle Instrument Deck & Range Estimator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Battery State of Charge & Telemetry (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-6"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div>
                  <span className="text-xs font-mono opacity-60">BATTERY MANAGEMENT SYSTEM (BMS)</span>
                  <h3 className="text-base font-bold tracking-tight">{currentVehicle.model}</h3>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-500">{currentVehicle.batteryHealth}</span>
              </div>

              {/* Large SoC Gauge Display */}
              <div
                className="p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs font-semibold opacity-60">CURRENT STATE OF CHARGE</div>
                  <div className="text-4xl font-black text-cyan-500 font-mono">{currentVehicle.soc}%</div>
                  <div className="text-xs opacity-75">Pack Voltage: 780V Architecture</div>
                </div>

                <div className="w-full sm:w-64 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="opacity-60">Usable Capacity</span>
                    <span className="font-bold">210 kWh / 280 kWh</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                      style={{ width: \`\${currentVehicle.soc}%\` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] opacity-50 font-mono">
                    <span>0% (Empty)</span>
                    <span>80% (DC Fast Cap)</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* TPMS Tire Pressure Matrix */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 block mb-2">
                  Tire Pressure Monitoring (TPMS)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {currentVehicle.tpmsPsi.map((psi, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border"
                      
                    >
                      <div className="text-[10px] opacity-50 uppercase">
                        {idx === 0 ? "Front L" : idx === 1 ? "Front R" : idx === 2 ? "Rear L" : "Rear R"}
                      </div>
                      <div className="font-mono font-bold text-sm text-emerald-500 mt-0.5">{psi} PSI</div>
                      <div className="text-[9px] opacity-50">Nominal 45\xB0C</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver & Assignment */}
              <div className="p-3.5 rounded-xl border flex items-center justify-between text-xs" >
                <div>
                  <div className="font-bold">Assigned Operator: {currentVehicle.driver}</div>
                  <div className="text-[11px] opacity-60">Status: {currentVehicle.currentBay}</div>
                </div>
                <span className="font-mono font-bold opacity-75">{currentVehicle.consumption}</span>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Route Range Estimator (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-5"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Payload & Weather Range Engine
                </span>
                <Navigation className="w-4 h-4 text-cyan-500" />
              </div>

              {/* Calculated Range Pill */}
              <div
                className="p-4 rounded-xl border text-center space-y-1"
                style={{
                  backgroundColor: isDark ? "rgba(6, 182, 212, 0.08)" : "#ecfeff",
                  borderColor: "rgba(6, 182, 212, 0.25)",
                }}
              >
                <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                  DYNAMIC ESTIMATED DRIVING RANGE
                </div>
                <div className="text-3xl font-black text-cyan-500 font-mono">{estimatedRange} km</div>
                <div className="text-[10px] opacity-60">Safe return margin: +45 km reserved</div>
              </div>

              {/* Payload Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">Cargo Payload Weight</span>
                  <span className="font-mono font-bold">{payloadKg} kg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4000"
                  step="100"
                  value={payloadKg}
                  onChange={(e) => setPayloadKg(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">Ambient Temperature</span>
                  <span className="font-mono font-bold">{ambientTempC}\xB0C</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="45"
                  step="1"
                  value={ambientTempC}
                  onChange={(e) => setAmbientTempC(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="text-[10px] opacity-50">
                  Extreme cold or heat automatically recalculates battery pack thermal regulation draw.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Charging Bay Matrix Modal */}
      <AnimatePresence>
        {isChargingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#090d14" : "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-500" />
                  <h3 className="text-sm font-bold">Depot 350kW DC Fast Charger Bays</h3>
                </div>
                <button onClick={() => setIsChargingModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {[1, 2, 3, 4].map((bay) => {
                  const isActive = activeChargingBays.includes(bay);
                  return (
                    <div
                      key={bay}
                      className="p-3 rounded-xl border flex items-center justify-between"
                      
                    >
                      <div>
                        <div className="text-xs font-bold">Bay 0{bay} \u2022 CCS 350kW Liquid-Cooled</div>
                        <div className="text-[10px] opacity-60">
                          {isActive ? "Delivering 280 kW \u2022 680V DC" : "Standby \u2022 Ready for connection"}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleChargeBay(bay)}
                        className={\`px-3 py-1.5 rounded-lg text-xs font-semibold \${
                          isActive ? "bg-rose-500/20 text-rose-500" : "bg-cyan-500 text-white"
                        }\`}
                      >
                        {isActive ? "Stop" : "Engage"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsChargingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-sovereign-auctions.ts
var templateSovereignAuctions = {
  name: "template-sovereign-auctions",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-sovereign-auctions.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel,
  ShieldCheck,
  Clock,
  Sparkles,
  DollarSign,
  ChevronRight,
  Eye,
  CheckCircle2,
  X,
  History,
  FileCheck,
  TrendingUp,
  Award,
  Globe,
  Radio,
} from "lucide-react";

export interface SovereignAuctionsTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function SovereignAuctionsTemplate({
  brandName = "Sovereign Auctions",
  theme = "dark",
}: SovereignAuctionsTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [currentBidUsd, setCurrentBidUsd] = useState(2450000);
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP">("USD");
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [auctionToast, setAuctionToast] = useState<string | null>(null);

  const rates: Record<"USD" | "EUR" | "GBP", { symbol: string; rate: number }> = {
    USD: { symbol: "$", rate: 1.0 },
    EUR: { symbol: "\u20AC", rate: 0.92 },
    GBP: { symbol: "\xA3", rate: 0.78 },
  };

  const formatPrice = (usdAmount: number) => {
    const converted = usdAmount * rates[currency].rate;
    return \`\${rates[currency].symbol}\${converted.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })}\`;
  };

  const handlePlaceBid = (increment: number) => {
    const nextBid = currentBidUsd + increment;
    setCurrentBidUsd(nextBid);
    setAuctionToast(\`Paddle #418 placed leading bid: \${formatPrice(nextBid)}!\`);
    setTimeout(() => setAuctionToast(null), 4000);
  };

  const lot = {
    lotNumber: "LOT 24",
    title: "Composition in Cadmium & Cobalt Resonance",
    artist: "Jean-Michel Vane (b. 1954)",
    medium: "Oil, cold wax, and crushed lapis on Belgian linen",
    dimensions: "195 x 160 cm (76.7 x 63 in)",
    signed: "Signed and dated lower recto 'Vane '88'",
    estimateUsd: "$2,200,000 - $3,000,000",
    provenance: [
      "Galerie Beyeler, Basel (acquired directly from the artist)",
      "Private Collection, Zurich (acquired from the above in 1994)",
      "Exhibited: Centre Pompidou, Paris, 'Lyrical Geometry', 2011",
    ],
    conditionSummary:
      "Original unlined canvas on archival cedar stretcher. Surface impasto crisp under UV inspection. Zero restoration or overpainting detected.",
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(16, 12, 10, 0.88)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Gavel className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Sovereign Auctions</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(217, 119, 6, 0.12)",
                    color: "#6366f1",
                  }}
                >
                  Fine Art
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">
                Evening Sale: Post-War & Contemporary Masterworks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Currency Selector */}
            <div
              className="flex items-center gap-1 p-1 rounded-lg border text-xs"
              
            >
              {(["USD", "EUR", "GBP"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={\`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all \${
                    currency === c ? "bg-amber-600 text-white shadow-sm" : "opacity-60 hover:opacity-100"
                  }\`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsConditionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Condition Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {auctionToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(217, 119, 6, 0.12)" : "#fffbeb",
                borderColor: "rgba(217, 119, 6, 0.3)",
                color: "#d97706",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>{auctionToast}</span>
              </div>
              <button onClick={() => setAuctionToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Lot Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Artwork Stage Canvas & Provenance (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-6"
              
            >
              {/* Artwork Visual Stage */}
              <div
                className="w-full h-80 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 border"
                style={{
                  backgroundColor: isDark ? "#080605" : "#18181b",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                }}
              >
                {/* Simulated Museum Lighting & Texture Canvas */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/30 via-transparent to-blue-900/30 opacity-70 pointer-events-none" />
                <div className="absolute inset-8 border border-white/20 rounded pointer-events-none flex items-center justify-center">
                  <div className="text-center p-6 space-y-2">
                    <span className="text-xs font-serif italic text-amber-300">Jean-Michel Vane (b. 1954)</span>
                    <h2 className="text-xl font-bold tracking-tight text-white max-w-sm">
                      Composition in Cadmium & Cobalt Resonance, 1988
                    </h2>
                    <span className="text-[11px] opacity-75 font-mono">195 x 160 cm \u2022 Belgian Linen</span>
                  </div>
                </div>

                <div className="flex items-center justify-between z-10 text-[10px] font-mono">
                  <span className="bg-amber-600 px-2 py-0.5 rounded font-bold text-white">
                    {lot.lotNumber} \u2022 CURRENT LOT
                  </span>
                  <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-emerald-400">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>LIVE SALEROOM LONDON</span>
                  </div>
                </div>

                <div className="z-10 flex items-center justify-between text-[11px] opacity-80 pt-2 border-t border-white/10">
                  <span>{lot.dimensions}</span>
                  <span className="font-mono">{lot.signed}</span>
                </div>
              </div>

              {/* Artwork Details & Provenance */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">Verified Provenance</h3>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Authenticated by Vane Foundation</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {lot.provenance.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border flex items-start gap-2.5"
                      style={{
                        borderColor: "rgba(255, 255, 255, 0.08)",
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                      }}
                    >
                      <span className="font-mono text-[10px] opacity-50 shrink-0 mt-0.5">0{idx + 1}</span>
                      <span className="opacity-80 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Bidding Terminal (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-6"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div>
                  <span className="text-xs font-mono opacity-60">CURRENT HIGH BID</span>
                  <div className="text-3xl font-black text-amber-500 font-mono tracking-tight mt-0.5">
                    {formatPrice(currentBidUsd)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] opacity-50 block font-mono">ESTIMATE</span>
                  <span className="text-xs font-semibold">{lot.estimateUsd}</span>
                </div>
              </div>

              {/* Paddle Raise Increments */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">
                  Raise Bid (Paddle #418)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[50000, 100000, 200000, 500000].map((inc) => (
                    <button
                      key={inc}
                      onClick={() => handlePlaceBid(inc)}
                      className="p-3 rounded-xl border text-left transition-all hover:border-amber-500 hover:bg-amber-500/10 active:scale-95"
                      
                    >
                      <div className="text-[10px] opacity-60 font-mono">+ {formatPrice(inc)}</div>
                      <div className="text-xs font-bold mt-0.5">{formatPrice(currentBidUsd + inc)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Saleroom Bid Log */}
              <div className="space-y-2 pt-2 border-t" >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider opacity-60">Saleroom Ledger</span>
                  <span className="font-mono text-[10px] text-emerald-500 font-semibold">RESERVE MET</span>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  {[
                    { source: "Online Paddle #418 (You)", amount: formatPrice(currentBidUsd), time: "Just now", leading: true },
                    { source: "Telephone Desk 04 (Tokyo)", amount: formatPrice(currentBidUsd - 50000), time: "32s ago", leading: false },
                    { source: "Saleroom Floor (London)", amount: formatPrice(currentBidUsd - 150000), time: "1m 14s ago", leading: false },
                    { source: "Telephone Desk 12 (New York)", amount: formatPrice(currentBidUsd - 250000), time: "2m 05s ago", leading: false },
                  ].map((entry, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border flex items-center justify-between"
                      style={{
                        backgroundColor: entry.leading ? "rgba(217, 119, 6, 0.1)" : isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                        borderColor: entry.leading ? "rgba(217, 119, 6, 0.3)" : "rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <div>
                        <div className="font-semibold">{entry.source}</div>
                        <div className="text-[10px] opacity-50">{entry.time}</div>
                      </div>
                      <span className={\`font-bold \${entry.leading ? "text-amber-500" : "opacity-80"}\`}>
                        {entry.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Condition Report Modal */}
      <AnimatePresence>
        {isConditionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#100d0a" : "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold">Conservator Condition Report</h3>
                </div>
                <button onClick={() => setIsConditionModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="leading-relaxed opacity-80">{lot.conditionSummary}</p>

                <div
                  className="p-3 rounded-xl border space-y-1.5"
                  
                >
                  <div className="flex justify-between font-semibold">
                    <span>UV Examination</span>
                    <span className="text-emerald-500">Pristine \u2022 No Inpainting</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Tension & Stretcher</span>
                    <span className="text-emerald-500">Original Archival Cedar</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Inspection Date</span>
                    <span className="opacity-75">Aug 28, 2026</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsConditionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  
                >
                  Close Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-scholaris-archive.ts
var templateScholarisArchive = {
  name: "template-scholaris-archive",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-scholaris-archive.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Share2,
  Download,
  Copy,
  CheckCircle2,
  X,
  FileText,
  GitBranch,
  Check,
  ExternalLink,
  Sparkles,
  Award,
  Database,
  Code2,
  ChevronRight,
  Search,
} from "lucide-react";

export interface ScholarisArchiveTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function ScholarisArchiveTemplate({
  brandName = "Scholaris Archive",
  theme = "dark",
}: ScholarisArchiveTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [selectedCitationTab, setSelectedCitationTab] = useState<"DERIVATIVES" | "ANTECEDENTS">("DERIVATIVES");
  const [isBibtexModalOpen, setIsBibtexModalOpen] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [archiveToast, setArchiveToast] = useState<string | null>(null);

  const paper = {
    title: "Sub-Quadratic Attention via Orthogonal State Space Projections in High-Dimensional Manifolds",
    authors: [
      { name: "Dr. Evelyn Zhao", affil: "Stanford AI Lab", orcid: "0000-0002-1825-0098" },
      { name: "Prof. Kenneth Sterling", affil: "MIT CSAIL", orcid: "0000-0001-9942-7711" },
      { name: "Tariq Al-Mansoor", affil: "Max Planck Institute", orcid: "0000-0003-4412-8802" },
    ],
    doi: "10.1038/s41586-026-09214-x",
    published: "August 2026",
    journal: "Journal of Machine Learning & Cognitive Systems (Vol 42, Iss 3)",
    citationsCount: 142,
    downloadsCount: "18.4k",
    reproducibilityScore: "9.8 / 10",
    abstract:
      "Traditional Transformer architectures incur quadratic complexity O(N^2) with respect to context sequence length. In this work, we present OrthoMamba, an orthogonal recurrent operator projecting key-value attention tensors onto isometric Stiefel manifolds. Our formulation proves mathematically equivalent convergence bounds while achieving O(N log N) inference throughput across 1,000,000 token horizons.",
    latexFormula: "\\\\mathcal{L}_{\\\\text{proj}}(Q, K, V) = \\\\arg\\\\min_{W \\\\in \\\\text{St}(d, k)} \\\\| W^T (QK^T) W - V \\\\|_F^2 + \\\\lambda \\\\operatorname{Tr}(W^T W - I)",
  };

  const citations = {
    DERIVATIVES: [
      {
        title: "Long-Horizon Genomics Sequence Modeling with OrthoMamba Kernels",
        authors: "Chen et al., Nature Computational Biology 2026",
        impact: "+48 citations",
        reproduced: true,
      },
      {
        title: "Hardware Accelerators for Non-Euclidean Tensor Attention",
        authors: "Vance & Sato, IEEE Micro 2026",
        impact: "+31 citations",
        reproduced: true,
      },
    ],
    ANTECEDENTS: [
      {
        title: "Structured State Spaces for Sequence Modeling (S4)",
        authors: "Gu et al., ICLR 2022",
        impact: "Foundational S4 Architecture",
        reproduced: true,
      },
      {
        title: "Attention Is All You Need",
        authors: "Vaswani et al., NeurIPS 2017",
        impact: "Transformer Baseline Reference",
        reproduced: true,
      },
    ],
  };

  const bibtexSnippet = \`@article{zhao2026orthomamba,
  title={Sub-Quadratic Attention via Orthogonal State Space Projections},
  author={Zhao, Evelyn and Sterling, Kenneth and Al-Mansoor, Tariq},
  journal={Journal of Machine Learning & Cognitive Systems},
  volume={42},
  number={3},
  pages={114--132},
  year={2026},
  doi={10.1038/s41586-026-09214-x}
}\`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtexSnippet);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const handleDownloadDataset = () => {
    setArchiveToast("Zenodo Dataset Archive (2.4 GB) download started via IPFS mirror!");
    setTimeout(() => setArchiveToast(null), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Top Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(10, 14, 18, 0.88)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Scholaris Archive</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(14, 165, 233, 0.12)",
                    color: "#6366f1",
                  }}
                >
                  Academic Research
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">
                Open-Access Scientific Preprints & Citation Dependency Explorer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBibtexModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cite (BibTeX)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {archiveToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(14, 165, 233, 0.12)" : "#f0f9ff",
                borderColor: "rgba(14, 165, 233, 0.3)",
                color: "#0284c7",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                <span>{archiveToast}</span>
              </div>
              <button onClick={() => setArchiveToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paper Main Header & Abstract */}
        <div
          className="p-6 sm:p-8 rounded-2xl border space-y-6"
          
        >
          {/* Metadata pill badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 font-mono">
              DOI: {paper.doi}
            </span>
            <span className="opacity-60 font-medium">\u2022 {paper.published}</span>
            <span className="opacity-60 font-medium">\u2022 {paper.journal}</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug">
            {paper.title}
          </h1>

          {/* Authors Strip */}
          <div className="flex flex-wrap gap-4 pt-1">
            {paper.authors.map((author) => (
              <div key={author.name} className="text-xs">
                <span className="font-bold block">{author.name}</span>
                <span className="text-[11px] opacity-60">{author.affil}</span>
              </div>
            ))}
          </div>

          {/* Scientific Abstract */}
          <div
            className="p-5 rounded-xl border space-y-3"
            style={{
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
              borderColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">Abstract</span>
            <p className="text-xs sm:text-sm leading-relaxed opacity-85">{paper.abstract}</p>

            {/* LaTeX Mathematical Formula Display */}
            <div
              className="p-3 rounded-lg border font-mono text-xs overflow-x-auto text-sky-600 dark:text-sky-300"
              style={{
                backgroundColor: isDark ? "#06090e" : "#f1f5f9",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
            >
              {paper.latexFormula}
            </div>
          </div>
        </div>

        {/* Reproducibility & Citation Network Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Reproducibility Scorecard (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-5"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Open Science Verification
                </span>
                <span className="text-xs font-mono text-emerald-500 font-bold">REPRODUCIBLE</span>
              </div>

              <div className="space-y-3 text-xs">
                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-sky-500" />
                    <div>
                      <div className="font-bold">Zenodo Open Dataset</div>
                      <div className="text-[10px] opacity-60">2.4 GB \u2022 10M Token Sequence Benchmark</div>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadDataset}
                    className="p-1.5 rounded-lg border hover:bg-sky-500/10"
                    
                  >
                    <Download className="w-3.5 h-3.5 text-sky-500" />
                  </button>
                </div>

                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  
                >
                  <div className="flex items-center gap-2.5">
                    <Code2 className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-bold">Verified Docker Container</div>
                      <div className="text-[10px] opacity-60">Reproduced on 8x NVIDIA H100 SXM5</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-emerald-500">PASS 100%</span>
                </div>

                <div
                  className="p-3.5 rounded-xl border flex items-center justify-between"
                  
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-bold">Peer Review Consensus</div>
                      <div className="text-[10px] opacity-60">Double-blind evaluation by 4 referees</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-amber-500">Score 9.8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Citation Tree (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-5"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Citation Dependency Graph
                </span>
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg text-[10px]">
                  <button
                    onClick={() => setSelectedCitationTab("DERIVATIVES")}
                    className={\`px-2 py-1 rounded font-semibold transition-all \${
                      selectedCitationTab === "DERIVATIVES"
                        ? "bg-white dark:bg-zinc-800 shadow-sm"
                        : "opacity-60"
                    }\`}
                  >
                    Derivative Works (142)
                  </button>
                  <button
                    onClick={() => setSelectedCitationTab("ANTECEDENTS")}
                    className={\`px-2 py-1 rounded font-semibold transition-all \${
                      selectedCitationTab === "ANTECEDENTS"
                        ? "bg-white dark:bg-zinc-800 shadow-sm"
                        : "opacity-60"
                    }\`}
                  >
                    Foundational Roots (38)
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {citations[selectedCitationTab].map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border space-y-1"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                    }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold leading-tight line-clamp-1">{c.title}</span>
                      <span className="text-[10px] font-mono text-sky-500 font-bold shrink-0 ml-2">
                        {c.impact}
                      </span>
                    </div>
                    <div className="text-[11px] opacity-60">{c.authors}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BibTeX Citation Modal */}
      <AnimatePresence>
        {isBibtexModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#090d14" : "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <h3 className="text-sm font-bold">BibTeX Academic Citation</h3>
                </div>
                <button onClick={() => setIsBibtexModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div
                className="p-4 rounded-xl border font-mono text-xs overflow-x-auto"
                style={{
                  backgroundColor: isDark ? "#05070a" : "#f8fafc",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <pre>{bibtexSnippet}</pre>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs opacity-60">Ready for LaTeX, Overleaf & Zotero</span>
                <button
                  onClick={handleCopyBibtex}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
                  
                >
                  {copiedBibtex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBibtex ? "Copied to Clipboard" : "Copy BibTeX"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-talentorbit-hr.ts
var templateTalentorbitHr = {
  name: "template-talentorbit-hr",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-talentorbit-hr.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  Award,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MapPin,
  Mail,
  UserPlus,
  Briefcase,
  AlertCircle,
} from "lucide-react";

export interface TalentOrbitTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function TalentOrbitTemplate({
  brandName = "TalentOrbit HR",
  theme = "dark",
}: TalentOrbitTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [selectedDept, setSelectedDept] = useState<"ALL" | "ENG" | "PRODUCT" | "DESIGN">("ALL");
  const [isPtoModalOpen, setIsPtoModalOpen] = useState(false);
  const [approvedPtoDays, setApprovedPtoDays] = useState(18);
  const [hrToast, setHrToast] = useState<string | null>(null);

  const teamMembers = [
    {
      id: "EMP-101",
      name: "Sophia Lindqvist",
      title: "VP of Engineering",
      department: "ENG",
      location: "Stockholm (UTC+1)",
      status: "ACTIVE",
      reports: 24,
      performance: "Top Performer (9-Box: 1A)",
      avatarColor: "bg-indigo-500",
    },
    {
      id: "EMP-102",
      name: "Marcus Sterling",
      title: "Principal Distributed Systems Architect",
      department: "ENG",
      location: "San Francisco (UTC-8)",
      status: "ACTIVE",
      reports: 6,
      performance: "Core Contributor (9-Box: 2A)",
      avatarColor: "bg-blue-500",
    },
    {
      id: "EMP-103",
      name: "Amara Okonjo",
      title: "Head of Product Design & Brand",
      department: "DESIGN",
      location: "London (UTC+0)",
      status: "ON_PTO",
      reports: 8,
      performance: "High Potential Leader (9-Box: 1B)",
      avatarColor: "bg-rose-500",
    },
    {
      id: "EMP-104",
      name: "Daisuke Tanaka",
      title: "Senior Product Director",
      department: "PRODUCT",
      location: "Tokyo (UTC+9)",
      status: "ACTIVE",
      reports: 12,
      performance: "Top Performer (9-Box: 1A)",
      avatarColor: "bg-amber-500",
    },
  ];

  const filteredMembers = teamMembers.filter((m) => {
    if (selectedDept === "ALL") return true;
    return m.department === selectedDept;
  });

  const handleRequestPto = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPtoModalOpen(false);
    setApprovedPtoDays(approvedPtoDays - 4);
    setHrToast("4-Day PTO Request submitted & routed to manager for one-click signoff!");
    setTimeout(() => setHrToast(null), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(12, 10, 20, 0.88)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Users className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">TalentOrbit HR</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(139, 92, 246, 0.12)",
                    color: "#6366f1",
                  }}
                >
                  HR & People
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">
                Modern Org Architecture, Capacity Planning & 360 Performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPtoModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Request PTO ({approvedPtoDays}d left)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {hrToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(139, 92, 246, 0.12)" : "#f5f3ff",
                borderColor: "rgba(139, 92, 246, 0.3)",
                color: "#7c3aed",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-500" />
                <span>{hrToast}</span>
              </div>
              <button onClick={() => setHrToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Workforce Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            className="p-4 rounded-2xl border"
            
          >
            <div className="text-[11px] font-semibold opacity-60">Global Headcount</div>
            <div className="text-2xl font-black mt-1">148</div>
            <div className="text-[10px] text-emerald-500 font-medium">+12 in Q3 cohort</div>
          </div>

          <div
            className="p-4 rounded-2xl border"
            
          >
            <div className="text-[11px] font-semibold opacity-60">Active on PTO</div>
            <div className="text-2xl font-black mt-1">6</div>
            <div className="text-[10px] opacity-60 font-medium">Coverage at 96%</div>
          </div>

          <div
            className="p-4 rounded-2xl border"
            
          >
            <div className="text-[11px] font-semibold opacity-60">eNPS Sentiment</div>
            <div className="text-2xl font-black text-violet-500 mt-1">+68</div>
            <div className="text-[10px] text-emerald-500 font-medium">Top 5% tech percentile</div>
          </div>

          <div
            className="p-4 rounded-2xl border"
            
          >
            <div className="text-[11px] font-semibold opacity-60">Global Timezones</div>
            <div className="text-2xl font-black mt-1">14</div>
            <div className="text-[10px] opacity-60 font-medium">Async-first collaboration</div>
          </div>
        </div>

        {/* Interactive Org Directory & Department Switcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Team Tree List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-5"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div>
                  <span className="text-xs font-mono opacity-60">PEOPLE DIRECTORY</span>
                  <h3 className="text-base font-bold tracking-tight">Organization Tree</h3>
                </div>

                {/* Department filter buttons */}
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg text-[10px]">
                  {(["ALL", "ENG", "PRODUCT", "DESIGN"] as const).map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={\`px-2 py-1 rounded font-semibold transition-all \${
                        selectedDept === dept ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-60"
                      }\`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={\`w-10 h-10 rounded-full \${member.avatarColor} text-white font-bold flex items-center justify-center text-xs shrink-0\`}>
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{member.name}</span>
                          <span
                            className={\`text-[9px] font-bold px-1.5 py-0.5 rounded \${
                              member.status === "ACTIVE"
                                ? "bg-emerald-500/15 text-emerald-500"
                                : "bg-amber-500/15 text-amber-500"
                            }\`}
                          >
                            {member.status === "ACTIVE" ? "Active" : "On PTO"}
                          </span>
                        </div>
                        <div className="text-[11px] opacity-70 mt-0.5">{member.title}</div>
                        <div className="flex items-center gap-2 text-[10px] opacity-50 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{member.location}</span>
                          <span>\u2022</span>
                          <span>{member.reports} direct reports</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right text-[11px]">
                      <span className="font-semibold block text-violet-500">{member.performance}</span>
                      <span className="text-[10px] opacity-50">Review Cycle: 2026.Q3</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Global Team PTO Coverage (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-5"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  PTO Calendar & Overlap Radar
                </span>
                <span className="text-xs font-mono text-emerald-500 font-bold">ZERO SPRINT CLASHES</span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { name: "Amara Okonjo", role: "Design Lead", dates: "Sep 07 - Sep 14", status: "Approved" },
                  { name: "Marcus Vance", role: "Sr. Backend", dates: "Sep 22 - Sep 28", status: "Pending Manager" },
                  { name: "Chloe Dupont", role: "Staff Frontend", dates: "Oct 02 - Oct 08", status: "Approved" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border flex items-center justify-between"
                    
                  >
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-[10px] opacity-60">{item.role} \u2022 {item.dates}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-500/15 text-violet-500">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* 9-Box Talent Matrix Snippet */}
              <div
                className="p-4 rounded-xl border space-y-2"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#fafafa",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-bold">Talent Calibration Matrix</span>
                </div>
                <p className="text-[11px] opacity-75 leading-relaxed">
                  84% of engineering ICs currently calibrated in Tier 1 (Exceeding Expectations) and ready for senior promotion tracks in Q4.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* PTO Request Modal */}
      <AnimatePresence>
        {isPtoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#0e0a16" : "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  <h3 className="text-sm font-bold">Submit Time-Off Request</h3>
                </div>
                <button onClick={() => setIsPtoModalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRequestPto} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold block">Time-Off Category</label>
                  <select
                    className="w-full p-2.5 rounded-xl border bg-transparent outline-none"
                    
                  >
                    <option value="VACATION">Paid Annual Vacation (PTO)</option>
                    <option value="MENTAL_HEALTH">Wellness & Mental Health Day</option>
                    <option value="PARENTAL">Parental Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold block">Start Date</label>
                    <input
                      type="date"
                      defaultValue="2026-09-21"
                      className="w-full p-2 rounded-xl border bg-transparent outline-none"
                      
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">End Date</label>
                    <input
                      type="date"
                      defaultValue="2026-09-25"
                      className="w-full p-2 rounded-xl border bg-transparent outline-none"
                      
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl border flex items-center gap-2 text-emerald-500 font-semibold" >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Zero team coverage conflicts during this sprint window.</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPtoModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border"
                    
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                    
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/template-miseenplace-kds.ts
var templateMiseenplaceKds = {
  name: "template-miseenplace-kds",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-miseenplace-kds.tsx",
  content: `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Flame,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  RotateCcw,
  Volume2,
  ChefHat,
  Timer,
  ShoppingBag,
} from "lucide-react";

export interface MiseEnPlaceTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function MiseEnPlaceTemplate({
  brandName = "MiseEnPlace KDS",
  theme = "dark",
}: MiseEnPlaceTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [activeStation, setActiveStation] = useState<"ALL" | "GRILL" | "SAUTE" | "PANTRY">("ALL");
  const [bumpedTickets, setBumpedTickets] = useState<string[]>([]);
  const [kdsToast, setKdsToast] = useState<string | null>(null);

  const initialTickets = [
    {
      id: "TKT-84",
      table: "TABLE 12",
      type: "DINE_IN",
      timeElapsed: "04:15",
      isUrgent: false,
      server: "Julian",
      items: [
        { name: "2x 45-Day Dry Aged Ribeye (Med-Rare)", station: "GRILL", notes: "Bone marrow butter, flaky Maldon salt" },
        { name: "1x Truffle Pommes Frites", station: "SAUTE", notes: "Extra crispy, parmesan snow" },
        { name: "1x Charred Broccolini", station: "GRILL", notes: "Preserved lemon vinaigrette" },
      ],
      allergy: null,
    },
    {
      id: "TKT-85",
      table: "UBEREATS #901",
      type: "DELIVERY",
      timeElapsed: "13:40",
      isUrgent: true,
      server: "Delivery Courier Waiting",
      items: [
        { name: "1x Crispy Buttermilk Fried Chicken", station: "SAUTE", notes: "Spicy habanero honey on side" },
        { name: "1x Heirloom Tomato & Burrata Salad", station: "PANTRY", notes: "ALLERGY: SEVERE TREE NUT ALLERGY" },
      ],
      allergy: "SEVERE TREE NUT ALLERGY - CLEAN SANITIZE BOARD",
    },
    {
      id: "TKT-86",
      table: "TABLE 04",
      type: "DINE_IN",
      timeElapsed: "08:22",
      isUrgent: false,
      server: "Chloe",
      items: [
        { name: "2x Pan-Seared Chilean Sea Bass", station: "SAUTE", notes: "Dashi beurre blanc, crispy leeks" },
        { name: "1x Hamachi Crudo", station: "PANTRY", notes: "Yuzu kosho, pickled radish" },
      ],
      allergy: null,
    },
  ];

  const handleBumpTicket = (ticketId: string) => {
    if (!bumpedTickets.includes(ticketId)) {
      setBumpedTickets([...bumpedTickets, ticketId]);
      setKdsToast(\`Ticket [\${ticketId}] Bumped! Routed to Expediter & Runner.\`);
      setTimeout(() => setKdsToast(null), 3500);
    }
  };

  const handleRecallTicket = () => {
    if (bumpedTickets.length > 0) {
      const last = bumpedTickets[bumpedTickets.length - 1];
      setBumpedTickets(bumpedTickets.slice(0, -1));
      setKdsToast(\`Ticket [\${last}] recalled back to active line!\`);
      setTimeout(() => setKdsToast(null), 3500);
    }
  };

  const visibleTickets = initialTickets.filter((tkt) => {
    if (bumpedTickets.includes(tkt.id)) return false;
    if (activeStation === "ALL") return true;
    return tkt.items.some((item) => item.station === activeStation);
  });

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(18, 12, 10, 0.9)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">MiseEnPlace KDS</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(249, 115, 22, 0.12)",
                    color: "#6366f1",
                  }}
                >
                  Restaurant Tech
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">
                Commercial Kitchen Display System & Line Order Expediter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRecallTicket}
              disabled={bumpedTickets.length === 0}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5"
              
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recall Last</span>
            </button>

            <div
              className="px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 text-orange-500"
              
            >
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>{visibleTickets.length} ACTIVE ORDERS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {kdsToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(249, 115, 22, 0.12)" : "#fff7ed",
                borderColor: "rgba(249, 115, 22, 0.3)",
                color: "#ea580c",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                <span>{kdsToast}</span>
              </div>
              <button onClick={() => setKdsToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Station Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl text-xs">
            {(["ALL", "GRILL", "SAUTE", "PANTRY"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setActiveStation(st)}
                className={\`px-3 py-1.5 rounded-lg font-bold transition-all \${
                  activeStation === st ? "bg-orange-500 text-white shadow-sm" : "opacity-60 hover:opacity-100"
                }\`}
              >
                {st === "ALL" ? "All Kitchen Lines" : st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt; 5m On Time
            </span>
            <span className="flex items-center gap-1.5 text-amber-500">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> 5-10m Warning
            </span>
            <span className="flex items-center gap-1.5 text-rose-500">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> &gt; 12m Critical
            </span>
          </div>
        </div>

        {/* KDS Order Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleTickets.map((tkt) => (
            <div
              key={tkt.id}
              className={\`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-sm transition-all \${
                tkt.isUrgent ? "border-rose-500 ring-2 ring-rose-500/20" : ""
              }\`}
              style={{
                backgroundColor: "#12141c",
                borderColor: tkt.isUrgent ? undefined : "rgba(255, 255, 255, 0.08)",
              }}
            >
              {/* Ticket Header Bar */}
              <div
                className={\`p-4 border-b flex items-center justify-between text-xs font-mono font-bold \${
                  tkt.isUrgent ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" : ""
                }\`}
                
              >
                <div>
                  <span className="text-sm font-black">{tkt.table}</span>
                  <div className="text-[10px] opacity-70 font-normal mt-0.5">{tkt.id} \u2022 {tkt.server}</div>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <Timer className={\`w-3.5 h-3.5 \${tkt.isUrgent ? "text-rose-500 animate-spin" : "opacity-60"}\`} />
                  <span>{tkt.timeElapsed}</span>
                </div>
              </div>

              {/* Allergy Warning Flag */}
              {tkt.allergy && (
                <div className="p-2.5 bg-rose-600 text-white text-[11px] font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>{tkt.allergy}</span>
                </div>
              )}

              {/* Ticket Items List */}
              <div className="p-4 space-y-3 flex-1">
                {tkt.items.map((item, idx) => (
                  <div key={idx} className="space-y-0.5 pb-2.5 border-b last:border-b-0" >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold leading-tight">{item.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 font-semibold">
                        {item.station}
                      </span>
                    </div>
                    <div className="text-[11px] opacity-60 italic">{item.notes}</div>
                  </div>
                ))}
              </div>

              {/* Bump Ticket Footer Button */}
              <div className="p-3 border-t bg-black/5 dark:bg-white/5" >
                <button
                  onClick={() => handleBumpTicket(tkt.id)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 hover:opacity-90"
                  
                >
                  <Check className="w-4 h-4" />
                  <span>Bump Order (Complete)</span>
                </button>
              </div>
            </div>
          ))}

          {visibleTickets.length === 0 && (
            <div
              className="md:col-span-3 p-12 text-center rounded-2xl border space-y-2"
              
            >
              <ChefHat className="w-8 h-8 mx-auto text-emerald-500" />
              <h3 className="text-base font-bold">All Orders Cleared!</h3>
              <p className="text-xs opacity-60">Kitchen line is all prepped and clear for upcoming dinner rush.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
`
};

// src/registry/template-aurasolace-sanctuary.ts
var templateAurasolaceSanctuary = {
  name: "template-aurasolace-sanctuary",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-aurasolace-sanctuary.tsx",
  content: `"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Wind,
  Volume2,
  Sparkles,
  Sliders,
  CheckCircle2,
  X,
  Smile,
  BookOpen,
  PenTool,
  Check,
  Moon,
  Sun,
  Flame,
  CloudRain,
  Music,
} from "lucide-react";

export interface AuraSolaceTemplateProps {
  brandName?: string;
  theme?: "dark" | "light";
}

export default function AuraSolaceTemplate({
  brandName = "AuraSolace",
  theme = "dark",
}: AuraSolaceTemplateProps) {
  
    const isDark = theme === "dark";

  // States
  const [breathPhase, setBreathPhase] = useState<"INHALE" | "HOLD" | "EXHALE">("INHALE");
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [selectedMood, setSelectedMood] = useState("Peaceful Grounded");
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [journalNote, setJournalNote] = useState("");
  const [soundVolumes, setSoundVolumes] = useState({
    rain: 65,
    bowls: 40,
    fire: 30,
    solfeggio: 55,
  });
  const [solaceToast, setSolaceToast] = useState<string | null>(null);

  // Breathing pacer cycle (4-7-8 rhythm)
  useEffect(() => {
    const timer = setInterval(() => {
      setPhaseSeconds((prev) => {
        if (prev <= 1) {
          if (breathPhase === "INHALE") {
            setBreathPhase("HOLD");
            return 7;
          } else if (breathPhase === "HOLD") {
            setBreathPhase("EXHALE");
            return 8;
          } else {
            setBreathPhase("INHALE");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [breathPhase]);

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsJournalOpen(false);
    setSolaceToast("Mindful reflection entry saved to encrypted private sanctuary.");
    setTimeout(() => setSolaceToast(null), 3500);
  };

  return (
    <div
      className="w-full min-h-screen transition-colors font-sans text-left"
      
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b transition-colors shrink-0"
        style={{
          backgroundColor: isDark ? "rgba(10, 14, 18, 0.85)" : "rgba(255, 255, 255, 0.92)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              
            >
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">AuraSolace</span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(20, 184, 166, 0.12)",
                    color: "#6366f1",
                  }}
                >
                  Mental Health
                </span>
              </div>
              <p className="text-[11px] opacity-60 hidden sm:block">
                Somatic Nervous System Sanctuary & Ambient Soundscape
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsJournalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 active:scale-95"
              
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Mindful Journal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast */}
        <AnimatePresence>
          {solaceToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-xl border flex items-center justify-between text-xs font-medium"
              style={{
                backgroundColor: isDark ? "rgba(20, 184, 166, 0.12)" : "#f0fdfa",
                borderColor: "rgba(20, 184, 166, 0.3)",
                color: "#0d9488",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>{solaceToast}</span>
              </div>
              <button onClick={() => setSolaceToast(null)} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Somatic Breath Pacer Stage & Sound Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 4-7-8 Breath Pacer Engine (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="p-6 sm:p-8 rounded-2xl border flex flex-col items-center justify-between text-center min-h-[440px] relative overflow-hidden"
              
            >
              <div className="w-full flex items-center justify-between pb-4 border-b" >
                <div>
                  <span className="text-xs font-mono opacity-60">AUTONOMIC REGULATION</span>
                  <h3 className="text-base font-bold tracking-tight">4-7-8 Parasympathetic Pacer</h3>
                </div>
                <span className="text-xs font-mono text-teal-500 font-bold">CALM VAGUS NERVE</span>
              </div>

              {/* Animated Breath Orb */}
              <div className="my-8 relative flex items-center justify-center">
                {/* Glowing Outer Ripple */}
                <motion.div
                  animate={{
                    scale: breathPhase === "INHALE" ? 1.4 : breathPhase === "HOLD" ? 1.4 : 0.9,
                    opacity: breathPhase === "HOLD" ? 0.8 : 0.4,
                  }}
                  transition={{ duration: breathPhase === "INHALE" ? 4 : breathPhase === "HOLD" ? 7 : 8, ease: "easeInOut" }}
                  className="w-48 h-48 rounded-full bg-teal-500/20 blur-xl absolute"
                />

                {/* Main Interactive Circle */}
                <motion.div
                  animate={{
                    scale: breathPhase === "INHALE" ? 1.25 : breathPhase === "HOLD" ? 1.25 : 0.95,
                  }}
                  transition={{ duration: breathPhase === "INHALE" ? 4 : breathPhase === "HOLD" ? 7 : 8, ease: "easeInOut" }}
                  className="w-44 h-44 rounded-full border-2 border-teal-500 flex flex-col items-center justify-center p-4 relative shadow-lg"
                  style={{
                    backgroundColor: isDark ? "#061314" : "#f0fdfa",
                  }}
                >
                  <Wind className="w-6 h-6 text-teal-500 mb-1" />
                  <span className="text-xs font-black tracking-wider uppercase text-teal-600 dark:text-teal-400">
                    {breathPhase === "INHALE" ? "Breathe In" : breathPhase === "HOLD" ? "Hold Breath" : "Release Gently"}
                  </span>
                  <span className="text-3xl font-black text-teal-500 font-mono mt-0.5">
                    {phaseSeconds}s
                  </span>
                </motion.div>
              </div>

              {/* Subtle Guide Text */}
              <p className="text-xs opacity-70 max-w-sm">
                Follow the sphere rhythm. Inhale deeply through your nose, hold gently at top, and slowly exhale through relaxed lips.
              </p>
            </div>
          </div>

          {/* Right: Ambient Acoustic Soundscape Studio (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="p-5 sm:p-6 rounded-2xl border space-y-5"
              
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Acoustic Sanctuary Mixer
                </span>
                <Volume2 className="w-4 h-4 text-teal-500" />
              </div>

              {/* Sound Faders */}
              <div className="space-y-3.5 text-xs">
                {[
                  { key: "rain", label: "Pacific Coastal Rain", icon: CloudRain },
                  { key: "bowls", label: "Tibetan Singing Bowls", icon: Music },
                  { key: "fire", label: "Cedar Wood Fireplace", icon: Flame },
                  { key: "solfeggio", label: "432 Hz Solfeggio Harmony", icon: Sparkles },
                ].map((item) => {
                  const val = soundVolumes[item.key as keyof typeof soundVolumes];
                  const Icon = item.icon;
                  return (
                    <div key={item.key} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Icon className="w-3.5 h-3.5 text-teal-500" />
                          <span>{item.label}</span>
                        </div>
                        <span className="font-mono opacity-60">{val}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={val}
                        onChange={(e) =>
                          setSoundVolumes({ ...soundVolumes, [item.key]: parseInt(e.target.value) })
                        }
                        className="w-full accent-teal-500 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Daily Emotional Dialectic */}
              <div className="pt-2 border-t space-y-2" >
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 block">
                  Daily Emotional State Check-In
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["Peaceful Grounded", "Open & Curious", "Gentle Reflection", "Overwhelmed"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMood(m)}
                      className={\`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all \${
                        selectedMood === m
                          ? "bg-teal-500 text-white shadow-sm"
                          : "border opacity-70 hover:opacity-100"
                      }\`}
                      style={{
                        borderColor: selectedMood === m ? undefined : "rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mindful Journal Modal */}
      <AnimatePresence>
        {isJournalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border p-6 space-y-5 shadow-2xl"
              style={{
                backgroundColor: isDark ? "#081214" : "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.08)",
                color: "#f4f4f7",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" >
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-teal-500" />
                  <h3 className="text-sm font-bold">Mindful Reflection Journal</h3>
                </div>
                <button onClick={() => setIsJournalOpen(false)} className="opacity-60 hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveJournal} className="space-y-3 text-xs">
                <div className="p-3 rounded-xl border bg-teal-500/5 text-teal-600 dark:text-teal-300 italic" >
                  "What emotion or physical sensation is asking for your compassionate attention right now?"
                </div>

                <textarea
                  rows={4}
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder="Pour your thoughts freely without judgment..."
                  className="w-full p-3 rounded-xl border bg-transparent outline-none resize-none"
                  
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsJournalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border"
                    
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                    
                  >
                    Save to Private Journal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`
};

// src/registry/index.ts
var registry = {
  button,
  modal,
  card,
  alert,
  badge,
  "morphing-geometry": morphingGeometry,
  "aurora-border-fx": auroraBorderFX,
  "aurora-search-pill": auroraSearchPill,
  "template-ai-startup": templateAiStartup,
  "template-modern-saas": templateModernSaas,
  "template-analytics-dashboard": templateAnalyticsDashboard,
  "template-devtools-cli": templateDevtoolsCli,
  "template-creative-portfolio": templateCreativePortfolio,
  "template-fintech-app": templateFintechApp,
  "template-ecommerce-store": templateEcommerceStore,
  "template-agency-creative": templateAgencyCreative,
  "template-ai-chat": templateAiChat,
  "template-project-management": templateProjectManagement,
  "template-startup-waitlist": templateStartupWaitlist,
  "template-docs-platform": templateDocsPlatform,
  "template-healthcare-portal": templateHealthcarePortal,
  "template-web3-dex": templateWeb3Dex,
  "template-edtech-learning": templateEdtechLearning,
  "template-conference-event": templateConferenceEvent,
  "template-audio-podcast": templateAudioPodcast,
  "template-real-estate": templateRealEstate,
  "template-uptime-status": templateUptimeStatus,
  "template-agent-workflow": templateAgentWorkflow,
  "template-restaurant-culinary": templateRestaurantCulinary,
  "template-help-center": templateHelpCenter,
  "template-fitness-athletics": templateFitnessAthletics,
  "template-wilderness-travel": templateWildernessTravel,
  "template-devops-kubernetes": templateDevopsKubernetes,
  "template-audio-daw": templateAudioDaw,
  "template-gamified-habits": templateGamifiedHabits,
  "template-global-logistics": templateGlobalLogistics,
  "template-gaming-esports": templateGamingEsports,
  "template-architecture-spatial": templateArchitectureSpatial,
  "template-cybersecurity-soc": templateCybersecuritySoc,
  "template-cleantech-agriculture": templateCleantechAgriculture,
  "template-juris-vault": templateJurisVault,
  "template-orbitalx-mission": templateOrbitalxMission,
  "template-cineboard-studio": templateCineboardStudio,
  "template-domus-living": templateDomusLiving,
  "template-hyperion-ev": templateHyperionEv,
  "template-sovereign-auctions": templateSovereignAuctions,
  "template-scholaris-archive": templateScholarisArchive,
  "template-talentorbit-hr": templateTalentorbitHr,
  "template-miseenplace-kds": templateMiseenplaceKds,
  "template-aurasolace-sanctuary": templateAurasolaceSanctuary
};

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
  const project = detectProject(process.cwd());
  console.log(`
\x1B[34mDetected project type:\x1B[0m ${project.projectType.toUpperCase()}`);
  console.log(`\x1B[34mDetected package manager:\x1B[0m ${project.packageManager}
`);
  let customComponentsDir;
  let customUtilsFile;
  try {
    const configPath = path3.join(project.baseDir, "nexore.json");
    if (fs3.existsSync(configPath)) {
      const cfg = JSON.parse(fs3.readFileSync(configPath, "utf8"));
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
  const invalidComponents = [];
  const queue = [...targetComponents.filter((c) => c !== "--all")];
  while (queue.length > 0) {
    const compName = queue.shift();
    const registryItem = registry[compName];
    if (!registryItem) {
      invalidComponents.push(compName);
      continue;
    }
    if (!componentsToInstall.has(compName)) {
      componentsToInstall.add(compName);
      if (registryItem.componentsDependencies) {
        for (const dep of registryItem.componentsDependencies) {
          queue.push(dep);
        }
      }
    }
  }
  if (invalidComponents.length > 0) {
    console.error(`\x1B[31mError: Component(s) not found in registry: ${invalidComponents.join(", ")}\x1B[0m`);
    console.log("Run \x1B[32mnpx nexoreui list\x1B[0m to see all available components.");
    return;
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
  const absoluteComponentsDir = path3.resolve(project.baseDir, componentsDirInput);
  const absoluteUtilsFile = path3.resolve(project.baseDir, utilsFileInput);
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
  for (const compName of componentsToInstall) {
    const registryItem = registry[compName];
    const targetPath = path3.join(absoluteComponentsDir, registryItem.fileName);
    copyComponentFile(registryItem.content, targetPath, absoluteUtilsFile);
    console.log(`\x1B[32m\u2714 Added component:\x1B[0m ${compName} -> ${path3.join(componentsDirInput, registryItem.fileName)}`);
    registryItem.dependencies.forEach((dep) => npmDependencies.add(dep));
  }
  const depsArray = Array.from(npmDependencies);
  let depsToInstall = [...depsArray];
  try {
    const packageJsonPath = path3.join(project.baseDir, "package.json");
    if (fs3.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs3.readFileSync(packageJsonPath, "utf8"));
      const existingDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      depsToInstall = depsArray.filter((dep) => !existingDeps[dep]);
    }
  } catch {
  }
  if (depsToInstall.length > 0) {
    console.log(`
\x1B[33mInstalling external dependencies:\x1B[0m ${depsToInstall.join(", ")}...`);
    let installCmd = "npm install";
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
  console.log(`
\x1B[32m\x1B[1m\u{1F389} Done! ${componentsToInstall.size} NexoreUI component(s) ready to use.\x1B[0m
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
}

// src/commands/init.ts
var fs5 = __toESM(require("fs"));
var path5 = __toESM(require("path"));
var readline2 = __toESM(require("readline"));

// src/utils/config.ts
var fs4 = __toESM(require("fs"));
var path4 = __toESM(require("path"));
var import_child_process2 = require("child_process");
var THEME_PALETTES = {
  indigo: { light: "hsl(250 85% 50%)", dark: "hsl(250 85% 65%)", rgb: "99 60 220" },
  violet: { light: "hsl(262.1 83.3% 57.8%)", dark: "hsl(263.4 70% 50.4%)", rgb: "139 92 246" },
  emerald: { light: "hsl(142.1 76.2% 36.3%)", dark: "hsl(142.1 70.6% 45.3%)", rgb: "16 185 129" },
  rose: { light: "hsl(346.8 77.2% 49.8%)", dark: "hsl(346.8 77.2% 55%)", rgb: "244 63 94" },
  amber: { light: "hsl(37.7 92.1% 50.2%)", dark: "hsl(37.7 92.1% 55%)", rgb: "245 158 11" },
  cyan: { light: "hsl(190.4 95% 39%)", dark: "hsl(188.7 94.5% 42.7%)", rgb: "6 182 212" },
  slate: { light: "hsl(240 5.9% 10%)", dark: "hsl(0 0% 98%)", rgb: "244 244 245" },
  neon: { light: "hsl(173 80% 40%)", dark: "hsl(173 100% 50%)", rgb: "0 255 220" }
};
function ensurePathAlias(baseDir, projectType, hasSrcDir) {
  let updated = false;
  const configsToCheck = [
    path4.join(baseDir, "tsconfig.app.json"),
    path4.join(baseDir, "tsconfig.json"),
    path4.join(baseDir, "jsconfig.json")
  ];
  for (const targetConfig of configsToCheck) {
    if (fs4.existsSync(targetConfig)) {
      try {
        const content = fs4.readFileSync(targetConfig, "utf8");
        const parsed = JSON.parse(content);
        parsed.compilerOptions = parsed.compilerOptions || {};
        parsed.compilerOptions.baseUrl = parsed.compilerOptions.baseUrl || ".";
        parsed.compilerOptions.paths = parsed.compilerOptions.paths || {};
        const aliasTarget = hasSrcDir ? ["./src/*"] : ["./*"];
        if (!parsed.compilerOptions.paths["@/*"]) {
          parsed.compilerOptions.paths["@/*"] = aliasTarget;
          fs4.writeFileSync(targetConfig, JSON.stringify(parsed, null, 2), "utf8");
          updated = true;
        }
      } catch {
      }
    }
  }
  if (projectType === "vite") {
    const viteConfigFiles = ["vite.config.ts", "vite.config.js", "vite.config.mjs"];
    for (const fileName of viteConfigFiles) {
      const vitePath = path4.join(baseDir, fileName);
      if (fs4.existsSync(vitePath)) {
        let viteContent = fs4.readFileSync(vitePath, "utf8");
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
            fs4.writeFileSync(vitePath, viteContent, "utf8");
            updated = true;
          }
        }
        if (!viteContent.includes("@tailwindcss/vite")) {
          let updatedVite = `import tailwindcss from '@tailwindcss/vite'
` + viteContent;
          if (updatedVite.includes("plugins: [")) {
            updatedVite = updatedVite.replace(/plugins:\s*\[/, "plugins: [tailwindcss(), ");
            fs4.writeFileSync(vitePath, updatedVite, "utf8");
            updated = true;
          }
        }
        break;
      }
    }
  }
  return updated;
}
function injectThemeCss(baseDir, cssRelativePath, themeName, radiusValue) {
  const cssAbsolutePath = path4.join(baseDir, cssRelativePath);
  const palette = THEME_PALETTES[themeName] || THEME_PALETTES.cyan;
  const radius = typeof radiusValue === "number" ? radiusValue : parseFloat(radiusValue) || 1;
  const themeBlock = `
@source "../node_modules/nexoreui/dist/**/*.{js,mjs}";

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
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 3.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 3.9%);
  --primary: ${palette.light};
  --primary-foreground: hsl(0 0% 100%);
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
  --ring: ${palette.light};
  --radius: ${radius}rem;
  --glow-radius: 12px;
  --glow-strength: 0.15;
  --glow-color: ${palette.rgb};
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(240 10% 3.9%);
  --card-foreground: hsl(0 0% 98%);
  --popover: hsl(240 10% 3.9%);
  --popover-foreground: hsl(0 0% 98%);
  --primary: ${palette.dark};
  --primary-foreground: hsl(0 0% 100%);
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
  --ring: ${palette.dark};
  --radius: ${radius}rem;
  --glow-radius: 20px;
  --glow-strength: 0.35;
  --glow-color: ${palette.rgb};
}
`;
  if (fs4.existsSync(cssAbsolutePath)) {
    let existingContent = fs4.readFileSync(cssAbsolutePath, "utf8");
    existingContent = existingContent.replace(/#root\s*\{[^}]*\}/g, "");
    if (!existingContent.includes("--color-primary") && !existingContent.includes("nexoreui/dist")) {
      let finalContent = existingContent.trim() + "\n" + themeBlock;
      if (!finalContent.includes('@import "tailwindcss"') && !finalContent.includes("@import 'tailwindcss'")) {
        finalContent = '@import "tailwindcss";\n' + finalContent;
      }
      fs4.writeFileSync(cssAbsolutePath, finalContent, "utf8");
      return true;
    }
  } else {
    const cssDir = path4.dirname(cssAbsolutePath);
    if (!fs4.existsSync(cssDir)) fs4.mkdirSync(cssDir, { recursive: true });
    fs4.writeFileSync(cssAbsolutePath, `@import "tailwindcss";
` + themeBlock, "utf8");
    return true;
  }
  return false;
}
function installPeerDependencies(baseDir, packageManager, dependencies = ["clsx", "tailwind-merge", "lucide-react", "framer-motion"]) {
  try {
    const packageJsonPath = path4.join(baseDir, "package.json");
    let missingDeps = [...dependencies];
    if (fs4.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs4.readFileSync(packageJsonPath, "utf8"));
      const installed = { ...pkg.dependencies, ...pkg.devDependencies };
      missingDeps = dependencies.filter((dep) => !installed[dep]);
    }
    if (missingDeps.length === 0) return true;
    let installCmd = "npm install";
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
  let theme = options.theme || "cyan";
  let radius = options.radius || "1.0";
  const defaultComponentsDir = project.hasSrcDir ? "src/components/ui" : "components/ui";
  const defaultUtilsFile = project.hasSrcDir ? "src/lib/utils.ts" : "lib/utils.ts";
  const defaultCssFile = project.projectType === "next" ? project.hasSrcDir ? "src/app/globals.css" : "app/globals.css" : project.hasSrcDir ? "src/index.css" : "src/index.css";
  let componentsDir = defaultComponentsDir;
  let utilsFile = defaultUtilsFile;
  if (!options.yes) {
    if (!options.theme) {
      const themeAns = await askQuestion2(`Which color theme would you like to use? (cyan, indigo, violet, emerald, rose, amber, slate, neon) [default: cyan]: `);
      if (themeAns.trim() && THEME_PALETTES[themeAns.trim().toLowerCase()]) {
        theme = themeAns.trim().toLowerCase();
      }
    }
    if (!options.radius) {
      const radiusAns = await askQuestion2(`Which radius value would you like to use? (0, 0.3, 0.5, 0.75, 1.0) [default: 1.0]: `);
      if (radiusAns.trim()) {
        radius = radiusAns.trim();
      }
    }
    const compAns = await askQuestion2(`Where should UI components be created? (default: ${defaultComponentsDir}): `);
    if (compAns.trim()) componentsDir = compAns.trim();
    const utilsAns = await askQuestion2(`Where should utility functions (cn helper) be placed? (default: ${defaultUtilsFile}): `);
    if (utilsAns.trim()) utilsFile = utilsAns.trim();
  }
  const absoluteComponentsDir = path5.resolve(project.baseDir, componentsDir);
  const absoluteUtilsFile = path5.resolve(project.baseDir, utilsFile);
  ensureDir(absoluteComponentsDir);
  ensureCnUtil(absoluteUtilsFile);
  const didUpdateAlias = ensurePathAlias(project.baseDir, project.projectType, project.hasSrcDir);
  if (didUpdateAlias) {
    console.log(`\x1B[32m\u2714\x1B[0m Configured path alias \x1B[1m'@/*'\x1B[0m in project config`);
  }
  const didInjectCss = injectThemeCss(project.baseDir, defaultCssFile, theme, radius);
  if (didInjectCss) {
    console.log(`\x1B[32m\u2714\x1B[0m Injected Tailwind CSS v4 @theme tokens into \x1B[1m${defaultCssFile}\x1B[0m`);
  }
  installPeerDependencies(project.baseDir, project.packageManager);
  const config = {
    $schema: "https://nexoreui.site/schema.json",
    style: "default",
    theme,
    radius: Number(radius),
    framework: project.projectType,
    packageManager: project.packageManager,
    font: "system",
    density: "default",
    animation: "energetic",
    defaultMode: "light",
    tailwind: {
      config: "tailwind.config.js",
      css: defaultCssFile,
      baseColor: "zinc",
      cssVariables: true
    },
    aliases: {
      components: `@/${componentsDir.replace(/^src\//, "")}`,
      utils: `@/${utilsFile.replace(/^src\//, "").replace(/\.(ts|js)$/, "")}`
    }
  };
  const configPath = path5.join(project.baseDir, "nexore.json");
  fs5.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
  console.log(`\x1B[32m\u2714\x1B[0m Generated \x1B[1mnexore.json\x1B[0m (Theme: ${theme}, Radius: ${radius}rem)`);
  console.log(`\x1B[32m\u2714\x1B[0m Utilities ready at \x1B[1m${utilsFile}\x1B[0m`);
  console.log(`\x1B[32m\u2714\x1B[0m Components directory ready at \x1B[1m${componentsDir}\x1B[0m`);
  console.log(`
\x1B[32m\x1B[1m\u{1F389} NexoreUI initialized successfully! You can now add components:\x1B[0m`);
  console.log(`  \x1B[36mnpx nexoreui add button card modal table --all\x1B[0m
`);
}

// src/commands/create.ts
var fs6 = __toESM(require("fs"));
var path6 = __toESM(require("path"));
var import_child_process3 = require("child_process");
async function createCommand(projectName, options = {}) {
  const name = projectName || "my-nexore-app";
  const targetDir = path6.resolve(process.cwd(), name);
  console.log(`
\x1B[36m\x1B[1m\u{1F680} Creating a new NexoreUI Project:\x1B[0m \x1B[32m${name}\x1B[0m
`);
  if (fs6.existsSync(targetDir) && fs6.readdirSync(targetDir).length > 0) {
    console.error(`\x1B[31mError: Target directory ${name} already exists and is not empty.\x1B[0m`);
    return;
  }
  console.log(`\x1B[33m\u26A1 Step 1/4: Scaffolding React + Vite template...\x1B[0m`);
  try {
    (0, import_child_process3.execSync)(`npx -y create-vite@latest ${name} --template react-ts --no-immediate --no-interactive`, { stdio: "inherit" });
  } catch (err) {
    console.error(`\x1B[31mFailed to scaffold Vite project.\x1B[0m`);
    return;
  }
  process.chdir(targetDir);
  console.log(`
\x1B[33m\u{1F4E6} Step 2/4: Installing NexoreUI, Tailwind CSS, and core packages...\x1B[0m`);
  (0, import_child_process3.execSync)(`npm install nexoreui lucide-react clsx tailwind-merge framer-motion @tailwindcss/vite tailwindcss`, {
    stdio: "inherit"
  });
  console.log(`
\x1B[33m\u2699\uFE0F  Step 3/4: Configuring theme and design tokens...\x1B[0m`);
  await initCommand({
    yes: true,
    theme: options.theme || "emerald",
    radius: options.radius || "0.75"
  });
  console.log(`
\x1B[33m\u{1F9E9} Step 4/4: Adding starter UI components (button, card)...\x1B[0m`);
  try {
    await addCommand(["button", "card"], { yes: true });
  } catch {
  }
  const appTsxPath = path6.join(targetDir, "src", "App.tsx");
  const starterAppCode = `import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sparkles, Terminal, Layers } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 transition-colors selection:bg-primary/20">
      <div className="max-w-xl w-full space-y-8 text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>NexoreUI + Tailwind CSS v4</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Welcome to <span className="text-primary">NexoreUI</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Your project is fully configured with design tokens, glow effects, and modern animated components.
          </p>
        </div>

        {/* Demo Interactive Card */}
        <Card className="max-w-md mx-auto text-left shadow-xl border-border/80">
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
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/60">
              <span className="text-xs font-medium">Click Counter</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-primary/15 text-primary">
                {count} clicks
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setCount((c) => c + 1)} className="flex-1">
                Increment Count
              </Button>
              <Button variant="outline" onClick={() => setCount(0)}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CLI Hint */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground font-mono inline-flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary shrink-0" />
          <span>npx nexoreui add --all</span>
        </div>
      </div>
    </main>
  );
}
`;
  try {
    fs6.writeFileSync(appTsxPath, starterAppCode, "utf8");
  } catch {
  }
  const appCssPath = path6.join(targetDir, "src", "App.css");
  if (fs6.existsSync(appCssPath)) {
    try {
      fs6.writeFileSync(appCssPath, "/* NexoreUI styles are loaded from src/index.css */\n", "utf8");
    } catch {
    }
  }
  console.log(`
\x1B[32m\x1B[1m\u2728 Project ${name} is ready with NexoreUI!\x1B[0m`);
  console.log(`
To get started:
`);
  console.log(`  \x1B[36mcd ${name}\x1B[0m`);
  console.log(`  \x1B[36mnpm run dev\x1B[0m
`);
  console.log(`To add more components to your project:
`);
  console.log(`  \x1B[36mnpx nexoreui add modal table tabs --all\x1B[0m
`);
}

// src/index.ts
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  if (!command || command === "-h" || command === "--help") {
    printHelp();
    return;
  }
  if (command === "create") {
    const projectName = args[1] && !args[1].startsWith("-") ? args[1] : void 0;
    let theme;
    let radius;
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg === "--theme" && args[i + 1]) {
        theme = args[++i];
      } else if (arg.startsWith("--theme=")) {
        theme = arg.split("=")[1];
      } else if (arg === "--radius" && args[i + 1]) {
        radius = args[++i];
      } else if (arg.startsWith("--radius=")) {
        radius = arg.split("=")[1];
      }
    }
    await createCommand(projectName, { theme, radius });
  } else if (command === "init") {
    let yes = false;
    let theme;
    let radius;
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
      }
    }
    await initCommand({ yes, theme, radius });
  } else if (command === "list") {
    listCommand();
  } else if (command === "add") {
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
  } else {
    console.error(`\x1B[31mUnknown command: ${command}\x1B[0m`);
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
  \x1B[32madd [components...]\x1B[0m  Add components to your project (use --all to install all 40+ components)
  \x1B[32mlist\x1B[0m                 List all available components in registry

Options:
  \x1B[33m--theme <name>\x1B[0m       Set color palette (cyan, indigo, violet, emerald, rose, amber, slate, neon)
  \x1B[33m--radius <val>\x1B[0m       Set border radius (0, 0.3, 0.5, 0.75, 1.0)
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
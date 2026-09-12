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
  Zap,
  Shield,
  Check,
  ChevronRight,
  Send,
  Terminal,
  Activity,
} from "lucide-react";

export default function AiStartupTemplate() {
  const [selectedModel, setSelectedModel] = useState<"DeepSeek-R1" | "Claude-3.5" | "GPT-4o">("DeepSeek-R1");
  const [promptText, setPromptText] = useState("Synthesize an edge-routed vector indexing service");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(
    "\u2713 Tensor graph compiled. 4 regions provisioned. TTFT: 14ms. Throughput: 142 tok/s."
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const handleSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setGeneratedOutput(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedOutput(
        \`\u2713 [\${selectedModel}] execution complete. 2,140 tokens streamed with zero-copy serialization. Latency: 1.1ms.\`
      );
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans selection:bg-indigo-500/30">
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/10 bg-[#08090d]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">Synthetix AI</span>
          </div>
          <button className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
            Get API Key
          </button>
        </div>
      </header>

      <section className="pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono mb-6">
          <Cpu className="h-3 w-3" />
          <span>Next-Gen Autonomous Inference Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
          Zero Latency. Real Autonomous Intelligence.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mb-10">
          Stream deep reasoning tokens directly to edge clients. Synthesize complex backend architectures,
          fine-tune proprietary weights, and run microsecond telemetry without cold starts.
        </p>

        <form
          onSubmit={handleSynthesize}
          className="max-w-2xl mx-auto p-2 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col sm:flex-row gap-2 shadow-2xl"
        >
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shrink-0"
          >
            {isGenerating ? "Synthesizing..." : "Execute"}
          </button>
        </form>

        <AnimatePresence>
          {generatedOutput && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 text-xs font-mono text-indigo-300 max-w-2xl mx-auto text-left"
            >
              {generatedOutput}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
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
import { motion } from "framer-motion";
import { Command, Search, GitBranch, CheckCircle2, ArrowUpRight, ChevronRight, Zap } from "lucide-react";

export default function ModernSaasTemplate() {
  const [activeTab, setActiveTab] = useState<"branch" | "edge" | "telemetry">("branch");

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 font-sans">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090b10]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-sm">Aura Cloud</span>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium">
            Console
          </button>
        </div>
      </header>

      <section className="pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-5">
          <GitBranch className="h-3 w-3" />
          <span>Continuous Edge Infrastructure</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
          The Developer Cloud for Ultra-Fast Teams.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-10">
          Push code, spawn instant ephemeral preview environments, and deploy across 300 global edge locations
          with zero configuration.
        </p>
      </section>
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
import { BarChart3, TrendingUp, Users, CreditCard, ArrowUpRight, Download } from "lucide-react";

export default function AnalyticsDashboardTemplate() {
  const [dateRange, setDateRange] = useState("30D");

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-56 border-r border-white/10 p-4 shrink-0 bg-[#08090d]">
        <div className="font-bold text-sm mb-6">Prism Analytics</div>
        <nav className="space-y-1 text-xs">
          <button className="w-full text-left px-3 py-2 rounded-lg bg-emerald-600 text-white font-semibold">
            Overview
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-zinc-400 hover:text-white">
            Inflows
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Executive Telemetry</h1>
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
import { Terminal, Copy, Check, Star } from "lucide-react";

export default function DevtoolsCliTemplate() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-h-screen bg-[#090a10] text-zinc-100 font-mono p-6">
      <header className="flex justify-between items-center mb-12">
        <span className="font-bold text-sm">HyperTerminal</span>
      </header>
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

import React from "react";
import { ArrowUpRight, Award, X } from "lucide-react";

export default function CreativePortfolioTemplate() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-serif p-8">
      <header className="flex justify-between items-center mb-16 font-sans">
        <span className="font-bold uppercase tracking-tight">Studio Monolith</span>
      </header>
      <h1 className="text-5xl font-light leading-tight mb-12">
        Sculpting singular digital experiences for luxury institutions.
      </h1>
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
import { CreditCard, Send, Lock, Unlock, ShieldCheck } from "lucide-react";

export default function FintechAppTemplate() {
  const [frozen, setFrozen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans p-6">
      <h1 className="text-2xl font-bold mb-4">Apex Treasury</h1>
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

import React from "react";
import { ShoppingBag, Heart, Truck, RotateCcw } from "lucide-react";

export default function EcommerceStoreTemplate() {
  return (
    <div className="min-h-screen bg-[#0c0d12] text-zinc-100 p-8">
      <h1 className="text-3xl font-bold">Atelier Objects</h1>
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

import React from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function AgencyCreativeTemplate() {
  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 p-8 font-sans">
      <h1 className="text-6xl font-black uppercase">Vanguard Digital</h1>
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
import { Send, Cpu, Copy, Check } from "lucide-react";

export default function AiChatTemplate() {
  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 flex p-4 font-sans">
      <div className="flex-1">Cortex AI Assistant</div>
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
import { Plus, Kanban } from "lucide-react";

export default function ProjectManagementTemplate() {
  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 p-6 font-sans">
      <h1 className="text-xl font-bold">Orbit Flow</h1>
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

import React, { useState } from "react";
import { ArrowRight, Clock, Users } from "lucide-react";

export default function StartupWaitlistTemplate() {
  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 p-8 text-center flex flex-col justify-center">
      <h1 className="text-5xl font-extrabold mb-4">Genesis Stealth</h1>
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
import { Search, Code2, Send } from "lucide-react";

export default function DocsPlatformTemplate() {
  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 p-6">
      <h1 className="text-3xl font-bold">Codex Documentation</h1>
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
import { motion } from "framer-motion";
import { Activity, Heart, Calendar, Pill, CheckCircle2, Video, TrendingUp } from "lucide-react";

export default function HealthcarePortalTemplate() {
  const [checkedMeds, setCheckedMeds] = useState<string[]>(["med-1"]);

  const vitals = [
    { label: "Resting Heart Rate", value: "64", unit: "BPM", delta: "-3 bpm vs avg", status: "Optimal" },
    { label: "Blood Oxygen (SpO2)", value: "98.8", unit: "%", delta: "+0.4% healthy", status: "Optimal" },
    { label: "Sleep Recovery", value: "88", unit: "/100", delta: "7h 42m deep sleep", status: "High" },
    { label: "Heart Rate Var.", value: "58", unit: "ms", delta: "+7ms resilience", status: "Normal" },
  ];

  const medications = [
    { id: "med-1", name: "Atorvastatin Calcium", dose: "20mg \u2022 Morning with meal", days: "24 days left" },
    { id: "med-2", name: "Omega-3 Pure EPA/DHA", dose: "1000mg \u2022 Midday with water", days: "18 days left" },
    { id: "med-3", name: "Magnesium Glycinate", dose: "400mg \u2022 Evening before sleep", days: "6 days left" },
  ];

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 font-sans p-6 sm:p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-teal-400">PulseCare Telehealth</span>
          <h1 className="text-2xl font-bold">Patient Health Telemetry</h1>
        </div>
        <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-2">
          <Video className="h-3.5 w-3.5" />
          <span>Book Specialist</span>
        </button>
      </header>

      <main className="max-w-6xl mx-auto py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {vitals.map((v) => (
            <div key={v.label} className="p-4 rounded-2xl border border-white/10 bg-[#12141c]">
              <span className="text-xs text-zinc-400">{v.label}</span>
              <div className="text-2xl sm:text-3xl font-bold font-mono my-1">
                {v.value} <span className="text-xs font-normal opacity-60">{v.unit}</span>
              </div>
              <span className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {v.delta}
              </span>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#12141c] space-y-4">
          <h2 className="font-bold text-base flex items-center gap-2">
            <Pill className="h-4 w-4 text-teal-400" />
            <span>Daily Prescriptions</span>
          </h2>
          <div className="space-y-2">
            {medications.map((m) => {
              const isDone = checkedMeds.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() =>
                    setCheckedMeds((prev) =>
                      prev.includes(m.id) ? prev.filter((i) => i !== m.id) : [...prev, m.id]
                    )
                  }
                  className="p-3.5 rounded-xl border border-white/5 bg-[#181a24] flex items-center justify-between cursor-pointer hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={\`w-5 h-5 rounded-lg border flex items-center justify-center \${
                        isDone ? "bg-teal-600 border-teal-600 text-white" : "border-zinc-500"
                      }\`}
                    >
                      {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <div className={\`text-xs font-semibold \${isDone ? "line-through opacity-50" : ""}\`}>
                        {m.name}
                      </div>
                      <div className="text-[10px] text-zinc-400">{m.dose}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{m.days}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
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
import { ArrowDownUp, Zap, Wallet, TrendingUp } from "lucide-react";

export default function Web3DexTemplate() {
  const [fromAmount, setFromAmount] = useState("1.5");
  const [isSwapping, setIsSwapping] = useState(false);

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-3xl border border-white/10 bg-[#12141c] space-y-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <span className="font-bold text-base">NovaSwap DEX</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">12 Gwei</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/5 bg-[#181a24] space-y-1">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>You Pay</span>
            <span>Balance: 4.82 ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-2xl font-mono font-bold bg-transparent outline-none w-1/2"
            />
            <span className="px-3 py-1 rounded-xl bg-white/10 font-bold text-xs">ETH</span>
          </div>
        </div>

        <div className="flex justify-center -my-2">
          <div className="p-2 rounded-xl bg-[#12141c] border border-white/10">
            <ArrowDownUp className="h-4 w-4 text-cyan-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-white/5 bg-[#181a24] space-y-1">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>You Receive (Est.)</span>
            <span>Balance: 14,850 USDC</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-2xl font-mono font-bold">
              {(parseFloat(fromAmount || "0") * 2640.5).toFixed(2)}
            </div>
            <span className="px-3 py-1 rounded-xl bg-white/10 font-bold text-xs">USDC</span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsSwapping(true);
            setTimeout(() => setIsSwapping(false), 1200);
          }}
          className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-cyan-600 hover:bg-cyan-500 shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Zap className="h-4 w-4" />
          <span>{isSwapping ? "Routing via Smart Contract..." : "Swap Tokens"}</span>
        </button>
      </div>
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
import { BookOpen, CheckCircle2, Code2, Award, Flame, Play } from "lucide-react";

export default function EdtechLearningTemplate() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(1);
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 font-sans p-6 sm:p-8">
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <span className="font-bold text-base">Polymath Academy</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
          <Flame className="h-3.5 w-3.5 fill-current" />
          <span>14 Day Streak</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-[#12141c] space-y-4">
          <div className="text-xs font-mono text-zinc-400">Module 2 \u2022 Lesson 2.2</div>
          <h1 className="text-2xl font-bold">Raft Consensus & Majority Quorums</h1>
          <p className="text-xs text-zinc-300 leading-relaxed">
            In Raft, a cluster of 5 nodes requires an affirmative vote from at least 3 nodes before committing any state machine transition.
          </p>

          <div className="space-y-2 pt-2">
            {[
              "Any follower can commit independently without Leader confirmation.",
              "A quorum majority (3 of 5 nodes) ensures overlapping sets and prevents split-brain.",
              "Logs are replicated only during leader step-down events.",
            ].map((ans, i) => (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={\`w-full p-3.5 rounded-xl border text-left text-xs transition-colors \${
                  selectedIdx === i
                    ? "border-emerald-500 bg-emerald-500/10 text-white font-semibold"
                    : "border-white/10 bg-[#181a24] text-zinc-300"
                }\`}
              >
                {ans}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsDone(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-2 mt-4"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{isDone ? "Solution Verified \u2713 (+150 XP)" : "Verify Solution"}</span>
          </button>
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
import { Calendar, MapPin, Ticket, Sparkles, Check } from "lucide-react";

export default function ConferenceEventTemplate() {
  const [selectedDay, setSelectedDay] = useState("day-1");

  const schedule = [
    { time: "09:00 AM", title: "Opening Keynote: Autonomous Inference at Edge", speaker: "Dr. Elena Vance" },
    { time: "11:00 AM", title: "Deterministic Design Systems for 100M+ Users", speaker: "Marcus Sterling" },
    { time: "02:00 PM", title: "Zero-Downtime eBPF State Replication", speaker: "Hiroshi Tanaka" },
  ];

  return (
    <div className="min-h-screen bg-[#08090e] text-zinc-100 font-sans p-6 sm:p-12">
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <span className="font-extrabold text-base tracking-tight">Vertex Summit 2027</span>
        <button className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md">
          Claim Pass
        </button>
      </header>

      <main className="max-w-4xl mx-auto py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
          <Calendar className="h-3.5 w-3.5" />
          <span>October 14\u201316, 2027 \u2022 San Francisco, CA & Virtual</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          The Convergence of Autonomous Systems
        </h1>

        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Gathering 4,500+ systems engineers and AI leaders to build the future of software infrastructure.
        </p>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#12141c] text-left space-y-3 mt-8">
          <h2 className="font-bold text-sm">Day 1 Schedule (Oct 14)</h2>
          <div className="space-y-2">
            {schedule.map((item) => (
              <div key={item.time} className="p-3 rounded-xl border border-white/5 bg-[#181a24] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold">{item.title}</div>
                  <div className="text-[10px] text-zinc-400">{item.speaker}</div>
                </div>
                <span className="font-mono text-purple-400 font-bold">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
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

import React, { useState } from "react";
import { Headphones, Play, Pause, RotateCcw, RotateCw, Download } from "lucide-react";

export default function AudioPodcastTemplate() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(255); // 04:15

  const chapters = [
    { time: "00:00", title: "Cold Open & Benchmarks" },
    { time: "04:15", title: "Lockless Ring Buffers vs Channels" },
    { time: "18:40", title: "Kernel-Bypass Networking with io_uring" },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans p-6 pb-24">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-indigo-400" />
          <span className="font-bold text-base">EchoWave Studio</span>
        </div>
        <button className="px-3.5 py-1.5 rounded-xl border border-white/10 text-xs hover:bg-white/10">
          Subscribe RSS
        </button>
      </header>

      <main className="max-w-4xl mx-auto py-10 space-y-6">
        <div className="p-6 rounded-2xl border border-white/10 bg-[#12141c] space-y-3">
          <span className="text-xs font-mono text-indigo-400">Episode 148 \u2022 54m 20s</span>
          <h1 className="text-2xl sm:text-3xl font-bold">Zero-Cost Abstractions & High-Throughput I/O</h1>
          <p className="text-xs text-zinc-400">Featuring Linus M. Discussing memory barriers and lock-free concurrency queues.</p>
        </div>

        <div className="space-y-2">
          <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Chapters</h2>
          {chapters.map((ch) => (
            <div key={ch.time} className="p-3.5 rounded-xl border border-white/10 bg-[#12141c] flex items-center justify-between text-xs">
              <span>{ch.title}</span>
              <span className="font-mono text-indigo-400">{ch.time}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 inset-x-0 p-4 border-t border-white/10 bg-[#08090d]/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
          </button>
          <span className="text-xs font-mono text-zinc-400">04:15 / 54:20</span>
        </div>
      </footer>
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
import { Building2, MapPin, Calendar, Users, Check } from "lucide-react";

export default function RealEstateTemplate() {
  const [nights, setNights] = useState(4);
  const baseRate = 2450;

  return (
    <div className="min-h-screen bg-[#0c0d12] text-zinc-100 font-sans p-6 sm:p-12">
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <span className="font-serif text-base uppercase tracking-widest font-light">Haven Luxury Estates</span>
        <span className="text-xs uppercase tracking-widest font-mono text-zinc-400">Aspen \u2022 Kyoto \u2022 Zurich</span>
      </header>

      <main className="max-w-5xl mx-auto py-12 space-y-8">
        <div className="space-y-3">
          <div className="text-xs font-mono text-zinc-400">Aspen Valley, Colorado \u2022 Residence #04</div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light">The Obsidian Pavilion</h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            A 9,400 sq.ft cantilevered cedar and blackened steel retreat with panoramic mountain views and private helipad.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[#14161f] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="text-xs text-zinc-400">Nightly Rate: $2,450 USD</div>
            <div className="text-2xl font-serif font-bold mt-0.5">
              \${(baseRate * nights).toLocaleString()} USD <span className="text-xs font-sans font-normal text-zinc-400">({nights} nights)</span>
            </div>
          </div>
          <button className="px-6 py-3 rounded-xl text-xs font-serif uppercase tracking-wider font-bold bg-white text-black hover:bg-zinc-200 shadow-md">
            Reserve Residence
          </button>
        </div>
      </main>
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
import { CheckCircle2, ShieldCheck, Server, Bell, Globe } from "lucide-react";

export default function UptimeStatusTemplate() {
  const services = [
    { name: "Global Anycast Edge CDN", uptime: "100.0%", ping: "11ms" },
    { name: "Authentication Engine & SSO", uptime: "99.99%", ping: "24ms" },
    { name: "Distributed Vector Indexing", uptime: "99.97%", ping: "38ms" },
    { name: "PostgreSQL Database Clusters", uptime: "99.95%", ping: "14ms" },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans p-6 sm:p-12">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-bold text-base">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <span>Beacon Status</span>
        </div>
        <button className="px-3.5 py-1.5 rounded-xl border border-white/10 text-xs hover:bg-white/10 flex items-center gap-1.5">
          <Bell className="h-3.5 w-3.5" />
          <span>Subscribe</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto py-10 space-y-6">
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs text-emerald-400 font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>All Core Services Operational \u2014 99.994% Availability</span>
          </div>
          <span className="font-mono">Past 90 Days</span>
        </div>

        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.name} className="p-4 rounded-xl border border-white/10 bg-[#12141c] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold">{s.name}</div>
                <div className="text-[10px] text-zinc-400 font-mono">Latency: {s.ping}</div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">{s.uptime}</span>
            </div>
          ))}
        </div>
      </main>
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
import { Play, Zap, Database, Cpu, Send, CheckCircle2 } from "lucide-react";

export default function AgentWorkflowTemplate() {
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState<string | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setLog("Trigger received. Querying vector database...");
    setTimeout(() => {
      setLog("Claude 3.5 Sonnet generated solution. Dispatching webhook...");
      setTimeout(() => {
        setIsRunning(false);
        setLog("\u2713 Execution completed in 680ms. Payload delivered.");
      }, 700);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 font-sans p-6 sm:p-12">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <span className="font-bold text-base">Nexus Nodes Canvas</span>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 flex items-center gap-2 shadow-md"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>{isRunning ? "Running..." : "Test Workflow"}</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto py-12 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { name: "Webhook Ingress", icon: Zap, color: "text-amber-400" },
            { name: "Pinecone Retrieval", icon: Database, color: "text-cyan-400" },
            { name: "Claude 3.5 Reasoning", icon: Cpu, color: "text-blue-400" },
            { name: "Slack Dispatcher", icon: Send, color: "text-emerald-400" },
          ].map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.name} className="p-4 rounded-2xl border border-white/10 bg-[#12141c] space-y-2 text-xs">
                <Icon className={\`h-4 w-4 \${n.color}\`} />
                <div className="font-bold">{n.name}</div>
              </div>
            );
          })}
        </div>

        {log && (
          <div className="p-4 rounded-xl border border-white/10 bg-[#06070a] font-mono text-xs text-blue-400">
            {log}
          </div>
        )}
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
import { Utensils, Calendar, Users, Award, Wine } from "lucide-react";

export default function RestaurantCulinaryTemplate() {
  const [guests, setGuests] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0e0d0b] text-[#f5f2eb] font-sans p-6 sm:p-12">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-[#2e2b24]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500">Komorebi Gastronomy</span>
          <h1 className="text-xl font-serif">Contemporary Seasonal Dining</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-serif">
          <Award className="h-4 w-4" />
          <span>Two Michelin Stars</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-light">Autumn Tasting Menu (8 Courses)</h2>
          <p className="text-xs text-[#b8b3a5] max-w-xl mx-auto">
            Hokkaido sea urchin, wild matsutake, and binchotan-charred Miyazaki A5 wagyu tenderloin.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-[#2e2b24] bg-[#171512] max-w-md mx-auto space-y-4">
          <div className="font-serif font-bold text-sm">Table Reservation</div>
          <div className="flex gap-2">
            {[2, 4, 6].map((g) => (
              <button
                key={g}
                onClick={() => setGuests(g)}
                className={\`flex-1 py-2 rounded-xl border text-xs font-serif \${
                  guests === g ? "bg-amber-700 text-white border-amber-700" : "border-[#2e2b24] text-[#b8b3a5]"
                }\`}
              >
                {g} Guests
              </button>
            ))}
          </div>

          <button
            onClick={() => setConfirmed(true)}
            className="w-full py-3 rounded-xl font-serif uppercase tracking-widest text-xs font-bold text-white bg-amber-700 hover:bg-amber-600 shadow-lg"
          >
            {confirmed ? "Table Reserved \u2713" : "Reserve Table for " + guests}
          </button>
        </div>
      </main>
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
import { Search, LifeBuoy, CreditCard, ShieldCheck, Code2, ChevronDown } from "lucide-react";

export default function HelpCenterTemplate() {
  const [query, setQuery] = useState("");

  const categories = [
    { title: "Getting Started", icon: LifeBuoy, count: "14 articles" },
    { title: "Billing & Invoicing", icon: CreditCard, count: "9 articles" },
    { title: "Security & 2FA", icon: ShieldCheck, count: "18 articles" },
    { title: "Developer API", icon: Code2, count: "22 articles" },
  ];

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 font-sans p-6 sm:p-12">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-white/10">
        <span className="font-bold text-base">Resolv Support Desk</span>
        <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md">
          Submit Ticket
        </button>
      </header>

      <main className="max-w-4xl mx-auto py-12 space-y-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold">How can our support team help you?</h1>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 opacity-50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides, 2FA, billing..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#12141c] text-xs outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="p-4 rounded-2xl border border-white/10 bg-[#12141c] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold">{c.title}</div>
                    <div className="text-[10px] text-zinc-400">{c.count}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
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
import { Activity, Heart, Flame, Trophy, Timer, Plus, CheckCircle2 } from "lucide-react";

export default function FitnessAthleticsTemplate() {
  const [bpm, setBpm] = useState(158);
  const [intervals, setIntervals] = useState([
    { title: "Dynamic Hip Mobility", target: "10 min \u2022 Zone 1", done: true },
    { title: "Progressive Aerobic Build", target: "15 min @ 140 BPM", done: true },
    { title: "4 x 1,000m Lactate Repeats", target: "4 reps @ 3:42/km", done: false },
  ]);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          <span className="font-bold text-base">AeroPulse Athletics</span>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
          Recovery: 88% Ready
        </div>
      </header>

      <main className="py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
            <span className="text-xs opacity-70">Daily Strain</span>
            <div className="text-2xl font-extrabold mt-1">14.8 / 21.0</div>
          </div>
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
            <span className="text-xs opacity-70">Current Target BPM</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">{bpm} BPM</div>
          </div>
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
            <span className="text-xs opacity-70">Resting Heart Rate</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">48 bpm</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Cardio Zone Spectrum</h3>
          <input
            type="range"
            min="100"
            max="195"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-wilderness-travel.ts
var templateWildernessTravel = {
  name: "template-wilderness-travel",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-wilderness-travel.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Compass, Mountain, Scale, Radio, Tent } from "lucide-react";

export default function WildernessTravelTemplate() {
  const [baseWeight, setBaseWeight] = useState(6.4);
  const [foodDays, setFoodDays] = useState(6);
  const totalWeight = (baseWeight + foodDays * 0.75 + 2.0).toFixed(1);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-base">NomadRoute Expeditions</span>
        </div>
        <button className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600">
          Reserve Permits
        </button>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-xl font-extrabold mb-1">Patagonia High Icefield Crossing</h2>
          <p className="text-xs opacity-70">148 km \u2022 +6,850m Cumulative Gain \u2022 8 Days</p>
        </div>

        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Skin-Out Pack Weight: {totalWeight} kg</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">Ultralight Load</span>
          </div>
          <input
            type="range"
            min="4.0"
            max="12.0"
            step="0.2"
            value={baseWeight}
            onChange={(e) => setBaseWeight(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-devops-kubernetes.ts
var templateDevopsKubernetes = {
  name: "template-devops-kubernetes",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-devops-kubernetes.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Server, Cpu, Database, Terminal, Search, SlidersHorizontal } from "lucide-react";

export default function DevopsKubernetesTemplate() {
  const [canary, setCanary] = useState(15);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-mono max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b font-sans" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-base">KubeOrbit Cloud</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-mono">
          242/248 Pods Healthy
        </span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border font-sans" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Canary Ingress Weight: {canary}%</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={canary}
            onChange={(e) => setCanary(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-audio-daw.ts
var templateAudioDaw = {
  name: "template-audio-daw",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-audio-daw.tsx",
  content: `"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, Disc, Sliders, Volume2, ShoppingBag } from "lucide-react";

export default function AudioDawTemplate() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(140);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => setStep((s) => (s + 1) % 16), (60 / bpm / 4) * 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, bpm]);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Disc className="w-5 h-5 text-purple-600" />
          <span className="font-bold text-base">SoundForge Studio</span>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 flex items-center gap-1.5">
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? "Pause" : "Play Groove"}</span>
        </button>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm">16-Step Beat Grid ({bpm} BPM)</h3>
            <span className="font-mono text-xs opacity-60">Step {step + 1} / 16</span>
          </div>
          <div className="grid grid-cols-16 gap-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={\`h-10 rounded border \${step === i && isPlaying ? "bg-purple-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}\`} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-gamified-habits.ts
var templateGamifiedHabits = {
  name: "template-gamified-habits",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-gamified-habits.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Shield, Sword, Sparkles, Coins, Flame, CheckCircle2 } from "lucide-react";

export default function GamifiedHabitsTemplate() {
  const [xp, setXp] = useState(2450);
  const [gold, setGold] = useState(1420);
  const [quests, setQuests] = useState([
    { id: 1, title: "Slay 90m Deep Focus Work Block", xp: 180, done: false },
    { id: 2, title: "Drink 2.5L Water Elixir", xp: 60, done: true },
  ]);

  const toggle = (id: number, questXp: number) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id && !q.done) {
          setXp((x) => x + questXp);
          setGold((g) => g + 40);
          return { ...q, done: true };
        }
        return q;
      })
    );
  };

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-base">QuestCraft RPG</span>
        </div>
        <div className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1">
          <Coins className="w-3.5 h-3.5" />
          <span>{gold} Gold</span>
        </div>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="font-extrabold text-base mb-1">Level 14 Paladin \u2022 {xp} / 3,000 XP</h2>
          <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: \`\${(xp / 3000) * 100}%\` }} />
          </div>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-global-logistics.ts
var templateGlobalLogistics = {
  name: "template-global-logistics",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-global-logistics.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Ship, Truck, Thermometer, Anchor, Navigation } from "lucide-react";

export default function GlobalLogisticsTemplate() {
  const [activeStage, setActiveStage] = useState(2);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Anchor className="w-5 h-5 text-cyan-600" />
          <span className="font-bold text-base">Vanguard Logistics</span>
        </div>
        <span className="text-xs font-mono text-emerald-600 font-bold">14 Vessels Active</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <span className="text-xs font-mono opacity-60">MASTER BILL OF LADING</span>
          <h2 className="text-xl font-extrabold font-mono mt-1">BOL-849204-HKG</h2>
          <p className="text-xs opacity-70 mt-1">Shenzhen (YTN) &rarr; Rotterdam Gateway (RTM)</p>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-gaming-esports.ts
var templateGamingEsports = {
  name: "template-gaming-esports",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-gaming-esports.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Trophy, Tv, Users, Target, Crown } from "lucide-react";

export default function GamingEsportsTemplate() {
  const [votes, setVotes] = useState(64);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-rose-500" />
          <span className="font-bold text-base">Valkyrie Esports</span>
        </div>
        <span className="text-xs font-bold text-rose-500 font-mono">LIVE \u2022 284k Viewers</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="font-extrabold text-lg">Sentinels (11)</div>
          <div className="font-mono text-xs opacity-60">Map 5 Inferno</div>
          <div className="font-extrabold text-lg">Cloud9 (9)</div>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-architecture-spatial.ts
var templateArchitectureSpatial = {
  name: "template-architecture-spatial",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-architecture-spatial.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Layers, Sun, Building, FileText } from "lucide-react";

export default function ArchitectureSpatialTemplate() {
  const [hour, setHour] = useState(13);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-base">Arcform Spatial</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono">
          LEED Platinum \u2022 620 m\xB2
        </span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Solar Daylight Azimuth ({hour}:00 JST)</h3>
          <input
            type="range"
            min="8"
            max="18"
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="w-full accent-amber-600"
          />
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-cybersecurity-soc.ts
var templateCybersecuritySoc = {
  name: "template-cybersecurity-soc",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-cybersecurity-soc.tsx",
  content: `"use client";

import React, { useState } from "react";
import { ShieldAlert, Terminal, Lock, CheckCircle2 } from "lucide-react";

export default function CybersecuritySocTemplate() {
  const [quarantined, setQuarantined] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-mono max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b font-sans" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span className="font-bold text-base">Aegis SOC</span>
        </div>
        <button
          onClick={() => setQuarantined(!quarantined)}
          className={\`px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white \${quarantined ? "bg-gray-600" : "bg-rose-600"}\`}
        >
          {quarantined ? "Host Air-Gapped" : "Isolate Host"}
        </button>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs text-rose-600 font-bold mb-1">CRITICAL \u2022 MITRE T1021.002</div>
          <h2 className="text-base font-extrabold font-sans">Pass-the-Hash Lateral Movement via SMB</h2>
          <p className="text-xs opacity-70 mt-1">Target Host: srv-dc-primary-01.internal (10.240.12.8)</p>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-cleantech-agriculture.ts
var templateCleantechAgriculture = {
  name: "template-cleantech-agriculture",
  dependencies: ["framer-motion", "lucide-react"],
  fileName: "template-cleantech-agriculture.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Sprout, Droplets, Sun, Wind, Leaf } from "lucide-react";

export default function CleantechAgricultureTemplate() {
  const [ph, setPh] = useState(6.2);
  const [red, setRed] = useState(65);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-base">Verdant IoT</span>
        </div>
        <span className="text-xs font-mono text-emerald-600 font-bold">98.4% Water Recycled</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Hydroponic pH Level: {ph}</h3>
          <input
            type="range"
            min="5.5"
            max="7.0"
            step="0.1"
            value={ph}
            onChange={(e) => setPh(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-juris-vault.ts
var templateJurisVault = {
  name: "template-juris-vault",
  dependencies: ["lucide-react"],
  fileName: "template-juris-vault.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Scale, FileText, CheckCircle2, AlertTriangle, PenTool } from "lucide-react";

export default function JurisVaultTemplate() {
  const [signed, setSigned] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-base">JurisVault AI</span>
        </div>
        <button
          onClick={() => setSigned(true)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 transition-opacity hover:opacity-90"
        >
          {signed ? "Executed & Signed" : "Approve & E-Sign"}
        </button>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs text-rose-600 font-bold mb-1">CRITICAL RISK \u2022 SEC-8.2</div>
          <h2 className="text-base font-bold">Limitation of Liability & Consequential Damages</h2>
          <p className="text-xs opacity-70 mt-2">Counterparty proposes uncapped liability. Recommended: Insert 2x ACV fallback clause.</p>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-orbitalx-mission.ts
var templateOrbitalxMission = {
  name: "template-orbitalx-mission",
  dependencies: ["lucide-react"],
  fileName: "template-orbitalx-mission.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Satellite, Radio, Compass, Zap, Terminal } from "lucide-react";

export default function OrbitalXTemplate() {
  const [armed, setArmed] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-mono max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b font-sans" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-base">OrbitalX Operations</span>
        </div>
        <span className="text-xs font-mono text-emerald-500 font-bold">AOS in 04m 12s</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs opacity-60">ORBITAL VELOCITY: 7.58 km/s \u2022 LEO 545 km</div>
          <h2 className="text-base font-bold font-sans mt-1">AstraConstellation-07 (NORAD 58210)</h2>
          <p className="text-xs opacity-75 mt-2">Propellant: 78.4% Hydrazine \u2022 Solar: 1,420 W Nominal</p>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-cineboard-studio.ts
var templateCineboardStudio = {
  name: "template-cineboard-studio",
  dependencies: ["lucide-react"],
  fileName: "template-cineboard-studio.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Clapperboard, Film, Camera, Video } from "lucide-react";

export default function CineBoardTemplate() {
  const [ratio, setRatio] = useState("2.39:1");

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Clapperboard className="w-5 h-5 text-rose-600" />
          <span className="font-bold text-base">CineBoard Studio</span>
        </div>
        <div className="text-xs font-mono font-bold bg-rose-600/10 text-rose-600 px-2 py-1 rounded">
          Framing: {ratio}
        </div>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-base font-bold">SCENE 14A \u2022 SHOT 01 (EXT. HIGHWAY DUSK)</h2>
          <p className="text-xs opacity-75 mt-1">Cooke Anamorphic 40mm T2.3 \u2022 Drone Push-In (3.2m/s)</p>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-domus-living.ts
var templateDomusLiving = {
  name: "template-domus-living",
  dependencies: ["lucide-react"],
  fileName: "template-domus-living.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Home, Thermometer, Sun, Zap, ShieldCheck } from "lucide-react";

export default function DomusLivingTemplate() {
  const [temp, setTemp] = useState(21.5);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-base">Domus Living</span>
        </div>
        <span className="text-xs font-semibold text-emerald-600">Perimeter Armed</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h3 className="font-bold text-sm mb-2">Living Pavilion Climate: {temp}\xB0C</h3>
          <input
            type="range"
            min="18.0"
            max="26.0"
            step="0.5"
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-hyperion-ev.ts
var templateHyperionEv = {
  name: "template-hyperion-ev",
  dependencies: ["lucide-react"],
  fileName: "template-hyperion-ev.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Car, BatteryCharging, Zap, Gauge } from "lucide-react";

export default function HyperionEvTemplate() {
  const [soc, setSoc] = useState(74);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-cyan-600" />
          <span className="font-bold text-base">Hyperion Fleet EV</span>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-600">{soc}% SoC</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-base font-bold">Hyperion Freight Hauler Max (CA-941-EV)</h2>
          <p className="text-xs opacity-75 mt-1">Usable Capacity: 210 kWh / 280 kWh \u2022 780V Architecture</p>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-sovereign-auctions.ts
var templateSovereignAuctions = {
  name: "template-sovereign-auctions",
  dependencies: ["lucide-react"],
  fileName: "template-sovereign-auctions.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Gavel, ShieldCheck, DollarSign, Award } from "lucide-react";

export default function SovereignAuctionsTemplate() {
  const [bid, setBid] = useState(2450000);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Gavel className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-base">Sovereign Auctions</span>
        </div>
        <span className="text-xs font-mono font-bold text-amber-600">\${bid.toLocaleString()}</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs opacity-60">LOT 24 \u2022 EVENING SALE LONDON</div>
          <h2 className="text-base font-bold mt-1">Composition in Cadmium & Cobalt Resonance, 1988</h2>
          <button
            onClick={() => setBid(bid + 50000)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 transition-opacity hover:opacity-90"
          >
            Raise Bid +$50,000
          </button>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-scholaris-archive.ts
var templateScholarisArchive = {
  name: "template-scholaris-archive",
  dependencies: ["lucide-react"],
  fileName: "template-scholaris-archive.tsx",
  content: `"use client";

import React, { useState } from "react";
import { BookOpen, FileText, Download, Award } from "lucide-react";

export default function ScholarisArchiveTemplate() {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-600" />
          <span className="font-bold text-base">Scholaris Archive</span>
        </div>
        <span className="text-xs font-mono text-emerald-600 font-bold">Reproducibility: 9.8/10</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs text-sky-600 font-mono font-bold mb-1">DOI: 10.1038/s41586-026-09214-x</div>
          <h2 className="text-base font-bold">Sub-Quadratic Attention via Orthogonal State Space Projections</h2>
          <p className="text-xs opacity-75 mt-2">Dr. Evelyn Zhao (Stanford) \u2022 Prof. Kenneth Sterling (MIT)</p>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-talentorbit-hr.ts
var templateTalentorbitHr = {
  name: "template-talentorbit-hr",
  dependencies: ["lucide-react"],
  fileName: "template-talentorbit-hr.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Users, Calendar, Award, MapPin } from "lucide-react";

export default function TalentOrbitTemplate() {
  const [ptoDays, setPtoDays] = useState(18);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-600" />
          <span className="font-bold text-base">TalentOrbit HR</span>
        </div>
        <span className="text-xs font-semibold text-violet-600">{ptoDays} Days PTO Left</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <h2 className="text-base font-bold">Sophia Lindqvist \u2022 VP of Engineering</h2>
          <p className="text-xs opacity-70 mt-1">Stockholm (UTC+1) \u2022 24 Direct Reports \u2022 Top Performer (9-Box 1A)</p>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-miseenplace-kds.ts
var templateMiseenplaceKds = {
  name: "template-miseenplace-kds",
  dependencies: ["lucide-react"],
  fileName: "template-miseenplace-kds.tsx",
  content: `"use client";

import React, { useState } from "react";
import { UtensilsCrossed, Flame, Clock, Check } from "lucide-react";

export default function MiseEnPlaceTemplate() {
  const [bumped, setBumped] = useState(false);

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-orange-600" />
          <span className="font-bold text-base">MiseEnPlace KDS</span>
        </div>
        <span className="text-xs font-mono font-bold text-orange-600">3 ACTIVE ORDERS</span>
      </header>

      <main className="py-8 space-y-6">
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="text-xs font-mono font-bold text-rose-600 mb-1">TABLE 12 \u2022 04:15 ELAPSED</div>
          <h2 className="text-base font-bold">2x 45-Day Dry Aged Ribeye (Med-Rare)</h2>
          <p className="text-xs opacity-75 mt-1">Station: GRILL \u2022 Extra flaky Maldon salt</p>
          <button
            onClick={() => setBumped(true)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 transition-opacity hover:opacity-90"
          >
            {bumped ? "Order Bumped" : "Bump Order"}
          </button>
        </div>
      </main>
    </div>
  );
}`
};

// src/registry/template-aurasolace-sanctuary.ts
var templateAurasolaceSanctuary = {
  name: "template-aurasolace-sanctuary",
  dependencies: ["lucide-react"],
  fileName: "template-aurasolace-sanctuary.tsx",
  content: `"use client";

import React, { useState } from "react";
import { Heart, Wind, Volume2, Sparkles } from "lucide-react";

export default function AuraSolaceTemplate() {
  const [phase, setPhase] = useState("Inhale (4s)");

  return (
    <div
      className="min-h-screen transition-colors text-left p-6 font-sans max-w-5xl mx-auto"
      style={{
        backgroundColor: "var(--template-bg, #ffffff)",
        color: "var(--template-fg, #0f172a)",
      }}
    >
      <header className="flex justify-between items-center pb-6 border-b" style={{ borderColor: "var(--template-border, #e2e8f0)" }}>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-teal-600" />
          <span className="font-bold text-base">AuraSolace Sanctuary</span>
        </div>
        <span className="text-xs font-semibold text-teal-600">Peaceful Grounded</span>
      </header>

      <main className="py-8 space-y-6 text-center">
        <div className="p-8 rounded-2xl border" style={{ backgroundColor: "var(--template-surface, #f8f9fa)", borderColor: "var(--template-border, #e2e8f0)" }}>
          <div className="w-32 h-32 rounded-full border-2 border-teal-500 mx-auto flex items-center justify-center font-bold text-xs text-teal-600">
            {phase}
          </div>
          <h2 className="text-base font-bold mt-4">Parasympathetic Nervous System Regulation</h2>
        </div>
      </main>
    </div>
  );
}`
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
  const tsConfigPath = path4.join(baseDir, "tsconfig.json");
  const jsConfigPath = path4.join(baseDir, "jsconfig.json");
  const targetConfig = fs4.existsSync(tsConfigPath) ? tsConfigPath : fs4.existsSync(jsConfigPath) ? jsConfigPath : null;
  if (targetConfig) {
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
    const existingContent = fs4.readFileSync(cssAbsolutePath, "utf8");
    if (!existingContent.includes("--color-primary") && !existingContent.includes("nexoreui/dist")) {
      fs4.writeFileSync(cssAbsolutePath, existingContent.trim() + "\n" + themeBlock, "utf8");
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
  console.log(`\x1B[33m\u26A1 Scaffolding React + Vite + Tailwind CSS template...\x1B[0m`);
  try {
    (0, import_child_process3.execSync)(`npm create vite@latest ${name} -- --template react-ts`, { stdio: "inherit" });
  } catch (err) {
    console.error(`\x1B[31mFailed to scaffold Vite project.\x1B[0m`);
    return;
  }
  process.chdir(targetDir);
  console.log(`
\x1B[33m\u{1F4E6} Installing NexoreUI, Tailwind CSS, and core packages...\x1B[0m`);
  (0, import_child_process3.execSync)(`npm install nexoreui lucide-react clsx tailwind-merge framer-motion @tailwindcss/vite tailwindcss`, {
    stdio: "inherit"
  });
  await initCommand({
    yes: true,
    theme: options.theme || "cyan",
    radius: options.radius || "1.0"
  });
  console.log(`
\x1B[32m\x1B[1m\u2728 Project ${name} is ready!\x1B[0m`);
  console.log(`
To get started:
`);
  console.log(`  \x1B[36mcd ${name}\x1B[0m`);
  console.log(`  \x1B[36mnpx nexoreui add button card modal table --all\x1B[0m`);
  console.log(`  \x1B[36mnpm run dev\x1B[0m
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
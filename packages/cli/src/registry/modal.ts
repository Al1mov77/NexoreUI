export const modal = {
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
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  children?: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  default: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-5xl",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'default',
  children,
  className,
}: ModalProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }
            }
            className={cn(
              "relative w-full overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-2xl z-10",
              sizeClasses[size],
              className
            )}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-md p-1 opacity-70 hover:opacity-100 hover:bg-muted/40 transition-all select-none cursor-pointer"
            >
              <X size={16} className="text-foreground" />
              <span className="sr-only">Close dialog</span>
            </button>

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

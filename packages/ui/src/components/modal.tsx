'use client';

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

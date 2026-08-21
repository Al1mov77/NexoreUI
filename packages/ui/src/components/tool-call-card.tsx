'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Check,
  X,
  Clock,
  Wrench,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { ThinkingIndicator } from './thinking-indicator';

/**
 * CVA variants for the ToolCallCard container
 */
const toolCallCardVariants = cva(
  'w-full rounded-2xl border transition-all duration-300 overflow-hidden text-sm',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700/80 shadow-lg shadow-black/40',
        neon:
          'bg-black/90 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.12)]',
        glow:
          'bg-zinc-950/90 border-amber-500/30 hover:border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.12)]',
        cyberpunk:
          'bg-black border-yellow-500/40 hover:border-yellow-400/70 shadow-[0_0_20px_rgba(250,204,21,0.15)] font-mono',
      },
      status: {
        pending: 'opacity-75',
        running: '',
        success: '',
        error: 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      status: 'running',
    },
  }
);

/**
 * Props for the ToolCallCard component
 */
export interface ToolCallCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'>,
    VariantProps<typeof toolCallCardVariants> {
  /**
   * Name of the tool or function being called (e.g. "search_database", "read_file")
   */
  toolName: string;
  /**
   * Execution status of the tool call
   * @default "running"
   */
  status?: 'pending' | 'running' | 'success' | 'error';
  /**
   * Visual aesthetic theme matching NexoreUI indicator presets
   * @default "default"
   */
  variant?: 'default' | 'neon' | 'glow' | 'cyberpunk';
  /**
   * Optional parameters/arguments passed to the tool
   */
  args?: Record<string, any> | string;
  /**
   * Optional output/result returned from the tool call
   */
  result?: Record<string, any> | string | React.ReactNode;
  /**
   * Execution time or duration string (e.g. "240ms", "1.2s")
   */
  duration?: string | number;
  /**
   * Whether the card details start collapsed
   * @default false
   */
  isCollapsedByDefault?: boolean;
  /**
   * Callback fired when the user toggles the card's open/collapsed state
   */
  onToggle?: (isOpen: boolean) => void;
  /**
   * Custom icon component to represent the tool
   */
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * ToolCallCard Component
 *
 * A modern AI tool execution card component showcasing tool name, live execution status
 * (running with organic ThinkingIndicator, success, error, pending), formatted arguments,
 * output preview, and collapsible drawer.
 */
export const ToolCallCard = React.forwardRef<HTMLDivElement, ToolCallCardProps>(
  (
    {
      className,
      toolName,
      status = 'running',
      variant = 'default',
      args,
      result,
      duration,
      isCollapsedByDefault = false,
      onToggle,
      icon: CustomIcon,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(!isCollapsedByDefault);
    const [isCopied, setIsCopied] = React.useState(false);

    const handleToggle = () => {
      const next = !isOpen;
      setIsOpen(next);
      onToggle?.(next);
    };

    const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      const payload = JSON.stringify({ tool: toolName, args, result }, null, 2);
      navigator.clipboard.writeText(payload);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1800);
    };

    const formattedDuration =
      typeof duration === 'number' ? `${duration}ms` : duration;

    // Variant-specific styling tokens
    const themeStyles = {
      default: {
        badge: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
        activeHeader: 'bg-zinc-900/40',
        textAccent: 'text-zinc-100',
        codeBg: 'bg-zinc-900/90 border-zinc-800/60',
        statusColor: 'text-zinc-400',
      },
      neon: {
        badge: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30',
        activeHeader: 'bg-cyan-950/20',
        textAccent: 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]',
        codeBg: 'bg-black/80 border-cyan-500/20 text-cyan-200',
        statusColor: 'text-cyan-400',
      },
      glow: {
        badge: 'bg-amber-950/40 text-amber-200 border-amber-500/30',
        activeHeader: 'bg-amber-950/20',
        textAccent: 'text-amber-200',
        codeBg: 'bg-zinc-950/80 border-amber-500/20 text-amber-100',
        statusColor: 'text-amber-300',
      },
      cyberpunk: {
        badge: 'bg-yellow-950/40 text-yellow-300 border-yellow-500/40',
        activeHeader: 'bg-yellow-950/30',
        textAccent: 'text-yellow-300',
        codeBg: 'bg-black border-yellow-500/30 text-yellow-200 font-mono',
        statusColor: 'text-yellow-400',
      },
    }[variant || 'default'];

    return (
      <div
        ref={ref}
        className={cn(toolCallCardVariants({ variant, status }), className)}
        {...props}
      >
        {/* Header Bar */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
          aria-expanded={isOpen}
          className={cn(
            'w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-primary/50',
            isOpen ? themeStyles.activeHeader : 'hover:bg-zinc-900/30'
          )}
        >
          {/* Left: Tool Icon & Function Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                'flex items-center justify-center w-7 h-7 rounded-lg border shrink-0',
                themeStyles.badge
              )}
            >
              {CustomIcon ? (
                <CustomIcon className="w-3.5 h-3.5" />
              ) : (
                <Wrench className="w-3.5 h-3.5" />
              )}
            </div>

            <div className="flex items-center gap-2 truncate">
              <span className="text-xs text-zinc-400 font-mono">tool:</span>
              <span
                className={cn('font-semibold font-mono text-xs truncate', themeStyles.textAccent)}
              >
                {toolName}
              </span>
            </div>
          </div>

          {/* Right: Status Pill, Duration & Collapse Chevron */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live Status Animation / Icon */}
            <div role="status" aria-label={`Tool status: ${status}`} className="flex items-center">
              <AnimatePresence mode="wait">
                {status === 'running' && (
                  <motion.div
                    key="running"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5"
                  >
                    <ThinkingIndicator variant={variant} size="sm" />
                    <span className="text-[11px] font-medium hidden sm:inline text-zinc-400">
                      Running...
                    </span>
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Completed</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-medium shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                  >
                    <X className="w-3 h-3 text-red-400" />
                    <span>Failed</span>
                  </motion.div>
                )}

                {status === 'pending' && (
                  <motion.div
                    key="pending"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-800/40 border border-zinc-700/40 text-zinc-400 text-[11px] font-medium"
                  >
                    <Clock className="w-3 h-3" />
                    <span>Queued</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Optional Duration Pill */}
            {formattedDuration && (
              <span className="text-[11px] text-zinc-400 font-mono hidden md:inline px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                {formattedDuration}
              </span>
            )}

            {/* Copy Button */}
            {(args || result) && (
              <button
                type="button"
                onClick={handleCopy}
                title="Copy tool payload"
                className="p-1 rounded hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {isCopied ? (
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}

            {/* Chevron Toggle */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-zinc-400"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

        {/* Collapsible Content Drawer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="border-t border-zinc-800/60 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {/* Arguments Section */}
                {args && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Arguments
                    </div>
                    <pre
                      className={cn(
                        'p-3 rounded-xl border overflow-x-auto text-xs leading-relaxed font-mono',
                        themeStyles.codeBg
                      )}
                    >
                      {typeof args === 'string'
                        ? args
                        : JSON.stringify(args, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Result Section */}
                {result && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Result
                    </div>
                    {typeof result === 'object' && React.isValidElement(result) ? (
                      <div>{result}</div>
                    ) : (
                      <pre
                        className={cn(
                          'p-3 rounded-xl border overflow-x-auto text-xs leading-relaxed font-mono',
                          themeStyles.codeBg
                        )}
                      >
                        {typeof result === 'string'
                          ? result
                          : JSON.stringify(result, null, 2)}
                      </pre>
                    )}
                  </div>
                )}

                {/* Fallback if no args/result provided */}
                {!args && !result && (
                  <div className="text-xs text-zinc-400 italic py-1">
                    No payload arguments or response recorded.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ToolCallCard.displayName = 'ToolCallCard';
export { toolCallCardVariants };

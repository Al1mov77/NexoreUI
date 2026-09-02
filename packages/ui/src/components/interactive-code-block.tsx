'use client';

import * as React from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';
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

    const lines = React.useMemo(() => code.trim().split('\n'), [code]);
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

import React, { useState, useMemo } from 'react';
import { Check, Copy, X, Download, FileCode2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { CanvasSettings, NexoreMakeElement } from '../types';
import { isLightColor } from '../utils/colorUtils';
import {
  generateReactCode,
  generateHTMLCode,
  generateVueCode,
} from '../utils/codeGenerator';

interface MakeCodeExportProps {
  isOpen: boolean;
  onClose: () => void;
  elements: NexoreMakeElement[];
  canvasSettings: CanvasSettings;
}

type CodeTab = 'react' | 'html' | 'vue';

const TAB_META: Record<CodeTab, { label: string; ext: string; fileName: string }> = {
  react: { label: 'React / TSX', ext: '.tsx', fileName: 'CustomComponent.tsx' },
  html: { label: 'HTML / CSS', ext: '.html', fileName: 'index.html' },
  vue: { label: 'Vue', ext: '.vue', fileName: 'CustomComponent.vue' },
};

function highlightToken(token: string, key: number) {
  if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
    return (
      <span key={key} className="text-emerald-700 dark:text-emerald-400">
        {token}
      </span>
    );
  }
  if (
    /^(import|export|default|function|return|const|let|var|from|ref|true|false|null|undefined|template|script|style)$/.test(
      token
    )
  ) {
    return (
      <span key={key} className="text-purple-700 dark:text-purple-400 font-medium">
        {token}
      </span>
    );
  }
  if (token.startsWith('<') || token === '>' || token === '/>') {
    return (
      <span key={key} className="text-blue-700 dark:text-blue-400 font-medium">
        {token}
      </span>
    );
  }
  if (token.startsWith('.')) {
    return (
      <span key={key} className="text-indigo-700 dark:text-indigo-300 font-medium">
        {token}
      </span>
    );
  }
  if (/^\d+(\.\d+)?(px|%|rem|em|deg|s|ms)?$/.test(token)) {
    return (
      <span key={key} className="text-amber-700 dark:text-amber-400">
        {token}
      </span>
    );
  }
  return <span key={key}>{token}</span>;
}

function HighlightedLine({ line }: { line: string }) {
  if (!line) return <span>&nbsp;</span>;
  const parts: React.ReactNode[] = [];
  const regex =
    /("(?:\\.|[^"\\])*"|'[^']*'|`[^`]*`|\b(?:import|export|default|function|return|const|let|var|from|ref|true|false|null|undefined|template|script|style)\b|<\/?[\w-]+|\/?>|\.[\w-]+|\b\d+(?:\.\d+)?(?:px|%|rem|em|deg|s|ms)?\b)/g;

  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let count = 0;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIdx) {
      parts.push(
        <span key={`txt-${count++}`}>{line.slice(lastIdx, match.index)}</span>
      );
    }
    parts.push(highlightToken(match[0], count++));
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < line.length) {
    parts.push(<span key={`txt-${count++}`}>{line.slice(lastIdx)}</span>);
  }

  return <span>{parts}</span>;
}

export default function MakeCodeExport({
  isOpen,
  onClose,
  elements,
  canvasSettings,
}: MakeCodeExportProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>('react');
  const [copied, setCopied] = useState(false);
  const { resolvedTheme, theme } = useTheme();

  const isLight =
    resolvedTheme === 'light' ||
    theme === 'light' ||
    (canvasSettings.backgroundColor ? isLightColor(canvasSettings.backgroundColor) : false);

  const code = useMemo(() => {
    switch (activeTab) {
      case 'react':
        return generateReactCode(elements, canvasSettings, isLight);
      case 'html':
        return generateHTMLCode(elements, canvasSettings, isLight);
      case 'vue':
        return generateVueCode(elements, canvasSettings, isLight);
      default:
        return '';
    }
  }, [activeTab, elements, canvasSettings, isLight]);

  const codeLines = useMemo(() => code.split('\n'), [code]);
  const meta = TAB_META[activeTab];

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = meta.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] z-50 border border-border bg-card text-foreground"
        style={{
          animation: 'make-fade-scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0 bg-muted/50 dark:bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClose}
                className="w-2.5 h-2.5 rounded-full bg-zinc-400 dark:bg-zinc-600 hover:bg-zinc-500 dark:hover:bg-zinc-400 transition-colors cursor-pointer"
                aria-label="Close modal"
              />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <div className="flex items-center gap-2">
              <FileCode2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">{meta.fileName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy code</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-border overflow-x-auto scrollbar-none px-3 gap-1 shrink-0 bg-muted/30 dark:bg-muted/20">
          {(Object.keys(TAB_META) as CodeTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setCopied(false);
              }}
              className={`relative px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {TAB_META[tab].label}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto select-text scrollbar-thin bg-zinc-50/90 dark:bg-zinc-950">
          <div className="flex min-h-full">
            <div className="shrink-0 py-5 pl-4 pr-3 text-right select-none border-r border-zinc-200 dark:border-zinc-800/60 min-w-[54px] bg-zinc-100/60 dark:bg-transparent">
              {codeLines.map((_, i) => (
                <div key={i} className="text-[12px] leading-relaxed font-mono text-zinc-400 dark:text-zinc-600 tabular-nums">
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="flex-1 py-5 px-5 overflow-x-auto scrollbar-thin">
              <pre className="text-[12px] leading-relaxed font-mono font-normal text-zinc-900 dark:text-zinc-200">
                <code>
                  {codeLines.map((line, i) => (
                    <div key={i} className="whitespace-pre">
                      <HighlightedLine line={line} />
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-between shrink-0 bg-muted/40 dark:bg-muted/30">
          <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
            {codeLines.length} lines • {elements.length} element{elements.length !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-semibold border border-border bg-background text-foreground hover:bg-accent cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
export { MakeCodeExport };
export type { MakeCodeExportProps };

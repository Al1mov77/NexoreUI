import React, { useState, useMemo } from 'react';
import { Check, Copy, X, Download, FileCode2 } from 'lucide-react';
import { CanvasSettings, NexoreMakeElement } from '../types';
import {
  generateReactCode,
  generateHTMLCode,
  generateVueCode,
  generateSvelteCode,
  generateAngularCode,
  generateVanillaCode
} from '../utils/codeGenerator';

interface MakeCodeExportProps {
  isOpen: boolean;
  onClose: () => void;
  elements: NexoreMakeElement[];
  canvasSettings: CanvasSettings;
}

type CodeTab = 'react' | 'html' | 'vue' | 'svelte' | 'angular' | 'vanilla';

const TAB_META: Record<CodeTab, { label: string; ext: string; fileName: string; color: string }> = {
  react: { label: 'React / TSX', ext: '.tsx', fileName: 'CustomComponent.tsx', color: '#61dafb' },
  html: { label: 'HTML / CSS', ext: '.html', fileName: 'index.html', color: '#e34f26' },
  vue: { label: 'Vue', ext: '.vue', fileName: 'CustomComponent.vue', color: '#42b883' },
  svelte: { label: 'Svelte', ext: '.svelte', fileName: 'CustomComponent.svelte', color: '#ff3e00' },
  angular: { label: 'Angular', ext: '.ts', fileName: 'custom.component.ts', color: '#dd0031' },
  vanilla: { label: 'Vanilla JS', ext: '.js', fileName: 'component.js', color: '#f7df1e' },
};

export default function MakeCodeExport({
  isOpen,
  onClose,
  elements,
  canvasSettings,
}: MakeCodeExportProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>('react');
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => {
    switch (activeTab) {
      case 'react': return generateReactCode(elements, canvasSettings);
      case 'html': return generateHTMLCode(elements, canvasSettings);
      case 'vue': return generateVueCode(elements, canvasSettings);
      case 'svelte': return generateSvelteCode(elements, canvasSettings);
      case 'angular': return generateAngularCode(elements, canvasSettings);
      case 'vanilla': return generateVanillaCode(elements, canvasSettings);
      default: return '';
    }
  }, [activeTab, elements, canvasSettings]);

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
      {/* Overlay */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] z-50 border"
        style={{
          backgroundColor: 'var(--make-panel-bg, #0c0c0e)',
          borderColor: 'var(--make-border, #27272a)',
        }}
      >
        {/* Header with Mac dots */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--make-border, #27272a)' }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-2">
              <FileCode2 className="h-3.5 w-3.5" style={{ color: meta.color }} />
              <span className="text-xs font-mono" style={{ color: 'var(--make-text-muted, #71717a)' }}>{meta.fileName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer hover:border-violet-500/50"
              style={{
                backgroundColor: 'var(--make-surface, #18181b)',
                borderColor: 'var(--make-border, #27272a)',
                color: 'var(--make-text-muted, #a1a1aa)',
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: copied ? 'rgba(16,185,129,0.15)' : '#7c3aed',
                color: copied ? '#10b981' : '#ffffff',
              }}
            >
              {copied ? (
                <><Check className="h-3.5 w-3.5" /><span>Copied!</span></>
              ) : (
                <><Copy className="h-3.5 w-3.5" /><span>Copy Code</span></>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/5"
              style={{ color: 'var(--make-text-muted, #71717a)' }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab selection with gradient accent */}
        <div className="flex border-b overflow-x-auto scrollbar-none px-2" style={{
          borderColor: 'var(--make-border, #27272a)',
          backgroundColor: 'var(--make-surface, rgba(24,24,27,0.5))',
        }}>
          {(Object.keys(TAB_META) as CodeTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setCopied(false);
              }}
              className={`relative px-4 py-3 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab ? 'text-white' : 'hover:text-zinc-300'
              }`}
              style={{ color: activeTab === tab ? '#ffffff' : 'var(--make-text-muted, #71717a)' }}
            >
              {TAB_META[tab].label}
              {activeTab === tab && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${TAB_META[tab].color}, #7c3aed)` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Code viewing panel with line numbers */}
        <div className="flex-1 overflow-auto select-text scrollbar-thin" style={{ backgroundColor: '#0a0a0c' }}>
          <div className="flex min-h-full">
            {/* Line numbers gutter */}
            <div className="shrink-0 py-5 pl-4 pr-3 text-right select-none border-r" style={{
              borderColor: 'rgba(39,39,42,0.3)',
              minWidth: '54px',
            }}>
              {codeLines.map((_, i) => (
                <div key={i} className="text-[11px] leading-relaxed font-mono" style={{ color: 'rgba(113,113,122,0.4)' }}>
                  {i + 1}
                </div>
              ))}
            </div>
            {/* Code content */}
            <div className="flex-1 py-5 px-5 overflow-x-auto scrollbar-thin">
              <pre className="text-[13px] leading-relaxed font-mono font-normal" style={{ color: 'var(--make-text-muted, #d4d4d8)' }}>
                <code>{code}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t flex items-center justify-between" style={{
          borderColor: 'var(--make-border, #27272a)',
          backgroundColor: 'var(--make-panel-bg, #0c0c0e)',
        }}>
          <span className="text-[10px] font-mono" style={{ color: 'var(--make-text-muted, #52525b)' }}>
            {codeLines.length} lines • {elements.length} element{elements.length !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-all hover:border-zinc-600"
            style={{
              backgroundColor: 'var(--make-surface, #18181b)',
              borderColor: 'var(--make-border, #27272a)',
              color: 'var(--make-text-muted, #a1a1aa)',
            }}
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

import React, { useState, useEffect } from 'react';
import { Copy, Check, X, Share2 } from 'lucide-react';
import { CanvasSettings, NexoreMakeElement } from '../types';

// Mini SVG preview function reused from WelcomeScreen logic
function TemplatePreview({ elements, canvasSettings }: { elements: NexoreMakeElement[], canvasSettings: CanvasSettings }) {
  const scale = 0.3; // slightly larger for share modal
  const viewW = canvasSettings.width * scale;
  const viewH = canvasSettings.height * scale;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${viewW} ${viewH}`}
      className="rounded-lg"
    >
      {elements.map((el) => {
        const x = el.position.x * scale;
        const y = el.position.y * scale;
        const w = (typeof el.size.width === 'number' ? el.size.width : 100) * scale;
        const h = (typeof el.size.height === 'number' ? el.size.height : 40) * scale;
        const fill = el.styles.backgroundColor || (el.type === 'button' ? '#7c3aed' : el.type === 'input' ? '#18181b' : el.type === 'text' ? 'transparent' : '#27272a');
        const rx = parseInt(el.styles.borderRadius || '4', 10) * scale;

        return (
          <rect
            key={el.id}
            x={x}
            y={y}
            width={w}
            height={h}
            rx={rx}
            fill={fill}
            stroke={el.styles.borderColor || 'rgba(255,255,255,0.08)'}
            strokeWidth={0.5}
          />
        );
      })}
    </svg>
  );
}

interface MakeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: NexoreMakeElement[];
  canvasSettings: CanvasSettings;
  projectName: string;
}

export default function MakeShareModal({
  isOpen,
  onClose,
  elements,
  canvasSettings,
  projectName,
}: MakeShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      try {
        const stateData = {
          elements,
          canvasSettings,
          projectName,
        };
        const jsonStr = JSON.stringify(stateData);
        // Base64 encoding unicode-safely
        const hash = btoa(unescape(encodeURIComponent(jsonStr)));
        
        // Generate alphanumeric 5-char code for clean appearance
        const randomCode = 'Q' + Math.floor(1000 + Math.random() * 9000); // e.g. Q1722
        
        const url = `${window.location.origin}/nexoremake/${randomCode}#${hash}`;
        setShareUrl(url);
      } catch (err) {
        console.error('Failed to generate share URL:', err);
      }
    }
  }, [isOpen, elements, canvasSettings, projectName]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-lg" 
        onClick={onClose} 
      />

      {/* Dialog Body */}
      <div className="relative w-full max-w-md border rounded-xl p-5 shadow-2xl z-50 flex flex-col gap-4 text-white" style={{
        backgroundColor: 'rgba(9, 9, 11, 0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.12))',
        boxShadow: '0 0 0 1px rgba(139, 92, 246, 0.06), 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 92, 246, 0.08)',
        animation: 'make-fade-scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))' }}>
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm">
            <Share2 className="h-4 w-4" />
            <span>Share Component</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Visual Preview Area */}
        <div className="rounded-xl border p-4 flex flex-col items-center gap-4" style={{
          backgroundColor: 'rgba(139, 92, 246, 0.03)',
          borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
        }}>
          <div className="w-full h-32 rounded-lg overflow-hidden border flex items-center justify-center p-2" style={{ backgroundColor: canvasSettings.backgroundColor || '#09090b', borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))' }}>
            {elements.length > 0 ? (
               <TemplatePreview elements={elements} canvasSettings={canvasSettings} />
            ) : (
               <div className="text-[10px] text-zinc-600">Empty canvas</div>
            )}
          </div>
          
          <div className="text-center">
            <h3 className="font-medium text-sm text-zinc-200">{projectName || 'Untitled Component'}</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">{elements.length} element{elements.length !== 1 ? 's' : ''} • Shared today</p>
          </div>
        </div>

        {/* Content explanation */}
        <div className="space-y-1 mt-1">
          <h4 className="text-xs font-semibold text-zinc-300">Get your unique sharing link</h4>
          <p className="text-[11px] text-zinc-500 leading-normal">
            Anyone with this link will be able to view, use, copy all code formats, or edit this component directly in their browser.
          </p>
        </div>

        {/* URL Box */}
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 border rounded-lg px-3 py-2 text-xs font-mono outline-none text-zinc-400 select-all focus:ring-1 focus:ring-violet-500/40"
            style={{
              backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
              borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
            }}
          />
          <button
            onClick={handleCopy}
            className="px-3.5 text-white rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-95 text-xs font-semibold shrink-0"
            style={{
              background: copied ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #7c3aed, #6366f1)',
              boxShadow: copied ? '0 0 16px rgba(16, 185, 129, 0.3)' : '0 0 16px rgba(139, 92, 246, 0.3)',
              padding: '8px 14px',
            }}
          >
            {copied ? (
              <Check className="h-4 w-4 text-white" />
            ) : (
              <Copy className="h-4 w-4 text-white" />
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold border text-zinc-300 cursor-pointer transition-all hover:shadow-[0_0_12px_rgba(139,92,246,0.15)] hover:border-violet-500/20"
            style={{
              backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
              borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
            }}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
export { MakeShareModal };
export type { MakeShareModalProps };

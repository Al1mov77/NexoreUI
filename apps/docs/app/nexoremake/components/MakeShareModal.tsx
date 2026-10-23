import React, { useState, useEffect } from 'react';
import { Copy, Check, X, Share2 } from 'lucide-react';
import { CanvasSettings, NexoreMakeElement } from '../types';
import { encodeStateToBase64 } from '../utils/encoding';
import { TemplatePreview } from './ElementRenderer';

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
        const hash = encodeStateToBase64(stateData);
        const url = `${window.location.origin}/nexoremake/shared#${hash}`;
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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Dialog Body */}
      <div
        className="relative w-full max-w-md border border-border rounded-xl p-5 shadow-xl z-50 flex flex-col gap-4 bg-card text-foreground"
        style={{
          animation: 'make-fade-scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Share2 className="h-4 w-4" />
            <span>Share Component</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Visual Preview Area */}
        <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col items-center gap-3">
          <div className="w-full h-36 rounded-lg overflow-hidden border border-border flex items-center justify-center">
            {elements.length > 0 ? (
               <TemplatePreview
                 elements={elements}
                 canvasSettings={canvasSettings}
                 containerW={340}
                 containerH={130}
               />
            ) : (
               <div className="text-[11px] text-muted-foreground">Empty canvas</div>
            )}
          </div>
          
          <div className="text-center">
            <h3 className="font-medium text-sm text-foreground">{projectName || 'Untitled Component'}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{elements.length} element{elements.length !== 1 ? 's' : ''} • Self-contained link</p>
          </div>
        </div>

        {/* Content explanation */}
        <div className="space-y-1 mt-1">
          <h4 className="text-xs font-semibold text-foreground">Self-contained share link</h4>
          <p className="text-[11px] text-muted-foreground leading-normal">
            The entire component state is encoded directly inside the URL hash. Anyone with this link can preview, inspect code, or open it in the studio without server storage.
          </p>
        </div>

        {/* URL Box */}
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 border border-border bg-background rounded-lg px-3 py-2 text-xs font-mono outline-none text-muted-foreground select-all focus:ring-1 focus:ring-ring"
          />
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 text-xs font-semibold shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-border bg-muted/50 hover:bg-muted text-foreground cursor-pointer transition-colors"
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

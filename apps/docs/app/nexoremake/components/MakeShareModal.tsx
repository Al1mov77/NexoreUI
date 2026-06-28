import React, { useState, useEffect } from 'react';
import { Copy, Check, X, Share2 } from 'lucide-react';
import { CanvasSettings, NexoreMakeElement } from '../types';

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Dialog Body */}
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-2xl z-50 flex flex-col gap-4 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm">
            <Share2 className="h-4 w-4" />
            <span>Share Component</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content explanation */}
        <div className="space-y-1">
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
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono outline-none text-zinc-400 select-all"
          />
          <button
            onClick={handleCopy}
            className="px-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-md shadow-violet-950/20 active:scale-95 text-xs font-semibold shrink-0"
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
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 cursor-pointer transition-colors"
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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ExternalLink, 
  Check, 
  Copy, 
  Share2, 
  FileCode 
} from 'lucide-react';
import { CanvasSettings, NexoreMakeElement } from '../types';
import MakeFavoriteButton from '../components/MakeFavoriteButton';
import { ElementRenderer } from '../components/ElementRenderer';
import { decodeStateFromBase64 } from '../utils/encoding';
import { 
  generateReactCode, 
  generateHTMLCode, 
  generateVueCode, 
} from '../utils/codeGenerator';

export default function SharedComponentVisualizer() {
  const [elements, setElements] = useState<NexoreMakeElement[]>([]);
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings | null>(null);
  const [projectName, setProjectName] = useState('Shared Element');
  const [hashState, setHashState] = useState('');
  
  const [activeCodeTab, setActiveCodeTab] = useState<'react' | 'html' | 'vue'>('react');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      if (hash) {
        try {
          setHashState(hash);
          const stateData = decodeStateFromBase64(hash);
          if (stateData) {
            if (stateData.elements) setElements(stateData.elements);
            if (stateData.canvasSettings) setCanvasSettings(stateData.canvasSettings);
            if (stateData.projectName) setProjectName(stateData.projectName);
          }
        } catch (err) {
          console.error('Failed to parse URL component state:', err);
        }
      }
    }
  }, []);

  const getCode = (): string => {
    if (!canvasSettings) return '';
    switch (activeCodeTab) {
      case 'react': return generateReactCode(elements, canvasSettings);
      case 'html': return generateHTMLCode(elements, canvasSettings);
      case 'vue': return generateVueCode(elements, canvasSettings);
      default: return '';
    }
  };

  const getFileName = (): string => {
    switch (activeCodeTab) {
      case 'react': return 'Component.tsx';
      case 'html': return 'index.html';
      case 'vue': return 'Component.vue';
      default: return 'code.txt';
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!canvasSettings) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#030303] text-zinc-400 select-none">
        <FileCode className="h-10 w-10 text-zinc-700 mb-3" />
        <h3 className="text-sm font-semibold text-zinc-200">No Component Found</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm text-center">
          The link you followed seems to be invalid or does not contain layout styles.
        </p>
        <Link
          href="/nexoremake"
          className="mt-4 px-4 py-2 bg-primary hover:bg-primary text-primary-foreground rounded-lg text-xs font-semibold cursor-pointer transition-colors"
        >
          Create component
        </Link>
      </div>
    );
  }

  const renderLiveElement = (el: NexoreMakeElement) => (
    <ElementRenderer element={el} mode="preview" />
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030303] text-white">
      
      {/* Visualizer Navbar Header */}
      <header className="h-14 border-b border-zinc-900 px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md shrink-0 select-none">
        <div className="flex items-center gap-3">
          <Link 
            href="/nexoremake"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Maker Home</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <span className="text-xs font-semibold tracking-wider font-mono text-zinc-200">
            {projectName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Add to Favorites */}
          <MakeFavoriteButton
            elements={elements}
            canvasSettings={canvasSettings}
            projectName={projectName}
          />

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-700 text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Copy Share Link</span>
              </>
            )}
          </button>

          {/* Open in Studio */}
          <Link
            href={`/nexoremake#${hashState}`}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary text-white transition-colors flex items-center gap-1.5 shadow-md shadow-foreground/10 cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open in Studio</span>
          </Link>
        </div>
      </header>

      {/* Main Split Body: Preview vs Code */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Visualizer Canvas Area (Left) */}
        <div className="flex-1 flex items-center justify-center p-8 bg-dot-grid overflow-auto select-none">
          <div 
            className="relative shadow-2xl transition-all duration-300 rounded-xl overflow-hidden border border-zinc-900/60"
            style={{
              width: `${canvasSettings.width}px`,
              height: `${canvasSettings.height}px`,
              backgroundColor: canvasSettings.backgroundColor,
            }}
          >
            {elements.map((el) => (
              <div
                key={el.id}
                className="absolute"
                style={{
                  left: `${el.position.x}px`,
                  top: `${el.position.y}px`,
                  width: `${el.size.width}px`,
                  height: `${el.size.height}px`,
                  zIndex: el.zIndex,
                }}
              >
                {renderLiveElement(el)}
              </div>
            ))}
          </div>
        </div>

        {/* Code tab views (Right/Bottom) */}
        <div className="w-full md:w-[400px] shrink-0 bg-zinc-950 flex flex-col h-[350px] md:h-full overflow-hidden">
          
          {/* Format Selection Header */}
          <div className="flex bg-zinc-900/40 border-b border-zinc-900 px-2 overflow-x-auto scrollbar-none shrink-0 select-none">
            {(['react', 'html', 'vue'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveCodeTab(tab);
                  setCopiedCode(false);
                }}
                className={`px-3.5 py-3 text-[11px] font-semibold capitalize border-b-2 transition-all cursor-pointer ${
                  activeCodeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab === 'react' ? 'React / TSX' : tab === 'html' ? 'HTML / CSS' : 'Vue'}
              </button>
            ))}
          </div>

          {/* Render Code */}
          <div className="flex-1 overflow-auto bg-[#030303] p-4 font-mono text-[11px] text-zinc-400 relative select-text leading-relaxed">
            <pre className="whitespace-pre scrollbar-thin">
              <code>{getCode()}</code>
            </pre>

            {/* Copy button */}
            <button
              onClick={handleCopyCode}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer shadow-md select-none transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 border-t border-zinc-900 bg-zinc-950/80 text-[10px] text-zinc-500 text-center select-none shrink-0">
            Selected file: <span className="font-mono text-zinc-400">{getFileName()}</span>
          </div>

        </div>

      </div>

    </div>
  );
}

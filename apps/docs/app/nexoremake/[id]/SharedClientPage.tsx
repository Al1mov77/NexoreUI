'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ExternalLink, 
  Check, 
  Copy, 
  Share2, 
  Heart,
  FileCode
} from 'lucide-react';
import { CanvasSettings, NexoreMakeElement } from '../types';
import MakeFavoriteButton from '../components/MakeFavoriteButton';
import { 
  generateReactCode, 
  generateHTMLCode, 
  generateVueCode, 
  generateSvelteCode, 
  generateAngularCode, 
  generateVanillaCode,
  getElementJSXStyle,
  getAnimationCSS
} from '../utils/codeGenerator';

export default function SharedComponentVisualizer() {
  const [elements, setElements] = useState<NexoreMakeElement[]>([]);
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings | null>(null);
  const [projectName, setProjectName] = useState('Shared Element');
  const [hashState, setHashState] = useState('');
  
  const [activeCodeTab, setActiveCodeTab] = useState<'react' | 'html' | 'vue' | 'svelte' | 'angular' | 'vanilla'>('react');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      if (hash) {
        try {
          setHashState(hash);
          const stateData = JSON.parse(decodeURIComponent(escape(atob(hash))));
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
      case 'svelte': return generateSvelteCode(elements, canvasSettings);
      case 'angular': return generateAngularCode(elements, canvasSettings);
      case 'vanilla': return generateVanillaCode(elements, canvasSettings);
      default: return '';
    }
  };

  const getFileName = (): string => {
    switch (activeCodeTab) {
      case 'react': return 'Component.tsx';
      case 'html': return 'index.html';
      case 'vue': return 'Component.vue';
      case 'svelte': return 'Component.svelte';
      case 'angular': return 'component.ts';
      case 'vanilla': return 'component.js';
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
        <FileCode className="h-10 w-10 text-zinc-700 animate-bounce mb-3" />
        <h3 className="text-sm font-semibold text-zinc-200">No Component Found</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm text-center">
          The link you followed seems to be invalid or does not contain layout styles.
        </p>
        <Link
          href="/nexoremake"
          className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
        >
          Create component
        </Link>
      </div>
    );
  }

  // Render elements in preview mode
  const renderLiveElement = (el: NexoreMakeElement) => {
    let animationClass = '';
    if (el.animationPreset && el.animationPreset !== 'none') {
      if (el.animationPreset === 'pulse') animationClass = 'animate-pulse';
      else if (el.animationPreset === 'bounce') animationClass = 'animate-bounce';
      else if (el.animationPreset === 'spin') animationClass = 'animate-spin';
    }

    const baseClasses = `w-full h-full flex items-center justify-center overflow-hidden ${animationClass}`;

    switch (el.type) {
      case 'button':
        return (
          <button className={`${baseClasses} font-medium`} style={el.styles}>
            {el.content || 'Button'}
          </button>
        );
      case 'card':
        return (
          <div className={`${baseClasses}`} style={el.styles}>
            {el.content && <p className="text-xs text-zinc-400">{el.content}</p>}
          </div>
        );
      case 'input':
        return (
          <input
            type="text"
            readOnly
            placeholder={el.placeholder || 'Enter text...'}
            className={`${baseClasses} px-3 bg-zinc-950 border border-zinc-800 rounded outline-none text-xs`}
            style={el.styles}
          />
        );
      case 'text':
        return (
          <div className={`${baseClasses}`} style={el.styles}>
            {el.content || 'Hello World'}
          </div>
        );
      case 'badge':
        return (
          <span className={`${baseClasses} px-2 py-0.5 rounded-full text-xs font-semibold`} style={el.styles}>
            {el.content || 'Badge'}
          </span>
        );
      case 'avatar':
        return (
          <div className={`${baseClasses} rounded-full border border-zinc-800 bg-zinc-900`} style={el.styles}>
            {el.content ? (
              <span className="text-xs font-bold text-white">{el.content}</span>
            ) : (
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                alt="User"
                className="w-full h-full object-cover pointer-events-none rounded-full"
              />
            )}
          </div>
        );
      case 'icon':
        return (
          <div className={`${baseClasses} text-inherit`} style={el.styles}>
            <span className="text-lg">✦</span>
          </div>
        );
      case 'divider':
        return <hr className="w-full border-none" style={{ height: '1px', backgroundColor: el.styles.backgroundColor || '#27272a', ...el.styles }} />;
      case 'image':
        return (
          <img
            src={el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}
            alt="Preview"
            className={`${baseClasses} object-cover rounded`}
            style={el.styles}
          />
        );
      case 'switch':
        return (
          <div className={`${baseClasses} flex items-center gap-2`} style={el.styles}>
            <div className="w-9 h-5 bg-violet-600 rounded-full p-0.5 flex items-center justify-end">
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </div>
            <span className="text-xs text-zinc-300 font-sans">{el.content || 'Switch'}</span>
          </div>
        );
      case 'checkbox':
        return (
          <div className={`${baseClasses} flex items-center gap-2`} style={el.styles}>
            <div className="w-4 h-4 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-violet-500 rounded-sm" />
            </div>
            <span className="text-xs text-zinc-300 font-sans select-none">{el.content || 'Checkbox'}</span>
          </div>
        );
      case 'progress':
        return (
          <div className={`${baseClasses} bg-zinc-800 rounded-full p-0.5 flex items-center`} style={el.styles}>
            <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: el.content || '60%' }} />
          </div>
        );
      default:
        return <div className="w-full h-full border border-zinc-800" style={el.styles} />;
    }
  };

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

          {/* Open in Editor */}
          <Link
            href={`/nexoremake#${hashState}`}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-violet-950/20 active:scale-95 cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open in Editor</span>
          </Link>
        </div>
      </header>

      {/* Main Preview and Code Split Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Render Preview (Left/Top) */}
        <div className="flex-1 bg-[#050505] overflow-auto flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-zinc-900 select-none">
          <div 
            className="relative shadow-2xl border border-zinc-800/80 rounded-xl"
            style={{
              width: `${canvasSettings.width}px`,
              height: `${canvasSettings.height}px`,
              backgroundColor: canvasSettings.backgroundColor || '#09090b',
              backgroundImage: 'radial-gradient(circle, #27272a 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            {elements.map((el) => (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: el.position.x,
                  top: el.position.y,
                  width: el.size.width,
                  height: el.size.height,
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
            {(['react', 'html', 'vue', 'svelte', 'angular', 'vanilla'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveCodeTab(tab);
                  setCopiedCode(false);
                }}
                className={`px-3.5 py-3 text-[11px] font-semibold capitalize border-b-2 transition-all cursor-pointer ${
                  activeCodeTab === tab
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab === 'react' ? 'React' : tab === 'html' ? 'HTML' : tab === 'vanilla' ? 'Vanilla JS' : tab}
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

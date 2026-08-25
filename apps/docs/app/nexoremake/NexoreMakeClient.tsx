'use client';

import React, { useReducer, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Share2, 
  Code, 
  Undo2, 
  Redo2, 
  Eye, 
  Grid, 
  Sparkles, 
  Maximize2, 
  SlidersHorizontal,
  Bookmark,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { trackEvent } from '../../hooks/useAnalytics';
import { makerReducer, initialState } from './state';
import MakeToolbar from './components/MakeToolbar';
import MakeCanvas from './components/MakeCanvas';
import MakePropertiesPanel from './components/MakePropertiesPanel';
import MakeAIChat from './components/MakeAIChat';
import MakeCodeExport from './components/MakeCodeExport';
import MakeShareModal from './components/MakeShareModal';
import MakeFavoriteButton from './components/MakeFavoriteButton';
import { ElementType } from './types';
import MakeCursor from './components/MakeCursor';

export default function NexoreMakePage() {
  const [state, dispatch] = useReducer(makerReducer, initialState);
  const [activeTab, setActiveTab] = useState<'properties' | 'ai'>('properties');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    trackEvent({
      eventType: 'ai_opened',
      feature: 'Nexore Make'
    });
  }, []);
  
  // Modal states
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Load initial state from hash if present
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        const hash = window.location.hash.substring(1);
        if (hash) {
          const data = JSON.parse(decodeURIComponent(escape(atob(hash))));
          if (data && data.elements) {
            dispatch({
              type: 'LOAD_PROJECT',
              elements: data.elements,
              canvasSettings: data.canvasSettings,
              projectName: data.projectName || 'Shared Element',
            });
          }
        }
      } catch (e) {
        console.error('Failed to parse load state from hash:', e);
      }
    }
  }, []);

  // Global key bindings for delete / undo / redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting input/textarea elements typing
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedId) {
          dispatch({ type: 'DELETE_ELEMENT', id: state.selectedId });
        }
      }

      if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyZ' && !e.shiftKey)) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }

      if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyY' || (e.shiftKey && e.code === 'KeyZ'))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedId]);

  const handleAddElement = (elementProps: any) => {
    // Center of canvas
    const x = state.canvasSettings.width / 2 - (typeof elementProps.size.width === 'number' ? elementProps.size.width / 2 : 50);
    const y = state.canvasSettings.height / 2 - Number(elementProps.size.height) / 2;

    dispatch({
      type: 'ADD_ELEMENT',
      element: {
        ...elementProps,
        position: { x, y },
      },
    });
  };

  const handleDropElement = (type: string, props: any, x: number, y: number) => {
    dispatch({
      type: 'ADD_ELEMENT',
      element: {
        type: type as ElementType,
        ...props,
        position: { x, y },
      },
    });
  };

  const selectedElement = state.elements.find(el => el.id === state.selectedId) || null;

  const [mobileDrawer, setMobileDrawer] = useState<'toolbar' | 'properties' | 'ai' | null>(null);

  return (
    <div className="flex-1 flex flex-col h-full relative" style={{ backgroundColor: 'var(--make-bg, #030303)', color: 'var(--make-text, #e4e4e7)' }}>
      <MakeCursor />
      
      {/* HEADER NAVBAR */}
      <header className="h-14 border-b px-3 sm:px-6 flex items-center justify-between shrink-0 select-none" style={{
        borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
        backgroundColor: 'var(--make-header-bg, rgba(9,9,11,0.6))',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}>
        
        {/* Left segment */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />
          
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-zinc-500 font-semibold uppercase tracking-widest font-sans">
              Nexore Make
            </span>
            <input
              type="text"
              value={state.projectName}
              onChange={(e) => dispatch({ type: 'UPDATE_PROJECT_NAME', name: e.target.value })}
              className="border rounded px-2.5 py-1 text-xs text-zinc-200 outline-none w-24 sm:w-48 font-medium transition-all focus:ring-1 focus:ring-violet-500/40 focus:border-violet-500/30"
              style={{
                backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
                borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
                backdropFilter: 'blur(8px)',
              }}
              placeholder="Name..."
            />
          </div>
        </div>

        {/* Center Toolbar (Undo, Redo, Zoom, Grid, Favorites link) */}
        <div className="hidden md:flex items-center gap-1.5 border p-1.5 rounded-lg" style={{
          backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
          borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
          backdropFilter: 'blur(12px)',
        }}>
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.historyIndex === 0}
            className="p-1 text-zinc-400 hover:text-white hover:bg-violet-500/10 disabled:opacity-40 disabled:hover:bg-transparent rounded cursor-pointer transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={state.historyIndex === state.history.length - 1}
            className="p-1 text-zinc-400 hover:text-white hover:bg-violet-500/10 disabled:opacity-40 disabled:hover:bg-transparent rounded cursor-pointer transition-all"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4.5 w-4.5" />
          </button>
          
          <div className="w-[1px] h-3.5 bg-zinc-850 mx-1" />

          {/* Grid display toggle */}
          <button
            onClick={() => dispatch({ 
              type: 'UPDATE_CANVAS_SETTINGS', 
              settings: { gridVisible: !state.canvasSettings.gridVisible } 
            })}
            className={`p-1 rounded cursor-pointer transition-all ${
              state.canvasSettings.gridVisible ? 'text-violet-400 bg-violet-500/10' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Toggle Grid Patterns"
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>

        {/* Right actions (Share, Export, Favorite, Favorites list) */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/nexoremake/favorites"
            className="px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border text-zinc-300 transition-all flex items-center gap-1.5 hover:shadow-[0_0_12px_rgba(139,92,246,0.15)] hover:border-violet-500/20"
            style={{
              backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
              borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
            }}
            title="My Saved Favorites Library"
          >
            <Bookmark className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden lg:inline">Saved</span>
          </Link>

          <MakeFavoriteButton
            elements={state.elements}
            canvasSettings={state.canvasSettings}
            projectName={state.projectName}
          />

          <button
            onClick={() => setIsShareOpen(true)}
            className="px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border text-zinc-300 cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 hover:shadow-[0_0_12px_rgba(139,92,246,0.15)] hover:border-violet-500/20"
            style={{
              backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
              borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-2 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 hover:shadow-[0_0_16px_rgba(139,92,246,0.4)]"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
            }}
          >
            <Code className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Code</span>
          </button>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--make-surface, #18181b)',
                borderColor: 'var(--make-border, #27272a)',
                color: 'var(--make-text, #e4e4e7)',
              }}
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-indigo-500" />}
            </button>
          )}
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative" style={{ height: 'calc(100vh - 56px)' }}>
        
        {/* Left Toolbar */}
        <div className="hidden md:flex">
          <MakeToolbar onAddElement={handleAddElement} />
        </div>

        {/* Center Canvas */}
        <MakeCanvas
          elements={state.elements}
          selectedId={state.selectedId}
          canvasSettings={state.canvasSettings}
          onSelect={(id) => dispatch({ type: 'SELECT_ELEMENT', id })}
          onMove={(id, x, y) => dispatch({ type: 'MOVE_ELEMENT', id, x, y })}
          onResize={(id, w, h) => dispatch({ type: 'RESIZE_ELEMENT', id, width: w, height: h })}
          onDropElement={handleDropElement}
          onZoomChange={(newZoom) => dispatch({
            type: 'UPDATE_CANVAS_SETTINGS',
            settings: { zoom: newZoom }
          })}
          onLoadTemplate={(template) => {
            dispatch({
              type: 'LOAD_PROJECT',
              elements: template.elements,
              canvasSettings: template.canvasSettings,
              projectName: template.name,
            });
          }}
        />

        {/* Right Settings Columns */}
        <div className="hidden md:flex w-[280px] shrink-0 border-l flex-col overflow-hidden" style={{
          borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))',
          backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          height: '100%',
          maxHeight: '100%',
        }}>
          
          {/* Properties vs AI Tabs */}
          <div className="flex border-b" style={{ borderColor: 'var(--make-glass-border, rgba(139, 92, 246, 0.08))' }}>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'properties'
                  ? 'border-violet-500 text-violet-400 bg-violet-500/10'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Properties</span>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'border-violet-500 text-violet-400 bg-violet-500/10'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span>AI Assistant</span>
            </button>
          </div>

          {/* Active Tab Panel view */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            {activeTab === 'properties' ? (
              <MakePropertiesPanel
                selectedElement={selectedElement}
                onUpdateStyle={(id, styles) => dispatch({ type: 'UPDATE_ELEMENT_STYLE', id, styles })}
                onUpdateProps={(id, payload) => dispatch({ type: 'UPDATE_ELEMENT_PROPS', id, payload })}
                onUpdateSize={(id, w, h) => dispatch({ type: 'RESIZE_ELEMENT', id, width: w, height: h })}
                onDelete={(id) => dispatch({ type: 'DELETE_ELEMENT', id })}
                onDuplicate={(id) => dispatch({ type: 'DUPLICATE_ELEMENT', id })}
                onBringToFront={(id) => dispatch({ type: 'BRING_TO_FRONT', id })}
                onSendToBack={(id) => dispatch({ type: 'SEND_TO_BACK', id })}
              />
            ) : (
              <MakeAIChat
                elements={state.elements}
                selectedId={state.selectedId}
                canvasSettings={state.canvasSettings}
                onApplyAIChanges={(elems, settings) => {
                  dispatch({ 
                    type: 'LOAD_PROJECT', 
                    elements: elems, 
                    canvasSettings: settings,
                    projectName: state.projectName 
                  });
                }}
              />
            )}
          </div>
        </div>

      </div>

      {/* MOBILE BOTTOM TOOLBAR (Shown on screens < md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] h-14 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-lg flex items-center justify-around px-2 text-white">
        <button
          onClick={() => setMobileDrawer(mobileDrawer === 'toolbar' ? null : 'toolbar')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium py-1 px-3 rounded-lg transition-colors ${
            mobileDrawer === 'toolbar' ? 'text-violet-400 bg-violet-500/10' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Grid className="h-4 w-4" />
          <span>Add Element</span>
        </button>

        <button
          onClick={() => setMobileDrawer(mobileDrawer === 'properties' ? null : 'properties')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium py-1 px-3 rounded-lg transition-colors ${
            mobileDrawer === 'properties' ? 'text-violet-400 bg-violet-500/10' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Properties</span>
        </button>

        <button
          onClick={() => setMobileDrawer(mobileDrawer === 'ai' ? null : 'ai')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium py-1 px-3 rounded-lg transition-colors ${
            mobileDrawer === 'ai' ? 'text-violet-400 bg-violet-500/10' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles className="h-4 w-4 text-violet-400" />
          <span>AI Assist</span>
        </button>
      </div>

      {/* MOBILE BOTTOM DRAWER OVERLAY */}
      {mobileDrawer && (
        <div className="md:hidden fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm flex flex-col justify-end" onClick={() => setMobileDrawer(null)}>
          <div 
            className="w-full max-h-[75vh] bg-zinc-950 border-t border-zinc-800 rounded-t-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                {mobileDrawer === 'toolbar' && 'Add Elements'}
                {mobileDrawer === 'properties' && 'Properties Inspector'}
                {mobileDrawer === 'ai' && 'AI Assistant'}
              </span>
              <button 
                onClick={() => setMobileDrawer(null)}
                className="text-xs font-semibold px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2" style={{ maxHeight: 'calc(75vh - 50px)' }}>
              {mobileDrawer === 'toolbar' && (
                <MakeToolbar onAddElement={(elem) => { handleAddElement(elem); setMobileDrawer(null); }} />
              )}
              {mobileDrawer === 'properties' && (
                <MakePropertiesPanel
                  selectedElement={selectedElement}
                  onUpdateStyle={(id, styles) => dispatch({ type: 'UPDATE_ELEMENT_STYLE', id, styles })}
                  onUpdateProps={(id, payload) => dispatch({ type: 'UPDATE_ELEMENT_PROPS', id, payload })}
                  onUpdateSize={(id, w, h) => dispatch({ type: 'RESIZE_ELEMENT', id, width: w, height: h })}
                  onDelete={(id) => { dispatch({ type: 'DELETE_ELEMENT', id }); setMobileDrawer(null); }}
                  onDuplicate={(id) => dispatch({ type: 'DUPLICATE_ELEMENT', id })}
                  onBringToFront={(id) => dispatch({ type: 'BRING_TO_FRONT', id })}
                  onSendToBack={(id) => dispatch({ type: 'SEND_TO_BACK', id })}
                />
              )}
              {mobileDrawer === 'ai' && (
                <MakeAIChat
                  elements={state.elements}
                  selectedId={state.selectedId}
                  canvasSettings={state.canvasSettings}
                  onApplyAIChanges={(elems, settings) => {
                    dispatch({ 
                      type: 'LOAD_PROJECT', 
                      elements: elems, 
                      canvasSettings: settings,
                      projectName: state.projectName 
                    });
                    setMobileDrawer(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <MakeCodeExport
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        elements={state.elements}
        canvasSettings={state.canvasSettings}
      />

      <MakeShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        elements={state.elements}
        canvasSettings={state.canvasSettings}
        projectName={state.projectName}
      />

    </div>
  );
}

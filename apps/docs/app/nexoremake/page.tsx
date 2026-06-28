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
  RefreshCw
} from 'lucide-react';

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

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
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

  return (
    <div className="flex-1 flex flex-col h-full" style={{ backgroundColor: 'var(--make-bg, #030303)', color: 'var(--make-text, #e4e4e7)' }}>
      <MakeCursor />
      
      {/* HEADER NAVBAR */}
      <header className="h-14 border-b px-6 flex items-center justify-between backdrop-blur-md shrink-0 select-none" style={{
        borderColor: 'var(--make-border, #27272a)',
        backgroundColor: 'var(--make-header-bg, rgba(9,9,11,0.8))',
      }}>
        
        {/* Left segment */}
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-800" />
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-widest font-sans">
              Nexore Make
            </span>
            <input
              type="text"
              value={state.projectName}
              onChange={(e) => dispatch({ type: 'UPDATE_PROJECT_NAME', name: e.target.value })}
              className="bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded px-2.5 py-1 text-xs text-zinc-200 outline-none w-48 font-medium transition-colors"
              placeholder="Name your component..."
            />
          </div>
        </div>

        {/* Center Toolbar (Undo, Redo, Zoom, Grid, Favorites link) */}
        <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-850 p-1.5 rounded-lg">
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.historyIndex === 0}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent rounded cursor-pointer transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={state.historyIndex === state.history.length - 1}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent rounded cursor-pointer transition-colors"
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
        <div className="flex items-center gap-2">
          <Link
            href="/nexoremake/favorites"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 transition-colors flex items-center gap-1.5"
            title="My Saved Favorites Library"
          >
            <Bookmark className="h-3.5 w-3.5 text-zinc-400" />
            <span>Saved Favorites</span>
          </Link>

          <MakeFavoriteButton
            elements={state.elements}
            canvasSettings={state.canvasSettings}
            projectName={state.projectName}
          />

          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-700 text-zinc-300 cursor-pointer transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share Link</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-violet-950/20 active:scale-95"
          >
            <Code className="h-3.5 w-3.5" />
            <span>Export Code</span>
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        
        {/* Left Toolbar */}
        <MakeToolbar onAddElement={handleAddElement} />

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
        />

        {/* Right Settings Columns */}
        <div className="w-[280px] shrink-0 border-l flex flex-col overflow-hidden" style={{
          borderColor: 'var(--make-border, #27272a)',
          backgroundColor: 'var(--make-panel-bg, #09090b)',
          height: '100%',
          maxHeight: '100%',
        }}>
          
          {/* Properties vs AI Tabs */}
          <div className="flex border-b border-zinc-900">
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'properties'
                  ? 'border-violet-500 text-violet-400 bg-zinc-900/10'
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
                  ? 'border-violet-500 text-violet-400 bg-zinc-900/10'
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

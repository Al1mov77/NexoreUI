'use client';

import React, { useReducer, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Share2, 
  Code, 
  Undo2, 
  Redo2, 
  Eye, 
  Grid, 
  Command,
  Maximize2, 
  SlidersHorizontal,
  Bookmark,
  RefreshCw,
  Sun,
  Moon,
  Monitor,
  Tablet,
  Smartphone,
  X,
  Keyboard,
  Bot
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
import { ElementType, DeviceType } from './types';
import { decodeStateFromBase64 } from './utils/encoding';
import { adaptElementForTheme } from './utils/colorUtils';
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
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const clipboardRef = useRef<any[]>([]);

  // Load initial state from URL hash
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        const hash = window.location.hash.substring(1);
        if (hash) {
          const data = decodeStateFromBase64(hash);
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
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedIds.length > 0 || state.selectedId) {
          dispatch({ type: 'DELETE_SELECTED_ELEMENTS' });
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyC') {
        const selected = state.elements.filter(
          (el) => state.selectedIds.includes(el.id) || state.selectedId === el.id
        );
        if (selected.length > 0) {
          clipboardRef.current = selected;
          try {
            localStorage.setItem('nexore_make_clipboard', JSON.stringify(selected));
          } catch {}
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyV') {
        e.preventDefault();
        let items = clipboardRef.current;
        if (!items || items.length === 0) {
          try {
            const raw = localStorage.getItem('nexore_make_clipboard');
            if (raw) items = JSON.parse(raw);
          } catch {}
        }
        if (items && items.length > 0) {
          dispatch({ type: 'PASTE_ELEMENTS', elements: items });
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyD') {
        e.preventDefault();
        dispatch({ type: 'DUPLICATE_SELECTED' });
      }

      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyA') {
        e.preventDefault();
        dispatch({
          type: 'SELECT_MULTIPLE',
          ids: state.elements.map((el) => el.id),
        });
      }

      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }

      if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyZ' && !e.shiftKey)) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }

      if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyY' || (e.shiftKey && e.code === 'KeyZ'))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }

      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        dispatch({ type: 'UPDATE_CANVAS_SETTINGS', settings: { zoom: 1 } });
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        const nextZoom = Math.min(2, Math.round((state.canvasSettings.zoom + 0.1) * 100) / 100);
        dispatch({ type: 'UPDATE_CANVAS_SETTINGS', settings: { zoom: nextZoom } });
      }

      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        const nextZoom = Math.max(0.25, Math.round((state.canvasSettings.zoom - 0.1) * 100) / 100);
        dispatch({ type: 'UPDATE_CANVAS_SETTINGS', settings: { zoom: nextZoom } });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedId, state.selectedIds, state.elements, state.canvasSettings.zoom]);

  const handleAddElement = (elementProps: any) => {
    const isLightMode = theme === 'light' || (typeof document !== 'undefined' && !document.documentElement.classList.contains('dark'));
    const themedProps = adaptElementForTheme(elementProps, isLightMode);

    // Center of canvas
    const x = state.canvasSettings.width / 2 - (typeof themedProps.size.width === 'number' ? themedProps.size.width / 2 : 50);
    const y = state.canvasSettings.height / 2 - Number(themedProps.size.height) / 2;

    dispatch({
      type: 'ADD_ELEMENT',
      element: {
        ...themedProps,
        position: { x, y },
      },
    });
  };

  const handleDropElement = (type: string, props: any, x: number, y: number) => {
    const isLightMode = theme === 'light' || (typeof document !== 'undefined' && !document.documentElement.classList.contains('dark'));
    const themedProps = adaptElementForTheme({ type, ...props }, isLightMode);

    dispatch({
      type: 'ADD_ELEMENT',
      element: {
        ...themedProps,
        position: { x, y },
      },
    });
  };

  const selectedElement = state.elements.find(el => el.id === state.selectedId) || null;

  const [mobileDrawer, setMobileDrawer] = useState<'toolbar' | 'properties' | 'ai' | null>(null);

  const currentDevice: DeviceType = state.canvasSettings.device || 'desktop';

  const handleDeviceChange = (device: DeviceType) => {
    dispatch({ type: 'SWITCH_DEVICE', device });
  };

  return (
    <div className="flex-1 flex flex-col h-full relative" style={{ backgroundColor: 'var(--make-bg, #030303)', color: 'var(--make-text, #e4e4e7)' }}>
      {/* Demo Video Custom Cursor */}
      <MakeCursor />

      {/* HEADER NAVBAR */}
      <header className="h-14 border-b px-3 sm:px-6 flex items-center justify-between shrink-0 select-none" style={{
        borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
        backgroundColor: 'var(--make-header-bg, rgba(9,9,11,0.85))',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}>
        
        {/* Left segment */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-muted-foreground font-semibold uppercase tracking-widest font-sans">
              Nexore Make
            </span>
            <input
              type="text"
              value={state.projectName}
              onChange={(e) => dispatch({ type: 'UPDATE_PROJECT_NAME', name: e.target.value })}
              className="border rounded px-2.5 py-1 text-xs text-foreground outline-none w-24 sm:w-48 font-medium transition-all focus:ring-1 focus:ring-ring"
              style={{
                backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
                borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
              }}
              placeholder="Name..."
            />
          </div>
        </div>

        {/* Center Toolbar (Undo, Redo, 3 Devices, Grid, Resolution) */}
        <div className="hidden md:flex items-center gap-1.5 border p-1 rounded-lg" style={{
          backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
          borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
        }}>
          <button
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.historyIndex === 0}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent rounded cursor-pointer transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={state.historyIndex === state.history.length - 1}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent rounded cursor-pointer transition-all"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </button>
          
          <div className="w-[1px] h-3.5 bg-border mx-0.5" />

          {/* 3 Devices Switcher */}
          <div className="flex items-center bg-muted/80 p-0.5 rounded-md border border-border">
            <button
              type="button"
              onClick={() => handleDeviceChange('desktop')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all cursor-pointer ${
                currentDevice === 'desktop'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Desktop View (1200 × 800)"
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="text-[11px]">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => handleDeviceChange('tablet')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all cursor-pointer ${
                currentDevice === 'tablet'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Tablet View (768 × 1024)"
            >
              <Tablet className="h-3.5 w-3.5" />
              <span className="text-[11px]">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => handleDeviceChange('mobile')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all cursor-pointer ${
                currentDevice === 'mobile'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Mobile View (390 × 844)"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="text-[11px]">Mobile</span>
            </button>
          </div>

          <div className="w-[1px] h-3.5 bg-border mx-0.5" />

          {/* Grid display toggle */}
          <button
            onClick={() => dispatch({ 
              type: 'UPDATE_CANVAS_SETTINGS', 
              settings: { gridVisible: !state.canvasSettings.gridVisible } 
            })}
            className={`p-1.5 rounded cursor-pointer transition-all ${
              state.canvasSettings.gridVisible ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title="Toggle Grid Patterns"
          >
            <Grid className="h-3.5 w-3.5" />
          </button>

          {/* Current Canvas Resolution Tag */}
          <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted/80 border border-border">
            {state.canvasSettings.width}×{state.canvasSettings.height}
          </span>
        </div>

        {/* Right actions (Share, Export, Favorite, Favorites list) */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/nexoremake/favorites"
            className="px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border text-foreground transition-all flex items-center gap-1.5 hover:bg-muted"
            style={{
              backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
              borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
            }}
            title="My Saved Favorites Library"
          >
            <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden lg:inline">Saved</span>
          </Link>

          <MakeFavoriteButton
            elements={state.elements}
            canvasSettings={state.canvasSettings}
            projectName={state.projectName}
          />

          <button
            onClick={() => setIsShareOpen(true)}
            className="px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border text-foreground cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 hover:bg-muted"
            style={{
              backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
              borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
            }}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-2 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
          >
            <Code className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Code</span>
          </button>

          <button
            type="button"
            onClick={() => setIsShortcutsOpen(true)}
            className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-mono border text-muted-foreground hover:text-foreground cursor-pointer transition-all flex items-center gap-1.5 hover:bg-muted"
            style={{
              backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
              borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
            }}
            title="Keyboard Shortcuts & Commands (Ctrl+K)"
          >
            <Command className="h-3.5 w-3.5" />
            <span className="hidden xl:inline text-[10px]">Ctrl+K</span>
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
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-foreground" />}
            </button>
          )}
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative" style={{ height: 'calc(100vh - 56px)' }}>
        
        {/* Left Toolbar */}
        <div className="hidden md:flex">
          <MakeToolbar
            onAddElement={handleAddElement}
            variant="sidebar"
            elements={state.elements}
            selectedId={state.selectedId}
            selectedIds={state.selectedIds}
            onSelectElement={(id, multi) => dispatch({ type: 'SELECT_ELEMENT', id, multi })}
            onToggleLocked={(id) => dispatch({ type: 'TOGGLE_ELEMENT_LOCKED', id })}
            onToggleHidden={(id) => dispatch({ type: 'TOGGLE_ELEMENT_HIDDEN', id })}
            onRenameElement={(id, name) => dispatch({ type: 'RENAME_ELEMENT', id, name })}
            onReorderZIndex={(id, direction) => dispatch({ type: 'REORDER_ELEMENT_ZINDEX', id, direction })}
            onDeleteElement={(id) => dispatch({ type: 'DELETE_ELEMENT', id })}
          />
        </div>

        {/* Center Canvas */}
        <MakeCanvas
          elements={state.elements}
          selectedId={state.selectedId}
          selectedIds={state.selectedIds}
          canvasSettings={state.canvasSettings}
          onSelect={(id, multi) => dispatch({ type: 'SELECT_ELEMENT', id, multi })}
          onSelectMultiple={(ids) => dispatch({ type: 'SELECT_MULTIPLE', ids })}
          onMove={(id, x, y) => dispatch({ type: 'MOVE_ELEMENT', id, x, y })}
          onMoveSelected={(deltaX, deltaY) => dispatch({ type: 'MOVE_SELECTED_ELEMENTS', deltaX, deltaY })}
          onResize={(id, w, h) => dispatch({ type: 'RESIZE_ELEMENT', id, width: w, height: h })}
          onUpdateBounds={(id, x, y, width, height) => dispatch({ type: 'UPDATE_ELEMENT_BOUNDS', id, x, y, width, height })}
          onAlignSelected={(alignment) => dispatch({ type: 'ALIGN_SELECTED', alignment })}
          onDistributeSelected={(axis) => dispatch({ type: 'DISTRIBUTE_SELECTED', axis })}
          onDropElement={handleDropElement}
          onZoomChange={(newZoom) => dispatch({
            type: 'UPDATE_CANVAS_SETTINGS',
            settings: { zoom: newZoom }
          })}
          onLoadTemplate={(template) => {
            const dev = state.canvasSettings?.device || 'desktop';
            let targetSettings = { ...template.canvasSettings, device: dev };
            let targetElements = template.elements.map((el) => ({
              ...el,
              deviceLayouts: {
                desktop: {
                  position: { ...el.position },
                  size: { ...el.size },
                },
              },
            }));

            if (dev === 'mobile') {
              const w = 390;
              const h = 844;
              targetSettings = { ...targetSettings, width: w, height: h, device: 'mobile' };
              targetElements = targetElements.map(el => {
                const elW = typeof el.size.width === 'number' ? el.size.width : 120;
                const maxW = w - 32;
                const newW = Math.min(elW, maxW);
                const newX = Math.max(16, Math.round((w - newW) / 2));
                const mobilePos = { x: newX, y: Math.min(el.position.y, h - 80) };
                const mobileSize = { width: newW, height: el.size.height };
                return {
                  ...el,
                  position: mobilePos,
                  size: mobileSize,
                  deviceLayouts: {
                    ...el.deviceLayouts,
                    mobile: { position: mobilePos, size: mobileSize },
                  },
                };
              });
            } else if (dev === 'tablet') {
              const w = 768;
              const h = 1024;
              targetSettings = { ...targetSettings, width: w, height: h, device: 'tablet' };
              targetElements = targetElements.map(el => {
                const elW = typeof el.size.width === 'number' ? el.size.width : 120;
                const maxW = w - 40;
                const newW = Math.min(elW, maxW);
                const newX = Math.max(20, Math.round((w - newW) / 2));
                const tabletPos = { x: newX, y: el.position.y };
                const tabletSize = { width: newW, height: el.size.height };
                return {
                  ...el,
                  position: tabletPos,
                  size: tabletSize,
                  deviceLayouts: {
                    ...el.deviceLayouts,
                    tablet: { position: tabletPos, size: tabletSize },
                  },
                };
              });
            }

            dispatch({
              type: 'LOAD_PROJECT',
              elements: targetElements,
              canvasSettings: targetSettings,
              projectName: template.name,
            });
          }}
        />

        {/* Right Settings Columns */}
        <div className="hidden md:flex w-[280px] shrink-0 border-l flex-col overflow-hidden" style={{
          borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
          backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          height: '100%',
          maxHeight: '100%',
        }}>
          
          {/* Properties vs AI Tabs */}
          <div className="flex border-b" style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }}>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'properties'
                  ? 'border-primary text-foreground bg-muted/50'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Properties</span>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'border-primary text-foreground bg-muted/50'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>AI Assistant</span>
            </button>
          </div>

          {/* Active Tab Panel view */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            {activeTab === 'properties' ? (
              <MakePropertiesPanel
                variant="sidebar"
                selectedElement={selectedElement}
                onUpdateStyle={(id, styles) => dispatch({ type: 'UPDATE_ELEMENT_STYLE', id, styles })}
                onUpdateProps={(id, payload) => dispatch({ type: 'UPDATE_ELEMENT_PROPS', id, payload })}
                onUpdateSize={(id, w, h) => dispatch({ type: 'RESIZE_ELEMENT', id, width: w, height: h })}
                onMove={(id, x, y) => dispatch({ type: 'MOVE_ELEMENT', id, x, y })}
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
                    type: 'APPLY_AI_ELEMENTS',
                    elements: elems,
                    canvasSettings: settings,
                  });
                }}
              />
            )}
          </div>
        </div>

      </div>

      {/* MOBILE BOTTOM TOOLBAR (Shown on screens < md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] h-14 bg-background/95 border-t border-border backdrop-blur-lg flex items-center justify-around px-2 text-foreground">
        <button
          onClick={() => setMobileDrawer(mobileDrawer === 'toolbar' ? null : 'toolbar')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium py-1 px-3 rounded-lg transition-colors ${
            mobileDrawer === 'toolbar' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Grid className="h-4 w-4" />
          <span>Add Element</span>
        </button>

        <button
          onClick={() => setMobileDrawer(mobileDrawer === 'properties' ? null : 'properties')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium py-1 px-3 rounded-lg transition-colors ${
            mobileDrawer === 'properties' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Properties</span>
        </button>

        <button
          onClick={() => setMobileDrawer(mobileDrawer === 'ai' ? null : 'ai')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium py-1 px-3 rounded-lg transition-colors ${
            mobileDrawer === 'ai' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bot className="h-4 w-4" />
          <span>AI Assist</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const next = currentDevice === 'mobile' ? 'desktop' : currentDevice === 'desktop' ? 'tablet' : 'mobile';
            handleDeviceChange(next);
          }}
          className="flex flex-col items-center justify-center gap-1 text-[10px] font-medium py-1 px-2.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          title={`Switch device (current: ${currentDevice})`}
        >
          {currentDevice === 'mobile' ? (
            <Smartphone className="h-4 w-4" />
          ) : currentDevice === 'tablet' ? (
            <Tablet className="h-4 w-4" />
          ) : (
            <Monitor className="h-4 w-4" />
          )}
          <span className="capitalize">{currentDevice}</span>
        </button>
      </div>

      {/* MOBILE BOTTOM DRAWER OVERLAY */}
      {mobileDrawer && (
        <div className="md:hidden fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm flex flex-col justify-end" onClick={() => setMobileDrawer(null)}>
          <div 
            className="w-full max-h-[75vh] bg-card border-t border-border rounded-t-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                {mobileDrawer === 'toolbar' && 'Add Elements'}
                {mobileDrawer === 'properties' && 'Properties Inspector'}
                {mobileDrawer === 'ai' && 'AI Assistant'}
              </span>
              <button 
                onClick={() => setMobileDrawer(null)}
                className="text-xs font-semibold px-2 py-1 bg-muted hover:bg-accent text-foreground rounded"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2" style={{ maxHeight: 'calc(75vh - 50px)' }}>
              {mobileDrawer === 'toolbar' && (
                <MakeToolbar variant="drawer" onAddElement={(elem) => { handleAddElement(elem); setMobileDrawer(null); }} />
              )}
              {mobileDrawer === 'properties' && (
                <MakePropertiesPanel
                  variant="drawer"
                  selectedElement={selectedElement}
                  onUpdateStyle={(id, styles) => dispatch({ type: 'UPDATE_ELEMENT_STYLE', id, styles })}
                  onUpdateProps={(id, payload) => dispatch({ type: 'UPDATE_ELEMENT_PROPS', id, payload })}
                  onUpdateSize={(id, w, h) => dispatch({ type: 'RESIZE_ELEMENT', id, width: w, height: h })}
                  onMove={(id, x, y) => dispatch({ type: 'MOVE_ELEMENT', id, x, y })}
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
                      type: 'APPLY_AI_ELEMENTS',
                      elements: elems,
                      canvasSettings: settings,
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

      {/* COMMAND PALETTE & KEYBOARD SHORTCUTS MODAL */}
      {isShortcutsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsShortcutsOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border p-5 shadow-2xl space-y-4 bg-card border-border text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Command className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Command Palette & Shortcuts</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShortcutsOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Undo</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Ctrl+Z</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Redo</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Ctrl+Y</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Copy Selection</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Ctrl+C</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Paste Elements</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Ctrl+V</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Duplicate Selection</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Ctrl+D</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Delete Selection</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Del / Backspace</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Select All</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Ctrl+A</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Multi-Select</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Shift+Click</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Marquee Box</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Drag Canvas</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Axis Lock Drag</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Shift+Drag</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Reset Zoom (100%)</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Ctrl+0</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border/50">
                  <span>Zoom In / Out</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono text-[10px]">Ctrl + / -</kbd>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Quick Action:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsShortcutsOpen(false);
                      setIsExportOpen(true);
                    }}
                    className="px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-foreground text-xs font-medium cursor-pointer"
                  >
                    Open Export
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsShortcutsOpen(false);
                      setIsShareOpen(true);
                    }}
                    className="px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-foreground text-xs font-medium cursor-pointer"
                  >
                    Open Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

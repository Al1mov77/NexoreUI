'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Minus,
  Plus,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  ArrowLeftRight,
  ArrowUpDown,
} from 'lucide-react';
import { NexoreMakeElement, CanvasSettings } from '../types';
import MakeWelcomeScreen from './MakeWelcomeScreen';
import { Template } from '../templates';
import { ElementRenderer } from './ElementRenderer';

interface MakeCanvasProps {
  elements: NexoreMakeElement[];
  selectedId: string | null;
  selectedIds?: string[];
  canvasSettings: CanvasSettings;
  onSelect: (id: string | null, multi?: boolean) => void;
  onSelectMultiple?: (ids: string[]) => void;
  onMove: (id: string, x: number, y: number) => void;
  onMoveSelected?: (deltaX: number, deltaY: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onUpdateBounds?: (
    id: string,
    x: number,
    y: number,
    width: number | string,
    height: number | string
  ) => void;
  onAlignSelected?: (
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
  ) => void;
  onDistributeSelected?: (axis: 'horizontal' | 'vertical') => void;
  onDropElement: (type: string, props: any, x: number, y: number) => void;
  onZoomChange?: (zoom: number) => void;
  onLoadTemplate?: (template: Template) => void;
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const CURSOR_MAP: Record<ResizeDir, string> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
  sw: 'nesw-resize',
};

function parseNum(val: number | string | undefined, fallback: number): number {
  if (typeof val === 'number') return val;
  if (!val) return fallback;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? fallback : parsed;
}

export default function MakeCanvas({
  elements,
  selectedId,
  selectedIds = [],
  canvasSettings,
  onSelect,
  onSelectMultiple,
  onMove,
  onMoveSelected,
  onResize,
  onUpdateBounds,
  onAlignSelected,
  onDistributeSelected,
  onDropElement,
  onZoomChange,
  onLoadTemplate,
}: MakeCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { zoom, gridVisible, width, height, backgroundColor } = canvasSettings;

  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  const effectiveSelectedIds = selectedIds.length > 0 ? selectedIds : selectedId ? [selectedId] : [];

  const clampZoom = useCallback((val: number) => {
    return Math.min(2, Math.max(0.25, Math.round(val * 100) / 100));
  }, []);

  const handleFitZoom = useCallback(() => {
    if (!wrapperRef.current || !onZoomChange) return;
    const availW = Math.max(200, wrapperRef.current.clientWidth - 64);
    const availH = Math.max(200, wrapperRef.current.clientHeight - 64);
    const fitScale = Math.min(availW / width, availH / height, 1);
    onZoomChange(clampZoom(fitScale));
  }, [width, height, onZoomChange, clampZoom]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !onZoomChange) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        onZoomChange(clampZoom(zoom + delta));
      }
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => wrapper.removeEventListener('wheel', handleWheel);
  }, [zoom, onZoomChange, clampZoom]);

  // High-performance drag reference (avoids React re-renders on move pixels)
  const dragRef = useRef<{
    id: string;
    domElement: HTMLElement;
    startMouseX: number;
    startMouseY: number;
    startElX: number;
    startElY: number;
    currentX: number;
    currentY: number;
    elWidth: number;
    elHeight: number;
    isGroup: boolean;
    groupStarts: Map<string, { x: number; y: number; dom: HTMLElement }>;
  } | null>(null);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [resizeTooltip, setResizeTooltip] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  // Smart snapping guides
  const [guideLines, setGuideLines] = useState<{ x?: number; y?: number } | null>(null);

  // Marquee selection
  const [marquee, setMarquee] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  const marqueeRef = useRef(false);

  // ─── DROP FROM TOOLBAR ──────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const type = e.dataTransfer.getData('element-type');
    const propsStr = e.dataTransfer.getData('item-props');
    if (!type || !propsStr) return;

    let props: any;
    try {
      props = JSON.parse(propsStr);
    } catch {
      props = {};
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const elW = typeof props.size?.width === 'number' ? props.size.width : 120;
    const elH = typeof props.size?.height === 'number' ? props.size.height : 40;

    const dropX = Math.max(0, Math.min(width - elW, Math.round(x - elW / 2)));
    const dropY = Math.max(0, Math.min(height - elH, Math.round(y - elH / 2)));
    onDropElement(type, props, dropX, dropY);
  };

  // ─── CANVAS MARQUEE SELECTION ──────────────────────────
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if (e.target !== canvasRef.current && e.target !== wrapperRef.current) return;
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const startX = (e.clientX - rect.left) / zoom;
    const startY = (e.clientY - rect.top) / zoom;

    if (!e.shiftKey) {
      onSelect(null);
    }

    marqueeRef.current = true;
    setMarquee({ startX, startY, currentX: startX, currentY: startY });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!marqueeRef.current || !marquee || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / zoom;
    const currentY = (e.clientY - rect.top) / zoom;
    setMarquee((prev) => (prev ? { ...prev, currentX, currentY } : null));

    // Calculate box
    const left = Math.min(marquee.startX, currentX);
    const right = Math.max(marquee.startX, currentX);
    const top = Math.min(marquee.startY, currentY);
    const bottom = Math.max(marquee.startY, currentY);

    if (Math.abs(right - left) > 4 || Math.abs(bottom - top) > 4) {
      const selected = elements
        .filter((el) => {
          if (el.hidden) return false;
          const w = parseNum(el.size.width, 100);
          const h = parseNum(el.size.height, 40);
          return (
            el.position.x < right &&
            el.position.x + w > left &&
            el.position.y < bottom &&
            el.position.y + h > top
          );
        })
        .map((el) => el.id);

      if (onSelectMultiple) {
        onSelectMultiple(selected);
      }
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent) => {
    if (marqueeRef.current) {
      marqueeRef.current = false;
      setMarquee(null);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // ─── POINTER DRAG (Individual + Group Drag with Smart Snapping) ──────
  const handleElementPointerDown = useCallback(
    (e: React.PointerEvent, el: NexoreMakeElement) => {
      e.preventDefault();
      e.stopPropagation();

      const isMulti = e.shiftKey;
      const isAlreadyInSelection = effectiveSelectedIds.includes(el.id);

      if (isMulti) {
        onSelect(el.id, true);
      } else if (!isAlreadyInSelection) {
        onSelect(el.id, false);
      }

      if (el.locked) return;

      const domElement = e.currentTarget as HTMLElement;
      domElement.setPointerCapture(e.pointerId);
      setActiveDragId(el.id);

      const elWidth = parseNum(el.size.width, 100);
      const elHeight = parseNum(el.size.height, 40);

      const isGroup = effectiveSelectedIds.length > 1 && isAlreadyInSelection;
      const groupStarts = new Map<string, { x: number; y: number; dom: HTMLElement }>();

      if (isGroup) {
        effectiveSelectedIds.forEach((id) => {
          const targetEl = elements.find((x) => x.id === id);
          const dom = document.querySelector(`[data-element-id="${id}"]`) as HTMLElement | null;
          if (targetEl && dom) {
            groupStarts.set(id, { x: targetEl.position.x, y: targetEl.position.y, dom });
          }
        });
      }

      dragRef.current = {
        id: el.id,
        domElement,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startElX: el.position.x,
        startElY: el.position.y,
        currentX: el.position.x,
        currentY: el.position.y,
        elWidth,
        elHeight,
        isGroup,
        groupStarts,
      };
    },
    [effectiveSelectedIds, elements, onSelect]
  );

  const handleElementPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      let deltaX = (e.clientX - drag.startMouseX) / zoom;
      let deltaY = (e.clientY - drag.startMouseY) / zoom;

      if (e.shiftKey) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          deltaY = 0;
        } else {
          deltaX = 0;
        }
      }

      let targetX = drag.startElX + deltaX;
      let targetY = drag.startElY + deltaY;

      // Smart snapping threshold: 6px
      let snappedX = targetX;
      let snappedY = targetY;
      let guideX: number | undefined;
      let guideY: number | undefined;

      const otherElements = elements.filter(
        (el) => el.id !== drag.id && !effectiveSelectedIds.includes(el.id) && !el.hidden
      );

      // Check alignment to other elements
      for (const other of otherElements) {
        const otherW = parseNum(other.size.width, 100);
        const otherH = parseNum(other.size.height, 40);

        // Snap X (left, center, right)
        if (Math.abs(targetX - other.position.x) < 6) {
          snappedX = other.position.x;
          guideX = other.position.x;
        } else if (Math.abs(targetX + drag.elWidth - (other.position.x + otherW)) < 6) {
          snappedX = other.position.x + otherW - drag.elWidth;
          guideX = other.position.x + otherW;
        } else if (
          Math.abs(targetX + drag.elWidth / 2 - (other.position.x + otherW / 2)) < 6
        ) {
          snappedX = other.position.x + otherW / 2 - drag.elWidth / 2;
          guideX = other.position.x + otherW / 2;
        }

        // Snap Y (top, middle, bottom)
        if (Math.abs(targetY - other.position.y) < 6) {
          snappedY = other.position.y;
          guideY = other.position.y;
        } else if (Math.abs(targetY + drag.elHeight - (other.position.y + otherH)) < 6) {
          snappedY = other.position.y + otherH - drag.elHeight;
          guideY = other.position.y + otherH;
        } else if (
          Math.abs(targetY + drag.elHeight / 2 - (other.position.y + otherH / 2)) < 6
        ) {
          snappedY = other.position.y + otherH / 2 - drag.elHeight / 2;
          guideY = other.position.y + otherH / 2;
        }
      }

      // Snap to 8px grid if no element snap
      if (gridVisible) {
        if (guideX === undefined) snappedX = Math.round(snappedX / 8) * 8;
        if (guideY === undefined) snappedY = Math.round(snappedY / 8) * 8;
      }

      setGuideLines(guideX !== undefined || guideY !== undefined ? { x: guideX, y: guideY } : null);

      const elW = drag.elWidth || 100;
      const elH = drag.elHeight || 40;

      const clampedX = Math.max(0, Math.min(width - elW, Math.round(snappedX)));
      const clampedY = Math.max(0, Math.min(height - elH, Math.round(snappedY)));

      const finalDeltaX = clampedX - drag.startElX;
      const finalDeltaY = clampedY - drag.startElY;

      drag.currentX = clampedX;
      drag.currentY = clampedY;

      if (drag.isGroup && drag.groupStarts.size > 0) {
        drag.groupStarts.forEach((info) => {
          info.dom.style.left = `${Math.round(info.x + finalDeltaX)}px`;
          info.dom.style.top = `${Math.round(info.y + finalDeltaY)}px`;
        });
      } else {
        drag.domElement.style.left = `${clampedX}px`;
        drag.domElement.style.top = `${clampedY}px`;
      }
    },
    [zoom, width, height, elements, effectiveSelectedIds, gridVisible]
  );

  const handleElementPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      try {
        drag.domElement.releasePointerCapture(e.pointerId);
      } catch {}

      setActiveDragId(null);
      setGuideLines(null);

      const deltaX = drag.currentX - drag.startElX;
      const deltaY = drag.currentY - drag.startElY;

      if (deltaX !== 0 || deltaY !== 0) {
        if (drag.isGroup && onMoveSelected) {
          onMoveSelected(deltaX, deltaY);
        } else {
          onMove(drag.id, drag.currentX, drag.currentY);
        }
      }

      dragRef.current = null;
    },
    [onMove, onMoveSelected]
  );

  // ─── 8-DIRECTION RESIZE HANDLER ────────────────────────────
  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent, el: NexoreMakeElement, dir: ResizeDir) => {
      e.preventDefault();
      e.stopPropagation();
      if (el.locked) return;

      const handleEl = e.currentTarget as HTMLElement;
      handleEl.setPointerCapture(e.pointerId);

      const startMouseX = e.clientX;
      const startMouseY = e.clientY;
      const startX = el.position.x;
      const startY = el.position.y;
      const startW = parseNum(el.size.width, 100);
      const startH = parseNum(el.size.height, 40);

      const domElement = document.querySelector(
        `[data-element-id="${el.id}"]`
      ) as HTMLElement | null;

      const onPointerMove = (moveEv: PointerEvent) => {
        let dx = (moveEv.clientX - startMouseX) / zoom;
        let dy = (moveEv.clientY - startMouseY) / zoom;

        let newX = startX;
        let newY = startY;
        let newW = startW;
        let newH = startH;

        if (dir.includes('e')) newW = Math.max(20, startW + dx);
        if (dir.includes('s')) newH = Math.max(16, startH + dy);

        if (dir.includes('w')) {
          const maxDx = startW - 20;
          const appliedDx = Math.min(maxDx, dx);
          newW = startW - appliedDx;
          newX = startX + appliedDx;
        }

        if (dir.includes('n')) {
          const maxDy = startH - 16;
          const appliedDy = Math.min(maxDy, dy);
          newH = startH - appliedDy;
          newY = startY + appliedDy;
        }

        if (gridVisible) {
          newW = Math.round(newW / 8) * 8;
          newH = Math.round(newH / 8) * 8;
        }

        newX = Math.max(0, Math.min(width - newW, Math.round(newX)));
        newY = Math.max(0, Math.min(height - newH, Math.round(newY)));

        if (domElement) {
          domElement.style.left = `${newX}px`;
          domElement.style.top = `${newY}px`;
          domElement.style.width = `${newW}px`;
          domElement.style.height = `${newH}px`;
        }

        setResizeTooltip({
          x: moveEv.clientX,
          y: moveEv.clientY,
          w: Math.round(newW),
          h: Math.round(newH),
        });
      };

      const onPointerUp = (upEv: PointerEvent) => {
        try {
          handleEl.releasePointerCapture(upEv.pointerId);
        } catch {}

        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        setResizeTooltip(null);

        if (!domElement) return;
        const finalX = parseInt(domElement.style.left) || startX;
        const finalY = parseInt(domElement.style.top) || startY;
        const finalW = parseInt(domElement.style.width) || startW;
        const finalH = parseInt(domElement.style.height) || startH;

        if (onUpdateBounds) {
          onUpdateBounds(el.id, finalX, finalY, finalW, finalH);
        } else {
          if (finalX !== startX || finalY !== startY) onMove(el.id, finalX, finalY);
          if (finalW !== startW || finalH !== startH) onResize(el.id, finalW, finalH);
        }
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    },
    [zoom, width, height, gridVisible, onMove, onResize, onUpdateBounds]
  );

  const ResizeHandles = ({ el }: { el: NexoreMakeElement }) => {
    const dirs: ResizeDir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
    return (
      <>
        {dirs.map((dir) => {
          let posClass = '';
          switch (dir) {
            case 'n':
              posClass = 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2';
              break;
            case 's':
              posClass = 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2';
              break;
            case 'e':
              posClass = 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2';
              break;
            case 'w':
              posClass = 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2';
              break;
            case 'ne':
              posClass = 'top-0 right-0 -translate-y-1/2 translate-x-1/2';
              break;
            case 'nw':
              posClass = 'top-0 left-0 -translate-y-1/2 -translate-x-1/2';
              break;
            case 'se':
              posClass = 'bottom-0 right-0 translate-y-1/2 translate-x-1/2';
              break;
            case 'sw':
              posClass = 'bottom-0 left-0 translate-y-1/2 -translate-x-1/2';
              break;
          }

          return (
            <div
              key={dir}
              onPointerDown={(e) => handleResizePointerDown(e, el, dir)}
              className={`absolute z-30 w-2.5 h-2.5 rounded-full border border-background bg-foreground shadow-sm ${posClass}`}
              style={{ cursor: CURSOR_MAP[dir] }}
            />
          );
        })}
      </>
    );
  };

  return (
    <div
      ref={wrapperRef}
      className="flex-1 overflow-auto flex items-center justify-center relative p-8 select-none make-canvas-wrapper"
      style={{ backgroundColor: 'var(--make-canvas-bg, #030303)' }}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={handleCanvasPointerUp}
    >
      {elements.length === 0 && onLoadTemplate && (
        <MakeWelcomeScreen onSelectTemplate={onLoadTemplate} />
      )}

      {/* Floating Alignment & Distribution Toolbar for Multi-Selection */}
      {effectiveSelectedIds.length >= 2 && onAlignSelected && (
        <div
          className="fixed top-20 z-40 flex items-center gap-1 rounded-lg border px-2 py-1 shadow-lg bg-card text-foreground border-border select-none animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <span className="text-[10px] font-mono text-muted-foreground mr-1.5 uppercase tracking-wider">
            {effectiveSelectedIds.length} Selected
          </span>
          <button
            type="button"
            onClick={() => onAlignSelected('left')}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onAlignSelected('center')}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Align Center Horizontally"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onAlignSelected('right')}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-border mx-0.5" />
          <button
            type="button"
            onClick={() => onAlignSelected('top')}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Align Top"
          >
            <AlignVerticalJustifyStart className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onAlignSelected('middle')}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Align Middle Vertically"
          >
            <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onAlignSelected('bottom')}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Align Bottom"
          >
            <AlignVerticalJustifyEnd className="w-3.5 h-3.5" />
          </button>

          {effectiveSelectedIds.length >= 3 && onDistributeSelected && (
            <>
              <div className="w-px h-3.5 bg-border mx-0.5" />
              <button
                type="button"
                onClick={() => onDistributeSelected('horizontal')}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Distribute Horizontally"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDistributeSelected('vertical')}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Distribute Vertically"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Canvas Node */}
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${
          canvasSettings.device === 'mobile'
            ? 'rounded-[36px] border-4 border-zinc-700/80 dark:border-zinc-800 ring-1 ring-zinc-500/30 dark:ring-zinc-700/50'
            : canvasSettings.device === 'tablet'
            ? 'rounded-2xl border-2 border-zinc-700/80 dark:border-zinc-800 ring-1 ring-zinc-500/30 dark:ring-zinc-700/50'
            : 'rounded-xl border border-zinc-300 dark:border-zinc-800/80'
        }`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: backgroundColor || 'var(--make-surface, #09090b)',
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          backgroundImage: gridVisible
            ? 'radial-gradient(circle, var(--make-grid-dot, #27272a) 1px, transparent 1px)'
            : 'none',
          backgroundSize: '20px 20px',
          flexShrink: 0,
          margin: 'auto',
        }}
      >
        {/* Mobile Dynamic Island / Speaker notch */}
        {canvasSettings.device === 'mobile' && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-950 rounded-full z-40 border border-zinc-800/80 pointer-events-none flex items-center justify-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          </div>
        )}

        {/* Smart Snapping Guide Lines */}
        {guideLines && (
          <>
            {guideLines.x !== undefined && (
              <div
                className="absolute top-0 bottom-0 pointer-events-none z-50 border-l border-red-500/80"
                style={{ left: `${guideLines.x}px` }}
              />
            )}
            {guideLines.y !== undefined && (
              <div
                className="absolute left-0 right-0 pointer-events-none z-50 border-t border-red-500/80"
                style={{ top: `${guideLines.y}px` }}
              />
            )}
          </>
        )}

        {/* Marquee Selection Box */}
        {marquee && (
          <div
            className="absolute border border-primary/80 bg-primary/10 pointer-events-none z-50 rounded"
            style={{
              left: `${Math.min(marquee.startX, marquee.currentX)}px`,
              top: `${Math.min(marquee.startY, marquee.currentY)}px`,
              width: `${Math.abs(marquee.currentX - marquee.startX)}px`,
              height: `${Math.abs(marquee.currentY - marquee.startY)}px`,
            }}
          />
        )}

        {/* Render elements */}
        {elements.map((el) => {
          if (el.hidden) return null;
          const isSelected = effectiveSelectedIds.includes(el.id);
          const isDragging = activeDragId === el.id;

          return (
            <div
              key={el.id}
              data-element-id={el.id}
              onPointerDown={(e) => handleElementPointerDown(e, el)}
              onPointerMove={handleElementPointerMove}
              onPointerUp={handleElementPointerUp}
              style={{
                position: 'absolute',
                left: el.position.x,
                top: el.position.y,
                width: el.size.width,
                height: el.size.height,
                zIndex: el.zIndex,
                cursor: el.locked ? 'default' : isDragging ? 'grabbing' : 'grab',
                willChange: isDragging ? 'left, top' : 'auto',
              }}
              className={`group touch-none ${
                isSelected
                  ? 'ring-2 ring-ring ring-offset-1 rounded'
                  : 'hover:ring-1 hover:ring-ring/30 rounded'
              }`}
            >
              <ElementRenderer element={el} mode="edit" isSelected={isSelected} isLight={isLight} />

              {/* 8-Direction Resize Handles (when single selected) */}
              {isSelected && effectiveSelectedIds.length === 1 && !el.locked && (
                <ResizeHandles el={el} />
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Zoom Control Bar */}
      {onZoomChange && elements.length > 0 && (
        <div
          className="fixed bottom-16 md:bottom-5 right-5 z-40 flex items-center gap-1 rounded-lg border px-1.5 py-1 shadow-md select-none bg-card border-border text-foreground"
        >
          <button
            type="button"
            onClick={() => onZoomChange(clampZoom(zoom - 0.1))}
            disabled={zoom <= 0.25}
            className="p-1 rounded hover:bg-muted disabled:opacity-40 cursor-pointer transition-colors"
            title="Zoom Out (Ctrl+-)"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(1)}
            className="px-2 py-0.5 text-[11px] font-mono tabular-nums rounded hover:bg-muted cursor-pointer transition-colors"
            title="Reset Zoom to 100% (Ctrl+0)"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(clampZoom(zoom + 0.1))}
            disabled={zoom >= 2}
            className="p-1 rounded hover:bg-muted disabled:opacity-40 cursor-pointer transition-colors"
            title="Zoom In (Ctrl+=)"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <div className="w-px h-3.5 bg-border mx-0.5" />
          <button
            type="button"
            onClick={handleFitZoom}
            className="px-1.5 py-0.5 text-[10px] font-medium rounded hover:bg-muted flex items-center gap-1 cursor-pointer transition-colors"
            title="Fit Canvas to Viewport"
          >
            <Maximize2 className="h-3 w-3" />
            <span>Fit</span>
          </button>
        </div>
      )}

      {/* Resize dimension tooltip */}
      {resizeTooltip && (
        <div
          className="fixed z-50 px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] font-mono font-bold shadow-lg pointer-events-none tabular-nums"
          style={{
            left: resizeTooltip.x + 12,
            top: resizeTooltip.y + 12,
          }}
        >
          {resizeTooltip.w} × {resizeTooltip.h}
        </div>
      )}
    </div>
  );
}
export { MakeCanvas };
export type { MakeCanvasProps };

import React, { useRef, useState, useCallback } from 'react';
import { NexoreMakeElement, CanvasSettings } from '../types';

interface MakeCanvasProps {
  elements: NexoreMakeElement[];
  selectedId: string | null;
  canvasSettings: CanvasSettings;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDropElement: (type: string, props: any, x: number, y: number) => void;
  onZoomChange?: (zoom: number) => void;
}

export default function MakeCanvas({
  elements,
  selectedId,
  canvasSettings,
  onSelect,
  onMove,
  onResize,
  onDropElement,
  onZoomChange,
}: MakeCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { zoom, gridVisible, width, height, backgroundColor } = canvasSettings;

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
  } | null>(null);

  // Simple state for visual cursor feedback (down/up triggers only)
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

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

    const props = JSON.parse(propsStr);
    const rect = canvasRef.current.getBoundingClientRect();

    // Correct: use canvas bounding rect and divide by current zoom
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const elW = typeof props.size.width === 'number' ? props.size.width : 120;
    const elH = typeof props.size.height === 'number' ? props.size.height : 40;

    // Center element on drop point
    onDropElement(type, props, Math.round(x - elW / 2), Math.round(y - elH / 2));
  };

  // ─── CANVAS CLICK TO DESELECT ──────────────────────────
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === wrapperRef.current) {
      onSelect(null);
    }
  };

  // ─── POINTER DRAG (Direct DOM manipulation for 60fps smooth dragging) ──────
  const handleElementPointerDown = useCallback((e: React.PointerEvent, el: NexoreMakeElement) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(el.id);

    const domElement = e.currentTarget as HTMLElement;
    domElement.setPointerCapture(e.pointerId);
    setActiveDragId(el.id);

    dragRef.current = {
      id: el.id,
      domElement,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startElX: el.position.x,
      startElY: el.position.y,
      currentX: el.position.x,
      currentY: el.position.y,
    };
  }, [onSelect]);

  const handleElementPointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;

    const deltaX = (e.clientX - drag.startMouseX) / zoom;
    const deltaY = (e.clientY - drag.startMouseY) / zoom;

    const newX = Math.round(drag.startElX + deltaX);
    const newY = Math.round(drag.startElY + deltaY);

    drag.currentX = newX;
    drag.currentY = newY;

    // Direct style update bypasses React render lag
    drag.domElement.style.left = `${newX}px`;
    drag.domElement.style.top = `${newY}px`;
  }, [zoom]);

  const handleElementPointerUp = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;

    e.currentTarget.releasePointerCapture(e.pointerId);
    setActiveDragId(null);

    // Save final position to history/state
    onMove(drag.id, drag.currentX, drag.currentY);
    dragRef.current = null;
  }, [onMove]);

  // ─── RESIZE HANDLES ───────────────────────────────────
  const handleResizeStart = (e: React.MouseEvent, el: NexoreMakeElement, dir: 'r' | 'b' | 'se') => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = typeof el.size.width === 'number' ? el.size.width : 100;
    const startHeight = typeof el.size.height === 'number' ? el.size.height : 50;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoom;
      const deltaY = (moveEvent.clientY - startY) / zoom;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (dir === 'r' || dir === 'se') {
        newWidth = Math.max(20, startWidth + deltaX);
      }
      if (dir === 'b' || dir === 'se') {
        newHeight = Math.max(20, startHeight + deltaY);
      }

      onResize(el.id, Math.round(newWidth), Math.round(newHeight));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // ─── SCROLL REDIRECTION ──────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Redirect scroll to the properties panel scroll container
    const propertiesPanel = document.querySelector('.properties-scroll-container');
    if (propertiesPanel) {
      propertiesPanel.scrollTop += e.deltaY;
    }
  }, []);

  // ─── ELEMENT PREVIEW RENDERER ────────────────────────────
  const renderElementPreview = (el: NexoreMakeElement) => {
    let animationClass = '';
    if (el.animationPreset && el.animationPreset !== 'none') {
      if (el.animationPreset === 'pulse') animationClass = 'animate-pulse';
      else if (el.animationPreset === 'bounce') animationClass = 'animate-bounce';
      else if (el.animationPreset === 'spin') animationClass = 'animate-spin';
    }

    const mergedStyles: React.CSSProperties = { ...el.styles };
    
    if (el.styles.backgroundGradient && el.styles.backgroundGradient !== 'none') {
      mergedStyles.background = el.styles.backgroundGradient;
      delete mergedStyles.backgroundColor;
    }

    const transforms: string[] = [];
    if ((el.styles as any).rotate) transforms.push(`rotate(${(el.styles as any).rotate}deg)`);
    if ((el.styles as any).scaleX || (el.styles as any).scaleY) {
      transforms.push(`scale(${(el.styles as any).scaleX || 1}, ${(el.styles as any).scaleY || 1})`);
    }
    if ((el.styles as any).skewX) transforms.push(`skewX(${(el.styles as any).skewX}deg)`);
    if ((el.styles as any).skewY) transforms.push(`skewY(${(el.styles as any).skewY}deg)`);
    if (transforms.length > 0) mergedStyles.transform = transforms.join(' ');

    const filters: string[] = [];
    if ((el.styles as any).blur) filters.push(`blur(${(el.styles as any).blur}px)`);
    if ((el.styles as any).saturate) filters.push(`saturate(${(el.styles as any).saturate}%)`);
    if ((el.styles as any).brightness) filters.push(`brightness(${(el.styles as any).brightness}%)`);
    if ((el.styles as any).contrast) filters.push(`contrast(${(el.styles as any).contrast}%)`);
    if (filters.length > 0) mergedStyles.filter = filters.join(' ');

    const bdFilters: string[] = [];
    if ((el.styles as any).backdropBlur) bdFilters.push(`blur(${(el.styles as any).backdropBlur}px)`);
    if ((el.styles as any).backdropSaturate) bdFilters.push(`saturate(${(el.styles as any).backdropSaturate}%)`);
    if (bdFilters.length > 0) mergedStyles.backdropFilter = bdFilters.join(' ');

    if ((el.styles as any).letterSpacing) mergedStyles.letterSpacing = `${(el.styles as any).letterSpacing}px`;
    if ((el.styles as any).lineHeight) mergedStyles.lineHeight = `${(el.styles as any).lineHeight}`;

    if (el.styles.paddingTop || el.styles.paddingRight || el.styles.paddingBottom || el.styles.paddingLeft) {
      mergedStyles.padding = `${el.styles.paddingTop || '0px'} ${el.styles.paddingRight || '0px'} ${el.styles.paddingBottom || '0px'} ${el.styles.paddingLeft || '0px'}`;
    }

    if ((el.styles as any).cursor) mergedStyles.cursor = (el.styles as any).cursor;
    if ((el.styles as any).overflow) mergedStyles.overflow = (el.styles as any).overflow;

    const baseClasses = `w-full h-full select-none flex items-center justify-center overflow-hidden transition-shadow ${animationClass}`;

    switch (el.type) {
      case 'button':
        return (
          <button className={`${baseClasses} active:opacity-90 font-medium`} style={mergedStyles}>
            {el.content || 'Button'}
          </button>
        );
      case 'card':
        return (
          <div className={`${baseClasses}`} style={mergedStyles}>
            {el.content && <p className="text-xs opacity-60">{el.content}</p>}
          </div>
        );
      case 'input':
        return (
          <input
            type="text"
            readOnly
            placeholder={el.placeholder || 'Enter text...'}
            className={`${baseClasses} px-3 border border-zinc-800 rounded outline-none pointer-events-none text-xs`}
            style={mergedStyles}
          />
        );
      case 'text':
        return (
          <div className={`${baseClasses}`} style={mergedStyles}>
            {el.content || 'Hello World'}
          </div>
        );
      case 'badge':
        return (
          <span className={`${baseClasses} px-2 py-0.5 rounded-full text-xs font-semibold`} style={mergedStyles}>
            {el.content || 'Badge'}
          </span>
        );
      case 'avatar':
        return (
          <div className={`${baseClasses} rounded-full border border-zinc-800`} style={mergedStyles}>
            {el.content ? (
              <span className="text-xs font-bold">{el.content}</span>
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
          <div className={`${baseClasses} text-inherit`} style={mergedStyles}>
            <span className="text-lg">✦</span>
          </div>
        );
      case 'divider':
        return <hr className="w-full border-none" style={{ height: '1px', backgroundColor: mergedStyles.backgroundColor || '#27272a', ...mergedStyles }} />;
      case 'image':
        return (
          <img
            src={el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}
            alt="Preview"
            className={`${baseClasses} object-cover rounded`}
            style={mergedStyles}
          />
        );
      case 'switch':
        return (
          <div className={`${baseClasses} flex items-center gap-2`} style={mergedStyles}>
            <div className="w-9 h-5 bg-violet-600 rounded-full p-0.5 transition-all flex items-center justify-end">
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </div>
            <span className="text-xs font-sans">{el.content || 'Switch'}</span>
          </div>
        );
      case 'checkbox':
        return (
          <div className={`${baseClasses} flex items-center gap-2`} style={mergedStyles}>
            <div className="w-4 h-4 border border-zinc-700 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
              <div className="w-2 h-2 bg-violet-500 rounded-sm" />
            </div>
            <span className="text-xs font-sans select-none">{el.content || 'Checkbox'}</span>
          </div>
        );
      case 'progress':
        return (
          <div className={`${baseClasses} rounded-full p-0.5 flex items-center`} style={{ ...mergedStyles, backgroundColor: mergedStyles.backgroundColor || 'rgba(39,39,42,1)' }}>
            <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: el.content || '60%' }} />
          </div>
        );
      default:
        return <div className="w-full h-full border border-zinc-800" style={mergedStyles} />;
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="flex-1 overflow-hidden flex items-center justify-center relative p-8 select-none make-canvas-wrapper"
      style={{ backgroundColor: 'var(--make-canvas-bg, #030303)' }}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
    >
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
        className="relative shadow-2xl rounded-xl transition-transform duration-75"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: backgroundColor || 'var(--make-surface, #09090b)',
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          backgroundImage: gridVisible ? 'radial-gradient(circle, var(--make-grid-dot, #27272a) 1px, transparent 1px)' : 'none',
          backgroundSize: '20px 20px',
          border: '1px solid var(--make-border, rgba(39,39,42,0.5))',
        }}
      >
        {/* Render elements with pointer-based dragging */}
        {elements.map((el) => {
          const isSelected = selectedId === el.id;
          const isDragging = activeDragId === el.id;

          return (
            <div
              key={el.id}
              onPointerDown={(e) => handleElementPointerDown(e, el)}
              onPointerMove={handleElementPointerMove}
              onPointerUp={handleElementPointerUp}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(el.id);
              }}
              style={{
                position: 'absolute',
                left: el.position.x,
                top: el.position.y,
                width: el.size.width,
                height: el.size.height,
                zIndex: el.zIndex,
                cursor: isDragging ? 'grabbing' : 'grab',
                willChange: isDragging ? 'left, top' : 'auto',
              }}
              className={`group touch-none ${
                isSelected
                  ? 'ring-2 ring-violet-500 ring-offset-1 rounded'
                  : 'hover:ring-1 hover:ring-violet-500/30 rounded'
              }`}
            >
              {renderElementPreview(el)}

              {/* Resize Handles */}
              {isSelected && (
                <>
                  {/* Right edge */}
                  <div
                    className="absolute top-0 right-0 w-1.5 h-full cursor-ew-resize bg-transparent hover:bg-violet-500/30 transition-colors"
                    onMouseDown={(e) => handleResizeStart(e, el, 'r')}
                  />
                  {/* Bottom edge */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-1.5 cursor-ns-resize bg-transparent hover:bg-violet-500/30 transition-colors"
                    onMouseDown={(e) => handleResizeStart(e, el, 'b')}
                  />
                  {/* Southeast corner */}
                  <div
                    className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize bg-violet-500 border border-white rounded-full z-20 shadow-md transform translate-x-1 translate-y-1"
                    onMouseDown={(e) => handleResizeStart(e, el, 'se')}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export { MakeCanvas };
export type { MakeCanvasProps };

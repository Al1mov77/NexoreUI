import React, { useRef, useState, useCallback } from 'react';
import { NexoreMakeElement, CanvasSettings } from '../types';
import MakeWelcomeScreen from './MakeWelcomeScreen';
import { Template } from '../templates';

interface MakeCanvasProps {
  elements: NexoreMakeElement[];
  selectedId: string | null;
  canvasSettings: CanvasSettings;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
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

export default function MakeCanvas({
  elements,
  selectedId,
  canvasSettings,
  onSelect,
  onMove,
  onResize,
  onDropElement,
  onZoomChange,
  onLoadTemplate,
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

  // Resize tooltip
  const [resizeTooltip, setResizeTooltip] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

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

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignore pointer capture errors if already released
    }
    setActiveDragId(null);

    // Only dispatch move if element position actually changed
    if (drag.currentX !== drag.startElX || drag.currentY !== drag.startElY) {
      onMove(drag.id, drag.currentX, drag.currentY);
    }
    dragRef.current = null;
  }, [onMove]);

  // ─── 8-DIRECTION RESIZE HANDLES ───────────────────────────────────
  const handleResizeStart = (e: React.PointerEvent, el: NexoreMakeElement, dir: ResizeDir) => {
    e.preventDefault();
    e.stopPropagation();

    const handleElement = e.currentTarget as HTMLElement;
    handleElement.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = typeof el.size.width === 'number' ? el.size.width : 100;
    const startHeight = typeof el.size.height === 'number' ? el.size.height : 50;
    const startElX = el.position.x;
    const startElY = el.position.y;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoom;
      const deltaY = (moveEvent.clientY - startY) / zoom;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startElX;
      let newY = startElY;

      // East (right)
      if (dir === 'e' || dir === 'se' || dir === 'ne') {
        newWidth = Math.max(20, startWidth + deltaX);
      }
      // West (left)
      if (dir === 'w' || dir === 'sw' || dir === 'nw') {
        const proposedWidth = Math.max(20, startWidth - deltaX);
        newX = startElX + (startWidth - proposedWidth);
        newWidth = proposedWidth;
      }
      // South (bottom)
      if (dir === 's' || dir === 'se' || dir === 'sw') {
        newHeight = Math.max(20, startHeight + deltaY);
      }
      // North (top)
      if (dir === 'n' || dir === 'ne' || dir === 'nw') {
        const proposedHeight = Math.max(20, startHeight - deltaY);
        newY = startElY + (startHeight - proposedHeight);
        newHeight = proposedHeight;
      }

      // If position changed (N/W resize), move element too
      if (newX !== startElX || newY !== startElY) {
        onMove(el.id, Math.round(newX), Math.round(newY));
      }

      onResize(el.id, Math.round(newWidth), Math.round(newHeight));
      setResizeTooltip({
        x: moveEvent.clientX,
        y: moveEvent.clientY,
        w: Math.round(newWidth),
        h: Math.round(newHeight),
      });
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      try {
        handleElement.releasePointerCapture(upEvent.pointerId);
      } catch (err) {}
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      setResizeTooltip(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };



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
    if ((el.styles as any).backdropBrightness && (el.styles as any).backdropBrightness !== '100') bdFilters.push(`brightness(${(el.styles as any).backdropBrightness}%)`);
    if ((el.styles as any).backdropContrast && (el.styles as any).backdropContrast !== '100') bdFilters.push(`contrast(${(el.styles as any).backdropContrast}%)`);
    if (bdFilters.length > 0) mergedStyles.backdropFilter = bdFilters.join(' ');

    if ((el.styles as any).letterSpacing) mergedStyles.letterSpacing = `${(el.styles as any).letterSpacing}px`;
    if ((el.styles as any).lineHeight) mergedStyles.lineHeight = `${(el.styles as any).lineHeight}`;

    if (el.styles.paddingTop || el.styles.paddingRight || el.styles.paddingBottom || el.styles.paddingLeft) {
      mergedStyles.padding = `${el.styles.paddingTop || '0px'} ${el.styles.paddingRight || '0px'} ${el.styles.paddingBottom || '0px'} ${el.styles.paddingLeft || '0px'}`;
    }

    if ((el.styles as any).cursor) mergedStyles.cursor = (el.styles as any).cursor;
    if ((el.styles as any).overflow) mergedStyles.overflow = (el.styles as any).overflow;

    // New style properties
    if (el.styles.textDecoration && el.styles.textDecoration !== 'none') mergedStyles.textDecoration = el.styles.textDecoration;
    if (el.styles.textTransform && el.styles.textTransform !== 'none') mergedStyles.textTransform = el.styles.textTransform;
    if (el.styles.fontStyle && el.styles.fontStyle !== 'normal') mergedStyles.fontStyle = el.styles.fontStyle;
    if (el.styles.wordSpacing) mergedStyles.wordSpacing = el.styles.wordSpacing;
    if (el.styles.textShadow && el.styles.textShadow !== 'none') mergedStyles.textShadow = el.styles.textShadow;
    if (el.styles.borderTopLeftRadius) mergedStyles.borderTopLeftRadius = el.styles.borderTopLeftRadius;
    if (el.styles.borderTopRightRadius) mergedStyles.borderTopRightRadius = el.styles.borderTopRightRadius;
    if (el.styles.borderBottomLeftRadius) mergedStyles.borderBottomLeftRadius = el.styles.borderBottomLeftRadius;
    if (el.styles.borderBottomRightRadius) mergedStyles.borderBottomRightRadius = el.styles.borderBottomRightRadius;
    if (el.styles.outlineWidth && el.styles.outlineWidth !== '0px') {
      mergedStyles.outline = `${el.styles.outlineWidth} ${el.styles.outlineStyle || 'solid'} ${el.styles.outlineColor || '#7c3aed'}`;
      if (el.styles.outlineOffset) mergedStyles.outlineOffset = el.styles.outlineOffset;
    }
    if (el.styles.mixBlendMode && el.styles.mixBlendMode !== 'normal') mergedStyles.mixBlendMode = el.styles.mixBlendMode;

    const baseClasses = `w-full h-full select-none flex items-center justify-center overflow-hidden transition-shadow ${animationClass} ${el.disabled ? 'opacity-50 pointer-events-none' : ''}`;

    switch (el.type) {
      case 'button': {
        let variantClasses = '';
        if (el.variant === 'outline') variantClasses = 'border-2 border-violet-500 text-violet-500 bg-transparent';
        else if (el.variant === 'ghost') variantClasses = 'bg-transparent hover:bg-zinc-800 text-zinc-200';
        else if (el.variant === 'destructive') variantClasses = 'bg-red-600 text-white border-none';
        else if (el.variant === 'secondary') variantClasses = 'bg-zinc-800 text-white border-none';
        else if (el.variant === 'link') variantClasses = 'bg-transparent text-violet-500 underline border-none';
        
        let sizeClasses = '';
        if (el.sizeVariant === 'sm') sizeClasses = 'text-xs px-2 py-1';
        else if (el.sizeVariant === 'lg') sizeClasses = 'text-base px-6 py-3';
        else if (el.sizeVariant === 'icon') sizeClasses = 'p-2 rounded-full aspect-square';

        return (
          <button 
            disabled={el.disabled}
            className={`${baseClasses} ${variantClasses} ${sizeClasses} active:opacity-90 font-medium`} 
            style={mergedStyles}
          >
            {el.content || 'Button'}
          </button>
        );
      }
      case 'card':
        return (
          <div className={`${baseClasses}`} style={mergedStyles}>
            {el.content && <p className="text-xs opacity-60">{el.content}</p>}
          </div>
        );
      case 'input': {
        let inputSize = 'px-3 py-2 text-sm';
        if (el.sizeVariant === 'sm') inputSize = 'px-2 py-1 text-xs';
        else if (el.sizeVariant === 'lg') inputSize = 'px-4 py-3 text-base';

        return (
          <input
            type="text"
            readOnly
            disabled={el.disabled}
            placeholder={el.placeholder || 'Enter text...'}
            className={`${baseClasses} ${inputSize} border border-zinc-800 rounded outline-none pointer-events-none`}
            style={mergedStyles}
          />
        );
      }
      case 'text':
        return (
          <div className={`${baseClasses}`} style={mergedStyles}>
            {el.content || 'Hello World'}
          </div>
        );
      case 'badge': {
        let badgeVariant = 'bg-violet-500/20 text-violet-300 border border-violet-500/30';
        if (el.variant === 'destructive') badgeVariant = 'bg-red-500/20 text-red-400 border border-red-500/30';
        else if (el.variant === 'secondary') badgeVariant = 'bg-zinc-800 text-zinc-300 border border-zinc-700';
        else if (el.variant === 'outline') badgeVariant = 'bg-transparent border-2 border-zinc-700 text-zinc-300';
        
        return (
          <span className={`${baseClasses} ${badgeVariant} px-2 py-0.5 rounded-full text-[10px] font-semibold`} style={mergedStyles}>
            {el.content || 'Badge'}
          </span>
        );
      }
      case 'avatar':
        return (
          <div className={`${baseClasses} rounded-full border border-zinc-800`} style={mergedStyles}>
            {el.src ? (
              <img src={el.src} alt={el.alt || 'Avatar'} className="w-full h-full object-cover pointer-events-none rounded-full" />
            ) : el.content ? (
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
            src={el.src || el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}
            alt={el.alt || "Preview"}
            className={`${baseClasses} object-cover rounded`}
            style={mergedStyles}
          />
        );
      case 'switch':
        return (
          <div className={`${baseClasses} flex items-center gap-2`} style={mergedStyles}>
            <div className={`w-9 h-5 rounded-full p-0.5 transition-all flex items-center ${el.checked ? 'bg-violet-600 justify-end' : 'bg-zinc-800 justify-start'}`}>
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </div>
            <span className="text-xs font-sans">{el.content || 'Switch'}</span>
          </div>
        );
      case 'checkbox':
        return (
          <div className={`${baseClasses} flex items-center gap-2`} style={mergedStyles}>
            <div className={`w-4 h-4 border rounded flex items-center justify-center ${el.checked ? 'border-violet-500 bg-violet-500/20' : 'border-zinc-700 bg-black/30'}`}>
              {el.checked && <div className="w-2 h-2 bg-violet-500 rounded-sm" />}
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

  // ─── RESIZE HANDLE COMPONENT ───────────────────────────
  const ResizeHandles = ({ el }: { el: NexoreMakeElement }) => {
    const handleSize = 6;
    const edgeThickness = 4;

    // Corner handles (little squares)
    const corners: { dir: ResizeDir; style: React.CSSProperties }[] = [
      { dir: 'nw', style: { top: -handleSize/2, left: -handleSize/2, cursor: 'nwse-resize' } },
      { dir: 'ne', style: { top: -handleSize/2, right: -handleSize/2, cursor: 'nesw-resize' } },
      { dir: 'sw', style: { bottom: -handleSize/2, left: -handleSize/2, cursor: 'nesw-resize' } },
      { dir: 'se', style: { bottom: -handleSize/2, right: -handleSize/2, cursor: 'nwse-resize' } },
    ];

    // Edge handles (thin strips)
    const edges: { dir: ResizeDir; className: string; cursor: string }[] = [
      { dir: 'n', className: 'absolute -top-[2px] left-2 right-2 h-[4px]', cursor: 'ns-resize' },
      { dir: 's', className: 'absolute -bottom-[2px] left-2 right-2 h-[4px]', cursor: 'ns-resize' },
      { dir: 'e', className: 'absolute top-2 -right-[2px] w-[4px] bottom-2', cursor: 'ew-resize' },
      { dir: 'w', className: 'absolute top-2 -left-[2px] w-[4px] bottom-2', cursor: 'ew-resize' },
    ];

    return (
      <>
        {/* Edge handles */}
        {edges.map(({ dir, className, cursor }) => (
          <div
            key={dir}
            className={`${className} bg-transparent hover:bg-violet-500/30 transition-colors z-20`}
            style={{ cursor }}
            onPointerDown={(e) => handleResizeStart(e, el, dir)}
          />
        ))}

        {/* Corner handles */}
        {corners.map(({ dir, style }) => (
          <div
            key={dir}
            className="absolute z-30 bg-white border-2 border-violet-500 rounded-sm shadow-md hover:bg-violet-400 transition-colors"
            style={{
              width: handleSize,
              height: handleSize,
              ...style,
            }}
            onPointerDown={(e) => handleResizeStart(e, el, dir)}
          />
        ))}
      </>
    );
  };

  return (
    <div
      ref={wrapperRef}
      className="flex-1 overflow-auto flex items-center justify-center relative p-8 select-none make-canvas-wrapper"
      style={{ backgroundColor: 'var(--make-canvas-bg, #030303)' }}
      onClick={handleCanvasClick}
    >
      {elements.length === 0 && onLoadTemplate && (
        <MakeWelcomeScreen onSelectTemplate={onLoadTemplate} />
      )}
      
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
        className="relative shadow-2xl rounded-xl"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: backgroundColor || 'var(--make-surface, #09090b)',
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          backgroundImage: gridVisible ? 'radial-gradient(circle, var(--make-grid-dot, #27272a) 1px, transparent 1px)' : 'none',
          backgroundSize: '20px 20px',
          border: '1px solid var(--make-border, rgba(39,39,42,0.5))',
          flexShrink: 0,
          margin: 'auto',
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

              {/* 8-Direction Resize Handles */}
              {isSelected && <ResizeHandles el={el} />}
            </div>
          );
        })}
      </div>

      {/* Resize dimension tooltip */}
      {resizeTooltip && (
        <div
          className="fixed z-50 px-2 py-1 rounded bg-violet-600 text-white text-[10px] font-mono font-bold shadow-lg pointer-events-none"
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

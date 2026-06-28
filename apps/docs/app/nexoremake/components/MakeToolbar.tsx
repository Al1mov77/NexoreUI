import React from 'react';
import {
  MousePointerClick,
  Square,
  Type,
  Heading,
  Tag,
  CircleUser,
  Sparkles,
  Minus,
  Image as ImageIcon,
  Box,
  ToggleLeft,
  CheckSquare,
  Percent
} from 'lucide-react';
import { ElementType } from '../types';

interface ToolbarItem {
  type: ElementType;
  label: string;
  icon: React.ComponentType<any>;
  defaultProps: {
    name: string;
    size: { width: number | string; height: number | string };
    styles: Record<string, any>;
    content?: string;
    placeholder?: string;
    iconName?: string;
    animationPreset?: 'none' | 'pulse' | 'bounce' | 'fade-in' | 'slide-in' | 'glow' | 'spin';
  };
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
  {
    type: 'button',
    label: 'Button',
    icon: MousePointerClick,
    defaultProps: {
      name: 'Custom Button',
      size: { width: 140, height: 42 },
      styles: {
        backgroundColor: '#8b5cf6',
        color: '#ffffff',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '16px',
        paddingRight: '16px',
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
        borderWidth: '0px',
        transition: 'all 0.2s',
      },
      content: 'Click me',
    },
  },
  {
    type: 'card',
    label: 'Card',
    icon: Square,
    defaultProps: {
      name: 'Feature Card',
      size: { width: 280, height: 160 },
      styles: {
        backgroundColor: '#18181b',
        borderRadius: '12px',
        borderWidth: '1px',
        borderColor: '#27272a',
        borderStyle: 'solid',
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  {
    type: 'input',
    label: 'Input',
    icon: Type,
    defaultProps: {
      name: 'Text Input',
      size: { width: 220, height: 40 },
      styles: {
        backgroundColor: '#09090b',
        color: '#ffffff',
        borderRadius: '6px',
        borderWidth: '1px',
        borderColor: '#27272a',
        borderStyle: 'solid',
        fontSize: '13px',
        paddingLeft: '12px',
        paddingRight: '12px',
      },
      placeholder: 'Enter text...',
    },
  },
  {
    type: 'text',
    label: 'Text',
    icon: Heading,
    defaultProps: {
      name: 'Typography text',
      size: { width: 200, height: 30 },
      styles: {
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: '600',
      },
      content: 'Hello World',
    },
  },
  {
    type: 'badge',
    label: 'Badge',
    icon: Tag,
    defaultProps: {
      name: 'Status Badge',
      size: { width: 80, height: 24 },
      styles: {
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        color: '#a78bfa',
        borderRadius: '9999px',
        borderWidth: '1px',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderStyle: 'solid',
        fontSize: '11px',
        fontWeight: '600',
      },
      content: 'Pro Feature',
    },
  },
  {
    type: 'avatar',
    label: 'Avatar',
    icon: CircleUser,
    defaultProps: {
      name: 'User Avatar',
      size: { width: 44, height: 44 },
      styles: {
        borderRadius: '50%',
        backgroundColor: '#27272a',
      },
    },
  },
  {
    type: 'icon',
    label: 'Icon',
    icon: Sparkles,
    defaultProps: {
      name: 'Decorative Icon',
      size: { width: 32, height: 32 },
      styles: {
        color: '#a78bfa',
      },
      iconName: 'Sparkles',
    },
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    defaultProps: {
      name: 'Horizontal Line',
      size: { width: '100%', height: 1 },
      styles: {
        backgroundColor: '#27272a',
      },
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    defaultProps: {
      name: 'Picture Showcase',
      size: { width: 180, height: 120 },
      styles: {
        borderRadius: '8px',
        backgroundColor: '#27272a',
      },
      content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    },
  },
  {
    type: 'container',
    label: 'Box',
    icon: Box,
    defaultProps: {
      name: 'Empty Container',
      size: { width: 150, height: 150 },
      styles: {
        borderWidth: '1px',
        borderColor: '#27272a',
        borderStyle: 'dashed',
      },
    },
  },
  {
    type: 'switch',
    label: 'Switch',
    icon: ToggleLeft,
    defaultProps: {
      name: 'Toggle Switch',
      size: { width: 120, height: 30 },
      styles: {
        color: '#ffffff',
      },
      content: 'Toggle theme',
    },
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: CheckSquare,
    defaultProps: {
      name: 'Interactive Checkbox',
      size: { width: 140, height: 30 },
      styles: {
        color: '#ffffff',
      },
      content: 'Accept terms',
    },
  },
  {
    type: 'progress',
    label: 'Progress',
    icon: Percent,
    defaultProps: {
      name: 'Loading Progress',
      size: { width: 200, height: 14 },
      styles: {
        backgroundColor: '#27272a',
        borderRadius: '9999px',
      },
      content: '60%',
    },
  },
];

interface MakeToolbarProps {
  onAddElement: (item: Omit<ToolbarItem['defaultProps'], 'name'> & { type: ElementType; name: string }) => void;
}

export default function MakeToolbar({ onAddElement }: MakeToolbarProps) {
  const handleDragStart = (e: React.DragEvent, item: ToolbarItem) => {
    e.dataTransfer.setData('element-type', item.type);
    e.dataTransfer.setData('item-props', JSON.stringify(item.defaultProps));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-[72px] shrink-0 bg-zinc-950 border-r border-zinc-900 flex flex-col items-center py-4 gap-3 select-none">
      <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1 select-none">
        Add
      </div>
      <div className="flex-1 w-full overflow-y-auto px-2 space-y-2.5 scrollbar-thin toolbar-scroll-container">
        {TOOLBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onClick={() => onAddElement({ type: item.type, ...item.defaultProps })}
              className="group w-full aspect-square bg-zinc-900/50 hover:bg-violet-950/20 border border-zinc-800/80 hover:border-violet-500/40 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-md"
              title={`Drag or Click to add ${item.label}`}
            >
              <Icon className="h-4.5 w-4.5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
              <span className="text-[9px] text-zinc-500 group-hover:text-violet-400/90 mt-1.5 font-medium transition-colors">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export { TOOLBAR_ITEMS };
export type { ToolbarItem };

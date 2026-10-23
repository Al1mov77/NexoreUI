'use client';

import React, { useState, useMemo } from 'react';
import {
  MousePointerClick,
  Square,
  Type,
  Heading,
  Tag,
  CircleUser,
  Minus,
  ImageIcon,
  Box,
  Columns,
  Grid,
  ToggleLeft,
  CheckSquare,
  Percent,
  SlidersHorizontal,
  Star,
  ListOrdered,
  FileUp,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  EyeOff,
  Trash2,
  AlignLeft,
  KeyRound,
  Folders,
  FolderTree,
  Menu,
  Compass,
  AlertCircle,
  MessageSquare,
  HelpCircle,
  Layers,
  BellRing,
  Cookie,
  Loader2,
  Wand2,
  Search,
  Code,
  Bot,
  ArrowUpDown,
  Hash,
  Eye,
  SunMoon,
  CreditCard,
  LayoutTemplate,
  Quote,
  BarChart3,
  Clock,
  Film,
  Info,
  Command,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Zap,
  Shapes,
} from 'lucide-react';
import { ElementType, NexoreMakeElement } from '../types';

export type ComponentCategory =
  | 'All'
  | 'Base UI'
  | 'Forms'
  | 'Navigation'
  | 'Overlays'
  | 'Effects'
  | 'Marketing';

export interface ToolbarItem {
  type: ElementType;
  label: string;
  category: ComponentCategory;
  desc?: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultProps: {
    name: string;
    size: { width: number | string; height: number | string };
    styles: NexoreMakeElement['styles'];
    content?: string;
    secondaryContent?: string;
    label?: string;
    placeholder?: string;
    iconName?: string;
    variant?: NexoreMakeElement['variant'];
    items?: string[];
    ratingValue?: number;
    value?: string | number;
    checked?: boolean;
    author?: string;
    role?: string;
    tags?: string[];
    speed?: 'slow' | 'normal' | 'fast';
    src?: string;
    alt?: string;
    animationPreset?: NexoreMakeElement['animationPreset'];
  };
}

export const ALL_TOOLBAR_COMPONENTS: ToolbarItem[] = [
  // ─── 1. BASE UI & LAYOUT ─────────────────────────────────
  {
    type: 'button',
    label: 'Button',
    category: 'Base UI',
    desc: 'Interactive action button',
    icon: MousePointerClick,
    defaultProps: {
      name: 'Primary Button',
      size: { width: 140, height: 40 },
      styles: {
        backgroundColor: '#fafafa',
        color: '#09090b',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        paddingLeft: '16px',
        paddingRight: '16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
      },
      content: 'Continue',
    },
  },
  {
    type: 'card',
    label: 'Card',
    category: 'Base UI',
    desc: 'Surface container for content blocks',
    icon: Square,
    defaultProps: {
      name: 'Content Card',
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
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.24)',
      },
      content: 'Project Overview',
      secondaryContent: 'Active deployment metrics and build status.',
    },
  },
  {
    type: 'input',
    label: 'Input Field',
    category: 'Base UI',
    desc: 'Single-line text input field',
    icon: Type,
    defaultProps: {
      name: 'Text Input',
      size: { width: 240, height: 40 },
      styles: {
        backgroundColor: '#09090b',
        color: '#fafafa',
        borderRadius: '8px',
        borderWidth: '1px',
        borderColor: '#27272a',
        borderStyle: 'solid',
        fontSize: '13px',
        paddingLeft: '14px',
        paddingRight: '14px',
      },
      placeholder: 'name@company.com',
    },
  },
  {
    type: 'text',
    label: 'Typography Text',
    category: 'Base UI',
    desc: 'Heading or paragraph copy',
    icon: Heading,
    defaultProps: {
      name: 'Headline Text',
      size: { width: 260, height: 36 },
      styles: {
        color: '#fafafa',
        fontSize: '18px',
        fontWeight: '600',
      },
      content: 'Interface Architecture',
    },
  },
  {
    type: 'badge',
    label: 'Status Badge',
    category: 'Base UI',
    desc: 'Compact status descriptor tag',
    icon: Tag,
    defaultProps: {
      name: 'Status Badge',
      size: { width: 92, height: 26 },
      styles: {
        backgroundColor: '#27272a',
        color: '#e4e4e7',
        borderRadius: '9999px',
        borderWidth: '1px',
        borderColor: '#3f3f46',
        borderStyle: 'solid',
        fontSize: '11px',
        fontWeight: '600',
        textAlign: 'center',
      },
      content: 'Stable v2.0',
    },
  },
  {
    type: 'avatar',
    label: 'Avatar',
    category: 'Base UI',
    desc: 'User profile thumbnail with initials',
    icon: CircleUser,
    defaultProps: {
      name: 'User Avatar',
      size: { width: 44, height: 44 },
      styles: {
        borderRadius: '50%',
        backgroundColor: '#27272a',
        color: '#fafafa',
      },
      content: 'ER',
    },
  },
  {
    type: 'icon',
    label: 'Lucide Icon',
    category: 'Base UI',
    desc: 'Scalable vector icon symbol',
    icon: Zap,
    defaultProps: {
      name: 'Icon Symbol',
      size: { width: 32, height: 32 },
      styles: {
        color: '#fafafa',
      },
      iconName: 'Zap',
    },
  },
  {
    type: 'divider',
    label: 'Divider Line',
    category: 'Base UI',
    desc: 'Horizontal structural rule',
    icon: Minus,
    defaultProps: {
      name: 'Horizontal Line',
      size: { width: 260, height: 1 },
      styles: {
        backgroundColor: '#27272a',
      },
    },
  },
  {
    type: 'image',
    label: 'Image Container',
    category: 'Base UI',
    desc: 'Responsive media frame',
    icon: ImageIcon,
    defaultProps: {
      name: 'Showcase Image',
      size: { width: 220, height: 140 },
      styles: {
        borderRadius: '10px',
        backgroundColor: '#18181b',
        borderWidth: '1px',
        borderColor: '#27272a',
      },
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
      alt: 'Abstract monochrome surface',
    },
  },
  {
    type: 'container',
    label: 'Layout Box',
    category: 'Base UI',
    desc: 'Generic container frame',
    icon: Box,
    defaultProps: {
      name: 'Container Box',
      size: { width: 220, height: 160 },
      styles: {
        borderWidth: '1px',
        borderColor: '#27272a',
        borderStyle: 'dashed',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
      content: 'Container',
    },
  },
  {
    type: 'flex',
    label: 'Flex Stack',
    category: 'Base UI',
    desc: 'Horizontal or vertical flex layout row',
    icon: Columns,
    defaultProps: {
      name: 'Flex Stack',
      size: { width: 280, height: 80 },
      styles: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        backgroundColor: '#18181b',
        borderWidth: '1px',
        borderColor: '#27272a',
        borderStyle: 'solid',
        borderRadius: '10px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      content: 'Flex Row Layout',
    },
  },
  {
    type: 'grid',
    label: 'Grid Layout',
    category: 'Base UI',
    desc: 'Multi-column CSS grid frame',
    icon: Grid,
    defaultProps: {
      name: 'Grid Container',
      size: { width: 300, height: 160 },
      styles: {
        display: 'grid',
        gap: '12px',
        backgroundColor: '#18181b',
        borderWidth: '1px',
        borderColor: '#27272a',
        borderStyle: 'solid',
        borderRadius: '10px',
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
      content: '2x2 Grid Matrix',
    },
  },
  {
    type: 'skeleton',
    label: 'Skeleton Loader',
    category: 'Base UI',
    desc: 'Loading placeholder block',
    icon: Layers,
    defaultProps: {
      name: 'Skeleton Placeholder',
      size: { width: 240, height: 28 },
      styles: {
        backgroundColor: '#27272a',
        borderRadius: '6px',
      },
    },
  },
  {
    type: 'scroll-area',
    label: 'Scroll Area',
    category: 'Base UI',
    desc: 'Overflow scroll viewport',
    icon: AlignLeft,
    defaultProps: {
      name: 'Scroll Area Box',
      size: { width: 240, height: 120 },
      styles: {
        backgroundColor: '#09090b',
        borderWidth: '1px',
        borderColor: '#27272a',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#a1a1aa',
        paddingTop: '10px',
        paddingLeft: '12px',
        paddingRight: '12px',
      },
      content: 'Scrollable list content with bounded overflow.',
    },
  },
  {
    type: 'kbd',
    label: 'Keyboard Key',
    category: 'Base UI',
    desc: 'Monospace shortcut keycap',
    icon: Command,
    defaultProps: {
      name: 'Kbd Shortcut',
      size: { width: 72, height: 28 },
      styles: {
        backgroundColor: '#18181b',
        color: '#e4e4e7',
        borderRadius: '6px',
        borderWidth: '1px',
        borderColor: '#3f3f46',
        fontSize: '11px',
        fontWeight: '600',
        textAlign: 'center',
      },
      content: 'Ctrl + K',
    },
  },

  // ─── 2. FORMS & CONTROLS ─────────────────────────────────
  {
    type: 'switch',
    label: 'Switch Toggle',
    category: 'Forms',
    desc: 'Binary toggle switch control',
    icon: ToggleLeft,
    defaultProps: {
      name: 'Toggle Switch',
      size: { width: 160, height: 32 },
      styles: {
        color: '#fafafa',
      },
      content: 'Auto-deploy branch',
      checked: true,
    },
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    category: 'Forms',
    desc: 'Boolean check control with label',
    icon: CheckSquare,
    defaultProps: {
      name: 'Checkbox Field',
      size: { width: 170, height: 30 },
      styles: {
        color: '#fafafa',
      },
      content: 'Require 2FA on login',
      checked: true,
    },
  },
  {
    type: 'progress',
    label: 'Progress Bar',
    category: 'Forms',
    desc: 'Linear completion bar',
    icon: Percent,
    defaultProps: {
      name: 'Progress Bar',
      size: { width: 220, height: 28 },
      styles: {
        backgroundColor: '#27272a',
        borderRadius: '9999px',
      },
      content: 'Storage Quota',
      value: 75,
    },
  },
  {
    type: 'slider',
    label: 'Range Slider',
    category: 'Forms',
    desc: 'Numeric range slider track',
    icon: SlidersHorizontal,
    defaultProps: {
      name: 'Range Slider',
      size: { width: 220, height: 28 },
      styles: {
        color: '#fafafa',
      },
      value: 60,
    },
  },
  {
    type: 'rating',
    label: 'Star Rating',
    category: 'Forms',
    desc: '5-star review score indicator',
    icon: Star,
    defaultProps: {
      name: 'Rating Stars',
      size: { width: 130, height: 26 },
      styles: {
        color: '#f59e0b',
      },
      ratingValue: 5,
    },
  },
  {
    type: 'stepper',
    label: 'Stepper Bar',
    category: 'Forms',
    desc: 'Multi-step workflow indicator',
    icon: ListOrdered,
    defaultProps: {
      name: 'Process Stepper',
      size: { width: 260, height: 38 },
      styles: {
        color: '#fafafa',
      },
      items: ['Configure', 'Verify', 'Deploy'],
    },
  },
  {
    type: 'select',
    label: 'Select Dropdown',
    category: 'Forms',
    desc: 'Dropdown selection trigger',
    icon: ChevronDown,
    defaultProps: {
      name: 'Select Trigger',
      size: { width: 200, height: 40 },
      styles: {
        backgroundColor: '#09090b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '8px',
        color: '#fafafa',
        fontSize: '13px',
      },
      content: 'Select region...',
      items: ['us-east-1', 'eu-central-1', 'ap-northeast-1'],
    },
  },
  {
    type: 'file-upload',
    label: 'File Uploader',
    category: 'Forms',
    desc: 'Drag and drop file dropzone',
    icon: FileUp,
    defaultProps: {
      name: 'Upload Dropzone',
      size: { width: 280, height: 130 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#3f3f46',
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderRadius: '12px',
        color: '#fafafa',
        textAlign: 'center',
      },
      content: 'Drop files to upload',
      secondaryContent: 'SVG, PNG, JPG or PDF (max. 10 MB)',
    },
  },
  {
    type: 'textarea',
    label: 'Textarea Field',
    category: 'Forms',
    desc: 'Multi-line text input area',
    icon: AlignLeft,
    defaultProps: {
      name: 'Multi-line Textarea',
      size: { width: 260, height: 90 },
      styles: {
        backgroundColor: '#09090b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '8px',
        color: '#fafafa',
        fontSize: '13px',
        paddingTop: '10px',
        paddingLeft: '12px',
        paddingRight: '12px',
      },
      placeholder: 'Describe deployment release notes...',
    },
  },
  {
    type: 'tag-input',
    label: 'Tags Input Pill',
    category: 'Forms',
    desc: 'Editable tag chips field',
    icon: Tag,
    defaultProps: {
      name: 'Tag Collection',
      size: { width: 240, height: 38 },
      styles: {
        backgroundColor: '#09090b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '8px',
      },
      items: ['React', 'Next.js', 'TypeScript'],
    },
  },
  {
    type: 'otp-input',
    label: 'OTP Pin Boxes',
    category: 'Forms',
    desc: '4-digit verification code cells',
    icon: KeyRound,
    defaultProps: {
      name: 'OTP Code Input',
      size: { width: 200, height: 44 },
      styles: {},
      content: '4829',
    },
  },

  // ─── 3. NAVIGATION ───────────────────────────────────────
  {
    type: 'tabs',
    label: 'Tabs Header',
    category: 'Navigation',
    desc: 'Segmented view switcher',
    icon: Folders,
    defaultProps: {
      name: 'Tabs Switcher',
      size: { width: 280, height: 40 },
      styles: {
        backgroundColor: '#18181b',
        borderRadius: '8px',
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: '4px',
        paddingRight: '4px',
      },
      items: ['Overview', 'Metrics', 'Settings'],
    },
  },
  {
    type: 'accordion',
    label: 'Accordion Panel',
    category: 'Navigation',
    desc: 'Collapsible disclosure row',
    icon: FolderTree,
    defaultProps: {
      name: 'Accordion Item',
      size: { width: 300, height: 72 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '10px',
        color: '#fafafa',
      },
      content: 'How does team billing work?',
      secondaryContent: 'Seats are prorated monthly based on active contributors.',
    },
  },
  {
    type: 'dock',
    label: 'Floating Dock',
    category: 'Navigation',
    desc: 'Bottom launcher toolbar',
    icon: Menu,
    defaultProps: {
      name: 'Floating Dock',
      size: { width: 240, height: 52 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '9999px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      },
      items: ['Home', 'Search', 'Code', 'Settings'],
    },
  },
  {
    type: 'navigation',
    label: 'Navigation Bar',
    category: 'Navigation',
    desc: 'Top application bar with links',
    icon: Compass,
    defaultProps: {
      name: 'Header Navbar',
      size: { width: 640, height: 52 },
      styles: {
        backgroundColor: '#09090b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '10px',
      },
      content: 'NexoreUI',
      items: ['Components', 'Templates', 'Docs', 'Pricing'],
    },
  },
  {
    type: 'breadcrumb',
    label: 'Breadcrumb Path',
    category: 'Navigation',
    desc: 'Hierarchical location trail',
    icon: Compass,
    defaultProps: {
      name: 'Breadcrumb Trail',
      size: { width: 240, height: 28 },
      styles: {
        fontSize: '12px',
        color: '#a1a1aa',
      },
      items: ['Workspace', 'Projects', 'Production'],
    },
  },

  // ─── 4. FEEDBACK & OVERLAYS ──────────────────────────────
  {
    type: 'alert',
    label: 'Alert Banner',
    category: 'Overlays',
    desc: 'Inline status notice box',
    icon: AlertCircle,
    defaultProps: {
      name: 'Status Alert',
      size: { width: 320, height: 64 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '10px',
        color: '#fafafa',
      },
      content: 'Scheduled maintenance window',
      secondaryContent: 'Read-only mode on Sunday at 02:00 UTC.',
    },
  },
  {
    type: 'modal',
    label: 'Modal Window',
    category: 'Overlays',
    desc: 'Centered confirmation modal',
    icon: MessageSquare,
    defaultProps: {
      name: 'Popup Modal',
      size: { width: 340, height: 190 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '14px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
      },
      content: 'Deploy to Production',
      secondaryContent: 'This action will roll out build #418 to all edge nodes.',
    },
  },
  {
    type: 'dialog',
    label: 'Dialog Prompt',
    category: 'Overlays',
    desc: 'Structured dialog card with actions',
    icon: MessageSquare,
    defaultProps: {
      name: 'Dialog Box',
      size: { width: 340, height: 180 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '12px',
        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.45)',
      },
      content: 'Revoke API Key',
      secondaryContent: 'Applications using this key will immediately lose access.',
    },
  },
  {
    type: 'tooltip',
    label: 'Hover Tooltip',
    category: 'Overlays',
    desc: 'Floating contextual label',
    icon: HelpCircle,
    defaultProps: {
      name: 'Tooltip Bubble',
      size: { width: 150, height: 32 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '6px',
        color: '#fafafa',
        fontSize: '11px',
        textAlign: 'center',
      },
      content: 'Copy CLI command',
    },
  },
  {
    type: 'toast',
    label: 'Toast Notification',
    category: 'Overlays',
    desc: 'Transient action feedback banner',
    icon: BellRing,
    defaultProps: {
      name: 'Toast Card',
      size: { width: 280, height: 52 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      },
      content: 'Copied to clipboard',
      secondaryContent: 'Snippet ready to paste in your project.',
    },
  },
  {
    type: 'cookie',
    label: 'Cookie Banner',
    category: 'Overlays',
    desc: 'Privacy preference notice bar',
    icon: Cookie,
    defaultProps: {
      name: 'Cookie Consent',
      size: { width: 360, height: 96 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '12px',
      },
      content: 'We use essential cookies to store session preferences.',
    },
  },
  {
    type: 'spinner',
    label: 'Loading Spinner',
    category: 'Overlays',
    desc: 'Activity progress indicator',
    icon: Loader2,
    defaultProps: {
      name: 'Loading Spinner',
      size: { width: 36, height: 36 },
      styles: {
        color: '#fafafa',
      },
    },
  },

  // ─── 5. SPECIAL EFFECTS & ANIMATIONS ────────────────────
  {
    type: 'aurora-border-card',
    label: 'Border Frame Card',
    category: 'Effects',
    desc: 'High-contrast bordered surface card',
    icon: Wand2,
    defaultProps: {
      name: 'Border Frame Card',
      size: { width: 300, height: 170 },
      styles: {
        backgroundColor: '#09090b',
        borderColor: '#3f3f46',
        borderWidth: '1px',
        borderRadius: '14px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
      },
      content: 'Edge Compute Node',
      secondaryContent: 'Zero-cold-start execution across 35 global locations.',
    },
  },
  {
    type: 'aurora-border-fx',
    label: 'Accent Border Box',
    category: 'Effects',
    desc: 'Subtle perimeter highlight frame',
    icon: Wand2,
    defaultProps: {
      name: 'Accent Border Box',
      size: { width: 280, height: 140 },
      styles: {
        backgroundColor: '#09090b',
        borderColor: '#52525b',
        borderWidth: '1px',
        borderRadius: '12px',
      },
      content: 'Isolated Runtime',
      secondaryContent: 'Hardware-enforced memory boundary.',
    },
  },
  {
    type: 'aurora-search-pill',
    label: 'Command Search Pill',
    category: 'Effects',
    desc: 'Quick command and search trigger pill',
    icon: Search,
    defaultProps: {
      name: 'Search Pill',
      size: { width: 320, height: 44 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '9999px',
      },
      content: 'Search documentation or run command...',
    },
  },
  {
    type: 'morphing-geometry',
    label: 'Geometric Frame',
    category: 'Effects',
    desc: 'Architectural geometric vector block',
    icon: Shapes,
    defaultProps: {
      name: 'Geometric Shape',
      size: { width: 140, height: 140 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#3f3f46',
        borderWidth: '1px',
        borderRadius: '24px',
      },
    },
  },
  {
    type: 'interactive-code-block',
    label: 'Code Block Card',
    category: 'Effects',
    desc: 'Terminal code snippet with copy button',
    icon: Code,
    defaultProps: {
      name: 'Code Snippet Block',
      size: { width: 340, height: 150 },
      styles: {
        backgroundColor: '#09090b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '10px',
        fontFamily: 'monospace',
      },
      content: 'npx nexoreui add button',
    },
  },
  {
    type: 'ai-prompt-input',
    label: 'Prompt Composer',
    category: 'Effects',
    desc: 'Structured prompt input bar',
    icon: Bot,
    defaultProps: {
      name: 'Prompt Bar',
      size: { width: 360, height: 54 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '12px',
      },
      content: 'Describe the layout or component specification...',
    },
  },
  {
    type: 'marquee',
    label: 'Ticker Strip',
    category: 'Effects',
    desc: 'Horizontal specification strip',
    icon: ArrowUpDown,
    defaultProps: {
      name: 'Ticker Strip',
      size: { width: 420, height: 42 },
      styles: {
        backgroundColor: '#18181b',
        borderRadius: '8px',
        borderColor: '#27272a',
        borderWidth: '1px',
      },
      items: ['Next.js 15', 'Tailwind CSS v4', 'Radix Primitives', 'TypeScript 5'],
    },
  },
  {
    type: 'number-ticker',
    label: 'Metric Readout',
    category: 'Effects',
    desc: 'Tabular numeric KPI display',
    icon: Hash,
    defaultProps: {
      name: 'Metric Readout',
      size: { width: 150, height: 52 },
      styles: {
        color: '#fafafa',
        fontSize: '32px',
        fontWeight: '700',
        textAlign: 'center',
      },
      content: '99.98%',
      value: 99.98,
    },
  },
  {
    type: 'animated-number',
    label: 'Counter Value',
    category: 'Effects',
    desc: 'Monospace tabular counter',
    icon: Hash,
    defaultProps: {
      name: 'Counter Value',
      size: { width: 140, height: 48 },
      styles: {
        color: '#fafafa',
        fontSize: '28px',
        fontWeight: '700',
        textAlign: 'center',
      },
      content: '1,420 ms',
      value: 1420,
    },
  },
  {
    type: 'typing-animation',
    label: 'Terminal Line',
    category: 'Effects',
    desc: 'Monospace command readout with cursor',
    icon: Type,
    defaultProps: {
      name: 'Terminal Line',
      size: { width: 280, height: 34 },
      styles: {
        color: '#e4e4e7',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: 'monospace',
      },
      content: 'pnpm build --filter=docs',
    },
  },
  {
    type: 'blur-fade',
    label: 'Reveal Container',
    category: 'Effects',
    desc: 'Surface card with entrance reveal',
    icon: Eye,
    defaultProps: {
      name: 'Reveal Container',
      size: { width: 240, height: 110 },
      styles: {
        backgroundColor: '#18181b',
        borderRadius: '10px',
        borderWidth: '1px',
        borderColor: '#27272a',
      },
      content: 'Staggered Section Block',
    },
  },
  {
    type: 'image-compare',
    label: 'Image Compare',
    category: 'Effects',
    desc: 'Before/after split comparison frame',
    icon: ArrowUpDown,
    defaultProps: {
      name: 'Image Comparison',
      size: { width: 280, height: 160 },
      styles: {
        borderRadius: '10px',
        backgroundColor: '#18181b',
        borderWidth: '1px',
        borderColor: '#27272a',
      },
      content: 'Light / Dark Diff',
    },
  },
  {
    type: 'dark-mode-toggle',
    label: 'Theme Switcher',
    category: 'Effects',
    desc: 'Light and dark appearance button',
    icon: SunMoon,
    defaultProps: {
      name: 'Theme Toggle Button',
      size: { width: 44, height: 44 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '10px',
        color: '#fafafa',
      },
    },
  },

  // ─── 6. MARKETING & PRO ──────────────────────────────────
  {
    type: 'pricing-table',
    label: 'Pricing Plan Card',
    category: 'Marketing',
    desc: 'Tiered subscription plan with feature list',
    icon: CreditCard,
    defaultProps: {
      name: 'Pro Pricing Card',
      size: { width: 300, height: 340 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#3f3f46',
        borderWidth: '1px',
        borderRadius: '14px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      },
      content: 'Team Plan',
      secondaryContent: '$49 / month',
      items: [
        'Unlimited workspace projects',
        'React, Vue & HTML code export',
        'Custom design token presets',
        'Priority engineering support',
      ],
    },
  },
  {
    type: 'hero-section',
    label: 'Hero Banner',
    category: 'Marketing',
    desc: 'Headline banner with primary actions',
    icon: LayoutTemplate,
    defaultProps: {
      name: 'Hero Section Banner',
      size: { width: 640, height: 250 },
      styles: {
        backgroundColor: '#09090b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '16px',
        textAlign: 'center',
      },
      content: 'Ship Production Interfaces Faster',
      secondaryContent:
        'Accessible React components and templates built with Tailwind CSS and strict TypeScript.',
    },
  },
  {
    type: 'testimonial-card',
    label: 'Testimonial Card',
    category: 'Marketing',
    desc: 'Customer quote with attribution',
    icon: Quote,
    defaultProps: {
      name: 'Customer Testimonial',
      size: { width: 300, height: 150 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '12px',
      },
      content:
        'NexoreUI reduced our frontend review cycles by half while keeping bundle size minimal.',
      author: 'Elena Rostova',
      role: 'Staff Frontend Engineer',
    },
  },
  {
    type: 'bento-grid',
    label: 'Bento Feature Cell',
    category: 'Marketing',
    desc: 'Feature specification card with icon',
    icon: LayoutTemplate,
    defaultProps: {
      name: 'Bento Cell',
      size: { width: 280, height: 165 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '14px',
      },
      content: 'Sub-10ms Telemetry',
      secondaryContent:
        'Real-time metric aggregation with zero layout shift across viewports.',
      iconName: 'Zap',
    },
  },
  {
    type: 'stat-card',
    label: 'Stat Metric Card',
    category: 'Marketing',
    desc: 'KPI readout with period comparison',
    icon: BarChart3,
    defaultProps: {
      name: 'Stat Metric Card',
      size: { width: 220, height: 110 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '12px',
      },
      label: 'Monthly Recurring Revenue',
      content: '$124,500',
      secondaryContent: '+18.4% vs last 30 days',
    },
  },
  {
    type: 'faq-item',
    label: 'FAQ Item Block',
    category: 'Marketing',
    desc: 'Documentation question & answer block',
    icon: HelpCircle,
    defaultProps: {
      name: 'FAQ Card',
      size: { width: 340, height: 84 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '10px',
      },
      content: 'Can we export standalone TSX files?',
      secondaryContent:
        'Yes, every layout exports clean React, Vue, or HTML/CSS without runtime lock-in.',
    },
  },
  {
    type: 'timeline',
    label: 'Timeline Step',
    category: 'Marketing',
    desc: 'Chronological release milestone',
    icon: Clock,
    defaultProps: {
      name: 'Timeline Milestone',
      size: { width: 260, height: 110 },
      styles: {
        color: '#fafafa',
      },
      content: 'Release 2.0 Architecture',
      items: ['Schema validation', 'Responsive device layouts', 'Clean code export'],
    },
  },
  {
    type: 'video-player',
    label: 'Video Box',
    category: 'Marketing',
    desc: 'Media preview frame with playback controls',
    icon: Film,
    defaultProps: {
      name: 'Video Showcase',
      size: { width: 320, height: 180 },
      styles: {
        backgroundColor: '#09090b',
        borderColor: '#27272a',
        borderWidth: '1px',
        borderRadius: '12px',
      },
      content: 'Architecture Walkthrough (02:45)',
    },
  },
  {
    type: 'callout',
    label: 'Callout Note',
    category: 'Marketing',
    desc: 'Technical documentation note block',
    icon: Info,
    defaultProps: {
      name: 'Technical Callout',
      size: { width: 300, height: 68 },
      styles: {
        backgroundColor: '#18181b',
        borderColor: '#3f3f46',
        borderWidth: '1px',
        borderRadius: '10px',
        color: '#e4e4e7',
      },
      content: 'Note: Press Ctrl+Z at any time to undo layout changes.',
    },
  },
];

const CATEGORIES: ComponentCategory[] = [
  'All',
  'Base UI',
  'Forms',
  'Navigation',
  'Overlays',
  'Effects',
  'Marketing',
];

interface MakeToolbarProps {
  onAddElement: (item: Omit<NexoreMakeElement, 'id' | 'zIndex' | 'position'> & { position?: { x: number; y: number } }) => void;
  variant?: 'sidebar' | 'drawer';
  elements?: NexoreMakeElement[];
  selectedId?: string | null;
  selectedIds?: string[];
  onSelectElement?: (id: string, multi?: boolean) => void;
  onToggleLocked?: (id: string) => void;
  onToggleHidden?: (id: string) => void;
  onRenameElement?: (id: string, name: string) => void;
  onReorderZIndex?: (id: string, direction: 'up' | 'down') => void;
  onDeleteElement?: (id: string) => void;
}

export default function MakeToolbar({
  onAddElement,
  variant = 'sidebar',
  elements = [],
  selectedId,
  selectedIds = [],
  onSelectElement,
  onToggleLocked,
  onToggleHidden,
  onRenameElement,
  onReorderZIndex,
  onDeleteElement,
}: MakeToolbarProps) {
  const isDrawer = variant === 'drawer';
  const [isExpandedState, setIsExpanded] = useState(false);
  const isExpanded = isDrawer || isExpandedState;
  const [activeTab, setActiveTab] = useState<'components' | 'layers'>('components');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('All');

  const filteredComponents = useMemo(() => {
    return ALL_TOOLBAR_COMPONENTS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.label.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        (item.desc && item.desc.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleDragStart = (e: React.DragEvent, item: ToolbarItem) => {
    e.dataTransfer.setData('element-type', item.type);
    e.dataTransfer.setData('item-props', JSON.stringify(item.defaultProps));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      className={`flex flex-col transition-all duration-300 select-none z-30 relative ${
        isDrawer
          ? 'w-full border-0'
          : `shrink-0 border-r ${isExpanded ? 'w-[290px]' : 'w-[72px]'}`
      }`}
      style={{
        backgroundColor: isDrawer ? 'transparent' : 'var(--make-glass-bg, rgba(9, 9, 11, 0.75))',
        borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
        backdropFilter: isDrawer ? undefined : 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: isDrawer ? undefined : 'blur(16px) saturate(180%)',
        height: '100%',
      }}
    >
      {!isDrawer && (
        <div
          className="h-12 border-b flex items-center justify-between px-3 shrink-0"
          style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }}
        >
          {isExpanded ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 p-0.5 bg-muted/60 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setActiveTab('components')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    activeTab === 'components'
                      ? 'bg-foreground text-background font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Components
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('layers')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    activeTab === 'layers'
                      ? 'bg-foreground text-background font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Layers {elements.length > 0 && <span className="opacity-80">({elements.length})</span>}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Collapse toolbar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="w-full flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors gap-0.5"
              title={`Expand component library (${ALL_TOOLBAR_COMPONENTS.length} items)`}
            >
              <PanelLeftOpen className="h-4 w-4" />
              <span className="text-[9px] font-semibold font-mono">{ALL_TOOLBAR_COMPONENTS.length}</span>
            </button>
          )}
        </div>
      )}

      {isExpanded && activeTab === 'components' && (
        <div
          className="p-3 border-b space-y-2.5 shrink-0"
          style={{ borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))' }}
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground outline-none focus:border-foreground/40 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-foreground text-background font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'layers' && isExpanded && (
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {elements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs">
              No elements on canvas
            </div>
          ) : (
            [...elements]
              .sort((a, b) => b.zIndex - a.zIndex)
              .map((el) => {
                const isSelected = selectedIds.includes(el.id) || selectedId === el.id;
                return (
                  <div
                    key={el.id}
                    onClick={(e) => onSelectElement?.(el.id, e.shiftKey)}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-foreground/10 border-foreground/30 text-foreground font-medium'
                        : 'bg-card/40 border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        z{el.zIndex}
                      </span>
                      <span className="truncate text-xs">{el.name || el.type}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderZIndex?.(el.id, 'up');
                        }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderZIndex?.(el.id, 'down');
                        }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleHidden?.(el.id);
                        }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        title={el.hidden ? 'Show' : 'Hide'}
                      >
                        {el.hidden ? <EyeOff className="w-3 h-3 text-destructive" /> : <Eye className="w-3 h-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLocked?.(el.id);
                        }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                        title={el.locked ? 'Unlock' : 'Lock'}
                      >
                        {el.locked ? <Lock className="w-3 h-3 text-amber-500" /> : <Unlock className="w-3 h-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteElement?.(el.id);
                        }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {activeTab === 'components' && (

      <div
        className={`flex-1 overflow-y-auto p-2 scrollbar-thin ${
          isExpanded ? 'space-y-1.5' : 'space-y-2'
        }`}
        style={{ overscrollBehavior: 'contain' }}
      >
        {isExpanded ? (
          filteredComponents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
              No components found
            </div>
          ) : (
            filteredComponents.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => onAddElement({ type: item.type, ...item.defaultProps })}
                  className="group px-2.5 py-2 rounded-xl border border-border bg-card/60 hover:bg-accent hover:border-foreground/30 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]"
                  title="Click to add or drag to canvas"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-muted border border-border group-hover:border-foreground/30 flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-foreground truncate">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {item.desc || item.category}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground group-hover:text-foreground shrink-0 font-medium ml-1">
                    + Add
                  </span>
                </div>
              );
            })
          )
        ) : (
          ALL_TOOLBAR_COMPONENTS.slice(0, 16).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => onAddElement({ type: item.type, ...item.defaultProps })}
                className="group w-full aspect-square border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 hover:border-foreground/30"
                style={{
                  backgroundColor: 'var(--make-glass-bg, rgba(9, 9, 11, 0.7))',
                  borderColor: 'var(--make-glass-border, rgba(39, 39, 42, 0.7))',
                }}
                title={`Drag or Click to add ${item.label}`}
              >
                <Icon className="h-4.5 w-4.5 group-hover:text-foreground transition-colors text-muted-foreground" />
                <span className="text-[8px] group-hover:text-foreground mt-1 font-medium transition-colors text-muted-foreground truncate px-1 max-w-full">
                  {item.label.split(' ')[0]}
                </span>
              </div>
            );
          })
        )}
      </div>
      )}

      {!isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="p-2 border-t border-border text-[10px] font-bold text-foreground hover:bg-muted text-center transition-colors shrink-0 font-mono"
        >
          All {ALL_TOOLBAR_COMPONENTS.length}
        </button>
      )}
    </div>
  );
}

export { ALL_TOOLBAR_COMPONENTS as TOOLBAR_ITEMS };

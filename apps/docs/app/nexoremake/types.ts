export type ElementType =
  // Basic & Layout
  | 'button'
  | 'card'
  | 'input'
  | 'text'
  | 'badge'
  | 'avatar'
  | 'icon'
  | 'divider'
  | 'image'
  | 'container'
  | 'flex'
  | 'grid'
  | 'skeleton'
  | 'scroll-area'
  | 'kbd'
  // Forms & Controls
  | 'switch'
  | 'checkbox'
  | 'progress'
  | 'slider'
  | 'rating'
  | 'stepper'
  | 'select'
  | 'file-upload'
  | 'textarea'
  | 'tag-input'
  | 'otp-input'
  // Navigation
  | 'tabs'
  | 'accordion'
  | 'dock'
  | 'navigation'
  | 'breadcrumb'
  // Feedback & Overlays
  | 'alert'
  | 'modal'
  | 'dialog'
  | 'tooltip'
  | 'toast'
  | 'cookie'
  | 'spinner'
  // Special Effects & Animations
  | 'aurora-border-card'
  | 'aurora-border-fx'
  | 'aurora-search-pill'
  | 'morphing-geometry'
  | 'interactive-code-block'
  | 'ai-prompt-input'
  | 'marquee'
  | 'number-ticker'
  | 'animated-number'
  | 'typing-animation'
  | 'blur-fade'
  | 'image-compare'
  | 'dark-mode-toggle'
  // Marketing & Pro Components
  | 'pricing-table'
  | 'hero-section'
  | 'testimonial-card'
  | 'bento-grid'
  | 'stat-card'
  | 'faq-item'
  | 'timeline'
  | 'video-player'
  | 'callout';

export const ALL_ELEMENT_TYPES: readonly ElementType[] = [
  'button',
  'card',
  'input',
  'text',
  'badge',
  'avatar',
  'icon',
  'divider',
  'image',
  'container',
  'flex',
  'grid',
  'skeleton',
  'scroll-area',
  'kbd',
  'switch',
  'checkbox',
  'progress',
  'slider',
  'rating',
  'stepper',
  'select',
  'file-upload',
  'textarea',
  'tag-input',
  'otp-input',
  'tabs',
  'accordion',
  'dock',
  'navigation',
  'breadcrumb',
  'alert',
  'modal',
  'dialog',
  'tooltip',
  'toast',
  'cookie',
  'spinner',
  'aurora-border-card',
  'aurora-border-fx',
  'aurora-search-pill',
  'morphing-geometry',
  'interactive-code-block',
  'ai-prompt-input',
  'marquee',
  'number-ticker',
  'animated-number',
  'typing-animation',
  'blur-fade',
  'image-compare',
  'dark-mode-toggle',
  'pricing-table',
  'hero-section',
  'testimonial-card',
  'bento-grid',
  'stat-card',
  'faq-item',
  'timeline',
  'video-player',
  'callout',
] as const;

export interface NexoreMakeElement {
  id: string;
  type: ElementType;
  name: string;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  zIndex: number;
  styles: {
    backgroundColor?: string;
    backgroundGradient?: string;
    color?: string;
    borderRadius?: string;
    borderRadiusTopLeft?: string;
    borderRadiusTopRight?: string;
    borderRadiusBottomLeft?: string;
    borderRadiusBottomRight?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    boxShadow?: string;
    opacity?: number;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    letterSpacing?: string;
    lineHeight?: string;
    display?: 'block' | 'flex' | 'grid' | 'none';
    flexDirection?: 'row' | 'column';
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    // Transform properties
    rotate?: string;
    scaleX?: string;
    scaleY?: string;
    // Filter properties
    blur?: string;
    brightness?: string;
    contrast?: string;
    saturate?: string;
    // Backdrop filter properties
    backdropBlur?: string;
    backdropSaturate?: string;
    // Cursor & overflow
    cursor?: string;
    overflow?: string;
    transition?: string;
    // Typography advanced
    textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    fontStyle?: 'normal' | 'italic';
    wordSpacing?: string;
    textShadow?: string;
    // Outline
    outlineWidth?: string;
    outlineColor?: string;
    outlineStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
    outlineOffset?: string;
    // Mix blend mode
    mixBlendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'difference' | 'exclusion';
  };
  content?: string;
  label?: string;
  placeholder?: string;
  iconName?: string;
  animationPreset?: 'none' | 'pulse' | 'bounce' | 'fade-in' | 'slide-in' | 'glow' | 'spin';
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'solid' | 'destructive' | 'secondary';
  sizeVariant?: 'default' | 'sm' | 'md' | 'lg' | 'icon';
  speed?: 'slow' | 'normal' | 'fast';
  checked?: boolean;
  disabled?: boolean;
  value?: string | number;
  src?: string;
  alt?: string;
  href?: string;
  items?: string[];
  secondaryContent?: string;
  author?: string;
  role?: string;
  ratingValue?: number;
  tags?: string[];
  hidden?: boolean;
  locked?: boolean;
  deviceLayouts?: Partial<
    Record<
      DeviceType,
      {
        position: { x: number; y: number };
        size: { width: number | string; height: number | string };
      }
    >
  >;
}

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface CanvasSettings {
  width: number;
  height: number;
  backgroundColor: string;
  gridVisible: boolean;
  zoom: number;
  device?: DeviceType;
}

export interface NexoreMakeProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  elements: NexoreMakeElement[];
  canvasSettings: CanvasSettings;
}

export interface FavoriteItem {
  id: string;
  name: string;
  preview?: string;
  projectData: string;
  savedAt: string;
}

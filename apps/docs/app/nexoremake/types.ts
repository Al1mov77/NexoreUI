export type ElementType =
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
  | 'switch'
  | 'checkbox'
  | 'progress';

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
    skewX?: string;
    skewY?: string;
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
  };
  content?: string; // Text content, label, button text
  placeholder?: string; // Input placeholder
  iconName?: string; // Lucide icon name
  animationPreset?: 'none' | 'pulse' | 'bounce' | 'fade-in' | 'slide-in' | 'glow' | 'spin';
}

export interface CanvasSettings {
  width: number;
  height: number;
  backgroundColor: string;
  gridVisible: boolean;
  zoom: number;
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
  preview: string; // SVG or simplified markup preview
  projectData: string; // Stringified/compressed JSON
  savedAt: string;
}

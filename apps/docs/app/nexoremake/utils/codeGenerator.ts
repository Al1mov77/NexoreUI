import { NexoreMakeElement, CanvasSettings } from '../types';
import { normalizeUnit } from '../components/ElementRenderer';
import { isLightColor } from './colorUtils';
import * as LucideIcons from 'lucide-react';

export function styleKeyToKebab(key: string): string {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function stylesToCSS(styles: NexoreMakeElement['styles']): string {
  return Object.entries(styles)
    .filter(([_, val]) => val !== undefined && val !== '')
    .map(([key, val]) => {
      let kebab = styleKeyToKebab(key);
      let value = String(val);
      if (key === 'blur' && val) {
        kebab = 'filter';
        value = `blur(${normalizeUnit(val, 'px')})`;
      }
      return `  ${kebab}: ${value};`;
    })
    .join('\n');
}

export function getElementJSXStyle(el: NexoreMakeElement): Record<string, string | number> {
  const styles: Record<string, string | number> = {};
  const s = el.styles;

  if (s.backgroundColor) styles.backgroundColor = s.backgroundColor;
  if (s.backgroundGradient) styles.backgroundImage = s.backgroundGradient;
  if (s.color) styles.color = s.color;
  if (s.borderRadius) styles.borderRadius = normalizeUnit(s.borderRadius, 'px') || s.borderRadius;
  if (s.borderRadiusTopLeft) {
    styles.borderTopLeftRadius = normalizeUnit(s.borderRadiusTopLeft, 'px') || s.borderRadiusTopLeft;
  }
  if (s.borderRadiusTopRight) {
    styles.borderTopRightRadius = normalizeUnit(s.borderRadiusTopRight, 'px') || s.borderRadiusTopRight;
  }
  if (s.borderRadiusBottomLeft) {
    styles.borderBottomLeftRadius =
      normalizeUnit(s.borderRadiusBottomLeft, 'px') || s.borderRadiusBottomLeft;
  }
  if (s.borderRadiusBottomRight) {
    styles.borderBottomRightRadius =
      normalizeUnit(s.borderRadiusBottomRight, 'px') || s.borderRadiusBottomRight;
  }
  if (s.borderWidth) styles.borderWidth = normalizeUnit(s.borderWidth, 'px') || s.borderWidth;
  if (s.borderColor) styles.borderColor = s.borderColor;
  if (s.borderStyle) styles.borderStyle = s.borderStyle;

  if (s.paddingTop) styles.paddingTop = normalizeUnit(s.paddingTop, 'px') || s.paddingTop;
  if (s.paddingRight) styles.paddingRight = normalizeUnit(s.paddingRight, 'px') || s.paddingRight;
  if (s.paddingBottom) styles.paddingBottom = normalizeUnit(s.paddingBottom, 'px') || s.paddingBottom;
  if (s.paddingLeft) styles.paddingLeft = normalizeUnit(s.paddingLeft, 'px') || s.paddingLeft;

  if (s.marginTop) styles.marginTop = normalizeUnit(s.marginTop, 'px') || s.marginTop;
  if (s.marginRight) styles.marginRight = normalizeUnit(s.marginRight, 'px') || s.marginRight;
  if (s.marginBottom) styles.marginBottom = normalizeUnit(s.marginBottom, 'px') || s.marginBottom;
  if (s.marginLeft) styles.marginLeft = normalizeUnit(s.marginLeft, 'px') || s.marginLeft;

  if (s.boxShadow) styles.boxShadow = s.boxShadow;
  if (s.opacity !== undefined) styles.opacity = s.opacity;

  if (s.fontSize) styles.fontSize = normalizeUnit(s.fontSize, 'px') || s.fontSize;
  if (s.fontWeight) styles.fontWeight = s.fontWeight;
  if (s.fontFamily) styles.fontFamily = s.fontFamily;
  if (s.textAlign) styles.textAlign = s.textAlign;
  if (s.letterSpacing) styles.letterSpacing = normalizeUnit(s.letterSpacing, 'px') || s.letterSpacing;
  if (s.lineHeight) styles.lineHeight = s.lineHeight;

  if (s.display) styles.display = s.display;
  if (s.flexDirection) styles.flexDirection = s.flexDirection;
  if (s.justifyContent) styles.justifyContent = s.justifyContent;
  if (s.alignItems) styles.alignItems = s.alignItems;
  if (s.gap) styles.gap = normalizeUnit(s.gap, 'px') || s.gap;

  const transforms: string[] = [];
  if (s.rotate && s.rotate !== '0deg' && s.rotate !== '0') {
    transforms.push(`rotate(${normalizeUnit(s.rotate, 'deg')})`);
  }
  if (s.scaleX && s.scaleX !== '1') {
    transforms.push(`scaleX(${s.scaleX})`);
  }
  if (s.scaleY && s.scaleY !== '1') {
    transforms.push(`scaleY(${s.scaleY})`);
  }
  if (transforms.length > 0) {
    styles.transform = transforms.join(' ');
  }

  const filters: string[] = [];
  if (s.blur && s.blur !== '0px' && s.blur !== '0') {
    filters.push(`blur(${normalizeUnit(s.blur, 'px')})`);
  }
  if (s.brightness && s.brightness !== '100%' && s.brightness !== '100') {
    filters.push(`brightness(${normalizeUnit(s.brightness, '%')})`);
  }
  if (s.contrast && s.contrast !== '100%' && s.contrast !== '100') {
    filters.push(`contrast(${normalizeUnit(s.contrast, '%')})`);
  }
  if (s.saturate && s.saturate !== '100%' && s.saturate !== '100') {
    filters.push(`saturate(${normalizeUnit(s.saturate, '%')})`);
  }
  if (filters.length > 0) {
    styles.filter = filters.join(' ');
  }

  const backdropFilters: string[] = [];
  if (s.backdropBlur && s.backdropBlur !== '0px' && s.backdropBlur !== '0') {
    backdropFilters.push(`blur(${normalizeUnit(s.backdropBlur, 'px')})`);
  }
  if (s.backdropSaturate && s.backdropSaturate !== '100%' && s.backdropSaturate !== '100') {
    backdropFilters.push(`saturate(${normalizeUnit(s.backdropSaturate, '%')})`);
  }
  if (backdropFilters.length > 0) {
    styles.backdropFilter = backdropFilters.join(' ');
  }

  if (s.cursor) styles.cursor = s.cursor;
  if (s.overflow) styles.overflow = s.overflow;
  if (s.transition) styles.transition = s.transition;

  if (s.textDecoration && s.textDecoration !== 'none') styles.textDecoration = s.textDecoration;
  if (s.textTransform && s.textTransform !== 'none') styles.textTransform = s.textTransform;
  if (s.fontStyle && s.fontStyle !== 'normal') styles.fontStyle = s.fontStyle;
  if (s.wordSpacing) styles.wordSpacing = normalizeUnit(s.wordSpacing, 'px') || s.wordSpacing;
  if (s.textShadow && s.textShadow !== 'none') styles.textShadow = s.textShadow;
  if (s.outlineWidth && s.outlineWidth !== '0px' && s.outlineWidth !== '0') {
    styles.outline = `${normalizeUnit(s.outlineWidth, 'px')} ${s.outlineStyle || 'solid'} ${
      s.outlineColor || '#71717a'
    }`;
    if (s.outlineOffset) {
      styles.outlineOffset = normalizeUnit(s.outlineOffset, 'px') || s.outlineOffset;
    }
  }
  if (s.mixBlendMode && s.mixBlendMode !== 'normal') styles.mixBlendMode = s.mixBlendMode;

  return styles;
}

export function getAnimationCSS(el: NexoreMakeElement): string {
  if (!el.animationPreset || el.animationPreset === 'none') return '';
  switch (el.animationPreset) {
    case 'fade-in':
      return 'animation: fadeIn 0.5s ease-out forwards;';
    case 'slide-in':
      return 'animation: slideIn 0.5s ease-out forwards;';
    case 'spin':
      return 'animation: spinAround 1s linear infinite;';
    default:
      return '';
  }
}

function getHTMLTag(type: string): string {
  switch (type) {
    case 'button':
      return 'button';
    case 'input':
      return 'input';
    case 'divider':
      return 'hr';
    case 'image':
      return 'img';
    default:
      return 'div';
  }
}

const STATIC_ICON_PATHS: Record<string, string> = {
  Zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />',
  Check: '<polyline points="20 6 9 17 4 12" />',
  ArrowRight: '<line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />',
  Terminal: '<polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />',
  Code2: '<path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" />',
  Layers:
    '<polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />',
  Shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />',
  Lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />',
  Globe:
    '<circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />',
  Activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />',
  BarChart3:
    '<path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />',
  Clock: '<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />',
  Search: '<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />',
  Bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />',
  User: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />',
  Settings:
    '<circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />',
  HelpCircle:
    '<circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />',
};

function generateLucideSVG(iconName: string, size: number, className: string): string {
  const inner = STATIC_ICON_PATHS[iconName] || STATIC_ICON_PATHS.HelpCircle;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}">${inner}</svg>`;
}

function renderElementMarkup(
  el: NexoreMakeElement,
  className: string,
  format: 'react' | 'html' | 'vue'
): string {
  const c = format === 'react' ? 'className' : 'class';
  const indent = format === 'react' ? '        ' : '    ';

  switch (el.type) {
    case 'slider': {
      const val = typeof el.value === 'number' ? el.value : 50;
      const styleFill =
        format === 'react' ? ` style={{ width: '${val}%' }}` : ` style="width: ${val}%"`;
      return `${indent}<div ${c}="nexore-slider ${className}">\n${indent}  <div ${c}="nexore-slider-header"><span>${
        el.label || el.content || 'Level'
      }</span><span>${val}%</span></div>\n${indent}  <div ${c}="nexore-slider-track"><div ${c}="nexore-slider-fill"${styleFill}></div></div>\n${indent}</div>`;
    }
    case 'rating': {
      const rating = el.ratingValue ?? 5;
      const stars = [1, 2, 3, 4, 5]
        .map((s) => `<span ${c}="star ${s <= rating ? 'active' : ''}">★</span>`)
        .join('');
      return `${indent}<div ${c}="nexore-rating ${className}">\n${indent}  ${stars}\n${indent}</div>`;
    }
    case 'stepper': {
      const steps =
        el.items && el.items.length > 0 ? el.items : ['Configure', 'Verify', 'Deploy'];
      const stepsHtml = steps
        .map(
          (st, i) =>
            `<div ${c}="nexore-step"><span ${c}="nexore-step-num ${
              i === 0 ? 'active' : ''
            }">${i + 1}</span><span ${c}="nexore-step-text">${st}</span></div>`
        )
        .join('\n' + indent + '  ');
      return `${indent}<div ${c}="nexore-stepper ${className}">\n${indent}  ${stepsHtml}\n${indent}</div>`;
    }
    case 'select':
      return `${indent}<div ${c}="nexore-select ${className}">\n${indent}  <span>${
        el.content || el.placeholder || 'Select option...'
      }</span>\n${indent}  <span ${c}="arrow">▾</span>\n${indent}</div>`;
    case 'file-upload':
      return `${indent}<div ${c}="nexore-file-upload ${className}">\n${indent}  <p ${c}="title">${
        el.content || 'Drop files to upload'
      }</p>\n${indent}  <p ${c}="desc">${
        el.secondaryContent || 'SVG, PNG, JPG or PDF (max. 10 MB)'
      }</p>\n${indent}</div>`;
    case 'textarea':
      return `${indent}<textarea placeholder="${
        el.placeholder || 'Enter text...'
      }" ${c}="nexore-textarea ${className}" readOnly defaultValue="${
        el.content || ''
      }"></textarea>`;
    case 'tag-input': {
      const tags =
        el.items && el.items.length > 0
          ? el.items
          : el.tags && el.tags.length > 0
          ? el.tags
          : ['React', 'Next.js', 'TypeScript'];
      const tagsHtml = tags.map((t) => `<span ${c}="tag">${t}</span>`).join('');
      return `${indent}<div ${c}="nexore-tags ${className}">\n${indent}  ${tagsHtml}\n${indent}</div>`;
    }
    case 'otp-input': {
      const raw = String(el.content || el.value || '4829')
        .replace(/[^0-9A-Za-z]/g, '')
        .padEnd(4, ' ')
        .slice(0, 4);
      const digits = raw
        .split('')
        .map((d, i) => `<div ${c}="otp-box ${i === 3 ? 'active' : ''}">${d}</div>`)
        .join('');
      return `${indent}<div ${c}="nexore-otp ${className}">\n${indent}  ${digits}\n${indent}</div>`;
    }
    case 'tabs': {
      const tabs =
        el.items && el.items.length > 0 ? el.items : ['Overview', 'Metrics', 'Settings'];
      const tabsHtml = tabs
        .map((t, i) => `<div ${c}="tab ${i === 0 ? 'active' : ''}">${t}</div>`)
        .join('\n' + indent + '  ');
      return `${indent}<div ${c}="nexore-tabs ${className}">\n${indent}  ${tabsHtml}\n${indent}</div>`;
    }
    case 'accordion':
      return `${indent}<div ${c}="nexore-accordion ${className}">\n${indent}  <div ${c}="header"><span>${
        el.content || 'How does team billing work?'
      }</span><span>▾</span></div>\n${indent}  <p ${c}="body">${
        el.secondaryContent || 'Seats are prorated monthly based on active contributors.'
      }</p>\n${indent}</div>`;
    case 'dock': {
      const items =
        el.items && el.items.length > 0 ? el.items : ['Home', 'Search', 'Code', 'Settings'];
      const dockHtml = items
        .map((ic) => `<div ${c}="dock-item">${ic.slice(0, 2)}</div>`)
        .join('');
      return `${indent}<div ${c}="nexore-dock ${className}">\n${indent}  ${dockHtml}\n${indent}</div>`;
    }
    case 'navigation': {
      const navLinks =
        el.items && el.items.length > 0 ? el.items : ['Components', 'Templates', 'Docs', 'Pricing'];
      const linksHtml = navLinks.map((lnk) => `<span>${lnk}</span>`).join('');
      return `${indent}<nav ${c}="nexore-nav ${className}">\n${indent}  <div ${c}="brand">${
        el.content || 'NexoreUI'
      }</div>\n${indent}  <div ${c}="links">${linksHtml}</div>\n${indent}  <button ${c}="cta">${
        el.secondaryContent || 'Get Started'
      }</button>\n${indent}</nav>`;
    }
    case 'breadcrumb': {
      const crumbs =
        el.items && el.items.length > 0
          ? el.items
          : (el.content || 'Workspace / Projects / Production').split('/').map((s) => s.trim());
      const crumbsHtml = crumbs
        .map((cr, i) =>
          i === crumbs.length - 1
            ? `<span ${c}="active">${cr}</span>`
            : `<span>${cr}</span> <span>/</span>`
        )
        .join(' ');
      return `${indent}<div ${c}="nexore-breadcrumb ${className}">\n${indent}  ${crumbsHtml}\n${indent}</div>`;
    }
    case 'alert':
      return `${indent}<div ${c}="nexore-alert ${className}">\n${indent}  <div><h5>${
        el.content || 'System Notice'
      }</h5><p>${
        el.secondaryContent || 'Scheduled maintenance window at 02:00 UTC.'
      }</p></div>\n${indent}</div>`;
    case 'modal':
    case 'dialog':
      return `${indent}<div ${c}="nexore-modal ${className}">\n${indent}  <div ${c}="header"><h5>${
        el.content || 'Confirm Action'
      }</h5><span>×</span></div>\n${indent}  <p ${c}="body">${
        el.secondaryContent || 'Are you sure you want to proceed with this change?'
      }</p>\n${indent}  <div ${c}="footer"><button ${c}="btn-confirm">Confirm</button></div>\n${indent}</div>`;
    case 'tooltip':
      return `${indent}<div ${c}="nexore-tooltip ${className}"><span>${
        el.content || 'Copy CLI command'
      }</span></div>`;
    case 'toast':
      return `${indent}<div ${c}="nexore-toast ${className}">\n${indent}  <div><p ${c}="title">${
        el.content || 'Changes saved'
      }</p><p ${c}="desc">${
        el.secondaryContent || 'Configuration updated.'
      }</p></div>\n${indent}</div>`;
    case 'cookie':
      return `${indent}<div ${c}="nexore-cookie ${className}">\n${indent}  <span>${
        el.content || 'We use essential cookies to store session preferences.'
      }</span>\n${indent}  <button>Accept</button>\n${indent}</div>`;
    case 'spinner':
      return `${indent}<div ${c}="nexore-spinner ${className}"></div>`;
    case 'aurora-border-card':
      return `${indent}<div ${c}="nexore-aurora-card ${className}">\n${indent}  <h4>${
        el.content || 'Edge Compute Node'
      }</h4>\n${indent}  <p>${
        el.secondaryContent || 'Zero-cold-start execution across 35 global locations.'
      }</p>\n${indent}</div>`;
    case 'aurora-border-fx':
      return `${indent}<div ${c}="nexore-aurora-fx ${className}"><span>${
        el.content || 'Isolated Runtime'
      }</span></div>`;
    case 'aurora-search-pill':
      return `${indent}<div ${c}="nexore-search-pill ${className}">\n${indent}  <span>${
        el.content || el.placeholder || 'Search documentation...'
      }</span>\n${indent}  <kbd>Ctrl+K</kbd>\n${indent}</div>`;
    case 'morphing-geometry':
      return `${indent}<div ${c}="nexore-morph-geo ${className}"><div ${c}="geo-shape"></div></div>`;
    case 'interactive-code-block': {
      const codeText = el.content
        ? el.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        : 'npx nexoreui add button';
      return `${indent}<div ${c}="nexore-code-block ${className}">\n${indent}  <div ${c}="code-header"><div ${c}="dots"><span></span><span></span><span></span></div><span>${
        el.name || 'terminal'
      }</span></div>\n${indent}  <pre><code>${codeText}</code></pre>\n${indent}</div>`;
    }
    case 'ai-prompt-input':
      return `${indent}<div ${c}="nexore-prompt-input ${className}">\n${indent}  <input placeholder="${
        el.content || el.placeholder || 'Describe the layout specification...'
      }" readOnly />\n${indent}  <button>Run</button>\n${indent}</div>`;
    case 'marquee': {
      const items =
        el.items && el.items.length > 0
          ? el.items
          : ['Next.js 15', 'Tailwind CSS v4', 'Radix Primitives', 'TypeScript 5'];
      return `${indent}<div ${c}="nexore-marquee ${className}">\n${indent}  <div ${c}="marquee-content">${items
        .map((it) => `<span>${it}</span>`)
        .join(' • ')}</div>\n${indent}</div>`;
    }
    case 'number-ticker':
    case 'animated-number':
      return `${indent}<div ${c}="nexore-stat-number ${className}">\n${indent}  <div ${c}="number">${
        el.content || el.value || '99.98%'
      }</div>\n${indent}  <div ${c}="label">${
        el.secondaryContent || 'Service Availability'
      }</div>\n${indent}</div>`;
    case 'typing-animation':
      return `${indent}<div ${c}="nexore-typing ${className}"><span>${
        el.content || 'pnpm build --filter=docs'
      }</span><span ${c}="cursor">|</span></div>`;
    case 'blur-fade':
      return `${indent}<div ${c}="nexore-blur-fade ${className}"><h4>${
        el.content || 'Reveal Section'
      }</h4><p>${el.secondaryContent || 'Smooth entrance transition.'}</p></div>`;
    case 'image-compare':
      return `${indent}<div ${c}="nexore-compare ${className}"><img src="${
        el.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'
      }" alt="${el.alt || 'Compare'}" /><div ${c}="divider"></div></div>`;
    case 'dark-mode-toggle':
      return `${indent}<div ${c}="nexore-dark-toggle ${className}"><span ${c}="active">Dark</span><span>Light</span></div>`;
    case 'pricing-table': {
      const items =
        el.items && el.items.length > 0
          ? el.items
          : ['Unlimited workspace projects', 'React, Vue & HTML export', 'Priority support'];
      const itemsHtml = items
        .map((it) => `<div>• ${it}</div>`)
        .join('\n' + indent + '    ');
      return `${indent}<div ${c}="nexore-pricing-card ${className}">\n${indent}  <div ${c}="badge">${
        el.content || 'Team Plan'
      }</div>\n${indent}  <div ${c}="price">${
        el.secondaryContent || '$49 / mo'
      }</div>\n${indent}  <div ${c}="features">\n${indent}    ${itemsHtml}\n${indent}  </div>\n${indent}  <button ${c}="cta">Continue</button>\n${indent}</div>`;
    }
    case 'hero-section':
      return `${indent}<div ${c}="nexore-hero ${className}">\n${indent}  <h1 ${c}="title">${
        el.content || 'Ship Production Interfaces Faster'
      }</h1>\n${indent}  <p ${c}="subtitle">${
        el.secondaryContent ||
        'Accessible React components and templates built with Tailwind CSS and strict TypeScript.'
      }</p>\n${indent}  <button ${c}="cta">Get Started</button>\n${indent}</div>`;
    case 'testimonial-card':
      return `${indent}<div ${c}="nexore-testimonial ${className}">\n${indent}  <p ${c}="quote">"${
        el.content || 'Reduced our frontend review cycles by half while keeping bundle size minimal.'
      }"</p>\n${indent}  <div ${c}="author">${
        el.author || 'Elena Rostova'
      }<span ${c}="role">${el.role || 'Staff Frontend Engineer'}</span></div>\n${indent}</div>`;
    case 'bento-grid':
      return `${indent}<div ${c}="nexore-bento-card ${className}">\n${indent}  <span ${c}="tag">${
        el.tags?.[0] || 'Architecture'
      }</span>\n${indent}  <h4 ${c}="title">${
        el.content || 'Sub-10ms Telemetry'
      }</h4>\n${indent}  <p ${c}="desc">${
        el.secondaryContent || 'Real-time metric aggregation across viewports.'
      }</p>\n${indent}</div>`;
    case 'stat-card':
      return `${indent}<div ${c}="nexore-stat-card ${className}">\n${indent}  <div ${c}="label">${
        el.label || 'Monthly Revenue'
      }</div>\n${indent}  <div ${c}="metric">${el.content || '$124,500'}</div>\n${
        el.secondaryContent
          ? `${indent}  <div ${c}="delta">${el.secondaryContent}</div>\n`
          : ''
      }${indent}</div>`;
    case 'faq-item':
      return `${indent}<div ${c}="nexore-faq-item ${className}">\n${indent}  <div><div ${c}="q">${
        el.content || 'Can we export standalone TSX files?'
      }</div>${
        el.secondaryContent ? `<div ${c}="a">${el.secondaryContent}</div>` : ''
      }</div><span>+</span>\n${indent}</div>`;
    case 'timeline':
      return `${indent}<div ${c}="nexore-timeline ${className}">\n${indent}  <div ${c}="dot"></div>\n${indent}  <div><p ${c}="title">${
        el.content || 'Release 2.0'
      }</p><p ${c}="date">${el.secondaryContent || 'October 2026'}</p></div>\n${indent}</div>`;
    case 'video-player':
      return `${indent}<div ${c}="nexore-video ${className}"><button ${c}="play">Play</button></div>`;
    case 'callout':
      return `${indent}<div ${c}="nexore-callout ${className}"><p ${c}="title">${
        el.content || 'Technical Note'
      }</p><p ${c}="desc">${el.secondaryContent || ''}</p></div>`;
    case 'container':
    case 'flex':
    case 'grid':
      return `${indent}<div ${c}="nexore-container-box ${className}"><p>${
        el.content || `${el.type} container`
      }</p></div>`;
    case 'skeleton':
      return `${indent}<div ${c}="nexore-skeleton ${className}"></div>`;
    case 'scroll-area':
      return `${indent}<div ${c}="nexore-scroll-area ${className}"><p>${
        el.content || 'Scrollable content area'
      }</p></div>`;
    case 'kbd':
      return `${indent}<kbd ${c}="nexore-kbd ${className}">${el.content || 'Ctrl + K'}</kbd>`;
    default:
      return '';
  }
}

function getExtraComponentsCSS(
  containerClass: string,
  isLightMode = false,
  sorted: NexoreMakeElement[] = []
): string {
  if (!sorted || sorted.length === 0) return '';
  const types = new Set(sorted.map((el) => el.type));
  const cssBlocks: string[] = [];

  const surfaceBg = isLightMode ? '#ffffff' : '#18181b';
  const borderCol = isLightMode ? '#e4e4e7' : '#27272a';
  const mutedBorder = isLightMode ? '#e4e4e7' : '#3f3f46';
  const textCol = isLightMode ? '#09090b' : '#fafafa';
  const textMuted = isLightMode ? '#71717a' : '#a1a1aa';
  const mutedBg = isLightMode ? '#f4f4f5' : '#27272a';
  const ctaBg = isLightMode ? '#18181b' : '#fafafa';
  const ctaText = isLightMode ? '#ffffff' : '#09090b';

  if (types.has('slider')) {
    cssBlocks.push(`
        .${containerClass} .nexore-slider { display: flex; flex-direction: column; justify-content: center; gap: 6px; padding: 8px 12px; }
        .${containerClass} .nexore-slider-header { display: flex; justify-content: space-between; font-size: 11px; opacity: 0.7; }
        .${containerClass} .nexore-slider-track { height: 6px; background: ${mutedBg}; border-radius: 9999px; overflow: hidden; }
        .${containerClass} .nexore-slider-fill { height: 100%; background: ${ctaBg}; border-radius: 9999px; }`);
  }
  if (types.has('rating')) {
    cssBlocks.push(`
        .${containerClass} .nexore-rating { display: flex; gap: 4px; align-items: center; justify-content: center; font-size: 18px; color: ${mutedBorder}; }
        .${containerClass} .nexore-rating .active { color: #f59e0b; }`);
  }
  if (types.has('stepper')) {
    cssBlocks.push(`
        .${containerClass} .nexore-stepper { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; }
        .${containerClass} .nexore-step { display: flex; align-items: center; gap: 6px; font-size: 11px; }
        .${containerClass} .nexore-step-num { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${mutedBg}; color: ${textMuted}; font-weight: 600; }
        .${containerClass} .nexore-step-num.active { background: ${ctaBg}; color: ${ctaText}; }`);
  }
  if (types.has('select')) {
    cssBlocks.push(`
        .${containerClass} .nexore-select { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: ${surfaceBg}; border: 1px solid ${borderCol}; border-radius: 8px; font-size: 12px; color: ${textCol}; }`);
  }
  if (types.has('file-upload')) {
    cssBlocks.push(`
        .${containerClass} .nexore-file-upload { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px dashed ${mutedBorder}; border-radius: 12px; padding: 16px; text-align: center; background: ${surfaceBg}; }
        .${containerClass} .nexore-file-upload .title { font-size: 12px; font-weight: 600; margin: 4px 0 0; color: ${textCol}; }
        .${containerClass} .nexore-file-upload .desc { font-size: 10px; color: ${textMuted}; margin: 2px 0 0; }`);
  }
  if (types.has('textarea')) {
    cssBlocks.push(`
        .${containerClass} .nexore-textarea { width: 100%; height: 100%; padding: 8px; background: ${surfaceBg}; border: 1px solid ${borderCol}; border-radius: 8px; font-size: 12px; color: ${textCol}; resize: none; outline: none; }`);
  }
  if (types.has('tag-input')) {
    cssBlocks.push(`
        .${containerClass} .nexore-tags { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px; }
        .${containerClass} .nexore-tags .tag { padding: 2px 8px; border-radius: 6px; background: ${mutedBg}; color: ${textCol}; font-size: 11px; }`);
  }
  if (types.has('otp-input')) {
    cssBlocks.push(`
        .${containerClass} .nexore-otp { display: flex; gap: 8px; align-items: center; justify-content: center; }
        .${containerClass} .nexore-otp .otp-box { width: 36px; height: 42px; border-radius: 8px; border: 1px solid ${borderCol}; background: ${surfaceBg}; display: flex; align-items: center; justify-content: center; font-weight: 600; color: ${textCol}; }
        .${containerClass} .nexore-otp .otp-box.active { border-color: ${textCol}; }`);
  }
  if (types.has('tabs')) {
    cssBlocks.push(`
        .${containerClass} .nexore-tabs { display: flex; gap: 4px; padding: 4px; background: ${mutedBg}; border-radius: 10px; border: 1px solid ${borderCol}; }
        .${containerClass} .nexore-tabs .tab { flex: 1; text-align: center; padding: 6px 10px; border-radius: 6px; font-size: 11px; color: ${textMuted}; cursor: pointer; }
        .${containerClass} .nexore-tabs .tab.active { background: ${surfaceBg}; color: ${textCol}; }`);
  }
  if (types.has('accordion')) {
    cssBlocks.push(`
        .${containerClass} .nexore-accordion { border: 1px solid ${borderCol}; border-radius: 10px; padding: 12px; background: ${surfaceBg}; }
        .${containerClass} .nexore-accordion .header { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: ${textCol}; }
        .${containerClass} .nexore-accordion .body { font-size: 11px; color: ${textMuted}; margin: 8px 0 0; line-height: 1.4; }`);
  }
  if (types.has('dock')) {
    cssBlocks.push(`
        .${containerClass} .nexore-dock { display: flex; gap: 8px; padding: 8px 12px; background: ${surfaceBg}; border: 1px solid ${borderCol}; border-radius: 16px; justify-content: center; align-items: center; }
        .${containerClass} .nexore-dock .dock-item { width: 32px; height: 32px; border-radius: 8px; background: ${mutedBg}; display: flex; align-items: center; justify-content: center; color: ${textCol}; font-size: 11px; font-family: monospace; }`);
  }
  if (types.has('navigation')) {
    cssBlocks.push(`
        .${containerClass} .nexore-nav { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border: 1px solid ${borderCol}; background: ${surfaceBg}; }
        .${containerClass} .nexore-nav .brand { font-weight: 600; font-size: 13px; color: ${textCol}; }
        .${containerClass} .nexore-nav .links { display: flex; gap: 12px; font-size: 11px; color: ${textMuted}; }
        .${containerClass} .nexore-nav .cta { padding: 4px 10px; background: ${ctaBg}; border-radius: 6px; color: ${ctaText}; font-size: 11px; border: none; font-weight: 600; }`);
  }
  if (types.has('breadcrumb')) {
    cssBlocks.push(`
        .${containerClass} .nexore-breadcrumb { display: flex; gap: 6px; align-items: center; font-size: 11px; color: ${textMuted}; padding: 6px 10px; }
        .${containerClass} .nexore-breadcrumb .active { color: ${textCol}; font-weight: 600; }`);
  }
  if (types.has('alert')) {
    cssBlocks.push(`
        .${containerClass} .nexore-alert { display: flex; gap: 10px; padding: 12px; border: 1px solid ${borderCol}; background: ${surfaceBg}; border-radius: 10px; text-align: left; }
        .${containerClass} .nexore-alert h5 { margin: 0; font-size: 12px; color: ${textCol}; font-weight: 600; }
        .${containerClass} .nexore-alert p { margin: 2px 0 0; font-size: 11px; color: ${textMuted}; }`);
  }
  if (types.has('modal') || types.has('dialog')) {
    cssBlocks.push(`
        .${containerClass} .nexore-modal { padding: 16px; border: 1px solid ${borderCol}; background: ${surfaceBg}; border-radius: 14px; text-align: left; }
        .${containerClass} .nexore-modal .header { display: flex; justify-content: space-between; font-weight: 600; font-size: 12px; color: ${textCol}; }
        .${containerClass} .nexore-modal .body { font-size: 11px; color: ${textMuted}; margin: 8px 0; }
        .${containerClass} .nexore-modal .footer { display: flex; justify-content: flex-end; }
        .${containerClass} .nexore-modal .btn-confirm { padding: 4px 10px; background: ${ctaBg}; color: ${ctaText}; border-radius: 6px; border: none; font-size: 11px; font-weight: 600; }`);
  }
  if (types.has('tooltip')) {
    cssBlocks.push(`
        .${containerClass} .nexore-tooltip { padding: 4px 8px; border-radius: 6px; background: ${surfaceBg}; border: 1px solid ${borderCol}; font-size: 10px; color: ${textCol}; }`);
  }
  if (types.has('toast')) {
    cssBlocks.push(`
        .${containerClass} .nexore-toast { display: flex; gap: 8px; align-items: center; padding: 10px 14px; border: 1px solid ${borderCol}; background: ${surfaceBg}; border-radius: 10px; }
        .${containerClass} .nexore-toast .title { font-size: 11px; font-weight: 600; color: ${textCol}; margin: 0; }
        .${containerClass} .nexore-toast .desc { font-size: 10px; color: ${textMuted}; margin: 0; }`);
  }
  if (types.has('cookie')) {
    cssBlocks.push(`
        .${containerClass} .nexore-cookie { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: ${surfaceBg}; border: 1px solid ${borderCol}; border-radius: 10px; font-size: 11px; color: ${textCol}; }
        .${containerClass} .nexore-cookie button { padding: 4px 8px; background: ${ctaBg}; color: ${ctaText}; border-radius: 6px; border: none; font-size: 10px; font-weight: 600; }`);
  }
  if (types.has('spinner')) {
    cssBlocks.push(`
        .${containerClass} .nexore-spinner { width: 24px; height: 24px; border: 2px solid ${borderCol}; border-top-color: ${ctaBg}; border-radius: 50%; animation: spinAround 1s linear infinite; }`);
  }
  if (types.has('aurora-border-card')) {
    cssBlocks.push(`
        .${containerClass} .nexore-aurora-card { padding: 16px; border: 1px solid ${borderCol}; background: ${surfaceBg}; border-radius: 14px; text-align: left; }
        .${containerClass} .nexore-aurora-card h4 { margin: 0; font-size: 13px; font-weight: 600; color: ${textCol}; }
        .${containerClass} .nexore-aurora-card p { margin: 4px 0 0; font-size: 11px; color: ${textMuted}; }
        .${containerClass} .nexore-aurora-fx { padding: 12px; border: 1px solid ${mutedBorder}; border-radius: 12px; color: ${textCol}; font-weight: 600; font-size: 12px; }`);
  }
  if (types.has('aurora-search-pill')) {
    cssBlocks.push(`
        .${containerClass} .nexore-search-pill { display: flex; align-items: center; justify-content: space-between; padding: 6px 12px; border-radius: 9999px; border: 1px solid ${borderCol}; background: ${surfaceBg}; font-size: 11px; color: ${textMuted}; }
        .${containerClass} .nexore-search-pill kbd { padding: 2px 6px; background: ${mutedBg}; border: 1px solid ${borderCol}; border-radius: 4px; font-family: monospace; font-size: 9px; }`);
  }
  if (types.has('interactive-code-block')) {
    cssBlocks.push(`
        .${containerClass} .nexore-code-block { border: 1px solid ${borderCol}; border-radius: 10px; background: ${surfaceBg}; overflow: hidden; text-align: left; }
        .${containerClass} .nexore-code-block .code-header { height: 26px; background: ${mutedBg}; border-bottom: 1px solid ${borderCol}; padding: 0 10px; display: flex; justify-content: space-between; align-items: center; font-family: monospace; font-size: 10px; color: ${textMuted}; }
        .${containerClass} .nexore-code-block .dots { display: flex; gap: 4px; }
        .${containerClass} .nexore-code-block .dots span { width: 8px; height: 8px; border-radius: 50%; background: ${mutedBorder}; display: inline-block; }
        .${containerClass} .nexore-code-block pre { padding: 12px; margin: 0; font-family: monospace; font-size: 11px; color: ${textCol}; line-height: 1.4; }`);
  }
  if (types.has('ai-prompt-input')) {
    cssBlocks.push(`
        .${containerClass} .nexore-prompt-input { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border: 1px solid ${borderCol}; background: ${surfaceBg}; border-radius: 12px; }
        .${containerClass} .nexore-prompt-input input { flex: 1; background: transparent; border: none; color: ${textCol}; font-size: 12px; outline: none; }
        .${containerClass} .nexore-prompt-input button { padding: 4px 10px; border-radius: 6px; background: ${ctaBg}; border: none; color: ${ctaText}; font-size: 11px; font-weight: 600; }`);
  }
  if (types.has('marquee')) {
    cssBlocks.push(`
        .${containerClass} .nexore-marquee { border-top: 1px solid ${borderCol}; border-bottom: 1px solid ${borderCol}; padding: 8px; overflow: hidden; font-size: 11px; color: ${textMuted}; white-space: nowrap; }`);
  }
  if (types.has('number-ticker') || types.has('animated-number')) {
    cssBlocks.push(`
        .${containerClass} .nexore-stat-number { padding: 12px; text-align: center; border: 1px solid ${borderCol}; border-radius: 12px; background: ${surfaceBg}; }
        .${containerClass} .nexore-stat-number .number { font-size: 24px; font-weight: 700; color: ${textCol}; font-variant-numeric: tabular-nums; }
        .${containerClass} .nexore-stat-number .label { font-size: 10px; color: ${textMuted}; margin-top: 2px; }`);
  }
  if (types.has('typing-animation')) {
    cssBlocks.push(`
        .${containerClass} .nexore-typing { font-family: monospace; font-size: 12px; color: ${textCol}; padding: 8px; }
        .${containerClass} .nexore-typing .cursor { color: ${textCol}; font-weight: 700; }`);
  }
  if (types.has('pricing-table')) {
    cssBlocks.push(`
        .${containerClass} .nexore-pricing-card { padding: 20px; border: 1px solid ${borderCol}; background: ${surfaceBg}; border-radius: 14px; text-align: left; }
        .${containerClass} .nexore-pricing-card .badge { font-size: 11px; font-weight: 600; color: ${textMuted}; text-transform: uppercase; }
        .${containerClass} .nexore-pricing-card .price { font-size: 26px; font-weight: 700; color: ${textCol}; margin: 6px 0; font-variant-numeric: tabular-nums; }
        .${containerClass} .nexore-pricing-card .features { font-size: 11px; color: ${textMuted}; margin: 12px 0; line-height: 1.8; }
        .${containerClass} .nexore-pricing-card .cta { width: 100%; padding: 8px; background: ${ctaBg}; border: none; border-radius: 8px; color: ${ctaText}; font-weight: 600; font-size: 12px; }`);
  }
  if (types.has('hero-section')) {
    cssBlocks.push(`
        .${containerClass} .nexore-hero { padding: 24px; border: 1px solid ${borderCol}; background: ${surfaceBg}; border-radius: 16px; text-align: center; }
        .${containerClass} .nexore-hero .title { font-size: 20px; font-weight: 700; color: ${textCol}; margin: 0; }
        .${containerClass} .nexore-hero .subtitle { font-size: 12px; color: ${textMuted}; margin: 8px 0 16px; }
        .${containerClass} .nexore-hero .cta { padding: 8px 16px; background: ${ctaBg}; border: none; border-radius: 8px; color: ${ctaText}; font-weight: 600; font-size: 12px; }`);
  }
  if (types.has('testimonial-card')) {
    cssBlocks.push(`
        .${containerClass} .nexore-testimonial { padding: 16px; border: 1px solid ${borderCol}; background: ${surfaceBg}; border-radius: 12px; text-align: left; }
        .${containerClass} .nexore-testimonial .quote { font-size: 12px; color: ${textCol}; margin: 0 0 8px; }
        .${containerClass} .nexore-testimonial .author { font-size: 11px; font-weight: 600; color: ${textCol}; }
        .${containerClass} .nexore-testimonial .role { display: block; font-size: 10px; color: ${textMuted}; font-weight: 400; }`);
  }
  if (types.has('bento-grid')) {
    cssBlocks.push(`
        .${containerClass} .nexore-bento-card { padding: 16px; border: 1px solid ${borderCol}; background: ${surfaceBg}; border-radius: 14px; text-align: left; }
        .${containerClass} .nexore-bento-card .tag { font-size: 9px; font-weight: 600; background: ${mutedBg}; color: ${textCol}; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
        .${containerClass} .nexore-bento-card .title { font-size: 13px; font-weight: 600; color: ${textCol}; margin: 8px 0 4px; }
        .${containerClass} .nexore-bento-card .desc { font-size: 11px; color: ${textMuted}; margin: 0; }`);
  }
  if (types.has('stat-card')) {
    cssBlocks.push(`
        .${containerClass} .nexore-stat-card { padding: 14px; border: 1px solid ${borderCol}; background: ${surfaceBg}; border-radius: 12px; text-align: left; }
        .${containerClass} .nexore-stat-card .label { font-size: 11px; color: ${textMuted}; }
        .${containerClass} .nexore-stat-card .metric { font-size: 22px; font-weight: 700; color: ${textCol}; margin-top: 4px; font-variant-numeric: tabular-nums; }
        .${containerClass} .nexore-stat-card .delta { font-size: 10px; color: ${textMuted}; margin-top: 2px; font-family: monospace; }`);
  }
  if (types.has('faq-item')) {
    cssBlocks.push(`
        .${containerClass} .nexore-faq-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid ${borderCol}; background: ${surfaceBg}; border-radius: 10px; font-size: 12px; color: ${textCol}; }
        .${containerClass} .nexore-faq-item .q { font-weight: 600; }
        .${containerClass} .nexore-faq-item .a { font-size: 11px; color: ${textMuted}; margin-top: 4px; }`);
  }
  if (types.has('timeline')) {
    cssBlocks.push(`
        .${containerClass} .nexore-timeline { display: flex; gap: 10px; align-items: center; padding: 8px; text-align: left; }
        .${containerClass} .nexore-timeline .dot { width: 10px; height: 10px; border-radius: 50%; background: ${ctaBg}; }
        .${containerClass} .nexore-timeline .title { font-size: 12px; font-weight: 600; color: ${textCol}; margin: 0; }
        .${containerClass} .nexore-timeline .date { font-size: 10px; color: ${textMuted}; margin: 0; }`);
  }
  if (types.has('video-player')) {
    cssBlocks.push(`
        .${containerClass} .nexore-video { width: 100%; height: 100%; border-radius: 12px; background: ${surfaceBg}; display: flex; align-items: center; justify-content: center; border: 1px solid ${borderCol}; }
        .${containerClass} .nexore-video .play { padding: 6px 14px; border-radius: 9999px; background: ${ctaBg}; border: none; color: ${ctaText}; font-size: 11px; font-weight: 600; }`);
  }
  if (types.has('callout')) {
    cssBlocks.push(`
        .${containerClass} .nexore-callout { padding: 12px; border-left: 3px solid ${ctaBg}; background: ${surfaceBg}; border-radius: 8px; text-align: left; }
        .${containerClass} .nexore-callout .title { font-size: 12px; font-weight: 600; color: ${textCol}; margin: 0; }
        .${containerClass} .nexore-callout .desc { font-size: 11px; color: ${textMuted}; margin: 4px 0 0; }`);
  }
  if (types.has('skeleton')) {
    cssBlocks.push(`
        .${containerClass} .nexore-skeleton { width: 100%; height: 100%; border-radius: 8px; background: ${mutedBg}; }`);
  }
  if (types.has('scroll-area')) {
    cssBlocks.push(`
        .${containerClass} .nexore-scroll-area { width: 100%; height: 100%; overflow-y: auto; padding: 10px; border: 1px solid ${borderCol}; border-radius: 8px; background: ${surfaceBg}; }`);
  }
  if (types.has('kbd')) {
    cssBlocks.push(`
        .${containerClass} .nexore-kbd { padding: 2px 6px; border: 1px solid ${borderCol}; background: ${mutedBg}; border-radius: 4px; font-family: monospace; font-size: 11px; color: ${textCol}; display: inline-flex; align-items: center; justify-content: center; }`);
  }

  return cssBlocks.join('\n');
}

export function generateReactCode(
  elements: NexoreMakeElement[],
  settings: CanvasSettings,
  isLight?: boolean
): string {
  const isLightMode =
    isLight !== undefined
      ? isLight
      : settings.backgroundColor && isLightColor(settings.backgroundColor)
      ? true
      : typeof document !== 'undefined'
      ? !document.documentElement.classList.contains('dark')
      : false;

  const sorted = [...elements].filter((el) => !el.hidden).sort((a, b) => a.zIndex - b.zIndex);
  const hasProgress = sorted.some((el) => el.type === 'progress');
  const hasSwitch = sorted.some((el) => el.type === 'switch');
  const hasAvatar = sorted.some((el) => el.type === 'avatar');
  const hasAvatarText = sorted.some((el) => el.type === 'avatar' && el.content);
  const hasInput = sorted.some((el) => el.type === 'input');
  const hasCheckbox = sorted.some((el) => el.type === 'checkbox');
  const hasDivider = sorted.some((el) => el.type === 'divider');
  const hasImage = sorted.some((el) => el.type === 'image');
  const hasButton = sorted.some((el) => el.type === 'button');
  const hasBadge = sorted.some((el) => el.type === 'badge');
  const hasCard = sorted.some((el) => el.type === 'card');
  const iconElements = sorted.filter((el) => el.type === 'icon');
  const validIcons = Array.from(
    new Set(
      iconElements.map((el) =>
        el.iconName && el.iconName in LucideIcons ? el.iconName : 'HelpCircle'
      )
    )
  );

  const containerClass = 'nexore-canvas-root';

  let stateHooks = '';
  let cssClasses = '';

  const elementsHTML = sorted
    .map((el, idx) => {
      const tag = getHTMLTag(el.type);
      const className = `el-${el.type}-${idx}`;
      const styles = getElementJSXStyle(el);
      const fullStyles = {
        position: 'absolute',
        left: typeof el.position.x === 'number' ? `${el.position.x}px` : el.position.x,
        top: typeof el.position.y === 'number' ? `${el.position.y}px` : el.position.y,
        width: typeof el.size.width === 'number' ? `${el.size.width}px` : el.size.width,
        height: typeof el.size.height === 'number' ? `${el.size.height}px` : el.size.height,
        'z-index': el.zIndex,
        ...Object.fromEntries(Object.entries(styles).map(([k, v]) => [styleKeyToKebab(k), v])),
      };

      const styleStr = Object.entries(fullStyles)
        .map(([k, v]) => `          ${k}: ${v};`)
        .join('\n');

      let cssVars = '';
      if (el.type === 'switch' && el.styles.backgroundColor)
        cssVars += `\n          --switch-color: ${el.styles.backgroundColor};`;
      if (el.type === 'progress' && el.styles.backgroundColor)
        cssVars += `\n          --progress-color: ${el.styles.backgroundColor};`;
      if (el.type === 'checkbox' && el.styles.backgroundColor)
        cssVars += `\n          --checkbox-color: ${el.styles.backgroundColor};`;

      const animationCSS = getAnimationCSS(el);
      cssClasses += `        .${containerClass} .${className} {\n${styleStr}${cssVars}\n${
        animationCSS ? '          ' + animationCSS.replace(/;/g, ';\n') : ''
      }        }\n`;

      if (el.type === 'switch')
        stateHooks += `  const [switch${idx}, setSwitch${idx}] = React.useState(${
          el.checked !== false
        });\n`;
      if (el.type === 'checkbox')
        stateHooks += `  const [check${idx}, setCheck${idx}] = React.useState(${
          el.checked !== false
        });\n`;

      if (el.type === 'icon') {
        const validName =
          el.iconName && el.iconName in LucideIcons ? el.iconName : 'HelpCircle';
        const sizeStr = el.styles?.fontSize
          ? String(el.styles.fontSize).replace(/[^0-9.]/g, '')
          : '24';
        const size = parseInt(sizeStr, 10) || 24;
        return `        <${validName} className="nexore-icon ${className}" size={${size}} color="currentColor" />`;
      }
      if (el.type === 'input') {
        const sClass =
          el.sizeVariant && el.sizeVariant !== 'default'
            ? ` nexore-input-size-${el.sizeVariant}`
            : ' nexore-input-size-default';
        return `        <input type="text" placeholder="${
          el.placeholder || ''
        }" defaultValue="${el.content || ''}" className="nexore-input ${className}${sClass}"${
          el.disabled ? ' disabled' : ''
        } />`;
      }
      if (el.type === 'divider') return `        <hr className="nexore-divider ${className}" />`;
      if (el.type === 'image')
        return `        <img src="${
          el.src || el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'
        }" alt="${el.alt || 'Preview'}" className="nexore-image ${className}" />`;
      if (el.type === 'progress') {
        const pVal = Math.min(100, Math.max(0, parseInt(String(el.value ?? 60), 10) || 0));
        return `        <div className="nexore-progress-wrapper ${className}">\n${
          el.label || el.content
            ? `          <span className="nexore-progress-label">${el.label || el.content}</span>\n`
            : ''
        }          <div className="nexore-progress-bar">\n            <div className="nexore-progress-fill" style={{ width: '${pVal}%' }}></div>\n          </div>\n        </div>`;
      }
      if (el.type === 'switch') {
        return `        <div className="nexore-switch ${className}${
          el.disabled ? ' disabled' : ''
        }" ${!el.disabled ? `onClick={() => setSwitch${idx}(!switch${idx})}` : ''}>\n          <div className={\`nexore-switch-track \${switch${idx} ? '' : 'off'}\`}>\n            <div className={\`nexore-switch-thumb \${switch${idx} ? '' : 'off'}\`}></div>\n          </div>\n          <span className="nexore-switch-label">${
          el.content || el.label || 'Switch'
        }</span>\n        </div>`;
      }
      if (el.type === 'checkbox') {
        return `        <label className="nexore-checkbox ${className}${
          el.disabled ? ' disabled' : ''
        }">\n          <input type="checkbox" checked={check${idx}} ${
          !el.disabled ? `onChange={(e) => setCheck${idx}(e.target.checked)}` : ''
        } className="nexore-checkbox-input" ${
          el.disabled ? 'disabled' : ''
        } />\n          <span className="nexore-checkbox-label">${
          el.content || el.label || 'Checkbox'
        }</span>\n        </label>`;
      }
      if (el.type === 'avatar') {
        return `        <div className="nexore-avatar ${className}">\n          ${
          el.src
            ? `<img src="${el.src}" className="nexore-avatar-img" alt="${el.alt || 'Avatar'}" />`
            : `<span className="nexore-avatar-text">${el.content || 'NX'}</span>`
        }\n        </div>`;
      }

      if (el.type === 'button') {
        const vClass =
          el.variant && el.variant !== 'default' ? ` nexore-button-${el.variant}` : '';
        const sClass =
          el.sizeVariant && el.sizeVariant !== 'default'
            ? ` nexore-button-size-${el.sizeVariant}`
            : '';
        return `        <button className="nexore-button ${className}${vClass}${sClass}"${
          el.disabled ? ' disabled' : ''
        }>\n          ${el.content || 'Button'}\n        </button>`;
      }
      if (el.type === 'badge') {
        const vClass = el.variant && el.variant !== 'default' ? ` nexore-badge-${el.variant}` : '';
        return `        <div className="nexore-badge ${className}${vClass}">\n          ${
          el.content || 'Badge'
        }\n        </div>`;
      }
      if (el.type === 'card') {
        return `        <div className="nexore-card ${className}">\n          ${
          el.content ? `<h4 className="nexore-card-title">${el.content}</h4>` : ''
        }\n          ${
          el.secondaryContent ? `<p className="nexore-card-text">${el.secondaryContent}</p>` : ''
        }\n        </div>`;
      }

      const specialMarkup = renderElementMarkup(el, className, 'react');
      if (specialMarkup) return specialMarkup;

      const content = el.content || (el.type === 'text' ? 'Text' : '');
      return `        <${tag} className="${className}">\n          ${content}\n        </${tag}>`;
    })
    .join('\n');

  const uniqueAnimations = new Set(sorted.map((el) => el.animationPreset).filter(Boolean));
  let keyframes = '';
  if (uniqueAnimations.has('fade-in'))
    keyframes += `\n        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`;
  if (uniqueAnimations.has('slide-in'))
    keyframes += `\n        @keyframes slideIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
  if (uniqueAnimations.has('spin'))
    keyframes += `\n        @keyframes spinAround { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;

  const globalCSS = `
        .${containerClass} {
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          border-radius: 12px;
          border: 1px solid ${isLightMode ? '#e4e4e7' : '#27272a'};
          width: ${settings.width}px;
          height: ${settings.height}px;
          background-color: ${settings.backgroundColor || (isLightMode ? '#ffffff' : 'transparent')};
        }
        .${containerClass} * { box-sizing: border-box; }${
    hasInput
      ? isLightMode
        ? `\n        .${containerClass} .nexore-input { outline: none; border: 1px solid #e4e4e7; background: #ffffff; color: #09090b; transition: border-color 0.2s; }\n        .${containerClass} .nexore-input:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }\n        .${containerClass} .nexore-input-size-default { padding: 0.5rem 0.75rem; font-size: 0.875rem; }\n        .${containerClass} .nexore-input:focus { border-color: #09090b; }`
        : `\n        .${containerClass} .nexore-input { outline: none; border: 1px solid #3f3f46; background: #18181b; color: #fafafa; transition: border-color 0.2s; }\n        .${containerClass} .nexore-input:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }\n        .${containerClass} .nexore-input-size-default { padding: 0.5rem 0.75rem; font-size: 0.875rem; }\n        .${containerClass} .nexore-input:focus { border-color: #fafafa; }`
      : ''
  }${
    hasDivider
      ? `\n        .${containerClass} .nexore-divider { border: none; border-bottom: 1px solid ${isLightMode ? '#e4e4e7' : '#27272a'}; margin: 0; }`
      : ''
  }${hasImage ? `\n        .${containerClass} .nexore-image { object-fit: cover; }` : ''}${
    hasButton
      ? isLightMode
        ? `\n        .${containerClass} .nexore-button { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; font-weight: 500; transition: all 0.2s; cursor: pointer; outline: none; border: none; background: transparent; }\n        .${containerClass} .nexore-button:disabled { opacity: 0.5; pointer-events: none; cursor: not-allowed; }\n        .${containerClass} .nexore-button-destructive { background-color: #dc2626; color: #ffffff; }\n        .${containerClass} .nexore-button-outline { border: 1px solid #e4e4e7; color: #09090b; }\n        .${containerClass} .nexore-button-secondary { background-color: #f4f4f5; color: #09090b; }\n        .${containerClass} .nexore-button-ghost { color: #09090b; }`
        : `\n        .${containerClass} .nexore-button { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; font-weight: 500; transition: all 0.2s; cursor: pointer; outline: none; border: none; background: transparent; }\n        .${containerClass} .nexore-button:disabled { opacity: 0.5; pointer-events: none; cursor: not-allowed; }\n        .${containerClass} .nexore-button-destructive { background-color: #dc2626; color: #fafafa; }\n        .${containerClass} .nexore-button-outline { border: 1px solid #3f3f46; color: #fafafa; }\n        .${containerClass} .nexore-button-secondary { background-color: #27272a; color: #fafafa; }\n        .${containerClass} .nexore-button-ghost { color: #e4e4e7; }`
      : ''
  }${
    hasBadge
      ? isLightMode
        ? `\n        .${containerClass} .nexore-badge { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; font-weight: 600; font-size: 0.75rem; padding: 0.125rem 0.625rem; border: 1px solid #e4e4e7; background-color: #f4f4f5; color: #09090b; }`
        : `\n        .${containerClass} .nexore-badge { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; font-weight: 600; font-size: 0.75rem; padding: 0.125rem 0.625rem; border: 1px solid #3f3f46; background-color: #27272a; color: #fafafa; }`
      : ''
  }${
    hasCard
      ? isLightMode
        ? `\n        .${containerClass} .nexore-card { background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 0.5rem; display: flex; flex-direction: column; justify-content: center; padding: 16px; }\n        .${containerClass} .nexore-card-title { font-size: 0.875rem; font-weight: 600; margin: 0 0 4px; color: #09090b; }\n        .${containerClass} .nexore-card-text { font-size: 0.75rem; color: #71717a; margin: 0; }`
        : `\n        .${containerClass} .nexore-card { background-color: #18181b; border-radius: 0.5rem; display: flex; flex-direction: column; justify-content: center; padding: 16px; }\n        .${containerClass} .nexore-card-title { font-size: 0.875rem; font-weight: 600; margin: 0 0 4px; color: #fafafa; }\n        .${containerClass} .nexore-card-text { font-size: 0.75rem; color: #a1a1aa; margin: 0; }`
      : ''
  }${
    hasProgress
      ? isLightMode
        ? `\n        .${containerClass} .nexore-progress-bar { background: #f4f4f5; border-radius: 9999px; height: 8px; overflow: hidden; }\n        .${containerClass} .nexore-progress-fill { height: 100%; background: var(--progress-color, #18181b); border-radius: 9999px; transition: width 0.2s; }`
        : `\n        .${containerClass} .nexore-progress-bar { background: #27272a; border-radius: 9999px; height: 8px; overflow: hidden; }\n        .${containerClass} .nexore-progress-fill { height: 100%; background: var(--progress-color, #fafafa); border-radius: 9999px; transition: width 0.2s; }`
      : ''
  }${
    hasSwitch
      ? isLightMode
        ? `\n        .${containerClass} .nexore-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n        .${containerClass} .nexore-switch.disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }\n        .${containerClass} .nexore-switch-track { width: 36px; height: 20px; background: var(--switch-color, #18181b); border-radius: 9999px; position: relative; transition: background 0.2s; }\n        .${containerClass} .nexore-switch-track.off { background: #e4e4e7; }\n        .${containerClass} .nexore-switch-thumb { width: 16px; height: 16px; background: #ffffff; border-radius: 50%; position: absolute; left: 18px; top: 2px; transition: left 0.2s; }\n        .${containerClass} .nexore-switch-thumb.off { left: 2px; background: #ffffff; }\n        .${containerClass} .nexore-switch-label { font-size: 12px; color: inherit; user-select: none; }`
        : `\n        .${containerClass} .nexore-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n        .${containerClass} .nexore-switch.disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }\n        .${containerClass} .nexore-switch-track { width: 36px; height: 20px; background: var(--switch-color, #fafafa); border-radius: 9999px; position: relative; transition: background 0.2s; }\n        .${containerClass} .nexore-switch-track.off { background: #3f3f46; }\n        .${containerClass} .nexore-switch-thumb { width: 16px; height: 16px; background: #09090b; border-radius: 50%; position: absolute; left: 18px; top: 2px; transition: left 0.2s; }\n        .${containerClass} .nexore-switch-thumb.off { left: 2px; background: #fafafa; }\n        .${containerClass} .nexore-switch-label { font-size: 12px; color: inherit; user-select: none; }`
      : ''
  }${
    hasCheckbox
      ? isLightMode
        ? `\n        .${containerClass} .nexore-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n        .${containerClass} .nexore-checkbox.disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }\n        .${containerClass} .nexore-checkbox-input { accent-color: var(--checkbox-color, #18181b); width: 16px; height: 16px; }\n        .${containerClass} .nexore-checkbox-label { font-size: 12px; color: inherit; user-select: none; }`
        : `\n        .${containerClass} .nexore-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n        .${containerClass} .nexore-checkbox.disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }\n        .${containerClass} .nexore-checkbox-input { accent-color: var(--checkbox-color, #fafafa); width: 16px; height: 16px; }\n        .${containerClass} .nexore-checkbox-label { font-size: 12px; color: inherit; user-select: none; }`
      : ''
  }${
    hasAvatar
      ? isLightMode
        ? `\n        .${containerClass} .nexore-avatar { border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f4f4f5; }\n        .${containerClass} .nexore-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }`
        : `\n        .${containerClass} .nexore-avatar { border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #27272a; }\n        .${containerClass} .nexore-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }`
      : ''
  }${
    hasAvatarText
      ? isLightMode
        ? `\n        .${containerClass} .nexore-avatar-text { color: #09090b; font-weight: 600; font-size: 12px; }`
        : `\n        .${containerClass} .nexore-avatar-text { color: #fafafa; font-weight: 600; font-size: 12px; }`
      : ''
  }${getExtraComponentsCSS(containerClass, isLightMode, sorted)}
${cssClasses}${keyframes}`;

  const bodyMarkup = elementsHTML.trim()
    ? `      <div className="${containerClass}">\n${elementsHTML}\n      </div>`
    : `      <div className="${containerClass}" />`;

  return `import React from 'react';
${validIcons.length > 0 ? `import { ${validIcons.join(', ')} } from 'lucide-react';\n` : ''}
export default function CustomComponent() {
${stateHooks}  return (
    <>
      <style>{\`${globalCSS}
      \`}</style>
${bodyMarkup}
    </>
  );
}`;
}

export function generateHTMLCode(
  elements: NexoreMakeElement[],
  settings: CanvasSettings,
  isLight?: boolean
): string {
  const isLightMode =
    isLight !== undefined
      ? isLight
      : settings.backgroundColor && isLightColor(settings.backgroundColor)
      ? true
      : typeof document !== 'undefined'
      ? !document.documentElement.classList.contains('dark')
      : false;

  const sorted = [...elements].filter((el) => !el.hidden).sort((a, b) => a.zIndex - b.zIndex);
  const hasProgress = sorted.some((el) => el.type === 'progress');
  const hasSwitch = sorted.some((el) => el.type === 'switch');
  const hasAvatar = sorted.some((el) => el.type === 'avatar');
  const hasAvatarText = sorted.some((el) => el.type === 'avatar' && el.content);
  const hasInput = sorted.some((el) => el.type === 'input');
  const hasCheckbox = sorted.some((el) => el.type === 'checkbox');
  const hasDivider = sorted.some((el) => el.type === 'divider');
  const hasImage = sorted.some((el) => el.type === 'image');
  const hasButton = sorted.some((el) => el.type === 'button');
  const hasBadge = sorted.some((el) => el.type === 'badge');
  const hasCard = sorted.some((el) => el.type === 'card');

  const containerClass = 'nexore-canvas-root';

  let cssClasses = '';
  const elementsHTML = sorted
    .map((el, idx) => {
      const tag = getHTMLTag(el.type);
      const className = `el-${el.type}-${idx}`;
      const styles = getElementJSXStyle(el);
      const fullStyles = {
        position: 'absolute',
        left: typeof el.position.x === 'number' ? `${el.position.x}px` : el.position.x,
        top: typeof el.position.y === 'number' ? `${el.position.y}px` : el.position.y,
        width: typeof el.size.width === 'number' ? `${el.size.width}px` : el.size.width,
        height: typeof el.size.height === 'number' ? `${el.size.height}px` : el.size.height,
        'z-index': el.zIndex,
        ...Object.fromEntries(Object.entries(styles).map(([k, v]) => [styleKeyToKebab(k), v])),
      };

      const styleStr = Object.entries(fullStyles)
        .map(([k, v]) => `      ${k}: ${v};`)
        .join('\n');

      const animationCSS = getAnimationCSS(el);
      cssClasses += `    .${containerClass} .${className} {\n${styleStr}\n${
        animationCSS ? '      ' + animationCSS.replace(/;/g, ';\n') : ''
      }    }\n`;

      if (el.type === 'icon') {
        const validName =
          el.iconName && el.iconName in LucideIcons ? el.iconName : 'HelpCircle';
        const sizeStr = el.styles?.fontSize
          ? String(el.styles.fontSize).replace(/[^0-9.]/g, '')
          : '24';
        const size = parseInt(sizeStr, 10) || 24;
        return `    ${generateLucideSVG(validName, size, `nexore-icon ${className}`)}`;
      }
      if (el.type === 'input') {
        return `    <input type="text" placeholder="${el.placeholder || ''}" value="${
          el.content || ''
        }" class="nexore-input ${className}"${el.disabled ? ' disabled' : ''} />`;
      }
      if (el.type === 'divider') return `    <hr class="nexore-divider ${className}" />`;
      if (el.type === 'image')
        return `    <img src="${
          el.src || el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'
        }" alt="${el.alt || 'Preview'}" class="nexore-image ${className}" />`;
      if (el.type === 'progress') {
        const pVal = Math.min(100, Math.max(0, parseInt(String(el.value ?? 60), 10) || 0));
        return `    <div class="nexore-progress-wrapper ${className}">\n${
          el.label || el.content
            ? `      <span class="nexore-progress-label">${el.label || el.content}</span>\n`
            : ''
        }      <div class="nexore-progress-bar">\n        <div class="nexore-progress-fill" style="width: ${pVal}%"></div>\n      </div>\n    </div>`;
      }
      if (el.type === 'switch') {
        return `    <div class="nexore-switch ${className}${
          el.disabled ? ' disabled' : ''
        }">\n      <div class="nexore-switch-track${
          el.checked === false ? ' off' : ''
        }">\n        <div class="nexore-switch-thumb${
          el.checked === false ? ' off' : ''
        }"></div>\n      </div>\n      <span class="nexore-switch-label">${
          el.content || el.label || 'Switch'
        }</span>\n    </div>`;
      }
      if (el.type === 'checkbox') {
        return `    <label class="nexore-checkbox ${className}${
          el.disabled ? ' disabled' : ''
        }">\n      <input type="checkbox" ${
          el.checked !== false ? 'checked' : ''
        } class="nexore-checkbox-input" ${
          el.disabled ? 'disabled' : ''
        } />\n      <span class="nexore-checkbox-label">${
          el.content || el.label || 'Checkbox'
        }</span>\n    </label>`;
      }
      if (el.type === 'avatar') {
        return `    <div class="nexore-avatar ${className}">\n      ${
          el.src
            ? `<img src="${el.src}" class="nexore-avatar-img" alt="${el.alt || 'Avatar'}" />`
            : `<span class="nexore-avatar-text">${el.content || 'NX'}</span>`
        }\n    </div>`;
      }

      if (el.type === 'button') {
        return `    <button class="nexore-button ${className}"${
          el.disabled ? ' disabled' : ''
        }>\n      ${el.content || 'Button'}\n    </button>`;
      }
      if (el.type === 'badge') {
        return `    <div class="nexore-badge ${className}">\n      ${
          el.content || 'Badge'
        }\n    </div>`;
      }
      if (el.type === 'card') {
        return `    <div class="nexore-card ${className}">\n      ${
          el.content ? `<h4 class="nexore-card-title">${el.content}</h4>` : ''
        }\n      ${
          el.secondaryContent ? `<p class="nexore-card-text">${el.secondaryContent}</p>` : ''
        }\n    </div>`;
      }
      const specialMarkup = renderElementMarkup(el, className, 'html');
      if (specialMarkup) return specialMarkup;

      const content = el.content || (el.type === 'text' ? 'Text' : '');
      return `    <${tag} class="${className}">\n      ${content}\n    </${tag}>`;
    })
    .join('\n');

  const globalCSS = `
    .${containerClass} {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      border-radius: 12px;
      border: 1px solid ${isLightMode ? '#e4e4e7' : '#27272a'};
      width: ${settings.width}px;
      height: ${settings.height}px;
      background-color: ${settings.backgroundColor || (isLightMode ? '#ffffff' : '#09090b')};
    }
    .${containerClass} * { box-sizing: border-box; }${
    hasInput
      ? isLightMode
        ? `\n    .${containerClass} .nexore-input { outline: none; border: 1px solid #e4e4e7; background: #ffffff; color: #09090b; padding: 0.5rem 0.75rem; }`
        : `\n    .${containerClass} .nexore-input { outline: none; border: 1px solid #3f3f46; background: #18181b; color: #fafafa; padding: 0.5rem 0.75rem; }`
      : ''
  }${
    hasDivider
      ? `\n    .${containerClass} .nexore-divider { border: none; border-bottom: 1px solid ${isLightMode ? '#e4e4e7' : '#27272a'}; margin: 0; }`
      : ''
  }${hasImage ? `\n    .${containerClass} .nexore-image { object-fit: cover; }` : ''}${
    hasButton
      ? isLightMode
        ? `\n    .${containerClass} .nexore-button { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; font-weight: 500; cursor: pointer; outline: none; border: 1px solid #e4e4e7; background: #f4f4f5; color: #09090b; }`
        : `\n    .${containerClass} .nexore-button { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; font-weight: 500; cursor: pointer; outline: none; border: none; background: transparent; }`
      : ''
  }${
    hasBadge
      ? isLightMode
        ? `\n    .${containerClass} .nexore-badge { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; font-weight: 600; font-size: 0.75rem; padding: 0.125rem 0.625rem; border: 1px solid #e4e4e7; background-color: #f4f4f5; color: #09090b; }`
        : `\n    .${containerClass} .nexore-badge { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; font-weight: 600; font-size: 0.75rem; padding: 0.125rem 0.625rem; border: 1px solid #3f3f46; background-color: #27272a; color: #fafafa; }`
      : ''
  }${
    hasCard
      ? isLightMode
        ? `\n    .${containerClass} .nexore-card { background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 0.5rem; display: flex; flex-direction: column; justify-content: center; padding: 16px; }\n    .${containerClass} .nexore-card-title { font-size: 0.875rem; font-weight: 600; margin: 0 0 4px; color: #09090b; }\n    .${containerClass} .nexore-card-text { font-size: 0.75rem; color: #71717a; margin: 0; }`
        : `\n    .${containerClass} .nexore-card { background-color: #18181b; border-radius: 0.5rem; display: flex; flex-direction: column; justify-content: center; padding: 16px; }\n    .${containerClass} .nexore-card-title { font-size: 0.875rem; font-weight: 600; margin: 0 0 4px; color: #fafafa; }\n    .${containerClass} .nexore-card-text { font-size: 0.75rem; color: #a1a1aa; margin: 0; }`
      : ''
  }${
    hasProgress
      ? isLightMode
        ? `\n    .${containerClass} .nexore-progress-bar { background: #f4f4f5; border-radius: 9999px; height: 8px; overflow: hidden; }\n    .${containerClass} .nexore-progress-fill { height: 100%; background: #18181b; border-radius: 9999px; }`
        : `\n    .${containerClass} .nexore-progress-bar { background: #27272a; border-radius: 9999px; height: 8px; overflow: hidden; }\n    .${containerClass} .nexore-progress-fill { height: 100%; background: #fafafa; border-radius: 9999px; }`
      : ''
  }${
    hasSwitch
      ? isLightMode
        ? `\n    .${containerClass} .nexore-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n    .${containerClass} .nexore-switch-track { width: 36px; height: 20px; background: #18181b; border-radius: 9999px; position: relative; }\n    .${containerClass} .nexore-switch-thumb { width: 16px; height: 16px; background: #ffffff; border-radius: 50%; position: absolute; left: 18px; top: 2px; }\n    .${containerClass} .nexore-switch-label { font-size: 12px; color: inherit; }`
        : `\n    .${containerClass} .nexore-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n    .${containerClass} .nexore-switch-track { width: 36px; height: 20px; background: #fafafa; border-radius: 9999px; position: relative; }\n    .${containerClass} .nexore-switch-thumb { width: 16px; height: 16px; background: #09090b; border-radius: 50%; position: absolute; left: 18px; top: 2px; }\n    .${containerClass} .nexore-switch-label { font-size: 12px; color: inherit; }`
      : ''
  }${
    hasCheckbox
      ? isLightMode
        ? `\n    .${containerClass} .nexore-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n    .${containerClass} .nexore-checkbox-input { accent-color: #18181b; width: 16px; height: 16px; }\n    .${containerClass} .nexore-checkbox-label { font-size: 12px; color: inherit; }`
        : `\n    .${containerClass} .nexore-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n    .${containerClass} .nexore-checkbox-input { accent-color: #fafafa; width: 16px; height: 16px; }\n    .${containerClass} .nexore-checkbox-label { font-size: 12px; color: inherit; }`
      : ''
  }${
    hasAvatar
      ? isLightMode
        ? `\n    .${containerClass} .nexore-avatar { border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f4f4f5; }\n    .${containerClass} .nexore-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }`
        : `\n    .${containerClass} .nexore-avatar { border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #27272a; }\n    .${containerClass} .nexore-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }`
      : ''
  }${
    hasAvatarText
      ? isLightMode
        ? `\n    .${containerClass} .nexore-avatar-text { color: #09090b; font-weight: 600; }`
        : `\n    .${containerClass} .nexore-avatar-text { color: #fafafa; font-weight: 600; }`
      : ''
  }${getExtraComponentsCSS(containerClass, isLightMode, sorted)}`;

  const bodyMarkup = elementsHTML.trim()
    ? `  <div class="${containerClass}">\n${elementsHTML}\n  </div>`
    : `  <div class="${containerClass}"></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nexore Component</title>
  <style>${globalCSS}

${cssClasses}  </style>
</head>
<body style="background: ${isLightMode ? '#ffffff' : '#09090b'}; color: ${isLightMode ? '#09090b' : '#fafafa'}; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; font-family: Inter, system-ui, sans-serif;">
${bodyMarkup}
</body>
</html>`;
}

export function generateVueCode(
  elements: NexoreMakeElement[],
  settings: CanvasSettings,
  isLight?: boolean
): string {
  const isLightMode =
    isLight !== undefined
      ? isLight
      : settings.backgroundColor && isLightColor(settings.backgroundColor)
      ? true
      : typeof document !== 'undefined'
      ? !document.documentElement.classList.contains('dark')
      : false;

  const sorted = [...elements].filter((el) => !el.hidden).sort((a, b) => a.zIndex - b.zIndex);
  const hasProgress = sorted.some((el) => el.type === 'progress');
  const hasSwitch = sorted.some((el) => el.type === 'switch');
  const hasAvatar = sorted.some((el) => el.type === 'avatar');
  const hasAvatarText = sorted.some((el) => el.type === 'avatar' && el.content);
  const hasInput = sorted.some((el) => el.type === 'input');
  const hasCheckbox = sorted.some((el) => el.type === 'checkbox');
  const hasDivider = sorted.some((el) => el.type === 'divider');
  const hasImage = sorted.some((el) => el.type === 'image');
  const hasButton = sorted.some((el) => el.type === 'button');
  const hasBadge = sorted.some((el) => el.type === 'badge');
  const hasCard = sorted.some((el) => el.type === 'card');
  const iconElements = sorted.filter((el) => el.type === 'icon');
  const validIcons = Array.from(
    new Set(
      iconElements.map((el) =>
        el.iconName && el.iconName in LucideIcons ? el.iconName : 'HelpCircle'
      )
    )
  );

  const containerClass = 'nexore-canvas-root';

  let cssClasses = '';
  let stateVars = '';

  const elementsHTML = sorted
    .map((el, idx) => {
      const tag = getHTMLTag(el.type);
      const className = `el-${el.type}-${idx}`;
      const styles = getElementJSXStyle(el);
      const fullStyles = {
        position: 'absolute',
        left: typeof el.position.x === 'number' ? `${el.position.x}px` : el.position.x,
        top: typeof el.position.y === 'number' ? `${el.position.y}px` : el.position.y,
        width: typeof el.size.width === 'number' ? `${el.size.width}px` : el.size.width,
        height: typeof el.size.height === 'number' ? `${el.size.height}px` : el.size.height,
        'z-index': el.zIndex,
        ...Object.fromEntries(Object.entries(styles).map(([k, v]) => [styleKeyToKebab(k), v])),
      };

      const styleStr = Object.entries(fullStyles)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n');

      const animationCSS = getAnimationCSS(el);
      cssClasses += `.${containerClass} .${className} {\n${styleStr}\n${
        animationCSS ? '  ' + animationCSS.replace(/;/g, ';\n') : ''
      }}\n`;

      if (el.type === 'switch') stateVars += `const switch${idx} = ref(${el.checked !== false});\n`;
      if (el.type === 'checkbox')
        stateVars += `const check${idx} = ref(${el.checked !== false});\n`;

      if (el.type === 'icon') {
        const validName =
          el.iconName && el.iconName in LucideIcons ? el.iconName : 'HelpCircle';
        const sizeStr = el.styles?.fontSize
          ? String(el.styles.fontSize).replace(/[^0-9.]/g, '')
          : '24';
        const size = parseInt(sizeStr, 10) || 24;
        return `    <${validName} class="nexore-icon ${className}" :size="${size}" color="currentColor" />`;
      }
      if (el.type === 'input') {
        return `    <input type="text" placeholder="${el.placeholder || ''}" value="${
          el.content || ''
        }" class="nexore-input ${className}"${el.disabled ? ' disabled' : ''} />`;
      }
      if (el.type === 'divider') return `    <hr class="nexore-divider ${className}" />`;
      if (el.type === 'image')
        return `    <img src="${
          el.src || el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'
        }" alt="${el.alt || 'Preview'}" class="nexore-image ${className}" />`;
      if (el.type === 'progress') {
        const pVal = Math.min(100, Math.max(0, parseInt(String(el.value ?? 60), 10) || 0));
        return `    <div class="nexore-progress-wrapper ${className}">\n${
          el.label || el.content
            ? `      <span class="nexore-progress-label">${el.label || el.content}</span>\n`
            : ''
        }      <div class="nexore-progress-bar">\n        <div class="nexore-progress-fill" style="width: ${pVal}%"></div>\n      </div>\n    </div>`;
      }
      if (el.type === 'switch') {
        return `    <div class="nexore-switch ${className}${
          el.disabled ? ' disabled' : ''
        }" ${!el.disabled ? `@click="switch${idx} = !switch${idx}"` : ''}>\n      <div :class="['nexore-switch-track', !switch${idx} && 'off']">\n        <div :class="['nexore-switch-thumb', !switch${idx} && 'off']"></div>\n      </div>\n      <span class="nexore-switch-label">${
          el.content || el.label || 'Switch'
        }</span>\n    </div>`;
      }
      if (el.type === 'checkbox') {
        return `    <label class="nexore-checkbox ${className}${
          el.disabled ? ' disabled' : ''
        }">\n      <input type="checkbox" v-model="check${idx}" class="nexore-checkbox-input" ${
          el.disabled ? 'disabled' : ''
        } />\n      <span class="nexore-checkbox-label">${
          el.content || el.label || 'Checkbox'
        }</span>\n    </label>`;
      }
      if (el.type === 'avatar') {
        return `    <div class="nexore-avatar ${className}">\n      ${
          el.src
            ? `<img src="${el.src}" class="nexore-avatar-img" alt="${el.alt || 'Avatar'}" />`
            : `<span class="nexore-avatar-text">${el.content || 'NX'}</span>`
        }\n    </div>`;
      }

      if (el.type === 'button') {
        return `    <button class="nexore-button ${className}"${
          el.disabled ? ' disabled' : ''
        }>\n      ${el.content || 'Button'}\n    </button>`;
      }
      if (el.type === 'badge') {
        return `    <div class="nexore-badge ${className}">\n      ${
          el.content || 'Badge'
        }\n    </div>`;
      }
      if (el.type === 'card') {
        return `    <div class="nexore-card ${className}">\n      ${
          el.content ? `<h4 class="nexore-card-title">${el.content}</h4>` : ''
        }\n      ${
          el.secondaryContent ? `<p class="nexore-card-text">${el.secondaryContent}</p>` : ''
        }\n    </div>`;
      }
      const specialMarkup = renderElementMarkup(el, className, 'vue');
      if (specialMarkup) return specialMarkup;

      const content = el.content || (el.type === 'text' ? 'Text' : '');
      return `    <${tag} class="${className}">\n      ${content}\n    </${tag}>`;
    })
    .join('\n');

  const globalCSS = `
.${containerClass} {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 12px;
  border: 1px solid ${isLightMode ? '#e4e4e7' : '#27272a'};
  width: ${settings.width}px;
  height: ${settings.height}px;
  background-color: ${settings.backgroundColor || (isLightMode ? '#ffffff' : '#09090b')};
}
.${containerClass} * { box-sizing: border-box; }${
    hasInput
      ? isLightMode
        ? `\n.${containerClass} .nexore-input { outline: none; border: 1px solid #e4e4e7; background: #ffffff; color: #09090b; padding: 0.5rem 0.75rem; }`
        : `\n.${containerClass} .nexore-input { outline: none; border: 1px solid #3f3f46; background: #18181b; color: #fafafa; padding: 0.5rem 0.75rem; }`
      : ''
  }${
    hasDivider
      ? `\n.${containerClass} .nexore-divider { border: none; border-bottom: 1px solid ${isLightMode ? '#e4e4e7' : '#27272a'}; margin: 0; }`
      : ''
  }${hasImage ? `\n.${containerClass} .nexore-image { object-fit: cover; }` : ''}${
    hasButton
      ? isLightMode
        ? `\n.${containerClass} .nexore-button { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; font-weight: 500; cursor: pointer; outline: none; border: 1px solid #e4e4e7; background: #f4f4f5; color: #09090b; }`
        : `\n.${containerClass} .nexore-button { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.375rem; font-weight: 500; cursor: pointer; outline: none; border: none; background: transparent; }`
      : ''
  }${
    hasBadge
      ? isLightMode
        ? `\n.${containerClass} .nexore-badge { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; font-weight: 600; font-size: 0.75rem; padding: 0.125rem 0.625rem; border: 1px solid #e4e4e7; background-color: #f4f4f5; color: #09090b; }`
        : `\n.${containerClass} .nexore-badge { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; font-weight: 600; font-size: 0.75rem; padding: 0.125rem 0.625rem; border: 1px solid #3f3f46; background-color: #27272a; color: #fafafa; }`
      : ''
  }${
    hasCard
      ? isLightMode
        ? `\n.${containerClass} .nexore-card { background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 0.5rem; display: flex; flex-direction: column; justify-content: center; padding: 16px; }\n.${containerClass} .nexore-card-title { font-size: 0.875rem; font-weight: 600; margin: 0 0 4px; color: #09090b; }\n.${containerClass} .nexore-card-text { font-size: 0.75rem; color: #71717a; margin: 0; }`
        : `\n.${containerClass} .nexore-card { background-color: #18181b; border-radius: 0.5rem; display: flex; flex-direction: column; justify-content: center; padding: 16px; }\n.${containerClass} .nexore-card-title { font-size: 0.875rem; font-weight: 600; margin: 0 0 4px; color: #fafafa; }\n.${containerClass} .nexore-card-text { font-size: 0.75rem; color: #a1a1aa; margin: 0; }`
      : ''
  }${
    hasProgress
      ? isLightMode
        ? `\n.${containerClass} .nexore-progress-bar { background: #f4f4f5; border-radius: 9999px; height: 8px; overflow: hidden; }\n.${containerClass} .nexore-progress-fill { height: 100%; background: #18181b; border-radius: 9999px; }`
        : `\n.${containerClass} .nexore-progress-bar { background: #27272a; border-radius: 9999px; height: 8px; overflow: hidden; }\n.${containerClass} .nexore-progress-fill { height: 100%; background: #fafafa; border-radius: 9999px; }`
      : ''
  }${
    hasSwitch
      ? isLightMode
        ? `\n.${containerClass} .nexore-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n.${containerClass} .nexore-switch-track { width: 36px; height: 20px; background: #18181b; border-radius: 9999px; position: relative; }\n.${containerClass} .nexore-switch-track.off { background: #e4e4e7; }\n.${containerClass} .nexore-switch-thumb { width: 16px; height: 16px; background: #ffffff; border-radius: 50%; position: absolute; left: 18px; top: 2px; }\n.${containerClass} .nexore-switch-thumb.off { left: 2px; background: #ffffff; }\n.${containerClass} .nexore-switch-label { font-size: 12px; color: inherit; }`
        : `\n.${containerClass} .nexore-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n.${containerClass} .nexore-switch-track { width: 36px; height: 20px; background: #fafafa; border-radius: 9999px; position: relative; }\n.${containerClass} .nexore-switch-track.off { background: #3f3f46; }\n.${containerClass} .nexore-switch-thumb { width: 16px; height: 16px; background: #09090b; border-radius: 50%; position: absolute; left: 18px; top: 2px; }\n.${containerClass} .nexore-switch-thumb.off { left: 2px; background: #fafafa; }\n.${containerClass} .nexore-switch-label { font-size: 12px; color: inherit; }`
      : ''
  }${
    hasCheckbox
      ? isLightMode
        ? `\n.${containerClass} .nexore-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n.${containerClass} .nexore-checkbox-input { accent-color: #18181b; width: 16px; height: 16px; }\n.${containerClass} .nexore-checkbox-label { font-size: 12px; color: inherit; }`
        : `\n.${containerClass} .nexore-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n.${containerClass} .nexore-checkbox-input { accent-color: #fafafa; width: 16px; height: 16px; }\n.${containerClass} .nexore-checkbox-label { font-size: 12px; color: inherit; }`
      : ''
  }${
    hasAvatar
      ? isLightMode
        ? `\n.${containerClass} .nexore-avatar { border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f4f4f5; }\n.${containerClass} .nexore-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }`
        : `\n.${containerClass} .nexore-avatar { border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #27272a; }\n.${containerClass} .nexore-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }`
      : ''
  }${
    hasAvatarText
      ? isLightMode
        ? `\n.${containerClass} .nexore-avatar-text { color: #09090b; font-weight: 600; }`
        : `\n.${containerClass} .nexore-avatar-text { color: #fafafa; font-weight: 600; }`
      : ''
  }${getExtraComponentsCSS(containerClass, isLightMode, sorted)}`;

  const bodyMarkup = elementsHTML.trim()
    ? `  <div class="${containerClass}">\n${elementsHTML}\n  </div>`
    : `  <div class="${containerClass}"></div>`;

  return `<template>
${bodyMarkup}
</template>

<script setup>
${validIcons.length > 0 ? `import { ${validIcons.join(', ')} } from 'lucide-vue-next';\n` : ''}${
    hasSwitch || hasCheckbox ? "import { ref } from 'vue';\n" : ''
  }${stateVars}</script>

<style scoped>${globalCSS}

${cssClasses}</style>`;
}

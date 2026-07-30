import { NexoreMakeElement, CanvasSettings } from '../types';

// Helper to convert React style key to kebab-case
export function styleKeyToKebab(key: string): string {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// Convert style object to inline CSS string
export function stylesToCSS(styles: NexoreMakeElement['styles']): string {
  return Object.entries(styles)
    .filter(([_, val]) => val !== undefined && val !== '')
    .map(([key, val]) => {
      let kebab = styleKeyToKebab(key);
      let value = val;
      if (key === 'blur' && val) {
        kebab = 'filter';
        value = `blur(${val})`;
      }
      return `  ${kebab}: ${value};`;
    })
    .join('\n');
}

// Helper to map React styles to JSX style object
export function getElementJSXStyle(el: NexoreMakeElement): Record<string, any> {
  const styles: Record<string, any> = {};
  
  if (el.styles.backgroundColor) styles.backgroundColor = el.styles.backgroundColor;
  if (el.styles.color) styles.color = el.styles.color;
  if (el.styles.borderRadius) styles.borderRadius = el.styles.borderRadius;
  if (el.styles.borderRadiusTopLeft) styles.borderTopLeftRadius = el.styles.borderRadiusTopLeft;
  if (el.styles.borderRadiusTopRight) styles.borderTopRightRadius = el.styles.borderRadiusTopRight;
  if (el.styles.borderRadiusBottomLeft) styles.borderBottomLeftRadius = el.styles.borderRadiusBottomLeft;
  if (el.styles.borderRadiusBottomRight) styles.borderBottomRightRadius = el.styles.borderRadiusBottomRight;
  if (el.styles.borderWidth) styles.borderWidth = el.styles.borderWidth;
  if (el.styles.borderColor) styles.borderColor = el.styles.borderColor;
  if (el.styles.borderStyle) styles.borderStyle = el.styles.borderStyle;
  
  if (el.styles.paddingTop) styles.paddingTop = el.styles.paddingTop;
  if (el.styles.paddingRight) styles.paddingRight = el.styles.paddingRight;
  if (el.styles.paddingBottom) styles.paddingBottom = el.styles.paddingBottom;
  if (el.styles.paddingLeft) styles.paddingLeft = el.styles.paddingLeft;
  
  if (el.styles.marginTop) styles.marginTop = el.styles.marginTop;
  if (el.styles.marginRight) styles.marginRight = el.styles.marginRight;
  if (el.styles.marginBottom) styles.marginBottom = el.styles.marginBottom;
  if (el.styles.marginLeft) styles.marginLeft = el.styles.marginLeft;

  if (el.styles.boxShadow) styles.boxShadow = el.styles.boxShadow;
  if (el.styles.opacity !== undefined) styles.opacity = el.styles.opacity;
  
  if (el.styles.fontSize) styles.fontSize = el.styles.fontSize;
  if (el.styles.fontWeight) styles.fontWeight = el.styles.fontWeight;
  if (el.styles.fontFamily) styles.fontFamily = el.styles.fontFamily;
  if (el.styles.textAlign) styles.textAlign = el.styles.textAlign;
  
  if (el.styles.display) styles.display = el.styles.display;
  if (el.styles.flexDirection) styles.flexDirection = el.styles.flexDirection;
  if (el.styles.justifyContent) styles.justifyContent = el.styles.justifyContent;
  if (el.styles.alignItems) styles.alignItems = el.styles.alignItems;
  if (el.styles.gap) styles.gap = el.styles.gap;
  if (el.styles.blur) styles.filter = `blur(${el.styles.blur})`;
  if (el.styles.transition) styles.transition = el.styles.transition;

  // New style properties
  if (el.styles.textDecoration && el.styles.textDecoration !== 'none') styles.textDecoration = el.styles.textDecoration;
  if (el.styles.textTransform && el.styles.textTransform !== 'none') styles.textTransform = el.styles.textTransform;
  if (el.styles.fontStyle && el.styles.fontStyle !== 'normal') styles.fontStyle = el.styles.fontStyle;
  if (el.styles.wordSpacing) styles.wordSpacing = el.styles.wordSpacing;
  if (el.styles.textShadow && el.styles.textShadow !== 'none') styles.textShadow = el.styles.textShadow;
  if (el.styles.borderTopLeftRadius) styles.borderTopLeftRadius = el.styles.borderTopLeftRadius;
  if (el.styles.borderTopRightRadius) styles.borderTopRightRadius = el.styles.borderTopRightRadius;
  if (el.styles.borderBottomLeftRadius) styles.borderBottomLeftRadius = el.styles.borderBottomLeftRadius;
  if (el.styles.borderBottomRightRadius) styles.borderBottomRightRadius = el.styles.borderBottomRightRadius;
  if (el.styles.outlineWidth && el.styles.outlineWidth !== '0px') {
    styles.outline = `${el.styles.outlineWidth} ${el.styles.outlineStyle || 'solid'} ${el.styles.outlineColor || '#7c3aed'}`;
    if (el.styles.outlineOffset) styles.outlineOffset = el.styles.outlineOffset;
  }
  if (el.styles.mixBlendMode && el.styles.mixBlendMode !== 'normal') styles.mixBlendMode = el.styles.mixBlendMode;

  return styles;
}

// Convert keyframe preset animations to inline CSS animations
export function getAnimationCSS(el: NexoreMakeElement): string {
  if (!el.animationPreset || el.animationPreset === 'none') return '';
  switch (el.animationPreset) {
    case 'pulse': return 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;';
    case 'bounce': return 'animation: bounce 1s infinite;';
    case 'fade-in': return 'animation: fadeIn 0.5s ease-out forwards;';
    case 'slide-in': return 'animation: slideIn 0.5s ease-out forwards;';
    case 'glow': return 'animation: glowGleam 2s ease-in-out infinite alternate;';
    case 'spin': return 'animation: spinAround 1s linear infinite;';
    default: return '';
  }
}

// Translate element config to HTML tags
function getHTMLTag(type: string): string {
  switch (type) {
    case 'button': return 'button';
    case 'input': return 'input';
    case 'divider': return 'hr';
    case 'image': return 'img';
    case 'text': return 'div';
    default: return 'div';
  }
}

export function generateReactCode(elements: NexoreMakeElement[], settings: CanvasSettings): string {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const hasProgress = elements.some(el => el.type === 'progress');
  const hasSwitch = elements.some(el => el.type === 'switch');
  const hasAvatar = elements.some(el => el.type === 'avatar');
  const hasAvatarText = elements.some(el => el.type === 'avatar' && el.content);
  const hasInput = elements.some(el => el.type === 'input');
  const hasCheckbox = elements.some(el => el.type === 'checkbox');
  const hasDivider = elements.some(el => el.type === 'divider');
  const hasImage = elements.some(el => el.type === 'image');
  
  const hash = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const containerClass = `nexore-container-${hash}`;

  let stateHooks = '';
  let cssClasses = '';
  
  const elementsHTML = sorted.map((el, idx) => {
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
      ...Object.fromEntries(
        Object.entries(styles).map(([k, v]) => [styleKeyToKebab(k), v])
      )
    };

    const styleStr = Object.entries(fullStyles)
      .map(([k, v]) => `          ${k}: ${v};`)
      .join('\n');
      
    let cssVars = '';
    if (el.type === 'switch' && el.styles.backgroundColor) cssVars += `\n          --switch-color: ${el.styles.backgroundColor};`;
    if (el.type === 'progress' && el.styles.backgroundColor) cssVars += `\n          --progress-color: ${el.styles.backgroundColor};`;
    if (el.type === 'checkbox' && el.styles.backgroundColor) cssVars += `\n          --checkbox-color: ${el.styles.backgroundColor};`;

    const animationCSS = getAnimationCSS(el);
    cssClasses += `        .${containerClass} .${className} {\n${styleStr}${cssVars}\n${animationCSS ? '          ' + animationCSS.replace(/;/g, ';\n') : ''}        }\n`;

    if (el.type === 'switch') stateHooks += `  const [switch${idx}, setSwitch${idx}] = React.useState(true);\n`;
    if (el.type === 'checkbox') stateHooks += `  const [check${idx}, setCheck${idx}] = React.useState(true);\n`;

    if (el.type === 'input') return `        <input type="text" placeholder="${el.placeholder || ''}" className="nexore-input ${className}" />`;
    if (el.type === 'divider') return `        <hr className="nexore-divider ${className}" />`;
    if (el.type === 'image') return `        <img src="${el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}" alt="Preview" className="nexore-image ${className}" />`;
    if (el.type === 'progress') {
      return `        <div className="nexore-progress-bar ${className}">\n          <div className="nexore-progress-fill" style={{ width: '${el.content || '60%'}' }}></div>\n        </div>`;
    }
    if (el.type === 'switch') {
      return `        <div className="nexore-switch ${className}" onClick={() => setSwitch${idx}(!switch${idx})}>\n          <div className={\`nexore-switch-track \${switch${idx} ? '' : 'off'}\`}>\n            <div className={\`nexore-switch-thumb \${switch${idx} ? '' : 'off'}\`}></div>\n          </div>\n          <span className="nexore-switch-label">${el.content || 'Switch'}</span>\n        </div>`;
    }
    if (el.type === 'checkbox') {
      return `        <label className="nexore-checkbox ${className}">\n          <input type="checkbox" checked={check${idx}} onChange={(e) => setCheck${idx}(e.target.checked)} className="nexore-checkbox-input" />\n          <span className="nexore-checkbox-label">${el.content || 'Checkbox'}</span>\n        </label>`;
    }
    if (el.type === 'avatar') {
      return `        <div className="nexore-avatar ${className}">\n          ${el.content ? `<span className="nexore-avatar-text">${el.content}</span>` : `<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="nexore-avatar-img" alt="Avatar" />`}\n        </div>`;
    }

    const content = el.content || (el.type === 'button' ? 'Button' : el.type === 'badge' ? 'Badge' : el.type === 'text' ? 'Text' : '');
    return `        <${tag} className="${className}">\n          ${content}\n        </${tag}>`;
  }).join('\n');

  const uniqueAnimations = new Set(elements.map(el => el.animationPreset).filter(Boolean));
  let keyframes = '';
  if (uniqueAnimations.has('pulse')) keyframes += `\n        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }`;
  if (uniqueAnimations.has('bounce')) keyframes += `\n        @keyframes bounce { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); } }`;
  if (uniqueAnimations.has('fade-in')) keyframes += `\n        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`;
  if (uniqueAnimations.has('slide-in')) keyframes += `\n        @keyframes slideIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
  if (uniqueAnimations.has('glow')) keyframes += `\n        @keyframes glowGleam { from { box-shadow: 0 0 5px rgba(139, 92, 246, 0.2); } to { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); } }`;
  if (uniqueAnimations.has('spin')) keyframes += `\n        @keyframes spinAround { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;

  const globalCSS = `
        .${containerClass} {
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          border-radius: 12px;
          border: 1px solid #27272a;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: ${settings.width}px;
          height: ${settings.height}px;
          background-color: ${settings.backgroundColor || '#09090b'};
        }
        .${containerClass} * { box-sizing: border-box; }${hasInput ? `\n        .${containerClass} .nexore-input { outline: none; border: 1px solid #3f3f46; background: #18181b; color: white; padding: 8px 12px; transition: border-color 0.2s; }\n        .${containerClass} .nexore-input:focus { border-color: #8b5cf6; }` : ''}${hasDivider ? `\n        .${containerClass} .nexore-divider { border: none; border-bottom: 1px solid #27272a; margin: 0; }` : ''}${hasImage ? `\n        .${containerClass} .nexore-image { object-fit: cover; }` : ''}${hasProgress ? `\n        .${containerClass} .nexore-progress-bar { background: #27272a; border-radius: 9999px; padding: 2px; }\n        .${containerClass} .nexore-progress-fill { height: 100%; background: var(--progress-color, #8b5cf6); border-radius: 9999px; transition: width 0.2s; }` : ''}${hasSwitch ? `\n        .${containerClass} .nexore-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n        .${containerClass} .nexore-switch-track { width: 36px; height: 20px; background: var(--switch-color, #8b5cf6); border-radius: 9999px; position: relative; transition: background 0.2s; }\n        .${containerClass} .nexore-switch-track.off { background: #3f3f46; }\n        .${containerClass} .nexore-switch-thumb { width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; left: 18px; top: 2px; transition: left 0.2s; }\n        .${containerClass} .nexore-switch-thumb.off { left: 2px; }\n        .${containerClass} .nexore-switch-label { font-size: 12px; font-family: sans-serif; color: inherit; user-select: none; }` : ''}${hasCheckbox ? `\n        .${containerClass} .nexore-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n        .${containerClass} .nexore-checkbox-input { accent-color: var(--checkbox-color, #8b5cf6); width: 16px; height: 16px; }\n        .${containerClass} .nexore-checkbox-label { font-size: 12px; font-family: sans-serif; color: inherit; user-select: none; }` : ''}${hasAvatar ? `\n        .${containerClass} .nexore-avatar { border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #27272a; }\n        .${containerClass} .nexore-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }` : ''}${hasAvatarText ? `\n        .${containerClass} .nexore-avatar-text { color: white; font-weight: bold; }` : ''}
${cssClasses}${keyframes}`;

  return `import React from 'react';

export default function CustomComponent() {
${stateHooks}
  return (
    <>
      <style>{\`${globalCSS}
      \`}</style>
      <div className="${containerClass}">
${elementsHTML}
      </div>
    </>
  );
}`;
}

export function generateHTMLCode(elements: NexoreMakeElement[], settings: CanvasSettings): string {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const hasProgress = elements.some(el => el.type === 'progress');
  const hasSwitch = elements.some(el => el.type === 'switch');
  const hasAvatar = elements.some(el => el.type === 'avatar');
  const hasAvatarText = elements.some(el => el.type === 'avatar' && el.content);
  const hasInput = elements.some(el => el.type === 'input');
  const hasCheckbox = elements.some(el => el.type === 'checkbox');
  const hasDivider = elements.some(el => el.type === 'divider');
  const hasImage = elements.some(el => el.type === 'image');
  
  const hash = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const containerClass = `nexore-container-${hash}`;

  let cssClasses = '';
  const elementsHTML = sorted.map((el, idx) => {
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
      ...Object.fromEntries(
        Object.entries(styles).map(([k, v]) => [styleKeyToKebab(k), v])
      )
    };

    const styleStr = Object.entries(fullStyles)
      .map(([k, v]) => `      ${k}: ${v};`)
      .join('\n');

    let cssVars = '';
    if (el.type === 'switch' && el.styles.backgroundColor) cssVars += `\n      --switch-color: ${el.styles.backgroundColor};`;
    if (el.type === 'progress' && el.styles.backgroundColor) cssVars += `\n      --progress-color: ${el.styles.backgroundColor};`;
    if (el.type === 'checkbox' && el.styles.backgroundColor) cssVars += `\n      --checkbox-color: ${el.styles.backgroundColor};`;

    const animationCSS = getAnimationCSS(el);
    cssClasses += `    .${containerClass} .${className} {\n${styleStr}${cssVars}\n${animationCSS ? '      ' + animationCSS.replace(/;/g, ';\n') : ''}    }\n`;

    if (el.type === 'input') return `    <input type="text" placeholder="${el.placeholder || ''}" class="nexore-input ${className}" />`;
    if (el.type === 'divider') return `    <hr class="nexore-divider ${className}" />`;
    if (el.type === 'image') return `    <img src="${el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}" alt="Preview" class="nexore-image ${className}" />`;
    if (el.type === 'progress') {
      return `    <div class="nexore-progress-bar ${className}">\n      <div class="nexore-progress-fill" style="width: ${el.content || '60%'};"></div>\n    </div>`;
    }
    if (el.type === 'switch') {
      return `    <div class="nexore-switch ${className}">\n      <div class="nexore-switch-track">\n        <div class="nexore-switch-thumb"></div>\n      </div>\n      <span class="nexore-switch-label">${el.content || 'Switch'}</span>\n    </div>`;
    }
    if (el.type === 'checkbox') {
      return `    <label class="nexore-checkbox ${className}">\n      <input type="checkbox" checked class="nexore-checkbox-input" />\n      <span class="nexore-checkbox-label">${el.content || 'Checkbox'}</span>\n    </label>`;
    }
    if (el.type === 'avatar') {
      return `    <div class="nexore-avatar ${className}">\n      ${el.content ? `<span class="nexore-avatar-text">${el.content}</span>` : `<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" class="nexore-avatar-img" />`}\n    </div>`;
    }

    const content = el.content || (el.type === 'button' ? 'Button' : el.type === 'badge' ? 'Badge' : el.type === 'text' ? 'Text block' : '');
    return `    <${tag} class="${className}">${content}</${tag}>`;
  }).join('\n');

  const uniqueAnimations = new Set(elements.map(el => el.animationPreset).filter(Boolean));
  let keyframes = '';
  if (uniqueAnimations.has('pulse')) keyframes += `\n    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }`;
  if (uniqueAnimations.has('bounce')) keyframes += `\n    @keyframes bounce { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); } }`;
  if (uniqueAnimations.has('fade-in')) keyframes += `\n    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`;
  if (uniqueAnimations.has('slide-in')) keyframes += `\n    @keyframes slideIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
  if (uniqueAnimations.has('glow')) keyframes += `\n    @keyframes glowGleam { from { box-shadow: 0 0 5px rgba(139, 92, 246, 0.2); } to { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); } }`;
  if (uniqueAnimations.has('spin')) keyframes += `\n    @keyframes spinAround { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;

  const globalCSS = `
    .${containerClass} {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      border-radius: 12px;
      border: 1px solid #27272a;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: ${settings.width}px;
      height: ${settings.height}px;
      background-color: ${settings.backgroundColor || '#09090b'};
    }
    .${containerClass} * { box-sizing: border-box; }${hasInput ? `\n    .${containerClass} .nexore-input { outline: none; border: 1px solid #3f3f46; background: #18181b; color: white; padding: 8px 12px; transition: border-color 0.2s; }\n    .${containerClass} .nexore-input:focus { border-color: #8b5cf6; }` : ''}${hasDivider ? `\n    .${containerClass} .nexore-divider { border: none; border-bottom: 1px solid #27272a; margin: 0; }` : ''}${hasImage ? `\n    .${containerClass} .nexore-image { object-fit: cover; }` : ''}${hasProgress ? `\n    .${containerClass} .nexore-progress-bar { background: #27272a; border-radius: 9999px; padding: 2px; }\n    .${containerClass} .nexore-progress-fill { height: 100%; background: var(--progress-color, #8b5cf6); border-radius: 9999px; transition: width 0.2s; }` : ''}${hasSwitch ? `\n    .${containerClass} .nexore-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n    .${containerClass} .nexore-switch-track { width: 36px; height: 20px; background: var(--switch-color, #8b5cf6); border-radius: 9999px; position: relative; transition: background 0.2s; }\n    .${containerClass} .nexore-switch-thumb { width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; left: 18px; top: 2px; transition: left 0.2s; }\n    .${containerClass} .nexore-switch-label { font-size: 12px; font-family: sans-serif; color: inherit; user-select: none; }` : ''}${hasCheckbox ? `\n    .${containerClass} .nexore-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n    .${containerClass} .nexore-checkbox-input { accent-color: var(--checkbox-color, #8b5cf6); width: 16px; height: 16px; }\n    .${containerClass} .nexore-checkbox-label { font-size: 12px; font-family: sans-serif; color: inherit; user-select: none; }` : ''}${hasAvatar ? `\n    .${containerClass} .nexore-avatar { border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #27272a; }\n    .${containerClass} .nexore-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }` : ''}${hasAvatarText ? `\n    .${containerClass} .nexore-avatar-text { color: white; font-weight: bold; }` : ''}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nexore Component</title>
  <style>${globalCSS}
    
${cssClasses}${keyframes}
  </style>
</head>
<body style="background: #09090b; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">

  <div class="${containerClass}">
${elementsHTML}
  </div>
${hasSwitch ? `
  <script>
    document.querySelectorAll('.nexore-switch').forEach(el => {
      el.addEventListener('click', () => {
        el.querySelector('.nexore-switch-track').classList.toggle('off');
        el.querySelector('.nexore-switch-thumb').classList.toggle('off');
      });
    });
  </script>` : ''}
</body>
</html>`;
}

export function generateVueCode(elements: NexoreMakeElement[], settings: CanvasSettings): string {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const hasProgress = elements.some(el => el.type === 'progress');
  const hasSwitch = elements.some(el => el.type === 'switch');
  const hasAvatar = elements.some(el => el.type === 'avatar');
  const hasAvatarText = elements.some(el => el.type === 'avatar' && el.content);
  const hasInput = elements.some(el => el.type === 'input');
  const hasCheckbox = elements.some(el => el.type === 'checkbox');
  const hasDivider = elements.some(el => el.type === 'divider');
  const hasImage = elements.some(el => el.type === 'image');
  
  const hash = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const containerClass = `nexore-container-${hash}`;

  let cssClasses = '';
  let stateVars = '';

  const elementsHTML = sorted.map((el, idx) => {
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
      ...Object.fromEntries(
        Object.entries(styles).map(([k, v]) => [styleKeyToKebab(k), v])
      )
    };

    const styleStr = Object.entries(fullStyles)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');
      
    let cssVars = '';
    if (el.type === 'switch' && el.styles.backgroundColor) cssVars += `\n  --switch-color: ${el.styles.backgroundColor};`;
    if (el.type === 'progress' && el.styles.backgroundColor) cssVars += `\n  --progress-color: ${el.styles.backgroundColor};`;
    if (el.type === 'checkbox' && el.styles.backgroundColor) cssVars += `\n  --checkbox-color: ${el.styles.backgroundColor};`;

    const animationCSS = getAnimationCSS(el);
    cssClasses += `.${containerClass} .${className} {\n${styleStr}${cssVars}\n${animationCSS ? '  ' + animationCSS.replace(/;/g, ';\n') : ''}}\n`;

    if (el.type === 'switch') stateVars += `const switch${idx} = ref(true);\n`;
    if (el.type === 'checkbox') stateVars += `const check${idx} = ref(true);\n`;

    if (el.type === 'input') return `    <input type="text" placeholder="${el.placeholder || ''}" class="nexore-input ${className}" />`;
    if (el.type === 'divider') return `    <hr class="nexore-divider ${className}" />`;
    if (el.type === 'image') return `    <img src="${el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}" alt="Preview" class="nexore-image ${className}" />`;
    if (el.type === 'progress') {
      return `    <div class="nexore-progress-bar ${className}">\n      <div class="nexore-progress-fill" style="width: ${el.content || '60%'};"></div>\n    </div>`;
    }
    if (el.type === 'switch') {
      return `    <div class="nexore-switch ${className}" @click="switch${idx} = !switch${idx}">\n      <div :class="['nexore-switch-track', !switch${idx} && 'off']">\n        <div :class="['nexore-switch-thumb', !switch${idx} && 'off']"></div>\n      </div>\n      <span class="nexore-switch-label">${el.content || 'Switch'}</span>\n    </div>`;
    }
    if (el.type === 'checkbox') {
      return `    <label class="nexore-checkbox ${className}">\n      <input type="checkbox" v-model="check${idx}" class="nexore-checkbox-input" />\n      <span class="nexore-checkbox-label">${el.content || 'Checkbox'}</span>\n    </label>`;
    }
    if (el.type === 'avatar') {
      return `    <div class="nexore-avatar ${className}">\n      ${el.content ? `<span class="nexore-avatar-text">${el.content}</span>` : `<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" class="nexore-avatar-img" />`}\n    </div>`;
    }

    const content = el.content || (el.type === 'button' ? 'Button' : el.type === 'badge' ? 'Badge' : el.type === 'text' ? 'Text' : '');
    return `    <${tag} class="${className}">\n      ${content}\n    </${tag}>`;
  }).join('\n');

  const globalCSS = `
.${containerClass} {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 12px;
  border: 1px solid #27272a;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: ${settings.width}px;
  height: ${settings.height}px;
  background-color: ${settings.backgroundColor || '#09090b'};
}
.${containerClass} * { box-sizing: border-box; }${hasInput ? `\n.${containerClass} .nexore-input { outline: none; border: 1px solid #3f3f46; background: #18181b; color: white; padding: 8px 12px; transition: border-color 0.2s; }\n.${containerClass} .nexore-input:focus { border-color: #8b5cf6; }` : ''}${hasDivider ? `\n.${containerClass} .nexore-divider { border: none; border-bottom: 1px solid #27272a; margin: 0; }` : ''}${hasImage ? `\n.${containerClass} .nexore-image { object-fit: cover; }` : ''}${hasProgress ? `\n.${containerClass} .nexore-progress-bar { background: #27272a; border-radius: 9999px; padding: 2px; }\n.${containerClass} .nexore-progress-fill { height: 100%; background: var(--progress-color, #8b5cf6); border-radius: 9999px; transition: width 0.2s; }` : ''}${hasSwitch ? `\n.${containerClass} .nexore-switch { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n.${containerClass} .nexore-switch-track { width: 36px; height: 20px; background: var(--switch-color, #8b5cf6); border-radius: 9999px; position: relative; transition: background 0.2s; }\n.${containerClass} .nexore-switch-track.off { background: #3f3f46; }\n.${containerClass} .nexore-switch-thumb { width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; left: 18px; top: 2px; transition: left 0.2s; }\n.${containerClass} .nexore-switch-thumb.off { left: 2px; }\n.${containerClass} .nexore-switch-label { font-size: 12px; font-family: sans-serif; color: inherit; user-select: none; }` : ''}${hasCheckbox ? `\n.${containerClass} .nexore-checkbox { display: flex; align-items: center; gap: 8px; cursor: pointer; }\n.${containerClass} .nexore-checkbox-input { accent-color: var(--checkbox-color, #8b5cf6); width: 16px; height: 16px; }\n.${containerClass} .nexore-checkbox-label { font-size: 12px; font-family: sans-serif; color: inherit; user-select: none; }` : ''}${hasAvatar ? `\n.${containerClass} .nexore-avatar { border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #27272a; }\n.${containerClass} .nexore-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }` : ''}${hasAvatarText ? `\n.${containerClass} .nexore-avatar-text { color: white; font-weight: bold; }` : ''}`;

  return `<template>
  <div class="${containerClass}">
${elementsHTML}
  </div>
</template>

<script setup>
${hasSwitch || hasCheckbox ? "import { ref } from 'vue';\n" : ""}${stateVars}</script>

<style scoped>${globalCSS}

${cssClasses}</style>`;
}

export function generateSvelteCode(elements: NexoreMakeElement[], settings: CanvasSettings): string {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const hasProgress = elements.some(el => el.type === 'progress');
  const hasSwitch = elements.some(el => el.type === 'switch');
  const hasAvatar = elements.some(el => el.type === 'avatar');
  const elementsHTML = sorted.map((el) => {
    const tag = getHTMLTag(el.type);
    const styles = getElementJSXStyle(el);
    const fullStyles = {
      position: 'absolute',
      left: typeof el.position.x === 'number' ? `${el.position.x}px` : el.position.x,
      top: typeof el.position.y === 'number' ? `${el.position.y}px` : el.position.y,
      width: typeof el.size.width === 'number' ? `${el.size.width}px` : el.size.width,
      height: typeof el.size.height === 'number' ? `${el.size.height}px` : el.size.height,
      'z-index': el.zIndex,
      ...Object.fromEntries(
        Object.entries(styles).map(([k, v]) => [styleKeyToKebab(k), v])
      )
    };

    const styleStr = Object.entries(fullStyles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');

    const animationCSS = getAnimationCSS(el);
    const styleAttr = `style="${styleStr}; ${animationCSS}"`;

    if (el.type === 'input') {
      return `  <input type="text" placeholder="${el.placeholder || ''}" ${styleAttr} />`;
    }
    if (el.type === 'divider') {
      return `  <hr ${styleAttr} />`;
    }
    if (el.type === 'image') {
      return `  <img src="${el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}" alt="Preview" ${styleAttr} />`;
    }
    if (el.type === 'progress') {
      return `  <div ${styleAttr} class="progress-bar">\n    <div style="width: ${el.content || '60%'}; height: 100%; background: #8b5cf6; border-radius: 9999px;"></div>\n  </div>`;
    }
    if (el.type === 'switch') {
      return `  <!-- svelte-ignore a11y-click-events-have-key-events -->\n  <div ${styleAttr} class="switch-toggle" on:click={() => isEnabled = !isEnabled}>\n    <div style="width: 36px; height: 20px; background: {isEnabled ? '#8b5cf6' : '#3f3f46'}; border-radius: 9999px; position: relative; cursor: pointer; transition: background 0.2s;">\n      <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; left: {isEnabled ? '18px' : '2px'}; top: 2px; transition: left 0.2s;"></div>\n    </div>\n    <span>{switchLabel}</span>\n  </div>`;
    }
    if (el.type === 'checkbox') {
      return `  <label ${styleAttr} style="display: flex; align-items: center; gap: 8px; cursor: pointer;">\n    <input type="checkbox" bind:checked />\n    <span>{checkboxLabel}</span>\n  </label>`;
    }
    if (el.type === 'avatar') {
      return `  <div ${styleAttr} class="avatar-circle">\n    ${el.content ? `<span>${el.content}</span>` : `<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Avatar" />`}\n  </div>`;
    }

    const content = el.content || (el.type === 'button' ? 'Button' : el.type === 'badge' ? 'Badge' : el.type === 'text' ? 'Text block' : '');
    return `  <${tag} ${styleAttr}>${content}</${tag}>`;
  }).join('\n');

  return `<script>
  let isEnabled = true;
  let checked = true;
  
  let switchLabel = "Switch";
  let checkboxLabel = "Checkbox";
</script>

<div 
  class="component-wrapper" 
  style="width: ${settings.width}px; height: ${settings.height}px; background-color: ${settings.backgroundColor || '#09090b'};"
>
${elementsHTML}
</div>

<style>
  .component-wrapper {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    border-radius: 12px;
    border: 1px solid #27272a;
  }
  .component-wrapper * {
    box-sizing: border-box;
  }${hasProgress ? `\n  .progress-bar {\n    background: #27272a;\n    border-radius: 9999px;\n    padding: 2px;\n  }` : ''}${hasSwitch ? `\n  .switch-toggle {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    font-size: 12px;\n    font-family: sans-serif;\n    color: white;\n  }` : ''}${hasAvatar ? `\n  .avatar-circle {\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    background: #27272a;\n  }\n  .avatar-circle img {\n    width: 100%;\n    height: 100%;\n    object-fit: cover;\n  }` : ''}
</style>`;
}

export function generateAngularCode(elements: NexoreMakeElement[], settings: CanvasSettings): string {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const hasProgress = elements.some(el => el.type === 'progress');
  const hasSwitch = elements.some(el => el.type === 'switch');
  const hasAvatar = elements.some(el => el.type === 'avatar');
  const elementsHTML = sorted.map((el) => {
    const tag = getHTMLTag(el.type);
    const styles = getElementJSXStyle(el);
    const fullStyles = {
      position: 'absolute',
      left: typeof el.position.x === 'number' ? `${el.position.x}px` : el.position.x,
      top: typeof el.position.y === 'number' ? `${el.position.y}px` : el.position.y,
      width: typeof el.size.width === 'number' ? `${el.size.width}px` : el.size.width,
      height: typeof el.size.height === 'number' ? `${el.size.height}px` : el.size.height,
      zIndex: el.zIndex,
      ...styles
    };

    const styleBindings = Object.entries(fullStyles)
      .map(([k, v]) => `'${styleKeyToKebab(k)}': '${v}'`)
      .join(', ');

    const styleAttr = `[ngStyle]="{ ${styleBindings} }"`;

    if (el.type === 'input') {
      return `    <input type="text" placeholder="${el.placeholder || ''}" ${styleAttr} class="ng-input" />`;
    }
    if (el.type === 'divider') {
      return `    <hr ${styleAttr} class="ng-hr" />`;
    }
    if (el.type === 'image') {
      return `    <img src="${el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}" alt="Preview" ${styleAttr} class="ng-img" />`;
    }
    if (el.type === 'progress') {
      return `    <div ${styleAttr} class="ng-progress">\n      <div style="width: ${el.content || '60%'}; height: 100%; background: #8b5cf6; border-radius: 9999px;"></div>\n    </div>`;
    }
    if (el.type === 'switch') {
      return `    <div ${styleAttr} class="ng-switch" (click)="toggleEnabled()">\n      <div [style.background]="isEnabled ? '#8b5cf6' : '#3f3f46'" style="width: 36px; height: 20px; border-radius: 9999px; position: relative; cursor: pointer; transition: background 0.2s;">\n        <div [style.left]="isEnabled ? '18px' : '2px'" style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; transition: left 0.2s;"></div>\n      </div>\n      <span>${el.content || 'Switch'}</span>\n    </div>`;
    }
    if (el.type === 'checkbox') {
      return `    <label ${styleAttr} class="ng-checkbox">\n      <input type="checkbox" [(ngModel)]="isChecked" />\n      <span>${el.content || 'Checkbox'}</span>\n    </label>`;
    }
    if (el.type === 'avatar') {
      return `    <div ${styleAttr} class="ng-avatar">\n      ${el.content ? `<span>${el.content}</span>` : `<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" />`}\n    </div>`;
    }

    const content = el.content || (el.type === 'button' ? 'Button' : el.type === 'badge' ? 'Badge' : el.type === 'text' ? 'Text block' : '');
    return `    <${tag} ${styleAttr} class="ng-el-${el.type}">${content}</${tag}>`;
  }).join('\n');

  return `/* --- custom.component.ts --- */
import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-component',
  template: \`
    <div 
      class="component-wrapper" 
      [ngStyle]="{
        'width': '${settings.width}px',
        'height': '${settings.height}px',
        'background-color': '${settings.backgroundColor || '#09090b'}'
      }"
    >
${elementsHTML}
    </div>
  \`,
  styles: [\`
    .component-wrapper {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      border-radius: 12px;
      border: 1px solid #27272a;
    }
    .component-wrapper * {
      box-sizing: border-box;
    }
    .ng-input {
      outline: none;
      border: 1px solid #3f3f46;
      background: #18181b;
      color: white;
      padding: 8px 12px;
    }
    .ng-hr {
      border: none;
      border-bottom: 1px solid #27272a;
      margin: 0;
    }
    .ng-img {
      object-fit: cover;
    }${hasProgress ? `\n    .ng-progress {\n      background: #27272a;\n      border-radius: 9999px;\n      padding: 2px;\n    }` : ''}${hasSwitch ? `\n    .ng-switch {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      font-size: 12px;\n      font-family: sans-serif;\n      color: white;\n    }` : ''}
    .ng-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-family: sans-serif;
      color: white;
      cursor: pointer;
    }${hasAvatar ? `\n    .ng-avatar {\n      border-radius: 50%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      overflow: hidden;\n      background: #27272a;\n    }\n    .ng-avatar img {\n      width: 100%;\n      height: 100%;\n      object-fit: cover;\n    }` : ''}
  \`]
})
export class CustomComponent {
  isEnabled = true;
  isChecked = true;

  toggleEnabled() {
    this.isEnabled = !this.isEnabled;
  }
}`;
}

export function generateVanillaCode(elements: NexoreMakeElement[], settings: CanvasSettings): string {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const hasProgress = elements.some(el => el.type === 'progress');
  const hasSwitch = elements.some(el => el.type === 'switch');
  const hasAvatar = elements.some(el => el.type === 'avatar');
  const elementsJS = sorted.map((el, idx) => {
    const varName = `el_${idx}`;
    const tag = getHTMLTag(el.type);
    
    const styles = getElementJSXStyle(el);
    const fullStyles = {
      position: 'absolute',
      left: typeof el.position.x === 'number' ? `${el.position.x}px` : el.position.x,
      top: typeof el.position.y === 'number' ? `${el.position.y}px` : el.position.y,
      width: typeof el.size.width === 'number' ? `${el.size.width}px` : el.size.width,
      height: typeof el.size.height === 'number' ? `${el.size.height}px` : el.size.height,
      zIndex: el.zIndex,
      ...styles
    };

    const styleLines = Object.entries(fullStyles)
      .map(([k, v]) => `  ${varName}.style.${k} = '${v}';`)
      .join('\n');

    let bodySetup = '';
    if (el.type === 'input') {
      bodySetup = `  ${varName}.placeholder = '${el.placeholder || ''}';`;
    } else if (el.type === 'image') {
      bodySetup = `  ${varName}.src = '${el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}';`;
    } else if (el.type === 'progress') {
      bodySetup = `  ${varName}.className = 'progress-bar';\n  const barFill_${idx} = document.createElement('div');\n  barFill_${idx}.style.width = '${el.content || '60%'}';\n  barFill_${idx}.style.height = '100%';\n  barFill_${idx}.style.background = '#8b5cf6';\n  barFill_${idx}.style.borderRadius = '9999px';\n  ${varName}.appendChild(barFill_${idx});`;
    } else if (el.type === 'switch') {
      bodySetup = `  ${varName}.className = 'switch-toggle';\n  const pill_${idx} = document.createElement('div');\n  pill_${idx}.style.width = '36px';\n  pill_${idx}.style.height = '20px';\n  pill_${idx}.style.background = '#8b5cf6';\n  pill_${idx}.style.borderRadius = '9999px';\n  pill_${idx}.style.position = 'relative';\n  pill_${idx}.style.cursor = 'pointer';\n  const dot_${idx} = document.createElement('div');\n  dot_${idx}.style.width = '16px';\n  dot_${idx}.style.height = '16px';\n  dot_${idx}.style.background = 'white';\n  dot_${idx}.style.borderRadius = '50%';\n  dot_${idx}.style.position = 'absolute';\n  dot_${idx}.style.right = '2px';\n  dot_${idx}.style.top = '2px';\n  pill_${idx}.appendChild(dot_${idx});\n  const txt_${idx} = document.createElement('span');\n  txt_${idx}.innerText = '${el.content || 'Switch'}';\n  txt_${idx}.style.fontSize = '12px';\n  txt_${idx}.style.color = 'white';\n  ${varName}.appendChild(pill_${idx});\n  ${varName}.appendChild(txt_${idx});`;
    } else if (el.content) {
      bodySetup = `  ${varName}.innerText = '${el.content}';`;
    } else if (el.type === 'button') {
      bodySetup = `  ${varName}.innerText = 'Button';`;
    }

    return `  // Create ${el.name} (${el.type})\n  const ${varName} = document.createElement('${tag}');\n${styleLines}\n${bodySetup}\n  container.appendChild(${varName});`;
  }).join('\n\n');

  return `function createComponent() {
  // Create Main Container
  const container = document.createElement('div');
  container.className = 'component-container';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  container.style.boxSizing = 'border-box';
  container.style.borderRadius = '12px';
  container.style.border = '1px solid #27272a';
  container.style.width = '${settings.width}px';
  container.style.height = '${settings.height}px';
  container.style.backgroundColor = '${settings.backgroundColor || '#09090b'}';

  // Inject Styles for components
  const style = document.createElement('style');
  style.innerHTML = \`
    .component-container * {
      box-sizing: border-box;
    }${hasProgress ? `\n    .progress-bar {\n      background: #27272a;\n      border-radius: 9999px;\n      padding: 2px;\n    }` : ''}${hasSwitch ? `\n    .switch-toggle {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n    }` : ''}
  \`;
  document.head.appendChild(style);

  // Build Elements
${elementsJS}

  return container;
}

// Append component to DOM
document.body.appendChild(createComponent());`;
}

export function parseReactCodeToElements(code: string): { elements: NexoreMakeElement[]; settings: CanvasSettings; name: string } {
  const elements: NexoreMakeElement[] = [];
  const settings: CanvasSettings = {
    width: 800,
    height: 600,
    backgroundColor: '#09090b',
    gridVisible: true,
    zoom: 1,
  };

  try {
    // Try to find the container div styles
    const containerMatch = code.match(/style=\{\{\s*width:\s*'([^']+)',\s*height:\s*'([^']+)',\s*backgroundColor:\s*'([^']+)'/);
    if (containerMatch) {
      settings.width = parseInt(containerMatch[1], 10) || 800;
      settings.height = parseInt(containerMatch[2], 10) || 600;
      settings.backgroundColor = containerMatch[3];
    }

    // Regex match all elements
    const tagRegex = /<(button|input|div|span|hr|img|label|hr)\s+[^>]*style=\{\s*([^}]+)\s*\}[^>]*>(.*?)<\/\1>|<(input|hr|img|div|span)\s+[^>]*style=\{\s*([^}]+)\s*\}[^>]*\/>/gs;
    
    let match;
    let idx = 0;
    while ((match = tagRegex.exec(code)) !== null) {
      const isSelfClosing = match[4] !== undefined;
      const tag = isSelfClosing ? match[4] : match[1];
      const styleContent = isSelfClosing ? match[5] : match[2];
      const body = isSelfClosing ? '' : match[3].replace(/\{[^}]+\}/g, '').trim();

      // Extract style keys
      const styles: Record<string, any> = {};
      const pos = { x: 50, y: 50 };
      const size = { width: 100, height: 40 };
      let zIndex = idx + 1;

      const stylePropRegex = /(\w+):\s*(?:'([^']+)'|([\d\.-]+))/g;
      let styleMatch;
      while ((styleMatch = stylePropRegex.exec(styleContent)) !== null) {
        const key = styleMatch[1];
        const val = styleMatch[2] !== undefined ? styleMatch[2] : parseFloat(styleMatch[3]);
        
        if (key === 'left') pos.x = typeof val === 'string' ? parseInt(val, 10) || 50 : val;
        else if (key === 'top') pos.y = typeof val === 'string' ? parseInt(val, 10) || 50 : val;
        else if (key === 'width') size.width = typeof val === 'string' ? parseInt(val, 10) || 100 : val;
        else if (key === 'height') size.height = typeof val === 'string' ? parseInt(val, 10) || 40 : val;
        else if (key === 'zIndex') zIndex = Number(val) || zIndex;
        else {
          styles[key] = val;
        }
      }

      // Determine element type
      let type: NexoreMakeElement['type'] = 'container';
      if (tag === 'button') type = 'button';
      else if (tag === 'input') type = 'input';
      else if (tag === 'hr') type = 'divider';
      else if (tag === 'img') type = 'image';
      else {
        if (body && !body.includes('<')) {
          type = 'text';
        } else {
          type = 'container';
        }
      }

      let content = body;
      let placeholder = '';
      
      const placeholderMatch = code.substring(match.index, match.index + match[0].length).match(/placeholder="([^"]+)"/);
      if (placeholderMatch) {
        placeholder = placeholderMatch[1];
      }

      if (type === 'image') {
        const srcMatch = code.substring(match.index, match.index + match[0].length).match(/src="([^"]+)"/);
        if (srcMatch) content = srcMatch[1];
      }

      let animationPreset: NexoreMakeElement['animationPreset'] = 'none';
      if (code.substring(match.index, match.index + match[0].length).includes('animate-pulse')) animationPreset = 'pulse';
      else if (code.substring(match.index, match.index + match[0].length).includes('animate-bounce')) animationPreset = 'bounce';
      else if (code.substring(match.index, match.index + match[0].length).includes('animate-spin')) animationPreset = 'spin';

      elements.push({
        id: `el_${Math.random().toString(36).substr(2, 9)}`,
        type,
        name: `AI ${type} ${idx + 1}`,
        position: pos,
        size,
        zIndex,
        styles,
        content: content || undefined,
        placeholder: placeholder || undefined,
        animationPreset,
      });

      idx++;
    }
  } catch (err) {
    console.error('Failed to parse JSX back to elements:', err);
  }

  return { elements, settings, name: 'AI Component' };
}


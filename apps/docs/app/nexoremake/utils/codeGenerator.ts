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
  const elementsCode = sorted.map((el) => {
    const styles = getElementJSXStyle(el);
    const posStyles = {
      position: 'absolute',
      left: typeof el.position.x === 'number' ? `${el.position.x}px` : el.position.x,
      top: typeof el.position.y === 'number' ? `${el.position.y}px` : el.position.y,
      width: typeof el.size.width === 'number' ? `${el.size.width}px` : el.size.width,
      height: typeof el.size.height === 'number' ? `${el.size.height}px` : el.size.height,
      zIndex: el.zIndex,
      ...styles,
    };

    let animationClass = '';
    if (el.animationPreset && el.animationPreset !== 'none') {
      if (el.animationPreset === 'pulse') animationClass = ' animate-pulse';
      else if (el.animationPreset === 'bounce') animationClass = ' animate-bounce';
      else if (el.animationPreset === 'spin') animationClass = ' animate-spin';
    }

    const tag = getHTMLTag(el.type);
    const stylesStr = JSON.stringify(posStyles, null, 4)
      .replace(/"([^"]+)":/g, '$1:') // remove quotes from keys
      .replace(/\n/g, '\n    ');

    let body = '';
    if (el.type === 'button') {
      body = `\n      ${el.content || 'Button'}\n    `;
    } else if (el.type === 'text') {
      body = `\n      ${el.content || 'Text item'}\n    `;
    } else if (el.type === 'badge') {
      body = `\n      ${el.content || 'Badge'}\n    `;
    } else if (el.type === 'input') {
      return `  <input\n    type="text"\n    placeholder="${el.placeholder || ''}"\n    style={${stylesStr}}\n    className="outline-none focus:ring-2 focus:ring-violet-500/50 transition-all${animationClass}"\n  />`;
    } else if (el.type === 'divider') {
      return `  <hr style={${stylesStr}} className="border-none" />`;
    } else if (el.type === 'image') {
      return `  <img\n    src="${el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}"\n    alt="User element"\n    style={${stylesStr}}\n    className="object-cover${animationClass}"\n  />`;
    } else if (el.type === 'switch') {
      return `  <div style={${stylesStr}} className="flex items-center gap-2 cursor-pointer">\n    <div className="w-9 h-5 bg-violet-600 rounded-full p-0.5 transition-all flex items-center justify-end">\n      <div className="w-4 h-4 bg-white rounded-full shadow-md" />\n    </div>\n    <span className="text-xs">${el.content || 'Switch'}</span>\n  </div>`;
    } else if (el.type === 'checkbox') {
      return `  <label style={${stylesStr}} className="flex items-center gap-2 cursor-pointer">\n    <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-800 text-violet-600 focus:ring-violet-500 h-4 w-4" />\n    <span className="text-xs select-none">${el.content || 'Checkbox'}</span>\n  </label>`;
    } else if (el.type === 'progress') {
      return `  <div style={${stylesStr}} className="bg-zinc-800 rounded-full overflow-hidden p-0.5 flex items-center">\n    <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: '${el.content || '60%'}' }} />\n  </div>`;
    } else if (el.type === 'avatar') {
      return `  <div style={${stylesStr}} className="rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center font-semibold text-xs select-none">\n    ${el.content ? `<span className="text-white">${el.content}</span>` : `<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="w-full h-full object-cover" />`}\n  </div>`;
    } else if (el.type === 'icon') {
      return `  <div style={${stylesStr}} className="flex items-center justify-center">\n    {/* Icon: ${el.iconName || 'Sparkles'} */}\n    <span className="text-inherit">✦</span>\n  </div>`;
    } else {
      body = el.content ? `\n      ${el.content}\n    ` : '';
    }

    return `  <${tag}\n    style={${stylesStr}}\n    className="relative flex items-center justify-center transition-all overflow-hidden${animationClass}"\n  >${body}</${tag}>`;
  }).join('\n\n');

  return `import React from 'react';

export default function CustomComponent() {
  return (
    <div 
      className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-[#09090b] demo-grid-pattern shadow-2xl"
      style={{
        width: '${settings.width}px',
        height: '${settings.height}px',
        backgroundColor: '${settings.backgroundColor || '#09090b'}',
      }}
    >
    {/* Canvas Elements */}
    ${elementsCode.replace(/\n/g, '\n    ')}
    </div>
  );
}`;
}

export function generateHTMLCode(elements: NexoreMakeElement[], settings: CanvasSettings): string {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  
  // Compile global dynamic keyframe animations to inject inside <style>
  const uniqueAnimations = new Set(elements.map(el => el.animationPreset).filter(Boolean));
  let keyframes = '';
  if (uniqueAnimations.has('pulse')) {
    keyframes += `@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }\n`;
  }
  if (uniqueAnimations.has('bounce')) {
    keyframes += `@keyframes bounce { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); } }\n`;
  }
  if (uniqueAnimations.has('fade-in')) {
    keyframes += `@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }\n`;
  }
  if (uniqueAnimations.has('slide-in')) {
    keyframes += `@keyframes slideIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }\n`;
  }
  if (uniqueAnimations.has('glow')) {
    keyframes += `@keyframes glowGleam { from { box-shadow: 0 0 5px rgba(139, 92, 246, 0.2); } to { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); } }\n`;
  }
  if (uniqueAnimations.has('spin')) {
    keyframes += `@keyframes spinAround { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\n`;
  }

  const elementsHTML = sorted.map((el) => {
    const tag = getHTMLTag(el.type);
    
    // Compile inline styles
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
      return `  <div ${styleAttr} class="switch-toggle">\n    <div style="width: 36px; height: 20px; background: #8b5cf6; border-radius: 9999px; position: relative; cursor: pointer;">\n      <div style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; right: 2px; top: 2px;"></div>\n    </div>\n    <span style="font-size: 12px; font-family: sans-serif; color: white;">${el.content || 'Switch'}</span>\n  </div>`;
    }
    if (el.type === 'checkbox') {
      return `  <label ${styleAttr} style="display: flex; align-items: center; gap: 8px; cursor: pointer;">\n    <input type="checkbox" checked style="accent-color: #8b5cf6;" />\n    <span style="font-size: 12px; font-family: sans-serif; color: white;">${el.content || 'Checkbox'}</span>\n  </label>`;
    }
    if (el.type === 'avatar') {
      return `  <div ${styleAttr} class="avatar-circle">\n    ${el.content ? `<span style="color: white; font-weight: bold;">${el.content}</span>` : `<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`}\n  </div>`;
    }

    const content = el.content || (el.type === 'button' ? 'Button' : el.type === 'badge' ? 'Badge' : el.type === 'text' ? 'Text block' : '');
    return `  <${tag} ${styleAttr}>${content}</${tag}>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nexore Component</title>
  <style>
    .component-container {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      border-radius: 12px;
      border: 1px solid #27272a;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .component-container * {
      box-sizing: border-box;
    }
    .progress-bar {
      background: #27272a;
      border-radius: 9999px;
      padding: 2px;
    }
    .switch-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .avatar-circle {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    ${keyframes.replace(/\n/g, '\n    ')}
  </style>
</head>
<body style="background: #09090b; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">

  <div class="component-container" style="width: ${settings.width}px; height: ${settings.height}px; background-color: ${settings.backgroundColor || '#09090b'};">
    ${elementsHTML.replace(/\n/g, '\n  ')}
  </div>

</body>
</html>`;
}

export function generateVueCode(elements: NexoreMakeElement[], settings: CanvasSettings): string {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
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

    const animationCSS = getAnimationCSS(el);
    const styleAttr = `:style="{ ${styleBindings} }"`;

    if (el.type === 'input') {
      return `    <input type="text" placeholder="${el.placeholder || ''}" ${styleAttr} class="vue-input" />`;
    }
    if (el.type === 'divider') {
      return `    <hr ${styleAttr} class="vue-hr" />`;
    }
    if (el.type === 'image') {
      return `    <img src="${el.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'}" alt="Preview" ${styleAttr} class="vue-img" />`;
    }
    if (el.type === 'progress') {
      return `    <div ${styleAttr} class="vue-progress">\n      <div style="width: ${el.content || '60%'}; height: 100%; background: #8b5cf6; border-radius: 9999px;"></div>\n    </div>`;
    }
    if (el.type === 'switch') {
      return `    <div ${styleAttr} class="vue-switch" @click="isEnabled = !isEnabled">\n      <div :style="{ background: isEnabled ? '#8b5cf6' : '#3f3f46' }" style="width: 36px; height: 20px; border-radius: 9999px; position: relative; cursor: pointer; transition: background 0.2s;">\n        <div :style="{ left: isEnabled ? '18px' : '2px' }" style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; transition: left 0.2s;"></div>\n      </div>\n      <span>${el.content || 'Switch'}</span>\n    </div>`;
    }
    if (el.type === 'checkbox') {
      return `    <label ${styleAttr} class="vue-checkbox">\n      <input type="checkbox" v-model="isChecked" />\n      <span>${el.content || 'Checkbox'}</span>\n    </label>`;
    }
    if (el.type === 'avatar') {
      return `    <div ${styleAttr} class="vue-avatar">\n      ${el.content ? `<span>${el.content}</span>` : `<img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" />`}\n    </div>`;
    }

    const content = el.content || (el.type === 'button' ? 'Button' : el.type === 'badge' ? 'Badge' : el.type === 'text' ? 'Text' : '');
    return `    <${tag} ${styleAttr} class="vue-el-${el.type}">${content}</${tag}>`;
  }).join('\n');

  return `<template>
  <div 
    class="component-wrapper" 
    :style="{
      width: '${settings.width}px',
      height: '${settings.height}px',
      backgroundColor: '${settings.backgroundColor || '#09090b'}',
    }"
  >
${elementsHTML}
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isEnabled = ref(true);
const isChecked = ref(true);
</script>

<style scoped>
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
.vue-input {
  outline: none;
  border: 1px solid #3f3f46;
  background: #18181b;
  color: white;
  padding: 8px 12px;
}
.vue-hr {
  border: none;
  border-bottom: 1px solid #27272a;
  margin: 0;
}
.vue-img {
  object-fit: cover;
}
.vue-progress {
  background: #27272a;
  border-radius: 9999px;
  padding: 2px;
}
.vue-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-family: sans-serif;
  color: white;
}
.vue-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-family: sans-serif;
  color: white;
  cursor: pointer;
}
.vue-avatar {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #27272a;
}
.vue-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>`;
}

export function generateSvelteCode(elements: NexoreMakeElement[], settings: CanvasSettings): string {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
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
  }
  .progress-bar {
    background: #27272a;
    border-radius: 9999px;
    padding: 2px;
  }
  .switch-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-family: sans-serif;
    color: white;
  }
  .avatar-circle {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #27272a;
  }
  .avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>`;
}

export function generateAngularCode(elements: NexoreMakeElement[], settings: CanvasSettings): string {
  const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
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
    }
    .ng-progress {
      background: #27272a;
      border-radius: 9999px;
      padding: 2px;
    }
    .ng-switch {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-family: sans-serif;
      color: white;
    }
    .ng-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-family: sans-serif;
      color: white;
      cursor: pointer;
    }
    .ng-avatar {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: #27272a;
    }
    .ng-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
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
    }
    .progress-bar {
      background: #27272a;
      border-radius: 9999px;
      padding: 2px;
    }
    .switch-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }
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


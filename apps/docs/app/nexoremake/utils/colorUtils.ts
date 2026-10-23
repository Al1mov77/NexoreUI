export function getLuminance(colorStr?: string): number | null {
  if (!colorStr) return null;
  const str = colorStr.trim().toLowerCase();
  if (
    str === 'transparent' ||
    str === 'inherit' ||
    str === 'initial' ||
    str === 'rgba(0, 0, 0, 0)' ||
    str === 'rgba(0,0,0,0)'
  ) {
    return null;
  }

  // Hex: #fff, #ffffff, #fafafa
  if (str.startsWith('#')) {
    let hex = str.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return 0.299 * r + 0.587 * g + 0.114 * b;
    }
  }

  // rgb / rgba
  const rgbMatch = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10) / 255;
    const g = parseInt(rgbMatch[2], 10) / 255;
    const b = parseInt(rgbMatch[3], 10) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // Named light colors
  if (
    [
      'white',
      '#fff',
      '#ffffff',
      '#fafafa',
      '#f4f4f5',
      '#e4e4e7',
      '#fbfbfb',
      '#f9fafb',
      '#f3f4f6',
      '#f5f5f5',
    ].includes(str)
  ) {
    return 1;
  }

  // Named dark colors
  if (
    [
      'black',
      '#000',
      '#000000',
      '#09090b',
      '#18181b',
      '#27272a',
      '#121215',
      '#171717',
      '#202024',
      '#0d0d10',
    ].includes(str)
  ) {
    return 0;
  }

  return null;
}

export function isLightColor(colorStr?: string): boolean {
  if (!colorStr) return false;
  const str = colorStr.trim().toLowerCase();
  if (
    [
      'white',
      '#fff',
      '#ffffff',
      '#fafafa',
      '#f4f4f5',
      '#e4e4e7',
      '#fbfbfb',
      '#f9fafb',
      '#f3f4f6',
      '#f5f5f5',
    ].includes(str)
  ) {
    return true;
  }
  const lum = getLuminance(str);
  return lum !== null && lum >= 0.5;
}

export function isDarkColor(colorStr?: string): boolean {
  if (!colorStr) return false;
  const str = colorStr.trim().toLowerCase();
  if (
    [
      'black',
      '#000',
      '#000000',
      '#09090b',
      '#18181b',
      '#27272a',
      '#121215',
      '#171717',
      '#202024',
      '#0d0d10',
      '#1c1917',
    ].includes(str)
  ) {
    return true;
  }
  const lum = getLuminance(str);
  return lum !== null && lum < 0.5;
}

export function getContrastTextColor(
  bgColor?: string,
  fallbackLight = '#fafafa',
  fallbackDark = '#09090b'
): string {
  if (!bgColor) return fallbackDark;
  return isLightColor(bgColor) ? fallbackDark : fallbackLight;
}

export function adaptElementForTheme(elementProps: any, isLight: boolean) {
  if (!elementProps) return elementProps;
  if (!isLight) return elementProps;

  const styles = { ...elementProps.styles };
  const type = elementProps.type;

  switch (type) {
    case 'button':
      styles.backgroundColor = '#18181b';
      styles.color = '#ffffff';
      styles.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.08)';
      break;

    case 'card':
    case 'flex':
    case 'grid':
    case 'container':
      styles.backgroundColor = '#ffffff';
      styles.borderColor = '#e4e4e7';
      styles.color = '#09090b';
      styles.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
      break;

    case 'input':
    case 'textarea':
    case 'select':
    case 'tag-input':
    case 'otp-input':
      styles.backgroundColor = '#ffffff';
      styles.borderColor = '#e4e4e7';
      styles.color = '#09090b';
      break;

    case 'text':
    case 'icon':
    case 'switch':
    case 'checkbox':
    case 'stepper':
    case 'slider':
      styles.color = '#09090b';
      break;

    case 'badge':
    case 'avatar':
    case 'kbd':
    case 'skeleton':
    case 'progress':
      styles.backgroundColor = '#f4f4f5';
      styles.color = '#18181b';
      if (styles.borderColor) styles.borderColor = '#e4e4e7';
      break;

    case 'divider':
      styles.backgroundColor = '#e4e4e7';
      break;

    case 'file-upload':
      styles.backgroundColor = '#fafafa';
      styles.borderColor = '#d4d4d8';
      styles.color = '#09090b';
      break;

    case 'scroll-area':
      styles.backgroundColor = '#ffffff';
      styles.borderColor = '#e4e4e7';
      styles.color = '#71717a';
      break;

    default:
      if (styles.backgroundColor && isDarkColor(styles.backgroundColor)) {
        styles.backgroundColor = '#ffffff';
      }
      if (styles.borderColor && isDarkColor(styles.borderColor)) {
        styles.borderColor = '#e4e4e7';
      }
      if (styles.color && isLightColor(styles.color)) {
        styles.color = '#09090b';
      }
      break;
  }

  return {
    ...elementProps,
    styles,
  };
}

/**
 * Safe UTF-8 Base64 encoding and decoding for NexoreMake canvas state and share links.
 * Works seamlessly across Cyrillic, emojis, and special characters without URIErrors.
 */

export function encodeStateToBase64(data: any): string {
  try {
    const jsonStr = JSON.stringify(data);
    if (typeof TextEncoder !== 'undefined') {
      const bytes = new TextEncoder().encode(jsonStr);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }
    return btoa(unescape(encodeURIComponent(jsonStr)));
  } catch (err) {
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    } catch {
      return '';
    }
  }
}

export function decodeStateFromBase64<T = any>(hash: string): T | null {
  if (!hash) return null;
  try {
    const cleaned = hash.startsWith('#') ? hash.slice(1) : hash;
    if (typeof TextDecoder !== 'undefined') {
      const binary = atob(cleaned);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const jsonStr = new TextDecoder().decode(bytes);
      return JSON.parse(jsonStr) as T;
    }
    return JSON.parse(decodeURIComponent(escape(atob(cleaned)))) as T;
  } catch (err) {
    try {
      const cleaned = hash.startsWith('#') ? hash.slice(1) : hash;
      return JSON.parse(decodeURIComponent(escape(atob(cleaned)))) as T;
    } catch {
      return null;
    }
  }
}

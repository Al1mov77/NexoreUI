'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Trash2, 
  Code, 
  ExternalLink, 
  Share2, 
  Check, 
  Copy, 
  Heart, 
  FolderHeart 
} from 'lucide-react';
import { FavoriteItem, CanvasSettings, NexoreMakeElement } from '../types';
import { 
  generateReactCode, 
  generateHTMLCode, 
  generateVueCode, 
  generateSvelteCode, 
  generateAngularCode, 
  generateVanillaCode 
} from '../utils/codeGenerator';

export default function NexoreMakeFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<Record<string, 'react' | 'html' | 'vue' | 'svelte' | 'angular' | 'vanilla'>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nexore_make_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
    }
  }, []);

  const handleDelete = (id: string) => {
    try {
      const updated = favorites.filter((fav) => fav.id !== id);
      setFavorites(updated);
      localStorage.setItem('nexore_make_favorites', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete favorite:', e);
    }
  };

  const getFormat = (favId: string): 'react' | 'html' | 'vue' | 'svelte' | 'angular' | 'vanilla' => {
    return activeFormat[favId] || 'react';
  };

  const handleCopyCode = (fav: FavoriteItem) => {
    try {
      const data = JSON.parse(fav.projectData);
      const elements: NexoreMakeElement[] = data.elements;
      const settings: CanvasSettings = data.canvasSettings;
      const format = getFormat(fav.id);
      
      let code = '';
      if (format === 'react') code = generateReactCode(elements, settings);
      else if (format === 'html') code = generateHTMLCode(elements, settings);
      else if (format === 'vue') code = generateVueCode(elements, settings);
      else if (format === 'svelte') code = generateSvelteCode(elements, settings);
      else if (format === 'angular') code = generateAngularCode(elements, settings);
      else if (format === 'vanilla') code = generateVanillaCode(elements, settings);

      navigator.clipboard.writeText(code);
      setCopiedId(fav.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error('Failed to generate/copy code:', e);
    }
  };

  const handleCopyShareLink = (fav: FavoriteItem) => {
    try {
      const data = JSON.parse(fav.projectData);
      const elements = data.elements;
      const canvasSettings = data.canvasSettings;
      const projectName = data.projectName;
      
      const jsonStr = JSON.stringify({ elements, canvasSettings, projectName });
      const hash = btoa(unescape(encodeURIComponent(jsonStr)));
      
      const randomCode = 'Q' + Math.floor(1000 + Math.random() * 9000);
      const url = `${window.location.origin}/nexoremake/${randomCode}#${hash}`;
      
      navigator.clipboard.writeText(url);
      setCopiedLink(fav.id);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (e) {
      console.error('Failed to copy share link:', e);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#030303] text-white p-6 md:p-12 select-none">
      
      {/* Header breadcrumb */}
      <div className="max-w-6xl mx-auto space-y-4 mb-10">
        <Link 
          href="/nexoremake"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Maker</span>
        </Link>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
              <span>Saved Masterpieces</span>
            </h1>
            <p className="text-xs text-zinc-500">
              Browse, duplicate, or copy code for components you have designed and saved.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-6xl mx-auto">
        {favorites.length === 0 ? (
          <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-16 flex flex-col items-center justify-center text-center">
            <FolderHeart className="h-10 w-10 text-zinc-700 animate-pulse mb-3" />
            <h3 className="text-sm font-semibold text-zinc-300">No masterpieces saved</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Save your custom components in the visual builder using the heart icon to list them here.
            </p>
            <Link
              href="/nexoremake"
              className="mt-5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all"
            >
              Start Creating
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((fav) => {
              const format = getFormat(fav.id);
              let hash = '';
              try {
                const parsed = JSON.parse(fav.projectData);
                const jsonStr = JSON.stringify({
                  elements: parsed.elements,
                  canvasSettings: parsed.canvasSettings,
                  projectName: parsed.projectName || fav.name
                });
                hash = btoa(unescape(encodeURIComponent(jsonStr)));
              } catch {}

              return (
                <div 
                  key={fav.id}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition-all flex flex-col justify-between gap-4"
                >
                  
                  {/* Top header details */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-200">{fav.name}</h3>
                      <span className="text-[9px] text-zinc-600 block mt-0.5">
                        Saved: {new Date(fav.savedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(fav.id)}
                      className="p-1 text-zinc-600 hover:text-red-400 hover:bg-zinc-900 rounded cursor-pointer transition-colors"
                      title="Delete Masterpiece"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Component mini visualizer skeleton preview */}
                  <div className="h-28 bg-[#030303] border border-zinc-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="text-[10px] text-zinc-600 select-none flex items-center gap-1 font-mono">
                      <span>Live Preview available in Editor</span>
                    </div>
                  </div>

                  {/* Format copy select */}
                  <div className="flex items-center gap-2">
                    <select
                      value={format}
                      onChange={(e) => setActiveFormat((prev) => ({ ...prev, [fav.id]: e.target.value as any }))}
                      className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 rounded px-2.5 py-1.5 outline-none hover:text-zinc-200 transition-colors flex-1"
                    >
                      <option value="react">React / TSX</option>
                      <option value="html">HTML / CSS</option>
                      <option value="vue">Vue 3 SFC</option>
                      <option value="svelte">Svelte</option>
                      <option value="angular">Angular</option>
                      <option value="vanilla">Vanilla JS</option>
                    </select>
                    
                    <button
                      onClick={() => handleCopyCode(fav)}
                      className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg flex items-center justify-center gap-1 text-[10px] font-semibold cursor-pointer select-none transition-colors"
                    >
                      {copiedId === fav.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action link triggers */}
                  <div className="flex items-center gap-2 border-t border-zinc-900/60 pt-3 mt-1 shrink-0 select-none">
                    <button
                      onClick={() => handleCopyShareLink(fav)}
                      className="flex-1 py-1.5 rounded bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedLink === fav.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Link Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3 w-3" />
                          <span>Share Link</span>
                        </>
                      )}
                    </button>
                    
                    <Link
                      href={`/nexoremake#${hash}`}
                      className="flex-1 py-1.5 rounded bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 hover:border-violet-500/40 text-[10px] font-semibold text-violet-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Edit in Maker</span>
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { CanvasSettings, NexoreMakeElement, FavoriteItem } from '../types';

interface MakeFavoriteButtonProps {
  elements: NexoreMakeElement[];
  canvasSettings: CanvasSettings;
  projectName: string;
}

export default function MakeFavoriteButton({
  elements,
  canvasSettings,
  projectName,
}: MakeFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Generate unique signature for checking favorites list
  const getProjectSignature = () => {
    return JSON.stringify({ elements, canvasSettings });
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nexore_make_favorites');
      if (stored) {
        const list: FavoriteItem[] = JSON.parse(stored);
        // Find if this project content is already favorited
        const signature = getProjectSignature();
        const found = list.some((item) => {
          try {
            const data = JSON.parse(item.projectData);
            return JSON.stringify({ elements: data.elements, canvasSettings: data.canvasSettings }) === signature;
          } catch {
            return false;
          }
        });
        setIsFavorite(found);
      }
    } catch (e) {
      console.error('Failed to parse favorites:', e);
    }
  }, [elements, canvasSettings]);

  const handleToggleFavorite = () => {
    try {
      const stored = localStorage.getItem('nexore_make_favorites');
      let list: FavoriteItem[] = stored ? JSON.parse(stored) : [];

      const signature = getProjectSignature();
      const existingIdx = list.findIndex((item) => {
        try {
          const data = JSON.parse(item.projectData);
          return JSON.stringify({ elements: data.elements, canvasSettings: data.canvasSettings }) === signature;
        } catch {
          return false;
        }
      });

      if (existingIdx > -1) {
        // Remove from favorites
        list.splice(existingIdx, 1);
        setIsFavorite(false);
      } else {
        // Add to favorites
        const projectData = JSON.stringify({ elements, canvasSettings, projectName });
        const newItem: FavoriteItem = {
          id: 'fav_' + Math.random().toString(36).substr(2, 9),
          name: projectName || 'Untitled Element',
          preview: '', // simple placeholder
          projectData,
          savedAt: new Date().toISOString(),
        };
        list.push(newItem);
        setIsFavorite(true);
      }

      localStorage.setItem('nexore_make_favorites', JSON.stringify(list));
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer select-none active:scale-90 ${
        isFavorite
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
      }`}
      title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
    </button>
  );
}
export { MakeFavoriteButton };
export type { MakeFavoriteButtonProps };

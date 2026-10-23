import React, { useState, useEffect, useMemo } from 'react';
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
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  const projectFingerprint = useMemo(() => {
    const ids = elements.map((el) => `${el.id}:${el.type}`).join(',');
    return `${projectName}::${elements.length}::${ids}`;
  }, [elements, projectName]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nexore_make_favorites');
      if (!stored) {
        setFavoriteId(null);
        return;
      }
      const list: FavoriteItem[] = JSON.parse(stored);
      const match = list.find((item) => {
        if (item.name === projectName && item.projectData) {
          try {
            const parsed = JSON.parse(item.projectData);
            if (Array.isArray(parsed.elements) && parsed.elements.length === elements.length) {
              const ids = parsed.elements
                .map((el: NexoreMakeElement) => `${el.id}:${el.type}`)
                .join(',');
              return `${item.name}::${parsed.elements.length}::${ids}` === projectFingerprint;
            }
          } catch {
            return false;
          }
        }
        return false;
      });
      setFavoriteId(match ? match.id : null);
    } catch {
      setFavoriteId(null);
    }
  }, [projectFingerprint, projectName, elements.length]);

  const handleToggleFavorite = () => {
    try {
      const stored = localStorage.getItem('nexore_make_favorites');
      const list: FavoriteItem[] = stored ? JSON.parse(stored) : [];

      if (favoriteId) {
        const nextList = list.filter((item) => item.id !== favoriteId);
        localStorage.setItem('nexore_make_favorites', JSON.stringify(nextList));
        setFavoriteId(null);
      } else {
        const newId = 'fav_' + Math.random().toString(36).substring(2, 11);
        const projectData = JSON.stringify({ elements, canvasSettings, projectName });
        const newItem: FavoriteItem = {
          id: newId,
          name: projectName || 'Untitled Component',
          projectData,
          savedAt: new Date().toISOString(),
        };
        list.push(newItem);
        localStorage.setItem('nexore_make_favorites', JSON.stringify(list));
        setFavoriteId(newId);
      }
    } catch {
      // Ignore storage quota errors safely
    }
  };

  const isFavorite = favoriteId !== null;

  return (
    <button
      type="button"
      onClick={handleToggleFavorite}
      className={`p-2 rounded-lg border flex items-center justify-center transition-colors cursor-pointer select-none active:scale-95 ${
        isFavorite
          ? 'text-destructive border-destructive/40 bg-destructive/10'
          : 'text-muted-foreground hover:text-foreground border-border bg-muted/40 hover:bg-muted'
      }`}
      title={isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
}
export { MakeFavoriteButton };
export type { MakeFavoriteButtonProps };

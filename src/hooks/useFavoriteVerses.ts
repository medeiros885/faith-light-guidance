import { useState, useCallback } from "react";
import type { FavoriteVerse } from "@/data/bible/types";

const STORAGE_KEY = "caminho-vivo-favorites";

function loadFavorites(): FavoriteVerse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavoriteVerses() {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>(loadFavorites);

  const isFavorite = useCallback(
    (bookId: string, chapter: number, verse: number) =>
      favorites.some(
        (f) => f.bookId === bookId && f.chapter === chapter && f.verse === verse
      ),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (fav: Omit<FavoriteVerse, "savedAt">) => {
      setFavorites((prev) => {
        const exists = prev.some(
          (f) =>
            f.bookId === fav.bookId &&
            f.chapter === fav.chapter &&
            f.verse === fav.verse
        );
        const next = exists
          ? prev.filter(
              (f) =>
                !(
                  f.bookId === fav.bookId &&
                  f.chapter === fav.chapter &&
                  f.verse === fav.verse
                )
            )
          : [...prev, { ...fav, savedAt: Date.now() }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  return { favorites, isFavorite, toggleFavorite };
}

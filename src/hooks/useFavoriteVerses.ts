import { useState, useCallback, useMemo } from "react";
import type { FavoriteVerse } from "@/data/bible/types";

const STORAGE_KEY = "caminho-vivo-favorites";

function getFavoriteKey(bookId: string, chapter: number, verse: number) {
  return `${bookId}-${chapter}-${verse}`;
}

function isValidFavoriteVerse(item: unknown): item is FavoriteVerse {
  if (!item || typeof item !== "object") return false;

  const value = item as Record<string, unknown>;

  return (
    typeof value.bookId === "string" &&
    typeof value.bookName === "string" &&
    typeof value.chapter === "number" &&
    Number.isFinite(value.chapter) &&
    typeof value.verse === "number" &&
    Number.isFinite(value.verse) &&
    typeof value.text === "string" &&
    typeof value.savedAt === "number" &&
    Number.isFinite(value.savedAt)
  );
}

function safeSortFavorites(items: FavoriteVerse[]): FavoriteVerse[] {
  return [...items].sort((a, b) => b.savedAt - a.savedAt);
}

function dedupeFavorites(items: FavoriteVerse[]): FavoriteVerse[] {
  const uniqueMap = new Map<string, FavoriteVerse>();

  for (const fav of items) {
    const key = getFavoriteKey(fav.bookId, fav.chapter, fav.verse);
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, fav);
    }
  }

  return Array.from(uniqueMap.values());
}

function loadFavorites(): FavoriteVerse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const valid = parsed.filter(isValidFavoriteVerse);
    return safeSortFavorites(dedupeFavorites(valid));
  } catch {
    return [];
  }
}

function persistFavorites(favorites: FavoriteVerse[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // ignore
  }
}

export function useFavoriteVerses() {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>(() => loadFavorites());

  const favoriteCount = favorites.length;

  const favoriteKeys = useMemo(() => {
    return new Set(
      favorites.map((fav) => getFavoriteKey(fav.bookId, fav.chapter, fav.verse))
    );
  }, [favorites]);

  const isFavorite = useCallback(
    (bookId: string, chapter: number, verse: number) =>
      favoriteKeys.has(getFavoriteKey(bookId, chapter, verse)),
    [favoriteKeys]
  );

  const toggleFavorite = useCallback(
    (fav: Omit<FavoriteVerse, "savedAt">) => {
      setFavorites((prev) => {
        const key = getFavoriteKey(fav.bookId, fav.chapter, fav.verse);
        const exists = prev.some(
          (item) => getFavoriteKey(item.bookId, item.chapter, item.verse) === key
        );

        const next = exists
          ? prev.filter(
              (item) =>
                getFavoriteKey(item.bookId, item.chapter, item.verse) !== key
            )
          : safeSortFavorites([
              {
                ...fav,
                savedAt: Date.now(),
              },
              ...prev.filter(
                (item) =>
                  getFavoriteKey(item.bookId, item.chapter, item.verse) !== key
              ),
            ]);

        persistFavorites(next);
        return next;
      });
    },
    []
  );

  const removeFavorite = useCallback(
    (bookId: string, chapter: number, verse: number) => {
      setFavorites((prev) => {
        const key = getFavoriteKey(bookId, chapter, verse);
        const next = prev.filter(
          (item) => getFavoriteKey(item.bookId, item.chapter, item.verse) !== key
        );
        persistFavorites(next);
        return next;
      });
    },
    []
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    persistFavorites([]);
  }, []);

  return {
    favorites,
    favoriteCount,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  };
}
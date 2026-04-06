import type { BibleBook, BibleBookMeta } from "./types";

type BibleSearchResult = {
  bookName: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
};

let indexCache: BibleBookMeta[] | null = null;
let indexPromise: Promise<BibleBookMeta[]> | null = null;

const bookCache = new Map<string, BibleBook>();
const bookPromiseCache = new Map<string, Promise<BibleBook>>();

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Erro ao carregar recurso: ${url} (${res.status})`);
  }

  return (await res.json()) as T;
}

/** Load lightweight book index (all 66 books) */
export async function loadBibleIndex(): Promise<BibleBookMeta[]> {
  if (indexCache) return indexCache;
  if (indexPromise) return indexPromise;

  indexPromise = fetchJSON<BibleBookMeta[]>("/bible/index.json")
    .then((data) => {
      indexCache = data;
      return data;
    })
    .finally(() => {
      indexPromise = null;
    });

  return indexPromise;
}

/** Load a single book with all chapters/verses on demand */
export async function loadBook(bookId: string): Promise<BibleBook> {
  if (bookCache.has(bookId)) {
    return bookCache.get(bookId)!;
  }

  if (bookPromiseCache.has(bookId)) {
    return bookPromiseCache.get(bookId)!;
  }

  const promise = fetchJSON<BibleBook>(`/bible/${bookId}.json`)
    .then((book) => {
      bookCache.set(bookId, book);
      return book;
    })
    .finally(() => {
      bookPromiseCache.delete(bookId);
    });

  bookPromiseCache.set(bookId, promise);
  return promise;
}

/** Optional preload for smoother navigation */
export async function preloadBook(bookId: string): Promise<void> {
  try {
    await loadBook(bookId);
  } catch {
    // fail silently on preload
  }
}

/** Preload a small group of books */
export async function preloadBooks(bookIds: string[]): Promise<void> {
  await Promise.allSettled(bookIds.map((id) => preloadBook(id)));
}

/** Clear all caches if needed */
export function clearBibleCache() {
  indexCache = null;
  indexPromise = null;
  bookCache.clear();
  bookPromiseCache.clear();
}

/** Search across all books with normalized matching */
export async function searchBible(
  query: string,
  maxResults = 30
): Promise<BibleSearchResult[]> {
  const cleanQuery = normalizeText(query);

  if (!cleanQuery || cleanQuery.length < 2) {
    return [];
  }

  const results: BibleSearchResult[] = [];
  const index = await loadBibleIndex();

  for (const meta of index) {
    if (results.length >= maxResults) break;

    let book: BibleBook;

    try {
      book = await loadBook(meta.id);
    } catch {
      continue;
    }

    for (const ch of book.chapters) {
      if (results.length >= maxResults) break;

      for (const v of ch.verses) {
        const verseTextNormalized = normalizeText(v.text);

        if (verseTextNormalized.includes(cleanQuery)) {
          results.push({
            bookName: book.name,
            bookId: book.id,
            chapter: ch.number,
            verse: v.number,
            text: v.text,
          });

          if (results.length >= maxResults) break;
        }
      }
    }
  }

  return results;
}
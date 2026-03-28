import type { BibleBook, BibleBookMeta } from "./types";

let indexCache: BibleBookMeta[] | null = null;
const bookCache = new Map<string, BibleBook>();

/** Load lightweight book index (all 66 books, ~7KB) */
export async function loadBibleIndex(): Promise<BibleBookMeta[]> {
  if (indexCache) return indexCache;
  const res = await fetch("/bible/index.json");
  indexCache = await res.json();
  return indexCache!;
}

/** Load a single book with all chapters/verses on demand */
export async function loadBook(bookId: string): Promise<BibleBook> {
  if (bookCache.has(bookId)) return bookCache.get(bookId)!;
  const res = await fetch(`/bible/${bookId}.json`);
  const book: BibleBook = await res.json();
  bookCache.set(bookId, book);
  return book;
}

/** Search across loaded books (loads all books progressively) */
export async function searchBible(
  query: string,
  maxResults = 30
): Promise<{ bookName: string; bookId: string; chapter: number; verse: number; text: string }[]> {
  const q = query.toLowerCase();
  const results: { bookName: string; bookId: string; chapter: number; verse: number; text: string }[] = [];
  const index = await loadBibleIndex();

  for (const meta of index) {
    if (results.length >= maxResults) break;
    const book = await loadBook(meta.id);
    for (const ch of book.chapters) {
      for (const v of ch.verses) {
        if (v.text.toLowerCase().includes(q)) {
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
      if (results.length >= maxResults) break;
    }
  }
  return results;
}

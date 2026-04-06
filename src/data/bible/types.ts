export type BibleTestament = "old" | "new";
export type BibleVersion = "NVI" | "ARA" | "ARC";

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  number: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  id: string;
  name: string;
  abbrev: string;
  testament: BibleTestament;
  chapters: BibleChapter[];
}

export interface BibleBookMeta {
  id: string;
  name: string;
  abbrev: string;
  testament: BibleTestament;
  chapterCount: number;
}

export interface FavoriteVerse {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  savedAt: number;
}

export interface BibleSearchResult {
  bookName: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleReference {
  bookId: string;
  bookName: string;
  chapter: number;
  verse?: number;
}

export interface BibleReadingSession {
  bookId: string;
  chapter: number;
  startedAt: number;
  lastReadAt: number;
}
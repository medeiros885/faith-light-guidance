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
  testament: "old" | "new";
  chapters: BibleChapter[];
}

export interface BibleBookMeta {
  id: string;
  name: string;
  abbrev: string;
  testament: "old" | "new";
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

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, BookOpen, Heart, X } from "lucide-react";
import { bibleBooks } from "@/data/bible/books";
import { useFavoriteVerses } from "@/hooks/useFavoriteVerses";
import BibleBookList from "./BibleBookList";
import BibleChapterView from "./BibleChapterView";
import BibleVerseView from "./BibleVerseView";
import BibleSearchResults from "./BibleSearchResults";
import BibleFavorites from "./BibleFavorites";
import type { BibleBook, BibleChapter } from "@/data/bible/types";

interface BibleReaderProps {
  onBack: () => void;
  onReflect: (verse: string) => void;
}

type View = "books" | "chapters" | "verses" | "search" | "favorites";

const BibleReader = ({ onBack, onReflect }: BibleReaderProps) => {
  const [view, setView] = useState<View>("books");
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<BibleChapter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const favoriteHook = useFavoriteVerses();

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const results: { bookName: string; bookId: string; chapter: number; verse: number; text: string }[] = [];
    for (const book of bibleBooks) {
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
          }
          if (results.length >= 30) break;
        }
        if (results.length >= 30) break;
      }
      if (results.length >= 30) break;
    }
    return results;
  }, [searchQuery]);

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    setView("chapters");
  };

  const handleChapterSelect = (chapter: BibleChapter) => {
    setSelectedChapter(chapter);
    setView("verses");
  };

  const handleViewBack = () => {
    if (view === "verses") {
      setView("chapters");
      setSelectedChapter(null);
    } else if (view === "chapters") {
      setView("books");
      setSelectedBook(null);
    } else if (view === "search" || view === "favorites") {
      setView("books");
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const headerTitle = () => {
    if (view === "verses" && selectedBook && selectedChapter)
      return `${selectedBook.name} ${selectedChapter.number}`;
    if (view === "chapters" && selectedBook) return selectedBook.name;
    if (view === "search") return "Buscar na Bíblia";
    if (view === "favorites") return "Versículos Favoritos";
    return "Bíblia";
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 border-b border-border/20 bg-background/92 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={view === "books" ? onBack : handleViewBack}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-sm font-semibold text-gold truncate">
              {headerTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (view === "favorites") {
                  setView("books");
                } else {
                  setView("favorites");
                }
              }}
              className={`rounded-full p-2 transition-all duration-200 ${
                view === "favorites"
                  ? "text-gold bg-gold/10"
                  : "text-muted-foreground/50 hover:text-foreground/70"
              }`}
            >
              <Heart size={18} fill={view === "favorites" ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => {
                if (showSearch) {
                  setShowSearch(false);
                  setSearchQuery("");
                  if (view === "search") setView("books");
                } else {
                  setShowSearch(true);
                  setView("search");
                }
              }}
              className={`rounded-full p-2 transition-all duration-200 ${
                showSearch
                  ? "text-gold bg-gold/10"
                  : "text-muted-foreground/50 hover:text-foreground/70"
              }`}
            >
              {showSearch ? <X size={18} /> : <Search size={18} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden px-4 pb-3"
            >
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por palavra ou versículo..."
                className="w-full rounded-xl input-field px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-4">
          <AnimatePresence mode="wait">
            {view === "books" && (
              <motion.div
                key="books"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
              >
                <BibleBookList onSelect={handleBookSelect} />
              </motion.div>
            )}

            {view === "chapters" && selectedBook && (
              <motion.div
                key="chapters"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
              >
                <BibleChapterView
                  book={selectedBook}
                  onSelect={handleChapterSelect}
                />
              </motion.div>
            )}

            {view === "verses" && selectedBook && selectedChapter && (
              <motion.div
                key="verses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
              >
                <BibleVerseView
                  book={selectedBook}
                  chapter={selectedChapter}
                  favoriteHook={favoriteHook}
                  onReflect={onReflect}
                />
              </motion.div>
            )}

            {view === "search" && (
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BibleSearchResults
                  query={searchQuery}
                  results={searchResults}
                  favoriteHook={favoriteHook}
                  onReflect={onReflect}
                />
              </motion.div>
            )}

            {view === "favorites" && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BibleFavorites
                  favoriteHook={favoriteHook}
                  onReflect={onReflect}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BibleReader;

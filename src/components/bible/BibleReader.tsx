import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Heart,
  X,
  Loader2,
  ChevronDown,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { loadBibleIndex, loadBook, searchBible } from "@/data/bible/loader";
import { useFavoriteVerses } from "@/hooks/useFavoriteVerses";
import BibleBookList from "./BibleBookList";
import BibleChapterView from "./BibleChapterView";
import BibleVerseView from "./BibleVerseView";
import BibleSearchResults from "./BibleSearchResults";
import BibleFavorites from "./BibleFavorites";
import type { BibleBook, BibleBookMeta, BibleChapter } from "@/data/bible/types";

interface BibleReaderProps {
  onBack: () => void;
  onReflect: (verse: string) => void;
}

type View = "books" | "chapters" | "verses" | "search" | "favorites";
type BibleVersion = "NVI" | "ARA" | "ARC";

const SUPPORTED_VERSION: BibleVersion = "NVI";

const BibleReader = ({ onBack, onReflect }: BibleReaderProps) => {
  const [view, setView] = useState<View>("books");
  const [bookIndex, setBookIndex] = useState<BibleBookMeta[]>([]);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<BibleChapter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [bibleVersion, setBibleVersion] = useState<BibleVersion>(SUPPORTED_VERSION);
  const [showVersionPicker, setShowVersionPicker] = useState(false);

  const favoriteHook = useFavoriteVerses();
  const versionPickerRef = useRef<HTMLDivElement>(null);

  // Carregar Índice Inicial
  useEffect(() => {
    loadBibleIndex()
      .then(setBookIndex)
      .catch(() => toast.error("Erro ao carregar os livros."));
  }, []);

  // Lógica de Busca Debounced
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await searchBible(query, 30);
        setSearchResults(results);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleBookSelect = useCallback(async (meta: BibleBookMeta) => {
    setIsLoadingBook(true);
    try {
      const book = await loadBook(meta.id);
      setSelectedBook(book);
      setView("chapters");
    } catch {
      toast.error("Não foi possível abrir este livro.");
    } finally {
      setIsLoadingBook(false);
    }
  }, []);

  const handleChapterSelect = (chapter: BibleChapter) => {
    setSelectedChapter(chapter);
    setView("verses");
  };

  const handleBackNavigation = () => {
    if (showSearch) { setShowSearch(false); setView("books"); return; }
    if (view === "verses") { setView("chapters"); return; }
    if (view === "chapters") { setView("books"); setSelectedBook(null); return; }
    if (view === "favorites" || view === "search") { setView("books"); return; }
    onBack();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER PREMIUM */}
      <header className="glass-premium z-50 border-b border-white/5 px-4 pt-4 pb-3">
        <div className="mx-auto max-w-lg flex items-center gap-3">
          <button 
            onClick={handleBackNavigation}
            className="p-2.5 rounded-full bg-white/5 text-white/70 active:scale-90 transition-all"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <motion.div 
              key={view + (selectedBook?.name || "")}
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="p-1 rounded-md bg-gold/10 text-gold">
                <BookOpen size={14} />
              </div>
              <h2 className="font-bold text-sm tracking-tight truncate">
                {view === "verses" ? `${selectedBook?.name} ${selectedChapter?.number}` : 
                 view === "chapters" ? selectedBook?.name : 
                 view === "favorites" ? "Favoritos" : "Bíblia Sagrada"}
              </h2>
            </motion.div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-0.5">
              {view === "books" ? "Antigo e Novo Testamento" : "Leitura Atenta"}
            </p>
          </div>

          <div className="flex gap-1">
            <button 
              onClick={() => setView(view === "favorites" ? "books" : "favorites")}
              className={`p-2.5 rounded-full transition-colors ${view === "favorites" ? 'text-gold bg-gold/10' : 'text-white/40'}`}
            >
              <Heart size={20} fill={view === "favorites" ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => { setShowSearch(!showSearch); setView(showSearch ? "books" : "search"); }}
              className={`p-2.5 rounded-full transition-colors ${showSearch ? 'text-gold bg-gold/10' : 'text-white/40'}`}
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* BARRA DE BUSCA EXPANSÍVEL */}
        <AnimatePresence>
          {showSearch && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mx-auto max-w-lg mt-3 overflow-hidden"
            >
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar na Palavra..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-gold/50 focus:ring-0 transition-all outline-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SELETOR DE VERSÃO */}
        <div className="mx-auto max-w-lg mt-3 flex items-center justify-between">
          <div className="relative" ref={versionPickerRef}>
            <button 
              onClick={() => setShowVersionPicker(!showVersionPicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/60 hover:bg-white/10"
            >
              VERSÃO: <span className="text-gold">{bibleVersion}</span>
              <ChevronDown size={12} />
            </button>

            <AnimatePresence>
              {showVersionPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 top-full mt-2 w-32 glass-premium border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                >
                  {["NVI", "ARA", "ARC"].map((v) => (
                    <button 
                      key={v}
                      onClick={() => { v === "NVI" ? setBibleVersion(v as BibleVersion) : toast.info("Em breve!"); setShowVersionPicker(false); }}
                      className={`w-full px-4 py-3 text-left text-xs font-bold transition-colors ${bibleVersion === v ? 'text-gold bg-gold/10' : 'text-white/40 hover:bg-white/5'}`}
                    >
                      {v}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-[10px] font-medium text-white/20 italic">A Palavra que transforma.</p>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL COM SCROLL */}
      <main className="flex-1 overflow-y-auto pb-10 no-scrollbar">
        <div className="mx-auto max-w-lg px-4 pt-6">
          <AnimatePresence mode="wait">
            {isLoadingBook ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={32} className="text-gold animate-spin" />
                <p className="text-sm text-white/40 font-medium">Preparando as Escrituras...</p>
              </motion.div>
            ) : view === "books" ? (
              <motion.div key="books" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <BibleBookList books={bookIndex} onSelect={handleBookSelect} />
              </motion.div>
            ) : view === "chapters" && selectedBook ? (
              <motion.div key="chapters" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <BibleChapterView book={selectedBook} onSelect={handleChapterSelect} />
              </motion.div>
            ) : view === "verses" && selectedBook && selectedChapter ? (
              <motion.div key="verses" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <BibleVerseView 
                  book={selectedBook} 
                  chapter={selectedChapter} 
                  favoriteHook={favoriteHook} 
                  onReflect={onReflect} 
                />
              </motion.div>
            ) : view === "search" ? (
              <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BibleSearchResults 
                  query={searchQuery} 
                  results={searchResults} 
                  isSearching={isSearching} 
                  favoriteHook={favoriteHook} 
                  onReflect={onReflect} 
                />
              </motion.div>
            ) : view === "favorites" && (
              <motion.div key="favorites" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BibleFavorites favoriteHook={favoriteHook} onReflect={onReflect} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* BACKGROUND DECORATIVO (OPCIONAL) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

export default BibleReader;

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Heart,
  X,
  Loader2,
  ChevronDown,
  BookOpen,
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

  const availableVersions = useMemo(
    () => [
      { id: "NVI" as BibleVersion, enabled: true, label: "NVI" },
      { id: "ARA" as BibleVersion, enabled: false, label: "ARA" },
      { id: "ARC" as BibleVersion, enabled: false, label: "ARC" },
    ],
    []
  );

  useEffect(() => {
    loadBibleIndex().then(setBookIndex);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timeout = setTimeout(async () => {
      const results = await searchBible(searchQuery.trim(), 30);
      setSearchResults(results);
      setIsSearching(false);
    }, 380);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const handleClose = () => setShowVersionPicker(false);
    if (showVersionPicker) {
      window.addEventListener("click", handleClose);
    }

    return () => window.removeEventListener("click", handleClose);
  }, [showVersionPicker]);

  const handleBookSelect = useCallback(async (meta: BibleBookMeta) => {
    try {
      setIsLoadingBook(true);
      const book = await loadBook(meta.id);
      setSelectedBook(book);
      setSelectedChapter(null);
      setView("chapters");
    } finally {
      setIsLoadingBook(false);
    }
  }, []);

  const handleChapterSelect = useCallback((chapter: BibleChapter) => {
    setSelectedChapter(chapter);
    setView("verses");
  }, []);

  const handleViewBack = useCallback(() => {
    if (view === "verses") {
      setView("chapters");
      setSelectedChapter(null);
      return;
    }

    if (view === "chapters") {
      setView("books");
      setSelectedBook(null);
      setSelectedChapter(null);
      return;
    }

    if (view === "search" || view === "favorites") {
      setView("books");
      setSearchQuery("");
      setShowSearch(false);
      return;
    }
  }, [view]);

  const handleToggleSearch = useCallback(() => {
    if (showSearch) {
      setShowSearch(false);
      setSearchQuery("");
      setSearchResults([]);
      if (view === "search") setView("books");
      return;
    }

    setShowSearch(true);
    setView("search");
    setShowVersionPicker(false);
  }, [showSearch, view]);

  const handleToggleFavorites = useCallback(() => {
    setShowVersionPicker(false);

    if (view === "favorites") {
      setView("books");
      return;
    }

    setView("favorites");
    setShowSearch(false);
    setSearchQuery("");
  }, [view]);

  const handleVersionSelect = useCallback((version: BibleVersion, enabled: boolean) => {
    if (!enabled) {
      toast.info(`Versão ${version} em breve!`);
      setShowVersionPicker(false);
      return;
    }

    setBibleVersion(version);
    setShowVersionPicker(false);
  }, []);

  const headerTitle = useMemo(() => {
    if (view === "verses" && selectedBook && selectedChapter) {
      return `${selectedBook.name} ${selectedChapter.number}`;
    }

    if (view === "chapters" && selectedBook) {
      return selectedBook.name;
    }

    if (view === "search") {
      return "Buscar na Bíblia";
    }

    if (view === "favorites") {
      return "Versículos Favoritos";
    }

    return "Bíblia";
  }, [view, selectedBook, selectedChapter]);

  const headerSubtitle = useMemo(() => {
    if (view === "books") return "Escolha um livro para começar";
    if (view === "chapters") return "Selecione o capítulo";
    if (view === "verses") return "Leitura e reflexão";
    if (view === "search") return "Pesquise palavras, frases ou referências";
    if (view === "favorites") return "Sua coleção de versículos salvos";
    return "";
  }, [view]);

  const showBackToApp = view === "books";

  return (
    <div className="relative z-[2] flex min-h-[100dvh] flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 border-b border-border/15 bg-background/78 backdrop-blur-2xl"
      >
        <div className="mx-auto max-w-lg px-4 pb-3 pt-3.5">
          <div className="flex items-center gap-3">
            <button
              onClick={showBackToApp ? onBack : handleViewBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-muted-foreground transition-all duration-200 hover:border-white/12 hover:bg-white/[0.05] hover:text-foreground"
              aria-label="Voltar"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200 shadow-[0_0_18px_rgba(96,165,250,0.12)]">
                  <BookOpen size={13} strokeWidth={1.8} />
                </div>
                <p className="truncate font-display text-sm font-semibold text-gold">
                  {headerTitle}
                </p>
              </div>
              <p className="mt-1 truncate pl-9 text-[11px] text-muted-foreground/55">
                {headerSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleFavorites}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                  view === "favorites"
                    ? "border-gold/15 bg-gold/10 text-gold"
                    : "border-white/8 bg-white/[0.03] text-muted-foreground/55 hover:border-white/12 hover:bg-white/[0.05] hover:text-foreground"
                }`}
                aria-label="Favoritos"
              >
                <Heart size={18} fill={view === "favorites" ? "currentColor" : "none"} />
              </button>

              <button
                onClick={handleToggleSearch}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                  showSearch
                    ? "border-gold/15 bg-gold/10 text-gold"
                    : "border-white/8 bg-white/[0.03] text-muted-foreground/55 hover:border-white/12 hover:bg-white/[0.05] hover:text-foreground"
                }`}
                aria-label={showSearch ? "Fechar busca" : "Abrir busca"}
              >
                {showSearch ? <X size={18} /> : <Search size={18} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -6 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <div className="relative">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                    />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por palavra, frase ou referência..."
                      className="input-field w-full rounded-2xl py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/35 focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Version picker */}
          <div className="relative pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowVersionPicker((prev) => !prev);
              }}
              className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-[11px] font-medium text-foreground/70 transition-all duration-200 hover:border-white/12 hover:bg-white/[0.05]"
            >
              <span className="text-foreground/65">Versão</span>
              <span className="font-semibold text-gold">{bibleVersion}</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  showVersionPicker ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {showVersionPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full z-30 mt-2 min-w-[160px] overflow-hidden rounded-2xl border border-border/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.035))] shadow-[0_16px_34px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
                >
                  <div className="p-1.5">
                    {availableVersions.map((version) => {
                      const isActive = version.id === bibleVersion;
                      return (
                        <button
                          key={version.id}
                          onClick={() => handleVersionSelect(version.id, version.enabled)}
                          className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[12px] transition-all duration-150 ${
                            isActive
                              ? "bg-gold/8 text-gold"
                              : version.enabled
                              ? "text-foreground/72 hover:bg-white/[0.04]"
                              : "text-muted-foreground/38 hover:bg-white/[0.025]"
                          }`}
                        >
                          <span className={isActive ? "font-semibold" : "font-medium"}>
                            {version.label}
                          </span>

                          {!version.enabled && (
                            <span className="rounded-full border border-white/6 bg-white/[0.03] px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground/36">
                              em breve
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoadingBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-background/58 backdrop-blur-md"
          >
            <div className="glass-card rounded-[24px] px-6 py-5 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gold/10 bg-gold/8">
                <Loader2 size={22} className="animate-spin text-gold/80" />
              </div>
              <p className="text-sm font-medium text-foreground/82">Abrindo livro...</p>
              <p className="mt-1 text-[11px] text-muted-foreground/48">
                Preparando sua leitura
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-4">
          <AnimatePresence mode="wait">
            {view === "books" && (
              <motion.div
                key="books"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.24 }}
              >
                <BibleBookList books={bookIndex} onSelect={handleBookSelect} />
              </motion.div>
            )}

            {view === "chapters" && selectedBook && (
              <motion.div
                key="chapters"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.24 }}
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
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.24 }}
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
                  isSearching={isSearching}
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
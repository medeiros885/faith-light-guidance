import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Copy, Share2, Sparkles, Check, BookOpenText } from "lucide-react";
import { toast } from "sonner";
import type { BibleBook, BibleChapter } from "@/data/bible/types";
import type { useFavoriteVerses } from "@/hooks/useFavoriteVerses";
import BibleReadingMode from "./BibleReadingMode";

interface BibleVerseViewProps {
  book: BibleBook;
  chapter: BibleChapter;
  favoriteHook: ReturnType<typeof useFavoriteVerses>;
  onReflect: (verse: string) => void;
}

const BibleVerseView = ({ book, chapter, favoriteHook, onReflect }: BibleVerseViewProps) => {
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [readingMode, setReadingMode] = useState(false);
  const { isFavorite, toggleFavorite } = favoriteHook;

  const handleCopy = async (verseNum: number, text: string) => {
    const ref = `${book.name} ${chapter.number}:${verseNum}`;
    const fullText = `"${text}" — ${ref}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedVerse(verseNum);
      toast.success("Versículo copiado! 📋");
      setTimeout(() => setCopiedVerse(null), 2000);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const handleShare = async (verseNum: number, text: string) => {
    const ref = `${book.name} ${chapter.number}:${verseNum}`;
    const fullText = `"${text}" — ${ref}\n\n📖 Caminho Vivo`;
    if (navigator.share) {
      try {
        await navigator.share({ text: fullText });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(fullText);
      toast.success("Texto copiado para compartilhar! 📤");
    }
  };

  const handleReflect = (verseNum: number, text: string) => {
    const ref = `${book.name} ${chapter.number}:${verseNum}`;
    onReflect(`Refletir sobre ${ref}: "${text}"`);
  };

  return (
    <>
      <AnimatePresence>
        {readingMode && (
          <BibleReadingMode
            book={book}
            chapter={chapter}
            onClose={() => setReadingMode(false)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {/* Reading mode toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setReadingMode(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl glass-card py-3 text-[12px] font-medium text-blue-calm/80 transition-all duration-200 hover:text-blue-calm mb-3"
        >
          <BookOpenText size={14} />
          Modo Leitura Imersivo
        </motion.button>

        {chapter.verses.map((verse, i) => {
          const isActive = activeVerse === verse.number;
          const isFav = isFavorite(book.id, chapter.number, verse.number);

          return (
            <motion.div
              key={verse.number}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02, duration: 0.3 }}
            >
              <button
                onClick={() => setActiveVerse(isActive ? null : verse.number)}
                className="w-full text-left py-2.5 px-2 rounded-lg transition-colors duration-200 hover:bg-secondary/30 group"
              >
                <span className="text-[11px] font-semibold text-gold/45 mr-1.5 align-top">
                  {verse.number}
                </span>
                <span className="text-[14px] leading-[1.8] text-foreground/82 group-hover:text-foreground transition-colors">
                  {verse.text}
                </span>
              </button>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5 pl-6 pb-3 pt-1">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => toggleFavorite({
                          bookId: book.id,
                          bookName: book.name,
                          chapter: chapter.number,
                          verse: verse.number,
                          text: verse.text,
                        })}
                        className={`rounded-full p-2.5 transition-all duration-200 ${
                          isFav
                            ? "text-gold bg-[hsl(var(--gold)/0.1)]"
                            : "text-muted-foreground/35 hover:text-gold/70 hover:bg-secondary/40"
                        }`}
                      >
                        <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleCopy(verse.number, verse.text)}
                        className="rounded-full p-2.5 text-muted-foreground/35 hover:text-foreground/70 hover:bg-secondary/40 transition-all duration-200"
                      >
                        {copiedVerse === verse.number ? (
                          <Check size={16} className="text-emerald-400" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleShare(verse.number, verse.text)}
                        className="rounded-full p-2.5 text-muted-foreground/35 hover:text-foreground/70 hover:bg-secondary/40 transition-all duration-200"
                      >
                        <Share2 size={16} />
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleReflect(verse.number, verse.text)}
                        className="ml-auto flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-medium text-blue-calm bg-[hsl(var(--blue-soft)/0.1)] hover:bg-[hsl(var(--blue-soft)/0.16)] transition-all duration-200"
                      >
                        <Sparkles size={12} />
                        Refletir com IA
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default BibleVerseView;

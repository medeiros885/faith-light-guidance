import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Copy,
  Share2,
  Sparkles,
  Check,
  BookOpenText,
  Quote,
  Wand2,
} from "lucide-react";
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

const BibleVerseView = ({
  book,
  chapter,
  favoriteHook,
  onReflect,
}: BibleVerseViewProps) => {
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
      setTimeout(() => setCopiedVerse(null), 1800);
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
      } catch {
        /* user cancelled */
      }
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

      <div className="space-y-4 pb-8">
        {/* Chapter hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[28px] px-5 py-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200 shadow-[0_0_18px_rgba(96,165,250,0.10)]">
              <Quote size={16} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-blue-100/58">
                Leitura bíblica
              </p>
              <h2 className="mt-1 font-display text-[20px] font-semibold text-foreground/94">
                {book.name} {chapter.number}
              </h2>
              <p className="mt-1 text-[12px] leading-5 text-muted-foreground/48">
                Toque em um versículo para abrir ações rápidas, salvar, copiar ou refletir.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gold/10 bg-gold/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold/72">
                  cap. {chapter.number}
                </span>
                <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/42">
                  {chapter.verses.length} versículos
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reading mode toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setReadingMode(true)}
          className="glass-card flex w-full items-center justify-center gap-2 rounded-[22px] py-3.5 text-[12px] font-medium text-blue-calm/85 transition-all duration-200 hover:text-blue-calm"
        >
          <BookOpenText size={15} />
          Modo leitura imersivo
        </motion.button>

        {/* Verse list */}
        <div className="space-y-2">
          {chapter.verses.map((verse, i) => {
            const isActive = activeVerse === verse.number;
            const isFav = isFavorite(book.id, chapter.number, verse.number);

            return (
              <motion.div
                key={verse.number}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.018, 0.32), duration: 0.26 }}
              >
                <div
                  className={`rounded-[22px] border transition-all duration-250 ${
                    isActive
                      ? "border-blue-300/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.03))] shadow-[0_14px_28px_rgba(0,0,0,0.18)]"
                      : "border-transparent bg-transparent"
                  }`}
                >
                  <button
                    onClick={() => setActiveVerse(isActive ? null : verse.number)}
                    className="group w-full rounded-[22px] px-3 py-3 text-left transition-colors duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-all duration-200 ${
                          isActive
                            ? "border-gold/16 bg-gold/10 text-gold"
                            : "border-white/8 bg-white/[0.03] text-gold/55 group-hover:text-gold/75"
                        }`}
                      >
                        {verse.number}
                      </div>

                      <p
                        className={`flex-1 text-[14px] leading-[1.95] transition-colors duration-200 ${
                          isActive
                            ? "text-foreground/92"
                            : "text-foreground/80 group-hover:text-foreground/92"
                        }`}
                      >
                        {verse.text}
                      </p>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pl-12">
                          <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  toggleFavorite({
                                    bookId: book.id,
                                    bookName: book.name,
                                    chapter: chapter.number,
                                    verse: verse.number,
                                    text: verse.text,
                                  })
                                }
                                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                                  isFav
                                    ? "border-gold/16 bg-gold/10 text-gold"
                                    : "border-white/8 bg-white/[0.03] text-muted-foreground/38 hover:border-gold/12 hover:bg-gold/6 hover:text-gold/75"
                                }`}
                                aria-label="Favoritar versículo"
                              >
                                <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                              </motion.button>

                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleCopy(verse.number, verse.text)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-muted-foreground/38 transition-all duration-200 hover:border-white/12 hover:text-foreground/72"
                                aria-label="Copiar versículo"
                              >
                                {copiedVerse === verse.number ? (
                                  <Check size={16} className="text-emerald-400" />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </motion.button>

                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleShare(verse.number, verse.text)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-muted-foreground/38 transition-all duration-200 hover:border-white/12 hover:text-foreground/72"
                                aria-label="Compartilhar versículo"
                              >
                                <Share2 size={16} />
                              </motion.button>

                              <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleReflect(verse.number, verse.text)}
                                className="ml-auto flex items-center gap-2 rounded-full border border-blue-300/10 bg-[linear-gradient(145deg,rgba(96,165,250,0.12),rgba(96,165,250,0.06))] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-calm transition-all duration-200 hover:border-blue-300/16 hover:bg-[linear-gradient(145deg,rgba(96,165,250,0.16),rgba(96,165,250,0.08))]"
                              >
                                <Wand2 size={12} />
                                Refletir com IA
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BibleVerseView;
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Copy,
  Share2,
  Check,
  BookOpenText,
  Quote,
  Wand2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type { BibleBook, BibleChapter } from "@/data/bible/types";
import type { useFavoriteVerses } from "@/hooks/useFavoriteVerses";

interface BibleVerseViewProps {
  book: BibleBook;
  chapter: BibleChapter;
  favoriteHook: ReturnType<typeof useFavoriteVerses>;
  onReflect: (verse: string) => void;
}

const BibleVerseView = ({ book, chapter, favoriteHook, onReflect }: BibleVerseViewProps) => {
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const { isFavorite, toggleFavorite } = favoriteHook;

  const buildVerseReference = (verseNum: number) => `${book.name} ${chapter.number}:${verseNum}`;

  const handleCopy = async (verseNum: number, text: string) => {
    const ref = buildVerseReference(verseNum);
    await navigator.clipboard.writeText(`"${text}" (${ref})`);
    setCopiedVerse(verseNum);
    toast.success("Copiado com sucesso");
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Imersivo */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="glass-premium rounded-[32px] p-6 border border-white/5 relative overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 opacity-5 rotate-12">
          <Quote size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60">Lendo Agora</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white leading-tight">
            {book.name} <span className="text-gold/80">{chapter.number}</span>
          </h2>
          <p className="text-xs text-white/40 mt-2 max-w-[220px]">
            Toque nos versículos para meditar profundamente em cada palavra.
          </p>
        </div>
      </motion.div>

      {/* Lista de Versículos */}
      <div className="space-y-3">
        {chapter.verses.map((verse, i) => {
          const isActive = activeVerse === verse.number;
          const isFav = isFavorite(book.id, chapter.number, verse.number);

          return (
            <motion.div
              key={verse.number}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`relative rounded-3xl transition-all duration-500 ${
                isActive ? 'bg-white/[0.04] border-white/10 ring-1 ring-gold/20' : 'bg-transparent border-transparent'
              } border`}
            >
              <button
                onClick={() => setActiveVerse(isActive ? null : verse.number)}
                className="w-full p-4 text-left group"
              >
                <div className="flex gap-4">
                  <span className={`text-[10px] font-black mt-1.5 transition-colors ${isActive ? 'text-gold' : 'text-white/20'}`}>
                    {verse.number}
                  </span>
                  <p className={`text-[15px] leading-[1.8] transition-all ${isActive ? 'text-white font-medium' : 'text-white/70 group-hover:text-white/90'}`}>
                    {verse.text}
                  </p>
                </div>
              </button>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="px-4 pb-4"
                  >
                    <div className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5">
                      <button 
                        onClick={() => toggleFavorite({ bookId: book.id, bookName: book.name, chapter: chapter.number, verse: verse.number, text: verse.text })}
                        className={`p-3 rounded-xl transition-colors ${isFav ? 'bg-gold/20 text-gold' : 'hover:bg-white/5 text-white/40'}`}
                      >
                        <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                      </button>

                      <button 
                        onClick={() => handleCopy(verse.number, verse.text)}
                        className="p-3 rounded-xl hover:bg-white/5 text-white/40 transition-colors"
                      >
                        {copiedVerse === verse.number ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                      </button>

                      <button 
                        onClick={() => onReflect(`Refletir sobre ${book.name} ${chapter.number}:${verse.number}: "${verse.text}"`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold py-3 rounded-xl transition-all active:scale-95"
                      >
                        <Wand2 size={16} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Refletir com IA</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BibleVerseView;

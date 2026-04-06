import { motion } from "framer-motion";
import { Hash, BookCopy, Sparkles, ChevronRight, Bookmark } from "lucide-react";
import type { BibleBook, BibleChapter } from "@/data/bible/types";

interface BibleChapterViewProps {
  book: BibleBook;
  onSelect: (chapter: BibleChapter) => void;
}

const BibleChapterView = ({ book, onSelect }: BibleChapterViewProps) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header do Livro Selecionado */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-premium relative overflow-hidden rounded-[32px] p-6 border border-white/5"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Bookmark size={80} className="text-gold rotate-12" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[9px] font-black uppercase tracking-[0.2em] text-gold">
              {book.testament === 'old' ? 'Antigo Testamento' : 'Novo Testamento'}
            </span>
          </div>

          <h2 className="text-3xl font-display font-bold text-white mb-2">
            {book.name}
          </h2>

          <p className="text-sm text-white/40 leading-relaxed max-w-[260px] mb-4">
            Mergulhe nos {book.chapters.length} capítulos de sabedoria contidos neste livro.
          </p>

          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <div className="flex items-center gap-1.5">
              <Hash size={12} className="text-gold" />
              <span>{book.chapters.length} Divisões</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-gold" />
              <span>Inspirado</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid de Capítulos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-white/30">
            Selecione o Capítulo
          </h3>
          <div className="h-[1px] flex-1 bg-white/5 ml-4" />
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
          {book.chapters.map((ch, i) => (
            <motion.button
              key={ch.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.01, 0.2) }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelect(ch)}
              className="group relative aspect-square flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] transition-all duration-300 hover:border-gold/30 hover:bg-gold/5"
            >
              <span className="text-lg font-display font-bold text-white/80 group-hover:text-gold transition-colors">
                {ch.number}
              </span>
              <span className="text-[7px] font-black uppercase tracking-tighter text-white/20 group-hover:text-gold/40 transition-colors">
                CAP
              </span>

              {/* Glow sutil no hover */}
              <div className="absolute inset-0 rounded-2xl bg-gold/0 group-hover:bg-gold/5 blur-xl transition-all" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BibleChapterView;

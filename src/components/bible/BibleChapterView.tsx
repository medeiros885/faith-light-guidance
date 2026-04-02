import { motion } from "framer-motion";
import { Hash, BookCopy, Sparkles } from "lucide-react";
import type { BibleBook, BibleChapter } from "@/data/bible/types";

interface BibleChapterViewProps {
  book: BibleBook;
  onSelect: (chapter: BibleChapter) => void;
}

const BibleChapterView = ({ book, onSelect }: BibleChapterViewProps) => {
  return (
    <div className="space-y-5 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[28px] px-5 py-4"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200 shadow-[0_0_18px_rgba(96,165,250,0.10)]">
            <BookCopy size={16} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-blue-100/58">
              Livro selecionado
            </p>
            <h2 className="mt-1 font-display text-[20px] font-semibold text-foreground/94">
              {book.name}
            </h2>
            <p className="mt-1 text-[12px] leading-5 text-muted-foreground/48">
              Escolha o capítulo para continuar sua leitura.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-gold/10 bg-gold/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold/72">
                {book.abbrev}
              </span>
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/42">
                {book.chapters.length} capítulos
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-gold/72">
            <Hash size={13} strokeWidth={1.8} />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/72">
            Capítulos
          </p>
        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/6 bg-white/[0.03] text-muted-foreground/28">
          <Sparkles size={12} strokeWidth={1.8} />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2.5">
        {book.chapters.map((ch, i) => (
          <motion.button
            key={ch.number}
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: Math.min(i * 0.018, 0.38), duration: 0.24 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onSelect(ch)}
            className="bible-chapter-btn group relative overflow-hidden rounded-[18px] py-3.5 text-center transition-all duration-250 hover:border-gold/18 hover:text-gold"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.045),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.04),transparent_30%)] opacity-80" />

            <div className="relative flex flex-col items-center justify-center gap-0.5">
              <span className="text-[15px] font-semibold text-foreground/80 transition-colors duration-200 group-hover:text-gold-light">
                {ch.number}
              </span>
              <span className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground/26">
                cap
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BibleChapterView;
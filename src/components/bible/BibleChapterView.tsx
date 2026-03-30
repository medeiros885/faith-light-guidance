import { motion } from "framer-motion";
import type { BibleBook, BibleChapter } from "@/data/bible/types";

interface BibleChapterViewProps {
  book: BibleBook;
  onSelect: (chapter: BibleChapter) => void;
}

const BibleChapterView = ({ book, onSelect }: BibleChapterViewProps) => {
  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <p className="font-display text-lg font-semibold text-foreground/90">{book.name}</p>
        <p className="text-[11px] text-muted-foreground/50">
          {book.chapters.length} capítulos
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2.5">
        {book.chapters.map((ch, i) => (
          <motion.button
            key={ch.number}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(i * 0.02, 0.6), duration: 0.25 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => onSelect(ch)}
            className="bible-chapter-btn rounded-xl py-3.5 text-center text-sm font-medium text-foreground/75 transition-all duration-200 hover:text-gold hover:border-gold/25"
          >
            {ch.number}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BibleChapterView;

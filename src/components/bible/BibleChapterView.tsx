import { motion } from "framer-motion";
import type { BibleBook, BibleChapter } from "@/data/bible/types";

interface BibleChapterViewProps {
  book: BibleBook;
  onSelect: (chapter: BibleChapter) => void;
}

const BibleChapterView = ({ book, onSelect }: BibleChapterViewProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground/60">
        Selecione um capítulo para ler
      </p>
      <div className="grid grid-cols-5 gap-2">
        {book.chapters.map((ch, i) => (
          <motion.button
            key={ch.number}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, duration: 0.25 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(ch)}
            className="glass-card rounded-xl py-3 text-center text-sm font-medium text-foreground/80 transition-all duration-200 hover:text-gold hover:border-gold/20"
          >
            {ch.number}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BibleChapterView;

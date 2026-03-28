import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { bibleBooks } from "@/data/bible/books";
import type { BibleBook } from "@/data/bible/types";

interface BibleBookListProps {
  onSelect: (book: BibleBook) => void;
}

const BibleBookList = ({ onSelect }: BibleBookListProps) => {
  const oldTestament = bibleBooks.filter((b) => b.testament === "old");
  const newTestament = bibleBooks.filter((b) => b.testament === "new");

  return (
    <div className="space-y-6">
      {/* Old Testament */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={14} className="text-gold/70" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gold/70">
            Antigo Testamento
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {oldTestament.map((book, i) => (
            <motion.button
              key={book.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(book)}
              className="glass-card rounded-xl px-3 py-3 text-left transition-all duration-300 hover:border-gold/20 group"
            >
              <span className="block text-[10px] font-medium text-gold/60 group-hover:text-gold/80 transition-colors">
                {book.abbrev}
              </span>
              <span className="block text-xs text-foreground/80 group-hover:text-foreground mt-0.5 leading-tight">
                {book.name}
              </span>
              <span className="block text-[10px] text-muted-foreground/40 mt-1">
                {book.chapters.length} cap.
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* New Testament */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={14} className="text-blue-calm/70" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-calm/70">
            Novo Testamento
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {newTestament.map((book, i) => (
            <motion.button
              key={book.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(book)}
              className="glass-card rounded-xl px-3 py-3 text-left transition-all duration-300 hover:border-blue-calm/20 group"
            >
              <span className="block text-[10px] font-medium text-blue-calm/60 group-hover:text-blue-calm/80 transition-colors">
                {book.abbrev}
              </span>
              <span className="block text-xs text-foreground/80 group-hover:text-foreground mt-0.5 leading-tight">
                {book.name}
              </span>
              <span className="block text-[10px] text-muted-foreground/40 mt-1">
                {book.chapters.length} cap.
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BibleBookList;

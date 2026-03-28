import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { BibleBookMeta } from "@/data/bible/types";

interface BibleBookListProps {
  books: BibleBookMeta[];
  onSelect: (book: BibleBookMeta) => void;
}

const BibleBookList = ({ books, onSelect }: BibleBookListProps) => {
  const oldTestament = books.filter((b) => b.testament === "old");
  const newTestament = books.filter((b) => b.testament === "new");

  const renderSection = (
    title: string,
    items: BibleBookMeta[],
    accentClass: string,
    iconClass: string
  ) => (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={14} className={iconClass} />
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${accentClass}`}>
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((book, i) => (
          <motion.button
            key={book.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.6), duration: 0.25 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(book)}
            className="glass-card rounded-xl px-3 py-3 text-left transition-all duration-300 hover:border-gold/20 group"
          >
            <span className="block text-[10px] font-medium text-gold/60 group-hover:text-gold/80 transition-colors">
              {book.abbrev}
            </span>
            <span className="block text-xs text-foreground/80 group-hover:text-foreground mt-0.5 leading-tight truncate">
              {book.name}
            </span>
            <span className="block text-[10px] text-muted-foreground/40 mt-1">
              {book.chapterCount} cap.
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {renderSection("Antigo Testamento", oldTestament, "text-gold/70", "text-gold/70")}
      {renderSection("Novo Testamento", newTestament, "text-blue-calm/70", "text-blue-calm/70")}
    </div>
  );
};

export default BibleBookList;

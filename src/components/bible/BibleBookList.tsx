import { useRef } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Flame, Star, Clock } from "lucide-react";
import type { BibleBookMeta } from "@/data/bible/types";

interface BibleBookListProps {
  books: BibleBookMeta[];
  onSelect: (book: BibleBookMeta) => void;
}

const popularBooks = ["gn", "sl", "pv", "mt", "jo", "rm", "ap"];
const quickAccessBooks = ["sl", "pv", "is", "mt", "jo", "rm", "fp", "tg"];

function HorizontalRow({
  title,
  icon,
  items,
  onSelect,
  accentClass,
}: {
  title: string;
  icon: React.ReactNode;
  items: BibleBookMeta[];
  onSelect: (b: BibleBookMeta) => void;
  accentClass: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className={`text-[11px] font-semibold uppercase tracking-wider ${accentClass}`}>
            {title}
          </h3>
        </div>
        <ChevronRight size={14} className="text-muted-foreground/30" />
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-1 px-1"
      >
        {items.map((book, i) => (
          <motion.button
            key={book.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(i * 0.04, 0.5), duration: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(book)}
            className="snap-start flex-shrink-0 w-[130px] bible-book-card rounded-2xl p-4 text-left transition-all duration-300 group"
          >
            <span className="block text-[10px] font-bold text-gold/50 group-hover:text-gold/70 uppercase tracking-wider transition-colors">
              {book.abbrev}
            </span>
            <span className="block text-[13px] font-medium text-foreground/85 group-hover:text-foreground mt-1.5 leading-tight">
              {book.name}
            </span>
            <span className="block text-[10px] text-muted-foreground/35 mt-2">
              {book.chapterCount} capítulos
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

const BibleBookList = ({ books, onSelect }: BibleBookListProps) => {
  const oldTestament = books.filter((b) => b.testament === "old");
  const newTestament = books.filter((b) => b.testament === "new");
  const popular = books.filter((b) => popularBooks.includes(b.id));
  const quickAccess = books.filter((b) => quickAccessBooks.includes(b.id));

  return (
    <div className="space-y-7 pb-8">
      <HorizontalRow
        title="Mais populares"
        icon={<Star size={13} className="text-gold/60" />}
        items={popular}
        onSelect={onSelect}
        accentClass="text-gold/70"
      />

      <HorizontalRow
        title="Acesso rápido"
        icon={<Flame size={13} className="text-[hsl(var(--blue-calm))]" />}
        items={quickAccess}
        onSelect={onSelect}
        accentClass="text-blue-calm"
      />

      <HorizontalRow
        title="Antigo Testamento"
        icon={<BookOpen size={13} className="text-gold/60" />}
        items={oldTestament}
        onSelect={onSelect}
        accentClass="text-gold/70"
      />

      <HorizontalRow
        title="Novo Testamento"
        icon={<BookOpen size={13} className="text-blue-calm" />}
        items={newTestament}
        onSelect={onSelect}
        accentClass="text-blue-calm"
      />
    </div>
  );
};

export default BibleBookList;

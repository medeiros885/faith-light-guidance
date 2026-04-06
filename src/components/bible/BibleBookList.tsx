import { useRef } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Flame,
  Star,
  Sparkles,
  LibraryBig,
} from "lucide-react";
import type { BibleBookMeta } from "@/data/bible/types";

interface BibleBookListProps {
  books: BibleBookMeta[];
  onSelect: (book: BibleBookMeta) => void;
}

const popularIds = ["gn", "sl", "pv", "mt", "jo", "rm", "ap"];
const quickIds = ["sl", "pv", "is", "mt", "jo", "rm", "fp", "tg"];

const SectionHeader = ({ title, icon, accent }: { title: string; icon: React.ReactNode; accent: string }) => (
  <div className="flex items-center justify-between px-1 mb-4">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl bg-white/5 border border-white/5 ${accent}`}>
        {icon}
      </div>
      <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${accent}`}>
        {title}
      </h3>
    </div>
    <div className="h-[1px] flex-1 bg-white/5 ml-4" />
  </div>
);

const BookCard = ({ book, onSelect, accent }: { book: BibleBookMeta; onSelect: (b: BibleBookMeta) => void; accent: 'gold' | 'blue' }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={() => onSelect(book)}
    className="group relative flex-shrink-0 w-[140px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] p-4 text-left transition-all hover:border-white/20"
  >
    {/* Efeito de Lombada de Livro */}
    <div className="absolute inset-y-0 left-0 w-[4px] bg-gradient-to-r from-black/20 to-transparent" />
    <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${accent === 'gold' ? 'from-gold/10' : 'from-blue-500/10'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

    <div className="h-full flex flex-col justify-between relative z-10">
      <div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${accent === 'gold' ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
          {book.abbrev}
        </span>
        <h4 className="mt-3 font-display text-[15px] font-bold leading-tight text-white/90 group-hover:text-white transition-colors">
          {book.name}
        </h4>
      </div>

      <div className="flex items-center justify-between text-[9px] font-bold text-white/20 uppercase tracking-widest">
        <span>{book.chapterCount} caps</span>
        <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </motion.button>
);

const HorizontalRow = ({ title, icon, items, onSelect, accent, colorClass }: any) => (
  <section className="mb-10">
    <SectionHeader title={title} icon={icon} accent={colorClass} />
    <div className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar snap-x">
      {items.map((book: any) => (
        <div key={book.id} className="snap-center">
          <BookCard book={book} onSelect={onSelect} accent={accent} />
        </div>
      ))}
    </div>
  </section>
);

const BibleBookList = ({ books, onSelect }: BibleBookListProps) => {
  const oldT = books.filter(b => b.testament === "old");
  const newT = books.filter(b => b.testament === "new");
  const popular = books.filter(b => popularIds.includes(b.id));

  return (
    <div className="pb-20">
      {/* Banner de Boas-vindas à Biblioteca */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-premium rounded-[32px] p-6 mb-10 border border-white/5 relative overflow-hidden"
      >
        <LibraryBig size={60} className="absolute -right-4 -bottom-4 text-white/5 -rotate-12" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60">Santo Livro</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Explore a Palavra</h2>
          <p className="text-xs text-white/40 leading-relaxed max-w-[240px]">
            Selecione um livro para mergulhar nos ensinamentos sagrados e encontrar paz.
          </p>
        </div>
      </motion.div>

      <HorizontalRow 
        title="Destaques" 
        icon={<Star size={14} />} 
        items={popular} 
        onSelect={onSelect} 
        accent="gold" 
        colorClass="text-gold" 
      />

      <HorizontalRow 
        title="Antigo Testamento" 
        icon={<BookOpen size={14} />} 
        items={oldT} 
        onSelect={onSelect} 
        accent="gold" 
        colorClass="text-white/40" 
      />

      <HorizontalRow 
        title="Novo Testamento" 
        icon={<Sparkles size={14} />} 
        items={newT} 
        onSelect={onSelect} 
        accent="blue" 
        colorClass="text-blue-400" 
      />
    </div>
  );
};

export default BibleBookList;

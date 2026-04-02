import { useRef } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Flame,
  Star,
  Sparkles,
} from "lucide-react";
import type { BibleBookMeta } from "@/data/bible/types";

interface BibleBookListProps {
  books: BibleBookMeta[];
  onSelect: (book: BibleBookMeta) => void;
}

const popularBooks = ["gn", "sl", "pv", "mt", "jo", "rm", "ap"];
const quickAccessBooks = ["sl", "pv", "is", "mt", "jo", "rm", "fp", "tg"];

function SectionHeader({
  title,
  subtitle,
  icon,
  accentClass,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentClass: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3 px-1">
      <div className="min-w-0">
        <div className="mb-1.5 flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] ${accentClass}`}>
            {icon}
          </div>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${accentClass}`}>
            {title}
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground/40">{subtitle}</p>
      </div>

      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/6 bg-white/[0.03] text-muted-foreground/28">
        <ChevronRight size={13} />
      </div>
    </div>
  );
}

function BookCard({
  book,
  index,
  onSelect,
  badge,
  accent,
}: {
  book: BibleBookMeta;
  index: number;
  onSelect: (b: BibleBookMeta) => void;
  badge?: string;
  accent: "gold" | "blue";
}) {
  const accentStyles =
    accent === "gold"
      ? {
          badge:
            "text-gold/70 bg-gold/8 border-gold/10",
          title:
            "group-hover:text-gold-light",
          glow:
            "group-hover:shadow-[0_16px_30px_rgba(0,0,0,0.22),0_0_22px_hsl(43_74%_64%/0.05)]",
        }
      : {
          badge:
            "text-blue-calm bg-blue-400/8 border-blue-300/10",
          title:
            "group-hover:text-blue-ice",
          glow:
            "group-hover:shadow-[0_16px_30px_rgba(0,0,0,0.22),0_0_22px_hsl(216_86%_60%/0.05)]",
        };

  return (
    <motion.button
      key={book.id}
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(index * 0.035, 0.35), duration: 0.28 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(book)}
      className={`group bible-book-card snap-start relative w-[156px] flex-shrink-0 overflow-hidden rounded-[24px] p-4 text-left transition-all duration-300 ${accentStyles.glow}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.05),transparent_28%)] opacity-80" />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${accentStyles.badge}`}
          >
            {book.abbrev}
          </span>

          {badge && (
            <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/42">
              {badge}
            </span>
          )}
        </div>

        <p
          className={`min-h-[40px] text-[14px] font-medium leading-5 text-foreground/88 transition-colors duration-300 ${accentStyles.title}`}
        >
          {book.name}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground/38">
            {book.chapterCount} capítulos
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-muted-foreground/38 transition-colors duration-300 group-hover:text-foreground/72">
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function HorizontalRow({
  title,
  subtitle,
  icon,
  items,
  onSelect,
  accentClass,
  accent,
  badge,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: BibleBookMeta[];
  onSelect: (b: BibleBookMeta) => void;
  accentClass: string;
  accent: "gold" | "blue";
  badge?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        accentClass={accentClass}
      />

      <div
        ref={scrollRef}
        className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2"
      >
        {items.map((book, i) => (
          <BookCard
            key={book.id}
            book={book}
            index={i}
            onSelect={onSelect}
            badge={badge}
            accent={accent}
          />
        ))}
      </div>
    </section>
  );
}

const BibleBookList = ({ books, onSelect }: BibleBookListProps) => {
  const oldTestament = books.filter((b) => b.testament === "old");
  const newTestament = books.filter((b) => b.testament === "new");
  const popular = books.filter((b) => popularBooks.includes(b.id));
  const quickAccess = books.filter((b) => quickAccessBooks.includes(b.id));

  return (
    <div className="space-y-7 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[28px] px-5 py-4"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200 shadow-[0_0_18px_rgba(96,165,250,0.10)]">
            <Sparkles size={16} strokeWidth={1.8} />
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-blue-100/58">
              Leitura bíblica
            </p>
            <h2 className="mt-1 font-display text-[18px] font-semibold text-foreground/94">
              Escolha um livro para começar
            </h2>
            <p className="mt-1 text-[12px] leading-5 text-muted-foreground/48">
              Navegue por seções rápidas ou explore o Antigo e o Novo Testamento com mais calma.
            </p>
          </div>
        </div>
      </motion.div>

      <HorizontalRow
        title="Mais populares"
        subtitle="Livros mais procurados para leitura e reflexão"
        icon={<Star size={13} className="text-gold/70" />}
        items={popular}
        onSelect={onSelect}
        accentClass="text-gold/72"
        accent="gold"
        badge="destaque"
      />

      <HorizontalRow
        title="Acesso rápido"
        subtitle="Atalhos para livros muito usados no dia a dia"
        icon={<Flame size={13} className="text-blue-calm" />}
        items={quickAccess}
        onSelect={onSelect}
        accentClass="text-blue-calm"
        accent="blue"
        badge="rápido"
      />

      <HorizontalRow
        title="Antigo Testamento"
        subtitle="Lei, história, poesia e profetas"
        icon={<BookOpen size={13} className="text-gold/70" />}
        items={oldTestament}
        onSelect={onSelect}
        accentClass="text-gold/72"
        accent="gold"
      />

      <HorizontalRow
        title="Novo Testamento"
        subtitle="Evangelhos, cartas e revelação"
        icon={<BookOpen size={13} className="text-blue-calm" />}
        items={newTestament}
        onSelect={onSelect}
        accentClass="text-blue-calm"
        accent="blue"
      />
    </div>
  );
};

export default BibleBookList;
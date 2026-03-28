import { motion } from "framer-motion";
import { Search, Heart, Copy, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { useFavoriteVerses } from "@/hooks/useFavoriteVerses";

interface SearchResult {
  bookName: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleSearchResultsProps {
  query: string;
  results: SearchResult[];
  favoriteHook: ReturnType<typeof useFavoriteVerses>;
  onReflect: (verse: string) => void;
}

const BibleSearchResults = ({ query, results, favoriteHook, onReflect }: BibleSearchResultsProps) => {
  const { isFavorite, toggleFavorite } = favoriteHook;

  if (query.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Search size={32} className="text-muted-foreground/20 mb-3" />
        <p className="text-sm text-muted-foreground/50">
          Digite pelo menos 2 letras para buscar
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Search size={32} className="text-muted-foreground/20 mb-3" />
        <p className="text-sm text-muted-foreground/60">
          Nenhum resultado para "{query}"
        </p>
        <p className="text-xs text-muted-foreground/40 mt-1">
          Tente outra palavra ou expressão
        </p>
      </div>
    );
  }

  const handleCopy = async (r: SearchResult) => {
    const ref = `${r.bookName} ${r.chapter}:${r.verse}`;
    try {
      await navigator.clipboard.writeText(`"${r.text}" — ${ref}`);
      toast.success("Copiado! 📋");
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground/50 mb-3">
        {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
      </p>
      {results.map((r, i) => {
        const isFav = isFavorite(r.bookId, r.chapter, r.verse);
        return (
          <motion.div
            key={`${r.bookId}-${r.chapter}-${r.verse}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.25 }}
            className="glass-card rounded-xl p-3.5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gold/60">
                {r.bookName} {r.chapter}:{r.verse}
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => toggleFavorite({
                    bookId: r.bookId,
                    bookName: r.bookName,
                    chapter: r.chapter,
                    verse: r.verse,
                    text: r.text,
                  })}
                  className={`rounded-full p-1.5 transition-all ${
                    isFav ? "text-gold" : "text-muted-foreground/30 hover:text-gold/60"
                  }`}
                >
                  <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => handleCopy(r)}
                  className="rounded-full p-1.5 text-muted-foreground/30 hover:text-foreground/60 transition-all"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              {r.text}
            </p>
            <button
              onClick={() => onReflect(`Refletir sobre ${r.bookName} ${r.chapter}:${r.verse}: "${r.text}"`)}
              className="flex items-center gap-1.5 text-[11px] font-medium text-blue-calm/70 hover:text-blue-calm transition-colors"
            >
              <Sparkles size={11} />
              Refletir com IA
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BibleSearchResults;

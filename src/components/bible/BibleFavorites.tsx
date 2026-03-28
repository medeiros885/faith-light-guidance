import { motion } from "framer-motion";
import { Heart, Sparkles, Trash2 } from "lucide-react";
import type { useFavoriteVerses } from "@/hooks/useFavoriteVerses";

interface BibleFavoritesProps {
  favoriteHook: ReturnType<typeof useFavoriteVerses>;
  onReflect: (verse: string) => void;
}

const BibleFavorites = ({ favoriteHook, onReflect }: BibleFavoritesProps) => {
  const { favorites, toggleFavorite } = favoriteHook;

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Heart size={32} className="text-muted-foreground/20 mb-3" />
        <p className="text-sm text-muted-foreground/60">
          Nenhum versículo salvo ainda
        </p>
        <p className="text-xs text-muted-foreground/40 mt-1">
          Toque no ❤️ em qualquer versículo para salvar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground/50 mb-3">
        {favorites.length} versículo{favorites.length !== 1 ? "s" : ""} salvo{favorites.length !== 1 ? "s" : ""}
      </p>
      {favorites.map((fav, i) => (
        <motion.div
          key={`${fav.bookId}-${fav.chapter}-${fav.verse}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.25 }}
          className="glass-card rounded-xl p-3.5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gold/60">
              {fav.bookName} {fav.chapter}:{fav.verse}
            </span>
            <button
              onClick={() => toggleFavorite(fav)}
              className="rounded-full p-1.5 text-muted-foreground/30 hover:text-destructive/60 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {fav.text}
          </p>
          <button
            onClick={() => onReflect(`Refletir sobre ${fav.bookName} ${fav.chapter}:${fav.verse}: "${fav.text}"`)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-blue-calm/70 hover:text-blue-calm transition-colors"
          >
            <Sparkles size={11} />
            Refletir com IA
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default BibleFavorites;

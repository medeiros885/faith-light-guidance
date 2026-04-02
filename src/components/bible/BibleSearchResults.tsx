import { motion } from "framer-motion";
import {
  Search,
  Heart,
  Copy,
  Sparkles,
  Loader2,
  Quote,
  Wand2,
} from "lucide-react";
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
  isSearching: boolean;
  favoriteHook: ReturnType<typeof useFavoriteVerses>;
  onReflect: (verse: string) => void;
}

const BibleSearchResults = ({
  query,
  results,
  isSearching,
  favoriteHook,
  onReflect,
}: BibleSearchResultsProps) => {
  const { isFavorite, toggleFavorite } = favoriteHook;

  const handleCopy = async (r: SearchResult) => {
    const ref = `${r.bookName} ${r.chapter}:${r.verse}`;
    try {
      await navigator.clipboard.writeText(`"${r.text}" — ${ref}`);
      toast.success("Versículo copiado! 📋");
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  if (query.length < 2) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-muted-foreground/28 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
          <Search size={22} />
        </div>
        <p className="text-sm font-medium text-foreground/74">
          Comece sua busca na Palavra
        </p>
        <p className="mt-2 max-w-[260px] text-[12px] leading-5 text-muted-foreground/42">
          Digite pelo menos 2 letras para encontrar palavras, expressões ou referências bíblicas.
        </p>
      </motion.div>
    );
  }

  if (isSearching) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/10 bg-gold/8 text-gold/72 shadow-[0_0_18px_rgba(255,215,102,0.06)]">
          <Loader2 size={22} className="animate-spin" />
        </div>
        <p className="text-sm font-medium text-foreground/78">
          Buscando na Palavra...
        </p>
        <p className="mt-2 text-[12px] text-muted-foreground/42">
          Procurando resultados com cuidado e precisão
        </p>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-muted-foreground/28 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
          <Search size={22} />
        </div>
        <p className="text-sm font-medium text-foreground/76">
          Nenhum resultado para "{query}"
        </p>
        <p className="mt-2 max-w-[260px] text-[12px] leading-5 text-muted-foreground/42">
          Tente outra palavra, uma expressão diferente ou parte da referência bíblica.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3.5 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[24px] px-4 py-3.5"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200 shadow-[0_0_18px_rgba(96,165,250,0.10)]">
            <Search size={15} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100/58">
              Resultados da busca
            </p>
            <p className="mt-1 text-[13px] text-foreground/82">
              {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado
              {results.length !== 1 ? "s" : ""}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground/44">
              termo pesquisado: <span className="text-foreground/64">"{query}"</span>
            </p>
          </div>
        </div>
      </motion.div>

      {results.map((r, i) => {
        const isFav = isFavorite(r.bookId, r.chapter, r.verse);

        return (
          <motion.div
            key={`${r.bookId}-${r.chapter}-${r.verse}`}
            initial={{ opacity: 0, y: 8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: Math.min(i * 0.028, 0.3), duration: 0.26 }}
            className="glass-card rounded-[24px] p-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="rounded-full border border-gold/10 bg-gold/8 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold/72">
                    {r.bookName} {r.chapter}:{r.verse}
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/34">
                  resultado bíblico
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    toggleFavorite({
                      bookId: r.bookId,
                      bookName: r.bookName,
                      chapter: r.chapter,
                      verse: r.verse,
                      text: r.text,
                    })
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                    isFav
                      ? "border-gold/14 bg-gold/10 text-gold"
                      : "border-white/8 bg-white/[0.03] text-muted-foreground/34 hover:border-gold/12 hover:text-gold/68"
                  }`}
                  aria-label="Favoritar"
                >
                  <Heart size={15} fill={isFav ? "currentColor" : "none"} />
                </button>

                <button
                  onClick={() => handleCopy(r)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-muted-foreground/34 transition-all duration-200 hover:border-white/12 hover:text-foreground/72"
                  aria-label="Copiar"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>

            <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3.5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200">
                  <Quote size={12} strokeWidth={1.8} />
                </div>

                <p className="border-l-2 border-blue-300/22 pl-3 text-[13.5px] leading-6 text-foreground/82">
                  {r.text}
                </p>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                onClick={() =>
                  onReflect(`Refletir sobre ${r.bookName} ${r.chapter}:${r.verse}: "${r.text}"`)
                }
                className="flex items-center gap-2 rounded-full border border-blue-300/10 bg-[linear-gradient(145deg,rgba(96,165,250,0.12),rgba(96,165,250,0.06))] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-calm transition-all duration-200 hover:border-blue-300/16 hover:bg-[linear-gradient(145deg,rgba(96,165,250,0.16),rgba(96,165,250,0.08))]"
              >
                <Wand2 size={12} />
                Refletir com IA
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BibleSearchResults;
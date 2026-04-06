import { forwardRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";

interface SuggestionCardProps {
  text: string;
  index: number;
  onClick: (text: string) => void;
}

const SuggestionCard = forwardRef<HTMLButtonElement, SuggestionCardProps>(
  ({ text, index, onClick }, ref) => {
    return (
      <motion.button
        ref={ref}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.1 * index,
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1],
        }}
        whileTap={{ scale: 0.98, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
        onClick={() => onClick(text)}
        className="group relative w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left backdrop-blur-md transition-all duration-300 hover:border-gold/30 hover:bg-white/[0.04]"
      >
        {/* Glow sutil no fundo ao passar o mouse/toque */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,167,74,0.05),transparent_40%)] opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 flex items-center gap-4">
          {/* Ícone com Badge de Sugestão */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gold/10 bg-gold/5 text-gold shadow-sm transition-transform group-hover:scale-110">
            <MessageCircle size={18} strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold/50">
                Sugerido
              </span>
              <Sparkles size={10} className="text-gold/30 animate-pulse" />
            </div>

            <p className="text-[14px] font-medium leading-snug text-white/80 group-hover:text-white transition-colors">
              {text}
            </p>
          </div>

          {/* Seta de ação */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/20 group-hover:text-gold transition-all group-hover:bg-gold/10">
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </motion.button>
    );
  }
);

SuggestionCard.displayName = "SuggestionCard";

export default SuggestionCard;

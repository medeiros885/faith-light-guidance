import { forwardRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

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
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: 0.28 + index * 0.06,
          duration: 0.35,
          ease: "easeOut",
        }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onClick(text)}
        className="group relative w-full overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-4 py-3.5 text-left backdrop-blur-xl transition-all duration-300 hover:border-white/20"
      >
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(96,165,250,0.08),transparent_40%)]" />
        </div>

        <div className="relative z-10 flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200">
            <MessageCircle size={14} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/45">
              Sugestão
            </p>

            <p className="mt-0.5 text-[13.5px] leading-5 text-foreground/80 transition-colors duration-200 group-hover:text-foreground">
              {text}
            </p>
          </div>
        </div>
      </motion.button>
    );
  }
);

SuggestionCard.displayName = "SuggestionCard";

export default SuggestionCard;
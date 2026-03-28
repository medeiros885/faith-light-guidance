import { forwardRef } from "react";
import { motion } from "framer-motion";

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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onClick(text)}
        className="w-full glass-card rounded-xl px-4 py-3 text-left text-sm text-foreground/80 transition-all hover:border-gold/30 hover:glow-gold active:scale-[0.97]"
      >
        {text}
      </motion.button>
    );
  }
);

SuggestionCard.displayName = "SuggestionCard";

export default SuggestionCard;

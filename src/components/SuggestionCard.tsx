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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.45, ease: "easeOut" }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onClick(text)}
        className="w-full glass-card rounded-xl px-4 py-3.5 text-left text-sm text-foreground/75 transition-all duration-300 hover:text-foreground/90 hover:border-gold/20 hover:glow-gold"
      >
        {text}
      </motion.button>
    );
  }
);

SuggestionCard.displayName = "SuggestionCard";

export default SuggestionCard;

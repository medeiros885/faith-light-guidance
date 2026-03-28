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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.08, duration: 0.4, ease: "easeOut" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(text)}
        className="w-full glass-card rounded-xl px-4 py-3 text-left text-[13px] text-foreground/65 transition-all duration-300 hover:text-foreground/80 hover:border-border/50"
      >
        {text}
      </motion.button>
    );
  }
);

SuggestionCard.displayName = "SuggestionCard";

export default SuggestionCard;

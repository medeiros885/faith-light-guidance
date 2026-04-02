import { motion } from "framer-motion";

export type UserEmotion =
  | "triste"
  | "ansioso"
  | "cansado"
  | "confuso"
  | "em_paz"
  | null;

interface EmotionSelectorProps {
  onSelect: (emotion: UserEmotion) => void;
  selected: UserEmotion;
}

const emotions: {
  id: UserEmotion;
  emoji: string;
  label: string;
  accent: string;
}[] = [
  { id: "triste", emoji: "😔", label: "Triste", accent: "emotion-card-sadness" },
  { id: "ansioso", emoji: "😰", label: "Ansioso", accent: "emotion-card-anxiety" },
  { id: "cansado", emoji: "😞", label: "Cansado", accent: "emotion-card-sadness" },
  { id: "confuso", emoji: "😐", label: "Confuso", accent: "emotion-card-fear" },
  { id: "em_paz", emoji: "🙂", label: "Em paz", accent: "emotion-card-anxiety" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const EmotionSelector = ({ onSelect, selected }: EmotionSelectorProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap justify-center gap-3"
    >
      {emotions.map((e) => {
        const isActive = selected === e.id;

        return (
          <motion.button
            key={e.id}
            variants={item}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect(e.id)}
            className={`
              relative flex flex-col items-center gap-2
              rounded-2xl px-4 py-3.5
              transition-all duration-300
              border
              ${isActive
                ? "border-gold/30 bg-[hsl(var(--gold)/0.08)] shadow-[0_0_20px_hsl(var(--gold)/0.08)]"
                : "border-border/15 bg-[hsl(var(--navy-light)/0.45)] hover:bg-[hsl(var(--navy-light)/0.65)] hover:border-border/30"}
              ${e.accent}
            `}
          >
            {/* Glow background when selected */}
            {isActive && (
              <div className="absolute inset-0 rounded-2xl pointer-events-none bg-[radial-gradient(circle,rgba(255,215,102,0.12),transparent_70%)]" />
            )}

            {/* Emoji */}
            <span className="text-[22px] leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
              {e.emoji}
            </span>

            {/* Label */}
            <span
              className={`
                text-[11px] font-medium tracking-[0.02em]
                transition-all duration-200
                ${isActive
                  ? "text-gold-light"
                  : "text-foreground/65 group-hover:text-foreground"}
              `}
            >
              {e.label}
            </span>

            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="emotion-indicator"
                className="absolute -bottom-1 h-1.5 w-6 rounded-full bg-gold"
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default EmotionSelector;
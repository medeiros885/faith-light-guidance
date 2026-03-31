import { motion } from "framer-motion";

export type UserEmotion = "triste" | "ansioso" | "cansado" | "confuso" | "em_paz" | null;

interface EmotionSelectorProps {
  onSelect: (emotion: UserEmotion) => void;
  selected: UserEmotion;
}

const emotions: { id: UserEmotion; emoji: string; label: string }[] = [
  { id: "triste", emoji: "😔", label: "Triste" },
  { id: "ansioso", emoji: "😰", label: "Ansioso" },
  { id: "cansado", emoji: "😞", label: "Cansado" },
  { id: "confuso", emoji: "😐", label: "Confuso" },
  { id: "em_paz", emoji: "🙂", label: "Em paz" },
];

const EmotionSelector = ({ onSelect, selected }: EmotionSelectorProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.25, duration: 0.5 }}
    className="flex justify-center gap-3 flex-wrap"
  >
    {emotions.map((e, i) => (
      <motion.button
        key={e.id}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSelect(e.id)}
        className={`flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 transition-all duration-300 border ${
          selected === e.id
            ? "border-gold/30 bg-[hsl(var(--gold)/0.08)] shadow-[0_0_16px_hsl(var(--gold)/0.06)]"
            : "border-border/15 bg-[hsl(var(--navy-light)/0.4)] hover:border-border/30 hover:bg-[hsl(var(--navy-light)/0.6)]"
        }`}
      >
        <span className="text-xl leading-none">{e.emoji}</span>
        <span className="text-[10px] font-medium text-foreground/60">{e.label}</span>
      </motion.button>
    ))}
  </motion.div>
);

export default EmotionSelector;

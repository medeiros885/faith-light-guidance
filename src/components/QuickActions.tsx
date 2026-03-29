import { motion } from "framer-motion";

interface QuickActionsProps {
  onAction: (text: string) => void;
}

const actions = [
  { emoji: "🙏", label: "Quero uma oração" },
  { emoji: "📖", label: "Me mostra um versículo" },
  { emoji: "💬", label: "Preciso conversar" },
];

const QuickActions = ({ onAction }: QuickActionsProps) => (
  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
    {actions.map((a, i) => (
      <motion.button
        key={a.label}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onAction(a.label)}
        className="flex-shrink-0 rounded-full glass-card px-3.5 py-2 text-[11px] font-medium text-foreground/65 transition-all duration-200 hover:text-foreground/80 hover:border-border/40"
      >
        <span className="mr-1.5">{a.emoji}</span>
        {a.label}
      </motion.button>
    ))}
  </div>
);

export default QuickActions;

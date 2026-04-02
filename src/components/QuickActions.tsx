import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface QuickActionsProps {
  onAction: (text: string) => void;
}

const actions = [
  {
    emoji: "🙏",
    label: "Quero uma oração",
    sub: "oração guiada",
  },
  {
    emoji: "📖",
    label: "Me mostra um versículo",
    sub: "palavra para hoje",
  },
  {
    emoji: "💬",
    label: "Preciso conversar",
    sub: "apoio e direção",
  },
];

const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200">
          <Sparkles size={13} strokeWidth={1.8} />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100/58">
          Atalhos rápidos
        </p>
      </div>

      <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {actions.map((a, i) => (
          <motion.button
            key={a.label}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.12 + i * 0.05, duration: 0.28 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAction(a.label)}
            className="glass-card group min-w-[170px] flex-shrink-0 rounded-[22px] px-4 py-3.5 text-left transition-all duration-250 hover:border-white/14"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[20px] leading-none">{a.emoji}</span>
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/36">
                rápido
              </span>
            </div>

            <p className="text-[12.5px] font-medium leading-5 text-foreground/82 transition-colors duration-200 group-hover:text-foreground/96">
              {a.label}
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/36">
              {a.sub}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  count: number;
}

const encouragements = [
  "Você está buscando a Deus hoje 💙",
  "Continue assim 🙏",
  "Deus se alegra com sua busca ✨",
];

const StreakBadge = ({ count }: StreakBadgeProps) => {
  if (count < 1) return null;

  const msg = encouragements[count % encouragements.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="flex flex-col items-center gap-1"
    >
      <div className="flex items-center gap-1.5 rounded-full bg-[hsl(var(--gold)/0.08)] border border-gold/15 px-3.5 py-1.5">
        <Flame size={14} className="text-gold" />
        <span className="text-[11px] font-semibold text-gold-light">
          Sequência: {count} {count === 1 ? "dia" : "dias"} com Deus
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground/50 italic">{msg}</span>
    </motion.div>
  );
};

export default StreakBadge;

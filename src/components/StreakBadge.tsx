import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  count: number;
}

function getMessage(count: number): string {
  if (count >= 30) return "Isso já virou estilo de vida 🔥";
  if (count >= 14) return "Sua constância está linda 🙏";
  if (count >= 7) return "Você está criando um hábito forte ✨";
  if (count >= 3) return "Continue assim, isso importa 💙";

  const base = [
    "Você está buscando a Deus hoje 💙",
    "Continue assim 🙏",
    "Deus se alegra com sua busca ✨",
  ];

  return base[count % base.length];
}

const StreakBadge = ({ count }: StreakBadgeProps) => {
  if (count < 1) return null;

  const msg = getMessage(count);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.42 }}
      className="flex flex-col items-center gap-2"
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0px rgba(255,215,102,0)",
            "0 0 28px rgba(255,215,102,0.22)",
            "0 0 0px rgba(255,215,102,0)",
          ],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex items-center gap-2.5 rounded-full border border-gold/20 bg-[linear-gradient(145deg,rgba(255,215,102,0.14),rgba(255,215,102,0.05))] px-4 py-2 backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,215,102,0.22),transparent_70%)] opacity-30" />

        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            rotate: [0, 6, -6, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <Flame size={15} className="text-gold drop-shadow-[0_0_6px_rgba(255,215,102,0.6)]" />
        </motion.div>

        <span className="relative z-10 text-[11.5px] font-semibold text-gold-light tracking-[0.02em]">
          {count} {count === 1 ? "dia" : "dias"} com Deus
        </span>
      </motion.div>

      <motion.span
        key={msg}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-[10.5px] text-muted-foreground/60 italic text-center"
      >
        {msg}
      </motion.span>
    </motion.div>
  );
};

export default StreakBadge;
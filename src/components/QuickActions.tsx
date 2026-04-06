import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface QuickActionsProps {
  onAction: (text: string) => void;
}

const actions = [
  {
    emoji: "🙏",
    label: "Quero uma oração",
    sub: "oração guiada agora",
    color: "from-yellow-400/20 to-yellow-200/5",
    glow: "rgba(255,215,102,0.16)",
  },
  {
    emoji: "📖",
    label: "Me mostra um versículo",
    sub: "palavra pra hoje",
    color: "from-blue-400/20 to-blue-200/5",
    glow: "rgba(96,165,250,0.16)",
  },
  {
    emoji: "💬",
    label: "Preciso conversar",
    sub: "apoio e direção",
    color: "from-pink-400/20 to-pink-200/5",
    glow: "rgba(244,114,182,0.14)",
  },
];

const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-2 px-1">
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200 shadow-[0_0_18px_rgba(96,165,250,0.08)]">
          <Sparkles size={13} strokeWidth={1.8} />
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/10 opacity-20" />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100/58">
          Atalhos rápidos
        </p>
      </div>

      <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {actions.map((a, i) => (
          <motion.button
            key={a.label}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.12 + i * 0.06,
              duration: 0.35,
              ease: "easeOut",
            }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
            onClick={() => onAction(a.label)}
            className="group relative min-w-[190px] flex-shrink-0 overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] px-4 py-4 text-left shadow-[0_12px_28px_rgba(0,0,0,0.20)] backdrop-blur-2xl transition-all duration-300 hover:border-white/18"
            style={{
              boxShadow: `0 12px 28px rgba(0,0,0,0.20), 0 0 0 ${a.glow}`,
            }}
          >
            <div
              className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br ${a.color}`}
            />

            <div className="pointer-events-none absolute inset-0 rounded-[26px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />

            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="absolute -inset-2 blur-2xl bg-white/[0.04]" />
            </div>

            <div className="relative z-10">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[23px] leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.22)]">
                  {a.emoji}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/40">
                  toque
                </span>
              </div>

              <p className="min-h-[40px] text-[13px] font-medium leading-5 text-foreground/86 transition-all duration-200 group-hover:text-foreground">
                {a.label}
              </p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/40">
                  {a.sub}
                </p>

                <ArrowRight
                  size={13}
                  className="text-foreground/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-foreground/70"
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileTap={{ opacity: 1 }}
              className="absolute inset-0 bg-white/[0.06]"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
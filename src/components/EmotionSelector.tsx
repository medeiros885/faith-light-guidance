import { motion, AnimatePresence } from "framer-motion";

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
  id: Exclude<UserEmotion, null>;
  emoji: string;
  label: string;
  color: string;
}[] = [
  { id: "triste", emoji: "😔", label: "Triste", color: "from-blue-500/20" },
  { id: "ansioso", emoji: "😰", label: "Ansioso", color: "from-cyan-400/20" },
  { id: "cansado", emoji: "😞", label: "Cansado", color: "from-orange-400/20" },
  { id: "confuso", emoji: "😐", label: "Confuso", color: "from-purple-400/20" },
  { id: "em_paz", emoji: "🙂", label: "Em paz", color: "from-emerald-400/20" },
];

const EmotionSelector = ({ onSelect, selected }: EmotionSelectorProps) => {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 pl-1">
        Como está seu coração?
      </p>

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 mask-linear-edge">
        {emotions.map((emotion) => {
          const isActive = selected === emotion.id;

          return (
            <motion.button
              key={emotion.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(isActive ? null : emotion.id)}
              className={`relative flex min-w-[100px] flex-col items-center gap-3 rounded-[24px] border py-4 transition-all duration-500 ${
                isActive
                  ? "border-gold/40 bg-gold/5 shadow-[0_10px_20px_rgba(217,167,74,0.1)]"
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
              }`}
            >
              {/* Efeito de brilho de fundo para o item ativo */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`absolute inset-0 bg-gradient-to-b ${emotion.color} to-transparent rounded-[24px] pointer-events-none`}
                  />
                )}
              </AnimatePresence>

              <span className={`relative z-10 text-2xl transition-transform duration-300 ${isActive ? 'scale-125' : 'grayscale-[0.5]'}`}>
                {emotion.emoji}
              </span>

              <span className={`relative z-10 text-[11px] font-bold tracking-wide transition-colors ${isActive ? 'text-gold' : 'text-white/40'}`}>
                {emotion.label}
              </span>

              {/* Indicador de Seleção Magnético */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute -bottom-[1px] h-1 w-8 rounded-full bg-gold shadow-[0_0_10px_rgba(217,167,74,0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionSelector;

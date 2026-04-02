import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Wind } from "lucide-react";

interface GuidedCalmProps {
  onClose: () => void;
}

const steps = [
  "Respire fundo... Deus está com você.",
  "Inspire lentamente pelo nariz...",
  "Segure um pouco...",
  "Expire devagar...",
  "Você não está sozinho 💙",
];

const GuidedCalm = ({ onClose }: GuidedCalmProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-2xl px-6"
    >
      {/* conteúdo */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm rounded-3xl border border-white/10 
                   bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] 
                   p-7 text-center backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
      >
        {/* glow */}
        <div className="pointer-events-none absolute inset-0 
                        bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.08),transparent_60%)]" />

        {/* fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground/40 hover:text-foreground/70 transition"
        >
          <X size={18} />
        </button>

        {/* ícone */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full 
                          border border-blue-300/15 bg-blue-400/10 text-blue-200 
                          shadow-[0_0_30px_rgba(96,165,250,0.18)]">
            <Wind size={22} />
          </div>
        </div>

        {/* título */}
        <h2 className="font-display text-lg font-semibold text-foreground/90 mb-2">
          Vamos acalmar juntos
        </h2>

        {/* animação respiração */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mx-auto my-6 h-20 w-20 rounded-full 
                     bg-[radial-gradient(circle,rgba(96,165,250,0.25),transparent_70%)] 
                     blur-[2px]"
        />

        {/* texto dinâmico */}
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-foreground/75 leading-relaxed"
          >
            {steps[stepIndex]}
          </motion.p>
        </AnimatePresence>

        {/* reforço emocional */}
        <div className="mt-6 flex items-center justify-center gap-2 text-blue-calm/70 text-[12px]">
          <Heart size={12} />
          Deus está cuidando de você
        </div>

        {/* botão */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-[hsl(var(--blue-soft)/0.12)] 
                     py-3 text-sm font-medium text-blue-calm 
                     hover:bg-[hsl(var(--blue-soft)/0.18)] transition-all"
        >
          Continuar
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default GuidedCalm;
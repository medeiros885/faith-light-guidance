import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Wind, Sparkles } from "lucide-react";

interface GuidedCalmProps {
  onClose: () => void;
}

const steps = [
  "Respire fundo... Deus está com você.",
  "Inspire lentamente pelo nariz...",
  "Segure por um instante...",
  "Expire devagar...",
  "Seu coração pode descansar agora. 💙",
];

const STEP_DURATION = 3200;

const GuidedCalm = ({ onClose }: GuidedCalmProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, STEP_DURATION);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/92 px-6 backdrop-blur-2xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] p-7 text-center shadow-[0_24px_70px_rgba(0,0,0,0.46)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.14),transparent_38%),radial-gradient(circle_at_bottom,rgba(255,215,102,0.08),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 rounded-[32px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar pausa guiada"
          className="absolute right-4 top-4 z-10 rounded-full border border-white/8 bg-white/[0.03] p-2 text-muted-foreground/42 transition-all duration-200 hover:border-white/14 hover:bg-white/[0.05] hover:text-foreground/72"
        >
          <X size={16} />
        </button>

        <div className="relative z-10">
          <div className="mb-5 flex justify-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-blue-300/15 bg-blue-400/10 text-blue-200 shadow-[0_0_30px_rgba(96,165,250,0.18)]">
              <Wind size={22} />

              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.18, 0.32, 0.18] }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border border-blue-300/12"
              />
            </div>
          </div>

          <div className="mb-2 flex items-center justify-center gap-2">
            <Sparkles size={13} className="text-blue-200/80" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-100/50">
              Pausa guiada
            </span>
          </div>

          <h2 className="mb-2 font-display text-[20px] font-semibold text-foreground/92">
            Vamos acalmar juntos
          </h2>

          <p className="mx-auto max-w-[260px] text-[12.5px] leading-6 text-muted-foreground/56">
            Não precisa resolver tudo agora. Só respira comigo por um instante.
          </p>

          <div className="relative my-7 flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.24, 1], opacity: [0.22, 0.36, 0.22] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.22),transparent_70%)] blur-[3px]"
            />

            <motion.div
              animate={{ scale: [0.96, 1.08, 0.96] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-blue-300/14 bg-[linear-gradient(180deg,rgba(96,165,250,0.14),rgba(96,165,250,0.05))] shadow-[0_0_28px_rgba(96,165,250,0.10)]"
            >
              <Heart size={20} className="text-blue-calm/78" />
            </motion.div>
          </div>

          <div className="mx-auto mb-5 flex max-w-[220px] items-center gap-2">
            {steps.map((_, index) => {
              const isActive = index === stepIndex;
              const isDone = index < stepIndex;

              return (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-blue-calm shadow-[0_0_12px_rgba(96,165,250,0.35)]"
                      : isDone
                      ? "bg-gold/70"
                      : "bg-white/10"
                  }`}
                />
              );
            })}
          </div>

          <div className="mb-2 flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === stepIndex
                    ? "bg-blue-calm shadow-[0_0_12px_rgba(96,165,250,0.35)]"
                    : index < stepIndex
                    ? "bg-gold/70"
                    : "bg-white/12"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="min-h-[56px] text-sm leading-7 text-foreground/78"
            >
              {steps[stepIndex]}
            </motion.p>
          </AnimatePresence>

          <motion.div
            key={stepIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: STEP_DURATION / 1000, ease: "linear" }}
            className="mx-auto mt-2 h-[3px] max-w-[220px] rounded-full bg-[linear-gradient(90deg,rgba(96,165,250,0.9),rgba(255,215,102,0.75))]"
          />

          <div className="mt-5 flex items-center justify-center gap-2 text-[12px] text-blue-calm/72">
            <Heart size={12} />
            Deus está cuidando de você
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -1 }}
            onClick={onClose}
            className="mt-6 w-full rounded-full border border-blue-300/10 bg-[linear-gradient(145deg,rgba(96,165,250,0.14),rgba(96,165,250,0.06))] py-3 text-sm font-medium text-blue-calm transition-all duration-250 hover:border-blue-300/18 hover:bg-[linear-gradient(145deg,rgba(96,165,250,0.18),rgba(96,165,250,0.08))]"
          >
            Continuar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GuidedCalm;
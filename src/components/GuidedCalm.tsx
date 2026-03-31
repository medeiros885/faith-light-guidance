import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wind } from "lucide-react";

interface GuidedCalmProps {
  onClose: () => void;
}

const breathingSteps = [
  { label: "Inspire…", duration: 4000 },
  { label: "Segure…", duration: 4000 },
  { label: "Expire…", duration: 4000 },
];

const GuidedCalm = ({ onClose }: GuidedCalmProps) => {
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [started, setStarted] = useState(false);
  const maxCycles = 3;

  const startBreathing = () => {
    setStarted(true);
    setStep(0);
    setCycle(0);
    runStep(0, 0);
  };

  const runStep = (s: number, c: number) => {
    if (c >= maxCycles) {
      setStarted(false);
      return;
    }
    setStep(s);
    setCycle(c);
    const next = (s + 1) % breathingSteps.length;
    const nextCycle = next === 0 ? c + 1 : c;
    setTimeout(() => runStep(next, nextCycle), breathingSteps[s].duration);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl px-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm text-center space-y-8"
      >
        <button
          onClick={onClose}
          className="absolute -top-2 right-0 rounded-full p-2 text-muted-foreground/40 hover:text-foreground/60 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="space-y-3">
          <Wind size={28} className="mx-auto text-blue-calm/60" />
          <h3 className="font-display text-lg font-semibold text-foreground/90">
            Vamos respirar juntos
          </h3>
          <p className="text-sm text-muted-foreground/60 leading-relaxed">
            Uma técnica simples pra acalmar o coração.
          </p>
        </div>

        {!started ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startBreathing}
            className="mx-auto flex items-center gap-2 rounded-full bg-[hsl(var(--blue-soft)/0.12)] px-6 py-3 text-sm font-medium text-blue-calm transition-all hover:bg-[hsl(var(--blue-soft)/0.18)]"
          >
            Começar
          </motion.button>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {/* Breathing circle */}
            <motion.div
              animate={{
                scale: step === 0 ? 1.3 : step === 1 ? 1.3 : 1,
                opacity: step === 2 ? 0.4 : 0.7,
              }}
              transition={{ duration: breathingSteps[step].duration / 1000, ease: "easeInOut" }}
              className="h-28 w-28 rounded-full border-2 border-blue-calm/20 bg-[hsl(var(--blue-soft)/0.08)] flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={step}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-display text-base text-blue-calm/80"
                >
                  {breathingSteps[step].label}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <p className="text-[11px] text-muted-foreground/40">
              Ciclo {Math.min(cycle + 1, maxCycles)} de {maxCycles}
            </p>
          </div>
        )}

        {!started && cycle > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-foreground/70 italic"
          >
            Melhor agora? Deus está cuidando de você. 💙
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GuidedCalm;

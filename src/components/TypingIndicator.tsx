import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const loadingPhrases = [
  "Estou te ouvindo...",
  "Buscando direção na Palavra...",
  "Preparando uma resposta com carinho...",
  "Meditando nas Escrituras...",
  "Buscando conforto pra você...",
];

const TypingIndicator = () => {
  const [phraseIndex, setPhraseIndex] = useState(
    Math.floor(Math.random() * loadingPhrases.length)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex flex-col items-start gap-2 py-2.5"
    >
      <div className="max-w-[86%]">
        <div className="mb-2 flex items-center gap-2 pl-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200 shadow-[0_0_18px_rgba(96,165,250,0.10)]">
            <Sparkles size={13} strokeWidth={1.8} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/55">
            Caminho Vivo
          </span>
        </div>

        <motion.div
          className="assistant-bubble relative overflow-hidden rounded-2xl rounded-tl-sm px-5 py-4"
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.06),transparent_35%)]" />

          <div className="relative flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-[hsl(var(--blue-calm))]"
                animate={{
                  y: [0, -4, 0],
                  opacity: [0.28, 0.72, 0.28],
                  scale: [0.92, 1.08, 0.92],
                }}
                transition={{
                  duration: 1.25,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="pl-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={phraseIndex}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.25 }}
            className="text-[10px] italic text-muted-foreground/52"
          >
            {loadingPhrases[phraseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
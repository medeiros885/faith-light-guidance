import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex flex-col items-start gap-2 py-2"
    >
      <div className="assistant-bubble rounded-2xl rounded-tl-sm px-5 py-3.5">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--blue-calm))]"
              animate={{ y: [0, -3, 0], opacity: [0.25, 0.6, 0.25] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
      <motion.p
        key={phraseIndex}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-[10px] italic text-muted-foreground/55 pl-1"
      >
        {loadingPhrases[phraseIndex]}
      </motion.p>
    </motion.div>
  );
};

export default TypingIndicator;

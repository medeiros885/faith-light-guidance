import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const loadingPhrases = [
  "Ouvindo seu coração com atenção...",
  "Buscando consolo nas Escrituras...",
  "Preparando uma palavra de esperança...",
  "Meditando no que a Palavra diz sobre isso...",
  "Organizando uma resposta pastoral para você...",
  "Buscando a sabedoria do Alto...",
];

const TypingIndicator = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 3000); // Um pouco mais lento para dar tempo de leitura

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-start gap-3 py-4 max-w-[90%]"
    >
      {/* Badge do Assistente */}
      <div className="flex items-center gap-2.5 px-1">
        <div className="relative">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 border border-gold/20 text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Sparkles size={13} />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gold/30 blur-md"
          />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
          Caminho Vivo
        </span>
      </div>

      {/* Bolha de Digitação */}
      <div className="relative overflow-hidden rounded-[24px] rounded-tl-sm glass-premium px-6 py-4 border border-white/5 shadow-2xl">
        {/* Shimmer Effect */}
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
        />

        <div className="relative flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-gold"
              animate={{ 
                y: [0, -4, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.1, 0.8]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut" 
              }}
            />
          ))}
        </div>
      </div>

      {/* Frases Variáveis */}
      <div className="px-1 min-h-[14px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={phraseIndex}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-medium italic text-white/30 flex items-center gap-2"
          >
            <span className="w-1 h-1 rounded-full bg-white/20" />
            {loadingPhrases[phraseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;

import { motion } from "framer-motion";

const loadingPhrases = [
  "Buscando direção na Palavra...",
  "Meditando nas Escrituras...",
  "Preparando uma palavra para você...",
  "Buscando conforto na Bíblia...",
];

const TypingIndicator = () => {
  const phrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="flex flex-col items-start gap-2 py-2"
    >
      <div className="glass-card rounded-2xl rounded-tl-sm px-5 py-3.5">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-blue-calm"
              animate={{ y: [0, -5, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[11px] italic text-muted-foreground pl-1"
      >
        {phrase}
      </motion.p>
    </motion.div>
  );
};

export default TypingIndicator;

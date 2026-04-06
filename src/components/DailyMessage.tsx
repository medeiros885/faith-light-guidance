import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { useMemo } from "react";

const messages = [
  "Deus tem algo especial pra te dizer hoje.",
  "Cada dia é uma nova chance de ouvir a voz de Deus.",
  "Você foi feito(a) pra caminhar com Ele.",
  "Sua busca por Deus nunca é em vão.",
  "Hoje é um bom dia pra confiar mais.",
  "A Palavra de Deus é viva — e fala com você agora.",
  "Não importa como você se sente, Deus está presente.",
  "Mesmo em silêncio, Deus continua trabalhando.",
  "Seu coração não está fora do alcance de Deus.",
];

const DailyMessage = () => {
  const message = useMemo(() => {
    const dayOfYear = Math.floor(new Date().getTime() / 86400000);
    return messages[dayOfYear % messages.length];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="glass-premium group relative w-full overflow-hidden rounded-[24px] p-5 shadow-2xl"
    >
      {/* Background Glow Ethereal */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gold/5 blur-[50px] group-hover:bg-gold/10 transition-colors duration-700" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 blur-[50px]" />
      </div>

      <div className="relative z-10 flex items-center gap-4">
        {/* Ícone Animado */}
        <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/10 text-gold shadow-inner">
          <motion.div
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={20} />
          </motion.div>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light/60">
              Palavra de Ânimo
            </span>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart size={10} className="text-gold fill-gold/20" />
            </motion.div>
          </div>

          <p className="text-[14px] font-medium leading-relaxed text-white/90 italic">
            "{message}"
          </p>
        </div>
      </div>

      {/* Linha de brilho inferior sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-50" />
    </motion.div>
  );
};

export default DailyMessage;

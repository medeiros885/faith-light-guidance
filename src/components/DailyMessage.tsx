import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const messages = [
  "Deus tem algo especial pra te dizer hoje.",
  "Cada dia é uma nova chance de ouvir a voz de Deus.",
  "Você foi feito(a) pra caminhar com Ele.",
  "Sua busca por Deus nunca é em vão.",
  "Hoje é um bom dia pra confiar mais.",
  "A Palavra de Deus é viva — e fala com você agora.",
  "Não importa como você se sente, Deus está presente.",
];

function getDailyMessage() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return messages[dayOfYear % messages.length];
}

const DailyMessage = () => {
  const message = getDailyMessage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.34, duration: 0.42 }}
      className="glass-card w-full rounded-[24px] px-4 py-4"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200 shadow-[0_0_18px_rgba(96,165,250,0.10)]">
          <Sparkles size={15} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100/58">
            Mensagem de hoje
          </p>
          <p className="mt-1 text-[13px] italic leading-6 text-foreground/78">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyMessage;
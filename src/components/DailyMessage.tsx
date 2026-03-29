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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="flex items-center gap-2.5 rounded-xl bg-[hsl(var(--blue-soft)/0.06)] border border-[hsl(var(--blue-soft)/0.1)] px-4 py-3"
    >
      <Sparkles size={14} className="flex-shrink-0 text-blue-calm" />
      <p className="text-[12px] leading-relaxed text-foreground/65 italic">
        {message}
      </p>
    </motion.div>
  );
};

export default DailyMessage;

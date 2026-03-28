import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Heart, BookMarked, HandHelping } from "lucide-react";
import type { BibleResponse } from "@/data/mockResponses";

interface ResponseViewProps {
  response: BibleResponse;
  question: string;
}

const sections = [
  { key: "contexto", icon: BookOpen, title: "Contexto Bíblico" },
  { key: "explicacao", icon: Lightbulb, title: "Explicação Simples" },
  { key: "aplicacao", icon: Heart, title: "Aplicação Prática" },
] as const;

const ResponseView = ({ response, question }: ResponseViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 pb-4"
    >
      {/* User question bubble */}
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gold/20 px-4 py-3 text-sm text-foreground">
          {question}
        </div>
      </div>

      {/* Sections */}
      {sections.map(({ key, icon: Icon, title }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.15 }}
          className="glass-card rounded-2xl p-4"
        >
          <div className="mb-2 flex items-center gap-2 text-gold">
            <Icon size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/85">
            {response[key]}
          </p>
        </motion.div>
      ))}

      {/* Versículos */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="glass-card rounded-2xl p-4"
      >
        <div className="mb-2 flex items-center gap-2 text-gold">
          <BookMarked size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Versículos Relacionados</span>
        </div>
        <div className="space-y-2">
          {response.versiculos.map((v, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/85 border-l-2 border-gold/30 pl-3">
              {v}
            </p>
          ))}
        </div>
      </motion.div>

      {/* Oração */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card rounded-2xl p-4 border-gold/20"
      >
        <div className="mb-2 flex items-center gap-2 text-gold">
          <HandHelping size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Oração</span>
        </div>
        <p className="text-sm italic leading-relaxed text-foreground/80">
          {response.oracao}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ResponseView;

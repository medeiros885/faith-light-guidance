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
      className="space-y-3 pb-4"
    >
      {/* User question bubble */}
      <div className="flex justify-end">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-[80%] rounded-2xl rounded-tr-sm user-bubble px-4 py-3 text-sm text-foreground/90 leading-relaxed"
        >
          {question}
        </motion.div>
      </div>

      {/* Sections */}
      {sections.map(({ key, icon: Icon, title }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.12, ease: "easeOut" }}
          className="glass-card rounded-2xl rounded-tl-sm p-4"
        >
          <div className="mb-2 flex items-center gap-2 text-gold-light">
            <Icon size={15} strokeWidth={1.8} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">{title}</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {response[key]}
          </p>
        </motion.div>
      ))}

      {/* Versículos */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, ease: "easeOut" }}
        className="glass-card rounded-2xl rounded-tl-sm p-4"
      >
        <div className="mb-3 flex items-center gap-2 text-gold-light">
          <BookMarked size={15} strokeWidth={1.8} />
          <span className="text-[11px] font-semibold uppercase tracking-widest">Versículos Relacionados</span>
        </div>
        <div className="space-y-2.5">
          {response.versiculos.map((v, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/80 border-l-2 border-gold/20 pl-3">
              {v}
            </p>
          ))}
        </div>
      </motion.div>

      {/* Oração */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, ease: "easeOut" }}
        className="glass-card rounded-2xl rounded-tl-sm p-4 border-gold/15"
      >
        <div className="mb-2 flex items-center gap-2 text-gold-light">
          <HandHelping size={15} strokeWidth={1.8} />
          <span className="text-[11px] font-semibold uppercase tracking-widest">Oração</span>
        </div>
        <p className="text-sm italic leading-relaxed text-foreground/75">
          {response.oracao}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ResponseView;
